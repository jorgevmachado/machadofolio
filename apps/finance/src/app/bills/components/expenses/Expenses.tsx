'use client'
import { useEffect, useState } from 'react';

import { EMonth, MONTHS, truncateString } from '@repo/services';

import { Bill, Expense, AllExpensesCalculated, Supplier, EExpenseType } from '@repo/business';

import { ETypeTableHeader, Table, type TColors } from '@repo/ds';

import { useAlert, useLoading, useModal } from '@repo/ui';

import { expenseBusiness, expenseService } from '../../../shared';

import Summary from './summary';
import { Persist, PersistForm } from './persist';

import './Expenses.scss';

type ExpensesProps = {
    bill: Bill;
    suppliers: Array<Supplier>;
}

export default function Expenses({ bill, suppliers }: ExpensesProps) {
    const { show, hide, isLoading } = useLoading();
    const { addAlert } = useAlert();
    const [allCalculatedExpenses, setAllCalculatedExpenses] =
        useState<AllExpensesCalculated>({
            total: 0.9,
            allPaid: false,
            totalPaid: 0,
            totalPending: 0,
        });

    const { openModal, modal, closeModal } = useModal();

    const [calculatedExpenses, setCalculatedExpenses] = useState<Array<Expense>>([]);

    const convertToNumber = (value: string) => {
        const rawValue = Number(value)
        if(isNaN(rawValue)) {
            return 0;
        }
        return rawValue;
    }

    const handleSubmit = async (fields: PersistForm['fields'], expense?: Expense) => {
        console.log('Expense => handleSubmit => ', fields)
        console.log('Expense => expense => ', expense)
        const isEdit = Boolean(fields.id);
        show();
        try {
            expense
                ? await expenseService.update(expense.id, expense, bill.id)
                : await expenseService.create({
                    type: fields.type as EExpenseType,
                    paid: fields.paid === 'true',
                    value: convertToNumber(fields.value as string),
                    month: fields.month as EMonth,
                    supplier: fields.supplier as string,
                    description: fields.description as string,
                    instalment_number: convertToNumber(fields.instalment_number as string),
                },
                    bill.id
                )
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? `Error ${isEdit ? 'updating' : 'saving'} Expense` });
            console.error('Expense => handleSubmit => ', error)
        } finally {
            hide();
        }
    }

    const handleOpenFormModal = (expense?: Expense) => {
        openModal({
            width: '799px',
            title: `${expense ? 'Edit' : 'Create'} Expense`,
            body: (
                <Persist
                    onClose={closeModal}
                    expense={expense}
                    onSubmit={handleSubmit}
                    suppliers={suppliers}
                />
            ),
            closeOnEsc: true,
            closeOnOutsideClick: true,
            removeBackgroundScroll: true,
        });
    }

    const generateHeaders = () => {
        const monthHeaders = MONTHS.map((month) => ({
            text: truncateString(month, 3),
            type: ETypeTableHeader.MONEY,
            value: month,
            conditionColor: {
                value: `${month}_paid`,
                trueColor: 'success-80' as TColors,
                falseColor: 'error-80' as TColors,
            },
        }));
        return [
            { text: 'Supplier', value: 'supplier.name' },
            ...monthHeaders,
            { text: 'Total', value: 'total', type: ETypeTableHeader.MONEY },
        ];
    }


    const calculateExpenses = (expenses: Array<Expense>) => {
        return expenses?.map((expense) => expenseBusiness.calculate(expense) );
    }

    const calculateAllExpenses = (expenses: Array<Expense>) => {
        const calculatedAllExpenses =expenseBusiness.calculateAll(expenses);
        setAllCalculatedExpenses(calculatedAllExpenses);
    };

    useEffect(() => {
        const calculatedExpenses = calculateExpenses(bill?.expenses ?? []);
        setCalculatedExpenses((calculatedExpenses as Expense[]) || []);
    }, [bill.expenses]);

    useEffect(() => {
        calculateAllExpenses(calculatedExpenses);
    }, [calculatedExpenses]);

    return (
        <div className="expenses" data-testid="expenses">
            <Summary {...allCalculatedExpenses} action={() => handleOpenFormModal()} />
            <div className="expenses__table">
                <Table
                    headers={generateHeaders()}
                    items={calculatedExpenses}
                    onRowClick={(item) => handleOpenFormModal(item as Expense)}
                />
            </div>
            {modal}
        </div>
    )
}