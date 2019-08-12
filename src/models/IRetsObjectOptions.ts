import { DdfCulture } from './DdfCulture';

/**
 * RETS GetObject request parameters
 */
export interface IRetsObjectOptions {
    /**
     * Accepted MIME type (default image/jpeg)
     */
    mime?: string;
    /**
     * Resource type
     */
    resource: string;
    /**
     * Object type
     */
    type: string;
    /**
     * Resource ID
     */
    contentId: string;
    /**
     * Object ID (default *, means all objects under target resource)
     */
    objectId?: string;
    /**
     * Also request location (may cause server error if server does not support, default false)
     */
    withLocation?: boolean;
    /**
     * DDF culture (only available for CREA DDF)
     */
    culture?: DdfCulture;
}
