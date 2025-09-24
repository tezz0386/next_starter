import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, description, children, className }) => {
  return (
    <section className={`bg-white border rounded-lg shadow-sm p-4 ${className ?? ''}`}>
      {(title || description) && (
        <header className="mb-2">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </header>
      )}
      <div className="mt-2">{children}</div>
    </section>
  );
};

export default Card;
