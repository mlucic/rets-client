import { RetsRequestMethod } from './RetsRequestMethod';
import { RetsVersion } from './RetsVersion';

export interface IClientConnection {
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
