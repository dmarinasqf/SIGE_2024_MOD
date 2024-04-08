using ENTIDADES.ventas;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Proformas.EF
{
   public class ProformaEF:IProformaEF
    {
        private readonly Modelo db;

        public ProformaEF(Modelo _db)
        {
            db = _db;

        }

        public async Task<mensajeJson> RegistrarProformaDirectaAsync(Proforma proforma)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {

                    var detalle = JsonConvert.DeserializeObject<List<ProformaDetalle>>(proforma.jsondetalle);
                    if (proforma.idproforma is 0)
                    {
                        proforma.fecha = DateTime.Now;
                        proforma.estado = "HABILITADO";
                        proforma.codigoproforma = generarcodigoproforma(proforma.idsucursal);
                        db.PROFORMA.Add(proforma);
                        await db.SaveChangesAsync();
                        //guardar detalle
                        for (int i = 0; i < detalle.Count; i++)
                            detalle[i].idproforma = proforma.idproforma;
                        db.AddRange(detalle);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                        return new mensajeJson("ok", proforma);
                    }
                    else
                    {
                        var aux = db.PROFORMA.Find(proforma.idproforma);
                        aux.idcliente = proforma.idcliente;

                        db.Update(aux);
                        await db.SaveChangesAsync();
                        for (int i = 0; i < detalle.Count; i++)
                            detalle[i].idproforma = proforma.idproforma;
                        db.UpdateRange(detalle);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                        return new mensajeJson("ok", aux);

                    }
                    

                }
                catch (Exception e)
                {

                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }

        }
        private string generarcodigoproforma(int idsucursal)
        {
            var numproformas = db.PROFORMA.Where(x => x.idsucursal == idsucursal && x.fecha.Month == DateTime.Now.Month && x.fecha.Year == DateTime.Now.Year).ToList().Count();
            
            numproformas++;
            return idsucursal.ToString()+DateTime.Now.Year.ToString().Substring(0,2) + DateTime.Now.ToString("MM") + numproformas;
        }
    }
}
