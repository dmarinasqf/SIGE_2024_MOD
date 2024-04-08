//VARIABLES 
//DATOS DE COMPRA
var txtfecha = $('#txtfecha');
var txtcodigo = $('#idcompra');
var txtcodigocompra = $('#codigocompra');
var txtidproveedor = $('#idproveedor');
var txtruc = $('#txtruc');
var txtrazonsocial = $('#txtrazonsocial');
var cmbcontacto = $('#cmbcontacto');
var cmbidmoneda = $('#idmoneda');
var txtvalormoneda = $('#valormoneda');
var cmbsucursaldestino = $('#idsucursaldestino');
//VALORES IGV
var condicionigv = $('#condicionigv');
var igvp;
var igvd;
//DATOS DE PAGOS
var txtidpago = $('#idpago');
var cmbcomprobante = $('#iddocumento');
var txtseriedoc = $('#seriedoc');
var txtnumdoc = $('#numdoc');
var txtfechadoc = $('#fechadoc');
//SOLO MOSTRAR
var txtsucursal = $('#txtsucursal');
var txtresponsable = $('#txtresponsable');
var txtempresa = $('#txtempresa');
//SUBTOTALES
var txtsubtotal = $('#txtsubtotal');
var txtigv = $('#txtigv');
var txttotal = $('#txttotal');
//TABLE
var tbldetalle;
//MODAL
var modallistaproveedores = $('#modallistaproveedores');

var btnquitaritem = $('#btnquitaritem');
var btnagregaritem = $('#btnagregaritem');
var btnguardar = $('#btnguardar');
var btneditar = $('#btneditar');
var COMPRADETALLE = [];


$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        fixedHeader: true,
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        //scrollY: '50vh',
        //scrollCollapse: true,
        //"scrollX": true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        buttons: CONFIGUTTONS('DETALLE COMPRAS', 'H', false),
        "language": LANGUAGETABLE(),
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [2],
                "visible": false
            }
        ]
    });
    obtenerIgvCompra();
    //INITIALIZAR LOS CAMPOS    
    if (MODELO.idcompra === 0 || MODELO.idcompra === null) {
        txtcodigocompra.val('');     
        //txtfecha.val(moment().format("DD/MM/YYYY"));
    }
    else {
        txtcodigocompra.removeAttr("placeholder");        
        LeerCabecera();
        var detalle = JSON.parse(MODELO.jsondetalle);
        var subtotal = 0;
        var total = 0;
        var totaligv = 0;
        for (var i = 0; i < detalle.length; i++) {
           var fila= tbldetalle.row.add([
                '<bold>' + (i + 1) + '</bold>',
                detalle[i]["ID"],
                detalle[i]["IDPRODUCTO"],                
                detalle[i]["CODPRODUCTO"],
                detalle[i]["TIPOPRODUCTO"],
                detalle[i]["PRODUCTO"],
                parseFloat(detalle[i]["CANTIDAD"]).toFixed(2),
                parseFloat(detalle[i]["COSTO"]).toFixed(2),
               (parseFloat(detalle[i]["COSTOIGV"]) - parseFloat(detalle[i]["COSTO"])).toFixed(2),
               parseFloat(detalle[i]["COSTOIGV"]).toFixed(2),
               (parseFloat(detalle[i]["CANTIDAD"]) * parseFloat(detalle[i]["COSTO"])).toFixed(2),
                parseFloat(detalle[i]["SUBTOTAL"]).toFixed(2),
                detalle[i]["LOTE"],
                detalle[i]["FECHAVENCIMIENTO"],                
                detalle[i]["REGSANITARIO"]

            ]).draw(false).node();
            $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
            $(fila).find('td').eq(4).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(5).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(6).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(7).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(8).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(9).attr({ 'class': 'text-right' });
            $(fila).find('td').eq(10).attr({ 'class': 'text-right' });
            subtotal += parseFloat(detalle[i]["COSTO"]) * parseFloat(detalle[i]["CANTIDAD"]);
            total += parseFloat(detalle[i]["COSTOIGV"]) * parseFloat(detalle[i]["CANTIDAD"]);
            //console.log(total + ' - ' + subtotal + '->' + parseFloat(total - subtotal).toFixed(2) + '---' + totaligv.toFixed(2));
        }
        totaligv = REDONDEAR_2_DECIMALES(parseFloat(total - subtotal), 2);
        txtsubtotal.val(subtotal.toFixed(2));
        txtigv.val(totaligv.toFixed(2));
        txttotal.val(total.toFixed(2));
        txtcodigo.val(MODELO.idcompra);
        deshabilitarelementos();
    }
});
function deshabilitarelementos() {
    var ele;
    var frm = document.forms['formregistro'];
    for (var i = 0; ele = frm.elements[i]; i++)
        ele.disabled = true;
}
function LeerCabecera() {
    var cabecera = JSON.parse(MODELO.jsoncabecera);
    var impresion = JSON.parse(MODELO.jsondatosimpresion);
   
    txtfecha.val(cabecera[0]["FECHA"]);
    txtcodigocompra.val(cabecera[0]["CODIGOCOMPRA"]);
    txtidproveedor.val(cabecera[0]["IDPROVEEDOR"]);
    txtruc.val(cabecera[0]["RUC"]);
    txtrazonsocial.val(cabecera[0]["PROVEEDOR"]);
    VP_listarcontactos(cabecera[0]["IDPROVEEDOR"], cabecera[0]['IDCONTACTO']);
    cmbidmoneda.val(cabecera[0]["IDMONEDA"]);
    txtvalormoneda.val(cabecera[0]["VALORMONEDA"]);
    cmbsucursaldestino.val(cabecera[0]["IDSUCURSALDESTINO"]);
    txtresponsable.val(cabecera[0]["USUARIO"]);
    txtempresa.val(cabecera[0]["EMPRESA"]);
    txtsucursal.val(cabecera[0]["SUCURSAL"]);
    //PAGOS    
    txtidpago.val(cabecera[0]["IDPAGO"]);   
    cmbcomprobante.val(cabecera[0]["IDDOCUMENTO"]);    
    txtfechadoc.val(moment(cabecera[0]["FECHADOC"]).format("YYYY-MM-DD"));
    txtseriedoc.val(cabecera[0]["SERIEDOC"]);
    txtnumdoc.val(cabecera[0]["NUMDOC"]);
     
    
}

//INITIALIZAR LOS CAMPOS

//CRUD


//EVENTOS
$('#codigocompra').click(function () {
    alertaSwall("S", "MENSAJE1", "MENSAJE2");
});
$('#txtruc').click(function () {
    modallistaproveedores.modal();
});
$('#condicionigv').change(function () {
    obtenerIgvCompra();
});
function obtenerIgvCompra() {
    if (!condicionigv.prop('checked')) { igvp = 0; igvd = 0; }
    else { igvp = constanteigvp; igvd = constigvdecimal; }
    $('#spanporcentajeigv').html("IGV ("+igvp+"%)");
    //calcularmontos();
    calcularmontos_vvf();
}
//$('#btnguardar').click(function () {
//    GuardarCompra();
//});
$('#btnnuevo').click(function () {
    var confirmacion = confirmSwall("W", "¿Desea limpiar campos?", "", "Los datos se limpiaron correctamente", '');
        confirmacion.then((resolve) => {
            if (resolve) {
                $('#formregistro').trigger('reset');
                txtcodigo.val('');
                txtruc.val('');
                txtidproveedor.val('');
                limpiarcmbcontacto();
                cmbsucursaldestino.val('');
                tbldetalle.clear().draw(false);
                COMPRADETALLE = [];
                txtfecha.val(moment().format("DD/MM/YYYY"));            }
        });
});
function limpiarcmbcontacto() {
    $('#cmbcontacto option').remove();
    $('#cmbcontacto').append('<option value="">[SELECCIONE]</option>');
    cmbcomprobante.val('');
}
$('#idmoneda').change(function () { 
    txtvalormoneda.val($('#idmoneda option:selected').attr('monto'));
});
btnquitaritem.click(function (e) {
    var data = tbldetalle.row('.selected').data();
    var idproducto = data[2];
    tbldetalle.row('.selected').remove().draw(false);
    var index = encontrarIndexDetalle(idproducto);
    VPPP_eliminarproductoActualizar(idproducto);
    COMPRADETALLE.splice(index, 1);
    agregarItem();
    calcularmontos();
});
//EVENTOS DE TABLAS
$('#tbldetalle tbody').on('click', 'tr', function () { 
    VPPP_limpiarCamposPrecios();
    if ($(this).hasClass('selected')) {
        //$(this).removeClass('selected');
        //VPPP_limpiarCamposPrecios();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');        
        $(this).addClass('selected');                 
    }
    //obtener los datos
    let fila = $.map(tbldetalle.rows('.selected').data(), function (item) {
        return item[2]
    });
    //VPPP_buscarProductoxid(fila[0]);
    let costoigv = $(this).find('.txtcostoigv').val();
    VPPP_LlenarcamposProductoPrecios(fila[0], costoigv);    
});
$(document).on('click', '.btn-pasar-proveedor', function (e) {
    var auxidproveedor = txtidproveedor.val();    
    var columna = VP_tbllistaproveedor.row($(this).parents('tr')).data();   
    console.log(auxidproveedor);
    console.log(columna[0]);
    if (auxidproveedor == '' || auxidproveedor == columna[0]) {
        //console.log(auxidproveedor);
        cargardatosproveedor(columna);
        return;
    }
    if (auxidproveedor !== columna[0]) {
        var confirmacion = confirmSwall("W", "¿Desea cambiar de proveedor?", "", "Los datos se limpiaron correctamente",'');
        confirmacion.then((resolve) => {
            if (resolve) {
                cargardatosproveedor(columna)
            }
        });
    }
});
function cargardatosproveedor(columna) {
    tbldetalle.clear().draw(false);
    VP_listarcontactos(columna[0]);
    txtidproveedor.val(columna[0]);
    txtruc.val(columna[1]);
    txtrazonsocial.val(columna[2]);
    cmbidmoneda.val(columna[6]);
    txtvalormoneda.val($('#idmoneda option:selected').attr('monto'));
    modallistaproveedores.modal('hide');
    txtsubtotal.val(0.00);
    txtigv.val(0.00);
    txttotal.val(0.00);
}
//RegistrarEditar
$('#formregistro').submit(function (e) {
    e.preventDefault();
   
    var confirmacion = confirmSwall("I", "¿Desea guardar la compra?", "", "La compra se está guardando", '');

    confirmacion.then((resolve) => {
        if (resolve) {
            var objdetalle = obtenerDatosDetalle();
            if (objdetalle.length === 0) {
                alertaSwall("W", "No hay productos en su detalle compra", "");
               // mensaje("W", "BR", "No ha realizado ninguna compra");
                return;
            }
            var url = ORIGEN + "/Compras/Compra/RegistrarEditar";
            var obj = $('#formregistro').serializeArray();
            var operacion = 'editar';
            if (obj[0].value == 0) {
                operacion = 'nuevo';
                obj[obj.length] = { name: 'estado', value: 'HABILITADO' };
            }
            obj[obj.length] = { name: 'detalle', value: JSON.stringify(objdetalle) }
            obj[obj.length] = { name: 'pago.igv', value: parseFloat(igvp) };
            obj[obj.length] = { name: 'pago.estado', value: "HABILITADO" };
            obj[obj.length] = { name: 'listaproducto', value: JSON.stringify(PRODUCTOACTUALIZAR)};
            //console.log(PRODUCTOACTUALIZAR);
            btnguardar.prop('disabled', true);
            $.post(url, obj).done(function (data) {
                if (data.mensaje === "ok") {
                    if (operacion === "nuevo") {
                        alertaSwall("S", "Registro guardado", "");
                        //mensaje('S', 'BR', 'Registro guardado');
                        datos = data.objeto;
                        txtcodigo.val(datos.idcompra);
                        txtcodigocompra.val(datos.codigocompra);
                    } else if (operacion === "editar") {
                        alertaSwall("S", "Registro actualizado", "");
                        //mensaje('S', 'BR', 'Registro actualizado');
                    }
                } else {
                    alertaSwall("W", data.mensaje, "");
                    //mensaje('W', 'BR', data.mensaje);
                }
                btnguardar.prop('disabled', false);
            }).fail(function (e) {
                btnguardar.prop('disabled', false);                
                alertaSwall("D", e, "");
                //mensajeError(e);
            });
        }        
    });
    
});
var counter = 0;
$(document).on('click', '.btn-pasar-producto', function (e) {  
    var columna = MPL_tbllistaproductos.row($(this).parents('tr')).data();
    var pos = encontrarIndexDetalle(columna[0]);    
    if (pos > -1) {
        mensaje("I", "TR", "El producto ya está en el detalle");
        return;
    }
    counter++;
    //$('#modalproductosxlaboratorio').modal('hide');     
    var fila = tbldetalle.row.add([
        
        '<bold>1</bold>',
        '',
        columna[0],
        columna[1],
        columna[2],
        columna[3],
        `<input type="number" class="text-center txtcantidad inputselection" style="width:80px;" value="1" min="1"/>`,
        `<input type="number" class="text-center txtcosto inputselection" step="0.01" style="width:80px;" value="` + columna[5] + `" min="0" required/>`,
        `<input type="number" class="text-center txtigv" style="width:80px;" step="0.01" disabled value="` + columna[6] + `" min="0"/>`,
        `<input type="number" class="text-center txtcostoigv inputselection" step="0.01" style="width:80px;" value="` + columna[7] + `" min="0" required/>`,
        `<input type="number" class="text-center txtsubtotal" step="0.01" style="width:80px;" disabled value="` + columna[5] + `" min="0" required/>`,
        `<input type="number" class="text-center txttotal" step="0.01" style="width:80px;" disabled value="` + columna[5] + `" min="0" required/>`,
        `<input type="text" class="text-center txtlote" style="width:120px;" value="" required/>`,
        `<input type="date" class="text-center txtfechavence" style="width:125px;" value="" required/>`,
        `<input type="text" class="text-center txtregistrosanitario" style="width:120px;" value=""/>`
    ]).draw(false).node();
    $(fila).find('td').eq(0).attr({ 'class': 'sticky' });
    $(fila).find('td').eq(3).attr({ 'style': '30%' });
    tbldetalle.columns.adjust().draw();
    COMPRADETALLE.push(columna[0]);
    agregarItem();
    calcularmontos(); 
    
});

function encontrarIndexDetalle(idproducto) {
    var index = -1;
    for (var i = 0; i < COMPRADETALLE.length; i++) {
        if (COMPRADETALLE[i] === idproducto) {
            index = i;
            break;
        }
    }
    return index;
}

function agregarfilaDetalle(data) {
   /* var fila = tbldetalle.row.add([
        '<bold>1</bold>',
        '',
        columna[0],
        columna[1],
        columna[2],
        columna[3],
        `<input type="number" class="text-center txtcantidad" style="width:100px;" value="1" min="1"/>`,
        `<input type="number" class="text-center txtcostoigv" step="0.01" style="width:100px;" value="` + columna[5] + `" min="0" required/>`,
        //`<input type="number" class="text-center txtconstanteigv" style="width:100px;" value="` + constanteigv + `" min="0"/>`,
        `<input type="number" class="text-center txtsubtotal" step="0.01" style="width:100px;" disabled value="` + columna[5] + `" min="0" required/>`,
        `<input type="text" class="text-center txtlote" style="width:120px;" value="" required/>`,
        `<input type="date" class="text-center txtfechavence" style="width:125px;" value="" required/>`,
        `<input type="text" class="text-center txtregistrosanitario" style="width:120px;" value=""/>`
    ]).draw(false).node();*/
}

function agregarItem() {    
    var c = 0;
    var filas = document.querySelectorAll("#tbldetalle tbody tr bold");    
    filas.forEach(function (e) {
        e.textContent = (c + 1);
        c++;        
    });
}

function obtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var datatable = tbldetalle.rows().data();
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        detalle.iddetallecompra = (datatable[c][1] === '') ? '0' : datatable[c][0];
        detalle.idcompra = (txtcodigo.val() === '') ? '0' : txtcodigo.val(); 
        detalle.idproducto = datatable[c][2];
        detalle.cantidad = document.getElementsByClassName("txtcantidad")[c].value;
        detalle.costoigv = document.getElementsByClassName("txtcostoigv")[c].value;
        detalle.subtotal = document.getElementsByClassName("txttotal")[c].value;
        detalle.costo = (parseFloat(detalle.costoigv) / (1.0 + parseFloat(igvd))).toFixed(2);
        //detalle.igv = parseFloat(constanteigv / 100);
        detalle.stock = new StockProductoLote();
        detalle.stock.registrosanitario = document.getElementsByClassName("txtregistrosanitario")[c].value;
        detalle.stock.lote = document.getElementsByClassName("txtlote")[c].value;
        detalle.stock.fechavencimiento = document.getElementsByClassName("txtfechavence")[c].value;
        detalle.estado = 'HABILITADO';
        array[c] = detalle;
        c++;
    }); 
    return array;
}

$(document).on('keyup', '.txtcantidad', function () {
    var cantidad = $(this).val();    
    if (cantidad === '' || cantidad === 0) { cantidad = 1; $(this).val(1); }    
    calcularmontos();
});
$(document).on('keyup', '.txtcosto', function () {
    console.log($(this).val());
    var costo = $(this).val();
    if (costo === '' || costo === 0) { costo = 0; $(this).val(0); }
    calcularmontos_vvf();
});
$(document).on('keyup', '.txtcostoigv', function () {
    console.log($(this).val());
    var costoigv = $(this).val();
    if (costoigv === '' || costoigv === 0) { costoigv = 0; $(this).val(0); }
    calcularmontos();
});


$(document).on('change', '.txtcantidad', function () {
    var cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 1; $(this).val(1); }
    calcularmontos();
});
$(document).on('change', '.txtcosto', function () {
    console.log($(this).val());
    var costo = $(this).val();
    if (costo === '' || costo === 0) { costo = 0; $(this).val(0); }
    calcularmontos_vvf();
});
$(document).on('change', '.txtcostoigv', function () {
    console.log($(this).val());
    var costoigv = $(this).val();
    if (costoigv === '' || costoigv === 0) { costoigv = 0; $(this).val(0); }
    calcularmontos();
});
function calcularmontos() {
    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 0;
    var igv = 0
    var vvf = 0.0;
    var pvf = 0.0;
    var subtotalvvf = 0.0;
    var subtotalpvf = 0.0;
    var cantidad = 0.0;
    var subtotal = 0.0;
    var total = 0.0;
    var datatable = tbldetalle.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("txtcantidad")[c].value);
            if (isNaN(cantidad) || cantidad < 1) {
                document.getElementsByClassName("txtcantidad")[c].value = "1";
                cantidad = 1;
            }
            pvf = parseFloat(document.getElementsByClassName("txtcostoigv")[c].value);           
            vvf = pvf / (1 + parseFloat(igvd));
            igv = REDONDEAR_2_DECIMALES(pvf - vvf, 2).toFixed(2);
            subtotalpvf = cantidad * pvf;
            subtotalvvf = cantidad * vvf;
            total += subtotalpvf;
            subtotal += subtotalvvf;
            document.getElementsByClassName("txtigv")[c].value = REDONDEAR_2_DECIMALES(igv, 2).toFixed(2);
            document.getElementsByClassName("txtcosto")[c].value = REDONDEAR_2_DECIMALES(vvf, 2).toFixed(2);
            document.getElementsByClassName("txtsubtotal")[c].value = REDONDEAR_2_DECIMALES(subtotalvvf, 2).toFixed(2);
            document.getElementsByClassName("txttotal")[c].value = REDONDEAR_2_DECIMALES(subtotalpvf, 2).toFixed(2);
            c++;
        });
    //vvf precio de compra sin igv
    //pvf precio de compra con igv

    txtsubtotal.val(subtotal.toFixed(2));
    txtigv.val(REDONDEAR_2_DECIMALES(total - subtotal, 2).toFixed(2));
    txttotal.val(REDONDEAR_2_DECIMALES(total, 2).toFixed(2));
}
function calcularmontos_vvf() {

    var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 0;
    var igv=0
    var vvf = 0.0;
    var pvf = 0.0;
    var subtotalvvf = 0.0;
    var subtotalpvf = 0.0;
    var cantidad = 0.0;    
    var subtotal = 0.0;
    var total = 0.0;
    var datatable = tbldetalle.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("txtcantidad")[c].value);
            if (isNaN(cantidad) || cantidad < 1) {
                document.getElementsByClassName("txtcantidad")[c].value = "1";
                cantidad = 1;
            }
            vvf = parseFloat(document.getElementsByClassName("txtcosto")[c].value); 
            pvf = vvf * (1 + parseFloat(igvd));
            igv = REDONDEAR_2_DECIMALES(pvf - vvf, 2).toFixed(2);
            subtotalpvf = cantidad * pvf;
            subtotalvvf = cantidad * vvf;
            total += subtotalpvf;
            subtotal += subtotalvvf;
            document.getElementsByClassName("txtigv")[c].value = REDONDEAR_2_DECIMALES(igv, 2).toFixed(2);
            document.getElementsByClassName("txtcostoigv")[c].value = REDONDEAR_2_DECIMALES(pvf, 2).toFixed(2);
            document.getElementsByClassName("txtsubtotal")[c].value = REDONDEAR_2_DECIMALES(subtotalvvf, 2).toFixed(2);
            document.getElementsByClassName("txttotal")[c].value = REDONDEAR_2_DECIMALES(subtotalpvf, 2).toFixed(2);
            c++;
        });
    //vvf precio de compra sin igv
    //pvf precio de compra con igv

    txtsubtotal.val(subtotal.toFixed(2));
    txtigv.val(REDONDEAR_2_DECIMALES(total - subtotal, 2).toFixed(2));
    txttotal.val(REDONDEAR_2_DECIMALES(total, 2).toFixed(2));
}

//clases 
class CompraDetalle {
    constructor(iddetallecompra, idcompra, idproducto, cantidad, costo, costoigv, subtotal, estado, stock) {
        this.iddetallecompra = iddetallecompra;
        this.idcompra = idcompra;
        this.idproducto = idproducto;
        this.cantidad = cantidad;
        this.costo = costo;
        this.costoigv = costoigv;  
        this.subtotal = subtotal;  
        this.estado = estado;    
        this.stock = stock;
    }
}
class Compra {
    constructor(idcompra, codigocompra, idempleado, idproveedor, idcontacto, idsucursaldestino, valormoneda ,
        estado, tipooperacion, iddocumento, fechadoc, numdoc, seriedoc, idsucursal, idempresa, idmoneda) {
        this.idcompra = idcompra;
        this.codigocompra = codigocompra;
        this.idempleado = idempleado;
        this.idproveedor = idproveedor;
        this.idcontacto = idcontacto;
        this.idsucursaldestino = idsucursaldestino;
        this.estado = estado;
        this.tipooperacion = tipooperacion;
        this.iddocumento = iddocumento;
        this.fechadoc = fechadoc;
        this.numdoc = numdoc;
        this.seriedoc = seriedoc;
        this.idsucursal = idsucursal;
        this.idempresa = idempresa;
        this.idmoneda = idmoneda;
        

    }
}
class Pago {
    constructor(idpago, monto, idmoneda, valormoneda, estado, idcompra) {
        this.idpago = idpago;
        this.idcompra = idcompra;
        this.monto = monto;
        this.idmoneda = idmoneda;
        this.valormoneda = valormoneda;
        this.estado = estado;
    }
}
class StockProductoLote {
    constructor(idstock,iddetalletabla,tabla,idproducto,idsucursal,cantidad,cantidaddisponible,estado,lote,
fechavencimiento,registrosanitario) {
        this.idstock = idstock;
        this.iddetalletabla = iddetalletabla;
        this.tabla = tabla;
        this.idproducto = idproducto;
        this.idsucursal = idsucursal;
        this.cantidad = cantidad;
        this.cantidaddisponible = cantidaddisponible;
        this.estado = estado;
        this.lote = lote;
        this.fechavencimiento = fechavencimiento;
        this.registrosanitario = registrosanitario;

    }
}

function fnAcomodarTablas() {
    tbldetalle.columns.adjust().draw()
}
//mensaje 
/*
function confirmarcambioproveedor(tipo, titulo, descripcion, mensaje1, mensaje2) {
    var res = false;
    var btn = '';
    var icon = '';
    if (tipo === 'S') { btn = icon = 'success'; }
    if (tipo === 'D') { btn = 'danger'; icon = 'error'; }
    if (tipo === 'W') { btn = 'warning'; icon = 'warning'; }
    if (tipo === 'I') { btn = 'info'; icon = 'info'; }
    swal({
        title: titulo,
        text: descripcion,
        icon: icon,
        buttons: true,
        dangerMode: false,
    })
        .then((willChange) => {
            if (willChange) {
                tbldetalle.clear().draw(false);
                swal(mensaje1, {
                    icon: "success",
                });
                return true;
            } else {
                //swal(mensaje2);
            }
        });
    return res;
}
*/

var bPreguntar = true;

window.onbeforeunload = preguntarAntesDeSalir;

function preguntarAntesDeSalir() {
    if (bPreguntar)
        return "¿Seguro que quieres salir?";
}
