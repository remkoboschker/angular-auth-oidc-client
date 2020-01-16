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
            function () { return _this.loggerService.logDebug('IsAuthorizedRace: Existing token is still authorized.'); })), race(_this._onAuthorizationResult.pipe(take(1), tap((/**
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
        var data = "grant_type=authorization_code&client_id=" + this.configurationProvider.openIDConfiguration.client_id +
            ("&code_verifier=" + this.oidcSecurityCommon.code_verifier + "&code=" + code + "&redirect_uri=" + this.configurationProvider.openIDConfiguration.redirect_url);
        if (this.oidcSecurityCommon.silentRenewRunning === 'running') {
            data =
                "grant_type=authorization_code&client_id=" + this.configurationProvider.openIDConfiguration.client_id +
                    ("&code_verifier=" + this.oidcSecurityCommon.code_verifier + "&code=" + code + "&redirect_uri=" + this.configurationProvider.openIDConfiguration.silent_renew_url);
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
        this.oidcSecurityCommon.silentRenewRunning = 'running';
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
            var silentRenew_1 = this.oidcSecurityCommon.silentRenewRunning;
            this.resetAuthorizationData(!!silentRenew_1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDekYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0csT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZC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Ozs7O0lBQzdELCtDQUFtRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBmcm9tLCBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCwgdGhyb3dFcnJvciwgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZmlsdGVyLCBtYXAsIHJhY2UsIHNoYXJlUmVwbGF5LCBzd2l0Y2hNYXAsIHN3aXRjaE1hcFRvLCB0YWtlLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE9pZGNEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGEtc2VydmljZXMvb2lkYy1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL2F1dGguY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7IEF1dGhXZWxsS25vd25FbmRwb2ludHMgfSBmcm9tICcuLi9tb2RlbHMvYXV0aC53ZWxsLWtub3duLWVuZHBvaW50cyc7XHJcbmltcG9ydCB7IEF1dGhvcml6YXRpb25SZXN1bHQgfSBmcm9tICcuLi9tb2RlbHMvYXV0aG9yaXphdGlvbi1yZXN1bHQnO1xyXG5pbXBvcnQgeyBBdXRob3JpemF0aW9uU3RhdGUgfSBmcm9tICcuLi9tb2RlbHMvYXV0aG9yaXphdGlvbi1zdGF0ZS5lbnVtJztcclxuaW1wb3J0IHsgSnd0S2V5cyB9IGZyb20gJy4uL21vZGVscy9qd3RrZXlzJztcclxuaW1wb3J0IHsgVmFsaWRhdGVTdGF0ZVJlc3VsdCB9IGZyb20gJy4uL21vZGVscy92YWxpZGF0ZS1zdGF0ZS1yZXN1bHQubW9kZWwnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uUmVzdWx0IH0gZnJvbSAnLi4vbW9kZWxzL3ZhbGlkYXRpb24tcmVzdWx0LmVudW0nO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgtY29uZmlndXJhdGlvbi5wcm92aWRlcic7XHJcbmltcG9ydCB7IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuL29pZGMtc2VjdXJpdHktc3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLXRva2VuLWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbiB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS5jaGVjay1zZXNzaW9uJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNvbW1vbic7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eVNpbGVudFJlbmV3IH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LnNpbGVudC1yZW5ldyc7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LnVzZXItc2VydmljZSc7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eVZhbGlkYXRpb24gfSBmcm9tICcuL29pZGMuc2VjdXJpdHkudmFsaWRhdGlvbic7XHJcbmltcG9ydCB7IFVyaUVuY29kZXIgfSBmcm9tICcuL3VyaS1lbmNvZGVyJztcclxuaW1wb3J0IHsgVXJsUGFyc2VyU2VydmljZSB9IGZyb20gJy4vdXJsLXBhcnNlci5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE9pZGNTZWN1cml0eVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfb25Nb2R1bGVTZXR1cCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcbiAgICBwcml2YXRlIF9vbkNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xyXG4gICAgcHJpdmF0ZSBfb25BdXRob3JpemF0aW9uUmVzdWx0ID0gbmV3IFN1YmplY3Q8QXV0aG9yaXphdGlvblJlc3VsdD4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uTW9kdWxlU2V0dXAoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTW9kdWxlU2V0dXAuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkF1dGhvcml6YXRpb25SZXN1bHQoKTogT2JzZXJ2YWJsZTxBdXRob3JpemF0aW9uUmVzdWx0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ2hlY2tTZXNzaW9uQ2hhbmdlZCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db25maWd1cmF0aW9uQ2hhbmdlKCk6IE9ic2VydmFibGU8T3BlbklkQ29uZmlndXJhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vbkNvbmZpZ3VyYXRpb25DaGFuZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tTZXNzaW9uQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgbW9kdWxlU2V0dXAgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9pc01vZHVsZVNldHVwID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaXNBdXRob3JpemVkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XHJcbiAgICBwcml2YXRlIF9pc1NldHVwQW5kQXV0aG9yaXplZDogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuXHJcbiAgICBwcml2YXRlIF91c2VyRGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PignJyk7XHJcbiAgICBwcml2YXRlIGF1dGhXZWxsS25vd25FbmRwb2ludHNMb2FkZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcnVuVG9rZW5WYWxpZGF0aW9uUnVubmluZyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfc2NoZWR1bGVkSGVhcnRCZWF0OiBhbnk7XHJcbiAgICBwcml2YXRlIGJvdW5kU2lsZW50UmVuZXdFdmVudDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgb2lkY0RhdGFTZXJ2aWNlOiBPaWRjRGF0YVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0ZVZhbGlkYXRpb25TZXJ2aWNlOiBTdGF0ZVZhbGlkYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlDaGVja1Nlc3Npb246IE9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbixcclxuICAgICAgICBwcml2YXRlIG9pZGNTZWN1cml0eVNpbGVudFJlbmV3OiBPaWRjU2VjdXJpdHlTaWxlbnRSZW5ldyxcclxuICAgICAgICBwcml2YXRlIG9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlOiBPaWRjU2VjdXJpdHlVc2VyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIG9pZGNTZWN1cml0eUNvbW1vbjogT2lkY1NlY3VyaXR5Q29tbW9uLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5VmFsaWRhdGlvbjogT2lkY1NlY3VyaXR5VmFsaWRhdGlvbixcclxuICAgICAgICBwcml2YXRlIHRva2VuSGVscGVyU2VydmljZTogVG9rZW5IZWxwZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGh0dHBDbGllbnQ6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHVybFBhcnNlclNlcnZpY2U6IFVybFBhcnNlclNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMub25Nb2R1bGVTZXR1cC5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kdWxlU2V0dXAgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vZHVsZVNldHVwLm5leHQodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzU2V0dXBBbmRBdXRob3JpemVkID0gdGhpcy5faXNNb2R1bGVTZXR1cC5waXBlKFxyXG4gICAgICAgICAgICBmaWx0ZXIoKGlzTW9kdWxlU2V0dXA6IGJvb2xlYW4pID0+IGlzTW9kdWxlU2V0dXApLFxyXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgSXNBdXRob3JpemVkUmFjZTogU2lsZW50IFJlbmV3IE5vdCBBY3RpdmUuIEVtaXR0aW5nLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcm9tKFt0cnVlXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFjZSQgPSB0aGlzLl9pc0F1dGhvcml6ZWQuYXNPYnNlcnZhYmxlKCkucGlwZShcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoKGlzQXV0aG9yaXplZDogYm9vbGVhbikgPT4gaXNBdXRob3JpemVkKSxcclxuICAgICAgICAgICAgICAgICAgICB0YWtlKDEpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcCgoKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZFJhY2U6IEV4aXN0aW5nIHRva2VuIGlzIHN0aWxsIGF1dGhvcml6ZWQuJykpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZSgxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcCgoKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZFJhY2U6IFNpbGVudCBSZW5ldyBSZWZyZXNoIFNlc3Npb24gQ29tcGxldGUnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAoKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5pc2F1dGhvcml6ZWRyYWNlX3RpbWVvdXRfaW5fc2Vjb25kcyAqIDEwMDApLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYWNrdXAsIGlmIG5vdGhpbmcgaGFwcGVucyBhZnRlciBYIHNlY29uZHMgc3RvcCB3YWl0aW5nIGFuZCBlbWl0ICg1cyBEZWZhdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdJc0F1dGhvcml6ZWRSYWNlOiBUaW1lb3V0IHJlYWNoZWQuIEVtaXR0aW5nLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAoKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdTaWxlbnQgUmVuZXcgaXMgYWN0aXZlLCBjaGVjayBpZiB0b2tlbiBpbiBzdG9yYWdlIGlzIGFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9PT0gJycgfHwgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2dpbiBub3QgcnVubmluZywgb3IgYSBzZWNvbmQgc2lsZW50IHJlbmV3LCB1c2VyIG11c3QgbG9naW4gZmlyc3QgYmVmb3JlIHRoaXMgd2lsbCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnU2lsZW50IFJlbmV3IG9yIGxvZ2luIG5vdCBydW5uaW5nLCB0cnkgdG8gcmVmcmVzaCB0aGUgc2Vzc2lvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb24oKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFjZSQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdJc0F1dGhvcml6ZWRSYWNlOiBDb21wbGV0ZWQnKSksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcFRvKHRoaXMuX2lzQXV0aG9yaXplZC5hc09ic2VydmFibGUoKSksXHJcbiAgICAgICAgICAgIHRhcCgoaXNBdXRob3JpemVkOiBib29sZWFuKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYGdldElzQXV0aG9yaXplZDogJHtpc0F1dGhvcml6ZWR9YCkpLFxyXG4gICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzU2V0dXBBbmRBdXRob3JpemVkXHJcbiAgICAgICAgICAgIC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0YXJ0X2NoZWNrc2Vzc2lvbikpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoaXNTZXR1cEFuZEF1dGhvcml6ZWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU2V0dXBBbmRBdXRob3JpemVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24uc3RhcnRDaGVja2luZ1Nlc3Npb24odGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbi5zdG9wQ2hlY2tpbmdTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwTW9kdWxlKG9wZW5JZENvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIGF1dGhXZWxsS25vd25FbmRwb2ludHM6IEF1dGhXZWxsS25vd25FbmRwb2ludHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5zZXR1cChvcGVuSWRDb25maWd1cmF0aW9uLCBhdXRoV2VsbEtub3duRW5kcG9pbnRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24ub25DaGVja1Nlc3Npb25DaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnb25DaGVja1Nlc3Npb25DaGFuZ2VkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQ2hlY2tTZXNzaW9uQ2hhbmdlZC5uZXh0KHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24udXNlckRhdGE7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodXNlckRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaXNBdXRob3JpemVkID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaXNBdXRob3JpemVkO1xyXG4gICAgICAgIGlmIChpc0F1dGhvcml6ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdJc0F1dGhvcml6ZWQgc2V0dXAgbW9kdWxlJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmlzVG9rZW5FeHBpcmVkKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW4gfHwgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYWNjZXNzVG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfb2Zmc2V0X2luX3NlY29uZHNcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZCBzZXR1cCBtb2R1bGU7IGlkX3Rva2VuIGlzVG9rZW5FeHBpcmVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZCBzZXR1cCBtb2R1bGU7IGlkX3Rva2VuIGlzIHZhbGlkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldElzQXV0aG9yaXplZChpc0F1dGhvcml6ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1NUUyBzZXJ2ZXI6ICcgKyB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX29uTW9kdWxlU2V0dXAubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlTaWxlbnRSZW5ldy5pbml0UmVuZXcoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgYXV0aG9yaXphdGlvbiB2aWEgRE9NIGV2ZW50cy5cclxuICAgICAgICAgICAgLy8gRGVyZWdpc3RlciBpZiBPaWRjU2VjdXJpdHlTZXJ2aWNlLnNldHVwTW9kdWxlIGlzIGNhbGxlZCBhZ2FpbiBieSBhbnkgaW5zdGFuY2UuXHJcbiAgICAgICAgICAgIC8vICAgICAgV2Ugb25seSBldmVyIHdhbnQgdGhlIGxhdGVzdCBzZXR1cCBzZXJ2aWNlIHRvIGJlIHJlYWN0aW5nIHRvIHRoaXMgZXZlbnQuXHJcbiAgICAgICAgICAgIHRoaXMuYm91bmRTaWxlbnRSZW5ld0V2ZW50ID0gdGhpcy5zaWxlbnRSZW5ld0V2ZW50SGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VJZCA9IE1hdGgucmFuZG9tKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3VuZFNpbGVudFJlbmV3SW5pdEV2ZW50OiBhbnkgPSAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5kZXRhaWwgIT09IGluc3RhbmNlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2lkYy1zaWxlbnQtcmVuZXctbWVzc2FnZScsIHRoaXMuYm91bmRTaWxlbnRSZW5ld0V2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2lkYy1zaWxlbnQtcmVuZXctaW5pdCcsIGJvdW5kU2lsZW50UmVuZXdJbml0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29pZGMtc2lsZW50LXJlbmV3LWluaXQnLCBib3VuZFNpbGVudFJlbmV3SW5pdEV2ZW50LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvaWRjLXNpbGVudC1yZW5ldy1tZXNzYWdlJywgdGhpcy5ib3VuZFNpbGVudFJlbmV3RXZlbnQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdvaWRjLXNpbGVudC1yZW5ldy1pbml0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogaW5zdGFuY2VJZCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJEYXRhPFQgPSBhbnk+KCk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyRGF0YS5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJc01vZHVsZVNldHVwKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc01vZHVsZVNldHVwLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzQXV0aG9yaXplZCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTZXR1cEFuZEF1dGhvcml6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXV0aG9yaXplZC5nZXRWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0QWNjZXNzVG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0F1dGhvcml6ZWQuZ2V0VmFsdWUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmdldElkVG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXV0aG9yaXplZC5nZXRWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0UmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF5bG9hZEZyb21JZFRva2VuKGVuY29kZSA9IGZhbHNlKTogYW55IHtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuZ2V0SWRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBlbmNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YXRlKHN0YXRlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RhdGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXN0b21SZXF1ZXN0UGFyYW1ldGVycyhwYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY3VzdG9tUmVxdWVzdFBhcmFtcyA9IHBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3cgd2l0aCBQQ0tFIG9yIEltcGxpY2l0IEZsb3dcclxuICAgIGF1dGhvcml6ZSh1cmxIYW5kbGVyPzogKHVybDogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50c0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50c0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ1dlbGwga25vd24gZW5kcG9pbnRzIG11c3QgYmUgbG9hZGVkIGJlZm9yZSB1c2VyIGNhbiBsb2dpbiEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24uY29uZmlnX3ZhbGlkYXRlX3Jlc3BvbnNlX3R5cGUodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlKSkge1xyXG4gICAgICAgICAgICAvLyBpbnZhbGlkIHJlc3BvbnNlX3R5cGVcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUgQ29kZSBGbG93LCBubyBhdXRoIGRhdGEnKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbDtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gRGF0ZS5ub3coKSArICcnICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wgPSBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vbmNlID0gJ04nICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSBub25jZTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0F1dGhvcml6ZWRDb250cm9sbGVyIGNyZWF0ZWQuIGxvY2FsIHN0YXRlOiAnICsgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbCk7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSAnJztcclxuICAgICAgICAvLyBDb2RlIEZsb3dcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxyXG4gICAgICAgICAgICBjb25zdCBjb2RlX3ZlcmlmaWVyID0gJ0MnICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKSArICcnICsgRGF0ZS5ub3coKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVfY2hhbGxlbmdlID0gdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmdlbmVyYXRlX2NvZGVfdmVyaWZpZXIoY29kZV92ZXJpZmllcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jb2RlX3ZlcmlmaWVyID0gY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZWRpcmVjdF91cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9uY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmF1dGhvcml6YXRpb25fZW5kcG9pbnQgfHwgJydcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJbXBsaWNpdCBGbG93XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAnJyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlZGlyZWN0X3VybCxcclxuICAgICAgICAgICAgICAgICAgICBub25jZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuYXV0aG9yaXphdGlvbl9lbmRwb2ludCB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVybEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RUbyh1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3dcclxuICAgIGF1dGhvcml6ZWRDYWxsYmFja1dpdGhDb2RlKHVybFRvQ2hlY2s6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXplZENhbGxiYWNrV2l0aENvZGUkKHVybFRvQ2hlY2spLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgYXV0aG9yaXplZENhbGxiYWNrV2l0aENvZGUkKHVybFRvQ2hlY2s6IHN0cmluZyk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLnVybFBhcnNlclNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdjb2RlJyk7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnVybFBhcnNlclNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdzdGF0ZScpO1xyXG4gICAgICAgIGNvbnN0IHNlc3Npb25TdGF0ZSA9IHRoaXMudXJsUGFyc2VyU2VydmljZS5nZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjaywgJ3Nlc3Npb25fc3RhdGUnKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnbm8gc3RhdGUgaW4gdXJsJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvZigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdubyBjb2RlIGluIHVybCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdydW5uaW5nIHZhbGlkYXRpb24gZm9yIGNhbGxiYWNrJyArIHVybFRvQ2hlY2spO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZSQoY29kZSwgc3RhdGUsIHNlc3Npb25TdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29kZSBGbG93XHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGUoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nLCBzZXNzaW9uU3RhdGU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZSQoY29kZSwgc3RhdGUsIHNlc3Npb25TdGF0ZSkuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFRva2Vuc1dpdGhDb2RlJChjb2RlOiBzdHJpbmcsIHN0YXRlOiBzdHJpbmcsIHNlc3Npb25TdGF0ZTogc3RyaW5nIHwgbnVsbCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc01vZHVsZVNldHVwLnBpcGUoXHJcbiAgICAgICAgICAgIGZpbHRlcihpc01vZHVsZVNldHVwID0+ICEhaXNNb2R1bGVTZXR1cCksXHJcbiAgICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGUsIHN0YXRlLCBzZXNzaW9uU3RhdGUpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVmcmVzaCBUb2tlblxyXG4gICAgcmVmcmVzaFRva2Vuc1dpdGhDb2RlUHJvY2VkdXJlKGNvZGU6IHN0cmluZywgc3RhdGU6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgbGV0IHRva2VuUmVxdWVzdFVybCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMgJiYgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLnRva2VuX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgIHRva2VuUmVxdWVzdFVybCA9IGAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBgZ3JhbnRfdHlwZT1yZWZyZXNoX3Rva2VuJmNsaWVudF9pZD0ke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkfWAgKyBgJnJlZnJlc2hfdG9rZW49JHtjb2RlfWA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBDbGllbnQucG9zdCh0b2tlblJlcXVlc3RVcmwsIGRhdGEsIHsgaGVhZGVycyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCd0b2tlbiByZWZyZXNoIHJlc3BvbnNlOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3JpemVkQ29kZUZsb3dDYWxsYmFja1Byb2NlZHVyZShvYmopO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBPaWRjU2VydmljZSBjb2RlIHJlcXVlc3QgJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlcn1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nLCBzZXNzaW9uX3N0YXRlOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGUsIHN0YXRlLCBzZXNzaW9uX3N0YXRlKS5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3cgd2l0aCBQQ0tFXHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGU6IHN0cmluZywgc3RhdGU6IHN0cmluZywgc2Vzc2lvbl9zdGF0ZTogc3RyaW5nIHwgbnVsbCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIGxldCB0b2tlblJlcXVlc3RVcmwgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzICYmIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludCkge1xyXG4gICAgICAgICAgICB0b2tlblJlcXVlc3RVcmwgPSBgJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMudG9rZW5fZW5kcG9pbnR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLnZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKHN0YXRlLCB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrIGluY29ycmVjdCBzdGF0ZScpO1xyXG4gICAgICAgICAgICAvLyBWYWxpZGF0aW9uUmVzdWx0LlN0YXRlc0RvTm90TWF0Y2g7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBFcnJvcignaW5jb3JyZWN0IHN0YXRlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID1cclxuICAgICAgICAgICAgYGdyYW50X3R5cGU9YXV0aG9yaXphdGlvbl9jb2RlJmNsaWVudF9pZD0ke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkfWAgK1xyXG4gICAgICAgICAgICBgJmNvZGVfdmVyaWZpZXI9JHt0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jb2RlX3ZlcmlmaWVyfSZjb2RlPSR7Y29kZX0mcmVkaXJlY3RfdXJpPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZWRpcmVjdF91cmx9YDtcclxuICAgICAgICBpZiAodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID09PSAncnVubmluZycpIHtcclxuICAgICAgICAgICAgZGF0YSA9XHJcbiAgICAgICAgICAgICAgICBgZ3JhbnRfdHlwZT1hdXRob3JpemF0aW9uX2NvZGUmY2xpZW50X2lkPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWR9YCArXHJcbiAgICAgICAgICAgICAgICBgJmNvZGVfdmVyaWZpZXI9JHt0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jb2RlX3ZlcmlmaWVyfSZjb2RlPSR7Y29kZX0mcmVkaXJlY3RfdXJpPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfdXJsfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LnBvc3QodG9rZW5SZXF1ZXN0VXJsLCBkYXRhLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBvYmouc2Vzc2lvbl9zdGF0ZSA9IHNlc3Npb25fc3RhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3JpemVkQ29kZUZsb3dDYWxsYmFja1Byb2NlZHVyZShvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYE9pZGNTZXJ2aWNlIGNvZGUgcmVxdWVzdCAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyfWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29kZSBGbG93XHJcbiAgICBwcml2YXRlIGF1dGhvcml6ZWRDb2RlRmxvd0NhbGxiYWNrUHJvY2VkdXJlKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2lsZW50UmVuZXcgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmc7XHJcbiAgICAgICAgY29uc3QgaXNSZW5ld1Byb2Nlc3MgPSBzaWxlbnRSZW5ldyA9PT0gJ3J1bm5pbmcnO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIGF1dGhvcml6ZWQgQ29kZSBGbG93IENhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcclxuICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXplZENhbGxiYWNrUHJvY2VkdXJlKHJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEltcGxpY2l0IEZsb3dcclxuICAgIHByaXZhdGUgYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrUHJvY2VkdXJlKGhhc2g/OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzaWxlbnRSZW5ldyA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZztcclxuICAgICAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHNpbGVudFJlbmV3ID09PSAncnVubmluZyc7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gYXV0aG9yaXplZENhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcclxuICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG5cclxuICAgICAgICBoYXNoID0gaGFzaCB8fCB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gaGFzaC5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbihyZXN1bHREYXRhOiBhbnksIGl0ZW06IHN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgcmVzdWx0RGF0YVs8c3RyaW5nPnBhcnRzLnNoaWZ0KCldID0gcGFydHMuam9pbignPScpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0RGF0YTtcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgdGhpcy5hdXRob3JpemVkQ2FsbGJhY2tQcm9jZWR1cmUocmVzdWx0LCBpc1JlbmV3UHJvY2Vzcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW1wbGljaXQgRmxvd1xyXG4gICAgYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrKGhhc2g/OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pc01vZHVsZVNldHVwXHJcbiAgICAgICAgICAgIC5waXBlKFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyKChpc01vZHVsZVNldHVwOiBib29sZWFuKSA9PiBpc01vZHVsZVNldHVwKSxcclxuICAgICAgICAgICAgICAgIHRha2UoMSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrUHJvY2VkdXJlKGhhc2gpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZGlyZWN0VG8odXJsOiBzdHJpbmcpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbXBsaWNpdCBGbG93XHJcbiAgICBwcml2YXRlIGF1dGhvcml6ZWRDYWxsYmFja1Byb2NlZHVyZShyZXN1bHQ6IGFueSwgaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoUmVzdWx0ID0gcmVzdWx0O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uaGlzdG9yeV9jbGVhbnVwX29mZiAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgLy8gcmVzZXQgdGhlIGhpc3RvcnkgdG8gcmVtb3ZlIHRoZSB0b2tlbnNcclxuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCB3aW5kb3cuZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnaGlzdG9yeSBjbGVhbiB1cCBpbmFjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhyZXN1bHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChyZXN1bHQuZXJyb3IgYXMgc3RyaW5nKSA9PT0gJ2xvZ2luX3JlcXVpcmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5Mb2dpblJlcXVpcmVkLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUudW5hdXRob3JpemVkLCBWYWxpZGF0aW9uUmVzdWx0LlNlY3VyZVRva2VuU2VydmVyRXJyb3IsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID0gJyc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVuYXV0aG9yaXplZF9yb3V0ZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjayBjcmVhdGVkLCBiZWdpbiB0b2tlbiB2YWxpZGF0aW9uJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFNpZ25pbmdLZXlzKCkuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgand0S2V5cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IHRoaXMuZ2V0VmFsaWRhdGVkU3RhdGVSZXN1bHQocmVzdWx0LCBqd3RLZXlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRpb25SZXN1bHQuYXV0aFJlc3BvbnNlSXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEF1dGhvcml6YXRpb25EYXRhKHZhbGlkYXRpb25SZXN1bHQuYWNjZXNzX3Rva2VuLCB2YWxpZGF0aW9uUmVzdWx0LmlkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5hdXRvX3VzZXJpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFVzZXJpbmZvKGlzUmVuZXdQcm9jZXNzLCByZXN1bHQsIHZhbGlkYXRpb25SZXN1bHQuaWRfdG9rZW4sIHZhbGlkYXRpb25SZXN1bHQuZGVjb2RlZF9pZF90b2tlbikuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUuYXV0aG9yaXplZCwgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucG9zdF9sb2dpbl9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udW5hdXRob3JpemVkX3JvdXRlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNvbWV0aGluZyB3ZW50IHdyb25nIHdoaWxlIGdldHRpbmcgc2lnbmluZyBrZXkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ0ZhaWxlZCB0byByZXRyZWl2ZSB1c2VyIGluZm8gd2l0aCBlcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGVycikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlckRhdGEgaXMgc2V0IHRvIHRoZSBpZF90b2tlbiBkZWNvZGVkLCBhdXRvIGdldCB1c2VyIGRhdGEgc2V0IHRvIGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5zZXRVc2VyRGF0YSh2YWxpZGF0aW9uUmVzdWx0LmRlY29kZWRfaWRfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS5hdXRob3JpemVkLCB2YWxpZGF0aW9uUmVzdWx0LnN0YXRlLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5wb3N0X2xvZ2luX3JvdXRlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrLCB0b2tlbihzKSB2YWxpZGF0aW9uIGZhaWxlZCwgcmVzZXR0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCAmJiAhaXNSZW5ld1Byb2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVuYXV0aG9yaXplZF9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2hpbGUgZ2V0dGluZyBzaWduaW5nIGtleSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdGYWlsZWQgdG8gcmV0cmVpdmUgc2lnaW5nIGtleSB3aXRoIGVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJpbmZvKGlzUmVuZXdQcm9jZXNzID0gZmFsc2UsIHJlc3VsdD86IGFueSwgaWRfdG9rZW4/OiBhbnksIGRlY29kZWRfaWRfdG9rZW4/OiBhbnkpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgPyByZXN1bHQgOiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoUmVzdWx0O1xyXG4gICAgICAgIGlkX3Rva2VuID0gaWRfdG9rZW4gPyBpZF90b2tlbiA6IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW47XHJcbiAgICAgICAgZGVjb2RlZF9pZF90b2tlbiA9IGRlY29kZWRfaWRfdG9rZW4gPyBkZWNvZGVkX2lkX3Rva2VuIDogdGhpcy50b2tlbkhlbHBlclNlcnZpY2UuZ2V0UGF5bG9hZEZyb21Ub2tlbihpZF90b2tlbiwgZmFsc2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgICAvLyBmbG93IGlkX3Rva2VuIHRva2VuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVzcG9uc2VfdHlwZSA9PT0gJ2lkX3Rva2VuIHRva2VuJyB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZSdcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZW5ld1Byb2Nlc3MgJiYgdGhpcy5fdXNlckRhdGEudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGUgPSByZXN1bHQuc2Vzc2lvbl9zdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2UuaW5pdFVzZXJEYXRhKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgKGlkX3Rva2VuIHRva2VuIHx8IGNvZGUpIGZsb3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi52YWxpZGF0ZV91c2VyZGF0YV9zdWJfaWRfdG9rZW4oZGVjb2RlZF9pZF90b2tlbi5zdWIsIHVzZXJEYXRhLnN1YikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodXNlckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLm9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlLmdldFVzZXJEYXRhKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNlc3Npb25TdGF0ZSA9IHJlc3VsdC5zZXNzaW9uX3N0YXRlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmcsIHVzZXJkYXRhIHN1YiBkb2VzIG5vdCBtYXRjaCB0aGF0IGZyb20gaWRfdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRob3JpemVkQ2FsbGJhY2ssIFVzZXIgZGF0YSBzdWIgZG9lcyBub3QgbWF0Y2ggc3ViIGluIGlkX3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjaywgdG9rZW4ocykgdmFsaWRhdGlvbiBmYWlsZWQsIHJlc2V0dGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmbG93IGlkX3Rva2VuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2F1dGhvcml6ZWRDYWxsYmFjayBpZF90b2tlbiBmbG93Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcodGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYWNjZXNzVG9rZW4pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHVzZXJEYXRhIGlzIHNldCB0byB0aGUgaWRfdG9rZW4gZGVjb2RlZC4gTm8gYWNjZXNzX3Rva2VuLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5zZXRVc2VyRGF0YShkZWNvZGVkX2lkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGUgPSByZXN1bHQuc2Vzc2lvbl9zdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb2ZmKHVybEhhbmRsZXI/OiAodXJsOiBzdHJpbmcpID0+IGFueSkge1xyXG4gICAgICAgIC8vIC9jb25uZWN0L2VuZHNlc3Npb24/aWRfdG9rZW5faGludD0uLi4mcG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpPWh0dHBzOi8vbXlhcHAuY29tXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUsIG5vIGF1dGggZGF0YScpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuZW5kX3Nlc3Npb25fZW5kcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZF9zZXNzaW9uX2VuZHBvaW50ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWRfdG9rZW5faGludCA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW47XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmNyZWF0ZUVuZFNlc3Npb25VcmwoZW5kX3Nlc3Npb25fZW5kcG9pbnQsIGlkX3Rva2VuX2hpbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RhcnRfY2hlY2tzZXNzaW9uICYmIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnb25seSBsb2NhbCBsb2dpbiBjbGVhbmVkIHVwLCBzZXJ2ZXIgc2Vzc2lvbiBoYXMgY2hhbmdlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh1cmxIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZGlyZWN0VG8odXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ29ubHkgbG9jYWwgbG9naW4gY2xlYW5lZCB1cCwgbm8gZW5kX3Nlc3Npb25fZW5kcG9pbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoU2Vzc2lvbigpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIHJlZnJlc2ggc2Vzc2lvbiBBdXRob3JpemUnKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbDtcclxuICAgICAgICBpZiAoc3RhdGUgPT09ICcnIHx8IHN0YXRlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gRGF0ZS5ub3coKSArICcnICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wgPSBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vbmNlID0gJ04nICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSBub25jZTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1JlZnJlc2hTZXNzaW9uIGNyZWF0ZWQuIGFkZGluZyBteWF1dG9zdGF0ZTogJyArIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wpO1xyXG5cclxuICAgICAgICBsZXQgdXJsID0gJyc7XHJcblxyXG4gICAgICAgIC8vIENvZGUgRmxvd1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUgPT09ICdjb2RlJykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi51c2VfcmVmcmVzaF90b2tlbikge1xyXG4gICAgICAgICAgICAgICAgLy8gdHJ5IHVzaW5nIHJlZnJlc2ggdG9rZW5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hfdG9rZW4gPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5nZXRSZWZyZXNoVG9rZW4oKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoX3Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdmb3VuZCByZWZyZXNoIGNvZGUsIG9idGFpbmluZyBuZXcgY3JlZGVudGlhbHMgd2l0aCByZWZyZXNoIGNvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBOb25jZSBpcyBub3QgdXNlZCB3aXRoIHJlZnJlc2ggdG9rZW5zOyBidXQgS2V5Y2xvYWsgbWF5IHNlbmQgaXQgYW55d2F5XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID0gT2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5SZWZyZXNoVG9rZW5Ob25jZVBsYWNlaG9sZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUb2tlbnNXaXRoQ29kZVByb2NlZHVyZShyZWZyZXNoX3Rva2VuLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnbm8gcmVmcmVzaCB0b2tlbiBmb3VuZCwgdXNpbmcgc2lsZW50IHJlbmV3Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxyXG4gICAgICAgICAgICBjb25zdCBjb2RlX3ZlcmlmaWVyID0gJ0MnICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKSArICcnICsgRGF0ZS5ub3coKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVfY2hhbGxlbmdlID0gdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmdlbmVyYXRlX2NvZGVfdmVyaWZpZXIoY29kZV92ZXJpZmllcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jb2RlX3ZlcmlmaWVyID0gY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5hdXRob3JpemF0aW9uX2VuZHBvaW50IHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICdub25lJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gdGhpcy5jcmVhdGVBdXRob3JpemVVcmwoXHJcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5hdXRob3JpemF0aW9uX2VuZHBvaW50IHx8ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICdub25lJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgPSAncnVubmluZyc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY1NlY3VyaXR5U2lsZW50UmVuZXcuc3RhcnRSZW5ldyh1cmwpLnBpcGUobWFwKCgpID0+IHRydWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFcnJvcihlcnJvcjogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2lsZW50UmVuZXcgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmc7XHJcbiAgICAgICAgY29uc3QgaXNSZW5ld1Byb2Nlc3MgPSBzaWxlbnRSZW5ldyA9PT0gJ3J1bm5pbmcnO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAzIHx8IGVycm9yLnN0YXR1cyA9PT0gJzQwMycpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udHJpZ2dlcl9hdXRob3JpemF0aW9uX3Jlc3VsdF9ldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQobmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5Ob3RTZXQsIGlzUmVuZXdQcm9jZXNzKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5mb3JiaWRkZW5fcm91dGVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEgfHwgZXJyb3Iuc3RhdHVzID09PSAnNDAxJykge1xyXG4gICAgICAgICAgICBjb25zdCBzaWxlbnRSZW5ldyA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZztcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YSghIXNpbGVudFJlbmV3KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIFZhbGlkYXRpb25SZXN1bHQuTm90U2V0LCBpc1JlbmV3UHJvY2VzcykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udW5hdXRob3JpemVkX3JvdXRlXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRDaGVja2luZ1NpbGVudFJlbmV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcENoZWNraW5nU2lsZW50UmVuZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NjaGVkdWxlZEhlYXJ0QmVhdCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0KTtcclxuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmF1dG9fdXNlcmluZm8pIHtcclxuICAgICAgICAgICAgICAgIC8vIENsZWFyIHVzZXIgZGF0YS4gRml4ZXMgIzk3LlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VyRGF0YSgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnJlc2V0U3RvcmFnZURhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRJc0F1dGhvcml6ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRFbmRTZXNzaW9uVXJsKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRfc2Vzc2lvbl9lbmRwb2ludCA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5lbmRfc2Vzc2lvbl9lbmRwb2ludDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkX3Rva2VuX2hpbnQgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRW5kU2Vzc2lvblVybChlbmRfc2Vzc2lvbl9lbmRwb2ludCwgaWRfdG9rZW5faGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRWYWxpZGF0ZWRTdGF0ZVJlc3VsdChyZXN1bHQ6IGFueSwgand0S2V5czogSnd0S2V5cyk6IFZhbGlkYXRlU3RhdGVSZXN1bHQge1xyXG4gICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0ZVN0YXRlUmVzdWx0KCcnLCAnJywgZmFsc2UsIHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVTdGF0ZShyZXN1bHQsIGp3dEtleXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VXNlckRhdGEodXNlckRhdGE6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnVzZXJEYXRhID0gdXNlckRhdGE7XHJcbiAgICAgICAgdGhpcy5fdXNlckRhdGEubmV4dCh1c2VyRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJc0F1dGhvcml6ZWQoaXNBdXRob3JpemVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faXNBdXRob3JpemVkLm5leHQoaXNBdXRob3JpemVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEF1dGhvcml6YXRpb25EYXRhKGFjY2Vzc190b2tlbjogYW55LCBpZF90b2tlbjogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuICE9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbiA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGFjY2Vzc190b2tlbik7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGlkX3Rva2VuKTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3N0b3JpbmcgdG8gc3RvcmFnZSwgZ2V0dGluZyB0aGUgcm9sZXMnKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbiA9IGFjY2Vzc190b2tlbjtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgdGhpcy5zZXRJc0F1dGhvcml6ZWQodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaXNBdXRob3JpemVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICBpc0NvZGVGbG93OiBib29sZWFuLFxyXG4gICAgICAgIGNvZGVfY2hhbGxlbmdlOiBzdHJpbmcsXHJcbiAgICAgICAgcmVkaXJlY3RfdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgbm9uY2U6IHN0cmluZyxcclxuICAgICAgICBzdGF0ZTogc3RyaW5nLFxyXG4gICAgICAgIGF1dGhvcml6YXRpb25fZW5kcG9pbnQ6IHN0cmluZyxcclxuICAgICAgICBwcm9tcHQ/OiBzdHJpbmdcclxuICAgICk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdXJsUGFydHMgPSBhdXRob3JpemF0aW9uX2VuZHBvaW50LnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yaXphdGlvblVybCA9IHVybFBhcnRzWzBdO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XHJcbiAgICAgICAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgICAgICAgICBlbmNvZGVyOiBuZXcgVXJpRW5jb2RlcigpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdyZWRpcmVjdF91cmknLCByZWRpcmVjdF91cmwpO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Jlc3BvbnNlX3R5cGUnLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUpO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Njb3BlJywgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zY29wZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnbm9uY2UnLCBub25jZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc3RhdGUnLCBzdGF0ZSk7XHJcblxyXG4gICAgICAgIGlmIChpc0NvZGVGbG93KSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ2NvZGVfY2hhbGxlbmdlJywgY29kZV9jaGFsbGVuZ2UpO1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjb2RlX2NoYWxsZW5nZV9tZXRob2QnLCAnUzI1NicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb21wdCkge1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdwcm9tcHQnLCBwcm9tcHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uaGRfcGFyYW0pIHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnaGQnLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmhkX3BhcmFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1c3RvbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmN1c3RvbVJlcXVlc3RQYXJhbXMpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhjdXN0b21QYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZChrZXksIGN1c3RvbVBhcmFtc1trZXldLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvblVybH0/JHtwYXJhbXN9YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUVuZFNlc3Npb25VcmwoZW5kX3Nlc3Npb25fZW5kcG9pbnQ6IHN0cmluZywgaWRfdG9rZW5faGludDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJsUGFydHMgPSBlbmRfc2Vzc2lvbl9lbmRwb2ludC5zcGxpdCgnPycpO1xyXG5cclxuICAgICAgICBjb25zdCBhdXRob3JpemF0aW9uRW5kc2Vzc2lvblVybCA9IHVybFBhcnRzWzBdO1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoe1xyXG4gICAgICAgICAgICBmcm9tU3RyaW5nOiB1cmxQYXJ0c1sxXSxcclxuICAgICAgICAgICAgZW5jb2RlcjogbmV3IFVyaUVuY29kZXIoKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdpZF90b2tlbl9oaW50JywgaWRfdG9rZW5faGludCk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpJywgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5wb3N0X2xvZ291dF9yZWRpcmVjdF91cmkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvbkVuZHNlc3Npb25Vcmx9PyR7cGFyYW1zfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTaWduaW5nS2V5cygpOiBPYnNlcnZhYmxlPEp3dEtleXM+IHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnandrc191cmk6ICcgKyB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuandrc191cmkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2lkY0RhdGFTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0PEp3dEtleXM+KHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5qd2tzX3VyaSB8fCAnJylcclxuICAgICAgICAgICAgICAgIC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvckdldFNpZ25pbmdLZXlzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2dldFNpZ25pbmdLZXlzOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0RhdGFTZXJ2aWNlLmdldDxKd3RLZXlzPigndW5kZWZpbmVkJykucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3JHZXRTaWduaW5nS2V5cykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlRXJyb3JHZXRTaWduaW5nS2V5cyhlcnJvcjogUmVzcG9uc2UgfCBhbnkpIHtcclxuICAgICAgICBsZXQgZXJyTXNnOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGVycm9yLmpzb24oKSB8fCB7fTtcclxuICAgICAgICAgICAgY29uc3QgZXJyID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XHJcbiAgICAgICAgICAgIGVyck1zZyA9IGAke2Vycm9yLnN0YXR1c30gLSAke2Vycm9yLnN0YXR1c1RleHQgfHwgJyd9ICR7ZXJyfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyTXNnID0gZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyTXNnKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJNc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcnVuVG9rZW5WYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgfHwgIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3J1blRva2VuVmFsaWRhdGlvbiBzaWxlbnQtcmVuZXcgcnVubmluZycpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgIEZpcnN0IHRpbWU6IGRlbGF5IDEwIHNlY29uZHMgdG8gY2FsbCBzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrXHJcbiAgICAgICAgICogICBBZnRlcndhcmRzOiBSdW4gdGhpcyBjaGVjayBpbiBhIDUgc2Vjb25kIGludGVydmFsIG9ubHkgQUZURVIgdGhlIHByZXZpb3VzIG9wZXJhdGlvbiBlbmRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgICAgICAgICAgICdzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrXFxyXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgYFxcdHNpbGVudFJlbmV3UnVubmluZzogJHt0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgPT09ICdydW5uaW5nJ31cXHJcXG5gICtcclxuICAgICAgICAgICAgICAgICAgICBgXFx0aWRUb2tlbjogJHshIXRoaXMuZ2V0SWRUb2tlbigpfVxcclxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBcXHRfdXNlckRhdGEudmFsdWU6ICR7ISF0aGlzLl91c2VyRGF0YS52YWx1ZX1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91c2VyRGF0YS52YWx1ZSAmJiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgIT09ICdydW5uaW5nJyAmJiB0aGlzLmdldElkVG9rZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5pc1Rva2VuRXhwaXJlZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaWRUb2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfb2Zmc2V0X2luX3NlY29uZHNcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZDogaWRfdG9rZW4gaXNUb2tlbkV4cGlyZWQsIHN0YXJ0IHNpbGVudCByZW5ldyBpZiBhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb24oKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrLCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ0Vycm9yOiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiB0aGlzIHNpdHVhdGlvbiwgd2Ugc2NoZWR1bGUgYSBoZWFydGJlYXQgY2hlY2sgb25seSB3aGVuIHNpbGVudFJlbmV3IGlzIGZpbmlzaGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBXZSBkb24ndCB3YW50IHRvIHNjaGVkdWxlIGFub3RoZXIgY2hlY2sgc28gd2UgaGF2ZSB0byByZXR1cm4gaGVyZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIERlbGF5IDMgc2Vjb25kcyBhbmQgZG8gdGhlIG5leHQgY2hlY2sgKi9cclxuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrLCAzMDAwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAvKiBJbml0aWFsIGhlYXJ0YmVhdCBjaGVjayAqL1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDEwMDAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNpbGVudFJlbmV3RXZlbnRIYW5kbGVyKGU6IEN1c3RvbUV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdzaWxlbnRSZW5ld0V2ZW50SGFuZGxlcicpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsUGFydHMgPSBlLmRldGFpbC50b1N0cmluZygpLnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHtcclxuICAgICAgICAgICAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgY29kZSA9IHBhcmFtcy5nZXQoJ2NvZGUnKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBwYXJhbXMuZ2V0KCdzdGF0ZScpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uX3N0YXRlID0gcGFyYW1zLmdldCgnc2Vzc2lvbl9zdGF0ZScpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IHBhcmFtcy5nZXQoJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgIGlmIChjb2RlICYmIHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZShjb2RlLCBzdGF0ZSwgc2Vzc2lvbl9zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUudW5hdXRob3JpemVkLCBWYWxpZGF0aW9uUmVzdWx0LkxvZ2luUmVxdWlyZWQsIHRydWUpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhlLmRldGFpbC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEltcGxpY2l0Rmxvd1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhvcml6ZWRJbXBsaWNpdEZsb3dDYWxsYmFjayhlLmRldGFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==