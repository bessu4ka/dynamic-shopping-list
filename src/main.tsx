// components
import App from './pages/App.tsx';
// utils
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// styles
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
