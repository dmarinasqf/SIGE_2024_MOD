var MBGtbodygenericos = document.getElementById('MBGtbodygenericos');
var MBGtxtfiltro = document.getElementById('MBGtxtfiltro');

MBGtxtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        MBGfnbuscargenericos();
    }
});
$('#modalgenericos').on('shown.bs.modal', function () {
    MBGtxtfiltro.value = '';
    MBGfnbuscargenericos();
});
function MBGfnbuscargenericos() {
    let controller = new ProductoController();
    var obj = { filtro: MBGtxtfiltro.value.trim(), top:30};
    controller.BuscarGenericos(obj, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idproducto="' + data[i].idproducto + '" >';
            fila += '<td><button class="MBGbtnseleccionargenerico btn btn-sm btn-success"><i class="fas fa-check"></i></button></td>';
            fila += '<td>' + data[i].codigo + '</td>';
            fila += '<td>' + data[i].producto + '</td>';        
            fila += '<td>' + data[i].laboratorio + '</td>';
            
            fila += '</tr>';
        }
        MBGtbodygenericos.innerHTML = fila;
    });
}