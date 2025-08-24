'use client'
import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bank, Paginate, QueryParameters } from '@repo/business';
import { Button, Text } from '@repo/ds';
import { useAlert, useLoading } from '@repo/ui';

import { bankService } from '../shared';

import './banks.scss';


export default function BanksPage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Bank>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const router = useRouter();

    const { addAlert } = useAlert();
    const { show, hide } = useLoading();

    const fetchItems = async ({ page = currentPage, limit = 10,  ...props}: QueryParameters) => {
        show();
        try {
            const response = (await bankService.getAll({...props, page, limit })) as Paginate<Bank>;
            setResults(response.results);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            addAlert({ type: 'error', message: 'Error fetching Banks' });
            console.error(error)
            throw error;
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if(isMounted.current) {
            fetchItems({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchItems({ page: currentPage }).then();
        }
    }, []);

    const handleCreate = () => {
        router.push('/banks/create');
    }

    return (
        <div>
            <div className="banks__header">
                <Text tag="h1" variant="big" className="banks__header--title">
                    Management of Banks
                </Text>
                <Button  className="page-header__button" onClick={handleCreate} context="success">
                    Create new Bank
                </Button>
            </div>
        </div>
    )
}
