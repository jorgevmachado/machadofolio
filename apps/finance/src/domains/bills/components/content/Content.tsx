import { Tabs } from '@repo/ds';

import { PageHeader } from '@repo/ui';

import { useBills } from '../../hooks';

import Fallback from '../fallback';
import Tab from '../tab';

import AccordionTitle from './accordion-title';

export default function Content() {

  const {
    t ,
    modal ,
    banks ,
    groups ,
    billList ,
    suppliers ,
    isLoading ,
    hasAllDependencies ,
    handleUploadsFileModal ,
    handleOpenPersistModal,
  } = useBills();

  return !isLoading ? (
    <>
      <PageHeader resourceName={ t('bill') } action={ {
        label: `${ t('create_new') } ${ t('bill') }` ,
        onClick: () => handleOpenPersistModal() ,
        disabled: !hasAllDependencies ,
      } }
      actionIcon={ {
        style: { cursor: 'pointer' } ,
        size: '1.5em' ,
        color: 'neutral-80' ,
        icon: 'upload' ,
        onClick: () => handleUploadsFileModal() ,
      } }
      />
      { !hasAllDependencies || billList.length === 0 ? (
        <Fallback
          banks={ banks }
          groups={ groups }
          hasBills={ billList.length > 0 }
          suppliers={ suppliers }
          hasAllDependencies={ hasAllDependencies }
        />
      ) : (
        <>
          <Tabs fluid items={ billList.map((item) => ({
            title: (<AccordionTitle billLIst={ item }/>) ,
            children: <Tab key={ item.title } list={ item.list }/> ,
          })) }/>
        </>
      ) }
      { modal }
    </>
  ) : null;
}