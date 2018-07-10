import { parse, format, UrlObject } from 'url';

export function replaceAddress(target: string, base: string) {
    const baseUri = parse(base, true, true);
    const targetUri = parse(target, true, true);
    if (targetUri.host !== null) { return target; }
    const result: UrlObject = {
        protocol: baseUri.protocol,
        slashes: true,
        host: baseUri.host,
        pathname: targetUri.pathname,
        query: targetUri.query
    };
    return format(result);
}
