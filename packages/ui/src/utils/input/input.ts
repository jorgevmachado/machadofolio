import { type CurrentValueParams } from './types';


export function currentValue({ name, type, item }: CurrentValueParams ): string {
  if(item && name) {
    const currentValue = (item as Record<string, unknown>)[name]
    if(type === 'select') {
      return (currentValue as { id?: string })?.id ?? ''
    }
    return typeof currentValue === 'string' ? currentValue : String(currentValue ?? '');
  }
  return '';
}