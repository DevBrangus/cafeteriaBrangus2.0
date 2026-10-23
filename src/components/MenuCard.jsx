/**
 * Tarjeta de un producto del menú (vista de pedido).
 *
 * Muestra foto, nombre y precio. Si el producto no está en el pedido muestra
 * el botón "Agregar"; si ya está, muestra un contador rojo con − y +.
 *
 * @param {object} props
 * @param {string} props.nombre - Nombre del producto
 * @param {string|number} props.precio - Precio unitario
 * @param {string} props.imagen - URL de la foto del producto
 * @param {number} [props.cantidad=0] - Unidades de este producto en el pedido
 * @param {Function} props.onAgregar - Suma una unidad al pedido
 * @param {Function} props.onRestar - Resta una unidad del pedido
 */
import { Minus, Plus } from 'lucide-react'

// Formatea un numero para añadir puntos de miles
const formatPrecio = (precio) => Number(precio).toLocaleString('es-CO')

function MenuCard ({
  nombre,
  precio,
  imagen,
  cantidad = 0,
  onAgregar,
  onRestar
}) {
  // El producto ya está en el pedido (cambia el borde y muestra el contador)
  const enPedido = cantidad > 0

  return (
    <article
      className={`flex flex-col rounded-xl overflow-hidden bg-white transition-shadow
        ${enPedido ? 'ring-3 ring-brangus' : 'ring-1 ring-linea'}`}
    >
      {/* Foto del producto */}
      <img
        src={imagen}
        alt={`Imagen de ${nombre}`}
        className='w-full h-28 xl:h-37 object-cover'
      />

      <div className='flex-1 px-4 pt-3 pb-4 xl:px-4.5 xl:pt-4 xl:pb-4.5 flex flex-col justify-between gap-3'>
        {/* Nombre y precio */}
        <div className='flex flex-col gap-1'>
          <span className='text-xl xl:text-[22px] font-bold leading-tight'>{nombre}</span>
          <span className='text-lg xl:text-xl font-semibold text-suave'>${formatPrecio(precio)}</span>
        </div>

        {enPedido
          ? (
            // Contador: − cantidad +
            <div className='h-13 xl:h-14 px-1.5 rounded-xl bg-brangus text-white flex items-center justify-between'>
              <button
                type='button'
                onClick={onRestar}
                aria-label={`Quitar un ${nombre}`}
                className='w-11 h-11 rounded-xl bg-white/20 grid place-content-center cursor-pointer hover:bg-white/30 transition-colors'
              >
                <Minus size={22} strokeWidth={2.6} aria-hidden='true' />
              </button>
              <span className='text-2xl font-extrabold'>{cantidad}</span>
              <button
                type='button'
                onClick={onAgregar}
                aria-label={`Agregar otro ${nombre}`}
                className='w-11 h-11 rounded-xl bg-white/20 grid place-content-center cursor-pointer hover:bg-white/30 transition-colors'
              >
                <Plus size={22} strokeWidth={2.6} aria-hidden='true' />
              </button>
            </div>
            )
          : (
            // Botón para agregar la primera unidad
            <button
              type='button'
              onClick={onAgregar}
              className='h-13 xl:h-14 rounded-xl border-2 border-tinta bg-white text-lg xl:text-xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-tinta hover:text-white transition-colors'
            >
              <Plus size={22} strokeWidth={2.6} aria-hidden='true' />
              Agregar
            </button>
            )}
      </div>
    </article>
  )
}

export default MenuCard
