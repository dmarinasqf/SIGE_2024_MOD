using ENTIDADES.preingreso;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
    public interface  IBonificacionFueraDocumentoEF
    {
        public mensajeJson RegistrarEditar(List<PIDetalleBonificacionFueraDocumento> bonificacion,string cmm);
    }
}
