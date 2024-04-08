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
    public class TipoProductoEF : ITipoProductoEF
    {
        private readonly Modelo db;

        public TipoProductoEF(Modelo context)
        {
            db = context;
        }
        
        public async Task<List<ATipoProducto>> ListarAsync()
        {            
            return (await db.ATIPOPRODUCTO.Where(x=>x.estado!="ELIMINADO").ToListAsync());
        }        
        public async Task<mensajeJson> RegistrarEditarAsync(ATipoProducto obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.ATIPOPRODUCTO.Where(x => x.idtipoproducto==obj.idtipoproducto).FirstOrDefault();
                //NO TIENE SENTIDO EL IF ELSE
                if (obj.idtipoproducto == "")
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
                    //NO LE ENCUENTRO SENTIDO A ESTE ELSE
                    if (aux is null)
                    {
                        db.Add(obj);
                        //db.Update(obj);
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
                        else if (aux.idtipoproducto == obj.idtipoproducto)
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
        public async Task<mensajeJson> EliminarAsync(string? id)
        {
            var obj = await db.ATIPOPRODUCTO.FirstOrDefaultAsync(m => m.idtipoproducto == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }        
        public async Task<mensajeJson> HabilitarAsync(string? id)
        {
            var obj = await db.ATIPOPRODUCTO.FirstOrDefaultAsync(m => m.idtipoproducto == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
