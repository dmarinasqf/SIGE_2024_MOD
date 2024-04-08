using ENTIDADES.Generales;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.DAO
{
    public class CajaDAO
    {
        SqlConnection cnn;
        SqlCommand cmm;
        private readonly string cadena;
        public CajaDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public async Task<mensajeJson> getSerieCajaxSucursal(string idsucursal, string nombredocumento)
        {
            try
            {
                var data = getTablaSerieCajaxSucursal(idsucursal, nombredocumento);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public DataTable getTablaSerieCajaxSucursal(string idsucursal, string nombredocumento)
        {
            if (idsucursal == null)
                idsucursal = "";
            if (nombredocumento == null)
                nombredocumento = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETSERIECAJAXSUCURSAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSUCURSAL", idsucursal);
                cmm.Parameters.AddWithValue("@NOMBREDOCUMENTO", nombredocumento);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SERIES";
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
