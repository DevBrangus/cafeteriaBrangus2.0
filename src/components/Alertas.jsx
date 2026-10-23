/**
 * Componente que dibuja las alertas del sistema propio (src/utils/alertas.js).
 *
 * Se monta una sola vez en main.jsx. Escucha la lista de alertas con
 * useSyncExternalStore, así cualquier llamada a toast() desde cualquier
 * archivo hace que aparezca una alerta aquí.
 */
import { useSyncExternalStore } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { cerrar, obtenerAlertas, pausar, reanudar, suscribir } from '../utils/alertas'

// Apariencia de cada tipo de alerta: título por defecto, ícono, colores del ícono y de la barra de tiempo
const TIPOS = {
  error: { titulo: 'Algo salió mal', Icono: CircleAlert, icono: 'bg-brangus text-white', barra: 'bg-brangus' },
  success: { titulo: 'Listo', Icono: CircleCheck, icono: 'bg-tinta text-white', barra: 'bg-tinta' },
  warning: { titulo: 'Atención', Icono: TriangleAlert, icono: 'bg-[#FCE7E7] text-brangus', barra: 'bg-brangus' },
  info: { titulo: 'Información', Icono: Info, icono: 'bg-panel text-tinta', barra: 'bg-tenue' }
}

/**
 * Una alerta individual.
 * @param {object} props
 * @param {object} props.alerta - Alerta del store: { id, mensaje, tipo, titulo, autoClose, restante, pausada, saliendo }
 */
function Alerta ({ alerta }) {
  const { titulo, Icono, icono, barra } = TIPOS[alerta.tipo]

  return (
    <div
      // Los errores y advertencias se anuncian de inmediato a lectores de pantalla
      role={alerta.tipo === 'error' || alerta.tipo === 'warning' ? 'alert' : 'status'}
      // El tiempo se pausa mientras se pasa el mouse o se toca la alerta
      onPointerEnter={() => pausar(alerta.id)}
      onPointerLeave={() => reanudar(alerta.id)}
      onPointerDown={() => pausar(alerta.id)}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-xl bg-white text-tinta
        shadow-[0_18px_40px_rgba(27,23,20,0.18)] ring-1 ring-linea
        ${alerta.saliendo ? 'alerta-salida' : 'alerta-entrada'}`}
    >
      <div className='flex items-center gap-4 pl-4 pr-2 py-4'>
        {/* Ícono según el tipo */}
        <span className={`w-12 h-12 shrink-0 rounded-full grid place-content-center ${icono}`}>
          <Icono size={26} strokeWidth={2.2} aria-hidden='true' />
        </span>

        {/* Título (personalizado o el del tipo) y mensaje */}
        <div className='flex-1 min-w-0 flex flex-col'>
          <span className='text-sm font-bold tracking-[0.12em] uppercase text-suave'>
            {alerta.titulo ?? titulo}
          </span>
          <span className='text-xl font-semibold leading-snug wrap-break-word'>{alerta.mensaje}</span>
        </div>

        {/* Botón para cerrar la alerta */}
        <button
          type='button'
          onClick={() => cerrar(alerta.id)}
          aria-label='Cerrar alerta'
          className='w-11 h-11 shrink-0 rounded-full grid place-content-center text-tenue cursor-pointer hover:bg-fondo hover:text-tinta transition-colors'
        >
          <X size={22} strokeWidth={2.4} aria-hidden='true' />
        </button>
      </div>

      {/* Barra de tiempo restante (solo si la alerta se cierra sola).
          La "key" cambia al pausar/reanudar para reiniciar la animación desde
          el punto en que quedó (--desde = fracción de tiempo que falta). */}
      {alerta.autoClose && (
        <span
          key={alerta.pausada ? 'pausada' : 'corriendo'}
          className={`absolute left-0 bottom-0 h-1 w-full origin-left ${barra} alerta-barra`}
          style={{
            animationDuration: `${alerta.restante}ms`,
            animationPlayState: alerta.pausada ? 'paused' : 'running',
            '--desde': alerta.restante / alerta.autoClose
          }}
        />
      )}
    </div>
  )
}

// Contenedor de alertas: se monta una sola vez en main.jsx
export default function Alertas () {
  // Se vuelve a dibujar cada vez que el store de alertas cambia
  const alertas = useSyncExternalStore(suscribir, obtenerAlertas)

  return (
    // Columna fija arriba al centro; no bloquea los toques en la pantalla
    // (pointer-events-none), salvo sobre las propias alertas
    <div
      aria-live='polite'
      className='fixed top-5 left-1/2 -translate-x-1/2 z-60 w-[min(560px,calc(100vw-40px))] flex flex-col gap-3 pointer-events-none select-none'
    >
      {alertas.map(alerta => <Alerta key={alerta.id} alerta={alerta} />)}
    </div>
  )
}
