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
export class OidcConfigService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jb25maWcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vaWRjLnNlY3VyaXR5LmNvbmZpZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsRUFBRSxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQUV0RCxrQ0FHQzs7O0lBRkcsOENBQTRCOztJQUM1QixvQ0FBa0I7O0FBSXRCLE1BQU0sT0FBTyxpQkFBaUI7Ozs7O0lBTzFCLFlBQTZCLGFBQTRCLEVBQW1CLFVBQXNCO1FBQXJFLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQW1CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFOMUYsZ0NBQTJCLEdBQUcsSUFBSSxhQUFhLENBQWUsQ0FBQyxDQUFDLENBQUM7SUFNNEIsQ0FBQzs7OztJQUp0RyxJQUFXLHFCQUFxQjtRQUM1QixPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzRCxDQUFDOzs7OztJQUlELElBQUksQ0FBQyxTQUFpQjtRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVO2FBQ2pCLEdBQUcsQ0FBQyxTQUFTLENBQUM7YUFDZCxJQUFJLENBQ0QsU0FBUzs7OztRQUFDLG1CQUFtQixDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM1RCxDQUFDLEVBQUMsRUFD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QGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ1Jlc3VsdCB7XHJcbiAgICBhdXRoV2VsbGtub3duRW5kcG9pbnRzOiBhbnk7XHJcbiAgICBjdXN0b21Db25maWc6IGFueTtcclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY0NvbmZpZ1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwgPSBuZXcgUmVwbGF5U3ViamVjdDxDb25maWdSZXN1bHQ+KDEpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgb25Db25maWd1cmF0aW9uTG9hZGVkKCk6IE9ic2VydmFibGU8Q29uZmlnUmVzdWx0PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbkxvYWRlZEludGVybmFsLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSwgcHJpdmF0ZSByZWFkb25seSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50KSB7fVxyXG5cclxuICAgIGxvYWQoY29uZmlnVXJsOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50XHJcbiAgICAgICAgICAgIC5nZXQoY29uZmlnVXJsKVxyXG4gICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgIHN3aXRjaE1hcChjbGllbnRDb25maWd1cmF0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkVXNpbmdDb25maWd1cmF0aW9uKGNsaWVudENvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYE9pZGNDb25maWdTZXJ2aWNlICdsb2FkJyB0aHJldyBhbiBlcnJvciBvbiBjYWxsaW5nICR7Y29uZmlnVXJsfWAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Mb2FkZWRJbnRlcm5hbC5uZXh0KHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRfdXNpbmdfc3RzU2VydmVyKHN0c1NlcnZlcjogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZFVzaW5nQ29uZmlndXJhdGlvbih7IHN0c1NlcnZlciB9KS50b1Byb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkX3VzaW5nX2N1c3RvbV9zdHNTZXJ2ZXIodXJsOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwQ2xpZW50XHJcbiAgICAgICAgICAgIC5nZXQodXJsKVxyXG4gICAgICAgICAgICAucGlwZShcclxuICAgICAgICAgICAgICAgIHN3aXRjaE1hcCh3ZWxsS25vd25FbmRwb2ludHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvbkxvYWRlZEludGVybmFsLm5leHQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoV2VsbGtub3duRW5kcG9pbnRzOiB3ZWxsS25vd25FbmRwb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUNvbmZpZzogeyBzdHNTZXJ2ZXI6IHVybCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZih0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBPaWRjQ29uZmlnU2VydmljZSAnbG9hZF91c2luZ19jdXN0b21fc3RzU2VydmVyJyB0aHJldyBhbiBlcnJvciBvbiBjYWxsaW5nICR7dXJsfWAsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Mb2FkZWRJbnRlcm5hbC5uZXh0KHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZFVzaW5nQ29uZmlndXJhdGlvbihjbGllbnRDb25maWc6IGFueSk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGlmICghY2xpZW50Q29uZmlnLnN0c1NlcnZlcikge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoYFByb3BlcnR5ICdzdHNTZXJ2ZXInIGlzIG5vdCBwcmVzZW50IG9mIHBhc3NlZCBjb25maWcgJHtKU09OLnN0cmluZ2lmeShjbGllbnRDb25maWcpfWAsIGNsaWVudENvbmZpZyk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvcGVydHkgJ3N0c1NlcnZlcicgaXMgbm90IHByZXNlbnQgb2YgcGFzc2VkIGNvbmZpZyAke0pTT04uc3RyaW5naWZ5KGNsaWVudENvbmZpZyl9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1cmwgPSBgJHtjbGllbnRDb25maWcuc3RzU2VydmVyfS8ud2VsbC1rbm93bi9vcGVuaWQtY29uZmlndXJhdGlvbmA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBDbGllbnQuZ2V0KHVybCkucGlwZShcclxuICAgICAgICAgICAgc3dpdGNoTWFwKHdlbGxLbm93bkVuZHBvaW50cyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Mb2FkZWRJbnRlcm5hbC5uZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICBhdXRoV2VsbGtub3duRW5kcG9pbnRzOiB3ZWxsS25vd25FbmRwb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tQ29uZmlnOiBjbGllbnRDb25maWcsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvZih0cnVlKTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKGBPaWRjQ29uZmlnU2VydmljZSAnbG9hZF91c2luZ19zdHNTZXJ2ZXInIHRocmV3IGFuIGVycm9yIG9uIGNhbGxpbmcgJHt1cmx9YCwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uTG9hZGVkSW50ZXJuYWwubmV4dCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==