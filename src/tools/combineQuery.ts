import { IRetsQueryOptions, RetsFormat, RetsProcessingError } from '../models';

export function combineQuery(source: IRetsQueryOptions): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result.QueryType = source.queryType || 'DMQL2';
    result.RestrictedIndicator = source.restrictedIndicator || '***';
    result.StandardNames = source.standardNames || 0;
    result.Format = source.format || RetsFormat.CompactDecoded;
    result.Offset = source.offset || 1;
    result.Count = source.count || 1;
    result.Limit = source.limit || 'NONE';
    result.Query = source.query;
    result.SearchType = source.searchType;
    result.Class = source.class;
    result.Culture = source.culture;
    if (!result.SearchType) { throw new RetsProcessingError(new TypeError('SearchType is required for Search action')); }
    if (!result.Class) { throw new RetsProcessingError(new TypeError('Class is required for Search action')); }
    return result;
}
