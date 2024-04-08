using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.Http;
namespace ENTIDADES.preingreso
{
    [Table("Lote", Schema = "PreIngreso")]
    public class PILote : AuditoriaColumna
    {
        public PILote()
        {
            lote = "";
            registrosanitario = "";
            nprescripcion = "";
            vigencia = "";
            observacion = "";
            estado = "HABILITADO";
        }
        public int? iddetallepreingreso { get; set; }
        [Key]
        public int idlote { get; set; }
        public int cantidad { get; set; }
        public string lote { get; set; }       
        public DateTime? fechavencimiento { get; set; }
        public string registrosanitario { get; set; }
        public string nprescripcion { get; set; }
        public string vigencia { get; set; }
        public string observacion { get; set; }
        public string estado { get; set; }
        [NotMapped]
        public int? idproducto { get; set; }     
        [NotMapped]//para agregar la promocion de cliente
        public string promocion { get; set; }        
        [ForeignKey("iddetallepreingreso")]
        public PIPreingresoDetalle detallepreingreso { get; set; }

        // SUBIR LOS ARCHIVOS
        [NotMapped]
        public string nomcodcarpeta { get; set; }
        [NotMapped]//para agregar la promocion de cliente
        public string nomcoddocumento { get; set; }
    }
}
