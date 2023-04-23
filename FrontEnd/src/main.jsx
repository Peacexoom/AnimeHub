import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AnimeProvider } from './Contextpage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimeProvider>
        <App />
      </AnimeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
