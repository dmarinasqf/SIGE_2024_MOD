var MMtxtfiltro = document.getElementById('MMtxtfiltro');
var MMcmbtipodocmedico = document.getElementById('MMcmbtipodocmedico');
var MMtbodymedicos = document.getElementById('MMtbodymedicos');

var MMtblmedicos;
$(document).ready(function () {
 
    MMfnbuscarmedicos();
});
function MMfnbuscarmedicos(numpagina, tamanopagina) {
    var obj = {
        pagine: {
            numpagina: numpagina ?? 1,
            tamanopagina: tamanopagina ?? 10,
        },
        filtro: MMtxtfiltro.value.trim(),
        top: 100,
        colegio: MMcmbtipodocmedico.value
    };
    let controller = new MedicoController();
    controller.BuscarMedicos(obj, function (response) {
     
        var fila = '';
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].idmedico +'">';
            fila += '<td>' + '<button class="btn-success MMbtnpasarmedico" id="' + data[i].idmedico + '"><i class="fas fa-check "></i></button>'+'</td>';
            fila += '<td>' +( data[i].colegio??'')+'</td>';
            fila += '<td>' + data[i].colegiatura+'</td>';
            fila += '<td>' + data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno+'</td>';
            fila += '<td>' + data[i].especialidad+'</td>';
            fila += '</tr>';                    
        }
        MMtbodymedicos.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MMclinkpage', 'MMpaginacion');
    });

}
function MMfnlistarmedicoByOrigenReceta(idorigen) {   
    let controller = new MedicoController();
    controller.ListarMedicosByOReceta(idorigen, function (data) {
        
        if (data == null || data.length==0)
            return;
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].idmedico + '">';
            fila += '<td>' + '<button class="btn-success MMbtnpasarmedico" id="' + data[i].idmedico + '"><i class="fas fa-check "></i></button>' + '</td>';
            fila += '<td>' + data[i].colegio + '</td>';
            fila += '<td>' + data[i].nrocolegiatura + '</td>';
            fila += '<td>' + data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno + '</td>';
            fila += '<td>' + data[i].especialidad + '</td>';
            fila += '</tr>';
        }
        MMtbodymedicos.innerHTML = fila;
        document.getElementById('MMpaginacion').innerHTML = '';
        $('#modalmedico').modal('show');
    });

}
$('#modalmedico').on('shown.bs.modal', function (e) {
    MMcmbtipodocmedico.value = '';
    //MMfnbuscarmedicos();
    if (MMcmbtipodocmedico.getElementsByTagName('option').length == 0) {
        var colegiomedico = new ColegioController();
        colegiomedico.ListarColegiosCombo('MMcmbtipodocmedico');
    }
 
});
MMtxtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MMfnbuscarmedicos();
});
$(document).on('click', '.MMclinkpage', function () {
    var numpagina = this.getAttribute('numpagina');
    MMfnbuscarmedicos(numpagina, 10);
    var pages = document.getElementsByClassName('MMclinkpage');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
MMcmbtipodocmedico.addEventListener('change', function () {
    MMfnbuscarmedicos();
});