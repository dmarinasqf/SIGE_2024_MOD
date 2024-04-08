using ENTIDADES.comercial;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTIDADES.ventas;
using Erp.Entidades.comercial;

namespace INFRAESTRUCTURA.Areas.Comercial.EF
{
    public class DescuentoEF : IDescuentoEF
    {
        private readonly Modelo db;
        private readonly UserManager<AppUser> usermanager;
        public DescuentoEF(Modelo db_, UserManager<AppUser> userManager_)
        {
            db = db_;
            usermanager = userManager_;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(Descuento descuento, List<DescuentoDetalle> detalle, string canalVentas)
        {
            //1-script para canal ventas
            var arraylistas = canalVentas.TrimEnd('|').Split("|").ToList();
            List<ADristribucion> canalListaDescuento = new List<ADristribucion>();
            foreach (var item in arraylistas)
            {
                //canales.Add(new CanalVenta { idcanalventa=item});
                canalListaDescuento.Add(new ADristribucion {idcanalventa=item});
            }
            //--------------------

            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    descuento.fechacreacion = DateTime.Now;
                    db.Add(descuento);
                    await db.SaveChangesAsync();

                    detalle.ForEach(x => x.iddescuento = descuento.iddescuento);
                    detalle.ForEach(x => x.estado = "HABILITADO");

                    //2-script para canal ventas
                    canalListaDescuento.ForEach(x=> x.iddescuento=descuento.iddescuento);
                    db.AddRange(canalListaDescuento);
                    await db.SaveChangesAsync();
                    //-----------------

                    db.AddRange(detalle);
                    await db.SaveChangesAsync();
                    var listasdescuentos = new List<ListaDescuento>();
                    foreach (var item in detalle)
                    {
                        if (item.jsondetalle is not null && item.jsondetalle.Length > 0)
                        {
                            var listas = JsonConvert.DeserializeObject<List<ListaDescuento>>(item.jsondetalle);
                            listas.ForEach(x => x.iddetalle = item.iddetalle);
                            for (int i = 0; i < listas.ToList().Count; i++)
                            {
                                var item2 = listas[i];
                                if (item2.pventa is null || item2.pventa is 0)
                                {//actualiza el precio de venta en caso de tenga si no lo quita del registro
                                    var objaux = db.PRECIOSPRODUCTO.Where(x => x.estado == "HABILITADO" && x.idlistaprecio == item2.idlista && x.idproducto == item.idproducto).FirstOrDefault();
                                    if (objaux is not null)
                                        listas[i].pventa = objaux.precio;
                                    else
                                        listas.RemoveAt(i);
                                }
                            }
                            listasdescuentos.AddRange(listas);
                        }
                    }
                    db.AddRange(listasdescuentos);
                    await db.SaveChangesAsync();
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
        public async Task<mensajeJson> EditarDescuentoAsync(Descuento descuento, List<string>detalle)
        {
            var obj = db.DESCUENTO.Find(descuento.iddescuento);
            obj.descripcion = descuento.descripcion;
            obj.estado = descuento.estado;
            obj.fechainicio = descuento.fechainicio;
            obj.fechafin = descuento.fechafin;
            db.Update(obj);
            await db.SaveChangesAsync();
            var listaauxiliar = new List<ListaDescuento>();
            foreach (var item in detalle)
            {
                var datos = item.Split("|");
                if(datos[0]!="")
                {
                    var listadesc = db.LISTADESCUENTO.Find(int.Parse(datos[0]));
                    if(listadesc is not null)
                    {
                        if (datos[1] != "")  listadesc.dessucursal = decimal.Parse(datos[1]);
                        if (datos[2] != "")  listadesc.desproveedor = decimal.Parse(datos[2]);
                        listaauxiliar.Add(listadesc);
                    }
                }
            }
            db.UpdateRange(listaauxiliar);
            await db.SaveChangesAsync();
            return new mensajeJson("ok",null);

        }
        public async Task<mensajeJson> RegistrarEditarValidacionUsuario(string usuario, string clave, Descuento descuento, List<DescuentoDetalle> detalle,string canalventas)
        {
            try
            {
                var empleado = db.EMPLEADO.Where(x => x.userName == usuario && x.clave == clave && x.estado != "ELIMINADO").FirstOrDefault();
                if (empleado == null)
                    return (new mensajeJson("Credenciales incorrectas", null));
                else
                {
                    var usuarios = await usermanager.FindByIdAsync(empleado.emp_codigo.ToString());
                    if (usuarios is null)
                        return (new mensajeJson("Credenciales incorrectas", null));

                    if (await usermanager.IsInRoleAsync(usuarios, "APROBAR DESCUENTOS AFECTA A PRECIOCOMPRA") || await usermanager.IsInRoleAsync(usuarios, "ADMINISTRADOR"))
                    {
                        descuento.usuariovalida = empleado.emp_codigo.ToString();
                        return await RegistrarEditarAsync(descuento, detalle, canalventas);
                    }
                    else
                    {
                        return (new mensajeJson("No tiene los permisos para guardar esta operación", null));
                    }
                }

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }
        public object ListarSucursalDescuento(int iddescuento)
        {
            try
            {
                var data = db.DESCUENTOSUCURSAL.Where(x => x.iddescuento == iddescuento && x.estado == "HABILITADO").Select(x => new
                {
                    x.id,
                    x.idsucursal,
                    x.iddescuento
                }).ToList();
                return data;
            }
            catch (Exception e)
            {
                return e.Message;
            }

        }
        public mensajeJson AsignarDescuentoSucursalEnBloque(int iddescuento, List<string> idsucursal)
        {
            try
            {
                foreach (var item in idsucursal)
                {
                    var dato = item.Split("-");
                    var estado = Boolean.Parse(dato[0]);
                    var sucu = int.Parse(dato[1]);
                    var data = db.DESCUENTOSUCURSAL.Where(x => x.iddescuento == iddescuento && x.idsucursal == sucu).FirstOrDefault();
                    if (estado)
                    {
                        if (data is null)
                            db.Add(new DescuentoSucursal { iddescuento = iddescuento, idsucursal = sucu, estado = "HABILITADO" });
                        else
                        {
                            data.estado = "HABILITADO";
                            db.Update(data);
                        }
                    }
                    else
                        if (data is not null)
                    {
                        data.estado = "ELIMINADO";
                        db.Update(data);
                    }


                    db.SaveChanges();
                }

                return new mensajeJson("ok", null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }
        }
    }
}
