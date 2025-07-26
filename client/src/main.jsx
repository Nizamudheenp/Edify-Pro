import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from './features/app/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>,
)
