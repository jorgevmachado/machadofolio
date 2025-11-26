import { useContext } from 'react';

import { ExpensesContext } from './ExpensesContext';

export default function useExpenses() {
    return useContext(ExpensesContext);
}