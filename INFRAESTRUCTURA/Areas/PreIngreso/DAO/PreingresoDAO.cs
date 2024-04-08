using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using ENTIDADES.preingreso;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

// subir archivo al drive yex
using Google.Apis.Drive.v3;
using Google.Apis.Auth.OAuth2;
using System.IO;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using System.Net.Http;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace INFRAESTRUCTURA.Areas.PreIngreso.DAO
{
    public class PreingresoDAO
    {        
        private readonly string cadena;
        SqlConnection cnn;
       
        SqlCommand cmm;
        SqlCommand cmd;
        public PreingresoDAO(string cadena)
        {            
            this.cadena = cadena;
        }
        
        public DataTable getPreingresos(string preingreso, string idempresa, string estado, string sucursal,string orden,string factura,int top)
        {
            if (preingreso is null)      preingreso = "";         
            if (estado is null)         estado = "";
            if (top is 0) top = 100;
            if (orden is null) orden = "";
            if (factura is null) factura = "";
            if (sucursal is null) sucursal = "";
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_LISTAR_PREINGRESOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@CODIGO", preingreso);
                cmm.Parameters.AddWithValue("@EMPRESA", idempresa);
              
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);

                cmm.Parameters.AddWithValue("@ORDEN", orden);
                cmm.Parameters.AddWithValue("@FACTURA", factura);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PREINGRESOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public DataTable getPreingresosAprobarFactura(string preingreso, string idempresa, string estado, string sucursal, string orden, string factura, string proveedor, int top)
        {
            if (preingreso is null) preingreso = "";
            if (estado is null) estado = "";
            if (top is 0) top = 100;
            if (orden is null) orden = "";
            if (factura is null) factura = "";
            if (sucursal is null) sucursal = "";
            if (proveedor is null) proveedor = "";
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_LISTAR_PREINGRESOS_APROBARFACTURA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@CODIGO", preingreso);
                cmm.Parameters.AddWithValue("@EMPRESA", idempresa);

                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);

                cmm.Parameters.AddWithValue("@ORDEN", orden);
                cmm.Parameters.AddWithValue("@FACTURA", factura);
                cmm.Parameters.AddWithValue("@PROVEEDOR", proveedor);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PREINGRESOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception ex)
            {
                return new DataTable();
            }
        }
        public DataTable getstockpreingreso(int idtabla,string tipo)
        {
           
            try
            {
                if (tipo is null) return new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.sp_getstock_ingresado_preingreso", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idtabla", idtabla);
                cmm.Parameters.AddWithValue("@tipo", tipo);
               
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PREINGRESO";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getactaderecepcion(int idfactura)
        {           
            try
            {             
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.sp_get_acta_recepcion", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idfactura", idfactura);               
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ACTA DE RECEPCION";
                cnn.Close();
                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }
        public PIPreingreso getCabecera(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_BUSCAR_CABECERA_PREINGRESO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA PREINGRESO";

                PIPreingreso obj = new PIPreingreso();
                foreach (DataRow row in tabla.Rows)
                {
                    obj = new PIPreingreso();
                    obj.idpreingreso = int.Parse(row["ID"].ToString());
                    obj.codigopreingreso = (row["CODIGO"].ToString());
                    obj.estado = (row["ESTADO"].ToString());
                    obj.idempresa = int.Parse(row["ID EMPRESA"].ToString());
                    obj.fecha = DateTime.Parse(row["FECHA"].ToString());
                    obj.fechadoc = DateTime.Parse(row["FECHA DOC"].ToString());
                    obj.seriedoc = (row["SERIEDOC"].ToString());
                    obj.numerodoc = (row["NUMERODOC"].ToString());
                    obj.quimico = (row["QUIMICO"].ToString());
                    obj.obs = (row["OBS"].ToString());
                    obj.observacion = (row["OBSERVACION"].ToString());
                    obj.rechazadoporerror = bool.Parse(row["RECHAZADO"].ToString());
                    obj.proveedor = new CProveedor
                    {
                        razonsocial = (row["PROV. RAZONSOCIAL"].ToString()),
                        ruc = (row["PROV. RUC"].ToString()),
                        idproveedor = int.Parse(row["ID PROV"].ToString())
                    };
                    obj.moneda = new FMoneda
                    {
                        nombre = (row["MONEDA"].ToString()),
                        tipodecambio = decimal.Parse(row["MONEDACAMBIO"].ToString())
                    };
                    obj.condicionpago = new FCondicionPago
                    {
                        descripcion = (row["CONDICION PAGO"].ToString())
                    };
                    obj.empleado = (row["EMPLEADO NOMBRES"].ToString());
                    obj.sucursal = new SUCURSAL
                    {
                        suc_codigo = int.Parse(row["IDSUCURSAL"].ToString()),
                        descripcion = (row["SUCURSAL"].ToString())
                    };
                    obj.idsucursal = int.Parse(row["IDSUCURSAL"].ToString());
                    obj.orden = new COrdenCompra
                    {
                        idordencompra = int.Parse(row["IDORDEN"].ToString()),
                        codigoorden = (row["CODIGOOREDEN"].ToString()),
                        estado = (row["ESTADOORDEN"].ToString()),
                        fecha = DateTime.Parse(row["FECHAORDEN"].ToString())
                    };
                }
                cnn.Close();
                return obj;
            }
            catch (Exception )
            {
                return new PIPreingreso();
            }
        }
        public DataTable getPreingresoCompleto(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.SP_BUSCAR_PREINGRESO_COMPLETO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA PREINGRESO";

                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public DataTable getActaRecepcionImprimir(int id) {
            try {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_FacturaPreingreso_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDFACTURA", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ACTA DE RECEPCION";
                cnn.Close();
                return tabla;
            } catch (Exception vEx) {
                return new DataTable();            
            }
        }
        //by gustavo
        public DataTable getPreingresoCompleto_StockxFactura(int id)
        {
            try
            {
                //aca
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.SP_BUSCARPREINGRESOCOMPLETO_STOCKXFACTURA_V2", cnn);//EARTCOD1016
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDFACTURA", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA PREINGRESO";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        //by Gustavo 21/01/2021
        public DataTable getPreingresosparaAnalisisOrg(string preingreso, string idempresa, string estado, string sucursal, string orden, string factura, int top)
        {
            if (preingreso is null) preingreso = "";
            if (estado is null) estado = "";
            if (top is 0) top = 100;
            if (orden is null) orden = "";
            if (factura is null) factura = "";
            if (sucursal is null) sucursal = "";
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_LISTAR_FACTURAS_PREINGRESOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@CODIGO", preingreso);
                cmm.Parameters.AddWithValue("@EMPRESA", idempresa);

                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);

                cmm.Parameters.AddWithValue("@ORDEN", orden);
                cmm.Parameters.AddWithValue("@FACTURA", factura);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PREINGRESOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getPreingresoCompletoxid(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.SP_BUSCAR_PREINGRESO_COMPLETOXID", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PREINGRESO";
                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public DataTable getPreingresoCompletoPorFactura(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.SP_BUSCAR_PREINGRESO_COMPLETO_POR_FACTURA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDFACTURA", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA PREINGRESO";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public List<PIPreingresoDetalle> getDetalle(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_LISTAR_DETALLE_PREINGRESO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DETALLE PREINGRESO";
                PIPreingresoDetalle obj = new PIPreingresoDetalle();
                List<PIPreingresoDetalle> lista = new List<PIPreingresoDetalle>();
                foreach (DataRow row in tabla.Rows)
                {
                    obj = new PIPreingresoDetalle();
                    obj.idpreingreso = int.Parse(row["IDPRE"].ToString());
                    obj.iddetallepreingreso = int.Parse(row["ID"].ToString());

                    obj.iddetalle = int.Parse(row["IDORDEN"].ToString());
                    obj.idproducto = int.Parse(row["IDPRODUCTO"].ToString());
                    obj.producto = new AProducto
                    {
                        idproducto = int.Parse(row["IDPRODUCTO"].ToString()),
                        nombre = row["PRODUCTO"].ToString(),
                        codigoproducto = row["CODPRODUCTO"].ToString(),
                        idtipoproducto = row["TIPOPRODUCTO"].ToString()
                    };
                    obj.idproductopro = int.Parse(row["IDPRODPROV"].ToString());
                    obj.productopro = new CProductoProveedor
                    {
                        idproductoproveedor = int.Parse(row["IDPRODPROV"].ToString()),
                        descripcion = row["PROPROV"].ToString(),
                        codproductoproveedor = row["CODPROPOROV"].ToString()
                    };

                    obj.cantoc = int.Parse(row["CANTIDADCOTI"].ToString());
                    obj.cantfactura = int.Parse(row["CAN.FACTURA"].ToString());
                    obj.cantingresada = int.Parse(row["CAN.INGRESADA"].ToString());
                    obj.cantdevuelta = int.Parse(row["CAN.DEVUELTA"].ToString());
                    obj.estado = row["ESTADO"].ToString();
                    obj.uma = (row["UMA"].ToString());
                    obj.ump = (row["UMP"].ToString());
                    obj.laboratorio = (row["LABORATORIO"].ToString());
                    obj.tipo = (row["TIPOITEM"].ToString());
                    obj.equivalencia = decimal.Parse(row["EQUIVALENCIA"].ToString());

                    lista.Add(obj);
                }
                cnn.Close();
                return lista;
            }
            catch (Exception )
            {
                return new List<PIPreingresoDetalle>();
            }

        }
        public DataTable get10ultimaspreingresos(string proveedor, int producto,string empresa)
        {
            if (proveedor is null)
                proveedor = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Preingreso.SP_ULTIMOS_10_PREINGRESOS", cnn);
                //CAMBIOS SEMANA3
                cmm = new SqlCommand("Preingreso.SP_ULTIMOS_10_PREINGRESOS_v2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@PROVEEDOR", proveedor);
                cmm.Parameters.AddWithValue("@EMPRESA", empresa);
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "10 ULTIMOS PREINGRESOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public DataTable getbonificacionxfactura(int idfactura,string tipo)
        {
           
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_GET_BONIFICACIONES_X_FACTURA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@idfactura", idfactura);
                cmm.Parameters.AddWithValue("@tipobonificacion",tipo );

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BONIFICACION DE FACTURA";

                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public List<string> getPreingresoCompletoImprimir(int id)
        {
            var data = getPreingresoCompleto(id);
            List<string> lista = new List<string>();
            foreach (DataRow item in data.Rows)
            {
                lista.Add(item["CABECERA"].ToString());
                lista.Add(item["DETALLE"].ToString());
            }
            return lista;
        }
        public List<string> getPreingresoCompletoPorFacturaImprimir(int id)
        {
            var data = getPreingresoCompletoPorFactura(id);
            List<string> lista = new List<string>();
            foreach (DataRow item in data.Rows)
            {
                lista.Add(item["CABECERA"].ToString());
                lista.Add(item["DETALLE"].ToString());
            }
            return lista;
        }

        public DataTable guardarpdfpreingreso(int idfactura, string tipo)
        {

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_GET_BONIFICACIONES_X_FACTURA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@idfactura", idfactura);
                cmm.Parameters.AddWithValue("@tipobonificacion", tipo);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BONIFICACION DE FACTURA";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        //CODIGO PARA EL LISTADO DE DOCUMENTOS 

        public DataTable getBuscarDocuLote(string txtcodpreingreso, string txtcodigororden, string txtidlote, string txtestadolote)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("preingreso.ListaDocumentoLista", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGOPREINGRESO", txtcodpreingreso ?? "");
                cmm.Parameters.AddWithValue("@CODIGOORDEN", txtcodigororden ?? "");
                cmm.Parameters.AddWithValue("@lote", txtidlote ?? "");
                cmm.Parameters.AddWithValue("@estado", txtestadolote ?? "");
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "doc lotepreingreso";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        public DataTable getlistaDatoDocumentosLote(int idloteeditar)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_listarDocumentosDriveLote", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idlotedocu", idloteeditar);
     
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "doc lotepreingreso";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        /// EDITAR ACHIVO DRIVE, se hizo una PARTE EN ADO

        public DataTable editarDocumentosLote( int idprevizualizacionarchivo,int idempleado, string nombredocu, string codigoarchivodrive, string linkpreview)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_EditarDocumentoDrive", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddocumentoDrive", idprevizualizacionarchivo);
                cmm.Parameters.AddWithValue("@usumodi", idempleado);
                cmm.Parameters.AddWithValue("@nombrearchivo", nombredocu);
                cmm.Parameters.AddWithValue("@codigoarchivo", codigoarchivodrive);
                cmm.Parameters.AddWithValue("@previzualizacionarchivo", linkpreview);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "doc lotepreingreso";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //VALIDAR DATOS
        public DataTable validardocuemntoloteexistente(string codigolote, string iddetallepreingreso, int idproducto)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_listaDocumentosexistentesdrive", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@codigolote", codigolote);
                cmm.Parameters.AddWithValue("@iddetallepreingreso", iddetallepreingreso);
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
          
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "doc lotepreingreso";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable guardarDocumentopdfbd(DocumentosGuardadosDrive detalles)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.sp_GuardarDocumentoDrive", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idLote", detalles.idlote);
                cmm.Parameters.AddWithValue("@usuCrea", detalles.usucrea);
                cmm.Parameters.AddWithValue("@usuModi", detalles.usumodi);
                cmm.Parameters.AddWithValue("@nombreCarpeta", detalles.nombrecarpeta);
                cmm.Parameters.AddWithValue("@codigoCarpeta", detalles.codigocarpeta);
                cmm.Parameters.AddWithValue("@nombreArchivo", detalles.nombrearchivo);
                cmm.Parameters.AddWithValue("@codigoArchivo", detalles.nombrecarpeta);
                cmm.Parameters.AddWithValue("@previzualizacionArchivo", detalles.previzualizacionarchivo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "Lista tabla";

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
