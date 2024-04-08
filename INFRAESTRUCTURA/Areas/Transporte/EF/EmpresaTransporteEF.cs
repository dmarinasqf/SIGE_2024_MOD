using ENTIDADES.Transporte;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Transporte.EF
{
   public class EmpresaTransporteEF:IEmpresaTransporteEF
    {
        private readonly Modelo db;
        public EmpresaTransporteEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<TEmpresa>> ListarAsync()
        {
            return await db.TEMPRESA.Where(x => x.estado != "ELIMINADO").ToListAsync();
        }

        public async Task<List<TEmpresa>> ListarHabilitadosAsync()
        {
            return await db.TEMPRESA.Where(x => x.estado == "HABILITADO").ToListAsync();
        }

        public async Task<mensajeJson> RegistrarEditarAsync(TEmpresa obj)
        {
            try
            {
                obj.razonsocial = obj.razonsocial.ToUpper();
                var aux = db.TEMPRESA.Where(x => x.ruc == obj.ruc).FirstOrDefault();
                if (obj.idempresa == 0)
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
                        else if (aux.idempresa == obj.idempresa)
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
            var obj = await db.TEMPRESA.FirstOrDefaultAsync(m => m.idempresa == id);
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
            var obj = await db.TEMPRESA.FirstOrDefaultAsync(m => m.idempresa == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }
    }
}
