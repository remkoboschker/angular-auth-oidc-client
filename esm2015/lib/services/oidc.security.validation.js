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
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
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
    // id_token C7: The current time MUST be before the time represented by the exp Claim
    // (possibly allowing for some small leeway to account for clock skew).
    // tslint:disable-next-line: variable-name
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
     * @param {?} maxOffsetAllowedInSeconds
     * @param {?} disableIatOffsetValidation
     * @return {?}
     */
    validate_id_token_iat_max_offset(dataIdToken, maxOffsetAllowedInSeconds, disableIatOffsetValidation) {
        if (disableIatOffsetValidation) {
            return true;
        }
        if (!dataIdToken.hasOwnProperty('iat')) {
            return false;
        }
        /** @type {?} */
        const dateTimeIatIdToken = new Date(0);
        dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
        maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;
        if (dateTimeIatIdToken == null) {
            return false;
        }
        this.loggerService.logDebug('validate_id_token_iat_max_offset: ' + (new Date().valueOf() - dateTimeIatIdToken.valueOf()) + ' < ' + maxOffsetAllowedInSeconds * 1000);
        return new Date().valueOf() - dateTimeIatIdToken.valueOf() < maxOffsetAllowedInSeconds * 1000;
    }
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
    validate_id_token_nonce(dataIdToken, localNonce, ignoreNonceAfterRefresh) {
        /** @type {?} */
        const isFromRefreshToken = (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === OidcSecurityValidation.RefreshTokenNoncePlaceholder;
        if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
            this.loggerService.logDebug('Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce);
            return false;
        }
        return true;
    }
    // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
    // MUST exactly match the value of the iss (issuer) Claim.
    // tslint:disable-next-line: variable-name
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
     * @param {?} localState
     * @return {?}
     */
    validateStateFromHashCallback(state, localState) {
        if (((/** @type {?} */ (state))) !== ((/** @type {?} */ (localState)))) {
            this.loggerService.logDebug('ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);
            return false;
        }
        return true;
    }
    /**
     * @param {?} idTokenSub
     * @param {?} userdataSub
     * @return {?}
     */
    validate_userdata_sub_id_token(idTokenSub, userdataSub) {
        if (((/** @type {?} */ (idTokenSub))) !== ((/** @type {?} */ (userdataSub)))) {
            this.loggerService.logDebug('validate_userdata_sub_id_token failed, id_token_sub: ' + idTokenSub + ' userdata_sub:' + userdataSub);
            return false;
        }
        return true;
    }
    // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
    // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
    // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
    // OpenID Connect Core 1.0 [OpenID.Core] specification.
    /**
     * @param {?} idToken
     * @param {?} jwtkeys
     * @return {?}
     */
    validate_signature_id_token(idToken, jwtkeys) {
        if (!jwtkeys || !jwtkeys.keys) {
            return false;
        }
        /** @type {?} */
        const headerData = this.tokenHelperService.getHeaderFromToken(idToken, false);
        if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
            this.loggerService.logWarning('id token has no header data');
            return false;
        }
        /** @type {?} */
        const kid = headerData.kid;
        /** @type {?} */
        const alg = headerData.alg;
        if ('RS256' !== ((/** @type {?} */ (alg)))) {
            this.loggerService.logWarning('Only RS256 supported');
            return false;
        }
        /** @type {?} */
        let isValid = false;
        if (!headerData.hasOwnProperty('kid')) {
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
                        isValid = KJUR.jws.JWS.verify(idToken, publickey, ['RS256']);
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
                    isValid = KJUR.jws.JWS.verify(idToken, publickey, ['RS256']);
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
     * @param {?} responseType
     * @return {?}
     */
    config_validate_response_type(responseType) {
        if (responseType === 'id_token token' || responseType === 'id_token') {
            return true;
        }
        if (responseType === 'code') {
            return true;
        }
        this.loggerService.logWarning('module configure incorrect, invalid response_type:' + responseType);
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
     * @param {?} accessToken
     * @param {?} atHash
     * @param {?} isCodeFlow
     * @return {?}
     */
    validate_id_token_at_hash(accessToken, atHash, isCodeFlow) {
        this.loggerService.logDebug('at_hash from the server:' + atHash);
        // The at_hash is optional for the code flow
        if (isCodeFlow) {
            if (!((/** @type {?} */ (atHash)))) {
                this.loggerService.logDebug('Code Flow active, and no at_hash in the id_token, skipping check!');
                return true;
            }
        }
        /** @type {?} */
        const testdata = this.generate_at_hash('' + accessToken);
        this.loggerService.logDebug('at_hash client validation not decoded:' + testdata);
        if (testdata === ((/** @type {?} */ (atHash)))) {
            return true; // isValid;
        }
        else {
            /** @type {?} */
            const testValue = this.generate_at_hash('' + decodeURIComponent(accessToken));
            this.loggerService.logDebug('-gen access--' + testValue);
            if (testValue === ((/** @type {?} */ (atHash)))) {
                return true; // isValid
            }
        }
        return false;
    }
    /**
     * @private
     * @param {?} accessToken
     * @return {?}
     */
    generate_at_hash(accessToken) {
        /** @type {?} */
        const hash = KJUR.crypto.Util.hashString(accessToken, 'sha256');
        /** @type {?} */
        const first128bits = hash.substr(0, hash.length / 2);
        /** @type {?} */
        const testdata = hextob64u(first128bits);
        return testdata;
    }
    /**
     * @param {?} codeChallenge
     * @return {?}
     */
    generate_code_verifier(codeChallenge) {
        /** @type {?} */
        const hash = KJUR.crypto.Util.hashString(codeChallenge, 'sha256');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS52YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkudmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q3RELE1BQU0sT0FBTyxzQkFBc0I7Ozs7OztJQUcvQixZQUNZLGtCQUF5QyxFQUN6QyxrQkFBc0MsRUFDdEMsYUFBNEI7UUFGNUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF1QjtRQUN6Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ3JDLENBQUM7Ozs7Ozs7O0lBSUosY0FBYyxDQUFDLEtBQWEsRUFBRSxhQUFzQjs7WUFDNUMsT0FBWTtRQUNoQixPQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzRSxDQUFDOzs7Ozs7Ozs7SUFLRCxpQ0FBaUMsQ0FBQyxnQkFBd0IsRUFBRSxhQUFzQjs7Y0FDeEUsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGtC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QUMsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUN6RCxJQUFJLFNBQVMsS0FBSyxDQUFDLG1CQUFBLE1BQU0sRUFBVSxDQUFDLEVBQUU7Z0JBQ2xDLE9BQU8sSUFBSSxDQUFDLENBQUMsVUFBVTthQUMxQjtTQUNKO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7O0lBRU8sZ0JBQWdCLENBQUMsV0FBZ0I7O2NBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQzs7Y0FDekQsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztjQUM5QyxRQUFRLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUV4QyxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7OztJQUVELHNCQUFzQixDQUFDLGFBQWtCOztjQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUM7O2NBQzNELFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRWhDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7O0FBblZNLG1EQUE0QixHQUFHLGtCQUFrQixDQUFDOztZQUY1RCxVQUFVOzs7O1lBOUNGLHFCQUFxQjtZQUNyQixrQkFBa0I7WUFDbEIsYUFBYTs7OztJQThDbEIsb0RBQXlEOzs7OztJQUdyRCxvREFBaUQ7Ozs7O0lBQ2pELG9EQUE4Qzs7Ozs7SUFDOUMsK0NBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBoZXh0b2I2NHUsIEtFWVVUSUwsIEtKVVIgfSBmcm9tICdqc3JzYXNpZ24tcmVkdWNlZCc7XHJcbmltcG9ydCB7IEVxdWFsaXR5SGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy1lcXVhbGl0eS1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy10b2tlbi1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL29pZGMubG9nZ2VyLnNlcnZpY2UnO1xyXG5cclxuLy8gaHR0cDovL29wZW5pZC5uZXQvc3BlY3Mvb3BlbmlkLWNvbm5lY3QtaW1wbGljaXQtMV8wLmh0bWxcclxuXHJcbi8vIGlkX3Rva2VuXHJcbi8vIGlkX3Rva2VuIEMxOiBUaGUgSXNzdWVyIElkZW50aWZpZXIgZm9yIHRoZSBPcGVuSUQgUHJvdmlkZXIgKHdoaWNoIGlzIHR5cGljYWxseSBvYnRhaW5lZCBkdXJpbmcgRGlzY292ZXJ5KVxyXG4vLyBNVVNUIGV4YWN0bHkgbWF0Y2ggdGhlIHZhbHVlIG9mIHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0uXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEMyOiBUaGUgQ2xpZW50IE1VU1QgdmFsaWRhdGUgdGhhdCB0aGUgYXVkIChhdWRpZW5jZSkgQ2xhaW0gY29udGFpbnMgaXRzIGNsaWVudF9pZCB2YWx1ZSByZWdpc3RlcmVkIGF0IHRoZSBJc3N1ZXIgaWRlbnRpZmllZFxyXG4vLyBieSB0aGUgaXNzIChpc3N1ZXIpIENsYWltIGFzIGFuIGF1ZGllbmNlLlRoZSBJRCBUb2tlbiBNVVNUIGJlIHJlamVjdGVkIGlmIHRoZSBJRCBUb2tlbiBkb2VzIG5vdCBsaXN0IHRoZSBDbGllbnQgYXMgYSB2YWxpZCBhdWRpZW5jZSxcclxuLy8gb3IgaWYgaXQgY29udGFpbnMgYWRkaXRpb25hbCBhdWRpZW5jZXMgbm90IHRydXN0ZWQgYnkgdGhlIENsaWVudC5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzM6IElmIHRoZSBJRCBUb2tlbiBjb250YWlucyBtdWx0aXBsZSBhdWRpZW5jZXMsIHRoZSBDbGllbnQgU0hPVUxEIHZlcmlmeSB0aGF0IGFuIGF6cCBDbGFpbSBpcyBwcmVzZW50LlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNDogSWYgYW4gYXpwIChhdXRob3JpemVkIHBhcnR5KSBDbGFpbSBpcyBwcmVzZW50LCB0aGUgQ2xpZW50IFNIT1VMRCB2ZXJpZnkgdGhhdCBpdHMgY2xpZW50X2lkIGlzIHRoZSBDbGFpbSBWYWx1ZS5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzU6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGUgc2lnbmF0dXJlIG9mIHRoZSBJRCBUb2tlbiBhY2NvcmRpbmcgdG8gSldTIFtKV1NdIHVzaW5nIHRoZSBhbGdvcml0aG0gc3BlY2lmaWVkIGluIHRoZVxyXG4vLyBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSk9TRSBIZWFkZXIuVGhlIENsaWVudCBNVVNUIHVzZSB0aGUga2V5cyBwcm92aWRlZCBieSB0aGUgSXNzdWVyLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDNjogVGhlIGFsZyB2YWx1ZSBTSE9VTEQgYmUgUlMyNTYuIFZhbGlkYXRpb24gb2YgdG9rZW5zIHVzaW5nIG90aGVyIHNpZ25pbmcgYWxnb3JpdGhtcyBpcyBkZXNjcmliZWQgaW4gdGhlIE9wZW5JRCBDb25uZWN0IENvcmUgMS4wXHJcbi8vIFtPcGVuSUQuQ29yZV0gc3BlY2lmaWNhdGlvbi5cclxuLy9cclxuLy8gaWRfdG9rZW4gQzc6IFRoZSBjdXJyZW50IHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIHRpbWUgcmVwcmVzZW50ZWQgYnkgdGhlIGV4cCBDbGFpbSAocG9zc2libHkgYWxsb3dpbmcgZm9yIHNvbWUgc21hbGwgbGVld2F5IHRvIGFjY291bnRcclxuLy8gZm9yIGNsb2NrIHNrZXcpLlxyXG4vL1xyXG4vLyBpZF90b2tlbiBDODogVGhlIGlhdCBDbGFpbSBjYW4gYmUgdXNlZCB0byByZWplY3QgdG9rZW5zIHRoYXQgd2VyZSBpc3N1ZWQgdG9vIGZhciBhd2F5IGZyb20gdGhlIGN1cnJlbnQgdGltZSxcclxuLy8gbGltaXRpbmcgdGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgbm9uY2VzIG5lZWQgdG8gYmUgc3RvcmVkIHRvIHByZXZlbnQgYXR0YWNrcy5UaGUgYWNjZXB0YWJsZSByYW5nZSBpcyBDbGllbnQgc3BlY2lmaWMuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEM5OiBUaGUgdmFsdWUgb2YgdGhlIG5vbmNlIENsYWltIE1VU1QgYmUgY2hlY2tlZCB0byB2ZXJpZnkgdGhhdCBpdCBpcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgb25lIHRoYXQgd2FzIHNlbnRcclxuLy8gaW4gdGhlIEF1dGhlbnRpY2F0aW9uIFJlcXVlc3QuVGhlIENsaWVudCBTSE9VTEQgY2hlY2sgdGhlIG5vbmNlIHZhbHVlIGZvciByZXBsYXkgYXR0YWNrcy5UaGUgcHJlY2lzZSBtZXRob2QgZm9yIGRldGVjdGluZyByZXBsYXkgYXR0YWNrc1xyXG4vLyBpcyBDbGllbnQgc3BlY2lmaWMuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEMxMDogSWYgdGhlIGFjciBDbGFpbSB3YXMgcmVxdWVzdGVkLCB0aGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGF0IHRoZSBhc3NlcnRlZCBDbGFpbSBWYWx1ZSBpcyBhcHByb3ByaWF0ZS5cclxuLy8gVGhlIG1lYW5pbmcgYW5kIHByb2Nlc3Npbmcgb2YgYWNyIENsYWltIFZhbHVlcyBpcyBvdXQgb2Ygc2NvcGUgZm9yIHRoaXMgZG9jdW1lbnQuXHJcbi8vXHJcbi8vIGlkX3Rva2VuIEMxMTogV2hlbiBhIG1heF9hZ2UgcmVxdWVzdCBpcyBtYWRlLCB0aGUgQ2xpZW50IFNIT1VMRCBjaGVjayB0aGUgYXV0aF90aW1lIENsYWltIHZhbHVlIGFuZCByZXF1ZXN0IHJlLSBhdXRoZW50aWNhdGlvblxyXG4vLyBpZiBpdCBkZXRlcm1pbmVzIHRvbyBtdWNoIHRpbWUgaGFzIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgRW5kLSBVc2VyIGF1dGhlbnRpY2F0aW9uLlxyXG5cclxuLy8gQWNjZXNzIFRva2VuIFZhbGlkYXRpb25cclxuLy8gYWNjZXNzX3Rva2VuIEMxOiBIYXNoIHRoZSBvY3RldHMgb2YgdGhlIEFTQ0lJIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhY2Nlc3NfdG9rZW4gd2l0aCB0aGUgaGFzaCBhbGdvcml0aG0gc3BlY2lmaWVkIGluIEpXQVtKV0FdXHJcbi8vIGZvciB0aGUgYWxnIEhlYWRlciBQYXJhbWV0ZXIgb2YgdGhlIElEIFRva2VuJ3MgSk9TRSBIZWFkZXIuIEZvciBpbnN0YW5jZSwgaWYgdGhlIGFsZyBpcyBSUzI1NiwgdGhlIGhhc2ggYWxnb3JpdGhtIHVzZWQgaXMgU0hBLTI1Ni5cclxuLy8gYWNjZXNzX3Rva2VuIEMyOiBUYWtlIHRoZSBsZWZ0LSBtb3N0IGhhbGYgb2YgdGhlIGhhc2ggYW5kIGJhc2U2NHVybC0gZW5jb2RlIGl0LlxyXG4vLyBhY2Nlc3NfdG9rZW4gQzM6IFRoZSB2YWx1ZSBvZiBhdF9oYXNoIGluIHRoZSBJRCBUb2tlbiBNVVNUIG1hdGNoIHRoZSB2YWx1ZSBwcm9kdWNlZCBpbiB0aGUgcHJldmlvdXMgc3RlcCBpZiBhdF9oYXNoIGlzIHByZXNlbnQgaW4gdGhlIElEIFRva2VuLlxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5VmFsaWRhdGlvbiB7XHJcbiAgICBzdGF0aWMgUmVmcmVzaFRva2VuTm9uY2VQbGFjZWhvbGRlciA9ICctLVJlZnJlc2hUb2tlbi0tJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGFycmF5SGVscGVyU2VydmljZTogRXF1YWxpdHlIZWxwZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgdG9rZW5IZWxwZXJTZXJ2aWNlOiBUb2tlbkhlbHBlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlXHJcbiAgICApIHt9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzc6IFRoZSBjdXJyZW50IHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIHRpbWUgcmVwcmVzZW50ZWQgYnkgdGhlIGV4cCBDbGFpbVxyXG4gICAgLy8gKHBvc3NpYmx5IGFsbG93aW5nIGZvciBzb21lIHNtYWxsIGxlZXdheSB0byBhY2NvdW50IGZvciBjbG9jayBza2V3KS5cclxuICAgIGlzVG9rZW5FeHBpcmVkKHRva2VuOiBzdHJpbmcsIG9mZnNldFNlY29uZHM/OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgZGVjb2RlZDogYW55O1xyXG4gICAgICAgIGRlY29kZWQgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiAhdGhpcy52YWxpZGF0ZV9pZF90b2tlbl9leHBfbm90X2V4cGlyZWQoZGVjb2RlZCwgb2Zmc2V0U2Vjb25kcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzc6IFRoZSBjdXJyZW50IHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIHRpbWUgcmVwcmVzZW50ZWQgYnkgdGhlIGV4cCBDbGFpbVxyXG4gICAgLy8gKHBvc3NpYmx5IGFsbG93aW5nIGZvciBzb21lIHNtYWxsIGxlZXdheSB0byBhY2NvdW50IGZvciBjbG9jayBza2V3KS5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogdmFyaWFibGUtbmFtZVxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fZXhwX25vdF9leHBpcmVkKGRlY29kZWRfaWRfdG9rZW46IHN0cmluZywgb2Zmc2V0U2Vjb25kcz86IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHRva2VuRXhwaXJhdGlvbkRhdGUgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRUb2tlbkV4cGlyYXRpb25EYXRlKGRlY29kZWRfaWRfdG9rZW4pO1xyXG4gICAgICAgIG9mZnNldFNlY29uZHMgPSBvZmZzZXRTZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgICAgIGlmICghdG9rZW5FeHBpcmF0aW9uRGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbkV4cGlyYXRpb25WYWx1ZSA9IHRva2VuRXhwaXJhdGlvbkRhdGUudmFsdWVPZigpO1xyXG4gICAgICAgIGNvbnN0IG5vd1dpdGhPZmZzZXQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKSArIG9mZnNldFNlY29uZHMgKiAxMDAwO1xyXG4gICAgICAgIGNvbnN0IHRva2VuTm90RXhwaXJlZCA9IHRva2VuRXhwaXJhdGlvblZhbHVlID4gbm93V2l0aE9mZnNldDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBUb2tlbiBub3QgZXhwaXJlZD86ICR7dG9rZW5FeHBpcmF0aW9uVmFsdWV9ID4gJHtub3dXaXRoT2Zmc2V0fSAgKCR7dG9rZW5Ob3RFeHBpcmVkfSlgKTtcclxuXHJcbiAgICAgICAgLy8gVG9rZW4gbm90IGV4cGlyZWQ/XHJcbiAgICAgICAgcmV0dXJuIHRva2VuTm90RXhwaXJlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpc3NcclxuICAgIC8vIFJFUVVJUkVELiBJc3N1ZXIgSWRlbnRpZmllciBmb3IgdGhlIElzc3VlciBvZiB0aGUgcmVzcG9uc2UuVGhlIGlzcyB2YWx1ZSBpcyBhIGNhc2Utc2Vuc2l0aXZlIFVSTCB1c2luZyB0aGVcclxuICAgIC8vIGh0dHBzIHNjaGVtZSB0aGF0IGNvbnRhaW5zIHNjaGVtZSwgaG9zdCxcclxuICAgIC8vIGFuZCBvcHRpb25hbGx5LCBwb3J0IG51bWJlciBhbmQgcGF0aCBjb21wb25lbnRzIGFuZCBubyBxdWVyeSBvciBmcmFnbWVudCBjb21wb25lbnRzLlxyXG4gICAgLy9cclxuICAgIC8vIHN1YlxyXG4gICAgLy8gUkVRVUlSRUQuIFN1YmplY3QgSWRlbnRpZmllci5Mb2NhbGx5IHVuaXF1ZSBhbmQgbmV2ZXIgcmVhc3NpZ25lZCBpZGVudGlmaWVyIHdpdGhpbiB0aGUgSXNzdWVyIGZvciB0aGUgRW5kLSBVc2VyLFxyXG4gICAgLy8gd2hpY2ggaXMgaW50ZW5kZWQgdG8gYmUgY29uc3VtZWQgYnkgdGhlIENsaWVudCwgZS5nLiwgMjQ0MDAzMjAgb3IgQUl0T2F3bXd0V3djVDBrNTFCYXlld052dXRySlVxc3ZsNnFzN0E0LlxyXG4gICAgLy8gSXQgTVVTVCBOT1QgZXhjZWVkIDI1NSBBU0NJSSBjaGFyYWN0ZXJzIGluIGxlbmd0aC5UaGUgc3ViIHZhbHVlIGlzIGEgY2FzZS1zZW5zaXRpdmUgc3RyaW5nLlxyXG4gICAgLy9cclxuICAgIC8vIGF1ZFxyXG4gICAgLy8gUkVRVUlSRUQuIEF1ZGllbmNlKHMpIHRoYXQgdGhpcyBJRCBUb2tlbiBpcyBpbnRlbmRlZCBmb3IuIEl0IE1VU1QgY29udGFpbiB0aGUgT0F1dGggMi4wIGNsaWVudF9pZCBvZiB0aGUgUmVseWluZyBQYXJ0eSBhcyBhbiBhdWRpZW5jZSB2YWx1ZS5cclxuICAgIC8vIEl0IE1BWSBhbHNvIGNvbnRhaW4gaWRlbnRpZmllcnMgZm9yIG90aGVyIGF1ZGllbmNlcy5JbiB0aGUgZ2VuZXJhbCBjYXNlLCB0aGUgYXVkIHZhbHVlIGlzIGFuIGFycmF5IG9mIGNhc2Utc2Vuc2l0aXZlIHN0cmluZ3MuXHJcbiAgICAvLyBJbiB0aGUgY29tbW9uIHNwZWNpYWwgY2FzZSB3aGVuIHRoZXJlIGlzIG9uZSBhdWRpZW5jZSwgdGhlIGF1ZCB2YWx1ZSBNQVkgYmUgYSBzaW5nbGUgY2FzZS1zZW5zaXRpdmUgc3RyaW5nLlxyXG4gICAgLy9cclxuICAgIC8vIGV4cFxyXG4gICAgLy8gUkVRVUlSRUQuIEV4cGlyYXRpb24gdGltZSBvbiBvciBhZnRlciB3aGljaCB0aGUgSUQgVG9rZW4gTVVTVCBOT1QgYmUgYWNjZXB0ZWQgZm9yIHByb2Nlc3NpbmcuXHJcbiAgICAvLyBUaGUgcHJvY2Vzc2luZyBvZiB0aGlzIHBhcmFtZXRlciByZXF1aXJlcyB0aGF0IHRoZSBjdXJyZW50IGRhdGUvIHRpbWUgTVVTVCBiZSBiZWZvcmUgdGhlIGV4cGlyYXRpb24gZGF0ZS8gdGltZSBsaXN0ZWQgaW4gdGhlIHZhbHVlLlxyXG4gICAgLy8gSW1wbGVtZW50ZXJzIE1BWSBwcm92aWRlIGZvciBzb21lIHNtYWxsIGxlZXdheSwgdXN1YWxseSBubyBtb3JlIHRoYW4gYSBmZXcgbWludXRlcywgdG8gYWNjb3VudCBmb3IgY2xvY2sgc2tldy5cclxuICAgIC8vIEl0cyB2YWx1ZSBpcyBhIEpTT04gW1JGQzcxNTldIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gMTk3MC0gMDEgLSAwMVQwMDogMDA6MDBaIGFzIG1lYXN1cmVkIGluIFVUQyB1bnRpbCB0aGUgZGF0ZS8gdGltZS5cclxuICAgIC8vIFNlZSBSRkMgMzMzOSBbUkZDMzMzOV0gZm9yIGRldGFpbHMgcmVnYXJkaW5nIGRhdGUvIHRpbWVzIGluIGdlbmVyYWwgYW5kIFVUQyBpbiBwYXJ0aWN1bGFyLlxyXG4gICAgLy9cclxuICAgIC8vIGlhdFxyXG4gICAgLy8gUkVRVUlSRUQuIFRpbWUgYXQgd2hpY2ggdGhlIEpXVCB3YXMgaXNzdWVkLiBJdHMgdmFsdWUgaXMgYSBKU09OIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb21cclxuICAgIC8vIDE5NzAtIDAxIC0gMDFUMDA6IDAwOiAwMFogYXMgbWVhc3VyZWRcclxuICAgIC8vIGluIFVUQyB1bnRpbCB0aGUgZGF0ZS8gdGltZS5cclxuICAgIHZhbGlkYXRlX3JlcXVpcmVkX2lkX3Rva2VuKGRhdGFJZFRva2VuOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdpc3MnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2lzcyBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnc3ViJykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdzdWIgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YUlkVG9rZW4uaGFzT3duUHJvcGVydHkoJ2F1ZCcpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXVkIGlzIG1pc3NpbmcsIHRoaXMgaXMgcmVxdWlyZWQgaW4gdGhlIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdleHAnKSkge1xyXG4gICAgICAgICAgICB2YWxpZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2V4cCBpcyBtaXNzaW5nLCB0aGlzIGlzIHJlcXVpcmVkIGluIHRoZSBpZF90b2tlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkYXRhSWRUb2tlbi5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICAgICAgdmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpYXQgaXMgbWlzc2luZywgdGhpcyBpcyByZXF1aXJlZCBpbiB0aGUgaWRfdG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZGF0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzg6IFRoZSBpYXQgQ2xhaW0gY2FuIGJlIHVzZWQgdG8gcmVqZWN0IHRva2VucyB0aGF0IHdlcmUgaXNzdWVkIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRpbWUsXHJcbiAgICAvLyBsaW1pdGluZyB0aGUgYW1vdW50IG9mIHRpbWUgdGhhdCBub25jZXMgbmVlZCB0byBiZSBzdG9yZWQgdG8gcHJldmVudCBhdHRhY2tzLlRoZSBhY2NlcHRhYmxlIHJhbmdlIGlzIENsaWVudCBzcGVjaWZpYy5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX2lhdF9tYXhfb2Zmc2V0KGRhdGFJZFRva2VuOiBhbnksIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHM6IG51bWJlciwgZGlzYWJsZUlhdE9mZnNldFZhbGlkYXRpb246IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoZGlzYWJsZUlhdE9mZnNldFZhbGlkYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGFJZFRva2VuLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlVGltZUlhdElkVG9rZW4gPSBuZXcgRGF0ZSgwKTsgLy8gVGhlIDAgaGVyZSBpcyB0aGUga2V5LCB3aGljaCBzZXRzIHRoZSBkYXRlIHRvIHRoZSBlcG9jaFxyXG4gICAgICAgIGRhdGVUaW1lSWF0SWRUb2tlbi5zZXRVVENTZWNvbmRzKGRhdGFJZFRva2VuLmlhdCk7XHJcblxyXG4gICAgICAgIG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgPSBtYXhPZmZzZXRBbGxvd2VkSW5TZWNvbmRzIHx8IDA7XHJcblxyXG4gICAgICAgIGlmIChkYXRlVGltZUlhdElkVG9rZW4gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoXHJcbiAgICAgICAgICAgICd2YWxpZGF0ZV9pZF90b2tlbl9pYXRfbWF4X29mZnNldDogJyArIChuZXcgRGF0ZSgpLnZhbHVlT2YoKSAtIGRhdGVUaW1lSWF0SWRUb2tlbi52YWx1ZU9mKCkpICsgJyA8ICcgKyBtYXhPZmZzZXRBbGxvd2VkSW5TZWNvbmRzICogMTAwMFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkudmFsdWVPZigpIC0gZGF0ZVRpbWVJYXRJZFRva2VuLnZhbHVlT2YoKSA8IG1heE9mZnNldEFsbG93ZWRJblNlY29uZHMgKiAxMDAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEM5OiBUaGUgdmFsdWUgb2YgdGhlIG5vbmNlIENsYWltIE1VU1QgYmUgY2hlY2tlZCB0byB2ZXJpZnkgdGhhdCBpdCBpcyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgb25lXHJcbiAgICAvLyB0aGF0IHdhcyBzZW50IGluIHRoZSBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0LlRoZSBDbGllbnQgU0hPVUxEIGNoZWNrIHRoZSBub25jZSB2YWx1ZSBmb3IgcmVwbGF5IGF0dGFja3MuXHJcbiAgICAvLyBUaGUgcHJlY2lzZSBtZXRob2QgZm9yIGRldGVjdGluZyByZXBsYXkgYXR0YWNrcyBpcyBDbGllbnQgc3BlY2lmaWMuXHJcblxyXG4gICAgLy8gSG93ZXZlciB0aGUgbm9uY2UgY2xhaW0gU0hPVUxEIG5vdCBiZSBwcmVzZW50IGZvciB0aGUgcmVmZXNoX3Rva2VuIGdyYW50IHR5cGVcclxuICAgIC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9vcGVuaWQvY29ubmVjdC9pc3N1ZXMvMTAyNS9hbWJpZ3VpdHktd2l0aC1ob3ctbm9uY2UtaXMtaGFuZGxlZC1vblxyXG4gICAgLy8gVGhlIGN1cnJlbnQgc3BlYyBpcyBhbWJpZ3VvdXMgYW5kIEtleWNsb2FrIGRvZXMgc2VuZCBpdC5cclxuICAgIHZhbGlkYXRlX2lkX3Rva2VuX25vbmNlKGRhdGFJZFRva2VuOiBhbnksIGxvY2FsTm9uY2U6IGFueSwgaWdub3JlTm9uY2VBZnRlclJlZnJlc2g6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBpc0Zyb21SZWZyZXNoVG9rZW4gPVxyXG4gICAgICAgICAgICAoZGF0YUlkVG9rZW4ubm9uY2UgPT09IHVuZGVmaW5lZCB8fCBpZ25vcmVOb25jZUFmdGVyUmVmcmVzaCkgJiYgbG9jYWxOb25jZSA9PT0gT2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5SZWZyZXNoVG9rZW5Ob25jZVBsYWNlaG9sZGVyO1xyXG4gICAgICAgIGlmICghaXNGcm9tUmVmcmVzaFRva2VuICYmIGRhdGFJZFRva2VuLm5vbmNlICE9PSBsb2NhbE5vbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVfaWRfdG9rZW5fbm9uY2UgZmFpbGVkLCBkYXRhSWRUb2tlbi5ub25jZTogJyArIGRhdGFJZFRva2VuLm5vbmNlICsgJyBsb2NhbF9ub25jZTonICsgbG9jYWxOb25jZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlkX3Rva2VuIEMxOiBUaGUgSXNzdWVyIElkZW50aWZpZXIgZm9yIHRoZSBPcGVuSUQgUHJvdmlkZXIgKHdoaWNoIGlzIHR5cGljYWxseSBvYnRhaW5lZCBkdXJpbmcgRGlzY292ZXJ5KVxyXG4gICAgLy8gTVVTVCBleGFjdGx5IG1hdGNoIHRoZSB2YWx1ZSBvZiB0aGUgaXNzIChpc3N1ZXIpIENsYWltLlxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB2YXJpYWJsZS1uYW1lXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9pc3MoZGF0YUlkVG9rZW46IGFueSwgYXV0aFdlbGxLbm93bkVuZHBvaW50c19pc3N1ZXI6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICgoZGF0YUlkVG9rZW4uaXNzIGFzIHN0cmluZykgIT09IChhdXRoV2VsbEtub3duRW5kcG9pbnRzX2lzc3VlciBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgICAgICAgICAgICdWYWxpZGF0ZV9pZF90b2tlbl9pc3MgZmFpbGVkLCBkYXRhSWRUb2tlbi5pc3M6ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFJZFRva2VuLmlzcyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzc3VlcjonICtcclxuICAgICAgICAgICAgICAgICAgICBhdXRoV2VsbEtub3duRW5kcG9pbnRzX2lzc3VlclxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZF90b2tlbiBDMjogVGhlIENsaWVudCBNVVNUIHZhbGlkYXRlIHRoYXQgdGhlIGF1ZCAoYXVkaWVuY2UpIENsYWltIGNvbnRhaW5zIGl0cyBjbGllbnRfaWQgdmFsdWUgcmVnaXN0ZXJlZCBhdCB0aGUgSXNzdWVyIGlkZW50aWZpZWRcclxuICAgIC8vIGJ5IHRoZSBpc3MgKGlzc3VlcikgQ2xhaW0gYXMgYW4gYXVkaWVuY2UuXHJcbiAgICAvLyBUaGUgSUQgVG9rZW4gTVVTVCBiZSByZWplY3RlZCBpZiB0aGUgSUQgVG9rZW4gZG9lcyBub3QgbGlzdCB0aGUgQ2xpZW50IGFzIGEgdmFsaWQgYXVkaWVuY2UsIG9yIGlmIGl0IGNvbnRhaW5zIGFkZGl0aW9uYWwgYXVkaWVuY2VzXHJcbiAgICAvLyBub3QgdHJ1c3RlZCBieSB0aGUgQ2xpZW50LlxyXG4gICAgdmFsaWRhdGVfaWRfdG9rZW5fYXVkKGRhdGFJZFRva2VuOiBhbnksIGF1ZDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGRhdGFJZFRva2VuLmF1ZCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXJyYXlIZWxwZXJTZXJ2aWNlLmFyZUVxdWFsKGRhdGFJZFRva2VuLmF1ZCwgYXVkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1ZhbGlkYXRlX2lkX3Rva2VuX2F1ZCAgYXJyYXkgZmFpbGVkLCBkYXRhSWRUb2tlbi5hdWQ6ICcgKyBkYXRhSWRUb2tlbi5hdWQgKyAnIGNsaWVudF9pZDonICsgYXVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhSWRUb2tlbi5hdWQgIT09IGF1ZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1ZhbGlkYXRlX2lkX3Rva2VuX2F1ZCBmYWlsZWQsIGRhdGFJZFRva2VuLmF1ZDogJyArIGRhdGFJZFRva2VuLmF1ZCArICcgY2xpZW50X2lkOicgKyBhdWQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2soc3RhdGU6IGFueSwgbG9jYWxTdGF0ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKChzdGF0ZSBhcyBzdHJpbmcpICE9PSAobG9jYWxTdGF0ZSBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnVmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2sgZmFpbGVkLCBzdGF0ZTogJyArIHN0YXRlICsgJyBsb2NhbF9zdGF0ZTonICsgbG9jYWxTdGF0ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRlX3VzZXJkYXRhX3N1Yl9pZF90b2tlbihpZFRva2VuU3ViOiBhbnksIHVzZXJkYXRhU3ViOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoKGlkVG9rZW5TdWIgYXMgc3RyaW5nKSAhPT0gKHVzZXJkYXRhU3ViIGFzIHN0cmluZykpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCd2YWxpZGF0ZV91c2VyZGF0YV9zdWJfaWRfdG9rZW4gZmFpbGVkLCBpZF90b2tlbl9zdWI6ICcgKyBpZFRva2VuU3ViICsgJyB1c2VyZGF0YV9zdWI6JyArIHVzZXJkYXRhU3ViKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWRfdG9rZW4gQzU6IFRoZSBDbGllbnQgTVVTVCB2YWxpZGF0ZSB0aGUgc2lnbmF0dXJlIG9mIHRoZSBJRCBUb2tlbiBhY2NvcmRpbmcgdG8gSldTIFtKV1NdIHVzaW5nIHRoZSBhbGdvcml0aG0gc3BlY2lmaWVkIGluIHRoZSBhbGdcclxuICAgIC8vIEhlYWRlciBQYXJhbWV0ZXIgb2YgdGhlIEpPU0UgSGVhZGVyLlRoZSBDbGllbnQgTVVTVCB1c2UgdGhlIGtleXMgcHJvdmlkZWQgYnkgdGhlIElzc3Vlci5cclxuICAgIC8vIGlkX3Rva2VuIEM2OiBUaGUgYWxnIHZhbHVlIFNIT1VMRCBiZSBSUzI1Ni4gVmFsaWRhdGlvbiBvZiB0b2tlbnMgdXNpbmcgb3RoZXIgc2lnbmluZyBhbGdvcml0aG1zIGlzIGRlc2NyaWJlZCBpbiB0aGVcclxuICAgIC8vIE9wZW5JRCBDb25uZWN0IENvcmUgMS4wIFtPcGVuSUQuQ29yZV0gc3BlY2lmaWNhdGlvbi5cclxuICAgIHZhbGlkYXRlX3NpZ25hdHVyZV9pZF90b2tlbihpZFRva2VuOiBhbnksIGp3dGtleXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghand0a2V5cyB8fCAhand0a2V5cy5rZXlzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlckRhdGEgPSB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRIZWFkZXJGcm9tVG9rZW4oaWRUb2tlbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoaGVhZGVyRGF0YSkubGVuZ3RoID09PSAwICYmIGhlYWRlckRhdGEuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaWQgdG9rZW4gaGFzIG5vIGhlYWRlciBkYXRhJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGtpZCA9IGhlYWRlckRhdGEua2lkO1xyXG4gICAgICAgIGNvbnN0IGFsZyA9IGhlYWRlckRhdGEuYWxnO1xyXG5cclxuICAgICAgICBpZiAoJ1JTMjU2JyAhPT0gKGFsZyBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdPbmx5IFJTMjU2IHN1cHBvcnRlZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIWhlYWRlckRhdGEuaGFzT3duUHJvcGVydHkoJ2tpZCcpKSB7XHJcbiAgICAgICAgICAgIC8vIGV4YWN0bHkgMSBrZXkgaW4gdGhlIGp3dGtleXMgYW5kIG5vIGtpZCBpbiB0aGUgSm9zZSBoZWFkZXJcclxuICAgICAgICAgICAgLy8ga3R5XHRcIlJTQVwiIHVzZSBcInNpZ1wiXHJcbiAgICAgICAgICAgIGxldCBhbW91bnRPZk1hdGNoaW5nS2V5cyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGp3dGtleXMua2V5cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChrZXkua3R5IGFzIHN0cmluZykgPT09ICdSU0EnICYmIChrZXkudXNlIGFzIHN0cmluZykgPT09ICdzaWcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50T2ZNYXRjaGluZ0tleXMgPSBhbW91bnRPZk1hdGNoaW5nS2V5cyArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhbW91bnRPZk1hdGNoaW5nS2V5cyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ25vIGtleXMgZm91bmQsIGluY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFtb3VudE9mTWF0Y2hpbmdLZXlzID4gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ25vIElEIFRva2VuIGtpZCBjbGFpbSBpbiBKT1NFIGhlYWRlciBhbmQgbXVsdGlwbGUgc3VwcGxpZWQgaW4gandrc191cmknKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGp3dGtleXMua2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoa2V5Lmt0eSBhcyBzdHJpbmcpID09PSAnUlNBJyAmJiAoa2V5LnVzZSBhcyBzdHJpbmcpID09PSAnc2lnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwdWJsaWNrZXkgPSBLRVlVVElMLmdldEtleShrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gS0pVUi5qd3MuSldTLnZlcmlmeShpZFRva2VuLCBwdWJsaWNrZXksIFsnUlMyNTYnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2luY29ycmVjdCBTaWduYXR1cmUsIHZhbGlkYXRpb24gZmFpbGVkIGZvciBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGtpZCBpbiB0aGUgSm9zZSBoZWFkZXIgb2YgaWRfdG9rZW5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygand0a2V5cy5rZXlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGtleS5raWQgYXMgc3RyaW5nKSA9PT0gKGtpZCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHVibGlja2V5ID0gS0VZVVRJTC5nZXRLZXkoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gS0pVUi5qd3MuSldTLnZlcmlmeShpZFRva2VuLCBwdWJsaWNrZXksIFsnUlMyNTYnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbmNvcnJlY3QgU2lnbmF0dXJlLCB2YWxpZGF0aW9uIGZhaWxlZCBmb3IgaWRfdG9rZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ192YWxpZGF0ZV9yZXNwb25zZV90eXBlKHJlc3BvbnNlVHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlVHlwZSA9PT0gJ2lkX3Rva2VuIHRva2VuJyB8fCByZXNwb25zZVR5cGUgPT09ICdpZF90b2tlbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2VUeXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnbW9kdWxlIGNvbmZpZ3VyZSBpbmNvcnJlY3QsIGludmFsaWQgcmVzcG9uc2VfdHlwZTonICsgcmVzcG9uc2VUeXBlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWNjZXB0cyBJRCBUb2tlbiB3aXRob3V0ICdraWQnIGNsYWltIGluIEpPU0UgaGVhZGVyIGlmIG9ubHkgb25lIEpXSyBzdXBwbGllZCBpbiAnandrc191cmwnXHJcbiAgICAvLy8vIHByaXZhdGUgdmFsaWRhdGVfbm9fa2lkX2luX2hlYWRlcl9vbmx5X29uZV9hbGxvd2VkX2luX2p3dGtleXMoaGVhZGVyX2RhdGE6IGFueSwgand0a2V5czogYW55KTogYm9vbGVhbiB7XHJcbiAgICAvLy8vICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmxvZ0RlYnVnKCdhbW91bnQgb2Ygand0a2V5cy5rZXlzOiAnICsgand0a2V5cy5rZXlzLmxlbmd0aCk7XHJcbiAgICAvLy8vICAgIGlmICghaGVhZGVyX2RhdGEuaGFzT3duUHJvcGVydHkoJ2tpZCcpKSB7XHJcbiAgICAvLy8vICAgICAgICAvLyBubyBraWQgZGVmaW5lZCBpbiBKb3NlIGhlYWRlclxyXG4gICAgLy8vLyAgICAgICAgaWYgKGp3dGtleXMua2V5cy5sZW5ndGggIT0gMSkge1xyXG4gICAgLy8vLyAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmxvZ0RlYnVnKCdqd3RrZXlzLmtleXMubGVuZ3RoICE9IDEgYW5kIG5vIGtpZCBpbiBoZWFkZXInKTtcclxuICAgIC8vLy8gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLy8vICAgICAgICB9XHJcbiAgICAvLy8vICAgIH1cclxuXHJcbiAgICAvLy8vICAgIHJldHVybiB0cnVlO1xyXG4gICAgLy8vLyB9XHJcblxyXG4gICAgLy8gQWNjZXNzIFRva2VuIFZhbGlkYXRpb25cclxuICAgIC8vIGFjY2Vzc190b2tlbiBDMTogSGFzaCB0aGUgb2N0ZXRzIG9mIHRoZSBBU0NJSSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWNjZXNzX3Rva2VuIHdpdGggdGhlIGhhc2ggYWxnb3JpdGhtIHNwZWNpZmllZCBpbiBKV0FbSldBXVxyXG4gICAgLy8gZm9yIHRoZSBhbGcgSGVhZGVyIFBhcmFtZXRlciBvZiB0aGUgSUQgVG9rZW4ncyBKT1NFIEhlYWRlci4gRm9yIGluc3RhbmNlLCBpZiB0aGUgYWxnIGlzIFJTMjU2LCB0aGUgaGFzaCBhbGdvcml0aG0gdXNlZCBpcyBTSEEtMjU2LlxyXG4gICAgLy8gYWNjZXNzX3Rva2VuIEMyOiBUYWtlIHRoZSBsZWZ0LSBtb3N0IGhhbGYgb2YgdGhlIGhhc2ggYW5kIGJhc2U2NHVybC0gZW5jb2RlIGl0LlxyXG4gICAgLy8gYWNjZXNzX3Rva2VuIEMzOiBUaGUgdmFsdWUgb2YgYXRfaGFzaCBpbiB0aGUgSUQgVG9rZW4gTVVTVCBtYXRjaCB0aGUgdmFsdWUgcHJvZHVjZWQgaW4gdGhlIHByZXZpb3VzIHN0ZXAgaWYgYXRfaGFzaFxyXG4gICAgLy8gaXMgcHJlc2VudCBpbiB0aGUgSUQgVG9rZW4uXHJcbiAgICB2YWxpZGF0ZV9pZF90b2tlbl9hdF9oYXNoKGFjY2Vzc1Rva2VuOiBhbnksIGF0SGFzaDogYW55LCBpc0NvZGVGbG93OiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdF9oYXNoIGZyb20gdGhlIHNlcnZlcjonICsgYXRIYXNoKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGF0X2hhc2ggaXMgb3B0aW9uYWwgZm9yIHRoZSBjb2RlIGZsb3dcclxuICAgICAgICBpZiAoaXNDb2RlRmxvdykge1xyXG4gICAgICAgICAgICBpZiAoIShhdEhhc2ggYXMgc3RyaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdDb2RlIEZsb3cgYWN0aXZlLCBhbmQgbm8gYXRfaGFzaCBpbiB0aGUgaWRfdG9rZW4sIHNraXBwaW5nIGNoZWNrIScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRlc3RkYXRhID0gdGhpcy5nZW5lcmF0ZV9hdF9oYXNoKCcnICsgYWNjZXNzVG9rZW4pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXRfaGFzaCBjbGllbnQgdmFsaWRhdGlvbiBub3QgZGVjb2RlZDonICsgdGVzdGRhdGEpO1xyXG4gICAgICAgIGlmICh0ZXN0ZGF0YSA9PT0gKGF0SGFzaCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBpc1ZhbGlkO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RWYWx1ZSA9IHRoaXMuZ2VuZXJhdGVfYXRfaGFzaCgnJyArIGRlY29kZVVSSUNvbXBvbmVudChhY2Nlc3NUb2tlbikpO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJy1nZW4gYWNjZXNzLS0nICsgdGVzdFZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRlc3RWYWx1ZSA9PT0gKGF0SGFzaCBhcyBzdHJpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gaXNWYWxpZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZV9hdF9oYXNoKGFjY2Vzc1Rva2VuOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGhhc2ggPSBLSlVSLmNyeXB0by5VdGlsLmhhc2hTdHJpbmcoYWNjZXNzVG9rZW4sICdzaGEyNTYnKTtcclxuICAgICAgICBjb25zdCBmaXJzdDEyOGJpdHMgPSBoYXNoLnN1YnN0cigwLCBoYXNoLmxlbmd0aCAvIDIpO1xyXG4gICAgICAgIGNvbnN0IHRlc3RkYXRhID0gaGV4dG9iNjR1KGZpcnN0MTI4Yml0cyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXN0ZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZV9jb2RlX3ZlcmlmaWVyKGNvZGVDaGFsbGVuZ2U6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaGFzaCA9IEtKVVIuY3J5cHRvLlV0aWwuaGFzaFN0cmluZyhjb2RlQ2hhbGxlbmdlLCAnc2hhMjU2Jyk7XHJcbiAgICAgICAgY29uc3QgdGVzdGRhdGEgPSBoZXh0b2I2NHUoaGFzaCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXN0ZGF0YTtcclxuICAgIH1cclxufVxyXG4iXX0=