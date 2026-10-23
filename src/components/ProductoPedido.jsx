/**
 * Fila de un producto dentro del panel "Tu pedido".
 *
 * Muestra la cantidad, el nombre, el precio unitario, el subtotal y un botón
 * de papelera que abre el modal para quitar el producto del pedido.
 *
 * @param {object} props
 * @param {number} props.id - Id del producto
 * @param {string} props.nombre - Nombre del producto
 * @param {number} props.precio - Precio unitario
 * @param {number} props.cantidad - Unidades pedidas
 * @param {Function} props.modalQuitar - Setter del estado del modal de quitar (en Pedidos)
 */
import { Trash2 } from 'lucide-react'

// Formatea un numero para añadir puntos de miles
const formatPrecio = (precio) => Number(precio).toLocaleString('es-CO')

function ProductoPedido ({
  id,
  nombre,
  precio,
  cantidad,
  modalQuitar
}) {
  return (
    <li className='flex items-center gap-3 py-3.5 xl:py-4 border-b border-[#ECE7E2]'>
      {/* Cantidad */}
      <span className='w-10 h-10 xl:w-11 xl:h-11 shrink-0 rounded-xl bg-fondo grid place-content-center text-lg xl:text-xl font-extrabold'>
        {cantidad}
      </span>

      {/* Nombre y precio por unidad */}
      <div className='flex-1 min-w-0 flex flex-col gap-0.5'>
        <span className='text-lg xl:text-xl font-bold leading-tight'>{nombre}</span>
        <span className='text-sm xl:text-base text-suave'>${formatPrecio(precio)} c/u</span>
      </div>

      {/* Subtotal (precio × cantidad) */}
      <span className='text-lg xl:text-xl font-bold whitespace-nowrap'>${formatPrecio(precio * cantidad)}</span>

      {/* Abre el modal de confirmación para quitar el producto */}
      <button
        type='button'
        aria-label={`Quitar ${nombre} del pedido`}
        onClick={() => modalQuitar({ mostrar: true, productoId: id, productoNombre: nombre })}
        className='w-10 h-11 -mr-2 shrink-0 rounded-xl grid place-content-center text-tenue cursor-pointer hover:bg-fondo hover:text-brangus transition-colors'
      >
        <Trash2 size={22} strokeWidth={2} aria-hidden='true' />
      </button>
    </li>
  )
}

export default ProductoPedido
