var txtidcliente = document.getElementById('txtidcliente');
var cmbbuscarcliente = document.getElementById('cmbbuscarcliente');
var txtruc = document.getElementById('txtruc');
var txtnombres = document.getElementById('txtnombres');
var txtdireccion = document.getElementById('txtdireccion');
var cmbmoneda = document.getElementById('cmbmoneda');
var cmbcondicionpago = document.getElementById('cmbcondicionpago');
var checkbloquearcredito = document.getElementById('checkbloquearcredito');
var txtobservacion = document.getElementById('txtobservacion');
var txtmontocredito = document.getElementById('txtmontocredito');
var txtmontodisponible = document.getElementById('txtmontodisponible');
var btnnuevo = document.getElementById('btnnuevo');
var formregistro = document.getElementById('formregistro');
var tbodycreditos = document.getElementById('tbodycreditos');
var lblclienteprincipal = document.getElementById('lblclienteprincipal');


var creditosasignadostab=document.getElementById('creditosasignados-tab');

$(document).ready(function () {
    let controller = new ClienteController();
    var fn = controller.BuscarClientesSelect2();
    $('#cmbbuscarcliente').select2({
        allowClear: true,      
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento o razón social",
    })
});
btnnuevo.addEventListener('click', function () {
    location.reload();
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();

    if (txtidcliente.value == '') {
        mensaje('I', 'Seleccione un cliente');
        return;
    }
    var mensaje1 = '';
    if (parseFloat(txtmontocredito.value) > 0)
        mensaje1 = '¡¡¡ SE REGISTRARÁ UN NUEVO CRÉDITO AL CLIENTE !!!';
   
    var obj = $('#formregistro').serializeArray();
    swal({
        title: '¿Desea guardar cambios?',
        text: mensaje1,
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            let controller = new LineaCreditoController();
            controller.RegistrarEditarCredito(obj, function () {
                mensaje('S', 'Datos guardados');
                fnnuevo();
                fnbuscar(txtidcliente.value);
            });

        }
        else
            swal.close();
    });
   
});
$('#cmbbuscarcliente').on('select2:select', function (e) {
    var id = cmbbuscarcliente.value;
    fnnuevo();
    fnbuscar(id);
    
});
creditosasignadostab.addEventListener('click', function (e) { 
    if (txtidcliente.value != '') {
        fnbuscarhistorial(txtidcliente.value);
    } else {
        tbodycreditos.innerHTML = '';
    }
});
function fnbuscar(id) {
    let controller = new LineaCreditoController();
    controller.BuscarLineaCredito(id, function (data) {      
        txtruc.value = data.cliente.nrodocumento;
        txtidcliente.value = data.cliente.idcliente;
        txtdireccion.value = data.cliente.direccion;
        txtnombres.value = data.cliente.descripcion + ' ' + (data.cliente.apepaterno ?? '') + ' ' + (data.cliente.apematerno ?? '');
        lblclienteprincipal.innerText = txtnombres.value;
        if (data.linea != null) {
            cmbmoneda.value = data.linea.idmoneda;
            cmbcondicionpago.value = data.linea.idcondicionpago;
            txtobservacion.value = data.linea.observacion;
            txtmontodisponible.value = data.linea.montoactual;
            checkbloquearcredito.value = data.linea.isbloqueado;
            checkbloquearcredito.checked = data.linea.isbloqueado;
        }
    });

   
}
function fnnuevo() {
    formregistro.reset();
    txtruc.value = '';
    txtnombres.value = '';
    txtdireccion.value = '';
    cmbmoneda.value = '';
    cmbcondicionpago.value = '';
    txtobservacion.value = '';
    txtmontocredito.value = '';
    txtmontodisponible.value = '';
    lblclienteprincipal.innerText = '';
}
function fnbuscarhistorial(id) {
    console.log(id);
    let controller = new LineaCreditoController();
    controller.HistorialCreditoCliente(id, function (data) {
        var fila = '';
        if (data != null)
            for (var i = 0; i < data.length; i++) {
                fila += '<tr>';
                fila += '<td>'+moment( data[i].fecha).format('DD/MM/YYY hh:mm')+'</td>';
                fila += '<td>' + data[i].montoingresado.toFixed(2)+'</td>';
                fila += '<td>' + data[i].montoactual.toFixed(2)+'</td>';
                fila += '<td>' + data[i].usuario+'</td>';
                fila+='</tr>';
            }
        tbodycreditos.innerHTML = fila;
    });
}