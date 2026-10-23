// Sistema de alertas propio del casino (reemplaza a react-toastify).
//
// Uso (misma forma que antes):
//   toast('Mensaje')                          -> alerta informativa
//   toast('Mensaje', { type: 'error' })       -> 'error' | 'success' | 'warning' | 'info'
//   toast.error('Mensaje') / toast.success(…) / toast.warning(…) / toast.info(…)
//   toast('Mensaje', { autoClose: 6000 })     -> milisegundos visible (false = no se cierra sola)
//   toast.dismiss(id)                         -> cierra una alerta (sin id cierra todas)
//
// Las alertas se dibujan con el componente <Alertas />, montado una sola vez en main.jsx.

const DURACION = 4000 // ms que dura una alerta en pantalla
const MAXIMO = 3 // alertas visibles al mismo tiempo
const SALIDA = 250 // ms de la animación de salida

// Estado interno del módulo (vive fuera de React)
let alertas = [] // Alertas visibles, en orden de llegada
let siguienteId = 1 // Id incremental para cada alerta nueva
const suscriptores = new Set() // Funciones que avisan a <Alertas /> que hubo cambios
const temporizadores = new Map() // id -> { inicio, restante, timer } de cada cierre automático

// Crea una copia nueva de la lista (para que React detecte el cambio) y avisa a los suscriptores
const emitir = () => {
  alertas = [...alertas]
  suscriptores.forEach(fn => fn())
}

// Usado por useSyncExternalStore en <Alertas />: registra un suscriptor y devuelve cómo quitarlo
export const suscribir = (fn) => {
  suscriptores.add(fn)
  return () => suscriptores.delete(fn)
}

// Usado por useSyncExternalStore: devuelve la lista actual
export const obtenerAlertas = () => alertas

// Elimina la alerta de la lista (después de la animación de salida)
const quitar = (id) => {
  alertas = alertas.filter(a => a.id !== id)
  emitir()
}

// Programa el cierre automático con el tiempo que le queda a la alerta
const programarCierre = (alerta) => {
  if (!alerta.autoClose) return
  temporizadores.set(alerta.id, {
    inicio: Date.now(),
    restante: alerta.restante,
    timer: setTimeout(() => cerrar(alerta.id), alerta.restante)
  })
}

// Cierra con animación de salida
export const cerrar = (id) => {
  const t = temporizadores.get(id)
  if (t) clearTimeout(t.timer)
  temporizadores.delete(id)

  const alerta = alertas.find(a => a.id === id)
  if (!alerta || alerta.saliendo) return

  alertas = alertas.map(a => (a.id === id ? { ...a, saliendo: true } : a))
  emitir()
  setTimeout(() => quitar(id), SALIDA)
}

// Pausa el cierre automático (mientras se toca o se pasa el mouse por encima)
export const pausar = (id) => {
  const t = temporizadores.get(id)
  if (!t) return
  clearTimeout(t.timer)
  // Guarda cuánto tiempo le faltaba (mínimo medio segundo)
  const restante = Math.max(t.restante - (Date.now() - t.inicio), 500)
  temporizadores.delete(id)
  alertas = alertas.map(a => (a.id === id ? { ...a, pausada: true, restante } : a))
  emitir()
}

// Reanuda el cierre automático con el tiempo que le quedaba
export const reanudar = (id) => {
  const alerta = alertas.find(a => a.id === id)
  if (!alerta || !alerta.pausada || alerta.saliendo) return
  alertas = alertas.map(a => (a.id === id ? { ...a, pausada: false } : a))
  emitir()
  programarCierre(alertas.find(a => a.id === id))
}

/**
 * Muestra una alerta.
 * @param {string} mensaje - Texto de la alerta
 * @param {object} [opciones]
 * @param {'error'|'success'|'warning'|'info'} [opciones.type='info'] - Tipo de alerta
 * @param {number|false} [opciones.autoClose=4000] - Milisegundos visible; false = no se cierra sola
 * @param {string} [opciones.title] - Título personalizado (por defecto, el del tipo)
 * @returns {number} Id de la alerta (sirve para cerrarla con toast.dismiss)
 */
export function toast (mensaje, opciones = {}) {
  const tipo = ['error', 'success', 'warning', 'info'].includes(opciones.type) ? opciones.type : 'info'
  const autoClose = opciones.autoClose === false ? false : (opciones.autoClose ?? DURACION)

  // Si ya hay una alerta igual visible, no la repite
  const repetida = alertas.find(a => a.mensaje === mensaje && a.tipo === tipo && !a.saliendo)
  if (repetida) return repetida.id

  // Datos de la nueva alerta
  const alerta = {
    id: siguienteId++,
    mensaje,
    tipo,
    titulo: opciones.title,
    autoClose,
    restante: autoClose || 0,
    pausada: false,
    saliendo: false
  }

  alertas = [...alertas, alerta]

  // Si se pasa del máximo, cierra la más antigua
  const visibles = alertas.filter(a => !a.saliendo)
  if (visibles.length > MAXIMO) cerrar(visibles[0].id)

  emitir()
  programarCierre(alerta)
  return alerta.id
}

// Atajos por tipo: toast.error('...'), toast.success('...'), etc.
toast.error = (mensaje, opciones) => toast(mensaje, { ...opciones, type: 'error' })
toast.success = (mensaje, opciones) => toast(mensaje, { ...opciones, type: 'success' })
toast.warning = (mensaje, opciones) => toast(mensaje, { ...opciones, type: 'warning' })
toast.info = (mensaje, opciones) => toast(mensaje, { ...opciones, type: 'info' })
// Cierra una alerta por id, o todas si no se pasa id
toast.dismiss = (id) => {
  if (id === undefined) alertas.forEach(a => cerrar(a.id))
  else cerrar(id)
}

export default toast
