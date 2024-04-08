
var app;
var ORIGEN = location.origin.toString();

window.onload = function () {
    llenarCampos();

    //this.setTimeout(function () {
    //}, 10000);
}

function llenarCampos() {
    var llenar = this.data;


    app = new Vue({
        el: '#aplicacion',
        created: function () {
            this.recuperarDatos();
        },
        methods: {
            recuperarDatos: function () {
                this.data = data;
                var fila = '';
                var numitem = 0;
                //this.items = data;
                //for (var i = 0; i < this.data.length; i++) {
                //    numitem += 1;
                //    fila += '<tr>';
                //    fila += '<td colspan="1" rowspan="1">' + numitem + '</td>';
                //    fila += '<td colspan="3" rowspan="1">' + this.data[i]["codigoproducto"] + '</td>';
                //    fila += '<td colspan="3" rowspan="1">' + this.data[i]["producto"] + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + this.data[i]["laboratorio"] + '</td>';
                //    fila += '<td colspan="4" rowspan="1">' + this.data[i]["fechavencimiento"] + '</td>';
                //    fila += '<td colspan="4" rowspan="1">' + this.data[i]["lote"] + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + this.data[i]["stockactual"] + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';
                //    fila += '<td colspan="5" rowspan="1">' + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';
                //    fila += '<td colspan="5" rowspan="1">' + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';
                //    fila += '<td colspan="2" rowspan="1">' + '</td>';

                //    fila += '</tr>';
                //}
                for (var i = 0; i < this.data.length; i++) {
                    //var tipodeproducto = this.data[i]["codigoproducto"].startsWith("PT");
                    var laboratorio = this.data[i]["laboratorio"];

                    // Verificar si el código de producto comienza con "PT"
                    if (laboratorio != "") {
                        numitem += 1;
                        fila += '<tr>';
                        fila += '<td style="padding: 12px 0;" colspan="1" > ' + numitem + ' </td>';
                        fila += '<td style="padding: 12px 0;" colspan="2">' + this.data[i]["codigoproducto"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="8">' + this.data[i]["producto"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="4">' + this.data[i]["laboratorio"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="3">' + this.data[i]["fechavencimiento"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="2">' + this.data[i]["lote"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="2">  ' + this.data[i]["stockactual"] + '</td>';
                        fila += '<td style="padding: 12px 0;" colspan="2"></td>';
                        fila += '<td style="padding: 12px 0;" colspan="2"></td>';
                        fila += '<td style="padding: 12px 0;" colspan="3"></td>';
                        //fila += '</tr>';
                    }
                }
                this.tbldetalleao = fila;
            }
        }
    });
}

// actualizar la hora
function actualizarFechaYHora() {
    var fechaPeru = moment().utcOffset('-05:00');
    var fechaConSegundos = fechaPeru.format('DD/MM/YYYY HH:mm:ss');
    var fechaSinSegundos = fechaPeru.format('DD/MM/YYYY HH:mm');

    // Actualizar el contenido del elemento con id "idfechaactual"
    $("#idfechaactual").html("Fecha de Descarga: <span style='font-weight: normal;'>" + fechaSinSegundos + "</span>");
}

// Llamar a la función inicialmente y luego configurar una actualización cada segundo
$(document).ready(function () {
    setInterval(function () {
        actualizarFechaYHora();
    }, 1000); // Actualizar cada segundo
});

function generarPDF() {
    var url = ORIGEN + "/Almacen/AStock/GenerarPdfStock";
    console.log("location  ", location);
    var obj = { url: location.href };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "ReporteStock.pdf";
        link.download = fileName;
        link.click();
    }).fail(function (data) {
        mensajeError(data);
    });
}
