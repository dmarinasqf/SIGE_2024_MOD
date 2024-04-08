using ENTIDADES.Almacen;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class SalidaTransferenciaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public SalidaTransferenciaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public async Task<mensajeJson> GetListaSalidaTransferencia(string codigo, string idsucursalorigen, string idsucursaldestino, 
            string fechainicio, string fechafin, string estado, int top)
        {
            try
            {
                var data = await Task.Run(()=> {
                    return getTablaSalidaTransferencia(codigo, idsucursalorigen, idsucursaldestino, fechainicio,fechafin, estado,top);                     
                });
                return data;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> GetSalidaTransferenciaPorCargar(string codigo, string idsucursalorigen, string idsucursaldestino,  string estado)
        {
            try
            {
                var data = await Task.Run(()=> {
                    return getTablaSalidaTransferenciaPorCargar(codigo, idsucursalorigen, idsucursaldestino, estado);
                     
                });
                return data;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }

        public async Task<mensajeJson> getSalidaTransferenciaCompleta(string id)
        {          
            try
            {
                var data = await Task.Run(()=> {
                    if (id == "" || id is null)
                        return (new mensajeJson("nuevo", new DataTable()));
                    var data = getTablaSalidaTransferenciaCompleta(id);
                    if (data.mensaje == "ok")
                        return data;
                    else
                        return (new mensajeJson("notfound", JsonConvert.SerializeObject(new DataTable())));
                });
                return data;

            }
            catch (Exception e)
            {
                string msjinner = "";
                if (e.InnerException.Message != null)
                    msjinner = e.InnerException.Message;
                return new mensajeJson(e.Message+"-"+ msjinner, new DataTable());
            }
        }     
        
        public mensajeJson getTablaSalidaTransferencia(string codigo, string idsucursalorigen, string idsucursaldestino, string fechainicio,string fechafin, string estado,int top)
        {
            if (codigo == null)
                codigo = "";
            if (idsucursalorigen == null)
                idsucursalorigen = "";
            if (idsucursaldestino == null)
                idsucursaldestino = "";
            if (fechainicio == null) fechainicio = "";
            if (fechafin == null) fechafin = "";
            if (estado == null) estado = "";
            if (top == 0) top = 9999;

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETSALIDATRANSFERENCIA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@SUCURSALORIGEN", idsucursalorigen);
                cmm.Parameters.AddWithValue("@SUCURSALDESTINO", idsucursaldestino);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SALIDA TRANSFERENCIA";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                string msjinner = "";
                if (e.InnerException != null)
                    msjinner = e.InnerException.Message;
                return new mensajeJson(e.Message + '-' + msjinner, JsonConvert.SerializeObject(new DataTable()));
            }
        }
        public mensajeJson getTablaSalidaTransferenciaPorCargar(string codigo, string idsucursalorigen, string idsucursaldestino, string estado)
        {
            if (codigo == null)
                codigo = "";
            if (idsucursalorigen == null)
                idsucursalorigen = "";
            if (estado == null)
                estado = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETSALIDATRANSFERENCIAPORCARGAR", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@SUCURSALORIGEN", idsucursalorigen);
                cmm.Parameters.AddWithValue("@SUCURSALDESTINO", idsucursaldestino);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA TRANSFERENCIAS POR CARGAR";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                string msjinner = "";
                if (e.InnerException != null)
                    msjinner = e.InnerException.Message;                
                return new mensajeJson(e.Message+'-'+ msjinner, JsonConvert.SerializeObject(new DataTable()));
            }
        }
        public mensajeJson getTablaSalidaTransferenciaCompleta(string id)
        {
            if (id == null)
                id = "";

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETSALIDATRANSFERENCIACOMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SALIDA TRANSFERENCIA COMPLETA";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception)
            {
                return new mensajeJson("ok", JsonConvert.SerializeObject(new DataTable()));
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
                cmm = new SqlCommand("Almacen.SP_GETSALIDASTRANSFERENCIAIMPRESION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA TRANSFERENCIA";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable getSalidaTransferenciaImpresion(string id)
        {
            if (id == null)
                id = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETSALIDATRANSFERENCIAIMPRESION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA TRANSFERENCIA";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public async Task<mensajeJson> sp_registrarSalidaTransferencia(ASalidaTransferencia oSalidaTransferencia, int numelementos)
        {
            try
            {
                if (oSalidaTransferencia.observacion is null) oSalidaTransferencia.observacion = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_RegistrarSalidaTransferencia", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechatraslado", oSalidaTransferencia.fechatraslado);
                cmm.Parameters.AddWithValue("@idsucursal", oSalidaTransferencia.idsucursal);
                cmm.Parameters.AddWithValue("@idalmacensucursalorigen", oSalidaTransferencia.idalmacensucursalorigen);
                cmm.Parameters.AddWithValue("@idsucursaldestino", oSalidaTransferencia.idsucursaldestino);
                cmm.Parameters.AddWithValue("@idempresa", oSalidaTransferencia.idempresa);
                cmm.Parameters.AddWithValue("@idcajasucursal", oSalidaTransferencia.idcajasucursal);
                cmm.Parameters.AddWithValue("@idcorrelativo", oSalidaTransferencia.idcorrelativo);
                cmm.Parameters.AddWithValue("@seriedoc", oSalidaTransferencia.seriedoc);
                cmm.Parameters.AddWithValue("@numdoc", oSalidaTransferencia.numdoc);
                cmm.Parameters.AddWithValue("@estado", oSalidaTransferencia.estado);
                cmm.Parameters.AddWithValue("@estadoguia", oSalidaTransferencia.estadoguia);
                cmm.Parameters.AddWithValue("@observacion", oSalidaTransferencia.observacion);
                cmm.Parameters.AddWithValue("@idempresatransporte", oSalidaTransferencia.idempresatransporte);
                cmm.Parameters.AddWithValue("@idvehiculo", oSalidaTransferencia.idvehiculo);
                cmm.Parameters.AddWithValue("@idtipomovimiento", oSalidaTransferencia.idtipomovimiento);
                cmm.Parameters.AddWithValue("@usuariocrea", oSalidaTransferencia.usuariocrea);
                cmm.Parameters.AddWithValue("@fechacreacion", oSalidaTransferencia.fechacreacion);
                cmm.Parameters.AddWithValue("@usuariomodifica", oSalidaTransferencia.usuariomodifica);
                cmm.Parameters.AddWithValue("@fechaedicion", oSalidaTransferencia.fechaedicion);
                cmm.Parameters.AddWithValue("@idcodincentcost", oSalidaTransferencia.idcodicentcost);
                cmm.Parameters.AddWithValue("@peso_total", oSalidaTransferencia.peso_total);
                cmm.Parameters.AddWithValue("@bultos", oSalidaTransferencia.bultos);
                cmm.Parameters.AddWithValue("@detallejson", oSalidaTransferencia.jsondetalle);
                cmm.Parameters.AddWithValue("@numelementos", numelementos);
                cmm.Parameters.Add("idsalidatransferencia", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmm.Parameters.Add("mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                int idsalidatransferencia = Convert.ToInt32(cmm.Parameters["idsalidatransferencia"].Value);
                string mensaje = cmm.Parameters["mensaje"].Value.ToString();

                cnn.Close();
                return new mensajeJson(mensaje, idsalidatransferencia);
            }
            catch (Exception e)
            {
                string msjinner = "";
                if (e.InnerException != null)
                    msjinner = e.InnerException.Message;
                return new mensajeJson(e.Message + '-' + msjinner, 0);
            }
        }

        public async Task<mensajeJson> sp_anularSalidaTransferencia(int? idsalidatransferencia)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_AnularSalidaTransferencia", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsalidatransferencia", idsalidatransferencia);
                cmm.Parameters.Add("mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["mensaje"].Value.ToString();
                cnn.Close();

                return new mensajeJson(mensaje, idsalidatransferencia);
            }
            catch (Exception e)
            {
                string msjinner = "";
                if (e.InnerException != null)
                    msjinner = e.InnerException.Message;
                return new mensajeJson(e.Message + '-' + msjinner, 0);
            }
        }
    }
}
