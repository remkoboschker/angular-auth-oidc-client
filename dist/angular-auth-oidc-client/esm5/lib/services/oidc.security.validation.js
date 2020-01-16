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
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    OidcSecurityValidation.prototype.isTokenExpired = 
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
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
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} decoded_id_token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_exp_not_expired = 
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
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
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the https scheme that contains scheme, host,
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
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured
    // in UTC until the date/ time.
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the https scheme that contains scheme, host,
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
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured
    // in UTC until the date/ time.
    /**
     * @param {?} dataIdToken
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_required_id_token = 
    // iss
    // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the https scheme that contains scheme, host,
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
    // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured
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
     * @param {?} max_offset_allowed_in_seconds
     * @param {?} disable_iat_offset_validation
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_iat_max_offset = 
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    /**
     * @param {?} dataIdToken
     * @param {?} max_offset_allowed_in_seconds
     * @param {?} disable_iat_offset_validation
     * @return {?}
     */
    function (dataIdToken, max_offset_allowed_in_seconds, disable_iat_offset_validation) {
        if (disable_iat_offset_validation) {
            return true;
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            return false;
        }
        /** @type {?} */
        var dateTime_iat_id_token = new Date(0);
        dateTime_iat_id_token.setUTCSeconds(dataIdToken.iat);
        max_offset_allowed_in_seconds = max_offset_allowed_in_seconds || 0;
        if (dateTime_iat_id_token == null) {
            return false;
        }
        this.loggerService.logDebug('validate_id_token_iat_max_offset: ' +
            (new Date().valueOf() - dateTime_iat_id_token.valueOf()) +
            ' < ' +
            max_offset_allowed_in_seconds * 1000);
        return new Date().valueOf() - dateTime_iat_id_token.valueOf() < max_offset_allowed_in_seconds * 1000;
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
     * @param {?} local_nonce
     * @param {?} ignore_nonce_after_refresh
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
     * @param {?} local_nonce
     * @param {?} ignore_nonce_after_refresh
     * @return {?}
     */
    function (dataIdToken, local_nonce, ignore_nonce_after_refresh) {
        /** @type {?} */
        var isFromRefreshToken = (dataIdToken.nonce === undefined || ignore_nonce_after_refresh) && local_nonce === OidcSecurityValidation.RefreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== local_nonce) {
            this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + local_nonce);
            return false;
        }
        return true;
    };
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    /**
     * @param {?} dataIdToken
     * @param {?} authWellKnownEndpoints_issuer
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_id_token_iss = 
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
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
     * @param {?} local_state
     * @return {?}
     */
    OidcSecurityValidation.prototype.validateStateFromHashCallback = /**
     * @param {?} state
     * @param {?} local_state
     * @return {?}
     */
    function (state, local_state) {
        if (((/** @type {?} */ (state))) !== ((/** @type {?} */ (local_state)))) {
            this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + local_state);
            return false;
        }
        return true;
    };
    /**
     * @param {?} id_token_sub
     * @param {?} userdata_sub
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_userdata_sub_id_token = /**
     * @param {?} id_token_sub
     * @param {?} userdata_sub
     * @return {?}
     */
    function (id_token_sub, userdata_sub) {
        if (((/** @type {?} */ (id_token_sub))) !== ((/** @type {?} */ (userdata_sub)))) {
            this.loggerService.logDebug('validate_userdata_sub_id_token failed, id_token_sub: ' + id_token_sub + ' userdata_sub:' + userdata_sub);
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
     * @param {?} id_token
     * @param {?} jwtkeys
     * @return {?}
     */
    OidcSecurityValidation.prototype.validate_signature_id_token = 
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    /**
     * @param {?} id_token
     * @param {?} jwtkeys
     * @return {?}
     */
    function (id_token, jwtkeys) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (!jwtkeys || !jwtkeys.keys) {
            return false;
        }
        /** @type {?} */
        var header_data = this.tokenHelperService.getHeaderFromToken(id_token, false);
        if (Object.keys(header_data).length === 0 && header_data.constructor === Object) {
            this.loggerService.logWarning('id token has no header data');
            return false;
        }
        /** @type {?} */
        var kid = header_data.kid;
        /** @type {?} */
        var alg = header_data.alg;
        if ('RS256' !== ((/** @type {?} */ (alg)))) {
            this.loggerService.logWarning('Only RS256 supported');
            return false;
        }
        /** @type {?} */
        var isValid = false;
        if (!header_data.hasOwnProperty('kid')) {
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
                            isValid = KJUR.jws.JWS.verify(id_token, publickey, ['RS256']);
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
                        isValid = KJUR.jws.JWS.verify(id_token, publickey, ['RS256']);
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
     * @param {?} response_type
     * @return {?}
     */
    OidcSecurityValidation.prototype.config_validate_response_type = /**
     * @param {?} response_type
     * @return {?}
     */
    function (response_type) {
        if (response_type === 'id_token token' || response_type === 'id_token') {
            return true;
        }
        if (response_type === 'code') {
            return true;
        }
        this.loggerService.logWarning('module configure incorrect, invalid response_type:' + response_type);
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
     * @param {?} access_token
     * @param {?} at_hash
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
     * @param {?} access_token
     * @param {?} at_hash
     * @param {?} isCodeFlow
     * @return {?}
     */
    function (access_token, at_hash, isCodeFlow) {
        this.loggerService.logDebug('at_hash from the server:' + at_hash);
        // The at_hash is optional for the code flow
        if (isCodeFlow) {
            if (!((/** @type {?} */ (at_hash)))) {
                this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
                return true;
            }
        }
        /** @type {?} */
        var testdata = this.generate_at_hash('' + access_token);
        this.loggerService.logDebug('at_hash client validation not decoded:' + testdata);
        if (testdata === ((/** @type {?} */ (at_hash)))) {
            return true; // isValid;
        }
        else {
            /** @type {?} */
            var testValue = this.generate_at_hash('' + decodeURIComponent(access_token));
            this.loggerService.logDebug('-gen access--' + testValue);
            if (testValue === ((/** @type {?} */ (at_hash)))) {
                return true; // isValid
            }
        }
        return false;
    };
    /**
     * @private
     * @param {?} access_token
     * @return {?}
     */
    OidcSecurityValidation.prototype.generate_at_hash = /**
     * @private
     * @param {?} access_token
     * @return {?}
     */
    function (access_token) {
        /** @type {?} */
        var hash = KJUR.crypto.Util.hashString(access_token, 'sha256');
        /** @type {?} */
        var first128bits = hash.substr(0, hash.length / 2);
        /** @type {?} */
        var testdata = hextob64u(first128bits);
        return testdata;
    };
    /**
     * @param {?} code_challenge
     * @return {?}
     */
    OidcSecurityValidation.prototype.generate_code_verifier = /**
     * @param {?} code_challenge
     * @return {?}
     */
    function (code_challenge) {
        /** @type {?} */
        var hash = KJUR.crypto.Util.hashString(code_challenge, 'sha256');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS52YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkudmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEN0RDtJQUlJLGdDQUNZLGtCQUF5QyxFQUN6QyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF1QjtRQUN6Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ3JDLENBQUM7SUFFSiwwSkFBMEo7Ozs7Ozs7SUFDMUosK0NBQWM7Ozs7Ozs7SUFBZCxVQUFlLEtBQWEsRUFBRSxhQUFzQjs7WUFDNUMsT0FBWTtRQUNoQixPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsMEpBQTBKOzs7Ozs7O0lBQzFKLGtFQUFpQzs7Ozs7OztJQUFqQyxVQUFrQyxnQkFBd0IsRUFBRSxhQUFzQjs7WUFD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OztnQkFGNUQsVUFBVTs7OztnQkE5Q0YscUJBQXFCO2dCQUNyQixrQkFBa0I7Z0JBQ2xCLGFBQWE7O0lBK1h0Qiw2QkFBQztDQUFBLEFBblZELElBbVZDO1NBbFZZLHNCQUFzQjs7O0lBQy9CLG9EQUF5RDs7Ozs7SUFHckQsb0RBQWlEOzs7OztJQUNqRCxvREFBOEM7Ozs7O0lBQzlDLCtDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgaGV4dG9iNjR1LCBLRVlVVElMLCBLSlVSIH0gZnJvbSAnanNyc2FzaWduLXJlZHVjZWQnO1xyXG5pbXBvcnQgeyBFcXVhbGl0eUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtZXF1YWxpdHktaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuXHJcbi8vIGh0dHA6Ly9vcGVuaWQubmV0L3NwZWNzL29wZW5pZC1jb25uZWN0LWltcGxpY2l0LTFfMC5odG1sXHJcblxyXG4vLyBpZF90b2tlblxyXG4vLyBpZF90b2tlbiBDMTogVGhlIElzc3VlciBJZGVudGlmaWVyIGZvciB0aGUgT3BlbklEIFByb3ZpZGVyICh3aGljaCBpcyB0eXBpY2FsbHkgb2J0YWluZWQgZHVyaW5nIERpc2NvdmVyeSlcclxuLy8gTVVTVCBleGFjdGx5IG1hdGNoIHRoZSB2YWx1ZSBvZiB0aGUgaXNzIChpc3N1ZXIpIENsYWltLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMjogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoYXQgdGhlIGF1ZCAoYXVkaWVuY2UpIENsYWltIGNvbnRhaW5zIGl0cyBjbGllbnRfaWQgdmFsdWUgcmVnaXN0ZXJlZCBhdCB0aGUgSXNzdWVyIGlkZW50aWZpZWRcclxuLy8gYnkgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbSBhcyBhbiBhdWRpZW5jZS5UaGUgSUQgVG9rZW4gTVVTVCBiZSByZWplY3RlZCBpZiB0aGUgSUQgVG9rZW4gZG9lcyBub3QgbGlzdCB0aGUgQ2xpZW50IGFzIGEgdmFsaWQgYXVkaWVuY2UsXHJcbi8vIG9yIGlmIGl0IGNvbnRhaW5zIGFkZGl0aW9uYWwgYXVkaWVuY2VzIG5vdCB0cnVzdGVkIGJ5IHRoZSBDbGllbnQuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEMzOiBJZiB0aGUgSUQgVG9rZW4gY29udGFpbnMgbXVsdGlwbGUgYXVkaWVuY2VzLCB0aGUgQ2xpZW50IFNIT1VMRCB2ZXJpZnkgdGhhdCBhbiBhenAgQ2xhaW0gaXMgcHJlc2VudC5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzQ6IElmIGFuIGF6cCAoYXV0aG9yaXplZCBwYXJ0eSkgQ2xhaW0gaXMgcHJlc2VudCwgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgaXRzIGNsaWVudF9pZCBpcyB0aGUgQ2xhaW0gVmFsdWUuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM1OiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhlIHNpZ25hdHVyZSBvZiB0aGUgSUQgVG9rZW4gYWNjb3JkaW5nIHRvIEpXUyBbSldTXSB1c2luZyB0aGUgYWxnb3JpdGhtIHNwZWNpZmllZCBpbiB0aGVcclxuLy8gYWxnIEhlYWRlciBQYXJhbWV0ZXIgb2YgdGhlIEpPU0UgSGVhZGVyLlRoZSBDbGllbnQgTVVTVCB1c2UgdGhlIGtleXMgcHJvdmlkZWQgYnkgdGhlIElzc3Vlci5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzY6IFRoZSBhbGcgdmFsdWUgU0hPVUxEIGJlIFJTMjU2LiBWYWxpZGF0aW9uIG9mIHRva2VucyB1c2luZyBvdGhlciBzaWduaW5nIGFsZ29yaXRobXMgaXMgZGVzY3JpYmVkIGluIHRoZSBPcGVuSUQgQ29ubmVjdCBDb3JlIDEuMFxyXG4vLyBbT3BlbklELkNvcmVdIHNwZWNpZmljYXRpb24uXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM3OiBUaGUgY3VycmVudCB0aW1lIE1VU1QgYmUgYmVmb3JlIHRoZSB0aW1lIHJlcHJlc2VudGVkIGJ5IHRoZSBleHAgQ2xhaW0gKHBvc3NpYmx5IGFsbG93aW5nIGZvciBzb21lIHNtYWxsIGxlZXdheSB0byBhY2NvdW50XHJcbi8vIGZvciBjbG9jayBza2V3KS5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzg6IFRoZSBpYXQgQ2xhaW0gY2FuIGJlIHVzZWQgdG8gcmVqZWN0IHRva2VucyB0aGF0IHdlcmUgaXNzdWVkIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRpbWUsXHJcbi8vIGxpbWl0aW5nIHRoZSBhbW91bnQgb2YgdGltZSB0aGF0IG5vbmNlcyBuZWVkIHRvIGJlIHN0b3JlZCB0byBwcmV2ZW50IGF0dGFja3MuVGhlIGFjY2VwdGFibGUgcmFuZ2UgaXMgQ2xpZW50IHNwZWNpZmljLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDOTogVGhlIHZhbHVlIG9mIHRoZSBub25jZSBDbGFpbSBNVVNUIGJlIGNoZWNrZWQgdG8gdmVyaWZ5IHRoYXQgaXQgaXMgdGhlIHNhbWUgdmFsdWUgYXMgdGhlIG9uZSB0aGF0IHdhcyBzZW50XHJcbi8vIGluIHRoZSBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0LlRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBub25jZSB2YWx1ZSBmb3IgcmVwbGF5IGF0dGFja3MuVGhlIHByZWNpc2UgbWV0aG9kIGZvciBkZXRlY3RpbmcgcmVwbGF5IGF0dGFja3NcclxuLy8gaXMgQ2xpZW50IHNwZWNpZmljLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMTA6IElmIHRoZSBhY3IgQ2xhaW0gd2FzIHJlcXVlc3RlZCwgdGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhhdCB0aGUgYXNzZXJ0ZWQgQ2xhaW0gVmFsdWUgaXMgYXBwcm9wcmlhdGUuXHJcbi8vIFRoZSBtZWFuaW5nIGFuZCBwcm9jZXNzaW5nIG9mIGFjciBDbGFpbSBWYWx1ZXMgaXMgb3V0IG9mIHNjb3BlIGZvciB0aGlzIGRvY3VtZW50LlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMTE6IFdoZW4gYSBtYXhfYWdlIHJlcXVlc3QgaXMgbWFkZSwgdGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhlIGF1dGhfdGltZSBDbGFpbSB2YWx1ZSBhbmQgcmVxdWVzdCByZS0gYXV0aGVudGljYXRpb25cclxuLy8gaWYgaXQgZGV0ZXJtaW5lcyB0b28gbXVjaCB0aW1lIGhhcyBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IEVuZC0gVXNlciBhdXRoZW50aWNhdGlvbi5cclxuXHJcbi8vIEFjY2VzcyBUb2tlbiBWYWxpZGF0aW9uXHJcbi8vIGFjY2Vzc190b2tlbiBDMTogSGFzaCB0aGUgb2N0ZXRzIG9mIHRoZSBBU0NJSSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzX3Rva2VuIHdpdGggdGhlIGhhc2ggYWxnb3JpdGhtIHNwZWNpZmllZCBpbiBKV0FbSldBXVxyXG4vLyBmb3IgdGhlIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBJRCBUb2tlbidzIEpPU0UgSGVhZGVyLiBGb3IgaW5zdGFuY2UsIGlmIHRoZSBhbGcgaXMgUlMyNTYsIHRoZSBoYXNoIGFsZ29yaXRobSB1c2VkIGlzIFNIQS0yNTYuXHJcbi8vIGFjY2Vzc190b2tlbiBDMjogVGFrZSB0aGUgbGVmdC0gbW9zdCBoYWxmIG9mIHRoZSBoYXNoIGFuZCBiYXNlNjR1cmwtIGVuY29kZSBpdC5cclxuLy8gYWNjZXNzX3Rva2VuIEMzOiBUaGUgdmFsdWUgb2YgYXRfaGFzaCBpbiB0aGUgSUQgVG9rZW4gTVVTVCBtYXRjaCB0aGUgdmFsdWUgcHJvZHVjZWQgaW4gdGhlIHByZXZpb3VzIHN0ZXAgaWYgYXRfaGFzaCBpcyBwcmVzZW50IGluIHRoZSBJRCBUb2tlbi5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE9pZGNTZWN1cml0eVZhbGlkYXRpb24ge1xyXG4gICAgc3RhdGljIFJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXIgPSAnLS1SZWZyZXNoVG9rZW4tLSc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBhcnJheUhlbHBlclNlcnZpY2U6IEVxdWFsaXR5SGVscGVyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHRva2VuSGVscGVyU2VydmljZTogVG9rZW5IZWxwZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZVxyXG4gICAgKSB7fVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM3OiBUaGUgY3VycmVudCB0aW1lIE1VU1QgYmUgYmVmb3JlIHRoZSB0aW1lIHJlcHJlc2VudGVkIGJ5IHRoZSBleHAgQ2xhaW0gKHBvc3NpYmx5IGFsbG93aW5nIGZvciBzb21lIHNtYWxsIGxlZXdheSB0byBhY2NvdW50IGZvciBjbG9jayBza2V3KS5cclxuICAgIGlzVG9rZW5FeHBpcmVkKHRva2VuOiBzdHJpbmcsIG9mZnNldFNlY29uZHM/OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgZGVjb2RlZDogYW55O1xyXG4gICAgICAgIGRlY29kZWQgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiAhdGhpcy52YWxpZGF0ZV9pZF90b2tlbl9leHBfbm90X2V4cGlyZWQoZGVjb2RlZCwgb2Zmc2V0U2Vjb25kcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzc6IFRoZSBjdXJyZW50IHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIHRpbWUgcmVwcmVzZW50ZWQgYnkgdGhlIGV4cCBDbGFpbSAocG9zc2libHkgYWxsb3dpbmcgZm9yIHNvbWUgc21hbGwgbGVld2F5IHRvIGFjY291bnQgZm9yIGNsb2NrIHNrZXcpLlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fZXhwX25vdF9leHBpcmVkKGRlY29kZWRfaWRfdG9rZW46IHN0cmluZywgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJhdGlvbkRhdGUgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRUb2tlbkV4cGlyYXRpb25EYXRlKGRlY29kZWRfaWRfdG9rZW4pO1xyXG4gICAgICAgIG9mZnNldFNlY29uZHMgPSBvZmZzZXRTZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgICAgIGlmICghdG9rZW5FeHBpcmF0aW9uRGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbkV4cGlyYXRpb25WYWx1ZSA9IHRva2VuRXhwaXJhdGlvbkRhdGUudmFsdWVPZigpO1xyXG4gICAgICAgIGNvbnN0IG5vd1dpdGhPZmZzZXQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKSArIG9mZnNldFNlY29uZHMgKiAxMDAwO1xyXG4gICAgICAgIGNvbnN0IHRva2VuTm90RXhwaXJlZCA9IHRva2VuRXhwaXJhdGlvblZhbHVlID4gbm93V2l0aE9mZnNldDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBUb2tlbiBub3QgZXhwaXJlZD86ICR7dG9rZW5FeHBpcmF0aW9uVmFsdWV9ID4gJHtub3dXaXRoT2Zmc2V0fSAgKCR7dG9rZW5Ob3RFeHBpcmVkfSlgKTtcclxuXHJcbiAgICAgICAgLy8gVG9rZW4gbm90IGV4cGlyZWQ/XHJcbiAgICAgICAgcmV0dXJuIHRva2VuTm90RXhwaXJlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpc3NcclxuICAgIC8vIFJFUVVJUkVELiBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIElzc3VlciBvZiB0aGUgcmVzcG9uc2UuVGhlIGlzcyB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIFVSTCB1c2luZyB0aGUgaHR0cHMgc2NoZW1lIHRoYXQgY29udGFpbnMgc2NoZW1lLCBob3N0LFxyXG4gICAgLy8gYW5kIG9wdGlvbmFsbHksIHBvcnQgbnVtYmVyIGFuZCBwYXRoIGNvbXBvbmVudHMgYW5kIG5vIHF1ZXJ5IG9yIGZyYWdtZW50IGNvbXBvbmVudHMuXHJcbiAgICAvL1xyXG4gICAgLy8gc3ViXHJcbiAgICAvLyBSRVFVSVJFRC4gU3ViamVjdCBJZGVudGlmaWVyLkxvY2FsbHkgdW5pcXVlIGFuZCBuZXZlciByZWFzc2lnbmVkIGlkZW50aWZpZXIgd2l0aGluIHRoZSBJc3N1ZXIgZm9yIHRoZSBFbmQtIFVzZXIsXHJcbiAgICAvLyB3aGljaCBpcyBpbnRlbmRlZCB0byBiZSBjb25zdW1lZCBieSB0aGUgQ2xpZW50LCBlLmcuLCAyNDQwMDMyMCBvciBBSXRPYXdtd3RXd2NUMGs1MUJheWV3TnZ1dHJKVXFzdmw2cXM3QTQuXHJcbiAgICAvLyBJdCBNVVNUIE5PVCBleGNlZWQgMjU1IEFTQ0lJIGNoYXJhY3RlcnMgaW4gbGVuZ3RoLlRoZSBzdWIgdmFsdWUgaXMgYSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXHJcbiAgICAvL1xyXG4gICAgLy8gYXVkXHJcbiAgICAvLyBSRVFVSVJFRC4gQXVkaWVuY2UocykgdGhhdCB0aGlzIElEIFRva2VuIGlzIGludGVuZGVkIGZvci4gSXQgTVVTVCBjb250YWluIHRoZSBPQXV0aCAyLjAgY2xpZW50X2lkIG9mIHRoZSBSZWx5aW5nIFBhcnR5IGFzIGFuIGF1ZGllbmNlIHZhbHVlLlxyXG4gICAgLy8gSXQgTUFZIGFsc28gY29udGFpbiBpZGVudGlmaWVycyBmb3Igb3RoZXIgYXVkaWVuY2VzLkluIHRoZSBnZW5lcmFsIGNhc2UsIHRoZSBhdWQgdmFsdWUgaXMgYW4gYXJyYXkgb2YgY2FzZS1zZW5zaXRpdmUgc3RyaW5ncy5cclxuICAgIC8vIEluIHRoZSBjb21tb24gc3BlY2lhbCBjYXNlIHdoZW4gdGhlcmUgaXMgb25lIGF1ZGllbmNlLCB0aGUgYXVkIHZhbHVlIE1BWSBiZSBhIHNpbmdsZSBjYXNlLXNlbnNpdGl2ZSBzdHJpbmcuXHJcbiAgICAvL1xyXG4gICAgLy8gZXhwXHJcbiAgICAvLyBSRVFVSVJFRC4gRXhwaXJhdGlvbiB0aW1lIG9uIG9yIGFmdGVyIHdoaWNoIHRoZSBJRCBUb2tlbiBNVVNUIE5PVCBiZSBhY2NlcHRlZCBmb3IgcHJvY2Vzc2luZy5cclxuICAgIC8vIFRoZSBwcm9jZXNzaW5nIG9mIHRoaXMgcGFyYW1ldGVyIHJlcXVpcmVzIHRoYXQgdGhlIGN1cnJlbnQgZGF0ZS8gdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgZXhwaXJhdGlvbiBkYXRlLyB0aW1lIGxpc3RlZCBpbiB0aGUgdmFsdWUuXHJcbiAgICAvLyBJbXBsZW1lbnRlcnMgTUFZIHByb3ZpZGUgZm9yIHNvbWUgc21hbGwgbGVld2F5LCB1c3VhbGx5IG5vIG1vcmUgdGhhbiBhIGZldyBtaW51dGVzLCB0byBhY2NvdW50IGZvciBjbG9jayBza2V3LlxyXG4gICAgLy8gSXRzIHZhbHVlIGlzIGEgSlNPTiBbUkZDNzE1OV0gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSAxOTcwLSAwMSAtIDAxVDAwOiAwMDowMFogYXMgbWVhc3VyZWQgaW4gVVRDIHVudGlsIHRoZSBkYXRlLyB0aW1lLlxyXG4gICAgLy8gU2VlIFJGQyAzMzM5IFtSRkMzMzM5XSBmb3IgZGV0YWlscyByZWdhcmRpbmcgZGF0ZS8gdGltZXMgaW4gZ2VuZXJhbCBhbmQgVVRDIGluIHBhcnRpY3VsYXIuXHJcbiAgICAvL1xyXG4gICAgLy8gaWF0XHJcbiAgICAvLyBSRVFVSVJFRC4gVGltZSBhdCB3aGljaCB0aGUgSldUIHdhcyBpc3N1ZWQuIEl0cyB2YWx1ZSBpcyBhIEpTT04gbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSAxOTcwLSAwMSAtIDAxVDAwOiAwMDowMFogYXMgbWVhc3VyZWRcclxuICAgIC8vIGluIFVUQyB1bnRpbCB0aGUgZGF0ZS8gdGltZS5cclxuICAgIHZhbGlkYXRlX3JlcXVpcmVkX2lkX3Rva2VuKGRhdGFJZFRva2VuOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdpc3MnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2lzcyBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnc3ViJykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdzdWIgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2F1ZCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXVkIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdleHAnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2V4cCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpYXQgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzg6IFRoZSBpYXQgQ2xhaW0gY2FuIGJlIHVzZWQgdG8gcmVqZWN0IHRva2VucyB0aGF0IHdlcmUgaXNzdWVkIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRpbWUsXHJcbiAgICAvLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2lhdF9tYXhfb2Zmc2V0KGRhdGFJZFRva2VuOiBhbnksIG1heF9vZmZzZXRfYWxsb3dlZF9pbl9zZWNvbmRzOiBudW1iZXIsIGRpc2FibGVfaWF0X29mZnNldF92YWxpZGF0aW9uOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGRpc2FibGVfaWF0X29mZnNldF92YWxpZGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVfaWF0X2lkX3Rva2VuID0gbmV3IERhdGUoMCk7IC8vIFRoZSAwIGhlcmUgaXMgdGhlIGtleSwgd2hpY2ggc2V0cyB0aGUgZGF0ZSB0byB0aGUgZXBvY2hcclxuICAgICAgICBkYXRlVGltZV9pYXRfaWRfdG9rZW4uc2V0VVRDU2Vjb25kcyhkYXRhSWRUb2tlbi5pYXQpO1xyXG5cclxuICAgICAgICBtYXhfb2Zmc2V0X2FsbG93ZWRfaW5fc2Vjb25kcyA9IG1heF9vZmZzZXRfYWxsb3dlZF9pbl9zZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgICAgIGlmIChkYXRlVGltZV9pYXRfaWRfdG9rZW4gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgICAgICAgICd2YWxpZGF0ZV9pZF90b2tlbl9pYXRfbWF4X29mZnNldDogJyArXHJcbiAgICAgICAgICAgICAgICAobmV3IERhdGUoKS52YWx1ZU9mKCkgLSBkYXRlVGltZV9pYXRfaWRfdG9rZW4udmFsdWVPZigpKSArXHJcbiAgICAgICAgICAgICAgICAnIDwgJyArXHJcbiAgICAgICAgICAgICAgICBtYXhfb2Zmc2V0X2FsbG93ZWRfaW5fc2Vjb25kcyAqIDEwMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKSAtIGRhdGVUaW1lX2lhdF9pZF90b2tlbi52YWx1ZU9mKCkgPCBtYXhfb2Zmc2V0X2FsbG93ZWRfaW5fc2Vjb25kcyAqIDEwMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmVcclxuICAgIC8vIHRoYXQgd2FzIHNlbnQgaW4gdGhlIEF1dGhlbnRpY2F0aW9uIFJlcXVlc3QuVGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhlIG5vbmNlIHZhbHVlIGZvciByZXBsYXkgYXR0YWNrcy5cclxuICAgIC8vIFRoZSBwcmVjaXNlIG1ldGhvZCBmb3IgZGV0ZWN0aW5nIHJlcGxheSBhdHRhY2tzIGlzIENsaWVudCBzcGVjaWZpYy5cclxuXHJcbiAgICAvLyBIb3dldmVyIHRoZSBub25jZSBjbGFpbSBTSE9VTEQgbm90IGJlIHByZXNlbnQgZm9yIHRoZSByZWZlc2hfdG9rZW4gZ3JhbnQgdHlwZVxyXG4gICAgLy8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL29wZW5pZC9jb25uZWN0L2lzc3Vlcy8xMDI1L2FtYmlndWl0eS13aXRoLWhvdy1ub25jZS1pcy1oYW5kbGVkLW9uXHJcbiAgICAvLyBUaGUgY3VycmVudCBzcGVjIGlzIGFtYmlndW91cyBhbmQgS2V5Y2xvYWsgZG9lcyBzZW5kIGl0LlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fbm9uY2UoZGF0YUlkVG9rZW46IGFueSwgbG9jYWxfbm9uY2U6IGFueSwgaWdub3JlX25vbmNlX2FmdGVyX3JlZnJlc2g6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc0Zyb21SZWZyZXNoVG9rZW4gPVxyXG4gICAgICAgICAgICAoZGF0YUlkVG9rZW4ubm9uY2UgPT09IHVuZGVmaW5lZCB8fCBpZ25vcmVfbm9uY2VfYWZ0ZXJfcmVmcmVzaCkgJiYgbG9jYWxfbm9uY2UgPT09IE9pZGNTZWN1cml0eVZhbGlkYXRpb24uUmVmcmVzaFRva2VuTm9uY2VQbGFjZWhvbGRlcjtcclxuICAgICAgICBpZiAoIWlzRnJvbVJlZnJlc2hUb2tlbiAmJiBkYXRhSWRUb2tlbi5ub25jZSAhPT0gbG9jYWxfbm9uY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdWYWxpZGF0ZV9pZF90b2tlbl9ub25jZSBmYWlsZWQsIGRhdGFJZFRva2VuLm5vbmNlOiAnICsgZGF0YUlkVG9rZW4ubm9uY2UgKyAnIGxvY2FsX25vbmNlOicgKyBsb2NhbF9ub25jZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEMxOiBUaGUgSXNzdWVyIElkZW50aWZpZXIgZm9yIHRoZSBPcGVuSUQgUHJvdmlkZXIgKHdoaWNoIGlzIHR5cGljYWxseSBvYnRhaW5lZCBkdXJpbmcgRGlzY292ZXJ5KVxyXG4gICAgLy8gTVVTVCBleGFjdGx5IG1hdGNoIHRoZSB2YWx1ZSBvZiB0aGUgaXNzIChpc3N1ZXIpIENsYWltLlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5faXNzKGRhdGFJZFRva2VuOiBhbnksIGF1dGhXZWxsS25vd25FbmRwb2ludHNfaXNzdWVyOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoKGRhdGFJZFRva2VuLmlzcyBhcyBzdHJpbmcpICE9PSAoYXV0aFdlbGxLbm93bkVuZHBvaW50c19pc3N1ZXIgYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgICAgICAgICAgICAnVmFsaWRhdGVfaWRfdG9rZW5faXNzIGZhaWxlZCwgZGF0YUlkVG9rZW4uaXNzOiAnICtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhSWRUb2tlbi5pc3MgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpc3N1ZXI6JyArXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aFdlbGxLbm93bkVuZHBvaW50c19pc3N1ZXJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzI6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGF0IHRoZSBhdWQgKGF1ZGllbmNlKSBDbGFpbSBjb250YWlucyBpdHMgY2xpZW50X2lkIHZhbHVlIHJlZ2lzdGVyZWQgYXQgdGhlIElzc3VlciBpZGVudGlmaWVkXHJcbiAgICAvLyBieSB0aGUgaXNzIChpc3N1ZXIpIENsYWltIGFzIGFuIGF1ZGllbmNlLlxyXG4gICAgLy8gVGhlIElEIFRva2VuIE1VU1QgYmUgcmVqZWN0ZWQgaWYgdGhlIElEIFRva2VuIGRvZXMgbm90IGxpc3QgdGhlIENsaWVudCBhcyBhIHZhbGlkIGF1ZGllbmNlLCBvciBpZiBpdCBjb250YWlucyBhZGRpdGlvbmFsIGF1ZGllbmNlc1xyXG4gICAgLy8gbm90IHRydXN0ZWQgYnkgdGhlIENsaWVudC5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2F1ZChkYXRhSWRUb2tlbjogYW55LCBhdWQ6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChkYXRhSWRUb2tlbi5hdWQgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmFycmF5SGVscGVyU2VydmljZS5hcmVFcXVhbChkYXRhSWRUb2tlbi5hdWQsIGF1ZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdWYWxpZGF0ZV9pZF90b2tlbl9hdWQgIGFycmF5IGZhaWxlZCwgZGF0YUlkVG9rZW4uYXVkOiAnICsgZGF0YUlkVG9rZW4uYXVkICsgJyBjbGllbnRfaWQ6JyArIGF1ZCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YUlkVG9rZW4uYXVkICE9PSBhdWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdWYWxpZGF0ZV9pZF90b2tlbl9hdWQgZmFpbGVkLCBkYXRhSWRUb2tlbi5hdWQ6ICcgKyBkYXRhSWRUb2tlbi5hdWQgKyAnIGNsaWVudF9pZDonICsgYXVkKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKHN0YXRlOiBhbnksIGxvY2FsX3N0YXRlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoKHN0YXRlIGFzIHN0cmluZykgIT09IChsb2NhbF9zdGF0ZSBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2sgZmFpbGVkLCBzdGF0ZTogJyArIHN0YXRlICsgJyBsb2NhbF9zdGF0ZTonICsgbG9jYWxfc3RhdGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZV91c2VyZGF0YV9zdWJfaWRfdG9rZW4oaWRfdG9rZW5fc3ViOiBhbnksIHVzZXJkYXRhX3N1YjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKChpZF90b2tlbl9zdWIgYXMgc3RyaW5nKSAhPT0gKHVzZXJkYXRhX3N1YiBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygndmFsaWRhdGVfdXNlcmRhdGFfc3ViX2lkX3Rva2VuIGZhaWxlZCwgaWRfdG9rZW5fc3ViOiAnICsgaWRfdG9rZW5fc3ViICsgJyB1c2VyZGF0YV9zdWI6JyArIHVzZXJkYXRhX3N1Yik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM1OiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhlIHNpZ25hdHVyZSBvZiB0aGUgSUQgVG9rZW4gYWNjb3JkaW5nIHRvIEpXUyBbSldTXSB1c2luZyB0aGUgYWxnb3JpdGhtIHNwZWNpZmllZCBpbiB0aGUgYWxnXHJcbiAgICAvLyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXHJcbiAgICAvLyBpZF90b2tlbiBDNjogVGhlIGFsZyB2YWx1ZSBTSE9VTEQgYmUgUlMyNTYuIFZhbGlkYXRpb24gb2YgdG9rZW5zIHVzaW5nIG90aGVyIHNpZ25pbmcgYWxnb3JpdGhtcyBpcyBkZXNjcmliZWQgaW4gdGhlXHJcbiAgICAvLyBPcGVuSUQgQ29ubmVjdCBDb3JlIDEuMCBbT3BlbklELkNvcmVdIHNwZWNpZmljYXRpb24uXHJcbiAgICB2YWxpZGF0ZV9zaWduYXR1cmVfaWRfdG9rZW4oaWRfdG9rZW46IGFueSwgand0a2V5czogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFqd3RrZXlzIHx8ICFqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGVyX2RhdGEgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRIZWFkZXJGcm9tVG9rZW4oaWRfdG9rZW4sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGhlYWRlcl9kYXRhKS5sZW5ndGggPT09IDAgJiYgaGVhZGVyX2RhdGEuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaWQgdG9rZW4gaGFzIG5vIGhlYWRlciBkYXRhJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGtpZCA9IGhlYWRlcl9kYXRhLmtpZDtcclxuICAgICAgICBjb25zdCBhbGcgPSBoZWFkZXJfZGF0YS5hbGc7XHJcblxyXG4gICAgICAgIGlmICgnUlMyNTYnICE9PSAoYWxnIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ09ubHkgUlMyNTYgc3VwcG9ydGVkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghaGVhZGVyX2RhdGEuaGFzT3duUHJvcGVydHkoJ2tpZCcpKSB7XHJcbiAgICAgICAgICAgIC8vIGV4YWN0bHkgMSBrZXkgaW4gdGhlIGp3dGtleXMgYW5kIG5vIGtpZCBpbiB0aGUgSm9zZSBoZWFkZXJcclxuICAgICAgICAgICAgLy8ga3R5XHRcIlJTQVwiIHVzZSBcInNpZ1wiXHJcbiAgICAgICAgICAgIGxldCBhbW91bnRPZk1hdGNoaW5nS2V5cyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGp3dGtleXMua2V5cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChrZXkua3R5IGFzIHN0cmluZykgPT09ICdSU0EnICYmIChrZXkudXNlIGFzIHN0cmluZykgPT09ICdzaWcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50T2ZNYXRjaGluZ0tleXMgPSBhbW91bnRPZk1hdGNoaW5nS2V5cyArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhbW91bnRPZk1hdGNoaW5nS2V5cyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ25vIGtleXMgZm91bmQsIGluY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFtb3VudE9mTWF0Y2hpbmdLZXlzID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ25vIElEIFRva2VuIGtpZCBjbGFpbSBpbiBKT1NFIGhlYWRlciBhbmQgbXVsdGlwbGUgc3VwcGxpZWQgaW4gandrc191cmknKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGp3dGtleXMua2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoa2V5Lmt0eSBhcyBzdHJpbmcpID09PSAnUlNBJyAmJiAoa2V5LnVzZSBhcyBzdHJpbmcpID09PSAnc2lnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaWNrZXkgPSBLRVlVVElMLmdldEtleShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gS0pVUi5qd3MuSldTLnZlcmlmeShpZF90b2tlbiwgcHVibGlja2V5LCBbJ1JTMjU2J10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbmNvcnJlY3QgU2lnbmF0dXJlLCB2YWxpZGF0aW9uIGZhaWxlZCBmb3IgaWRfdG9rZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBraWQgaW4gdGhlIEpvc2UgaGVhZGVyIG9mIGlkX3Rva2VuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGp3dGtleXMua2V5cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChrZXkua2lkIGFzIHN0cmluZykgPT09IChraWQgYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1YmxpY2tleSA9IEtFWVVUSUwuZ2V0S2V5KGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IEtKVVIuandzLkpXUy52ZXJpZnkoaWRfdG9rZW4sIHB1YmxpY2tleSwgWydSUzI1NiddKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2luY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlnX3ZhbGlkYXRlX3Jlc3BvbnNlX3R5cGUocmVzcG9uc2VfdHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGUgPT09ICdpZF90b2tlbiB0b2tlbicgfHwgcmVzcG9uc2VfdHlwZSA9PT0gJ2lkX3Rva2VuJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnbW9kdWxlIGNvbmZpZ3VyZSBpbmNvcnJlY3QsIGludmFsaWQgcmVzcG9uc2VfdHlwZTonICsgcmVzcG9uc2VfdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFjY2VwdHMgSUQgVG9rZW4gd2l0aG91dCAna2lkJyBjbGFpbSBpbiBKT1NFIGhlYWRlciBpZiBvbmx5IG9uZSBKV0sgc3VwcGxpZWQgaW4gJ2p3a3NfdXJsJ1xyXG4gICAgLy8vLyBwcml2YXRlIHZhbGlkYXRlX25vX2tpZF9pbl9oZWFkZXJfb25seV9vbmVfYWxsb3dlZF9pbl9qd3RrZXlzKGhlYWRlcl9kYXRhOiBhbnksIGp3dGtleXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgLy8vLyAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5sb2dEZWJ1ZygnYW1vdW50IG9mIGp3dGtleXMua2V5czogJyArIGp3dGtleXMua2V5cy5sZW5ndGgpO1xyXG4gICAgLy8vLyAgICBpZiAoIWhlYWRlcl9kYXRhLmhhc093blByb3BlcnR5KCdraWQnKSkge1xyXG4gICAgLy8vLyAgICAgICAgLy8gbm8ga2lkIGRlZmluZWQgaW4gSm9zZSBoZWFkZXJcclxuICAgIC8vLy8gICAgICAgIGlmIChqd3RrZXlzLmtleXMubGVuZ3RoICE9IDEpIHtcclxuICAgIC8vLy8gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5sb2dEZWJ1Zygnand0a2V5cy5rZXlzLmxlbmd0aCAhPSAxIGFuZCBubyBraWQgaW4gaGVhZGVyJyk7XHJcbiAgICAvLy8vICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8vLyAgICAgICAgfVxyXG4gICAgLy8vLyAgICB9XHJcblxyXG4gICAgLy8vLyAgICByZXR1cm4gdHJ1ZTtcclxuICAgIC8vLy8gfVxyXG5cclxuICAgIC8vIEFjY2VzcyBUb2tlbiBWYWxpZGF0aW9uXHJcbiAgICAvLyBhY2Nlc3NfdG9rZW4gQzE6IEhhc2ggdGhlIG9jdGV0cyBvZiB0aGUgQVNDSUkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2Vzc190b2tlbiB3aXRoIHRoZSBoYXNoIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gSldBW0pXQV1cclxuICAgIC8vIGZvciB0aGUgYWxnIEhlYWRlciBQYXJhbWV0ZXIgb2YgdGhlIElEIFRva2VuJ3MgSk9TRSBIZWFkZXIuIEZvciBpbnN0YW5jZSwgaWYgdGhlIGFsZyBpcyBSUzI1NiwgdGhlIGhhc2ggYWxnb3JpdGhtIHVzZWQgaXMgU0hBLTI1Ni5cclxuICAgIC8vIGFjY2Vzc190b2tlbiBDMjogVGFrZSB0aGUgbGVmdC0gbW9zdCBoYWxmIG9mIHRoZSBoYXNoIGFuZCBiYXNlNjR1cmwtIGVuY29kZSBpdC5cclxuICAgIC8vIGFjY2Vzc190b2tlbiBDMzogVGhlIHZhbHVlIG9mIGF0X2hhc2ggaW4gdGhlIElEIFRva2VuIE1VU1QgbWF0Y2ggdGhlIHZhbHVlIHByb2R1Y2VkIGluIHRoZSBwcmV2aW91cyBzdGVwIGlmIGF0X2hhc2hcclxuICAgIC8vIGlzIHByZXNlbnQgaW4gdGhlIElEIFRva2VuLlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fYXRfaGFzaChhY2Nlc3NfdG9rZW46IGFueSwgYXRfaGFzaDogYW55LCBpc0NvZGVGbG93OiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdF9oYXNoIGZyb20gdGhlIHNlcnZlcjonICsgYXRfaGFzaCk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBhdF9oYXNoIGlzIG9wdGlvbmFsIGZvciB0aGUgY29kZSBmbG93XHJcbiAgICAgICAgaWYgKGlzQ29kZUZsb3cpIHtcclxuICAgICAgICAgICAgaWYgKCEoYXRfaGFzaCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0NvZGUgRmxvdyBhY3RpdmUsIGFuZCBubyBhdF9oYXNoIGluIHRoZSBpZF90b2tlbiwgc2tpcHBpbmcgY2hlY2shJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGVzdGRhdGEgPSB0aGlzLmdlbmVyYXRlX2F0X2hhc2goJycgKyBhY2Nlc3NfdG9rZW4pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXRfaGFzaCBjbGllbnQgdmFsaWRhdGlvbiBub3QgZGVjb2RlZDonICsgdGVzdGRhdGEpO1xyXG4gICAgICAgIGlmICh0ZXN0ZGF0YSA9PT0gKGF0X2hhc2ggYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gaXNWYWxpZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXN0VmFsdWUgPSB0aGlzLmdlbmVyYXRlX2F0X2hhc2goJycgKyBkZWNvZGVVUklDb21wb25lbnQoYWNjZXNzX3Rva2VuKSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnLWdlbiBhY2Nlc3MtLScgKyB0ZXN0VmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGVzdFZhbHVlID09PSAoYXRfaGFzaCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gaXNWYWxpZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZV9hdF9oYXNoKGFjY2Vzc190b2tlbjogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBoYXNoID0gS0pVUi5jcnlwdG8uVXRpbC5oYXNoU3RyaW5nKGFjY2Vzc190b2tlbiwgJ3NoYTI1NicpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0MTI4Yml0cyA9IGhhc2guc3Vic3RyKDAsIGhhc2gubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgY29uc3QgdGVzdGRhdGEgPSBoZXh0b2I2NHUoZmlyc3QxMjhiaXRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRlc3RkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlX2NvZGVfdmVyaWZpZXIoY29kZV9jaGFsbGVuZ2U6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaGFzaCA9IEtKVVIuY3J5cHRvLlV0aWwuaGFzaFN0cmluZyhjb2RlX2NoYWxsZW5nZSwgJ3NoYTI1NicpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RkYXRhID0gaGV4dG9iNjR1KGhhc2gpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGVzdGRhdGE7XHJcbiAgICB9XHJcbn1cclxuIl19