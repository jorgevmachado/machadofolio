'use client'
import React, { useEffect, useState } from 'react';

import { MONTHS, truncateString } from '@repo/services';

import { Bill, EBillType, Expense, Supplier } from '@repo/business';

import { ETypeTableHeader, Table, type TColors } from '@repo/ds';

import { useAlert, useLoading, useModal } from '@repo/ui';

import { billService, expenseBusiness, expenseService } from '../../../shared';

import Summary from './summary';
import { type OnSubmitParams, Persist } from './persist';
import CreditCard from './credit-card';

import './Expenses.scss';


type ExpensesProps = {
    bill: Bill;
    suppliers: Array<Supplier>;
}

type OpenFormModalParams = {
    parent?: Expense;
    parents?: Array<Expense>;
    expense?: Expense;
}

export default function Expenses({ bill: billData, suppliers }: ExpensesProps) {
    const { show, hide, isLoading } = useLoading();
    const { addAlert } = useAlert();

    const [bill, setBill] = useState<Bill | undefined>(billData);

    const { openModal, modal, closeModal } = useModal();

    const [calculatedExpenses, setCalculatedExpenses] = useState<Array<Expense>>([]);

    const handleSubmit = async ({ create, update, expense }: OnSubmitParams) => {
        show();
        try {
            expense
                ? await expenseService.update(expense.id, update, bill?.id)
                : await expenseService.create(create, bill?.id)
            addAlert({ type: 'success', message: `Expense ${expense ? 'updated' : 'saved'} successfully!` });
            await fetchBill(bill?.id ?? '');
        } catch (error) {
            addAlert({
                type: 'error',
                message: (error as Error)?.message ?? `Error ${expense ? 'updating' : 'saving'} Expense`
            });
            console.error('Expense => handleSubmit => ', error)
        } finally {
            hide();
        }
    }

    const handleOpenFormModal = ({ expense, parent, parents }: OpenFormModalParams) => {
        openModal({
            width: '799px',
            title: `${expense ? 'Edit' : 'Create'} Expense`,
            body: (
                <Persist
                    onClose={closeModal}
                    expense={expense}
                    onSubmit={handleSubmit}
                    suppliers={suppliers}
                    parent={parent}
                    parents={parents}
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
        return expenses?.map((expense) => expenseBusiness.calculate(expense));
    }

    const fetchBill = async (id: string) => {
        show();
        try {
            const response = await billService.get(id);
            setBill(response);
        } catch (error) {
            addAlert({ type: 'error', message: 'Error fetching Bill' });
            console.error(error)
            throw error;
        } finally {
            hide();
        }
    }
    useEffect(() => {
        const calculatedExpenses = calculateExpenses(bill?.expenses ?? []);
        setCalculatedExpenses((calculatedExpenses as Expense[]) || []);
    }, [bill?.expenses]);

    return (
        <div className="expenses" data-testid="expenses">
            {bill?.type === EBillType.CREDIT_CARD
                ? (
                    <CreditCard
                        items={calculatedExpenses}
                        action={(expense, parent, parents) => handleOpenFormModal({ expense, parent, parents })}
                        loading={isLoading}
                    />
                )
                : (
                    <>
                        <Summary expenses={calculatedExpenses} action={() => handleOpenFormModal({})}/>
                        <div className="expenses__table">
                            <Table
                                headers={generateHeaders()}
                                items={calculatedExpenses}
                                onRowClick={(item) => handleOpenFormModal({ expense: item as Expense })}
                                loading={isLoading}
                            />
                        </div>
                    </>
                )
            }
            {modal}
        </div>
    )
}