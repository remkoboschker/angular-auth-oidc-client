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
export { OidcSecurityUserService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS51c2VyLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS51c2VyLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFNUQ7SUFJSSxpQ0FDWSxlQUFnQyxFQUNoQyxrQkFBc0MsRUFDdEMsYUFBNEIsRUFDbkIscUJBQTRDO1FBSHJELG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ25CLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFOekQsYUFBUSxHQUFRLEVBQUUsQ0FBQztJQU94QixDQUFDOzs7O0lBRUosOENBQVk7OztJQUFaO1FBQUEsaUJBRUM7UUFERyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHOzs7O1FBQUMsVUFBQyxJQUFTLElBQUssT0FBQSxDQUFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQXRCLENBQXNCLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7Ozs7SUFFRCw2Q0FBVzs7O0lBQVg7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixNQUFNLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7Ozs7O0lBRUQsNkNBQVc7Ozs7SUFBWCxVQUFZLEtBQVU7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFTyxxREFBbUI7Ozs7SUFBM0I7O1lBQ1UsS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUU7UUFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1lBRXpGLE1BQU0sS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDdEQ7O1lBRUssY0FBYyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCO1FBRXZJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQ3ZCLGdIQUFnSCxDQUNuSCxDQUFDO1lBQ0YsTUFBTSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUN4RTtRQUVELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xJLENBQUM7O2dCQTlDSixVQUFVOzs7O2dCQUxGLGVBQWU7Z0JBR2Ysa0JBQWtCO2dCQURsQixhQUFhO2dCQURiLHFCQUFxQjs7SUFtRDlCLDhCQUFDO0NBQUEsQUEvQ0QsSUErQ0M7U0E5Q1ksdUJBQXVCOzs7Ozs7SUFDaEMsMkNBQTJCOzs7OztJQUd2QixrREFBd0M7Ozs7O0lBQ3hDLHFEQUE4Qzs7Ozs7SUFDOUMsZ0RBQW9DOzs7OztJQUNwQyx3REFBNkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBPaWRjRGF0YVNlcnZpY2UgfSBmcm9tICcuLi9kYXRhLXNlcnZpY2VzL29pZGMtZGF0YS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLWNvbmZpZ3VyYXRpb24ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNvbW1vbic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlVc2VyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIHVzZXJEYXRhOiBhbnkgPSAnJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIG9pZGNEYXRhU2VydmljZTogT2lkY0RhdGFTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q29tbW9uOiBPaWRjU2VjdXJpdHlDb21tb24sXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXJcclxuICAgICkge31cclxuXHJcbiAgICBpbml0VXNlckRhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWRlbnRpdHlVc2VyRGF0YSgpLnBpcGUobWFwKChkYXRhOiBhbnkpID0+ICh0aGlzLnVzZXJEYXRhID0gZGF0YSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVc2VyRGF0YSgpOiBhbnkge1xyXG4gICAgICAgIGlmICghdGhpcy51c2VyRGF0YSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVXNlckRhdGEgaXMgbm90IHNldCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVzZXJEYXRhKHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnVzZXJEYXRhID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRJZGVudGl0eVVzZXJEYXRhKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5nZXRBY2Nlc3NUb2tlbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG5cclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2F1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYW5HZXRVc2VyRGF0YSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cyAmJiB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMudXNlcmluZm9fZW5kcG9pbnQ7XHJcblxyXG4gICAgICAgIGlmICghY2FuR2V0VXNlckRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKFxyXG4gICAgICAgICAgICAgICAgJ2luaXQgY2hlY2sgc2Vzc2lvbjogYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQ7IHNldCBhdXRvX3VzZXJpbmZvID0gZmFsc2UgaW4gY29uZmlnJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignYXV0aFdlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm9pZGNEYXRhU2VydmljZS5nZXRJZGVudGl0eVVzZXJEYXRhKHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cy51c2VyaW5mb19lbmRwb2ludCB8fCAnJywgdG9rZW4pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==