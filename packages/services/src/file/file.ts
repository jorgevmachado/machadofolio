import {REQUIRED_FIELD, ValidatorMessage, ValidatorParams} from "../shared";

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