using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IFormaFarmaceuticaEF
    {
        public  Task<List<AFormaFarmaceutica>> ListarAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(AFormaFarmaceutica obj);
    }
}
