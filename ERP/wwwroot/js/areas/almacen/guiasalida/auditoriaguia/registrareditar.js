var txtcodigo = $('#codigo');
var txtnumdoc = $('#txtnumdoc');
var txtidguiasalida = $('#idguiasalida');
var txtfechatraslado = $('#fechatraslado');
var txtclienteproveedor = $('#txtclienteproveedor');
var cmbidsucursalorigen = $('#idsucursal');
var cmbidsucursaldestino = $('#idsucursaldestino');
var cmbestadoguia = $('#estadoguia');
var txtempleado_userName = $('#empleado_userName');
var cmbidalmacensucursalorigen = $('#idalmacensucursalorigen');
var cmbidalmacensucursaldestino = $('#idalmacensucursaldestino');
var labelSucursalDestino = $('#labelSucursalDestino');
var labelAlmacenDestino = $('#labelAlmacenDestino');
var txtpeso = $('#txtpeso');
var txtbulto = $('#txtbulto');

var idtipoguia = 0;
var tbldetalleguia;

var contenedorSucDestino = $('#contenedorSucDestino');
var contenedorAlmDestino = $('#contenedorAlmDestino');
var contenedorNomProvCliDestino = $('#contenedorNomProvCliDestino');

//Transporte
var idempresatransporte = $('#idempresatransporte');
var idvehiculo = $('#idvehiculo');
var txtmatricula = $('#txtmatricula');
var txtlicencia = $('#txtlicencia');

var btnguardar = $('#btn-guardar');
var btnimprimir = document.getElementById('btnimprimir');
var btnLimpiarPicking = document.getElementById('btnLimpiarPicking');

$(document).ready(function () {
    tbldetalleguia = $('#tbldetalleguia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[40, 80, 120, -1], [45, 85, 120, "All"]],
        //"lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [8],
                "visible": false,
                "searchable": false
            }
        ]
    });
    cargarEmpresa();
    if (MODELO.idguiasalida != 0) {
        buscarGuiaSalida(MODELO.idguiasalida);
    } else {
        var fechaa30dias = moment().add(1, 'd').format('YYYYY-MM-DD');
        txtfechatraslado.val(fechaa30dias);
    }
    //cargarcomboboxsucursales();

    document.getElementById("codigobarra").disabled = false;

});
//eventos

$('#codigobarra').on('keyup', function (e) {
   
    if (e.originalEvent.key == "Enter") {
        var codigo = $("#codigobarra").val();
        if (codigo.length > 7) {
            var rows = $("#tbldetalleguia").dataTable().fnGetNodes();
            var contador = 0;
            for (var i = 0; i < rows.length; i++) {

                var detalle = $.trim(tbldetalleguia.row(i).data()[11]);

                if ($("#codigobarra").val() == tbldetalleguia.row(i).data()[11]) {
                    var valor = tbldetalleguia.cell(i, 6).nodes().to$().find('input').val();
                    var total = parseInt(valor) + 1;
                    var cantGuia = tbldetalleguia.row(i).data()[5];
                    var diferencia = cantGuia - total;
                    tbldetalleguia.cell(i, 6).nodes().to$().find('input').val(total);
                    tbldetalleguia.cell(i, 7).nodes().to$().find('input').val(diferencia);

                    if (diferencia == 0) {
                        $(rows[i]).find('td').eq(5).removeClass('bg-danger');
                        $(rows[i]).find('td').eq(5).removeClass('bg-warning');
                    }
                    else if (cantGuia > total) {
                        $(rows[i]).find('td').eq(5).addClass('bg-danger');
                    }
                    else {
                        $(rows[i]).find('td').eq(5).addClass('bg-warning');
                    }

                    $("#codigobarra").val("");
                    $("#codigobarra").focus();
                } else {
                    contador += 1;
                }
            }
            if (contador == rows.length) {
                mensaje("W", "No se ha encontrado el producto");
            }
        }
    }
});


btnimprimir.addEventListener('click', function () {
    fnimprimir();
});
cmbestadoguia.click(function (e) {
    //console.log(fnverificarcantidades());
    $("#estadoguia option[value='PENDIENTE'").prop("disabled", false);
    $("#estadoguia option[value='ATENDIDO'").prop("disabled", false);
    if (idtipoguia != 3 && idtipoguia != 4 && idtipoguia != 5) {
        $("#estadoguia option[value='ENTREGADO'").prop("disabled", true);
    }
    $("#estadoguia option[value='TRANSITO'").prop("disabled", false);
    // console.log(fnverificarcantidades());
    if (fnverificarcantidades())
        $("#estadoguia option[value='ATENDIDO'").prop("disabled", true);

});

function cargarcomboboxsucursales(idsucursaldestino, idempresadestino) {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('idsucursal', IDEMPRESA, null, IDSUCURSAL);
    controller.ListarSucursalxEmpresaEnCombo('idsucursaldestino', idempresadestino, null, idsucursaldestino);
}

function cargarcomboalmacenes(origen, destino, idsucursalorigen, idsucursaldestino) {
    let controler = new AlmacenSucursalController();
    //controler.ListarAlmacenxSucursal('idalmacensucursalorigen', origen, idsucursalorigen);
    controler.ListarAlmacenxSucursal('idalmacensucursaldestino', destino, idsucursaldestino);
}

function buscarGuiaSalida(id) {
    let url = ORIGEN + "/Almacen/AGuiaSalida/GetGuiaCompleta";
    let obj = { id: id };
    $.post(url, obj).done(function (data) {
        tbldetalleguia.clear().draw(false);
        if (data.mensaje === "ok") {
            let datos = JSON.parse(data.objeto);
            cargardatosGuia(datos);
        }
        else
            mensaje('W', data.mensaje);
        $('#cdbtn_generar').prop('disabled', false);
    }).fail(function (data) {
        $('#cdbtn_generar').prop('disabled', false);
        mensaje("D", "Error en el servidor");
    });
}

function cargardatosGuia(data) {

    if (data[0]["TIPOGUIA"] == 4)
        btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AMantenimientoGuia/ImprimirGuiaCliente/?id=" + data[0]["ID"]);
    else
        btnimprimir.setAttribute('href', ORIGEN + "/Almacen/AGuiaSalida/AuditoriaGuiaImprimir/" + data[0]["ID"]);
    
    txtnumdoc.val(data[0]["NUM.DOC"]);
    cmbidsucursalorigen.val(data[0]["IDSUCURSALORIGEN"]);
    //cmbidsucursaldestino.val(data[0]["IDSUCURSALDESTINO"]);
    idempresatransporte.val(data[0]["IDEMPRESATRANSPORTE"]);
    idempresatransporte.change();
    setTimeout(function () {
        idvehiculo.val(data[0]["IDVEHICULO"]);
    }, 1000);
    txtmatricula.val(data[0]["MATRICULA"]);
    txtlicencia.val(data[0]["LICENCIA"]);
    txtpeso.val(data[0]["PESOTOTAL"]);
    txtbulto.val(data[0]["BULTOS"]);
    txtclienteproveedor.val(data[0]["CLIENTEPROVEEDOR DESTINO"]);
    if (data[0]["IDEMPLEADOAUDITA"] != "")
        txtempleado_userName.val(data[0]["AUDITOR"]);
    cargarcomboalmacenes(data[0]["IDSUCURSALORIGEN"], data[0]["IDSUCURSALDESTINO"], null, data[0]["IDALMACENSUCURSALODESTINO"]);
    //data[0]["IDALMACENSUCURSALORIGEN"], data[0]["IDALMACENSUCURSALODESTINO"])
    cargarcomboboxsucursales(data[0]["IDSUCURSALDESTINO"], data[0]["IDEMPRESADESTINO"]);
    idtipoguia = data[0]["TIPOGUIA"];
    if (data[0]["TIPOGUIA"] == 3 || data[0]["TIPOGUIA"] == 4) {
        contenedorSucDestino[0].setAttribute("hidden", "");
        contenedorAlmDestino[0].setAttribute("hidden", "");
        contenedorNomProvCliDestino[0].removeAttribute("hidden");
    }

    let detalledatos = JSON.parse(data[0]["DETALLE"]);

    if (data[0]["ESTADO GUIA"] != 'PENDIENTE' && data[0]["ESTADO GUIA"] != 'ATENDIDO' && data[0]["ESTADO GUIA"] != 'TRANSITO')
        fndesactivaritems();
    let fecha = '';

    for (let i = 0; i < detalledatos.length; i++) {
        fecha = detalledatos[i]["FECHA VECIMIENTO"] == '' ? '' : detalledatos[i]["FECHA VECIMIENTO"];
        var inputDisabled = "";
        if (data[0]["ESTADO GUIA"] == 'TRANSITO') {
            inputDisabled = "disabled";
        }
        var auxtfila = tbldetalleguia.row.add([
            '<bold>' + parseInt(i + 1) + '</bold>',
            detalledatos[i]["IDDETALLE"],
            detalledatos[i]["IDPRODUCTO"],
            detalledatos[i]["CODIGO"],
            detalledatos[i]["PRODUCTO"],
            detalledatos[i]["CANTIDAD GENERADA"],
            `<input type="number" class="text-center inputselection cantidadpicking" style="width:80px;" value="` + detalledatos[i]["CANTIDAD PICKING"] + `" min="0" max="` + detalledatos[i]["CANTIDAD GENERADA"] + `" required ` + inputDisabled + `/>`,
            `<input type="number" class="text-center inputselection cantidaddiferencia" style="width:80px;" disabled value="0" required/>`,
            detalledatos[i]["IDSTOCK"],
            detalledatos[i]["LOTE"],
            fecha,
            detalledatos[i]["CODIGOBARRA"]
        ]).draw(false).node();
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    }
    fnverificarcantidadesdetalle();
}

$(document).on('change keyup', '.cantidadpicking', function () {
    var cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = ''; $(this).val(''); }
    if (cantidad === '') { $(this).val(0) };
    if (cantidad.length > 1) {
        $(this).val(zfill(cantidad, cantidad.length));
    }
    fnverificarcantidadesdetalle();
});


function fnverificarcantidadesdetalle() {
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    var c = 0;
    filas.forEach(function (e) {
        var cantpicking = parseInt(document.getElementsByClassName("cantidadpicking")[c].value);
        var cantmaxpicking = parseInt(document.getElementsByClassName("cantidadpicking")[c].max);
        document.getElementsByClassName("cantidaddiferencia")[c].value = parseFloat(cantmaxpicking) - parseFloat(cantpicking);
        var cantdiferencia = parseInt(document.getElementsByClassName("cantidaddiferencia")[c].value);
        try {
            var txtdiferenciapacking = e.getElementsByClassName('cantidaddiferencia')[0];
            var fila = txtdiferenciapacking.parentNode;
            fila.classList.remove('bg-danger');
            fila.classList.remove('bg-warning');
            if (parseFloat(cantdiferencia) < parseFloat(0))
                fila.classList.add('bg-warning');
            else if (parseFloat(cantdiferencia) > parseFloat(0))
                fila.classList.add('bg-danger');
        } catch (error) {
            console.log(error);
        }
        c++;
    });
}
function fnverificarcantidades() {
    let valor = true;
    var datatable = tbldetalleguia.rows().data();

    for (let i = 0; i < datatable.length; i++) {
        var cantdiferencia = parseInt(document.getElementsByClassName("cantidaddiferencia")[i].value);
        if (cantdiferencia != 0) {
            //console.log(cantdiferencia);
            valor = false; break;
        }
        else
            valor = true;
    }
    return valor;
}
function obtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var detalle;
    var datatable = tbldetalleguia.rows().data();
    var contador = 0;
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        detalle.iddetalleguiasalida = (datatable[c][1] === '') ? '0' : datatable[c][1];
        detalle.idproducto = datatable[c][2],
        detalle.cantidadgenerada = datatable[c][5],
        detalle.cantidadpicking = document.getElementsByClassName("cantidadpicking")[c].value;
        if (detalle.cantidadpicking == 0) {
            contador += 1;
        }
        detalle.idstock = datatable[c][8],
        detalle.estado = 'HABILITADO',
        detalle.idguiasalida = txtidguiasalida.val(),
        array[c] = detalle;
        c++;
    });

    if (contador == c) {
        return -1;
    } else {
        return array;
    }
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    let detalle = obtenerDatosDetalle();
    if (detalle == -1) {
        mensaje("W", "Todos los productos cuentan con cantidad picking 0.");
    } else {
        let url = ORIGEN + "/Almacen/AGuiaSalida/RegistrarEditar";;
        let obj = $('#form-registro').serializeArray();
        let peso_total = parseFloat(txtpeso.val(), 2);
        let bultos = parseFloat(txtbulto.val(), 2);
        let tipo = 'distribucion';
        obj[obj.length] = { name: "detalle", value: JSON.stringify(detalle) };
        obj[obj.length] = { name: "peso_total", value: JSON.stringify(peso_total) };
        obj[obj.length] = { name: "bultos", value: JSON.stringify(bultos) };
        obj[obj.length] = { name: "tipo", value: JSON.stringify(tipo) };
        BLOQUEARCONTENIDO('form-registro', 'Guardando datos ...');
        $.post(url, obj).done(function (data) {
            DESBLOQUEARCONTENIDO('form-registro');
            if (data.mensaje === "ok") {
                mensaje("S", "Registro guardado", "BR");
                if (cmbestadoguia.val() == "APROBADO") {
                    fndesactivaritems();
                }
            }
            else {
                mensaje('W', data.mensaje);
                console.log(data.mensaje);
                DESBLOQUEARCONTENIDO('form-registro');
            }
                
        }).fail(function (data) {
            DESBLOQUEARCONTENIDO('form-registro');
            mensajeError(data);
        });
    }
});

function fndesactivaritems() {
    let frm = document.forms['form-registro'];
    let ele;
    for (i = 0; ele = frm.elements[i]; i++)
        ele.disabled = true;
}

function fnimprimir() {
    if (txtidguiasalida.val() != '') {
        var href = btnimprimir.getAttribute('href');
        console.log(href);
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR GUIA REMISIÓN');
    }
}

function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
}

idempresatransporte.change(function () {
    let idempresa = $(this).val();
    if (idempresa != '')
        cargarvehiculosxEmpresa(idempresa);

});
idvehiculo.change(function () {
    let idvehiculo = $(this).val();
    if (idvehiculo != '') {
        cargarvehiculosxid(idvehiculo)
    }
});

function cargarvehiculosxEmpresa(idempresa, idvehiculo) {
    let controller = new VehiculoController();
    let params = { idempresa: idempresa };
    controller.ListarVehiculosxEmpresaEnCombo('idvehiculo', params, '', idvehiculo);
}

function cargarvehiculosxid(id) {

    let controller = new VehiculoController();
    let params = { id: id };
    if (id != 0)
        controller.BuscarVehiculoxid(params, fncargardatosvehiculo);
}
function fncargardatosvehiculo(data) {
    if (data.mensaje == "ok") {
        let datos = data.objeto;
        txtmatricula.val(datos.matricula);
        txtlicencia.val(datos.licencia);
    } else {
        mensaje("W", data.mensaje, "BR");
    }
}
function cargarEmpresa() {
    let controller = new EmpresaTransporte();
    controller.ListarEmpresasTransporteEnCombo('idempresatransporte', '', '');
}

btnLimpiarPicking.addEventListener("click", function () {
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    var c = 0;
    filas.forEach(function (e) {
        document.getElementsByClassName("cantidadpicking")[c].value = 0;
        c++;
    });
});