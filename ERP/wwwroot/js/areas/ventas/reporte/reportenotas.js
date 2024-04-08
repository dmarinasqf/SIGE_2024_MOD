var tbllista
var txtnumdocventa = document.getElementById('txtnumdocventa');
var txtnundocnota = document.getElementById('txtnundocnota');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var btnbusqueda = document.getElementById('btnbusqueda');
var txtcliente = document.getElementById('txtcliente');
var cmbsucursal = document.getElementById('cmbsucursal');
var btndescargar = document.getElementById('btndescargar');


$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
 
   
        tiposucursal = 'select';
        let sucucontroller = new SucursalController();
        sucucontroller.ListarTodasSucursales('cmbsucursal', null, function () {
            var demo1 = $('#cmbsucursal').bootstrapDualListbox({
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
});

function fnGetHistorial() {
    let controller = new NotaCDController();
    var obj = {
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        numdocventa: txtnumdocventa.value.trim(),
        numdocnota: txtnundocnota.value.trim(),
        sucursal: (tiposucursal == 'select') ? fngetsucursales() : cmbsucursal.value,
        cliente: txtcliente.value.trim(),
        top: 100
    };
    controller.GetHistorialNotas(obj, function (data) {
        console.log(data);
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            tbllista.row.add([             
                data[i].sucursal,
                data[i].documento,
                data[i].numdocnota,
                data[i].fecha,
                data[i].numdocventa,
                data[i].cliente,
                data[i].importe,
                data[i].estado,
                data[i].usuario,
                ''
            ]).draw(false);
        }
        tbllista.columns.adjust().draw(false);
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
btnbusqueda.addEventListener('click', function () {
    fnGetHistorial();
});
txtcliente.addEventListener('dblclick', function () {
    $('#modalcliente').modal('show');
});
txtfechainicio.addEventListener('change', function () {
    txtfechafin.setAttribute('min', moment(txtfechainicio.value).format('YYYY-MM-DD'));
    fnGetHistorial();
});
$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = this.parentNode.parentNode.parentNode;
    txtcliente.value = fila.getElementsByTagName('td')[2].innerText;
    $('#modalcliente').modal('hide');

});
btndescargar.addEventListener('click', function () {
    let controller = new NotaCDController();
    var obj = {
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        numdocventa: txtnumdocventa.value.trim(),
        numdocnota: txtnundocnota.value.trim(),
        sucursal: (tiposucursal == 'select') ? fngetsucursales() : cmbsucursal.value,
        cliente: txtcliente.value.trim(),
        top: 100000
    };
    controller.ExportarNotas(obj);
});