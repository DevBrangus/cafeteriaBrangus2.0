export default function ModalConfirmacion({
  mostrar,
  setMostrar,
  mensaje,
  accion
}) {
  return (
    <>
      {mostrar && (
        <div className='absolute top-0 left-0 w-screen h-screen bg-[#000000aa] grid place-content-center'>
          <section className='bg-white rounded-2xl flex flex-col gap-4 w-[440px]'>
            <header className='flex items-center justify-between p-4 border-b border-slate-300'>
              <span>Confirmación</span>
              <div className="rounded-full hover:bg-slate-200 transition-colors cursor-pointer p-1 grid place-content-center" onClick={() => setMostrar(false)}>
                <svg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' >
                  <line x1='10' y1='10' x2='25' y2='25' stroke='#94a3b8' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                  <line x1='10' y1='25' x2='25' y2='10' stroke='#94a3b8' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </div>
            </header>

            <article className='text-2xl text-center px-4'>
              {mensaje && mensaje}
            </article>
            
            <footer className='flex justify-between gap-4 px-4 pb-4 mt-4'>
              <button
                type='button'
                className='flex-1 py-2 bg-[#26723B] text-white text-2xl font-semibold rounded-xl cursor-pointer hover:bg-[#005f1b] transition-colors'
                onClick={accion}
              >
                Si
              </button>
              <button
                type='button'
                className='flex-1 py-2 bg-[#C60000] text-white text-2xl font-semibold rounded-xl cursor-pointer hover:bg-[#910000] transition-colors'
                onClick={() => setMostrar(false)}
              >
                No
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  )
}
