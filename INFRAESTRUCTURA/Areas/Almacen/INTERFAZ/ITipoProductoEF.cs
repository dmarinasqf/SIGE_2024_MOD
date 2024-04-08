using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface ITipoProductoEF
    {
        public  Task<List<ATipoProducto>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(ATipoProducto obj);
        public  Task<mensajeJson> EliminarAsync(string id);
        public  Task<mensajeJson> HabilitarAsync(string id);
    }
}
