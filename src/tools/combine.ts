import { IRetsQueryOptions, RetsFormat, IRetsObjectOptions } from '../models';

export function combineQueryOptions(source: IRetsQueryOptions): { [key: string]: any } {
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
    return result;
}

export function combineObjectOptions(source: IRetsObjectOptions): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result.Resource = source.resource;
    result.Type = source.type;
    result.ID = `${source.contentId}:${source.objectId || '*'}`;
    result.Location = source.withLocation ? 1 : 0;
    result.Culture = source.culture;
    return result;
}
