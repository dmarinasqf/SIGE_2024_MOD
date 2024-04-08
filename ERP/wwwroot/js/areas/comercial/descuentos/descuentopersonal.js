//EARTCOD1008//

var MCD_cmbtipodoc = document.getElementById('MCD_cmbtipodoc');
var MCD_txtnumdocumento = document.getElementById('MCD_txtnumdocumento');
var MCD_txtnombre = document.getElementById('MCD_txtnombre');
var MCD_txtiddescuentoclientedetalle = document.getElementById('MCD_txtiddescuentoclientedetalle');
var MCD_txtidcliente = document.getElementById('MCD_txtidcliente');
var MCD_txtnombredescuento = document.getElementById('MCD_txtnombredescuento');
var MCD_txtdescuento = document.getElementById('MCD_txtdescuento');
var MCD_txtfechaInicio = document.getElementById('MCD_txtfechaInicio');
var MCD_txtfechaTermino = document.getElementById('MCD_txtfechaTermino');
var MCD_formregistro = document.getElementById('MCD_formregistro');
var MCD_btnhistorial = document.getElementById('MCD_btnhistorial');
var mMCDbtnEditar = document.getElementById('mMCDbtnEditar');
var MCD_btnlimpiar = document.getElementById("MCD_btnlimpiar");
var MCDP_btnsucursales = document.getElementById('MCDP_btnsucursales');

var mMCDP_txtNombreDescuento = document.getElementById('mMCDP_txtNombreDescuento');

var MCDP_contenedor_unico_1 = document.getElementById("MCDP_contenedor_unico_1");
var MCDP_contenedor_unico_2 = document.getElementById("MCDP_contenedor_unico_2");
var MCDP_contenedor_unico_3 = document.getElementById("MCDP_contenedor_unico_3");
var MCDP_contenedor_masivo_1 = document.getElementById("MCDP_contenedor_masivo_1");

var MCDP_btnTodos = document.getElementById("MCDP_btnTodos");
var MCDP_btnAgregarCliente = document.getElementById("MCDP_btnAgregarCliente");

var operacion_mantenimiento = "AGREGAR";
var descuento_sucursales = [];
var datatable_sucursales;
var datatable_clientes;

$(document).ready(function () {
    MCD_fnListarDocumentoPersonal();
    calendariofechainput();
    ObtenerCanalesVenta();//EARTCOD1008.1
    ProductosTiposListar();//EARTCOD1008.1
    PromocionPackSucursales()//EARTCOD1008.1
    datatable_clientes = $('#MCDP_tabla_clientes').DataTable(
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
});



function MCD_fnListarDocumentoPersonal() {
    let controller = new DocumentoPersonalController();
    controller.Listar('MCD_cmbtipodoc', null);
    MCD_txtnumdocumento.setAttribute('pattern', "[0-9]+$");
}

MCD_cmbtipodoc.addEventListener('change', function () {
    MCD_verificarnumdigitosdedocumento();
});

function MCD_verificarnumdigitosdedocumento() {
    var numdigitos = parseInt($('#MCD_cmbtipodoc option:selected').attr('longitud'));

    MCD_txtnumdocumento.value = "";
    MCD_txtnombre.value = "";
    MCD_txtidcliente.value = "";
    MCD_txtiddescuentoclientedetalle.value = "";

    MCD_txtnumdocumento.setAttribute('maxlength', numdigitos);
    MCD_txtnumdocumento.setAttribute('minlength', numdigitos);
    MCD_txtnumdocumento.setAttribute('pattern', "[0-9]+$");
}

MCD_txtnumdocumento.addEventListener('keyup', function (e) {
    e.preventDefault();
    let controller = new ApiController();
    controller.BuscarCliente(MCD_txtnumdocumento.value, MCD_fnbuscarCliente);
});

MCD_formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    var arrayCliente;
    var arrayDetalle;
    var btodos = true;
    if (MCDP_crunico.checked) {
        btodos = false;
        var arrayCrUnico = [{
            idcliente: MCD_txtidcliente.value,
            iddescuentoclientedetalle: MCD_txtiddescuentoclientedetalle.value == "" ? 0 : MCD_txtiddescuentoclientedetalle.value
        }];
        arrayDetalle = JSON.stringify(arrayCrUnico);
    } else {
        var returnFunction = getClientes();
        btodos = returnFunction.btodos;
        arrayDetalle = returnFunction.array;
    }

    var arrayCliente = [{
        iddescuentocliente: MCD_txtiddescuentocliente.value == "" ? 0 : MCD_txtiddescuentocliente.value,
        nombredescuento: MCD_txtnombredescuento.value,
        descuentocanal: MCD_txtdescuento.value,
        fechainicio: MCD_txtfechaInicio.value.split('/').join('-'),
        fechatermino: MCD_txtfechaTermino.value.split('/').join('-'),
        productostipo: ObtenerTiposDeProductosSeleccionados(),
        canalesventa: ObtenerCanalesDeVentaSeleccionados(),
        sucursales: ObtenerSucursalesSeleccionadas(),
        todos: btodos,
        jsondetalle: arrayDetalle
    }]
    if (operacion_mantenimiento == 'AGREGAR') {
        AgregarDescuentoCliente(arrayCliente);
    } else if (operacion_mantenimiento == 'EDITAR') {
        EditarDescuentoCliente(arrayCliente);
    }
});

MCD_btnhistorial.addEventListener('click', function () {
    ListarDescuentoCliente();
});

//EARTCOD1008.1
MCD_btnlimpiar.addEventListener('click', function () {
    limpiar_form();
    operacion_mantenimiento = "AGREGAR";
    $('#MCD_txtnumdocumento').attr('readonly', false);
    $('#MCD_cmbtipodoc').attr('disabled', false);
});

mMCDP_btnFiltrarDescuentosCreados.addEventListener('click', function () {
    ListarDescuentoCliente();
});

function ValidacionForm() {
    var obj = { estado: true, mensaje: "success" }

    if (productos_tipo.length == 0) {
        obj.estado = false;
        obj.mensaje = "Seleccione al menos un tipo de producto antes de registrar el descuento";
        return obj;
    }

    if (canales_venta.length == 0) {
        obj.estado = false;
        obj.mensaje = "Seleccione al menos un canal de ventas antes de registrar el descuento";
        return obj;
    }

    if (descuento_sucursales.length == 0) {
        $('#modalDescuentoClienteSucursales').modal('show');
        obj.estado = false;
        obj.mensaje = "Seleccione al menos una sucursal antes de registrar el descuento";
        return obj;
    }
    return obj;
}
//--EARTCOD1008.1

function MCD_fnbuscarCliente(data) {
    if (data != null) {
        if (MCD_cmbtipodoc.value == data.iddocumento) {
            if (MCD_cmbtipodoc.value == 1) {
                MCD_txtidcliente.value = data.idcliente;
                MCD_txtnombre.value = data.descripcion + " " + data.apepaterno + " " + data.apematerno;
            } else {
                MCD_txtidcliente.value = data.idcliente;
                MCD_txtnombre.value = data.descripcion;
            }
        }
    } else {
        MCD_txtnombre.value = '';
    }
}

function AgregarDescuentoCliente(arrayCliente) {
    var obj = arrayCliente[0];
    if (ValidacionForm().estado) {
        let controller = new DescuentoController();
        controller.AgregarDescuentoCliente(obj, function (data) {
            if (data.mensaje == 'success') {
                limpiar_form();
                mensaje('S', 'Descuento agregado Exitosamente');
            } else if (data.mensaje == 'existente') {
                mensaje('W', 'Ya existe un descuento vigente aplicado al cliente');
            } else if (data.mensaje == 'error') {
                mensaje('W', 'Error: verifique sus campos ingresados');
            }
        });
    } else {
        mensaje('W', ValidacionForm().mensaje);
        return obj;
    }
}

function EditarDescuentoCliente(arrayCliente) {
    var obj = arrayCliente[0];
    if (ValidacionForm().estado) {
        let controller = new DescuentoController();
        controller.EditarDescuentoCliente(obj, function (data) {
            if (data.mensaje == 'success') {
                limpiar_form();
                mensaje('S', 'Los cambios se guardaron correctamente');
            } else if (data.mensaje == 'existente') {
                mensaje('W', 'Ya existe un descuento vigente aplicado al cliente');
            } else {
                mensaje('W', 'Error: verifique los datos ingresados');
            }
        });
    } else {
        mensaje('W', ValidacionForm().mensaje);
        return obj;
    }
}

function GenerarTablaDescuentoCliente(data) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_caja_chica">
        <thead class="table bg-danger text-light">
            <tr class="group-font-sm">
                <th class="py-1 align-middle">N°</th>
                <th class="py-1 align-middle">NOMBRE DESCUENTO</th>
                <th class="py-1 align-middle">DESCUENTO</th>
                <th class="py-1 align-middle">FECHA INICIO</th>
                <th class="py-1 align-middle">FECHA TERMINO</th>
                <th class="py-1 align-middle"></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr>"
            + "<td style='vertical-align: middle;'>" + item.iddescuentocliente + "</td>"
            + "<td style='vertical-align: middle;'>" + item.nombredescuento + "</td>"
            + "<td style='vertical-align: middle;'>" + item.descuentocanal + "</td>"
            + "<td style='vertical-align: middle;'>" + item.fechainicio.split('T')[0].split('-').reverse().join('/') + "</td>"
            + "<td style='vertical-align: middle;'>" + item.fechatermino.split('T')[0].split('-').reverse().join('/') + "</td>"
            + '<td><button class="btn btn-dark" onclick="BuscarDescuentoCliente(\'' + item.iddescuentocliente + '\')"><i class=\'bi bi-search h6\'></i></button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

function BuscarDescuentoCliente(iddescuentocliente) {
    limpiar_form();
    var obj = { iddescuentocliente: iddescuentocliente };

    let controller = new DescuentoController();
    controller.BuscarDescuentoCliente(obj, function (data) {
        var cabecera = JSON.parse(data[0].CABECERA);
        var detalle = JSON.parse(data[0].DETALLE);

        var fecha1 = cabecera[0].fechainicio.split('T')
        var fecha1_ = fecha1[0].split('-').reverse().join('/');
        var fecha2 = cabecera[0].fechatermino.split('T')
        var fecha2_ = fecha2[0].split('-').reverse().join('/');

        $('#MCD_txtiddescuentocliente').val(cabecera[0].iddescuentocliente);
        $('#MCD_txtnombredescuento').val(cabecera[0].nombredescuento);
        $('#MCD_txtdescuento').val(cabecera[0].descuentocanal);
        $('#MCD_txtfechaInicio').val(fecha1_);
        $('#MCD_txtfechaTermino').val(fecha2_);
        var canales = cabecera[0].canalesventa;
        var canalesarray = canales != null ? canales.split(',') : '';
        var productostipo = cabecera[0].productostipo;
        var productostipoarray = productostipo != null ? productostipo.split(',') : '';
        var sucursales = cabecera[0].sucursales;
        var sucursalesarray = sucursales != null ? sucursales.split(',') : '';

        SeleccionarCanalesVentaConProductosTipo(canalesarray, productostipoarray);
        SeleccionarSucursales(sucursalesarray)

        $("#MCDP_tabla_clientes tbody").empty();
        datatable_clientes.clear();
        if (detalle.length > 1) {
            MCDP_crmasivo.removeAttribute("disabled");
            $("#MCDP_crmasivo").click();
            for (var i = 0; i < detalle.length; i++) {
                var fila = datatable_clientes.row.add([
                    detalle[i].nroDocumento,
                    detalle[i].nombre,
                    "<td class='py-0 text-center'><button type='button' class='btn btn-danger btn-sm btnQuitarCliente'><i class='fa fa-trash'></i></button></td>"
                ]).draw(false).node();
                fila.setAttribute('idcliente', detalle[i].idcliente);
                fila.setAttribute('iddescuentoclientedetalle', detalle[i].iddescuentoclientedetalle);
            }
            fnActivarDesactivarCamposxTipoRegistro("MULTIPLES");
        } else {
            if (cabecera[0].todos) {
                MCDP_crmasivo.removeAttribute("disabled");
                $("#MCDP_crmasivo").click();
                var fila = datatable_clientes.row.add([
                    detalle[0].nroDocumento,
                    detalle[0].nombre,
                    "<td class='py-0 text-center'><button type='button' class='btn btn-danger btn-sm btnQuitarCliente'><i class='fa fa-trash'></i></button></td>"
                ]).draw(false).node();
                fila.setAttribute('idcliente', detalle[0].idcliente);
                fila.setAttribute('iddescuentoclientedetalle', detalle[0].iddescuentoclientedetalle);
                fnActivarDesactivarCamposxTipoRegistro("TODOS");
            } else {
                MCDP_crunico.removeAttribute("disabled");
                $("#MCDP_crunico").click();
                $('#MCD_txtiddescuentoclientedetalle').val(detalle[0].iddescuentoclientedetalle);
                $('#MCD_txtidcliente').val(detalle[0].idcliente);
                $('#MCD_cmbtipodoc').val(detalle[0].iddocumento);
                $('#MCD_txtnumdocumento').val(detalle[0].nroDocumento);
                $('#MCD_txtnombre').val(detalle[0].nombre);
                fnActivarDesactivarCamposxTipoRegistro("UNICO");
            }
        }        

        $('#modalDescuentoPersonalListar').modal('hide');
        operacion_mantenimiento = "EDITAR";
    });
}

function limpiar_form() {
    $('#MCD_txtiddescuentocliente').val("");
    MCD_txtnumdocumento.value = "";
    MCD_txtnombre.value = "";
    MCD_txtiddescuentoclientedetalle.value = "";
    MCD_txtidcliente.value = "";
    MCD_txtnombredescuento.value = "";
    MCD_cmbtipodoc.value = "";
    MCD_txtdescuento.value = "";
    var fecha = new Date();
    MCD_txtfechaInicio.value = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    MCD_txtfechaTermino.value = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    fnActivarDesactivarCamposxTipoRegistro("LIMPIAR");
    $("#MCDP_tabla_clientes tbody").empty();
    datatable_clientes.clear();
    $('.checklista').prop("checked", false);

    //QUITAMOS TODOS LOS CHECKS DEL MODAL SUCURSALES
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentoclientesucursales").DataTable().row(index1))).prop("checked", false);
    });
}

function calendariofechainput() {
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

$('#modalDescuentoCliente').on('shown.bs.modal', function () {
    $('#ui-datepicker').css('z-index', '1200');
});


//EARTCOD1008.1 -06-06-2023
//DESCUENTO PERSONAL CON OPCION DE CANALES Y TIPOS DE PRODUCTOS

//FUNCION PARA GENERAR LA LISTA DE SELECCION PARA CANALES
function ObtenerCanalesVenta() {
    let controller = new ListaPreciosController();
    controller.ListarCanalesPrecios(function (data) {

        var tabla = `<table class="table mt-2" id="DP_tabla_canal_ventas">
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
        $('#contenedor_DP_tabla_canal_ventas').html(tabla);
    });
}

//FUNCION PARA GENERAR LA LISTA DE SELECCION PARA PRODUCTOS TIPOS
function ProductosTiposListar() {
    let controller = new DescuentoController();
    controller.ProductosTiposListar(function (data) {

        var tabla = `<table class="table mt-2" id="DP_tabla_productos_tipo">
        <thead class="table bg-danger text-light">
            <tr class="group-font-sm">
                <th></th>
                <th class="my-0 py-2">DESCRIPCION</th>
            </tr>
        </thead>
        <tbody>`;
        $.each(data, function (index, item) {
            tabla += "<tr class='my-0 py-0'>"
                + '<td class="py-1 align-middle" style="display:none;">' + item.idtipoproducto + '</td>'
                + '<td class="py-1 align-middle"><input type="checkbox" class="checklista"/></td>'
                + '<td class="py-1 align-middle">' + item.descripcion + '</td>'
                + "</tr>";
        });
        tabla += "</tbody></table>";
        $('#contenedor_DP_tabla_productos_tipos').html(tabla);
    });
}

//FUNCION PARA OBTENER LOS CHECKS DE LOS TIPOS DE PRODUCTO
var productos_tipo = [];
function ObtenerTiposDeProductosSeleccionados() {
    var selectedRows = $('#DP_tabla_productos_tipo').find('tbody').find('tr').has('input[type=checkbox]:checked')
    productos_tipo = [];
    $.each(selectedRows, function (index, item) {
        productos_tipo.push(item.childNodes[0].innerText);
    });
    return productos_tipo.toString();
}

//FUNCION PARA OBTENER LOS CHECKS DE LOS TIPOS DE CANALES
var canales_venta = [];
function ObtenerCanalesDeVentaSeleccionados() {
    var selectedRows = $('#DP_tabla_canal_ventas').find('tbody').find('tr').has('input[type=checkbox]:checked')
    canales_venta = [];
    $.each(selectedRows, function (index, item) {
        canales_venta.push(item.childNodes[0].innerText);
    });
    return canales_venta.toString();
}

//FUNCION PARA OBTENER EL LISTADO DE DE CLIENTES REGISTRADOS CON DESCUENTOS
function ListarDescuentoCliente() {
    var obj = {
        nombredescuento: mMCDP_txtNombreDescuento.value
    };

    let controller = new DescuentoController();
    controller.ListarDescuentoCliente(obj, function (data) {
        var json = data;
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-container-historial').pagination({
            dataSource: json,
            pageSize: 8,
            callback: function (data, pagination) {
                var html = GenerarTablaDescuentoCliente(data);
                $('#contenedor_descuentopersonallistar').html(html);
            }
        });
    });
    $('#modalDescuentoPersonalListar').modal('show');
}


//FUNCION PARA SELECCIONAR LOS CANALES ASIGNADOS EN LA LISTA
function SeleccionarCanalesVentaConProductosTipo(canales, productostipo) {
    //LIMPIAMOS LOS CHECKS ANTERIORES
    $('.checklista').prop("checked", false);

    //REASIGNAMOS LOS CHECKS
    $.each(canales, function (index1, value1) {
        $('#DP_tabla_canal_ventas>tbody tr').each(function () {
            if (value1 == $(this).find("td").eq(0).html()) {
                $(this).find("td:eq(1) > input[type='checkbox']").prop("checked", true);
            }
        });
    });

    //REASIGNAMOS LOS CHECKS
    $.each(productostipo, function (index1, value1) {
        $('#DP_tabla_productos_tipo>tbody tr').each(function () {
            if (value1 == $(this).find("td").eq(0).html()) {
                $(this).find("td:eq(1) > input[type='checkbox']").prop("checked", true);
            }
        });
    });
}


//EVENTO PARA ABRIR EL MODAL CON LAS SUCURSALES DISPONIBLES
MCDP_btnsucursales.addEventListener('click', function () {
    $('#modalDescuentoClienteSucursales').modal('show');
});



//FUNCION PARA MOSTRAR EL LISTADO DE SUCURSALES DE LA BD
function PromocionPackSucursales() {
    var obj = { idempresa: 0 };
    let controller = new DescuentoController();
    controller.PromocionPackSucursales(obj, function (data) {
        GenerarTablaDescuentoSucursales(data);
    });
    //$('#modalPromoPackSucursales').modal('show');
}

//FUNCION PARA GENERAR LA TABLA HTML CON LAS SUCURSALES DE LA BD
function GenerarTablaDescuentoSucursales(data) {
    $("#tabla_descuentoclientesucursales tbody").empty();
    $.each(data, function (index, item) {
        var fila_suc = "<tr class='py-1'>"
            + '<td class="py-0 align-middle" style="width: 4%"><input type="checkbox"/></td>'
            + "<td style='width:5%' class='py-0 align-middle'>" + item.suc_codigo + "</td>"
            + "<td class='py-0 align-middle'>" + item.descripcion + "</td>"
            + "</tr>";
        $("#tabla_descuentoclientesucursales>tbody").append(fila_suc);
    });
    //PAGINAMOS LA TABLA CON DATABLES.JS
    datatable_sucursales = $('#tabla_descuentoclientesucursales').DataTable(
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

    $("#tabla_descuentoclientesucursales").dataTable().fnPageChange(0);
    $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", false);
    //SeleccionarSucursales();
}

//FUNCION PARA OBTENER LAS SUCURSALES SELECCIONADAS
function ObtenerSucursalesSeleccionadas() {
    descuento_sucursales = [];
    //OBTENEMOS LAS FILAS SELECCIONADAS POR CHECKBOX
    var rows = $(datatable_sucursales.$('input[type="checkbox"]').map(function () {
        return $(this).prop("checked") ? ($(this).closest('tr')[0]).cells[1].innerHTML : null;
    }));

    $.each(rows, function (index, item) {
        descuento_sucursales.push(item);
    });
    return descuento_sucursales.toString();
}


//FUNCION PARA SELECCIONAR CON CHECKS LAS SUCURSALES GUARDADAS
function SeleccionarSucursales(data) {
    //DESELECCIONAMOS TODOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentoclientesucursales").DataTable().row(index1))).prop("checked", false);
    });

    var sucursales_asignadas = [];

    //OBTENEMOS LAS SUCURSALES SELECCIONADAS
    $.each(data, function (index, value) {
        var obj = { suc_codigo: value }
        sucursales_asignadas.push(obj);
    });

    //COMPARAMOS LAS SUCURSALES SELECCIONADAS CON LA LISTA Y ACTIVAMOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $.each(sucursales_asignadas, function (index2, value2) {
            if (value2.suc_codigo == value1[1]) {
                $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentoclientesucursales").DataTable().row(index1))).prop("checked", true);
            }
        });
    });
}

//EVENTO PARA SELECCIONAR O DESELECCIONAR TODAS LAS SUCURSALES
$('#chkallsucursales').on('change', function () {
    if (this.checked) {
        //console.log("checked box");
        $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", true);
    } else {
        $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", false);
    }
});


//--EARTCOD1008.1

/*--SFuentes--*/
function getClientes() {
    var filas = document.querySelectorAll('#MCDP_tabla_clientes tbody tr');
    var array = [];
    var btodos = false;
    filas.forEach(function (e) {
        var oDCliente = new Object();
        oDCliente.idcliente = e.getAttribute("idcliente");
        oDCliente.iddescuentoclientedetalle = e.getAttribute("iddescuentoclientedetalle") == "" ? 0 : e.getAttribute("iddescuentoclientedetalle");
        array.push(oDCliente);
        if (oDCliente.idcliente == 0) btodos = true;
    });
    var obj = { btodos: btodos, array: JSON.stringify(array) };
    return obj;
}

MCDP_crunico.addEventListener('click', function (e) {
    MCDP_contenedor_unico_1.removeAttribute("hidden");
    MCDP_contenedor_unico_2.removeAttribute("hidden");
    MCDP_contenedor_unico_3.removeAttribute("hidden");
    MCDP_contenedor_masivo_1.setAttribute("hidden", "");
});
MCDP_crmasivo.addEventListener('click', function (e) {
    MCDP_contenedor_unico_1.setAttribute("hidden", "");
    MCDP_contenedor_unico_2.setAttribute("hidden", "");
    MCDP_contenedor_unico_3.setAttribute("hidden", "");
    MCDP_contenedor_masivo_1.removeAttribute("hidden");
});

MCDP_btnTodos.addEventListener("click", function (e) {
    $("#MCDP_tabla_clientes tbody").empty();
    datatable_clientes.clear();
    var fila = datatable_clientes.row.add([
        00000000,
        "TODOS",
        "<td class='py-0 text-center'><button type='button' class='btn btn-danger btn-sm btnQuitarCliente'><i class='fa fa-trash'></i></button></td>"
    ]).draw(false).node();
    fila.setAttribute('idcliente', 0);
    fila.setAttribute('iddescuentoclientedetalle', 0);
});
MCDP_btnAgregarCliente.addEventListener("click", function (e) {
    $('#modalcliente').modal('show');
});
MCC_formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    MCC_fnregistrar(function (data) {
        var txtidcliente = data.idcliente;
        var txtnumdoccliente = data.nrodocumento;
        var txtnombrescliente = data.descripcion + " " + (data.apepaterno ?? '') + " " + data.apematerno ?? '';
        var fila = datatable_clientes.row.add([
            txtnumdoccliente,
            txtnombrescliente,
            "<td class='py-0 text-center'><button type='button' class='btn btn-danger btn-sm btnQuitarCliente'><i class='fa fa-trash'></i></button></td>"
        ]).draw(false).node();
        fila.setAttribute('idcliente', txtidcliente);
        fila.setAttribute('iddescuentoclientedetalle', 0);
        MCC_formregistro.reset();
        $('#modalcliente').modal('hide');
    });
});
$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = MCC_tblcliente.row($(this).parents('tr')).data();
    var txtidcliente = this.getAttribute('idcliente');
    var txtnumdoccliente = fila[2];
    var txtnombrescliente = fila[3];
    var fila = datatable_clientes.row.add([
        txtnumdoccliente,
        txtnombrescliente,
        "<td class='py-0 text-center'><button type='button' class='btn btn-danger btn-sm btnQuitarCliente'><i class='fa fa-trash'></i></button></td>"
    ]).draw(false).node();
    fila.setAttribute('idcliente', txtidcliente);
    fila.setAttribute('iddescuentoclientedetalle', 0);
});
$(document).on('click', '.btnQuitarCliente', function (e) {
    var fila = this.parentNode.parentNode;
    fila.remove();
});
function fnActivarDesactivarCamposxTipoRegistro(tipoRegistro) {
    if (tipoRegistro == "UNICO") {
        MCDP_crmasivo.setAttribute("disabled", "");
    } else if (tipoRegistro == "MULTIPLES") {
        MCDP_crunico.setAttribute("disabled", "");
        MCDP_btnTodos.setAttribute("disabled", "");
    } else if (tipoRegistro == "TODOS") {
        MCDP_crunico.setAttribute("disabled", "");
        MCDP_btnAgregarCliente.setAttribute("disabled", "");
        $(".btnQuitarCliente")[0].disabled = true;
    } else {
        MCDP_crmasivo.removeAttribute("disabled");
        MCDP_crunico.removeAttribute("disabled");
        MCDP_btnAgregarCliente.removeAttribute("disabled");
        MCDP_btnTodos.removeAttribute("disabled");
        $("#MCDP_crunico").click();
    }
}
/*--SFuentes--*/