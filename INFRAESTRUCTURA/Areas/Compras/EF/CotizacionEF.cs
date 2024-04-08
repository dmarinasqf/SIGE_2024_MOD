using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using INFRAESTRUCTURA.Areas.Compras.DAO;
using ENTIDADES.Almacen;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
   public class CotizacionEF:ICotizacionEF
    {
        private readonly Modelo db;
        private readonly IUser UserNow;
      
        
       
        public CotizacionEF(Modelo context, IUser userNow)
        {
            db = context;
            UserNow = userNow;          
        }
                                             
        public async Task<mensajeJson> RegistrarEditarAsync(CCotizacion cotizacion)
        {
            if (cotizacion.idcotizacion is 0)
                return await RegistrarAsync(cotizacion);
            else
                return await EditarAsync(cotizacion);

           
        }

        private async Task<mensajeJson> EditarAsync(CCotizacion cotizacion)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {

                    var obj = db.CCOTIZACION.Find(cotizacion.idcotizacion);
                    if (obj.estado == "PENDIENTE" || obj.estado == "APLICADA" || obj.estado == "TERMINADO" || obj.estado == "VENCIDO") {
                        
                        if (cotizacion.estado == "VENCIDO" && cotizacion.idorden > 0) obj.estado = "TERMINADO";
                        else obj.estado = cotizacion.estado;

                        obj.fechavencimiento = cotizacion.fechavencimiento;
                        obj.idproveedor = cotizacion.idproveedor;
                        obj.idcontacto = cotizacion.idcontacto;
                        obj.idcondicionpago = cotizacion.idcondicionpago;
                        obj.idtipopago = cotizacion.idtipopago;
                        obj.idmoneda = cotizacion.idmoneda;
                        db.CCOTIZACION.Update(obj);
                        await db.SaveChangesAsync();
                        
                        var detalleParam = JsonConvert.DeserializeObject<List<CCotizacionDetalle>>(cotizacion.detallejson);
                        var detalleCotizacionEF = db.CCOTIZACIONDETALLE.Where(x => x.idcotizacion == cotizacion.idcotizacion && x.estado == "HABILITADO").ToList();
                        for (int i = 0; i < detalleCotizacionEF.Count; i++)
                        {
                            var objdetalleParam = detalleParam.Where(x => x.iddetallecotizacion == detalleCotizacionEF[i].iddetallecotizacion).FirstOrDefault();
                            if (objdetalleParam == null || objdetalleParam is null)
                            {//DESHABILITAR LOS QUE SE ELIMINAN DE LA TABLA (COTIZACIONDETALLE Y BONIFICACION)
                                detalleCotizacionEF[i].estado = "DESHABILITADO";
                                var objBonificaciones = db.CBONIFICACIONCOTIZACION.Where(x => x.iddetallecotizacion == detalleCotizacionEF[i].iddetallecotizacion && x.estado == "HABILITADO").ToList();
                                if (objBonificaciones != null || objBonificaciones is not null)
                                {
                                    for (int j = 0; j < objBonificaciones.Count; j++)
                                    {
                                        objBonificaciones[j].estado = "ELIMINADO";
                                    }
                                    db.UpdateRange(objBonificaciones);
                                    db.SaveChanges();
                                }
                            }
                            else
                            {//LOS QUE SE MANTIENEN
                                detalleCotizacionEF[i] = objdetalleParam;
                                detalleCotizacionEF[i].estado = "HABILITADO";
                                var objBonificaciones = db.CBONIFICACIONCOTIZACION.Where(x => x.iddetallecotizacion == detalleCotizacionEF[i].iddetallecotizacion && x.estado == "HABILITADO").ToList();
                                for (int j = 0; j < objBonificaciones.Count; j++)
                                {
                                    var objBoniParam = objdetalleParam.bonificaciones.Where(x => x.idbonificacion == objBonificaciones[j].idbonificacion).FirstOrDefault();
                                    if (objBoniParam == null || objBoniParam is null)
                                    {
                                        objBonificaciones[j].estado = "ELIMINADO";
                                        db.Update(objBonificaciones[j]);
                                        db.SaveChanges();
                                    }
                                }
                                if (detalleCotizacionEF[i].bonificaciones != null)
                                {
                                    for (int j = 0; j < detalleCotizacionEF[i].bonificaciones.Length; j++)
                                    {
                                        if (detalleCotizacionEF[i].bonificaciones[j].idbonificacion == 0)
                                        {
                                            detalleCotizacionEF[i].bonificaciones[j].iddetallecotizacion = detalleCotizacionEF[i].iddetallecotizacion;
                                            await db.AddAsync(detalleCotizacionEF[i].bonificaciones[j]);
                                            await db.SaveChangesAsync();
                                        }
                                    }
                                }
                            }
                        }
                        db.UpdateRange(detalleCotizacionEF);
                        db.SaveChanges();

                        //Crear cotizaciondetalle y bonificaciones nuevas.
                        for (int i = 0; i < detalleParam.Count; i++)
                        {
                            if (detalleParam[i].iddetallecotizacion == 0)
                            {
                                detalleParam[i].idcotizacion = cotizacion.idcotizacion;
                                detalleParam[i].estado = "HABILITADO";
                                await db.AddAsync(detalleParam[i]);
                                await db.SaveChangesAsync();

                                if (detalleParam[i].bonificaciones != null)
                                {
                                    if (detalleParam[i].bonificaciones.Length > 0)
                                    {
                                        for (int j = 0; j < detalleParam[i].bonificaciones.Length; j++)
                                        {
                                            detalleParam[i].bonificaciones[j].iddetallecotizacion = detalleParam[i].iddetallecotizacion;
                                            detalleParam[i].bonificaciones[j].estado = "HABILITADO";
                                            await db.AddAsync(detalleParam[i].bonificaciones[j]);
                                            await db.SaveChangesAsync();
                                        }
                                    }
                                }
                            }
                        }
                        var detalleFinal = db.CCOTIZACIONDETALLE.Where(x=>x.idcotizacion == cotizacion.idcotizacion).ToList();
                        cotizacion.detallejson = JsonConvert.SerializeObject(detalleFinal);

                        transaccion.Commit();
                        return (new mensajeJson("ok", cotizacion));
                    }
                    else {
                        return (new mensajeJson("No se puede editar la proforma porque esta " + obj.estado, null));
                    }
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
      
        private async Task<mensajeJson> RegistrarAsync(CCotizacion cotizacion)
        {
            
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {

                    if (cotizacion.idrepresentante == 0)cotizacion.idrepresentante = null;
                    if (cotizacion.idcontacto == 0) cotizacion.idcontacto = null;
                    if (cotizacion.idproveedor == 0)cotizacion.idproveedor = null;
                    cotizacion.codigocotizacion = generarcodigo(cotizacion.codigoempresa);
                    cotizacion.fechasistema = DateTime.Now;
                    cotizacion.ano = DateTime.Now.Year;
                    await db.CCOTIZACION.AddAsync(cotizacion);
                    await db.SaveChangesAsync();
                    var detalle = JsonConvert.DeserializeObject<List<CCotizacionDetalle>>(cotizacion.detallejson);
                    for (int i = 0; i < detalle.Count; i++)
                    {
                        if (detalle[i].iduma is 0)
                            detalle[i].iduma = null;
                        if (detalle[i].idump is 0)
                            detalle[i].idump = null;
                        if (detalle[i].idproductoproveedor is 0)
                            detalle[i].idproductoproveedor = null;
                        if (detalle[i].idlaboratorio is 0)
                            detalle[i].idlaboratorio = null;
                        detalle[i].estado = "HABILITADO";
                        detalle[i].idcotizacion = cotizacion.idcotizacion;
                    }
                    
                    db.CCOTIZACIONDETALLE.AddRange(detalle);
                    await db.SaveChangesAsync();
                    
                    //guardar bonificaciones
                    foreach (var item in detalle)
                    {
                        if (item.bonificaciones != null)
                        {
                            if (item.bonificaciones.Length != 0)
                                for (int i = 0; i < item.bonificaciones.Length; i++)
                                {
                                    item.bonificaciones[i].estado="HABILITADO";
                                    item.bonificaciones[i].iddetallecotizacion = item.iddetallecotizacion;
                                }
                            db.CBONIFICACIONCOTIZACION.UpdateRange(item.bonificaciones);
                            await db.SaveChangesAsync();
                        }
                    }
                    cotizacion.detallejson = JsonConvert.SerializeObject(detalle);


                    transaccion.Commit();
                    return (new mensajeJson("ok", cotizacion));
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        public async Task<CCotizacion> BuscarAsync(int id)
        {            
           return await db.CCOTIZACION.FindAsync(id);                          
        }                     
        public async Task<CCotizacion> DuplicarAsync(int id)
        {
            var cotizacion = await db.CCOTIZACION.FindAsync(id);           
            cotizacion.proveedor = db.CPROVEEDOR.Find(cotizacion.idproveedor);
            //CotizacionDAO dao = new CotizacionDAO(db);
            //var detalle = dao.getDetalle(id);
            var detalle = await db.CCOTIZACIONDETALLE.Where(x => x.idcotizacion == cotizacion.idcotizacion && x.estado != "ELIMINADO").ToListAsync();
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    cotizacion.codigocotizacion = generarcodigo(cotizacion.codigoempresa);
                    if (cotizacion.estado == "BLANCO")
                        cotizacion.estado = "BLANCO";
                    else
                        cotizacion.estado = "PENDIENTE";
                    cotizacion.fechasistema = DateTime.Now;
                    cotizacion.fechavencimiento = DateTime.Now.AddDays(30);
                    cotizacion.emp_codigo = int.Parse(UserNow.getIdUserSession());
                    cotizacion.idcotizacion = 0;
                    cotizacion.ano = DateTime.Now.Year;
                    //guardar cabecera
                    await db.CCOTIZACION.AddAsync(cotizacion);
                    await db.SaveChangesAsync();
                    List<CCotizacionDetalle> detalleC = new List<CCotizacionDetalle>();
                    foreach (var item in detalle)
                    {
                        item.idcotizacion = cotizacion.idcotizacion;
                        item.bonificaciones = await db.CBONIFICACIONCOTIZACION.Where(x => x.iddetallecotizacion == item.iddetallecotizacion && x.estado != "ELIMINADO").ToArrayAsync();
                        item.iddetallecotizacion = 0;
                        detalleC.Add(item);
                    }
                    //guardar detalle
                    db.CCOTIZACIONDETALLE.AddRange(detalleC);
                    await db.SaveChangesAsync();
                    foreach (var item in detalleC)
                    {
                        if (item.bonificaciones.Length != 0)
                        {
                            for (int i = 0; i < item.bonificaciones.Length; i++)
                            {
                                item.bonificaciones[i].iddetallecotizacion = item.iddetallecotizacion;
                                item.bonificaciones[i].idbonificacion = 0;

                            }
                            db.CBONIFICACIONCOTIZACION.AddRange(item.bonificaciones);
                            await db.SaveChangesAsync();
                        }
                    }
                    transaccion.Commit();
                    return cotizacion;
                }
                catch (Exception)
                {
                    transaccion.Rollback();
                    return null;
                }
            }
        }      
        public async Task<mensajeJson> AnularCotizacionAsync(int? id)
        {
            try
            {
                var cotizacion = await db.CCOTIZACION.FindAsync(id);
                if (cotizacion != null)
                {
                    //var detalle = await db.CCOTIZACIONDETALLE.Where(x => x.idcotizacion == id && x.estado != "ELIMINADO").ToListAsync();
                    cotizacion.estado = "ANULADO";
                    db.CCOTIZACION.Update(cotizacion);
                    await db.SaveChangesAsync();
                    //foreach (var item in detalle)
                    //{
                    //    item.estado = "ANULADO";
                    //}
                    //db.CCOTIZACIONDETALLE.UpdateRange(detalle);
                    //await db.SaveChangesAsync();
                    return (new mensajeJson("ok", null));
                }
                return (new mensajeJson("No existe cotizacion", null));

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> habilitarCotizacionAsync(int? id)
        {
            try
            {
                var cotizacion = await db.CCOTIZACION.FindAsync(id);
                if (cotizacion != null)
                {
                    cotizacion.estado = "PENDIENTE";
                    db.CCOTIZACION.Update(cotizacion);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", null));
                }
                return (new mensajeJson("No existe cotizacion", null));

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }                                              
        public string EliminarItemDetalle(int id)
        {
            try
            {
                var detalle = db.CCOTIZACIONDETALLE.Find(id);
                detalle.estado = "ELIMINADO";
                var obj = db.CCOTIZACION.Find(detalle.idcotizacion).estado;
                if (obj == "PENDIENTE")
                {
                    db.CCOTIZACIONDETALLE.Update(detalle);
                    db.SaveChanges();
                    return ("ok");
                }
                else
                    return ("No se puede remover los items porque la cotizacion esta " + obj);
            }
            catch (Exception e)
            {

                return (e.Message);
            }


        }
        public List<CBonificacionCotizacion> getBonificacion(int id)
        {
            try
            {
                var query = (from e in db.CBONIFICACIONCOTIZACION
                             join s in db.APRODUCTO on e.idproducto equals s.idproducto
                             where e.estado != "ELIMINADO"
                            && e.iddetallecotizacion == id
                             select new CBonificacionCotizacion
                             {
                                 producto = s.nombre,
                                 cantidad = e.cantidad,
                                 precio = e.precio,
                                 iddetallecotizacion = e.iddetallecotizacion,
                                 idbonificacion = e.idbonificacion,
                                 idproducto = e.idproducto,
                                 tipo = e.tipo,
                                 promocion=e.promocion??""
                             }).ToList();
                return query;
            }
            catch (Exception e)
            {

                return new List<CBonificacionCotizacion>();
            }

        }
        public async Task<mensajeJson> guardarBonificacionAsync(CBonificacionCotizacion[] array, int iddetalle)
        {
            try
            {
                var x = await db.CCOTIZACIONDETALLE.FindAsync(iddetalle);
                var estado = db.CCOTIZACION.Find(x.idcotizacion).estado;
                if (estado == "PENDIENTE" || estado == "TERMINADO")

                {
                    var boni = await db.CBONIFICACIONCOTIZACION.Where(x => x.iddetallecotizacion == iddetalle).ToListAsync();
                    db.CBONIFICACIONCOTIZACION.RemoveRange(boni);
                    // si no hay bonificacion cambios los monto de bonificacion
                    if (array.Length == 0)
                    {
                        x.costo = x.montofacturar;
                        x.bonificacion = 0;
                        db.CCOTIZACIONDETALLE.Update(x);
                        await db.SaveChangesAsync();
                    }
                    //si tiene bonificacion cambia los datos
                    if (array.Length > 0)
                    {
                        decimal? suma = 0;
                        decimal? resto = 0;
                        for (int i = 0; i < array.Length; i++)
                        {
                            suma = (decimal)(array[i].cantidad * array[i].precio);
                        }
                        resto = suma / x.cantidad;
                        x.costo = x.montofacturar - resto;
                        x.bonificacion = (decimal?)suma;
                        db.CCOTIZACIONDETALLE.Update(x);
                        await db.SaveChangesAsync();
                    }


                    await db.SaveChangesAsync();

                    if (array.Length != 0)
                    {
                        db.CBONIFICACIONCOTIZACION.UpdateRange(array);
                        await db.SaveChangesAsync();

                    }
                    return (new mensajeJson("ok", null));
                }
                else
                {
                    return (new mensajeJson("No se puede modificar los datos de la bonificacion porque esta " + estado, null));
                }




            }
            catch (Exception e)
            {

                return (new mensajeJson(e.Message, null));

            }
        }        
        public async Task<string> UsarProformaAsync(int[] proformas)
        {
            try
            {
                List<CCotizacion> cotizaciones = new List<CCotizacion>();
                for (int i = 0; i < proformas.Length; i++)
                {
                    var aux = await db.CCOTIZACION.FindAsync(proformas[i]);
                    aux.estado = "APLICADA";
                    db.CCOTIZACION.Update(aux);
                    await db.SaveChangesAsync();
                }
                return ("ok");
            }
            catch (Exception)
            {
                return null;
            }
        }
        public async Task<mensajeJson> BuscarProveedorCotizacionAsync(int idproforma)
        {
            try
            {
                var proforma = await db.CCOTIZACION.FindAsync(idproforma);                
                CProveedor obj = buscarProveedor(proforma.idproveedor.Value);
                if (proforma.idcontacto != 0 || proforma.idcontacto != null)
                    obj.contacto = await db.CCONTACTOPROVEEDOR.FindAsync(proforma.idcontacto);

                if (proforma.idrepresentante != 0 || proforma.idrepresentante != null)
                    obj.representante = await db.CREPRESENTANTELABORATORIO.FindAsync(proforma.idrepresentante);

                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public mensajeJson BuscarDatosProveedor(int idproveedor)
        {
            try
            {
                CProveedor obj = buscarProveedor(idproveedor);
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> BuscarPrimeraCotizacionAsync(int idproforma)
        {
            try
            {
                var data = await db.CCOTIZACION.FindAsync(idproforma);

                return (new mensajeJson("ok",data));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<CotizacionModel> datosiniciocotizacionAsync()
        {
            CotizacionModel model = new CotizacionModel();
            model.icoterms = await db.FICOTERMS.Where(x => x.estado == "HABILITADO").ToListAsync();
            model.monedas = await db.FMONEDA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.nombre).ToListAsync();
            model.condicionpago = await db.CCONDICIONPAGO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.tipoproducto = await db.ATIPOPRODUCTO.Where(x => x.estado == "HABILITADO").ToListAsync();
            model. tipocotizacion = await db.CTIPOCOTIZACION.Where(x => x.estado == "HABILITADO").ToListAsync();
            model.tipopago = await db.FTIPOPAGO.Where(x => x.estado == "HABILITADO").ToListAsync();
            var IGV = await db.CCONSTANTE.FindAsync("IGV");
            model.IGV = IGV.valor.Replace(",", ".");            
            return model;

        }
        //pasarUltimaCompra(obj)
        //{
        //    console.log(obj);
        //    MPU_txtvvfanterior.value = obj.vvf.toFixed(2);
        //    MPU_txtpvfanterior.value = obj.pvf.toFixed(2);
        //    MPU_txtd1anterior.value = obj.des1.toFixed(2);
        //    MPU_txtd2anterior.value = obj.des2.toFixed(2);
        //    MPU_txtd3anterior.value = obj.des3.toFixed(2);
        //    MPU_txtbonifanterior.value = obj.bonificacion.toFixed(2);
        //    MPU_txtcostofactanterior.value = obj.montofacturar.toFixed(2);
        //    MPU_txtcostoanterior.value = obj.costo.toFixed(2);
        //    MPU_txtprontopagoanterior.value = 0.00;
        //    MPU_txtprorroteoanterior.value = REDONDEAR_DECIMALES(obj.montofacturar / obj.cantidad, 2).toFixed(2);
        //}
        //public mensajeJson BuscarUltimaCompraxProducto(int idproducto, int iddetallecotizacion)
        //{
        //    //buscar la ultima compra del producto, para verificar costos en aprobacion de factura  
        //    try
        //    {
        //        var data = (from P in db.APRODUCTO
        //                    join C in db.CCOTIZACIONDETALLE on P.idproducto equals C.idproducto
        //                    join CC in db.CCOTIZACION on C.idcotizacion equals CC.idcotizacion
        //                    where P.idproducto == idproducto &&
        //                    CC.estado == "APLICADA" &&
        //                    //C.iddetallecotizacion != iddetallecotizacion &&
        //                    (C.estado != "ELIMINADO" || C.estado != "ANULADO")
        //                    select new
        //                    {
        //                        vvf = P.vvf,
        //                        pvf = P.pvf,
        //                        pvp = P.pvfp,
        //                        des1 = (C.des1 == null) ? 0 : C.des1,
        //                        des2 = (C.des2 == null) ? 0 : C.des2,
        //                        des3 = (C.des3 == null) ? 0 : C.des3,
        //                        precioxblister = (P.precioxblister == null) ? 0 : P.precioxblister,
        //                        precioxfraccion = P.precioxfraccion == null ? 0 : P.precioxfraccion,
        //                        bonificacion = (C.bonificacion == null) ? 0 : C.bonificacion,
        //                        montofacturar = (C.montofacturar == null) ? 0 : C.montofacturar,
        //                        costo = (C.costo == null) ? 0 : C.costo,
        //                        cantidad = C.cantidad,
        //                        cantidadb = 0,

        //                    }
        //                 ).ToList().LastOrDefault();
        //        if (data is null)
        //            return new mensajeJson("No hay historial", null);
        //        else
        //            return new mensajeJson("ok", data);
        //    }
        //    catch (Exception e)
        //    {
        //        return new mensajeJson("Excepción: " + e.Message, null);
        //    }
        //}
        private List<CBonificacionCotizacion> PrepararBonificaciones(List<CBonificacionCotizacion> lista1, List<CBonificacionCotizacion>lista2)
        {
            List<CBonificacionCotizacion> lista = new List<CBonificacionCotizacion>();
            CBonificacionCotizacion obj= new CBonificacionCotizacion();
            bool aux = false;
            for (int i = 0; i < lista1.Count; i++)
            {
                aux = false;
                for (int j = 0; j < lista2.Count; j++)
                {
                    if(lista2[j].idbonificacion!=0)
                        if(lista1[i].idbonificacion==lista2[j].idbonificacion)
                        {
                            obj = lista2[j];
                            aux = true;
                            break;
                        }                    
                }
                if (aux)
                    lista.Add(obj);
                //else
                //{
                //    lista1[i].estado = "ELIMINADO";
                //    lista.Add(lista1[i]);
                //}
            }
            for (int j = 0; j < lista2.Count; j++)
            {
                if (lista2[j].idbonificacion == 0)
                    lista.Add(lista2[j]);
            }

            return lista;

        }
        private string generarcodigo(int idempresa)
        {
            string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.CCOTIZACION.Where(x => x.codigoempresa == idempresa && x.ano == ano).Count();

            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = "PR" + correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
        private CProveedor buscarProveedor(int proveedor)
        {
            try
            {
                var query = (from e in db.CPROVEEDOR
                             join s in db.FMONEDA on e.idmoneda equals s.idmoneda
                             join c in db.CCONTACTOPROVEEDOR.DefaultIfEmpty() on e.idproveedor equals c.idproveedor
                             where e.idproveedor == proveedor && c.estado == "HABILITADO"
                             select new CProveedor
                             {
                                 razonsocial = e.razonsocial,
                                 ruc = e.ruc,
                                 telefonod = e.telefonod,
                                 idproveedor = e.idproveedor,
                                 ubicacion = e.ubicacion,
                                 moneda = new FMoneda
                                 {
                                     idmoneda = s.idmoneda,
                                     nombre = s.nombre,
                                     tipodecambio = s.tipodecambio
                                 },
                                 contacto = new CContactosProveedor
                                 {
                                     idcontacto = c.idcontacto,
                                     nombres = c.nombres,
                                     telefono = c.telefono,
                                     celular = c.celular,
                                     correo = c.correo,
                                     documento = c.documento,
                                 }
                             }).FirstOrDefault();
                return query;
            }
            catch (Exception )
            {

                return new CProveedor();
            }

        }

        public async Task<AUnidadMedida> CargarUnidadMedida(int? id)
        {
            return await db.AUNIDADMEDIDA.FindAsync(id);
        }
    }
}
