using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using Erp.Persistencia.Modelos;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Erp.SeedWork;
using ENTIDADES.ventas;
using Erp.Persistencia.Servicios.Users;
using System.Threading.Tasks;
using ENTIDADES.Generales;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using Newtonsoft.Json;

namespace INFRAESTRUCTURA.Areas.Ventas.EF
{
    public class CajaVentaEF : ICajaVentaEF
    {
        private readonly Modelo db;
        private readonly IUser user;
        private readonly UserManager<AppUser> appuser;
        public CajaVentaEF(Modelo _db, IUser _user, UserManager<AppUser> userManager)
        {
            db = _db;
            user = _user;
            appuser = userManager;
        }
        public object ListarCajaSucursal(int idsucursal)
        {
            var query = (from CS in db.CAJASUCURSAL
                         join C in db.CAJA on CS.idcaja equals C.idcaja
                         where CS.idsucursal == idsucursal && CS.estado == "HABILITADO"
                         orderby C.descripcion
                         select new
                         {
                             idcajasucursal = CS.idcajasucursal,
                             descripcion = C.descripcion,
                             aperturado = CS.aperturado
                         }
                         ).ToList();
            return query;
        }

        public mensajeJson AperturarCaja(int idcajasucursal, decimal? montoinicial)
        {
            var cajasabiertas = db.APERTURACAJA.Where(x => x.estado == "APERTURADA" && x.usuarioapertura == user.getIdUserSession()).ToList();
            //verificar si usuario ha aperturado caja
            if (cajasabiertas.Count > 0)
            {
                var cajasucursal = db.CAJASUCURSAL.Find(cajasabiertas[0].idcajasucursal);
                var sucursal = db.SUCURSAL.Find(cajasucursal.idsucursal);
                if (cajasabiertas.Count == 1)
                    return new mensajeJson("UD. tiene aperturada una caja del día " + cajasabiertas[0].fechaapertura.Value.ToString()+" en la sucursal "+ sucursal.descripcion, null);
                else
                    return new mensajeJson($"UD. tiene aperturada  {cajasabiertas.Count} cajas", null);
            }
            //verificar si la caja esta cerrada
            var caja = db.CAJASUCURSAL.Find(idcajasucursal);
            if (caja.aperturado.HasValue && caja.aperturado.Value)
                return new mensajeJson("La caja esta aperturada por otro usuario", null);

            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var aperturacaja = new AperturarCaja();
                    aperturacaja.idcajasucursal = idcajasucursal;
                    aperturacaja.montoinicial = montoinicial;
                    aperturacaja.fechaapertura = DateTime.Now;
                    aperturacaja.usuarioapertura = user.getIdUserSession();
                    aperturacaja.estado = "APERTURADA";
                    //guardar caja aperturada
                    db.Add(aperturacaja);
                    db.SaveChanges();
                    //actualizar estado de caja
                    caja.aperturado = true;
                    caja.iseditable = false;
                    db.Update(caja);
                    db.SaveChanges();
                    transaccion.Commit();
                    return new mensajeJson("ok", null);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }
        }
        public async Task<mensajeJson> CerrarCajaAsync(int idapertura, List<CerrarCaja> cierre,string observaciones)
        {
            try
            {
                var cajaabierta = db.APERTURACAJA.Find(idapertura);
                if (cajaabierta.estado == "CERRADA")
                    return new mensajeJson("La caja ya ha sido cerrada el día " + cajaabierta.fechacierre, null);
                //verificar si el usuario que cierra es el que aperturo
                bool cerrar = true;
                if (cajaabierta.usuarioapertura != user.getIdUserSession())
                    cerrar = false;
                //verificar si esta en los roles de auditoria o administrador
                var usuario = await appuser.FindByIdAsync(user.getIdUserSession());                
                if (!cerrar &&(await appuser.IsInRoleAsync(usuario, "AUDITORIA CAJA") || await appuser.IsInRoleAsync(usuario, "ADMINISTRADOR")))
                    cerrar = true;
                if(cerrar)
                {
                    cajaabierta.estado = "CERRADA";
                    cajaabierta.observaciones = observaciones;
                    cajaabierta.fechacierre = DateTime.Now;
                    cajaabierta.usuariocierra = user.getIdUserSession();
                    db.Update(cajaabierta);
                    db.SaveChanges();
                    var cajasucursal = db.CAJASUCURSAL.Find(cajaabierta.idcajasucursal);
                    cajasucursal.aperturado = false;
                    cajasucursal.iseditable = false;
                    db.Update(cajasucursal);
                    db.SaveChanges();

                    //cierre.ForEach(c => c.idaperturarcaja = idapertura);
                    for (int i = 0; i < cierre.Count; i++)
                        cierre[i].idaperturarcaja = idapertura;
                    db.AddRange(cierre);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", cajaabierta.idaperturacaja);
                }
                return new mensajeJson("UD. No ha Aperturado esta caja.",null);
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
           
        }

        public mensajeJson VerificarAperturaCaja(string idempleado)
        {
            if (idempleado is null || idempleado is "")
            {
                idempleado = user.getIdUserSession();
            }
            var cajaabierta = listarcajaabiertausuarios(idempleado);
            if (cajaabierta.Count == 0)
                return new mensajeJson("UD. No ha aperturado caja", new object());
            else
            {
                if (cajaabierta[0].fechaapertura.Value.Date != DateTime.Now.Date)
                    return new mensajeJson("UD. no ha cerrado la caja del día " + cajaabierta[0].fechaapertura.ToString(), new object());
                else
                    return new mensajeJson("ok", GetCajaAperturada(cajaabierta[0].idaperturacaja));
            }
        }
        public mensajeJson VerificarSiHayCajaAbiertaParaCierre(string idempleado)
        {
            if (idempleado is null || idempleado is "")
            {
                idempleado = user.getIdUserSession();
            }
            var cajaabierta = listarcajaabiertausuarios(idempleado);
            if (cajaabierta.Count == 0)
                return new mensajeJson("no hay", null);
            else
            {
                var caja = GetCajaAperturada(cajaabierta[0].idaperturacaja);
                return new mensajeJson("ok", caja);
            }

        }              
        public int ObtenerCajaAbierta(string idempleado)
        {
            int res = -1;
            if (idempleado is null)
                idempleado = user.getIdUserSession();
            if (idempleado is null)
                return -1;
            var idsucursal = user.getIdSucursalCookie();
         
            var cajaaperturada = (from ca in db.APERTURACAJA
                         join cs in db.CAJASUCURSAL on ca.idcajasucursal equals cs.idcajasucursal
                         where cs.idsucursal==idsucursal && ca.usuarioapertura == idempleado && ca.estado == "APERTURADA" select ca).ToList().LastOrDefault();
            if (cajaaperturada != null)
                return cajaaperturada.idaperturacaja;
            return res;
        }

        public mensajeJson GetDatosCierreCajaPDF(int idaperturacaja)
        {
            var verificar = db.APERTURACAJA.Find(idaperturacaja);
            if (verificar is null)
                return new mensajeJson("No existe la caja", null);
            if(verificar.estado!="CERRADA")
                return new mensajeJson("La caja no ha sido cerrada", null);

            var datoscierre = db.CERRARCAJA.Where(x => x.estado != "ELIMINADO" && x.idaperturarcaja == idaperturacaja).ToList();
            var cajaaperturada = GetCajaAperturada(idaperturacaja);
            var gastos = GetEgresosCaja(idaperturacaja);
            return new mensajeJson("ok", new
            {
                datoscierre = datoscierre,
                cajaaperturada = cajaaperturada,
                gastos= gastos
            });

        }
        public object ListarCajaAbiertas()
        {
            var query = (from AP in db.APERTURACAJA
                         join CS in db.CAJASUCURSAL on AP.idcajasucursal equals CS.idcajasucursal
                         join C in db.CAJA on CS.idcaja equals C.idcaja
                         join E in db.EMPLEADO on AP.usuarioapertura equals E.emp_codigo.ToString()
                         join S in db.SUCURSAL on CS.idsucursal  equals S.suc_codigo
                         where AP.estado=="APERTURADA" orderby S.descripcion
                         select new
                         {
                             idaperturacaja = AP.idaperturacaja,
                             sucursal= S.descripcion,
                             fechaapertura=AP.fechaapertura,
                             caja=C.descripcion,
                             empleadoapertura=E.nombres+" "+E.apePaterno+" "+E.apeMaterno
                         }
                        ).ToList();
            return query;
        }
        
        public object GetCajaAperturada(int idaperturacaja)
        {
            var cajaabierta = db.APERTURACAJA.Find(idaperturacaja);
            var cajasucursal = db.CAJASUCURSAL.Find(cajaabierta.idcajasucursal);
            var empleadoapertura = db.EMPLEADO.Find(int.Parse(cajaabierta.usuarioapertura));
            var sucursal = db.SUCURSAL.Find(cajasucursal.idsucursal).descripcion;
            EMPLEADO empleadocierra= new EMPLEADO { nombres="",apeMaterno="",apePaterno=""};
            if (cajaabierta.usuariocierra != null)
                 empleadocierra = db.EMPLEADO.Find(int.Parse(cajaabierta.usuariocierra));
            var caja = (from AP in db.APERTURACAJA
                        join CS in db.CAJASUCURSAL on AP.idcajasucursal equals CS.idcajasucursal
                        join C in db.CAJA on CS.idcaja equals C.idcaja
                        
                        where AP.idaperturacaja == idaperturacaja
                        select new
                        {
                            sucursal= sucursal,
                            idcaja = CS.idcajasucursal,
                            idcajasucursal=CS.idcajasucursal,
                            idaperturacaja = AP.idaperturacaja,
                            caja = C.descripcion,                           
                            fechaapertura = AP.fechaapertura.Value.ToShortDateString()  +" " + AP.fechaapertura.Value.ToShortTimeString(),
                            observaciones=AP.observaciones??"",
                            fechacierre = (AP.fechacierre == null)?"": AP.fechacierre.Value.ToShortDateString() + " " + AP.fechacierre.Value.ToShortTimeString(),
                            usuarioapertura= empleadoapertura.nombres+" "+ empleadoapertura.apePaterno+" "+ empleadoapertura.apeMaterno,
                            usuariocierra= empleadocierra.nombres+" "+ empleadocierra.apePaterno+" "+ empleadocierra.apeMaterno,
                        }).FirstOrDefault();
            return caja;
        }
        private object GetEgresosCaja(int idaperturacaja)
        {
            var query = (from e in db.EGRESOS 
                         join te in db.TIPOEGRESO on e.tipoegreso_codigo equals te.tipoegreso_codigo
                         where e.idaperturacaja==idaperturacaja && e.estado=="HABILITADO"
                         select new { 
                             e.monto,
                             descripcion=e.detallegastos??"",
                             tipo=te.descripcion
                         }).ToList();
            return query;
        }
        public object ListarCajasPorfechaYUsuario(DateTime fecha, int usuario)
        {
           
            var caja = (from AP in db.APERTURACAJA
                        join CS in db.CAJASUCURSAL on AP.idcajasucursal equals CS.idcajasucursal
                        join C in db.CAJA on CS.idcaja equals C.idcaja
                        join S in db.SUCURSAL on CS.idsucursal equals S.suc_codigo
                        where AP.fechaapertura.Value.Date == fecha.Date && AP.usuarioapertura==usuario.ToString()
                        select new
                        {
                            sucursal = S.descripcion,                           
                            idaperturacaja = AP.idaperturacaja,
                            caja = C.descripcion,
                            fechaapertura = AP.fechaapertura.Value.ToShortDateString() + " " + AP.fechaapertura.Value.ToShortTimeString(),
                            fechacierre = (AP.fechacierre == null) ? "" : AP.fechacierre.Value.ToShortDateString() + " " + AP.fechacierre.Value.ToShortTimeString()                           
                        }).ToList();
            return caja;
        }
        private  List<AperturarCaja> listarcajaabiertausuarios(string idempleado)
        {
            if (idempleado is null)
                idempleado = user.getIdUserSession();           
            var idsucursal = user.getIdSucursalCookie();
            var cajaaperturada = (from ca in db.APERTURACAJA
                                  join cs in db.CAJASUCURSAL on ca.idcajasucursal equals cs.idcajasucursal
                                  where cs.idsucursal == idsucursal && ca.usuarioapertura == idempleado && ca.estado == "APERTURADA"
                                  select ca).ToList();
            return cajaaperturada;
        }

        public async Task<mensajeJson> RegistrarDepositoCaja(string jsondeposito)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    List<string[]> lIdxMonto = new List<string[]>();
                    lIdxMonto = JsonConvert.DeserializeObject<List<string[]>>(jsondeposito);
                    List<AperturarCaja> lAperturarCaja = new List<AperturarCaja>();
                    for (int i = 0; i < lIdxMonto.Count; i++)
                    {
                        var cajaabierta = db.APERTURACAJA.Where(x => x.idaperturacaja == Convert.ToInt32(lIdxMonto[i][0])).FirstOrDefault();
                        //aca poner asignacion de depositos
                        cajaabierta.fechadeposito =Convert.ToDateTime(lIdxMonto[i][2]);
                        cajaabierta.montodeposito =Convert.ToDecimal(lIdxMonto[i][1]);
                        lAperturarCaja.Add(cajaabierta);
                    }

                    db.APERTURACAJA.UpdateRange(lAperturarCaja);
                    await db.SaveChangesAsync();
                    transaccion.Commit();

                    return new mensajeJson("ok", lAperturarCaja);
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return new mensajeJson(e.Message, null);
                }
            }
        }
    }
}
