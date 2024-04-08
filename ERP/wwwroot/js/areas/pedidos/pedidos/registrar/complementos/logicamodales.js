var cmbuso = '<select class=" cmbuso" required><option value=""></option><option value="ORAL">ORAL</option><option value="EXTERNO">EXTERNO</option></select>';
var _ARRAYPRODUCTOS = [];
var _PRODUCTOSENDETALLE = [];
var MBP_cmblistaprecios = document.getElementById('MLScmblistapreios');
var cmbtipoformulacion = '<select style="font-size: smaller;" class=" cmbtipoformulacion" required><option value=""></option><option value="CANNABIS">CANNABIS</option><option value="VETERINARIA">VETERINARIA</option><option value="FORMULACION MAGISTRAL" selected>FORMULACION MAGISTRAL</option><option value="PRODUCTO TERMINADO">PRODUCTO TERMINADO</option></select>';

var cmbtipopedido = '<select style="font-size: smaller;" class="cmbtipopedido" id="cmbtipopedido" required="" name="idtipopedido"><option value="1">VENTA CON RECETA</option><option value="2">COMPLEMENTARIO FM</option><option value="3">TESTER DE VENTA</option><option value="5">COMPLEMENTARIO-TERCERO</option><option value="6">RECETA REPETIDA</option><option value="7">COMPLEMENTARIO PT</option><option value="8">CAMPAÑAS</option></select>';


btnbuscarorigenreceta.addEventListener('click', function () {
    $('#modalorigenreceta').modal('show');
    //if (txtidmedico.value == '')
    MORfnbuscarorigenreceta();
});

btnbuscarcliente.addEventListener('click', function () {
    //$('#modalcliente').modal('show');
    //EARTCOD1008.1
    if ($('#txtnombrescliente').val() == '') {
        $('#modalcliente').modal('show');
    } else {
        $('#contenedormensajepedidoModal').html(generarmodalmensaje());
        $('#mensajepedidoModal').modal('show');
    }
    //--EARTCOD1008.1
});

//EARTCOD1008.1
function generarmodalmensaje() {
    var modal =`
        <div class="modal fade" id="mensajepedidoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">MENSAJE</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        SI CAMBIA DE CLIENTE LOS ELEMENTOS AGREGADOS EN EL DETALLE DEL PEDIDO SE ELIMINARÁN, DESEA CONTINUAR?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="btnModalMensajeAceptar" onclick="btnModalMensajeAceptarClick()">ACEPTAR</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">CANCELAR</button>
                    </div>
                </div>
            </div>
        </div>`
    return modal;
}

function btnModalMensajeAceptarClick() {
    $('#tbldetalle tbody tr').remove();
    $('#lblsubtotal').html('');
    $('#lblpkdescuento').html('');
    $('#lbltotal').html(''); 
    $('#mensajepedidoModal').modal('hide');
    $('#modalcliente').modal('show');
}
//EARTCOD1008.1

btnbuscarpaciente.addEventListener('click', function () {
    $('#modalpaciente').modal('show');
});

btnbuscarmedico.addEventListener('click', function () {
    $('#modalmedico').modal('show');
});

btnimagen.addEventListener('click', function () {
    $('#modalsubirimagen').modal('show');
});

$(document).on('click', '.MORbtnseleccionaritem', function () {
    var fila = this.parentNode.parentNode;
    txtidorigenreceta.value = fila.getAttribute('id');;
    txtorigenreceta.value = fila.getElementsByTagName('td')[0].innerText;
    $('#modalorigenreceta').modal('hide');
    MMfnlistarmedicoByOrigenReceta(fila.getAttribute('id'));

});

$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = this.parentNode.parentNode.parentNode;
    //console.log(fila)
    txtidcliente.value = this.getAttribute('idcliente');
    //limpiar idcliente
    //this.removeAttribute('idcliente');

    txtdoccliente.value = fila.getElementsByTagName('td')[2].innerText;
    txtdoccliente.setAttribute('numdoc', fila.getElementsByTagName('td')[2].innerText);
    txtnombrescliente.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalcliente').modal('hide');

    fnBuscarDescuentoPorCliente(this.getAttribute('idcliente'));

});

$(document).on('click', '.MCPbtnseleccionarpaciente', function () {
    var fila = this.parentNode.parentNode.parentNode;
    //console.log(fila);
    txtidpaciente.value = this.getAttribute('idpaciente');
    txtdocpaciente.value = fila.getElementsByTagName('td')[1].innerText;
    txtdocpaciente.setAttribute('numdoc', fila.getElementsByTagName('td')[1].innerText);
    txtnombrepaciente.value = fila.getElementsByTagName('td')[2].innerText;
    $('#modalpaciente').modal('hide');
});

$(document).on('click', '.MMbtnpasarmedico', function () {
    var fila = this.parentNode.parentNode;
    txtidmedico.value = this.getAttribute('id');
    txtnumcolegiatura.value = fila.getElementsByTagName('td')[2].innerText;
    txtnombremedico.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalmedico').modal('hide');
});

//var IDLISTA = 0;
$(document).on('click', '.MLSbtnseleccionar', function () {
    var fila = this.parentNode.parentNode.parentNode;

    var idlista = fila.getAttribute('idlistaprecio');
    //IDLISTA = fila.getAttribute('idlista');
    var tipopro = fila.getElementsByClassName('tipoproducto')[0].innerText;
    MBP_lblnombreproductotablastock.text(fila.getElementsByClassName('nombre')[0].innerText);
    var idproducto = fila.getAttribute('idproducto');
    MBP_buscarstock(idproducto, null, cmbsucursalfactura.value);


    //let controller = new ListaPreciosController();
    //BLOQUEARCONTENIDO('modallistaprecios', 'Buscando producto ...');
    //controller.BuscarProductoByItemLista(idlista, fnagregaritemfm, function () {
    //    DESBLOQUEARCONTENIDO('modallistaprecios');
    //});

});

$(document).on('click', '.MBP_seleccionarstock', function (e) {
    var idstock = this.getAttribute('idstock');
    //MPTEMPORAL
    //console.log("ESTE ES EL ID DEL STOCK");
    //console.log(idstock);
    fnbuscarstock(idstock);
});

$(document).on('click', '.MLCbtnseleccionar', function (e) {
     
    var fila = $(this).parents('tr')[0];
    var filatr = '';
    var input = '<input style="width:50%" value="1" class="text-center txtcantidad font-14" type="number"  min="1" max="999" required/>';
    var cmbaux = '';

    if (fila.getElementsByClassName('tipoproducto')[0].innerText == 'FM')
        cmbaux = cmbuso;
    filatr += '<tr idprecioproducto=' + fila.getAttribute('idlistaprecio') + ' idproducto=' + fila.getAttribute('idproducto') +
        ' codigoprecio="' + fila.getElementsByClassName('codigoproducto')[0].innerText + '">';
    filatr += '<td></td>';
    filatr += '<td></td>';
    filatr += '<td class="formula" contenteditable="true">' + fila.getElementsByClassName('etiqueta')[0].innerText + '</td>';
    filatr += '<td class="tipoitem">' + fila.getElementsByClassName('tipoproducto')[0].innerText + '</td>';
    filatr += '<td  class="precio text-right">' + fila.getElementsByClassName('precio')[0].innerText + '</td>';
    filatr += '<td class="text-center ">' + input + '</td>';
    filatr += '<td ></td>';
    filatr += '<td  class="descuento">0</td>';
    filatr += '<td class="subtotal text-right"></td>';
    filatr += '<td >' + cmbaux + '</td>';
    filatr += '<td ><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
    filatr += '</tr>';
    $("#tbodydetalle").append(filatr);
    fncalculartotal();
    $('#modallistacliente').modal('hide');
});
//ACTUALIZACION
txtdoccliente.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (txtdoccliente.value.length >= 8) {
            fnBuscarClientePorNumDoc(txtdoccliente.value);
        }

    }
});
function fnBuscarClientePorNumDoc(numdoc) {
    let controller = new ClienteController();
    var obj = {
        top: 20,
        filtro: numdoc
    };
    controller.BuscarClientes(obj, function (data) {
        console.log(data);
        if (data.length > 0) {
            txtidcliente.value = data[0].idcliente;
            txtdoccliente.value = data[0].numdocumento;
            txtdoccliente.setAttribute('numdoc', data[0].numdocumento);
            txtnombrescliente.value = data[0].nombrecompleto;
            txtnumcolegiatura.value = data[0].nroC;
            txtidmedico.value = data[0].idmedico;
            txtnombremedico.value = data[0].Medico;

            if (data[0].flagpaciente == "1") {
                txtidpaciente.value = data[0].idpaciente;
                txtdocpaciente.value = data[0].numdocumento;
                txtdocpaciente.setAttribute('numdoc', data[0].numdocumento);
                txtnombrepaciente.value = data[0].nombrecompleto;

            } else {
                txtidpaciente.value = "";
                txtdocpaciente.value = "";
                txtdocpaciente.setAttribute('numdoc', "");
                txtnombrepaciente.value = "";
            }
            fnBuscarDescuentoPorCliente(data[0].idcliente);
        } else {
            txtnombrescliente.value = '';
            txtdoccliente.setAttribute('numdoc', '');
            txtdoccliente.value = '';
            txtidcliente.removeAttribute('value');
        }
    });
}
//ACTUALIZACION
txtdocpaciente.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (txtdocpaciente.value.length >= 1) {
            fnBuscarPacientePorNumDoc(txtdocpaciente.value);
        }
    }
});
function fnBuscarPacientePorNumDoc(numdoc) {
    let controller = new PacienteController();
    controller.BuscarxDocumento(numdoc, function (data) {
        console.log(data);
        if (data['mensaje'] == 'ok') {
            txtidpaciente.value = data['objeto'].idpaciente;
            txtdocpaciente.value = data['objeto'].numdocumento;
            txtdocpaciente.setAttribute('numdoc', data['objeto'].numdocumento);
            txtnombrepaciente.value = data['objeto'].nombres + ' ' + data['objeto'].apepaterno + ' ' + data['objeto'].apematerno;
        } else {
            txtidpaciente.value = '';
            txtdocpaciente.value = '';
            txtdocpaciente.setAttribute('numdoc', '');
            txtnombrepaciente.value = '';
        }
    });
}

txtnumcolegiatura.addEventListener('keydown', function (e) {

    if (e.key === 'Enter') {
        if (txtnumcolegiatura.value.length >= 1) {
            let controller = new MedicoController();
            var obj = {
                numcolegio: txtnumcolegiatura.value,
                idcolegio: cmbtipodocmedico.value
            };
            console.log(obj);
            controller.BuscarMedicoByNumColegio(obj, function (data) {
                if (data.mensaje == 'ok') {
                    data = data.objeto;
                    txtidmedico.value = data.idmedico;
                    txtnumcolegiatura.value = data.nrocolegiatura;
                    txtnombremedico.value = data.nombres + ' ' + data.apepaterno + ' ' + data.apematerno;
                } else {
                    txtidmedico.value = '';
                    txtnumcolegiatura.value = '';
                    txtnombremedico.value = '';
                }
            });
        }

    }
});

$(document).on('click', '.isfraccion', function () {

    var fila = this.parentNode.parentNode;
    var idstock = fila.getAttribute('idstock');

    var txtcantidad = fila.getElementsByClassName('txtcantidad')[0];
    var obj = _ARRAYPRODUCTOS.find(x => x.idstock == idstock);
    //if (obj == null)
    //    this.checked = (!this.checked);
    if (this.checked) {

        fila.getElementsByClassName('precio')[0].innerText = parseFloat(obj.precioxfraccion).toFixed(2);
        txtcantidad.setAttribute('max', obj.maxfraccion);
    }
    else {
        //if (obj.maxcaja == 0)
        //    this.checked = true;
        if (txtcantidad.value > obj.maxcaja)
            txtcantidad.value = obj.maxcaja;
        fila.getElementsByClassName('precio')[0].innerText = parseFloat(obj.precio).toFixed(2);
        txtcantidad.setAttribute('max', obj.maxcaja);
    }
    fncalculartotal();

});

MCC_formregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    MCC_fnregistrar(function (data) {
        txtdoccliente.value = data.nrodocumento;
        txtdoccliente.setAttribute('numdoc', data.nrodocumento);
        //txtdoccliente.setAttribute('numdoc', '');
        document.getElementById('MCC_txtcodigo').value = '';
        data.apematerno = data.apematerno == null ? "" : data.apematerno;
        data.apepaterno = data.apepaterno == null ? "" : data.apepaterno;
        txtnombrescliente.value = data.descripcion + " " + (data.apepaterno ?? '') + " " + data.apematerno ?? '';
        txtidcliente.value = data.idcliente;
        MCC_formregistro.reset();
        fnBuscarDescuentoPorCliente(data.idcliente);
        $('#modalcliente').modal('hide');
    });
});

MCPformregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    MCPfnregistrar(function (data) {
        txtdocpaciente.value = data.numdocumento;
        txtdocpaciente.setAttribute('numdoc', data.numdocumento);
        document.getElementById('MCPtxtcodigo').value = '';
        txtnombrepaciente.value = data.nombres + " " + (data.apepaterno ?? '') + " " + data.apematerno ?? '';
        txtidpaciente.value = data.idpaciente;
        MCPformregistro.reset();
        $('#modalpaciente').modal('hide');
    });
});

$(document).on('keyup', '.txtcantidad', function (e) {
    var fila = this.parentNode.parentNode;
  
    fneventostxtcantidad(this);
});

txtnumproforma.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        if (txtnumproforma.value != '') {
            let controller = new ProformaController();
            var obj = {
                codigo: txtnumproforma.value,
                rangodias: 10
            };
            controller.GetProformaParaPedido(obj, (data) => {

                var cabecera = JSON.parse(data[0].CABECERA)[0];
                var detalle = JSON.parse(data[0].DETALLE);
                txtidcliente.value = cabecera.idcliente ?? '';
                txtdoccliente.value = cabecera.numdoccliente ?? '';
                txtnombrescliente.value = cabecera.nombrecliente ?? '';
                txtidpaciente.value = cabecera.idpaciente??'';
                txtdocpaciente.value = cabecera.docpaciente ?? '';
                txtnombrepaciente.value = cabecera.paciente ?? '';
                txtidmedico.value = cabecera.idmedico ?? '';
                txtnombremedico.value = cabecera.medico ?? '';
                txtnumcolegiatura.value = cabecera.colegiatura ?? '';
                txtidorigenreceta.value = cabecera.idorigenreceta ?? '';
                txtorigenreceta.value = cabecera.origenreceta ?? '';
                tbodydetalle.innerHTML = '';
                var fila = '';
                var checkfracion = '';
                for (var i = 0; i < detalle.length; i++) {
                  
                    detalle[i].datosstock = detalle[i].datosstock ?? [];
                    var objstock = detalle[i].datosstock[0];
                    if (objstock == undefined || objstock == null) {//validacion para proformas sin idstock
                        objstock = {
                            maxcaja: 100,              
                        }
                    }
                  
                    _ARRAYPRODUCTOS.push(objstock);
                    var stock = objstock.maxcaja;
                    if (detalle[i].isfraccion) {
                        stock = objstock.maxfraccion;
                        checkfracion = '<input   class="isfraccion" type="checkbox"   checked/>';

                    } else {
                        if (detalle[i].multiplo === 1 || detalle[i].multiplo === 0 || detalle[i].multiplo === null)
                            checkfracion = '';
                        else if (detalle[i].idtipoproducto == 'PT' && detalle[i].multiplo > 0)
                            checkfracion = '<input   class="isfraccion" type="checkbox"  />';
                    }
                    var input = '<input style="width:50%" value="' + detalle[i].cantidad + '" class="text-right txtcantidad font-14" type="number"  min="1" max="' + stock + '" required/>';
                    var formulacion = detalle[i].formulacion ?? '';
                     
                    if (formulacion == '')
                        formulacion = detalle[i].producto;
                    fila += '<tr role="row" idprecioproducto=' + (detalle[i].idprecioproducto ?? '') + ' idproducto=' + (detalle[i].idproducto ?? '') + ' codigoprecio="' + detalle[i].codigoproducto + '" idstock="' + (detalle[i].idstock??'') + '">';
                    fila += '<td></td>';
                    fila += '<td>' +  '</td>';
                    fila += '<td class="formula" contenteditable="true">' + detalle[i].formulacion + '</td>';
                    fila += '<td class="tipoitem">' + detalle[i].idtipoproducto + '</td>';
                    fila += '<td  class="precio text-right">' + (detalle[i].precioigv).toFixed(2) + '</td>';
                    fila += '<td class="text-center ">' + input + '</td>';
                    fila += '<td >' + checkfracion + '</td>';
                    fila += '<td  class="descuento">0</td>';
                    fila += '<td class="subtotal text-right"></td>';
                    fila += '<td >' + (detalle[i].idtipoproducto == 'FM' ? cmbuso : '') + '</td>';
                    fila += '<td class="text-center align-middle tpform">' + cmbtipoformulacion + '</td>';
                    fila += '<td class="text-center align-middle ">' + cmbtipopedido + '</td>';
                    fila += '<td ><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
                    fila += '</tr>';
                }

                $("#tbodydetalle").append(fila);
                fncalculartotal();
            });
        }
    }
});

btnhistorial.addEventListener('click', function () {
  
    if (txtidcliente.value != '') {
        MHPlbltipo.innerText = ' CLIENTE ';
        MHPlblnombre_cli_pac.innerText = txtnombrescliente.value;
        $('#modalhistorialpedido').modal('show');
        MHPtxtidpaccli.value = txtidcliente.value;
    } else if (txtidpaciente.value != '') {
        MHPlbltipo.innerText = ' PACIENTE ';
        MHPlblnombre_cli_pac.innerText = txtnombrepaciente.value;
        $('#modalhistorialpedido').modal('show');
        MHPtxtidpaccli.value = txtidpaciente.value;
    }
    else {
        mensaje('W','Seleccione cliente o paciente')
        return;
    }
    fnMHPlistarhistorial();
});

function fnagregaritemfm(obsequio, data, idstockbonif, cantidad) {
    //fneliminaritemdebonificacion(idstockbonif);
    
    _ARRAYPRODUCTOS.push(data);
   
    var fila = '';
    var fraccion = '';
    var cmbaux = '';
    var checkfracion = '';
    var precio = 0;
    if (obsequio.isfraccion == false) {
        precio = data.precio;
    }
    else {
        precio = data.precioxfraccion;
    }
    var desc = obsequio.descuento / 100;
    var preciod = 0;

    if (desc < 1) {
        preciod = precio * (desc);
    } else {
        preciod = precio * (0);

    }
     
    if (obsequio.isfraccion)
        checkfracion = '<input disabled  class="isfraccion" type="checkbox"  checked  />';
    var input = '<input disabled style="width:50%" value="' + cantidad + '" class="text-center txtcantidad font-14" type="number"  min="1" readonly/>';

    
    if (data.idtipoproducto == 'FM')
        cmbaux = cmbuso;
    fila += '<tr role="row" class="even table-success selected" idprecioproducto=' + data.idprecioproducto + ' idproducto=' +
        data.idproducto + ' codigoprecio=' + data.codigoproducto + ' idstock=' + data.idstock + ' idstockbonificacion=' +
        idstockbonif + ' tipo="bonificacion">';
    fila += '<td></td>';
    fila += '<td></td>';
    fila += '<td class="formula" contenteditable="true">' + data.nombre + '</td>';
    fila += '<td class="tipoitem">' + data.idtipoproducto + '</td>';
    fila += '<td  class="precio text-right">' + preciod+'</td>';
    fila += '<td class="text-center" >' + input+'</td>';
    fila += '<td >' + checkfracion + '</td>';
    fila += '<td  class="descuento">' + obsequio.descuento+'%</td>';
    fila += '<td class="subtotal text-right">' + preciod*cantidad+'</td>';
    fila += '<td >' + cmbaux + '</td>';
    fila += '<td class="text-center align-middle tpform">' + cmbtipoformulacion + '</td>';
    fila += '<td class="text-center align-middle ">' + cmbtipopedido + '</td>';
    fila += '<td ><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
    fila += '</tr>';
    $("#tbodydetalle").append(fila);
    fncalculartotal();
}

function fnbuscarstock(idstock) {
    let controller = new StockController();
    var obj = {
        idstock: idstock,
        idlista: MLScmblistapreios.value,//IDLISTA,
        canalventa: $('#cmbcanalventas').val(),
        sucursal_reg: idsucursal_registra,
        idcliente: $('#txtidcliente').val()//EARTCOD1008 **
    };
    //console.log('esta es la idsucursal ' + idsucursal_registra);
    //MPTEMPORAL
    //console.log("AQUI ESTA EL OBJETO");
    //console.log(obj);
    BLOQUEARCONTENIDO('modallotes', 'Buscando datos ...');
    controller.GetStockProductosParaVenta(obj, function (data) {
        //$('#modallistaprecios').modal('hide');
        $('#modallotes').modal('hide');
        DESBLOQUEARCONTENIDO('modallotes');

        data = data[0];
        //console.log(data);
        _PRODUCTOSENDETALLE.push(data);
        var cmbaux = '';
        if (data.idtipoproducto == 'FM')
            cmbaux = cmbuso;

        _ARRAYPRODUCTOS.push(data);
        var stock = data.maxcaja;
        var precio = data.precio;
        var checkfracion = '';

        if (data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null)
            checkfracion = '';
        else if (data.idtipoproducto == 'PT')
            checkfracion = '<input   class="isfraccion" type="checkbox"    multiplo="' + data.multiplo + '"/>';
        if (stock === 0) {
            stock = data.maxfraccion;
            if (data.precioxfraccion.toString() === '' || data.precioxfraccion === null)
                precio = (REDONDEAR_DECIMALES(data.precio / data.multiplo, 2));
            else
                precio = REDONDEAR_DECIMALES(data.precioxfraccion, 2);
            if (!(data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null) && data.idtipoproducto == 'PT')
                checkfracion = '<input   class="isfraccion" type="checkbox" checked   multiplo="' + data.multiplo + '"/>';
        } else {
            if (!(data.multiplo === 1 || data.multiplo === 0 || data.multiplo === null) && data.idtipoproducto == 'PT')
                checkfracion = '<input   class="isfraccion" type="checkbox"   multiplo="' + data.multiplo + '"/>';
        }
        //var input = '<input style="width:50%" value="1" class="text-center txtcantidad font-14" type="number"  min="1" max="' + stock + '" required/>';
        var input = '<input style="width:70%" value="1" class="text-center txtcantidad font-14 cantidadeventchange" type="number"  min="1" max="' + stock + '" required/>';//EARTCOD1009


        var fila = '';

        fila += '<tr role="row" idprecioproducto=' + data.idprecioproducto + ' idproducto=' + data.idproducto + ' codigoprecio="' + data.codigoproducto + '" idstock="' + data.idstock + '">';
        
        var otrosdatos = '<td><div class="btn-group btn-group-sm">';
        var tooltip = 'data-toggle="tooltip" data-placement="top" title="Tiene bonificación a cliente"';
        //otrosdatos += (data.oferta != '0' ? '<button ' + tooltip + ' class="btn btn-sm btn-sucess addtooltip" type="button"><i class="text-success fas fa-gift"></i></button>' : '');
        //->EARTCOD1021
        if (data.oferta != '0') {
            otrosdatos += '<button ' + tooltip + ' class="btn btn-sm btn-sucess addtooltip" type="button"><i class="text-success fas fa-gift"></i></button>';
        } else {
            //if (data.oferta_obsequio != '0') {
            //    tooltip = 'data-toggle="tooltip" data-placement="top" title="Tiene aplicado un obsequio por monto"';
            //    otrosdatos += '<button ' + tooltip + ' class="btn btn-sm btn-sucess addtooltip btnBuscarPromoObsequio" type="button"><i class="text-danger fas fa-gift"></i></button>';
            //} else {
            //    otrosdatos += '';
            //}
        }
        //<-EARTCOD1021

        var descuento = fnverificarsitienedescuento(data.tienedescuento ?? 'x');
        var estadoDescuentoCliente = true;
        var arrayDescuentosCumpleValidacionYMayor = [];
        for (let i = 0; i < arrayDescuentoDelCliente.length; i++) {
            estadoDescuentoCliente = true;

            var canalesventa = arrayDescuentoDelCliente[i].canalesventa.split(",");
            var validarCanalVenta = canalesventa.find((x) => x == cmbcanalventas.value);
            if (validarCanalVenta == undefined) estadoDescuentoCliente = false;

            var productostipo = arrayDescuentoDelCliente[i].productostipo.split(",");
            var validarProductoTipo = productostipo.find((x) => x == data.idtipoproducto);
            if (validarProductoTipo == undefined) estadoDescuentoCliente = false;

            var sucursales = arrayDescuentoDelCliente[i].sucursales.split(",");
            var validarSucursal = sucursales.find((x) => x == IDSUCURSAL);
            if (validarSucursal == undefined) estadoDescuentoCliente = false;

            if (estadoDescuentoCliente) {
                if (arrayDescuentosCumpleValidacionYMayor[0] == undefined) {
                    arrayDescuentosCumpleValidacionYMayor[0] = arrayDescuentoDelCliente[i];
                } else {
                    if (arrayDescuentoDelCliente[i].descuentocanal > arrayDescuentosCumpleValidacionYMayor[0].descuentocanal) {
                        arrayDescuentosCumpleValidacionYMayor[0] = arrayDescuentoDelCliente[i];
                    }
                }
            }
        }

        //TEMPORAL
        //console.log("este es el descuento");
        //console.log(descuento);
       
        //si el producto tiene descuento
        if (descuento[0] == 'uno' || descuento[0] == 'dos') {
            tooltip = 'data-toggle="tooltip" data-placement="top" title="Tiene descuento"';
            otrosdatos += '<button ' + tooltip + '  class="btn btn-sm btn-sucess addtooltip btndescuento" type="button"><i class="text-success fas fa-tags"></i></button>';
        }
        otrosdatos += '</div></td>';
        var ds = 0;
        //if (descuento[0] != 'x') ds = descuento[0];//if anterior
        //if modificado para filtrar por canal ventas
        if (descuento[0] != 'x' && data.canalventa != 'NINGUNO') {
            ds = descuento[0];
        }

        if (arrayDescuentosCumpleValidacionYMayor.length > 0) {
            if (descuento[0] != "x") {
                if (descuento[0] > arrayDescuentosCumpleValidacionYMayor[0].descuentocanal) {
                    ds = descuento[0];
                } else {
                    ds = arrayDescuentosCumpleValidacionYMayor[0].descuentocanal;
                }
            } else {
                ds = arrayDescuentosCumpleValidacionYMayor[0].descuentocanal;
            }
        }

        var monto = 0;
        monto = ((precio == 0.01) ? 0 : precio).toFixed(2);
        var desc = (monto - ((monto * (ds / 100)).toFixed(2))).toFixed(2);
        //console.log(desc);
        fila += otrosdatos;
        fila += '<td>'+ '</td>';
        fila += '<td class="formula align-middle" contenteditable="true">' + data.nombre + '</td>';
        fila += '<td class="tipoitem align-middle">' + data.idtipoproducto + '</td>';
        fila += '<td class="precio text-right align-middle">' + monto + '</td>';
        fila += '<td class="text-center align-middle">' + input + '</td>';
        fila += '<td class="text-center align-middle">' + checkfracion + '</td>';
        fila += '<td class="descuento align-middle">'+ds+'</td>';
        fila += '<td class="subtotal text-right align-middle">' + desc + '</td>';
        fila += '<td class="subtotal text-right align-middle" style="display:none;">' + '<input id="subtotal" class="subtotaleventchange" type="hidden" value="' + desc + '">' + '</td>'; //EARTCOD1021
        fila += '<td class="text-center align-middle">' + cmbaux + '</td>';
        fila += '<td class="text-center align-middle tpform">' + cmbtipoformulacion + '</td>';
        fila += '<td class="text-center align-middle ">' + cmbtipopedido + '</td>';
        fila += '<td class="text-center align-middle"><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
        fila += '</tr>';
        $("#tbodydetalle").append(fila);
        fncalculartotal();

        PromoProductoBuscarObsequio(idstock);
    }, function () { DESBLOQUEARCONTENIDO('modallotes'); });
}



$(document).on('paste', '.formula', function (e) {
    e.preventDefault();  // Detiene el pegado predeterminado
    var text = e.originalEvent.clipboardData.getData('text/plain');  // Obtiene el texto plano del portapapeles

    // Elimina cualquier tipo de espacio extra (saltos de línea, tabulaciones, etc.)
    text = text.replace(/\s+/g, " ").trim();

    document.execCommand("insertText", false, text);  // Inserta el texto plano en el contenido editable
});



function fneventostxtcantidad(event) {
    var cantidad = $(event).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 0; /*$(event).val(1);*/ }
    var maximo = $(event).attr('max');

    if (parseInt(cantidad) <= parseInt(maximo))
        fncalculartotal();
    else {
        $(event).val(maximo);
        fncalculartotal();
        mensaje('W', 'El stock disponible de este producto es ' + maximo);
    }

}

$(document).on('click', '.MHPbtncargarpedido', function () {
    var fila = this.parentNode.parentNode;
    var idpedido = fila.getAttribute('idpedido');
    let controller = new PedidoController();
    BLOQUEARCONTENIDO('modalhistorialpedido', 'Buscando pedido');
    controller.BuscarPedidoCompleto(idpedido, function (data) {
        DESBLOQUEARCONTENIDO('modalhistorialpedido');
        fncargardatapedido(data);
    }, () => { DESBLOQUEARCONTENIDO('modalhistorialpedido'); });
})

function fncargardatapedido(data) {
    $('#modalhistorialpedido').modal('hide');
    data = data.pedido[0];
    var cabecera = JSON.parse(data.cabecera)[0];
    var detalle = JSON.parse(data.detalle);
    console.log(cabecera);
    console.log(detalle);

    txtidcliente.value = cabecera.idcliente ?? '';
    txtdoccliente.value = cabecera.doccliente ?? '';
    txtnombrescliente.value = cabecera.cliente ?? '';
    txtidpaciente.value = cabecera.idpaciente ?? '';
    txtdocpaciente.value = cabecera.docpaciente ?? '';
    txtnombrepaciente.value = cabecera.paciente ?? '';
    txtidmedico.value = cabecera.idmedico ?? '';
    txtnombremedico.value = cabecera.medico ?? '';
    txtnumcolegiatura.value = cabecera.cmp ?? '';
    txtidorigenreceta.value = cabecera.idorigenreceta ?? '';
    txtorigenreceta.value = cabecera.origenreceta ?? '';
    cmbtipopaciente.value = cabecera.idtipopaciente;
    tbodydetalle.innerHTML = '';

    var validardetalle_idstock = false;
    var fila = '';
    var checkfracion = '';
    for (var i = 0; i < detalle.length; i++) {
        if (!detalle[i].idproducto || !detalle[i].idstock)
            validardetalle_idstock = true;
        detalle[i].datosstock = detalle[i].datosstock ?? [];
        var objstock = detalle[i].datosstock[0];
        if (objstock == undefined || objstock == null) {//validacion para proformas sin idstock
            objstock = {
                maxcaja: 100,
            }
        }

        _ARRAYPRODUCTOS.push(objstock);
        var stock = objstock.maxcaja;
        if (detalle[i].isfraccion) {
            stock = objstock.maxfraccion;
            checkfracion = '<input   class="isfraccion" type="checkbox"   checked/>';

        } else {
            if (detalle[i].multiplo === 1 || detalle[i].multiplo === 0 || detalle[i].multiplo === null)
                checkfracion = '';
            else if (detalle[i].tipoitem == 'PT' && detalle[i].multiplo > 0)
                checkfracion = '<input   class="isfraccion" type="checkbox"  />';
        }
        var input = '<input style="width:50%" value="' + detalle[i].cantidad + '" class="text-right txtcantidad font-14" type="number"  min="1" max="' + stock + '" required/>';
        var formulacion = detalle[i].formula ?? '';
         
        if (formulacion == '')
            formulacion = detalle[i].producto;
        fila += '<tr role="row" idprecioproducto="' + (detalle[i].idprecio ?? '') + '" idproducto="' + (detalle[i].idproducto ?? '') + '" codigoprecio="' + detalle[i].codigoproducto + '" idstock="' + (detalle[i].idstock ?? '') + '">';
        fila += '<td></td>';
        fila += '<td></td>';
        fila += '<td class="formula" contenteditable="true">' + detalle[i].formula + '</td>';
        fila += '<td class="tipoitem">' + detalle[i].tipoitem + '</td>';
        fila += '<td  class="precio text-right">' + (detalle[i].precio).toFixed(2) + '</td>';
        fila += '<td class="text-right ">' + input + '</td>';
        fila += '<td >' + checkfracion + '</td>';
        fila += '<td  class="descuento">0%</td>';
        fila += '<td class="subtotal text-right"></td>';
        fila += '<td >' + (detalle[i].tipoitem == 'FM' ? cmbuso : '') + '</td>';
        fila += '<td class="text-center align-middle tpform">' + cmbtipoformulacion + '</td>';
        fila += '<td class="text-center align-middle ">' + cmbtipopedido + '</td>';
        fila += '<td ><button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button></td>';
        fila += '</tr>';
    }

    $("#tbodydetalle").append(fila);
    fncalculartotal();
    if (validardetalle_idstock)
        alertaSwall('I', 'El pedido fue registrado en el sistema GDP, no podrá ser facturado a través de SISQF(módulo de ventas)', '');
}

$(document).on('keyup', '.txtcantidad', function (e) {
    var fila = this.parentNode.parentNode;
    var tipo = fila.getAttribute('tipo');
    if (tipo != 'bonificacion')
        fneventostxtcantidad(this);
    if (e.key == 'Enter') {
        if (tipo == 'descuento') {
            MDfncalcularmontosdescuento(fila);
        } else
            fncalcularbonificacion(this,'pedido');
    }
});

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

    fncalcularbonificacion(event.parentNode.parentNode.getElementsByClassName('cantidad_detalle')[0],'pedido');
    fncalcularmontos();
}

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

$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        //console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


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


/*DESCUENTO POR CLIENTE*/
var arrayDescuentoDelCliente = [];
function fnBuscarDescuentoPorCliente(idcliente) {
    let obj = { idcliente: idcliente };
    let controller = new DescuentoController();
    controller.BuscarDescuentoPorCliente(obj, function (data) {
        arrayDescuentoDelCliente = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                arrayDescuentoDelCliente.push(data[i]);
            }
        }
    });
}