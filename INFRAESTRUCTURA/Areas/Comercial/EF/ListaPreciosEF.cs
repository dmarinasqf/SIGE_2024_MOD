using ENTIDADES.comercial;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.EF
{
   public class ListaPreciosEF:IListaPreciosEF
    {
        private readonly Modelo db;
        public ListaPreciosEF(Modelo db_)
        {
            db = db_;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(ListaPrecios obj)
        {
            try
            {
                obj.descripcion = obj.descripcion.ToUpper();
                obj.tipo = "sucursal";
                var aux = db.LISTAPRECIOS.Where(x => x.descripcion == obj.descripcion).FirstOrDefault();
                if (obj.idlistaprecio == 0)
                {
                    if ((aux is null))
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        if (aux.estado == "ELIMINADO")
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
                        if (aux.estado == "ELIMINADO")
                        {
                            aux.estado = "HABILITADO";
                            db.Update(aux);
                            await db.SaveChangesAsync();
                            return (new mensajeJson("ok-habilitado", aux));
                        }
                        else if (aux.idlistaprecio == obj.idlistaprecio)
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

                return new mensajeJson(e.Message, null);
            }
        }
        public List<ListaPrecios> ListarListas()
        {
            return db.LISTAPRECIOS.Where(x => x.estado != "ELIMINADO" && x.tipo=="sucursal").OrderBy(x => x.descripcion).ToList();
        }
        public List<ListaPrecios> ListarListasHabilitadas()
        {
            return db.LISTAPRECIOS.Where(x => x.estado =="HABILITADO" && x.tipo == "sucursal").OrderBy(x => x.descripcion).ToList();
        }
        public async Task<mensajeJson> EditarPreciosProducto(List<PreciosProducto> lista)
        {
            try
            {
                List<PreciosProducto> lista2 = new List<PreciosProducto>();
                foreach (var item in lista)
                {
                    var obj = db.PRECIOSPRODUCTO.Find(item.idprecioproducto);
                    obj.precio = item.precio;
                    obj.precioxblister = item.precioxblister;
                    obj.precioxfraccion = item.precioxfraccion;
                    obj.incentivo = item.incentivo;
                    obj.incentivoxfraccion = item.incentivoxfraccion;
                    lista2.Add(obj);
                }
                db.UpdateRange(lista2);
                await db.SaveChangesAsync();
                return new mensajeJson("ok", null);

            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
        public object ListarPreciosSucursal(int idsucursal)
        {
            var query = (from cs in db.PRECIOSSUCURSAL
                         join s in db.SUCURSAL on cs.idsucursal equals s.suc_codigo
                         join c in db.LISTAPRECIOS on cs.idlista equals c.idlistaprecio
                         where cs.estado == "HABILITADO" && cs.idsucursal == idsucursal && c.estado=="HABILITADO"
                          && c.tipo == "sucursal"
                         select new
                         {
                             idlista = c.idlistaprecio,
                             descripcion = c.descripcion,
                             idlistasucursal = cs.idlistasucursal,
                             idsucursal=s.suc_codigo
                         }).ToList();
            return query;
        }
        public object ListarListaXProducto(int idproducto)
        {
            var query = (from PP in db.PRECIOSPRODUCTO
                         join LP in db.LISTAPRECIOS on PP.idlistaprecio equals LP.idlistaprecio
                         join AP in db.APRODUCTO on PP.idproducto equals AP.idproducto 
                         where LP.estado == "HABILITADO" && PP.idproducto==idproducto && LP.tipo == "sucursal" 
                         && AP.estado =="HABILITADO" 
                         orderby LP.descripcion
                         select new
                         {
                             PP.idproducto,
                             AP.multiplo,
                             PP.idprecioproducto,
                             LP.idlistaprecio,
                             lista=LP.descripcion,
                             PP.precio,
                             PP.precioxblister,
                             PP.precioxfraccion,
                             PP.descuento
                         }).ToList();
            return query;
        }

        public object ListarPreciosxListasyProducto(string listas, int idproducto)
        {
            var arraylistas = listas.Split("|").ToList();
            List<object> precios = new List<object>();
            foreach (var item in arraylistas)
            {
                if (item.Length>0)
                {
                    var idlista = int.Parse(item);
                    var data = (from P in db.PRECIOSPRODUCTO
                                join L in db.LISTAPRECIOS on P.idlistaprecio equals L.idlistaprecio
                                where P.estado == "HABILITADO" && P.idproducto == idproducto && P.idlistaprecio == idlista
                                && L.tipo == "sucursal"
                                select new
                                {
                                    L.idlistaprecio,
                                    lista = L.descripcion,
                                    P.precio,
                                    P.precioxfraccion
                                }
                                ).ToList().LastOrDefault();
                    if (data is not null)
                        precios.Add(data);
                }
                
            }
            return precios;
        }
        
    }
}
