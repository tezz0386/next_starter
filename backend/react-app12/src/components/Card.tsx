import React, { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, children, className }: CardProps) {
  return (
    <section
      className={classNames(
        'rounded-xl bg-white shadow p-4 border border-gray-200',
        className ?? ''
      )}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="text-sm text-gray-700">{children}</div>
    </section>
  );
}
