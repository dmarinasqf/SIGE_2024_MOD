using ENTIDADES.Almacen;
using ENTIDADES.comercial;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class DetalleProductoGenericoEF : IDetalleProductoGenericoEF
    {
        private readonly Modelo db;
        public DetalleProductoGenericoEF(Modelo context)
        {
            db = context;
        }
        //genericos
        public async Task<mensajeJson> RegistrarDetalleGenericoAsync(ADetalleProductoGenerico obj)
        {
            try
            {

                var aux = db.CDETALLEPRODUCTOGENERICO.Where(x => x.idproducto == obj.idproducto && x.idproductogenerico == obj.idproductogenerico).FirstOrDefault();
                if (aux == null)
                {
                    db.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                {
                    return (new mensajeJson("El registro ya existe", null));

                }

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<mensajeJson> EditarDetalleGenericoAsync(ADetalleProductoGenerico obj)
        {
            try
            {
                var aux = db.CDETALLEPRODUCTOGENERICO.Find(obj.iddetallegenerico);
                aux.codconcentracion = obj.codconcentracion;
                db.Update(obj);
                await db.SaveChangesAsync();
                return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<mensajeJson> EliminarDetalleGenericoAsync(int? id)
        {
            var obj = await db.CDETALLEPRODUCTOGENERICO.FindAsync(id);
            db.Remove(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", null));

        }

        //accion farmacologica
        public async Task<mensajeJson> RegistrarDetalleAccionFarmacologicoAsync(ADetalleAccionFarmacologica obj)
        {
            try
            {

                var aux = db.ADETALLEACCIONFARMACOLOGICA.Where(x => x.idproducto == obj.idproducto && x.idaccionfarma == obj.idaccionfarma).FirstOrDefault();
                if (aux == null)
                {
                    db.Add(obj);
                    await db.SaveChangesAsync();
                    return (new mensajeJson("ok", obj));
                }
                else
                {
                    return (new mensajeJson("El registro ya existe", null));

                }

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<mensajeJson> EliminarDetalleAccionFarmacologicoAsync(int? id)
        {
            var obj = await db.ADETALLEACCIONFARMACOLOGICA.FindAsync(id);
            db.Remove(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", null));

        }

        //principio activo
        public async Task<mensajeJson> RegistrarEditarPrincipiosActivos(ADetallePrincipioActivo obj)
        {
            try
            {
                if(obj.iddetalle is 0)
                {
                    var aux = db.DETALLEPRINCIPIOACTIVO.Where(x => x.idproducto == obj.idproducto && x.idprincipio == obj.idprincipio).FirstOrDefault();
                    if (aux == null)
                    {
                        db.Add(obj);
                        await db.SaveChangesAsync();
                        return (new mensajeJson("ok", obj));
                    }
                    else
                    {
                        return (new mensajeJson("El registro ya existe", null));

                    }
                }else
                {
                    db.Update(obj);
                    await db.SaveChangesAsync();
                    return new mensajeJson("ok", null);
                }
               

            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }

        }
        public async Task<mensajeJson> EliminarPrincipioActivo(int? id)
        {
            var obj = await db.DETALLEPRINCIPIOACTIVO.FindAsync(id);
            db.Remove(obj);
            await db.SaveChangesAsync();
            return (new mensajeJson("ok", null));

        }

        //lista de precios
        public  mensajeJson AgregarEliminarProductoLista(List<PreciosProducto> precios)
        {
            try
            {
                List<PreciosProducto> listanueva = new List<PreciosProducto>();
                List<PreciosProducto> listaedicion = new List<PreciosProducto>();
                for (int i = 0; i < precios.Count; i++)
                {
                    var listaaux = db.PRECIOSPRODUCTO.Where(x => x.idlistaprecio == precios[i].idlistaprecio && x.idproducto == precios[i].idproducto && x.estado != "ELIMINADO").ToList();
                    if (precios[i].agregareditar)
                    {
                        if (listaaux.Count == 0)
                            listanueva.Add(new PreciosProducto
                            {
                                idlistaprecio = precios[i].idlistaprecio,
                                precio = precios[i].precio,
                                precioxfraccion = precios[i].precioxfraccion,
                                idproducto = precios[i].idproducto,
                                estado = "HABILITADO"
                            }) ;
                        else
                        {
                            listaaux.ToList().ForEach(x => x.estado = "HABILITADO");
                            listaaux.ToList().ForEach(x => x.precio = precios[i].precio);
                            listaaux.ToList().ForEach(x => x.precioxfraccion = precios[i].precioxfraccion);
                            listaedicion.AddRange(listaaux);
                        }
                    }
                    else
                    {
                        if (listaaux.Count > 0)
                        {
                            listaaux.ToList().ForEach(x => x.estado = "DESHABILITADO");
                            listaedicion.AddRange(listaaux);
                        }
                    }
                }
                if (listanueva.Count > 0)
                {
                    db.AddRange(listanueva);
                    db.SaveChanges();
                }
                if (listaedicion.Count > 0)
                {
                    db.UpdateRange(listaedicion);
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
