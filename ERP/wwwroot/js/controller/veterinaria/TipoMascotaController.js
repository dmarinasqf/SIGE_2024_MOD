class TipoMascotaController {
    Listar(cmb, fn) {
        var url = ORIGEN + '/Veterinaria/Maestro/ListarTipoMascota';
        $.post(url).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idtipomascota;              
                combo.appendChild(option);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
}