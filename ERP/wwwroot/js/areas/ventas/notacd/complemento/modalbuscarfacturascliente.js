var MBFCPL_tblfacturas;

var MBFCPL_txtcliente = document.getElementById('MBFCPL_txtcliente');
var MBFCPL_txtproducto = document.getElementById('MBFCPL_txtproducto');
var MBFCPL_txtlote = document.getElementById('MBFCPL_txtlote');

$(document).ready(function () {
    MBFCPL_tblfacturas = $('#MBFCPL_tblfacturas').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
});

function MBFCPL_fnbuscarventasmatriz() {
    vaciarObjetos();
    let controller = new VentasController();

    var valorSeleccionado = $('#txtidsucursal').val();
    var obj = {
        cliente: MBFCPL_txtcliente.value,
        producto: MBFCPL_txtproducto.value,
        lote: MBFCPL_txtlote.value,
        idsucursal:valorSeleccionado
    };
    BLOQUEARCONTENIDO('modalGetVentasMatrizParaNC', 'CARGANDO..');
    controller.GetVentasMatrizParaNC(obj, function (data) {
        try {
            MBFCPL_tblfacturas.clear().draw(false);
            for (var i = 0; i < data.length; i++) {
                var fila = MBFCPL_tblfacturas.row.add([
                    '',
                    data[i].sucursal,
                    data[i].numdocumento,
                    data[i].fecha,
                    data[i].cliente,
                    data[i].importe.toFixed(2),
                    data[i].usuario,
                    data[i].estado,
                    '<button class="btn btn-sm btn-success MBV_btnselectventa" idventa="' + data[i].idventa + '"><i class="fas fa-check"></i></button></td>'
                ]).draw(false).node();
                fila.getElementsByTagName('td')[0].classList.add('details-control');
                fila.getElementsByTagName('td')[0].setAttribute('idventa', data[i].idventa);
            }
            MBFCPL_tblfacturas.columns.adjust().draw(false);
            DESBLOQUEARCONTENIDO('modalGetVentasMatrizParaNC');
        } catch (error) {
            DESBLOQUEARCONTENIDO('modalGetVentasMatrizParaNC');
        }
    });


}

MBFCPL_txtcliente.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBFCPL_fnbuscarventasmatriz();
});
MBFCPL_txtproducto.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBFCPL_fnbuscarventasmatriz();
});
MBFCPL_txtlote.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        MBFCPL_fnbuscarventasmatriz();
});

$('#modalBuscarFacturaPorCliente').on('show.bs.modal', function (e) {
    MBFCPL_fnbuscarventasmatriz();
});
$('#MBFCPL_tblfacturas').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#MBFCPL_tblfacturas .selected');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    this.classList.add('selected');
});

var productosSeleccionados = {};
var productosTotalSeleccionados = {};
var detallesCreadosPorVenta = {};
var ventaabierta = {};

function vaciarObjetos() {
    productosSeleccionados = {};
    productosTotalSeleccionados = {};
    detallesCreadosPorVenta = {};
     ventaabierta = {};
}
$('#MBFCPL_tblfacturas tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = MBFCPL_tblfacturas.row(tr);
    var idventanu = this.getAttribute('idventa');
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        tr.addClass('details');
        if (!detallesCreadosPorVenta[idventanu]) {
      
            detallesCreadosPorVenta[idventanu] = true;
            ventaabierta[idventanu] = true;
            let obj = { idventa: idventanu };
            let controller = new VentasController();
            var fila = '<table width="100%">';
            fila += '<thead><tr class="table-active"><th>CODIGO</th><th>PRODUCTO</th><th>CANTIDAD</th><th>PRECIO</th><th>LOTE</th><th>REG. SANITARIO</th><th>FECHA VENCIMIENTO</th>  <th><input type="checkbox" class="selectAllCheckbox" id="" value="' + idventanu + '" checked></th></thead><tbody>';
            controller.GetDetalleVentasMatrizParaNC(obj, function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {

                        fila += '<tr class="table-active">';
                        fila += '<td>' + data[i].codigoproducto + '</td>';
                        fila += '<td>' + data[i].nombre + '</td>';
                        fila += '<td>' + data[i].cantidad + '</td>';
                        fila += '<td>' + data[i].precioigv + '</td>';
                        fila += '<td>' + data[i].lote + '</td>';
                        fila += '<td>' + data[i].regsanitario + '</td>';
                        fila += '<td>' + data[i].fechavencimiento + '</td>';
                        // Agregar el checkbox con el idproducto como valor
                        var idProducto = data[i].idproducto;
                        fila += '<td><input type="checkbox" class="productoCheckbox" data-value-idventa="' + idventanu + '" value="' + idProducto + '" checked></td>';

                        // Agregar el ID al objeto de productos seleccionados
                        productosSeleccionados[idProducto] = idventanu;
                        productosTotalSeleccionados[idProducto] = idventanu;
                        fila += '</tr>';
                    }
                }
                fila += '</tbody></table>';
                row.child(fila).show();

            });
        } else {
            // Los detalles ya han sido creados, solo abre o cierra la fila
            row.child.show();
        }
    }
});
function fnagregardetalleatabla(idventa) {
    let obj = { idventa: idventa };
    let controller = new VentasController();
    var fila = '<table width="100%">';
    fila += '<thead><tr class="table-active"><th>CODIGO</th><th>PRODUCTO</th><th>CANTIDAD</th><th>PRECIO</th><th>LOTE</th><th>REG. SANITARIO</th><th>FECHA VENCIMIENTO</th></thead><tbody>';
     controller.GetDetalleVentasMatrizParaNC(obj, function (data) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                fila += '<tr class="table-active">';
                fila += '<td>' + data[i].codigoproducto + '</td>';
                fila += '<td>' + data[i].nombre + '</td>';
                fila += '<td>' + data[i].cantidad + '</td>';
                fila += '<td>' + data[i].precioigv + '</td>';
                fila += '<td>' + data[i].lote + '</td>';
                fila += '<td>' + data[i].regsanitario + '</td>';
                fila += '<td>' + data[i].fechavencimiento + '</td>';
                // Agregar el checkbox con el idproducto como valor
                var idProducto = data[i].idproducto;
                fila += '<td><input type="checkbox" class="productoCheckbox" value="' + idProducto + '" checked></td>';
                productosSeleccionados[idProducto] = true;
                fila += '</tr>';
            }
        }
    });
    fila += '</tbody></table>';
    return fila;
}

// Manejar el cambio de estado del checkbox
$(document).on('change', '.productoCheckbox', function () {
    var idProducto = $(this).val();
    var idVenta = "";

    idVenta= $(this).data('value-idventa');

    // Actualizar el objeto de productos seleccionados
    if ($(this).prop('checked')) {
        productosSeleccionados[idProducto] = idVenta.toString();
    } else {
        delete productosSeleccionados[idProducto] === idVenta;
    }

    validarselecion(idVenta);
    // Puedes imprimir el objeto para ver su estado
    console.log(productosSeleccionados);
});

$(document).on('change', '.selectAllCheckbox', function () {
    var idventa = $(this).val();
    console.log(productosSeleccionados);
    console.log(productosTotalSeleccionados);
    // Actualizar el objeto de productos seleccionados
    if ($(this).prop('checked')) {
        // Si está seleccionado, asignar el objeto completo a productosSeleccionados
        productosSeleccionados = Object.assign({}, productosTotalSeleccionados);
        $.each(productosSeleccionados, function (idProducto, idventanu) {
            var selector = '.productoCheckbox[data-value-idventa="' + idventanu + '"][value="' + idProducto + '"]';
            $(selector).prop('checked', true);
        });
    } else {
        // Si no está seleccionado, limpiar el array de productos seleccionados
        productosSeleccionados = {};
        $('.productoCheckbox').each(function () {
            var idProducto = $(this).val();
            if (!(idProducto in productosSeleccionados)) {
                $(this).prop('checked', false);
            }
        });
    }
    // Puedes imprimir el objeto para ver su estado
    console.log(productosSeleccionados);
});

function validarselecion(idventa){
    var countProductosSeleccionados = 0;

    // Recorrer el objeto productosSeleccionados
    for (var idProducto in productosSeleccionados) {
        // Verificar si el idventa coincide con el valor en productosSeleccionados
        if (productosSeleccionados[idProducto] === idventa.toString()) {
            countProductosSeleccionados++;
        }
    }
    var selector = '.selectAllCheckbox[value="' + idventa + '"]';
    if (countProductosSeleccionados <=0) {
    
        $(selector).prop('checked', false);
       
    } else {
        // Si hay más de un producto o ninguno, deseleccionar el checkbox principal
        $(selector).prop('checked', true);
    }
}