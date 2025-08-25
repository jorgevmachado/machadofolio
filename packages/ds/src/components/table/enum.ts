export const ETypeTableHeaderItem ={
    STRING: 'string' ,
    NUMBER: 'number' ,
    DATE: 'date' ,
    MONEY: 'money'
} as const;

export type ETypeTableHeaderItem = typeof ETypeTableHeaderItem[keyof typeof ETypeTableHeaderItem];