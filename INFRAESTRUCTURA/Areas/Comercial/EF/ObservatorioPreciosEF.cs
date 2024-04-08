using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.EF
{
   
    public class ObservatorioPreciosEF: IObservatorioPreciosEF
    {
        private readonly Modelo db;
        public ObservatorioPreciosEF(Modelo db_)
        {
            db = db_;
        }
        public async Task<mensajeJson> ActualizarPreciosDigemidAsync(List<AProductoDigemid> productos)
        {
            try
            {
                db.UpdateRange(productos);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }
        }
    }
}
