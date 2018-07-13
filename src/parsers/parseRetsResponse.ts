import * as Xml2Js from 'xml2js';

import { IRetsBody, RetsProcessingError, RetsReplyError } from '../models';
import { findReplyCodeName } from '../tools/ReplyCode';
import { decodeHexString } from '../tools/decodeHexString';

const XML_ATTRIBUTES = '_XmlAttributes';
const XML_CONTENT = '_XmlContent';

const parser = new Xml2Js.Parser({ ...Xml2Js.defaults['0.2'], explicitArray: false, attrkey: XML_ATTRIBUTES, charkey: XML_CONTENT });

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
    return source[XML_CONTENT];
}

export async function parseRetsResponse(source: string, recordXmlTagName?: string): Promise<IRetsBody> {
    const document = await parseString(source).catch((e: Error) => e);
    if (document instanceof Error) { throw new RetsProcessingError(document); }
    if (!document.RETS) { throw new RetsProcessingError(new TypeError('Unable to find RETS root element')); }
    const root: { [key: string]: any } = document.RETS;
    const result: IRetsBody = {
        replyCode: +root[XML_ATTRIBUTES].ReplyCode,
        replyText: root[XML_ATTRIBUTES].ReplyText,
        statusMessage: findReplyCodeName(root[XML_ATTRIBUTES].ReplyCode) || 'Unknown reply code',
        extra: {}
    };
    if (root['RETS-STATUS']) { // 额外状态
        const extraStatus = root['RETS-STATUS'][XML_ATTRIBUTES] || {};
        result.replyCode = +(extraStatus.replyCode || result.replyCode);
        result.replyText = extraStatus.ReplyText || result.replyText;
        result.statusMessage = findReplyCodeName(result.replyCode) || 'Unknown reply code';
    }
    if (root['COLUMNS']) { // COMPACT数据
        let dataDelimiter = '\t';
        if (root['DELIMITER']) { dataDelimiter = decodeHexString(root['DELIMITER'][XML_ATTRIBUTES].value); }
        const columns = (root['COLUMNS'] as string).split(dataDelimiter);
        const element: string | string[] | undefined = root['DATA'];
        const rawData = (element ? (element instanceof Array ? element : [element]) : []).map(v => v.split(dataDelimiter));
        result.records = rawData.map(raw => raw.reduce((p, v, i) => {
            if (columns[i] === '') { return p; } // 写在这里以保证读取顺序
            p[columns[i]] = v;
            return p;
        }, {} as { [key: string]: string }));
    }
    Object.keys(root).filter(v => v !== XML_ATTRIBUTES && v !== 'RETS-STATUS' && v !== 'COLUMNS' && v !== 'DELIMITER' && v !== 'DATA').forEach(key => {
        if (key === 'MAXROWS') {
            result.extra.maxRowsExceeded = true;
        } else if (key === 'COUNT') {
            result.extra.count = root[key][XML_ATTRIBUTES].Records;
        } else if (recordXmlTagName && key === recordXmlTagName) {
            result.records = (result.records || []).concat(root[key]);
        } else if (key === 'RETS-RESPONSE') { // RETS回执
            if (root[key][XML_ATTRIBUTES] && (root[key][XML_ATTRIBUTES].xmlns || '').includes('CREA')) { // CREA DDF
                const responseContent = root[key];
                if (responseContent['Pagination']) {
                    const pagination = responseContent['Pagination'];
                    result.extra.pagination = {
                        total: +pagination.TotalRecords,
                        limit: +pagination.Limit,
                        offset: +pagination.Offset,
                        pages: +pagination.TotalPages,
                        returned: +pagination.RecordsReturned
                    };
                }
                Object.keys(responseContent).filter(v => v !== 'Pagination' && v !== XML_ATTRIBUTES && v !== XML_CONTENT).forEach(data =>
                    result.records = (result.records || []).concat(responseContent[data])
                );
            } else { // 其他情况
                result.extra.content = readNodeContent(root[key]);
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
