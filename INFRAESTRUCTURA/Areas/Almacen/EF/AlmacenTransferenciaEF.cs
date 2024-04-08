using ENTIDADES.Almacen;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;


namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class AlmacenTransferenciaEF : IAlmacenTransferenciaEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        public AlmacenTransferenciaEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }
        WebClient cliente = new WebClient() { Encoding = Encoding.UTF8 };
        public async Task<mensajeJson> RegistrarEditarAsync(AAlmacenTransferencia oAlmacenTransferencia) {
            if (oAlmacenTransferencia.idalmacentransferencia > 0)
                return await EditarAsync(oAlmacenTransferencia);
            else
                return await RegistrarAsync(oAlmacenTransferencia);
        }
        public async Task<mensajeJson> RegistrarAsync(AAlmacenTransferencia oAlmacenTransferencia)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    oAlmacenTransferencia.codigo = generarcodigo();
                    oAlmacenTransferencia.anio = DateTime.Now.Year;
                    if (oAlmacenTransferencia.observacion == null || oAlmacenTransferencia.observacion is null)
                        oAlmacenTransferencia.observacion = "";
                    await db.AddAsync(oAlmacenTransferencia);
                    await db.SaveChangesAsync();

                    if (oAlmacenTransferencia.idalmacentransferencia > 0)
                    {
                        var detalle = JsonConvert.DeserializeObject<List<AAlmacenTransferenciaDetalle>>(oAlmacenTransferencia.jsondetalle);
                        foreach (var item in detalle)
                        {
                            item.idalmacentransferencia = oAlmacenTransferencia.idalmacentransferencia;
                            item.estado = "HABILITADO";
                        }
                        await db.AddRangeAsync(detalle);
                        await db.SaveChangesAsync();
                    }
                    transaccion.Commit();
                    return new mensajeJson("ok", oAlmacenTransferencia);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        public async Task<mensajeJson> EditarAsync(AAlmacenTransferencia oAlmacenTransferencia)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var oATBD = db.AALMACENTRANSFERENCIA.Where(x => x.idalmacentransferencia == oAlmacenTransferencia.idalmacentransferencia).FirstOrDefault();
                    oAlmacenTransferencia.anio = oATBD.anio;
                    if (oAlmacenTransferencia.observacion == null || oAlmacenTransferencia.observacion is null)
                        oAlmacenTransferencia.observacion = "";
                    db.Update(oAlmacenTransferencia);
                    await db.SaveChangesAsync();

                    var detalleBD = db.AALMACENTRANSFERENCIADETALLE.Where(x => x.idalmacentransferencia == oAlmacenTransferencia.idalmacentransferencia).ToList();
                    var detalleMemoria = JsonConvert.DeserializeObject<List<AAlmacenTransferenciaDetalle>>(oAlmacenTransferencia.jsondetalle);
                    List<AAlmacenTransferenciaDetalle> lAlmacenDetalleEditar = new List<AAlmacenTransferenciaDetalle>();
                    List<AAlmacenTransferenciaDetalle> lAlmacenDetalleAgregar = new List<AAlmacenTransferenciaDetalle>();
                    foreach (var item in detalleBD) { item.estado = "DESHABILITADO"; }
                    foreach (var item in detalleMemoria)
                    {
                        var oDetalle = detalleBD.Where(x => x.idproducto == item.idproducto && x.idstockorigen == item.idstockorigen).FirstOrDefault();
                        if (oDetalle != null || oDetalle is not null)
                        {
                            oDetalle.cantidad = item.cantidad;
                            oDetalle.estado = "HABILITADO";
                            lAlmacenDetalleEditar.Add(oDetalle);
                        }
                        else
                        {
                            AAlmacenTransferenciaDetalle oAlmacenDetalle = new();
                            oAlmacenDetalle.idalmacentransferencia = oAlmacenTransferencia.idalmacentransferencia;
                            oAlmacenDetalle.idproducto = item.idproducto;
                            oAlmacenDetalle.idstockorigen = item.idstockorigen;
                            oAlmacenDetalle.cantidad = item.cantidad;
                            oAlmacenDetalle.idstockdestino = 0;
                            oAlmacenDetalle.estado = "HABILITADO";
                            lAlmacenDetalleAgregar.Add(oAlmacenDetalle);
                        }
                    }
                    foreach (var item in detalleBD) {
                        if (item.estado == "DESHABILITADO")
                            lAlmacenDetalleEditar.Add(item);
                    }
                    if (lAlmacenDetalleEditar.Count() > 0)
                    {
                        db.UpdateRange(lAlmacenDetalleEditar);
                        await db.SaveChangesAsync();
                    }
                    if (lAlmacenDetalleAgregar.Count() > 0)
                    {
                        await db.AddRangeAsync(lAlmacenDetalleAgregar);
                        await db.SaveChangesAsync();
                    }

                    transaccion.Commit();
                    return new mensajeJson("ok", oAlmacenTransferencia);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        private string generarcodigo()
        {
            int empresa = (user.getIdEmpresaCookie());
            string correlativoempresa = db.EMPRESA.Find(empresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AALMACENTRANSFERENCIA.Where(x => x.idempresa == empresa && x.anio == ano).Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = "AT" + correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }

        //Transferencia produccion(SISLAB)
        public async Task<mensajeJson> RegistrarEditarProduccionAsync(AAlmacenProduccion oAlmacenProduccion) {
            if (oAlmacenProduccion.idmovimiento > 0) {
                return await EditarProduccionAsync(oAlmacenProduccion);
            }else{
                return await RegistrarProduccionAynsc(oAlmacenProduccion);
            }
        }

        public async Task<mensajeJson> RegistrarProduccionAynsc(AAlmacenProduccion oAlmacenProduccion) {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    oAlmacenProduccion.codigo = generarcodigoProduccion();
                    var detalle = JsonConvert.DeserializeObject<List<AAlmacenProduccionDetalle>>(oAlmacenProduccion.jsondetalle);
                    DateTime inicio = DateTime.Today;
                    DateTime fin = DateTime.Today.AddDays(1).AddTicks(-1);
                    foreach (var item in detalle) {

                        var query = (from apd in db.AALMACENPRODUCCIONDETALLE
                                     join ap in db.AALMACENPRODUCCION on apd.idmovimiento equals ap.idmovimiento
                                     join pr in db.APRODUCTO on apd.idproducto equals pr.idproducto
                                     where (apd.idstock == item.idstock && ap.fechacreacion >= inicio && ap.fechacreacion<=fin)
                                     select new { 
                                        descripcion=pr.nombreabreviado
                                     }).ToList();
                        if (query.Count > 0) {
                            return new mensajeJson("EL PROUCTO "+query[0].descripcion+" YA TIENE MOVIMIENTO EL DIA DE HOY", null);
                        }
                    }
                    

                    if (oAlmacenProduccion.observacion == null || oAlmacenProduccion.observacion is null)
                        oAlmacenProduccion.observacion = "";
                    await db.AddAsync(oAlmacenProduccion);
                    await db.SaveChangesAsync();

                    if (oAlmacenProduccion.idalmacen > 0)
                    {
                        foreach (var item in detalle)
                        {
                            item.idmovimiento = oAlmacenProduccion.idmovimiento;
                            
                        }
                        await db.AddRangeAsync(detalle);
                        await db.SaveChangesAsync();
                    }
                    transaccion.Commit();
                    return new mensajeJson("ok", oAlmacenProduccion);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }

        }
        public async Task<mensajeJson> EditarProduccionAsync(AAlmacenProduccion oAlmacenProduccion) { return null; }

        public async Task<mensajeJson> ServiceTransferenciaProduccion(DataTable dt,string urlws) {
            try {
                urlws += "Laboratorio/Manipulacion/Stock/ServiceStock.svc/";
                string json = JsonConvert.SerializeObject(JsonConvert.SerializeObject(dt));

                cliente.Headers["Content-Type"] = "application/json";
                var respuesta = cliente.UploadString(urlws + "inventario/reposicionstock_agregar", "POST", json);
                var jsonobj = JsonConvert.DeserializeObject(JsonConvert.DeserializeObject(respuesta).ToString());
                return new mensajeJson("ok",jsonobj.ToString());
            }
            catch (Exception vex) {
                return (new mensajeJson(vex.Message, null));
            }
            
        }

        private string generarcodigoProduccion()
        {
            int empresa = (user.getIdEmpresaCookie());
            string correlativoempresa = db.EMPRESA.Find(empresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AALMACENPRODUCCION.Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = "TR" + correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }

    }
}
