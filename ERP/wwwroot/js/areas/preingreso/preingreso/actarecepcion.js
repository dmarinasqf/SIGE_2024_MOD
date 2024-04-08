window.onload = function () {

    llenarCampos();
  
}


function llenarCampos() {
    var app = new Vue({
        el: '#aplicacion',
        data: {
            cabecera: [],
            detalle: [],
            facura:[],
            detallehtml: '',
            leyendaembalaje:''
        },
        created: function () {
            this.recuperarPedido();

        },
        methods: {
            recuperarPedido: function () {
                this.cabecera = JSON.parse(data[0].CABECERA)[0];
                this.detalle = JSON.parse(data[0].DETALLE);
                this.factura = JSON.parse(data[0].FACTURAS)[0];
            
              
                var condicionembalaje = fnbuscarcondicionembalaje(this.detalle);
                var cabeceratabla = document.getElementById('headertabledetalle');
                var header = cabeceratabla.innerHTML;
                for (var i = 0; i < condicionembalaje.length; i++) {
                    header += '<th>' + condicionembalaje[i].split('-')[0]+'</th>';
                }
                cabeceratabla.innerHTML = header;
                var headerrecepcion = document.getElementById('threcepcion');
                headerrecepcion.setAttribute('colspan', parseInt(headerrecepcion.getAttribute('colspan') + condicionembalaje.length));
                var thcondicionemb = document.getElementById('thcondicionemb');
                thcondicionemb.setAttribute('colspan',  condicionembalaje.length);

                var fila = '';
                for (var i = 0; i < this.detalle.length; i++) {
                    var obj = this.detalle[i];
                    fila += '<tr>';
                    fila += '<td>' + (i + 1) + '</td>';
                    fila += '<td>'+obj.producto+'</td>';
                    fila += '<td>'+obj.laboratorio+'</td>';
                    fila += '<td>'+obj.lote+'</td>';
                    fila += '<td>'+obj.fechavencimiento+'</td>';
                    fila += '<td>' + obj.cantidad + '</td>';
                    if (obj.embalaje.length > 0) {
                        for (var j = 0; j < obj.embalaje.length; j++) {
                            if (obj.embalaje[j].valor == 'true')
                                fila += '<td style="width:3%" class="text-center"> ✓</td>';
                            else if (obj.embalaje[j].valor == 'false')
                                fila += '<td style="width:3%" class="text-center"></td>';
                            else
                                fila += '<td style="width:3%" class="text-center">' + obj.embalaje[j].valor + '</td>';
                        }
                    } else {
                        for (var j = 0; j < condicionembalaje.length; j++) {                          
                            fila += '<td style="width:3%"></td>';                         
                        }
                    }
                    fila += '</tr>';
                }
                if (this.detalle.length < 10) {
                    for (var i = this.detalle.length; i <=10; i++) {
                        fila += '<tr>';                        
                        for (var j = 0; j < (6 + condicionembalaje.length); j++) {
                            fila += '<td>&nbsp; </td>';
                        }
                        fila += '<tr>';
                    }
                }
                this.detallehtml = fila;
                var fila = '';
                for (var i = 0; i < condicionembalaje.length; i++) {
                    fila += '<tr>';
                    fila += '<td>' + condicionembalaje[i]+'</td>';
                    fila += '</tr>';
                }
                this.leyendaembalaje = fila;
            }
        }
    });
}
function fnbuscarcondicionembalaje(detalle) {
    var array=[];
    for (var i = 0; i < detalle.length; i++) {
        if (detalle[i].embalaje.length > 0 && array.length==0) {
            var embalaje = detalle[i].embalaje;
            for (var j = 0; j < embalaje.length; j++) {
                array.push(embalaje[j].iditem + '-' + embalaje[j].descripcion);
            }
        }
           
    }
    
    return array;
}
function generarPDF() {
    var url = ORIGEN + "/PreIngreso/PIPreingreso/GenerarPDFActaRecepcion";
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
