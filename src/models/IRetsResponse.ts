import { Response } from 'request';

import { IRetsObject } from './IRetsObject';
import { IRetsBody } from './IRetsBody';

/**
 * RETS response content
 */
export interface IRetsResponse {
    /**
     * Response headers
     */
    headers: { [key: string]: string | string[] };
    /**
     * Response body
     */
    body: IRetsBody | IRetsObject | IRetsObject[];
    /**
     * Raw HTTP response
     */
    response: Response;
}

