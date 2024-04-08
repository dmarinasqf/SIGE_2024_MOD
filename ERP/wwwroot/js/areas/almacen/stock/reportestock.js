var txtproducto = document.getElementById('txtproducto');
var tblreporte;
var txtsucursal = document.getElementById('txtsucursal');
var cmbalmacen = document.getElementById('cmbalmacen');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var lblnombreproducto = document.getElementById('lblnombreproducto');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var btnpdf = document.getElementById('btnpdf');
var btnimprimir = document.getElementById('btnimprimir');
$(document).ready(function () {
    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();

    var $cmblaboratorio = $("#cmblaboratorio");

    function cargarDatosAjax() {
        $.ajax({
            url: fn.url,
            dataType: 'json',
            data: { laboratorio: '' },
            success: function (data) {
                // Formatear datos
                var formattedData = $.map(data, function (obj) {
                    return {
                        id: obj.idlaboratorio,
                        text: obj.descripcion
                    };
                });

                // Inicializar select2 con los datos cargados
                $cmblaboratorio.select2({
                    allowClear: true,
                    dropdownParent: $('#select2-parent'),
                    data: formattedData
                });
            }
        });
    }

    // Llamar a la función para cargar los datos por Ajax
    cargarDatosAjax();

    $("#checkbox").click(function () {
        if ($("#checkbox").is(':checked')) {
            // Obtener todos los valores y seleccionarlos en select2
            var allValues = $cmblaboratorio.find('option').map(function () {
                return this.value;
            }).get();

            $cmblaboratorio.val(allValues).trigger('change.select2');
        } else {
            $cmblaboratorio.val(null).trigger('change.select2');
        }
    });

    //fngetreporte();
    if (txtsucursal.getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('txtsucursal', null, null, null, true);
    }
    // Agregar un evento para manejar la apertura del cuadro desplegable
    $cmblaboratorio.on('select2:opening', function (e) {
        console.log('Cuadro desplegable abierto');
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
    if (top == null || top == '')
        top = 100;
    var obj = {
        producto: txtproducto.value,
        top: top,
        sucursal: txtsucursal.value,
        laboratorio: $('#cmblaboratorio').val().join('|'),
        almacen: cmbalmacen.value
    };
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    let controller = new StockController();
    controller.ReporteStock(obj, function (data) {
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);

        data.sort(function (a, b) {
            var productoA = a.producto.toUpperCase();
            var productoB = b.producto.toUpperCase();
            if (productoA < productoB) {
                return -1;
            }
            if (productoA > productoB) {
                return 1;
            }
            return 0;
        });
        crearCabeceras(data, '#tblreporte', false, 12);
        crearCuerpo(data, '#tblreporte', 12);
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}

//txtsucursal.addEventListener('change', function () {  
//        fngetreporte(1000);
//});
//txtproducto.addEventListener('keyup', function (e) {
//    if (e.key=='Enter')
//        fngetreporte(50);
//});
$('#txtsucursal').on('change', function () {
    console.log("changeee");
    let controller = new AlmacenSucursalController();
    controller.ListarAlmacenxSucursal('cmbalmacen', txtsucursal.value);
});

txtproducto.addEventListener('dblclick', function () {
    $('#modalproductos').modal('show');
});
$(document).on('click', '.btnpasarproducto', function () {
    var fila = tbl_CBPtabla.row($(this).parents('tr')).data();
    txtproducto.value = fila[1];
    lblnombreproducto.innerText = this.parentNode.parentNode.getElementsByClassName('nombreproducto')[0].innerText;
    /*fngetreporte(1000);*/
    $('#modalproductos').modal('hide');
});
//$(document).on('click', '.MBPS_btnseleccionarstock', function () {
//    var fila = this.parentNode.parentNode;

//    txtproducto.value = fila.getElementsByClassName('codigoproducto')[0].innerText;
//    fngetreporte();
//    $('#modalproductos').modal('hide');
//});
btnexportar.addEventListener('click', function () {
    var obj = {
        producto: txtproducto.value,
        top: 100000,
        sucursal: txtsucursal.value,
        laboratorio: $('#cmblaboratorio').val().join('|'),
        almacen: cmbalmacen.value
    };
    let controller = new StockController();
    controller.GenerarExcelStock(obj);
});
btnpdf.addEventListener('click', function () {
    var url = ORIGEN + "/Almacen/AStock/GenerarPdfStock";
    var producto = txtproducto.value;
    var top = 100000;
    var sucursal = txtsucursal.value;
    var laboratorio = $('#cmblaboratorio').val().join('|');
    var almacen = cmbalmacen.value;
    var obj = {
        url: url + "?producto=" + producto + "&top=" + top + "&sucursal=" + sucursal + "&laboratorio=" + laboratorio + "&almacen=" + almacen
    };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "reporteStock.pdf";
        link.download = fileName;
        link.click();
    }).fail(function (data) {
        mensajeError(data);
    });
});
btnconsultar.addEventListener('click', function () {
    fngetreporte(1000);
});

$(document).ready(function () {
    // Construye la URL con los parámetros
    var url = ORIGEN + '/Almacen/AReporte/ImprimirReporteStock';
    // Asigna la URL al atributo href
    btnimprimir.setAttribute('href', url);
});

//btnimprimir.addEventListener('click', function () {
//    // Construye la URL con los parámetros
//    var url = ORIGEN + '/Almacen/AReporte/ImprimirReporteStock';
//    // Asigna la URL al atributo href
//    btnimprimir.setAttribute('href', url);
//});

btnimprimir.addEventListener('click', function () {

    var producto = txtproducto.value;
    var sucursal = txtsucursal.value;
    var laboratorio = $('#cmblaboratorio').val().join('|');
    var almacen = cmbalmacen.value;

    var href = this.getAttribute('href') + '?producto=' + producto + '&sucursal=' + sucursal + '&laboratorio=' + laboratorio + '&almacen=' + almacen;
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR REPORTE STOCK');
    // Asigna la URL al atributo href

});

function validarllegad() {

    var producto1 = txtproducto.value;
    return producto1;
}

