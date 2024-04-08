using ENTIDADES.preingreso;
using Erp.SeedWork;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.ViewModel;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using Erp.Persistencia.Servicios;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INFRAESTRUCTURA.Areas.PreIngreso.EF
{
    public class AnalisisOrganolepticoEF : IAnalisisOrganolepticoEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> Appuser;
        public AnalisisOrganolepticoEF(Modelo context, IUser _user, UserManager<AppUser> Appuser_)
        {
            db = context;
            user = _user;
            Appuser = Appuser_;
        }

        public async Task<AnalisisOrganolepticoModel> datosinicioViewBagAsync()
        {
            try
            {
                AnalisisOrganolepticoModel model = new AnalisisOrganolepticoModel();
                model.documentotributario = await db.FDOCUMENTOTRIBUTARIO.Where(x => x.estado != "ELIMINADO").ToListAsync();                
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
                var obj = await db.PIANALISISORGANOLEPTICO.FirstOrDefaultAsync(m => m.idanalisisorganoleptico == id);
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
        public async Task<mensajeJson> RegistrarEditarAsync(PIAnalisisOrganoleptico objanalisis)
        {
            try { 
            var analisis = db.PIANALISISORGANOLEPTICO.Find(objanalisis.idanalisisorganoleptico);
            //if (analisis.idsucursal != user.getIdSucursalCookie())
            //    return new mensajeJson("La orden de compra ha sido asignada a otra sucursal", null);
            if (objanalisis.idanalisisorganoleptico is 0)
                return await RegistrarAsync(objanalisis);
            else
                return await EditarAsync(objanalisis);
            }
            catch(Exception e)
            {
                string msj = "";
                if (e.InnerException is null)
                    msj = e.InnerException.Message;
                return (new mensajeJson(e.Message, null));
            }

        }

        private async Task<mensajeJson> RegistrarAsync(PIAnalisisOrganoleptico analisis)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    //analisis.ano = DateTime.Now.Year;
                    //analisis.fecha = DateTime.Now;//EARTCOD1012
                    analisis.codigoanalisisorganoleptico = await generarcodigoAsync();
                    analisis.idsucursal = user.getIdSucursalCookie();
                    analisis.idempresa = user.getIdEmpresaCookie();
                    //analisis.idquimico = int.Parse(user.getIdUserSession());//EARTCOD1013
                    await db.PIANALISISORGANOLEPTICO.AddAsync(analisis);
                    await db.SaveChangesAsync();
                    //REGISTRAR DETALLE
                    
                    var detalle = JsonConvert.DeserializeObject<List<PIAnalisisOrgDetalle>>(analisis.jsondetalle);
                    for (int i = 0; i < detalle.Count; i++)
                    {
                       detalle[i].idanalisisorganoleptico = analisis.idanalisisorganoleptico; 
                    }
                    db.PIANALISISORGDETALLE.AddRange(detalle);
                    await db.SaveChangesAsync();

                    //GUARDAR CARACTERISTICAS DE EVALUACIÓN
                    var rescaracteristica = await GuardarCaracteristicaEvaluacionAsync(detalle);
                    if (rescaracteristica != "ok")
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("Error al guardar las características de evaluación", null));
                    }
                    transaccion.Commit();
                    return (new mensajeJson("ok", analisis));
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return (new mensajeJson(e.Message + "->" + error, null));
                }
            }
        }
        private async Task<mensajeJson> EditarAsync(PIAnalisisOrganoleptico analisis)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    //EDITAR CABECERA
                    analisis.idsucursal = user.getIdSucursalCookie();
                    analisis.idempresa = user.getIdEmpresaCookie();
                    //analisis.idquimico = int.Parse(user.getIdUserSession());//EARTCOD1013
                    //analisis.usuariomodifica = user.getIdUserSession();
                    db.PIANALISISORGANOLEPTICO.Update(analisis);
                    await db.SaveChangesAsync();

                    //EDITAR DETALLE             
                    var detalle = JsonConvert.DeserializeObject<List<PIAnalisisOrgDetalle>>(analisis.jsondetalle);
                    foreach(var itemdet in detalle)
                    {
                        itemdet.idanalisisorganoleptico = analisis.idanalisisorganoleptico;
                    }
                    db.UpdateRange(detalle);
                    await db.SaveChangesAsync();

                    //EDITAR CARACTERISTICAS DE EVALUACIÓN
                    var rescaracteristica = await EditarCaracteristicaEvaluacionAsync(detalle);
                    if (rescaracteristica != "ok")
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("Error al editar las características de evaluación", null));
                    }
                    transaccion.Commit();
                    return (new mensajeJson("ok", analisis));
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    var error = "";
                    if (e.InnerException != null)
                        error = e.InnerException.Message;
                    return (new mensajeJson(e.Message + "->" + error, null));
                }
            }
        }


        private async Task<string> GuardarCaracteristicaEvaluacionAsync(List<PIAnalisisOrgDetalle> detalle)
        {
            try
            {
                var detallecaracteristica = new List<PICaracteristicaDetalleAO>();
                foreach (var item in detalle)
                {
                     detallecaracteristica= JsonConvert.DeserializeObject<List<PICaracteristicaDetalleAO>>(item.detallecaracteristicajson);
                    for (int i=0;i< detallecaracteristica.Count();i++)
                    {
                        detallecaracteristica[i].iddetallepreingreso = item.iddetallepreingreso;
                        detallecaracteristica[i].idanalisisorgdetalle = item.idanalisisorgdetalle;
                        await db.PICARACTERISTICADETALLEAO.AddAsync(detallecaracteristica[i]);
                        await db.SaveChangesAsync();
                    }                   
                }
                
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        private async Task<string> EditarCaracteristicaEvaluacionAsync(List<PIAnalisisOrgDetalle> detalle)
        {
            try
            {
                List<PICaracteristicaDetalleAO> CaracTodosItemsEdit = new List<PICaracteristicaDetalleAO>();
                List<PICaracteristicaDetalleAO> CaracTodosItemsAdd = new List<PICaracteristicaDetalleAO>();
                var DetalleCaracEditados = new List<PICaracteristicaDetalleAO>();
                foreach (var item in detalle)
                {
                    DetalleCaracEditados = JsonConvert.DeserializeObject<List<PICaracteristicaDetalleAO>>(item.detallecaracteristicajson);
                    var CaracDetalleOriginal = db.PICARACTERISTICADETALLEAO.Where(x => x.idanalisisorgdetalle == item.idanalisisorgdetalle).ToList();
                    foreach(var itemOri in CaracDetalleOriginal)
                    {
                        //ANULO TODOS LAS CARACTERISTICAS DE ESE DETALLE.
                        itemOri.estado = "ANULADO";
                    }
                    foreach (var itemEditado in DetalleCaracEditados)
                    {
                        var iSiExisteRegistro = CaracDetalleOriginal.Where(x => x.idanalisisorgdetalle == itemEditado.idanalisisorgdetalle && x.idcaracteristicaao == itemEditado.idcaracteristicaao).FirstOrDefault();
                        if (iSiExisteRegistro != null)
                            iSiExisteRegistro.estado = "HABILITADO";
                        else
                            CaracTodosItemsAdd.Add(itemEditado);
                    }
                    db.UpdateRange(CaracDetalleOriginal);
                    await db.SaveChangesAsync();
                }

                //if (CaracTodosItemsEdit.Count > 0)
                //    db.UpdateRange(CaracTodosItemsEdit);
                if (CaracTodosItemsAdd.Count > 0)
                    db.AddRange(CaracTodosItemsAdd);
                await db.SaveChangesAsync();

                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        private async Task<string> generarcodigoAsync()
        {
            var tarea = await Task.Run(() =>
            {
                int empresa = user.getIdEmpresaCookie();
                int ano = DateTime.Now.Year;
                var num = db.PIANALISISORGANOLEPTICO.Where(X => X.idempresa == empresa &&  X.idsucursal == user.getIdSucursalCookie()).Count();
                //num = num + 1;
                //AgregarCeros ceros = new AgregarCeros();
                //var auxcodigo = ceros.agregarCeros(num);
                var año = DateTime.UtcNow.Year.ToString();
                var codigo = "AO" + user.getIdSucursalCookie().ToString() + empresa + año.Substring(2, 2) + num;
                return codigo;
            });

            return tarea;

        }

    }
}
