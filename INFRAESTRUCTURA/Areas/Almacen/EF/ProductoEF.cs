using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Almacen.ViewModels;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.EF
{
    public class ProductoEF : IProductoEF
    {
        private readonly Modelo db;
        //editado por mi
        public ProductoEF(Modelo context)
        {
            db = context;
        }
        public async Task<ProductoModel> ListarModelAsync()
        {
            ProductoModel model = new ProductoModel();
            model.tipoproductos = await db.ATIPOPRODUCTO.Where(x => x.estado == "HABILITADO").ToListAsync();
            model.formafarmaceutica = await db.FORMAFARMACEUTICA.Where(x => x.estado == "HABILITADO").ToListAsync();
            model.productopresentaciones = await db.APRODUCTOPRESENTACION.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.clases = await db.ACLASE.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.unidadmedidas = await db.AUNIDADMEDIDA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.laboratorio = await db.ALABORATORIO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.proveedor = await db.CPROVEEDOR.Where(x => x.estado == "HABILITADO").OrderBy(x => x.razonsocial).ToListAsync();
            model.temperatura = await db.ATEMPERATURA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            model.tipotributos = await db.FTIPOTRIBUTO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
            return model;
        }
        public async Task<mensajeJson> RegistrarEditarAsync(AProducto objproducto)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var aux = db.APRODUCTO.Where(x => x.nombre.Trim() == objproducto.nombre.Trim()).FirstOrDefault();
                    bool existecodigo = false;
                    if (objproducto.codigobarra is not null && objproducto.codigobarra is not "")
                        existecodigo = db.APRODUCTO.Where(x => x.codigobarra == objproducto.codigobarra).Any();

                    if (objproducto.idproducto == 0)
                    {
                        if (aux is null)
                        {
                            if (!existecodigo)
                            {
                                objproducto.codigoproducto = GetnumeroProducto(objproducto.idtipoproducto);
                                //objproducto.codigobarra = objproducto.codigoproducto;
                                db.APRODUCTO.Add(objproducto);
                                await db.SaveChangesAsync();
                                transaccion.Commit();
                                return (new mensajeJson("ok", objproducto));
                            }
                            return (new mensajeJson("El codigo de barra ya se encuentra registrado", null));
                        }
                        else
                            return (new mensajeJson("El nombre de este registro ya existe", null));
                    }
                    else
                    {
                        //AProducto objdb = new AProducto();
                        //objdb = db.APRODUCTO.Find(objproducto.idproducto);
                        //if (aux is null)
                        //{
                        //    if (aux1 is null)
                        //    {
                        db.APRODUCTO.Update(objproducto);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                        return (new mensajeJson("ok", objproducto));
                        //}
                        //    else
                        //    {
                        //        if (aux1.nombreabreviado == objdb.nombreabreviado)
                        //        {
                        //            db.APRODUCTO.Update(objproducto);
                        //            await db.SaveChangesAsync();
                        //            transaccion.Commit();
                        //            return (new mensajeJson("ok", objproducto));
                        //        }
                        //        else
                        //        {
                        //            return (new mensajeJson("El nombre abreviado de este registro ya existe", null));
                        //        }
                        //    }
                        //}
                        //else
                        //{
                        //    if (aux.nombre == objdb.nombre)
                        //    {
                        //if (aux1 is null)
                        //{
                        //    db.APRODUCTO.Update(objproducto);
                        //    await db.SaveChangesAsync();
                        //    transaccion.Commit();
                        //    return (new mensajeJson("ok", objproducto));
                        //}
                        //else
                        //{

                        //    if (aux1.nombreabreviado == objdb.nombreabreviado)
                        //    {
                        //db.APRODUCTO.Update(objproducto);
                        //await db.SaveChangesAsync();
                        //transaccion.Commit();
                        //return (new mensajeJson("ok", objproducto));
                        //}
                        //        else
                        //        {
                        //            return (new mensajeJson("El nombre abreviado de este registro ya existe", null));
                        //        }
                        //    }
                        //}
                        //else
                        //{
                        //    return (new mensajeJson("El nombre de este registro ya existe", null));
                        //}
                        //}
                    }
                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }

        }

        public async Task<mensajeJson> ActivarProductoAsync(int? id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                AProducto producto = new AProducto();
                producto = db.APRODUCTO.Find(id);
                try
                {
                    if (producto != null)
                    {
                        producto.estado = "HABILITADO";
                        db.Update(producto);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                        return (new mensajeJson("ok", null));

                    }
                    else
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("producto no encontrado", null));
                    }

                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }
        public async Task<mensajeJson> EliminarAsync(int? id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                AProducto producto = new AProducto();
                producto = db.APRODUCTO.Find(id);
                try
                {
                    if (producto != null)
                    {
                        producto.estado = "DESHABILITADO";
                        db.Update(producto);
                        await db.SaveChangesAsync();
                        transaccion.Commit();
                        return (new mensajeJson("ok", null));

                    }
                    else
                    {
                        transaccion.Rollback();
                        return (new mensajeJson("producto no encontrado", null));
                    }

                }
                catch (Exception e)
                {
                    transaccion.Rollback();
                    return (new mensajeJson(e.Message, null));
                }
            }
        }

        public AProducto buscarProducto(int? id)
        {
            try
            {
                var producto = db.APRODUCTO.Find(id);
                if (producto is null)
                    return new AProducto();
                if (producto.idlaboratorio != null)
                    producto.laboratorio = db.ALABORATORIO.Find(producto.idlaboratorio).descripcion;

                producto.regsanitario = BuscarRegistroSanitario(producto.idproducto);
                return (producto);
            }
            catch (Exception)
            {
                return new AProducto();
            }
        }

        public async Task<mensajeJson> BuscarAsync(int? id)
        {
            try
            {
                if (id is 0 || id is null)
                    return (new mensajeJson("nuevo", null));
                var obj = await db.APRODUCTO.FirstOrDefaultAsync(m => m.idproducto == id);
                if (obj is null)
                    return (new mensajeJson("notfound", null));
                else if (obj.estado == "ELIMINADO")
                    return (new mensajeJson("notfound", null));
                else
                    return (new mensajeJson("ok", obj));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, null));
            }
        }

        public async Task<List<CProveedor>> listarproveedoresAsync()
        {
            try
            {
                var data = await db.CPROVEEDOR.Where(x => x.estado == "HABILITADO").OrderBy(x => x.razonsocial).ToListAsync();
                return (data);
            }
            catch (Exception)
            {
                return new List<CProveedor>();
            }

        }

        //LISTAR
        public async Task<List<AProducto>> listarProductosporcategoriaAsync(string categoria)
        {
            try
            {
                var productos = await db.APRODUCTO.Where(x => x.estado != "ELIMINADO" && x.idtipoproducto == categoria)
                       .OrderBy(x => x.nombre).ToListAsync();
                return (productos);
            }
            catch (Exception)
            {
                return (null);
            }


        }
        public async Task<List<ATipoProducto>> ListarTipoProductoAsync()
        {
            return (await db.ATIPOPRODUCTO.Where(x => x.estado == "HABILITADO").ToListAsync());
        }
        public async Task<List<ADetalleAccionFarmacologica>> getDetalleAccionFarmaxProducto(int? id)
        {
            try
            {
                var query = await (from daf in db.ADETALLEACCIONFARMACOLOGICA
                                   join af in db.AACCIONFARMACOLOGICA on daf.idaccionfarma equals af.idaccionfarma
                                   where daf.idproducto == id
                                   orderby daf.idaccionfarma ascending
                                   select new ADetalleAccionFarmacologica
                                   {
                                       iddetalleaccionfarma = daf.iddetalleaccionfarma,
                                       idaccionfarma = daf.idaccionfarma,
                                       acccionfarmacologica = af.descripcion
                                   }).ToListAsync();

                return query;
            }
            catch (Exception)
            {
                return new List<ADetalleAccionFarmacologica>();
            }

        }
        public async Task<object> getDetallePrincipioActivoxProducto(int? id)
        {
            try
            {
                var query = await (from daf in db.DETALLEPRINCIPIOACTIVO
                                   join af in db.PRINCIPIOACTIVO on daf.idprincipio equals af.idprincipio
                                   where daf.idproducto == id
                                   orderby daf.idprincipio ascending
                                   select new
                                   {
                                       iddetalle = daf.iddetalle,
                                       idprincipio = daf.idprincipio,
                                       idproducto = daf.idproducto,
                                       idunidadmedida = daf.idunidadmedida,
                                       principio = af.descripcion,
                                       codconcentracion = daf.codconcentracion
                                   }).ToListAsync();

                return query;
            }
            catch (Exception)
            {
                return new List<object>();
            }

        }
        public List<AProducto> ListarProductosxLaboratorio(int idlaboratorio)
        {

            var data = db.APRODUCTO.Where(x => x.idlaboratorio == idlaboratorio && x.estado == "HABILITADO").ToList();
            data.ForEach(x => x.regsanitario = BuscarRegistroSanitario(x.idproducto));
            return data;

        }
        private string BuscarRegistroSanitario(int idproducto)
        {
            var regsanitario = "";
            var regsanitarios = db.REGISTROSANITARIO.Where(x => x.estado == "HABILITADO" && x.fechafin >= DateTime.Now && x.idproducto == idproducto).OrderBy(x => x.fechafin).ToList();
            if (regsanitarios.Count != 0)
                regsanitario = regsanitarios.FirstOrDefault().registro;
            regsanitario = regsanitario ?? "";
            return regsanitario;
        }
        private string GetnumeroProducto(string tipo)
        {
            string rpta = "";
            AgregarCeros ceros = new AgregarCeros();

            int numProductos = db.APRODUCTO.Where(x => x.idtipoproducto == tipo).Count();
            numProductos += 1;
            rpta = tipo + ceros.agregarCeros(numProductos);

            return rpta;
        }
    }
}
