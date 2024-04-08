using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class AlmacenTransferenciaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public AlmacenTransferenciaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public async Task<mensajeJson> GetListaAlmacenTransferencia(string numdocumento, int idalmacensucursalorigen, int idalmacensucursaldestino, string estado, string fechainicio, string fechafin)
        {
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return getListaAlmacenTransferenciaSP(numdocumento, idalmacensucursalorigen, idalmacensucursaldestino, estado, fechainicio, fechafin);
                });
                return tarea;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        private mensajeJson getListaAlmacenTransferenciaSP(string numdocumento, int idalmacensucursalorigen, int idalmacensucursaldestino, string estado, string fechainicio, string fechafin)
        {
            try
            {
                if (numdocumento is null) numdocumento = "";
                if (estado is null) estado = "";
                if (fechainicio is null) fechainicio = "";
                if (fechafin is null) fechafin = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_listar_almacen_transferencia", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@numdocumento", numdocumento);
                cmm.Parameters.AddWithValue("@idalmacensucursalorigen", idalmacensucursalorigen);
                cmm.Parameters.AddWithValue("@idalmacensucursaldestino", idalmacensucursaldestino);
                cmm.Parameters.AddWithValue("@estado", estado);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA ALMACEN TRANSFERENCIA";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
            }
        }


        public async Task<mensajeJson> GetStockLoteProductoPorAlmacenSucursal(int idalmacensucursal, string codigo, string nombre, string lote)
        {
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return getStockLoteProductoPorAlmacenSucursalSP(idalmacensucursal, codigo, nombre, lote);
                });
                return tarea;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        private mensajeJson getStockLoteProductoPorAlmacenSucursalSP(int idalmacensucursal, string codigo, string nombre, string lote)
        {
            try
            {
                if (codigo is null) codigo = "";
                if (nombre is null) nombre = "";
                if (lote is null) lote = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.Buscar_StockLoteProducto_Por_AlmacenSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idalmacensucursal", idalmacensucursal);
                cmm.Parameters.AddWithValue("@codigo", codigo);
                cmm.Parameters.AddWithValue("@nombre", nombre);
                cmm.Parameters.AddWithValue("@lote", lote);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA STOCKLOTEPRODUCTO";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
            }
        }

        public async Task<mensajeJson> GetAlmacenTransferenciaCompleto(int id)
        {
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return getAlmacenTransferenciaCompletoSP(id);
                });
                return tarea;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        private mensajeJson getAlmacenTransferenciaCompletoSP(int id)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_buscar_almacen_transferencia_completo", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idalmacentransferencia", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ALMACEN TRANSFERENCIA";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
            }
        }
    }
}
