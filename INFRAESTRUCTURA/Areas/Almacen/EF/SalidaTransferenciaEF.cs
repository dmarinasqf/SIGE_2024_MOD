using ENTIDADES.Almacen;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class SalidaTransferenciaEF : ISalidaTransferencia
    {
        private readonly Modelo db;
        private readonly IUser user;

        public SalidaTransferenciaEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }

        public Task<mensajeJson> ListarAsync(string id, string codigo, string idsucursalorigen, string idsucursaldestino, string fecha)
        {
            throw new NotImplementedException();
        }

        //public async Task<mensajeJson> RegistrarAsync(ASalidaTransferencia salida)
        //{
        //    using (var transaccion = db.Database.BeginTransaction())
        //    {
        //        try
        //        {
        //            var detalle = JsonConvert.DeserializeObject<List<ASalidaTransferenciaDetalle>>(salida.jsondetalle);

        //            if (salida.idsalidatransferencia is 0)
        //            {
        //                salida.estado = "HABILITADO";
        //                salida.idempresa = user.getIdEmpresaCookie();
        //                salida.idsucursal = user.getIdSucursalCookie();
        //                salida.fechatraslado = DateTime.Now;
        //                salida.codigo = await generarcodigoAsync(salida.idempresa);
        //                db.Add(salida);
        //                await db.SaveChangesAsync();


        //                for (int i = 0; i < detalle.Count; i++)
        //                {
        //                    detalle[i].idsalidatransferencia = salida.idsalidatransferencia;
        //                    detalle[i].estado = "HABILITADO";
        //                }
        //                db.AddRange(detalle);
        //                await db.SaveChangesAsync();


        //                transaccion.Commit();
        //                return new mensajeJson("ok", salida.idsalidatransferencia);
        //            }
        //            else
        //            {
        //                transaccion.Rollback();
        //                return new mensajeJson("El ingreso ya ha sido registrado", null);

        //            }
        //        }
        //        catch (Exception e)
        //        {

        //            transaccion.Rollback();
        //            var error = "";
        //            if (e.InnerException != null)
        //                error = e.InnerException.Message;
        //            return new mensajeJson(e.Message + " " + error, null);
        //        }
        //    }
        //}

        //public async Task<mensajeJson> AnularAsync(long? id)
        //{
        //    using (var transaction = await db.Database.BeginTransactionAsync())
        //    {
        //        try
        //        {
        //            var obj = await db.ASALIDATRANSFERENCIA.FirstOrDefaultAsync(m => m.idsalidatransferencia == id);
        //            if (obj != null)
        //            {
        //                if (obj.estadoguia == "ENTREGADO" || obj.estadoguia == "ANULADO")
        //                    return new mensajeJson("La guía se encuentra " + obj.estadoguia, obj);
        //                obj.estadoguia = "ANULADO";
        //                db.ASALIDATRANSFERENCIA.Update(obj);
        //                await db.SaveChangesAsync();
        //                var lista = await db.ASALIDATRANSFERENCIADETALLE.Where(x => x.idsalidatransferencia == id && x.estado != "ELIMINADO").ToListAsync();
        //                for (int i = 0; i < lista.Count(); i++)
        //                    lista[i].estado = "ANULADO";


        //                db.ASALIDATRANSFERENCIADETALLE.UpdateRange(lista);
        //                await db.SaveChangesAsync();
        //                await transaction.CommitAsync();
        //                return (new mensajeJson("ok", obj));
        //            }
        //            else
        //            {
        //                await transaction.CommitAsync();
        //                return new mensajeJson("No se encontró la Guía", obj);
        //            }
        //        }
        //        catch (Exception e)
        //        {
        //            await transaction.RollbackAsync();
        //            return new mensajeJson(e.Message, null);
        //        }
        //    }

        //}
        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                if (id is 0 || id is null)
                    return (new mensajeJson("nuevo", null));
                var obj = await db.ASALIDATRANSFERENCIA.FirstOrDefaultAsync(m => m.idsalidatransferencia == id);
                if (obj is null)
                    return (new mensajeJson("notfound", null));
                else if (obj.estado == "ELIMINADO")
                    return (new mensajeJson("notfound", null));
                else
                {
                    if (obj.idempresa == idempresa && obj.idsucursal == idsucursal)
                        return (new mensajeJson("ok", obj));
                    else
                    {
                        var empresa = await db.EMPRESA.FindAsync(obj.idempresa);
                        var sucursal = await db.SUCURSAL.FindAsync(obj.idsucursal);
                        return (new mensajeJson("Este registro pertenece a la empresa " + empresa.descripcion + ", Sucursal " + sucursal.descripcion, null));
                    }
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<SalidaTransferenciaModel> datosinicioAsync()
        {
            try
            {
                SalidaTransferenciaModel model = new SalidaTransferenciaModel();
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                model.empresa = await db.EMPRESA.Where(x => x.idempresa == idempresa).ToListAsync();
                model.clase = await db.ACLASE.Where(x => x.estado != "ELIMINADO").ToListAsync();
                var sucursales = await (from s in db.SUCURSAL
                                        join ASU in db.AALMACENSUCURSAL
                                        on s.suc_codigo equals ASU.suc_codigo
                                        where s.estado != "DESHABILITADO" && s.estado != "ELIMINADO"
                                        && s.idempresa == idempresa
                                        orderby s.descripcion
                                        select new SUCURSAL
                                        {
                                            descripcion = s.descripcion,
                                            suc_codigo = s.suc_codigo
                                        }).Distinct().ToListAsync();
                model.sucursal = sucursales;
                model.movimiento = await db.ATIPOMOVIMIENTO.Where(x => x.estado != "ELIMNADO").ToListAsync();
                return model;
            }
            catch (Exception e)
            {
                return null;
            }

        }

        //private async Task<string> generarcodigoAsync(int idempresa)
        //{
        //    string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
        //    int ano = DateTime.Now.Year;
        //    var num = db.AGUIASALIDA.Where(x => x.idempresa == idempresa && x.ano == ano).Count();

        //    num = num + 1;
        //    AgregarCeros ceros = new AgregarCeros();
        //    var auxcodigo = ceros.agregarCeros(num);
        //    var año = DateTime.UtcNow.Year.ToString();
        //    var codigo = correlativoempresa + año.Substring(2, 2) + auxcodigo;
        //    return codigo;
        //}
    }
}