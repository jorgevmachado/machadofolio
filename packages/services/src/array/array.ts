export function chunk<T>(arr: Array<T>, size: number): Array<Array<T>> {
    const result: Array<Array<T>> = [];
    for(let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}