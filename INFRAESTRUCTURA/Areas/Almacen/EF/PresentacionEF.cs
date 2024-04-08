using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class PresentacionEF:IPresentacionEF
    {
        private readonly Modelo db;

        public PresentacionEF(Modelo context)
        {
            db = context;
        }      
        public async Task<List<AProductoPresentacion>> ListarAsync()
        {         
            return (await db.APRODUCTOPRESENTACION.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }        
        public async Task<mensajeJson> RegistrarEditarAsync(AProductoPresentacion obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.APRODUCTOPRESENTACION.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idpresentacion == 0)
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
                        else if (aux.idpresentacion == obj.idpresentacion)
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
            var obj = await db.APRODUCTOPRESENTACION.FirstOrDefaultAsync(m => m.idpresentacion == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
