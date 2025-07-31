export default function Input({
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
      e.target.value = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
    }
    onChange(e.target.value); // Notifica el cambio limpio
  };

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
      inputMode={type === 'password' ? 'numeric' : undefined}
      pattern={type === 'password' ? '[0-9]*' : undefined}
      autoFocus={autoFocus}
      autoComplete='off'
      className='peer placeholder-transparent w-full border-2 border-slate-700 p-2 rounded-lg outline-none focus:border-violet-500 transition-colors'
    />
  );
}
