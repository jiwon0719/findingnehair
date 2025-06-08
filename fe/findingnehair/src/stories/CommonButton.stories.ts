import type { Meta, StoryObj } from '@storybook/react';
import CommonButton from '../components/ui/CommonButton';

const meta = {
  title: 'Example/CommonButton',
  component: CommonButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'max'],
    },
    bgColor: { control: 'color' },
    textColor: { control: 'color' },
  },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    text: 'Small Button',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    text: 'Medium Button',
    size: 'medium',
  },
};

export const Max: Story = {
  args: {
    text: 'Max Button',
    size: 'max',
  },
};

export const CustomColor: Story = {
  args: {
    text: 'Custom Color Button',
    bgColor: 'bg-blue-500',
    textColor: 'text-yellow-100',
  },
};
