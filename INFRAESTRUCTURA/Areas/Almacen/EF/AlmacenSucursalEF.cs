using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
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
    public class AlmacenSucursalEF:IAlmacenSucursalEF
    {
        private readonly Modelo db;

        public AlmacenSucursalEF(Modelo context)
        {
            db = context;
        }

    
        public async Task<AlmacenSucursalModel> ListarModelAsync()
        {
            AlmacenSucursalModel model = new AlmacenSucursalModel();
            model.sucursales=await db.SUCURSAL.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.almacenes = await db.AALMACEN.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.areaalmacenes = await db.AAREAALMACEN.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").OrderBy(x => x.descripcion).ToListAsync();            
            
            return model;
        }

        
        public async Task<mensajeJson> RegistrarEditarAsync(AAlmacenSucursal obj)
        {
            try
            {
                var aux = await db.AALMACENSUCURSAL.Where(x => x.idalmacen == obj.idalmacen && x.suc_codigo == obj.suc_codigo && x.idareaalmacen == obj.idareaalmacen).FirstOrDefaultAsync();
                if (obj.idalmacensucursal == 0)
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
                        else if (aux.idalmacensucursal == obj.idalmacensucursal)
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
            var obj = await db.AALMACENSUCURSAL.FirstOrDefaultAsync(m => m.idalmacensucursal == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }
        
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.AALMACENSUCURSAL.FirstOrDefaultAsync(m => m.idalmacensucursal == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }

        public object BuscarAlmacenxSucursal2(int idsucursal)
        {
            var query = (from AS in db.AALMACENSUCURSAL
                         join A in db.AALMACEN on AS.idalmacen equals A.idalmacen
                         join AR in db.AAREAALMACEN on AS.idareaalmacen equals AR.idareaalmacen
                         where AS.estado=="HABILITADO" && AS.suc_codigo==idsucursal
                         select new
                         {
                             idalmacensucursal=AS.idalmacensucursal,
                             idalmacen=AS.idalmacen,
                             idareaalmacen=AR.idareaalmacen,
                             almacen=A.descripcion,
                             areaalmacen=AR.descripcion,
                             idtipoproducto=A.idtipoproducto
                         }
                         ).ToList();
            return query;
        }
    }
}
