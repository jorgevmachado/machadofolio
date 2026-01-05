import React ,{ useCallback ,useEffect ,useRef ,useState } from 'react';

import { snakeCaseToNormal } from '@repo/services';

import {
  type Bank ,
  type Bill ,
  type BillList ,
  type CreateBillParams ,
  EBillType ,
  type Group ,
  type UploadBillParams ,
  type UploadsExpenseParams ,
} from '@repo/business';

import { PageDelete ,useAlert ,useLoading ,useModal } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import {
  billBusiness ,
  billService ,
  expenseBusiness ,
  expenseService ,
} from '../../../shared';
import { useFinance } from '../../finances';

import {
  type AllCalculatedSummary ,
  BillPersist ,
  MultipleUploads ,
  SingleUploads ,
} from '../components';
import { NubankUpload } from '../components/uploads';

import { BillsContext ,type BillsContextProps } from './BillsContext';

type BillsProviderProps = {
  children: React.ReactNode;
}

export default function BillsProvider({ children }: BillsProviderProps) {
  const isMounted = useRef(false);

  const { t } = useI18n();
  const { show ,hide ,isLoading } = useLoading();
  const { addAlert } = useAlert();
  const { openModal ,modal ,closeModal } = useModal();

  const {
    fetch ,
    refresh ,
    banks ,
    groups ,
    suppliers ,
    hasAllDependencies,
  } = useFinance();

  const [billList ,setBillList] = useState<Array<BillList>>([]);
  const [bills ,setBills] = useState<Array<Bill>>([]);

  const fetchItems = useCallback(async () => {
    show();
    try {
      const response = await billService.getAll(
        { withRelations: true }
      ) as Array<Bill>;
      const billList = billBusiness.mapBillListByFilter(response ,'group');
      setBills(response);
      setBillList(billList);
    } catch (error) {
      addAlert({
        type: 'error' ,
        message: (error as Error)?.message ?? t('error_fetching_bills'),
      });
    } finally {
      hide();
    }
  } ,[addAlert ,hide ,show ,t]);

  const handleSubmit = useCallback(
    async (params: CreateBillParams ,bill?: Bill) => {
      show();
      try {
        const savedBill = 
        bill
          ? await billService.update(bill.id ,params)
          : await billService.create(params);
        addAlert({
          type: 'success' ,
          message: `${ t('bill') } ${ bill ? t('updated') : t('saved') } ${ t(
            'successfully'
          ) }!`,
        });
        await fetchItems();
        refresh();
        return savedBill;
      } catch (error) {
        addAlert({
          type: 'error' ,
          message: (error as Error)?.message ??
            `${ t('error_when') } ${ bill ? t('updating') : t('saving') } ${ t(
              'bill'
            ) }`,
        });
      } finally {
        hide();
      }
    } ,[addAlert ,fetchItems ,hide ,refresh ,show ,t]
  );

  const handleOnDelete = useCallback(
    async (item?: Bill) => {
      if (!item) return;
      show();
      try {
        await billService.remove(item.id);
        addAlert({
          type: 'success' ,
          message: `${ t('bill') } ${ t('deleted') } ${ t('successfully') }!`,
        });
        await fetchItems();
        refresh();
      } catch (error) {
        addAlert({
          type: 'error' ,
          message: (error as Error)?.message ?? t('error_deleting_bill'),
        });
      } finally {
        hide();
      }
    } ,
    [addAlert ,fetchItems ,hide ,refresh ,show ,t],
  );

  const handleUploadExpense = useCallback(
    async (bill: Bill ,params: UploadsExpenseParams) => {
      show();
      try {
        await expenseService.upload(bill.id ,params);
        addAlert({
          type: 'success' ,
          message: `${ t('expenses') } ${ t('uploaded') } ${ t(
            'successfully'
          ) }!`,
        });
        await fetchItems();
        refresh();
      } catch (error) {
        addAlert({
          type: 'error' ,
          message: (error as Error)?.message ?? t('error_upload_bill_expense'),
        });
      } finally {
        hide();
      }
    } ,[addAlert ,fetchItems ,hide ,refresh ,show ,t]
  );

  const handleUploadBill = useCallback(async (params: UploadBillParams) => {
    show();
    try {
      await billService.upload(params);
      addAlert({
        type: 'success' ,
        message: `${ t('bill') } ${ t('uploaded') } ${ t('successfully') }!`,
      });
      await fetchItems();
      refresh();
      window.location.reload();
    } catch (error) {
      addAlert({
        type: 'error' ,
        message: (error as Error)?.message ?? t('error_upload_bill'),
      });
    } finally {
      hide();
    }
    hide();
  } ,[addAlert ,fetchItems ,hide ,refresh ,show ,t]);

  const handleOpenPersistModal = useCallback(
    (bill?: Bill) => {
      openModal({
        width: '799px' ,
        title: `${ bill ? t('edit') : t('create') } ${ t('bill') }` ,
        body: (
          <BillPersist banks={ banks } groups={ groups } bill={ bill }
            onClose={ closeModal } onSubmit={ handleSubmit }/>
        ) ,
        closeOnEsc: true ,
        closeOnOutsideClick: true ,
        removeBackgroundScroll: true ,
      });
    } ,
    [banks ,closeModal ,groups ,handleSubmit ,openModal ,t],
  );

  const handleOpenDeleteModal = useCallback(
    (bill?: Bill) => {
      openModal({
        width: '700px' ,
        title: `${ t('want_to_delete') } ${ t('bill') }` ,
        body: (
          <PageDelete item={ bill } onClose={ closeModal }
            onDelete={ (item) => handleOnDelete(item as Bill) }/>
        ) ,
        closeOnEsc: true ,
        closeOnOutsideClick: true ,
        removeBackgroundScroll: true ,
      });
    } ,
    [closeModal ,handleOnDelete ,openModal ,t],
  );

  const handleUploadFilesModal = useCallback(
    (bill: Bill) => {
      openModal({
        width: '799px' ,
        title: t('register_expense_by_file') ,
        body: (
          <MultipleUploads bill={ bill } onClose={ closeModal }
            onSubmit={ handleUploadExpense }/>
        ) ,
        closeOnEsc: true ,
        closeOnOutsideClick: true ,
        removeBackgroundScroll: true ,
      });
    } ,
    [closeModal ,handleUploadExpense ,openModal ,t],
  );

  const handleUploadsFileModal = useCallback(() => {
    openModal({
      width: '799px' ,
      title: t('register_bill_by_file') ,
      body: (
        <SingleUploads billList={ billList } onClose={ closeModal }
          onSubmit={ handleUploadBill }/>
      ) ,
      closeOnEsc: true ,
      closeOnOutsideClick: true ,
      removeBackgroundScroll: true ,
    });
  } ,[billList ,closeModal ,handleUploadBill ,openModal ,t]);

  const handleCreateNubankCreditCard = useCallback(async (params: CreateBillParams) => {
    const bill = await handleSubmit(params);
    if (bill) {
      handleUploadFilesModal(bill);
    }
  } ,[handleSubmit, handleUploadFilesModal]);

  const handleUploadCreditCardNubankModal = useCallback(
    (group: Group ,bank: Bank) => {
      const year = new Date().getFullYear();
      const params: CreateBillParams = {
        year ,
        bank: bank.id ,
        group: group.id ,
        type: EBillType.CREDIT_CARD,
      };
      openModal({
        width: '799px' ,
        title: 'Criar uma conta do Nubank ?' ,
        body: (
          <NubankUpload onClose={ closeModal }
            onSubmit={ () =>  handleCreateNubankCreditCard(params) }/>
        ) ,
        closeOnEsc: true ,
        closeOnOutsideClick: true ,
        removeBackgroundScroll: true ,
      });
    } ,[closeModal, handleCreateNubankCreditCard, openModal]
  );

  const calculateAll = useCallback((bills: Array<Bill>) => {
    return bills.reduce((acc ,bill) => {
      if (!bill?.expenses || !bill?.expenses?.length) {
        return acc;
      }
      const expenses = bill.expenses.map(
        (expense) => expenseBusiness.calculate(expense)
      );
      const expensesCalculated = expenseBusiness.calculateAll(expenses);
      acc.total = acc.total + expensesCalculated.total;
      acc.allPaid = acc.allPaid && expensesCalculated.allPaid;
      acc.totalPaid = acc.totalPaid + expensesCalculated.totalPaid;
      acc.totalPending = acc.totalPending + expensesCalculated.totalPending;
      return acc;
    } ,{
      total: 0 ,
      allPaid: true ,
      totalPaid: 0 ,
      totalPending: 0,
    } as AllCalculatedSummary);
  } ,[]);

  const accordionTitle = useCallback((title: string) => {
    return title.replaceAll('pix' ,t('pix')).
      replaceAll('bank_slip' ,t('bank_slip')).
      replaceAll('credit_card' ,t('credit_card')).
      replaceAll('account_debit' ,t('account_debit'));
  } ,[t]);

  const getTitle = useCallback(
    (title: string ,type?: 'default' | 'accordion') => {
      const translatedText = type === 'accordion' ?
        accordionTitle(title) :
        title;
      if ((!type && type === 'default') && translatedText !== title) {
        return translatedText;
      }
      return snakeCaseToNormal(title);
    } ,[accordionTitle]
  );

  const billListFilter = useCallback(
    (list: Array<Bill> ,type: BillList['type']) => {
      return billBusiness.mapBillListByFilter(list ,type);
    } ,[]
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetch().then();
      fetchItems().then();
    }
  } ,[]);

  const context: BillsContextProps = {
    t ,
    modal ,
    bills ,
    banks ,
    groups ,
    getTitle ,
    billList ,
    suppliers ,
    isLoading ,
    fetchBill: fetchItems ,
    calculateAll ,
    billListFilter ,
    hasAllDependencies ,
    handleOpenDeleteModal ,
    handleUploadsFileModal ,
    handleUploadFilesModal ,
    handleOpenPersistModal ,
    handleUploadCreditCardNubankModal,
  };

  return (
    <BillsContext.Provider value={ context }>
      { children }
    </BillsContext.Provider>
  );
}