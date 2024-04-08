var txtcodigo = $('#txtcodigo');
var txtseriedocumento = $('#txtseriedocumento');
var txtserieimpresora = $('#txtserieimpresora');
var cmbestado = $('#cmbestado');
var cmbdocumento = $('#cmbdocumento');
var txtoperacion = $('#txtoperacion');
var txtactual = $('#txtactual');
var txtinicio = $('#txtinicio');
var tbllista;
var btnguardar = $('#btn-guardar');
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        dom: 'Bfrtip',
        responsive: true,
        buttons: BOTONESDATATABLE('CORRELATIVOS DE DOCUMENTO ', 'V', false),
        "language": LENGUAJEDATATABLE(),       
    });
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    cmbdocumento.val('');
    $('#cmbdocumento option:selected').text('[SELECCIONE]');    
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Administrador/CorrelativoDocumento/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();    
    btnguardar.prop('disabled', true);
    var operacion = 'editar';
    if (txtoperacion.val() === '')
        operacion = 'nuevo';
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (operacion=== "nuevo") {              
                mensaje('S', 'Registro guardado');

            } else  {
                mensaje('S', 'Registro actualizado');
                tbllista.row($("#" + data.objeto.idcorrelativo)).remove().draw(false);                
            }            
            data.objeto.documento = $('select[id="cmbdocumento"] option:selected').text();
            agregarFila(data.objeto);
            limpiar();
        }
        else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});



$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();
    var url = ORIGEN + "/Administrador/CorrelativoDocumento/Buscar/" + columna[0];
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            var obj = data.objeto;
            txtcodigo.val(obj.idcorrelativo);
            txtactual.val(obj.actual);
            txtinicio.val(obj.inicio);
            cmbdocumento.val(obj.iddocumento);
            cmbestado.val(obj.estado);            
            txtserieimpresora.val(obj.serieimpresora);
            txtseriedocumento.val(obj.seriedocumento);
            $('#modalregistro').modal('show');
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
});
function agregarFila(data) {
    if (data.estado == "HABILITADO") {
       // console.log(data);
        row = tbllista.row.add([             
            data.idcorrelativo,
            data.documento , 
            data.seriedocumento,
            data.serieimpresora,
            data.inicio,
            data.actual,
            data.fin,
            data.estado,
            `<div class="btn-group btn-group-sm" >            
            <a class="btn btn-sm bg-warning waves-effect btn-pasar font-10"><i class="fa fa-edit"></i></a>
            <button class="btn btn-sm btn-danger waves-effect font-10" onclick="mensajeeliminar(`+ data.idcorrelativo + `)"><i class="fa fa-lock"></i></button>                                                                 
        </div>`
        ]).draw(false);
        row.nodes().to$().attr('id', data.idcorrelativo);
    } else {
        //console.log(data);
       row = tbllista.row.add([
           data.idcorrelativo,
           data.documento,
           data.seriedocumento,
           data.serieimpresora,
           data.inicio,
           data.actual,
           data.fin,
           data.estado,
            `<div class="btn-group btn-group-sm" >               
            <button class="btn btn-sm btn-success waves-effect font-10" onclick="habilitar(`+ data.idcorrelativo + `)"><i class="fa fa-unlock"></i></button>                                                                 
        </div>`
       ]).draw(false);
        row.nodes().to$().attr('id', data.idcorrelativo);
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
function confirmarRegistro(data) {
    swal({
        title: '¿Desea Modificar el registro?',
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

            txtoperacion.val("editar");
            guardarRegistro(data);

        }
        else {
            swal.close();
            btnguardar.prop('disabled', false);
        }
    });
}
function eliminar(id) {
    var url = ORIGEN + "/Administrador/CorrelativoDocumento/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                data.objeto.empresa = document.getElementById("nombreempresa").innerHTML;   
                agregarFila(data.objeto);
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
function habilitar(id) {
    var url = ORIGEN + "/Administrador/CorrelativoDocumento/Habilitar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {      
                tbllista.row('.selected').remove().draw(false);
                data.objeto.empresa = document.getElementById("nombreempresa").innerHTML;                
                agregarFila(data.objeto);
                mensaje("S","Registro habilitado");
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
cmbdocumento.change(function (e) {
    var option = $('#cmbdocumento option:selected').attr('correlativo');
    console.log(option);
    txtseriedocumento.val(option);
});