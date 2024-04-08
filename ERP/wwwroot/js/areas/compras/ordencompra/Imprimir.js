var app;
window.onload = function () {
    llenarCampos();
    //generarPDF();
}

function llenarCampos() {
     
    app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),
            empresa: new Object(),
            nome: new Object(),
            subtotal: 0,
            total: 0,
            totaligv: 0,
            detallehtml: '',
            percepcion: 0,
            laboratorio: ''
        },
        created: function () {
            this.recuperarPedido();

        },
        methods: {
            recuperarPedido: function () {
                this.cabecera = (CABECERA);
                this.detalle = (DETALLE);
                this.empresa = (EMPRESA);
                this.laboratorio = this.detalle[0]['LABORATORIO'];
                var contador = 0;
                for (var i = 0; i < this.detalle.length; i++) {
                    this.subtotal += this.detalle[i]['SUBTOTAL'];
                    this.total += this.detalle[i]['TOTAL'];
                    if (this.detalle[i]['BONIFICACIONES'] === null)
                        this.detalle[i]['BONIFICACIONES'] = [];
                    //if (this.detalle[i]['BONIFICACIONCLIENTE'] === null)
                    //    this.detalle[i]['BONIFICACIONCLIENTE'] = [];
                    var fila = '<tr>';
                    var codigo = '<span>' + this.detalle[i]['COD_PROD_QF'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['COD_PRO_PROVEEDOR'] + '</span >' : '');
                    var nombre = '<span>' + this.detalle[i]['DESCRIPCION_PROD_QF'] + '</span>' + (+ this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['DESCRIPCION_PRO_PROVEEDOR'] + '</span >' : '');
                    var cantidad = '<span>' + this.detalle[i]['CANTIDAD'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['CANTIDADPROVEEDOR'] + '</span >' : '');
                    var unidad = '<span>' + this.detalle[i]['UMA'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['UMP'] + '</span >' : '');

                    fila += '<td>' + (i + 1) + '</td>' +
                        '<td>' + codigo + '</td>' +
                        '<td>' + nombre + '</td>' +
                        '<td style="font-size:8px">' + this.detalle[i]['LABORATORIO'] + '</td>' +
                        ' <td>' + cantidad + '</td>' +
                        ' <td>' + unidad + '</td>' +
                        '<td>' + this.detalle[i]['PVF'].toFixed(3) + '</td>' +
                        '<td>' + this.detalle[i]['DES1'] + '</td>' +
                        '<td>' + this.detalle[i]['DES2'] + '</td>' +
                        ' <td>' + this.detalle[i]['DES3'] + '</td>' +
                        '<td>' + this.detalle[i]['BONI'].toFixed(3) + '</td>' +
                        '<td>' + this.detalle[i]['COSTO'].toFixed(3) + '</td>' +
                        ' <td>' + this.detalle[i]['TOTAL'].toFixed(3) + '</td>';
                    fila += '</tr>';
                    if (this.detalle[i]['LABORATORIO'] === this.laboratorio)
                        contador++;


                    for (var j = 0; j < this.detalle[i]['BONIFICACIONES'].length; j++) {
                        var boni = this.detalle[i]['BONIFICACIONES'][j];
                        fila += '<tr><td>Bonif a</td>' +
                            '<td> ' + boni.tipo + '</td>' +
                            ' <td>' + boni.producto + '</td>' +
                            ' <td></td>' +
                            ' <td>' + boni.cantidad + '</td>' +
                            ' <td></td>' +
                            ' <td>' + boni.precio.toFixed(3) + '</td>' +
                            ' <td></td>' +
                            ' <td></td>' +
                            ' <td></td>' +
                            ' <td></td>' +
                            ' <td></td>' +
                            ' <td></td>';
                        fila += '</tr>';
                    }


                    this.detallehtml += fila;
                }

                if (this.detalle.length != contador)
                    this.laboratorio = "VARIOS";
                this.totaligv = REDONDEAR_DECIMALES(this.total - this.subtotal, 2).toFixed(2);
                this.subtotal = this.subtotal.toFixed(2);
                this.total = this.total.toFixed(2);
                this.percepcion = (parseFloat(this.total) * CABECERA[0]['PERCEPCION'] == null ? 0 : CABECERA[0]['PERCEPCION']).toFixed(2);
            }
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/Compras/COrdenCompra/GenerarPDF";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "ReportePDF.pdf";
        link.download = fileName;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });

}

function REDONDEAR_DECIMALES(num, numdecimales) {
    if (numdecimales === null || isNaN(numdecimales) || numdecimales === 0)
        numdecimales = 2;
    return +(Math.round(num + "e+" + numdecimales) + "e-" + numdecimales);
}
