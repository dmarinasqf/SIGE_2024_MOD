var MO_txtfiltro = document.getElementById('MO_txtfiltro');
var MO_tbodyofertas = document.getElementById('MO_tbodyofertas');


MO_txtfiltro.addEventListener('keyup', function (e) {
    if (e.key == 'Enter')
        fn_MObuscarobsequios();
});
$('#modalofertas').on('shown.bs.modal', function (e) {
    fn_MObuscarobsequios();
});
function fn_MObuscarobsequios() {
    var obj = {
        filtro: MO_txtfiltro.value,
        top:50
    };
    let controller = new OfertaController();
    controller.BuscarObsequios(obj, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr id="' + data[i].idoferta + '">';
            fila += '<td>' + data[i].idoferta + '</td>';
            fila += '<td>' + data[i].nombre + '</td>';
            fila += '<td>' + data[i].tipo + '</td>';
            fila += '<td>' + moment(data[i].fechainicio).format('DD/MM/YYYY') + '</td>';
            fila += '<td>' + moment(data[i].fechafin).format('DD/MM/YYYY') + '</td>';
            fila += '<td>' + data[i].estado + '</td>';
            fila += '<td><button class="btn btn-sm btn-success btncargaroferta" id="' + data[i].idoferta + '"><i class="fas fa-check"></i></button></td>';
            fila += '</tr>';
        }
        MO_tbodyofertas.innerHTML = fila;
    });
}