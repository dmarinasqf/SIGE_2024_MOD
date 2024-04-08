using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Procedimiento.DAO
{
    public class ProcedimientoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public ProcedimientoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public async Task<mensajeJson> listarproc(string fechainicio, string fechafin, string sucursal, string empconsulta)
        {
            try
            {
                //'01/12/2021','01/12/2021','144','VENTAS','1548'
                var data = await Task.Run(()=> getprocedimientos(fechainicio, fechafin, sucursal, empconsulta));
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public DataTable getprocedimientos(string fechainicio, string fechafin, string sucursal, string empconsulta)
        {
            

            if (sucursal == null) sucursal = "";
            if (empconsulta == null) empconsulta = "";
            if (fechainicio == null) fechainicio = "";
            if (fechafin == null) fechafin = "";
            string perfil = "";

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Almacen.SP_GETGUIAS_AUDITORIA", cnn);
                cmm = new SqlCommand("SP_LISTARPROCEDIMIENTOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@PERFIL", perfil);
                cmm.Parameters.AddWithValue("@EMPCONSULTA", empconsulta);
                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA PROC";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> BuscarPedidoCompleto(int codigo) {

            //var data ;
            return null;
        }

    }
}
