//--EARTCOD1009--//
var idpromopack_temp = "";

var cmbtipopedido = '<select style="font-size: smaller;" class="cmbtipopedido" id="cmbtipopedido" required="" name="idtipopedido"><option value="1">VENTA CON RECETA</option><option value="2">COMPLEMENTARIO FM</option><option value="3">TESTER DE VENTA</option><option value="5">COMPLEMENTARIO-TERCERO</option><option value="6">RECETA REPETIDA</option><option value="7">COMPLEMENTARIO PT</option><option value="8">CAMPAÑAS</option></select>';


//FUNCION PARA GENERAR LA TABLA HTML CON EL DETALLE PACK DE LA BD EN EL MODAL AL AGREGAR PEDIDO
var arraydetallepackpromo = [];
var stockcalculado;
function GenerarTablaDetallePromoModal(data) {
    $(".modal-notificacion").hide();
    //console.log("HOLA");
    //console.log(data);
    arraydetallepackpromo = data;
    $("#tabla_pack_promo_det_modal tbody").empty();

    $.each(data, function (index, item) {
        stockcalculado = item.stockcalculado;
        var fila = '<tr class="py-1">'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idpromopack + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idprecioproducto + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idstock + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.idproducto + '</td>'
            + '<td class="py-1 align-middle" style="display:none;">' + item.xfraccion + '</td>'
            + '<td class="py-1 align-middle">' + item.codigoproducto + '</td>'
            + '<td class="py-1 align-middle">' + item.nombre + '</td>'
            + '<td class="py-1 align-middle dtpCantidadItem">' + item.cantidad + '</td>'
            + '<td class="py-1 align-middle">' + item.candisponible + '</td>'
            + '<td class="py-1 align-middle">' + item.canfraccion + '</td>'
            + "</tr>";
        $("#tabla_pack_promo_det_modal>tbody").append(fila);
    });

    if (stockcalculado <= 0) {
        var notificacion = `<div class="alert alert-warning alert-mensaje mx-3" role="alert"> Stock insuficiente y/o producto no disponible para el pack promocional!</div>`;
        $(".modal-notificacion").show();
        $(".modal-notificacion").html(notificacion);
        $("#mMCPPbtnAgregarPackPromo").prop('disabled', true);
    } else {
        $("#mMCPPbtnAgregarPackPromo").prop('disabled', false);
    }

    if ($("#tabla_pack_promo_det_modal tbody tr").length <= 0) {
        var notificacion = `<div class="alert alert-warning alert-mensaje mx-3" role="alert"> Los productos deben compartir una lista de precios en comun!</div>`;
        $(".modal-notificacion").show();
        $(".modal-notificacion").html(notificacion);
        $("#mMCPPbtnAgregarPackPromo").prop('disabled', true);
    } else {
        $("#mMCPPbtnAgregarPackPromo").prop('disabled', false);
    }
}

//FUNCION PARA MOSTRAR EL DETALLE DEL PACK DE LA BD EN EL MODAL
function PromocionBuscarProductoStockVenta(idpromopack) {
    idpromopack_temp = idpromopack;
    var obj = {
        idsucursal: idsucursal_registra,
        idlistaprecio: MLScmblistapreios.value,
        idpromopack: idpromopack
    }
    let controller = new DescuentoController();
    controller.PromocionBuscarProductoStockVenta(obj, function (data) {

        GenerarTablaDetallePromoModal(data[0].detalle);
        $('#modalPromoPackDetalle_titulo').html(data[0].nombrepromocion);
        $('#mMCPP_idpromocionpack').val(data[0].idpromopack);
    });
    $('#modalPromoPackDetalle').modal('show');
}

$("#mMCPPbtnAgregarPackPromo").click(function () {
    //PromocionesPackBuscarProductoPedido($('#mMCPP_idpromocionpack').val());
    //ObtenerDetallePackParaPedido();

    //VERIFICAMOS SI EL PACK YA SE ENCUENTRA EN EL DETALLE
    ObtenerTablaDetallePedido();
    var producto = pack_detallepedido.filter(function (producto) { return producto.idpromopack == idpromopack_temp });

    var notificacion;
    /* if (ValidacionFormModal()) {*/

    if (parseInt($("#mMCPP_txtCantidad").val()) > 0 && parseInt($("#mMCPP_txtCantidad").val())<=stockcalculado) {
    //if (stockcalculado >= parseInt($("#mMCPP_txtCantidad").val())) {
        if (producto.length > 0) {
            notificacion = `<div class="alert alert-warning alert-mensaje" role="alert"> El pack ya se encuentra agregado!</div>`;
            $(".modal-notificacion").show();
            $(".modal-notificacion").html(notificacion);
        } else {
            PromocionesPackBuscarProductoPedidoNew(arraydetallepackpromo);
        }
    } else {
        var notificacion = `<div class="alert alert-warning alert-mensaje mx-3" role="alert"> Stock insuficiente para el pack promocional!</div>`;
        $(".modal-notificacion").show();
        $(".modal-notificacion").html(notificacionf);
    }

});

//FUNCION PARA QUITAR EL DETALLE DEL PACK DE PEDIDO
function quitarpromopackdetalle(obj) {
    $("." + obj).remove();
    fncalculartotal();
}


//NUEVA FUNCION PARA ENVIAR EL PACK DE PROMOCION AL DETALLE DEL PEDIDO EN REGISTRAR PEDIDO
function PromocionesPackBuscarProductoPedidoNew(data) {

    $.each(data, function (index, item) {
        var checkfracion = '';
        if (item.multiplo === 1 || item.multiplo === 0 || item.multiplo === null) {
            //console.log("hola mundo1");
            checkfracion = '';
        }
        else if (item.idtipoproducto == 'PT') {
            //console.log("hola mundo2");
            checkfracion = '<input   class="isfraccion" type="checkbox" multiplo="' + item.multiplo + '" ' + (item.xfraccion > 0 ? "checked" : "") + ' disabled/>';
        }

        var preciofinal = 0.00;
        if (item.xfraccion == "1") {
            preciofinal = item.precioxfraccion;
        } else {
            preciofinal = item.precio;
        }

        var cmbuso = "";
        if (item.idtipoproducto == 'FM')
            cmbuso = '<select class=" cmbuso" required><option value=""></option><option value="ORAL">ORAL</option><option value="EXTERNO">EXTERNO</option></select>';

        var fila = '';
        var cantidadpackInicial = parseInt($("#mMCPP_txtCantidad").val());
        var input_cant = '<input style="width:70%" class="text-center txtcantidad font-14" type="number" value="' + item.cantidad * parseInt($("#mMCPP_txtCantidad").val()) + '"  min="1" max="' + item.candisponible + '" required disabled/>';
        var subtotal = item.precio.toFixed(2);

        fila += '<tr class="' + item.idpromopack + '" idpromopack=' + item.idpromopack + ' preciopack=' + item.preciopack + '  cantidadpacks=' + cantidadpackInicial+ '  role="row" idprecioproducto=' + item.idprecioproducto + ' idproducto=' + item.idproducto + ' codigoprecio="' + item.codigoproducto + '" idstock="' + item.idstock + '">';
        fila += '<td>' + '</td>';
        fila += '<td>' + '</td>';
        fila += '<td class="formula align-middle" contenteditable="true">' + item.nombre + '</td>';
        fila += '<td id="holamundo" class="tipoitem align-middle">' + item.idtipoproducto + '</td>';
        fila += '<td class="precio text-right align-middle">' + preciofinal.toFixed(2) + '</td>';
        fila += '<td class="text-center align-middle">' + input_cant + '</td>';
        fila += '<td class="fraccion align-middle">' + checkfracion + '</td>';
        fila += '<td class="descuento align-middle">' + 0 + '</td>';
        fila += '<td class="subtotal text-right align-middle">' + parseFloat(subtotal).toFixed(2) + '</td>';
        fila += '<td class="subtotal text-right align-middle">' + cmbuso + '</td>';
        fila += '<td class="text-center align-middle tpform">' + cmbtipoformulacion + '</td>';
        fila += '<td class="text-center align-middle ">' + cmbtipopedido + '</td>';
        fila += '<td class="subtotal text-center align-middle"><button class="btn-link btneliminarpromo h5" type="button" onclick="quitarpromopackdetalle(' + item.idpromopack + ')"><i class="fas fa-trash-alt"></i></button></td>';
        fila += '</tr>';

        $("#tbodydetalle").append(fila);
    });
    fncalculartotal();

    $('#modallistaprecios').modal('hide');
    $('#modalPromoPackDetalle').modal('hide');
}


//FUNCION PARA OBTENER UNICAMENTE LOS PACKS DEL DETALLE PEDIDO
var pack_detallepedido = [];
function ObtenerTablaDetallePedido() {
    pack_detallepedido = [];
    var idpromopack_temp = "";
    var idpromopack = "";

    $('#tbldetalle>tbody tr').each(function () {
        idpromopack_temp = idpromopack;
        idpromopack = $(this).attr("idpromopack") != null ? $(this).attr("idpromopack") : "";
        if (idpromopack != idpromopack_temp) {
            var obj = {
                idpromopack: $(this).attr("idpromopack")
            };
            pack_detallepedido.push(obj);
        }
    });
}
