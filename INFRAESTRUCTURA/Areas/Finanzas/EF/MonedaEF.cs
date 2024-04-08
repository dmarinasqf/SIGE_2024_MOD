using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.EF
{
  public   class MonedaEF:IMonedaEF
    {
        private readonly Modelo db;

        public MonedaEF(Modelo context)
        {
            db = context;
        }

        
        public async Task<List<FMoneda>> ListarAsync()
        {
            
            return (await db.FMONEDA.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        public async Task<List<FMoneda>> ListarHabilitadosAsync()
        {
            
            return (await db.FMONEDA.Where(x => x.estado =="HABILITADO").ToListAsync());
        }
        
        public async Task<mensajeJson> RegistrarEditarAsync(FMoneda obj)
        {
            try
            {
                obj.nombre = obj.nombre.ToUpper();
                var aux = db.FMONEDA.Where(x => x.nombre == obj.nombre).FirstOrDefault();
                if (obj.idmoneda == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", aux));
                        }
                        else
                            return (new mensajeJson("El registro ya existe", null));

                    }
                }
                else
                {
                    if (aux is null)
                    {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.idmoneda == obj.idmoneda)
                        {
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        else
                            return (new mensajeJson("El registro ya existe", null));
                    }
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.FMONEDA.FirstOrDefaultAsync(m => m.idmoneda == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
