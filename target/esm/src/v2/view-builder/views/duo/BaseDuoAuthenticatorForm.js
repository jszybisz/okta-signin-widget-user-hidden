import { createCallout, loc } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import Duo from '../../../../../packages/vendor/duo_web_sdk/index.js';
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
import '../../../../util/BrowserFeatures.js';
import '../../../../util/FactorUtil.js';
import '../../../ion/RemediationConstants.js';
import '../../../../v1/views/admin-consent/ScopeList.js';
import '../../../../v1/views/consent/ScopeList.js';
import '../captcha/CaptchaView.js';

var BaseDuoAuthenticatorForm = BaseForm.extend({
  noButtonBar: true,
  postRender: function () {
    const contextualData = this.getContextualData();
    // This is the place to check contextualData.integrationType once we support more types
    // Currently we only support IFRAME
    const duoFrame = this.add(`<iframe frameborder="0" title="'${this.title()}'"></iframe>`).last();
    try {
      Duo.init({
        host: contextualData.host,
        sig_request: contextualData.signedToken,
        // eslint-disable-line camelcase
        iframe: duoFrame.el,
        post_action: signedData => {
          // eslint-disable-line camelcase
          this.model.set('credentials.signatureData', signedData);
          this.saveForm(this.model);
        }
      });
    } catch (e) {
      duoFrame.remove();
      this.add(createCallout({
        type: 'error',
        subtitle: loc('oie.duo.iFrameError', 'login')
      }), '.o-form-error-container'); // eslint-disable-line no-console
    }
  },
  getContextualData: function () {
    // to be overriden
  }
});

export { BaseDuoAuthenticatorForm as default };
//# sourceMappingURL=BaseDuoAuthenticatorForm.js.map
