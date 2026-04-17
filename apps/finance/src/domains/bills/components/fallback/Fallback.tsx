'use client';
import React ,{ useCallback ,useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { DependencyFallback } from '@repo/ui';

import { type Bank ,type Group ,type Supplier } from '@repo/business/index';
import { useI18n } from '@repo/i18n';

type FallbackProps = {
  banks: Array<Bank>;
  groups: Array<Group>;
  hasBills: boolean;
  suppliers: Array<Supplier>
  hasAllDependencies: boolean;
}

export default function Fallback({
  banks,
  groups,
  hasBills ,
  suppliers,
  hasAllDependencies ,
}: FallbackProps) {
  const router = useRouter();

  const { t } = useI18n();

  const generateDependencyContent = useCallback(
    (plural: string ,singular: string) => ({
      button: {
        label: `${ t('create') } ${ singular }` ,
        onClick: () => router.push(`/${ plural }`) ,
      } ,
      message: {
        text: `${ t(`no_found_${ plural }`) }. ${ t(
          `please_create_${ singular }` ,
        ) } ${ t('before_create_bill') }.` ,
      } ,
    }) ,[router ,t] ,
  );

  const generateContent = useCallback(
    (hasBills: boolean ,hasAllDependencies: boolean) => {
      if (!hasBills && hasAllDependencies) {
        return { message: { text: t('no_found_bills') } };
      }

      if (groups.length === 0) {
        return generateDependencyContent('groups' ,'group');
      }

      if (banks.length === 0) {
        return generateDependencyContent('banks' ,'bank');
      }

      if (suppliers.length === 0) {
        return generateDependencyContent('suppliers' ,'supplier');
      }

      return undefined;
    } ,[
      banks.length ,
      generateDependencyContent ,
      groups.length ,
      suppliers.length ,
      t] ,
  );

  const currentFallback = useMemo(() => {
    return generateContent(hasBills ,hasAllDependencies);
  } ,[generateContent ,hasAllDependencies ,hasBills]);

  return currentFallback ? <DependencyFallback { ...currentFallback } /> : null;
}