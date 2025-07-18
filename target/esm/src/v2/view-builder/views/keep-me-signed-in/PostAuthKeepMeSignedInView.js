import { loc, createButton } from '../../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
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

const Body = BaseForm.extend({
  noSubmitButton: true,
  title: function () {
    return loc('oie.kmsi.title', 'login');
  },
  subtitle: function () {
    return loc('oie.kmsi.subtitle', 'login');
  },
  saveForm: function (isKeepMeSignedIn) {
    this.model.set('keepMeSignedIn', isKeepMeSignedIn);
    this.options.appState.trigger('saveForm', this.model);
  },
  // Overrides the default getUISchema in order to render 2 buttons instead of a checkbox
  getUISchema: function () {
    const form = this;
    const acceptButton = createButton({
      className: 'button button-secondary',
      title: loc('oie.kmsi.accept', 'login'),
      attributes: {
        'data-se': 'stay-signed-in-btn'
      },
      click: function () {
        form.saveForm(true);
      }
    });
    const rejectButton = createButton({
      className: 'button button-secondary',
      title: loc('oie.kmsi.reject', 'login'),
      attributes: {
        'data-se': 'do-not-stay-signed-in-btn'
      },
      click: function () {
        form.saveForm(false);
      }
    });
    return [{
      View: acceptButton
    }, {
      View: rejectButton
    }];
  }
});
var PostAuthKeepMeSignedInView = BaseView.extend({
  Body: Body
});

export { PostAuthKeepMeSignedInView as default };
//# sourceMappingURL=PostAuthKeepMeSignedInView.js.map
