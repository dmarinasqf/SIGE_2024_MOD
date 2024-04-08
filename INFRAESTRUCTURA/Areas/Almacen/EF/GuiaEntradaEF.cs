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
    public class GuiaEntradaEF : IGuiaEntradaEF
    {
        private readonly Modelo db;
        private readonly IUser user;

        public GuiaEntradaEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }

        public async Task<GuiaEntradaModel> datosinicioViewBagAsync()
        {
            try
            {
                GuiaEntradaModel model = new GuiaEntradaModel();
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                model.empresa = await db.EMPRESA.Where(x => x.idempresa == idempresa).ToListAsync();
                model.sucursal = await db.SUCURSAL.Where(x => x.suc_codigo == idsucursal).ToListAsync();
                return model;
            }
            catch (Exception e)
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
                var obj = await db.AGUIAENTRADA.FirstOrDefaultAsync(m => m.idguiaentrada == id);
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
        public Task<mensajeJson> ListarGuiasEntradaAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<mensajeJson> RegistrarEditarAsync(AGuiaEntrada obj)
        {
            try
            {
                List<ADetalleGuiaEntrada> detalleguia = new List<ADetalleGuiaEntrada>();
                detalleguia = JsonConvert.DeserializeObject<List<ADetalleGuiaEntrada>>(obj.jsondetalle);
                if (obj.idguiaentrada == 0)
                {
                    using (var transaccion = await db.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var guiasalida = await db.AGUIASALIDA.FindAsync(obj.idguiasalida);
                            obj.idempleado = user.getIdUserSession();
                            obj.idempresa = user.getIdEmpresaCookie();
                            obj.idsucursal = user.getIdSucursalCookie();
                            obj.idsucursalenvia = guiasalida.idsucursal;
                            obj.codigo = await generarcodigoAsync(obj.idempresa, obj.idsucursal);
                            obj.estado = "HABILITADO";
                            await db.AGUIAENTRADA.AddAsync(obj);
                            await db.SaveChangesAsync();
                            detalleguia.ForEach(x => x.idguiaentrada = obj.idguiaentrada);                           
                            await db.ADETALLEGUIAENTRADA.AddRangeAsync(detalleguia);
                            await db.SaveChangesAsync();
                            guiasalida.iseditable = false;
                            guiasalida.estadoguia = "ENTREGADO";
                            db.AGUIASALIDA.Update(guiasalida);
                            await db.SaveChangesAsync();

                            //Para ejecutar el trigger de DetalleGuiaSalida.
                            var detalleGuiaSalida = await db.ADETALLEGUIASALIDA.Where(x => x.idguiasalida == guiasalida.idguiasalida && x.cantidadpicking > 0 && x.estado == "HABILITADO").ToListAsync();
                            //foreach (var item in detalleGuiaSalida)
                            //{
                            //    db.Update(item);
                            //    await db.SaveChangesAsync();
                            //}
                            db.UpdateRange(detalleGuiaSalida);
                            await db.SaveChangesAsync();

                            await transaccion.CommitAsync();
                            return (new mensajeJson("ok", obj));

                        }
                        catch (Exception e)
                        {
                            string msj = "";
                            if (e.InnerException is not null)
                                msj = e.InnerException.Message;
                            await transaccion.RollbackAsync();
                            return new mensajeJson(e.Message + '-' + msj, null);

                        }
                    }
                }
                else
                {
                    using (var transaccion = await db.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var aux = await db.AGUIAENTRADA.FindAsync(obj.idguiaentrada);
                            obj.codigo = aux.codigo;
                            obj.idempresa = aux.idempresa;
                            obj.idsucursal = aux.idsucursal;
                            obj.idsucursalenvia = aux.idsucursalenvia;
                            obj.estado = aux.estado;
                            obj.idempleado = aux.idempleado;
                            db.AGUIAENTRADA.Update(obj);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        catch (Exception e)
                        {
                            string msj = "";
                            try { msj = e.InnerException.Message; }
                            catch (Exception) { msj = ""; }
                            await transaccion.RollbackAsync();
                            return new mensajeJson(e.Message + '-' + msj, null);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message + '-' + e.InnerException.Message, null);
            }

        }

        private async Task<string> generarcodigoAsync(int idempresa, int idsucursal)
        {
            //var task = Task.Run(() => {
            string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AGUIAENTRADA.Where(x => x.idempresa == idempresa && x.idsucursal == idsucursal).Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = correlativoempresa + año.Substring(2, 2) + auxcodigo;
            return codigo;
            //});
            //return task;


        }
    }
}
