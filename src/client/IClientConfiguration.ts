import { RetsRequestMethod } from './RetsRequestMethod';
import { RetsVersion } from './RETSVersion';

export interface IClientConfiguration {
    url: string;
    proxyUrl?: string;
    useTunnel?: boolean;
    username: string;
    password: string;
    version: RetsVersion;
    userAgent?: string;
    userAgentPassword?: string;
    method?: RetsRequestMethod;
    sessionId?: string;
    timeout?: number;
}
