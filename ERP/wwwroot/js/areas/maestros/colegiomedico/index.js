var txtcodigo = document.getElementById('txtcodigo');
var txtabreviatura = document.getElementById('txtabreviatura');
var txtdescripcion = document.getElementById('txtdescripcion');
var txtNumDig = document.getElementById('txtNumDig');
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

    fnlistarColegio();
});
function fnlistarColegio() {
    var controller = new ColegioController();
    controller.getListarColegios('todo', fnllenartablaColegio);
}
function fnllenartablaColegio(data) {
    if (data == null)
        return;

    tbllista.rows().clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            data[i].idcolegio,
            data[i].abreviatura,
            data[i].descripcion,
            data[i].nmrdigitos,
            data[i].estado,
            '<button class="btn btn-warning btn-sm btneditar"><i class="fas fa-edit"></i></button>'
        ]).draw(false);
    }
}

btnlimpiar.addEventListener('click', function () {
    fnlimpiar();
});

$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode;
    //console.log(fila);

    formregistro.idcolegio.value = fila.getElementsByTagName('td')[0].innerText;
    formregistro.abreviatura.value = fila.getElementsByTagName('td')[1].innerText;
    formregistro.descripcion.value = fila.getElementsByTagName('td')[2].innerText;
    formregistro.nmrdigitos.value = fila.getElementsByTagName('td')[3].innerText;
    formregistro.estado.value = fila.getElementsByTagName('td')[4].innerText;
    $('#modalregistro').modal('show');
});

function fnlimpiar() {
    formregistro.reset();
    txtcodigo.value = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var controller = new ColegioController();
    var data = $('#form-registro').serializeArray();

    var obj = { obj: CONVERT_FORM_TO_JSON(data) }

    controller.RegistrarEditar(obj, function () {
        fnlistarColegio();
        fnlimpiar();
        $('#modalregistro').modal('hide');
    });

});

