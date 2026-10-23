import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'

import logo from '../assets/logo.png'
import MenuCard from '../components/MenuCard'
import ProductoPedido from '../components/ProductoPedido'
import ModalConfirmacion from '../components/ModalConfirmacion'
import PedidoRegistrado from '../components/PedidoRegistrado'
import { toast } from '../utils/alertas'
import useObtenerMenu from '../services/useObtenerMenu'
import useGuardarPedido from '../services/useGuardarPedido'
import Cargando from '../components/Cargando'

const NOMBRES_MENU = { 1: 'Desayuno', 2: 'Almuerzo' }

// Formatea un numero para añadir puntos de miles
const formatPrecio = (precio) => Number(precio).toLocaleString('es-CO')

// Iniciales del usuario para el avatar (máximo 2 letras)
const iniciales = (nombre = '') =>
  nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()

function Pedidos () {
  // Hook de navegar entre las paginas
  const navigate = useNavigate()
  // Obtiene el id del menú seleccionado desde la primera vista
  const location = useLocation()
  const { menuId } = location.state || {}

  const [usuario, setUsuario] = useState(JSON.parse(sessionStorage.getItem('usuario')))

  useEffect(() => {
    const usuarioSessionStorage = JSON.parse(sessionStorage.getItem('usuario'))

    const timer = setInterval(() => {
      if (!usuarioSessionStorage) navigate('/', { replace: true })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Servicio para obtener todos los productos del menú seleccionado
  const { productos } = useObtenerMenu({ menuId, toast })

  // Productos añadidos al pedido: { id, nombre, precio, cantidad, total }
  const [pedido, setPedido] = useState([])
  const total = pedido.reduce((suma, el) => suma + el.total, 0)
  const unidades = pedido.reduce((suma, el) => suma + el.cantidad, 0)

  // Estado para controlar la visibilidad del modal de confirmación al quitar un producto del menú
  const [mostrarModalQuitar, setMostrarModalQuitar] = useState({
    mostrar: false,
    productoId: null,
    productoNombre: null
  })

  // Estado para controlar la visibilidad del modal de confirmación al finalizar el pedido
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false)

  // Datos del ticket una vez registrado el pedido (muestra la pantalla de confirmación)
  const [ticket, setTicket] = useState(null)

  // Función para salir de la vista de pedidos y volver a la selección de menús
  const salir = () => {
    setPedido([])
    setTicket(null)
    setUsuario(null)
    navigate('/', { replace: true })
  }

  // Suma una unidad del producto al pedido
  const agregarProducto = ({ id, producto, valor }) => {
    const precio = parseInt(valor)

    setPedido(prev => {
      const existe = prev.find(el => el.id === id)

      if (existe) {
        return prev.map(el =>
          el.id === id
            ? { ...el, cantidad: el.cantidad + 1, total: precio * (el.cantidad + 1) }
            : el
        )
      }

      return [...prev, { id, nombre: producto, precio, cantidad: 1, total: precio }]
    })
  }

  // Resta una unidad; si llega a cero, lo quita del pedido
  const restarProducto = (id) => {
    setPedido(prev => prev.flatMap(el => {
      if (el.id !== id) return [el]
      if (el.cantidad <= 1) return []
      return [{ ...el, cantidad: el.cantidad - 1, total: el.precio * (el.cantidad - 1) }]
    }))
  }

  // Quita el producto completo del pedido
  const quitarProducto = (id) => {
    setPedido(prev => prev.filter(el => el.id !== id))

    setMostrarModalQuitar({
      mostrar: false,
      productoId: null,
      productoNombre: null
    })
  }

  // Estado para saber cuando esta cargando la pagina y mostrar la pantalla con el spinner
  const [cargandoPDF, setCargandoPDF] = useState(false)

  // Servicio para registrar el pedido en la base de datos
  const { guardarPedido } = useGuardarPedido({
    usuario,
    total,
    pedido,
    toast,
    setCargandoPDF,
    salir,
    alTerminar: setTicket
  })

  if (ticket) return <PedidoRegistrado ticket={ticket} onVolver={salir} />

  return (
    <>
      {cargandoPDF && <Cargando />}

      <main className='w-full h-dvh flex flex-col bg-fondo text-tinta select-none overflow-hidden'>

        {/* Botón de salir, menú elegido y usuario */}
        <header className='h-20 xl:h-26 shrink-0 px-5 xl:px-8 flex items-center justify-between gap-4 bg-white border-b border-linea'>
          <div className='flex items-center gap-4 xl:gap-6'>
            <button
              type='button'
              onClick={salir}
              aria-label='Salir y volver al inicio'
              className='w-13 h-13 xl:w-15 xl:h-15 rounded-full bg-fondo grid place-content-center cursor-pointer hover:bg-panel transition-colors'
            >
              <ArrowLeft size={24} strokeWidth={2.4} aria-hidden='true' />
            </button>
            <img src={logo} alt='Brangus' className='h-11 xl:h-13 w-auto' />
            {NOMBRES_MENU[menuId] && (
              <span className='px-3.5 py-1.5 rounded-full bg-tinta text-white text-sm xl:text-base font-bold tracking-[0.12em] uppercase'>
                {NOMBRES_MENU[menuId]}
              </span>
            )}
          </div>

          <div className='flex items-center gap-3.5'>
            <div className='flex flex-col items-end min-w-0'>
              <span className='text-sm text-suave'>Pedido a nombre de</span>
              <span className='text-lg xl:text-[22px] font-bold truncate max-w-[320px]'>{usuario?.nombre}</span>
            </div>
            <span className='w-12 h-12 xl:w-13 xl:h-13 shrink-0 rounded-full bg-brangus text-white grid place-content-center text-lg xl:text-xl font-extrabold'>
              {iniciales(usuario?.nombre)}
            </span>
          </div>
        </header>

        <div className='flex-1 min-h-0 flex'>
          {/* Productos disponibles del menú */}
          <section className='flex-1 min-w-0 px-5 pt-5 xl:px-8 xl:pt-7 flex flex-col gap-4 xl:gap-5'>
            <div className='flex items-baseline justify-between gap-4'>
              <h1 className='titulo text-4xl xl:text-[44px]'>Menú de hoy</h1>
              <span className='text-base xl:text-lg text-suave'>Toca un producto para agregarlo</span>
            </div>

            <div className='flex-1 min-h-0 overflow-y-auto scroll-smooth no-scrollbar -mx-1 px-1 pt-1 pb-5 xl:pb-7'>
              <div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5'>
                {productos?.map((p) => (
                  <MenuCard
                    key={p.id}
                    nombre={p.producto}
                    precio={p.valor}
                    imagen={p.img}
                    cantidad={pedido.find(el => el.id === p.id)?.cantidad ?? 0}
                    onAgregar={() => agregarProducto(p)}
                    onRestar={() => restarProducto(p.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Pedido actual del usuario */}
          <aside className='w-85 xl:w-105 shrink-0 bg-white border-l border-linea p-5 xl:p-7 flex flex-col gap-4 xl:gap-5'>
            <div className='flex items-baseline justify-between'>
              <h2 className='titulo text-3xl xl:text-4xl'>Tu pedido</h2>
              {unidades > 0 && (
                <span className='text-base text-suave'>
                  {unidades} {unidades === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </div>

            {pedido.length > 0
              ? (
                <ul className='flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col'>
                  {pedido.map(({ id, nombre, precio, cantidad }) => (
                    <ProductoPedido
                      key={id}
                      id={id}
                      nombre={nombre}
                      precio={precio}
                      cantidad={cantidad}
                      modalQuitar={setMostrarModalQuitar}
                    />
                  ))}
                </ul>
                )
              : (
                <div className='flex-1 flex flex-col items-center justify-center gap-3 text-center text-suave px-6'>
                  <Info size={40} strokeWidth={1.8} aria-hidden='true' />
                  <span className='text-lg font-semibold'>Agrega productos del menú para armar tu pedido</span>
                </div>
                )}

            <div className='flex flex-col gap-3 xl:gap-4 pt-4 xl:pt-5 border-t-2 border-tinta'>
              <div className='flex items-baseline justify-between'>
                <span className='text-lg xl:text-xl font-semibold'>Total</span>
                <span className='text-[40px] xl:text-5xl leading-none font-extrabold' style={{ fontStretch: '85%' }}>
                  ${formatPrecio(total)}
                </span>
              </div>
              <button
                type='button'
                disabled={pedido.length === 0}
                onClick={() => setMostrarModalFinalizar(true)}
                className='h-16 xl:h-19 rounded-xl bg-brangus text-white text-xl xl:text-2xl font-bold flex items-center justify-center gap-3 cursor-pointer hover:bg-brangus-oscuro transition-colors disabled:bg-tenue disabled:cursor-not-allowed'
              >
                Confirmar pedido
                <ArrowRight size={24} strokeWidth={2.4} aria-hidden='true' />
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal para quitar un producto del pedido */}
      <ModalConfirmacion
        mostrar={mostrarModalQuitar.mostrar}
        setMostrar={setMostrarModalQuitar}
        mensaje={`¿Quitar ${mostrarModalQuitar.productoNombre} de tu pedido?`}
        accion={() => quitarProducto(mostrarModalQuitar.productoId)}
      />

      {/* Modal para finalizar el pedido */}
      <ModalConfirmacion
        mostrar={mostrarModalFinalizar}
        setMostrar={setMostrarModalFinalizar}
        mensaje={`¿Confirmas tu pedido por $${formatPrecio(total)}?`}
        accion={() => {
          setMostrarModalFinalizar(false)
          guardarPedido()
        }}
      />
    </>
  )
}

export default Pedidos
