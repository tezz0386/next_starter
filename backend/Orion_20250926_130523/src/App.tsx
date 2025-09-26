import React from 'react';
import Nav from './components/Nav';
import Card from './components/Card';
import Button from './components/Button';
import useFetch from './hooks/useFetch';
import { Product } from './types/types';
import { formatDate } from './utils/formatDate';
import { classNames } from './utils/classNames';
import { useToggle } from './hooks/useToggle';

const App: React.FC = () => {
  const [isFancy, toggleFancy] = useToggle(false);
  const { data: product, loading } = useFetch<Product | null>('https://fakestoreapi.com/products/1', {});

  return (
    <div className={classNames(
      'min-h-screen text-slate-900',
      isFancy ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-slate-50'
    )}>
      <Nav />
      <header className="p-6 md:p-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          Hello Everyone i am here
        </h1>
        <p className="text-sm text-slate-700">
          A production-ready React 18 + TS + Vite + Tailwind scaffold.
        </p>
      </header>

      <main className="container mx-auto px-4">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Sample Product" subtitle="Live data from API">
            {loading ? (
              <p className="text-sm text-slate-600">Loading...</p>
            ) : product ? (
              <div className="space-y-2">
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-slate-600">{product.description?.slice(0, 100)}{product.description && product.description.length > 100 ? '...' : ''}</p>
                <p className="text-sm font-semibold">${product.price}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">No product data</p>
            )}
            <div className="mt-2">
              <Button onClick={toggleFancy} variant="secondary" className="w-full">
                Toggle Background
              </Button>
            </div>
          </Card>

          <Card title="Date" subtitle="Current date">
            <p className="text-sm text-slate-700">{formatDate(new Date())}</p>
          </Card>

          <Card title="Static Card" subtitle="Just a demonstration">
            <p className="text-sm text-slate-700">This is a reusable Card component built with Tailwind classes.</p>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default App;
