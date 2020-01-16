/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class OidcSecurityValidation {
    /**
     * @param {?} arrayHelperService
     * @param {?} tokenHelperService
     * @param {?} loggerService
     */
    constructor(arrayHelperService, tokenHelperService, loggerService) {
        this.arrayHelperService = arrayHelperService;
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    isTokenExpired(token, offsetSeconds) {
        /** @type {?} */
        let decoded;
        decoded = this.tokenHelperService.getPayloadFromToken(token, false);
        return !this.validate_id_token_exp_not_expired(decoded, offsetSeconds);
    }
    // id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
    /**
     * @param {?} decoded_id_token
     * @param {?=} offsetSeconds
     * @return {?}
     */
    validate_id_token_exp_not_expired(decoded_id_token, offsetSeconds) {
        /** @type {?} */
        const tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decoded_id_token);
        offsetSeconds = offsetSeconds || 0;
        if (!tokenExpirationDate) {
            return false;
        }
        /** @type {?} */
        const tokenExpirationValue = tokenExpirationDate.valueOf();
        /** @type {?} */
        const nowWithOffset = new Date().valueOf() + offsetSeconds * 1000;
        /** @type {?} */
        const tokenNotExpired = tokenExpirationValue > nowWithOffset;
        this.loggerService.logDebug(`Token not expired?: ${tokenExpirationValue} > ${nowWithOffset}  (${tokenNotExpired})`);
        // Token not expired?
        return tokenNotExpired;
    }
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
    validate_required_id_token(dataIdToken) {
        /** @type {?} */
        let validated = true;
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
    }
    // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
    // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
    /**
     * @param {?} dataIdToken
     * @param {?} max_offset_allowed_in_seconds
     * @param {?} disable_iat_offset_validation
     * @return {?}
     */
    validate_id_token_iat_max_offset(dataIdToken, max_offset_allowed_in_seconds, disable_iat_offset_validation) {
        if (disable_iat_offset_validation) {
            return true;
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            return false;
        }
        /** @type {?} */
        const dateTime_iat_id_token = new Date(0);
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
    }
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
    validate_id_token_nonce(dataIdToken, local_nonce, ignore_nonce_after_refresh) {
        /** @type {?} */
        const isFromRefreshToken = (dataIdToken.nonce === undefined || ignore_nonce_after_refresh) && local_nonce === OidcSecurityValidation.RefreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== local_nonce) {
            this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + local_nonce);
            return false;
        }
        return true;
    }
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    /**
     * @param {?} dataIdToken
     * @param {?} authWellKnownEndpoints_issuer
     * @return {?}
     */
    validate_id_token_iss(dataIdToken, authWellKnownEndpoints_issuer) {
        if (((/** @type {?} */ (dataIdToken.iss))) !== ((/** @type {?} */ (authWellKnownEndpoints_issuer)))) {
            this.loggerService.logDebug('Validate_id_token_iss failed, dataIdToken.iss: ' +
                dataIdToken.iss +
                ' authWellKnownEndpoints issuer:' +
                authWellKnownEndpoints_issuer);
            return false;
        }
        return true;
    }
    // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
    // by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
    // not trusted by the Client.
    /**
     * @param {?} dataIdToken
     * @param {?} aud
     * @return {?}
     */
    validate_id_token_aud(dataIdToken, aud) {
        if (dataIdToken.aud instanceof Array) {
            /** @type {?} */
            const result = this.arrayHelperService.areEqual(dataIdToken.aud, aud);
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
    }
    /**
     * @param {?} state
     * @param {?} local_state
     * @return {?}
     */
    validateStateFromHashCallback(state, local_state) {
        if (((/** @type {?} */ (state))) !== ((/** @type {?} */ (local_state)))) {
            this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + local_state);
            return false;
        }
        return true;
    }
    /**
     * @param {?} id_token_sub
     * @param {?} userdata_sub
     * @return {?}
     */
    validate_userdata_sub_id_token(id_token_sub, userdata_sub) {
        if (((/** @type {?} */ (id_token_sub))) !== ((/** @type {?} */ (userdata_sub)))) {
            this.loggerService.logDebug('validate_userdata_sub_id_token failed, id_token_sub: ' + id_token_sub + ' userdata_sub:' + userdata_sub);
            return false;
        }
        return true;
    }
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    /**
     * @param {?} id_token
     * @param {?} jwtkeys
     * @return {?}
     */
    validate_signature_id_token(id_token, jwtkeys) {
        if (!jwtkeys || !jwtkeys.keys) {
            return false;
        }
        /** @type {?} */
        const header_data = this.tokenHelperService.getHeaderFromToken(id_token, false);
        if (Object.keys(header_data).length === 0 && header_data.constructor === Object) {
            this.loggerService.logWarning('id token has no header data');
            return false;
        }
        /** @type {?} */
        const kid = header_data.kid;
        /** @type {?} */
        const alg = header_data.alg;
        if ('RS256' !== ((/** @type {?} */ (alg)))) {
            this.loggerService.logWarning('Only RS256 supported');
            return false;
        }
        /** @type {?} */
        let isValid = false;
        if (!header_data.hasOwnProperty('kid')) {
            // exactly 1 key in the jwtkeys and no kid in the Jose header
            // kty	"RSA" use "sig"
            /** @type {?} */
            let amountOfMatchingKeys = 0;
            for (const key of jwtkeys.keys) {
                if (((/** @type {?} */ (key.kty))) === 'RSA' && ((/** @type {?} */ (key.use))) === 'sig') {
                    amountOfMatchingKeys = amountOfMatchingKeys + 1;
                }
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
                for (const key of jwtkeys.keys) {
                    if (((/** @type {?} */ (key.kty))) === 'RSA' && ((/** @type {?} */ (key.use))) === 'sig') {
                        /** @type {?} */
                        const publickey = KEYUTIL.getKey(key);
                        isValid = KJUR.jws.JWS.verify(id_token, publickey, ['RS256']);
                        if (!isValid) {
                            this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                        }
                        return isValid;
                    }
                }
            }
        }
        else {
            // kid in the Jose header of id_token
            for (const key of jwtkeys.keys) {
                if (((/** @type {?} */ (key.kid))) === ((/** @type {?} */ (kid)))) {
                    /** @type {?} */
                    const publickey = KEYUTIL.getKey(key);
                    isValid = KJUR.jws.JWS.verify(id_token, publickey, ['RS256']);
                    if (!isValid) {
                        this.loggerService.logWarning('incorrect Signature, validation failed for id_token');
                    }
                    return isValid;
                }
            }
        }
        return isValid;
    }
    /**
     * @param {?} response_type
     * @return {?}
     */
    config_validate_response_type(response_type) {
        if (response_type === 'id_token token' || response_type === 'id_token') {
            return true;
        }
        if (response_type === 'code') {
            return true;
        }
        this.loggerService.logWarning('module configure incorrect, invalid response_type:' + response_type);
        return false;
    }
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
    validate_id_token_at_hash(access_token, at_hash, isCodeFlow) {
        this.loggerService.logDebug('at_hash from the server:' + at_hash);
        // The at_hash is optional for the code flow
        if (isCodeFlow) {
            if (!((/** @type {?} */ (at_hash)))) {
                this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
                return true;
            }
        }
        /** @type {?} */
        const testdata = this.generate_at_hash('' + access_token);
        this.loggerService.logDebug('at_hash client validation not decoded:' + testdata);
        if (testdata === ((/** @type {?} */ (at_hash)))) {
            return true; // isValid;
        }
        else {
            /** @type {?} */
            const testValue = this.generate_at_hash('' + decodeURIComponent(access_token));
            this.loggerService.logDebug('-gen access--' + testValue);
            if (testValue === ((/** @type {?} */ (at_hash)))) {
                return true; // isValid
            }
        }
        return false;
    }
    /**
     * @private
     * @param {?} access_token
     * @return {?}
     */
    generate_at_hash(access_token) {
        /** @type {?} */
        const hash = KJUR.crypto.Util.hashString(access_token, 'sha256');
        /** @type {?} */
        const first128bits = hash.substr(0, hash.length / 2);
        /** @type {?} */
        const testdata = hextob64u(first128bits);
        return testdata;
    }
    /**
     * @param {?} code_challenge
     * @return {?}
     */
    generate_code_verifier(code_challenge) {
        /** @type {?} */
        const hash = KJUR.crypto.Util.hashString(code_challenge, 'sha256');
        /** @type {?} */
        const testdata = hextob64u(hash);
        return testdata;
    }
}
OidcSecurityValidation.RefreshTokenNoncePlaceholder = '--RefreshToken--';
OidcSecurityValidation.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityValidation.ctorParameters = () => [
    { type: EqualityHelperService },
    { type: TokenHelperService },
    { type: LoggerService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS52YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkudmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q3RELE1BQU0sT0FBTyxzQkFBc0I7Ozs7OztJQUcvQixZQUNZLGtCQUF5QyxFQUN6QyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF1QjtRQUN6Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ3JDLENBQUM7Ozs7Ozs7SUFHSixjQUFjLENBQUMsS0FBYSxFQUFFLGFBQXNCOztZQUM1QyxPQUFZO1FBQ2hCLE9BQU8sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXBFLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzNFLENBQUM7Ozs7Ozs7SUFHRCxpQ0FBaUMsQ0FBQyxnQkFBd0IsRUFBRSxhQUFzQjs7Y0FDeEUsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFr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QyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDOUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQ3pELElBQUksU0FBUyxLQUFLLENBQUMsbUJBQUEsT0FBTyxFQUFVLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxJQUFJLENBQUMsQ0FBQyxVQUFVO2FBQzFCO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDOzs7Ozs7SUFFTyxnQkFBZ0IsQ0FBQyxZQUFpQjs7Y0FDaEMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDOztjQUMxRCxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O2NBQzlDLFFBQVEsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO1FBRXhDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRUQsc0JBQXNCLENBQUMsY0FBbUI7O2NBQ2hDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQzs7Y0FDNUQsUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFaEMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQzs7QUFoVk0sbURBQTRCLEdBQUcsa0JBQWtCLENBQUM7O1lBRjVELFVBQVU7Ozs7WUE5Q0YscUJBQXFCO1lBQ3JCLGtCQUFrQjtZQUNsQixhQUFhOzs7O0lBOENsQixvREFBeUQ7Ozs7O0lBR3JELG9EQUFpRDs7Ozs7SUFDakQsb0RBQThDOzs7OztJQUM5QywrQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGhleHRvYjY0dSwgS0VZVVRJTCwgS0pVUiB9IGZyb20gJ2pzcnNhc2lnbi1yZWR1Y2VkJztcclxuaW1wb3J0IHsgRXF1YWxpdHlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLWVxdWFsaXR5LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcblxyXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1pbXBsaWNpdC0xXzAuaHRtbFxyXG5cclxuLy8gaWRfdG9rZW5cclxuLy8gaWRfdG9rZW4gQzE6IFRoZSBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIE9wZW5JRCBQcm92aWRlciAod2hpY2ggaXMgdHlwaWNhbGx5IG9idGFpbmVkIGR1cmluZyBEaXNjb3ZlcnkpXHJcbi8vIE1VU1QgZXhhY3RseSBtYXRjaCB0aGUgdmFsdWUgb2YgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbS5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzI6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGF0IHRoZSBhdWQgKGF1ZGllbmNlKSBDbGFpbSBjb250YWlucyBpdHMgY2xpZW50X2lkIHZhbHVlIHJlZ2lzdGVyZWQgYXQgdGhlIElzc3VlciBpZGVudGlmaWVkXHJcbi8vIGJ5IHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0gYXMgYW4gYXVkaWVuY2UuVGhlIElEIFRva2VuIE1VU1QgYmUgcmVqZWN0ZWQgaWYgdGhlIElEIFRva2VuIGRvZXMgbm90IGxpc3QgdGhlIENsaWVudCBhcyBhIHZhbGlkIGF1ZGllbmNlLFxyXG4vLyBvciBpZiBpdCBjb250YWlucyBhZGRpdGlvbmFsIGF1ZGllbmNlcyBub3QgdHJ1c3RlZCBieSB0aGUgQ2xpZW50LlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDMzogSWYgdGhlIElEIFRva2VuIGNvbnRhaW5zIG11bHRpcGxlIGF1ZGllbmNlcywgdGhlIENsaWVudCBTSE9VTEQgdmVyaWZ5IHRoYXQgYW4gYXpwIENsYWltIGlzIHByZXNlbnQuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM0OiBJZiBhbiBhenAgKGF1dGhvcml6ZWQgcGFydHkpIENsYWltIGlzIHByZXNlbnQsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGl0cyBjbGllbnRfaWQgaXMgdGhlIENsYWltIFZhbHVlLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlXHJcbi8vIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBKT1NFIEhlYWRlci5UaGUgQ2xpZW50IE1VU1QgdXNlIHRoZSBrZXlzIHByb3ZpZGVkIGJ5IHRoZSBJc3N1ZXIuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM2OiBUaGUgYWxnIHZhbHVlIFNIT1VMRCBiZSBSUzI1Ni4gVmFsaWRhdGlvbiBvZiB0b2tlbnMgdXNpbmcgb3RoZXIgc2lnbmluZyBhbGdvcml0aG1zIGlzIGRlc2NyaWJlZCBpbiB0aGUgT3BlbklEIENvbm5lY3QgQ29yZSAxLjBcclxuLy8gW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudFxyXG4vLyBmb3IgY2xvY2sgc2tldykuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxyXG4vLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzk6IFRoZSB2YWx1ZSBvZiB0aGUgbm9uY2UgQ2xhaW0gTVVTVCBiZSBjaGVja2VkIHRvIHZlcmlmeSB0aGF0IGl0IGlzIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBvbmUgdGhhdCB3YXMgc2VudFxyXG4vLyBpbiB0aGUgQXV0aGVudGljYXRpb24gUmVxdWVzdC5UaGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgbm9uY2UgdmFsdWUgZm9yIHJlcGxheSBhdHRhY2tzLlRoZSBwcmVjaXNlIG1ldGhvZCBmb3IgZGV0ZWN0aW5nIHJlcGxheSBhdHRhY2tzXHJcbi8vIGlzIENsaWVudCBzcGVjaWZpYy5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzEwOiBJZiB0aGUgYWNyIENsYWltIHdhcyByZXF1ZXN0ZWQsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoYXQgdGhlIGFzc2VydGVkIENsYWltIFZhbHVlIGlzIGFwcHJvcHJpYXRlLlxyXG4vLyBUaGUgbWVhbmluZyBhbmQgcHJvY2Vzc2luZyBvZiBhY3IgQ2xhaW0gVmFsdWVzIGlzIG91dCBvZiBzY29wZSBmb3IgdGhpcyBkb2N1bWVudC5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzExOiBXaGVuIGEgbWF4X2FnZSByZXF1ZXN0IGlzIG1hZGUsIHRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBhdXRoX3RpbWUgQ2xhaW0gdmFsdWUgYW5kIHJlcXVlc3QgcmUtIGF1dGhlbnRpY2F0aW9uXHJcbi8vIGlmIGl0IGRldGVybWluZXMgdG9vIG11Y2ggdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCBFbmQtIFVzZXIgYXV0aGVudGljYXRpb24uXHJcblxyXG4vLyBBY2Nlc3MgVG9rZW4gVmFsaWRhdGlvblxyXG4vLyBhY2Nlc3NfdG9rZW4gQzE6IEhhc2ggdGhlIG9jdGV0cyBvZiB0aGUgQVNDSUkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFjY2Vzc190b2tlbiB3aXRoIHRoZSBoYXNoIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gSldBW0pXQV1cclxuLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxyXG4vLyBhY2Nlc3NfdG9rZW4gQzI6IFRha2UgdGhlIGxlZnQtIG1vc3QgaGFsZiBvZiB0aGUgaGFzaCBhbmQgYmFzZTY0dXJsLSBlbmNvZGUgaXQuXHJcbi8vIGFjY2Vzc190b2tlbiBDMzogVGhlIHZhbHVlIG9mIGF0X2hhc2ggaW4gdGhlIElEIFRva2VuIE1VU1QgbWF0Y2ggdGhlIHZhbHVlIHByb2R1Y2VkIGluIHRoZSBwcmV2aW91cyBzdGVwIGlmIGF0X2hhc2ggaXMgcHJlc2VudCBpbiB0aGUgSUQgVG9rZW4uXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uIHtcclxuICAgIHN0YXRpYyBSZWZyZXNoVG9rZW5Ob25jZVBsYWNlaG9sZGVyID0gJy0tUmVmcmVzaFRva2VuLS0nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgYXJyYXlIZWxwZXJTZXJ2aWNlOiBFcXVhbGl0eUhlbHBlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2VcclxuICAgICkge31cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDNzogVGhlIGN1cnJlbnQgdGltZSBNVVNUIGJlIGJlZm9yZSB0aGUgdGltZSByZXByZXNlbnRlZCBieSB0aGUgZXhwIENsYWltIChwb3NzaWJseSBhbGxvd2luZyBmb3Igc29tZSBzbWFsbCBsZWV3YXkgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldykuXHJcbiAgICBpc1Rva2VuRXhwaXJlZCh0b2tlbjogc3RyaW5nLCBvZmZzZXRTZWNvbmRzPzogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGRlY29kZWQ6IGFueTtcclxuICAgICAgICBkZWNvZGVkID0gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbih0b2tlbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gIXRoaXMudmFsaWRhdGVfaWRfdG9rZW5fZXhwX25vdF9leHBpcmVkKGRlY29kZWQsIG9mZnNldFNlY29uZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM3OiBUaGUgY3VycmVudCB0aW1lIE1VU1QgYmUgYmVmb3JlIHRoZSB0aW1lIHJlcHJlc2VudGVkIGJ5IHRoZSBleHAgQ2xhaW0gKHBvc3NpYmx5IGFsbG93aW5nIGZvciBzb21lIHNtYWxsIGxlZXdheSB0byBhY2NvdW50IGZvciBjbG9jayBza2V3KS5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2V4cF9ub3RfZXhwaXJlZChkZWNvZGVkX2lkX3Rva2VuOiBzdHJpbmcsIG9mZnNldFNlY29uZHM/OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCB0b2tlbkV4cGlyYXRpb25EYXRlID0gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0VG9rZW5FeHBpcmF0aW9uRGF0ZShkZWNvZGVkX2lkX3Rva2VuKTtcclxuICAgICAgICBvZmZzZXRTZWNvbmRzID0gb2Zmc2V0U2Vjb25kcyB8fCAwO1xyXG5cclxuICAgICAgICBpZiAoIXRva2VuRXhwaXJhdGlvbkRhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW5FeHBpcmF0aW9uVmFsdWUgPSB0b2tlbkV4cGlyYXRpb25EYXRlLnZhbHVlT2YoKTtcclxuICAgICAgICBjb25zdCBub3dXaXRoT2Zmc2V0ID0gbmV3IERhdGUoKS52YWx1ZU9mKCkgKyBvZmZzZXRTZWNvbmRzICogMTAwMDtcclxuICAgICAgICBjb25zdCB0b2tlbk5vdEV4cGlyZWQgPSB0b2tlbkV4cGlyYXRpb25WYWx1ZSA+IG5vd1dpdGhPZmZzZXQ7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgVG9rZW4gbm90IGV4cGlyZWQ/OiAke3Rva2VuRXhwaXJhdGlvblZhbHVlfSA+ICR7bm93V2l0aE9mZnNldH0gICgke3Rva2VuTm90RXhwaXJlZH0pYCk7XHJcblxyXG4gICAgICAgIC8vIFRva2VuIG5vdCBleHBpcmVkP1xyXG4gICAgICAgIHJldHVybiB0b2tlbk5vdEV4cGlyZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaXNzXHJcbiAgICAvLyBSRVFVSVJFRC4gSXNzdWVyIElkZW50aWZpZXIgZm9yIHRoZSBJc3N1ZXIgb2YgdGhlIHJlc3BvbnNlLlRoZSBpc3MgdmFsdWUgaXMgYSBjYXNlLXNlbnNpdGl2ZSBVUkwgdXNpbmcgdGhlIGh0dHBzIHNjaGVtZSB0aGF0IGNvbnRhaW5zIHNjaGVtZSwgaG9zdCxcclxuICAgIC8vIGFuZCBvcHRpb25hbGx5LCBwb3J0IG51bWJlciBhbmQgcGF0aCBjb21wb25lbnRzIGFuZCBubyBxdWVyeSBvciBmcmFnbWVudCBjb21wb25lbnRzLlxyXG4gICAgLy9cclxuICAgIC8vIHN1YlxyXG4gICAgLy8gUkVRVUlSRUQuIFN1YmplY3QgSWRlbnRpZmllci5Mb2NhbGx5IHVuaXF1ZSBhbmQgbmV2ZXIgcmVhc3NpZ25lZCBpZGVudGlmaWVyIHdpdGhpbiB0aGUgSXNzdWVyIGZvciB0aGUgRW5kLSBVc2VyLFxyXG4gICAgLy8gd2hpY2ggaXMgaW50ZW5kZWQgdG8gYmUgY29uc3VtZWQgYnkgdGhlIENsaWVudCwgZS5nLiwgMjQ0MDAzMjAgb3IgQUl0T2F3bXd0V3djVDBrNTFCYXlld052dXRySlVxc3ZsNnFzN0E0LlxyXG4gICAgLy8gSXQgTVVTVCBOT1QgZXhjZWVkIDI1NSBBU0NJSSBjaGFyYWN0ZXJzIGluIGxlbmd0aC5UaGUgc3ViIHZhbHVlIGlzIGEgY2FzZS1zZW5zaXRpdmUgc3RyaW5nLlxyXG4gICAgLy9cclxuICAgIC8vIGF1ZFxyXG4gICAgLy8gUkVRVUlSRUQuIEF1ZGllbmNlKHMpIHRoYXQgdGhpcyBJRCBUb2tlbiBpcyBpbnRlbmRlZCBmb3IuIEl0IE1VU1QgY29udGFpbiB0aGUgT0F1dGggMi4wIGNsaWVudF9pZCBvZiB0aGUgUmVseWluZyBQYXJ0eSBhcyBhbiBhdWRpZW5jZSB2YWx1ZS5cclxuICAgIC8vIEl0IE1BWSBhbHNvIGNvbnRhaW4gaWRlbnRpZmllcnMgZm9yIG90aGVyIGF1ZGllbmNlcy5JbiB0aGUgZ2VuZXJhbCBjYXNlLCB0aGUgYXVkIHZhbHVlIGlzIGFuIGFycmF5IG9mIGNhc2Utc2Vuc2l0aXZlIHN0cmluZ3MuXHJcbiAgICAvLyBJbiB0aGUgY29tbW9uIHNwZWNpYWwgY2FzZSB3aGVuIHRoZXJlIGlzIG9uZSBhdWRpZW5jZSwgdGhlIGF1ZCB2YWx1ZSBNQVkgYmUgYSBzaW5nbGUgY2FzZS1zZW5zaXRpdmUgc3RyaW5nLlxyXG4gICAgLy9cclxuICAgIC8vIGV4cFxyXG4gICAgLy8gUkVRVUlSRUQuIEV4cGlyYXRpb24gdGltZSBvbiBvciBhZnRlciB3aGljaCB0aGUgSUQgVG9rZW4gTVVTVCBOT1QgYmUgYWNjZXB0ZWQgZm9yIHByb2Nlc3NpbmcuXHJcbiAgICAvLyBUaGUgcHJvY2Vzc2luZyBvZiB0aGlzIHBhcmFtZXRlciByZXF1aXJlcyB0aGF0IHRoZSBjdXJyZW50IGRhdGUvIHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIGV4cGlyYXRpb24gZGF0ZS8gdGltZSBsaXN0ZWQgaW4gdGhlIHZhbHVlLlxyXG4gICAgLy8gSW1wbGVtZW50ZXJzIE1BWSBwcm92aWRlIGZvciBzb21lIHNtYWxsIGxlZXdheSwgdXN1YWxseSBubyBtb3JlIHRoYW4gYSBmZXcgbWludXRlcywgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldy5cclxuICAgIC8vIEl0cyB2YWx1ZSBpcyBhIEpTT04gW1JGQzcxNTldIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gMTk3MC0gMDEgLSAwMVQwMDogMDA6MDBaIGFzIG1lYXN1cmVkIGluIFVUQyB1bnRpbCB0aGUgZGF0ZS8gdGltZS5cclxuICAgIC8vIFNlZSBSRkMgMzMzOSBbUkZDMzMzOV0gZm9yIGRldGFpbHMgcmVnYXJkaW5nIGRhdGUvIHRpbWVzIGluIGdlbmVyYWwgYW5kIFVUQyBpbiBwYXJ0aWN1bGFyLlxyXG4gICAgLy9cclxuICAgIC8vIGlhdFxyXG4gICAgLy8gUkVRVUlSRUQuIFRpbWUgYXQgd2hpY2ggdGhlIEpXVCB3YXMgaXNzdWVkLiBJdHMgdmFsdWUgaXMgYSBKU09OIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gMTk3MC0gMDEgLSAwMVQwMDogMDA6MDBaIGFzIG1lYXN1cmVkXHJcbiAgICAvLyBpbiBVVEMgdW50aWwgdGhlIGRhdGUvIHRpbWUuXHJcbiAgICB2YWxpZGF0ZV9yZXF1aXJlZF9pZF90b2tlbihkYXRhSWRUb2tlbjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHZhbGlkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnaXNzJykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpc3MgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ3N1YicpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnc3ViIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdhdWQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1ZCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdleHAgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaWF0IGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsaWRhdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM4OiBUaGUgaWF0IENsYWltIGNhbiBiZSB1c2VkIHRvIHJlamVjdCB0b2tlbnMgdGhhdCB3ZXJlIGlzc3VlZCB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aW1lLFxyXG4gICAgLy8gbGltaXRpbmcgdGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgbm9uY2VzIG5lZWQgdG8gYmUgc3RvcmVkIHRvIHByZXZlbnQgYXR0YWNrcy5UaGUgYWNjZXB0YWJsZSByYW5nZSBpcyBDbGllbnQgc3BlY2lmaWMuXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9pYXRfbWF4X29mZnNldChkYXRhSWRUb2tlbjogYW55LCBtYXhfb2Zmc2V0X2FsbG93ZWRfaW5fc2Vjb25kczogbnVtYmVyLCBkaXNhYmxlX2lhdF9vZmZzZXRfdmFsaWRhdGlvbjogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChkaXNhYmxlX2lhdF9vZmZzZXRfdmFsaWRhdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2lhdCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVUaW1lX2lhdF9pZF90b2tlbiA9IG5ldyBEYXRlKDApOyAvLyBUaGUgMCBoZXJlIGlzIHRoZSBrZXksIHdoaWNoIHNldHMgdGhlIGRhdGUgdG8gdGhlIGVwb2NoXHJcbiAgICAgICAgZGF0ZVRpbWVfaWF0X2lkX3Rva2VuLnNldFVUQ1NlY29uZHMoZGF0YUlkVG9rZW4uaWF0KTtcclxuXHJcbiAgICAgICAgbWF4X29mZnNldF9hbGxvd2VkX2luX3NlY29uZHMgPSBtYXhfb2Zmc2V0X2FsbG93ZWRfaW5fc2Vjb25kcyB8fCAwO1xyXG5cclxuICAgICAgICBpZiAoZGF0ZVRpbWVfaWF0X2lkX3Rva2VuID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgICAgICAndmFsaWRhdGVfaWRfdG9rZW5faWF0X21heF9vZmZzZXQ6ICcgK1xyXG4gICAgICAgICAgICAgICAgKG5ldyBEYXRlKCkudmFsdWVPZigpIC0gZGF0ZVRpbWVfaWF0X2lkX3Rva2VuLnZhbHVlT2YoKSkgK1xyXG4gICAgICAgICAgICAgICAgJyA8ICcgK1xyXG4gICAgICAgICAgICAgICAgbWF4X29mZnNldF9hbGxvd2VkX2luX3NlY29uZHMgKiAxMDAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS52YWx1ZU9mKCkgLSBkYXRlVGltZV9pYXRfaWRfdG9rZW4udmFsdWVPZigpIDwgbWF4X29mZnNldF9hbGxvd2VkX2luX3NlY29uZHMgKiAxMDAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM5OiBUaGUgdmFsdWUgb2YgdGhlIG5vbmNlIENsYWltIE1VU1QgYmUgY2hlY2tlZCB0byB2ZXJpZnkgdGhhdCBpdCBpcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgb25lXHJcbiAgICAvLyB0aGF0IHdhcyBzZW50IGluIHRoZSBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0LlRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBub25jZSB2YWx1ZSBmb3IgcmVwbGF5IGF0dGFja3MuXHJcbiAgICAvLyBUaGUgcHJlY2lzZSBtZXRob2QgZm9yIGRldGVjdGluZyByZXBsYXkgYXR0YWNrcyBpcyBDbGllbnQgc3BlY2lmaWMuXHJcblxyXG4gICAgLy8gSG93ZXZlciB0aGUgbm9uY2UgY2xhaW0gU0hPVUxEIG5vdCBiZSBwcmVzZW50IGZvciB0aGUgcmVmZXNoX3Rva2VuIGdyYW50IHR5cGVcclxuICAgIC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9vcGVuaWQvY29ubmVjdC9pc3N1ZXMvMTAyNS9hbWJpZ3VpdHktd2l0aC1ob3ctbm9uY2UtaXMtaGFuZGxlZC1vblxyXG4gICAgLy8gVGhlIGN1cnJlbnQgc3BlYyBpcyBhbWJpZ3VvdXMgYW5kIEtleWNsb2FrIGRvZXMgc2VuZCBpdC5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX25vbmNlKGRhdGFJZFRva2VuOiBhbnksIGxvY2FsX25vbmNlOiBhbnksIGlnbm9yZV9ub25jZV9hZnRlcl9yZWZyZXNoOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgaXNGcm9tUmVmcmVzaFRva2VuID1cclxuICAgICAgICAgICAgKGRhdGFJZFRva2VuLm5vbmNlID09PSB1bmRlZmluZWQgfHwgaWdub3JlX25vbmNlX2FmdGVyX3JlZnJlc2gpICYmIGxvY2FsX25vbmNlID09PSBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uLlJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXI7XHJcbiAgICAgICAgaWYgKCFpc0Zyb21SZWZyZXNoVG9rZW4gJiYgZGF0YUlkVG9rZW4ubm9uY2UgIT09IGxvY2FsX25vbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fbm9uY2UgZmFpbGVkLCBkYXRhSWRUb2tlbi5ub25jZTogJyArIGRhdGFJZFRva2VuLm5vbmNlICsgJyBsb2NhbF9ub25jZTonICsgbG9jYWxfbm9uY2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDMTogVGhlIElzc3VlciBJZGVudGlmaWVyIGZvciB0aGUgT3BlbklEIFByb3ZpZGVyICh3aGljaCBpcyB0eXBpY2FsbHkgb2J0YWluZWQgZHVyaW5nIERpc2NvdmVyeSlcclxuICAgIC8vIE1VU1QgZXhhY3RseSBtYXRjaCB0aGUgdmFsdWUgb2YgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbS5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2lzcyhkYXRhSWRUb2tlbjogYW55LCBhdXRoV2VsbEtub3duRW5kcG9pbnRzX2lzc3VlcjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKChkYXRhSWRUb2tlbi5pc3MgYXMgc3RyaW5nKSAhPT0gKGF1dGhXZWxsS25vd25FbmRwb2ludHNfaXNzdWVyIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgICAgICAgICAgJ1ZhbGlkYXRlX2lkX3Rva2VuX2lzcyBmYWlsZWQsIGRhdGFJZFRva2VuLmlzczogJyArXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YUlkVG9rZW4uaXNzICtcclxuICAgICAgICAgICAgICAgICAgICAnIGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXNzdWVyOicgK1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhXZWxsS25vd25FbmRwb2ludHNfaXNzdWVyXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEMyOiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhhdCB0aGUgYXVkIChhdWRpZW5jZSkgQ2xhaW0gY29udGFpbnMgaXRzIGNsaWVudF9pZCB2YWx1ZSByZWdpc3RlcmVkIGF0IHRoZSBJc3N1ZXIgaWRlbnRpZmllZFxyXG4gICAgLy8gYnkgdGhlIGlzcyAoaXNzdWVyKSBDbGFpbSBhcyBhbiBhdWRpZW5jZS5cclxuICAgIC8vIFRoZSBJRCBUb2tlbiBNVVNUIGJlIHJlamVjdGVkIGlmIHRoZSBJRCBUb2tlbiBkb2VzIG5vdCBsaXN0IHRoZSBDbGllbnQgYXMgYSB2YWxpZCBhdWRpZW5jZSwgb3IgaWYgaXQgY29udGFpbnMgYWRkaXRpb25hbCBhdWRpZW5jZXNcclxuICAgIC8vIG5vdCB0cnVzdGVkIGJ5IHRoZSBDbGllbnQuXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9hdWQoZGF0YUlkVG9rZW46IGFueSwgYXVkOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoZGF0YUlkVG9rZW4uYXVkIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hcnJheUhlbHBlclNlcnZpY2UuYXJlRXF1YWwoZGF0YUlkVG9rZW4uYXVkLCBhdWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fYXVkICBhcnJheSBmYWlsZWQsIGRhdGFJZFRva2VuLmF1ZDogJyArIGRhdGFJZFRva2VuLmF1ZCArICcgY2xpZW50X2lkOicgKyBhdWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFJZFRva2VuLmF1ZCAhPT0gYXVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fYXVkIGZhaWxlZCwgZGF0YUlkVG9rZW4uYXVkOiAnICsgZGF0YUlkVG9rZW4uYXVkICsgJyBjbGllbnRfaWQ6JyArIGF1ZCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZVN0YXRlRnJvbUhhc2hDYWxsYmFjayhzdGF0ZTogYW55LCBsb2NhbF9zdGF0ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKChzdGF0ZSBhcyBzdHJpbmcpICE9PSAobG9jYWxfc3RhdGUgYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1ZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrIGZhaWxlZCwgc3RhdGU6ICcgKyBzdGF0ZSArICcgbG9jYWxfc3RhdGU6JyArIGxvY2FsX3N0YXRlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGVfdXNlcmRhdGFfc3ViX2lkX3Rva2VuKGlkX3Rva2VuX3N1YjogYW55LCB1c2VyZGF0YV9zdWI6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICgoaWRfdG9rZW5fc3ViIGFzIHN0cmluZykgIT09ICh1c2VyZGF0YV9zdWIgYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3ZhbGlkYXRlX3VzZXJkYXRhX3N1Yl9pZF90b2tlbiBmYWlsZWQsIGlkX3Rva2VuX3N1YjogJyArIGlkX3Rva2VuX3N1YiArICcgdXNlcmRhdGFfc3ViOicgKyB1c2VyZGF0YV9zdWIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDNTogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoZSBzaWduYXR1cmUgb2YgdGhlIElEIFRva2VuIGFjY29yZGluZyB0byBKV1MgW0pXU10gdXNpbmcgdGhlIGFsZ29yaXRobSBzcGVjaWZpZWQgaW4gdGhlIGFsZ1xyXG4gICAgLy8gSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSk9TRSBIZWFkZXIuVGhlIENsaWVudCBNVVNUIHVzZSB0aGUga2V5cyBwcm92aWRlZCBieSB0aGUgSXNzdWVyLlxyXG4gICAgLy8gaWRfdG9rZW4gQzY6IFRoZSBhbGcgdmFsdWUgU0hPVUxEIGJlIFJTMjU2LiBWYWxpZGF0aW9uIG9mIHRva2VucyB1c2luZyBvdGhlciBzaWduaW5nIGFsZ29yaXRobXMgaXMgZGVzY3JpYmVkIGluIHRoZVxyXG4gICAgLy8gT3BlbklEIENvbm5lY3QgQ29yZSAxLjAgW09wZW5JRC5Db3JlXSBzcGVjaWZpY2F0aW9uLlxyXG4gICAgdmFsaWRhdGVfc2lnbmF0dXJlX2lkX3Rva2VuKGlkX3Rva2VuOiBhbnksIGp3dGtleXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghand0a2V5cyB8fCAhand0a2V5cy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlcl9kYXRhID0gdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0SGVhZGVyRnJvbVRva2VuKGlkX3Rva2VuLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhoZWFkZXJfZGF0YSkubGVuZ3RoID09PSAwICYmIGhlYWRlcl9kYXRhLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2lkIHRva2VuIGhhcyBubyBoZWFkZXIgZGF0YScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBraWQgPSBoZWFkZXJfZGF0YS5raWQ7XHJcbiAgICAgICAgY29uc3QgYWxnID0gaGVhZGVyX2RhdGEuYWxnO1xyXG5cclxuICAgICAgICBpZiAoJ1JTMjU2JyAhPT0gKGFsZyBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdPbmx5IFJTMjU2IHN1cHBvcnRlZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIWhlYWRlcl9kYXRhLmhhc093blByb3BlcnR5KCdraWQnKSkge1xyXG4gICAgICAgICAgICAvLyBleGFjdGx5IDEga2V5IGluIHRoZSBqd3RrZXlzIGFuZCBubyBraWQgaW4gdGhlIEpvc2UgaGVhZGVyXHJcbiAgICAgICAgICAgIC8vIGt0eVx0XCJSU0FcIiB1c2UgXCJzaWdcIlxyXG4gICAgICAgICAgICBsZXQgYW1vdW50T2ZNYXRjaGluZ0tleXMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoa2V5Lmt0eSBhcyBzdHJpbmcpID09PSAnUlNBJyAmJiAoa2V5LnVzZSBhcyBzdHJpbmcpID09PSAnc2lnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudE9mTWF0Y2hpbmdLZXlzID0gYW1vdW50T2ZNYXRjaGluZ0tleXMgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYW1vdW50T2ZNYXRjaGluZ0tleXMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdubyBrZXlzIGZvdW5kLCBpbmNvcnJlY3QgU2lnbmF0dXJlLCB2YWxpZGF0aW9uIGZhaWxlZCBmb3IgaWRfdG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbW91bnRPZk1hdGNoaW5nS2V5cyA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdubyBJRCBUb2tlbiBraWQgY2xhaW0gaW4gSk9TRSBoZWFkZXIgYW5kIG11bHRpcGxlIHN1cHBsaWVkIGluIGp3a3NfdXJpJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKGtleS5rdHkgYXMgc3RyaW5nKSA9PT0gJ1JTQScgJiYgKGtleS51c2UgYXMgc3RyaW5nKSA9PT0gJ3NpZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVibGlja2V5ID0gS0VZVVRJTC5nZXRLZXkoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IEtKVVIuandzLkpXUy52ZXJpZnkoaWRfdG9rZW4sIHB1YmxpY2tleSwgWydSUzI1NiddKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5jb3JyZWN0IFNpZ25hdHVyZSwgdmFsaWRhdGlvbiBmYWlsZWQgZm9yIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8ga2lkIGluIHRoZSBKb3NlIGhlYWRlciBvZiBpZF90b2tlblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBqd3RrZXlzLmtleXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoa2V5LmtpZCBhcyBzdHJpbmcpID09PSAoa2lkIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaWNrZXkgPSBLRVlVVElMLmdldEtleShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBLSlVSLmp3cy5KV1MudmVyaWZ5KGlkX3Rva2VuLCBwdWJsaWNrZXksIFsnUlMyNTYnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbmNvcnJlY3QgU2lnbmF0dXJlLCB2YWxpZGF0aW9uIGZhaWxlZCBmb3IgaWRfdG9rZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ192YWxpZGF0ZV9yZXNwb25zZV90eXBlKHJlc3BvbnNlX3R5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlID09PSAnaWRfdG9rZW4gdG9rZW4nIHx8IHJlc3BvbnNlX3R5cGUgPT09ICdpZF90b2tlbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZSA9PT0gJ2NvZGUnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ21vZHVsZSBjb25maWd1cmUgaW5jb3JyZWN0LCBpbnZhbGlkIHJlc3BvbnNlX3R5cGU6JyArIHJlc3BvbnNlX3R5cGUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBY2NlcHRzIElEIFRva2VuIHdpdGhvdXQgJ2tpZCcgY2xhaW0gaW4gSk9TRSBoZWFkZXIgaWYgb25seSBvbmUgSldLIHN1cHBsaWVkIGluICdqd2tzX3VybCdcclxuICAgIC8vLy8gcHJpdmF0ZSB2YWxpZGF0ZV9ub19raWRfaW5faGVhZGVyX29ubHlfb25lX2FsbG93ZWRfaW5fand0a2V5cyhoZWFkZXJfZGF0YTogYW55LCBqd3RrZXlzOiBhbnkpOiBib29sZWFuIHtcclxuICAgIC8vLy8gICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ubG9nRGVidWcoJ2Ftb3VudCBvZiBqd3RrZXlzLmtleXM6ICcgKyBqd3RrZXlzLmtleXMubGVuZ3RoKTtcclxuICAgIC8vLy8gICAgaWYgKCFoZWFkZXJfZGF0YS5oYXNPd25Qcm9wZXJ0eSgna2lkJykpIHtcclxuICAgIC8vLy8gICAgICAgIC8vIG5vIGtpZCBkZWZpbmVkIGluIEpvc2UgaGVhZGVyXHJcbiAgICAvLy8vICAgICAgICBpZiAoand0a2V5cy5rZXlzLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAvLy8vICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ubG9nRGVidWcoJ2p3dGtleXMua2V5cy5sZW5ndGggIT0gMSBhbmQgbm8ga2lkIGluIGhlYWRlcicpO1xyXG4gICAgLy8vLyAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIC8vLy8gICAgICAgIH1cclxuICAgIC8vLy8gICAgfVxyXG5cclxuICAgIC8vLy8gICAgcmV0dXJuIHRydWU7XHJcbiAgICAvLy8vIH1cclxuXHJcbiAgICAvLyBBY2Nlc3MgVG9rZW4gVmFsaWRhdGlvblxyXG4gICAgLy8gYWNjZXNzX3Rva2VuIEMxOiBIYXNoIHRoZSBvY3RldHMgb2YgdGhlIEFTQ0lJIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3NfdG9rZW4gd2l0aCB0aGUgaGFzaCBhbGdvcml0aG0gc3BlY2lmaWVkIGluIEpXQVtKV0FdXHJcbiAgICAvLyBmb3IgdGhlIGFsZyBIZWFkZXIgUGFyYW1ldGVyIG9mIHRoZSBJRCBUb2tlbidzIEpPU0UgSGVhZGVyLiBGb3IgaW5zdGFuY2UsIGlmIHRoZSBhbGcgaXMgUlMyNTYsIHRoZSBoYXNoIGFsZ29yaXRobSB1c2VkIGlzIFNIQS0yNTYuXHJcbiAgICAvLyBhY2Nlc3NfdG9rZW4gQzI6IFRha2UgdGhlIGxlZnQtIG1vc3QgaGFsZiBvZiB0aGUgaGFzaCBhbmQgYmFzZTY0dXJsLSBlbmNvZGUgaXQuXHJcbiAgICAvLyBhY2Nlc3NfdG9rZW4gQzM6IFRoZSB2YWx1ZSBvZiBhdF9oYXNoIGluIHRoZSBJRCBUb2tlbiBNVVNUIG1hdGNoIHRoZSB2YWx1ZSBwcm9kdWNlZCBpbiB0aGUgcHJldmlvdXMgc3RlcCBpZiBhdF9oYXNoXHJcbiAgICAvLyBpcyBwcmVzZW50IGluIHRoZSBJRCBUb2tlbi5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2F0X2hhc2goYWNjZXNzX3Rva2VuOiBhbnksIGF0X2hhc2g6IGFueSwgaXNDb2RlRmxvdzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXRfaGFzaCBmcm9tIHRoZSBzZXJ2ZXI6JyArIGF0X2hhc2gpO1xyXG5cclxuICAgICAgICAvLyBUaGUgYXRfaGFzaCBpcyBvcHRpb25hbCBmb3IgdGhlIGNvZGUgZmxvd1xyXG4gICAgICAgIGlmIChpc0NvZGVGbG93KSB7XHJcbiAgICAgICAgICAgIGlmICghKGF0X2hhc2ggYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdDb2RlIEZsb3cgYWN0aXZlLCBhbmQgbm8gYXRfaGFzaCBpbiB0aGUgaWRfdG9rZW4sIHNraXBwaW5nIGNoZWNrIScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRlc3RkYXRhID0gdGhpcy5nZW5lcmF0ZV9hdF9oYXNoKCcnICsgYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F0X2hhc2ggY2xpZW50IHZhbGlkYXRpb24gbm90IGRlY29kZWQ6JyArIHRlc3RkYXRhKTtcclxuICAgICAgICBpZiAodGVzdGRhdGEgPT09IChhdF9oYXNoIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGlzVmFsaWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGVzdFZhbHVlID0gdGhpcy5nZW5lcmF0ZV9hdF9oYXNoKCcnICsgZGVjb2RlVVJJQ29tcG9uZW50KGFjY2Vzc190b2tlbikpO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJy1nZW4gYWNjZXNzLS0nICsgdGVzdFZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRlc3RWYWx1ZSA9PT0gKGF0X2hhc2ggYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGlzVmFsaWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVfYXRfaGFzaChhY2Nlc3NfdG9rZW46IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaGFzaCA9IEtKVVIuY3J5cHRvLlV0aWwuaGFzaFN0cmluZyhhY2Nlc3NfdG9rZW4sICdzaGEyNTYnKTtcclxuICAgICAgICBjb25zdCBmaXJzdDEyOGJpdHMgPSBoYXNoLnN1YnN0cigwLCBoYXNoLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RkYXRhID0gaGV4dG9iNjR1KGZpcnN0MTI4Yml0cyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXN0ZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZV9jb2RlX3ZlcmlmaWVyKGNvZGVfY2hhbGxlbmdlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGhhc2ggPSBLSlVSLmNyeXB0by5VdGlsLmhhc2hTdHJpbmcoY29kZV9jaGFsbGVuZ2UsICdzaGEyNTYnKTtcclxuICAgICAgICBjb25zdCB0ZXN0ZGF0YSA9IGhleHRvYjY0dShoYXNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRlc3RkYXRhO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==