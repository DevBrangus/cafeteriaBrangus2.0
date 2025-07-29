function MenuCard({
  id,
  nombre,
  precio,
  imagen,
  modalCantidad
}) {
  // Formatea un numero para añadir puntos de miles
  const formatPrecio = (precio) => {
    return precio.toLocaleString('es-CO')
  }

  return (
    <div
      // Establece los datos del producto para añadirlo al pedido
      onClick={
        () => modalCantidad({
          mostrar: true,
          producto: {
            id,
            nombre,
            precio
          }
        })
      }
      className='relative group cursor-pointer rounded-2xl overflow-hidden aspect-square shadow-xl'
    >
      <img src={imagen} alt={`Imagen de ${nombre}`} className='h-full object-cover transition-transform group-hover:scale-110' />
      <div className='absolute w-full h-full top-0 left-0 bg-[#0000008d] grid place-content-center gap-6'>
        <span className='text-4xl font-bold text-white text-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]'>
          {nombre}
        </span>
        <span className='text-3xl font-bold text-white text-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]'>
          {`$${formatPrecio(precio)}`}
        </span>
      </div>
    </div>
  )
}

export default MenuCard
