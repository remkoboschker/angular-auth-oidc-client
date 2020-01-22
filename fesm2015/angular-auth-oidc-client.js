import { isPlatformBrowser } from '@angular/common';
import { hextob64u, KEYUTIL, KJUR } from 'jsrsasign-reduced';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, from, Observable, of, ReplaySubject, BehaviorSubject, throwError, timer } from 'rxjs';
import { take, catchError, switchMap, map, filter, race, shareReplay, switchMapTo, tap } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID, NgZone, NgModule, defineInjectable, inject } from '@angular/core';
import { oneLineTrim } from 'common-tags';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AuthorizationResult {
    /**
     * @param {?} authorizationState
     * @param {?} validationResult
     * @param {?=} isRenewProcess
     */
    constructor(authorizationState, validationResult, isRenewProcess = false) {
        this.authorizationState = authorizationState;
        this.validationResult = validationResult;
        this.isRenewProcess = isRenewProcess;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const AuthorizationState = {
    authorized: 'authorized',
    forbidden: 'forbidden',
    unauthorized: 'unauthorized',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JwtKeys {
    constructor() {
        this.keys = [];
    }
}
class JwtKey {
    constructor() {
        this.kty = '';
        this.use = '';
        this.kid = '';
        this.x5t = '';
        this.e = '';
        this.n = '';
        this.x5c = [];
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const ValidationResult = {
    NotSet: 'NotSet',
    StatesDoNotMatch: 'StatesDoNotMatch',
    SignatureFailed: 'SignatureFailed',
    IncorrectNonce: 'IncorrectNonce',
    RequiredPropertyMissing: 'RequiredPropertyMissing',
    MaxOffsetExpired: 'MaxOffsetExpired',
    IssDoesNotMatchIssuer: 'IssDoesNotMatchIssuer',
    NoAuthWellKnownEndPoints: 'NoAuthWellKnownEndPoints',
    IncorrectAud: 'IncorrectAud',
    TokenExpired: 'TokenExpired',
    IncorrectAtHash: 'IncorrectAtHash',
    Ok: 'Ok',
    LoginRequired: 'LoginRequired',
    SecureTokenServerError: 'SecureTokenServerError',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable: variable-name
class ValidateStateResult {
    /**
     * @param {?=} access_token
     * @param {?=} id_token
     * @param {?=} authResponseIsValid
     * @param {?=} decoded_id_token
     * @param {?=} state
     */
    constructor(access_token = '', id_token = '', authResponseIsValid = false, decoded_id_token = {}, state = ValidationResult.NotSet) {
        this.access_token = access_token;
        this.id_token = id_token;
        this.authResponseIsValid = authResponseIsValid;
        this.decoded_id_token = decoded_id_token;
        this.state = state;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OidcDataService {
    /**
     * @param {?} httpClient
     */
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    getWellknownEndpoints(url) {
        /** @type {?} */
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers,
        });
    }
    /**
     * @template T
     * @param {?} url
     * @param {?} token
     * @return {?}
     */
    getIdentityUserData(url, token) {
        /** @type {?} */
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
        return this.httpClient.get(url, {
            headers,
        });
    }
    /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    get(url) {
        /** @type {?} */
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers,
        });
    }
}
OidcDataService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcDataService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PlatformProvider {
    // tslint:disable-next-line: ban-types
    /**
     * @param {?} platformId
     */
    constructor(platformId) {
        this.platformId = platformId;
    }
    /**
     * @return {?}
     */
    get isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
}
PlatformProvider.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
PlatformProvider.ctorParameters = () => [
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
/** @nocollapse */ PlatformProvider.ngInjectableDef = defineInjectable({ factory: function PlatformProvider_Factory() { return new PlatformProvider(inject(PLATFORM_ID)); }, token: PlatformProvider, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ConfigurationProvider {
    /**
     * @param {?} platformProvider
     */
    constructor(platformProvider) {
        this.platformProvider = platformProvider;
        this.DEFAULT_CONFIG = {
            stsServer: 'https://please_set',
            redirect_url: 'https://please_set',
            client_id: 'please_set',
            response_type: 'code',
            scope: 'openid email profile',
            hd_param: '',
            post_logout_redirect_uri: 'https://please_set',
            start_checksession: false,
            silent_renew: false,
            silent_renew_url: 'https://please_set',
            silent_renew_offset_in_seconds: 0,
            use_refresh_token: false,
            ignore_nonce_after_refresh: false,
            post_login_route: '/',
            forbidden_route: '/forbidden',
            unauthorized_route: '/unauthorized',
            auto_userinfo: true,
            auto_clean_state_after_authentication: true,
            trigger_authorization_result_event: false,
            log_console_warning_active: true,
            log_console_debug_active: false,
            iss_validation_off: false,
            history_cleanup_off: false,
            max_id_token_iat_offset_allowed_in_seconds: 3,
            isauthorizedrace_timeout_in_seconds: 5,
            disable_iat_offset_validation: false,
            storage: typeof Storage !== 'undefined' ? sessionStorage : null,
        };
        this.INITIAL_AUTHWELLKNOWN = {
            issuer: '',
            jwks_uri: '',
            authorization_endpoint: '',
            token_endpoint: '',
            userinfo_endpoint: '',
            end_session_endpoint: '',
            check_session_iframe: '',
            revocation_endpoint: '',
            introspection_endpoint: '',
        };
        this.mergedOpenIdConfiguration = this.DEFAULT_CONFIG;
        this.authWellKnownEndpoints = this.INITIAL_AUTHWELLKNOWN;
        this.onConfigurationChangeInternal = new Subject();
    }
    /**
     * @return {?}
     */
    get openIDConfiguration() {
        return this.mergedOpenIdConfiguration;
    }
    /**
     * @return {?}
     */
    get wellKnownEndpoints() {
        return this.authWellKnownEndpoints;
    }
    /**
     * @return {?}
     */
    get onConfigurationChange() {
        return this.onConfigurationChangeInternal.asObservable();
    }
    /**
     * @param {?} passedOpenIfConfiguration
     * @param {?} passedAuthWellKnownEndpoints
     * @return {?}
     */
    setup(passedOpenIfConfiguration, passedAuthWellKnownEndpoints) {
        this.mergedOpenIdConfiguration = Object.assign({}, this.mergedOpenIdConfiguration, passedOpenIfConfiguration);
        this.setSpecialCases(this.mergedOpenIdConfiguration);
        this.authWellKnownEndpoints = Object.assign({}, passedAuthWellKnownEndpoints);
        this.onConfigurationChangeInternal.next(Object.assign({}, this.mergedOpenIdConfiguration));
    }
    /**
     * @private
     * @param {?} currentConfig
     * @return {?}
     */
    setSpecialCases(currentConfig) {
        if (!this.platformProvider.isBrowser) {
            currentConfig.start_checksession = false;
            currentConfig.silent_renew = false;
            currentConfig.use_refresh_token = false;
        }
    }
}
ConfigurationProvider.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
ConfigurationProvider.ctorParameters = () => [
    { type: PlatformProvider }
];
/** @nocollapse */ ConfigurationProvider.ngInjectableDef = defineInjectable({ factory: function ConfigurationProvider_Factory() { return new ConfigurationProvider(inject(PlatformProvider)); }, token: ConfigurationProvider, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LoggerService {
    /**
     * @param {?} configurationProvider
     */
    constructor(configurationProvider) {
        this.configurationProvider = configurationProvider;
    }
    /**
     * @param {?} message
     * @param {...?} args
     * @return {?}
     */
    logError(message, ...args) {
        console.error(message, ...args);
    }
    /**
     * @param {?} message
     * @return {?}
     */
    logWarning(message) {
        if (this.configurationProvider.openIDConfiguration.log_console_warning_active) {
            console.warn(message);
        }
    }
    /**
     * @param {?} message
     * @return {?}
     */
    logDebug(message) {
        if (this.configurationProvider.openIDConfiguration.log_console_debug_active) {
            console.log(message);
        }
    }
}
LoggerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
LoggerService.ctorParameters = () => [
    { type: ConfigurationProvider }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class IFrameService {
    /**
     * @param {?} loggerService
     */
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    getExistingIFrame(identifier) {
        /** @type {?} */
        const iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (this.isIFrameElement(iFrameOnParent)) {
            return iFrameOnParent;
        }
        /** @type {?} */
        const iFrameOnSelf = this.getIFrameFromWindow(identifier);
        if (this.isIFrameElement(iFrameOnSelf)) {
            return iFrameOnSelf;
        }
        return null;
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    addIFrameToWindowBody(identifier) {
        /** @type {?} */
        const sessionIframe = window.document.createElement('iframe');
        sessionIframe.id = identifier;
        this.loggerService.logDebug(sessionIframe);
        sessionIframe.style.display = 'none';
        window.document.body.appendChild(sessionIframe);
        return sessionIframe;
    }
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    getIFrameFromParentWindow(identifier) {
        try {
            /** @type {?} */
            const iFrameElement = window.parent.document.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    getIFrameFromWindow(identifier) {
        /** @type {?} */
        const iFrameElement = window.document.getElementById(identifier);
        if (this.isIFrameElement(iFrameElement)) {
            return iFrameElement;
        }
        return null;
    }
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    isIFrameElement(element) {
        return !!element && element instanceof HTMLIFrameElement;
    }
}
IFrameService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
IFrameService.ctorParameters = () => [
    { type: LoggerService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class EqualityHelperService {
    /**
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    areEqual(value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        if (this.bothValuesAreArrays(value1, value2)) {
            return this.arraysEqual((/** @type {?} */ (value1)), (/** @type {?} */ (value2)));
        }
        if (this.bothValuesAreStrings(value1, value2)) {
            return value1 === value2;
        }
        if (this.bothValuesAreObjects(value1, value2)) {
            return JSON.stringify(value1).toLowerCase() === JSON.stringify(value2).toLowerCase();
        }
        if (this.oneValueIsStringAndTheOtherIsArray(value1, value2)) {
            if (Array.isArray(value1) && this.valueIsString(value2)) {
                return value1[0] === value2;
            }
            if (Array.isArray(value2) && this.valueIsString(value1)) {
                return value2[0] === value1;
            }
        }
    }
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    oneValueIsStringAndTheOtherIsArray(value1, value2) {
        return (Array.isArray(value1) && this.valueIsString(value2)) || (Array.isArray(value2) && this.valueIsString(value1));
    }
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    bothValuesAreObjects(value1, value2) {
        return this.valueIsObject(value1) && this.valueIsObject(value2);
    }
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    bothValuesAreStrings(value1, value2) {
        return this.valueIsString(value1) && this.valueIsString(value2);
    }
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    bothValuesAreArrays(value1, value2) {
        return Array.isArray(value1) && Array.isArray(value2);
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    valueIsString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    valueIsObject(value) {
        return typeof value === 'object';
    }
    /**
     * @private
     * @param {?} arr1
     * @param {?} arr2
     * @return {?}
     */
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
}
EqualityHelperService.decorators = [
    { type: Injectable }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TokenHelperService {
    /**
     * @param {?} loggerService
     */
    constructor(loggerService) {
        this.loggerService = loggerService;
        this.PARTS_OF_TOKEN = 3;
    }
    /**
     * @param {?} dataIdToken
     * @return {?}
     */
    getTokenExpirationDate(dataIdToken) {
        if (!dataIdToken.hasOwnProperty('exp')) {
            return new Date();
        }
        /** @type {?} */
        const date = new Date(0);
        date.setUTCSeconds(dataIdToken.exp);
        return date;
    }
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    getHeaderFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 0, encoded);
    }
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    getPayloadFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 1, encoded);
    }
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    getSignatureFromToken(token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 2, encoded);
    }
    /**
     * @private
     * @param {?} token
     * @param {?} index
     * @param {?} encoded
     * @return {?}
     */
    getPartOfToken(token, index, encoded) {
        /** @type {?} */
        const partOfToken = this.extractPartOfToken(token, index);
        if (encoded) {
            return partOfToken;
        }
        /** @type {?} */
        const result = this.urlBase64Decode(partOfToken);
        return JSON.parse(result);
    }
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    urlBase64Decode(str) {
        /** @type {?} */
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw Error('Illegal base64url string!');
        }
        /** @type {?} */
        const decoded = typeof window !== 'undefined' ? window.atob(output) : new Buffer(output, 'base64').toString('binary');
        try {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(decoded
                .split('')
                .map((/**
             * @param {?} c
             * @return {?}
             */
            (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)))
                .join(''));
        }
        catch (err) {
            return decoded;
        }
    }
    /**
     * @private
     * @param {?} token
     * @return {?}
     */
    tokenIsValid(token) {
        if (!token) {
            this.loggerService.logError(`token '${token}' is not valid --> token falsy`);
            return false;
        }
        if (!((/** @type {?} */ (token))).includes('.')) {
            this.loggerService.logError(`token '${token}' is not valid --> no dots included`);
            return false;
        }
        /** @type {?} */
        const parts = token.split('.');
        if (parts.length !== this.PARTS_OF_TOKEN) {
            this.loggerService.logError(`token '${token}' is not valid --> token has to have exactly ${this.PARTS_OF_TOKEN} dots`);
            return false;
        }
        return true;
    }
    /**
     * @private
     * @param {?} token
     * @param {?} index
     * @return {?}
     */
    extractPartOfToken(token, index) {
        return token.split('.')[index];
    }
}
TokenHelperService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TokenHelperService.ctorParameters = () => [
    { type: LoggerService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Implement this class-interface to create a custom storage.
 * @abstract
 */
class OidcSecurityStorage {
}
OidcSecurityStorage.decorators = [
    { type: Injectable }
];
class BrowserStorage {
    /**
     * @param {?} configProvider
     */
    constructor(configProvider) {
        this.configProvider = configProvider;
        this.hasStorage = typeof Storage !== 'undefined';
    }
    /**
     * @param {?} key
     * @return {?}
     */
    read(key) {
        if (this.hasStorage) {
            return JSON.parse(this.configProvider.openIDConfiguration.storage.getItem(key + '_' + this.configProvider.openIDConfiguration.client_id));
        }
        return;
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    write(key, value) {
        if (this.hasStorage) {
            value = value === undefined ? null : value;
            this.configProvider.openIDConfiguration.storage.setItem(key + '_' + this.configProvider.openIDConfiguration.client_id, JSON.stringify(value));
        }
    }
}
BrowserStorage.decorators = [
    { type: Injectable }
];
/** @nocollapse */
BrowserStorage.ctorParameters = () => [
    { type: ConfigurationProvider }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OidcSecurityCommon {
    /**
     * @param {?} oidcSecurityStorage
     */
    constructor(oidcSecurityStorage) {
        this.oidcSecurityStorage = oidcSecurityStorage;
        this.storageAuthResult = 'authorizationResult';
        this.storageAccessToken = 'authorizationData';
        this.storageIdToken = 'authorizationDataIdToken';
        this.storageIsAuthorized = '_isAuthorized';
        this.storageUserData = 'userData';
        this.storageAuthNonce = 'authNonce';
        this.storageCodeVerifier = 'code_verifier';
        this.storageAuthStateControl = 'authStateControl';
        this.storageSessionState = 'session_state';
        this.storageSilentRenewRunning = 'storage_silent_renew_running';
        this.storageCustomRequestParams = 'storage_custom_request_params';
    }
    /**
     * @return {?}
     */
    get authResult() {
        return this.retrieve(this.storageAuthResult);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authResult(value) {
        this.store(this.storageAuthResult, value);
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.retrieve(this.storageAccessToken) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set accessToken(value) {
        this.store(this.storageAccessToken, value);
    }
    /**
     * @return {?}
     */
    get idToken() {
        return this.retrieve(this.storageIdToken) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set idToken(value) {
        this.store(this.storageIdToken, value);
    }
    /**
     * @return {?}
     */
    get isAuthorized() {
        return this.retrieve(this.storageIsAuthorized);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isAuthorized(value) {
        this.store(this.storageIsAuthorized, value);
    }
    /**
     * @return {?}
     */
    get userData() {
        return this.retrieve(this.storageUserData);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set userData(value) {
        this.store(this.storageUserData, value);
    }
    /**
     * @return {?}
     */
    get authNonce() {
        return this.retrieve(this.storageAuthNonce) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authNonce(value) {
        this.store(this.storageAuthNonce, value);
    }
    /**
     * @return {?}
     */
    get code_verifier() {
        return this.retrieve(this.storageCodeVerifier) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set code_verifier(value) {
        this.store(this.storageCodeVerifier, value);
    }
    /**
     * @return {?}
     */
    get authStateControl() {
        return this.retrieve(this.storageAuthStateControl) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authStateControl(value) {
        this.store(this.storageAuthStateControl, value);
    }
    /**
     * @return {?}
     */
    get sessionState() {
        return this.retrieve(this.storageSessionState);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set sessionState(value) {
        this.store(this.storageSessionState, value);
    }
    /**
     * @return {?}
     */
    get silentRenewRunning() {
        return this.retrieve(this.storageSilentRenewRunning) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set silentRenewRunning(value) {
        this.store(this.storageSilentRenewRunning, value);
    }
    /**
     * @return {?}
     */
    get customRequestParams() {
        return this.retrieve(this.storageCustomRequestParams);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set customRequestParams(value) {
        this.store(this.storageCustomRequestParams, value);
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    retrieve(key) {
        return this.oidcSecurityStorage.read(key);
    }
    /**
     * @private
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    store(key, value) {
        this.oidcSecurityStorage.write(key, value);
    }
    /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    resetStorageData(isRenewProcess) {
        if (!isRenewProcess) {
            this.store(this.storageAuthResult, '');
            this.store(this.storageSessionState, '');
            this.store(this.storageSilentRenewRunning, '');
            this.store(this.storageIsAuthorized, false);
            this.store(this.storageAccessToken, '');
            this.store(this.storageIdToken, '');
            this.store(this.storageUserData, '');
            this.store(this.storageCodeVerifier, '');
        }
    }
    /**
     * @return {?}
     */
    getAccessToken() {
        return this.retrieve(this.storageAccessToken);
    }
    /**
     * @return {?}
     */
    getIdToken() {
        return this.retrieve(this.storageIdToken);
    }
    /**
     * @return {?}
     */
    getRefreshToken() {
        return this.authResult.refresh_token;
    }
}
OidcSecurityCommon.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityCommon.ctorParameters = () => [
    { type: OidcSecurityStorage }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
class OidcSecurityValidation {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class StateValidationService {
    /**
     * @param {?} oidcSecurityCommon
     * @param {?} oidcSecurityValidation
     * @param {?} tokenHelperService
     * @param {?} loggerService
     * @param {?} configurationProvider
     */
    constructor(oidcSecurityCommon, oidcSecurityValidation, tokenHelperService, loggerService, configurationProvider) {
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.oidcSecurityValidation = oidcSecurityValidation;
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
    }
    /**
     * @param {?} result
     * @param {?} jwtKeys
     * @return {?}
     */
    validateState(result, jwtKeys) {
        /** @type {?} */
        const toReturn = new ValidateStateResult();
        if (!this.oidcSecurityValidation.validateStateFromHashCallback(result.state, this.oidcSecurityCommon.authStateControl)) {
            this.loggerService.logWarning('authorizedCallback incorrect state');
            toReturn.state = ValidationResult.StatesDoNotMatch;
            this.handleUnsuccessfulValidation();
            return toReturn;
        }
        if (this.configurationProvider.openIDConfiguration.response_type === 'id_token token' ||
            this.configurationProvider.openIDConfiguration.response_type === 'code') {
            toReturn.access_token = result.access_token;
        }
        if (result.id_token) {
            toReturn.id_token = result.id_token;
            toReturn.decoded_id_token = this.tokenHelperService.getPayloadFromToken(toReturn.id_token, false);
            if (!this.oidcSecurityValidation.validate_signature_id_token(toReturn.id_token, jwtKeys)) {
                this.loggerService.logDebug('authorizedCallback Signature validation failed id_token');
                toReturn.state = ValidationResult.SignatureFailed;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.oidcSecurityValidation.validate_id_token_nonce(toReturn.decoded_id_token, this.oidcSecurityCommon.authNonce, this.configurationProvider.openIDConfiguration.ignore_nonce_after_refresh)) {
                this.loggerService.logWarning('authorizedCallback incorrect nonce');
                toReturn.state = ValidationResult.IncorrectNonce;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.oidcSecurityValidation.validate_required_id_token(toReturn.decoded_id_token)) {
                this.loggerService.logDebug('authorizedCallback Validation, one of the REQUIRED properties missing from id_token');
                toReturn.state = ValidationResult.RequiredPropertyMissing;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.oidcSecurityValidation.validate_id_token_iat_max_offset(toReturn.decoded_id_token, this.configurationProvider.openIDConfiguration.max_id_token_iat_offset_allowed_in_seconds, this.configurationProvider.openIDConfiguration.disable_iat_offset_validation)) {
                this.loggerService.logWarning('authorizedCallback Validation, iat rejected id_token was issued too far away from the current time');
                toReturn.state = ValidationResult.MaxOffsetExpired;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (this.configurationProvider.wellKnownEndpoints) {
                if (this.configurationProvider.openIDConfiguration.iss_validation_off) {
                    this.loggerService.logDebug('iss validation is turned off, this is not recommended!');
                }
                else if (!this.configurationProvider.openIDConfiguration.iss_validation_off &&
                    !this.oidcSecurityValidation.validate_id_token_iss(toReturn.decoded_id_token, this.configurationProvider.wellKnownEndpoints.issuer)) {
                    this.loggerService.logWarning('authorizedCallback incorrect iss does not match authWellKnownEndpoints issuer');
                    toReturn.state = ValidationResult.IssDoesNotMatchIssuer;
                    this.handleUnsuccessfulValidation();
                    return toReturn;
                }
            }
            else {
                this.loggerService.logWarning('authWellKnownEndpoints is undefined');
                toReturn.state = ValidationResult.NoAuthWellKnownEndPoints;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.oidcSecurityValidation.validate_id_token_aud(toReturn.decoded_id_token, this.configurationProvider.openIDConfiguration.client_id)) {
                this.loggerService.logWarning('authorizedCallback incorrect aud');
                toReturn.state = ValidationResult.IncorrectAud;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
            if (!this.oidcSecurityValidation.validate_id_token_exp_not_expired(toReturn.decoded_id_token)) {
                this.loggerService.logWarning('authorizedCallback token expired');
                toReturn.state = ValidationResult.TokenExpired;
                this.handleUnsuccessfulValidation();
                return toReturn;
            }
        }
        else {
            this.loggerService.logDebug('No id_token found, skipping id_token validation');
        }
        // flow id_token token
        if (this.configurationProvider.openIDConfiguration.response_type !== 'id_token token' &&
            this.configurationProvider.openIDConfiguration.response_type !== 'code') {
            toReturn.authResponseIsValid = true;
            toReturn.state = ValidationResult.Ok;
            this.handleSuccessfulValidation();
            this.handleUnsuccessfulValidation();
            return toReturn;
        }
        if (!this.oidcSecurityValidation.validate_id_token_at_hash(toReturn.access_token, toReturn.decoded_id_token.at_hash, this.configurationProvider.openIDConfiguration.response_type === 'code') ||
            !toReturn.access_token) {
            this.loggerService.logWarning('authorizedCallback incorrect at_hash');
            toReturn.state = ValidationResult.IncorrectAtHash;
            this.handleUnsuccessfulValidation();
            return toReturn;
        }
        toReturn.authResponseIsValid = true;
        toReturn.state = ValidationResult.Ok;
        this.handleSuccessfulValidation();
        return toReturn;
    }
    /**
     * @private
     * @return {?}
     */
    handleSuccessfulValidation() {
        this.oidcSecurityCommon.authNonce = '';
        if (this.configurationProvider.openIDConfiguration.auto_clean_state_after_authentication) {
            this.oidcSecurityCommon.authStateControl = '';
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) validated, continue');
    }
    /**
     * @private
     * @return {?}
     */
    handleUnsuccessfulValidation() {
        this.oidcSecurityCommon.authNonce = '';
        if (this.configurationProvider.openIDConfiguration.auto_clean_state_after_authentication) {
            this.oidcSecurityCommon.authStateControl = '';
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) invalid');
    }
}
StateValidationService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StateValidationService.ctorParameters = () => [
    { type: OidcSecurityCommon },
    { type: OidcSecurityValidation },
    { type: TokenHelperService },
    { type: LoggerService },
    { type: ConfigurationProvider }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
class OidcSecurityCheckSession {
    /**
     * @param {?} oidcSecurityCommon
     * @param {?} loggerService
     * @param {?} iFrameService
     * @param {?} zone
     * @param {?} configurationProvider
     */
    constructor(oidcSecurityCommon, loggerService, iFrameService, zone, configurationProvider) {
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.zone = zone;
        this.configurationProvider = configurationProvider;
        this.lastIFrameRefresh = 0;
        this.outstandingMessages = 0;
        this.heartBeatInterval = 3000;
        this.iframeRefreshInterval = 60000;
        this.checkSessionChanged = new Subject();
    }
    /**
     * @return {?}
     */
    get onCheckSessionChanged() {
        return this.checkSessionChanged.asObservable();
    }
    /**
     * @private
     * @return {?}
     */
    doesSessionExist() {
        /** @type {?} */
        const existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        if (!existingIFrame) {
            return false;
        }
        this.sessionIframe = existingIFrame;
        return true;
    }
    /**
     * @private
     * @return {?}
     */
    init() {
        if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
            return from([this]);
        }
        if (!this.doesSessionExist()) {
            this.sessionIframe = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
            this.iframeMessageEvent = this.messageHandler.bind(this);
            window.addEventListener('message', this.iframeMessageEvent, false);
        }
        if (!this.configurationProvider.wellKnownEndpoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined. Returning.');
            return;
        }
        if (this.configurationProvider.wellKnownEndpoints.check_session_iframe) {
            this.sessionIframe.contentWindow.location.replace(this.configurationProvider.wellKnownEndpoints.check_session_iframe);
        }
        else {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
        }
        return Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => {
            this.sessionIframe.onload = (/**
             * @return {?}
             */
            () => {
                this.lastIFrameRefresh = Date.now();
                observer.next(this);
                observer.complete();
            });
        }));
    }
    /**
     * @param {?} clientId
     * @return {?}
     */
    startCheckingSession(clientId) {
        if (this.scheduledHeartBeat) {
            return;
        }
        this.pollServerSession(clientId);
    }
    /**
     * @return {?}
     */
    stopCheckingSession() {
        if (!this.scheduledHeartBeat) {
            return;
        }
        this.clearScheduledHeartBeat();
    }
    /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    pollServerSession(clientId) {
        /** @type {?} */
        const pollServerSessionRecur = (/**
         * @return {?}
         */
        () => {
            this.init()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => {
                if (this.sessionIframe && clientId) {
                    this.loggerService.logDebug(this.sessionIframe);
                    /** @type {?} */
                    const sessionState = this.oidcSecurityCommon.sessionState;
                    if (sessionState) {
                        this.outstandingMessages++;
                        this.sessionIframe.contentWindow.postMessage(clientId + ' ' + sessionState, this.configurationProvider.openIDConfiguration.stsServer);
                    }
                    else {
                        this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        this.checkSessionChanged.next();
                    }
                }
                else {
                    this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession sessionIframe does not exist');
                    this.loggerService.logDebug(clientId);
                    this.loggerService.logDebug(this.sessionIframe);
                    // this.init();
                }
                // after sending three messages with no response, fail.
                if (this.outstandingMessages > 3) {
                    this.loggerService.logError(`OidcSecurityCheckSession not receiving check session response messages.
                            Outstanding messages: ${this.outstandingMessages}. Server unreachable?`);
                    this.checkSessionChanged.next();
                }
                this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, this.heartBeatInterval);
            }));
        });
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, this.heartBeatInterval);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    clearScheduledHeartBeat() {
        clearTimeout(this.scheduledHeartBeat);
        this.scheduledHeartBeat = null;
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    messageHandler(e) {
        this.outstandingMessages = 0;
        if (this.sessionIframe &&
            e.origin === this.configurationProvider.openIDConfiguration.stsServer &&
            e.source === this.sessionIframe.contentWindow) {
            if (e.data === 'error') {
                this.loggerService.logWarning('error from checksession messageHandler');
            }
            else if (e.data === 'changed') {
                this.checkSessionChanged.next();
            }
            else {
                this.loggerService.logDebug(e.data + ' from checksession messageHandler');
            }
        }
    }
}
OidcSecurityCheckSession.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityCheckSession.ctorParameters = () => [
    { type: OidcSecurityCommon },
    { type: LoggerService },
    { type: IFrameService },
    { type: NgZone },
    { type: ConfigurationProvider }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OidcConfigService {
    /**
     * @param {?} loggerService
     * @param {?} httpClient
     */
    constructor(loggerService, httpClient) {
        this.loggerService = loggerService;
        this.httpClient = httpClient;
        this.configurationLoadedInternal = new ReplaySubject(1);
    }
    /**
     * @return {?}
     */
    get onConfigurationLoaded() {
        return this.configurationLoadedInternal.asObservable();
    }
    /**
     * @param {?} configUrl
     * @return {?}
     */
    load(configUrl) {
        return this.httpClient
            .get(configUrl)
            .pipe(switchMap((/**
         * @param {?} clientConfiguration
         * @return {?}
         */
        clientConfiguration => {
            return this.loadUsingConfiguration(clientConfiguration);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            this.loggerService.logError(`OidcConfigService 'load' threw an error on calling ${configUrl}`, error);
            this.configurationLoadedInternal.next(undefined);
            return of(false);
        })))
            .toPromise();
    }
    /**
     * @param {?} stsServer
     * @return {?}
     */
    load_using_stsServer(stsServer) {
        return this.loadUsingConfiguration({ stsServer }).toPromise();
    }
    /**
     * @param {?} url
     * @return {?}
     */
    load_using_custom_stsServer(url) {
        return this.httpClient
            .get(url)
            .pipe(switchMap((/**
         * @param {?} wellKnownEndpoints
         * @return {?}
         */
        wellKnownEndpoints => {
            this.configurationLoadedInternal.next({
                authWellknownEndpoints: wellKnownEndpoints,
                customConfig: { stsServer: url },
            });
            return of(true);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            this.loggerService.logError(`OidcConfigService 'load_using_custom_stsServer' threw an error on calling ${url}`, error);
            this.configurationLoadedInternal.next(undefined);
            return of(false);
        })))
            .toPromise();
    }
    /**
     * @private
     * @param {?} clientConfig
     * @return {?}
     */
    loadUsingConfiguration(clientConfig) {
        if (!clientConfig.stsServer) {
            this.loggerService.logError(`Property 'stsServer' is not present of passed config ${JSON.stringify(clientConfig)}`, clientConfig);
            throw new Error(`Property 'stsServer' is not present of passed config ${JSON.stringify(clientConfig)}`);
        }
        /** @type {?} */
        const url = `${clientConfig.stsServer}/.well-known/openid-configuration`;
        return this.httpClient.get(url).pipe(switchMap((/**
         * @param {?} wellKnownEndpoints
         * @return {?}
         */
        wellKnownEndpoints => {
            this.configurationLoadedInternal.next({
                authWellknownEndpoints: wellKnownEndpoints,
                customConfig: clientConfig,
            });
            return of(true);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            this.loggerService.logError(`OidcConfigService 'load_using_stsServer' threw an error on calling ${url}`, error);
            this.configurationLoadedInternal.next(undefined);
            return of(false);
        })));
    }
}
OidcConfigService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcConfigService.ctorParameters = () => [
    { type: LoggerService },
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
class OidcSecuritySilentRenew {
    /**
     * @param {?} loggerService
     * @param {?} iFrameService
     */
    constructor(loggerService, iFrameService) {
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
    }
    /**
     * @return {?}
     */
    initRenew() {
        /** @type {?} */
        const existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        if (!existingIFrame) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        return existingIFrame;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    startRenew(url) {
        /** @type {?} */
        const sessionIframe = this.initRenew();
        this.loggerService.logDebug('startRenew for URL:' + url);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            /** @type {?} */
            const onLoadHandler = (/**
             * @return {?}
             */
            () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
                observer.next(undefined);
                observer.complete();
            });
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.src = url;
            return (/**
             * @return {?}
             */
            () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
            });
        }));
    }
}
OidcSecuritySilentRenew.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecuritySilentRenew.ctorParameters = () => [
    { type: LoggerService },
    { type: IFrameService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class OidcSecurityUserService {
    /**
     * @param {?} oidcDataService
     * @param {?} oidcSecurityCommon
     * @param {?} loggerService
     * @param {?} configurationProvider
     */
    constructor(oidcDataService, oidcSecurityCommon, loggerService, configurationProvider) {
        this.oidcDataService = oidcDataService;
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.userData = '';
    }
    /**
     * @return {?}
     */
    initUserData() {
        return this.getIdentityUserData().pipe(map((/**
         * @param {?} data
         * @return {?}
         */
        (data) => (this.userData = data))));
    }
    /**
     * @return {?}
     */
    getUserData() {
        if (!this.userData) {
            throw Error('UserData is not set!');
        }
        return this.userData;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setUserData(value) {
        this.userData = value;
    }
    /**
     * @private
     * @return {?}
     */
    getIdentityUserData() {
        /** @type {?} */
        const token = this.oidcSecurityCommon.getAccessToken();
        if (!this.configurationProvider.wellKnownEndpoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
            throw Error('authWellKnownEndpoints is undefined');
        }
        /** @type {?} */
        const canGetUserData = this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.userinfo_endpoint;
        if (!canGetUserData) {
            this.loggerService.logError('init check session: authWellKnownEndpoints.userinfo_endpoint is undefined; set auto_userinfo = false in config');
            throw Error('authWellKnownEndpoints.userinfo_endpoint is undefined');
        }
        return this.oidcDataService.getIdentityUserData(this.configurationProvider.wellKnownEndpoints.userinfo_endpoint || '', token);
    }
}
OidcSecurityUserService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityUserService.ctorParameters = () => [
    { type: OidcDataService },
    { type: OidcSecurityCommon },
    { type: LoggerService },
    { type: ConfigurationProvider }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UriEncoder {
    /**
     * @param {?} key
     * @return {?}
     */
    encodeKey(key) {
        return encodeURIComponent(key);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    encodeValue(value) {
        return encodeURIComponent(value);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    decodeKey(key) {
        return decodeURIComponent(key);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    decodeValue(value) {
        return decodeURIComponent(value);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UrlParserService {
    /**
     * @param {?} urlToCheck
     * @param {?} name
     * @return {?}
     */
    getUrlParameter(urlToCheck, name) {
        if (!urlToCheck) {
            return '';
        }
        if (!name) {
            return '';
        }
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        /** @type {?} */
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        /** @type {?} */
        const results = regex.exec(urlToCheck);
        return results === null ? '' : decodeURIComponent(results[1]);
    }
}
UrlParserService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ UrlParserService.ngInjectableDef = defineInjectable({ factory: function UrlParserService_Factory() { return new UrlParserService(); }, token: UrlParserService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable: variable-name
class OidcSecurityService {
    /**
     * @param {?} oidcDataService
     * @param {?} stateValidationService
     * @param {?} router
     * @param {?} oidcSecurityCheckSession
     * @param {?} oidcSecuritySilentRenew
     * @param {?} oidcSecurityUserService
     * @param {?} oidcSecurityCommon
     * @param {?} oidcSecurityValidation
     * @param {?} tokenHelperService
     * @param {?} loggerService
     * @param {?} zone
     * @param {?} httpClient
     * @param {?} configurationProvider
     * @param {?} urlParserService
     */
    constructor(oidcDataService, stateValidationService, router, oidcSecurityCheckSession, oidcSecuritySilentRenew, oidcSecurityUserService, oidcSecurityCommon, oidcSecurityValidation, tokenHelperService, loggerService, zone, httpClient, configurationProvider, urlParserService) {
        this.oidcDataService = oidcDataService;
        this.stateValidationService = stateValidationService;
        this.router = router;
        this.oidcSecurityCheckSession = oidcSecurityCheckSession;
        this.oidcSecuritySilentRenew = oidcSecuritySilentRenew;
        this.oidcSecurityUserService = oidcSecurityUserService;
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.oidcSecurityValidation = oidcSecurityValidation;
        this.tokenHelperService = tokenHelperService;
        this.loggerService = loggerService;
        this.zone = zone;
        this.httpClient = httpClient;
        this.configurationProvider = configurationProvider;
        this.urlParserService = urlParserService;
        this._onModuleSetup = new Subject();
        this._onCheckSessionChanged = new Subject();
        this._onAuthorizationResult = new Subject();
        this.checkSessionChanged = false;
        this.moduleSetup = false;
        this._isModuleSetup = new BehaviorSubject(false);
        this._isAuthorized = new BehaviorSubject(false);
        this._userData = new BehaviorSubject('');
        this.authWellKnownEndpointsLoaded = false;
        this.runTokenValidationRunning = false;
        this.onModuleSetup.pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => {
            this.moduleSetup = true;
            this._isModuleSetup.next(true);
        }));
        this._isSetupAndAuthorized = this._isModuleSetup.pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        (isModuleSetup) => isModuleSetup)), switchMap((/**
         * @return {?}
         */
        () => {
            if (!this.configurationProvider.openIDConfiguration.silent_renew) {
                this.loggerService.logDebug(`IsAuthorizedRace: Silent Renew Not Active. Emitting.`);
                return from([true]);
            }
            /** @type {?} */
            const race$ = this._isAuthorized.asObservable().pipe(filter((/**
             * @param {?} isAuthorized
             * @return {?}
             */
            (isAuthorized) => isAuthorized)), take(1), tap((/**
             * @return {?}
             */
            () => this.loggerService.logDebug('IsAuthorizedRace: Existing token is still authorized.'))), 
            // tslint:disable-next-line: deprecation
            race(this._onAuthorizationResult.pipe(take(1), tap((/**
             * @return {?}
             */
            () => this.loggerService.logDebug('IsAuthorizedRace: Silent Renew Refresh Session Complete'))), map((/**
             * @return {?}
             */
            () => true))), timer(this.configurationProvider.openIDConfiguration.isauthorizedrace_timeout_in_seconds * 1000).pipe(
            // backup, if nothing happens after X seconds stop waiting and emit (5s Default)
            tap((/**
             * @return {?}
             */
            () => {
                this.resetAuthorizationData(false);
                this.oidcSecurityCommon.authNonce = '';
                this.loggerService.logWarning('IsAuthorizedRace: Timeout reached. Emitting.');
            })), map((/**
             * @return {?}
             */
            () => true)))));
            this.loggerService.logDebug('Silent Renew is active, check if token in storage is active');
            if (this.oidcSecurityCommon.authNonce === '' || this.oidcSecurityCommon.authNonce === undefined) {
                // login not running, or a second silent renew, user must login first before this will work.
                this.loggerService.logDebug('Silent Renew or login not running, try to refresh the session');
                this.refreshSession().subscribe();
            }
            return race$;
        })), tap((/**
         * @return {?}
         */
        () => this.loggerService.logDebug('IsAuthorizedRace: Completed'))), switchMapTo(this._isAuthorized.asObservable()), tap((/**
         * @param {?} isAuthorized
         * @return {?}
         */
        (isAuthorized) => this.loggerService.logDebug(`getIsAuthorized: ${isAuthorized}`))), shareReplay(1));
        this._isSetupAndAuthorized
            .pipe(filter((/**
         * @return {?}
         */
        () => this.configurationProvider.openIDConfiguration.start_checksession)))
            .subscribe((/**
         * @param {?} isSetupAndAuthorized
         * @return {?}
         */
        isSetupAndAuthorized => {
            if (isSetupAndAuthorized) {
                this.oidcSecurityCheckSession.startCheckingSession(this.configurationProvider.openIDConfiguration.client_id);
            }
            else {
                this.oidcSecurityCheckSession.stopCheckingSession();
            }
        }));
    }
    /**
     * @return {?}
     */
    get onModuleSetup() {
        return this._onModuleSetup.asObservable();
    }
    /**
     * @return {?}
     */
    get onAuthorizationResult() {
        return this._onAuthorizationResult.asObservable();
    }
    /**
     * @return {?}
     */
    get onCheckSessionChanged() {
        return this._onCheckSessionChanged.asObservable();
    }
    /**
     * @return {?}
     */
    get onConfigurationChange() {
        return this.configurationProvider.onConfigurationChange;
    }
    /**
     * @param {?} openIdConfiguration
     * @param {?} authWellKnownEndpoints
     * @return {?}
     */
    setupModule(openIdConfiguration, authWellKnownEndpoints) {
        this.configurationProvider.setup(openIdConfiguration, authWellKnownEndpoints);
        this.oidcSecurityCheckSession.onCheckSessionChanged.subscribe((/**
         * @return {?}
         */
        () => {
            this.loggerService.logDebug('onCheckSessionChanged');
            this.checkSessionChanged = true;
            this._onCheckSessionChanged.next(this.checkSessionChanged);
        }));
        /** @type {?} */
        const userData = this.oidcSecurityCommon.userData;
        if (userData) {
            this.setUserData(userData);
        }
        /** @type {?} */
        const isAuthorized = this.oidcSecurityCommon.isAuthorized;
        if (isAuthorized) {
            this.loggerService.logDebug('IsAuthorized setup module');
            this.loggerService.logDebug(this.oidcSecurityCommon.idToken);
            if (this.oidcSecurityValidation.isTokenExpired(this.oidcSecurityCommon.idToken || this.oidcSecurityCommon.accessToken, this.configurationProvider.openIDConfiguration.silent_renew_offset_in_seconds)) {
                this.loggerService.logDebug('IsAuthorized setup module; id_token isTokenExpired');
            }
            else {
                this.loggerService.logDebug('IsAuthorized setup module; id_token is valid');
                this.setIsAuthorized(isAuthorized);
            }
            this.runTokenValidation();
        }
        this.loggerService.logDebug('STS server: ' + this.configurationProvider.openIDConfiguration.stsServer);
        this._onModuleSetup.next();
        if (this.configurationProvider.openIDConfiguration.silent_renew) {
            this.oidcSecuritySilentRenew.initRenew();
            // Support authorization via DOM events.
            // Deregister if OidcSecurityService.setupModule is called again by any instance.
            //      We only ever want the latest setup service to be reacting to this event.
            this.boundSilentRenewEvent = this.silentRenewEventHandler.bind(this);
            /** @type {?} */
            const instanceId = Math.random();
            /** @type {?} */
            const boundSilentRenewInitEvent = ((/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                if (e.detail !== instanceId) {
                    window.removeEventListener('oidc-silent-renew-message', this.boundSilentRenewEvent);
                    window.removeEventListener('oidc-silent-renew-init', boundSilentRenewInitEvent);
                }
            })).bind(this);
            window.addEventListener('oidc-silent-renew-init', boundSilentRenewInitEvent, false);
            window.addEventListener('oidc-silent-renew-message', this.boundSilentRenewEvent, false);
            window.dispatchEvent(new CustomEvent('oidc-silent-renew-init', {
                detail: instanceId,
            }));
        }
    }
    /**
     * @template T
     * @return {?}
     */
    getUserData() {
        return this._userData.asObservable();
    }
    /**
     * @return {?}
     */
    getIsModuleSetup() {
        return this._isModuleSetup.asObservable();
    }
    /**
     * @return {?}
     */
    getIsAuthorized() {
        return this._isSetupAndAuthorized;
    }
    /**
     * @return {?}
     */
    getToken() {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        const token = this.oidcSecurityCommon.getAccessToken();
        return decodeURIComponent(token);
    }
    /**
     * @return {?}
     */
    getIdToken() {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        const token = this.oidcSecurityCommon.getIdToken();
        return decodeURIComponent(token);
    }
    /**
     * @return {?}
     */
    getRefreshToken() {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        const token = this.oidcSecurityCommon.getRefreshToken();
        return decodeURIComponent(token);
    }
    /**
     * @param {?=} encode
     * @return {?}
     */
    getPayloadFromIdToken(encode = false) {
        /** @type {?} */
        const token = this.getIdToken();
        return this.tokenHelperService.getPayloadFromToken(token, encode);
    }
    /**
     * @param {?} state
     * @return {?}
     */
    setState(state) {
        this.oidcSecurityCommon.authStateControl = state;
    }
    /**
     * @return {?}
     */
    getState() {
        return this.oidcSecurityCommon.authStateControl;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    setCustomRequestParameters(params) {
        this.oidcSecurityCommon.customRequestParams = params;
    }
    // Code Flow with PCKE or Implicit Flow
    /**
     * @param {?=} urlHandler
     * @return {?}
     */
    authorize(urlHandler) {
        if (this.configurationProvider.wellKnownEndpoints) {
            this.authWellKnownEndpointsLoaded = true;
        }
        if (!this.authWellKnownEndpointsLoaded) {
            this.loggerService.logError('Well known endpoints must be loaded before user can login!');
            return;
        }
        if (!this.oidcSecurityValidation.config_validate_response_type(this.configurationProvider.openIDConfiguration.response_type)) {
            // invalid response_type
            return;
        }
        this.resetAuthorizationData(false);
        this.loggerService.logDebug('BEGIN Authorize Code Flow, no auth data');
        /** @type {?} */
        let state = this.oidcSecurityCommon.authStateControl;
        if (!state) {
            state = Date.now() + '' + Math.random() + Math.random();
            this.oidcSecurityCommon.authStateControl = state;
        }
        /** @type {?} */
        const nonce = 'N' + Math.random() + '' + Date.now();
        this.oidcSecurityCommon.authNonce = nonce;
        this.loggerService.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.authStateControl);
        /** @type {?} */
        let url = '';
        // Code Flow
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            // code_challenge with "S256"
            /** @type {?} */
            const code_verifier = 'C' + Math.random() + '' + Date.now() + '' + Date.now() + Math.random();
            /** @type {?} */
            const code_challenge = this.oidcSecurityValidation.generate_code_verifier(code_verifier);
            this.oidcSecurityCommon.code_verifier = code_verifier;
            if (this.configurationProvider.wellKnownEndpoints) {
                url = this.createAuthorizeUrl(true, code_challenge, this.configurationProvider.openIDConfiguration.redirect_url, nonce, state, this.configurationProvider.wellKnownEndpoints.authorization_endpoint || '');
            }
            else {
                this.loggerService.logError('authWellKnownEndpoints is undefined');
            }
        }
        else {
            // Implicit Flow
            if (this.configurationProvider.wellKnownEndpoints) {
                url = this.createAuthorizeUrl(false, '', this.configurationProvider.openIDConfiguration.redirect_url, nonce, state, this.configurationProvider.wellKnownEndpoints.authorization_endpoint || '');
            }
            else {
                this.loggerService.logError('authWellKnownEndpoints is undefined');
            }
        }
        if (urlHandler) {
            urlHandler(url);
        }
        else {
            this.redirectTo(url);
        }
    }
    // Code Flow
    /**
     * @param {?} urlToCheck
     * @return {?}
     */
    authorizedCallbackWithCode(urlToCheck) {
        this.authorizedCallbackWithCode$(urlToCheck).subscribe();
    }
    /**
     * @param {?} urlToCheck
     * @return {?}
     */
    authorizedCallbackWithCode$(urlToCheck) {
        /** @type {?} */
        const code = this.urlParserService.getUrlParameter(urlToCheck, 'code');
        /** @type {?} */
        const state = this.urlParserService.getUrlParameter(urlToCheck, 'state');
        /** @type {?} */
        const sessionState = this.urlParserService.getUrlParameter(urlToCheck, 'session_state') || null;
        if (!state) {
            this.loggerService.logDebug('no state in url');
            return of();
        }
        if (!code) {
            this.loggerService.logDebug('no code in url');
            return of();
        }
        this.loggerService.logDebug('running validation for callback' + urlToCheck);
        return this.requestTokensWithCode$(code, state, sessionState);
    }
    // Code Flow
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    requestTokensWithCode(code, state, sessionState) {
        this.requestTokensWithCode$(code, state, sessionState).subscribe();
    }
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    requestTokensWithCode$(code, state, sessionState) {
        return this._isModuleSetup.pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        isModuleSetup => !!isModuleSetup)), take(1), switchMap((/**
         * @return {?}
         */
        () => {
            return this.requestTokensWithCodeProcedure$(code, state, sessionState);
        })));
    }
    // Refresh Token
    /**
     * @param {?} code
     * @param {?} state
     * @return {?}
     */
    refreshTokensWithCodeProcedure(code, state) {
        /** @type {?} */
        let tokenRequestUrl = '';
        if (this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.token_endpoint) {
            tokenRequestUrl = `${this.configurationProvider.wellKnownEndpoints.token_endpoint}`;
        }
        /** @type {?} */
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        /** @type {?} */
        const data = `grant_type=refresh_token&client_id=${this.configurationProvider.openIDConfiguration.client_id}&refresh_token=${code}`;
        return this.httpClient.post(tokenRequestUrl, data, { headers }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        response => {
            this.loggerService.logDebug('token refresh response: ' + JSON.stringify(response));
            /** @type {?} */
            let obj = new Object();
            obj = response;
            obj.state = state;
            this.authorizedCodeFlowCallbackProcedure(obj);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            this.loggerService.logError(error);
            this.loggerService.logError(`OidcService code request ${this.configurationProvider.openIDConfiguration.stsServer}`);
            return of(false);
        })));
    }
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    requestTokensWithCodeProcedure(code, state, session_state) {
        this.requestTokensWithCodeProcedure$(code, state, session_state).subscribe();
    }
    // Code Flow with PCKE
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    requestTokensWithCodeProcedure$(code, state, session_state) {
        /** @type {?} */
        let tokenRequestUrl = '';
        if (this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.token_endpoint) {
            tokenRequestUrl = `${this.configurationProvider.wellKnownEndpoints.token_endpoint}`;
        }
        if (!this.oidcSecurityValidation.validateStateFromHashCallback(state, this.oidcSecurityCommon.authStateControl)) {
            this.loggerService.logWarning('authorizedCallback incorrect state');
            // ValidationResult.StatesDoNotMatch;
            return throwError(new Error('incorrect state'));
        }
        /** @type {?} */
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        /** @type {?} */
        let data = oneLineTrim `grant_type=authorization_code&client_id=${this.configurationProvider.openIDConfiguration.client_id}
            &code_verifier=${this.oidcSecurityCommon.code_verifier}
            &code=${code}&redirect_uri=${this.configurationProvider.openIDConfiguration.redirect_url}`;
        if (this.oidcSecurityCommon.silentRenewRunning === 'running') {
            data = oneLineTrim `grant_type=authorization_code&client_id=${this.configurationProvider.openIDConfiguration.client_id}
                &code_verifier=${this.oidcSecurityCommon.code_verifier}
                &code=${code}
                &redirect_uri=${this.configurationProvider.openIDConfiguration.silent_renew_url}`;
        }
        return this.httpClient.post(tokenRequestUrl, data, { headers }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        response => {
            /** @type {?} */
            let obj = new Object();
            obj = response;
            obj.state = state;
            obj.session_state = session_state;
            this.authorizedCodeFlowCallbackProcedure(obj);
            return undefined;
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        error => {
            this.loggerService.logError(error);
            this.loggerService.logError(`OidcService code request ${this.configurationProvider.openIDConfiguration.stsServer}`);
            return throwError(error);
        })));
    }
    // Code Flow
    /**
     * @private
     * @param {?} result
     * @return {?}
     */
    authorizedCodeFlowCallbackProcedure(result) {
        /** @type {?} */
        const silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        const isRenewProcess = silentRenew === 'running';
        this.loggerService.logDebug('BEGIN authorized Code Flow Callback, no auth data');
        this.resetAuthorizationData(isRenewProcess);
        this.authorizedCallbackProcedure(result, isRenewProcess);
    }
    // Implicit Flow
    /**
     * @private
     * @param {?=} hash
     * @return {?}
     */
    authorizedImplicitFlowCallbackProcedure(hash) {
        /** @type {?} */
        const silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        const isRenewProcess = silentRenew === 'running';
        this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
        this.resetAuthorizationData(isRenewProcess);
        hash = hash || window.location.hash.substr(1);
        /** @type {?} */
        const result = hash.split('&').reduce((/**
         * @param {?} resultData
         * @param {?} item
         * @return {?}
         */
        (resultData, item) => {
            /** @type {?} */
            const parts = item.split('=');
            resultData[(/** @type {?} */ (parts.shift()))] = parts.join('=');
            return resultData;
        }), {});
        this.authorizedCallbackProcedure(result, isRenewProcess);
    }
    // Implicit Flow
    /**
     * @param {?=} hash
     * @return {?}
     */
    authorizedImplicitFlowCallback(hash) {
        this._isModuleSetup
            .pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        (isModuleSetup) => isModuleSetup)), take(1))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this.authorizedImplicitFlowCallbackProcedure(hash);
        }));
    }
    /**
     * @private
     * @param {?} url
     * @return {?}
     */
    redirectTo(url) {
        window.location.href = url;
    }
    // Implicit Flow
    /**
     * @private
     * @param {?} result
     * @param {?} isRenewProcess
     * @return {?}
     */
    authorizedCallbackProcedure(result, isRenewProcess) {
        this.oidcSecurityCommon.authResult = result;
        if (!this.configurationProvider.openIDConfiguration.history_cleanup_off && !isRenewProcess) {
            // reset the history to remove the tokens
            window.history.replaceState({}, window.document.title, window.location.origin + window.location.pathname);
        }
        else {
            this.loggerService.logDebug('history clean up inactive');
        }
        if (result.error) {
            if (isRenewProcess) {
                this.loggerService.logDebug(result);
            }
            else {
                this.loggerService.logWarning(result);
            }
            if (((/** @type {?} */ (result.error))) === 'login_required') {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.LoginRequired, isRenewProcess));
            }
            else {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.SecureTokenServerError, isRenewProcess));
            }
            this.resetAuthorizationData(false);
            this.oidcSecurityCommon.authNonce = '';
            if (!this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                this.router.navigate([this.configurationProvider.openIDConfiguration.unauthorized_route]);
            }
        }
        else {
            this.loggerService.logDebug(result);
            this.loggerService.logDebug('authorizedCallback created, begin token validation');
            this.getSigningKeys().subscribe((/**
             * @param {?} jwtKeys
             * @return {?}
             */
            jwtKeys => {
                /** @type {?} */
                const validationResult = this.getValidatedStateResult(result, jwtKeys);
                if (validationResult.authResponseIsValid) {
                    this.setAuthorizationData(validationResult.access_token, validationResult.id_token);
                    this.oidcSecurityCommon.silentRenewRunning = '';
                    if (this.configurationProvider.openIDConfiguration.auto_userinfo) {
                        this.getUserinfo(isRenewProcess, result, validationResult.id_token, validationResult.decoded_id_token).subscribe((/**
                         * @param {?} response
                         * @return {?}
                         */
                        response => {
                            if (response) {
                                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.authorized, validationResult.state, isRenewProcess));
                                if (!this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                                    this.router.navigate([this.configurationProvider.openIDConfiguration.post_login_route]);
                                }
                            }
                            else {
                                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, validationResult.state, isRenewProcess));
                                if (!this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                                    this.router.navigate([this.configurationProvider.openIDConfiguration.unauthorized_route]);
                                }
                            }
                        }), (/**
                         * @param {?} err
                         * @return {?}
                         */
                        err => {
                            /* Something went wrong while getting signing key */
                            this.loggerService.logWarning('Failed to retreive user info with error: ' + JSON.stringify(err));
                        }));
                    }
                    else {
                        if (!isRenewProcess) {
                            // userData is set to the id_token decoded, auto get user data set to false
                            this.oidcSecurityUserService.setUserData(validationResult.decoded_id_token);
                            this.setUserData(this.oidcSecurityUserService.getUserData());
                        }
                        this.runTokenValidation();
                        this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.authorized, validationResult.state, isRenewProcess));
                        if (!this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                            this.router.navigate([this.configurationProvider.openIDConfiguration.post_login_route]);
                        }
                    }
                }
                else {
                    // something went wrong
                    this.loggerService.logWarning('authorizedCallback, token(s) validation failed, resetting');
                    this.loggerService.logWarning(window.location.hash);
                    this.resetAuthorizationData(false);
                    this.oidcSecurityCommon.silentRenewRunning = '';
                    this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, validationResult.state, isRenewProcess));
                    if (!this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                        this.router.navigate([this.configurationProvider.openIDConfiguration.unauthorized_route]);
                    }
                }
            }), (/**
             * @param {?} err
             * @return {?}
             */
            err => {
                /* Something went wrong while getting signing key */
                this.loggerService.logWarning('Failed to retreive siging key with error: ' + JSON.stringify(err));
                this.oidcSecurityCommon.silentRenewRunning = '';
            }));
        }
    }
    /**
     * @param {?=} isRenewProcess
     * @param {?=} result
     * @param {?=} id_token
     * @param {?=} decoded_id_token
     * @return {?}
     */
    getUserinfo(isRenewProcess = false, result, id_token, decoded_id_token) {
        result = result ? result : this.oidcSecurityCommon.authResult;
        id_token = id_token ? id_token : this.oidcSecurityCommon.idToken;
        decoded_id_token = decoded_id_token ? decoded_id_token : this.tokenHelperService.getPayloadFromToken(id_token, false);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            // flow id_token token
            if (this.configurationProvider.openIDConfiguration.response_type === 'id_token token' ||
                this.configurationProvider.openIDConfiguration.response_type === 'code') {
                if (isRenewProcess && this._userData.value) {
                    this.oidcSecurityCommon.sessionState = result.session_state;
                    observer.next(true);
                    observer.complete();
                }
                else {
                    this.oidcSecurityUserService.initUserData().subscribe((/**
                     * @return {?}
                     */
                    () => {
                        this.loggerService.logDebug('authorizedCallback (id_token token || code) flow');
                        /** @type {?} */
                        const userData = this.oidcSecurityUserService.getUserData();
                        if (this.oidcSecurityValidation.validate_userdata_sub_id_token(decoded_id_token.sub, userData.sub)) {
                            this.setUserData(userData);
                            this.loggerService.logDebug(this.oidcSecurityCommon.accessToken);
                            this.loggerService.logDebug(this.oidcSecurityUserService.getUserData());
                            this.oidcSecurityCommon.sessionState = result.session_state;
                            this.runTokenValidation();
                            observer.next(true);
                        }
                        else {
                            // something went wrong, userdata sub does not match that from id_token
                            this.loggerService.logWarning('authorizedCallback, User data sub does not match sub in id_token');
                            this.loggerService.logDebug('authorizedCallback, token(s) validation failed, resetting');
                            this.resetAuthorizationData(false);
                            observer.next(false);
                        }
                        observer.complete();
                    }));
                }
            }
            else {
                // flow id_token
                this.loggerService.logDebug('authorizedCallback id_token flow');
                this.loggerService.logDebug(this.oidcSecurityCommon.accessToken);
                // userData is set to the id_token decoded. No access_token.
                this.oidcSecurityUserService.setUserData(decoded_id_token);
                this.setUserData(this.oidcSecurityUserService.getUserData());
                this.oidcSecurityCommon.sessionState = result.session_state;
                this.runTokenValidation();
                observer.next(true);
                observer.complete();
            }
        }));
    }
    /**
     * @param {?=} urlHandler
     * @return {?}
     */
    logoff(urlHandler) {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        this.loggerService.logDebug('BEGIN Authorize, no auth data');
        if (this.configurationProvider.wellKnownEndpoints) {
            if (this.configurationProvider.wellKnownEndpoints.end_session_endpoint) {
                /** @type {?} */
                const end_session_endpoint = this.configurationProvider.wellKnownEndpoints.end_session_endpoint;
                /** @type {?} */
                const id_token_hint = this.oidcSecurityCommon.idToken;
                /** @type {?} */
                const url = this.createEndSessionUrl(end_session_endpoint, id_token_hint);
                this.resetAuthorizationData(false);
                if (this.configurationProvider.openIDConfiguration.start_checksession && this.checkSessionChanged) {
                    this.loggerService.logDebug('only local login cleaned up, server session has changed');
                }
                else if (urlHandler) {
                    urlHandler(url);
                }
                else {
                    this.redirectTo(url);
                }
            }
            else {
                this.resetAuthorizationData(false);
                this.loggerService.logDebug('only local login cleaned up, no end_session_endpoint');
            }
        }
        else {
            this.loggerService.logWarning('authWellKnownEndpoints is undefined');
        }
    }
    /**
     * @return {?}
     */
    refreshSession() {
        if (!this.configurationProvider.openIDConfiguration.silent_renew) {
            return of(false);
        }
        this.loggerService.logDebug('BEGIN refresh session Authorize');
        this.oidcSecurityCommon.silentRenewRunning = 'running';
        /** @type {?} */
        let state = this.oidcSecurityCommon.authStateControl;
        if (state === '' || state === null) {
            state = Date.now() + '' + Math.random() + Math.random();
            this.oidcSecurityCommon.authStateControl = state;
        }
        /** @type {?} */
        const nonce = 'N' + Math.random() + '' + Date.now();
        this.oidcSecurityCommon.authNonce = nonce;
        this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + this.oidcSecurityCommon.authStateControl);
        /** @type {?} */
        let url = '';
        // Code Flow
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            if (this.configurationProvider.openIDConfiguration.use_refresh_token) {
                // try using refresh token
                /** @type {?} */
                const refresh_token = this.oidcSecurityCommon.getRefreshToken();
                if (refresh_token) {
                    this.loggerService.logDebug('found refresh code, obtaining new credentials with refresh code');
                    // Nonce is not used with refresh tokens; but Keycloak may send it anyway
                    this.oidcSecurityCommon.authNonce = OidcSecurityValidation.RefreshTokenNoncePlaceholder;
                    return this.refreshTokensWithCodeProcedure(refresh_token, state);
                }
                else {
                    this.loggerService.logDebug('no refresh token found, using silent renew');
                }
            }
            // code_challenge with "S256"
            /** @type {?} */
            const code_verifier = 'C' + Math.random() + '' + Date.now() + '' + Date.now() + Math.random();
            /** @type {?} */
            const code_challenge = this.oidcSecurityValidation.generate_code_verifier(code_verifier);
            this.oidcSecurityCommon.code_verifier = code_verifier;
            if (this.configurationProvider.wellKnownEndpoints) {
                url = this.createAuthorizeUrl(true, code_challenge, this.configurationProvider.openIDConfiguration.silent_renew_url, nonce, state, this.configurationProvider.wellKnownEndpoints.authorization_endpoint || '', 'none');
            }
            else {
                this.loggerService.logWarning('authWellKnownEndpoints is undefined');
            }
        }
        else {
            if (this.configurationProvider.wellKnownEndpoints) {
                url = this.createAuthorizeUrl(false, '', this.configurationProvider.openIDConfiguration.silent_renew_url, nonce, state, this.configurationProvider.wellKnownEndpoints.authorization_endpoint || '', 'none');
            }
            else {
                this.loggerService.logWarning('authWellKnownEndpoints is undefined');
            }
        }
        return this.oidcSecuritySilentRenew.startRenew(url).pipe(map((/**
         * @return {?}
         */
        () => true)));
    }
    /**
     * @param {?} error
     * @return {?}
     */
    handleError(error) {
        /** @type {?} */
        const silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        const isRenewProcess = silentRenew === 'running';
        this.loggerService.logError(error);
        if (error.status === 403 || error.status === '403') {
            if (this.configurationProvider.openIDConfiguration.trigger_authorization_result_event) {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.NotSet, isRenewProcess));
            }
            else {
                this.router.navigate([this.configurationProvider.openIDConfiguration.forbidden_route]);
            }
        }
        else if (error.status === 401 || error.status === '401') {
            /** @type {?} */
            const silentRenewRunning = this.oidcSecurityCommon.silentRenewRunning;
            this.resetAuthorizationData(!!silentRenewRunning);
            if (this.configurationProvider.openIDConfiguration.trigger_authorization_result_event) {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.NotSet, isRenewProcess));
            }
            else {
                this.router.navigate([this.configurationProvider.openIDConfiguration.unauthorized_route]);
            }
        }
    }
    /**
     * @return {?}
     */
    startCheckingSilentRenew() {
        this.runTokenValidation();
    }
    /**
     * @return {?}
     */
    stopCheckingSilentRenew() {
        if (this._scheduledHeartBeat) {
            clearTimeout(this._scheduledHeartBeat);
            this._scheduledHeartBeat = null;
            this.runTokenValidationRunning = false;
        }
    }
    /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    resetAuthorizationData(isRenewProcess) {
        if (!isRenewProcess) {
            if (this.configurationProvider.openIDConfiguration.auto_userinfo) {
                // Clear user data. Fixes #97.
                this.setUserData('');
            }
            this.oidcSecurityCommon.resetStorageData(isRenewProcess);
            this.checkSessionChanged = false;
            this.setIsAuthorized(false);
        }
    }
    /**
     * @return {?}
     */
    getEndSessionUrl() {
        if (this.configurationProvider.wellKnownEndpoints) {
            if (this.configurationProvider.wellKnownEndpoints.end_session_endpoint) {
                /** @type {?} */
                const end_session_endpoint = this.configurationProvider.wellKnownEndpoints.end_session_endpoint;
                /** @type {?} */
                const id_token_hint = this.oidcSecurityCommon.idToken;
                return this.createEndSessionUrl(end_session_endpoint, id_token_hint);
            }
        }
    }
    /**
     * @private
     * @param {?} result
     * @param {?} jwtKeys
     * @return {?}
     */
    getValidatedStateResult(result, jwtKeys) {
        if (result.error) {
            return new ValidateStateResult('', '', false, {});
        }
        return this.stateValidationService.validateState(result, jwtKeys);
    }
    /**
     * @private
     * @param {?} userData
     * @return {?}
     */
    setUserData(userData) {
        this.oidcSecurityCommon.userData = userData;
        this._userData.next(userData);
    }
    /**
     * @private
     * @param {?} isAuthorized
     * @return {?}
     */
    setIsAuthorized(isAuthorized) {
        this._isAuthorized.next(isAuthorized);
    }
    /**
     * @private
     * @param {?} access_token
     * @param {?} id_token
     * @return {?}
     */
    setAuthorizationData(access_token, id_token) {
        if (this.oidcSecurityCommon.accessToken !== '') {
            this.oidcSecurityCommon.accessToken = '';
        }
        this.loggerService.logDebug(access_token);
        this.loggerService.logDebug(id_token);
        this.loggerService.logDebug('storing to storage, getting the roles');
        this.oidcSecurityCommon.accessToken = access_token;
        this.oidcSecurityCommon.idToken = id_token;
        this.setIsAuthorized(true);
        this.oidcSecurityCommon.isAuthorized = true;
    }
    /**
     * @private
     * @param {?} isCodeFlow
     * @param {?} code_challenge
     * @param {?} redirect_url
     * @param {?} nonce
     * @param {?} state
     * @param {?} authorization_endpoint
     * @param {?=} prompt
     * @return {?}
     */
    createAuthorizeUrl(isCodeFlow, code_challenge, redirect_url, nonce, state, authorization_endpoint, prompt) {
        /** @type {?} */
        const urlParts = authorization_endpoint.split('?');
        /** @type {?} */
        const authorizationUrl = urlParts[0];
        /** @type {?} */
        let params = new HttpParams({
            fromString: urlParts[1],
            encoder: new UriEncoder(),
        });
        params = params.set('client_id', this.configurationProvider.openIDConfiguration.client_id);
        params = params.append('redirect_uri', redirect_url);
        params = params.append('response_type', this.configurationProvider.openIDConfiguration.response_type);
        params = params.append('scope', this.configurationProvider.openIDConfiguration.scope);
        params = params.append('nonce', nonce);
        params = params.append('state', state);
        if (isCodeFlow) {
            params = params.append('code_challenge', code_challenge);
            params = params.append('code_challenge_method', 'S256');
        }
        if (prompt) {
            params = params.append('prompt', prompt);
        }
        if (this.configurationProvider.openIDConfiguration.hd_param) {
            params = params.append('hd', this.configurationProvider.openIDConfiguration.hd_param);
        }
        /** @type {?} */
        const customParams = Object.assign({}, this.oidcSecurityCommon.customRequestParams);
        Object.keys(customParams).forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            params = params.append(key, customParams[key].toString());
        }));
        return `${authorizationUrl}?${params}`;
    }
    /**
     * @private
     * @param {?} end_session_endpoint
     * @param {?} id_token_hint
     * @return {?}
     */
    createEndSessionUrl(end_session_endpoint, id_token_hint) {
        /** @type {?} */
        const urlParts = end_session_endpoint.split('?');
        /** @type {?} */
        const authorizationEndsessionUrl = urlParts[0];
        /** @type {?} */
        let params = new HttpParams({
            fromString: urlParts[1],
            encoder: new UriEncoder(),
        });
        params = params.set('id_token_hint', id_token_hint);
        params = params.append('post_logout_redirect_uri', this.configurationProvider.openIDConfiguration.post_logout_redirect_uri);
        return `${authorizationEndsessionUrl}?${params}`;
    }
    /**
     * @private
     * @return {?}
     */
    getSigningKeys() {
        if (this.configurationProvider.wellKnownEndpoints) {
            this.loggerService.logDebug('jwks_uri: ' + this.configurationProvider.wellKnownEndpoints.jwks_uri);
            return this.oidcDataService
                .get(this.configurationProvider.wellKnownEndpoints.jwks_uri || '')
                .pipe(catchError(this.handleErrorGetSigningKeys));
        }
        else {
            this.loggerService.logWarning('getSigningKeys: authWellKnownEndpoints is undefined');
        }
        return this.oidcDataService.get('undefined').pipe(catchError(this.handleErrorGetSigningKeys));
    }
    /**
     * @private
     * @param {?} error
     * @return {?}
     */
    handleErrorGetSigningKeys(error) {
        /** @type {?} */
        let errMsg;
        if (error instanceof Response) {
            /** @type {?} */
            const body = error.json() || {};
            /** @type {?} */
            const err = JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.loggerService.logError(errMsg);
        return throwError(errMsg);
    }
    /**
     * @private
     * @return {?}
     */
    runTokenValidation() {
        if (this.runTokenValidationRunning || !this.configurationProvider.openIDConfiguration.silent_renew) {
            return;
        }
        this.runTokenValidationRunning = true;
        this.loggerService.logDebug('runTokenValidation silent-renew running');
        /**
         *   First time: delay 10 seconds to call silentRenewHeartBeatCheck
         *   Afterwards: Run this check in a 5 second interval only AFTER the previous operation ends.
         * @type {?}
         */
        const silentRenewHeartBeatCheck = (/**
         * @return {?}
         */
        () => {
            this.loggerService.logDebug('silentRenewHeartBeatCheck\r\n' +
                `\tsilentRenewRunning: ${this.oidcSecurityCommon.silentRenewRunning === 'running'}\r\n` +
                `\tidToken: ${!!this.getIdToken()}\r\n` +
                `\t_userData.value: ${!!this._userData.value}`);
            if (this._userData.value && this.oidcSecurityCommon.silentRenewRunning !== 'running' && this.getIdToken()) {
                if (this.oidcSecurityValidation.isTokenExpired(this.oidcSecurityCommon.idToken, this.configurationProvider.openIDConfiguration.silent_renew_offset_in_seconds)) {
                    this.loggerService.logDebug('IsAuthorized: id_token isTokenExpired, start silent renew if active');
                    if (this.configurationProvider.openIDConfiguration.silent_renew) {
                        this.refreshSession().subscribe((/**
                         * @return {?}
                         */
                        () => {
                            this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
                        }), (/**
                         * @param {?} err
                         * @return {?}
                         */
                        (err) => {
                            this.loggerService.logError('Error: ' + err);
                            this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
                        }));
                        /* In this situation, we schedule a heartbeat check only when silentRenew is finished.
                        We don't want to schedule another check so we have to return here */
                        return;
                    }
                    else {
                        this.resetAuthorizationData(false);
                    }
                }
            }
            /* Delay 3 seconds and do the next check */
            this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
        });
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            /* Initial heartbeat check */
            this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 10000);
        }));
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    silentRenewEventHandler(e) {
        this.loggerService.logDebug('silentRenewEventHandler');
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            /** @type {?} */
            const urlParts = e.detail.toString().split('?');
            /** @type {?} */
            const params = new HttpParams({
                fromString: urlParts[1],
            });
            /** @type {?} */
            const code = params.get('code');
            /** @type {?} */
            const state = params.get('state');
            /** @type {?} */
            const session_state = params.get('session_state');
            /** @type {?} */
            const error = params.get('error');
            if (code && state) {
                this.requestTokensWithCodeProcedure(code, state, session_state);
            }
            if (error) {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.LoginRequired, true));
                this.resetAuthorizationData(false);
                this.oidcSecurityCommon.authNonce = '';
                this.loggerService.logDebug(e.detail.toString());
            }
        }
        else {
            // ImplicitFlow
            this.authorizedImplicitFlowCallback(e.detail);
        }
    }
}
OidcSecurityService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityService.ctorParameters = () => [
    { type: OidcDataService },
    { type: StateValidationService },
    { type: Router },
    { type: OidcSecurityCheckSession },
    { type: OidcSecuritySilentRenew },
    { type: OidcSecurityUserService },
    { type: OidcSecurityCommon },
    { type: OidcSecurityValidation },
    { type: TokenHelperService },
    { type: LoggerService },
    { type: NgZone },
    { type: HttpClient },
    { type: ConfigurationProvider },
    { type: UrlParserService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AuthModule {
    /**
     * @param {?=} token
     * @return {?}
     */
    static forRoot(token = {}) {
        return {
            ngModule: AuthModule,
            providers: [
                OidcConfigService,
                OidcSecurityService,
                OidcSecurityValidation,
                OidcSecurityCheckSession,
                OidcSecuritySilentRenew,
                OidcSecurityUserService,
                OidcSecurityCommon,
                TokenHelperService,
                LoggerService,
                IFrameService,
                EqualityHelperService,
                OidcDataService,
                StateValidationService,
                {
                    provide: OidcSecurityStorage,
                    useClass: token.storage || BrowserStorage,
                },
            ],
        };
    }
}
AuthModule.decorators = [
    { type: NgModule }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AuthorizationResult, AuthorizationState, JwtKeys, JwtKey, ValidateStateResult, ValidationResult, AuthModule, TokenHelperService, OidcConfigService, OidcSecurityService, OidcSecurityStorage, BrowserStorage, OidcSecurityValidation, LoggerService, OidcDataService as ɵc, ConfigurationProvider as ɵa, IFrameService as ɵh, EqualityHelperService as ɵf, StateValidationService as ɵd, OidcSecurityCheckSession as ɵg, OidcSecurityCommon as ɵe, OidcSecuritySilentRenew as ɵi, OidcSecurityUserService as ɵj, PlatformProvider as ɵb, UrlParserService as ɵk };

//# sourceMappingURL=angular-auth-oidc-client.js.map