export function clone<T>(val: T): T {
    if (Array.isArray(val)) {
        return [...val] as any;
    } else if (typeof val === "object") {
        return Object.assign({}, val);
    } else {
        return val;
    }
}

export function loadDefaults<T, U>(args: T, defaults: U): T {
    return Object.assign(defaults, args);
}