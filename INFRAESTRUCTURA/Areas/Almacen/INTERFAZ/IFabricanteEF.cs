using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IFabricanteEF
    {
        public  Task<List<AFabricante>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AFabricante obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
