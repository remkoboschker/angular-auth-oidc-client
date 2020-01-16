/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { OidcSecurityStorage } from './oidc.security.storage';
export class OidcSecurityCommon {
    /**
     * @param {?} oidcSecurityStorage
     */
    constructor(oidcSecurityStorage) {
        this.oidcSecurityStorage = oidcSecurityStorage;
        this.storage_auth_result = 'authorizationResult';
        this.storage_access_token = 'authorizationData';
        this.storage_id_token = 'authorizationDataIdToken';
        this.storage_is_authorized = '_isAuthorized';
        this.storage_user_data = 'userData';
        this.storage_auth_nonce = 'authNonce';
        this.storage_code_verifier = 'code_verifier';
        this.storage_auth_state_control = 'authStateControl';
        this.storage_session_state = 'session_state';
        this.storage_silent_renew_running = 'storage_silent_renew_running';
        this.storage_custom_request_params = 'storage_custom_request_params';
    }
    /**
     * @return {?}
     */
    get authResult() {
        return this.retrieve(this.storage_auth_result);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authResult(value) {
        this.store(this.storage_auth_result, value);
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.retrieve(this.storage_access_token) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set accessToken(value) {
        this.store(this.storage_access_token, value);
    }
    /**
     * @return {?}
     */
    get idToken() {
        return this.retrieve(this.storage_id_token) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set idToken(value) {
        this.store(this.storage_id_token, value);
    }
    /**
     * @return {?}
     */
    get isAuthorized() {
        return this.retrieve(this.storage_is_authorized);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isAuthorized(value) {
        this.store(this.storage_is_authorized, value);
    }
    /**
     * @return {?}
     */
    get userData() {
        return this.retrieve(this.storage_user_data);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set userData(value) {
        this.store(this.storage_user_data, value);
    }
    /**
     * @return {?}
     */
    get authNonce() {
        return this.retrieve(this.storage_auth_nonce) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authNonce(value) {
        this.store(this.storage_auth_nonce, value);
    }
    /**
     * @return {?}
     */
    get code_verifier() {
        return this.retrieve(this.storage_code_verifier) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set code_verifier(value) {
        this.store(this.storage_code_verifier, value);
    }
    /**
     * @return {?}
     */
    get authStateControl() {
        return this.retrieve(this.storage_auth_state_control) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authStateControl(value) {
        this.store(this.storage_auth_state_control, value);
    }
    /**
     * @return {?}
     */
    get sessionState() {
        return this.retrieve(this.storage_session_state);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set sessionState(value) {
        this.store(this.storage_session_state, value);
    }
    /**
     * @return {?}
     */
    get silentRenewRunning() {
        return this.retrieve(this.storage_silent_renew_running) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set silentRenewRunning(value) {
        this.store(this.storage_silent_renew_running, value);
    }
    /**
     * @return {?}
     */
    get customRequestParams() {
        return this.retrieve(this.storage_custom_request_params);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set customRequestParams(value) {
        this.store(this.storage_custom_request_params, value);
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    retrieve(key) {
        return this.oidcSecurityStorage.read(key);
    }
    /**
     * @private
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    store(key, value) {
        this.oidcSecurityStorage.write(key, value);
    }
    /**
     * @param {?} isRenewProcess
     * @return {?}
     */
    resetStorageData(isRenewProcess) {
        if (!isRenewProcess) {
            this.store(this.storage_auth_result, '');
            this.store(this.storage_session_state, '');
            this.store(this.storage_silent_renew_running, '');
            this.store(this.storage_is_authorized, false);
            this.store(this.storage_access_token, '');
            this.store(this.storage_id_token, '');
            this.store(this.storage_user_data, '');
            this.store(this.storage_code_verifier, '');
        }
    }
    /**
     * @return {?}
     */
    getAccessToken() {
        return this.retrieve(this.storage_access_token);
    }
    /**
     * @return {?}
     */
    getIdToken() {
        return this.retrieve(this.storage_id_token);
    }
    /**
     * @return {?}
     */
    getRefreshToken() {
        return this.authResult.refresh_token;
    }
}
OidcSecurityCommon.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityCommon.ctorParameters = () => [
    { type: OidcSecurityStorage }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_auth_result;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_access_token;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_id_token;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_is_authorized;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_user_data;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_auth_nonce;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_code_verifier;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_auth_state_control;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_session_state;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_silent_renew_running;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storage_custom_request_params;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.oidcSecurityStorage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jb21tb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS5jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFLOUQsTUFBTSxPQUFPLGtCQUFrQjs7OztJQWlIM0IsWUFBb0IsbUJBQXdDO1FBQXhDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFoSHBELHdCQUFtQixHQUFHLHFCQUFxQixDQUFDO1FBVTVDLHlCQUFvQixHQUFHLG1CQUFtQixDQUFDO1FBVTNDLHFCQUFnQixHQUFHLDBCQUEwQixDQUFDO1FBVTlDLDBCQUFxQixHQUFHLGVBQWUsQ0FBQztRQVV4QyxzQkFBaUIsR0FBRyxVQUFVLENBQUM7UUFVL0IsdUJBQWtCLEdBQUcsV0FBVyxDQUFDO1FBVWpDLDBCQUFxQixHQUFHLGVBQWUsQ0FBQztRQVV4QywrQkFBMEIsR0FBRyxrQkFBa0IsQ0FBQztRQVVoRCwwQkFBcUIsR0FBRyxlQUFlLENBQUM7UUFVeEMsaUNBQTRCLEdBQUcsOEJBQThCLENBQUM7UUFVOUQsa0NBQTZCLEdBQUcsK0JBQStCLENBQUM7SUFZUixDQUFDOzs7O0lBOUdqRSxJQUFXLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRUQsSUFBVyxVQUFVLENBQUMsS0FBVTtRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs7O0lBSUQsSUFBVyxXQUFXO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEs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LENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Ozs7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7SUFFRCxlQUFlO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztJQUN6QyxDQUFDOzs7WUFuSkosVUFBVTs7OztZQUpGLG1CQUFtQjs7Ozs7OztJQU14QixpREFBb0Q7Ozs7O0lBVXBELGtEQUFtRDs7Ozs7SUFVbkQsOENBQXNEOzs7OztJQVV0RCxtREFBZ0Q7Ozs7O0lBVWhELCtDQUF1Qzs7Ozs7SUFVdkMsZ0RBQXlDOzs7OztJQVV6QyxtREFBZ0Q7Ozs7O0lBVWhELHdEQUF3RDs7Ozs7SUFVeEQsbURBQWdEOzs7OztJQVVoRCwwREFBc0U7Ozs7O0lBVXRFLDJEQUF3RTs7Ozs7SUFZNUQsaURBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlTdG9yYWdlIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LnN0b3JhZ2UnO1xyXG5cclxuZXhwb3J0IHR5cGUgU2lsZW50UmVuZXdTdGF0ZSA9ICdydW5uaW5nJyB8ICcnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5Q29tbW9uIHtcclxuICAgIHByaXZhdGUgc3RvcmFnZV9hdXRoX3Jlc3VsdCA9ICdhdXRob3JpemF0aW9uUmVzdWx0JztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGF1dGhSZXN1bHQoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VfYXV0aF9yZXN1bHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgYXV0aFJlc3VsdCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfYXV0aF9yZXN1bHQsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VfYWNjZXNzX3Rva2VuID0gJ2F1dGhvcml6YXRpb25EYXRhJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2FjY2Vzc190b2tlbikgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBhY2Nlc3NUb2tlbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfYWNjZXNzX3Rva2VuLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlX2lkX3Rva2VuID0gJ2F1dGhvcml6YXRpb25EYXRhSWRUb2tlbic7XHJcblxyXG4gICAgcHVibGljIGdldCBpZFRva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2lkX3Rva2VuKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGlkVG9rZW4odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlX2lkX3Rva2VuLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlX2lzX2F1dGhvcml6ZWQgPSAnX2lzQXV0aG9yaXplZCc7XHJcblxyXG4gICAgcHVibGljIGdldCBpc0F1dGhvcml6ZWQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2lzX2F1dGhvcml6ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgaXNBdXRob3JpemVkKHZhbHVlOiBib29sZWFuIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfaXNfYXV0aG9yaXplZCwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZV91c2VyX2RhdGEgPSAndXNlckRhdGEnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgdXNlckRhdGEoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VfdXNlcl9kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHVzZXJEYXRhKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZV91c2VyX2RhdGEsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VfYXV0aF9ub25jZSA9ICdhdXRoTm9uY2UnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYXV0aE5vbmNlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2F1dGhfbm9uY2UpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgYXV0aE5vbmNlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZV9hdXRoX25vbmNlLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlX2NvZGVfdmVyaWZpZXIgPSAnY29kZV92ZXJpZmllcic7XHJcblxyXG4gICAgcHVibGljIGdldCBjb2RlX3ZlcmlmaWVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2NvZGVfdmVyaWZpZXIpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY29kZV92ZXJpZmllcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfY29kZV92ZXJpZmllciwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZV9hdXRoX3N0YXRlX2NvbnRyb2wgPSAnYXV0aFN0YXRlQ29udHJvbCc7XHJcblxyXG4gICAgcHVibGljIGdldCBhdXRoU3RhdGVDb250cm9sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2F1dGhfc3RhdGVfY29udHJvbCkgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBhdXRoU3RhdGVDb250cm9sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZV9hdXRoX3N0YXRlX2NvbnRyb2wsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2Vfc2Vzc2lvbl9zdGF0ZSA9ICdzZXNzaW9uX3N0YXRlJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlc3Npb25TdGF0ZSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHJpZXZlKHRoaXMuc3RvcmFnZV9zZXNzaW9uX3N0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNlc3Npb25TdGF0ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2Vfc2Vzc2lvbl9zdGF0ZSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZV9zaWxlbnRfcmVuZXdfcnVubmluZyA9ICdzdG9yYWdlX3NpbGVudF9yZW5ld19ydW5uaW5nJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNpbGVudFJlbmV3UnVubmluZygpOiBTaWxlbnRSZW5ld1N0YXRlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2Vfc2lsZW50X3JlbmV3X3J1bm5pbmcpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2lsZW50UmVuZXdSdW5uaW5nKHZhbHVlOiBTaWxlbnRSZW5ld1N0YXRlKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2Vfc2lsZW50X3JlbmV3X3J1bm5pbmcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VfY3VzdG9tX3JlcXVlc3RfcGFyYW1zID0gJ3N0b3JhZ2VfY3VzdG9tX3JlcXVlc3RfcGFyYW1zJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGN1c3RvbVJlcXVlc3RQYXJhbXMoKToge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW47XHJcbiAgICB9IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VfY3VzdG9tX3JlcXVlc3RfcGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGN1c3RvbVJlcXVlc3RQYXJhbXModmFsdWU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9KSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfY3VzdG9tX3JlcXVlc3RfcGFyYW1zLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBvaWRjU2VjdXJpdHlTdG9yYWdlOiBPaWRjU2VjdXJpdHlTdG9yYWdlKSB7IH1cclxuXHJcbiAgICBwcml2YXRlIHJldHJpZXZlKGtleTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vaWRjU2VjdXJpdHlTdG9yYWdlLnJlYWQoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5vaWRjU2VjdXJpdHlTdG9yYWdlLndyaXRlKGtleSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0U3RvcmFnZURhdGEoaXNSZW5ld1Byb2Nlc3M6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIWlzUmVuZXdQcm9jZXNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlX2F1dGhfcmVzdWx0LCAnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlX3Nlc3Npb25fc3RhdGUsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2Vfc2lsZW50X3JlbmV3X3J1bm5pbmcsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfaXNfYXV0aG9yaXplZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZV9hY2Nlc3NfdG9rZW4sICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfaWRfdG9rZW4sICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VfdXNlcl9kYXRhLCAnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlX2NvZGVfdmVyaWZpZXIsICcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWNjZXNzVG9rZW4oKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VfYWNjZXNzX3Rva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFRva2VuKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlX2lkX3Rva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSZWZyZXNoVG9rZW4oKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdXRoUmVzdWx0LnJlZnJlc2hfdG9rZW47XHJcbiAgICB9XHJcbn1cclxuIl19