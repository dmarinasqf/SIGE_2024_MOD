
var MBV_tbodyventas = document.getElementById('MBV_tbodyventas');
var MBV_txtfecha = document.getElementById('MBV_txtfecha');
var MBV_txtfiltro = document.getElementById('MBV_txtfiltro');
$(document).ready(function () {

});

function MBV_fnbuscarventas()
{
    let controller = new VentasController();
    var idsucursall = document.getElementById('txtidsucursal').value;
    var obj = {
        fechainicio: MBV_txtfecha.value,
        fechafin: MBV_txtfecha.value,
        numdocumento: MBV_txtfiltro.value.toUpperCase(),
        top:15,
        sucursal: idsucursall
    };

    controller.GetHistorialVentas(obj, function (data) {
        //console.log('Hola2')
        var fila = '';
        MBV_tbodyventas.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr>';
            fila += '<td>'+data[i].sucursal+'</td>';
            fila += '<td>' + data[i].numdocumento+'</td>';
            fila += '<td>' + data[i].fecha+'</td>';
            fila += '<td>' + data[i].cliente+'</td>';
            fila += '<td>' + data[i].importe.toFixed(2)+'</td>';
            fila += '<td>' + data[i].usuario+'</td>';
            fila += '<td>' + data[i].estado+'</td>';
            fila += '<td><button class="btn btn-sm btn-success MBV_btnselectventa" idventa="' + data[i].idventa+'"><i class="fas fa-check"></i></button></td>';          
            fila += '</tr>';
        }
        MBV_tbodyventas.innerHTML = fila;
    });
}

MBV_txtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBV_fnbuscarventas();
});
MBV_txtfecha.addEventListener('change', function () {
    if (MBV_txtfecha.value.length == 10)
        MBV_fnbuscarventas();

});
$('#modalbuscarventas').on('show.bs.modal', function (e) {
    MBV_fnbuscarventas();
});
$('#MBV_tbodyventas').on('click', 'tr', function () {
    
    var filas = document.querySelectorAll('#MBV_tbodyventas .selected');
   
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    this.classList.add('selected');
});