var MORtxtfiltro = document.getElementById('MORtxtfiltro');
var MORtbody = document.getElementById('MORtbody');

MORtxtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MORfnbuscarorigenreceta(1,10);
});
function MORfnbuscarorigenreceta(numpagina, tamanopagina) {
    var obj = {
        filtro: MORtxtfiltro.value.trim(),
        pagine: {
            numpagina: numpagina??1,
            tamanopagina: tamanopagina??10,
        }
    };
    let controller = new OrigenRecetaController();
    controller.BuscarOrigenReceta(obj, function (response) {
        var data = response.dataobject;
        var fila = '';
        if (data != null)
            for (var i = 0; i < data.length; i++) {
              
                fila += '<tr id="'+data[i].idorigenreceta+'">';
                fila += '<td>'+data[i].descripcion+'</td>';
                fila += '<td>'+data[i].tipo+'</td>';
                fila += '<td>'+data[i].direccion+'</td>';
                fila += '<td><button class="btn-success MORbtnseleccionaritem"><i class="fas fa-check"></i></button></td>';
                fila+='</tr>';
            }
        MORtbody.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MORclinkpage', 'MORpaginacion');
    });
}
$('#MORtbody').on('click', 'tr', function () {

    var filas = document.querySelectorAll('#MORtbody tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');   
});
$(document).on('click', '.MORclinkpage', function () {
    var numpagina = this.getAttribute('numpagina');
    
    MORfnbuscarorigenreceta(numpagina, 10);
    var pages = document.getElementsByClassName('MORclinkpage');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});