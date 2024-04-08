
var cmbidsucursaldestino = $('#idsucursaldestino');
var cmbestadoguia = $('#estadoguia');
var cmbidccosto = $('#cmbidccosto');
var idtipomovimiento = $('#idtipomovimiento');
var txtempleado_userName = $('#empleado_userName');
var cmbidalmacensucursalorigen = $('#idalmacensucursalorigen');
var tbldetalleguia;
var txtobservacion = $('#txtobservacion');
//Transporte
var idempresatransporte = $('#idempresatransporte');
var idvehiculo = $('#idvehiculo');
var txtmatricula = $('#txtmatricula');
var txtlicencia = $('#txtlicencia');
var txtconductor = $('#txtconductor');
var txtayudante = $('#txtayudante');
//BOTONES
var btnanular = $('#btn-anular');
var btnguardar = $('#btn-guardar');
var btnimprimir = document.getElementById('btnimprimir');
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
        info: false,
        "language": LENGUAJEDATATABLE()
    });
    //$("#tbldetalleguia tbody").remove();
    cargarEmpresa();
    txtempleado_userName.val(NOMBREUSUARIO);
    if (MODELO != null) {
        if (MODELO.idsalidatransferencia != 0 && MODELO.idsalidatransferencia != undefined) {
            //buscarSalidaTransferencia(MODELO.idsalidatransferencia);
            //fnmostrarbotonesextra(MODELO.idsalidatransferencia);

        } 
    } else {
        //fn_listarseriescajaxsucursal(IDSUCURSAL, 'GUIA');
        //fnmostrarbotonesextra(0);
    }
    
});
//eventos
btnimprimir.addEventListener('click', function () {
    fnimprimir();
});

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

}

function cargardatosGuia(data) {
  
    btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalidaTransferencia/Imprimir/" + data[0]["ID"]);
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

function fngetdetalle() {
    var filas = document.querySelectorAll('#tbldetalleguia tbody tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new AHojaRutaDetalle();
        obj.fechaguia = e.getAttribute('fechaguia');
        obj.numguia = e.getAttribute('numguia');
        obj.cantbultos = e.getElementsByClassName('txtbultos')[0].value;
        obj.idsucursal = 0;//e.getElementsByClassName('lote')[0].value;
        obj.fechaenvio = e.getElementsByClassName('txtfecha')[0].value;
        obj.horaenvio = e.getElementsByClassName('txthora')[0].value;
        
        array.push(obj);
    });
    return array;
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    let filas = document.querySelectorAll('#tbldetalleguia tbody tr').length;
    if (filas < 1) {
        alertaSwall("W", "Debe agregar al menos una Guia.", "")
        return;
    }

    let select = document.getElementById('seriedoc');
    let url = ORIGEN + "/Almacen/AHojaRuta/RegistrarEditar";;
    let obj = $('#form-registro').serializeArray();
    let detalle = fngetdetalle();
    obj[obj.length] = { name: "nomchofer", value: txtconductor.val() };

    obj[obj.length] = { name: "ayudante", value: txtayudante.val() };
    obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
    console.log(obj);
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            fndesactivaritems();
            mensaje("S", "Registro guardado", "BR");
            btnguardar.prop('disabled', true);
            fnmostrarbotonesextra(data.objeto.idsalidatransferencia);
            btnimprimir.setAttribute('href', ORIGEN + "/Almacen/ASalidaTransferencia/Imprimir/" + data.objeto.idsalidatransferencia);
            btnanular.prop("disabled", false);
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


$('#btnnuevoproducto').click(function () {
    $('#modallistarguiasalida').modal();
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
    tbldetalleguia.clear().draw(false);
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
        txtconductor.val(datos.nombres);
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