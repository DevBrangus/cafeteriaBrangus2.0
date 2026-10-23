/**
 * Pantalla de carga a pantalla completa.
 * Se muestra mientras se registra el pedido y se genera e imprime el ticket.
 */
import { ScaleLoader } from 'react-spinners'
import logo from '../assets/logo.png'

function Cargando () {
  return (
    <div className='fixed inset-0 z-50 bg-fondo flex flex-col items-center justify-center gap-10 select-none'>
      <img src={logo} alt='Logo Brangus' className='w-64 h-auto' />
      {/* Animación de barras en el rojo de la marca */}
      <ScaleLoader height={50} width={6} radius={100} color='#C60000' speedMultiplier={0.5} />
      <span className='titulo text-4xl text-tinta'>Registrando tu pedido…</span>
    </div>
  )
}

export default Cargando
