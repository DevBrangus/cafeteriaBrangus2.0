/**
 * Campo de texto reutilizable con estilo de etiqueta flotante (usa la clase "peer"
 * para que un <label> hermano reaccione al foco y al contenido).
 *
 * Nota: con el rediseño ya no lo usan las vistas principales; solo lo usa ModalCantidad.
 *
 * @param {object} props
 * @param {string} props.type - Tipo de input. Con 'password' solo se permiten números
 * @param {string} props.name - Nombre e id del campo
 * @param {string} [props.placeholder]
 * @param {string} [props.defaultValue]
 * @param {string|number} [props.min]
 * @param {boolean} [props.autoFocus]
 * @param {object} [props.referencia] - Ref para leer el valor desde el componente padre
 * @param {Function} [props.onBlur] - Recibe el valor al perder el foco
 * @param {Function} [props.onChange] - Recibe el valor limpio en cada cambio
 */
export default function Input ({
  type,
  name,
  placeholder,
  defaultValue,
  min,
  autoFocus,
  referencia,
  onBlur = () => { },
  onChange = () => { }
}) {
  const handleInput = (e) => {
    // Si el tipo es password y se requiere solo números
    if (type === 'password') {
      e.target.value = e.target.value.replace(/\D/g, '') // Elimina todo lo que no sea dígito
    }
    onChange(e.target.value) // Notifica el cambio limpio
  }

  return (
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      min={min}
      ref={referencia}
      onBlur={(e) => onBlur(e.target.value)}
      onChange={handleInput}
      // En celulares y tabletas abre el teclado numérico para el documento
      inputMode={type === 'password' ? 'numeric' : undefined}
      pattern={type === 'password' ? '[0-9]*' : undefined}
      autoFocus={autoFocus}
      autoComplete='off'
      className='peer placeholder-transparent w-full border-2 border-slate-700 p-2 rounded-lg outline-none focus:border-violet-500 transition-colors'
    />
  )
}
