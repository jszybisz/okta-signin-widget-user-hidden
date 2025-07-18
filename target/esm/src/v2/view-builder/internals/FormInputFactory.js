import { loc, createButton, Collection } from '../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import AuthenticatorEnrollOptionsContainer from '../components/AuthenticatorEnrollOptionsContainer.js';
import AuthenticatorVerifyOptions from '../components/AuthenticatorVerifyOptions.js';
import { getAuthenticatorDataForEnroll, getAuthenticatorDataForVerification } from '../utils/AuthenticatorUtil.js';
import { FORMS, AUTHENTICATOR_KEY } from '../../ion/RemediationConstants.js';
import IDP from '../../../util/IDP.js';
import AdminScopeList from '../../../v1/views/admin-consent/ScopeList.js';
import EnduserScopeList from '../../../v1/views/consent/ScopeList.js';
import CaptchaView from '../views/captcha/CaptchaView.js';

const isTextOverflowing = (text, maxWidth) => {
  // Create a temporary element and attach it to the document so we can compare the client width to the 
  // max width allowed.
  const elem = document.createElement('div');
  elem.style.position = 'absolute';
  elem.style.left = '-9999px';
  elem.style.whiteSpace = 'nowrap';
  elem.innerHTML = text;
  document.body.appendChild(elem);
  const result = elem.clientWidth;
  document.body.removeChild(elem);
  return result > maxWidth;
};
const createAuthenticatorEnrollSelectView = opt => {
  const optionItems = (opt.options || []).map(opt => {
    return Object.assign({}, opt, getAuthenticatorDataForEnroll(opt));
  });
  return {
    View: AuthenticatorEnrollOptionsContainer,
    options: {
      name: opt.name,
      optionItems: optionItems,
      collection: new Collection(optionItems)
    }
  };
};
const createAuthenticatorVerifySelectView = opt => {
  let optionItems = opt.options || [];
  // If webauthn enrollments > 1 just show one entry with a generic namne (first) so user doesnt have to select which
  // one to pick. eg) If there is yubikey5 and another unknown u2f key, user cannot identify that easily. We need to
  // do this at least  until users can give authenticator enrollments custom names.
  const authSet = new Set();
  optionItems = optionItems.filter(opt => {
    let isDuplicate;
    if (opt.authenticatorKey === AUTHENTICATOR_KEY.WEBAUTHN) {
      isDuplicate = authSet.has(opt.authenticatorKey);
      authSet.add(opt.authenticatorKey);
    } else if (opt.authenticatorKey === AUTHENTICATOR_KEY.CUSTOM_APP) {
      var _opt$value, _opt$value2;
      // Filter the duplicate enrollment by id for custom app. 
      isDuplicate = authSet.has(opt === null || opt === void 0 ? void 0 : (_opt$value = opt.value) === null || _opt$value === void 0 ? void 0 : _opt$value.id);
      authSet.add(opt === null || opt === void 0 ? void 0 : (_opt$value2 = opt.value) === null || _opt$value2 === void 0 ? void 0 : _opt$value2.id);
    }
    return !isDuplicate;
  });
  optionItems = optionItems.map(opt => {
    return Object.assign({}, opt, getAuthenticatorDataForVerification(opt));
  });
  return {
    View: AuthenticatorVerifyOptions,
    options: {
      name: opt.name,
      collection: new Collection(optionItems)
    }
  };
};
const createAdminScopesView = () => {
  return {
    View: AdminScopeList
  };
};
const createEnduserScopesView = () => {
  return {
    View: EnduserScopeList
  };
};
const createCaptchaView = opt => {
  return {
    View: CaptchaView,
    options: {
      name: opt.name
    }
  };
};
const inputCreationStrategy = {
  authenticatorEnrollSelect: createAuthenticatorEnrollSelectView,
  authenticatorVerifySelect: createAuthenticatorVerifySelectView,
  ['admin-consent']: createAdminScopesView,
  ['consent']: createEnduserScopesView,
  ['captcha']: createCaptchaView
};

// TODO: move logic to uiSchemaTransformer
const create = function (uiSchemaObj) {
  const strategyFn = inputCreationStrategy[uiSchemaObj.type] || oktaUnderscore.identity;
  return strategyFn(uiSchemaObj);
};
const createPIVButton = (settings, appState) => {
  const pivIdp = appState.get('remediations').filter(idp => idp.name === FORMS.PIV_IDP);
  if (pivIdp.length < 1) {
    return [];
  }
  const pivConfig = settings.get('piv');
  const className = pivConfig.className || '';
  return [{
    attributes: {
      'data-se': 'piv-card-button'
    },
    className: className + ' piv-button',
    title: pivConfig.text || loc('piv.cac.card', 'login'),
    click: e => {
      e.preventDefault();
      appState.trigger('switchForm', FORMS.PIV_IDP);
    }
  }];
};

/**
 * Example of `redirect-idp` remediation.
 * {
 *   "name": "redirect-idp",
 *   "type": "MICROSOFT",
 *   "idp": {
 *      "id": "0oa2szc1K1YPgz1pe0g4",
 *      "name": "Microsoft IDP"
 *    },
 *   "href": "http://localhost:3000/sso/idps/0oa2szc1K1YPgz1pe0g4?stateToken=BB...AA",
 *   "method": "GET"
 * }
 *
 */
const createIdpButtons = ({
  settings: settings,
  appState: appState
}) => {
  // This is the max allowable text width that we can display for IDP buttons.
  // Generated by taking the 316px width of button minus padding-left (90 px) and padding-right (50px)
  const MAX_IDP_BUTTON_WIDTH = 186;
  const redirectIdpRemediations = appState.get('remediations').filter(idp => idp.name === FORMS.REDIRECT_IDP);
  if (!Array.isArray(redirectIdpRemediations)) {
    return [];
  }

  // create piv button
  const pivButton = createPIVButton(settings, appState);

  //add buttons from idp object
  const idpButtons = redirectIdpRemediations.map(idpObject => {
    var _idpObject$type;
    let type = (_idpObject$type = idpObject.type) === null || _idpObject$type === void 0 ? void 0 : _idpObject$type.toLowerCase();
    let displayName;
    if (!oktaUnderscore.contains(IDP.SUPPORTED_SOCIAL_IDPS, type)) {
      var _idpObject$idp;
      type = 'general-idp';
      // OKTA-396684 - makes sure that custom idps always have a name
      displayName = loc('customauth.sign.in.with.label', 'login', [(_idpObject$idp = idpObject.idp) === null || _idpObject$idp === void 0 ? void 0 : _idpObject$idp.name]);
    } else {
      displayName = loc(`socialauth.${type}.label`, 'login');
    }
    const classNames = ['social-auth-button', `social-auth-${type}-button`];
    if (type === 'general-idp') {
      classNames.push('no-translate');
    }
    if (idpObject.idp.className) {
      classNames.push(idpObject.idp.className);
    }
    const button = {
      attributes: {
        'data-se': `social-auth-${type}-button`
      },
      className: classNames.join(' '),
      title: displayName,
      href: idpObject.href
    };
    if (isTextOverflowing(displayName, MAX_IDP_BUTTON_WIDTH)) {
      // We add a tooltip in case the name gets truncated if too long
      button.attributes.title = displayName;
    }
    return button;
  });
  return [...pivButton, ...idpButtons];
};
const createCustomButtons = settings => {
  const customButtons = settings.get('customButtons');
  return customButtons.map(customButton => {
    const button = {
      attributes: {
        'data-se': customButton.dataAttr
      },
      className: customButton.className + ' default-custom-button',
      title: customButton.title || loc(customButton.i18nKey, 'login'),
      click: customButton.click
    };
    return button;
  });
};
const addCustomButton = customButtonSettings => {
  return createButton({
    ...customButtonSettings,
    className: `${customButtonSettings.className} default-custom-button button-primary`
  });
};

export { addCustomButton, create, createCustomButtons, createIdpButtons, isTextOverflowing };
//# sourceMappingURL=FormInputFactory.js.map
