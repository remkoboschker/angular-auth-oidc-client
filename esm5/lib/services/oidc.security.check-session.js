/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, NgZone } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigurationProvider } from './auth-configuration.provider';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
/** @type {?} */
var IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
var OidcSecurityCheckSession = /** @class */ (function () {
    function OidcSecurityCheckSession(oidcSecurityCommon, loggerService, iFrameService, zone, configurationProvider) {
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.zone = zone;
        this.configurationProvider = configurationProvider;
        this.lastIFrameRefresh = 0;
        this.outstandingMessages = 0;
        this.heartBeatInterval = 3000;
        this.iframeRefreshInterval = 60000;
        this.checkSessionChanged = new Subject();
    }
    Object.defineProperty(OidcSecurityCheckSession.prototype, "onCheckSessionChanged", {
        get: /**
         * @return {?}
         */
        function () {
            return this.checkSessionChanged.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.doesSessionExist = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        if (!existingIFrame) {
            return false;
        }
        this.sessionIframe = existingIFrame;
        return true;
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.init = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
            return from([this]);
        }
        if (!this.doesSessionExist()) {
            this.sessionIframe = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
            this.iframeMessageEvent = this.messageHandler.bind(this);
            window.addEventListener('message', this.iframeMessageEvent, false);
        }
        if (!this.configurationProvider.wellKnownEndpoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined. Returning.');
            return;
        }
        if (this.configurationProvider.wellKnownEndpoints.check_session_iframe) {
            this.sessionIframe.contentWindow.location.replace(this.configurationProvider.wellKnownEndpoints.check_session_iframe);
        }
        else {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
        }
        return Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            _this.sessionIframe.onload = (/**
             * @return {?}
             */
            function () {
                _this.lastIFrameRefresh = Date.now();
                observer.next(_this);
                observer.complete();
            });
        }));
    };
    /**
     * @param {?} clientId
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.startCheckingSession = /**
     * @param {?} clientId
     * @return {?}
     */
    function (clientId) {
        if (this.scheduledHeartBeat) {
            return;
        }
        this.pollServerSession(clientId);
    };
    /**
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.stopCheckingSession = /**
     * @return {?}
     */
    function () {
        if (!this.scheduledHeartBeat) {
            return;
        }
        this.clearScheduledHeartBeat();
    };
    /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.pollServerSession = /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    function (clientId) {
        var _this = this;
        /** @type {?} */
        var pollServerSessionRecur = (/**
         * @return {?}
         */
        function () {
            _this.init()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            function () {
                if (_this.sessionIframe && clientId) {
                    _this.loggerService.logDebug(_this.sessionIframe);
                    /** @type {?} */
                    var sessionState = _this.oidcSecurityCommon.sessionState;
                    if (sessionState) {
                        _this.outstandingMessages++;
                        _this.sessionIframe.contentWindow.postMessage(clientId + ' ' + sessionState, _this.configurationProvider.openIDConfiguration.stsServer);
                    }
                    else {
                        _this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        _this.checkSessionChanged.next();
                    }
                }
                else {
                    _this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession sessionIframe does not exist');
                    _this.loggerService.logDebug(clientId);
                    _this.loggerService.logDebug(_this.sessionIframe);
                    // this.init();
                }
                // after sending three messages with no response, fail.
                if (_this.outstandingMessages > 3) {
                    _this.loggerService.logError("OidcSecurityCheckSession not receiving check session response messages.\n                            Outstanding messages: " + _this.outstandingMessages + ". Server unreachable?");
                    _this.checkSessionChanged.next();
                }
                _this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, _this.heartBeatInterval);
            }));
        });
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            _this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, _this.heartBeatInterval);
        }));
    };
    /**
     * @private
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.clearScheduledHeartBeat = /**
     * @private
     * @return {?}
     */
    function () {
        clearTimeout(this.scheduledHeartBeat);
        this.scheduledHeartBeat = null;
    };
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    OidcSecurityCheckSession.prototype.messageHandler = /**
     * @private
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.outstandingMessages = 0;
        if (this.sessionIframe &&
            e.origin === this.configurationProvider.openIDConfiguration.stsServer &&
            e.source === this.sessionIframe.contentWindow) {
            if (e.data === 'error') {
                this.loggerService.logWarning('error from checksession messageHandler');
            }
            else if (e.data === 'changed') {
                this.checkSessionChanged.next();
            }
            else {
                this.loggerService.logDebug(e.data + ' from checksession messageHandler');
            }
        }
    };
    OidcSecurityCheckSession.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    OidcSecurityCheckSession.ctorParameters = function () { return [
        { type: OidcSecurityCommon },
        { type: LoggerService },
        { type: IFrameService },
        { type: NgZone },
        { type: ConfigurationProvider }
    ]; };
    return OidcSecurityCheckSession;
}());
export { OidcSecurityCheckSession };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.sessionIframe;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.iframeMessageEvent;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.scheduledHeartBeat;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.lastIFrameRefresh;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.outstandingMessages;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.heartBeatInterval;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.iframeRefreshInterval;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.checkSessionChanged;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.oidcSecurityCommon;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.loggerService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.iFrameService;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    OidcSecurityCheckSession.prototype.configurationProvider;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jaGVjay1zZXNzaW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuY2hlY2stc2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQVksT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQUV0RCxtQ0FBbUMsR0FBRyx5QkFBeUI7O0FBSXJFO0lBZUksa0NBQ1ksa0JBQXNDLEVBQ3RDLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLElBQVksRUFDSCxxQkFBNEM7UUFKckQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ0gsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQWZ6RCxzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsd0JBQW1CLEdBQUcsSUFBSSxPQUFPLEVBQU8s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TTtnQkFHbEIscUJBQXFCOztJQTJKOUIsK0JBQUM7Q0FBQSxBQWxKRCxJQWtKQztTQWpKWSx3QkFBd0I7Ozs7OztJQUNqQyxpREFBMkI7Ozs7O0lBQzNCLHNEQUFnQzs7Ozs7SUFDaEMsc0RBQWdDOzs7OztJQUNoQyxxREFBOEI7Ozs7O0lBQzlCLHVEQUFnQzs7Ozs7SUFDaEMscURBQWlDOzs7OztJQUNqQyx5REFBc0M7Ozs7O0lBQ3RDLHVEQUFpRDs7Ozs7SUFPN0Msc0RBQThDOzs7OztJQUM5QyxpREFBb0M7Ozs7O0lBQ3BDLGlEQUFvQzs7Ozs7SUFDcEMsd0NBQW9COzs7OztJQUNwQix5REFBNkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbSwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9hdXRoLWNvbmZpZ3VyYXRpb24ucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBJRnJhbWVTZXJ2aWNlIH0gZnJvbSAnLi9leGlzdGluZy1pZnJhbWUuc2VydmljZSc7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuL29pZGMubG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPaWRjU2VjdXJpdHlDb21tb24gfSBmcm9tICcuL29pZGMuc2VjdXJpdHkuY29tbW9uJztcclxuXHJcbmNvbnN0IElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSID0gJ215aUZyYW1lRm9yQ2hlY2tTZXNzaW9uJztcclxuXHJcbi8vIGh0dHA6Ly9vcGVuaWQubmV0L3NwZWNzL29wZW5pZC1jb25uZWN0LXNlc3Npb24tMV8wLUlENC5odG1sXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24ge1xyXG4gICAgcHJpdmF0ZSBzZXNzaW9uSWZyYW1lOiBhbnk7XHJcbiAgICBwcml2YXRlIGlmcmFtZU1lc3NhZ2VFdmVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBzY2hlZHVsZWRIZWFydEJlYXQ6IGFueTtcclxuICAgIHByaXZhdGUgbGFzdElGcmFtZVJlZnJlc2ggPSAwO1xyXG4gICAgcHJpdmF0ZSBvdXRzdGFuZGluZ01lc3NhZ2VzID0gMDtcclxuICAgIHByaXZhdGUgaGVhcnRCZWF0SW50ZXJ2YWwgPSAzMDAwO1xyXG4gICAgcHJpdmF0ZSBpZnJhbWVSZWZyZXNoSW50ZXJ2YWwgPSA2MDAwMDtcclxuICAgIHByaXZhdGUgY2hlY2tTZXNzaW9uQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9uQ2hlY2tTZXNzaW9uQ2hhbmdlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQuYXNPYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBvaWRjU2VjdXJpdHlDb21tb246IE9pZGNTZWN1cml0eUNvbW1vbixcclxuICAgICAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBpRnJhbWVTZXJ2aWNlOiBJRnJhbWVTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgem9uZTogTmdab25lLFxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXJcclxuICAgICkge31cclxuXHJcbiAgICBwcml2YXRlIGRvZXNTZXNzaW9uRXhpc3QoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJRnJhbWUgPSB0aGlzLmlGcmFtZVNlcnZpY2UuZ2V0RXhpc3RpbmdJRnJhbWUoSUZSQU1FX0ZPUl9DSEVDS19TRVNTSU9OX0lERU5USUZJRVIpO1xyXG5cclxuICAgICAgICBpZiAoIWV4aXN0aW5nSUZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2Vzc2lvbklmcmFtZSA9IGV4aXN0aW5nSUZyYW1lO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5sYXN0SUZyYW1lUmVmcmVzaCArIHRoaXMuaWZyYW1lUmVmcmVzaEludGVydmFsID4gRGF0ZS5ub3coKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnJvbShbdGhpc10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRvZXNTZXNzaW9uRXhpc3QoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUgPSB0aGlzLmlGcmFtZVNlcnZpY2UuYWRkSUZyYW1lVG9XaW5kb3dCb2R5KElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSKTtcclxuICAgICAgICAgICAgdGhpcy5pZnJhbWVNZXNzYWdlRXZlbnQgPSB0aGlzLm1lc3NhZ2VIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5pZnJhbWVNZXNzYWdlRXZlbnQsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbml0IGNoZWNrIHNlc3Npb246IGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkLiBSZXR1cm5pbmcuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuY2hlY2tfc2Vzc2lvbl9pZnJhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lLmNvbnRlbnRXaW5kb3cubG9jYXRpb24ucmVwbGFjZSh0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci53ZWxsS25vd25FbmRwb2ludHMuY2hlY2tfc2Vzc2lvbl9pZnJhbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbml0IGNoZWNrIHNlc3Npb246IGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyOiBPYnNlcnZlcjxPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24+KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbklmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJRnJhbWVSZWZyZXNoID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0Q2hlY2tpbmdTZXNzaW9uKGNsaWVudElkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5zY2hlZHVsZWRIZWFydEJlYXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wb2xsU2VydmVyU2Vzc2lvbihjbGllbnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcENoZWNraW5nU2Vzc2lvbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRIZWFydEJlYXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBvbGxTZXJ2ZXJTZXNzaW9uKGNsaWVudElkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBwb2xsU2VydmVyU2Vzc2lvblJlY3VyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlc3Npb25JZnJhbWUgJiYgY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMuc2Vzc2lvbklmcmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlc3Npb25TdGF0ZSA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNlc3Npb25TdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlc3Npb25TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnRJZCArICcgJyArIHNlc3Npb25TdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZygnT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHBvbGxTZXJ2ZXJTZXNzaW9uIHNlc3Npb25fc3RhdGUgaXMgYmxhbmsnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHBvbGxTZXJ2ZXJTZXNzaW9uIHNlc3Npb25JZnJhbWUgZG9lcyBub3QgZXhpc3QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGNsaWVudElkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKHRoaXMuc2Vzc2lvbklmcmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgc2VuZGluZyB0aHJlZSBtZXNzYWdlcyB3aXRoIG5vIHJlc3BvbnNlLCBmYWlsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPiAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24gbm90IHJlY2VpdmluZyBjaGVjayBzZXNzaW9uIHJlc3BvbnNlIG1lc3NhZ2VzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0c3RhbmRpbmcgbWVzc2FnZXM6ICR7dGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzfS4gU2VydmVyIHVucmVhY2hhYmxlP2BcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChwb2xsU2VydmVyU2Vzc2lvblJlY3VyLCB0aGlzLmhlYXJ0QmVhdEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChwb2xsU2VydmVyU2Vzc2lvblJlY3VyLCB0aGlzLmhlYXJ0QmVhdEludGVydmFsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2xlYXJTY2hlZHVsZWRIZWFydEJlYXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0KTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtZXNzYWdlSGFuZGxlcihlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lICYmXHJcbiAgICAgICAgICAgIGUub3JpZ2luID09PSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5vcGVuSURDb25maWd1cmF0aW9uLnN0c1NlcnZlciAmJlxyXG4gICAgICAgICAgICBlLnNvdXJjZSA9PT0gdGhpcy5zZXNzaW9uSWZyYW1lLmNvbnRlbnRXaW5kb3dcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgaWYgKGUuZGF0YSA9PT0gJ2Vycm9yJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ2Vycm9yIGZyb20gY2hlY2tzZXNzaW9uIG1lc3NhZ2VIYW5kbGVyJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5kYXRhID09PSAnY2hhbmdlZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZC5uZXh0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoZS5kYXRhICsgJyBmcm9tIGNoZWNrc2Vzc2lvbiBtZXNzYWdlSGFuZGxlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==