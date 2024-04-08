function fncalcularbonificacion(input,tipo) {
    var fila = input.parentNode.parentNode;
    var max;//= input.getAttribute('max');
    //max = parseInt(max);
    var idstock = fila.getAttribute('idstock');
    var data = _PRODUCTOSENDETALLE[encontrarIndexArraProductos(idstock)];
   
    if (data != null && data.oferta.toString() != '0') {
        var oferta = JSON.parse(data.oferta)[0];
        var obsequios = oferta.obsequio;
        var cantidad_regla =oferta.cantidad;
         console.log(oferta);
        var promo = obsequios[0].cantidad;
        var cantidad = input.value;
        var bonificacion = parseInt((cantidad / parseInt(cantidad_regla))) * parseInt(promo);
        
        if (oferta.idproducto != obsequios[0].idproducto) {
            if (bonificacion > 0) {
                var total = bonificacion;
                var producto = _PRODUCTOSENDETALLE.find(x => x.idproducto == obsequios[0].idproducto);
                if (producto != undefined) max = producto.stockall;

                else bonificacion = 0;
               
                if (total > max)
                    bonificacion = bonificacion + (max - total);
                var proaux = _PRODUCTOSENDETALLE.find(x => x.idproducto == obsequios[0].idproducto && x.tipoitem == 'bonificacion'); 
                
                if (proaux == undefined)
                    fnbuscarproductobonificacion(obsequios[0], MBP_cmblistaprecios.value, idstock, bonificacion,'');
                if (bonificacion != 0) {
                    if (tipo != 'pedido') {
                        fneliminaritemdebonificacion(idstock);
                    } else {
                        //funcion para eliminar lista en pedido
                        pedidof_fneliminaritemdebonificacion(idstock);
                    }
                    if (producto == undefined)
                        return;
                    else
                        if (tipo == 'pedido') {
                            //fneliminaritemdebonificacion(idstock);
                           fnagregaritemfm(obsequios[0], proaux, idstock, bonificacion);
                        } else {
                            fnagregaritembonificaciontabla(obsequios[0], proaux, idstock, bonificacion);
                        }
                }
            }else {
                pedidof_fneliminaritemdebonificacion(idstock);
            }

        } else {
            if (bonificacion > 0) {
                max = data.stockall;
                var total = parseInt(cantidad) + bonificacion;
                if (total > max)
                    bonificacion = bonificacion + (max - total);
                if (bonificacion != 0) {
                    if (tipo == 'pedido') {
                        var proaux = _PRODUCTOSENDETALLE.find(x => x.idproducto == obsequios[0].idproducto && x.tipoitem=='bonificacion');
                        if (proaux == undefined)
                            fnbuscarproductobonificacion(obsequios[0], MBP_cmblistaprecios.value, idstock, bonificacion,'pedido');
                        else {
                            pedidof_fneliminaritemdebonificacion(idstock);
                            fnagregaritemfm(obsequios[0], proaux, idstock, bonificacion);
                        }
                    } else {
                        fneliminaritemdebonificacion(idstock);
                        fnagregarbonificacion(fila, bonificacion);
                    }
                }
                
            }
        }
    }
}
function fnbuscarproductosendetalle(idproducto) {
    var data = _PRODUCTOSENDETALLE.find(x => x.idproducto == idproducto);
    return data;
}
function fnbuscarproductobonificacion(obsequio, idlista, idstockbonif, cantidad,tipo) {
    let controller = new StockController();

    var comboSucursalFactura = document.getElementById("cmbsucursalfactura");
    var idsucursalParam = 0;
    if (comboSucursalFactura != null) idsucursalParam = comboSucursalFactura.value;
    else idsucursalParam = IDSUCURSAL;

    var obj = {
        idproducto: obsequio.idproducto,
        idlista: idlista,
        idsucursal: idsucursalParam
    };
    controller.BuscarStockPorProductoLista(obj, function (data) {
      
        data = data[0];
        //var fila = agregaritemalatabla(data[0], 'bonificacion')
        //fila.getElementsByClassName('cantidad_detalle')[0].value = cantidad;
        data.tipoitem = 'bonificacion';
        _PRODUCTOSENDETALLE.push(data);
        
        if (cantidad!=0 && tipo!='pedido')
            fnagregaritembonificaciontabla(obsequio, data, idstockbonif, cantidad);
    });
}
//item de bonificacion
function fnagregaritembonificaciontabla(obsequio, data, idstockbonif, cantidad) {
    var checkblister = '';
    var checkfracion = '';
    if (obsequio.isfraccion)
        checkfracion = '<input disabled  class="checkfraccion_detalle" type="checkbox"  checked  />';
    var input = '<input disabled style="width:100%" value="' + cantidad + '" class="text-center cantidad_detalle font-14" type="number"  min="1" readonly/>';
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
        '<span class="precio_detalle font-14">0.00</span>',
        '<span class="descuento_detalle font-14">0.00</span>',
        '<span class="importe_detalle font-14">0.00</span>',
        '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + data.idstock + '"><i class="fas fa-trash-alt"></i></button>'
    ]).draw(false).node();
    (fila).setAttribute('idstock', data.idstock);
    (fila).setAttribute('idproducto', data.idproducto);
    (fila).setAttribute('idprecioproducto', data.idprecioproducto);
    (fila).setAttribute('tipoimpuesto', data.tipoimpuesto);
    (fila).setAttribute('incentivo', data.incentivo);
    (fila).setAttribute('tipo', 'bonificacion');
    (fila).setAttribute('idstockbonificacion', idstockbonif);
    (fila).classList.add('table-success');
    $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
    fnagregarindex();
}
function fnagregarbonificacion(fila, boni) {
    var checkfracc = '';
    var checkblist = '';
    try {
        if (fila.getElementsByClassName('checkfraccion_detalle')[0].checked)
            checkfracc = 'checked';
    } catch (e) { }
    try {
        if (fila.getElementsByClassName('checkblister_detalle')[0].checked)
            checkblist = 'checked';
    } catch (e) { }
    var filadatatable = tbldetalle.row.add([
        '',
        '',
        fila.getElementsByTagName('td')[2].innerHTML,//codigo
        fila.getElementsByTagName('td')[3].innerHTML,//producto
        fila.getElementsByTagName('td')[4].innerHTML,//lote
        fila.getElementsByTagName('td')[5].innerHTML,//fechavencimiento
        '<input style="width:100%" value="' + boni + '" class="text-center cantidad_detalle font-14" type="number" min="1" disabled/>',//input
        fila.getElementsByTagName('td')[7].innerHTML.replace('input', 'input disabled ' + checkfracc),//checkfracion      
        //fila.getElementsByTagName('td')[7].innerHTML != '' ? fila.getElementsByTagName('td')[7].innerHTML.replace('input', 'input disabled ' + checkblist) : '',//checkblister                            
        '<span class="precio_detalle font-14">0.00</span>',
        '<span class="descuento_detalle font-14">0.00</span>',
        '<span class="importe_detalle font-14">0.00</span>',
        fila.getElementsByTagName('td')[11].innerHTML
    ]).draw(false).node();
    (filadatatable).setAttribute('idstock', fila.getAttribute('idstock'));
    (filadatatable).setAttribute('idprecioproducto', fila.getAttribute('idprecioproducto'));
    (filadatatable).setAttribute('tipoimpuesto', fila.getAttribute('tipoimpuesto'));
    (filadatatable).setAttribute('incentivo', fila.getAttribute('incentivo'));
    (filadatatable).setAttribute('tipo', 'bonificacion');
    (filadatatable).setAttribute('idstockbonificacion', fila.getAttribute('idstock'));//esto es para diferenciar si la promocion es diferente al producto original

    (filadatatable).classList.add('table-success');
    $(filadatatable).find('td').eq(0).attr({ 'class': 'sticky' });
    fnagregarindex();
}
function fnencontarsiexistepreviabonificacion(idstock) {

    var res = '';
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    filas.forEach(function (e) {
        if (e.getAttribute('tipo') == 'bonificacion')
            if (e.getAttribute('idstock') == idstock)
                res = e;
    });
    return res;
}
function fnencontrarproductobonificacionendetalleproductos(idproducto) {
    for (var i = 0; i < _PRODUCTOSENDETALLE.length; i++) {
        if (_PRODUCTOSENDETALLE[i].idproducto == idproducto && _PRODUCTOSENDETALLE[i].tipoitem == 'bonificacion') {
            return i;
        }
    }
    return -1;
}
function fneliminaritemdebonificacion(idstock) {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    filas.forEach(function (e) {
        if (e.getAttribute('tipo') == 'bonificacion') {
            if (e.getAttribute('idstockbonificacion') == idstock) {
                tbldetalle.row(e).remove().draw(false);
            }
        } 
    });
}


function pedidof_fneliminaritemdebonificacion(idstock) {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    var c = 1;
    filas.forEach(function (e) {
        if (e.getAttribute('tipo') == 'bonificacion') {
            if (e.getAttribute('idstockbonificacion') == idstock) {
                //tbldetalle.row(e).remove().draw(false);
                document.getElementById('tbldetalle').deleteRow(c);
            }
        }
        c++;
    });
}