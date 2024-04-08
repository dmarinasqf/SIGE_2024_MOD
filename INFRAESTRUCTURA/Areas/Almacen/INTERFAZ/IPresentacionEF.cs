using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IPresentacionEF
    {
        public  Task<List<AProductoPresentacion>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AProductoPresentacion obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
