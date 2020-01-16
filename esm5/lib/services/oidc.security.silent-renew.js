/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
/** @type {?} */
var IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
var OidcSecuritySilentRenew = /** @class */ (function () {
    function OidcSecuritySilentRenew(loggerService, iFrameService) {
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
    }
    /**
     * @return {?}
     */
    OidcSecuritySilentRenew.prototype.initRenew = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        if (!existingIFrame) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        return existingIFrame;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    OidcSecuritySilentRenew.prototype.startRenew = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var sessionIframe = this.initRenew();
        this.loggerService.logDebug('startRenew for URL:' + url);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            /** @type {?} */
            var onLoadHandler = (/**
             * @return {?}
             */
            function () {
                sessionIframe.removeEventListener('load', onLoadHandler);
                observer.next(undefined);
                observer.complete();
            });
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.src = url;
            return (/**
             * @return {?}
             */
            function () {
                sessionIframe.removeEventListener('load', onLoadHandler);
            });
        }));
    };
    OidcSecuritySilentRenew.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecuritySilentRenew.ctorParameters = function () { return [
        { type: LoggerService },
        { type: IFrameService }
    ]; };
    return OidcSecuritySilentRenew;
}());
export { OidcSecuritySilentRenew };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcSecuritySilentRenew.prototype.loggerService;
    /**
     * @type {?}
     * @private
     */
    OidcSecuritySilentRenew.prototype.iFrameService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zaWxlbnQtcmVuZXcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS5zaWxlbnQtcmVuZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztJQUVoRCxrQ0FBa0MsR0FBRyx3QkFBd0I7QUFFbkU7SUFFSSxpQ0FBb0IsYUFBNEIsRUFBVSxhQUE0QjtRQUFsRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQzs7OztJQUUxRiwyQ0FBUzs7O0lBQVQ7O1lBQ1UsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsa0NBQWtDLENBQUM7UUFDL0YsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLENBQUMsQ0FBQztTQUN2RjtRQUNELE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsNENBQVU7Ozs7SUFBVixVQUFXLEdBQVc7O1lBQ1osYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDekQsT0FBTyxJQUFJLFVBQVU7Ozs7UUFBTyxVQUFBLFFBQVE7O2dCQUMxQixhQUFhOzs7WUFBRztnQkFDbEIsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDekQsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hCLENBQUMsQ0FBQTtZQUNELGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdEQsYUFBYSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDeEI7OztZQUFPO2dCQUNILGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxFQUFDO1FBQ04sQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOztnQkEzQkosVUFBVTs7OztnQkFKRixhQUFhO2dCQURiLGFBQWE7O0lBaUN0Qiw4QkFBQztDQUFBLEFBNUJELElBNEJDO1NBM0JZLHVCQUF1Qjs7Ozs7O0lBQ3BCLGdEQUFvQzs7Ozs7SUFBRSxnREFBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSUZyYW1lU2VydmljZSB9IGZyb20gJy4vZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIgPSAnbXlpRnJhbWVGb3JTaWxlbnRSZW5ldyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlTaWxlbnRSZW5ldyB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsIHByaXZhdGUgaUZyYW1lU2VydmljZTogSUZyYW1lU2VydmljZSkge31cclxuXHJcbiAgICBpbml0UmVuZXcoKTogSFRNTElGcmFtZUVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSUZyYW1lID0gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIpO1xyXG4gICAgICAgIGlmICghZXhpc3RpbmdJRnJhbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaUZyYW1lU2VydmljZS5hZGRJRnJhbWVUb1dpbmRvd0JvZHkoSUZSQU1FX0ZPUl9TSUxFTlRfUkVORVdfSURFTlRJRklFUik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBleGlzdGluZ0lGcmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydFJlbmV3KHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklmcmFtZSA9IHRoaXMuaW5pdFJlbmV3KCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdzdGFydFJlbmV3IGZvciBVUkw6JyArIHVybCk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPHZvaWQ+KG9ic2VydmVyID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb25Mb2FkSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlc3Npb25JZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZEhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2Vzc2lvbklmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkSGFuZGxlcik7XHJcbiAgICAgICAgICAgIHNlc3Npb25JZnJhbWUuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbklmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkSGFuZGxlcik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19