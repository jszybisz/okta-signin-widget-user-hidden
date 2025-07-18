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

function log(level, args) {
  var _window, _window$OktaSignInDeb, _window$OktaSignInDeb2;
  // Only log statements in development mode
  //  or if throwing an error through console.error
  //  or if debugger is enabled
  if (level === 'error' || (_window = window) !== null && _window !== void 0 && (_window$OktaSignInDeb = _window.OktaSignInDebug) !== null && _window$OktaSignInDeb !== void 0 && (_window$OktaSignInDeb2 = _window$OktaSignInDeb.isEnabled) !== null && _window$OktaSignInDeb2 !== void 0 && _window$OktaSignInDeb2.call(_window$OktaSignInDeb)) {
    window.console[level].apply(window.console, args);
  }
}

/**
 * Utility library of logging functions.
 */
var Logger = {
  trace: function () {
    return log('trace', arguments);
  },
  dir: function () {
    return log('dir', arguments);
  },
  time: function () {
    return log('time', arguments);
  },
  timeEnd: function () {
    return log('timeEnd', arguments);
  },
  group: function () {
    return log('group', arguments);
  },
  groupEnd: function () {
    return log('groupEnd', arguments);
  },
  assert: function () {
    return log('assert', arguments);
  },
  log: function () {
    return log('log', arguments);
  },
  info: function () {
    return log('info', arguments);
  },
  warn: function () {
    return log('warn', arguments);
  },
  error: function () {
    return log('error', arguments);
  },
  deprecate: function (msg) {
    return log('warn', ['[okta-signin-widget] DEPRECATED:', msg]);
  }
};

export { Logger as default };
//# sourceMappingURL=Logger.js.map
