/**
 * Ventana de confirmación con botones "No" y "Sí".
 * Se usa para quitar un producto del pedido y para confirmar el pedido.
 *
 * @param {object} props
 * @param {boolean} props.mostrar - Si la ventana está visible
 * @param {Function} props.setMostrar - Setter para cerrarla (se llama con false)
 * @param {string} props.mensaje - Pregunta que se muestra
 * @param {Function} props.accion - Lo que se ejecuta al tocar "Sí"
 */
export default function ModalConfirmacion ({
  mostrar,
  setMostrar,
  mensaje,
  accion
}) {
  // Si no debe mostrarse, no dibuja nada
  if (!mostrar) return null

  return (
    // Fondo oscuro que cubre toda la pantalla
    <div className='fixed inset-0 z-40 bg-tinta/60 grid place-content-center p-6 select-none'>
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-confirmacion-mensaje'
        className='w-120 max-w-full bg-white rounded-2xl p-5 flex flex-col gap-8 text-tinta'
      >
        {/* Encabezado y pregunta */}
        <div className='flex flex-col gap-3'>
          <span className='text-sm font-bold tracking-[0.18em] uppercase text-brangus'>Confirmación</span>
          <p id='modal-confirmacion-mensaje' className='text-[28px] font-bold leading-tight'>
            {mensaje}
          </p>
        </div>

        {/* Botones: "No" cierra la ventana, "Sí" ejecuta la acción */}
        <footer className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            className='h-16 rounded-xl border-2 border-tinta bg-white text-xl font-bold cursor-pointer hover:bg-fondo transition-colors'
            onClick={() => setMostrar(false)}
          >
            No
          </button>
          <button
            type='button'
            className='h-16 rounded-xl bg-brangus text-white text-xl font-bold cursor-pointer hover:bg-brangus-oscuro transition-colors'
            onClick={accion}
          >
            Sí
          </button>
        </footer>
      </section>
    </div>
  )
}
