/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoggerService } from './oidc.logger.service';
/**
 * @record
 */
export function ConfigResult() { }
if (false) {
    /** @type {?} */
    ConfigResult.prototype.authWellknownEndpoints;
    /** @type {?} */
    ConfigResult.prototype.customConfig;
}
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
export { OidcConfigService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcConfigService.prototype.configurationLoadedInternal;
    /**
     * @type {?}
     * @private
     */
    OidcConfigService.prototype.loggerService;
    /**
     * @type {?}
     * @private
     */
    OidcConfigService.prototype.httpClient;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jb25maWcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vaWRjLnNlY3VyaXR5LmNvbmZpZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQUV0RCxrQ0FHQzs7O0lBRkcsOENBQTRCOztJQUM1QixvQ0FBa0I7O0FBR3RCO0lBUUksMkJBQTZCLGFBQTRCLEVBQW1CLFVBQXNCO1FBQXJFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQW1CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFOMUYsZ0NBQTJCLEdBQUcsSUFBSSxhQUFhLENBQWUsQ0FBQyxDQUFDLENBQUM7SUFNNkIsQ0FBQztJQUp2RyxzQkFBVyxvREFBcUI7Ozs7UUFBaEM7WUFDSSxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzRCxDQUFDOzs7T0FBQTs7Ozs7SUFJRCxnQ0FBSTs7OztJQUFKLFVBQUssU0FBaUI7UUFBdEIsaUJBY0M7UUFiRyxPQUFPLElBQUksQ0FBQyxVQUFVO2FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUM7YUFDZCxJQUFJLENBQ0QsU0FBUzs7OztRQUFDLFVBQUEsbUJBQW1CO1lBQ3pCLE9BQU8sS0FBSSxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDNUQsQ0FBQyxF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SUFBRSx1Q0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ1Jlc3VsdCB7XHJcbiAgICBhdXRoV2VsbGtub3duRW5kcG9pbnRzOiBhbnk7XHJcbiAgICBjdXN0b21Db25maWc6IGFueTtcclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY0NvbmZpZ1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwgPSBuZXcgUmVwbGF5U3ViamVjdDxDb25maWdSZXN1bHQ+KDEpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db25maWd1cmF0aW9uTG9hZGVkKCk6IE9ic2VydmFibGU8Q29uZmlnUmVzdWx0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbkxvYWRlZEludGVybmFsLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSwgcHJpdmF0ZSByZWFkb25seSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgICBsb2FkKGNvbmZpZ1VybDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cENsaWVudFxyXG4gICAgICAgICAgICAuZ2V0KGNvbmZpZ1VybClcclxuICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoY2xpZW50Q29uZmlndXJhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZFVzaW5nQ29uZmlndXJhdGlvbihjbGllbnRDb25maWd1cmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBPaWRjQ29uZmlnU2VydmljZSAnbG9hZCcgdGhyZXcgYW4gZXJyb3Igb24gY2FsbGluZyAke2NvbmZpZ1VybH1gLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwubmV4dCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkX3VzaW5nX3N0c1NlcnZlcihzdHNTZXJ2ZXI6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRVc2luZ0NvbmZpZ3VyYXRpb24oeyBzdHNTZXJ2ZXIgfSkudG9Qcm9taXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZF91c2luZ19jdXN0b21fc3RzU2VydmVyKHVybDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cENsaWVudFxyXG4gICAgICAgICAgICAuZ2V0KHVybClcclxuICAgICAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAod2VsbEtub3duRW5kcG9pbnRzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Mb2FkZWRJbnRlcm5hbC5uZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFdlbGxrbm93bkVuZHBvaW50czogd2VsbEtub3duRW5kcG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21Db25maWc6IHsgc3RzU2VydmVyOiB1cmwgfSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgT2lkY0NvbmZpZ1NlcnZpY2UgJ2xvYWRfdXNpbmdfY3VzdG9tX3N0c1NlcnZlcicgdGhyZXcgYW4gZXJyb3Igb24gY2FsbGluZyAke3VybH1gLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwubmV4dCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRVc2luZ0NvbmZpZ3VyYXRpb24oY2xpZW50Q29uZmlnOiBhbnkpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIWNsaWVudENvbmZpZy5zdHNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBQcm9wZXJ0eSAnc3RzU2VydmVyJyBpcyBub3QgcHJlc2VudCBvZiBwYXNzZWQgY29uZmlnICR7SlNPTi5zdHJpbmdpZnkoY2xpZW50Q29uZmlnKX1gLCBjbGllbnRDb25maWcpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb3BlcnR5ICdzdHNTZXJ2ZXInIGlzIG5vdCBwcmVzZW50IG9mIHBhc3NlZCBjb25maWcgJHtKU09OLnN0cmluZ2lmeShjbGllbnRDb25maWcpfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdXJsID0gYCR7Y2xpZW50Q29uZmlnLnN0c1NlcnZlcn0vLndlbGwta25vd24vb3BlbmlkLWNvbmZpZ3VyYXRpb25gO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50LmdldCh1cmwpLnBpcGUoXHJcbiAgICAgICAgICAgIHN3aXRjaE1hcCh3ZWxsS25vd25FbmRwb2ludHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwubmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aFdlbGxrbm93bkVuZHBvaW50czogd2VsbEtub3duRW5kcG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbUNvbmZpZzogY2xpZW50Q29uZmlnLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihgT2lkY0NvbmZpZ1NlcnZpY2UgJ2xvYWRfdXNpbmdfc3RzU2VydmVyJyB0aHJldyBhbiBlcnJvciBvbiBjYWxsaW5nICR7dXJsfWAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbkxvYWRlZEludGVybmFsLm5leHQodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iXX0=