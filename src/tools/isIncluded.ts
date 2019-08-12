export function isIncluded<T>(target: T | ((v: T) => boolean), source?: T | T[]): boolean {
    if (!source) { return false; }
    const handler = typeof target === 'function' ? target : (v: T) => v === target;
    return source instanceof Array ? source.some(handler) : handler(source);
}
