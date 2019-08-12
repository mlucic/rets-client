import {
    IRetsQueryOptions, RetsFormat, IRetsObjectOptions, RetsQueryType, RetsQueryStandardNamesType, RetsQueryCountType
} from '../models';

export function combineQueryOptions(source: IRetsQueryOptions): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result.QueryType = source.queryType || RetsQueryType.DMQL2;
    result.RestrictedIndicator = source.restrictedIndicator || '***';
    result.StandardNames = source.standardNames || RetsQueryStandardNamesType.UseSystemName;
    result.Format = source.format || RetsFormat.CompactDecoded;
    result.Offset = source.offset || 1;
    result.Count = source.count || RetsQueryCountType.OnlyRecord;
    result.Limit = source.limit || 'NONE';
    result.Query = source.query;
    result.SearchType = source.searchType;
    result.Class = source.class;
    result.Culture = source.culture;
    result.Select = source.select ? ( source.select instanceof Array ? source.select.join(',') : source.select ) : undefined;
    return result;
}

export function combineObjectOptions(source: IRetsObjectOptions): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    result.Resource = source.resource;
    result.Type = source.type;

    let search_ids = [];

    for (let content_id in source.content) {
        search_ids.push(`${ content_id }:${ source.content[content_id] }`);
    }

    result.ID = search_ids.join(',');
    result.Location = source.withLocation ? 1 : 0;
    result.Culture = source.culture;
    return result;
}
