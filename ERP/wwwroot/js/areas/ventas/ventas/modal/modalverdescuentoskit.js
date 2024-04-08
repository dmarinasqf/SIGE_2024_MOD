var MVDtbodytabla1 = document.getElementById('MVDtbodytabla1');
var MVDtbodytabla2 = document.getElementById('MVDtbodytabla2');
var _descuentosendetalle = [];
$(document).on('click', '.btndescuento', function (e) {
    var fila = this.parentNode.parentNode.parentNode;
    var obj = {
        idprecio: fila.getAttribute('idprecioproducto'),
        idproducto: fila.getAttribute('idproducto')
    };
    MDfnlistardescuentos(obj);
});

function MDfnlistardescuentos(obj) {

    let controller = new DescuentoController();
    MVDtbodytabla2.innerHTML = '';
    controller.ListarDescuentosxProducto(obj, function (data) {

        var primarios = JSON.parse(data.uno);
        var kits = JSON.parse(data.kit);

        var fila = '';
        var descuento = 0;
        for (var i = 0; i < primarios.length; i++) {
            fila += '<tr id="' + primarios[i].iddescuento + '" idproducto="' + primarios[i].idproducto + '" tipo="' + primarios[i].tipodescuento + '" idlista="' + primarios[i].idlista + '">';
            fila += '<td>FechaInicio ' + moment(primarios[i].fechainicio).format('DD/MM/YYYY hh:mm') + '</br>FechaFin ' + moment(primarios[i].fechafin).format('DD/MM/YYYY hh:mm') + '</td>';
            var datosproducto = '';
            datosproducto += primarios[i].nombre + '</br>';
            datosproducto += '<table><tr><th>Cant</th><th>Precio</th><th>Des</th><th>PFinal</th></tr></tr>';
            datosproducto += '<td>' + primarios[i].cantidad + '</td>';
            datosproducto += '<td>' + primarios[i].precio.toFixed(2) + '</td>';
            var pordescuento = primarios[i].dessucursal + primarios[i].desproveedor;

            datosproducto += '<td>' + pordescuento.toFixed(2) + '</td>';
            datosproducto += '<td>' + (primarios[i].precio - (primarios[i].precio * pordescuento) / 100).toFixed(2) + '</td>';
            datosproducto += '</tr></table>'
            fila += '<td>' + datosproducto + '</td>';
            fila += '<td></td>';
            fila += '<td><button class="btn btn-success btn-sm MVDbtnbajardescuento"><i class="fas fa-check"></i></button></td>';

            fila += '</tr>';
        }
        MVDtbodytabla2.innerHTML = fila;

        fila = '';
        for (var i = 0; i < kits.length; i++) {
            fila += '<tr  id="' + kits[i].iddescuento + '" tipo="' + kits[i].tipodescuento + '" idlista="' + kits[i].idlista + '">';
            fila += '<td>FechaInicio ' + moment(kits[i].fechainicio).format('DD/MM/YYYY hh:mm') + '</br>FechaFin ' + moment(kits[i].fechafin).format('DD/MM/YYYY hh:mm') + '</td>';

            var primarios = JSON.parse(kits[i].primario);
            var secundario = JSON.parse(kits[i].secundario);
            var productos1 = '';
            var productos2 = '';

            for (var j = 0; j < primarios.length; j++) {
                productos1 += primarios[j].nombre + '</br>';
                if (j == 0)
                    productos1 += '<table><tr><th>Cant</th><th>Precio</th><th>Des</th><th>PFinal</th></tr><tr>';
                productos1 += '<tr>';
                productos1 += '<td>' + primarios[j].cantidad + '</td>';

                productos1 += '<td>' + primarios[j].precio.toFixed(2) + '</td>';
                var descuento = primarios[j].descuento;
                var pordescuento = 0;
                if (descuento.length > 0)
                    pordescuento = descuento[0].dessucursal + descuento[0].desproveedor;
                productos1 += '<td>' + pordescuento.toFixed(2) + '</td>';
                productos1 += '<td>' + (primarios[j].precio - (primarios[j].precio * pordescuento) / 100).toFixed(2) + '</td>';
                productos1 += '</tr>'
                if (j == primarios.length - 1)
                    productos1 += '</tr></table>';
            }
            fila += '<td>' + productos1 + '</td>';
            for (var j = 0; j < secundario.length; j++) {
                productos2 += secundario[j].nombre + '</br>';
                if (j == 0)
                    productos2 += '<table><tr><th>Cant</th><th>Precio</th><th>Des</th><th>PFinal</th></tr><tr>';
                productos2 += '<td>' + secundario[j].cantidad + '</td>';
                productos2 += '<td>' + secundario[j].precio.toFixed(2) + '</td>';
                var descuento = secundario[j].descuento;
                var pordescuento = 0;
                if (descuento.length > 0)
                    pordescuento = descuento[0].dessucursal + descuento[0].desproveedor;
                productos2 += '<td>' + pordescuento.toFixed(2) + '</td>';
                productos2 += '<td>' + (secundario[j].precio - (secundario[j].precio * pordescuento) / 100).toFixed(2) + '</td>';

                if (j == primarios.length - 1)
                    productos2 += '</tr></table>';
            }
            fila += '<td>' + productos2 + '</td>';
            fila += '<td><button class="btn btn-success btn-sm MVDbtnbajardescuento"><i class="fas fa-check"></i></button></td>';

            fila += '</tr>';
        }
        MVDtbodytabla2.innerHTML = MVDtbodytabla2.innerHTML + fila;
    });
}
function MDfncargarstock(data) {

    var stock = data.maxcaja;
    var precio = data.precio;
    var checkdisabled = '';
    if (data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null)
        checkdisabled = 'disabled';
    var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" ' + checkdisabled + ' deshabilitado checked  multiplo="' + data.multiplo + '"/>';
    checkdisabled = '';
    checkdisabled = '';
    //si no hay stock en caja entonces poner stock en fraccion o multiplo
    if (stock === 0) {
        stock = data.maxfraccion;
        if (data.precioxfraccion.toString() === '' || data.precioxfraccion === null)
            precio = (REDONDEAR_DECIMALES(data.precio / data.multiplo, 2));
        else
            precio = REDONDEAR_DECIMALES(data.precioxfraccion, 2);

        checkfracion = checkfracion.replace('checked', 'checked');
    } else
        checkfracion = checkfracion.replace('checked', '');

    var input = '<input style="width:100%" value="1" class="text-center cantidad_detalle font-14" type="number"  min="1" max="' + stock + '" required readonly/>';
    var index = tbldetalle.rows().data().length;
    var fila = tbldetalle.row.add([
        '',
        index + 1,
        data.codigoproducto,
        data.nombre,
        data.lote,
        (data.fechavencimiento),
        input,
        checkfracion,
        //(data.venderblister) ? checkblister : '',
        '<span class="precio_detalle font-14">' + ((precio == 0.01) ? 0 : precio).toFixed(2) + '</span>',
        '<span class="descuento_detalle font-14">' + (data.descuento.toFixed(2) ?? '') + '</span>',
        '<span class="importe_detalle font-14">' + precio.toFixed(2) + '</span>',
        '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + data.idstock + '"><i class="fas fa-trash-alt"></i></button>'
    ]).draw(false).node();
    (fila).setAttribute('idstock', data.idstock);
    (fila).setAttribute('idproducto', data.idproducto);
    (fila).setAttribute('idprecioproducto', data.idprecioproducto);
    (fila).setAttribute('tipoimpuesto', data.tipoimpuesto);
    (fila).setAttribute('tipo', 'descuento');
    (fila).setAttribute('tipodescuento', 'secundario');
    fila.setAttribute('iddescuentolista', data.iddescuentolista);
    fila.setAttribute('iddescuento', data.iddescuento);
    $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
    fila.getElementsByTagName('td')[0].classList.add('table-info');
    tbldetalle.columns.adjust().draw(false);  
    MDfncalcularmontosdescuento(tbodydetalle.getElementsByClassName('selected')[0]);
    fncalcularmontos();
}
function MDfneliminaritems(fila) {
    var iddescuentolista = fila.getAttribute('iddescuentolista');
    var iddescuento = fila.getAttribute('iddescuento');

    tbldetalle.row('.selected').remove().draw(false);
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    filas.forEach(function (e) {
        if (e.getAttribute('tipo') == 'descuento' && e.getAttribute('iddescuento') == iddescuento)
            tbldetalle.row(e).remove().draw(false);
    });
    fnagregarindex();
    fncalcularmontos();

}
function MDfncalcularmontosdescuento(fila) {
   
    var cantidad = parseFloat(fila.getElementsByClassName('cantidad_detalle')[0].value);
    var iddescuento = fila.getAttribute('iddescuento');
    var filas = document.querySelectorAll('#tbodydetalle tr');
    filas.forEach(function (e) {
       
        if (e.getAttribute('iddescuento') == iddescuento && e.getAttribute('tipodescuento')=='secundario') {
            var aux = e.getAttribute('iddescuentolista');
            var descuento = _descuentosendetalle.find(x => x.iddescuento == iddescuento && x.idlistadescuento == aux);
          
            if (descuento != undefined) {
                var auxcant = parseInt(cantidad / descuento.cantidadprimario);               
                e.getElementsByClassName('cantidad_detalle')[0].value = (descuento.cantidadsecundario*auxcant);
            }
        }
    });
    fncalcularmontos();
}
$('#MVDtbodytabla2').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#MVDtbodytabla2 tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    this.classList.add('selected');
});

$(document).on('click', '.MVDbtnbajardescuento', function () {
    var fila = this.parentNode.parentNode;
    var iddescuento = fila.getAttribute('id');
    var idproducto = fila.getAttribute('idproducto');
    var tipo = fila.getAttribute('tipo');
    var idlista = fila.getAttribute('idlista');

    var obj = {
        idproducto: idproducto,
        iddescuento: iddescuento,
        tipo: tipo,
        idlista: idlista
    };
    let controller = new StockController();
    controller.GetStockProductoxDescuento(obj, function (data) {
        data = data[0];

        var fila = tbodydetalle.getElementsByClassName('selected')[0];
        var isfraccion = false;
        try {
            isfraccion = fila.getElementsByClassName('checkfraccion_detalle')[0].checked;
        } catch (e) { }
        if (data.tipodescuento == 'uno') {

            var descuento = data.desproveedor + data.dessucursal;
            fila.getElementsByClassName('descuento_detalle')[0].innerText = descuento.toFixed(2);
            fila.setAttribute('iddescuentolista', data.id);
            fila.setAttribute('iddescuento', data.iddescuento);
            fila.getElementsByTagName('td')[0].classList.add('table-info');
           
            $('#modalverdescuentokit').modal('hide');
            fncalcularmontos();
        }
        var cantidadprimario = 1;
        if (data.tipodescuento == 'dos') {
            var primarios = JSON.parse(data.primario);
            var secundario = JSON.parse(data.secundario);

            if (primarios.length == 1) {
                cantidadprimario = primarios[0].cantidad;
                var descuento = primarios[0].desproveedor + primarios[0].dessucursal;
                if (isNaN(descuento)) descuento = 0;
                fila.getElementsByClassName('descuento_detalle')[0].innerText = descuento.toFixed(2);
                var cantidad = parseFloat(fila.getElementsByClassName('cantidad_detalle')[0].value);
                if (primarios[0].cantidad > cantidad)
                    fila.getElementsByClassName('cantidad_detalle')[0].value = primarios[0].cantidad;
                fila.setAttribute('iddescuentolista', primarios[0].id ?? '');
                fila.setAttribute('iddescuento', data.iddescuento ?? '');
                fila.setAttribute('tipo', 'descuento');
                fila.getElementsByTagName('td')[0].classList.add('table-info');

            }
            //else {
            //    tbldetalle.row('.selected').remove().draw(false);
            //    isfraccion = false;
            //    for (var i = 0; i < primarios.length; i++) {
            //        var descuento = primarios[i].desproveedor + primarios[i].dessucursal;
            //        if (isNaN(descuento)) descuento = 0;
            //        var stock = JSON.parse(primarios[i].stock)[0];
            //        stock.descuento = descuento;
            //        stock.iddescuentolista = primarios[i].id ?? '';
            //        stock.iddescuento = primarios[i].iddescuento;
            //        stock.cantidaddescuento = primarios[i].cantidad;                 
            //        stock.descuentoisfraccion = isfraccion;                 
            //        MDfncargarstock(stock);
            //    }

            //}
            if (secundario.length > 0) {

                for (var i = 0; i < secundario.length; i++) {
                    var descuento = secundario[i].desproveedor + secundario[i].dessucursal;
                    if (isNaN(descuento)) descuento = 0;
                    var stock = JSON.parse(secundario[i].stock)[0];
                    stock.descuento = descuento;
                    stock.iddescuentolista = secundario[i].id ?? '';
                    stock.iddescuento = data.iddescuento;
                    stock.cantidaddescuento = secundario[i].cantidad;
                    stock.descuentoisfraccion = isfraccion;
                    var obj = new objetodescuento();
                    obj.cantidadsecundario = secundario[i].cantidad;
                    obj.iddescuento = data.iddescuento;
                    obj.idlistadescuento = secundario[i].id;
                    obj.cantidadprimario = cantidadprimario;
                    _descuentosendetalle.push(obj);
                    MDfncargarstock(stock);
                }
            }
            $('#modalverdescuentokit').modal('hide');


        }
    });
});

class objetodescuento {
    constructor() {
        this.iddescuento = 0;
        this.idlistadescuento = 0;
        this.cantidadprimario = 0;
        this.cantidadsecundario = 0;
    }
}