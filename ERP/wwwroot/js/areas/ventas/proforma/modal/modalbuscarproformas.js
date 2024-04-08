var MPROFORMA_txtfiltro = document.getElementById('MPROFORMA_txtfiltro');
var MPROFORMA_tbody = document.getElementById('MPROFORMA_tbody');

$(document).ready(function () {

});
MPROFORMA_txtfiltro.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        MPROFORMA_fnbuscarproformas();
    }
});

$('#modalproforma').on('show.bs.modal', function (e) {
    MPROFORMA_txtfiltro.value = '';
    MPROFORMA_fnbuscarproformas();
});

function MPROFORMA_fnbuscarproformas() {
    let controller = new ProformaController();
    var obj = {
        top: 15,
        sucursal: '',
        numdocumento: MPROFORMA_txtfiltro.value,
        numsemanas: 1,
        estado:'HABILITADO'
    };
    controller.GetHistorialProformas(obj, function (data) {
      
        var fila = '';
        MPROFORMA_tbody.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr>';
            fila += '<td>' + data[i].codigoproforma+'</td>';
            fila += '<td>' + data[i].cliente+'</td>';
            fila += '<td>' + data[i].importe.toFixed(2)+'</td>';
            fila += '<td>' + data[i].usuario+'</td>';
            fila += '<td>' + data[i].estado+'</td>';
            fila += '<td><div class="btn-group btn-group-sm "><button class="btn btn-sm btn-success btnseleccionarproforma" codigoproforma="' + data[i].codigoproforma +'" idproforma="' + data[i].idproforma+'"><i class="fas fa-check"></i></button></div></td>';
            fila += '</tr>';
        }
        MPROFORMA_tbody.innerHTML = fila;
    });
}

