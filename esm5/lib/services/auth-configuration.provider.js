/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlatformProvider } from './platform.provider';
import * as i0 from "@angular/core";
import * as i1 from "./platform.provider";
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
        this.mergedOpenIdConfiguration = tslib_1.__assign({}, this.mergedOpenIdConfiguration, passedOpenIfConfiguration);
        this.setSpecialCases(this.mergedOpenIdConfiguration);
        this.authWellKnownEndpoints = tslib_1.__assign({}, passedAuthWellKnownEndpoints);
        this.onConfigurationChangeInternal.next(tslib_1.__assign({}, this.mergedOpenIdConfiguration));
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
    /** @nocollapse */ ConfigurationProvider.ngInjectableDef = i0.defineInjectable({ factory: function ConfigurationProvider_Factory() { return new ConfigurationProvider(i0.inject(i1.PlatformProvider)); }, token: ConfigurationProvider, providedIn: "root" });
    return ConfigurationProvider;
}());
export { ConfigurationProvider };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.DEFAULT_CONFIG;
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.INITIAL_AUTHWELLKNOWN;
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.mergedOpenIdConfiguration;
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.authWellKnownEndpoints;
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.onConfigurationChangeInternal;
    /**
     * @type {?}
     * @private
     */
    ConfigurationProvider.prototype.platformProvider;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1jb25maWd1cmF0aW9uLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2F1dGgtY29uZmlndXJhdGlvbi5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7O0FBRXZEO0lBNkRJLCtCQUFvQixnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQTNEOUMsbUJBQWMsR0FBZ0M7WUFDbEQsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixZQUFZLEVBQUUsb0JBQW9CO1lBQ2xDLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLGFBQWEsRUFBRSxNQUFNO1lBQ3JCLEtBQUssRUFBRSxzQkFBc0I7WUFDN0IsUUFBUSxFQUFFLEVBQUU7WUFDWix3QkFBd0IsRUFBRSxvQkFBb0I7WUFDOUMsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixZQUFZLEVBQUUsS0FBSztZQUNuQixnQkFBZ0IsRUFBRSxvQkFBb0I7WUFDdEMsOEJBQThCLEVBQUUsQ0FBQztZQUNqQyxpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLDBCQUEwQixFQUFFLEtBQUs7WUFDakMsZ0JBQWdCLEVBQUUsR0FBRztZQUNyQixlQUFlLEVBQUUsWUFBWTtZQUM3QixrQkFBa0IsRUFBRSxlQUFlO1lBQ25DLGFBQWEsRUFBRSxJQUFJO1lBQ25CLHFDQUFxQyxFQUFFLElBQUk7WUFDM0Msa0NBQWtDLEVBQUUsS0FBSztZQUN6QywwQkFBMEIsRUFBRSxJQUFJO1lBQ2hDLHdCQUF3QixFQUFFLEtBQUs7WUFDL0Isa0JBQWtCLEVBQUUsS0FBSztZQUN6QixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLDBDQUEwQyxFQUFFLENBQUM7WUFDN0MsbUNBQW1DLEVBQUUsQ0FBQztZQUN0Qyw2QkFBNkIsRUFBRSxLQUFLO1lBQ3BDLE9BQU8sRUFBRSxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUNsRSxDQUFDO1FBRU0sMEJBQXFCLEdBQTJCO1lBQ3BELE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7WUFDWixzQkFBc0IsRUFBRSxFQUFFO1lBQzFCLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsb0JBQW9CLEVBQUUsRUFBRTtZQUN4QixvQkFBb0IsRUFBRSxFQUFFO1lBQ3hCLG1CQUFtQixFQUFFLEVBQUU7WUFDdkIsc0JBQXNCLEVBQUUsRUFBRTtTQUM3QixDQUFDO1FBRU0sOEJBQXlCLEdBQWdDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0UsMkJBQXNCLEdBQTJCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUU1RSxrQ0FBNkIsR0FBRyxJQUFJLE9BQU8sRUFBdUIsQ0FBQztJQWNsQixDQUFDO0lBWjFELHNCQUFJLHNEQUFtQjs7OztRQUF2QjtZQUNJLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDO1FBQzFDLENBQUM7OztPQUFBO0lBRUQsc0JBQUkscURBQWtCOzs7O1FBQXRCO1lBQ0ksT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDdkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx3REFBcUI7Ozs7UUFBekI7WUFDSSxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM3RCxDQUFDOzs7T0FBQTs7Ozs7O0lBSUQscUNBQUs7Ozs7O0lBQUwsVUFDSSx5QkFBaUUsRUFDakUsNEJBQXVFO1FBRXZFLElBQUksQ0FBQyx5QkFBeUIsd0JBQVEsSUFBSSxDQUFDLHlCQUF5QixFQUFLLHlCQUF5QixDQUFFLENBQUM7UUFDckcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsc0JBQXNCLHdCQUFRLDRCQUE0QixDQUFFLENBQUM7UUFDbEUsSUFBSSxDQUFDLDZCQUE2QixDQUFDLElBQUksc0JBQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFHLENBQUM7SUFDbkYsQ0FBQzs7Ozs7O0lBRU8sK0NBQWU7Ozs7O0lBQXZCLFVBQXdCLGFBQWtDO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQ2xDLGFBQWEsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDekMsYUFBYSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDbkMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztTQUMzQztJQUNMLENBQUM7O2dCQS9FSixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQUZ6QixnQkFBZ0I7OztnQ0FKekI7Q0FzRkMsQUFoRkQsSUFnRkM7U0EvRVkscUJBQXFCOzs7Ozs7SUFDOUIsK0NBNEJFOzs7OztJQUVGLHNEQVVFOzs7OztJQUVGLDBEQUFxRjs7Ozs7SUFDckYsdURBQW9GOzs7OztJQUVwRiw4REFBMkU7Ozs7O0lBYy9ELGlEQUEwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBPcGVuSWRDb25maWd1cmF0aW9uLCBPcGVuSWRJbnRlcm5hbENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9tb2RlbHMvYXV0aC5jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHsgQXV0aFdlbGxLbm93bkVuZHBvaW50cyB9IGZyb20gJy4uL21vZGVscy9hdXRoLndlbGwta25vd24tZW5kcG9pbnRzJztcclxuaW1wb3J0IHsgUGxhdGZvcm1Qcm92aWRlciB9IGZyb20gJy4vcGxhdGZvcm0ucHJvdmlkZXInO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25Qcm92aWRlciB7XHJcbiAgICBwcml2YXRlIERFRkFVTFRfQ09ORklHOiBPcGVuSWRJbnRlcm5hbENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgICAgICAgc3RzU2VydmVyOiAnaHR0cHM6Ly9wbGVhc2Vfc2V0JyxcclxuICAgICAgICByZWRpcmVjdF91cmw6ICdodHRwczovL3BsZWFzZV9zZXQnLFxyXG4gICAgICAgIGNsaWVudF9pZDogJ3BsZWFzZV9zZXQnLFxyXG4gICAgICAgIHJlc3BvbnNlX3R5cGU6ICdjb2RlJyxcclxuICAgICAgICBzY29wZTogJ29wZW5pZCBlbWFpbCBwcm9maWxlJyxcclxuICAgICAgICBoZF9wYXJhbTogJycsXHJcbiAgICAgICAgcG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpOiAnaHR0cHM6Ly9wbGVhc2Vfc2V0JyxcclxuICAgICAgICBzdGFydF9jaGVja3Nlc3Npb246IGZhbHNlLFxyXG4gICAgICAgIHNpbGVudF9yZW5ldzogZmFsc2UsXHJcbiAgICAgICAgc2lsZW50X3JlbmV3X3VybDogJ2h0dHBzOi8vcGxlYXNlX3NldCcsXHJcbiAgICAgICAgc2lsZW50X3JlbmV3X29mZnNldF9pbl9zZWNvbmRzOiAwLFxyXG4gICAgICAgIHVzZV9yZWZyZXNoX3Rva2VuOiBmYWxzZSxcclxuICAgICAgICBpZ25vcmVfbm9uY2VfYWZ0ZXJfcmVmcmVzaDogZmFsc2UsXHJcbiAgICAgICAgcG9zdF9sb2dpbl9yb3V0ZTogJy8nLFxyXG4gICAgICAgIGZvcmJpZGRlbl9yb3V0ZTogJy9mb3JiaWRkZW4nLFxyXG4gICAgICAgIHVuYXV0aG9yaXplZF9yb3V0ZTogJy91bmF1dGhvcml6ZWQnLFxyXG4gICAgICAgIGF1dG9fdXNlcmluZm86IHRydWUsXHJcbiAgICAgICAgYXV0b19jbGVhbl9zdGF0ZV9hZnRlcl9hdXRoZW50aWNhdGlvbjogdHJ1ZSxcclxuICAgICAgICB0cmlnZ2VyX2F1dGhvcml6YXRpb25fcmVzdWx0X2V2ZW50OiBmYWxzZSxcclxuICAgICAgICBsb2dfY29uc29sZV93YXJuaW5nX2FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICBsb2dfY29uc29sZV9kZWJ1Z19hY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgIGlzc192YWxpZGF0aW9uX29mZjogZmFsc2UsXHJcbiAgICAgICAgaGlzdG9yeV9jbGVhbnVwX29mZjogZmFsc2UsXHJcbiAgICAgICAgbWF4X2lkX3Rva2VuX2lhdF9vZmZzZXRfYWxsb3dlZF9pbl9zZWNvbmRzOiAzLFxyXG4gICAgICAgIGlzYXV0aG9yaXplZHJhY2VfdGltZW91dF9pbl9zZWNvbmRzOiA1LFxyXG4gICAgICAgIGRpc2FibGVfaWF0X29mZnNldF92YWxpZGF0aW9uOiBmYWxzZSxcclxuICAgICAgICBzdG9yYWdlOiB0eXBlb2YgU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgPyBzZXNzaW9uU3RvcmFnZSA6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgSU5JVElBTF9BVVRIV0VMTEtOT1dOOiBBdXRoV2VsbEtub3duRW5kcG9pbnRzID0ge1xyXG4gICAgICAgIGlzc3VlcjogJycsXHJcbiAgICAgICAgandrc191cmk6ICcnLFxyXG4gICAgICAgIGF1dGhvcml6YXRpb25fZW5kcG9pbnQ6ICcnLFxyXG4gICAgICAgIHRva2VuX2VuZHBvaW50OiAnJyxcclxuICAgICAgICB1c2VyaW5mb19lbmRwb2ludDogJycsXHJcbiAgICAgICAgZW5kX3Nlc3Npb25fZW5kcG9pbnQ6ICcnLFxyXG4gICAgICAgIGNoZWNrX3Nlc3Npb25faWZyYW1lOiAnJyxcclxuICAgICAgICByZXZvY2F0aW9uX2VuZHBvaW50OiAnJyxcclxuICAgICAgICBpbnRyb3NwZWN0aW9uX2VuZHBvaW50OiAnJyxcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBtZXJnZWRPcGVuSWRDb25maWd1cmF0aW9uOiBPcGVuSWRJbnRlcm5hbENvbmZpZ3VyYXRpb24gPSB0aGlzLkRFRkFVTFRfQ09ORklHO1xyXG4gICAgcHJpdmF0ZSBhdXRoV2VsbEtub3duRW5kcG9pbnRzOiBBdXRoV2VsbEtub3duRW5kcG9pbnRzID0gdGhpcy5JTklUSUFMX0FVVEhXRUxMS05PV047XHJcblxyXG4gICAgcHJpdmF0ZSBvbkNvbmZpZ3VyYXRpb25DaGFuZ2VJbnRlcm5hbCA9IG5ldyBTdWJqZWN0PE9wZW5JZENvbmZpZ3VyYXRpb24+KCk7XHJcblxyXG4gICAgZ2V0IG9wZW5JRENvbmZpZ3VyYXRpb24oKTogT3BlbklkSW50ZXJuYWxDb25maWd1cmF0aW9uIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZWRPcGVuSWRDb25maWd1cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3ZWxsS25vd25FbmRwb2ludHMoKTogQXV0aFdlbGxLbm93bkVuZHBvaW50cyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgb25Db25maWd1cmF0aW9uQ2hhbmdlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uQ29uZmlndXJhdGlvbkNoYW5nZUludGVybmFsLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxhdGZvcm1Qcm92aWRlcjogUGxhdGZvcm1Qcm92aWRlcikge31cclxuXHJcbiAgICBzZXR1cChcclxuICAgICAgICBwYXNzZWRPcGVuSWZDb25maWd1cmF0aW9uOiBPcGVuSWRDb25maWd1cmF0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICAgICAgICBwYXNzZWRBdXRoV2VsbEtub3duRW5kcG9pbnRzOiBBdXRoV2VsbEtub3duRW5kcG9pbnRzIHwgbnVsbCB8IHVuZGVmaW5lZFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5tZXJnZWRPcGVuSWRDb25maWd1cmF0aW9uID0geyAuLi50aGlzLm1lcmdlZE9wZW5JZENvbmZpZ3VyYXRpb24sIC4uLnBhc3NlZE9wZW5JZkNvbmZpZ3VyYXRpb24gfTtcclxuICAgICAgICB0aGlzLnNldFNwZWNpYWxDYXNlcyh0aGlzLm1lcmdlZE9wZW5JZENvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgIHRoaXMuYXV0aFdlbGxLbm93bkVuZHBvaW50cyA9IHsgLi4ucGFzc2VkQXV0aFdlbGxLbm93bkVuZHBvaW50cyB9O1xyXG4gICAgICAgIHRoaXMub25Db25maWd1cmF0aW9uQ2hhbmdlSW50ZXJuYWwubmV4dCh7IC4uLnRoaXMubWVyZ2VkT3BlbklkQ29uZmlndXJhdGlvbiB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFNwZWNpYWxDYXNlcyhjdXJyZW50Q29uZmlnOiBPcGVuSWRDb25maWd1cmF0aW9uKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBsYXRmb3JtUHJvdmlkZXIuaXNCcm93c2VyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb25maWcuc3RhcnRfY2hlY2tzZXNzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb25maWcuc2lsZW50X3JlbmV3ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb25maWcudXNlX3JlZnJlc2hfdG9rZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19