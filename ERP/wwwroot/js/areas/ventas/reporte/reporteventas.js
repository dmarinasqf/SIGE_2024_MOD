//var txtidsucursal = document.getElementById('txtidsucursal');
//var txtsucursal = document.getElementById('txtsucursal');


var txtcliente = document.getElementById('txtcliente');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var cmbtipoplantilla = document.getElementById('cmbtipoplantilla');
var cmbtipodocumento = document.getElementById('cmbtipodocumento');
var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var imgload = document.getElementById('imgload');
var tblreporte;



$(document).ready(function ()  {

    init();
    

});
function init() {
    let sucucontroller = new SucursalController();
    sucucontroller.ListarTodasSucursales('cmbsucursales', null, function () {
        var demo1 = $('#cmbsucursales').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
        });
        var container1 = demo1.bootstrapDualListbox('getContainer');
        container1.find('.btn').removeClass('btn-default').addClass('btn-xs btn-outline-info btn-h-outline-info btn-bold m-0')
            .find('.glyphicon-arrow-right').attr('class', 'fa fa-arrow-right').end()
            .find('.glyphicon-arrow-left').attr('class', 'fa fa-arrow-left')
    });

    let documento = new DocumentoTributarioController();
    documento.Listar(null, function (data) {      
      
        cmbtipodocumento.innerHTML = '';
        var option = '';        
        for (var j = 0; j < data.length; j++) {
            if (data[j].codigosunat == '01' || data[j].codigosunat == '03'|| data[j].codigosunat == '07' || data[j].descripcion == 'NOTA DE VENTA') {
                option = document.createElement('option');
                option.value = data[j].iddocumento;
                option.text = data[j].descripcion;
                option.selected = true;
                cmbtipodocumento.appendChild(option);
            }
           
        }
        $('#cmbtipodocumento').select2({
            allowClear: true,
        });
    });
}
function fngetsucursales() {
    var options = $('select[name="cmbsucursales[]_helper2"]').find('option');
    var sucursales = '';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value != '') {
            if (options.length - 1 != i)
                sucursales += options[i].value + '|';
            else
                sucursales += options[i].value;
        }
    }
    return sucursales;
}
function iniciarTabla() {
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = false;
    datatable.ordering = false;
    datatable.destroy = true;
    datatable.scrollX = true;
    var util = new UtilsSisqf();
    tblreporte = util.Datatable('tblreporte', false, datatable);
}
function fngetreporte(top) {
    if (fngetsucursales().length == 0)
        return;
    if (top == null || top == '')
        top = 1000;
    var obj = {
        sucursal: fngetsucursales(),
        top: top,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        cliente: txtcliente.value,
        tipoplantilla: cmbtipoplantilla.value,
        documentos: $('#cmbtipodocumento').val().join('|')
    };
    let controller = new ReporteVentasController();
    controller.GetReporteVentas(obj, function (data) {
        console.log(data);
        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x/reporteventas/fngetreporte"); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');    
        iniciarTabla();

    });
    
}

txtfechainicio.addEventListener('change', function () {
    txtfechafin.setAttribute('min', moment(txtfechainicio.value).format('YYYY-MM-DD'));
});

btnexportar.addEventListener('click', function () {
    if (fngetsucursales().length == 0)
        return;
    var obj = {
        sucursal: fngetsucursales(),
        top: 999999,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        cliente: txtcliente.value,
        tipoplantilla: cmbtipoplantilla.value,
        documentos: $('#cmbtipodocumento').val().join('|')
    };
    let controller = new ReporteVentasController();
    controller.ExportarReporteVentas(obj);
});
btnconsultar.addEventListener('click', function () {
    btnconsultar.disabled = true;
    if (imgload.style.visibility === 'visible') {
        imgload.style.visibility = 'hidden';
    } else {
        imgload.style.visibility = 'visible';
    }
    fngetreporte(1000);
});
txtcliente.addEventListener('dblclick', function () {
    $('#modalcliente').modal('show');
});
$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = this.parentNode.parentNode.parentNode;
    txtcliente.value = fila.getElementsByTagName('td')[2].innerText;
    $('#modalcliente').modal('hide');

});