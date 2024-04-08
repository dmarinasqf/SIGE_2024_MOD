

var MCPcmbtipodoc = document.getElementById('MCPcmbtipodoc');
var MCPtxtnumdocumento = document.getElementById('MCPtxtnumdocumento');
var MCPtxtfiltro = document.getElementById('MCPtxtfiltro');

$(document).ready(function () {
    MCPtblpaciente = $('#MCPtblpaciente').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
    });
    MCPfnBuscarpaciente();
});
MCPtxtfiltro.addEventListener('keyup', function (e) {
    if (e.key === 'Enter')
        MCPfnBuscarpaciente();
});

function Tdoc() {
    var iddocumento = document.getElementById('iddocumento').value;
    var MCPtxtapepaterno = document.getElementById('MCPtxtapepaterno');
    var MCPtxtapematerno = document.getElementById('MCPtxtapematerno');
    console.log(iddocumento)
    //if (iddocumento == "RUC") {
    //    MCPtxtapepaterno.style.disabled = true;
    //    MCPtxtapematerno.style.disabled = true;
    //}


}

$(document).on('click', '.MCPbtneditarpaciente', function () {
    var idpaciente = this.getAttribute('idpaciente');
    let controller = new PacienteController();
    $('#tabRegistroPaciente').tab('show');
    controller.BuscarPacientById(idpaciente, function (data) {
        console.log(data);
        MCPcmbtipopaciente.value = data.tipopaciente;
        MCPidtutor.value=(data.idtutor);
        MCPlblnombretutor.innerText=data.tutor;
        MCPtxtcodigo.value = data.idpaciente;
        MCPfnaccionestipopaciente();
        if (data.tipopaciente == 'PERSONA') {
            MCPdivpersona.classList.remove('ocultar');
            MCPdivmascota.classList.add('ocultar');
         
            MCPcmbtipodoc.value = data.iddocumento;
            MCPtxtnumdocumento.value = data.numdocumento;
            MCPtxtnombres.value = data.nombres;
            MCPtxtapepaterno.value = data.apepaterno;
            MCPtxtapematerno.value = data.apematerno;
            MCPcmbsexo.value = data.sexo;
            MCPtxtfechanacimiento.value = moment(data.fechanacimiento).format('YYYY-MM-DD');
            MCPtxtemail.value = data.email;
            MCPtxttelefono.value = data.telefono;
            MCPtxtcelular.value = data.celular;
            MCPtxtcelular2.value = data.celular2;
          
            MCPcmbdepartamento.value = (data.iddepartamento === null ? '' : data.iddepartamento);
            let procontroller = new ProvinciaController();
            procontroller.Listar(data.iddepartamento, data.idprovincia, 'MCPcmbprovincia', null);
            let discontroller = new DistritoController();
            discontroller.Listar(data.idprovincia, data.iddistrito, 'MCPcmbdistrito', null);
            MCPtxtdireccion.value = data.direccion;
            MCPtxtreferencia.value = data.referencia;
            MCPverificarnumdigitosdedocumento();
            MCPcheckisempleado.checked = data.isempleado??false;
            MCPcheckisempleado.value = data.isempleado ?? false;
            MCPcheckpacienteccanabis.checked = data.pacientecannabis ?? false;
            MCPcheckpacienteccanabis.value = data.pacientecannabis ?? false;
            if (data.isempleado)
                MCPdivarea.classList.remove('ocultar');
            else
                MCPdivarea.classList.add('ocultar');
            MCPcmbarea.value = data.idgrupo;
        } else if (data.tipopaciente == 'MASCOTA') {
            MCPdivpersona.classList.add('ocultar');
            MCPdivmascota.classList.remove('ocultar');

            MCPtxtnombremascota.value = data.nombres;
            MCPcmbtipomascota.value = data.idtipomascota;
            MCPcmbpatologia.value = data.idpatologiamascota;
            MCPtxtpeso.value = data.peso;
            let raza = new RazaController();
            raza.ListarRazaByTipoMascota('MCPcmbraza', data.idtipomascota, data.idraza);
        }
       

    });
});
function MCPfnBuscarpaciente() {
    var obj = {
        filtro: MCPtxtfiltro.value.trim().toUpperCase(),
        top: 20
    };
    let controller = new PacienteController();
    controller.BuscarPacientes(obj, function (data) {     
        MCPtblpaciente.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            //cuando le da click al boton MCPbtnseleccionarpaciente debe de seleccinar el que usa no el primero de la lista
            var fila=MCPtblpaciente.row.add([
                '<div class="btn-group btn-group">' +
                '<button class="btn-success MCPbtnseleccionarpaciente"  idpaciente="' + data[i].idpaciente + '"><i class="fas fa-check"></i></button>' +
                '<button class="btn-warning MCPbtneditarpaciente" idpaciente="' + data[i].idpaciente + '"><i class="fas fa-edit"></i></button>' +
                '</div>',                           
                data[i].numdocumento,
                data[i].nombres + ' ' + (data[i].apepaterno ?? '') + ' ' + (data[i].apematerno ?? ''),
                data[i].tipopaciente,
                data[i].telefono,

            ]).draw(false).node();
            fila.setAttribute('idpaciente', data[i].idpaciente);
        }
    });
}
