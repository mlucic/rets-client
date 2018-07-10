export function parseHexString(hex: string): string {
    const result: string[] = [];
    for (let i = -1; ++i < hex.length;) {
        result.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)));
        ++i;
    }
    return result.join('');
}
