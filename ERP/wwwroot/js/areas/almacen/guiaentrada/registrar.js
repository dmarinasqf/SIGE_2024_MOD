
var idguiasalida = $('#idguiasalida');
var txtcodigoguiasalida = $('#txtcodigoguiasalida');
var txtnumguiasalida = $('#txtnumguiasalida');
var idguiaentrada = $('#idguiaentrada');
var txtcodigo = $('#codigo');
var fecha = $('#fecha');
var empleado_userName = $('#empleado_userName');
var empresa_descripcion = $('#empresa_descripcion');
var sucursal_descripcion = $('#sucursal_descripcion');
//var sucursal_descripcion = $('#sucursal_descripcion');
var idsucursalenvia = $('#idsucursalenvia');
var observacion = $('#observacion');
var idalmacensucursal = $('#idalmacensucursal');

var tbldetalleguia;
var btnguardar = $('#btn-guardar');
var btnimprimir = $('#btn-imprimir');

$(document).ready(function () {
    tbldetalleguia = $('#tbldetalleguia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[50, 80, 100, -1], [50, 85, 100, "All"]],
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
    cargarcomboalmacenes('idalmacensucursal', IDSUCURSAL, '');
    //fncargarcomboboxsucursal('idsucursalenvia', IDEMPRESA, '');
    if (MODELO.idguiaentrada != 0) {
        let controller = new GuiaEntradaController();
        let obj = { id: MODELO.idguiaentrada};
        controller.GetGuiaEntradaCompleta(obj, fnBuscarGuiaEntrada);        
    }
});

function fnBuscarGuiaEntrada(data) {
   
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        console.log(datos);
        fncargarcomboboxsucursal('idsucursalenvia', datos[0]["IDEMPRESAENVIA"], datos[0]["IDSUCURSALENVIA"]);
        idguiasalida.val(datos[0]["IDGUIASALIDA"]);
        txtcodigoguiasalida.val(datos[0]["CODIGOGUIASALIDA"]);
        txtnumguiasalida.val(datos[0]["NUMDOCGUIASALIDA"]);
        idguiaentrada.val(datos[0]["IDGUIAENTRADA"]);
        txtcodigo.val(datos[0]["CODIGOGUIAENTRADA"]);
        fecha.val(moment(datos[0]["FECHA"]).format("YYYY-MM-DD"));
        if (datos[0]["EMPLEADO"] != "")
            empleado_userName.val(datos[0]["EMPLEADO"]);
        empresa_descripcion.val(datos[0]["EMPRESA"]);
        sucursal_descripcion.val(datos[0]["SUCURSAL"]);
        idsucursalenvia.val(datos[0]["IDSUCURSAL"]);
        observacion.val(datos[0]["OBSERVACION"]);
        idalmacensucursal.val(datos[0]["IDALMACENSUCURSAL"]);
        btnguardar.prop("disabled", true);
        let detalle = JSON.parse(datos[0]["DETALLE"]);
        fncargardetalle_guiaentrada(detalle);
        //desactivar items
        fndesactivaritems();
    } else
        mensaje("W", data.mensaje,"BR");
}

function fndesactivaritems() {
    let frm = document.forms['form-registro'];
    let ele;
    for (i = 0; ele = frm.elements[i]; i++)
        ele.disabled = true;
}

function fncargardetalle_guiaentrada(detalle) {
    for (let i = 0; i < detalle.length; i++) {
        fecha = detalle[i]["FECHA VECIMIENTO"] == '' ? '' : detalle[i]["FECHA VECIMIENTO"];
        var auxtfila = tbldetalleguia.row.add([
            '<bold>' + parseInt(i + 1) + '</bold>',          
            detalle[i]["IDDETALLE"],
            detalle[i]["IDPRODUCTO"],
            detalle[i]["CODIGO"],
            detalle[i]["PRODUCTO"],
            detalle[i]["CANTIDAD ENVIADA"],
            `<input type="number" class="text-center inputselection cantidadingresada" style="width:80px;" value="` + detalle[i]["CANTIDAD INGRESO"] +`" min="` + detalle[i]["CANTIDAD ENVIADA"] + `" max="` + detalle[i]["CANTIDAD ENVIADA"] + `" disabled required/>`,
            `<input type="number" class="text-center inputselection cantidaddiferencia" style="width:80px;" disabled value="0" required/>`,
            detalle[i]["IDSTOCK"],
            detalle[i]["LOTE"],
            fecha
        ]).draw(false).node();
        $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
    }
}
//ListarAlmacenxSucursal
function cargarcomboalmacenes(idcmb,idsucursal, idalmacensucursal) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal(idcmb, idsucursal, idalmacensucursal);
}
function fncargarcomboboxsucursal(idcmb, idempresa, idsucursal) {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo(idcmb, idempresa, '', idsucursal);
}

$('#txtcodigoguiasalida').click(function () {
    $('#modallistarguiasalida').modal();
});

$(document).on('click', '.btn-pasarguisalida', function (e) {    
    var columna = MGS_tblguiasalida.row($(this).parents('tr')).data();
    idguiasalida.val(columna[2]);
    txtcodigoguiasalida.val(columna[3]);
    txtnumguiasalida.val(columna[4]);
    let controller = new GuiaSalidaController();
    let obj = { id: columna[2] };
    controller.GetGuiaSalidaCompleta(obj, fncargardetalleguiasalida);
    $('#modallistarguiasalida').modal('hide');
});


function fncargardetalleguiasalida(data) {
    tbldetalleguia.clear().draw(false);
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        let detalle = JSON.parse(datos[0]["DETALLE"]);
      
        fncargarcomboboxsucursal('idsucursalenvia', datos[0]["IDEMPRESAORIGEN"], datos[0]["IDSUCURSALORIGEN"]);
        console.log(datos);
        for (let i = 0; i < detalle.length; i++) {
            fecha = detalle[i]["FECHA VECIMIENTO"] == '' ? '' : detalle[i]["FECHA VECIMIENTO"];
            var splitfecha = fecha.toString().split("/");
            fecha = splitfecha[2] + "-" + splitfecha[1] + "-" + splitfecha[0];
            var auxtfila = tbldetalleguia.row.add([
                '<bold>' + parseInt(i + 1) + '</bold>',
                0,
                detalle[i]["IDPRODUCTO"],
                detalle[i]["CODIGO"],
                detalle[i]["PRODUCTO"],
                detalle[i]["CANTIDAD PICKING"],
                `<input type="number" class="text-center inputselection cantidadingresada" style="width:80px;" value="` + detalle[i]["CANTIDAD PICKING"]+`" min="` + detalle[i]["CANTIDAD PICKING"] + `" max="` + detalle[i]["CANTIDAD PICKING"] + `" required/>`,
                `<input type="number" class="text-center inputselection cantidaddiferencia" style="width:80px;" disabled value="0" required/>`,
                detalle[i]["IDSTOCK"],
                `<input type="text" class="text-center lote" style="width: 100%;" value="` + detalle[i]["LOTE"] + `" required/>`,//detalle[i]["LOTE"]
                `<input type="date" class="text-center fechavencimiento" style="width: 100%;" value="` + fecha + `" required/>`//fecha
            ]).draw(false).node();
            $(auxtfila).find('td').eq(0).attr({ 'class': 'sticky' });
        }
    } else {
        mensaje("W", data.mensaje,"BR");
    }
    fnverificarcantidadesdetalle();
}

$(document).on('change keyup', '.cantidadingresada', function () {
    var cantidad = $(this).val();
    if (cantidad === '' || cantidad === 0) { cantidad = 0; $(this).val('0'); }
    fnverificarcantidadesdetalle();
});

function fnverificarcantidadesdetalle() {
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    var c = 0;
    var cantingresada=0;
    var cantmaxingresar=0;
    filas.forEach(function (e) {
         cantingresada = parseInt(document.getElementsByClassName("cantidadingresada")[c].value);
        //if (cantingresada == isNaN)
        //    cantingresada = 0;
         cantmaxingresar = parseInt(document.getElementsByClassName("cantidadingresada")[c].max);
        document.getElementsByClassName("cantidaddiferencia")[c].value = parseFloat(cantmaxingresar) - parseFloat(cantingresada);
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

$('#form-registro').submit(function (e) {
    e.preventDefault();
    let url = ORIGEN + "/Almacen/AGuiaEntrada/RegistrarEditar";;
    let obj = $('#form-registro').serializeArray();
    let detalle = fnobtenerDatosDetalle();
  
    obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
    BLOQUEARCONTENIDO('form-registro', 'Guardando datos ...');
    btnguardar.prop('disabled', true);

    $.post(url, obj).done(function (data) {
       
        if (data.mensaje === "ok") {
            mensaje("S", "Registro guardado", "BR");
            idguiaentrada.val(data.objeto.idguiaentrada);
            txtcodigo.val(data.objeto.codigo);
            fncambiarmodificacionxguardado(true);
        }
        else {
            mensaje('W', data.mensaje);
            fncambiarmodificacionxguardado(false);
        }
        btnguardar.prop('disabled', false);
        DESBLOQUEARCONTENIDO('form-registro');
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        DESBLOQUEARCONTENIDO('form-registro');
        mensajeError(data);
    });
});

function fncambiarmodificacionxguardado(estado) {
    txtcodigoguiasalida.prop("disabled", estado);
    txtnumguiasalida.prop("disabled", estado);
    txtcodigo.prop("disabled", estado);
}

function fnobtenerDatosDetalle() {
    var array = [];
    var c = 0;
    var detalle;
    var datatable = tbldetalleguia.rows().data();
    if (!(datatable.length > 0))
        return [];
    var filas = document.querySelectorAll("#tbldetalleguia tbody tr");
    filas.forEach(function (e) {
        detalle = new Object();
        detalle.iddetalleguiaentrada = (datatable[c][1] === '') ? '0' : datatable[c][1];
        detalle.idproducto = datatable[c][2],
        detalle.cantidadenviada = datatable[c][5],
        detalle.cantidadingresada = document.getElementsByClassName("cantidadingresada")[c].value;    
        detalle.idstock = datatable[c][8],
        detalle.estado = 'HABILITADO',
        detalle.idguiaentrada = idguiaentrada.val(),
            array[c] = detalle;
        c++;
    });
    return array;
}
