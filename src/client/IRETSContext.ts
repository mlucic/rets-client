import { IRetsQueryOptions } from './IRetsQueryOptions';

export interface IRetsContext {
    header: { [key: string]: string };
    method: string;
    queryOptions: IRetsQueryOptions;
}
