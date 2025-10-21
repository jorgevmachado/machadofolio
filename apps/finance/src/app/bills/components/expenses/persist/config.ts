import { MONTHS, capitalize } from '@repo/services';

import { EExpenseType } from '@repo/business';

import { InputGroup, InputGroupItem, PersistForm } from './types';


export const GROUPS: Array<InputGroup> = [
    {
      id: 'group_0',
      inputs: [
          {
              id: 'paid',
              show: true,
              type: 'text' as InputGroupItem['type'],
              name: 'paid',
              label: 'Paid',
              fluid: true,
              isCreate: false,
              needType: false,
          }
      ],
      className: 'persist__paid',
    },
    {
        id: 'group_1',
        inputs: [
            {
                id: 'select_parent',
                show: true,
                type: 'select',
                fluid: true,
                name: 'parent',
                label: 'Parent',
                options: [],
                validator: ({ value }) => {
                    if(!value) {
                        return {
                            valid: false,
                            message: 'Parent is required'
                        }
                    }
                    return {
                        valid: true,
                        message: ''
                    }
                },
                needType: false,
                required: true,
                className: 'persist__parent--row',
                placeholder: 'Choose a Parent',
            },
        ],
        className: 'persist__parent',
    },
    {
      id: 'group_2',
      inputs: [
          {
              id: 'select_type',
              show: true,
              type: 'select',
              fluid: true,
              name: 'type',
              label: 'Type',
              options: Object.values(EExpenseType).map((item) => ({
                  value: item,
                  label: item,
              })),
              validator: ({ value }) => {
                  if(!value) {
                      return {
                          valid: false,
                          message: 'Type is required'
                      }
                  }
                  return {
                      valid: true,
                      message: ''
                  }
              },
              needType: false,
              required: true,
              placeholder: 'Choose a Type',
          },
          {
              id: 'select_supplier',
              show: true,
              type: 'select',
              fluid: true,
              name: 'supplier',
              label: 'Supplier',
              options: [],
              validator: ({ value }) => {
                  if(!value) {
                      return {
                          valid: false,
                          message: 'Supplier is required'
                      }
                  }
                  return {
                      valid: true,
                      message: ''
                  }
              },
              needType: false,
              required: true,
              placeholder: 'Choose a Supplier',
              autoComplete: true,
              fallbackLabel: 'Add Supplier',
          },
      ]
    },
    {
        id: 'group_3',
        inputs: [
            {
                id: 'select_month',
                show: false,
                type: 'select',
                fluid: true,
                name: 'month',
                label: 'Month',
                options: MONTHS.map((item) => ({
                    value: item.toUpperCase(),
                    label: item,
                })),
                validator: ({ value }) => {
                    if(!value) {
                        return {
                            valid: false,
                            message: 'Month is required'
                        }
                    }
                    return {
                        valid: true,
                        message: ''
                    }
                },
                needType: true,
                isCreate: true,
                required: true,
                placeholder: 'Choose a Month',
            },
            {
                id: 'select_installment_number',
                type: "select",
                name: "instalment_number",
                label: "Instalment Number",
                fluid: true,
                show: false,
                needType: true,
                isVariable: true,
                options: MONTHS.map((_, index) => ({
                    value: (index + 1).toString(),
                    label: (index + 1).toString(),
                })),
                required: true,
                validator: ({ value }) => {
                    if(!value) {
                        return {
                            valid: false,
                            message: 'Installment Number is required'
                        }
                    }
                    return {
                        valid: true,
                        message: ''
                    }
                },
                placeholder: 'Choose a Installment Number'
            },
        ]
    },
    {
        id: 'group_4',
        inputs: [
            {
                id: 'value',
                show: false,
                type: 'money',
                name: 'value',
                label: 'Value',
                fluid: true,
                isCreate: true,
                needType: true,
                required: true,
                placeholder: 'Enter a Value',
            },
        ]
    },
    ...MONTHS.map((month, index) => ({
        id: `group_${index + 5}`,
        inputs: [
            {
                id: month,
                show: false,
                type: 'money' as InputGroupItem['type'],
                name: month,
                label: capitalize(month),
                fluid: true,
                isCreate: false,
                needType: true,
                placeholder: `Enter a ${month} value`,
            },
            {
                id: `${month}_paid`,
                show: false,
                type: 'text' as InputGroupItem['type'],
                name: `${month}_paid`,
                label: 'Paid',
                fluid: true,
                isCreate: false,
                needType: true,
            }
        ]
    })),
    {
        id: 'group_17',
        inputs: [
            {
                id: 'description',
                type: 'textarea',
                name: 'description',
                label: 'Description',
                fluid: true,
                show: true,
                needType: true,
                required: false,
                placeholder: 'Enter a Value',
            },
        ]
    },
]

export const DEFAULT_PERSIST_FORM: PersistForm = {
    valid: true,
    fields: {
        id: undefined,
        paid: undefined,
        type: undefined,
        value: undefined,
        month: undefined,
        supplier: undefined,
        january: undefined,
        january_paid: undefined,
        february: undefined,
        february_paid: undefined,
        march: undefined,
        march_paid: undefined,
        april: undefined,
        april_paid: undefined,
        may: undefined,
        may_paid: undefined,
        june: undefined,
        june_paid: undefined,
        july: undefined,
        july_paid: undefined,
        august: undefined,
        august_paid: undefined,
        september: undefined,
        september_paid: undefined,
        october: undefined,
        october_paid: undefined,
        november: undefined,
        november_paid: undefined,
        december: undefined,
        december_paid: undefined,
        instalment_number: undefined,
        description: undefined,
        parent: undefined,
    },
    errors: {
        id: undefined,
        paid: undefined,
        type: undefined,
        value: undefined,
        month: undefined,
        supplier: undefined,
        january: undefined,
        january_paid: undefined,
        february: undefined,
        february_paid: undefined,
        march: undefined,
        march_paid: undefined,
        april: undefined,
        april_paid: undefined,
        may: undefined,
        may_paid: undefined,
        june: undefined,
        june_paid: undefined,
        july: undefined,
        july_paid: undefined,
        august: undefined,
        august_paid: undefined,
        september: undefined,
        september_paid: undefined,
        october: undefined,
        october_paid: undefined,
        november: undefined,
        november_paid: undefined,
        december: undefined,
        december_paid: undefined,
        instalment_number: undefined,
        description: undefined,
        parent: undefined,
    },
    message: undefined,
}


export const getInputGroup = (isCreate: boolean, type?: EExpenseType, hasParents: boolean = false): Array<InputGroup> => {
    const isVariable = type === EExpenseType.VARIABLE;
    const hasType = Boolean(type);
    const groups: Array<InputGroup> = [];
    GROUPS.forEach((group) => {
        const data = {
            ...group,
            inputs: group.inputs.map((inputGroupItem) => {
                const { needType, isCreate: inputIsCreate, isVariable: inputIsVariable, ...input } = inputGroupItem
                if(!hasParents && input.name === 'parent') {
                    return;
                }
                if(input.show && !needType) {
                    return input;
                }
                if(input.show && needType === hasType) {
                    return input;
                }
                if(needType === hasType && inputIsVariable === isVariable && inputIsCreate === isCreate) {
                    return {
                        ...input,
                        show: true
                    }
                }
                if(needType === hasType && inputIsCreate === isCreate && inputIsVariable === undefined) {
                    return {
                        ...input,
                        show: true
                    }
                }

                if(needType === hasType && inputIsCreate === undefined && inputIsVariable === isVariable) {
                    return {
                        ...input,
                        show: true
                    }
                }
                return;
            }).filter((input) => input)
        }

        if(data.inputs.length > 0) {
            groups.push(data as unknown as InputGroup);
        }
    })
    return groups;
}