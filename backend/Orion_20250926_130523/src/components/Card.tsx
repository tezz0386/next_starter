import React, { ReactNode } from 'react';

type CardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle, children, className }) => {
  return (
    <article className={['bg-white rounded-lg shadow-md p-4', className].join(' ')}>
      <header className="mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </header>
      <div className="border-t border-slate-200 pt-2">
        {children}
      </div>
    </article>
  );
};

export default Card;
