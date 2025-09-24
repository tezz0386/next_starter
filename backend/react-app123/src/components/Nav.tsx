import React from 'react';
import { classNames as cx } from '../utils/classNames';
type NavItem = { name: string; href: string };

interface Props {
  items?: NavItem[];
  onToggleMenu?: () => void;
  isOpen?: boolean;
}

const Nav: React.FC<Props> = ({ items = [{ name: 'Home', href: '#' }], onToggleMenu, isOpen }) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight">Brand</span>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {items.map((it) => (
            <a key={it.name} href={it.href} className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              {it.name}
            </a>
          ))}
        </nav>
        <button
          className={cx(
            'md:hidden inline-flex items-center justify-center p-2 rounded-md border',
            'border-gray-200 bg-white hover:bg-gray-50'
          )}
          aria-label="Toggle Menu"
          onClick={onToggleMenu}
        >
          <span className="sr-only">Open menu</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Mobile menu (optional; simple reveal) */}
      {isOpen && (
        <div className="md:hidden border-t border-b bg-white">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-1">
            {items.map((it) => (
              <a key={it.name} href={it.href} className="text-sm text-gray-700 px-2 py-2 rounded-md hover:bg-gray-50">
                {it.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
