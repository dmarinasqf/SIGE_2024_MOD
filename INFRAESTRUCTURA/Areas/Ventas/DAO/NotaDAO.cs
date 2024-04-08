using ENTIDADES.facturacionHorizont;
using ENTIDADES.facturacionHorizont.Utils;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.DAO
{
    public class NotaDAO {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public NotaDAO(string cadena) {
            this.cadena = cadena;
        }
        public DataTable GetNotaCompleta(long idnota) {
            try {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Ventas.SP_GET_NOTACD_COMPLETA", cnn);
                cmm = new SqlCommand("Ventas.SP_GET_NOTACD_COMPLETA_V2", cnn);//EARTCOD1009
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDNOTA", idnota);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "NOTACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception) {
                return new DataTable();
            }
        }
        public DataTable GetNotaCompletaN(long idnota) {
            try {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_GET_NOTACD_COMPLETA_NUBEFACT", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDNOTA", idnota);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "NOTACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception) {
                return new DataTable();
            }
        }
        public async Task<DataTable> HistorialNotasAsync(string fechainicio, string fechafin, string sucursal, string docnota, string docventa, string cliente, int top) {
            var tarea = await Task.Run(() => {
                try {
                    if (top is 0) top = 10;
                    if (fechafin is null) fechafin = "";
                    if (fechainicio is null) fechainicio = "";
                    if (sucursal is null) sucursal = "";
                    if (docnota is null) docnota = "";
                    if (docventa is null) docventa = "";
                    if (cliente is null) cliente = "";

                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.SP_HISTORIAL_NOTASCD", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                    cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                    cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                    cmm.Parameters.AddWithValue("@DOCNOTA", docnota);
                    cmm.Parameters.AddWithValue("@DOCVENTA", docventa);
                    cmm.Parameters.AddWithValue("@doccliente", cliente);
                    cmm.Parameters.AddWithValue("@TOP", top);
                    DataTable tabla = new DataTable();
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "HISTORIAL NOTASCD";
                    cnn.Close();

                    return tabla;
                }
                catch (Exception) {
                    return new DataTable();
                }
            });
            return tarea;
        }
        public async Task<mensajeJson> GenerarExcelNotasAsync(string fechainicio, string fechafin, string sucursal, string docnota, string docventa, string cliente, int top, string path) {
            try {
                var data = await Task.Run(async () => {
                    var DATA = await HistorialNotasAsync(fechainicio, fechafin, sucursal, docnota, docventa, cliente, top);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportenotas" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/notas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<string> generarTextTxtAsync(long idnota, string path)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    var dataTable = GetNotaCompleta(idnota);
                    DataTable cabecera = new DataTable();
                    DataTable empresa = new DataTable();
                    DataTable detalle = new DataTable();
                    DataTable pago = new DataTable();

                    empresa = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["EMPRESA"].ToString(), (typeof(DataTable)));
                    cabecera = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
                    detalle = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["DETALLE"].ToString(), (typeof(DataTable)));
                    pago = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["PAGO"].ToString(), (typeof(DataTable)));

                    var nota = new NotaUBL();
                    string nombrearchivo = nota.GenerarNombreTxt(empresa.Rows[0]["ruc"].ToString().Trim(), cabecera.Rows[0]["doctribcodsunatnota"].ToString().Trim(), cabecera.Rows[0]["serienota"].ToString().Trim(), cabecera.Rows[0]["numdocnota"].ToString().Trim(), "txt");
                    if (nombrearchivo is "x")
                        return "Error al generar nombre de txt";

                    nota.DatosComprobante = new DatosComprobante
                    {
                        codigo = cabecera.Rows[0]["doctribcodsunatnota"].ToString().Trim(),
                        serie = cabecera.Rows[0]["serienota"].ToString().Trim(),
                        numerodoc = cabecera.Rows[0]["numdocnota"].ToString().Trim(),
                        fechaemision = cabecera.Rows[0]["fechasunatnota"].ToString().Trim(),
                        horaemision = "",
                        codigomoneda = pago.Rows[0]["monedacodigosunat"].ToString(),
                        fechavencimiento = "",
                    };
                    nota.DatosEmisor = new DatosEmisor
                    {
                        tipodocumento = empresa.Rows[0]["codigosunatdocumento"].ToString().Trim(),
                        numruc = empresa.Rows[0]["ruc"].ToString().Trim(),
                        nombres_razonsocial = empresa.Rows[0]["descripcion"].ToString().Trim(),
                        nombre_comerciar_corto = empresa.Rows[0]["nombrecomercial"].ToString().Trim(),
                        direccion = empresa.Rows[0]["direccion"].ToString().Trim(),
                        codigoubigeo = empresa.Rows[0]["codigoubigeo"].ToString().Trim(),
                        departamento = empresa.Rows[0]["departamento"].ToString().Trim(),
                        provincia = empresa.Rows[0]["provincia"].ToString().Trim(),
                        urbanizacion = "",
                        distrito = empresa.Rows[0]["distrito"].ToString().Trim(),
                        codigopais = empresa.Rows[0]["codigopais"].ToString().Trim(),
                        codigoestablecimiento = cabecera.Rows[0]["codigoestablecimiento"].ToString().Trim(),
                        correo_contacto = empresa.Rows[0]["email"].ToString().Trim(),
                        telefono_contacto = empresa.Rows[0]["telefono"].ToString().Trim(),
                        website_contacto = empresa.Rows[0]["paginaweb"].ToString().Trim()
                    };
                    nota.LugarEngrega_VentaItinerante = new LugarEngrega_VentaItinerante();
                    nota.DatosAdquiriente = new DatosAdquiriente
                    {
                        tipodocumento = cabecera.Rows[0]["tipodocclientesunat"].ToString().Trim(),
                        numdocumento = cabecera.Rows[0]["numdoccliente"].ToString().Trim(),
                        nombres_razonsocial = cabecera.Rows[0]["nombrecliente"].ToString().Trim(),
                        direccion = "",
                        codigoubigeo = "",
                        departamento = "",
                        provincia = "",
                        urbanizacion = "",
                        distrito = "",
                        codigopais = "",
                        codigoestablecimiento = "",
                        correo_contacto = "",
                        telefono_contacto = "",
                        website_contacto = ""
                    };
                    nota.DatosComprador = new DatosComprador();

                    nota.InformacionAdicional = new InformacionAdicional
                    {
                        numordencompra = "",
                        tipooperacion = ""
                    };
                    nota.TipoCambio = new TipoCambio();
                    nota.Detracciones = new Detracciones();
                    nota.MigracionDocumentosAutorizados = new MigracionDocumentosAutorizados();
                    nota.DatosDocumentoModifica = new DatosDocumentoModifica
                    {
                        tipodocumento = cabecera.Rows[0]["doctribcodsunatventa"].ToString(),
                        serie_numdocumento = cabecera.Rows[0]["serieventa"].ToString() + "-" + cabecera.Rows[0]["numdocventa"].ToString(),
                        codigomotivo_documentoreferencia = cabecera.Rows[0]["tipodoccodsunat"].ToString(),
                        descripcion_motivo_sustento = cabecera.Rows[0]["motivodevolucion"].ToString(),
                        fechaemision_documentomodifica = cabecera.Rows[0]["fechasunatventa"].ToString(),
                    };
                    nota.IncoteRMS = new IncoteRMS();
                    nota.ImpuestoICBPER = new ImpuestoICBPER();
                    nota.DetalleFactura = new List<DetalleFactura>();
                    DetalleFactura detalleobj;
                    var bonificaciones = new List<DetalleFactura>();
                    for (int i = 0; i < detalle.Rows.Count; i++)
                    {
                        detalleobj = new DetalleFactura();
                        detalleobj.numitem = (i + 1);
                        detalleobj.codigounidadmedida = detalle.Rows[i]["unidadmedidasunat"].ToString();
                        detalleobj.tipotributo = detalle.Rows[i]["tipoimpuesto"].ToString();
                        detalleobj.cantidad = int.Parse(detalle.Rows[i]["cantidad"].ToString());
                        detalleobj.descripcion_producto_servicio = detalle.Rows[i]["producto"].ToString();
                        detalleobj.codigoproducto = detalle.Rows[i]["codigoproducto"].ToString();
                        detalleobj.preciounitario = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["precio"].ToString()));//sinigv
                        detalleobj.precioventaunitarioigv = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["precioigv"].ToString()));//conigv
                        var total = (detalleobj.cantidad) * (detalleobj.precioventaunitarioigv);
                        var subtotal = (detalleobj.cantidad) * (detalleobj.preciounitario);
                        detalleobj.total = total;
                        detalleobj.subtotal = subtotal;
                        detalleobj.montototal_impuestos_item = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["montoigv"].ToString()));
                        detalleobj.tasaIGV_IVAP = detalle.Rows[i]["tasaigv"].ToString();
                        detalleobj.montoIGV_IVAP = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["montoigv"].ToString()));
                        detalleobj.codafectacionigv = (detalle.Rows[i]["codafectacionigvsunat"].ToString());
                        detalleobj.valor_venta_item = detalleobj.subtotal;
                        detalleobj.montobase = detalleobj.subtotal;
                        detalleobj.tipo = (detalle.Rows[i]["tipoitem"].ToString());
                        if (detalleobj.tipo.ToLower() == "bonificacion")
                            bonificaciones.Add(detalleobj);
                        if (decimal.Parse(detalle.Rows[i]["precioigv"].ToString()) > 0.01m && detalleobj.tipo.ToLower() != "bonificacion")
                            nota.DetalleFactura.Add(detalleobj);
                    }
                    //verificar bonificaciones
                    var nuevalista = new List<DetalleFactura>();
                    if (bonificaciones.Count > 0)
                    {
                        foreach (var item in nota.DetalleFactura.ToList())
                        {
                            var boni = bonificaciones.Where(x => x.codigoproducto == item.codigoproducto).ToList();
                            if (boni.Count > 0)
                            {
                                var cantboni = boni.Sum(x => x.cantidad);
                                var montoaux = item.cantidad * item.precioventaunitarioigv;
                                cantboni += item.cantidad;
                                var precioigv = montoaux / cantboni;
                                var precio = precioigv / 1.18m;
                                item.precioventaunitarioigv = decimal.Parse(precioigv.ToString("0.00"));
                                item.preciounitario = decimal.Parse(precio.ToString("0.00"));
                                item.cantidad = cantboni;
                            }
                            nuevalista.Add(item);
                        }
                        nota.DetalleFactura = nuevalista;
                    }
                    NumToLetter monedatext = new NumToLetter();
                    //var montomoneda = monedatext.NumeroALetras(nota.DetalleFactura.Sum(x => x.total), nota.DatosComprobante.codigomoneda);
                    var montomoneda = monedatext.NumeroALetras(Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()), nota.DatosComprobante.codigomoneda);//EARTCOD1009
                    nota.leyenda = new Leyenda
                    {
                        codigo = "1000",
                        descripcion = montomoneda
                    };

                    nota.TotalImpuestos = new TotalImpuestos
                    {

                        //EARTCOD1009
                        total_impuesto = (nota.DetalleFactura.Sum(x => x.montoIGV_IVAP) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString()) * 0.18m).ToString("0.00"),
                        total_gravadas_igv = (nota.DetalleFactura.Where(x => x.tipotributo == "IGV").Sum(x => x.subtotal) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString())).ToString("0.00"),
                        tributos_gravadas_igv = (nota.DetalleFactura.Sum(x => x.montoIGV_IVAP) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString()) * 0.18m).ToString("0.00"),
                        //-EARTCOD1009

                        //total_impuesto = nota.DetalleFactura.Sum(x => x.montoIGV_IVAP).ToString("0.00"),
                        //total_gravadas_igv = nota.DetalleFactura.Where(x => x.tipotributo == "IGV").Sum(x => x.subtotal).ToString("0.00"),
                        //tributos_gravadas_igv = nota.DetalleFactura.Sum(x => x.montoIGV_IVAP).ToString("0.00"),

                        total_exportacion = 0.00m,
                        tributos_operaciones_exportaciones = 0.00m,
                        total_inafectada = nota.DetalleFactura.Where(x => x.tipotributo == "INA").Sum(x => x.subtotal).ToString("0.00"),
                        tributos_operaciones_inafectadas = 0.00m,
                        total_exonerada = nota.DetalleFactura.Where(x => x.tipotributo == "EXO").Sum(x => x.subtotal).ToString("0.00"),
                        tributos_operaciones_exoneradas = 0.00m,
                        total_operaciones_gratuitas = 0.00m,
                        tributos_operaciones_gratuitas = 0.00m,
                        total_gravadas_IVAP = 0.00m,
                        tributos_gravadas_IVAP = 0.00m,
                        total_ISC = 0.00m,
                        tributos_ISC = 0.00m,
                        total_otros_tributos = 0.00m,
                        tributos_otros_tributos = 0.00m
                    };
                    nota.Total = new Total
                    {
                        //EARTCOD1009
                        importe_total = Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()).ToString("0.00"),
                        total_valor_venta = (nota.DetalleFactura.Sum(x => x.subtotal) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString())).ToString("0.00"),
                        total_precio_venta = Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()).ToString("0.00"),
                        //-EARTCOD1009

                        total_descuentos = 0.00m,
                        total_otros_cargos = 0.00m,
                        //importe_total = nota.DetalleFactura.Sum(x => x.total).ToString("0.00"),
                        //total_valor_venta = nota.DetalleFactura.Sum(x => x.subtotal).ToString("0.00"),
                        //total_precio_venta = nota.DetalleFactura.Sum(x => x.total).ToString("0.00"),
                        monto_redondeo_importetotal = 0.00m,
                        total_anticipos = 0.00m
                    };

                    string versiontxt = "V|2.1|2.0||\n";
                    string cabeceratxt = "G|";
                    string cuerpotxt = "";
                    string leyenda = "L|";

                    //Luis Pairazaman 25/11
                    string leyenda2 = "";
                    string valor = "";
                    //nuevo cambio para amazonia
                    if (nota.DatosEmisor.numruc == "20393499908")
                    {
                        nota.TotalImpuestos.total_inafectada = "";  //49
                        nota.TotalImpuestos.tributos_operaciones_exoneradas = 0; //52 0.00
                        nota.TotalImpuestos.total_gravadas_igv = "0.00";  //55 0.00
                        leyenda2 = "L|2001|BIENES TRANSFERIDOS EN LA AMAZONIA REGION SELVA PARA SER CONSUMIDOS EN LA MISMA.|";
                    };
                    // Fin LUIS

                    cabeceratxt += nota.DatosComprobante.codigo + "|";
                    cabeceratxt += nota.DatosComprobante.serie + "|";
                    cabeceratxt += nota.DatosComprobante.numerodoc + "|";
                    cabeceratxt += nota.DatosComprobante.fechaemision + "|";
                    cabeceratxt += nota.DatosComprobante.horaemision + "|";
                    cabeceratxt += nota.DatosComprobante.codigomoneda + "|";
                    cabeceratxt += "|";

                    cabeceratxt += nota.DatosEmisor.tipodocumento + "|";
                    cabeceratxt += nota.DatosEmisor.numruc + "|";
                    cabeceratxt += nota.DatosEmisor.nombres_razonsocial + "|";
                    cabeceratxt += nota.DatosEmisor.nombre_comerciar_corto + "|";
                    cabeceratxt += nota.DatosEmisor.direccion + "|";
                    cabeceratxt += nota.DatosEmisor.codigoubigeo + "|";
                    cabeceratxt += nota.DatosEmisor.departamento + "|";
                    cabeceratxt += nota.DatosEmisor.provincia + "|";
                    cabeceratxt += nota.DatosEmisor.urbanizacion + "|";
                    cabeceratxt += nota.DatosEmisor.distrito + "|";
                    cabeceratxt += nota.DatosEmisor.codigopais + "|";
                    cabeceratxt += nota.DatosEmisor.codigoestablecimiento + "|";
                    cabeceratxt += nota.DatosEmisor.correo_contacto + "|";
                    cabeceratxt += nota.DatosEmisor.telefono_contacto + "|";
                    cabeceratxt += nota.DatosEmisor.website_contacto + "|";
                    //venta itinerante
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.direccion + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.codigoubigeo + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.departamento + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.provincia + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.urbanizacion + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.distrito + "|";
                    cabeceratxt += nota.LugarEngrega_VentaItinerante.codigopais + "|";

                    //-------
                    cabeceratxt += nota.DatosAdquiriente.tipodocumento + "|";
                    cabeceratxt += nota.DatosAdquiriente.numdocumento + "|";
                    cabeceratxt += nota.DatosAdquiriente.nombres_razonsocial + "|";
                    cabeceratxt += nota.DatosAdquiriente.direccion + "|";
                    cabeceratxt += nota.DatosAdquiriente.codigoubigeo + "|";
                    cabeceratxt += nota.DatosAdquiriente.departamento + "|";
                    cabeceratxt += nota.DatosAdquiriente.provincia + "|";
                    cabeceratxt += nota.DatosAdquiriente.urbanizacion + "|";
                    cabeceratxt += nota.DatosAdquiriente.distrito + "|";
                    cabeceratxt += nota.DatosAdquiriente.codigopais + "|";
                    cabeceratxt += nota.DatosAdquiriente.codigoestablecimiento + "|";
                    cabeceratxt += nota.DatosAdquiriente.correo_contacto + "|";
                    cabeceratxt += nota.DatosAdquiriente.telefono_contacto + "|";
                    cabeceratxt += nota.DatosAdquiriente.website_contacto + "|";
                    //-----------
                    //nota.DatosComprador.tipodocumento
                    cabeceratxt += "|";
                    // nota.DatosComprador.numdocumento +
                    cabeceratxt += "|";

                    cabeceratxt += nota.TotalImpuestos.total_impuesto + "|";
                    cabeceratxt += (nota.TotalImpuestos.total_exportacion == 0 ? "" : nota.TotalImpuestos.total_exportacion.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_exportaciones == 0 ? "" : nota.TotalImpuestos.tributos_operaciones_exportaciones.ToString()) + "|";
                    cabeceratxt += nota.TotalImpuestos.total_inafectada + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_inafectadas == 0 ? "" : nota.TotalImpuestos.tributos_operaciones_inafectadas.ToString()) + "|";
                    cabeceratxt += nota.TotalImpuestos.total_exonerada + "|";

                    //Luis Pairazaman 25/11
                    if (nota.DatosEmisor.numruc == "20393499908")
                    {
                        cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_exoneradas == 0 ? "0.00" : nota.TotalImpuestos.tributos_operaciones_exoneradas.ToString()) + "|";
                    }
                    else
                    {
                        cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_exoneradas == 0 ? "" : nota.TotalImpuestos.tributos_operaciones_exoneradas.ToString()) + "|";
                        //cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_exoneradas == 0 ? "" : nota.TotalImpuestos.tributos_operaciones_exoneradas.ToString()) + "|";
                    }

                    //Fin Luis
                    cabeceratxt += (nota.TotalImpuestos.total_operaciones_gratuitas == 0 ? "" : nota.TotalImpuestos.total_operaciones_gratuitas.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_operaciones_gratuitas == 0 ? "" : nota.TotalImpuestos.tributos_operaciones_gratuitas.ToString()) + "|";
                    cabeceratxt += nota.TotalImpuestos.total_gravadas_igv + "|";
                    cabeceratxt += nota.TotalImpuestos.tributos_gravadas_igv + "|";
                    cabeceratxt += (nota.TotalImpuestos.total_gravadas_IVAP == 0 ? "" : nota.TotalImpuestos.total_gravadas_IVAP.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_gravadas_IVAP == 0 ? "" : nota.TotalImpuestos.tributos_gravadas_IVAP.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.total_ISC == 0 ? "" : nota.TotalImpuestos.total_ISC.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_ISC == 0 ? "" : nota.TotalImpuestos.tributos_ISC.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.total_otros_tributos == 0 ? "" : nota.TotalImpuestos.total_otros_tributos.ToString()) + "|";
                    cabeceratxt += (nota.TotalImpuestos.tributos_otros_tributos == 0 ? "" : nota.TotalImpuestos.tributos_otros_tributos.ToString()) + "|";

                    //nota.Total.total_descuentos
                    cabeceratxt += "|";
                    cabeceratxt += (nota.Total.total_otros_cargos == 0 ? "" : nota.Total.total_otros_cargos.ToString()) + "|";
                    cabeceratxt += nota.Total.importe_total + "|";
                    //nota.Total.total_valor_venta
                    cabeceratxt += "|";
                    //nota.Total.total_precio_venta
                    cabeceratxt += "|";
                    cabeceratxt += (nota.Total.monto_redondeo_importetotal == 0 ? "" : nota.Total.monto_redondeo_importetotal.ToString()) + "|";
                    //nota.Total.total_anticipos
                    cabeceratxt += "|";

                    // nota.InformacionAdicional.tipooperacion 
                    cabeceratxt += "|";
                    cabeceratxt += nota.InformacionAdicional.numordencompra + "|";

                    cabeceratxt += nota.TipoCambio.moneda_referencia_para_tipocambio + "|";
                    cabeceratxt += nota.TipoCambio.moneda_objetivo_para_tipocambio + "|";
                    cabeceratxt += nota.TipoCambio.factor_aplicado_a_monedaorigen_para_calcular_monedadestino + "|";
                    cabeceratxt += nota.TipoCambio.fecha_tipocambio + "|";

                    //cabeceratxt += nota.Detracciones.codigo_bien_servicio + "|";
                    //cabeceratxt += nota.Detracciones.numcuenta_banconacion_detraccion + "|";
                    //cabeceratxt += nota.Detracciones.mediopago + "|";
                    //cabeceratxt += nota.Detracciones.montodetraccion + "|";
                    //cabeceratxt += nota.Detracciones.porcentajedetraccion + "|";
                    //cabeceratxt += nota.Detracciones.monedadetraccion + "|";
                    //cabeceratxt += nota.Detracciones.condicionpago + "|";
                    //cabeceratxt += nota.MigracionDocumentosAutorizados.tipodocumento_agenteventas + "|";
                    //cabeceratxt += nota.MigracionDocumentosAutorizados.numruc_agenteventas + "|";
                    //cabeceratxt += nota.MigracionDocumentosAutorizados.mediopago + "|";
                    //cabeceratxt += nota.MigracionDocumentosAutorizados.numautorizaciontransaccion + "|";

                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";

                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";
                    cabeceratxt += "|";

                    cabeceratxt += nota.DatosDocumentoModifica.tipodocumento + "|";
                    cabeceratxt += nota.DatosDocumentoModifica.serie_numdocumento + "|";
                    cabeceratxt += nota.DatosDocumentoModifica.codigomotivo_documentoreferencia + "|";
                    cabeceratxt += nota.DatosDocumentoModifica.descripcion_motivo_sustento + "|";
                    cabeceratxt += nota.DatosDocumentoModifica.fechaemision_documentomodifica + "|";

                    //cabeceratxt += nota.IncoteRMS.INCOTERMS + "|";
                    //cabeceratxt += nota.IncoteRMS.descrion_puertollegada + "|";
                    //cabeceratxt += nota.ImpuestoICBPER.totalICBPER + "|\n";

                    cabeceratxt += "|";
                    cabeceratxt += "|";


                    cabeceratxt += nota.ImpuestoICBPER.totalICBPER + "|\n";

                    //cambio por motivo de ley de sunat 28-08
                    //nuevo por cambio de sunat 28-08-2021
                    //string mensajepago = "";
                    //string vnombpago;
                    //string nmontpago;
                    //string iddocu = cabecera.Rows[0]["iddocumento"].ToString().Trim();
                    //if (iddocu == "1005")  //si es NC de factura solo en ese caso cambia el texto
                    //{
                    //    cabeceratxt += nota.ImpuestoICBPER.totalICBPER + "|";
                    //string vtipopago = pago.Rows[0]["idtipopago"].ToString();

                    //if (vtipopago == "10001")
                    //{
                    //vnombpago = "CREDITO";
                    //nmontpago = nota.Total.importe_total;

                    //DateTime DateObject = Convert.ToDateTime(nota.DatosDocumentoModifica.fechaemision_documentomodifica);
                    //string Nuevafecha = DateObject.AddDays(1).ToString("yyyy-MM-dd");



                    //mensajepago = "F|Cuota001|" + nota.Total.importe_total + "|" + Nuevafecha + "|\n";
                    //}
                    //else
                    //{
                    //vnombpago = "";
                    //nmontpago = "";
                    //    }
                    //fin de cambio
                    //cabeceratxt += vnombpago + "|";
                    //cabeceratxt += nmontpago + "|\n";
                    //}
                    //else
                    //{
                    //cabeceratxt += nota.ImpuestoICBPER.totalICBPER + "|\n";
                    //    mensajepago = "";
                    //}
                    //fin por cambio de sunat 28-08-2021



                    for (int i = 0; i < nota.DetalleFactura.Count; i++)
                    {
                        //PRODUCTO
                        cuerpotxt += "I|" + (i + 1) + "|";
                        cuerpotxt += nota.DetalleFactura[i].codigounidadmedida + "|";
                        cuerpotxt += nota.DetalleFactura[i].cantidad + "|";
                        cuerpotxt += nota.DetalleFactura[i].codigoproducto + "|";
                        cuerpotxt += nota.DetalleFactura[i].codigoproductosunat + "|";
                        cuerpotxt += nota.DetalleFactura[i].codigoproductoGS1 + "|";
                        cuerpotxt += nota.DetalleFactura[i].tipoproductoGTIN + "|";
                        cuerpotxt += nota.DetalleFactura[i].numplacavehiculo + "|";
                        cuerpotxt += nota.DetalleFactura[i].descripcion_producto_servicio + "|";
                        cuerpotxt += nota.DetalleFactura[i].preciounitario.ToString("0.00") + "|";
                        cuerpotxt += nota.DetalleFactura[i].precioventaunitarioigv.ToString("0.00") + "|";
                        cuerpotxt += "|";//factura.DetalleFactura[i].valorreferencialunitario 
                        //IGV IVAP
                        cuerpotxt += nota.DetalleFactura[i].montototal_impuestos_item.ToString("0.00") + "|";
                        cuerpotxt += nota.DetalleFactura[i].montobase.ToString("0.00") + "|";
                        cuerpotxt += nota.DetalleFactura[i].montoIGV_IVAP.ToString("0.00") + "|";
                        cuerpotxt += nota.DetalleFactura[i].tasaIGV_IVAP + "|";
                        cuerpotxt += nota.DetalleFactura[i].codafectacionigv + "|";
                        cuerpotxt += "|";//factura.DetalleFactura[i].indicadorgratuito +
                        //ISC
                        cuerpotxt += "|";//factura.DetalleFactura[i].montobase_ISC +
                        cuerpotxt += "|";//factura.DetalleFactura[i].monto_tributo_linea + 
                        cuerpotxt += "|";//factura.DetalleFactura[i].tasa_tributo +
                        cuerpotxt += "|";//factura.DetalleFactura[i].tipo_sistema_ISV +
                        //OTROS TRIBUTOS
                        cuerpotxt += "|";//factura.DetalleFactura[i].montobase_otrostributos +
                        cuerpotxt += "|";//factura.DetalleFactura[i].monto_tributo_linea_otrostributos +
                        cuerpotxt += "|";//factura.DetalleFactura[i].tasa_tributo_otrotributo + 
                        cuerpotxt += "|";// factura.DetalleFactura[i].tipo_sistema_otrotributo +
                        //CARGO
                        cuerpotxt += nota.DetalleFactura[i].valor_venta_item.ToString("0.00") + "|";
                        cuerpotxt += "|";//factura.DetalleFactura[i].codigo_cargo_item +
                        cuerpotxt += "|";//factura.DetalleFactura[i].factor_cargo_item +
                        cuerpotxt += "|";//factura.DetalleFactura[i].monto_cargo_item + 
                        cuerpotxt += "|";//factura.DetalleFactura[i].monto_base_cargo_item + 


                        //DESCUENTO
                        cuerpotxt += "|";//factura.DetalleFactura[i].codigodescuento +
                        cuerpotxt += "|";// factura.DetalleFactura[i].factor_descuento_item +
                        cuerpotxt += "|";// factura.DetalleFactura[i].monto_descuento_item +
                        cuerpotxt += "|";//factura.DetalleFactura[i].monto_base_descuento_item +
                        //ICBPER
                        cuerpotxt += "|";//factura.DetalleFactura[i].cantidad_bolas_plastico + 
                        cuerpotxt += "|";// factura.DetalleFactura[i].monto_unitario_ICBPER +
                        cuerpotxt += "|\n";//factura.DetalleFactura[i].monto_tributo_linea_ICBPER +
                    }
                    leyenda += nota.leyenda.codigo + "|";
                    leyenda += nota.leyenda.descripcion + "|";

                    //Luis Pairazaman 25/11
                    //string valor = versiontxt + cabeceratxt + cuerpotxt + leyenda;	
                    if (nota.DatosEmisor.numruc == "20393499908")  //cambio por amazonia	
                    {   //cambio por amazonia	
                        valor = versiontxt + cabeceratxt + cuerpotxt + leyenda + "|\n" + leyenda2; //cambio por amazonia	
                    }  //cambio por amazonia
                    else //cambio por amazonia	
                    {    //cambio por amazonia
                        valor = versiontxt + cabeceratxt + cuerpotxt + leyenda;
                    }  //cambio por amazonia	
                    //fin luis pairazaman
                    return Writetxt.creartxtAsync(path, valor, nombrearchivo);

                }
                catch (Exception e)
                {
                    return e.Message;
                }

            });
            return tarea;
        }

        public async Task<string> generarTXTNubefactAsync(long idventa, string path) {

            try {
                var dataTable = GetNotaCompletaN(idventa);
                DataTable cabecera = new DataTable();
                DataTable empresa = new DataTable();
                DataTable detalle = new DataTable();
                DataTable pago = new DataTable();
                NumToLetter monedatext = new NumToLetter();
                string XX = dataTable.Rows[0]["EMPRESA"].ToString();
                empresa = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["EMPRESA"].ToString(), (typeof(DataTable)));
                cabecera = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["CABECERA"].ToString(), (typeof(DataTable)));
                detalle = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["DETALLE"].ToString(), (typeof(DataTable)));
                pago = (DataTable)JsonConvert.DeserializeObject(dataTable.Rows[0]["PAGO"].ToString(), (typeof(DataTable)));

                var factura = new FacturaUBL();
                string nombrearchivo = (empresa.Rows[0]["ruc"].ToString().Trim() + "-" + cabecera.Rows[0]["tipo_de_comprobante"].ToString().Trim() + "-" + cabecera.Rows[0]["serie"].ToString().Trim() + "-" + cabecera.Rows[0]["numero"].ToString().Trim() + ".txt");



                //NUBEFACT
                #region CabeceraNUBEFACT
                List<string> tituloscab = new List<string>();
                tituloscab.Add("tipo_de_comprobante");
                tituloscab.Add("serie");
                tituloscab.Add("numero");
                tituloscab.Add("sunat_transaction");
                tituloscab.Add("cliente_tipo_de_documento");
                tituloscab.Add("cliente_numero_de_documento");
                tituloscab.Add("cliente_denominacion");
                tituloscab.Add("cliente_direccion");
                tituloscab.Add("cliente_email");
                tituloscab.Add("cliente_email2");
                tituloscab.Add("fecha_de_emision");
                tituloscab.Add("fecha_de_vencimiento");
                tituloscab.Add("moneda");
                tituloscab.Add("tipo_de_cambio");
                tituloscab.Add("porcentaje_de_igv");
                tituloscab.Add("descuento_global");
                tituloscab.Add("total_descuento");
                tituloscab.Add("total_anticipo");
                tituloscab.Add("total_gravada");
                tituloscab.Add("total_inafecta");
                tituloscab.Add("total_igv");
                tituloscab.Add("total_impuestos_bolsas");
                tituloscab.Add("total_gratuita");
                tituloscab.Add("total_otros_cargos");
                tituloscab.Add("total");
                tituloscab.Add("percepcion_tipo");
                tituloscab.Add("percepcion_base_imponible");
                tituloscab.Add("total_percepcion");
                tituloscab.Add("total_incluido_percepcion");
                tituloscab.Add("detraccion");
                tituloscab.Add("observaciones");
                tituloscab.Add("documento_que_se_modifica_tipo");
                tituloscab.Add("documento_que_se_modifica_serie");
                tituloscab.Add("documento_que_se_modifica_numero");
                tituloscab.Add("tipo_de_nota_de_credito");
                tituloscab.Add("tipo_de_nota_de_debito");
                tituloscab.Add("enviar_automaticamente_a_la_sunat");
                tituloscab.Add("enviar_automaticamente_al_cliente");
                tituloscab.Add("codigo_unico");
                tituloscab.Add("condiciones_de_pago");
                tituloscab.Add("medio_de_pago");
                tituloscab.Add("placa_vehiculo");
                tituloscab.Add("orden_compra_servicio");
                tituloscab.Add("formato_de_pdf");
                tituloscab.Add("detraccion_tipo");
                tituloscab.Add("detraccion_total");
                tituloscab.Add("detraccion_porcentaje");
                tituloscab.Add("medio_de_pago_detraccion");
                tituloscab.Add("generado_por_contingencia");


                string archivotxt = string.Format("{0}{1}", "operacion|generar_comprobante|", Environment.NewLine);
                //archivotxt += string.Format("serie|" + cabecera.Rows[0]["tip_comprobante"].ToString().Trim() + "|", Environment.NewLine);

                for (int i = 0; i < tituloscab.Count; i++) {
                    archivotxt += string.Format("{0}{1}", tituloscab[i] + "|" + cabecera.Rows[0][tituloscab[i]].ToString().Trim() + "|", Environment.NewLine);
                }
                #endregion

                #region Detalle
                for (int i = 0; i < detalle.Rows.Count; i++) {
                    //detalle.Rows[i]["unidadmedidasunat"].ToString()+"|";
                    archivotxt += detalle.Rows[i]["item"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["medida"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["codigoproducto"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["producto"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["cantidad"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["valor_unitario"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["precio_unitario"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["descuento"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["subtotal"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["tipo_igv"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["total_igv"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["total"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["anticipo"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["serie_anticipo"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["doc_anticipo"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["codigo_excel"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["otro_cargos"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["ISC"].ToString() + "|";
                    archivotxt += detalle.Rows[i]["impuesto_bolsa"].ToString() + "|";
                    archivotxt += string.Format("{0}{1}", detalle.Rows[0]["IVAP"].ToString().Trim(), Environment.NewLine);
                }
                #endregion
                #region Pagos

                archivotxt += pago.Rows[0]["tipoventa"].ToString() + "|";
                archivotxt += pago.Rows[0]["cuotas"].ToString() + "|";
                archivotxt += pago.Rows[0]["fecha_vencimiento"].ToString() + "|";
                archivotxt += pago.Rows[0]["total"].ToString();

                #endregion
                Writetxt.creartxtAsync(path, archivotxt, nombrearchivo);
                return nombrearchivo;

            }
            catch (Exception e) {
                return null;
            }
        }


        // nuevo listar ventas

        public async Task<string> BuscarVentaNotaCD_v1(int idventa, string idproductos)
        {

            try
            {

                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();

                    using (SqlCommand cmm = new SqlCommand("Ventas.sp_get_ventacompleta_para_notacredito_v3", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@IDVENTA", idventa);
                        cmm.Parameters.AddWithValue("@IDPRODUCTOS", idproductos);                       
                        //cmm.Parameters.AddWithValue("@PRODUCTO", idproductos);

                        DataTable tabla = new DataTable();
                        SqlDataAdapter da = new SqlDataAdapter(cmm);
                        da.Fill(tabla);
                        tabla.TableName = "HISTORIAL NOTASCD";
                        cnn.Close();

                        // Convertir la tabla a JSON
                        string jsonResult = JsonConvert.SerializeObject(tabla, Formatting.Indented);

                        // Devolver el resultado JSON
                        return jsonResult;
                    } // cmm se libera automáticamente al salir de este bloque
                }
            }
            catch (Exception e)
            {
                // En caso de error, devolver un mensaje de error en formato JSON
                return JsonConvert.SerializeObject(new mensajeJson("Error", e.Message));
            }

        }
    }
}
