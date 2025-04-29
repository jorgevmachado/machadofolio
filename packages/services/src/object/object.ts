import {isDateString, parseDateFromString} from "../date";

export type FindEntityByParam<T> = {
 key: 'id' | 'name' | 'name_code';
 list: Array<T>
 value: string;
}

export function serialize(value: Record<string, unknown>): string | undefined {
 if(Object.keys(value).some((key) => key)) {
  return new URLSearchParams(value as Record<string, string>).toString();
 }
}

export function isObject(value: unknown): boolean {
 return value instanceof Object && !Array.isArray(value);
}

export function findEntityBy<T>({ key, value, list }: FindEntityByParam<T>): T {
 return list.find((item) => item[key] === value);
}

export function transformObjectDateAndNulls<T, U>(obj: U): T {
 if (Array.isArray(obj)) {
  return obj.map(transformObjectDateAndNulls) as unknown as T;
 }

 if (obj && typeof obj === 'object') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
   const newValue =
       typeof value === 'string' && ['created_at', 'updated_at', 'deleted_at']
           .includes(key)
           ? new Date(value)
           : value === null
               ? undefined
               : transformObjectDateAndNulls(value);
   return { ...acc, [key]: newValue };
  }, {} as T);
 }

 return obj as unknown as T;
}

export function transformDateStringInDate<T, U>(obj: U): T {
 if (Array.isArray(obj)) {
  return obj.map(transformDateStringInDate) as unknown as T;
 }

 if (obj && typeof obj === 'object' ) {
  return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
       key,
       typeof value === 'string' && isDateString({ value }).valid
           ? parseDateFromString(value) || value
           :  value !== null && value !== undefined && typeof value === 'object'
               ? transformDateStringInDate(value)
               : value
      ])
  ) as T;
 }
 return obj as unknown as T;
}