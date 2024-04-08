
var app;
window.onload = function () {
    llenarCampos();
    //var texto = this.empresa.ruc + '|' + this.cabecera.doctribcodigosunat + '|' +
    //    this.cabecera.serie + '|' + this.cabecera.numdocumento + '|' + app.igv+ '|' +
    //    app.total + '|' + this.cabecera.fecha.substring(0, 10) + '|' +
    //    this.cabecera.tipodocclientesunat + '|' + this.cabecera.numdoccliente + '|';
    this.GenerarQR(this.qr.qr);
    this.setTimeout(function () {
        //window.print();
    }, 1000);
}

function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),
            transporte: new Object(),
            detallehtml: '',
            qr: new Object(),
            total: 0
        },
        created: function () {
            this.recuperarDatos();
        },
        methods: {
            recuperarDatos: function () {

                this.cabecera = cabecera;
                this.detalle = detalle;
                this.transporte = transporte;
                this.qr = qr;

                if (this.cabecera["IDTIPOGUIA"] == 3) {
                    this.cabecera["EMPRESADESTINATARIO"] = this.cabecera["PROVEEDOR"];
                    this.cabecera["RUCDESTINATARIO"] = this.cabecera["RUCPROVEEDOR"];
                }

                var fila = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    //var cantidad = this.detalle[i]["CANTIDAD"];
                    fila += '<tr>';
                    fila += '<td style="text-align:center" >' + this.detalle[i].CODIGO + '</td>';
                    fila += '<td style="text-align:center" >' + parseInt(i + 1) + '</td>';
                    fila += '<td style="text-align:left" >' + this.detalle[i].PRODUCTO + '</td > ';
                    fila += '<td style="text-align:left" >' + this.detalle[i].LABORATORIO + '</td>';
                    fila += '<td style="text-align:center">' + this.detalle[i].CANTIDADGENERADA + '</td>';
                    fila += '<td></td>';
                    fila += '<td style="text-align:center">' + this.detalle[i].LOTE + '</td>';
                    fila += '<td style="text-align:center">' + this.detalle[i].FECHAVECIMIENTO + '</td>';
                    fila += '</tr>';
                }
                this.detallehtml = fila;
            }
        }
    });
}


function generarPDF() {
    var url = ORIGEN + "/Almacen/AMantenimientoGuia/GenerarPDFTicket";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "TicketVenta.pdf";
        link.download = fileName;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });

}



function GenerarQR(texto) {
    if (texto.length > 0) {
        const qrdiv = document.getElementById("codigo-qr");
        const codqr = new QRCode(qrdiv,
            {
                text: texto,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

    }
}