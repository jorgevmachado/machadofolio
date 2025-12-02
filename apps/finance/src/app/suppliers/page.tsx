'use client';
import React ,{ useEffect ,useRef ,useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  type Paginate ,
  type QueryParameters ,
  type Supplier ,
} from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';

import { DependencyFallback ,useAlert ,useLoading } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { PageCrud } from '../../components';
import { useFinance } from '../../hooks';
import { supplierService } from '../../shared';

export default function SuppliersPage() {
  const { t } = useI18n();
  const router = useRouter();
  const isMounted = useRef(false);

  const [currentPage ,setCurrentPage] = useState<number>(1);
  const [results ,setResults] = useState<Array<Supplier>>([]);
  const [totalPages ,setTotalPages] = useState<number>(1);

  const { addAlert } = useAlert();
  const { show ,hide ,isLoading } = useLoading();
  const { fetch ,refresh ,supplierTypes } = useFinance();

  const fetchSuppliers = async ({
    page = currentPage ,
    limit = 10 ,
    ...props
  }: QueryParameters) => {
    show();
    try {
      const response = (await supplierService.getAll(
        { ...props ,page ,limit }
      )) as Paginate<Supplier>;
      setResults(response.results);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      addAlert({ type: 'error' ,message: t('error_fetching_suppliers') });
      console.error(error);
      throw error;
    } finally {
      hide();
    }
  };

  const handleSave = async (supplier?: Supplier) => {
    if (!supplier) {
      return;
    }
    const isEdit = Boolean(supplier?.id);
    show();
    try {
      const body = {
        name: supplier.name ?? '' ,
        type: supplier?.type?.name ?? '',
      };
      isEdit
        ? await supplierService.update(supplier.id ,body)
        : await supplierService.create(body);
      addAlert({
        type: 'success' ,
        message: `${ t('supplier') } ${ isEdit ?
          t('updated') :
          t('saved') } ${ t('successfully') }!`,
      });
      await fetchSuppliers({ page: currentPage });
      refresh();
    } catch (error) {
      addAlert({
        type: 'error' ,
        message: (error as Error)?.message ??
          `${ t('error_when') } ${ isEdit ? t('updating') : t('saving') } ${ t(
            'supplier'
          ) }`,
      });
      console.error(error);
    } finally {
      hide();
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    show();
    try {
      await supplierService.remove(supplier.id);
      addAlert({
        type: 'success' ,
        message: `${ t('supplier') } ${ t('deleted') } ${ t('successfully') }!`,
      });
      await fetchSuppliers({ page: currentPage });
      refresh();
    } catch (error) {
      addAlert({
        type: 'error' ,
        message: (error as Error)?.message ?? t('error_deleting_supplier'),
      });
      console.error(error);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchSuppliers({ page: currentPage }).then();
    }
  } ,[currentPage ,isMounted]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchSuppliers({ page: currentPage }).then();
      fetch().then();
    }
  } ,[]);

  const handleFilter = async (item: Partial<Supplier>) => {
    if (!item) {
      return;
    }

    const result: { filter?: QueryParameters } = { filter: undefined };

    if (item?.name) {
      result.filter = { ...result.filter ,name: item.name };
    }

    if (item?.type) {
      const type = item.type.name_code;
      result.filter = { ...result.filter ,type } as QueryParameters;
    }

    fetchSuppliers({ page: currentPage ,...result.filter }).then();
  };

  return (
    <div>
      { supplierTypes.length === 0 ? (
        <DependencyFallback
          message={ { text: t('no_supplier_type_in_supplier') } }
          button={ {
            label: `${ t('create') } ${ t('supplier_type') }` ,
            onClick: () => router.push('/suppliers/types') ,
          } }
        />
      ) : (
        <PageCrud
          items={ results }
          inputs={ [
            {
              fluid: true ,
              type: 'select' ,
              name: 'type' ,
              label: t('type') ,
              list: supplierTypes ,
              options: supplierTypes.map(
                (type) => ({ value: type.id ,label: type.name })
              ) ,
              required: true ,
              placeholder: `${ t('enter_a') } ${ t('supplier_type') }` ,
              autoComplete: true ,
              fallbackLabel: `${ t('add') } ${ t('supplier_type') }` ,
              fallbackAction: () => router.push('/suppliers/types') ,
            } ,
            {
              fluid: true ,
              type: 'text' ,
              name: 'name' ,
              label: t('supplier') ,
              required: true ,
              placeholder: `${ t('enter_a') } ${ t('supplier') }` ,
            } ,
          ] }
          headers={ [
            {
              text: t('name') ,
              value: 'name' ,
              sortable: true,
            } ,
            {
              text: t('type') ,
              value: 'type.name' ,
              sortable: true ,
            } ,
            {
              text: t('created_at') ,
              value: 'created_at' ,
              type: ETypeTableHeader.DATE ,
              sortable: true ,
            } ,
          ] }
          actions={ {
            text: t('actions') ,
            align: 'center' ,
            edit: async (item) => handleSave(item as Supplier) ,
            create: async (item) => handleSave(item as Supplier) ,
            delete: async (item) => handleDelete(item as Supplier) ,
          } }
          loading={ isLoading }
          onRowClick={ (item) => handleSave(item as Supplier) }
          totalPages={ totalPages }
          currentPage={ currentPage }
          resourceName={ t('supplier') }
          filter={ {
            inputs: [
              {
                fluid: true ,
                type: 'text' ,
                name: 'name' ,
                label: t('supplier') ,
                required: true ,
                placeholder: `${ t('enter_a') } ${ t('supplier') }` ,
              } ,
              {
                fluid: true ,
                type: 'select' ,
                name: 'type' ,
                label: t('type') ,
                list: supplierTypes ,
                options: supplierTypes.map(
                  (type) => ({ value: type.id ,label: type.name })
                ) ,
                required: true ,
                placeholder: `${ t('enter_a') } ${ t('supplier_type') }` ,
                autoComplete: true ,
                fallbackLabel: `${ t('add') } ${ t('supplier_type') }` ,
                fallbackAction: () => router.push('/suppliers/types') ,
              },
            ] ,
            onFilter: (item) => handleFilter(item as Supplier) ,
          } }
          handlePageChange={ setCurrentPage }

        />
      ) }
    </div>
  );
}