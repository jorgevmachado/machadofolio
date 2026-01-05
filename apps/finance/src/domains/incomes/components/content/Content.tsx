import React  from 'react';

import { Tabs } from '@repo/ds';

import { DependencyFallback ,PageHeader } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { useIncomes } from '../../hooks';

import IncomeSummary from '../summary';
import Tab from '../Tab';

export default function Content() {
  const { t } = useI18n();

  const {
    incomes ,
    modal ,
    isLoading ,
    incomeSources ,
    currentFallback ,
    handleOpenPersistModal,
  } = useIncomes();

  return !isLoading ? (
    <>
      <PageHeader resourceName={ t('income') } action={ {
        label: `${ t('create_new') } ${ t('income') }` ,
        onClick: () => handleOpenPersistModal() ,
        disabled: !incomeSources.length ,
      } }
      />
      { !incomeSources.length || incomes.length === 0 ? (
        <DependencyFallback { ...currentFallback }/>
      ) :
        (<>
          <IncomeSummary incomes={incomes} />
          <Tabs
            items={ incomes.map((item) => ({
              title: item.name ,
              children: <Tab key={ item.id } income={ item }/>,
            })) }/>
        </>) }
      { modal }
    </>
  ) : null;
}