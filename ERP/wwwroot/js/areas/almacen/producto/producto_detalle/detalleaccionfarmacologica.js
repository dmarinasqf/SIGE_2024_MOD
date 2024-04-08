var _listaDAccionFarmacologica = [];
var tbldetalleaccionfarmacologico;
var tbldetallegenericos;
//VARIABLES GENERALES DE PRODUCTO
var txtidproducto = $('#txtidproducto');
//variales de detalle generico
var txtidproductogenerico = $('#txtidproductogenerico');
var txtuma = $('#txtuma');
var txtproductonombre = $('#txtproductonombre');

//botones de detalle generico
var btnagregardetallegenerico = $('#btnagregardetallegenerico');
var btnbusquedadetallegenerico = $('#btnbusquedadetallegenerico');


//variales de detalle accion farmacologico
var txtidaccionfarma = $('#txtidaccionfarma');
var txtaccionfarma = $('#txtaccionfarma');

//botones de detalle accion farmacologico
var btnagregaraccionfarma = $('#btnagregaraccionfarma');
var btnbusquedaaccionfarma = $('#btnbusquedaaccionfarma');
var objid=0;

//MODALES
var modalproductos = $('#modalproductos');
var modalaccionesfama = $('#modalaccionesfama');

//VARIABLE ESTADO
var va=1;
var estadoboton = "";


$(document).ready(function () {   
    tbldetalleaccionfarmacologico = $('#tbldetalleaccionfarmacologico').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA DE CLASES DE PRODUCTO ', 'V', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });
    tbldetallegenericos = $('#tbldetallegenericos').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA DE CLASES DE PRODUCTO ', 'V', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });

    var url = location.search.replace("?", "");
    var arrUrl = url.split("&");
    var urlObj = {};
    for (var i = 0; i < arrUrl.length; i++) {
        var x = arrUrl[i].split("=");
        urlObj[x[0]] = x[1];
    }
    objid = urlObj.id;
    buscarDetalleGenerico(txtidproducto.val());
    buscarDetalle_accionfarma(txtidproducto.val());
    document.getElementById('btn_detallegenerico').style.pointerEvents = 'none';
    $('#btn_detallegenerico').removeClass("btn-primary").addClass("btn-secondary");
    //document.getElementById('btn_detallegenerico').style.color = '#bbb';
    if (urlObj.va !== undefined) {
        deshab();
        va = urlObj.va;
    }
});

function deshab() {
    estadoboton = "disabled";
    btnagregaraccionfarma.prop("disabled", true);
    btnagregardetallegenerico.prop("disabled", true);

    btnbusquedaaccionfarma.prop("disabled", true);
    btnbusquedadetallegenerico.prop("disabled", true);
}
//poner los id en los botones
function getIds(id) {
    $('#btn_editarproductos').attr("href", $("#btn_editarproductos").attr("href") + '?id=' + id);
    $('#btn_detallegenerico').attr("href", $('#btn_detallegenerico').attr("href") + '?id=' + id);
}
//CRUD
function descativarboton() {
    //$('#btn_editarproductos ').prop("disabled", false);
    $('#btn_detallegenerico').prop("disabled", true);
}

function guardarDetalleGenerico() {
    var url = ORIGEN + "/Almacen/AProductoDetalle/RegistrarDetalleGenerico";
    var obj = {
        idproducto: txtidproducto.val(),
        idproductogenerico: txtidproductogenerico.val(),
        descripcion:''     
    };
    console.log(obj);
    btnagregardetallegenerico.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Registro guardado');
            data.objeto.nombreabreviado = txtproductonombre.val();
            data.objeto.unidadmedida = txtuma.val();
            agregarFilas(data.objeto, "DETALLE_GENERICO");
            limpiar_detallegenerico();

        } else {
            mensaje('W', data.mensaje);
            limpiar_detallegenerico();
        }
        
    }).fail(function (data) {
        btnagregardetallegenerico.prop('disabled', false);
        console.log(data);
        mensajeError(data);
    });
}




function agregarFilas(data, tipo) {
    //var estadoboton = "";
    //console.log(data);
    //if (va === 0) { estadoboton = "disabled"; console.log(estadoboton);}
    if (tipo ==="DETALLE_GENERICO") {
        tbldetallegenericos.row.add([
            data.iddetallegenerico,
            data.idproductogenerico,
            data.nombreabreviado,
            //data.idtipoproducto,
            data.unidadmedida,
            `<div class="btn-group btn-group-sm" >      
            <button class="btn btn-sm btn-outline-danger waves-effect  font-10" onclick="mensajeeliminardetallegenerico(`+ data.iddetallegenerico + `)" ` + estadoboton +`><i class="fa fa-trash"></i></button>                                                                   
            </div>`
        ]).draw(false);
    }
    if (tipo === "DETALLE_ACCIONFARMA") {
        tbldetalleaccionfarmacologico.row.add([
            data.iddetalleaccionfarma,
            data.idaccionfarma,
            data.acccionfarmacologica,
            `<div class="btn-group btn-group-sm" >      
            <button class="btn btn-sm btn-outline-danger waves-effect  font-10" onclick="mensajeeliminardetalle_accionfarma(`+ data.iddetalleaccionfarma + `)" ` + estadoboton +`><i class="fa fa-trash"></i></button>                                                                   
            </div>`
        ]).draw(false);
    }
}


function buscarDetalleGenerico(id) {
    var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarDetalleGenerico";
    var obj = {id: id};
   // console.log(obj);    
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") { 
            if (data.objeto !== null) {
                for (var i = 0; i < data.objeto.length; i++) {
                    agregarFilas(data.objeto[i], "DETALLE_GENERICO");
                }
                
            }
            else {
                mensaje('W', "NO TIENE GÉNERICOS");
            }
        } else {
            mensaje('W', data.mensaje);            
        }

    }).fail(function (data) {        
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
$(document).on('click', '.btnpasarproducto', function (e) {
    var columna = tbl_CBPtabla.row($(this).parents('tr')).data();
    txtidproductogenerico.val(columna[0]);
    txtproductonombre.val(FN_GETDATOHTML(columna[2], 'nombreproducto'));
    txtuma.val(columna[5]);
    modalproductos.modal('hide');
    btnagregardetallegenerico.prop("disabled", false);
});

//EVENTOS CLICK
btnbusquedadetallegenerico.click(function () {
    
});

//LIMPIAR

function limpiar_detallegenerico() {
    txtidproductogenerico.val('');
    txtproductonombre.val('');
    txtuma.val('');
   
}
//crear clases 
class DetalleGenerico {
    constructor(iddetallegenerico, idproducto, idproductogenerico, descripcion) {
        this.iddetallegenerico = iddetallegenerico;
        this.idproducto = idproducto;
        this.idproductogenerico = idproductogenerico;
        this.descripcion = descripcion;           
    }
}

function mensajeeliminardetallegenerico(data) {
    swal({
        title: '¿Desea eliminar?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            eliminardetallegenerico(data);
        }
        else
            swal.close();
    });
}
function eliminardetallegenerico(id) {
    var url = ORIGEN + "/Almacen/AProductoDetalle/EliminarDetalleGenerico/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbldetallegenericos.row('.selected').remove().draw(false);
                swal("Registro eliminado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

$('#tbldetallegenericos tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetallegenericos.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


/*---------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------DETALLE DE ACCIÓN FARMACOLOGICA---------------------------*/

function guardarDetalleAccionFarma() {
    var url = ORIGEN + "/Almacen/AProductoDetalle/RegistrarDetalleAccionFarmacologico";
    var obj = {
        //iddetalleaccionfarma: txtidaccionfarma.val(),
        idaccionfarma: txtidaccionfarma.val(),
        idproducto: txtidproducto.val()
    };
    console.log(obj);
    btnagregaraccionfarma.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Registro guardado');
            data.objeto.acccionfarmacologica = txtaccionfarma.val();
            agregarFilas(data.objeto, "DETALLE_ACCIONFARMA");
            limpiar_detalle_accionfarma();

        } else {
            mensaje('W', data.mensaje);
            limpiar_detalle_accionfarma();
        }

    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}


function buscarDetalle_accionfarma(id) {
    var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarDetalleAccionFarma";
    var obj = { id: id };
    // console.log(obj);    
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (data.objeto !== null) {
                for (var i = 0; i < data.objeto.length; i++) {
                    agregarFilas(data.objeto[i], "DETALLE_ACCIONFARMA");
                }

            }
            else {
                mensaje('W', "NO TIENE GÉNERICOS");
            }
        } else {
            mensaje('W', data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}

$(document).on('click', '.btnpasaraccionfarma', function (e) {
    var columna = tblaccionesfarma.row($(this).parents('tr')).data();
    txtidaccionfarma.val(columna[0]);
    txtaccionfarma.val(columna[1]);
    modalaccionesfama.modal('hide');
    btnagregaraccionfarma.prop("disabled", false);
});

function limpiar_detalle_accionfarma() {
    txtidaccionfarma.val('');
    txtaccionfarma.val('');   

}

function mensajeeliminardetalle_accionfarma(data) {
    swal({
        title: '¿Desea eliminar?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            eliminardetalle_accionfarma(data);
        }
        else
            swal.close();
    });
}
function eliminardetalle_accionfarma(id) {
    var url = ORIGEN + "/Almacen/AProductoDetalle/EliminarDetalleAccionFarmacologico/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbldetalleaccionfarmacologico.row('.selected').remove().draw(false);
                swal("Registro eliminado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

$('#tbldetalleaccionfarmacologico tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalleaccionfarmacologico.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
