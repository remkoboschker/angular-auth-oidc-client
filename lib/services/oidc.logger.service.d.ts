import { ConfigurationProvider } from './auth-configuration.provider';
export declare class LoggerService {
    private configurationProvider;
    constructor(configurationProvider: ConfigurationProvider);
    logError(message: any, ...args: any[]): void;
    logWarning(message: any): void;
    logDebug(message: any): void;
}
