using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IClaseEF
    {
        public  Task<List<AClase>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AClase obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
      
    }
}
