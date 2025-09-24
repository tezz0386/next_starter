import React from 'react';
import { classNames } from '../utils/classNames';

type CardProps = {
  title: string;
  description?: string;
  price?: number;
  image?: string;
  onClick?: () => void;
};

export const Card: React.FC<CardProps> = ({ title, description, price, image, onClick }) => {
  return (
    <article className={classNames('bg-white rounded-lg shadow p-4 flex flex-col', image ? '' : 'h-full')}>
      {image && (
        <img src={image} alt={title} className="h-40 w-full object-cover rounded mb-4" />
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
        {typeof price === 'number' && <p className="mt-2 font-semibold">${price.toFixed(2)}</p>}
      </div>
      <button
        onClick={onClick}
        className="mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View
      </button>
    </article>
  );
};
