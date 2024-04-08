using ENTIDADES.Finanzas;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.EF
{
    public class DocumentoTributarioEF:IDocumentoTributarioEF
    {
        private readonly Modelo db;
        private readonly ICajaVentaEF cajaVentasEF;

        public DocumentoTributarioEF(Modelo context, ICajaVentaEF cajaVentasEF_)
        {
            db = context;
            cajaVentasEF = cajaVentasEF_;
        }
        
        public async Task<List<FDocumentoTributario>> ListarAsync()
        {            
            var data = await db.FDOCUMENTOTRIBUTARIO.Where(x=>x.estado!="ELIMINADO").ToListAsync();
            return (data);
        }
        public async Task<List<FDocumentoTributario>> ListarHabilitadosAsync()
        {            
            var data = await db.FDOCUMENTOTRIBUTARIO.Where(x=>x.estado=="HABILITADO").ToListAsync();
            return (data);
        }
     
        public async Task<mensajeJson> RegistrarEditarAsync(FDocumentoTributario obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                var aux = db.FDOCUMENTOTRIBUTARIO.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.iddocumento == 0)
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
                        else if (aux.iddocumento == obj.iddocumento)
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
            var obj = await db.FDOCUMENTOTRIBUTARIO.FirstOrDefaultAsync(m => m.iddocumento == id);
            obj.estado = "DESHABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
   
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.FDOCUMENTOTRIBUTARIO.FirstOrDefaultAsync(m => m.iddocumento == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public object ListarTipoDocumentoxDocumentoTributario(int iddocumento)
        {
            var query = (from t in db.FTIPODOCUMENTOTRIBUTARIO
                         where t.iddocumento==iddocumento && t.estado=="HABILITADO"
                         select new
                         {
                             t.idtipodocumento,
                             t.codigosunat,
                             t.descripcion,
                             t.iddocumento
                         }).ToList();
            return query;

        }

        public FDocumentoTributario BuscarDocumento(string id)
        {
            var data = db.FDOCUMENTOTRIBUTARIO.Find(id);
            return (data);
        }
        public mensajeJson ListarDocumentosxCajaSucursalParaVentas(int? id)
        {
            try
            {                 
                if (id is null)
                    id = cajaVentasEF.ObtenerCajaAbierta(null);
                if (id is -1)
                    return new mensajeJson("Error al leer los documentos y correlativos de la sucursal", null);
                var cajasucursal = db.CAJASUCURSAL.Find(id);
                //si la caja esta asociado a otro correlativo
                if (cajasucursal.correlativoasociadoaotracaja.HasValue && cajasucursal.correlativoasociadoaotracaja.Value)
                    if(cajasucursal.idcajacorrelativoasociado!=null)
                        id = cajasucursal.idcajacorrelativoasociado;
                return new mensajeJson("ok", DocumentosTributariosCaja(id));

            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        
        }
        public mensajeJson ListarDocumentosxCajaAperturada(int id)
        {
            try
            {
                var apertura = db.APERTURACAJA.Find(id);
                var cajasucursal = db.CAJASUCURSAL.Find(apertura.idcajasucursal);
                id = cajasucursal.idcajasucursal;
                //si la caja esta asociado a otro correlativo
                if (cajasucursal.correlativoasociadoaotracaja.HasValue && cajasucursal.correlativoasociadoaotracaja.Value)
                    if (cajasucursal.idcajacorrelativoasociado != null)
                        id = cajasucursal.idcajacorrelativoasociado.Value;
                return new mensajeJson("ok", DocumentosTributariosCaja(id));

            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }

        }
        public object ListarDocumentosXSucursal(int idsucursal)
        {
            var query = (from DS in db.CORRELATIVODOCUMENTO
                         join D in db.FDOCUMENTOTRIBUTARIO on DS.iddocumento equals D.iddocumento
                         join CS in db.CAJASUCURSAL on DS.idcajasucursal equals CS.idcajasucursal
                         where CS.idsucursal == idsucursal && DS.estado == "HABILITADO"
                         orderby D.descripcion
                         select new
                         {
                             descripcion = D.descripcion,
                             iddocumento = D.iddocumento,
                             idcajasucursal = DS.idcajasucursal,
                             serie = DS.serie,
                             actual = DS.actual,
                             codigosunat = D.codigosunat
                         }).ToList();
            return query;
        }
        private object DocumentosTributariosCaja(int? idcajasucursal)
        {
            var query = (from DS in db.CORRELATIVODOCUMENTO
                         join D in db.FDOCUMENTOTRIBUTARIO on DS.iddocumento equals D.iddocumento
                         where DS.idcajasucursal == idcajasucursal.Value && DS.estado == "HABILITADO"
                         orderby D.descripcion
                         select new
                         {
                             descripcion = D.descripcion,
                             iddocumento = D.iddocumento,
                             idcajasucursal = DS.idcajasucursal,
                             serie = DS.serie,
                             actual = DS.actual,
                             codigosunat = D.codigosunat
                         }).ToList();
            return query;
        }
    }
}
