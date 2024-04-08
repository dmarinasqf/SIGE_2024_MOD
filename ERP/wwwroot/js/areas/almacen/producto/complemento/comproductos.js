var tbl_CBPtabla;
var CBP_cmbtipoproducto = $('#CBP_cmbtipoproducto');
var CBP_txtfiltro = document.getElementById('CBP_txtfiltro');
$(document).ready(function () {
    tbl_CBPtabla = $('#tbl_CBPtabla').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        paging: false,
        info:false,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]       
    });
    var obj = {
        top: 10
    };
    fn_CBPListarTipoProducto();
    fn_CBPBuscarDatos(obj);
});

CBP_txtfiltro.addEventListener('keyup', function (e) {
    if (e.key=='Enter') {        
        fn_CBPBuscarDatos();
    }
});
CBP_cmbtipoproducto.change(function () {
    fn_CBPBuscarDatos();
});
function fn_CBPListarTipoProducto() {
    let controller = new ProductoController();
    controller.ListarTipoProducto('CBP_cmbtipoproducto');
}

function fn_CBPBuscarDatos() {  
    var obj = {
        top: 25,
        //codigoproducto: '',
        nombreproducto: CBP_txtfiltro.value.toUpperCase().trim(),
        tipoproducto: CBP_cmbtipoproducto.val()
    };
    let controller = new ProductoController();
    controller.BuscarProductos(obj, fn_CBPLlenarTablas);
}
function fn_CBPLlenarTablas(data) {
    tbl_CBPtabla.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbl_CBPtabla.row.add([
            data[i]['ID'],
            data[i]['CODIGO'],
            '<span class="nombreproducto">' + data[i]['PRODUCTO'] + '</span></br><span class="font-10 abreviaturaproducto">' + data[i]['ABREVIATURA'] + '</span>',                    
            '<span class="tipo">' + data[i]['TIPOPRODUCTO']+'</span>',
            '<span class="um">' + data[i]['UNIDADMEDIDA']+'</span>',
            '<span class="laboratorio">' + data[i]['LABORATORIO']+'</span>',           
            '<button class="btn btn-sm btn-success btnpasarproducto" idproducto="' + data[i]['ID']+'"><i class="fas fa-check"></i></button>'
        ]).draw(false);
    }
}
$('#tbl_CBPtabla tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbl_CBPtabla.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});