var app;
var ORIGEN = location.origin.toString();
window.onload = function () {
    llenarCampos();
    //var texto = this.empresa.ruc + '|' + this.cabecera.doctribcodigosunat + '|' +
    //    this.cabecera.serie + '|' + this.cabecera.numdocumento + '|' + app.igv+ '|' +
    //    app.total + '|' + this.cabecera.fecha.substring(0, 10) + '|' +
    //    this.cabecera.tipodocclientesunat + '|' + this.cabecera.numdoccliente + '|';
    //this.GenerarQR(texto);
    //this.setTimeout(function () {
    //    //window.print();
    //}, 1000);
}


function llenarCampos() {
    var cabecera = JSON.parse(data[0]['CABECERA']);
    var detalle = JSON.parse(data[0]['DETALLE']);
    app= new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),
          
            detallehtml: '',
            total: 0
        },
        created: function () {
            this.recuperarDatos();
        },
        methods: {
            recuperarDatos: function () {
                this.cabecera = cabecera;
                this.detalle = detalle;
                var fila = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    if ((this.detalle[i]['cantidad']) != (this.detalle[i]["cantdev"])) {
                        fila += '<tr>';
                        fila += '<td colspan="1"><h4> ' + parseInt(i + 1) + '</h4> </td>';
                        fila += '<td colspan="5"> ' + this.detalle[i]["NOMPRO"] + ' </td>';
                        fila += '<td colspan="7">' + this.detalle[i]["NOMLABOR"] + '</td>';
                        fila += '<td colspan="4">' + this.detalle[i]["LOTE"] + '</td>';
                        fila += '<td colspan="3">' + this.detalle[i]["FECHAV"] + '</td>';
                        fila += '<td colspan="3"> <h3> ' + fnGetSelected(this.detalle[i]["COA"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NOABIERTO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["LIMPIO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NOARRUGA"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NOQUEBRADO"]) + ' </h3>  </td>';
                        fila += '<td colspan="2"> <h3> ' + this.detalle[i]["TEMPERA"] + ' </h3>  </td>';
                        fila += '<td colspan="5"> <h3>' + this.detalle[i]['cantidad'] + '</h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + this.detalle[i]["cantoc"] + ' </h3>  </td>';
                        /*fila += '<td colspan="1"> <h3>  </h3>  </td>';*/
                        fila += '<td colspan="1"> <h3> ' + this.detalle[i]["cantdev"] + ' </h3>  </td>';
                        //fila += '<td colspan="4"> <h3> ' + this.detalle[i]["observacion"] + ' </h3>  </td>';
                        fila += '<td colspan="4"> <h3> ' +'----'+ ' </h3>  </td>';
                    }
                }
                this.tbldetalleao = fila;
            }
        }
    });
}

function fnGetSelected(num) {
    if (num == "1")
        return '✓';
    if (num == "0")
        return '-';
    if(num=="")
        return '';
}


function generarPDF() {
    var url = ORIGEN + "/PreIngreso/PIPreingreso/GenerarPDFActaRecepcion";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "ActaDeRecepcion.pdf";
        link.download = fileName;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });
}