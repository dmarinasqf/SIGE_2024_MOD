using ENTIDADES.compras;
using ENTIDADES.gdp;
using ENTIDADES.preingreso;
using ERP.Models;
using System;
using System.Collections.Generic;
using System.Data;

using System.Linq;
using System.Threading.Tasks;

namespace ERP.Areas.PreIngreso.Data
{
    public class ControlCalidadDAO
    {
        //private readonly Modelo db;
        //SqlConnection cnn;
        //SqlDataReader leer;
        //SqlCommand cmm;
        //public ControlCalidadDAO(Modelo context)
        //{
        //    db = context;
        //}       
        

     /*
        public DataTable getPreingresos(string preingreso, string idempresa, string idproveedor, string estado, int sucursal)
        {
            if (preingreso is null)
                preingreso = "";
            if (idproveedor is null)
                idproveedor = "";
            if (estado is null)
                estado = "";            
            try
            {
                //CadenaConeccion cadena = new CadenaConeccion();
                //cnn = new SqlConnection();
                //cnn.ConnectionString = cadena.GetConnectionString();
                //cnn.Open();
                //cmm = new SqlCommand("Preingreso.SP_LISTAR_PREINGRESOS", cnn);
                //cmm.CommandType = CommandType.StoredProcedure;

                //cmm.Parameters.AddWithValue("@CODIGO", preingreso);
                //cmm.Parameters.AddWithValue("@EMPRESA", idempresa);
                //cmm.Parameters.AddWithValue("@PROVEEDOR", idproveedor);
                //cmm.Parameters.AddWithValue("@ESTADO", estado);
                //cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                DataTable tabla = new DataTable();
                //SqlDataAdapter da = new SqlDataAdapter(cmm);
                //da.Fill(tabla);
                tabla.TableName = "PREINGRESOS";
                
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public PIPreingreso getCabecera(int id)
        {
            try
            {
                //CadenaConeccion cadena = new CadenaConeccion();
                //cnn = new SqlConnection();
                //cnn.ConnectionString = cadena.GetConnectionString();
                //cnn.Open();
                //cmm = new SqlCommand("Preingreso.SP_BUSCAR_CABECERA_PREINGRESO", cnn);
                //cmm.CommandType = CommandType.StoredProcedure;
                //cmm.Parameters.AddWithValue("@ID", id);
                //DataTable tabla = new DataTable();
                //SqlDataAdapter da = new SqlDataAdapter(cmm);
                //da.Fill(tabla);
                //tabla.TableName = "CABECERA PREINGRESO";

                PIPreingreso obj = new PIPreingreso();
                //foreach (DataRow row in tabla.Rows)
                //{
                //    obj = new PIPreingreso();
                //    obj.idpreingreso = int.Parse(row["ID"].ToString());
                //    obj.codigopreingreso = (row["CODIGO"].ToString());
                //    obj.estado = (row["ESTADO"].ToString());
                //    obj.idempresa = row["ID EMPRESA"].ToString();
                //    obj.fecha = DateTime.Parse(row["FECHA"].ToString());
                //    obj.fechadoc = DateTime.Parse(row["FECHA DOC"].ToString());
                //    obj.seriedoc = (row["SERIEDOC"].ToString());
                //    obj.numerodoc = (row["NUMERODOC"].ToString());
                //    obj.quimico = (row["QUIMICO"].ToString());
                //    obj.obs = (row["OBS"].ToString());
                //    obj.observacion = (row["OBSERVACION"].ToString());
                //    obj.rechazadoporerror = bool.Parse(row["RECHAZADO"].ToString());
                //    obj.proveedor = new CProveedor { 
                //    razonsocial = (row["PROV. RAZONSOCIAL"].ToString()),
                //    ruc = (row["PROV. RUC"].ToString()),
                //    idproveedor=int.Parse(row["ID PROV"].ToString())                    
                //    };
                //    obj.moneda = new CMoneda
                //    {
                //       nombre= (row["MONEDA"].ToString()),
                //       tipodecambio= double.Parse(row["MONEDACAMBIO"].ToString())
                //    };
                //    obj.condicionpago = new CCondicionPago
                //    {
                //        descripcion= (row["CONDICION PAGO"].ToString())
                //    };
                //    obj.empleado = (row["EMPLEADO NOMBRES"].ToString());
                //    obj.sucursal = new SUCURSAL { 
                //        suc_codigo= int.Parse(row["IDSUCURSAL"].ToString()),
                //        descripcion = (row["SUCURSAL"].ToString())
                //    };
                //    obj.idsucursal = int.Parse(row["IDSUCURSAL"].ToString());
                //    obj.orden = new COrdenCompra {
                //    idordencompra= int.Parse(row["IDORDEN"].ToString()),
                //    codigoorden= (row["CODIGOOREDEN"].ToString()),
                //    estado= (row["ESTADOORDEN"].ToString()),
                //    fecha= DateTime.Parse(row["FECHAORDEN"].ToString())
                //    };
                //}
                //cnn.Close();
                return obj;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public List<PIPreingresoDetalle> getDetalle(int id)
        {
            try
            {
                //CadenaConeccion cadena = new CadenaConeccion();
                cnn = new SqlConnection();
                //cnn.ConnectionString = cadena.GetConnectionString();
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
                    //obj.producto = new CProducto { 
                    //    idproducto = int.Parse(row["IDPRODUCTO"].ToString()),
                    //    nombre= row["PRODUCTO"].ToString(),
                    //    codigoproducto= row["CODPRODUCTO"].ToString(),
                    //    idtipoproducto= row["TIPOPRODUCTO"].ToString()
                    //};
                    obj.idproductopro = int.Parse(row["IDPRODPROV"].ToString());
                    obj.productopro = new CProductoProveedor { 
                        idproductoproveedor= int.Parse(row["IDPRODPROV"].ToString()),
                        descripcion= row["PROPROV"].ToString(),
                        codproductoproveedor= row["CODPROPOROV"].ToString()
                    };

                    obj.cantoc = int.Parse(row["CANTIDADCOTI"].ToString());
                    obj.cantfactura = int.Parse(row["CAN.FACTURA"].ToString());
                    obj.cantingresada = int.Parse(row["CAN.INGRESADA"].ToString());
                    obj.cantdevuelta = int.Parse(row["CAN.DEVUELTA"].ToString());
                    obj.estado =row["ESTADO"].ToString();
                    obj.uma = (row["UMA"].ToString());
                    obj.ump = (row["UMP"].ToString());
                    obj.laboratorio= (row["LABORATORIO"].ToString());
                    obj.equivalencia=decimal.Parse (row["EQUIVALENCIA"].ToString());

                    lista.Add(obj);              
                }
                cnn.Close();
                return lista;
            }
            catch (Exception e)
            {
                return null;
            }

        }
        */
      
    }
}
