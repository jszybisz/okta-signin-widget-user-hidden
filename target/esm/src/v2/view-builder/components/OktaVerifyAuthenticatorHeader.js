import BaseHeader from '../internals/BaseHeader.js';
import '../internals/BaseFooter.js';
import '../internals/BaseForm.js';
import '../internals/BaseFormWithPolling.js';
import '../internals/BaseOktaVerifyChallengeView.js';
import '../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import '../internals/BaseView.js';
import './AuthenticatorEnrollOptionsContainer.js';
import './AuthenticatorVerifyOptions.js';
import '../../../../packages/@okta/courage-dist/esm/lib/underscore/underscore-min.js';
import 'cross-fetch';
import '../../../util/BrowserFeatures.js';
import '../../../util/FactorUtil.js';
import { AUTHENTICATOR_KEY } from '../../ion/RemediationConstants.js';
import '../../../v1/views/admin-consent/ScopeList.js';
import '../../../v1/views/consent/ScopeList.js';
import '../views/captcha/CaptchaView.js';
import { BaseAuthenticatorBeacon } from './BaseAuthenticatorView.js';

var OktaVerifyAuthenticatorHeader = BaseHeader.extend({
  HeaderBeacon: BaseAuthenticatorBeacon.extend({
    authenticatorKey: AUTHENTICATOR_KEY.OV
  })
});

export { OktaVerifyAuthenticatorHeader as default };
//# sourceMappingURL=OktaVerifyAuthenticatorHeader.js.map
