import React from 'react';
import type { Meta ,StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import PageHeader from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  tags: ['autodocs'] ,
  args: {
    resourceName: 'Page Header',
  } ,
  title: 'Components/Page/Header' ,
  argTypes: {} ,
  component: PageHeader ,
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

export const Default: Story = { args: {} };

export const WithActionButton: Story = {
  args: {
    action: {
      label: 'Action Button',
      onClick: fn()
    }
  }
}

export const WithActionIcon: Story = {
  args: {
    actionIcon: {
     icon: 'upload',
      onClick: fn()
    }
  }
}


