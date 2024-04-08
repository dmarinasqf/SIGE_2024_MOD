//inputs
var MCPtxtcodigo = document.getElementById('MCPtxtcodigo');
var MCPcmbtipodoc = document.getElementById('MCPcmbtipodoc');
var MCPtxtnumdocumento = document.getElementById('MCPtxtnumdocumento');
var MCPtxtnombres = document.getElementById('MCPtxtnombres');
var MCPtxtapepaterno = document.getElementById('MCPtxtapepaterno');
var MCPtxtapematerno = document.getElementById('MCPtxtapematerno');
var MCPcmbsexo = document.getElementById('MCPcmbsexo');
var MCPtxtfechanacimiento = document.getElementById('MCPtxtfechanacimiento');
var MCPtxtemail = document.getElementById('MCPtxtemail');
var MCPtxttelefono = document.getElementById('MCPtxttelefono');
var MCPtxtcelular = document.getElementById('MCPtxtcelular');
var MCPtxtcelular2 = document.getElementById('MCPtxtcelular2');
var MCPcmbdepartamento = document.getElementById('MCPcmbdepartamento');
var MCPcmbprovincia = document.getElementById('MCPcmbprovincia');
var MCPcmbdistrito = document.getElementById('MCPcmbdistrito');
var MCPtxtdireccion = document.getElementById('MCPtxtdireccion');
var MCPtxtreferencia = document.getElementById('MCPtxtreferencia');
var MCPchekisempleado = document.getElementById('MCPchekisempleado');
var MCPcmbarea = document.getElementById('MCPcmbarea');

var MCPcmbtipopaciente = document.getElementById('MCPcmbtipopaciente');
var MCPcheckpacienteccanabis = document.getElementById('MCPcheckpacienteccanabis');
var MCPcheckisempleado = document.getElementById('MCPcheckisempleado');

var MCPidtutor = document.getElementById('MCPidtutor');
var MCPlblnombretutor = document.getElementById('MCPlblnombretutor');
var MCPcmbtutor = document.getElementById('MCPcmbtutor');

//mascota
var MCPtxtnombremascota = document.getElementById('MCPtxtnombremascota');
var MCPcmbtipomascota = document.getElementById('MCPcmbtipomascota');
var MCPcmbpatologia = document.getElementById('MCPcmbpatologia');
var MCPcmbraza = document.getElementById('MCPcmbraza');
var MCPtxtpeso = document.getElementById('MCPtxtpeso');

//labels
var MCPlblnombre = document.getElementById('MCPlblnombre');

//contenedores
var MCPdivarea = document.getElementsByClassName('MCPdivarea')[0];
var MCPdivpersona = document.getElementById('MCPdivpersona');
var MCPdivmascota = document.getElementById('MCPdivmascota');
var MCPformregistro = document.getElementById('MCPformregistro');

//buttons
var MCPbtnlimpiar = document.getElementById('MCPbtnlimpiar');
var MCPbtnguardar = document.getElementById('MCPbtnguardar');

var MCPcmbtipodoc = document.getElementById('MCPcmbtipodoc');

MCPcmbtipodoc.addEventListener('click', function () {
    var tipo = MCPcmbtipodoc.value;
    if (tipo==3) {
        MCPtxtapepaterno.disabled = true;
        MCPtxtapematerno.disabled = true;
    } else {
        MCPtxtapepaterno.disabled = false;
        MCPtxtapematerno.disabled = false;
    }
});

$('#modalpaciente').on('shown.bs.modal', function () {
    if (MCPcmbdepartamento.getElementsByTagName('option').length ==0)
        MCPinit();
 

});
function MCPinit() {
    MCPfnListarDepartamentos();
    MCPfnListarGrupos();
    MCPfnListarDocumentoPersonal();
    let cliente = new ClienteController();
    var fn = cliente.BuscarClientesSelect2();
    $('#MCPcmbtutor').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    let tipomascota = new TipoMascotaController();
    tipomascota.Listar('MCPcmbtipomascota');
    let patologia = new PatologiaController();
    patologia.ListarPatologias('MCPcmbpatologia');
}

function MCPfnListarGrupos() {
    let controller = new ModulosGrupoController();
    controller.ListarGrupos('MCPcmbarea');
}
function MCPfnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('MCPcmbdepartamento');
}
function MCPfnListarDocumentoPersonal() {
    let controller = new DocumentoPersonalController();
    controller.Listar('MCPcmbtipodoc', null);
}

function MCPverificarnumdigitosdedocumento() {
    var max = 15;
    if ($('#MCPcmbtipodoc option:selected').text().toUpperCase() === 'DNI') {
        MCPtxtnumdocumento.setAttribute('maxlength', '8');
        MCPtxtnumdocumento.setAttribute('minlength', '8');
        max = 8;
    }
    else if ($('#MCPcmbtipodoc option:selected').text().toUpperCase() === 'RUC') {
        MCPtxtnumdocumento.setAttribute('maxlength', '11'); max = 11;
        MCPtxtnumdocumento.setAttribute('minlength', '11');
    }
    else { MCPtxtnumdocumento.setAttribute('maxlength', '15'); max = 15; }

    MCPtxtnumdocumento.value = ((MCPtxtnumdocumento.value).substring(0, max));
}
function MCPfnnuevo() {
    MCPidtutor.value = '';
    MCPlblnombretutor.innerText = '';
    MCPtxtnumdocumento.value = '';
    MCPdivarea.classList.add('ocultar');
    MCPcmbtipopaciente.value = 'PERSONA';
    MCPfnaccionestipopaciente();
}
function MCPfnaccionestipopaciente() {
    if (MCPcmbtipopaciente.value == 'PERSONA') {
        MCPdivpersona.classList.remove('ocultar');
        MCPdivmascota.classList.add('ocultar');
        MCPcmbtipodoc.required = true;
        MCPtxtnumdocumento.required = true;
        MCPtxtnombres.required = true;
        MCPtxtapepaterno.required = true;
        MCPtxtapematerno.required = true;
    } else {
        MCPdivpersona.classList.add('ocultar');
        MCPdivmascota.classList.remove('ocultar');
        MCPcmbtipodoc.required = false;
        MCPtxtnumdocumento.required = false;
        MCPtxtnombres.required = false;
        MCPtxtapepaterno.required = false;
        MCPtxtapematerno.required = false;
    }
}
MCPbtnlimpiar.addEventListener('click', function () {
    MCPformregistro.reset();
    MCPdivarea.classList.add('ocultar');
    MCPtxtcodigo.value = '';
    MCPfnnuevo();
});
MCPcmbtipodoc.addEventListener('click', function () {
    MCPverificarnumdigitosdedocumento();
});
MCPcmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(MCPcmbdepartamento.value,'', 'MCPcmbprovincia', null);
});
MCPcmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(MCPcmbprovincia.value,'', 'MCPcmbdistrito', null);
});
MCPcmbtipopaciente.addEventListener('change', function () {
    MCPfnaccionestipopaciente();
});
$('#MCPcmbtutor').on('select2:select', function (e) {
    var id = MCPcmbtutor.value;
   MCPidtutor.value = id;
    MCPlblnombretutor.innerText = $('#MCPcmbtutor').text();
});


MCPcheckisempleado.addEventListener('click', function () {

    if (this.checked)
        MCPdivarea.classList.remove('ocultar');
    else
        MCPdivarea.classList.add('ocultar');

});
MCPcmbtipomascota.addEventListener('change', function () {
    let controller1 = new RazaController();
    controller1.ListarRazaByTipoMascota('MCPcmbraza', MCPcmbtipomascota.value);
});
function MCPfnregistrar(fn) {
        let controller = new PacienteController();
        var obj = {};
        if (MCPcmbtipopaciente.value == 'PERSONA')
            obj = $('#MCPformregistro').serializeArray();
        else if (MCPcmbtipopaciente.value == 'MASCOTA') {
            obj = {
                idtutor: MCPidtutor.value,
                idtipomascota: MCPcmbtipomascota.value,
                idpatologiamascota: MCPcmbpatologia.value,
                idraza: MCPcmbraza.value,
                nombres: MCPtxtnombremascota.value,
                peso: MCPtxtpeso.value,
                tipopaciente: MCPcmbtipopaciente.value,
                idpaciente: MCPtxtcodigo.value
            };
        }
        controller.RegistrarEditar(obj, function (data) {
            MCPfnnuevo();
            fn(data);
        });
}
MCPtxtnumdocumento.addEventListener('keyup', function (e) {
    limpiarCajas();
    var documento = MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].getAttribute('codigosunat');
    var numdigitos = parseInt(MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].getAttribute('longitud'));
    var texto = MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].text;
    if (e.key === 'Enter')
        if (documento == '6' || documento == '1') {
            if (numdigitos != MCPtxtnumdocumento.value.length) {
                mensaje('W', 'El ' + texto + ' debe tener ' + numdigitos + ' digitos');
                return;
            }
            let controller = new ApiController();
            console.log("EART1002");
            controller.BuscarCliente(MCPtxtnumdocumento.value, MCP_fnbuscarCliente);
        }
    
});

function limpiarCajas() {
    MCPtxtfechanacimiento.value = "";
    MCPtxtemail.value = "";
    MCPtxttelefono.value = "";
    MCPtxtcelular.value = "";
    MCPtxtdireccion.value = "";
    MCPtxtreferencia.value = "";
}

function MCP_fnbuscarCliente(data) {
    if (data != null) {
        MCPtxtfechanacimiento.value = moment(data.fechanacimiento).format('YYYY-MM-DD');
        MCPtxtnombres.value = data.descripcion;
        MCPtxtapepaterno.value = data.apepaterno;
        MCPtxtapematerno.value = data.apematerno;
        MCPtxtemail.value = data.email;
        MCPtxttelefono.value = data.telefono;
        MCPtxtcelular.value = data.celular;
        MCPtxtdireccion.value = data.direccion;
        console.log("esta es la direccion");
        console.log(data.direccion);
        MCPtxtreferencia.value = data.direccionentrega;
        $("#MCPcmbdepartamento").val(data.iddepartamento);
        $('#MCPcmbdepartamento').change();
        //let controller = new ProvinciaController();
        //controller.Listar(data.iddepartamento, '', 'MCPcmbprovincia', null);

        let controller1 = new ProvinciaController();
        controller1.Listar(data.iddepartamento, data.idprovincia, 'MCPcmbprovincia', null);

        let controller2 = new DistritoController();
        controller2.Listar(data.idprovincia, data.iddistrito, 'MCPcmbdistrito', null);

        //if ($('#MCPcmbprovincia option').length > 0) {
        //    console.log("el combo esta lleno");
        //} else {
        //    console.log("el combo esta vacio");
        //}
        //console.log("HASTA AQUI EL CODIGO ESTA OK");

        //console.log(data.idprovincia);
        $('#MCPcmbprovincia').val(data.idprovincia);
        $('#MCPcmbprovincia').change();
        $("#MCPcmbdistrito").val(data.iddistrito);
        $('#MCPcmbdistrito').change();
    } else {
        let controller = new ApiController();
        controller.BuscarSunatReniec(MCPtxtnumdocumento.value, MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].text, MCP_fnbuscarruc);
    }
}

function MCP_fnbuscarruc(data) {
    if (MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].text == 'RUC') {
        MCPtxtnombres.value = data.result.RazonSocial;
        MCPtxtdireccion.value = data.result.DomicilioFiscal;
        $('#MCPcmbdepartamento option:contains(' + data.result.Departamento + ')').attr('selected', true);
        MCPtxtapepaterno.value = '';
        MCPtxtapematerno.value = '';
    }
    if (MCPcmbtipodoc.options[MCPcmbtipodoc.selectedIndex].text == 'DNI') {
        MCPtxtnombres.value = data.result.nombres;
        MCPtxtapepaterno.value = data.result.apepaterno;
        MCPtxtapematerno.value = data.result.apematerno;
        //MCPtxtdireccion.value = '';
    }
}
