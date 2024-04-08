
var tbmedicosderepmedico;
var MMRtxtfiltro = document.getElementById('MMRtxtfiltro');
var MMRtxtidrepmedico = document.getElementById('MMRtxtidrepmedico');
var timerbusqueda_medicorepmedico;
$(document).ready(function () {
    tbmedicosderepmedico = $('#tbmedicosderepmedico').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        info: false,
        paging: true,
        //pageLength: [15]
    });
});

MMRtxtfiltro.addEventListener('keyup', function (e) { 
    clearTimeout(timerbusqueda_medicorepmedico);
    var $this = this;
    timerbusqueda_medicorepmedico = setTimeout(function () {
        if (e.key != 'Enter') {
            MMRfnbuscarmedicos();
        }

    }, 1000);
});

function MMRfnbuscarmedicos( ) {
    var obj = {
        idrepresentante: MMRtxtidrepmedico.value.trim(),
        top: 15,
        tipo: 'CONSULTA',
        filtro: MMRtxtfiltro.value.trim()
    };
    
    let controller = new MedicoRepresentanteController();
    controller.ListarMedicosRepMedico(obj, (data) => {      
        tbmedicosderepmedico.rows().clear();
        for (var i = 0; i < data.length; i++) {
            var fila = tbmedicosderepmedico.row.add([
                data[i]['CMP'],
                data[i]['MEDICO'],
                 data[i]['ESPECIALIDAD'],
                 '<button class="btn  btn-success btn-sm MMbtnpasarmedico"><i class="fas fa-check fa-1x"></i></button>'
            ]).draw(false).node();
            fila.setAttribute('idmedico', data[i]['IDMEDICO']);
        }
    });
}