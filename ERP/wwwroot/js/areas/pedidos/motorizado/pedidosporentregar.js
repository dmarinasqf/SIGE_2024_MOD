var btnListarEntregas = $('#btnListarEntregas');
var txtfechacalendar = $('#txtfechacalendar');
var btnGuardar = document.getElementById('btnGuardar');

var DATOSENVIOCOMPLETO;
$(document).ready(function () {

});

btnListarEntregas.click(function () {
    fecha = moment(txtfechacalendar.val()).format("DD/MM/YYYY");
    if (fecha !== "Invalid date") {
        window.location = ORIGEN + '/Pedidos/Motorizado/PedidosPorEntregar?fecha='
            + fecha + '&estado=' + 'EN RUTA';
    } else {
        mensaje("W", "Seleccione una fecha correcta");
    }
});

function mostraModalEP(id) {
    $('#modalEntregaPedido').modal();
    MEP_txtcodigo.val(id);
    MEP_cmbestadoentrega.val("ENTREGADO");
    //MEP_txtcliente.val(cliente);
    //MEP_txtpaciente.val(paciente);
    //MEP_txtreferencia1.val(ref1);
    //MEP_txtreferencia2.val(ref2);
    //MEP_cmbestadoentrega.val("ENTREGADO");
    //buscarDetallePedido(idpedido);
    buscarEntrega(id);

}
MEP_cmbestadoentrega.change(function (e) {
    if (MEP_cmbestadoentrega.val() === 'ENTREGADO') {
        MEP_txtnumdocencomienda.prop('required', true);
        MEP_txtclaveencomienda.prop('required', true);
        MEP_txtfoto.prop('required', true);

        if (DATOSENVIOCOMPLETO[0]['ESENCOMIENDA']) {
            MEP_txtnumdocencomienda.prop('required', true);
            MEP_txtclaveencomienda.prop('required', true);
        } else {
            MEP_txtnumdocencomienda.prop('required', false);
            MEP_txtclaveencomienda.prop('required', false);
        }
    } else {
        MEP_txtnumdocencomienda.prop('required', false);
        MEP_txtclaveencomienda.prop('required', false);
        MEP_txtfoto.prop('required', false);
    }
    if (DATOSENVIOCOMPLETO[0]['ESTADOENTREGA'] === 'ENTREGADO')
        MEP_txtfoto.prop('required', false);

});

btnGuardar.addEventListener('click', function () {
    $('#MEP_form-registro').submit();
});
$('#MEP_form-registro').submit(function (e) {
    e.preventDefault();
    if (MEP_txtcodigo.val() === "") {
        mensaje("W", "Seleccione un pedido");
        return;
    }
    if (MEP_txtfoto.val() === "" && MEP_cmbestadoentrega.val() === "ENTREGADO" && DATOSENVIOCOMPLETO[0]['ESTADOENTREGA'] != 'ENTREGADO') {
        mensaje("W", "Seleccione una foto, como prueba de la entrega");
        return;
    }
    if (MEP_cmbestadoentrega[0].value == "EN RUTA") {
        mensaje("W", "Seleccione un estado distinto");
        return;
    }
    //if (MEP_txtobservacion.val() === "") {
    //    mensaje("W", "Registre una observación");
    //    return;
    //}
    btnguardar.prop("disabled", true);
    var dataString = new FormData();
    
    var url = ORIGEN + '/Pedidos/Motorizado/RegistrarEntregaPedido';
    var selectFile = ($('#MEP_txtfoto'))[0].files[0];
    var obj = $('#MEP_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        dataString.append(obj[i].name, obj[i].value);
    }
    dataString.append('img', selectFile);   
    $.ajax({
        url: url,
        type: "POST",
        data: dataString,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            if (data.mensaje === 'ok') {
                mensaje("S", 'Registro  guardado');
                document.getElementById('MEP_txtfoto').value = '';
                btnguardar.prop("disabled", false);
                limpiar();
                setTimeout("location.reload()", 1000);
            } else {
                btnguardar.prop("disabled", false);
                mensaje('W', data.mensaje);
                limpiar();
            }
            $('#modalEntregaPedido').modal('hide');
        }, error: function (data) {
            btnguardar.prop("disabled", false);
            limpiar();
        }
    });
    //guardarImagenEntrega(obj);
});
//imagen entrega

var img = document.getElementById("MEP_txtimagen");

$("#MEP_txtfoto").change(function () {
    let reader = new FileReader();
    var file = document.querySelector('input[id=MEP_txtfoto]')['files'][0];
    reader.readAsDataURL(file);
    var imagen = "";
    reader.onload = function () {
        img.src = reader.result;
    };

});

function limpiar() {
    MEP_txtcodigo.val('');
    MEP_txtpaciente.val('');
    MEP_txtcliente.val('');
    MEP_txtreferencia1.val('');
    MEP_txtreferencia2.val('');
    MEP_txtobservacion.val('');
    MEP_txtfoto.prop("src", "");
    MEP_txtclaveencomienda.val('');
    MEP_txtpersonarecoge.val('');
    MEP_txtnumdocencomienda.val('');
}