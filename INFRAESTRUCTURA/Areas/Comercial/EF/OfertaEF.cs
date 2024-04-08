using ENTIDADES.comercial;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.EF
{
    public class OfertaEF : IOfertaEF
    {
        private readonly Modelo db;
        public OfertaEF(Modelo db_)
        {
            db = db_;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(Oferta oferta)
        {
            try
            {
                var detalle = JsonConvert.DeserializeObject<List<DetalleOferta>>(oferta.jsondetalle);
                var obsequios = JsonConvert.DeserializeObject<List<ObsequioOferta>>(oferta.jsonobsequios);
                oferta.nombre = oferta.nombre.ToUpper();
                if (oferta.idoferta is 0)
                    return await registrarAsync(oferta, detalle, obsequios);
                else
                    return await editarAsync(oferta, detalle, obsequios);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public List<Oferta> BuscarObsequios(string filtro, int top)
        {
            try
            {
                if (filtro is null) filtro = "";
                var data = db.OFERTA.Where(x => x.nombre.Contains(filtro)).Take(top).OrderBy(x => x.idoferta).ToList();
                return data;
            }
            catch (Exception)
            {
                return new List<Oferta>();
            }


        }
        public List<SucursalOferta> ListarOfertaSucursal(int idoferta)
        {
            try
            {
                var data = db.SUCURSALOFERTA.Where(x => x.estado == "HABILITADO" && x.idoferta == idoferta).ToList();
                return data;
            }
            catch (Exception)
            {

                return new List<SucursalOferta>();
            }
         
        }
        public mensajeJson AsignarOfertaSucursal(int idoferta, int idsucursal)
        {
            try
            {
                var data = db.SUCURSALOFERTA.Where(x => x.idoferta == idoferta && x.idsucursal == idsucursal).FirstOrDefault();
                if (data is null)
                {
                    db.Add(new SucursalOferta { idoferta = idoferta, idsucursal = idsucursal, estado = "HABILITADO" });
                }
                else if (data.estado == "HABILITADO")
                {
                    data.estado = "ELIMINADO";
                    db.Update(data);
                }
                else
                {
                    data.estado = "HABILITADO";
                    db.Update(data);
                }
                db.SaveChanges();
                return new mensajeJson("ok", null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }
        }
        public mensajeJson AsignarOfertaSucursalEnBloque(int idoferta, List<string> idsucursal)
        {
            try
            {
                foreach (var item in idsucursal)
                {
                    var dato = item.Split("-");
                    var estado = Boolean.Parse( dato[0]);
                    var sucu = int.Parse( dato[1]);
                    var data = db.SUCURSALOFERTA.Where(x => x.idoferta == idoferta && x.idsucursal == sucu).FirstOrDefault();
                    if (estado)
                    {                      
                        if (data is null)
                        {
                            db.Add(new SucursalOferta { idoferta = idoferta, idsucursal = sucu, estado = "HABILITADO" });
                        }                        
                        else
                        {
                            data.estado = "HABILITADO";
                            db.Update(data);
                        }
                    }else
                    {                        
                        if (data is not null)
                        {
                            data.estado = "ELIMINADO";
                            db.Update(data);
                        }
                    }
                    
                    db.SaveChanges();
                }
               
                return new mensajeJson("ok", null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }
        }
        private async Task<mensajeJson> editarAsync(Oferta oferta, List<DetalleOferta> detalle, List<ObsequioOferta> obsequios)
        {
            using (var transacction = db.Database.BeginTransaction())
            {
                try
                {
                    var objaux = db.OFERTA.Find(oferta.idoferta);
                    if (objaux is null)
                        return new mensajeJson("No existe la oferta con el codigo " + oferta.idoferta, null);
                    db.Update(oferta);
                    await db.SaveChangesAsync();

                    for (int i = 0; i < detalle.Count; i++)
                        detalle[i].idoferta = oferta.idoferta;
                    for (int i = 0; i < obsequios.Count; i++)
                        obsequios[i].idoferta = oferta.idoferta;

                    db.UpdateRange(detalle);
                    await db.SaveChangesAsync();
                    db.UpdateRange(obsequios);
                    await db.SaveChangesAsync();

                    transacction.Commit();
                    return new mensajeJson("ok", oferta);
                }
                catch (Exception e)
                {
                    transacction.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }
        }
        private async Task<mensajeJson> registrarAsync(Oferta oferta, List<DetalleOferta> detalle, List<ObsequioOferta> obsequios)
        {
            using (var transacction = db.Database.BeginTransaction())
            {
                try
                {
                    db.Add(oferta);
                    await db.SaveChangesAsync();

                    for (int i = 0; i < detalle.Count; i++)
                        detalle[i].idoferta = oferta.idoferta;
                    for (int i = 0; i < obsequios.Count; i++)
                        obsequios[i].idoferta = oferta.idoferta;

                    db.AddRange(detalle);
                    await db.SaveChangesAsync();
                    db.AddRange(obsequios);
                    await db.SaveChangesAsync();

                    transacction.Commit();
                    return new mensajeJson("ok", oferta);
                }
                catch (Exception e)
                {
                    transacction.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }
        }
      
    }
}
