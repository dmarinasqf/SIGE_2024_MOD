var txtfiltro = document.getElementById('txtfiltro');
var tbody = document.getElementById('tbody');
var btnexportar = document.getElementById('btnexportar');
var timerbusqueda = null;
$(document).ready(function () {
    fnbuscarmedicos();
});

function fnbuscarmedicos(numpagina, tamanopagina) {
    var obj = {
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??30
        },
        top: 1000,
        filtro: txtfiltro.value
    };
    let controller = new MedicoController();
    controller.BuscarMedicos(obj, function (response) {
        var data = response.data;
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].estado=='DESHABILITADO')
                fila += '<tr id="' + data[i].idmedico + '" class="table-warning">';
            else
                fila += '<tr id="' + data[i].idmedico + '">';

            fila += '<td>' + data[i].colegiatura+'</td>';
            fila += '<td>' + data[i].nombres +'</td>';
            fila += '<td>' + data[i].apepaterno+'</td>';
            fila += '<td>' + data[i].apematerno+'</td>';
            fila += '<td>' + data[i].especialidad+'</td>';
            fila += '<td>' + data[i].email+'</td>';
            fila += '<td>' + data[i].direccion + '</td>';
            fila += '<td>' + data[i].direccionconsultorio + '</td>';
            fila += '<td><a class="btn btn-xs btn-warning" href="' + ORIGEN + '/Maestros/Medico/RegistrarEditar/' + data[i].idmedico + '"> <i class="fas fa-edit"></i> </a>';
            //fila += '<a class="btn btn-xs btn-danger btnEliminarMedico"> <i class="fas fa-trash-alt"></i> </a></td>';
            fila += '</tr>';
        }
        tbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');
    });
  
}

$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnbuscarmedicos(numpagina, 30);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
$(document).on('click', '.btnEliminarMedico', function () {
   var url=ORIGEN +"Mestros/Medico/"
});
txtfiltro.addEventListener('keyup', function (e) {
    clearTimeout(timerbusqueda);
    var $this = this;
    timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            fnbuscarmedicos(1, 20);
        }

    }, 1000);
});

btnexportar.addEventListener('click', function () {
    let controller = new MedicoController();
    controller.GenerarExcelMedicos('');
});