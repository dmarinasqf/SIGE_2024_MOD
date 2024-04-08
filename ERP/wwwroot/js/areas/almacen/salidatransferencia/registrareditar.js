var formRegistro = document.getElementById('form-registro');

var txtcodigo = $('#codigo');
var idsalidatransferencia = $('#idsalidatransferencia');
var txtseriedoc = $('#seriedoc');
var txtnumdoc = $('#numdoc');
var txtidsalidatransferencia = $('#idsalidatransferencia');
var txtfechatraslado = $('#fechatraslado');
var cmbidsucursalorigen = $('#idsucursal');
var cmbidsucursaldestino = $('#idsucursaldestino');
var cmbestadoguia = $('#estadoguia');
var cmbidccosto = $('#cmbidccosto');
var idtipomovimiento = $('#idtipomovimiento');
var txtempleado_userName = $('#empleado_userName');
var cmbidalmacensucursalorigen = $('#idalmacensucursalorigen');
var tbldetalleguia;
var txtobservacion = $('#txtobservacion');
var btnnuevoproducto = $('#btnnuevoproducto');
var txtpeso = $('#txtpeso');
var txtbultos = $('#txtbultos');
//Transporte
var idempresatransporte = $('#idempresatransporte');
var idvehiculo = $('#idvehiculo');
var txtmatricula = $('#txtmatricula');
var txtlicencia = $('#txtlicencia');
//BOTONES
var btnanular = $('#btn-anular');
var btnguardar = $('#btn-guardar');
var btnimprimir = document.getElementById('btnimprimir');
var btnlimpiar = document.getElementById('btn-limpiar');
//ARREGLOS
var _almacenes = [];
var _PRODUCTOSENDETALLE = [];


$(document).ready(function () {
    tbldetalleguia = $('#tbldetalleguia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        //"lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [8],
                "visible": false,
                "searchable": false
            }
        ]
    });
    cargarEmpresa();
    cargarcomboboxsucursales();
    cargarcomboalmacenes(IDSUCURSAL, '');
    cargarcosto();
    cmbidccosto.prop("required", true);

    if (MODELO.idsalidatransferencia != 0 && MODELO.idsalidatransferencia != undefined) {
        buscarSalidaTransferencia(MODELO.idsalidatransferencia);
        fnmostrarbotonesextra(MODELO.idsalidatransferencia);

    } else {
        fn_listarseriescajaxsucursal(IDSUCURSAL, 'GUIA');
        fnmostrarbotonesextra(0);
    }
});
//eventos
btnimprimir.addEventListener('click', function () {
    fnimprimir();
});
cmbestadoguia.click(function (e) {
    $("#estadoguia option[value='TRANSITO'").prop("disabled", false);
    $("#estadoguia option[value='ENTREGADO'").prop("disabled", true);
    $("#estadoguia option[value='ANULADO'").prop("disabled", true);
    //if (!fnverificarcantidades()) 
    //    $("#estadoguia option[value='ATENDIDO'").prop("disabled", true);
});

function cargarcomboboxsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('idsucursal', IDEMPRESA, '', IDSUCURSAL);
    controller.ListarSucursalxEmpresaEnCombo('idsucursaldestino', IDEMPRESA, cmbidsucursaldestino.val());
}

function cargarcomboalmacenes(origen, idsucursalorigen) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal('idalmacensucursalorigen', origen, idsucursalorigen, function (data) {
        _almacenes = data;
    });
    controler.ListarAlmacenxSucursal('MPS_cmbalmacen', origen, idsucursalorigen);
}
function cargarcosto() {
    let controler = new OrdenCompraController();
    controler.ListarCCosto('cmbidccosto');
}

function buscarSalidaTransferencia(id) {

    //let url = ORIGEN + "/Almacen/AGuiaSalida/GetGuiaCompleta";
    let obj = { id: id };
    let controller = new ASalidaTransferenciaController();
    controller.GetSalidaTransferencia(obj, function (data) {
        tbldetalleguia.clear().draw(false);
        if (data.mensaje === "ok") {
            let datos = JSON.parse(data.objeto);
            cargardatosGuia(datos);
        }
        else
            mensaje('W', data.mensaje);
    });
    //$.post(url,obj).done(function (data) {
    //    tbldetalleguia.clear().draw(false);
    //    if (data.mensaje === "ok") {
    //        let datos = JSON.parse(data.objeto);
    //        cargardatosGuia(datos);
    //    }
    //    else
    //        mensaje('W', data.mensaje);

    //}).fail(function (data) {
    //    mensaje("D", "Error en el servidor");
    //});
}

function cargardatosGuia(data) {

    btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalidaTransferencia/ImprimirTransferencia/" + data[0]["ID"]);
    txtnumdoc.val(data[0]["NUM.DOC"]);
    cmbidsucursalorigen.val(data[0]["IDSUCURSALORIGEN"]);
    cmbidsucursaldestino.val(data[0]["IDSUCURSALDESTINO"]);
    cmbidccosto.val(data[0]["IDCOSTO"]);
    txtempleado_userName.val(data[0]["EMPLEADO"]);
    txtobservacion.val(data[0]["OBSERVACION"]);
    cargarcomboalmacenes(data[0]["IDSUCURSALORIGEN"], data[0]["IDALMACENSUCURSALORIGEN"])
    //Transporte
    cargarvehiculosxEmpresa(data[0]["IDEMPRESATRANSPORTE"], data[0]["IDVEHICULO"]);
    cargarvehiculosxid(data[0]["IDVEHICULO"]);

    let detalledatos = JSON.parse(data[0]["DETALLE"]);
    idtipomovimiento.val(data[0]["IDTIPOMOVIMIENTO"]);
    if (data[0]["ESTADO GUIA"] === 'TRANSITO') {
        fndesactivaritems();
        btnanular.prop("disabled", false);
    }
    else
        fndesactivaritems();


    let fecha = '';

    for (let i = 0; i < detalledatos.length; i++) {
        fecha = detalledatos[i]["FECHA VECIMIENTO"] == '' ? '' : detalledatos[i]["FECHA VECIMIENTO"];
        let almacontroller = new AlmacenSucursalController();

        var cmbalmacen = almacontroller.LllenarComboAlmacenSucursalAux(document.createElement('select'), _almacenes, detalledatos[i]["IDALMACENSUCURSALDETALLE"]);

        cmbalmacen.classList.add('form-control');
        cmbalmacen.classList.add('form-control-sm');
        cmbalmacen.classList.add('cmbalmacen');
        cmbalmacen.disabled = true;

        var checked = '';
        if (detalledatos[i]["ISFRACCION"] == 'true' || detalledatos[i]["ISFRACCION"] == true)
            checked = 'checked';
        else
            checked = ''

        var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado ' + checked + ' "/>';
        var auxtfila = tbldetalleguia.row.add([
            '<bold>' + parseInt(i + 1) + '</bold>',
            detalledatos[i]["IDDETALLE"],
            detalledatos[i]["IDPRODUCTO"],
            detalledatos[i]["CODIGO"],
            detalledatos[i]["PRODUCTO"],
            detalledatos[i]["CANTIDAD"],
            checkfracion,
            cmbalmacen.outerHTML,
            detalledatos[i]["IDSTOCK"],
            detalledatos[i]["LOTE"],
            detalledatos[i]["REGISTROSANITARIO"],
            fecha,
            ''
        ]).draw(false).node();
        auxtfila.getElementsByClassName('cmbalmacen')[0].value = data[0]["IDALMACENSUCURSALORIGEN"];
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    }
}

$(document).on('change keyup', '.cantidadpicking', function () {
    var cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = ''; $(this).val(''); }
    //fnverificarcantidadesdetalle();
});

function fngetdetalle() {
    var filas = document.querySelectorAll('#tbldetalleguia tbody tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new ASalidaTransferenciaDetalle();
        obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        obj.idproducto = e.getAttribute('idproducto');
        obj.idstock = e.getAttribute('idstock');
        obj.lote = e.getElementsByClassName('lote')[0].value;
        obj.idalmacensucursal = e.getElementsByClassName('cmbalmacen')[0].value;
        obj.fechavencimiento = e.getElementsByClassName('fechavencimiento')[0].value;
        obj.regsanitario = e.getElementsByClassName('regsanitario')[0].value;
        var isfraccion = e.getElementsByClassName('checkfraccion_detalle')[0];
        obj.isfraccion = isfraccion === undefined ? null : isfraccion.checked;
        obj.estado = 'HABILITADO';
        array.push(obj);
    });
    return array;
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    let filas = document.querySelectorAll('#tbldetalleguia tbody tr td').length;
    console.log(filas);
    if (filas <= 1) {
        alertaSwall("W", "No hay items por transferir.", "")
        return;
    }

    let select = document.getElementById('seriedoc');
    let url = ORIGEN + "/Almacen/ASalidaTransferencia/RegistrarEditar";;
    let obj = $('#form-registro').serializeArray();
    let detalle = fngetdetalle();
    let peso_total = parseFloat(txtpeso.val(), 2);
    let bultos = parseFloat(txtbultos.val(), 2);
    let tipo = 'transferencia';
    obj[obj.length] = { name: "idcajasucursal", value: $('option:selected', select).attr('idcajasucursal') };
    obj[obj.length] = { name: "idcorrelativo", value: $('option:selected', select).attr('idcorrelativo') };
    obj[obj.length] = { name: "numdoc", value: txtnumdoc.val() };
    obj[obj.length] = { name: "idcodicentcost", value: cmbidccosto.val() };
    obj[obj.length] = { name: "observacion", value: txtobservacion.val() };
    obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
    obj[obj.length] = { name: "bultos", value: JSON.stringify(bultos) };
    obj[obj.length] = { name: "peso_total", value: JSON.stringify(peso_total) };
    obj[obj.length] = { name: "tipo", value: JSON.stringify(tipo) };

    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            fndesactivaritems();
            mensaje("S", "Registro guardado", "BR");
            btnguardar.prop('disabled', true);
            fnmostrarbotonesextra(data.objeto);
            btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalidaTransferencia/Imprimir/" + data.objeto);
            btnanular.prop("disabled", false);
            btnlimpiar.disabled = false;
        }
        else {
            mensaje('W', data.mensaje);
            btnguardar.prop('disabled', false);
        }
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});

btnanular.click(function () {
    let url = ORIGEN + "/Almacen/ASalidaTransferencia/Anular";
    let obj = { id: idsalidatransferencia.val() };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje("S", "Registro Anulado", "BR");
            desactivartodo();
            //btnimprimir.prop("disabled", true);
        }
        else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', true);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
});

function fndesactivaritems() {
    let frm = document.forms['form-registro'];
    let ele;
    for (i = 0; ele = frm.elements[i]; i++)
        ele.disabled = true;
    btnimprimir.disabled = false;
}

function fnimprimir() {
    if (txtidsalidatransferencia.val() != '') {
        var href = btnimprimir.getAttribute('href');
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR GUIA REMISIÓN');
    }
}


function fn_listarseriescajaxsucursal(idsucursal, nombredocumento) {
    let controller = new CajaController();
    let obj = { idsucursal: idsucursal, nombredocumento: nombredocumento };
    controller.ListarCorrelativosPorCajaPorDocumento('', obj, fncargarcorrelativos, '');
}
function fncargarcorrelativos(data, idcorrelativo) {
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        if (idcorrelativo == '')
            $("#seriedoc").append(`<option value="" selected> SELECCIONE </option>`);
        else
            $("#seriedoc").append(`<option value=""> SELECCIONE </option>`);
        for (var j = 0; j < datos.length; j++) {
            if (datos[j]["IDCORRELATIVO"] == idcorrelativo)
                $("#seriedoc").append(`<option value="` + datos[j]["SERIE"] + `" idcajasucursal="` + datos[j]["IDCAJA"] + `" idcorrelativo="` + datos[j]["IDCORRELATIVO"] + `" correlativo="` + datos[j]["CORRELATIVO"] + `" selected>` + datos[j]["SERIE"] + `</option>`);
            else
                $("#seriedoc").append(`<option value="` + datos[j]["SERIE"] + `" idcajasucursal="` + datos[j]["IDCAJA"] + `" idcorrelativo="` + datos[j]["IDCORRELATIVO"] + `" correlativo="` + datos[j]["CORRELATIVO"] + `">` + datos[j]["SERIE"] + `</option>`);
        }

    } else
        mensaje("W", data.mensaje, "BR");
}
$("#seriedoc").change(function () {
    let correlativo = $('option:selected', this).attr('correlativo');
    txtnumdoc.val(correlativo);
});

$('#btnnuevoproducto').click(function () {
    if (cmbidalmacensucursalorigen.val() == "")
        mensaje("W", "SELECCIONE UN ALMACÉN", "TR");
    else {
        MPS_cmbalmacen.prop("disabled", true);
        MPS_cmbalmacen.val(cmbidalmacensucursalorigen.val());
        MPS_fnbuscardatos();
        $('#modalproductosstockxalmacen').modal();
    }
});

$(document).on('click', '.MPS_btnseleccionarstock', function () {
    var idstock = this.getAttribute('idstock');
    var cantidadactual = this.getAttribute('cantmax');
    fnbuscarstockproducto(idstock, cantidadactual);
});


function fnbuscarstockproducto(idstock, cantidadactual) {
    if (fnverificarsielitemestaendetalle(idstock.toString())) {
        mensaje('W', 'El item se encuentra en el detalle');
        return;
    }
    let controller = new StockController();
    controller.BuscarStock(idstock, function (data) {

        console.log('Stock a transferir:', data);

        _PRODUCTOSENDETALLE.push(data);

        var stockActual = data.stockracionado;
        let almacontroller = new AlmacenSucursalController();
        var checkdisabled = '';
        var checkfracion = '';
        if (data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null) {
            checkdisabled = 'disabled';
            stockActual = 0;
            checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado  />';
        }
        else checkfracion = '<input   class="checkfraccion_detalle" type="checkbox"  deshabilitado   multiplo="' + data.multiplo + '"/>';
        checkdisabled = '';



        if (stockActual === 0) {
            stockActual = data.candisponible;
            checkfracion = checkfracion.replace('checked', 'checked');
            //checkblister= checkblister.replace('checked', '');
        } else
            checkfracion = checkfracion.replace('checked', '');


        var lote = '<input class="lote inputdetalle" type="text" value="' + data.lote + '" disabled/>';
        var fv = '<input class="fechavencimiento inputdetalle" type="date" value="' + data.fechavencimiento + '" disabled/>';
        var reg = '<input class="regsanitario inputdetalle" type="text" value="' + data.regsanitario + '" disabled/>';
        var cmbalmacen = almacontroller.LllenarComboAlmacenSucursalAux(document.createElement('select'), _almacenes, data.idalmacensucursal);
        cmbalmacen.classList.add('form-control');
        cmbalmacen.classList.add('form-control-sm');
        cmbalmacen.classList.add('cmbalmacen');
        cmbalmacen.disabled = true;
        var fila = tbldetalleguia.row.add([
            '<span class="index"></span>',
            0,
            0,
            data.codigoproducto,
            data.nombre,
            '<input type="number" min="1" value = "1" class="cantidad inputdetalle" min="1" max="' + cantidadactual + '" required>',
            checkfracion,
            cmbalmacen.outerHTML,
            data.idstock,
            lote,
            reg,
            fv,
            '<button type="button" class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
        ]).draw(false).node();
        fila.getElementsByClassName('cmbalmacen')[0].value = data.idalmacensucursal;
        fila.setAttribute('idproducto', data.idproducto);
        fila.setAttribute('idstock', data.idstock);
        fnagregarindex();
    });
}
$(document).on('click', '.btnquitaritem', function () {
    var idstock = ($(this).parents('tr').attr('idstock'));

    tbldetalleguia.row('.selected').remove().draw(false);

    var index = encontrarIndexArraProductos(idstock);
    _PRODUCTOSENDETALLE.splice(index, 1);

    fnagregarindex();
});

function fnagregarindex() {
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    var c = 1;
    filas.forEach(function (e) {
        e.getElementsByClassName('index')[0].textContent = c;
        c++;
    });
}
function fnverificarsielitemestaendetalle(idstock) {
    var filas = document.querySelectorAll('#tbldetalleguia tbody tr');
    if (tbldetalleguia.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getAttribute('idstock');
        if (idstock == aux)
            band = true;
    });
    return band;
}

$('#tbldetalleguia tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalleguia.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

//FUNCIONES DE TRANSPORTE
idempresatransporte.change(function () {
    let idempresa = $(this).val();
    if (idempresa != '')
        cargarvehiculosxEmpresa(idempresa);
});
idvehiculo.change(function () {
    let idvehiculo = $(this).val();
    if (idvehiculo != '') {
        cargarvehiculosxid(idvehiculo)
    }
});

function cargarEmpresa() {
    let controller = new EmpresaTransporte();
    controller.ListarEmpresasTransporteEnCombo('idempresatransporte', '', '');
}

function cargarvehiculosxEmpresa(idempresa, idvehiculo) {
    idempresatransporte.val(idempresa);
    let controller = new VehiculoController();
    let params = { idempresa: idempresa };
    controller.ListarVehiculosxEmpresaEnCombo('idvehiculo', params, '', idvehiculo);
}

function cargarvehiculosxid(id) {
    let controller = new VehiculoController();
    let params = { id: id };
    controller.BuscarVehiculoxid(params, fncargardatosvehiculo);
}

function fncargardatosvehiculo(data) {
    if (data.mensaje == "ok") {
        let datos = data.objeto;
        txtmatricula.val(datos.matricula);
        txtlicencia.val(datos.licencia);
    } else {
        mensaje("W", data.mensaje, "BR");
    }
}

//ocultar y mostrar
function fnmostrarbotonesextra(idsalidatransferecia) {
    if (idsalidatransferecia > 0) {
        btnanular.removeClass("ocultar");
        $("#btnimprimir").removeClass("ocultar");
    } else {
        btnanular.addClass("ocultar");
        $("#btnimprimir").addClass("ocultar");
    }
}

$(document).on('click', '.checkfraccion_detalle', function (e) {

    var fila = tbldetalleguia.row($(this).parents('tr')).data();
    var idstock = ($(this).parents('tr').attr('idstock'));
    var inputcantidad = $(this).parents('tr').find('.cantidad');
    //try { $(this).parents('tr').find('.checkblister_detalle')[0].checked = false; } catch (e) { }
    fnacciones_fraccion_blister(idstock, 'fraccion', inputcantidad, (this));
    //fncalcularbonificacion($(this).parents('tr').find('.cantidad_detalle')[0]);
});
function fnacciones_fraccion_blister(idstock, tipo, input, event) {
    console.log('event_check_gracion');
    inputcheck = $(event);
    var data = _PRODUCTOSENDETALLE[encontrarIndexArraProductos(idstock)];
    if (tipo === 'fraccion') {
        if (inputcheck.prop('checked')) {
            if (parseInt(input.val()) > data.candisponible) {
                input.val(data.candisponible);
                alertaSwall('I', 'El stock maximo en fracción del producto ' + data.nombre + ' es ' + data.candisponible, '');
            }
            input.attr('max', data.candisponible);


        } else {
            if (data.maxcaja > 0) {//si el maxcaja es 0 entonces seguir siendo true el check
                input.attr('max', data.maxcaja);
                var check = inputcheck.parents('tr').find('[type=checkbox]');
                check.prop('checked', false);
                if (parseInt(input.val()) > data.maxcaja) {//sino cambiar datos a caja
                    input.val(data.maxcaja);
                    alertaSwall('I', 'El stock maximo en cajas del producto ' + data.nombre + ' es ' + data.maxcaja, '');
                }
            } else
                inputcheck.prop('checked', true);
        }
    }
}

function encontrarIndexArraProductos(idstock) {
    var index = -1;
    for (var i = 0; i < _PRODUCTOSENDETALLE.length; i++) {
        if (_PRODUCTOSENDETALLE[i].idstock.toString() === idstock.toString()) {
            index = i;
            break;
        }
    }
    return index;
}

btnlimpiar.addEventListener('click', function () {
    formRegistro.reset();
    tbldetalleguia.clear().draw(false);
    btnguardar.prop('disabled', false);
    btnanular.addClass("ocultar");
    $("#btnimprimir").addClass("ocultar");
    cmbidalmacensucursalorigen.prop("disabled", false);
    cmbidsucursaldestino.prop("disabled", false);
    idtipomovimiento.prop("disabled", false);
    idempresatransporte.prop("disabled", false);
    idvehiculo.prop("disabled", false);
    txtfechatraslado.prop("disabled", false);
    txtseriedoc.prop("disabled", false);
    cmbestadoguia.prop("disabled", false);
    cmbidccosto.prop("disabled", false);
    txtobservacion.prop("disabled", false);
    btnnuevoproducto.prop("disabled", false);
    idsalidatransferencia.val(0);
});
