var formregistro = document.getElementById('formregistro');
//var cmbidtipoformulacion = document.getElementById('cmbidtipoformulacion');
var cmbtiporegistro = document.getElementById('cmbtiporegistro');
var cmbidtipopedido = document.getElementById('cmbidtipopedido');
var cmbcanalventas = document.getElementById('cmbcanalventas');
var cmbIdLineaAtencion = document.getElementById('cmbIdLineaAtencion');
var cmbtipoentrega = document.getElementById('cmbtipoentrega');
var cmbrecogeren = document.getElementById('cmbrecogeren');
var cmbsucursalfactura = document.getElementById('cmbsucursalfactura');
var cmblaboratorio = document.getElementById('cmblaboratorio');
var cmbdiagnostico = document.getElementById('cmbdiagnostico');
var cmbtipopaciente = document.getElementById('cmbtipopaciente');
var cmbtipopago = document.getElementById('cmbtipopago');

var txtidorigenreceta = document.getElementById('txtidorigenreceta');
var txtorigenreceta = document.getElementById('txtorigenreceta');
var btnbuscarorigenreceta = document.getElementById('btnbuscarorigenreceta');

var txtdoccliente = document.getElementById('txtdoccliente');
var txtidcliente = document.getElementById('txtidcliente');
var txtnombrescliente = document.getElementById('txtnombrescliente');
var btnbuscarcliente = document.getElementById('btnbuscarcliente');

var txtdocpaciente = document.getElementById('txtdocpaciente');
var txtidpaciente = document.getElementById('txtidpaciente');
var txtnombrepaciente = document.getElementById('txtnombrepaciente');
var btnbuscarpaciente = document.getElementById('btnbuscarpaciente');

var cmbtipodocmedico = document.getElementById('cmbtipodocmedico');
var txtnumcolegiatura = document.getElementById('txtnumcolegiatura');
var txtidmedico = document.getElementById('txtidmedico');
var btnbuscarmedico = document.getElementById('btnbuscarmedico');
var txtnombremedico = document.getElementById('txtnombremedico');

var txtobservacion = document.getElementById('txtobservacion');
var tbodydetalle = document.getElementById('tbodydetalle');
var lbltotal = document.getElementById('lbltotal');

var divadelanto = document.getElementById('divadelanto');
var txtadelanto = document.getElementById('txtadelanto');
var txtsaldo = document.getElementById('txtsaldo');


//adelanto
var cmbtipotarjeta = document.getElementById('cmbtipotarjeta');
var txtnumtarjeta = document.getElementById('txtnumtarjeta');
//Agregado LFRW20
var total = 0;
var pkdescuento = 0;//EARTCOD1009
var totalfinal = 0;//EARTCOD1009

var txtnumproforma = document.getElementById('txtnumproforma');


var btnguardar = document.getElementById('btnguardar');
var btnimagen = document.getElementById('btnimagen');
var btnlimpiar = document.getElementById('btnlimpiar');
var btnlistasucursal = document.getElementById('btnlistasucursal');
var btnlistacliente = document.getElementById('btnlistacliente');
var btndelivery = document.getElementById('btndelivery');
var btndatospago = document.getElementById('btndatospago');
var btnguardarproforma = document.getElementById('btnguardarproforma');
var btnhistorial = document.getElementById('btnhistorial');

var tbldetalle;



$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: false,
        //"columnDefs": [
        //    {
        //        "targets": [0],
        //        "visible": false,
        //        "searchable": false
        //    }
        //]
    });
    limpiartabla();
    int();
    CDDEfniniciardatosdelivery();
    fnLlenarDatosClientesVarios("99999999");
    fnLlenarDatosPacienteVarios("99999999");
    //let tipopagocontroller = new TipoPagoController();
    //tipopagocontroller.LLenarComboParaVena('cmbtipopago', _TIPOPAGO);

    //SCRIPT PARA SELECCIONAR POR DEFAULT LA OPCION OTROS
    //$("#cmbIdLineaAtencion").val("7");
    //$('#cmbIdLineaAtencion').change();
});

function limpiartabla() {
    var index = tbldetalle.rows().data().length;
    if (index < 1) $("#tbldetalle tbody tr").remove();
}

function int() {
    //cmbidtipoformulacion.value = 'FORMULACION MAGISTRAL';
    cmbsucursalfactura.value = IDSUCURSAL;
    fnlistarlaboratorioxsucursal();
    let diagnostico = new DiagnosticoController();
    var fn = diagnostico.BuscarDignosticoSelect2();
    $('#cmbdiagnostico').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese descripción",
    });
    var colegiomedico = new ColegioController();
    colegiomedico.ListarColegiosCombo('cmbtipodocmedico');
    let tipopagocontroller = new TipoPagoController();
    tipopagocontroller.Listar(null, function (data) {
        //cmbtipopago.innerHTML = '';
        var option;
        for (var j = 0; j < data.length; j++) {
            option = document.createElement('option');
            option.value = data[j].idtipopago;
            option.text = data[j].descripcion;
            if (data[j].descripcion == 'EFECTIVO')
                cmbtipopago.appendChild(option);
            else if (data[j].descripcion == 'TARJETA')
                cmbtipopago.appendChild(option);
            else if (data[j].descripcion == 'CREDITO') {
                option.disabled = true;
                option.setAttribute("style", "background: #DEE2E6;");
                cmbtipopago.appendChild(option);
            }
            else if (data[j].descripcion == 'PAGO CONTRA ENTREGA') {
                if (cmbtiporegistro.value == 'SUCURSAL')
                    option.disabled = true;
                option.setAttribute('tipo', 'delivery');
                option.disabled = true;
                option.setAttribute("style", "background: #DEE2E6;");
                cmbtipopago.appendChild(option);
            }
            else if (data[j].descripcion == 'DEPOSITO') {
                option.disabled = true;
                option.setAttribute("style", "background: #DEE2E6;");
                cmbtipopago.appendChild(option);
            }
        }
    });
}
cmbtiporegistro.addEventListener('change', function () {
    if (cmbtiporegistro.value == 'DELIVERY') {
        btndelivery.disabled = false;
        var option = cmbtipopago.getElementsByTagName('option');
        for (var i = 0; i < option.length; i++) {
            if (option[i].getAttribute('tipo') == 'delivery')
                option[i].disabled = false;
        }

    } else {
        var option = cmbtipopago.getElementsByTagName('option');
        for (var i = 0; i < option.length; i++) {
            if (option[i].getAttribute('tipo') == 'delivery')
                option[i].disabled = true;
        }
    }

});

//cmbidtipoformulacion.addEventListener('change', function () {
//    var idsucursal = IDSUCURSAL;
//    if (cmbidtipoformulacion.value === 'FORMULACION MAGISTRAL') {
//        //lblnameclientecon.innerText = 'Datos de cliente';
//        cmbtipopaciente.value = '';
//        MCPcmbtipopaciente.value = 'PERSONA';
//        MCPfnaccionestipopaciente();
//    } else if (cmbidtipoformulacion.value === "VETERINARIA") {
//        cmbtipopaciente.value = '8';
//        MCPcmbtipopaciente.value = 'MASCOTA';
//        MCPfnaccionestipopaciente();
//        if (txtidcliente.value != '') {
//            MCPidtutor.value = txtidcliente.value;
//            MCPlblnombretutor.innerText = txtdoccliente.value + ' ' + txtnombrescliente.value;
//        }
//    } else if (cmbidtipoformulacion.value === 'CANNABIS') {
//        //lblnameclientecon.innerText = 'Datos del tutor';
//        cmbtipopaciente.value = '';
//        MCPcmbtipopaciente.value = 'PERSONA';
//        MCPfnaccionestipopaciente();
//        cmbsucursalfactura.value = '154';
//        //option.value = '153';
//        //option.text = 'LAB OLIVOS';
//        select_laboratorio();
//    } else {
//        cmbsucursalfactura.value = idsucursal;
//        cmblaboratorio.value = '';
//    }
//});

cmbsucursalfactura.addEventListener('change', function () {
    $('#tbldetalle tbody tr').remove();
    $('#lblsubtotal').html('');
    $('#lblpkdescuento').html('');
    $('#lbltotal').html('');
    MLStxtidsucursal.value = cmbsucursalfactura.value;
    fnlistarlaboratorioxsucursal();
});

function select_laboratorio() {
    MLStxtidsucursal.value = cmbsucursalfactura.value;
    fnlistarlaboratorioxsucursal();
}

btnlistasucursal.addEventListener('click', function () {
    if (cmbsucursalfactura.value == '') {
        mensaje('I', 'Seleccione la sucursal que factura, para mostrar las listas de precios');
        return;
    }
    if (cmbcanalventas.value == '') {
        mensaje('I', 'Seleccione el canal de ventas que factura, para mostrar las listas de precios');
        return;
    }//ADD
    if (cmbIdLineaAtencion.value == '') {
        mensaje('I', 'Seleccione una linea de atención, para mostrar las listas de precios');
        return;
    }//ADD
    //if (txtidcliente.value == '') {
    //    mensaje('I', 'Seleccione un cliente, para mostrar las listas de precios');
    //    return;
    //}//ADD
    MLStxtidsucursal.value = cmbsucursalfactura.value;
    $('#modallistaprecios').modal('show');
});

btndelivery.addEventListener('click', function () {
    $('#modaldatosdelivery').modal('show');
});

btndatospago.addEventListener('click', function () {
    $('#modaldatospago').modal('show');
    var hasdata = MPfngetdatosdatapagos();
    if (hasdata.length == 0)
        formpagos.monto.value = lbltotal.innerText;
});

$(document).on('change', '.txtcantidad', function (e) {
    fncalculartotal();
    var cantidad = this.value;
    if (cantidad != '') {
        fncalcularbonificacion(this, 'pedido');
    }

    var idstock = $(this).parents("tr").attr("idstock");//EARTCOD1021
    var monto = $(this).parents("tr").find("td").eq(8).html()//EARTCOD1021

    PromoProductoBuscarObsequio(idstock);//EARTCOD1021
  
    quitarProductosObsequioPorDisminucion(idstock, monto);//EARTCOD1021
});

$(document).on('keyup', '.txtcantidad', function (e) {
    fncalculartotal();
    var cantidad = this.value;
    if (cantidad != '') {
        fncalcularbonificacion(this, 'pedido');
    }

    var idstock = $(this).parents("tr").attr("idstock");//EARTCOD1021
    var monto = $(this).parents("tr").find("td").eq(8).html()//EARTCOD1021
    //PromoProductoBuscarObsequio(idstock);//EARTCOD1021

    var itemcantmax = $(this).parents("tr").find("input").attr("max");//EARTCOD1021
    var itemcant = $(this).parents("tr").find("input").val();//EARTCOD1021
    if (itemcant <= itemcantmax) {//EARTCOD1021
        PromoProductoBuscarObsequio(idstock);//EARTCOD1021
        if ($(this).parents("tr").find("input").attr("value") == 1) {
            PromoProductoBuscarObsequio(idstock);
        }
    }//EARTCOD1021
    

    quitarProductosObsequioPorDisminucion(idstock, monto);//EARTCOD1021
});

btnlimpiar.addEventListener('click', function () {
    fnlimpiar();
});

txtadelanto.addEventListener('change', function () {
    var total = parseFloat(lbltotal.innerText);
    var pago = parseFloat(txtadelanto.value);
    txtsaldo.value = ((total ?? 0) - (pago ?? 0)).toFixed(2)

});

txtadelanto.addEventListener('keyup', function () {
    var total = parseFloat(lbltotal.innerText);
    var pago = parseFloat(txtadelanto.value);
    txtsaldo.value = ((total ?? 0) - (pago ?? 0)).toFixed(2)
});

$(document).on('click', '.btneliminar', function () {
    var fila = this.parentNode.parentNode;
    fila.remove();

    //var idstock = $(this).parents("tr").attr("idstock");//EARTCOD1021
    var idproducto = $(this).parents("tr").attr("idproducto");//EARTCOD1021
    quitarProductosObsequio(idproducto)//EARTCOD1021
    fncalculartotal();
});

cmbtipopago.addEventListener('change', function () {
    var tipopago = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    if (tipopago == 'TARJETA') {
        let controller = new BancoController();
        controller.ListarTipoTarjeta('cmbtipotarjeta', null);
        divtarjeta.classList.remove('ocultar');
    } else {
        divtarjeta.classList.add('ocultar');
    }
    if (tipopago == 'DEPOSITO') {
        divadelanto.classList.add('ocultar');
        txtadelanto.value = '';
        txtsaldo.value = '';
        $('#modaldatospago').modal('show');
        btndatospago.disabled = false;
        var hasdata = MPfngetdatosdatapagos();
        if (hasdata.length == 0)
            formpagos.monto.value = lbltotal.innerText;
    }
    else {
        btndatospago.disabled = true;
        fnverificaradelantotipopago();
    }
});

btnlistacliente.addEventListener('click', function () {
    if (txtidcliente.value == '') {
        mensaje('I', 'Seleccione cliente');
        return;
    }
    MLCtxtidcliente.value = txtidcliente.value;
    MLCfnbuscarproductos();
});










formregistro.addEventListener('submit', function (e) {
    e.preventDefault();

    var detalle = fngetdetalle();
    var tipo = cmbidtipopedido.options[cmbidtipopedido.selectedIndex].text;

    if (tipo != 'COMPLEMENTARIO-TERCERO') {
        if (txtidcliente.value == '') {
            mensaje("W", "Seleccione un cliente.");
            return;
        }
        var pasaValidacion = true;
        var verificarTipoItem = detalle.filter(x => x.tipoitem == "PT");
        if (verificarTipoItem.length == detalle.length) {
            if (total < 700) {
                pasaValidacion = false;
            }
        }
        if (pasaValidacion) {
            if (txtidpaciente.value == '') {
                mensaje("W", "Seleccione un paciente.");
                return;
            }
        }

        for (var i = 0; i < detalle.length; i++) {
            if (detalle[i].tipopedido_codigo != 2 && detalle[i].tipopedido_codigo != 7) {
                if (pasaValidacion) {
                    if (txtidmedico.value == '') {
                        mensaje("W", "Seleccione un médico.");
                        return;
                    }
                }

                if (txtidorigenreceta.value == '') {
                    mensaje("W", "Seleccione el origen de receta.");
                    return;
                }
            }
            //if (tipo.trim() != 'COMPLEMENTARIO FM' && tipo.trim() != 'COMPLEMENTARIO PT') {
            //    if (pasaValidacion) {
            //        if (txtidmedico.value == '') {
            //            mensaje("W", "Seleccione un médico.");
            //            return;
            //        }
            //    }

            //    if (txtidorigenreceta.value == '') {
            //        mensaje("W", "Seleccione el origen de receta.");
            //        return;
            //    }
            //}
        }
    }
    //Agregado LFRW20
    if (txtidcliente.value == 41927 && total>=700) {
        mensaje("W", "La venta es igual o mayor a 700, debe registrar un cliente especifico");
        return;
    }
    var validardetalle = fnvalidardatosdetalle();
    if (validardetalle == 'x')
        return;
    var detalle = fngetdetalle();
    if (detalle.length == 0) {
        mensaje('I', 'No hay datos en el detalle');
        return;
    }
    var datadelivery = '';
    if (cmbtiporegistro.value == 'DELIVERY') {
        var validacion = CDDEfnverificardatosdeliveryguardar();
        if (validacion != 'ok') {
            mensaje('W', 'Complete los datos del delivery');
            return;
        } else {
            datadelivery = $('#formdatosdelivery').serializeArray();
        }
    }
    var pagos = fngetpago();
    if (pagos == 'x')
        return;

    swal({
        title: '¿Desea registrar pedido?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {

            //EARTCOD1011
            if ($('#txtadelanto').val() == 0) {
                $('#txtadelanto').val("");
                $('#cmbtipopago').val("");
            }
            //--EARTCOD1011

            form = $('#formregistro').serializeArray();
            form[form.length] = { name: 'jsondetalle', value: JSON.stringify(detalle) };
            var obj = {
                pedido: CONVERT_FORM_TO_JSON(form),
                delivery: CONVERT_FORM_TO_JSON(datadelivery),
                pagos: pagos,
                idtipotarjeta: $("#cmbtipotarjeta").val(),//EARTCOD1011
                pkdescuento: $("#lblpkdescuento").text()//EARTCOD1009
            };
            //console.log("este es el objeto");
            //console.log(obj);

            let controller = new PedidoController();
            console.log(pagos);
            BLOQUEARCONTENIDO('formregistro', 'Guardando pedido ...');
            controller.RegistrarPedido(obj, fnaccionregistropedido, function () {
                DESBLOQUEARCONTENIDO('formregistro');
                
            });
            //fngetadelanto();
        }
        else
            swal.close();
    });
});

btnguardarproforma.addEventListener('click', function () {

    var detalle = fngetdetalleproforma();
    if (detalle.length == 0) {
        mensaje('I', 'No hay datos en el detalle');
        return;
    }
    swal({
        title: '¿Desea registrar proforma?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {

            var obj = {
                idcliente: txtidcliente.value,
                idpaciente: txtidpaciente.value,
                idmedico: txtidmedico.value,
                idorigenreceta: txtidorigenreceta.value,
                tipo: 'pedido',

                jsondetalle: JSON.stringify(detalle)
            };
            let controller = new ProformaController();
            BLOQUEARCONTENIDO('formregistro', 'Guardando pedido ...');
            controller.RegistrarProforma(obj, '', function () {
                DESBLOQUEARCONTENIDO('formregistro'); fnlimpiar();
            }, () => { DESBLOQUEARCONTENIDO('formregistro'); });
        }
        else
            swal.close();
    });
});






var fechaEstaticaVista;

function fnGetHistorial() {
    var datosExcel = [];
    var url = ORIGEN + "/Pedidos/Pedido/GetHistorialVentas1";
    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');
    $.post(url).done(function (data) {

        DESBLOQUEARCONTENIDO('cardreport');
        datosExcel = data; 
        console.log(datosExcel);
        var registroExcel = data[0];

        var obj = {
            delivery: {
                Fecha: registroExcel["FECHA"],
                Sucursal: registroExcel["SUCURSAL"],
                // Continuar con las demás propiedades
            },
            idtipotarjeta: null, // Asumiendo que no lo tienes en el registro Excel
            pagos: [
                {
                    TipoPago: registroExcel["TIPO DE PAGO"],
                    // Y así sucesivamente...
                }
            ],
            pedido: {
                Producto: registroExcel["FORMULA MAGISTRAL"],
                Cantidad: registroExcel["CANTIDAD"],
                // Continuar con las demás propiedades
            },
            pkdescuento: "0.00" // Esto es un valor fijo según tu ejemplo
        };

        // Aquí envías el objeto al servidor
        controller.ddd(obj, fnaccionregistropedido, function () {
            DESBLOQUEARCONTENIDO('cardreport');
        });


    }).fail(function (error) {
       
        console.error("Error obteniendo datos:", error);
    });
}















function fnlistarlaboratorioxsucursal() {
    let controller = new SucursalController();
    controller.ListarLaboratorioSucursal(cmbsucursalfactura.value, 'cmblaboratorio');
}

function fnlimpiar() {
    _ARRAYPRODUCTOS = [];
    formregistro.reset();
    txtidorigenreceta.value = '';
    txtorigenreceta.value = '';
    txtdoccliente.value = '';
    txtnombrescliente.value = '';
    cmbdiagnostico.innerText = '';
    cmbdiagnostico.value = '';
    txtdoccliente.setAttribute('numdoc', '');
    //cmbidtipoformulacion.value = 'FORMULACION MAGISTRAL';
    tbodydetalle.innerHTML = '';
    lbltotal.innerText = '';
    btndatospago.disabled = true;
    txtadelanto.value = '';
    txtsaldo.value = '';
    cmbsucursalfactura.value = IDSUCURSAL;
    divadelanto.classList.remove('ocultar');
    divadelanto.classList.add('ocultar');
    CDDEfnlimpiar();
    MPfnlimpiarmodalpagos();
    txtidpaciente.value = '';
    txtidcliente.value = '';
    txtidmedico.value = '';
    $("#lblpkdescuento").text('');//EARTCOD1009
    $("#lblsubtotal").text('');//EARTCOD1009
}

function fngetdetalle() {

    var array = [];
    var filas = document.querySelectorAll('#tbodydetalle tr');

    // RJ45
    //console.log("estas son las filas");
    //console.log(filas);
    //var total = 0;  LFRW20
     total = 0;
    filas.forEach(function (e) {
        var obj = new PedidoDetalle();
        var montoU = (parseFloat(e.getElementsByClassName('precio')[0].innerText) ?? 0);
        var desc = (parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0);

        var cmbtipopedido = e.querySelector('.cmbtipopedido');
        if (cmbtipopedido) {
            var tipopedido_codigopru = parseInt(cmbtipopedido.value, 10);
            obj.tipopedido_codigo = tipopedido_codigopru;
        }

        desc = montoU * (desc / 100);
        desc = montoU - desc;
        var cantidadinicial = parseInt(e.getAttribute("cantidadpacks"));
        obj.idpromopack = e.getAttribute("idpromopack") != null ? e.getAttribute("idpromopack") : "";//EARTCOD1009

        obj.idprecioproducto = e.getAttribute('idprecioproducto') != "null" ? e.getAttribute('idprecioproducto') : "";
        obj.idstock = e.getAttribute('idstock');
        obj.idproducto = e.getAttribute('idproducto');
        obj.codigoprecio = e.getAttribute('codigoPrecio');
        obj.precio = desc;//parseFloat(e.getElementsByClassName('subtotal')[0].innerText) ?? 0;
        obj.cantidad = parseFloat(e.getElementsByClassName('txtcantidad')[0].value) ?? 0;
        if (isNaN(obj.cantidad)) obj.cantidad = 0;
        obj.subtotal = parseFloat(e.getElementsByClassName('subtotal')[0].innerText) ?? 0;
        obj.descripcion = e.getElementsByClassName('formula')[0].innerText;
        obj.tipoitem = e.getElementsByClassName('tipoitem')[0].innerText;
        obj.idtipoformulacion = e.getElementsByClassName('tpform')[0].lastChild.value;

        obj.idlaboratorio = cmblaboratorio.value;
        obj.cantidadPacks = cantidadinicial;

        obj.tipopedido_codigo = parseInt(cmbtipopedido.value, 10);
        //obj.estadoProceso = "PENDIENTE";
        if (e.getElementsByClassName('isfraccion').length > 0)
            obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        else
            obj.isfraccion = false;
        //obj.descuento = parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0;
        total += obj.subtotal;
        array.push(obj);
    });
    return array;
}

function fngetdetalleproforma() {
    var array = [];
    var filas = document.querySelectorAll('#tbodydetalle tr');
    //var total=0; LFRW20
    total = 0;
    filas.forEach(function (e) {
        var obj = new ProformaDetalle();
        obj.idprecioproducto = e.getAttribute('idprecioproducto');
        obj.idstock = e.getAttribute('idstock');
        obj.idproducto = e.getAttribute('idproducto');
        obj.precio = parseFloat(e.getElementsByClassName('precio')[0].innerText) / (1 + IGV) ?? 0;
        obj.descu = parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0;
        obj.precioigv = parseFloat(e.getElementsByClassName('precio')[0].innerText) ?? 0;
        obj.cantidad = parseFloat(e.getElementsByClassName('txtcantidad')[0].value) ?? 0;
        if (isNaN(obj.cantidad)) obj.cantidad = 0;
        obj.formulacion = e.getElementsByClassName('formula')[0].innerText;

        if (e.getElementsByClassName('isfraccion').length > 0)
            obj.isfraccion = e.getElementsByClassName('isfraccion')[0].checked;
        else
            obj.isfraccion = false;

        array.push(obj);
    });
    return array;
}

function fncalculartotal() {
    //tbldetalle.clear().draw(false);
    var filas = document.querySelectorAll('#tbodydetalle tr');
    //var total=0; LFRW20
    total = 0;
    var totalmontopack = 0;//EARTCOD1009             
    var totalmontopackreal = 0;//EARTCOD1009 
    var idpromopack = "";//EARTCOD1009       
    var idpromopack_temp = "";//EARTCOD1009 
    var contadorValida = 0;
    filas.forEach(function (e) {
        var precio = parseFloat(e.getElementsByClassName('precio')[0].innerText) ?? 0;
        var cantidad = parseFloat(e.getElementsByClassName('txtcantidad')[0].value) ?? 0;
        var descuento = parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0;
        var tipoitem = e.getElementsByClassName('tipoitem')[0].innerText ?? "";
        if (isNaN(cantidad)) cantidad = 0;
        if (isNaN(descuento)) descuento = 0;

        var subtotal = 0;
        subtotal = (precio * cantidad);
        descuento = subtotal * (descuento / 100);
        subtotal = (subtotal - descuento);
        total += subtotal;
        //e.getElementsByClassName('subtotal')[0].innerText = subtotal;
        e.getElementsByClassName('subtotal')[0].innerText = subtotal.toFixed(2);//EARTCOD1008.1

        //EARTCOD1009
        idpromopack_temp = idpromopack;
        idpromopack = $(e).attr("idpromopack") != null ? $(e).attr("idpromopack") : "";
        var preciopromo = $(e).attr("preciopack") != null ? parseFloat($(e).attr("preciopack")).toFixed(2) : 0;

        //funcion para obtener el monto total de packs sin duplicar
        if (idpromopack != idpromopack_temp) {
            totalmontopack += preciopromo * parseInt($("#mMCPP_txtCantidad").val());
        }

        //funcion para obtener el monto total con la cantidad real sin promocion
        //se sumara solamente las filas que no contienen atributo idpromopack
        if ($(e).attr("idpromopack") != undefined) {
            totalmontopackreal += precio * cantidad;
        }
        //-EARTCOD1009

        if (tipoitem == "FM") {
            contadorValida += 1;

        }





    });

    //EARTCOD1009
    var pkdescuento = 0;
    pkdescuento = ((totalmontopackreal - totalmontopack)).toFixed(2);
    $("#lblpkdescuento").text(pkdescuento);
    $("#lblsubtotal").text((parseFloat(total)).toFixed(2));
    //-EARTCOD1009

    //lbltotal.innerText = (parseFloat(total)).toFixed(2);
    lbltotal.innerText = (parseFloat(total) - pkdescuento).toFixed(2);//EARTCOD1009
    var totalValida = (parseFloat(total) - pkdescuento).toFixed(2);
    if (contadorValida == 0) {//Si todos son PT
        if (totalValida >= 700) {//Si es mayor o igual a 700
            if (txtidcliente.value == "41927") {//Si es cliente varios
                txtnombrescliente.value = '';
                txtdoccliente.setAttribute('numdoc', '');
                txtdoccliente.value = '';
                txtidcliente.removeAttribute('value');

                //txtidpaciente.value = "";
                //txtdocpaciente.value = "";
                //txtdocpaciente.setAttribute('numdoc', "");
                //txtnombrepaciente.value = "";
            }
        } else {
            if (txtidpaciente.value == "") {
                fnLlenarDatosPacienteVarios("99999999");
            }
        }
    } else {//Si hay FM
        if (txtidpaciente.value == "156653") {//Si es paciente varios
            //txtnombrescliente.value = '';
            //txtdoccliente.setAttribute('numdoc', '');
            //txtdoccliente.value = '';
            //txtidcliente.removeAttribute('value');

            txtidpaciente.value = "";
            txtdocpaciente.value = "";
            txtdocpaciente.setAttribute('numdoc', "");
            txtnombrepaciente.value = "";
        }
    }
    fnverificaradelantotipopago();
}

function fnvalidardatosdetalle() {
    var array = [];
    var filas = document.querySelectorAll('#tbodydetalle tr');
    for (var i = 0; i < filas.length; i++) {
        var e = filas[i];
        var tipoitem = e.getElementsByClassName('tipoitem')[0].innerText;
        var formula = e.getElementsByClassName('formula')[0].innerText;
        if (formula.trim() == '') {
            mensaje('W', 'Ingrese formula para el item ' + (i + 1));
            return 'x';
        }
        if (tipoitem == 'FM') {
            if (cmblaboratorio.value == '') {
                mensaje('W', 'Seleccione laboratorio');
                return 'x';
            }
        }
    }

    return 'ok';
}





function fnaccionregistropedido(data) {
    //EARTCOD1009
    //console.log('HELLO WORLD');
    //console.log(data);
    //if (data.mensaje) {
        
    //}
    //-EARTCOD1009
    alertaSwall('S', 'Pedido N° ' + data.idpedido + ' generado!!!', '');
    DESBLOQUEARCONTENIDO('formregistro');
    if (_arrayArchivosPedido.length != 0)
        MSIregistrarimagenes(data.idpedido);
    fnlimpiar();
    swal({
        title: '¿Desea registrar la venta?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            location.href = ORIGEN + "/Ventas/Venta/VentaDirecta?idpedido=" + data.idpedido;
        }
        else
            swal.close();
    });
    fnimprimir(data.idpedido);
}

function fnverificaradelantotipopago() {
    var tipopago = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    if (tipopago == 'EFECTIVO' || tipopago == 'TARJETA') {
        divadelanto.classList.remove('ocultar');
        txtadelanto.value = parseFloat(0).toFixed(2);
        txtsaldo.value = parseFloat(lbltotal.innerText) - parseFloat(txtadelanto.value);
    }
    else {
        divadelanto.classList.add('ocultar');
        txtadelanto.value = '';
        txtsaldo.value = '';
    }
}

function fngetadelanto(idpedido) {
    var obj;
    var monto = lbltotal.innerText;
    var idpago = cmbtipopago.value;
    var pagado = txtadelanto.value;
    var ttarjeta = '', ntarjeta = ''; //= cmbtipotarjeta.value;
    if (idpago == '10004') {
        ttarjeta = cmbtipotarjeta.value;
        ntarjeta = txtnumtarjeta.value;
    }
    if (monto > 0) {
        obj = {
            idtipopago: idpago,
            total: monto,
            pagado: pagado,
            numtarjeta: ntarjeta,
            idtipotarjeta: ttarjeta,
            iddpedido: idpedido
        }
        let controller = new PedidoController();
        controller.RegistrarAdelanto(obj);
    }
}

function fngetpago() {
    var tipopago = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    var array = [];
    if (tipopago == 'DEPOSITO') {
        array = MPfngetdatosdatapagos();
        if (array.length == 0) {
            mensaje('I', 'Ingrese los datos del deposito');
            return 'x';
        }
        if (parseFloat(MPlbltotal.innerText) != parseFloat(lbltotal.innerText)) {
            mensaje('I', 'Los montos de pago y deposito no coinciden');
            return 'x';
        }
        for (var i = 0; i < array.length; i++) {
            array[i].idtipopago = cmbtipopago.value;
        }
    } else {
        var obj = new PagosPedido();

        obj.idtipopago = cmbtipopago.value;
        if (tipopago == "EFECTIVO" || tipopago == "TARJETA")
            obj.monto = txtadelanto.value;
        else if (tipopago == 'CREDITO')
            obj.monto = lbltotal.innerText;
        array.push(obj);
    }

    return array;
}

function fnimprimir(idpedido) {

    var href = ORIGEN + '/Pedidos/Pedido/Imprimirformato1/' + idpedido;
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR PEDIDO');
}

$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        //console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


function returnidsucursal() {

    var valSuc = '@(ViewBag.IDSUCURSAL)';
    if (valSuc == '128' | valSuc == '100' | valSuc == '128' | valSuc == '132' | valSuc == '125' | valSuc == '124' | valSuc == '169'
        | valSuc == '154' | valSuc == '119' | valSuc == '145' | valSuc == '127' | valSuc == '122') {
        cmbsucursalfactura.value = '154';
        //var cmbidtipoformulacion = document.getElementById('cmbidtipoformulacion');
        //if (cmbidtipoformulacion.value == 'CANNABIS') {
        //    for (let i = cmblaboratorio.options.length; i >= 0; i--) {
        //        cmblaboratorio.remove(i);
        //    }

        //    //cmbsucursalfactura.disabled = true;
        //    option.value = '153';
        //    option.text = 'LAB OLIVOS';
        //    cmblaboratorio.appendChild(option)

        //    //cmblaboratorio.disabled = true;
        //} else {
        //    cmbsucursalfactura.disabled = false;
        //    cmbsucursalfactura.value = '100';
        //    for (let i = cmblaboratorio.options.length; i >= 0; i--) {
        //        cmblaboratorio.remove(i);
        //    }
        //    option.text = '[SELECCIONE]';
        //    cmblaboratorio.appendChild(option)
        //    cmblaboratorio.disabled = false;
        //}
    }
}





//--EARTCOD1021
//FUNCION PARA OBTENER EL ARRAY DE LA TABLA DETALLE PEDIDO
var tabla_detallepedido = [];
function ObtenerTablaDetallePedidoEnArray() {
    tabla_detallepedido = [];
    $('#tbldetalle>tbody tr').each(function () {
        //var objarray = {
        //    idproducto:$(this).attr("idproducto"),
        //    monto:$(this).find("td").eq(8).html()
        //}
        //tabla_detallepedido.push(objarray);
        tabla_detallepedido.push($(this).attr("idproducto") + '|' + $(this).find("td").eq(8).html());
    });
    return tabla_detallepedido;
}








//FUNCION PARA BUSCAR UNA PROMOCION DE OBSEQUIO DESDE DETALLE PEDIDO
function PromoProductoBuscarObsequio(idstock) {
    var rowCount = $("#tbldetalle tbody tr").length;
    if (rowCount > 0) {

    var idsucursal_ = IDSUCURSAL;
    //var idsucursal_ = '@(ViewBag.IDSUCURSAL)';
    var canalventa = $('#cmbcanalventas').val();

    var obj = {
        idsucursal: idsucursal_,
        idcanalventa: canalventa,
        productos: ObtenerTablaDetallePedidoEnArray().toString()
    }

    let controller = new DescuentoController();
    controller.PromoProductoBuscarObsequio(obj, function (data) {

        if (data != null) {
            var html = GenerarTablaProductosObsequio(data, idstock);
            $('#contenedor_productoobsequiobuscarpedido').html(html);

            //var json = data;
            ////SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
            //$('#pagination-contenedor_productoobsequiobuscarpedido').pagination({
            //    dataSource: json,
            //    pageSize: 10,
            //    callback: function (data, pagination) {
            //        var html = GenerarTablaProductosObsequio(data);
            //        $('#contenedor_productoobsequiobuscarpedido').html(html);
            //    }
            //});

            if (data.length > 0) {
                $('#modalProductoObsequioBuscarPedido').modal('show');
            }
        }
    });
    }
}

//FUNCION PARA GENERAR LA TABLA CON EL LISTADO DE PROMOCIONES
function GenerarTablaProductosObsequio(data, idstock) {
    
    var tabla = `<table class="table mt-2 text-center" id="tabla_productosobsequio">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th class="py-2 align-middle">PROMOCIÓN</th>
                <th class="py-2 align-middle" style='display: none;'>PRODUCTO APLICADO</th>
                <th class="py-2 align-middle"></th>
                <th class="py-2 align-middle"></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        //PARA OBTENER LOS PRODUCTOS QUE APLICARON LA PROMOCION
        var productosaplicados=[];
        $.each(JSON.parse(item.productosafectados), function (index, item) {
            productosaplicados.push(item.idproducto);
        });
        //console.log(productosaplicados.toString());



        tabla += "<tr idstock='"+idstock+"'>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.idpromoobsequio + "</td>"
            + "<td class='py-0 align-middle'>" + item.nombrepromo + "</td>"
            //+ "<td class='py-0 align-middle' style='display: none;'>" + item.productoaplicado + "</td>"
            + "<td class='py-0 align-middle' style='display: none;'>" + productosaplicados + "</td>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.montooferta + "</td>"
            + '<td class="py-0 align-middle"><button class="btn text-success ver-obsequio"><i class=\'bi bi-eye-fill h4\'></i></button></td>'
            + '<td class="py-0 align-middle"><button class="btn text-primary aplicar-promocion"><i class=\'bi bi-bag-plus-fill h4\'></i></button></td>'
            + "</tr>";

        //SCRIPT PARA GENERAR SUBFILA CON TABLA DETALLE
        tabla += "<tr style='display: none;'><td colspan='4' style='padding:0 75px;'>"
        var tablahijo = `<table class="table table-bordered">
                              <thead class="table bg-success text-light">
                                  <tr class="group-font-sm">
                                      <th class="py-0 align-middle">PRODUCTO</th>
                                      <th class="py-0 align-middle">CANTIDAD</th>
                                  </tr>
                              </thead>
                              <tbody>`;
        $.each(JSON.parse(item.productosobsequiojson), function (index, item) {
            tablahijo += "<tr>"
                
                      + "<td class='py-0 align-middle' style='display: none;'>" + item.idproducto + "</td>"
                + "<td class='py-0 align-middle' style='font-size: 11px'>" + item.nombre + "</td>"
                + "<td class='py-0 align-middle' style='font-size: 11px'>" + item.cantidad + "</td>"
                      + "</tr>";
        });
        tablahijo += "</tbody></table></td></tr>";

        tabla += tablahijo;
    });
    tabla += "</tbody></table>";
    return tabla;
}

$(document).on('click', '.ver-obsequio', function (event) {
    event.preventDefault();
    expandir(event.target);
});

$(document).on('click', '.aplicar-promocion', function (event) {
    event.preventDefault();
    var idpromoobsequio = $(this).parents("tr").find("td").eq(0).html();
    var montooferta = $(this).parents("tr").find("td").eq(3).html();
    var idstock = $(this).parents("tr").attr("idstock");
    var productosaplicados = $(this).parents("tr").find("td").eq(2).html();

    PromocionBuscarProductoObsequioStockVenta(idpromoobsequio, idstock, montooferta, productosaplicados);
});

function expandir(btn) {
    let fila = btn.closest('tr');
    if (fila.nextElementSibling.style.display != "none") {
        fila.nextElementSibling.style.display = "none"; //ocultar fila
    } else {
        fila.nextElementSibling.style.display = ""; //mostrar fila
    }
}


function PromocionBuscarProductoObsequioStockVenta(idpromoobsequio, idstock, montooferta, productosaplicados) {
    var obj = {
        idsucursal: cmbsucursalfactura.value,
        idlistaprecio: $('#MLScmblistapreios').val(),
        idpromoobsequio: idpromoobsequio
    }

    let controller = new DescuentoController();
    controller.PromocionBuscarProductoObsequioStockVenta(obj, function (data) {
        //console.log(data);
        //VERIFICAMOS SI LA PROMO YA FUE INCLUIDA EN EL DETALLE PEDIDO
        //var productoobsequio = ObtenerProductosObsequioDetallePedido().filter(function (productoobsequio) { return productoobsequio.idpromoobsequio == idpromoobsequio });
        //var productoobsequio = ObtenerProductosObsequioDetallePedido().filter(function (productoobsequio) { return productoobsequio.idstockbonificacion == idstock });
        var productoobsequio = ObtenerProductosObsequioDetallePedido().filter(function (productoobsequio) { return productoobsequio.idpromoobsequio == idpromoobsequio });

        if (productoobsequio.length == 0) {
        $.each(data, function (index, item) {
            AgregarItemObsequioBonificacion(item, idstock, idpromoobsequio, montooferta, productosaplicados);

            //$("#tbldetalle tbody tr").each(function () {
            //    $(this)
            //        .attr("col", $(this).index() + 1)
            //        .attr("row", $(this).parent().index() + 1);
            //});


            $('#modalProductoObsequioBuscarPedido').modal('hide');
        });
        } else {
            notificacion = `<div class="alert alert-warning alert-mensaje" role="alert"> El producto ya tiene una promoción de obsequio aplicada!!</div>`;
            $(".modal-notificacion").show();
            $(".modal-notificacion").html(notificacion);
            $(".alert-mensaje").fadeTo(1200, 250).slideUp(250, function () {
                $(".alert-mensaje").slideUp(250);
            });
        }
    });
}

//FUNCION PARA AGREGAR UN ITEM DE OBSEQUIO EN DETALLE PEDIDO
function AgregarItemObsequioBonificacion(data, idstock, idpromoobsequio, montooferta, productosaplicados) {

    if (data.idstock != 0) {
        var fila = '';
        var checkfracion = '';
        if (data.multiplo > 1)
            checkfracion = '<input disabled  class="isfraccion" type="checkbox"  ' + (data.xfraccionobsequio > 0 ? "checked" : "") +' />';
        var input = '<input disabled style="width:70%" value="' + data.cantidadobsequio + '" class="text-center txtcantidad font-14" type="number"  min="1" readonly/>';

        var cmbaux = '';
        if (data.idtipoproducto == 'FM')
            cmbaux = cmbuso;
        fila += '<tr role="row" class="even table-primary selected ' + idstock + ' ' + productosaplicados.replace(",", "  ")+' " idprecioproducto=' + data.idprecioproducto + ' idproducto=' +
            data.idproducto + ' codigoprecio=' + data.codigoproducto + ' idstock=' + data.idstock + ' idstockbonificacion=' +
            idstock + ' tipo="bonificacion" idpromoobsequio=' + idpromoobsequio + ' montooferta=' + montooferta + ' productosaplicados=' + productosaplicados + '>';
        fila += '<td></td>';
        fila += '<td></td>';
        fila += '<td class="formula" contenteditable="true">' + data.nombre + '</td>';
        fila += '<td class="tipoitem align-middle">' + data.idtipoproducto + '</td>';
        fila += '<td  class="precio text-right align-middle">' + 0 + '</td>';
        fila += '<td class="text-center align-middle" >' + input + '</td>';
        fila += '<td class="align-middle">' + checkfracion + '</td>';
        fila += '<td  class="descuento align-middle">' + 100 + '%</td>';
        fila += '<td class="subtotal text-right align-middle">' + 0 + '</td>';
        fila += '<td class="text-center align-middle">' + cmbaux + '</td>';
        fila += '<td class="text-center align-middle"><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
        fila += '</tr>';
        $("#tbodydetalle").append(fila);
        fncalculartotal();
    } else {
        notificacion = `<div class="alert alert-warning alert-mensaje" role="alert"> El obsequio no puede ser agregado por falta de disponibilidad en la sucursal!!</div>`;
        $(".modal-notificacion").show();
        $(".modal-notificacion").html(notificacion);
        $(".alert-mensaje").fadeTo(1500, 250).slideUp(250, function () {
            $(".alert-mensaje").slideUp(250);
        });
    }
}

//FUNCION PARA QUITAR EL PRODUCTO Y SU OBSEQUIO
function quitarProductosObsequio(obj, monto) {
    $("." + obj).remove();
    fncalculartotal();
}

//FUNCION PARA RETIRAR LOS PRODUCTOS OBSEQUIO EN CASO NO CUMPLAN CON EL MONTO OFERTA
function quitarProductosObsequioPorDisminucion(idstock, monto) {
    var productoobsequio = ObtenerProductosObsequioDetallePedido().filter(function (productoobsequio) { return productoobsequio.idstockbonificacion == idstock });
    if (productoobsequio.length > 0) {
        if (productoobsequio[0].idstockbonificacion == idstock && parseFloat(monto) < parseFloat(productoobsequio[0].montooferta)) {
            $("." + idstock).remove();
        }
    }
}

//FUNCION PARA OBTENER LOS PRODUCTOS DE OBSEQUIO AGREGADOS
var productos_obsequio = [];
function ObtenerProductosObsequioDetallePedido() {
    productos_obsequio = [];
    var idpromoobsequio = "";

    $('#tbldetalle>tbody tr').each(function () {
        idpromoobsequio = $(this).attr("idpromoobsequio") != null ? $(this).attr("idpromoobsequio") : "";
        if (idpromoobsequio != "") {
            var obj = {
                idpromoobsequio: $(this).attr("idpromoobsequio"),
                idstockbonificacion: $(this).attr("idstockbonificacion"),
                montooferta: $(this).attr("montooferta")
            };
            productos_obsequio.push(obj);
        }
    });
    return productos_obsequio;
}

//EVENTO PARA MOSTRAR ALGUNA PROMOCION DISPONIBLE QUE TENGA EL PRODUCTO
//DESDE EL BOTON ICONO DE REGALO
$(document).on('click', '.btnBuscarPromoObsequio', function (event) {
    event.preventDefault();
    var idstock = $(this).parents("tr").attr("idstock");
    PromoProductoBuscarObsequio(idstock);
});


//$('.cantidadeventchange').change(function () {
//    alert('test');
//});


//$(document).on('change', '.cantidadeventchange', function (event) {
//    event.preventDefault();
//    //alert('test');
//    var key = event.which;
//    if (key == 13)  // the enter key code
//    {
//        alert('test');
//    }
//});

//$(document).on('keyup', '.cantidadeventchange', function (event) {
//    
//    alert('test');
//    //var idstock = $(this).parents("tr").attr("idstock");//EARTCOD1021
//    //
//    //PromoProductoBuscarObsequio(idstock);//EARTCOD1021
//
//    if (event.key === "Enter") {
//        event.preventDefault();
//        // Cancel the default action, if needed
//        //event.preventDefault();
//        // Trigger the button element with a click
//        //document.getElementById("myBtn").click();
//        alert('test');
//    }
//});

//$("#Boton").click(function () {
//    $("#Picker").val("2").trigger('change');
//});

//$("#subtotal").change(function () {
//    alert("El campo ha cambiado");
//});

//$(document).on('change', '.cantidadeventchange', function (event) {
//    alert("El campo ha cambiado");
//});

//$(function () {
//    $('.cantidadeventchange').keypress(function (e) {
//        var key = e.which;
//        if (key == 13) // the enter key code
//        {
//            alert('test');
//            return false;
//        }
//    });
//});

//function obtenerobsequios() {
//    var idstock = $(this).parents("tr").attr("idstock");//EARTCOD1021
//    PromoProductoBuscarObsequio(idstock);//EARTCOD1021
//}
//
//$('#subtotal').live('change', obtenerobsequios());
//$('.cantidadeventchange').live('change', ObtenerProductosObsequioDetallePedido());
//$('#subtotal').live('keyup', ObtenerProductosObsequioDetallePedido());

function fnLlenarDatosClientesVarios(numdoc) {
    let controller = new ClienteController();
    var obj = {
        top: 20,
        filtro: numdoc
    };
    controller.BuscarClientes(obj, function (data) {
        if (data.length > 0) {
            txtidcliente.value = data[0].idcliente;
            txtdoccliente.value = data[0].numdocumento;
            txtdoccliente.setAttribute('numdoc', data[0].numdocumento);
            txtnombrescliente.value = data[0].nombrecompleto;

            //let controller = new PacienteController();
            //controller.BuscarxDocumento(numdoc, function (data) {
            //    if (data['mensaje'] == 'ok') {
            //        txtidpaciente.value = data['objeto'].idpaciente;
            //        txtdocpaciente.value = data['objeto'].numdocumento;
            //        txtdocpaciente.setAttribute('numdoc', data['objeto'].numdocumento);
            //        txtnombrepaciente.value = data['objeto'].nombres + ' ' + data['objeto'].apepaterno + ' ' + data['objeto'].apematerno;
            //    }
            //});
        }
    });
}

function fnLlenarDatosPacienteVarios(numdoc){
    let controller = new PacienteController();
    controller.BuscarxDocumento(numdoc, function (data) {
        if (data['mensaje'] == 'ok') {
            txtidpaciente.value = data['objeto'].idpaciente;
            txtdocpaciente.value = data['objeto'].numdocumento;
            txtdocpaciente.setAttribute('numdoc', data['objeto'].numdocumento);
            txtnombrepaciente.value = data['objeto'].nombres + ' ' + data['objeto'].apepaterno + ' ' + data['objeto'].apematerno;
        }
    });
}

cmbcanalventas.addEventListener("change", function () {
    $('#tbldetalle tbody tr').remove();
    $('#lblsubtotal').html('');
    $('#lblpkdescuento').html('');
    $('#lbltotal').html('');
});