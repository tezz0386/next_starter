import React from 'react'

export default function Nav(): JSX.Element {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tight">Brand</div>
        <ul className="flex space-x-4">
          <li>
            <a href="#home" className="text-sm text-gray-700 hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="#products" className="text-sm text-gray-700 hover:underline">
              Products
            </a>
          </li>
          <li>
            <a href="#about" className="text-sm text-gray-700 hover:underline">
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
