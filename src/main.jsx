import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './views/App.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Pedidos from './views/Pedidos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App /> || <Navigate to='/404' />} />
        <Route path='/pedido' element={<Pedidos /> || <Navigate to='/404' />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
