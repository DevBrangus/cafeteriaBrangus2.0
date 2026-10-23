/**
 * Punto de entrada de la aplicación del Casino Brangus.
 *
 * Monta React en el <div id="root"> de index.html, carga los estilos globales,
 * el sistema de alertas y define las rutas de la aplicación:
 *   /        -> App: elegir menú y validar documento
 *   /pedido  -> Pedidos: armar y confirmar el pedido
 *   /404     -> Error404: página no encontrada
 *   *        -> cualquier otra ruta redirige a /404
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './views/App.jsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Pedidos from './views/Pedidos.jsx'
// Ojo: el archivo se llama Error404.jsx. En Windows funciona igual, pero en un
// sistema que distingue mayúsculas (Linux) esta importación fallaría.
import Error404 from './views/error404.jsx'
import Alertas from './components/Alertas.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Contenedor de alertas: va fuera del router para verse en todas las pantallas */}
    <Alertas />

    <BrowserRouter>
      <Routes>
        {/* Pantalla inicial: elegir menú y validar documento */}
        <Route path='/' element={<App />} />
        {/* Pantalla para armar el pedido (requiere usuario validado) */}
        <Route path='/pedido' element={<Pedidos />} />
        {/* Página de error */}
        <Route path='/404' element={<Error404 />} />
        {/* Cualquier ruta desconocida redirige a la página de error */}
        <Route path='*' element={<Navigate to='/404' />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
