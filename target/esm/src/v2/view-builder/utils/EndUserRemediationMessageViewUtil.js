import _Handlebars2 from '../../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import oktaJQueryStatic from '../../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import Enums from '../../../util/Enums.js';
import Logger from '../../../util/Logger.js';
import Util from '../../../util/Util.js';
import '../../ion/RemediationConstants.js';
import { getMessage } from '../../ion/i18nUtils.js';

const PROBE_PATH = 'probe';
// eslint-disable-next-line max-len
const ADP_INSTALL_FALLBACK_REMEDIATION_KEY = 'idx.error.code.access_denied.device_assurance.remediation.android.zero.trust.android_device_policy_app_required_manual_install';
const ajaxRequest = requestOptions => {
  const ajaxOptions = Object.assign({
    method: 'GET',
    contentType: 'application/json'
  }, requestOptions);
  return oktaJQueryStatic.ajax(ajaxOptions);
};
const checkPort = (url, probeTimeoutMillis) => {
  return ajaxRequest({
    url: url,
    timeout: probeTimeoutMillis
  });
};
const onPortFound = (url, timeout) => {
  return ajaxRequest({
    url: url,
    method: 'GET',
    timeout: timeout
  });
};
const getFallbackMessage = fallbackObj => {
  switch (fallbackObj.message.i18n.key) {
    case ADP_INSTALL_FALLBACK_REMEDIATION_KEY:
      // ADP fallback message has additional formatting
      // eslint-disable-next-line max-len
      return _Handlebars2.template({
        "compiler": [8, ">= 4.3.0"],
        "main": function (container, depth0, helpers, partials, data) {
          var lookupProperty = container.lookupProperty || function (parent, propertyName) {
            if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
              return parent[propertyName];
            }
            return undefined;
          };
          return container.escapeExpression((lookupProperty(helpers, "i18n") || depth0 && lookupProperty(depth0, "i18n") || container.hooks.helperMissing).call(depth0 != null ? depth0 : container.nullContext || {}, {
            "name": "i18n",
            "hash": {
              "$1": "<span class='strong'>$1</span>",
              "bundle": "login",
              "code": "idx.error.code.access_denied.device_assurance.remediation.android.zero.trust.android_device_policy_app_required_manual_install"
            },
            "data": data,
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 194
              }
            }
          }));
        },
        "useData": true
      })();
    default:
      return getMessage(fallbackObj.message);
  }
};
const executeDeviceRemediationFallback = (fallback, action) => {
  switch (fallback.type) {
    case 'APP_LINK':
      {
        // If/When loopback fails auto launch app link to install
        Util.executeOnVisiblePage(() => {
          Util.redirect(fallback.href, window, true);
        });
        break;
      }
    case 'MESSAGE':
      {
        // display updated message in place
        const siwContainer = document.getElementById(Enums.WIDGET_CONTAINER_ID);
        if (!siwContainer) {
          Logger.error('Cannot find okta-sign-in container to display message');
          return;
        }
        const remediationMsgElements = siwContainer.querySelectorAll(`[data-se="${action}"]`);
        if (remediationMsgElements && remediationMsgElements[0]) {
          remediationMsgElements[0].outerHTML = getFallbackMessage(fallback);
        }
        break;
      }
  }
};
const probe = (baseUrl, probeDetails) => {
  return checkPort(`${baseUrl}/${PROBE_PATH}`, probeDetails.probeTimeoutMillis).then(() => {
    const loopbackRemediationPath = `${baseUrl}/${probeDetails.remediationPath}/${probeDetails.actionPath}`;
    return onPortFound(loopbackRemediationPath, probeDetails.probeTimeoutMillis).then(() => {
      probeDetails.isSuccess = true;
    });
  }).catch(() => {
    Logger.error(`Something unexpected happened while we were checking url: ${baseUrl}.`);
    return oktaJQueryStatic.Deferred().reject();
  });
};
const hasDeviceRemediationAction = message => {
  return message.deviceRemediation && message.deviceRemediation.value && message.deviceRemediation.value.action;
};
const isLoopbackDeviceRemediation = deviceRemediation => {
  return deviceRemediation && deviceRemediation.remediationType === 'LOOPBACK';
};
const probeLoopbackAndExecute = deviceRemediation => {
  const domain = deviceRemediation.domain;
  const ports = deviceRemediation.ports;
  const totalPortCount = ports.length;
  let failedPortCount = 0;
  const probeDetails = {
    remediationPath: deviceRemediation.remediationPath,
    actionPath: deviceRemediation.action,
    probeTimeoutMillis: deviceRemediation.probeTimeoutMillis,
    isSuccess: false
  };
  let probeChain = Promise.resolve();
  const baseUrls = ports.map(port => `${domain}:${port}`);
  baseUrls.forEach(baseUrl => {
    // no need to continue if we found the port and made a successful request
    if (probeDetails.isSuccess) {
      return;
    }
    probeChain = probeChain.then(() => probe(baseUrl, probeDetails)).catch(() => {
      failedPortCount += 1;
      Logger.error(`Authenticator is not listening on: ${baseUrl}.`);
      if (failedPortCount >= totalPortCount && !probeDetails.isSuccess) {
        Logger.error('No available ports. Loopback server failed and using fallback mechanism.');
        executeDeviceRemediationFallback(deviceRemediation.fallback, deviceRemediation.action);
      }
    });
  });
};

export { hasDeviceRemediationAction, isLoopbackDeviceRemediation, probeLoopbackAndExecute };
//# sourceMappingURL=EndUserRemediationMessageViewUtil.js.map
