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
    public class TipoMovimientoEF: ITipoMovimientoEF
    {
        private readonly Modelo db;

        public TipoMovimientoEF(Modelo context)
        {
            db = context;
        }
        
        public async Task<List<ATipoMovimiento>> ListarAsync()
        {            
            return (await db.ATIPOMOVIMIENTO.Where(x=>x.estado!="ELIMINADO").ToListAsync());
        }        
        public async Task<mensajeJson> RegistrarEditarAsync(ATipoMovimiento obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.ATIPOMOVIMIENTO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idtipomovimiento == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "DESHABILITADO")
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
                        if (aux.estado == "DESHABILITADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.idtipomovimiento == obj.idtipomovimiento)
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
            var obj = await db.ATIPOMOVIMIENTO.FirstOrDefaultAsync(m => m.idtipomovimiento == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }        
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.ATIPOMOVIMIENTO.FirstOrDefaultAsync(m => m.idtipomovimiento == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
