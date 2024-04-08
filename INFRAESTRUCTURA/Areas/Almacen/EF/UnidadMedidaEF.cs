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
  public  class UnidadMedidaEF:IUnidadMedidaEF
    {
        private readonly Modelo db;

        public UnidadMedidaEF(Modelo context)
        {
            db = context;
        }
        
        public async Task<List<AUnidadMedida>> ListarAsync()
        {            
            return (await db.AUNIDADMEDIDA.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        
        public async Task<mensajeJson> RegistrarEditarAsync(AUnidadMedida obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.AUNIDADMEDIDA.Where(x => x.abreviatura == obj.abreviatura).FirstOrDefault();
                if (obj.idunidadmedida == 0)
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
                        else if (aux.idunidadmedida == obj.idunidadmedida)
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
            var obj = await db.AUNIDADMEDIDA.FirstOrDefaultAsync(m => m.idunidadmedida == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}

