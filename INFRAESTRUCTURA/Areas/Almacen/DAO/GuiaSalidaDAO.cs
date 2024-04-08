using ENTIDADES.Almacen;
using ENTIDADES.facturacionHorizont;
using ENTIDADES.facturacionHorizont.Utils;
using ENTIDADES.ventas;
using Erp.Entidades.facturacionHorizont;
using Erp.Entidades.facturacionHorizont.GuiaElectronica.GuiaRemitente;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class GuiaSalidaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public GuiaSalidaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public async Task<mensajeJson> getSucursalDistribucion(string idproducto, string rango, string sucursales, int tipo)
        {
            try
            {
                var data = getTablaDistribucion(idproducto, rango, sucursales, tipo);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }

        public async Task<mensajeJson> getGuiaSalida(string codigo, string idsucursalorigen, string idsucursaldestino,
            string fechainicio, string fechafin, string estado, int top, int idtipoguia)
        {
            try
            {
                var data = getTablaGuiasSalidas(codigo, idsucursalorigen, idsucursaldestino, fechainicio, fechafin, estado, top, idtipoguia);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }

        public async Task<mensajeJson> getGuiaSalidaPorCargar(string codigo, string idsucursalorigen, string idsucursaldestino, string estado)
        {
            try
            {
                var data = getTablaGuiasSalidasPorCargar(codigo, idsucursalorigen, idsucursaldestino, estado);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }

        public async Task<mensajeJson> getGuiaSalidaCompleta(string id)
        {
            var tarea = await Task.Run(() => {
                try
                {

                    if (id == "" || id is null)
                        return (new mensajeJson("nuevo", JsonConvert.SerializeObject(new DataTable())));
                    var obj = getTablaGuiaSalidaCompleta(id);
                    if (obj is null)
                        return (new mensajeJson("notfound", JsonConvert.SerializeObject(new DataTable())));
                    else
                        return new mensajeJson("ok", JsonConvert.SerializeObject(obj));

                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
                }
            });
            return tarea;
        }
        public async Task<mensajeJson> getGuiaSalidaCompletaParaVentas(string id)
        {
            var tarea = await Task.Run(() => {
                try
                {

                    if (id == "" || id is null)
                        return (new mensajeJson("nuevo", JsonConvert.SerializeObject(new DataTable())));
                    var obj = getTablaGuiaSalidaCompletaParaVentas(id);
                    if (obj is null)
                        return (new mensajeJson("notfound", JsonConvert.SerializeObject(new DataTable())));
                    else
                        return new mensajeJson("ok", JsonConvert.SerializeObject(obj));

                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
                }
            });
            return tarea;
        }

        public async Task<mensajeJson> ListarTipoGuia()
        {
            var tarea = await Task.Run(() => {
                try
                {
                    var data = ListarTipoGuiaDt();
                    return new mensajeJson("ok", JsonConvert.SerializeObject(data));
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
                }
            });
            return tarea;
        }
        public DataTable getTablaDistribucion(string idproducto, string rango, string sucursales, int tipo)
        {
            if (idproducto == null) idproducto = "";
            if (rango == null) rango = "";
            if (sucursales is null) sucursales = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Almacen.SP_Stockparadistribuir", cnn);

                // SE CAMBIO DE LA VESION2 A LA VERSION3  EL 20/11/2023, PARA AGREGAR  LABORATORIOS  EN DISTRIBUCION---solo se modifico el procedimiento, no los parametros     --COMENTARIO IMPORTANTE  -----YEX 
                cmm = new SqlCommand("Almacen.SP_Stockparadistribuir_v3", cnn); //Semana3 3.5

                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPRODUCTO", idproducto);
                cmm.Parameters.AddWithValue("@RANGO", rango);
                cmm.Parameters.AddWithValue("@sucursales", sucursales);
                cmm.Parameters.AddWithValue("@tipo", tipo.ToString());
                cmm.CommandTimeout = 0;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA DISTRIBUCIÓN";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaGuiasSalidas(string codigo, string idsucursalorigen, string idsucursaldestino, string fechainicio, string fechafin, string estado, int top, int idtipoguia)
        {
            if (codigo == null) codigo = "";
            if (idsucursalorigen == null) idsucursalorigen = "";
            if (idsucursaldestino == null) idsucursaldestino = "";
            if (fechainicio == null) fechainicio = "";
            if (fechafin == null) fechafin = "";
            if (estado == null) estado = "";
            if (top == 0) top = 9999;

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Almacen.SP_GETGUIAS_AUDITORIA", cnn);
                cmm = new SqlCommand("Almacen.SP_GETGUIASGENERADAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@SUCURSALORIGEN", idsucursalorigen);
                cmm.Parameters.AddWithValue("@SUCURSALDESTINO", idsucursaldestino);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.Parameters.AddWithValue("@IDTIPOGUIA", idtipoguia);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        //getTablaGuiasSalidasPorCargar(codigo, idsucursalorigen, fecha, estado);
        public DataTable getTablaGuiasSalidasPorCargar(string codigo, string idsucursalorigen, string idsucursaldestino, string estado)
        {
            if (codigo == null)
                codigo = "";
            if (idsucursalorigen == null)
                idsucursalorigen = "";
            if (idsucursaldestino == null) idsucursaldestino = "";
            if (estado == null)
                estado = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASALIDAPORCARGAR_GUIAENTRADA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@SUCURSALORIGEN", idsucursalorigen);
                cmm.Parameters.AddWithValue("@SUCURSALDESTINO", idsucursaldestino);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaGuiaSalidaCompleta(string id)
        {
            if (id == null)
                id = "";

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASSALIDACOMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaGuiasSalidaImpresion(string id)
        {
            if (id == null)
                id = "";


            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASSALIDAIMPRESION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getCodigosGuiasDistribucion(string fechainicio, string fechafin, string estadoguia)
        {
            if (fechainicio == "01/01/01" || fechainicio == null) fechainicio = "01/01/1900";
            if (fechafin == "01/01/01" || fechafin == null) fechafin = "01/01/1900";
            if (estadoguia == null) estadoguia = "";

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_buscarCodigosGuiasDistribucion", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechainicio", Convert.ToDateTime(fechainicio));
                cmm.Parameters.AddWithValue("@fechafin", Convert.ToDateTime(fechafin));
                cmm.Parameters.AddWithValue("@estadoguia", estadoguia);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CODIGO GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaGuiaSalidaCompletaParaVentas(string id)
        {
            if (id == null)
                id = "";

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASSALIDACOMPLETAPARAVENTAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable GuiaRemitenteH(long idguiasalida, string tipo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.GuiaRemitente", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@id", idguiasalida);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "GUIAREMISION";
                cnn.Close();

                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }
        public DataTable GuiaTransportistaH(long idguiasalida, string tipo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.GuiaTransportista", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@id", idguiasalida);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "GUIATRANSPORTISTA";
                cnn.Close();

                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }

        public async Task<string> GenerarGuiasTxt(long idguia,string tipo,string path) {

            List<string> lista = new List<string>();
            //lista.Add("Transportista");
            lista.Add("Remitente");
            List<Task<string>> rpt = new List<Task<string>>();
            int x = 0;
            for (int i = 0; i < lista.Count; i++) {

                if (lista[i] == "Remitente")
                {
                    x = 0;
                    var dataTable = GuiaRemitenteH(idguia, tipo);
                     rpt.Add(generarTextTxtAsync(x,path,dataTable));
                }
                else {
                    x = 1;
                    var dataTable = GuiaTransportistaH(idguia, tipo);
                    rpt.Add(generarTextTxtAsync(x, path, dataTable));
                }
            }
            for (int i=0;i<rpt.Count;i++) {
                var res = "";
                res = await rpt[i];
                if (res != "ok")
                {
                    return res;
                }
            }
            return "ok";

        }



        public async Task<string> generarTextTxtAsync(int x,string path,DataTable dataTable)
        //public  Task<string> generarTextTxtAsync(long idguia,string tipo, string path)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    //int x = 0;
                    //var dataTable = GuiaRemitenteH(idguia, tipo);
                    DataTable cabecera = new DataTable();
                    DataTable empresa = new DataTable();
                    DataTable detalle = new DataTable();
                    empresa = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["EMPRESA"].ToString(), (typeof(DataTable)));
                    cabecera = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
                    detalle = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["DETALLE"].ToString(), (typeof(DataTable)));

                    var factura = new FacturaUBL();
                    var Guia = new GuiaRemitenteH();
                    string nombrearchivo = factura.GenerarNombreTxt(empresa.Rows[0]["ruc"].ToString().Trim(), cabecera.Rows[0]["tipo_documento"].ToString().Trim(), cabecera.Rows[0]["serie"].ToString().Trim(), cabecera.Rows[0]["correlativo"].ToString().Trim(), "txt");
                    if (nombrearchivo is "x")
                        return "Error al generar= nombre de txt";

                    Guia.DatosTransportista = new DTransportista
                    {
                        tipo_documento =cabecera.Rows[0]["documento_emisor"].ToString().Trim(),
                        numero_documento = cabecera.Rows[0]["ruc_emisor"].ToString().Trim(),
                        descripcion = cabecera.Rows[0]["nombre_emisor"].ToString().Trim(),
                    };
                    Guia.DatosDestinatario = new DDestinatario
                    {
                        tipo_documento = Convert.ToInt32(cabecera.Rows[0]["documento_destinatario"].ToString().Trim()),
                        numero_documento = cabecera.Rows[0]["ruc_destinatario"].ToString().Trim(),
                        descripcion = cabecera.Rows[0]["nombre_destinatario"].ToString().Trim(),
                    };
                    Guia.DatosGuiaRemision = new DGuiaRemision
                    {
                        tipo_documento = cabecera.Rows[0]["tipo_documento"].ToString().Trim(),
                        serie = cabecera.Rows[0]["serie"].ToString().Trim(),
                        numdocumento = cabecera.Rows[0]["correlativo"].ToString().Trim(),
                        fecha_emision = cabecera.Rows[0]["fecha_emision"].ToString().Trim(),
                        observaciones = cabecera.Rows[0]["observacion"].ToString().Trim(),
                    };
                    Guia.GuiaRemisionBaja = new GuiaRemisionBaja
                    {
                        tipo_documento = cabecera.Rows[0]["codigo_documento_baja"].ToString().Trim(),
                        serie_numdoc = cabecera.Rows[0]["serie_correlativo_baja"].ToString().Trim(),
                        descripcion_documento = cabecera.Rows[0]["tipo_documento_baja"].ToString().Trim(),
                    };
                    Guia.DocumentoRelacionado = new DRelacionado
                    {
                        tipo_documento = cabecera.Rows[0]["codigo_documento_relacionado"].ToString().Trim(),
                        serie_numdocumento = cabecera.Rows[0]["numero_documento_relacionado"].ToString().Trim(),
                    };
                    Guia.DatosProveedor = new DProveedor
                    {
                        tipo_documento = "",
                        numero_documento = "",
                        descripcion = "",
                    };
                    if (x == 0)
                    {
                        Guia.DatosEnvio = new DEnvio
                        {
                            tipo_traslado = cabecera.Rows[0]["motivo_traslado"].ToString().Trim(),
                            motivo_traslado = cabecera.Rows[0]["descripcion_traslado"].ToString().Trim(),
                            transbordo = "false",
                            peso_total = String.Format("{0:0.000}", cabecera.Rows[0]["peso_bruto"]),
                            medida = cabecera.Rows[0]["UND"].ToString().Trim(),
                            pallets = "",
                            traslado = cabecera.Rows[0]["modalidad_traslado"].ToString().Trim(),
                            fecha_traslado = cabecera.Rows[0]["fecha_traslado"].ToString().Trim(),
                        };
                    }
                    else
                    {
                        Guia.DatosEnvio = new DEnvio
                        {
                            tipo_traslado = "",
                            motivo_traslado = "",
                            transbordo = "",
                            peso_total = String.Format("{0:0.000}", cabecera.Rows[0]["peso_bruto"]),
                            medida = cabecera.Rows[0]["UND"].ToString().Trim(),
                            pallets = "",
                            traslado = "",
                            fecha_traslado = cabecera.Rows[0]["fecha_traslado"].ToString().Trim(),
                        };
                    }
                    Guia.DatosRemitente = new DRemitente
                    {
                        tipo_documento = cabecera.Rows[0]["documento_remitente"].ToString().Trim(),
                        numero_documento = cabecera.Rows[0]["ruc_remitente"].ToString().Trim(),
                        descripcion = cabecera.Rows[0]["nombre_remitente"].ToString().Trim(),
                    };
                    Guia.placa = cabecera.Rows[0]["placa"].ToString().Trim();

                    Guia.tipo_documento_conductor = cabecera.Rows[0]["tipo_documento_conductor"].ToString().Trim();
                    Guia.numero_documento_conductor = cabecera.Rows[0]["numdocumento_conductor"].ToString().Trim();

                    Guia.ubigeo_llegada = cabecera.Rows[0]["ubigeo_llegada"].ToString().Trim();
                    Guia.direccion_llegada = cabecera.Rows[0]["llegada_direccion"].ToString().Trim();

                    Guia.contenedor = cabecera.Rows[0]["contenedor"].ToString().Trim();

                    Guia.ubigeo_partida = cabecera.Rows[0]["punto_de_partida_ubigeo"].ToString().Trim();
                    Guia.direccion_partida = cabecera.Rows[0]["punto_de_partida_direccion"].ToString().Trim();

                    Guia.puerto = "";

                    Guia.email = cabecera.Rows[0]["correo_cliente"].ToString().Trim();

                    Guia.hora = cabecera.Rows[0]["hora"].ToString().Trim();

                    Guia.tipo_documento_relacionado = cabecera.Rows[0]["tipo_documento_relacionado"].ToString().Trim();

                    Guia.MTC = cabecera.Rows[0]["MTC"].ToString().Trim();

                    Guia.tipo_documento_relacionado = cabecera.Rows[0]["tipo_documento_emisor_relacionado"].ToString().Trim();
                    Guia.numero_documento_relacionado = cabecera.Rows[0]["numero_documento_emisor_relacionado"].ToString().Trim();

                    Guia.DatosConductor = new DConductor
                    {
                        nombres = cabecera.Rows[0]["nombre_conductor"].ToString().Trim(),
                        apellidos = cabecera.Rows[0]["apellidos"].ToString().Trim(),
                        licencia = cabecera.Rows[0]["licencia"].ToString().Trim(),
                    };

                    Guia.Tarjeta_Circulacion = cabecera.Rows[0]["tarjeta_ciruclacion"].ToString().Trim();
                    if (x == 0)
                    {
                        Guia.ruc_asociado_partida = cabecera.Rows[0]["ruc_partida"].ToString().Trim(); ;
                        Guia.codigo_establecimiento_partida = cabecera.Rows[0]["codigo_partida"].ToString().Trim(); ;
                        Guia.ruc_asociado_llegada = cabecera.Rows[0]["ruc_llegada"].ToString().Trim(); ;
                        Guia.codigo_establecimiento_llegada = cabecera.Rows[0]["codigo_llegada"].ToString().Trim(); ;
                    }
                    else
                    {
                        Guia.ruc_asociado_partida = "";
                        Guia.codigo_establecimiento_partida = "";
                        Guia.ruc_asociado_llegada = "";
                        Guia.codigo_establecimiento_llegada = "";
                    }

                    Guia.detalleGuia = new List<DetalleGuia>();
                    DetalleGuia objdetalle;
                    for (int i = 0; i < detalle.Rows.Count; i++)
                    {
                        objdetalle = new DetalleGuia();
                        objdetalle.orden = (i + 1);
                        objdetalle.cantidad = String.Format("{0:0.00}", detalle.Rows[i]["cantidad"]);
                        objdetalle.medida = detalle.Rows[i]["unidad_de_medida"].ToString().Trim();
                        objdetalle.descripcion = detalle.Rows[i]["descripcion"].ToString().Trim();
                        objdetalle.codigo = detalle.Rows[i]["codigo"].ToString().Trim();
                        Guia.detalleGuia.Add(objdetalle);
                    }

                    string cabeceratxt = "G|";
                    string cuerpotxt = "";
                    string txtcompleto = "";

                    cabeceratxt += Guia.DatosTransportista.tipo_documento + "|";
                    cabeceratxt += Guia.DatosTransportista.numero_documento + "|";
                    cabeceratxt += Guia.DatosTransportista.descripcion + "|";

                    cabeceratxt += Guia.DatosDestinatario.tipo_documento + "|";
                    cabeceratxt += Guia.DatosDestinatario.numero_documento + "|";
                    cabeceratxt += Guia.DatosDestinatario.descripcion + "|";

                    cabeceratxt += Guia.DatosGuiaRemision.tipo_documento + "|";
                    cabeceratxt += Guia.DatosGuiaRemision.serie + "|";
                    cabeceratxt += Guia.DatosGuiaRemision.numdocumento + "|";
                    cabeceratxt += Guia.DatosGuiaRemision.fecha_emision + "|";
                    cabeceratxt += Guia.DatosGuiaRemision.observaciones + "|";

                    cabeceratxt += Guia.GuiaRemisionBaja.tipo_documento + "|";
                    cabeceratxt += Guia.GuiaRemisionBaja.serie_numdoc + "|";
                    cabeceratxt += Guia.GuiaRemisionBaja.descripcion_documento + "|";

                    cabeceratxt += Guia.DocumentoRelacionado.tipo_documento + "|";
                    cabeceratxt += Guia.DocumentoRelacionado.serie_numdocumento + "|";

                    cabeceratxt += Guia.DatosProveedor.tipo_documento + "|";
                    cabeceratxt += Guia.DatosProveedor.numero_documento + "|";
                    cabeceratxt += Guia.DatosProveedor.descripcion + "|";

                    cabeceratxt += Guia.DatosEnvio.tipo_traslado + "|";
                    cabeceratxt += Guia.DatosEnvio.motivo_traslado + "|";
                    cabeceratxt += Guia.DatosEnvio.transbordo + "|";
                    cabeceratxt += Guia.DatosEnvio.peso_total + "|";
                    cabeceratxt += Guia.DatosEnvio.medida + "|";
                    cabeceratxt += Guia.DatosEnvio.pallets + "|";
                    cabeceratxt += Guia.DatosEnvio.traslado + "|";
                    cabeceratxt += Guia.DatosEnvio.fecha_traslado + "|";

                    cabeceratxt += Guia.DatosRemitente.tipo_documento + "|";
                    cabeceratxt += Guia.DatosRemitente.numero_documento + "|";
                    cabeceratxt += Guia.DatosRemitente.descripcion + "|";

                    cabeceratxt += Guia.placa + "|";

                    cabeceratxt += Guia.tipo_documento_conductor + "|";
                    cabeceratxt += Guia.numero_documento_conductor + "|";
                    cabeceratxt += Guia.ubigeo_llegada + "|";
                    cabeceratxt += Guia.direccion_llegada + "|";
                    cabeceratxt += Guia.contenedor + "|";
                    cabeceratxt += Guia.ubigeo_partida + "|";
                    cabeceratxt += Guia.direccion_partida + "|";
                    cabeceratxt += Guia.puerto + "|";
                    cabeceratxt += Guia.email + "|";
                    cabeceratxt += Guia.hora + "|";
                    cabeceratxt += Guia.documento_relacionado + "|";
                    cabeceratxt += Guia.MTC + "|";
                    cabeceratxt += Guia.tipo_documento_relacionado + "|";
                    cabeceratxt += Guia.numero_documento_relacionado + "|";

                    cabeceratxt += Guia.DatosConductor.nombres + "|";
                    cabeceratxt += Guia.DatosConductor.apellidos + "|";
                    cabeceratxt += Guia.DatosConductor.licencia + "|";

                    cabeceratxt += Guia.Tarjeta_Circulacion + "|";
                    cabeceratxt += Guia.ruc_asociado_partida + "|";
                    cabeceratxt += Guia.codigo_establecimiento_partida + "|";
                    cabeceratxt += Guia.ruc_asociado_llegada + "|";
                    cabeceratxt += Guia.codigo_establecimiento_llegada + "|\n";

                    for (int i = 0; i < Guia.detalleGuia.Count; i++)
                    {
                        cuerpotxt += "I|" + (i + 1) + "|";
                        cuerpotxt +=Guia.detalleGuia[i].cantidad + "|";
                        cuerpotxt += Guia.detalleGuia[i].medida + "|";
                        cuerpotxt += Guia.detalleGuia[i].descripcion + "|";
                        cuerpotxt += Guia.detalleGuia[i].codigo + "|\n";
                    }
                    txtcompleto = cabeceratxt + cuerpotxt;


                    return Writetxt.creartxtAsync(path, txtcompleto, nombrearchivo);

                }
                catch (Exception e)
                {
                    return e.Message;
                }
            });
            return tarea;
        }

    

        public DataTable ListarTipoGuiaDt()
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_Listar_Tipo_Guia", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA TIPO GUIA";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        //Cargar Ventas desde txt's de Horizont
        public string InsertarVentasTxt(CabeceraTxt oCabecera)
        {
            string result = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_InsertarTodoVentas", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@serie", oCabecera.serie);
                cmm.Parameters.AddWithValue("@numdocumento", oCabecera.numdocumento);
                cmm.Parameters.AddWithValue("@fecha", Convert.ToDateTime(oCabecera.fecha));
                cmm.Parameters.AddWithValue("@empresa", oCabecera.idempresa);
                cmm.Parameters.AddWithValue("@tipodocumento", oCabecera.tipoDocumento);
                cmm.Parameters.AddWithValue("@cliente", oCabecera.idcliente);
                cmm.Parameters.AddWithValue("@nombrecliente", oCabecera.nombrecliente);
                cmm.Parameters.AddWithValue("@total", oCabecera.total);
                cmm.Parameters.AddWithValue("@textomoneda", oCabecera.textomoneda);
                cmm.Parameters.AddWithValue("@jsondetalle", oCabecera.jsonDetalle);
                cmm.Parameters.AddWithValue("@cantidadDetalle", oCabecera.cantidadDetalle);
                int a = cmm.ExecuteNonQuery();
                cnn.Close();
                if (a > 0)
                {
                    result = "ok";
                }
                else
                {
                    result = oCabecera.serie + oCabecera.numdocumento;
                }
                return result;
            }
            catch (Exception e)
            {
                return result = oCabecera.serie + oCabecera.numdocumento;
            }
        }

        //CAMBIOS YEX PARA EL LISTAR SUCURSAL ORDENADO 
        public DataTable listarSucursalesconCheckBoxs(int id)
        {
            


            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_LISTARSUCURSALxALMACEN", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IdEmpresa", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SUCURSAL";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }







        public async Task<object[][]> HistorialVentasArrayAsync(int rango, string sucursales, int tipo, string almacenes, string laboratorio)
        {
            var resultList = new List<object[]>();

            int cantidaventa = rango+1;
            try
            {


                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("[Almacen].SP_CalcularVentasAnterioresv4", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@MAX_RANGO", rango);
                        cmm.Parameters.AddWithValue("@sucursales", sucursales);
                        cmm.Parameters.AddWithValue("@catidadmeses", cantidaventa);
                        cmm.Parameters.AddWithValue("@almacenes", almacenes);
                        cmm.Parameters.AddWithValue("@laboratorio", laboratorio);
                        //cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                        //cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                        //cmm.Parameters.AddWithValue("@SUCURSAL", int.Parse(sucursal));
                        cmm.CommandTimeout = 0;

                        await cnn.OpenAsync();

                        using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var rowData = new object[reader.FieldCount];
                                reader.GetValues(rowData);
                                resultList.Add(rowData);
                            }
                        }
                    }
                }
            }
            catch (Exception vex)
            {
                // Considera registrar el error vex para diagnóstico.
                throw vex;
            }

            return resultList.ToArray();
        }



        //cambio para listar el modal filtrado por almacenes yex
        public async Task<object[][]> Listar_Laboratorio_Array(string sucursales, string almacenes, string laboratorio)
        {
            var resultList = new List<object[]>();


            try
            {


                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("Almacen.sp_listar_laboratorio_almacenes", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@sucursales", string.IsNullOrEmpty(sucursales) ? "" : sucursales);
                        cmm.Parameters.AddWithValue("@laboratorio", string.IsNullOrEmpty(laboratorio) ? "" : laboratorio);
                        cmm.Parameters.AddWithValue("@almacenes", string.IsNullOrEmpty(almacenes) ? "" : almacenes);

                        cmm.CommandTimeout = 0;

                        await cnn.OpenAsync();

                        using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var rowData = new object[reader.FieldCount];
                                reader.GetValues(rowData);
                                resultList.Add(rowData);
                            }
                        }
                    }
                }
            }
            catch (Exception vex)
            {
                // Considera registrar el error vex para diagnóstico.
                throw vex;
            }

            return resultList.ToArray();
        }

        //CAMBIO PARA EL LISTADO DE GUIA SIN FACTURACION
        public async Task<mensajeJson> ListarGuiaSalidaxaSinfacturar(string fechainicio, string fechafin, int idempresa)
        {
            try
            {
                var data = ListarGuiaSalidaxempresaSinfacturar( fechainicio,  fechafin,  idempresa);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }


        public async Task<mensajeJson> ListarDetalleGuiaSalidaxaSinfacturar( string idguias)
        {
            try
            {
                var data = ListarGuiaDetalleSalidaxempresaSinfacturar(idguias);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> ObtenerSerieGuiaxSucursal(int idsucursal)
        {
            try
            {
                var data = sp_ObtenerSerieGuiaxSucursal(idsucursal);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }


        //fin
        public DataTable ListarGuiaSalidaxempresaSinfacturar(string fechainicio, string fechafin, int idempresa)
        {
            if (idempresa == null) idempresa = 0;
            if (fechainicio == null) fechainicio = "01-01-2000";
            if (fechafin == null) fechafin = "";

         

            DateTime fechaFin;
            if (string.IsNullOrEmpty(fechafin) || !DateTime.TryParse(fechafin, out fechaFin))
            {
                fechaFin = DateTime.Now;
            }

            // Obtener las fechas como cadenas en el formato "dd/MM/yyyy"
      
            string fechaFinString = fechaFin.ToString("dd/MM/yyyy");

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Almacen.SP_GETGUIAS_AUDITORIA", cnn);
                cmm = new SqlCommand("Almacen.Listar_Distribucion_Sin_Facturar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaFinString);
                cmm.Parameters.AddWithValue("@EMPRESA", idempresa);      
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public DataTable ListarGuiaDetalleSalidaxempresaSinfacturar( string idguias)
        {   
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Almacen.SP_GETGUIAS_AUDITORIA", cnn);
                cmm = new SqlCommand("Almacen.Listar_detalleguia_Distribucion_Sin_Facturar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
           
                cmm.Parameters.AddWithValue("@IDGUIAS", idguias);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable sp_ObtenerSerieGuiaxSucursal(int idsucursal)
        {   
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_ObtenerSerieGuiaxSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "SERIES GUIAS";
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