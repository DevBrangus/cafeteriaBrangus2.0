import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/App.css'
import desayuno from '../assets/desayuno.jpg'
import almuerzo from '../assets/almuerzo.jpg'
import logo from '../assets/logo.png'
import Input from '../components/Input'

function App() {
  // Estados para guardar el id del menú y el documento del usuario
  const [menuId, setMenuId] = useState(null)
  const [documento, setDocumento] = useState(null)
  // Estado para controlar la visibilidad del modal para verificar el usuario
  const [mostrarModal, setMostrarModal] = useState(false)
  // Hook de navegar entre las paginas
  const navigate = useNavigate()

  // Redirige a la pagina de pedidos
  const handleClic = (menuId) => {
    setMenuId(menuId)
    setMostrarModal(true)
  }

  return (
    <>
      <main className='w-screen max-w-screen h-full max-h-screen overflow-hidden flex select-none'>
        <div className='absolute top-0 left-1/2 z-50 -translate-x-1/2 w-72 p-8 bg-white flex flex-col items-center gap-4 rounded-b-4xl'>
          <img src={logo} alt='Logo Brangus' />
          <span className='text-[#C60000] text-4xl font-extrabold'>CASINO</span>
        </div>

        {/* Menús a seleccionar */}
        <article
          onClick={() => handleClic(2)}
          className='flex-1 relative group cursor-pointer overflow-hidden'
        >
          <img src={almuerzo} alt='Imagen representativa de almuerzo' className='h-screen w-full object-cover transition-transform group-hover:scale-110' />
          <div className='absolute w-full h-full top-0 left-0 bg-[#000000aa] grid place-content-center'>
            <span className='text-6xl font-bold text-white'>Almuerzo</span>
          </div>
        </article>

        <article
          onClick={() => handleClic(1)}
          className='flex-1 relative group cursor-pointer overflow-hidden'
        >
          <img src={desayuno} alt='Imagen representativa de desayuno' className='h-screen w-full object-cover transition-transform group-hover:scale-110' />
          <div className='absolute w-full h-full top-0 left-0 bg-[#000000aa] grid place-content-center'>
            <span className='text-6xl font-bold text-white'>Desayuno</span>
          </div>
        </article>
      </main>

      {/* Modal para validar el usuario e iniciar un pedido */}
      {mostrarModal && (
        <div className='absolute top-0 left-0 w-screen h-screen grid place-content-center bg-[#000000aa]'>
          <section className='bg-white p-5 rounded-2xl flex flex-col gap-5'>
            <header className='flex justify-between items-center gap-10 mb-4'>
              <span className='text-[#C60000] font-semibold text-4xl'>Validación de usuario</span>
              <span onClick={() => setMostrarModal(false)} className='cursor-pointer'>✖️</span>
            </header>
            <form>
              <Input type='password' name='documento' placeholder='' onBlur={setDocumento} />
              <label htmlFor='documento'>Ingrese su documento de identidad</label>
            </form>
            <footer>
              <button
                type='button'
                className='w-full bg-[#C60000] p-3 text-2xl text-white font-semibold rounded-xl cursor-pointer hover:bg-[#910000] transition-colors active:outline-2 active:outline-[#4d0000]'
                onClick={() => navigate(
                  '/pedido',
                  {
                    state: {
                      menuId
                    }
                  }
                )}
              >
                Validar Documento
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  )
}

export default App
