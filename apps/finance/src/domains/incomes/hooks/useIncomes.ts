import { useContext } from 'react';

import { IncomesContext } from './IncomesContext';

export default function useIncomes() {
  return useContext(IncomesContext);
}