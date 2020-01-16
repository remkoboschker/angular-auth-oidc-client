/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
/** @type {?} */
const IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
export class OidcSecuritySilentRenew {
    /**
     * @param {?} loggerService
     * @param {?} iFrameService
     */
    constructor(loggerService, iFrameService) {
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
    }
    /**
     * @return {?}
     */
    initRenew() {
        /** @type {?} */
        const existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        if (!existingIFrame) {
            return this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        return existingIFrame;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    startRenew(url) {
        /** @type {?} */
        const sessionIframe = this.initRenew();
        this.loggerService.logDebug('startRenew for URL:' + url);
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            /** @type {?} */
            const onLoadHandler = (/**
             * @return {?}
             */
            () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
                observer.next(undefined);
                observer.complete();
            });
            sessionIframe.addEventListener('load', onLoadHandler);
            sessionIframe.src = url;
            return (/**
             * @return {?}
             */
            () => {
                sessionIframe.removeEventListener('load', onLoadHandler);
            });
        }));
    }
}
OidcSecuritySilentRenew.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecuritySilentRenew.ctorParameters = () => [
    { type: LoggerService },
    { type: IFrameService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5zaWxlbnQtcmVuZXcuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvb2lkYy5zZWN1cml0eS5zaWxlbnQtcmVuZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztNQUVoRCxrQ0FBa0MsR0FBRyx3QkFBd0I7QUFHbkUsTUFBTSxPQUFPLHVCQUF1Qjs7Ozs7SUFDaEMsWUFBb0IsYUFBNEIsRUFBVSxhQUE0QjtRQUFsRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQzs7OztJQUUxRixTQUFTOztjQUNDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLGtDQUFrQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDdkY7UUFDRCxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxHQUFXOztjQUNaLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSxVQUFVOzs7O1FBQU8sUUFBUSxDQUFDLEVBQUU7O2tCQUM3QixhQUFhOzs7WUFBRyxHQUFHLEVBQUU7Z0JBQ3ZCLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ3pELFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUE7WUFDRCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3RELGFBQWEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ3hCOzs7WUFBTyxHQUFHLEVBQUU7Z0JBQ1IsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RCxDQUFDLEVBQUM7UUFDTixDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7OztZQTNCSixVQUFVOzs7O1lBSkYsYUFBYTtZQURiLGFBQWE7Ozs7Ozs7SUFPTixnREFBb0M7Ozs7O0lBQUUsZ0RBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElGcmFtZVNlcnZpY2UgfSBmcm9tICcuL2V4aXN0aW5nLWlmcmFtZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4vb2lkYy5sb2dnZXIuc2VydmljZSc7XHJcblxyXG5jb25zdCBJRlJBTUVfRk9SX1NJTEVOVF9SRU5FV19JREVOVElGSUVSID0gJ215aUZyYW1lRm9yU2lsZW50UmVuZXcnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5U2lsZW50UmVuZXcge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLCBwcml2YXRlIGlGcmFtZVNlcnZpY2U6IElGcmFtZVNlcnZpY2UpIHt9XHJcblxyXG4gICAgaW5pdFJlbmV3KCk6IEhUTUxJRnJhbWVFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0lGcmFtZSA9IHRoaXMuaUZyYW1lU2VydmljZS5nZXRFeGlzdGluZ0lGcmFtZShJRlJBTUVfRk9SX1NJTEVOVF9SRU5FV19JREVOVElGSUVSKTtcclxuICAgICAgICBpZiAoIWV4aXN0aW5nSUZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlGcmFtZVNlcnZpY2UuYWRkSUZyYW1lVG9XaW5kb3dCb2R5KElGUkFNRV9GT1JfU0lMRU5UX1JFTkVXX0lERU5USUZJRVIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXhpc3RpbmdJRnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRSZW5ldyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHNlc3Npb25JZnJhbWUgPSB0aGlzLmluaXRSZW5ldygpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zygnc3RhcnRSZW5ldyBmb3IgVVJMOicgKyB1cmwpO1xyXG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTx2b2lkPihvYnNlcnZlciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9uTG9hZEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uSWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWRIYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNlc3Npb25JZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZEhhbmRsZXIpO1xyXG4gICAgICAgICAgICBzZXNzaW9uSWZyYW1lLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlc3Npb25JZnJhbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIG9uTG9hZEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==