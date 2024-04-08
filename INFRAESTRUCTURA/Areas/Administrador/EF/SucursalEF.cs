using ENTIDADES.comercial;
using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.EF
{
   public class SucursalEF:ISucursalEF
    {

        private readonly Modelo db;

        private readonly UserManager<AppUser> Usuario;

        public SucursalEF(Modelo context, UserManager<AppUser> _Usuario)
        {
            db = context;
            Usuario = _Usuario;
        }
        public async Task<SucursalModel> ListarModelAsync()
        {
            try
            {
                SucursalModel model = new SucursalModel();

                model.lugares = await db.LUGARSUCURSAL.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
                model.empresas = await db.EMPRESA.Where(x => x.estado == "HABILITADO" ).OrderBy(x => x.descripcion).ToListAsync();
                model.laboratorios = await db.SUCURSAL.Where(x => x.estado == "HABILITADO" 
                && x.tipoSucursal == "PRODUCCIÓN")
                    .OrderBy(x => x.descripcion).ToListAsync();
                return (model);
            }
            catch (Exception )
            {

                return new SucursalModel();
            }
        }

        
        public mensajeJson Create(SUCURSAL sucursal)
        {
            try
            {
                sucursal.serie = crearSerie();
                //sucursal.estado = "HABILITADO";
                db.SUCURSAL.Add(sucursal);
                db.SaveChanges();
                if (sucursal.tipoSucursal == "PRODUCCIÓN")
                {
                    sucursal.labasignado = sucursal.suc_codigo;
                    db.Entry(sucursal).State = EntityState.Modified;
                    db.SaveChanges();
                }
                return (new mensajeJson("ok", sucursal));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, e));
            }

        }
     
        public SUCURSAL Buscar(int id)
        {
            SUCURSAL sucursal = db.SUCURSAL.Find(id);
            var laboratorios = db.SUCURSALLABORATORIO.Where(x => x.idsucursal == id && x.estado == "HABILITADO").Select(x => x.idlaboratorio).ToList();
            var cajas = db.CAJASUCURSAL.Where(x => x.estado == "HABILITADO" && x.idsucursal==sucursal.suc_codigo).Select(x => x.idcaja).ToList();
            sucursal.idlaboratorios = laboratorios;
            sucursal.idcajas = cajas;
            var listas = db.PRECIOSSUCURSAL.Where(x => x.estado == "HABILITADO" && x.idsucursal == sucursal.suc_codigo).Select(x => x.idlista).ToList();
            sucursal.idlistas = listas;
            if (sucursal == null)
            {
                return (new SUCURSAL()) ;
            }
            return (sucursal);
        }     
        public mensajeJson Edit(SUCURSAL sucursal)
        {
            try
            {
                List<SUCURSAL> aux = new List<SUCURSAL>();
                if (sucursal.tipoSucursal == "LOCAL")
                    aux = db.SUCURSAL.Where(x => x.labasignado == sucursal.suc_codigo && x.suc_codigo != sucursal.suc_codigo).ToList();
                if (aux.Count > 0)
                    return (new mensajeJson("Existe registros", null));
                else
                {


                    var x = db.SUCURSAL.Find(sucursal.suc_codigo);
                    if (x.idempresa != null)
                        sucursal.idempresa = x.idempresa;
                    if (sucursal.tipoSucursal == "PRODUCCIÓN")
                    {
                        //sucursal.estado = "HABILITADO";
                        sucursal.labasignado = sucursal.suc_codigo;
                        db.Entry(sucursal).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    else
                    {
                        //sucursal.estado = "HABILITADO";
                        db.Entry(sucursal).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    return (new mensajeJson("ok", sucursal));
                }
            }
            catch (Exception e)
            {

                return (new mensajeJson(e.Message, null));
            }




        }
     
        public mensajeJson Delete(int id, string tipo)
        {
            try
            {
                SUCURSAL sucursal = new SUCURSAL();
                sucursal = db.SUCURSAL.Find(id);
                if (tipo == "D")
                {
                    List<SUCURSAL> lista = db.SUCURSAL.Where(x => x.labasignado == id).ToList();
                    if (lista.Count == 1)
                        if (lista[0].suc_codigo == lista[0].labasignado)
                        {
                            sucursal.estado = "DESHABILITADO";
                            db.Entry(sucursal).State = EntityState.Modified;
                            db.SaveChanges();
                            var aux = db.SUCURSAL.Find(sucursal.labasignado);
                            sucursal.nombreLaboratorio = aux.descripcion;
                            mensajeJson data = new mensajeJson("ok", sucursal);
                            return (data);
                        }
                    if (!(lista.Count > 0))
                    {
                        sucursal.estado = "DESHABILITADO";
                        db.Entry(sucursal).State = EntityState.Modified;
                        db.SaveChanges();
                        if (sucursal.labasignado != 0)
                        {
                            var aux = db.SUCURSAL.Find(sucursal.labasignado);
                            sucursal.nombreLaboratorio = aux.descripcion;
                        }
                        else
                            sucursal.nombreLaboratorio = "No asignado";

                        mensajeJson data = new mensajeJson("ok", sucursal);
                        return (data);
                    }
                    else
                    {
                        return (new mensajeJson("",lista));
                    }
                }
                else
                {
                    sucursal.estado = "HABILITADO";
                    db.Entry(sucursal).State = EntityState.Modified;
                    db.SaveChanges();
                    if (sucursal.labasignado != 0)
                    {
                        var aux2 = db.SUCURSAL.Find(sucursal.labasignado);
                        sucursal.nombreLaboratorio = aux2.descripcion;
                    }
                    else
                        sucursal.nombreLaboratorio = "No asignado";
                    mensajeJson data = new mensajeJson("ok", sucursal);
                    return (data);
                }
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message,null));
            }
        }
        public mensajeJson AgregarEliminarLaboratorio(int idsucursal, int idlaboratorio)
        {
            try
            {
                var obj = db.SUCURSALLABORATORIO.Where(x => x.idsucursal == idsucursal && x.idlaboratorio == idlaboratorio).FirstOrDefault();
                if (obj is null)
                    db.SUCURSALLABORATORIO.Add(new SucursalLaboratorio { idlaboratorio = idlaboratorio, idsucursal = idsucursal, estado = "HABILITADO" });
                else
                    db.SUCURSALLABORATORIO.Remove(obj);
                db.SaveChanges();
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public mensajeJson AgregarEliminarCaja(int idsucursal, int idcaja)
        {
            try
            {
                var obj = db.CAJASUCURSAL.Where(x => x.idsucursal == idsucursal && x.idcaja == idcaja).FirstOrDefault();
                if (obj is null)
                    db.CAJASUCURSAL.Add(new CajaSucursal { idcaja = idcaja, idsucursal = idsucursal, estado = "HABILITADO" });
                else
                {
                    if (obj.estado == "HABILITADO")
                        obj.estado = "ELIMINADO";
                    else if (obj.estado == "ELIMINADO") 
                        obj.estado = "HABILITADO";
                    db.Update(obj);
                }
                        
                db.SaveChanges();
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public mensajeJson AsignarListaPrecios(int idsucursal, int idlista)
        {
            try
            {
                var obj = db.PRECIOSSUCURSAL.Where(x => x.idsucursal == idsucursal && x.idlista == idlista).FirstOrDefault();
                if (obj is null)
                    db.PRECIOSSUCURSAL.Add(new ListaPreciosSucursal { idlista = idlista, idsucursal = idsucursal, estado = "HABILITADO" });
                else
                {
                    if (obj.estado == "HABILITADO")
                        obj.estado = "ELIMINADO";
                    else if (obj.estado == "ELIMINADO")
                        obj.estado = "HABILITADO";
                    db.Update(obj);
                }

                db.SaveChanges();
                return (new mensajeJson("ok", null));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public object ListarLaboratorioSucursal(int sucursal)
        {
            try
            {
                var data = (from SL in db.SUCURSALLABORATORIO
                            join S in db.SUCURSAL on SL.idlaboratorio equals S.suc_codigo
                            where SL.idsucursal == sucursal && SL.estado=="HABILITADO"
                            select new 
                            {
                                idlaboratorio = SL.idlaboratorio,
                                estado = SL.estado,
                                S.descripcion                                
                            }
                            ).ToList();
                return (data);
            }
            catch (Exception)
            {
                return new List<SucursalLaboratorio>();
            }
        }
        public object ListarSucursalDelivery()
        {
            var data = db.SUCURSAL.Where(x => x.issucursalentrega.Value && x.estado == "HABILITADO")
                                  .OrderBy(x => x.descripcion).ToList();
            for (int i = 0; i < data.Count; i++)
            {             
                if (data[i].idlugar != null)
                    data[i].lugar = db.LUGARSUCURSAL.Find(data[i].idlugar).descripcion;
            }
            return data.Select(x=>new { idsucursal=x.suc_codigo, x.descripcion,x.lugar,x.tipoSucursal}).ToList();
        }
        public List<SUCURSAL> cargarProducion()
        {
            var data = db.SUCURSAL.Where(x => x.tipoSucursal == "PRODUCCIÓN" && x.estado != "DESHABILITADO")
                                  .OrderBy(x => x.descripcion).ToList();
            return (data);
        }
        public object ListarSucursalesPrimarias(int idempresa)
        {           
            if (idempresa is 0)
            {
                var query = (from S in db.SUCURSAL
                             where S.estado == "HABILITADO" && S.isprimario==true
                             orderby S.descripcion
                             select new
                             {
                                 descripcion = S.descripcion,
                                 idsucursal = S.suc_codigo
                             }).ToList();
                return query;

            }
            else
            {
                var query = (from S in db.SUCURSAL
                             where S.estado == "HABILITADO"
                             && S.idempresa == idempresa && S.isprimario == true
                             orderby S.descripcion
                             select new
                             {
                                 descripcion = S.descripcion,
                                 idsucursal = S.suc_codigo
                             }).ToList();
                return query;
            }
      
        }
     
        private string crearSerie()
        {
            int con = db.SUCURSAL.Count();
            con = con + 1;
            if (con < 10)
                return "SUC0" + con.ToString();
            else
                return "SUC" + con.ToString();
        }

        public object ListarSucursalxEmpresa(int idempresa,string tiposucursal)
        {
            if (tiposucursal is null) tiposucursal = "LOCAL";
            if (tiposucursal.ToUpper() is "TODOS") tiposucursal = "";
            // Dividir la cadena en una lista de tipos
            var tipos = tiposucursal.Split('|');
            if (idempresa is 1)
            {
                var query = (from S in db.SUCURSAL
                             where S.estado=="HABILITADO" && S.tipoSucursal.Contains(tiposucursal) orderby S.descripcion
                             select new
                             {
                                 descripcion=S.descripcion,
                                 idsucursal=S.suc_codigo,
                                 tipo=S.tipoSucursal
                             }).ToList();
                return query;
               
            }else
            {
                var query = (from S in db.SUCURSAL
                             where S.estado == "HABILITADO"
                             && S.idempresa==idempresa
                           && (tipos.Length == 0 || (tipos.Length == 1 && tipos[0] == "") || tipos.Contains(S.tipoSucursal))
                             // comentado 25/08
                             orderby S.tipoSucursal,S.descripcion
                             select new
                             {
                                 descripcion = S.descripcion,
                                 idsucursal = S.suc_codigo,
                                 tipo = S.tipoSucursal
                             }).ToList();
                return query;
            }
          
        }
        public object ListarSucursalxEmpresaQF(int idempresa, string tiposucursal)
        {
            if (tiposucursal is null) tiposucursal = "LOCAL";
            if (tiposucursal.ToUpper() is "TODOS") tiposucursal = "";

            if (idempresa is 0)
            {
                var query = (from S in db.SUCURSAL
                             where S.estado == "HABILITADO" && S.tipoSucursal.Contains(tiposucursal)
                             orderby S.descripcion
                             select new
                             {
                                 descripcion = S.descripcion,
                                 idsucursal = S.suc_codigo,
                                 tipo = S.tipoSucursal
                             }).ToList();
                return query;

            }
            else
            {
                var query = (from S in db.SUCURSAL
                             where S.estado == "HABILITADO"
                             && S.idempresa == idempresa
                             && S.tipoSucursal.Contains(tiposucursal)
                             && S.descripcion.Contains("QF")
                             // comentado 25/08
                             orderby S.descripcion
                             select new
                             {
                                 descripcion = S.descripcion,
                                 idsucursal = S.suc_codigo,
                                 tipo = S.tipoSucursal
                             }).ToList();
                return query;
            }

        }
        public object ListarSucursales(string tipo)
        {
            if (tipo is null) tipo = "LOCAL";
            if (tipo.ToUpper() is "TODOS") tipo = "";         
            var tipos = tipo.Split('|');
            var query = (from S in db.SUCURSAL
                             join E in db.EMPRESA on S.idempresa equals E.idempresa
                         join sc in db.CAJASUCURSAL on S.suc_codigo equals sc.idsucursal
                         where S.estado== "HABILITADO" && sc.idcaja==1
                              && (tipos.Length == 0 || (tipos.Length == 1 && tipos[0] == "") || tipos.Contains(S.tipoSucursal))
                         orderby S.tipoSucursal, S.descripcion
                             select new
                             {
                                 sucursal=S.descripcion,
                                 idsucursal=S.suc_codigo,
                                 empresa=E.descripcion,
                                 idcaja = sc.idcajasucursal,
                                 idempresa=E.idempresa,
                             }).ToList();
                return query;                                    
        }
        public object ListarSucursales2(string tipo)
        {
            if (tipo is null) tipo = "LOCAL";
            if (tipo.ToUpper() is "TODOS") tipo = "";
            var query = (from S in db.SUCURSAL
                         join E in db.EMPRESA on S.idempresa equals E.idempresa
                         where S.estado == "HABILITADO" && S.tipoSucursal.Contains(tipo)
                         orderby S.descripcion
                         select new
                         {
                             descripcion = S.descripcion,
                             idsucursal = S.suc_codigo,
                             tipoSucursal = S.tipoSucursal,
                             serie=S.serie,
                             suc_codigo = S.suc_codigo,
                             nConsultorios=S.nConsultorios,
                             direccion=S.direccion,
                             //descripcion = E.descripcion,
                         }).ToList();
            return query;
        }
        public object ListarSucursalesByTipoLocal(string tipo)
        {
            tipo = tipo ?? "LOCAL";
                var query = (from S in db.SUCURSAL
                             join E in db.EMPRESA on S.idempresa equals E.idempresa
                             where S.estado=="HABILITADO" && S.tipoSucursal == tipo orderby S.descripcion 
                             select new
                             {
                                 sucursal=S.descripcion,
                                 idsucursal=S.suc_codigo,
                                 empresa=E.descripcion
                             }).ToList();
                return query;                                    
        }
        public object ListaLaboratorio()
        {
            var query = (from S in db.ALABORATORIO
                         where S.estado == "HABILITADO"
                         orderby S.descripcion
                         select new {
                             idlaboratorio=S.idlaboratorio,
                             descripcion=S.descripcion
                         }).ToList();
            return query;
        }
        public object ListadoTipoProcedimiento(int suc_codigo)
        {
            var query = (from TP in db.TIPODEPROCEDIMIENTO
                         where TP.estado != "ELIMINADO" &&
                         TP.suc_codigo == suc_codigo
                         orderby TP.descripcion
                         select new
                         {
                             codigo = TP.codigo,
                             tipodeproc_codido = TP.tipodeproc_codido,
                             descripcion = TP.descripcion,
                             costo = TP.costo
                         });
            return query;
        }
    }
}
