import { EqualityHelperService } from './oidc-equality-helper.service';
import { TokenHelperService } from './oidc-token-helper.service';
import { LoggerService } from './oidc.logger.service';
export declare class OidcSecurityValidation {
    private arrayHelperService;
    private tokenHelperService;
    private loggerService;
    static RefreshTokenNoncePlaceholder: string;
    constructor(arrayHelperService: EqualityHelperService, tokenHelperService: TokenHelperService, loggerService: LoggerService);
    isTokenExpired(token: string, offsetSeconds?: number): boolean;
    validate_id_token_exp_not_expired(decoded_id_token: string, offsetSeconds?: number): boolean;
    validate_required_id_token(dataIdToken: any): boolean;
    validate_id_token_iat_max_offset(dataIdToken: any, maxOffsetAllowedInSeconds: number, disableIatOffsetValidation: boolean): boolean;
    validate_id_token_nonce(dataIdToken: any, localNonce: any, ignoreNonceAfterRefresh: boolean): boolean;
    validate_id_token_iss(dataIdToken: any, authWellKnownEndpoints_issuer: any): boolean;
    validate_id_token_aud(dataIdToken: any, aud: any): boolean;
    validateStateFromHashCallback(state: any, localState: any): boolean;
    validate_userdata_sub_id_token(idTokenSub: any, userdataSub: any): boolean;
    validate_signature_id_token(idToken: any, jwtkeys: any): boolean;
    config_validate_response_type(responseType: string): boolean;
    validate_id_token_at_hash(accessToken: any, atHash: any, isCodeFlow: boolean): boolean;
    private generate_at_hash;
    generate_code_verifier(codeChallenge: any): string;
}
