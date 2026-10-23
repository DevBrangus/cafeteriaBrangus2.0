/**
 * Servicio de autenticación por documento de identidad.
 *
 * Expone un ref para el formulario y la función que lo envía. Al validar:
 *   - Si el documento existe, guarda el usuario en sessionStorage (se borra
 *     al cerrar la pestaña) y navega a /pedido con el menú elegido.
 *   - Si no, muestra una alerta con el error que devuelve el servidor.
 *
 * @param {object} params
 * @param {number} params.menuId - Id del menú elegido (1 desayuno, 2 almuerzo)
 * @returns {{ formRef: object, validarUsuario: Function }}
 */
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../utils/alertas'

function useAutenticar({ menuId }) {
  // Referencia al <form>; de ahí se lee el campo "documento"
  const formRef = useRef(null)

  // Hook de navegar entre las paginas
  const navigate = useNavigate()

  // Servicio PHP que valida el documento
  const URL = 'https://carnesbrangus.com/casino/authentication/authenticate.php?case=1'

  /**
   * onSubmit del formulario: valida el documento contra el servidor.
   * @param {Event} e - Evento submit del formulario
   */
  const validarUsuario = async (e) => {
    // Evita que el navegador recargue la página al enviar el formulario
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
        // Guarda el usuario para la vista de pedidos (solo dura mientras la pestaña esté abierta)
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
      // Error de red o respuesta que no es JSON
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
