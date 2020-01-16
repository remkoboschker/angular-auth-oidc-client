import { OpenIdConfiguration, OpenIdInternalConfiguration } from '../models/auth.configuration';
import { AuthWellKnownEndpoints } from '../models/auth.well-known-endpoints';
import { PlatformProvider } from './platform.provider';
export declare class ConfigurationProvider {
    private platformProvider;
    private DEFAULT_CONFIG;
    private INITIAL_AUTHWELLKNOWN;
    private mergedOpenIdConfiguration;
    private authWellKnownEndpoints;
    private onConfigurationChangeInternal;
    readonly openIDConfiguration: OpenIdInternalConfiguration;
    readonly wellKnownEndpoints: AuthWellKnownEndpoints;
    readonly onConfigurationChange: import("rxjs").Observable<OpenIdConfiguration>;
    constructor(platformProvider: PlatformProvider);
    setup(passedOpenIfConfiguration: OpenIdConfiguration | null | undefined, passedAuthWellKnownEndpoints: AuthWellKnownEndpoints | null | undefined): void;
    private setSpecialCases;
}
