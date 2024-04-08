var MALcmblaboratorio = document.getElementById('MALcmblaboratorio');
var MALtxtdesqf = document.getElementById('MALtxtdesqf');
var MALtxtdesproveedor = document.getElementById('MALtxtdesproveedor');
var MALbtnagregar = document.getElementById('MALbtnagregar');


$(document).ready(function () {
    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();
    $('#MALcmblaboratorio').select2({
        allowClear: true,
        width:'100%',
        ajax: fn
    })
   
});
function MALfnagregarproductos() {
    let controller = new ProductoController();
    var obj = {
        laboratorio: MALcmblaboratorio.value,
        top:200
    };
    controller.GetProductosxLaboratorio(obj, (data) => {

        for (var i = 0; i < data.length; i++) {
            var filas = document.querySelectorAll('#tbodyproductos tr');
           
            if (!fnverificarsiseencuentraendetalle(data[i].idproducto)) {
              
                var obj = {
                    idproducto: data[i].idproducto,
                    codigoproducto: data[i].codigoproducto,
                    nombre: data[i].producto,
                    laboratorio: data[i].laboratorio,
                    vvf: data[i].vvf ?? 0

                };
                var index = (_productos.length);
                var fila = '<tr idproducto="' + obj.idproducto + '" index="' + index + '">';
                fila += '<td>' + fncomboproductoprimario(filas.length) + '</td>';
                fila += '<td >' + obj.codigoproducto + '</td>';
                fila += '<td class="nombrepro">' + obj.nombre + '</td>';
                fila += '<td>' + obj.laboratorio + '</td>';
                fila += '<td><input class="cantidad inputdetalle" value="1" disabled/></td>';
                fila += '<td class="preciocompra">' + (obj.vvf ?? 0) + '</td>';
                fila += '</tr>';
                _productos.push(obj);
                tbodyproductos.innerHTML = tbodyproductos.innerHTML + fila;
                MALfnagregararraydescuentos(obj.idproducto, index);
            } else
                mensaje('I', 'El item ya se encuentra en el detalle');           
           
        }           
    });
}

MALbtnagregar.addEventListener('click', function () {
    if (MALcmblaboratorio.value == '')
        return;
    $('#modalproductosxlaboratorio').modal('hide');
    MALfnagregarproductos();
});
function MALfnagregararraydescuentos(idproducto,index) {
    var listas = '';
    for (var i = 0; i < _listas.length; i++)
        listas += _listas[i].split('/')[0] + '|';
    
    let controller = new ListaPreciosController();
    var obj = {
        idproducto: idproducto,
        listas: listas
    };
    if (MALtxtdesproveedor.value > 0 || MALtxtdesqf.value > 0) {
        controller.ListarPreciosxListasyProducto(obj, function (data) {
            var array = [];
            for (var i = 0; i < data.length; i++) {
                var desp = parseFloat(MALtxtdesproveedor.value) ?? 0;
                var desqf = parseFloat(MALtxtdesqf.value) ?? 0;
                if (isNaN(desp))   desp = 0;
                if (isNaN(desqf)) desqf = 0;
                var descuento = desp + desqf;
                var obj = new ListaDescuento();
                obj.pventa = parseFloat((data[i].precio ?? 0));
                obj.desproveedor = MALtxtdesproveedor.value;
                obj.dessucursal = MALtxtdesqf.value;
                obj.nombrelista = data[i].lista;
                obj.preciofinal = obj.pventa-( obj.pventa * descuento)/100 ;
                obj.idlista = data[i].idlistaprecio ;
                obj.tipodescuento = '';
                
                array.push(obj);
            }
            _descuentos.push({ index: index, data: array });
           
        });
    }
    console.log(listas)
}