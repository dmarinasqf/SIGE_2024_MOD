var ML_tbllaboratorio;
var ML_txtlaboratorio = $('#ML_txtlaboratorio');
var ML_arrayLaboratoriosCheck = [];

$(document).ready(function () {
    ML_tbllaboratorio = $('#ML_tbllaboratorio').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[20, 25, 30, -1], [20, 25, 30, "All"]],
        responsive: true,
        //buttons: BOTONESDATATABLE('LISTA SUCURSALES ', 'H', false),
        "language": LENGUAJEDATATABLE()
        //"columnDefs": [
        //    {
        //        "targets": [2],
        //        "visible": false,
        //        "searchable": false
        //    }  ]      
    });
    ML_buscarLaboratorio();
});

function ML_buscarLaboratorio() {
    
    let controler = new LaboratorioController();
    controler.BuscarLaboratoriosYCantidadDeCompras(ML_txtlaboratorio.val(), ML_ListarLaboratorio);

}

function ML_ListarLaboratorio(data) {
    var dataJson = JSON.parse(data);
    ML_tbllaboratorio.clear().draw(false);
    for (var i = 0; i < dataJson.length; i++) {
        var checked = "";
        var arrayIdLab = ML_arrayLaboratoriosCheck.find(x => x == dataJson[i].idlaboratorio);
        if (arrayIdLab != undefined) {
            checked = "checked";
        }
        ML_tbllaboratorio.row.add([
            dataJson[i].idlaboratorio,
            dataJson[i].descripcion,
            dataJson[i].CANTIDA_COMPRA,
            '<input type="checkbox" class="chk-col-red checkboxLaboratorio" idlaboratorio="' + dataJson[i].idlaboratorio + '" descripcion="' + dataJson[i].descripcion + '" ' + checked + '/>'
            //'<button class="btn btn-sm btn-success ML_btnpasarlaboratorio"><i class="fas fa-check fa-1x"></i></button>'
        ]).draw(false);
    }
}

$('#ML_txtlaboratorio').keyup(function () {
    ML_buscarLaboratorio();
});

$(document).on('change', '.checkboxLaboratorio', function () {
    var fila = this.parentNode.parentNode;
    var idlaboratorio = parseInt(fila.childNodes[0].innerText);
    var estado = this.checked;
    if (estado) {
        ML_arrayLaboratoriosCheck.push(idlaboratorio);
    } else {
        ML_arrayLaboratoriosCheck = ML_arrayLaboratoriosCheck.filter(x => x != idlaboratorio);
    }
});

//$("#ML_txtlaboratorio").on("keyup", function () {
//    var value = $(this).val().toLowerCase();
//    var c = 0;
//    ML_tbllaboratorio.each(function () {
//    //$("#ML_tbodylaboratorio tr").filter(function () {
//        var laboratorio = $(this)[0].childNodes[1].innerText.toLowerCase();
//        var tamanioValue = value.length;
//        if (laboratorio.slice(tamanioValue) == value) {
//            $(this).toggle(c > -1);
//        }
//        else
//            $(this).toggle(-1 > -1);
//        c++;
//        //$(this).toggle($(this)[0].childNodes[1].innerText.toLowerCase().indexOf(value) > -1)
//    });
//});