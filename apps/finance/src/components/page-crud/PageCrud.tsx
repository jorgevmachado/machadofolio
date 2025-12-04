'use client';
import React ,{ useMemo ,useState } from 'react';

import { Pagination ,Table } from '@repo/ds';

import { PageDelete, PageFilter, PageHeader, useModal } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import ModalPersist from './modal-persist';

import './PageCrud.scss';

type TableProps = React.ComponentProps<typeof Table>;

type ModalPersistProps = React.ComponentProps<typeof ModalPersist>;
type FilterProps = React.ComponentProps<typeof PageFilter>;

type Actions = {
  text: string;
  align: 'center' | 'left' | 'right';
  edit?: (item: unknown) => Promise<void>;
  create?: (item: unknown) => Promise<void>;
  delete?: (item: unknown) => Promise<void>;
}

type PageCrudProps =
  Pick<TableProps ,'items' | 'headers' | 'loading' | 'onRowClick'>
  & {
  range?: number;
  filter?: FilterProps;
  inputs?: ModalPersistProps['inputs'];
  actions?: Actions;
  totalPages?: number;
  currentPage?: number;
  resourceName: string;
  handlePageChange?: (page: number) => void;
};

export default function PageCrud({
  range = 10 ,
  filter ,
  items ,
  inputs ,
  actions ,
  headers ,
  loading ,
  totalPages = 0 ,
  onRowClick ,
  currentPage ,
  resourceName ,
  handlePageChange,
}: PageCrudProps) {
  const { t } = useI18n();
  const { openModal ,modal ,closeModal } = useModal();
  const [sortedColumn ,setSortedColumn] = useState<TableProps['sortedColumn']>({
    sort: '' ,
    order: '' ,
  });

  const hasId = (obj: unknown): obj is { id: string | number } =>
    !!obj && typeof obj === 'object' && 'id' in obj;

  const handlePersistModal = (item?: unknown) => {
    if (item && !actions?.edit) {
      return;
    }
    if (!item && !actions?.create) {
      return;
    }
    if (!inputs) {
      return;
    }
    openModal({
      title: `${ hasId(item) ? t('edit') : t('create') } ${ resourceName }` ,
      body: (
        <ModalPersist
          item={ item }
          inputs={ inputs }
          onClose={ closeModal }
          onSubmit={ actions?.edit ?? actions?.create }
        />
      ),

    });
  };

  const handleDeleteModal = (item: unknown) => {
    if (!actions?.delete) {
      return;
    }
    openModal({
      title: `${ t('want_to_delete') } ${ resourceName }` ,
      width: '700px' ,
      body: (
        <PageDelete
          item={ item }
          onClose={ closeModal }
          onDelete={ actions?.delete }/>
      ),
    });
  };
  
  const currentFilter = useMemo(() => {
    if (!filter?.inputs?.length) {
      return filter;
    }
    
    const customFilter: FilterProps = { ...filter };
    
    
    if (!filter?.action) {
      return {
        ...customFilter,
        action: {
          ...customFilter?.action,
          label: t('filter')
        }
      };
    }
    
    return customFilter;
    
    
  }, [filter, t]);

  return (
    <div className="page-crud">
      <PageHeader
        resourceName={ `${t('management_of')} ${ resourceName }` }
        action={ actions?.create && inputs?.length ? {
          label: `${ t('create_new') } ${ resourceName }` ,
          onClick: () => handlePersistModal(),
        } : undefined }
      />
      { currentFilter && (
        <PageFilter { ...currentFilter } />
      ) }
      <Table
        items={ items }
        actions={ actions && {
          text: actions.text ,
          align: actions.align ,
          edit: actions?.edit && inputs?.length ?
            {
              children: t('edit') ,
              onClick: (item: unknown) => handlePersistModal(item),
            } :
            undefined ,
          delete: actions?.delete ?
            {
              children: t('delete') ,
              onClick: (item: unknown) => handleDeleteModal(item),
            } :
            undefined,
        } }
        headers={ headers }
        loading={ loading }
        onRowClick={ onRowClick ?
          (item) => handlePersistModal(item) :
          undefined }
        sortedColumn={ sortedColumn }
        onSortedColumn={ setSortedColumn }
      />
      { modal }
      { currentPage && totalPages > 1 && (
        <Pagination
          fluid
          type="numbers"
          total={ totalPages }
          range={ range }
          current={ currentPage }
          disabled
          handleNew={ handlePageChange }
        />
      ) }
    </div>
  );
}