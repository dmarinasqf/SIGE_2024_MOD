﻿var txtcodigo = document.getElementById('txtcodigo');
var txtdescripcion = document.getElementById('txtdescripcion');
var cmbestado = document.getElementById('cmbestado');

var tbllista;

var btnguardar = document.getElementById('btnguardar');
var btnlimpiar = document.getElementById('btnlimpiar');


var formregistro = document.getElementById('form-registro');


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

    fnlistarEspecialidad();
});

function fnlistarEspecialidad() {
    var controller = new InstitucionesController();
    controller.Listar('todo', fnllenartablaInstitucion);
}
function fnllenartablaInstitucion(data) {
    if (data == null)
        return;

    tbllista.rows().clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            data[i].idInstitucion,
            data[i].descripcion,
            _estado(data[i].estado),
            '<button class="btn btn-warning btn-sm btneditar"><i class="fas fa-edit"></i></button>'
        ]).draw(false);
    }
}
var _estado = function (st) {
    if (st =="HABILITADO") {
        return '<span class="badge badge-pill badge-success">' + st + '</span>';
    } else {
        return '<span class="badge badge-pill badge-danger">' + st + '</span>';
    }
}

btnlimpiar.addEventListener('click', function () {
    fnlimpiar();
});

$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode;

    formregistro.idInstitucion.value = fila.getElementsByTagName('td')[0].innerText;
    formregistro.descripcion.value = fila.getElementsByTagName('td')[1].innerText;
    formregistro.estado.value = fila.getElementsByTagName('td')[2].innerText;
    $('#modalregistro').modal('show');
});

function fnlimpiar() {
    formregistro.reset();
    txtcodigo.value = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var controller = new InstitucionesController();
    var data = $('#form-registro').serializeArray();

    var obj = { obj: CONVERT_FORM_TO_JSON(data) }

    controller.RegistrarEditar(obj, function () {
        fnlistarEspecialidad();
        fnlimpiar();
        $('#modalregistro').modal('hide');
    });

});
