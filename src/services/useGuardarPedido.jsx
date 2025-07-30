import { useGenerarTicketPDF } from '../hooks/useGenerarTicketPDF'
import { logoBase64 } from '../utils/logoBase64'

function useGuardarPedido ({ usuario, total, pedido, toast }) {
  const URL = 'https://carnesbrangus.com/casino2/pedidos/webserviceapp.php?case=1'

  const generarPDF = (datos) => {
    // Formatea la fecha actual al formato DD/MM/AAAA
    const hoy = new Date()

    const dia = hoy.getDate()
    const mes = hoy.getMonth() + 1 // Los meses van de 0 a 11 (posición en arrays)
    const año = hoy.getFullYear()

    const fechaFormateada = `${dia}/${mes}/${año}`

    // Establece los datos a imprimir en el recibo
    const datosPDF = {
      detalles: datos.map(producto => ({
        cantidad: String(producto.cantidad),
        producto: producto.producto,
        total: String(producto.total),
        totalPedido: String(producto.totalPedido)
      })),
      nombre: usuario.nombre,
      documento: usuario.documento,
      fecha: fechaFormateada,
      consecutivo: datos[0]?.idPedido,
      logoBase64 // o 'data:image/png;base64,...'
    }

    useGenerarTicketPDF(datosPDF)
  }

  const guardarPedido = async () => {
    try {
      const formData = new FormData()

      formData.append('usuario', usuario.id)
      formData.append('total', total)
      formData.append('detalle', JSON.stringify(pedido))

      const res = await fetch(URL, {
        method: 'POST',
        body: formData
      })

      const response = await res.json()

      if (response.success) {
        generarPDF(response.data)
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
