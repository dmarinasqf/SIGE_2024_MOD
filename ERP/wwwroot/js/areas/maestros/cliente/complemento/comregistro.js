//inputs
var txtcodigo = document.getElementById('txtcodigo');
var cmbtipodoc = document.getElementById('cmbtipodoc');
var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtnombres = document.getElementById('txtnombres');
var txtapepaterno = document.getElementById('txtapepaterno');
var txtapematerno = document.getElementById('txtapematerno');
var cmbsexo = document.getElementById('cmbsexo');
var txtfechanacimiento = document.getElementById('txtfechanacimiento');
var txtemail = document.getElementById('txtemail');
var txttelefono = document.getElementById('txttelefono');
var txtcelular = document.getElementById('txtcelular');
var txtcelular2 = document.getElementById('txtcelular2');
var cmbdepartamento = document.getElementById('cmbdepartamento');
var cmbprovincia = document.getElementById('cmbprovincia');
var cmbdistrito = document.getElementById('cmbdistrito');
var txtdireccion = document.getElementById('txtdireccion');
var txtreferencia = document.getElementById('txtreferencia');
var chekisempleado = document.getElementById('chekisempleado');
var cmbarea = document.getElementById('cmbarea');
var cmbtipocliente = document.getElementById('cmbtipocliente');
var cmbespecilidad = document.getElementById('cmbespecilidad');

//labels
var lblnombre = document.getElementById('lblnombre');

//contenedores
var divarea = document.getElementById('divarea');
var formregistro = document.getElementById('formregistro');

//buttons
var btnlimpiar = document.getElementById('btnlimpiar');
var btnguardar = document.getElementById('btnguardar');

$(document).ready(function () {
    fnListarDepartamentos();
    fnListarDocumentoPersonal();
    //fnListarGrupos();
});
btnlimpiar.addEventListener('click', function () {
    formregistro.reset();
   
    txtcodigo.value = '';
    //location.href = ORIGEN + '/Maestros/Cliente/RegistrarEditar';
    fnlimpiardatosasociado();
});
cmbtipodoc.addEventListener('click', function () {
    verificarnumdigitosdedocumento();
});

cmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(cmbdepartamento.value,'', 'cmbprovincia', null);
});
cmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(cmbprovincia.value,'', 'cmbdistrito', null);
});

txtnumdocumento.addEventListener('keyup', function (e) {
    var documento = cmbtipodoc.options[cmbtipodoc.selectedIndex].getAttribute('codigosunat');
    var numdigitos =parseInt( cmbtipodoc.options[cmbtipodoc.selectedIndex].getAttribute('longitud'));
    var texto = cmbtipodoc.options[cmbtipodoc.selectedIndex].text;
    if (e.key === 'Enter')
        if (documento == '6' || documento == '1') {
            if (numdigitos != txtnumdocumento.value.length) {
                mensaje('W', 'El ' + texto + ' debe tener ' + numdigitos + ' digitos');
                return;
            }
                let controller = new ApiController();
                controller.BuscarSunatReniec(txtnumdocumento.value, cmbtipodoc.options[cmbtipodoc.selectedIndex].text , fnbuscarruc);
            }
});

txtfileimagen.addEventListener('change', function () {
    let reader = new FileReader();
    var file = txtfileimagen['files'][0];

    reader.readAsDataURL(file);
    reader.onload = function () {
        txtimagen.src = reader.result;
    };
});
formregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    let controller = new ClienteController();
    var form = $('#formregistro').serializeArray();
    var obj = {
        cliente: CONVERT_FORM_TO_JSON(form),

    }
   
    controller.RegistrarEditarCliente2(obj, function (data) {
        txtcodigo.value = data.idcliente;
        fnguardarimagen(data.idcliente);
    });
});
function fnguardarimagen(idcliente) {
    if (txtfileimagen['files'].length > 0) {
        var dataString = new FormData();

        dataString.append("idcliente", idcliente);
        dataString.append('imagen', txtfileimagen['files'][0]);
        let controller = new ClienteController();
        controller.GuardarImagen(dataString, function () {
            mensaje('S', 'Imagen guardada');
        });
    }



}
function fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('cmbdepartamento');
}
function fnListarDocumentoPersonal() {
    let controller = new DocumentoPersonalController();
    controller.Listar('cmbtipodoc', null);
}
function verificarnumdigitosdedocumento() {
    var max = 15;
    var numdigitos = parseInt($('#cmbtipodoc option:selected').attr('longitud'));
    var codsunat = $('#cmbtipodoc option:selected').attr('codigosunat');
    txtapepaterno.required = true;
    txtapematerno.required = true;
    txtapepaterno.disabled = false;
    txtapematerno.disabled = false;
    lblnombre.innerText = 'NOMBRES/RAZON SOCIAL';
    if (codsunat === '1') {
        txtnumdocumento.setAttribute('maxlength', numdigitos);
        txtnumdocumento.setAttribute('pattern', ".{8,}");
        txtnumdocumento.setAttribute('title', "Debe tener 8 digitos");
        txtnumdocumento.setAttribute('minlength', numdigitos);
        txtapepaterno.required = true;
        txtapematerno.required = true;
        max = numdigitos;
        lblnombre.innerText = 'NOMBRES';

    }
    else if (codsunat === '6') {
        txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
        txtnumdocumento.setAttribute('minlength', numdigitos);
        txtnumdocumento.setAttribute('pattern', ".{11,}");
        txtnumdocumento.setAttribute('title', "Debe tener 11 digitos");
        txtapepaterno.required = false;
        txtapematerno.required = false;
        txtapepaterno.disabled = true;
        txtapematerno.disabled = true;
        txtapepaterno.value = '';
        txtapematerno.value = '';
        lblnombre.innerText = 'RAZON SOCIAL';


    } else if (codsunat === '7' || codsunat === '4') {
        txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
        txtnumdocumento.setAttribute('minlength', numdigitos);
        txtnumdocumento.setAttribute('pattern', ".{" + numdigitos + ",}");
        txtnumdocumento.setAttribute('title', "Debe tener " + numdigitos + " digitos");
        txtapepaterno.required = true;
        txtapematerno.required = true;
        lblnombre.innerText = 'NOMBRES';
    } else if (codsunat == '0') {
        txtapepaterno.required = false;
        txtapematerno.required = false;
        txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
    } else {
        txtnumdocumento.setAttribute('maxlength', 15); max = 15; 
    }


    txtnumdocumento.value=((txtnumdocumento.value).substring(0, max));
}

function fnbuscarruc(data) {
    if (cmbtipodoc.options[cmbtipodoc.selectedIndex].text == 'RUC') {
        txtnombres.value = data.razonSocial;
        txtdireccion.value = data.direccion;
        $('#cmbdepartamento option:contains(' + data.departamento + ')').attr('selected', true);
        txtapepaterno.value = '';
        txtapematerno.value ='';
    }
    if (cmbtipodoc.options[cmbtipodoc.selectedIndex].text == 'DNI') {
        txtnombres.value = data.nombres;
        txtapepaterno.value = data.apellidoPaterno;
        txtapematerno.value = data.apellidoMaterno;
        txtdireccion.value = '';
    }
  
   
}
function fnbuscarcliente(idcliente,fn) {
    let controller = new ClienteController();
    controller.BuscarClienteCompleto(idcliente, function (data) {

        txtcodigo.value = data.idcliente;
        cmbtipodoc.value = data.iddocumento;
        txtnumdocumento.value = data.nrodocumento;
        txtnombres.value = data.descripcion;
        txtapepaterno.value = data.apepaterno;
        txtapematerno.value = data.apematerno;
        if(IDEMPRESA > 1999 && IDEMPRESA < 3000)
            cmbtipocliente.value = data.idtipocliente != null ? data.idtipocliente : '';
        //cmbsexo.value = data.sexo;
        txtfechanacimiento.value = moment(data.fechanacimiento).format('YYYY-MM-DD');
        txtemail.value = data.email;
        txttelefono.value = data.telefono;
        txtcelular.value = data.celular;
        //txtcelular2.value = data.celular2;
        //cmbtipocliente.value = data.tipocliente;
        cmbdepartamento.value = (data.iddepartamento === null ? '' : data.iddepartamento);
        let procontroller = new ProvinciaController();
        procontroller.Listar(data.iddepartamento, data.idprovincia, 'cmbprovincia', null);
        let discontroller = new DistritoController();
        discontroller.Listar(data.idprovincia, data.iddistrito, 'cmbdistrito', null);
        txtdireccion.value = data.direccion;
        txtreferencia.value = data.direccionentrega;
        verificarnumdigitosdedocumento();
        if (data.logo != null) {
            txtimagen.src = '/imagenes/clientes/' + data.logo;
        }
        fncargardatosasociado(data.clienteasociado)
    });
}

function cargarTipoCliente() {
    let controller = new TipoClienteController();
    controller.ListarTipoCliente('', function (data) {
        var data = JSON.parse(data);
        var option = document.createElement('option');
        option.value = '';
        option.text = '[SELECCIONE]';
        cmbtipocliente.appendChild(option);
        for (let i = 0; i < data.length; i++) {
            option = document.createElement('option');
            option.value = data[i].idtipocliente;
            option.text = data[i].descripcion;
            cmbtipocliente.appendChild(option);
        }
    });
}