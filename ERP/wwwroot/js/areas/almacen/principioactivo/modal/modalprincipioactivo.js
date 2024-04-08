
var tbodyMPAprincipio = document.getElementById('tbodyMPAprincipio');
var txtMPAfiltro = document.getElementById('txtMPAfiltro');


txtMPAfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        fnMPAbuscarregistros();
    }
});
function fnMPAbuscarregistros() {
    var obj = { filtro: txtMPAfiltro.value };
    let controller = new PrincipioActivoController();
    controller.BuscarRegistros(obj, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idprincipio="'+data[i].idprincipio+'">';
            fila += '<td>'+data[i].descripcion+'</td>';
            fila += '</tr>';
        }
        tbodyMPAprincipio.innerHTML = fila;
    });
}
$('#modalprincipioactivo').on('shown.bs.modal', function () {
    fnMPAbuscarregistros();
});