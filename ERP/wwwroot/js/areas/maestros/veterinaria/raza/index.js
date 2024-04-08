var txtcodigo = document.getElementById('txtcodigo');
var txtdescripcion = document.getElementById('txtdescripcion');
var cmbestado = document.getElementById('cmbestado');
var idtipomascota = document.getElementById('idtipomascota');

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

    let tipomascota = new TipoMascotaController();
    tipomascota.Listar('idtipomascota');

    //controller.ListarAgencias2(null, (data) => { console.log(data);});
    //controller.ListarAgencias2(null, function (data) {
    //    console.log(data);
    //});

    fnlistarRaza();
});


function fnlistarRaza() {
    var controller = new RazaController();
    controller.ListarRaza("todo", fnLlenarTabla);
}
function fnLlenarTabla(data) {
    if (data ==null) {
        return;
    }
    tbllista.rows().clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            data[i].idraza,
            data[i].descripcion,
            data[i].estado,
            '<button class="btn btn-warning btn-sm btneditar"><i class="fas fa-edit"></i></button>'
        ]).draw(false);
    }
}
btnlimpiar.addEventListener('click', function () {
    fnlimpiar();
});

function fnlimpiar() {
    formregistro.reset();
    txtcodigo.value = '';
}

$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode;

    formregistro.idraza.value = fila.getElementsByTagName('td')[0].innerText;
    formregistro.descripcion.value = fila.getElementsByTagName('td')[1].innerText;
    formregistro.estado.value = fila.getElementsByTagName('td')[2].innerText;
    $('#modalregistro').modal('show');
});

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var controller = new RazaController();
    var data = $('#form-registro').serializeArray();

    var obj = { obj: CONVERT_FORM_TO_JSON(data) }

    controller.RegistrarEditar2(obj, function () {
        fnlistarRaza();
        fnlimpiar();
        $('#modalregistro').modal('hide');
    });

});