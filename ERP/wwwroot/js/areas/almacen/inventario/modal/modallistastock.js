

var MLS_tbllistastock;

$(document).ready(function () {
    MLS_tbllistastock = $('#MLS_tbllistastock').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE(),
    });
});

function fnMLSListarStock() {
    MLS_tbllistastock.clear().draw(false);
    if (arrayLoteConfirmados.length > 0) {
        for (var i = 0; i < arrayLoteConfirmados.length; i++) {
            MLS_tbllistastock.row.add([
                arrayLoteConfirmados[i][1],
                arrayLoteConfirmados[i][2],
                arrayLoteConfirmados[i][3],
                arrayLoteConfirmados[i][4],
                arrayLoteConfirmados[i][5],
                moment(arrayLoteConfirmados[i][6]).format("DD-MM-YYYY"),
                arrayLoteConfirmados[i][7],
                arrayLoteConfirmados[i][8],
                //'<button type="button" class="btn btn-danger btn-sm btneliminaritem" idstock=' + arrayLoteConfirmados[i][0] + '><i class="fa fa-trash"></i></button>',
            ]).draw(false).node();
        }
    }
}

$('#MLS_tbllistastock tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
    }
    else {
        MLS_tbllistastock.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
//$(document).on('click', '.btneliminaritem', function (e) {
//    var idstockSeleccionado = $(this).attr("idstock");
//    arrayLoteConfirmados = arrayLoteConfirmados.filter(x => x[0] != idstockSeleccionado);
//    MLS_tbllistastock.row('.selected').remove().draw(false);
//});
