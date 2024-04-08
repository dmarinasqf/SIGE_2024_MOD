using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IUnidadMedidaEF
    {
        public  Task<List<AUnidadMedida>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AUnidadMedida obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
