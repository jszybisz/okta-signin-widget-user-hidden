import { loc, createCallout } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
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
import BaseResendView from '../shared/BaseResendView.js';

const ResendView = BaseResendView.extend({
  // To be shown after a timeout
  className: 'phone-authenticator-challenge__resend-warning hide',
  events: {
    'click a.resend-link': 'handleResendLink'
  },
  modelEvents: {
    'error': 'handleError'
  },
  // Override this to change the resend action location from response
  resendActionKey: 'currentAuthenticatorEnrollment-resend',
  initialize: function () {
    const resendText = this.model.get('mode') === 'sms' ? loc('oie.phone.verify.sms.resendText', 'login') : loc('oie.phone.verify.call.resendText', 'login');
    const linkText = this.model.get('mode') === 'sms' ? loc('oie.phone.verify.sms.resendLinkText', 'login') : loc('oie.phone.verify.call.resendLinkText', 'login');
    this.add(createCallout({
      content: `${resendText}&nbsp;<a class='resend-link'>${linkText}</a>`,
      type: 'warning'
    }));
  },
  hideResendViewAndShowAfterTimeout: function () {
    // Hide warning, but start a timeout again..
    if (!this.el.classList.contains('hide')) {
      this.el.classList.add('hide');
    }
    this.showCalloutAfterTimeout();
  },
  handleResendLink: function (ev) {
    ev === null || ev === void 0 ? void 0 : ev.preventDefault();
    this.options.appState.trigger('invokeAction', this.resendActionKey);
    this.hideResendViewAndShowAfterTimeout();
  },
  handleError: function () {
    this.hideResendViewAndShowAfterTimeout();
  }
});
const Body = BaseForm.extend(Object.assign({
  className: 'phone-authenticator-challenge',
  title: function () {
    return loc('oie.phone.verify.title', 'login');
  },
  save: function () {
    return loc('mfa.challenge.verify', 'login');
  },
  initialize: function () {
    BaseForm.prototype.initialize.apply(this, arguments);
    const sendText = this.model.get('mode') === 'sms' ? loc('oie.phone.verify.sms.codeSentText', 'login') : loc('mfa.calling', 'login');
    const enterCodeText = loc('oie.phone.verify.enterCodeText', 'login');
    const carrierChargesText = loc('oie.phone.carrier.charges', 'login');
    const isPhoneNumberAvailable = this.model.get('phoneNumber') !== loc('oie.phone.alternate.title', 'login');
    const strongClass = isPhoneNumberAvailable ? 'strong no-translate nowrap' : '';
    const nickname = isPhoneNumberAvailable ? this.model.get('nickname') : '';
    const nicknameText = nickname ? ` (${nickname})` : '';
    const extraNicknameCssClasses = nicknameText ? 'no-translate authenticator-verify-nickname' : '';
    const nicknameTemplate = nicknameText ? `<span class="${extraNicknameCssClasses || ''}"}>${nicknameText}.</span>` : '<span class="no-translate">.</span>';

    // Courage doesn't support HTML, hence creating a subtitle here.
    this.add('<div class="okta-form-subtitle" data-se="o-form-explain">' + `${sendText} ` + `<span class="${strongClass}">${this.model.escape('phoneNumber')}</span>` + `${nicknameTemplate}` + `&nbsp;${enterCodeText}` + `<p>${carrierChargesText}</p>` + '</div>', {
      prepend: true,
      selector: '.o-form-fieldset-container'
    });
  },
  postRender: function () {
    BaseForm.prototype.postRender.apply(this, arguments);
    this.add(ResendView, {
      selector: '.o-form-info-container',
      prepend: true
    });
  }
}));
var ChallengeAuthenticatorPhoneView = BaseAuthenticatorView.extend({
  Body: Body,
  createModelClass: function () {
    const relatesToObject = this.options.currentViewState.relatesTo;
    const {
      methods: methods,
      profile: profile,
      nickname: nickname
    } = (relatesToObject === null || relatesToObject === void 0 ? void 0 : relatesToObject.value) || {};
    const ModelClass = BaseView.prototype.createModelClass.apply(this, arguments);
    const local = Object.assign({
      mode: {
        'value': methods[0].type,
        'type': 'string'
      },
      phoneNumber: {
        'value': profile !== null && profile !== void 0 && profile.phoneNumber ? profile.phoneNumber : loc('oie.phone.alternate.title', 'login'),
        'type': 'string'
      },
      nickname: {
        'value': nickname ? nickname : '',
        'type': 'string'
      }
    }, ModelClass.prototype.local);
    return ModelClass.extend({
      local: local
    });
  }
});

export { ResendView, ChallengeAuthenticatorPhoneView as default };
//# sourceMappingURL=ChallengeAuthenticatorPhoneView.js.map
