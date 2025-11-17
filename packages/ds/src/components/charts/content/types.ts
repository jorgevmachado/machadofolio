type TByFilterContent = 'label' | 'value' | 'condition';

type TFilterCondition = '===' | '!==' | '>' |  '<' | '>=' | '<=' | 'empty';

export type FilterContentItem = {
    by?: TByFilterContent;
    label: string;
    value?: string | number;
    condition: TFilterCondition;
}

export type FilterContent = Array<FilterContentItem>;

export type CompareFilterParams = Omit<FilterContentItem, 'by'> & {
    by: TByFilterContent;
    param?: string | number;
}