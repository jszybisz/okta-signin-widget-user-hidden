import { createCallout } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
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
import '../../internals/BaseForm.js';
import '../../internals/BaseFormWithPolling.js';
import Body$1 from '../../internals/BaseOktaVerifyChallengeView.js';
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
import { getBiometricsErrorOptions } from '../../utils/ChallengeViewUtil.js';

const Body = Body$1.extend({
  getDeviceChallengePayload: function () {
    return this.options.currentViewState.relatesTo.value.contextualData.challenge.value;
  },
  showCustomFormErrorCallout: function (error) {
    const options = getBiometricsErrorOptions(error, false);

    // If not biometrics error, just show the returned error message
    if (oktaUnderscore.isEmpty(options)) {
      return false;
    }
    this.showMessages(createCallout(options));
    return true;
  }
});

export { Body as default };
//# sourceMappingURL=ChallengeOktaVerifyFastPassView.js.map
