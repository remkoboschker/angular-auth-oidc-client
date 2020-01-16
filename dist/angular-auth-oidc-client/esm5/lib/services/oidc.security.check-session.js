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
        this._onCheckSessionChanged = new Subject();
    }
    Object.defineProperty(OidcSecurityCheckSession.prototype, "onCheckSessionChanged", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onCheckSessionChanged.asObservable();
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
        var _pollServerSessionRecur = (/**
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
                    var session_state = _this.oidcSecurityCommon.sessionState;
                    if (session_state) {
                        _this.outstandingMessages++;
                        _this.sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, _this.configurationProvider.openIDConfiguration.stsServer);
                    }
                    else {
                        _this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        _this._onCheckSessionChanged.next();
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
                    _this.loggerService.logError("OidcSecurityCheckSession not receiving check session response messages. Outstanding messages: " + _this.outstandingMessages + ". Server unreachable?");
                    _this._onCheckSessionChanged.next();
                }
                _this.scheduledHeartBeat = setTimeout(_pollServerSessionRecur, _this.heartBeatInterval);
            }));
        });
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            _this.scheduledHeartBeat = setTimeout(_pollServerSessionRecur, _this.heartBeatInterval);
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
                this._onCheckSessionChanged.next();
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
    OidcSecurityCheckSession.prototype._onCheckSessionChanged;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jaGVjay1zZXNzaW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuY2hlY2stc2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQVksT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztJQUV0RCxtQ0FBbUMsR0FBRyx5QkFBeUI7O0FBSXJFO0lBZUksa0NBQ1ksa0JBQXNDLEVBQ3RDLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLElBQVksRUFDSCxxQkFBNEM7UUFKckQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ0gsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQWZ6RCxzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsMkJBQXNCLEdBQUcsSUFBSSxPQUFPLEVBQU8s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Z0JBR2xCLHFCQUFxQjs7SUE0SjlCLCtCQUFDO0NBQUEsQUFuSkQsSUFtSkM7U0FsSlksd0JBQXdCOzs7Ozs7SUFDakMsaURBQTJCOzs7OztJQUMzQixzREFBZ0M7Ozs7O0lBQ2hDLHNEQUFnQzs7Ozs7SUFDaEMscURBQThCOzs7OztJQUM5Qix1REFBZ0M7Ozs7O0lBQ2hDLHFEQUFpQzs7Ozs7SUFDakMseURBQXNDOzs7OztJQUN0QywwREFBb0Q7Ozs7O0lBT2hELHNEQUE4Qzs7Ozs7SUFDOUMsaURBQW9DOzs7OztJQUNwQyxpREFBb0M7Ozs7O0lBQ3BDLHdDQUFvQjs7Ozs7SUFDcEIseURBQTZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vYXV0aC1jb25maWd1cmF0aW9uLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgSUZyYW1lU2VydmljZSB9IGZyb20gJy4vZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNvbW1vbic7XHJcblxyXG5jb25zdCBJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUiA9ICdteWlGcmFtZUZvckNoZWNrU2Vzc2lvbic7XHJcblxyXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1zZXNzaW9uLTFfMC1JRDQuaHRtbFxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHtcclxuICAgIHByaXZhdGUgc2Vzc2lvbklmcmFtZTogYW55O1xyXG4gICAgcHJpdmF0ZSBpZnJhbWVNZXNzYWdlRXZlbnQ6IGFueTtcclxuICAgIHByaXZhdGUgc2NoZWR1bGVkSGVhcnRCZWF0OiBhbnk7XHJcbiAgICBwcml2YXRlIGxhc3RJRnJhbWVSZWZyZXNoID0gMDtcclxuICAgIHByaXZhdGUgb3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XHJcbiAgICBwcml2YXRlIGhlYXJ0QmVhdEludGVydmFsID0gMzAwMDtcclxuICAgIHByaXZhdGUgaWZyYW1lUmVmcmVzaEludGVydmFsID0gNjAwMDA7XHJcbiAgICBwcml2YXRlIF9vbkNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNoZWNrU2Vzc2lvbkNoYW5nZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q29tbW9uOiBPaWRjU2VjdXJpdHlDb21tb24sXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgaUZyYW1lU2VydmljZTogSUZyYW1lU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyXHJcbiAgICApIHt9XHJcblxyXG4gICAgcHJpdmF0ZSBkb2VzU2Vzc2lvbkV4aXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSUZyYW1lID0gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSKTtcclxuXHJcbiAgICAgICAgaWYgKCFleGlzdGluZ0lGcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUgPSBleGlzdGluZ0lGcmFtZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdElGcmFtZVJlZnJlc2ggKyB0aGlzLmlmcmFtZVJlZnJlc2hJbnRlcnZhbCA+IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyb20oW3RoaXNdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5kb2VzU2Vzc2lvbkV4aXN0KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lID0gdGhpcy5pRnJhbWVTZXJ2aWNlLmFkZElGcmFtZVRvV2luZG93Qm9keShJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUik7XHJcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lTWVzc2FnZUV2ZW50ID0gdGhpcy5tZXNzYWdlSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuaWZyYW1lTWVzc2FnZUV2ZW50LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZC4gUmV0dXJuaW5nLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmNoZWNrX3Nlc3Npb25faWZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbklmcmFtZS5jb250ZW50V2luZG93LmxvY2F0aW9uLnJlcGxhY2UodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmNoZWNrX3Nlc3Npb25faWZyYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8T2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uPikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SUZyYW1lUmVmcmVzaCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydENoZWNraW5nU2Vzc2lvbihjbGllbnRJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucG9sbFNlcnZlclNlc3Npb24oY2xpZW50SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BDaGVja2luZ1Nlc3Npb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNsZWFyU2NoZWR1bGVkSGVhcnRCZWF0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb2xsU2VydmVyU2Vzc2lvbihjbGllbnRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgX3BvbGxTZXJ2ZXJTZXNzaW9uUmVjdXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Vzc2lvbklmcmFtZSAmJiBjbGllbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcodGhpcy5zZXNzaW9uSWZyYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbl9zdGF0ZSA9IHRoaXMub2lkY1NlY3VyaXR5Q29tbW9uLnNlc3Npb25TdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlc3Npb25fc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50SWQgKyAnICcgKyBzZXNzaW9uX3N0YXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24gcG9sbFNlcnZlclNlc3Npb24gc2Vzc2lvbl9zdGF0ZSBpcyBibGFuaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdPaWRjU2VjdXJpdHlDaGVja1Nlc3Npb24gcG9sbFNlcnZlclNlc3Npb24gc2Vzc2lvbklmcmFtZSBkb2VzIG5vdCBleGlzdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoY2xpZW50SWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcodGhpcy5zZXNzaW9uSWZyYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5pbml0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciBzZW5kaW5nIHRocmVlIG1lc3NhZ2VzIHdpdGggbm8gcmVzcG9uc2UsIGZhaWwuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcyA+IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYE9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbiBub3QgcmVjZWl2aW5nIGNoZWNrIHNlc3Npb24gcmVzcG9uc2UgbWVzc2FnZXMuIE91dHN0YW5kaW5nIG1lc3NhZ2VzOiAke1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfS4gU2VydmVyIHVucmVhY2hhYmxlP2BcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0ID0gc2V0VGltZW91dChfcG9sbFNlcnZlclNlc3Npb25SZWN1ciwgdGhpcy5oZWFydEJlYXRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCA9IHNldFRpbWVvdXQoX3BvbGxTZXJ2ZXJTZXNzaW9uUmVjdXIsIHRoaXMuaGVhcnRCZWF0SW50ZXJ2YWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhclNjaGVkdWxlZEhlYXJ0QmVhdCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zY2hlZHVsZWRIZWFydEJlYXQpO1xyXG4gICAgICAgIHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1lc3NhZ2VIYW5kbGVyKGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUgJiZcclxuICAgICAgICAgICAgZS5vcmlnaW4gPT09IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLm9wZW5JRENvbmZpZ3VyYXRpb24uc3RzU2VydmVyICYmXHJcbiAgICAgICAgICAgIGUuc291cmNlID09PSB0aGlzLnNlc3Npb25JZnJhbWUuY29udGVudFdpbmRvd1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBpZiAoZS5kYXRhID09PSAnZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnZXJyb3IgZnJvbSBjaGVja3Nlc3Npb24gbWVzc2FnZUhhbmRsZXInKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmRhdGEgPT09ICdjaGFuZ2VkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGVja1Nlc3Npb25DaGFuZ2VkLm5leHQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhlLmRhdGEgKyAnIGZyb20gY2hlY2tzZXNzaW9uIG1lc3NhZ2VIYW5kbGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19