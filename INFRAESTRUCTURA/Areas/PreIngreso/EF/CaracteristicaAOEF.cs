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
    public class CaracteristicaAOEF : ICaracteristicaAOEF
    {
        private readonly Modelo db;      

        public CaracteristicaAOEF(Modelo context)
        {
            db = context;
        }
        public async Task<List<PICaracteristicaAO>> ListarAsync(string estado,string idcategoria)
        {
            if (idcategoria is null) idcategoria = "";
                try
                {
                    var query = await (from e in db.PICARACTERISTICAAO
                                       join s in db.PICATEGORIAAO on e.idcategoriaao equals s.idcategoriaao
                                       where e.estado != "ELIMINADO" && 
                                       e.idcategoriaao.ToString().Contains(idcategoria) &&
                                       e.estado.Contains(estado)
                                       orderby s.descripcion
                                       select new PICaracteristicaAO
                                       {
                                           idcaracteristicaao = e.idcaracteristicaao,
                                           descripcion = e.descripcion,
                                           nombreabreviado = e.nombreabreviado,
                                           estado = e.estado,
                                           idcategoriaao = e.idcategoriaao,
                                           categoriaao = s.descripcion
                                           
                                       }).ToListAsync();
             
                return query;
                }
                catch (Exception e)
                {

                    return new List<PICaracteristicaAO>();
                }

            
           // return (await db.PICARACTERISTICAAO.ToListAsync());
        }
        public async Task<mensajeJson> RegistrarEditarAsync(PICaracteristicaAO obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                obj.nombreabreviado = obj.nombreabreviado.ToUpper();
                var aux = db.PICARACTERISTICAAO.Where(x => x.descripcion == obj.descripcion && x.idcategoriaao == obj.idcategoriaao
                && x.nombreabreviado == obj.nombreabreviado
                ).FirstOrDefault();
                if (obj.idcaracteristicaao == 0)
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
                        else if (aux.idcaracteristicaao == obj.idcaracteristicaao)
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
                var obj = await db.PICARACTERISTICAAO.FirstOrDefaultAsync(m => m.idcaracteristicaao == id);
                obj.estado = "DESHABILITADO";
                db.Update(obj);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", obj);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            try
            {
                var obj = await db.PICARACTERISTICAAO.FirstOrDefaultAsync(m => m.idcaracteristicaao == id);
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
                var data = await db.PICARACTERISTICAAO.FindAsync(id);
                return new mensajeJson("ok", data);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }
        //public async Task<mensajeJson> ListarHabilitadoAsync()
        //{
        //    try
        //    {
        //        var data = await db.PICARACTERISTICAAO.Where(x => x.estado == "HABILITADO").ToListAsync();
        //        return new mensajeJson("ok", data);

        //    }
        //    catch (Exception e)
        //    {
        //        return new mensajeJson(e.Message, null);
        //    }
        //}

      
    }
}
