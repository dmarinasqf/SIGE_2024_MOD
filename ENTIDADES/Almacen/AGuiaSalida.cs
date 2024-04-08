using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("GuiaSalida", Schema = "Almacen")]
  public  class AGuiaSalida : AuditoriaColumna
    {
	
        [Key]
        public long idguiasalida { get; set; }
        public string codigo { get; set; }
        public DateTime fechatraslado { get; set; }
        public int idsucursal { get; set; }
        public int idalmacensucursalorigen { get; set; }
        public int? idalmacensucursaldestino { get; set; }
        public int idsucursaldestino { get; set; }
        public int idcaja { get; set; }
        public int idcorrelativo { get; set; }       
        public int idempresa { get; set; }        
        public string seriedoc { get; set; }        
        public string numdoc { get; set; }        
        public string estado { get; set; }        
        public string estadoguia { get; set; }        
        public int ano { get; set; }
        public string observacion { get; set; }
        public int? idempresatransporte { get; set; }
        public int? idvehiculo { get; set; }
        public string idempleadoaudita { get; set; }
        public string idempleadomantenimiento { get; set; }
        public int? idproveedor { get; set; }
        public int? idtipoguia { get; set; }
        public int? idventa { get; set; }
        public decimal? peso_total { get; set; }
        public decimal? bultos { get; set; }

        [ForeignKey("idempresa")]
        public Empresa empresa { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [NotMapped]
        public EMPLEADO empleado { get; set; }
        [NotMapped]
        public string jsondetalle { get; set; }

        //variables notmapped
        [NotMapped]
        public string encargado  { get; set; }
        [NotMapped]
        public string sucursaldestino  { get; set; }
        public int? IdDistribucion { get; set; }
        public int? idcliente { get; set; }
    }
}
