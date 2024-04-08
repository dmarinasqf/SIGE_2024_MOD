using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
    public class RangoMuestraAOEF : IRangoMuestraAOEF
    {
        private readonly Modelo db;      

        public RangoMuestraAOEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<PIRangoMuestraAO>> ListarAsync()
        {
            return (await db.PIRANGOMUESTRAAO.ToListAsync());
        }
        public async Task<mensajeJson> RegistrarEditarAsync(PIRangoMuestraAO obj)
        {
            try
            {
                
                if (obj.idrango == 0)
                {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", obj);
                }
                else
                {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok-habilitado", obj);
                }
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.PIRANGOMUESTRAAO.FirstOrDefaultAsync(m => m.idrango == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return new mensajeJson("ok", obj);

        }       
        
        public async Task<mensajeJson> BuscarAsync(int id)
        {
            try
            {
                var data = await db.PIRANGOMUESTRAAO.FindAsync(id);
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> ListarHabilitadoAsync()
        {
            try
            {
                var data = await db.PIRANGOMUESTRAAO.Where(x => x.estado == "HABILITADO").ToListAsync();
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        
    }
}
