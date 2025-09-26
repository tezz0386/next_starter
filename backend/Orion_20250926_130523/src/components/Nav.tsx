import React from 'react';

const Nav: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block h-8 w-8 rounded-full bg-brand" aria-label="brand" />
          <span className="font-semibold text-lg">React+TS Scaffold</span>
        </div>
        <ul className="hidden md:flex items-center space-x-4 text-sm">
          <li><a href="#" className="px-3 py-2 rounded hover:bg-slate-100">Home</a></li>
          <li><a href="#" className="px-3 py-2 rounded hover:bg-slate-100">About</a></li>
          <li><a href="#" className="px-3 py-2 rounded hover:bg-slate-100">Projects</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
