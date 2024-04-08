//inputs

var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtnombresucursal = document.getElementById('txtnombresucursal');
var txtnumdoccliente = document.getElementById('txtnumdoccliente');
var txtnombrescliente = document.getElementById('txtnombrescliente');
var lblfecha = document.getElementById('lblfecha');
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtnombresucursal = document.getElementById('txtnombresucursal');

var txtidcliente = document.getElementById('txtidcliente');
var txtidproforma = document.getElementById('txtidproforma');
var txtcodproforma = document.getElementById('txtcodproforma');


var txtsubtotal = document.getElementById('txtsubtotal');
var txtigv = document.getElementById('txtigv');
var txttotal = document.getElementById('txttotal');
var txttotalredondeado = document.getElementById('txttotalredondeado');

//contenedores
var formregistro = document.getElementById('formregistro');

//buttons
var btnguardar = document.getElementById('btnguardar');
var btnimprimir = document.getElementById('btnimprimir');
var btncancelar = document.getElementById('btncancelar');
var btnnuevo = document.getElementById('btnnuevo');
var btnbuscarcliente = document.getElementById('btnbuscarcliente');
var btnagregaritem = document.getElementById('btnagregaritem');
var btnguardar = document.getElementById('btnguardar');

//variables
var tbldetalle;
var _PRODUCTOSENDETALLE = [];
$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: false,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });
    init();
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;
    if (tecla === '+')
        fnAbrirModalProductos();
    if (tecla === 'F1') {
        e.preventDefault();
        fnguardar();
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
    //  txtfecha.value = moment().format('DD/MM/YYYY');

    if (_MODELO != null) {
        let proformacontroller = new ProformaController();
        var obj = { idproforma: _MODELO.idproforma, rangodias:9999 };
        proformacontroller.GetProformaCompleta(obj, function (data) {

            fncargardatosproforma(data[0]);
        });
    }
}

function fncargardatosproforma(data) {
    var cabecera = JSON.parse(data.CABECERA)[0];
    var detalle = JSON.parse(data.DETALLE);
 
    txtusuario.value = cabecera.usuario;
    txtnombreempresa.value = cabecera.empresa;
    txtnombresucursal.value = cabecera.sucursal;
    txtnumdoccliente.value = cabecera.numdoccliente;
    txtnombrescliente.value = cabecera.nombrecliente;
    btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Proforma/ImprimirProforma1/" + cabecera.idventa);
    tbldetalle.clear().draw(false);


    for (var i = 0; i < detalle.length; i++) {
        if (detalle[i].isblister === undefined)
            detalle[i].isblister = false;
        if (detalle[i].isfraccion === undefined)
            detalle[i].isfraccion = false;
        detalle[i].datosstock = detalle[i].datosstock??[];
        var datastock = detalle[i].datosstock[0];
        if (datastock == undefined || datastock == null) {//validacion para proformas sin idstock
            datastock =  {
                maxcaja: 100,               
            }
        }
        _PRODUCTOSENDETALLE.push(datastock);
        var checkblister = '';
        var checkfracion = '';
        var checkdisabled = '';
        var stock = datastock.maxcaja;
        if (detalle[i].isfraccion) {
            checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" checked  multiplo="' + detalle[i].multiplo + '"/>';
            stock = data.maxfraccion;
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
        var preciox = ((detalle[i].precioigv.toFixed(2)) / ((100 - detalle[i].dsc) / 100)).toFixed(2);
        if (isNaN(preciox)) preciox = 0;

        var fila = tbldetalle.row.add([
            '',
            (i + 1),
            detalle[i].codigoproducto,
            '<span class="formulacion">' + detalle[i].formulacion + '</span>',           
            detalle[i].lote,
            detalle[i].fechavencimiento,
            '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number" min="1" max="' + stock + '"/>',
            checkfracion,
            //checkblister,
            '<span class="precio_detalle font-14">' + preciox+ '</span>',
            '<span class="descuento font-14">' + detalle[i].dsc+ '</span>',
            '<span class="importe_detalle font-14">' + (detalle[i].cantidad * preciox).toFixed(2) + '</span>',
            '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '"><i class="fas fa-trash-alt"></i></button>'

        ]).draw(false).node();
        fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
        (fila).setAttribute('idstock', detalle[i].idstock??'');
        (fila).setAttribute('idprecioproducto', detalle[i].idprecioproducto);
        (fila).setAttribute('iddetalleproforma', detalle[i].iddetalleproforma);
        (fila).setAttribute('idproducto', detalle[i].idproducto);
        //(fila).setAttribute('incentivo', detalle[i].incentivo);
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
function fnListarDocumentoTributario(idcajasucursal, iddocumento, tipo) {
    let controller = new DocumentoTributarioController();
    if (tipo == 1)
        controller.ListarDocumentosxCajaSucursalParaVentas(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
            txtserie.value = $("#cmbiddocumento option:selected").attr("serie");
        });
    else
        controller.ListarDocumentosxCajaAperturada(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
        });
}
function fnAbrirModalProductos() {
    $('#modalbuscarproducto').modal('show');

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
            location.href = ORIGEN + '/Ventas/Proforma/Proforma';
        }
        else
            swal.close();
    });
}
function fnNuevo() {
    formregistro.reset();
    if (_MODELO != null)
        location.href = ORIGEN + "/Ventas/Proforma/Proforma";
    txtnumdoccliente.setAttribute('numdoc', '');
    tbldetalle.clear().draw(false);
    txtidcliente.value = '';
    txtidproforma.value = '';
    btnguardar.disabled = false;
    _PRODUCTOSENDETALLE = [];

}
function fnimprimir() {
    if (txtidproforma.value != '') {
        var href = btnimprimir.getAttribute('href');
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PROFORMA');
    }
}
function fnBuscarStock(idstock) {
    let controller = new StockController();
    var obj = {
        idstock: idstock,
        idlista: MBP_cmblistaprecios.value
    };
    controller.GetStockProductosParaVenta(obj, function (data) {
        _PRODUCTOSENDETALLE.push(data[0]);
        if (data.length === 0)
            return;
        data = data[0];
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
        //checkdisabled = '';

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
        var descuento = fnverificarsitienedescuento(data.tienedescuento ?? 'x');
        
        var ds = 0;
        if (descuento[0] != 'x') ds = descuento[0];
        var monto = 0;
        monto = ((precio == 0.01) ? 0 : precio).toFixed(2);
        var desc = (monto - ((monto * (ds / 100)).toFixed(2))).toFixed(2);

        var input = '<input style="width:100%" value="1" class="text-center cantidad_detalle font-14" type="number"  min="1" max="' + stock + '" required/>';
        var index = tbldetalle.rows().data().length;
        var fila = tbldetalle.row.add([
            '',
            index + 1,
            data.codigoproducto,
           '<span class="formulacion">'+ data.nombre+'</span>',
            data.lote,
            (data.fechavencimiento == '') ? '' : moment(data.fechavencimiento).format('DD-MM-YYYY'),
            input,
            checkfracion,
            //(data.venderblister) ? checkblister : '',
            '<span class="precio_detalle font-14">' + precio.toFixed(2) + '</span>',
            '<span class="descuento font-14">' + ds + '</span>',
            '<span class="importe_detalle font-14">' + desc + '</span>',
            '<button class="btn btn-danger btneliminar_detalle" type="button" idstock="' + data.idstock + '"><i class="fas fa-trash-alt"></i></button>'
        ]).draw(false).node();
        $(fila).attr('idstock', data.idstock);
        (fila).setAttribute('idprecioproducto', data.idprecioproducto);
        (fila).setAttribute('tipoimpuesto', data.tipoimpuesto);
        (fila).setAttribute('iddetalleproforma', 0);
        (fila).setAttribute('idproducto', data.idproducto);
        //(fila).setAttribute('incentivo', data.incentivo);
        $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
        fncalcularmontos();
    });

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
function fnacciones_fraccion_blister(idstock, tipo, input, inputcheck) {
    var data = _PRODUCTOSENDETALLE[encontrarIndexArraProductos(idstock)];
    if (tipo === 'fraccion') {
        if (inputcheck.prop('checked')) {
            if (parseInt(input.val()) > data.maxfraccion) {
                input.val(data.maxfraccion);
                alertaSwall('I', 'El stock maximo en fracción del producto ' + data.nombre + ' es ' + data.maxfraccion, '');
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
                }
            } else
                inputcheck.prop('checked', true);
        }
    } else if (tipo === 'blister') {
        if (inputcheck.prop('checked')) {
            if (parseInt(input.val()) > data.maxblister) {
                input.val(data.maxblister);
                alertaSwall('I', 'El stock maximo en blister del producto ' + data.nombre + ' es ' + data.maxblister, '');
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
                }


            } else
                inputcheck.prop('checked', true);

        }
    }
    fncalcularmontos();
}
//encontrar index en array productos paraa manipular
function encontrarIndexArraProductos(idstock) {
    var index = -1;
    for (var i = 0; i < _PRODUCTOSENDETALLE.length; i++) {
        if ((_PRODUCTOSENDETALLE[i].idstock??'').toString() === idstock.toString()) {
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
    var descuento = 0.0;
    var totalsinigv = 0.0;
    var datatable = tbldetalle.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("cantidad_detalle")[c].value);
            descuento = parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0;
            if (isNaN(descuento)) descuento = 0;
            if (isNaN(cantidad) || cantidad < 1)
                cantidad = 0;
            precio = parseFloat(document.getElementsByClassName("precio_detalle")[c].innerHTML);
            descuento = precio * (descuento / 100);
            importe = cantidad * (precio-descuento);
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

    subtotal = REDONDEAR_DECIMALES((total - igv) + totalsinigv, 2);
    txtsubtotal.value = subtotal.toFixed(2);
    txtigv.value = igv.toFixed(2);
    txttotal.value = (totalsinigv + total).toFixed(2);
    var auxredondeoarray = parseFloat(txttotal.value).toFixed(2).split('.');
    txttotalredondeado.value = parseFloat(auxredondeoarray[0] + "." + auxredondeoarray[1].substr(0, 1)).toFixed(2);
}
function fnagregarindex() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 1;
    filas.forEach(function (e) {
        e.getElementsByTagName('td')[0].textContent = c;
        c++;
    });
}
function fnQuitarItemDelDetalle(idstock, eliminarproductoarray) {
    var data = tbldetalle.rows().data();
    if (data.length > 0) {
        tbldetalle.row('.selected').remove().draw(false);
        fneliminaritemdebonificacion(idstock);
        if (eliminarproductoarray) {
            //quitar del array de productos en detalle
            var index = encontrarIndexArraProductos(idstock);
            _PRODUCTOSENDETALLE.splice(index, 1);
        }

        fnagregarindex();
        fncalcularmontos();
    }
}

function fnGetDetalle() {
    var filas = document.querySelectorAll('#tbldetalle tbody tr')
    var datatable = tbldetalle.rows().data().length;
    var array = [];
    if (datatable > 0)
        filas.forEach(function (e) {
            var obj = new ProformaDetalle();
            var descuento = 0;
            var importe=0;
            var precio = 0;
            precio = e.getElementsByClassName('precio_detalle')[0].innerText;

            obj.idstock = e.getAttribute('idstock');
            obj.tipo = e.getAttribute('tipo');
            //obj.incentivo = e.getAttribute('incentivo');
            try {
                obj.iddetalleproforma = e.getAttribute('iddetalleproforma').toString() === '' ? 0 : e.getAttribute('iddetalleproforma');
            } catch (e) {
                obj.iddetalleproforma = 0;
            }
            obj.idprecioproducto = e.getAttribute('idprecioproducto');
            obj.idproducto = e.getAttribute('idproducto');
            obj.cantidad = e.getElementsByClassName('cantidad_detalle ')[0].value;
            obj.formulacion = e.getElementsByClassName('formulacion ')[0].innerText;
            var isfraccion = e.getElementsByClassName('checkfraccion_detalle')[0];
            //var isblister = e.getElementsByClassName('checkblister_detalle')[0];
            obj.isfraccion = isfraccion === undefined ? null : isfraccion.checked;
            //obj.isblister = isblister === undefined ? null : isblister.checked;

            descuento = parseFloat(e.getElementsByClassName('descuento')[0].innerText) ?? 0;
            if (isNaN(descuento)) descuento = 0;
            descuento = precio * (descuento / 100);
            importe =  (precio - descuento);

            //obj.precioigv = e.getElementsByClassName('precio_detalle')[0].innerText;
            obj.precioigv = importe;
            if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                obj.precio = (parseFloat(obj.precioigv) / (1 + IGV)).toFixed(2);
            else
                obj.precio = (parseFloat(obj.precioigv));
            array.push(obj);
        });
    return array;
}

btnagregaritem.addEventListener('click', function () {
    fnAbrirModalProductos();
});
btnnuevo.addEventListener('click', function () {
    fnNuevo();
});
btnimprimir.addEventListener('click', function () {
    fnimprimir();
});


btncancelar.addEventListener('click', function () {
    fnCancelar();
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
$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = MCC_tblcliente.row($(this).parents('tr')).data();
    txtidcliente.value = this.getAttribute('idcliente');
    txtnumdoccliente.value = fila[2];
    txtnumdoccliente.setAttribute('numdoc', fila[2]);
    txtnombrescliente.value = fila[3];
    $('#modalcliente').modal('hide');
});

btnbuscarcliente.addEventListener('click', function () {
    $('#tabListaPacientes').tab('show');
    $('#modalcliente').modal('show');
});
//registro de cliente
MCC_formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    let controller = new ClienteController();
    var obj = $('#MCC_formregistro').serializeArray();
    controller.RegistrarEditar(obj, function (data) {
        txtnumdoccliente.value = data.nrodocumento;
        txtnumdoccliente.setAttribute('numdoc', data.nrodocumento);
        txtnombrescliente.value = data.descripcion + " " + data.apepaterno + " " + data.apematerno;
        txtidcliente.value = data.idcliente;
        MCC_formregistro.reset();
        $('#modalcliente').modal('hide');
    });
});
$(document).on('click', '.MBP_seleccionarstock', function (e) {
    var idstock = this.getAttribute('idstock');
    $('#modalbuscarproducto').modal('hide');
    $('#modallotes').modal('hide');
    fnBuscarStock(idstock);
});

$(document).on('click', '.checkfraccion_detalle', function (e) {

    var fila = tbldetalle.row($(this).parents('tr')).data();
    var idstock = ($(this).parents('tr').attr('idstock'));
    var inputcantidad = $(this).parents('tr').find('.cantidad_detalle');
    //try { $(this).parents('tr').find('.checkblister_detalle')[0].checked = false; } catch (e) { }
    fnacciones_fraccion_blister(idstock, 'fraccion', inputcantidad, $(this));
});
$(document).on('click', '.checkblister_detalle', function (e) {
    var fila = tbldetalle.row($(this).parents('tr')).data();
    var idstock = ($(this).parents('tr').attr('idstock'));
    try { $(this).parents('tr').find('.checkfraccion_detalle')[0].checked = false; } catch (e) { }


    var inputcantidad = $(this).parents('tr').find('.cantidad_detalle');
    fnacciones_fraccion_blister(idstock, 'blister', inputcantidad, $(this));
});

$(document).on('click', '.cantidad_detalle', function () {
    var fila = this.parentNode.parentNode;
    if (fila.getAttribute('tipo') != 'bonificacion') {
        fneventostxtcantidad(this);
        fncalcularbonificacion(this);
    }
});

$(document).on('keyup', '.cantidad_detalle', function (e) {
    var fila = this.parentNode.parentNode;
    if (fila.getAttribute('tipo') != 'bonificacion')
        fneventostxtcantidad(this);
    if (e.key == 'Enter') {
        fncalcularbonificacion(this);
    }
   
});
$(document).on('click', '.btneliminar_detalle', function (e) {
    //console.log(this.parentNode.parentNode.getAttribute('idstock'));
    var tipo = this.parentNode.parentNode.getAttribute('tipo');
    var eliminarproductodetalle = true;
    if (tipo == 'bonificacion')
        eliminarproductodetalle = false;
    fnQuitarItemDelDetalle(this.getAttribute('idstock'), eliminarproductodetalle);
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
$(document).on('mousewheel', '.cantidad_detalle', function (e) {
    this.blur();
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (tbldetalle.rows().data().length === 0) {
        mensaje('W', 'No hay datos en el detalle', 'TC');
        return;
    }
    var obj = $('#formregistro').serializeArray();
    obj[obj.length] = { name: 'tipo', value: 'venta' };
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fnGetDetalle()) };
    swal({
        title: txtidproforma.value === '' ? '¿Desea registrar proforma?' : '¿Desea editar proforma?',
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
            let controller = new ProformaController();
            controller.RegistrarProforma(obj, txtidproforma.value, function (data) {

                txtidproforma.value = data.idproforma;
                txtcodproforma.value = data.codigoproforma;
                btnguardar.disabled = true;
                btnimprimir.setAttribute('href', ORIGEN + "/Ventas/Proforma/ImprimirProforma1/" + data.idproforma);
            });
        }
        else
            swal.close();
    });
});

