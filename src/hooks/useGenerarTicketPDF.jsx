import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

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
      logoBase64 && {
        image: logoBase64,
        width: 50,
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      { text: 'Casino Brangus', alignment: 'center', fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
      { text: `Fecha: ${fecha}`, fontSize: 6 },
      { text: `Nombre: ${nombre}`, fontSize: 6 },
      { text: `Documento: ${documento}`, fontSize: 6 },
      { text: `Consecutivo: ${consecutivo}`, fontSize: 6, margin: [0, 0, 0, 5] },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.5 }],
        margin: [0, 0, 0, 5]
      },
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
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.5 }],
        margin: [0, 0, 0, 5]
      },
      { text: '¡Un placer atenderle!', alignment: 'center', fontSize: 5, bold: true }
    ]
  }

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
