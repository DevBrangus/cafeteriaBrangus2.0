/**
 * Genera el ticket del pedido en PDF (formato de impresora térmica de 58 mm)
 * con pdfmake y abre el diálogo de impresión.
 *
 * Aunque se llama "use...", no es un hook de React: es una función normal
 * que se puede llamar desde cualquier lugar.
 *
 * @param {object} data - Datos del ticket
 * @param {Array} data.detalles - [{ cantidad, producto, total, totalPedido }]
 * @param {string} data.nombre - Nombre del usuario
 * @param {string} data.documento - Documento enmascarado
 * @param {string} data.fecha - Fecha DD/MM/AAAA
 * @param {number|string} data.consecutivo - Número del pedido
 * @param {string} [data.logoBase64] - Logo en base64 para la cabecera
 * @param {Function} [onFinish] - Se llama después de lanzar la impresión
 */
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

// Registra las fuentes incluidas en pdfmake (la ruta cambia según la versión del paquete)
pdfMake.vfs = pdfFonts.default?.vfs || pdfFonts.pdfMake?.vfs

export const useGenerarTicketPDF = (data, onFinish = () => { }) => {
  const { detalles, nombre, documento, fecha, consecutivo, logoBase64 } = data

  // Crea una fila para cada producto en el pedido del usuario
  const rows = detalles.map((detalle) => ([
    { text: detalle.cantidad, fontSize: 7, alignment: 'center' },
    { text: detalle.producto, fontSize: 7 },
    { text: `$ ${parseFloat(detalle.total).toLocaleString('es-CO')}`, fontSize: 7, alignment: 'right' }
  ]))

  // Define el cuerpo del ticket
  const docDefinition = {
    pageSize: { width: 140, height: 600 }, // 58mm aprox
    pageMargins: [10, 10, 10, 10],
    content: [
      // Logo (solo si se envió)
      logoBase64 && {
        image: logoBase64,
        width: 50,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      // Título y datos del pedido
      { text: 'Casino Brangus', alignment: 'center', fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
      { text: `Fecha: ${fecha}`, fontSize: 6 },
      { text: `Nombre: ${nombre}`, fontSize: 6 },
      { text: `Documento: ${documento}`, fontSize: 6 },
      { text: `Consecutivo: ${consecutivo}`, fontSize: 6, margin: [0, 0, 0, 5] },
      // Línea separadora
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.5 }],
        margin: [0, 0, 0, 5]
      },
      // Tabla de productos: cantidad | producto | valor
      {
        table: {
          widths: [20, '*', 35],
          body: [
            [
              { text: 'Cant', bold: true, fontSize: 6 },
              { text: 'Producto', bold: true, fontSize: 6 },
              { text: 'Valor', bold: true, fontSize: 6, alignment: 'right' }
            ],
            ...rows
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 5]
      },
      // Total del pedido (viene repetido en cada detalle; se toma el del primero)
      {
        columns: [
          { text: 'Total Ticket', fontSize: 8, bold: true, alignment: 'right' },
          {
            text: `$ ${parseFloat(detalles[0].totalPedido).toLocaleString('es-CO')}`,
            fontSize: 8,
            bold: true,
            alignment: 'right',
            margin: [10, 0, 0, 0]
          }
        ],
        margin: [0, 0, 0, 10]
      },
      // Línea separadora
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.5 }],
        margin: [0, 0, 0, 5]
      },
      // Mensaje final
      { text: '¡Un placer atenderle!', alignment: 'center', fontSize: 5, bold: true }
    ]
  }

  // Genera el PDF, lo carga en un iframe oculto y lanza la impresión desde ahí
  pdfMake.createPdf(docDefinition).getBlob((blob) => {
    const blobUrl = URL.createObjectURL(blob)
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = blobUrl
    document.body.appendChild(iframe)

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        onFinish()
      }, 100) // delay para asegurar que cargue
    }
  })
}
