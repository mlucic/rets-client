export interface IRetsResponseBody {
    replyCode: number;
    replyText: string;
    statusMessage: string;
    records?: { [key: string]: any }[];
    extra: {
        maxRowsExceeded?: boolean;
        count?: number;
        content?: string;
        pagination?: {
            total: number,
            limit: number,
            offset: number,
            pages: number,
            returned: number
        };
        [key: string]: any
    };
}
