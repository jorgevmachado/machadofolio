import type Bill from '../bill';

type TList = 'type' | 'group' | 'bank';

export type BillList = {
    title: string;
    list: Array<Bill>;
    type: TList;
}