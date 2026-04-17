export const ETypeTableHeader ={
    STRING: 'string' ,
    NUMBER: 'number' ,
    DATE: 'date' ,
    MONEY: 'money'
} as const;

export type ETypeTableHeader = typeof ETypeTableHeader[keyof typeof ETypeTableHeader];