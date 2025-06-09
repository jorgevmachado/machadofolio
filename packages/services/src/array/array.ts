export function chunk<T>(arr: Array<T>, size: number): Array<Array<T>> {
    const result: Array<Array<T>> = [];
    for(let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export function intersectArrays<T>(arrSource: Array<T>, arrSearch: Array<T>): Array<T> {
    const setArrSearch = new Set(arrSearch);
    return arrSource.filter((item) => setArrSearch.has(item));
}

export function filterByCommonKeys<T>( key: string, arrSource: Array<T>, arrSearch: Array<T>): Array<T> {
    const ids = new Set(arrSearch.map((item) => item[key]));
    return arrSource.filter((item) => ids.has(item[key]));
}