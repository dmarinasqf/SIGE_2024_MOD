using ENTIDADES.Vinali;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.App.Vinali.procedimiento.dao
{
    public class ProcedimientoDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public ProcedimientoDAO(string cadena_)
        {
            cadena = cadena_;
        }
        public string setListaProcedimiento(TipoDeProcedimiento pro)
        {//PEDIDOS DEL DIA
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_REGISTRARLISTAPROCEDIMIENTOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@CODIGO", pro.codigo);
                cmm.Parameters.AddWithValue("@ARTICULO", pro.descripcion);
                cmm.Parameters.AddWithValue("@PRECIO", pro.costo);
                cmm.Parameters.AddWithValue("@SUCURSAL", pro.suc_codigo);
                leer = cmm.ExecuteReader();
                string respuesta = "";
                if (leer.Read())
                    respuesta = leer.GetString(0);
                cnn.Close();
                leer.Close();
                return respuesta;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        public List<Procedimientos> getProcedimientos(string fechainicio, string fechafin, string sucursal, string perfil, string empleado)
        {
            try
            {
                if (fechafin == null || fechafin == "")
                    fechafin = DateTime.Now.ToShortDateString();
                if (fechainicio == null || fechainicio == "")
                    fechainicio = DateTime.Now.ToShortDateString();
                if (sucursal == null)
                    sucursal = "";
                if (empleado == null || empleado == "")
                    empleado = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_LISTARPROCEDIMIENTOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@PERFIL", perfil);
                cmm.Parameters.AddWithValue("@EMPCONSULTA", empleado);

                leer = cmm.ExecuteReader();
                List<Procedimientos> listProcedimientos = new List<Procedimientos>();
                Procedimientos procedimiento;
                while (leer.Read())
                {
                    procedimiento = new Procedimientos();
                    procedimiento.procedimiento_codigo = leer.GetInt32(0);
                    procedimiento.fecha = leer.GetDateTime(1);
                    procedimiento.numDocumento = leer.GetString(2);
                    procedimiento.total = leer.GetDouble(3);
                    procedimiento.suc_codigo = leer.GetInt32(4);
                    procedimiento.nombresucursal = leer.GetString(5);
                    procedimiento.cli_codigo = leer.GetInt32(6);
                    procedimiento.nombrecliente = leer.GetString(7);
                    procedimiento.med_codigo = leer.GetInt32(8);
                    procedimiento.nombremedico = leer.GetString(9);
                    //procedimientoModel.procedimiento = procedimiento;
                    ////
                    //using (Modelo db = new Modelo())
                    //{
                    //    var detalle = db.DETALLEPROCEDIMIENTO.Where(x => x.procedimiento_codigo == procedimiento.procedimiento_codigo).ToList();
                    //    procedimientoModel.detalleProcedimiento = detalle;
                    //}

                    listProcedimientos.Add(procedimiento);
                }
                cnn.Close();
                leer.Close();
                return listProcedimientos;
            }
            catch (Exception e)
            {
                return new List<Procedimientos> ();
            }
        }
    }
}
