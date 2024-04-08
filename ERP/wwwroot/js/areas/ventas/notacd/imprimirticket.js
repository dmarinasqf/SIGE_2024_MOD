
var app;
window.onload = function () {
    llenarCampos();
    var texto = this.empresa.ruc + '|' + this.cabecera.doctribcodsunatnota + '|' +
        this.cabecera.serienota + '|' + this.cabecera.numdocnota + '|' + app.igv + '|' +
        app.total + '|' + this.cabecera.fechasunatnota + '|' +
        this.cabecera.tipodocclientesunat + '|' + this.cabecera.numdoccliente + '|';
    this.GenerarQR(texto);
    this.setTimeout(function () {
        window.print();
    }, 1000);

    console.log("ESTA ES LA CABECERA");
    console.log(cabecera);
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
            total: 0,
            subtotal: 0,
            igv: 0,
            totalredondeo: 0,
            url: "",
            pkdescuento: 0//EARTCOD1009

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
                var urlfinal = "";
                this.pkdescuento = cabecera.pkdescuento;//EARTCOD1009
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
                var fila = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    var cantidad = this.detalle[i].cantidad;
                    if (this.detalle[i].isfraccion)
                        cantidad = 'F' + cantidad;
                    else if (this.detalle[i].isblister)
                        cantidad = 'B' + cantidad;
                    fila += '<tr>';
                    fila += '<td>' + this.detalle[i].producto + '</td>';
                    fila += '<td style="text-align:right">' + cantidad + '</td>';
                    fila += '<td style="text-align:right">' + this.detalle[i].precio.toFixed(2) + '</td>';
                    fila += '<td style="text-align:right">' + (this.detalle[i].cantidad * this.detalle[i].precio).toFixed(2) + '</td>';
                    fila += '</tr>';
                    this.total += this.detalle[i].total;
                    this.subtotal += this.detalle[i].subtotal;
                }
                //this.igv = (this.total - this.subtotal).toFixed(2);
                //this.total = this.total.toFixed(2);
                //this.subtotal = this.subtotal.toFixed(2);

                //EARTCOD1009            
                this.total = (this.total.toFixed(2) - (this.pkdescuento * 1.18).toFixed(2)).toFixed(2);
                this.subtotal = (this.subtotal.toFixed(2) - (this.pkdescuento).toFixed(2)).toFixed(2);
                this.igv = (this.total - this.subtotal).toFixed(2);
                //--EARTCOD1009

                this.detallehtml = fila;
                this.totalredondeo = '0.00';//REDONDEO_SIN_INCREMENTO(this.total, 1, 2);
                //GenerarQR(texto);
                //GenerarQR(texto);
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