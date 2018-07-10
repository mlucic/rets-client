import { Response } from 'request';

import { IRetsResponseBody } from './IRetsResponseBody';

export interface IRetsResponse {
    headers: { [key: string]: string | string[] };
    body: IRetsResponseBody;
    response: Response;
}

