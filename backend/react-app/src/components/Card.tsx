import React from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-700">{children}</div>
    </section>
  );
}
