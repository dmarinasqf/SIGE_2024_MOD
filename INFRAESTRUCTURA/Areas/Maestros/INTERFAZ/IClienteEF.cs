using ENTIDADES.Generales;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.INTERFAZ
{
    public interface IClienteEF
    {
        public mensajeJson RegistrarEditar(Cliente cliente);
        public Cliente BuscarCliente(string numdocumento);
        public mensajeJson BuscarClientebyId(int idcliente);
        public Task<object> BuscarClientesAsync(string filtro);
    }
}
