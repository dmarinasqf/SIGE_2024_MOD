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
    public class AccionFarmacologicaEF:IAccionFarmacologicaEF
    {
        private readonly Modelo db;

        public AccionFarmacologicaEF(Modelo context)
        {
            db = context;
        }

    
        public async Task<List<AAccionFarmacologica>> ListarAsync()
        {          
            return (await db.AACCIONFARMACOLOGICA.Where(x=>x.estado!="ELIMINADO").ToListAsync());
        }
      
        public async Task<mensajeJson> RegistrarEditarAsync(AAccionFarmacologica obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.AACCIONFARMACOLOGICA.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idaccionfarma == 0)
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
                        else if (aux.idaccionfarma == obj.idaccionfarma)
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
            var obj = await db.AACCIONFARMACOLOGICA.FirstOrDefaultAsync(m => m.idaccionfarma == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.AACCIONFARMACOLOGICA.FirstOrDefaultAsync(m => m.idaccionfarma == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<List<AAccionFarmacologica>> ListarAccionesFarmaHabilitadasAsync()
        {
          
            var data = await db.AACCIONFARMACOLOGICA.Where(x => x.estado == "HABILITADO").ToListAsync();
            return (data);
        }
    }
}
