using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.INTERFAZ
{
    public interface IPaisEF
    {

        public  Task<List<Pais>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(Pais obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
