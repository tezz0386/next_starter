import React from 'react';
import { classNames } from '../utils/classNames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  const color =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  const base = 'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  return (
    <button
      {...rest}
      className={classNames(base, color, className)}
    >
      {children}
    </button>
  );
}
