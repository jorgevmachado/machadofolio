import React ,{
  useCallback ,
  useEffect ,
  useRef ,
  useState,
} from 'react';

import { snakeCaseToNormal } from '@repo/services';

import { PageDelete ,useAlert ,useLoading ,useModal } from '@repo/ui';

import type {
  Bill ,
  BillList ,
  CreateBillParams ,
  UploadsExpenseParams,
} from '@repo/business';
import { useI18n } from '@repo/i18n';

import { useFinance } from '../../../hooks';
import {
  billBusiness ,
  billService ,
  expenseBusiness ,
  expenseService,
} from '../../../shared';

import { type AllCalculatedSummary,BillPersist ,ModalUpload } from '../components';

import { BillsContext ,type BillsContextProps } from './BillsContext';

type BillsProviderProps = {
  children: React.ReactNode;
}

export default function BillsProvider({ children }: BillsProviderProps)  {
  const isMounted = useRef(false);

  const { t } = useI18n();
  const { show, hide, isLoading } = useLoading();
  const { addAlert } = useAlert();
  const { openModal, modal, closeModal } = useModal();

  const { fetch, refresh, banks, groups, suppliers, hasAllDependencies } = useFinance();

  const [billList, setBillList] = useState<Array<BillList>>([]);

  const fetchItems = useCallback(async () => {
    show();
    try {
      const response = await billService.getAll({ withRelations: true }) as Array<Bill>;
      const billList = billBusiness.mapBillListByFilter(response, 'group');
      setBillList(billList);
    } catch (error) {
      addAlert({
        type: 'error',
        message: (error as Error)?.message ?? t('error_fetching_bills') });
    } finally {
      hide();
    }
  }, [addAlert, hide, show, t]);

  const handleSubmit = useCallback(async (params: CreateBillParams, bill?: Bill) => {
    show();
    try {
      bill
        ? await billService.update(bill.id, params)
        : await billService.create(params);
      addAlert({ type: 'success', message: `${t('bill')} ${bill ? t('updated') : t('saved')} ${t('successfully')}!` });
      await fetchItems();
      refresh();
    } catch (error) {
      addAlert({ type: 'error', message: (error as Error)?.message ?? `${t('error_when')} ${bill ? t('updating') : t('saving')} ${t('bill')}` });
    } finally {
      hide();
    }
  }, [addAlert, fetchItems, hide, refresh, show, t]);

  const handleOnDelete = useCallback(
    async (item?: Bill) => {
      if (!item) return;
      show();
      try {
        await billService.remove(item.id);
        addAlert({ type: 'success', message: `${t('bill')} ${t('deleted')} ${t('successfully')}!` });
        await fetchItems();
        refresh();
      } catch (error) {
        addAlert({ type: 'error', message: (error as Error)?.message ?? t('error_deleting_bill') });
      } finally {
        hide();
      }
    },
    [addAlert, fetchItems, hide, refresh, show, t]
  );

  const handleUploadExpense = useCallback(async (bill: Bill, params: UploadsExpenseParams) => {
    show();
    try {
      await expenseService.upload(bill.id, params);
      addAlert({ type: 'success', message: `${t('expenses')} ${t('uploaded')} ${t('successfully')}!` });
      await fetchItems();
      refresh();
    } catch (error) {
      addAlert({ type: 'error', message: (error as Error)?.message ?? t('error_upload_bill_expense') });
    } finally {
      hide();
    }
  }, [addAlert, fetchItems, hide, refresh, show, t]);

  const handleOpenPersistModal = useCallback(
    (bill?: Bill) => {
      openModal({
        width: '799px',
        title: `${bill ? t('edit') : t('create')} ${t('bill')}`,
        body: (
          <BillPersist banks={banks} groups={groups} bill={bill} onClose={closeModal} onSubmit={handleSubmit} />
        ),
        closeOnEsc: true,
        closeOnOutsideClick: true,
        removeBackgroundScroll: true,
      });
    },
    [banks, closeModal, groups, handleSubmit, openModal, t]
  );

  const handleOpenDeleteModal = useCallback(
    (bill?: Bill) => {
      openModal({
        width: '700px',
        title: `${t('want_to_delete')} ${t('bill')}`,
        body: (
          <PageDelete item={bill} onClose={closeModal} onDelete={(item) => handleOnDelete(item as Bill)} />
        ),
        closeOnEsc: true,
        closeOnOutsideClick: true,
        removeBackgroundScroll: true,
      });
    },
    [closeModal, handleOnDelete, openModal, t]
  );

  const handleUploadFileModal = useCallback(
    (bill: Bill) => {
      openModal({
        width: '799px',
        title: t('register_expense_by_file'),
        body: (
          <ModalUpload bill={bill} onClose={closeModal} onSubmit={handleUploadExpense} />
        ),
        closeOnEsc: true,
        closeOnOutsideClick: true,
        removeBackgroundScroll: true,
      });
    },
    [closeModal, handleUploadExpense, openModal, t]
  );
  
  const calculateAll = useCallback((bills: Array<Bill>) => {
    return bills.reduce((acc, bill) => {
      if (!bill?.expenses || !bill?.expenses?.length) {
        return acc;
      }
      const expenses = bill.expenses.map((expense) => expenseBusiness.calculate(expense));
      const expensesCalculated = expenseBusiness.calculateAll(expenses);
      acc.total = acc.total + expensesCalculated.total;
      acc.allPaid = acc.allPaid && expensesCalculated.allPaid;
      acc.totalPaid = acc.totalPaid + expensesCalculated.totalPaid;
      acc.totalPending = acc.totalPending + expensesCalculated.totalPending;
      return acc;
    }, { total: 0, allPaid: true, totalPaid: 0, totalPending: 0 } as AllCalculatedSummary);
  }, []);
  
  const accordionTitle =  useCallback((title: string) => {
    return title
      .replaceAll('pix', t('pix'))
      .replaceAll('bank_slip', t('bank_slip'))
      .replaceAll('credit_card', t('credit_card'))
      .replaceAll('account_debit', t('account_debit'));
  }, [t]);
  
  const getTitle = useCallback((title: string, type?: 'default' | 'accordion') => {
    const translatedText = type === 'accordion' ? accordionTitle(title) : title;
    if ((!type && type === 'default') && translatedText !== title) {
      return translatedText;
    }
    return snakeCaseToNormal(title);
  }, [accordionTitle]);
  
  const billListFilter = useCallback((list: Array<Bill>, type: BillList['type']) => {
    return billBusiness.mapBillListByFilter(list, type);
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetch().then();
      fetchItems().then();
    }
  }, []);

  const context: BillsContextProps = {
    t,
    modal,
    banks,
    groups,
    getTitle,
    billList,
    suppliers,
    isLoading,
    fetchBill: fetchItems,
    calculateAll,
    billListFilter,
    hasAllDependencies,
    handleOpenDeleteModal,
    handleUploadFileModal,
    handleOpenPersistModal
  };
  
  return (
    <BillsContext.Provider value={context}>
      {children}
    </BillsContext.Provider>
  );
}