var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');

var tbllista;
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
    fnListarConsumoEconomato();
});

function fnListarConsumoEconomato() {
    let controller = new AConsumoEconomatoController();
    var obj = {
        numdocumento: txtnumdocumento.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        top: 100
    };
    controller.ListarConsumoEconomato(obj, function (data) {
        var btnimp = '';
        _DETALLE = data;
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            btnimp = '<button class="btn btn-dark btnimprimir"><i class="fas fa-print" ></i></button>';//onclick="fnimprimir(' + data[i].idconsumoeconomato + ')"
            var fila = tbllista.row.add([
                '',
                //`<div class="btn-group btn-group-sm">
                //        ` + btnimp + `
                //</div>`,
                data[i].numdocumento,
                data[i].motivo,
                data[i].nombres,
                data[i].fechacreacion,
                data[i].estado
            ]).draw(false).node();
            fila.getElementsByTagName('td')[0].classList.add('details-control');
            fila.getElementsByTagName('td')[0].setAttribute('idconsumoeconomato', data[i].idconsumoeconomato);
        }
        tbllista.columns.adjust().draw(false);
    });
}

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
        row.child(fnagregardetalleatabla(this.getAttribute('idconsumoeconomato'))).show();
    }
});
function fnencontrarindexarray(idconsumoeconomato) {

    for (var i = 0; i < _DETALLE.length; i++) {
        if (_DETALLE[i].idconsumoeconomato == idconsumoeconomato)
            return i;
    }
    return -1;
}
function fnagregardetalleatabla(idconsumoeconomato) {
    var index = fnencontrarindexarray(idconsumoeconomato);
    if (index == -1) {
        return '<label>Error al leer los datos</label>';
    } else {
        var detalle = JSON.parse(_DETALLE[index].jsondetalle);

        var fila = '<table width="80%">';
        fila += '<thead><tr class="table-active"><th>ID</th><th>COD</th><th>PRODUCTO</th><th>CANTIDAD</th></tr></thead>';
        for (var i = 0; i < detalle.length; i++) {
            fila += '<tr>';
            fila += '<td>' + detalle[i].idproducto + '</td>';
            fila += '<td>' + detalle[i].codigoproducto + '</td>';
            fila += '<td>' + detalle[i].nombre + '</td>';
            fila += '<td>' + detalle[i].cantidad + '</td>';
            //fila += '<td>' + (detalle[i].isfraccion ? '✓' : '') + '</td>';

            //fila += '<td>' + (detalle[i].isblister ?'✓':'')+'</td>';
            //fila += '<td>' + (detalle[i].lote) + '</td>';
            //fila += '<td>' + (detalle[i].regsanitario) + '</td>';
            //fila += '<td>' + (detalle[i].fechavencimiento) + '</td>';
            fila += '</tr>';
        }
        fila += '</table>';
        return fila;
    }
    console.log(_DETALLE);
}

btnbusqueda.addEventListener('click', function () {
    fnListarConsumoEconomato();
});