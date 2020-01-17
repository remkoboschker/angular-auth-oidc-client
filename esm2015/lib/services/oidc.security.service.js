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
export class OidcSecurityService {
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
        const data = `grant_type=refresh_token&client_id=${this.configurationProvider.openIDConfiguration.client_id}` + `&refresh_token=${code}`;
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
        let data = `grant_type=authorization_code&client_id=${this.configurationProvider.openIDConfiguration.client_id}
            &code_verifier=${this.oidcSecurityCommon.code_verifier}
            &code=${code}&redirect_uri=${this.configurationProvider.openIDConfiguration.redirect_url}`;
        if (this.oidcSecurityCommon.silentRenewRunning === 'running') {
            data = `grant_type=authorization_code&client_id=${this.configurationProvider.openIDConfiguration.client_id}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDekYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0csT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZC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RCwyREFBNkM7Ozs7O0lBQzdDLHdEQUEwQzs7Ozs7SUFDMUMsa0RBQWlDOzs7OztJQUNqQyxvREFBbUM7Ozs7O0lBRy9CLDhDQUF3Qzs7Ozs7SUFDeEMscURBQXNEOzs7OztJQUN0RCxxQ0FBc0I7Ozs7O0lBQ3RCLHVEQUEwRDs7Ozs7SUFDMUQsc0RBQXdEOzs7OztJQUN4RCxzREFBd0Q7Ozs7O0lBQ3hELGlEQUE4Qzs7Ozs7SUFDOUMscURBQXNEOzs7OztJQUN0RCxpREFBOEM7Ozs7O0lBQzlDLDRDQUFvQzs7Ozs7SUFDcEMsbUNBQW9COzs7OztJQUNwQix5Q0FBdUM7Ozs7O0lBQ3ZDLG9EQUE2RDs7Ozs7SUFDN0QsK0NBQW1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGZyb20sIE9ic2VydmFibGUsIG9mLCBTdWJqZWN0LCB0aHJvd0Vycm9yLCB0aW1lciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBmaWx0ZXIsIG1hcCwgcmFjZSwgc2hhcmVSZXBsYXksIHN3aXRjaE1hcCwgc3dpdGNoTWFwVG8sIHRha2UsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgT2lkY0RhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vZGF0YS1zZXJ2aWNlcy9vaWRjLWRhdGEuc2VydmljZSc7XHJcbmltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvYXV0aC5jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93bkVuZHBvaW50cyB9IGZyb20gJy4uL21vZGVscy9hdXRoLndlbGwta25vd24tZW5kcG9pbnRzJztcclxuaW1wb3J0IHsgQXV0aG9yaXphdGlvblJlc3VsdCB9IGZyb20gJy4uL21vZGVscy9hdXRob3JpemF0aW9uLXJlc3VsdCc7XHJcbmltcG9ydCB7IEF1dGhvcml6YXRpb25TdGF0ZSB9IGZyb20gJy4uL21vZGVscy9hdXRob3JpemF0aW9uLXN0YXRlLmVudW0nO1xyXG5pbXBvcnQgeyBKd3RLZXlzIH0gZnJvbSAnLi4vbW9kZWxzL2p3dGtleXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0ZVN0YXRlUmVzdWx0IH0gZnJvbSAnLi4vbW9kZWxzL3ZhbGlkYXRlLXN0YXRlLXJlc3VsdC5tb2RlbCc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi9tb2RlbHMvdmFsaWRhdGlvbi1yZXN1bHQuZW51bSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vYXV0aC1jb25maWd1cmF0aW9uLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vb2lkYy1zZWN1cml0eS1zdGF0ZS12YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUb2tlbkhlbHBlclNlcnZpY2UgfSBmcm9tICcuL29pZGMtdG9rZW4taGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNoZWNrLXNlc3Npb24nO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlDb21tb24gfSBmcm9tICcuL29pZGMuc2VjdXJpdHkuY29tbW9uJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5U2lsZW50UmVuZXcgfSBmcm9tICcuL29pZGMuc2VjdXJpdHkuc2lsZW50LXJlbmV3JztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5VXNlclNlcnZpY2UgfSBmcm9tICcuL29pZGMuc2VjdXJpdHkudXNlci1zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5VmFsaWRhdGlvbiB9IGZyb20gJy4vb2lkYy5zZWN1cml0eS52YWxpZGF0aW9uJztcclxuaW1wb3J0IHsgVXJpRW5jb2RlciB9IGZyb20gJy4vdXJpLWVuY29kZXInO1xyXG5pbXBvcnQgeyBVcmxQYXJzZXJTZXJ2aWNlIH0gZnJvbSAnLi91cmwtcGFyc2VyLnNlcnZpY2UnO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGU6IHZhcmlhYmxlLW5hbWVcclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5U2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9vbk1vZHVsZVNldHVwID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcclxuICAgIHByaXZhdGUgX29uQ2hlY2tTZXNzaW9uQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcbiAgICBwcml2YXRlIF9vbkF1dGhvcml6YXRpb25SZXN1bHQgPSBuZXcgU3ViamVjdDxBdXRob3JpemF0aW9uUmVzdWx0PigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Nb2R1bGVTZXR1cCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25Nb2R1bGVTZXR1cC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQXV0aG9yaXphdGlvblJlc3VsdCgpOiBPYnNlcnZhYmxlPEF1dGhvcml6YXRpb25SZXN1bHQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0LmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgb25DaGVja1Nlc3Npb25DaGFuZ2VkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vbkNoZWNrU2Vzc2lvbkNoYW5nZWQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNvbmZpZ3VyYXRpb25DaGFuZ2UoKTogT2JzZXJ2YWJsZTxPcGVuSWRDb25maWd1cmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9uQ29uZmlndXJhdGlvbkNoYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja1Nlc3Npb25DaGFuZ2VkID0gZmFsc2U7XHJcbiAgICBtb2R1bGVTZXR1cCA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgX2lzTW9kdWxlU2V0dXAgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcclxuXHJcbiAgICBwcml2YXRlIF9pc0F1dGhvcml6ZWQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcclxuICAgIHByaXZhdGUgX2lzU2V0dXBBbmRBdXRob3JpemVkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG5cclxuICAgIHByaXZhdGUgX3VzZXJEYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnk+KCcnKTtcclxuICAgIHByaXZhdGUgYXV0aFdlbGxLbm93bkVuZHBvaW50c0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9zY2hlZHVsZWRIZWFydEJlYXQ6IGFueTtcclxuICAgIHByaXZhdGUgYm91bmRTaWxlbnRSZW5ld0V2ZW50OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjRGF0YVNlcnZpY2U6IE9pZGNEYXRhU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHN0YXRlVmFsaWRhdGlvblNlcnZpY2U6IFN0YXRlVmFsaWRhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICAgICAgICBwcml2YXRlIG9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbjogT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5U2lsZW50UmVuZXc6IE9pZGNTZWN1cml0eVNpbGVudFJlbmV3LFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5VXNlclNlcnZpY2U6IE9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q29tbW9uOiBPaWRjU2VjdXJpdHlDb21tb24sXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlWYWxpZGF0aW9uOiBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uLFxyXG4gICAgICAgIHByaXZhdGUgdG9rZW5IZWxwZXJTZXJ2aWNlOiBUb2tlbkhlbHBlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgem9uZTogTmdab25lLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaHR0cENsaWVudDogSHR0cENsaWVudCxcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdXJsUGFyc2VyU2VydmljZTogVXJsUGFyc2VyU2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5vbk1vZHVsZVNldHVwLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb2R1bGVTZXR1cCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzTW9kdWxlU2V0dXAubmV4dCh0cnVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTZXR1cEFuZEF1dGhvcml6ZWQgPSB0aGlzLl9pc01vZHVsZVNldHVwLnBpcGUoXHJcbiAgICAgICAgICAgIGZpbHRlcigoaXNNb2R1bGVTZXR1cDogYm9vbGVhbikgPT4gaXNNb2R1bGVTZXR1cCksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBJc0F1dGhvcml6ZWRSYWNlOiBTaWxlbnQgUmVuZXcgTm90IEFjdGl2ZS4gRW1pdHRpbmcuYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZyb20oW3RydWVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByYWNlJCA9IHRoaXMuX2lzQXV0aG9yaXplZC5hc09ic2VydmFibGUoKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcigoaXNBdXRob3JpemVkOiBib29sZWFuKSA9PiBpc0F1dGhvcml6ZWQpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFwKCgpID0+IHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnSXNBdXRob3JpemVkUmFjZTogRXhpc3RpbmcgdG9rZW4gaXMgc3RpbGwgYXV0aG9yaXplZC4nKSksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBkZXByZWNhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHJhY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZSgxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcCgoKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZFJhY2U6IFNpbGVudCBSZW5ldyBSZWZyZXNoIFNlc3Npb24gQ29tcGxldGUnKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAoKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5pc2F1dGhvcml6ZWRyYWNlX3RpbWVvdXRfaW5fc2Vjb25kcyAqIDEwMDApLnBpcGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiYWNrdXAsIGlmIG5vdGhpbmcgaGFwcGVucyBhZnRlciBYIHNlY29uZHMgc3RvcCB3YWl0aW5nIGFuZCBlbWl0ICg1cyBEZWZhdWx0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFwKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdJc0F1dGhvcml6ZWRSYWNlOiBUaW1lb3V0IHJlYWNoZWQuIEVtaXR0aW5nLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAoKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdTaWxlbnQgUmVuZXcgaXMgYWN0aXZlLCBjaGVjayBpZiB0b2tlbiBpbiBzdG9yYWdlIGlzIGFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9PT0gJycgfHwgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aE5vbmNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsb2dpbiBub3QgcnVubmluZywgb3IgYSBzZWNvbmQgc2lsZW50IHJlbmV3LCB1c2VyIG11c3QgbG9naW4gZmlyc3QgYmVmb3JlIHRoaXMgd2lsbCB3b3JrLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnU2lsZW50IFJlbmV3IG9yIGxvZ2luIG5vdCBydW5uaW5nLCB0cnkgdG8gcmVmcmVzaCB0aGUgc2Vzc2lvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb24oKS5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFjZSQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdJc0F1dGhvcml6ZWRSYWNlOiBDb21wbGV0ZWQnKSksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcFRvKHRoaXMuX2lzQXV0aG9yaXplZC5hc09ic2VydmFibGUoKSksXHJcbiAgICAgICAgICAgIHRhcCgoaXNBdXRob3JpemVkOiBib29sZWFuKSA9PiB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYGdldElzQXV0aG9yaXplZDogJHtpc0F1dGhvcml6ZWR9YCkpLFxyXG4gICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzU2V0dXBBbmRBdXRob3JpemVkXHJcbiAgICAgICAgICAgIC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0YXJ0X2NoZWNrc2Vzc2lvbikpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoaXNTZXR1cEFuZEF1dGhvcml6ZWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU2V0dXBBbmRBdXRob3JpemVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24uc3RhcnRDaGVja2luZ1Nlc3Npb24odGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbi5zdG9wQ2hlY2tpbmdTZXNzaW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwTW9kdWxlKG9wZW5JZENvbmZpZ3VyYXRpb246IE9wZW5JZENvbmZpZ3VyYXRpb24sIGF1dGhXZWxsS25vd25FbmRwb2ludHM6IEF1dGhXZWxsS25vd25FbmRwb2ludHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5zZXR1cChvcGVuSWRDb25maWd1cmF0aW9uLCBhdXRoV2VsbEtub3duRW5kcG9pbnRzKTtcclxuXHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24ub25DaGVja1Nlc3Npb25DaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnb25DaGVja1Nlc3Npb25DaGFuZ2VkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQ2hlY2tTZXNzaW9uQ2hhbmdlZC5uZXh0KHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24udXNlckRhdGE7XHJcbiAgICAgICAgaWYgKHVzZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlckRhdGEodXNlckRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaXNBdXRob3JpemVkID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaXNBdXRob3JpemVkO1xyXG4gICAgICAgIGlmIChpc0F1dGhvcml6ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdJc0F1dGhvcml6ZWQgc2V0dXAgbW9kdWxlJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmlzVG9rZW5FeHBpcmVkKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmlkVG9rZW4gfHwgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYWNjZXNzVG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfb2Zmc2V0X2luX3NlY29uZHNcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZCBzZXR1cCBtb2R1bGU7IGlkX3Rva2VuIGlzVG9rZW5FeHBpcmVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZCBzZXR1cCBtb2R1bGU7IGlkX3Rva2VuIGlzIHZhbGlkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldElzQXV0aG9yaXplZChpc0F1dGhvcml6ZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ1NUUyBzZXJ2ZXI6ICcgKyB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX29uTW9kdWxlU2V0dXAubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlTaWxlbnRSZW5ldy5pbml0UmVuZXcoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgYXV0aG9yaXphdGlvbiB2aWEgRE9NIGV2ZW50cy5cclxuICAgICAgICAgICAgLy8gRGVyZWdpc3RlciBpZiBPaWRjU2VjdXJpdHlTZXJ2aWNlLnNldHVwTW9kdWxlIGlzIGNhbGxlZCBhZ2FpbiBieSBhbnkgaW5zdGFuY2UuXHJcbiAgICAgICAgICAgIC8vICAgICAgV2Ugb25seSBldmVyIHdhbnQgdGhlIGxhdGVzdCBzZXR1cCBzZXJ2aWNlIHRvIGJlIHJlYWN0aW5nIHRvIHRoaXMgZXZlbnQuXHJcbiAgICAgICAgICAgIHRoaXMuYm91bmRTaWxlbnRSZW5ld0V2ZW50ID0gdGhpcy5zaWxlbnRSZW5ld0V2ZW50SGFuZGxlci5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VJZCA9IE1hdGgucmFuZG9tKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3VuZFNpbGVudFJlbmV3SW5pdEV2ZW50OiBhbnkgPSAoKGU6IEN1c3RvbUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5kZXRhaWwgIT09IGluc3RhbmNlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2lkYy1zaWxlbnQtcmVuZXctbWVzc2FnZScsIHRoaXMuYm91bmRTaWxlbnRSZW5ld0V2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb2lkYy1zaWxlbnQtcmVuZXctaW5pdCcsIGJvdW5kU2lsZW50UmVuZXdJbml0RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29pZGMtc2lsZW50LXJlbmV3LWluaXQnLCBib3VuZFNpbGVudFJlbmV3SW5pdEV2ZW50LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvaWRjLXNpbGVudC1yZW5ldy1tZXNzYWdlJywgdGhpcy5ib3VuZFNpbGVudFJlbmV3RXZlbnQsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdvaWRjLXNpbGVudC1yZW5ldy1pbml0Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogaW5zdGFuY2VJZCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVzZXJEYXRhPFQgPSBhbnk+KCk6IE9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyRGF0YS5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJc01vZHVsZVNldHVwKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc01vZHVsZVNldHVwLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldElzQXV0aG9yaXplZCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTZXR1cEFuZEF1dGhvcml6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXV0aG9yaXplZC5nZXRWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0QWNjZXNzVG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFRva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0F1dGhvcml6ZWQuZ2V0VmFsdWUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmdldElkVG9rZW4oKTtcclxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSZWZyZXNoVG9rZW4oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzQXV0aG9yaXplZC5nZXRWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uZ2V0UmVmcmVzaFRva2VuKCk7XHJcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh0b2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGF5bG9hZEZyb21JZFRva2VuKGVuY29kZSA9IGZhbHNlKTogYW55IHtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuZ2V0SWRUb2tlbigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2VuSGVscGVyU2VydmljZS5nZXRQYXlsb2FkRnJvbVRva2VuKHRva2VuLCBlbmNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN0YXRlKHN0YXRlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U3RhdGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXN0b21SZXF1ZXN0UGFyYW1ldGVycyhwYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uY3VzdG9tUmVxdWVzdFBhcmFtcyA9IHBhcmFtcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3cgd2l0aCBQQ0tFIG9yIEltcGxpY2l0IEZsb3dcclxuICAgIGF1dGhvcml6ZSh1cmxIYW5kbGVyPzogKHVybDogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50c0xvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50c0xvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ1dlbGwga25vd24gZW5kcG9pbnRzIG11c3QgYmUgbG9hZGVkIGJlZm9yZSB1c2VyIGNhbiBsb2dpbiEnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24uY29uZmlnX3ZhbGlkYXRlX3Jlc3BvbnNlX3R5cGUodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlKSkge1xyXG4gICAgICAgICAgICAvLyBpbnZhbGlkIHJlc3BvbnNlX3R5cGVcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiBBdXRob3JpemUgQ29kZSBGbG93LCBubyBhdXRoIGRhdGEnKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbDtcclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHN0YXRlID0gRGF0ZS5ub3coKSArICcnICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhTdGF0ZUNvbnRyb2wgPSBzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vbmNlID0gJ04nICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSBub25jZTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0F1dGhvcml6ZWRDb250cm9sbGVyIGNyZWF0ZWQuIGxvY2FsIHN0YXRlOiAnICsgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbCk7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSAnJztcclxuICAgICAgICAvLyBDb2RlIEZsb3dcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgLy8gY29kZV9jaGFsbGVuZ2Ugd2l0aCBcIlMyNTZcIlxyXG4gICAgICAgICAgICBjb25zdCBjb2RlX3ZlcmlmaWVyID0gJ0MnICsgTWF0aC5yYW5kb20oKSArICcnICsgRGF0ZS5ub3coKSArICcnICsgRGF0ZS5ub3coKSArIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVfY2hhbGxlbmdlID0gdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLmdlbmVyYXRlX2NvZGVfdmVyaWZpZXIoY29kZV92ZXJpZmllcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5jb2RlX3ZlcmlmaWVyID0gY29kZV92ZXJpZmllcjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IHRoaXMuY3JlYXRlQXV0aG9yaXplVXJsKFxyXG4gICAgICAgICAgICAgICAgICAgIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZV9jaGFsbGVuZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZWRpcmVjdF91cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9uY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmF1dGhvcml6YXRpb25fZW5kcG9pbnQgfHwgJydcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBJbXBsaWNpdCBGbG93XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAnJyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlZGlyZWN0X3VybCxcclxuICAgICAgICAgICAgICAgICAgICBub25jZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuYXV0aG9yaXphdGlvbl9lbmRwb2ludCB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVybEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgdXJsSGFuZGxlcih1cmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RUbyh1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3dcclxuICAgIGF1dGhvcml6ZWRDYWxsYmFja1dpdGhDb2RlKHVybFRvQ2hlY2s6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXplZENhbGxiYWNrV2l0aENvZGUkKHVybFRvQ2hlY2spLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgYXV0aG9yaXplZENhbGxiYWNrV2l0aENvZGUkKHVybFRvQ2hlY2s6IHN0cmluZyk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLnVybFBhcnNlclNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdjb2RlJyk7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnVybFBhcnNlclNlcnZpY2UuZ2V0VXJsUGFyYW1ldGVyKHVybFRvQ2hlY2ssICdzdGF0ZScpO1xyXG4gICAgICAgIGNvbnN0IHNlc3Npb25TdGF0ZSA9IHRoaXMudXJsUGFyc2VyU2VydmljZS5nZXRVcmxQYXJhbWV0ZXIodXJsVG9DaGVjaywgJ3Nlc3Npb25fc3RhdGUnKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIXN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnbm8gc3RhdGUgaW4gdXJsJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvZigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNvZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdubyBjb2RlIGluIHVybCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdydW5uaW5nIHZhbGlkYXRpb24gZm9yIGNhbGxiYWNrJyArIHVybFRvQ2hlY2spO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZSQoY29kZSwgc3RhdGUsIHNlc3Npb25TdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29kZSBGbG93XHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGUoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nLCBzZXNzaW9uU3RhdGU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZSQoY29kZSwgc3RhdGUsIHNlc3Npb25TdGF0ZSkuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWVzdFRva2Vuc1dpdGhDb2RlJChjb2RlOiBzdHJpbmcsIHN0YXRlOiBzdHJpbmcsIHNlc3Npb25TdGF0ZTogc3RyaW5nIHwgbnVsbCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc01vZHVsZVNldHVwLnBpcGUoXHJcbiAgICAgICAgICAgIGZpbHRlcihpc01vZHVsZVNldHVwID0+ICEhaXNNb2R1bGVTZXR1cCksXHJcbiAgICAgICAgICAgIHRha2UoMSksXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGUsIHN0YXRlLCBzZXNzaW9uU3RhdGUpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVmcmVzaCBUb2tlblxyXG4gICAgcmVmcmVzaFRva2Vuc1dpdGhDb2RlUHJvY2VkdXJlKGNvZGU6IHN0cmluZywgc3RhdGU6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgbGV0IHRva2VuUmVxdWVzdFVybCA9ICcnO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMgJiYgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLnRva2VuX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgIHRva2VuUmVxdWVzdFVybCA9IGAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBgZ3JhbnRfdHlwZT1yZWZyZXNoX3Rva2VuJmNsaWVudF9pZD0ke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkfWAgKyBgJnJlZnJlc2hfdG9rZW49JHtjb2RlfWA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBDbGllbnQucG9zdCh0b2tlblJlcXVlc3RVcmwsIGRhdGEsIHsgaGVhZGVycyB9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCd0b2tlbiByZWZyZXNoIHJlc3BvbnNlOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXRlID0gc3RhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3JpemVkQ29kZUZsb3dDYWxsYmFja1Byb2NlZHVyZShvYmopO1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBPaWRjU2VydmljZSBjb2RlIHJlcXVlc3QgJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlcn1gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUoY29kZTogc3RyaW5nLCBzdGF0ZTogc3RyaW5nLCBzZXNzaW9uX3N0YXRlOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGUsIHN0YXRlLCBzZXNzaW9uX3N0YXRlKS5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb2RlIEZsb3cgd2l0aCBQQ0tFXHJcbiAgICByZXF1ZXN0VG9rZW5zV2l0aENvZGVQcm9jZWR1cmUkKGNvZGU6IHN0cmluZywgc3RhdGU6IHN0cmluZywgc2Vzc2lvbl9zdGF0ZTogc3RyaW5nIHwgbnVsbCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIGxldCB0b2tlblJlcXVlc3RVcmwgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzICYmIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy50b2tlbl9lbmRwb2ludCkge1xyXG4gICAgICAgICAgICB0b2tlblJlcXVlc3RVcmwgPSBgJHt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMudG9rZW5fZW5kcG9pbnR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vaWRjU2VjdXJpdHlWYWxpZGF0aW9uLnZhbGlkYXRlU3RhdGVGcm9tSGFzaENhbGxiYWNrKHN0YXRlLCB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sKSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrIGluY29ycmVjdCBzdGF0ZScpO1xyXG4gICAgICAgICAgICAvLyBWYWxpZGF0aW9uUmVzdWx0LlN0YXRlc0RvTm90TWF0Y2g7XHJcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBFcnJvcignaW5jb3JyZWN0IHN0YXRlJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhlYWRlcnM6IEh0dHBIZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gYGdyYW50X3R5cGU9YXV0aG9yaXphdGlvbl9jb2RlJmNsaWVudF9pZD0ke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkfVxyXG4gICAgICAgICAgICAmY29kZV92ZXJpZmllcj0ke3RoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmNvZGVfdmVyaWZpZXJ9XHJcbiAgICAgICAgICAgICZjb2RlPSR7Y29kZX0mcmVkaXJlY3RfdXJpPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZWRpcmVjdF91cmx9YDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyA9PT0gJ3J1bm5pbmcnKSB7XHJcbiAgICAgICAgICAgIGRhdGEgPSBgZ3JhbnRfdHlwZT1hdXRob3JpemF0aW9uX2NvZGUmY2xpZW50X2lkPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWR9XHJcbiAgICAgICAgICAgICAgICAmY29kZV92ZXJpZmllcj0ke3RoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmNvZGVfdmVyaWZpZXJ9XHJcbiAgICAgICAgICAgICAgICAmY29kZT0ke2NvZGV9XHJcbiAgICAgICAgICAgICAgICAmcmVkaXJlY3RfdXJpPSR7dGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfdXJsfWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LnBvc3QodG9rZW5SZXF1ZXN0VXJsLCBkYXRhLCB7IGhlYWRlcnMgfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgb2JqLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBvYmouc2Vzc2lvbl9zdGF0ZSA9IHNlc3Npb25fc3RhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRob3JpemVkQ29kZUZsb3dDYWxsYmFja1Byb2NlZHVyZShvYmopO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYE9pZGNTZXJ2aWNlIGNvZGUgcmVxdWVzdCAke3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyfWApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29kZSBGbG93XHJcbiAgICBwcml2YXRlIGF1dGhvcml6ZWRDb2RlRmxvd0NhbGxiYWNrUHJvY2VkdXJlKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2lsZW50UmVuZXcgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmc7XHJcbiAgICAgICAgY29uc3QgaXNSZW5ld1Byb2Nlc3MgPSBzaWxlbnRSZW5ldyA9PT0gJ3J1bm5pbmcnO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0JFR0lOIGF1dGhvcml6ZWQgQ29kZSBGbG93IENhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcclxuICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yaXplZENhbGxiYWNrUHJvY2VkdXJlKHJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEltcGxpY2l0IEZsb3dcclxuICAgIHByaXZhdGUgYXV0aG9yaXplZEltcGxpY2l0Rmxvd0NhbGxiYWNrUHJvY2VkdXJlKGhhc2g/OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzaWxlbnRSZW5ldyA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZztcclxuICAgICAgICBjb25zdCBpc1JlbmV3UHJvY2VzcyA9IHNpbGVudFJlbmV3ID09PSAncnVubmluZyc7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gYXV0aG9yaXplZENhbGxiYWNrLCBubyBhdXRoIGRhdGEnKTtcclxuICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG5cclxuICAgICAgICBoYXNoID0gaGFzaCB8fCB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gaGFzaC5zcGxpdCgnJicpLnJlZHVjZSgocmVzdWx0RGF0YTogYW55LCBpdGVtOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgIHJlc3VsdERhdGFbcGFydHMuc2hpZnQoKSBhcyBzdHJpbmddID0gcGFydHMuam9pbignPScpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0RGF0YTtcclxuICAgICAgICB9LCB7fSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXV0aG9yaXplZENhbGxiYWNrUHJvY2VkdXJlKHJlc3VsdCwgaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEltcGxpY2l0IEZsb3dcclxuICAgIGF1dGhvcml6ZWRJbXBsaWNpdEZsb3dDYWxsYmFjayhoYXNoPzogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faXNNb2R1bGVTZXR1cFxyXG4gICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgIGZpbHRlcigoaXNNb2R1bGVTZXR1cDogYm9vbGVhbikgPT4gaXNNb2R1bGVTZXR1cCksXHJcbiAgICAgICAgICAgICAgICB0YWtlKDEpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhvcml6ZWRJbXBsaWNpdEZsb3dDYWxsYmFja1Byb2NlZHVyZShoYXNoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWRpcmVjdFRvKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSW1wbGljaXQgRmxvd1xyXG4gICAgcHJpdmF0ZSBhdXRob3JpemVkQ2FsbGJhY2tQcm9jZWR1cmUocmVzdWx0OiBhbnksIGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFJlc3VsdCA9IHJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmhpc3RvcnlfY2xlYW51cF9vZmYgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IHRoZSBoaXN0b3J5IHRvIHJlbW92ZSB0aGUgdG9rZW5zXHJcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgd2luZG93LmRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2hpc3RvcnkgY2xlYW4gdXAgaW5hY3RpdmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgaWYgKGlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcocmVzdWx0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgocmVzdWx0LmVycm9yIGFzIHN0cmluZykgPT09ICdsb2dpbl9yZXF1aXJlZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIFZhbGlkYXRpb25SZXN1bHQuTG9naW5SZXF1aXJlZCwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLnVuYXV0aG9yaXplZCwgVmFsaWRhdGlvblJlc3VsdC5TZWN1cmVUb2tlblNlcnZlckVycm9yLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9ICcnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi51bmF1dGhvcml6ZWRfcm91dGVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgY3JlYXRlZCwgYmVnaW4gdG9rZW4gdmFsaWRhdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nZXRTaWduaW5nS2V5cygpLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgIGp3dEtleXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSB0aGlzLmdldFZhbGlkYXRlZFN0YXRlUmVzdWx0KHJlc3VsdCwgand0S2V5cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0aW9uUmVzdWx0LmF1dGhSZXNwb25zZUlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdXRob3JpemF0aW9uRGF0YSh2YWxpZGF0aW9uUmVzdWx0LmFjY2Vzc190b2tlbiwgdmFsaWRhdGlvblJlc3VsdC5pZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uYXV0b191c2VyaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRVc2VyaW5mbyhpc1JlbmV3UHJvY2VzcywgcmVzdWx0LCB2YWxpZGF0aW9uUmVzdWx0LmlkX3Rva2VuLCB2YWxpZGF0aW9uUmVzdWx0LmRlY29kZWRfaWRfdG9rZW4pLnN1YnNjcmliZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEF1dGhvcml6YXRpb25SZXN1bHQoQXV0aG9yaXphdGlvblN0YXRlLmF1dGhvcml6ZWQsIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi50cmlnZ2VyX2F1dGhvcml6YXRpb25fcmVzdWx0X2V2ZW50ICYmICFpc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnBvc3RfbG9naW5fcm91dGVdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIHZhbGlkYXRpb25SZXN1bHQuc3RhdGUsIGlzUmVuZXdQcm9jZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi50cmlnZ2VyX2F1dGhvcml6YXRpb25fcmVzdWx0X2V2ZW50ICYmICFpc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVuYXV0aG9yaXplZF9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTb21ldGhpbmcgd2VudCB3cm9uZyB3aGlsZSBnZXR0aW5nIHNpZ25pbmcga2V5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdGYWlsZWQgdG8gcmV0cmVpdmUgdXNlciBpbmZvIHdpdGggZXJyb3I6ICcgKyBKU09OLnN0cmluZ2lmeShlcnIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZXJEYXRhIGlzIHNldCB0byB0aGUgaWRfdG9rZW4gZGVjb2RlZCwgYXV0byBnZXQgdXNlciBkYXRhIHNldCB0byBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2Uuc2V0VXNlckRhdGEodmFsaWRhdGlvblJlc3VsdC5kZWNvZGVkX2lkX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJEYXRhKHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2UuZ2V0VXNlckRhdGEoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUuYXV0aG9yaXplZCwgdmFsaWRhdGlvblJlc3VsdC5zdGF0ZSwgaXNSZW5ld1Byb2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucG9zdF9sb2dpbl9yb3V0ZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhvcml6ZWRDYWxsYmFjaywgdG9rZW4ocykgdmFsaWRhdGlvbiBmYWlsZWQsIHJlc2V0dGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZyh3aW5kb3cubG9jYXRpb24uaGFzaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BdXRob3JpemF0aW9uUmVzdWx0Lm5leHQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUudW5hdXRob3JpemVkLCB2YWxpZGF0aW9uUmVzdWx0LnN0YXRlLCBpc1JlbmV3UHJvY2VzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQgJiYgIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi51bmF1dGhvcml6ZWRfcm91dGVdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIFNvbWV0aGluZyB3ZW50IHdyb25nIHdoaWxlIGdldHRpbmcgc2lnbmluZyBrZXkgKi9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnRmFpbGVkIHRvIHJldHJlaXZlIHNpZ2luZyBrZXkgd2l0aCBlcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGVycikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNpbGVudFJlbmV3UnVubmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRVc2VyaW5mbyhpc1JlbmV3UHJvY2VzcyA9IGZhbHNlLCByZXN1bHQ/OiBhbnksIGlkX3Rva2VuPzogYW55LCBkZWNvZGVkX2lkX3Rva2VuPzogYW55KTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ID8gcmVzdWx0IDogdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFJlc3VsdDtcclxuICAgICAgICBpZF90b2tlbiA9IGlkX3Rva2VuID8gaWRfdG9rZW4gOiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuO1xyXG4gICAgICAgIGRlY29kZWRfaWRfdG9rZW4gPSBkZWNvZGVkX2lkX3Rva2VuID8gZGVjb2RlZF9pZF90b2tlbiA6IHRoaXMudG9rZW5IZWxwZXJTZXJ2aWNlLmdldFBheWxvYWRGcm9tVG9rZW4oaWRfdG9rZW4sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KG9ic2VydmVyID0+IHtcclxuICAgICAgICAgICAgLy8gZmxvdyBpZF90b2tlbiB0b2tlblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUgPT09ICdpZF90b2tlbiB0b2tlbicgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVzcG9uc2VfdHlwZSA9PT0gJ2NvZGUnXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVuZXdQcm9jZXNzICYmIHRoaXMuX3VzZXJEYXRhLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2Vzc2lvblN0YXRlID0gcmVzdWx0LnNlc3Npb25fc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eVVzZXJTZXJ2aWNlLmluaXRVc2VyRGF0YSgpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnYXV0aG9yaXplZENhbGxiYWNrIChpZF90b2tlbiB0b2tlbiB8fCBjb2RlKSBmbG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyRGF0YSA9IHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2UuZ2V0VXNlckRhdGEoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24udmFsaWRhdGVfdXNlcmRhdGFfc3ViX2lkX3Rva2VuKGRlY29kZWRfaWRfdG9rZW4uc3ViLCB1c2VyRGF0YS5zdWIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJEYXRhKHVzZXJEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcodGhpcy5vaWRjU2VjdXJpdHlVc2VyU2VydmljZS5nZXRVc2VyRGF0YSgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGUgPSByZXN1bHQuc2Vzc2lvbl9zdGF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nLCB1c2VyZGF0YSBzdWIgZG9lcyBub3QgbWF0Y2ggdGhhdCBmcm9tIGlkX3Rva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aG9yaXplZENhbGxiYWNrLCBVc2VyIGRhdGEgc3ViIGRvZXMgbm90IG1hdGNoIHN1YiBpbiBpZF90b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2ssIHRva2VuKHMpIHZhbGlkYXRpb24gZmFpbGVkLCByZXNldHRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gZmxvdyBpZF90b2tlblxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdhdXRob3JpemVkQ2FsbGJhY2sgaWRfdG9rZW4gZmxvdycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VyRGF0YSBpcyBzZXQgdG8gdGhlIGlkX3Rva2VuIGRlY29kZWQuIE5vIGFjY2Vzc190b2tlbi5cclxuICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2Uuc2V0VXNlckRhdGEoZGVjb2RlZF9pZF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXJEYXRhKHRoaXMub2lkY1NlY3VyaXR5VXNlclNlcnZpY2UuZ2V0VXNlckRhdGEoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2Vzc2lvblN0YXRlID0gcmVzdWx0LnNlc3Npb25fc3RhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ29mZih1cmxIYW5kbGVyPzogKHVybDogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICAvLyAvY29ubmVjdC9lbmRzZXNzaW9uP2lkX3Rva2VuX2hpbnQ9Li4uJnBvc3RfbG9nb3V0X3JlZGlyZWN0X3VyaT1odHRwczovL215YXBwLmNvbVxyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnQkVHSU4gQXV0aG9yaXplLCBubyBhdXRoIGRhdGEnKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRfc2Vzc2lvbl9lbmRwb2ludCA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5lbmRfc2Vzc2lvbl9lbmRwb2ludDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkX3Rva2VuX2hpbnQgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy5jcmVhdGVFbmRTZXNzaW9uVXJsKGVuZF9zZXNzaW9uX2VuZHBvaW50LCBpZF90b2tlbl9oaW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0YXJ0X2NoZWNrc2Vzc2lvbiAmJiB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ29ubHkgbG9jYWwgbG9naW4gY2xlYW5lZCB1cCwgc2VydmVyIHNlc3Npb24gaGFzIGNoYW5nZWQnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsSGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybEhhbmRsZXIodXJsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWRpcmVjdFRvKHVybCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0QXV0aG9yaXphdGlvbkRhdGEoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdvbmx5IGxvY2FsIGxvZ2luIGNsZWFuZWQgdXAsIG5vIGVuZF9zZXNzaW9uX2VuZHBvaW50Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnYXV0aFdlbGxLbm93bkVuZHBvaW50cyBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaFNlc3Npb24oKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ldykge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdCRUdJTiByZWZyZXNoIHNlc3Npb24gQXV0aG9yaXplJyk7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nID0gJ3J1bm5pbmcnO1xyXG5cclxuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoU3RhdGVDb250cm9sO1xyXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gJycgfHwgc3RhdGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgc3RhdGUgPSBEYXRlLm5vdygpICsgJycgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbCA9IHN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgbm9uY2UgPSAnTicgKyBNYXRoLnJhbmRvbSgpICsgJycgKyBEYXRlLm5vdygpO1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmF1dGhOb25jZSA9IG5vbmNlO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnUmVmcmVzaFNlc3Npb24gY3JlYXRlZC4gYWRkaW5nIG15YXV0b3N0YXRlOiAnICsgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uYXV0aFN0YXRlQ29udHJvbCk7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSAnJztcclxuXHJcbiAgICAgICAgLy8gQ29kZSBGbG93XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ucmVzcG9uc2VfdHlwZSA9PT0gJ2NvZGUnKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnVzZV9yZWZyZXNoX3Rva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0cnkgdXNpbmcgcmVmcmVzaCB0b2tlblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVmcmVzaF90b2tlbiA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmdldFJlZnJlc2hUb2tlbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hfdG9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ2ZvdW5kIHJlZnJlc2ggY29kZSwgb2J0YWluaW5nIG5ldyBjcmVkZW50aWFscyB3aXRoIHJlZnJlc2ggY29kZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vbmNlIGlzIG5vdCB1c2VkIHdpdGggcmVmcmVzaCB0b2tlbnM7IGJ1dCBLZXljbG9hayBtYXkgc2VuZCBpdCBhbnl3YXlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uLlJlZnJlc2hUb2tlbk5vbmNlUGxhY2Vob2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVmcmVzaFRva2Vuc1dpdGhDb2RlUHJvY2VkdXJlKHJlZnJlc2hfdG9rZW4sIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdubyByZWZyZXNoIHRva2VuIGZvdW5kLCB1c2luZyBzaWxlbnQgcmVuZXcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb2RlX2NoYWxsZW5nZSB3aXRoIFwiUzI1NlwiXHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVfdmVyaWZpZXIgPSAnQycgKyBNYXRoLnJhbmRvbSgpICsgJycgKyBEYXRlLm5vdygpICsgJycgKyBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgY29uc3QgY29kZV9jaGFsbGVuZ2UgPSB0aGlzLm9pZGNTZWN1cml0eVZhbGlkYXRpb24uZ2VuZXJhdGVfY29kZV92ZXJpZmllcihjb2RlX3ZlcmlmaWVyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmNvZGVfdmVyaWZpZXIgPSBjb2RlX3ZlcmlmaWVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICAgICAgdXJsID0gdGhpcy5jcmVhdGVBdXRob3JpemVVcmwoXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlX2NoYWxsZW5nZSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ld191cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9uY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmF1dGhvcml6YXRpb25fZW5kcG9pbnQgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ25vbmUnXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgPSB0aGlzLmNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAnJyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnNpbGVudF9yZW5ld191cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgbm9uY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmF1dGhvcml6YXRpb25fZW5kcG9pbnQgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ25vbmUnXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNTZWN1cml0eVNpbGVudFJlbmV3LnN0YXJ0UmVuZXcodXJsKS5waXBlKG1hcCgoKSA9PiB0cnVlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXJyb3IoZXJyb3I6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHNpbGVudFJlbmV3ID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nO1xyXG4gICAgICAgIGNvbnN0IGlzUmVuZXdQcm9jZXNzID0gc2lsZW50UmVuZXcgPT09ICdydW5uaW5nJztcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMyB8fCBlcnJvci5zdGF0dXMgPT09ICc0MDMnKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIFZhbGlkYXRpb25SZXN1bHQuTm90U2V0LCBpc1JlbmV3UHJvY2VzcykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uZm9yYmlkZGVuX3JvdXRlXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAxIHx8IGVycm9yLnN0YXR1cyA9PT0gJzQwMScpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2lsZW50UmVuZXdSdW5uaW5nID0gdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uc2lsZW50UmVuZXdSdW5uaW5nO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKCEhc2lsZW50UmVuZXdSdW5uaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnRyaWdnZXJfYXV0aG9yaXphdGlvbl9yZXN1bHRfZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXV0aG9yaXphdGlvblJlc3VsdC5uZXh0KG5ldyBBdXRob3JpemF0aW9uUmVzdWx0KEF1dGhvcml6YXRpb25TdGF0ZS51bmF1dGhvcml6ZWQsIFZhbGlkYXRpb25SZXN1bHQuTm90U2V0LCBpc1JlbmV3UHJvY2VzcykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24udW5hdXRob3JpemVkX3JvdXRlXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRDaGVja2luZ1NpbGVudFJlbmV3KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcENoZWNraW5nU2lsZW50UmVuZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NjaGVkdWxlZEhlYXJ0QmVhdCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0KTtcclxuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0QXV0aG9yaXphdGlvbkRhdGEoaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmF1dG9fdXNlcmluZm8pIHtcclxuICAgICAgICAgICAgICAgIC8vIENsZWFyIHVzZXIgZGF0YS4gRml4ZXMgIzk3LlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VyRGF0YSgnJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnJlc2V0U3RvcmFnZURhdGEoaXNSZW5ld1Byb2Nlc3MpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRJc0F1dGhvcml6ZWQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRFbmRTZXNzaW9uVXJsKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmVuZF9zZXNzaW9uX2VuZHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRfc2Vzc2lvbl9lbmRwb2ludCA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5lbmRfc2Vzc2lvbl9lbmRwb2ludDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkX3Rva2VuX2hpbnQgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRW5kU2Vzc2lvblVybChlbmRfc2Vzc2lvbl9lbmRwb2ludCwgaWRfdG9rZW5faGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRWYWxpZGF0ZWRTdGF0ZVJlc3VsdChyZXN1bHQ6IGFueSwgand0S2V5czogSnd0S2V5cyk6IFZhbGlkYXRlU3RhdGVSZXN1bHQge1xyXG4gICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0ZVN0YXRlUmVzdWx0KCcnLCAnJywgZmFsc2UsIHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlVmFsaWRhdGlvblNlcnZpY2UudmFsaWRhdGVTdGF0ZShyZXN1bHQsIGp3dEtleXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VXNlckRhdGEodXNlckRhdGE6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnVzZXJEYXRhID0gdXNlckRhdGE7XHJcbiAgICAgICAgdGhpcy5fdXNlckRhdGEubmV4dCh1c2VyRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJc0F1dGhvcml6ZWQoaXNBdXRob3JpemVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faXNBdXRob3JpemVkLm5leHQoaXNBdXRob3JpemVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEF1dGhvcml6YXRpb25EYXRhKGFjY2Vzc190b2tlbjogYW55LCBpZF90b2tlbjogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmFjY2Vzc1Rva2VuICE9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbiA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGFjY2Vzc190b2tlbik7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGlkX3Rva2VuKTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3N0b3JpbmcgdG8gc3RvcmFnZSwgZ2V0dGluZyB0aGUgcm9sZXMnKTtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hY2Nlc3NUb2tlbiA9IGFjY2Vzc190b2tlbjtcclxuICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5pZFRva2VuID0gaWRfdG9rZW47XHJcbiAgICAgICAgdGhpcy5zZXRJc0F1dGhvcml6ZWQodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaXNBdXRob3JpemVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUF1dGhvcml6ZVVybChcclxuICAgICAgICBpc0NvZGVGbG93OiBib29sZWFuLFxyXG4gICAgICAgIGNvZGVfY2hhbGxlbmdlOiBzdHJpbmcsXHJcbiAgICAgICAgcmVkaXJlY3RfdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgbm9uY2U6IHN0cmluZyxcclxuICAgICAgICBzdGF0ZTogc3RyaW5nLFxyXG4gICAgICAgIGF1dGhvcml6YXRpb25fZW5kcG9pbnQ6IHN0cmluZyxcclxuICAgICAgICBwcm9tcHQ/OiBzdHJpbmdcclxuICAgICk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgdXJsUGFydHMgPSBhdXRob3JpemF0aW9uX2VuZHBvaW50LnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgY29uc3QgYXV0aG9yaXphdGlvblVybCA9IHVybFBhcnRzWzBdO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcyh7XHJcbiAgICAgICAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgICAgICAgICBlbmNvZGVyOiBuZXcgVXJpRW5jb2RlcigpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5zZXQoJ2NsaWVudF9pZCcsIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uY2xpZW50X2lkKTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdyZWRpcmVjdF91cmknLCByZWRpcmVjdF91cmwpO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Jlc3BvbnNlX3R5cGUnLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnJlc3BvbnNlX3R5cGUpO1xyXG4gICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ3Njb3BlJywgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zY29wZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnbm9uY2UnLCBub25jZSk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnc3RhdGUnLCBzdGF0ZSk7XHJcblxyXG4gICAgICAgIGlmIChpc0NvZGVGbG93KSB7XHJcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcy5hcHBlbmQoJ2NvZGVfY2hhbGxlbmdlJywgY29kZV9jaGFsbGVuZ2UpO1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdjb2RlX2NoYWxsZW5nZV9tZXRob2QnLCAnUzI1NicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHByb21wdCkge1xyXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuYXBwZW5kKCdwcm9tcHQnLCBwcm9tcHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uaGRfcGFyYW0pIHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgnaGQnLCB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmhkX3BhcmFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1c3RvbVBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLmN1c3RvbVJlcXVlc3RQYXJhbXMpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhjdXN0b21QYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZChrZXksIGN1c3RvbVBhcmFtc1trZXldLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvblVybH0/JHtwYXJhbXN9YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUVuZFNlc3Npb25VcmwoZW5kX3Nlc3Npb25fZW5kcG9pbnQ6IHN0cmluZywgaWRfdG9rZW5faGludDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdXJsUGFydHMgPSBlbmRfc2Vzc2lvbl9lbmRwb2ludC5zcGxpdCgnPycpO1xyXG5cclxuICAgICAgICBjb25zdCBhdXRob3JpemF0aW9uRW5kc2Vzc2lvblVybCA9IHVybFBhcnRzWzBdO1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zID0gbmV3IEh0dHBQYXJhbXMoe1xyXG4gICAgICAgICAgICBmcm9tU3RyaW5nOiB1cmxQYXJ0c1sxXSxcclxuICAgICAgICAgICAgZW5jb2RlcjogbmV3IFVyaUVuY29kZXIoKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KCdpZF90b2tlbl9oaW50JywgaWRfdG9rZW5faGludCk7XHJcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zLmFwcGVuZCgncG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpJywgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5wb3N0X2xvZ291dF9yZWRpcmVjdF91cmkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7YXV0aG9yaXphdGlvbkVuZHNlc3Npb25Vcmx9PyR7cGFyYW1zfWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTaWduaW5nS2V5cygpOiBPYnNlcnZhYmxlPEp3dEtleXM+IHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnandrc191cmk6ICcgKyB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuandrc191cmkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2lkY0RhdGFTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0PEp3dEtleXM+KHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy5qd2tzX3VyaSB8fCAnJylcclxuICAgICAgICAgICAgICAgIC5waXBlKGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvckdldFNpZ25pbmdLZXlzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2dldFNpZ25pbmdLZXlzOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY0RhdGFTZXJ2aWNlLmdldDxKd3RLZXlzPigndW5kZWZpbmVkJykucGlwZShjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3JHZXRTaWduaW5nS2V5cykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlRXJyb3JHZXRTaWduaW5nS2V5cyhlcnJvcjogUmVzcG9uc2UgfCBhbnkpIHtcclxuICAgICAgICBsZXQgZXJyTXNnOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGVycm9yLmpzb24oKSB8fCB7fTtcclxuICAgICAgICAgICAgY29uc3QgZXJyID0gSlNPTi5zdHJpbmdpZnkoYm9keSk7XHJcbiAgICAgICAgICAgIGVyck1zZyA9IGAke2Vycm9yLnN0YXR1c30gLSAke2Vycm9yLnN0YXR1c1RleHQgfHwgJyd9ICR7ZXJyfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyTXNnID0gZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoZXJyTXNnKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJNc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcnVuVG9rZW5WYWxpZGF0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgfHwgIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ3J1blRva2VuVmFsaWRhdGlvbiBzaWxlbnQtcmVuZXcgcnVubmluZycpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgIEZpcnN0IHRpbWU6IGRlbGF5IDEwIHNlY29uZHMgdG8gY2FsbCBzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrXHJcbiAgICAgICAgICogICBBZnRlcndhcmRzOiBSdW4gdGhpcyBjaGVjayBpbiBhIDUgc2Vjb25kIGludGVydmFsIG9ubHkgQUZURVIgdGhlIHByZXZpb3VzIG9wZXJhdGlvbiBlbmRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhcclxuICAgICAgICAgICAgICAgICdzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrXFxyXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgYFxcdHNpbGVudFJlbmV3UnVubmluZzogJHt0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgPT09ICdydW5uaW5nJ31cXHJcXG5gICtcclxuICAgICAgICAgICAgICAgICAgICBgXFx0aWRUb2tlbjogJHshIXRoaXMuZ2V0SWRUb2tlbigpfVxcclxcbmAgK1xyXG4gICAgICAgICAgICAgICAgICAgIGBcXHRfdXNlckRhdGEudmFsdWU6ICR7ISF0aGlzLl91c2VyRGF0YS52YWx1ZX1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91c2VyRGF0YS52YWx1ZSAmJiB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zaWxlbnRSZW5ld1J1bm5pbmcgIT09ICdydW5uaW5nJyAmJiB0aGlzLmdldElkVG9rZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2lkY1NlY3VyaXR5VmFsaWRhdGlvbi5pc1Rva2VuRXhwaXJlZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlDb21tb24uaWRUb2tlbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zaWxlbnRfcmVuZXdfb2Zmc2V0X2luX3NlY29uZHNcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ0lzQXV0aG9yaXplZDogaWRfdG9rZW4gaXNUb2tlbkV4cGlyZWQsIHN0YXJ0IHNpbGVudCByZW5ldyBpZiBhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc2lsZW50X3JlbmV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlc3Npb24oKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrLCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoJ0Vycm9yOiAnICsgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiB0aGlzIHNpdHVhdGlvbiwgd2Ugc2NoZWR1bGUgYSBoZWFydGJlYXQgY2hlY2sgb25seSB3aGVuIHNpbGVudFJlbmV3IGlzIGZpbmlzaGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBXZSBkb24ndCB3YW50IHRvIHNjaGVkdWxlIGFub3RoZXIgY2hlY2sgc28gd2UgaGF2ZSB0byByZXR1cm4gaGVyZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEF1dGhvcml6YXRpb25EYXRhKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIERlbGF5IDMgc2Vjb25kcyBhbmQgZG8gdGhlIG5leHQgY2hlY2sgKi9cclxuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChzaWxlbnRSZW5ld0hlYXJ0QmVhdENoZWNrLCAzMDAwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAvKiBJbml0aWFsIGhlYXJ0YmVhdCBjaGVjayAqL1xyXG4gICAgICAgICAgICB0aGlzLl9zY2hlZHVsZWRIZWFydEJlYXQgPSBzZXRUaW1lb3V0KHNpbGVudFJlbmV3SGVhcnRCZWF0Q2hlY2ssIDEwMDAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNpbGVudFJlbmV3RXZlbnRIYW5kbGVyKGU6IEN1c3RvbUV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdzaWxlbnRSZW5ld0V2ZW50SGFuZGxlcicpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsUGFydHMgPSBlLmRldGFpbC50b1N0cmluZygpLnNwbGl0KCc/Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKHtcclxuICAgICAgICAgICAgICAgIGZyb21TdHJpbmc6IHVybFBhcnRzWzFdLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uc3QgY29kZSA9IHBhcmFtcy5nZXQoJ2NvZGUnKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBwYXJhbXMuZ2V0KCdzdGF0ZScpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uX3N0YXRlID0gcGFyYW1zLmdldCgnc2Vzc2lvbl9zdGF0ZScpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IHBhcmFtcy5nZXQoJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgIGlmIChjb2RlICYmIHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbnNXaXRoQ29kZVByb2NlZHVyZShjb2RlLCBzdGF0ZSwgc2Vzc2lvbl9zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkF1dGhvcml6YXRpb25SZXN1bHQubmV4dChuZXcgQXV0aG9yaXphdGlvblJlc3VsdChBdXRob3JpemF0aW9uU3RhdGUudW5hdXRob3JpemVkLCBWYWxpZGF0aW9uUmVzdWx0LkxvZ2luUmVxdWlyZWQsIHRydWUpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBdXRob3JpemF0aW9uRGF0YShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5hdXRoTm9uY2UgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhlLmRldGFpbC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEltcGxpY2l0Rmxvd1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhvcml6ZWRJbXBsaWNpdEZsb3dDYWxsYmFjayhlLmRldGFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==