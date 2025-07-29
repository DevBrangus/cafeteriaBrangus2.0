export default function Input ({
  type,
  name,
  placeholder,
  defaultValue,
  min,
  referencia,
  onBlur = () => { }
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
      autoComplete='none'
      className='w-full border-2 border-slate-700 p-2 rounded-lg outline-none focus:border-violet-500 transition-colors'
    />
  )
}
