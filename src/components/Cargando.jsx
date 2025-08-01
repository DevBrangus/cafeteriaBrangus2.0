import { MoonLoader } from 'react-spinners'
import logo from '../assets/logo.png'

function Cargando () {
  return (
    <div className='absolute top-0 left-0 w-screen h-screen bg-white grid place-content-center z-50'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-72 p-8 bg-white flex flex-col items-center gap-4 rounded-b-4xl'>
        <img src={logo} alt='Logo Brangus' />
        <span className='text-[#C60000] text-4xl font-extrabold'>CASINO</span>
      </div>
      <MoonLoader size={100} color='#C60000' speedMultiplier={0.5} />
    </div>
  )
}

export default Cargando
