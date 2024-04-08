
var MC_lblnombrecaja = document.getElementById('MC_lblnombrecaja');
var formdocumentocorrelativo = document.getElementById('formdocumentocorrelativo');


var MC_tabladocumentos = document.getElementById('MC_tabladocumentos');
var MC_seleccionarcajaasociada = document.getElementById('MC_seleccionarcajaasociada');
var MC_txtidcajasucursal = document.getElementById('MC_txtidcajasucursal');
var MC_txtserie = document.getElementById('MC_txtserie');
var MC_txtempieza = document.getElementById('MC_txtempieza');
var MC_cmbestado = document.getElementById('MC_cmbestado');
var MC_cmbdoctributario = document.getElementById('MC_cmbdoctributario');
var MC_txtidcorrelativo = document.getElementById('MC_txtidcorrelativo');
var MC_tbldocumentossucursal = document.getElementById('MC_tbldocumentossucursal');
var MC_tbldocumentossucursal_tbody = document.getElementById('MC_tbldocumentossucursal_tbody');


var MC_txtnombreimpresora = document.getElementById('MC_txtnombreimpresora');
var MC_txtserieimpresora = document.getElementById('MC_txtserieimpresora');
var MC_txtipimpresora = document.getElementById('MC_txtipimpresora');
var MC_btnguardardatosimpresora = document.getElementById('MC_btnguardardatosimpresora');
var MC_checkcorrelativoasociadoaotracaja = document.getElementById('MC_checkcorrelativoasociadoaotracaja');

var MC_cmbidcajacorrelativoasociado = document.getElementById('MC_cmbidcajacorrelativoasociado');

var MC_btnguardardatosimpresora = document.getElementById('MC_btnguardardatosimpresora');

$(document).ready(function () {

});

MC_checkcorrelativoasociadoaotracaja.addEventListener('click', function () {
    if (this.checked) {
        MC_seleccionarcajaasociada.classList.remove('deshabilitartodo');
        MC_tabladocumentos.classList.add('deshabilitartodo');
    }
    else {
        MC_seleccionarcajaasociada.classList.add('deshabilitartodo');
        MC_tabladocumentos.classList.remove('deshabilitartodo');
    }
});

formdocumentocorrelativo.addEventListener("submit", function (e) {
    e.preventDefault();
    if (MC_txtserie.value.length != 4) {
        mensaje('W', 'La longitud de la serie es de 4 dígitos');
        return;
    }
    var obj = $(this).serializeArray();
    obj[obj.length] = { name: 'idcajasucursal', value: MC_txtidcajasucursal.value };
    let cajacontroller = new CajaController();   
    cajacontroller.RegistrarEditarCorrelativosPorCaja(obj, function (data) {
        formdocumentocorrelativo.reset();      
        fnListarCorrelativosPorCaja(data.idcajasucursal);
    });
});

function fnListarCorrelativosPorCaja(idcajasucursal) {
    console.log(idcajasucursal);
    //correlativos de caja
    let cajacontroller = new CajaController();
    cajacontroller.ListarCorrelativosPorCaja(idcajasucursal, function (data) {     
        MC_tbldocumentossucursal_tbody.innerHTML = '';
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr>';
            fila += '<td>' + data[i].documento+'</td>';
            fila += '<td>' + data[i].serie+'</td>';
            fila += '<td>' + data[i].empieza+'</td>';
            fila += '<td>' + data[i].actual+'</td>';
            fila += '<td>' + data[i].estado+'</td>';
            fila += '<td><button iddocumento="' + data[i].iddocumento + '" idcorrelativo="' + data[i].idcorrelativo +'" class="btn btn-sm btn-warning MC_btneditarcorrelativo"><i class="fas fa-edit"></i></button></td>';
            fila += '</tr>';
        }
        MC_tbldocumentossucursal_tbody.innerHTML = fila;
    });
}

$(document).on('click', '.MC_btneditarcorrelativo', function () {
    var idcorrelativo = this.getAttribute('idcorrelativo');
    var iddocumento = this.getAttribute('iddocumento');
    var serie = this.parentElement.parentElement.getElementsByTagName('td')[1].innerHTML;
    var empieza = this.parentElement.parentElement.getElementsByTagName('td')[2].innerHTML;
    var estado = this.parentElement.parentElement.getElementsByTagName('td')[4].innerHTML;
    MC_txtidcorrelativo.value = idcorrelativo;
    MC_cmbdoctributario.value = iddocumento;
    MC_txtserie.value = serie;
    MC_cmbestado.value = estado;
    MC_txtempieza.value = empieza;
});

MC_btnguardardatosimpresora.addEventListener('click', function () {
    if (MC_txtidcajasucursal.value.value === '') {
        mensaje('W', 'No se puede guardar los datos');
        return;
    }
    var obj = new CajaSucursal();
    obj.estado = "HABILITADO";
    obj.serieimpresora = MC_txtserieimpresora.value;
    obj.nombreimpresora = MC_txtnombreimpresora.value;
    obj.ipimpresora = MC_txtipimpresora.value;
    obj.correlativoasociadoaotracaja = MC_checkcorrelativoasociadoaotracaja.checked;
    if (obj.correlativoasociadoaotracaja && MC_cmbidcajacorrelativoasociado.value === '') {
        mensaje('W', 'Seleccione la caja a la cual esta asociado.');
        return;
    }
    obj.idcajacorrelativoasociado = MC_cmbidcajacorrelativoasociado.value;
    obj.idcajasucursal = MC_txtidcajasucursal.value;
    let cajacontroller = new CajaController();
    cajacontroller.ActualizarDatosCaja(obj, function () { });
});

function MC_fnlimpiar() {
    formdocumentocorrelativo.reset();    
    MC_txtidcorrelativo.value = '';
    MC_txtidcajasucursal.value = '';
    MC_cmbdoctributario.value = '';
    MC_txtserie.value = '';
    MC_cmbestado.value = 'HABILITADO';
    MC_txtempieza.value = '';
    MC_checkcorrelativoasociadoaotracaja.checked = false;
    MC_cmbidcajacorrelativoasociado.value = '';
}