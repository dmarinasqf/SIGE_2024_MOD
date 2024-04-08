window.onload = function () {

    llenarCampos();
    //generarPDF();
}


function llenarCampos() {
    var app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: [],
            detalle: [],
            empresa: new Object(),
            subtotal: 0,
            total: 0,
            totaligv: 0,

        },
        created: function () {
            this.recuperarPedido();

        },
        methods: {
            recuperarPedido: function () {
                this.cabecera = (CABECERA);
                this.detalle = (DETALLE);
                this.empresa = (EMPRESA);

                for (var i = 0; i < this.detalle.length; i++) {
                    this.subtotal += this.detalle[i]['SUBTOTAL'];
                    this.total += this.detalle[i]['TOTAL'];
                }
                this.totaligv = this.total - this.subtotal;

            }
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/PreIngreso/PIPreingreso/GenerarPDF";
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
