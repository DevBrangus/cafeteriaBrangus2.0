import { useLocation, useNavigate } from 'react-router-dom'
import MenuCard from '../components/MenuCard'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import ProductoPedido from '../components/ProductoPedido'
import ModalConfirmacion from '../components/ModalConfirmacion'
import ModalCantidad from '../components/ModalCantidad'

function Pedidos() {
  // borrar
  const nombre = 'LUGO CEBALLOS MIGUEL ANGEL'
  const almuerzo = 'https://carnesbrangus.com/casino/img/almuerzocompleto.jpg'
  const desayuno = 'https://carnesbrangus.com/casino/img/desayuno.jpg'


  // Hook de navegar entre las paginas
  const navigate = useNavigate()
  // Obtiene el id del menú seleccionado desde la primera vista
  const location = useLocation()

  useEffect(() => {
    const { menuId } = location.state || {}
  }, [])

  // Estado para controlar los productos que se añadan al pedido
  const [pedido, setPedido] = useState([])
  const [total, setTotal] = useState(0)

  // Estado para controlar la visibilidad del modal de confirmación al quitar un producto del menú
  const [mostrarModalQuitar, setMostrarModalQuitar] = useState({
    mostrar: false,
    productoId: null,
    productoNombre: null
  })


  // Estado para controlar la visibilidad del modal de cantidad al añadir un producto al pedido
  const [mostrarModalCantidad, setMostrarModalCantidad] = useState({
    mostrar: false,
    producto: null
  })

  // Estado para controlar la visibilidad del modal de confirmación al finalizar el pedido
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false)


  // Función para salir de la vista de pedidos y volver a la selección de menús
  const salir = () => {
    setPedido([]) // Borra los productos del pedido antes de redireccionar
    setTotal(0) // Borra el precio total
    navigate('/')
  }

  // Función para añadir productos al pedido
  const añadirProducto = (id, nombre, precio, cantidad) => {
    setPedido(prev => {
      const existe = prev.find(el => el.id === id)

      if (existe) {
        // Si ya existe el producto en el pedido, sumamos la cantidad al producto existente
        return prev.map(el =>
          el.id === id
            ? { ...el, cantidad: parseInt(el.cantidad) + parseInt(cantidad) } // Convierte a entero para asegurar que la cantidad sea numerica
            : el
        )
      }

      // Si no existe, lo agregamos nuevo
      return [...prev, { id, nombre, precio, cantidad }]
    })

    setTotal(prev => prev += (precio * cantidad))

    setMostrarModalCantidad({ mostrar: false, producto: null })
  }

  // Función para quitar productos del pedido
  const quitarProducto = (id) => {
    if (!pedido || pedido.length === 0) return

    const idPedido = pedido.find(el => el.id === id).id

    if (idPedido) {
      setPedido(prev => {
        const pedidoActualizado = prev.filter(el => el.id !== idPedido)
        return pedidoActualizado
      })
    }

    setMostrarModalQuitar({
      mostrar: false,
      productoId: null,
      productoNombre: null
    })
  }

  const finalizarPedido = () => {
    setPedido([]) // Borra los productos del pedido antes de redireccionar
    setTotal(0) // Borra el precio total
    navigate('/')
  }
  return (
    <>
      <main className='h-screen max-h-screen flex flex-col gap-4 overflow-hidden bg-slate-100 select-none pt-4 px-4'>
        <header className='w-full p-4 flex justify-between items-center bg-white shadow-xl/5 rounded-2xl'>
          <div className='flex items-center gap-10'>
            <button
              type='button'
              onClick={salir}
              className='py-3 px-6 font-semibold text-2xl bg-[#C60000] text-white rounded-xl cursor-pointer hover:bg-[#910000] transition-colors active:outline-2 active:outline-[#4d0000] flex gap-3'
            >
              <svg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
                <line x1='3' y1='16' x2='20' y2='16' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                <line x1='3' y1='16' x2='10' y2='22' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                <line x1='3' y1='16' x2='10' y2='10' stroke='white' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              <span>Atras</span>
            </button>

            <span className='text-[#C60000] font-bold text-4xl'>{nombre}</span>
          </div>
          <p className='text-3xl font-bold text-[#26723B]'>El total de su pedido es: ${total}</p>
        </header>

        <section className='flex-1 flex gap-4 overflow-hidden pb-4'>
          <div className='flex-3 overflow-y-scroll scroll-smooth shadow-2xl rounded-2xl bg-white no-scrollbar'>
            <article className='grid grid-cols-4 grid-rows-[auto] auto-rows-auto gap-4 p-4'>
              {/* Mapear peticion de menu */}
              <MenuCard id={1} nombre='Desayuno completo' precio={5000} imagen={desayuno} modalCantidad={setMostrarModalCantidad} />
              <MenuCard id={2} nombre='Almuerzo completo' precio={10000} imagen={almuerzo} modalCantidad={setMostrarModalCantidad} />
            </article>
          </div>

          <aside className='flex-1 p-4 h-full flex flex-col justify-between gap-6 rounded-2xl shadow-xl bg-white'>
            <div className='flex flex-col gap-6 overflow-hidden'>
              <p className='text-[#C60000] text-center text-5xl font-semibold'>Su pedido</p>

              {pedido?.length !== 0 ? (
                <div className='flex flex-col gap-4 overflow-y-scroll scroll-smooth no-scrollbar pb-4'>
                  {pedido && pedido.map(({ id, nombre, precio, cantidad }, index) => (
                    <ProductoPedido
                      key={index}
                      id={id}
                      nombre={nombre}
                      precio={precio}
                      cantidad={cantidad}
                      modalQuitar={setMostrarModalQuitar}
                    />
                  ))}
                </div>
              ) : (
                // Mensaje que se muestra cuando no se ha seleccionado ningún producto
                <div className='w-full p-3 border-l-2 border-blue-700 bg-blue-100 flex items-center gap-3'>
                  <Icon icon='material-symbols:info-rounded' width='40' className='text-blue-700' />
                  <span className='text-blue-700 text-xl font-semibold'>Selecciona un producto para agregar al pedido</span>
                </div>
              )}
            </div>
            <button className='bg-[#26723B] p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-[#005f1b] transition-colors' onClick={() => setMostrarModalFinalizar(true)}>
              <Icon icon='material-symbols:save-rounded' width='32' className='text-white' />
              <span className='text-white text-xl font-semibold'>Guardar pedido</span>
            </button>
          </aside>
        </section>
      </main>

      {/* Modal para quitar un producto del pedido */}
      <ModalConfirmacion
        mostrar={mostrarModalQuitar.mostrar}
        setMostrar={setMostrarModalQuitar}
        mensaje={`¿Desea quitar ${mostrarModalQuitar.productoNombre} de su pedido?`}
        accion={() => quitarProducto(mostrarModalQuitar.productoId)}
      />

      {/* Modal para añadir un producto al pedido y seleccionar una cantidad */}
      <ModalCantidad
        mostrar={mostrarModalCantidad.mostrar}
        setMostrar={setMostrarModalCantidad}
        producto={mostrarModalCantidad.producto}
        accion={añadirProducto}
      />

      {/* Modal para finalizar el pedido */}
      <ModalConfirmacion
        mostrar={mostrarModalFinalizar}
        setMostrar={setMostrarModalFinalizar}
        mensaje={`¿Desea finalizar su pedido?`}
        accion={() => finalizarPedido()}
      />
    </>
  )
}

export default Pedidos
