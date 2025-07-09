import _ from '../../../../packages/@okta/courage-dist/esm/lib/underscore/underscore-min.js';
import { loc } from '../../../util/loc.js';
import fn from '../../../util/FactorUtil.js';
import { AUTHENTICATOR_KEY, ID_PROOFING_TYPE } from '../../ion/RemediationConstants.js';

/*!
 * Copyright (c) 2020, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
const {
  getPasswordComplexityDescriptionForHtmlList: getPasswordComplexityDescriptionForHtmlList
} = fn;
const getButtonDataSeAttr = function (authenticator) {
  if (authenticator.authenticatorKey) {
    var _authenticator$value, _authenticator$value2;
    const method = (_authenticator$value = authenticator.value) !== null && _authenticator$value !== void 0 && _authenticator$value.methodType ? '-' + ((_authenticator$value2 = authenticator.value) === null || _authenticator$value2 === void 0 ? void 0 : _authenticator$value2.methodType) : '';
    return authenticator.authenticatorKey + method;
  }
  return '';
};

/* eslint complexity: [0, 0], max-statements: [2, 25] */
const getAuthenticatorData = function (authenticator, isVerifyAuthenticator) {
  var _authenticator$relate, _authenticator$relate2, _authenticator$relate3, _authenticator$relate4, _authenticator$relate5, _authenticator$relate6, _authenticator$relate7, _authenticator$relate8, _authenticator$relate9, _authenticator$value3;
  const authenticatorKey = authenticator.authenticatorKey;
  const key = _.isString(authenticatorKey) ? authenticatorKey.toLowerCase() : '';
  let authenticatorData = {};
  let nicknameText = isVerifyAuthenticator ? (_authenticator$relate = authenticator.relatesTo) === null || _authenticator$relate === void 0 ? void 0 : _authenticator$relate.nickname : undefined;
  switch (key) {
    case AUTHENTICATOR_KEY.EMAIL:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? ((_authenticator$relate2 = authenticator.relatesTo) === null || _authenticator$relate2 === void 0 ? void 0 : (_authenticator$relate3 = _authenticator$relate2.profile) === null || _authenticator$relate3 === void 0 ? void 0 : _authenticator$relate3.email) || '' : loc('oie.email.authenticator.description', 'login'),
        iconClassName: 'mfa-okta-email',
        noTranslateClassName: isVerifyAuthenticator ? 'no-translate' : '',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? getVerifyEmailAriaLabel((_authenticator$relate4 = authenticator.relatesTo) === null || _authenticator$relate4 === void 0 ? void 0 : (_authenticator$relate5 = _authenticator$relate4.profile) === null || _authenticator$relate5 === void 0 ? void 0 : _authenticator$relate5.email) : loc('oie.select.authenticator.enroll.email.label', 'login')
      });
      break;
    case AUTHENTICATOR_KEY.PASSWORD:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.password.authenticator.description', 'login'),
        iconClassName: 'mfa-okta-password',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.password.label', 'login') : loc('oie.select.authenticator.enroll.password.label', 'login')
      });
      break;
    case AUTHENTICATOR_KEY.PHONE:
      Object.assign(authenticatorData, {
        nickname: nicknameText,
        description: isVerifyAuthenticator ? (_authenticator$relate6 = authenticator.relatesTo) === null || _authenticator$relate6 === void 0 ? void 0 : (_authenticator$relate7 = _authenticator$relate6.profile) === null || _authenticator$relate7 === void 0 ? void 0 : _authenticator$relate7.phoneNumber : loc('oie.phone.authenticator.description', 'login'),
        iconClassName: 'mfa-okta-phone',
        noTranslateClassName: isVerifyAuthenticator ? 'no-translate' : '',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? getVerifyPhoneAriaLabel((_authenticator$relate8 = authenticator.relatesTo) === null || _authenticator$relate8 === void 0 ? void 0 : (_authenticator$relate9 = _authenticator$relate8.profile) === null || _authenticator$relate9 === void 0 ? void 0 : _authenticator$relate9.phoneNumber) : loc('oie.select.authenticator.enroll.phone.label', 'login')
      });
      break;
    case AUTHENTICATOR_KEY.SECURITY_QUESTION:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.security.question.authenticator.description', 'login'),
        iconClassName: 'mfa-okta-security-question',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.security.question.label', 'login') : loc('oie.select.authenticator.enroll.security.question.label', 'login')
      });
      break;
    case AUTHENTICATOR_KEY.WEBAUTHN:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.webauthn.description', 'login'),
        iconClassName: 'mfa-webauthn',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.webauthn.label', 'login') : loc('oie.select.authenticator.enroll.webauthn.label', 'login')
      });
      break;
    case AUTHENTICATOR_KEY.OV:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? loc('oie.okta_verify.label', 'login') : loc('oie.okta_verify.authenticator.description', 'login'),
        iconClassName: 'mfa-okta-verify',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: getOktaVerifyAriaLabel(isVerifyAuthenticator, authenticator === null || authenticator === void 0 ? void 0 : (_authenticator$value3 = authenticator.value) === null || _authenticator$value3 === void 0 ? void 0 : _authenticator$value3.methodType)
      });
      break;
    case AUTHENTICATOR_KEY.GOOGLE_OTP:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.google_authenticator.authenticator.description', 'login'),
        iconClassName: 'mfa-google-auth',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
      });
      break;
    case AUTHENTICATOR_KEY.ON_PREM:
      {
        var _authenticator$relate0;
        const vendorName = ((_authenticator$relate0 = authenticator.relatesTo) === null || _authenticator$relate0 === void 0 ? void 0 : _authenticator$relate0.displayName) || loc('oie.on_prem.authenticator.default.vendorName', 'login');
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.on_prem.authenticator.description', 'login', [vendorName]),
          iconClassName: 'mfa-onprem',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.RSA:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.rsa.authenticator.description', 'login'),
        iconClassName: 'mfa-rsa',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
      });
      break;
    case AUTHENTICATOR_KEY.DUO:
      Object.assign(authenticatorData, {
        description: isVerifyAuthenticator ? '' : loc('oie.duo.authenticator.description', 'login'),
        iconClassName: 'mfa-duo',
        buttonDataSeAttr: getButtonDataSeAttr(authenticator),
        ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
      });
      break;
    case AUTHENTICATOR_KEY.IDP:
      {
        var _authenticator$relate1, _authenticator$relate10;
        const idpName = (_authenticator$relate1 = authenticator.relatesTo) === null || _authenticator$relate1 === void 0 ? void 0 : _authenticator$relate1.displayName;
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.idp.authenticator.description', 'login', [idpName]),
          iconClassName: 'mfa-custom-factor',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          logoUri: (authenticator === null || authenticator === void 0 ? void 0 : (_authenticator$relate10 = authenticator.relatesTo) === null || _authenticator$relate10 === void 0 ? void 0 : _authenticator$relate10.logoUri) || '',
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.CUSTOM_OTP:
      {
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.custom_otp.description', 'login'),
          iconClassName: 'mfa-hotp',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.SYMANTEC_VIP:
      {
        var _authenticator$relate11;
        const appName = (_authenticator$relate11 = authenticator.relatesTo) === null || _authenticator$relate11 === void 0 ? void 0 : _authenticator$relate11.displayName;
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.symantecVip.authenticator.description', 'login', [appName]),
          iconClassName: 'mfa-symantec',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.YUBIKEY:
      {
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.yubikey.authenticator.description', 'login'),
          iconClassName: 'mfa-yubikey',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.CUSTOM_APP:
      {
        var _authenticator$relate12, _authenticator$relate13, _authenticator$relate14;
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? authenticator === null || authenticator === void 0 ? void 0 : (_authenticator$relate12 = authenticator.relatesTo) === null || _authenticator$relate12 === void 0 ? void 0 : _authenticator$relate12.displayName : loc('oie.custom.app.authenticator.description', 'login', [authenticator.label]),
          noTranslateClassName: isVerifyAuthenticator ? 'no-translate' : '',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          iconClassName: 'mfa-custom-app-logo',
          logoUri: (authenticator === null || authenticator === void 0 ? void 0 : (_authenticator$relate13 = authenticator.relatesTo) === null || _authenticator$relate13 === void 0 ? void 0 : _authenticator$relate13.logoUri) || '',
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator === null || authenticator === void 0 ? void 0 : (_authenticator$relate14 = authenticator.relatesTo) === null || _authenticator$relate14 === void 0 ? void 0 : _authenticator$relate14.displayName]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.SMARTCARD:
      {
        Object.assign(authenticatorData, {
          description: isVerifyAuthenticator ? '' : loc('oie.smartcard.authenticator.description', 'login'),
          iconClassName: 'mfa-smartcard',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
    case AUTHENTICATOR_KEY.TAC:
      {
        Object.assign(authenticatorData, {
          // we don't expect the description in the else case to be displayed, 
          // because TAC is not eligible for inline enrollment
          description: isVerifyAuthenticator ? '' : loc('oie.tac.authenticator.description', 'login'),
          iconClassName: 'mfa-tac',
          buttonDataSeAttr: getButtonDataSeAttr(authenticator),
          ariaLabel: isVerifyAuthenticator ? loc('oie.select.authenticator.verify.named.authenticator.label', 'login', [authenticator.label]) : loc('oie.select.authenticator.enroll.named.authenticator.label', 'login', [authenticator.label])
        });
        break;
      }
  }
  return authenticatorData;
};
const getIDProofingData = function (idvName) {
  let idProofingData = {};
  switch (idvName) {
    case ID_PROOFING_TYPE.IDV_PERSONA:
      idProofingData = {
        iconClassName: 'mfa-idv-persona'
      };
      break;
    case ID_PROOFING_TYPE.IDV_CLEAR:
      idProofingData = {
        iconClassName: 'mfa-idv-clear'
      };
      break;
    case ID_PROOFING_TYPE.IDV_INCODE:
      idProofingData = {
        iconClassName: 'mfa-idv-incode'
      };
      break;
  }
  return idProofingData;
};
function getVerifyEmailAriaLabel(email) {
  return email ? loc('oie.select.authenticator.verify.email.with.email.label', 'login', [email]) : loc('oie.select.authenticator.verify.email.label', 'login');
}
function getVerifyPhoneAriaLabel(phone) {
  return phone ? loc('oie.select.authenticator.verify.phone.with.phone.label', 'login', [phone]) : loc('oie.select.authenticator.verify.phone.label', 'login');
}
function getOktaVerifyAriaLabel(isVerify, methodType) {
  if (!isVerify) {
    return loc('oie.select.authenticator.enroll.okta_verify.authenticator.label', 'login');
  }
  const defaultLabel = loc('oie.select.authenticator.verify.okta_verify.label', 'login');
  if (typeof methodType === 'undefined') {
    return defaultLabel;
  }
  const methodTypeLabelMap = {
    push: loc('oie.select.authenticator.okta_verify.push.label', 'login'),
    totp: loc('oie.select.authenticator.okta_verify.totp.label', 'login'),
    'signed_nonce': loc('oie.select.authenticator.okta_verify.signed_nonce.label', 'login')
  };
  return methodTypeLabelMap[methodType] || defaultLabel;
}
function getAuthenticatorDataForEnroll(authenticator) {
  return getAuthenticatorData(authenticator);
}
function getAuthenticatorDataForVerification(authenticator) {
  return getAuthenticatorData(authenticator, true);
}
function getIconClassNameForBeacon(authenticatorKey, idvName) {
  return getAuthenticatorData({
    authenticatorKey: authenticatorKey
  }).iconClassName || getIDProofingData(idvName).iconClassName;
}
function removeRequirementsFromError(errorJSON) {
  var _errorJSON$errorCause;
  if (((_errorJSON$errorCause = errorJSON.errorCauses) === null || _errorJSON$errorCause === void 0 ? void 0 : _errorJSON$errorCause.length) > 0 && Array.isArray(errorJSON.errorCauses[0].errorSummary) && errorJSON.errorCauses[0].errorSummary.length > 0) {
    var _errorJSON$errorCause2;
    // Change from Array to string for all errors.
    errorJSON.errorCauses[0].errorSummary = errorJSON.errorCauses[0].errorSummary[0];

    // Overrides for particular error messages.
    const errorKey = ((_errorJSON$errorCause2 = errorJSON.errorCauses[0].errorKey) === null || _errorJSON$errorCause2 === void 0 ? void 0 : _errorJSON$errorCause2.length) > 0 && errorJSON.errorCauses[0].errorKey[0];
    // Remove the requirements string only if this is requirements were not met error.
    if (errorKey === 'password.passwordRequirementsNotMet') {
      errorJSON.errorCauses[0].errorSummary = loc('registration.error.password.passwordRequirementsNotMet', 'login');
    }
  }
  return errorJSON;
}

/**
 * Get authenticator display name from {@code remediation}.
 *
 * @param {Object} remediation
 */
function getAuthenticatorDisplayName(remediation) {
  var _remediation$relatesT, _remediation$relatesT2;
  return (_remediation$relatesT = remediation.relatesTo) === null || _remediation$relatesT === void 0 ? void 0 : (_remediation$relatesT2 = _remediation$relatesT.value) === null || _remediation$relatesT2 === void 0 ? void 0 : _remediation$relatesT2.displayName;
}

export { getAuthenticatorDataForEnroll, getAuthenticatorDataForVerification, getAuthenticatorDisplayName, getIconClassNameForBeacon, getOktaVerifyAriaLabel, getPasswordComplexityDescriptionForHtmlList, getVerifyEmailAriaLabel, getVerifyPhoneAriaLabel, removeRequirementsFromError };
//# sourceMappingURL=AuthenticatorUtil.js.map
