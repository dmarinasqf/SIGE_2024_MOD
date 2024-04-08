using ENTIDADES.finanzas;
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
   public  class BancoEF:IBancoEF
    {
        private readonly Modelo db;

        public BancoEF(Modelo context)
        {
            db = context;
        }
      
        public async Task<List<FBanco>> ListarAsync()
        {            
            return (await db.FBANCO.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        public async Task<List<FTipoTarjeta>> ListarTipoTarjetaAsync()
        {            
            return (await db.FTIPOTARJETA.Where(x => x.estado == "HABILITADO").ToListAsync());
        }
        public async Task<object> ListarBancosHabilitadosAsync()
        {            
            return (await db.FBANCO.Where(x => x.estado == "HABILITADO").Select(x=>new { x.idbanco,x.descripcion}).ToListAsync());
        }
        public async Task<object> ListarCuentasHabilitadosAsync(int idbanco)
        {            
            return (await db.FCUENTA.Where(x => x.estado == "HABILITADO" &&x.idbanco==idbanco).Select(x=>new { x.idcuenta,x.descripcion}).ToListAsync());
        }
        
        public async Task<mensajeJson> RegistrarEditarAsync(FBanco obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.FBANCO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idbanco == 0)
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
                        else if (aux.idbanco == obj.idbanco)
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
            var obj = await db.FBANCO.FirstOrDefaultAsync(m => m.idbanco == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
