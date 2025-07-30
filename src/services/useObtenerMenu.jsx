import { useEffect, useState } from 'react'

function useObtenerMenu ({ menuId, toast }) {
  const [productos, setProductos] = useState([])

  const URL = 'https://carnesbrangus.com/casino2/productos/webserviceapp.php?case=1'

  const obtenerMenu = async () => {
    try {
      const res = await fetch(`${URL}&menu=${menuId}`)

      const response = await res.json()

      if (response.success) {
        setProductos(response.data)
      }

      if (response.error) {
        toast(response.error, {
          type: 'error'
        })
      }
    } catch (error) {
      console.error(error)
      toast('Ocurrió un error en la petición', {
        type: 'error'
      })
    }
  }

  useEffect(() => {
    obtenerMenu()
  }, [])

  return { productos }
}

export default useObtenerMenu
