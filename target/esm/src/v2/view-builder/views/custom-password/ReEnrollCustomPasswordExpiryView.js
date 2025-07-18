import { loc, createButton } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
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
import Util from '../../../../util/Util.js';

const Body = BaseForm.extend({
  title: function () {
    return loc('password.expired.title.generic', 'login');
  },
  subtitle: function () {
    return loc('password.expired.custom.subtitle', 'login');
  },
  noSubmitButton: true,
  initialize: function () {
    const {
      customExpiredPasswordName: customExpiredPasswordName,
      customExpiredPasswordURL: customExpiredPasswordURL
    } = this.options.currentViewState;
    this.add(createButton({
      className: 'button button-primary button-wide',
      title: oktaUnderscore.partial(loc, 'password.expired.custom.submit', 'login', [customExpiredPasswordName]),
      click: () => {
        Util.redirect(customExpiredPasswordURL);
      }
    }));
  }
});
var ReEnrollCustomPasswordExpiryView = BaseView.extend({
  Body: Body
});

export { ReEnrollCustomPasswordExpiryView as default };
//# sourceMappingURL=ReEnrollCustomPasswordExpiryView.js.map
