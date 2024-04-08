var formdatosdelivery = document.getElementById('formdatosdelivery');
var CDDEcmbenviara = document.getElementById('CDDEcmbenviara');
var CDDEcmbprovincia = document.getElementById('CDDEcmbprovincia');
var CDDEcmbdepartamento = document.getElementById('CDDEcmbdepartamento');
var CDDEcmbdistrito = document.getElementById('CDDEcmbdistrito');
var CDDEcheckagencia = document.getElementById('CDDEcheckagencia');
var CDDEtxtfechaentrega = document.getElementById('CDDEtxtfechaentrega');
var CDDEcmbhoraentrega = document.getElementById('CDDEcmbhoraentrega');
var CDDEtxtdireccion = document.getElementById('CDDEtxtdireccion');


var CDDEcmbagencia = document.getElementById('CDDEcmbagencia');
var CDDEtxtdocenvioagencia = document.getElementById('CDDEtxtdocenvioagencia');
var CDDEtxtpersonarecoge = document.getElementById('CDDEtxtpersonarecoge');


var CDDEcmbtipoentrega = document.getElementById('CDDEcmbtipoentrega');
var CDDEcmbrecogeren = document.getElementById('CDDEcmbrecogeren');

var formdelivery = document.formdatosdelivery;
var CDDEbtnconservarcambios = document.getElementById('CDDEbtnconservarcambios');

$(document).ready(function () {
   

});
function CDDEfniniciardatosdelivery() {
    
    if (CDDEcmbdepartamento.getElementsByTagName('option').length != 0)
        return;
    let depcontroller = new DepartamentoController();
    depcontroller.Listar('CDDEcmbdepartamento', null);
    let tipoentregacontroller = new TipoEntregaController();
    tipoentregacontroller.Listar('CDDEcmbtipoentrega', null);
    let sucucontroller = new SucursalController();
    sucucontroller.ListarSucursalDelivery('CDDEcmbrecogeren');
    let agenciacontroller = new AgenciaEncomiendaController();
    agenciacontroller.ListarAgencias('CDDEcmbagencia');
}
CDDEcmbtipoentrega.addEventListener('change', function () {
    var texto = CDDEcmbtipoentrega.options[CDDEcmbtipoentrega.selectedIndex].text;
    if (texto == 'DELIVERY') {
        CDDEcambiarestadoinput(false);
        CDDEcmbrecogeren.disabled = false;
        CDDEcmbrecogeren.required = true;
        formdelivery.enviara.required = true;
        formdelivery.iddepartamento.required = true;
        formdelivery.idprovincia.required = true;
        formdelivery.iddistrito.required = true;


        if (formdelivery.isencomienda.checked) {
            formdelivery.idagencia.required = true;
            formdelivery.docenvioagencia.required = true;
            formdelivery.personarecoge.required = true;

        }

    } else {
        CDDEcmbrecogeren.disabled = true;
        CDDEcmbrecogeren.value = '';
    }
    if (texto == 'SUCURSAL' || texto == 'CONSULTORIO') {
        formdelivery.enviara.value = '';
        formdelivery.iddepartamento.value = '';
        formdelivery.idprovincia.value = '';
        formdelivery.iddistrito.value = '';
        formdelivery.numero.value = '';
        formdelivery.referencia1.value = '';
        formdelivery.referencia2.value = '';
        formdelivery.isencomienda.checked = false;
        formdelivery.idagencia.value = '';
        formdelivery.docenvioagencia.value = '';
        formdelivery.docenvioagencia.value = '';
        formdelivery.personarecoge.value = '';
        formdelivery.claveagrencia.value = '';
        formdelivery.direcciondeenvio.required = false;

        CDDEcambiarestadoinput(true);
    }
});
CDDEcmbenviara.addEventListener('change', function () {
    if (CDDEcmbenviara.value == 'CLIENTE') {
        var cliente = new ClienteController();
        if (txtidcliente.value == '') {
            CDDEcmbenviara.value = '';
            mensaje('I', 'Seleccione un cliente');
            return;
        }
        cliente.BuscarClientebyId(txtidcliente.value, (data) => {           
            formdatosdelivery.iddepartamento.value = data.iddepartamento;
            formdatosdelivery.direcciondeenvio.value = data.direccionentrega;
            formdatosdelivery.numero.value = data.numero;
            let procontroller = new ProvinciaController();
            procontroller.Listar(data.iddepartamento, data.idprovincia ?? '', 'CDDEcmbprovincia', null);
            let discontroller = new DistritoController();
            discontroller.Listar(data.idprovincia, data.iddistrito ?? '', 'CDDEcmbdistrito', null);
        });
    } else if (CDDEcmbenviara.value == 'PACIENTE') {
        if (txtidpaciente.value == '') {
            CDDEcmbenviara.value = '';
            mensaje('I', 'Seleccione un paciente');
            return;
        }
        let paciente = new PacienteController();
        paciente.BuscarPacientById(txtidpaciente.value, (data) => {           
            formdatosdelivery.iddepartamento.value = data.iddepartamento;
            formdatosdelivery.direcciondeenvio.value = data.direccion ?? '';
            formdatosdelivery.referencia1.value = data.referencia ?? '';
            formdatosdelivery.numero.value = data.numero;
            let procontroller = new ProvinciaController();
            procontroller.Listar(data.iddepartamento, data.idprovincia ?? '', 'CDDEcmbprovincia', null);
            let discontroller = new DistritoController();
            discontroller.Listar(data.idprovincia, data.iddistrito ?? '', 'CDDEcmbdistrito', null);
        });

    }
});
CDDEcmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(CDDEcmbdepartamento.value, '', 'CDDEcmbprovincia', null);
});
CDDEcmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(CDDEcmbprovincia.value, '', 'CDDEcmbdistrito', null);
});
CDDEcheckagencia.addEventListener('click', function () {
    

    formdelivery.idagencia.disabled = !this.checked;
    formdelivery.docenvioagencia.disabled = !this.checked;
    formdelivery.docenvioagencia.disabled = !this.checked;
    formdelivery.personarecoge.disabled = !this.checked;
    formdelivery.claveagrencia.disabled = !this.checked;

    formdelivery.idagencia.required = this.checked;
    formdelivery.docenvioagencia.required = this.checked;

})
formdelivery.addEventListener('submit', function (e) {
    e.preventDefault();
    $('#modaldatosdelivery').modal('hide');
});
function CDDEcambiarestadoinput(estado) {
    formdelivery.enviara.disabled = estado;
    formdelivery.iddepartamento.disabled = estado;
    formdelivery.idprovincia.disabled = estado;
    formdelivery.iddistrito.disabled = estado;
    formdelivery.numero.disabled = estado;
    formdelivery.referencia1.disabled = estado;
    formdelivery.referencia2.disabled = estado;
    //if (CDDEcheckagencia.checked) {
    //    formdelivery.isencomienda.disabled = !this.checked;
    //    formdelivery.idagencia.disabled = !this.checked;
    //    formdelivery.docenvioagencia.disabled = !this.checked;
    //    formdelivery.docenvioagencia.disabled = !this.checked;
    //    formdelivery.personarecoge.disabled = !this.checked;
    //    formdelivery.claveagrencia.disabled = !this.checked;
    //}
    

}
function CDDEfnverificardatosdeliveryguardar() {
    var texto = CDDEcmbtipoentrega.options[CDDEcmbtipoentrega.selectedIndex].text;
    if (CDDEtxtfechaentrega.value == '') {
        mensaje('I', 'Seleccione fecha de entrega');
        return 'x';
    }
    if (CDDEcmbhoraentrega.value == '') {
        mensaje('I', 'Seleccione hora de entrega');
        return 'x';
    }
    if (texto == '') {
        mensaje('I', 'Seleccione el tipo de entrega');
        return 'x';
    }
    else if (texto == 'DELIVERY') {
        if (CDDEcmbrecogeren.value == '') {
            mensaje('I', 'Seleccione el lugar de donde sera recogido por el delivery');
            return 'x';
        }
        if (CDDEcmbdepartamento.value == '') {
            mensaje('I', 'Seleccione departamento');
            return 'x';
        }
        if (CDDEtxtdireccion.value == '') {
            mensaje('I', 'Ingresar dirección.');
            return 'x';
        }
        if (CDDEcheckagencia.checked) {
            if (CDDEcmbagencia.value == '') {
                mensaje('I', 'Seleccione agencia');
                return 'x';
            }
            if (CDDEcmbagencia.value == '') {
                mensaje('I', 'Seleccione agencia');
                return 'x';
            }
        }

    } else {
        
    }
    return 'ok';
}
function CDDEfnlimpiar() {
    formdelivery.reset();
    formdatosdelivery.iddepartamento.value = '';
    formdatosdelivery.direcciondeenvio.value =  '';
    formdatosdelivery.referencia1.value = '';
    formdatosdelivery.numero.value = '';
    formdelivery.idagencia.value = '';
    formdelivery.docenvioagencia.value = '';
    formdelivery.docenvioagencia.value = '';
    formdelivery.personarecoge.value = '';
    formdelivery.claveagrencia.value = '';
    formdelivery.idagencia.value = '';
    formdelivery.docenvioagencia.value = '';
    formdelivery.fechaentrega.value = '';
}

function CDDEfnbuscardatosdelivery(idpedido) {
    let controller = new DeliveryController();
    controller.BuscarDatosDelivery(idpedido, (data) => {     
        formdelivery.idtipoentrega.value = data.idtipoentrega;
        formdelivery.idsucursalentrega.value = data.idsucursalentrega;
        formdelivery.fechaentrega.value =moment(data.fechaentrega).format('YYYY-MM-DD');
        formdelivery.horaentrega.value = data.horaentrega;
        formdelivery.enviara.value = data.enviara;
        formdelivery.iddepartamento.value = data.iddepartamento;
        let procontroller = new ProvinciaController();
        procontroller.Listar(data.iddepartamento, data.idprovincia, 'CDDEcmbprovincia', null);
        let discontroller = new DistritoController();
        discontroller.Listar(data.idprovincia, data.iddistrito, 'CDDEcmbdistrito', null);
        formdatosdelivery.direcciondeenvio.value = data.direcciondeenvio;
        formdatosdelivery.numero.value = data.numero;
        formdatosdelivery.referencia1.value = data.referencia1;
        formdatosdelivery.referencia2.value = data.referencia2;
        formdatosdelivery.isencomienda.checked = data.isencomienda;
        formdatosdelivery.isencomienda.value = data.isencomienda;
        formdatosdelivery.idagencia.value = data.idagencia;
        formdatosdelivery.docenvioagencia.value = data.docenvioagencia;
        formdatosdelivery.personarecoge.value = data.personarecoge;
        formdatosdelivery.claveagrencia.value = data.claveagrencia;
    });
}