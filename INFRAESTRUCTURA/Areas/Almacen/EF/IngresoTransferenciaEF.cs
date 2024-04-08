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
    public class IngresoTransferenciaEF : IIngresoTransferenciaEF
    {
        private readonly Modelo db;
        private readonly IUser user;

        public IngresoTransferenciaEF(Modelo context, IUser _user)
        {
            db = context;
            user = _user;
        }
        public async Task<IngresoTransferenciaModel> datosinicioViewBagAsync()
        {
            try
            {
                IngresoTransferenciaModel model = new IngresoTransferenciaModel();
                int idempresa = user.getIdEmpresaCookie();
                int idsucursal = user.getIdSucursalCookie();
                model.empresa = await db.EMPRESA.Where(x => x.idempresa == idempresa).ToListAsync();
                model.sucursal = await db.SUCURSAL.Where(x=>x.suc_codigo == idsucursal).ToListAsync();
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
                var obj = await db.AINGRESOTRANSFERENCIA.FirstOrDefaultAsync(m => m.idingresotransferencia == id);
                if (obj is null)
                    return (new mensajeJson("notfound", null));
                else if (obj.estado == "ELIMINADO")
                    return (new mensajeJson("notfound", null));
                else
                {
                    if (obj.idempresa == idempresa && obj.idsucursal==idsucursal)
                        return (new mensajeJson("ok", obj));
                    else
                    {
                        var empresa = await db.EMPRESA.FindAsync(obj.idempresa);
                        var sucursal = await db.SUCURSAL.FindAsync(obj.idsucursal);
                        return (new mensajeJson("Este registro pertenece a la empresa "+empresa.descripcion+", Sucursal "+sucursal.descripcion, null));
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

        public async Task<mensajeJson> RegistrarEditarAsync(AIngresoTransferencia obj)
        {
            try
            {
                List<AIngresoTransferenciaDetalle> detalleguia = new List<AIngresoTransferenciaDetalle>();
                detalleguia = JsonConvert.DeserializeObject<List<AIngresoTransferenciaDetalle>>(obj.jsondetalle);
                if (obj.idingresotransferencia == 0)
                {
                    using (var transaccion = await db.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var salida = await db.ASALIDATRANSFERENCIA.FindAsync(obj.idsalidatransferencia);
                            obj.idempleado = user.getIdUserSession();
                            obj.idempresa = user.getIdEmpresaCookie();
                            obj.idsucursal = user.getIdSucursalCookie();
                            obj.idsucursalenvia = salida.idsucursal;
                            obj.codigo =await generarcodigoAsync(obj.idempresa,obj.idsucursal);
                            obj.estado = "HABILITADO";
                            await db.AINGRESOTRANSFERENCIA.AddAsync(obj);
                            await db.SaveChangesAsync();
                            for(int i = 0; i < detalleguia.Count; i++)
                            {
                                detalleguia[i].idingresotransferencia = obj.idingresotransferencia;
                                await db.AINGRESOTRANSFERENCIADETALLE.AddRangeAsync(detalleguia[i]);
                                await db.SaveChangesAsync();
                            }                                               
                            //CAMBIAR EL ESTADO DE LA TRANSFERENCIA A ENTREGADO
                            salida.iseditable = false;
                            salida.estadoguia = "ENTREGADO";
                            db.ASALIDATRANSFERENCIA.Update(salida);
                            await db.SaveChangesAsync();
                            await transaccion.CommitAsync();
                            return (new mensajeJson("ok", obj));
                             
                        }
                        catch (Exception e)
                        {
                            string msjinner = "";
                            try { msjinner = e.InnerException.Message; }
                            catch (Exception) { msjinner = ""; }
                            await transaccion.RollbackAsync();
                            return new mensajeJson(e.Message + '-' + msjinner, null);
                            
                        }
                    }
                }
                else
                {
                    using (var transaccion = await db.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var aux = await db.AINGRESOTRANSFERENCIA.FindAsync(obj.idsalidatransferencia);
                            obj.codigo = aux.codigo;                           
                            obj.idempresa = aux.idempresa ;
                            obj.idsucursal= aux.idsucursal;
                            obj.idsucursalenvia = aux.idsucursalenvia;
                            obj.estado= aux.estado ;
                            obj.idempleado = aux.idempleado;                           
                            db.AINGRESOTRANSFERENCIA.Update(obj);
                             await db.SaveChangesAsync();
                            return (new mensajeJson("ok", obj));
                        }
                        catch (Exception e)
                        {
                            string msjinner = "";
                            try { msjinner = e.InnerException.Message; }
                            catch (Exception) { msjinner = ""; }
                            await transaccion.RollbackAsync();
                            return new mensajeJson(e.Message + '-' + msjinner, null);
                            
                        }
                    }
                }
            }
            catch (Exception e)
            {
                string msjinner = "";
                try { msjinner = e.InnerException.Message; }
                catch (Exception) { msjinner = ""; }
                return new mensajeJson(e.Message + '-' + msjinner, null);
            }

        }
       
        private async Task<string> generarcodigoAsync(int idempresa,int idsucursal)
        {
            string correlativoempresa = db.EMPRESA.Find(idempresa).correlativo;
            int ano = DateTime.Now.Year;
            var num = db.AINGRESOTRANSFERENCIA.Where(x => x.idempresa == idempresa && x.idsucursal== idsucursal).Count();
            num = num + 1;
            AgregarCeros ceros = new AgregarCeros();
            var auxcodigo = ceros.agregarCeros(num);
            var año = DateTime.UtcNow.Year.ToString();
            var codigo = correlativoempresa + idsucursal .ToString()+ año.Substring(2, 2) + auxcodigo;
            return codigo;
        }
    }
}
