//inputs
var MCC_txtcodigo = document.getElementById('MCC_txtcodigo');
var MCC_cmbtipodoc = document.getElementById('MCC_cmbtipodoc');
var MCC_txtnumdocumento = document.getElementById('MCC_txtnumdocumento');
var MCC_txtnombres = document.getElementById('MCC_txtnombres');
var MCC_txtapepaterno = document.getElementById('MCC_txtapepaterno');
var MCC_txtapematerno = document.getElementById('MCC_txtapematerno');
var MCC_cmbsexo = document.getElementById('MCC_cmbsexo');
var MCC_txtfechanacimiento = document.getElementById('MCC_txtfechanacimiento');
var MCC_txtemail = document.getElementById('MCC_txtemail');
var MCC_txttelefono = document.getElementById('MCC_txttelefono');
var MCC_txtcelular = document.getElementById('MCC_txtcelular');
var MCC_txtcelular2 = document.getElementById('MCC_txtcelular2');
var MCC_cmbdepartamento = document.getElementById('MCC_cmbdepartamento');
var MCC_cmbprovincia = document.getElementById('MCC_cmbprovincia');
var MCC_cmbdistrito = document.getElementById('MCC_cmbdistrito');
var MCC_txtdireccion = document.getElementById('MCC_txtdireccion');
var MCC_txtreferencia = document.getElementById('MCC_txtreferencia');
var MCC_chekisempleado = document.getElementById('MCC_chekisempleado');
var MCC_cmbarea = document.getElementById('MCC_cmbarea');
var MCC_cmbtipocliente = document.getElementById('MCC_cmbtipocliente');
let timerp = "";
let timerd = "";
var MCPcmbtipodoc = document.getElementById('MCPcmbtipodoc');

//labels
var MCC_lblnombre = document.getElementById('MCC_lblnombre');

//contenedores
var MCC_divarea = document.getElementById('MCC_divarea');
var MCC_formregistro = document.getElementById('MCC_formregistro');

//buttons
var MCC_btnlimpiar = document.getElementById('MCC_btnlimpiar');
var MCC_btnguardar = document.getElementById('MCC_btnguardar');

$(document).ready(function () {
    MCC_fnListarDepartamentos();
    MCC_fnListarDocumentoPersonal();
    if (IDEMPRESA > 1999 && IDEMPRESA < 3000) {
        MCC_cargarTipoCliente();
    }
    //MCC_fnListarGrupos();
});
MCC_btnlimpiar.addEventListener('click', function () {
    MCC_formregistro.reset();
    MCC_divarea.classList.add('ocultar');
    MCC_txtcodigo.value = '';
});
MCC_cmbtipodoc.addEventListener('click', function () {
    MCC_verificarnumdigitosdedocumento();
});

MCC_cmbdepartamento.addEventListener('change', function () {
    let controller = new ProvinciaController();
    controller.Listar(MCC_cmbdepartamento.value,'', 'MCC_cmbprovincia', null);
});
MCC_cmbprovincia.addEventListener('change', function () {
    let controller = new DistritoController();
    controller.Listar(MCC_cmbprovincia.value,'', 'MCC_cmbdistrito', null);
});



MCC_txtnumdocumento.addEventListener('keyup', function (e) {
    var documento = MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].getAttribute('codigosunat');
    var numdigitos =parseInt( MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].getAttribute('longitud'));
    var texto = MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].text;
    if (e.key === 'Enter')
        if (documento == '6' || documento == '1') {
            if (numdigitos != MCC_txtnumdocumento.value.length) {
                mensaje('W', 'El ' + texto + ' debe tener ' + numdigitos + ' digitos');
                return;
            }
                let controller = new ApiController();
                controller.BuscarSunatReniec(MCC_txtnumdocumento.value, MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].text , MCC_fnbuscarruc);
            }
});

//function MCC_fnListarGrupos() {
//    let controller = new ModulosGrupoController();
//    controller.ListarGrupos('MCC_cmbarea');
//}
function MCC_fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('MCC_cmbdepartamento');
}
function MCC_fnListarDocumentoPersonal() {
    let controller = new DocumentoPersonalController();
    controller.Listar('MCC_cmbtipodoc', null);
}
function MCC_verificarnumdigitosdedocumento() {
    var max = 15;
    var numdigitos = parseInt($('#MCC_cmbtipodoc option:selected').attr('longitud'));
    var codsunat = $('#MCC_cmbtipodoc option:selected').attr('codigosunat');
    MCC_txtapepaterno.required = true;
    MCC_txtapematerno.required = true;
    MCC_txtapepaterno.readOnly = false;
    MCC_txtapematerno.readOnly = false;
    MCC_txtnombres.readOnly = false;
    MCC_lblnombre.innerText = 'NOMBRES/RAZON SOCIAL';
    if (codsunat === '1') {
        MCC_txtnumdocumento.setAttribute('maxlength', numdigitos);
        MCC_txtnumdocumento.setAttribute('pattern', ".{8,}");
        MCC_txtnumdocumento.setAttribute('title', "Debe tener 8 digitos");
        MCC_txtnumdocumento.setAttribute('minlength', numdigitos);
        MCC_txtapepaterno.required = true;
        MCC_txtapematerno.required = true;
        max = numdigitos;
        MCC_lblnombre.innerText = 'NOMBRES';

    }
    else if (codsunat === '6') {
        MCC_txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
        MCC_txtnumdocumento.setAttribute('minlength', numdigitos);
        MCC_txtnumdocumento.setAttribute('pattern', ".{11,}");
        MCC_txtnumdocumento.setAttribute('title', "Debe tener 11 digitos");
        MCC_txtapepaterno.required = false;
        MCC_txtapematerno.required = false;
        MCC_txtapepaterno.readOnly = true;
        MCC_txtapematerno.readOnly = true;
        MCC_txtnombres.readOnly = true;
        MCC_txtapepaterno.value = '';
        MCC_txtapematerno.value = '';
        MCC_lblnombre.innerText = 'RAZON SOCIAL';


    } else if (codsunat === '7' || codsunat === '4') {
        MCC_txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
        MCC_txtnumdocumento.setAttribute('minlength', numdigitos);
        MCC_txtnumdocumento.setAttribute('pattern', ".{" + numdigitos + ",}");
        MCC_txtnumdocumento.setAttribute('title', "Debe tener " + numdigitos + " digitos");
        MCC_txtapepaterno.required = true;
        MCC_txtapematerno.required = true;
        MCC_lblnombre.innerText = 'NOMBRES';
    } else if (codsunat == '0') {
        MCC_txtapepaterno.required = false;
        MCC_txtapematerno.required = false;
        MCC_txtnumdocumento.setAttribute('maxlength', numdigitos); max = numdigitos;
    } else {
        MCC_txtnumdocumento.setAttribute('maxlength', 15); max = 15; 
    }


    MCC_txtnumdocumento.value=((MCC_txtnumdocumento.value).substring(0, max));
}

function select_provincia(provincia, distrito) {
    $('#MCC_cmbprovincia option:contains(' + provincia + ')').attr('selected', true);    
    sp(distrito);
    clearTimeout(timerp);
}
function select_distrito(distrito) {
    let controllerd = new DistritoController();
    controllerd.Listar(MCC_cmbprovincia.value, '', 'MCC_cmbdistrito', null);
    timerd = setInterval(() => sd(distrito), 500);
    //clearInterval(timerd);
    //timerd= setTimeout(sd(distrito), 1000)
}
function sp( distrito) {
    select_distrito(distrito)
}
function sd(distrito) {
    $('#MCC_cmbdistrito option:contains(' + distrito + ')').attr('selected', true);
    clearTimeout(timerd);
    //clearTimeout(timerp);
}
//setTimeout

function MCC_fnbuscarruc(data) {
    var data2 = (data.result);
    if (MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].text == 'RUC') {
        if ((data2.RazonSocial) === 'undefined' || (data2.DomicilioFiscal) === 'undefined' ) {
            mensaje('W', 'No se pudo encontrar registros del cliente con RUC ' + MCC_txtnumdocumento.value);
            return;
        }
        MCC_txtnombres.value = data2.RazonSocial;
        MCC_txtdireccion.value = data2.DomicilioFiscal;
        //MCC_txtnombres.value = data.razon_social;
        //MCC_txtdireccion.value = data.domicilio_fiscal;
        $('#MCC_cmbdepartamento option:contains('+ data2.Departamento +')').attr('selected', true);
        let controllerp = new ProvinciaController();
        controllerp.Listar(MCC_cmbdepartamento.value, '', 'MCC_cmbprovincia', null);
        timerp=setInterval(()=>select_provincia(data2.Provincia, data2.Distrito),100);
        //timerp= setTimeout(select_provincia(data.provincia, data.distrito), 1000)
        
        MCC_txtapepaterno.value = '';
        MCC_txtapematerno.value ='';
    }
    if (MCC_cmbtipodoc.options[MCC_cmbtipodoc.selectedIndex].text == 'DNI') {
        //MCC_txtnombres.value = data.name;
        //MCC_txtapepaterno.value = data.first_name;
        //MCC_txtapematerno.value = data.last_name;
        if (typeof (data2.nombres) === 'undefined' || typeof (data2.apepaterno) === 'undefined' || typeof (data2.apematerno) === 'undefined') {
            mensaje('W', 'No se pudo encontrar registros del cliente con DNI ' + MCC_txtnumdocumento.value);
            return;
        }
        MCC_txtnombres.value = data2.nombres;
        MCC_txtapepaterno.value = data2.apepaterno;
        MCC_txtapematerno.value = data2.apematerno;
        MCC_txtdireccion.value = '';
    }
  
   
}
function MCC_fnregistrar(fn) {
    let controller = new ClienteController();
    var obj = $('#MCC_formregistro').serializeArray();
    //SE AGREGO LFRW20
    var res = 0;
    for (const prop in obj) {
        //console.log(`obj.${prop} = ${obj[prop].name}`);
        if (`${obj[prop].name}` == 'descripcion') {
            res = 1;
        }
    }
    if (res == 0) {
        var descripcion = MCC_txtnombres.value;
        obj[obj.length] = { name: 'descripcion', value: descripcion };
    }
    // 
    controller.RegistrarEditar(obj, function (data) {
        fn(data);
      
    });
}
function MCC_fnbuscarcliente(idcliente,fn) {
    let controller = new ClienteController();
    controller.BuscarClientebyId(idcliente, function (data) {
        MCC_txtcodigo.value = data.idcliente;
        MCC_cmbtipodoc.value = data.iddocumento;
        MCC_txtnumdocumento.value = data.nrodocumento;
        MCC_txtnombres.value = data.descripcion;
        MCC_txtapepaterno.value = data.apepaterno;
        MCC_txtapematerno.value = data.apematerno;

        //MCC_cmbsexo.value = data.sexo;
        MCC_txtfechanacimiento.value = moment(data.fechanacimiento).format('YYYY-MM-DD');
        MCC_txtemail.value = data.email;
        MCC_txttelefono.value = data.telefono;
        MCC_txtcelular.value = data.celular;
        //MCC_txtcelular2.value = data.celular2;
        if (IDEMPRESA > 1999 && IDEMPRESA < 3000) {
            MCC_cmbtipocliente.value = data.idtipocliente;
        }
        MCC_cmbdepartamento.value = (data.iddepartamento === null ? '' : data.iddepartamento);
        let procontroller = new ProvinciaController();
        procontroller.Listar(data.iddepartamento, data.idprovincia, 'MCC_cmbprovincia', null);
        let discontroller = new DistritoController();
        discontroller.Listar(data.idprovincia, data.iddistrito, 'MCC_cmbdistrito', null);
        MCC_txtdireccion.value = data.direccion;
        MCC_txtreferencia.value = data.direccionentrega;
        MCC_verificarnumdigitosdedocumento();
        if (fn != null)
            fn(data);
    });
}

function MCC_cargarTipoCliente() {
    //MCC_cmbtipocliente = document.getElementById('MCC_cmbtipocliente');
    let controller = new TipoClienteController();
    controller.ListarTipoCliente('', function (data) {
        var data = JSON.parse(data);
        var option = document.createElement('option');
        option.value = '';
        option.text = '[SELECCIONE]';
        MCC_cmbtipocliente.appendChild(option);
        for (let i = 0; i < data.length; i++) {
            option = document.createElement('option');
            option.value = data[i].idtipocliente;
            option.text = data[i].descripcion;
            MCC_cmbtipocliente.appendChild(option);
        }
    });
}