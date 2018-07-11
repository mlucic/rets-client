export function defaultValue<T>(source: T | T[]): T {
    return source instanceof Array ? source[0] : source;
}
