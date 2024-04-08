using ENTIDADES.ventas;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Ventas.DAO
{
    public class CanalVentaDAO
    {

        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;
        public CanalVentaDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public List<CanalVenta> ListarCanalesPrecios()
        {
            List<CanalVenta> canalVentas = new List<CanalVenta>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();

            try
            {
                cmm = new SqlCommand("SP_VENTAS_CANAL_VENTAS_LISTAR", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = cmm.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        canalVentas.Add(new CanalVenta()
                        {
                            idcanalventa = dr.GetString(0),
                            descripcion = dr.GetString(1),
                            estado = dr.GetString(2),
                        });
                    }
                }
            }
            catch (Exception)
            {
                canalVentas = null;
            }
            cnn.Close();
            return canalVentas;
        }
    }
}
