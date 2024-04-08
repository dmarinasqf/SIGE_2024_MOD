using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Maestros.INTERFAZ;
using Erp.Persistencia.Modelos;
using Erp.SeedWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.EF
{
    public class ClienteEF:IClienteEF
    {
        private readonly Modelo db;
        public ClienteEF(Modelo _db)
        {
            db = _db;
        }
        //para modal de registro 
        public mensajeJson RegistrarEditar(Cliente cliente)
        {
            var oClienteValidar = db.CLIENTE.Where(x => x.nrodocumento == cliente.nrodocumento).FirstOrDefault();
            if (oClienteValidar is null || oClienteValidar == null)
            {
                cliente.idcliente = 0;
                cliente.estado = "HABILITADO";
                db.Add(cliente);
                db.SaveChanges();
                return new mensajeJson("ok", cliente);
            }
            else
            {
                cliente.idcliente = oClienteValidar.idcliente;
                cliente.estado = "HABILITADO";
                db.Update(cliente);
                db.SaveChanges();
                return new mensajeJson("ok", cliente);
            }
            //var auxcliente = db.CLIENTE.Where(x => x.nrodocumento == cliente.nrodocumento).ToList().LastOrDefault();
            //if (cliente.idcliente is 0)
            //{
            //    if (auxcliente is null)
            //    {
            //        cliente.estado = "HABILITADO";
            //        db.Add(cliente);
            //        db.SaveChanges();
            //        return new mensajeJson("ok", cliente);
            //    }
            //    else
            //        return new mensajeJson("El número de documento ya ha sido registrado", null);
            //}
            //else
            //{
            //    if (auxcliente is null)
            //    {
            //        cliente.idcliente = 0;
            //        cliente.estado = "HABILITADO";
            //        db.Add(cliente);
            //        db.SaveChanges();
            //        return new mensajeJson("ok", cliente);
            //    }
            //    else
            //    {
            //        if (auxcliente.idcliente == cliente.idcliente)
            //        {
            //            cliente.estado = "HABILITADO";
            //            db.Update(cliente);
            //            db.SaveChanges();
            //            return new mensajeJson("ok", cliente);
            //        }
            //        else

            //            return new mensajeJson("El cliente ya se encuentra registrado", null);
            //    }
            //}
        }
        public Cliente BuscarCliente(string nrodocumento)
        {
            var cliente = db.CLIENTE.Where(x=>x.nrodocumento== nrodocumento).FirstOrDefault();
            if (cliente is null) return null;
            if (cliente.apematerno is null) cliente.apematerno = "";
            if (cliente.apepaterno is null) cliente.apepaterno = "";
            
            return cliente;
        }
        public async Task<object> BuscarClientesAsync(string filtro)
        {
            if (filtro is null) filtro = "";
            var data = await db.CLIENTE.Where(x => x.estado == "HABILITADO" && (x.nrodocumento.Contains(filtro) || (x.descripcion + ' ' + x.apepaterno + ' ' + x.apematerno).Contains(filtro))).Select(x => new {
                idcliente = x.idcliente,
                nombres= $"{x.descripcion} {x.apepaterno??""} {x.apematerno??""}",
                x.direccion,
                numdocumento= x.nrodocumento
            }).Take(20).ToListAsync();
            return data;
        }

        public mensajeJson BuscarClientebyId(int idcliente)
        {
            try
            {
                var cliente = db.CLIENTE.Find(idcliente);
                if (cliente is null)
                    return new mensajeJson("No existe cliente", null);
                if (cliente.apematerno is null) cliente.apematerno = "";
                if (cliente.apepaterno is null) cliente.apepaterno = "";
                return new mensajeJson("ok", cliente);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);

            }

        }
    }
}
