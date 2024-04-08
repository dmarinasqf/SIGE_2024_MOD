using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class SubClaseEF:ISubClaseEF
    {
        private readonly Modelo db;
          
        public SubClaseEF(Modelo context)
        {
            db = context;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(ASubClase obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.ASUBCLASE.Where(x => x.descripcion == obj.descripcion && x.idclase == obj.idclase).FirstOrDefault();
                if (obj.idsubclase == 0)
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
                        else if (aux.idsubclase == obj.idsubclase)
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
            var obj = await db.ASUBCLASE.FirstOrDefaultAsync(m => m.idsubclase == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }

        public async Task<List<ASubClase>> listarSubclasesAsync()
        {
            try
            {
                var query =await (from e in db.ASUBCLASE
                             join s in db.ACLASE on e.idclase equals s.idclase
                             where e.estado != "ELIMINADO"
                             orderby e.descripcion descending
                             select new ASubClase
                             {
                                 descripcion = e.descripcion,
                                 estado = e.estado,
                                 idclase = e.idclase,
                                 clase = s.descripcion,
                                 idsubclase = e.idsubclase
                             }).ToListAsync();
                return query;
            }
            catch (Exception )
            {

                return new List<ASubClase>();
            }

        }       
        public async Task<List<ASubClase>> listarSubclasesHabilitadasAsync(int? id)
        {
            var obj = await db.ASUBCLASE.Where(x => x.idclase == id && x.estado == "HABILITADO").ToListAsync();
            return obj;
        }
        public async Task<SubClaseModel> listarViewModelAsync()
        {
            SubClaseModel model = new SubClaseModel();
            model.clases = await db.ACLASE.Where(x => x.estado == "HABILITADO").ToListAsync();
            return model;
        }
    }
}
