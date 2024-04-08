var tbllista
var txtnumdocventa = document.getElementById('txtnumdocventa');
var txtnundocnota = document.getElementById('txtnundocnota');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var btnbusqueda = document.getElementById('btnbusqueda');
var txtcliente = document.getElementById('txtcliente');
var txtsucursal = document.getElementById('txtsucursal');
var btndescargar = document.getElementById('btndescargar');

//variables
var tiposucursal = '';
$(document).ready(function() {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        //pageLength: [15]
    });
    fnGetHistorial();
    if (txtsucursal.getAttribute('tipo') == 'select') {
        tiposucursal = 'select';
        let sucucontroller = new SucursalController();
        sucucontroller.ListarTodasSucursales('txtsucursal', null, function () {
            var demo1 = $('#txtsucursal').bootstrapDualListbox({
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
    } else
        txtsucursal.value = IDSUCURSAL;
});

function fnGetHistorial() {
    let controller = new NotaCDController();
    var obj = {
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        numdocventa: txtnumdocventa.value.trim(),
        numdocnota: txtnundocnota.value.trim(),
        sucursal: (tiposucursal == 'select') ? fngetsucursales():txtsucursal.value,
        cliente: txtcliente.value.trim(),
        top: 100
    };
    controller.GetHistorialNotas(obj, function(data) {
        console.log(data);
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            var btntxt = '';
            if (isadmin)
                btntxt = ' <button class="btn btn-dark btntxt" idnota="' + data[i].idnota + '" data-toggle="tooltip" data-placement="right" title="Generar txt de facturación"><i class="far fa-file-alt"></i></button>';
            tbllista.row.add([
                `<div class="btn-group btn-group-sm">
                    `+ btntxt + `
                    <button class="btn btn-dark btnimprimir" href="` + ORIGEN + `/Ventas/NotaCD/ImprimirTicket/` + data[i].idnota + `"><i class="fas fa-print" ></i></button>
                    <button class="btn btn-primary btnver" idnota="` + data[i].idnota + `"><i class="fas fa-eye" ></i></button>
                </div>`,
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
btnbusqueda.addEventListener('click', function() {
    fnGetHistorial();
});
txtcliente.addEventListener('dblclick', function () {
    $('#modalcliente').modal('show');
});
$(document).on('click', '.btnimprimir', function() {
    var href = this.getAttribute('href');
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR NOTA DE CRÉDITO O DÉBITO');
});
$(document).on('click', '.btnver', function() {
    var idnota = this.getAttribute('idnota');
    var a = document.createElement('a');
    a.href = ORIGEN + "/Ventas/NotaCD/RegistrarEditar?idnota=" + idnota;
    a.target = "_blank";
    a.click();
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
        sucursal: (tiposucursal == 'select') ? fngetsucursales() : txtsucursal.value,
        cliente: txtcliente.value.trim(),
        top: 100000
    };
    controller.ExportarNotas(obj);
});
$(document).on('click', '.btntxt', function () {
    var controlleraux = new NotaCDController();
    controlleraux.GenerarTxtNota(this.getAttribute('idnota'), null);
});