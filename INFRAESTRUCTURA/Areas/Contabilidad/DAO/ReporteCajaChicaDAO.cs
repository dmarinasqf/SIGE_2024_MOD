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
    public class ReporteCajaChicaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;






        public ReporteCajaChicaDAO(string cadena)
        {
            this.cadena = cadena;
        }

     
   






        public List<ReporteCajaChica> cajaRendicionListarUser(string fechaInicial, string fechaFinal, string origen)
        {
            List<ReporteCajaChica> cajaChicas = new List<ReporteCajaChica>();

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();

                    using (SqlCommand cmm = new SqlCommand("SP_REP_PLANTILLA_STARSOFT_CAJA_CHICA_1", cnn))
                    {
                        cmm.Parameters.AddWithValue("@fechaInicial", fechaInicial);
                        cmm.Parameters.AddWithValue("@fechaFinal", fechaFinal);
                        cmm.Parameters.AddWithValue("@origen", origen);
                        cmm.CommandType = CommandType.StoredProcedure;

                        using (SqlDataReader dr = cmm.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                ReporteCajaChica reporte = new ReporteCajaChica();

                                if (origen == "COMPRAS")
                                {
                                    // Si el origen es "compras", obtener CTACONTABLE y ANIOMESPROCESO
                                    reporte.CTACONTABLE = dr.GetString(0);
                                    reporte.ANIOMESPROCESO = dr.GetString(1);
                                    reporte.SUBDIARIO = dr.GetString(2);
                                    reporte.COMPROBANTE = dr.GetString(3);
                                    reporte.FECHA_DOCUMENTO = dr.GetString(4);
                                    reporte.TIPO_ANEXO = dr.GetString(5);
                                    reporte.CODIGO_PROV = dr.GetString(6);
                                    reporte.TIPODOCUMENTO = dr.GetString(7);
                                    reporte.NUMDOC = dr.GetString(8);
                                    reporte.FECHA_VENCIMIENTO = dr.GetString(9);
                                    reporte.IGV = dr.GetString(10);
                                    reporte.TASAIGV = dr.GetString(11);
                                    reporte.IMPORTE = dr.GetDecimal(12);
                                    reporte.CONV = dr.GetString(13);
                                    reporte.FECHA_REGISTRO = dr.GetString(14);
                                    reporte.TIPO_CAMBIO = dr.GetDecimal(15);
                                    reporte.GLOSA = dr.GetString(16);
                                    reporte.DESTINO = dr.GetString(17);
                                    reporte.PORCE_OPE_MIXTA = dr.GetDecimal(18);
                                    reporte.VALOR_CIF = dr.GetDecimal(19);
                                    reporte.TIPO_DOC_REF = dr.GetString(20);
                                    reporte.NRO_DOC_REF = dr.GetString(21);
                                    reporte.CENTRO_DE_COSTOS = dr.GetString(22);
                                    reporte.DETRACCION = dr.GetInt32(23);
                                    reporte.NRO_DOC_DETRACCION = dr.GetString(24);
                                    reporte.FECHA_DETRACCION = dr.GetString(25);
                                    reporte.FECHA_DOC_REF = dr.GetString(26);
                                    reporte.GLOSA_MOVIMIENTO = dr.GetString(27);
                                    reporte.DOCUMENTO_ANULADO = dr.GetInt32(28);
                                    reporte.IGV_POR_APLICAR = dr.GetInt32(29);
                                    reporte.CODIGO_DETRACCION = dr.GetString(30);
                                    reporte.IMPORTACION = dr.GetInt32(31);
                                    reporte.DEBE_HABER = dr.GetString(32);
                                    reporte.TASA_DETRACCION = dr.GetDecimal(33);
                                    reporte.IMPORTE_DETRACCION = dr.GetDecimal(34);
                                    reporte.NRO_FILE = dr.GetString(35);
                                    reporte.OTROS_ATRIBUTOS = dr.GetString(36);
                                    reporte.IMP_BOLSA = dr.GetDecimal(37);
                                }
                                else if(origen == "MOVILIDAD")
                                {
                                    // Si el origen no es "compras", ejecutar la opción dos del SP y obtener otros campos
                                    reporte.CTA = dr.GetString(0);  
                                    reporte.ANIOM = dr.GetString(1);
                                    reporte.SUBDIARIOO = dr.GetString(2);
                                    reporte.COMPROBANTEE = dr.GetString(3);
                                    reporte.FECHA_DOCUMENTOO = dr.GetString(4);
                                    reporte.TIPO_ANEXOO = dr.GetString(5);
                                    reporte.CODIGO_DE_ANEXOO = dr.GetString(6);
                                    reporte.TIPO_DOCUMENTOO = dr.GetString(7);
                                    reporte.NRO_DOCC = dr.GetString(8);
                                    reporte.FECHA_VENCIMIENTOO = dr.GetString(9);
                                    reporte.MONEDAA = dr.GetString(10);
                                    reporte.IMPORTEE = dr.GetDecimal(11);
                                    reporte.CONVV = dr.GetString(12);
                                    reporte.FECHA_REGISTROO = dr.GetString(13);
                                    reporte.TIPO_CAMBIOO = dr.GetDecimal(14);
                                    reporte.GLOSAA = dr.GetString(15);
                                    reporte.CENTRO_DE_COSTOSS = dr.GetString(16);
                                    reporte.GLOSA_MOVIMIENTOO = dr.GetString(17);
                                    reporte.DOCUMENTO_ANULADOO = dr.GetInt32(18);
                                    reporte.DEBE_HABERR = dr.GetString(19);
                                    reporte.MEDIO_DE_PAGOO = dr.GetString(20);
                                    reporte.NRO_FILEE = dr.GetString(21);
                                    reporte.FLUJO_DE_EFECTIVOO = dr.GetString(22);

                                }

                                else if (origen == "RXH")
                                {
                                    reporte.CTACONTABLE1 = dr.GetString(0);
                                    reporte.ANIOMESPROCESO1 = dr.GetString(1);
                                    reporte.SUBDIARIO1 = dr.GetString(2);
                                    reporte.COMPROBANTE1 = dr.GetString(3);
                                    reporte.FECHA_DOCUMENTO1 = dr.GetString(4);
                                    reporte.TIPO_ANEXO1 = dr.GetString(5);
                                    reporte.CODIGO_ANEXO1 = dr.GetString(6);
                                    reporte.TIPODOCUMENTO1 = dr.GetString(7);
                                    reporte.NUMDOC1 = dr.GetString(8);
                                    reporte.FECHA_VENCIMIENTO1 = dr.GetString(9);
                                    reporte.IMPORTE1 = dr.GetDecimal(10);
                                    reporte.CONV1 = dr.GetString(11);
                                    reporte.FECHA_REGISTRO1 = dr.GetString(12);
                                    reporte.TIPO_CAMBIO1 = dr.GetDecimal(13);
                                    reporte.GLOSA1 = dr.GetString(14);
                                    reporte.DESTINO_DE_COMPRA1 = dr.GetString(15);
                                    reporte.CENTRO_COSTOS1 = dr.GetString(16);
                                    reporte.GLOSA_MOVIMIENTO1 = dr.GetString(17);
                                    reporte.DOCUMENTO_ANULADO1 = dr.GetInt32(18);
                                    reporte.DEBE_HABER1 = dr.GetString(19);
                                    reporte.NRO_FILE1 = dr.GetString(20);



                                }

                                cajaChicas.Add(reporte);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Manejar la excepción según tus necesidades
                Console.WriteLine("Error: " + ex.Message);
            }

            return cajaChicas;
        }

    }
}
