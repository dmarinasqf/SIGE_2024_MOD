
var app;
var idproforma;
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
            cabecera: new Object(),
            detalle: new Object(),
            empresa: new Object(),   
            total: 0
        },
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {

                idproforma = cabecera.idproforma;
                this.cabecera = cabecera;
                this.detalle = detalle??[];
                this.empresa = empresa;
                for (var i = 0; i < this.detalle.length; i++) {
                    var monto = this.detalle[i].precioigv.toFixed(2) * this.detalle[i].cantidad.toFixed(2) ;

                    var ds = this.detalle[i].dsc;

                    var desc = (monto - ((monto * (ds / 100)).toFixed(2))).toFixed(2);

                    this.detalle[i].subtotal = ((this.detalle[i].cantidad * this.detalle[i].precioigv) / 1.18).toFixed(2);
                    this.total += parseFloat(desc);
                    this.dsc = this.detalle[i].descu;
                    this.detalle[i].precioigv = this.detalle[i].precioigv.toFixed(2);
                    this.detalle[i].subtotal = desc;
                }
                this.total = this.total.toFixed(2);       
                
            }
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/Ventas/Proforma/GenerarPDFTicket/" + idproforma;
    var link = document.createElement('a');
    link.href = url;        
    link.click();
    //var url = ORIGEN + "/Ventas/Proforma/GenerarPDFTicket2/";
    //var obj = { url: location.pathname };
    //$.post(url, obj).done(function (data) {
    //    var link = document.createElement('a');
    //    link.href = "data:application/pdf;base64," + data;
    //    var fileName = "Proforma.pdf";
    //    link.download = fileName;
    //    link.click();
    //    console.log(cabecera,detalle,empresa)
    //}).fail(function (data) {
    //    mensajeError(data);
    //});

}
