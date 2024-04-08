using ENTIDADES.finanzas;
using ENTIDADES.ventas;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.EF
{
  public   class IngresoEgresosEF: IIngresoEgresoEF
    {
        private readonly Modelo db;
      
        public IngresoEgresosEF(Modelo _db)
        {
            db = _db;          
        }
        public async Task<mensajeJson> RegistrarEgresoAsync(EgresoCaja egreso)
        {
            try
            {
                egreso.estado = "HABILITADO";
                egreso.fecha = DateTime.Now;
                db.EGRESOS.Add(egreso);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", egreso);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
            
        }
      public List<FTipoEgreso> ListarTipoEgresos()
        {
            return db.TIPOEGRESO.Where(x => x.estado == "HABILITADO").ToList();
        }
    }
}
