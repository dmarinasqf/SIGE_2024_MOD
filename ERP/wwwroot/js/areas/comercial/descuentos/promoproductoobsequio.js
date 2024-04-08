//EARTCOD1021//


var MCPO_formregistro = document.getElementById('MCPO_formregistro');
var MCPO_btnsucursales = document.getElementById('MCPO_btnsucursales');
var MCPO_btnAgregarProveedor = document.getElementById('MCPO_btnAgregarProveedor');
var mMCPO_btnBuscarProveedor = document.getElementById('mMCPO_btnBuscarProveedor');
var MCPO_btnAgregarProductoCompra = document.getElementById('MCPO_btnAgregarProductoCompra');
var MCPO_btnAgregarProductoObsequio = document.getElementById('MCPO_btnAgregarProductoObsequio');
var mMCPO_btnBuscarLabproducto = document.getElementById('mMCPO_btnBuscarLabproducto');
var MCPO_btnguardar = document.getElementById('MCPO_btnguardar');
var MCPO_btnhistorial = document.getElementById('MCPO_btnhistorial');
var MCPO_btnlimpiar = document.getElementById('MCPO_btnlimpiar');
var mMCPO_txtNombreLabProducto = document.getElementById('mMCPO_txtNombreLabProducto');



var tabla_productos_compra = [];//ARRAY PARA GUARDAR LOS DATOS DE LA TABLA
var tabla_productos_obsequio = [];//ARRAY PARA GUARDAR LOS DATOS DE LA TABLA
var accionbotonswitch = "COMPRA"; //VARIABLE PARA DIFERENCIAR EL COMPORTAMIENTO DEL MODAL
var descuento_sucursales = [];
var datatable_sucursales;
var canales_venta = [];

var operacion_mantenimiento = 'AGREGAR';

$(document).ready(function () {
    calendariofechainput();
    ObtenerCanalesVenta();
    PromocionPackSucursales();
});

//FUNCION PARA GENERAR LA TABLA PROVEEDOR
function GenerarTablaProveedor(data) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_proveedor">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th class="py-2 align-middle">N° RUC</th>
                <th class="py-2 align-middle">RAZON SOCIAL</th>
                <th class="py-2 align-middle"></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr>"
            + "<td class='py-0 align-middle'>" + item.ruc + "</td>"
            + "<td class='py-0 align-middle'>" + item.razonsocial + "</td>"
            + '<td class="py-0 align-middle"><button class="btn text-primary btnproveedor" onclick="BuscarProveedor(\'' + item.idproveedor + '\',\'' + item.razonsocial + '\')"><i class=\'bi bi-plus-square-fill h4\'></i></button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

//LIMPIAR FORMULARIO
function LimpiarFormulario() {
    $('.checklista').prop("checked", false);
    $('#MCPO_cmblaboratorio').empty();

    $('#tabla_productos_compra tbody tr').remove();
    $('#tabla_productos_obsequio tbody tr').remove();
    $('#MCPO_txtmonto').val("");

    $('#MCPO_txtNombrePromocion').val("");

    //var fecha = new Date();
    //MCPO_txtfechaInicio.value = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    //MCPO_txtfechaTermino.value = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
    var fecha = new Date();
    strFecha = [('0' + fecha.getDate()).slice(-2), ('0' + (fecha.getMonth() + 1)).slice(-2), fecha.getFullYear()].join('/');
    MCPO_txtfechaInicio.value = strFecha;
    MCPO_txtfechaTermino.value = strFecha;

    //LIMPIAR LOS CHECKS SELECCIONADOS DEL MODAL SUCURSAL
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentopromoobsequio").DataTable().row(index1))).prop("checked", false);
    });
}

//VALIDAR FORMULARIO
function ValidacionForm() {
    var obj = { estado: true, mensaje: "success" }

    var fecha1 = $('#MCPO_txtfechaInicio').val();
    var fecha2 = $('#MCPO_txtfechaTermino').val();

    var fechai = new Date(fecha1.substring(6, 10), fecha1.substring(3, 5), fecha1.substring(0, 2));
    var fechaf = new Date(fecha2.substring(6, 10), fecha2.substring(3, 5), fecha2.substring(0, 2));
    if (fechai > fechaf) {
        obj.estado = false;
        obj.mensaje = "La fecha de inicio no puede ser mayor a la fecha de termino";
        return obj;
    }

    if (canales_venta.length == 0) {
        obj.estado = false;
        obj.mensaje = "Seleccione al menos un canal de ventas antes de registrar la promoción";
        return obj;
    }

    if (ObtenerTablaProductoCompraEnArray().length == 0) {
        obj.estado = false;
        obj.mensaje = "Seleccione al menos un producto de compra antes de registrar la promoción";
        return obj;
    }

    if (ObtenerTablaProductoObsequioEnArray().length == 0) {
        obj.estado = false;
        obj.mensaje = "Seleccione al menos un producto de obsequio antes de registrar la promoción";
        return obj;
    }

    if (descuento_sucursales.length == 0) {
        $('#modalDescuentoPromoObsequio').modal('show');
        obj.estado = false;
        obj.mensaje = "Seleccione al menos una sucursal antes de registrar la promoción";
        return obj;
    }

    return obj;
}

//FUNCION PARA ABRIR LA LISTA DE PROVEEDORES EN EL MODAL
function ProveedoresListar() {
    var obj = {
        descripcion: $('#mMCPO_txtNombreProveedor').val()
    };

    let controller = new DescuentoController();
    controller.ProveedoresListar(obj, function (data) {
        var json = data;
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-container-historial').pagination({
            dataSource: json,
            pageSize: 10,
            callback: function (data, pagination) {
                var html = GenerarTablaProveedor(data);
                $('#contenedor_productoobsequioproveedor').html(html);
            }
        });
    });
    $('#modalProductoObsequioProveedor').modal('show');
}

//FUNCION PARA OBTENER EL NOMBRE DEL PROVEEDOR Y SUS LABORATORIOS
function BuscarProveedor(idproveedor, razonsocial) {
    $('#MCPO_txtidproveedor').val(idproveedor);
    $('#MCPO_txtproveedor').val(razonsocial);
    $('#modalProductoObsequioProveedor').modal('hide');
    LimpiarFormulario();
    ObtenerListaLaboratorios('');
}

//EVENTO PARA ABRIR EL MODAL PROVEEDOR
MCPO_btnAgregarProveedor.addEventListener('click', function () {
    ProveedoresListar();
});

//EVENTO PARA BUSCAR UN PROVEEDOR EN EL MODAL
mMCPO_btnBuscarProveedor.addEventListener('click', function () {
    ProveedoresListar();
});

//FUNCION PARA OBTENER LA LISTA DE LABORATORIOS EN EL COMBO
function ObtenerListaLaboratorios(laboratorioselect) {
    $('#MCPO_cmblaboratorio').empty();
    var obj = {
        idproveedor: $('#MCPO_txtidproveedor').val(),
        descripcion: ''
    };

    let controller = new DescuentoController();
    controller.LaboratoriosListar(obj, function (data) {
        $.each(data, function (index, item) {
            var option = $('<option/>');
            option.attr({ 'value': item.idlaboratorio }).text(item.descripcion);
            if (item.idlaboratorio == laboratorioselect) {
                option.attr({ 'selected': true });
            }
            $('#MCPO_cmblaboratorio').append(option);
        });
    });
}

//FUNCION PARA GENERAR LA TABLA CON EL LISTADO DE PRODUCTOS DEL LABORATORIO
function GenerarTablaLaboratorioProducto(data, idlaboratorio) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_laboratorioproducto">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th class="py-2 align-middle">CODIGO</th>
                <th class="py-2 align-middle">NOMBRE</th>
                <th class="py-2 align-middle">TIPO</th>
                <th class="py-2 align-middle">PRECIO</th>
                <th class="py-2 align-middle"><button `+ (idlaboratorio > 0 ? " " : "hidden") +` class="btn text-white agregar-productostodos"><i class=\'bi bi-plus-square-fill h4\'></i></button></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.idproducto + "</td>"
            + "<td class='py-0 align-middle'>" + item.codigoproducto + "</td>"
            + "<td class='py-0 align-middle'>" + item.nombre + "</td>"
            + "<td class='py-0 align-middle'>" + item.idtipoproducto + "</td>"
            + "<td class='py-0 align-middle'>" + parseFloat(item.precio).toFixed(2) + "</td>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.multiplo + "</td>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.ispack + "</td>"
            + "<td class='py-0 align-middle' style='display: none;'>" + item.oferta_bonificacion + "</td>"
            + '<td class="py-0 align-middle"><button class="btn text-primary agregar-productocompra"><i class=\'bi bi-plus-square-fill h4\'></i></button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

//FUNCION PARA ABRIR EL MODAL CON LOS PRODUCTOS DEL LABORATORIO SELECCIONADO
function LaboratoriosProductosListar() {
    //idlaboratorio: $('#MCPO_cmblaboratorio').val(),

    var idlaboratorio;
    if (accionbotonswitch == "COMPRA") {
        idlaboratorio = $('#MCPO_cmblaboratorio').val();
    } else if (accionbotonswitch == "OBSEQUIO") {
        idlaboratorio=0
    }
    var obj = {
        idlaboratorio: idlaboratorio,
        nombre: $('#mMCPO_txtNombreLabProducto').val()
    };

    let controller = new DescuentoController();
    controller.LaboratoriosProductosListar(obj, function (data) {
        var json = data;
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-contenedor_productoobsequiolabproducto').pagination({
            dataSource: json,
            pageSize: 10,
            callback: function (data, pagination) {
                var html = GenerarTablaLaboratorioProducto(data, idlaboratorio);
                $('#contenedor_productoobsequiolabproducto').html(html);
            }
        });
    });
    $('#modalProductoObsequioLabproducto').modal('show');
}

//EVENTO PARA ABRIR EL MODAL DE PRODUCTOS DESDE COMPRA
MCPO_btnAgregarProductoCompra.addEventListener('click', function () {
    accionbotonswitch = 'COMPRA';
    LaboratoriosProductosListar();
});

//EVENTO PARA ABRIR EL MODAL DE PRODUCTOS
mMCPO_btnBuscarLabproducto.addEventListener('click', function () {
    LaboratoriosProductosListar();
});

//EVENTO PARA AGREGAR UN ITEM A LA TABLA PRODUCTO COMPRA / OBSEQUIO
$(document).on('click', '.agregar-productocompra', function (event) {
    event.preventDefault();

    var obj = {
        idproducto: $(this).parents("tr").find("td").eq(0).html(),
        nombre: $(this).parents("tr").find("td").eq(2).html(),
        multiplo: $(this).parents("tr").find("td").eq(5).html(),
        oferta_bonificacion: $(this).parents("tr").find("td").eq(7).html()
    }

    if (accionbotonswitch == 'COMPRA') {
        //VERIFICAMOS SI EL PRODUCTO YA FUE AGREGADO
        var productoc = ObtenerTablaProductoCompraEnArray().filter(function (producto) { return producto == obj.idproducto });
        if (productoc.length == 0) {
            //VALIDAR SI EL PRODUCTO TIENE OTRO TIPO DE PROMOCION 
            if (obj.oferta_bonificacion == 0) {
                ProductoCompraAgregarFila(obj);
            } else {
                //alert("ESTE PRODUCTO SE ENCUENTRA EN OTRO TIPO DE PROMOCIÓN");
                mensaje('D', "ESTE PRODUCTO SE ENCUENTRA EN OTRO TIPO DE PROMOCIÓN");
            }
        }
    } else if (accionbotonswitch == "OBSEQUIO") {
        //VERIFICAMOS SI PERTENECE AL TIPO PACK PARA OBTENER SU CONTENIDO
        if ($(this).parents("tr").find("td").eq(3).html() == 'PK') {
            var objpack = JSON.parse($(this).parents("tr").find("td").eq(6).html());
        
            $.each(objpack, function (index, item) {
                var producto = ObtenerTablaProductoObsequioEnArray().filter(function (producto) { return producto.substring(0,5) == item.idproducto });
                console.log(producto);
                if (producto.length == 0) {
                    ProductoObsequioAgregarFila(item,'readonly')
                }
            });
        } else {
            var producto = ObtenerTablaProductoObsequioEnArray().filter(function (producto) { return producto.substring(0,5) == obj.idproducto });
            if (producto.length == 0) {
                ProductoObsequioAgregarFila(obj,'');
            }
        }
    }
    $('#modalProductoObsequioLabproducto').modal('hide');
});

//FUNCION PARA OBTENER EL ARRAY DE TODOS LOS PRODUCTOS SELECCIONADOS PRODUCTOS A COMPRAR
function ObtenerTodosLosProductosLab() {
    $('#tabla_productos_compra tbody tr').remove();
    var idlaboratorio;
    idlaboratorio = $('#MCPO_cmblaboratorio').val();
    var obj = {
        idlaboratorio: idlaboratorio,
        nombre: ""
    };
    let controller = new DescuentoController();
    controller.LaboratoriosProductosListar(obj, function (data) {
        //console.log(data);
        $.each(data, function (index, item) {          
            if (item.oferta_bonificacion == 0) {
                ProductoCompraAgregarFila(item);
            }
        });
    });
}

//EVENTO PARA AGREGAR TODOS LOS ITEMS EN LA TABLA PRODUCTO COMPRA
$(document).on('click', '.agregar-productostodos', function (event) {
    event.preventDefault();
    ObtenerTodosLosProductosLab();
});

//EVENTO PARA QUITAR TODOS LOS ITEMS DE LA TABLA PRODUCTO COMPRA
$(document).on('click', '.productos-quitarfilas', function (event) {
    event.preventDefault();
    $('#tabla_productos_compra tbody tr').remove();
});


//FUNCION PARA AGREGAR UNA FILA EN PRODUCTOS COMPRA
function ProductoCompraAgregarFila(obj) {
    var fila = '<tr class="py-1">'
        + '<td class="py-0 align-middle" style="display:none;">' + obj.idproducto + '</td>'
        + '<td class="py-0 align-middle" style="font-size:11px;">' + obj.nombre + '</td>'
        + '<td class="py-0" style="width:5%;"><button class="btn text-danger mx-0 px-0 borrar-fila-productocompras"><i class=\'bi bi-trash-fill h5\'></i></button></td>'
        + "</tr>";
    $("#tabla_productos_compra>tbody").append(fila);
}

//FUNCION PARA AGREGAR UNA FILA EN PRODUCTOS OBSEQUIO
function ProductoObsequioAgregarFila(obj, isdisable) {
    var fila = '<tr class="py-1">'
        + '<td class="py-0 align-middle" style="display:none;">' + obj.idproducto + '</td>'
        + '<td class="py-0 align-middle" style="font-size:11px;">' + obj.nombre + '</td>'
        + '<td class="py-1 align-middle" style="width:80px;"><input '+isdisable+' type="number" class="form-control form-control-sm event-numbers" value="' + (obj.cantidad == null ? 1 : obj.cantidad) + '" min=1 required></td>'
        + '<td class="py-1 align-middle" style="width:30px; text-align:center;"><input type="checkbox" class="checkstockfraccion"   ' + (obj.xfraccion > 0 ? "checked" : "")+' ' + (obj.multiplo <= 1 ? "disabled" : "") + '/></td>'
        + '<td class="py-0 align-middle" style="display:none;">' + (obj.multiplo>1?2:1) + '</td>'
        + '<td class="py-0" style="width:5%;"><button class="btn text-danger mx-0 px-0 borrar-fila-productocompras"><i class=\'bi bi-trash-fill h5\'></i></button></td>'
        + "</tr>";
    $("#tabla_productos_obsequio>tbody").append(fila);
}

//EVENTO PARA ELIMINAR FILA DE LA TABLA
$(document).on('click', '.borrar-fila-productocompras', function (event) {
    event.preventDefault();
    $(this).closest('tr').remove();
});

//FUNCION PARA OBTENER EL ARRAY DE LA TABLA PRODUCTO COMPRA
function ObtenerTablaProductoCompraEnArray() {
    tabla_productos_compra = [];
    $('#tabla_productos_compra>tbody tr').each(function () {
        tabla_productos_compra.push($(this).find("td").eq(0).html());
    });
    return tabla_productos_compra;
}

//FUNCION PARA OBTENER EL ARRAY DE LA TABLA PRODUCTO OBSEQUIO
function ObtenerTablaProductoObsequioEnArray() {
    tabla_productos_obsequio = [];
    $('#tabla_productos_obsequio>tbody tr').each(function () {
        tabla_productos_obsequio.push($(this).find("td").eq(0).html() + '|' + $(this).find("td").eq(3).has('input[type=checkbox]:checked').length + "|" + $(this).find("td").eq(4).html() +"|"+ $(this).find("td").eq(2).find("input").val());
    });
    return tabla_productos_obsequio;
}

//EVENTO PARA ABRIR EL MODAL DE PRODUCTOS DESDE OBSEQUIO
MCPO_btnAgregarProductoObsequio.addEventListener('click', function () {
    accionbotonswitch = 'OBSEQUIO';
    LaboratoriosProductosListar();
});

//FUNCION INCLUIR EL CALENDARIO EN LOS INPUTS FECHA
function calendariofechainput() {
    //var fecha = new Date();
    //var strFecha = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    var fecha = new Date();
    strFecha = [('0' + fecha.getDate()).slice(-2),
        ('0' + (fecha.getMonth() + 1)).slice(-2),
        fecha.getFullYear()].join('/');

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


//FUNCION PARA GENERAR LA LISTA DE SELECCION PARA CANALES
function ObtenerCanalesVenta() {
    let controller = new ListaPreciosController();
    controller.ListarCanalesPrecios(function (data) {

        var tabla = `<table class="table mt-2" id="PO_tabla_canal_ventas">
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
        $('#contenedor_PO_tabla_canal_ventas').html(tabla);
    });
}

//FUNCION PARA OBTENER LOS CHECKS DE LOS TIPOS DE CANALES
function ObtenerCanalesDeVentaSeleccionados() {
    var selectedRows = $('#PO_tabla_canal_ventas').find('tbody').find('tr').has('input[type=checkbox]:checked')
    canales_venta = [];
    $.each(selectedRows, function (index, item) {
        canales_venta.push(item.childNodes[0].innerText);
    });
    return canales_venta.toString();
}

//EVENTO PARA ABRIR EL MODAL CON LAS SUCURSALES DISPONIBLES
MCPO_btnsucursales.addEventListener('click', function () {
    $('#modalDescuentoPromoObsequio').modal('show');
});

//FUNCION PARA GENERAR LA TABLA HTML CON LAS SUCURSALES DE LA BD
function GenerarTablaDescuentoSucursales(data) {
    $("#tabla_descuentopromoobsequio tbody").empty();
    $.each(data, function (index, item) {
        var fila_suc = "<tr class='py-1'>"
            + '<td class="py-0 align-middle" style="width: 4%"><input type="checkbox"/></td>'
            + "<td style='width:5%' class='py-0 align-middle'>" + item.suc_codigo + "</td>"
            + "<td class='py-0 align-middle'>" + item.descripcion + "</td>"
            + "</tr>";
        $("#tabla_descuentopromoobsequio>tbody").append(fila_suc);
    });
    //PAGINAMOS LA TABLA CON DATABLES.JS
    datatable_sucursales = $('#tabla_descuentopromoobsequio').DataTable(
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

    $("#tabla_descuentopromoobsequio").dataTable().fnPageChange(0);
    $(datatable_sucursales.$('input[type="checkbox"]')).prop("checked", false);
}

//FUNCION PARA MOSTRAR EL LISTADO DE SUCURSALES DE LA BD
function PromocionPackSucursales() {
    var obj = { idempresa: 0 };
    let controller = new DescuentoController();
    controller.PromocionPackSucursales(obj, function (data) {
        GenerarTablaDescuentoSucursales(data);
    });
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


//FUNCION PARA GUARDAR LA PROMOCION EN LA BASE DE DATOS
function PromoProductoObsequioAgregar() {
    var obj = {
        idproveedor: $('#MCPO_txtidproveedor').val(),
        idlaboratorio: $('#MCPO_cmblaboratorio').val(),
        montooferta: $('#MCPO_txtmonto').val(),
        nombrepromo: $('#MCPO_txtNombrePromocion').val(),
        productoscompra : ObtenerTablaProductoCompraEnArray().toString(),
        productosobsequio: ObtenerTablaProductoObsequioEnArray().toString(),
        fechainicio: $('#MCPO_txtfechaInicio').val().split('/').join('-'),
        fechatermino: $('#MCPO_txtfechaTermino').val().split('/').join('-'),
        canalesventa: ObtenerCanalesDeVentaSeleccionados(),
        sucursales: ObtenerSucursalesSeleccionadas(),
        estado: $('#MCPO_cmbestado').val()
    }

    if (ValidacionForm().estado) {
        let controller = new DescuentoController();
        controller.PromoProductoObsequioAgregar(obj, function (data) {
            if (data == 'success') {
                mensaje('S', 'Promoción agregada Exitosamente')
            } else if (data == 'warning') {
                mensaje('W', 'No se guardo ningun cambio en la base de datos');
            } else{
                mensaje('W', data);
            }
        });
    } else {
        mensaje('W', ValidacionForm().mensaje);
        return obj;
    }
}


function check() {
    var nombreautomatico = 'PROMOCIÓN LAB ' + $("#MCPO_cmblaboratorio :selected").text()
        + ', POR MONTOS A S/ ' + $("#MCPO_txtmonto").val() + ' ' +
        ($("#MCPO_txtfechaTermino").val()).substring(3, 5) + '-' + ($("#MCPO_txtfechaTermino").val()).substring(6, 10);
    $('#MCPO_txtNombrePromocion').val(nombreautomatico);
}

MCPO_formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (operacion_mantenimiento == 'AGREGAR') {
        PromoProductoObsequioAgregar();
    } else if (operacion_mantenimiento == 'EDITAR') {
        PromoProductoObsequioEditar();
    } 
});

//FUNCION PARA GENERAR LA TABLA PARA LA LISTA DE PROMOCIONES CREADAS
function GenerarTablaProductoObsequio(data) {
    var tabla = `<table class="table mt-2 text-center" id="tabla_producto_obsequio">
        <thead class="table bg-primary text-light">
            <tr class="group-font-sm">
                <th class="py-2 align-middle">NOMBRE PROMOCION</th>
                <th class="py-2 align-middle">FECHA DE TERMINO</th>
                <th class="py-2 align-middle">MONTO REFERIDO</th>
                <th class="py-2 align-middle"></th>
            </tr>
        </thead>
        <tbody>`;
    $.each(data, function (index, item) {
        tabla += "<tr>"
            + '<td class="py-0 align-middle" style="display:none;">' + item.idpromoobsequio + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.idproveedor + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.nombreproveedor + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.idlaboratorio + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.productoscomprajson + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.productosobsequiojson + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.fechainicio.substring(0, 10) + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.canalesventa + '</td>'
            + '<td class="py-0 align-middle" style="display:none;">' + item.sucursales + '</td>'
            + "<td class='py-0 align-middle'>" + item.nombrepromo + "</td>"
            + "<td class='py-0 align-middle'>" + item.fechatermino.substring(0,10) + "</td>"
            + "<td class='py-0 align-middle'>" + item.montooferta + "</td>"
            + '<td class="py-0 align-middle" style="display:none;">' + item.estado + '</td>'
            + '<td class="py-0 align-middle"><button class="btn text-primary btnproveedor obtener-promocionobsequio" ><i class=\'bi bi-plus-square-fill h4\'></i></button></td>'
            + "</tr>";
    });
    tabla += "</tbody></table>";
    return tabla;
}

//FUNCION PARA GENERAR LA LISTA DE PROMOCIONES CREADAS DE LA BD
function PromoProductoObsequioListar() {
    var obj = {
        nombrepromo: $('#mMCPO_txtNombrePromocionObsequio').val()
    };

    let controller = new DescuentoController();
    controller.PromoProductoObsequioListar(obj, function (data) {
        var json = data;
        //SCRIPT PARA GENERAR LA PAGINACION PARA EL TABLA DETALLE
        $('#pagination-contenedor_productoobsequiolistar').pagination({
            dataSource: json,
            pageSize: 10,
            callback: function (data, pagination) {
                var html = GenerarTablaProductoObsequio(data);
                $('#contenedor_productoobsequiolistar').html(html);
            }
        });
    });
    $('#modalProductoObsequioListar').modal('show');
}

//EVENTO PARA ABRIR EL MODAL CON EL HISTORICO DE PROMOCIONES
MCPO_btnhistorial.addEventListener('click', function () {
    PromoProductoObsequioListar();
});

//FUNCION PARA OBTENER LA PROMOCION SELECCIONADA DEL MODAL
$(document).on('click', '.obtener-promocionobsequio', function (event) {
    event.preventDefault();
    LimpiarFormulario();

    $('#MCPO_txtidpromoobsequio').val($(this).parents("tr").find("td").eq(0).html());
    $('#MCPO_txtidproveedor').val($(this).parents("tr").find("td").eq(1).html());   
    $('#MCPO_txtproveedor').val($(this).parents("tr").find("td").eq(2).html());
    $('#MCPO_txtmonto').val($(this).parents("tr").find("td").eq(11).html());
    $('#MCPO_txtNombrePromocion').val($(this).parents("tr").find("td").eq(9).html());
    
    var idlaboratorio = $(this).parents("tr").find("td").eq(3).html();
    ObtenerListaLaboratorios(idlaboratorio);

    var productoscomprajson = JSON.parse($(this).parents("tr").find("td").eq(4).html());
    var productosobsequiojson = JSON.parse($(this).parents("tr").find("td").eq(5).html());
    var canalesventa = $(this).parents("tr").find("td").eq(7).html();
    var canalesventaarray = canalesventa != null ? canalesventa.split(',') : '';
    var sucursales = $(this).parents("tr").find("td").eq(8).html();
    var sucursalesarray = sucursales != null ? sucursales.split(',') : '';

    var fechai = $(this).parents("tr").find("td").eq(6).html();
    var fechat = $(this).parents("tr").find("td").eq(10).html();
    $('#MCPO_txtfechaInicio').val(fechai.substring(8,10)+'/'+fechai.substring(5,7)+'/'+fechai.substring(0,4));
    $('#MCPO_txtfechaTermino').val(fechat.substring(8, 10) + '/' + fechat.substring(5, 7) + '/' + fechat.substring(0, 4));

    $('#MCPO_cmbestado').val($(this).parents("tr").find("td").eq(12).html());

    $.each(productoscomprajson, function (index, item) {
        ProductoCompraAgregarFila(item);
    });
    $.each(productosobsequiojson, function (index, item) {
        ProductoObsequioAgregarFila(item,'');
    });
    SeleccionarCanalesVenta(canalesventaarray);
    SeleccionarSucursales(sucursalesarray);

    operacion_mantenimiento = "EDITAR";
    $('#modalProductoObsequioListar').modal('hide');
});


//FUNCION PARA SELECCIONAR LOS CANALES ASIGNADOS EN LA LISTA
function SeleccionarCanalesVenta(canales) {
    //LIMPIAMOS LOS CHECKS ANTERIORES
    $('.checklista').prop("checked", false);

    //REASIGNAMOS LOS CHECKS
    $.each(canales, function (index1, value1) {
        $('#PO_tabla_canal_ventas>tbody tr').each(function () {
            if (value1 == $(this).find("td").eq(0).html()) {
                $(this).find("td:eq(1) > input[type='checkbox']").prop("checked", true);
            }
        });
    });
}

//FUNCION PARA SELECCIONAR CON CHECKS LAS SUCURSALES GUARDADAS
function SeleccionarSucursales(data) {
    //DESELECCIONAMOS TODOS LOS CHECKS
    $.each(datatable_sucursales.rows().data(), function (index1, value1) {
        $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentopromoobsequio").DataTable().row(index1))).prop("checked", false);
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
                $(datatable_sucursales.$('input[type="checkbox"]', $("#tabla_descuentopromoobsequio").DataTable().row(index1))).prop("checked", true);
            }
        });
    });
}

//FUNCION PARA EDITAR LA PROMOCION EN LA BASE DE DATOS
function PromoProductoObsequioEditar() {
    var obj = {
        idpromoobsequio: $('#MCPO_txtidpromoobsequio').val(),
        idproveedor: $('#MCPO_txtidproveedor').val(),
        idlaboratorio: $('#MCPO_cmblaboratorio').val(),
        montooferta: $('#MCPO_txtmonto').val(),
        nombrepromo: $('#MCPO_txtNombrePromocion').val(),
        productoscompra: ObtenerTablaProductoCompraEnArray().toString(),
        productosobsequio: ObtenerTablaProductoObsequioEnArray().toString(),
        fechainicio: $('#MCPO_txtfechaInicio').val().split('/').join('-'),
        fechatermino: $('#MCPO_txtfechaTermino').val().split('/').join('-'),
        canalesventa: ObtenerCanalesDeVentaSeleccionados(),
        sucursales: ObtenerSucursalesSeleccionadas(),
        estado: $('#MCPO_cmbestado').val()
    }

    if (ValidacionForm().estado) {
        let controller = new DescuentoController();
        controller.PromoProductoObsequioEditar(obj, function (data) {
            if (data == 'success') {
                mensaje('S', 'Cambios guardados Exitosamente')
            } else if (data == 'warning') {
                mensaje('W', 'No se guardo ningun cambio en la base de datos');
            } else {
                mensaje('W', data);
            }
        });
    } else {
        mensaje('W', ValidacionForm().mensaje);
        return obj;
    }
}

//EVENTO PARA ABRIR EL MODAL CON EL HISTORICO DE PROMOCIONES
MCPO_btnlimpiar.addEventListener('click', function () {
    $('#MCPO_txtidproveedor').val("");
    $('#MCPO_txtproveedor').val("");
    $('#MCPO_txtidpromoobsequio').val("");
    LimpiarFormulario();
    operacion_mantenimiento = 'AGREGAR';
});

mMCPO_txtNombreLabProducto.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        LaboratoriosProductosListar();
    }
});

//function BuscarPromoProductoObsequio(idpromoobsequio) {
//
//
//    $('#MCPO_txtmonto').val(idproveedor);
//    $('#MCPO_txtproveedor').val(razonsocial);
//    $('#modalProductoObsequioProveedor').modal('hide');
//    LimpiarFormulario();
//    ObtenerListaLaboratorios();
//}