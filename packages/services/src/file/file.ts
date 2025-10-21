import { INVALID_TYPE, REQUIRED_FIELD, type ValidatorMessage, type ValidatorParams } from '../shared';

export function imageTypeValidator({ accept }: ValidatorParams): ValidatorMessage {
 if (!accept) {
  return REQUIRED_FIELD;
 }

 const types = accept.split(',').map((type) => type.trim());

 const mimeRegex = /^image\/(\*|jpeg|jpg|png|gif|bmp|webp|svg\+xml|tiff|ico)$/;
 const extensionRegex = /\.(jpeg|jpg|png|gif|bmp|webp|svg|tiff|ico)$/i;

 const valid = types.every(
     (type) => mimeRegex.test(type) || extensionRegex.test(type),
 );
 return {
  valid,
  accept: valid ? accept : undefined,
  message: valid ? 'Valid image type.' : 'Please enter a valid image type.',
 };
}

export function fileBase64Validator({ value }: ValidatorParams): ValidatorMessage {
    if (!value) {
        return REQUIRED_FIELD;
    }

    if (typeof value !== 'string') {
        return INVALID_TYPE;
    }

    return {
        valid: true,
        value,
        message: 'Valid file.',
    }
}

export async function urlToBlob(url: string): Promise<Blob> {
    const res = await fetch(url);
    return await res.blob();
}

export async function urlToBase64(url: string): Promise<string> {
 const blob = await urlToBlob(url);
 return await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
  reader.readAsDataURL(blob);
 });
}

export function fileToBase64(file: File): Promise<string> {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = ev => resolve(ev.target?.result as string);
  reader.onerror = error => reject(error);
  reader.readAsDataURL(file);
 });
}

export function extractExtensionFromBase64(base64: string): string | undefined {
 const result = base64.match(/data:(.*?);base64,/);
 if (result && result[1]) {
  const mimeType = result[1];
  const currentMimeType = mimeType.split('/').pop();
  if(currentMimeType === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'xlsx';
  }
  return mimeType.split('/').pop();
 }
 return;
}