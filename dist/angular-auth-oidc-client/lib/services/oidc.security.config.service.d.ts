import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerService } from './oidc.logger.service';
export interface ConfigResult {
    authWellknownEndpoints: any;
    customConfig: any;
}
export declare class OidcConfigService {
    private readonly loggerService;
    private readonly httpClient;
    private configurationLoadedInternal;
    readonly onConfigurationLoaded: Observable<ConfigResult>;
    constructor(loggerService: LoggerService, httpClient: HttpClient);
    load(configUrl: string): Promise<boolean>;
    load_using_stsServer(stsServer: string): Promise<boolean>;
    load_using_custom_stsServer(url: string): Promise<boolean>;
    private loadUsingConfiguration;
}
