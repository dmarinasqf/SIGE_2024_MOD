var tbodyprecios = document.getElementById('tbodyprecios');
var cmbcliente = document.getElementById('cmbcliente');
var btncrearlista = document.getElementById('btncrearlista');
var txtfiltro = document.getElementById('txtfiltro');

$(document).ready(function () {
    let controller = new ClienteController();
    var fn = controller.BuscarClientesSelect2();
    $('#cmbcliente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento o razón social",
    });
    fnlistarlistaclientes();
});

btncrearlista.addEventListener('click', function () {
    if (cmbcliente.value == '') {
        mensaje('I', 'Seleccione cliente');
        return;
    }
    var obj = {
        idcliente: cmbcliente.value
    };
    let controller = new ListaPreciosClienteController();
    controller.CrearLista(obj, () => { fnlistarlistaclientes(); });
});

function fnlistarlistaclientes(numpagina,tamañopagina) {
    let controller = new ListaPreciosClienteController();
    var obj = {
        filtro: txtfiltro.value.trim(),
        pagine: {
            tamanopagina: tamañopagina ?? 20,
            numpagina: numpagina ?? 1
        }
    };
    controller.BuscarListaCliente(obj, function (response) {
        var fila = '';
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            fila += '<tr idlista=' + data[i].idlistaprecio+'>';
            fila += '<td>' + data[i].cliente+'</td>';
            fila += '<td>'+ data[i].estado+'</td>';
            fila += `<td>
                <button class="btn btn-dark btn-sm btnsubirprecios"  data-toggle="tooltip" title="Subir precios" ><i class="fas fa-file-upload"></i></button>
                <button class="btn btn-danger btn-sm btneliminarprecios"  data-toggle="tooltip" title="Eliminar precios" ><i class="fas fa-trash-alt"></i></button>
                <button class="btn btn-dark btn-sm btnlistarprecios"  data-toggle="tooltip" title="Listar precios" ><i class="fas fa-list"></i></button>
                </td>`;
            fila += '</tr>';
        }
        tbodyprecios.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');
    });
}
$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnlistarlistaclientes(numpagina, 20);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
txtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fnlistarlistaclientes();
});
$(document).on('click', '.btnsubirprecios', function () {
    var fila = this.parentNode.parentNode;
    MSEfnlimpiar();
    MSEtxtidlista.value = fila.getAttribute('idlista');
    $('#modalsubirexcel').modal('show');
   
});

$(document).on('click', '.btnlistarprecios', function () {
    var fila = this.parentNode.parentNode;
    MSEfnlimpiar();
    MSEtxtidlista.value = fila.getAttribute('idlista');
    $('#modallistaprecios').modal('show');
    cargarlistadeprecios(MSEtxtidlista.value);


});

$(document).on('click', '.btneliminarprecios', function () {
    var fila = this.parentNode.parentNode;
    swal({
        title: '¿Desea limpiar precios del cliente?',
        text: '',
        icon: 'info',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            let controller = new ListaPreciosClienteController();
            var obj = {
                idlista: fila.getAttribute('idlista')
            };
            controller.EliminarPreciosCliente(obj, () => {
                mensaje('S', 'Lista de precios limpiada del cliente');

            }, () => {


            });

        }
        else
            swal.close();
    });
});

$('#tbodyprecios').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#tbodyprecios tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    if (!this.classList.contains('hijo'))
        this.classList.add('selected');
});
