import { IRetsBody } from './IRetsBody';

/**
 * RETS response object
 */
export interface IRetsObject {
    /**
     * Object type
     */
    type: string;
    /**
     * Object ID
     */
    id?: string;
    /**
     * Object description
     */
    description?: string;
    /**
     * Object's location (if have)
     */
    address?: string;
    /**
     * Object's content
     */
    content?: Buffer;
    /**
     * Any error happend when request this object
     */
    error?: IRetsBody;
}
