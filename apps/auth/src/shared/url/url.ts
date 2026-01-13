import { useCallback ,useMemo } from 'react';

import { baseUrl } from '../services';

type TBrand = 'finance' | 'law' | 'geek';
type TEnv = 'dev' | 'stg' | 'prod';

const portMap: Record<TBrand, Record<TEnv, string>> = {
  finance: { dev: '4002', stg: '4102', prod: '4202' },
  geek: { dev: '4003', stg: '4103', prod: '4203' },
  law: { dev: '4004', stg: '4104', prod: '4204' }
};

export default function useAuthUrl(brand: TBrand) {

  const localhostSystemUrl = useCallback((url: URL) => {
    const port = url.port;
    switch (port) {
      case '4101':
        url.port = portMap[brand]?.stg ?? '4101';
        return url.toString();
      case '4201':
        url.port = portMap[brand]?.prod ?? '4201';
        return url.toString();
      case '4001':
      default:
        url.port = portMap[brand]?.dev ?? '4001';
        return url.toString();
    }
  }, [brand]);
  
  const currentUrl = useMemo(() => {
    if (typeof window === 'undefined'){
      return baseUrl;
    }
    return window.location.href;
  }, []);

  const systemUrl = useMemo(() => {
    return `${currentUrl}/${brand}`;
  }, [brand, currentUrl]);
  
  const currentSystemUrl = useMemo(() => {
    const url = new URL(currentUrl);
    if (url.hostname === 'localhost') {
      url.pathname = '';
      return localhostSystemUrl(url);
    }
    return systemUrl;
  }, [currentUrl, localhostSystemUrl, systemUrl]);
  
  return {
    currentUrl,
    currentSystemUrl
  };
}