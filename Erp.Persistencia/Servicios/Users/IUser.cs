
using ENTIDADES.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Erp.Persistencia.Servicios.Users
{
    public interface IUser
    {
        public string getUserName();
        public string getUserNameAndLast();
        public string getIdUserSession();
        public string getIdSucursalUsuario();
        public AppUser getUsuario();
        public int getIdEmpresaCookie();
        public string getNombreEmpresaCookie();
        public int getIdSucursalCookie();
    }
}
