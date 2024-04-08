using ENTIDADES.preingreso;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
    public class TipoAnalisisEF: ITipoAnalisisEF
    {
        private readonly Modelo db;      

        public TipoAnalisisEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<PITipoAnalisis>> ListarAsync()
        {

            return (await db.PITIPOANALISIS.ToListAsync());
        }
        public async Task<mensajeJson> RegistrarEditarAsync(PITipoAnalisis obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.PITIPOANALISIS.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idtipoanalisis == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", obj);
                    }
                    else
                    {
                        if (aux.estado == "DESHABILITADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", aux);
                        }
                        else
                            return new mensajeJson("El registro ya existe", null);

                    }
                }
                else
                {
                    if (aux is null)
                    {
                        db.Update(obj);
                        await db.SaveChangesAsync();
                        return new mensajeJson("ok", obj);
                    }
                    else
                    {
                        if (aux.estado == "DESHABILITADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok-habilitado", aux);
                        }
                        else if (aux.idtipoanalisis == obj.idtipoanalisis)
                        {
                            db.Update(obj);
                            await db.SaveChangesAsync();
                            return new mensajeJson("ok", obj);
                        }
                        else
                            return new mensajeJson("El registro ya existe", null);
                    }
                }
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.PITIPOANALISIS.FirstOrDefaultAsync(m => m.idtipoanalisis == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return new mensajeJson("ok", obj);

        }        
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.PITIPOANALISIS.FirstOrDefaultAsync(m => m.idtipoanalisis == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return new mensajeJson("ok", obj);

        }
        public async Task<mensajeJson> BuscarTipoAnalisisAsync(int id)
        {
            try
            {
                var data = await db.PITIPOANALISIS.FindAsync(id);
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> ListarTiposAnalisisHabilitadoAsync()
        {
            try
            {
                var data = await db.PITIPOANALISIS.Where(x => x.estado == "HABILITADO").ToListAsync();
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> ListarTipoAnalisisAsync()
        {
            try
            {
                var data = await db.PITIPOANALISIS.ToListAsync();
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
    }
}
