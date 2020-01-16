/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
var PlatformProvider = /** @class */ (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0ucHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGxhdGZvcm0ucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFaEU7SUFNSSwwQkFBeUMsVUFBa0I7UUFBbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUFHLENBQUM7SUFKL0Qsc0JBQUksdUNBQVM7Ozs7UUFBYjtZQUNJLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7OztPQUFBOztnQkFKSixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7O2dCQU11QixNQUFNLHVCQUE5QyxNQUFNLFNBQUMsV0FBVzs7OzJCQVRuQztDQVVDLEFBUEQsSUFPQztTQU5ZLGdCQUFnQjs7Ozs7O0lBS2Isc0NBQStDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1Qcm92aWRlciB7XHJcbiAgICBnZXQgaXNCcm93c2VyKCkge1xyXG4gICAgICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0KSB7fVxyXG59XHJcbiJdfQ==