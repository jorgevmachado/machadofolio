import {
  FINANCE_LOGO_BASE64 ,
  GEEK_LOGO_BASE64 ,
  LAW_LOGO_BASE64 ,
  NOTFOUND_IMAGE_BASE64 ,
} from '../../assets/base64';

import { type TImageSource ,type TUseImageSrcProps } from './types';

export default function useImageSrc({
  type,
  source,
  nameQueryUrl
}: TUseImageSrcProps) {
  switch (type) {
    case 'brand':
      return getBrandSrc(source, nameQueryUrl);
    case 'notfound':
      return NOTFOUND_IMAGE_BASE64;
    case 'standard':
    default:
      return;
  }
}

function getBrandSrc(source?: TImageSource, nameQueryUrl?: string) {
  const brand = source ?? getBrandByUrl(nameQueryUrl);
  switch (brand) {
    case 'law':
      return LAW_LOGO_BASE64;
    case 'finance':
      return FINANCE_LOGO_BASE64;
    case 'geek':
      return GEEK_LOGO_BASE64;
    default:
      return NOTFOUND_IMAGE_BASE64;
  }
}

function getBrandByUrl(propertyValue: string = '--brand-name') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }
  if(propertyValue.startsWith('--')) {
      return getBrandByComputedStyle(propertyValue);
  }
  return getBrandByParams(propertyValue);
}

function getBrandByComputedStyle(propertyValue: string) {
  return getComputedStyle(document.documentElement)
  .getPropertyValue(propertyValue)
  .replace(/['"]/g, '')
  .trim();
}

function getBrandByParams(propertyValue: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(propertyValue) ?? undefined;
}