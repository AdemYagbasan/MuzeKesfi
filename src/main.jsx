import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// CRITICAL: Import Leaflet CSS to prevent tile rendering issues
import 'leaflet/dist/leaflet.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
