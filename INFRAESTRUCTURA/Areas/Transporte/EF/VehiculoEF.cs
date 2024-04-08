using ENTIDADES.Transporte;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Transporte.EF
{
   public class VehiculoEF : IVehiculoEF
    {
        private readonly Modelo db;
        public VehiculoEF(Modelo context)
        {
            db = context;
        }
        public async Task<mensajeJson> ListarVehiculoxEmpresaAsync(int? idempresa )
        {
            try
            {
                var data= await db.TVEHICULO.Where(x => x.idempresa == idempresa && x.estado != "ELIMINADO").ToListAsync();
                return new mensajeJson("ok",data);
            }catch(Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> BuscarVehiculoxIdAsync(int? id )
        {
            try
            {
                var data= await db.TVEHICULO.Where(x => x.idvehiculo == id && x.estado != "ELIMINADO").FirstOrDefaultAsync();
                if(data is null)
                    return new mensajeJson("not found", null);
                else
                return new mensajeJson("ok",data);
            }catch(Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> RegistrarEditarAsync(TVehiculo obj)
        {
            try
            {
                obj.matricula = obj.matricula.ToUpper();
                var aux = db.TVEHICULO.Where(x => x.matricula == obj.matricula).FirstOrDefault();
                if (obj.idvehiculo == 0)
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
                        else if (aux.idvehiculo == obj.idvehiculo)
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
        public async Task<mensajeJson> DeshabilitarAsync(int? id)
        {
            var obj = await db.TVEHICULO.FirstOrDefaultAsync(m => m.idvehiculo == id);
            if (obj == null)
            {
                return (new mensajeJson("No se encontró el registro", null));

            }
            else
            {
                obj.estado = "DESHABILITADO";
                db.Update(obj);
                await db.SaveChangesAsync();
                return (new mensajeJson("ok", obj));
            }
        }

        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.TVEHICULO.FirstOrDefaultAsync(m => m.idvehiculo == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }

       
    }
}
