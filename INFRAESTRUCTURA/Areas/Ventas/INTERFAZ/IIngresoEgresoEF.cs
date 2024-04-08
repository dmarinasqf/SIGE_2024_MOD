using ENTIDADES.finanzas;
using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.INTERFAZ
{
    public interface IIngresoEgresoEF
    {
        public  Task<mensajeJson> RegistrarEgresoAsync(EgresoCaja egreso);
        public List<FTipoEgreso> ListarTipoEgresos();
    }
}
