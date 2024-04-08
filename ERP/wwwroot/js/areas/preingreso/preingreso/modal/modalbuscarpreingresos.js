//var MBPRE_txtcodpreingreso = document.getElementById('MBPRE_txtcodpreingreso');
//var MBPRE_txtcodigororden = document.getElementById('MBPRE_txtcodigororden');
var MBPRE_txtcodigofactura = document.getElementById('MBPRE_txtcodigofactura');
var MBPRE_txtproveedor = document.getElementById('MBPRE_txtproveedor');
var MBPRE_tblpreingresos;
var form_busqueda_preingreso = document.getElementById('form-busqueda-preingreso');
$(document).ready(function () {
    MBPRE_tblpreingresos = $('#MBPRE_tblpreingresos').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],      
        "language": LENGUAJEDATATABLE(),
        paging: true
    });
});


//MBPRE_txtcodpreingreso.addEventListener('keyup', function (e) {
//    if(e.key=='Enter')
//        MBPRE_fnBuscarPreingresos();
//});
//MBPRE_txtcodigororden.addEventListener('keyup', function (e) {
//    if (e.key == 'Enter')
//        MBPRE_fnBuscarPreingresos();
//});
MBPRE_txtcodigofactura.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBPRE_fnBuscarPreingresos();
});
MBPRE_txtproveedor.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBPRE_fnBuscarPreingresos();
});
$('#modalbuscarpreingresos').on('shown.bs.modal', function (e) {
    form_busqueda_preingreso.reset();
    MBPRE_fnBuscarPreingresos();
});
function MBPRE_fnBuscarPreingresos() {
    var obj = $('#form-busqueda-preingreso').serializeArray();
    obj[obj.length] = { value: 100, name: 'top' };
    //btnbusqueda.prop('disabled', true);
    var controller = new PreingresoController();
    controller.ListarPreingresosAprobarFactura(obj, MBPRE_fnAgregarFilasTabla);
}

function MBPRE_fnAgregarFilasTabla(data) {  
    MBPRE_tblpreingresos.clear().draw();
    for (var i = 0; i < data.length; i++) {
        var fecha = new Date(data[i]['FECHA']).toLocaleDateString("es-US");
        MBPRE_tblpreingresos.row.add([
            '<div class="btn-group btn-group-sm">' +           
            '<button class="btn btn-sm btn-success font-10 btnpasarpreingreso"  idfactura="' + data[i]['IDFACTURA'] +'" ><i class="fas fa-check"></i></button>' +           
            '</div>',
            data[i]['CODIGO'],
            data[i]['CODIGOORDEN'],
            data[i]['FACTURAS'],
            fecha,
            data[i]['RAZONSOCIAL'],
            data[i]['USERNAME'],
            data[i]['ESTADO'],
            data[i]['ESTADOFACTURA'],
        ]).draw(false);
    }

}