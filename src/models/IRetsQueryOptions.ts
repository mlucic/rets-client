import { RetsFormat } from './RetsFormat';

export interface IRetsQueryOptions {
    restrictedIndicator?: string;
    standardNames?: number;
    queryType?: string;
    format?: RetsFormat;
    offset?: number;
    count?: number;
    limit?: number;
    query?: string;
    searchType: string;
    class: string;
}
