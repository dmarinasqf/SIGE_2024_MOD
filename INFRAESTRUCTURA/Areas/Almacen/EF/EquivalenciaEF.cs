using ENTIDADES.Almacen;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
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
    public class EquivalenciaEF:IEquivalenciaEF
    {
        private readonly Modelo db;
        public EquivalenciaEF(Modelo context)
        {
            db = context;
        }

        
        public async Task<EquivalenciaModel> ListarModelAsync()
        {
            EquivalenciaModel model = new EquivalenciaModel();
            model.unidadmedidas = await db.AUNIDADMEDIDA.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").ToListAsync();

            return model;
        }
      
        public async Task<mensajeJson> RegistrarEditarAsync(AEquivalencia obj)
        {
            try
            {

                var aux = db.AEQUIVALENCIA.Where(x => x.unidadmedidainicial == obj.unidadmedidainicial && x.unidadmedidafinal == obj.unidadmedidafinal).FirstOrDefault();
                if (obj.idequivalencia == 0)
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
                        else if (aux.idequivalencia == obj.idequivalencia)
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
            var obj = await db.AEQUIVALENCIA.FirstOrDefaultAsync(m => m.idequivalencia == id);
            obj.estado = "ELIMINADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));
        }       
    }
}
