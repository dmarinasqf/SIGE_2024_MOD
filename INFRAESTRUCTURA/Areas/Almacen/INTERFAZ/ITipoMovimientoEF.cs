using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface ITipoMovimientoEF
    {
        public  Task<List<ATipoMovimiento>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(ATipoMovimiento obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);
    }
}
