namespace ENTIDADES.gdp
{
    using ENTIDADES.Generales;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("INGRESOS")]
    public class INGRESOS
    {
        [Key]
        public int ingresos_codigo { get; set; }

        public double? totalventas { get; set; }

        public double? ventaacredito { get; set; }
        public DateTime? fecha { get; set; }
        public DateTime? fechasistema { get; set; }

        public double? ventaefectivo { get; set; }

        public double? ingresoVISANET { get; set; }
        public double? ingresoMASTERCARD { get; set; }
        public double? ingresoDINNERSCLUB { get; set; }
        public double? ingresoAMERICANEXPRESS { get; set; }
        public double? totaltarjetas { get; set; }
        public double? adelantodia { get; set; }
        public double? adelantoayer { get; set; }
        public int? suc_codigo { get; set; }

        public int? emp_codigo { get; set; }

        [MaxLength(20)]
        public string estado { get; set; }
        public int? usuarioedita { get; set; }
        public DateTime? fechaEditacion { get; set; }

        [ForeignKey(nameof(emp_codigo))]
        public virtual EMPLEADO empleado { get; set; }
        [ForeignKey(nameof(suc_codigo))]
        public virtual SUCURSAL sucursal { get; set; }

        //NOT MAPPED

        [NotMapped]
        public string nombreempleado { get; set; }
        [NotMapped]
        public string nombresucursal { get; set; }

    }
}
