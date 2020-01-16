import { Observable } from 'rxjs';
import { OidcDataService } from '../data-services/oidc-data.service';
import { ConfigurationProvider } from './auth-configuration.provider';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
export declare class OidcSecurityUserService {
    private oidcDataService;
    private oidcSecurityCommon;
    private loggerService;
    private readonly configurationProvider;
    private userData;
    constructor(oidcDataService: OidcDataService, oidcSecurityCommon: OidcSecurityCommon, loggerService: LoggerService, configurationProvider: ConfigurationProvider);
    initUserData(): Observable<any>;
    getUserData(): any;
    setUserData(value: any): void;
    private getIdentityUserData;
}
