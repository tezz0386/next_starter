import React from 'react';
import Nav from './components/Nav';
import Card from './components/Card';
import Button from './components/Button';
import { useFetch } from './hooks/useFetch';
import { Product } from './types';
import { formatDate } from './utils/formatDate';
import { Card as _Card } from './types'; // just to ensure types import path is clear

// Local sample product for showcase
const sample: Product = {
  id: 'p-sample',
  name: 'Aurora Desk Lamp',
  price: 49.99,
  createdAt: new Date().toISOString(),
  description: 'A modern, warm LED desk lamp with touch dimming.',
};

function App(): JSX.Element {
  // Fetch a small dataset to demonstrate live data usage
  const { data, loading, error, refetch } = useFetch<Product[]>('/api/products');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <Nav />
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hello World banner */}
        <section className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Hello World
          </h1>
          <p className="text-gray-600">
            This is a production-ready React 18 + TS + Vite + Tailwind scaffold with examples.
          </p>
        </section>

        {/* Responsive layout with 2 cards on wider screens */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Product Spotlight">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{sample.name}</p>
                <p className="text-sm text-gray-500">{sample.description}</p>
              </div>
              <span className="text-lg font-semibold">${sample.price.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">Created: {formatDate(sample.createdAt)}</div>
            <div className="mt-3">
              <Button onClick={() => alert('Shop Now clicked!')}>Shop Now</Button>
            </div>
          </Card>

          <Card title="Live Data">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Error: {error}</p>
            ) : data?.length ? (
              <ul className="divide-y">
                {data!.slice(0, 3).map((p) => (
                  <li key={p.id} className="py-2 flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-sm text-gray-600">${p.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
            <button onClick={refetch} className="mt-3 text-sm underline text-blue-600">
              Refetch
            </button>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default App;
