'use client';
import React ,{ useEffect ,useRef ,useState } from 'react';

import { ETypeTableHeader } from '@repo/ds';

import { useAlert ,useLoading } from '@repo/ui';

import type {
  IncomeSource ,
  Paginate ,
  QueryParameters ,
  SupplierType,
} from '@repo/business';
import { useI18n } from '@repo/i18n';

import { PageCrud } from '../../../components';
import { useFinance } from '../../../domains';
import { incomeSourceService } from '../../../shared';

export default function IncomesSourcesPage() {
  const { t } = useI18n();
  const isMounted = useRef(false);

  const [currentPage ,setCurrentPage] = useState<number>(1);
  const [results ,setResults] = useState<Array<IncomeSource>>([]);
  const [totalPages ,setTotalPages] = useState<number>(1);

  const { addAlert } = useAlert();
  const { show ,hide ,isLoading } = useLoading();
  const { refresh } = useFinance();

  const fetchIncomeSources = async ({
    page = currentPage ,
    limit = 10 ,
    ...props
  }: QueryParameters) => {
    show();
    try {
      const response = (await incomeSourceService.getAll(
        { ...props ,page ,limit }
      )) as Paginate<IncomeSource>;
      setResults(response.results);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      addAlert({ type: 'error' ,message: t('error_fetching_income_sources') });
      throw error;
    } finally {
      hide();
    }
  };

  const handleSave = async (incomeSource?: IncomeSource) => {
    if (!incomeSource) {
      return;
    }
    const isEdit = Boolean(incomeSource?.id);
    show();
    try {
      const body = { name: incomeSource.name ?? '' };
      isEdit
        ? await incomeSourceService.update(incomeSource.id ,body)
        : await incomeSourceService.create(body);
      addAlert({
        type: 'success' ,
        message: `${ t('income_source') } ${ isEdit ?
          t('updated') :
          t('saved') } ${ t('successfully') }!`,
      });
      await fetchIncomeSources({ page: currentPage });
      refresh();
    } catch (error) {
      addAlert({
        type: 'error' ,
        message: (error as Error)?.message ??
          `${ t('error_when') } ${ isEdit ? t('updating') : t('saving') } ${ t(
            'income_source'
          ) }`,
      });
      throw error;
    } finally {
      hide();
    }
  };

  const handleDelete = async (incomeSource: IncomeSource) => {
    if (!incomeSource) {
      return;
    }
    show();
    try {
      await incomeSourceService.remove(incomeSource.id);
      addAlert({ type: 'success', message: `${t('income_source')} ${t('deleted')} ${t('successfully')}!` });

      await fetchIncomeSources({ page: currentPage });
      refresh();
    } catch (error) {
      addAlert({ type: 'error', message: (error as Error)?.message ?? t('error_deleting_income_source') });
      throw error;
    } finally {
      hide();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchIncomeSources({ page: currentPage }).then();
    }
  }, [currentPage, isMounted]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchIncomeSources({ page: currentPage }).then();
    }
  }, []);
  return (
    <PageCrud
      items={results}
      inputs={[
        {
          fluid: true,
          type: 'text',
          name: 'name',
          label: t('income_source'),
          required: true,
          placeholder: 'Enter a income Source'
        },
      ]}
      headers={[
        {
          text: t('name'),
          value: 'name',
          sortable: true
        },
        {
          text: t('created_at'),
          value: 'created_at',
          type: ETypeTableHeader.DATE,
          sortable: true,
        },
      ]}
      actions={{
        text: t('actions'),
        align: 'center',
        edit: async (item) => handleSave(item as SupplierType),
        create: async (item) => handleSave(item as SupplierType),
        delete: async (item) => handleDelete(item as SupplierType),
      }}
      loading={isLoading}
      onRowClick={(item) => handleSave(item as SupplierType)}
      totalPages={totalPages}
      currentPage={currentPage}
      resourceName={t('income_source')}
      handlePageChange={setCurrentPage}

    />
  );
}