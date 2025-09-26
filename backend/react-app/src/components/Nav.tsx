import React from 'react';
import { classNames } from '../utils/classNames';

export default function Nav() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
        <div className="text-xl font-semibold" aria-label="Brand">
          BrandName
        </div>
        <ul className="flex items-center space-x-4" role="navigation" aria-label="Primary">
          {[
            { label: 'Home', href: '#' },
            { label: 'Products', href: '#' },
            { label: 'About', href: '#' }
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={classNames('px-2 py-1 rounded hover:bg-gray-100', 'text-sm text-gray-700')}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
