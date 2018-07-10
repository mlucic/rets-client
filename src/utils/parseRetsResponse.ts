import * as Xml2Js from 'xml2js';

import { RetsProcessingError, RetsReplyError } from './errors';
import { IRetsResponseBody } from '../client/IRetsResponse';
import { findReplyCodeName } from './ReplyCode';
import { parseHexString } from './parseHexString';

const parser = new Xml2Js.Parser(Xml2Js.defaults['0.2']);

async function parseString(content: string): Promise<{ [key: string]: any }> {
    return new Promise((resolve, reject) => {
        parser.parseString(content, (err: Error | null, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function readNodeContent(source: any): string | undefined {
    if (typeof source === 'string') { return source; }
    return source._;
}

export async function parseRetsResponse(source: string, recordXmlTagName?: string): Promise<IRetsResponseBody> {
    const document = await parseString(source).catch((e: Error) => e);
    if (document instanceof Error) { throw new RetsProcessingError(document); }
    if (!document.RETS) { throw new RetsProcessingError(new TypeError('Unable to find RETS root element')); }
    const root: { [key: string]: any } = document.RETS;
    const result: IRetsResponseBody = {
        replyCode: +root.$.ReplyCode,
        replyText: root.$.ReplyText,
        statusMessage: findReplyCodeName(root.$.ReplyCode) || 'Unknown reply code',
        extra: {}
    };
    if (root['RETS-STATUS']) {
        const extraStatus = root['RETS-STATUS'][0].$ || {};
        result.replyCode = +(extraStatus.replyCode || result.replyCode);
        result.replyText = extraStatus.ReplyText || result.replyText;
        result.statusMessage = findReplyCodeName(result.replyCode) || 'Unknown reply code';
    }
    if (root['COLUMNS']) {
        let dataDelimiter = '\t';
        if (root['DELIMITER']) { dataDelimiter = parseHexString(root['DELIMITER'][0].$.value); }
        const columns = (root['COLUMNS'][0] as string).split(dataDelimiter);
        const rawData = (root['DATA'] as string[] || []).map(v => v.split(dataDelimiter));
        result.records = rawData.map(raw => raw.reduce((p, v, i) => {
            p[columns[i]] = v;
            return p;
        }, {} as { [key: string]: string }));
    }
    Object.keys(root).filter(v => v !== '$' && v !== 'RETS-STATUS' && v !== 'COLUMNS' && v !== 'DELIMITER' && v !== 'DATA').forEach(key => {
        if (key === 'MAXROWS') {
            result.extra.maxRowsExceeded = true;
        } else if (key === 'COUNT') {
            result.extra.count = root[key][0].$.Records;
        } else if (recordXmlTagName && key === recordXmlTagName) {
            result.records = (result.records || []).concat(root[key]);
        } else if (key === 'RETS-RESPONSE') {
            if (root[key][0].$ && (root[key][0].$.xmlns || '').includes('CREA')) { // CREA DDF
                const responseContent = root[key][0];
                if (responseContent['Pagination']) {
                    const pagination = responseContent['Pagination'][0];
                    result.extra.pagination = {
                        total: +pagination.TotalRecords[0],
                        limit: +pagination.Limit[0],
                        offset: +pagination.Offset[0],
                        pages: +pagination.TotalPages[0],
                        returned: +pagination.RecordsReturned[0]
                    };
                }
                Object.keys(responseContent).filter(v => v !== 'Pagination').forEach(data =>
                    result.records = (result.records || []).concat(responseContent[data])
                );
            } else {
                result.extra.content = readNodeContent(root[key][0]);
            }
        } else {
            result.extra[key] = root[key] instanceof Array ? (root[key].length === 0 ? root[key][0] : root[key]) : root[key];
        }
    });
    if (result.replyCode !== 0 && result.replyCode !== 20208) {
        throw new RetsReplyError(result);
    }
    return result;
}
