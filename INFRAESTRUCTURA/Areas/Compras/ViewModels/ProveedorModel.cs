using ENTIDADES.Almacen;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.ViewModels
{
    public class ProveedorModel
    {
        public List<FMoneda> monedas { get;  set; }
        public List<Pais> pais { get;  set; }
        public List<FBanco> bancos { get;  set; }
        public List<FCondicionPago> condicionpago { get;  set; }
    }
}
