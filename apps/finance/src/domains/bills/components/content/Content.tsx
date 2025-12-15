import { Tabs } from '@repo/ds';

import { PageHeader } from '@repo/ui';

import { useBills } from '../../hooks';

import Fallback from '../fallback';
import Tab from '../tab';

export default function Content() {

  const {
    t,
    modal,
    banks,
    groups,
    billList,
    suppliers,
    isLoading,
    hasAllDependencies,
    handleOpenPersistModal
  } = useBills();

  return !isLoading ? (
    <>
      <PageHeader resourceName={t('bill')} action={{
        label: `${t('create_new')} ${t('bill')}`,
        onClick: () => handleOpenPersistModal(),
        disabled: !hasAllDependencies,
      }}/>
      {!hasAllDependencies || billList.length === 0 ? (
        <Fallback
          banks={banks}
          groups={groups}
          hasBills={billList.length > 0}
          suppliers={suppliers}
          hasAllDependencies={hasAllDependencies}
        />
      ) : (
        <>
          <Tabs fluid items={billList.map((item) => ({
            title: item.title,
            children: <Tab key={item.title} list={item.list}/>,
          }))}/>
        </>
      )}
      {modal}
    </>
  ): null;
}