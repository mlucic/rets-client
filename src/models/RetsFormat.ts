/**
 * RETS response format
 */
export enum RetsFormat {
    /**
     * Compact decoded data (usually TSV)
     */
    CompactDecoded = 'COMPACT-DECODED',
    /**
     * Standard XML data (server may not support)
     */
    StandardXml = 'STANDARD-XML'
}
