//inputs
var cmbiddocumento = document.getElementById('cmbiddocumento');
var txtserie = document.getElementById('txtserie');
var txtnumerodocumento = document.getElementById('txtnumerodocumento');
var txtnombrecaja = document.getElementById('txtnombrecaja');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtnombresucursal = document.getElementById('txtnombresucursal');

var lblfecha = document.getElementById('lblfecha');
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtnombresucursal = document.getElementById('txtnombresucursal');


var txtidventa = document.getElementById('txtidventa');
var txtidaperturacaja = document.getElementById('txtidaperturacaja');

var txtsubtotal = document.getElementById('txtsubtotal');
var txtigv = document.getElementById('txtigv');
var txttotal = document.getElementById('txttotal');
var txttotalredondeado = document.getElementById('txttotalredondeado');

var txtidtablaventapor = document.getElementById('txtidtablaventapor');
var txtventapor = document.getElementById('txtventapor');
var txtcodproforma = document.getElementById('txtcodproforma');


var lblventapor = document.getElementById('lblventapor');
//contenedores
var formregistro = document.getElementById('formregistro');

//buttons
var btncobrar = document.getElementById('btncobrar');
var btnimprimir = document.getElementById('btnimprimir');
var btncancelar = document.getElementById('btncancelar');
var btnanular = document.getElementById('btnanular');
var btnnuevo = document.getElementById('btnnuevo');

var btnagregaritem = document.getElementById('btnagregaritem');
var btnguardarventa = document.getElementById('btnguardarventa');

var btnbuscarproforma = document.getElementById('btnbuscarproforma');
var btnhistorialcliente = document.getElementById('btnhistorialcliente');
var btnpedido = document.getElementById('btnpedido');

var cmbtipodocmedico = document.getElementById('cmbtipodocmedico');
var txtnumcolegiatura = document.getElementById('txtnumcolegiatura');
var txtidmedico = document.getElementById('txtidmedico');
var btnbuscarmedico = document.getElementById('btnbuscarmedico');
var txtnombremedico = document.getElementById('txtnombremedico');
var contmedico = document.getElementById('contmedico');

var tbodydetalle = document.getElementById('tbodydetalle');
var totaltblpago = document.getElementById('totaltblpago');
var txttotalcobrar = document.getElementById('txttotalcobrar');

var contenedorcmbListaPrecios = document.getElementById('contenedorcmbListaPrecios');
var cmbListaPrecios = document.getElementById('cmbListaPrecios');

var sucursalGeneraGuia = false;

//VARIABLE PARA USO EN CALL CENTER
var idcajasucursal = 0;

//variables
var tbldetalle;
var _PRODUCTOSENDETALLE = [];
var PRECIOSPRODUCTO = [];
var contenedoragregaritem = document.getElementById('contenedoragregaritem');
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
        //EARTCOD1009
        'columnDefs': [
            { 'visible': false, 'targets': [0] }
        ]
        //-EARTCOD1009
    });
    init();
    if (IDSUCURSAL == '162' || (IDEMPLEADO == '459') || IDSUCURSAL == '188' || IDSUCURSAL == '189') {
        contenedoragregaritem.removeAttribute('style');
        contmedico.removeAttribute('style');
    } else {
        contenedoragregaritem.setAttribute('hidden', 'true');
        contmedico.setAttribute('hidden', 'true');
    }

    var colegiomedico = new ColegioController();
    colegiomedico.ListarColegiosCombo('cmbtipodocmedico');

    var url = ORIGEN + '/Administrador/Sucursal/Buscar';
    var obj = { id: IDSUCURSAL };
    $.post(url, obj).done(function (data) {
        sucursalGeneraGuia = data.generaguia;
    }).fail(function (data) {
        mensaje("W", data);
    });

});

btnbuscarmedico.addEventListener('click', function () {
    $('#modalmedico').modal('show');
});
$(document).on('click', '.MMbtnpasarmedico', function () {
    var fila = this.parentNode.parentNode;
    console.log(fila);
    //txtidmedico.value = this.getAttribute('id');
    txtidmedico.value = this.getAttribute('id');
    txtnumcolegiatura.value = fila.getElementsByTagName('td')[2].innerText;
    txtnombremedico.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalmedico').modal('hide');
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;

    if (tecla === '+')
        fnAbrirModalProductos();
    if (tecla === 'F1') {
        e.preventDefault();
        fncobrar();
    }
    if (tecla === 'F2') {
        e.preventDefault();
        fnNuevo();
    }
    if (tecla === 'F3') {
        e.preventDefault();
        fnimprimir();
    }
    if (tecla === 'F4') {
        e.preventDefault();
        fnCancelar();
    }
});
function init() {
    if (_TIPOVENTA == 'MANUAL') {
        txtserie.required = true;
        //txtserie.type = "number";
        //txtnumerodocumento.type = "number";
        txtnumerodocumento.required = true;

        txtserie.value = "00" + _SERIE[2] + _SERIE[3];
        txtnumerodocumento.value = _NUMDOCUMENTO;
    } else {
        txtnumerodocumento.setAttribute('readonly', true);
        txtserie.setAttribute('readonly', true);
    }
    let urlSearch = window.location.search;
    if (urlSearch.includes("guiasalida")) {
        BLOQUEARCONTENIDO('contenedortbllista', 'Cargando..........');
        let idguias = urlSearch.split("=")[1];
        let url = ORIGEN + "/Ventas/Venta/GetGuiasSalida";
        let obj = {
            guiasSalidas: idguias
        };
        $.post(url, obj).done(function (data) {
            let datos = data;
            if (datos.length > 0) {
                fnCargarDatosGuiasEnVentas(datos);
                DESBLOQUEARCONTENIDO('contenedortbllista');
            } else {
                mensaje("W", "Error?");
                DESBLOQUEARCONTENIDO('contenedortbllista');
            }
        }).fail(function (data) {
            mensajeError(data);
            DESBLOQUEARCONTENIDO('contenedortbllista');
        });

        contenedorcmbListaPrecios.removeAttribute("hidden");

        let controller = new ListaPreciosController();
        controller.ListarListas(function (data) {
            for (let i = 0; i < data.length; i++) {
                const option = document.createElement("option");
                option.value = data[i].idlistaprecio;
                option.text = data[i].descripcion;
                cmbListaPrecios.appendChild(option);
            }
        });
    }
    else if (urlSearch.includes("idpedido")) {
        let idpedido = urlSearch.split("=")[1];
        let controller = new PedidoController();
        controller.BuscarPedidoParaFacturar(idpedido, function (data) {
            fncargardatapedido(data);
        });
    }

    if (_MODELO != null) {
        txtidaperturacaja.value = _MODELO.idaperturacaja;
        fnListarDocumentoTributario(_MODELO.idaperturacaja, _MODELO.iddocumento, 2);
        let ventacontroller = new VentasController();
        ventacontroller.GetVentaCompleta(_MODELO.idventa, function (data) {
            fnCargardatosVenta(data[0]);
        });
    } else {
        txtnombrecaja.value = _DATOSCAJA.caja;
        txtidaperturacaja.value = _DATOSCAJA.idaperturacaja;
        fnListarDocumentoTributario(_DATOSCAJA.idcajasucursal, null, 1);
    }

    let monedacontroller = new MonedaController();
    monedacontroller.LLenarCombo('cmbmoneda', _MONEDAS);

    let tipopagocontroller = new TipoPagoController();
    tipopagocontroller.LLenarComboParaVena('cmbtipopago', _TIPOPAGO);

    $('.lblsimbolomoneda').text($('#cmbmoneda option:selected').attr('simbolo'));
}
function fnCargardatosVenta(data) {
    var cabecera = JSON.parse(data.CABECERA)[0];
    var detalle = JSON.parse(data.DETALLE);
    var pago = JSON.parse(data.PAGO)[0];
    var empresa = JSON.parse(data.EMPRESA)[0];


    txtnombrecaja.value = cabecera.caja;
    txtusuario.value = cabecera.usuario;
    txtnombreempresa.value = cabecera.empresa;
    txtnombresucursal.value = cabecera.sucursal;
    txtnumdoccliente.value = cabecera.numdoccliente;
    txtnombrescliente.value = cabecera.nombrecliente;
    txtnumdocpaciente.value = cabecera.numdocpaciente;
    txtnombrespaciente.value = cabecera.paciente;
    txtidpaciente.value = cabecera.idpaciente;
    btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket/" + cabecera.idventa);
    tbldetalle.clear().draw(false);


    for (var i = 0; i < detalle.length; i++) {
        detalle[i].isfraccion = detalle[i].isfraccion ?? false;
        //detalle[i].isblister = detalle[i].isblister??false;
        detalle[i].descuento = detalle[i].descuento ?? 0;
        var fila = tbldetalle.row.add([
            '',
            (i + 1),
            detalle[i].codigoproducto,
            detalle[i].producto,
            detalle[i].lote,
            detalle[i].fechavencimiento,
            '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number" disabled/>',
            (detalle[i].isfraccion) ? ' ✓' : '',
            //(detalle[i].isblister) ? ' ✓' : '',
            '<span class="precio_detalle font-14">' + detalle[i].precioigv.toFixed(2) + '</span>',
            '<span class="descuento_detalle font-14">' + detalle[i].descuento.toFixed(2) + '</span>',
            '<span class="importe_detalle font-14">' + (detalle[i].cantidad * detalle[i].precioigv).toFixed(2) + '</span>',
            ''
        ]).draw(false).node();
        fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
        (fila).setAttribute('tipo', detalle[i].tipo);
        if (detalle[i].tipo == 'bonificacion')
            (fila).classList.add('table-success');
    }
    fncalcularmontos();
}
function fnListarDocumentoTributario(idcajasucursal, iddocumento, tipo) {
    let controller = new DocumentoTributarioController();
    if (tipo == 1)
        controller.ListarDocumentosxCajaSucursalParaVentas(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
            if (_TIPOVENTA != 'MANUAL')
                txtserie.value = $("#cmbiddocumento option:selected").attr("serie");
        });
    else
        controller.ListarDocumentosxCajaAperturada(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
        });
}

function fnCancelar() {
    swal({
        title: '¿DESEA CANCELAR?',
        text: "",
        type: 'warning',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No [Esc]',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si [Enter]',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            location.href = ORIGEN + '/Ventas/Venta/VentaDirecta';
        }
        else
            swal.close();
    });
}

function fnNuevo() {
    formregistro.reset();
    if (_MODELO != null)
        location.href = ORIGEN + "/Ventas/Venta/VentaDirecta";
    txtnombrecaja.value = _DATOSCAJA.caja;
    txtidaperturacaja.value = _DATOSCAJA.idaperturacaja;
    txtnumdoccliente.setAttribute('numdoc', '');
    tbldetalle.clear().draw(false);
    txtidcliente.value = '';
    txtidventa.value = '';
    txtidtablaventapor.value = '';
    lblventapor.innerText = '';
    txtventapor.value = '';
    txtcodproforma.value = '';
    txtidpaciente.value = '';
    txtnumdocpaciente.value = '';
    txtnombrespaciente.value = '';
    fechanacimientoCliente = "";

    $("#cmbmoneda option:contains(SOL)").attr('selected', true);
    $("#cmbtipopago option:contains(EFECTIVO)").attr('selected', true);
    $("#cmbiddocumento option:contains(BOLETA)").attr('selected', true);
    if (_TIPOVENTA == 'MANUAL') {
        txtserie.value = "00" + _SERIE[2] + _SERIE[3];
        txtnumerodocumento.value = _NUMDOCUMENTO;
    }
    else
        txtserie.value = cmbiddocumento.options[cmbiddocumento.selectedIndex].getAttribute('serie');
    btnguardarventa.disabled = false;

    _PRODUCTOSENDETALLE = [];
    fnnuevopagos();
    fnnuevofacturafueradocumento();
}

function fnimprimir() {
    if (txtidventa.value != '') {
        var href = btnimprimir.getAttribute('href');

        ABRIR_MODALIMPRECION(href, 'IMPRIMIR VENTA');
    }
}

function fncobrar() {
    fnLlenarCamposCobro();
    $('#modalcobrar').modal('show');
}

function fnBuscarStock(idstock) {
    let controller = new StockController();
    var cv = '', sr = '';
    var obj = {
        idstock: idstock,
        idlista: MBP_cmblistaprecios.value
    };
    BLOQUEARCONTENIDO('modallotes', 'Buscando datos ...');

    console.log('ingreso a busqueda de productos');

    controller.GetStockProductosParaVenta(obj, function (data) {
        $('#modalbuscarproducto').modal('hide');
        $('#modallotes').modal('hide');
        DESBLOQUEARCONTENIDO('modallotes');

        if (data.length === 0)
            return;
        data = data[0];
        console.log(data);
        _PRODUCTOSENDETALLE.push(data);
        var stock = data.maxcaja;
        var precio = data.precio;
        var checkdisabled = '';
        var checked = '';
        var checkblister = '';
        if (data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null)
            checkdisabled = 'disabled';
        var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" ' + checkdisabled + ' deshabilitado checked  multiplo="' + data.multiplo + '"/>';
        checkdisabled = '';

        //if (data.venderblister) {
        //    if (data.multiploblister === 1 || data.multiploblister === 0 || data.multiploblister === null)
        //        checkdisabled = 'disabled';
        //    checkblister = '<input   class="checkblister_detalle" type="checkbox" min="1" ' + checkdisabled + ' checked blister="' + data.multiploblister + '" />';
        //}
        checkdisabled = '';

        //si no hay stock en caja entonces poner stock en fraccion o multiplo
        if (stock === 0) {
            stock = data.maxfraccion;
            if (data.precioxfraccion.toString() === '' || data.precioxfraccion === null)
                precio = (REDONDEAR_DECIMALES(data.precio / data.multiplo, 2));
            else
                precio = REDONDEAR_DECIMALES(data.precioxfraccion, 2);

            checkfracion = checkfracion.replace('checked', 'checked');
            //checkblister= checkblister.replace('checked', '');
        } else
            checkfracion = checkfracion.replace('checked', '');
        //si no hay stock en fraccion entonces poner stock en blister
        //if (data.venderblister) {
        //    if (stock === 0) {
        //        stock = data.maxblister;
        //        precio = REDONDEAR_DECIMALES(data.precio / (data.multiploblister), 2);
        //        checkfracion = checkfracion.replace('checked', '');
        //        checkfracion = checkfracion.replace('deshabilitado', 'disabled');
        //        checkblister = checkblister.replace('checked', 'checked');
        //    } else
        //        checkblister = checkblister.replace('checked', '');
        //}

        var otrosdatos = '<div class="btn-group btn-group-sm">';
        var tooltip = 'data-toggle="tooltip" data-placement="top" title="Tiene bonificación a cliente"';
        otrosdatos += (data.oferta != '0' ? '<button ' + tooltip + ' class="btn btn-sm btn-sucess addtooltip" type="button"><i class="text-success fas fa-gift"></i></button>' : '');

        var descuento = fnverificarsitienedescuento(data.tienedescuento ?? 'x');
        console.log(descuento);
        //si el producto tiene descuentofnverificarsitienedescuento
        if (descuento[0] == 'uno' || descuento[0] == 'dos') {
            tooltip = 'data-toggle="tooltip" data-placement="top" title="Tiene descuento"';
            otrosdatos += '<button ' + tooltip + '  class="btn btn-sm btn-sucess addtooltip btndescuento" type="button"><i class="text-success fas fa-tags"></i></button>';
        }
        otrosdatos += '</div>';
        var input = '<input style="width:100%" value="1" class="text-center cantidad_detalle font-14" type="number"  min="1" max="' + stock + '" required/>';
        var index = tbldetalle.rows().data().length;
        var fila = tbldetalle.row.add([
            otrosdatos,
            index + 1,
            data.codigoproducto,
            data.nombre,
            data.lote,
            (data.fechavencimiento),
            input,
            checkfracion,
            //(data.venderblister) ? checkblister : '',
            '<span class="precio_detalle font-14">' + ((precio == 0.01) ? 0 : precio).toFixed(2) + '</span>',
            '<span class="descuento_detalle font-14">' + (typeof descuento[0] == 'number' ? descuento[0].toFixed(2) : '') + '</span>',
            '<span class="importe_detalle font-14">' + precio.toFixed(2) + '</span>',
            '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + data.idstock + '"><i class="fas fa-trash-alt"></i></button>'
        ]).draw(false).node();
        (fila).setAttribute('idstock', data.idstock);
        (fila).setAttribute('idproducto', data.idproducto);
        (fila).setAttribute('idprecioproducto', data.idprecioproducto);
        (fila).setAttribute('tipoimpuesto', data.tipoimpuesto);
        (fila).setAttribute('cantidadDescuentopack', detalle[i].cantidadDescuentopack ?? '');
        (fila).setAttribute('detp_codigo', data.detp_codigo);
        if (typeof descuento[0] == 'number') {          //registra el id del desceunto
            fila.setAttribute('iddescuentolista', descuento[1]);
        }
        //(fila).setAttribute('incentivo', data.incentivo);
        //(fila).setAttribute('tipo', tipoitem);
        $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
        //if (tipoitem == 'bonificacion')
        //    fila.classList.add('table-success');
        tbldetalle.columns.adjust().draw(false);
        fncalcularmontos();
    }, function () { DESBLOQUEARCONTENIDO('modallotes'); });
}

function fneventostxtcantidad(event) {
    var cantidad = $(event).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 0; /*$(event).val(1);*/ }
    var maximo = $(event).attr('max');

    if (parseInt(cantidad) <= parseInt(maximo))
        fncalcularmontos();
    else {
        $(event).val(maximo);
        fncalcularmontos();
        mensaje('W', 'El stock disponible de este producto es ' + maximo);
    }

}

function fnacciones_fraccion_blister(idstock, tipo, input, event) {
    console.log('fraccion venta directa');
    inputcheck = $(event);
    var data = _PRODUCTOSENDETALLE[encontrarIndexArraProductos(idstock)];
    if (tipo === 'fraccion') {
        if (inputcheck.prop('checked')) {
            if (parseInt(input.val()) > data.maxfraccion) {
                input.val(data.maxfraccion);
                alertaSwall('I', 'El stock maximo en fracción del producto ' + data.nombre + ' es ' + data.maxfraccion, '');
                fneliminaritemdebonificacion(idstock);
            }
            input.attr('max', data.maxfraccion);
            //var checkblister = inputcheck.parents('tr').find('.checkblister');
            var spanprecio = inputcheck.parents('tr').find('.precio_detalle');
            //if (spanprecio != null) checkblister.prop('checked', false);
            if (data.precioxfraccion.toString() === '' || data.precioxfraccion === null)
                spanprecio.text(REDONDEAR_DECIMALES(data.precio / data.multiplo, 2));
            else
                spanprecio.text(REDONDEAR_DECIMALES(data.precioxfraccion, 2));

        } else {
            if (data.maxcaja > 0) {//si el maxcaja es 0 entonces seguir siendo true el check
                input.attr('max', data.maxcaja);
                var check = inputcheck.parents('tr').find('[type=checkbox]');
                var spanprecio = inputcheck.parents('tr').find('.precio_detalle');
                spanprecio.text(REDONDEAR_DECIMALES(data.precio, 2));
                check.prop('checked', false);
                if (parseInt(input.val()) > data.maxcaja) {//sino cambiar datos a caja
                    input.val(data.maxcaja);
                    alertaSwall('I', 'El stock maximo en cajas del producto ' + data.nombre + ' es ' + data.maxcaja, '');
                    fneliminaritemdebonificacion(idstock);

                }
            } else
                inputcheck.prop('checked', true);
        }
    } else if (tipo === 'blister') {
        if (inputcheck.prop('checked')) {
            if (parseInt(input.val()) > data.maxblister) {
                input.val(data.maxblister);
                alertaSwall('I', 'El stock maximo en blister del producto ' + data.nombre + ' es ' + data.maxblister, '');
                fneliminaritemdebonificacion(idstock);

            }
            input.attr('max', data.maxblister);
            var checkfraccion = inputcheck.parents('tr').find('.checkfraccion');
            var spanprecio = inputcheck.parents('tr').find('.precio_detalle');
            spanprecio.text(REDONDEAR_DECIMALES(data.precio / data.multiploblister, 2));
            checkfraccion.prop('checked', false);
        } else {
            if (data.maxcaja > 0) {
                input.attr('max', data.maxcaja);
                var check = inputcheck.parents('tr').find('input[type=checkbox]');
                var spanprecio = inputcheck.parents('tr').find('.precio_detalle');
                spanprecio.text(REDONDEAR_DECIMALES(data.precio, 2));
                check.prop('checked', false);
                if (parseInt(input.val()) > data.maxcaja) {//sino cambiar datos a caja
                    input.val(data.maxcaja);
                    alertaSwall('I', 'El stock maximo en fraccion del producto ' + data.nombre + ' es ' + data.maxcaja, '');
                    fneliminaritemdebonificacion(idstock);

                }
            } else if (data.maxfraccion > 0) {
                input.attr('max', data.maxfraccion);

                var check = inputcheck.parents('tr').find('.checkfraccion');
                var spanprecio = inputcheck.parents('tr').find('.precio_detalle');
                spanprecio.text(REDONDEAR_DECIMALES(data.precio / data.multiplo, 2));
                check.prop('checked', false);
                if (parseInt(input.val()) > data.maxcaja) {//sino cambiar datos a caja
                    input.val(data.maxfraccion);
                    alertaSwall('I', 'El stock maximo en fraccion del producto ' + data.nombre + ' es ' + data.maxfraccion, '');
                    fneliminaritemdebonificacion(idstock);

                }
            } else
                inputcheck.prop('checked', true);

        }
    }

    fncalcularbonificacion(event.parentNode.parentNode.getElementsByClassName('cantidad_detalle')[0]);

    fncalcularmontos();
}
//encontrar index en array productos paraa manipular
function encontrarIndexArraProductos(idstock) {
    var index = -1;
    for (var i = 0; i < _PRODUCTOSENDETALLE.length; i++) {
        if ((_PRODUCTOSENDETALLE[i].idstock ?? '').toString() === idstock.toString()) {
            index = i;
            break;
        }
    }
    return index;
}

function fncalcularmontos() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 0;
    var importe = 0.0;
    var cantidad = 0.0;
    var total = 0.0;
    var totalsinigv = 0.0;
    var descuento = 0.0;
    var datatable = tbldetalle.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {

            descuento = parseFloat(document.getElementsByClassName("descuento_detalle")[c].innerText);
            if (isNaN(descuento)) descuento = 0;
            cantidad = parseFloat(document.getElementsByClassName("cantidad_detalle")[c].value);
            if (isNaN(cantidad) || cantidad < 1)
                cantidad = 0;
            precio = parseFloat(document.getElementsByClassName("precio_detalle")[c].innerText);
            descuento = (precio * descuento) / 100;
            importe = cantidad * (precio - descuento);
            if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                total += importe;
            else
                totalsinigv += importe;
            document.getElementsByClassName("importe_detalle")[c].innerHTML = REDONDEAR_DECIMALES(importe, 2).toFixed(2);
            c++;
        });
    var igv = 0.0;
    var subtotal = 0.0;
    total = REDONDEAR_DECIMALES(total, 2);
    igv = REDONDEAR_DECIMALES(total / (1 + IGV), 5);
    igv = total - igv;

    //subtotal = REDONDEAR_DECIMALES((total - igv) + totalsinigv, 2);
    var packds = 0.0;
    packds = REDONDEAR_DECIMALES($("#txtpkdescuento").val(), 2)
    if (isNaN(packds)) { packds = 0; }
    //subtotal = REDONDEAR_DECIMALES(((total - igv) + totalsinigv) - packds, 2);//EARTCOD1009
    //subtotal = REDONDEAR_DECIMALES(((total - igv) + totalsinigv),2);
    //subtotal = parseFloat((total - igv) + totalsinigv).toFixed(2);
    subtotal = parseFloat(((total - (packds))) / (1 + IGV));
    //subtotal = REDONDEAR_DECIMALES((total - igv) + totalsinigv, 2);
    //subtotal = REDONDEAR_DECIMALES(((total - igv) + totalsinigv) - REDONDEAR_DECIMALES($("#txtpkdescuento").val(), 2), 2);//EARTCOD1009

    
    if (IDSUCURSAL == 126) {
        igv = 0;
    } else {
        igv = subtotal * IGV;//EARTCOD1009
    }
    txtsubtotal.value = subtotal.toFixed(2);
    txtigv.value = igv.toFixed(2);
    //txttotal.value = (totalsinigv + total).toFixed(2);
    //txttotal.value = parseFloat((totalsinigv + total).toFixed(2) - (parseFloat($("#txtopgratuita").val()).toFixed(2))).toFixed(2);//EARTCOD1009
    txttotal.value = ((totalsinigv + total) - parseFloat(packds)).toFixed(2);//EARTCOD1009

    var auxredondeoarray = parseFloat(txttotal.value).toFixed(2).split('.');
    txttotalredondeado.value = parseFloat(auxredondeoarray[0] + "." + auxredondeoarray[1].substr(0, 1)).toFixed(2);

    var fechaActual = new Date().toISOString().split('T')[0];
    var mesDiaFechaActualinicial = fechaActual.split('-')[2] + "/" + fechaActual.split('-')[1] + "/" + fechaActual.split('-')[0];
    var mesDiaFechaActual = mesDiaFechaActualinicial.split('/')[0] + "/" + mesDiaFechaActualinicial.split('/')[1];
    if (fechanacimientoCliente !== "") {
        var mesDiaFechaNacimientoCliente = fechanacimientoCliente.split('/')[0] + "/" + fechanacimientoCliente.split('/')[1];
    } else {
        mensaje("I", "No se tiene registrado la fecha de nacimiento del cliente");
    }

    if (mesDiaFechaActual == mesDiaFechaNacimientoCliente) {

        var obj = {
            idcliente: idclienteinicial
        };
        var url = ORIGEN + "/Pedidos/Pedido/verificionDescuentoGlobal";
        $.post(url, obj).done(function (data) {
            var parsedData = JSON.parse(data);
            if (parsedData.length === 0) {
                mensaje("S", "El Cliente cumple años. Tiene un descuento del 15%");
                var total = 0;
                var subtotal = 0;
                var descuentoCumpleanio = 0;
                var descuentoCumpleanioSinIgv = 0;
                var igv = 0;
                var descuento = 0;
                if (txtadelanto.value == "0.00" && txtpkdescuento.value == "0.00") {//No tiene adelanto ni pack promociones.
                    total = parseFloat(txttotal.value);

                    descuentoCumpleanio = parseFloat(parseFloat(total * 15 / 100).toFixed(2));
                    total = total - descuentoCumpleanio;
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanio).toFixed(2));
                    subtotal = parseFloat(parseFloat(total / 1.18).toFixed(2));
                    igv = parseFloat(parseFloat(total - subtotal).toFixed(2));

                    txtsubtotal.value = subtotal;
                    txtpkdescuento.value = descuentoCumpleanioSinIgv;
                    txtigv.value = parseFloat(igv).toFixed(2);
                    txttotal.value = parseFloat(total).toFixed(2);
                    txttotalredondeado.value = parseFloat(total).toFixed(2);
                } else if (txtadelanto.value != "0.00" && txtpkdescuento.value != "0.00") {//Tiene adelanto y pack promociones.
                    descuento = parseFloat(txtpkdescuento.value);
                    total = parseFloat(txttotal.value);

                    descuentoCumpleanio = parseFloat(parseFloat(total * 15 / 100).toFixed(2));
                    total = total - descuentoCumpleanio;
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanio).toFixed(2));
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanioSinIgv + descuento).toFixed(2));
                    subtotal = parseFloat(parseFloat(total / 1.18).toFixed(2));
                    igv = parseFloat(parseFloat(total - subtotal).toFixed(2));

                    txtsubtotal.value = subtotal;
                    txtpkdescuento.value = descuentoCumpleanioSinIgv;
                    txtigv.value = parseFloat(igv).toFixed(2);
                    txttotal.value = parseFloat(total).toFixed(2);
                    txttotalredondeado.value = parseFloat(total).toFixed(2);
                }
                else if (txtadelanto.value == "0.00" && txtpkdescuento.value != "0.00") {//No tiene adelanto, pero sí pack promociones.
                    descuento = parseFloat(txtpkdescuento.value);
                    total = parseFloat(txttotal.value);
                    descuentoCumpleanio = parseFloat(parseFloat(total * 15 / 100).toFixed(2));
                    total = total - descuentoCumpleanio;
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanio).toFixed(2));
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanioSinIgv + descuento).toFixed(2));
                    subtotal = parseFloat(parseFloat(total / 1.18).toFixed(2));
                    igv = parseFloat(parseFloat(total - subtotal).toFixed(2));

                    txtsubtotal.value = subtotal;
                    txtpkdescuento.value = descuentoCumpleanioSinIgv;
                    txtigv.value = parseFloat(igv).toFixed(2);
                    txttotal.value = parseFloat(total).toFixed(2);
                    txttotalredondeado.value = parseFloat(total).toFixed(2);
                }
                else if (txtadelanto.value != "0.00" && txtpkdescuento.value == "0.00") {//Tiene adelanto, pero no pack promociones.
                    total = parseFloat(txttotal.value);
                    descuentoCumpleanio = parseFloat(parseFloat(total * 15 / 100).toFixed(2));
                    total = total - descuentoCumpleanio;
                    descuentoCumpleanioSinIgv = parseFloat(parseFloat(descuentoCumpleanio).toFixed(2));
                    subtotal = parseFloat(parseFloat(total / 1.18).toFixed(2));
                    igv = parseFloat(parseFloat(total - subtotal).toFixed(2));

                    txtsubtotal.value = subtotal;
                    txtpkdescuento.value = descuentoCumpleanioSinIgv;
                    txtigv.value = parseFloat(igv).toFixed(2);
                    txttotal.value = parseFloat(total).toFixed(2);
                    txttotalredondeado.value = parseFloat(total).toFixed(2);

                }

                txttotalcobrar.value = parseFloat(total).toFixed(2);
                txtsaldocobrar1.value = parseFloat(total).toFixed(2);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });

    }

    fnLlenarCamposCobro();
}

function fnagregarindex() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 1;

    filas.forEach(function (e) {
        try {
            e.getElementsByTagName('td')[1].textContent = c;
            c++;
        } catch (e) { }

    });
}

function fnQuitarItemDelDetalle(idstockpara, eliminarproductoarray, cantidadDescuentopack) {
    var data = tbldetalle.rows().data();
    var valores = [];
    var otroArray = [];

    var valorActual = parseFloat($("#txtpkdescuento").val()) || 0;
    var nuevoValorini = valorActual - cantidadDescuentopack;

    var nuevoValor = nuevoValorini.toFixed(2);
    if (nuevoValor < 0.5) {
        nuevoValor = 0
    }
    $("#txtpkdescuento").val(nuevoValor.toString());
    data.each(function (rowArray) {
        var botonHTML = rowArray[rowArray.length - 1];
        var matchIdStock = botonHTML.match(/idstock="(\d+)"/);
        var matchIdPromoPack = botonHTML.match(/idpromopack="(\d+)"/);
        if (matchIdStock && matchIdPromoPack) {
            var idStock = matchIdStock[1];
            var idPromoPack = matchIdPromoPack[1];
            valores.push({
                idstock: idStock,
                idpromopack: idPromoPack
            });
            console.log('Valores encontrados:', idStock, idPromoPack);
        }
    });
    var idpromopackEncontrado = null;
    for (var i = 0; i < valores.length; i++) {
        if (valores[i].idstock === idstockpara) {
            idpromopackEncontrado = valores[i].idpromopack;
            break;  // Salir del bucle una vez encontrado
        }
    }
    if (idpromopackEncontrado !== null && idpromopackEncontrado != 0) {
        for (var i = 0; i < valores.length; i++) {
            if (valores[i].idpromopack === idpromopackEncontrado) {
                otroArray.push(valores[i]);
            }
        }

    } else {
        for (var i = 0; i < valores.length; i++) {
            if (valores[i].idstock === idstockpara) {
                otroArray.push(valores[i]);
            }
        }
    }
    if (otroArray.length > 0) {
        for (var i = 0; i < otroArray.length; i++) {
            var idpromopack = parseInt(otroArray[i].idpromopack, 10);
            var idstock = parseInt(otroArray[i].idstock, 10);
            // Tu código aquí otroArray[0].idpromopack
            if (data.length > 0) {
                // Iterar sobre cada idstock en el array                       
                $("#tbldetalle tbody tr[idpromopack='" + idpromopack + "'][idstock='" + idstock + "']").remove();
                // Llamar a tus funciones con el idstock actual
                fneliminaritemdebonificacion(idstock);
                if (eliminarproductoarray) {
                    // Quitar del array de productos en detalle
                    var index = encontrarIndexArraProductos(idstock);
                    _PRODUCTOSENDETALLE.splice(index, 1);
                }
                fnagregarindex();
                fncalcularmontos();
            }
        }
    }
}

function fnGetDetalle() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr')
    var datatable = tbldetalle.rows().data().length;
    var array = [];
    if (datatable > 0)
        filas.forEach(function (e) {
            var obj = new VentaDetalle();
            obj.idstock = e.getAttribute('idstock');
            //console.log('hola mundo');
            //console.log(e);
            //console.log(e.getAttribute('tipo'));

            //EARTCOD1009
            //if (obj.idstock == 0 && e.getAttribute('codigoproducto').substring(0, 2) == 'PK') {
            //    var obj = { idpromopack: e.getAttribute('idproducto') };
            //    let controller = new DescuentoController();
            //    controller.PromocionesPackbuscar(obj, function (data) {
            //        console.log("DETALLE PACK");
            //        console.log(data);
            //        $.each(data[0].detalle, function (index, item) {

            //        });
            //    });
            //    //alert("el idstock contiene 0");
            //}
            //-EARTCOD1009

            obj.idpromopack = e.getAttribute('idpromopack') != 0 ? e.getAttribute('idpromopack') : null;//EARTCOD1009

            obj.idprecioproducto = e.getAttribute('idprecioproducto');
            obj.idproducto = e.getAttribute('idproducto');
            //obj.incentivo = e.getAttribute('incentivo');
            obj.tipo = e.getAttribute('tipo');
            obj.descuento = e.getElementsByClassName('descuento_detalle')[0].innerText;
            obj.cantidad = e.getElementsByClassName('cantidad_detalle ')[0].value;
            obj.idlistadescuento = e.getAttribute('iddescuentolista');
            obj.detp_codigo = e.getAttribute('detp_codigo');
            var isfraccion = e.getElementsByClassName('checkfraccion_detalle')[0];
            //var isblister = e.getElementsByClassName('checkblister_detalle')[0];
            obj.isfraccion = isfraccion === undefined ? null : isfraccion.checked;
            //obj.isblister = isblister === undefined ? null : isblister.checked;
            obj.precioigv = e.getElementsByClassName('precio_detalle')[0].innerText;
            if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                //if (obj.precioigv < 1)
                obj.precio = (parseFloat(obj.precioigv) / (1 + IGV)).toFixed(6);
            //else
            //  obj.precio = (parseFloat(obj.precioigv) / (1 + IGV)).toFixed(2);
            else
                obj.precio = (parseFloat(obj.precioigv));
            array.push(obj);
        });
    return array;
}

function fnAbrirModalProductos() {
    $('#modalbuscarproducto').modal('show');

}

function fngenerartxtventa(idventa) {
    var controlleraux = new VentasController();
    controlleraux.GenerarTxtVenta(idventa, null);
}

cmbmoneda.addEventListener('change', function () {
    $('.lblsimbolomoneda').text($('#cmbmoneda option:selected').attr('simbolo'));
    fnLlenarCamposCobro();
});
btnagregaritem.addEventListener('click', function () {
    $('#modalbuscarproducto').modal('show');
});
btnnuevo.addEventListener('click', function () {
    fnNuevo();
    //VALIDACIÓN PAYJI->
    $("#txtnumdoccliente").removeAttr("disabled");
    $("#txtnumdocpaciente").removeAttr("disabled");

    $("#btnbuscarcliente").removeAttr("disabled");
    $("#btnbuscarpaciente").removeAttr("disabled");
    //<-VALIDACIÓN PAYJI
});

btnimprimir.addEventListener('click', function () {
    fnimprimir();
});

btncobrar.addEventListener('click', function () {
    fncobrar();
});

btncancelar.addEventListener('click', function () {
    fnCancelar();
});


cmbiddocumento.addEventListener('change', function () {
    if (_TIPOVENTA != 'MANUAL')
        txtserie.value = $("option:selected", this).attr("serie");
});

$(document).on('click', '.MBP_seleccionarstock', function (e) {
    var idstock = this.getAttribute('idstock');
    fnBuscarStock(idstock);
});

$(document).on('click', '.checkfraccion_detalle', function (e) {

    var fila = tbldetalle.row($(this).parents('tr')).data();
    var idstock = ($(this).parents('tr').attr('idstock'));
    var inputcantidad = $(this).parents('tr').find('.cantidad_detalle');
    //try { $(this).parents('tr').find('.checkblister_detalle')[0].checked = false; } catch (e) { }
    fnacciones_fraccion_blister(idstock, 'fraccion', inputcantidad, (this));
    //fncalcularbonificacion($(this).parents('tr').find('.cantidad_detalle')[0]);
});

$(document).on('click', '.cantidad_detalle', function () {
    var fila = this.parentNode.parentNode;
    var tipo = fila.getAttribute('tipo');
    if (tipo != 'bonificacion') {
        fneventostxtcantidad(this);
        //if(this.value>1)// la condicion es para evitar que cuando no hay stock en oferta aparezca 1
        fncalcularbonificacion(this);
    }
    if (tipo == 'descuento') {
        MDfncalcularmontosdescuento(fila);
    }

});

$(document).on('keyup', '.cantidad_detalle', function (e) {
    var fila = this.parentNode.parentNode;
    var tipo = fila.getAttribute('tipo');
    if (tipo != 'bonificacion')
        fneventostxtcantidad(this);
    if (e.key == 'Enter') {
        if (tipo == 'descuento') {
            MDfncalcularmontosdescuento(fila);
        } else
            fncalcularbonificacion(this);
    }
});

$(document).on('click', '.btneliminar_detalle', function (e) {
    //console.log(this.parentNode.parentNode.getAttribute('idstock'));
    var filatabla = $(this).closest('tr');
    var fila = this.parentNode.parentNode;
    var tipo = this.parentNode.parentNode.getAttribute('tipo');
    var cantidadDescuentopackini = filatabla.attr('cantidaddescuentopack');
    var cantidadPacks = filatabla.attr('cantidadPacks');
    var cantidadDescuentopack = cantidadDescuentopackini * cantidadPacks;

    var cantidadDescuentopack = cantidadDescuentopack / 1.18;

    // Redondear el resultado a dos decimales
    var cantidadRedondeada = parseFloat(cantidadDescuentopack.toFixed(2));
    var eliminarproductodetalle = true;
    if (tipo == 'bonificacion') {
        eliminarproductodetalle = false;
        fnQuitarItemDelDetalle(this.getAttribute('idstock'), eliminarproductodetalle, cantidadRedondeada);
    } else if (tipo == 'descuento') {
        MDfneliminaritems(fila);
    }
    else {
        fnQuitarItemDelDetalle(this.getAttribute('idstock'), eliminarproductodetalle, cantidadRedondeada);

    }


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

txtmontototalpagado.addEventListener('keyup', function () {
    fnLlenarCamposCobro();
});

formregistro.addEventListener('submit', function (e) {
    //e.preventDefault();
    //EARTCOD1009 txtnumdoccliente
    e.preventDefault();
    if ($("#txtrespuestapackpromo").val() == "error") {
        mensaje('W', 'El Pack de Promociones se encuentra agotado, por falta de stock', 'TC');
        return;
    }

    //if ($("#txtnumdoccliente").val() == "") {
    //    mensaje('W', 'Seleccione o Registre un nuevo Cliente!!');
    //    return;
    //}
    //--EARTCOD1009

    if (tbldetalle.rows().data().length === 0) {
        mensaje('W', 'No hay datos en el detalle', 'TC');
        return;
    }
    if (parseFloat(txttotalredondeado.value) >= 700 && txtidcliente.value == '') {
        mensaje('W', 'La venta supera los 700.00 el cliente es obligatorio');
        return;
    }
    var coddoctributario = cmbiddocumento.options[cmbiddocumento.selectedIndex].getAttribute('codigosunat');
    //01 es factura
    //03 es boleta
    if (coddoctributario === '01' && txtnumdoccliente.getAttribute('numdoc').length != 11) {
        txtnumdoccliente.value = txtnumdoccliente.getAttribute('numdoc');
        mensaje('W', 'El RUC debe ser válido, Actualize los datos del cliente', 'TC');
        return;
    }
    var montoss = parseFloat(txttotalcobrar.value);
    var saldo = parseFloat(txtsaldocobrar1.value);
    var totalss = parseFloat(totaltblpago.innerText);
    var adelanto = parseFloat(txtadelanto.value);
    if ((totalss + adelanto) != (montoss)) {
        alertaSwall('W', 'VERIFIQUE QUE EL MONTO AGREGADO SEA IGUAL AL SALDO ¡MF!', '');
        return;
    }
    if (saldo > 0) {
        alertaSwall('W', 'AUN CUENTA CON UN SALDO PENDIENTE', '');
        return;
    }
    //btnnuevopago.click();
    var pagos = fngetpagos();
    var montopagado = txtsaldocobrar1.value;
    if (montopagado != 0) {
        mensaje('W', 'Debe completar el pago');
        return;
    } else {
        if (tbodymontopago.getElementsByTagName('tr').length == 0)
            //totaltblpago.innerText = pagos[0].montopagado;
            //var montopagado = parseFloat(totaltblpago.innerText);

            var total = parseFloat(txttotalredondeado.value);
        //if (montopagado != total) {
        if (montopagado != 0) {
            mensaje('W', 'El monto pagado debe ser el mismo de la venta');
            return;
        }
    }
    var tipopago = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    var res = '';
    if (tipopago == 'CREDITO')
        res = MCfnvalidarcreditocliente();
    if (res == 'x') {
        alertaSwall('W', 'EL CLIENTE NO CUENTA CON EL CREDITO NECESARIO', MClblmensajecredito.innerText);
        return;
    }


    //if (_TIPOVENTA == 'MANUAL') {
    //    if (txtserie.value.length < 4) {
    //        var serie = txtserie.value.toString();
    //        txtserie.value = serie.padStart(4, '0');
    //    }
    //    if (txtnumerodocumento.value.length < 8) {
    //        var numerodocumento = txtnumerodocumento.value.toString();
    //        txtnumerodocumento.value = numerodocumento.padStart(8, '0');
    //    }
    //}

    var obj = $('#formregistro').serializeArray();
    obj[obj.length] = { name: 'pkdescuento', value: $("#txtpkdescuento").val() };//EARTCOD1009
    //obj[obj.length] = { name: 'idpromopack', value: $("#txtidpromopack").val() };//EARTCOD1009
    //obj[obj.length] = { name: 'pago.totalredondeado', value: parse };
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fnGetDetalle()) };
    obj[obj.length] = { name: 'jsonpagos', value: JSON.stringify(pagos) };
    obj[obj.length] = { name: 'idcajasucursal', value: idcajasucursal };

    swal({
        title: '¿Desea registrar venta?',
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
            btnguardarventa.disabled = true;
            BLOQUEARCONTENIDO('modalcobrar', 'Guardando venta ..');
            let controller = new VentasController();
            if (_TIPOVENTA == 'MANUAL') {
                obj[obj.length] = { name: 'ismanual', value: true };
                controller.RegistrarVentaManual(obj, function (data) {
                    txtidventa.value = data.idventa;
                    btnguardarventa.disabled = true;
                    DESBLOQUEARCONTENIDO('modalcobrar');
                    //btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket/" + data.idventa);
                    //CAMBIOS SEMANA4
                    if (txtnombresucursal.value == 'DROGUERIA' || txtnombresucursal.value == 'MATRIZ') {
                        btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket_D/" + data.idventa);
                    } else {
                        btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket/" + data.idventa);
                    }
                    $('#modalcobrar').modal('hide');
                    fngenerartxtventa(data.idventa);
                    fnimprimir();
                }, () => { btnguardarventa.disabled = false; DESBLOQUEARCONTENIDO('modalcobrar'); });
            } else {

                let urlSearch = window.location.search;
                if (urlSearch.includes("guiasalida")) {
                    let idguias = urlSearch.split("=")[1];
                    obj[obj.length] = { name: 'idguiasSalidas', value: idguias };
                }

                //EARTC1001
                controller.RegistrarVentaDirecta(obj, function (data) {
                    txtnumerodocumento.value = data.numdocumento;
                    txtidventa.value = data.idventa;
                    btnguardarventa.disabled = true;
                    DESBLOQUEARCONTENIDO('modalcobrar');
                    //btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket/" + data.idventa);
                    //CAMBIOS SEMANA4
                    if (txtnombresucursal.value == 'DROGUERIA' || txtnombresucursal.value == 'MATRIZ') {
                        btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket_D/" + data.idventa);
                    } else {
                        btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Venta/ImprimirTicket/" + data.idventa);
                    }
                    if (!(urlSearch.includes("guiasalida"))) {
                        if (sucursalGeneraGuia == true) {
                            swal({
                                title: '¿Desea Generar Guia?',
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
                            }).then((AceptaCancela) => {
                                if (AceptaCancela) {
                                    MSS_buscarSeriesXSucursal(IDSUCURSAL);
                                } else
                                    swal.close();
                            });
                        }
                    }


                    $('#modalcobrar').modal('hide');
                    fngenerartxtventa(data.idventa);
                    fnimprimir();
                }, () => { btnguardarventa.disabled = false; DESBLOQUEARCONTENIDO('modalcobrar'); });
            }
        }
        else
            swal.close();
    });
});
$(document).on('click', '.MSS_btnseleccionarserie', function () {
    var idcorrelativo = this.getAttribute('idcorrelativo');
    var obj = new Object();
    obj.idventa = txtidventa.value;
    obj.fechatraslado = MSSPG_txtfechatraslado.value;
    obj.peso = MSSPG_txtpeso.value;
    obj.bulto = MSSPG_txtbulto.value;
    obj.idsucursal = "";
    obj.idempleado = "";
    obj.idempresa = "";
    obj.jsondetalle = "";
    obj.idcorrelativo = idcorrelativo;
    var urlGuiaDesdeVenta = ORIGEN + "/Almacen/AGuiaSalida/RegistrarGuiaSalidaDesdeVentas";
    $.post(urlGuiaDesdeVenta, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Guia generada', '');
            $('#modalserie').modal('hide');
        }
        else
            mensaje('W', data.mensaje, '');

        if (data.objeto != null || data.objeto != "") {
            var lGuias = JSON.parse(data.objeto);
            for (var i = 0; i < lGuias.length; i++) {
                fnenviarguiae(lGuias[i][1]);
            }
        }   

    }).fail(function (data) {
        mensajeError(data);
        fnerror();
    });
});
function fnenviarguiae(id) {
    let obj = {
        idguia: id,
        tipo: 'distribucion'
    };
    var controlleraux = new GuiaSalidaController();
    controlleraux.GenerarGuiaElectronica(obj, null);
}


$(document).on('mousewheel', '.cantidad_detalle', function (e) {
    this.blur();
});

btnhistorialcliente.addEventListener('click', function () {
    if (txtidcliente.value == '') {
        _MHCIDCLIENTE = '';
        return;
    }
    else {
        _MHCIDCLIENTE = txtidcliente.value;
        var modal = new ModalHistorialVentasCliente();
        $('#modalhistorialcliente').modal('show');
        lblMHCnombrescliente.innerText = txtnombrescliente.value;
        modal.fnbuscarventas(_MHCIDCLIENTE);
    }
});

btnpedido.addEventListener('click', function () {
    $('#modalbuscarpedido').modal('show');
});

//factura fuera de fecha
var checkfacturafuerafecha = document.getElementById('checkfacturafuerafecha');
var txtfecha = document.getElementById('txtfecha');


function fnnuevofacturafueradocumento() {
    try {
        txtfecha.classList.add('ocultar');
        txtfecha.required = false;
        txtfecha.disabled = true;
        txtfecha.value = '';
        lblfecha.classList.remove('ocultar');
    } catch (e) {

    }

}

//checkfacturafuerafecha.addEventListener('click', function () {
//    if (this.checked) {
//        txtfecha.classList.remove('ocultar');
//        txtfecha.disabled = false;
//        txtfecha.required = true;
//        lblfecha.classList.add('ocultar');
//    } else {
//        fnnuevofacturafueradocumento();
//    }
//});

function fnCargarDatosGuiasEnVentas(datos) {
    $("#btnbuscarcliente")[0].setAttribute("disabled", "");
    $("#btnbuscarpaciente")[0].setAttribute("disabled", "");
    $("#txtnumdoccliente")[0].setAttribute("disabled", "");
    $("#txtnumdocpaciente")[0].setAttribute("disabled", "");
    $("#btnpedido")[0].setAttribute("disabled", "");
    $("#btnhistorialcliente")[0].setAttribute("disabled", "");
    $("#btnbuscarproforma")[0].setAttribute("disabled", "");
    $("#txtcodproforma")[0].setAttribute("disabled", "");
    $("#btnnuevo")[0].setAttribute("disabled", "");
    $("#btncancelar")[0].setAttribute("disabled", "");
    //$("#checkfacturafuerafecha")[0].setAttribute("disabled", "");

    var arrValProductoCompleto = [];
    var arrValProductoSinRepetir = [];
    var arrIdProductos = [];
    for (let i = 0; i < datos.length; i++) {
        var cabecera = JSON.parse(datos[i])[0];

        txtnumdoccliente.value = cabecera["RUC"];
        txtnumdoccliente.setAttribute("numdoc", cabecera["RUC"]);
        txtnombrescliente.value = cabecera["NOMBREEMPRESA"];
        txtnumdocpaciente.value = cabecera["RUC"];
        txtnumdocpaciente.setAttribute("numdoc", cabecera["RUC"]);
        txtnombrespaciente.value = cabecera["NOMBREEMPRESA"];
        txtidcliente.value = cabecera["CLITERCERO_CODIGO"];
        txtidpaciente.value = cabecera["PACIENTE_CODIGO"];

        var detalle = JSON.parse(cabecera.DETALLE);
        for (let j = 0; j < detalle.length; j++) {
            arrValProductoCompleto.push(detalle[j]);
            let filtroarrIdProductos = arrIdProductos.filter(x => x[0] == detalle[j]["IDPRODUCTO"] && x[1] == detalle[j]["IDSTOCK"]);
            if (filtroarrIdProductos.length == 0) {
                arrIdProductos.push([detalle[j]["IDPRODUCTO"], detalle[j]["IDSTOCK"]]);
                arrValProductoSinRepetir.push(detalle[j]);
            }
        }
    }


    var arrProductosFinal = [];
    for (let i = 0; i < arrValProductoSinRepetir.length; i++) {
        let cantidad = 0;
        for (let j = 0; j < arrValProductoCompleto.length; j++) {
            if (arrValProductoSinRepetir[i]["IDPRODUCTO"] == arrValProductoCompleto[j]["IDPRODUCTO"] && arrValProductoSinRepetir[i]["IDSTOCK"] == arrValProductoCompleto[j]["IDSTOCK"]) {
                cantidad += arrValProductoCompleto[j]["CANTIDADGENERADA"];
            }
        }
        arrValProductoSinRepetir[i]["CANTIDADGENERADA"] = cantidad;
        arrProductosFinal.push(arrValProductoSinRepetir[i]);
    }

    for (var j = 0; j < arrProductosFinal.length; j++) {
        //detalle[j].isfraccion = detalle[j].isfraccion ?? false;
        //detalle[j].descuento = detalle[j].descuento ?? 0;
        let controller = new ListaPreciosController();
        controller.ListarListaXProducto(arrProductosFinal[j]["IDPRODUCTO"], function (data) {
            for (let i = 0; i < data.length; i++) {
                PRECIOSPRODUCTO.push(data[i]);
            }
        });

        let lote = arrProductosFinal[j]["LOTE"] == '' ? '' : arrProductosFinal[j]["LOTE"];
        let fechavencimiento = arrProductosFinal[j]["FECHAVENCIMIENTO"] == "01/01/1900" ? '' : arrProductosFinal[j]["FECHAVENCIMIENTO"];

        var fila = tbldetalle.row.add([
            '',
            (j + 1),
            arrProductosFinal[j]["CODIGO"],
            arrProductosFinal[j]["PRODUCTO"],
            lote,
            fechavencimiento,
            '<input style="width:100%" value="' + arrProductosFinal[j]["CANTIDADGENERADA"] + '" class="text-center cantidad_detalle font-14" type="number" disabled/>',
            '',//(detalle[i].isfraccion) ? ' ✓' : 
            //(detalle[i].isblister) ? ' ✓' : '',
            '<span class="precio_detalle font-14">' + 0 + '</span>',//detalle[i].precioigv.toFixed(2)
            '<span class="descuento_detalle font-14">' + 0 + '</span>',//detalle[i].descuento.toFixed(2)
            '<span class="importe_detalle font-14">' + 0 + '</span>',//(detalle[i].cantidad * detalle[i].precioigv).toFixed(2)
            ''
        ]).draw(false).node();
        fila.setAttribute('idproducto', arrProductosFinal[j]["IDPRODUCTO"]);
        fila.setAttribute('idstock', arrProductosFinal[j]["IDSTOCK"]);
        fila.setAttribute('tipoimpuesto', "IGV");
        //fila.setAttribute('tipoimpuesto', detalle[j]["IDPRODUCTO"]);//tipoimpuesto
        //fila.setAttribute('tipo', detalle[i].tipo);
        //if (detalle[i].tipo == 'bonificacion')
        //    fila.classList.add('table-success');
    }
}

cmbListaPrecios.addEventListener("change", function () {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    //var datatable = tbldetalle.rows().data();
    let idListaPrecio = cmbListaPrecios.value;
    var c = 0;
    filas.forEach(function (e) {
        var idproducto = e.getAttribute("idproducto");
        let contador = 0;
        for (let i = 0; i < PRECIOSPRODUCTO.length; i++) {
            if (PRECIOSPRODUCTO[i].idproducto == idproducto && PRECIOSPRODUCTO[i].idlistaprecio == idListaPrecio) {
                var cantidad = e.getElementsByClassName('cantidad_detalle ')[0].value;
                document.getElementsByClassName("precio_detalle")[c].innerText = parseFloat(PRECIOSPRODUCTO[i].precio).toFixed(2);
                document.getElementsByClassName("descuento_detalle")[c].innerText = PRECIOSPRODUCTO[i].descuento == null ? 0.00 : parseFloat(PRECIOSPRODUCTO[i].descuento).toFixed(2);
                document.getElementsByClassName("importe_detalle")[c].innerText = parseFloat(cantidad * PRECIOSPRODUCTO[i].precio).toFixed(2);
                e.setAttribute("idprecioproducto", PRECIOSPRODUCTO[i].idprecioproducto);
                break;
            }
            contador++;
        }
        if (contador == PRECIOSPRODUCTO.length) {
            document.getElementsByClassName("precio_detalle")[c].innerText = 0;
            document.getElementsByClassName("descuento_detalle")[c].innerText = 0;
            document.getElementsByClassName("importe_detalle")[c].innerText = 0;
            e.removeAttribute("idprecioproducto");
        }
        c++;
    });
    fncalcularmontos();
});


//txtserie.addEventListener("keyup", function () {
//    if (_TIPOVENTA == 'MANUAL') {
//        if (this.value.length > 4)
//            this.value = this.value.slice(0, 4);
//    }
//});
//txtnumerodocumento.addEventListener("keyup", function () {
//    if (_TIPOVENTA == 'MANUAL') {
//        if (this.value.length > 8)
//            this.value = this.value.slice(0, 8);
//    }
//});