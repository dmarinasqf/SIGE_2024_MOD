//VARIABLES
var MEP_txtcodigo = $('#MEP_txtcodigo');
var MEP_txtpaciente = $('#MEP_txtpaciente');
var MEP_txtcliente = $('#MEP_txtcliente');
var MEP_txtreferencia1 = $('#MEP_txtreferencia1');
var MEP_txtreferencia2 = $('#MEP_txtreferencia2');
var MEP_txtfoto = $('#MEP_txtfoto');
var MEP_txtfechaentrega = $('#MEP_txtfechaentrega');
var MEP_cmbestadoentrega = $('#MEP_cmbestadoentrega');
var MEP_txtobservacion = $('#MEP_txtobservacion');
var MEP_lblnumpedido = $('#MEP_lblnumpedido');

var MEP_lblnumerocliente = $('#MEP_lblnumerocliente');
var MEP_lbldepartamento = $('#MEP_lbldepartamento');
var MEP_lblprovincia = $('#MEP_lblprovincia');
var MEP_lbldistrito = $('#MEP_lbldistrito');
var MEP_lbldireccion = $('#MEP_lbldireccion');
var MEP_lbldocpaciente = $('#MEP_lbldocpaciente');
var MEP_lblcelular1 = $('#MEP_lblcelular1');
var MEP_lblcelular2 = $('#MEP_lblcelular2');
var MEP_lbldoccliente = $('#MEP_lbldoccliente');
var MEP_lblcelularcliente = $('#MEP_lblcelularcliente');
var MEP_lblcelularcontactocliente = $('#MEP_lblcelularcontactocliente');
//DATOS ENCOMIENDA
var MEP_txtnumdocencomienda = $('#MEP_txtnumdocencomienda');
var MEP_txtclaveencomienda = $('#MEP_txtclaveencomienda');
var MEP_lblagenciaencomienda = $('#MEP_lblagenciaencomienda');
var MEP_txtpersonarecoge = $('#MEP_txtpersonarecoge');
//DATOS DE PAGO CONTRA ENTREGA
var MEP_numoperacion = $('#MEP_numoperacion');
var MEP_montopagocontraentrega = $('#MEP_montopagocontraentrega');

var MEP_cardpaciente = document.getElementById('MEP_cardpaciente');
var MEP_cardcliente = document.getElementById('MEP_cardcliente');
var MEP_carddatosencomienda = document.getElementById('MEP_carddatosencomienda');
var MEP_carddatospago = document.getElementById('MEP_carddatospago');

var MEP_tbldetallepedido;
var btnguardar = $('#btnGuardar');
var MEP_txtimagen = $('#MEP_txtimagen');


$(document).ready(function () {
    MEP_tbldetallepedido = $('#MEP_tbldetallepedido').DataTable({
        "searching": false,
        lengthChange: false,
        responsive: true,
        "ordering": false,
        "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
        info: false,
     

    });
});

function buscarEntrega(id) {
    var url = ORIGEN + '/Pedidos/Motorizado/BuscarPedidoEntrega';
    var obj = {
        id: id
    };
    MEP_cardcliente.style.display = 'none';
    MEP_cardpaciente.style.display = 'none';
    MEP_carddatosencomienda.style.display = 'none';
    MEP_carddatospago.style.display = 'none';
    //MEP_txtnumdocencomienda.prop('required', false);
    //MEP_txtclaveencomienda.prop('required', false);
    DATOSENVIOCOMPLETO = [];

    $.post(url, obj).done(function (data) {
        var CABECERA = data
        DATOSENVIOCOMPLETO = CABECERA;
        if (CABECERA[0]['ENVIARA'] === 'CLIENTE')
            MEP_cardcliente.style.display = 'block';
        else if (CABECERA[0]['ENVIARA'] === 'PACIENTE')
            MEP_cardpaciente.style.display = 'block';
        else {
            MEP_cardpaciente.style.display = 'block';
            MEP_cardcliente.style.display = 'block';
        }
        if (CABECERA[0]['ESENCOMIENDA']) {
            MEP_carddatosencomienda.style.display = 'block';
            //MEP_txtnumdocencomienda.prop('required', true);
            //MEP_txtclaveencomienda.prop('required', true);
            MEP_lblagenciaencomienda.text(CABECERA[0]['AGENCIAENCOMIENDA']);
            if (CABECERA[0]['ENVIARA'] === 'CLIENTE')
                MEP_txtnumdocencomienda.val(CABECERA[0]['DOCCLIENTE']);
            else if (CABECERA[0]['ENVIARA'] === 'PACIENTE')
                MEP_txtnumdocencomienda.val(CABECERA[0]['DOCPACIENTE']);

            if (CABECERA[0]['DOCENVIOAGENCIA'] != '')
                MEP_txtnumdocencomienda.val(CABECERA[0]['DOCENVIOAGENCIA']);
            MEP_txtclaveencomienda.val(CABECERA[0]['CLAVEENVIOAGENCIA']);
            MEP_txtpersonarecoge.val(CABECERA[0]['PERSONARECOGEAGENCIA']);

        }


        //DATOS DE ENVIO
        MEP_lblnumpedido.text(CABECERA[0]['IDPEDIDO']);
        MEP_txtreferencia1.text(CABECERA[0]['REFERENCIA1']);
        MEP_txtreferencia2.text(CABECERA[0]['REFERENCIA2']);
        MEP_lblnumerocliente.text(CABECERA[0]['NUMERO']);
        MEP_lbldepartamento.text(CABECERA[0]['DEPARTAMENTO']);
        MEP_lblprovincia.text(CABECERA[0]['PROVINCIA']);
        MEP_lbldistrito.text(CABECERA[0]['DISTRITO']);
        MEP_lbldireccion.text(CABECERA[0]['DIRECCIONENVIO']);
        MEP_txtobservacion.val(CABECERA[0]['OBSERVACION']);
        //DATOS DE PACIENTE
        MEP_lbldocpaciente.text(CABECERA[0]['DOCPACIENTE']);
        MEP_lblcelular1.text(CABECERA[0]['CELULARPAC1']);
        MEP_lblcelular2.text(CABECERA[0]['CELULARPAC2']);
        MEP_txtpaciente.text(CABECERA[0]['PACIENTE']);

        //DATOS DE CLIENTE
        MEP_lbldoccliente.text(CABECERA[0]['DOCCLIENTE']);
        MEP_txtcliente.text(CABECERA[0]['CLIENTE']);
        MEP_lblcelularcliente.text(CABECERA[0]['CELULARCLI']);
        MEP_lblcelularcontactocliente.text(CABECERA[0]['CELULARCLICONTACTO']);

        MEP_txtimagen.prop('src', "/imagenes/delivery/entregapedido/fotoentrega/" + CABECERA[0]['FOTOENTREGA']);
        MEP_cmbestadoentrega.val(CABECERA[0]['ESTADOENTREGA']);
        MEP_txtfechaentrega.val(moment(CABECERA[0]['FECHAENTREGA']).format('YYYY-MM-DD'));

        //DETALLE
        var detalle = JSON.parse(CABECERA[0]['DETALLE']);
        var total = 0;
        var cantidad = 0;
        MEP_tbldetallepedido.clear().draw();
        document.getElementById('bold_cantidad').innerHTML = cantidad;
        document.getElementById('bold_total').innerHTML = total;
        for (var i = 0; i < detalle.length; i++) {
            var auxcantidad = detalle[i]['ITEM'] === "GASTO DE ENVIO" ? 1 : detalle[i]['CANTIDAD'];
            MEP_tbldetallepedido.row.add([
                detalle[i]['ITEM'],
                auxcantidad,
                detalle[i]['PRECIO'].toFixed(2)
            ]).draw(false);
            total += auxcantidad * detalle[i]['PRECIO'];
            cantidad += auxcantidad;

        }
        document.getElementById('bold_cantidad').innerHTML = cantidad;
        document.getElementById('bold_total').innerHTML = total.toFixed(2);
        if (CABECERA[0]['TIPOPAGO'] === 'PAGO CONTRA ENTREGA') {
            MEP_carddatospago.style.display = 'block';
            MEP_numoperacion.val('');
            MEP_montopagocontraentrega.val(total.toFixed(2));
        }


    }).fail(function (data) {

        mensaje("D", "Error en el servidor.");
    });
}
