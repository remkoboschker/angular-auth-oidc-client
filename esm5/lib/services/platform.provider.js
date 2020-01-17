/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
var PlatformProvider = /** @class */ (function () {
    // tslint:disable-next-line: ban-types
    function PlatformProvider(platformId) {
        this.platformId = platformId;
    }
    Object.defineProperty(PlatformProvider.prototype, "isBrowser", {
        get: /**
         * @return {?}
         */
        function () {
            return isPlatformBrowser(this.platformId);
        },
        enumerable: true,
        configurable: true
    });
    PlatformProvider.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    PlatformProvider.ctorParameters = function () { return [
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    /** @nocollapse */ PlatformProvider.ngInjectableDef = i0.defineInjectable({ factory: function PlatformProvider_Factory() { return new PlatformProvider(i0.inject(i0.PLATFORM_ID)); }, token: PlatformProvider, providedIn: "root" });
    return PlatformProvider;
}());
export { PlatformProvider };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PlatformProvider.prototype.platformId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0ucHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGxhdGZvcm0ucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFaEU7SUFNSSxzQ0FBc0M7SUFDdEMsMEJBQXlDLFVBQWtCO1FBQWxCLGVBQVUsR0FBVixVQUFVLENBQVE7SUFBRyxDQUFDO0lBTC9ELHNCQUFJLHVDQUFTOzs7O1FBQWI7WUFDSSxPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxDQUFDOzs7T0FBQTs7Z0JBSkosVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7OztnQkFPdUIsTUFBTSx1QkFBOUMsTUFBTSxTQUFDLFdBQVc7OzsyQkFWbkM7Q0FXQyxBQVJELElBUUM7U0FQWSxnQkFBZ0I7Ozs7OztJQU1iLHNDQUErQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtUHJvdmlkZXIge1xyXG4gICAgZ2V0IGlzQnJvd3NlcigpIHtcclxuICAgICAgICByZXR1cm4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGJhbi10eXBlc1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QpIHt9XHJcbn1cclxuIl19