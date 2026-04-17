import React, { useEffect, useState } from 'react';

import { type ReplaceWordParam } from '@repo/services';

import { Accordion, Button, Input, Table, Text } from '@repo/ds';

import './ReplaceWords.scss';

type ReplaceWordsProps = {
  empty?: boolean;
  withDefault?: boolean;
  replaceWords: Array<ReplaceWordParam>;
  updateReplaceWords: (replaceWords: Array<ReplaceWordParam>) => void;
}

const DEFAULT_REPLACE_WORDS: Array<ReplaceWordParam> = [
  {
    after: 'Pão de Açúcar',
    before: 'Pao de Acucar'
  }
];

export default function ReplaceWords({ empty = false, withDefault = true, replaceWords, updateReplaceWords }: ReplaceWordsProps) {
  const [list, setList] = useState<Array<ReplaceWordParam>>(replaceWords);
  const [replaceWord, setReplaceWord] = useState<Partial<ReplaceWordParam>>({
    after: undefined,
    before: undefined
  });

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);


  const handleDeleteReplaceWord = (word: ReplaceWordParam) => {
    const newReplaceWords = list.filter((item) => item.after !== word.after && item.before !== word.before);
    setList(newReplaceWords);
    updateReplaceWords(newReplaceWords);
  };

  const handleOnInputReplaceWord = (value: string | Array<string>, name: string) => {
    const currentValue = Array.isArray(value) ? value[0] : value;
    setReplaceWord((prev) => ({ ...prev, [name]: currentValue }));
  };


  useEffect(() => {
    if (replaceWord && replaceWord.after && replaceWord.before) {
      setButtonDisabled(false);
      return;
    }
    setButtonDisabled(true);
  }, [replaceWord]);

  useEffect(() => {
    if (withDefault && list.length === 0 && !empty) {
      setList(DEFAULT_REPLACE_WORDS);
      updateReplaceWords(DEFAULT_REPLACE_WORDS);
    }
  }, []);

  const handleInsertReplacedWord = () => {
    const currentReplaceWords = [...list];
    if (replaceWord && replaceWord.after && replaceWord.before) {
      currentReplaceWords.push(replaceWord as ReplaceWordParam);
      setReplaceWord({
        after: undefined,
        before: undefined
      });
      setButtonDisabled(true);
      updateReplaceWords(currentReplaceWords);
      setList(currentReplaceWords);
    }
  };

  return (
    <Accordion title="Titulos a Substituir" className="replace-words">
      <Text id="text_replace_words_upload" className="replace-words__text">
        <span>Lista de Títulos para Substituir</span>

        <span>Permite corrigir ou padronizar títulos de transações durante a importação da planilha.</span>

        <span>
                    Como funciona:
                    Toda transação que contiver o texto especificado no campo "Antes" terá esse trecho substituído pelo texto do campo "Depois".
        </span>

        <span>
                    Exemplo:
                - Antes: "Pao de Acucar"
                - Depois: "Pão de Açúcar"
        </span>

        <span>
                    Resultado: Todas as transações contendo "Pao de Acucar" serão automaticamente alteradas
                    para "Pão de Açúcar".
        </span>

        <span>
                    Útil para corrigir acentuação, padronizar nomes de fornecedores ou simplificar descrições.
        </span>

      </Text>
      <div className="replace-words__input">
        <Input
          id="replace_words_before"
          name="before"
          type="text"
          value={replaceWord?.before}
          onInput={({ value, name }) => handleOnInputReplaceWord(value, name)}
          placeholder="Insira um titulo da forma que está na planilha"
        />
        <Input
          id="replace_words_after"
          name="after"
          type="text"
          value={replaceWord?.after}
          onInput={({ value, name }) => handleOnInputReplaceWord(value, name)}
          placeholder="Insira um titulo de como ele deverá estar ao salvar"
        />
        <Button disabled={buttonDisabled} context="primary" onClick={handleInsertReplacedWord}>
          Adicionar
        </Button>
      </div>
      <Table
        items={list}
        actions={{
          text: 'Actions',
          align: 'center',
          delete: {
            icon: { icon: 'trash' },
            onClick: (item: ReplaceWordParam) => handleDeleteReplaceWord(item)
          }
        }}
        headers={[{
          text: 'Antes',
          value: 'before',
        }, {
          text: 'Depois',
          value: 'after',
        }]}
      />
    </Accordion>
  );
}