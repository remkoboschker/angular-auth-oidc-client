import { ConfigurationProvider } from './auth-configuration.provider';
/**
 * Implement this class-interface to create a custom storage.
 */
export declare abstract class OidcSecurityStorage {
    /**
     * This method must contain the logic to read the storage.
     * @param key
     * @return The value of the given key
     */
    abstract read(key: string): any;
    /**
     * This method must contain the logic to write the storage.
     * @param key
     * @param value The value for the given key
     */
    abstract write(key: string, value: any): void;
}
export declare class BrowserStorage implements OidcSecurityStorage {
    private configProvider;
    private hasStorage;
    constructor(configProvider: ConfigurationProvider);
    read(key: string): any;
    write(key: string, value: any): void;
}
