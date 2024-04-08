var lblMHCnombrescliente = document.getElementById('lblMHCnombrescliente');
var txtMHCfechainicio = document.getElementById('txtMHCfechainicio');
var txtMHCfechafin = document.getElementById('txtMHCfechafin');
var btnMHCbuscarhistorial = document.getElementById('btnMHCbuscarhistorial');
var tblMHCtablahistorial;
var _MHCIDCLIENTE = '';
var _ARRAYHISTORIAL = [];
$(document).ready(function () {

    tblMHCtablahistorial = $('#tblMHCtablahistorial').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": true,
        info: false,
        paging: false,     
        "language": LENGUAJEDATATABLE(),
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]]
    });
    txtMHCfechafin.value = moment().format('YYYY-MM-DD');
    txtMHCfechainicio.value = '2020-11-01';
});
txtMHCfechainicio.addEventListener('change', function () {
    txtMHCfechafin.setAttribute('min', moment(txtMHCfechainicio.value).format('YYYY-MM-DD'));
});

btnMHCbuscarhistorial.addEventListener('click', function () {
    var model = new ModalHistorialVentasCliente();
    model.fnbuscarventas(_MHCIDCLIENTE);
});

$('#tblMHCtablahistorial tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblMHCtablahistorial.row(tr);
    var columna = tblMHCtablahistorial.row($(this).parents('tr')).data();
    var fila = this.parentNode;   
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        tr.addClass('details');
        row.child(fnMCHagregardetalle(fila.getAttribute('idventa'))).show();
    }
});


function fnMCHagregardetalle(idventa) {
    var index = fnMCHencontrarindexarray(idventa);
    if (index == -1) {
        return '<label>Error al leer los datos</label>';
    } else {
        var detalle = JSON.parse(_ARRAYHISTORIAL[index].detalle);

        var fila = '<table width="100%" >';
        fila += '<thead><tr class="table-active"><th>Cod</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fraccion</th></tr></thead>';
        for (var i = 0; i < detalle.length; i++) {
            fila += '<tr class="table-active">';
            fila += '<td>' + detalle[i].codigoproducto + '</td>';
            fila += '<td>' + detalle[i].producto + '</td>';
            fila += '<td>' + detalle[i].cantidad + '</td>';
            fila += '<td>' + (detalle[i].precioigv??0).toFixed(2) + '</td>';
            fila += '<td>' + (detalle[i].isfraccion ? '✓' : '') + '</td>';

            //fila += '<td>' + (detalle[i].isblister ? '✓' : '') + '</td>';           
            fila += '</tr>';
        }
        fila += '</table>';
        return fila;
    }  
}
function fnMCHencontrarindexarray(idventa) {
    console.log(idventa);
    for (var i = 0; i < _ARRAYHISTORIAL.length; i++) {
        if (_ARRAYHISTORIAL[i].idventa.toString() == idventa)
            return i;
    }
    return -1;
}
class ModalHistorialVentasCliente {
    fnbuscarventas(idcliente) {
        let controller = new VentasController();
        var obj = {
            idcliente: idcliente,
            top: 100,
            fechainicio: txtMHCfechainicio.value,
            fechafin: txtMHCfechafin.value
        };
        tblMHCtablahistorial.clear().draw(false);
        _ARRAYHISTORIAL = [];
        controller.HistorialClientes(obj, function (data) {     
            _ARRAYHISTORIAL = data;
            for (var i = 0; i < data.length; i++) {
                var fila = tblMHCtablahistorial.row.add([
                    '',
                    data[i].sucursal,
                    data[i].fecha,
                    data[i].numdocumento,
                    data[i].importe,
                    data[i].usuario,
                ]).draw(false).node();
                fila.setAttribute('idventa', data[i].idventa);
                fila.getElementsByTagName('td')[0].classList.add('details-control');
            }
          
        });
    }
}