using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface ITemperaturaEF
    {
        public  Task<List<ATemperatura>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(ATemperatura obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);
    }
}
