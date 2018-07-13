import { trim, flatten } from 'lodash';

import { IRetsObject, RetsProcessingError } from '../models';
import { detectContentEncoding } from '../tools/detectContentEncoding';
import { processHeaders } from '../tools/processHeaders';
import { defaultValue } from '../tools/defaultValue';
import { parseObjectResponse } from './parseObjectResponse';

const LINE_SPLITTER = Buffer.from('\r\n');
const PART_SPLITTER = Buffer.from('\r\n\r\n');

export async function parseMultipartResponse(body: Buffer, headers: { [key: string]: string | string[] }): Promise<IRetsObject[]> {
    const encoding = detectContentEncoding(headers);
    const boundary = Buffer.from(findBoundary(headers), encoding);
    const result: IRetsObject[] = [];
    for (let i = -1, length = body.length; i < length;) {
        let boundaryIndex = findBufferIndex(body, boundary, i);
        if (boundaryIndex < 0) { return result; }
        boundaryIndex += boundary.length + LINE_SPLITTER.length; // 跳过Boundary和换行符 (\r\n)
        const headerEndIndex = findBufferIndex(body, PART_SPLITTER, boundaryIndex); // 找到Header和二进制数据的分界点
        if (headerEndIndex < 0) { return result; }
        const headerText = body.slice(boundaryIndex, headerEndIndex).toString(encoding);
        let nextBoundayIndex = findBufferIndex(body, boundary, headerEndIndex + PART_SPLITTER.length);
        if (nextBoundayIndex < 0) { return result; } // 如果没有下一个数据的开始边界，则到达结尾
        nextBoundayIndex -= LINE_SPLITTER.length;
        const content = body.slice(headerEndIndex + PART_SPLITTER.length, nextBoundayIndex);
        result.push(await parseObjectResponse(content, {
            ...headers,
            ...processHeaders(flatten(headerText.split('\r\n').map(v =>
                [v.substring(0, v.indexOf(':')), trim(v.substring((v.indexOf(':') + 1)))]
            )))
        }));
        i = nextBoundayIndex + LINE_SPLITTER.length;
    }
    return result;
}

function findBufferIndex(source: Buffer, target: Buffer, startAt: number = 0): number {
    for (let i = startAt - 1, length = source.length; ++i < length;) {
        let fit = true;
        for (let j = -1; ++j < target.length;) {
            if (source[i + j] !== target[j]) {
                fit = false;
                break;
            }
        }
        if (fit) { return i; }
    }
    return -1;
}

function findBoundary(headers: { [key: string]: string | string[] }): string {
    const boundary = defaultValue(headers.ContentType).match(/boundary=([^;]+)/);
    if (!boundary) { throw new RetsProcessingError(new TypeError('Could not find boundary under Content-Type')); }
    return `--${trim(boundary[1], '"')}`;
}
