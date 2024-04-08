window.onload = function () {

        llenarCampos();
 
    /*llenarCampos()*/;
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
            total:0,
            totaligv: 0,
            detallehtml:''
            

        },
        created: function () {
            this.recuperarPedido();
            //this.llenarDetalle();
        },
        methods: {
            recuperarPedido: function () {
                this.cabecera = (CABECERA);
                this.detalle = (DETALLE);
                this.empresa = (EMPRESA);

                //const mapProductoBoniGeneral = new Map();
                //for (var i = 0; i < this.detalle.length; i++) {
                //    if (this.detalle[i]['BONIFICACIONES'] === null)
                //        this.detalle[i]['BONIFICACIONES'] = [];

                //    mapProductoBoniGeneral.set(this.detalle[i]['IDPRODUCTO'], parseFloat(this.detalle[i]['BONI']));
                //    if (this.detalle[i]['BONIFICACIONES'] != null) {
                //        for (var j = 0; j < this.detalle[i]['BONIFICACIONES'].length; j++) {
                //            var boni = this.detalle[i]['BONIFICACIONES'][j];
                //            if (this.detalle[i]['IDPRODUCTO'] == boni.idproducto) {
                //                var BonificacionTotal = mapProductoBoniGeneral.get(this.detalle[i]['IDPRODUCTO']);
                //                //mapProductoBoniGeneral.delete(this.detalle[i]['IDPRODUCTO']);
                //                mapProductoBoniGeneral.set(this.detalle[i]['IDPRODUCTO'], parseFloat(BonificacionTotal - (boni.precio * boni.cantidad)));
                //            }
                //        }
                //    }
                //}
              
                for (var i = 0; i < this.detalle.length; i++) {
                    this.subtotal += this.detalle[i]['SUBTOTAL'];
                    this.total += this.detalle[i]['TOTAL'];
                    if (this.detalle[i]['BONIFICACIONES'] === null)
                        this.detalle[i]['BONIFICACIONES'] = [];
                    if (this.detalle[i]['BONIFICACIONCLIENTE'] === null)
                        this.detalle[i]['BONIFICACIONCLIENTE'] = [];     

                    //for (let clave of mapProductoBoniGeneral.keys()) {
                    //    if (clave == this.detalle[i]['IDPRODUCTO']) {
                    //        this.detalle[i]['BONI'] = mapProductoBoniGeneral.get(clave);
                    //    }
                    //}

                    var fila = '<tr>';
                    var codigo = '<span>' + this.detalle[i]['COD_PROD_QF'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['COD_PRO_PROVEEDOR'] + '</span >' : '');
                    var nombre = '<span>' + this.detalle[i]['DESCRIPCION_PROD_QF'] + '</span>' + (+ this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['DESCRIPCION_PRO_PROVEEDOR'] + '</span >' : '');
                    var cantidad = '<span>' + this.detalle[i]['CANTIDAD'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['CANTIDADPROVEEDOR'] + '</span >' : '');
                    var unidad = '<span>' + this.detalle[i]['UMA_DES'] + '</span>' + (this.detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '<br /> <span>' + this.detalle[i]['UMP_DES'] + '</span >' : '');
                    fila += '<td>' + (i + 1) + '</td>'+
                        '<td>'+ codigo + '</td>'+
                         '<td>'+ nombre + '</td>'+
                        '<td style="font-size:8px">'+ this.detalle[i]['LABORATORIO'] + '</td>'+
                         '<td>'+ cantidad + '</td>'+                        
                        ' <td>'+ unidad + '</td>'+                                                
                       ' <td>'+ this.detalle[i]['PVF'].toFixed(3) + '</td>'+
                       ' <td>'+ this.detalle[i]['DES1'] + '</td>'+
                       ' <td>'+ this.detalle[i]['DES2'] + '</td>'+
                       ' <td>'+ this.detalle[i]['DES3'] + '</td>'+
                       ' <td>'+ this.detalle[i]['BONI'].toFixed(3) + '</td>'+
                       ' <td>'+ this.detalle[i]['COSTO'].toFixed(3) + '</td>'+
                       ' <td>'+ this.detalle[i]['TOTAL'].toFixed(3) + '</td>';
                    fila += '</tr>';
                    if (this.detalle[i]['BONIFICACIONES']!=null)
                        for (var j = 0; j < this.detalle[i]['BONIFICACIONES'].length; j++) {
                            var boni = this.detalle[i]['BONIFICACIONES'][j];
                            fila += '<tr><td>Bonif a</td>'+
                            '<td> '+ boni.tipo + '</td>'+
                             '<td>'+ boni.producto + '</td>'+
                            '<td></td>'+
                             '<td>'+ boni.cantidad + '</td>'+                        
                             '<td></td>'+                                                
                            '<td>'+ boni.precio.toFixed(3) + '</td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>'+
                            '<td></td>';
                            fila += '</tr>';
                        }
                   
                    this.detallehtml += fila;
                     //$('#tbodydetalle').append(fila);
                }       
              
                this.totaligv = REDONDEAR_DECIMALES(this.total - this.subtotal, 2);
               
            },
        }
    });
}

function generarPDF() {
    var url = ORIGEN + "/Compras/CCotizacion/GenerarPDF";
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
function REDONDEAR_DECIMALES(num, numdecimales) {
    if (numdecimales === null || isNaN(numdecimales) || numdecimales === 0)
        numdecimales = 2;
    return +(Math.round(num + "e+" + numdecimales) + "e-" + numdecimales);
}


