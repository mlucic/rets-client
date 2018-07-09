import { RETSRequestMethod } from './RETSRequestMethod';
import { RETSVersion } from './RETSVersion';

export interface IClientConfiguration {
    url: string;
    proxyUrl?: string;
    useTunnel?: boolean;
    username: string;
    password: string;
    version: RETSVersion;
    userAgent?: string;
    userAgentPassword?: string;
    method?: RETSRequestMethod;
    sessionId?: string;
    timeout?: number;
}
