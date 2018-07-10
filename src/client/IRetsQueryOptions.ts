import { RetsFormat } from './RetsFormat';

export interface IRetsQueryOptions {
    QueryType?: string;
    Format?: RetsFormat;
    Count?: number;
    StandardNames?: number;
    RestrictedIndicator?: string;
    Limit?: number;
    Offset?: number;
    SearchType: string;
    Class: string;
    Query?: string;
}
