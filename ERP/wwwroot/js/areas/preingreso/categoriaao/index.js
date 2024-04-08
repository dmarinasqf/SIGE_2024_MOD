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
    btnguardar.prop('disabled', true);
    var obj = $('#form-registro').serializeArray();
    let controller = new CategoriaAOController();
    controller.registrar(obj, function (data) {
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
            mensaje('S', 'Registro actualizado');
            tbllista.row('.selected').remove().draw(false);            
            agregarFila(data.objeto);
            limpiar();
        } else
            mensaje('W', data.mensaje);
    });
    btnguardar.prop('disabled', false);
   
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

    let boton = data.estado == "HABILITADO" ? `<div class="btn-group btn-group-sm" >            
            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10"><i class="fa fa-edit"></i></a>
            <button class="btn btn-sm btn-outline-danger waves-effect  font-10" onclick="mensajedeshabilitar(`+ data.idcategoriaao + `)"><i class="fa fa-lock"></i></button>                                              
        </div>`: `<div class="btn-group btn-group-sm" >   
             <button class="btn btn-sm btn-outline-success waves-effect font-10" onclick="habilitar(`+ data.idcategoriaao + `)"><i class="fa fa-unlock"></i></button>                                           
        </div>`;
        tbllista.row.add([
            data.idcategoriaao,
            data.descripcion,
            data.estado,
            boton
        ]).draw(false);
   
}
function mensajedeshabilitar(data) {
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
        if (willDelete) 
            deshabilitar(data);
        
        else 
            swal.close();
        
    });
}
function deshabilitar(id) {
    let controller = new CategoriaAOController();
    controller.deshabilitar(id, function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                agregarFila(data.objeto);
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
    });    
}

function habilitar(id) {
    let controller = new CategoriaAOController();
    controller.habilitar(id, function (data) {
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
        else
            mensaje("W", data.mensaje);
    });
}



