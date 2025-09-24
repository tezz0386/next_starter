import React from 'react';
import { classNames } from '../utils/classNames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...rest
}) => (
  <button
    className={classNames(
      'px-4 py-2 rounded-md focus:outline-none',
      variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
