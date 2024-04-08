using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.DAO
{
   public class GuiaDevolucionDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public GuiaDevolucionDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetGuiaCompleta(string tipo, int idtabla)
        {

            try
            {
                if (tipo is null) return new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.sp_buscar_guia_devolucion_completa", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idtabla", idtabla);
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
        public DataTable HistorialGuias(string idsucursal, string ordencompra,string preingreso,string factura,string guia, string fechainicio,string fechafin,int top)
        {

            try
            {
                idsucursal = idsucursal ?? "";
                ordencompra = ordencompra ?? "";
                preingreso = preingreso ?? "";
                factura = factura ?? "";
                guia = guia ?? "";
                fechainicio = fechainicio ?? "";
                fechafin = fechafin ?? "";
                if (top is 0) top = 100;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.sp_historial_guias_devolucion", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@ordencompra", ordencompra);
                cmm.Parameters.AddWithValue("@preingreso", preingreso);
                cmm.Parameters.AddWithValue("@factura", factura);
                cmm.Parameters.AddWithValue("@guia", guia);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@top", top);

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

        public DataTable getTablaDevolucionImpresion(string id)
        {
            if (id == null)
                id = "";
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GUIADEVOLUCION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA DEVOLUCION";
                cnn.Close();
                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }

        public DataTable getTablaDevolucionImpresionV2(string id) {
            if (id == null)
                id = "";
            try {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GUIADEVOLUCION_V2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA DEVOLUCION";
                cnn.Close();
                return tabla;
            }
            catch (Exception e) {
                return new DataTable();
            }
        }

        public DataTable GetMotivoDevolucion()
        {

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.ListarMotivoDevolucion", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

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
    }
}
