
var txtcodigo = $('#txtcodigo');
var txtdescripcion = $('#txtdescripcion');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],                
        "language": LENGUAJEDATATABLE()  
        //"columnDefs": [
        //    {
        //        "targets": [2],
        //        "visible": false,
        //        "searchable": false
        //    }  ]      
    });
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");   
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
   // alert(txtoperacion.val());
    var url = ORIGEN + "/PreIngreso/PITipoAnalisis/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');
                $('#modalregistro').modal('hide');
            } else if (txtoperacion.val() === "editar") {
                
                mensaje('S', 'Registro actualizado');
                $('#modalregistro').modal('hide');
                tbllista.row('.selected').remove().draw(false);
            }           
            agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto);
            limpiar();
            $('#modalregistro').modal('hide');
        } else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();    
    txtcodigo.val(columna[0]);
    txtdescripcion.val(columna[1]);   
    cmbestado.val(columna[2]);   
    txtoperacion.val("editar");
    $('#modalregistro').modal('show');

});
function agregarFila(data) {
    console.log(data);
    if (data.estado === "HABILITADO") {
        tbllista.row.add([
            data.idtipoanalisis,
            data.descripcion,
            data.estado,
            `<div class="btn-group btn-group-sm" >            
            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10"><i class="fa fa-edit"></i></a>
            <button class="btn btn-sm btn-outline-danger waves-effect  font-10" onclick="mensajeeliminar(`+ data.idtipoanalisis + `)"><i class="fa fa-lock"></i></button>                                                                   
        </div>`
        ]).draw(false);
    }
    else {
        tbllista.row.add([
            data.idtipoanalisis,
            data.descripcion,
            data.estado,
            `<div class="btn-group btn-group-sm" >        
             <button class="btn btn-sm btn-outline-success waves-effect  font-10" onclick="habilitar(`+ data.idtipoanalisis + `)"><i class="fa fa-unlock"></i></button>                                                                   
        </div>`
        ]).draw(false);
    }
}
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
function eliminar(id) {
    var url = ORIGEN + "/PreIngreso/PITipoAnalisis/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                agregarFila(data.objeto);
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
function habilitar(id) {
    var url = ORIGEN + "/PreIngreso/PITipoAnalisis/Habilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                agregarFila(data.objeto);
                swal("Registro habilitado!", {
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
