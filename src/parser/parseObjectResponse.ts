import { parseRetsResponse } from './parseRetsResponse';
import { defaultValue } from '../tools/defaultValue';
import { IRetsObject } from '../models';

export async function parseObjectResponse(body: any, headers: { [key: string]: string | string[] }): Promise<IRetsObject> {
    const result: IRetsObject = { type: defaultValue(headers.ContentType) };
    if (headers.Location) { // 地址
        result.address = defaultValue(headers.Location);
    }
    if (headers.ObjectID) { // ID
        result.id = defaultValue(headers.ObjectID);
    }
    if (headers.ContentDescription) { // 描述
        result.description = defaultValue(headers.ContentDescription);
        if (result.description === 'null') { delete result.description; }
    }
    if (defaultValue(headers.ContentType) === 'text/xml') { // 错误
        result.error = await parseRetsResponse(body);
        return result;
    }
    if (!body || body === '') { return result; }
    if (body instanceof Buffer) { // 单一文件
        result.content = body;
        return result;
    }
    // 文本编码
    let content: Buffer;
    const format = defaultValue(headers.TransferEncoding) || '7bit';
    let encoding: string = 'ascii';
    if (format === '8bit') {
        encoding = 'utf8';
    } else if (format === 'binary') {
        encoding = 'latin1';
    } else if (format === 'base64') {
        encoding = 'base64';
    }
    content = body instanceof Buffer ? body : Buffer.from(body, encoding);
    result.content = content;
    return result;
}
