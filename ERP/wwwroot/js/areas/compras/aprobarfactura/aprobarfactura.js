var numDecimales = 2;

var txtidproveedor = document.getElementById('txtidproveedor');
var txtruc = document.getElementById('txtruc');
var txtrazonsocial = document.getElementById('txtrazonsocial');
var txtempresa = document.getElementById('txtempresa');
var txtnombremoneda = document.getElementById('txtnombremoneda');
var txtcambiomoneda = document.getElementById('txtcambiomoneda');
var cmbcondicionpago = document.getElementById('cmbcondicionpago');
var cmbtipopago = document.getElementById('cmbtipopago');
var txtsucursaldestino = document.getElementById('txtsucursaldestino');
//var cmbalmacen = document.getElementById('cmbalmacen');
var txtobservacion = document.getElementById('txtobservacion');

var lblnumfacturaaprobar = document.getElementById('lblnumfacturaaprobar');

var lbltipodocumeto = document.getElementById('lbltipodocumeto');
var lblnumdocumento = document.getElementById('lblnumdocumento');
var lblfechadocumento = document.getElementById('lblfechadocumento');
var lblestadodocumento = document.getElementById('lblestadodocumento');
var lblidfactura = document.getElementById('lblidfactura');

var lblfechapreingreso = document.getElementById('lblfechapreingreso');
var lblestadopreingreso = document.getElementById('lblestadopreingreso');
var lblnumpreingreso = document.getElementById('lblnumpreingreso');
var lblidpreingreso = document.getElementById('lblidpreingreso');

var lblnumoc = document.getElementById('lblnumoc');
var lblfechaoc = document.getElementById('lblfechaoc');
var lblestadooc = document.getElementById('lblestadooc');
var lblfechavencimientooc = document.getElementById('lblfechavencimientooc');
var tbldetalle;
//totales
var txtncxdevolucion = document.getElementById('txtncxdevolucion');
var txtncxdifdescuentos = document.getElementById('txtncxdifdescuentos');
var txtsubtotal = document.getElementById('txtsubtotal');
var txtigv = document.getElementById('txtigv');
var txttotal = document.getElementById('txttotal');
var txtprontopago = document.getElementById('txtprontopago');
var txttotalreal = document.getElementById('txttotalreal');
var txtpercepcion = document.getElementById('txtpercepcion');
var txttotalpagar = document.getElementById('txttotalpagar');
var txtsubtotaldocumento = document.getElementById('txtsubtotaldocumento');
var txtigvdocumento = document.getElementById('txtigvdocumento');
var txttotaldocumento = document.getElementById('txttotaldocumento');
//BUTTONS

var btnanular = document.getElementById('btnanular');
var btnguardar = document.getElementById('btnguardar');
var btnimprimir = document.getElementById('btnimprimir');

var btnimprimirdevoluciondiferencia = document.getElementById('btnimprimirdevoluciondiferencia');

const chkConIGV = document.getElementById('chkConIGV');


//VARIABLES
var _DIFERENCIA = []
var igvLocal = 18;
var _DATOS;
var _DETALLE = [];
var _HISTORIAL = [];
var _DETALLEINICIAL = [];
var _x;
var _CAMBIOSCOMPRA = [];
var _PRECIOSDETALLE = [];
var _TPRECIOS = [];
$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
        ]
    });

    //fnListarSucursal();
    if (MODELO.idfactura!=0)
        fnBuscarFactura(MODELO.idfactura);
});
function fnBuscarFactura(idfactura) {

    let controller = new AprobarFacturaController();
    controller.BuscarFactura(idfactura, function (data) {
        
        var detalle = JSON.parse(data[0]['DETALLE']);
        var factura = JSON.parse(data[0]['FACTURA'])[0];
        var oc = JSON.parse(data[0]['ORDENCOMPRA'])[0];
        var preingreso = JSON.parse(data[0]['PREINGRESO'])[0];

        MODELO = factura;
        btnimprimir.setAttribute('href', ORIGEN + '/Compras/CAprobarFactura/Imprimir/' + factura.idfactura);
        btnimprimirdevoluciondiferencia.setAttribute('href', ORIGEN + '/Compras/CAprobarFactura/ImprimirDevolucionDiferencia/' + factura.idfactura);
        lbltipodocumeto.innerText = (factura.documento);
        lblestadodocumento.innerText = (factura.estado);
        lblnumdocumento.innerText = (factura.serie + factura.numdoc);
        lblfechadocumento.innerText = moment(factura.fecha).format('DD/MM/YYYY');
        lblnumfacturaaprobar.innerText = (factura.serie + '-' + factura.numdoc);
        lblidfactura.innerText = factura.idfactura;

        lblfechapreingreso.innerText = moment(preingreso.fecha).format('DD/MM/YYYY');
        lblestadopreingreso.innerText = (preingreso.estado);
        lblnumpreingreso.innerText = (preingreso.codigopreingreso);
        lblidpreingreso.innerText = (preingreso.idpreingreso);

        lbltipodocumeto.innerText = (factura.documento);

        lblnumoc.innerText = (oc.codigoorden);
        lblfechaoc.innerText = moment(oc.fecha).format('DD/MM/YYYY');
        lblestadooc.innerText = (oc.estado);
        lblfechavencimientooc.innerText = moment(oc.fechavencimiento).format('DD/MM/YYYY');

        if (factura.idproveedor == undefined) {
            txtidproveedor.value = oc.idproveedor;
            txtruc.value = oc.proveedorruc;
            txtrazonsocial.value = oc.proveedor;
        } else {
            txtidproveedor.value = factura.idproveedor;
            txtruc.value = factura.ruc;
            txtrazonsocial.value = factura.razonsocial;
        }

        txtempresa.value = oc.empresa;
        txtnombremoneda.value = oc.moneda;
        txtcambiomoneda.value = oc.monedacambio;
        cmbcondicionpago.value = oc.idcondicionpago;     
        cmbtipopago.value = oc.idtipopago;
        txtsucursaldestino.value = oc.idsucursaldestino;
        txtncxdevolucion.value = factura.ncxdevolucion;
        txtncxdifdescuentos.value = factura.ncxdiferenciadesc;
        //fnListarAlmacenXSucursal(preingreso.idalmacensucursal);
        var observacion = factura.observacion;
        if (factura.observacion == undefined)
            observacion = "";
        txtobservacion.value = observacion;
        if (detalle === null)
            return;
      
        _DETALLEINICIAL = JSON.parse(data[0]['DETALLE']);
         
        fnCargarDatosAldetalle(detalle);
        
       
    });
}
//function fnListarSucursal() {
//    let controller = new SucursalController();
//    controller.ListarSucursalxEmpresaEnCombo('txtsucursaldestino', '', function (data) {
//        fnListarAlmacenXSucursal();
//    });
//}
//function fnListarAlmacenXSucursal(idalmacen) {
//    let controller = new AlmacenSucursalController();
//    controller.ListarAlmacenxSucursal('cmbalmacen', txtsucursaldestino.value, idalmacen, function (data) {
//        //$("#cmbalmacen option:contains(MOSTRADOR)").attr('selected', true);
//        var options = document.getElementById('cmbalmacen').getElementsByTagName('option');
//        for (var i = 0; i < options.length; i++) {
//            var e = options[i];
//            if (!(e.innerText.includes("APROBADO"))) {
//                e.setAttribute("hidden", "");
//            }
//            if (e.getAttribute('idareaalmacen') == '10001')//mostrador - aprobado
//                e.selected = true;
//        }

//        var optgroup = document.getElementById('cmbalmacen').getElementsByTagName('optgroup');
//        for (var i = 0; i < optgroup.length; i++) {
//            var e = optgroup[i];
//            if (!(e.innerText.includes("APROBADO"))) {
//                e.setAttribute("hidden", "");
//            }
//        }
//    });
//}
function fnCalcularTotales() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var subtotal = 0.0;
    var igv = 0.0;
    var total = 0.0;
    var prontopago = 0.0;
    var totalreal = 0.0;
    var percepcion = 0.0;
    var totalpagar = 0.0;
    var costofactura = 0.0;
    var pvf = 0.0;
    var ncxdevolucion = 0.0;
    var ncxdifedesc = 0.0;
    var totaldocumento = 0.0;
    var subtotaldocumento = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        var cantdev = 0;
        cantdev = parseFloat(document.getElementsByClassName("cantdevuelta_detalle")[c].innerText);
        costofactura = parseFloat(document.getElementsByClassName("costofacturaroc_detalle")[c].innerText);
        pvf = parseFloat(document.getElementsByClassName("pvfoc_detalle")[c].innerText);
        cantdev = isNaN(cantdev) ? 0 : cantdev;
        if (cantdev > 0) {
            ncxdevolucion += parseFloat(document.getElementsByClassName("monto_devolucion")[c].innerText);
        }
        var ncxdifedescaux = parseFloat(document.getElementsByClassName("diferencia_detalle")[c].innerText);
        ncxdifedesc += isNaN(ncxdifedescaux) ? 0 : ncxdifedescaux;
        subtotal += parseFloat(document.getElementsByClassName("subtotal_detalle")[c].innerText);       
        total += parseFloat(document.getElementsByClassName("total_detalle")[c].innerText);
        var totalpagaraux = parseFloat(document.getElementsByClassName("montigvdocumento_detalle")[c].innerText);
        totalpagar += isNaN(totalpagaraux) ? 0 : totalpagaraux;
        //factura
        var totaldocumentoaux = parseFloat(document.getElementsByClassName("montigvdocumento_detalle")[c].innerText);
        var subtotaldocumentoaux = parseFloat(document.getElementsByClassName("montdocumento_detalle")[c].innerText);
        totaldocumento += isNaN(totaldocumentoaux) ? 0 : totaldocumentoaux;
        subtotaldocumento += isNaN(subtotaldocumentoaux) ? 0 : subtotaldocumentoaux;

        c++;
    });
    igv = total - subtotal;
    prontopago = isNaN(total)?0:total;
    totalreal = isNaN(total) ? 0 :total;
    ncxdifedesc = isNaN(total) ? 0 : ncxdifedesc;
    percepcion = 0;
    ncxdevolucion = isNaN(ncxdevolucion) ? 0 : ncxdevolucion;
    txttotal.value = total.toFixed(numDecimales);
    txtigv.value = igv.toFixed(numDecimales);
    txtsubtotal.value = subtotal.toFixed(numDecimales);
    txtprontopago.value = prontopago.toFixed(numDecimales);
    txttotalreal.value = totalreal.toFixed(numDecimales);
    txtpercepcion.value = percepcion.toFixed(numDecimales);
    txttotalpagar.value = totalpagar.toFixed(numDecimales);
    txtncxdifdescuentos.value = ncxdifedesc.toFixed(numDecimales);
    txtncxdevolucion.value = ncxdevolucion.toFixed(numDecimales);

    txttotaldocumento.value = totaldocumento.toFixed(numDecimales);
    txtsubtotaldocumento.value = subtotaldocumento.toFixed(numDecimales);
    txtigvdocumento.value = (totaldocumento - subtotaldocumento).toFixed(numDecimales);
    
}
function fnGetDatosDetallePreingreso() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    var datatable = tbldetalle.rows().data();
    var c = 0;
    var array = [];
    filas.forEach(function (e) {
        var obj = new PIDetallePreingreso();
        obj.iddetallepreingreso = FN_GETDATOHTML(datatable[c][0],'iddetallepre_detalle');
        obj.idproducto = FN_GETDATOHTML(datatable[c][0], 'idproducto_detalle');
        obj.costo = document.getElementsByClassName('montdocumento_detalle')[c].innerText;
        obj.costoigv = document.getElementsByClassName('montigvdocumento_detalle')[c].innerText;
        array.push(obj);
        c++;
    });
    return array;
}
function fnGetDatosDetalleCotizacion() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr');
    var datatable = tbldetalle.rows().data();
    var c = 0;
    var array = [];
    filas.forEach(function (e) {
        if ((parseFloat(document.getElementsByClassName('costooc_detalle')[c].innerText))>0) {
            var obj = new CotizacionDetalle();
            obj.iddetallecotizacion = FN_GETDATOHTML(datatable[c][0], 'iddetallecoti_detalle');
            obj.idproducto = FN_GETDATOHTML(datatable[c][0], 'idproducto_detalle');
            obj.pvf = document.getElementsByClassName('pvfoc_detalle')[c].innerText;
            obj.vvf = document.getElementsByClassName('vvfoc_detalle')[c].innerText;
            obj.des1 = document.getElementsByClassName('des1_detalle')[c].innerText;
            obj.des2 = document.getElementsByClassName('des2_detalle')[c].innerText;
            obj.des3 = document.getElementsByClassName('des3_detalle')[c].innerText;
            obj.cantidad = (parseFloat(document.getElementsByClassName('cantingresada_detalle')[c].innerText) + parseFloat(document.getElementsByClassName('cantdevuelta_detalle')[c].innerText)).toString();
            obj.subtotal = document.getElementsByClassName('subtotal_detalle')[c].innerText;
            obj.total = document.getElementsByClassName('total_detalle')[c].innerText;
            obj.montofacturar = document.getElementsByClassName('costofacturaroc_detalle')[c].innerText;
            obj.costo = document.getElementsByClassName('costooc_detalle')[c].innerText;
            obj.idcotizacion = 0;

            var iddetallepre_detalle = FN_GETDATOHTML(datatable[c][0], 'iddetallepre_detalle');
            var objDetalle = _DETALLE.filter(x => x.iddetallepreingreso == iddetallepre_detalle);
            if (objDetalle[0].idmoneda == "null" || objDetalle[0].idmoneda == null) objDetalle[0].idmoneda = 0;
            if (objDetalle[0].cambio == "null" || objDetalle[0].cambio == null) objDetalle[0].cambio = 0;
            obj.idmoneda = objDetalle[0].idmoneda;
            obj.cambio = objDetalle[0].cambio;
            /*obj.idproducto = 0;*/

            var index = FN_GETDATOHTML(datatable[c][0], 'index_detalle');
            obj.bonificacion = _DETALLE[index].bonificacion;
            //console.log(obj);
            array.push(obj);
        }
        c++;
    });
    return array;
}
function fnCargarDatosAldetalle(detalle) {
    tbldetalle.clear().draw(false);
    _DETALLE = detalle;
    var contadorEstadoCheckbox = 0;
    var arrayVerificacion = detalle.filter(x => x.codigoproducto.includes("IM") || x.codigoproducto.includes("IS"));
    if (arrayVerificacion.length > 0) {
        numDecimales = 5;
    }
    for (var i = 0; i < detalle.length; i++) {
        if (contadorEstadoCheckbox < 2) {
            if (!(detalle[i].producto.includes("BONIF"))) {
                if (detalle[i].total - detalle[i].subtotal == 0) {
                    igvLocal = 0;
                    chkConIGV.checked = false;
                } else {
                    igvLocal = 18;
                    chkConIGV.checked = true;
                }
                contadorEstadoCheckbox += 1;
            }
        }

        var desc1 = parseFloat(detalle[i].des1);
        var desc2 = parseFloat(detalle[i].des2);
        var desc3 = parseFloat(detalle[i].des3);

        if (detalle[i].costopi == 0 || detalle[i].costoigvpi == 0) {
            detalle[i].costopi = parseFloat(detalle[i].subtotal);
            detalle[i].costoigvpi = parseFloat(detalle[i].total);
        }
        var costopi = parseFloat(detalle[i].costopi.toFixed(numDecimales));
        var costoigvpi = parseFloat(detalle[i].costoigvpi.toFixed(numDecimales));
        var diferencia = 0;
        var sCadenaMontDocIgv = '<span class="montigvdocumento_detalle editable-number" contenteditable="true" montoigvdoc="' + costoigvpi + '">' + costoigvpi + '</span>';
        var sCadenaMontDoc = '<span class="montdocumento_detalle editable-number" contenteditable="true" montodoc="' + costopi + '">' + costopi + '</span>';
        var montoDevolucion = 0;
        diferencia = parseFloat(costoigvpi - detalle[i].total).toFixed(numDecimales);
        sCadenaMontDocIgv = '<span class="montigvdocumento_detalle editable-number" contenteditable="true" montoigvdoc="' + costoigvpi + '">' + costoigvpi + '</span>';
        var montdocInterno = parseFloat(costoigvpi * 100 / (100 + igvLocal)).toFixed(numDecimales);
        sCadenaMontDoc = '<span class="montdocumento_detalle editable-number" contenteditable="true" montodoc="' + costopi + '">' + montdocInterno + '</span>';

        //montoDevolucion = parseFloat(parseFloat(detalle[i].pvfoc) * parseFloat(detalle[i].cantdevuelta));
        //montoDevolucion = (montoDevolucion - (montoDevolucion * (desc1 / 100))).toFixed(numDecimales);
        //montoDevolucion = (montoDevolucion - (montoDevolucion * (desc2 / 100))).toFixed(numDecimales);
        //montoDevolucion = (montoDevolucion - (montoDevolucion * (desc3 / 100))).toFixed(numDecimales);
        var precioUniParaMontoDev = parseFloat(detalle[i].total / (parseFloat(detalle[i].cantingresada) + parseFloat(detalle[i].cantdevuelta)));
        montoDevolucion = (parseFloat(precioUniParaMontoDev) * detalle[i].cantdevuelta).toFixed(numDecimales);

        var style = "";
        if (detalle[i].producto.includes("BONIF")) {
            style = "text-primary";
        }
        var fila = tbldetalle.row.add([
            '<span class="index_detalle ' + style + '">' + i + '</span>' +
            '<span class="iddetallepre_detalle ' + style + '">' + detalle[i].iddetallepreingreso + '</span>' +
            '<span class="idproducto_detalle ' + style + '">' + detalle[i].idproducto + '</span>' +
            '<span class="iddetallecoti_detalle ' + style + '">' + detalle[i].iddetallecotizacion + '</span>',
            '<span class="index_detalle ' + style + '">' + (i + 1) + '</span>',
            '<span class="codigoproducto_detalle ' + style + '">' + detalle[i].codigoproducto + '</span>',
            '<span class="producto_detalle ' + style + '">' + detalle[i].producto + '</span>',
            '<span class="cantingresada_detalle ' + style + '">' + detalle[i].cantingresada + '</span>',
            '<span class="cantdevuelta_detalle ' + style + '">' + detalle[i].cantdevuelta + '</span>',
            '<span class="vvfoc_detalle ' + style + '">' + detalle[i].vvfoc + '</span>',
            '<span class="pvfoc_detalle ' + style + '">' + detalle[i].pvfoc + '</span>',
            '<span class="des1_detalle ' + style + '" costoinicial="' + detalle[i].des1 + '">' + detalle[i].des1 + '</span>',
            '<span class="des2_detalle ' + style + '">' + detalle[i].des2 + '</span>',
            '<span class="des3_detalle ' + style + '">' + detalle[i].des3 + '</span>',
            '<span class="costooc_detalle ' + style + '" costoinicial="' + detalle[i].costooc.toFixed(numDecimales) + '">' + detalle[i].costooc.toFixed(numDecimales) + '</span>',
            '<span class="costofacturaroc_detalle ' + style + '" costoinicial="' + detalle[i].costofacturaroc.toFixed(numDecimales) + '">' + detalle[i].costofacturaroc.toFixed(numDecimales) + '</span>',
            '<span class="subtotal_detalle ' + style + '">' + detalle[i].subtotal.toFixed(numDecimales) + '</span>',//subtotal - detalle[i].subtotal.toFixed(numDecimales)
            '<span class="total_detalle ' + style + '">' + detalle[i].total.toFixed(numDecimales) + '</span>',//total - detalle[i].total.toFixed(numDecimales)
            sCadenaMontDoc,
            sCadenaMontDocIgv,
            '<span class="diferencia_detalle ' + style + '">' + diferencia + '</span>',
            '<span class="monto_devolucion ' + style + '">' + montoDevolucion + '</span>',
            //'<select name="select"><option value="A">Por Cantidad</option><option value="B">Por Importe</option></select>',
        ]).draw(false).node();
        $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
    }

    fnCalcularTotales();
}


btnguardar.addEventListener('click', function () {
    var arryPrecios = _TPRECIOS.filter(x => x[1] == 1001);
    if (arryPrecios.length > 0) {
        MLPP_ListarProductosYPrecios();
        $('#modallistaprecioproducto').modal('show');
    } else {
        fnAprobarFactura();
    }
    
});
function fnAprobarFactura() {
    BLOQUEARCONTENIDO('cardaprobacion', 'Guardando datos...');
    var factura = new PIFacturaPreingreso();
    var preingreso = new PIPreingreso();
    if (MODELO != null) {
        factura.idfactura = MODELO.idfactura;
        factura.idpreingreso = MODELO.idpreingreso;
        factura.ncxdevolucion = txtncxdevolucion.value;
        factura.ncxdiferenciadesc = txtncxdifdescuentos.value;
        factura.observacion = txtobservacion.value;
        var hoy = new Date();
        var fechaenEEUU = hoy.toLocaleDateString('en-US');
        factura.fecha = fechaenEEUU;
        factura.fechaaprobacion = fechaenEEUU;
        factura.idproveedor = txtidproveedor.value;
        preingreso.idpreingreso = MODELO.idpreingreso;
        //preingreso.idalmacensucursal = cmbalmacen.value;
    }
    let controller = new AprobarFacturaController();
    var obj = {
        factura: JSON.stringify(factura),
        preingreso: preingreso,
        detalle: JSON.stringify(fnGetDatosDetallePreingreso()),
        cotizaciondetalle: JSON.stringify(fnGetDatosDetalleCotizacion()),
        preciosproducto: JSON.stringify(_PRECIOSLISTAPRECIOS),
        historial: JSON.stringify(_HISTORIAL)
    }

    controller.AprobarFactura(obj, function (data) {
        //console.log(data);
        try {
            if (data.mensaje === 'ok') {
                //Comentado 28-11-2022
                var obj2 = {
                    arreglo: _TPRECIOS
                };
                var controller = new ListaPreciosController();
                controller.ActualizarPrecios(obj2);

                alertaSwall('S', 'FACTURA APROBADA', '');
                fnBuscarFactura(data.objeto.idfactura);
            }
            _TPRECIOS = []
        } catch (error) {
            mensaje("D", 'Error al guardar los registros');
        }
    });
    DESBLOQUEARCONTENIDO('cardaprobacion');
    $('#modallistaprecioproducto').modal('hide');
}
$(document).on('click', '.btnbuscarfactura', function () {  
    $('#modalbuscarpreingresos').modal('show');  
});
//txtsucursaldestino.addEventListener('change', function () {
//    fnListarAlmacenXSucursal();
//});
$(document).on('keyup', '.montdocumento_detalle', function () {
    var montodoc = $(this).text();
    var row = (this).parentNode.parentNode;
    var diferencia = 0;
    var montoigvdoc = 0;
    var propiedad_montoigvdoc = 0;
    var txtdiferencia = row.getElementsByClassName('diferencia_detalle')[0];
    var total = parseFloat(row.getElementsByClassName('total_detalle')[0].innerText);
    propiedad_montoigvdoc = row.getElementsByClassName('montigvdocumento_detalle')[0].getAttribute("montoigvdoc");
    montodoc = parseFloat(montodoc);
    montoigvdoc = (montodoc + (montodoc * igvLocal / 100)).toFixed(numDecimales);

    if (isNaN(montoigvdoc)) montoigvdoc = 0;
    else montoigvdoc = parseFloat(montoigvdoc);

    diferencia = montoigvdoc - total;
    if (isNaN(diferencia)) diferencia = '';
    else diferencia = diferencia.toFixed(numDecimales);

    if (diferencia != 0) txtdiferencia.classList.add('bg-warning');
    else txtdiferencia.classList.remove('bg-warning');

    txtdiferencia.innerText = diferencia;
    fnCalcularTotales();
    //actualizar tabla
    var datatable = tbldetalle.row($(this).parents('tr')).data();
    var index = FN_GETDATOHTML(datatable[0], 'index_detalle');
    row.getElementsByClassName('montigvdocumento_detalle')[0].innerText = montoigvdoc;
    _DIFERENCIA[index] = montoigvdoc;
    _DETALLE[index].costopi = parseFloat($(this).text());
    _DETALLE[index].costoigvpi = parseFloat(montoigvdoc);
});
$(document).on('keyup', '.montigvdocumento_detalle', function () {
    var montoigvdoc = $(this).text();
    var row = (this).parentNode.parentNode;
    var diferencia = 0;
    var montodoc = 0;
    var propiedad_montoigvdoc = 0;
    var txtdiferencia = row.getElementsByClassName('diferencia_detalle')[0];
    var total = parseFloat(row.getElementsByClassName('total_detalle')[0].innerText);
    propiedad_montoigvdoc = parseFloat(row.getElementsByClassName('montigvdocumento_detalle')[0].innerText);
    montoigvdoc = parseFloat(montoigvdoc);
    montodoc = (montoigvdoc * 100 / (100 + igvLocal)).toFixed(numDecimales);

    if (isNaN(montodoc)) montodoc = 0;
    else montodoc = parseFloat(montodoc);

    diferencia = propiedad_montoigvdoc - total;
    if (isNaN(diferencia)) diferencia = 0;
    else diferencia = diferencia.toFixed(numDecimales);

    if (diferencia != 0) txtdiferencia.classList.add('bg-warning');
    else txtdiferencia.classList.remove('bg-warning');

    txtdiferencia.innerText = diferencia;
    fnCalcularTotales();
    //actualizar tabla
    var datatable = tbldetalle.row($(this).parents('tr')).data();   
    var index = FN_GETDATOHTML(datatable[0], 'index_detalle');
    row.getElementsByClassName('montdocumento_detalle')[0].innerText = montodoc;
    _DIFERENCIA[index] = montoigvdoc;
    _DETALLE[index].costopi = parseFloat(montodoc);
    _DETALLE[index].costoigvpi = parseFloat($(this).text());
});

$(document).on('click', '.btnpasarpreingreso', function () {
    console.log('x');
    var idfactura = this.getAttribute('idfactura');
    $('#modalbuscarpreingresos').modal('hide');
    if (tbldetalle.rows().data().length===0)
        location.href = ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + idfactura;
    else
        swal('EXISTE UN REGISTRO CARGADO', "¿Desea recargar la página?", {
            icon: 'warning',
            buttons: {
                confirm: {
                    text: 'ACEPTAR',
                    className: 'btn btn-success'
                },
                cancel: {
                    visible: true,
                    text: 'CANCELAR',
                    className: 'btn btn-danger'
                }
            }
        }).then((confirmar) => {
            if (confirmar) {
                location.href = ORIGEN + '/Compras/CAprobarFactura/AprobarFactura?id=' + idfactura;
                //fnBuscarFactura(idfactura);
            } else {
                swal.close();
            }
        });          
});

btnanular.addEventListener('click', function () {

    let estadoFactura = lblestadodocumento.innerText;
    if (estadoFactura != "" && (estadoFactura == "APROBADO" || estadoFactura == "HABILITADO")) {
        swal('¿DESEA ANULAR LA FACTURA?', "", {
            icon: 'warning',
            buttons: {
                confirm: {
                    text: 'ACEPTAR',
                    className: 'btn btn-success'
                },
                cancel: {
                    visible: true,
                    text: 'CANCELAR',
                    className: 'btn btn-danger'
                }
                
            }
        }).then((confirmar) => {
            if (confirmar) {
                $('#modalvalidarusuario').modal('show');
            } else {
                swal.close();
            }
        });
    }
    else {
        swal({
            title: "Solo se pueden ANULAR las facturas en estado APROBADO o HABILITADO",
            text: "",
            icon: "warning",
            button: "Aceptar",
        });
    }
});

btnimprimir.addEventListener('click', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR FACTURA DE PREINGRESO');
});
btnimprimirdevoluciondiferencia.addEventListener('click', function () {
    if (lblestadodocumento.innerText == 'APROBADO') {
        var href = $(this).attr('href'); console.log(href);
        if (href != '')
            ABRIR_MODALIMPRECION(href, 'IMPRIMIR NC DEVOLUCION - DIFERENCIA');
    }
});

$("#txtfiltrotabladetalle").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tbldetalle tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$('#tbldetalle tbody').on('dblclick', 'tr', function () {
    var fila = tbldetalle.row($(this)).data();
    var index = FN_GETDATOHTML(fila[0], 'index_detalle');
    var idcdetallecotizacion = FN_GETDATOHTML(fila[0], 'iddetallecoti_detalle');
    var iddetallepre_detalle = FN_GETDATOHTML(fila[0], 'iddetallepre_detalle');
    MPU_txtidproducto.value = FN_GETDATOHTML(fila[0], 'idproducto_detalle');
    MPU_txtcodproducto.value = FN_GETDATOHTML(fila[2], 'codigoproducto_detalle');
    MPU_txtnombreproducto.value = FN_GETDATOHTML(fila[3], 'producto_detalle');
    MPU_txtcostofact.setAttribute('costoinicial', this.getElementsByClassName('costofacturaroc_detalle')[0].getAttribute('costoinicial'));
    MPU_txtcosto.setAttribute('costoinicial', this.getElementsByClassName('costooc_detalle')[0].getAttribute('costoinicial'));
    MPU_txtd1.setAttribute('costoinicial', this.getElementsByClassName('des1_detalle')[0].getAttribute('costoinicial'));

    var objDetalle = _DETALLE.filter(x => x.iddetallepreingreso == iddetallepre_detalle);
    var idmoneda = objDetalle[0].idmoneda;
    var cambio = objDetalle[0].cambio;
    if (idmoneda == 0) idmoneda = 100000;
    MPU_txtidmoneda.value = idmoneda;
    MPU_txtcambio.value = cambio;

    if (MPU_txtcodproducto.value.includes("IS") || MPU_txtcodproducto.value.includes("IM")) {
        MPU_contenedorMoneda.removeAttribute("hidden");
        MPU_contenedorCambio.removeAttribute("hidden");
    } else {
        MPU_contenedorMoneda.setAttribute("hidden", "");
        MPU_contenedorCambio.setAttribute("hidden", "");
    }

    var cotizacion = new CotizacionController();
    cotizacion.BuscarUltimaCompraxProducto(MPU_txtidproducto.value, function (data) {
        var clase = new ModalPrecioUtilidad();
        if (data != null || data != undefined) {
            var dataDes = JSON.parse(data);
            clase.pasarUltimaCompra(dataDes[0]);
        }
        else
            mensaje('I', 'No hay historial');
        //if (data.mensaje === 'ok')
        //    clase.pasarUltimaCompra(data.objeto);
        //else
        //    mensaje('I', 'No hay historial');
    });
    var clase = new ModalPrecioUtilidad();
    clase.pasarPrecioCompraActual(_DETALLE[index]);
    clase.BuscarPreciosProductoxLista(MPU_txtidproducto.value);
    $('#modalprecioutilidad').modal('show');
});

MPU_btnconservarcambios.addEventListener('click', function () {
    //ACTUAL
    var objdetallesp = $('#MPU_tblprecios').serializeArray();
    objdetallesp = CONVERT_FORM_TO_JSON(objdetallesp);
    var codigop = MPU_txtcodproducto.value;
    
    var res = '';
    var rows = (document.getElementById("MPU_tblprecios").childNodes);
    for (var i = 0; i < rows.length; i++) {
        var rowchild = rows[i].childNodes;
        _PRECIOSDETALLE.push(codigop);
        for (var j = 0; j < rowchild.length; j++) {            
            var td = rowchild[j];
            if (j <= 1) {
                res = td.innerText;
            } else {
                var tdchild = td.children[0];
                res = tdchild.value;
                if (res == '') res = '0';
            }
            _PRECIOSDETALLE.push(res);
        }

        validar_insertar_precios_array(_PRECIOSDETALLE);
        _PRECIOSDETALLE = [];
    }

    var obj=$('#MPU_form_nuevacompra').serializeArray();
    obj = CONVERT_FORM_TO_JSON(obj);   
    var row = tbldetalle.row($('.selected')).data();
    var index = FN_GETDATOHTML(row[0], 'index_detalle');
    $('#modalprecioutilidad').modal('hide');  
    _DETALLE[index].subtotal=parseFloat( obj.subtotal);
    _DETALLE[index].total = parseFloat( obj.total);
    _DETALLE[index].des1 = parseFloat(obj.des1);
    _DETALLE[index].des2 = parseFloat(obj.des2);
    _DETALLE[index].des3 = parseFloat(obj.des3);
    _DETALLE[index].costooc = parseFloat(obj.costo);
    _DETALLE[index].costofacturaroc = parseFloat(obj.costofactura);
    _DETALLE[index].idmoneda = parseFloat(obj.idmoneda);
    _DETALLE[index].cambio = parseFloat(obj.cambio);
    //_DETALLE[index].bonificacion = parseFloat(obj.bonificacion) == 0 ? parseFloat(obj.bonificacion);
    _DETALLE[index].utilidad = parseFloat(obj.utilidad);
    _DETALLE[index].pvfoc = parseFloat(obj.pvf);
    _DETALLE[index].vvfoc = parseFloat(obj.vvf);
    //cargar la edicion de los presios al detalle
    fnCargarDatosAldetalle(_DETALLE);
    //actualizar el array de precios de producto
    MPU_fnjuntarlistaprecios_array_y_aux();
    GUARDAR_HISTORIAL(obj);
});


function GUARDAR_HISTORIAL(historico) {

    var idprod = MPU_txtidproducto.value;
    var arreglo =[];
    arreglo.push({
        "idproducto": idprod,
        "vvf": parseFloat(historico.vvf),
        "pvf": parseFloat(historico.pvf),
        "cantidad": parseFloat(historico.cantidadIngresada) + parseFloat(historico.cantidadDevuelta),
        "subtotal": parseFloat(historico.subtotal),
        "total": parseFloat(historico.total),
        "dsc1": parseFloat(historico.des1),
        "dsc2": parseFloat(historico.des2),
        "dsc3": parseFloat(historico.des3),
        "bonificacion": parseFloat(historico.bonificacion),
        "costofact": parseFloat(historico.costofactura),
        "costo": parseFloat(historico.costo),
        "idempresa":0
    });
    if (validar_historial(arreglo)) {
        _HISTORIAL.push({
            "idproducto": idprod,
            "vvf": parseFloat(historico.vvf),
            "pvf": parseFloat(historico.pvf),
            "cantidad": parseFloat(historico.cantidadIngresada) + parseFloat(historico.cantidadDevuelta),
            "subtotal": parseFloat(historico.subtotal),
            "total": parseFloat(historico.total),
            "dsc1": parseFloat(historico.des1),
            "dsc2": parseFloat(historico.des2),
            "dsc3": parseFloat(historico.des3),
            "bonificacion": parseFloat(historico.bonificacion),
            "costofact": parseFloat(historico.costofactura),
            "costo": parseFloat(historico.costo),
            "idempresa":0
        });
    };
}

function validar_historial(array) {
    var res = false;
    if (_HISTORIAL.length == 0) {
        res = true;
    } else {
        for (i = 0; i < _HISTORIAL.length; i++) {
            if (_HISTORIAL[i]["idproducto"] == array[0]["idproducto"]) {
                return false;
            } else {
                res = true;
            }
        }
    }
    return res;
}

function validar_insertar_precios_array(array) {
    if (_TPRECIOS.length == 0) {
        _TPRECIOS.push(array);
    } else {
        for (let i = 0; i < _TPRECIOS.length; i++) {
            if (_TPRECIOS[i][0] == array[0] && _TPRECIOS[i][1] == array[1]) {
                _TPRECIOS[i] = array;
            } else {
                _TPRECIOS.push(array);
            }
        }
    }

    let sinDuplicados = _TPRECIOS.filter((item, index) => {
        return _TPRECIOS.indexOf(item) === index;
    })
    _TPRECIOS = sinDuplicados;
}


$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CAprobarFactura/VerificarCredenciales_AprobarFactura";
    var obj = $('#form-validarusuario').serializeArray();
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            AnularFactura();
            $('#modalvalidarusuario').modal('hide');
        }
        else if (data.mensaje === "Credenciales incorrectas") {
            mensaje("I", "Usuario o contraseña son incorrectas");
        } else
            mensaje('I', data.mensaje);
    }).fail(function (data) {
        mensaje("D", "Error en el servidor");
    });
});

function AnularFactura() {
    var idpreingreso = parseInt(lblidpreingreso.innerText);
    var idfactura = parseInt(lblidfactura.innerText);
    let controller = new AprobarFacturaController();
    var obj = {
        idfactura: idfactura,
        idpreingreso: idpreingreso
    }
    controller.AnularFactura(obj, function (data) {
        if (data.mensaje == "ok") {
            var sMensaje = "";
            if (lblestadodocumento.innerText == "APROBADO") {
                lblestadodocumento.innerText = "HABILITADO";
                sMensaje = "FACTURA HABILITADA";
            }else if (lblestadodocumento.innerText == "HABILITADO") {
                lblestadodocumento.innerText = "ANULADO";
                sMensaje = "FACTURA ANULADA";
            }
            alertaSwall('S', sMensaje, '');
        }
        else {
            alertaSwall('D', 'Error al anular la factura.', '');
        }
    });
}

chkConIGV.addEventListener('change', function (e) {

    if (document.getElementsByClassName("index_detalle").length > 0) {
        var filas = document.querySelectorAll("#tbldetalle tbody tr");
        var datatable = tbldetalle.rows().data();

        chkConIGV.value = this.value;
        if (this.checked) igvLocal = 18;
        else igvLocal = 0;

        var c = 0;
        filas.forEach(function (e) {
            if (document.getElementsByClassName("producto_detalle")[c].innerText.includes("BONIF") == false) {
                var itemfiltered = _DETALLE.filter(x => x.iddetallepreingreso == FN_GETDATOHTML(datatable[c][0], 'iddetallepre_detalle') && x.producto.includes("BONIF") == false);

                var cantIteracion = 1;
                if (document.getElementsByClassName("cantdevuelta_detalle")[c].innerText > 0) {
                    cantIteracion = 2;
                }

                for (let i = 0; i < cantIteracion; i++) {
                    var vvf = parseFloat(document.getElementsByClassName("vvfoc_detalle")[c].innerText);
                    var cantidadIngresada = parseFloat(document.getElementsByClassName("cantingresada_detalle")[c].innerText);
                    var cantidadDevuelta = parseFloat(document.getElementsByClassName("cantdevuelta_detalle")[c].innerText);
                    var cantidad = 0;

                    if (i == 0) cantidad = cantidadIngresada;//Total - Subtotal
                    else cantidad = cantidadIngresada + cantidadDevuelta;//Monto Doc Igv - Monto Doc

                    var desc1 = parseFloat(document.getElementsByClassName("des1_detalle")[c].innerText);
                    var desc2 = parseFloat(document.getElementsByClassName("des2_detalle")[c].innerText);
                    var desc3 = parseFloat(document.getElementsByClassName("des3_detalle")[c].innerText);

                    var pvf = parseFloat(vvf + (vvf * igvLocal / 100)).toFixed(numDecimales);
                    var total_final = parseFloat(pvf * cantidad).toFixed(numDecimales);
                    total_final = (total_final - (total_final * (desc1 / 100))).toFixed(numDecimales);
                    total_final = (total_final - (total_final * (desc2 / 100))).toFixed(numDecimales);
                    total_final = (total_final - (total_final * (desc3 / 100))).toFixed(numDecimales);

                    if (itemfiltered[0]["tboni"] == "AFECTO") {
                        if (itemfiltered[0]["cantidadb"] > 0) {
                            cantidad += itemfiltered[0]["cantidadb"];
                        } else {
                            total_final -= itemfiltered[0]["bonificacion"];
                        }
                    }

                    var costo = parseFloat(total_final / cantidad).toFixed(numDecimales);
                    var subtotal_final = parseFloat((total_final * 100 / (100 + igvLocal))).toFixed(numDecimales);

                    if (i == 0) {
                        document.getElementsByClassName("pvfoc_detalle")[c].innerText = pvf;
                        document.getElementsByClassName("costooc_detalle")[c].innerText = costo;
                        document.getElementsByClassName("costofacturaroc_detalle")[c].innerText = costo;
                        document.getElementsByClassName("subtotal_detalle")[c].innerText = subtotal_final;
                        document.getElementsByClassName("total_detalle")[c].innerText = total_final;
                        document.getElementsByClassName("monto_devolucion")[c].innerText = (parseFloat(total_final / cantidadIngresada).toFixed(numDecimales) * cantidadDevuelta).toFixed(numDecimales);
                        itemfiltered[0]["pvf"] = parseFloat(pvf);
                        itemfiltered[0]["pvfoc"] = parseFloat(pvf);
                        itemfiltered[0]["costooc"] = parseFloat(costo);
                        itemfiltered[0]["costofacturaroc"] = parseFloat(costo);
                        itemfiltered[0]["total"] = parseFloat(total_final);
                        itemfiltered[0]["subtotal"] = parseFloat(subtotal_final);
                    }
                    itemfiltered[0]["costoigvpi"] = parseFloat(total_final);
                    itemfiltered[0]["costopi"] = parseFloat(subtotal_final);
                    document.getElementsByClassName("montdocumento_detalle")[c].innerText = subtotal_final;
                    document.getElementsByClassName("montigvdocumento_detalle")[c].innerText = total_final;
                    document.getElementsByClassName("montdocumento_detalle")[c].setAttribute("montodoc", subtotal_final);
                    document.getElementsByClassName("montigvdocumento_detalle")[c].setAttribute("montoigvdoc", total_final);
                }                
            }
            c++;
        });
        fnCalcularTotales();
    }
});

$(document).on('click', '#txtruc', function (e) {
    $('#modalproveedores').modal('show');
});
$(document).on('click', '.btnpasarproveedor', function (e) {
    var columna = tblproveedores.row($(this).parents('tr')).data();
    txtidproveedor.value = columna[0];
    buscarproveedor(columna[0]);
    $('#modalproveedores').modal('hide');
});

function buscarproveedor(id) {
    let controller = new ProveedorController();
    controller.BuscarProveedor(id, function (data) {
        txtidproveedor.value = data.idproveedor;
        txtruc.value = data.ruc;
        txtrazonsocial.value = data.razonsocial;
    });

}