/**
 * Pantalla de confirmación que se muestra después de registrar e imprimir el pedido.
 *
 * Muestra un resumen del ticket (consecutivo, usuario, productos y total) y
 * regresa sola al inicio después de SEGUNDOS segundos, o antes si se toca
 * "Volver al inicio".
 *
 * @param {object} props
 * @param {object} props.ticket - Datos del ticket que arma useGuardarPedido:
 *   { detalles: [{ cantidad, producto, total, totalPedido }], nombre, documento, fecha, consecutivo }
 * @param {Function} props.onVolver - Limpia el pedido y vuelve al inicio
 */
import { useEffect, useState } from 'react'
import { Check, House } from 'lucide-react'
import logo from '../assets/logo.png'

// Segundos antes de volver solo al inicio
const SEGUNDOS = 5

// Formatea un numero para añadir puntos de miles
const formatPrecio = (precio) => Number(precio).toLocaleString('es-CO')

  // Segundos que faltan para volver al inicio
function PedidoRegistrado({ ticket, onVolver }) {
  const [restante, setRestante] = useState(SEGUNDOS)

  // Cuenta regresiva: baja un segundo cada vez y, al llegar a 0, vuelve al inicio
  useEffect(() => {
    if (restante <= 0) {
      onVolver()
      return
    }
    const timer = setTimeout(() => setRestante(r => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [restante])

  // Total del pedido: lo trae cada detalle en "totalPedido"; si no, se suma a mano
  const total = ticket.detalles[0]?.totalPedido ?? ticket.detalles.reduce((s, d) => s + Number(d.total), 0)

  return (
    <main className='fixed inset-0 z-50 bg-brangus text-white flex items-center justify-center gap-12 xl:gap-24 p-12 xl:p-16 select-none overflow-hidden'>
      {/* Columna izquierda: mensaje de éxito y botón para volver */}
      <div className='flex-1 max-w-130 min-w-0 flex flex-col gap-6 xl:gap-7'>
        <span className='w-20 h-20 xl:w-26 xl:h-26 rounded-full bg-white text-brangus grid place-content-center'>
          <Check size={44} strokeWidth={2.6} aria-hidden='true' />
        </span>

        <h1 className='titulo text-7xl xl:text-8xl leading-[0.9]'>¡Pedido registrado!</h1>

        <p className='text-[22px] xl:text-[26px] leading-snug'>
          Tu ticket se está imprimiendo. Recógelo y preséntalo en la barra del casino.
        </p>

        <div className='flex flex-wrap items-center gap-x-5 gap-y-3 mt-2'>
          <button
            type='button'
            onClick={onVolver}
            className='h-16 xl:h-18 px-7 xl:px-9 rounded-xl bg-white text-tinta text-xl xl:text-[22px] font-bold flex items-center gap-3 cursor-pointer hover:bg-fondo transition-colors'
          >
            <House size={24} strokeWidth={2.4} aria-hidden='true' />
            Volver al inicio
          </button>

          <span className='text-lg'>Regresa solo en {restante} s</span>
        </div>
      </div>

      {/* Tarjeta con el resumen del ticket */}
      <section
        aria-label='Resumen del ticket'
        className='w-95 xl:w-105 shrink-0 px-7 py-8 xl:px-8 xl:py-9 rounded-xl bg-white text-tinta flex flex-col gap-5 shadow-[0_30px_60px_rgba(60,0,0,0.35)]'
      >
        {/* Logo y número de consecutivo */}
        <div className='flex items-center justify-between'>
          <img src={logo} alt='Brangus' className='h-11 w-auto' />
          <div className='flex flex-col items-end'>
            <span className='text-sm font-bold tracking-[0.12em] uppercase text-suave'>Ticket</span>
            <span className='text-2xl xl:text-[28px] font-extrabold'>#{ticket.consecutivo}</span>
          </div>
        </div>

        {/* Datos del usuario (el documento ya viene enmascarado) y fecha */}
        <div className='flex flex-col gap-1 pb-4.5 border-b-2 border-dashed border-[#D9D2CB]'>
          <span className='text-xl font-bold'>{ticket.nombre}</span>
          <span className='text-base text-suave'>C.C. {ticket.documento} · {ticket.fecha}</span>
        </div>

        {/* Productos del pedido (con scroll si son muchos) */}
        <ul className='flex flex-col gap-3 text-lg max-h-56 overflow-y-auto no-scrollbar'>
          {ticket.detalles.map((d, i) => (
            <li key={i} className='flex justify-between gap-4'>
              <span className='min-w-0'>{d.cantidad} × {d.producto}</span>
              <span className='font-bold whitespace-nowrap'>${formatPrecio(d.total)}</span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className='flex items-baseline justify-between gap-4 pt-4.5 border-t-2 border-dashed border-[#D9D2CB]'>
          <span className='text-xl font-semibold'>Total</span>
          <span className='text-4xl xl:text-[40px] leading-none font-extrabold' style={{ fontStretch: '85%' }}>
            ${formatPrecio(total)}
          </span>
        </div>
      </section>
    </main>
  )
}

export default PedidoRegistrado
