var txtcodigo = $('#txtcodigo');
var txtdescripcion = $('#txtdescripcion');
var cmbestado = $('#cmbestado');
var tbllista;
var btnguardar = $('#btn-guardar');
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
    $('#form-registro').trigger('reset');    
    txtcodigo.val("");
}

$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Almacen/AFormaFarmaceutica/RegistrarEditar";
    var obj = $('#form-registro').serializeArray();
    btnguardar.prop('disabled', true);
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {         
                mensaje('S', 'Datos guardados');
                tbllista.row('.selected').remove().draw(false);         
                agregarFila(data.objeto);
            limpiar();
        } else if (data.mensaje === 'ok-habilitado') {
            mensaje('S', 'Existia un registro con la misma descripcion se ha habilitado');
            agregarFila(data.objeto);
            limpiar();
        } else
            mensaje('W', data.mensaje);
        btnguardar.prop('disabled', false);
    }).fail(function (data) {
        btnguardar.prop('disabled', false);
        mensajeError(data);
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
    txtcodigo.val(columna[0]);
    txtdescripcion.val(columna[1]);
    cmbestado.val(columna[2]);   
    $('#modalregistro').modal('show');
});
function agregarFila(data) {
    console.log(data);
   var fila= tbllista.row.add([
        data.idformafarma,
        data.descripcion,
        data.estado,
        `<div class="btn-group btn-group-sm" >            
            <button class="btn btn-sm bg-warning waves-effect btn-pasar"><i class="fas fa-edit"></i></button>           
        </div>`
   ]).draw(false).node();
    if (data.estado == 'DESHABILITADO')
        fila.classList.add('table-danger');
}
