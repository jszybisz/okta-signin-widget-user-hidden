import { loc } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
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
import '../../internals/BaseForm.js';
import BaseFormWithPolling from '../../internals/BaseFormWithPolling.js';
import '../../internals/BaseOktaVerifyChallengeView.js';
import '../../internals/BaseView.js';
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
import polling from '../shared/polling.js';
import OVResendView from './OVResendView.js';
import SwitchEnrollChannelLinkView from './SwitchEnrollChannelLinkView.js';
import EnrollChannelPollDescriptionView from './EnrollChannelPollDescriptionView.js';

const OV_FORCE_FIPS_COMPLIANCE_UPGRAGE_KEY_IOS = 'oie.authenticator.app.non_fips_compliant_enrollment_device_incompatible';
const OV_FORCE_FIPS_COMPLIANCE_UPGRAGE_KEY_NON_IOS = 'oie.authenticator.app.non_fips_compliant_enrollment_app_update_required';
const OV_QR_ENROLL_ENABLE_BIOMETRICS_KEY = 'oie.authenticator.app.method.push.enroll.enable.biometrics';
let shouldStartPolling = true;
const Body = BaseFormWithPolling.extend(Object.assign({
  title: function () {
    const selectedChannel = this.options.appState.get('currentAuthenticator').contextualData.selectedChannel;
    let title;
    switch (selectedChannel) {
      case 'email':
        title = loc('oie.enroll.okta_verify.setup.email.title', 'login');
        break;
      case 'sms':
        title = loc('oie.enroll.okta_verify.setup.sms.title', 'login');
        break;
      default:
        title = loc('oie.enroll.okta_verify.setup.title', 'login');
    }
    return title;
  },
  className: 'oie-enroll-ov-poll',
  noButtonBar: true,
  initialize: function () {
    BaseFormWithPolling.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'error', this.stopPolling);
    if (shouldStartPolling) {
      this.startPolling();
    }
  },
  showMessages: function () {
    // override showMessages to display custom callout
    const calloutOptions = {};
    if (this.options.appState.containsMessageWithI18nKey(OV_FORCE_FIPS_COMPLIANCE_UPGRAGE_KEY_IOS) || this.options.appState.containsMessageWithI18nKey(OV_FORCE_FIPS_COMPLIANCE_UPGRAGE_KEY_NON_IOS)) {
      // add a title for ov force upgrade
      calloutOptions.title = loc('oie.okta_verify.enroll.force.upgrade.title', 'login');
    } else if (this.options.appState.containsMessageWithI18nKey(OV_QR_ENROLL_ENABLE_BIOMETRICS_KEY)) {
      // add a title for OV enable biometrics message during enrollment
      calloutOptions.title = loc('oie.authenticator.app.method.push.enroll.enable.biometrics.title', 'login');
    }
    BaseFormWithPolling.prototype.showMessages.call(this, calloutOptions);
  },
  getUISchema: function () {
    const schema = [];
    const contextualData = this.options.appState.get('currentAuthenticator').contextualData;
    const selectedChannel = contextualData.selectedChannel;
    let selector;
    if (selectedChannel === 'qrcode') {
      selector = '.qrcode-container';
      shouldStartPolling = true;
    } else if (['email', 'sms'].includes(selectedChannel)) {
      selector = '.switch-channel-content';
      shouldStartPolling = true;
    } else if (['samedevice'].includes(selectedChannel)) {
      // no selector if the channel is same device
      shouldStartPolling = true;
    } else if (['devicebootstrap'].includes(selectedChannel)) {
      // no selector if the channel is device bootstrap
      shouldStartPolling = false;
    }
    schema.push({
      View: EnrollChannelPollDescriptionView
    });
    schema.push({
      View: SwitchEnrollChannelLinkView,
      options: {
        selectedChannel: selectedChannel
      },
      selector: selector
    });
    if (['email', 'sms'].includes(selectedChannel)) {
      schema.push({
        View: OVResendView,
        selector: '.o-form-error-container'
      });
    }
    return schema;
  },
  remove: function () {
    BaseFormWithPolling.prototype.remove.apply(this, arguments);
    this.stopPolling();
  }
}, polling));
var EnrollPollOktaVerifyView = BaseAuthenticatorView.extend({
  Body: Body
});

export { EnrollPollOktaVerifyView as default };
//# sourceMappingURL=EnrollPollOktaVerifyView.js.map
