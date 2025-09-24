import React from 'react';
import { classNames } from '../utils/classNames';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export default function Button({ children, onClick, variant = 'primary', className }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(base, variantClasses, className ?? '')}
    >
      {children}
    </button>
  );
}
