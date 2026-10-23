import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Delete } from 'lucide-react'
import desayuno from '../assets/desayuno.jpg'
import almuerzo from '../assets/almuerzo.jpg'
import logo from '../assets/logo.png'
import useAutenticar from '../services/useAutenticar'
import { toast } from '../utils/alertas'

// Menús disponibles. "horario" es opcional: si se llena, se muestra como etiqueta sobre la foto
const MENUS = [
  { id: 2, nombre: 'Almuerzo', imagen: almuerzo, horario: null },
  { id: 1, nombre: 'Desayuno', imagen: desayuno, horario: null }
]

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function App() {
  useEffect(() => {
    sessionStorage.removeItem('usuario')
  }, [])

  // Menú seleccionado (null = pantalla de inicio)
  const [menu, setMenu] = useState(null)
  // Documento digitado en el teclado
  const [documento, setDocumento] = useState('')

  const { formRef, validarUsuario } = useAutenticar({ menuId: menu?.id, toast })

  const seleccionarMenu = (menuSeleccionado) => {
    setDocumento('')
    setMenu(menuSeleccionado)
  }

  const teclear = (digito) => setDocumento(prev => (prev + digito).slice(0, 15))
  const borrar = () => setDocumento(prev => prev.slice(0, -1))

  return (
    <>
      {!menu
        ? (
          // Pantalla 1: elegir menú
          <main className='w-full h-dvh flex bg-fondo text-tinta select-none overflow-hidden'>
            <aside className='w-80 xl:w-105 shrink-0 bg-white p-10 xl:p-12 flex flex-col justify-center gap-10 xl:gap-12'>
              <img src={logo} alt='Agrovillamaria Brangus' className='w-52 xl:w-64 h-auto' />

              <div className='flex flex-col gap-4'>
                <span className='text-sm xl:text-base font-bold tracking-[0.18em] uppercase text-brangus'>Casino</span>

                <h1 className='titulo text-[56px] xl:text-7xl'>¿Qué vas a pedir hoy?</h1>

                <p className='text-lg xl:text-[22px] leading-snug text-suave'>
                  Toca el menú, valida tu documento y arma tu pedido en menos de un minuto.
                </p>
              </div>
            </aside>

            <section className='flex-1 min-w-0 p-6 xl:p-10 grid grid-cols-2 gap-5 xl:gap-8'>
              {MENUS.map((m) => (
                <button
                  key={m.id}
                  type='button'
                  onClick={() => seleccionarMenu(m)}
                  aria-label={`Pedir ${m.nombre.toLowerCase()}`}
                  className='group relative min-w-0 rounded-2xl overflow-hidden bg-tinta text-white text-left cursor-pointer focus-visible:outline-4 focus-visible:outline-brangus'
                >
                  <img
                    src={m.imagen}
                    alt=''
                    className='absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105'
                  />

                  <span className='absolute top-5 right-5 xl:top-7 xl:right-7 w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-brangus grid place-content-center transition-colors group-hover:bg-brangus-oscuro'>
                    <ArrowRight size={30} strokeWidth={2.4} aria-hidden='true' />
                  </span>

                  <div className='absolute inset-x-0 bottom-0 px-6 pb-6 pt-24 xl:px-9 xl:pb-9 flex flex-col gap-2.5 bg-linear-to-t from-[#120e0ceb] via-[#120e0c99] to-transparent'>
                    {m.horario && (
                      <span className='self-start px-3 py-1.5 rounded-full bg-white text-tinta text-sm font-bold tracking-wider uppercase'>
                        {m.horario}
                      </span>
                    )}

                    <span className='titulo text-[56px] xl:text-[88px] leading-[0.9]'>{m.nombre}</span>
                  </div>
                </button>
              ))}
            </section>
          </main>
        )
        : (
          // Pantalla 2: validar documento
          <main className='w-full h-dvh flex bg-fondo text-tinta select-none overflow-hidden'>
            <section className='relative w-[34%] xl:w-[38%] shrink-0 bg-tinta text-white overflow-hidden'>
              <img
                src={menu.imagen}
                alt=''
                className='absolute inset-0 w-full h-full object-cover opacity-55'
              />

              <div className='absolute inset-0 p-6 xl:p-10 flex flex-col justify-between'>
                <button
                  type='button'
                  onClick={() => setMenu(null)}
                  className='self-start h-14 pl-4 pr-5 rounded-full bg-white text-tinta text-lg font-bold flex items-center gap-2.5 cursor-pointer hover:bg-panel transition-colors'
                >
                  <ArrowLeft size={22} strokeWidth={2.4} aria-hidden='true' />
                  Cambiar menú
                </button>

                <div className='flex flex-col gap-2'>
                  <span className='text-sm xl:text-base font-bold tracking-[0.18em] uppercase'>Menú elegido</span>

                  <span className='titulo text-[64px] xl:text-[104px] leading-[0.9]'>{menu.nombre}</span>
                </div>
              </div>
            </section>

            <form
              ref={formRef}
              onSubmit={validarUsuario}
              className='flex-1 min-w-0 px-12 py-10 xl:px-24 flex flex-col justify-center gap-6 xl:gap-8'
            >
              <h1 className='titulo text-5xl xl:text-6xl'>Ingresa tu documento</h1>

              <div className='flex flex-col gap-2'>
                <label htmlFor='documento' className='text-base xl:text-lg font-semibold text-suave'>
                  Número de documento de identidad
                </label>

                <input
                  id='documento'
                  name='documento'
                  type='password'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  autoComplete='off'
                  autoFocus
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  className='w-full min-w-0 h-18 xl:h-22 px-6 border-[3px] border-tinta rounded-xl bg-white text-4xl xl:text-[44px] tracking-[0.3em] outline-none focus:border-brangus transition-colors'
                />
              </div>

              <div className='grid grid-cols-3 gap-3 xl:gap-3.5'>
                {TECLAS.map((n) => (
                  <button
                    key={n}
                    type='button'
                    onClick={() => teclear(n)}
                    className='h-17 xl:h-21 rounded-xl bg-white text-[32px] xl:text-4xl font-bold cursor-pointer hover:bg-panel active:scale-[0.97] transition'
                  >
                    {n}
                  </button>
                ))}

                <button
                  type='button'
                  onClick={borrar}
                  aria-label='Borrar'
                  className='h-17 xl:h-21 rounded-xl bg-panel grid place-content-center cursor-pointer hover:bg-linea active:scale-[0.97] transition'
                >
                  <Delete size={32} strokeWidth={2} aria-hidden='true' />
                </button>

                <button
                  type='button'
                  onClick={() => teclear('0')}
                  className='h-17 xl:h-21 rounded-xl bg-white text-[32px] xl:text-4xl font-bold cursor-pointer hover:bg-panel active:scale-[0.97] transition'
                >
                  0
                </button>

                <button
                  type='submit'
                  disabled={!documento}
                  className='h-17 xl:h-21 rounded-xl bg-brangus text-white text-xl xl:text-2xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-brangus-oscuro transition-colors disabled:bg-tenue disabled:cursor-not-allowed'
                >
                  Continuar
                  <ArrowRight size={24} strokeWidth={2.4} aria-hidden='true' />
                </button>
              </div>
            </form>
          </main>
        )}
    </>
  )
}

export default App
