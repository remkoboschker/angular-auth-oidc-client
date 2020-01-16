import { Observable } from 'rxjs';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
export declare class OidcSecuritySilentRenew {
    private loggerService;
    private iFrameService;
    constructor(loggerService: LoggerService, iFrameService: IFrameService);
    initRenew(): HTMLIFrameElement;
    startRenew(url: string): Observable<void>;
}
