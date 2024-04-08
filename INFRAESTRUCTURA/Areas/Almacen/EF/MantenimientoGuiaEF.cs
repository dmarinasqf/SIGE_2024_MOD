using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Math;
using ENTIDADES.Almacen;
using ENTIDADES.gdp;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Erp.Persistencia.Servicios.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class MantenimientoGuiaEF : IMantenimientoGuiaEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;

        public MantenimientoGuiaEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }
        public async Task<List<AGuiaSalida>> ListarAsync()
        {
            return (await db.AGUIASALIDA.Where(x => x.estado != "ELIMINADO").ToListAsync());
        }
        public async Task<mensajeJson> MantenimientoGuiaRegistrarEditarAsync(AGuiaSalida obj, string jsondetalleeliminar)
        {
            try
            {
                List<ADetalleGuiaSalida> detalleguia = new List<ADetalleGuiaSalida>();
                List<long> detalleeliminar = new List<long>();
                detalleguia = JsonConvert.DeserializeObject<List<ADetalleGuiaSalida>>(obj.jsondetalle);
                detalleeliminar = JsonConvert.DeserializeObject<List<long>>(jsondetalleeliminar);

                //CREA UNA NUEVA GUIA Y DETALLE GUIA
                if (obj.idguiasalida == 0)
                {
                    await db.AGUIASALIDA.AddAsync(obj);
                    await db.SaveChangesAsync();
                    await db.ADETALLEGUIASALIDA.AddRangeAsync(detalleguia);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                    return await EditarMantenimientoGuia(obj, detalleguia, detalleeliminar);
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public async Task<mensajeJson> EditarMantenimientoGuia(AGuiaSalida guia, List<ADetalleGuiaSalida> detalle,
            List<long> detalleeliminar)
        {
            using (var transaccion = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    var aux = await db.AGUIASALIDA.FindAsync(guia.idguiasalida);
                    if (aux != null)
                    {
                        aux.idalmacensucursaldestino = guia.idalmacensucursaldestino;
                        aux.estadoguia = guia.estadoguia;
                        aux.fechatraslado = guia.fechatraslado;
                        aux.idempresatransporte = guia.idempresatransporte;
                        aux.idvehiculo = guia.idvehiculo;
                        aux.observacion = guia.observacion;
                        if (guia.estadoguia == "TRANSITO")
                            aux.fechatraslado = DateTime.Now;
                        if (aux.idempleadomantenimiento is null)
                            aux.idempleadomantenimiento = user.getIdUserSession();
                        db.AGUIASALIDA.Update(aux);
                        await db.SaveChangesAsync();
                        //Modificar cantidades del detalle
                        for (int i = 0; i < detalle.Count; i++)
                        {
                            //EDITAR CANTIDADES DE GUIA
                            var itemaux = await db.ADETALLEGUIASALIDA.FindAsync(detalle[i].iddetalleguiasalida);
                            if (itemaux != null)
                            {
                                itemaux.estado = detalle[i].estado;
                                itemaux.cantidadgenerada = detalle[i].cantidadgenerada;
                                itemaux.cantidadanterior = detalle[i].cantidadanterior;
                                if (itemaux.cantidadpicking > itemaux.cantidadgenerada)
                                    itemaux.cantidadpicking = itemaux.cantidadgenerada;
                                db.ADETALLEGUIASALIDA.Update(itemaux);
                                await db.SaveChangesAsync();
                            }
                        }
                        //Realiza el borrado lógico
                        for (int i = 0; i < detalleeliminar.Count; i++)
                        {
                            var itemaux = await db.ADETALLEGUIASALIDA.FindAsync(detalleeliminar[i]);
                            if (itemaux != null)
                            {
                                itemaux.estado = "ELIMINADO";
                                db.ADETALLEGUIASALIDA.Update(itemaux);
                                await db.SaveChangesAsync();
                            }
                        }
                        await transaccion.CommitAsync();
                        //SI TODOS LOS ITEMS SON ANULADOS DE ANULA LA GUIA
                        var listahabilitados = await db.ADETALLEGUIASALIDA.Where(x => x.idguiasalida == guia.idguiasalida &&
                         x.estado != "ELIMINADO").ToListAsync();
                        if (listahabilitados.Count == 0)
                        {
                            aux.estadoguia = "ANULADO";
                            db.AGUIASALIDA.Update(aux);
                            await db.SaveChangesAsync();
                        }
                        return new mensajeJson("ok", aux);
                    }
                    else
                    {
                        await transaccion.RollbackAsync();
                        return new mensajeJson("notfound", null);
                    }

                }
                catch (Exception e)
                {
                    await transaccion.RollbackAsync();
                    return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
                }
            }
        }
        public async Task<mensajeJson> AnularDuplicarAsync(AGuiaSalida obj)
        {
            using (var transaction = await db.Database.BeginTransactionAsync())
            {//ANULAR GUIA
                var detalle = JsonConvert.DeserializeObject<List<ADetalleGuiaSalida>>(obj.jsondetalle);
                try
                {
                    var aux = await db.AGUIASALIDA.FirstOrDefaultAsync(m => m.idguiasalida == obj.idguiasalida);
                    if (aux != null)
                    {
                        if (aux.idventa == null)
                        {
                            aux.estadoguia = "ANULADO";
                            db.AGUIASALIDA.Update(aux);
                            await db.SaveChangesAsync();
                            var lista = await db.ADETALLEGUIASALIDA.Where(x => x.idguiasalida == obj.idguiasalida && x.estado != "ELIMINADO").ToListAsync();
                            for (int i = 0; i < lista.Count(); i++)
                            {
                                lista[i].estado = "ANULADO";
                                db.ADETALLEGUIASALIDA.Update(lista[i]);
                                await db.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            return new mensajeJson("La Guia fue facturada", aux);
                        }
                    }
                    else
                    {
                        return new mensajeJson("No se encontró la Guía", aux);
                    }
                    //DUPLICAR GUIA DISTRIBUCION
                    
                    int idempresa = user.getIdEmpresaCookie();
                    int idsucursal = user.getIdSucursalCookie();
                    AGuiaSalida guia = new AGuiaSalida();
                    guia = obj;
                    guia.idguiasalida = 0;
                    guia.codigo = generarcodigoAsync(idempresa, idsucursal);
                    guia.estado = "HABILITADO";
                    guia.idalmacensucursalorigen = aux.idalmacensucursalorigen;
                    guia.seriedoc = aux.seriedoc;
                    guia.idcaja = aux.idcaja;
                    guia.idcorrelativo = aux.idcorrelativo;
                    guia.idempresa = idempresa;
                    guia.idsucursal = idsucursal;
                    guia.idsucursaldestino = aux.idsucursaldestino;
                    guia.idempleadomantenimiento = user.getIdSucursalUsuario();
                    guia.ano= DateTime.UtcNow.Year;
                    guia.idventa = aux.idventa;
                    guia.idproveedor = aux.idproveedor;
                    guia.idtipoguia = aux.idtipoguia;
                    guia.bultos = aux.bultos;
                    guia.peso_total = aux.peso_total;
                    guia.IdDistribucion = aux.IdDistribucion;
                    guia.idcliente = aux.idcliente;
                    await db.AddAsync(guia);
                    await db.SaveChangesAsync();
                    for(int j=0;j< detalle.Count; j++)
                    {
                        detalle[j].iddetalleguiasalida = 0;
                        detalle[j].idguiasalida = guia.idguiasalida;
                        //detalle[j].cantidadpicking = 0;
                        //detalle[j].cantidadanterior = 0;
                        
                    }
                    await db.AddRangeAsync(detalle);
                    await db.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return (new mensajeJson("ok", guia));
                }
                catch (Exception e)
                {
                    string msjinner = "";
                    try { msjinner = e.InnerException.Message; } catch (Exception) { msjinner = ""; }

                    await transaction.RollbackAsync();
                    return new mensajeJson(e.Message + "-" + msjinner, null);
                }
                //
            }
        }
        public async Task<mensajeJson> AnularAsync(long? id)
        {
            using (var transaction = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    var obj = await db.AGUIASALIDA.FirstOrDefaultAsync(m => m.idguiasalida == id);
                    if (obj != null)
                    {
                        if (obj.idventa == null)
                        {
                            obj.estadoguia = "ANULADO";
                            db.AGUIASALIDA.Update(obj);
                            await db.SaveChangesAsync();
                            var lista = await db.ADETALLEGUIASALIDA.Where(x => x.idguiasalida == id && x.estado != "ELIMINADO").ToListAsync();
                            for (int i = 0; i < lista.Count(); i++)
                            {
                                lista[i].estado = "ANULADO";
                                db.ADETALLEGUIASALIDA.Update(lista[i]);
                                await db.SaveChangesAsync();
                            }
                            await transaction.CommitAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        else
                        {
                            return (new mensajeJson("La Guia fue facturada", obj));
                        }
                        
                    }
                    else
                    {
                        await transaction.CommitAsync();
                        return new mensajeJson("No se encontró la Guía", obj);
                    }
                }
                catch (Exception e)
                {
                    await transaction.RollbackAsync();
                    return new mensajeJson(e.Message, null);
                }
            }
        }
        public async Task<mensajeJson> HabilitarAsync(int? id)
        {
            var obj = await db.AGUIASALIDA.FirstOrDefaultAsync(m => m.idguiasalida == id);
            obj.estado = "HABILITADO";
            db.Update(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", obj));

        }
        public async Task<GuiaSalidaModel> datosinicioAsync()
        {
            try
            {
                GuiaSalidaModel model = new GuiaSalidaModel();
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
                return model;
            }
            catch (Exception)
            {
                return null;
            }

        }
        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                if (id is 0 || id is null)
                    return (new mensajeJson("nuevo", null));
                var obj = await db.AGUIASALIDA.FirstOrDefaultAsync(m => m.idguiasalida == id);
                if (obj is null)
                    return (new mensajeJson("notfound", null));
                else if (obj.estado == "ELIMINADO")
                    return (new mensajeJson("notfound", null));
                else
                {
                    if (obj.idempresa == idempresa && obj.idsucursal == idsucursal)
                    {
                        if(obj.idempleadomantenimiento is null)
                            obj.empleado = new EMPLEADO { userName = user.getUserNameAndLast() };
                        
                        return (new mensajeJson("ok", obj));
                    }
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
        //public async Task<AGuiaSalida> BuscarGuiaSalidaAsync(int? id,int idempresa)
        //{
        //    var obj = await db.AGUIASALIDA.Where(x=>x.idguiasalida==id && x.idempresa==idempresa).FirstOrDefaultAsync();
        //    if (obj is null)
        //        obj = new AGuiaSalida { idguiasalida=0};
        //    return obj;
        //}
        private string generarcodigoAsync(int idempresa,int idsucursal)
        {
            string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AGUIASALIDA.Where(x => x.idempresa == idempresa && x.ano == ano).Count();

            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = correlativoempresa+idsucursal.ToString() + año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
    }
}
