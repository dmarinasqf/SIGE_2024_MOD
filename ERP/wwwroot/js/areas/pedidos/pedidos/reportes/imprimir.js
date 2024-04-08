
var app;
var ORIGEN = location.origin.toString();
window.onload = function () {
    llenarCampos();
    this.setTimeout(function () {
    }, 1000);
}

function llenarCampos() {
     app = new Vue({
        el: '#aplicacion',
       
        created: function () {
            this.recuperarDatos();
        },
        methods: {
            recuperarDatos: function () {
                this.data = data;
                var fila = '';
                    for (var i = 0; i < this.data.length; i++) {
                        fila += '<tr>';
                        fila += '<td colspan="1"> ' + this.data[i]["CODIGO_PEDIDO"] + ' </td>';
                        fila += '<td colspan="2">' + this.data[i]["FECHA"] + '</td>';
                        fila += '<td colspan="3">' + this.data[i]["PACIENTE"] + '</td>';
                        fila += '<td colspan="2">' + this.data[i]["CODIGO_PRODUCTO"] + '</td>';
                        fila += '<td colspan="4">' + this.data[i]["PRODUCTO"] + '</td>';
                        fila += '<td colspan="2">' + this.data[i]["NOMBRE_MEDICO"] + '</td>';
                        fila += '<td colspan="1">  ' + (this.data[i]["COLEGIATURA"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["A"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["B"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["C"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["D"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["E"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["F"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["G"]) + '</td>';
                        fila += '<td colspan="2">' + (this.data[i]["X"]) + '</td>';
                    }
               
                this.tbldetalleao = fila;
            }
        }
    });
}


function generarPDF() {
    var url = ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/GenerarPDF";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "AnalisisOrganoleptico";
        var date = new Date();
        var newFileName = fileName + "_" + date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();

        var fileNamenuevo = fileName + "_" + newFileName + ".pdf";
        link.download = fileNamenuevo;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });

}