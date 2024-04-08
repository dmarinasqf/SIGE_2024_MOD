class PublicController {
    ListarSucursalxEmpresa(cmb, idempresa, idsucursal,fn) {
        var url = ORIGEN + '/Public/ListarSucursalxEmpresa';
        var obj = {
            idempresa: idempresa,
            tiposucursal:'TODOS'
        }
        $.post(url,obj).done(function (data) {
            if (cmb == '' || cmb == null) {
                fn(data);
                return;
            }
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            //option.text = '[SELECCIONE]';
            //option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idsucursal;                  
                combo.appendChild(option);
            }
            combo.value = idsucursal;

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetDatosSucursalEmpresaxUserName(obj, fn) {
        var url = ORIGEN + '/Public/GetDatosSucursalEmpresaxUserName';      
        $.post(url,obj).done(function (data) {
            if (data.mensaje=='ok') 
                fn(data.objeto);                      
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}