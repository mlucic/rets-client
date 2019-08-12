import { RetsRequestMethod } from './RetsRequestMethod';
import { RetsVersion } from './RetsVersion';

/**
 * Rets client condiguration
 */
export interface IClientConnection {
    /**
     * Login URL
     */
    url: string;
    /**
     * Proxy URL
     */
    proxyUrl?: string;
    /**
     * Enable HTTP tunnel (default false)
     */
    useTunnel?: boolean;
    /**
     * Login username
     */
    username: string;
    /**
     * Login password
     */
    password: string;
    /**
     * RETS version
     */
    version: RetsVersion;
    /**
     * RETS user agent authorization information
     */
    userAgent?: string;
    /**
     * Password fro RETS user agent authorization
     */
    userAgentPassword?: string;
    /**
     * Request methid (default GET)
     */
    method?: RetsRequestMethod;
    /**
     * RETS session id
     */
    sessionId?: string;
    /**
     * HTTP timeout limitation (default no limitation)
     */
    timeout?: number;
}
