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
    public class PrincipioActivoEF:IPrincipioActivoEF
    {
        private readonly Modelo db;

        public PrincipioActivoEF(Modelo context)
        {
            db = context;
        }

        public async Task<List<APrincipioActivo>> ListarAsync()
        {
            return (await db.PRINCIPIOACTIVO.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        public async Task<mensajeJson> RegistrarEditarAsync(APrincipioActivo obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.PRINCIPIOACTIVO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idprincipio == 0)
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
                            return (new mensajeJson("ok", aux));
                        }
                        else if (aux.idprincipio == obj.idprincipio)
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
        public object BuscarRegistros(string filtro,int top)
        {
            try
            {
                filtro = filtro ?? " ";
                filtro = filtro.ToUpper().Trim();
                if (top is 0) top = 30;
                var query = (from x in db.PRINCIPIOACTIVO
                             where x.descripcion.Contains(filtro) && x.estado == "HABILITADO"
                             select new
                             {
                                 x.idprincipio,
                                 x.descripcion
                             }
                            ).Take(top).ToList();
                return query;
            }
            catch (Exception)
            {

                return "[]";
            }
            

        }
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            var obj = await db.PRINCIPIOACTIVO.FirstOrDefaultAsync(m => m.idprincipio == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.PRINCIPIOACTIVO.FirstOrDefaultAsync(m => m.idprincipio == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
    }
}
