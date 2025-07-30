import { useRef, useState } from 'react'
import Input from './Input'

function ModalCantidad ({
  mostrar,
  setMostrar,
  producto,
  accion
}) {
  // Referencia al input para obtener la cantidad ingresada
  const inputRef = useRef(null)

  const [cantidad, setCantidad] = useState('1')

  return (
    <>
      {mostrar && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            accion(
              producto.id,
              producto.nombre,
              producto.precio,
              inputRef.current.value,
              (parseInt(producto.precio) * parseInt(inputRef.current.value))
            )
          }}
          className='absolute top-0 left-0 w-screen h-screen bg-[#000000aa] grid place-content-center'
        >
          <section className='bg-white rounded-2xl flex flex-col gap-4 w-[440px]'>
            <header className='flex items-center justify-between p-4 border-b border-slate-300'>
              <span>Cantidad de {producto.nombre} a pedir</span>
              <div className='rounded-full hover:bg-slate-200 transition-colors cursor-pointer p-1 grid place-content-center' onClick={() => setMostrar(false)}>
                <svg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
                  <line x1='9' y1='9' x2='23' y2='23' stroke='#565F6B' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                  <line x1='9' y1='23' x2='23' y2='9' stroke='#565F6B' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </div>
            </header>

            <div className='text-2xl text-center px-4 relative'>
              <Input
                type='number'
                name='cantidad'
                defaultValue='1'
                min='1'
                referencia={inputRef}
                placeholder='Ingrese la cantidad a pedir'
                onChange={setCantidad}
              />
              <label
                htmlFor='cantidad'
                className='
                  absolute ml-8 px-1 left-0 bg-white text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-8px] top-[-8px] peer-placeholder-shown:top-3.5
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-gray-500
                  peer-focus:text-sm peer-focus:text-violet-500
                  cursor-text
                '
              >
                Ingrese la cantidad a pedir
              </label>
            </div>

            <footer className='flex justify-between gap-4 px-4 pb-4 mt-4'>
              <button
                type='submit'
                disabled={!cantidad || parseInt(cantidad) <= 0}
                className={`flex-1 py-2 text-white text-2xl font-semibold rounded-xl transition-colors
                  ${!cantidad || parseInt(cantidad) <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#26723B] hover:bg-[#005f1b] cursor-pointer'}
                `}
              >
                Aceptar
              </button>
              <button
                type='button'
                className='flex-1 py-2 bg-[#C60000] text-white text-2xl font-semibold rounded-xl cursor-pointer hover:bg-[#910000] transition-colors'
                onClick={() => setMostrar(false)}
              >
                Cancelar
              </button>
            </footer>
          </section>
        </form>
      )}
    </>
  )
}

export default ModalCantidad
