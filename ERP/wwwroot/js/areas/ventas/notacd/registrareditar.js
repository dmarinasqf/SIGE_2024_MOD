var cmbiddocumento = document.getElementById('cmbiddocumento');
var cmbidtipodocumento = document.getElementById('cmbidtipodocumento');
var txtdocumentoventa = document.getElementById('txtdocumentoventa');
var txtfechaventa = document.getElementById('txtfechaventa');
var txtserieventa = document.getElementById('txtserieventa');
var txtnumdocventa = document.getElementById('txtnumdocventa');
var txtusuario = document.getElementById('txtusuario');
var txtnombreempresa = document.getElementById('txtnombreempresa');
var txtnombresucursal = document.getElementById('txtnombresucursal');
var lblfecha = document.getElementById('lblfecha');
var txtnumdoccliente = document.getElementById('txtnumdoccliente');
var txtnombrescliente = document.getElementById('txtnombrescliente');
var txtmotivodevolucion = document.getElementById('txtmotivodevolucion');
var txtserienota = document.getElementById('txtserienota');
var txtnumdocnota = document.getElementById('txtnumdocnota');

var txtsubtotal = document.getElementById('txtsubtotal');
var txtigv = document.getElementById('txtigv');
var txttotal = document.getElementById('txttotal');
var txttotalredondeado = document.getElementById('txttotalredondeado');
var btnbuscarPorCliente = document.getElementById('btnbuscarPorCliente');


var txtidnota = document.getElementById('txtidnota');
var txtidventa = document.getElementById('txtidventa');
var txtidaperturacaja = document.getElementById('txtidaperturacaja');

//contenedores
var formregistro = document.getElementById('formregistro');

//buttons
var btnguardar = document.getElementById('btnguardar');
var btnimprimir = document.getElementById('btnimprimir');
var btnnuevo = document.getElementById('btnnuevo');
var btnbuscarfactura = document.getElementById('btnbuscarfactura');

//Contenedor
var contenedorBtnBuscarPorCliente = document.getElementById('contenedorBtnBuscarPorCliente');

//variables
var tbldetalle;
$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: false,

    });

    if (IDSUCURSAL == "100") {
        contenedorBtnBuscarPorCliente.removeAttribute("hidden");
    }
    init();
    fnlistarsucursales();
});
window.addEventListener('keydown', function (e) {
    var tecla = e.key;
    if (tecla === '+')
        fnabrirmodalventas();
    if (tecla === 'F1') {
        e.preventDefault();
        fnguardar();
    }
    if (tecla === 'F2') {
        e.preventDefault();
        fnlimpiar();
    }
    if (tecla === 'F3') {
        e.preventDefault();
        fnimprimir();
    }

});

function init() {
    //  txtfecha.value = moment().format('DD/MM/YYYY');
    if (_MODELO != null) {
        fnListarDocumentoTributario(_MODELO.idaperturacaja, _MODELO.iddocumento, 2);
        fnbuscarnotaventa(_MODELO.idnota);

        setTimeout(function () {
            cmbidtipodocumento.value = _MODELO.idtipodocumento;
        }, 2000);
    } else {
        txtnombrecaja.value = _DATOSCAJA.caja;
        txtidaperturacaja.value = _DATOSCAJA.idaperturacaja;
        fnListarDocumentoTributario(_DATOSCAJA.idcajasucursal, null, 1);
    }
}

function fnbuscarnotaventa(idnota) {
    datosiniciales();
    let controller = new NotaCDController();
    controller.GetNotaCompleta(idnota, function (data) {
        var cabecera = JSON.parse(data[0].CABECERA)[0];
        var detalle = JSON.parse(data[0].DETALLE);

        txtdocumentoventa.value = cabecera.doctribventa;
        txtnumdocventa.value = cabecera.numdocventa;
        txtserieventa.value = cabecera.serieventa;
        cmbiddocumento.value = cabecera.iddocumento;
        txtfechaventa = cabecera.fechaventa;
        txtserienota.value = cabecera.serienota;
        lblfecha.innerText = cabecera.fechanota;
        txtnumdocnota.value = cabecera.numdocnota;
        txtnumdoccliente.value = cabecera.numdoccliente;
        txtnombrescliente.value = cabecera.nombrecliente;
        txtnombrecaja.value = cabecera.caja;
        txtusuario.value = cabecera.usuario;
        txtnombreempresa.value = cabecera.empresa;
        txtnombresucursal.value = cabecera.sucursal;
        cmbidtipodocumento.value = cabecera.idtipodocumento;
        btnimprimir.setAttribute('href', ORIGEN + "/Ventas/NotaCD/ImprimirTicket/" + cabecera.idnota);
        btnbuscarfactura.disabled = true;
        for (var i = 0; i < detalle.length; i++) {
            var fila = tbldetalle.row.add([
                (i + 1),
                detalle[i].codigoproducto,
                detalle[i].producto,
                '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number"  disabled/>',
                (detalle[i].isfraccion) ? '<span class="isfraccion" valor="true"> ✓</span>' : '<span class="isfraccion" valor="false"> </span>',
                //(detalle[i].isblister) ? '<span class="isblister" valor="true"> ✓</span>' : '<span class="isblister" valor="false"> </span>',                
                '<span class="precio_detalle font-14">' + detalle[i].precioigv.toFixed(2) + '</span>',
                '<span class="importe_detalle font-14">' + (detalle[i].cantidad * detalle[i].precioigv).toFixed(2) + '</span>',
                ''
            ]).draw(false).node();
            fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
        }


        fncalcularmontos();
    });
}

function fnListarDocumentoTributario(idcajasucursal, iddocumento, tipo) {

    let controller = new DocumentoTributarioController();
    if (tipo == 1)
        controller.ListarDocumentoNotas(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
            txtserienota.value = $("#cmbiddocumento option:selected").attr("serie");
            fnlistartipodocumento();
        });
    else
        controller.ListarDocumentosxCajaAperturada(idcajasucursal, 'cmbiddocumento', iddocumento, function () {
            fnlistartipodocumento();
        }, 'nota');
}

function fncalcularmontos() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 0;
    var importe = 0.0;
    var cantidad = 0.0;
    var total = 0.0;
    var totalsinigv = 0.0;
    var datatable = tbldetalle.rows().data().length;
    if (datatable > 0)
        var ididpack = new Set();
    filas.forEach(function (e) {
        var idpackPedidoVenta = parseFloat(e.getAttribute('idpackPedidoVenta'));
        if (!ididpack.has(idpackPedidoVenta) || idpackPedidoVenta==0) {
            // Agrega el valor al conjunto
            ididpack.add(idpackPedidoVenta);

            cantidad = parseFloat(document.getElementsByClassName("cantidad_detalle")[c].value);
            if (isNaN(cantidad) || cantidad < 1)
                cantidad = 0;
            var precios = parseFloat(e.getAttribute('preciodesuni'));

            precio = parseFloat(document.getElementsByClassName("precio_detalle")[c].innerHTML);
            importe = cantidad * precio;
            if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                total += importe;
            else
                totalsinigv += importe;
            document.getElementsByClassName("importe_detalle")[c].innerHTML = REDONDEAR_DECIMALES(importe, 2).toFixed(2);
            
        }
        c++;
        });
    var igv = 0.0;
    var subtotal = 0.0;
    total = REDONDEAR_DECIMALES(total, 2);
    igv = REDONDEAR_DECIMALES(total / (1 + IGV), 5);
    igv = total - igv;

    //subtotal = REDONDEAR_DECIMALES((total - igv) + totalsinigv, 2);
    subtotal = REDONDEAR_DECIMALES(((total - igv) + totalsinigv) - REDONDEAR_DECIMALES($("#txtpkdescuento").val(), 2), 2);//EARTCOD1009
    txtsubtotal.value = subtotal.toFixed(2);
    igv = subtotal * 0.18;//EARTCOD1009
    txtigv.value = igv.toFixed(2);
    //txttotal.value = (totalsinigv + total).toFixed(2);
    txttotal.value = ((totalsinigv + total) - parseFloat($("#txtpkdescuento").val() * 1.18)).toFixed(2);//EARTCOD1009
    var auxredondeoarray = parseFloat(txttotal.value).toFixed(2).split('.');
    txttotalredondeado.value =parseFloat(auxredondeoarray[0] + "." + auxredondeoarray[1].substr(0, 1)).toFixed(2);
}

function fnlimpiar() {
    if (_MODELO != null) {
        location.href = ORIGEN + '/Ventas/NotaCD/RegistrarEditar';
    }
    formregistro.reset();
    txtnombrecaja.value = _DATOSCAJA.caja;
    txtidventa.value = '';
    txtidnota.value = '';
    txtserieventa.value = '';
    txtnumdocventa.value = '';
    txtdocumentoventa.value = '';
    txtnumdoccliente.value = '';
    txtnombrescliente.value = '';
    txtfechaventa.value = '';
    txtsubtotal.value = '';
    txtigv.value = '';
    txttotal.value = '';
    btnguardar.disabled = false;
    txttotalredondeado.value = '';
    tbldetalle.clear().draw(false);
}

//function fnabrirmodalventas() {
//    $('#modalbuscarventas').modal('show');

//}

function fnabrirmodalventas() {
    var idsucursal = document.getElementById('idsucursalenviar').value;
    $('#modalbuscarventas').modal('show');
    MBV_fnbuscarventas(idsucursal); // Pasa el valor al abrir el modal
}

function abrirModalBuscarVentas() {
    var idsucursall = document.getElementById('txtidsucursal').value;

/*    MBV_fnbuscarventas(idsucursal); // Pasa el valor al abrir el modal*/
    $('#modalbuscarventas').modal('show');

}


function fnguardar() {
    btnguardar.click();
}

function fnimprimir() {
    if (txtidventa.value != '') {
        var href = btnimprimir.getAttribute('href');
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR ' + cmbiddocumento.options[cmbiddocumento.selectedIndex].innerText);
    }
}

function fnGetDetalle() {
    var selectedOptionValue = $('#cmbidtipodocumento').find(':selected').attr('codigosunat');

    var filas = document.querySelectorAll('#tbldetalle tbody tr')
    var datatable = tbldetalle.rows().data().length;
    var array = [];
    var errorDetected = false;
    var errorMessage = "";

    if (datatable > 0)
        filas.forEach(function (e) {
            var obj = new DetalleNotaCD();

            if (selectedOptionValue === '11') {
                if (!verifyInputsBeforeProcessing()) {
                    errorDetected = true;
                    errorMessage = 'El Descuento no puede ser 0';
                    return;
                }

                obj.idstock = e.getAttribute('idstock');
                obj.idprecioproducto = e.getAttribute('idprecioproducto');
                obj.tipo = e.getAttribute('tipo');
                obj.cantidad = e.getElementsByClassName('cantidad_detalle ')[0].value;

                obj.isfraccion = e.getElementsByClassName('isfraccion')[0].getAttribute('valor');
                var precioOriginal = e.getAttribute('precioigvdescuento');
                obj.precioigv = $(e).find('.costototalnuevo').val();

                if (parseFloat(precioOriginal) < parseFloat(obj.precioigv)) {
                    errorDetected = true;
                    errorMessage = 'El descuento no puede ser mayor al precio del producto';
                    return;
                }

                if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                    obj.precio = (parseFloat(obj.precioigv) / (1 + IGV)).toFixed(2);
                else
                    obj.precio = (parseFloat(obj.precioigv));

                if (obj.cantidad > 0)
                    array.push(obj);
                var idpackPedidoVentaini = parseInt(e.getAttribute('idpackPedidoVenta'));
                if (idpackPedidoVentaini > 0) {
                    obj.idpackPedidoVenta = idpackPedidoVentaini;
                }
                var idclientedescuentoglobal = parseInt(e.getAttribute('iddescuentoglobal'));
                if (idclientedescuentoglobal > 0) {
                    obj.idclientedescuentoglobal = idclientedescuentoglobal;
                }

            } else {
                obj.idstock = e.getAttribute('idstock');
                obj.idprecioproducto = e.getAttribute('idprecioproducto');
                obj.tipo = e.getAttribute('tipo');

                var idpackPedidoVentaini = parseInt(e.getAttribute('idpackPedidoVenta'));
                var cantidaddetalle = e.getElementsByClassName('cantidad_detalle ')[0].value;
                var cantidadPacks = parseInt(e.getAttribute('cantidadPacks'));
                var cantidadproductospack = parseInt(e.getAttribute('cantidad'));
                var cantidadproductoporpackuni = cantidadproductospack / cantidadPacks;

                if (idpackPedidoVentaini > 0) {
                    obj.cantidad = cantidaddetalle * cantidadproductoporpackuni;
                } else {
                    obj.cantidad = cantidaddetalle;
                }
          

                obj.isfraccion = e.getElementsByClassName('isfraccion')[0].getAttribute('valor');

                var precioOriginal = e.getAttribute('precioigvdescuento'); 
                obj.precioigv = e.getAttribute('precioigvdescuento');

                if (e.getAttribute('tipoimpuesto').toUpperCase() === 'IGV')
                    obj.precio = (parseFloat(obj.precioigv) / (1 + IGV)).toFixed(2);
                else
                    obj.precio = (parseFloat(obj.precioigv));

                if (obj.cantidad > 0)
                    array.push(obj);

      
                if (idpackPedidoVentaini > 0) {
                    obj.idpackPedidoVenta = idpackPedidoVentaini;
                }
                var idclientedescuentoglobal = parseInt(e.getAttribute('iddescuentoglobal'));
                if (idclientedescuentoglobal > 0) {
                    obj.idclientedescuentoglobal = idclientedescuentoglobal;
                }
             
            }
        });

    if (errorDetected) {
        return { error: errorMessage };
    }

    return array;
}



function verifyInputsBeforeProcessing() {
    var allValid = true;
    $('.costototalnuevo').each(function () {
        var value = parseFloat($(this).val());
        if (isNaN(value) || value == 0) {
            allValid = false;
            $(this).focus();          
            return; // Rompe el ciclo .each
        }
    });

    return allValid; // Si todos los campos son válidos, devuelve true, sino devuelve false
}





function fnlistartipodocumento() {
    let controller = new DocumentoTributarioController();
    controller.ListarTipoDocumentoxDocumentoTributario(cmbiddocumento.value, 'cmbidtipodocumento', null, null);
}
function fngenerartxt(idnota) {
    var controlleraux = new NotaCDController();
    controlleraux.GenerarTxtNota(idnota, null);
}
cmbiddocumento.addEventListener('change', function () {
    txtserienota.value = cmbiddocumento.options[cmbiddocumento.selectedIndex].getAttribute('serie') ;
    fnlistartipodocumento();
});

//  LISTADO DE SUCURSALES

function fnlistarsucursales() {
    let controller = new NotaCDController();
    controller.ListarTodasSucursales('txtidsucursal', '', null);
}

$(document).on('click', '.MBV_btnselectventa', function () {
    tbldetalle.clear().draw();
    console.log(productosSeleccionados);
    datosiniciales();
    var idventa = this.getAttribute('idventa');
    console.log(productosSeleccionados);
    console.log(ventaabierta);
    var idprodcutossele = "";
    if (ventaabierta[idventa]) {
        var productosFiltrados = Object.keys(productosSeleccionados)
            .filter(idProducto => productosSeleccionados[idProducto] === idventa);
        idprodcutossele= productosFiltrados.join('|');
    } else {
        idprodcutossele="0|"
    }
    var obj = {
        idventa: idventa,
        idproductos: idprodcutossele ,
    };
    let controller = new NotaCDController();
    controller.BuscarVentaNotaCD_V1(obj, function (data) {
        console.log(data);
        data = data[0]; 
        $('#modalbuscarventas').modal('hide');
        $('#modalBuscarFacturaPorCliente').modal('hide');
        var cabecera = JSON.parse(data.CABECERA)[0];
        var detalle = JSON.parse(data.DETALLE);       
        console.log(detalle);
        // Get the selected option's attribute value
        function getCodigoSunatValue() {
            return $('#cmbidtipodocumento').find(':selected').attr('codigosunat');
        }


        txtnumdoccliente.value = cabecera.numdoccliente;
        txtnombrescliente.value = cabecera.nombrecliente;
        txtserieventa.value = cabecera.serie;
        txtnumdocventa.value = cabecera.numdocumento;
        txtfechaventa.value = cabecera.fecha;
        txtdocumentoventa.value = cabecera.documentotributario;
        txtidventa.value = cabecera.idventa;
        var clientedescuentoglobal = cabecera.idclientedescuentoglobal;
        if (clientedescuentoglobal != 0) {
            var valuedescuento = cabecera.pkdescuento;
            txtpkdescuento.value = (valuedescuento.toFixed(2) ?? '0.00');//EARTCOD1009
        } else {
            txtpkdescuento.value = '0.00';//EARTCOD1009
        }

        tbldetalle.clear().draw(false);

        detalle.sort(function (a, b) {
            return a.idpromopack - b.idpromopack;
        });
        var idSet = new Set();
       
        for (var i = 0; i < detalle.length; i++) {
            /*if (detalle[i].precioigv > 0)*/
            var tipoBoton = detalle[i].idpromopack === 0 ? 'btn-danger' : 'btn-primary';
            var idpackPedidoVenta = detalle[i].idpackPedidoVenta;
            if (idpackPedidoVenta != 0 ) {
                if (!idSet.has(idpackPedidoVenta)) {
                    // Agrega el valor al conjunto
                    idSet.add(idpackPedidoVenta);
                    var fila = tbldetalle.row.add([
                        (i + 1),
                        detalle[i].Codigopack,
                        detalle[i].Nombredepack,
                        '<input style="width:100%" value="' + detalle[i].cantidadPacks + '" class="text-center cantidad_detalle font-14" type="number" min="1" max="' + detalle[i].cantidadPacks + '" required />',
                        (detalle[i].isfraccion) ? '<span class="isfraccion" valor="true"> ✓</span>' : '<span class="isfraccion" valor="false"> </span>',
                        //(detalle[i].isblister) ? '<span class="isblister" valor="true"> ✓</span>' : '<span class="isblister" valor="false"> </span>',
                        '<span class="precio_detalle font-14" >' + detalle[i].precioIgvpack.toFixed(2) + '</span>',
                        '<span class="importe_detalle font-14">' + (detalle[i].cantidadPacks * detalle[i].precioIgvpack).toFixed(2) + '</span>',
                        '<button class="btn ' + tipoBoton + ' btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '" idpromopack="' + detalle[i].idpromopack + '"><i class="fas fa-trash-alt"></i></button>'

                    ]).draw(false).node();
                    fila.setAttribute('preciodesuni', detalle[i].precioSindescuento.toFixed(2));
                } else {
                    var fila = tbldetalle.row.add([
                        (i + 1),
                        detalle[i].Codigopack,
                        detalle[i].Nombredepack,
                        '<input style="width:100%" value="' + detalle[i].cantidadPacks + '" class="text-center cantidad_detalle font-14" type="number" min="1" max="' + detalle[i].cantidadPacks + '" required />',
                        (detalle[i].isfraccion) ? '<span class="isfraccion" valor="true"> ✓</span>' : '<span class="isfraccion" valor="false"> </span>',
                        // (detalle[i].isblister) ? '<span class="isblister" valor="true"> ✓</span>' : '<span class="isblister" valor="false"> </span>',
                        '<span class="precio_detalle font-14">' + detalle[i].precioIgvpack.toFixed(2) + '</span>',
                        '<span class="importe_detalle font-14">' + (detalle[i].cantidadPacks * detalle[i].precioIgvpack).toFixed(2) + '</span>',
                        '<button class="btn ' + tipoBoton + ' btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '" idpromopack="' + detalle[i].idpromopack + '"><i class="fas fa-trash-alt"></i></button>'
                    ]).draw(false).node();

                    // Set the 'preciodesuni' attribute and make it hidden
                    fila.setAttribute('preciodesuni', detalle[i].precioSindescuento.toFixed(2));
                    fila.style.display = 'none'; // This line will hide the element visually
                }
                console.log(idSet);
            } else {
                var fila = tbldetalle.row.add([
                    (i + 1),
                    detalle[i].codigoproducto,
                    detalle[i].producto,
                    '<input style="width:100%" value="' + detalle[i].cantidad + '" class="text-center cantidad_detalle font-14" type="number" min="1" max="' + detalle[i].cantidad + '" required />',
                    (detalle[i].isfraccion) ? '<span class="isfraccion" valor="true"> ✓</span>' : '<span class="isfraccion" valor="false"> </span>',
                    //(detalle[i].isblister) ? '<span class="isblister" valor="true"> ✓</span>' : '<span class="isblister" valor="false"> </span>',
                    '<span class="precio_detalle font-14" >' + detalle[i].precioigvdescuento.toFixed(2) + '</span>',
                    '<span class="importe_detalle font-14">' + (detalle[i].cantidad * detalle[i].precioigvdescuento).toFixed(2) + '</span>',
                    '<button class="btn ' + tipoBoton + ' btneliminar_detalle" type="button" idstock="' + detalle[i].idstock + '" idpromopack="' + detalle[i].idpromopack + '"><i class="fas fa-trash-alt"></i></button>'

                ]).draw(false).node();
                fila.setAttribute('preciodesuni', detalle[i].precioigvdescuento.toFixed(2));
            }

                fila.setAttribute('cantidad', detalle[i].cantidad);
                fila.setAttribute('tipoimpuesto', detalle[i].tipoimpuesto.toUpperCase());
                fila.setAttribute('idprecioproducto', detalle[i].idprecioproducto);
                fila.setAttribute('idstock', detalle[i].idstock);
                fila.setAttribute('tipo', detalle[i].tipo ?? '');
                fila.setAttribute('idpackPedidoVenta', detalle[i].idpackPedidoVenta ?? '');
                fila.setAttribute('idpromopack', detalle[i].idpromopack ?? '');
                fila.setAttribute('cantidadDescuentopack', detalle[i].cantidadDescuentopack ?? '0');
                fila.setAttribute('cantidadPacks', detalle[i].cantidadPacks ?? '0');
                fila.setAttribute('iddescuentoglobal', cabecera.idclientedescuentoglobal ?? '0');
                fila.setAttribute('precioigvdescuento', detalle[i].precioigvdescuento ?? '0');
                fila.setAttribute('precioTotalPacksdesc', detalle[i].precioTotalPacksdesc ?? '0');
            
        }
        $('#cmbiddocumento option:contains(' + cabecera.documentotributario + ')').attr('selected', true);
        txtserienota.value = cmbiddocumento.options[cmbiddocumento.selectedIndex].getAttribute('serie');
        fnlistartipodocumento();
        fncalcularmontos();
    });





   
    controller.VerificarSiVentaTieneNota(idventa, function (data) {
        if (data.mensaje == 'ok')
            if (data.objeto != '')
                alertaSwall('I', data.objeto, '');
    });
});
btnnuevo.addEventListener('click', function () {
    formregistro.reset();
    fnlimpiar();
});

btnimprimir.addEventListener('click', function () {
    fnimprimir();
});


formregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    if (tbldetalle.rows().data().length === 0) {
        mensaje('W', 'No hay datos en el detalle', 'TC');
        return;
    }
    if (cmbiddocumento.options[cmbiddocumento.selectedIndex].text.includes(txtdocumentoventa.value))
    {
        var detalle = fnGetDetalle();
        // Obtener el elemento select
        var selectElement = document.getElementById("txtidsucursal");

        // Obtener la opción seleccionada
        var selectedOption = selectElement.options[selectElement.selectedIndex];

        // Obtener el valor y el atributo personalizado (data-idcaja)
        var sucusalid = selectedOption.value;
        var idCaja = selectedOption.getAttribute("data-idcaja");
        var idempresa = selectedOption.getAttribute("data-idempresa");
        if (detalle.error) {
            mensaje('W', detalle.error);
            return;
        }

        if (detalle.length == 0) {
            mensaje('W', 'No hay datos en el detalle');
            return;
        }

        var txtusuario = document.getElementById('txtusuario').value;
        var txtnombreempresa = document.getElementById('txtnombreempresa').value;
        var txtnombresucursal = document.getElementById('txtnombresucursal').value;
        var obj = $('#formregistro').serializeArray();
        obj[obj.length] = { name: 'pkdescuento', value: $("#txtpkdescuento").val() };//EARTCOD1009
        obj[obj.length] = { name: 'desc_Vol_compra', value: $("#txtdescuento").val() };//EARTCOD1009
        obj[obj.length] = { name: 'idsucursal', value: sucusalid };//EARTCOD1009
        obj[obj.length] = { name: 'idempresa', value: idempresa };//EARTCOD1009
        obj[obj.length] = { name: 'idCajasucursal', value: idCaja };//EARTCOD1009
        obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fnGetDetalle()) };
     
        BLOQUEARCONTENIDO('cardreport', 'Agregando..');

        swal({
            title: '¿Desea registrar ' + cmbiddocumento.options[cmbiddocumento.selectedIndex].innerText + '?',
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
                let controller = new NotaCDController();
                controller.Registrar(obj, function (data) {
                    txtidnota.value = data.idnota;
                    txtnumdocnota.value = data.numdocumento;
                    btnguardar.disabled = true;
                    btnimprimir.setAttribute('href', ORIGEN + "/Ventas/NotaCD/ImprimirTicket/" + data.idnota);

                    fngenerartxt(data.idnota);
                    DESBLOQUEARCONTENIDO('cardreport');
                });
            } else
                swal.close();
            btnguardar.disabled = false;
            DESBLOQUEARCONTENIDO('cardreport');
        });
    }
    else
    mensaje('W', 'Seleccione el tipo de documento correcto');

});
$(document).on('click', '.cantidad_detalle', function () {
    var max = this.getAttribute('max');
    if (this.value > max)
        this.value = max;
    var cantidadpack = this.value;
    var idpackPedidoVenta = $(this).closest('tr').attr('idpackPedidoVenta');
    if (idpackPedidoVenta != 0) {
        $("#tbldetalle tbody tr[idpackPedidoVenta='" + idpackPedidoVenta + "'] .cantidad_detalle").val(cantidadpack);
    }
    fncalcularmontos();
});

$(document).on('keyup', '.cantidad_detalle', function (e) {
    var max = this.getAttribute('max');
    if (this.value > max)
        this.value = max;
    var cantidadpack = this.value;
    var idpackPedidoVenta = $(this).closest('tr').attr('idpackPedidoVenta');
    if (idpackPedidoVenta != 0) {
        $("#tbldetalle tbody tr[idpackPedidoVenta='" + idpackPedidoVenta + "'] .cantidad_detalle").val(cantidadpack);
    }
    fncalcularmontos();
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
$(document).on('click', '.btneliminar_detalle', function (e) {
    var filatabla = $(this).closest('tr');
    //console.log(this.parentNode.parentNode.getAttribute('idstock'));
    var cantidadDescuentopackini = filatabla.attr('cantidaddescuentopack');
    var iddescuentoglobal = filatabla.attr('iddescuentoglobal');
    var txtdescuentovalor = 0;
    var valorActual = parseFloat($("#txtpkdescuento").val()) || 0;

    // valor de pack
    var precioTotalPacksdesc = filatabla.attr('precioTotalPacksdesc') ;
    var cantidadPacks = filatabla.attr('cantidadPacks');
    var idpromopack = filatabla.attr('idpromopack');
    var idpackPedidoVenta = filatabla.attr('idpackPedidoVenta');
    var cantidadDescuentopack = cantidadDescuentopackini * cantidadPacks;
    var cantidadDescuentopack = precioTotalPacksdesc / 1.18;
    // Redondear el resultado a dos decimales
    var cantidadRedondeada = parseFloat(cantidadDescuentopack.toFixed(2));

    if (iddescuentoglobal != 0) {
        var precioigvdescuento = filatabla.attr('precioigvdescuento');
        var precioigvdescuentoval = 0;
        if (cantidadDescuentopackini != 0) {
            var preciofinpack = Math.round(precioTotalPacksdesc * 0.15 * 100) / 100;
            var preciocon18porcientopack = (preciofinpack / 1.18);
            precioigvdescuentoval = preciocon18porcientopack;
        } else {
            var preciofin = Math.round(precioigvdescuento * 0.15 * 100) / 100;
            var preciocon18porciento = (preciofin / 1.18);
            precioigvdescuentoval = preciocon18porciento;
        }
       
 

        var nuevoValorini = valorActual - precioigvdescuentoval;
        var nuevoValor = nuevoValorini.toFixed(2);
        if (nuevoValor < 0.5) {
            nuevoValor = 0
        }
        $("#txtpkdescuento").val(nuevoValor.toString());
        txtdescuentovalor = nuevoValor;
    } else {
        txtdescuentovalor = valorActual;
    }


    var valorActual1 = parseFloat($("#txtpkdescuento").val()) || 0;
    var nuevoValorini = valorActual1 - cantidadRedondeada;

    var nuevoValor = nuevoValorini.toFixed(2);
    if (nuevoValor < 0.5) {
        nuevoValor = 0
    }
    $("#txtpkdescuento").val(nuevoValor.toString());

    // CAMBIO PARA LA ELIMINACION DE UN SOLO PRODUCTO
    if (idpackPedidoVenta != 0) {
        $("#tbldetalle tbody tr[idpackPedidoVenta='" + idpackPedidoVenta + "']").remove();
    } else {

        filatabla.remove();
    }
    //  FIN CORRECION
    fncalcularmontos();
/*    fnQuitarItemDelDetalles(this.getAttribute('idstock'), cantidadRedondeada);*/
 
});



function fnQuitarItemDelDetalles(idstockpara, cantidadDescuentopack) {
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
            // Tu código aquí
            if (otroArray.length > 0) {
                // Iterar sobre cada idstock en el array                       
                $("#tbldetalle tbody tr[idpromopack='" + idpromopack + "'][idstock='" + idstock + "']").remove();
                fncalcularmontos();
            }
        }
    }
}









$(document).ready(function () {
    // Manejar el cambio en el combo
    $('#txtidsucursal').on('change', function () {

        // Actualizar los valores de los textbox solo si se confirmó
        var selectedOption = $(this).find(':selected');
        var empresa = selectedOption.parent().attr('label');
        var sucursal = selectedOption.text();
        var idcaja = selectedOption.data('idcaja');
    //ACTIVACION DEL LABEL
        var txtdocumentoventa = document.getElementById('txtdocumentoventa').value;
        var txtserieventa = document.getElementById('txtserieventa').value;
        var txtnumdocnota = document.getElementById('txtnumdocnota').value;

        if (txtdocumentoventa.trim() !== '' && txtserieventa.trim() !== '' && txtnumdocnota.trim() === '') {
            // Mostrar el cuadro de diálogo
            swal({
                title: 'La NOTA DE CREDITO no se genero ¿Desea continuar?',
                text: '',
                icon: 'warning',
                class: 'text-center',
                buttons: {
                    cancel: {
                        visible: true,
                        text: 'Cancelar',
                        className: 'btn btn-danger'
                    },
                    confirm: {
                        text: 'Continuar',
                        className: 'btn btn-success'
                    }
                }
            }).then((result) => {
                // Verificar si se hizo clic en el botón de confirmar
                if (result) {

                    formregistro.reset();
                    fnlimpiar();
                    MBFCPL_tblfacturas.clear().draw(false);
                    $('#txtnombreempresa').val(empresa);
                    $('#txtnombresucursal').val(sucursal);
                    fnListarDocumentoTributario(idcaja, null, 1);
                } else {
                    fnlistarsucursales();
                }
            });
        } else {
            formregistro.reset();
            fnlimpiar();
            MBFCPL_tblfacturas.clear().draw(false);
            $('#txtnombreempresa').val(empresa);
            $('#txtnombresucursal').val(sucursal);
            fnListarDocumentoTributario(idcaja, null, 1);
        }

     

    });
});

btnbuscarPorCliente.addEventListener("click", function (e) {
    $('#modalBuscarFacturaPorCliente').modal('show');
});