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
    public class FormaFarmaceuticaEF: IFormaFarmaceuticaEF
    {
        private readonly Modelo db;
        public FormaFarmaceuticaEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<AFormaFarmaceutica>> ListarAsync()
        {
            return await db.FORMAFARMACEUTICA.Where(x => x.estado != "ELIMINADO").ToListAsync();
        }


        public async Task<mensajeJson> RegistrarEditarAsync(AFormaFarmaceutica obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.FORMAFARMACEUTICA.Where(x => x.descripcion == obj.descripcion ).FirstOrDefault();
                if (obj.idformafarma == 0)
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
                        else if (aux.idformafarma == obj.idformafarma)
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

                
    }
}
