import { useNavigate } from 'react-router-dom'

function useGuardarPedido ({ usuario, total, pedido, toast }) {
  const navigate = useNavigate()

  const URL = 'https://carnesbrangus.com/casino2/pedidos/webserviceapp.php?case=1'

  const datosPedido = {
    usuario,
    total,
    detalle: pedido
  }

  const guardarPedido = async () => {
    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
      })

      const response = await res.json()

      if (response.success) {
        navigate('/')
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

  return { guardarPedido }
}

export default useGuardarPedido
