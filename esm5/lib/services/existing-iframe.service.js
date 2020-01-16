/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { LoggerService } from './oidc.logger.service';
var IFrameService = /** @class */ (function () {
    function IFrameService(loggerService) {
        this.loggerService = loggerService;
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getExistingIFrame = /**
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (this.isIFrameElement(iFrameOnParent)) {
            return iFrameOnParent;
        }
        /** @type {?} */
        var iFrameOnSelf = this.getIFrameFromWindow(identifier);
        if (this.isIFrameElement(iFrameOnSelf)) {
            return iFrameOnSelf;
        }
        return null;
    };
    /**
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.addIFrameToWindowBody = /**
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var sessionIframe = window.document.createElement('iframe');
        sessionIframe.id = identifier;
        this.loggerService.logDebug(sessionIframe);
        sessionIframe.style.display = 'none';
        window.document.body.appendChild(sessionIframe);
        return sessionIframe;
    };
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getIFrameFromParentWindow = /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        try {
            /** @type {?} */
            var iFrameElement = window.parent.document.getElementById(identifier);
            if (this.isIFrameElement(iFrameElement)) {
                return iFrameElement;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    };
    /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    IFrameService.prototype.getIFrameFromWindow = /**
     * @private
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        /** @type {?} */
        var iFrameElement = window.document.getElementById(identifier);
        if (this.isIFrameElement(iFrameElement)) {
            return iFrameElement;
        }
        return null;
    };
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    IFrameService.prototype.isIFrameElement = /**
     * @private
     * @param {?} element
     * @return {?}
     */
    function (element) {
        return !!element && element instanceof HTMLIFrameElement;
    };
    IFrameService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    IFrameService.ctorParameters = function () { return [
        { type: LoggerService }
    ]; };
    return IFrameService;
}());
export { IFrameService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    IFrameService.prototype.loggerService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXREO0lBRUksdUJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQzs7Ozs7SUFFcEQseUNBQWlCOzs7O0lBQWpCLFVBQWtCLFVBQWtCOztZQUMxQixjQUFjLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQztRQUNqRSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDdEMsT0FBTyxjQUFjLENBQUM7U0FDekI7O1lBQ0ssWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BDLE9BQU8sWUFBWSxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7SUFFRCw2Q0FBcUI7Ozs7SUFBckIsVUFBc0IsVUFBa0I7O1lBQzlCLGFBQWEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDN0QsYUFBYSxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0MsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDOzs7Ozs7SUFFTyxpREFBeUI7Ozs7O0lBQWpDLFVBQWtDLFVBQWtCO1FBQ2hELElBQUk7O2dCQUNNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO1lBQ3ZFLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDckMsT0FBTyxhQUFhLENBQUM7YUFDeEI7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sMkNBQW1COzs7OztJQUEzQixVQUE0QixVQUFrQjs7WUFDcEMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztRQUNoRSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDckMsT0FBTyxhQUFhLENBQUM7U0FDeEI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOzs7Ozs7SUFFTyx1Q0FBZTs7Ozs7SUFBdkIsVUFBd0IsT0FBMkI7UUFDL0MsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sWUFBWSxpQkFBaUIsQ0FBQztJQUM3RCxDQUFDOztnQkEvQ0osVUFBVTs7OztnQkFGRixhQUFhOztJQWtEdEIsb0JBQUM7Q0FBQSxBQWhERCxJQWdEQztTQS9DWSxhQUFhOzs7Ozs7SUFDVixzQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL29pZGMubG9nZ2VyLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgSUZyYW1lU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UpIHt9XHJcblxyXG4gICAgZ2V0RXhpc3RpbmdJRnJhbWUoaWRlbnRpZmllcjogc3RyaW5nKTogSFRNTElGcmFtZUVsZW1lbnQgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBpRnJhbWVPblBhcmVudCA9IHRoaXMuZ2V0SUZyYW1lRnJvbVBhcmVudFdpbmRvdyhpZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lT25QYXJlbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpRnJhbWVPblBhcmVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaUZyYW1lT25TZWxmID0gdGhpcy5nZXRJRnJhbWVGcm9tV2luZG93KGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSUZyYW1lRWxlbWVudChpRnJhbWVPblNlbGYpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpRnJhbWVPblNlbGY7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZElGcmFtZVRvV2luZG93Qm9keShpZGVudGlmaWVyOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3Qgc2Vzc2lvbklmcmFtZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICBzZXNzaW9uSWZyYW1lLmlkID0gaWRlbnRpZmllcjtcclxuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoc2Vzc2lvbklmcmFtZSk7XHJcbiAgICAgICAgc2Vzc2lvbklmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNlc3Npb25JZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiBzZXNzaW9uSWZyYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0SUZyYW1lRnJvbVBhcmVudFdpbmRvdyhpZGVudGlmaWVyOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlGcmFtZUVsZW1lbnQgPSB3aW5kb3cucGFyZW50LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0lGcmFtZUVsZW1lbnQoaUZyYW1lRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpRnJhbWVFbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0SUZyYW1lRnJvbVdpbmRvdyhpZGVudGlmaWVyOiBzdHJpbmcpOiBIVE1MSUZyYW1lRWxlbWVudCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGlGcmFtZUVsZW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJRnJhbWVFbGVtZW50KGlGcmFtZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpRnJhbWVFbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzSUZyYW1lRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwpOiBlbGVtZW50IGlzIEhUTUxJRnJhbWVFbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gISFlbGVtZW50ICYmIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudDtcclxuICAgIH1cclxufVxyXG4iXX0=