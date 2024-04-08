//crear
var formregistro = document.getElementById('formregistro');
var MR_txtcodigo = document.getElementById('MR_txtcodigo');
var MR_txtdescripcion = document.getElementById('MR_txtdescripcion');
var MR_cmbestado = document.getElementById('MR_cmbestado');

//duplicar
var formduplicar = document.getElementById('formduplicar');
var MD_cmblista1 = document.getElementById('MD_cmblista1');
var MD_cmblista2 = document.getElementById('MD_cmblista2');

//buttons
var MR_btnnuevo = document.getElementById('MR_btnnuevo');
var MR_btnguardar = document.getElementById('MR_btnguardar');
var MD_btnduplicar = document.getElementById('MD_btnduplicar');

var btnnuevalista = document.getElementById('btnnuevalista');
var btncopiarlista = document.getElementById('btncopiarlista');

//otros
var tbodylistas = document.getElementById('tbodylistas');


$(document).ready(function (e) {
    fnLlenarcombosduplicar();
    fnListarListas();
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = $('#formregistro').serializeArray();
    let controller = new ListaPreciosController();
    controller.RegistrarEditar(obj, function (data) {
        if (data.mensaje === 'ok') {
            fnlimpiar();
            fnListarListas();
            fnLlenarcombosduplicar();

        }
    });
});
MR_btnnuevo.addEventListener('click', function () {
    fnlimpiar();
});
btnnuevalista.addEventListener('click', function () {
    fnlimpiar();
    $('#modalnuevo').modal('show');
});
btncopiarlista.addEventListener('click', function () {
    $('#modalduplicar').modal('show');
});
$('#tbodylistas').on('dblclick', 'tr', function () {
    MR_txtcodigo.value = this.getElementsByTagName('td')[0].innerText;
    MR_txtdescripcion.value = this.getElementsByTagName('td')[1].innerText;
    MR_cmbestado.value = this.getElementsByTagName('td')[2].innerText;
    $('#modalnuevo').modal('show');

});
MD_cmblista1.addEventListener('change', function () {
    MD_cmblista2.innerHTML = '';

    var option = document.createElement('option');
    option.text = '[SELECCIONE]';
    option.value = '';
    MD_cmblista2.append(option);
    for (var i = 0; i < _LISTAS.length; i++) {
        option = document.createElement('option');
        option.text = _LISTAS[i].descripcion;
        option.value = _LISTAS[i].idlistaprecio;
        if (_LISTAS[i].idlistaprecio== MD_cmblista1.value)
            option.disabled = true;
        MD_cmblista2.append(option);
    }
});
formduplicar.addEventListener('submit', function (e) {
    e.preventDefault();
    let controller = new ListaPreciosController();
    var obj = {
        lista1:MD_cmblista1.value,
        lista2:MD_cmblista2.value,
    }
    controller.DuplicarPreciosLista(obj);
});

$(document).on('click', '.btndescargarlista', function () {
    var idlista = this.getAttribute('idlista');
    var obj = {
        lista: idlista,
        top: 99999,
        tipo:'excel'
    };
    let controller = new ListaPreciosController();
    controller.ExportarLista(obj);
});
function fnlimpiar() {
    MR_txtcodigo.value = '';
    MR_txtdescripcion.value = '';
    MR_cmbestado.value = 'HABILITADO';
}

function fnListarListas() {
    let controller = new ListaPreciosController();
    controller.ListarListas(function (data) {
        _LISTAS = data;
        var fila = '';
        tbodylistas.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr class="' + (data[i].estado!='HABILITADO'?'bg-warning':'')+'">';
            fila += '<td>' + data[i].idlistaprecio + '</td>';
            fila += '<td>' + data[i].descripcion + '</td>';
            fila += '<td>' + data[i].estado + '</td>';
            fila += `<td>
                <div class="btn-group ">
                 
                  <a class="btn btn-warning" href="`+ ORIGEN + "/Comercial/ListaPrecios/EditarPrecios?idlista=" + data[i].idlistaprecio+`" data-toggle="tooltip" title="Editar Precios de lista"><i class="fas fa-edit"></i></a>
                  <button class="btn btn-dark btndescargarlista" idlista="`+ data[i].idlistaprecio +`" data-toggle="tooltip" title="Descargar lista"><i class="fas fa-download"></i></button>
              </div>
            </td>`;
            fila += '</tr>';
        }
        tbodylistas.innerHTML = fila;
    });
}
function fnLlenarcombosduplicar() {
    MD_cmblista1.innerHTML = '';
    var option = document.createElement('option');
    option.text = '[SELECCIONE]';
    option.value = '';
    MD_cmblista1.append(option);
    for (var i = 0; i < _LISTAS.length; i++) {
        option = document.createElement('option');
        option.text = _LISTAS[i].descripcion;
        option.value = _LISTAS[i].idlistaprecio;
        MD_cmblista1.append(option);
    }
}