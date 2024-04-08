var tbl_MPStabla;
var MPStimerbusqueda = null;

var MPS_cmbtipoproducto = $('#MPS_cmbtipoproducto');
var MPS_txtfiltro = document.getElementById('MPS_txtfiltro');
var tbl_MPStablatbody = document.getElementById('tbl_MPStablatbody');
$(document).ready(function () {
    tbl_MPStabla = $('#tbl_MPStabla').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        paging: false,
        info: false       
    });
    var obj = {
        top: 10
    };
    fn_MPSListarTipoProducto();
    MPS_fnbuscardatos(obj);
});

MPS_txtfiltro.addEventListener('keyup', function (e) {
    clearTimeout(MPStimerbusqueda);
    var $this = this;
    MPStimerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            MPS_fnbuscardatos();
        }

    }, 1000);   
});
MPS_cmbtipoproducto.change(function () {
    MPS_fnbuscardatos();
});
$('#modalproductosstock').on('shown.bs.modal', function (e) {
    MPS_txtfiltro.value = '';
    MPS_fnbuscardatos();
});
function fn_MPSListarTipoProducto() {
    let controller = new ProductoController();
    controller.ListarTipoProducto('MPS_cmbtipoproducto');
}

function MPS_fnbuscardatos() {
    var obj = {
        top: 20,    
        producto: MPS_txtfiltro.value.toUpperCase().trim(),
        tipoproducto: MPS_cmbtipoproducto.val(),
        sucursal: IDSUCURSAL
    };
    let controller = new StockController();
    controller.GetProductosConStock(obj, fn_MPSLlenarTablas);
}
function fn_MPSLlenarTablas(data) {
    tbl_MPStabla.clear().draw(false);
    tbl_MPStablatbody.innerHTML = '';
    var fila = '';
    for (var i = 0; i < data.length; i++) {
        fila += '<tr idproducto="' + data[i].idproducto + '" idstock="' + data[i].idstock + '" idalmacensucursal="' + data[i].idalmacensucursal + '" >';
        fila += '<td class="codigoproducto">' + data[i].codigoproducto+'</td>';
        fila += '<td class="nombre">' + data[i].nombre+'</td>';
        fila += '<td class="laboratorio">' + data[i].laboratorio+'</td>';
        fila += '<td class="stockactual">' + data[i].stockactual+'</td>';
        fila += '<td class="lote">' + data[i].lote+'</td>';
        fila += '<td class="fechavencimiento">' + data[i].fechavencimiento + '</td>';
        fila += '<td class="regsanitario">' + data[i].regsanitario + '</td>';
        fila += '<td class="almacen">' + data[i].almacen + '</td>';
        fila += '<td ><button class="btn btn-sm btn-success MPS_btnseleccionarstock" idstock="' + data[i].idstock + '"><i class="fas fa-check"></i></button></td>';

        fila += '</tr>';
       
    }
    tbl_MPStablatbody.innerHTML = fila;
}
