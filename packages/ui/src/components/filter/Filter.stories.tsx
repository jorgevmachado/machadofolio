import React from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Filter from './Filter';

const meta: Meta<typeof Filter> = {
  tags: ['autodocs'] ,
  args: {
    inputs: [],
  } ,
  title: 'Components/Filter' ,
  argTypes: {} ,
  component: Filter ,
  decorators: [
    (Story) => (
      <div style={ { height: '50vh' ,width: '100%' } }>
        <Story/>
      </div>
    ) ,
  ] ,
  parameters: {} ,
};

export default meta;
type Story = StoryObj<typeof meta>;

type FilterItemProps = {
  type: {
    id: string;
    name: string;
    name_code: string;
  };
  name: string;
}

const Template = (args: React.ComponentProps<typeof Filter>) => {
  const [currentItem, setCurrentItem] = React.useState<Partial<FilterItemProps> | undefined>(undefined);

  const handleFilter = (item?: FilterItemProps) => {
    if(!item) {
      return undefined;
    }

    setCurrentItem(item);
  }
  return (
    <>
      <Filter {...args} onFilter={(item) => handleFilter(item as FilterItemProps)}/>
      {currentItem && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Filter:</strong>
          <pre>{JSON.stringify(currentItem, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export const Default: Story = { args: {} };

export const FilterWithInputs: Story = {
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
        type: 'number' ,
        name: 'age' ,
        label: 'age' ,
        required: true ,
        placeholder: `Enter a age` ,
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
        type: 'date' ,
        name: 'date' ,
        label: 'Date',
        value: new Date().toISOString(),
        required: true ,
        calendar: {
          inline: false,
          todayButton: 'Today',
        },
        children: (<div style={{ color: "red" }} data-children="calendar">Don&#39;t forget to check the weather!</div>),
        placeholder: 'Date',
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
      {
        fluid: true ,
        type: 'number' ,
        name: 'age' ,
        label: 'age' ,
        required: true ,
        placeholder: `Enter a age` ,
      } ,
      {
        fluid: true ,
        rows: 10,
        type: 'textarea',
        name: 'text-area' ,
        label: 'Text Area',
        value: 'Lorem ipsum dolor sit amet.',
        required: true ,
        placeholder: 'Text Area'
      } ,
    ] ,
  },
  render: (args) => <Template {...args}/>
};


