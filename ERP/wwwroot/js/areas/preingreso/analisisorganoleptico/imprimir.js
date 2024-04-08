//EARTCOD1017//
var app;
var ORIGEN = location.origin.toString();
window.onload = function () {
    llenarCampos();
    //var texto = this.empresa.ruc + '|' + this.cabecera.doctribcodigosunat + '|' +
    //    this.cabecera.serie + '|' + this.cabecera.numdocumento + '|' + app.igv+ '|' +
    //    app.total + '|' + this.cabecera.fecha.substring(0, 10) + '|' +
    //    this.cabecera.tipodocclientesunat + '|' + this.cabecera.numdoccliente + '|';
    //this.GenerarQR(texto);
    this.setTimeout(function () {
        //window.print();
    }, 1000);
}

function llenarCampos() {
    console.log(detalle);
     app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: new Object(),
            detalle: new Object(),        
            categoria: new Object(),        
            caracteristica: new Object(),        
            detallehtml: '',
            total: 0
        },
        created: function () {
            this.recuperarDatos();
        },
        methods: {
            recuperarDatos: function () {
                console.log(fnGetSelected(10));
                this.cabecera = cabecera;
                this.detalle = detalle;                
                this.categoria = categoria;
                this.caracteristica = caracteristica;                
                this.condicionembalaje = condicionembalaje;                
                var fila = '';
                    for (var i = 0; i < this.detalle.length; i++) {
                        fila += '<tr>';
                        fila += '<td colspan="1"><h4> ' + parseInt(i + 1) + '</h4> </td>';
                        fila += '<td colspan="3"> ' + this.detalle[i]["PRODUCTO"] + ' </td>';
                        fila += '<td colspan="2">' + this.detalle[i]["LABORATORIO"] + '</td>';
                        fila += '<td colspan="2">' + this.detalle[i]["LOTE"] + '</td>';
                        fila += '<td colspan="2">' + this.detalle[i]["FECHAVENCE"] + '</td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NO ABIERTO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["LIMPIO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NO ARRUGADO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["NO QUEBRADO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["CA"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["TA"]) + ' </h3>  </td>';
                        fila += '<td colspan="2">' + this.detalle[i]["CANTIDAD PREINGRESO"] + '</td>';
                        fila += '<td colspan="2">' + this.detalle[i]["CANTIDAMUESTRA"] + '</td>';                        
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI IDENTIFICACION"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI CONTENIDOCOMPLETO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI INTEGRIDADLIMPIEZA"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI SEGURIDADSELLO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI ROTULADO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EI CONFORMIDADREQPRO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3>  </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM IDENTIFICACION"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM CONTENIDOCOMPLETO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM INTEGRIDADLIMPIEZA"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM SEGURIDADSELLO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM ROTULADO"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["EM CONFORMIDADREQPRO"]) + ' </h3>  </td>';
                        //fila += '<td colspan="1"> <h3>  </h3>  </td>';
                        //fila += '<td colspan="1"> <h3> </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["COLOR"]) + ' </h3>  </td>';
                        fila += '<td colspan="1"> <h3> ' + fnGetSelected(this.detalle[i]["FORMA"]) + ' </h3>  </td>';
                        fila += '<td colspan="4"> <h3> ' + fnGetSelected(this.detalle[i]["OLOR"]) + ' </h3>  </td>';
                        fila += '<td colspan="2"> <h3>' + this.detalle[i]["RESULTADO"] + ' </h3></td>';

                    }
               
                this.tbldetalleao = fila;
            }
        }
    });
}

function fnGetSelected(num) {
    if (num > 0)
        return '✓';
    else
        return '-';
}


function generarPDF() {
    var url = ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/GenerarPDF";
    var obj = { url: location.pathname };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "AnalisisOrganoleptico.pdf";
        link.download = fileName;
        link.click();

    }).fail(function (data) {
        mensajeError(data);
    });

}