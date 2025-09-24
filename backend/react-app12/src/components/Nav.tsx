import React from 'react';

export default function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">App</span>
            <span className="hidden sm:inline-flex text-sm text-gray-600">Responsive UI</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">Home</a>
            <a href="#" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">About</a>
            <a href="#" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
