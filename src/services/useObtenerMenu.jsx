/**
 * Servicio que trae los productos del menú elegido al montar la vista de pedido.
 *
 * Cada producto llega con la forma { id, producto, valor, img }.
 * Si el servidor responde con error, o falla la petición, muestra una alerta.
 *
 * @param {object} params
 * @param {number} params.menuId - Id del menú (1 desayuno, 2 almuerzo)
 * @param {Function} params.toast - Función para mostrar alertas
 * @returns {{ productos: Array }}
 */
import { useEffect, useState } from 'react'

function useObtenerMenu({ menuId, toast }) {
  // Productos del menú (lista vacía mientras carga)
  const [productos, setProductos] = useState([])

  // Servicio PHP que devuelve los productos de un menú
  const URL = 'https://carnesbrangus.com/casino/productos/webserviceapp.php?case=1'

  const obtenerMenu = async () => {
    try {
      // Realiza la petición al servicio y espera una respuesta
      const res = await fetch(`${URL}&menu=${menuId}`)

      const response = await res.json()

      // Si la respuesta es exitosa muestra los productos del menú
      // De lo contrario, muestra una notificación de error
      if (response.success) {
        setProductos(response.data)
      }

      if (response.error) {
        toast(response.error, {
          type: 'error'
        })
      }
    } catch (error) {
      // Error de red o respuesta que no es JSON
      console.error(error)
      toast('Ocurrió un error en la petición', {
        type: 'error'
      })
    }
  }

  // Pide los productos una sola vez, al montar la vista
  useEffect(() => {
    obtenerMenu()
  }, [])

  return { productos }
}

export default useObtenerMenu
