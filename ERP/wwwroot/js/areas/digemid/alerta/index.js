var btnnuevo = document.getElementById('btnnuevo');
var divdatos = document.getElementById('divdatos');
var formregistro = document.getElementById('formregistro');
var btnguardar = document.getElementById('btnguardar');

$(document).ready(function () {
    fnlistardatos();
});
function fnlistardatos(numpagina,tammano) {
    var obj = {
        pagine: {
            tamanopagina: tammano ?? 20,
            numpagina: numpagina ?? 1
        }
    };
    let controller = new AlertaController();
    controller.ListarAlertas(obj, (response) => {
        var data = response.dataobject;
        var item = '';
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            item += `<div class="alert bgc-secondary-l3  border-l-4 brc-blue ">
                       
                            <div class="row">
                                <div  class="col-xl-8"> <h6>`+ data[i].nombre + `</h6></div>
                                <div  class="col-xl-4 text-right ">Fecha Creación <small>`+ moment(data[i].fechacreacion).format('DD/MM/YYYY hh:mm') +`</small></div>
                                <div class="col-xl-12">                                    
                                    <h5><a class="linkregistro text-uppercase" download  href="/archivos/digemid/alertas/`+data[i].archivo+`">`+ data[i].descripcion + `</a></h5>
                                   
                                </div>
                                <div  class="col-xl-6"> <strong>`+ moment(data[i].fecha).format('DD/MM/YYYY') +`</strong></div>
                                <div  class="col-xl-6 text-right "> <a href="#" id=`+ data[i].idalerta +` class="linkeditar">Editar</a></div>
                            </div>
                        </div>`;
        }
        divdatos.innerHTML = item;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');
    });
  
}
$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnlistardatos(numpagina, 20);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
$(document).on('click', '.linkeditar', function () {
    var id = this.getAttribute('id');
    let controller = new AlertaController();
    controller.BuscarAlerta(id, function (data) {
        $('#modalregistro').modal('show');
        formregistro.idalerta.value = data.idalerta;
        formregistro.nombre.value = data.nombre;
        formregistro.descripcion.value = data.descripcion;
        formregistro.fecha.value = moment(data.fecha??'').format('YYYY-MM-DD');

        console.log(data);;
    });
});
btnnuevo.addEventListener('click', function () {
    $('#modalregistro').modal('show');
    limpiar();
});
formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
   
    var obj = new FormData(); 
    obj.append("alerta.idalerta", formregistro.idalerta.value );
    obj.append("alerta.nombre",formregistro.nombre.value );
    obj.append("alerta.descripcion",formregistro.descripcion.value );
    obj.append("alerta.fecha",formregistro.fecha.value );
    obj.append("archivo", formregistro.archivo.files[0]);
 
    console.log(obj);
    btnguardar.disabled = true;
    let controller = new AlertaController();
    controller.RegistrarEditarAlerta(obj, () => {
        btnguardar.disabled = false;
        mensaje('S', 'Registro guardado');
        $('#modalregistro').modal('hide');
        limpiar();
        fnlistardatos();
    }, () => { btnguardar.disabled = false;});
   
});
function limpiar() {
    formregistro.reset();
    formregistro.idalerta = '';
    formregistro.archivo.value = '';
  

}