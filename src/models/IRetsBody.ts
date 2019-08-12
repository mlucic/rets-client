/**
 * RETS response body
 */
export interface IRetsBody {
    /**
     * RETS reply code
     */
    replyCode: number;
    /**
     * RETS reply message
     */
    replyText: string;
    /**
     * Reply code's meaning (based on RETS 1.8)
     */
    statusMessage: string;
    /**
     * Records returned by RETS server
     */
    records?: { [key: string]: any }[];
    /**
     * Extra information
     */
    extra: {
        /**
         * Is this request meets max rows
         */
        maxRowsExceeded?: boolean;
        /**
         * Record count that matching the query
         */
        count?: number;
        /**
         * Repy content (under RETS-RESPONSE)
         */
        content?: string;
        /**
         * DDF Pagination object (only available for CREA DDF)
         */
        pagination?: {
            /**
             * Total record count
             */
            total: number,
            /**
             * Query limit
             */
            limit: number,
            /**
             * Query offset
             */
            offset: number,
            /**
             * Page count under the query
             */
            pages: number,
            /**
             * Returned record count
             */
            returned: number
        };
        [key: string]: any
    };
}
