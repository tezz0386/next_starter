import React from 'react';
import { Nav } from './components/Nav';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { useFetch } from './hooks/useFetch';
import { Product } from './types';
import { useToggle } from './hooks/useToggle';
import { formatDate } from './utils/formatDate';

const App: React.FC = () => {
  // Fetch a small set of products for demo
  const { data: products, loading, error } = useFetch<Product[]>('https://fakestoreapi.com/products?limit=6');
  const { on, toggle } = useToggle(false);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gray-50">
        <section className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Hello</h1>
            <p className="text-gray-600">
              This is a scaffolded React 18 + TypeScript + Vite + Tailwind app.
            </p>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-center text-gray-600">Loading...</div>
            )}
            {error && (
              <div className="col-span-full text-red-600">Error: {error}</div>
            )}
            {!loading && products?.map((p) => (
              <Card
                key={p.id}
                title={p.title}
                description={p.description}
                image={p.image}
                price={p.price}
                onClick={toggle}
              />
            ))}
          </section>

          {on && (
            <section className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md" aria-label="details-panel">
              <p className="text-sm text-blue-800">Additional details panel is visible.</p>
              <p className="text-xs text-blue-600">Format date example: {formatDate(new Date())}</p>
            </section>
          )}

          <div className="mt-6 flex gap-4">
            <Button onClick={toggle} variant="primary">Toggle Details</Button>
            <Button onClick={() => alert('Action example')} variant="secondary">Action</Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
