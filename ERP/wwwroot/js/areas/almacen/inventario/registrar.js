
var txtidsucursal = document.getElementById("idsucursal");
var txtproducto = document.getElementById("producto");
var txtidalmacensucursal = document.getElementById("idalmacensucursal");
var txtidlaboratorio = document.getElementById("idlaboratorio");
var txtidinventario = document.getElementById("idinventario");

var btnVisualizarStock = document.getElementById("btnVisualizarStock");
var btnFinalizarInventario = document.getElementById("btnFinalizarInventario");
var btnIniciarInventario = document.getElementById("btnIniciarInventario");
var btnListarProductos = document.getElementById("btnListarProductos");
var btnNuevoRegistro = document.getElementById("btnNuevoRegistro");
var btnAgregarLote = document.getElementById("btnAgregarLote");

var arrayLoteConfirmados = [];
var arrayLoteGeneral = [];
var tbllistalote;
var seleccionado = -1;

$(document).ready(function () {
    tbllistalote = $('#tbllistalote').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE(),
    });
    cargarComboSucursal('idsucursal', null);
    cargarcomboalmacenes('idalmacensucursal', IDSUCURSAL, null);
});

function cargarComboSucursal(cmbidsucursal, seleccionar) {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo(cmbidsucursal, IDEMPRESA, null, IDSUCURSAL, seleccionar);
}
function cargarcomboalmacenes(cmb, idsucursal, seleccionar) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal(cmb, idsucursal, seleccionar);
}

txtidalmacensucursal.addEventListener("change", function (e) {
    if (this.value != "") {
        ListarLaboratorios();
    } else {
        var combo = document.getElementById("idlaboratorio");
        combo.innerHTML = '';
        var option = document.createElement('option');
        option.text = '[SELECCIONE]';
        option.value = '';
        combo.appendChild(option);
    }
});

function ListarLaboratorios() {
    let idalmacensucursal = txtidalmacensucursal.value;
    let controler = new LaboratorioController();
    controler.ListarLaboratoriosPorAlmacenSucursal(idalmacensucursal, function (data) {
        data = JSON.parse(data);
        if (data.length > 0) {
            var combo = document.getElementById("idlaboratorio");
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idlaboratorio;
                combo.appendChild(option);
            }
        } else {
            var combo = document.getElementById("idlaboratorio");
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
        }
    });
}

txtidsucursal.addEventListener("change", function () {
    cargarcomboalmacenes('idalmacensucursal', this.value, null);
});

function BuscarLotePorLaboratorioSucursal(idlaboratorio, idalmacensucursal) {
    var obj = [];
    obj[obj.length] = { name: "idlaboratorio", value: idlaboratorio };
    obj[obj.length] = { name: "idalmacensucursal", value: idalmacensucursal };
    let controller = new InventarioController();
    BLOQUEARCONTENIDO("tbllistalote", "Cargando...");
    controller.BuscarLotePorLaboratorioSucursal(obj, function (data) {
        var data = JSON.parse(data.objeto);
        fnLlenarDetalleLote(data);
        arrayLoteGeneral = data;
    });
}
function fnLlenarDetalleLote(data) {
    tbllistalote.clear().draw(false);
    if (data.length > 0) {
        if (arrayLoteConfirmados.length > 0) {
            for (var i = 0; i < arrayLoteConfirmados.length; i++) {
                data = data.filter(x => x.idstock != arrayLoteConfirmados[i][0]);
            }
        }
        for (var i = 0; i < data.length; i++) {
            tbllistalote.row.add([
                data[i].idstock,
                data[i].codigobarra,
                data[i].codigoproducto,
                data[i].nombre,
                data[i].lote,
                data[i].regsanitario,
                moment(data[i].fechavencimiento).format("DD-MM-YYYY"),
                '<input type="number" class="text-center cantidadCajasStock" idstock=' + data[i].idstock + ' style="width:80px;" min="1">',
                '<input type="number" class="text-center cantidadUnidadStock" idstock=' + data[i].idstock + ' style="width:80px;" min="1">',
                '<button type="button" class="btn btn-warning btn-sm btnseleccionarAdicionar" idstock=' + data[i].idstock + '><i class="fa fa-barcode"></i></button>',
                '<button type="button" class="btn btn-success btn-sm btnconfirmarstock" idstock=' + data[i].idstock + '><i class="fa fa-check"></i></button>',         
            ]).draw(false).node();
        }
        DESBLOQUEARCONTENIDO('tbllistalote');
    }
}

$('#tbllistalote tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
    }
    else {
        tbllistalote.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btnconfirmarstock', function (e) {
    var idstockSeleccionado = $(this).attr("idstock");
    var filas = document.querySelectorAll("#tbllistalote tbody tr");
    var c = 0;
    filas.forEach(function (e) {
        var idstockPorFila = e.childNodes[0].innerText;
        if (idstockSeleccionado == idstockPorFila) {
            let dt = $('#tbllistalote').DataTable();
            let datafila = dt.data().toArray().filter(x => x[0] == idstockSeleccionado);
            let cantidadCajasStock = document.getElementsByClassName("cantidadCajasStock")[c].value;
            let cantidadUnidadStock = document.getElementsByClassName("cantidadUnidadStock")[c].value;
            if ((cantidadCajasStock != 0 && cantidadCajasStock != null && cantidadCajasStock != "") ||
                (cantidadUnidadStock != 0 && cantidadUnidadStock != null && cantidadUnidadStock != "")) {
                datafila[0][7] = cantidadCajasStock;
                datafila[0][8] = cantidadUnidadStock;

                swal({
                    title: '¿DESEA ACTUALIZAR STOCK?',
                    icon: 'warning',
                    buttons: {
                        confirm: {
                            text: 'ACEPTAR',
                            className: 'btn btn-success'
                        },
                        cancel: {
                            visible: true,
                            text: 'CANCELAR',
                            className: 'btn btn-danger'
                        }

                    }
                }).then((confirmar) => {
                    if (confirmar) {
                        BLOQUEARCONTENIDO("contenedorDetalle", "Cargando...");
                        var oDetalleInventario = new AInventarioDetalle();
                        oDetalleInventario.idinventario = txtidinventario.value;
                        oDetalleInventario.idstock = idstockSeleccionado;
                        oDetalleInventario.cajas = cantidadCajasStock;
                        oDetalleInventario.unidad = cantidadUnidadStock;
                        oDetalleInventario.estado = "HABILITADO";
                        let controller = new InventarioController();
                        controller.RegistrarDetalleInventario(oDetalleInventario, function (data) {
                            if (data.mensaje == "ok") {
                                arrayLoteConfirmados.push(datafila[0]);
                                tbllistalote.row('.selected').remove().draw(false);
                                arrayLoteGeneral = arrayLoteGeneral.filter(x => x.idstock != idstockSeleccionado);
                                mensaje("S", "Producto agregado a la Lista de Stock.");
                            } else {
                                mensaje("W", "Error al guardar el stock.");
                            }
                            DESBLOQUEARCONTENIDO("contenedorDetalle");
                        });
                    } else {
                        swal.close();
                        DESBLOQUEARCONTENIDO("contenedorDetalle");
                    }
                });
            }
            else
                mensaje("W", "La cantidad debe ser mayor a 0.");
        }
        c++;
    });
});

$(document).on('click', '.btnseleccionarAdicionar', function (e) {
    seleccionado = $(this).attr("idstock");
});

$(document).on('keyup', '.cantidadCajasStock', function (e) {
    var idstock = $(this).attr("idstock");
    var oStockLote = arrayLoteGeneral.filter(x => x.idstock == idstock);
    oStockLote[0].cantidadCajas = parseInt(this.value);
});
$(document).on('keyup', '.cantidadUnidadStock', function (e) {
    var idstock = $(this).attr("idstock");
    var oStockLote = arrayLoteGeneral.filter(x => x.idstock == idstock);
    oStockLote[0].cantidadUnidad = parseInt(this.value);
});

btnIniciarInventario.addEventListener("click", function () {
    if (txtidalmacensucursal.value != "" && txtidlaboratorio.value != "") {
        let obj = { idalmacensucursal: txtidalmacensucursal.value, idlaboratorio: txtidlaboratorio.value }
        let controller = new InventarioController();
        controller.ValidarExistenciaInventario(obj, function (data) {
            data = JSON.parse(data.objeto);
            if (data.length > 0) {
                swal({
                    title: '¿DESEA CONTINUAR EL INVENTARIO?',
                    text: 'Inventario en proceso por: ' + data[0].usuario,
                    icon: 'warning',
                    buttons: {
                        confirm: {
                            text: 'ACEPTAR',
                            className: 'btn btn-success'
                        },
                        cancel: {
                            visible: true,
                            text: 'CANCELAR',
                            className: 'btn btn-danger'
                        }

                    }
                }).then((confirmar) => {
                    if (confirmar) {
                        BuscarLotePorLaboratorioSucursal(txtidlaboratorio.value, txtidalmacensucursal.value);
                        txtidalmacensucursal.setAttribute("disabled", "");
                        txtidlaboratorio.setAttribute("disabled", "");
                        txtidsucursal.setAttribute("disabled", "");
                        btnIniciarInventario.setAttribute("disabled", "");
                        txtidinventario.value = data[0].idinventario;

                        txtproducto.removeAttribute("disabled");
                        btnListarProductos.removeAttribute("disabled");
                        btnAgregarLote.removeAttribute("disabled");
                        btnFinalizarInventario.removeAttribute("disabled");
                        btnVisualizarStock.removeAttribute("disabled");

                        mensaje("S", "Se ha reanudado el inventario correctamente");
                    } else {
                        swal.close();
                    }
                });
            } else{
                swal({
                    title: '¿DESEA INICIAR INVENTARIO?',
                    text: 'Se deshabilitará la opción de realizar ventas en la sucursal seleccionada. La cantidad de los lotes del laboratorio seleccionado se actualizarán a 0.',
                    icon: 'warning',
                    buttons: {
                        confirm: {
                            text: 'ACEPTAR',
                            className: 'btn btn-success'
                        },
                        cancel: {
                            visible: true,
                            text: 'CANCELAR',
                            className: 'btn btn-danger'
                        }

                    }
                }).then((confirmar) => {
                    if (confirmar) {
                        $('#modalvalidarusuario').modal('show');
                    } else {
                        swal.close();
                    }
                });
            }
        });
    } else
        mensaje("W", "Llenar todos los campos.");
});
$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CAprobarFactura/VerificarCredenciales_AprobarFactura";
    var obj = $('#form-validarusuario').serializeArray();
    btnIniciarInventario.setAttribute("disabled", "");
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            let oInventario = new AInventario();
            oInventario.suc_codigo = txtidsucursal.value;
            oInventario.idalmacensucursal = txtidalmacensucursal.value;
            oInventario.idlaboratorio = txtidlaboratorio.value;
            oInventario.usuarioinicia = data.objeto;

            let controller = new InventarioController();
            controller.RegistrarInicioInventario(oInventario, function (data) {
                if (data.mensaje == "ok") {
                    BuscarLotePorLaboratorioSucursal(txtidlaboratorio.value, txtidalmacensucursal.value);
                    txtidalmacensucursal.setAttribute("disabled", "");
                    txtidlaboratorio.setAttribute("disabled", "");
                    txtidsucursal.setAttribute("disabled", "");
                    txtidinventario.value = data.objeto.idinventario;

                    txtproducto.removeAttribute("disabled");
                    btnListarProductos.removeAttribute("disabled");
                    btnAgregarLote.removeAttribute("disabled");
                    btnFinalizarInventario.removeAttribute("disabled");
                    btnVisualizarStock.removeAttribute("disabled");

                    mensaje("S", "Inicio inventario registrado correctamente.");
                } else {
                    mensaje("W", data.mensaje);
                    btnIniciarInventario.removeAttribute("disabled");
                }
            });
            $('#modalvalidarusuario').modal('hide');
        }
        else if (data.mensaje === "Credenciales incorrectas") {
            mensaje("I", "Usuario o contraseña son incorrectas");
            btnIniciarInventario.removeAttribute("disabled");
        } else {
            mensaje('I', data.mensaje);
            btnIniciarInventario.removeAttribute("disabled");
        }
    }).fail(function (data) {
        mensaje("D", "Error en el servidor");
        btnIniciarInventario.removeAttribute("disabled");
    });
});

btnVisualizarStock.addEventListener("click", function () {
    fnMLSListarStock();
    $('#modalListaStock').modal('show');
});

btnFinalizarInventario.addEventListener("click", function () {
    BLOQUEARCONTENIDO("contenedorDetalle", "Cargando...");
    let oInventario = new AInventario();
    oInventario.idinventario = txtidinventario.value;

    var arrayLoteMayor0 = arrayLoteGeneral.filter(x => x.cantidadCajas > 0 || x.cantidadUnidad > 0);
    var arrayObjetoDetalle = [];
    let dt = $('#tbllistalote').DataTable();
    if (arrayLoteMayor0.length > 0) {
        for (var i = 0; i < arrayLoteMayor0.length; i++) {
            var oDetalleInventario = new AInventarioDetalle();
            oDetalleInventario.idinventario = txtidinventario.value;
            oDetalleInventario.idstock = arrayLoteMayor0[i].idstock;
            oDetalleInventario.cajas = arrayLoteMayor0[i].cantidadCajas;
            oDetalleInventario.unidad = arrayLoteMayor0[i].cantidadUnidad;
            oDetalleInventario.estado = "HABILITADO";
            arrayObjetoDetalle.push(oDetalleInventario);
            let datafila = dt.data().toArray().filter(x => x[0] == arrayLoteMayor0[i].idstock);
            datafila[0][7] = arrayLoteMayor0[i].cantidadCajas;
            datafila[0][8] = arrayLoteMayor0[i].cantidadUnidad;
            arrayLoteConfirmados.push(datafila[0]);
        }
        oInventario.jsondetalle = JSON.stringify(arrayObjetoDetalle);
    }
    let controller = new InventarioController();
    controller.RegistrarFinalizacionInventario(oInventario, function (data) {
        if (data.mensaje == "ok") {
            tbllistalote.clear().draw(false);
            btnFinalizarInventario.setAttribute("disabled", "");
            btnListarProductos.setAttribute("disabled", "");
            btnAgregarLote.setAttribute("disabled", "");
            txtproducto.setAttribute("disabled", "");
            btnNuevoRegistro.removeAttribute("disabled");
            mensaje("S", "Inventario finalizado correctamente.");
        } else {
            mensaje("W", "Error al finalizar el inventario.");
        }
        DESBLOQUEARCONTENIDO("contenedorDetalle");
    });
});

function obtenerDatosListaStock() {
    if (arrayLoteConfirmados.length > 0) {
        var arrayreturn = [];
        for (var i = 0; i < arrayLoteConfirmados.length; i++) {
            var detalle = new AInventarioDetalle();
            detalle.idstock = arrayLoteConfirmados[c][0];
            detalle.cajas = arrayLoteConfirmados[c][7];
            detalle.unidad = arrayLoteConfirmados[c][8];
            arrayreturn.push(detalle);
        }
        return arrayreturn;
    } else {
        return -1;
    }
}

txtproducto.addEventListener('keyup', function () {
    var codigo = this.value;
    var tamanio = tbllistalote.rows().data().length;
    if (tamanio > 0 && codigo.length > 7) {
        var oLoteProducto = arrayLoteGeneral.filter(x => x.codigobarra == codigo || x.codigoproducto == codigo);
        if (oLoteProducto.length > 0) {
            tbllistalote.clear().draw(false);
            if (oLoteProducto.length == 1) {
                seleccionado = oLoteProducto[0].idstock;
            }

            for (var i = 0; i < oLoteProducto.length; i++) {
                if (seleccionado == oLoteProducto[i].idstock) {
                    oLoteProducto[i].cantidadCajas += 1;
                    $("#producto").val("");
                    $("#producto").focus();
                }

                tbllistalote.row.add([
                    oLoteProducto[i].idstock,
                    oLoteProducto[i].codigobarra,
                    oLoteProducto[i].codigoproducto,
                    oLoteProducto[i].nombre,
                    oLoteProducto[i].lote,
                    oLoteProducto[i].regsanitario,
                    moment(oLoteProducto[i].fechavencimiento).format("DD-MM-YYYY"),
                    '<input type="number" class="text-center cantidadCajasStock" idstock=' + oLoteProducto[i].idstock + ' style="width:80px;" min="1" value="' + oLoteProducto[i].cantidadCajas + '">',
                    '<input type="number" class="text-center cantidadUnidadStock" idstock=' + oLoteProducto[i].idstock + ' style="width:80px;" min="1" value="' + oLoteProducto[i].cantidadUnidad + '">',
                    '<button type="button" class="btn btn-warning btn-sm btnseleccionarAdicionar" idstock=' + oLoteProducto[i].idstock + '><i class="fa fa-barcode"></i></button>',
                    '<button type="button" class="btn btn-success btn-sm btnconfirmarstock" idstock=' + oLoteProducto[i].idstock + '><i class="fa fa-check"></i></button>',
                ]).draw(false).node();
            }
        }
    }
});

btnListarProductos.addEventListener("click", function () {
    tbllistalote.clear().draw(false);
    for (var i = 0; i < arrayLoteGeneral.length; i++) {
        tbllistalote.row.add([
            arrayLoteGeneral[i].idstock,
            arrayLoteGeneral[i].codigobarra,
            arrayLoteGeneral[i].codigoproducto,
            arrayLoteGeneral[i].nombre,
            arrayLoteGeneral[i].lote,
            arrayLoteGeneral[i].regsanitario,
            moment(arrayLoteGeneral[i].fechavencimiento).format("DD-MM-YYYY"),
            '<input type="number" class="text-center cantidadCajasStock" idstock=' + arrayLoteGeneral[i].idstock + ' style="width:80px;" min="1" value="' + arrayLoteGeneral[i].cantidadCajas + '">',
            '<input type="number" class="text-center cantidadUnidadStock" idstock=' + arrayLoteGeneral[i].idstock + ' style="width:80px;" min="1" value="' + arrayLoteGeneral[i].cantidadUnidad + '">',
            '<button type="button" class="btn btn-warning btn-sm btnseleccionarAdicionar" idstock=' + arrayLoteGeneral[i].idstock + '><i class="fa fa-barcode"></i></button>',
            '<button type="button" class="btn btn-success btn-sm btnconfirmarstock" idstock=' + arrayLoteGeneral[i].idstock + '><i class="fa fa-check"></i></button>',
        ]).draw(false).node();
    }
});

btnNuevoRegistro.addEventListener("click", function () {
    window.location = ORIGEN + "/Almacen/AInventario/Registrar";
});

btnAgregarLote.addEventListener("click", function () {
    $('#modalAgregarLote').modal('show');
});