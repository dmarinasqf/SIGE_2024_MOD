var tbllista;
var formregistro = document.getElementById('formregistro');
var btnguardar = document.getElementById('btnguardar');
var btnlimpiar = document.getElementById('btnlimpiar');
var btnnuevoregistro = document.getElementById('btnnuevoregistro');
var btnconsultar = document.getElementById('btnconsultar');

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = false;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    fnlistar();
});

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    let controller = new ObjetivoController();

    var date = new Date(formregistro.fechainicio.value.toString().replace('-','/') + '/01');   
    console.log(date);
    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var obj = $('#formregistro').serializeArray();
    //obj[obj.length] = { name: 'fechainicio', value: moment(primerDia).format("DD-MM-YYYY") };
    //obj[obj.length] = { name: 'fechavence', value: moment(ultimoDia).format("DD-MM-YYYY") };
    obj[obj.length] = { name: 'fechainicio', value: moment(primerDia).format("YYYY-MM-DD") };
    obj[obj.length] = { name: 'fechavence', value: moment(ultimoDia).format("YYYY-MM-DD") };
    obj[obj.length] = { name: 'estado', value: 'HABILITADO' };
    btnguardar.disabled = true;
    
    var dataobj = { objetivo: CONVERT_FORM_TO_JSON(obj) };
    console.log(dataobj);
    controller.RegistrarEditar(dataobj, () => {
        btnguardar.disabled = false;
        formregistro.reset();
        fnlistar();
    }, () => { btnguardar.disabled = false; });
});
formregistro.addEventListener('reset', function () {
    formregistro.idobjetivo.value = '';
})
btnnuevoregistro.addEventListener('click', function () {
    $('#modalregistro').modal('show');
    formregistro.reset();
});
btnconsultar.addEventListener('click', function () {
    fnlistar();
});
$(document).on('click', '.btneditar', function () {
    var fila = this.parentNode.parentNode.parentNode;
    formregistro.idobjetivo.value = fila.getAttribute('id');
    formregistro.descripcion.value = fila.getElementsByClassName('descripcion')[0].innerText;
    var fechainicio = fila.getElementsByClassName('fechainicio')[0].innerText.split('/').reverse();   
    formregistro.fechainicio.value = fechainicio[0] + '-' + fechainicio[1];
    $('#modalregistro').modal('show');
});

$(document).on('click', '.btneliminar', function () {
    var event = this;
    swal({
        title: '¿Desea eliminar?',
        text: "",
        type: 'warning',
        class: 'text-center',
        icon: 'warning',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            var fila = this.parentNode.parentNode.parentNode;
            let controller = new ObjetivoController();
            
            controller.ElimnarObjetivo(fila.getAttribute('id'), () => {
                tbllista.row($(event).parents('tr')).remove().draw(false);
            });
        }
        else
            swal.close();
    });
   
});

function fnlistar() {
    if (FECHAINICIO == '') {
        date = new Date();
        primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        FECHAINICIO = moment(primerDia).format('DD/MM/YYYY');
        FECHAFIN = moment(ultimoDia).format('DD/MM/YYYY');
    }
    var obj = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN
    };
    let controller = new ObjetivoController();
    controller.ListarObjetivos(obj, (data) => {
        tbllista.rows().clear();
        for (var i = 0; i < data.length; i++) {
            var fila = tbllista.row.add([
                
                data[i].descripcion,
                moment(data[i].fechainicio).format("DD/MM/YYYY"),
                moment(data[i].fechavence).format("DD/MM/YYYY"),
                (data[i].fechacreacion),
                '<div class=" btn-group btn-group-sm" ><button class="btn  btn-warning btn-sm btneditar"><i class="fas fa-edit fa-1x"></i></button>' +
                '<button class="btn btn-sm btn-danger btneliminar"><i class="fas fa-trash-alt fa-1x"></i></button></div>'
            ]).draw(false).node();
            fila.setAttribute('id', data[i].objrepm_codigo);
            fila.getElementsByTagName('td')[0].classList.add('descripcion');
            fila.getElementsByTagName('td')[1].classList.add('fechainicio');
        }
    });
}
