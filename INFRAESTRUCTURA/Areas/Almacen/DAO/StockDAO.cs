using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class StockDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public StockDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public DataTable BuscarProductos(string producto, int sucursal, string idalmacensucursal, int idlista, int top)
        {

            try
            {
                if (top is 0) top = 10;
                if (producto is null) producto = "";
                if (idalmacensucursal is null) idalmacensucursal = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_BUSCAR_PRODUCTOS_STOCK_LISTA_PRECIO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@ALMACEN", idalmacensucursal);
                cmm.Parameters.AddWithValue("@IDLISTA", idlista);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable GetGenericosXProductosConStock(int producto, string sucursal, int idlista)
        {

            try
            {

                if (sucursal is null) sucursal = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_GENERICOS_PARA_VENTA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", producto);
                cmm.Parameters.AddWithValue("@idlista", idlista);
                cmm.Parameters.AddWithValue("@sucursal", sucursal);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable GetStockProductosxLote(int idproducto, int sucursal, string idalmacensucursal)
        {

            try
            {
                if (idalmacensucursal is null) idalmacensucursal = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_STOCK_PRODUCTO_X_LOTE", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", idproducto);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@ALMACEN", idalmacensucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable GetProductosConStock(string producto, string sucursal, string tipoproducto, int top, string laboratorio)
        {

            try
            {
                if (producto is null) producto = "";
                if (sucursal is null) sucursal = "";
                if (tipoproducto is null) tipoproducto = "";
                if (laboratorio is null) laboratorio = "";
                if (top is 0) top = 15;

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_PRODUCTOS_CON_STOCK", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                cmm.Parameters.AddWithValue("@TIPOPRODUCTO", tipoproducto);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.Parameters.AddWithValue("@IDLABORATORIO", laboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS CON STOCK";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public DataTable GetStockProductosParaVenta(long idstock, int idlista, string canalventa, string sucursal_reg)
        {
            try
            {
                if (canalventa is null) canalventa = "";
                if (sucursal_reg is null) sucursal_reg = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_STOCK_PRODUCTO_PARA_VENTA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSTOCK", idstock);
                cmm.Parameters.AddWithValue("@IDLISTA", idlista);
                cmm.Parameters.AddWithValue("@IDCANALVENTA", canalventa);//CAMPO AGREGADO
                cmm.Parameters.AddWithValue("@SUCURSAL_REG", sucursal_reg);//CAMPO AGREGADO
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        //EARTCOD1008
        //public DataTable GetStockProductosParaVenta(long idstock, int idlista, string canalventa, string sucursal_reg, int idcliente)
        //{
        //    try
        //    {
        //        if (canalventa is null) canalventa = "";
        //        if (sucursal_reg is null) sucursal_reg = "";

        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Almacen.SP_GET_STOCK_PRODUCTO_PARA_VENTA", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@IDSTOCK", idstock);
        //        cmm.Parameters.AddWithValue("@IDLISTA", idlista);
        //        cmm.Parameters.AddWithValue("@IDCANALVENTA", canalventa);//CAMPO AGREGADO
        //        cmm.Parameters.AddWithValue("@SUCURSAL_REG", sucursal_reg);//CAMPO AGREGADO
        //        cmm.Parameters.AddWithValue("@ID_CLIENTE", idcliente);//EARTCOD1008
        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "STOCK PRODUCTO";
        //        cnn.Close();
        //        return tabla;
        //    }
        //    catch (Exception e)
        //    {
        //        return new DataTable();
        //    }
        //}


        //public DataTable GetStockProductosParaVenta(long idstock, int idlista)
        //{

        //    try
        //    {


        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Almacen.SP_GET_STOCK_PRODUCTO_PARA_VENTA", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@IDSTOCK", idstock);
        //        cmm.Parameters.AddWithValue("@IDLISTA", idlista);
        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "STOCK PRODUCTO";
        //        cnn.Close();
        //        return tabla;
        //    }
        //    catch (Exception e)
        //    {
        //        return new DataTable();
        //    }
        //}

        public DataTable GetStockProductoxDescuento(long idproducto, int idlista, int iddescuento, int idsucursal, string tipo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_get_stock_producto_x_descuento_kit", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                cmm.Parameters.AddWithValue("@idlista", idlista);
                cmm.Parameters.AddWithValue("@iddescuento", iddescuento);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable GetStockEnSucursalxProducto(int idproducto)
        {

            try
            {


                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GetStock_en_Sucursal_x_Producto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@producto", idproducto);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public DataTable RegistrarProductosSinStock(int idproducto, int sucursal, string idalmacensucursal)
        {
            try
            {
                if (idalmacensucursal is null) idalmacensucursal = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_REG_PRODUCTO_SIN_STOCK", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", idproducto);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@ALMACEN", idalmacensucursal);
                cmm.Parameters.AddWithValue("@FECHA", DateTime.Now);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS SIN STOCK";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
    }
}

