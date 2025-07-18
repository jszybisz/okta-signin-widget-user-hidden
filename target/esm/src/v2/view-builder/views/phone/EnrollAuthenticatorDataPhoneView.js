import { loc } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import Model from '../../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import '../../internals/BaseHeader.js';
import '../../internals/BaseFooter.js';
import BaseForm from '../../internals/BaseForm.js';
import '../../internals/BaseFormWithPolling.js';
import '../../internals/BaseOktaVerifyChallengeView.js';
import BaseView from '../../internals/BaseView.js';
import '../../components/AuthenticatorEnrollOptionsContainer.js';
import '../../components/AuthenticatorVerifyOptions.js';
import '../../../../../packages/@okta/courage-dist/esm/lib/underscore/underscore-min.js';
import 'cross-fetch';
import '../../../../util/BrowserFeatures.js';
import '../../../../util/FactorUtil.js';
import '../../../ion/RemediationConstants.js';
import '../../../../v1/views/admin-consent/ScopeList.js';
import '../../../../v1/views/consent/ScopeList.js';
import '../captcha/CaptchaView.js';
import BaseAuthenticatorView from '../../components/BaseAuthenticatorView.js';
import fn from '../../../../util/CountryUtil.js';

const Body = BaseForm.extend({
  className: 'phone-authenticator-enroll',
  title: function () {
    return loc('oie.phone.enroll.title', 'login');
  },
  subtitle: function () {
    return this.model.get('authenticator.methodType') === 'voice' ? loc('oie.phone.enroll.call.subtitle', 'login') : loc('oie.phone.enroll.sms.subtitle', 'login');
  },
  render: function () {
    BaseForm.prototype.render.apply(this, arguments);
    this.el.querySelector('.phone-authenticator-enroll__phone-code').innerText = `+${this.model.get('phoneCode')}`;
  },
  handlePhoneCodeChange: function () {
    const countryCodeField = this.el.querySelector('.phone-authenticator-enroll__phone-code');
    countryCodeField.innerText = `+${this.model.get('phoneCode')}`;
  },
  save: function () {
    return this.model.get('authenticator.methodType') === 'voice' ? loc('oie.phone.call.primaryButton', 'login') : loc('oie.phone.sms.primaryButton', 'login');
  },
  getUISchema: function () {
    const uiSchemas = BaseForm.prototype.getUISchema.apply(this, arguments);

    // TODO: Using underscore to support IE, replace with Array.prototype methods (find, findIndex) when IE
    // support is removed
    const phoneNumberUISchemaIndex = oktaUnderscore.findIndex(uiSchemas, ({
      name: name
    }) => name === 'authenticator.phoneNumber');
    const countryUISchema = {
      'label-top': true,
      label: loc('mfa.country', 'login'),
      type: 'select',
      options: fn.getCountries(),
      name: 'country',
      wide: true
    };
    const inputId = 'okta-phone-number-input';

    // Create an input group - serves as a display wrapper
    const phoneNumberWithCodeUISchema = {
      label: loc('mfa.phoneNumber.placeholder', 'login'),
      inputId: inputId,
      type: 'group',
      modelType: 'string',
      'label-top': true,
      name: 'phoneCode',
      className: 'phone-authenticator-enroll__phone',
      input: [{
        type: 'label',
        /* eslint-disable-next-line @okta/okta/no-unlocalized-text */
        label: `+${this.model.get('phoneCode')}`,
        className: 'phone-authenticator-enroll__phone-code no-translate'
      }, Object.assign({
        inputId: inputId
      }, uiSchemas[phoneNumberUISchemaIndex])]
    };
    const extensionUISchema = {
      label: loc('phone.extention.label', 'login'),
      type: 'text',
      className: 'phone-authenticator-enroll__phone-ext',
      'label-top': true,
      name: 'extension',
      showWhen: {
        'authenticator.methodType': 'voice'
      }
    };
    if (phoneNumberUISchemaIndex !== -1) {
      // Replace phoneNumberUISchema..
      uiSchemas.splice(phoneNumberUISchemaIndex, 1, phoneNumberWithCodeUISchema);
      // Add countryUISchema before & extensionUISchema after phone..
      uiSchemas.splice(phoneNumberUISchemaIndex, 0, countryUISchema);
      uiSchemas.splice(phoneNumberUISchemaIndex + 2, 0, extensionUISchema);
    }
    const methodType = oktaUnderscore.find(uiSchemas, ({
      name: name
    }) => name === 'authenticator.methodType');
    if (methodType && methodType.options.length === 1) {
      methodType.className = 'hide';
    }
    return uiSchemas;
  },
  updateConditionalText: function () {
    this.el.querySelector('.okta-form-subtitle').innerText = this.subtitle();
    this.el.querySelector('input[type="submit"]').value = this.save();
  },
  initialize: function () {
    BaseForm.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:authenticator.methodType', this.updateConditionalText);
    this.listenTo(this.model, 'change:phoneCode', this.handlePhoneCodeChange.bind(this));
  }
});
var EnrollAuthenticatorDataPhoneView = BaseAuthenticatorView.extend({
  Body: Body,
  createModelClass: function () {
    const ModelClass = BaseView.prototype.createModelClass.apply(this, arguments);
    const local = Object.assign({
      country: {
        'value': this.settings.get('defaultCountryCode'),
        'type': 'string'
      },
      extension: {
        'type': 'string'
      }
    }, ModelClass.prototype.local);
    const derived = Object.assign({
      phoneCode: {
        deps: ['country'],
        fn: function (country) {
          return fn.getCallingCodeForCountry(country);
        }
      }
    }, ModelClass.prototype.derived);
    return ModelClass.extend({
      local: local,
      derived: derived,
      toJSON: function () {
        const modelJSON = Model.prototype.toJSON.call(this, arguments);
        const extension = this.get('extension');
        const phoneCode = this.get('phoneCode');

        // Add country code..
        let formattedPhoneNumber = `+${phoneCode}${modelJSON.authenticator.phoneNumber}`;

        // Add extension if present..
        if (modelJSON.authenticator.methodType === 'voice' && extension !== null && extension !== void 0 && extension.trim().length) {
          formattedPhoneNumber = `${formattedPhoneNumber}x${extension}`;
        }
        // Override phone with formatted number..
        modelJSON.authenticator.phoneNumber = formattedPhoneNumber;
        return modelJSON;
      }
    });
  }
});

export { EnrollAuthenticatorDataPhoneView as default };
//# sourceMappingURL=EnrollAuthenticatorDataPhoneView.js.map
