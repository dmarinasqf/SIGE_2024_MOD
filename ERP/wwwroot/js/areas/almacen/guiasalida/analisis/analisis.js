var cmbalerta = document.getElementById('cmbalerta');

//var tblreporte = document.getElementById('tblreporte');
//var txtsucursal = document.getElementById('txtsucursal');
//var lblnombreproducto = document.getElementById('lblnombreproducto');

//var txtstockinicial = document.getElementById('txtstockinicial');
//var txtstockfinal = document.getElementById('txtstockfinal');

//var btnconsultar = document.getElementById('btnconsultar');
//var btnexportar = document.getElementById('btnexportar');

var btnaprobarcriterios = document.getElementById('btnaprobarcriterios');
//var btnpreviewdistribucion = document.getElementById('btnpreviewdistribucion');

var CC_tblsucursal;
var listasucursalesseleccionadas = [];
var totalseleccionados = 0;


$(document).ready(function () {   
    listar();
    fnlistarlaboratorio();

    CC_tblsucursal = $('#CC_tblsucursal').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[100, 200, 500, -1], [100, 200, 500, "All"]],
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA SUCURSALES ', 'H', false),
        "language": LENGUAJEDATATABLE()
    });
});

//btnconsultar.addEventListener('click', function () {
   // fngetreporte();
//});

function fngetreporte() {
    var obj = {
        alerta:cmbalerta.value,
        sucursal: cmbsucursal.value,
        laboratorio: cmblaboratorio.value
    };
    let controller = new ReporteController();
    //
    controller.ReporteAnalisisStock(obj, function (data) {

        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();

    });
}

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

/*btnexportar.addEventListener('click', function () {
    var obj = {
        sucursal: cmbsucursal.value
    };
    let controller = new ReporteController();
    controller.GenerarExcelAnalisisStock(obj);
});
*/



function listar() {
    const $cmbalerta = document.getElementById('cmbalerta');
    let value = ['0','1','2'];
    let text = ['TODOS', 'SI', 'NO'];
    for (var i = 0; i < value.length; i++) {
        const option = document.createElement('option');
        option.value = value[i];
        option.text = text[i];
        $cmbalerta.appendChild(option);
    }
}

//btnaprobarcriterios.addEventListener('click', function () {
//    $('#btnnextview').click();
//    CD_listaranalisis();
//});



$('#CC_form-registro').submit(function (e) {
    e.preventDefault();
    totalseleccionados = 0;
    $('.checkbox').each(function () {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            if ($(this).attr('id') !== "CC_chk_todosucursal") {
                totalseleccionados++;
                if (fn_buscarIdEnListaSucursales(id) == -1 && id != IDSUCURSAL)
                    listasucursalesseleccionadas.push(id);
            }
        } else {
            let pos = fn_buscarIdEnListaSucursales(id);
            if (pos >= 0)
                listasucursalesseleccionadas.splice(pos, 1);
        }
    });
    if (totalseleccionados == 0) {
        alertaSwall("W", "Seleccione una sucursal para realizar la transferencia.", "")
    } else {
        limpiarTablasGeneradas('#CD_tabla-distribucion', 'CD_tbldistribucion', true);
        CD_tblproductos.clear().draw(false);
        $('#btnnextview').click();
    }
   
});


function CC_seleccionarTodo() {
    var checkbox = document.getElementById('CC_chk_todosucursal');
    var checked = checkbox.checked;
    if (checked)
        $('.checkbox').prop('checked', true);
    else
        $('.checkbox').prop('checked', false);
}

function fn_buscarIdEnListaSucursales(id) {
    for (let i = 0; i < listasucursalesseleccionadas.length; i++) {
        if (listasucursalesseleccionadas[i] == id)
            return i;
    }
    return -1;
}