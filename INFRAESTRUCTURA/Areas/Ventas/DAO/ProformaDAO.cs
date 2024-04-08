using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.DAO
{
    public class ProformaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public ProformaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetProformaCompleta(long idproforma)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_GET_PROFORMA_COMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPROFORMA", idproforma);
                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PROFORMACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public async Task<DataTable> HistorialProformasAsync(string fechainicio, string fechafin, string sucursal, string numdocumento, int top,int numsemanas,string estado)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    if (top is 0) top = 10;
                    if (fechafin is null) fechafin = "";
                    if (fechainicio is null) fechainicio = "";
                    if (sucursal is null) sucursal = "";
                    if (numdocumento is null) numdocumento = "";
                    if (estado is null) estado = "";
                    if (numsemanas is 0) numsemanas = 1;

                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.SP_HISTORIAL_PROFORMAS", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                    cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                    cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                    cmm.Parameters.AddWithValue("@RANGOSEMANAS", numsemanas);
                    cmm.Parameters.AddWithValue("@NUMDOCUMENTO", numdocumento);
                    cmm.Parameters.AddWithValue("@ESTADO", estado);
                    cmm.Parameters.AddWithValue("@TOP", top);
                    DataTable tabla = new DataTable();
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "HISTORIAL PROFORMAS";
                    cnn.Close();

                    return tabla;
                }
                catch (Exception)
                {
                    return new DataTable();
                }
            });
            return tarea;
        }
    }
}
