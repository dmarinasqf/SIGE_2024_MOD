var _LISTAPRODUCTOS = [];
var divgrupodelaboratorios = $('#divgrupodelaboratorios');
var lbllaboratorioproductoproveedor = $('#lbllaboratorioproductoproveedor');
var tblproductosxlaboratoriodeproveedor;
var checktodosPT = $('#checktodosPT');
var txtbuscarlaboratorioproveedor = document.getElementById('txtbuscarlaboratorioproveedor');
var txtbuscarproxlab_pro = document.getElementById('txtbuscarproxlab_pro');
var cmbTipoProducto = document.getElementById('cmbTipoProducto');
var MBPLP_txtidlaboratorio = document.getElementById('MBPLP_txtidlaboratorio');
var tbllaboratoriosproveedor;

var numDecimales = 2;
$(document).ready(function () {
    tblproductosxlaboratoriodeproveedor = $('#tblproductosxlaboratoriodeproveedor').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        info: false,
        paging:false,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]
    });
    tbllaboratoriosproveedor = $('#tbllaboratoriosproveedor').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,      
        "language": LENGUAJEDATATABLE(),
        info: false,    
        paging: false,
        "scrollY": "400px",
        "scrollCollapse": true,
    });
});
txtbuscarlaboratorioproveedor.addEventListener('keyup', function (e) {
    var value = this.value.toUpperCase();
    var tipo = this.getAttribute('tipobusqueda');
    if (e.key == 'Enter')
        fn_MPPLbuscarlaboratorios(tipo,value);
    
});
txtbuscarproxlab_pro.addEventListener('keyup', function (e) {
    var value = $(this).val().toLowerCase(); 
    if (e.key=='Enter')
        listarproductosxlaboratorio()
});
cmbTipoProducto.addEventListener('change', function (e) {
    listarproductosxlaboratorio()
});
function listarlaboratoriosproveedor(laboratorio) {   
    var tipobusquedalab = txtbuscarlaboratorioproveedor.getAttribute('tipobusqueda');
    fn_MPPLbuscarlaboratorios(tipobusquedalab,"");
}

$('#modalproductoproveedorlaboratorio').on('shown.bs.modal', function (e) {
    tbllaboratoriosproveedor.columns.adjust().draw();
});
$(document).on('click', '.MPPbtnbuscarproxlab', function (e) {
    var fila = this.parentNode.parentNode;
    $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
    checktodosPT.prop('checked', false);
    var nombrelaboratorio = fila.getElementsByClassName('laboratorio')[0].innerText;
    lbllaboratorioproductoproveedor.text(nombrelaboratorio);
    var idlaboratorio = fila.getAttribute('idlaboratorio');
    MBPLP_txtidlaboratorio.value = idlaboratorio;
    listarproductosxlaboratorio();
});
function listarproductosxlaboratorio() {
    let controller = new ProductoController();
    var obj = {
        laboratorio: MBPLP_txtidlaboratorio.value,
        top: 15,
        nombreproducto: txtbuscarproxlab_pro.value,
        tipoproducto: cmbTipoProducto.value
    };
    BLOQUEARCONTENIDO("tblproductosxlaboratoriodeproveedor", "Cargando...");
    controller.BuscarProductos(obj,
        function (data) {
            tblproductosxlaboratoriodeproveedor.clear().draw(false);
            if (data.length > 0) {
                var arryVerificacion = data.filter(x => x.CODIGO.includes("IS") || x.CODIGO.includes("IM"));
                if (arryVerificacion.length > 0) {
                    numDecimales = 5;
                }
                for (var i = 0; i < data.length; i++) {
                    tblproductosxlaboratoriodeproveedor.row.add([
                        '<span class="idproducto">' + data[i]['ID'] + '</span>' +
                        '<span class="idlaboratorio">' + data[i]['IDLAB'] + '</span>' +
                        '<span class="idum">' + data[i]['IDUM'] + '</span>' +
                        '<span class="dsc1">' + data[i]['DSC1'] + '</span>' +
                        '<span class="dsc2">' + data[i]['DSC2'] + '</span>' +
                        '<span class="dsc3">' + data[i]['DSC3'] + '</span>',
                        data[i]['CODIGO'],
                        '<span class="nombreproducto">' + data[i]['PRODUCTO'] + '</span></br><span class="font-10">' + data[i]['ABREVIATURA'] + '</span>',
                        data[i]['LABORATORIO'],
                        data[i]['UNIDADMEDIDA'],
                        data[i]['VVF'].toFixed(numDecimales),
                        data[i]['PVF'].toFixed(numDecimales),
                        '<button class="btn btn-sm btn-success btnpasarproductoxlaboratorio"><i class="fas fa-check "></i></button>'
                    ]).draw(false);
                }
                tblproductosxlaboratoriodeproveedor.columns.adjust().draw(false);
            }
            DESBLOQUEARCONTENIDO('tblproductosxlaboratoriodeproveedor');
        });
}
$('#tblproductosxlaboratoriodeproveedor tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
    //var numproformas = tblproformas.rows('.selected').data().length;   
});
checktodosPT.click(function (e) {
    var data = $(this).prop('checked');
    if (data)
        $("#tblproductosxlaboratoriodeproveedor tbody tr").addClass('selected');
    else
        $("#tblproductosxlaboratoriodeproveedor tbody tr").removeClass('selected');
});
function fn_MPPLbuscarlaboratorios(tipo,filtro) {
    if (tipo === 'ALL') {
        let controllerlab = new LaboratorioController();
        controllerlab.BuscarLaboratorios(filtro, function (data) {
            tbllaboratoriosproveedor.clear().draw(false);
            for (var i = 0; i < data.length; i++) {
               var fila= tbllaboratoriosproveedor.row.add([
                    '<label class="laboratorio" > ' + data[i].descripcion + '</label>',
                    '<button class="btn btn-sm btn-dark MPPbtnbuscarproxlab" data-toggle="tooltip" title="BUSCAR PRODUCTOS DEL LABORATORIO"><i class="fas fa-search"></i></button>'+
                    '<button class="btn btn-sm btn-info MPPbtncargartodoxlab" data-toggle="tooltip"  title="CARGAR TODOS LOS PRODUCTOS AL DETALLE"><i class="fas fa-arrow-down"></i></button>'
               ]).draw(false).node();
                fila.setAttribute('idlaboratorio', data[i].idlaboratorio);
                tbllaboratoriosproveedor.columns.adjust().draw();
            }
        });
    } else {
        let controller = new ProveedorController();
        controller.ListarLaboratorios(txtidproveedor.val(), filtro, function (data) {
            tbllaboratoriosproveedor.clear().draw(false);          
            for (var i = 0; i < data.length; i++) {
                var fila = tbllaboratoriosproveedor.row.add([
                    '<label class="laboratorio" > ' + data[i].descripcion + '</label>',
                    '<button class="btn btn-sm btn-dark MPPbtnbuscarproxlab" data-toggle="tooltip" title="BUSCAR PRODUCTOS DEL LABORATORIO"><i class="fas fa-search"></i></button>' +
                    '<button class="btn btn-sm btn-info MPPbtncargartodoxlab" data-toggle="tooltip"  title="CARGAR TODOS LOS PRODUCTOS AL DETALLE"><i class="fas fa-arrow-down"></i></button>'
                ]).draw(false).node();
                fila.setAttribute('idlaboratorio', data[i].idlaboratorio);
                tbllaboratoriosproveedor.columns.adjust().draw();
            }
        });
    }
}

$(document).on('click', '.MPPbtncargartodoxlab', function () {
    swal({
        title: '¿Desea cargar todos los productos del laboratorio?',
        text: 'Puede tomar algunos segundos cargar los datos',
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
            var fila = $(this).parents('tr')[0];
            BLOQUEARCONTENIDO('modalproductoproveedorlaboratorio', 'cargando datos');
            let controller = new ProductoController();
            var obj = {
                laboratorio: fila.getAttribute('idlaboratorio'),
                top: 200
            };
            controller.GetProductosxLaboratorio(obj, (data) => {
             
                DESBLOQUEARCONTENIDO('modalproductoproveedorlaboratorio');
                $('#modalproductoproveedorlaboratorio').modal('hide');
                for (var i = 0; i < data.length; i++) {

                     agregarProductoTerminado(data[i]);
                }                
                agregarindex();
                calcularmontos();
                calcularTotal();


            }, () => {
                DESBLOQUEARCONTENIDO('modalproductoproveedorlaboratorio');
            });
           
        }
        else
            swal.close();
    });
    
   
});