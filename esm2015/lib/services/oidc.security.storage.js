/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from './auth-configuration.provider';
/**
 * Implement this class-interface to create a custom storage.
 * @abstract
 */
export class OidcSecurityStorage {
}
OidcSecurityStorage.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * This method must contain the logic to read the storage.
     * @abstract
     * @param {?} key
     * @return {?} The value of the given key
     */
    OidcSecurityStorage.prototype.read = function (key) { };
    /**
     * This method must contain the logic to write the storage.
     * @abstract
     * @param {?} key
     * @param {?} value The value for the given key
     * @return {?}
     */
    OidcSecurityStorage.prototype.write = function (key, value) { };
}
export class BrowserStorage {
    /**
     * @param {?} configProvider
     */
    constructor(configProvider) {
        this.configProvider = configProvider;
        this.hasStorage = typeof Storage !== 'undefined';
    }
    /**
     * @param {?} key
     * @return {?}
     */
    read(key) {
        if (this.hasStorage) {
            return JSON.parse(this.configProvider.openIDConfiguration.storage.getItem(key + '_' + this.configProvider.openIDConfiguration.client_id));
        }
        return;
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    write(key, value) {
        if (this.hasStorage) {
            value = value === undefined ? null : value;
            this.configProvider.openIDConfiguration.storage.setItem(key + '_' + this.configProvider.openIDConfiguration.client_id, JSON.stringify(value));
        }
    }
}
BrowserStorage.decorators = [
    { type: Injectable }
];
/** @nocollapse */
BrowserStorage.ctorParameters = () => [
    { type: ConfigurationProvider }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    BrowserStorage.prototype.hasStorage;
    /**
     * @type {?}
     * @private
     */
    BrowserStorage.prototype.configProvider;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zdG9yYWdlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuc3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7QUFNdEUsTUFBTSxPQUFnQixtQkFBbUI7OztZQUR4QyxVQUFVOzs7Ozs7Ozs7SUFPUCx3REFBdUM7Ozs7Ozs7O0lBT3ZDLGdFQUFxRDs7QUFJekQsTUFBTSxPQUFPLGNBQWM7Ozs7SUFHdkIsWUFBb0IsY0FBcUM7UUFBckMsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDO0lBQ3JELENBQUM7Ozs7O0lBRU0sSUFBSSxDQUFDLEdBQVc7UUFDbkIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDN0k7UUFFRCxPQUFPO0lBQ1gsQ0FBQzs7Ozs7O0lBRU0sS0FBSyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ2hDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixLQUFLLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDM0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUNuRCxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUN4QixDQUFDO1NBQ0w7SUFDTCxDQUFDOzs7WUF4QkosVUFBVTs7OztZQXRCRixxQkFBcUI7Ozs7Ozs7SUF3QjFCLG9DQUE0Qjs7Ozs7SUFFaEIsd0NBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuL2F1dGgtY29uZmlndXJhdGlvbi5wcm92aWRlcic7XHJcblxyXG4vKipcclxuICogSW1wbGVtZW50IHRoaXMgY2xhc3MtaW50ZXJmYWNlIHRvIGNyZWF0ZSBhIGN1c3RvbSBzdG9yYWdlLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgT2lkY1NlY3VyaXR5U3RvcmFnZSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoaXMgbWV0aG9kIG11c3QgY29udGFpbiB0aGUgbG9naWMgdG8gcmVhZCB0aGUgc3RvcmFnZS5cclxuICAgICAqIEBwYXJhbSBrZXlcclxuICAgICAqIEByZXR1cm4gVGhlIHZhbHVlIG9mIHRoZSBnaXZlbiBrZXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlYWQoa2V5OiBzdHJpbmcpOiBhbnk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBtdXN0IGNvbnRhaW4gdGhlIGxvZ2ljIHRvIHdyaXRlIHRoZSBzdG9yYWdlLlxyXG4gICAgICogQHBhcmFtIGtleVxyXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgd3JpdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBCcm93c2VyU3RvcmFnZSBpbXBsZW1lbnRzIE9pZGNTZWN1cml0eVN0b3JhZ2Uge1xyXG4gICAgcHJpdmF0ZSBoYXNTdG9yYWdlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcikge1xyXG4gICAgICAgIHRoaXMuaGFzU3RvcmFnZSA9IHR5cGVvZiBTdG9yYWdlICE9PSAndW5kZWZpbmVkJztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVhZChrZXk6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU3RvcmFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmNvbmZpZ1Byb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RvcmFnZS5nZXRJdGVtKGtleSArICdfJyArIHRoaXMuY29uZmlnUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgd3JpdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNTdG9yYWdlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jb25maWdQcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICAgICAgICAgIGtleSArICdfJyArIHRoaXMuY29uZmlnUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5jbGllbnRfaWQsXHJcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19