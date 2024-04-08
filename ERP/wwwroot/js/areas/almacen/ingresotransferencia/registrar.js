var idsalidatransferencia = $('#idsalidatransferencia');
var txtcodigo = $('#codigo');
var txtcodigosalidatransferencia = $('#txtcodigosalidatransferencia');
var txtnumguiasalida = $('#txtnumguiasalida');
var idingresotransferencia = $('#idingresotransferencia');
var fecha = $('#fecha');
var empleado_userName = $('#empleado_userName');
var empresa_descripcion = $('#empresa_descripcion');
var sucursal_descripcion = $('#sucursal_descripcion');
//var sucursal_descripcion = $('#sucursal_descripcion');
var idsucursalenvia = $('#idsucursalenvia');
var observacion = $('#observacion');
var idalmacensucursal = $('#idalmacensucursal');
var formRegistro = document.getElementById('form-registro');

var tbldetalleguia;
var btnguardar = $('#btn-guardar');
var btnimprimir = $('#btn-imprimir');
var btnlimpiar = document.getElementById('btn-limpiar');

$(document).ready(function () {
    tbldetalleguia = $('#tbldetalleguia').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[40, 80, 120, -1], [45, 85, 120, "All"]],
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
                "targets": [9],
                "visible": false,
                "searchable": false
            }
        ]
    });
    cargarcomboalmacenes('idalmacensucursal', IDSUCURSAL, '');
    fncargarcomboboxsucursal('idsucursalenvia', IDEMPRESA, '');
    if (MODELO.idingresotransferencia != 0) {
        let controller = new IngresoTransferenciaController();
        let obj = { id: MODELO.idingresotransferencia };
        controller.GetIngresoTransferenciaCompleta(obj, fnBuscarGuiaEntrada);        
    }
});

function fnBuscarGuiaEntrada(data) {
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        idsalidatransferencia.val(datos[0]["IDGUIASALIDA"]);
        txtcodigosalidatransferencia.val(datos[0]["CODIGOSALIDA"]);
        txtnumguiasalida.val(datos[0]["NUMDOCSALIDA"]);
        idingresotransferencia.val(datos[0]["IDGUIAENTRADA"]);
        txtcodigo.val(datos[0]["CODIGOINGRESO"]);
        fecha.val(moment(datos[0]["FECHA"]).format("YYYY-MM-DD"));
        empleado_userName.val(datos[0]["EMPLEADO"]);
        empresa_descripcion.val(datos[0]["EMPRESA"]);
        sucursal_descripcion.val(datos[0]["SUCURSAL"]);
        idsucursalenvia.val(datos[0]["IDSUCURSAL"]);
        observacion.val(datos[0]["OBSERVACION"]);
        idalmacensucursal.val(datos[0]["IDALMACENSUCURSAL"]);
        btnguardar.prop("disabled", true);
        btnlimpiar.disabled = true;
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
        ele.readOnly = true;
}

function fncargardetalle_guiaentrada(detalle) {
    for (let i = 0; i < detalle.length; i++) {
        fecha = detalle[i]["FECHA VECIMIENTO"] == '' ? '' : moment(detalle[i]["FECHA VECIMIENTO"]).format("DD/MM/YYYY");
        var checked = '';
        if (detalle[i]["ISFRACCION"] == 'true' || detalle[i]["ISFRACCION"] == true)
            checked = 'checked';
        else
            checked = ''

        var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado ' + checked + ' "/>';

        var auxtfila = tbldetalleguia.row.add([
            '<bold>' + parseInt(i + 1) + '</bold>',          
            detalle[i]["IDDETALLE"],
            detalle[i]["IDPRODUCTO"],
            detalle[i]["CODIGO"],
            detalle[i]["PRODUCTO"],
            detalle[i]["CANTIDAD"],
            checkfracion,
            `<input type="number" class="text-center inputselection cantidadingresada" style="width:80px;" value="` + detalle[i]["CANTIDAD"] +`" min="` + detalle[i]["CANTIDAD"] + `" max="` + detalle[i]["CANTIDAD"] + `" disabled required/>`,
            `<input type="number" class="text-center inputselection cantidaddiferencia" style="width:80px;" disabled value="0" required/>`,
            detalle[i]["IDSTOCK"],
            detalle[i]["LOTE"],
            detalle[i]["REGISTROSANITARIO"],
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

$('#txtcodigosalidatransferencia').click(function () {
    $('#modallistarguiasalida').modal();
});

$(document).on('click', '.btn-pasarguisalida', function (e) {    
    var columna = MGS_tblguiasalida.row($(this).parents('tr')).data();
    idsalidatransferencia.val(columna[2]);
    txtcodigosalidatransferencia.val(columna[3]);
    txtnumguiasalida.val(columna[4]);
    let controller = new ASalidaTransferenciaController();
    let obj = { id: columna[2] };
    controller.GetSalidaTransferencia(obj, fncargardetalleguiasalida);
    $('#modallistarguiasalida').modal('hide');
});

function fncargardetalleguiasalida(data) {
    tbldetalleguia.clear().draw(false);
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        let detalle = JSON.parse(datos[0]["DETALLE"]);
        fncargarcomboboxsucursal('idsucursalenvia', IDEMPRESA, datos[0]["IDSUCURSALORIGEN"]);
        for (let i = 0; i < detalle.length; i++) {
            fecha = detalle[i]["FECHA VECIMIENTO"] == '' ? '' : moment(detalle[i]["FECHA VECIMIENTO"]).format("DD/MM/YYYY");


            var checked = '';
            if (detalle[i]["ISFRACCION"] == 'true' || detalle[i]["ISFRACCION"] == true)
                checked = 'checked';
            else
                checked = ''

            var checkfracion = '<input   class="checkfraccion_detalle" type="checkbox" disabled deshabilitado ' + checked + ' "/>';


            var auxtfila = tbldetalleguia.row.add([
                '<bold>' + parseInt(i + 1) + '</bold>',
                0,
                detalle[i]["IDPRODUCTO"],
                detalle[i]["CODIGO"],
                detalle[i]["PRODUCTO"],
                detalle[i]["CANTIDAD"],
                checkfracion,
                `<input type="number" class="text-center inputselection cantidadingresada" style="width:80px;" value="`+detalle[i]["CANTIDAD"] +`" min="` + detalle[i]["CANTIDAD"] + `" max="` + detalle[i]["CANTIDAD"] + `" required/>`,
                `<input type="number" class="text-center inputselection cantidaddiferencia" style="width:80px;" disabled value="0" required/>`,
                detalle[i]["IDSTOCK"],
                detalle[i]["LOTE"],
                detalle[i]["REGISTROSANITARIO"],
                fecha
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
    let url = ORIGEN + "/Almacen/AIngresoTransferencia/RegistrarEditar";
    btnguardar.prop("disabled", true);
    let obj = $('#form-registro').serializeArray();
    let detalle = fnobtenerDatosDetalle();
    obj[obj.length] = { name: "jsondetalle", value: JSON.stringify(detalle) };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje("S", "Registro guardado", "BR");
            idingresotransferencia.val(data.objeto.idingresotransferencia);
            txtcodigo.val(data.objeto.codigo);
            fncambiarmodificacionxguardado(true);
            fndesactivaritems();
            btnlimpiar.disabled = false;
        }
        else {
            mensaje('W', data.mensaje);
            fncambiarmodificacionxguardado(false);
            
        }
        
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});

function fncambiarmodificacionxguardado(estado) {
    txtcodigosalidatransferencia.prop("disabled", estado);
    txtnumguiasalida.prop("disabled", estado);
    txtcodigo.prop("disabled", estado);
    btnguardar.prop('disabled', estado);
}

function dateStringFormat(myFecha) {

    var dateString = myFecha;

    var dateParts = dateString.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    var dateObject = (dateParts?.length < 3) ? null : new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 

    return dateObject;
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

        detalle.idsalidatransferenciadetalle = (datatable[c][1] === '') ? '0' : datatable[c][1];
        detalle.idproducto = datatable[c][2];
        detalle.idstock = datatable[c][9];
        detalle.cantidad = document.getElementsByClassName("cantidadingresada")[c].value;
        detalle.lote = datatable[c][10];
        detalle.regsanitario = datatable[c][11];
        detalle.fechavencimiento = dateStringFormat(datatable[c][12]);
        detalle.idalmacensucursal = idalmacensucursal.val();
        detalle.estado = 'HABILITADO';

        var isfraccion = e.getElementsByClassName('checkfraccion_detalle')[0];
        detalle.isfraccion = isfraccion === undefined ? null : isfraccion.checked;

        detalle.idingresotransferencia = idingresotransferencia.val();
            array[c] = detalle;
        c++;
    });
    return array;
}

btnlimpiar.addEventListener('click', function () {
    formRegistro.reset();
    txtcodigosalidatransferencia.prop("disabled", false);
    txtnumguiasalida.prop("disabled", true);
    txtcodigo.prop("disabled", false);
    idalmacensucursal.prop('disabled', false);
    observacion.prop('disabled', false);
    tbldetalleguia.clear().draw(false);
    btnguardar.prop('disabled', false);
    idingresotransferencia.val(0);
    let frm = document.forms['form-registro'];
    let ele;
    for (i = 0; ele = frm.elements[i]; i++)
        ele.readOnly = false;
});