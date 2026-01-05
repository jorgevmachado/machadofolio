import React ,{
  useCallback ,
  useEffect ,
  useMemo ,
  useRef ,
  useState ,
} from 'react';

import { router } from 'next/dist/client';

import { MONTHS ,truncateString } from '@repo/services';

import { ETypeTableHeader ,type Table ,type TColors } from '@repo/ds';

import { useAlert ,useLoading ,useModal } from '@repo/ui';

import type { CreateIncomeParams ,Income } from '@repo/business';
import { useI18n } from '@repo/i18n';

import { incomeService } from '../../../shared';
import { useFinance } from '../../finances';

import { IncomePersist } from '../components';

import { IncomesContext ,type IncomesContextProps } from './IncomesContext';

type TableProps = React.ComponentProps<typeof Table>;

type IncomesProviderProps = {
  children: React.ReactNode;
}

export default function IncomesProvider({ children }: IncomesProviderProps) {
  const isMounted = useRef(false);

  const { t } = useI18n();

  const { openModal ,modal ,closeModal } = useModal();
  const { show ,hide ,isLoading } = useLoading();
  const { addAlert } = useAlert();

  const { fetch ,refresh ,incomeSources } = useFinance();

  const [incomes ,setIncomes] = useState<Array<Income>>([]);

  const fetchItems = useCallback(async () => {
    show();
    try {
      const response = (await incomeService.getAll(
        { withRelations: true },
      )) as Array<Income>;
      setIncomes(response);
      return response;
    } catch (error) {
      addAlert({ type: 'error' ,message: t('error_fetching_incomes') });
      console.error(error);
      throw error;
    } finally {
      hide();
    }
  } ,[addAlert ,hide ,show ,t]);

  const handleSave = useCallback(
    async (params: CreateIncomeParams ,income?: Income) => {
      show();
      try {
        income ?
          await incomeService.update(income.id ,params) :
          await incomeService.create(params);
        addAlert({
          type: 'success' ,
          message: `${ t('expense') } ${ income ?
            t('updated') :
            t('saved') } ${ t('successfully') }!`,
        });
        await fetchItems();
        refresh();
      } catch (error) {
        addAlert({
          type: 'error' ,
          message: (error as Error)?.message ??
            `Error ${ income ? 'updating' : 'saving' } Income`,
        });
        throw error;
      } finally {
        hide();
      }
    } ,[addAlert ,fetchItems ,hide ,refresh ,show ,t],
  );

  const handleOpenPersistModal = useCallback(
    (income?: Income) => {
      console.log('# => income => ' ,income);
      openModal({
        width: '799px' ,
        title: `${ income ? t('edit') : t('create') } ${ t('income') }` ,
        body: (
          <IncomePersist income={ income } incomeSources={ incomeSources }
            onClose={ closeModal }
            onSubmit={ handleSave }/>
        ) ,
        closeOnEsc: true ,
        closeOnOutsideClick: true ,
        removeBackgroundScroll: true ,
      });
    } ,
    [incomeSources ,closeModal ,handleSave ,openModal ,t] ,
  );

  const currentFallback = useMemo(() => {
    if (!incomes || incomes.length === 0) {
      return { message: { text: t('no_found_incomes') } };
    }

    if (incomeSources.length === 0) {
      return {
        button: {
          label: `${ t('create') } ${ t('income_source') }` ,
          onClick: () => router.push('/incomes/sources') ,
        } ,
        message: {
          text: `${ t('no_found_income_sources') }. ${ t(
            'please_create_income_source' ,
          ) } ${ t('before_create_income') }.` ,
        } ,
      };
    }

    return undefined;
  } ,[incomeSources.length ,incomes ,t]);

  const headers = useMemo(() => {
    const monthHeaders: TableProps['headers'] = MONTHS.map((month) => ({
      text: truncateString(t(month) ,3) ,
      type: ETypeTableHeader.MONEY ,
      value: month ,
      conditionColor: {
        value: `${ month }_paid` ,
        trueColor: 'success-80' as TColors ,
        falseColor: 'error-80' as TColors ,
      } ,
    }));
    return [
      { text: t('source') ,value: 'source.name' } ,
      ...monthHeaders ,
      { text: 'Total' ,value: 'total' ,type: ETypeTableHeader.MONEY } ,
    ];
  } ,[t]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetch().then();
      fetchItems().then();
    }
  } ,[]);

  const context: IncomesContextProps = {
    modal ,
    headers ,
    incomes ,
    isLoading ,
    incomeSources ,
    currentFallback ,
    handleOpenPersistModal,
  };
  return (
    <IncomesContext.Provider value={ context }>
      { children }
    </IncomesContext.Provider>
  );
}

