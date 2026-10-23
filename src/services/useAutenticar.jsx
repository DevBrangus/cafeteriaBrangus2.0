import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../utils/alertas'

function useAutenticar({ menuId }) {
  const formRef = useRef(null)

  // Hook de navegar entre las paginas
  const navigate = useNavigate()

  const URL = 'https://carnesbrangus.com/casino/authentication/authenticate.php?case=1'

  const validarUsuario = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData(formRef.current)

      const documento = formData.get('documento')

      // Realiza la petición al servicio y espera una respuesta
      const res = await fetch(`${URL}&documento=${documento}`, {
        method: 'GET'
      })

      const response = await res.json()

      // Si la respuesta es exitosa redirige a la vista de pedidos
      // De lo contrario, muestra una notificación de error
      if (response.success) {
        sessionStorage.setItem("usuario", JSON.stringify(response.data));

        navigate(
          '/pedido',
          {
            state: {
              menuId,
              usuario: response.data
            }
          }
        )
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

  return {
    formRef,
    validarUsuario
  }
}

export default useAutenticar
