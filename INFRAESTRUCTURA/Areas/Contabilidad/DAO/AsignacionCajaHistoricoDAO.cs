using Erp.Entidades.Contabilidad;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Contabilidad.DAO
{
    public class AsignacionCajaHistoricoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;

        public AsignacionCajaHistoricoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public List<AsignacionCajaHistorico> AsignacionCajaHistoricoListar(string idSucursalResp)
        {
            List<AsignacionCajaHistorico> asignacionHistorico = new List<AsignacionCajaHistorico>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();

            cmm = new SqlCommand("SP_CAJA_ASIG_HIST_LISTAR", cnn);
            cmm.Parameters.AddWithValue("@idSucursalResp", idSucursalResp);
            cmm.CommandType = CommandType.StoredProcedure;

            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    asignacionHistorico.Add(new AsignacionCajaHistorico()
                    {
                        monto = dr.GetDecimal(0),
                        montoCajaTipo=dr.GetString(1),
                        usuario_op = dr.GetString(2),
                        fecha_modificacion = dr.GetDateTime(3).ToString()
                    });
                }
            }
            cnn.Close();
            return asignacionHistorico;
        }
    }
}
