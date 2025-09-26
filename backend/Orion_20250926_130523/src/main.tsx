import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';

const rootNode = document.getElementById('root');
if (rootNode) {
  const root = createRoot(rootNode);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
