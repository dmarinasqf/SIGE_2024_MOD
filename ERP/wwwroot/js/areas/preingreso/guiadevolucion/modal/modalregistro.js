var txtRDGidpreingreso = document.getElementById('txtRDGidpreingreso');
var txtRDGidfactura = document.getElementById('txtRDGidfactura');
var txtRDGidguia = document.getElementById('txtRDGidguia');
var txtRDGnumguia = document.getElementById('txtRDGnumguia');
var txtRDGnumpreingreso = document.getElementById('txtRDGnumpreingreso');
var txtRDGnumorden = document.getElementById('txtRDGnumorden');
var txtRDGruc = document.getElementById('txtRDGruc');
var txtRDGrazonsocial = document.getElementById('txtRDGrazonsocial');
var txtRDGtipodocumento = document.getElementById('txtRDGtipodocumento');
var txtRDGfechadocumento = document.getElementById('txtRDGfechadocumento');
var txtRDGfecha = document.getElementById('txtRDGfecha');
var txtRGDserie = document.getElementById('txtRGDserie');
var txtRGDnumdoc = document.getElementById('txtRGDnumdoc');
var cmbRDGdocumento = document.getElementById('cmbRDGdocumento');
var txtRGDobservaciones = document.getElementById('txtRGDobservaciones');
var tblRDGguiadedevolucion = document.getElementById('tblRDGguiadedevolucion');
var tblRDGtbodydetalle = document.getElementById('tblRDGtbodydetalle');

//buttons
var btnRDGguardarguia = document.getElementById('btnRDGguardarguia');
var btnRDGimprimirguia = document.getElementById('btnRDGimprimirguia');
var btnRDgsalirguia = document.getElementById('btnRDgsalirguia');

//formulario
var formguias = document.getElementById('formguias');
var arrayMotivoDevolucion = [];

$(document).ready(function () {
    let controller = new DocumentoTributarioController();
    controller.ListarDocumentosSucursal(0, function (data) {
     
        var option = '';
        var id = '';
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].descripcion.toUpperCase() == "GUIA  REMISION REMITENTE") {
                option += '<option value="' + data[i].iddocumento + '" idcajasucursal="' + data[i].idcajasucursal + '" selected>' + data[i].descripcion + '</option>';
                id = data[i].iddocumento;
            }
        }
        cmbRDGdocumento.innerHTML = option;
        ListarMotivoDevolucion();
        //cmbRDGdocumento.value = id;
    });
});

function fnRDGgetdevolucioncompleta(obj) {
    let controller = new GuiaInternaDevolucionController();
    controller.VerificarFacturaCantDevuelta(obj, function (data) {
        $('#modalguiainternadevolucion').modal('show');       
        fnRDGcargardatosformulario(data);

    });
}
function fnRDGbuscarguia(obj) {
    let controller = new GuiaInternaDevolucionController();
    controller.GetGuiaCompleta(obj, fnRDGcargardatosformulario);
}
function fnRDGcargardatosformulario(data) {
    
    var factura = JSON.parse(data[0].factura)[0];
    var cabecera = JSON.parse(data[0].cabecera)[0];
    var detalle = JSON.parse(data[0].detalle);
    if (cabecera.idguia != '')
        btnRDGimprimirguia.disabled = false;
    else
        btnRDGimprimirguia.disabled = true;

    
    txtRDGidfactura.value = factura.idfactura;
    txtRGDserie.value = factura.serie;
    txtRGDnumdoc.value = factura.numdoc;
    txtRDGtipodocumento.value = factura.documento;
    txtRDGfechadocumento.value = moment(factura.fecha).format('DD/MM/YYYY');
    
    txtRDGnumguia.value = cabecera.codigoguia;
    txtRDGnumpreingreso.value = cabecera.codigopreingreso;
    txtRDGnumorden.value = cabecera.codigoorden;
    txtRDGruc.value = cabecera.ruc;
    txtRDGrazonsocial.value = cabecera.razonsocial;
    txtRDGfecha.value = moment(cabecera.fechaguia).format('DD/MM/YYYY');
    txtRGDobservaciones.value = cabecera.observaciones;
    txtRDGidpreingreso.value = cabecera.idpreingreso;
    txtRDGidguia.value = cabecera.idguia;
    if (cabecera.iddocumento == '')
        if (cmbRDGdocumento.getElementsByTagName('option').length>0)
            cmbRDGdocumento.value = cmbRDGdocumento.options[0].value;
    else
        cmbRDGdocumento.value = cabecera.iddocumento;
    var fila = '';
    for (var i = 0; i < detalle.length; i++) {
        var combo = CrearComboCajaMotivoDevolucion(i, detalle[i].idmotivodevolucion);
        fila += '<tr idproducto="' + detalle[i].idproducto + '" iddetalleguia="' + detalle[i].iddetalleguia + '" iddetallepreingreso="' + detalle[i].iddetallepreingreso + '">';
        fila += '<td>' + (i + 1) + '</td>';
        fila += '<td>' + detalle[i].codigoproducto + '</td>';
        fila += '<td>' + detalle[i].producto + '</td>';
        fila += '<td>' + detalle[i].laboratorio + '</td>';
        //fila += '<td><input class="form-control form-control-sm cantidad" type="number" min=1 value="' + detalle[i].cantidad + '"/></td>';
        //SEMANA2
        fila += '<td><input class="form-control form-control-sm cantidad" type="number" readonly min=1 value="' + detalle[i].cantidad + '"/></td>';
        //fila += '<td class="motivodevolucion text-uppercase" contenteditable="true">' + detalle[i].motivodevolucion + '</td>';
        fila += '<td>' + combo + '</td>';
        fila += '<td><input class="form-control form-control-sm lote" value="' + detalle[i].lote + '" /></td>';
        fila += '<td><input type="date" class="form-control form-control-sm fechavencimiento" value="' + (moment(detalle[i].fechavencimiento).format('YYYY-MM-DD')) + '"/></td>';
        fila += '</tr>';
    }
    tblRDGtbodydetalle.innerHTML = fila;
}
function fnRDGgetdetalleguia() {
    var filas = document.querySelectorAll('#tblRDGtbodydetalle tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new GuiaDevolucionDetalle();
        obj.idproducto = e.getAttribute('idproducto');
        obj.iddetalle = e.getAttribute('iddetalleguia');
        if (obj.iddetalle == '')
            obj.iddetalle = 0;
        obj.iddetallepreingreso = e.getAttribute('iddetallepreingreso');
        obj.cantidad = e.getElementsByClassName('cantidad')[0].value;
        //var abc = e.getElementsByClassName('motivodevolucion')[0].value;
        //obj.idmotivodevolucion = e.getElementsByClassName('motivodevolucion')[0].innerText.toString().toUpperCase();
        obj.idmotivodevolucion = e.getElementsByClassName('motivodevolucion')[0].value;
        if (obj.idmotivodevolucion == "0") {
            obj.idmotivodevolucion = e.getElementsByClassName('ctmotivodevolucion')[0].value;
        }
        obj.lote = e.getElementsByClassName('lote')[0].value;
        obj.fechavencimiento = e.getElementsByClassName('fechavencimiento')[0].value;
        array.push(obj);
    });
    return array;
}

formguias.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fnRDGgetdetalleguia().length == 0)
        return;
    var obj = $('#formguias').serializeArray();
    obj[obj.length] = { name: 'idcajasucursal', value: cmbRDGdocumento.options[cmbRDGdocumento.selectedIndex].getAttribute('idcajasucursal') };
    obj[obj.length] = { name: 'jsondetalle', value: JSON.stringify(fnRDGgetdetalleguia()) };
  
    let controller = new GuiaInternaDevolucionController();
    BLOQUEARCONTENIDO('modalguiainternadevolucion', 'Guardando datos...');
    controller.RegistrarEditar(obj, function (data) {      
        var obj = data.objeto;
        alertaSwall('S', 'Guía de devolución guardada', '');
        DESBLOQUEARCONTENIDO('modalguiainternadevolucion');
        fnRDGbuscarguia({ tipo: 'guia', idtabla:obj.idguia});
        btnRDGimprimirguia.disabled = false;
     

    }, function () {
            DESBLOQUEARCONTENIDO('modalguiainternadevolucion');
    });
});

function fnimprimir(id) {
    var href = ORIGEN + `/PreIngreso/GuiaInternaDevolucion/Imprimir_V2/?id=` + id
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR DEVOLUCION');
}


btnRDGimprimirguia.addEventListener('click', function () {
    var codigo = txtRDGnumguia.value;
    fnimprimir(codigo);
});

function ListarMotivoDevolucion() {
    let controller = new GuiaInternaDevolucionController();
    controller.GetMotivoDevolucion(function (data) {
        arrayMotivoDevolucion = data;
    });
}
function BuscarMotivoDevolucion(id) {
    for (var i = 0; arrayMotivoDevolucion.length; i++) {
        if (arrayMotivoDevolucion[i].idmotivodevolucion == id) {
            return true;
        }
    }
    return false;
}

function CrearComboCajaMotivoDevolucion(index, seleccionado) {
    var combo = '<select class="form-control motivodevolucion" id="combo' + index + '" required>';
    combo += '<option value="">SELECCIONAR</option>';
    var contaVal = 0;
    for (var i = 0; i < arrayMotivoDevolucion.length; i++) {
        var selected = '';
        if (arrayMotivoDevolucion[i].idmotivodevolucion == seleccionado) {
            selected = 'selected';
        } else
            contaVal++;

        combo += '<option value="' + arrayMotivoDevolucion[i].idmotivodevolucion + '" ' + selected + '>' + arrayMotivoDevolucion[i].descripcion + '</option>';
    }
    var caja = "";
    if (contaVal == arrayMotivoDevolucion.length) {
        if (seleccionado != null || seleccionado != undefined) {
            combo += '<option value="0" selected>OTRO</option>';
            caja = '<input class="form-control form-control-sm ctmotivodevolucion" value="' + seleccionado + '" type="text" required/>';
        } else {
            combo += '<option value="0">OTRO</option>';
            caja = '<input class="form-control form-control-sm ctmotivodevolucion" type="text" hidden/>';
        }
    } else {
        combo += '<option value="0">OTRO</option>';
        caja = '<input class="form-control form-control-sm ctmotivodevolucion" type="text" hidden/>';
    }
    combo += '</select>';
    combo += caja;

    return combo;
}

$(document).on('change', '.motivodevolucion', function () {
    var filas = document.querySelectorAll('#tblRDGtbodydetalle tr');
    var idcombo = this.id;
    filas.forEach(function (e) {
        var combo = e.getElementsByClassName("motivodevolucion")[0];
        var comboid = combo.id;
        var combovalue = combo.value;

        if (idcombo == comboid) {
            if (combovalue != "0") {
                e.getElementsByClassName("ctmotivodevolucion")[0].setAttribute("hidden", true);
                e.getElementsByClassName("ctmotivodevolucion")[0].removeAttribute("required");
            } else {
                e.getElementsByClassName("ctmotivodevolucion")[0].removeAttribute("hidden");
                e.getElementsByClassName("ctmotivodevolucion")[0].setAttribute("required", "");
            }
        }
    });
});