import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './views/App.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Pedidos from './views/Pedidos.jsx'
import Error404 from './views/error404.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/pedido' element={<Pedidos />} />
        <Route path='/404' element={<Error404 />} />
        <Route path='*' element={<Navigate to='/404' />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
