import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { verifyFirestoreConnection } from './lib/firebase.ts';

// Test connection to Cloud Firestore on application startup
verifyFirestoreConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
