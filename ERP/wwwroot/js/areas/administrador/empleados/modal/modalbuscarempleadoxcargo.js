var MMtblrepmedicos;
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    MMtblrepmedicos = util.Datatable('MMtblrepmedicos', false, datatable);
    
  //  MMfnlistarRepresentanteMedico();
});

//listado de los datos de las tablas
function MMfnlistarRepresentanteMedico(cargos) {

    let controller = new EmpleadoController();
    var obj = {
        cargos: cargos
    }
    controller.ListarEmpleadosxCargo(obj, (data) => {
       
        for (var i = 0; i < data.length; i++) {
            var fila = MMtblrepmedicos.row.add([
                data[i].documento,
                data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno,
                data[i].local,
                '<button class="btn  btn-success btn-sm btnselectempleadoxcargo"><i class="fas fa-check fa-1x"></i></button>'
            ]).draw(false).node();
            fila.setAttribute('id', data[i].idempleado);
            fila.getElementsByTagName('td')[0].classList.add('documento');
            fila.getElementsByTagName('td')[1].classList.add('nombres');            
            
        }
       
    });
}


