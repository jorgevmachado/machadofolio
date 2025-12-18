import '@testing-library/jest-dom'
import useImageSrc from './useImageSrc';
import {
  FINANCE_LOGO_BASE64 ,
  GEEK_LOGO_BASE64 ,
  LAW_LOGO_BASE64 ,
  NOTFOUND_IMAGE_BASE64 ,
} from '../../assets/base64';

describe('useImageSrc', () => {

  const mockGetComputedStyle = (brandValue: string, property = '--brand-name') => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      getPropertyValue: (prop: string) => (prop === property ? brandValue : ''),
    } as CSSStyleDeclaration));
  };

  afterEach(() => {
    document.documentElement.style.removeProperty('--brand-name');
    document.documentElement.style.removeProperty('--name-brand');
    document.documentElement.style.removeProperty('customBrand');
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });


    it('should return notFound src when type is notFound', () => {
      expect(useImageSrc({ type: 'notfound'})).toBe(NOTFOUND_IMAGE_BASE64);
    })

    it('should return standard src when type is standard', () => {
      expect(useImageSrc({ type: 'standard'})).toBeUndefined();
    })

    it('should return the src of the brand name "law" when the type is "brand" and the source is "law".', () => {
      expect(useImageSrc({ type: 'brand', source: 'law'})).toBe(LAW_LOGO_BASE64)
    })

    it('should return the src of the brand name "geek" when the type is "brand" and the source is "geek".', () => {
      expect(useImageSrc({ type: 'brand', source: 'geek'})).toBe(GEEK_LOGO_BASE64)
    })

    it('should return the src of the brand name "finance" when the type is "brand" and the source is "finance".', () => {
      expect(useImageSrc({ type: 'brand', source: 'finance'})).toBe(FINANCE_LOGO_BASE64)
    })

    it('should return the src of the brand name "notFound" when the type is "brand" and the source is "other".', () => {
    expect(useImageSrc({ type: 'brand', source: 'other' as any})).toBe(NOTFOUND_IMAGE_BASE64)
  })

    it('should return the src of the brand name "notFound" when the type is "brand" and the getStandardBrandSrc return undefined.', () => {
      expect(useImageSrc({ type: 'brand'})).toBe(NOTFOUND_IMAGE_BASE64)
    })

    it('should return the src of the brand name "law" when the type is "brand" and the source is undefined, and the url query param --brand-name is equal to "law"".', () => {
      mockGetComputedStyle('law')
      expect(useImageSrc({ type: 'brand' })).toBe(LAW_LOGO_BASE64);
    })

    it('should return the src of the brand name "geek" when the type is "brand" and the source is undefined, and the url query param --brand-name is equal to "geek"".', () => {
      mockGetComputedStyle('geek')
      expect(useImageSrc({ type: 'brand' })).toBe(GEEK_LOGO_BASE64);
    })

    it('should return the src of the brand name "finance" when the type is "brand" and the source is undefined, and the url query param --brand-name is equal to "finance"".', () => {
      mockGetComputedStyle('finance')
      expect(useImageSrc({ type: 'brand' })).toBe(FINANCE_LOGO_BASE64);
    })

    it('should return the src of the brand name "law" when the type is "brand" and the source is undefined, and the url query param is a custom param with value "law"".',() => {
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { search: '?customBrand=law' } as any;
      // eslint-disable-next-line no-console
      console.log('window.location.search:', window.location.search);
      expect(useImageSrc({ type: 'brand', nameQueryUrl: 'customBrand' })).toBe(LAW_LOGO_BASE64);
      window.location = originalLocation as any;
    })

    it('should return the src of the brand name "geek" when the type is "brand" and the source is undefined, and the url query param is a custom param with value "geek"".',() => {
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { search: '?customBrand=geek' } as any;
      // eslint-disable-next-line no-console
      console.log('window.location.search:', window.location.search);
      expect(useImageSrc({ type: 'brand', nameQueryUrl: 'customBrand' })).toBe(GEEK_LOGO_BASE64);
      window.location = originalLocation as any;
    })

    it('should return the src of the brande name "finance" when the type is "brand" and the source is undefined, and the url query param is a custom param with value "finance"".',() => {
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { search: '?customBrand=finance' } as any;
      // eslint-disable-next-line no-console
      console.log('window.location.search:', window.location.search);
      expect(useImageSrc({ type: 'brand', nameQueryUrl: 'customBrand' })).toBe(FINANCE_LOGO_BASE64);
      window.location = originalLocation as any;
    })

    it('should return the src of the brand name "law" when the type is "brand" and the source is undefined, and the default url query param --name-brand is equal to "law"', () => {
      mockGetComputedStyle('law', '--name-brand');
      expect(useImageSrc({ type: 'brand', nameQueryUrl: '--name-brand' })).toBe(LAW_LOGO_BASE64);
    })

    it('should return the src of the brand name "geek" when the type is "brand" and the source is undefined, and the default url query param --name-brand is equal to "geek"', () => {
      mockGetComputedStyle('geek', '--name-brand');
      expect(useImageSrc({ type: 'brand', nameQueryUrl: '--name-brand' })).toBe(GEEK_LOGO_BASE64);
    })

    it('should return the src of the brand name "finance" when the type is "brand" and the source is undefined, and the default url query param --name-brand is equal to "finance"', () => {
      mockGetComputedStyle('finance', '--name-brand');
      expect(useImageSrc({ type: 'brand', nameQueryUrl: '--name-brand' })).toBe(FINANCE_LOGO_BASE64);
    })

    it('should return the src of the brand name "finance" when the type is "brand" and the source is undefined, and window not exist', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      // @ts-ignore
      // delete global.document;
      expect(useImageSrc({ type: 'brand' })).toBe(NOTFOUND_IMAGE_BASE64);
      // @ts-ignore
      global.window = originalWindow;
  })

    it('should return the src of the brand name "finance" when the type is "brand" and the source is undefined, and nameQuery not exist in url', () => {
      mockGetComputedStyle('finance', 'other-brand');
      expect(useImageSrc({ type: 'brand', nameQueryUrl: 'name-brand' })).toBe(NOTFOUND_IMAGE_BASE64);
  })

});

