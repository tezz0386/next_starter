import React from 'react'
import type { Product } from '../types'

type CardProps = {
  product: Product
}

const Card: React.FC<CardProps> = ({ product }) => {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {product.thumbnail ? (
          <img src={product.thumbnail} alt={product.title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-sm text-gray-500 px-2">No image</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between text-sm text-gray-700">
          <span>${product.price}</span>
          <span className="opacity-70">ID: {product.id}</span>
        </div>
      </div>
    </article>
  )
}

export default Card
