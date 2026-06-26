// src/hooks/useGenerarTicketHtml.js

export const useGenerarTicketHtml = (data, printWindow) => {
  const { detalles, nombre, documento, fecha, consecutivo, logoBase64 } = data

  const formatoMoneda = (valor) => {
    return `$ ${parseFloat(valor || 0).toLocaleString('es-CO')}`
  }

  const limpiarTexto = (texto) => {
    return String(texto ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  const totalPedido = detalles[0]?.totalPedido || 0

  const filas = detalles.map((detalle) => `
    <tr>
      <td class="cantidad">${limpiarTexto(detalle.cantidad)}</td>
      <td class="producto">${limpiarTexto(detalle.producto)}</td>
      <td class="valor">${formatoMoneda(detalle.total)}</td>
    </tr>
  `).join('')

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Ticket Casino Brangus</title>

        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 58mm;
            font-family: Arial, sans-serif;
            color: #000;
            background: #fff;
          }

          body {
            padding: 8px;
          }

          .ticket {
            width: 100%;
          }

          .logo {
            width: 50px;
            display: block;
            margin: 0 auto 5px auto;
          }

          .titulo {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .info {
            font-size: 8px;
            margin-bottom: 2px;
            word-break: break-word;
          }

          .linea {
            border-top: 1px solid #000;
            margin: 6px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            font-size: 7px;
            text-align: left;
            font-weight: bold;
            padding-bottom: 3px;
          }

          td {
            font-size: 7px;
            padding: 2px 0;
            vertical-align: top;
          }

          .cantidad {
            width: 20px;
            text-align: center;
          }

          .producto {
            width: auto;
            padding: 0 4px;
            word-break: break-word;
          }

          .valor {
            width: 45px;
            text-align: right;
            white-space: nowrap;
          }

          .total {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            font-size: 9px;
            font-weight: bold;
            margin-top: 8px;
          }

          .mensaje {
            text-align: center;
            font-size: 7px;
            font-weight: bold;
            margin-top: 6px;
          }
        </style>
      </head>

      <body>
        <div class="ticket">
          ${logoBase64 ? `<img class="logo" src="${logoBase64}" />` : ''}

          <div class="titulo">Casino Brangus</div>

          <div class="info">Fecha: ${limpiarTexto(fecha)}</div>
          <div class="info">Nombre: ${limpiarTexto(nombre)}</div>
          <div class="info">Documento: ${limpiarTexto(documento)}</div>
          <div class="info">Consecutivo: ${limpiarTexto(consecutivo)}</div>

          <div class="linea"></div>

          <table>
            <thead>
              <tr>
                <th class="cantidad">Cant</th>
                <th class="producto">Producto</th>
                <th class="valor">Valor</th>
              </tr>
            </thead>

            <tbody>
              ${filas}
            </tbody>
          </table>

          <div class="total">
            <span>Total Ticket</span>
            <span>${formatoMoneda(totalPedido)}</span>
          </div>

          <div class="linea"></div>

          <div class="mensaje">¡Un placer atenderle!</div>
        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 300);
          };

          window.onafterprint = function () {
            setTimeout(function () {
              window.close();
            }, 300);
          };
        </script>
      </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}