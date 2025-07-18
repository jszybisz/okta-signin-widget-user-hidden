import '../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import oktaJQueryStatic from '../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import Logger from '../../util/Logger.js';
import { AUTHENTICATOR_KEY } from './RemediationConstants.js';
import { getMessage, getI18NValue, getI18NParams } from './i18nUtils.js';
export { doesI18NKeyExist, getI18NParams, getI18NValue, getI18nKey, getMessage, getMessageFromBrowserError, getMessageKey, isCustomizedI18nKey } from './i18nUtils.js';

/* eslint-disable max-len */
const updateLabelForUiSchema = (remediation, uiSchema) => {
  var _remediation$relatesT, _remediation$relatesT2;
  if (uiSchema.mutable === false && uiSchema.name.indexOf('questionKey') < 0) {
    return;
  }
  Logger.info('i18n label transformer');
  Logger.info('\t remediationName: ', remediation.name);
  Logger.info('\t uiSchema: ', JSON.stringify(uiSchema));
  const authenticatorKey = (_remediation$relatesT = remediation.relatesTo) === null || _remediation$relatesT === void 0 ? void 0 : (_remediation$relatesT2 = _remediation$relatesT.value) === null || _remediation$relatesT2 === void 0 ? void 0 : _remediation$relatesT2.key;
  const authenticatorKeyPath = authenticatorKey ? `.${remediation.relatesTo.value.key}` : '';
  const i18nPrefix = `${remediation.name}${authenticatorKeyPath}.`;
  let i18nPath = `${i18nPrefix}${uiSchema.name}`;
  if (uiSchema.type === 'text' && uiSchema.name.indexOf('questionKey') >= 0 && uiSchema.value !== 'custom') {
    i18nPath = `${i18nPath}.${uiSchema.value}`;
  }
  if (uiSchema.type === 'checkbox' && uiSchema.placeholder) {
    Logger.info('\t 1: ', i18nPath);
    uiSchema.placeholder = getI18NValue(i18nPath, uiSchema.placeholder);
  }
  if (uiSchema.label) {
    Logger.info('\t 2: ', i18nPath);
    const params = getI18NParams(remediation, authenticatorKey);
    uiSchema.label = uiSchema.customLabel ? uiSchema.label : getI18NValue(i18nPath, uiSchema.label, params);
  }
  if (oktaJQueryStatic.isPlainObject(uiSchema.options)) {
    uiSchema.options = oktaUnderscore.mapObject(uiSchema.options, (value, key) => {
      const i18nPathOption = `${i18nPath}.${key}`;
      Logger.info('\t 3: ', i18nPathOption);
      return getI18NValue(i18nPathOption, value);
    });
  }
  if (Array.isArray(uiSchema.options)) {
    uiSchema.options.forEach(o => {
      if (!o.label) {
        return;
      }
      let i18nPathOption;
      if (o.authenticatorKey) {
        var _o$value;
        i18nPathOption = `${i18nPath}.${o.authenticatorKey}`;
        const methodType = (_o$value = o.value) === null || _o$value === void 0 ? void 0 : _o$value.methodType;
        if (o.authenticatorKey === AUTHENTICATOR_KEY.OV && methodType) {
          i18nPathOption = `${i18nPathOption}.${methodType}`;
        }
      } else if (typeof o.value === 'string' || typeof o.value === 'number') {
        // value could be string, number, object or undefined.
        i18nPathOption = `${i18nPath}.${o.value}`;
      } else {
        i18nPathOption = i18nPath;
      }
      Logger.info('\t 4: ', i18nPathOption);
      o.label = getI18NValue(i18nPathOption, o.label);
    });
  }
  if (Array.isArray(uiSchema.optionsUiSchemas)) {
    uiSchema.optionsUiSchemas.forEach(optionsUiSchema => {
      optionsUiSchema.forEach(uiSchema => updateLabelForUiSchema(remediation, uiSchema));
    });
  }
};
var i18nTransformer = transformedResp => {
  var _transformedResp$mess;
  // Try to override label using i18n value
  if (Array.isArray(transformedResp.remediations)) {
    transformedResp.remediations.filter(remediation => Array.isArray(remediation.uiSchema) && remediation.uiSchema.length).forEach(remediation => {
      remediation.uiSchema.forEach(uiSchema => updateLabelForUiSchema(remediation, uiSchema));
    });
  }

  // Try to override `messages` using i18n value.
  // 1. This is only handling top level `messages` object when response status is 200.
  // 2. See `IonResponseHelper.js` where handle `messages` object when none 200 response.
  // 3. Handling `messages` in remediation forms on 200 response is not considered yet.
  //    Is that possible?
  if (Array.isArray((_transformedResp$mess = transformedResp.messages) === null || _transformedResp$mess === void 0 ? void 0 : _transformedResp$mess.value)) {
    transformedResp.messages.value.forEach(message => {
      message.message = getMessage(message);
    });
  }
  return transformedResp;
};

export { i18nTransformer as default };
//# sourceMappingURL=i18nTransformer.js.map
