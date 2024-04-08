var _INDEX = 0;
var _ROWCOLUMN = 0;
var tbllistaModal;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.paging = false;
    datatable.ordering = false;
    datatable.buttons = [];

    datatable.columnDefs = [
        {
            "targets": [0],
            "visible": false,
            "searchable": false
        },
    ];

    var util = new UtilsSisqf();
    tbllistaModal = util.Datatable('tbllistaModal', false, datatable);
});

$('#btnAgregarProducto').click(function (e) {
    $('#modalDetalleCotizacion').modal('show');
});
$('#btnaddproducto').click(function (e) {
    $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
    $('#modalproductoproveedorlaboratorio').modal('show');
    listarlaboratoriosproveedor("");
});
$(document).on('click', '.btnpasarproductoxlaboratorio', function () {
    var fila = tblproductosxlaboratoriodeproveedor.row($(this).parents('tr')).data();
    //$('#modalproductoproveedorlaboratorio').modal('hide');

    var obj = new Object();
    obj.idlaboratorio = FN_GETDATOHTML(fila[0], 'idlaboratorio');
    obj.laboratorio = fila[3];
    obj.idunidadmedida = FN_GETDATOHTML(fila[0], 'idum');
    obj.idproducto = FN_GETDATOHTML(fila[0], 'idproducto');
    obj.codigoproducto = fila[1];
    obj.producto = FN_GETDATOHTML(fila[2], 'nombreproducto');
    obj.unidadmedida = fila[4];
    obj.vvf = fila[5];
    obj.pvf = fila[6];
    obj.dsc2 = FN_GETDATOHTML(fila[0], 'dsc2');
    obj.dsc3 = FN_GETDATOHTML(fila[0], 'dsc3');
    agregarProductoTerminado(obj);
    this.parentNode.parentNode.classList.remove('selected');
    //calcularMontosDescuentosCostosCantidad();
});

function agregarProductoTerminado(data) {

    _INDEX = _INDEX + 1;
    var cantidadtext = '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="0"/>';
    var auxtfila;
    auxtfila = tbllistaModal.row.add([
        '<label class="detalle_iddetalle"></label>' +
        '<label class="detalle_idlab">' + data.idlaboratorio + '</label>' +
        '<label class="detalle_iduma">' + data.idunidadmedida + '</label>' +
        '<label class="detalle_idump">' + '' + '</label>' +
        '<label class="detalle_equivalencia">1</label>' +
        '<label class="detalle_idpro">' + data.idproducto + '</label>' +
        //'<label class="detalle_bonificacion">0</label>'+     
        '<label class="detalle_index" >' + _INDEX + '</label>' +
        '<label class="detalle_idpropro"></label>',
        //ACA onkeydown="movertabla('+_INDEX +')"
        '<input class="index font-13 inputdetalle iddetalle" readonly  rowp=' + (_ROWCOLUMN) + '></input>',
        '<label class="detalle_codpro" idproducto="' + data.idproducto + '"  idproveedor="' + txtidproveedor.val() + '">' + data.codigoproducto + '</label>',
        '<label class="detalle_nompro">' + data.producto + '</label>',
        'A', 'A',
        '<label class="laboratorio">' + data.laboratorio + '</label>',
        cantidadtext,
        data.unidadmedida,
        '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + data.vvf + '"/>',
        '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + data.pvf + '"/>',
        ' <button class="btnbonificacion" valor="0">....<label class="returnmodal" hidden></label></button>',
        '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + data.dsc2 + '" />',//_DES1Pro
        '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + data.dsc2 + '" />',
        '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + data.dsc3 + '" />',
        '<input type="number" class="text-center txtprecio inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtprecioigv inputdetalle" min="0"  value="0" disabled/>',
        ` <div class="">
            <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        </div>`
    ]).draw(false);
    $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    $(auxtfila).attr({ 'onkeydown': 'movertabla(' + _INDEX + ')' });
    tbllistaModal.columns.adjust().draw();
    $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });
    agregarindex();
}


function agregarindex() {
    var filas = document.querySelectorAll("#tbllistaModal tbody tr td input");
    var tr = document.querySelectorAll("#tbllistaModal tbody tr");
    var c = 0, p = 1;
    tr.forEach(function (e) {
        e.onkeydown = function onkeydown() { movertabla(p) };
        p++;
    });
    filas.forEach(function (e) {
        try {
            document.getElementsByClassName("iddetalle")[c].value = (c + 1).toString();//(c + 1);
        } catch (e) { }
        c++;
    });
}
//function agregarindex() {
//    var filas = document.querySelectorAll("#tbllista tbody tr input");
//    var c = 0;
//    filas.forEach(function (e) {
//        e.textContent = (c + 1);
//        c++;
//    });
//}

$(document).on('keyup', '.txtcantidadDetalle', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtvvf', function () {
    try { calcularmontos(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtpvf', function () {
    try { calcularmontosconIGV(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes1', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes2', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes3', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});

function calcularmontos() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var s_total = 0;
        var total = 0;
        var vvf = 0.0;
        var pvf = 0.0;
        var cantidad = 0.0;
        var equivalencia = 0.0;
        var des1 = 0.0;
        var des2 = 0.0;
        var des3 = 0.0;
        var costo = 0.0;
        var costofacturar = 0.0;
        cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
        if (isNaN(cantidad) || cantidad === 0) {
            document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
            cantidad = 0;
        }
        equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
        if (isNaN(equivalencia))
            equivalencia = 0;
        try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { console.log('Error en equivalencia'); }

        des1 = document.getElementsByClassName("txtdes1")[c].value;
        des2 = document.getElementsByClassName("txtdes2")[c].value;
        des3 = document.getElementsByClassName("txtdes3")[c].value;
        vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value);
        if (isNaN(vvf) || vvf === 0) {
            document.getElementsByClassName("txtvvf")[c].value = 0;
            vvf = 0;
        }
        document.getElementsByClassName("txtpvf")[c].value = parseFloat(vvf + IGV * vvf).toFixed(2);
        pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value);
        if (isNaN(pvf) || pvf === 0) {
            document.getElementsByClassName("txtpvf")[c].value = 0;
            pvf = 0;
        }

        var idproducto = 0;
        try { idproducto = parseFloat(document.getElementsByClassName("detalle_codpro")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
        var boni = 0;
        try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

        total = parseFloat(pvf * cantidad);
        if (!(des1 === 0))
            total = parseFloat(total - (total * (des1 / 100))).toFixed(2);
        if (!(des2 === 0))
            total = parseFloat(total - (total * (des2 / 100))).toFixed(2);
        if (!(des3 === 0))
            total = parseFloat(total - (total * (des3 / 100))).toFixed(2);

        if (boni > 0) {
            var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
            var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
            if (sDatosSeparados.length > 0) {
                for (var i = sDatosSeparados.length; 0 < i;) {
                    if (idproducto == sDatosSeparados[i - 3]) {
                        var cantidad_parcial = 0;
                        cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                        costo = parseFloat(total / cantidad_parcial).toFixed(2);
                    } else {
                        total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(2)).toFixed(2);
                        costo = parseFloat(total / cantidad).toFixed(2);
                    }
                    i -= 3;
                }
            }
        } else
            costo = parseFloat(total / cantidad).toFixed(2);

        costofacturar = costo;
        s_total = ((total * 100) / (100 + (IGV * 100)));

        document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(2).toString());
        document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(2).toString());
        document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
        document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);

        c++;
    });
}
function calcularmontosconIGV() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var s_total = 0;
        var total = 0;
        var vvf = 0.0;
        var pvf = 0.0;
        var cantidad = 0.0;
        var equivalencia = 0.0;
        var des1 = 0.0;
        var des2 = 0.0;
        var des3 = 0.0;
        var costo = 0.0;
        var costofacturar = 0.0;

        cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
        if (isNaN(cantidad) || cantidad === 0) {
            document.getElementsByClassName("txtcantidadDetalle")[c].value = "0";
            cantidad = 0;
        }
        equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
        if (isNaN(equivalencia))
            equivalencia = 0;

        des1 = document.getElementsByClassName("txtdes1")[c].value;
        des2 = document.getElementsByClassName("txtdes2")[c].value;
        des3 = document.getElementsByClassName("txtdes3")[c].value;
        pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(2);
        if (isNaN(pvf) || pvf === 0) {
            document.getElementsByClassName("txtpvf")[c].value = 0;
            pvf = 0;
        }

        try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { console.log('Error en equivalencia'); }

        if (pvf != 0)
            vvf = document.getElementsByClassName("txtvvf")[c].value = ((pvf * 100) / (100 + IGV)).toFixed(2);

        if (isNaN(vvf) || vvf === 0) {
            document.getElementsByClassName("txtvvf")[c].value = 0;
            vvf = 0;
        }

        var idproducto = 0;
        try { idproducto = parseFloat(document.getElementsByClassName("detalle_codpro")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
        var boni = 0;
        try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

        total = (pvf * cantidad).toFixed(2);
        if (!(des1 === 0))
            total = parseFloat(total - (total * (des1 / 100))).toFixed(2);
        if (!(des2 === 0))
            total = parseFloat(total - (total * (des2 / 100))).toFixed(2);
        if (!(des3 === 0))
            total = parseFloat(total - (total * (des3 / 100))).toFixed(2);

        if (boni > 0) {
            var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
            var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
            if (sDatosSeparados.length > 0) {
                for (var i = sDatosSeparados.length; 0 < i;) {
                    if (idproducto == sDatosSeparados[i - 3]) {
                        var cantidad_parcial = 0;
                        cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                        costo = parseFloat(total / cantidad_parcial).toFixed(2);
                    } else {
                        total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(2)).toFixed(2);
                        costo = parseFloat(total / cantidad).toFixed(2);
                    }
                    i -= 3;
                }
            }
        } else
            costo = parseFloat(total / cantidad).toFixed(2);

        costofacturar = costo;
        s_total = ((total * 100) / (100 + (0.18 * 100)));//IGV

        document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(2).toString());
        document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(2).toString());
        document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
        document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);

        c++;
    });
}
function calcularMontosDescuentosCostosCantidad() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var s_total = 0;
        var total = 0;
        var vvf = 0.0;
        var pvf = 0.0;
        var cantidad = 0.0;
        var equivalencia = 0.0;
        var des1 = 0.0;
        var des2 = 0.0;
        var des3 = 0.0;
        var costo = 0.0;
        var costofacturar = 0.0;
        cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
        if (isNaN(cantidad) || cantidad === 0) {
            document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
            cantidad = 0;
        }
        equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
        if (isNaN(equivalencia))
            equivalencia = 0;
        try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { console.log('Error en equivalencia'); }

        des1 = document.getElementsByClassName("txtdes1")[c].value;
        des2 = document.getElementsByClassName("txtdes2")[c].value;
        des3 = document.getElementsByClassName("txtdes3")[c].value;
        vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value).toFixed(2);
        if (isNaN(vvf) || vvf === 0) {
            document.getElementsByClassName("txtvvf")[c].value = 0;
            vvf = 0;
        }
        pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(2);
        if (isNaN(pvf) || pvf === 0) {
            document.getElementsByClassName("txtpvf")[c].value = 0;
            pvf = 0;
        }

        var idproducto = 0;
        try { idproducto = parseFloat(document.getElementsByClassName("detalle_codpro")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
        var boni = 0;
        try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

        total = (pvf * cantidad).toFixed(2);
        if (!(des1 === 0))
            total = parseFloat(total - (total * (des1 / 100))).toFixed(2);
        if (!(des2 === 0))
            total = parseFloat(total - (total * (des2 / 100))).toFixed(2);
        if (!(des3 === 0))
            total = parseFloat(total - (total * (des3 / 100))).toFixed(2);

        if (boni > 0) {
            var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
            var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
            if (sDatosSeparados.length > 0) {
                for (var i = sDatosSeparados.length; 0 < i;) {
                    if (idproducto == sDatosSeparados[i - 3]) {
                        var cantidad_parcial = 0;
                        cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                        costo = parseFloat(total / cantidad_parcial).toFixed(2);
                    } else {
                        total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(2)).toFixed(2);
                        costo = parseFloat(total / cantidad).toFixed(2);
                    }
                    i -= 3;
                }
            }
        } else
            costo = parseFloat(total / cantidad).toFixed(2);

        costofacturar = costo;
        s_total = ((total * 100) / (100 + (0.18 * 100)));//IGV

        document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(2).toString());
        document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(2).toString());
        document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
        document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);

        c++;
    });
}
function calcularTotal() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var subtotal = 0.0;
    var impuesto = 0.0;
    var totalfactura = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        try {
            subtotal += parseFloat(document.getElementsByClassName("txtprecio")[c].value);
        } catch (e) { }
        try {
            totalfactura += parseFloat(document.getElementsByClassName("txtprecioigv")[c].value);
        } catch (e) { }
        c++;
    });
    impuesto = totalfactura - subtotal;
    $('#lblsubtotal').text(subtotal.toFixed(2));
    $('#lblimpuesto').text(impuesto.toFixed(2));
    $('#lbltotalfactura').text(totalfactura.toFixed(2));
    $('#lbltotal').text(totalfactura.toFixed(2));
}

function movertabla(idtr) {
    test(event, idtr);
}
function test(event, idtr) {
    const value = event.target.value;
    const rowp = event.target.attributes['rowp'].value;
    idtr = parseFloat(value);
    if (event.keyCode == '40') {
        //ArrowDown
        tbllista.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                rpt = rs + 1;
            }
            if (filas.length >= rpt) {
                if (rs == rpt) {
                    e.className = e.className + ' selected';
                    (e.getElementsByClassName('iddetalle')[0]).focus();
                }
            } else {
                filas.forEach(function (e) {
                    var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                    if (rs == filas.length) {
                        e.className = e.className + ' selected';
                        (e.getElementsByClassName('iddetalle')[0]).focus();
                    }
                });
            }
        });
    }
    if (event.keyCode == '38') {
        //ArrowUp
        tbllista.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                rpt = rs - 1;
                if (rpt > 0) {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                        if (rs == rpt) {
                            e.className = e.className + ' selected';
                            (e.getElementsByClassName('iddetalle')[0]).focus();
                        }
                    });
                } else {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                        if (rs == 1) {
                            e.className = e.className + ' selected';
                            (e.getElementsByClassName('iddetalle')[0]).focus();
                        }
                    });
                }
            }
        });
    }
    if (event.keyCode == '113') {
        //F2
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                e.getElementsByClassName('btnanalisisproducto ')[0].click();
            }
        });
    }
    if (event.keyCode == '13') {
        //ENTER
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var c = 0;
        filas.forEach(function (e) {
            try {
                var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                if (rs == idtr) {
                    e.childNodes()
                    /*if (parseFloat(e.attributes['rowp'].value) == parseFloat(rowp) + 1) {
                        this.focus();
                    }*/
                }
            } catch (e) { }
            c++;
        });
    }
}