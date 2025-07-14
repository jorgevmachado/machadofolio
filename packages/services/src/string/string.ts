import { serialize } from '../object';

export const linkingWords: Array<string> = ['de', 'da', 'do', 'das', 'dos'];

export function normalize(value: string): string {
 return value
     .normalize('NFD')
     .replace(/[\u0300-\u036f]/g, '')
     .trim()
     .replace(/\s+/g, ' ');
}

export function capitalize(value: string): string {
 return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toCamelCase(value?: string): string {
 if(!value) {
  return '';
 }
 return value.replace(/_([a-z])/g, (_, group) => group.toUpperCase());
}

export function separateCamelCase(value: string): string {
 return value
     .split(/(?=[A-Z])/)
     .map((word) => word.toLowerCase())
     .map((word, index) =>
         index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
     )
     .join(' ');
}

export function toSnakeCase(value?: string): string {
 if(!value) {
  return '';
 }

 const matches = value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g);

 if(!matches) {
  return value;
 }

 return matches.map((word) => word.toLowerCase()).join('_');
}

export function snakeCaseToNormal(value: string): string {
 const trimmedValue = value.trim();

 if (!trimmedValue.includes('_')) {
  if (
      trimmedValue === trimmedValue.toLowerCase() ||
      trimmedValue === trimmedValue.toUpperCase()
  ) {
   return (
       trimmedValue.charAt(0).toUpperCase() +
       trimmedValue.slice(1).toLowerCase()
   );
  }
  return trimmedValue;
 }

 return trimmedValue
     .toLowerCase()
     .split('_')
     .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palavra
     .join(' ');
}

export function extractLastItemFromUrl(url?: string): string {
 if (!url) {
  return '';
 }
 const sanitizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

 const segments = sanitizedUrl.split('/');
 return segments[segments.length - 1] || '';
}

export function truncateString(value: string, length: number = 0, isNormalize: boolean = true): string {
 if (!value || length <= 0) {
  return '';
 }
 const currentValue = isNormalize ? normalize(value) : value;
 return currentValue.slice(0, length).toUpperCase();
}

export function findRepeated<T extends { id: string; name?: string; }>(list: Array<T>, key: 'id' | 'name'): string | undefined {
 const fieldSet = new Set<string>();

 for (const item of list) {
  const fieldValue = item[key];
  if (fieldValue && fieldSet.has(fieldValue)) {
   return item[key];
  }
  if(fieldValue) {
   fieldSet.add(fieldValue);
  }
 }
 return;
}

export function initials(value: string, length: number = 0, stopWords: Array<string> = linkingWords): string {
 if (length <= 0) {
  return capitalize(value);
 }

 const normalized = normalize(value);
 const normalizedStopWords = stopWords.map((word) =>
     normalize(word.toLowerCase()),
 );

 const nameParts = normalized.split(' ');

 const relevantWords = nameParts.filter(
     (word) =>
         word.length > 1 &&
         !normalizedStopWords.includes(normalize(word.toLowerCase())),
 );

 return relevantWords
     .map((word) => word?.[0]?.toUpperCase() || '')
     .slice(0, length)
     .join('');
}

export function formatUrl(url: string, path: string, params = {}): string {
 const query = serialize(params);
 const filteredUrl = [url, path].filter((i) => i).join('/');

 return `${filteredUrl}${query ? `?${query}` : ''}`;
}

export function validatePath(path: string): string {
 if (!path.startsWith('/')) {
  return `/${path}`;
 }
 return path;
}

export type FormatPathParams = {
 childPath: string;
 parentPath: string;
 grandParentPath?: string;
}

export function formatPath({ childPath, parentPath, grandParentPath }: FormatPathParams): string {
 const formatParentPath = validatePath(parentPath);
 const formatChildPath = validatePath(childPath);
 if(!grandParentPath) {
  return `${formatParentPath}${formatChildPath}`;
 }
 const formatGrandParentPath = validatePath(grandParentPath);
 return `${formatGrandParentPath}${formatParentPath}${formatChildPath}`;
}

export type ConvertSubPathUrlParams = {
 by?: string;
 pathUrl: string;
 isParam?: boolean;
 subPathUrl?: string;
 conectorPath?: string;
}

export function convertSubPathUrl({ by, pathUrl, isParam, subPathUrl, conectorPath }: ConvertSubPathUrlParams): string {
 const currentPathUrl = !by ? pathUrl : `${pathUrl}/${by}`;
 if (!subPathUrl) {
  const currentParam = conectorPath ? `/${conectorPath}` : '';
  return isParam ? `${currentPathUrl}${currentParam}` : currentPathUrl;
 }
 if (!conectorPath) {
  return `${currentPathUrl}/${subPathUrl}`;
 }
 return `${currentPathUrl}/${conectorPath}/${subPathUrl}`;
}

export function cleanFormatter(value?: string): string {
 if(!value) {
  return '';
 }
 return value.replace(/\W/g, '');
}

export function sanitize(value: string): string {
 const regex = /[\WA-Z]/g;
 return value.replace(regex, '');
}

export function cleanTextByListText(listText: Array<string>, text: string): string {
 const orderedGroups = [...listText].sort((a, b) => b.length - a.length);

 const result = orderedGroups.reduce((acc, group) => {
  const regex = new RegExp(`\\b${group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  return acc.replace(regex, '').replace(/\s{2,}/g, ' ');

 }, text);

 return result.trim().replace(/\s{2,}/g, ' ');
}