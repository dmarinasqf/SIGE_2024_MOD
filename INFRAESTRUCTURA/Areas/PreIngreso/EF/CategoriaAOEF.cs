using ENTIDADES.preingreso;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
    public class CategoriaAOEF : ICategoriaAOEF
    {
        private readonly Modelo db;      

        public CategoriaAOEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<PICategoriaAO>> ListarAsync()
        {
            return (await db.PICATEGORIAAO.ToListAsync());
        }
        public async Task<mensajeJson> RegistrarEditarAsync(PICategoriaAO obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.PICATEGORIAAO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idcategoriaao == 0)
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
                            return (new mensajeJson("ok-habilitado", aux));
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
                        else if (aux.idcategoriaao == obj.idcategoriaao)
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
            try
            {
                var obj = await db.PICATEGORIAAO.FirstOrDefaultAsync(m => m.idcategoriaao == id);
                obj.estado = "DESHABILITADO";
                db.Update(obj);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", obj);
            }
            catch(Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
            

        }
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            try
            {
                var obj = await db.PICATEGORIAAO.FirstOrDefaultAsync(m => m.idcategoriaao == id);
                obj.estado = "HABILITADO";
                db.Update(obj);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", obj);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }


        }

        public async Task<mensajeJson> BuscarAsync(int id)
        {
            try
            {
                var data = await db.PICATEGORIAAO.FindAsync(id);
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        public async Task<mensajeJson> ListarHabilitadoAsync()
        {
            try
            {
                var data = await db.PICATEGORIAAO.Where(x => x.estado == "HABILITADO").ToListAsync();
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        
    }
}
