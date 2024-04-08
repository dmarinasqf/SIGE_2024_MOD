using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
    public interface IConstanteEF
    {
        public  Task<List<Constante>> ListarAsync();
        public  Task<mensajeJson> EditarAsync(Constante obj);
    }
}
