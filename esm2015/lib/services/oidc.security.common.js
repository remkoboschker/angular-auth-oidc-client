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
        this.storageAuthResult = 'authorizationResult';
        this.storageAccessToken = 'authorizationData';
        this.storageIdToken = 'authorizationDataIdToken';
        this.storageIsAuthorized = '_isAuthorized';
        this.storageUserData = 'userData';
        this.storageAuthNonce = 'authNonce';
        this.storageCodeVerifier = 'code_verifier';
        this.storageAuthStateControl = 'authStateControl';
        this.storageSessionState = 'session_state';
        this.storageSilentRenewRunning = 'storage_silent_renew_running';
        this.storageCustomRequestParams = 'storage_custom_request_params';
    }
    /**
     * @return {?}
     */
    get authResult() {
        return this.retrieve(this.storageAuthResult);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authResult(value) {
        this.store(this.storageAuthResult, value);
    }
    /**
     * @return {?}
     */
    get accessToken() {
        return this.retrieve(this.storageAccessToken) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set accessToken(value) {
        this.store(this.storageAccessToken, value);
    }
    /**
     * @return {?}
     */
    get idToken() {
        return this.retrieve(this.storageIdToken) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set idToken(value) {
        this.store(this.storageIdToken, value);
    }
    /**
     * @return {?}
     */
    get isAuthorized() {
        return this.retrieve(this.storageIsAuthorized);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isAuthorized(value) {
        this.store(this.storageIsAuthorized, value);
    }
    /**
     * @return {?}
     */
    get userData() {
        return this.retrieve(this.storageUserData);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set userData(value) {
        this.store(this.storageUserData, value);
    }
    /**
     * @return {?}
     */
    get authNonce() {
        return this.retrieve(this.storageAuthNonce) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authNonce(value) {
        this.store(this.storageAuthNonce, value);
    }
    /**
     * @return {?}
     */
    get code_verifier() {
        return this.retrieve(this.storageCodeVerifier) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set code_verifier(value) {
        this.store(this.storageCodeVerifier, value);
    }
    /**
     * @return {?}
     */
    get authStateControl() {
        return this.retrieve(this.storageAuthStateControl) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set authStateControl(value) {
        this.store(this.storageAuthStateControl, value);
    }
    /**
     * @return {?}
     */
    get sessionState() {
        return this.retrieve(this.storageSessionState);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set sessionState(value) {
        this.store(this.storageSessionState, value);
    }
    /**
     * @return {?}
     */
    get silentRenewRunning() {
        return this.retrieve(this.storageSilentRenewRunning) || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set silentRenewRunning(value) {
        this.store(this.storageSilentRenewRunning, value);
    }
    /**
     * @return {?}
     */
    get customRequestParams() {
        return this.retrieve(this.storageCustomRequestParams);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set customRequestParams(value) {
        this.store(this.storageCustomRequestParams, value);
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
            this.store(this.storageAuthResult, '');
            this.store(this.storageSessionState, '');
            this.store(this.storageSilentRenewRunning, '');
            this.store(this.storageIsAuthorized, false);
            this.store(this.storageAccessToken, '');
            this.store(this.storageIdToken, '');
            this.store(this.storageUserData, '');
            this.store(this.storageCodeVerifier, '');
        }
    }
    /**
     * @return {?}
     */
    getAccessToken() {
        return this.retrieve(this.storageAccessToken);
    }
    /**
     * @return {?}
     */
    getIdToken() {
        return this.retrieve(this.storageIdToken);
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
    OidcSecurityCommon.prototype.storageAuthResult;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageAccessToken;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageIdToken;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageIsAuthorized;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageUserData;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageAuthNonce;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageCodeVerifier;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageAuthStateControl;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageSessionState;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageSilentRenewRunning;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.storageCustomRequestParams;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCommon.prototype.oidcSecurityStorage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jb21tb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS5jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFLOUQsTUFBTSxPQUFPLGtCQUFrQjs7OztJQWlIM0IsWUFBb0IsbUJBQXdDO1FBQXhDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFoSHBELHNCQUFpQixHQUFHLHFCQUFxQixDQUFDO1FBVTFDLHVCQUFrQixHQUFHLG1CQUFtQixDQUFDO1FBVXpDLG1CQUFjLEdBQUcsMEJBQTBCLENBQUM7UUFVNUMsd0JBQW1CLEdBQUcsZUFBZSxDQUFDO1FBVXRDLG9CQUFlLEdBQUcsVUFBVSxDQUFDO1FBVTdCLHFCQUFnQixHQUFHLFdBQVcsQ0FBQztRQVUvQix3QkFBbUIsR0FBRyxlQUFlLENBQUM7UUFVdEMsNEJBQXVCLEdBQUcsa0JBQWtCLENBQUM7UUFVN0Msd0JBQW1CLEdBQUcsZUFBZSxDQUFDO1FBVXRDLDhCQUF5QixHQUFHLDhCQUE4QixDQUFDO1FBVTNELCtCQUEwQixHQUFHLCtCQUErQixDQUFDO0lBWU4sQ0FBQzs7OztJQTlHaEUsSUFBVyxVQUFVO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7OztJQUVELElBQVcsVUFBVSxDQUFDLEtBQVU7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7OztJQUlELElBQVcsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hELENBQUM7Ozs7O0lBRUQsSUFBVyxXQUFXLENBQUMsS0FBYTtRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7O0lBSUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEQsQ0FBQzs7Ozs7SUFFRCxJQUFXLE9BQU8sQ0FBQyxLQUFhO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7O0lBSUQsSUFBVyxZQUFZO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7OztJQUVELElBQVcsWUFBWSxDQUFDLEtBQTBCO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7SUFJRCxJQUFXLFFBQVE7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBRUQsSUFBVyxRQUFRLENBQUMsS0FBVTtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7OztJQUlELElBQVcsU0FBUztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RELENBQUM7Ozs7O0lBRUQsSUFBVyxTQUFTLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDOzs7O0lBSUQsSUFBVyxhQUFhO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekQsQ0FBQzs7Ozs7SUFFRCxJQUFXLGFBQWEsQ0FBQyxLQUFhO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7SUFJRCxJQUFXLGdCQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdELENBQUM7Ozs7O0lBRUQsSUFBVyxnQkFBZ0IsQ0FBQyxLQUFhO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BELENBQUM7Ozs7SUFJRCxJQUFXLFlBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Ozs7O0lBRUQsSUFBVyxZQUFZLENBQUMsS0FBVTtRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs7O0lBSUQsSUFBVyxrQkFBa0I7UUFDekIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvRCxDQUFDOzs7OztJQUVELElBQVcsa0JBQWtCLENBQUMsS0FBdUI7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7OztJQUlELElBQVcsbUJBQW1CO1FBRzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7OztJQUVELElBQVcsbUJBQW1CLENBQUMsS0FBbUQ7UUFDOUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7Ozs7O0lBSU8sUUFBUSxDQUFDLEdBQVc7UUFDeEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7Ozs7SUFFTyxLQUFLLENBQUMsR0FBVyxFQUFFLEtBQVU7UUFDakMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxjQUF1QjtRQUNwQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDNUM7SUFDTCxDQUFDOzs7O0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxDQUFDOzs7O0lBRUQsVUFBVTtRQUNOLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7OztJQUVELGVBQWU7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO0lBQ3pDLENBQUM7OztZQW5KSixVQUFVOzs7O1lBSkYsbUJBQW1COzs7Ozs7O0lBTXhCLCtDQUFrRDs7Ozs7SUFVbEQsZ0RBQWlEOzs7OztJQVVqRCw0Q0FBb0Q7Ozs7O0lBVXBELGlEQUE4Qzs7Ozs7SUFVOUMsNkNBQXFDOzs7OztJQVVyQyw4Q0FBdUM7Ozs7O0lBVXZDLGlEQUE4Qzs7Ozs7SUFVOUMscURBQXFEOzs7OztJQVVyRCxpREFBOEM7Ozs7O0lBVTlDLHVEQUFtRTs7Ozs7SUFVbkUsd0RBQXFFOzs7OztJQVl6RCxpREFBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9pZGNTZWN1cml0eVN0b3JhZ2UgfSBmcm9tICcuL29pZGMuc2VjdXJpdHkuc3RvcmFnZSc7XHJcblxyXG5leHBvcnQgdHlwZSBTaWxlbnRSZW5ld1N0YXRlID0gJ3J1bm5pbmcnIHwgJyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlDb21tb24ge1xyXG4gICAgcHJpdmF0ZSBzdG9yYWdlQXV0aFJlc3VsdCA9ICdhdXRob3JpemF0aW9uUmVzdWx0JztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGF1dGhSZXN1bHQoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VBdXRoUmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGF1dGhSZXN1bHQodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlQXV0aFJlc3VsdCwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZUFjY2Vzc1Rva2VuID0gJ2F1dGhvcml6YXRpb25EYXRhJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFjY2Vzc1Rva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlQWNjZXNzVG9rZW4pIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgYWNjZXNzVG9rZW4odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlQWNjZXNzVG9rZW4sIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VJZFRva2VuID0gJ2F1dGhvcml6YXRpb25EYXRhSWRUb2tlbic7XHJcblxyXG4gICAgcHVibGljIGdldCBpZFRva2VuKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlSWRUb2tlbikgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBpZFRva2VuKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZUlkVG9rZW4sIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VJc0F1dGhvcml6ZWQgPSAnX2lzQXV0aG9yaXplZCc7XHJcblxyXG4gICAgcHVibGljIGdldCBpc0F1dGhvcml6ZWQoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlSXNBdXRob3JpemVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGlzQXV0aG9yaXplZCh2YWx1ZTogYm9vbGVhbiB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlSXNBdXRob3JpemVkLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlVXNlckRhdGEgPSAndXNlckRhdGEnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgdXNlckRhdGEoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VVc2VyRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB1c2VyRGF0YSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VVc2VyRGF0YSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZUF1dGhOb25jZSA9ICdhdXRoTm9uY2UnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYXV0aE5vbmNlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlQXV0aE5vbmNlKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGF1dGhOb25jZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VBdXRoTm9uY2UsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3JhZ2VDb2RlVmVyaWZpZXIgPSAnY29kZV92ZXJpZmllcic7XHJcblxyXG4gICAgcHVibGljIGdldCBjb2RlX3ZlcmlmaWVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlQ29kZVZlcmlmaWVyKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNvZGVfdmVyaWZpZXIodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlQ29kZVZlcmlmaWVyLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlQXV0aFN0YXRlQ29udHJvbCA9ICdhdXRoU3RhdGVDb250cm9sJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGF1dGhTdGF0ZUNvbnRyb2woKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXRyaWV2ZSh0aGlzLnN0b3JhZ2VBdXRoU3RhdGVDb250cm9sKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGF1dGhTdGF0ZUNvbnRyb2wodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlQXV0aFN0YXRlQ29udHJvbCwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZVNlc3Npb25TdGF0ZSA9ICdzZXNzaW9uX3N0YXRlJztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlc3Npb25TdGF0ZSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHJpZXZlKHRoaXMuc3RvcmFnZVNlc3Npb25TdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzZXNzaW9uU3RhdGUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc3RvcmUodGhpcy5zdG9yYWdlU2Vzc2lvblN0YXRlLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yYWdlU2lsZW50UmVuZXdSdW5uaW5nID0gJ3N0b3JhZ2Vfc2lsZW50X3JlbmV3X3J1bm5pbmcnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgc2lsZW50UmVuZXdSdW5uaW5nKCk6IFNpbGVudFJlbmV3U3RhdGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHJpZXZlKHRoaXMuc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZykgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzaWxlbnRSZW5ld1J1bm5pbmcodmFsdWU6IFNpbGVudFJlbmV3U3RhdGUpIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMgPSAnc3RvcmFnZV9jdXN0b21fcmVxdWVzdF9wYXJhbXMnO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY3VzdG9tUmVxdWVzdFBhcmFtcygpOiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbjtcclxuICAgIH0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHJpZXZlKHRoaXMuc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY3VzdG9tUmVxdWVzdFBhcmFtcyh2YWx1ZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIH0pIHtcclxuICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZUN1c3RvbVJlcXVlc3RQYXJhbXMsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9pZGNTZWN1cml0eVN0b3JhZ2U6IE9pZGNTZWN1cml0eVN0b3JhZ2UpIHt9XHJcblxyXG4gICAgcHJpdmF0ZSByZXRyaWV2ZShrZXk6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2lkY1NlY3VyaXR5U3RvcmFnZS5yZWFkKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdG9yZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMub2lkY1NlY3VyaXR5U3RvcmFnZS53cml0ZShrZXksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFN0b3JhZ2VEYXRhKGlzUmVuZXdQcm9jZXNzOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFpc1JlbmV3UHJvY2Vzcykge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZUF1dGhSZXN1bHQsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VTZXNzaW9uU3RhdGUsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VTaWxlbnRSZW5ld1J1bm5pbmcsICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VJc0F1dGhvcml6ZWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VBY2Nlc3NUb2tlbiwgJycpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZUlkVG9rZW4sICcnKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSh0aGlzLnN0b3JhZ2VVc2VyRGF0YSwgJycpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlKHRoaXMuc3RvcmFnZUNvZGVWZXJpZmllciwgJycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBY2Nlc3NUb2tlbigpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJldHJpZXZlKHRoaXMuc3RvcmFnZUFjY2Vzc1Rva2VuKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZFRva2VuKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmV0cmlldmUodGhpcy5zdG9yYWdlSWRUb2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UmVmcmVzaFRva2VuKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFJlc3VsdC5yZWZyZXNoX3Rva2VuO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==