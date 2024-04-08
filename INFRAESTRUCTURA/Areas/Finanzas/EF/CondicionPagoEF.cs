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
    public class CondicionPagoEF:ICondicionPagoEF
    {
        private readonly Modelo db;
        public CondicionPagoEF(Modelo context)
        {
            db = context;
        }

        
        public async Task<List<FCondicionPago>> ListarAsync()
        {            
            var data = await db.CCONDICIONPAGO.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").ToListAsync();
            return (data);
        }
        
        public async Task<List<FCondicionPago>> ListarHabilitadasAsync()
        {            
            var data = await db.CCONDICIONPAGO.Where(x => x.estado == "HABILITADO" ).ToListAsync();
            return (data);
        }

        
        public async Task<mensajeJson> RegistrarEditarAsync(FCondicionPago obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.CCONDICIONPAGO.Where(x => x.descripcion == obj.descripcion && x.ndias == obj.ndias).FirstOrDefault();
                if (obj.idcondicionpago == 0)
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
                        else if (aux.idcondicionpago == obj.idcondicionpago)
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
            var obj = await db.CCONDICIONPAGO.FirstOrDefaultAsync(m => m.idcondicionpago == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }

    }
}
