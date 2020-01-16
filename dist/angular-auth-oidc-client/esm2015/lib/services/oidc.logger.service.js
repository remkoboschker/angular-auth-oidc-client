/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from './auth-configuration.provider';
export class LoggerService {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    LoggerService.prototype.configurationProvider;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5sb2dnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vaWRjLmxvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBR3RFLE1BQU0sT0FBTyxhQUFhOzs7O0lBQ3RCLFlBQW9CLHFCQUE0QztRQUE1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO0lBQUcsQ0FBQzs7Ozs7O0lBRXBFLFFBQVEsQ0FBQyxPQUFZLEVBQUUsR0FBRyxJQUFXO1FBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsT0FBWTtRQUNuQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMzRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsT0FBWTtRQUNqQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN6RSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3hCO0lBQ0wsQ0FBQzs7O1lBbEJKLFVBQVU7Ozs7WUFGRixxQkFBcUI7Ozs7Ozs7SUFJZCw4Q0FBb0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vYXV0aC1jb25maWd1cmF0aW9uLnByb3ZpZGVyJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2dlclNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcikge31cclxuXHJcbiAgICBsb2dFcnJvcihtZXNzYWdlOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dXYXJuaW5nKG1lc3NhZ2U6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLmxvZ19jb25zb2xlX3dhcm5pbmdfYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9nRGVidWcobWVzc2FnZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24ubG9nX2NvbnNvbGVfZGVidWdfYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=