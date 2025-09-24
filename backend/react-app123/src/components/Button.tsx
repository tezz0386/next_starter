import React from 'react';
import { classNames as cx } from '../utils/classNames';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false
}) => {
  const base =
    'px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
    ghost:
      'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600'
  };

  return (
    <button
      type="button"
      className={cx(base, variantClasses[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
