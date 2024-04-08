using ENTIDADES.Almacen;
using ENTIDADES.Finanzas;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.PreIngreso.ViewModel
{
    public class PreingresoModel
    {
        public List<FDocumentoTributario> documentos { get;  set; }
        public string quimicolocal { get;  set; }
        public List<AAreaAlmacen> almacenes { get;  set; }
    }
}
