
var tblreporte;
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

var rdlaboratorio = document.getElementById('rdlaboratorio');
var rdproveedor = document.getElementById('rdproveedor');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var cmbestado = document.getElementById('cmbestado');

var select2pro;
var select2lab;
$(document).ready(function () {
    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    select2lab = $('#cmblaboratorio').select2({
        placeholder: "Buscar Laboratorios",
        allowClear: true,
        ajax: fn,
        width: '500px',
    });
    let controllerprov = new ProveedorController();
    fn = controllerprov.BuscarProveedoresSelect2();
    select2pro = $('#cmbproveedor').select2({
        placeholder: "Buscar Proveedor",
        allowClear: true,
        ajax: fn,
        width: '500px',
    });  
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
    var idprolab = '';
    var tipo = $('input:radio[name=tiporadio]:checked').val();
   
    if (tipo == 'proveedor')   idprolab = cmbproveedor.value;    
    if (tipo == 'laboratorio') idprolab = cmblaboratorio.value;
    var obj = {
      fechainicio:txtfechainicio.value,
      fechafin :txtfechafin.value,
      estado: cmbestado.value,
      tipo: tipo,
       idlabpro: idprolab
    };
    let controller = new DescuentoController();
    controller.ReporteDescuentosCobrar(obj, function (data) {
      
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
        if (data.length == 0)
            return;
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();

    });
}


btnexportar.addEventListener('click', function () {
    var obj = {
        producto: txtproducto.value,
        top: 100000,
        sucursal: txtsucursal.value,
        laboratorio: $('#cmblaboratorio').val().join('|')
    };
    let controller = new DescuentoController();
    controller.GenerarExcelStock(obj);
});
btnconsultar.addEventListener('click', function () {
    fngetreporte(1000);
});

rdlaboratorio.addEventListener('click', function (e) {
    divlaboratorio.classList.remove('ocultar');
    divproveedor.classList.add('ocultar');
});
rdproveedor.addEventListener('click', function (e) {
    divproveedor.classList.remove('ocultar');
    divlaboratorio.classList.add('ocultar');
});