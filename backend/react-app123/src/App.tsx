import React from 'react';
import Nav from './components/Nav';
import Card from './components/Card';
import Button from './components/Button';
import { Product } from './types';
import { useToggle } from './hooks/useToggle';
import { useFetch } from './hooks/useFetch';
import { formatDate } from './utils/formatDate';
import { classNames } from './utils/classNames';

const sampleProduct: Product = {
  id: 'p-001',
  name: 'Aurora Headphones',
  price: 199.99,
  createdAt: new Date().toISOString(),
  description: 'Immersive sound with lightweight design',
};

const App: React.FC = () => {
  const [menuOpen, toggleMenu] = useToggle(false);
  const { data: todo, loading, error } = useFetch<{ title: string; id: number }>(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  return (
    <div className={classNames('min-h-screen bg-gray-50 text-slate-900', 'flex flex-col')}>
      <Nav
        items={[
          { name: 'Home', href: '#' },
          { name: 'Products', href: '#products' },
          { name: 'About', href: '#about' },
        ]}
        onToggleMenu={toggleMenu}
        isOpen={menuOpen}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section id="home" className="mb-8">
          <Card title="Hello 👋" description="Welcome to your production-ready scaffold">
            <p className="text-sm text-gray-700 mb-2">
              This is a ready-to-ship React 18 + TS + Vite + Tailwind app.
            </p>
            <p className="text-sm text-gray-600">
              Hello from the scaffold. You can customize components, hooks, and utilities.
            </p>
          </Card>
        </section>

        <section id="products" className="mb-8">
          <Card title="Product Preview" description="Sample product and UI components">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              <div className="w-full md:w-1/2">
                <Card className="h-full" title={sampleProduct.name} description={sampleProduct.description}>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold">${sampleProduct.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{formatDate(sampleProduct.createdAt)}</span>
                  </div>
                </Card>
              </div>
              <div className="w-full md:w-1/2">
                <Card title="Async Data" description="Loading status from hook">
                  {loading && <p className="text-sm text-gray-600">Loading…</p>}
                  {!loading && todo && (
                    <p className="text-sm text-gray-700">{`Todo: #${todo.id} - ${todo.title}`}</p>
                  )}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="mt-2">
                    <Button variant="secondary" onClick={() => alert('Button in card clicked!')}>
                      Action
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <section id="hello" className="mb-8">
          <Card title="Hello World" description="Inline demo text">
            <p className="text-sm text-gray-700">This is a concise production-ready scaffold example with Hello.</p>
          </Card>
        </section>
      </main>

      <footer className="p-4 bg-white border-t">
        <div className="container mx-auto text-sm text-gray-500">
          © {new Date().getFullYear()} Scaffold. This is a friendly Hello. Happy coding!
        </div>
      </footer>
    </div>
  );
};

export default App;
