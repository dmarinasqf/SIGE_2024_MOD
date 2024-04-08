var lblFechaDescarga = document.getElementById('lblFechaDescarga');

window.onload = function () {
    llenarCampos();
}

function llenarCampos() {
    app = new Vue({
        el: '#aplicacion',
        data: [],
        created: function () {
            this.recuperarDatos();

        },
        methods: {
            recuperarDatos: function () {
                this.data = data;
                var fechaActualCompleta = new Date().toISOString();
                var fechaActual = fechaActualCompleta.split('T')[0].split('-');
                var nuevafechaactual = fechaActual[2] + "/" + fechaActual[1] + "/" + fechaActual[0];
                var HoraActual = fechaActualCompleta.split('T')[1].split('.')[0];
                lblFechaDescarga.innerHTML = "Fecha Descarga: " + nuevafechaactual + " " + HoraActual;
                var fila = '';
                for (var i = 0; i < this.data.length; i++) {
                    var fechaingreso = this.data[i].fechaingreso.split('-');
                    var nuevafechaingreso = fechaingreso[2] + "/" + fechaingreso[1] + "/" + fechaingreso[0];
                    var fechavencimiento = this.data[i].fechavencimiento.split('-');
                    var nuevafechavencimiento = fechavencimiento[2] + "/" + fechavencimiento[1] + "/" + fechavencimiento[0];
                    fila += '<tr>';
                    fila += '<td class="text-left">' + this.data[i].sucursal + '</td>';
                    fila += '<td class="text-left">' + this.data[i].areaalmacen + '</td>';
                    fila += '<td class="text-left">' + this.data[i].producto + '</td>';
                    fila += '<td class="text-left">' + this.data[i].laboratorio + '</td>';
                    fila += '<td class="text-center">' + nuevafechaingreso + '</td>';
                    fila += '<td class="text-center">' + nuevafechavencimiento + '</td>';
                    fila += '<td class="text-center">' + this.data[i].lote + '</td>';
                    fila += '<td class="text-center">' + this.data[i].regsanitario + '</td>';
                    fila += '<td class="text-center">' + this.data[i].stockactual + '</td>';
                    fila += '<td class="text-center">' + this.data[i].multiplo + '</td>';
                    fila += '</tr>';
                }
                this.detallehtml = fila;

                //lbltotaltarjetas.innerText = 'Total Tarjetas: ' + (totaltarjetas).toFixed(2);
            }
        }
    });
}


function generarPDF() {
    var url = ORIGEN + "/Almacen/AStock/GenerarPdfStock";
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