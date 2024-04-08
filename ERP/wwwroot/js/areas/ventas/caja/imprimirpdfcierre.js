var lblsaldoneto = document.getElementById('lblsaldoneto');
var lbltotaltarjetas = document.getElementById('lbltotaltarjetas');
window.onload = function () {
    llenarCampos();
}

function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: {
            cajaaperturada: new Object(),
            datoscierre: [],
            gastos: [],
            detallegastoshtml: ''
        },
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {
                this.cajaaperturada = data.cajaaperturada;
                this.datoscierre = data.datoscierre;
                this.gastos = data.gastos;
                var fila = '';
                var total = 0;
                var totalefectivo = 0;
                var totaltarjetas = 0;
                for (var i = 0; i < this.datoscierre.length; i++) {
                    if (this.datoscierre[i].montosistema == null) this.datoscierre[i].montosistema = 0.00;
                    if (this.datoscierre[i].montousuario == null) this.datoscierre[i].montousuario = 0.00;
                    fila += '<tr>';
                    fila += '<td>' + this.datoscierre[i].fecha + '</td>';
                    fila += '<td>' + this.datoscierre[i].caja + '</td>';
                    fila += '<td>' + this.datoscierre[i].moneda + '</td>';
                    fila += '<td>' + this.datoscierre[i].tipopago + '</td>';
                    fila += '<td class="text-right">' + this.datoscierre[i].numventas + '</td>';
                    fila += '<td class="text-right">' + this.datoscierre[i].montosistema.toFixed(2) + '</td>';
                    fila += '<td class="text-right">' + this.datoscierre[i].montousuario.toFixed(2) + '</td>';
                    fila += '<td class="text-right">' + (this.datoscierre[i].montousuario - this.datoscierre[i].montosistema).toFixed(2) + '</td>';
                    fila += '</tr>';
                    if (this.datoscierre[i].tipopago != 'MONTO APERTURA')
                        total += this.datoscierre[i].montousuario;
                    if (this.datoscierre[i].tipopago == 'EFECTIVO' || this.datoscierre[i].tipopago == 'MONTO APERTURA' || this.datoscierre[i].tipopago == 'EFECTIVO (A)')
                        totalefectivo += this.datoscierre[i].montousuario;
                    if (this.datoscierre[i].tipopago.split(' ')[0] == 'TARJETA' || this.datoscierre[i].tipopago == 'TARJETA (A)')
                        totaltarjetas += this.datoscierre[i].montousuario;
                }
                fila += '<tr>';
                fila += '<td colspan="5">TOTAL VENTA</td>';
                fila += '<td class="text-right"></td>';
                fila += '<td class="text-right">' + total.toFixed(2) + '</td>';
                fila += '<td class="text-right"></td>';
                fila += '</tr>';
                this.detallehtml = fila;
                total = 0;
                if (this.gastos.length != 0) {
                  
                    fila = '';
                    console.log(this.gastos);
                    for (var i = 0; i < this.gastos.length; i++) {

                        fila += '<tr>';
                        fila += '<td >' + this.gastos[i].tipo + '</td>';
                        fila += '<td >' + this.gastos[i].descripcion + '</td>';
                        fila += '<td class="text-right">' + this.gastos[i].monto.toFixed(2) + '</td>';
                        fila += '</tr>';
                        total += this.gastos[i].monto;
                    }
                    fila += '<tr>';
                    fila += '<td colspan="2">TOTAL</td>';
                    fila += '<td class="text-right">' + total.toFixed(2) + '</td>';
                    fila += '</tr>';
                    this.detallegastoshtml = fila;
                } else
                    document.getElementById('cardgastos').style.display = 'none';
               
                lbltotaltarjetas.innerText = 'Total Tarjetas: ' + (totaltarjetas).toFixed(2);
                lblsaldoneto.innerText = 'Saldo neto: ' + (totalefectivo ).toFixed(2);
            }
        }
    });
}


function generarPDF() {
    var url = ORIGEN + "/Ventas/Caja/GenerarPDFCierre";
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