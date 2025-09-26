import React from 'react'
import Nav from './components/Nav'
import Card from './components/Card'
import Button from './components/Button'
import { useFetch } from './hooks/useFetch'
import { Product } from './types'
import { formatDate } from './utils/formatDate'
import { classNames } from './utils/classNames'
import { useToggle } from './hooks/useToggle'

const App: React.FC = () => {
  const { value: isCompact, toggle } = useToggle(false)

  // Fetch a small sample of products (https://dummyjson.com/products?limit=3)
  const { data, loading, error } = useFetch<{ products: Product[] }>(
    'https://dummyjson.com/products?limit=3'
  )
  const products = data?.products ?? []

  return (
    <>
      <Nav />
      <header
        className={classNames(
          'bg-white shadow',
          isCompact ? 'py-2' : 'py-6'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 items-center">
            <div>
              <h1
                className={classNames(
                  'text-2xl md:text-4xl font-bold',
                  isCompact ? 'text-blue-600' : 'text-gray-900'
                )}
              >
                Hello World
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                React 18 + TypeScript + Vite + Tailwind scaffold. This is a
                production-ready starter with reusable components, hooks, and utilities.
              </p>
              <Button onClick={toggle} className="mt-4" aria-label="Toggle layout">
                Toggle Layout
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gray-50 rounded-md p-4 border border-dashed border-gray-200">
                <p className="text-sm text-gray-600">Today:</p>
                <p className="text-lg font-semibold">
                  {formatDate(new Date())}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <section aria-label="Product grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {products.map((p) => (
            <Card key={p.id} product={p} />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
