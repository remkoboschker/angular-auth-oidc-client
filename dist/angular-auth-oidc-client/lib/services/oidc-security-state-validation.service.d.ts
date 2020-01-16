import { JwtKeys } from '../models/jwtkeys';
import { ValidateStateResult } from '../models/validate-state-result.model';
import { ConfigurationProvider } from './auth-configuration.provider';
import { TokenHelperService } from './oidc-token-helper.service';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
import { OidcSecurityValidation } from './oidc.security.validation';
export declare class StateValidationService {
    oidcSecurityCommon: OidcSecurityCommon;
    private oidcSecurityValidation;
    private tokenHelperService;
    private loggerService;
    private readonly configurationProvider;
    constructor(oidcSecurityCommon: OidcSecurityCommon, oidcSecurityValidation: OidcSecurityValidation, tokenHelperService: TokenHelperService, loggerService: LoggerService, configurationProvider: ConfigurationProvider);
    validateState(result: any, jwtKeys: JwtKeys): ValidateStateResult;
    private handleSuccessfulValidation;
    private handleUnsuccessfulValidation;
}
