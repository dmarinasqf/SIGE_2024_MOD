var tblinsumosdeproveedor;
var numDecimales = 2;

var checktodosINSUMO = $('#checktodosINSUMO');
var cmbtipoproductomodal = $('#cmbtipoproductomodal');
var MIP_txtbuscarproductos = document.getElementById('MIP_txtbuscarproductos');
$(document).ready(function () {
    tblinsumosdeproveedor = $('#tblinsumosdeproveedor').DataTable({
        "searching": false,
        "paging": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        info:false,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]
    });
    let productocontroller = new ProductoController();
    productocontroller.ListarTipoProducto('cmbtipoproductomodal');
});


MIP_txtbuscarproductos.addEventListener('keyup', function () {
    var value = this.value;
    if (value.length % 2 === 0) 
        listarisumosproveedores();
    
});


cmbtipoproductomodal.change(function (e) {
    listarisumosproveedores();

});

function fn_MIPbuscarinsumoproveedor() {
    let controller = new ProductoProveedorController();
    controller.BuscarProductos(obj, function () {

    });
}
function listarisumosproveedores() {
    let controller = new ProductoProveedorController();
    var obj = {
        idproveedor: txtidproveedor.val(),
        tipo: cmbtipoproductomodal.val(),
        top: 10,
        producto: MIP_txtbuscarproductos.value
    };
    checktodosINSUMO.prop('checked', false);
    BLOQUEARCONTENIDO("tblinsumosdeproveedor", "Cargando...");
    controller.BuscarProductos(obj, function (data) {
        if (data.length > 0) {
            var arrayVerificacion = data.filter(x => x.CODPROQF.includes("IM") || x.CODPROQF.includes("IS"));
            if (arrayVerificacion.length > 0) {
                numDecimales = 5;
            }
            tblinsumosdeproveedor.clear().draw(false);
            for (var i = 0; i < data.length; i++) {
                tblinsumosdeproveedor.row.add([
                    '<span class="idproducto">' + data[i]['IDPROQF'] + '</span>' +
                    '<span class="idproductoproveedor">' + data[i]['IDPROPROV'] + '</span>' +
                    '<span class="iduma">' + data[i]['IDUMA'] + '</span>' +
                    '<span class="idump">' + data[i]['IDUMP'] + '</span>',
                    '<span class="codproducto">' + data[i]['CODPROQF'] + '</span><br><span class="codproveedor">' + data[i]['CODPROPROV'] + '</span>',
                    '<span class="nombreproducto">' + data[i]['NOMBRE_PROD_QF'] + '</span><br><span class="nombreproveedor">' + data[i]['NOMBRE_PROD_PROV'] + '</span>',
                    '<span class="uma">' + data[i]['UMA'] + '</span><br><span class="ump">' + data[i]['UMP'] + '</span>',
                    data[i]['EQUIVALENCIA'],
                    data[i]['VVF'].toFixed(numDecimales),
                    data[i]['PVF'].toFixed(numDecimales),
                    '<button class="btn btn-sm  btn-success btnpasarinsumoproveedor"><i class="fas fa-check"></i></button>'
                ]).draw(false);
            }
        }
        DESBLOQUEARCONTENIDO("tblinsumosdeproveedor");
    });
    $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
   
}

//$('#tblinsumosdeproveedor tbody').on('click', 'tr', function () {
//    if ($(this).hasClass('selected')) {
//        console.log();
//    }
//    else {
//        tblinsumosdeproveedor.$('tr.selected').removeClass('selected');
//        $(this).addClass('selected');
//    }
//});


$('#tblinsumosdeproveedor tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
    //var numproformas = tblproformas.rows('.selected').data().length;   
});

checktodosINSUMO.click(function (e) {
    var data = $(this).prop('checked');
    console.log(data);
    if (data)
        $("#tblinsumosdeproveedor tbody tr").addClass('selected');
    else
        $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
});