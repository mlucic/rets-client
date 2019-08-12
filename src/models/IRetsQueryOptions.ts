import { RetsQueryStandardNamesType } from './RetsQueryStandardNamesType';
import { RetsQueryCountType } from './RetsQueryCountType';
import { RetsQueryType } from './RetsQueryType';
import { RetsFormat } from './RetsFormat';
import { DdfCulture } from './DdfCulture';

/**
 * RETS Search request parameters
 */
export interface IRetsQueryOptions {
    /**
     * Indicator for restricted fields (default ***)
     */
    restrictedIndicator?: string;
    /**
     * Name collection use in query (default UseSystemName)
     */
    standardNames?: RetsQueryStandardNamesType;
    /**
     * Query language type (default DMQL2)
     */
    queryType?: RetsQueryType;
    /**
     * Record format (default CompactDecoded)
     */
    format?: RetsFormat;
    /**
     * Record offset (starts from 1, default 1)
     */
    offset?: number;
    /**
     * Count return type (default OnlyRecord)
     */
    count?: RetsQueryCountType;
    /**
     * Record limit (default NONE)
     */
    limit?: number | 'NONE';
    /**
     * Query
     */
    query?: string;
    /**
     * Resource type
     */
    searchType: string;
    /**
     * Resource class name
     */
    class: string;
    /**
     * Selected fields
     */
    select?: string | string[];
    /**
     * DDF culture (only available for CREA DDF)
     */
    culture?: DdfCulture;
}
