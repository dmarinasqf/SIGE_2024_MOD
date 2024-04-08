using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IConsumoEconomatoEF
    {
        public Task<mensajeJson> RegistrarConsumoEconomatoAsync(AConsumoEconomato obj);
    }
}
