import { Icon } from '@iconify/react'

function ProductoPedido ({
  id,
  nombre,
  precio,
  cantidad,
  modalQuitar
}) {
  // Formatea un numero para añadir puntos de miles
  const formatPrecio = (precio) => {
    return precio.toLocaleString('es-CO')
  }

  return (
    <div className='p-4 flex items-center gap-4 shadow-lg rounded-2xl bg-white border border-slate-200'>
      <Icon
        icon='material-symbols:delete-rounded' width='32'
        className='text-red-500 cursor-pointer hover:scale-120 transition-transform'
        onClick={
          () => modalQuitar({
            mostrar: true,
            productoId: id,
            productoNombre: nombre
          })
        }
      />

      <div className='flex flex-col flex-1'>
        <span className='text-2xl italic font-semibold'>{nombre}</span>
        <p className='flex gap-5'>
          {/* Precio por unidad */}
          <span className='text-lg italic text-[#26723B] font-semibold'>{`$${formatPrecio(precio)}`}</span>
          {/* Precio total según la cantidad escogida */}
          <span className='text-lg italic text-[#26723B] font-semibold'>{`Total: $${formatPrecio(precio * cantidad)}`}</span>
        </p>
      </div>

      <span className='p-2 w-12 h-12 text-center text-xl text-white font-bold bg-[#26723B] rounded-xl'>{cantidad}</span>
    </div>
  )
}

export default ProductoPedido
