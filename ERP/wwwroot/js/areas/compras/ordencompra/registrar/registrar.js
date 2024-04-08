var txtcodigoproveedor = $('#codigoproveedor');
var txtrazonproveedor = $('#razonproveedor');
var btnnext1 = $('#next1');
var btnnext2 = $('#next2');
var btnback1 = $('#back1');
var btnback2 = $('#back2');
var _arrayCotizaciones = [];
var _arraydelete = [];

var tbllista;
var btnguardar = $('#btnguardar');
var btnnuevo = document.getElementById('btnnuevo');
var btnProformaRequerimiento = document.getElementById('btnProformaRequerimiento');
var cmbOrdenPor = document.getElementById('cmbOrdenPor');

var txtidproveedor = $('#txtidproveedor');
var txtrucproveedor = $('#txtrucproveedor');
var txtrazonsocial = $('#txtrazonsocial');
var txttelefonoproveedor = $('#txttelefonoproveedor');
var cmbicoterms = $('#cmbicoterms');

var txtnombrescontacto = $('#txtnombrescontacto');
var txttelefonocontacto = $('#txttelefonocontacto');
var txtcelularcontacto = $('#txtcelularcontacto');
var txtobservacion = $('#txtobservacion');

var txtnombresrepresentante = $('#txtnombresrepresentante');
var txttelefonorepresentante = $('#txttelefonorepresentante');
var txtcelularrepresentante = $('#txtcelularrepresentante');
var cmbsucursaldestino = $('#cmbsucursaldestino');

var txtcambiomoneda = $('#txtcambiomoneda');
var txtidorden = $('#txtidorden');
var txtcodigoorden = $('#txtcodigoorden');
var txtidmoneda = $('#txtidmoneda');
var txtnombremoneda = $('#txtnombremoneda');
var cmbmoneda = $('#cmbmoneda');
var txtfechavencimiento = $('#txtfechavencimiento');
var txtfecha = $('#txtfecha');
var txtestado = $('#txtestado');
var txtempresa = $('#txtempresa');
var cmbcondicionpago = $('#cmbcondicionpago');
var cmbtipopago = $('#cmbtipopago');
var checkpercepcion = document.getElementById('checkpercepcion');
var txtpercepcion = document.getElementById('txtpercepcion');
var codigoproveedor = $('#codigoproveedor');
var txtidcontacto = $('#txtidcontacto');
var txtidrepresentante = $('#txtidrepresentante');
var divrepresentante = $('#divrepresentante');
var divicoterms = $('#divicoterms');
var _INDEX = 0;
var _DES1Pro = 0.0;
var _ARRAYBONIFICACIONES = [];
var _idCotizacion = "";
var _ARRAYELIMINADOS = [];
var _ROWCOLUMN = 0;

let posicionFieldSet = 0;

//CODIGO 
var btnduplicar = $('#btnduplicar');
var btnModificar = document.getElementById('btnModificar');

var numDecimales = 2;
var igvLocal = 0.18;
//FSILVA 28/12/2023
var unimed = 0;

$(document).ready(function () {

    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        "paging": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }, {
                "targets": [1],
                "visible": false,
                "searchable": false
            }]
    });
    fnListarSucursaDestino();
    if (MODELO.idordencompra == 0) {
        var fechaa30dias = moment().add(30, 'd').format('YYYYY-MM-DD');
        txtfechavencimiento.val(fechaa30dias);
        txtfecha.val(moment().format('DD-MM-YYYY'));

    } else {
        //BloquearDesbloquearCampos("desbloquear");
        cmbOrdenPor.setAttribute("disabled", "");
        init();
    }
});

$(document).on('click', '.btnpasarproveedor', function (e) {
    var columna = tblproveedores.row($(this).parents('tr')).data();
    if (cmbOrdenPor.value == "PROFORMA") {
        txtcodigoproveedor.val(columna[0]);
        txtrazonproveedor.val(columna[2]);
        listarProformasproveedor(txtcodigoproveedor.val());
    } else {
        buscarDatosProveedor(columna[0]);
    }
    $('#modalproveedores').modal('hide');
});
txtcodigoproveedor.click(function (e) {
    $('#modalproveedores').modal('show');
});
function init() {
    fnbuscarordencompra();

    setTimeout(function () {
        bloquearTabla("bloquear");
    }, 250);

    if (txtestado.val() == "PENDIENTE" || txtestado.val() == "APROBADO" || txtestado.val() == "VENCIDO") {
        btnModificar.removeAttribute("disabled");
    }
}
function fnbuscarordencompra() {
    let controller = new OrdenCompraController();

    if (MODELO.codigoorden === "DuplicarD") {
        MODELO.idordencompra += "D";
    }
    var obj = { id: MODELO.idordencompra };
    controller.BuscarOrdenCompraMasBonificaciones(obj, function (data) {
        var cabecera = JSON.parse(data[0].CABECERA)[0];
        var detalle = JSON.parse(data[0].DETALLE);
        txtcodigoorden.val(cabecera['CODIGO']);
        codigoproveedor.val(cabecera['ID PROVEEDOR']);
        txtestado.val(cabecera['ESTADO']);
        //txtfecha.val(cabecera['FECHA']);
        txtempresa.val(cabecera['EMPRESA']);
        cmbsucursaldestino.val(cabecera['IDSUCURSAL DESTINO']);
        txtrucproveedor.val(cabecera['PRO_RUC']);
        txtrazonsocial.val(cabecera['PRO_RAZONSOCIAL']);
        txttelefonoproveedor.val(cabecera['PRO_TELEFONO']);
        txtobservacion.val(cabecera['OBSERVACION'])
        txtnombrescontacto.val(cabecera['CONTACTO NOMBRES']);
        txttelefonocontacto.val(cabecera['CONTACTO TELE']);
        txtcelularcontacto.val(cabecera['CONTACTO CELULAR']);
        txtidorden.val(cabecera['ID']);
        txtnombremoneda.val(cabecera['MONEDA']);
        //txtnombremoneda.val(cabecera['MONEDA']);
        cmbmoneda.val(cabecera['ID MONEDA']);
        txtidmoneda.val(cabecera['ID MONEDA']);

        txtcambiomoneda.val(cabecera['MONEDA CAMBIO']);
        if (cabecera['PERCEPCION'] == 0)
            checkpercepcion.checked = false;
        else
            checkpercepcion.checked = true;
        txtpercepcion.value = cabecera['PERCEPCION'];
        if (cabecera['ID REPRESENTANTE'] != 0) {
            divrepresentante.removeClass('ocultar');
            txtidrepresentante.val(cabecera['ID REPRESENTANTE']);
            txtnombresrepresentante.val(cabecera['REPRE NOMBRES']);
            txttelefonorepresentante.val(cabecera['REPRE TELE']);
            txtcelularrepresentante.val(cabecera['REPRE CELULAR']);
        }
        $("#btnimprimir").attr('href', ORIGEN + '/Compras/COrdenCompra/Imprimir/' + cabecera['ID']);
        if (cabecera['PRO_UBICACION'] == 'INTERNACIONAL')
            divicoterms.removeClass('ocultar');
        else
            divicoterms.addClass('ocultar');
        //cmbcondicionpago.val(data['CONTACTO CELULAR']);

        //cmbtipopago.val(data['CONTACTO CELULAR']);       
        var btndelete = '';

        for (var j = 0; j < detalle.length; j++) {
            _ROWCOLUMN = 0;
            if (cabecera['ESTADO'] == 'PENDIENTE')
                btndelete = `<div class="btn-group btn-group-sm">
                            <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                     </div>`;
            var fila = tbllista.row.add([
                '<span class="detalle_idordendetalle" style="display:none">' + detalle[j]['IDOREDENDETALLE'] + '</span>' + '<span class="detalle_idpro" style="display:none">' + detalle[j]['IDPRODUCTO'] + '</span>' + '<span class="detalle_idlab" style="display:none">' + detalle[j]['IDLAB'] + '</span>' + '<label class="detalle_index" style="display:none">' + (j + 1) + '</label>',
                detalle[j]['IDDETALLECOTIZACION'],
                '<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + (j + 1) + '</label>' + '<span class="detalle_iddetalle" style="display: none"> ' + detalle[j]['IDDETALLECOTIZACION'] + '</span>' + '<span class="detalle_idpro" style="display: none">' + detalle[j]['IDPRODUCTO'] + '</span>',
                '<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span>' + '<span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                '<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span>',
                '<button class="btnanalisisproducto" idproducto="' + detalle[j]['IDPRODUCTO'] + '"><i class="fas fa-cash-register"></i></button>',
                '<span class="laboratorio">' + detalle[j]['LABORATORIO'] + '</span>',
                '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                '<span>' + detalle[j]['UMA'] + '</span>',
                '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + detalle[j]['VVF'] + '"/>',
                '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['PVF'] + '"/>',
                '<button class="btnbonificacion" valor="' + detalle[j]['BONI'] + '">....<label class="returnmodal" hidden>' + detalle[j]['DATOSBONI'] + '</label></button>',
                '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[j]['COSTO'].toFixed(numDecimales) + '" disabled/>',
                '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '" disabled/>',
                '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + detalle[j]['DES1'] + '" />',
                '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + detalle[j]['DES2'] + '" />',
                '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + detalle[j]['DES3'] + '" />',
                '<input type="number" class="text-center txtsubtotal inputdetalle" min="0"   value="' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '" />',
                '<input type="number" class="text-center txttotal inputdetalle" min="0"  value="' + detalle[j]['TOTAL'].toFixed(numDecimales) + '" />',
                ` <div class="">
                        <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                    </div>`
                //'<bold class="index font-13" rowp=' + (_ROWCOLUMN) + '>' + (j + 1) + '</bold>' + '<span class="detalle_iddetalle"> ' + detalle[j]['IDDETALLECOTIZACION'] + '</span>' + '<span class="detalle_idpro">' + detalle[j]['ID PRO'] + '</span>',
                //'<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span></br><span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                //'<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span></br><span>' + detalle[j]['DESCRIPCION_PRO_PROVEEDOR'] + '</span>',
                //'<button class="btnanalisisproducto "  idproducto="' + detalle[j]['IDPRODUCTO'] + '"  idproveedor="' + cabecera['ID PROVEEDOR'] + '"><i class="fas fa-cash-register"></i></button>',
                //'<span class="laboratorio">' + detalle[j]['LABORATORIO'] + '</span>' + '<span class="detalle_idlab" style="display:none">' + detalle[j]['IDLAB'] + '</span>',
                //// '<span>' + detalle[j]['CANTIDAD'] + '</span>' + (detalle[j]['CANTIDADPROVEEDOR'] === 0 ? '' : ('</br><span>' + detalle[j]['CANTIDADPROVEEDOR'] + '</span>')),
                //'<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                //'<span>' + detalle[j]['UMA'] + '</span></br><span>' + detalle[j]['UMP'] + '</span>',
                //'<span class="txtvvf" rowp=' + (_ROWCOLUMN + 2) + '>' + detalle[j]['VVF'].toFixed(numDecimales) + '</span>',
                //'<span class="txtpvf" rowp=' + (_ROWCOLUMN + 3) + '>' + detalle[j]['PVF'].toFixed(numDecimales) + '</span>',
                //'<button class="btnbonificacion" valor="0">....<label class="returnmodal" hidden></label></button>',
                //'<span class="txtcosto">' + detalle[j]['COSTO'].toFixed(numDecimales) + '</span>',
                //'<span class="txtcostofacturar">' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '</span>',
                //'<span class="txtdes1" rowp=' + (_ROWCOLUMN + 4) + '>' + detalle[j]['DES1'] + '</span>',
                //'<span class="txtdes2 rowp=' + (_ROWCOLUMN + 5) + '">' + detalle[j]['DES2'] + '</span>',
                //'<span class="txtdes3" rowp=' + (_ROWCOLUMN + 6) + '>' + detalle[j]['DES3'] + '</span>',
                //'<span class="txtsubtotal">' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '</span>',
                //'<span class="txttotal">' + detalle[j]['TOTAL'].toFixed(numDecimales) + '</span>',
                //btndelete
            ]).draw(false).node();
            $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
            _ARRAYBONIFICACIONES.push({ index: (j + 1), array: detalle[j]['BONIFICACIONES'] });
        }
        calcularTotal();
        listardatoscotizacion(detalle[0]['IDDETALLECOTIZACION']);

        var btnimprimir = $('#btnimprimir');
        var btnanular = $('#btnanular');
        var btnnuevos = $('#btnnuevo');
        if (MODELO.codigoorden === "DuplicarD") {

            btnduplicar.prop('disabled', true);
            btnnuevos.prop('disabled', true);
            btnimprimir.prop('disabled', true);
            btnanular.css("display", "none"); // Mostrar el botón


        } else {

            btnduplicar.prop('disabled', false);
            btnnuevos.prop('disabled', false);
            btnimprimir.prop('disabled', false);
            btnanular.css("display", "block"); // Mostrar el botón

        }
    });
}

function listardatoscotizacion(_iddetallecotizacion) {

    var url = ORIGEN + "/Compras/COrdenCompra/ConsultaDetalleCotizacion";
    var obj = {
        iddetallecotizacion: _iddetallecotizacion
    };

    $.post(url, obj).done(function (data) {
        //console.log(data);
        _idCotizacion = data.idcotizacion
        // var id = data.objeto.idcotizacion;
        // _idCotizacion = id

    }).fail(function (data) {

        mensaje("D", 'Error en el servidor');
    });
}


function listarproformasseleccionadas() {
    //var url = ORIGEN + "/Compras/CCotizacion/GetProformas";
    var obj = {
        proformas: _arrayCotizaciones
    };

    let controller = new CotizacionController();
    controller.GetProformas(obj, function (data) {
        //$.post(url, obj).done(function (data) 
        tbllista.clear().draw(false);
        var auxtfila;
        for (var i = 0; i < data.length; i++) {
            var fila = JSON.parse(data[i]);
            if (i === 0) {
                var cabecera = JSON.parse(fila[0]['CABECERA']);
                cabecera = cabecera[0];
                txtcambiomoneda.val(cabecera['MONEDA_CAMBIO']);
                //txtnombremoneda.val(cabecera['MONEDA']);
                cmbmoneda.val(cabecera['IDMONEDA']);
                txtidmoneda.val(cabecera['IDMONEDA']);
                cmbcondicionpago.val(cabecera.idcondicionpago);
                cmbtipopago.val(cabecera.idtipopago);
                cmbicoterms.val(cabecera.idicoterms);

                fnverificarcambiotipopago();
            }

            var detalle = JSON.parse(fila[0].DETALLE);
            for (var j = 0; j < detalle.length; j++) {
                _ROWCOLUMN = 0;
                unimed = detalle[j]['IDUMA'];
                auxtfila = tbllista.row.add([
                    '<span class="detalle_idpro" style="display:none">' + detalle[j]['IDPRODUCTO'] + '</span>' + '<span class="detalle_idlab" style="display:none">' + detalle[j]['IDLAB'] + '</span>' + '<label class="detalle_index" style="display:none">' + (j + 1) + '</label>',
                    detalle[j]['ID'],
                    '<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + (j + 1) + '</label>' + '<span class="detalle_idpro" style="display: none">' + detalle[j]['IDPRODUCTO'] + '</span>' + '<span class="detalle_iddetalle" style="display: none"> ' + detalle[j]['ID'] + '</span>',
                    '<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span>' + '<span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                    '<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span>',
                    '<button class="btnanalisisproducto" idproducto="' + detalle[j]['IDPRODUCTO'] + '"><i class="fas fa-cash-register"></i></button>',
                    '<span class="laboratorio">' + detalle[j]['LABORATORIO'] + '</span>',
                    '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                    '<span>' + detalle[j]['UMA_DES'] + '</span>',
                    //'<span class = "detalle_codiduma">' + detalle[j]['IDUMA'] + '</span>',//FSILVAasdsad
                    '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + detalle[j]['VVF'] + '"/>',
                    '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['PVF'] + '"/>',
                    '<button class="btnbonificacion" valor="' + detalle[j]['BONI'] + '">....<label class="returnmodal" hidden>' + detalle[j]['DATOSBONI'] + '</label></button>',
                    '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[j]['COSTO'].toFixed(numDecimales) + '" disabled/>',
                    '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '" disabled/>',
                    '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + detalle[j]['DES1'] + '" />',
                    '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + detalle[j]['DES2'] + '" />',
                    '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + detalle[j]['DES3'] + '" />',
                    '<input type="number" class="text-center txtsubtotal inputdetalle" min="0"   value="' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '" />',
                    '<input type="number" class="text-center txttotal inputdetalle" min="0"  value="' + detalle[j]['TOTAL'].toFixed(numDecimales) + '" />',
                    ` <div class="">
                        <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                    </div>`,
                    //'<span class="detalle_idpro" style="display:none">' + detalle[j]['IDPRODUCTO'] + '</span>',
                    ////'<span class="detalle_iddetalle" style="display:none">' + detalle[j]['ID'] + '</span>',
                    //detalle[j]['ID'],
                    //'<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + (j + 1)+ '</label>',
                    //'<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span></br><span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                    //'<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span></br><span>' + detalle[j]['DESCRIPCION_PRO_PROVEEDOR'] + '</span>',
                    //'<button class="btnanalisisproducto "  idproducto="' + detalle[j]['COD_PROD_QF'] + '"  idproveedor="' + detalle[j]['COD_PRO_PROVEEDOR'] + '"><i class="fas fa-cash-register"></i></button>',
                    //detalle[j]['LABORATORIO'],
                    ///*                    '<span>' + detalle[j]['CANTIDAD'] + '</span>' + (detalle[j]['CANTIDADPROVEEDOR'] === undefined ? '' : ('</br><span>' + detalle[j]['CANTIDADPROVEEDOR'] + '</span>')),*/
                    //'<input type="number" class="text-center txtcantidadDetalle rowp=' + (_ROWCOLUMN + 1) + ' inputdetalle" min="0" onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                    //'<span>' + detalle[j]['UMA_DES'] + '</span></br><span>' + detalle[j]['UMP_DES'] + '</span>',
                    //'<span class="txtvvf" rowp=' + (_ROWCOLUMN + 2) + ' >' + detalle[j]['VVF'].toFixed(numDecimales) + '</span>',
                    //'<span class="txtpvf" rowp=' + (_ROWCOLUMN + 3) + '>' + detalle[j]['PVF'].toFixed(numDecimales) + '</span>',
                    //'<button class="btnbonificacion" valor="0">....<label class="returnmodal" hidden></label></button>',
                    //'<span class="txtcosto">' + detalle[j]['COSTO'].toFixed(numDecimales) + '</span>',
                    //'<span class="txtcostofacturar">' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '</span>',
                    //'<span class="txtdes1" rowp=' + (_ROWCOLUMN + 4) + '>' + detalle[j]['DES1'] + '</span>',
                    //'<span class="txtdes2" rowp=' + (_ROWCOLUMN + 5) + '>' + detalle[j]['DES2'] + '</span>',
                    //'<span class="txtdes3" rowp=' + (_ROWCOLUMN + 6) + ' >' + detalle[j]['DES3'] + '</span>',
                    //'<span class="txtsubtotal">' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '</span>',
                    //'<span class="txttotal">' + detalle[j]['TOTAL'].toFixed(numDecimales) + '</span>',
                    //` <div class="btn-group btn-group-sm">
                    //        <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                    // </div>`,
                ]).draw(false).node();
                $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
                _ARRAYBONIFICACIONES.push({ index: (j + 1), array: detalle[j]['BONIFICACIONES'] });
            }
        }
        tbllista.columns.adjust().draw();
        calcularTotal();
    });
}
function buscarproveedorPorProforma(id) {
    var url = ORIGEN + "/Compras/CCotizacion/BuscarProveedorCotizacion";
    var obj = { idproforma: id };
    $.post(url, obj).done(function (data) {
        //console.log(data);
        if (data.mensaje === "ok") {
            txtidproveedor.val(data.objeto.idproveedor);
            txtrucproveedor.val(data.objeto.ruc);
            txtrazonsocial.val(data.objeto.razonsocial);
            txttelefonoproveedor.val(data.objeto.telefonod);
            txtidmoneda.val(data.objeto.moneda.idmoneda);
            //txtnombremoneda.val(data.objeto.moneda.nombre);
            cmbmoneda.val(data.objeto.moneda.idmoneda);
            txtcambiomoneda.val(data.objeto.moneda.tipodecambio);
            txtidproveedor.val(data.objeto.idproveedor);
            txtrazonproveedor.val(data.objeto.razonsocial);
            txtestado.val('PENDIENTE');
            if (data.objeto.ubicacion == 'INTERNACIONAL')
                divicoterms.removeClass('ocultar');
            else
                divicoterms.addClass('ocultar');
            txtidcontacto.val(data.objeto.contacto.idcontacto);
            txtnombrescontacto.val(data.objeto.contacto.nombres);
            txttelefonocontacto.val(data.objeto.contacto.telefono);
            txtcelularcontacto.val(data.objeto.contacto.celular);

            if (data.objeto.representante != null) {
                divrepresentante.removeClass('ocultar');
                txtidrepresentante.val(data.objeto.representante.idrepresentante);
                txtnombresrepresentante.val(data.objeto.representante.nombres);
                txttelefonorepresentante.val(data.objeto.representante.telefono);
                txtcelularrepresentante.val(data.objeto.representante.celular);
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}
function agregarItem() {

    var filas = document.querySelectorAll("#tbllista tbody tr bold.index");
    var c = 0;
    filas.forEach(function (e) {
        e.textContent = (c + 1);
        //$('.index')
        //document.getElementsByClassName("index")[c].Text = "xx";           
        c++;
    });
}
function calcularTotal() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var subtotal = 0.0;
    var impuesto = 0.0;
    var totalfactura = 0.0;
    var percepcion = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        try {
            //var abc = document.getElementsByClassName("txtsubtotal")[c];
            subtotal += parseFloat(document.getElementsByClassName("txtsubtotal")[c].value);
        } catch (e) { }
        try {
            totalfactura += parseFloat(document.getElementsByClassName("txttotal")[c].value);
        } catch (e) { }
        c++;
    });
    impuesto = totalfactura - subtotal;
    $('#lblsubtotal').text(subtotal.toFixed(numDecimales));
    $('#lblimpuesto').text(impuesto.toFixed(numDecimales));
    $('#lbltotalfactura').text(totalfactura.toFixed(numDecimales));
    $('#lbltotal').text(totalfactura.toFixed(numDecimales));
    percepcion = parseFloat(totalfactura) * PERCEPCION;
    if (checkpercepcion.checked)
        $('#lblpercepcion').text(percepcion.toFixed(numDecimales));
    else
        $('#lblpercepcion').text('0.00');

}
function buscarbonificaciones() {

    var data = tbllista.row('.selected').data();
    var iddetalle = data[1];
    var url = ORIGEN + "/Compras/CCotizacion/getBonificacion";
    var obj = {
        id: iddetalle
    };

    $.post(url, obj).done(function (data) {
        if (data != null) {
            $('#tblbonificaciones tbody').empty();
            for (var i = 0; i < data.length; i++) {
                var htmlTags = '<tr>' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + data[i].producto + '</td>' +
                    '<td>' + data[i].cantidad + '</td>' +
                    '<td>' + data[i].tipo + '</td>' +
                    '</tr>';

                $('#tblbonificaciones tbody').append(htmlTags);
            }

        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
function usarproforma() {
    var url = ORIGEN + "/Compras/CCotizacion/UsarProforma";
    var obj =
    {
        proformas: _arrayCotizaciones
    };
    $.post(url, obj).done(function (data) {
        if (data === "ok") {
            console.log('proformas usadas');
        }
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
function getdatosdetalle() {
    var filas = tbllista.rows().data();


    var array = [];
    var obj = new Object();
    for (var i = 0; i < filas.length; i++) {
        obj = new Object();
        if (filas[i][1] == '') {
            obj.iddetallecotizacion = 0;
        }
        else {
            obj.iddetallecotizacion = filas[i][1];
        }
        obj.idordencompra = 0;
        obj.idordendetalle = 0;
        obj.estado = 'HABILITADO';
        array[i] = obj;
    }
    return array;
}
function fneditardetalle() {
    var url = ORIGEN + "/Compras/COrdenCompra/EditarDetalle";
    var obj =
    {
        detalle: _arraydelete
    };
    $.post(url, obj).done(function (data) {
        //console.log(data);
        if (data.mensaje === "ok") {
            alertaSwall('S', 'OPERACIÓN COMPLETADA', 'ORDEN ACTUALIZADA');
            btnguardar.prop('disabled', false);
        }
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
function fnanular() {
    var url = ORIGEN + "/Compras/COrdenCompra/AnularOrden";
    if (txtidorden.val().length === 0) {
        mensaje('I', 'La orden no ha sido generada');
        return;

    }
    var obj = { id: txtidorden.val() };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Registro anulado');
            location.reload();
        }
        else {
            mensaje('W', data.mensaje);
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}
function fnListarSucursaDestino() {
    let controller = new SucursalController();
    controller.ListarSucursalesPrimarias('cmbsucursaldestino', '', IDSUCURSALALMACEN, null);
}
function fnverificarcambiotipopago() {
    if ($('#cmbtipopago option:selected').text() == 'CREDITO')
        cmbcondicionpago.prop('required', true);
    else
        cmbcondicionpago.prop('required', false);
}
cmbtipopago.change(function () {
    fnverificarcambiotipopago();

});
$('#form-registro').submit(function (e) {
    e.preventDefault();
    var count = tbllista.rows().data().length;
    if (count > 0) {
        btnguardar.prop('disabled', true);
        cmbOrdenPor.setAttribute("disabled", "");
        var url = ORIGEN + "/Compras/COrdenCompra/RegistrarEditar";
        if (MODELO.codigoorden === "DuplicarD") {
            MODELO.idordencompra = 0;
        }
        if (MODELO.idordencompra == 0) {

            var obj = $('#form-registro').serializeArray();
            obj.push({ name: "idcotizacion", value: _idCotizacion });
            var x = document.getElementById('txtobservacion').value;
            obj.push({ name: "observacion", value: x });
            //obj.push(JSON.stringify({ idcotizacion: _idCotizacion }));
            //console.log(obj);

            var obj1 = obj;
            var detalle = obtenerDatosDetalleDiferentea0();
            obj1[obj1.length] = { name: 'detallejson', value: JSON.stringify(detalle) };

            var row = tbllista.row('tr').data();
            var iddetalle = FN_GETDATOHTML(row[1], 'detalle_iddetalle');
            _ARRAYELIMINADOS.push(parseInt(iddetalle));

            if (_ARRAYELIMINADOS.length > 0)
                obj1[obj1.length] = { name: 'eliminados', value: (_ARRAYELIMINADOS) };
            if (detalle.length === 0) {
                mensaje('W', 'Los productos del detalle tienen cantidad 0');
                return;
            }

            var url1 = ORIGEN + "/Compras/CCotizacion/RegistrarEditar";
            $.post(url1, obj1).done(function (data1) {
                if (data1.mensaje == "ok") {
                    _ARRAYBONIFICACIONES = [];
                    _arrayCotizaciones = [];
                    _arrayCotizaciones.push(data1.objeto.idcotizacion);
                    _idCotizacion = data1.objeto.idcotizacion;
                    //listarproformasseleccionadas();
                    var objGP = {
                        proformas: _arrayCotizaciones
                    };
                    let controller = new CotizacionController();
                    controller.GetProformas(objGP, function (data) {
                        //$.post(url, obj).done(function (data) 
                        tbllista.clear().draw(false);
                        var auxtfila;
                        for (var i = 0; i < data.length; i++) {
                            var fila = JSON.parse(data[i]);
                            if (i === 0) {
                                var cabecera = JSON.parse(fila[0]['CABECERA']);
                                cabecera = cabecera[0];
                                txtcambiomoneda.val(cabecera['MONEDA_CAMBIO']);
                                //txtnombremoneda.val(cabecera['MONEDA']);
                                cmbmoneda.val(cabecera['IDMONEDA']);
                                txtidmoneda.val(cabecera['IDMONEDA']);
                                cmbcondicionpago.val(cabecera.idcondicionpago);
                                cmbtipopago.val(cabecera.idtipopago);
                                cmbicoterms.val(cabecera.idicoterms);

                                fnverificarcambiotipopago();
                            }

                            var detalle = JSON.parse(fila[0].DETALLE);
                            for (var j = 0; j < detalle.length; j++) {
                                _ROWCOLUMN = 0;
                                auxtfila = tbllista.row.add([
                                    '<span class="detalle_idpro" style="display:none">' + detalle[j]['IDPRODUCTO'] + '</span>' + '<span class="detalle_idlab" style="display:none">' + detalle[j]['IDLAB'] + '</span>' + '<label class="detalle_index" style="display:none">' + (j + 1) + '</label>',
                                    detalle[j]['ID'],
                                    '<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + (j + 1) + '</label>' + '<span class="detalle_idpro" style="display: none">' + detalle[j]['IDPRODUCTO'] + '</span>',
                                    '<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span>' + '<span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                                    '<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span>',
                                    '<button class="btnanalisisproducto" idproducto="' + detalle[j]['IDPRODUCTO'] + '"><i class="fas fa-cash-register"></i></button>',
                                    '<span class="laboratorio">' + detalle[j]['LABORATORIO'] + '</span>',
                                    '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                                    '<span>' + detalle[j]['UMA_DES'] + '</span>',
                                    '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + detalle[j]['VVF'] + '"/>',
                                    '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['PVF'] + '"/>',
                                    '<button class="btnbonificacion" valor="' + detalle[j]['BONI'] + '">....<label class="returnmodal" hidden>' + detalle[j]['DATOSBONI'] + '</label></button>',
                                    '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[j]['COSTO'].toFixed(numDecimales) + '" disabled/>',
                                    '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '" disabled/>',
                                    '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + detalle[j]['DES1'] + '" />',
                                    '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + detalle[j]['DES2'] + '" />',
                                    '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + detalle[j]['DES3'] + '" />',
                                    '<input type="number" class="text-center txtsubtotal inputdetalle" min="0"   value="' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '" />',
                                    '<input type="number" class="text-center txttotal inputdetalle" min="0"  value="' + detalle[j]['TOTAL'].toFixed(numDecimales) + '" />',
                                    ` <div class="">
                        <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                    </div>`,
                                ]).draw(false).node();
                                $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
                                _ARRAYBONIFICACIONES.push({ index: (j + 1), array: detalle[j]['BONIFICACIONES'] });
                            }
                        }
                        tbllista.columns.adjust().draw();
                        calcularTotal();

                        if (checkpercepcion.checked)
                            obj[obj.length] = { name: 'percepcion', value: PERCEPCION };
                        obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(getdatosdetalle()) };

                        $.post(url, obj).done(function (data) {
                            if (data.mensaje === "ok") {
                                txtidorden.val(data.objeto.idordencompra);
                                txtcodigoorden.val(data.objeto.codigoorden);
                                $("#btnimprimir").attr('href', ORIGEN + '/Compras/COrdenCompra/Imprimir/' + data.objeto.idordencompra);
                                usarproforma();
                                if (cmbOrdenPor.value == "REQUERIMIENTO") {
                                    var objReq = {
                                        idrequerimiento: idrequerimiento,
                                        idordencompra: data.objeto.idordencompra
                                    }
                                    var urlReq = ORIGEN + "/Compras/CRequerimiento/EditarIdOrdenEnRequerimiento";
                                    $.post(urlReq, objReq).done(function (dataReq) {
                                        if (dataReq.mensaje == "ok") {
                                            window.location.href = ORIGEN + "/Compras/COrdenCompra/RegistrarEditar/" + data.objeto.idordencompra;
                                            alertaSwall('S', 'OPERACIÓN COMPLETADA', 'ORDEN GENERADA');
                                        } else {
                                            mensaje('W', dataReq.mensaje);
                                        }
                                    });
                                } else {
                                    window.location.href = ORIGEN + "/Compras/COrdenCompra/RegistrarEditar/" + data.objeto.idordencompra;
                                    var btnimprimir = $('#btnimprimir');
                                    var btnanular = $('#btnanular');
                                    var btnnuevos = $('#btnnuevo');
                                    btnduplicar.prop('disabled', false);
                                    btnnuevos.prop('disabled', false);
                                    btnimprimir.prop('disabled', false);
                                    btnanular.css("display", "block");
                                    alertaSwall('S', 'OPERACIÓN COMPLETADA', 'ORDEN GENERADA');
                                }
                            }
                            else {
                                mensaje('W', data.mensaje);
                                btnguardar.prop('disabled', false);
                                cmbOrdenPor.removeAttribute("disabled");
                            }
                        }).fail(function (data) {
                            btnguardar.prop('disabled', false);
                            cmbOrdenPor.removeAttribute("disabled");
                            console.log(data);
                            mensaje("D", "Error en el servidor");
                        });
                    });
                }
            }).fail(function (data) {
                btnguardar.prop('disabled', false);
                cmbOrdenPor.removeAttribute("disabled");
                mensajeError(data);
            });

        } else {
            var obj = $('#form-registro').serializeArray();
            obj.push({ name: "idcotizacion", value: _idCotizacion });
            obj.push({ name: "idorden", value: txtidorden.val() });
            var x = document.getElementById('txtobservacion').value;
            obj.push({ name: "observacion", value: x });

            var obj1 = obj;
            var detalle = obtenerDatosDetalleDiferentea0();
            obj1[obj1.length] = { name: 'detallejson', value: JSON.stringify(detalle) };

            var row = tbllista.row('tr').data();
            var iddetalle = FN_GETDATOHTML(row[2], 'detalle_iddetalle');
            //var iddetalle = FN_GETDATOHTML(row[1], obj.iddetallecotizacion.trim());
            _ARRAYELIMINADOS.push(parseInt(iddetalle));

            if (_ARRAYELIMINADOS.length > 0)
                obj1[obj1.length] = { name: 'eliminados', value: (_ARRAYELIMINADOS) };
            if (detalle.length === 0) {
                mensaje('W', 'Los productos del detalle tienen cantidad 0');
                return;
            }
            var url1 = ORIGEN + "/Compras/CCotizacion/RegistrarEditar";
            $.post(url1, obj1).done(function (data1) {
                if (data1.mensaje == "ok") {
                    //var abc = data1.objeto;
                    //fneditardetalle();
                    _ARRAYBONIFICACIONES = [];
                    _arrayCotizaciones = [];
                    _arrayCotizaciones.push(data1.objeto.idcotizacion);
                    _idCotizacion = data1.objeto.idcotizacion;
                    obj[obj.length] = { name: 'jsondetalle', value: data1.objeto.detallejson };
                    var objGP = {
                        proformas: _arrayCotizaciones
                    };
                    let controller = new CotizacionController();
                    controller.GetProformas(objGP, function (data) {
                        tbllista.clear().draw(false);
                        var auxtfila;
                        for (var i = 0; i < data.length; i++) {
                            var fila = JSON.parse(data[i]);
                            if (i === 0) {
                                var cabecera = JSON.parse(fila[0]['CABECERA']);
                                cabecera = cabecera[0];
                                txtcambiomoneda.val(cabecera['MONEDA_CAMBIO']);
                                cmbmoneda.val(cabecera['IDMONEDA']);
                                txtidmoneda.val(cabecera['IDMONEDA']);
                                cmbcondicionpago.val(cabecera.idcondicionpago);
                                cmbtipopago.val(cabecera.idtipopago);
                                cmbicoterms.val(cabecera.idicoterms);

                                fnverificarcambiotipopago();
                            }

                            var detalle = JSON.parse(fila[0].DETALLE);
                            for (var j = 0; j < detalle.length; j++) {
                                _ROWCOLUMN = 0;
                                auxtfila = tbllista.row.add([
                                    '<span class="detalle_idpro" style="display:none">' + detalle[j]['IDPRODUCTO'] + '</span>' + '<span class="detalle_idlab" style="display:none">' + detalle[j]['IDLAB'] + '</span>' + '<label class="detalle_index" style="display:none">' + (j + 1) + '</label>',
                                    detalle[j]['ID'],
                                    '<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + (j + 1) + '</label>' + '<span class="detalle_idpro" style="display: none">' + detalle[j]['IDPRODUCTO'] + '</span>',
                                    '<span class="detalle_codpro">' + detalle[j]['COD_PROD_QF'] + '</span>' + '<span>' + detalle[j]['COD_PRO_PROVEEDOR'] + '</span>',
                                    '<span class="detalle_nompro">' + detalle[j]['DESCRIPCION_PROD_QF'] + '</span>',
                                    '<button class="btnanalisisproducto" idproducto="' + detalle[j]['IDPRODUCTO'] + '"><i class="fas fa-cash-register"></i></button>',
                                    '<span class="laboratorio">' + detalle[j]['LABORATORIO'] + '</span>',
                                    '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['CANTIDAD'] + '"/>',
                                    '<span>' + detalle[j]['UMA_DES'] + '</span>',
                                    '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + detalle[j]['VVF'] + '"/>',
                                    '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + detalle[j]['PVF'] + '"/>',
                                    '<button class="btnbonificacion" valor="' + detalle[j]['BONI'] + '">....<label class="returnmodal" hidden>' + detalle[j]['DATOSBONI'] + '</label></button>',
                                    '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[j]['COSTO'].toFixed(numDecimales) + '" disabled/>',
                                    '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[j]['COSTOFACTURAR'].toFixed(numDecimales) + '" disabled/>',
                                    '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + detalle[j]['DES1'] + '" />',
                                    '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + detalle[j]['DES2'] + '" />',
                                    '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + detalle[j]['DES3'] + '" />',
                                    '<input type="number" class="text-center txtsubtotal inputdetalle" min="0"   value="' + detalle[j]['SUBTOTAL'].toFixed(numDecimales) + '" />',
                                    '<input type="number" class="text-center txttotal inputdetalle" min="0"  value="' + detalle[j]['TOTAL'].toFixed(numDecimales) + '" />',
                                    ` <div class="">
                        <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                    </div>`,
                                ]).draw(false).node();
                                $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
                                _ARRAYBONIFICACIONES.push({ index: (j + 1), array: detalle[j]['BONIFICACIONES'] });
                            }
                        }
                        tbllista.columns.adjust().draw();
                        calcularTotal();

                        $.post(url, obj).done(function (data) {
                            if (data.mensaje === "ok") {
                                window.location.href = ORIGEN + "/Compras/COrdenCompra/RegistrarEditar/" + MODELO.idordencompra;
                                alertaSwall('S', 'OPERACIÓN COMPLETADA', 'ORDEN ACTUALIZADA');
                            }
                            else {
                                mensaje('W', data.mensaje);
                                btnguardar.prop('disabled', false);
                                cmbOrdenPor.removeAttribute("disabled");
                            }
                        }).fail(function (data) {
                            btnguardar.prop('disabled', false);
                            cmbOrdenPor.removeAttribute("disabled");
                            console.log(data);
                            mensaje("D", "Error en el servidor");
                        });
                    });
                }
            }).fail(function (data) {
                btnguardar.prop('disabled', false);
                cmbOrdenPor.removeAttribute("disabled");
                mensajeError(data);
            });
        }
    } else
        mensaje('I', 'No existen registros en el detalle');
});

$("#btnimprimir").click(function () {
    var href = $("#btnimprimir").attr('href');
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR ORDEN DE COMPRA');
});
$('#tbllista tbody').on('click', 'tr', function () {

    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
    buscarbonificaciones();
});
$(document).on('click', '.btnquitaritem', function (e) {

    var fila = tbllista.row('.selected').data();
    if (MODELO.idordencompra != 0)
        _arraydelete.push(fila[0]);
    //var abc = fila[0].document.getElementsByClassName("detalle_index").innerHTML;
    var indexAux = $(this).parents("tr").find("td").find('.detalle_index').text();
    //var indexAux = FN_GETDATOHTML(fila[0], "detalle_index");
    if (_ARRAYBONIFICACIONES.length > 0)
        reOrdenarIndexPosicionArrayBonificacion(indexAux);
    tbllista.row('.selected').remove().draw(false);
    //agregarItem();
    agregarindex();
    calcularTotal();

});

function reOrdenarIndexPosicionArrayBonificacion(index) {
    //var arrInterno = _ARRAYBONIFICACIONES;
    _ARRAYBONIFICACIONES = _ARRAYBONIFICACIONES.filter(x => x.index != index);
    for (var i = 0; i < _ARRAYBONIFICACIONES.length; i++) {
        //if (_ARRAYBONIFICACIONES[i].index == index) {
        //    _ARRAYBONIFICACIONES.splice(i, 1);
        //}
        if (_ARRAYBONIFICACIONES[i].index > index) {
            _ARRAYBONIFICACIONES[i].index = _ARRAYBONIFICACIONES[i].index - 1;
        }
    }
}

btnnuevo.addEventListener('click', function () {
    if (MODELO.idordencompra == 0 && MODELO.codigoorden !== "DuplicarD")
        location.reload();
    else
        location.href = ORIGEN + '/Compras/COrdenCompra/RegistrarEditar';

});


checkpercepcion.addEventListener('click', function () {
    if (checkpercepcion.checked)
        txtpercepcion.value = PERCEPCION;
    calcularTotal();
});


function calcularmontos() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value);
            if (isNaN(vvf)) {//|| vvf === 0
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            document.getElementsByClassName("txtpvf")[c].value = parseFloat(vvf + igvLocal * vvf).toFixed(numDecimales);
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = parseFloat(pvf * cantidad);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtsubtotal")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txttotal")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularMontos_1() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var subtotal = 0.0;
    var impuesto = 0.0;
    var totalfactura = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        try {
            subtotal += parseFloat(document.getElementsByClassName("txtsubtotal")[c].value);
        } catch (e) { }
        try {
            totalfactura += parseFloat(document.getElementsByClassName("txttotal")[c].value);
        } catch (e) { }
        c++;
    });
    impuesto = totalfactura - subtotal;
    $('#lblsubtotal').text(subtotal.toFixed(numDecimales));
    $('#lblimpuesto').text(impuesto.toFixed(numDecimales));
    $('#lbltotalfactura').text(totalfactura.toFixed(numDecimales));
    $('#lbltotal').text(totalfactura.toFixed(numDecimales));
}

function FN_GETDATOHTML(html, classname) {
    try {
        var aux = document.createElement('div');
        aux.innerHTML = html;
        var valor = aux.getElementsByClassName(classname)[0].innerHTML;
        return valor === "null" ? null : valor;
    } catch (e) {
        return '';
    }

}


$('#btnaddproducto').click(function (e) {
    $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    //checktodosPT.prop('checked', false);
    //checktodosINSUMO.prop('checked', false); //viene de modal insumoproveedor
    $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
    $('#modalproductoproveedorlaboratorio').modal('show');
    listarlaboratoriosproveedor("");
});

function agregarindex() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var c = 0;
    filas.forEach(function (e) {
        document.getElementsByClassName("detalle_index")[c].innerHTML = (c + 1);
        c++;
    });
}

function agregarItems(tipo) {
    if (tipo === 'PT') {

        var filas = tblproductosxlaboratoriodeproveedor.rows('.selected').data();

        for (var i = 0; i < filas.length; i++) {

            var obj = new Object();
            obj.idlaboratorio = FN_GETDATOHTML(filas[i][0], 'idlaboratorio');
            obj.laboratorio = filas[i][3];
            obj.idunidadmedida = FN_GETDATOHTML(filas[i][0], 'idum');
            obj.idproducto = FN_GETDATOHTML(filas[i][0], 'idproducto');
            obj.codigoproducto = filas[i][1];
            obj.cantidad = 0;
            obj.producto = FN_GETDATOHTML(filas[i][2], 'nombreproducto');
            obj.unidadmedida = filas[i][4];
            obj.vvf = filas[i][5];
            obj.pvf = filas[i][6];
            obj.DES2 = filas[i][8];
            agregarProductoTerminado(obj);
        }

        agregarindex();
        calcularmontos();
        checktodosPT.prop('checked', false); //viene de modal productoproveeedorxlaboratorio
        $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    }
    if (tipo === 'IN') {
        var filas2 = tblinsumosdeproveedor.rows('.selected').data();
        for (var j = 0; j < filas2.length; j++) {
            agregarInsumoEconomato(filas2[j]);
        }
        checktodosINSUMO.prop('checked', false); //viene de modal insumoproveedor
        $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
    }
}

$(document).on('click', '.btnpasarproductoxlaboratorio', function () {
    var fila = tblproductosxlaboratoriodeproveedor.row($(this).parents('tr')).data();
    var obj = new Object();
    obj.idlaboratorio = FN_GETDATOHTML(fila[0], 'idlaboratorio');
    obj.laboratorio = fila[3];
    obj.idunidadmedida = FN_GETDATOHTML(fila[0], 'idum');
    obj.idproducto = FN_GETDATOHTML(fila[0], 'idproducto');
    obj.codigoproducto = fila[1];
    obj.cantidad = 0;
    obj.producto = FN_GETDATOHTML(fila[2], 'nombreproducto');
    obj.unidadmedida = fila[4];
    obj.vvf = fila[5];
    obj.pvf = fila[6];
    agregarProductoTerminado(obj);
    this.parentNode.parentNode.classList.remove('selected');
    agregarindex();
    calcularmontos();

});


function agregarProductoTerminado(data) {
    //console.log(data)
    //VERIFICA SI EL LABORATORIO ES DEL REPRESENTANTE
    if (fnverificarsielitemestaendetalle(data.codigoproducto)) {
        mensaje('I', 'El item ya esta en el detalle');
        return;
    }
    var idlaboratorio = $('#cmbrepresentante option:selected').attr('laboratorio');

    //if (cmbrepresentante.prop('checked'))
    //    if (data.idlaboratorio != idlaboratorio) {
    //        mensaje('I', 'El producto no es del laboratorio del representante');
    //        return;
    //    }
    var c = 1;
    _INDEX = _INDEX + 1;
    var cantidadtext = '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" onkeypress="return justNumbers(event);"  value="0"/>';
    _ROWCOLUMN = 0;
    tbllista.row.add([
        '<span class="detalle_idpro" style="display:none">' + data.idproducto + '</span>' + '<span class="detalle_idlab" style="display:none">' + data.idlaboratorio + '</span>' + '<label class="detalle_index" style="display:none">' + _INDEX + '</label>',
        '',
        '<label class="detalle_index" rowp=' + (_ROWCOLUMN) + '>' + _INDEX + '</label>',
        '<span class="detalle_codpro">' + data.codigoproducto + '</span>' + '<span class="detalle_idpro" style="display:none">' + data.idproducto + '</span>',
        '<span class="detalle_nompro">' + data.producto + '</span>',
        '<button class="btnanalisisproducto "  idproducto="' + data.idproducto + '""><i class="fas fa-cash-register"></i></button>',
        data.laboratorio,
        '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + (data.cantidad == undefined ? 0 : data.cantidad) + '"/>',
        '<span>' + data.unidadmedida + '</span>',
        //'<span class = "detalle_codiduma">' + data.unidadmedida + '</span>',//asdasd
        '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + data.vvf + '"/>',
        '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + data.pvf + '"/>',
        '<button class="btnbonificacion" valor="0">....<label class="returnmodal" hidden></label></button>',
        '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + data.dsc1 + '" />',
        '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + data.dsc2 + '" />',
        '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + data.dsc3 + '" />',
        '<input type="number" class="text-center txtsubtotal inputdetalle" min="0"   value="0" />',
        '<input type="number" class="text-center txttotal inputdetalle" min="0"  value="0" />',
        ` <div class="">
            <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        </div>`,
        //'<span class="txtvvf" rowp=' + (_ROWCOLUMN + 2) + '>' + data.vvf + '</span>',
        //'<span class="txtpvf" rowp=' + (_ROWCOLUMN + 3) + '>' + data.pvf + '</span>',
        //'<span class="txtcosto">' + 0 + '</span>',
        //'<span class="txtcostofacturar">' + 0 + '</span>',
        //'<span class="txtdes1" rowp=' + (_ROWCOLUMN + 4) + '>' + 0 + '</span>',
        //'<span class="txtdes2" rowp=' + (_ROWCOLUMN + 5) + '>' + 0 + '</span>',
        //'<span class="txtdes3" rowp=' + (_ROWCOLUMN + 6) + '>' + 0 + '</span>',
        //'<span class="txtsubtotal">' + 0 + '</span>',
        //'<span class="txttotal">' + 0 + '</span>',
        //` <div class="btn-group btn-group-sm">
        //                    <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        //             </div>`,
    ]).draw(false);

    calcularMontosDescuentosCostosCantidad();
    calcularTotal();
    //$('#modalproductoproveedorlaboratorio').modal('hide');
}


function fnverificarsielitemestaendetalle(codproducto) {
    var filas = document.querySelectorAll('#tbllista tbody tr');
    if (tbllista.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getElementsByClassName('detalle_codpro')[0].innerText;
        if (codproducto == aux)
            band = true;
    });
    return band;
}


function obtenerDatosDetalleDiferentea0() {
    var array = obtenerDatosDetalleAUX();
    var c = 0;
    var array2 = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].cantidad.toString() != "0") {
            array2[c] = array[i];
            c++;
        }
    }
    return array2;
}

function obtenerDatosDetalleAUX() {
    var array = [];
    var c = 0;
    var datatable = tbllista.rows().data();
    var filas = document.querySelectorAll("#tbllista #tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        var otrosdatos = datatable[c][0];
        var detalleindex;
        var aux;
        try { detalleindex = document.getElementsByClassName("detalle_index")[c].innerHTML; } catch (e) { detalleindex = -2; }
        if (detalleindex != -2) {
            var x = getindexbonificaciones(parseInt(detalleindex));
            if (x != -1) {
                detalle.bonificaciones = _ARRAYBONIFICACIONES[x].array;
            }
        }
        if (c < datatable.length) {
            detalle.idcotizacion = _idCotizacion === '' ? 0 : _idCotizacion;
            try { detalle.cantidad = (document.getElementsByClassName("txtcantidadDetalle")[c].value); } catch (e) { }
            try { detalle.pvf = (document.getElementsByClassName("txtpvf")[c].value); } catch (e) { }
            try { detalle.vvf = (document.getElementsByClassName("txtvvf")[c].value); } catch (e) { }
            try { detalle.total = (document.getElementsByClassName("txttotal")[c].value); } catch (e) { }
            try { detalle.subtotal = (document.getElementsByClassName("txtsubtotal")[c].value); } catch (e) { }
            try { detalle.equivalencia = (document.getElementsByClassName("equivalencia")[c].innerHTML); } catch (e) { }
            try { detalle.des1 = (document.getElementsByClassName("txtdes1")[c].value); } catch (e) { }
            try { detalle.des2 = (document.getElementsByClassName("txtdes2")[c].value); } catch (e) { }
            try { detalle.des3 = (document.getElementsByClassName("txtdes3")[c].value); } catch (e) { }
            //try { detalle.des4 = (document.getElementsByClassName("equivalencia")[c].innerHTML)); } catch (e) { }
            try { detalle.bonificacion = (document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { }
            try { detalle.costo = (document.getElementsByClassName("txtcosto")[c].value); } catch (e) { }
            try { detalle.montofacturar = (document.getElementsByClassName("txtcostofacturar")[c].value); } catch (e) { }
            try { detalle.bonificacion = (document.getElementsByClassName("bonificacion")[c].innerHTML); } catch (e) { }
            //try { detalle.uma_des = (FN_GETDATOHTML(otrosdatos, "detalle_iduma")); } catch (e) { }
            try { detalle.iduma = (document.getElementsByClassName("detalle_codiduma")[c].innerHTML); } catch (e) { }

            try { detalle.idump = (FN_GETDATOHTML(otrosdatos, "detalle_idump")); } catch (e) { }
            try {
                var iddetalle = (document.getElementsByClassName("detalle_iddetalle")[c].innerText).trim();
                detalle.iddetallecotizacion = (iddetalle === '' || iddetalle === null) ? 0 : iddetalle;
            } catch (e) { }
            try { detalle.idlaboratorio = (FN_GETDATOHTML(otrosdatos, "detalle_idlab")) == "0" ? null : (FN_GETDATOHTML(otrosdatos, "detalle_idlab")); } catch (e) { }
            try { detalle.idproducto = (document.getElementsByClassName("detalle_idpro")[c].innerText); } catch (e) { }
            try { detalle.idproductoproveedor = (FN_GETDATOHTML(otrosdatos, "detalle_idpropro")); } catch (e) { }
        }
        array[c] = detalle;
        c++;

    });
    //console.log(array)
    return array;

}

function getindexbonificaciones(index) {
    for (var i = 0; i < _ARRAYBONIFICACIONES.length; i++) {
        if (parseInt(index) === parseInt(_ARRAYBONIFICACIONES[i].index))
            return i;
    }
    return -1;
}


function buscarDatosProveedor(idproveedor) {
    var url = ORIGEN + "/Compras/CCotizacion/BuscarDatosProveedor";
    var obj = { idproveedor: idproveedor };
    $.post(url, obj).done(function (data) {
        var datos = JSON.parse(data);
        if (datos != null) {
            txtidproveedor.val(datos[0].idproveedor);
            txtrucproveedor.val(datos[0].ruc);
            txtrazonsocial.val(datos[0].razonsocial);
            txttelefonoproveedor.val(datos[0].telefonod);
            txtidmoneda.val(datos[0].idmoneda);
            //txtnombremoneda.val(data.objeto.moneda.nombre);
            cmbmoneda.val(datos[0].idmoneda);
            txtcambiomoneda.val(datos[0].tipodecambio);
            txtidproveedor.val(datos[0].idproveedor);
            txtrazonproveedor.val(datos[0].razonsocial);
            txtestado.val('PENDIENTE');
            if (datos[0].ubicacion == 'INTERNACIONAL')
                divicoterms.removeClass('ocultar');
            else
                divicoterms.addClass('ocultar');
            txtidcontacto.val(datos[0].idcontacto);
            txtnombrescontacto.val(datos[0].nombres);
            txttelefonocontacto.val(datos[0].telefono);
            txtcelularcontacto.val(datos[0].celular);

            if (datos[0].representante != null) {
                divrepresentante.removeClass('ocultar');
                txtidrepresentante.val(datos[0].idrepresentante);
                txtnombresrepresentante.val(datos[0].nombres);
                txttelefonorepresentante.val(datos[0].telefono);
                txtcelularrepresentante.val(datos[0].celular);
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}
txtrucproveedor.click(function (e) {
    $('#modalproveedores').modal('show');
});
txtrazonsocial.click(function (e) {
    $('#modalproveedores').modal('show');
});

cmbOrdenPor.addEventListener("change", function (e) {
    limpiar();
    if (cmbOrdenPor.value == "PROFORMA") {
        btnProformaRequerimiento.removeAttribute("disabled");
        BloquearDesbloquearCampos("desbloquear");
    } else if (cmbOrdenPor.value == "REQUERIMIENTO") {
        btnProformaRequerimiento.removeAttribute("disabled");
        BloquearDesbloquearCampos("desbloquear");
        $("#btnaddproducto")[0].setAttribute("disabled", "");
    } else if (cmbOrdenPor.value == "VACIO") {
        btnProformaRequerimiento.setAttribute("disabled", "");
        BloquearDesbloquearCampos("desbloquear");
    } else {
        btnProformaRequerimiento.setAttribute("disabled", "");
        BloquearDesbloquearCampos("bloquear");
    }
});

btnProformaRequerimiento.addEventListener("click", function (e) {
    if (cmbOrdenPor.value == "PROFORMA") {
        $('#modalProforma').modal('show');
    } else if (cmbOrdenPor.value == "REQUERIMIENTO") {
        $('#modalRequerimiento').modal('show');
    }
});

$(document).on('click', '.btnpasarproforma', function (e) {
    $(this).toggleClass('selected');
    var filas = tblproformas.rows('.selected').data();
    for (var i = 0; i < filas.length; i++) {
        _arrayCotizaciones[i] = filas[i][0];
        buscarproveedorPorProforma(filas[i][0]);

        listarproformasseleccionadas();
        _idCotizacion = _arrayCotizaciones[i];
        txtidcotizacion.value = _arrayCotizaciones[i];
    }
});

function limpiar() {
    document.getElementById("form-registro").reset();
    _idCotizacion = 0;
    tblproformas.clear().draw(false);
    tbllista.clear().draw(false);
    $('#tblbonificaciones tbody').empty();
    txtcodigoproveedor.val("");
    txtrazonproveedor.val("");
    cmbsucursaldestino.val(100);
    cmbtipopago.val(10001);
    cmbcondicionpago.val(10009);
    _arrayCotizaciones = [];
    _arraydelete = [];
    _INDEX = 0;
    _ARRAYBONIFICACIONES = [];
    _idCotizacion = "";
    _ARRAYELIMINADOS = [];
    _ROWCOLUMN = 0;
    posicionFieldSet = 0;
    calcularTotal();
    var fechaa30dias = moment().add(30, 'd').format('YYYYY-MM-DD');
    txtfechavencimiento.val(fechaa30dias);
    txtfecha.val(moment().format('DD-MM-YYYY'));
}

var idrequerimiento;
$(document).on('click', '.btnpasarrequerimiento', function (e) {
    $(this).toggleClass('selected');
    var filas = tblrequerimiento.rows('.selected').data();
    idrequerimiento = filas[0][0];
    let controller = new RequerimientoController();
    controller.BuscarRequerimientoCompleto(idrequerimiento, function (data) {
        var detalle = JSON.parse(data[0]['DETALLE']);
        for (var i = 0; i < detalle.length; i++) {
            BuscarProductoPrecioYDescuento(detalle[i].idproducto, detalle[i].cantidad);
        }
    });
    $('#modalRequerimiento').modal('hide');
});

function BuscarProductoPrecioYDescuento(idproducto, cantidad) {
    let controller = new ProductoController();
    var obj = {
        idproducto: idproducto
    };
    controller.BuscarProductosRequerimiento(obj,
        function (data) {
            var obj = new Object();
            obj.idlaboratorio = data[0].IDLAB;
            obj.laboratorio = data[0].LABORATORIO;
            obj.idunidadmedida = data[0].IDUM;
            obj.idproducto = data[0].ID;
            obj.codigoproducto = data[0].CODIGO;
            obj.producto = data[0].PRODUCTO;
            obj.cantidad = cantidad;
            obj.unidadmedida = data[0].UNIDADMEDIDA;
            obj.vvf = data[0].VVF;
            obj.pvf = data[0].PVF;
            obj.DES2 = data[0].DSC2;
            agregarProductoTerminado(obj);
        });
}

$(document).on('keyup', '.txtcantidadDetalle', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtvvf', function () {
    try { calcularmontos(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtpvf', function () {
    try { calcularmontosconIGV(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes1', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes2', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes3', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtsubtotal', function () {
    try { calcularMontosDesdePrecio(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txttotal', function () {
    try { calcularMontosDesdePrecioIGV(); } catch (e) { }
    calcularTotal();
});
function calcularmontosconIGV() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;

            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = "0";
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(numDecimales);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            if (pvf != 0)
                vvf = document.getElementsByClassName("txtvvf")[c].value = ((pvf * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);

            if (isNaN(vvf) || vvf === 0) {
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = (pvf * cantidad).toFixed(numDecimales);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtsubtotal")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txttotal")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularMontosDescuentosCostosCantidad() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value).toFixed(numDecimales);
            if (isNaN(vvf) || vvf === 0) {
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(numDecimales);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = (pvf * cantidad).toFixed(numDecimales);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtsubtotal")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txttotal")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularMontosDesdePrecio() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var totalconstante = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            s_total = parseFloat(document.getElementsByClassName("txtsubtotal")[c].value);
            total = (s_total + (igvLocal * s_total)).toFixed(numDecimales);
            totalconstante = total;
            var cantidad_parcial = cantidad;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            cantidad_parcial += parseFloat(sDatosSeparados[i - 2]);
                        } else {
                            totalconstante = parseFloat(totalconstante) + parseFloat(parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales));
                        }
                        i -= 3;
                    }
                }
            }

            costo = (total / cantidad_parcial).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des3))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des2))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des1))).toFixed(numDecimales);
            pvf = (totalconstante / cantidad).toFixed(numDecimales);
            vvf = (pvf * 100 / (100 + (igvLocal * 100))).toFixed(numDecimales);

            document.getElementsByClassName("txttotal")[c].value = total;
            document.getElementsByClassName("txtcosto")[c].value = costo;
            document.getElementsByClassName("txtcostofacturar")[c].value = costo;
            document.getElementsByClassName("txtpvf")[c].value = pvf;
            document.getElementsByClassName("txtvvf")[c].value = vvf;
            break;
        }
    }
}
function calcularMontosDesdePrecioIGV() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var totalconstante = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            total = document.getElementsByClassName("txttotal")[c].value;
            totalconstante = document.getElementsByClassName("txttotal")[c].value;
            var cantidad_parcial = cantidad;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            cantidad_parcial += parseFloat(sDatosSeparados[i - 2]);
                        } else {
                            totalconstante = parseFloat(totalconstante) + parseFloat(parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales));
                        }
                        i -= 3;
                    }
                }
            }

            costo = (total / cantidad_parcial).toFixed(numDecimales);
            s_total = ((total * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des3))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des2))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des1))).toFixed(numDecimales);
            pvf = (totalconstante / cantidad).toFixed(numDecimales);
            vvf = (pvf * 100 / (100 + (igvLocal * 100))).toFixed(numDecimales);

            document.getElementsByClassName("txtsubtotal")[c].value = s_total;
            document.getElementsByClassName("txtcosto")[c].value = costo;
            document.getElementsByClassName("txtcostofacturar")[c].value = costo;
            document.getElementsByClassName("txtpvf")[c].value = pvf;
            document.getElementsByClassName("txtvvf")[c].value = vvf;
            break;
        }
    }
}

function BloquearDesbloquearCampos(estado) {
    if (estado == "bloquear") {
        txtestado[0].setAttribute("disabled", "");
        cmbsucursaldestino[0].setAttribute("disabled", "");
        txtfechavencimiento[0].setAttribute("disabled", "");
        cmbmoneda[0].setAttribute("disabled", "");
        txtcambiomoneda[0].setAttribute("disabled", "");
        cmbtipopago[0].setAttribute("disabled", "");
        cmbcondicionpago[0].setAttribute("disabled", "");
        txtobservacion[0].setAttribute("disabled", "");
        if (MODELO.estado != "APROBADO")
            btnguardar[0].setAttribute("disabled", "");
        btnnuevo.setAttribute("disabled", "");
        $("#btnimprimir")[0].setAttribute("disabled", "");
        $("#btnaddproducto")[0].setAttribute("disabled", "");
        checkpercepcion.setAttribute("disabled", "");
    } else {
        txtestado[0].removeAttribute("disabled");
        cmbsucursaldestino[0].removeAttribute("disabled");
        txtfechavencimiento[0].removeAttribute("disabled");
        cmbmoneda[0].removeAttribute("disabled");
        txtcambiomoneda[0].removeAttribute("disabled");
        cmbtipopago[0].removeAttribute("disabled");
        cmbcondicionpago[0].removeAttribute("disabled");
        txtobservacion[0].removeAttribute("disabled");
        if (MODELO.estado != "APROBADO" && MODELO.estado != "COMPRA COMPLETADA")
            btnguardar[0].removeAttribute("disabled");
        btnnuevo.removeAttribute("disabled");
        $("#btnimprimir")[0].removeAttribute("disabled");
        $("#btnaddproducto")[0].removeAttribute("disabled");
        checkpercepcion.removeAttribute("disabled");
    }
}

var idproboni;
var codproboni;
var nomproboni;
var precproboni;
var _arrayBonificacionDescuento = [];
var _idlaboratorioBONI = "0";
$(document).on('click', '.btnbonificacion', function (e) {

    var columna = tbllista.row($(this).parents('tr')).data();
    //txtiddetallebonificacion.val(columna[0]);
    precproboni = $(this).parents("tr").find("td").find('.txtcostofacturar').val();
    var index = $(this).parents("tr").find("td").find('.detalle_index').text();
    //console.log(index);
    codproboni = $(this).parents("tr").find("td").find('.detalle_codpro').text();
    nomproboni = $(this).parents("tr").find("td").find('.detalle_nompro').text();
    txtindexbonificacion.val(index);
    idproboni = FN_GETDATOHTML(columna[0], 'detalle_idpro');
    _idlaboratorioBONI = FN_GETDATOHTML(columna[0], 'detalle_idlab');


    $('#modalbonificacion').modal('show');
    if (txtiddetallebonificacion.val().trim() != "") {
        buscarbonificacion(txtiddetallebonificacion.val());
    } else {
        var x = getindexbonificaciones(parseInt(index));
        if (x != -1) {
            var array = _ARRAYBONIFICACIONES[x].array;
            array = array ?? [];
            tblproductosbonificacion.clear().draw(false);
            for (var i = 0; i < array.length; i++) {
                cmbtipobonificacion.val(array[i].tipo);
                tblproductosbonificacion.row.add([
                    array[i].idbonificacion,
                    '<span class="MBN_idproducto" idproducto="' + array[i].idproducto + '">' + array[i].idproducto + '</span>',
                    '<span class="MBN_producto">' + array[i].producto + '</span>',
                    '<span class="MBN_cantidad">' + array[i].cantidad + '</span>',
                    '<span class="MBN_precio">' + array[i].precio.toFixed(4) + '</span>',
                    '<span class="MBN_subtotal">' + (array[i].precio * array[i].cantidad).toFixed(4) + '</span>',
                    '<span class="MBN_bonipara">' + array[i].tipo + '</span>',
                    '<span class="MBN_promocion">' + array[i].promocion + '</span>',
                    '<button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritembonificacion"><i class="fas fa-trash-alt"></i></button>'
                ]).draw(false);
            }
            calculartotalbonificacion();
        }
    }
    if (tblproductosbonificacion.rows().data().length == 0)
        $('#rdbonimismo').click();
});
var array_retornoModalBoni = [];
function setBonificacionTabla() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    //var bonificacion = 0.0;
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {
        var abc = e;
        //var ID = FN_GETDATOHTML(datatable[c][0], 'detalle_index');
        var ID = document.getElementsByClassName("detalle_index")[c].innerHTML;
        if (txtindexbonificacion.val().trim() === ID.toString().trim()) {
            document.getElementsByClassName("btnbonificacion")[c].setAttribute('valor', txttotalbonificacion.val());
            return;
        }
        c++;
    });

    document.getElementsByClassName("returnmodal")[c].innerHTML = "";
    for (var i = 0; i < array_retornoModalBoni.length; i++) {
        document.getElementsByClassName("returnmodal")[c].innerHTML += "|" + array_retornoModalBoni[i].idproducto + "|" + array_retornoModalBoni[i].cantidad + "|" + array_retornoModalBoni[i].precio;
    }
}

var popupanalisis = null;
var idanterioranalisis = '';
$(document).on('click', '.btnanalisisproducto', function (e) {
    var fila = this.parentNode.parentNode;
    var idproducto = this.getAttribute('idproducto');
    var idproveedor = this.getAttribute('idproveedor');
    //var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto?idproducto=' + idproducto + '&&idproveedor=' + idproveedor;
    var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto';
    if (popupanalisis == null || popupanalisis.closed) {
        idanterioranalisis = idproducto;
        popupanalisis = window.open(url, "Análisis de producto", 'width=1100,height=600,Titlebar=NO,Toolbar=NO');
        popupanalisis.addEventListener('DOMContentLoaded', function () {
            popupanalisis.focus();
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();

            //popupanalisis.contenedorEconomato.setAttribute("hidden", "");

            popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
            popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
            popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
        });
    }
    else {
        if (idanterioranalisis != idproducto) {
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();
        }
        idanterioranalisis = idproducto;
        popupanalisis.focus();
        popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
        popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
        popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
    }
});

cmbmoneda.change(function (e) {
    txtidmoneda.val(this.value);
    cmbmoneda.val(this.value);
    for (let i = 0; i < lMonedas.length; i++) {
        if (lMonedas[i].idmoneda == this.value) {
            txtcambiomoneda.val(lMonedas[i].tipodecambio);
        }
    }
});

btnModificar.addEventListener("click", function (e) {
    btnguardar.prop('disabled', false);
    bloquearTabla("desbloquear");
    BloquearDesbloquearCampos("desbloquear");
});

function bloquearTabla(estado) {
    if (estado == "bloquear") {
        var abc = document.getElementById('tbllista');
        var ele = "";
        for (i = 0; ele = abc.getElementsByTagName('input')[i]; i++)
            ele.disabled = true;
        for (i = 0; elebtn = abc.getElementsByTagName('button')[i]; i++)
            elebtn.disabled = true;
    } else {
        var abc = document.getElementById('tbllista');
        var ele = "";
        for (i = 0; ele = abc.getElementsByTagName('input')[i]; i++) {
            var contador = i.toString();
            var ultimoDigito = contador.split('')[contador.length - 1];
            if (ultimoDigito != 3 && ultimoDigito != 4) {
                ele.disabled = false;
            }
        }
        for (i = 0; elebtn = abc.getElementsByTagName('button')[i]; i++)
            elebtn.disabled = false;
    }
}
chkConIgv.addEventListener("change", function (e) {
    var valor = this.value;
    chkConIgv.value = valor;
    if (valor == "true") igvLocal = 0.18;
    else igvLocal = 0;

    var c = 0;
    var filas = document.querySelectorAll('#tbllista tbody tr');
    var datatable = tbllista.rows().data();
    if (filas[0].textContent != "No hay registros") {
        filas.forEach(function (e) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value);
            if (isNaN(vvf)) {//|| vvf === 0
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            document.getElementsByClassName("txtpvf")[c].value = parseFloat(vvf + igvLocal * vvf).toFixed(numDecimales);
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = parseFloat(pvf * cantidad);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtsubtotal")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txttotal")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            c++;
        });
    }
});