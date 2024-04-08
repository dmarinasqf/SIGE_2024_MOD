//PRODUCTO
var MPU_txtidproducto = document.getElementById('MPU_txtidproducto');
var MPU_txtcodproducto = document.getElementById('MPU_txtcodproducto');
var MPU_txtnombreproducto = document.getElementById('MPU_txtnombreproducto');

var MPU_contenedorMoneda = document.getElementById('MPU_contenedorMoneda');
var MPU_contenedorCambio = document.getElementById('MPU_contenedorCambio');
var MPU_contenedorCostoCamb = document.getElementById('MPU_contenedorCostoCamb');


//NUEVA COMPRA
var MPU_txtvvf = document.getElementById('MPU_txtvvf');
var MPU_txtpvf = document.getElementById('MPU_txtpvf');
var MPU_txtcantidadIngresada = document.getElementById('MPU_txtcantidadIngresada');
var MPU_txtcantidadDevuelta = document.getElementById('MPU_txtcantidadDevuelta');
var MPU_txtsubtotal = document.getElementById('MPU_txtsubtotal');
var MPU_txttotal = document.getElementById('MPU_txttotal');
var MPU_txtd1 = document.getElementById('MPU_txtd1');
var MPU_txtd2 = document.getElementById('MPU_txtd2');
var MPU_txtd3 = document.getElementById('MPU_txtd3');
var MPU_txtbonif = document.getElementById('MPU_txtbonif');
var MPU_txtbonifcosto = document.getElementById('MPU_txtbonifcosto');
var MPU_txtprontopago = document.getElementById('MPU_txtprontopago');
var MPU_txtcostofact = document.getElementById('MPU_txtcostofact');
var MPU_txtcosto = document.getElementById('MPU_txtcosto');
//var MPU_txtpromedio = document.getElementById('MPU_txtpromedio');
var MPU_txtpvp = document.getElementById('MPU_txtpvp');
var MPU_form_nuevacompra = document.getElementById('MPU_form_nuevacompra');
var MPU_txtprorrateo = document.getElementById('MPU_txtprorrateo');
var MPU_txtidmoneda = document.getElementById('MPU_txtidmoneda');
var MPU_txtcambio = document.getElementById('MPU_txtcambio');
var MPU_txtcostocamb = document.getElementById('MPU_txtcostocamb');

//COMPRA ANTERIOR
var MPU_txtvvfanterior = document.getElementById('MPU_txtvvfanterior');
var MPU_txtpvfanterior = document.getElementById('MPU_txtpvfanterior');
var MPU_txtpvpanterior = document.getElementById('MPU_txtpvpanterior');
var MPU_txtpvpxanterior = document.getElementById('MPU_txtpvpxanterior');
var MPU_txtpvpxblistanterior = document.getElementById('MPU_txtpvpxblistanterior');
var MPU_txtpvpxfraccanterior = document.getElementById('MPU_txtpvpxfraccanterior');
var MPU_txtpvpxfraccanterior = document.getElementById('MPU_txtpvpxfraccanterior');
var MPU_txtd1anterior = document.getElementById('MPU_txtd1anterior');
var MPU_txtd2anterior = document.getElementById('MPU_txtd2anterior');
var MPU_txtd3anterior = document.getElementById('MPU_txtd3anterior');
var MPU_txtprontopagoanterior = document.getElementById('MPU_txtprontopagoanterior');
var MPU_txtbonifanterior = document.getElementById('MPU_txtbonifanterior');
var MPU_txtprorroteoanterior = document.getElementById('MPU_txtprorroteoanterior');
var MPU_txtutilidadanterior = document.getElementById('MPU_txtutilidadanterior');
var MPU_txtcostofactanterior = document.getElementById('MPU_txtcostofactanterior');
var MPU_txtcostoanterior = document.getElementById('MPU_txtcostoanterior');

var tabla;

//BUTTONS
var MPU_btndatosiniciales = document.getElementById('MPU_btndatosiniciales');
var MPU_btnconservarcambios = document.getElementById('MPU_btnconservarcambios');

//VARIABLES
var _PRECIOSLISTAPRECIOS = [];
var _PRECIOSLISTAPRECIOS_AUX = [];

var numDecimales = 2;

$(document).ready(function () {
    //MPU_txtvvf.setAttribute("style", "width: 66px;");
    //MPU_txtpvf.setAttribute("style", "width: 66px;");
    //MPU_txtcantidadIngresada.setAttribute("style", "width: 66px;");
    //MPU_txtcantidadDevuelta.setAttribute("style", "width: 66px;");
    //MPU_txtsubtotal.setAttribute("style", "width: 66px;");
    //MPU_txttotal.setAttribute("style", "width: 66px;");
    //MPU_txtd1.setAttribute("style", "width: 66px;");
    //MPU_txtd2.setAttribute("style", "width: 66px;");
    //MPU_txtd3.setAttribute("style", "width: 66px;");
    //MPU_txtbonif.setAttribute("style", "width: 66px;");
    //MPU_txtbonifcosto.setAttribute("style", "width: 66px;");
    //MPU_txtprontopago.setAttribute("style", "width: 66px;");
    //MPU_txtcostofact.setAttribute("style", "width: 66px;");
    //MPU_txtcosto.setAttribute("style", "width: 66px;");
    //MPU_txtpvp.setAttribute("style", "width: 66px;");
    //MPU_txtprorrateo.setAttribute("style", "width: 66px;");
      
});

MPU_txttotal.addEventListener('keyup', function (e) {
    var total = parseFloat(parseFloat(MPU_txttotal.value).toFixed(numDecimales));
    var totalconstante = parseFloat(parseFloat(MPU_txttotal.value).toFixed(numDecimales));
    var subtotal = parseFloat((total * 100 / (100 + igvLocal))).toFixed(numDecimales);;
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var nuevaCantidad = cantidad;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            nuevaCantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var desc1 = parseFloat(MPU_txtd1.value).toFixed(numDecimales);
    var desc2 = parseFloat(MPU_txtd2.value).toFixed(numDecimales);
    var desc3 = parseFloat(MPU_txtd3.value).toFixed(numDecimales);
    var nuevoPvf = 0;
    var nuevoVvf = 0;
    var nuevoCosto = 0;

    nuevoCosto = (totalconstante / nuevaCantidad).toFixed(numDecimales);
    total = (total * (100 / (100 - desc3))).toFixed(numDecimales);
    total = (total * (100 / (100 - desc2))).toFixed(numDecimales);
    total = (total * (100 / (100 - desc1))).toFixed(numDecimales);
    nuevoPvf = (total / cantidad).toFixed(numDecimales);
    nuevoVvf = (nuevoPvf * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = nuevoCosto;
    MPU_txtcostofact.value = nuevoCosto;
    MPU_txtpvf.value = nuevoPvf;
    MPU_txtvvf.value = nuevoVvf;

    calcularDetallePvpx(nuevoCosto);
});
MPU_txtsubtotal.addEventListener('keyup', function (e) {
    var subtotal = parseFloat(this.value);
    var total = parseFloat(parseFloat(subtotal + (subtotal * igvLocal / 100)).toFixed(numDecimales));
    var totalconstante = total;
    MPU_txttotal.value = total;
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var nuevaCantidad = cantidad;

    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            nuevaCantidad += bon;
        }
        else if (mpu_txtbonifcosto.value > 0) {
            bon = parsefloat(mpu_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var desc1 = parseFloat(MPU_txtd1.value).toFixed(numDecimales);
    var desc2 = parseFloat(MPU_txtd2.value).toFixed(numDecimales);
    var desc3 = parseFloat(MPU_txtd3.value).toFixed(numDecimales);
    var nuevoPvf = 0;
    var nuevoVvf = 0;
    var nuevoCosto = 0;

    nuevoCosto = (totalconstante / nuevaCantidad).toFixed(numDecimales);
    total = (total * (100 / (100 - desc3))).toFixed(numDecimales);
    total = (total * (100 / (100 - desc2))).toFixed(numDecimales);
    total = (total * (100 / (100 - desc1))).toFixed(numDecimales);
    nuevoPvf = (total / cantidad).toFixed(numDecimales);
    nuevoVvf = (nuevoPvf * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txtcosto.value = nuevoCosto;
    MPU_txtcostofact.value = nuevoCosto;
    MPU_txtpvf.value = nuevoPvf;
    MPU_txtvvf.value = nuevoVvf;

    calcularDetallePvpx(nuevoCosto);
});
MPU_btndatosiniciales.addEventListener('click', function () {
    var obj = new ModalPrecioUtilidad();
    var fila = tbldetalle.row($('.selected')).data();
    var index = FN_GETDATOHTML(fila[0], 'index_detalle');  
    obj.pasarPrecioCompraActual(_DETALLEINICIAL[index]);
});

MPU_txtvvf.addEventListener('keyup', function (e) {
    var vvf = parseFloat(this.value);
    var pvf = parseFloat(parseFloat(vvf + (vvf * igvLocal / 100)).toFixed(numDecimales));
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var total = parseFloat((pvf * cantidad).toFixed(numDecimales));
    var desc1 = parseFloat(MPU_txtd1.value);
    var desc2 = parseFloat(MPU_txtd2.value);
    var desc3 = parseFloat(MPU_txtd3.value);

    total = (total - (total * (desc1 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc2 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc3 / 100))).toFixed(numDecimales);
    let totalconstante = total;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            cantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var costo = parseFloat(parseFloat(totalconstante / cantidad).toFixed(numDecimales));
    var subtotal = parseFloat(total * 100 / (100 + igvLocal)).toFixed(numDecimales);

    //MPU_txtvvf.value = vvf;
    MPU_txtpvf.value = pvf;
    MPU_txttotal.value = total;
    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = costo;
    MPU_txtcostofact.value = costo;

    calcularDetallePvpx(costo);
});
MPU_txtpvf.addEventListener('keyup', function (e) {

    var pvf = parseFloat(this.value);
    var vvf = parseFloat(MPU_txtpvf.value * 100 / (100 + igvLocal)).toFixed(numDecimales);
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var total = parseFloat((pvf * cantidad).toFixed(numDecimales));
    var desc1 = parseFloat(MPU_txtd1.value);
    var desc2 = parseFloat(MPU_txtd2.value);
    var desc3 = parseFloat(MPU_txtd3.value);

    total = (total - (total * (desc1 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc2 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc3 / 100))).toFixed(numDecimales);
    let totalconstante = total;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            cantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var costo = parseFloat(parseFloat(totalconstante / cantidad).toFixed(numDecimales));
    var subtotal = parseFloat(total * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txtvvf.value = vvf;
    //MPU_txtpvf.value = pvf;
    MPU_txttotal.value = total;
    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = costo;
    MPU_txtcostofact.value = costo;

    calcularDetallePvpx(costo);
});

MPU_txtd1.addEventListener('keyup', function (e) {
    //dsc1
    var desc1 = parseFloat(MPU_txtd1.value);
    var desc2 = parseFloat(MPU_txtd2.value);
    var desc3 = parseFloat(MPU_txtd3.value);
    var pvf = parseFloat(MPU_txtpvf.value);
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var total = parseFloat((pvf * cantidad).toFixed(numDecimales));
    total = (total - (total * (desc1 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc2 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc3 / 100))).toFixed(numDecimales);
    let totalconstante = total;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            cantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var costo = parseFloat(parseFloat(totalconstante / cantidad).toFixed(numDecimales));
    var subtotal = parseFloat(total * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txttotal.value = total;
    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = costo;
    MPU_txtcostofact.value = costo;

    calcularDetallePvpx(costo);
});
MPU_txtd2.addEventListener('keyup', function (e) {
    //dsc2
    var desc1 = parseFloat(MPU_txtd1.value);
    var desc2 = parseFloat(MPU_txtd2.value);
    var desc3 = parseFloat(MPU_txtd3.value);
    var pvf = parseFloat(MPU_txtpvf.value);
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var total = parseFloat(pvf * cantidad).toFixed(numDecimales);
    total = (total - (total * (desc1 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc2 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc3 / 100))).toFixed(numDecimales);
    let totalconstante = total;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            cantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var costo = parseFloat(parseFloat(totalconstante / cantidad).toFixed(numDecimales));
    var subtotal = parseFloat(total * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txttotal.value = total;
    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = costo;
    MPU_txtcostofact.value = costo;

    calcularDetallePvpx(costo);
});
MPU_txtd3.addEventListener('keyup', function (e) {
    //dsc3
    var desc1 = parseFloat(MPU_txtd1.value);
    var desc2 = parseFloat(MPU_txtd2.value);
    var desc3 = parseFloat(MPU_txtd3.value);
    var pvf = parseFloat(MPU_txtpvf.value);
    var cantidad = parseFloat(MPU_txtcantidadIngresada.value) + parseFloat(MPU_txtcantidadDevuelta.value);
    var total = parseFloat(pvf * cantidad).toFixed(numDecimales);
    total = (total - (total * (desc1 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc2 / 100))).toFixed(numDecimales);
    total = (total - (total * (desc3 / 100))).toFixed(numDecimales);
    let totalconstante = total;
    var bon = 0;
    if (MPU_txtbonif.getAttribute('tipo') == 'AFECTO') {
        if (MPU_txtbonif.value > 0) {
            bon = parseFloat(MPU_txtbonif.value);
            cantidad += bon;
        }
        else if (MPU_txtbonifcosto.value > 0) {
            bon = parseFloat(MPU_txtbonifcosto.value);
            totalconstante -= bon;
        }
    }

    var costo = parseFloat(parseFloat(totalconstante / cantidad).toFixed(numDecimales));
    var subtotal = parseFloat(total * 100 / (100 + igvLocal)).toFixed(numDecimales);

    MPU_txttotal.value = total;
    MPU_txtsubtotal.value = subtotal;
    MPU_txtcosto.value = costo;
    MPU_txtcostofact.value = costo;

    calcularDetallePvpx(costo);
});

function fn_MPUCrearNuevoPorcentajeDescuento(cantidadreal, cantidadnueva, porcactual) {
    var porceresto;
    if (porcactual === 0)
        porceresto = 0;
    else
        porceresto = 100 - porcactual;
    var pornuevo = (cantidadnueva * porceresto) / cantidadreal;
    var res = REDONDEAR_DECIMALES(porceresto - pornuevo, 2);
    if (isNaN(res)) { res = 0; }
    var fin = (parseFloat(porcactual) + res).toFixed(numDecimales);
    MPU_txtd1.value = fin;
    //if (res > 0)
    //    MPU_txtd1.style.backgroundColor = 'transparent';
    //else
    //    MPU_txtd1.style.backgroundColor = 'red';

}

class ModalPrecioUtilidad {
    pasarPrecioCompraActual(obj) {       
        MPU_txtvvf.value = obj.vvfoc.toFixed(numDecimales);
        MPU_txtpvf.value = obj.pvfoc.toFixed(numDecimales);
        MPU_txtcantidadIngresada.value = obj.cantingresada;
        MPU_txtcantidadDevuelta.value = obj.cantdevuelta;
        MPU_txtsubtotal.value = obj.subtotal.toFixed(numDecimales);
        MPU_txttotal.value = obj.total.toFixed(numDecimales);
        MPU_txtd1.value = obj.des1.toFixed(numDecimales);
        MPU_txtd2.value = obj.des2.toFixed(numDecimales);
        MPU_txtd3.value = obj.des3.toFixed(numDecimales);
        MPU_txtbonif.value = 0;

        let costoboni = 0.00;
        if (obj.idproducto == obj.idproductobonificacion) {
            MPU_txtbonif.value = obj.cantidadb;
        } else {
            costoboni = obj.bonificacion;
        }
        //if (obj.cantidadb > 0)
        //    MPU_txtbonif.value = obj.cantidadb;

        MPU_txtbonif.setAttribute('tipo', obj.tboni);
        //if (MPU_txtbonif.value < 1) {
        //    //Si no hay cantidadb(bonificación con el mismo item) es bonificación con item diferente.
            
        //}
        if (obj.cantidadbDevuelta == 0 && obj.cantidadb == 0)
            costoboni = obj.bonificacion;

        MPU_txtbonifcosto.value = costoboni;
        MPU_txtcostofact.value = obj.costofacturaroc.toFixed(numDecimales);
        //var costo = (parseFloat(MPU_txttotal.value) / (parseFloat(MPU_txtcantidadIngresada.value) +parseFloat(MPU_txtbonif.value))).toFixed(5);
        MPU_txtcosto.value = obj.costooc.toFixed(numDecimales);
        MPU_txtprontopago.value = 0.00;
        //MPU_txtprorrateo.value = REDONDEAR_DECIMALES(obj.bonificacion / obj.cantingresada,2).toFixed(5);
        var costo = parseFloat(MPU_txtcosto.value);
        var cambio = parseFloat(MPU_txtcambio.value);
        if (MPU_txtidmoneda.value != 100000) {
            MPU_contenedorMoneda.className = "col-xl-2 col-md-2 col-sm-3 col-xs-4";
            MPU_contenedorCostoCamb.removeAttribute("hidden");
            MPU_txtcostocamb.value = parseFloat(costo * cambio).toFixed(numDecimales);
        }
    }
    pasarUltimaCompra(obj) {
        if (obj != undefined) {
            MPU_txtpvpanterior.value = obj.pvp == null ? 0 : obj.pvp.toFixed(numDecimales);
            MPU_txtpvpxanterior.value = obj.pvp == null ? 0 : obj.pvp.toFixed(numDecimales);
            MPU_txtpvpxblistanterior.value = obj.precioxblister == null ? 0 : obj.precioxblister.toFixed(numDecimales);
            MPU_txtpvpxfraccanterior.value = obj.precioxfraccion == null ? 0 : obj.precioxfraccion.toFixed(numDecimales);
            MPU_txtvvfanterior.value = obj.vvf == null ? 0 : obj.vvf.toFixed(numDecimales);
            MPU_txtpvfanterior.value = obj.pvf == null ? 0 : obj.pvf.toFixed(numDecimales);
            MPU_txtd1anterior.value = obj.des1.toFixed(numDecimales);
            MPU_txtd2anterior.value = obj.des2.toFixed(numDecimales);
            MPU_txtd3anterior.value = obj.des3.toFixed(numDecimales);
            MPU_txtbonifanterior.value = obj.cantidadb == null ? 0 : obj.cantidadb.toFixed(numDecimales);
            MPU_txtcostofactanterior.value = obj.montofacturar == null ? 0 : obj.montofacturar.toFixed(numDecimales);
            MPU_txtcostoanterior.value = obj.costo == null ? 0 : obj.costo.toFixed(numDecimales);
            MPU_txtprontopagoanterior.value = 0.00;
            MPU_txtprorroteoanterior.value = REDONDEAR_DECIMALES(obj.montofacturar / obj.cantidad, 2).toFixed(numDecimales);
            var calculoPorcentaje = 0;
            if (MPU_txtcostoanterior.value != MPU_txtcostofactanterior.value)
                calculoPorcentaje = (MPU_txtcostoanterior.value / MPU_txtcostofactanterior.value) * 100;
            MPU_txtutilidadanterior.value = calculoPorcentaje.toFixed(numDecimales);
        }
    }
    BuscarPreciosProductoxLista(idproducto) {
        
       
        let controller = new ListaPreciosController();
        controller.ListarListaXProducto(idproducto, function (data) {
            tabla = document.getElementById('MPU_tblprecios');
            tabla.innerHTML = '';
            var fila = '';
            for (var i = 0; i < data.length; i++) {
                var pos = (MPU_buscarindexarray_listaprecios(data[i].idprecioproducto));
                var pvpx = 0.00;
                var pu = 0.00;
                var utilidad = 0.00;
                if (pos != -1) {
                    data[i].utilidad = _PRECIOSLISTAPRECIOS[pos].utilididad;
                    data[i].precio = parseFloat(_PRECIOSLISTAPRECIOS[pos].precio).toFixed(numDecimales);
                    data[i].precioxfraccion = parseFloat(_PRECIOSLISTAPRECIOS[pos].precioxfraccion).toFixed(numDecimales);
                    data[i].precioxblister = parseFloat(_PRECIOSLISTAPRECIOS[pos].precioxblister).toFixed(numDecimales);
                    utilidad = parseFloat(data[i].utilidad).toFixed(numDecimales);
                    pvpx = data[i].precio;
                    pu = data[i].precioxfraccion;
                } else {
                    pvpx = data[i].precio;
                    pu = data[i].precioxfraccion;
                    var costo = parseFloat(MPU_txtcosto.value);
                    if (data[i].precio == null || data[i].precio == 0) {
                        utilidad = 33;
                        pvpx = parseFloat((costo * (utilidad/100)) + costo).toFixed(numDecimales);
                        pu = parseFloat(pvpx / parseFloat(data[i].multiplo).toFixed(numDecimales)).toFixed(numDecimales);
                    } else {
                        utilidad = ((pvpx - costo) * 100) / costo;
                    }
                }

                var sEstilo = "";
                if (MPU_txtcostofact.value == null || MPU_txtcostofact.value == undefined) {
                    MPU_txtcostofact.value = 0;
                }
                if (pvpx == null || pvpx == undefined) {
                    pvpx = 0;
                }
                if (parseFloat(pvpx) < parseFloat(MPU_txtcostofact.value)) {
                    sEstilo = "bg-danger text-white";
                }

                fila += '<tr class="txtmultipleatributos ' + sEstilo + '" idprecio="' + data[i].idprecioproducto + '" idproducto="' + idproducto+'">';
                fila += '<td>' + data[i].idlistaprecio+'</td>';
                fila += '<td>' + data[i].lista+'</td>';
                //fila += '<td> <input  class="descuento" type="number" step="any" value="' + data[i].descuento+'"/></td>';
                fila += '<td>  <input id="utilidad"  class="utilidad text-center" type="number" step="any" value="' + parseFloat(utilidad).toFixed(numDecimales) + '" min="0"/></td></td>';
                fila += '<td>  <input class="precio_lista text-center" type="number" step="any" value="' + parseFloat(parseFloat(pvpx).toFixed(numDecimales)) + '" min="0"/></td>';//data[i].precio
                fila += '<td>  <input id="precioxfraccion_lista"  class="precioxfraccion_lista text-center" type="number" multiplo=' + (data[i].multiplo) + ' step="any" value="' + parseFloat(pu).toFixed(numDecimales) +'" min="0"/></td>';
                fila += '<td>  <input id="precioxblister_lista"  class="precioxblister_lista text-center" type="number" step="any" value="' + data[i].precioxblister +'" min="0"/></td>';

                fila += '</tr>';
            }
            tabla.innerHTML = fila;
        });
    }
}

$(document).on('keyup', '.precio_lista', function (e) {
    var fila = this.parentNode.parentNode;
    var precioxp = (fila.getElementsByClassName('precio_lista')[0].value);
    var cambio = 1;
    if (MPU_txtcambio.value != 0 && MPU_txtcambio.value != "")
        cambio = MPU_txtcambio.value;
    var resultado = ((parseFloat(precioxp) - parseFloat(MPU_txtcosto.value) * cambio) * 100) / (parseFloat(MPU_txtcosto.value) * cambio);
    var utilidad = fila.getElementsByClassName('utilidad')[0];
    utilidad.value = (resultado.toFixed(numDecimales)).toString();
    var multiplo = (fila.getElementsByClassName('precioxfraccion_lista')[0].getAttribute('multiplo'));
    var pxu = (precioxp / multiplo).toFixed(numDecimales);
    var precioxu = fila.getElementsByClassName('precioxfraccion_lista')[0];
    precioxu.value = pxu;

    if (parseFloat(precioxp) < parseFloat(MPU_txtcostofact.value)) {
        fila.attributes[0].value = "txtmultipleatributos bg-danger text-white";
    } else {
        fila.attributes[0].value = "txtmultipleatributos";
    }
    MPU_actualizar_array_listaproducto(fila, e);
});
$(document).on('keyup', '.precioxfraccion_lista', function (e) {
    var fila = this.parentNode.parentNode;
    MPU_actualizar_array_listaproducto(fila, e);
});
$(document).on('keyup', '.precioxblister_lista', function (e) {
    var fila = this.parentNode.parentNode;
    MPU_actualizar_array_listaproducto(fila, e);
});
$(document).on('keyup', '.utilidad', function (e) {
    var fila = this.parentNode.parentNode;
    var utilidad = (fila.getElementsByClassName('utilidad')[0].value);
    var costo = parseFloat(MPU_txtcosto.value);

    var cambio = 0;
    if (MPU_txtcambio.hasAttribute("hidden")) cambio = 1;
    else cambio = parseFloat(MPU_txtcambio.value);

    var resultado = costo + parseFloat(parseFloat(utilidad / 100).toFixed(numDecimales) * costo);
    resultado *= cambio;
    var precio_lista = fila.getElementsByClassName('precio_lista')[0];
    precio_lista.value = parseFloat(resultado).toFixed(numDecimales);

    var precioxp = (fila.getElementsByClassName('precio_lista')[0].value);
    var multiplo = (fila.getElementsByClassName('precioxfraccion_lista')[0].getAttribute('multiplo'));
    var pxu = (precioxp / multiplo).toFixed(numDecimales);
    var precioxu = fila.getElementsByClassName('precioxfraccion_lista')[0];
    precioxu.value = pxu;
    if (parseFloat(precioxp) < parseFloat(MPU_txtcostofact.value)) {
        fila.attributes[0].value = "txtmultipleatributos bg-danger text-white";
    } else {
        fila.attributes[0].value = "txtmultipleatributos";
    }
    MPU_actualizar_array_listaproducto(fila, e);
});

$(document).on('change', '.precio_lista', function (e) {
    e.preventDefault();
    var fila = this.parentNode.parentNode;
    MPU_actualizar_array_listaproducto(fila, e);

});
$(document).on('change', '.precioxfraccion_lista', function (e) {
    e.preventDefault();
    var fila = this.parentNode.parentNode;
    MPU_actualizar_array_listaproducto(fila,e);
});
$(document).on('change', '.precioxblister_lista', function (e) {
    e.preventDefault();
    var fila = this.parentNode.parentNode;
    MPU_actualizar_array_listaproducto(fila, e);

});
$(document).on('mousewheel', '.precio_lista', function (e) {
    this.blur();
});
$(document).on('mousewheel', '.precioxfraccion_lista', function (e) {
    this.blur();
});
$(document).on('mousewheel', '.precioxblister_lista', function (e) {
    this.blur();
});

function MPU_actualizar_array_listaproducto(fila, event) {
  
    if (event.key==='Tab')
        return;
   //agregar los datos modificados de la listas de precios al detalle
    var obj = new PreciosProducto();
    obj.idprecioproducto = fila.getAttribute('idprecio');
    obj.idproducto = fila.getAttribute('idproducto');
    obj.precio = fila.getElementsByClassName('precio_lista')[0].value;
    obj.precioxfraccion = fila.getElementsByClassName('precioxfraccion_lista')[0].value;
    obj.precioxblister = fila.getElementsByClassName('precioxblister_lista')[0].value;
    obj.utilididad = fila.getElementsByClassName('utilidad')[0].value;
    var pos = MPU_buscarindexarray_listaprecios(obj.idprecioproducto,'aux');
    if (pos != -1)
        _PRECIOSLISTAPRECIOS_AUX[pos] = obj;
    else
        _PRECIOSLISTAPRECIOS_AUX.push(obj);
}
function  MPU_fnjuntarlistaprecios_array_y_aux() {
    for (var i = 0; i < _PRECIOSLISTAPRECIOS_AUX.length; i++) {
        var pos = MPU_buscarindexarray_listaprecios(_PRECIOSLISTAPRECIOS_AUX[i].idprecioproducto);
        if (pos != -1)
            _PRECIOSLISTAPRECIOS[pos] = _PRECIOSLISTAPRECIOS_AUX[i];
        else
            _PRECIOSLISTAPRECIOS.push(_PRECIOSLISTAPRECIOS_AUX[i]);
    }
    _PRECIOSLISTAPRECIOS_AUX = [];
}
function MPU_buscarindexarray_listaprecios(idprecio, tipo) {
    //busca en dos array el aux y el normal
    var pos = -1;
    if (tipo === 'aux') {
        for (var i = 0; i < _PRECIOSLISTAPRECIOS_AUX.length; i++) {
            if (_PRECIOSLISTAPRECIOS_AUX[i].idprecioproducto.toString() == idprecio.toString())
                return i;
        }
    } else {
        for (var i = 0; i < _PRECIOSLISTAPRECIOS.length; i++) {
            if (_PRECIOSLISTAPRECIOS[i].idprecioproducto.toString() == idprecio.toString())
                return i;
        }
    }
  
    return pos;
}

function calcularDetallePvpx(costo) {
    if (costo > 0) {
        var fila = document.querySelectorAll("#MPU_tblprecios tr");
        var c = 0;
        fila.forEach(function (e) {
            var utilidad = parseFloat(document.getElementsByClassName("precio_lista")[c].value).toFixed(numDecimales);
            if (utilidad == null || utilidad == undefined) {
                pvpx = 0;
            }

            var pvpx = (parseFloat(utilidad) / parseFloat(costo)) * 100 - 100;
            //var pvpx = parseFloat((parseFloat(costo) + (parseFloat(costo) * utilidad) / 100).toFixed(1)).toFixed(5);
            //var pvpx = (parseFloat(costo) + (parseFloat(costo) * utilidad) / 100).toFixed(5);
            document.getElementsByClassName("utilidad")[c].value = pvpx.toFixed(numDecimales);

            var sEstilo = "";
            if (MPU_txtcostofact.value == null || MPU_txtcostofact.value == undefined) {
                MPU_txtcostofact.value = 0;
            }
            if (parseFloat(utilidad) < parseFloat(MPU_txtcostofact.value)) {
                sEstilo = "bg-danger text-white";
            }

            fila[c].attributes[0].value = "txtmultipleatributos " + sEstilo;

            var obj = new PreciosProducto();
            obj.idprecioproducto = document.getElementsByClassName('txtmultipleatributos')[c].getAttribute('idprecio');
            obj.idproducto = document.getElementsByClassName('txtmultipleatributos')[c].getAttribute('idproducto');
            obj.precio = parseFloat(document.getElementsByClassName('precio_lista')[c].value).toFixed(numDecimales);
            obj.precioxfraccion = parseFloat(document.getElementsByClassName('precioxfraccion_lista')[c].value).toFixed(numDecimales);
            obj.precioxblister = document.getElementsByClassName('precioxblister_lista')[c].value;
            obj.utilididad = document.getElementsByClassName('utilidad')[c].value;
            var pos = MPU_buscarindexarray_listaprecios(obj.idprecioproducto, 'aux');
            if (pos != -1)
                _PRECIOSLISTAPRECIOS_AUX[pos] = obj;
            else
                _PRECIOSLISTAPRECIOS_AUX.push(obj);

            c++;
        });
    }
}

MPU_txtcambio.addEventListener("keyup", function (e) {
    if (MPU_txtcambio.value != 0 && MPU_txtcambio.value != "") {
        var costo = parseFloat(MPU_txtcosto.value);
        var cambio = parseFloat(MPU_txtcambio.value);
        MPU_txtcostocamb.value = costo * cambio;
        var fila = document.querySelectorAll("#MPU_tblprecios tr");
        var c = 0;
        if (fila.length > 0) {
            fila.forEach(function (e) {
                var utilidad = parseFloat(document.getElementsByClassName("utilidad")[c].value);
                if (utilidad == null || utilidad == "null") utilidad = 0;

                var idprecio = e.attributes.idprecio.value;
                var idproducto = e.attributes.idproducto.value;
                var precio_lista = 0;
                var precioxfraccion_lista = 0;
                var multiplo = document.getElementsByClassName("precioxfraccion_lista")[c].getAttribute("multiplo");
                if (multiplo == "null") multiplo = 1;
                var precioxblister_lista = 0;

                precio_lista = parseFloat(costo + parseFloat(parseFloat(utilidad / 100).toFixed(numDecimales) * costo)).toFixed(numDecimales);
                precio_lista *= cambio;
                precioxfraccion_lista = parseFloat(precio_lista / multiplo).toFixed(numDecimales);

                document.getElementsByClassName("precio_lista")[c].value = precio_lista;
                document.getElementsByClassName("precioxfraccion_lista")[c].value = precioxfraccion_lista;

                var obj = new PreciosProducto();
                obj.idprecioproducto = idprecio;
                obj.idproducto = idproducto;
                obj.precio = precio_lista;
                obj.precioxfraccion = precioxfraccion_lista;
                obj.precioxblister = precioxblister_lista;
                obj.utilididad = utilidad;
                var pos = MPU_buscarindexarray_listaprecios(idprecio, 'aux');
                if (pos != -1)
                    _PRECIOSLISTAPRECIOS_AUX[pos] = obj;
                else
                    _PRECIOSLISTAPRECIOS_AUX.push(obj);

                if (parseFloat(precio_lista) < parseFloat(MPU_txtcostofact.value)) {
                    fila[c].attributes[0].value = "txtmultipleatributos bg-danger text-white";
                } else {
                    fila[c].attributes[0].value = "txtmultipleatributos";
                }

                c++;
            });
        }
    }
});

MPU_txtidmoneda.addEventListener("change", function (e) {
    if (MPU_txtidmoneda.value != 100000) {
        MPU_contenedorMoneda.className = "col-xl-2 col-md-2 col-sm-3 col-xs-4";
        MPU_contenedorCostoCamb.removeAttribute("hidden");
    } else {
        MPU_contenedorMoneda.className = "col-xl-2 col-md-2 col-sm-3 col-xs-4 offset-2";
        MPU_contenedorCostoCamb.setAttribute("hidden", "");
    }
});