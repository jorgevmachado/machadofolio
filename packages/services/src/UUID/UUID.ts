import { validate as isUuid, v4 as uuidv4 } from 'uuid';

export function generateUUID(prefix?: string): string {
 const uuid = uuidv4();
 return prefix ? `${prefix}-${uuid}` : uuid;
}

export function isUUID(value: string): boolean {
 return isUuid(value);
}