import type { IFinanceBase } from '../types';
import type { ISupplierType } from './type';

export type ISupplier = IFinanceBase & {
    type: ISupplierType;
    description?: string;
}

export type ICreateSupplierParams = Omit<
        ISupplier,
        'id' | 'type' | 'name_code' | 'created_at' | 'updated_at' | 'deleted_at'
    > & {
    type: string | ISupplier['type'];
}

export type IUpdateSupplierParams = ICreateSupplierParams;