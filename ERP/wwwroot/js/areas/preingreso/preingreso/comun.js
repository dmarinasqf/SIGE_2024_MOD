var tbllista;
var btnguardarPreIngreso = $('#btnguardarPreIngreso');
var btnanular = $('#btnanular');
var txtcodigoorden = $('#txtcodigoorden');
var txtidorden = $('#txtidorden');
var txtcodigopreingreso = $('#txtcodigopreingreso');
var cmbtipodocumento = $('#cmbtipodocumento');
var txtnumdoc = $('#txtnumdoc');
var txtnumdoc2 = $('#txtnumdoc2');
var txtruc = $('#txtruc');
var txtrazonsocial = $('#txtrazonsocial');
var txttipomoneda = $('#txttipomoneda');
var txtcot = $('#txtcot');
var txtcondicionpago = $('#txtcondicionpago');
var cmbalmacen = $('#cmbalmacen');
var txtidquimico = $('#txtidquimico');
var txtquimico = $('#txtquimico');
var txtobservacion = $('#txtobservacion');
var txtobs = $('#txtobs');
var txtfechaorden = $('#txtfechaorden');
var txtestadoorden = $('#txtestadoorden');
var txtestado = $('#txtestado');
var checkrechazado = $('#checkrechazado');
var txtidproveedor = $('#txtidproveedor');
var txtidpreingreso =$('#txtidpreingreso');
var txtfechadoc = $('#txtfechadoc');
var txtidfactura = $('#txtidfactura');
var cardfactura = document.getElementById('cardfactura');
//buttons
var btnnuevafactura = document.getElementById('btnnuevafactura');
var btnverfacturas = document.getElementById('btnverfacturas');
var btnnuevo = document.getElementById('btnnuevo');
var btnbonifueradocumento = document.getElementById('btnbonifueradocumento');
var btnmostrarguiadevolucion = document.getElementById('btnmostrarguiadevolucion');

var ARRAYORDENES = [];
var PRODUCTOLOTE;

let ArrayORDENITEMSAPROBARFACTURA = new Map();
var ORDENITEMSAPROBARFACTURA = 0;

var facturaGlobal;
var arrayECParaValidacion = [];
//FSILVARI - INICIO
var CODPRO = '';
var IDUMA = 0;
var VALORFACTOR = 0.00;
var IDUMABASE = 0;
var VALORFACTOR2 = 0.00;
var IDUMAMOD2 = 0;
//FSILVARI - FINAL
$(document).ready(function () {

    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });

    cardfactura.classList.add('deshabilitartodo');
    if (MODELO.idpreingreso === '' || MODELO.idpreingreso === 0)
        cardfactura.classList.remove('deshabilitartodo');
    else
        fnBuscarPreingresoCompleto(MODELO.idpreingreso);

});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;

   
    if (tecla === 'F12') {
        e.preventDefault();
        fnabrirmodalguiadevolucion();
    }
});
function fnlimpiar() {
    $('#form-registro').trigger('reset');
    _LOTESPORPRODUCTO = [];
    ArrayORDENITEMSAPROBARFACTURA.clear();
    //arrayECParaValidacion = [];
    ORDENITEMSAPROBARFACTURA = 0;
    tbllista.clear().draw(false);
    cardfactura.classList.remove('deshabilitartodo');
}
txtcodigoorden.click(function (e) {
    $('#modalordencompra').modal('show');
    fnBOC_ListarOrdenes('APROBADO | PREINGRESO PARCIAL | PENDIENTE', MBOC_txtordencompra.value, '');
    //fnBuscarOrdenesCompras();
});

$(document).on('click', '.btnpasarorden', function (e) {
    var id = $(this).attr('id');
    verificaralmacenes(id, IDSUCURSAL);
});

function verificaralmacenes(orden, sucursal) {
    let controller = new PreingresoController();
    controller.VerificarAlmacenesParaPreingreso(orden, sucursal, function (data) {
        btnguardarPreIngreso.prop('disabled', false);
        fnValidarSiExisteOrdenTienePreingreso(data);
        //buscarordencompra(orden);
    });
}
function fnValidarSiExisteOrdenTienePreingreso(idorden) {
    let controller = new PreingresoController();
    controller.VerificarSiOrdenTienePreingreso(idorden, function (data) {
        if (data.mensaje === 'no tiene') {
            buscarordencompra(idorden);
        }
        else if (data.mensaje === 'tiene') {
            swal('EXISTE UN PREINGRESO CON LA ORDEN DE COMPRA SELECCIONADA', "¿DESEA MODIFICARLA?", {
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
                    fnBuscarPreingresoCompleto(data.objeto.idpreingreso);
                } else {
                    swal.close();
                }
            });
        }
    });
}
function fnBuscarPreingresoCompleto(idpreingreso) {
    let controller = new PreingresoController();
    controller.BuscarPreingresoCompleto(idpreingreso, fnCargarDatosPreingreso);
}
function fnCargarDatosPreingreso(data) {
    console.log(data)
    fnlimpiar();
    cardfactura.classList.add('deshabilitartodo');
    var cabecera = JSON.parse(data[0].CABECERA);
    var detalle = JSON.parse(data[0].DETALLE);
    var facturas = JSON.parse(data[0].FACTURAS);
    cabecera = cabecera[0];

    for (var i = 0; i < facturas.length; i++){
        if (facturas[i].idfactura == MODELO.idfactura) {
            txtnumdoc.val(facturas[i].serie);
            txtnumdoc2.val(facturas[i].numdoc);
            txtidfactura.val(facturas[i].idfactura);
            txtfechadoc.val(moment(facturas[i].fecha).format('YYYY-MM-DD'));
        }

        //if (facturas[i].estado == 'ANULADO') {
        //    facturas[i].numdoc += " - ANULADO";
        //}
    }

    facturaGlobal = facturas;
    //fnLlenarTablaFacturas(facturas);
    //fnLlenarTablaFacturas_ParaAnular(facturas);

    $("#btnimprimir").attr('href', ORIGEN + '/PreIngreso/PIPreingreso/Imprimir/' + cabecera['ID']);
    txtidpreingreso.val(cabecera['ID']);
    txtcodigoorden.val(cabecera['CODIGOORDEN']);
    txtcodigopreingreso.val(cabecera['CODIGO']);
    txtidorden.val(cabecera['IDORDEN']);
    txtfechaorden.val(cabecera['FECHAORDEN']);
    txtestadoorden.val(cabecera['ESTADOORDEN']);
    txtruc.val(cabecera['PRO_RUC']);
    txtrazonsocial.val(cabecera['PRO_RAZONSOCIAL']);
    txttipomoneda.val(cabecera['MONEDA']);
    txtcot.val(cabecera['MONEDA CAMBIO']);
    txtcondicionpago.val(cabecera['CONDICION PAGO']);
    txtidproveedor.val(cabecera['ID PROVEEDOR']);
    //cmbalmacen.val(cabecera['IDALMACEN']);
    txtquimico.val(cabecera['QUIMICO']);
    txtobs.val(cabecera['OBS']);
    txtobservacion.val(cabecera['OBSERVACION']);
    fnListarAlmacenPorSucursal(cabecera['IDSUCURSAL DESTINO'], cabecera['IDALMACEN']);
    //if (cabecera['RECHAZADO'])
    //checkrechazado.prop('checked', true);

    tbllista.clear().draw(false);

    for (var i = 0; i < detalle.length; i++) {
        var inputdisablecanfac = '';
        var inputdisablecandev = '';
        if (detalle[i]['TIPO INGRESO'].includes('BONIFICACION')) detalle[i]['PRODUCTO'] += " BONIF";

        if (detalle[i]['IDFACTURA'] != 0) {
            inputdisablecanfac = 'disabled';
            inputdisablecandev = 'disabled';

            if (ArrayORDENITEMSAPROBARFACTURA.has(detalle[i]['PRODUCTO']) == false) {
                ArrayORDENITEMSAPROBARFACTURA.set(detalle[i]['PRODUCTO'], detalle[i]['ORDENITEMSAPROBARFACTURA']);
            }
            if ((detalle[i]["TIPOPRODUCTO"] == "EC" || detalle[i]["TIPOPRODUCTO"] == "SV") && detalle[i]["FACTURA"] != "") {
                arrayECParaValidacion.push((i + 1));
            }
        }

        //FSILVARI - INICIO
        CODPRO = detalle[i]['COD_PROD_QF'];
        IDUMA = detalle[i]['UMA-ID'];

        var arrayFactor = detalle[i]['FACTOR'];
        var cadenaSeprada = arrayFactor.split('-');
        var arrayFactor2 = detalle[i]['FACTOR2'];
        var cadenaSeprada2 = arrayFactor2.split('-');

        IDUMABASE = cadenaSeprada[0];
        VALORFACTOR = parseFloat(cadenaSeprada[1]);

        IDUMAMOD2 = cadenaSeprada2[0];
        VALORFACTOR2 = parseFloat(cadenaSeprada2[1]);

        var auxtfila = tbllista.row.add([
            '<label class="detalle_iddetalle">' + detalle[i]['IDTABLA'] + '</label>' +
            '<label class="detalle_iddetallepreingreso">' + detalle[i]['ID'] + '</label>' +
            '<label class="detalle_idfactura">' + detalle[i]['IDFACTURA'] + '</label>' +
            '<label class="detalle_idproducto">' + detalle[i]['IDPRODUCTO'] + '</label>',
            '<label class="index font-12" >' + (i + 1) + '</label>',
            //(detalle[i].detallecotizacion.idproductoproveedor === 0) ? detalle[i].detallecotizacion.producto.idproducto :
            //    agregartabla(detalle[i].detallecotizacion.producto.idproducto, detalle[i].detallecotizacion.idproductoproveedor),
            '<label class="detalle_codigoproducto">' + detalle[i]['CODPRODUCTO'] + '</label>' + (detalle[i]['CODPROPOROV'] != '' ? '</br><label>' + detalle[i]['CODPROPOROV'] + '</label>' : ''),
            detalle[i]['COD_BARRA'],
            '<label class="detalle_producto">' + detalle[i]['PRODUCTO'] + '</label> ' + (detalle[i]['CODPROPOROV'] != '' ? '</br><label>' + detalle[i]['PROPROV'] + '</label>' : ''),
            detalle[i]['TIPOPRODUCTO'],
            detalle[i]['LABORATORIO'],
            '<label class="dettalle_cantidadoc">' + detalle[i]['CANTIDADOC'] + '</label></br><label>' + (detalle[i]['CANTIDADPROVEEDOR'] === undefined ? '' : detalle[i]['CANTIDADPROVEEDOR']) + '</label>',
            '<label>' + detalle[i]['UMA'] + '</label></br><label>' + detalle[i]['UMP'] + '</label>',
            '<input type="number"  class="text-center txtcantfac inputdetalle" min="0"   value="' + detalle[i]['CANFACTURA'] + '" ' + inputdisablecanfac + ' />',
            '<input type="number" class="text-center txtcanting inputdetalle" min="0"  value="' + detalle[i]['CANINGRESADA'] + '"   disabled  />',
            '<input type="number" class="text-center txtcantdev inputdetalle" min="0"  value="' + detalle[i]['CANDEVUELTA'] + '" ' + inputdisablecandev + '   />',
            '<span class="tipoitem font-10">' + detalle[i]['TIPO INGRESO'] + '</span>',
            //'<span class="detalle_equivalencia" style="display:none">' + parseInt(VALORFACTOR) + '</span >',
            /*(detalle[i]['TIPO INGRESO'] == 'DEVOLUCION' || *//*detalle[i]['TIPO INGRESO'] == 'BON. FUERA DOC.') ? '' : */
            '<input type="button" class="btnfechalote" name="name" value="....." />',
            /*(detalle[i]['TIPO INGRESO'] == 'DEVOLUCION' || *//*detalle[i]['TIPO INGRESO'] == 'BON. FUERA DOC.') ? '' : */
            '<input type = "button" class= "btnembalaje" name = "name" value = "....." />',
            '<label class="detalle_iduma" style="width=0px; font-size:0px;">' + IDUMAMOD2 + ',' + VALORFACTOR2 + '</label>',
            '<label class="detalle_idumabase" style="width=0px; font-size:0px;">' + IDUMABASE + ',' + VALORFACTOR + '</label>',
        ]).draw(false).node();
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
        $(auxtfila).attr({ 'idcotizacion': detalle[i]['IDDETALLECOTIZACION'] });
        if (detalle[i]['TIPO INGRESO'].includes('BONIFICACION'))
            $(auxtfila).find('td').attr({ 'style': 'color:blue; font-weight:bold' });
        if (detalle[i]['TIPO INGRESO'] === 'DEVOLUCION')
            $(auxtfila).find('td').attr({ 'style': 'color:red; font-weight:bold' });
        if (detalle[i]['TIPO INGRESO'] === 'BON. FUERA DOC.')
            $(auxtfila).find('td').attr({ 'style': 'color:#678497; font-weight:bold' });
        $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });
        try {

            var lotes = (detalle[i]['LOTES']);
            if (lotes === null)
                _LOTESPORPRODUCTO[i] = [];
            else
                _LOTESPORPRODUCTO[i] = lotes;

            _CONDICIONEMBALAJE[i] = detalle[i]['EMBALAJE'];

        } catch (e) { _LOTESPORPRODUCTO[i] = []; console.log('error lotes'); }
    }
    tbllista.columns.adjust().draw();

    $('#modalordencompra').modal('hide');
    DESBLOQUEARCONTENIDO('form-registro');
}
function buscarordencompra(codigo) {
    let controller = new OrdenCompraController();
    var obj = { id: codigo, tipo: 'PREINGRESO' };
    controller.BuscarOrdenCompraMasBonificaciones(obj, fnCargarOrdenCompra);

}
function fnCargarOrdenCompra(data) {
    fnlimpiar();
    txtidpreingreso.val(0);
    txtcodigopreingreso.val("");
    var cabecera = JSON.parse(data[0]['CABECERA']);
    var detalle = JSON.parse(data[0]['DETALLE']);

    if (txtidproveedor.val() === '' || txtidproveedor.val() === '0') {
        ARRAYORDENES.push(cabecera['ID']);
        pasarOrdenCompraVista(cabecera, detalle);
        $('#modalordencompra').modal('hide');
    } else {
        swal('¿DESEA CARGAR LOS DATOS DE LA ORDEN?', "SE SOBREESCRIBIRA LA ORDEN ANTERIOR", {
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
        }).then((Delete) => {
            if (Delete) {

                //if (txtidproveedor.val() === cabecera['ID PROVEEDOR'].toString()) {
                ARRAYORDENES.push(cabecera['ID']);
                pasarOrdenCompraVista(cabecera, detalle);
                $('#modalordencompra').modal('hide');
                //}
                //else
                //    alertaSwall('W', 'ADVERTENCIA', 'LA ORDEN PERTENECE A OTRO PROVEEDOR');
            } else {
                swal.close();
            }
        });
    }
}
function pasarOrdenCompraVista(cabecera, detalle) {
    cabecera = cabecera[0];
    txtcodigoorden.val(cabecera['CODIGO']);
    txtidorden.val(cabecera['ID']);
    txtfechaorden.val(cabecera['FECHA']);
    txtestadoorden.val(cabecera['ESTADO']);
    txtruc.val(cabecera['PRO_RUC']);
    txtrazonsocial.val(cabecera['PRO_RAZONSOCIAL']);
    txttipomoneda.val(cabecera['MONEDA']);
    txtcot.val(cabecera['MONEDA CAMBIO']);
    txtcondicionpago.val(cabecera['CONDICION PAGO']);
    txtidproveedor.val(cabecera['ID PROVEEDOR']);
    txtquimico.val(cabecera['QUIMICO']);
    fnListarAlmacenPorSucursal(cabecera['IDSUCURSAL DESTINO'], cabecera['IDALMACEN']);
    tbllista.clear().draw(false);
    for (var i = 0; i < detalle.length; i++) {
        //if (detalle[i]['TIPO INGRESO'] != 'BONIFICACION INAFECTO') {
        if (detalle[i]['TIPO INGRESO'].includes('BONIFICACION')) detalle[i]['DESCRIPCION_PROD_QF'] += " BONIF";
        //FSILVARI - INICIO
        CODPRO = detalle[i]['COD_PROD_QF'];
        IDUMA = detalle[i]['UMA-ID'];

        var arrayFactor = detalle[i]['FACTOR'];
        var cadenaSeprada = arrayFactor.split('-');
        var arrayFactor2 = detalle[i]['FACTOR2'];
        var cadenaSeprada2 = arrayFactor2.split('-');

        IDUMABASE = cadenaSeprada[0];
        VALORFACTOR = parseFloat(cadenaSeprada[1]);

        IDUMAMOD2 = cadenaSeprada2[0];
        VALORFACTOR2 = parseFloat(cadenaSeprada2[1]);

        var auxtfila = tbllista.row.add([
            '<label class="detalle_iddetalle">' + detalle[i]['IDTABLADETALLE'] + '</label>' +
            '<label class="detalle_iddetallepreingreso"></label>' +
            '<label class="detalle_idfactura"></label>' +
            '<label class="detalle_idproducto">' + detalle[i]['IDPRODUCTO'] + '</label>',
            '<label class="index font-12">' + (i + 1) + '</label>',
            '<label class="detalle_codigoproducto">' + detalle[i]['COD_PROD_QF'] + '</label>' + (detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '</br><label>' + detalle[i]['COD_PRO_PROVEEDOR'] + '</label>' : ''),
            detalle[i]['COD_BARRA'],
            '<label class="detalle_producto">' + detalle[i]['DESCRIPCION_PROD_QF'] + '</label> ' + (detalle[i]['COD_PRO_PROVEEDOR'] != '' ? '</br><label>' + detalle[i]['DESCRIPCION_PRO_PROVEEDOR'] + '</label>' : ''),
            detalle[i]['TIPO PRODUCTO'],
            detalle[i]['LABORATORIO'],
            '<label class="dettalle_cantidadoc">' + detalle[i]['CANTIDAD'] + '</label>' + (detalle[i]['COD_PRO_PROVEEDOR'] != '' ? ('</br><label>' + detalle[i]['EQUIVALENCIA'] + '</label>') : ''),
            '<label>' + detalle[i]['UMA-DES'] + '</label></br><label>' + detalle[i]['UMP-DES'] + '</label>',
            '<input type="number"  class="text-center txtcantfac inputdetalle" min="0"   value=""  />',//+ detalle[i]['CANTIDAD'] + 
            '<input type="number" class="text-center txtcanting inputdetalle" min="0"  disabled  />',
            '<input type="number" class="text-center txtcantdev inputdetalle" min="0"   value="" />',
            '<span class="tipoitem font-10">' + detalle[i]['TIPO INGRESO'] + '</span>',
            /*            '<label class="detalle_equivalencia" style="display:none">' + VALORFACTOR + '</label >',*/
            //'<span></br></span>',
            //'<span class="idumabase" style="display:none">' + IDUMABASE + '</span>',
            //'<span class="equivalencia" style="display:none">' + EQUIVALENCIA + '</span>',
            /*(detalle[i]['TIPO INGRESO'] == 'DEVOLUCION' || *//*detalle[i]['TIPO INGRESO'] == 'BON. FUERA DOC.') ? '' : */
            '<input type="button" class="btnfechalote" name="name" value="....." />',
            /*(detalle[i]['TIPO INGRESO'] == 'DEVOLUCION' || *//*detalle[i]['TIPO INGRESO'] == 'BON. FUERA DOC.') ? '' :*/
            ' <input type="button" class="btnembalaje" name="name" value="....." />',
            '<label class="detalle_iduma" style="width:0px; font-size:0px;">' + IDUMAMOD2 + ',' + VALORFACTOR2 + '</span>',
            '<label class="detalle_idumabase" style="width:0px; font-size:0px;">' + IDUMABASE + ',' + VALORFACTOR + '</label>',

            ]).draw(false).node();
            $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
            $(auxtfila).attr({ 'idcotizacion': detalle[i]['IDDETALLECOTIZACION'] });

            if (detalle[i]['TIPO INGRESO'].includes('BONIFICACION'))
                $(auxtfila).find('td').attr({ 'style': 'color:blue; font-weight:bold' });
            if (detalle[i]['TIPO INGRESO'] === 'DEVOLUCION')
                $(auxtfila).find('td').attr({ 'style': 'color:red; font-weight:bold' });
            if (detalle[i]['TIPO INGRESO'] === 'BON. FUERA DOC.')
                $(auxtfila).find('td').attr({ 'style': 'color:red; font-weight:bold' });

        $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });
            _LOTESPORPRODUCTO[i] = [];
            _CONDICIONEMBALAJE[i] = [];
            //ORDENITEMSAPROBARFACTURA[i] = [];
      //}
     
    }
    tbllista.columns.adjust().draw();
    fnInicializarCondicionEmbalajeDeItems(detalle.length);
    fnverificarcantidadesdetalle();
}

function fnListarAlmacenPorSucursal(idsucursal, idseleccion) {
    let controller = new AlmacenSucursalController();
    controller.ListarAlmacenxSucursal('cmbalmacen', idsucursal, idseleccion, function () {
        if ($("#cmbalmacen").value != '') {
            //$("#cmbalmacen option:contains(CUARENTENA PT)").attr('selected', true);
            var options = document.getElementById('cmbalmacen').getElementsByTagName('option');
            for (var i = 0; i < options.length; i++) {
                var e = options[i];
                if (!(e.innerText.includes("CUARENTENA"))) {
                    e.setAttribute("hidden", "");
                }
                if (e.getAttribute('idareaalmacen') == '10000')//cuarentena
                    e.selected = true;
            }
            var optgroup = document.getElementById('cmbalmacen').getElementsByTagName('optgroup');
            for (var i = 0; i < optgroup.length; i++) {
                var e = optgroup[i];
                if (!(e.innerText.includes("CUARENTENA"))) {
                    e.setAttribute("hidden", "");
                }
            }
        }
    });
}
function obtenerDetalle() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    var respuesta = new Object();
    var array = [];
    var valor_convert = 0.00;

    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var calculo = 0.00;
        var valorFactor = 0.00;
        var valorFactorBase = 0.00;
        var valorFactorMod = 0.00;
        var idProdBase = 0;
        var idProdMod = 0;

        var cantidad = parseFloat(document.getElementsByClassName("txtcanting")[c].value);
        //var arrayFactorBase = document.getElementsByClassName('detalle_idumabase')[c].innerHTML;
        //var arrayFactorMod = document.getElementsByClassName('detalle_iduma')[c].innerHTML;

        //var cadenaSeparada = arrayFactorBase.split(',');
        //var cadenaSeparada2 = arrayFactorMod.split(',');
        //idProdBase = cadenaSeparada[0];
        //idProdMod = cadenaSeparada2[0];

        //if (idProdBase == idProdMod) {
        //    valorFactor = parseFloat(cadenaSeparada[1]);
        //}
        //else {
        //    valorFactor = parseFloat(cadenaSeparada2[1]);
        //}
        ////SE REALIZA EL CALCULO EQUIVALENCIA
        //calculo = (cantidad * valorFactor);
        //if (calculo == 0 || isNaN(calculo)) calculo = "";
        //else calculo = parseFloat(calculo).toFixed(0);


        var index = parseInt(document.getElementsByClassName("index")[c].innerHTML);
        respuesta = new PIDetallePreingreso();
        respuesta.iddetalle = FN_GETDATOHTML(datatable[c][0], 'detalle_iddetalle');
        var idfactura = FN_GETDATOHTML(datatable[c][0], 'detalle_idfactura');
        if (idfactura === 0 || idfactura === '0')
            respuesta.idfactura = '';
        else
            respuesta.idfactura = idfactura;
        respuesta.idpreingreso = (txtidpreingreso.val() === '') ? 0 : txtidpreingreso.val();
        respuesta.iddetallepreingreso = (FN_GETDATOHTML(datatable[c][0], 'detalle_iddetallepreingreso') === '') ? 0 : FN_GETDATOHTML(datatable[c][0], 'detalle_iddetallepreingreso');
        respuesta.idproducto = FN_GETDATOHTML(datatable[c][0], 'detalle_idproducto');
        respuesta.cantoc = document.getElementsByClassName('dettalle_cantidadoc')[c].innerHTML;
        respuesta.cantfactura = document.getElementsByClassName("txtcantfac")[c].value;
        respuesta.cantingresada = document.getElementsByClassName("txtcanting")[c].value;
        //respuesta.cantingresada = calculo; //IDUMABASE == IDUMA ? calculo : parseFloat(calculo).toFixed(6);//fsilvari
        respuesta.cantdevuelta = document.getElementsByClassName("txtcantdev")[c].value;
        respuesta.estado = 'HABILITADO';
        respuesta.tipo = document.getElementsByClassName("tipoitem")[c].innerHTML;
        respuesta.idcotizacionbonfi = e.getAttribute('idcotizacion');
        respuesta.iddetallecotizacionbonificacion = (FN_GETDATOHTML(datatable[c][0], 'iddetallecotizacionbonificacion') === '') ? 0 : FN_GETDATOHTML(datatable[c][0], 'iddetallecotizacionbonificacion');
        respuesta.lotes = _LOTESPORPRODUCTO[index - 1];
        respuesta.embalaje = _CONDICIONEMBALAJE[index - 1];
        let objOrden = ArrayORDENITEMSAPROBARFACTURA.get(FN_GETDATOHTML(datatable[c][4], 'detalle_producto'));
        respuesta.ordenItemsAprobarFactura = objOrden;
        array[c] = respuesta;
        c++;
    });
    return array;
}
function ActualizarOrdenCompra() {
    var url = ORIGEN + "/PreIngreso/PIPreingreso/ActualizarOrdenCompraAplicada";
    if (ARRAYORDENES.length > 0) {
        var obj = { ordenes: ARRAYORDENES };
        $.post(url, obj).done(function (data) {
            console.log(data + " ordenes actualizadas");
            ARRAYORDENES = [];
        }).fail(function (data) {
            console.log(data);
        });
    }
}
function fnverificarcantidadesdetalle() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var index = e.cells[0].innerText;
        var tipoproducto = e.cells[4].innerText;
        var indiceBusquedaArray = arrayECParaValidacion.filter(x => x == index);
        var cantfac = parseInt(document.getElementsByClassName("txtcantfac")[c].value);
        var cantdev = parseInt(document.getElementsByClassName("txtcantdev")[c].value);
        var res = (isNaN(cantfac) ? 0 : cantfac) - (isNaN(cantdev) ? 0 : cantdev);
        if (res === 0 && document.getElementsByClassName("txtcantfac")[c].value === '')
            res = '';
        document.getElementsByClassName("txtcanting")[c].value = res;
     
        try {//cambiar colores1        
            var txtcanting = e.getElementsByClassName('txtcanting')[0];  
            var txtcantdev = e.getElementsByClassName('txtcantdev')[0];  
            var cantoc = e.getElementsByClassName('dettalle_cantidadoc')[0];
            var fila = txtcanting.parentNode;
            //colores de txt
            if (parseFloat(cantoc.innerText) == parseFloat(res)) {
                fila.classList.remove('bg-danger');
                fila.classList.remove('bg-warning');
                fila.classList.add('bg-success');
            }
            else if (parseFloat(cantoc.innerText) > parseFloat(res)) {
                fila.classList.remove('bg-success');
                fila.classList.remove('bg-warning');
                fila.classList.add('bg-danger');
            }
            else if (parseFloat(cantoc.innerText) < parseFloat(res)) {
                fila.classList.remove('bg-success');
                fila.classList.remove('bg-danger');
                fila.classList.add('bg-warning');
            } else {
                fila.classList.remove('bg-success');
                fila.classList.remove('bg-danger');
                fila.classList.remove('bg-warning');  
            }
            //colores de buton de lote
            var btnlote = e.getElementsByClassName('btnfechalote')[0];
            var cantingreso = parseFloat(txtcanting.value);
            var cantdevVal = parseFloat(txtcantdev.value);
            var cantidad = 0;
            cantidad = cantingreso;
            btnlote.classList.add('btn');
            var index = e.getElementsByClassName('index')[0].innerText;
            var cantlote = fnSumarCantidadLotesIngresadosxProducto(parseInt(index) - 1);
            if (cantlote == cantidad) {
                if (_LOTESPORPRODUCTO[index - 1].length > 0) {
                    if (_LOTESPORPRODUCTO[index - 1][0].lote != "") {
                        btnlote.classList.remove('btn-warning');
                        btnlote.classList.remove('btn-danger');
                        btnlote.classList.add('btn-success');
                    } else {
                        btnlote.classList.remove('btn-warning');
                        btnlote.classList.remove('btn-success');
                        btnlote.classList.add('btn-danger');
                    }
                } else {
                    btnlote.classList.remove('btn-warning');
                    btnlote.classList.remove('btn-success');
                    btnlote.classList.add('btn-danger');
                }
            } else if (cantidad > cantlote) {
                btnlote.classList.remove('btn-warning');
                btnlote.classList.remove('btn-success');
                btnlote.classList.add('btn-danger');
            }
            else if (cantidad < cantlote) {
                btnlote.classList.remove('btn-success');
                btnlote.classList.remove('btn-danger');
                btnlote.classList.add('btn-warning');
            } else {
                btnlote.classList.remove('btn-success');
                btnlote.classList.remove('btn-danger');
                btnlote.classList.remove('btn-warning');
            }

            //Para Economato
            if (tipoproducto == "EC" || tipoproducto == "SV") {
                if (indiceBusquedaArray.length > 0) {
                    btnlote.classList.remove('btn-warning');
                    btnlote.classList.remove('btn-danger');
                    btnlote.classList.add('btn-success');
                }
            }
        } catch (error) {
            console.log(error);
        }
      
        c++;
    });
}

function fnvericarlotesproductoregistrar() {
    fnverificarcantidadesdetalle();
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;    
    var res = true;
    filas.forEach(function (e) {
        try {
            var btnlote = e.getElementsByClassName('btnfechalote')[0];
            var index = e.getElementsByClassName('index')[0].innerText;
            var cantlote = fnSumarCantidadLotesIngresadosxProducto(parseInt(index) - 1);
            if (btnlote.classList.contains('btn-warning') || btnlote.classList.contains('btn-danger')) {
                mensaje('I', 'La cantidad ingresada del item ' + index + ' no coincide con la cantidad ' + cantlote + ' ingresada en el lote ', '', 4000);
                res = false;
            }
        } catch (e) {
            console.log(e);
        }
       
    });
    return res;
}
//EARTCOD1015//
function fnbuscarCotizacion(idcotidetalle) {
    let controller = new CotizacionController();
    controller.GetBonificacionDetalleCotizacion(idcotidetalle, function (data) {
        var ok = false;
        if (data != null)
            for (var i = 0; i < data.length; i++) {
                if (data[i].tipo == 'INAFECTO')
                    ok = true;
            }
        if (ok) {
            btnbonifueradocumento.classList.remove('btn-outline-secondary');
            btnbonifueradocumento.classList.add('btn-secondary');
        } else {
            btnbonifueradocumento.classList.remove('btn-secondary');
            btnbonifueradocumento.classList.add('btn-outline-secondary');
        }
    });
}
$(document).on('click', '.txtcantfac', function (e) {
    var cantfact = $(this).parents("tr").find('.txtcantfac').val();
    var cantoc = $(this).parents("tr").find('.dettalle_cantidadoc').text();
    var cantdev = parseFloat(cantoc)-parseFloat(cantfact);
    if (cantdev < 0)
        $(this).parents("tr").find('.txtcantdev').val(-1 * cantdev);
    else
        $(this).parents("tr").find('.txtcantdev').val('');
    //$(this).parents("tr").find('.txtcanting').val(cantfact);
    var cantdev = $(this).parents("tr").find('.txtcantdev').val();
    if (isNaN(cantdev) || cantdev.length === 0)
        cantdev = 0;
    var res = parseInt(cantfact) - parseInt(cantdev);
    $(this).parents("tr").find('.txtcanting').val(res);
    fnverificarcantidadesdetalle();
    
});
$(document).on('keyup', '.txtcantfac', function (e) {
    var cantfact = $(this).parents("tr").find('.txtcantfac').val();
    var cantoc = $(this).parents("tr").find('.dettalle_cantidadoc').text();
    var cantdev = parseFloat(cantoc)-parseFloat(cantfact);
    if (cantdev < 0)
        $(this).parents("tr").find('.txtcantdev').val(-1 * cantdev);
    else
        $(this).parents("tr").find('.txtcantdev').val('');
    //$(this).parents("tr").find('.txtcanting').val(cantfact);
    var cantdev = $(this).parents("tr").find('.txtcantdev').val();
    if (isNaN(cantdev) || cantdev.length === 0)
        cantdev = 0;
    var res = parseInt(cantfact) - parseInt(cantdev);
    $(this).parents("tr").find('.txtcanting').val(res);
    fnverificarcantidadesdetalle();
});
$(document).on('click', '.txtcantdev', function (e) {
    var cantfact = $(this).parents("tr").find('.txtcantfac').val();
    var cantdev = $(this).parents("tr").find('.txtcantdev').val();
    if (isNaN(cantdev) || cantdev.length === 0)
        cantdev = 0;
    //$(this).parents("tr").find('.txtcantdev').val(cantdev); 
    var res = parseInt(cantfact) - parseInt(cantdev);
    if (res >= 0)
        $(this).parents("tr").find('.txtcanting').val(res);
    //verificar si tiene ingreso 
    var txtcantfactura = $(this).parents("tr").find('.txtcantfac');
    if (isNaN(res) || $(this).parents("tr").find('.txtcanting').val() === '')
        if (cantdev > 0)
            txtcantfactura.val(cantdev);
    fnverificarcantidadesdetalle();
});
$(document).on('keyup', '.txtcantdev', function (e) {

    var cantfact = $(this).parents("tr").find('.txtcantfac').val();
    var cantdev = $(this).parents("tr").find('.txtcantdev').val();
    if (isNaN(cantdev) || cantdev.length === 0)
        cantdev = 0;
    //$(this).parents("tr").find('.txtcantdev').val(cantdev); 
    var res = parseInt(cantfact) - parseInt(cantdev);
    if (res >= 0)
        $(this).parents("tr").find('.txtcanting').val(res);
    //verificar si tiene ingreso 
    var txtcantfactura = $(this).parents("tr").find('.txtcantfac');
    if (isNaN(res) || $(this).parents("tr").find('.txtcanting').val() === '')
        if (cantdev > 0)
            txtcantfactura.val(cantdev);
    fnverificarcantidadesdetalle();
});

//EARTCOD1015//
$(document).on('click', '.btnfechalote', function () {
    var columna = tbllista.row($(this).parents('tr')).data();
    if (columna[5] == "EC" || columna[5] == "SV") {
        ORDENITEMSAPROBARFACTURA += 1;
        var nombreproducto = FN_GETDATOHTML(columna[4], 'detalle_producto');
        var index = FN_GETDATOHTML(columna[1], 'index');
        ArrayORDENITEMSAPROBARFACTURA.set(nombreproducto, ORDENITEMSAPROBARFACTURA);
        arrayECParaValidacion.push(index);
        fnverificarcantidadesdetalle();
        //var btnlote = e.getElementsByClassName('btnfechalote')[0];
        //btnlote.classList.remove('btn-warning');
        //btnlote.classList.remove('btn-danger');
        //btnlote.classList.add('btn-success');
    } else {
        var index = $(this).parents("tr").find('.index').text();
        var cantfactura = $(this).parents("tr").find('.txtcantfac').val();
        if (!(parseFloat(cantfactura) > 0))
            return;

        index = parseInt(index);

        var canting = $(this).parents("tr").find('.txtcanting').val();
        var cantdev = $(this).parents("tr").find('.txtcantdev').val();
        var totalfactura = 0;

        if (canting == 0 && cantdev > 0) totalfactura = 0;
        else totalfactura = canting;

        var iddetalle = FN_GETDATOHTML(columna[0], 'detalle_iddetallepreingreso');
        txtidedetallemodallotes.val(iddetalle);
        txtindexlote.val(index);
        txtcantidadtotalmodallote.val(totalfactura);
        txtcantidadrestantelote.val(0);
        let controller = new ProductoController();
        var idproducto = FN_GETDATOHTML(columna[0], 'detalle_idproducto');
        var codigoproducto = FN_GETDATOHTML(columna[2], 'detalle_codigoproducto');
        var producto = FN_GETDATOHTML(columna[4], 'detalle_producto');
        controller.BuscarProductoRegSanFecVenLote(idproducto, function (data) {

            if (data.length == 0 || data.length == null || data == "[]") {
                data = '[{"nombre": "' + producto + '","codigoproducto": "' + codigoproducto + '","aceptalote":true,"aceptafechavence":true,"aceptaregsanitario":true,"idproducto": "' + idproducto + '","lote":"","fechavencimiento":"","regsanitario":""}]';
            }
            var data = JSON.parse(data);
            PRODUCTOLOTE = data[0];
            var lote = [];
            var itemarray = _LOTESPORPRODUCTO[index - 1];
            lote = itemarray;
            if (lote.length === 0) {
                lote[0] = (new PILote());
                lote[0].producto = producto;
                lote[0].cantidad = 0;
            }
            else
                for (var i = 0; i < lote.length; i++) {
                    lote[i].producto = producto;
                }
            $('#modalfechaylote').modal('show');

            agregarItemTablaLotes(lote, PRODUCTOLOTE);

        });
    }
});



btnanular.click(function (e) {
    //var id = txtidpreingreso.val();
    //fnListarFacturasPreingreso_paraAnular(id);
    fnLlenarTablaFacturas(facturaGlobal, "Anular");
    $('#modalfacturapreingreso').modal('show');
});
$(document).on('click', '.btnAnularDesdeModalFacturaPreIngreso', function (e) {
    var columna = $(this).parents('tr').find('td');
    var id = txtidpreingreso.val();
    var idfactura = parseInt(columna[0].innerText);
    let controller = new PreingresoController();
    controller.AnularPreingreso(id, idfactura, function (idpre) {
        fnBuscarPreingresoCompleto(idpre);
    });
    //fnListarFacturasPreingreso_paraAnular(id);
    $('#modalfacturapreingreso').modal('hide');
});

//item devolucion
$('#btnadditendevolucion').click(function (e) {
    AI_lbltipodeitem.text("DEVOLUCION");
    vermodaladditem();
});

$('#formadditem').submit(function (e) {
    e.preventDefault();
    var obj = $('#formadditem').serializeArray();
    var numitems = tbllista.rows().data().length;

    var cantidadoc = 0;
    var tipo = "";
    var cantidadING = 0;
    var cantidadDEV = 0;
    var styleRow = "";
    if (AI_lbltipodeitem.text() === 'DEVOLUCION') {
        tipo = AI_lbltipodeitem.text();
        cantidadDEV = AI_txtcantidad.val();
        styleRow = "color:red; font-weight:bold"
    }
    else if (AI_lbltipodeitem.text() === 'BONIFICACIÓN FUERA DE DOCUMENTO') {
        cantidadoc = AI_txtcantidad.val();
        tipo = "BONIFICACION " + AI_txttipobonificacion.val();
        cantidadING = AI_txtcantidad.val();
        styleRow = "color:blue; font-weight:bold";
    }

    var auxtfila = tbllista.row.add([
        '<label class="detalle_iddetalle"></label>' +
        '<label class="detalle_iddetallepreingreso">0</label>' +
        '<label class="detalle_idfactura">0</label>' +
        '<label class="iddetallecotizacionbonificacion">' + iIdDetalleCotizacionDetalle + '</label>' + 
        '<label class="detalle_idproducto">' + AI_txtid.val() + '</label>',
        '<label class="index" >' + (numitems + 1) + '</label>',
        '<label class="detalle_codigoproducto">' + AI_txtcodigo.val() + '</label>',
        '<label></label>',//CODIGO DE BARRA
        '<label class="detalle_producto">' + AI_txtproducto.val() + '</label>',
        AI_txttipo.val(),
        AI_txtlaboratorio.val(),
        '<label class="dettalle_cantidadoc">' + cantidadoc + '</label>',
        '<label>' + AI_txtuma.val() + '</label>',
        '<input type="number"  class="text-center txtcantfac inputdetalle" min="0"   value="' + AI_txtcantidad.val() + '" />',
        '<input type="number" class="text-center txtcanting inputdetalle" min="0"  value="' + cantidadING + '"   disabled  />',
        '<input type="number" class="text-center txtcantdev inputdetalle" min="0"  value="' + cantidadDEV + '" />',
        '<span class="tipoitem">' + tipo + '</span>',
        '<input type="button" class="btnfechalote" name="name" value="....." />',
        '<input type = "button" class="btnembalaje" name="name" value="....." />' + 
        '<button type = "button" class="btnquitarbonificacion btn-danger"><i class="fas fa-trash"></i></button>',
    ]).draw(false).node();
    $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    $(auxtfila).find('td').attr({ 'style': styleRow });
    _LOTESPORPRODUCTO.push([]);

    txtCEindex.value = numitems;
    _CONDICIONEMBALAJE[numitems] = [];
    fnCEcargarembalajesproducto(_CONDICIONEMBALAJE[numitems]);
    guardarDatosPorDefectoEnArray();

    ocultarmodaladditem();
    limpiarmodaladditem();
});

//item boni fuera documento
$('#btnbonifueradocumento').click(function (e) {
    if (bIsOrden) {
        AI_lbltipodeitem.text("BONIFICACIÓN FUERA DE DOCUMENTO");
        vermodaladditem();
    } else {
        mensaje("W", "Seleccione el item al cual se le aplicará la bonificación.");
    }
});

//FACTURAS
btnverfacturas.addEventListener('click', function () {
    //var id = txtidpreingreso.val();
    //fnListarFacturasPreingreso(id);
    fnLlenarTablaFacturas(facturaGlobal, "Ver");
    $('#modalfacturapreingreso').modal('show');
});

btnnuevafactura.addEventListener('click', function () {
    cardfactura.classList.remove('deshabilitartodo');
    txtnumdoc.val('');
    txtnumdoc2.val('');
    txtfechadoc.val('');
    txtfechadoc.val('');
    txtidfactura.val('');
});
$(document).on('click', '.btnseleccionarfactura', function () {
    var columna = $(this).parents('tr').find('td');
    var numdocumento = columna[1].innerHTML;
    var fecha = columna[2].innerHTML;
    
    txtidfactura.val(columna[0].innerText);
    txtnumdoc.val(numdocumento.substring(0, 4));
    txtnumdoc2.val(numdocumento.substring(4, numdocumento.length));
    txtfechadoc.val(moment(fecha).format('YYYY-MM-DD'));
    $('#modalfacturapreingreso').modal('hide');
});

$(document).on('click', '#btnimprimir', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PREINGRESO COMPLETO');
});
$(document).on('mousewheel', '.txtcantfac', function (e) {
    this.blur();
});
$(document).on('mousewheel', '.txtcantdev', function (e) {
    this.blur();
});
btnnuevo.addEventListener('click', function () {
    location.href = ORIGEN + "/PreIngreso/PIPreingreso/Registrar";
});
var bIsOrden = false;
var iIdDetalleCotizacionDetalle = 0;
$('#tbllista tbody').on('click', 'tr', function () {
    try {
        var idcotizacion = this.getAttribute('idcotizacion');
        iIdDetalleCotizacionDetalle = idcotizacion;
        var sTipo = this.cells[11].innerText;
        if (sTipo.includes("ORDENCOMPRA"))
            bIsOrden = true;
        else
            bIsOrden = false;

        fnbuscarCotizacion(idcotizacion);
    } catch (e) {

    }
   
});
$(document).on('click', '.btnquitarbonificacion', function (e) {

    var row = tbllista.row($(this).parents('tr')).data();
    tbllista.row('.selected').remove().draw(false);
});
btnmostrarguiadevolucion.addEventListener('click', function () {
    fnabrirmodalguiadevolucion();
});
function fnabrirmodalguiadevolucion() {
    if (txtidfactura.val() == '') {
        mensaje('I', 'Registre el preingreso o seleccione la factura');
        return;
    }
    var obj = { tipo: 'factura', idtabla: txtidfactura.val() };
   
    fnRDGgetdevolucioncompleta(obj);
}
var popupbonificacionfueradoc = null;
//Comentado 18/10/2022
//btnbonifueradocumento.addEventListener('click', function () {
//    //CAMBIOS SEMANA2
//    var txtiding = txtidpreingreso.val();
//    if (txtiding != '' && btnbonifueradocumento.classList.contains('btn-outline-secondary')) {
//        console.log(txtidfactura.val());
//        if (popupbonificacionfueradoc == null || popupbonificacionfueradoc.closed) {
//            popupbonificacionfueradoc = window.open(ORIGEN + "/PreIngreso/PIPreingreso/BonificacionFueraDocumento", "Bonificación fuera de documento", "width=1100,height=600,Titlebar=NO,Toolbar=NO");
//            popupbonificacionfueradoc.addEventListener('DOMContentLoaded', function () {
//                popupbonificacionfueradoc.fnbuscarfacturabonificacion(txtidfactura.val());

//            });
//            popupbonificacionfueradoc.focus();
//        }
//        else {
//            popupbonificacionfueradoc.addEventListener('DOMContentLoaded', function () {
//                popupbonificacionfueradoc.fnbuscarfacturabonificacion(txtidfactura.val());

//            });
//            popupbonificacionfueradoc.focus();
//        }
//    }
   
//});
$(document).on('click', '.btnembalaje', function () {
    $('#modalcondicionembalaje').modal('show');
    var fila = this.parentNode.parentNode;
    var index = parseInt(fila.getElementsByClassName('index')[0].innerText);
    txtCEindex.value = index - 1;
    checkCEtodos.checked = false;
    fnCEcargarembalajesproducto(_CONDICIONEMBALAJE[index-1]);
});

function fnInicializarCondicionEmbalajeDeItems(numDeDetalles) {
    for (var i = 0; i < numDeDetalles; i++) {
        txtCEindex.value = i;
        fnCEcargarembalajesproducto(_CONDICIONEMBALAJE[i]);
        guardarDatosPorDefectoEnArray();
    }
}

$(document).on('click', '#txtruc', function (e) {
    $('#modalproveedores').modal('show');
});
$(document).on('click', '#txtrazonsocial', function (e) {
    $('#modalproveedores').modal('show');
});

$(document).on('click', '.btnpasarproveedor', function (e) {
    var columna = tblproveedores.row($(this).parents('tr')).data();
    txtidproveedor.val(columna[0]);
    buscarproveedor(columna[0]);
    $('#modalproveedores').modal('hide');
});

function buscarproveedor(id) {
    let controller = new ProveedorController();
    controller.BuscarProveedor(id, function (data) {
        txtidproveedor.val(data.idproveedor);
        txtruc.val(data.ruc);
        txtrazonsocial.val(data.razonsocial);
    });

}

$('#txtcodigobarra').on('keyup', function () {
    var codigo = $("#txtcodigobarra").val();
    var tamanio = tbllista.rows().data().length;
    if (tamanio > 0 && codigo.length > 7) {
        var rows = $("#tbllista").dataTable().fnGetNodes();
        for (var i = 0; i < rows.length; i++) {
            if ($("#txtcodigobarra").val() == tbllista.row(i).data()[3]) {
                var valor = parseFloat(tbllista.cell(i, 9).nodes().to$().find('input').val());
                if (valor == null || isNaN(valor) || valor == undefined)
                    valor = 0;
                tbllista.cell(i, 9).nodes().to$().find('input').val(valor + 1);

                fnverificarcantidadesdetalle();
                $("#txtcodigobarra").val("");
                $("#txtcodigobarra").focus();
            }
        }

    }

});