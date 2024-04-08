class CategoriaAOController {
    // requiere int id,string descripcion,string estado
    registrar(params, fn) {
        var url = ORIGEN + "/Preingreso/PICategoriaAO/RegistrarEditar";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }
    //requiere: int id
    deshabilitar(id, fn) {
        var url = ORIGEN + "/Preingreso/PICategoriaAO/Deshabilitar/" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    habilitar(id, fn) {
        var url = ORIGEN + "/Preingreso/PICategoriaAO/Habilitar/" + id;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarHabilitados(fn) {
        var url = ORIGEN + "/PreIngreso/PICategoriaAO/ListarHabilitados";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    LlenarComboCategoriaAO(cmb, fn) {
        var url = ORIGEN + "/PreIngreso/PICategoriaAO/ListarHabilitados";
        $.get(url).done(function (data) {
            console.log(data);
            let datos = data.objeto;
            if (cmb != '' && cmb != null) {
                var combo = document.getElementById(cmb);
                combo.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                combo.appendChild(option);
                for (var i = 0; i < datos.length; i++) {
                    option = document.createElement('option');
                    option.text = datos[i].descripcion;
                    option.value = datos[i].idcategoriaao;
                    combo.appendChild(option);
                }
                if (fn != null && fn != '')
                    fn(data);
            } else
                fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }

}

async function ListarHabilitados() {
    var url = ORIGEN + "/PreIngreso/PICategoriaAO/ListarHabilitados";
    try {
        return data = await $.post(url).done(function (data) {          
        }).fail(function (data) {           
            mensajeError(data);
        });
    } catch (error) { mensajeError(error);console.log(error); }
}