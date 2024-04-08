var txtfiltro = document.getElementById('txtfiltro');
var tbody = document.getElementById('tbody');
var btnexportar = document.getElementById('btnexportar');

$(document).ready(function () {
    fnbuscarclientes();
});

function fnbuscarclientes(numpagina, tamanopagina) {
    var obj = {
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??30
        },
        top: 1000,
        filtro: txtfiltro.value
    };
    let controller = new ClienteController();
    controller.BuscarClientesPaginacion(obj, function (response) {
        var data = response.data;
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado=='DESHABILITADO')
                fila += '<tr id="' + data[i].idcliente + '" class="table-warning">';
            else
                fila += '<tr id="' + data[i].idcliente + '">';

            fila += '<td>' + data[i].idcliente+'</td>';
            fila += '<td>' + data[i].numdocumento+'</td>';
            fila += '<td>' + data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno+'</td>';
            fila += '<td>' + data[i].nombrecomercial+'</td>';
            fila += '<td>' + data[i].direccion+'</td>';
            fila += '<td>' + data[i].telefono+'</td>';
            fila += '<td>' + data[i].celular+'</td>';
            fila += '<td>' + data[i].email+'</td>';
            fila += '<td>' + data[i].estado+'</td>';
            fila += '<td><div class="btn-group btn-group-sm"><a class="btn btn-sm btn-warning" href="' + ORIGEN + '/Maestros/Cliente/RegistrarEditar/' + data[i].idcliente+'"> <i class="fas fa-edit"></i> </a></div></td>';
            fila += '</tr>';
        }
        tbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');
    });
  
}

$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnbuscarclientes(numpagina, 30);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
txtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnbuscarclientes();
});

btnexportar.addEventListener('click', function () {
    let controller = new ClienteController();
    controller.GenerarExcelClientes('');
});