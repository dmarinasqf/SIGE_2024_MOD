var txtcodigo = $('#txtcodigo');
var cmbumi = $('#cmbumi');
var cmbumf = $('#cmbumf');
var txtequivalencia = $('#txtequivalencia');
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
        }
    ];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    }); 
    listarEquivalencias('','');
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");    
    txtequivalencia.val(0);
    cmbumi.val("");
    cmbumf.val("");
    cmbestado.val("HABILITADO");
    txtcodigo.val("");
    
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

$('#form-registro').submit(function (e) {
    e.preventDefault();    
    var url = ORIGEN + "/Almacen/AEquivalencia/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
     console.log(obj);
    if (APPSYSTEM === 'LOCAL')
        obj[3].value = obj[3].value.replace('.', ',');//equivalencia
    if (APPSYSTEM === 'SERVIDOR')
        obj[3].value = obj[3].value.replace(',', '.');//equivalencia
    btnguardar.prop('disabled', true);
   
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (txtoperacion.val() === "nuevo") {
                mensaje('S', 'Registro guardado');
            } else if (txtoperacion.val() === "editar") {

                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);
            }
            data.objeto.unidadmedidai = $('select[id="cmbumi"] option:selected').text();
            data.objeto.unidadmedidaf = $('select[id="cmbumf"] option:selected').text();
            agregarFila(data.objeto,'equivalencia');
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto,'equivalencia');
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
function listarEquivalencias(uma,umc) {
    //alert("ALTO");
    var url = ORIGEN + "/Almacen/AEquivalencia/getEquivalencias";
    var obj = {
        uma: uma,
        umc: umc
    };
    $.post(url,obj).done(function (data) {       
        tbllista.clear().draw();
        console.log(data);
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                agregarFila(data[i], 'equivalencia');
            }
        }
        else {
            mensaje("I","NO HAY INFORMACIÓN");
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
function eliminar(id) {
    var url = ORIGEN + "/Almacen/AEquivalencia/Eliminar/" + id;
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

$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();
    txtcodigo.val(columna[0]);
    cmbumi.val(columna[1]);
    cmbumf.val(columna[3]);
    txtequivalencia.val(columna[5]);
    txtoperacion.val("editar");
    $('#modalregistro').modal('show');
});

function agregarFila(data, tipo) {


    if (tipo == 'equivalencia')
    {
        tbllista.row.add([
            data.idequivalencia,
            data.unidadmedidainicial,
            data.unidadmedidai,
            data.unidadmedidafinal,
            data.unidadmedidaf,
            data.equivalencia,
            `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="mensajeeliminar(`+ data.idequivalencia + `)"><i class="fas fa-trash-alt"></i></button>                                                                 
        </div>`
        ]).draw(false);
    }
   

}
//eventos change


