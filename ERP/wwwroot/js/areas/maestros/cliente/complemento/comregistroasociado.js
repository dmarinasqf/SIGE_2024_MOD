var txtidclienteasociado = document.getElementById('txtidclienteasociado');
var txtcmp = document.getElementById('txtcmp');
var txtdirectortecnico = document.getElementById('txtdirectortecnico');
var cmbtipopago = document.getElementById('cmbtipopago');
var txtcontacto = document.getElementById('txtcontacto');
var txtcelularcontacto = document.getElementById('txtcelularcontacto');
var txthoraatencion = document.getElementById('txthoraatencion');
var txtidmedico = document.getElementById('txtidmedico');
var txtidmedico2 = document.getElementById('txtidmedico2');
var btnguardarasociado = document.getElementById('btnguardarasociado');
var cmbbuscardirector = document.getElementById('cmbbuscardirector');
var formregistroasociado = document.getElementById('formregistroasociado');

var btnbuscarmedico = document.getElementById('btnbuscarmedico');

//tabasociado.addEventListener('click', function () {

//});
$(document).ready(function () {
    fndatosinicioasociado();
})
function fndatosinicioasociado() {
    let condicionpago = new CondicionPagoController();
    condicionpago.Listar('cmbtipopago');
}
function fnlimpiardatosasociado() {
    txtcmp.value = '';
    txtdirectortecnico.value ='';
    txtcontacto.value ='';
    cmbtipopago.value = '';
    txthoraatencion.value ='';
    txtidmedico.value = '';
    txtidmedico2.value = '';
    txtidclienteasociado.value ='';
    txtcelularcontacto.value = '';

    txtnumcolegiatura.value = '';
    txtnombremedico.value = '';
}
function fncargardatosasociado(data) {
    //console.log(data);
    if (data == null) return;
    txtidmedico2.value = data.idmedico;
    txtnumcolegiatura.value = data.cmp;
    txtnombremedico.value = data.nombremedico

    //txtcmp.value = data.cmp;
    //txtdirectortecnico.value = data.nombremedico;
    txtcontacto.value = data.contacto;
    cmbtipopago.value = data.idcondicionpago;
    txthoraatencion.value = data.horaatencion;
    txtidmedico.value = data.idmedico;
    txtidclienteasociado.value = data.idclienteasociado;
    txtcelularcontacto.value = data.celularcontacto;
}
formregistroasociado.addEventListener('submit', function (e) {

    e.preventDefault();
    let controller = new ClienteController();
    var form = $('#formregistroasociado').serializeArray();
    form[form.length] = { name: 'idcliente', value: txtcodigo.value };
    var obj = {
        cliente: CONVERT_FORM_TO_JSON(form),
    }
    controller.RegistrarEditarClienteAsociado(obj, function (data) {
        console.log(data);
    });

});
btnbuscarmedico.addEventListener('click', function () {
    $('#modalmedico').modal('show');
});
$(document).on('click', '.MMbtnpasarmedico', function () {
    var fila = this.parentNode.parentNode;
    console.log(fila);
    //txtidmedico.value = this.getAttribute('id');
    txtidmedico2.value = this.getAttribute('id');
    txtnumcolegiatura.value = fila.getElementsByTagName('td')[2].innerText;
    txtnombremedico.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalmedico').modal('hide');
});

function buscarMedico(e) {
    if (e.key == 'Enter') {

    }
}