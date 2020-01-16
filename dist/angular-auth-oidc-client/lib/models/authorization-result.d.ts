import { AuthorizationState } from './authorization-state.enum';
import { ValidationResult } from './validation-result.enum';
export declare class AuthorizationResult {
    authorizationState: AuthorizationState;
    validationResult: ValidationResult;
    isRenewProcess: boolean;
    constructor(authorizationState: AuthorizationState, validationResult: ValidationResult, isRenewProcess?: boolean);
}
