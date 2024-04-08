var txtcodigo = $('#txtcodigo');
var cmbalmacen = $('#cmbalmacen');
var cmbareaalmacen = $('#cmbareaalmacen');
var cmbsucursal = $('#cmbsucursal');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    datatable.columnDefs = [      
        {
            "targets": [1],
            "visible": false,
            "searchable": false
        },
        {
            "targets": [3],
            "visible": false,
            "searchable": false
        },
    ];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    });   
});


$('#form-registro-almacen').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Almacen/AAlmacenSucursal/RegistrarEditar/";
    var obj = {
        idalmacen: cmbalmacen.val(),
        idareaalmacen: cmbareaalmacen.val(),
        suc_codigo: cmbsucursal.val(),
        estado: 'HABILITADO'
    };
        //$('#form-registro-almacen').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');                
            } else if (txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                //tbllista.row('.selected').remove().draw(false);
            }
            data.objeto.almacen = $('select[id="cmbalmacen"] option:selected').text();
            data.objeto.areaalmacen = $('select[id="cmbareaalmacen"] option:selected').text();
            listarAlmacenxSucursal(cmbsucursal.val());
            //agregarFila(data.objeto,"almacen");
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            //agregarFila(data.objeto, "almacen");
            listarAlmacenxSucursal(cmbsucursal.val());
            limpiar();
        } else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});


function limpiar() {
    $('#form-registro-insumo').trigger('reset');
    txtoperacion.val("nuevo");    
    //cmbsucursal.val("0");
    txtcodigo.val("");
    cmbalmacen.val("");
    cmbareaalmacen.val("");
    
}

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


function mensajeeliminar(data) {
    swal({
        title: '¿Desea deshabilitar?',
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
            eliminar(data);
        }
        else
            swal.close();
    });
}

function listarAlmacenxSucursal(idsucursal) {
    console.log(idsucursal);
    let controller = new AlmacenSucursalController();
    let params = { idsucursal: idsucursal };
    controller.ListarAlmacenesxSucursal_dt(params, listarAlmacenSucursal);

}
 
function listarAlmacenSucursal(data) {
    
    //var url = ORIGEN + "/Almacen/AAlmacenSucursal/buscarAlmacenxSucursal";
    //var obj = { idsucursal: idsucursal };
    //$.post(url,obj).done(function (data) {       
        tbllista.clear().draw();
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                agregarFila(data[i], 'almacen');
            }
        }
        else {
            mensaje("I","NO HAY INFORMACIÓN");
        }
    //}).fail(function (data) {
    //    console.log(data);
    //    mensaje("D", 'Error en el servidor');
    //});

}
function eliminar(id) {
    var url = ORIGEN + "/Almacen/AAlmacenSucursal/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                listarAlmacenxSucursal(cmbsucursal.val());
                swal("Registro deshabilitado!", {
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

function agregarFila(data, tipo) {


    if (tipo == 'almacen')
    {
        if (data.estado == "HABILITADO") {

            tbllista.row.add([
                data.idalmacensucursal,
                data.idalmacen,
                data.almacen,
                data.idareaalmacen,
                data.areaalmacen,
                `<div class="btn-group btn-group-sm" >
                    <button class="btn btn-sm btn-outline-danger waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Deshabilitar Registro" onclick="mensajeeliminar(`+ data.idalmacensucursal + `)"><i class="fa fa-lock"></i></button>                                                                           
                </div>`

            ]).draw(false);
        }
        if (data.estado == "DESHABILITADO") {

            tbllista.row.add([
                data.idalmacensucursal,
                data.idalmacen,
                data.almacen,
                data.idareaalmacen,
                data.areaalmacen,
                `<div class="btn-group btn-group-sm" >                   
                    <button class="btn btn-sm btn-outline-success waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Habilitar Registro" onClick = "habilitarAlmacen(this,event)"><i class="fa fa-unlock"></i></button>                                                                           
                </div>`

            ]).draw(false);
        }
    }

}
//eventos change

$('#cmbsucursal').change(function () {
 
    if (cmbsucursal.val() == "") {
        $('#btn-registrar').prop("disabled",true);
        tbllista.clear().draw();
    }
    else {
        $('#btn-registrar').prop("disabled", false);
        listarAlmacenxSucursal(cmbsucursal.val());
    }
});

//habilitar y deshabilitar almacenes
function habilitarAlmacen(tabla, evento) {
    var columna = tbllista.row($(tabla).parents('tr')).data();
    console.log(columna);

    if (!evento.target.checked) {
        var url = ORIGEN + "/Almacen/AAlmacenSucursal/Habilitar";
        var data = {
            id: columna[0]
        };
        console.log(data);
        $.post(url, data).done(function (data) {
            if (data.mensaje == "ok") {

                listarAlmacenxSucursal(cmbsucursal.val());
                mensaje('S', 'ALMACÉN HABILITADO');
            }
            else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
    }

}
