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
    fnlistarColegio();
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

function fnlistarColegio() {
    var controller = new ColegioController();
    controller.Llenarcombo('cmbcolegio');
}
function fnlistarEspecialidad() {
    var controller = new EspecialidadController();
    controller.Listar('todo', fnllenartablaColegio);
}
function fnllenartablaColegio(data) {
    if (data == null)
        return;

    tbllista.rows().clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            data[i].esp_codigo,
            data[i].colegio,
            data[i].descripcion,
            data[i].estado,
            '<button class="btn btn-warning btn-sm btneditar" codigo="' + data[i].idcolegio+'"><i class="fas fa-edit"></i></button>'
        ]).draw(false);
    }
}

btnlimpiar.addEventListener('click', function () {
    fnlimpiar();
});

$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode;

    formregistro.esp_codigo.value = fila.getElementsByTagName('td')[0].innerText;
    formregistro.descripcion.value = fila.getElementsByTagName('td')[2].innerText;
    formregistro.cmbcolegio.value = this.getAttribute('codigo');
    formregistro.estado.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalregistro').modal('show');
    //idcolegio
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
        fnlistarEspecialidad();
        fnlimpiar();
        $('#modalregistro').modal('hide');
    });

});

