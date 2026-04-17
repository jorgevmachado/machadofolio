import React from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import PageDelete from './PageDelete';

const meta: Meta<typeof PageDelete> = {
  tags: ['autodocs'] ,
  args: {
    item: {
      id: '123' ,
      age: 150 ,
      name: 'name' ,
    } ,
    onClose: fn(),
  } ,
  title: 'Components/Page/Delete' ,
  argTypes: {} ,
  component: PageDelete ,
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

const Template = (args: React.ComponentProps<typeof PageDelete>) => {
  const [deletedItem ,setDeletedItem] = React.useState<unknown>(undefined);
  const [cancelItem ,setCancelItem] = React.useState<'deleted' | 'canceled' | undefined>(
    undefined);

  const handleDelete = async (item: unknown) => {
    setDeletedItem(item);
  };

  const handleOnClose = (item?: 'deleted' | 'canceled') => {
    if (item === 'canceled') {
      setDeletedItem(undefined);
    }
    setCancelItem(item);
  };

  return (
    <div style={ { display: 'flex' ,flexDirection: 'column' } }>
      <PageDelete { ...args } onClose={ handleOnClose }
                  onDelete={ handleDelete }/>
      { deletedItem !== undefined && (
        <div style={ { marginTop: '1rem' } }>
          <strong>Delete Item:</strong>
          <pre>{ JSON.stringify(deletedItem ,null ,2) }</pre>
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

export const CustomButtons: Story = {
  args: {
    deleteButton: {
      context: 'primary' ,
      children: 'Super Delete',
    } ,
    cancelButton: {
      context: 'secondary' ,
      children: 'Super Cancel',
    },
  } ,
  render: (args) => <Template { ...args }/>,
};

