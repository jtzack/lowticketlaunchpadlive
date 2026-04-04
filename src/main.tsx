import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const isFbPage = window.location.pathname === '/fb'

// Change this URL when you want /fb visitors to go somewhere different
const FB_CTA_URL = 'https://ship.samcart.com/products/substack-starter-sprint-fb'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App withFbPixel={isFbPage} ctaUrl={isFbPage ? FB_CTA_URL : undefined} />
  </StrictMode>,
)
