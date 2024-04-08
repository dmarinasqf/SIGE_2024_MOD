using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IPrincipioActivoEF
    {
        public  Task<List<APrincipioActivo>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(APrincipioActivo obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> HabilitarAsync(int? id);
        public object BuscarRegistros(string filtro, int top);
    }
}
