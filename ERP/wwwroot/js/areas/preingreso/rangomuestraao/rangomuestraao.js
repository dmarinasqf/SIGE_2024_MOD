var txtcodigo = $('#txtcodigo');
var txtintervaloinicial = $('#txtintervaloinicial');
var txtintervalofinal = $('#txtintervalofinal');
var txtnmuestra = $('#txtnmuestra');
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
    //tbllista = $('#tbllista').DataTable({
    //    "searching": true,
    //    lengthChange: false,
    //    "ordering": false,
    //    "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],                
    //    "language": LENGUAJEDATATABLE()  
    //    //"columnDefs": [
    //    //    {
    //    //        "targets": [2],
    //    //        "visible": false,
    //    //        "searchable": false
    //    //    }  ]      
    //});
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");   
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/PreIngreso/PIRangoMuestraAO/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {           
            mensaje('S', 'Registro guardado');
            $('#modalregistro').modal('hide');
            agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Registro actualizado');
            tbllista.row('.selected').remove().draw(false);
            agregarFila(data.objeto);
            limpiar();
            $('#modalregistro').modal('hide');
        } else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        limpiar();
        btnguardar.prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
});

//$('#tbllista tbody').on('click', 'tr', function () {
//    if ($(this).hasClass('selected')) {
//        console.log();
//    }
//    else {
//        tbllista.$('tr.selected').removeClass('selected');
//        $(this).addClass('selected');
//    }
//});
$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();
    txtcodigo.val(columna[0]);
    txtintervaloinicial.val(columna[1]);
    txtintervalofinal.val(columna[2]);
    txtnmuestra.val(columna[3]);
    let estado = document.getElementById(columna[0]).innerText;   
    cmbestado.val(estado);
   // txtoperacion.val("editar");
    $('#modalregistro').modal('show');

});
function agregarFila(data) {

    let estado = ''; 
    if (data.estado === "HABILITADO") {
        estado = `<span class="badge badge-success mr-1"  id="` + data.idrango +`">` + data.estado + `</span>`;
    } else {
        estado = `<span class="badge badge-danger mr-1r"  id="` + data.idrango +`">` + data.estado +`</span>`;
    }
     let fila=tbllista.row.add([
            data.idrango,
            data.intervaloinicial,
            data.intervalofinal,
            data.numeromuestra,
            estado,
            `<div class="btn-group btn-group-sm" >            
            <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10"><i class="fa fa-edit"></i></a>
        </div>`
        ]).draw(false).node();
    $(fila).find('td').eq(1).attr({ 'style': 'text-align:right' });
    $(fila).find('td').eq(2).attr({ 'style': 'text-align:right' });
    $(fila).find('td').eq(3).attr({ 'style': 'text-align:right' });
    $(fila).find('td').eq(4).attr({ 'style': 'text-align:center' });
    $(fila).find('td').eq(5).attr({ 'style': 'text-align:center' });
}
//function mensajeeliminar(data) {
//    swal({
//        title: '¿Desea deshabilitar?',
//        text: "",
//        type: 'warning',
//        class: 'text-center',
//        buttons: {
//            cancel: {
//                visible: true,
//                text: 'No',
//                className: 'btn btn-danger'
//            },
//            confirm: {
//                text: 'Si',
//                className: 'btn btn-success'
//            }
//        }
//    }).then((willDelete) => {
//        if (willDelete) {
//            eliminar(data);
//        }
//        else
//            swal.close();
//    });
//}
//function eliminar(id) {
//    var url = ORIGEN + "/PreIngreso/PIRangoMuestraAO/Eliminar/" + id;
//    $.post(url).done(function (data) {
//        if (data.mensaje === "ok") {
//            {
//                tbllista.row('.selected').remove().draw(false);
//                agregarFila(data.objeto);
//                swal("Registro eliminado!", {
//                    icon: "success",
//                    buttons: {
//                        confirm: { className: 'btn btn-success' }
//                    }
//                });
//            }
//        }
//        else {
//            mensaje("W", data.mensaje);
//        }

//    }).fail(function (data) {
//        console.log(data);
//        mensaje("D", 'Error en el servidor');
//    });

//}
//function habilitar(id) {
//    var url = ORIGEN + "/PreIngreso/PIRangoMuestraAO/Habilitar/" + id;
//    $.post(url).done(function (data) {
//        if (data.mensaje === "ok") {
//            {
//                tbllista.row('.selected').remove().draw(false);
//                agregarFila(data.objeto);
//                swal("Registro habilitado!", {
//                    icon: "success",
//                    buttons: {
//                        confirm: { className: 'btn btn-success' }
//                    }
//                });
//            }
//        }
//        else {
//            mensaje("W", data.mensaje);
//        }

//    }).fail(function (data) {
//        console.log(data);
//        mensaje("D", 'Error en el servidor');
//    });

//}
