var app;
var totalconpromo = 0.00;//EARTCOD1009
window.onload = function () {
    llenarCampos();
    var texto = this.empresa.ruc + '|' + this.cabecera.doctribcodigosunat + '|' +
        this.cabecera.serie + '|' + this.cabecera.numdocumento + '|' + app.igv + '|' +
        app.total + '|' + this.cabecera.fecha.substring(0, 10) + '|' +
        this.cabecera.tipodocclientesunat + '|' + this.cabecera.numdoccliente + '|';
    this.GenerarQR(texto);
    this.setTimeout(function () {
        window.print();
    }, 1000);
}

function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),
            empresa: new Object(),
            pago: new Object(),
            detallehtml: '',
            cobrohtml: '',
            pagoshtml: '',
            total: 0,
            totaldescuentos: 0,
            subtotaldescuentos: 0,
            descuento: 0,
            subtotal: 0,
            igv: 0,
            totalredondeo: 0,
            simbmoneda: '',
            url: ""

        },
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {

                this.cabecera = cabecera;
                this.detalle = detalle;
                this.empresa = empresa;
                this.pago = pago;
                var fila = '';
                totalconpromo = this.cabecera.total;//EARTCOD1009
                this.simbmoneda = pago[0].simbolomoneda;
                var urlfinal = "";
                if (this.cabecera.idempresa >= 1000 && this.cabecera.idempresa <= 1999) {
                    urlfinal = "https://sistemaenlinea.qf.com.pe:8049/";
                } else if (this.cabecera.idempresa >= 2000 && this.cabecera.idempresa <= 2999) {
                    urlfinal = "https://sistema.fys.pe:9012/";
                } else if (this.cabecera.idempresa >= 3000 && this.cabecera.idempresa <= 3999) {
                    urlfinal = "https://www.nubefact.com/buscar";
                }
                this.url = urlfinal;
                if (this.cabecera.nombrecliente == 'CLIENTES VARIOS')
                    this.cabecera.nombrecliente = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    var cantidad = this.detalle[i].cantidad;
                    if (this.detalle[i].isfraccion)
                        cantidad = 'F' + cantidad;
                    else if (this.detalle[i].isblister)
                        cantidad = 'B' + cantidad;
                    fila += '<tr >';
                    fila += '<td style="font-size:10px;padding-right:3px;">' + this.detalle[i].codigoproducto + '</td>';
                    fila += '<td style="font-size:11px"><span>' + this.detalle[i].producto.replace(',', ', ').replace('.', '. ') + '</span>';
                    if (this.detalle[i].descuento == undefined || this.detalle[i].descuento == null)
                        this.detalle[i].descuento = 0;
                    if (this.detalle[i].descuento > 0)
                        fila += ' (-' + (this.detalle[i].descuento) + '%)';
                    if (this.detalle[i].idtipoproducto == 'PT' || this.cabecera.idtipoguia == 4) {
                        fila += '</br > <span>Lote: ' + this.detalle[i].lote + ', FV: ' + this.detalle[i].fechavencimiento + '</span>';
                    }

                    fila += '</td >';
                    fila += '<td style="text-align:right;padding-right:3px;font-size:10px">' + cantidad + '</td>';
                    fila += '<td style="text-align:right;padding-right:3px;font-size:10px">' + this.detalle[i].precioigv.toFixed(2) + '</td>';
                    fila += '<td style="text-align:right;padding-right:3px;font-size:10px">' + (this.detalle[i].cantidad * this.detalle[i].precioigv).toFixed(2) + '</td>';
                    fila += '</tr>';
                    if (this.detalle.tipopago != 'bonificacion') {
                        this.total += this.detalle[i].precioigv * this.detalle[i].cantidad;
                        this.subtotal += this.detalle[i].precio * this.detalle[i].cantidad;
                        this.totaldescuentos += this.detalle[i].precioigvdescuento * this.detalle[i].cantidad;
                        this.subtotaldescuentos += this.detalle[i].preciodescuento * this.detalle[i].cantidad;
                    }
                }
                this.detallehtml = fila;
                this.totalredondeo = '0.00';
                var itotal = (this.total - (this.cabecera.bonificacion == undefined ? 0 : this.cabecera.bonificacion) - this.cabecera.descuento).toFixed(2);
                //cobro
                fila = '';
                var multiplo = 0
                var idempresa = this.cabecera.idempresa;
                if (idempresa == '1001') {
                    multiplo = 1;
                } else {
                    multiplo = 1.18;
                }




                fila += '<tr>';
                fila += '<td colspan="3">VALOR VENTA</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                if (idempresa == '1001') {
                    fila += '<td style="text-align:right">' + (itotal / 1).toFixed(2) + '</td>';
                } else {
                    fila += '<td style="text-align:right">' + (itotal / 1.18).toFixed(2) + '</td>';
                }
                fila += '</tr>';

                if (this.cabecera.descuento > 0 || this.cabecera.pkdescuento > 0) {//EARTCOD1009
                    fila += '<tr>';
                    fila += '<td colspan="3">DESCUENTOS</td>';
                    fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                    if (idempresa == '1001') {
                        //fila += '<td style="text-align:right">' + (this.cabecera.descuento / (1)).toFixed(2) + '</td>';
                        fila += '<td style="text-align:right">' + (this.cabecera.descuento / (1) + this.cabecera.pkdescuento).toFixed(2) + '</td>';//EARTCOD1009
                    } else {
                        //fila += '<td style="text-align:right">' + (this.cabecera.descuento / (1.18)).toFixed(2) + '</td>';
                        fila += '<td style="text-align:right">' + (this.cabecera.descuento / (1.18) + this.cabecera.pkdescuento).toFixed(2) + '</td>';//EARTCOD1009
                    }
                    fila += '</tr>';
                }

                if (this.cabecera.bonificacion > 0) {
                    fila += '<tr>';
                    fila += '<td colspan="3">OPER. GRATUITA</td>';
                    fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                    if (idempresa == '1001') {
                        fila += '<td style="text-align:right">' + (this.cabecera.bonificacion / (1)).toFixed(2) + '</td>';
                    } else {
                        fila += '<td style="text-align:right">' + (this.cabecera.bonificacion / (1.18)).toFixed(2) + '</td>';
                    }
                    fila += '</tr>';
                }

                fila += '<tr>';
                fila += '<td colspan="3">SUBTOTAL</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                if (idempresa == '1001') {
                    //fila += '<td style="text-align:right">' + (this.total / (1)).toFixed(2) + '</td>';
                    fila += '<td style="text-align:right">' + (this.total / (1) - this.cabecera.pkdescuento).toFixed(2) + '</td>';//EARTCOD1009
                } else {
                    //fila += '<td style="text-align:right">' + (this.total / (1.18)).toFixed(2) + '</td>';
                    fila += '<td style="text-align:right">' + (this.total / 1.18 - this.cabecera.pkdescuento).toFixed(2) + '</td>';//EARTCOD1009
                }
                fila += '</tr>';

                fila += '<tr>';
                fila += '<td colspan="3">IMPORTE ICBPER</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                fila += '<td style="text-align:right">0.00</td>';
                fila += '</tr>';

                fila += '<tr>';
                fila += '<td colspan="3">IGV</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                if (idempresa == '1001') {
                    fila += '<td style="text-align:right">0.00</td>';
                } else {
                    //fila += '<td style="text-align:right">' + (itotal - ((itotal) / 1.18)).toFixed(2) + '</td>';
                    fila += '<td style="text-align:right">' + ((itotal - ((itotal) / 1.18)) - (this.cabecera.pkdescuento * 0.18)).toFixed(2) + '</td>';//EARTCOD1009
                }
                fila += '</tr>';

                fila += '<tr>';
                fila += '<td colspan="3">IMPORTE TOTAL</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                //fila += '<td style="text-align:right">' + itotal + '</td>';
                //fila += '<td style="text-align:right">' + (itotal - this.cabecera.opgratuita).toFixed(2) + '</td>';//EARTCOD1009
                if (idempresa == '1001') {
                    fila += '<td style="text-align:right">' + (itotal - (this.cabecera.pkdescuento * 1)).toFixed(2) + '</td>';//EARTCOD1009
                } else {
                    fila += '<td style="text-align:right">' + (itotal - (this.cabecera.pkdescuento * 1.18)).toFixed(2) + '</td>';//EARTCOD1009 
                }
                fila += '</tr>';

                fila += '<tr>';
                fila += '<td colspan="3">TOTAL REDONDEADO</td>';
                fila += '<td style="text-align:right">' + this.simbmoneda + '</td>';
                fila += '<td style="text-align:right">' + this.totalredondeo + '</td>';
                //fila += '</tr>';
                this.cobrohtml = fila;
                //pagos
                fila = '';
                var vuelto = 0;
                var numtarjeta = '';
                for (var i = 0; i < this.pago.length; i++) {
                    numtarjeta = '';
                    if (this.pago[i].montopagado == null) this.pago[i].montopagado = 0;
                    if (this.pago[i].numtarjeta != '') numtarjeta = '*****' + this.pago[i].numtarjeta;
                    fila += '<tr>';
                    fila += '<td colspan="3">' + this.pago[i].tipopago + ' ' + numtarjeta + '</td>';
                    fila += '<td style="text-align:right">' + this.pago[i].simbolomoneda + '</td>';
                    fila += '<td style="text-align:right; width:24%">' + this.pago[i].montopagado.toFixed(2) + '</td>';
                    fila += '</tr>';
                    vuelto += (this.pago[i].montodevuelto == null) ? 0 : this.pago[i].montodevuelto;
                }
                var fec = this.cabecera.fechav.substring(0, 10);


                if (this.cabecera.iddocumento == 1000 && this.pago[0].idtipopago == 10001) {
                    fila += '<tr>';
                    fila += '<td style="text-align:left" colspan="5">CUOTA: 1  |  MONTO  S/. ' + this.cabecera.total.toFixed(2) + '  |  F.VCTO  ' + fec + '</td > ';
                    fila += '</tr>';
                }
                if (this.cabecera.iddocumento == 1000 && this.pago[0].idtipopago == 10002) {
                    fila += '<tr>';
                    fila += '<td colspan="1">CONTADO</td>';
                    fila += '</tr>';
                }
                try {
                    fila += '<tr>';
                    fila += '<td colspan="3">VUELTO</td>';
                    fila += '<td style="text-align:right">' + this.pago[0].simbolomoneda + '</td>';
                    fila += '<td style="text-align:right; width:24%">' + vuelto.toFixed(2) + '</td>';
                    fila += '</tr>';
                } catch (e) {
                }
                this.descuento = (((this.total - this.totaldescuentos)) / 1.18).toFixed(2);
                this.pagoshtml = fila;
                this.total = this.cabecera.total.toFixed(2);
                //this.subtotal = this.cabecera.subtotal.toFixed(2);
                this.subtotal = this.subtotal.toFixed(2);
                this.igv = (this.totaldescuentos - this.subtotaldescuentos).toFixed(2);
                //this.total = this.totaldescuentos.toFixed(2);
                //this.subtotal = this.subtotal.toFixed(2);                              
                this.subtotaldescuentos = this.subtotaldescuentos.toFixed(2);
                this.totaldescuentos = this.totaldescuentos.toFixed(2);
                this.totalredondeo = '0.00'; //REDONDEO_SIN_INCREMENTO(this.totaldescuentos, 1, 2);
                var subtotal = 0;
                var descuento = 0;
                var valorventa = subtotal - descuento;
                var igv = 0;
                var total = 0;
            }
        }
    });
}


function GenerarQR(texto) {

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: texto,
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(function () {
        var qr = document.getElementById("qrcode");
        qr.getElementsByTagName('img')[0].style.display = '';
    }, 000);
    //console.log(qr);
    //console.log(img);
    //img.style.display = '';
}

function generarPDF() {
    var url = ORIGEN + "/Ventas/Venta/GenerarPDFTicket";
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
