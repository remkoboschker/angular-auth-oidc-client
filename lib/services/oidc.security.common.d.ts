import { OidcSecurityStorage } from './oidc.security.storage';
export declare type SilentRenewState = 'running' | '';
export declare class OidcSecurityCommon {
    private oidcSecurityStorage;
    private storageAuthResult;
    authResult: any;
    private storageAccessToken;
    accessToken: string;
    private storageIdToken;
    idToken: string;
    private storageIsAuthorized;
    isAuthorized: boolean | undefined;
    private storageUserData;
    userData: any;
    private storageAuthNonce;
    authNonce: string;
    private storageCodeVerifier;
    code_verifier: string;
    private storageAuthStateControl;
    authStateControl: string;
    private storageSessionState;
    sessionState: any;
    private storageSilentRenewRunning;
    silentRenewRunning: SilentRenewState;
    private storageCustomRequestParams;
    customRequestParams: {
        [key: string]: string | number | boolean;
    };
    constructor(oidcSecurityStorage: OidcSecurityStorage);
    private retrieve;
    private store;
    resetStorageData(isRenewProcess: boolean): void;
    getAccessToken(): any;
    getIdToken(): any;
    getRefreshToken(): any;
}
