// Amplify is imported first so the Cognito config is ready before any component mounts.
import './amplify.ts';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// HAS to run first so Cognito is ready before any component mounts.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
