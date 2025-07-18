import { _, loc, createCallout } from '@okta/courage';
import { FORMS as RemediationForms } from '../../ion/RemediationConstants';
import { BaseForm, BaseView, createIdpButtons, createCustomButtons } from '../internals';
import CryptoUtil from '../../../util/CryptoUtil';
import DeviceFingerprinting from '../utils/DeviceFingerprinting';
import IdentifierFooter from '../components/IdentifierFooter';
import Link from '../components/Link';
import signInWithIdps from './signin/SignInWithIdps';
import customButtonsView from './signin/CustomButtons';
import signInWithDeviceOption from './signin/SignInWithDeviceOption';
import signInWithWebAuthn from './signin/SignInWithWebAuthn';
import { isCustomizedI18nKey, getMessageFromBrowserError } from '../../ion/i18nTransformer';
import { getForgotPasswordLink } from '../utils/LinksUtil';
import CookieUtil from 'util/CookieUtil';
import CustomAccessDeniedErrorMessage from './shared/CustomAccessDeniedErrorMessage';
import Util from 'util/Util';
import webauthn from '../../../util/webauthn';

const CUSTOM_ACCESS_DENIED_KEY = 'security.access_denied_custom_message';


const Body = BaseForm.extend({

  title() {
    return loc('primaryauth.title', 'login');
  },

  save() {
    return loc('oform.next', 'login');
  },

  initialize() {
    BaseForm.prototype.initialize.apply(this, arguments);

    const uiSchema = this.getUISchema();
    if (uiSchema.find(schema => schema.name === 'credentials.passcode')) {
      this.save = loc('oie.primaryauth.submit', 'login');
    }

    // Precedence for pre-filling identifier field:
    // 1. Use username/identifier from the config.
    // 2. Use identifier value returned in remediation response (model will have this attr set if it's there)
    // 3. Use value from the "remember my username" cookie.
    if (this.options.settings.get('suppressIdentifierDisplay')) {
      // 🔒 Don't set any identifier if suppression is enabled
      this.model.set('identifier', '');
    } else if (this._shouldAddUsername(uiSchema)) {
      this.model.set('identifier', this.settings.get('username'));
    } else if (!this.model.get('identifier') && this._shouldApplyRememberMyUsername(uiSchema)) {
      this._applyRememberMyUsername();
    }
  },

  saveForm() {
    // Before the XHR is made for "identify", we'll generate one-time use fingerprint via
    // a hidden-iframe (similar to authn/v1 flows)

    // Ideally this can be added to a "preSaveForm" handler - but keeping this here for now.
    if (!this.settings.get('features.deviceFingerprinting')) {
      BaseForm.prototype.saveForm.apply(this, arguments);
      return;
    }

    // Toggle Form saving status (e.g. disabling save button, etc)
    this.model.trigger('request');

    // For certain flows, we need to generate a device fingerprint
    // to determine if we need to send a "New Device Sign-on Notification".
    const authClient = this.settings.getAuthClient();
    DeviceFingerprinting.generateDeviceFingerprint(authClient, this.$el[0])
      .then(fingerprint => {
        this.options.appState.set('deviceFingerprint', fingerprint);
      })
      .catch(() => { /* Keep going even if device fingerprint fails */ })
      .finally(() => {
        BaseForm.prototype.saveForm.apply(this, arguments);
      });
  },

  render() {
    BaseForm.prototype.render.apply(this, arguments);

    // Launch Device Authenticator
    if (this.options.appState.hasRemediationObject(RemediationForms.LAUNCH_AUTHENTICATOR)) {
      this.add(signInWithDeviceOption, '.o-form-fieldset-container', false, true, { isRequired: false });
    }

    if (this.options.appState.hasRemediationObject(RemediationForms.LAUNCH_WEBAUTHN_AUTHENTICATOR)) {
      this.add(signInWithWebAuthn, '.o-form-fieldset-container', false, true, { isRequired: false });
    }

    // add forgot password link and external idps buttons if needed
    const idpButtons = createIdpButtons(this.options);
    if (Array.isArray(idpButtons) && idpButtons.length) {
      // Add the forgot password link before the buttons for multiple IDPs
      this._addForgotPasswordView();
      this._addIdpView(idpButtons);
    }

    const customButtons = createCustomButtons(this.options.settings);
    if (Array.isArray(customButtons) && customButtons.length) {
      this.add(customButtonsView, {
        selector: '.o-form-button-bar',
        options: {
          customButtons,
          addSeparateLine: true,
        }
      });
    }
  },

  postRender() {
    BaseForm.prototype.postRender.apply(this, arguments);
    // When a user enters invalid credentials, /introspect returns an error,
    // along with a user object containing the identifier entered by the user.
    this.$el.find('.identifier-container').remove();
    this.getCredentialsAndInvokeAction();
  },

  /**
   * Update UI schemas for customization from .widgetrc.js or Admin Customization settings page.
   * @returns Array
   */
  getUISchema() {
    const schemas = BaseForm.prototype.getUISchema.apply(this, arguments);

    const { settings } = this.options;
    const identifierExplainLabeli18nKey = 'primaryauth.username.tooltip';
    const passwordExplainLabeli18nKey = 'primaryauth.password.tooltip';

    let newSchemas = schemas.map(schema => {
      let newSchema = { ...schema };

      if (schema.name === 'identifier') {
        if (this.options.settings.get('suppressIdentifierDisplay')) {
          return null; // 🔒 Remove the field entirely
        }
        if (isCustomizedI18nKey(identifierExplainLabeli18nKey, settings)) {
          newSchema = {
            ...newSchema,
            explain: loc(identifierExplainLabeli18nKey, 'login'),
            'explain-top': true,
          };
        }

        const isAutoFillUIChallenge =
          this.options.appState.hasRemediationObject(RemediationForms.CHALLENGE_WEBAUTHN_AUTOFILLUI_AUTHENTICATOR);
        // Setting the autocomplete value to 'webauthn' allows the browser to list passkeys alongside usernames
        const autoCompleteDefaultValue = isAutoFillUIChallenge && webauthn.isConditionalMediationAvailable()
          ? 'username webauthn'
          : 'username';
        // We enable the browser's autocomplete for the identifier input
        // because we want to allow the user to choose from previously used identifiers.
        newSchema = {
          ...newSchema,
          autoComplete: Util.getAutocompleteValue(this.options.settings, autoCompleteDefaultValue)
        };
      } else if (schema.name === 'credentials.passcode') {
        newSchema = {
          ...newSchema,
          autoComplete: Util.getAutocompleteValue(this.options.settings, 'current-password')
        };

        if (isCustomizedI18nKey(passwordExplainLabeli18nKey, settings)) {
          newSchema = {
            ...newSchema,
            explain: loc(passwordExplainLabeli18nKey, 'login'),
            'explain-top': true,
          };
        }
      }

      return newSchema;
    });

    // If showKeepMeSignedIn is explicitly set to false, we ensure we don't display
    // the "Keep me signed in" checkbox
    if (this.settings.get('features.showKeepMeSignedIn') === false) {
      newSchemas = newSchemas.filter(schema => schema.name !== 'rememberMe');
    }
    return newSchemas.filter(Boolean); 
  },

  showCustomFormErrorCallout(error, messages) {
    if (!error?.responseJSON?.errorSummaryKeys?.includes(CUSTOM_ACCESS_DENIED_KEY)) {
      return false;
    }

    const message = messages?.find(message => message.i18n.key === CUSTOM_ACCESS_DENIED_KEY);
    if (!message) {
      return false;
    }

    const { errorSummary } = error.responseJSON;

    const options = {
      type: 'error',
      content: new CustomAccessDeniedErrorMessage({
        message: errorSummary,
        links: message.links,
      }),
    };

    this.showMessages(createCallout(options));
    return true;
  },

  remove() {
    BaseForm.prototype.remove.apply(this, arguments);
    if (this.webauthnAbortController) {
      this.webauthnAbortController.abort();
      this.webauthnAbortController = null;
    }
  },

  async getCredentialsAndInvokeAction() {
    const challengeData = this.options.appState.get('webauthnAutofillUIChallenge')?.challengeData;
    const isPasskeyAutofillAvailable = await webauthn.isPasskeyAutofillAvailable();
    if (!challengeData || !isPasskeyAutofillAvailable || typeof AbortController === 'undefined') {
      return;
    }

    const options = _.extend({}, challengeData, {
      challenge: CryptoUtil.strToBin(challengeData.challenge),
    });

    // There is already a check to make sure the browser supports AbortController
    // eslint-disable-next-line compat/compat
    this.webauthnAbortController = new AbortController();

    // There is already a check to make sure the browser supports WebAuthn
    // eslint-disable-next-line compat/compat
    navigator.credentials.get({
      mediation: 'conditional',
      publicKey: options,
      signal: this.webauthnAbortController.signal
    }).then((assertion) => {
      const userHandle = CryptoUtil.binToStr(assertion.response.userHandle ?? '');
      if (_.isEmpty(userHandle)) {
        const errorSummary = loc('oie.webauthn.error.invalidPasskey', 'login');
        this.model.trigger('error', this.model, this._generateErrorObject(errorSummary));
        return;
      }
      const credentials = {
        clientData: CryptoUtil.binToStr(assertion.response.clientDataJSON),
        authenticatorData: CryptoUtil.binToStr(assertion.response.authenticatorData),
        signatureData: CryptoUtil.binToStr(assertion.response.signature),
        userHandle
      };

      this.options.appState.trigger(
        'invokeAction',
        RemediationForms.CHALLENGE_WEBAUTHN_AUTOFILLUI_AUTHENTICATOR, 
        { credentials }
      );
    }, (error) => {
      // Do not display if it is abort error triggered by code when switching.
      // this.webauthnAbortController would be null if abort was triggered by code.
      if (this.webauthnAbortController) {
        const errorSummary = getMessageFromBrowserError(error);
        this.model.trigger('error', this.model, this._generateErrorObject(errorSummary));
      }
    }).finally(() => {
      // unset webauthnAbortController on successful authentication or error
      this.webauthnAbortController = null;
    });
  },

  _generateErrorObject(errorSummary) {
    return {
      responseJSON: { errorSummary }
    };
  },

  _addForgotPasswordView() {
    const forgotPasswordLink = getForgotPasswordLink(this.options.appState, this.options.settings);
    if (forgotPasswordLink.length) {
      this.add('<div class="links-primary"></div>', { selector: '.o-form-button-bar' });
      this.add(Link, {
        selector: '.links-primary',
        options: forgotPasswordLink[0],
      });
    }
  },

  _addIdpView(idpButtons) {
    // We check the 'idpDisplay' option config to determine whether to render the idp buttons
    // above or below the login fields
    const idpDisplay = this.options.settings.get('idpDisplay');
    const isPrimaryIdpDisplay = idpDisplay && idpDisplay.toUpperCase() === 'PRIMARY';

    this.add(signInWithIdps, {
      prepend: isPrimaryIdpDisplay,
      selector: isPrimaryIdpDisplay ? '.o-form-fieldset-container' : '.o-form-button-bar',
      options: {
        idpButtons,
        isPrimaryIdpDisplay
      }
    });
  },

  _shouldAddUsername(uiSchema) {
    // We pre-populate the identifier/username field only if we're in an identifier
    // form and if the option is passed in.
    return (uiSchema.find(schema => schema.name === 'identifier') && this.settings.get('username'));
  },

  _shouldApplyRememberMyUsername(uiSchema) {
    return (uiSchema.find(schema => schema.name === 'identifier')
        && this.settings.get('features.rememberMe'));
  },

  /**
   * When "Remember My Username" is enabled, we pre-fill the identifier
   * field with the saved userName cookie. The cookie would have been originally
   * saved when submitting the form previously.
   */
  _applyRememberMyUsername() {
    const cookieUsername = CookieUtil.getCookieUsername();
    if (cookieUsername) {
      this.model.set('identifier', cookieUsername);
    }
  }
});

export default BaseView.extend({
  Body,

  createModelClass() {
    const ModelClass = BaseView.prototype.createModelClass.apply(this, arguments);

    // customize pre-submit form validation inline error messages
    const identifierRequiredi18nKey = 'error.username.required';
    const passwordRequiredi18nKey = 'error.password.required';
    const props = ModelClass.prototype.props;
    const validate = (attr) => {
      const inlineErrors = {};
      const isEmptyIdentifier = props['identifier'] && !attr?.['identifier'];
      const isEmptyPassword = props['credentials.passcode'] && !attr?.['credentials.passcode'];
      if (isEmptyIdentifier && isCustomizedI18nKey(identifierRequiredi18nKey, this.settings)) {
        inlineErrors['identifier'] = loc(identifierRequiredi18nKey, 'login');
      }
      if (isEmptyPassword && isCustomizedI18nKey(passwordRequiredi18nKey, this.settings)) {
        inlineErrors['credentials.passcode'] = loc(passwordRequiredi18nKey, 'login');
      }
      return inlineErrors;
    };

    return ModelClass.extend({
      validate
    });
  },

  initialize() {
    // Override Footer by overriding showForgotPasswordLink method
    this.Footer = IdentifierFooter.extend({
      showForgotPasswordLink: () => {
        // We don't add the forgot password link in the footer if SIW renders multi IDPs,
        // instead in that case we add it before the IDP buttons in IdentifierView as primary links.
        const idpButtons = createIdpButtons(this.options);
        return (!this.options.appState.isIdentifierOnlyView() &&
          (!Array.isArray(idpButtons) || idpButtons.length === 0));
      }
    });
  },

  postRender() {
    BaseView.prototype.postRender.apply(this, arguments);

    // If user entered identifier is not found, API sends back a message with a link to sign up
    // This is the click handler for that link
    const appState = this.options.appState;
    this.$el.find('.js-sign-up').click(function() {
      appState.trigger('invokeAction', RemediationForms.SELECT_ENROLL_PROFILE);
      return false;
    });
  },
});
