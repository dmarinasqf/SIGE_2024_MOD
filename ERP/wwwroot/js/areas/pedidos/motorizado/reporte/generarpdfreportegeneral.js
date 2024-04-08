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
                var fila = '';
                for (var i = 0; i < this.data.length; i++) {
                    fila += '<tr>';
                    fila += '<td class="text-left">' + this.data[i].Sucursal + '</td>';
                    fila += '<td class="text-left">' + this.data[i].SucursalEntrega + '</td>';
                    fila += '<td class="text-left">' + this.data[i].Empleado + '</td>';
                    fila += '<td class="text-left">' + this.data[i].DocumentoCliente + '</td>';
                    fila += '<td class="text-center">' + this.data[i].Cliente + '</td>';
                    fila += '<td class="text-center">' + this.data[i].Paciente + '</td>';
                    fila += '<td class="text-center">' + this.data[i].Distrito + '</td>';
                    fila += '<td class="text-center">' + this.data[i].TipoEntrega + '</td>';
                    fila += '<td class="text-center">' + this.data[i].Direccion + '</td>';
                    fila += '<td class="text-center">' + (this.data[i].Referencia1 || '') + '</td>';
                    fila += '<td class="text-center">' + (this.data[i].Referencia2 || '') + '</td>';
                    fila += '<td class="text-center">' + this.data[i].FechaEntrega + '</td>';
                    fila += '<td class="text-center">' + this.data[i].FechaPedido + '</td>';
                    fila += '</tr>';
                }
                this.detallehtml = fila;
            }
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/Pedidos/Motorizado/GenerarPdfReporteGeneral";
    var obj = { url: location.pathname + location.search };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "ReporteGeneralPDF.pdf";
        link.download = fileName;
        link.click();
    }).fail(function (data) {
        mensajeError(data);
    });

}