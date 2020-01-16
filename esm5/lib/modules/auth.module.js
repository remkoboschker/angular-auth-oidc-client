/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { OidcDataService } from '../data-services/oidc-data.service';
import { IFrameService } from '../services/existing-iframe.service';
import { EqualityHelperService } from '../services/oidc-equality-helper.service';
import { StateValidationService } from '../services/oidc-security-state-validation.service';
import { TokenHelperService } from '../services/oidc-token-helper.service';
import { LoggerService } from '../services/oidc.logger.service';
import { OidcSecurityCheckSession } from '../services/oidc.security.check-session';
import { OidcSecurityCommon } from '../services/oidc.security.common';
import { OidcConfigService } from '../services/oidc.security.config.service';
import { OidcSecurityService } from '../services/oidc.security.service';
import { OidcSecuritySilentRenew } from '../services/oidc.security.silent-renew';
import { BrowserStorage, OidcSecurityStorage } from '../services/oidc.security.storage';
import { OidcSecurityUserService } from '../services/oidc.security.user-service';
import { OidcSecurityValidation } from '../services/oidc.security.validation';
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
export { AuthModule };
/**
 * @record
 * @template T
 */
export function Type() { }
/**
 * @record
 */
export function Token() { }
if (false) {
    /** @type {?|undefined} */
    Token.prototype.storage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvbW9kdWxlcy9hdXRoLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNqRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDaEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbkYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDakYsT0FBTyxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRTlFO0lBQUE7SUEwQkEsQ0FBQzs7Ozs7SUF4QlUsa0JBQU87Ozs7SUFBZCxVQUFlLEtBQWlCO1FBQWpCLHNCQUFBLEVBQUEsVUFBaUI7UUFDNUIsT0FBTztZQUNILFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRTtnQkFDUCxpQkFBaUI7Z0JBQ2pCLG1CQUFtQjtnQkFDbkIsc0JBQXNCO2dCQUN0Qix3QkFBd0I7Z0JBQ3hCLHVCQUF1QjtnQkFDdkIsdUJBQXVCO2dCQUN2QixrQkFBa0I7Z0JBQ2xCLGtCQUFrQjtnQkFDbEIsYUFBYTtnQkFDYixhQUFhO2dCQUNiLHFCQUFxQjtnQkFDckIsZUFBZTtnQkFDZixzQkFBc0I7Z0JBQ3RCO29CQUNJLE9BQU8sRUFBRSxtQkFBbUI7b0JBQzVCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLGNBQWM7aUJBQzVDO2FBQ0o7U0FDSixDQUFDO0lBQ04sQ0FBQzs7Z0JBekJKLFFBQVE7O0lBMEJULGlCQUFDO0NBQUEsQUExQkQsSUEwQkM7U0F6QlksVUFBVTs7Ozs7QUEyQnZCLDBCQUVDOzs7O0FBRUQsMkJBRUM7OztJQURHLHdCQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9pZGNEYXRhU2VydmljZSB9IGZyb20gJy4uL2RhdGEtc2VydmljZXMvb2lkYy1kYXRhLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJRnJhbWVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFcXVhbGl0eUhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9vaWRjLWVxdWFsaXR5LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdGVWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL29pZGMtc2VjdXJpdHktc3RhdGUtdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVG9rZW5IZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvb2lkYy10b2tlbi1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIH0gZnJvbSAnLi4vc2VydmljZXMvb2lkYy5zZWN1cml0eS5jaGVjay1zZXNzaW9uJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi4vc2VydmljZXMvb2lkYy5zZWN1cml0eS5jb21tb24nO1xyXG5pbXBvcnQgeyBPaWRjQ29uZmlnU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvb2lkYy5zZWN1cml0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5U2lsZW50UmVuZXcgfSBmcm9tICcuLi9zZXJ2aWNlcy9vaWRjLnNlY3VyaXR5LnNpbGVudC1yZW5ldyc7XHJcbmltcG9ydCB7IEJyb3dzZXJTdG9yYWdlLCBPaWRjU2VjdXJpdHlTdG9yYWdlIH0gZnJvbSAnLi4vc2VydmljZXMvb2lkYy5zZWN1cml0eS5zdG9yYWdlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5VXNlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9vaWRjLnNlY3VyaXR5LnVzZXItc2VydmljZSc7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eVZhbGlkYXRpb24gfSBmcm9tICcuLi9zZXJ2aWNlcy9vaWRjLnNlY3VyaXR5LnZhbGlkYXRpb24nO1xyXG5cclxuQE5nTW9kdWxlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QodG9rZW46IFRva2VuID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuZ01vZHVsZTogQXV0aE1vZHVsZSxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICBPaWRjQ29uZmlnU2VydmljZSxcclxuICAgICAgICAgICAgICAgIE9pZGNTZWN1cml0eVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBPaWRjU2VjdXJpdHlWYWxpZGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgT2lkY1NlY3VyaXR5U2lsZW50UmVuZXcsXHJcbiAgICAgICAgICAgICAgICBPaWRjU2VjdXJpdHlVc2VyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIE9pZGNTZWN1cml0eUNvbW1vbixcclxuICAgICAgICAgICAgICAgIFRva2VuSGVscGVyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIExvZ2dlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBJRnJhbWVTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgRXF1YWxpdHlIZWxwZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgT2lkY0RhdGFTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgU3RhdGVWYWxpZGF0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBPaWRjU2VjdXJpdHlTdG9yYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNsYXNzOiB0b2tlbi5zdG9yYWdlIHx8IEJyb3dzZXJTdG9yYWdlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFR5cGU8VD4gZXh0ZW5kcyBGdW5jdGlvbiB7XHJcbiAgICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogVDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUb2tlbiB7XHJcbiAgICBzdG9yYWdlPzogVHlwZTxhbnk+O1xyXG59XHJcbiJdfQ==