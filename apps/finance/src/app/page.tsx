'use client';
import { useState } from 'react';

import { Button } from '@repo/ds';

import { normalize } from "@repo/services/index";

import styles from "./page.module.css";

import './page.scss';

export default function Home() {
  const name = 'João';
  const [isLoading, setIsLoading] = useState(false);


  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI3MGQ2ZmVjLTk3MzgtNDc1Ni1iMTk1LTdlYmUwODkyZGJlYyIsImlhdCI6MTc1MTM5Mzc3MiwiZXhwIjoxNzUxNDgwMTcyfQ.mZCiWn7bOicqtnvqOywY5qLnnIW7s9rjzu8ObKK01ek';
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch('http://localhost:3001/finance/generate-document', { method: 'GET', headers });

      if (!response.ok) {
        throw new Error('Falha ao baixar o arquivo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(
          new Blob([blob], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
      );

      const a = document.createElement('a');
      a.href = url;
      a.download = 'controle_financeiro.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);


    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Ocorreu um erro ao baixar o arquivo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="page">
      <main className="page__main">
        <h1>name: {name}</h1>
        <h1>normalize: {normalize(name)}</h1>
        <Button onClick={handleDownload} context="secondary" disabled={isLoading} className={styles.downloadButton}>
          {isLoading ? 'Baixando...' : 'Baixar Modelo de Planilha'}
        </Button>
        {/*<button*/}
        {/*    onClick={handleDownload}*/}
        {/*    disabled={isLoading}*/}
        {/*    className={styles.downloadButton}*/}
        {/*>*/}
        {/*  {isLoading ? 'Baixando...' : 'Baixar Modelo de Planilha'}*/}
        {/*</button>*/}

      </main>
    </div>
  );
}
