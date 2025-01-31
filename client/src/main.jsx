import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { FundingProvider } from './context/index.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FundingProvider>
    <StrictMode>
      <BrowserRouter>
        <App />
    </BrowserRouter>
    </StrictMode>
  </FundingProvider>
)
 