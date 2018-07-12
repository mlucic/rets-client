import { defaultValue } from './defaultValue';

export function detectContentEncoding(headers: { [key: string]: string | string[] }): string {
    const format = defaultValue(headers.TransferEncoding) || '7bit';
    let encoding: string = 'ascii';
    if (format === '8bit') {
        encoding = 'utf8';
    } else if (format === 'binary') {
        encoding = 'latin1';
    } else if (format === 'base64') {
        encoding = 'base64';
    }
    return encoding;
}
