
var formcuenta = document.getElementById('formcuenta');
var txtCCctaproveedor = document.getElementById('txtCCctaproveedor');
var btnagregarcuenta = document.getElementById('btnagregarcuenta');
var tbodycuentas = document.getElementById('tbodycuentas');
var cmbCCmonedacuenta = document.getElementById('cmbCCmonedacuenta');
var cmbCCbancocuenta = document.getElementById('cmbCCbancocuenta');

var txtCCswift = document.getElementById('txtCCswift');
var txtCCaba = document.getElementById('txtCCaba');
var txtCCiban = document.getElementById('txtCCiban');
var txtCCdireccionbanco = document.getElementById('txtCCdireccionbanco');
var txtCCbeneficiario = document.getElementById('txtCCbeneficiario');
var txtCCdireccionbeneficiario = document.getElementById('txtCCdireccionbeneficiario');

var txtCCbancointermediario = document.getElementById('txtCCbancointermediario');
var txtCCdireccionintermediario = document.getElementById('txtCCdireccionintermediario');
var txtCCswiftintermediario = document.getElementById('txtCCswiftintermediario');
var txtCCcuentaintermediario = document.getElementById('txtCCcuentaintermediario');
formcuenta.addEventListener('submit', function (e) {
    e.preventDefault();
    if (txtcodigo.val().length == 0)
        return;
    var obj = $('#formcuenta').serializeArray();

    obj[obj.length] = { name: 'idproveedor', value: txtcodigo.val() };
    obj[obj.length] = { name: 'id', value: txtCCctaproveedor.getAttribute('id') };
    let controller = new ProveedorController();
    controller.RegistrarCuenta(obj, function (data) {
        nuevodatoscuenta();
        fnlistarcuentasproveedor();
    });
});
$(document).on('click', '.btnquitarcuenta', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('id');
    let controller = new ProveedorController();
    controller.EliminarCuenta(id, function () {
        fnlistarcuentasproveedor();
    });
});
$(document).on('click', '.btneditarcuenta', function () {
    var fila = this.parentNode.parentNode;
    var id = fila.getAttribute('id');
    let controller = new ProveedorController();
    controller.BuscarCuenta(id, function (data) {
        data = data.objeto;
        txtCCctaproveedor.setAttribute('id', data.id);
        txtCCctaproveedor.value = data.numcuenta;
        cmbCCmonedacuenta.value = data.idmoneda;
        cmbCCbancocuenta.value = data.idbanco;
        txtCCaba.value = data.aba;
        txtCCbeneficiario.value = data.beneficiary;
        txtCCdireccionbeneficiario.value = data.beneficiary;
        txtCCdireccionbeneficiario.value = data.adreesbeneficiary;
        txtCCdireccionbanco.value = data.direccion;
        txtCCswift.value = data.swift;
        txtCCiban.value = data.iban;

        txtCCbancointermediario.value = data.bancointermedio;
        txtCCdireccionintermediario.value = data.direccionintermediario;
        txtCCswiftintermediario.value = data.swiftintermediario;
        txtCCcuentaintermediario.value = data.cuentaintermediario;
    });

});

function fnlistarcuentasproveedor() {
    let controller = new ProveedorController();
    controller.ListarCuentas(txtcodigo.val(), function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].id + '">';
            fila += '<td>' + data[i].numcuenta + '</td>';
            fila += '<td>' + data[i].banco + '</td>';
            fila += '<td>' + data[i].ubicacion + '</td>';
            fila += '<td>' + data[i].moneda + '</td>';
            fila += '<td>' + (data[i].swift??'') + '</td>';
            fila += '<td>' +( data[i].aba??'') + '</td>';
            fila += '<td>' + (data[i].iban??'') + '</td>';
            fila += '<td>' + (data[i].bancointermedio??'') + '</td>';
            fila += '<td><button class="btneditarcuenta"><i class="fas fa-edit"></i></button><button class="btnquitarcuenta"><i class="fas fa-trash"></i></button></td>';
            fila += '</tr>';
        }
        tbodycuentas.innerHTML = fila;
    });
}
function nuevodatoscuenta() {
    txtCCctaproveedor.setAttribute('id', '');
    formcuenta.reset();
}


