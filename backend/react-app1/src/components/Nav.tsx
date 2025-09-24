import React from 'react';

export const Nav: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span aria-label="logo" className="w-8 h-8 bg-blue-600 rounded-full inline-block" />
          <span className="font-semibold text-xl">Dyad Scaffold</span>
        </div>
        <ul className="hidden md:flex space-x-4 text-sm">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Shop</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
        </ul>
      </nav>
    </header>
  );
};
