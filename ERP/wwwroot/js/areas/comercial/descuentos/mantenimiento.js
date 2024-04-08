var cmbdescuentopor = document.getElementById('cmbdescuentopor');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var cmbproveedor = document.getElementById('cmbproveedor');
var txtdes1 = document.getElementById('txtdes1');
var txtdesproveedor = document.getElementById('txtdesproveedor');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var txtdescripcion = document.getElementById('txtdescripcion');

var divlaboratorio = document.getElementById('divlaboratorio');
var divproveedor = document.getElementById('divproveedor');
var tbodylistas = document.getElementById('tbodylistas');
var tbodyCanalesPrecios = document.getElementById('tbodyCanalesPrecios');
var btncargarproductos = document.getElementById('btncargarproductos');

var navprecios = document.getElementById('precios-tab');
var navconfig = document.getElementById('config-tab');

var rdproveedor = document.getElementById('rdproveedor');
var rdlaboratorio = document.getElementById('rdlaboratorio');

//step1

//variables
var select2lab;
var select2pro;
var tblproductos;
var _listas = [];
//var _listasCanalesPrecios = [];
var listaCanalesPrecios = '';

var _descuentos = [];
var _productos = [];

//wizard
var step1 = document.getElementById('step-1');
var step2 = document.getElementById('step-2');
var step3 = document.getElementById('step-3');
var btnsiguiente2wizard = document.getElementById('btnsiguiente2wizard');
var btnfinalizarwizard2 = document.getElementById('btnfinalizar2wizard');
var btnsiguiente1wizard = document.getElementById('wizard-1-next');
var btnfinalizarwizard = document.getElementById('wizard-1-finish');

$(document).ready(function () {

    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    select2lab = $('#cmblaboratorio').select2({
        placeholder: "Buscar Laboratorios",
        allowClear: true,
        ajax: fn,
        width: '500px',
    });
    let controllerprov = new ProveedorController();
    fn = controllerprov.BuscarProveedoresSelect2();
    select2pro = $('#cmbproveedor').select2({
        placeholder: "Buscar Proveedor",
        allowClear: true,
        ajax: fn,
        width: '500px',
    });
    fnListarListas();
    fnListarCanalesPrecios()
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;

    if (tecla === 'ArrowRight' || tecla == 'ArrowLeft')
        this.setTimeout(function () {
            fnaccionessiguiente();
        }, 1000);


});

rdlaboratorio.addEventListener('click', function (e) {
    divlaboratorio.classList.remove('ocultar');   
    divproveedor.classList.add('ocultar');
});
rdproveedor.addEventListener('click', function (e) {      
    divproveedor.classList.remove('ocultar');
    divlaboratorio.classList.add('ocultar');
});
btncargarproductos.addEventListener('click', function () {
    $('#modalproductos').modal('show');
    tbodylistas.classList.add('deshabilitartodo');
});

$(document).on('click', '#btnsiguiente2wizard', function () {
    fnaccionessiguiente();
});


function fngetlistasseleccionadas() {
    var filas = document.querySelectorAll('#tbodylistas tr');
    var array = [];
    filas.forEach(function (e) {
        if (e.getElementsByClassName('checklista')[0].checked) {
            array.push(e.getAttribute('idlista') + '/' + e.getElementsByTagName('td')[2].innerText);
        }
    });
    return array;
}

function fngetCanalesPreciosseleccionadas() {
    var filas = document.querySelectorAll('#tbodyCanalesPrecios tr');
    var array = [];
    filas.forEach(function (e) {
        if (e.getElementsByClassName('checklista')[0].checked) {
            array.push(e.getAttribute('idlistacanales'));
        }
    });

    var lista_canales='';
    for (var i = 0; i < array.length; i++)
        lista_canales += array[i] + '|';
    return lista_canales;
    //return array;
}

function fnListarListas() {
    let controller = new ListaPreciosController();
    controller.ListarListas(function (data) {
        var fila = '';
        tbodylistas.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado == 'HABILITADO') {
                fila += '<tr idlista="' + data[i].idlistaprecio + '">';
                fila += '<td><input type="checkbox" class="checklista" /></td>';
                fila += '<td>' + data[i].idlistaprecio + '</td>';
                fila += '<td>' + data[i].descripcion + '</td>';
                fila += '</tr>';
            }
        }
        tbodylistas.innerHTML = fila;
    });
}

function fnListarCanalesPrecios() {
    let controller = new ListaPreciosController();
    controller.ListarCanalesPrecios(function (data) {
        var fila = '';
        tbodyCanalesPrecios.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado == 'HABILITADO') {
                fila += '<tr idlistacanales="' + data[i].idcanalventa + '">';
                fila += '<td><input type="checkbox" class="checklista" /></td>';
                fila += '<td>' + data[i].descripcion + '</td>';
                fila += '</tr>';
            }
        }
        tbodyCanalesPrecios.innerHTML = fila;
    });
}


function fnaccionessiguiente() {
    if (step1.style.display == 'block')
        init();
    if (step2.style.display == 'block') {
        _listas = fngetlistasseleccionadas();
        listaCanalesPrecios = fngetCanalesPreciosseleccionadas();
        //console.log(listaCanalesPrecios);
    }

    if (step3.style.display == 'block')
        fnstep3cargarcambios();
}
