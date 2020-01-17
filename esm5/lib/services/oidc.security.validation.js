/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { hextob64u, KEYUTIL, KJUR } from 'jsrsasign-reduced';
import { EqualityHelperService } from './oidc-equality-helper.service';
import { TokenHelperService } from './oidc-token-helper.service';
import { LoggerService } from './oidc.logger.service';
// http://openid.net/specs/openid-connect-implicit-1_0.html
// id_token
// id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
// MUST exactly match the value of the iss (issuer) Claim.
//
// id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
// by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
// or if it contains additional audiences not trusted by the Client.
//
// id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
//
// id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
//
// id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the
// alg Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
//
// id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect Core 1.0
// [OpenID.Core] specification.
//
// id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account
// for clock skew).
//
// id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
// limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
//
// id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent
// in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks
// is Client specific.
//
// id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.
// The meaning and processing of acr Claim Values is out of scope for this document.
//
// id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication
// if it determines too much time has elapsed since the last End- User authentication.
// Access Token Validation
// access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
// for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
// access_token C2: Take the left- most half of the hash and base64url- encode it.
// access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present in the ID Token.
var OidcSecurityValidation = /** @class */ (function () {
    function OidcSecurityValidation(arrayHelperService, tokenHelperService, loggerService) {
        this.arrayHelperService = arrayHelperService;
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    OidcSecurityValidation.prototype.isTokenExpired = 
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    function (token, offsetSeconds) {
        /** @type {?} */
        var decoded;
        decoded = this.tokenHelperService.getPayloadFromToken(token, false);
        return !this.validate_id_token_exp_not_expired(decoded, offsetSeconds);
    };
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    // tslint:disable-next-line: variable-name
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    // tslint:disable-next-line: variable-name
    /**
     * @param {?} decoded_id_token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_exp_not_expired = 
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    // tslint:disable-next-line: variable-name
    /**
     * @param {?} decoded_id_token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    function (decoded_id_token, offsetSeconds) {
        /** @type {?} */
        var tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decoded_id_token);
        offsetSeconds = offsetSeconds || 0;
        if (!tokenExpirationDate) {
            return false;
        }
        /** @type {?} */
        var tokenExpirationValue = tokenExpirationDate.valueOf();
        /** @type {?} */
        var nowWithOffset = new Date().valueOf() + offsetSeconds * 1000;
        /** @type {?} */
        var tokenNotExpired = tokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug("Token not expired?: " + tokenExpirationValue + " > " + nowWithOffset + "  (" + tokenNotExpired + ")");
        // Token not expired?
        return tokenNotExpired;
    };
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
    // https scheme that contains scheme, host,
    // and optionally, port number and path components and no query or fragment components.
    //
    // sub
    // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
    // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
    // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
    //
    // aud
    // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value.
    // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
    // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
    //
    // exp
    // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
    // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
    // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
    // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until the date/ time.
    // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
    //
    // iat
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
    // 1970- 01 - 01T00: 00: 00Z as measured
    // in UTC until the date/ time.
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
    // https scheme that contains scheme, host,
    // and optionally, port number and path components and no query or fragment components.
    //
    // sub
    // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
    // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
    // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
    //
    // aud
    // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value.
    // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
    // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
    //
    // exp
    // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
    // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
    // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
    // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until the date/ time.
    // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
    //
    // iat
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
    // 1970- 01 - 01T00: 00: 00Z as measured
    // in UTC until the date/ time.
    /**
     * @param {?} dataIdToken
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_required_id_token = 
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
    // https scheme that contains scheme, host,
    // and optionally, port number and path components and no query or fragment components.
    //
    // sub
    // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
    // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
    // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
    //
    // aud
    // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value.
    // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
    // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
    //
    // exp
    // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
    // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
    // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
    // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until the date/ time.
    // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
    //
    // iat
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
    // 1970- 01 - 01T00: 00: 00Z as measured
    // in UTC until the date/ time.
    /**
     * @param {?} dataIdToken
     * @return {?}
     */
    function (dataIdToken) {
        /** @type {?} */
        var validated = true;
        if (!dataIdToken.hasOwnProperty('iss')) {
            validated = false;
            this.loggerService.logWarning('iss is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('sub')) {
            validated = false;
            this.loggerService.logWarning('sub is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('aud')) {
            validated = false;
            this.loggerService.logWarning('aud is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('exp')) {
            validated = false;
            this.loggerService.logWarning('exp is missing, this is required in the id_token');
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            validated = false;
            this.loggerService.logWarning('iat is missing, this is required in the id_token');
        }
        return validated;
    };
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    /**
     * @param {?} dataIdToken
     * @param {?} maxOffsetAllowedInSeconds
     * @param {?} disableIatOffsetValidation
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_iat_max_offset = 
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    /**
     * @param {?} dataIdToken
     * @param {?} maxOffsetAllowedInSeconds
     * @param {?} disableIatOffsetValidation
     * @return {?}
     */
    function (dataIdToken, maxOffsetAllowedInSeconds, disableIatOffsetValidation) {
        if (disableIatOffsetValidation) {
            return true;
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            return false;
        }
        /** @type {?} */
        var dateTimeIatIdToken = new Date(0);
        dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
        maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;
        if (dateTimeIatIdToken == null) {
            return false;
        }
        this.loggerService.logDebug('validate_id_token_iat_max_offset: ' + (new Date().valueOf() - dateTimeIatIdToken.valueOf()) + ' < ' + maxOffsetAllowedInSeconds * 1000);
        return new Date().valueOf() - dateTimeIatIdToken.valueOf() < maxOffsetAllowedInSeconds * 1000;
    };
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
    // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
    // The precise method for detecting replay attacks is Client specific.
    // However the nonce claim SHOULD not be present for the refesh_token grant type
    // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
    // The current spec is ambiguous and Keycloak does send it.
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
    // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
    // The precise method for detecting replay attacks is Client specific.
    // However the nonce claim SHOULD not be present for the refesh_token grant type
    // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
    // The current spec is ambiguous and Keycloak does send it.
    /**
     * @param {?} dataIdToken
     * @param {?} localNonce
     * @param {?} ignoreNonceAfterRefresh
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_nonce = 
    // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
    // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
    // The precise method for detecting replay attacks is Client specific.
    // However the nonce claim SHOULD not be present for the refesh_token grant type
    // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
    // The current spec is ambiguous and Keycloak does send it.
    /**
     * @param {?} dataIdToken
     * @param {?} localNonce
     * @param {?} ignoreNonceAfterRefresh
     * @return {?}
     */
    function (dataIdToken, localNonce, ignoreNonceAfterRefresh) {
        /** @type {?} */
        var isFromRefreshToken = (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === OidcSecurityValidation.RefreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
            this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce);
            return false;
        }
        return true;
    };
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    // tslint:disable-next-line: variable-name
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    // tslint:disable-next-line: variable-name
    /**
     * @param {?} dataIdToken
     * @param {?} authWellKnownEndpoints_issuer
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_iss = 
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    // tslint:disable-next-line: variable-name
    /**
     * @param {?} dataIdToken
     * @param {?} authWellKnownEndpoints_issuer
     * @return {?}
     */
    function (dataIdToken, authWellKnownEndpoints_issuer) {
        if (((/** @type {?} */ (dataIdToken.iss))) !== ((/** @type {?} */ (authWellKnownEndpoints_issuer)))) {
            this.loggerService.logDebug('Validate_id_token_iss failed, dataIdToken.iss: ' +
                dataIdToken.iss +
                ' authWellKnownEndpoints issuer:' +
                authWellKnownEndpoints_issuer);
            return false;
        }
        return true;
    };
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    /**
     * @param {?} dataIdToken
     * @param {?} aud
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_aud = 
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    /**
     * @param {?} dataIdToken
     * @param {?} aud
     * @return {?}
     */
    function (dataIdToken, aud) {
        if (dataIdToken.aud instanceof Array) {
            /** @type {?} */
            var result = this.arrayHelperService.areEqual(dataIdToken.aud, aud);
            if (!result) {
                this.loggerService.logDebug('Validate_id_token_aud  array failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
                return false;
            }
            return true;
        }
        else if (dataIdToken.aud !== aud) {
            this.loggerService.logDebug('Validate_id_token_aud failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);
            return false;
        }
        return true;
    };
    /**
     * @param {?} state
     * @param {?} localState
     * @return {?}
     */
    OidcSecurityValidation.prototype.validateStateFromHashCallback = /**
     * @param {?} state
     * @param {?} localState
     * @return {?}
     */
    function (state, localState) {
        if (((/** @type {?} */ (state))) !== ((/** @type {?} */ (localState)))) {
            this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);
            return false;
        }
        return true;
    };
    /**
     * @param {?} idTokenSub
     * @param {?} userdataSub
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_userdata_sub_id_token = /**
     * @param {?} idTokenSub
     * @param {?} userdataSub
     * @return {?}
     */
    function (idTokenSub, userdataSub) {
        if (((/** @type {?} */ (idTokenSub))) !== ((/** @type {?} */ (userdataSub)))) {
            this.loggerService.logDebug('validate_userdata_sub_id_token failed, id_token_sub: ' + idTokenSub + ' userdata_sub:' + userdataSub);
            return false;
        }
        return true;
    };
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    /**
     * @param {?} idToken
     * @param {?} jwtkeys
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_signature_id_token = 
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    /**
     * @param {?} idToken
     * @param {?} jwtkeys
     * @return {?}
     */
    function (idToken, jwtkeys) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (!jwtkeys || !jwtkeys.keys) {
            return false;
        }
        /** @type {?} */
        var headerData = this.tokenHelperService.getHeaderFromToken(idToken, false);
        if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
            this.loggerService.logWarning('id token has no header data');
            return false;
        }
        /** @type {?} */
        var kid = headerData.kid;
        /** @type {?} */
        var alg = headerData.alg;
        if ('RS256' !== ((/** @type {?} */ (alg)))) {
            this.loggerService.logWarning('Only RS256 supported');
            return false;
        }
        /** @type {?} */
        var isValid = false;
        if (!headerData.hasOwnProperty('kid')) {
            // exactly 1 key in the jwtkeys and no kid in the Jose header
            // kty	"RSA" use "sig"
            /** @type {?} */
            var amountOfMatchingKeys = 0;
            try {
                for (var _d = tslib_1.__values(jwtkeys.keys), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    if (((/** @type {?} */ (key.kty))) === 'RSA' && ((/** @type {?} */ (key.use))) === 'sig') {
                        amountOfMatchingKeys = amountOfMatchingKeys + 1;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (amountOfMatchingKeys === 0) {
                this.loggerService.logWarning('no keys found, incorrect Signature, validation failed for id_token');
                return false;
            }
            else if (amountOfMatchingKeys > 1) {
                this.loggerService.logWarning('no ID Token kid claim in JOSE header and multiple supplied in jwks_uri');
                return false;
            }
            else {
                try {
                    for (var _f = tslib_1.__values(jwtkeys.keys), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var key = _g.value;
                        if (((/** @type {?} */ (key.kty))) === 'RSA' && ((/** @type {?} */ (key.use))) === 'sig') {
                            /** @type {?} */
                            var publickey = KEYUTIL.getKey(key);
                            isValid = KJUR.jws.JWS.verify(idToken, publickey, ['RS256']);
                            if (!isValid) {
                                this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                            }
                            return isValid;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        else {
            try {
                // kid in the Jose header of id_token
                for (var _h = tslib_1.__values(jwtkeys.keys), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var key = _j.value;
                    if (((/** @type {?} */ (key.kid))) === ((/** @type {?} */ (kid)))) {
                        /** @type {?} */
                        var publickey = KEYUTIL.getKey(key);
                        isValid = KJUR.jws.JWS.verify(idToken, publickey, ['RS256']);
                        if (!isValid) {
                            this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                        }
                        return isValid;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return isValid;
    };
    /**
     * @param {?} responseType
     * @return {?}
     */
    OidcSecurityValidation.prototype.config_validate_response_type = /**
     * @param {?} responseType
     * @return {?}
     */
    function (responseType) {
        if (responseType === 'id_token token' || responseType === 'id_token') {
            return true;
        }
        if (responseType === 'code') {
            return true;
        }
        this.loggerService.logWarning('module configure incorrect, invalid response_type:' + responseType);
        return false;
    };
    // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
    //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
    ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
    ////    if (!header_data.hasOwnProperty('kid')) {
    ////        // no kid defined in Jose header
    ////        if (jwtkeys.keys.length != 1) {
    ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
    ////            return false;
    ////        }
    ////    }
    ////    return true;
    //// }
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
    // is present in the ID Token.
    // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
    //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
    ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
    ////    if (!header_data.hasOwnProperty('kid')) {
    ////        // no kid defined in Jose header
    ////        if (jwtkeys.keys.length != 1) {
    ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
    ////            return false;
    ////        }
    ////    }
    ////    return true;
    //// }
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
    // is present in the ID Token.
    /**
     * @param {?} accessToken
     * @param {?} atHash
     * @param {?} isCodeFlow
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_at_hash = 
    // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
    //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
    ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
    ////    if (!header_data.hasOwnProperty('kid')) {
    ////        // no kid defined in Jose header
    ////        if (jwtkeys.keys.length != 1) {
    ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
    ////            return false;
    ////        }
    ////    }
    ////    return true;
    //// }
    // Access Token Validation
    // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
    // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
    // access_token C2: Take the left- most half of the hash and base64url- encode it.
    // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
    // is present in the ID Token.
    /**
     * @param {?} accessToken
     * @param {?} atHash
     * @param {?} isCodeFlow
     * @return {?}
     */
    function (accessToken, atHash, isCodeFlow) {
        this.loggerService.logDebug('at_hash from the server:' + atHash);
        // The at_hash is optional for the code flow
        if (isCodeFlow) {
            if (!((/** @type {?} */ (atHash)))) {
                this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
                return true;
            }
        }
        /** @type {?} */
        var testdata = this.generate_at_hash('' + accessToken);
        this.loggerService.logDebug('at_hash client validation not decoded:' + testdata);
        if (testdata === ((/** @type {?} */ (atHash)))) {
            return true; // isValid;
        }
        else {
            /** @type {?} */
            var testValue = this.generate_at_hash('' + decodeURIComponent(accessToken));
            this.loggerService.logDebug('-gen access--' + testValue);
            if (testValue === ((/** @type {?} */ (atHash)))) {
                return true; // isValid
            }
        }
        return false;
    };
    /**
     * @private
     * @param {?} accessToken
     * @return {?}
     */
    OidcSecurityValidation.prototype.generate_at_hash = /**
     * @private
     * @param {?} accessToken
     * @return {?}
     */
    function (accessToken) {
        /** @type {?} */
        var hash = KJUR.crypto.Util.hashString(accessToken, 'sha256');
        /** @type {?} */
        var first128bits = hash.substr(0, hash.length / 2);
        /** @type {?} */
        var testdata = hextob64u(first128bits);
        return testdata;
    };
    /**
     * @param {?} codeChallenge
     * @return {?}
     */
    OidcSecurityValidation.prototype.generate_code_verifier = /**
     * @param {?} codeChallenge
     * @return {?}
     */
    function (codeChallenge) {
        /** @type {?} */
        var hash = KJUR.crypto.Util.hashString(codeChallenge, 'sha256');
        /** @type {?} */
        var testdata = hextob64u(hash);
        return testdata;
    };
    OidcSecurityValidation.RefreshTokenNoncePlaceholder = '--RefreshToken--';
    OidcSecurityValidation.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityValidation.ctorParameters = function () { return [
        { type: EqualityHelperService },
        { type: TokenHelperService },
        { type: LoggerService }
    ]; };
    return OidcSecurityValidation;
}());
export { OidcSecurityValidation };
if (false) {
    /** @type {?} */
    OidcSecurityValidation.RefreshTokenNoncePlaceholder;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityValidation.prototype.arrayHelperService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityValidation.prototype.tokenHelperService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityValidation.prototype.loggerService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS52YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkudmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEN0RDtJQUlJLGdDQUNZLGtCQUF5QyxFQUN6QyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF1QjtRQUN6Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ3JDLENBQUM7SUFFSixxRkFBcUY7SUFDckYsdUVBQXVFOzs7Ozs7OztJQUN2RSwrQ0FBYzs7Ozs7Ozs7SUFBZCxVQUFlLEtBQWEsRUFBRSxhQUFzQjs7WUFDNUMsT0FBWTtRQUNoQixPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQscUZBQXFGO0lBQ3JGLHVFQUF1RTtJQUN2RSwwQ0FBMEM7Ozs7Ozs7OztJQUMxQyxrRUFB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QUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFaEMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQW5WTSxtREFBNEIsR0FBRyxrQkFBa0IsQ0FBQzs7Z0JBRjVELFVBQVU7Ozs7Z0JBOUNGLHFCQUFxQjtnQkFDckIsa0JBQWtCO2dCQUNsQixhQUFhOztJQWtZdEIsNkJBQUM7Q0FBQSxBQXRWRCxJQXNWQztTQXJWWSxzQkFBc0I7OztJQUMvQixvREFBeUQ7Ozs7O0lBR3JELG9EQUFpRDs7Ozs7SUFDakQsb0RBQThDOzs7OztJQUM5QywrQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGhleHRvYjY0dSwgS0VZVVRJTCwgS0pVUiB9IGZyb20gJ2pzcnNhc2lnbi1yZWR1Y2VkJztcclxuaW1wb3J0IHsgRXF1YWxpdHlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLWVxdWFsaXR5LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcblxyXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1pbXBsaWNpdC0xXzAuaHRtbFxyXG5cclxuLy8gaWRfdG9rZW5cclxuLy8gaWRfdG9rZW4gQzE6IFRoZSBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIE9wZW5JRCBQcm92aWRlciAod2hpY2ggaXMgdHlwaWNhbGx5IG9idGFpbmVkIGR1cmluZyBEaXNjb3ZlcnkpXHJcbi8vIE1VU1QgZXhhY3RseSBtYXRjaCB0aGUgdmFsdWUgb2YgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbS5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzI6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGF0IHRoZSBhdWQgKGF1ZGllbmNlKSBDbGFpbSBjb250YWlucyBpdHMgY2xpZW50X2lkIHZhbHVlIHJlZ2lzdGVyZWQgYXQgdGhlIElzc3VlciBpZGVudGlmaWVkXHJcbi8vIGJ5IHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0gYXMgYW4gYXVkaWVuY2UuVGhlIElEIFRva2VuIE1VU1QgYmUgcmVqZWN0ZWQgaWYgdGhlIElEIFRva2VuIGRvZXMgbm90IGxpc3QgdGhlIENsaWVudCBhcyBhIHZhbGlkIGF1ZGllbmNlLFxyXG4vLyBvciBpZiBpdCBjb250YWlucyBhZGRpdGlvbmFsIGF1ZGllbmNlcyBub3QgdHJ1c3RlZCBieSB0aGUgQ2xpZW50LlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMzogSWYgdGhlIElEIFRva2VuIGNvbnRhaW5zIG11bHRpcGxlIGF1ZGllbmNlcywgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgYW4gYXpwIENsYWltIGlzIHByZXNlbnQuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM0OiBJZiBhbiBhenAgKGF1dGhvcml6ZWQgcGFydHkpIENsYWltIGlzIHByZXNlbnQsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGl0cyBjbGllbnRfaWQgaXMgdGhlIENsYWltIFZhbHVlLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlXHJcbi8vIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM2OiBUaGUgYWxnIHZhbHVlIFNIT1VMRCBiZSBSUzI1Ni4gVmFsaWRhdGlvbiBvZiB0b2tlbnMgdXNpbmcgb3RoZXIgc2lnbmluZyBhbGdvcml0aG1zIGlzIGRlc2NyaWJlZCBpbiB0aGUgT3BlbklEIENvbm5lY3QgQ29yZSAxLjBcclxuLy8gW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudFxyXG4vLyBmb3IgY2xvY2sgc2tldykuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxyXG4vLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmUgdGhhdCB3YXMgc2VudFxyXG4vLyBpbiB0aGUgQXV0aGVudGljYXRpb24gUmVxdWVzdC5UaGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgbm9uY2UgdmFsdWUgZm9yIHJlcGxheSBhdHRhY2tzLlRoZSBwcmVjaXNlIG1ldGhvZCBmb3IgZGV0ZWN0aW5nIHJlcGxheSBhdHRhY2tzXHJcbi8vIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzEwOiBJZiB0aGUgYWNyIENsYWltIHdhcyByZXF1ZXN0ZWQsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoYXQgdGhlIGFzc2VydGVkIENsYWltIFZhbHVlIGlzIGFwcHJvcHJpYXRlLlxyXG4vLyBUaGUgbWVhbmluZyBhbmQgcHJvY2Vzc2luZyBvZiBhY3IgQ2xhaW0gVmFsdWVzIGlzIG91dCBvZiBzY29wZSBmb3IgdGhpcyBkb2N1bWVudC5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzExOiBXaGVuIGEgbWF4X2FnZSByZXF1ZXN0IGlzIG1hZGUsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBhdXRoX3RpbWUgQ2xhaW0gdmFsdWUgYW5kIHJlcXVlc3QgcmUtIGF1dGhlbnRpY2F0aW9uXHJcbi8vIGlmIGl0IGRldGVybWluZXMgdG9vIG11Y2ggdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCBFbmQtIFVzZXIgYXV0aGVudGljYXRpb24uXHJcblxyXG4vLyBBY2Nlc3MgVG9rZW4gVmFsaWRhdGlvblxyXG4vLyBhY2Nlc3NfdG9rZW4gQzE6IEhhc2ggdGhlIG9jdGV0cyBvZiB0aGUgQVNDSUkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2Vzc190b2tlbiB3aXRoIHRoZSBoYXNoIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gSldBW0pXQV1cclxuLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxyXG4vLyBhY2Nlc3NfdG9rZW4gQzI6IFRha2UgdGhlIGxlZnQtIG1vc3QgaGFsZiBvZiB0aGUgaGFzaCBhbmQgYmFzZTY0dXJsLSBlbmNvZGUgaXQuXHJcbi8vIGFjY2Vzc190b2tlbiBDMzogVGhlIHZhbHVlIG9mIGF0X2hhc2ggaW4gdGhlIElEIFRva2VuIE1VU1QgbWF0Y2ggdGhlIHZhbHVlIHByb2R1Y2VkIGluIHRoZSBwcmV2aW91cyBzdGVwIGlmIGF0X2hhc2ggaXMgcHJlc2VudCBpbiB0aGUgSUQgVG9rZW4uXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uIHtcclxuICAgIHN0YXRpYyBSZWZyZXNoVG9rZW5Ob25jZVBsYWNlaG9sZGVyID0gJy0tUmVmcmVzaFRva2VuLS0nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXJyYXlIZWxwZXJTZXJ2aWNlOiBFcXVhbGl0eUhlbHBlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltXHJcbiAgICAvLyAocG9zc2libHkgYWxsb3dpbmcgZm9yIHNvbWUgc21hbGwgbGVld2F5IHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcpLlxyXG4gICAgaXNUb2tlbkV4cGlyZWQodG9rZW46IHN0cmluZywgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBkZWNvZGVkOiBhbnk7XHJcbiAgICAgICAgZGVjb2RlZCA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4odG9rZW4sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbGlkYXRlX2lkX3Rva2VuX2V4cF9ub3RfZXhwaXJlZChkZWNvZGVkLCBvZmZzZXRTZWNvbmRzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltXHJcbiAgICAvLyAocG9zc2libHkgYWxsb3dpbmcgZm9yIHNvbWUgc21hbGwgbGVld2F5IHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcpLlxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB2YXJpYWJsZS1uYW1lXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9leHBfbm90X2V4cGlyZWQoZGVjb2RlZF9pZF90b2tlbjogc3RyaW5nLCBvZmZzZXRTZWNvbmRzPzogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5FeHBpcmF0aW9uRGF0ZSA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFRva2VuRXhwaXJhdGlvbkRhdGUoZGVjb2RlZF9pZF90b2tlbik7XHJcbiAgICAgICAgb2Zmc2V0U2Vjb25kcyA9IG9mZnNldFNlY29uZHMgfHwgMDtcclxuXHJcbiAgICAgICAgaWYgKCF0b2tlbkV4cGlyYXRpb25EYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJhdGlvblZhbHVlID0gdG9rZW5FeHBpcmF0aW9uRGF0ZS52YWx1ZU9mKCk7XHJcbiAgICAgICAgY29uc3Qgbm93V2l0aE9mZnNldCA9IG5ldyBEYXRlKCkudmFsdWVPZigpICsgb2Zmc2V0U2Vjb25kcyAqIDEwMDA7XHJcbiAgICAgICAgY29uc3QgdG9rZW5Ob3RFeHBpcmVkID0gdG9rZW5FeHBpcmF0aW9uVmFsdWUgPiBub3dXaXRoT2Zmc2V0O1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYFRva2VuIG5vdCBleHBpcmVkPzogJHt0b2tlbkV4cGlyYXRpb25WYWx1ZX0gPiAke25vd1dpdGhPZmZzZXR9ICAoJHt0b2tlbk5vdEV4cGlyZWR9KWApO1xyXG5cclxuICAgICAgICAvLyBUb2tlbiBub3QgZXhwaXJlZD9cclxuICAgICAgICByZXR1cm4gdG9rZW5Ob3RFeHBpcmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlzc1xyXG4gICAgLy8gUkVRVUlSRUQuIElzc3VlciBJZGVudGlmaWVyIGZvciB0aGUgSXNzdWVyIG9mIHRoZSByZXNwb25zZS5UaGUgaXNzIHZhbHVlIGlzIGEgY2FzZS1zZW5zaXRpdmUgVVJMIHVzaW5nIHRoZVxyXG4gICAgLy8gaHR0cHMgc2NoZW1lIHRoYXQgY29udGFpbnMgc2NoZW1lLCBob3N0LFxyXG4gICAgLy8gYW5kIG9wdGlvbmFsbHksIHBvcnQgbnVtYmVyIGFuZCBwYXRoIGNvbXBvbmVudHMgYW5kIG5vIHF1ZXJ5IG9yIGZyYWdtZW50IGNvbXBvbmVudHMuXHJcbiAgICAvL1xyXG4gICAgLy8gc3ViXHJcbiAgICAvLyBSRVFVSVJFRC4gU3ViamVjdCBJZGVudGlmaWVyLkxvY2FsbHkgdW5pcXVlIGFuZCBuZXZlciByZWFzc2lnbmVkIGlkZW50aWZpZXIgd2l0aGluIHRoZSBJc3N1ZXIgZm9yIHRoZSBFbmQtIFVzZXIsXHJcbiAgICAvLyB3aGljaCBpcyBpbnRlbmRlZCB0byBiZSBjb25zdW1lZCBieSB0aGUgQ2xpZW50LCBlLmcuLCAyNDQwMDMyMCBvciBBSXRPYXdtd3RXd2NUMGs1MUJheWV3TnZ1dHJKVXFzdmw2cXM3QTQuXHJcbiAgICAvLyBJdCBNVVNUIE5PVCBleGNlZWQgMjU1IEFTQ0lJIGNoYXJhY3RlcnMgaW4gbGVuZ3RoLlRoZSBzdWIgdmFsdWUgaXMgYSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXHJcbiAgICAvL1xyXG4gICAgLy8gYXVkXHJcbiAgICAvLyBSRVFVSVJFRC4gQXVkaWVuY2UocykgdGhhdCB0aGlzIElEIFRva2VuIGlzIGludGVuZGVkIGZvci4gSXQgTVVTVCBjb250YWluIHRoZSBPQXV0aCAyLjAgY2xpZW50X2lkIG9mIHRoZSBSZWx5aW5nIFBhcnR5IGFzIGFuIGF1ZGllbmNlIHZhbHVlLlxyXG4gICAgLy8gSXQgTUFZIGFsc28gY29udGFpbiBpZGVudGlmaWVycyBmb3Igb3RoZXIgYXVkaWVuY2VzLkluIHRoZSBnZW5lcmFsIGNhc2UsIHRoZSBhdWQgdmFsdWUgaXMgYW4gYXJyYXkgb2YgY2FzZS1zZW5zaXRpdmUgc3RyaW5ncy5cclxuICAgIC8vIEluIHRoZSBjb21tb24gc3BlY2lhbCBjYXNlIHdoZW4gdGhlcmUgaXMgb25lIGF1ZGllbmNlLCB0aGUgYXVkIHZhbHVlIE1BWSBiZSBhIHNpbmdsZSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXHJcbiAgICAvL1xyXG4gICAgLy8gZXhwXHJcbiAgICAvLyBSRVFVSVJFRC4gRXhwaXJhdGlvbiB0aW1lIG9uIG9yIGFmdGVyIHdoaWNoIHRoZSBJRCBUb2tlbiBNVVNUIE5PVCBiZSBhY2NlcHRlZCBmb3IgcHJvY2Vzc2luZy5cclxuICAgIC8vIFRoZSBwcm9jZXNzaW5nIG9mIHRoaXMgcGFyYW1ldGVyIHJlcXVpcmVzIHRoYXQgdGhlIGN1cnJlbnQgZGF0ZS8gdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgZXhwaXJhdGlvbiBkYXRlLyB0aW1lIGxpc3RlZCBpbiB0aGUgdmFsdWUuXHJcbiAgICAvLyBJbXBsZW1lbnRlcnMgTUFZIHByb3ZpZGUgZm9yIHNvbWUgc21hbGwgbGVld2F5LCB1c3VhbGx5IG5vIG1vcmUgdGhhbiBhIGZldyBtaW51dGVzLCB0byBhY2NvdW50IGZvciBjbG9jayBza2V3LlxyXG4gICAgLy8gSXRzIHZhbHVlIGlzIGEgSlNPTiBbUkZDNzE1OV0gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSAxOTcwLSAwMSAtIDAxVDAwOiAwMDowMFogYXMgbWVhc3VyZWQgaW4gVVRDIHVudGlsIHRoZSBkYXRlLyB0aW1lLlxyXG4gICAgLy8gU2VlIFJGQyAzMzM5IFtSRkMzMzM5XSBmb3IgZGV0YWlscyByZWdhcmRpbmcgZGF0ZS8gdGltZXMgaW4gZ2VuZXJhbCBhbmQgVVRDIGluIHBhcnRpY3VsYXIuXHJcbiAgICAvL1xyXG4gICAgLy8gaWF0XHJcbiAgICAvLyBSRVFVSVJFRC4gVGltZSBhdCB3aGljaCB0aGUgSldUIHdhcyBpc3N1ZWQuIEl0cyB2YWx1ZSBpcyBhIEpTT04gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbVxyXG4gICAgLy8gMTk3MC0gMDEgLSAwMVQwMDogMDA6IDAwWiBhcyBtZWFzdXJlZFxyXG4gICAgLy8gaW4gVVRDIHVudGlsIHRoZSBkYXRlLyB0aW1lLlxyXG4gICAgdmFsaWRhdGVfcmVxdWlyZWRfaWRfdG9rZW4oZGF0YUlkVG9rZW46IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCB2YWxpZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lzcycpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaXNzIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdzdWInKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ3N1YiBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnYXVkJykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdWQgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2V4cCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnZXhwIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2lhdCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDODogVGhlIGlhdCBDbGFpbSBjYW4gYmUgdXNlZCB0byByZWplY3QgdG9rZW5zIHRoYXQgd2VyZSBpc3N1ZWQgdG9vIGZhciBhd2F5IGZyb20gdGhlIGN1cnJlbnQgdGltZSxcclxuICAgIC8vIGxpbWl0aW5nIHRoZSBhbW91bnQgb2YgdGltZSB0aGF0IG5vbmNlcyBuZWVkIHRvIGJlIHN0b3JlZCB0byBwcmV2ZW50IGF0dGFja3MuVGhlIGFjY2VwdGFibGUgcmFuZ2UgaXMgQ2xpZW50IHNwZWNpZmljLlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5faWF0X21heF9vZmZzZXQoZGF0YUlkVG9rZW46IGFueSwgbWF4T2Zmc2V0QWxsb3dlZEluU2Vjb25kczogbnVtYmVyLCBkaXNhYmxlSWF0T2Zmc2V0VmFsaWRhdGlvbjogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChkaXNhYmxlSWF0T2Zmc2V0VmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVUaW1lSWF0SWRUb2tlbiA9IG5ldyBEYXRlKDApOyAvLyBUaGUgMCBoZXJlIGlzIHRoZSBrZXksIHdoaWNoIHNldHMgdGhlIGRhdGUgdG8gdGhlIGVwb2NoXHJcbiAgICAgICAgZGF0ZVRpbWVJYXRJZFRva2VuLnNldFVUQ1NlY29uZHMoZGF0YUlkVG9rZW4uaWF0KTtcclxuXHJcbiAgICAgICAgbWF4T2Zmc2V0QWxsb3dlZEluU2Vjb25kcyA9IG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgfHwgMDtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVUaW1lSWF0SWRUb2tlbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgICAgICAgJ3ZhbGlkYXRlX2lkX3Rva2VuX2lhdF9tYXhfb2Zmc2V0OiAnICsgKG5ldyBEYXRlKCkudmFsdWVPZigpIC0gZGF0ZVRpbWVJYXRJZFRva2VuLnZhbHVlT2YoKSkgKyAnIDwgJyArIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgKiAxMDAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS52YWx1ZU9mKCkgLSBkYXRlVGltZUlhdElkVG9rZW4udmFsdWVPZigpIDwgbWF4T2Zmc2V0QWxsb3dlZEluU2Vjb25kcyAqIDEwMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmVcclxuICAgIC8vIHRoYXQgd2FzIHNlbnQgaW4gdGhlIEF1dGhlbnRpY2F0aW9uIFJlcXVlc3QuVGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhlIG5vbmNlIHZhbHVlIGZvciByZXBsYXkgYXR0YWNrcy5cclxuICAgIC8vIFRoZSBwcmVjaXNlIG1ldGhvZCBmb3IgZGV0ZWN0aW5nIHJlcGxheSBhdHRhY2tzIGlzIENsaWVudCBzcGVjaWZpYy5cclxuXHJcbiAgICAvLyBIb3dldmVyIHRoZSBub25jZSBjbGFpbSBTSE9VTEQgbm90IGJlIHByZXNlbnQgZm9yIHRoZSByZWZlc2hfdG9rZW4gZ3JhbnQgdHlwZVxyXG4gICAgLy8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL29wZW5pZC9jb25uZWN0L2lzc3Vlcy8xMDI1L2FtYmlndWl0eS13aXRoLWhvdy1ub25jZS1pcy1oYW5kbGVkLW9uXHJcbiAgICAvLyBUaGUgY3VycmVudCBzcGVjIGlzIGFtYmlndW91cyBhbmQgS2V5Y2xvYWsgZG9lcyBzZW5kIGl0LlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fbm9uY2UoZGF0YUlkVG9rZW46IGFueSwgbG9jYWxOb25jZTogYW55LCBpZ25vcmVOb25jZUFmdGVyUmVmcmVzaDogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGlzRnJvbVJlZnJlc2hUb2tlbiA9XHJcbiAgICAgICAgICAgIChkYXRhSWRUb2tlbi5ub25jZSA9PT0gdW5kZWZpbmVkIHx8IGlnbm9yZU5vbmNlQWZ0ZXJSZWZyZXNoKSAmJiBsb2NhbE5vbmNlID09PSBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uLlJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXI7XHJcbiAgICAgICAgaWYgKCFpc0Zyb21SZWZyZXNoVG9rZW4gJiYgZGF0YUlkVG9rZW4ubm9uY2UgIT09IGxvY2FsTm9uY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdWYWxpZGF0ZV9pZF90b2tlbl9ub25jZSBmYWlsZWQsIGRhdGFJZFRva2VuLm5vbmNlOiAnICsgZGF0YUlkVG9rZW4ubm9uY2UgKyAnIGxvY2FsX25vbmNlOicgKyBsb2NhbE5vbmNlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzE6IFRoZSBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIE9wZW5JRCBQcm92aWRlciAod2hpY2ggaXMgdHlwaWNhbGx5IG9idGFpbmVkIGR1cmluZyBEaXNjb3ZlcnkpXHJcbiAgICAvLyBNVVNUIGV4YWN0bHkgbWF0Y2ggdGhlIHZhbHVlIG9mIHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0uXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHZhcmlhYmxlLW5hbWVcclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2lzcyhkYXRhSWRUb2tlbjogYW55LCBhdXRoV2VsbEtub3duRW5kcG9pbnRzX2lzc3VlcjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKChkYXRhSWRUb2tlbi5pc3MgYXMgc3RyaW5nKSAhPT0gKGF1dGhXZWxsS25vd25FbmRwb2ludHNfaXNzdWVyIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgICAgICAgICAgJ1ZhbGlkYXRlX2lkX3Rva2VuX2lzcyBmYWlsZWQsIGRhdGFJZFRva2VuLmlzczogJyArXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUlkVG9rZW4uaXNzICtcclxuICAgICAgICAgICAgICAgICAgICAnIGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXNzdWVyOicgK1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhXZWxsS25vd25FbmRwb2ludHNfaXNzdWVyXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEMyOiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhhdCB0aGUgYXVkIChhdWRpZW5jZSkgQ2xhaW0gY29udGFpbnMgaXRzIGNsaWVudF9pZCB2YWx1ZSByZWdpc3RlcmVkIGF0IHRoZSBJc3N1ZXIgaWRlbnRpZmllZFxyXG4gICAgLy8gYnkgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbSBhcyBhbiBhdWRpZW5jZS5cclxuICAgIC8vIFRoZSBJRCBUb2tlbiBNVVNUIGJlIHJlamVjdGVkIGlmIHRoZSBJRCBUb2tlbiBkb2VzIG5vdCBsaXN0IHRoZSBDbGllbnQgYXMgYSB2YWxpZCBhdWRpZW5jZSwgb3IgaWYgaXQgY29udGFpbnMgYWRkaXRpb25hbCBhdWRpZW5jZXNcclxuICAgIC8vIG5vdCB0cnVzdGVkIGJ5IHRoZSBDbGllbnQuXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9hdWQoZGF0YUlkVG9rZW46IGFueSwgYXVkOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoZGF0YUlkVG9rZW4uYXVkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcnJheUhlbHBlclNlcnZpY2UuYXJlRXF1YWwoZGF0YUlkVG9rZW4uYXVkLCBhdWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fYXVkICBhcnJheSBmYWlsZWQsIGRhdGFJZFRva2VuLmF1ZDogJyArIGRhdGFJZFRva2VuLmF1ZCArICcgY2xpZW50X2lkOicgKyBhdWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFJZFRva2VuLmF1ZCAhPT0gYXVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fYXVkIGZhaWxlZCwgZGF0YUlkVG9rZW4uYXVkOiAnICsgZGF0YUlkVG9rZW4uYXVkICsgJyBjbGllbnRfaWQ6JyArIGF1ZCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZVN0YXRlRnJvbUhhc2hDYWxsYmFjayhzdGF0ZTogYW55LCBsb2NhbFN0YXRlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoKHN0YXRlIGFzIHN0cmluZykgIT09IChsb2NhbFN0YXRlIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdWYWxpZGF0ZVN0YXRlRnJvbUhhc2hDYWxsYmFjayBmYWlsZWQsIHN0YXRlOiAnICsgc3RhdGUgKyAnIGxvY2FsX3N0YXRlOicgKyBsb2NhbFN0YXRlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGVfdXNlcmRhdGFfc3ViX2lkX3Rva2VuKGlkVG9rZW5TdWI6IGFueSwgdXNlcmRhdGFTdWI6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICgoaWRUb2tlblN1YiBhcyBzdHJpbmcpICE9PSAodXNlcmRhdGFTdWIgYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3ZhbGlkYXRlX3VzZXJkYXRhX3N1Yl9pZF90b2tlbiBmYWlsZWQsIGlkX3Rva2VuX3N1YjogJyArIGlkVG9rZW5TdWIgKyAnIHVzZXJkYXRhX3N1YjonICsgdXNlcmRhdGFTdWIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlIGFsZ1xyXG4gICAgLy8gSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSk9TRSBIZWFkZXIuVGhlIENsaWVudCBNVVNUIHVzZSB0aGUga2V5cyBwcm92aWRlZCBieSB0aGUgSXNzdWVyLlxyXG4gICAgLy8gaWRfdG9rZW4gQzY6IFRoZSBhbGcgdmFsdWUgU0hPVUxEIGJlIFJTMjU2LiBWYWxpZGF0aW9uIG9mIHRva2VucyB1c2luZyBvdGhlciBzaWduaW5nIGFsZ29yaXRobXMgaXMgZGVzY3JpYmVkIGluIHRoZVxyXG4gICAgLy8gT3BlbklEIENvbm5lY3QgQ29yZSAxLjAgW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4gICAgdmFsaWRhdGVfc2lnbmF0dXJlX2lkX3Rva2VuKGlkVG9rZW46IGFueSwgand0a2V5czogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFqd3RrZXlzIHx8ICFqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVyRGF0YSA9IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldEhlYWRlckZyb21Ub2tlbihpZFRva2VuLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhoZWFkZXJEYXRhKS5sZW5ndGggPT09IDAgJiYgaGVhZGVyRGF0YS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpZCB0b2tlbiBoYXMgbm8gaGVhZGVyIGRhdGEnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qga2lkID0gaGVhZGVyRGF0YS5raWQ7XHJcbiAgICAgICAgY29uc3QgYWxnID0gaGVhZGVyRGF0YS5hbGc7XHJcblxyXG4gICAgICAgIGlmICgnUlMyNTYnICE9PSAoYWxnIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ09ubHkgUlMyNTYgc3VwcG9ydGVkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghaGVhZGVyRGF0YS5oYXNPd25Qcm9wZXJ0eSgna2lkJykpIHtcclxuICAgICAgICAgICAgLy8gZXhhY3RseSAxIGtleSBpbiB0aGUgand0a2V5cyBhbmQgbm8ga2lkIGluIHRoZSBKb3NlIGhlYWRlclxyXG4gICAgICAgICAgICAvLyBrdHlcdFwiUlNBXCIgdXNlIFwic2lnXCJcclxuICAgICAgICAgICAgbGV0IGFtb3VudE9mTWF0Y2hpbmdLZXlzID0gMDtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygand0a2V5cy5rZXlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGtleS5rdHkgYXMgc3RyaW5nKSA9PT0gJ1JTQScgJiYgKGtleS51c2UgYXMgc3RyaW5nKSA9PT0gJ3NpZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbW91bnRPZk1hdGNoaW5nS2V5cyA9IGFtb3VudE9mTWF0Y2hpbmdLZXlzICsgMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFtb3VudE9mTWF0Y2hpbmdLZXlzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnbm8ga2V5cyBmb3VuZCwgaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW1vdW50T2ZNYXRjaGluZ0tleXMgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnbm8gSUQgVG9rZW4ga2lkIGNsYWltIGluIEpPU0UgaGVhZGVyIGFuZCBtdWx0aXBsZSBzdXBwbGllZCBpbiBqd2tzX3VyaScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygand0a2V5cy5rZXlzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChrZXkua3R5IGFzIHN0cmluZykgPT09ICdSU0EnICYmIChrZXkudXNlIGFzIHN0cmluZykgPT09ICdzaWcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1YmxpY2tleSA9IEtFWVVUSUwuZ2V0S2V5KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBLSlVSLmp3cy5KV1MudmVyaWZ5KGlkVG9rZW4sIHB1YmxpY2tleSwgWydSUzI1NiddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8ga2lkIGluIHRoZSBKb3NlIGhlYWRlciBvZiBpZF90b2tlblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoa2V5LmtpZCBhcyBzdHJpbmcpID09PSAoa2lkIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaWNrZXkgPSBLRVlVVElMLmdldEtleShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBLSlVSLmp3cy5KV1MudmVyaWZ5KGlkVG9rZW4sIHB1YmxpY2tleSwgWydSUzI1NiddKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2luY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlnX3ZhbGlkYXRlX3Jlc3BvbnNlX3R5cGUocmVzcG9uc2VUeXBlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAocmVzcG9uc2VUeXBlID09PSAnaWRfdG9rZW4gdG9rZW4nIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ2lkX3Rva2VuJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZVR5cGUgPT09ICdjb2RlJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdtb2R1bGUgY29uZmlndXJlIGluY29ycmVjdCwgaW52YWxpZCByZXNwb25zZV90eXBlOicgKyByZXNwb25zZVR5cGUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBY2NlcHRzIElEIFRva2VuIHdpdGhvdXQgJ2tpZCcgY2xhaW0gaW4gSk9TRSBoZWFkZXIgaWYgb25seSBvbmUgSldLIHN1cHBsaWVkIGluICdqd2tzX3VybCdcclxuICAgIC8vLy8gcHJpdmF0ZSB2YWxpZGF0ZV9ub19raWRfaW5faGVhZGVyX29ubHlfb25lX2FsbG93ZWRfaW5fand0a2V5cyhoZWFkZXJfZGF0YTogYW55LCBqd3RrZXlzOiBhbnkpOiBib29sZWFuIHtcclxuICAgIC8vLy8gICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ubG9nRGVidWcoJ2Ftb3VudCBvZiBqd3RrZXlzLmtleXM6ICcgKyBqd3RrZXlzLmtleXMubGVuZ3RoKTtcclxuICAgIC8vLy8gICAgaWYgKCFoZWFkZXJfZGF0YS5oYXNPd25Qcm9wZXJ0eSgna2lkJykpIHtcclxuICAgIC8vLy8gICAgICAgIC8vIG5vIGtpZCBkZWZpbmVkIGluIEpvc2UgaGVhZGVyXHJcbiAgICAvLy8vICAgICAgICBpZiAoand0a2V5cy5rZXlzLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAvLy8vICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ubG9nRGVidWcoJ2p3dGtleXMua2V5cy5sZW5ndGggIT0gMSBhbmQgbm8ga2lkIGluIGhlYWRlcicpO1xyXG4gICAgLy8vLyAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vLy8gICAgICAgIH1cclxuICAgIC8vLy8gICAgfVxyXG5cclxuICAgIC8vLy8gICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLy8vIH1cclxuXHJcbiAgICAvLyBBY2Nlc3MgVG9rZW4gVmFsaWRhdGlvblxyXG4gICAgLy8gYWNjZXNzX3Rva2VuIEMxOiBIYXNoIHRoZSBvY3RldHMgb2YgdGhlIEFTQ0lJIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3NfdG9rZW4gd2l0aCB0aGUgaGFzaCBhbGdvcml0aG0gc3BlY2lmaWVkIGluIEpXQVtKV0FdXHJcbiAgICAvLyBmb3IgdGhlIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBJRCBUb2tlbidzIEpPU0UgSGVhZGVyLiBGb3IgaW5zdGFuY2UsIGlmIHRoZSBhbGcgaXMgUlMyNTYsIHRoZSBoYXNoIGFsZ29yaXRobSB1c2VkIGlzIFNIQS0yNTYuXHJcbiAgICAvLyBhY2Nlc3NfdG9rZW4gQzI6IFRha2UgdGhlIGxlZnQtIG1vc3QgaGFsZiBvZiB0aGUgaGFzaCBhbmQgYmFzZTY0dXJsLSBlbmNvZGUgaXQuXHJcbiAgICAvLyBhY2Nlc3NfdG9rZW4gQzM6IFRoZSB2YWx1ZSBvZiBhdF9oYXNoIGluIHRoZSBJRCBUb2tlbiBNVVNUIG1hdGNoIHRoZSB2YWx1ZSBwcm9kdWNlZCBpbiB0aGUgcHJldmlvdXMgc3RlcCBpZiBhdF9oYXNoXHJcbiAgICAvLyBpcyBwcmVzZW50IGluIHRoZSBJRCBUb2tlbi5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2F0X2hhc2goYWNjZXNzVG9rZW46IGFueSwgYXRIYXNoOiBhbnksIGlzQ29kZUZsb3c6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F0X2hhc2ggZnJvbSB0aGUgc2VydmVyOicgKyBhdEhhc2gpO1xyXG5cclxuICAgICAgICAvLyBUaGUgYXRfaGFzaCBpcyBvcHRpb25hbCBmb3IgdGhlIGNvZGUgZmxvd1xyXG4gICAgICAgIGlmIChpc0NvZGVGbG93KSB7XHJcbiAgICAgICAgICAgIGlmICghKGF0SGFzaCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0NvZGUgRmxvdyBhY3RpdmUsIGFuZCBubyBhdF9oYXNoIGluIHRoZSBpZF90b2tlbiwgc2tpcHBpbmcgY2hlY2shJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGVzdGRhdGEgPSB0aGlzLmdlbmVyYXRlX2F0X2hhc2goJycgKyBhY2Nlc3NUb2tlbik7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdF9oYXNoIGNsaWVudCB2YWxpZGF0aW9uIG5vdCBkZWNvZGVkOicgKyB0ZXN0ZGF0YSk7XHJcbiAgICAgICAgaWYgKHRlc3RkYXRhID09PSAoYXRIYXNoIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGlzVmFsaWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGVzdFZhbHVlID0gdGhpcy5nZW5lcmF0ZV9hdF9oYXNoKCcnICsgZGVjb2RlVVJJQ29tcG9uZW50KGFjY2Vzc1Rva2VuKSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnLWdlbiBhY2Nlc3MtLScgKyB0ZXN0VmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGVzdFZhbHVlID09PSAoYXRIYXNoIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBpc1ZhbGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlX2F0X2hhc2goYWNjZXNzVG9rZW46IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaGFzaCA9IEtKVVIuY3J5cHRvLlV0aWwuaGFzaFN0cmluZyhhY2Nlc3NUb2tlbiwgJ3NoYTI1NicpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0MTI4Yml0cyA9IGhhc2guc3Vic3RyKDAsIGhhc2gubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgdGVzdGRhdGEgPSBoZXh0b2I2NHUoZmlyc3QxMjhiaXRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRlc3RkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlX2NvZGVfdmVyaWZpZXIoY29kZUNoYWxsZW5nZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBoYXNoID0gS0pVUi5jcnlwdG8uVXRpbC5oYXNoU3RyaW5nKGNvZGVDaGFsbGVuZ2UsICdzaGEyNTYnKTtcclxuICAgICAgICBjb25zdCB0ZXN0ZGF0YSA9IGhleHRvYjY0dShoYXNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRlc3RkYXRhO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==