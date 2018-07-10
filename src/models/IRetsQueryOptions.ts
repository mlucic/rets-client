import { RetsFormat } from './RetsFormat';

export interface IRetsQueryOptions {
    restrictedIndicator?: string;
    standardNames?: 0 | 1;
    queryType?: string;
    format?: RetsFormat;
    offset?: number;
    count?: 0 | 1 | 2;
    limit?: number | 'NONE';
    query?: string;
    searchType: string;
    class: string;
}
