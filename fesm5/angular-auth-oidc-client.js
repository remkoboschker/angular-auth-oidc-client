import { isPlatformBrowser } from '@angular/common';
import { hextob64u, KEYUTIL, KJUR } from 'jsrsasign-reduced';
import { __assign, __spread, __values, __makeTemplateObject } from 'tslib';
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
var AuthorizationResult = /** @class */ (function () {
    function AuthorizationResult(authorizationState, validationResult, isRenewProcess) {
        if (isRenewProcess === void 0) { isRenewProcess = false; }
        this.authorizationState = authorizationState;
        this.validationResult = validationResult;
        this.isRenewProcess = isRenewProcess;
    }
    return AuthorizationResult;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var AuthorizationState = {
    authorized: 'authorized',
    forbidden: 'forbidden',
    unauthorized: 'unauthorized',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var JwtKeys = /** @class */ (function () {
    function JwtKeys() {
        this.keys = [];
    }
    return JwtKeys;
}());
var JwtKey = /** @class */ (function () {
    function JwtKey() {
        this.kty = '';
        this.use = '';
        this.kid = '';
        this.x5t = '';
        this.e = '';
        this.n = '';
        this.x5c = [];
    }
    return JwtKey;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
var ValidationResult = {
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
var  
// tslint:disable: variable-name
ValidateStateResult = /** @class */ (function () {
    function ValidateStateResult(access_token, id_token, authResponseIsValid, decoded_id_token, state) {
        if (access_token === void 0) { access_token = ''; }
        if (id_token === void 0) { id_token = ''; }
        if (authResponseIsValid === void 0) { authResponseIsValid = false; }
        if (decoded_id_token === void 0) { decoded_id_token = {}; }
        if (state === void 0) { state = ValidationResult.NotSet; }
        this.access_token = access_token;
        this.id_token = id_token;
        this.authResponseIsValid = authResponseIsValid;
        this.decoded_id_token = decoded_id_token;
        this.state = state;
    }
    return ValidateStateResult;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OidcDataService = /** @class */ (function () {
    function OidcDataService(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    OidcDataService.prototype.getWellknownEndpoints = /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    /**
     * @template T
     * @param {?} url
     * @param {?} token
     * @return {?}
     */
    OidcDataService.prototype.getIdentityUserData = /**
     * @template T
     * @param {?} url
     * @param {?} token
     * @return {?}
     */
    function (url, token) {
        /** @type {?} */
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Authorization', 'Bearer ' + decodeURIComponent(token));
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    OidcDataService.prototype.get = /**
     * @template T
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        return this.httpClient.get(url, {
            headers: headers,
        });
    };
    OidcDataService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcDataService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return OidcDataService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PlatformProvider = /** @class */ (function () {
    // tslint:disable-next-line: ban-types
    function PlatformProvider(platformId) {
        this.platformId = platformId;
    }
    Object.defineProperty(PlatformProvider.prototype, "isBrowser", {
        get: /**
         * @return {?}
         */
        function () {
            return isPlatformBrowser(this.platformId);
        },
        enumerable: true,
        configurable: true
    });
    PlatformProvider.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    PlatformProvider.ctorParameters = function () { return [
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    /** @nocollapse */ PlatformProvider.ngInjectableDef = defineInjectable({ factory: function PlatformProvider_Factory() { return new PlatformProvider(inject(PLATFORM_ID)); }, token: PlatformProvider, providedIn: "root" });
    return PlatformProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ConfigurationProvider = /** @class */ (function () {
    function ConfigurationProvider(platformProvider) {
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
    Object.defineProperty(ConfigurationProvider.prototype, "openIDConfiguration", {
        get: /**
         * @return {?}
         */
        function () {
            return this.mergedOpenIdConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationProvider.prototype, "wellKnownEndpoints", {
        get: /**
         * @return {?}
         */
        function () {
            return this.authWellKnownEndpoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationProvider.prototype, "onConfigurationChange", {
        get: /**
         * @return {?}
         */
        function () {
            return this.onConfigurationChangeInternal.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} passedOpenIfConfiguration
     * @param {?} passedAuthWellKnownEndpoints
     * @return {?}
     */
    ConfigurationProvider.prototype.setup = /**
     * @param {?} passedOpenIfConfiguration
     * @param {?} passedAuthWellKnownEndpoints
     * @return {?}
     */
    function (passedOpenIfConfiguration, passedAuthWellKnownEndpoints) {
        this.mergedOpenIdConfiguration = __assign({}, this.mergedOpenIdConfiguration, passedOpenIfConfiguration);
        this.setSpecialCases(this.mergedOpenIdConfiguration);
        this.authWellKnownEndpoints = __assign({}, passedAuthWellKnownEndpoints);
        this.onConfigurationChangeInternal.next(__assign({}, this.mergedOpenIdConfiguration));
    };
    /**
     * @private
     * @param {?} currentConfig
     * @return {?}
     */
    ConfigurationProvider.prototype.setSpecialCases = /**
     * @private
     * @param {?} currentConfig
     * @return {?}
     */
    function (currentConfig) {
        if (!this.platformProvider.isBrowser) {
            currentConfig.start_checksession = false;
            currentConfig.silent_renew = false;
            currentConfig.use_refresh_token = false;
        }
    };
    ConfigurationProvider.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    ConfigurationProvider.ctorParameters = function () { return [
        { type: PlatformProvider }
    ]; };
    /** @nocollapse */ ConfigurationProvider.ngInjectableDef = defineInjectable({ factory: function ConfigurationProvider_Factory() { return new ConfigurationProvider(inject(PlatformProvider)); }, token: ConfigurationProvider, providedIn: "root" });
    return ConfigurationProvider;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LoggerService = /** @class */ (function () {
    function LoggerService(configurationProvider) {
        this.configurationProvider = configurationProvider;
    }
    /**
     * @param {?} message
     * @param {...?} args
     * @return {?}
     */
    LoggerService.prototype.logError = /**
     * @param {?} message
     * @param {...?} args
     * @return {?}
     */
    function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.error.apply(console, __spread([message], args));
    };
    /**
     * @param {?} message
     * @return {?}
     */
    LoggerService.prototype.logWarning = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        if (this.configurationProvider.openIDConfiguration.log_console_warning_active) {
            console.warn(message);
        }
    };
    /**
     * @param {?} message
     * @return {?}
     */
    LoggerService.prototype.logDebug = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        if (this.configurationProvider.openIDConfiguration.log_console_debug_active) {
            console.log(message);
        }
    };
    LoggerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    LoggerService.ctorParameters = function () { return [
        { type: ConfigurationProvider }
    ]; };
    return LoggerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var IFrameService = /** @class */ (function () {
    function IFrameService(loggerService) {
        this.loggerService = loggerService;
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getExistingIFrame = /**
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (this.isIFrameElement(iFrameOnParent)) {
            return iFrameOnParent;
        }
        /** @type {?} */
        var iFrameOnSelf = this.getIFrameFromWindow(identifier);
        if (this.isIFrameElement(iFrameOnSelf)) {
            return iFrameOnSelf;
        }
        return null;
    };
    /**
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.addIFrameToWindowBody = /**
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var sessionIframe = window.document.createElement('iframe');
        sessionIframe.id = identifier;
        this.loggerService.logDebug(sessionIframe);
        sessionIframe.style.display = 'none';
        window.document.body.appendChild(sessionIframe);
        return sessionIframe;
    };
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getIFrameFromParentWindow = /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        try {
            /** @type {?} */
            var iFrameElement = window.parent.document.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    };
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getIFrameFromWindow = /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var iFrameElement = window.document.getElementById(identifier);
        if (this.isIFrameElement(iFrameElement)) {
            return iFrameElement;
        }
        return null;
    };
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    IFrameService.prototype.isIFrameElement = /**
     * @private
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return !!element && element instanceof HTMLIFrameElement;
    };
    IFrameService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    IFrameService.ctorParameters = function () { return [
        { type: LoggerService }
    ]; };
    return IFrameService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var EqualityHelperService = /** @class */ (function () {
    function EqualityHelperService() {
    }
    /**
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    EqualityHelperService.prototype.areEqual = /**
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    function (value1, value2) {
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
    };
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    EqualityHelperService.prototype.oneValueIsStringAndTheOtherIsArray = /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    function (value1, value2) {
        return (Array.isArray(value1) && this.valueIsString(value2)) || (Array.isArray(value2) && this.valueIsString(value1));
    };
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    EqualityHelperService.prototype.bothValuesAreObjects = /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    function (value1, value2) {
        return this.valueIsObject(value1) && this.valueIsObject(value2);
    };
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    EqualityHelperService.prototype.bothValuesAreStrings = /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    function (value1, value2) {
        return this.valueIsString(value1) && this.valueIsString(value2);
    };
    /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    EqualityHelperService.prototype.bothValuesAreArrays = /**
     * @private
     * @param {?} value1
     * @param {?} value2
     * @return {?}
     */
    function (value1, value2) {
        return Array.isArray(value1) && Array.isArray(value2);
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    EqualityHelperService.prototype.valueIsString = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return typeof value === 'string' || value instanceof String;
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    EqualityHelperService.prototype.valueIsObject = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return typeof value === 'object';
    };
    /**
     * @private
     * @param {?} arr1
     * @param {?} arr2
     * @return {?}
     */
    EqualityHelperService.prototype.arraysEqual = /**
     * @private
     * @param {?} arr1
     * @param {?} arr2
     * @return {?}
     */
    function (arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };
    EqualityHelperService.decorators = [
        { type: Injectable }
    ];
    return EqualityHelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var TokenHelperService = /** @class */ (function () {
    function TokenHelperService(loggerService) {
        this.loggerService = loggerService;
        this.PARTS_OF_TOKEN = 3;
    }
    /**
     * @param {?} dataIdToken
     * @return {?}
     */
    TokenHelperService.prototype.getTokenExpirationDate = /**
     * @param {?} dataIdToken
     * @return {?}
     */
    function (dataIdToken) {
        if (!dataIdToken.hasOwnProperty('exp')) {
            return new Date();
        }
        /** @type {?} */
        var date = new Date(0);
        date.setUTCSeconds(dataIdToken.exp);
        return date;
    };
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    TokenHelperService.prototype.getHeaderFromToken = /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 0, encoded);
    };
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    TokenHelperService.prototype.getPayloadFromToken = /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 1, encoded);
    };
    /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    TokenHelperService.prototype.getSignatureFromToken = /**
     * @param {?} token
     * @param {?} encoded
     * @return {?}
     */
    function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 2, encoded);
    };
    /**
     * @private
     * @param {?} token
     * @param {?} index
     * @param {?} encoded
     * @return {?}
     */
    TokenHelperService.prototype.getPartOfToken = /**
     * @private
     * @param {?} token
     * @param {?} index
     * @param {?} encoded
     * @return {?}
     */
    function (token, index, encoded) {
        /** @type {?} */
        var partOfToken = this.extractPartOfToken(token, index);
        if (encoded) {
            return partOfToken;
        }
        /** @type {?} */
        var result = this.urlBase64Decode(partOfToken);
        return JSON.parse(result);
    };
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    TokenHelperService.prototype.urlBase64Decode = /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        /** @type {?} */
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
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
        var decoded = typeof window !== 'undefined' ? window.atob(output) : new Buffer(output, 'base64').toString('binary');
        try {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(decoded
                .split('')
                .map((/**
             * @param {?} c
             * @return {?}
             */
            function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }))
                .join(''));
        }
        catch (err) {
            return decoded;
        }
    };
    /**
     * @private
     * @param {?} token
     * @return {?}
     */
    TokenHelperService.prototype.tokenIsValid = /**
     * @private
     * @param {?} token
     * @return {?}
     */
    function (token) {
        if (!token) {
            this.loggerService.logError("token '" + token + "' is not valid --> token falsy");
            return false;
        }
        if (!((/** @type {?} */ (token))).includes('.')) {
            this.loggerService.logError("token '" + token + "' is not valid --> no dots included");
            return false;
        }
        /** @type {?} */
        var parts = token.split('.');
        if (parts.length !== this.PARTS_OF_TOKEN) {
            this.loggerService.logError("token '" + token + "' is not valid --> token has to have exactly " + this.PARTS_OF_TOKEN + " dots");
            return false;
        }
        return true;
    };
    /**
     * @private
     * @param {?} token
     * @param {?} index
     * @return {?}
     */
    TokenHelperService.prototype.extractPartOfToken = /**
     * @private
     * @param {?} token
     * @param {?} index
     * @return {?}
     */
    function (token, index) {
        return token.split('.')[index];
    };
    TokenHelperService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    TokenHelperService.ctorParameters = function () { return [
        { type: LoggerService }
    ]; };
    return TokenHelperService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Implement this class-interface to create a custom storage.
 * @abstract
 */
var OidcSecurityStorage = /** @class */ (function () {
    function OidcSecurityStorage() {
    }
    OidcSecurityStorage.decorators = [
        { type: Injectable }
    ];
    return OidcSecurityStorage;
}());
var BrowserStorage = /** @class */ (function () {
    function BrowserStorage(configProvider) {
        this.configProvider = configProvider;
        this.hasStorage = typeof Storage !== 'undefined';
    }
    /**
     * @param {?} key
     * @return {?}
     */
    BrowserStorage.prototype.read = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        if (this.hasStorage) {
            return JSON.parse(this.configProvider.openIDConfiguration.storage.getItem(key + '_' + this.configProvider.openIDConfiguration.client_id));
        }
        return;
    };
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    BrowserStorage.prototype.write = /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        if (this.hasStorage) {
            value = value === undefined ? null : value;
            this.configProvider.openIDConfiguration.storage.setItem(key + '_' + this.configProvider.openIDConfiguration.client_id, JSON.stringify(value));
        }
    };
    BrowserStorage.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BrowserStorage.ctorParameters = function () { return [
        { type: ConfigurationProvider }
    ]; };
    return BrowserStorage;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OidcSecurityCommon = /** @class */ (function () {
    function OidcSecurityCommon(oidcSecurityStorage) {
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
    Object.defineProperty(OidcSecurityCommon.prototype, "authResult", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageAuthResult);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageAuthResult, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "accessToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageAccessToken) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageAccessToken, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "idToken", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageIdToken) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageIdToken, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "isAuthorized", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageIsAuthorized);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageIsAuthorized, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "userData", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageUserData);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageUserData, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "authNonce", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageAuthNonce) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageAuthNonce, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "code_verifier", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageCodeVerifier) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageCodeVerifier, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "authStateControl", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageAuthStateControl) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageAuthStateControl, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "sessionState", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageSessionState);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageSessionState, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "silentRenewRunning", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageSilentRenewRunning) || '';
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageSilentRenewRunning, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "customRequestParams", {
        get: /**
         * @return {?}
         */
        function () {
            return this.retrieve(this.storageCustomRequestParams);
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.store(this.storageCustomRequestParams, value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    OidcSecurityCommon.prototype.retrieve = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this.oidcSecurityStorage.read(key);
    };
    /**
     * @private
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    OidcSecurityCommon.prototype.store = /**
     * @private
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    function (key, value) {
        this.oidcSecurityStorage.write(key, value);
    };
    /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    OidcSecurityCommon.prototype.resetStorageData = /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    function (isRenewProcess) {
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
    };
    /**
     * @return {?}
     */
    OidcSecurityCommon.prototype.getAccessToken = /**
     * @return {?}
     */
    function () {
        return this.retrieve(this.storageAccessToken);
    };
    /**
     * @return {?}
     */
    OidcSecurityCommon.prototype.getIdToken = /**
     * @return {?}
     */
    function () {
        return this.retrieve(this.storageIdToken);
    };
    /**
     * @return {?}
     */
    OidcSecurityCommon.prototype.getRefreshToken = /**
     * @return {?}
     */
    function () {
        return this.authResult.refresh_token;
    };
    OidcSecurityCommon.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityCommon.ctorParameters = function () { return [
        { type: OidcSecurityStorage }
    ]; };
    return OidcSecurityCommon;
}());

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
                for (var _d = __values(jwtkeys.keys), _e = _d.next(); !_e.done; _e = _d.next()) {
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
                    for (var _f = __values(jwtkeys.keys), _g = _f.next(); !_g.done; _g = _f.next()) {
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
                for (var _h = __values(jwtkeys.keys), _j = _h.next(); !_j.done; _j = _h.next()) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var StateValidationService = /** @class */ (function () {
    function StateValidationService(oidcSecurityCommon, oidcSecurityValidation, tokenHelperService, loggerService, configurationProvider) {
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
    StateValidationService.prototype.validateState = /**
     * @param {?} result
     * @param {?} jwtKeys
     * @return {?}
     */
    function (result, jwtKeys) {
        /** @type {?} */
        var toReturn = new ValidateStateResult();
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
    };
    /**
     * @private
     * @return {?}
     */
    StateValidationService.prototype.handleSuccessfulValidation = /**
     * @private
     * @return {?}
     */
    function () {
        this.oidcSecurityCommon.authNonce = '';
        if (this.configurationProvider.openIDConfiguration.auto_clean_state_after_authentication) {
            this.oidcSecurityCommon.authStateControl = '';
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) validated, continue');
    };
    /**
     * @private
     * @return {?}
     */
    StateValidationService.prototype.handleUnsuccessfulValidation = /**
     * @private
     * @return {?}
     */
    function () {
        this.oidcSecurityCommon.authNonce = '';
        if (this.configurationProvider.openIDConfiguration.auto_clean_state_after_authentication) {
            this.oidcSecurityCommon.authStateControl = '';
        }
        this.loggerService.logDebug('AuthorizedCallback token(s) invalid');
    };
    StateValidationService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StateValidationService.ctorParameters = function () { return [
        { type: OidcSecurityCommon },
        { type: OidcSecurityValidation },
        { type: TokenHelperService },
        { type: LoggerService },
        { type: ConfigurationProvider }
    ]; };
    return StateValidationService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
var OidcSecurityCheckSession = /** @class */ (function () {
    function OidcSecurityCheckSession(oidcSecurityCommon, loggerService, iFrameService, zone, configurationProvider) {
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
    Object.defineProperty(OidcSecurityCheckSession.prototype, "onCheckSessionChanged", {
        get: /**
         * @return {?}
         */
        function () {
            return this.checkSessionChanged.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.doesSessionExist = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        if (!existingIFrame) {
            return false;
        }
        this.sessionIframe = existingIFrame;
        return true;
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.init = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (observer) {
            _this.sessionIframe.onload = (/**
             * @return {?}
             */
            function () {
                _this.lastIFrameRefresh = Date.now();
                observer.next(_this);
                observer.complete();
            });
        }));
    };
    /**
     * @param {?} clientId
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.startCheckingSession = /**
     * @param {?} clientId
     * @return {?}
     */
    function (clientId) {
        if (this.scheduledHeartBeat) {
            return;
        }
        this.pollServerSession(clientId);
    };
    /**
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.stopCheckingSession = /**
     * @return {?}
     */
    function () {
        if (!this.scheduledHeartBeat) {
            return;
        }
        this.clearScheduledHeartBeat();
    };
    /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.pollServerSession = /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    function (clientId) {
        var _this = this;
        /** @type {?} */
        var pollServerSessionRecur = (/**
         * @return {?}
         */
        function () {
            _this.init()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            function () {
                if (_this.sessionIframe && clientId) {
                    _this.loggerService.logDebug(_this.sessionIframe);
                    /** @type {?} */
                    var sessionState = _this.oidcSecurityCommon.sessionState;
                    if (sessionState) {
                        _this.outstandingMessages++;
                        _this.sessionIframe.contentWindow.postMessage(clientId + ' ' + sessionState, _this.configurationProvider.openIDConfiguration.stsServer);
                    }
                    else {
                        _this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        _this.checkSessionChanged.next();
                    }
                }
                else {
                    _this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession sessionIframe does not exist');
                    _this.loggerService.logDebug(clientId);
                    _this.loggerService.logDebug(_this.sessionIframe);
                    // this.init();
                }
                // after sending three messages with no response, fail.
                if (_this.outstandingMessages > 3) {
                    _this.loggerService.logError("OidcSecurityCheckSession not receiving check session response messages.\n                            Outstanding messages: " + _this.outstandingMessages + ". Server unreachable?");
                    _this.checkSessionChanged.next();
                }
                _this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, _this.heartBeatInterval);
            }));
        });
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            _this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, _this.heartBeatInterval);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.clearScheduledHeartBeat = /**
     * @private
     * @return {?}
     */
    function () {
        clearTimeout(this.scheduledHeartBeat);
        this.scheduledHeartBeat = null;
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.messageHandler = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
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
    };
    OidcSecurityCheckSession.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityCheckSession.ctorParameters = function () { return [
        { type: OidcSecurityCommon },
        { type: LoggerService },
        { type: IFrameService },
        { type: NgZone },
        { type: ConfigurationProvider }
    ]; };
    return OidcSecurityCheckSession;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OidcConfigService = /** @class */ (function () {
    function OidcConfigService(loggerService, httpClient) {
        this.loggerService = loggerService;
        this.httpClient = httpClient;
        this.configurationLoadedInternal = new ReplaySubject(1);
    }
    Object.defineProperty(OidcConfigService.prototype, "onConfigurationLoaded", {
        get: /**
         * @return {?}
         */
        function () {
            return this.configurationLoadedInternal.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} configUrl
     * @return {?}
     */
    OidcConfigService.prototype.load = /**
     * @param {?} configUrl
     * @return {?}
     */
    function (configUrl) {
        var _this = this;
        return this.httpClient
            .get(configUrl)
            .pipe(switchMap((/**
         * @param {?} clientConfiguration
         * @return {?}
         */
        function (clientConfiguration) {
            return _this.loadUsingConfiguration(clientConfiguration);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.loggerService.logError("OidcConfigService 'load' threw an error on calling " + configUrl, error);
            _this.configurationLoadedInternal.next(undefined);
            return of(false);
        })))
            .toPromise();
    };
    /**
     * @param {?} stsServer
     * @return {?}
     */
    OidcConfigService.prototype.load_using_stsServer = /**
     * @param {?} stsServer
     * @return {?}
     */
    function (stsServer) {
        return this.loadUsingConfiguration({ stsServer: stsServer }).toPromise();
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OidcConfigService.prototype.load_using_custom_stsServer = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        var _this = this;
        return this.httpClient
            .get(url)
            .pipe(switchMap((/**
         * @param {?} wellKnownEndpoints
         * @return {?}
         */
        function (wellKnownEndpoints) {
            _this.configurationLoadedInternal.next({
                authWellknownEndpoints: wellKnownEndpoints,
                customConfig: { stsServer: url },
            });
            return of(true);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.loggerService.logError("OidcConfigService 'load_using_custom_stsServer' threw an error on calling " + url, error);
            _this.configurationLoadedInternal.next(undefined);
            return of(false);
        })))
            .toPromise();
    };
    /**
     * @private
     * @param {?} clientConfig
     * @return {?}
     */
    OidcConfigService.prototype.loadUsingConfiguration = /**
     * @private
     * @param {?} clientConfig
     * @return {?}
     */
    function (clientConfig) {
        var _this = this;
        if (!clientConfig.stsServer) {
            this.loggerService.logError("Property 'stsServer' is not present of passed config " + JSON.stringify(clientConfig), clientConfig);
            throw new Error("Property 'stsServer' is not present of passed config " + JSON.stringify(clientConfig));
        }
        /** @type {?} */
        var url = clientConfig.stsServer + "/.well-known/openid-configuration";
        return this.httpClient.get(url).pipe(switchMap((/**
         * @param {?} wellKnownEndpoints
         * @return {?}
         */
        function (wellKnownEndpoints) {
            _this.configurationLoadedInternal.next({
                authWellknownEndpoints: wellKnownEndpoints,
                customConfig: clientConfig,
            });
            return of(true);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.loggerService.logError("OidcConfigService 'load_using_stsServer' threw an error on calling " + url, error);
            _this.configurationLoadedInternal.next(undefined);
            return of(false);
        })));
    };
    OidcConfigService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcConfigService.ctorParameters = function () { return [
        { type: LoggerService },
        { type: HttpClient }
    ]; };
    return OidcConfigService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
var OidcSecuritySilentRenew = /** @class */ (function () {
    function OidcSecuritySilentRenew(loggerService, iFrameService) {
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
    }
    /**
     * @return {?}
     */
    OidcSecuritySilentRenew.prototype.initRenew = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        if (!existingIFrame) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        return existingIFrame;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OidcSecuritySilentRenew.prototype.startRenew = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var sessionIframe = this.initRenew();
        this.loggerService.logDebug('startRenew for URL:' + url);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            /** @type {?} */
            var onLoadHandler = (/**
             * @return {?}
             */
            function () {
                sessionIframe.removeEventListener('load', onLoadHandler);
                observer.next(undefined);
                observer.complete();
            });
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.src = url;
            return (/**
             * @return {?}
             */
            function () {
                sessionIframe.removeEventListener('load', onLoadHandler);
            });
        }));
    };
    OidcSecuritySilentRenew.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecuritySilentRenew.ctorParameters = function () { return [
        { type: LoggerService },
        { type: IFrameService }
    ]; };
    return OidcSecuritySilentRenew;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OidcSecurityUserService = /** @class */ (function () {
    function OidcSecurityUserService(oidcDataService, oidcSecurityCommon, loggerService, configurationProvider) {
        this.oidcDataService = oidcDataService;
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.configurationProvider = configurationProvider;
        this.userData = '';
    }
    /**
     * @return {?}
     */
    OidcSecurityUserService.prototype.initUserData = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.getIdentityUserData().pipe(map((/**
         * @param {?} data
         * @return {?}
         */
        function (data) { return (_this.userData = data); })));
    };
    /**
     * @return {?}
     */
    OidcSecurityUserService.prototype.getUserData = /**
     * @return {?}
     */
    function () {
        if (!this.userData) {
            throw Error('UserData is not set!');
        }
        return this.userData;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    OidcSecurityUserService.prototype.setUserData = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.userData = value;
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityUserService.prototype.getIdentityUserData = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var token = this.oidcSecurityCommon.getAccessToken();
        if (!this.configurationProvider.wellKnownEndpoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
            throw Error('authWellKnownEndpoints is undefined');
        }
        /** @type {?} */
        var canGetUserData = this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.userinfo_endpoint;
        if (!canGetUserData) {
            this.loggerService.logError('init check session: authWellKnownEndpoints.userinfo_endpoint is undefined; set auto_userinfo = false in config');
            throw Error('authWellKnownEndpoints.userinfo_endpoint is undefined');
        }
        return this.oidcDataService.getIdentityUserData(this.configurationProvider.wellKnownEndpoints.userinfo_endpoint || '', token);
    };
    OidcSecurityUserService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityUserService.ctorParameters = function () { return [
        { type: OidcDataService },
        { type: OidcSecurityCommon },
        { type: LoggerService },
        { type: ConfigurationProvider }
    ]; };
    return OidcSecurityUserService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var UriEncoder = /** @class */ (function () {
    function UriEncoder() {
    }
    /**
     * @param {?} key
     * @return {?}
     */
    UriEncoder.prototype.encodeKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return encodeURIComponent(key);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    UriEncoder.prototype.encodeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return encodeURIComponent(value);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    UriEncoder.prototype.decodeKey = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return decodeURIComponent(key);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    UriEncoder.prototype.decodeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return decodeURIComponent(value);
    };
    return UriEncoder;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var UrlParserService = /** @class */ (function () {
    function UrlParserService() {
    }
    /**
     * @param {?} urlToCheck
     * @param {?} name
     * @return {?}
     */
    UrlParserService.prototype.getUrlParameter = /**
     * @param {?} urlToCheck
     * @param {?} name
     * @return {?}
     */
    function (urlToCheck, name) {
        if (!urlToCheck) {
            return '';
        }
        if (!name) {
            return '';
        }
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        /** @type {?} */
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        /** @type {?} */
        var results = regex.exec(urlToCheck);
        return results === null ? '' : decodeURIComponent(results[1]);
    };
    UrlParserService.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */ UrlParserService.ngInjectableDef = defineInjectable({ factory: function UrlParserService_Factory() { return new UrlParserService(); }, token: UrlParserService, providedIn: "root" });
    return UrlParserService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable: variable-name
var OidcSecurityService = /** @class */ (function () {
    function OidcSecurityService(oidcDataService, stateValidationService, router, oidcSecurityCheckSession, oidcSecuritySilentRenew, oidcSecurityUserService, oidcSecurityCommon, oidcSecurityValidation, tokenHelperService, loggerService, zone, httpClient, configurationProvider, urlParserService) {
        var _this = this;
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
        function () {
            _this.moduleSetup = true;
            _this._isModuleSetup.next(true);
        }));
        this._isSetupAndAuthorized = this._isModuleSetup.pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        function (isModuleSetup) { return isModuleSetup; })), switchMap((/**
         * @return {?}
         */
        function () {
            if (!_this.configurationProvider.openIDConfiguration.silent_renew) {
                _this.loggerService.logDebug("IsAuthorizedRace: Silent Renew Not Active. Emitting.");
                return from([true]);
            }
            /** @type {?} */
            var race$ = _this._isAuthorized.asObservable().pipe(filter((/**
             * @param {?} isAuthorized
             * @return {?}
             */
            function (isAuthorized) { return isAuthorized; })), take(1), tap((/**
             * @return {?}
             */
            function () { return _this.loggerService.logDebug('IsAuthorizedRace: Existing token is still authorized.'); })), 
            // tslint:disable-next-line: deprecation
            race(_this._onAuthorizationResult.pipe(take(1), tap((/**
             * @return {?}
             */
            function () { return _this.loggerService.logDebug('IsAuthorizedRace: Silent Renew Refresh Session Complete'); })), map((/**
             * @return {?}
             */
            function () { return true; }))), timer(_this.configurationProvider.openIDConfiguration.isauthorizedrace_timeout_in_seconds * 1000).pipe(
            // backup, if nothing happens after X seconds stop waiting and emit (5s Default)
            tap((/**
             * @return {?}
             */
            function () {
                _this.resetAuthorizationData(false);
                _this.oidcSecurityCommon.authNonce = '';
                _this.loggerService.logWarning('IsAuthorizedRace: Timeout reached. Emitting.');
            })), map((/**
             * @return {?}
             */
            function () { return true; })))));
            _this.loggerService.logDebug('Silent Renew is active, check if token in storage is active');
            if (_this.oidcSecurityCommon.authNonce === '' || _this.oidcSecurityCommon.authNonce === undefined) {
                // login not running, or a second silent renew, user must login first before this will work.
                _this.loggerService.logDebug('Silent Renew or login not running, try to refresh the session');
                _this.refreshSession().subscribe();
            }
            return race$;
        })), tap((/**
         * @return {?}
         */
        function () { return _this.loggerService.logDebug('IsAuthorizedRace: Completed'); })), switchMapTo(this._isAuthorized.asObservable()), tap((/**
         * @param {?} isAuthorized
         * @return {?}
         */
        function (isAuthorized) { return _this.loggerService.logDebug("getIsAuthorized: " + isAuthorized); })), shareReplay(1));
        this._isSetupAndAuthorized
            .pipe(filter((/**
         * @return {?}
         */
        function () { return _this.configurationProvider.openIDConfiguration.start_checksession; })))
            .subscribe((/**
         * @param {?} isSetupAndAuthorized
         * @return {?}
         */
        function (isSetupAndAuthorized) {
            if (isSetupAndAuthorized) {
                _this.oidcSecurityCheckSession.startCheckingSession(_this.configurationProvider.openIDConfiguration.client_id);
            }
            else {
                _this.oidcSecurityCheckSession.stopCheckingSession();
            }
        }));
    }
    Object.defineProperty(OidcSecurityService.prototype, "onModuleSetup", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onModuleSetup.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityService.prototype, "onAuthorizationResult", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onAuthorizationResult.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityService.prototype, "onCheckSessionChanged", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onCheckSessionChanged.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityService.prototype, "onConfigurationChange", {
        get: /**
         * @return {?}
         */
        function () {
            return this.configurationProvider.onConfigurationChange;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} openIdConfiguration
     * @param {?} authWellKnownEndpoints
     * @return {?}
     */
    OidcSecurityService.prototype.setupModule = /**
     * @param {?} openIdConfiguration
     * @param {?} authWellKnownEndpoints
     * @return {?}
     */
    function (openIdConfiguration, authWellKnownEndpoints) {
        var _this = this;
        this.configurationProvider.setup(openIdConfiguration, authWellKnownEndpoints);
        this.oidcSecurityCheckSession.onCheckSessionChanged.subscribe((/**
         * @return {?}
         */
        function () {
            _this.loggerService.logDebug('onCheckSessionChanged');
            _this.checkSessionChanged = true;
            _this._onCheckSessionChanged.next(_this.checkSessionChanged);
        }));
        /** @type {?} */
        var userData = this.oidcSecurityCommon.userData;
        if (userData) {
            this.setUserData(userData);
        }
        /** @type {?} */
        var isAuthorized = this.oidcSecurityCommon.isAuthorized;
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
            var instanceId_1 = Math.random();
            /** @type {?} */
            var boundSilentRenewInitEvent_1 = ((/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                if (e.detail !== instanceId_1) {
                    window.removeEventListener('oidc-silent-renew-message', _this.boundSilentRenewEvent);
                    window.removeEventListener('oidc-silent-renew-init', boundSilentRenewInitEvent_1);
                }
            })).bind(this);
            window.addEventListener('oidc-silent-renew-init', boundSilentRenewInitEvent_1, false);
            window.addEventListener('oidc-silent-renew-message', this.boundSilentRenewEvent, false);
            window.dispatchEvent(new CustomEvent('oidc-silent-renew-init', {
                detail: instanceId_1,
            }));
        }
    };
    /**
     * @template T
     * @return {?}
     */
    OidcSecurityService.prototype.getUserData = /**
     * @template T
     * @return {?}
     */
    function () {
        return this._userData.asObservable();
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getIsModuleSetup = /**
     * @return {?}
     */
    function () {
        return this._isModuleSetup.asObservable();
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getIsAuthorized = /**
     * @return {?}
     */
    function () {
        return this._isSetupAndAuthorized;
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getToken = /**
     * @return {?}
     */
    function () {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        var token = this.oidcSecurityCommon.getAccessToken();
        return decodeURIComponent(token);
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getIdToken = /**
     * @return {?}
     */
    function () {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        var token = this.oidcSecurityCommon.getIdToken();
        return decodeURIComponent(token);
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getRefreshToken = /**
     * @return {?}
     */
    function () {
        if (!this._isAuthorized.getValue()) {
            return '';
        }
        /** @type {?} */
        var token = this.oidcSecurityCommon.getRefreshToken();
        return decodeURIComponent(token);
    };
    /**
     * @param {?=} encode
     * @return {?}
     */
    OidcSecurityService.prototype.getPayloadFromIdToken = /**
     * @param {?=} encode
     * @return {?}
     */
    function (encode) {
        if (encode === void 0) { encode = false; }
        /** @type {?} */
        var token = this.getIdToken();
        return this.tokenHelperService.getPayloadFromToken(token, encode);
    };
    /**
     * @param {?} state
     * @return {?}
     */
    OidcSecurityService.prototype.setState = /**
     * @param {?} state
     * @return {?}
     */
    function (state) {
        this.oidcSecurityCommon.authStateControl = state;
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getState = /**
     * @return {?}
     */
    function () {
        return this.oidcSecurityCommon.authStateControl;
    };
    /**
     * @param {?} params
     * @return {?}
     */
    OidcSecurityService.prototype.setCustomRequestParameters = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        this.oidcSecurityCommon.customRequestParams = params;
    };
    // Code Flow with PCKE or Implicit Flow
    // Code Flow with PCKE or Implicit Flow
    /**
     * @param {?=} urlHandler
     * @return {?}
     */
    OidcSecurityService.prototype.authorize = 
    // Code Flow with PCKE or Implicit Flow
    /**
     * @param {?=} urlHandler
     * @return {?}
     */
    function (urlHandler) {
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
        var state = this.oidcSecurityCommon.authStateControl;
        if (!state) {
            state = Date.now() + '' + Math.random() + Math.random();
            this.oidcSecurityCommon.authStateControl = state;
        }
        /** @type {?} */
        var nonce = 'N' + Math.random() + '' + Date.now();
        this.oidcSecurityCommon.authNonce = nonce;
        this.loggerService.logDebug('AuthorizedController created. local state: ' + this.oidcSecurityCommon.authStateControl);
        /** @type {?} */
        var url = '';
        // Code Flow
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            // code_challenge with "S256"
            /** @type {?} */
            var code_verifier = 'C' + Math.random() + '' + Date.now() + '' + Date.now() + Math.random();
            /** @type {?} */
            var code_challenge = this.oidcSecurityValidation.generate_code_verifier(code_verifier);
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
    };
    // Code Flow
    // Code Flow
    /**
     * @param {?} urlToCheck
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedCallbackWithCode = 
    // Code Flow
    /**
     * @param {?} urlToCheck
     * @return {?}
     */
    function (urlToCheck) {
        this.authorizedCallbackWithCode$(urlToCheck).subscribe();
    };
    /**
     * @param {?} urlToCheck
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedCallbackWithCode$ = /**
     * @param {?} urlToCheck
     * @return {?}
     */
    function (urlToCheck) {
        /** @type {?} */
        var code = this.urlParserService.getUrlParameter(urlToCheck, 'code');
        /** @type {?} */
        var state = this.urlParserService.getUrlParameter(urlToCheck, 'state');
        /** @type {?} */
        var sessionState = this.urlParserService.getUrlParameter(urlToCheck, 'session_state') || null;
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
    };
    // Code Flow
    // Code Flow
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    OidcSecurityService.prototype.requestTokensWithCode = 
    // Code Flow
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    function (code, state, sessionState) {
        this.requestTokensWithCode$(code, state, sessionState).subscribe();
    };
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    OidcSecurityService.prototype.requestTokensWithCode$ = /**
     * @param {?} code
     * @param {?} state
     * @param {?} sessionState
     * @return {?}
     */
    function (code, state, sessionState) {
        var _this = this;
        return this._isModuleSetup.pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        function (isModuleSetup) { return !!isModuleSetup; })), take(1), switchMap((/**
         * @return {?}
         */
        function () {
            return _this.requestTokensWithCodeProcedure$(code, state, sessionState);
        })));
    };
    // Refresh Token
    // Refresh Token
    /**
     * @param {?} code
     * @param {?} state
     * @return {?}
     */
    OidcSecurityService.prototype.refreshTokensWithCodeProcedure = 
    // Refresh Token
    /**
     * @param {?} code
     * @param {?} state
     * @return {?}
     */
    function (code, state) {
        var _this = this;
        /** @type {?} */
        var tokenRequestUrl = '';
        if (this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.token_endpoint) {
            tokenRequestUrl = "" + this.configurationProvider.wellKnownEndpoints.token_endpoint;
        }
        /** @type {?} */
        var headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        /** @type {?} */
        var data = "grant_type=refresh_token&client_id=" + this.configurationProvider.openIDConfiguration.client_id + "&refresh_token=" + code;
        return this.httpClient.post(tokenRequestUrl, data, { headers: headers }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            _this.loggerService.logDebug('token refresh response: ' + JSON.stringify(response));
            /** @type {?} */
            var obj = new Object();
            obj = response;
            obj.state = state;
            _this.authorizedCodeFlowCallbackProcedure(obj);
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.loggerService.logError(error);
            _this.loggerService.logError("OidcService code request " + _this.configurationProvider.openIDConfiguration.stsServer);
            return of(false);
        })));
    };
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    OidcSecurityService.prototype.requestTokensWithCodeProcedure = /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    function (code, state, session_state) {
        this.requestTokensWithCodeProcedure$(code, state, session_state).subscribe();
    };
    // Code Flow with PCKE
    // Code Flow with PCKE
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    OidcSecurityService.prototype.requestTokensWithCodeProcedure$ = 
    // Code Flow with PCKE
    /**
     * @param {?} code
     * @param {?} state
     * @param {?} session_state
     * @return {?}
     */
    function (code, state, session_state) {
        var _this = this;
        /** @type {?} */
        var tokenRequestUrl = '';
        if (this.configurationProvider.wellKnownEndpoints && this.configurationProvider.wellKnownEndpoints.token_endpoint) {
            tokenRequestUrl = "" + this.configurationProvider.wellKnownEndpoints.token_endpoint;
        }
        if (!this.oidcSecurityValidation.validateStateFromHashCallback(state, this.oidcSecurityCommon.authStateControl)) {
            this.loggerService.logWarning('authorizedCallback incorrect state');
            // ValidationResult.StatesDoNotMatch;
            return throwError(new Error('incorrect state'));
        }
        /** @type {?} */
        var headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
        /** @type {?} */
        var data = oneLineTrim(templateObject_1 || (templateObject_1 = __makeTemplateObject(["grant_type=authorization_code&client_id=", "\n            &code_verifier=", "\n            &code=", "&redirect_uri=", ""], ["grant_type=authorization_code&client_id=", "\n            &code_verifier=", "\n            &code=", "&redirect_uri=", ""])), this.configurationProvider.openIDConfiguration.client_id, this.oidcSecurityCommon.code_verifier, code, this.configurationProvider.openIDConfiguration.redirect_url);
        if (this.oidcSecurityCommon.silentRenewRunning === 'running') {
            data = oneLineTrim(templateObject_2 || (templateObject_2 = __makeTemplateObject(["grant_type=authorization_code&client_id=", "\n                &code_verifier=", "\n                &code=", "\n                &redirect_uri=", ""], ["grant_type=authorization_code&client_id=", "\n                &code_verifier=", "\n                &code=", "\n                &redirect_uri=", ""])), this.configurationProvider.openIDConfiguration.client_id, this.oidcSecurityCommon.code_verifier, code, this.configurationProvider.openIDConfiguration.silent_renew_url);
        }
        return this.httpClient.post(tokenRequestUrl, data, { headers: headers }).pipe(map((/**
         * @param {?} response
         * @return {?}
         */
        function (response) {
            /** @type {?} */
            var obj = new Object();
            obj = response;
            obj.state = state;
            obj.session_state = session_state;
            _this.authorizedCodeFlowCallbackProcedure(obj);
            return undefined;
        })), catchError((/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.loggerService.logError(error);
            _this.loggerService.logError("OidcService code request " + _this.configurationProvider.openIDConfiguration.stsServer);
            return throwError(error);
        })));
    };
    // Code Flow
    // Code Flow
    /**
     * @private
     * @param {?} result
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedCodeFlowCallbackProcedure = 
    // Code Flow
    /**
     * @private
     * @param {?} result
     * @return {?}
     */
    function (result) {
        /** @type {?} */
        var silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        var isRenewProcess = silentRenew === 'running';
        this.loggerService.logDebug('BEGIN authorized Code Flow Callback, no auth data');
        this.resetAuthorizationData(isRenewProcess);
        this.authorizedCallbackProcedure(result, isRenewProcess);
    };
    // Implicit Flow
    // Implicit Flow
    /**
     * @private
     * @param {?=} hash
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedImplicitFlowCallbackProcedure = 
    // Implicit Flow
    /**
     * @private
     * @param {?=} hash
     * @return {?}
     */
    function (hash) {
        /** @type {?} */
        var silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        var isRenewProcess = silentRenew === 'running';
        this.loggerService.logDebug('BEGIN authorizedCallback, no auth data');
        this.resetAuthorizationData(isRenewProcess);
        hash = hash || window.location.hash.substr(1);
        /** @type {?} */
        var result = hash.split('&').reduce((/**
         * @param {?} resultData
         * @param {?} item
         * @return {?}
         */
        function (resultData, item) {
            /** @type {?} */
            var parts = item.split('=');
            resultData[(/** @type {?} */ (parts.shift()))] = parts.join('=');
            return resultData;
        }), {});
        this.authorizedCallbackProcedure(result, isRenewProcess);
    };
    // Implicit Flow
    // Implicit Flow
    /**
     * @param {?=} hash
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedImplicitFlowCallback = 
    // Implicit Flow
    /**
     * @param {?=} hash
     * @return {?}
     */
    function (hash) {
        var _this = this;
        this._isModuleSetup
            .pipe(filter((/**
         * @param {?} isModuleSetup
         * @return {?}
         */
        function (isModuleSetup) { return isModuleSetup; })), take(1))
            .subscribe((/**
         * @return {?}
         */
        function () {
            _this.authorizedImplicitFlowCallbackProcedure(hash);
        }));
    };
    /**
     * @private
     * @param {?} url
     * @return {?}
     */
    OidcSecurityService.prototype.redirectTo = /**
     * @private
     * @param {?} url
     * @return {?}
     */
    function (url) {
        window.location.href = url;
    };
    // Implicit Flow
    // Implicit Flow
    /**
     * @private
     * @param {?} result
     * @param {?} isRenewProcess
     * @return {?}
     */
    OidcSecurityService.prototype.authorizedCallbackProcedure = 
    // Implicit Flow
    /**
     * @private
     * @param {?} result
     * @param {?} isRenewProcess
     * @return {?}
     */
    function (result, isRenewProcess) {
        var _this = this;
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
            function (jwtKeys) {
                /** @type {?} */
                var validationResult = _this.getValidatedStateResult(result, jwtKeys);
                if (validationResult.authResponseIsValid) {
                    _this.setAuthorizationData(validationResult.access_token, validationResult.id_token);
                    _this.oidcSecurityCommon.silentRenewRunning = '';
                    if (_this.configurationProvider.openIDConfiguration.auto_userinfo) {
                        _this.getUserinfo(isRenewProcess, result, validationResult.id_token, validationResult.decoded_id_token).subscribe((/**
                         * @param {?} response
                         * @return {?}
                         */
                        function (response) {
                            if (response) {
                                _this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.authorized, validationResult.state, isRenewProcess));
                                if (!_this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                                    _this.router.navigate([_this.configurationProvider.openIDConfiguration.post_login_route]);
                                }
                            }
                            else {
                                _this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, validationResult.state, isRenewProcess));
                                if (!_this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                                    _this.router.navigate([_this.configurationProvider.openIDConfiguration.unauthorized_route]);
                                }
                            }
                        }), (/**
                         * @param {?} err
                         * @return {?}
                         */
                        function (err) {
                            /* Something went wrong while getting signing key */
                            _this.loggerService.logWarning('Failed to retreive user info with error: ' + JSON.stringify(err));
                        }));
                    }
                    else {
                        if (!isRenewProcess) {
                            // userData is set to the id_token decoded, auto get user data set to false
                            _this.oidcSecurityUserService.setUserData(validationResult.decoded_id_token);
                            _this.setUserData(_this.oidcSecurityUserService.getUserData());
                        }
                        _this.runTokenValidation();
                        _this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.authorized, validationResult.state, isRenewProcess));
                        if (!_this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                            _this.router.navigate([_this.configurationProvider.openIDConfiguration.post_login_route]);
                        }
                    }
                }
                else {
                    // something went wrong
                    _this.loggerService.logWarning('authorizedCallback, token(s) validation failed, resetting');
                    _this.loggerService.logWarning(window.location.hash);
                    _this.resetAuthorizationData(false);
                    _this.oidcSecurityCommon.silentRenewRunning = '';
                    _this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, validationResult.state, isRenewProcess));
                    if (!_this.configurationProvider.openIDConfiguration.trigger_authorization_result_event && !isRenewProcess) {
                        _this.router.navigate([_this.configurationProvider.openIDConfiguration.unauthorized_route]);
                    }
                }
            }), (/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                /* Something went wrong while getting signing key */
                _this.loggerService.logWarning('Failed to retreive siging key with error: ' + JSON.stringify(err));
                _this.oidcSecurityCommon.silentRenewRunning = '';
            }));
        }
    };
    /**
     * @param {?=} isRenewProcess
     * @param {?=} result
     * @param {?=} id_token
     * @param {?=} decoded_id_token
     * @return {?}
     */
    OidcSecurityService.prototype.getUserinfo = /**
     * @param {?=} isRenewProcess
     * @param {?=} result
     * @param {?=} id_token
     * @param {?=} decoded_id_token
     * @return {?}
     */
    function (isRenewProcess, result, id_token, decoded_id_token) {
        var _this = this;
        if (isRenewProcess === void 0) { isRenewProcess = false; }
        result = result ? result : this.oidcSecurityCommon.authResult;
        id_token = id_token ? id_token : this.oidcSecurityCommon.idToken;
        decoded_id_token = decoded_id_token ? decoded_id_token : this.tokenHelperService.getPayloadFromToken(id_token, false);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            // flow id_token token
            if (_this.configurationProvider.openIDConfiguration.response_type === 'id_token token' ||
                _this.configurationProvider.openIDConfiguration.response_type === 'code') {
                if (isRenewProcess && _this._userData.value) {
                    _this.oidcSecurityCommon.sessionState = result.session_state;
                    observer.next(true);
                    observer.complete();
                }
                else {
                    _this.oidcSecurityUserService.initUserData().subscribe((/**
                     * @return {?}
                     */
                    function () {
                        _this.loggerService.logDebug('authorizedCallback (id_token token || code) flow');
                        /** @type {?} */
                        var userData = _this.oidcSecurityUserService.getUserData();
                        if (_this.oidcSecurityValidation.validate_userdata_sub_id_token(decoded_id_token.sub, userData.sub)) {
                            _this.setUserData(userData);
                            _this.loggerService.logDebug(_this.oidcSecurityCommon.accessToken);
                            _this.loggerService.logDebug(_this.oidcSecurityUserService.getUserData());
                            _this.oidcSecurityCommon.sessionState = result.session_state;
                            _this.runTokenValidation();
                            observer.next(true);
                        }
                        else {
                            // something went wrong, userdata sub does not match that from id_token
                            _this.loggerService.logWarning('authorizedCallback, User data sub does not match sub in id_token');
                            _this.loggerService.logDebug('authorizedCallback, token(s) validation failed, resetting');
                            _this.resetAuthorizationData(false);
                            observer.next(false);
                        }
                        observer.complete();
                    }));
                }
            }
            else {
                // flow id_token
                _this.loggerService.logDebug('authorizedCallback id_token flow');
                _this.loggerService.logDebug(_this.oidcSecurityCommon.accessToken);
                // userData is set to the id_token decoded. No access_token.
                _this.oidcSecurityUserService.setUserData(decoded_id_token);
                _this.setUserData(_this.oidcSecurityUserService.getUserData());
                _this.oidcSecurityCommon.sessionState = result.session_state;
                _this.runTokenValidation();
                observer.next(true);
                observer.complete();
            }
        }));
    };
    /**
     * @param {?=} urlHandler
     * @return {?}
     */
    OidcSecurityService.prototype.logoff = /**
     * @param {?=} urlHandler
     * @return {?}
     */
    function (urlHandler) {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        this.loggerService.logDebug('BEGIN Authorize, no auth data');
        if (this.configurationProvider.wellKnownEndpoints) {
            if (this.configurationProvider.wellKnownEndpoints.end_session_endpoint) {
                /** @type {?} */
                var end_session_endpoint = this.configurationProvider.wellKnownEndpoints.end_session_endpoint;
                /** @type {?} */
                var id_token_hint = this.oidcSecurityCommon.idToken;
                /** @type {?} */
                var url = this.createEndSessionUrl(end_session_endpoint, id_token_hint);
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
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.refreshSession = /**
     * @return {?}
     */
    function () {
        if (!this.configurationProvider.openIDConfiguration.silent_renew) {
            return of(false);
        }
        this.loggerService.logDebug('BEGIN refresh session Authorize');
        this.oidcSecurityCommon.silentRenewRunning = 'running';
        /** @type {?} */
        var state = this.oidcSecurityCommon.authStateControl;
        if (state === '' || state === null) {
            state = Date.now() + '' + Math.random() + Math.random();
            this.oidcSecurityCommon.authStateControl = state;
        }
        /** @type {?} */
        var nonce = 'N' + Math.random() + '' + Date.now();
        this.oidcSecurityCommon.authNonce = nonce;
        this.loggerService.logDebug('RefreshSession created. adding myautostate: ' + this.oidcSecurityCommon.authStateControl);
        /** @type {?} */
        var url = '';
        // Code Flow
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            if (this.configurationProvider.openIDConfiguration.use_refresh_token) {
                // try using refresh token
                /** @type {?} */
                var refresh_token = this.oidcSecurityCommon.getRefreshToken();
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
            var code_verifier = 'C' + Math.random() + '' + Date.now() + '' + Date.now() + Math.random();
            /** @type {?} */
            var code_challenge = this.oidcSecurityValidation.generate_code_verifier(code_verifier);
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
        function () { return true; })));
    };
    /**
     * @param {?} error
     * @return {?}
     */
    OidcSecurityService.prototype.handleError = /**
     * @param {?} error
     * @return {?}
     */
    function (error) {
        /** @type {?} */
        var silentRenew = this.oidcSecurityCommon.silentRenewRunning;
        /** @type {?} */
        var isRenewProcess = silentRenew === 'running';
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
            var silentRenewRunning = this.oidcSecurityCommon.silentRenewRunning;
            this.resetAuthorizationData(!!silentRenewRunning);
            if (this.configurationProvider.openIDConfiguration.trigger_authorization_result_event) {
                this._onAuthorizationResult.next(new AuthorizationResult(AuthorizationState.unauthorized, ValidationResult.NotSet, isRenewProcess));
            }
            else {
                this.router.navigate([this.configurationProvider.openIDConfiguration.unauthorized_route]);
            }
        }
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.startCheckingSilentRenew = /**
     * @return {?}
     */
    function () {
        this.runTokenValidation();
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.stopCheckingSilentRenew = /**
     * @return {?}
     */
    function () {
        if (this._scheduledHeartBeat) {
            clearTimeout(this._scheduledHeartBeat);
            this._scheduledHeartBeat = null;
            this.runTokenValidationRunning = false;
        }
    };
    /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    OidcSecurityService.prototype.resetAuthorizationData = /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    function (isRenewProcess) {
        if (!isRenewProcess) {
            if (this.configurationProvider.openIDConfiguration.auto_userinfo) {
                // Clear user data. Fixes #97.
                this.setUserData('');
            }
            this.oidcSecurityCommon.resetStorageData(isRenewProcess);
            this.checkSessionChanged = false;
            this.setIsAuthorized(false);
        }
    };
    /**
     * @return {?}
     */
    OidcSecurityService.prototype.getEndSessionUrl = /**
     * @return {?}
     */
    function () {
        if (this.configurationProvider.wellKnownEndpoints) {
            if (this.configurationProvider.wellKnownEndpoints.end_session_endpoint) {
                /** @type {?} */
                var end_session_endpoint = this.configurationProvider.wellKnownEndpoints.end_session_endpoint;
                /** @type {?} */
                var id_token_hint = this.oidcSecurityCommon.idToken;
                return this.createEndSessionUrl(end_session_endpoint, id_token_hint);
            }
        }
    };
    /**
     * @private
     * @param {?} result
     * @param {?} jwtKeys
     * @return {?}
     */
    OidcSecurityService.prototype.getValidatedStateResult = /**
     * @private
     * @param {?} result
     * @param {?} jwtKeys
     * @return {?}
     */
    function (result, jwtKeys) {
        if (result.error) {
            return new ValidateStateResult('', '', false, {});
        }
        return this.stateValidationService.validateState(result, jwtKeys);
    };
    /**
     * @private
     * @param {?} userData
     * @return {?}
     */
    OidcSecurityService.prototype.setUserData = /**
     * @private
     * @param {?} userData
     * @return {?}
     */
    function (userData) {
        this.oidcSecurityCommon.userData = userData;
        this._userData.next(userData);
    };
    /**
     * @private
     * @param {?} isAuthorized
     * @return {?}
     */
    OidcSecurityService.prototype.setIsAuthorized = /**
     * @private
     * @param {?} isAuthorized
     * @return {?}
     */
    function (isAuthorized) {
        this._isAuthorized.next(isAuthorized);
    };
    /**
     * @private
     * @param {?} access_token
     * @param {?} id_token
     * @return {?}
     */
    OidcSecurityService.prototype.setAuthorizationData = /**
     * @private
     * @param {?} access_token
     * @param {?} id_token
     * @return {?}
     */
    function (access_token, id_token) {
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
    };
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
    OidcSecurityService.prototype.createAuthorizeUrl = /**
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
    function (isCodeFlow, code_challenge, redirect_url, nonce, state, authorization_endpoint, prompt) {
        /** @type {?} */
        var urlParts = authorization_endpoint.split('?');
        /** @type {?} */
        var authorizationUrl = urlParts[0];
        /** @type {?} */
        var params = new HttpParams({
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
        var customParams = Object.assign({}, this.oidcSecurityCommon.customRequestParams);
        Object.keys(customParams).forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            params = params.append(key, customParams[key].toString());
        }));
        return authorizationUrl + "?" + params;
    };
    /**
     * @private
     * @param {?} end_session_endpoint
     * @param {?} id_token_hint
     * @return {?}
     */
    OidcSecurityService.prototype.createEndSessionUrl = /**
     * @private
     * @param {?} end_session_endpoint
     * @param {?} id_token_hint
     * @return {?}
     */
    function (end_session_endpoint, id_token_hint) {
        /** @type {?} */
        var urlParts = end_session_endpoint.split('?');
        /** @type {?} */
        var authorizationEndsessionUrl = urlParts[0];
        /** @type {?} */
        var params = new HttpParams({
            fromString: urlParts[1],
            encoder: new UriEncoder(),
        });
        params = params.set('id_token_hint', id_token_hint);
        params = params.append('post_logout_redirect_uri', this.configurationProvider.openIDConfiguration.post_logout_redirect_uri);
        return authorizationEndsessionUrl + "?" + params;
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityService.prototype.getSigningKeys = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @param {?} error
     * @return {?}
     */
    OidcSecurityService.prototype.handleErrorGetSigningKeys = /**
     * @private
     * @param {?} error
     * @return {?}
     */
    function (error) {
        /** @type {?} */
        var errMsg;
        if (error instanceof Response) {
            /** @type {?} */
            var body = error.json() || {};
            /** @type {?} */
            var err = JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.loggerService.logError(errMsg);
        return throwError(errMsg);
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityService.prototype.runTokenValidation = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
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
        var silentRenewHeartBeatCheck = (/**
         * @return {?}
         */
        function () {
            _this.loggerService.logDebug('silentRenewHeartBeatCheck\r\n' +
                ("\tsilentRenewRunning: " + (_this.oidcSecurityCommon.silentRenewRunning === 'running') + "\r\n") +
                ("\tidToken: " + !!_this.getIdToken() + "\r\n") +
                ("\t_userData.value: " + !!_this._userData.value));
            if (_this._userData.value && _this.oidcSecurityCommon.silentRenewRunning !== 'running' && _this.getIdToken()) {
                if (_this.oidcSecurityValidation.isTokenExpired(_this.oidcSecurityCommon.idToken, _this.configurationProvider.openIDConfiguration.silent_renew_offset_in_seconds)) {
                    _this.loggerService.logDebug('IsAuthorized: id_token isTokenExpired, start silent renew if active');
                    if (_this.configurationProvider.openIDConfiguration.silent_renew) {
                        _this.refreshSession().subscribe((/**
                         * @return {?}
                         */
                        function () {
                            _this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
                        }), (/**
                         * @param {?} err
                         * @return {?}
                         */
                        function (err) {
                            _this.loggerService.logError('Error: ' + err);
                            _this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
                        }));
                        /* In this situation, we schedule a heartbeat check only when silentRenew is finished.
                        We don't want to schedule another check so we have to return here */
                        return;
                    }
                    else {
                        _this.resetAuthorizationData(false);
                    }
                }
            }
            /* Delay 3 seconds and do the next check */
            _this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 3000);
        });
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            /* Initial heartbeat check */
            _this._scheduledHeartBeat = setTimeout(silentRenewHeartBeatCheck, 10000);
        }));
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    OidcSecurityService.prototype.silentRenewEventHandler = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.loggerService.logDebug('silentRenewEventHandler');
        if (this.configurationProvider.openIDConfiguration.response_type === 'code') {
            /** @type {?} */
            var urlParts = e.detail.toString().split('?');
            /** @type {?} */
            var params = new HttpParams({
                fromString: urlParts[1],
            });
            /** @type {?} */
            var code = params.get('code');
            /** @type {?} */
            var state = params.get('state');
            /** @type {?} */
            var session_state = params.get('session_state');
            /** @type {?} */
            var error = params.get('error');
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
    };
    OidcSecurityService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityService.ctorParameters = function () { return [
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
    ]; };
    return OidcSecurityService;
}());
var templateObject_1, templateObject_2;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    /**
     * @param {?=} token
     * @return {?}
     */
    AuthModule.forRoot = /**
     * @param {?=} token
     * @return {?}
     */
    function (token) {
        if (token === void 0) { token = {}; }
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
    };
    AuthModule.decorators = [
        { type: NgModule }
    ];
    return AuthModule;
}());

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