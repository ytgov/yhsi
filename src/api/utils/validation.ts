
export function nullIfEmpty(value: any) {
    if (value) return value;
    return null;
}

export class NotFoundError extends Error {

}
