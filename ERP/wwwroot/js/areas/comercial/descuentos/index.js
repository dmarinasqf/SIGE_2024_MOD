var tbodylista = document.getElementById('tbodylista');
var txtdescripcion = document.getElementById('txtdescripcion');
var txtfechainicio = document.getElementById('txtfechainicio');
var btnconsultar = document.getElementById('btnconsultar');

//modal sucursales
var checkallsucursal = document.getElementById('checkallsucursal');

//variables
var _sucursales = [];
var tblsucursal;
$(document).ready(function () {
    tblsucursal = $('#tblsucursal').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[12, 25, 50, -1], [12, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()

    });
    fnlistardescuentos(1, 20);
    fnlistarsucursal();
});

function fnlistardescuentos(numpagina, tamanopagina) {
    let controller = new DescuentoController();
    var obj = {
        descripcion: txtdescripcion.value.trim(),
        fechainicio: txtfechainicio.value.trim(),
        pagine: {
            numpagina: numpagina,
            tamanopagina: tamanopagina,
        }
    };
    controller.ListarDescuentos(obj, function (data) {
        document.getElementById('paged').innerHTML = '';
        var registros = data.data;
        var fila = '';
        for (var i = 0; i < registros.length; i++) {
            fila += '<tr id="' + registros[i].iddescuento+'">';
            fila += '<td>' + moment(registros[i].fechacreacion).format('DD/MM/YYYY HH:mm A') + '</td>';
            fila += '<td>' + registros[i].descripcion + '</td>';
            fila += '<td>' + moment(registros[i].fechainicio).format('DD/MM/YYYY HH:mm A') + '</td>';
            fila += '<td>' + moment(registros[i].fechafin).format('DD/MM/YYYY HH:mm A') + '</td>';
            fila += '<td>' + (registros[i].usuariocrea) + '</td>';
            fila += '<td>' + (registros[i].usuariovalida) + '</td>';
            fila += '<td>' + (registros[i].estado) + '</td>';
            fila += `<td>
            <button class="btn btn-dark btnsucursal" data-toggle="tooltip" title="Asignar sucursales"><i class="fas fa-warehouse"></i></button>
            <button class="btn btn-info btndatosdescuento" data-toggle="tooltip" title="Ver datos de registro"><i class="fas fa-eye"></i></button>
                    </td>`;

            fila += '</tr>';
        }
        tbodylista.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(data.totalpaginas, data.paginaactual, 'DClinkpagedoccobrar', 'paged');
        //PaggingTemplate();
    });
}


$(document).on('click', '.DClinkpagedoccobrar', function () {
    var numpagina = this.getAttribute('numpagina');
    fnlistardescuentos(numpagina,25);
    var pages = document.getElementsByClassName('pagelink');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
btnconsultar.addEventListener('click', function () {
    fnlistardescuentos(1, 20);
});
$(document).on('click', '.btnsucursal', function () {
    $('#modalasignarsucursal').modal('show');
    var fila = this.parentNode.parentNode;
    fnbuscarsucursaldescuento(fila.getAttribute('id'));

});
$(document).on('click', '.btndatosdescuento', function () {
    $('#modaldatosdescuento').modal('show');
    var fila = this.parentNode.parentNode;
    MDDfngetdescuento(fila.getAttribute('id'));

});
checkallsucursal.addEventListener('click', function () {
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
    if (this.checked) {
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', true);
        mensaje('I', 'Se ha seleccionado ' + nodos.length + ' sucursales');
    }
    else
        $(tblsucursal.rows({ filter: 'applied' }).nodes()).find('input[type="checkbox"]').prop('checked', false);
});

$('#modalasignarsucursal').on('shown.bs.modal', function () {
    checkallsucursal.checked = false;
});
$('#tbodylista').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#tbodylista tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');   
});
btnguardarofertassucubloque.addEventListener('click', function () {
    let controller = new DescuentoController();
    var obj = {
        iddescuento:tbodylista.getElementsByClassName('selected')[0].getAttribute('id'),
        idsucursal: (fngetallsucursal())
    };
    controller.AsignarDescuentoSucursalEnBloque(obj);
});
function fnbuscarsucursaldescuento(iddescuento) {
    let controller = new DescuentoController();
    controller.ListarSucursalDescuento(iddescuento, function (data) {       
        fncargarsucursaldescuento(data);
    });
}
function fnlistarsucursal() {
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnTable('1', function (data) {
        _sucursales = data;
    });
}
function fncargarsucursaldescuento(data) {
    tblsucursal.clear().draw(false);
    for (var i = 0; i < _sucursales.length; i++) {
        var checked = '';
        if (_sucursales[i].tipo == 'LOCAL') {
            for (var j = 0; j < data.length; j++) {
                if (_sucursales[i].idsucursal === data[j].idsucursal)
                    checked = 'checked';
            }
            var fila = tblsucursal.row.add([
                _sucursales[i].descripcion,
                '<input type="checkbox"   class="hasoferta" ' + checked + '/>'
            ]).draw(false).node();
            fila.setAttribute('idsucursal', _sucursales[i].idsucursal);
        }

    }
}
function fngetallsucursal() {
    var array = [];
    var nodos = $(tblsucursal.rows({ filter: 'applied' }).nodes());
    for (var i = 0; i < nodos.length; i++) {
        var ischecked = nodos[i].getElementsByClassName('hasoferta')[0].checked;
        if (ischecked)
            array.push("true - " + nodos[i].getAttribute('idsucursal'));
        else
            array.push("false - " + nodos[i].getAttribute('idsucursal'));

    }
    return array;
}