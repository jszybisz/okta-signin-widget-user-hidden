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
import BaseFooter from '../../internals/BaseFooter.js';
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
  className: 'password-authenticator',
  subtitle: function () {
    return this.settings.get('brandName') ? loc('password.expiring.soon.subtitle.specific', 'login', [this.settings.get('brandName')]) : loc('password.expiring.soon.subtitle.generic', 'login');
  },
  title: function () {
    var _this$options$appStat;
    const passwordPolicy = (_this$options$appStat = this.options.appState.get('currentAuthenticator')) === null || _this$options$appStat === void 0 ? void 0 : _this$options$appStat.settings;
    const daysToExpiry = passwordPolicy.daysToExpiry;
    if (daysToExpiry > 0) {
      return loc('password.expiring.title', 'login', [daysToExpiry]);
    } else if (daysToExpiry === 0) {
      return loc('password.expiring.today', 'login');
    } else {
      return loc('password.expiring.soon', 'login');
    }
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
const Footer = BaseFooter.extend({
  links: function () {
    const links = [];
    if (this.options.appState.hasRemediationObject('skip')) {
      links.push({
        'type': 'link',
        'label': loc('password.expiring.later', 'login'),
        'name': 'skip',
        'actionPath': 'skip'
      });
    }
    return links;
  }
});
var ReEnrollCustomPasswordExpiryWarningView = BaseView.extend({
  Body: Body,
  Footer: Footer
});

export { ReEnrollCustomPasswordExpiryWarningView as default };
//# sourceMappingURL=ReEnrollCustomPasswordExpiryWarningView.js.map
