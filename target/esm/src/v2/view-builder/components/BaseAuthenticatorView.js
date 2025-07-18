import '../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import BaseHeader from '../internals/BaseHeader.js';
import '../internals/BaseFooter.js';
import '../internals/BaseForm.js';
import '../internals/BaseFormWithPolling.js';
import '../internals/BaseOktaVerifyChallengeView.js';
import BaseView from '../internals/BaseView.js';
import './AuthenticatorEnrollOptionsContainer.js';
import './AuthenticatorVerifyOptions.js';
import { getIconClassNameForBeacon } from '../utils/AuthenticatorUtil.js';
import { FORMS } from '../../ion/RemediationConstants.js';
import '../../../v1/views/admin-consent/ScopeList.js';
import '../../../v1/views/consent/ScopeList.js';
import '../views/captcha/CaptchaView.js';
import AuthenticatorFooter from './AuthenticatorFooter.js';
import HeaderBeacon from './HeaderBeacon.js';

const BaseAuthenticatorBeacon = HeaderBeacon.extend({
  authenticatorKey: function () {
    return this.options.appState.get('authenticatorKey');
  },
  idvName: function () {
    var _this$options$appStat, _redirectIDVerifyReme;
    const redirectIDVerifyRemediation = (_this$options$appStat = this.options.appState.get('remediations')) === null || _this$options$appStat === void 0 ? void 0 : _this$options$appStat.find(remediation => {
      return remediation.name === FORMS.REDIRECT_IDVERIFY;
    });
    return redirectIDVerifyRemediation === null || redirectIDVerifyRemediation === void 0 ? void 0 : (_redirectIDVerifyReme = redirectIDVerifyRemediation.idp) === null || _redirectIDVerifyReme === void 0 ? void 0 : _redirectIDVerifyReme.id;
  },
  getBeaconClassName: function () {
    const authenticatorKey = oktaUnderscore.result(this, 'authenticatorKey');
    const idvName = oktaUnderscore.result(this, 'idvName');
    return getIconClassNameForBeacon(authenticatorKey, idvName);
  }
});
var BaseAuthenticatorView = BaseView.extend({
  Header: BaseHeader.extend({
    HeaderBeacon: BaseAuthenticatorBeacon
  }),
  Footer: AuthenticatorFooter
});

export { BaseAuthenticatorBeacon, BaseAuthenticatorView as default };
//# sourceMappingURL=BaseAuthenticatorView.js.map
