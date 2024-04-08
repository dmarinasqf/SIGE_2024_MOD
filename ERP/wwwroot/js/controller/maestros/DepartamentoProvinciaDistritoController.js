class DepartamentoController {
    constructor() {
        this.dep_codigo = '';
        this.descripcion = '';
        this.estado = '';
    }
    Listar(idcmb,fn) {
        var url = ORIGEN + '/Maestros/DepartamentoProvinciaDistrito/ListarDepartamentos';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].dep_codigo;
                    option.text = data[j].descripcion;                   
                    cmb.appendChild(option);
                }

            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}
class ProvinciaController {
    constructor() {
        this.dep_codigo = '';
        this.pro_codigo = '';
        this.descripcion = '';
        this.estado = '';
    }
    Listar(iddepartamento, idprovincia, idcmb,fn) {
        var url = ORIGEN + '/Maestros/DepartamentoProvinciaDistrito/ListarProvincias?departamento=' + iddepartamento;
        $.post(url).done(function (data) {

            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].pro_codigo;
                    option.text = data[j].descripcion;
                    if (idprovincia.toString() === data[j].pro_codigo.toString())
                        option.selected = true;
                    cmb.appendChild(option);
                }
                //CAMBIOS SEMANA2
                if (idprovincia != '') {
                    cmb.value = idprovincia;
                }

            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}
class DistritoController {
    constructor() {
        this.pro_codigo = '';
        this.dis_codigo = '';
        this.descripcion = '';
        this.estado = '';
    }
    Listar(idprovincia, iddistrito, idcmb, fn) {
        var url = ORIGEN + '/Maestros/DepartamentoProvinciaDistrito/ListarDistritos?provincia=' + idprovincia;
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].dis_codigo;
                    option.text = data[j].descripcion;
                    if (iddistrito.toString() === data[j].dis_codigo.toString())
                        option.selected = true;
                    cmb.appendChild(option);
                }
                //CAMBIOS SEMANA2
                if (iddistrito != '') {
                    cmb.value = iddistrito;
                }

            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}