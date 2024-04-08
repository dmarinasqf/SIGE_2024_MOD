var txtcodigo = $('#txtcodigo');
var txtdescripcion = $('#txtdescripcion');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var tblrolesgrupo;
var btnguardar = $('#btn-guardar');
var divroles = $('#divroles');
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
    tblrolesgrupo = $('#tblrolesgrupo').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()  ,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]
    });
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Administrador/ModulosGrupo/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');
            } else if (txtoperacion.val() === "editar") {
                mensaje('S', 'REgistro actualizado');
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
    listarRolesGrupo(columna[0]);
    divroles.removeClass('deshabilitartodo');
});

function listarRolesGrupo(id) {
    var url = ORIGEN + "/Administrador/ModulosGrupo/RolesDeGrupo";
    var obj = {
        grupo:id
    };
    $.get(url, obj).done(function (data) { 
        if (data != null) {
            tblrolesgrupo.clear().draw(false);
            for (var i = 0; i < roles.length; i++) {
                var tiene = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j].roleid === roles[i].id) {
                        tiene = true;
                        break;
                    }
                }
                var ckecked = '';
                if (tiene) ckecked = 'checked';
                tblrolesgrupo.row.add([
                    roles[i].id,
                    roles[i].name,
                    roles[i].grupo,
                    roles[i].area,
                    `<div class="demo-switch-title"></div>  <div class="switch">                                                                
                        <label>                                                                     
                             <input type="checkbox" class="check-rol"  idrol="`+ roles[i].id + `" ` + ckecked +`/> 
                            <span class="lever switch-col-teal"></span>                                                                     
                        </label>                                                                
                    </div>`
                ]).draw(false);
            }
        }        
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}



function agregarFila(data) {
  
    tbllista.row.add([
        data.idgrupo,
        data.descripcion,
        data.estado,
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="mensajeeliminar(`+ data.idgrupo + `)"><i class="fas fa-trash-alt"></i></button>                                                                   
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
    var url = ORIGEN + "/Administrador/ModulosGrupo/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                alertaSwall('S', '', 'Registro eliminado');                
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

$('#btnnuevo').click(function () {
    divroles.addClass('deshabilitartodo');
    tblrolesgrupo.clear().draw(false);
    
    for (var i = 0; i < roles.length; i++) {
        tblrolesgrupo.row.add([
            roles[i].id,
            roles[i].name,
            roles[i].grupo,
            roles[i].area,
            `<div class="demo-switch-title"></div>
             <div class="switch">                                                                
                <label>                                                                     
                     <input type="checkbox" class="check-rol"  /> 
                    <span class="lever switch-col-teal"></span>                                                                     
                </label>                                                                
            </div>`
        ]).draw(false);
    }
});

$(document).on('click', '.check-rol', function (e) {
    var valor = $(this).prop('checked');
    var idrol = $(this).attr('idrol');
   
    agregarRemoverPermiso(valor, idrol.toString());
});


function agregarRemoverPermiso(valor, rol) {

    var url = ORIGEN + "/Administrador/ModulosGrupo/AgregarRemoverPermiso";
    var obj = {
        grupo: txtcodigo.val(),
        permiso: rol
    };
  
    $.post(url, obj).done(function (data) {
        
        if (data.mensaje === "ok") {
            if (valor)
                mensaje('S', 'Rol añadido');
            else
                mensaje('S', 'Rol removido');
        } else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}