
var tbllista;

var txtcodigo = document.getElementById('txtcodigo');
var txtnombre = document.getElementById('txtnombre');
var txtcategoria = document.getElementById('txtcategoria');
var txtdescripcion = document.getElementById('txtdescripcion');
var txtvalor = document.getElementById('txtvalor');

var btnguardar = $('#btn-guardar');
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    datatable.columnDefs = [
        {
            "targets": [0],
            "visible": false,
            "searchable": false
        },
    ];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);
  
    listartablaconstante();
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtcodigo.value = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Administrador/Constante/Editar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {           
                mensaje('S', 'Registro actualizado');
                tbllista.row('.selected').remove().draw(false);          
            listartablaconstante();
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
    txtcodigo.value = columna[0];
    txtcategoria.value = columna[1];
    txtnombre.value = columna[2];
    txtvalor.value = columna[3];
    txtdescripcion.value = columna[4];
    $('#modalregistro').modal('show');
});
function agregarFila(data) {
    console.log(data);
    tbllista.clear().draw();

    for (var i = 0; i < data.length; i++) {
        var idconstante = data[i].idconstante;
        tbllista.row.add([
            data[i].idconstante,
            data[i].categoria,
            data[i].nombre,
            data[i].valor_encriptado,
            data[i].descripcion,
            `<div class="btn-group btn-group-sm">
            <button class="btn btn-sm bg-warning waves-effect btn-pasar">EDITAR</button>
        </div>`
        ]).draw(false);
        // Puedes hacer algo más con el valor de idconstante aquí
    }
 
}


function listartablaconstante() {
    var url = ORIGEN + "/Administrador/Constante/listartablaconstante";
    $.post(url).done(function (data) {
        console.log(data);
        var parsedData = JSON.parse(data);
        agregarFila(parsedData);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}



