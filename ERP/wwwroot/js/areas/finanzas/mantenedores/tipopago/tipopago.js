var txtcodigo = $('#txtcodigo');
var txtdescripcion = $('#txtdescripcion');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    });
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Finanzas/FTipoPago/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');

            } else if (txtoperacion.val() === "editar") {
                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);
            }
            agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto);
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
    tbllista.row.add([
        data.idtipopago,
        data.descripcion,
        data.estado,
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="mensajeeliminar(`+ data.idtipopago + `)"><i class="fas fa-trash-alt"></i></button>                                                                 
        </div>`
    ]).draw(false);
}
function mensajeeliminar(data) {
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
            eliminar(data);
        }
        else
            swal.close();
    });
}
function eliminar(id) {
    var url = ORIGEN + "/Finanzas/FTipoPago/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
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
