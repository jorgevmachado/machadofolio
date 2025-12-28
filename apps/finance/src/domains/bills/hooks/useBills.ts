import { useContext } from 'react';

import { BillsContext } from './BillsContext';

export default function useBills() {
  return useContext(BillsContext);
}