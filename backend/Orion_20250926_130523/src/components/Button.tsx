import React from 'react';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const base = 'px-4 py-2 rounded-md font-medium focus:outline-none';
  const variants = {
    primary: 'bg-brand text-white hover:bg-indigo-600',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
  };
  return (
    <button
      className={[base, variants[variant], className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
