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
 public  class AlmacenEF:IAlmacenEF
    {
        private readonly Modelo db;
        public AlmacenEF(Modelo context)
        {
            db = context;
        }        
        public async Task<List<AAlmacen>> ListarAsync()
        {
            return await db.AALMACEN.Where(x=>x.estado!="ELIMINADO").ToListAsync();          
        }

        
        public async Task<mensajeJson> RegistrarEditarAsync(AAlmacen obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.AALMACEN.Where(x => x.descripcion == obj.descripcion && x.idtipoproducto==obj.idtipoproducto).FirstOrDefault();
                //var aux1 = db.AALMACEN.Where(x => x.tipoalmacen == obj.tipoalmacen).FirstOrDefault();
                if (aux is null)
                {
                    if (obj.idalmacen == 0)
                    {
                        if ((aux is null))
                        {
                            db.Add(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        else                                                                               
                            return (new mensajeJson("El registro ya existe", null));                        
                    }
                    else
                    {
                        var real = db.AALMACEN.Find(obj.idalmacen);
                        if (aux is null)
                        {
                            obj.idtipoproducto = real.idtipoproducto;
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }                       
                            else
                                return (new mensajeJson("El registro ya existe", null));                        
                    }
                }
                else
                {
                    return (new mensajeJson("Ya existe un registro con los mismos datos", null));
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }

        
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var objverificacion = await db.AALMACENSUCURSAL.Where(x => x.idalmacen == id && x.estado == "HABILITADO").ToListAsync();
            if (objverificacion == null)
            {
                var obj = await db.AALMACEN.FirstOrDefaultAsync(m => m.idalmacen == id);
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
            var obj = await db.AALMACEN.FirstOrDefaultAsync(m => m.idalmacen == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }

        public async Task<AlmacenModel> ListarModelAsync()
        {
            AlmacenModel model = new AlmacenModel();
            model.tipoproductos = await db.ATIPOPRODUCTO.Where(x => x.estado == "HABILITADO").ToListAsync();
            return model;
        }
    }
}
