var tbl_MPStabla;
var MPS_timerBusqueda=null;
var MPS_cmbalmacen = $('#MPS_cmbalmacen');
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
    //MPS_fnbuscardatos(obj);
});

MPS_txtfiltro.addEventListener('keyup', function (e) {
    clearTimeout(MPS_timerBusqueda);
    var $this = this;
    MPS_timerBusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            MPS_fnbuscardatos();
        }

    }, 1000);

    
});
MPS_cmbtipoproducto.change(function () {
    MPS_fnbuscardatos();
});
MPS_cmbalmacen.change(function () {
    MPS_fnbuscardatos();
});
$('#modalproductosstock').on('shown.bs.modal', function (e) {
    MPS_txtfiltro.value = '';
    //MPS_fnbuscardatos();
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
        idalmacen: MPS_cmbalmacen.val()
    };
    let controller = new ProductoController();
    controller.BuscarProductoconStockxAlmacen(obj, fn_MPSLlenarTablas);
}
function fn_MPSLlenarTablas(data) {
    console.log(data);
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        tbl_MPStabla.clear().draw(false);
        tbl_MPStablatbody.innerHTML = '';
        var fila = '';
        let botonseleccionar='';
        for (var i = 0; i < datos.length; i++) {

            botonseleccionar = datos[i].fraccion > 0 ?
                '<td ><button class="btn btn-sm btn-success MPS_btnseleccionarstock" idstock="' + datos[i].idstock + '" cantmax="' + datos[i].fraccion+'"><i class="fas fa-check"></i></button></td>'
                : '<td ><button class="btn btn-sm btn-danger MPS_btnnoseleccionar"><i class="fas fa-times"></i></button></td>';

            fila += '<tr idproducto="' + datos[i].idproducto + '" idstock="' + datos[i].idstock + '" idalmacensucursal="' + datos[i].idalmacensucursal + '" >';
            fila += '<td class="codigoproducto">' + datos[i].codigoproducto + '</td>';
            fila += '<td class="nombre">' + datos[i].nombre + '</td>';
            fila += '<td class="laboratorio">' + datos[i].laboratorio + '</td>';
            //fila += '<td class="stockactual">' + datos[i].stockactual + '</td>';
            fila += '<td class="stockactual">' + datos[i].canfraccion + '</td>';
            fila += '<td class="fraccion">' + datos[i].fraccion + '</td>';
            fila += '<td class="multiplo">' + datos[i].multiplo + '</td>';
            fila += '<td class="lote">' + datos[i].lote + '</td>';
            fila += '<td class="fechavencimiento">' + datos[i].fechavencimiento + '</td>';
            fila += '<td class="regsanitario">' + datos[i].regsanitario + '</td>';
            fila += '<td class="almacen">' + datos[i].almacen + '</td>';
            fila += botonseleccionar;

            fila += '</tr>';

        }
        tbl_MPStablatbody.innerHTML = fila;
    } else 
        mensaje("W", data.mensaje, "BR");
            
}

$(document).on('click', '.MPS_btnnoseleccionar', function () {
    mensaje("W", "NO TIENE UNA CAJA COMPLETA PARA ENVIAR", "BR");
});