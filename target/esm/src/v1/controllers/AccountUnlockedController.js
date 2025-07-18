import { loc } from '../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import Enums from '../../util/Enums.js';
import FormController from '../util/FormController.js';
import FormType from '../util/FormType.js';

/*!
 * Copyright (c) 2015-2016, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
var AccountUnlockedController = FormController.extend({
  className: 'account-unlocked',
  Model: function () {
    return {
      local: {
        userFullName: ['string', false, this.options.appState.get('userFullName')]
      }
    };
  },
  Form: {
    title: oktaUnderscore.partial(loc, 'account.unlock.unlocked.title', 'login'),
    subtitle: oktaUnderscore.partial(loc, 'account.unlock.unlocked.desc', 'login'),
    noButtonBar: true,
    attributes: {
      'data-se': 'account-unlocked'
    },
    formChildren: function () {
      return [FormType.Button({
        title: loc('goback', 'login'),
        className: 'button button-primary button-wide',
        attributes: {
          'data-se': 'back-button'
        },
        click: function () {
          this.state.set('navigateDir', Enums.DIRECTION_BACK);
          this.options.appState.trigger('navigate', '');
        }
      })];
    }
  }
});

export { AccountUnlockedController as default };
//# sourceMappingURL=AccountUnlockedController.js.map
