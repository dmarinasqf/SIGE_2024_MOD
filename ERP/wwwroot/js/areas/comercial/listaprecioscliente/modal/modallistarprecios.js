var MSEtxtidlista = document.getElementById('MSEtxtidlista');
var MSEtbodyprecio = document.getElementById('MSEtbodyprecio');
var MSEtbllista = document.getElementById('MSEtbllista');

//$(document).ready(function () {
//    console.log(MSEtxtidlista.value);
//    alert(MSEtxtidlista.value);

//});

//window.onload = function () {
//    console.log(MSEtxtidlista.value);
//    alert(MSEtxtidlista.value);
//}

function cargarlistadeprecios(val) {
    var obj = { codigo: val };
    let controller = new ListaPreciosClienteController();
    controller.ListarPreciosCliente(obj, function (data) {
        try { MSEtbllista.clear().draw(); } catch (e) { console.log(e); }
        limpiarTablasGeneradas('#contenedor', 'MSEtbllista', false);
        crearCabeceras(data, '#MSEtbllista');
        crearCuerpo(data,'#MSEtbllista')
        iniciarTabla();
    });
}

function iniciarTabla() {
    MSEtbllista = $('#MSEtbllista').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}