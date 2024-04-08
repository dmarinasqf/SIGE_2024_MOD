var tblorcompras;
var MBOC_txtordencompra = document.getElementById('MBOC_txtordencompra');
var MBOC_txtproveedor = document.getElementById('MBOC_txtproveedor');
var MBOC_txtfechainicio = document.getElementById('MBOC_txtfechainicio');
var MBOC_txtfechafin = document.getElementById('MBOC_txtfechafin');
var MBOC_cmbestado = document.getElementById('MBOC_cmbestado');
var _estados = ['APROBADO', 'PENDIENTE', 'TERMINADO', 'PREINGRESO PARCIAL'];

$(document).ready(function () {
    tblorcompras = $('#tblorcompras').DataTable({
        "searching": false,
        lengthChange: false,
        ordering: false,
        paging: true,
        info:false,
        "language": LENGUAJEDATATABLE() 
    });
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - 31);
    var fechaHaceUnMes = new Date(fecha).toISOString().split('T')[0];
    MBOC_txtfechainicio.value = fechaHaceUnMes;
    var fechaActual = new Date().toISOString().split('T')[0];
    MBOC_txtfechafin.value = fechaActual;
});

$('#tblorcompras tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblorcompras.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});



function fnBOC_ListarOrdenes(estado) {
    let controller = new OrdenCompraController();
    
    if (estado == null) {
        estado = fngetdatoscmbestado();
    }
    var obj = {
        id: MBOC_txtordencompra.value,
        proveedor: MBOC_txtproveedor.value,
        fechainicio: MBOC_txtfechainicio.value,
        fechafin: MBOC_txtfechafin.value,
        estado: estado,
        top: 100
    }
    controller.ListarCompras(obj, fnBOC_LlenarTablaOrdenes);
}
function fnBOC_LlenarTablaOrdenes(data) {
    tblorcompras.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
       var fila = tblorcompras.row.add([
            data[i]['CODIGO'],
            data[i]['RUC'],
            data[i]['RAZONSOCIAL'],
            moment(data[i]['FECHA']).format('DD/MM/YYYY hh:mm:ss'),
            data[i]['FEVENCIMIENTO'],
            data[i]['ESTADO'],
            data[i]['TOTAL'],
            data[i]['SUCURSALDESTINO'],
            data[i]['USERNAME'],
            '<button class="btnpasarorden btn btn-sm btn-success" id=' + data[i]['ID'] + '><i class="fas fa-check "></i></button>'
       ]).draw(false).node();
        if (data[i]['SUCURSALDESTINO'] == NOMBRESUCURSAL)
         fila.classList.add('table-success');
        tblorcompras.columns.adjust().draw();
    }
}

function fngetdatoscmbestado() {
    var estado = MBOC_cmbestado.value;
    if (MBOC_cmbestado.value === '') {
        var aux = '';
        for (var i = 0; i < _estados.length; i++) {
            aux += _estados[i] + " | ";
        }
        return aux;
    }
    return estado;
}

MBOC_txtordencompra.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnBOC_ListarOrdenes();
});
MBOC_txtproveedor.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnBOC_ListarOrdenes();
});
MBOC_txtfechainicio.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnBOC_ListarOrdenes();
});
MBOC_txtfechainicio.addEventListener('change', function (e) {
    fnBOC_ListarOrdenes();
});
MBOC_txtfechafin.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnBOC_ListarOrdenes();
});
MBOC_txtfechafin.addEventListener('change', function (e) {
    fnBOC_ListarOrdenes();
});
MBOC_cmbestado.addEventListener('change', function (e) {
    fnBOC_ListarOrdenes();
});
