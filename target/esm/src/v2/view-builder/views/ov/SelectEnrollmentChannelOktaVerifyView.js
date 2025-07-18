import { loc } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
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
import '../../internals/BaseView.js';
import '../../components/AuthenticatorEnrollOptionsContainer.js';
import '../../components/AuthenticatorVerifyOptions.js';
import '../../../../../packages/@okta/courage-dist/esm/lib/underscore/underscore-min.js';
import 'cross-fetch';
import fn from '../../../../util/BrowserFeatures.js';
import '../../../../util/FactorUtil.js';
import '../../../ion/RemediationConstants.js';
import '../../../../v1/views/admin-consent/ScopeList.js';
import '../../../../v1/views/consent/ScopeList.js';
import '../captcha/CaptchaView.js';
import BaseAuthenticatorView from '../../components/BaseAuthenticatorView.js';
import SameDeviceEnrollLink from './SameDeviceEnrollLink.js';

const Body = BaseForm.extend({
  title: function () {
    return fn.isAndroid() || fn.isIOS() ? loc('oie.enroll.okta_verify.setup.title', 'login') : loc('oie.enroll.okta_verify.select.channel.title.updated', 'login');
  },
  getUISchema: function () {
    var _channelField$options;
    const schemas = BaseForm.prototype.getUISchema.apply(this, arguments);
    // filter selected channel
    const channelField = oktaUnderscore.find(schemas, schema => schema.name === 'authenticator.channel');
    // do not show the 'samedevice' radio option, that option is displayed as a link instead
    channelField.options = oktaUnderscore.filter(channelField === null || channelField === void 0 ? void 0 : channelField.options, option => {
      var _this$options$appStat, _this$options$appStat2;
      return option.value !== ((_this$options$appStat = this.options.appState.get('currentAuthenticator')) === null || _this$options$appStat === void 0 ? void 0 : (_this$options$appStat2 = _this$options$appStat.contextualData) === null || _this$options$appStat2 === void 0 ? void 0 : _this$options$appStat2.selectedChannel) && option.value !== 'samedevice';
    });
    channelField.value = (_channelField$options = channelField.options[0]) === null || _channelField$options === void 0 ? void 0 : _channelField$options.value;
    channelField.sublabel = null;
    this.model.set('authenticator.channel', channelField.value);
    const description = {
      View: loc('oie.enroll.okta_verify.select.channel.subtitle', 'login'),
      selector: '.o-form-fieldset-container'
    };
    return [description, ...schemas];
  }
});
var SelectEnrollmentChannelOktaVerifyView = BaseAuthenticatorView.extend({
  Body: Body,
  postRender: function () {
    var _this$options$current, _authenticatorFormVal;
    const authenticatorFormValues = (_this$options$current = this.options.currentViewState.value) === null || _this$options$current === void 0 ? void 0 : _this$options$current.find(val => val.name === 'authenticator').value.form.value;
    const sameDeviceChannelAvailable = authenticatorFormValues === null || authenticatorFormValues === void 0 ? void 0 : (_authenticatorFormVal = authenticatorFormValues.find(val => val.name === 'channel').options) === null || _authenticatorFormVal === void 0 ? void 0 : _authenticatorFormVal.find(channel => channel.value === 'samedevice');
    // only add this link if the samedevice channel is available in the remediation
    if (sameDeviceChannelAvailable) {
      this.add(new SameDeviceEnrollLink({
        model: this.model,
        settings: this.settings,
        appState: this.options.appState
      }), 'form');
    }
  }
});

export { SelectEnrollmentChannelOktaVerifyView as default };
//# sourceMappingURL=SelectEnrollmentChannelOktaVerifyView.js.map
