var MRV_txtcodigo = $('#MRV_txtcodigo');
var MRV_txtoperacion = $('#MRV_txtoperacion');
var MRV_txtmarca = $('#MRV_txtmarca');
var MRV_txtmodelo = $('#MRV_txtmodelo');
var MRV_txtmatricula = $('#MRV_txtmatricula');
var MRV_cmbestado = $('#MRV_cmbestado');
var MRV_txtdocumentoidentidad = $('#MRV_txtdocumentoidentidad');
var MRV_txtlicencia = $('#MRV_txtlicencia');
var MRV_txtnombrechofer = $('#MRV_txtnombrechofer');
var MRV_cmbtipolicencia = $('#MRV_cmbtipolicencia');
var MRV_txttelefono = $('#MRV_txttelefono');
var MRV_txtdireccion = $('#MRV_txtdireccion');

var CMV_tbllista;
var MRV_btnguardar = $('#MRV_btn_guardar');
$(document).ready(function () {
    CMV_tbllista = $('#CMV_tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()
    });
});

//EVENTOS
function MRV_fnverificarregistroempresa() {
    if (MRE_txtcodigo.val() == "")
        mensaje("I", "Primero registre la empresa, antes de agregar vehiculos");
    else {
        
        $('#MRV_modalregistro').modal();
    }
}    
    

function MRV_limpiar() {
    $('#MRV_form_vehiculo').trigger('reset');
    MRV_txtoperacion.val("nuevo");
    MRV_txtcodigo.val("");
}

$('#MRV_form_vehiculo').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Transporte/Vehiculo/RegistrarEditar";
    var obj = $('#MRV_form_vehiculo').serializeArray();
    obj[obj.length] = { name: "idempresa", value: MRE_txtcodigo.val() };
    MRV_btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (MRV_txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');
            } else if (MRV_txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                CMV_tbllista.row('.selected').remove().draw(false);
            }
            CMV_tbllista.row('.selected').remove().draw(false);
            MRV_agregarFila(data.objeto);
            MRV_limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            CMV_tbllista.row('.selected').remove().draw(false);
            MRV_agregarFila(data.objeto);
            MRV_limpiar();
        } else
            mensaje('W', data.mensaje);
        MRV_btnguardar.prop('disabled', false);
    }).fail(function (data) {
        MRV_btnguardar.prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
});

$('#CMV_tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        CMV_tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.MRV_btn-pasar', function (e) {
    var columna = CMV_tbllista.row($(this).parents('tr')).data();
    let controller = new VehiculoController();
    let obj = { id: columna[1]};
    controller.BuscarVehiculoxid(obj,MRV_buscarVehiculoxid);
    MRV_txtoperacion.val("editar");
    $('#MRE_modalregistro').modal('show');
});
function MRV_agregarFila(data) {
    console.log(data);
    let estado = data.estado == 'HABILITADO' ? `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect MRV_btn-pasar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="MRV_mensajedeshabilitar(`+ data.idvehiculo + `)"><i class="fas fa-lock"></i></button>                                                                 
        </div>`:
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-success waves-effect" onclick="MRV_mensajehabilitar(`+ data.idvehiculo + `)"><i class="fas fa-unlock"></i></button>
        </div>`;
    CMV_tbllista.row.add([
        estado,
        data.idvehiculo,
        data.marca+' '+ data.modelocarro,
        data.matricula,
        data.licencia,
        data.nombres
        
    ]).draw(false);
}
function MRV_mensajedeshabilitar(data) {
    mensajeModificarEstado('¿Desea deshabilitar?', MRV_deshabilitar, data)
}
function MRV_mensajehabilitar(data) {
    mensajeModificarEstado('¿Desea habilitar?', MRV_habilitar, data) 
}

function MRV_deshabilitar(id) {
    var url = ORIGEN + "/Transporte/Vehiculo/Deshabilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                CMV_tbllista.row('.selected').remove().draw(false);
                MRV_agregarFila(data.objeto);
                swal("Registro deshabilitado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else 
            mensaje("W", data.mensaje);
        

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
function MRV_habilitar(id) {
    var url = ORIGEN + "/Transporte/Vehiculo/Habilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                CMV_tbllista.row('.selected').remove().draw(false);               
                MRV_agregarFila(data.objeto);
                swal("Registro deshabilitado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else
            mensaje("W", data.mensaje);


    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

function MRV_buscarVehiculoxid(data) {
    console.log(data);
    let datos = data.objeto;
    if (data.mensaje == "ok") {
        $('#MRV_modalregistro').modal();
        MRV_txtcodigo.val(datos.idvehiculo);
        MRV_txtoperacion.val("EDITAR");
        MRV_txtmarca.val(datos.marca);
        MRV_txtmodelo.val(datos.modelocarro);
        MRV_txtmatricula.val(datos.matricula);
        MRV_cmbestado.val(datos.estado);
        MRV_txtdocumentoidentidad.val(datos.documentoidentidad);
        MRV_txtlicencia.val(datos.licencia);
        MRV_txtnombrechofer.val(datos.nombres);
        MRV_cmbtipolicencia.val(datos.tipolicencia);
        MRV_txttelefono.val(datos.telefono);
        MRV_txtdireccion.val(datos.direccion);

    } else 
        mensaje("W", data.mensaje, "BR");
    
}