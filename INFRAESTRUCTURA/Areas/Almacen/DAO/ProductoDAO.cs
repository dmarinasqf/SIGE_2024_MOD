using ENTIDADES.Almacen;
using ENTIDADES.compras;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class ProductoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public ProductoDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public async Task<DataTable> getproductosproveedorAsync(string proveedor, string desqf, int top, string tipoproducto)
        {

            var tarea = await Task.Run(() =>
            {
                return getProductosProveedor(proveedor, desqf, tipoproducto, top);
            });
            return tarea;

        }
        public async Task<mensajeJson> getProductosxAlmacenstock(string tipoproducto, string codigo, string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    return getTablaProductosxAlmacenstock(tipoproducto, codigo,
                nombreproducto, laboratorio, clase, subclase, estado,
                idsucursalalmacen, top);
                });
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> getProductosxAlmacenstock_V2(string tipoproducto, string codigo, string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    return getTablaProductosxAlmacenstock_V2(tipoproducto, codigo,
                nombreproducto, laboratorio, clase, subclase, estado,
                idsucursalalmacen, top);
                });
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> getProductosconstockxAlmacen(string idalmacen,
            string tipoproducto, string producto, int top)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    return BuscarProductosconstockxAlmacen(idalmacen, producto, tipoproducto, top);
                });
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> getProductoDistribucionxlote(string idproducto, string lote, string sucursal, string almacen)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    return getTablaProductoDistribucionxlote(idproducto, lote, sucursal, almacen);
                });
                return data;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> getListarProductosNuevosDistribucion(string idsucursalalmacen)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    return SPListarProductosNuevosDistribucion(idsucursalalmacen);
                });
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }

        public DataTable buscarProductoRegSanFecVenLote(int? id)
        {
            try
            {
                if (id is null) id = 0;

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.BuscarProductoLoteRegSanFechVen", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", id);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS PROVEEDOR";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        private DataTable getProductosProveedor(string proveedor, string desqf, string tipoproducto, int top)
        {
            try
            {
                if (desqf is null) desqf = "";
                if (top is 0) top = 10;
                if (proveedor is null) proveedor = "";
                if (tipoproducto is null) tipoproducto = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_LISTAR_INSUMO_PROVEEDOR_QF_RELACION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@IDPROVEEDOR", proveedor);
                cmm.Parameters.AddWithValue("@DESCRIPCION", desqf);
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);


                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS PROVEEDOR";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public List<AProducto> getProductosxLaboratorio(int laboratorio)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_LISTAR_PRODUCTO_TERMINADO_PROVEEDOR_X_LABORATORIO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDLABORATORIO", laboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS DE LABORATORIO";

                AProducto obj = new AProducto();
                List<AProducto> LISTA = new List<AProducto>();
                foreach (DataRow row in tabla.Rows)
                {
                    obj = new AProducto();
                    obj.idproducto = int.Parse(row["IDPRODUCTO"].ToString());
                    obj.idlaboratorio = int.Parse(row["IDLABORATORIO"].ToString());
                    obj.uma = int.Parse(row["IDUMA"].ToString());
                    obj.codigoproducto = (row["CODIGOPRO"].ToString());
                    obj.nombre = (row["NOMBRE.PRODUCTO"].ToString());
                    obj.nombreabreviado = (row["NOMBRE.ABREVIADO"].ToString());
                    obj.laboratorio = (row["LABORATORIO"].ToString());
                    obj.vvf = decimal.Parse(row["VVF"].ToString());
                    obj.pvf = decimal.Parse(row["PVF"].ToString());
                    obj.unidadmedidaa = (row["UMA"].ToString());
                    LISTA.Add(obj);
                }
                cnn.Close();
                return LISTA;
            }
            catch (Exception)
            {
                return null;
            }



        }
        //BY GUSTAVO
        //public List<AProducto> getProductos(string codigo, string nombre, string tipoproducto, string estado, string consulta)
        //{
        //    if (codigo == null)
        //        codigo = "";
        //    if (nombre == null)
        //        nombre = "";
        //    if (tipoproducto == null)
        //        tipoproducto = "";
        //    if (estado == null)
        //        estado = "";
        //    if (consulta == null)
        //        consulta = "";
        //    try
        //    {
        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Almacen.SP_getproductos", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@CODIGO", codigo);
        //        cmm.Parameters.AddWithValue("@NOMBRE", nombre);
        //        cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
        //        cmm.Parameters.AddWithValue("@ESTADO", estado);
        //        cmm.Parameters.AddWithValue("@CONSULTA", consulta);

        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "PRODUCTOS";

        //        AProducto producto = new AProducto();
        //        List<AProducto> lista = new List<AProducto>();
        //        foreach (DataRow row in tabla.Rows)
        //        {

        //            producto = new AProducto();
        //            producto.idproducto = int.Parse(row["idproducto"].ToString());
        //            producto.codigoproducto = (row["codigoproducto"].ToString());
        //            producto.nombre = (row["nombre"].ToString());
        //            producto.nombreabreviado = (row["nombreabreviado"].ToString());
        //            producto.idtipoproducto = (row["idtipoproducto"].ToString());
        //            //producto.idclase = int.Parse(row["idclase"].ToString());             
        //            producto.clase = (row["clase"].ToString());
        //            //producto.idsubclase = int.Parse(row["idsubclase"].ToString());             
        //            //producto.subclase = (row["subclase"].ToString());             
        //            //producto.proteccionluz = Boolean.Parse(row["proteccionluz"].ToString());             
        //            //producto.proteccionhumedad = Boolean.Parse(row["proteccionhumedad"].ToString());             
        //            //producto.idtemperatura = int.Parse(row["idtemperatura"].ToString());
        //            //producto.uma = int.Parse(row["uma"].ToString());             
        //            producto.unidadmedidaa = (row["unidadmedidaA"].ToString());
        //            //producto.umc = int.Parse(row["umc"].ToString());             
        //            //producto.unidadmedidac = (row["unidadmedidaC"].ToString());             
        //            //producto.idpresentacion = int.Parse(row["idpresentacion"].ToString());             
        //            producto.presentacion = (row["presentacion"].ToString());
        //            //producto.idequivalencia = int.Parse(row["idequivalencia"].ToString());             
        //            //producto.equivalencia = decimal.Parse(row["equivalencia"].ToString());             
        //            //producto.vvf = decimal.Parse(row["vvf"].ToString());             
        //            //producto.porcentajeigv = decimal.Parse(row["porcentajeigv"].ToString());             
        //            //producto.igv = decimal.Parse(row["igv"].ToString());             
        //            //producto.pvf = decimal.Parse(row["pvf"].ToString());             
        //            //producto.porcentajeganancia = decimal.Parse(row["porcentajeganancia"].ToString());             
        //            producto.pvfp = decimal.Parse(row["pvfp"].ToString());
        //            producto.estado = (row["estado"].ToString());
        //            lista.Add(producto);
        //        }
        //        cnn.Close();
        //        return lista;
        //    }
        //    catch (Exception )
        //    {
        //        return null;
        //    }
        //}       
        public DataTable getGenericoxProducto(int? id)
        {

            try
            {

                cnn.ConnectionString = cadena;
                cnn.Open();
                cnn = new SqlConnection();
                cmm = new SqlCommand("Almacen.sp_getProductoDetalleGenericos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@IDPRODUCTO", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS GENERICOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {

                return new DataTable();
            }

        }
        public DataTable BuscarGenericos(string filtro, int top)
        {

            try
            {
                if (filtro is null) filtro = "";
                if (top is 0) top = 30;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_buscar_genericos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@filtro", filtro);
                cmm.Parameters.AddWithValue("@top", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS GENERICOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {

                return new DataTable();
            }

        }
        public DataTable BuscarProductos(string codigoproducto, string nombreproducto, string tipoproducto, string estado, string laboratorio, int top)
        {
            try
            {
                if (top is 0) top = 99999;
                if (codigoproducto is null) codigoproducto = "";
                if (nombreproducto is null) nombreproducto = "";
                if (tipoproducto is null) tipoproducto = "";
                if (laboratorio is null) laboratorio = "";
                if (estado is null) estado = "HABILITADO";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("[Almacen].SP_BUSCAR_PRODUCTOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@PRODUCTO", nombreproducto);
                cmm.Parameters.AddWithValue("@CODIGO", codigoproducto);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataTable ObtenerProductosxFiltro(string filtro, string estado,  int top)
        {
            try
            {
                if (top is 0) top = 99999;
                if (filtro is null) filtro = "";
                if (estado is null) estado = "HABILITADO";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("[Almacen].SP_PRODUCTO_OBTENER", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@PRODUCTO", filtro);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@TOP", top);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataTable BuscarProductosconstockxAlmacen(string idalmacen, string producto, string tipoproducto, int top)
        {
            try
            {
                if (top is 0) top = 99999;
                if (tipoproducto is null) tipoproducto = "";
                if (idalmacen is null) idalmacen = "";
                if (producto is null) producto = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("[Almacen].SP_GET_PRODUCTOS_CON_STOCKXALMACEN", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDALMACEN", idalmacen);
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return tabla;
                // return new mensajeJson("ok",JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return null;
                //return new mensajeJson(e.Message,null);
            }
        }
        //getProductosxAlmacenstock
        public DataTable getTablaProductosxAlmacenstock(string tipoproducto, string codigo,
            string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {

            try
            {
                if (top is 0) top = 99999;
                if (tipoproducto is null) tipoproducto = "";
                if (codigo is null) codigo = "";
                if (nombreproducto is null) nombreproducto = "";
                if (laboratorio is null) laboratorio = "";
                if (clase is null) clase = "";
                if (subclase is null) subclase = "";
                if (estado is null) estado = "";
                if (idsucursalalmacen is null) idsucursalalmacen = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                string procedure;
                procedure="[Almacen].SP_BUSCAR_PRODUCTOSxALMACENSUCURSAL";
                cmm = new SqlCommand(procedure, cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@PRODUCTO", nombreproducto);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);
                cmm.Parameters.AddWithValue("@CLASE", clase);
                cmm.Parameters.AddWithValue("@SUBCLASE", subclase);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@IDSUCURSALALMACEN", idsucursalalmacen);
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public DataTable getTablaProductosxAlmacenstock_V2(string tipoproducto, string codigo,
            string nombreproducto, string laboratorio, string clase, string subclase, string estado,
            string idsucursalalmacen, int top)
        {

            try
            {
                if (top is 0) top = 99999;
                if (tipoproducto is null) tipoproducto = "";
                if (codigo is null) codigo = "";
                if (nombreproducto is null) nombreproducto = "";
                if (laboratorio is null) laboratorio = "";
                if (clase is null) clase = "";
                if (subclase is null) subclase = "";
                if (estado is null) estado = "";
                if (idsucursalalmacen is null) idsucursalalmacen = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                string procedure;
                procedure = "[Almacen].SP_BUSCAR_PRODUCTOSxALMACENSUCURSAL_V2";
                cmm = new SqlCommand(procedure, cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@PRODUCTO", nombreproducto);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);
                cmm.Parameters.AddWithValue("@CLASE", clase);
                cmm.Parameters.AddWithValue("@SUBCLASE", subclase);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@IDSUCURSALALMACEN", idsucursalalmacen);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return null;
            }
        }

        //gettablaproductodistribucionxid
        public mensajeJson getTablaProductoDistribucionxlote(string idproducto, string lote, string sucursal, string almacen)
        {
            try
            {
                if (idproducto is null) idproducto = "";
                if (sucursal is null) sucursal = "";
                if (almacen is null) almacen = "";
                if (lote is null) lote = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("[Almacen].SP_GETPRODUCTOXLOTEDISTRIBUCION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", idproducto);
                cmm.Parameters.AddWithValue("@LOTE", lote);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@ALMACEN", almacen);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable BuscarListaPrecioConProducto(int idproducto, string tipo)
        {
            try
            {
                tipo = tipo ?? "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_buscarproducto_en_listas", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelProductosAsync(string nombreproducto, string tipoproducto, string estado, string laboratorio, string path)
        {
            try
            {
                var data = await Task.Run(() =>
               {
                   var DATA = ReporteProductos(nombreproducto, tipoproducto, estado, laboratorio);
                   GuardarElementos save = new GuardarElementos();
                   var nombre = "reporteproductos" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                   string direccion = "/archivos/reportes/almacen/";
                   string ruta = Path.Combine(path + direccion, "");
                   string res = save.GenerateExcel(ruta, nombre, DATA);
                   if (res == "ok")
                       return new mensajeJson("ok", direccion + nombre);
                   else
                       return new mensajeJson(res, direccion + nombre);
               });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }

        private DataTable ReporteProductos(string nombreproducto, string tipoproducto, string estado, string laboratorio)
        {
            try
            {
                if (nombreproducto is null) nombreproducto = "";
                if (tipoproducto is null) tipoproducto = "";
                if (laboratorio is null) laboratorio = "";
                if (estado is null) estado = "HABILITADO";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("[Almacen].sp_reporte_productos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@PRODUCTO", nombreproducto);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";

                //SCRIPT RENOMBRACIÓN DE COLUMNAS EN BASE A LOS DOS MESES ANTERIORES
                //DateTimeFormatInfo formatoFecha = CultureInfo.CurrentCulture.DateTimeFormat;
                //DateTime date = DateTime.Now;
                //string nombreMesAnterior = formatoFecha.GetMonthName(date.Month-1);
                //string nombreMesTrasAnterior = formatoFecha.GetMonthName(date.Month-2);
                //tabla.Columns["MES_TRASANTERIOR"].ColumnName = nombreMesTrasAnterior.ToUpper();
                //tabla.Columns["MES_ANTERIOR"].ColumnName = nombreMesAnterior.ToUpper();
                //------------------------------------------------------------------

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable BuscarProductosRequerimiento(int idproducto)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_buscar_producto_para_requerimiento", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", idproducto);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTO";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // CODIGO FILTRAR CODIGO DE BARRAS YEX
        public async Task<bool> SP_ExisteCodigoBarra(string idcodigobarra)
        {
            try
            {
                idcodigobarra = idcodigobarra ?? "";
                using (cnn = new SqlConnection(cadena))
                {
                    await cnn.OpenAsync();
                    using (cmm = new SqlCommand("SP_ListarDatos", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@idcodigo", idcodigobarra);

                        using (SqlDataAdapter da = new SqlDataAdapter(cmm))
                        {
                            DataTable tabla = new DataTable();
                            await Task.Run(() => da.Fill(tabla));

                            return tabla.Rows.Count > 0;
                        }
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public DataTable SPListarProductosNuevosDistribucion(string idsucursalalmacen)
        {
            try
            {
                if (idsucursalalmacen is null) idsucursalalmacen = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                string procedure;
                procedure = "Almacen.sp_ListarProductosNuevosDistribucion";
                cmm = new SqlCommand(procedure, cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSUCURSALALMACEN", idsucursalalmacen);
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS NUEVOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
