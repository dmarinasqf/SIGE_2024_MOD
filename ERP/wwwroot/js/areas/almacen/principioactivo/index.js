var txtcodigo = document.getElementById('txtcodigo');
var txtdescripcion = document.getElementById('txtdescripcion');
var cmbestado = document.getElementById('cmbestado');

var btnguardar = document.getElementById('btnguardar');
var formregistro = document.getElementById('form-registro');

var tbllista;

$(document).ready(function () {
  
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    });
});

function limpiar() {
    formregistro.reset();
    txtcodigo.value = '';
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var obj = $('#form-registro').serializeArray();       
    let controller = new PrincipioActivoController();
    controller.RegistrarEditar(obj, function (data) {       
        if (txtcodigo.value != '')
            tbllista.row('.selected').remove().draw(false);
        agregarFila(data.objeto);
        limpiar();
    });
});

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$(document).on('click', '.btn-pasar', function (e) {
    var columna = tbllista.row($(this).parents('tr')).data();
    txtcodigo.value=(columna[0]);
    txtdescripcion.value=(columna[1]);
    cmbestado.value=(columna[2]);   
    $('#modalregistro').modal('show');
});
function agregarFila(data) {
    console.log(data);
    tbllista.row.add([
        data.idprincipio,
        data.descripcion,
        data.estado,
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm btn-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>            
        </div>`
    ]).draw(false);
}


