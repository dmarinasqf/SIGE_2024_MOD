using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
    public class ConstanteEF:IConstanteEF
    {
        private readonly Modelo db;

        public ConstanteEF(Modelo context)
        {
            db = context;
        }
        
        public async Task<List<Constante>> ListarAsync()
        {
            var data = await db.CCONSTANTE.ToListAsync();
            data = data.OrderBy(x=>x.categoria).ToList();
            return (data);
        }
        
        public async Task<mensajeJson> EditarAsync(Constante obj)
        {
            try
            {
                var constante = db.CCONSTANTE.Find(obj.idconstante);
                constante.valor = obj.valor;
                db.Update(constante);
                await db.SaveChangesAsync();
                return (new mensajeJson("ok", constante));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
    }
}
