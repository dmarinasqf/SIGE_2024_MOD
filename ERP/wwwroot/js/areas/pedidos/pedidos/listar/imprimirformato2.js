
var app;
var cabecera = [];
var detalle = [];
var delivery;
$(document).ready(function () {

    cabecera = JSON.parse(pedido.pedido[0].cabecera)[0];
    detalle = JSON.parse(pedido.pedido[0].detalle);
    delivery = pedido.delivery[0];
    console.log(delivery);

    llenarCampos();

});
function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),
            empresa: new Object(),
            delivery: new Object(),
            detallehtml: '',
            valorventa: 0.00//EARTCOD1009

        },
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {
                this.cabecera = cabecera;
                this.delivery = delivery;
                this.cabecera.total = this.cabecera.total.toFixed(2);
                this.cabecera.adelanto = this.cabecera.adelanto.toFixed(2);
                this.cabecera.pkdescuento = this.cabecera.pkdescuento.toFixed(2);//EARTCOD1009
                if (this.cabecera.adelanto > 0) {
                    this.cabecera.saldo = (this.cabecera.saldo.toFixed(2) - (this.cabecera.pkdescuento != null ? this.cabecera.pkdescuento : 0.00)).toFixed(2);
                } else {
                    this.cabecera.saldo = this.cabecera.saldo.toFixed(2);
                }
                this.detalle = detalle;
                var fila = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    var obj = this.detalle[i];
                    if (obj.formula == 'GASTO DE ENVÍO') {
                        fila += '<tr>';
                        fila += '<td>' + obj.formula + '</td>';
                        fila += '<td style="text-align:right"></td>';
                        fila += '<td style="text-align:right"></td>';
                        fila += '<td style="text-align:right">' + obj.subtotal.toFixed(2) + '</td>';

                        fila += '</tr>';
                    } else {
                        fila += '<tr>';
                        fila += '<td>' + obj.formula.replace('.', '. ') + '</td>';
                        //fila += '<td style="text-align:right">' + obj.precio.toFixed(2) + '</td>';
                        fila += '<td style="text-align:right">' + obj.cantidad + '</td>';

                        fila += '</tr>';
                    }

                }
                this.valorventa = cabecera.total;//EARTCOD1009
                cabecera.total = (cabecera.total - cabecera.pkdescuento).toFixed(2);//EARTCOD1009
                this.detallehtml = fila;
            }
        }
    });
}


function generarPDF() {
    var url = ORIGEN + "/Ventas/Venta/GenerarPDFTicket";
    var obj = { url: location.pathname };
    console.log(obj)
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
