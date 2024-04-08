var txtproducto = document.getElementById('txtproducto');
var cmbsucursal = document.getElementById('cmbsucursal');
var cmbalmacen = document.getElementById('cmbalmacen');
var txtidproducto = document.getElementById('txtidproducto');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var tblreporte;
var txtsucursal = document.getElementById('txtsucursal');
var lblnombreproducto = document.getElementById('lblnombreproducto');

var txtstockinicial = document.getElementById('txtstockinicial');
var txtstockfinal = document.getElementById('txtstockfinal');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
$(document).ready(function () {   
        let controller = new SucursalController();
    controller.ListarTodasSucursalesMLaboratorios('cmbsucursal');
});
function iniciarTabla() {
    tblreporte = $('#tblreporte').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}
function fngetreporte(top) {
    if (top == null || top == '' || top==undefined)
        top = 100;
    var obj = {
        producto: txtidproducto.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        top: top,
        almacen: cmbalmacen.value
    };
    let controller = new ReporteController();
    controller.ReporteKardex(obj, function (data) {

        if (data != null && data.length > 0) {
            var primeritem = data[0];
            var ultimoitem = data[data.length - 1];
            txtstockinicial.value = primeritem.stock ;
            txtstockfinal.value = ultimoitem.stock;       
        } else {
            txtstockinicial.value='';
            txtstockfinal.value='';
        }
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x "+e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();

    });
}


cmbsucursal.addEventListener('change', function () {
    let controller = new AlmacenSucursalController();
    controller.ListarAlmacenxSucursal('cmbalmacen',cmbsucursal.value);
});

txtproducto.addEventListener('dblclick', function () {
    $('#modalproductos').modal('show');
});
$(document).on('click', '.btnpasarproducto', function () {
    var fila = tbl_CBPtabla.row($(this).parents('tr')).data();
    txtidproducto.value = this.getAttribute('idproducto');
    txtproducto.value = this.parentNode.parentNode.getElementsByClassName('nombreproducto')[0].innerText;
 
    $('#modalproductos').modal('hide');
});
btnconsultar.addEventListener('click', function () {
    fngetreporte();
});
btnexportar.addEventListener('click', function () {
    var obj = {
        producto: txtidproducto.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        top: 100000,
        almacen: cmbalmacen.value
    };
    let controller = new ReporteController();
    controller.GenerarExcelKardex(obj);
});