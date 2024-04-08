var tblproductosbonificacionbuscar;
var tblproductosbonificacion;

//BONIFICACION
var rdbonimismo = $('#rdbonimismo');
var rdboniotro = $('#rdboniotro');
var txtindexbonificacion = $('#txtindexbonificacion');
var txtiddetallebonificacion = $('#txtiddetallebonificacion');
var txtoperacionbonificar = $('#txtoperacionbonificar');
var txttotalbonificacion = $('#txttotalbonificacion');

var txtidproductoboni = $('#txtidproductoboni');
var txtcodproductoboni = $('#txtcodproductoboni');
var txtproboni = $('#txtproboni');
var txtprecioboni = $('#txtprecioboni');
var txtcanboni = $('#txtcanboni');
var cmbtipobonificacion = $('#cmbtipobonificacion');
var txtpromo1 = $('#txtpromo1');
var txtpromo2 = $('#txtpromo2');
var divpromocion = $('#divpromocion');

var txtfiltroproductosbonificacion = document.getElementById('txtfiltroproductosbonificacion');


$(document).ready(function () {
    tblproductosbonificacionbuscar = $('#tblproductosbonificacionbuscar').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE() ,
        "order": [[1, 'asc']],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]
        
    });
    tblproductosbonificacion = $('#tblproductosbonificacion').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,

        "language": LENGUAJEDATATABLE() ,
        "order": [[1, 'asc']],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },  {
                "targets": [1],
                "visible": false,
                "searchable": false
            }]
        
    });
});

txtfiltroproductosbonificacion.addEventListener('keyup', function (e) {
    if (txtfiltroproductosbonificacion.value.length%2===0)
        listarproductosbucarbonificacion('');
    //listarproductosbucarbonificacion(_idlaboratorioBONI);

});
function listarproductosbucarbonificacion( laboratorio) {
    let controller = new ProductoController();         
    var data = { nombreproducto: (txtfiltroproductosbonificacion.value).trim(),laboratorio: laboratorio,top:10 };
    controller.BuscarProductos(data,
        function (data) {
        tblproductosbonificacionbuscar.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            tblproductosbonificacionbuscar.row.add([
                data[i]['ID'],
                data[i]['CODIGO'],
                data[i]['PRODUCTO'],
                data[i]['LABORATORIO'],
                data[i]['VVF'].toFixed(2),
                data[i]['PVF'].toFixed(2),
                '<button class="btn btn-sm btn-success btnpasarproductobonificacion"><i class="fas fa-check "></i></button>'
            ]).draw(false);
        }
    });
    
}

cmbtipobonificacion.change(function () {
    if (cmbtipobonificacion.val() == 'INAFECTO') {
        divpromocion.removeClass('ocultar');
        txtpromo1.prop('required', true);
        txtpromo2.prop('required', true);
        //rdboniotro.prop('disabled', true);
    }
    else {
        divpromocion.addClass('ocultar');
        txtpromo1.prop('required', false);
        txtpromo2.prop('required', false);
        rdboniotro.prop('disabled', false);

    }
});

$(document).on('click', '.btnquitaritembonificacion', function (e) {
    tblproductosbonificacion.row('.selected').remove().draw(false);  
    calculartotalbonificacion();
});

$('#tblproductosbonificacion tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblproductosbonificacion.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

function buscarbonificacion(id) {
  
    var url = ORIGEN + "/Compras/CCotizacion/getBonificacion";
    var obj = {
        id: id
    };
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data != null) {
            tblproductosbonificacion.clear().draw(false);
            for (var i = 0; i < data.length; i++) {
                tblproductosbonificacion.row.add([

                    data[i].idbonificacion,                    
                    '<span class="MBN_codproducto" idproducto="' + data[i].idproducto+'">' + data[i].codigoproducto + '</span>',
                    data[i].producto,
                    '<span class="MBN_cantidad">'+data[i].cantidad+'</span>',
                    '<span class="MBN_precio">' + data[i].precio.toFixed(5)+'</span>',
                    '<span class="MBN_subtotal">' + (data[i].precio * data[i].cantidad).toFixed(5)+'</span>',                                                      
                    '<span class="MBN_bonipara">' + data[i].tipo+'</span>',                                                      
                    '<span class="MBN_promocion">' + data[i].promocion+'</span>',                                                      
                    '<button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritembonificacion"><i class="fas fa-trash-alt"></i></button>'
                ]).draw(false);
            }
            if (data.length === 1) {
                if (data[0].tipo === "MISMO")
                    rdbonimismo.prop('checked', true);
                else
                    rdboniotro.prop('checked', true);
            }
            else if (data.length > 1)
                rdboniotro.prop('checked', true);

            calculartotalbonificacion();

        }
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}

function guardardatosbonificacion(iddetalle) {
  
    var datatable = tblproductosbonificacion.rows().data();
    var obj2 = new Object(); 
    var arrayaux = []; 
    var filas = document.querySelectorAll("#tblproductosbonificacion tbody tr");  
    filas.forEach(function (e) {
        obj2 = new Object();
        obj2.idbonificacion = 0;
        //obj2.idbonificacion = datatable[i][0];
        obj2.idproducto = document.getElementsByClassName('MBN_codproducto')[c].getAttribute('idproducto');
        obj2.cantidad = parseFloat(document.getElementsByClassName('MBN_cantidad')[c].innerHTML);
        obj2.precio = parseFloat(document.getElementsByClassName('MBN_precio')[c].innerHTML);     
        obj2.iddetallecotizacion = iddetalle;
        
        if (rdbonimismo.prop('checked'))
            obj2.tipo = "MISMO";
        if (rdboniotro.prop('checked'))
            obj2.tipo = "OTRO";
        arrayaux[i] = obj2;
        c++;
    });

    var url = ORIGEN + "/Compras/CCotizacion/guardarBonificacion";
    var obj = {
        array: arrayaux,
        iddetalle:iddetalle
    };
    $.post(url, obj).done(function (data) {
       
        if (data.mensaje === "ok") {
            $('#modalbonificacion').modal('hide');
            setBonificacionTabla();
            calcularMontosDescuentosCostosCantidad();
            if (arrayaux.length>0)
                mensaje('S', 'Bonificacion registrada');
        }
            else
           mensaje('W',data.mensaje);
        $('#modalbonificacion').modal('hide');
        }).fail(function (data) {
            btnguardar.prop('disabled', false);
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
}
function calculartotalbonificacion() {

    var datatable = tblproductosbonificacion.rows().data();
    if (datatable.length === 0) {
        txttotalbonificacion.val(0);
        return;
    }
    var filas = document.querySelectorAll("#tblproductosbonificacion tbody tr");
    var total = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        total = total + parseFloat(document.getElementsByClassName('MBN_subtotal')[c].innerHTML);
        c++;
    });
 
    txttotalbonificacion.val(total.toFixed(5));
}
var _estadobonificacionmodal = true;
$('#rdboniotro').click(function (e) {
    $('#modalproductosbonificacion').modal('show');
    $('#form-bonificacion').trigger('reset');
    //if (_estadobonificacionmodal) {
    //    if (_LISTAPRODUCTOS.length === 0 && _idlaboratorioBONI != "0")
    //        listarproductosbucarbonificacion(_idlaboratorioBONI);
    //    else
            listarproductosbucarbonificacion(_idlaboratorioBONI);
        //_estadobonificacionmodal = false;
    //}
    //tblproductosbonificacion.clear().draw(false);
});
$('#rdbonimismo').click(function (e) {
    $('#form-bonificacion').trigger('reset');
    $('#txtidproductoboni').val(idproboni);
    $('#txtcodproductoboni').val(codproboni);
    $('#txtproboni').val(nomproboni);
    $('#txtprecioboni').val(precproboni);

    tblproductosbonificacion.clear().draw(false);
});

$('#modalbonificacion').on('hidden.bs.modal', function (e) {
    //VER
    fn_MBAgregarArraybonificacionesTabla();
    _idlaboratorioBONI = "0";
    _estadobonificacionmodal = true;
    rdboniotro.prop('checked', false);
    rdbonimismo.prop('checked', false);
    $('#form-bonificacion').trigger('reset');
    tblproductosbonificacion.clear().draw(false);
    txttotalbonificacion.val("0.0");
});
$(document).on('click', '.btnpasarproductobonificacion', function (e) {

    var columna = tblproductosbonificacionbuscar.row($(this).parents('tr')).data();
    $('#txtidproductoboni').val(columna[0]);
    $('#txtcodproductoboni').val(columna[1]);
    $('#txtproboni').val(columna[2]);
    $('#txtprecioboni').val(columna[5]);
    $('#modalproductosbonificacion').modal('hide');
});

/*var listaProductoBoni = [];*/
$('#form-bonificacion').submit(function (e) {
    //AL DAR AÑADIR
    e.preventDefault();
    var obj = $('#form-bonificacion').serializeArray();
    var promocion = '';
    if (obj[0].value.toString().trim() != "") {
        if (buscaritemenbonificacion(obj[0].value)) {
            if (cmbtipobonificacion.val() === 'INAFECTO') {
                txtprecioboni.val('0.00');
                //promocion = txtpromo1.val() + 'x' + txtpromo2.val();
            }
            tblproductosbonificacion.row.add([
                '',
                '<span class="MBN_idproducto" idproducto="' + txtidproductoboni.val() + '">' + txtidproductoboni.val() + '</span>',
                '<span class="MBN_producto">' + txtproboni.val() + '</span>',
                '<span class="MBN_cantidad">' + txtcanboni.val()+ '</span>',
                '<span class="MBN_precio">' + parseFloat( txtprecioboni.val()).toFixed(2) + '</span>',
                '<span class="MBN_subtotal">' + (parseFloat( txtprecioboni.val()) *parseFloat( txtcanboni.val())).toFixed(2) + '</span>',
                '<span class="MBN_bonipara">' + cmbtipobonificacion.val() + '</span>',
                '<span class="MBN_promocion">' + promocion + '</span>',
                ' <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritembonificacion" idboni=""><i class="fas fa-trash-alt"></i></button>'
            ]).draw(false);
            //var productoBoni = [{ "idproducto": txtidproductoboni.val(), "cantidad": txtcanboni.val(), "precio": txtprecioboni.val() }]
            //listaProductoBoni.push(productoBoni);
            $('#form-bonificacion').trigger('reset');
            calculartotalbonificacion();
        } else
            mensaje('I', 'El item se encuentra en la tabla');
    }
});
function buscaritemenbonificacion(id) {
    var filas = tblproductosbonificacion.rows().data();
    for (var i = 0; i < filas.length; i++) {
        if (FN_GETDATOHTML(filas[i][1],'MBN_idproducto') === id.trim()) {
            return false;
        }
    }
    return true;
}
function fn_MBAgregarArraybonificacionesTabla() {
    //VER
    var index = txtindexbonificacion.val();
    var obj = new Object();
    var filas = tblproductosbonificacion.rows().data();
    var obj2 = new BonificacionCotizacion();
   
    var arrayaux = [];
    var filas = document.querySelectorAll("#tblproductosbonificacion tbody tr");
    var datatable = tblproductosbonificacion.rows().data();
    var i = 0;
    

    filas.forEach(function (e) {
        if (datatable.length != 0) {
            obj2 = new BonificacionCotizacion();
            obj2.idproducto = FN_GETDATOHTML(datatable[i][1], 'MBN_idproducto');
            obj2.promocion = e.getElementsByClassName('MBN_promocion')[0].innerText;
            obj2.cantidad = parseFloat(e.getElementsByClassName('MBN_cantidad')[0].innerHTML);
            obj2.producto = e.getElementsByClassName('MBN_producto')[0].innerHTML;
            obj2.precio = parseFloat(e.getElementsByClassName('MBN_precio')[0].innerHTML);
            obj2.iddetallecotizacion = txtiddetallebonificacion.val() === '' ? 0 : txtiddetallebonificacion.val();
            obj2.tipo = cmbtipobonificacion.val();
            obj2.idbonificacion = datatable[i][0] === '' ? 0 : datatable[i][0];
            arrayaux[i] = obj2;
            i++;
        }
    });
    obj.array = arrayaux;

    array_retornoModalBoni = arrayaux;
    
    obj.index = index;
    var indexaux = getindexbonificaciones(index);
    if (indexaux != -1)
        _ARRAYBONIFICACIONES[indexaux] = obj;
    else
        _ARRAYBONIFICACIONES.push(obj);
    setBonificacionTabla();
    $('#modalbonificacion').modal('hide');

    calcularMontosDescuentosCostosCantidad();
}
$('#btnaceptarbonificacion').click(function (e) {
    fn_MBAgregarArraybonificacionesTabla();
});
