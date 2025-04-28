export const linkingWords: Array<string> = ['de', 'da', 'do', 'das', 'dos'];

/**
 * Removes accents and extra spaces and Normalizes multiple spaces to a single space.
 * @param value
 */
export function normalize(value: string): string {
 return value
     .normalize('NFD')
     .replace(/[\u0300-\u036f]/g, '')
     .trim()
     .replace(/\s+/g, ' ');
}