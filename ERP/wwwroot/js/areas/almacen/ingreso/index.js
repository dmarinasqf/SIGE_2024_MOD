var tbllista
var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtidsucursal = document.getElementById('txtidsucursal');
var txtfecharegistro = document.getElementById('txtfecharegistro');
var btnbusqueda = document.getElementById('btnbusqueda');

//variables
var _DETALLE = [];
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
    fnGetHistorial();
    var tipo = txtidsucursal.getAttribute('tipo');
    if (tipo == 'combo')
        fnlistarsucursales();
});

function fnGetHistorial() {
    let controller = new IngresoManualController();
    var obj = {
        fechainicio: txtfecharegistro.value,
        fechafin: txtfecharegistro.value,    
        sucursal: txtidsucursal.value,
        top: 100
    };
    controller.GetHistorial(obj, function (data) {
        _DETALLE = data;
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
           var fila= tbllista.row.add([
                '',
                '',
                data[i].idingreso,
                data[i].sucursalregistro,
                data[i].fecha,
                data[i].estado,
                data[i].usuario                
           ]).draw(false).node();
            fila.getElementsByTagName('td')[0].classList.add('details-control');
            fila.getElementsByTagName('td')[0].setAttribute('idingreso', data[i].idingreso);
        }
        tbllista.columns.adjust().draw(false);
    });
}

function fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursalesMLaboratorios('txtidsucursal', '', null);
}
function fnagregardetalleatabla(idingreso) {
    var index = fnencontrarindexarray(idingreso);
    if (index == -1) {
        return '<label>Error al leer los datos</label>';
    } else {
        var detalle = JSON.parse(_DETALLE[index].detalle)
        var fila = '<table width="100%" >';
        fila += '<thead><tr class="table-active"><th>SUCURSAL</th><th>COD</th><th>PRODUCTO</th><th>CANTIDAD</th><th>FRACCION</th><th>LOTE</th><th>REG</th><th>FECHA VENCIMIENTO</th></tr></thead>';
        for (var i = 0; i < detalle.length; i++) {
            fila += '<tr class="table-active">';
            fila += '<td>'+detalle[i].sucursal+'</td>';
            fila += '<td>'+detalle[i].codigoproducto+'</td>';
            fila += '<td>'+detalle[i].nombre+'</td>';
            fila += '<td>' + detalle[i].cantidad + '</td>';
            fila += '<td>' + (detalle[i].isfraccion ? '✓' : '') + '</td>';            

            //fila += '<td>' + (detalle[i].isblister ?'✓':'')+'</td>';
            fila += '<td>' + (detalle[i].lote)+'</td>';            
            fila += '<td>' + (detalle[i].regsanitario)+'</td>';            
            fila += '<td>' + (detalle[i].fechavencimiento)+'</td>';            
            fila += '</tr>';
        }
        fila += '</table>';
        return fila;
    }
    console.log(_DETALLE);
}
function fnencontrarindexarray(idingreso) {
    console.log(idingreso);
    for (var i = 0; i < _DETALLE.length; i++) {
        if (_DETALLE[i].idingreso == idingreso)
            return i;
    }
    return -1;
}
btnbusqueda.addEventListener('click', function () {
    fnGetHistorial();
});

txtfecharegistro.addEventListener('change', function () {
    fnGetHistorial();
});
$('#tbllista tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tbllista.row(tr);
    var columna = tbllista.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        tr.addClass('details');
        row.child(fnagregardetalleatabla(this.getAttribute('idingreso'))).show();
    }
});