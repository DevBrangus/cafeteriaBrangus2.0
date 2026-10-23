/**
 * Servicio que registra el pedido en el servidor e imprime el ticket.
 *
 * Flujo:
 *   1. guardarPedido() envía el usuario, el total y el detalle del pedido.
 *   2. Si el servidor responde bien, generarPDF() arma los datos del ticket,
 *      muestra la pantalla de carga e imprime el ticket con pdfmake.
 *   3. Al terminar la impresión, entrega los datos del ticket a `alTerminar`
 *      (pantalla PedidoRegistrado). Si no se pasa `alTerminar`, vuelve al inicio con `salir`.
 *
 * @param {object} params
 * @param {object} params.usuario - Usuario autenticado { id, nombre, documento }
 * @param {number} params.total - Valor total del pedido
 * @param {Array} params.pedido - Productos del pedido { id, nombre, precio, cantidad, total }
 * @param {Function} params.toast - Función para mostrar alertas
 * @param {Function} params.setCargandoPDF - Muestra u oculta la pantalla de carga
 * @param {Function} params.salir - Limpia el pedido y vuelve al inicio
 * @param {Function} [params.alTerminar] - Recibe los datos del ticket cuando termina la impresión
 * @returns {{ guardarPedido: Function }}
 */
import { useGenerarTicketPDF } from '../hooks/useGenerarTicketPDF'
import { logoBase64 } from '../utils/logoBase64'

function useGuardarPedido ({ usuario, total, pedido, toast, setCargandoPDF, salir, alTerminar }) {
  // Servicio PHP que registra el pedido
  const URL = 'https://carnesbrangus.com/casino/pedidos/webserviceapp.php?case=1'

  /**
   * Arma los datos del ticket con la respuesta del servidor y lo imprime.
   * @param {Array} datos - Detalle devuelto por el servidor: [{ cantidad, producto, total, totalPedido, idPedido }]
   */
  const generarPDF = (datos) => {
    setCargandoPDF(true)

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
      // Oculta el documento dejando visibles solo los últimos 4 dígitos (******3452)
      documento: usuario.documento.replace(/\d(?=\d{4})/g, '*'),
      fecha: fechaFormateada,
      // Todos los detalles traen el mismo id de pedido: se toma el del primero
      consecutivo: datos[0]?.idPedido,
      logoBase64
    }

    useGenerarTicketPDF(datosPDF, () => {
      setCargandoPDF(false)
      // Si la vista quiere mostrar la confirmación, le entrega los datos del ticket;
      // de lo contrario vuelve al inicio como antes
      if (alTerminar) alTerminar(datosPDF)
      else setTimeout(() => salir(), 100)
    }) // el callback indica que terminó
  }

  /**
   * Envía el pedido al servidor. Se llama al confirmar en el modal de Pedidos.
   */
  const guardarPedido = async () => {
    try {
      // Añade los datos de la petición a un FormData para ser enviados
      const formData = new FormData()

      formData.append('usuario', usuario.id)
      formData.append('total', total)
      formData.append('detalle', JSON.stringify(pedido))

      // Realiza la petición al servicio y espera una respuesta
      const res = await fetch(URL, {
        method: 'POST',
        body: formData
      })

      const response = await res.json()

      // Si la respuesta es exitosa crea el ticket
      // De lo contrario, muestra una notificación de error
      if (response.success) {
        generarPDF(response.data)
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

  return { guardarPedido }
}

export default useGuardarPedido
