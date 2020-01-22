/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OidcDataService } from '../data-services/oidc-data.service';
import { ConfigurationProvider } from './auth-configuration.provider';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
export class OidcSecurityUserService {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcSecurityUserService.prototype.userData;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityUserService.prototype.oidcDataService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityUserService.prototype.oidcSecurityCommon;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityUserService.prototype.loggerService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityUserService.prototype.configurationProvider;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS51c2VyLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS51c2VyLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7OztJQUdoQyxZQUNZLGVBQWdDLEVBQ2hDLGtCQUFzQyxFQUN0QyxhQUE0QixFQUNuQixxQkFBNEM7UUFIckQsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDbkIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQU56RCxhQUFRLEdBQVEsRUFBRSxDQUFDO0lBT3hCLENBQUM7Ozs7SUFFSixZQUFZO1FBQ1IsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRzs7OztRQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsTUFBTSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUN2QztRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxLQUFVO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRU8sbUJBQW1COztjQUNqQixLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRTtRQUV0RCxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7WUFFekYsTUFBTSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUN0RDs7Y0FFSyxjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUI7UUFFdkksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FDdkIsZ0hBQWdILENBQ25ILENBQUM7WUFDRixNQUFNLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEksQ0FBQzs7O1lBOUNKLFVBQVU7Ozs7WUFMRixlQUFlO1lBR2Ysa0JBQWtCO1lBRGxCLGFBQWE7WUFEYixxQkFBcUI7Ozs7Ozs7SUFNMUIsMkNBQTJCOzs7OztJQUd2QixrREFBd0M7Ozs7O0lBQ3hDLHFEQUE4Qzs7Ozs7SUFDOUMsZ0RBQW9DOzs7OztJQUNwQyx3REFBNkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBPaWRjRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhLXNlcnZpY2VzL29pZGMtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLWNvbmZpZ3VyYXRpb24ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNvbW1vbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlVc2VyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIHVzZXJEYXRhOiBhbnkgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIG9pZGNEYXRhU2VydmljZTogT2lkY0RhdGFTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q29tbW9uOiBPaWRjU2VjdXJpdHlDb21tb24sXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXJcclxuICAgICkge31cclxuXHJcbiAgICBpbml0VXNlckRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWRlbnRpdHlVc2VyRGF0YSgpLnBpcGUobWFwKChkYXRhOiBhbnkpID0+ICh0aGlzLnVzZXJEYXRhID0gZGF0YSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVc2VyRGF0YSgpOiBhbnkge1xyXG4gICAgICAgIGlmICghdGhpcy51c2VyRGF0YSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVXNlckRhdGEgaXMgbm90IHNldCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVzZXJEYXRhKHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnVzZXJEYXRhID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRJZGVudGl0eVVzZXJEYXRhKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYW5HZXRVc2VyRGF0YSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cyAmJiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMudXNlcmluZm9fZW5kcG9pbnQ7XHJcblxyXG4gICAgICAgIGlmICghY2FuR2V0VXNlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKFxyXG4gICAgICAgICAgICAgICAgJ2luaXQgY2hlY2sgc2Vzc2lvbjogYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQ7IHNldCBhdXRvX3VzZXJpbmZvID0gZmFsc2UgaW4gY29uZmlnJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNEYXRhU2VydmljZS5nZXRJZGVudGl0eVVzZXJEYXRhKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCB8fCAnJywgdG9rZW4pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==