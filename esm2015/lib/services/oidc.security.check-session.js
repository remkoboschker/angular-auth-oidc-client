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
const IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
export class OidcSecurityCheckSession {
    /**
     * @param {?} oidcSecurityCommon
     * @param {?} loggerService
     * @param {?} iFrameService
     * @param {?} zone
     * @param {?} configurationProvider
     */
    constructor(oidcSecurityCommon, loggerService, iFrameService, zone, configurationProvider) {
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
    /**
     * @return {?}
     */
    get onCheckSessionChanged() {
        return this.checkSessionChanged.asObservable();
    }
    /**
     * @private
     * @return {?}
     */
    doesSessionExist() {
        /** @type {?} */
        const existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        if (!existingIFrame) {
            return false;
        }
        this.sessionIframe = existingIFrame;
        return true;
    }
    /**
     * @private
     * @return {?}
     */
    init() {
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
        (observer) => {
            this.sessionIframe.onload = (/**
             * @return {?}
             */
            () => {
                this.lastIFrameRefresh = Date.now();
                observer.next(this);
                observer.complete();
            });
        }));
    }
    /**
     * @param {?} clientId
     * @return {?}
     */
    startCheckingSession(clientId) {
        if (this.scheduledHeartBeat) {
            return;
        }
        this.pollServerSession(clientId);
    }
    /**
     * @return {?}
     */
    stopCheckingSession() {
        if (!this.scheduledHeartBeat) {
            return;
        }
        this.clearScheduledHeartBeat();
    }
    /**
     * @private
     * @param {?} clientId
     * @return {?}
     */
    pollServerSession(clientId) {
        /** @type {?} */
        const pollServerSessionRecur = (/**
         * @return {?}
         */
        () => {
            this.init()
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => {
                if (this.sessionIframe && clientId) {
                    this.loggerService.logDebug(this.sessionIframe);
                    /** @type {?} */
                    const sessionState = this.oidcSecurityCommon.sessionState;
                    if (sessionState) {
                        this.outstandingMessages++;
                        this.sessionIframe.contentWindow.postMessage(clientId + ' ' + sessionState, this.configurationProvider.openIDConfiguration.stsServer);
                    }
                    else {
                        this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        this.checkSessionChanged.next();
                    }
                }
                else {
                    this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession sessionIframe does not exist');
                    this.loggerService.logDebug(clientId);
                    this.loggerService.logDebug(this.sessionIframe);
                    // this.init();
                }
                // after sending three messages with no response, fail.
                if (this.outstandingMessages > 3) {
                    this.loggerService.logError(`OidcSecurityCheckSession not receiving check session response messages.
                            Outstanding messages: ${this.outstandingMessages}. Server unreachable?`);
                    this.checkSessionChanged.next();
                }
                this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, this.heartBeatInterval);
            }));
        });
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.scheduledHeartBeat = setTimeout(pollServerSessionRecur, this.heartBeatInterval);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    clearScheduledHeartBeat() {
        clearTimeout(this.scheduledHeartBeat);
        this.scheduledHeartBeat = null;
    }
    /**
     * @private
     * @param {?} e
     * @return {?}
     */
    messageHandler(e) {
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
    }
}
OidcSecurityCheckSession.decorators = [
    { type: Injectable }
];
/** @nocollapse */
OidcSecurityCheckSession.ctorParameters = () => [
    { type: OidcSecurityCommon },
    { type: LoggerService },
    { type: IFrameService },
    { type: NgZone },
    { type: ConfigurationProvider }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5zZWN1cml0eS5jaGVjay1zZXNzaW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29pZGMuc2VjdXJpdHkuY2hlY2stc2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQVksT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztNQUV0RCxtQ0FBbUMsR0FBRyx5QkFBeUI7O0FBS3JFLE1BQU0sT0FBTyx3QkFBd0I7Ozs7Ozs7O0lBY2pDLFlBQ1ksa0JBQXNDLEVBQ3RDLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLElBQVksRUFDSCxxQkFBNEM7UUFKckQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ0gsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQWZ6RCxzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsd0JB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OztJQUMzQixzREFBZ0M7Ozs7O0lBQ2hDLHNEQUFnQzs7Ozs7SUFDaEMscURBQThCOzs7OztJQUM5Qix1REFBZ0M7Ozs7O0lBQ2hDLHFEQUFpQzs7Ozs7SUFDakMseURBQXNDOzs7OztJQUN0Qyx1REFBaUQ7Ozs7O0lBTzdDLHNEQUE4Qzs7Ozs7SUFDOUMsaURBQW9DOzs7OztJQUNwQyxpREFBb0M7Ozs7O0lBQ3BDLHdDQUFvQjs7Ozs7SUFDcEIseURBQTZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vYXV0aC1jb25maWd1cmF0aW9uLnByb3ZpZGVyJztcclxuaW1wb3J0IHsgSUZyYW1lU2VydmljZSB9IGZyb20gJy4vZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSAnLi9vaWRjLmxvZ2dlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgT2lkY1NlY3VyaXR5Q29tbW9uIH0gZnJvbSAnLi9vaWRjLnNlY3VyaXR5LmNvbW1vbic7XHJcblxyXG5jb25zdCBJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUiA9ICdteWlGcmFtZUZvckNoZWNrU2Vzc2lvbic7XHJcblxyXG4vLyBodHRwOi8vb3BlbmlkLm5ldC9zcGVjcy9vcGVuaWQtY29ubmVjdC1zZXNzaW9uLTFfMC1JRDQuaHRtbFxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHtcclxuICAgIHByaXZhdGUgc2Vzc2lvbklmcmFtZTogYW55O1xyXG4gICAgcHJpdmF0ZSBpZnJhbWVNZXNzYWdlRXZlbnQ6IGFueTtcclxuICAgIHByaXZhdGUgc2NoZWR1bGVkSGVhcnRCZWF0OiBhbnk7XHJcbiAgICBwcml2YXRlIGxhc3RJRnJhbWVSZWZyZXNoID0gMDtcclxuICAgIHByaXZhdGUgb3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XHJcbiAgICBwcml2YXRlIGhlYXJ0QmVhdEludGVydmFsID0gMzAwMDtcclxuICAgIHByaXZhdGUgaWZyYW1lUmVmcmVzaEludGVydmFsID0gNjAwMDA7XHJcbiAgICBwcml2YXRlIGNoZWNrU2Vzc2lvbkNoYW5nZWQgPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBvbkNoZWNrU2Vzc2lvbkNoYW5nZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgb2lkY1NlY3VyaXR5Q29tbW9uOiBPaWRjU2VjdXJpdHlDb21tb24sXHJcbiAgICAgICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgaUZyYW1lU2VydmljZTogSUZyYW1lU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb25Qcm92aWRlcjogQ29uZmlndXJhdGlvblByb3ZpZGVyXHJcbiAgICApIHt9XHJcblxyXG4gICAgcHJpdmF0ZSBkb2VzU2Vzc2lvbkV4aXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSUZyYW1lID0gdGhpcy5pRnJhbWVTZXJ2aWNlLmdldEV4aXN0aW5nSUZyYW1lKElGUkFNRV9GT1JfQ0hFQ0tfU0VTU0lPTl9JREVOVElGSUVSKTtcclxuXHJcbiAgICAgICAgaWYgKCFleGlzdGluZ0lGcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUgPSBleGlzdGluZ0lGcmFtZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdElGcmFtZVJlZnJlc2ggKyB0aGlzLmlmcmFtZVJlZnJlc2hJbnRlcnZhbCA+IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyb20oW3RoaXNdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5kb2VzU2Vzc2lvbkV4aXN0KCkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lID0gdGhpcy5pRnJhbWVTZXJ2aWNlLmFkZElGcmFtZVRvV2luZG93Qm9keShJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUik7XHJcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lTWVzc2FnZUV2ZW50ID0gdGhpcy5tZXNzYWdlSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuaWZyYW1lTWVzc2FnZUV2ZW50LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLndlbGxLbm93bkVuZHBvaW50cykge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZC4gUmV0dXJuaW5nLicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmNoZWNrX3Nlc3Npb25faWZyYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbklmcmFtZS5jb250ZW50V2luZG93LmxvY2F0aW9uLnJlcGxhY2UodGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIud2VsbEtub3duRW5kcG9pbnRzLmNoZWNrX3Nlc3Npb25faWZyYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBhdXRoV2VsbEtub3duRW5kcG9pbnRzIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8T2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uPikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlc3Npb25JZnJhbWUub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SUZyYW1lUmVmcmVzaCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydENoZWNraW5nU2Vzc2lvbihjbGllbnRJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucG9sbFNlcnZlclNlc3Npb24oY2xpZW50SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BDaGVja2luZ1Nlc3Npb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNsZWFyU2NoZWR1bGVkSGVhcnRCZWF0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwb2xsU2VydmVyU2Vzc2lvbihjbGllbnRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcG9sbFNlcnZlclNlc3Npb25SZWN1ciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXNzaW9uSWZyYW1lICYmIGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLnNlc3Npb25JZnJhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXNzaW9uU3RhdGUgPSB0aGlzLm9pZGNTZWN1cml0eUNvbW1vbi5zZXNzaW9uU3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXNzaW9uU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50SWQgKyAnICcgKyBzZXNzaW9uU3RhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zdHNTZXJ2ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoJ09pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbiBwb2xsU2VydmVyU2Vzc2lvbiBzZXNzaW9uX3N0YXRlIGlzIGJsYW5rJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ1dhcm5pbmcoJ09pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbiBwb2xsU2VydmVyU2Vzc2lvbiBzZXNzaW9uSWZyYW1lIGRvZXMgbm90IGV4aXN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhjbGllbnRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1Zyh0aGlzLnNlc3Npb25JZnJhbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmluaXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFmdGVyIHNlbmRpbmcgdGhyZWUgbWVzc2FnZXMgd2l0aCBubyByZXNwb25zZSwgZmFpbC5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzID4gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIG5vdCByZWNlaXZpbmcgY2hlY2sgc2Vzc2lvbiByZXNwb25zZSBtZXNzYWdlcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE91dHN0YW5kaW5nIG1lc3NhZ2VzOiAke3RoaXMub3V0c3RhbmRpbmdNZXNzYWdlc30uIFNlcnZlciB1bnJlYWNoYWJsZT9gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZC5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCA9IHNldFRpbWVvdXQocG9sbFNlcnZlclNlc3Npb25SZWN1ciwgdGhpcy5oZWFydEJlYXRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCA9IHNldFRpbWVvdXQocG9sbFNlcnZlclNlc3Npb25SZWN1ciwgdGhpcy5oZWFydEJlYXRJbnRlcnZhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNsZWFyU2NoZWR1bGVkSGVhcnRCZWF0KCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjaGVkdWxlZEhlYXJ0QmVhdCk7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRIZWFydEJlYXQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWVzc2FnZUhhbmRsZXIoZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzID0gMDtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbklmcmFtZSAmJlxyXG4gICAgICAgICAgICBlLm9yaWdpbiA9PT0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIub3BlbklEQ29uZmlndXJhdGlvbi5zdHNTZXJ2ZXIgJiZcclxuICAgICAgICAgICAgZS5zb3VyY2UgPT09IHRoaXMuc2Vzc2lvbklmcmFtZS5jb250ZW50V2luZG93XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmRhdGEgPT09ICdlcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdlcnJvciBmcm9tIGNoZWNrc2Vzc2lvbiBtZXNzYWdlSGFuZGxlcicpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUuZGF0YSA9PT0gJ2NoYW5nZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrU2Vzc2lvbkNoYW5nZWQubmV4dCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGUuZGF0YSArICcgZnJvbSBjaGVja3Nlc3Npb24gbWVzc2FnZUhhbmRsZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=