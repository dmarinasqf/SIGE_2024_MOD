
var txtcodigo = $('#idguiasalida');
var txtnumdoc = $('#txtnumdoc');
var txtidguiasalida = $('#idguiasalida');
var txtfechatraslado = $('#fechatraslado');
var txtclienteproveedor = $('#txtclienteproveedor');
var cmbidsucursalorigen = $('#idsucursal');
var cmbidsucursaldestino = $('#idsucursaldestino');
var cmbestadoguia = $('#estadoguia');
var txtempleado_userName = $('#empleado_userName');
var observacion = $('#observacion');
//Transporte
var idempresatransporte = $('#idempresatransporte');
var idvehiculo = $('#idvehiculo');
var txtmatricula = $('#txtmatricula');
var txtlicencia = $('#txtlicencia');
var cmbidalmacensucursalorigen = $('#idalmacensucursalorigen');
var cmbidalmacensucursaldestino = $('#idalmacensucursaldestino');
var tbldetalleguia;
var tempestado = '';
//
var arrayitemsdelete = [];
var btnguardar = $('#btn-guardar');
var btnimprimir = document.getElementById('btn-imprimir');
var btnanular = $('#btn-anular');
var btnanularcopy = $('#btn-anularcopy');
var btnagregaritem = document.getElementById('btn-agregaritem');
//
var tiporegistro = "";
var contenedorSucDestino = $('#contenedorSucDestino');
var contenedorAlmDestino = $('#contenedorAlmDestino');
var contenedorNomProvCliDestino = $('#contenedorNomProvCliDestino');
var idtipoguia = 0;

$(document).ready(function () {
    tbldetalleguia = $('#tbldetalleguia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        //"lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "paging": false,
        "language": LENGUAJEDATATABLE()
    });
    cargarcomboboxsucursales();
    cargarEmpresa();
    if (MODELO.idguiasalida != 0) {
        buscarGuiaSalida(MODELO.idguiasalida);
    } else {
        var fechaa30dias = moment().add(1, 'd').format('YYYYY-MM-DD');
        txtfechatraslado.val(fechaa30dias);
    }
    tiporegistro = "EDITAR";
});

function fn_cargarProductosxAlmacen(idsucursalorigen, idalmacensucursal) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal('MPS_cmbalmacen', idsucursalorigen, idalmacensucursal);
}

$('#tbldetalleguia tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        // console.log();
    }
    else {
        tbldetalleguia.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
//eventos
btnimprimir.addEventListener('click', function () {
    fnimprimir();
});
cmbestadoguia.click(function (e) {
    $("#estadoguia option[value='PENDIENTE'").prop("disabled", false);
    $("#estadoguia option[value='ATENDIDO'").prop("disabled", false);
    $("#estadoguia option[value='TRANSITO'").prop("disabled", false);
    if (idtipoguia != 3 && idtipoguia != 4) {
        $("#estadoguia option[value='ENTREGADO'").prop("disabled", true);
    }
    //$("#estadoguia option[value='ENTREGADO'").prop("disabled", true);
    $("#estadoguia option[value='ANULADO'").prop("disabled", true);
});
cmbestadoguia.change(function (e) {
    if ($(this).val() == "TRANSITO") {
        if (!fnverificarcantidades()) {
            $(this).val("PENDIENTE");
            mensaje("W", "La guía no puede enviarse, hasta que en auditoria confirmen las cantidades a enviar oque las cantidades a enviar sean menores a la cantidad picking", "BR", 100000);
        }
    }
});
function fnverificarcantidades() {
    let valor = true;
    var datatable = tbldetalleguia.rows().data();

    for (let i = 0; i < datatable.length; i++) {
        let cantidadenviar = parseInt(document.getElementsByClassName("cantidadenviar")[i].value);
        let cantidadpicking = parseInt(document.getElementsByClassName("cantidadpicking")[i].value) //parseInt(datatable[i][5]);
        if (cantidadenviar < cantidadpicking) {
            valor = false; break;
        }
        else
            valor = true;
    }
    return valor;
}

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
function cargarcomboboxsucursales() {
    let controller = new SucursalController();
    $('#idsucursal').prop("disabled", false);
    controller.ListarSucursalxEmpresaEnCombo('idsucursalorigen', IDEMPRESA, '', IDSUCURSAL);
    //controller.ListarSucursalxEmpresaEnCombo('idsucursaldestino', IDEMPRESA, '',cmbidsucursaldestino.val());
    controller.ListarSucursalxEmpresaEnCombo('idsucursaldestino', IDEMPRESA, '', IDSUCURSAL);
}

function cargarcomboalmacenes(origen, destino, idsucursalorigen, idsucursaldestino) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal('idalmacensucursalorigen', origen, idsucursalorigen);
    controler.ListarAlmacenxSucursal('idalmacensucursaldestino', destino, idsucursaldestino);
}

function buscarGuiaSalida(id) {
    let obj = { id: id };
    let controller = new GuiaSalidaController();
    controller.GetGuiaSalidaCompleta(obj, cargardatosGuia);
}

function cargardatosGuia(dato) {

    if (dato.mensaje == "ok") {
        let data = JSON.parse(dato.objeto);
        if (data[0]["TIPOGUIA"] == 4)
            btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuiaCliente/?id=" + data[0]["ID"]);
        else
            btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuia/" + data[0]["ID"]);

        txtclienteproveedor.val(data[0]["CLIENTEPROVEEDOR DESTINO"]);
        txtnumdoc.val(data[0]["NUM.DOC"]);
        cmbidsucursalorigen.val(data[0]["IDSUCURSALORIGEN"]);
        cmbidsucursaldestino.val(data[0]["IDSUCURSALDESTINO"]);
        cargarcomboalmacenes(data[0]["IDSUCURSALORIGEN"], data[0]["IDSUCURSALDESTINO"],
            data[0]["IDALMACENSUCURSALORIGEN"], data[0]["IDALMACENSUCURSALODESTINO"]);
        //console.log(data[0]["IDEMPLEADOMANTENIMIENTO"]);
        if (data[0]["IDEMPLEADOMANTENIMIENTO"] != "")
            txtempleado_userName.val(data[0]["MANTENIMIENTO"]);

        idempresatransporte.val(data[0]["IDEMPRESATRANSPORTE"]);
        cargarvehiculosxEmpresa(data[0]["IDEMPRESATRANSPORTE"], data[0]["IDVEHICULO"]);
        cargarvehiculosxid(data[0]["IDVEHICULO"]);
        observacion.val(data[0]["OBSERVACION"]);
        cmbestadoguia.val(data[0]["ESTADO GUIA"]);
        idtipoguia = data[0]["TIPOGUIA"];
        if (data[0]["ESTADO GUIA"] == "ANULADO" || data[0]["ESTADO GUIA"] == "ENTREGADO") {
            desactivartodo();
            tempestado = 'disabled'
        }
        if (data[0]["ESTADO GUIA"] == "TRANSITO") {
            btnagregaritem.setAttribute("disabled", "");
        }
        if (data[0]["TIPOGUIA"] == 3 || data[0]["TIPOGUIA"] == 4) {
            contenedorSucDestino[0].setAttribute("hidden", "");
            contenedorAlmDestino[0].setAttribute("hidden", "");
            contenedorNomProvCliDestino[0].removeAttribute("hidden");
        }
        let detalledatos = JSON.parse(data[0]["DETALLE"]);
        fncargardetalle(detalledatos);
        //cargar datos  productos
        fn_cargarProductosxAlmacen(data[0]["IDSUCURSALORIGEN"], data[0]["IDALMACENSUCURSALORIGEN"])
    }
    else
        mensaje('W', dato.mensaje);
}

function fncargarsolodetalle(dato) {

    if (dato.mensaje == "ok") {
        let data = JSON.parse(dato.objeto);

        if (data[0]["ESTADO GUIA"] == "ANULADO" || data[0]["ESTADO GUIA"] == "ENTREGADO") {
            desactivartodo();
            tempestado = 'disabled'
        }
        let detalledatos = JSON.parse(data[0]["DETALLE"]);
        fncargardetalle(detalledatos, data[0]["ESTADO GUIA"]);
    }
    else
        mensaje('W', dato.mensaje);
}

function fncargardetalle(detalledatos, estado) {
    tbldetalleguia.clear().draw(false);
    let fecha = '';
    let botoneliminar = '';
    for (let i = 0; i < detalledatos.length; i++) {
        fecha = detalledatos[i]["FECHA VECIMIENTO"] == '' ? '' : detalledatos[i]["FECHA VECIMIENTO"];
        botoneliminar = `<div class="btn-group btn-group-sm" >            
                            <button type="button" class="btn btn-sm btn-outline-danger waves-effect btn-eliminar-item font-10" data-toggle="tooltip" data-placement="top" title="Editar Guía" `+ tempestado + ` disabled><i class="fa fa-trash-alt"></i></button>
                        </div>`;
        let cantidadactual = 0;
        if (estado != 'ENTREGADO')
            cantidadactual = parseInt(detalledatos[i]["CANTIDAD GENERADA"]) + parseInt(detalledatos[i]["CANTIDAD ACTUAL"]);
        else
            cantidadactual = parseInt(detalledatos[i]["CANTIDAD GENERADA"]);
        var auxtfila = tbldetalleguia.row.add([
            //'<bold>' + parseInt(i + 1) + '</bold>',
            '<span class="index"></span>',
            detalledatos[i]["IDDETALLE"],
            detalledatos[i]["IDPRODUCTO"],
            detalledatos[i]["PRODUCTO"],
            `<input type="number" class="text-center inputselection cantidadenviar" style="width:80px;" value="` + detalledatos[i]["CANTIDAD GENERADA"] + `" min="1" max="` + cantidadactual + `" required ` + tempestado + ` disabled/>`,
            '<input type="number" class="text-center inputselection cantidadpicking" style="width:80px;" value="' + detalledatos[i]["CANTIDAD PICKING"] + '" class="cantidad inputdetalle" min="1" max="' + detalledatos[i]["CANTIDAD PICKING"] + '" required disabled>',
            detalledatos[i]["IDSTOCK"],
            detalledatos[i]["LOTE"],
            fecha,
            botoneliminar
        ]).draw(false).node();
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
        auxtfila.setAttribute('idstock', detalledatos[i]["IDSTOCK"]);
    }
    fnagregarindex();
}

$(document).on('change keyup', '.cantidadenviar', function () {
    var cantidad = parseInt($(this).val());
    let max = parseInt($(this).attr('max'));
    console.log(max);
    if (cantidad === '' || cantidad === 0 || cantidad === isNaN) { cantidad = 1; $(this).val(1); }

    if (cantidad > max)
        $(this).val(max);

});

function obtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var detalle;
    var datatable = tbldetalleguia.rows().data();
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    //var filas = tbldetalleguia.data("tbody tr").length;
    var contadorVal = 0;
    filas.forEach(function (e) {
        detalle = new Object();
        detalle.iddetalleguiasalida = (datatable[c][1] === '') ? '0' : datatable[c][1];
        detalle.idproducto = datatable[c][2],
            detalle.cantidadgenerada = document.getElementsByClassName("cantidadenviar")[c].value;
        //detalle.cantidadanterior = document.getElementsByClassName("cantidadenviar")[c].max;
        detalle.cantidadpicking = document.getElementsByClassName("cantidadpicking")[c].value;
        if (detalle.cantidadpicking == 0) {
            contadorVal++;
        }
        detalle.idstock = datatable[c][6],
            detalle.estado = 'HABILITADO',
            detalle.idguiasalida = txtidguiasalida.val(),
            array[c] = detalle;
        c++;
    });
    if (contadorVal == c) {
        return -1;
    }
    return array;
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    //console.log('duplicar');
    let controller = new MantenimientoGuiaController();
    let obj = $('#form-registro').serializeArray();
    let detalle = obtenerDatosDetalle();
    if (detalle == -1) {
        alertaSwall("W", "La cantidad picking de todos los productos es 0", "");
    } else {
        if (detalle.length > 0) {
            obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
            obj[obj.length] = { name: "jsondetalleeliminar", value: JSON.stringify(arrayitemsdelete) };
            BLOQUEARCONTENIDO('form-registro', 'Guardando datos ...');
            if (tiporegistro == "EDITAR")
                controller.Registrar(obj, function (data) {
                    DESBLOQUEARCONTENIDO('form-registro');
                    cmbestadoguia.val(data.objeto.estadoguia);
                    if (data.objeto.estadoguia == "APROBADO" || data.objeto.estadoguia == "ANULADO")
                        desactivartodo();

                }, () => { DESBLOQUEARCONTENIDO('form-registro'); });
            else if (tiporegistro == "DUPLICAR")
                controller.AnularDuplicar(obj, function (data) {
                    DESBLOQUEARCONTENIDO('form-registro');

                    if (data.objeto.estadoguia == "APROBADO" || data.objeto.estadoguia == "ANULADO") {
                        desactivartodo();
                    }
                    if (data[0]["TIPOGUIA"] == 4)
                        btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuiaCliente/?id=" + data[0]["ID"]);
                    else
                        btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuia/" + data[0]["ID"]);
                    
                    cmbestadoguia.val(data.objeto.estadoguia);
                    txtcodigo.val(data.objeto.idguiasalida);
                    fnmostrarbotonesprimarios();
                    setTimeout("fnredirigerir()", 3000);


                }, () => { DESBLOQUEARCONTENIDO('form-registro'); });
        } else
            alertaSwall("W", "NO SE PUEDE GUARDAR UNA GUÍA SIN DETALLE DE PRODUCTOS", "");
    }

});

//btnanularcopy.click(function () {
//    //let controller = new MantenimientoGuiaController();
//    //let obj = $('#form-registro').serializeArray();
//    //let detalle = obtenerDatosDetalle();
//    //if (detalle.length > 0) {
//    //    obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
//    //    obj[obj.length] = {
//    //        name: "jsondetalleeliminar", value: JSON.stringify(arrayitemsdelete)
//    //    }
//    //    if (tiporegistro == "DUPLICAR")
//    //        controller.AnularDuplicar(obj, function (data) {
//    //            if (data.mensaje == "ok") {
//    //                if (data.objeto.estadoguia == "TRANSITO" || data.objeto.estadoguia == "ANULADO") {
//    //                    desactivartodo();
//    //                }
//    //                btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuia/" + data.objeto.idguiasalida);
//    //                cmbestadoguia.val(data.objeto.estadoguia);
//    //                txtcodigo.val(data.objeto.idguiasalida);
//    //                fnmostrarbotonesprimarios();
//    //                setTimeout("fnredirigerir()", 3000);

//    //            }
//    //            else
//    //                mensaje('W', data.mensaje);
//    //        });
//    //} 
//});

function fnredirigerir() {
    window.location = ORIGEN + '/Almacen/AMantenimientoGuia/RegistrarEditar/?id=' + txtcodigo.val();
}

$(document).on('click', '.btn-eliminar-item', function (e) {
    var columna = tbldetalleguia.row($(this).parents('tr')).data();
    mensajeModificarEstado('¿Desea quitar este item de la GUIA?', eliminaritem, columna)

});

//function mensajeeliminaritem(data) {
//    console.log(data);
//    var columna = tbldetalleguia.row($(this).parents('tr')).data();
//}

function eliminaritem(data) {
    arrayitemsdelete.push(data[1]);
    tbldetalleguia.row('.selected').remove().draw(false);
    fnagregarindex();
}

function cargarEmpresa() {
    let controller = new EmpresaTransporte();
    controller.ListarEmpresasTransporteEnCombo('idempresatransporte', '', '');
}

function cargarvehiculosxEmpresa(idempresa, idvehiculo) {
    let controller = new VehiculoController();
    let params = { idempresa: idempresa };
    controller.ListarVehiculosxEmpresaEnCombo('idvehiculo', params, '', idvehiculo);
}

function cargarvehiculosxid(id) {

    let controller = new VehiculoController();
    let params = { id: id };
    if (id != 0)
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

btnanular.click(function () {
    let url = ORIGEN + "/Almacen/AMantenimientoGuia/Anular";;
    let obj = { id: txtcodigo.val() };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje("S", "Registro Anulado", "BR");
            desactivartodo();
            //btnimprimir.prop("disabled", true);
        }
        else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
});
function desactivartodo() {
    disableElements($('#div_body').children());
    //btnimprimir.prop("disabled", false);
    btnimprimir.removeAttribute("disabled");

}
function disableElements(el) {
    for (var i = 0; i < el.length; i++) {
        el[i].disabled = true;
        disableElements(el[i].children);
    }
}

function fnimprimir() {
    if (txtidguiasalida.val() != '') {
        var href = btnimprimir.getAttribute('href');
        console.log(href);
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR GUIA REMISIÓN');
    }
}
//ANULAR Y DUPLICAR
var div_botonesprincipales = document.getElementById('div_botonesprincipales');
var div_botonesduplicado = document.getElementById('div_botonesduplicado');

function fnhabilitarediciondetalle() {
    var c = 0;
    var datatable = tbldetalleguia.rows().data();
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    filas.forEach(function (e) {
        document.getElementsByClassName("cantidadenviar")[c].removeAttribute('disabled');
        document.getElementsByClassName("cantidadpicking")[c].removeAttribute('disabled');
        document.getElementsByClassName("btn-eliminar-item")[c].removeAttribute('disabled');
        c++;
    });
}

function fnmostrarbotonesprimarios() {
    if (txtcodigo.val() != "") {
        tiporegistro = "EDITAR";
        let obj = { id: txtcodigo.val() };
        let controller = new GuiaSalidaController();
        controller.GetGuiaSalidaCompleta(obj, fncargarsolodetalle);
        div_botonesprincipales.style.display = 'inline';
        div_botonesduplicado.style.display = 'none';
    } else {
        mensaje("W", "No se puede duplicar una guía que no existe", "TR")
    }
}

function fnmostrarbotonessecundarias() {
    tiporegistro = "DUPLICAR";
    fnhabilitarediciondetalle();
    div_botonesprincipales.style.display = 'none';
    div_botonesduplicado.style.display = 'inline';
}

//NUEVOS ITEMS

$('#btn-agregaritem').click(function () {
    if (cmbidalmacensucursalorigen.val() == "")
        mensaje("W", "SELECCIONE UN ALMACÉN", "TR");
    else {
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
        botoneliminar = `<div class="btn-group btn-group-sm" >            
                            <button type="button" class="btn btn-sm btn-outline-danger waves-effect btn-eliminar-item font-10" data-toggle="tooltip" data-placement="top" title="Eliminar item del detalle"><i class="fa fa-trash-alt"></i></button>
                        </div>`;
        var fila = tbldetalleguia.row.add([
            '<span class="index"></span>',
            0,
            data.idproducto,
            data.nombre,
            '<input type="number" value="1"  class= "text-center inputselection cantidadenviar" style = "width:80px;" min="1" max="' + cantidadactual + '" required>',
            '<input type="number" value="1" class= "text-center inputselection cantidadpicking" style = "width:80px;" min="1" max="' + cantidadactual + '" required>',
            data.idstock,
            data.lote,
            data.fechavencimiento,
            botoneliminar
            //'<button type="button" class="btn btn-sm btn-danger btnquitaritem"><i class="fas fa-trash"><i></button>'
        ]).draw(false).node();
        fila.setAttribute('idproducto', data.idproducto);
        fila.setAttribute('idstock', data.idstock);
        fnagregarindex();
    });
}
//$(document).on('click', '.btnquitaritem', function () {
//    tbldetalleguia.row('.selected').remove().draw(false);
//    fnagregarindex();
//});

function fnagregarindex() {
    let filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    let c = 1;
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