import React from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import PagePersist from './PagePersist';

const meta: Meta<typeof PagePersist> = {
  tags: ['autodocs'] ,
  args: {
    inputs: [
      {
        fluid: true ,
        type: 'text' ,
        name: 'name' ,
        label: 'name' ,
        required: true ,
        placeholder: `Enter a name` ,
      } ,
      {
        fluid: true ,
        type: 'select' ,
        name: 'type' ,
        label: 'select' ,
        list: [
          { id: 'br' ,name_code: 'br' ,name: 'Brasil' } ,
          { id: 'ar' ,name_code: 'ar' ,name: 'Argentina' } ,
          { id: 'cl' ,name_code: 'cl' ,name: 'Chile' } ,
          { id: 'co' ,name_code: 'co' ,name: 'Colômbia' } ,
          { id: 'us' ,name_code: 'us' ,name: 'Estados Unidos' } ,
          { id: 'fr' ,name_code: 'fr' ,name: 'França' } ,
          { id: 'de' ,name_code: 'de' ,name: 'Alemanha' } ,
          { id: 'jp' ,name_code: 'jp' ,name: 'Japão' } ,
        ] ,
        options: [
          { value: 'br' ,label: 'Brasil' } ,
          { value: 'ar' ,label: 'Argentina' } ,
          { value: 'cl' ,label: 'Chile' } ,
          { value: 'co' ,label: 'Colômbia' } ,
          { value: 'us' ,label: 'Estados Unidos' } ,
          { value: 'fr' ,label: 'França' } ,
          { value: 'de' ,label: 'Alemanha' } ,
          { value: 'jp' ,label: 'Japão' } ,
        ] ,
        required: true ,
        placeholder: `Enter a Select` ,
        autoComplete: true ,
        fallbackLabel: `Add Select` ,
        fallbackAction: fn(),
      } ,
      {
        fluid: true ,
        type: 'radio-group',
        name: 'radio-group' ,
        label: 'Radio Group',
        value: 'natural-person',
        list: [
          { id: '1' ,name_code: 'person' ,name: 'Natural Person' } ,
          { id: '2' ,name_code: 'legal-entity' ,name: 'Legal Entity' } ,
        ] ,
        options: [
          { label: 'Natural Person', value: 'natural-person' },
          { label: 'Legal Entity', value: 'legal-entity' },
        ],
        required: true ,
      } ,
    ] ,
    onClose: fn(),
  } ,
  title: 'Components/Page/Persist' ,
  argTypes: {} ,
  component: PagePersist ,
  decorators: [
    (Story) => (
      <div style={ {
        display: 'flex' ,
        alignItems: 'center' ,
        justifyContent: 'center' ,
        height: '50vh' ,
        width: '100%',
      } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: {} ,
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof PagePersist>) => {
  const [persistedItem ,setPersistedItem] = React.useState<unknown>(undefined);
  const [cancelItem ,setCancelItem] = React.useState<'submitted' | 'canceled' | undefined>(
    undefined);

  const handleSubmit = async (item: unknown) => {
    setPersistedItem(item);
  };

  const handleOnClose = (item?: 'submitted' | 'canceled') => {
    if (item === 'canceled') {
      setCancelItem(undefined);
    }
    setCancelItem(item);
  };

  return (
    <div style={ { display: 'flex' ,flexDirection: 'column' } }>
      <PagePersist { ...args } onClose={ handleOnClose }
                   onSubmit={ handleSubmit }/>
      { persistedItem !== undefined && (
        <div style={ { marginTop: '1rem' } }>
          <strong>Submitted Item:</strong>
          <pre>{ JSON.stringify(persistedItem ,null ,2) }</pre>
        </div>
      ) }
      { cancelItem && (
        <div style={ { marginTop: '1rem' } }>
          <strong>{ cancelItem }</strong>
        </div>
      ) }
    </div>
  );
};

export const Default: Story = {
  args: {} ,
  render: (args) => <Template { ...args }/>,
};

export const WithoutInputs: Story = {
  args: {
    inputs: []
  } ,
};

export const CustomButtons: Story = {
  args: {
    submitButton: {
      context: 'primary' ,
      children: 'Super Submit',
    } ,
    cancelButton: {
      context: 'secondary' ,
      children: 'Super Cancel',
    },
  } ,
  render: (args) => <Template { ...args }/>,
};

