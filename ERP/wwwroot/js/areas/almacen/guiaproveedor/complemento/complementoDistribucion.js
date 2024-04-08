var CD_tbldistribucion;
var CD_tblproductos;

var CD_cmbsucursal = $('#CD_cmbsucursal');

var CD_txtidlaboratorio = $('#CD_txtidlaboratorio');
var CD_txtlaboratorio = $('#CD_txtlaboratorio');
var CD_cmbclase = $('#CD_cmbclase');
var CD_cmbsubclase = $('#CD_cmbsubclase');
var CD_txtproducto = $('#CD_txtproducto');

var CD_txtidproducto = $('#CD_txtidproducto');
var CD_txtidalmacensucursal = $('#CD_txtidalmacensucursal');
var CD_txtidstock = $('#CD_txtidstock');
var CD_lblproducto = document.getElementById('CD_lblproducto');
var CD_spastockactual = document.getElementById('CD_lblstockactual');
var CD_lbllaboratorio = document.getElementById('CD_lbllaboratorio');

var CD_campoLoteCliente = document.getElementById("CD_campoLoteCliente");
var CD_campoFechaVencimientoCliente = document.getElementById("CD_campoFechaVencimientoCliente");

var CD_arrayguias = [];
var CD_timerbusqueda;

$(document).ready(function () {
    CD_tblproductos = $('#CD_tblproductos').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()
    });
    CD_tbldistribucion = $('#CD_tbldistribucion').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [3],
                "visible": false,
                "searchable": false
            }
        ]
    });

    CD_cargarcombo_almacenes();

});

function CD_ListarProductos() {
    let controller = new ProductoController();
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sSucursalAlmacen += obj[i].value;
            else
                sSucursalAlmacen += "_" + obj[i].value;

            contadorInterno += 1;
        }
    }

    let params = {
        tipoproducto: 'PT',
        codigo: '',
        nombreproducto: CD_txtproducto.val(),
        laboratorio: CD_txtidlaboratorio.val(),
        clase: CD_cmbclase.val(),
        subclase: CD_cmbsubclase.val(),
        estado: 'HABILITADO',
        idsucursalalmacen: sSucursalAlmacen,
        top: '100'
    };

    controller.ListarProductosxAlmacenSucursal_V2(params, CD_cargarProductos);
}
function CD_ListarProductosnuevo() {
    var contadorInterno = 0;
    var sSucursalAlmacen = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sSucursalAlmacen += obj[i].value;
            else
                sSucursalAlmacen += "_" + obj[i].value;

            contadorInterno += 1;
        }
    }

    let controller = new ProductoController();
    let params = {
        tipoproducto: 'PT',
        codigo: '',
        nombreproducto: '',
        laboratorio: '',
        clase: '',
        estado: 'HABILITADO',
        idsucursalalmacen: sSucursalAlmacen,
        top: '100'
    };

    controller.ListarProductosxAlmacenSucursal_V2(params, CD_cargarProductos);
}
function CD_cargarProductos(data) {
    if (data.length > 0) {
        CD_tblproductos.clear().draw(false);
        for (let j = 0; j < data.length; j++) {
            if (data[j].mensaje === "ok") {
                let datos = JSON.parse(data[j].objeto);

                for (let i = 0; i < datos.length; i++) {
                    let fila = CD_tblproductos.row.add([
                        datos[i]["ID"],
                        datos[i]["CODIGO"],
                        datos[i]["ABREVIATURA"],
                        datos[i]["LABORATORIO"],
                        datos[i]["LOTE"],
                        datos[i]["STOCKACTUAL"],
                        datos[i]["STOCKINDIVIDUAL"],
                        datos[i]["ABC"],
                        '<button class="btn btn-xs btn-success CD_btnpasarproducto"><i class="fas fa-check fa-1x"></i></button>'
                        + '<button class="btnanalisisproducto " codigo="' + datos[i]["CODIGO"] + '" producto="' + datos[i]["ABREVIATURA"] + '" laboratorio="' + datos[i]["LABORATORIO"] + '"  idproducto="' + datos[i]["ID"] + '"  idproveedor="' + datos[i]["IDPROVEEDOR"] + '"><i class="fas fa-cash-register"></i></button>'
                    ]).draw(false).nodes();
                    $(fila).attr('tabindex', i);
                    $(fila).attr('onkeydown', 'movertabla(' + i + ')');
                    $(fila).attr('idalmacensucursal', datos[i]["IDALMACENSUCURSAL"]);
                    $(fila).attr('idstock', datos[i]["IDSTOCK"]);
                }
            }
        }
    }
}

$("#CD_tblproductos tbody").on('click', 'tr', function () {
    $(this).addClass('selected').siblings().removeClass('selected');
    let idproducto = $(this).find('td').eq(0).html();
    let nombreproducto = $(this).find('td').eq(2).html();
    let laboratorio = $(this).find('td').eq(3).html();
    let stockactual = $(this).find('td').eq(5).html();
    let idalmacensucursal = this.getAttribute("idalmacensucursal");
    let idstock = this.getAttribute("idstock");
    CD_fncargaproductoseleccionado(idproducto, nombreproducto, laboratorio, stockactual, idalmacensucursal, idstock);

});

function CD_fncargaproductoseleccionado(idproducto, nombreproducto, laboratorio, stockactual, idalmacensucursal, idstock) {
    fncd_guardardatostabla();
    let iditem = idproducto;

    CD_txtidproducto.val(iditem);
    CD_txtidalmacensucursal.val(idalmacensucursal);
    CD_txtidstock.val(idstock);
    CD_lblproducto.innerHTML = nombreproducto;
    CD_lbllaboratorio.innerHTML = laboratorio;
    CD_spastockactual.innerHTML = stockactual;
    CD_listarProveedoresDistribuir(iditem, CC_cmbrango.val());
    cdfn_cargaritemspreguardados(iditem, idstock);
}
function fncd_guardardatostabla() {
    if (CD_arrayguias.length == 0)
        CD_fnCargarGuiasProveedor();
    CD_fnGuardarDetallexProveedor();
}
function CD_fnCargarGuiasProveedor() {
    var c = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            return;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            let guia = new AGuiaSalida();
            guia.idempresa = IDEMPRESA;
            guia.idsucursal = IDSUCURSAL;
            guia.idproveedor = (datatable[c][0] === '') ? '0' : datatable[c][0];
            guia.proveedor = (datatable[c][2] === '') ? '0' : datatable[c][2];
            guia.idcorrelativo = $('#CC_cmbserie option:selected').attr('idcorrelativo');
            guia.idcaja = $('#CC_cmbserie option:selected').attr('idcaja');
            guia.encargado = NOMBREUSUARIO;
            guia.idalmacensucursalorigen = CD_txtidalmacensucursal.val();
            guia.seriedoc = $('#CC_cmbserie').val();
            guia.fechatraslado = CC_fechatraslado.val();
            CD_arrayguias[c] = guia;
            c++;
        });
    } catch (error) {
        return null
    }
}
function CD_fnGuardarDetallexProveedor() {
    var array = [];
    var c = 0;
    var cantidadenviar = 0;
    try {
        let datatable = CD_tbldistribucion.rows().data();
        if (!(datatable.length > 0))
            return;
        var filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
        filas.forEach(function (e) {
            let posguia = CD_fnBuscarGuiaDistribucion(datatable[c][0]);
            let detalle = new ADetalleGuiaSalida();
            detalle.idproveedor = (datatable[c][0] === '') ? '0' : datatable[c][0];
            detalle.idproducto = (datatable[c][3] === '') ? '0' : datatable[c][3];
            detalle.laboratorio = CD_lbllaboratorio.innerHTML;
            detalle.producto = CD_lblproducto.innerHTML;
            detalle.idstock = CD_txtidstock.val();
            detalle.cantidadgenerada = document.getElementsByClassName("cd_txtcantidadindividual")[c].value;
            if (CC_cmbproveedorcliente.value == "CLIENTE") {
                detalle.lotecliente = document.getElementsByClassName("cd_txtlotecliente")[c].value;
                detalle.fechavencimientocliente = document.getElementsByClassName("cd_txtfechavencimientocliente")[c].value;
            }
            detalle.idalmacensucursalorigen = CD_txtidalmacensucursal.val();
            cantidadenviar = parseFloat(detalle.cantidadgenerada);
            if (cantidadenviar > 0)
                CD_fnGuardarDetalle(posguia, detalle);
            else
                CD_fnRevisarRegistro(posguia, detalle);
            c++;
        });
        if (total > 0) {
            let objdetalledistribucion = new detalledistribucion();
            objdetalledistribucion.idproducto = CD_txtidproducto.val();
            objdetalledistribucion.detalle = JSON.stringify(array);
            return objdetalledistribucion;
        } else
            return null;

    } catch (error) {
        return null
    }
}

function CD_fnGuardarDetalle(pos, obj) {
    let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(pos, obj.idproducto, obj.idstock);
    let detalle = [];
    let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0)
        detalle = JSON.parse(stringdetalle);
    else
        detalle = [];

    if (posdetalle == -1) {
        detalle[detalle.length] = obj;
        CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
    }
    else {
        detalle[posdetalle] = obj;
        CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
    }
}
function CD_fnRevisarRegistro(pos, obj) {
    let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(pos, obj.idproducto, obj.idstock);
    let detalle = [];
    let stringdetalle = CD_arrayguias[pos].jsondetalle;
    if (stringdetalle.length > 0) {
        detalle = JSON.parse(stringdetalle);
        if (posdetalle >= 0) {
            detalle.splice(posdetalle, 1);
            CD_arrayguias[pos].jsondetalle = JSON.stringify(detalle);
        }
    }
}
function CD_fnBuscarDetalleGuiaDistribucion(pos, idproducto, idstock) {
    if (CD_arrayguias[pos].jsondetalle.length > 0) {
        let detalle = JSON.parse(CD_arrayguias[pos].jsondetalle);
        for (let i = 0; i < detalle.length; i++) {
            if (detalle[i].idproducto == idproducto && detalle[i].idstock == idstock) {
                return i;
            }
        }
        return -1;
    }
    else {
        return -1;
    }
}

function CD_fnBuscarGuiaDistribucion(idproveedor) {
    for (let i = 0; i < CD_arrayguias.length; i++) {
        if (CD_arrayguias[i].idproveedor == idproveedor) {
            return i;
        }
    }
    return -1;
}

function cdfn_cargaritemspreguardados(idproducto, idstock) {
    let datatable = CD_tbldistribucion.rows().data();
    for (let i = 0; i < CD_arrayguias.length; i++) {
        if (datatable[i][0] == CD_arrayguias[i].idproveedor) {
            let stringdetalle = CD_arrayguias[i].jsondetalle;
            if (stringdetalle.length > 0) {
                detalle = JSON.parse(stringdetalle);
                let posdetalle = CD_fnBuscarDetalleGuiaDistribucion(i, idproducto, idstock);
                if (posdetalle >= 0) {
                    document.getElementsByClassName("cd_txtcantidadindividual")[i].value = detalle[posdetalle].cantidadgenerada;
                    if (CC_cmbproveedorcliente.value == "CLIENTE") {
                        document.getElementsByClassName("cd_txtlotecliente")[i].value = detalle[posdetalle].lotecliente;
                        document.getElementsByClassName("cd_txtfechavencimientocliente")[i].value = detalle[posdetalle].fechavencimientocliente;
                    }
                }
            }
        }
    }
}

function CD_listarProveedoresDistribuir(idproducto, rango) {
    var rp = CD_sugerido.checked;
    var rps = parseInt(0);
    if (rp == true) {
        rps = parseInt(1);
    }

    let fechaActual = new Date();
    fechaActual.setMonth(fechaActual.getMonth() + 6);
    let nuevaFecha = fechaActual.toISOString().split('T')[0];

    var campoLote = "";
    var campoFechavencimiento = "";
    if (CC_cmbproveedorcliente.value == "CLIENTE") {
        campoLote = '<input type="text" class="text-center cd_txtlotecliente" style="width:100px;">';
        campoFechavencimiento = '<input type="date" class="text-center cd_txtfechavencimientocliente" value="' + nuevaFecha + '" style="width:100px;">';
    }

    CD_tbldistribucion.clear().draw(false);
    for (let i = 0; i < listaproveedoresseleccionadas.length; i++) {
        CD_tbldistribucion.row.add([
            listaproveedoresseleccionadas[i]["id"],
            listaproveedoresseleccionadas[i]["ruc"],
            listaproveedoresseleccionadas[i]["descripcion"],
            idproducto,
            '<input type="number" class="text-center cd_txtcantidadindividual" style="width:100px;" value="0" min="0">',
            campoLote,
            campoFechavencimiento
        ]).draw(false).nodes();
    }
}

$(document).on('change keyup', '.cd_txtcantidadindividual', function () {
    let cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 0; $(this).val(0); }
    let stockdisponible = parseFloat(CD_lblstockactual.innerHTML);
    let total = fncd_calcularmontos();
    let diferencia = stockdisponible - total;
    let subtotal = total - cantidad;
    let faltante = stockdisponible - subtotal;
    if (diferencia < 0) {
        mensaje("I", "Usted solo cuenta con <strong>" + faltante + "</strong> Unidades");
        $(this).val(faltante);
    }
});
function fncd_calcularmontos() {
    let filas = document.querySelectorAll("#CD_tbldistribucion tbody tr");
    let c = 0;
    let total = 0.0;
    let datatable = CD_tbldistribucion.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("cd_txtcantidadindividual")[c].value);
            if (isNaN(cantidad) || cantidad < 1) {
                document.getElementsByClassName("cd_txtcantidadindividual")[c].value = "0";
                cantidad = 0;
            }
            total += cantidad;
            c++;
        });
    return total;
}

$('#cdbtn_validar').click(function () {
    fncd_guardardatostabla();
    CG_fnCargarGuias();
    $('#btnnextviewdistribucion').click();
});

$('#btnnuevoregistro').click(function () {
    //LIMPIAR ARRAYS
    listasucursalesseleccionadas = [];
    listaproveedoresseleccionadas = [];
    CD_arrayguias = [];
    CC_cmbrango.val("");
    CC_txtnrodocumento.value = "";
    CC_txtidcliente.value = "";
    CC_txtnombrecliente.value = "";
    //LIMPIAR PANEL DE BUSQUEDA
    $('#CD_form-panel-busqueda-producto').trigger('reset');
    CD_txtidlaboratorio.val('');
    //LIMPIAR DESCRIPCIÓN DE ITEM
    CD_txtidproducto.val("");
    CD_lblproducto.innerHTML = "";
    CD_lbllaboratorio.innerHTML = "";
    CD_spastockactual.innerHTML = "";
    //LIMPIAR CHECKBOXS
    let cheks = document.getElementsByClassName('checkbox');
    for (let i = 0; i < cheks.length; i++) {
        cheks[i].checked = false;
    }
    $('#btnpreview').click();
});


$('#CD_txtlaboratorio').click(function () {
    $('#ML_idmodallaboratorio').modal();
});
$('#limpiartbl').click(function () {
    CD_limpiarpanelbusqueda();
});
function CD_limpiarpanelbusqueda() {
    CD_txtidlaboratorio.val('');
    CD_txtlaboratorio.val('');
    CD_cmbclase.val('');
    CD_cmbsubclase.val('');
    CD_txtproducto.val('');
    CD_ListarProductosnuevo();
}
CD_cmbclase.change(function () {
    var cmb = document.getElementById('CD_cmbsubclase');
    cmb.innerHTML = '';
    var option = document.createElement('option');
    option.value = '';
    option.text = '[SELECCIONE]';
    cmb.appendChild(option);
    for (var i = 0; i < lListaSubClases.length; i++) {
        if (lListaSubClases[i].idclase == CD_cmbclase[0].value) {
            option = document.createElement('option');
            option.value = lListaSubClases[i].idsubclase;
            option.text = lListaSubClases[i].descripcion;
            cmb.appendChild(option);
        }
    }

    CD_ListarProductos();
});
CD_cmbsubclase.change(function () {
    CD_ListarProductos();
});
CD_txtlaboratorio.on('keyup', function (e) {
    clearTimeout(CD_timerbusqueda);
    var $this = this;
    CD_timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            CD_ListarProductos();
        }

    }, 1000);
});
CD_txtproducto.on('keyup', function (e) {
    clearTimeout(CD_timerbusqueda);
    var $this = this;
    CD_timerbusqueda = setTimeout(function () {
        if (e.key != 'Enter') {
            CD_ListarProductos();
        }
    }, 1000);
});

//$(document).on('click', '.ML_btnpasarlaboratorio', function (e) {
//    var columna = ML_tbllaboratorio.row($(this).parents('tr')).data();
//    CD_txtidlaboratorio.val(columna[0]);
//    CD_txtlaboratorio.val(columna[1]);
//    $('#ML_idmodallaboratorio').modal('hide');
//    CD_ListarProductos();
//});
$(document).on('click', '.close', function (e) {
    var arrIdLabs = [];
    ML_tbllaboratorio.$('.checkboxLaboratorio').each(function () {
        let inic = $(this);
        if (inic[0].checked) {
            let idlaboratorio = $(this).attr('idlaboratorio');
            let descripcion = $(this).attr('descripcion');
            arrIdLabs.push({ idlaboratorio, descripcion });
        }
    });

    if (arrIdLabs.length > 0) {
        var desLabs = "";
        var idLabs = "";
        for (var i = 0; i < arrIdLabs.length; i++) {
            if (i == 0) {
                desLabs += arrIdLabs[i].descripcion;
                idLabs += arrIdLabs[i].idlaboratorio;
            } else {
                desLabs += ", " + arrIdLabs[i].descripcion;
                idLabs += "," + arrIdLabs[i].idlaboratorio;
            }
        }
        CD_txtlaboratorio.val(desLabs);
        CD_txtidlaboratorio.val(idLabs);
    } else {
        CD_txtlaboratorio.val("");
        CD_txtidlaboratorio.val("");
    }
    CD_ListarProductos();
});

var popupanalisis = null;
var idanterioranalisis = '';
$(document).on('click', '.btnanalisisproducto', function (e) {
    var fila = this.parentNode.parentNode;
    var idproducto = this.getAttribute('idproducto');
    var idproveedor = null;
    var producto = this.getAttribute('CODIGO');
    var codigo = this.getAttribute('producto');
    var lab = this.getAttribute('LABORATORIO');
    //var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto?idproducto=' + idproducto + '&&idproveedor=' + idproveedor;
    var url = ORIGEN + '/Almacen/AProducto/AnalisisProducto';
    if (popupanalisis == null || popupanalisis.closed) {
        idanterioranalisis = idproducto;
        popupanalisis = window.open(url, "Análisis de producto", 'width=1100,height=600,Titlebar=NO,Toolbar=NO');
        popupanalisis.addEventListener('DOMContentLoaded', function () {
            popupanalisis.focus();
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();
            //popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
            popupanalisis.txtcodarticuloanalisis.value = producto;
            popupanalisis.txtarticulodescripcionanalisis.value = codigo;
            popupanalisis.txtlaboratorionombreanalisis.value = lab;
        });
    }
    else {
        if (idanterioranalisis != idproducto) {
            popupanalisis._idproductoanalisis = idproducto;
            popupanalisis._idproveedoranalisis = idproveedor;
            popupanalisis.fnBuscarPrecioProducto(idproducto);
            popupanalisis.fnBuscarProducto(idproducto);
            popupanalisis.fnbuscaranalisis();
        }
        idanterioranalisis = idproducto;
        popupanalisis.focus();
        popupanalisis.txtcodarticuloanalisis.value = fila.getElementsByClassName('detalle_codpro')[0].innerText;
        popupanalisis.txtarticulodescripcionanalisis.value = fila.getElementsByClassName('detalle_nompro')[0].innerText;
        popupanalisis.txtlaboratorionombreanalisis.value = fila.getElementsByClassName('laboratorio')[0].innerText;
    }
});