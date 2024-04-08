var txtfiltro = document.getElementById('txtfiltro');
var txtcodigo = document.getElementById('txtcodigo');
var txtdescripcion = document.getElementById('txtdescripcion');
var cmbestado = document.getElementById('cmbestado');
var MCC_cmbdepartamento = document.getElementById('MCC_cmbdepartamento');
var MCC_cmbprovincia = document.getElementById('MCC_cmbprovincia');
var cmbDistrito = document.getElementById('cmbDistrito');
var cmbTipoOrigen = document.getElementById('cmbTipoOrigen');

var tbllista;
var tbody = document.getElementById('tbody');

var btnguardar = document.getElementById('btnguardar');
var btnlimpiar = document.getElementById('btnlimpiar');


var formregistro = document.getElementById('form-registro');

$(document).ready(function () {
     fnlistar();
    fncmbTipoOrigen();
    MCC_fnListarDepartamentos();
});

function fnlistar(numpagina, tamanopagina) {
    //var controller = new OrigenRecetaController();
    //controller.ListarOrigenReceta('todo', fnllenartabla);

    var obj = {
        pagine: {
            numpagina: numpagina ?? 1,
            tamanopagina: tamanopagina ?? 30
        },
        filtro: txtfiltro.value
    };

    var controller = new OrigenRecetaController();
    controller.BuscarOrigenReceta(obj, function (response) {
        var data = response.dataobject;
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado == 'DESHABILITADO')
                fila += '<tr id="' + data[i].idcliente + '" class="table-warning">';
            else
                fila += '<tr id="' + data[i].idcliente + '">';

            fila += '<td>' + data[i].descripcion + '</td>';
            fila += '<td>' + data[i].tipo + '</td>';
            fila += '<td>' + data[i].direccion + '</td>';
            fila += '<td>' + data[i].estado + '</td>';

            fila += '<td><div class="btn-group btn-group-sm"><a class="btn btn-sm btn-warning btneditar" codigo=' + data[i].idorigenreceta + '> <i class="fas fa-edit"></i> </a></div></td>';
            fila += '</tr>';
        }
        tbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');
    });
}

$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnlistar(numpagina, 30);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});

function MCC_fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('MCC_cmbdepartamento');
}
function fncmbTipoOrigen() {
    let ctrl = new TipoOrigenRecetaController();
    ctrl.ListarTipoOrigenReceta('cmbTipoOrigen');
}

$(document).on('click', '.btneditar', function () {
    $('#modalregistro').modal('show');
    fnlimpiar();
    var fila = this.getAttribute('codigo');
    //console.log(fila);
    var controller = new OrigenRecetaController();
    try {
        controller.BuscarOrigenRecetaId(fila, fnLlenarModal);
    } catch (e) {
    } 
});

function fnLlenarModal(data) {
    formregistro.idorigenreceta.value = data[0].id;
    formregistro.descripcion.value = data[0].descripcion;
    formregistro.direccion.value = data[0].direccion;

    
    formregistro.idtiporigen.value = String(data[0].to);
    formregistro.iddepartamento.value = String(data[0].dpto);
    //formregistro.idprovincia.value = String(data[0].provincia);
    //formregistro.iddistrito.value = String(data[0].distrito);
}
MCC_cmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(MCC_cmbdepartamento.value, '', 'MCC_cmbprovincia', null);
});
MCC_cmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(MCC_cmbprovincia.value, '', 'cmbDistrito', null);
});
$(document).on('click', '.btn_RegistrarNuevo', function () {
    fnlimpiar();
    txtcodigo.value = ''
    $('#modalregistro').modal('show');
});

function fnlimpiar() {
    formregistro.reset();
    txtcodigo.value = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var controller = new OrigenRecetaController();
    var data = $('#form-registro').serializeArray();

    var obj = { obj: CONVERT_FORM_TO_JSON(data) }
    controller.RegistrarEditar(obj, function () {
        fnlistar();
        fnlimpiar();
        $('#modalregistro').modal('hide');
    });
});

txtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnlistar();
});