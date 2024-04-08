var tbllista;

var SUCURSALES;
var IDEMPRESA;
var IDSUCURSAL;

var CC_fechatraslado = $('#CC_fechatraslado');
var CC_cmbrango = $('#CC_cmbrango');
var CC_cmbserie = $('#CC_cmbserie');
var CC_cmbproveedorcliente = document.getElementById('CC_cmbproveedorcliente');
var CC_contenedor_cliente = document.getElementById('CC_contenedor_cliente');
var CC_contenedor_proveedor = document.getElementById('CC_contenedor_proveedor');
var CC_btnBuscarCliente = document.getElementById('CC_btnBuscarCliente');
var CC_txtidcliente = document.getElementById('CC_txtidcliente');
var CC_txtnrodocumento = document.getElementById('CC_txtnrodocumento');
var CC_txtnombrecliente = document.getElementById('CC_txtnombrecliente');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        paging: true,
        info: false,
        "language": LENGUAJEDATATABLE(),
        //"columnDefs": [
        //    {
        //        "targets": [0],
        //        "visible": false,
        //        "searchable": false
        //    }
        //]
    });

    fn_listarProveedores();
    CD_cargarcombo_almacenes();
    CD_cmbsucursal.val(IDSUCURSAL);
    fncc_listarseriescajaxsucursal(IDSUCURSAL, 'GUIA');
    let fechaa30dias = moment().add(0, 'd').format('YYYYY-MM-DD');
    CC_fechatraslado.val(fechaa30dias);
});

function fn_listarProveedores() {
    tbllista.clear().draw(false);
    var url = ORIGEN + "/Compras/CProveedor/listarproveedores";
    $.post(url).done(function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                tbllista.row.add([
                    data[i].idproveedor,
                    data[i].ruc,
                    data[i].razonsocial,
                    '<input type="checkbox" id="' + data[i].idproveedor + '" ruc="' + data[i].ruc + '" descripcion="' + data[i].razonsocial + '" class="chk-col-red checkbox" />'
                ]).draw(false);
            }
        }
        else {
            mensaje('W', 'Valores nulos para proveedores');
        }
    }).fail(function (data) {
        mensaje("D", 'Error en el servidor');
    });
    tbllista.columns.adjust().draw();
}

function fncc_listarseriescajaxsucursal(idsucursal, nombredocumento) {
    let controller = new CajaController();
    let obj = { idsucursal: idsucursal, nombredocumento: nombredocumento };
    controller.ListarCorrelativosPorCajaPorDocumento('CC_cmbserie', obj, '', '');
    //setTimeout(function () {
    //    CC_cmbserie.val("T038");
    //}, 1000);
}
function CD_cargarcombo_almacenes() {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal('', IDSUCURSAL, null, function (data) {
        var almacenes = fnObtenerTipoALmacen(data);
        var cmb = document.getElementById("CD_cmbsucursalalmacen");
        cmb.innerHTML = "";

        for (var i = 0; i < almacenes.length; i++) {
            var tituloAlmacen = document.createElement("h6");
            if (almacenes[i] == "CANJES - TRANSITO") {
                tituloAlmacen.className = "dropdown-header text-primary";
                tituloAlmacen.innerText = almacenes[i];
                cmb.appendChild(tituloAlmacen);

                for (var j = 0; j < data.length; j++) {
                    if (data[j].almacen == "CANJES - TRANSITO" && data[j].areaalmacen == "APROBADO ") {
                        var a = document.createElement("a");
                        a.className = "dropdown-item";
                        a.href = "#!";

                        var input = document.createElement("input");
                        input.className = "form-check-input";
                        input.type = "checkbox";
                        input.id = data[j].idalmacensucursal;
                        input.value = data[j].idalmacensucursal;
                        input.name = "Almacen " + data[j].idalmacensucursal;
                        var label = document.createElement("label");
                        label.className = "form-check-label";
                        label.for = data[j].idalmacensucursal;
                        label.innerText = data[j].areaalmacen + ' ' + data[j].idtipoproducto;

                        a.appendChild(input);
                        a.appendChild(label);

                        cmb.appendChild(a);
                        break;
                    }
                }
            } else if(almacenes[i] == "PRODUCTO TERMINADO"){
                tituloAlmacen.className = "dropdown-header text-primary";
                tituloAlmacen.innerText = almacenes[i];
                cmb.appendChild(tituloAlmacen);

                for (var j = 0; j < data.length; j++) {
                    if (data[j].almacen == "PRODUCTO TERMINADO" && (data[j].areaalmacen == "CANJE / DEVOLUCIONES " || data[j].areaalmacen == "APROBADO ")) {
                        var a = document.createElement("a");
                        a.className = "dropdown-item";
                        a.href = "#!";

                        var input = document.createElement("input");
                        input.className = "form-check-input";
                        input.type = "checkbox";
                        input.id = data[j].idalmacensucursal;
                        input.value = data[j].idalmacensucursal;
                        input.name = "Almacen " + data[j].idalmacensucursal;
                        var label = document.createElement("label");
                        label.className = "form-check-label";
                        label.for = data[j].idalmacensucursal;
                        label.innerText = data[j].areaalmacen + ' ' + data[j].idtipoproducto;

                        a.appendChild(input);
                        a.appendChild(label);

                        cmb.appendChild(a);
                        //break;
                    }
                }
            }
        }
    });
}

function CC_seleccionarTodo() {
    var checkbox = document.getElementById('CC_chk_todoproveedor');
    var checked = checkbox.checked;
    if (checked)
        $('.checkbox').prop('checked', true);
    else
        $('.checkbox').prop('checked', false);
}

function getRango() {
    let rango = 2;
    if (CC_cmbrango.val() == "BIMESTRE")
        rango = 2
    else if (CC_cmbrango.val() == "TRIMESTRE")
        rango = 3;
    else if (CC_cmbrango.val() == "CUATRIMESTRE")
        rango = 4;
    else if (CC_cmbrango.val() == "SEMESTRE")
        rango = 6;
    return rango;
}

CC_cmbproveedorcliente.addEventListener("change", function (e) {
    if (CC_cmbproveedorcliente.value == "PROVEEDOR") {
        CC_contenedor_proveedor.removeAttribute("hidden");
        CC_contenedor_cliente.setAttribute("hidden", "");
        //fn_listarProveedores();
    } else {
        CC_contenedor_proveedor.setAttribute("hidden", "");
        CC_contenedor_cliente.removeAttribute("hidden");
    }
});
CC_btnBuscarCliente.addEventListener("click", function (e) {
    $('#modalcliente').modal('show');
});
$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = MCC_tblcliente.row($(this).parents('tr')).data();
    var txtidcliente = this.getAttribute('idcliente');
    var txtnumdoccliente = fila[2];
    var txtnombrescliente = fila[3];
    CC_txtidcliente.value = txtidcliente;
    CC_txtnrodocumento.value = txtnumdoccliente;
    CC_txtnombrecliente.value = txtnombrescliente;
    $('#modalcliente').modal('hide');
});