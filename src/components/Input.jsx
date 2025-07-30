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
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      autoComplete='none'
      className='peer placeholder-transparent w-full border-2 border-slate-700 p-2 rounded-lg outline-none focus:border-violet-500 transition-colors'
    />
  )
}
