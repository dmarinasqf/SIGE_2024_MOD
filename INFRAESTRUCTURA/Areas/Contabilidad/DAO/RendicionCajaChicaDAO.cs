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
    public class RendicionCajaChicaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;

        public RendicionCajaChicaDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public  RendicionCajaChica RendicionCajaChicaBuscar(string idSucursalResp)
        {
            List<RendicionCajaChicaDetalle> detalle = new List<RendicionCajaChicaDetalle>();
            RendicionCajaChica rendicion = new RendicionCajaChica();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_CHICA_BUSCAR", cnn);
            cmm.Parameters.AddWithValue("@idSucursalResp", idSucursalResp);
            cmm.CommandType = CommandType.StoredProcedure;
            try
            {
                using (SqlDataReader dr = cmm.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        rendicion.idCajaChica = dr.GetInt32(0);
                        rendicion.idSucursalResp = dr.GetString(1);
                        rendicion.montoCajaChica = dr.GetDecimal(2);
                        rendicion.saldoUltimaRep = dr.GetDecimal(3);
                        rendicion.montoUltimaRep = dr.GetDecimal(4);
                        rendicion.fechaUltimaRep = dr.GetDateTime(5).ToString();
                        rendicion.montoDisponible = dr.GetDecimal(6);
                        rendicion.saldoCaja = dr.GetDecimal(7);
                        rendicion.montoReponer = dr.GetDecimal(8);
                        rendicion.totalGastos = dr.GetDecimal(9);
                        rendicion.estado = dr.GetString(10);
                        rendicion.validacionSAV = dr.GetString(11);
                        rendicion.validacionCont = dr.GetString(12);
                        rendicion.responsable = dr.GetString(13);
                    }
                }

                SqlCommand cmm2 = new SqlCommand();
                cmm2 = new SqlCommand("SP_CAJA_CHICA_DETALLE_BUSCAR", cnn);
                cmm2.Parameters.AddWithValue("@idCajaChica", rendicion.idCajaChica);
                cmm2.CommandType = CommandType.StoredProcedure;
                List<RendicionCajaChicaDetalle> rendicionDetalle = new List<RendicionCajaChicaDetalle>();
                using (SqlDataReader dr2 = cmm2.ExecuteReader())
                {
                    while (dr2.Read())
                    {
                        rendicionDetalle.Add(new RendicionCajaChicaDetalle()
                        {
                            idCajaChicaDet = dr2.GetInt32(0),
                            idCajaChica = dr2.GetInt32(1),
                            numItem = dr2.GetInt32(2),
                            idValidacion = dr2.GetString(3),
                            fecha = dr2.GetDateTime(4).ToString(),
                            tipoDoc = dr2.GetString(5),
                            numRuc= dr2.GetString(6),
                            numSerie = dr2.IsDBNull(7)?"-":dr2.GetString(7),
                            numDoc = dr2.GetString(8),
                            tipoGastos = dr2.IsDBNull(9)?"-": dr2.GetString(9),
                            total = dr2.GetDecimal(10),
                            saldo = dr2.GetDecimal(11),
                            comentarios = dr2.IsDBNull("comentarios") ? "NINGUNO" : dr2.GetString(12),
                            recursoImgb64 = dr2.IsDBNull("recursoImg") ? null : Convert.ToBase64String( (byte[])dr2["recursoImg"]),
                            estado_op = dr2.GetString(14),
                            tipo_op = dr2.GetString(15),
                        });
                    }
                }
                rendicion.detalleCaja = rendicionDetalle;
                cnn.Close();
            }
            catch (Exception e)
            {
                rendicion.estado = e.Message;
            }
            return rendicion;
        }

        public string RendicionAgregarDetalleItem(RendicionCajaChicaDetalle detalle)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_CHICA_DETALLE_AGREGAR_ITEM", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idCajaChica", detalle.idCajaChica);
                cmm.Parameters.AddWithValue("@fecha", detalle.fecha);
                cmm.Parameters.AddWithValue("@numRuc", detalle.numRuc);
                cmm.Parameters.AddWithValue("@tipoDoc", detalle.tipoDoc);
                cmm.Parameters.AddWithValue("@numSerie", detalle.numSerie);
                cmm.Parameters.AddWithValue("@numDoc", detalle.numDoc);
                cmm.Parameters.AddWithValue("@tipoGastos", detalle.tipoGastos);
                cmm.Parameters.AddWithValue("@total", detalle.total);
                cmm.Parameters.AddWithValue("@comentarios", detalle.comentarios);
                cmm.Parameters.AddWithValue("@recursoImg", detalle.recursoImg);
                cmm.Parameters.AddWithValue("@centro_costos_dos", detalle.centro_costos_dos);
                cmm.Parameters.AddWithValue("@tp_igv", detalle.tp_igv);

                int fila = cmm.ExecuteNonQuery();
                if (fila > 0)
                {
                    respuesta = "success";
                }
                cnn.Close();
            }
            catch (SqlException e)
            {
                if (e.Number == 2601)
                {
                    // Violation in unique index
                    respuesta = "error_ui";
                }
                else if (e.Number == 2627)
                {
                    // Violation in unique constraint
                    respuesta = "error_uc";
                }
                else
                {
                    respuesta = "error" + e.Message;
                }
            }
            return respuesta;
        }

        public  List<CajaChicaConcepto>  RendicionConceptoListar(int idsucursal)
        {
            List<CajaChicaConcepto> cajaChicaConceptos = new List<CajaChicaConcepto>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_CHICA_DET_CONCEPTO", cnn);
            cmm.Parameters.AddWithValue("@idsucursal",idsucursal);
            cmm.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    cajaChicaConceptos.Add(new CajaChicaConcepto()
                    {
                        IdCajaChicaConcepto = dr.GetInt32(0),
                        Descripcion = dr.GetString(1),
                    });
                }
            }
            cnn.Close();
            return cajaChicaConceptos;
        }

        public List<ResponsableSede> cajaRendicionListarUser(string emp_codigo,string fechaInicial, string fechaFinal)
        {
            List<ResponsableSede> cajaChicas = new List<ResponsableSede>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_RENDICION_LISTAR_USER", cnn);
            cmm.Parameters.AddWithValue("@emp_codigo", emp_codigo);
            cmm.Parameters.AddWithValue("@fechaInicial", fechaInicial);
            cmm.Parameters.AddWithValue("@fechaFinal", fechaFinal);
            cmm.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    cajaChicas.Add(new ResponsableSede()
                    {
                        idSucursalResp = dr.GetString(0),
                        montoCaja = dr.GetDecimal(1),
                        saldoCaja = dr.GetDecimal(2),
                        montoReponer = dr.GetDecimal(3),
                        responsableCaja = dr.GetString(4),
                        nombreSucursal = dr.GetString(5),
                        fecha_modificacion = dr.GetDateTime(6).ToString()
                    });
                }
            }
            cnn.Close();
            return cajaChicas;
        }

        public string RendicionEliminarDetalleItem(string idCajaChicaDet)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_CHICA_DETALLE_ITEM_DEL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idCajaChicaDet", idCajaChicaDet);

                int fila = cmm.ExecuteNonQuery();
                if (fila > 0)
                {
                    respuesta = "success";
                }
                cnn.Close();
            }
            catch (SqlException e)
            {
                respuesta = "error" + e.Message;
            }
            return respuesta;
        }
    }
}
