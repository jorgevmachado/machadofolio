import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Delete from './Delete';
import React from 'react';

const meta: Meta<typeof Delete> = {
    tags: ['autodocs'],
    args: {
      item: {
        id: '123',
        age: 150,
        name: 'name',
      },
      onClose: fn()
    },
    title: 'Components/Delete',
    argTypes: {},
    component: Delete,
    decorators: [
        (Story) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
    parameters: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof Delete>) => {
  const [deletedItem, setDeletedItem] = React.useState<unknown>(undefined);
  const [cancelItem, setCancelItem] = React.useState<'deleted' | 'canceled' | undefined>(undefined);

  const handleDelete = async (item: unknown) => {
    setDeletedItem(item);
  }

  const handleOnClose = (item?: 'deleted' | 'canceled') => {
    if(item === 'canceled') {
      setDeletedItem(undefined);
    }
    setCancelItem(item);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Delete {...args} onClose={handleOnClose} onDelete={handleDelete} />
      {deletedItem !== undefined && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Delete Item:</strong>
          <pre>{JSON.stringify(deletedItem, null, 2)}</pre>
        </div>
      )}
      {cancelItem && (
        <div style={{ marginTop: '1rem' }}>
          <strong>{cancelItem}</strong>
        </div>
      )}
    </div>
  )
};


export const Default: Story = {
  args: {},
  render: (args) => <Template {...args}/>
};

export const CustomButtons: Story = {
  args: {
    deleteButton: {
      context: 'primary',
      children: 'Super Delete'
    },
    cancelButton: {
      context: 'secondary',
      children: 'Super Cancel'
    }
  },
  render: (args) => <Template {...args}/>
}

