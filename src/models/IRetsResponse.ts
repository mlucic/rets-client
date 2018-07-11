import { Response } from 'request';

import { IRetsObject } from './IRetsObject';
import { IRetsBody } from './IRetsBody';

export interface IRetsResponse {
    headers: { [key: string]: string | string[] };
    body: IRetsBody | IRetsObject | IRetsObject[];
    response: Response;
}

