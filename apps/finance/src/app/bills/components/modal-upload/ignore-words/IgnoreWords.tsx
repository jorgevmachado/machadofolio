import React, { useEffect, useState } from 'react';

import { Accordion, Button, Input, Table, Text } from '@repo/ds';

import './IgnoreWords.scss';

type IgnoreWordsProps = {
    withDefault?: boolean;
    repeatedWords: Array<string>;
    updateRepeatedWords: (repeatedWords: Array<string>) => void;
};

const DEFAULT_REPEATED_WORDS: Array<string> = [
  'Netflix.Com',
  'Dm *Helpmaxcom',
  'Mp *Melimais',
  'Ifd*Ifood Club',
  'Google One',
  'Pagamento recebido',
  'Estorno de *'
];

export default function IgnoredWords({ withDefault = true, repeatedWords, updateRepeatedWords }: IgnoreWordsProps) {
  const [list, setList] = useState<Array<string>>(repeatedWords);
  const [repeatedWord, setRepeatedWord] = useState<string | undefined>(undefined);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const handleOnInputRepeatedWord = (value: string | Array<string>) => {
    const currentValue = Array.isArray(value) ? value[0] : value;
    setRepeatedWord(currentValue);
    if (!currentValue || currentValue === '') {
      setButtonDisabled(true);
      return;
    }
    setButtonDisabled(false);
  };

  const handleInsertRepeatedWord = () => {
    const currentRepeatedWords = [...list];
    if (repeatedWord && repeatedWord !== '') {
      currentRepeatedWords.push(repeatedWord);
      setRepeatedWord(undefined);
      setButtonDisabled(true);
      updateRepeatedWords(currentRepeatedWords);
      setList(currentRepeatedWords);
    }
  };

  const handleDeleteRepeatedWord = (name: string) => {
    const newRepeatedWords = list.filter((repeatedWord) => repeatedWord !== name);
    setList(newRepeatedWords);
    updateRepeatedWords(newRepeatedWords);
  };

  if (!list.length && !withDefault) {
    return null;
  }
  useEffect(() => {
    if (withDefault && list.length === 0) {
      setList(DEFAULT_REPEATED_WORDS);
      updateRepeatedWords(DEFAULT_REPEATED_WORDS);
    }
  }, []);

  return (
    <Accordion title="Titulos a Ignorar" className="ignore-words">
      <Text id="text_repeated_words_upload" className="ignore-words__text">
        <span>Lista de Títulos para Ignorar</span>
        <span>
                    Adicione títulos que devem ser excluídos durante a importação.
                    Qualquer transação da planilha que contenha um título desta lista será automaticamente ignorada.
        </span>
        <span>
                    Exemplo: Adicione "Netflix.com" para ignorar todas as transações com esse título.
        </span>
      </Text>
      <div className="ignore-words__input">
        <Input
          id="repeated_words_upload"
          name="replaceWords"
          type="text"
          fluid
          value={repeatedWord}
          onInput={({ value }) => handleOnInputRepeatedWord(value)}
          placeholder="Insira um titulo para ignorar"
        >
          <Button icon={{ icon: 'plus' }} context="primary" data-children="append" disabled={buttonDisabled}
            onClick={handleInsertRepeatedWord}/>
        </Input>
      </div>

      <div>

        <Table
          items={list.map((item) => ({ name: item }))}
          actions={{
            text: 'Ação',
            align: 'center',
            delete: {
              icon: { icon: 'trash' },
              onClick: (item: { name: string }) => handleDeleteRepeatedWord(item.name)
            }
          }}
          headers={[{
            text: 'Título',
            value: 'name',
          }]}
        />
      </div>
    </Accordion>
  );
}