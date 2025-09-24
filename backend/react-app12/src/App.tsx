import React from 'react';
import Nav from './components/Nav';
import Card from './components/Card';
import Button from './components/Button';
import { Product } from './types';
import { useFetch } from './hooks/useFetch';
import { formatDate } from './utils/formatDate';
import { classNames } from './utils/classNames';

const sampleProduct: Product = {
  id: 'p-101',
  name: 'Sample Headphones',
  price: 99.99,
  createdAt: new Date().toISOString(),
  description: 'High-quality sound with 40h battery life.',
};

export default function App(): JSX.Element {
  // Example usage of useFetch to fetch products (public API or mocked)
  const { data, loading, error } = useFetch<Product[]>('https://fakestoreapi.com/products?limit=3');

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Print Hello as per additional requirement */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Hello</h1>
          <p className="text-sm text-gray-600">A production-ready React 18 scaffold with TS, Vite, and Tailwind.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card title="Welcome Card">
            <p className="text-sm text-gray-700">
              This is a reusable Card component. It uses Tailwind classes for responsive design.
            </p>
          </Card>

          <Card title="Static Product" className="bg-white">
            <div className="space-y-2">
              <div className="text-sm font-semibold">{sampleProduct.name}</div>
              <div className="text-xs text-gray-500">{formatDate(sampleProduct.createdAt || new Date().toISOString())}</div>
              <div className="text-sm font-semibold">${sampleProduct.price}</div>
            </div>
          </Card>

          <Card title="Actions">
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => alert('Primary action')} >
                Primary Action
              </Button>
              <Button variant="secondary" onClick={() => alert('Secondary action')} >
                Secondary Action
              </Button>
            </div>
          </Card>
        </section>

        <section className="mt-6">
          <Card title="Fetched Products" className="h-full">
            {loading && <p className="text-sm text-gray-600">Loading products...</p>}
            {error && <p className="text-sm text-red-600">Error: {error}</p>}
            {!loading && data && (
              <ul className="divide-y divide-gray-200">
                {data.map((p) => (
                  <li key={p.id} className="py-2 flex items-center justify-between">
                    <span className="text-sm">{p.name ?? 'Product'}</span>
                    <span className="text-xs text-gray-500">{`$${p.price ?? ''}`}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}
