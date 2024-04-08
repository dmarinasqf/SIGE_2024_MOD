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


    var contadorInterno2 = 0;
    var sSucursalAlmacenlaboratorio = "";
    var sucalmaceneslaboratorio = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < sucalmaceneslaboratorio.length; i++) {
        if (sucalmaceneslaboratorio[i].name.includes("Almacen")) {
            if (contadorInterno2 == 0)
                sSucursalAlmacenlaboratorio += sucalmaceneslaboratorio[i].value;
            else
                sSucursalAlmacenlaboratorio += "|" + sucalmaceneslaboratorio[i].value;

            contadorInterno2 += 1;
        }
    }


    var data = ML_txtlaboratorio.val();

    // DECIDI PROBAR EL CODIGO TERNARIO PARA HACER EL CODIGO MAS CORTO

    let obj = {
        sucursales: listasucursalesseleccionadas.join('|'),
        almacenes: sSucursalAlmacenlaboratorio,
        laboratorio: data
    };
    var url = ORIGEN + "/Almacen/AGuiaSalida/Getlistar_Laboratorio_Array";

    var todosLosDatoslaboratorio = [];
    $.post(url, obj).done(function (data) {


        if (data && data.rows && data.rows.length > 0) {
            todosLosDatoslaboratorio = data.rows;
        }
        ML_ListarLaboratorio(data);
        console.log(todosLosDatoslaboratorio);
    });


}

function ML_ListarLaboratorio(data) {
    ML_tbllaboratorio.clear().draw(false);
    var rowsToAdd = [];

    for (var i = 0; i < data.rows.length; i++) {
        var checked = "";
        var arrayIdLab = ML_arrayLaboratoriosCheck.find(x => x == data.rows[i][0]);
        if (arrayIdLab != undefined) {
            checked = "checked";
        }

        rowsToAdd.push([
            data.rows[i][0],
            data.rows[i][1],
            data.rows[i][2],
            '<input type="checkbox" class="chk-col-red checkboxLaboratorio" idlaboratorio="' + data.rows[i][0] + '" descripcion="' + data.rows[i][1] + '" ' + checked + '/>'
        ]);
    }

    ML_tbllaboratorio.rows.add(rowsToAdd).draw(false);
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