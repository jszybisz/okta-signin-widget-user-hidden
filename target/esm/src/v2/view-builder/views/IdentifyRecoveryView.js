import { loc } from '../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import '../internals/BaseHeader.js';
import BaseFooter from '../internals/BaseFooter.js';
import BaseForm from '../internals/BaseForm.js';
import '../internals/BaseFormWithPolling.js';
import '../internals/BaseOktaVerifyChallengeView.js';
import BaseView from '../internals/BaseView.js';
import '../components/AuthenticatorEnrollOptionsContainer.js';
import '../components/AuthenticatorVerifyOptions.js';
import '../../../../packages/@okta/courage-dist/esm/lib/underscore/underscore-min.js';
import 'cross-fetch';
import '../../../util/BrowserFeatures.js';
import '../../../util/FactorUtil.js';
import '../../ion/RemediationConstants.js';
import '../../../v1/views/admin-consent/ScopeList.js';
import '../../../v1/views/consent/ScopeList.js';
import './captcha/CaptchaView.js';
import Util from '../../../util/Util.js';

const Body = BaseForm.extend({
  title: function () {
    return loc('password.reset.title.generic', 'login');
  },
  save: function () {
    return loc('oform.next', 'login');
  },
  getUISchema: function () {
    const schemas = BaseForm.prototype.getUISchema.apply(this, arguments);
    let newSchemas = schemas.map(schema => {
      let newSchema = {
        ...schema
      };
      if (schema.name === 'identifier') {
        // We enable the browser's autocomplete for the identifier input
        // because we want to allow the user to choose from previously used identifiers.
        newSchema = {
          ...newSchema,
          autoComplete: Util.getAutocompleteValue(this.options.settings, 'username')
        };
      }
      return newSchema;
    });
    return newSchemas;
  }
});
var IdentifyRecoveryView = BaseView.extend({
  Body: Body,
  Footer: BaseFooter
});

export { IdentifyRecoveryView as default };
//# sourceMappingURL=IdentifyRecoveryView.js.map
