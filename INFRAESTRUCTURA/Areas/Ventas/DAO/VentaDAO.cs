using ENTIDADES.facturacionHorizont;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using ENTIDADES.facturacionHorizont.Utils;
using Erp.SeedWork;
using System.IO;
using System.Globalization;

namespace INFRAESTRUCTURA.Areas.Ventas.DAO
{
    public class VentaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public static DataTable tabla;
        public VentaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetVentaCompleta(long idventa)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Ventas.SP_GET_VENTA_COMPLETA", cnn);
                cmm = new SqlCommand("Ventas.sp_get_venta_completa_v2", cnn);//EARTCOD1009
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDVENTA", idventa);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "VENTACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable GetVentaCompletaparaN(long idventa)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_GET_VENTA_COMPLETA_NUBEFACT", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDVENTA", idventa);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "VENTACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable GetVentaCompleta_D(long idventa)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_GET_VENTA_COMPLETA_D", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDVENTA", idventa);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "VENTACOMPLETA";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable HistorialClientes(string fechainicio, string fechafin, int idcliente, int top)
        {
            try
            {
                fechainicio = fechainicio ?? "";
                fechainicio = fechafin ?? "";
                if (top is 0) top = 100;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_HISTORIAL_VENTAS_CLIENTES", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@IDCLIENTE", idcliente);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "HISTORIALCLIENTE";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public async Task<DataTable> HistorialVentasAsync(string fechainicio, string fechafin, string sucursal, string numdocumento, string cliente, int top)
        {
            //aca
            var tarea = await Task.Run(() =>
            {
                try
                {
                    tabla = new DataTable();
                    if (top is 0) top = 10;
                    if (fechafin is null) fechafin = "";
                    if (fechainicio is null) fechainicio = "";
                    if (sucursal is null) sucursal = "";
                    if (numdocumento is null) numdocumento = "";

                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.SP_HISTORIAL_VENTAS", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                    cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                    cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                    cmm.Parameters.AddWithValue("@NUMDOCUMENTO", numdocumento);
                    cmm.Parameters.AddWithValue("@doccliente", cliente ?? "");
                    cmm.Parameters.AddWithValue("@TOP", top);
                    cmm.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "HISTORIAL VENTAS";
                    cnn.Close();

                    return tabla;
                }
                catch (Exception vex)
                {
                    return new DataTable();
                }
            });
            return tarea;
        }
        public async Task<DataTable> BuscarFacturasMatrizParaNC(string cliente, string producto, string lote, int idsucursal)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    DataTable tabla = new DataTable();
                    if (cliente is null) cliente = "";
                    if (producto is null) producto = "";
                    if (lote is null) lote = "";

                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.SP_BuscarFacturasMatriz", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@CLIENTE", cliente);
                    cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                    cmm.Parameters.AddWithValue("@LOTE", lote);
                    cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                    cmm.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "VENTAS MATRIZ";
                    cnn.Close();

                    return tabla;
                }
                catch (Exception vex)
                {
                    return new DataTable();
                }
            });
            return tarea;
        }
        public async Task<DataTable> BuscarDetalleVentaMatrizParaNC(string idventa)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    DataTable tabla = new DataTable();
                    if (idventa is null) idventa = "0";

                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Ventas.SP_DetalleVentaParaNC", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@IDVENTA", idventa);
                    cmm.CommandTimeout = 0;
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "DETALLE VENTAS MATRIZ";
                    cnn.Close();
                    return tabla;
                }
                catch (Exception vex)
                {
                    return new DataTable();
                }
            });
            return tarea;
        }

        public async Task<mensajeJson> GenerarExcelVentasAsync(string fechainicio, string fechafin, string sucursal, string numdocumento, string cliente, int top, string path)
        {
            try
            {
                var data = await Task.Run(async () =>
                {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteventas" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/ventas/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (tabla is null)
                    {
                        var DATA = tabla;//await HistorialVentasAsync(fechainicio, fechafin, sucursal, numdocumento, cliente, top);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else
                    {
                        res = save.GenerateExcel(ruta, nombre, tabla);

                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<string> generarTextTxtAsync(long idventa, string path)
        {
            var tarea = await Task.Run(() =>
            {
                try
                {
                    var dataTable = GetVentaCompleta(idventa);
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
                    string nombrearchivo = factura.GenerarNombreTxt(empresa.Rows[0]["ruc"].ToString().Trim(), cabecera.Rows[0]["doctribcodigosunat"].ToString().Trim(), cabecera.Rows[0]["serie"].ToString().Trim(), cabecera.Rows[0]["numdocumento"].ToString().Trim(), "txt");
                    if (nombrearchivo is "x")
                        return "Error al generar= nombre de txt";



                    factura.DatosComprobante = new DatosComprobante
                    {
                        codigo = cabecera.Rows[0]["doctribcodigosunat"].ToString().Trim(),
                        serie = cabecera.Rows[0]["serie"].ToString().Trim(),
                        numerodoc = cabecera.Rows[0]["numdocumento"].ToString().Trim(),
                        fechaemision = cabecera.Rows[0]["fechasunat"].ToString().Trim(),
                        horaemision = "",
                        codigomoneda = pago.Rows[0]["monedacodigosunat"].ToString(),

                        fechavencimiento = "",
                    };

                    factura.DatosEmisor = new DatosEmisor
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
                    factura.LugarEngrega_VentaItinerante = new LugarEngrega_VentaItinerante();
                    factura.DatosAdquiriente = new DatosAdquiriente
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
                    factura.DatosComprador = new DatosComprador();

                    factura.InformacionAdicional = new InformacionAdicional
                    {
                        numordencompra = "",
                        tipooperacion = "0101"
                    };
                    factura.TipoCambio = new TipoCambio();
                    factura.Detracciones = new Detracciones();
                    factura.MigracionDocumentosAutorizados = new MigracionDocumentosAutorizados();
                    factura.DatosDocumentoModifica = new DatosDocumentoModifica();
                    factura.IncoteRMS = new IncoteRMS();
                    factura.ImpuestoICBPER = new ImpuestoICBPER();
                    factura.DetalleFactura = new List<DetalleFactura>();
                    var bonificaciones = new List<DetalleFactura>();
                    DetalleFactura detalleobj;
                    for (int i = 0; i < detalle.Rows.Count; i++)
                    {
                        detalleobj = new DetalleFactura();
                        detalleobj.numitem = (i + 1);
                        detalleobj.codigounidadmedida = detalle.Rows[i]["unidadmedidasunat"].ToString();
                        detalleobj.tipotributo = detalle.Rows[i]["tipoimpuesto"].ToString();
                        detalleobj.cantidad = int.Parse(detalle.Rows[i]["cantidad"].ToString());
                        detalleobj.descripcion_producto_servicio = detalle.Rows[i]["producto"].ToString();
                        detalleobj.codigoproducto = detalle.Rows[i]["codigoproducto"].ToString();
                        detalleobj.preciounitario = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["preciodescuento"].ToString()));//sinigv
                        detalleobj.precioventaunitarioigv = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["precioigvdescuento"].ToString()));//conigv
                        var total = (detalleobj.cantidad) * (detalleobj.precioventaunitarioigv);
                        var subtotal = (detalleobj.cantidad) * (detalleobj.preciounitario);
                        detalleobj.total = total;
                        detalleobj.subtotal = decimal.Parse(subtotal.ToString("0.00"));
                        detalleobj.montototal_impuestos_item = decimal.Parse(Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["montoigv"].ToString())).ToString("0.00"));
                        detalleobj.tasaIGV_IVAP = detalle.Rows[i]["tasaigv"].ToString();
                        detalleobj.montoIGV_IVAP = Convert.ToDecimal(string.Format("{0:0.00}", detalle.Rows[i]["montoigv"].ToString()));
                        detalleobj.codafectacionigv = (detalle.Rows[i]["codafectacionigvsunat"].ToString());
                        detalleobj.valor_venta_item = detalleobj.subtotal;
                        detalleobj.montobase = detalleobj.subtotal;
                        detalleobj.tipo = (detalle.Rows[i]["tipoitem"].ToString());
                        if (detalleobj.tipo.ToLower() == "bonificacion")
                        {
                            bonificaciones.Add(detalleobj);
                            //factura.DetalleFactura.Add(detalleobj);
                        }
                        if (decimal.Parse(detalle.Rows[i]["precioigvdescuento"].ToString()) > 0.01m
                        && detalleobj.tipo.ToLower() != "bonificacion"
                        )
                            factura.DetalleFactura.Add(detalleobj);
                    }

                    //verificar bonificaciones
                    var nuevalista = new List<DetalleFactura>();
                    if (bonificaciones.Count > 0)
                    {
                        foreach (var item in factura.DetalleFactura.ToList())
                        {
                            var boni = bonificaciones.Where(x => x.codigoproducto == item.codigoproducto).ToList();
                            if (boni.Count > 0)
                            {
                                var cantboni = boni.Sum(x => x.cantidad);
                                var montoaux = item.cantidad * item.precioventaunitarioigv;
                                cantboni = item.cantidad;
                                var precioigv = montoaux / cantboni;
                                var precio = precioigv;
                                if (factura.DatosEmisor.numruc != "20393499908")
                                {
                                    precio = precioigv / 1.18m;
                                }
                                else
                                {
                                    precio = precioigv;
                                }


                                item.precioventaunitarioigv = decimal.Parse(precioigv.ToString("0.00"));
                                item.preciounitario = decimal.Parse(precio.ToString("0.00"));
                                item.cantidad = cantboni;
                            }
                            nuevalista.Add(item);
                        }
                        factura.DetalleFactura = nuevalista;
                    }

                    factura.TotalImpuestos = new TotalImpuestos
                    {
                        //EARTCOD1009
                        total_impuesto = (factura.DetalleFactura.Sum(x => x.montoIGV_IVAP) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString()) * 0.18m).ToString("0.00"),
                        total_gravadas_igv = (factura.DetalleFactura.Where(x => x.tipotributo == "IGV").Sum(x => x.subtotal) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString())).ToString("0.00"),
                        tributos_gravadas_igv = (factura.DetalleFactura.Sum(x => x.montoIGV_IVAP) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString()) * 0.18m).ToString("0.00"),
                        //-EARTCOD1009

                        //total_impuesto = factura.DetalleFactura.Sum(x => x.montoIGV_IVAP).ToString("0.00"),
                        //total_gravadas_igv = factura.DetalleFactura.Where(x => x.tipotributo == "IGV").Sum(x => x.subtotal).ToString("0.00"),
                        //tributos_gravadas_igv = factura.DetalleFactura.Sum(x => x.montoIGV_IVAP).ToString("0.00"),

                        total_exportacion = 0.00m,
                        tributos_operaciones_exportaciones = 0.00m,
                        total_inafectada = factura.DetalleFactura.Where(x => x.tipotributo == "INA").Sum(x => x.subtotal).ToString("0.00"),
                        tributos_operaciones_inafectadas = 0.00m,
                        total_exonerada = factura.DetalleFactura.Where(x => x.tipotributo == "EXO").Sum(x => x.subtotal).ToString("0.00"),
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

                    factura.Total = new Total
                    {
                        //EARTCOD1009
                        importe_total = Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()).ToString("0.00"),
                        total_valor_venta = (factura.DetalleFactura.Sum(x => x.subtotal) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString())).ToString("0.00"),
                        total_precio_venta = Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()).ToString("0.00"),
                        //-EARTCOD1009

                        //EARTCOD1009
                        //total_descuentos = Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"].ToString()),
                        //total_otros_cargos = 0.00m,
                        //importe_total = (factura.DetalleFactura.Sum(x => x.total)- Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"])*1.18m).ToString("0.00"),
                        //total_valor_venta = (factura.DetalleFactura.Sum(x => x.subtotal) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"])).ToString("0.00"),
                        //total_precio_venta = (factura.DetalleFactura.Sum(x => x.total) - Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]) * 1.18m).ToString("0.00"),
                        //monto_redondeo_importetotal = 0.00m,
                        //total_anticipos = 0.00m
                        //-EARTCOD1009

                        total_descuentos = 0.00m,
                        total_otros_cargos = 0.00m,
                        //importe_total = factura.DetalleFactura.Sum(x => x.total).ToString("0.00"),
                        //total_valor_venta = factura.DetalleFactura.Sum(x => x.subtotal).ToString("0.00"),
                        //total_precio_venta = factura.DetalleFactura.Sum(x => x.total).ToString("0.00"),
                        monto_redondeo_importetotal = 0.00m,
                        total_anticipos = 0.00m
                    };
                    factura.leyenda = new Leyenda
                    {
                        codigo = "1000",
                        descripcion = monedatext.NumeroALetras(decimal.Parse(factura.Total.importe_total), pago.Rows[0]["monedacodigosunat"].ToString())
                    };


                    string versiontxt = "V|2.1|2.0||\n";
                    string cabeceratxt = "G|";
                    string cuerpotxt = "";
                    string leyenda = "L|";
                    string leyenda2 = "";
                    string valor = "";

                    string descuento = "C|02|";//EARTCOD1009

                    //nuevo cambio para amazonia 
                    if (factura.DatosEmisor.numruc == "20393499908")
                    {
                        factura.TotalImpuestos.total_inafectada = "";  //49
                        factura.TotalImpuestos.tributos_operaciones_exoneradas = 0; //52 0.00
                        factura.TotalImpuestos.total_gravadas_igv = "0.00";  //55 0.00

                        leyenda2 = "L|2001|BIENES TRANSFERIDOS EN LA AMAZONIA REGION SELVA PARA SER CONSUMIDOS EN LA MISMA.|";
                    };
                    // Fin de cambio en cabecera para amazonia


                    cabeceratxt += factura.DatosComprobante.codigo + "|";
                    cabeceratxt += factura.DatosComprobante.serie + "|";
                    cabeceratxt += factura.DatosComprobante.numerodoc + "|";
                    cabeceratxt += factura.DatosComprobante.fechaemision + "|";
                    cabeceratxt += factura.DatosComprobante.horaemision + "|";
                    cabeceratxt += factura.DatosComprobante.codigomoneda + "|";
                    cabeceratxt += factura.DatosComprobante.fechavencimiento + "|";

                    cabeceratxt += factura.DatosEmisor.tipodocumento + "|";
                    cabeceratxt += factura.DatosEmisor.numruc + "|";
                    cabeceratxt += factura.DatosEmisor.nombres_razonsocial + "|";
                    cabeceratxt += factura.DatosEmisor.nombre_comerciar_corto + "|";
                    cabeceratxt += factura.DatosEmisor.direccion + "|";
                    cabeceratxt += factura.DatosEmisor.codigoubigeo + "|";
                    cabeceratxt += factura.DatosEmisor.departamento + "|";
                    cabeceratxt += factura.DatosEmisor.provincia + "|";
                    cabeceratxt += factura.DatosEmisor.urbanizacion + "|";
                    cabeceratxt += factura.DatosEmisor.distrito + "|";
                    cabeceratxt += factura.DatosEmisor.codigopais + "|";
                    cabeceratxt += factura.DatosEmisor.codigoestablecimiento + "|";
                    cabeceratxt += factura.DatosEmisor.correo_contacto + "|";
                    cabeceratxt += factura.DatosEmisor.telefono_contacto + "|";
                    cabeceratxt += factura.DatosEmisor.website_contacto + "|";

                    cabeceratxt += factura.LugarEngrega_VentaItinerante.direccion + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.codigoubigeo + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.departamento + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.provincia + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.urbanizacion + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.distrito + "|";
                    cabeceratxt += factura.LugarEngrega_VentaItinerante.codigopais + "|";

                    cabeceratxt += factura.DatosAdquiriente.tipodocumento + "|";
                    cabeceratxt += factura.DatosAdquiriente.numdocumento + "|";
                    cabeceratxt += factura.DatosAdquiriente.nombres_razonsocial + "|";
                    cabeceratxt += factura.DatosAdquiriente.direccion + "|";
                    cabeceratxt += factura.DatosAdquiriente.codigoubigeo + "|";
                    cabeceratxt += factura.DatosAdquiriente.departamento + "|";
                    cabeceratxt += factura.DatosAdquiriente.provincia + "|";
                    cabeceratxt += factura.DatosAdquiriente.urbanizacion + "|";
                    cabeceratxt += factura.DatosAdquiriente.distrito + "|";
                    cabeceratxt += factura.DatosAdquiriente.codigopais + "|";
                    cabeceratxt += factura.DatosAdquiriente.codigoestablecimiento + "|";
                    cabeceratxt += factura.DatosAdquiriente.correo_contacto + "|";
                    cabeceratxt += factura.DatosAdquiriente.telefono_contacto + "|";
                    cabeceratxt += factura.DatosAdquiriente.website_contacto + "|";

                    cabeceratxt += factura.DatosComprador.tipodocumento + "|";
                    cabeceratxt += factura.DatosComprador.numdocumento + "|";

                    cabeceratxt += factura.TotalImpuestos.total_impuesto + "|";
                    cabeceratxt += (factura.TotalImpuestos.total_exportacion == 0 ? "" : factura.TotalImpuestos.total_exportacion.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_operaciones_exportaciones == 0 ? "" : factura.TotalImpuestos.tributos_operaciones_exportaciones.ToString()) + "|";
                    cabeceratxt += factura.TotalImpuestos.total_inafectada + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_operaciones_inafectadas == 0 ? "" : factura.TotalImpuestos.tributos_operaciones_inafectadas.ToString()) + "|";
                    cabeceratxt += factura.TotalImpuestos.total_exonerada + "|";
                    if (factura.DatosEmisor.numruc == "20393499908")
                    {
                        cabeceratxt += (factura.TotalImpuestos.tributos_operaciones_exoneradas == 0 ? "0.00" : factura.TotalImpuestos.tributos_operaciones_exoneradas.ToString()) + "|";
                    }
                    else
                    {
                        cabeceratxt += (factura.TotalImpuestos.tributos_operaciones_exoneradas == 0 ? "" : factura.TotalImpuestos.tributos_operaciones_exoneradas.ToString()) + "|";
                    }

                    cabeceratxt += (factura.TotalImpuestos.total_operaciones_gratuitas == 0 ? "" : factura.TotalImpuestos.total_operaciones_gratuitas.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_operaciones_gratuitas == 0 ? "" : factura.TotalImpuestos.tributos_operaciones_gratuitas.ToString()) + "|";
                    cabeceratxt += factura.TotalImpuestos.total_gravadas_igv + "|";
                    cabeceratxt += factura.TotalImpuestos.tributos_gravadas_igv + "|";
                    cabeceratxt += (factura.TotalImpuestos.total_gravadas_IVAP == 0 ? "" : factura.TotalImpuestos.total_gravadas_IVAP.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_gravadas_IVAP == 0 ? "" : factura.TotalImpuestos.tributos_gravadas_IVAP.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.total_ISC == 0 ? "" : factura.TotalImpuestos.total_ISC.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_ISC == 0 ? "" : factura.TotalImpuestos.tributos_ISC.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.total_otros_tributos == 0 ? "" : factura.TotalImpuestos.total_otros_tributos.ToString()) + "|";
                    cabeceratxt += (factura.TotalImpuestos.tributos_otros_tributos == 0 ? "" : factura.TotalImpuestos.tributos_otros_tributos.ToString()) + "|";

                    cabeceratxt += (factura.Total.total_descuentos == 0 ? "" : factura.Total.total_descuentos.ToString()) + "|";
                    cabeceratxt += (factura.Total.total_otros_cargos == 0 ? "" : factura.Total.total_otros_cargos.ToString()) + "|";
                    cabeceratxt += factura.Total.importe_total + "|";
                    cabeceratxt += factura.Total.total_valor_venta + "|";
                    cabeceratxt += factura.Total.total_precio_venta + "|";
                    cabeceratxt += (factura.Total.monto_redondeo_importetotal == 0 ? "" : factura.Total.monto_redondeo_importetotal.ToString()) + "|";
                    cabeceratxt += (factura.Total.total_anticipos == 0 ? "" : factura.Total.total_anticipos.ToString()) + "|";

                    cabeceratxt += factura.InformacionAdicional.tipooperacion + "|";
                    cabeceratxt += factura.InformacionAdicional.numordencompra + "|";

                    cabeceratxt += factura.TipoCambio.moneda_referencia_para_tipocambio + "|";
                    cabeceratxt += factura.TipoCambio.moneda_objetivo_para_tipocambio + "|";
                    cabeceratxt += factura.TipoCambio.factor_aplicado_a_monedaorigen_para_calcular_monedadestino + "|";
                    cabeceratxt += factura.TipoCambio.fecha_tipocambio + "|";

                    cabeceratxt += factura.Detracciones.codigo_bien_servicio + "|";
                    cabeceratxt += factura.Detracciones.numcuenta_banconacion_detraccion + "|";
                    cabeceratxt += factura.Detracciones.mediopago + "|";
                    cabeceratxt += factura.Detracciones.montodetraccion + "|";
                    cabeceratxt += factura.Detracciones.porcentajedetraccion + "|";
                    cabeceratxt += factura.Detracciones.monedadetraccion + "|";
                    cabeceratxt += factura.Detracciones.condicionpago + "|";

                    cabeceratxt += factura.MigracionDocumentosAutorizados.tipodocumento_agenteventas + "|";
                    cabeceratxt += factura.MigracionDocumentosAutorizados.numruc_agenteventas + "|";
                    cabeceratxt += factura.MigracionDocumentosAutorizados.mediopago + "|";
                    cabeceratxt += factura.MigracionDocumentosAutorizados.numautorizaciontransaccion + "|";

                    cabeceratxt += factura.DatosDocumentoModifica.tipodocumento + "|";
                    cabeceratxt += factura.DatosDocumentoModifica.serie_numdocumento + "|";
                    cabeceratxt += factura.DatosDocumentoModifica.codigomotivo_documentoreferencia + "|";
                    cabeceratxt += factura.DatosDocumentoModifica.descripcion_motivo_sustento + "|";
                    cabeceratxt += factura.DatosDocumentoModifica.fechaemision_documentomodifica + "|";

                    cabeceratxt += factura.IncoteRMS.INCOTERMS + "|";
                    cabeceratxt += factura.IncoteRMS.descrion_puertollegada + "|";
                    //cambio por motivo de ley de sunat 28-08
                    //nuevo por cambio de sunat 28-08-2021
                    string mensajepago = "";
                    string vnombpago;
                    string nmontpago;
                    string iddocu = cabecera.Rows[0]["iddocumento"].ToString().Trim();
                    if (iddocu == "1000")  //si es factura solo en ese caso cambia el texto
                    {
                        cabeceratxt += factura.ImpuestoICBPER.totalICBPER + "|";
                        string vtipopago = pago.Rows[0]["idtipopago"].ToString();

                        if (vtipopago == "10001")  //CREDITO
                        {
                            vnombpago = "Credito";
                            nmontpago = factura.Total.importe_total;

                            DateTime DateObject = Convert.ToDateTime(factura.DatosComprobante.fechaemision);
                            string Nuevafecha = DateObject.AddDays(30).ToString("yyyy-MM-dd");
                            //
                            mensajepago = "F|Cuota001|" + factura.Total.importe_total + "|" + Nuevafecha + "|\n";

                        }
                        else
                        {
                            vnombpago = "Contado";
                            nmontpago = "";
                        }
                        //fin de cambio
                        cabeceratxt += vnombpago + "|";
                        cabeceratxt += nmontpago + "|\n";
                    }
                    else
                    {
                        cabeceratxt += factura.ImpuestoICBPER.totalICBPER + "|\n";
                        mensajepago = "";
                    }
                    //fin por cambio de sunat 28-08-2021


                    for (int i = 0; i < factura.DetalleFactura.Count; i++)
                    {
                        //PRODUCTO
                        cuerpotxt += "I|" + (i + 1) + "|";
                        cuerpotxt += factura.DetalleFactura[i].codigounidadmedida + "|";
                        cuerpotxt += factura.DetalleFactura[i].cantidad + "|";
                        cuerpotxt += factura.DetalleFactura[i].codigoproducto + "|";
                        cuerpotxt += factura.DetalleFactura[i].codigoproductosunat + "|";
                        cuerpotxt += factura.DetalleFactura[i].codigoproductoGS1 + "|";
                        cuerpotxt += factura.DetalleFactura[i].tipoproductoGTIN + "|";
                        cuerpotxt += factura.DetalleFactura[i].numplacavehiculo + "|";
                        cuerpotxt += factura.DetalleFactura[i].descripcion_producto_servicio + "|";
                        cuerpotxt += factura.DetalleFactura[i].preciounitario.ToString("0.00000") + "|";
                        cuerpotxt += factura.DetalleFactura[i].precioventaunitarioigv.ToString("0.00") + "|";
                        cuerpotxt += "|";//factura.DetalleFactura[i].valorreferencialunitario 
                        //IGV IVAP
                        cuerpotxt += factura.DetalleFactura[i].montototal_impuestos_item.ToString("0.00") + "|";
                        cuerpotxt += factura.DetalleFactura[i].montobase.ToString("0.00") + "|";
                        cuerpotxt += factura.DetalleFactura[i].montoIGV_IVAP.ToString("0.00") + "|";
                        cuerpotxt += factura.DetalleFactura[i].tasaIGV_IVAP + "|";
                        cuerpotxt += factura.DetalleFactura[i].codafectacionigv + "|";
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
                        cuerpotxt += factura.DetalleFactura[i].valor_venta_item.ToString("0.00") + "|";
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

                    //EARTCOD1009
                    if (Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]) != 0)
                    {
                        decimal pkdescuento = Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]);
                        decimal total_venta = Convert.ToDecimal(cabecera.Rows[0]["total"]);
                        decimal subtotal_venta = Convert.ToDecimal(cabecera.Rows[0]["subtotal"]);
                        decimal subtotal_detalle = Convert.ToDecimal(factura.DetalleFactura.Sum(x => x.subtotal));
                        decimal totaldescuento = subtotal_detalle - total_venta;
                        decimal factor_desc = ((subtotal_venta - subtotal_detalle) / subtotal_detalle) * -1;
                        descuento += factor_desc.ToString("0.00000") + "|" + pkdescuento.ToString("0.00") + "|" + subtotal_detalle.ToString("0.00") + "|";
                        //descuento += "\n total:" + cabecera.Rows[0]["total"].ToString() + "|pkdescuento: " + Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]) + "|subtotal_dsc: " + subtotal_detalle + "|totalf_dsc: " + subtotal_venta + "|descuento_desc:" + totaldescuento + "| factor_desc:" + factor_desc;
                        descuento += "|\n";


                        ////subtotal_detalle
                        //decimal subtotal_dsc = Convert.ToDecimal(((Convert.ToDecimal(cabecera.Rows[0]["total"].ToString()) + Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]) * 1.18m)).ToString("0.00")) / 1.18m;
                        ////subtotal_venta
                        //decimal totalf_dsc = (Convert.ToDecimal(cabecera.Rows[0]["total"].ToString())) / 1.18m;
                        //decimal descuento_desc = Convert.ToDecimal(subtotal_dsc - totalf_dsc);
                        //decimal factor_desc = (100 - (totalf_dsc * 100 / subtotal_dsc)) / 100;
                        //descuento += factor_desc.ToString("0.00") + "|" + (subtotal_dsc * factor_desc).ToString("0.00") + "|" + subtotal_dsc.ToString("0.00") + "|";
                        //descuento += "\n total:" + cabecera.Rows[0]["total"].ToString()+ "|pkdescuento: " + Convert.ToDecimal(cabecera.Rows[0]["pkdescuento"]) + "|subtotal_dsc: " + subtotal_dsc + "|totalf_dsc: " + totalf_dsc + "|descuento_desc:" + descuento_desc + "| factor_desc:" + factor_desc;
                        //descuento += "|\n";
                    }
                    else
                    {
                        descuento = "";
                    }
                    //-EARTCOD1009

                    leyenda += factura.leyenda.codigo + "|";
                    leyenda += factura.leyenda.descripcion + "|";
                    //string valor = versiontxt + cabeceratxt + cuerpotxt + leyenda;

                    if (factura.DatosEmisor.numruc == "20393499908")  //cambio por amazonia
                    {   //cambio por amazonia
                        //valor = versiontxt + cabeceratxt + cuerpotxt + mensajepago + leyenda + "|\n" + leyenda2; //cambio por amazonia
                        valor = versiontxt + cabeceratxt + cuerpotxt + descuento + mensajepago + leyenda + "|\n" + leyenda2; //cambio por amazonia//EARTCOD1009
                    }  //cambio por amazonia
                    else //cambio por amazonia
                    {    //cambio por amazonia
                        //valor = versiontxt + cabeceratxt + cuerpotxt + mensajepago+ leyenda;
                        valor = versiontxt + cabeceratxt + cuerpotxt + descuento + mensajepago + leyenda;//EARTCOD1009
                    }  //cambio por amazonia

                    return Writetxt.creartxtAsync(path, valor, nombrearchivo);

                }
                catch (Exception e)
                {
                    return e.Message;
                }

            });
            return tarea;
        }

        public async Task<string> generarTXTNubefactAsync(long idventa, string path)
        {

            try
            {
                var dataTable = GetVentaCompletaparaN(idventa);
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
                tituloscab.Add("tota_otros_cargos");
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
                tituloscab.Add("generado_por_contingencia");


                string archivotxt = string.Format("{0}{1}", "operacion|generar_comprobante|", Environment.NewLine);
                //archivotxt += string.Format("serie|" + cabecera.Rows[0]["tip_comprobante"].ToString().Trim() + "|", Environment.NewLine);

                for (int i = 0; i < tituloscab.Count; i++)
                {
                    archivotxt += string.Format("{0}{1}", tituloscab[i] + "|" + cabecera.Rows[0][tituloscab[i]].ToString().Trim() + "|", Environment.NewLine);
                }
                #endregion

                #region Detalle
                for (int i = 0; i < detalle.Rows.Count; i++)
                {
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
            catch (Exception e)
            {
                return null;
            }
        }

        public DataTable GetDatosFacturador(int idsucrusal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Facturador.credenciales", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucrusal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DATOSFACTURADOR";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //------------CODIGO YEXSON--------------



        public async Task<object[][]> HistorialVentasArrayAsync(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            var resultList = new List<object[]>();
            try
            {
                // Convertir el string 'año/mes/dia' a DateTime
                DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


                // Convertir el DateTime a string 'dia/mes/año'
                fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
                fechafin = fechaFinDT.ToString("dd/MM/yyyy");

              
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("Ventas.SP_HISTORIAL_VENTAS_LISTAR_EXPORT", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@NUMDOCUMENTO", numdocumento ?? "");
                        cmm.Parameters.AddWithValue("@doccliente", cliente ?? "");
                        cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                        cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                        cmm.Parameters.AddWithValue("@SUCURSAL", int.Parse(sucursal));
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

        //EXPORTAR EXCEL
        public object[,] exportarexcelEpplus(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            object[,] resultArray = null;
            //string[] headers = new string[]
            //{
            //    "IDVENTA","SUCURSAL"," NUMDOCUMENTO","FECHA","DOCCLIENTE","CLIENTE",
            //    "COLEGIATURA","MEDICO","ESTADO","IMPORTE","USUARIO","EFECTIVO","TARJETA","EFECTIVOADE","TARJETAADE"

            // };
            // Convertir el string 'año/mes/dia' a DateTime
         

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("Ventas.SP_HISTORIAL_VENTAS_LISTAR_EXPORT", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        // Adding parameters
                        cmm.Parameters.AddWithValue("@NUMDOCUMENTO", numdocumento ?? "");
                        cmm.Parameters.AddWithValue("@doccliente", cliente ?? "");
                        cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                        cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                        cmm.Parameters.AddWithValue("@SUCURSAL", int.Parse(sucursal));

                        using (SqlDataReader reader = cmm.ExecuteReader())
                        {
                            var tempData = new List<object[]>();
                            var columnCount = reader.FieldCount;

                            string[] headers = new string[columnCount];
                            for (int i = 0; i < columnCount; i++)
                            {
                                headers[i] = reader.GetName(i);
                            }
                            while (reader.Read())
                            {
                                object[] values = new object[columnCount];
                                reader.GetValues(values);
                                tempData.Add(values);
                            }

                            // Considerar espacio para la cabecera al inicializar resultArray
                            resultArray = new object[tempData.Count + 1, columnCount];

                            // Agregar la cabecera
                            for (int j = 0; j < headers.Length; j++)
                            {
                                resultArray[0, j] = headers[j];
                            }

                            // Llenar el resto del arreglo con los datos
                            for (int i = 0; i < tempData.Count; i++)
                            {
                                for (int j = 0; j < columnCount; j++)
                                {
                                    resultArray[i + 1, j] = tempData[i][j];
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultArray;
        }








        //FIN CODIGO---------------------------














    }
}

