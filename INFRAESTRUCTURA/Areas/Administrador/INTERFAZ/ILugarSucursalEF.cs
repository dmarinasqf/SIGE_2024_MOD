using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
    public interface ILugarSucursalEF
    {

        public  Task<List<LugarSucursal>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(LugarSucursal obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
