//paciente
var txtnumdocpaciente = document.getElementById('txtnumdocpaciente');
var btnbuscarpaciente = document.getElementById('btnbuscarpaciente');
var txtnombrespaciente = document.getElementById('txtnombrespaciente');
var txtidpaciente = document.getElementById('txtidpaciente');
//cliente
var txtidcliente = document.getElementById('txtidcliente');
var txtnumdoccliente = document.getElementById('txtnumdoccliente');
var txtnombrescliente = document.getElementById('txtnombrescliente');
var btnbuscarcliente = document.getElementById('btnbuscarcliente');
var fechanacimientoCliente = "";
var idclienteinicial = 0;

//cliente
btnbuscarcliente.addEventListener('click', function () {
    $('#tabListaCliente').tab('show');
    $('#modalcliente').modal('show');
});

MCC_formregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    let controller = new ClienteController();
    var obj = $('#MCC_formregistro').serializeArray();
    obj[obj.length] = { name: 'jsonpagos', value: JSON.stringify(fngetpagos()) };
    controller.RegistrarEditar(obj, function (data) {
        txtnumdoccliente.value = data.nrodocumento;
        txtnumdoccliente.setAttribute('numdoc', data.nrodocumento);
        data.apematerno = data.apematerno == null ? "" : data.apematerno;
        data.apepaterno = data.apepaterno == null ? "" : data.apepaterno;
        txtnombrescliente.value = data.descripcion + " " + data.apepaterno + " " + data.apematerno;
        txtidcliente.value = data.idcliente;
        MCC_formregistro.reset();
        $('#modalcliente').modal('hide');
    });
});

$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = MCC_tblcliente.row($(this).parents('tr')).data();
    txtidcliente.value = this.getAttribute('idcliente');
    txtnumdoccliente.value = fila[2];
    txtnumdoccliente.setAttribute('numdoc', fila[2]);
    txtnombrescliente.value = fila[3];
    $('#modalcliente').modal('hide');
});
txtnumdoccliente.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (txtnumdoccliente.value.length >= 8) {
            let controller = new ClienteController();
            controller.BuscarCliente(txtnumdoccliente.value, function (data) {
                txtidcliente.value = data.idcliente;
                txtnumdoccliente.value = data.nrodocumento;
                txtnumdoccliente.setAttribute('numdoc', data.nrodocumento);
                txtnombrescliente.value = data.descripcion + ' ' + data.apepaterno + ' ' + data.apematerno;
            });
        }

    }
});
//paciente
txtnumdocpaciente.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (txtnumdocpaciente.value.length >= 1) {
            let controller = new PacienteController();
            controller.BuscarxDocumento(txtnumdocpaciente.value, function (data) {
                console.log(data);
                if (data['mensaje'] == 'ok') {
                    txtidpaciente.value = data['objeto'].idpaciente;
                    txtnumdocpaciente.value = data['objeto'].numdocumento;
                    txtnumdocpaciente.setAttribute('numdoc', data['objeto'].numdocumento);
                    txtnombrespaciente.value = data['objeto'].nombres + ' ' + data['objeto'].apepaterno + ' ' + data['objeto'].apematerno;
                } else {
                    txtidpaciente.value = '';
                    txtnumdocpaciente.value = '';
                    txtnumdocpaciente.setAttribute('numdoc', '');
                    txtnombrespaciente.value = '';
                }
            });
        }

    }
});

btnbuscarpaciente.addEventListener('click', function () {
    $('#tabListaPacientes').tab('show');
    $('#modalpaciente').modal('show');
});

$(document).on('click', '.MCPbtnseleccionarpaciente', function () {
    var fila = MCPtblpaciente.row($(this).parents('tr')).data();
    txtidpaciente.value = this.getAttribute('idpaciente');
    txtnumdocpaciente.value = fila[1];
    txtnombrespaciente.value = fila[2];
    $('#modalpaciente').modal('hide');
});
MCPformregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    MCPfnregistrar(function (data) {
        txtnumdocpaciente.value = data.numdocumento;
        txtnumdocpaciente.setAttribute('numdoc', data.numdocumento);
        txtnombrespaciente.value = data.nombres + " " + (data.apepaterno ?? '') + " " + data.apematerno ?? '';
        txtidpaciente.value = data.idpaciente;
        MCPformregistro.reset();
        $('#modalpaciente').modal('hide');
    });
});


//buscar pedido
$(document).on('click', '.MBPEDbtnseleccionarpedido', function () {
    var fila = this.parentNode.parentNode;
    var idpedido = fila.getAttribute('idpedido');
    let controller = new PedidoController();
    BLOQUEARCONTENIDO('modalbuscarpedido', 'Buscando pedido');
    controller.BuscarPedidoParaFacturar(idpedido, function (data) {
        DESBLOQUEARCONTENIDO('modalbuscarpedido');
        fncargardatapedido(data);
    }, () => { DESBLOQUEARCONTENIDO('modalbuscarpedido'); });

    //VALIDACIÓN PAYJI->
    $("#txtnumdoccliente").attr("disabled", true);
    $("#txtnumdocpaciente").attr("disabled", true);

    $("#btnbuscarcliente").attr("disabled", true);
    $("#btnbuscarpaciente").attr("disabled", true);
    //<-VALIDACIÓN PAYJI
})


function fncargardatapedido(data) {
    fnNuevo();
    $('#modalbuscarpedido').modal('hide');
    data = data[0];
    var cabecera = JSON.parse(data.cabecera)[0];
    var detalle = JSON.parse(data.detalle);
    var adelanto = JSON.parse(data.pago);
    var saldo = 0;
    //$('#txtidpromopack').val(cabecera.idpromopack); //EARTCOD1009
    txtnumdoccliente.value = cabecera.doccliente ?? '';
    txtnumdoccliente.setAttribute('numdoc', cabecera.doccliente);
    txtnombrescliente.value = cabecera.cliente ?? '';
    txtnumdocpaciente.value = cabecera.docpaciente ?? '';
    txtnumdocpaciente.setAttribute('numdoc', cabecera.docpaciente);
    txtnombrespaciente.value = cabecera.paciente ?? '';
    txtidpaciente.value = cabecera.idpaciente ?? '';
    txtidcliente.value = cabecera.idcliente ?? '';
    txtidtablaventapor.value = cabecera.idpedido;
    txtventapor.value = 'pedido';
    lblventapor.innerHTML = 'DE PEDIDO';
    txtadelanto.value = (adelanto[0].pagos.toFixed(2) ?? '0.00');
    
    txtpkdescuento.value = ((cabecera.pkdescuento).toFixed(2) ?? '0.00');//EARTCOD1009
    fechanacimientoCliente = cabecera.fechanacimientoCliente;
    idclienteinicial = cabecera.idcliente;

    if (IDSUCURSAL == 159) {//CALL CENTER
        idcajasucursal = cabecera.idcajasucursal;
        fnListarDocumentoTributario(cabecera.idcajasucursal, null, 1);
    }

    if (detalle == null || detalle.length == 0) {
        alertaSwall('I', 'No se cargo el detalle, asegurese que el pedido sea registrado a través del sistema actual, para ser facturado', '');
        return;
    }
    for (var i = 0; i < detalle.length; i++) {
        saldo += parseFloat(detalle[i].subtotal);
    }
    txttotalcobrar.value = saldo;
    var numero =txttotalredondeado.value;
    txtsaldocobrar1.value = (saldo - txtadelanto.value).toFixed(2);
    for (var i = 0; i < detalle.length; i++) {

        detalle[i].isfraccion = detalle[i].isfraccion ?? false;
        //var datastock = detalle[i].datosstock[0];
        //_PRODUCTOSENDETALLE.push(datastock);      
        var checkfracion = '';
        //var stock = datastock.maxcaja;
        if (detalle[i].isfraccion) {
            checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" checked  disabled/>';
            //stock = data.maxfraccion;
        }

        detalle[i].idprecioproducto = detalle[i].idprecioproducto ?? '';
        detalle[i].idproducto = detalle[i].idproducto ?? '';
        detalle[i].idstock = detalle[i].idstock ?? '';
        var tipoBoton = detalle[i].idpromopack === 0 ? 'btn-danger' : 'btn-primary';

        var fila = tbldetalle.row.add([
            '',
            (i + 1),
            detalle[i].codigoproducto,
            detalle[i].producto,
            detalle[i].lote,
            moment(detalle[i].fechavencimiento).format('DD/MM/YYYY') == 'Invalid date' ? '' : moment(detalle[i].fechavencimiento).format('DD/MM/YYYY'),
            '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number" min="1" disabled/>',
            checkfracion,
            '<span class="precio_detalle font-14">' + detalle[i].precio.toFixed(2) + '</span>',
            '<span class="descuento_detalle font-14"></span>',
            '<span class="importe_detalle font-14">' + (detalle[i].cantidad * detalle[i].precio).toFixed(2) + '</span>',
            '<button class="btn ' + tipoBoton + ' btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '" idpromopack="' + detalle[i].idpromopack + '" disabled><i class="fas fa-trash-alt"></i></button>'

        ]).draw(false).node();
        fila.setAttribute('tipoimpuesto', 'IGV');
        //fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
        (fila).setAttribute('idstock', detalle[i].idstock ?? '');
        (fila).setAttribute('idproducto', detalle[i].idproducto ?? '');
        (fila).setAttribute('idprecioproducto', detalle[i].idprecioproducto ?? '');
        (fila).setAttribute('idpromopack', detalle[i].idpromopack ?? '');
        (fila).setAttribute('cantidadDescuentopack', detalle[i].cantidadDescuentopack ?? '');
        (fila).setAttribute('cantidadPacks', detalle[i].cantidadPacks ?? '');
        (fila).setAttribute('detp_codigo', detalle[i].detallecodigo??'');
        //(fila).setAttribute('codigoproducto', detalle[i].codigoproducto ?? '');//EARTCOD1009
        if (detalle[i].precio.toFixed(2) == '0.00') {
            (fila).setAttribute('tipo', 'bonificacion');
            (fila).setAttribute('class', 'even table-success');
        }

        //EARTCOD1009
        if (detalle[i].idpromopack != null) {
            (fila).setAttribute('idpromopack', detalle[i].idpromopack ?? '');
        }
        //EARTCOD1009

        console.log(detalle[i]);
    }
    fncalcularmontos();
}

//buscar proforma
txtcodproforma.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (txtcodproforma.value.length > 3) {
            let controller = new ProformaController();
            var obj = {
                rangodias: 5,
                codigo: txtcodproforma.value
            };
            controller.GetProformaCompletaxCodigoProforma(obj, fncargardatosproforma);
        }

    }
});
$(document).on('click', '.btnseleccionarproforma', function () {
    var idproforma = this.getAttribute('idproforma');
    var codproforma = this.getAttribute('codigoproforma');
    $('#modalproforma').modal('hide');

    txtcodproforma.value = codproforma;
    let controller = new ProformaController();
    var obj = {
        rangodias: 5,
        idproforma: idproforma
    };
    controller.GetProformaCompleta(obj, fncargardatosproforma);
});
function fncargardatosproforma(data) {
    _PRODUCTOSENDETALLE = [];
    var cabecera = JSON.parse(data[0].CABECERA)[0];
    var detalle = JSON.parse(data[0].DETALLE);

    txtnumdoccliente.value = cabecera.numdoccliente;
    txtnombrescliente.value = cabecera.nombrecliente;
    txtidcliente.value = cabecera.idcliente;
    txtidtablaventapor.value = cabecera.idproforma;
    txtidpaciente.value = cabecera.idpaciente ?? '';
    txtnumdocpaciente.value = cabecera.docpaciente ?? '';
    txtnombrespaciente.value = cabecera.paciente ?? '';
    txtventapor.value = 'proforma';
    lblventapor.innerText = 'DE PROFORMA';
    tbldetalle.clear().draw(false);
    for (var i = 0; i < detalle.length; i++) {

        detalle[i].isfraccion = detalle[i].isfraccion ?? false;
        detalle[i].datosstock = detalle[i].datosstock ?? [];
        var datastock = detalle[i].datosstock[0];
        if (datastock == undefined || datastock == null) {//validacion para proformas sin idstock
            datastock = {
                maxcaja: 100
            }
        }
        _PRODUCTOSENDETALLE.push(datastock);
        var checkblister = '';
        var checkfracion = '';
        var checkdisabled = '';
        var stock = datastock.maxcaja;
        if (detalle[i].isfraccion) {
            checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" checked  multiplo="' + detalle[i].multiplo + '"/>';
            stock = datastock.maxfraccion;
        }
        else {
            if (detalle[i].multiplo === 1 || detalle[i].multiplo === 0 || detalle[i].multiplo === null)
                checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado   multiplo="' + detalle[i].multiplo + '"/>';
        }


        //if (datastock.venderblister) {
        //    if (detalle[i].isblister) {
        //        stock = datastock.maxblister;
        //        checkblister = '<input   class="checkblister_detalle" type="checkbox" min="1" checked blister="' + datastock.multiploblister + '" />';

        //    }
        //}


        var fila = tbldetalle.row.add([
            '',
            (i + 1),
            detalle[i].codigoproducto,
            detalle[i].producto,
            detalle[i].lote,
            detalle[i].fechavencimiento,
            '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number" min="1" max="' + stock + '"/>',
            checkfracion,
            //checkblister,
            '<span class="precio_detalle font-14">' + detalle[i].precioigv.toFixed(2) + '</span>',
            '<span class="descuento_detalle font-14"></span>',
            '<span class="importe_detalle font-14">' + (detalle[i].cantidad * detalle[i].precioigv).toFixed(2) + '</span>',
            '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '"><i class="fas fa-trash-alt"></i></button>'

        ]).draw(false).node();
        fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
        (fila).setAttribute('idstock', detalle[i].idstock ?? '');
        (fila).setAttribute('idproducto', detalle[i].idproducto ?? '');
        (fila).setAttribute('idprecioproducto', detalle[i].idprecioproducto ?? '');
        //(fila).setAttribute('incentivo', 0);
        (fila).setAttribute('tipo', detalle[i].tipo);
        if (detalle[i].tipo == 'bonificacion') {
            (fila).classList.add('table-success');
            fila.getElementsByClassName('cantidad_detalle')[0].disabled = true;
            try { fila.getElementsByClassName('checkfraccion_detalle')[0].disabled = true; } catch (e) { }
            //try { fila.getElementsByClassName('checkblister_detalle')[0].disabled = true; } catch (e) { }
        }
    }
    fncalcularmontos();
}