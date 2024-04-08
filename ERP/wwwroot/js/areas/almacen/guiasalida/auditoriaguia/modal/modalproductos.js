var MD_tblproductos;
var MDP_txtidproducto = $('#MDP_txtidproducto');
var MDP_txtalmacen = $('#MDP_txtalmacen');
var MDP_txtsucursal = $('#MDP_txtsucursal');
var MDP_cantidadenviar = $('#MDP_cantidadenviar');
var MDP_txtfaltante = $('#MDP_txtfaltante');

$(document).ready(function () {
    MD_tblproductos = $('#MD_tblproductos').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            },
        ]
    });
});

$('#MDP_txtlote').on('change keyup keypress',function () {
    let obj = $('#MDP_form-registro').serializeArray();
    console.log(obj);
    MD_tblproductos.clear().draw(false);
    let controller = new ProductoController();
    controller.BuscarProductoDistribucion(obj, MD_cargarproductosxlote);
});

//$('#MDP_form-registro').submit(function (e) {
//    e.preventDefault();

//    let obj = $('#MDP_form-registro').serializeArray();
//    console.log(obj);
//});

function MD_cargarproductosxlote(data) {
    
    console.log(data);
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        for (let i = 0; i < datos.length; i++) {
            MD_tblproductos.row.add([
                datos[i]["IDSTOCK"],
                datos[i]["IDPRODUCTO"],
                datos[i]["CODIGO"],
                datos[i]["PRODUCTO"],
                datos[i]["LOTE"],
                datos[i]["FECHAVENCE"],
                datos[i]["DISPONIBLE"],
                `<input type="number" class="text-center inputselection cantidadpickingstock" style="width:100px;" value="0" min="0" max="` + datos[i]["DISPONIBLE"]+`" />`,
            ]).draw(false);
        }
    }
    else {
        mensaje("W", data.mensaje);
    }
}

$(document).on('change keyup', '.cantidadpickingstock', function () {
    let cantidad = $(this).val();
    let maximo = $(this).attr('max');
    if (cantidad === '' || cantidad === 0) { cantidad = 0; $(this).val(0); }
    let stockenviar = parseFloat(MDP_cantidadenviar.val());
    let total = MD_calcularmontos();
    let diferencia = stockenviar - total;
    
    let subtotal = total - cantidad;
    let faltante = stockenviar - subtotal;
    if (diferencia < 0) {
        mensaje("I", "Usted solo cuenta con <strong>" + faltante + "</strong> Unidades");
        if (parseInt(faltante) <= parseInt(maximo))
            $(this).val(faltante);
        else
            $(this).val(maximo);
    } else {
        if (parseInt(cantidad) <= parseInt(maximo))
            $(this).val(cantidad);
        else
            $(this).val(maximo);
    }
    
    let restante = stockenviar - MD_calcularmontos();
    MDP_txtfaltante.val(restante);
});
//SUMA LAS CANTIDADES DE LA TABLA
function MD_calcularmontos() {
    let filas = document.querySelectorAll("#MD_tblproductos tbody tr");
    let c = 0;
    let total = 0.0;
    let datatable = MD_tblproductos.rows().data().length;
    if (datatable > 0)
        filas.forEach(function (e) {
            cantidad = parseFloat(document.getElementsByClassName("cantidadpickingstock")[c].value);
            if (isNaN(cantidad) || cantidad < 1) {
                document.getElementsByClassName("cantidadpickingstock")[c].value = "0";
                cantidad = 0;
            }
            total += cantidad;
            c++;
        });
    return total;
}