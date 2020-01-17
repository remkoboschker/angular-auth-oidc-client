/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of, Subject, throwError, timer } from 'rxjs';
import { catchError, filter, map, race, shareReplay, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { OidcDataService } from '../data-services/oidc-data.service';
import { AuthorizationResult } from '../models/authorization-result';
import { AuthorizationState } from '../models/authorization-state.enum';
import { ValidateStateResult } from '../models/validate-state-result.model';
import { ValidationResult } from '../models/validation-result.enum';
import { ConfigurationProvider } from './auth-configuration.provider';
import { StateValidationService } from './oidc-security-state-validation.service';
import { TokenHelperService } from './oidc-token-helper.service';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCheckSession } from './oidc.security.check-session';
import { OidcSecurityCommon } from './oidc.security.common';
import { OidcSecuritySilentRenew } from './oidc.security.silent-renew';
import { OidcSecurityUserService } from './oidc.security.user-service';
import { OidcSecurityValidation } from './oidc.security.validation';
import { UriEncoder } from './uri-encoder';
import { UrlParserService } from './url-parser.service';
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
        var data = "grant_type=refresh_token&client_id=" + this.configurationProvider.openIDConfiguration.client_id + ("&refresh_token=" + code);
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
        var data = "grant_type=authorization_code&client_id=" + this.configurationProvider.openIDConfiguration.client_id + "\n            &code_verifier=" + this.oidcSecurityCommon.code_verifier + "\n            &code=" + code + "&redirect_uri=" + this.configurationProvider.openIDConfiguration.redirect_url;
        if (this.oidcSecurityCommon.silentRenewRunning === 'running') {
            data = "grant_type=authorization_code&client_id=" + this.configurationProvider.openIDConfiguration.client_id + "\n                &code_verifier=" + this.oidcSecurityCommon.code_verifier + "\n                &code=" + code + "\n                &redirect_uri=" + this.configurationProvider.openIDConfiguration.silent_renew_url;
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
export { OidcSecurityService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._onModuleSetup;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._onCheckSessionChanged;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._onAuthorizationResult;
    /** @type {?} */
    OidcSecurityService.prototype.checkSessionChanged;
    /** @type {?} */
    OidcSecurityService.prototype.moduleSetup;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._isModuleSetup;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._isAuthorized;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._isSetupAndAuthorized;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._userData;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.authWellKnownEndpointsLoaded;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.runTokenValidationRunning;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype._scheduledHeartBeat;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.boundSilentRenewEvent;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcDataService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.stateValidationService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.router;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcSecurityCheckSession;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcSecuritySilentRenew;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcSecurityUserService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcSecurityCommon;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.oidcSecurityValidation;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.tokenHelperService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.loggerService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.httpClient;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.configurationProvider;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityService.prototype.urlParserService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDekYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0csT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZC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RCwrQ0FBbUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgZnJvbSwgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QsIHRocm93RXJyb3IsIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIGZpbHRlciwgbWFwLCByYWNlLCBzaGFyZVJlcGxheSwgc3dpdGNoTWFwLCBzd2l0Y2hNYXBUbywgdGFrZSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBPaWRjRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhLXNlcnZpY2VzL29pZGMtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL21vZGVscy9hdXRoLmNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBBdXRoV2VsbEtub3duRW5kcG9pbnRzIH0gZnJvbSAnLi4vbW9kZWxzL2F1dGgud2VsbC1rbm93bi1lbmRwb2ludHMnO1xyXG5pbXBvcnQgeyBBdXRob3JpemF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vbW9kZWxzL2F1dGhvcml6YXRpb24tcmVzdWx0JztcclxuaW1wb3J0IHsgQXV0aG9yaXphdGlvblN0YXRlIH0gZnJvbSAnLi4vbW9kZWxzL2F1dGhvcml6YXRpb24tc3RhdGUuZW51bSc7XHJcbmltcG9ydCB7IEp3dEtleXMgfSBmcm9tICcuLi9tb2RlbHMvand0a2V5cyc7XHJcbmltcG9ydCB7IFZhbGlkYXRlU3RhdGVSZXN1bHQgfSBmcm9tICcuLi9tb2RlbHMvdmFsaWRhdGUtc3RhdGUtcmVzdWx0Lm1vZGVsJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJy4uL21vZGVscy92YWxpZGF0aW9uLXJlc3VsdC5lbnVtJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLWNvbmZpZ3VyYXRpb24ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBTdGF0ZVZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLXNlY3VyaXR5LXN0YXRlLXZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFRva2VuSGVscGVyU2VydmljZSB9IGZyb20gJy4vb2lkYy10b2tlbi1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL29pZGMubG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24gfSBmcm9tICcuL29pZGMuc2VjdXJpdHkuY2hlY2stc2Vzc2lvbic7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eUNvbW1vbiB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS5jb21tb24nO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlTaWxlbnRSZW5ldyB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS5zaWxlbnQtcmVuZXcnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlVc2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS51c2VyLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LnZhbGlkYXRpb24nO1xyXG5pbXBvcnQgeyBVcmlFbmNvZGVyIH0gZnJvbSAnLi91cmktZW5jb2Rlcic7XHJcbmltcG9ydCB7IFVybFBhcnNlclNlcnZpY2UgfSBmcm9tICcuL3VybC1wYXJzZXIuc2VydmljZSc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogdmFyaWFibGUtbmFtZVxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX29uTW9kdWxlU2V0dXAgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xyXG4gICAgcHJpdmF0ZSBfb25DaGVja1Nlc3Npb25DaGFuZ2VkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcclxuICAgIHByaXZhdGUgX29uQXV0aG9yaXphdGlvblJlc3VsdCA9IG5ldyBTdWJqZWN0PEF1dGhvcml6YXRpb25SZXN1bHQ+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBvbk1vZHVsZVNldHVwKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vbk1vZHVsZVNldHVwLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25BdXRob3JpemF0aW9uUmVzdWx0KCk6IE9ic2VydmFibGU8QXV0aG9yaXphdGlvblJlc3VsdD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNoZWNrU2Vzc2lvbkNoYW5nZWQoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQ2hlY2tTZXNzaW9uQ2hhbmdlZC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ29uZmlndXJhdGlvbkNoYW5nZSgpOiBPYnNlcnZhYmxlPE9wZW5JZENvbmZpZ3VyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub25Db25maWd1cmF0aW9uQ2hhbmdlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBmYWxzZTtcclxuICAgIG1vZHVsZVNldHVwID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNNb2R1bGVTZXR1cCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG5cclxuICAgIHByaXZhdGUgX2lzQXV0aG9yaXplZCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gICAgcHJpdmF0ZSBfaXNTZXR1cEFuZEF1dGhvcml6ZWQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcblxyXG4gICAgcHJpdmF0ZSBfdXNlckRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueT4oJycpO1xyXG4gICAgcHJpdmF0ZSBhdXRoV2VsbEtub3duRW5kcG9pbnRzTG9hZGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NjaGVkdWxlZEhlYXJ0QmVhdDogYW55O1xyXG4gICAgcHJpdmF0ZSBib3VuZFNpbGVudFJlbmV3RXZlbnQ6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIG9pZGNEYXRhU2VydmljZTogT2lkY0RhdGFTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGVWYWxpZGF0aW9uU2VydmljZTogU3RhdGVWYWxpZGF0aW9uU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uOiBPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24sXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlTaWxlbnRSZW5ldzogT2lkY1NlY3VyaXR5U2lsZW50UmVuZXcsXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlVc2VyU2VydmljZTogT2lkY1NlY3VyaXR5VXNlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlDb21tb246IE9pZGNTZWN1cml0eUNvbW1vbixcclxuICAgICAgICBwcml2YXRlIG9pZGNTZWN1cml0eVZhbGlkYXRpb246IE9pZGNTZWN1cml0eVZhbGlkYXRpb24sXHJcbiAgICAgICAgcHJpdmF0ZSB0b2tlbkhlbHBlclNlcnZpY2U6IFRva2VuSGVscGVyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB1cmxQYXJzZXJTZXJ2aWNlOiBVcmxQYXJzZXJTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm9uTW9kdWxlU2V0dXAucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vZHVsZVNldHVwID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faXNNb2R1bGVTZXR1cC5uZXh0KHRydWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1NldHVwQW5kQXV0aG9yaXplZCA9IHRoaXMuX2lzTW9kdWxlU2V0dXAucGlwZShcclxuICAgICAgICAgICAgZmlsdGVyKChpc01vZHVsZVNldHVwOiBib29sZWFuKSA9PiBpc01vZHVsZVNldHVwKSxcclxuICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYElzQXV0aG9yaXplZFJhY2U6IFNpbGVudCBSZW5ldyBOb3QgQWN0aXZlLiBFbWl0dGluZy5gKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnJvbShbdHJ1ZV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhY2UkID0gdGhpcy5faXNBdXRob3JpemVkLmFzT2JzZXJ2YWJsZSgpLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyKChpc0F1dGhvcml6ZWQ6IGJvb2xlYW4pID0+IGlzQXV0aG9yaXplZCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZSgxKSxcclxuICAgICAgICAgICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdJc0F1dGhvcml6ZWRSYWNlOiBFeGlzdGluZyB0b2tlbiBpcyBzdGlsbCBhdXRob3JpemVkLicpKSxcclxuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRlcHJlY2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgcmFjZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0LnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlKDEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwKCgpID0+IHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnSXNBdXRob3JpemVkUmFjZTogU2lsZW50IFJlbmV3IFJlZnJlc2ggU2Vzc2lvbiBDb21wbGV0ZScpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcih0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmlzYXV0aG9yaXplZHJhY2VfdGltZW91dF9pbl9zZWNvbmRzICogMTAwMCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJhY2t1cCwgaWYgbm90aGluZyBoYXBwZW5zIGFmdGVyIFggc2Vjb25kcyBzdG9wIHdhaXRpbmcgYW5kIGVtaXQgKDVzIERlZmF1bHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ0lzQXV0aG9yaXplZFJhY2U6IFRpbWVvdXQgcmVhY2hlZC4gRW1pdHRpbmcuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1NpbGVudCBSZW5ldyBpcyBhY3RpdmUsIGNoZWNrIGlmIHRva2VuIGluIHN0b3JhZ2UgaXMgYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID09PSAnJyB8fCB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZ2luIG5vdCBydW5uaW5nLCBvciBhIHNlY29uZCBzaWxlbnQgcmVuZXcsIHVzZXIgbXVzdCBsb2dpbiBmaXJzdCBiZWZvcmUgdGhpcyB3aWxsIHdvcmsuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdTaWxlbnQgUmVuZXcgb3IgbG9naW4gbm90IHJ1bm5pbmcsIHRyeSB0byByZWZyZXNoIHRoZSBzZXNzaW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoU2Vzc2lvbigpLnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByYWNlJDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHRhcCgoKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZFJhY2U6IENvbXBsZXRlZCcpKSxcclxuICAgICAgICAgICAgc3dpdGNoTWFwVG8odGhpcy5faXNBdXRob3JpemVkLmFzT2JzZXJ2YWJsZSgpKSxcclxuICAgICAgICAgICAgdGFwKChpc0F1dGhvcml6ZWQ6IGJvb2xlYW4pID0+IHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgZ2V0SXNBdXRob3JpemVkOiAke2lzQXV0aG9yaXplZH1gKSksXHJcbiAgICAgICAgICAgIHNoYXJlUmVwbGF5KDEpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTZXR1cEFuZEF1dGhvcml6ZWRcclxuICAgICAgICAgICAgLnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RhcnRfY2hlY2tzZXNzaW9uKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShpc1NldHVwQW5kQXV0aG9yaXplZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNTZXR1cEFuZEF1dGhvcml6ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbi5zdGFydENoZWNraW5nU2Vzc2lvbih0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmNsaWVudF9pZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uLnN0b3BDaGVja2luZ1Nlc3Npb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBNb2R1bGUob3BlbklkQ29uZmlndXJhdGlvbjogT3BlbklkQ29uZmlndXJhdGlvbiwgYXV0aFdlbGxLbm93bkVuZHBvaW50czogQXV0aFdlbGxLbm93bkVuZHBvaW50cyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLnNldHVwKG9wZW5JZENvbmZpZ3VyYXRpb24sIGF1dGhXZWxsS25vd25FbmRwb2ludHMpO1xyXG5cclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbi5vbkNoZWNrU2Vzc2lvbkNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdvbkNoZWNrU2Vzc2lvbkNoYW5nZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLm5leHQodGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi51c2VyRGF0YTtcclxuICAgICAgICBpZiAodXNlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyRGF0YSh1c2VyRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpc0F1dGhvcml6ZWQgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pc0F1dGhvcml6ZWQ7XHJcbiAgICAgICAgaWYgKGlzQXV0aG9yaXplZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZCBzZXR1cCBtb2R1bGUnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW4pO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24uaXNUb2tlbkV4cGlyZWQoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaWRUb2tlbiB8fCB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbixcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ld19vZmZzZXRfaW5fc2Vjb25kc1xyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnSXNBdXRob3JpemVkIHNldHVwIG1vZHVsZTsgaWRfdG9rZW4gaXNUb2tlbkV4cGlyZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnSXNBdXRob3JpemVkIHNldHVwIG1vZHVsZTsgaWRfdG9rZW4gaXMgdmFsaWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SXNBdXRob3JpemVkKGlzQXV0aG9yaXplZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnU1RTIHNlcnZlcjogJyArIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25Nb2R1bGVTZXR1cC5uZXh0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ldykge1xyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eVNpbGVudFJlbmV3LmluaXRSZW5ldygpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3VwcG9ydCBhdXRob3JpemF0aW9uIHZpYSBET00gZXZlbnRzLlxyXG4gICAgICAgICAgICAvLyBEZXJlZ2lzdGVyIGlmIE9pZGNTZWN1cml0eVNlcnZpY2Uuc2V0dXBNb2R1bGUgaXMgY2FsbGVkIGFnYWluIGJ5IGFueSBpbnN0YW5jZS5cclxuICAgICAgICAgICAgLy8gICAgICBXZSBvbmx5IGV2ZXIgd2FudCB0aGUgbGF0ZXN0IHNldHVwIHNlcnZpY2UgdG8gYmUgcmVhY3RpbmcgdG8gdGhpcyBldmVudC5cclxuICAgICAgICAgICAgdGhpcy5ib3VuZFNpbGVudFJlbmV3RXZlbnQgPSB0aGlzLnNpbGVudFJlbmV3RXZlbnRIYW5kbGVyLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZUlkID0gTWF0aC5yYW5kb20oKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kU2lsZW50UmVuZXdJbml0RXZlbnQ6IGFueSA9ICgoZTogQ3VzdG9tRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmRldGFpbCAhPT0gaW5zdGFuY2VJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvaWRjLXNpbGVudC1yZW5ldy1tZXNzYWdlJywgdGhpcy5ib3VuZFNpbGVudFJlbmV3RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvaWRjLXNpbGVudC1yZW5ldy1pbml0JywgYm91bmRTaWxlbnRSZW5ld0luaXRFdmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2lkYy1zaWxlbnQtcmVuZXctaW5pdCcsIGJvdW5kU2lsZW50UmVuZXdJbml0RXZlbnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29pZGMtc2lsZW50LXJlbmV3LW1lc3NhZ2UnLCB0aGlzLmJvdW5kU2lsZW50UmVuZXdFdmVudCwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ29pZGMtc2lsZW50LXJlbmV3LWluaXQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBpbnN0YW5jZUlkLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXNlckRhdGE8VCA9IGFueT4oKTogT2JzZXJ2YWJsZTxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJEYXRhLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzTW9kdWxlU2V0dXAoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzTW9kdWxlU2V0dXAuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXNBdXRob3JpemVkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1NldHVwQW5kQXV0aG9yaXplZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUb2tlbigpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNBdXRob3JpemVkLmdldFZhbHVlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5nZXRBY2Nlc3NUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodG9rZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElkVG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXV0aG9yaXplZC5nZXRWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0SWRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQodG9rZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJlZnJlc2hUb2tlbigpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNBdXRob3JpemVkLmdldFZhbHVlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5nZXRSZWZyZXNoVG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXlsb2FkRnJvbUlkVG9rZW4oZW5jb2RlID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5nZXRJZFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4odG9rZW4sIGVuY29kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3RhdGUoc3RhdGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wgPSBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTdGF0ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1c3RvbVJlcXVlc3RQYXJhbWV0ZXJzKHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pIHtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jdXN0b21SZXF1ZXN0UGFyYW1zID0gcGFyYW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvZGUgRmxvdyB3aXRoIFBDS0Ugb3IgSW1wbGljaXQgRmxvd1xyXG4gICAgYXV0aG9yaXplKHVybEhhbmRsZXI/OiAodXJsOiBzdHJpbmcpID0+IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgdGhpcy5hdXRoV2VsbEtub3duRW5kcG9pbnRzTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5hdXRoV2VsbEtub3duRW5kcG9pbnRzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignV2VsbCBrbm93biBlbmRwb2ludHMgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIHVzZXIgY2FuIGxvZ2luIScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5jb25maWdfdmFsaWRhdGVfcmVzcG9uc2VfdHlwZSh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUpKSB7XHJcbiAgICAgICAgICAgIC8vIGludmFsaWQgcmVzcG9uc2VfdHlwZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIEF1dGhvcml6ZSBDb2RlIEZsb3csIG5vIGF1dGggZGF0YScpO1xyXG5cclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sO1xyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSBEYXRlLm5vdygpICsgJycgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbCA9IHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm9uY2UgPSAnTicgKyBNYXRoLnJhbmRvbSgpICsgJycgKyBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9IG5vbmNlO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQXV0aG9yaXplZENvbnRyb2xsZXIgY3JlYXRlZC4gbG9jYWwgc3RhdGU6ICcgKyB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sKTtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9ICcnO1xyXG4gICAgICAgIC8vIENvZGUgRmxvd1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUgPT09ICdjb2RlJykge1xyXG4gICAgICAgICAgICAvLyBjb2RlX2NoYWxsZW5nZSB3aXRoIFwiUzI1NlwiXHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVfdmVyaWZpZXIgPSAnQycgKyBNYXRoLnJhbmRvbSgpICsgJycgKyBEYXRlLm5vdygpICsgJycgKyBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgY29uc3QgY29kZV9jaGFsbGVuZ2UgPSB0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24uZ2VuZXJhdGVfY29kZV92ZXJpZmllcihjb2RlX3ZlcmlmaWVyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmNvZGVfdmVyaWZpZXIgPSBjb2RlX3ZlcmlmaWVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gdGhpcy5jcmVhdGVBdXRob3JpemVVcmwoXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlX2NoYWxsZW5nZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlZGlyZWN0X3VybCxcclxuICAgICAgICAgICAgICAgICAgICBub25jZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuYXV0aG9yaXphdGlvbl9lbmRwb2ludCB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEltcGxpY2l0IEZsb3dcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVkaXJlY3RfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5hdXRob3JpemF0aW9uX2VuZHBvaW50IHx8ICcnXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXJsSGFuZGxlcikge1xyXG4gICAgICAgICAgICB1cmxIYW5kbGVyKHVybCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZWRpcmVjdFRvKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENvZGUgRmxvd1xyXG4gICAgYXV0aG9yaXplZENhbGxiYWNrV2l0aENvZGUodXJsVG9DaGVjazogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpemVkQ2FsbGJhY2tXaXRoQ29kZSQodXJsVG9DaGVjaykuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICBhdXRob3JpemVkQ2FsbGJhY2tXaXRoQ29kZSQodXJsVG9DaGVjazogc3RyaW5nKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMudXJsUGFyc2VyU2VydmljZS5nZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjaywgJ2NvZGUnKTtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudXJsUGFyc2VyU2VydmljZS5nZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjaywgJ3N0YXRlJyk7XHJcbiAgICAgICAgY29uc3Qgc2Vzc2lvblN0YXRlID0gdGhpcy51cmxQYXJzZXJTZXJ2aWNlLmdldFVybFBhcmFtZXRlcih1cmxUb0NoZWNrLCAnc2Vzc2lvbl9zdGF0ZScpIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghc3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdubyBzdGF0ZSBpbiB1cmwnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9mKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY29kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ25vIGNvZGUgaW4gdXJsJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvZigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3J1bm5pbmcgdmFsaWRhdGlvbiBmb3IgY2FsbGJhY2snICsgdXJsVG9DaGVjayk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdFRva2Vuc1dpdGhDb2RlJChjb2RlLCBzdGF0ZSwgc2Vzc2lvblN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3dcclxuICAgIHJlcXVlc3RUb2tlbnNXaXRoQ29kZShjb2RlOiBzdHJpbmcsIHN0YXRlOiBzdHJpbmcsIHNlc3Npb25TdGF0ZTogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVxdWVzdFRva2Vuc1dpdGhDb2RlJChjb2RlLCBzdGF0ZSwgc2Vzc2lvblN0YXRlKS5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGUkKGNvZGU6IHN0cmluZywgc3RhdGU6IHN0cmluZywgc2Vzc2lvblN0YXRlOiBzdHJpbmcgfCBudWxsKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzTW9kdWxlU2V0dXAucGlwZShcclxuICAgICAgICAgICAgZmlsdGVyKGlzTW9kdWxlU2V0dXAgPT4gISFpc01vZHVsZVNldHVwKSxcclxuICAgICAgICAgICAgdGFrZSgxKSxcclxuICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZSQoY29kZSwgc3RhdGUsIHNlc3Npb25TdGF0ZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZWZyZXNoIFRva2VuXHJcbiAgICByZWZyZXNoVG9rZW5zV2l0aENvZGVQcm9jZWR1cmUoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICBsZXQgdG9rZW5SZXF1ZXN0VXJsID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cyAmJiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMudG9rZW5fZW5kcG9pbnQpIHtcclxuICAgICAgICAgICAgdG9rZW5SZXF1ZXN0VXJsID0gYCR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLnRva2VuX2VuZHBvaW50fWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGBncmFudF90eXBlPXJlZnJlc2hfdG9rZW4mY2xpZW50X2lkPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWR9YCArIGAmcmVmcmVzaF90b2tlbj0ke2NvZGV9YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cENsaWVudC5wb3N0KHRva2VuUmVxdWVzdFVybCwgZGF0YSwgeyBoZWFkZXJzIH0pLnBpcGUoXHJcbiAgICAgICAgICAgIG1hcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3Rva2VuIHJlZnJlc2ggcmVzcG9uc2U6ICcgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgb2JqID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICBvYmouc3RhdGUgPSBzdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvcml6ZWRDb2RlRmxvd0NhbGxiYWNrUHJvY2VkdXJlKG9iaik7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYE9pZGNTZXJ2aWNlIGNvZGUgcmVxdWVzdCAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyfWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZShjb2RlOiBzdHJpbmcsIHN0YXRlOiBzdHJpbmcsIHNlc3Npb25fc3RhdGU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZSQoY29kZSwgc3RhdGUsIHNlc3Npb25fc3RhdGUpLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvZGUgRmxvdyB3aXRoIFBDS0VcclxuICAgIHJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZSQoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nLCBzZXNzaW9uX3N0YXRlOiBzdHJpbmcgfCBudWxsKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHRva2VuUmVxdWVzdFVybCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMgJiYgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLnRva2VuX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgIHRva2VuUmVxdWVzdFVybCA9IGAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24udmFsaWRhdGVTdGF0ZUZyb21IYXNoQ2FsbGJhY2soc3RhdGUsIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2sgaW5jb3JyZWN0IHN0YXRlJyk7XHJcbiAgICAgICAgICAgIC8vIFZhbGlkYXRpb25SZXN1bHQuU3RhdGVzRG9Ob3RNYXRjaDtcclxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IobmV3IEVycm9yKCdpbmNvcnJlY3Qgc3RhdGUnKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaGVhZGVyczogSHR0cEhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBgZ3JhbnRfdHlwZT1hdXRob3JpemF0aW9uX2NvZGUmY2xpZW50X2lkPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWR9XHJcbiAgICAgICAgICAgICZjb2RlX3ZlcmlmaWVyPSR7dGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY29kZV92ZXJpZmllcn1cclxuICAgICAgICAgICAgJmNvZGU9JHtjb2RlfSZyZWRpcmVjdF91cmk9JHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlZGlyZWN0X3VybH1gO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID09PSAncnVubmluZycpIHtcclxuICAgICAgICAgICAgZGF0YSA9IGBncmFudF90eXBlPWF1dGhvcml6YXRpb25fY29kZSZjbGllbnRfaWQ9JHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmNsaWVudF9pZH1cclxuICAgICAgICAgICAgICAgICZjb2RlX3ZlcmlmaWVyPSR7dGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY29kZV92ZXJpZmllcn1cclxuICAgICAgICAgICAgICAgICZjb2RlPSR7Y29kZX1cclxuICAgICAgICAgICAgICAgICZyZWRpcmVjdF91cmk9JHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ld191cmx9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBDbGllbnQucG9zdCh0b2tlblJlcXVlc3RVcmwsIGRhdGEsIHsgaGVhZGVycyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgb2JqID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICBvYmouc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgICAgIG9iai5zZXNzaW9uX3N0YXRlID0gc2Vzc2lvbl9zdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvcml6ZWRDb2RlRmxvd0NhbGxiYWNrUHJvY2VkdXJlKG9iaik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgT2lkY1NlcnZpY2UgY29kZSByZXF1ZXN0ICR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zdHNTZXJ2ZXJ9YCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3dcclxuICAgIHByaXZhdGUgYXV0aG9yaXplZENvZGVGbG93Q2FsbGJhY2tQcm9jZWR1cmUocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBzaWxlbnRSZW5ldyA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZztcclxuICAgICAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHNpbGVudFJlbmV3ID09PSAncnVubmluZyc7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gYXV0aG9yaXplZCBDb2RlIEZsb3cgQ2FsbGJhY2ssIG5vIGF1dGggZGF0YScpO1xyXG4gICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpemVkQ2FsbGJhY2tQcm9jZWR1cmUocmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW1wbGljaXQgRmxvd1xyXG4gICAgcHJpdmF0ZSBhdXRob3JpemVkSW1wbGljaXRGbG93Q2FsbGJhY2tQcm9jZWR1cmUoaGFzaD86IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNpbGVudFJlbmV3ID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nO1xyXG4gICAgICAgIGNvbnN0IGlzUmVuZXdQcm9jZXNzID0gc2lsZW50UmVuZXcgPT09ICdydW5uaW5nJztcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBhdXRob3JpemVkQ2FsbGJhY2ssIG5vIGF1dGggZGF0YScpO1xyXG4gICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShpc1JlbmV3UHJvY2Vzcyk7XHJcblxyXG4gICAgICAgIGhhc2ggPSBoYXNoIHx8IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSBoYXNoLnNwbGl0KCcmJykucmVkdWNlKChyZXN1bHREYXRhOiBhbnksIGl0ZW06IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgcmVzdWx0RGF0YVtwYXJ0cy5zaGlmdCgpIGFzIHN0cmluZ10gPSBwYXJ0cy5qb2luKCc9Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHREYXRhO1xyXG4gICAgICAgIH0sIHt9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRob3JpemVkQ2FsbGJhY2tQcm9jZWR1cmUocmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW1wbGljaXQgRmxvd1xyXG4gICAgYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrKGhhc2g/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pc01vZHVsZVNldHVwXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyKChpc01vZHVsZVNldHVwOiBib29sZWFuKSA9PiBpc01vZHVsZVNldHVwKSxcclxuICAgICAgICAgICAgICAgIHRha2UoMSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrUHJvY2VkdXJlKGhhc2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZGlyZWN0VG8odXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbXBsaWNpdCBGbG93XHJcbiAgICBwcml2YXRlIGF1dGhvcml6ZWRDYWxsYmFja1Byb2NlZHVyZShyZXN1bHQ6IGFueSwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoUmVzdWx0ID0gcmVzdWx0O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uaGlzdG9yeV9jbGVhbnVwX29mZiAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGhpc3RvcnkgdG8gcmVtb3ZlIHRoZSB0b2tlbnNcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCB3aW5kb3cuZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnaGlzdG9yeSBjbGVhbiB1cCBpbmFjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChyZXN1bHQuZXJyb3IgYXMgc3RyaW5nKSA9PT0gJ2xvZ2luX3JlcXVpcmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5Mb2dpblJlcXVpcmVkLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUudW5hdXRob3JpemVkLCBWYWxpZGF0aW9uUmVzdWx0LlNlY3VyZVRva2VuU2VydmVyRXJyb3IsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID0gJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVuYXV0aG9yaXplZF9yb3V0ZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjayBjcmVhdGVkLCBiZWdpbiB0b2tlbiB2YWxpZGF0aW9uJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFNpZ25pbmdLZXlzKCkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgand0S2V5cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IHRoaXMuZ2V0VmFsaWRhdGVkU3RhdGVSZXN1bHQocmVzdWx0LCBqd3RLZXlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb25SZXN1bHQuYXV0aFJlc3BvbnNlSXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF1dGhvcml6YXRpb25EYXRhKHZhbGlkYXRpb25SZXN1bHQuYWNjZXNzX3Rva2VuLCB2YWxpZGF0aW9uUmVzdWx0LmlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5hdXRvX3VzZXJpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFVzZXJpbmZvKGlzUmVuZXdQcm9jZXNzLCByZXN1bHQsIHZhbGlkYXRpb25SZXN1bHQuaWRfdG9rZW4sIHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZF9pZF90b2tlbikuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUuYXV0aG9yaXplZCwgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucG9zdF9sb2dpbl9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udW5hdXRob3JpemVkX3JvdXRlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNvbWV0aGluZyB3ZW50IHdyb25nIHdoaWxlIGdldHRpbmcgc2lnbmluZyBrZXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ0ZhaWxlZCB0byByZXRyZWl2ZSB1c2VyIGluZm8gd2l0aCBlcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGVycikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlckRhdGEgaXMgc2V0IHRvIHRoZSBpZF90b2tlbiBkZWNvZGVkLCBhdXRvIGdldCB1c2VyIGRhdGEgc2V0IHRvIGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5zZXRVc2VyRGF0YSh2YWxpZGF0aW9uUmVzdWx0LmRlY29kZWRfaWRfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS5hdXRob3JpemVkLCB2YWxpZGF0aW9uUmVzdWx0LnN0YXRlLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5wb3N0X2xvZ2luX3JvdXRlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrLCB0b2tlbihzKSB2YWxpZGF0aW9uIGZhaWxlZCwgcmVzZXR0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVuYXV0aG9yaXplZF9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2hpbGUgZ2V0dGluZyBzaWduaW5nIGtleSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdGYWlsZWQgdG8gcmV0cmVpdmUgc2lnaW5nIGtleSB3aXRoIGVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJpbmZvKGlzUmVuZXdQcm9jZXNzID0gZmFsc2UsIHJlc3VsdD86IGFueSwgaWRfdG9rZW4/OiBhbnksIGRlY29kZWRfaWRfdG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgPyByZXN1bHQgOiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoUmVzdWx0O1xyXG4gICAgICAgIGlkX3Rva2VuID0gaWRfdG9rZW4gPyBpZF90b2tlbiA6IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW47XHJcbiAgICAgICAgZGVjb2RlZF9pZF90b2tlbiA9IGRlY29kZWRfaWRfdG9rZW4gPyBkZWNvZGVkX2lkX3Rva2VuIDogdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbihpZF90b2tlbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgICAvLyBmbG93IGlkX3Rva2VuIHRva2VuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVzcG9uc2VfdHlwZSA9PT0gJ2lkX3Rva2VuIHRva2VuJyB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZSdcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZW5ld1Byb2Nlc3MgJiYgdGhpcy5fdXNlckRhdGEudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGUgPSByZXN1bHQuc2Vzc2lvbl9zdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2UuaW5pdFVzZXJEYXRhKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgKGlkX3Rva2VuIHRva2VuIHx8IGNvZGUpIGZsb3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi52YWxpZGF0ZV91c2VyZGF0YV9zdWJfaWRfdG9rZW4oZGVjb2RlZF9pZF90b2tlbi5zdWIsIHVzZXJEYXRhLnN1YikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodXNlckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLm9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNlc3Npb25TdGF0ZSA9IHJlc3VsdC5zZXNzaW9uX3N0YXRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmcsIHVzZXJkYXRhIHN1YiBkb2VzIG5vdCBtYXRjaCB0aGF0IGZyb20gaWRfdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2ssIFVzZXIgZGF0YSBzdWIgZG9lcyBub3QgbWF0Y2ggc3ViIGluIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjaywgdG9rZW4ocykgdmFsaWRhdGlvbiBmYWlsZWQsIHJlc2V0dGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmbG93IGlkX3Rva2VuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpZF90b2tlbiBmbG93Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYWNjZXNzVG9rZW4pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHVzZXJEYXRhIGlzIHNldCB0byB0aGUgaWRfdG9rZW4gZGVjb2RlZC4gTm8gYWNjZXNzX3Rva2VuLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5zZXRVc2VyRGF0YShkZWNvZGVkX2lkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGUgPSByZXN1bHQuc2Vzc2lvbl9zdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb2ZmKHVybEhhbmRsZXI/OiAodXJsOiBzdHJpbmcpID0+IGFueSkge1xyXG4gICAgICAgIC8vIC9jb25uZWN0L2VuZHNlc3Npb24/aWRfdG9rZW5faGludD0uLi4mcG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpPWh0dHBzOi8vbXlhcHAuY29tXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUsIG5vIGF1dGggZGF0YScpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuZW5kX3Nlc3Npb25fZW5kcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZF9zZXNzaW9uX2VuZHBvaW50ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWRfdG9rZW5faGludCA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW47XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmNyZWF0ZUVuZFNlc3Npb25VcmwoZW5kX3Nlc3Npb25fZW5kcG9pbnQsIGlkX3Rva2VuX2hpbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RhcnRfY2hlY2tzZXNzaW9uICYmIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnb25seSBsb2NhbCBsb2dpbiBjbGVhbmVkIHVwLCBzZXJ2ZXIgc2Vzc2lvbiBoYXMgY2hhbmdlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZGlyZWN0VG8odXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ29ubHkgbG9jYWwgbG9naW4gY2xlYW5lZCB1cCwgbm8gZW5kX3Nlc3Npb25fZW5kcG9pbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoU2Vzc2lvbigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIHJlZnJlc2ggc2Vzc2lvbiBBdXRob3JpemUnKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgPSAncnVubmluZyc7XHJcblxyXG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2w7XHJcbiAgICAgICAgaWYgKHN0YXRlID09PSAnJyB8fCBzdGF0ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdGF0ZSA9IERhdGUubm93KCkgKyAnJyArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sID0gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBub25jZSA9ICdOJyArIE1hdGgucmFuZG9tKCkgKyAnJyArIERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID0gbm9uY2U7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdSZWZyZXNoU2Vzc2lvbiBjcmVhdGVkLiBhZGRpbmcgbXlhdXRvc3RhdGU6ICcgKyB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sKTtcclxuXHJcbiAgICAgICAgbGV0IHVybCA9ICcnO1xyXG5cclxuICAgICAgICAvLyBDb2RlIEZsb3dcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udXNlX3JlZnJlc2hfdG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIC8vIHRyeSB1c2luZyByZWZyZXNoIHRva2VuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWZyZXNoX3Rva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0UmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaF90b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnZm91bmQgcmVmcmVzaCBjb2RlLCBvYnRhaW5pbmcgbmV3IGNyZWRlbnRpYWxzIHdpdGggcmVmcmVzaCBjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm9uY2UgaXMgbm90IHVzZWQgd2l0aCByZWZyZXNoIHRva2VuczsgYnV0IEtleWNsb2FrIG1heSBzZW5kIGl0IGFueXdheVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9IE9pZGNTZWN1cml0eVZhbGlkYXRpb24uUmVmcmVzaFRva2VuTm9uY2VQbGFjZWhvbGRlcjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZyZXNoVG9rZW5zV2l0aENvZGVQcm9jZWR1cmUocmVmcmVzaF90b2tlbiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ25vIHJlZnJlc2ggdG9rZW4gZm91bmQsIHVzaW5nIHNpbGVudCByZW5ldycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvZGVfY2hhbGxlbmdlIHdpdGggXCJTMjU2XCJcclxuICAgICAgICAgICAgY29uc3QgY29kZV92ZXJpZmllciA9ICdDJyArIE1hdGgucmFuZG9tKCkgKyAnJyArIERhdGUubm93KCkgKyAnJyArIERhdGUubm93KCkgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2RlX2NoYWxsZW5nZSA9IHRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5nZW5lcmF0ZV9jb2RlX3ZlcmlmaWVyKGNvZGVfdmVyaWZpZXIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY29kZV92ZXJpZmllciA9IGNvZGVfdmVyaWZpZXI7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICAgICAgICAgICAgICB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGVfY2hhbGxlbmdlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3X3VybCxcclxuICAgICAgICAgICAgICAgICAgICBub25jZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuYXV0aG9yaXphdGlvbl9lbmRwb2ludCB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAnbm9uZSdcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3X3VybCxcclxuICAgICAgICAgICAgICAgICAgICBub25jZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuYXV0aG9yaXphdGlvbl9lbmRwb2ludCB8fCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAnbm9uZSdcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY1NlY3VyaXR5U2lsZW50UmVuZXcuc3RhcnRSZW5ldyh1cmwpLnBpcGUobWFwKCgpID0+IHRydWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFcnJvcihlcnJvcjogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2lsZW50UmVuZXcgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmc7XHJcbiAgICAgICAgY29uc3QgaXNSZW5ld1Byb2Nlc3MgPSBzaWxlbnRSZW5ldyA9PT0gJ3J1bm5pbmcnO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAzIHx8IGVycm9yLnN0YXR1cyA9PT0gJzQwMycpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQobmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5Ob3RTZXQsIGlzUmVuZXdQcm9jZXNzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5mb3JiaWRkZW5fcm91dGVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEgfHwgZXJyb3Iuc3RhdHVzID09PSAnNDAxJykge1xyXG4gICAgICAgICAgICBjb25zdCBzaWxlbnRSZW5ld1J1bm5pbmcgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoISFzaWxlbnRSZW5ld1J1bm5pbmcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQobmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5Ob3RTZXQsIGlzUmVuZXdQcm9jZXNzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi51bmF1dGhvcml6ZWRfcm91dGVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGFydENoZWNraW5nU2lsZW50UmVuZXcoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wQ2hlY2tpbmdTaWxlbnRSZW5ldygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0KSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRBdXRob3JpemF0aW9uRGF0YShpc1JlbmV3UHJvY2VzczogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uYXV0b191c2VyaW5mbykge1xyXG4gICAgICAgICAgICAgICAgLy8gQ2xlYXIgdXNlciBkYXRhLiBGaXhlcyAjOTcuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJEYXRhKCcnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24ucmVzZXRTdG9yYWdlRGF0YShpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldElzQXV0aG9yaXplZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEVuZFNlc3Npb25VcmwoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuZW5kX3Nlc3Npb25fZW5kcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZF9zZXNzaW9uX2VuZHBvaW50ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWRfdG9rZW5faGludCA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW47XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbmRTZXNzaW9uVXJsKGVuZF9zZXNzaW9uX2VuZHBvaW50LCBpZF90b2tlbl9oaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFZhbGlkYXRlZFN0YXRlUmVzdWx0KHJlc3VsdDogYW55LCBqd3RLZXlzOiBKd3RLZXlzKTogVmFsaWRhdGVTdGF0ZVJlc3VsdCB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRlU3RhdGVSZXN1bHQoJycsICcnLCBmYWxzZSwge30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVWYWxpZGF0aW9uU2VydmljZS52YWxpZGF0ZVN0YXRlKHJlc3VsdCwgand0S2V5cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRVc2VyRGF0YSh1c2VyRGF0YTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24udXNlckRhdGEgPSB1c2VyRGF0YTtcclxuICAgICAgICB0aGlzLl91c2VyRGF0YS5uZXh0KHVzZXJEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldElzQXV0aG9yaXplZChpc0F1dGhvcml6ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9pc0F1dGhvcml6ZWQubmV4dChpc0F1dGhvcml6ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0QXV0aG9yaXphdGlvbkRhdGEoYWNjZXNzX3Rva2VuOiBhbnksIGlkX3Rva2VuOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYWNjZXNzVG9rZW4gIT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuID0gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoaWRfdG9rZW4pO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnc3RvcmluZyB0byBzdG9yYWdlLCBnZXR0aW5nIHRoZSByb2xlcycpO1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuID0gYWNjZXNzX3Rva2VuO1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW4gPSBpZF90b2tlbjtcclxuICAgICAgICB0aGlzLnNldElzQXV0aG9yaXplZCh0cnVlKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pc0F1dGhvcml6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgIGlzQ29kZUZsb3c6IGJvb2xlYW4sXHJcbiAgICAgICAgY29kZV9jaGFsbGVuZ2U6IHN0cmluZyxcclxuICAgICAgICByZWRpcmVjdF91cmw6IHN0cmluZyxcclxuICAgICAgICBub25jZTogc3RyaW5nLFxyXG4gICAgICAgIHN0YXRlOiBzdHJpbmcsXHJcbiAgICAgICAgYXV0aG9yaXphdGlvbl9lbmRwb2ludDogc3RyaW5nLFxyXG4gICAgICAgIHByb21wdD86IHN0cmluZ1xyXG4gICAgKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCB1cmxQYXJ0cyA9IGF1dGhvcml6YXRpb25fZW5kcG9pbnQuc3BsaXQoJz8nKTtcclxuICAgICAgICBjb25zdCBhdXRob3JpemF0aW9uVXJsID0gdXJsUGFydHNbMF07XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHtcclxuICAgICAgICAgICAgZnJvbVN0cmluZzogdXJsUGFydHNbMV0sXHJcbiAgICAgICAgICAgIGVuY29kZXI6IG5ldyBVcmlFbmNvZGVyKCksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLnNldCgnY2xpZW50X2lkJywgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWQpO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3JlZGlyZWN0X3VyaScsIHJlZGlyZWN0X3VybCk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncmVzcG9uc2VfdHlwZScsIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVzcG9uc2VfdHlwZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc2NvcGUnLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNjb3BlKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdub25jZScsIG5vbmNlKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdzdGF0ZScsIHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQ29kZUZsb3cpIHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnY29kZV9jaGFsbGVuZ2UnLCBjb2RlX2NoYWxsZW5nZSk7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ2NvZGVfY2hhbGxlbmdlX21ldGhvZCcsICdTMjU2Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHJvbXB0KSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Byb21wdCcsIHByb21wdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5oZF9wYXJhbSkge1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdoZCcsIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uaGRfcGFyYW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VzdG9tUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY3VzdG9tUmVxdWVzdFBhcmFtcyk7XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGN1c3RvbVBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKGtleSwgY3VzdG9tUGFyYW1zW2tleV0udG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBgJHthdXRob3JpemF0aW9uVXJsfT8ke3BhcmFtc31gO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRW5kU2Vzc2lvblVybChlbmRfc2Vzc2lvbl9lbmRwb2ludDogc3RyaW5nLCBpZF90b2tlbl9oaW50OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB1cmxQYXJ0cyA9IGVuZF9zZXNzaW9uX2VuZHBvaW50LnNwbGl0KCc/Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGF1dGhvcml6YXRpb25FbmRzZXNzaW9uVXJsID0gdXJsUGFydHNbMF07XHJcblxyXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XHJcbiAgICAgICAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgICAgICAgICBlbmNvZGVyOiBuZXcgVXJpRW5jb2RlcigpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2lkX3Rva2VuX2hpbnQnLCBpZF90b2tlbl9oaW50KTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdwb3N0X2xvZ291dF9yZWRpcmVjdF91cmknLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnBvc3RfbG9nb3V0X3JlZGlyZWN0X3VyaSk7XHJcblxyXG4gICAgICAgIHJldHVybiBgJHthdXRob3JpemF0aW9uRW5kc2Vzc2lvblVybH0/JHtwYXJhbXN9YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNpZ25pbmdLZXlzKCk6IE9ic2VydmFibGU8Snd0S2V5cz4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdqd2tzX3VyaTogJyArIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5qd2tzX3VyaSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vaWRjRGF0YVNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5nZXQ8Snd0S2V5cz4odGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmp3a3NfdXJpIHx8ICcnKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUoY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yR2V0U2lnbmluZ0tleXMpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnZ2V0U2lnbmluZ0tleXM6IGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjRGF0YVNlcnZpY2UuZ2V0PEp3dEtleXM+KCd1bmRlZmluZWQnKS5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvckdldFNpZ25pbmdLZXlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVFcnJvckdldFNpZ25pbmdLZXlzKGVycm9yOiBSZXNwb25zZSB8IGFueSkge1xyXG4gICAgICAgIGxldCBlcnJNc2c6IHN0cmluZztcclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gZXJyb3IuanNvbigpIHx8IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBlcnIgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcclxuICAgICAgICAgICAgZXJyTXNnID0gYCR7ZXJyb3Iuc3RhdHVzfSAtICR7ZXJyb3Iuc3RhdHVzVGV4dCB8fCAnJ30gJHtlcnJ9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJNc2cgPSBlcnJvci5tZXNzYWdlID8gZXJyb3IubWVzc2FnZSA6IGVycm9yLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJNc2cpO1xyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVyck1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5Ub2tlblZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uUnVubmluZyB8fCAhdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygncnVuVG9rZW5WYWxpZGF0aW9uIHNpbGVudC1yZW5ldyBydW5uaW5nJyk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICAgRmlyc3QgdGltZTogZGVsYXkgMTAgc2Vjb25kcyB0byBjYWxsIHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2tcclxuICAgICAgICAgKiAgIEFmdGVyd2FyZHM6IFJ1biB0aGlzIGNoZWNrIGluIGEgNSBzZWNvbmQgaW50ZXJ2YWwgb25seSBBRlRFUiB0aGUgcHJldmlvdXMgb3BlcmF0aW9uIGVuZHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3Qgc2lsZW50UmVuZXdIZWFydEJlYXRDaGVjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKFxyXG4gICAgICAgICAgICAgICAgJ3NpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2tcXHJcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICBgXFx0c2lsZW50UmVuZXdSdW5uaW5nOiAke3RoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyA9PT0gJ3J1bm5pbmcnfVxcclxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBcXHRpZFRva2VuOiAkeyEhdGhpcy5nZXRJZFRva2VuKCl9XFxyXFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYFxcdF91c2VyRGF0YS52YWx1ZTogJHshIXRoaXMuX3VzZXJEYXRhLnZhbHVlfWBcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VzZXJEYXRhLnZhbHVlICYmIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyAhPT0gJ3J1bm5pbmcnICYmIHRoaXMuZ2V0SWRUb2tlbigpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmlzVG9rZW5FeHBpcmVkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ld19vZmZzZXRfaW5fc2Vjb25kc1xyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnSXNBdXRob3JpemVkOiBpZF90b2tlbiBpc1Rva2VuRXhwaXJlZCwgc3RhcnQgc2lsZW50IHJlbmV3IGlmIGFjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoU2Vzc2lvbigpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignRXJyb3I6ICcgKyBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlZEhlYXJ0QmVhdCA9IHNldFRpbWVvdXQoc2lsZW50UmVuZXdIZWFydEJlYXRDaGVjaywgMzAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIHRoaXMgc2l0dWF0aW9uLCB3ZSBzY2hlZHVsZSBhIGhlYXJ0YmVhdCBjaGVjayBvbmx5IHdoZW4gc2lsZW50UmVuZXcgaXMgZmluaXNoZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdlIGRvbid0IHdhbnQgdG8gc2NoZWR1bGUgYW5vdGhlciBjaGVjayBzbyB3ZSBoYXZlIHRvIHJldHVybiBoZXJlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogRGVsYXkgMyBzZWNvbmRzIGFuZCBkbyB0aGUgbmV4dCBjaGVjayAqL1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDMwMDApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qIEluaXRpYWwgaGVhcnRiZWF0IGNoZWNrICovXHJcbiAgICAgICAgICAgIHRoaXMuX3NjaGVkdWxlZEhlYXJ0QmVhdCA9IHNldFRpbWVvdXQoc2lsZW50UmVuZXdIZWFydEJlYXRDaGVjaywgMTAwMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2lsZW50UmVuZXdFdmVudEhhbmRsZXIoZTogQ3VzdG9tRXZlbnQpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3NpbGVudFJlbmV3RXZlbnRIYW5kbGVyJyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUgPT09ICdjb2RlJykge1xyXG4gICAgICAgICAgICBjb25zdCB1cmxQYXJ0cyA9IGUuZGV0YWlsLnRvU3RyaW5nKCkuc3BsaXQoJz8nKTtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoe1xyXG4gICAgICAgICAgICAgICAgZnJvbVN0cmluZzogdXJsUGFydHNbMV0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBjb2RlID0gcGFyYW1zLmdldCgnY29kZScpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHBhcmFtcy5nZXQoJ3N0YXRlJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25fc3RhdGUgPSBwYXJhbXMuZ2V0KCdzZXNzaW9uX3N0YXRlJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gcGFyYW1zLmdldCgnZXJyb3InKTtcclxuICAgICAgICAgICAgaWYgKGNvZGUgJiYgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFRva2Vuc1dpdGhDb2RlUHJvY2VkdXJlKGNvZGUsIHN0YXRlLCBzZXNzaW9uX3N0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIFZhbGlkYXRpb25SZXN1bHQuTG9naW5SZXF1aXJlZCwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGUuZGV0YWlsLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW1wbGljaXRGbG93XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrKGUuZGV0YWlsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19