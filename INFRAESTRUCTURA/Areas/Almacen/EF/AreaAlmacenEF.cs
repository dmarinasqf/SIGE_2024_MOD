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
    public class AreaAlmacenEF:IAreaAlmacenEF
    {
        private readonly Modelo db;
        public AreaAlmacenEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<AAreaAlmacen>> ListarAsync()
        {            
            var data = await db.AAREAALMACEN.Where(x=>x.estado!="ELIMINADO").ToListAsync();
            return (data);
        }

     
        public async Task<mensajeJson> RegistrarEditarAsync(AAreaAlmacen obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.AAREAALMACEN.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idareaalmacen == 0)
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
                        else if (aux.idareaalmacen == obj.idareaalmacen)
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
            var objverificacion = await db.AALMACENSUCURSAL.Where(x => x.idareaalmacen == id && x.estado == "HABILITADO").ToListAsync();
            if (objverificacion == null)
            {
                var obj = await db.AAREAALMACEN.FirstOrDefaultAsync(m => m.idareaalmacen == id);
                obj.estado = "DESHABILITADO";
                db.Update(obj);
                await db.SaveChangesAsync();
                return (new mensajeJson("ok", obj));
            }
            else
            {
                return (new mensajeJson("No se puede deshabilitar este registro porque afecta a otros registros", null));
            }
        }
    
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.AAREAALMACEN.FirstOrDefaultAsync(m => m.idareaalmacen == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }
    }
}
