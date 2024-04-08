var formbusqueda = document.getElementById('form-busqueda');
var txtnumguia = document.getElementById('txtnumguia');
var txtfactura = document.getElementById('txtfactura');
var txtpreingreso = document.getElementById('txtpreingreso');
var txtordencompra = document.getElementById('txtordencompra');

var tbllista;

$(document).ready(function () {
    iniciarTablaVista();
});
function iniciarTablaVista() {   
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = true;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);
    fnbuscarregistros();
}
$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

formbusqueda.addEventListener('submit', function (e) {
    e.preventDefault();
    fnbuscarregistros();
});

function fnbuscarregistros() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { value: 100, name: 'top' };
    //btnbusqueda.prop('disabled', true);
    var controller = new GuiaInternaDevolucionController();
    controller.HistorialGuias(obj, fnAgregarFilasTabla);
}

function fnAgregarFilasTabla(data) {
    console.log(data);
    tbllista.clear().draw();
    for (var i = 0; i < data.length; i++) {
        let btnimpresion = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-dark btnimprimir" data-toggle="tooltip" data-placement="top" title="Imprimir" onclick="fnimprimir(`+ data[i].numeroguia + `)"><i class="fas fa-print"></i></a>
                            <button class="btn btn-sm btn-outline-warning btneditar  font-10" data-toggle="tooltip" data-placement="top" idguia="`+ data[i].idguia +`"><i class="fas fa-edit"></i></button>
                            </div>`;
        tbllista.row.add([
            btnimpresion,
            data[i].fechaguia,
            data[i].numeroguia,
            data[i].factura,
            data[i].codigopreingreso,
            data[i].codigoorden,
            data[i].ruc,
            data[i].razonsocial,
            data[i].estado,
            data[i].usuario        
        ]).draw(false);
    }
    tbllista.columns.adjust().draw(false);
}
function verfacturas(id) {
    var obj = new _FacturasPreingreso();
    obj.fnListarFacturasPreingresoSinCheck(id);

}
//$(document).on('click', '.btnimprimir', function () {
//    var href = $(this).attr('href'); console.log(href);
//    ABRIR_MODALIMPRECION(href, 'IMPRIMIR GUÍA DE DEVOLUCIÓN ');
//});
$(document).on('click', '.btneditar', function () {
    var idguia = this.getAttribute('idguia');
    var obj = { tipo: 'guia', idtabla: idguia };
    $('#modalguiainternadevolucion').modal('show');  
    fnRDGbuscarguia(obj);
});

function fnimprimir(id) {
    var href = ORIGEN + `/PreIngreso/GuiaInternaDevolucion/Imprimir_V2/?id=` + id
    console.log(href);
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR DEVOLUCION');
}