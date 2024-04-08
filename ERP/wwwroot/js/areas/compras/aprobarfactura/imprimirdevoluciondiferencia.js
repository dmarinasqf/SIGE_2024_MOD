window.onload = function () {
    llenarCampos();
}


function llenarCampos() {
    var app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: [],
            detalle: [],
            empresa: new Object(),
            totaldevolucion: 0,
            totaldiferencia: 0,
        },
        created: function () {
            this.recuperarPedido();

        },
        methods: {
            recuperarPedido: function () {
                this.cabecera = (CABECERA);
                this.detalle = (DETALLE);
                this.empresa = (EMPRESA);

                if (this.cabecera.ESTADOFACTURA == "APROBADO") {
                    this.cabecera.ESTADOFACTURA = "DEVOLUCION";
                }

                var det2 = [];
                for (var i = 0; i < this.detalle.length; i++) {
                    if (this.detalle[i].CANDEVUELTA != 0) {
                        det2.push(this.detalle[i]);

                        this.totaldevolucion += this.detalle[i].DEVOLUCION;
                        this.totaldiferencia += this.detalle[i].DIFERENCIA;
                    }
                }
                this.detalle = det2;
            }
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/Compras/CAprobarFactura/GenerarPDF";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "Factura" + CABECERA['SERIEFACTURA'] + CABECERA['NUMDOCFACTURA'] + ".pdf";
        link.download = fileName;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });

}
