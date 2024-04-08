
var app;
window.onload = function () {
    llenarCampos();
    this.setTimeout(function () {
        window.print();
    }, 1000);
}

function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: {
            data: new Object(),
            htmlPrueba: '',
        },
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {
                this.data = data;
                var fila = '';
                for (var i = 0; i < this.data.length; i++) {
                    var cabecera = JSON.parse(data[i][0]['CABECERA'])[0];
                    var transporte = JSON.parse(data[i][0]['TRANSPORTE'])[0];
                    var detalle = JSON.parse(data[i][0]['DETALLE']);
                    let filaCabecera = "";
                    filaCabecera += `<div class="row" style="margin-top:20px;">
                                        <table style="width:100%">
                                        <tr>
                                            <th style="width: 30%;"></th>
                                            <th style="width: 32%;"></th>
                                            <th style="width: 37%;"></th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <img src="/imagenes/empresas/QF.png" height="80px" width="180px" />
                                            </td>
                                            <td>
                                                <div class="text-center">
                                                    <label style="font-weight: 700; text-align: center;">CORPORACION QF SAC</label>
                                                </div>
                                                <div>
                                                    <label style="text-align: center;">
                                                        <strong>Dirección:</strong> Jr. Carlos Augusto Salaverry N° 3834 Urb. Panamericana Norte Los Olivos - Lima - Lima
                                                    </label>
                                                </div>
                                                <div>
                                                    <label style="text-align: center;">
                                                        <strong>Dirección:</strong> Jr. Carlos Augusto Salaverry N° 3834 Urb. Panamericana Norte Los Olivos - Lima - Lima
                                                    </label>
                                                </div>
                                                <div class="text-center">
                                                    <label style="text-align: center;">
                                                        www.qf.com.pe
                                                    </label>
                                                </div>
                                                <div class="text-center">
                                                    <label style="text-align: center;">
                                                        Facebook.com/farmaciasqfperu
                                                    </label>
                                                </div>
                                            </td>
                                            <td style="padding-left: 50px;">
                                                <div style="padding-top: 25px; padding-bottom: 25px; border: 1px solid green; width: 100%; height: 100%; text-align: center;">
                                                    <label style="font-size: 12px; font-weight: 700; text-align: center;">R.U.C 20523915399</label><br><br>
                                                    <label style="font-size: 20px; font-weight: 700;">GUIA DE REMISION ELECTRONICA REMITENTE</label><br><br>
                                                    <label style="font-size: 12px; font-weight: 700; text-align: center;">N°` + cabecera.NUMDOC + `</label>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    </div>
                                    <div class="row" style="margin-top:30px;">
                                                <div> <label style="margin-left:150px">Lima, ` + cabecera.DIATRASLADO + `</label>   <label style="margin-left:5px;"> de ` + cabecera.MESTRASLADO + `</label> <label style="margin-left:5px">del 20` + cabecera.ANOTRASLADO + `</label> </div>
                                                <div style="margin-top:10px">Destinatario : <label style="margin-left:5px">` + cabecera.EMPRESADESTINATARIO + `</label></div>
                                                <div> R.U.C. : <label style="margin-left:5px">` + cabecera.RUCDESTINATARIO + `</label></div>
                                                <div>Punto de Partida :<label style="margin-left:5px;width:154px;">` + cabecera.PUNTOPARTIDA + `</label></div>
                                                <div>Punto de Llegada : <label style="margin-left:5px;width:154px;">` + cabecera.PUNTOLLEGADA + `</label></div>
                                                <div style="width:50%"></div>

                                                <div>Fecha de Inicio de Traslado : <label style="margin-left:5px">` + cabecera.FECHATRASLADO + `</label></div>

                                            </div>
                                            <div class="row" style="margin-top:23px;border:1px solid green;">
                                                        <table width="100%" style="padding: 8px;">
                                                            <tr>
                                                                <td colspan="6">UNIDAD DE TRANSPORTE Y CONDUCTOR</td>
                                                                <td colspan="6" style="padding-left: 180px">EMPRESA DE TRANSPORTES</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="6"> ` + transporte.MARCA + `</td>
                                                                <td colspan="6" style="padding-left: 180px"> ` + transporte.EMPRESATRANSPORTE + `</td>

                                                            </tr>
                                                            <tr>
                                                                <td colspan="6">` + transporte.MATRICULA + `</td>
                                                                <td colspan="6" style="padding-left: 180px"> ` + transporte.RUCTRANSPORTE + `</td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="6">` + transporte.CONDUCTOR + `</td>
                                                                <td colspan="6" style="padding-left: 180px">` + transporte.LICENCIA + `</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div class="row" height="70%">
                                                                <table border="0" cellspacing="0" cellpadding="0" width="100%" height="550px" style="border: 1px solid green; margin-top: -1px;">
                                                                    <tr>
                                                                        <td valign="top">
                                                                            <table width="100%" id="tbldetalleimprecion">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>CODIGO</th>
                                                                                        <th>ITEM</th>
                                                                                        <th>PRODUCTO</th>
                                                                                        <th>LAB.</th>
                                                                                        <th>CANT.</th>
                                                                                        <th>U-M</th>
                                                                                        <th>LOTE</th>
                                                                                        <th>F.VENCE</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>`;

                    let filaDetalle = "";
                    for (var j = 0; j < detalle.length; j++) {
                        filaDetalle += '<tr>';
                        filaDetalle += '<td style="text-align:center" >' + detalle[j].CODIGO + '</td>';
                        filaDetalle += '<td style="text-align:center" >' + parseInt(j + 1) + '</td>';
                        filaDetalle += '<td style="text-align:left" >' + detalle[j].PRODUCTO + '</td > ';
                        filaDetalle += '<td style="text-align:left" >' + detalle[j].LABORATORIO + '</td>';
                        filaDetalle += '<td style="text-align:center">' + detalle[j].CANTIDADGENERADA + '</td>';
                        filaDetalle += '<td></td>';
                        filaDetalle += '<td style="text-align:center">' + detalle[j].LOTE + '</td>';
                        filaDetalle += '<td style="text-align:center">' + detalle[j].FECHAVECIMIENTO + '</td>';
                        filaDetalle += '</tr>';
                    }
                    fila += filaCabecera;
                    fila += filaDetalle;
                    fila += `</tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td valign="bottom">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid green; margin-bottom:-1px; text-align:left">
                            <thead>
                                <tr>
                                    <th style="border-right:1px solid green;" width="150px">PICKING</th>
                                    <th style="border-right:1px solid green;" width="150px"></th>
                                    <th style="border-right:1px solid green;" width="150px">CHEQUEO</th>
                                    <th style="border-right:1px solid green;" width="150px"></th>
                                    <th style="border-right:1px solid green;" width="150px">PACKING</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </td>
                </tr>
            </table>
        </div>`;
                }
                this.htmlPrueba = fila;
            }
        }
    });
}


function generarPDF() {
    //var url = ORIGEN + "/Ventas/Venta/GenerarPDFTicket";
    //var obj = { url: location.pathname };
    //$.post(url, obj).done(function (data) {
    //    var link = document.createElement('a');
    //    link.href = "data:application/pdf;base64," + data;
    //    var fileName = "TicketVenta.pdf";
    //    link.download = fileName;
    //    link.click();

    //}).fail(function (data) {
    //    mensajeError(data);
    //});
}
