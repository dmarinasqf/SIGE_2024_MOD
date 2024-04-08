var txtidalmacentransferencia = document.getElementById("idalmacentransferencia");
var txtcodigo = document.getElementById("codigo");
var txtfechatraslado = document.getElementById("fechatraslado");
var txtidempresa = document.getElementById("idempresa");
var txtempresa = document.getElementById("txtempresa");
var txtsucursal = document.getElementById("txtsucursal");
var txtidsucursal = document.getElementById("idsucursal");
var txtidalmacensucursalorigen = document.getElementById("idalmacensucursalorigen");
var txtidalmacensucursaldestino = document.getElementById("idalmacensucursaldestino");
var txtobservacion = document.getElementById("observacion");
var txtestado = document.getElementById("estado");

var btnguardar = document.getElementById("btnguardar");
var btnnuevo = document.getElementById("btnnuevo");
var btnlimpiar = document.getElementById("btnlimpiar");
var btnagregaritem = document.getElementById("btnagregaritem");

var tbldetalletransferencias;
var arrayDetalleTransferencia = [];

$(document).ready(function () {
    tbldetalletransferencias = $('#tbldetalletransferencias').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });

    if (MODELO != null) {
        var oAlmacenTransferenciaCompleto = MODELO;
        getAlmacenTransferenciaCompleto(oAlmacenTransferenciaCompleto.idalmacentransferencia);
    } else {
        cargarcomboalmacenes('idalmacensucursalorigen', IDSUCURSAL, null);
        cargarcomboalmacenes('idalmacensucursaldestino', IDSUCURSAL, null);
        txtsucursal.value = SUCURSAL;
        txtempresa.value = EMPRESA;
        txtidempresa.value = IDEMPRESA;
        txtidsucursal.value = IDSUCURSAL;
        txtfechatraslado.value = moment().format("YYYY-MM-DD");
        btnagregaritem.setAttribute("disabled", "");
    }
});

txtidalmacensucursalorigen.addEventListener("change", function (e) {
    if (txtidalmacensucursalorigen.value != "") {
        btnagregaritem.removeAttribute("disabled");
        BuscarStockLoteProductoPorAlmacenSucursal(txtidalmacensucursalorigen.value);
    } else {
        btnagregaritem.setAttribute("disabled", "");
    }

});

btnagregaritem.addEventListener("click", function () {
    $('#modallistaStockLoteProducto').modal('show');
});

function cargarcomboalmacenes(cmbid, idsucursal, seleccionar) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal(cmbid, idsucursal, seleccionar);
}

$(document).on('click', '.btnpasarstock', function (e) {
    var idstock = $(this).attr('id');
    var oStockLoteProducto = arrayStockLoteProducto.find(x => x.idstock == idstock);
    var oVerificarStockLoteProducto = arrayDetalleTransferencia.find(x => x.idstock == idstock);
    if (oVerificarStockLoteProducto == undefined) {
        tbldetalletransferencias.row.add([
            oStockLoteProducto.idstock,
            '<span idproducto="' + oStockLoteProducto.idproducto + '">' + oStockLoteProducto.codigoproducto + '</span>',
            oStockLoteProducto.nombre,
            moment(oStockLoteProducto.fechavencimiento).format("DD-MM-YYYY"),
            oStockLoteProducto.lote,
            oStockLoteProducto.regsanitario,
            oStockLoteProducto.candisponible,
            '<input type="number" style="width: 100px;" class="text-center cantidadtransferir" cantidaddisponible="' + oStockLoteProducto.candisponible + '" required/>',
            '<button class="btneliminaritem btn btn-sm btn-danger" id=' + oStockLoteProducto.idstock + '><i class="fas fa-trash"></i></button>',
        ]).draw(false).node();
        arrayDetalleTransferencia.push(oStockLoteProducto);
    } else {
        mensaje("W", "El item ya se encuentra en el dellate.");
    }
});


$(document).on('keyup', '.cantidadtransferir', function (e) {
    let cantidadtransferir = $(this).val();
    let cantidaddisponible = $(this).attr("cantidaddisponible");
    if (cantidadtransferir == "") cantidadtransferir = 0;
    if (parseInt(cantidadtransferir) > parseInt(cantidaddisponible)) {
        mensaje("W", "La cantidad a transferir excede a la disponible")
    }
});
$('#tbldetalletransferencias tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalletransferencias.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btneliminaritem', function () {
    tbldetalletransferencias.row('.selected').remove().draw(false);
});

$('#form-registro').submit(function (e) {
    e.preventDefault();
    if (txtidalmacensucursalorigen.value != txtidalmacensucursaldestino.value) {
        let detalle = obtenerDatosDetalle();
        if (detalle == -1) {
            mensaje("W", "Hay cantidades a transferir en 0.");
        } else {
            let obj = $('#form-registro').serializeArray();
            obj[obj.length] = { name: "idempresa", value: txtidempresa.value };
            obj[obj.length] = { name: "idsucursal", value: txtidsucursal.value };
            obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
            BLOQUEARCONTENIDO('form-registro', 'Guardando datos ...');
            let controller = new AAlmacenTransferenciaController();
            controller.RegistrarEditar(obj, function (data) {
                if (data.mensaje == "ok") {
                    mensaje("S", "Registro guardado correctamente.");
                    BloquearContenido(true);
                } else {
                    mensaje("W", "Error al registrar la Transferencia entre Almacen.");
                }
                DESBLOQUEARCONTENIDO('form-registro');
            });
        }
    } else {
        mensaje("W", "Los almacenes deben ser diferentes.");
    }
});
function obtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var detalle;
    var datatable = tbldetalletransferencias.rows().data();
    var contador = 0;
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalletransferencias tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        detalle.idproducto = e.children[1].firstChild.getAttribute("idproducto");
        detalle.idstockorigen = datatable[c][0];
        detalle.cantidad = document.getElementsByClassName("cantidadtransferir")[c].value;
        if (detalle.cantidad > 0) {
            contador++;
        }
        array[c] = detalle;
        c++;
    });

    if (contador == c) {
        return array;
    } else {
        return -1;
    }
}

function getAlmacenTransferenciaCompleto(id) {
    var obj = [];
    obj[obj.length] = { name: "id", value: id };
    let controller = new AAlmacenTransferenciaController();
    controller.BuscarAlmacenTransferenciaCompleto(obj, function (data) {
        var data = JSON.parse(data.objeto)[0];
        var cabecera = JSON.parse(data.CABECERA)[0];
        var detalle = JSON.parse(data.DETALLE);
        LlenarFormulario(cabecera, detalle);
    });
}
function LlenarFormulario(cabecera, detalle) {
    txtidalmacentransferencia.value = cabecera.idalmacentransferencia;
    txtcodigo.value = cabecera.codigo;
    txtfechatraslado.value = moment(cabecera.fechatraslado).format("YYYY-MM-DD");
    txtidempresa.value = cabecera.idempresa;
    txtempresa.value = cabecera.empresa;
    txtidsucursal.value = cabecera.idsucursal;
    txtsucursal.value = cabecera.sucursal;
    cargarcomboalmacenes('idalmacensucursalorigen', IDSUCURSAL, cabecera.idalmacensucursalorigen);
    cargarcomboalmacenes('idalmacensucursaldestino', IDSUCURSAL, cabecera.idalmacensucursaldestino);
    txtobservacion.value = cabecera.observacion;
    txtestado.value = cabecera.estado;
    if (cabecera.estado == "APROBADO") {
        BloquearContenido(true);
        btnagregaritem.setAttribute("disabled", "");
    } else {
        BuscarStockLoteProductoPorAlmacenSucursal(cabecera.idalmacensucursalorigen);
    }

    tbldetalletransferencias.clear().draw(false);
    for (var i = 0; detalle.length; i++) {
        tbldetalletransferencias.row.add([
            detalle[i]["idstockorigen"],
            '<span idproducto="' + detalle[i]["idproducto"] + '">' + detalle[i]["codigoproducto"] + '</span>',
            detalle[i].producto,
            moment(detalle[i].fechavencimiento).format("DD-MM-YYYY"),
            detalle[i].lote,
            detalle[i].regsanitario,
            detalle[i].candisponible,
            '<input type="number" style="width: 100px;" class="text-center cantidadtransferir" value="' + detalle[i].cantidad + '" cantidaddisponible="' + detalle[i].candisponible + '" required/>',
            '<button class="btneliminaritem btn btn-sm btn-danger" id=' + detalle[i].idstockorigen + '><i class="fas fa-trash"></i></button>'
        ]).draw(false).node();
        detalle[i].idstock = detalle[i].idstockorigen;
        arrayDetalleTransferencia.push(detalle[i]);
    }
    btnagregaritem.removeAttribute("disabled");
}

function BloquearContenido(estado) {
    if (estado) {
        txtcodigo.setAttribute("disabled", "");
        txtfechatraslado.setAttribute("disabled", "");
        txtidempresa.setAttribute("disabled", "");
        txtempresa.setAttribute("disabled", "");
        txtsucursal.setAttribute("disabled", "");
        txtidsucursal.setAttribute("disabled", "");
        txtidalmacensucursalorigen.setAttribute("disabled", "");
        txtidalmacensucursaldestino.setAttribute("disabled", "");
        txtobservacion.setAttribute("disabled", "");
        txtestado.setAttribute("disabled", "");
        btnguardar.setAttribute("disabled", "");
        btnagregaritem.setAttribute("disabled", "");
        btnlimpiar.setAttribute("disabled", "");
    } else {
        txtcodigo.removeAttribute("disabled");
        txtfechatraslado.removeAttribute("disabled");
        txtidempresa.removeAttribute("disabled");
        txtempresa.removeAttribute("disabled");
        txtsucursal.removeAttribute("disabled");
        txtidsucursal.removeAttribute("disabled");
        txtidalmacensucursalorigen.removeAttribute("disabled");
        txtidalmacensucursaldestino.removeAttribute("disabled");
        txtobservacion.removeAttribute("disabled");
        txtestado.removeAttribute("disabled");
        btnguardar.removeAttribute("disabled");
        btnagregaritem.removeAttribute("disabled");
        btnlimpiar.removeAttribute("disabled");
    }
}

btnnuevo.addEventListener("click", function () {
    window.location = ORIGEN + '/Almacen/AAlmacenTransferencia/RegistrarEditar';
});