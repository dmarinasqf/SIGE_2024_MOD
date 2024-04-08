using Erp.Persistencia.Repositorios.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.DAO
{
    public class AprobarFacturaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public AprobarFacturaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable getFacturaPreingresoParaValidacion(int idfactura)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.SP_BUSCAR_FACTURA_PARA_VALIDACION_V2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDFACTURA", idfactura);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DATOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable ListarFacturas(int top, string numfactura, string numpreingreso, string numordencompra, int idsucursal, string estado)
        {
            try
            {
                if (numfactura is null) numfactura = "";
                if (numpreingreso is null) numpreingreso = "";
                if (numordencompra is null) numordencompra = "";
                if (estado is null) estado = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_LISTAR_FACTURAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@numfactura", numfactura);
                cmm.Parameters.AddWithValue("@numpreingreso", numpreingreso);
                cmm.Parameters.AddWithValue("@numordencompra", numordencompra);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@estado", estado);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "FACTURAS";

                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable ListarFacturasParaNotaCredito(int top, string numfactura, int idsucursal, string estadoNC)
        {
            try
            {
                if (numfactura is null) numfactura = "";
                if (estadoNC is null) estadoNC = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_LISTAR_FACTURAS_PARA_NCDEVOLUCIONDIFERENCIA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@numfactura", numfactura);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@estado", estadoNC);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "FACTURAS";

                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public DataTable BuscarDetallePorFacturaParaNotaCredito(int idfactura)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_BUSCAR_NCDEVOLUCIONDIFERENCIA_POR_FACTURA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDFACTURA", idfactura);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DATOS";

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
