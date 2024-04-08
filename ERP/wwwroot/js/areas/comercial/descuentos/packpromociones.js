//--EARTCOD1009--//
var MCPP_btnAgregar = document.getElementById('MCPP_btnAgregar');
var MCPP_btnguardar = document.getElementById('MCPP_btnguardar');
var MCPP_btnhistorial = document.getElementById('MCPP_btnhistorial');
var MCPP_btnsucursales = document.getElementById('MCPP_btnsucursales');
var MCPP_btnactualizar = document.getElementById('MCPP_btnactualizar');
var MCPP_btnnuevo = document.getElementById('MCPP_btnnuevo');

var mMCPP_txtcodigoproducto = document.getElementById('mMCPP_txtcodigoproducto');
var mMCPP_txtcantidad = document.getElementById('mMCPP_txtcantidad');
var mMCPP_idstock = document.getElementById('mMCPP_idstock');
var mMCPP_txtstockproducto = document.getElementById('mMCPP_txtstockproducto');
var mMCPP_txtnombreproducto = document.getElementById('mMCPP_txtnombreproducto');
var mMCPP_idproducto = document.getElementById('mMCPP_idproducto');
var mMCPPbtnProductoAgregar = document.getElementById('mMCPPbtnProductoAgregar');


var MCPP_txtPromocionNombre = document.getElementById('MCPP_txtPromocionNombre');
var MCPP_txtPackCodigo = document.getElementById('MCPP_txtPackCodigo');
//var MCPP_txtStockPacks = document.getElementById('MCPP_txtStockPacks');
/*var MCPP_txtProductoTipo = document.getElementById('MCPP_txtProductoTipo');*/
var MCPP_txtPackDescripcion = document.getElementById('MCPP_txtPackDescripcion');
/*var MCPP_txtPromocionPrecio = document.getElementById('MCPP_txtPromocionPrecio');*/
//var MCPP_txtfechaInicio = document.getElementById('MCPP_txtfechaInicio');
//var MCPP_txtfechaTermino = document.getElementById('MCPP_txtfechaTermino');
var MCPP_idpromocionpack = document.getElementById('MCPP_idpromocionpack');

//var mhMCPP_txtfechaInicio = document.getElementById('mhMCPP_txtfechaInicio');
//var mhMCPP_txtfechaTermino = document.getElementById('mhMCPP_txtfechaTermino');
var mhMCPP_btnFiltrarHistorial = document.getElementById('mhMCPP_btnFiltrarHistorial');
var mhMCPP_txtNombrePack = document.getElementById('mhMCPP_txtNombrePack');



var pack_promoproductos = [];
var pack_promocanalventas = [];
var pack_sucursales = [];
var datatable_sucursales;

$(document).ready(function () {


    CalendarioFechaInput();
    ObtenerListaPrecios();
    ObtenerListaPreciosmodal();
    ObtenerCanalesVenta();
    PromocionPackSucursales();
  
    $("#MCPP_cmbListaPrecios").attr('disabled', false);
});

MCPP_btnguardar.addEventListener('click', function () {
    //ObtenerTablaPromoEnArray();
    PromocionesPackAgregar();
});

MCPP_btnactualizar.addEventListener('click', function () {
    PromocionesPackEditar()
});


MCPP_btnAgregar.addEventListener('click', function () {
    $('.alert-mensaje').hide();
    $('#modalAgregarProducto').modal('show');
});

MCPP_btnhistorial.addEventListener('click', function () {
    PromocionesPackListar();
});

MCPP_btnsucursales.addEventListener('click', function () {
    //PromocionPackSucursales();
    $('#modalPromoPackSucursales').modal('show');
});

mhMCPP_btnFiltrarHistorial.addEventListener('click', function () {
    PromocionesPackListar();
});

MCPP_btnnuevo.addEventListener('click', function () {
    //var demo = $("#tabla_promocionpacksucursales tr").length;
    //var demo = $("#tabla_promocionpacksucursales").dataTable().fnPageChange(0);
    //OBTENEMOS LAS FILAS SELECCIONADAS POR CHECKBOX
    //var demo = $(datatable_sucursales.$('input[type="checkbox"]').map(function () {
    //    return $(this).prop("checked") ? ($(this).closest('tr')[0]).cells[1].innerHTML : null;
    //}));
    //var rows = $("#tabla_promocionpacksucursales".$('input[type="checkbox"]').map(function () {
    //    return $(this).prop("checked") ? ($(this).closest('tr')[0]).cells[1].innerHTML : null;
    //}));
    //
    //
    //console.log("ESTAS SON LAS SUCURSALES");
    ////console.log(demo);
    //console.log(rows);
    

    LimpiarForm();
    ObtenerTablaPromoEnArray();
    $('#MCPP_btnactualizar').attr('disabled', true);
    //$('#MCPP_btnsucursales').attr('disabled', true);
    $('#MCPP_btnguardar').attr('disabled', false);
    $('#MCPP_btnAgregar').attr('disabled', false);

    //$("#MCPP_cmbListaPrecios").attr('disabled', false);

    //DESELECCIONAMOS TODOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_promocionpacksucursales").DataTable().row(index1))).prop("checked", false);
    });
});

mMCPP_txtcodigoproducto.addEventListener('keyup', function (e) {
    PromocionesPackBuscarProducto(mMCPP_txtcodigoproducto.value);
});

//EVENTO PARA ELIMINAR FILA DE LA TABLA
$(document).on('click', '.borrar-fila', function (event) {
    event.preventDefault();
    $(this).closest('tr').remove();
    ObtenerTablaPromoEnArray();
    CalcularPrecioTotalEstimado();
});

//EVENTO PARA REFRESCAR EL TOTAL AL MODIFICAR EL VALOR DEL INPUT NUMBER
$(document).on('keyup mouseup', '.event-numbers', function () {
    CalcularPrecioTotalEstimado();

    //SCRIPT PARA RECALCULAR EL TOTAL Y PORCENTAJE DESDE LOS INPUTS DETALLE
    var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
    var porcentaje_desc = $("#MCPP_txtPorcentajeFactor").val();
    $("#MCPP_txtPrecioTotalEstimado").val(parseFloat(totalreal * parseFloat((100 - porcentaje_desc) / 100)).toFixed(2));
});

//EVENTO PARA REFRESCAR EL PRECIO DEL PACK AL MODIFICAR EL VALOR DEL INPUT DESCUENTO
$(document).on('keyup mouseup', '#MCPP_txtPorcentajeFactor', function () {
    var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
    var porcentaje_desc = $("#MCPP_txtPorcentajeFactor").val();
    var totaldesc = parseFloat(totalreal * parseFloat((100 - porcentaje_desc) / 100)).toFixed(2);
    $("#MCPP_txtPrecioTotalEstimado").val(totaldesc);
});

//EVENTO PARA REFRESCAR EL PORCENTAJE EN BASE AL CAMBIO DEL PRECIO
$(document).on('keyup mouseup', '#MCPP_txtPrecioTotalEstimado', function () {
    //SCRIPT PARA CALCULAR EL PROCENTAJE EN BASE A LA SUMATORIA REAL Y EL PRECIO DESC
    var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
    var totalestimado = parseFloat($("#MCPP_txtPrecioTotalEstimado").val()).toFixed(2)
    $("#MCPP_txtPorcentajeFactor").val(parseFloat(100 - parseFloat((totalestimado * 100) / totalreal).toFixed(2)).toFixed(2));
});



//EVENTO PARA AGREGAR UN ITEM AL DETALLE DEL PACK PROMOCIONAL
$(document).on('click', '.agregar-producto', function (event) {
    event.preventDefault();

    var obj = {
        idstock: $(this).parents("tr").find("td").eq(0).html(),
        idproducto: $(this).parents("tr").find("td").eq(1).html(),
        codigoproducto: $(this).parents("tr").find("td").eq(2).html(),
        nombre: $(this).parents("tr").find("td").eq(3).html(),
        precio: $(this).parents("tr").find("td").eq(4).html(),
        precioxfraccion: $(this).parents("tr").find("td").eq(6).html(),
        multiplo: $(this).parents("tr").find("td").eq(7).html(),
        incentivo: $(this).parents("tr").find("td").eq(8).html()
    }

    ObtenerTablaPromoEnArray();
    //VERIFICAMOS SI EL PRODUCTO YA FUE AGREGADO
    var producto = pack_promoproductos.filter(function (producto) { return producto.codigoproducto == obj.codigoproducto });

    var notificacion;
    /* if (ValidacionFormModal()) {*/
    if (producto.length > 0) {
        notificacion = `<div class="alert alert-warning alert-mensaje" role="alert"> El producto ya se encuentra agregado!</div>`;
    } else {
        PromocionesPackAgregarFila(obj);
        CalcularPrecioTotalEstimado();
    }
    $(".modal-notificacion").html(notificacion);
    //} else {
    //    notificacion = `<div class="alert alert-danger alert-mensaje" role="alert"> No puede agregar un producto inexistente!</div>`;
    //    $(".modal-notificacion").html(notificacion);
    //}
    setTimeout(function () { $(".modal-notificacion").html(""); }, 3000);
});

//FUNCION PARA AGREGAR UNA PROMO Y SU DETALLE EN LA BD
function PromocionesPackAgregar() {

    // Array para almacenar los IDs seleccionados
    var idsSeleccionados = [];
    $('#listaPreciosTable tbody tr').each(function () {
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            var codigo = $(this).find('td:eq(1)').text();
            idsSeleccionados.push(codigo);
        }
    });
    var idchecklistapreciosselec = idsSeleccionados.join('|');
    console.log(idchecklistapreciosselec);
    ObtenerCanalesSeleccionados();
    ObtenerTablaPromoEnArray();
    ObtenerSucursalesSeleccionadas();

    var precioSindescuento = parseFloat($('#MCPP_txtPrecioTotal').val());
    var porcentajedescuento = parseFloat($('#MCPP_txtPorcentajeFactor').val());
    var CantidadDescuento = (precioSindescuento * porcentajedescuento) / 100;
    if (ValidacionForm().estado) {
        var obj = {
            nombrepromocion: MCPP_txtPromocionNombre.value,
            descripcion: MCPP_txtPackDescripcion.value,
            idlistaprecio: idchecklistapreciosselec,
            precio: $('#MCPP_txtPrecioTotalEstimado').val(),
            incentivo: $('#MCPP_txtIncentivoTotalPack').val(),
            detalle: pack_promoproductos,
            canalventas: pack_promocanalventas,
            idempleado: $('#MCPP_id_empleado').val(), //EARTCOD1009
            sucursales: pack_sucursales, //EARTCOD1009


            precioSindescuento: precioSindescuento, //EARTCOD1009
            CantidadDescuento: CantidadDescuento, //EARTCOD1009
            porcentajedescuento: porcentajedescuento, //EARTCOD1009

        };

        let controller = new DescuentoController();
        BLOQUEARCONTENIDO('cardexkbloquerarbotones', 'Actualizando...');
        controller.PromocionesPackAgregar(obj, function (data) {
            if (data == 'success') {
                mensaje('S', 'El pack fue agregado Exitosamente')
                LimpiarForm();
                DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
            } else {
                mensaje('W', data);
                DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
            }
        });
    } else {
       
        mensaje('I', ValidacionForm().mensaje);
        DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
    }
}

//FUNCION PARA BUSCAR UN PRODUCTO EN EL MODAL AGREGAR PRODUCTO
function PromocionesPackBuscarProducto(codigoproducto) {
    var obj = { codigoproducto: codigoproducto, suc_codigo: $("#MCPP_suc_codigo").val() };

    let controller = new DescuentoController();
    controller.PromocionesPackBuscarProducto(obj, function (data) {
        var json = data;
        //SCRIPT PARA GENERAR LA PAGINACION PARA LA TABLA DETALLE
        $('#pagination-container').pagination({
            dataSource: json,
            pageSize: 8,
            callback: function (data, pagination) {
                var html = GenerarTablaProductos(data);
                $('#contenedor_productoslistar').html(html);
            }
        });
    });
}

//FUNCION PARA GENERAR LA TABLA HTML CON LISTA DE PRODUCTOS ENCONTRADOS
function GenerarTablaProductos(data) {
    var tabla = `<table class="table mt-2" id="tabla_productos">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th>CODIGO</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr class='py-0'>"
            + '<td class="py-1 align-middle" style="display:none;">' + item.idstock + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idproducto + '</td>'
            + '<td class="py-1 align-middle">' + item.codigoproducto + '</td>'
            + '<td class="py-1 align-middle">' + item.nombre + '</td>'
            + '<td class="py-1 align-middle text-right">' + (item.precio != null ? item.precio.toFixed(2) : 0) + '</td>'
            + '<td class="py-1"><button class="btn btn-link agregar-producto"><i class=\'bi bi-bag-plus-fill h5\'></i></button></td>'
            + '<td class="py-1 align-middle text-right" style="display:none;">' + (item.precioxfraccion != null ? item.precioxfraccion.toFixed(2) : 0) + '</td>'
            + '<td class="py-1 align-middle text-right" style="display:none;">' + (item.multiplo != null ? item.multiplo : 0) + '</td>'
            + '<td class="py-1 align-middle text-right" style="display:none;">' + item.incentivo.toFixed(2) + '</td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

//FUNCION PARA GENERAR UNA FILA NUEVA EN EL DETALLE DEL PACK DE PRODUCTOS
function PromocionesPackAgregarFila(obj) {
    var fila = '<tr class="py-1">'
        + '<td class="py-1 align-middle" style="display:none;">' + "0" + '</td>'
        + '<td class="py-1 align-middle" style="display:none;">' + obj.idstock + '</td>'
        + '<td class="py-1 align-middle" style="display:none;">' + obj.idproducto + '</td>'
        + '<td class="py-1 align-middle">' + obj.codigoproducto + '</td>'
        + '<td class="py-1 align-middle">' + obj.nombre + '</td>'
        + '<td class="py-1 align-middle" style="width:100px;"><input type="number" class="form-control form-control-sm event-numbers" value="' + 1 + '" min=1 required></td>'
        + '<td class="py-1 align-middle" style="width:100px; text-align:center;"><input type="checkbox" class="checkstockfraccion" ' + (obj.multiplo <= 1 ? "disabled" : "") + '/></td>'
        + '<td class="py-1 align-middle mcpPrecioUnitario">' + obj.precio + '</td>'
        + '<td class="py-1 align-middle mcpIncentivoUnitario">' + obj.incentivo + '</td>'
        + '<td class="py-1"><button class="btn btn-link borrar-fila"><i class=\'bi bi-trash-fill h5\'></i></button></td>'
        + '<td class="py-1 align-middle mcpPrecioxfraccion" style="display:none;">' + obj.precioxfraccion + '</td>'
        + '<td class="py-1 align-middle mcpPrecioUnitariotemp" style="display:none;">' + obj.precio + '</td>'
        + '<td class="py-1 align-middle mcpIncentivoUnitariotemp" style="display:none;">' + obj.incentivo + '</td>'
        + "</tr>";
    $("#tabla_pack_promo>tbody").append(fila);
}

//FUNCION PARA VALIDAR CAMPOS NULOS DEL MODAL
function ValidacionFormModal() {
    if ($("#mMCPP_txtcodigoproducto").val() == "") {
        $("#mMCPP_txtcodigoproducto").focus();
        return false;
    }
    if ($("#mMCPP_idproducto").val() == "") {
        return false;
    }
    return true;
}

//FUNCION PARA VALIDAR FORM PRINCIPAL
//function ValidacionForm() {

//    if ($("#MCPP_txtPromocionNombre").val() == "") {
//        $("#MCPP_txtPromocionNombre").focus();    
//        return false;
//    }
//    if ($("#MCPP_txtPackDescripcion").val() == "") {
//        $("#MCPP_txtPackDescripcion").focus();
//        return false;
//    }
//    if ($('#MC_tabla_canal_ventas').find('tbody').find('tr').has('input[type=checkbox]:checked').length<=0) {
//        return false;
//    }
//    //if ($("#MCPP_txtPromocionPrecio").val() == "" || isNaN($("#MCPP_txtPromocionPrecio").val())) {
//    //    $("#MCPP_txtPromocionPrecio").focus();
//    //    return false;
//    //}
//    if (pack_promoproductos.length<=0) {
//        return false;
//    }
//    return true;
//}

function ValidacionForm() {
    var obj = { estado: true, mensaje: "success" }
    if ($("#MCPP_txtPromocionNombre").val() == "") {
        $("#MCPP_txtPromocionNombre").focus();
        obj.estado = false;
        obj.mensaje = "Complete los campos solicitados";
        return obj;
    }
    if ($("#MCPP_txtPackDescripcion").val() == "") {
        $("#MCPP_txtPackDescripcion").focus();
        obj.estado = false;
        obj.mensaje = "Complete los campos solicitados";
        return obj;
    }

    if ($("#MCPP_cmbListaPrecios").val() == "") {
        $("#MCPP_cmbListaPrecios").focus();
        obj.estado = false;
        obj.mensaje = "Seleccione un elemento de lista";
        return obj;
    }
    if (pack_promoproductos.length <= 0) {
        obj.estado = false;
        obj.mensaje = "agrege al menos un producto en el detalle";
        return obj;
    }
    if ($('#MC_tabla_canal_ventas').find('tbody').find('tr').has('input[type=checkbox]:checked').length <= 0) {
        obj.estado = false;
        obj.mensaje = "seleccione uno o más canales de venta";
        return obj;
    }
    if ($("#MCPP_txtPrecioTotalEstimado").val() == "") {
        $("#MCPP_txtPrecioTotalEstimado").focus();
        obj.estado = false;
        obj.mensaje = "Ingrese una cantidad numerica";
        return obj;
    }
    if ($("#MCPP_txtPorcentajeFactor").val() == "" || $("#MCPP_txtPorcentajeFactor").val() < 0 || $("#MCPP_txtPorcentajeFactor").val() > 100) {
        $("#MCPP_txtPorcentajeFactor").focus();
        obj.estado = false;
        obj.mensaje = "El porcentaje esta fuera del rango establecido";
        return obj;
    }

    if (parseFloat($("#MCPP_txtPrecioTotalEstimado").val()) > parseFloat($("#MCPP_txtPrecioTotal").val())) {
        $("#MCPP_txtPrecioTotalEstimado").focus();
        obj.estado = false;
        obj.mensaje = "El precio promocional sobrepasa el monto normal" + $("#MCPP_txtPrecioTotalEstimado").val() + ' de ' + $("#MCPP_txtPrecioTotal").val();
        return obj;
    }

    

    if (parseFloat($("#MCPP_txtIncentivoTotalPack").val()) < 0.00) {
        $("#MCPP_txtIncentivoTotalPack").focus();
        obj.estado = false;
        obj.mensaje = "El incentivo promocional debe ser mayor que cero";
        return obj;
    }

    if (isNaN(parseFloat($("#MCPP_txtIncentivoTotalPack").val())) == true) {
        $("#MCPP_txtIncentivoTotalPack").focus();
        obj.estado = false;
        obj.mensaje = "El incentivo promocional debe ser de tipo numérico";
        return obj;
    }

    if (pack_sucursales.length == 0) {
        $('#modalPromoPackSucursales').modal('show');
        obj.estado = false;
        obj.mensaje = "Seleccione al menos una sucursal antes de registrar la promoción";
        return obj;
    }

    var idsSeleccionados = [];

    $('#listaPreciosTable tbody tr').each(function () {
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            var codigo = $(this).find('td:eq(1)').text();
            idsSeleccionados.push(codigo);
        }
    });
    var idchecklistapreciosselec = idsSeleccionados.join('|');
    if (idchecklistapreciosselec.length === 0) {
        obj.estado = false;
        obj.mensaje = "Elegir una lista de precios";
        document.querySelector('#dropdownMenuClase').click();
        return obj;
    }

    return obj;
}

//FUNCION PARA LIMPIAR FORM PRINCIPAL
function LimpiarForm() {
    $("#MCPP_txtPromocionNombre").val("");
    //$("#MCPP_txtPromocionPrecio").val("");
    $("#MCPP_idpromocionpack").val("");
    $("#MCPP_txtPackDescripcion").val("");
    $("#MCPP_txtPackCodigo").val("");
    $("#MCPP_txtStockPacks").val("");
    //$("#MCPP_txtProductoTipo").val("");

    $("#tabla_pack_promo tbody").empty();
    $("#MCPP_txtPrecioTotalEstimado").val(0.00);
    $("#MCPP_txtPrecioTotal").val(0.00);
    $("#MCPP_txtPorcentajeFactor").val(0);
    //$('#MCPP_cmbListaPrecios').val(""),

    $('.checklista').prop("checked", false);

    $("#MCPP_txtIncentivoTotalPack").val(0.00);
    $("#MCPP_txtIncentivoTotal").val(0.00);
    $('#listaPreciosModal input[type=checkbox]').prop('checked', false);

    CalendarioFechaInput();
    PromocionPackSucursales();
}

//FUNCION PARA OBTENER LOS DATOS DE LA TABLA EN UN ARRAY 
//PARA MANEJAR EL DETALLE DEL PACK DESDE EL ARRAY
function ObtenerTablaPromoEnArray() {
    pack_promoproductos = [];
    $('#tabla_pack_promo>tbody tr').each(function () {
        var obj = {
            idpromopackdetalle: $(this).find("td").eq(0).html(),
            idstock: $(this).find("td").eq(1).html(),
            idproducto: $(this).find("td").eq(2).html(),
            codigoproducto: $(this).find("td").eq(3).html(),
            descripcion: $(this).find("td").eq(4).html(),
            cantidad: $(this).find("td").eq(5).find("input").val(),
            xfraccion: $(this).find("td").eq(6).has('input[type=checkbox]:checked').length,
            precio: $(this).find("td").eq(7).html(),
            incentivo: $(this).find("td").eq(8).html(),////
            subtotal: ($(this).find("td").eq(5).find("input").val()) * ($(this).find("td").eq(7).html()),
            subtotalincentivo: ($(this).find("td").eq(5).find("input").val()) * ($(this).find("td").eq(8).html())
        };
        pack_promoproductos.push(obj);
    });
    console.log("HOLA ES TE EL ARRAY");
    console.log(pack_promoproductos);
}

//FUNCION PARA CALCULAR EL PRECIO ESTIMADO DE TODO EL DETALLE DEL PACK
function CalcularPrecioTotalEstimado() {
    ObtenerTablaPromoEnArray();
    var suma = 0.00;
    let incentivototal = 0.00;
    pack_promoproductos.forEach(function (producto, index) {
        suma += producto.subtotal;
        incentivototal += producto.subtotalincentivo;
    });

    //$("#MCPP_txtPrecioTotalEstimado").val(suma.toFixed(2));
    $("#MCPP_txtIncentivoTotal").val(incentivototal.toFixed(2));
    $("#MCPP_txtPrecioTotal").val(suma.toFixed(2));
    //console.log(suma);
    //var porcentaje_desc = $("#MCPP_txtPorcentajeFactor").val();
    //$("#MCPP_txtPrecioTotalEstimado").val(suma.toFixed(2) *parseFloat((100 - porcentaje_desc) / 100))

}

//FUNCION DATEPICKER PARA INPUT TEXT
function CalendarioFechaInput() {
    var fecha = new Date();
    var strFecha = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    $('.date_fecha').val(strFecha);

    var date_input = $('input[name="date_fecha"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "modal_body";
    var options = {
        dateFormat: 'dd/mm/yy',
        container: container,
        todayHighlight: true,
        autoclose: true
    };
    date_input.datepicker(options);
}

//FUNCION PARA MOSTRAR EL HISTORIAL DE PROMOCIONES DE LA BD
function PromocionesPackListar() {
    var obj = {
        nombrepack: mhMCPP_txtNombrePack.value != ' ' ? mhMCPP_txtNombrePack.value : ' '
    };

    let controller = new DescuentoController();
    controller.PromocionesPackListar(obj, function (data) {
        var json = data;
        //console.log("estos son los datos");
        //console.log(data);
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-container-historial').pagination({
            dataSource: json,
            pageSize: 8,
            callback: function (data, pagination) {
                var html = GenerarTablaPromocionesPack(data);
                $('#contenedor_promopacklistar').html(html);
            }
        });
    });

    $('#modalPromoPackListar').modal('show');
}

//FUNCION PARA GENERAR LA TABLA HTML CON EL HISTORIAL DE PROMOS
function GenerarTablaPromocionesPack(data) {
    var tabla = `<table class="table mt-2" id="tabla_promocionpacklistar">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th>CODIGO PACK</th>
                <th>NOMBRE</th>
                <th>FECHA</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr class='py-0'>"
            + "<td class='py-0 align-middle'>" + item.codigoproducto + "</td>"
            + "<td class='py-0 align-middle'>" + item.nombre + "</td>"
            + "<td class='py-0 align-middle'>" + item.fechacreacion.split('T')[0].split('-').reverse().join('/') + "</td>"
            + '<td class="py-0 align-middle"><button class="btn btn-dark" onclick="PromocionesPackbuscar(\'' + item.idproducto + '\')"><i class=\'bi bi-search h6\'></i></button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

//FUNCION PARA GENERAR LA TABLA HTML CON EL DETALLE DE LA PROMO DE LA BD
function GenerarTablaDetallePromo(data) {
    $("#tabla_pack_promo tbody").empty();
    $.each(data, function (index, item) {
        var fila = '<tr class="py-1">'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idpromopackdetalle + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idstock + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idproducto + '</td>'
            + '<td class="py-1 align-middle">' + item.codigoproducto + '</td>'
            + '<td class="py-1 align-middle">' + item.nombre + '</td>'
            + '<td class="py-1 align-middle" style="width:100px;"><input type="number" class="form-control form-control-sm event-numbers" value="' + item.cantidad + '"  min="1" required></td>'
            + '<td class="py-1 align-middle" style="width:100px; text-align:center;"><input type="checkbox" class="checkstockfraccion" ' + (item.xfraccion > 0 ? "checked" : "") + ' ' + ((item.multiplo != null ? item.multiplo : 0) <= 1 ? "disabled" : "") + '/></td>'
            + '<td class="py-1 align-middle text-right mcpPrecioUnitario">' + (item.xfraccion == 0 ? item.precio.toFixed(2) : (item.precioxfraccion != null ? item.precioxfraccion.toFixed(2) : 0)) + '</td>'
            + '<td class="py-1 align-middle mcpIncentivoUnitario">' + item.incentivo.toFixed(2) + '</td>'
            + '<td class="py-1"><button class="btn btn-link borrar-fila"><i class=\'bi bi-trash-fill h5\'></i></button></td>'
            + '<td class="py-1 align-middle mcpPrecioxfraccion" style="display:none;">' + (item.precioxfraccion != null ? item.precioxfraccion.toFixed(2) : 0) + '</td>'
            + '<td class="py-1 align-middle mcpPrecioUnitariotemp" style="display:none;">' + item.precio.toFixed(2) + '</td>'
            + '<td class="py-1 align-middle mcpIncentivoUnitariotemp" style="display:none;">' + item.incentivo + '</td>'
            + "</tr>";
        $("#tabla_pack_promo>tbody").append(fila);
    });
}

//EVENTO PARA RECALCULAR EL TOTAL AL SELECCIONAR EL CHECK BOX DE FRACCION 
$(document).on('click', '.checkstockfraccion', function () {
    var fila = this.parentNode.parentNode;
    if (this.checked) {
        fila.getElementsByClassName('mcpPrecioUnitario')[0].innerHTML = fila.getElementsByClassName('mcpPrecioxfraccion')[0].innerHTML
    } else {
        fila.getElementsByClassName('mcpPrecioUnitario')[0].innerHTML = fila.getElementsByClassName('mcpPrecioUnitariotemp')[0].innerHTML
    }
    CalcularPrecioTotalEstimado();

    var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
    var porcentaje_desc = $("#MCPP_txtPorcentajeFactor").val();
    var totaldesc = parseFloat(totalreal * parseFloat((100 - porcentaje_desc) / 100)).toFixed(2);
    $("#MCPP_txtPrecioTotalEstimado").val(totaldesc);
});

//FUNCION PARA MOSTRAR LA PROMOCION SELECCIONADA DEL HISTORIAL
function PromocionesPackbuscar(idpromopack) {
    var obj = { idpromopack: idpromopack };

    let controller = new DescuentoController();
    controller.PromocionesPackbuscar(obj, function (data) {

        let listasArray = JSON.parse(data[0].listas);

        // Verifica si listasArray es un array antes de intentar usar map
        if (Array.isArray(listasArray)) {
            // Obtener un array de idlistaprecio
            let idsASeleccionar = listasArray.map(function (item) {
                return item.idlistaprecio.toString();
            });

            // Llamamos a la función para seleccionar los checkboxes
            seleccionarCheckboxeslistaprecios(idsASeleccionar);
        }


        MCPP_idpromocionpack.value = data[0].idpromopack;
        MCPP_txtPromocionNombre.value = data[0].nombrepromocion;
        MCPP_txtPackDescripcion.value = data[0].descripcion;
        MCPP_txtPackCodigo.value = data[0].codigopromopack;
        $('#MCPP_txtIncentivoTotalPack').val(data[0].incentivo.toFixed(2));
        $('#MCPP_cmbListaPrecios').val(data[0].idlistaprecio);
        $('#MCPP_txtPrecioTotalEstimado').val(data[0].precio != null ? data[0].precio.toFixed(2) : 0);
            //MCPP_txtPromocionPrecio.value = data[0].precioventa.toFixed(2);
            //MCPP_txtfechaInicio.value = data[0].fechainicio.split('T')[0].split('-').reverse().join('/');
            //MCPP_txtfechaTermino.value = data[0].fechatermino.split('T')[0].split('-').reverse().join('/');
            //MCPP_txtProductoTipo.value = data[0].tipo;
            //MCPP_txtStockPacks.value = data[0].stockajustado;
        GenerarTablaDetallePromo(data[0].detalle);
        SeleccionarCanalesVentas(data[0].canalventas);
        //pack_promocanalventasselecionadas = data[0].canalventas
        CalcularPrecioTotalEstimado();
        SeleccionarSucursales(data[0].sucursales);
      
        //SCRIPT PARA CALCULAR EL PROCENTAJE EN BASE A LA SUMATORIA REAL Y EL PRECIO DESC
        var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
        var totalestimado = parseFloat($("#MCPP_txtPrecioTotalEstimado").val()).toFixed(2)
        $("#MCPP_txtPorcentajeFactor").val(100 - parseFloat((totalestimado * 100) / totalreal).toFixed(2));
    });

    $('#modalPromoPackListar').modal('hide');
    $('#MCPP_btnguardar').attr('disabled', true);
    $('#MCPP_btnactualizar').attr('disabled', false);
    $('#MCPP_btnsucursales').attr('disabled', false);
    $('#MCPP_btnAgregar').attr('disabled', false);
    //$("#MCPP_cmbListaPrecios").attr('disabled', true);


    //SCRIPT PARA CALCULAR EL PROCENTAJE EN BASE A LA SUMATORIA REAL Y EL PRECIO DESC
    //var totalreal = parseFloat($("#MCPP_txtPrecioTotal").val()).toFixed(2);
    //var totalestimado = parseFloat($("#MCPP_txtPrecioTotalEstimado").val()).toFixed(2)
    //$("#MCPP_txtPorcentajeFactor").val(parseFloat((totalestimado * 100)/totalreal).toFixed(2));

}
function seleccionarCheckboxeslistaprecios(idsASeleccionar) {
    idsASeleccionar.forEach(function (idASeleccionar) {
        // Buscamos la fila que contiene el idlistaprecio correspondiente
        let fila = $('#listaPreciosModal tbody tr').filter(function () {
            return $(this).find('td:eq(1)').text() === idASeleccionar.toString();
        });

        // Marcamos el checkbox de la fila encontrada
        fila.find('input[type="checkbox"]').prop('checked', true);
    });
}
//FUNCION PARA EDITAR UNA PROMO Y SU DETALLE EN LA BD
function PromocionesPackEditar() {

    var idsSeleccionados = [];
    $('#listaPreciosTable tbody tr').each(function () {
        if ($(this).find('input[type="checkbox"]').prop('checked')) {
            var codigo = $(this).find('td:eq(1)').text();
            idsSeleccionados.push(codigo);
        }
    });
    var idchecklistapreciosselec = idsSeleccionados.join('|');
    ObtenerCanalesSeleccionados();
    ObtenerTablaPromoEnArray();
    ObtenerSucursalesSeleccionadas();

    var precioSindescuento = parseFloat($('#MCPP_txtPrecioTotal').val());
    var porcentajedescuento = parseFloat($('#MCPP_txtPorcentajeFactor').val());
    var CantidadDescuento = (precioSindescuento * porcentajedescuento) / 100;
    if (ValidacionForm().estado) {
        var obj = {
            idpromopack: MCPP_idpromocionpack.value,
            nombrepromocion: MCPP_txtPromocionNombre.value,
            descripcion: MCPP_txtPackDescripcion.value,
            idlistaprecio: idchecklistapreciosselec,
            precio: $('#MCPP_txtPrecioTotalEstimado').val(),
            detalle: pack_promoproductos,
            canalventas: pack_promocanalventas,
            idempleado: $('#MCPP_id_empleado').val(), //EARTCOD1009
            sucursales: pack_sucursales, //EARTCOD1009
            incentivo: $('#MCPP_txtIncentivoTotalPack').val(), //EARTCOD1009

            
            precioSindescuento: precioSindescuento, //EARTCOD1009
            CantidadDescuento: CantidadDescuento, //EARTCOD1009
            porcentajedescuento: porcentajedescuento, //EARTCOD1009
        };

        let controller = new DescuentoController();
        BLOQUEARCONTENIDO('cardexkbloquerarbotones', 'Actualizando...');
        controller.PromocionesPackEditar(obj, function (data) {
            if (data == 'success') {
                mensaje('S', 'Datos actualizados exitosamente');
                LimpiarForm();
                $('#MCPP_btnactualizar').attr('disabled', true);
                $('#MCPP_btnsucursales').attr('disabled', true);
                $('#MCPP_btnAgregar').attr('disabled', true);
                DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
            } else {
                mensaje('W', data);
                DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
            }

        });
    } else {
        mensaje('I', ValidacionForm().mensaje);
        DESBLOQUEARCONTENIDO('cardexkbloquerarbotones');
    }


}


//-----------------------------------------------
//--EARTCOD1009 FUNCIONES PARA LA INTERFAZ ASIGNAR SUCURSALES
//-----------------------------------------------

$("#msucMCPP_btnGuardarCambios").click(function () {
    PromocionPackSucursalAgregar();
});

$('#chkallsucursales').on('change', function () {
    if (this.checked) {
        //console.log("checked box");
        $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", true);
    } else {
        $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", false);
    }
});

//FUNCION PARA MOSTRAR EL LISTADO DE SUCURSALES DE LA BD
function PromocionPackSucursales() {
    //var obj = { idempresa: $("#MCPP_idempresa").val() };
    var obj = { idempresa: 0 };
    let controller = new DescuentoController();
    controller.PromocionPackSucursales(obj, function (data) {
        GenerarTablaPromocionesSucursales(data);
    });
    //$('#modalPromoPackSucursales').modal('show');
}

//FUNCION PARA GENERAR LA TABLA HTML CON LAS SUCURSALES DE LA BD
function GenerarTablaPromocionesSucursales(data) {
    $("#tabla_promocionpacksucursales tbody").empty();
    $.each(data, function (index, item) {
        var fila_suc = "<tr class='py-0'>"
            + '<td class="py-0 align-middle" style="width: 8%"><input type="checkbox"/></td>'
            + "<td style='width:10%' class='py-0 align-middle'>" + item.suc_codigo + "</td>"
            + "<td class='py-0 align-middle'>" + item.descripcion + "</td>"
            + "</tr>";
        $("#tabla_promocionpacksucursales>tbody").append(fila_suc);
    });
    //PAGINAMOS LA TABLA CON DATABLES.JS
    datatable_sucursales = $('#tabla_promocionpacksucursales').DataTable(
        {
            searching: false,
            info: false,
            lengthChange: false,
            pageLength: 16,
            stateSave: true,
            bDestroy: true,
            ordering: false,
        });
    $(".row").css({ "backgroundColor": "transparent" });

    $("#tabla_promocionpacksucursales").dataTable().fnPageChange(0);
    $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", false);
    //SeleccionarSucursales();
}

//FUNCION PARA GUARDAR LAS SUCURSALES SELECCIONADAS POR CHECK
//function PromocionPackSucursalAgregar() {
//    pack_sucursales = [];
//    //OBTENEMOS LAS FILAS SELECCIONADAS POR CHECKBOX
//    var rows = $(datatable_sucursales.$('input[type="checkbox"]').map(function () {
//        return $(this).prop("checked") ? ($(this).closest('tr')[0]).cells[1].innerHTML : null;
//    }));

//    $.each(rows, function (index, item) {
//        var obj = {
//            suc_codigo: item,
//            idpromopack: $("#MCPP_idpromocionpack").val(),
//            fechainicio: $('#msucMCPP_txtfechaInicio').val(),
//            fechatermino: $('#msucMCPP_txtfechaTermino').val()

//        }
//        pack_sucursales.push(obj);
//    });

//    //console.log("hola mundo obj");
//    ////console.log(obj);
//    //console.log($('#MCPP_txtPromocionIncentivo').val());//EARTCOD1019
//    //console.log($('#MCPP_id_empleado').val());//EARTCOD1019

//    var obj = {
//        packSucursales: pack_sucursales,
//        incentivo: $('#MCPP_txtPromocionIncentivo').val(),//EARTCOD1019
//        idempleado: $('#MCPP_id_empleado').val()//EARTCOD1019
//    }

//    if (obj.packSucursales.length != 0) {
//        let controller = new DescuentoController();
//        controller.PromocionPackSucursalAgregar(obj, function (data) {
//            if (data == 'success') {
//                mensaje('S', 'Sucursales asignadas exitosamente!!')
//            } else {
//                mensaje('W', 'Error:' + data);
//            }
//            console.log(data);
//        });
//    } else {
//        //console.log("esta vacio");
//        mensaje('I', 'Seleccione al menos una sucursal antes de guardar cambios');
//    }
//}

//FUNCION PARA SELECCIONAR CON CHECKS LAS SUCURSALES GUARDADAS
//function SeleccionarSucursales() {
//    var obj = { idpromopack: $("#MCPP_idpromocionpack").val() }

//    var sucursales_asignadas = [];
//    let controller = new DescuentoController();
//    controller.PromocionPackSucursalLista(obj, function (data) {
//        var fechai = new Date(data[0].fechainicio);
//        var fechat = new Date(data[0].fechatermino);
//        $('#msucMCPP_txtfechaInicio').val(fechai.getDate() + "/" + (parseInt(fechai.getMonth()) + 1) + "/" + fechai.getFullYear());
//        $('#msucMCPP_txtfechaTermino').val(fechat.getDate() + "/" + (parseInt(fechat.getMonth()) + 1) + "/" + fechat.getFullYear());
//        //OBTENEMOS LAS SUCURSALES SELECCIONADAS
//        $.each(data, function (index, value) {
//            var obj = { suc_codigo: value.suc_codigo }
//            sucursales_asignadas.push(obj);
//        });
//        //COMPARAMOS LAS SUCURSALES SELECCIONADAS CON LA LISTA Y ACTIVAMOS LOS CHECKS
//        $.each(datatable_sucursales.rows().data(), function (index1, value1) {
//            $.each(sucursales_asignadas, function (index2, value2) {
//                if (value2.suc_codigo == value1[1]) {
//                    $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_promocionpacksucursales").DataTable().row(index1))).prop("checked", true);
//                }
//            });
//        });
//    });
//}

//FUNCION PARA OBTENER LA LISTA DE PRECIOS
function ObtenerListaPrecios() {
    let controller = new ListaPreciosController();
    controller.ListarListas(function (data) {
        $.each(data, function (index, item) {
            var option = $('<option/>');
            option.attr({ 'value': item.idlistaprecio }).text(item.descripcion);
            if (item.idlistaprecio == '1001') {
                option.attr("selected", "selected");
            }
            $('#MCPP_cmbListaPrecios').append(option);
        });
    });
}

function ObtenerListaPreciosmodal() {
    let controller = new ListaPreciosController();
    controller.ListarListas(function (data) {
        let modalBody = $('#listaPreciosModal tbody');
        modalBody.empty(); // Limpiamos el cuerpo de la tabla antes de agregar nuevos datos

        $.each(data, function (index, item) {
            // Creamos una fila para la tabla
            let row = $('<tr></tr>');

            // Añadimos celdas con el checkbox, el código y el nombre
            let checkboxCell = $('<td style="width: 10%;" class="text-center"><input type="checkbox"></td>');
            let codigoCell = $('<td style="width: 20%;">' + item.idlistaprecio + '</td>');
            let nombreCell = $('<td style="width: 40%;">' + item.descripcion + '</td>');
          

            row.append(checkboxCell);
            row.append(codigoCell);
            row.append(nombreCell);

            // Añadimos la fila al cuerpo de la tabla
            modalBody.append(row);
        });

        // Inicializamos el DataTable con configuración de columnas
        $('#listaPreciosTable').DataTable({
            "searching": false,
            "lengthChange": false,
            "ordering": false,
            "paging": false,
            "info": false,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 20, "All"]],
            "language": LENGUAJEDATATABLE()
        });
    });
}

//FUNCION PARA OBTENER LOS CANALES DE VENTA
function ObtenerCanalesVenta() {
    let controller = new ListaPreciosController();
    controller.ListarCanalesPrecios(function (data) {

        var tabla = `<table class="table mt-2" id="MC_tabla_canal_ventas">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th></th>
                <th class="my-0 py-2">DESCRIPCION</th>
            </tr>
        </thead>
        <tbody>`;
        $.each(data, function (index, item) {
            tabla += "<tr class='my-0 py-0'>"
                + '<td class="py-1 align-middle" style="display:none;">' + item.idcanalventa + '</td>'
                + '<td class="py-1 align-middle"><input type="checkbox" class="checklista"/></td>'
                + '<td class="py-1 align-middle">' + item.descripcion + '</td>'
                + "</tr>";
        });
        tabla += "</tbody></table>";
        $('#contenedor_MC_tabla_canal_ventas').html(tabla);
    });
}

//FUNCION PARA OBTENER LOS CHECKS DE LA LISTA PRECIOS
function ObtenerCanalesSeleccionados() {
    var selectedRows = $('#MC_tabla_canal_ventas').find('tbody').find('tr').has('input[type=checkbox]:checked')
    pack_promocanalventas = [];
    $.each(selectedRows, function (index, item) {
        var obj = { idcanalventa: item.childNodes[0].innerText }
        pack_promocanalventas.push(obj)
    });
}

//FUNCION PARA SELECCIONAR LOS CANALES ASIGNADOS EN LA LISTA
function SeleccionarCanalesVentas(data) {
    //LIMPIAMOS LOS CHECKS ANTERIORES
    $('.checklista').prop("checked", false);

    //LIMPIAMOS LOS CHECKS ANTERIORES
    $.each(data, function (index1, value1) {
        $('#MC_tabla_canal_ventas>tbody tr').each(function () {
            if (value1.idcanalventa == $(this).find("td").eq(0).html()) {
                //console.log("COINCIDENCIA");
                //$(this).find("td:eq(1) > input[type='checkbox']").attr("checked", true);
                $(this).find("td:eq(1) > input[type='checkbox']").prop("checked", true);
            }
        });
    });
}

//-----------------NUEVOS METODOS PARA SUCURSAL-------------//

function ObtenerSucursalesSeleccionadas() {
    pack_sucursales = [];
    //OBTENEMOS LAS FILAS SELECCIONADAS POR CHECKBOX
    var rows = $(datatable_sucursales.$('input[type="checkbox"]').map(function () {
        return $(this).prop("checked") ? ($(this).closest('tr')[0]).cells[1].innerHTML : null;
    }));

    $.each(rows, function (index, item) {
        var obj = {
            suc_codigo: item,
            idpromopack: $("#MCPP_idpromocionpack").val(),
            fechainicio: $('#msucMCPP_txtfechaInicio').val(),
            fechatermino: $('#msucMCPP_txtfechaTermino').val()

        }
        pack_sucursales.push(obj);
    });
}

//FUNCION PARA SELECCIONAR CON CHECKS LAS SUCURSALES GUARDADAS
function SeleccionarSucursales(data) {
    //DESELECCIONAMOS TODOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_promocionpacksucursales").DataTable().row(index1))).prop("checked", false);
    });

    var sucursales_asignadas = [];

    var fechai = new Date(data[0].fechainicio);
    var fechat = new Date(data[0].fechatermino);
    $('#msucMCPP_txtfechaInicio').val(fechai.getDate() + "/" + (parseInt(fechai.getMonth()) + 1) + "/" + fechai.getFullYear());
    $('#msucMCPP_txtfechaTermino').val(fechat.getDate() + "/" + (parseInt(fechat.getMonth()) + 1) + "/" + fechat.getFullYear());

    //OBTENEMOS LAS SUCURSALES SELECCIONADAS
    $.each(data, function (index, value) {
        var obj = { suc_codigo: value.suc_codigo }
        sucursales_asignadas.push(obj);
    });

    //COMPARAMOS LAS SUCURSALES SELECCIONADAS CON LA LISTA Y ACTIVAMOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $.each(sucursales_asignadas, function (index2, value2) {
            if (value2.suc_codigo == value1[1]) {
                $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_promocionpacksucursales").DataTable().row(index1))).prop("checked", true);
            }
        });
    });
}
