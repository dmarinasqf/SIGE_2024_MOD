//inputs
var tablaMedico;
var tblbanco = document.getElementById('tblbanco');
var tblbody = document.getElementById('tblbody');

var txtcuenta = document.getElementById('txtcuenta');
var txtcci = document.getElementById('txtcci');

var txtcostoprovincia = $('#txtcostoprovincia');
var txtcostolima = $('#txtcostolimametropolitana');
var checkAsociado = $('#chekAsociado');
var txtfechanacimiento = $('#txtfechanacimiento');

var txtusuario = $('#txtusuario');
var txtclave = $('#txtclave');

var txtnombres = $('#txtnombres');
var txtcodigo = $('#txtcodigo');
var txtcod = $('#txtcod');
var txtapepaterno = $('#txtapepaterno');
var txtapematerno = $('#txtapematerno');
var cboespecialidad = $('#cboespecialidad');
var cbocolegio = $('#cbocolegio');
var txtfrecuencia = $('#txtfrecuencia');
var txtcategoria = $('#txtcategoria');
var cmblineaatencion = $('#cmblineaatencion');

var txtemail = $('#txtemail');
var txttelefono = $('#txttelefono');
var txtncolegiatura = $('#txtNroColegiaturo');
var txtdireccion = $('#txtdireccion');
var operacion = $('#TIPOOPERACION');
var btnGuardar = $('#btnGuardar');
var btnGrabar = $('#btnGrabar');

var txtcostoteleconsulta = $('#txtcostoteleconsulta');
var txtcostoconsultapresencial = $('#txtcostoconsultapresencial');

var txtusuariozoom = $('#txtusuariozoom');
var txtclavezoom = $('#txtclavezoom');
var txtzoomapikey = $('#txtzoomapikey');
var txtzoomapisecret = $('#txtzoomapisecret');

var checkcomisionfm = $('#checkcomisionfm');
var checkcomisionpt = $('#checkcomisionpt');
var checkconvenio = $('#checkconvenio');
var checktercero = $('#checktercero');
var checkms = $('#checkms');
var checkteleconsulta = $('#checkteleconsulta');
var checkconsultapresencial = $('#checkconsultapresencial');
var txtcomisionfm1 = $('#txtcomisionfm1');
var txtcomisionfm2 = $('#txtcomisionfm2');
var txtcomisionpt1 = $('#txtcomisionpt1');
var txtcomisionprocedimiento = $('#txtcomisionprocedimiento');

var checkconocannabis = document.getElementById('checkconocannabis');
var checkconocefm = document.getElementById('checkconocefm');
var cmbrangocuantitativo = document.getElementById('cmbrangocuantitativo');

var cmbdepartamento = $('#cmbdepartamento');
var cmbprovincia = $('#cmbprovincia');
var cmbdistrito = $('#cmbdistrito');
var cmbestado = $('#cmbestado');
var txtdireccionconsultorio = $('#txtdireccionconsultorio');
var txtespecializado = $('#txtespecializado');
var txtobservacion = $('#txtobservaciones');

var _IMAGEN;
var txtimagenfotomedico = $('#txtfotomedico');
var txtimagenfirma = $('#txtfirma');
var imgMedico = $('#txtimagenfotomedico');
var imgFirma = $('#txtimagenfirma');


var txtidorigen1 = $('#txtidorigen1');
var txtdesidorigen1 = $('#txtdesidorigen1');
var txtidorigen2 = $('#txtidorigen2');
var txtdesidorigen2 = $('#txtdesidorigen2');
var txtidorigen3 = $('#txtidorigen3');
var txtdesidorigen3 = $('#txtdesidorigen3');
//otras variables var clsprovincia;
var clsdistrito;
var txtorigenreceta1 = $('#txtorigenreceta1');
var txtorigenreceta2 = $('#txtorigenreceta2');
var txtorigenreceta3 = $('#txtorigenreceta3');


var txtiddetalle = document.getElementById('txtiddetalle');
var cmbbanco = document.getElementById('cmbbanco');
var btnagregarBanco = document.getElementById('btnagregarBanco');
var btnLimpiarBanco = document.getElementById('btnLimpiarBanco');


var btnguardar = document.getElementById('btnguardar');

var formregistro = document.getElementById('formregistro');

var codigo;

var cmbcolegio = $('#cmbcolegio');

//labels

//contenedores

//buttons

$(document).ready(function () {
    fnListarColegio();
    fnListarEspecialidadCombo();
    MCC_fnListarDepartamentos();
    fnListarBancos("cmbbanco");
    fnListarLineaAtencion();
    //var url = window.location.pathname;
    //codigo = url.replace("/Maestros/Medico/RegistrarEditar/", "");
    ////codigo = parseInt(url);
    if (_idmedico != null) {
        codigo = _idmedico;
        fmListarMedicoBanco(_idmedico);
        document.getElementById('idLi3').style.display = "block";
        document.getElementById('idLi4').style.display = "block";
        var obj = {
            codigo: _idmedico
        };
        let controller = new MedicoController();
        controller.BuscarMedicoPorId(obj, fnLlenarDatosdeMedico);
    }
    else {
        //agregar nuevo
        document.getElementById('idLi4').style.display = "none";
        document.getElementById('checkcomisionfm').checked = true;
        document.getElementById('checkcomisionpt').checked = true;
        checkcomisionfm.val(true);
        checkcomisionpt.val(true);
    }
});
$('#formregistro').submit(function (e) {
    e.preventDefault();
//btnguardar.addEventListener('click', function () {
    var data = $('#formregistro').serializeArray();
    data.push({ name: "checkcomisionfm", value: document.getElementById('checkcomisionfm').value },
        { name: "checkcomisionpt", value: document.getElementById('checkcomisionpt').value },
        { name: "estado", value: "HABILITADO" })
    var obj = { obj: CONVERT_FORM_TO_JSON(data) }
    
    var controller = new MedicoController();
    controller.RegistrarEditar(obj, fnLlenarDatosdeMedico);
});
function fnLlenarDatosdeMedico(data) {
    console.log(data);
    txtcodigo.val(data[0].idmedico);
    txtnombres.val(data[0].nombres);
    txtapepaterno.val(data[0].apepaterno);
    txtapematerno.val(data[0].apematerno);
    txtncolegiatura.val(data[0].nrocolegiatura);
    var fechan = new Date(data[0].fechaNacimiento);
    var tt = new Date(fechan.getFullYear(), fechan.getMonth(), fechan.getDate());
    txtfechanacimiento.val(moment(tt).format('YYYY-MM-DD'));
    txttelefono.val(data[0].telefono);
    txtemail.val(data[0].email);
    txtfrecuencia.val(data[0].frecuencia);
    txtcategoria.val(data[0].categoria);

    fnListarProvincias(data[0].iddepartamento, data[0].idprovincia);
    fnListarDistrito(data[0].idprovincia, data[0].iddistrito);
    txtorigenreceta1.val(data[0].idorigen1);
    txtorigenreceta2.val(data[0].idorigen2);
    txtorigenreceta3.val(data[0].idorigen3);
    txtobservacion.val(data[0].observacion);
    txtdireccion.val(data[0].direccion);
    txtdireccionconsultorio.val(data[0].direccionconsultorio);

    //otros datos
    checkAsociado.val(data[0].asociadoQF);
    txtcostolima.val(data[0].costolima);
    txtcostoprovincia.val(data[0].costoprovincia);
    checkteleconsulta.val(data[0].teleconsulta);
    txtcostoteleconsulta.val(data[0].costoteleconsulta);
    checkconsultapresencial.val(data[0].consultapresencial);
    txtcostoconsultapresencial.val(data[0].costoconsultapresencial);
    txtusuario.val(data[0].usuario);
    txtclave.val(data[0].clave);
    txtusuariozoom.val(data[0].usuariozoom);
    txtclavezoom.val(data[0].clavezoom);
    txtzoomapikey.val(data[0].zoomapikey);
    txtzoomapisecret.val(data[0].zoomapisecret);
    checkconvenio.val(data[0].convenio);
    txtcomisionfm1.val(data[0].comisionfm1);
    txtcomisionfm2.val(data[0].comisionfm2);
    txtcomisionpt1.val(data[0].comisionpt1);
    txtcomisionprocedimiento.val(data[0].comisionprocedimiento);
    checktercero.val(data[0].checktercero);
    checkms.val(data[0].checkms);
    checkcomisionfm.val(data[0].checkcomisionfm);
    checkcomisionpt.val(data[0].checkcomisionpt);
    document.getElementById('txtcomisionfm1').readOnly = !data[0].checkcomisionfm;
    document.getElementById('txtcomisionfm2').readOnly = !data[0].checkcomisionfm;
    document.getElementById('txtcomisionpt1').readOnly = !data[0].checkcomisionpt;
    document.getElementById('checkcomisionfm').checked = data[0].checkcomisionfm;
    document.getElementById('checkcomisionpt').checked = data[0].checkcomisionpt;

    //../../imagenes/fondologin.jpeg
    document.getElementById("txtimagenfotomedico").src = "../../../imagenes/medicos/"+data[0].fotomedico;
    document.getElementById("txtimagenfirma").src = "../../../imagenes/medicos/" +data[0].fotofirma;
    setTimeout(function () { cmbdepartamento.val(data[0].iddepartamento); cmblineaatencion.val(data[0].idLineaAtencion); }, 3000);
    cmbcolegio.val(data[0].idcolegio);
    $('#cmbespecialidad').val(data[0].idespecialidad).trigger('change.select2');
    //checkconocannabis.value = (data[0].conocecannabis == null ? 0 : data[0].conocecannabis);
    //checkconocefm.value=(data[0].conoceformulacion);
 
}
function fmListarMedicoBanco(id) {
    var obj = {
        codigo: id
    };
    var url = ORIGEN + "/Maestros/Medico/getMedicobancoCodigo";
    $.post(url, obj).done(function (data) {
        if (data == null)
        return;

        //tblbanco.rows().clear().draw(false);
        //var data = response.dataobject;
        var fila = '';        
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].iddetalle + '">';
            fila += '<td class="banco">' + data[i].idbanco + '</td>';
            fila += '<td>' + data[i].descripcion + '</td>';
            fila += '<td class="cuenta">' + data[i].cuenta + '</td>';
            fila += '<td class="cci">' + data[i].cci + '</td>';
            if (data[i].estado === "HABILITADO") {
                fila += '<td class="estado" style="text-align: center;"><span class="badge badge-pill badge-success">' + data[i].estado + '</span></td > ';
            } else {
                fila += '<td class="estado" style="text-align: center;"><span class="badge badge-pill badge-warning">' + data[i].estado + '</span></td > ';
            }
            fila += '<td><button class="btn btn-warning btn-sm btneditarBanco"><i class="fas fa-edit"></i></button></td>';
            fila += '</tr>';
        }
        tblbody.innerHTML = fila;
    }).fail(function (data) {
        mensajeError(data);
    });

}
function fnLimpiarBancos() {
    cmbbanco.selectedIndex = 0;
    txtcuenta.value = "";
    txtcci.value = "";
    cmbestado.selectedIndex = 0;
    txtiddetalle.value = "";
}
$(document).on('click', '.btneditarBanco', function (e) {
    var columna = this.parentNode.parentNode;
   
    txtiddetalle.value = parseInt(columna.getAttribute('id'));
    cmbbanco.value = (columna.getElementsByClassName('banco')[0].innerText);
    txtcuenta.value=(columna.getElementsByClassName('cuenta')[0].innerText);
    txtcci.value=(columna.getElementsByClassName('cci')[0].innerText);
    cmbestado.val(columna.getElementsByClassName('estado')[0].innerText);
});
function fnListarBancos(cmb) {
    let controller = new BancoController();
    controller.ListarBancosHabilitados(cmb, function () { });
}
function fnListarEspecialidadCombo(num) {
    let controller = new EspecialidadController();
    controller.ListarEspecialidadCmb('cmbespecialidad', num, true);
}
function fnListarColegio() {
    var controller = new ColegioController();
    controller.ListarColegiosCombo('cmbcolegio');
}
function fnListarEspecialidad() {
    let contro = new EspecialidadController();
    contro.ListarEspecialidadxColegio('cboespecialidad', cbocolegio.val());
}

function MCC_fnListarDepartamentos() {
    let controller = new DepartamentoController();
    controller.Listar('cmbdepartamento');
}
function fnListarLineaAtencion() {
    var controller = new PedidoController();
    controller.ListarLineaAtencionCombo('cmblineaatencion');
}
//function MCC_fnListarDocumentoPersonal() {
//    let controller = new DocumentoPersonalController();
//    controller.Listar('MCC_cmbtipodoc', null);
//}
function fnListarProvincias(depa,seleccion) {
    let controller = new ProvinciaController();
    //controller.Listar(cmbdepartamento.value, seleccion, 'cmbprovincia', null);
    controller.Listar(depa, seleccion, 'cmbprovincia', null);
}
function fnListarDistrito(prov,seleccion) {
    let controller = new DistritoController();
    controller.Listar(prov, seleccion , 'cmbdistrito', null);
    //controller.Listar(cmbprovincia.value, '', 'cmbdistrito', null);
}

cmbdepartamento.change(function () {
    fnListarProvincias(cmbdepartamento.val(),"");
});
cmbprovincia.change(function () {
    fnListarDistrito(cmbprovincia.val(),"");
});
btnLimpiarBanco.onclick(function () {
    fnLimpiarBancos();
});

btnagregarBanco.addEventListener('click', function () {
    
});
function fnSetBanco() {
    var url = ORIGEN + "/Maestros/Medico/setMedicobanco";
    var banco = {};
    banco['iddetalle'] = $('#txtiddetalle').val();
    banco['idmedico'] = _idmedico;
    banco['idbanco'] = $('#cmbbanco').val();
    banco['cuenta'] = $('#txtcuenta').val();
    banco['cci'] = $('#txtcci').val();
    banco['estado'] = $('#cmbestado').val();
    var dataobj = {
        obj: banco
    }
    console.log(banco);
    $.post(url, dataobj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Cuenta Agregada');
            fmListarMedicoBanco(_idmedico);
            fnLimpiarBancos();
        } else {
            mensajeError(data);
        }
    }).fail(function (data) {
        mensajeError(data);
    });
}

//$('#formregistro').submit(function (e) {
//    e.preventDefault();
//    var data = $('#formregistro').serializeArray();
//    var obj = { obj: CONVERT_FORM_TO_JSON(data) }
//    console.log(obj);
//    var controller = new MedicoController();
//    controller.RegistrarEditar(obj, fnLimpiarForm);
//        //fnLimpiarForm();
//        //window.location = ORIGEN +"/Maestros/Medico";
//});
//formregistro.addEventListener('submit', function (e) {

//    e.preventDefault();
    
//});

function fnLimpiarForm() {
    formregistro.reset();
    txtcodigo.value = '';
}
function fnguardarimagen(id) {
    
    //if (txtimagenfirma.get(0).files.length === 0) {
    //    console.log("vacioooooooooo1");
    //}
    //if (txtimagenfotomedico.get(0).files.length === 0) {
    //    console.log("vacioooooooooo2222");
    //}
    if (txtimagenfotomedico.get(0).files.length > 0 || txtimagenfotomedico.get(0).files.length > 0) {
        console.log("aaaaaaaaaaaaa");
        var dataString = new FormData();
        var url = ORIGEN + "/Maestros/Medico/SetImagen";
        var selectFile = $('#txtfotomedico')[0].files[0];
        var selectFile2 = $('#txtfirma')[0].files[0];
        dataString.append("id", id);
        dataString.append('fileMedico', selectFile);
        dataString.append('filefirma', selectFile2);
        if (id >= 0) {
            $.ajax({
                url: url,
                type: "POST",
                data: dataString,
                contentType: false,
                processData: false,
                async: false,
                success: function (data) {
                    console.log(data);
                    mensaje('S', 'Imagenes guardadas');
                    fnLimpiarForm();
                    window.location = ORIGEN + "/Maestros/Medico/RegistrarEditar/" + id;
                }, complete: function (data) {
                    console.log(data);
                    if (data.mensaje === "ok") {
                        fnLimpiarForm();
                        window.location = ORIGEN + "/Maestros/Medico/RegistrarEditar/" + id;
                    }
                }, error: function (data) {
                    mensajeError(data);
                }
            });
        } else {
            fnLimpiarForm();
            window.location = ORIGEN + "/Maestros/Medico/RegistrarEditar/" + id;
        }
    } else {
        window.location = ORIGEN + "/Maestros/Medico/RegistrarEditar/" + id;
    }
}

function CambioEstadoCheckFM(casilla) {
    checkcomisionfm.val(casilla.checked);
    document.getElementById('txtcomisionfm1').readOnly = !casilla.checked;
    document.getElementById('txtcomisionfm2').readOnly = !casilla.checked;
}
function CambioEstadoCheckPT(casilla) {
    checkcomisionpt.val(casilla.checked);
    document.getElementById('txtcomisionpt1').readOnly = !casilla.checked;
}