import { toCamelCase } from '@dlcs/tools';
import { trim } from 'lodash';

export function processHeaders(headers?: string[]) {
    if (!headers || !(headers instanceof Array) || headers.length === 0) { return {}; }
    const result: { [key: string]: any } = {};
    let i = 0;
    while (i < headers.length) {
        const [key, value] = [headers[i].toLowerCase(), headers[i + 1]];
        if (key === 'content-disposition') { // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition
            value.split(/\s*;\s*/).forEach((disposition, index) => {
                if (index === 0) {
                    mergeValue(result, 'dispositionType', disposition);
                } else {
                    const name = disposition.indexOf('=');
                    if (name > -1) {
                        mergeValue(result, toCamelCase(disposition.substring(0, name)), trim(disposition.substring(name + 1), '"'));
                    }
                }
            });
        } else if (key === 'content-transfer-encoding') {
            mergeValue(result, 'transferEncoding', value.toLowerCase());
        } else {
            mergeValue(result, toCamelCase(key), value);
        }
        i += 2;
    }
    if (result.objectData != null) {
        const dataArray: string[] = result.objectData instanceof Array ? result.objectData : [result.objectData];
        result.objectData = dataArray.reduce<{ [key: string]: any }>((previous, data) => {
            const index = data.indexOf('=');
            mergeValue(previous, toCamelCase(data.substring(0, index)), data.substring(index + 1));
            return previous;
        }, {});
    }
    return result;
}

function mergeValue(source: { [key: string]: any }, key: string, value: string): { [key: string]: any } {
    if (source[key] == null) {
        source[key] = value;
    } else if (!(source[key] instanceof Array)) {
        source[key] = [source[key], value];
    } else {
        source[key].push(value);
    }
    return source;
}
