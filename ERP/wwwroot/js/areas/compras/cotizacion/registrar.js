//var btnsiguiente1 = document.getElementById('btnsiguiente1');
var tabtipo = document.getElementById('tab-tipo');
var tabproforma = document.getElementById('tab-proforma');
var tbllista;
var tbldetalledrogueria;
var btnguardar = $('#btnguardar');
var btnnuevo = document.getElementById('btnnuevo');
var txtidproveedor = $('#txtidproveedor');
var txtrucproveedor = $('#txtrucproveedor');
var txtrazonsocial = $('#txtrazonsocial');
var txttelefonoproveedor = $('#txttelefonoproveedor');

var txtnombrescontacto = $('#txtnombrescontacto');
var txttelefonocontacto = $('#txttelefonocontacto');
var txtcelularcontacto = $('#txtcelularcontacto');

var txtnombresrepresentante = $('#txtnombresrepresentante');
var txttelefonorepresentante = $('#txttelefonorepresentante');
var txtcelularrepresentante = $('#txtcelularrepresentante');

var txtidcotizacion = $('#txtidcotizacion');
var txtcambiomoneda = $('#txtcambiomoneda');
var txtcodigocotizacion = $('#txtcodigocotizacion');
var txtidmoneda = $('#txtidmoneda');
var txtmoneda = $('#txtmoneda');
var cmbmoneda = $('#cmbmoneda');
var txtestado = $('#txtestado');
var txtfechavencimiento = $('#txtfechavencimiento');
var txttipocotizacion = $('#txttipocotizacion');
var cmbtipoproforma = $('#cmbtipoproforma');
var classidproveedor = $('.idproveedor');
var classrazonproveedor = $('.razonproveedor');
var codigoproveedor = $('#codigoproveedor');
var cmbicoterms = $('#cmbicoterms');
var txtidcontacto = $('#txtidcontacto');
var txtidrepresentante = $('#txtidrepresentante');
var cmbcondicionpago = $('#cmbcondicionpago');
var cmbtipopago = $('#cmbtipopago');

var cmbvendedor = $('#cmbvendedor');
var cmbrepresentante = $('#cmbrepresentante');
var rdvendedor = $('#rdvendedor');
var rdrepresentante = $('#rdrepresentante');
var divregistroproductoterminado = $('#divregistroproductoterminado');
var divregistrodeinsumoeconomatoembalaje = $('#divregistrodeinsumoeconomatoembalaje');
var divrepresentante = $('#divrepresentante');
var divcontacto = $('#divcontacto');
var divproveedor = $('#divproveedor');
var divicoterms = $('#divicoterms');
var cmbtipoproducto = $('#cmbtipoproducto');
var chkConIgv = document.getElementById("chkConIgv");
var _INDEX = 0;
var _ROWCOLUMN = 0;
var _ARRAYBONIFICACIONES = [];
var _ARRAYELIMINADOS = [];
//variables del script
var _DES1Pro = 0.0;

var array_retornoModalBoni = [];

var numDecimales = 2;
var igvLocal = 0.18;
var unidadMedida = []; //FSILVA
var objUnidadMedida;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = false;
    datatable.paging = false;
    datatable.ordering = false;
    datatable.buttons = [];

    //Cargar con las unidades de medida - FSILVA
    let controller = new CotizacionController();
    controller.CargarUnidadMedida((data) => { unidadMedida = data });
    //controller.ListarDificultad('HABILITADO', (data) => { _dificultadformula = data });

    datatable.columnDefs = [
        {
            "targets": [0],
            "visible": false,
            "searchable": false
        },
    ];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);

    if (MODELO.idcotizacion != 0) {
        fnBuscarProforma(MODELO.idcotizacion);
    } else {
        var fechaa30dias = moment().add(30, 'd').format('YYYYY-MM-DD');
        txtfechavencimiento.val(fechaa30dias);
    }

});

window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function fnBuscarProforma(id) {
    let controller = new CotizacionController();
    controller.Buscar(id, fnCargarDatosProforma);
}
function fnCargarDatosProforma(data) {

    var cabecera = JSON.parse(data[0].CABECERA);
    var detalle = JSON.parse(data[0].DETALLE);
    $("#btnimprimir").attr('href', ORIGEN + '/Compras/CCotizacion/Imprimir/' + cabecera[0]['ID']);
    txtrucproveedor.val(cabecera[0]['RUC_PROV']);
    txtrazonsocial.val(cabecera[0]['RAZONSOCIAL_PROV']);
    txttelefonoproveedor.val(cabecera[0]['TELEFONO_PROV']);
    txtcelularrepresentante.val(cabecera[0]['REPRE_CELULAR']);
    txtnombrescontacto.val(cabecera[0]['CONTACTO_NOMBRES']);
    txtnombresrepresentante.val(cabecera[0]['REPRE_NOMBRES']);
    txttelefonorepresentante.val(cabecera[0]['REPRE_TELE']);
    txtidmoneda.val(cabecera[0]['IDMONEDA']);
    cmbmoneda.val(cabecera[0]['IDMONEDA']);
    txttelefonocontacto.val(cabecera[0]['CONTACTO_TELE']);
    txtcelularcontacto.val(cabecera[0]['CONTACTO_CELULAR']);
    txtcambiomoneda.val(cabecera[0]['MONEDA_CAMBIO']);
    
    if (cabecera[0]['UBICACION_PRO'] == 'INTERNACIONAL')
        divicoterms.removeClass('ocultar');
    else
        divicoterms.addClass('ocultar');
    tbllista.clear().draw(false);
    var auxtfila;
    for (var i = 0; i < detalle.length; i++) {
        if (detalle[i]["TOTAL"] - detalle[i]["SUBTOTAL"] == 0) {
            igvLocal = 0;
            chkConIgv.value = false;
        } else {
            chkConIgv.value = true;
            igvLocal = 0.18;
        }
        _INDEX = (i + 1);
        _ROWCOLUMN = 0;
        var iduma = detalle[i]["IDUMA"];//FSILVA
        console.log(iduma);
        var listaMedida = fnListaUnidadMedida(iduma);

        if (detalle[i]['ID_PRODU_PROV'] === '' || detalle[i]['ID_PRODU_PROV'] === 0) {
            auxtfila = tbllista.row.add([
                '<label class="detalle_iddetalle"> ' + detalle[i]['ID'] + '</label>' +
                '<label class="detalle_idlab">' + VerificarSiEs0(detalle[i]['IDLAB']) + '</label>' +
                '<label class="detalle_iduma">' + VerificarSiEs0(detalle[i]['IDUMA']) + '</label>' +
                '<label class="detalle_idump">' + VerificarSiEs0(detalle[i]['IDUMP']) + '</label>' +
                '<label class="detalle_equivalencia">' + detalle[i]['EQUIVALENCIA'] + '</label>' +
                '<label class="detalle_idpro">' + detalle[i]['IDPRODUCTO'] + '</label>' +
                '<label class="detalle_index" rowp=' + (_ROWCOLUMN) +'>' + _INDEX + '</label>' +
                '<label class="detalle_idpropro">' + VerificarSiEs0(detalle[i]['ID_PRODU_PROV']) + '</label>',
                '<input class="index font-13 inputdetalle iddetalle" readonly rowp=' + (_ROWCOLUMN)+' value=' + (i + 1) + ' text-center>',
                '<label class="detalle_codpro">' + detalle[i]['COD_PROD_QF'] + '</label>',
                '<label class="detalle_nompro">' + detalle[i]['DESCRIPCION_PROD_QF'] + '</label>',
                '<button class="btnanalisisproducto " idproducto="' + detalle[i]['IDPRODUCTO'] + '"  idproveedor="' + cabecera[0]['ID_PROV'] + '"><i class="fas fa-cash-register"></i></button>',
                'A', 'A', '<label class="laboratorio">' + detalle[i]['LABORATORIO'] + '</label>',
                '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="' + detalle[i]['CANTIDAD'] + '"/>',
                /*detalle[i]['UMA_DES'],*/
                listaMedida,
                '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + detalle[i]['VVF'] + '"/>',
                '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + detalle[i]['PVF'] + '"/>',
                ' <button class="btnbonificacion" valor="' + detalle[i]['BONI'] + '">....<label class="returnmodal" hidden>' + detalle[i]['DATOSBONI'] + '</label></button>',
                '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[i]['COSTO'] + '" disabled/>',
                '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[i]['COSTOFACTURAR'] + '" disabled/>',
                '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) +' value="' + detalle[i]['DES1'] + '"  />',
                '<input type="number" class="text-center txtdes2 inputdetalle" min="0"  rowp=' + (_ROWCOLUMN + 5) +' value="' + detalle[i]['DES2'] + '"  />',
                '<input type="number" class="text-center txtdes3 inputdetalle" min="0"  rowp=' + (_ROWCOLUMN + 6) +' value="' + detalle[i]['DES3'] + '"  />',
                '<input type="number" class="text-center txtprecio inputdetalle" min="0"   value="' + detalle[i]['SUBTOTAL'] + '"  />',
                '<input type="number" class="text-center txtprecioigv inputdetalle" min="0"  value="' + detalle[i]['TOTAL'] + '"  />',
                ` <div class="btn-group btn-group-sm">
                    <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
                </div>`
            ]).draw(false).node();

        } else {
            auxtfila = tbllista.row.add([
                '<label class="detalle_iddetalle"> ' + detalle[i]['ID'] + '</label>' +
                '<label class="detalle_idlab">' + VerificarSiEs0(detalle[i]['IDLAB']) + '</label>' +
                '<label class="detalle_iduma">' + VerificarSiEs0(detalle[i]['IDUMA']) + '</label>' +
                '<label class="detalle_idump">' + VerificarSiEs0(detalle[i]['IDUMP']) + '</label>' +
                '<label class="detalle_equivalencia">' + detalle[i]['EQUIVALENCIA'] + '</label>' +
                '<label class="detalle_idpro">' + detalle[i]['IDPRODUCTO'] + '</label>' +
                '<label class="detalle_index">' + _INDEX + '</label>' +
                '<label class="detalle_idpropro">' + VerificarSiEs0(detalle[i]['ID_PRODU_PROV']) + '</label>',
                '<input class="index font-13 inputdetalle iddetalle" readonly rowp=' + (_ROWCOLUMN) +' value=' + (i + 1) +' text-center>',
                '<label class="detalle_codpro">' + detalle[i]['COD_PROD_QF'] + '</label></br><label class="detalle_codpropro">' + detalle[i]['COD_PRO_PROVEEDOR'] + '</label>',
                '<label class="">' + detalle[i]['DESCRIPCION_PROD_QF'] + '</label></br><label class="">' + detalle[i]['DESCRIPCION_PRO_PROVEEDOR'] + '</label>',
                '<button class="btnanalisisproducto "  idproducto="' + detalle[i]['IDPRODUCTO'] + '"  idproveedor="' + cabecera[0]['ID_PROV'] + '"><i class="fas fa-cash-register"></i></button>',
                'A', 'A', '',
                '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) +' onkeypress="return justNumbers(event);"  value="' + detalle[i]['CANTIDAD'] + '"/>' +
                '</br><span class="equivalencia">' + detalle[i]['CANTIDADPROVEEDOR'] + '</span>',
                '<label class="">' + detalle[i]['UMA_DES'] + '</label></br><label class="">' + detalle[i]['UMP_DES'] + '</label>',
                //agregartabla(getvalortablainsumosproveedorqf(arrayunidad[1]), getvalortablainsumosproveedorqf(arrayunidad[2])),
                '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) +' onkeypress="return justNumbers(event);" size="10" value="' + detalle[i]['VVF'] + '"/>',
                '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) +' onkeypress="return justNumbers(event);"  value="' + detalle[i]['PVF'] + '"/>',
                '',
                '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="' + detalle[i]['COSTO'] + '" disabled/>',
                '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="' + detalle[i]['COSTOFACTURAR'] + '" disabled/>',
                '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) +'  value="' + detalle[i]['DES1'] + '"  />',
                '<input type="number" class="text-center txtdes2 inputdetalle" min="0"  rowp=' + (_ROWCOLUMN + 5) +' value="' + detalle[i]['DES2'] + '"  />',
                '<input type="number" class="text-center txtdes3 inputdetalle" min="0"  rowp=' + (_ROWCOLUMN + 6) +' value="' + detalle[i]['DES3'] + '"  />',
                '<input type="number" class="text-center txtprecio inputdetalle" min="0"   value="' + detalle[i]['SUBTOTAL'] + '"  />',
                '<input type="number" class="text-center txtprecioigv inputdetalle" min="0"  value="' + detalle[i]['TOTAL'] + '"  />',
                ` <div class="btn-group btn-group-sm">
            <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        </div>`

            ]).draw(false).node();
        }
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
        $(auxtfila).attr({ 'onkeydown': 'movertabla(' + _INDEX + ')' });
        tbllista.columns.adjust().draw();
        $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });
        _ARRAYBONIFICACIONES.push({ index: _INDEX, array: detalle[i]['BONIFICACIONES'] });
        
        calcularTotal();
    }

}
//TIPO PROFORMA
function listarcontactos(id) {

    var url = ORIGEN + "/Compras/CProveedor/listarContactosProveedor";
    var obj = { proveedor: id };
    $.get(url, obj).done(function (data) {
        cmbvendedor.empty();
        if (data != null && data.length != 0) {

            //cmbvendedor.prepend('<option value="0">[SELECCIONE]</option>');
            for (var i = 0; i < data.length; i++) {
                if (i === 0)
                    cmbvendedor.prepend('<option value= "' + data[i].idcontacto + '"  telefono="' + verificarnulos(data[i].telefono) + '" celular="' + verificarnulos(data[i].celular) + '"   selected>' + data[i].nombres + '</option>');
                else
                    cmbvendedor.prepend('<option value= "' + data[i].idcontacto + '" telefono="' + verificarnulos(data[i].telefono) + '" celular="' + verificarnulos(data[i].celular) + '"  >' + data[i].nombres + '</option>');

            }
            if (cmbvendedor.val().length != 0)
                tabproforma.classList.remove('disabled');

        } else { mensajePermanente('I', 'El proveedor no tiene contactos registrados'); tabproforma.classList.add('disabled'); }




    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}
function listarRepresentantes(id) {

    var url = ORIGEN + "/Compras/CLaboratorio/representanteLaboratoriosProveedor";
    var obj = { proveedor: id };
    $.get(url, obj).done(function (data) {

        if (data != null && data.length != 0) {
            cmbrepresentante.empty();
            //cmbvendedor.prepend('<option value="0">[SELECCIONE]</option>');
            for (var i = 0; i < data.length; i++) {
                if (i === 0)
                    cmbrepresentante.prepend('<option nomlaboratorio="' + data[i].laboratorio.descripcion + '"  value= "' + data[i].idrepresentante + '" laboratorio="' + data[i].idlaboratorio + '"  telefono="' + verificarnulos(data[i].telefono) + '" celular="' + verificarnulos(data[i].celular) + '"    selected>' + data[i].laboratorio.descripcion + ' - ' + data[i].nombres + '</option>');
                else
                    cmbrepresentante.prepend('<option nomlaboratorio="' + data[i].laboratorio.descripcion + '" value= "' + data[i].idrepresentante + '"  laboratorio="' + data[i].idlaboratorio + '" telefono="' + verificarnulos(data[i].telefono) + '" celular="' + verificarnulos(data[i].celular) + '" >' + data[i].laboratorio.descripcion + ' - ' + data[i].nombres + '</option>');

            }
        } else
            mensajePermanente('I', 'El proveedor no tiene contactos registrados');

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}
rdrepresentante.click(function (e) {
    var valor = $(this).prop('checked');

    if (valor) {
        if (cmbtipoproforma.val() === '2') {
            if (codigoproveedor.val().length != 0)
                listarRepresentantes(codigoproveedor.val());
            else
                mensaje('I', 'Seleccione proveedor');
        }
    }
});
$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.idproveedor', function (e) {
    if (!(cmbtipoproforma.val() === "0" || cmbtipoproforma.val() === "1" || cmbtipoproforma.val() === "4"))
        $('#modalproveedores').modal('show');
});
$(document).on('click', '.btnpasarproveedor', function (e) {
    var columna = tblproveedores.row($(this).parents('tr')).data();
    txtidproveedor.val(columna[0]);
    $('#modalproveedores').modal('hide');
    buscarproveedor(columna[0]);
    //listarmodalproductos();   
    cmbrepresentante.empty();
    cmbvendedor.empty();
    listarcontactos(columna[0]);
    rdvendedor.prop('checked', true);
    if (cmbtipoproforma.val() === "3")// proforma de insumo
    {
        tbllista.clear().draw(false);
        calcularTotal();
    }


    //if (cmbtipoproforma.val() === "3" || cmbtipoproforma.val() === "2")


});
function buscarproveedor(id) {
    let controller = new ProveedorController();
    controller.BuscarProveedor(id, function (data) {
        txtidproveedor.val(data.idproveedor);
        txtrucproveedor.val(data.ruc);
        txtrazonsocial.val(data.razonsocial);
        txttelefonoproveedor.val(data.telefonod);
        txtidmoneda.val(data.idmoneda);
        //cmbmoneda.val(data.moneda.nombre);
        cmbmoneda.val(data.idmoneda);
        txtcambiomoneda.val(data.moneda.tipodecambio);
        if (data.idcondicionpago ?? '' != '') {
            cmbcondicionpago.val(data.idcondicionpago);
            cmbtipopago.val(10001)
        }
        classidproveedor.val(data.idproveedor);
        classrazonproveedor.val(data.razonsocial);
        if (data.ubicacion == 'INTERNACIONAL')
            divicoterms.removeClass('ocultar');
        else
            divicoterms.addClass('ocultar');

        if (data.des1 === 0 || data.des1 === null)
            _DES1Pro = 0.0;
        else
            _DES1Pro = data.des1;
    });

}
cmbtipoproforma.change(function (e) {
    cmbvendedor.empty();
    cmbrepresentante.empty();
    rdvendedor.prop('checked', false);
    rdrepresentante.prop('checked', false);
    if (cmbtipoproforma.val() === 0 || cmbtipoproforma.val() === 1) {

    }
    if (cmbtipoproforma.val() === "0" || cmbtipoproforma.val() === "3" || cmbtipoproforma.val() === "2")
        tabproforma.classList.add('disabled');
    else
        tabproforma.classList.remove('disabled');


    classidproveedor.prop('disabled', false);

    $('#razonproveedor').val("");
    $('#idproveedor').val("");
    $('#codigoproveedor').val("");
    //cambiar busqueda de laboratorios
    if (cmbtipoproforma.val() === '1')
        txtbuscarlaboratorioproveedor.setAttribute('tipobusqueda', 'ALL');
    else
        txtbuscarlaboratorioproveedor.setAttribute('tipobusqueda', 'PROVEEDOR');


});
cmbmoneda.change(function (e) {
    txtidmoneda.val(this.value);
    cmbmoneda.val(this.value);
    for (let i = 0; i < lMonedas.length; i++){
        if (lMonedas[i].idmoneda == this.value) {
            txtcambiomoneda.val(lMonedas[i].tipodecambio);
        }
    }
});
tabproforma.addEventListener('click', function (e) {

    if (_OPERACION === 'REGISTRAR') {
        tabtipo.classList.add('disabled');
        tabproforma.classList.remove('disabled');

        txttipocotizacion.val(cmbtipoproforma.val());
        //listarmodalproductos();

        var telefono = $('#cmbvendedor option:selected').attr('telefono');
        var celular = $('#cmbvendedor option:selected').attr('celular');
        var nombre = $('#cmbvendedor option:selected').text();
        var idcontacto = cmbvendedor.val() === "" ? null : cmbvendedor.val();
        txttelefonocontacto.val(telefono);
        txtcelularcontacto.val(celular);
        txtnombrescontacto.val(nombre);
        txtidcontacto.val(idcontacto);
        if (rdrepresentante.prop('checked') && cmbtipoproforma.val() === "2") {
            divrepresentante.removeClass('ocultar');
            var telefonore = $('#cmbrepresentante option:selected').attr('telefono');
            var celularre = $('#cmbrepresentante option:selected').attr('celular');
            var nombrere = $('#cmbrepresentante option:selected').text();
            var idrepresentante = cmbrepresentante.val() === "" ? null : cmbrepresentante.val();
            txttelefonorepresentante.val(telefonore);
            txtcelularrepresentante.val(celularre);
            txtnombresrepresentante.val(nombrere);
            txtidrepresentante.val(idrepresentante);
            txtidrepresentante.val(cmbrepresentante.val());
            console.log(cmbrepresentante.val());
        }
        if ((cmbtipoproforma.val() === "3" || cmbtipoproforma.val() === "2")) {
            if ($('#codigoproveedor').val().length == 0) {
                mensaje('I', 'Seleccione un proveedor');
                return;
            } else {
                txtidproveedor.removeClass('idproveedor');
            }
        }
        if (cmbtipoproforma.val() === "1" || cmbtipoproforma.val() === '4') {
            txtestado.val('BLANCO');
            divcontacto.addClass('ocultar');
            divrepresentante.addClass('ocultar');
            divproveedor.addClass('ocultar');

        }
    }
});
function limpiar() {
    location.reload();
    $('#form-registro').trigger('reset');
    tbllista.clear().draw(false);
}
$('#form-registro').submit(function (e) {
    e.preventDefault();
    let controller = new CotizacionController();
    var count = tbllista.rows().data().length;
    if (count > 0) {
        var obj = $('#form-registro').serializeArray();
        var detalle = obtenerDatosDetalleDiferentea0();

        obj[obj.length] = { name: 'detallejson', value: JSON.stringify(detalle) };
        if (_ARRAYELIMINADOS.length > 0)
            obj[obj.length] = { name: 'eliminados', value: (_ARRAYELIMINADOS) };
        if (detalle.length === 0) {
            mensaje('W', 'Los productos del detalle tienen cantidad 0');
            return;
        }

        //btnguardar.prop('disabled', true);   
        controller.RegistrarEditar(CONVERT_FORM_TO_JSON(obj), fnGuardarEditarCotizacion);

    } else
        mensaje('I', 'No existen registros en el detalle');
});
function fnAnularCotizacion() {
    var id = txtidcotizacion.val();
    if (id.length != 0) {
        let controller = new CotizacionController();
        controller.Anular(id, function () { });
    }
    else
        mensaje('I', 'Aún no se registra la cotización');
}
function fnGuardarEditarCotizacion(resp, men) {

    if (resp === null) { btnguardar.prop('disabled', false); return; }
    txtcodigocotizacion.val(resp.objeto.codigocotizacion);
    txtidcotizacion.val(resp.objeto.idcotizacion);
    fnBuscarProforma(resp.objeto.idcotizacion);
    $("#btnimprimir").attr('href', ORIGEN + '/Compras/CCotizacion/Imprimir/' + resp.objeto.idcotizacion);
    alertaSwall('S', 'OPERACION COMPLETADA', men);
    //if (men === 'PROFORMA EDITADA')
    // setTimeout(function () { location.href = ORIGEN + '/Compras/CCotizacion/RegistrarEditar/' + resp.objeto.idcotizacion; },2000);
}
$("#btnimprimir").click(function () {
    var href = $("#btnimprimir").attr('href');
    if (href != '#')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PROFORMA');
});
$('#btnaddproducto').click(function (e) {
    $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    checktodosPT.prop('checked', false);
    checktodosINSUMO.prop('checked', false); //viene de modal insumoproveedor
    $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
    if (cmbtipoproforma.val() === "1") {
        $('#modalproductoproveedorlaboratorio').modal('show');
        if (tbllaboratoriosproveedor.rows().data().length === 0)
            listarlaboratoriosproveedor("");
    }

    if (cmbtipoproforma.val() === "2") {
        if (txtidproveedor.val().length === 0) {
            mensaje("I", "Seleccione un proveedor");
            return;
        } else {
            $('#modalproductoproveedorlaboratorio').modal('show');
            if (tbllaboratoriosproveedor.rows().data().length === 0)
                listarlaboratoriosproveedor("");
        }
    }
    if (cmbtipoproforma.val() === "3") {
        if (txtidproveedor.val().length === 0) {
            mensaje("I", "Seleccione un proveedor");
            return;
        } else {
            $('#modalinsumosproveedores').modal('show');
            listarisumosproveedores(txtidproveedor.val());
        }
    }
    if (cmbtipoproforma.val() === "4") {
        $('#modalinsumosproveedores').modal('show');
        listarisumosproveedores("");
    }

});
// PARA UN ARRAY DE 2 POCISIONES
function getvalorestablainsumosproveedorqf(data1, data2) {
    var array1 = data1.split('</span>');
    var array2 = data2.split('</span>');
    var array3 = [];
    array3[0] = array1[0];
    array3[1] = array2[0];
    console.log(array3);
    return array3;

}
//PARA UN UNICO VALOR
function getvalortablainsumosproveedorqf(data1) {
    var array1 = data1.split('</span>');
    array1[0] = array1[0].trim();
    if (array1[0] === "")
        array1[0] = "N/A";
    return array1[0];

}
$(document).on('click', '.btnquitaritem', function (e) {

    var row = tbllista.row($(this).parents('tr')).data();
    var iddetalle = FN_GETDATOHTML(row[0], 'detalle_iddetalle');
    if (iddetalle.toString().trim() != '')
        _ARRAYELIMINADOS.push(parseInt(iddetalle));
    tbllista.row('.selected').remove().draw(false);
    agregarindex();
    calcularTotal();

});
function agregarindex() {
    var filas = document.querySelectorAll("#tbllista tbody tr input");
    var c = 0;
    filas.forEach(function (e) {
        e.textContent = (c + 1);
        c++;
    });
}
$(document).on('keyup', '.txtcantidadDetalle', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtvvf', function () {
    try { calcularmontos(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtpvf', function () {
    try { calcularmontosconIGV(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes1', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes2', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtdes3', function () {
    try { calcularMontosDescuentosCostosCantidad(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtprecio', function () {
    try { calcularMontosDesdePrecio(); } catch (e) { }
    calcularTotal();
});
$(document).on('keyup', '.txtprecioigv', function () {
    try { calcularMontosDesdePrecioIGV(); } catch (e) { }
    calcularTotal();
});
function calcularmontos() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value);
            if (isNaN(vvf)) {//|| vvf === 0
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            document.getElementsByClassName("txtpvf")[c].value = parseFloat(vvf + igvLocal * vvf).toFixed(numDecimales);
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = parseFloat(pvf * cantidad);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularmontosconIGV() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;

            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = "0";
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(numDecimales);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            if (pvf != 0)
                vvf = document.getElementsByClassName("txtvvf")[c].value = ((pvf * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);

            if (isNaN(vvf) || vvf === 0) {
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = (pvf * cantidad).toFixed(numDecimales);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularMontosDescuentosCostosCantidad() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value).toFixed(numDecimales);
            if (isNaN(vvf) || vvf === 0) {
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value).toFixed(numDecimales);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = (pvf * cantidad).toFixed(numDecimales);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            break;
        }
    }
}
function calcularMontosDesdePrecioIGV() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var totalconstante = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            total = document.getElementsByClassName("txtprecioigv")[c].value;
            totalconstante = document.getElementsByClassName("txtprecioigv")[c].value;
            var cantidad_parcial = cantidad;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            cantidad_parcial += parseFloat(sDatosSeparados[i - 2]);
                        } else {
                            totalconstante = parseFloat(totalconstante) + parseFloat(parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales));
                        }
                        i -= 3;
                    }
                }
            }

            costo = (total / cantidad_parcial).toFixed(numDecimales);
            s_total = ((total * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des3))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des2))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des1))).toFixed(numDecimales);
            pvf = (totalconstante / cantidad).toFixed(numDecimales);
            vvf = ((pvf * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);

            document.getElementsByClassName("txtprecio")[c].value = s_total;
            document.getElementsByClassName("txtcosto")[c].value = costo;
            document.getElementsByClassName("txtcostofacturar")[c].value = costo;
            document.getElementsByClassName("txtpvf")[c].value = pvf;
            document.getElementsByClassName("txtvvf")[c].value = vvf;
            break;
        }
    }
}
function calcularMontosDesdePrecio() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var datatable = tbllista.rows().data();
    for (var c = 0; c < filas.length; c++) {
        if (filas[c].className.includes("selected")) {
            var s_total = 0;
            var total = 0;
            var totalconstante = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            s_total = parseFloat(document.getElementsByClassName("txtprecio")[c].value);
            total = (s_total + (igvLocal * s_total)).toFixed(numDecimales);
            totalconstante = total;
            var cantidad_parcial = cantidad;

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            cantidad_parcial += parseFloat(sDatosSeparados[i - 2]);
                        } else {
                            totalconstante = parseFloat(totalconstante) + parseFloat(parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales));
                        }
                        i -= 3;
                    }
                }
            }

            costo = (total / cantidad_parcial).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des3))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des2))).toFixed(numDecimales);
            totalconstante = (totalconstante * (100 / (100 - des1))).toFixed(numDecimales);
            pvf = (totalconstante / cantidad).toFixed(numDecimales);
            vvf = ((pvf * 100) / (100 + (igvLocal * 100))).toFixed(numDecimales);

            document.getElementsByClassName("txtprecioigv")[c].value = total;
            document.getElementsByClassName("txtcosto")[c].value = costo;
            document.getElementsByClassName("txtcostofacturar")[c].value = costo;
            document.getElementsByClassName("txtpvf")[c].value = pvf;
            document.getElementsByClassName("txtvvf")[c].value = vvf;
            break;
        }
    }
}
function calcularTotal() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    var subtotal = 0.0;
    var impuesto = 0.0;
    var totalfactura = 0.0;
    var c = 0;
    filas.forEach(function (e) {
        try {
            subtotal += parseFloat(document.getElementsByClassName("txtprecio")[c].value);
        } catch (e) { }
        try {
            totalfactura += parseFloat(document.getElementsByClassName("txtprecioigv")[c].value);
        } catch (e) { }
        c++;
    });
    impuesto = totalfactura - subtotal;
    $('#lblsubtotal').text(subtotal.toFixed(numDecimales));
    $('#lblimpuesto').text(impuesto.toFixed(numDecimales));
    $('#lbltotalfactura').text(totalfactura.toFixed(numDecimales));
    $('#lbltotal').text(totalfactura.toFixed(numDecimales));
}
function obtenerDatosDetalleAUX() {
    var array = [];
    var c = 0;
    var datatable = tbllista.rows().data();
    var filas = document.querySelectorAll("#tbllista #tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        var otrosdatos = datatable[c][0];
        var detalleindex;
        var aux;
        try { detalleindex = parseInt(FN_GETDATOHTML(otrosdatos, 'detalle_index')); } catch (e) { detalleindex = -2; }
        if (detalleindex != -2) {
            var x = getindexbonificaciones(parseInt(detalleindex));
            if (x != -1) {
                detalle.bonificaciones = _ARRAYBONIFICACIONES[x].array;
            }
        }
        if (c    < datatable.length) {
            detalle.idcotizacion = txtidcotizacion.val() === '' ? 0 : txtidcotizacion.val();
            try { detalle.cantidad = (document.getElementsByClassName("txtcantidadDetalle")[c].value); } catch (e) { }
            try { detalle.pvf = (document.getElementsByClassName("txtpvf")[c].value); } catch (e) { }
            try { detalle.vvf = (document.getElementsByClassName("txtvvf")[c].value); } catch (e) { }
            try { detalle.total = (document.getElementsByClassName("txtprecioigv")[c].value); } catch (e) { }
            try { detalle.subtotal = (document.getElementsByClassName("txtprecio")[c].value); } catch (e) { }
            try { detalle.equivalencia = (document.getElementsByClassName("equivalencia")[c].innerHTML); } catch (e) { }
            try { detalle.des1 = (document.getElementsByClassName("txtdes1")[c].value); } catch (e) { }
            try { detalle.des2 = (document.getElementsByClassName("txtdes2")[c].value); } catch (e) { }
            try { detalle.des3 = (document.getElementsByClassName("txtdes3")[c].value); } catch (e) { }
            //try { detalle.des4 = (document.getElementsByClassName("equivalencia")[c].innerHTML)); } catch (e) { }
            try { detalle.bonificacion = (document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { }
            try { detalle.costo = (document.getElementsByClassName("txtcosto")[c].value); } catch (e) { }
            try { detalle.montofacturar = (document.getElementsByClassName("txtcostofacturar")[c].value); } catch (e) { }
            try { detalle.bonificacion = (document.getElementsByClassName("bonificacion")[c].innerHTML); } catch (e) { }
            /*try { detalle.iduma = (FN_GETDATOHTML(otrosdatos, "detalle_iduma")); } catch (e) { }*/
            //try { detalle.iduma = objUnidadMedida.iduma; } catch (e) { } //FSILVARI
            try { detalle.iduma = (document.getElementsByClassName("cboUnidadMedida")[c].value); } catch (e) { }
            try { detalle.idump = (FN_GETDATOHTML(otrosdatos, "detalle_idump")); } catch (e) { }
            try {
                var iddetalle = (FN_GETDATOHTML(otrosdatos, "detalle_iddetalle"));
                detalle.iddetallecotizacion = (iddetalle === '' || iddetalle === null) ? 0 : iddetalle;
            } catch (e) { }
            try { detalle.idlaboratorio = (FN_GETDATOHTML(otrosdatos, "detalle_idlab")); } catch (e) { }
            try { detalle.idproducto = (FN_GETDATOHTML(otrosdatos, "detalle_idpro")); } catch (e) { }
            try { detalle.idproductoproveedor = (FN_GETDATOHTML(otrosdatos, "detalle_idpropro")); } catch (e) { }

        }
        array[c] = detalle;
        c++;

    });

    return array;

}
function obtenerDatosDetalleDiferentea0() {
    var array = obtenerDatosDetalleAUX();
    var c = 0;
    var array2 = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].cantidad.toString() != "0") {
            array2[c] = array[i];
            c++;
        }
    }
    return array2;
}
function getvalortabla(fila, columna) {
    var rows = tbllista.rows().data();
    return (rows[fila][columna]);
}
//PRODUCTO NTERMINADO
function agregarItems(tipo) {
    if (tipo === 'PT') {
       
        var filas = tblproductosxlaboratoriodeproveedor.rows('.selected').data();
        
        for (var i = 0; i < filas.length; i++) {
            
            var obj = new Object();
            obj.idlaboratorio = FN_GETDATOHTML(filas[i][0], 'idlaboratorio');
            obj.laboratorio = filas[i][3];
            obj.idunidadmedida = FN_GETDATOHTML(filas[i][0], 'idum');               
            obj.idproducto = FN_GETDATOHTML(filas[i][0], 'idproducto');   
            obj.codigoproducto = filas[i][1];            
            obj.producto = FN_GETDATOHTML(filas[i][2], 'nombreproducto');
            obj.unidadmedida = filas[i][4];
            obj.vvf = filas[i][5];
            obj.pvf = filas[i][6];
            obj.dsc2 = FN_GETDATOHTML(fila[0], 'dsc2');
            obj.dsc3 = FN_GETDATOHTML(fila[0], 'dsc3');
            agregarProductoTerminado(obj);
        }
       
        agregarindex();
        calcularMontosDescuentosCostosCantidad();
        checktodosPT.prop('checked', false); //viene de modal productoproveeedorxlaboratorio
        $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    }
    if (tipo === 'IN') {
        var filas2 = tblinsumosdeproveedor.rows('.selected').data();
        for (var j = 0; j < filas2.length; j++) {
            agregarInsumoEconomato(filas2[j]);
        }
        checktodosINSUMO.prop('checked', false); //viene de modal insumoproveedor
        $("#tblinsumosdeproveedor tbody tr").removeClass('selected');
    }
}
$(document).on('click', '.btnpasarproductoxlaboratorio', function () {
    var fila = tblproductosxlaboratoriodeproveedor.row($(this).parents('tr')).data();
    var obj = new Object();
    obj.idlaboratorio = FN_GETDATOHTML(fila[0], 'idlaboratorio');
    obj.laboratorio = fila[3];
    obj.idunidadmedida = FN_GETDATOHTML(fila[0], 'idum');
    obj.idproducto = FN_GETDATOHTML(fila[0], 'idproducto');
    obj.codigoproducto = fila[1];
    obj.producto = FN_GETDATOHTML(fila[2], 'nombreproducto');
    obj.unidadmedida = fila[4];
    obj.vvf = fila[5];
    obj.pvf = fila[6];
    obj.dsc1 = FN_GETDATOHTML(fila[0], 'dsc1');
    obj.dsc2 = FN_GETDATOHTML(fila[0], 'dsc2');
    obj.dsc3 = FN_GETDATOHTML(fila[0], 'dsc3');
    agregarProductoTerminado(obj);
    this.parentNode.parentNode.classList.remove('selected');
    agregarindex();
    calcularMontosDescuentosCostosCantidad();

});
$(document).on('click', '.btnpasarinsumoproveedor', function () {
    var columna = tblinsumosdeproveedor.row($(this).parents('tr')).data();
    agregarInsumoEconomato(columna);
});
function agregarProductoTerminado(data) {
   
    //VERIFICA SI EL LABORATORIO ES DEL REPRESENTANTE
    if (fnverificarsielitemestaendetalle(data.codigoproducto)) {
        mensaje('I', 'El item ya esta en el detalle');
        return;
    }
    var idlaboratorio = $('#cmbrepresentante option:selected').attr('laboratorio');

    if (data.codigoproducto.includes("IS") || data.codigoproducto.includes("IM")) {
        numDecimales = 5;
    }

    if (cmbrepresentante.prop('checked'))
        if (data.idlaboratorio != idlaboratorio) {
            mensaje('I', 'El producto no es del laboratorio del representante');
            return;
        }
    _INDEX = _INDEX + 1;
    var cantidadtext = '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) +' onkeypress="return justNumbers(event);"  value="0"/>';
    var auxtfila;
   auxtfila=tbllista.row.add([
        '<label class="detalle_iddetalle"></label>' +
        '<label class="detalle_idlab">' + data.idlaboratorio + '</label>' +
        '<label class="detalle_iduma">' + data.idunidadmedida + '</label>' +
        '<label class="detalle_idump">' + '' + '</label>' +
        '<label class="detalle_equivalencia">1</label>' +
        '<label class="detalle_idpro">' + data.idproducto + '</label>' +
        //'<label class="detalle_bonificacion">0</label>'+     
       '<label class="detalle_index" >' + _INDEX+'</label>' +
       '<label class="detalle_idpropro"></label>',
       //ACA onkeydown="movertabla('+_INDEX +')"
       '<input class="index font-13 inputdetalle iddetalle" readonly  rowp=' + (_ROWCOLUMN) +'></input>',
        '<label class="detalle_codpro">' + data.codigoproducto + '</label>',
        '<label class="detalle_nompro">' + data.producto + '</label>',
        '<button class="btnanalisisproducto " idproducto="' + data.idproducto + '"  idproveedor="' + txtidproveedor.val() + '"><i class="fas fa-cash-register"></i></button>',
        'A', 'A',
        '<label class="laboratorio">' + data.laboratorio + '</label>',
        cantidadtext,
        data.unidadmedida,
       '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) + ' onkeypress="return justNumbers(event);" size="10" value="' + parseFloat(data.vvf).toFixed(numDecimales) + '"/>',
       '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) + ' onkeypress="return justNumbers(event);"  value="' + parseFloat(data.pvf).toFixed(numDecimales) + '"/>',
       ' <button class="btnbonificacion" valor="0">....<label class="returnmodal" hidden></label></button>',
        '<input type="number" class="text-center txtcosto inputdetalle" min="0"   value="0" disabled/>',
       '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="0" disabled/>',
       '<input type="number" class="text-center txtdes1 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 4) + '  value="' + parseFloat(data.dsc1).toFixed(numDecimales) + '" />',
       '<input type="number" class="text-center txtdes2 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 5) + '  value="' + parseFloat(data.dsc2).toFixed(numDecimales) +'" />',
       '<input type="number" class="text-center txtdes3 inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 6) + '  value="' + parseFloat(data.dsc3).toFixed(numDecimales) +'" />',
        '<input type="number" class="text-center txtprecio inputdetalle" min="0"   value="0" />',
        '<input type="number" class="text-center txtprecioigv inputdetalle" min="0"  value="0" />',
        ` <div class="">
            <button class="btn btn-sm btn-danger font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        </div>`
   ]).draw(false);
    $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    $(auxtfila).attr({ 'onkeydown': 'movertabla(' + _INDEX + ')' });
    tbllista.columns.adjust().draw();
    $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });
    agregarindex();
    //$('#modalproductoproveedorlaboratorio').modal('hide');


}
function agregarInsumoEconomato(columna) {
    console.log(columna);
    var arraycod = [];
    arraycod[0] = FN_GETDATOHTML(columna[1], 'codproducto');
    arraycod[1] = FN_GETDATOHTML(columna[1], 'codproveedor');
    var arrayid = [];
    arrayid[0] = FN_GETDATOHTML(columna[0], 'idproducto');
    arrayid[1] = FN_GETDATOHTML(columna[0], 'idproductoproveedor');
    var arraydescripcion = [];
    arraydescripcion[0] = FN_GETDATOHTML(columna[2], 'nombreproducto');
    arraydescripcion[1] = FN_GETDATOHTML(columna[2], 'nombreproveedor');
    var arrayunidadid = []; columna[7].split('<span>');
    arrayunidadid[0] = FN_GETDATOHTML(columna[0], 'iduma');
    arrayunidadid[1] = FN_GETDATOHTML(columna[0], 'idump');
    var arrayunidad = [];
    arrayunidad[0] = FN_GETDATOHTML(columna[3], 'uma');
    var equivalencia = columna[4];

    var vvf = columna[5];
    var pvf = columna[6];

    if (fnverificarsielitemestaendetalle(arraycod[0])) {
        mensaje('I', 'El item ya esta en el detalle');
        return;
    }
    _INDEX = _INDEX + 1;
    _ROWCOLUMN = 0;
    var cantidadtext = '<input type="number" class="text-center txtcantidadDetalle inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 1) + ' onkeypress="return justNumbers(event);"  value="0"/>';

    //fsilva 18/12/2023 - Inicio
    //var unidadMedida = '<select class="text-center txtUnidadMedida"  min="0"><option>' + arrayunidad[0] + '</option></select >';
    var listaMedida = fnListaUnidadMedida(arrayunidadid[0]);
    //fsilva 18/12/2023 - Fin

    var auxtfila = tbllista.row.add([
        '<label class="detalle_iddetalle"></label>' +
        '<label class="detalle_idlab"></label>' +
        '<label class="detalle_iduma">' + (arrayunidadid[0]) + '</label>' +
        '<label class="detalle_idump">'+'</label>' +
        '<label class="detalle_idpro">' + (arrayid[0]) + '</label>' +
        '<label class="detalle_idpropro">' + (arrayid[1]) + '</label>' +
        //'<label class="detalle_bonificacion">0</label>' +
        '<label class="detalle_index" rowp=' + (_ROWCOLUMN) +'>' + _INDEX + '</label>' +
        '<label class="detalle_equivalencia">' + equivalencia + '</label>',
        '<input class="index font-13 inputdetalle iddetalle" rowp=' + (_ROWCOLUMN) +' readonly value='+_INDEX+'></input>',
        '<label class="detalle_codpro">' + (arraycod[0]) + '</label></br><label class="detalle_codpropro">' + (arraycod[1]) + '</label>',
        '<label class="detalle_nompro">' + (arraydescripcion[0]) + '</label></br><label class="">' + (arraydescripcion[1]) + '</label>',
        //ACA
        '<button class="btnanalisisproducto "  idproducto="' + arrayid[0] + '"  idproveedor="' + arrayid[1] + '"><i class="fas fa-cash-register"></i></button>',
        'A', 'A',
        '<label class="laboratorio">' + equivalencia+'</label>' ,
        cantidadtext + '</br>',
        //<span class="equivalencia">' + equivalencia + '</span>',
        //'<label class="">' + arrayunidad[0] + '</label></br><label class="">' + '</label>',
        listaMedida + '</br>',//FSILVA
        //agregartabla(getvalortablainsumosproveedorqf(arrayunidad[1]), getvalortablainsumosproveedorqf(arrayunidad[2])),
        '<input type="number" class="text-center txtvvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 2) +' onkeypress="return justNumbers(event);" size="10" value="' + vvf + '"/>',
        '<input type="number" class="text-center txtpvf inputdetalle" min="0" rowp=' + (_ROWCOLUMN + 3) +' onkeypress="return justNumbers(event);"  value="' + pvf + '"/>',
        '',
        '<input type="number" class="text-center txtcosto inputdetalle" min="0"  value="0" disabled/>',
        '<input type="number" class="text-center txtcostofacturar inputdetalle" min="0"   value="0" disabled/>',
        '<input type="number" class="text-center txtdes1 inputdetalle" rowp=' + (_ROWCOLUMN + 4) +' min="0"   value="0" />',
        '<input type="number" class="text-center txtdes2 inputdetalle" rowp=' + (_ROWCOLUMN + 5) +' min="0"   value="0" />',
        '<input type="number" class="text-center txtdes3 inputdetalle" rowp=' + (_ROWCOLUMN + 6) +' min="0"   value="0" />',

        '<input type="number" class="text-center txtprecio inputdetalle" min="0"   value="0" />',
        '<input type="number" class="text-center txtprecioigv inputdetalle" min="0"  value="0" />',
        ` <div class="btn-group btn-group-sm">
            <button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritem"><i class="fas fa-trash-alt"></i></button>
        </div>`

    ]).draw(false).node();
    $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    $(auxtfila).attr({ 'onkeydown': 'movertabla(' + _INDEX + ')' });
    tbllista.columns.adjust().draw();
    $(auxtfila).find('td').eq(2).attr({ 'style': 'width:20%' });

    agregarindex();

    calcularmontos();
    calcularTotal();
    //$('#modalinsumosproveedores').modal('hide');

}
function fnverificarsielitemestaendetalle(codproducto) {
    var filas = document.querySelectorAll('#tbllista tbody tr');
    if (tbllista.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getElementsByClassName('detalle_codpro')[0].innerText;
        if (codproducto == aux)
            band = true;
    });
    return band;
}
var idproboni;
var codproboni;
var nomproboni;
var precproboni;
var _arrayBonificacionDescuento = [];
var _idlaboratorioBONI = "0";
$(document).on('click', '.btnbonificacion', function (e) {

    var columna = tbllista.row($(this).parents('tr')).data();
    //txtiddetallebonificacion.val(columna[0]);
    precproboni = $(this).parents("tr").find("td").find('.txtcostofacturar').val();
    var index = FN_GETDATOHTML(columna[0], 'detalle_index');
    console.log(index);
    codproboni = $(this).parents("tr").find("td").find('.detalle_codpro').text();
    nomproboni = $(this).parents("tr").find("td").find('.detalle_nompro').text();
    txtindexbonificacion.val(index);
    idproboni = FN_GETDATOHTML(columna[0], 'detalle_idpro');
    _idlaboratorioBONI = FN_GETDATOHTML(columna[0], 'detalle_idlab');


    $('#modalbonificacion').modal('show');
    if (txtiddetallebonificacion.val().trim() != "") {
        buscarbonificacion(txtiddetallebonificacion.val());
    } else {
        var x = getindexbonificaciones(parseInt(index));
        if (x != -1) {
            var array = _ARRAYBONIFICACIONES[x].array;
            array = array ?? [];
            tblproductosbonificacion.clear().draw(false);
            for (var i = 0; i < array.length; i++) {
                cmbtipobonificacion.val(array[i].tipo);
                tblproductosbonificacion.row.add([
                    array[i].idbonificacion,
                    '<span class="MBN_idproducto" idproducto="' + array[i].idproducto + '">' + array[i].idproducto + '</span>',
                    '<span class="MBN_producto">' + array[i].producto + '</span>',
                    '<span class="MBN_cantidad">' + array[i].cantidad + '</span>',
                    '<span class="MBN_precio">' + array[i].precio.toFixed(numDecimales) + '</span>',
                    '<span class="MBN_subtotal">' + (array[i].precio * array[i].cantidad).toFixed(numDecimales) + '</span>',
                    '<span class="MBN_bonipara">' + array[i].tipo + '</span>',
                    '<span class="MBN_promocion">' + array[i].promocion + '</span>',
                    '<button class="btn btn-sm btn-outline-danger waves-effect font-10 btnquitaritembonificacion"><i class="fas fa-trash-alt"></i></button>'
                ]).draw(false);
            }
            calculartotalbonificacion();
        }
    }
    if (tblproductosbonificacion.rows().data().length == 0)
        $('#rdbonimismo').click();
});
function getindexbonificaciones(index) {
    for (var i = 0; i < _ARRAYBONIFICACIONES.length; i++) {
        if (parseInt(index) === parseInt(_ARRAYBONIFICACIONES[i].index))
            return i;
    }
    return -1;
}
function getindextotalbonificaciones(index) {
    for (var i = 0; i < _arrayBonificacionDescuento.length; i++) {
        if (parseInt(index) === parseInt(_arrayBonificacionDescuento[i].index))
            return i;
    }
    return -1;
}
function setBonificacionTabla() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    //var bonificacion = 0.0;
    var c = 0;
    var datatable = tbllista.rows().data();
    filas.forEach(function (e) {

        var ID = FN_GETDATOHTML(datatable[c][0], 'detalle_index');

        if (txtindexbonificacion.val().trim() === ID.toString().trim()) {
            document.getElementsByClassName("btnbonificacion")[c].setAttribute('valor', txttotalbonificacion.val());
            return;
        }
        c++;
    });

    document.getElementsByClassName("returnmodal")[c].innerHTML = "";
    for (var i = 0; i < array_retornoModalBoni.length; i++) {
        document.getElementsByClassName("returnmodal")[c].innerHTML += "|" + array_retornoModalBoni[i].idproducto + "|" + array_retornoModalBoni[i].cantidad + "|" + array_retornoModalBoni[i].precio;
    }
    //calcularmontos();
}
function buscar10ultimascompras(idproducto, idproveedor) {
    console.log(idproducto);
    getultimascompras(idproducto, '');
}
function bloquearcantidad0() {
    var filas = document.querySelectorAll("#tbllista tbody tr");
    filas.forEach(function (e) {
        var columna = e.querySelectorAll("td");
        var unidades = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[aux].value);
        if (unidades === 0 || isNaN(unidades)) {
            document.getElementsByClassName("txtcantidadDetalle")[aux].value = 1;
        }
        aux = aux + 1;
    });
}

var popupanalisis = null;
var idanterioranalisis = '';
$(document).on('click', '.btnanalisisproducto', function (e) {
    var fila = this.parentNode.parentNode;
    var idproducto = this.getAttribute('idproducto');
    var idproveedor = this.getAttribute('idproveedor');
    //var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto?idproducto=' + idproducto + '&&idproveedor=' + idproveedor;
    var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto';
    if (popupanalisis == null || popupanalisis.closed) {
        idanterioranalisis = idproducto;     
        popupanalisis = window.open(url, "Análisis de producto", 'width=1100,height=600,Titlebar=NO,Toolbar=NO');      
        popupanalisis.addEventListener('DOMContentLoaded', function () {
            popupanalisis.focus();
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnbuscaranalisis();
            popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
            popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
            popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
        });
    }
    else {      
        if (idanterioranalisis != idproducto) {
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnbuscaranalisis();
        }
        idanterioranalisis = idproducto;
        popupanalisis.focus();
        popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
        popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
        popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;       
    }
});

btnnuevo.addEventListener('click', function () {
    location.href = ORIGEN + "/Compras/CCotizacion/RegistrarEditar";
});

function movertabla(idtr) {
    test(event, idtr);
}

function test(event, idtr) {
    const value = event.target.value;
    const rowp = event.target.attributes['rowp'].value;
    idtr = parseFloat(value);
    if (event.keyCode == '40') {
        //ArrowDown
        tbllista.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                rpt = rs + 1;
            }
            if (filas.length >= rpt) {
                if (rs == rpt) {
                    e.className = e.className + ' selected';
                    (e.getElementsByClassName('iddetalle')[0]).focus();
                }
            }else{
                filas.forEach(function (e) {
                    var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                    if (rs == filas.length) {
                        e.className = e.className + ' selected';
                        (e.getElementsByClassName('iddetalle')[0]).focus();
                    }
                });
            }
        });
    }
    if (event.keyCode == '38') {
        //ArrowUp
        tbllista.$('tr.selected').removeClass('selected');
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                rpt = rs - 1;
                if (rpt > 0) {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                        if (rs == rpt) {
                            e.className = e.className + ' selected';
                            (e.getElementsByClassName('iddetalle')[0]).focus();
                        }
                    });
                }else {
                    filas.forEach(function (e) {
                        var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                        if (rs == 1) {
                            e.className = e.className + ' selected';
                            (e.getElementsByClassName('iddetalle')[0]).focus();
                        }
                    });
                }
            }
        });
    }
    if (event.keyCode == '113') {
        //F2
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var rpt = parseFloat(idtr);
        filas.forEach(function (e) {
            var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
            if (rs == idtr) {
                e.getElementsByClassName('btnanalisisproducto ')[0].click();        
            }
        });
    }
    if (event.keyCode == '13') {
        //ENTER
        var filas = document.querySelectorAll('#tbllista tbody tr');
        var c = 0;
        filas.forEach(function (e) {
            try {
                var rs = parseFloat(e.getElementsByClassName('iddetalle')[0].value);
                if (rs == idtr) {
                    e.childNodes()
                    /*if (parseFloat(e.attributes['rowp'].value) == parseFloat(rowp) + 1) {
                        this.focus();
                    }*/
                }
            } catch (e) { }
            c++;
        });
    }
}

function agregarindex() {
    var filas = document.querySelectorAll("#tbllista tbody tr td input");
    var tr = document.querySelectorAll("#tbllista tbody tr");
    var c = 0,p=1;
    //tr.forEach(function (e) {
    //    e.onkeydown = function onkeydown() { movertabla(p) };
    //    //e.addEventListener("onkeydown", movertabla(p));
    //    //=("movertabla(" + (p + 1).toString() + ")");
    //    p++;
    //});
    filas.forEach(function (e) {
        try {
            document.getElementsByClassName("iddetalle")[c].value = (c + 1).toString();//(c + 1);
        } catch (e) { }
            c++;
    });
}
chkConIgv.addEventListener("change", function (e) {
    var valor = this.value;
    chkConIgv.value = valor;
    if (valor == "true") igvLocal = 0.18;
    else igvLocal = 0;

    var c = 0;
    var filas = document.querySelectorAll('#tbllista tbody tr');
    var datatable = tbllista.rows().data();
    if (filas[0].textContent != "No hay registros") {
        filas.forEach(function (e) {
            var s_total = 0;
            var total = 0;
            var vvf = 0.0;
            var pvf = 0.0;
            var cantidad = 0.0;
            var equivalencia = 0.0;
            var des1 = 0.0;
            var des2 = 0.0;
            var des3 = 0.0;
            var costo = 0.0;
            var costofacturar = 0.0;
            cantidad = parseFloat(document.getElementsByClassName("txtcantidadDetalle")[c].value);
            if (isNaN(cantidad) || cantidad === 0) {
                document.getElementsByClassName("txtcantidadDetalle")[c].value = 0;
                cantidad = 0;
            }
            equivalencia = parseFloat(FN_GETDATOHTML(datatable[c][0], 'detalle_equivalencia')) * cantidad;
            if (isNaN(equivalencia))
                equivalencia = 0;
            try { document.getElementsByClassName("equivalencia")[c].innerHTML = equivalencia; } catch (e) { /*console.log('Error en equivalencia');*/ }

            des1 = document.getElementsByClassName("txtdes1")[c].value;
            des2 = document.getElementsByClassName("txtdes2")[c].value;
            des3 = document.getElementsByClassName("txtdes3")[c].value;
            vvf = parseFloat(document.getElementsByClassName("txtvvf")[c].value);
            if (isNaN(vvf)) {//|| vvf === 0
                document.getElementsByClassName("txtvvf")[c].value = 0;
                vvf = 0;
            }
            document.getElementsByClassName("txtpvf")[c].value = parseFloat(vvf + igvLocal * vvf).toFixed(numDecimales);
            pvf = parseFloat(document.getElementsByClassName("txtpvf")[c].value);
            if (isNaN(pvf) || pvf === 0) {
                document.getElementsByClassName("txtpvf")[c].value = 0;
                pvf = 0;
            }

            var idproducto = 0;
            try { idproducto = parseFloat(document.getElementsByClassName("btnanalisisproducto ")[c].getAttribute('idproducto')); } catch (e) { console.log('Error en idproducto'); }
            var boni = 0;
            try { boni = parseFloat(document.getElementsByClassName("btnbonificacion")[c].getAttribute('valor')); } catch (e) { console.log('Error en bonificacion'); }

            total = parseFloat(pvf * cantidad);
            if (!(des1 === 0))
                total = parseFloat(total - (total * (des1 / 100))).toFixed(numDecimales);
            if (!(des2 === 0))
                total = parseFloat(total - (total * (des2 / 100))).toFixed(numDecimales);
            if (!(des3 === 0))
                total = parseFloat(total - (total * (des3 / 100))).toFixed(numDecimales);

            if (boni > 0) {
                var sReturnModal = document.getElementsByClassName("returnmodal")[c].innerHTML;
                var sDatosSeparados = sReturnModal.split('|'); sDatosSeparados.shift();
                if (sDatosSeparados.length > 0) {
                    for (var i = sDatosSeparados.length; 0 < i;) {
                        if (idproducto == sDatosSeparados[i - 3]) {
                            var cantidad_parcial = 0;
                            cantidad_parcial = parseFloat(sDatosSeparados[i - 2]) + cantidad;
                            costo = parseFloat(total / cantidad_parcial).toFixed(numDecimales);
                        } else {
                            total = parseFloat(total - parseFloat(parseFloat(sDatosSeparados[i - 2]) * parseFloat(sDatosSeparados[i - 1])).toFixed(numDecimales)).toFixed(numDecimales);
                            costo = parseFloat(total / cantidad).toFixed(numDecimales);
                        }
                        i -= 3;
                    }
                }
            } else
                costo = parseFloat(total / cantidad).toFixed(numDecimales);

            if (costo == "NaN")
                costo = 0;
            costofacturar = costo;
            s_total = ((total * 100) / (100 + (igvLocal * 100)));

            document.getElementsByClassName("txtprecio")[c].value = (parseFloat(s_total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtprecioigv")[c].value = (parseFloat(total).toFixed(numDecimales).toString());
            document.getElementsByClassName("txtcosto")[c].value = parseFloat(costo);
            document.getElementsByClassName("txtcostofacturar")[c].value = parseFloat(costofacturar);
            c++;
        });
    }
});

function fnListaUnidadMedida(idunidadmedida) {
    var select = '<option value="" >[SELECCIONE]</option>';

    for (var i = 0; i < unidadMedida.length; i++) {
        if (idunidadmedida == unidadMedida[i].idunidadmedida) {
            select += '<option value="' + unidadMedida[i].idunidadmedida + '" selected>' + unidadMedida[i].descripcion + '</option>';
        }
        else {
            select += '<option value="' + unidadMedida[i].idunidadmedida + '">' + unidadMedida[i].descripcion + '</option>';
        }
    }

    return '<select class="cboUnidadMedida" style="width:150px;" disabled>' + select + '</select>';
}

$(document).on('click', '.cboUnidadMedida', function () {
    if (this.value != '') {
        var fila = this.parentNode.parentNode;

        objUnidadMedida = {
            iduma: this.value
        };
    }
});