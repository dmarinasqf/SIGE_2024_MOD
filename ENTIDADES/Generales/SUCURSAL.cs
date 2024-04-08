using ENTIDADES.gdp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.Generales
{
    

    [Table("SUCURSAL")]
    public class SUCURSAL:AuditoriaColumna
    {
        

        [Key]
        public int suc_codigo { get; set; }

        public int? idempresa { get; set; }
        public string descripcion { get; set; }
        public string direccion { get; set; }
        public string tipoSucursal { get; set; }
        public int labasignado { get; set; }
        public string serie { get; set; }      
        public string estado { get; set; }     
        public string gerenteSucursal { get; set; }  
        public string CQFP { get; set; }
        //SI ES 0 ES POR CAMPAÑA
        public int? nConsultorios { get; set; }    
        public string tipoem_codigo { get; set; }
        public string impresora { get; set; }
        public string codigoestablecimiento { get; set; }
        public int? idlugar { get; set; }      
        public string idadesy { get; set; }
        public int? idprovincia { get; set; }
        public int? iddistrito { get; set; }
        public int? iddepartamento { get; set; }
        public bool? issucursalentrega { get; set; }
        public bool? isprimario { get; set; }
        public string coddigemid { get; set; }
        public string telefono { get; set; }
        public string celular { get; set; }
        public string centrocosto { get; set; }
        public bool? generaguia { get; set; }

        [ForeignKey("idprovincia")]
        public PROVINCIA provincia { get; set; }
        [ForeignKey("iddistrito")]
        public DISTRITO distrito { get; set; }
        [ForeignKey("iddepartamento")]
        public DEPARTAMENTO departamento { get; set; }


        [NotMapped]
        public string nombreLaboratorio { get; set; }
        [NotMapped]
        public string ciudad { get; set; }
        [NotMapped]
        public string conSupervisor { get; set; }
        [NotMapped]
        public string empresa { get; set; }
        [NotMapped]
        public List<int> idlaboratorios { get; set; }
        [NotMapped]
        public List<int> idcajas { get; set; }
        [NotMapped]
        public List<int?> idlistas { get; set; }
        [NotMapped]
        public string lugar { get; set; }

    }
}
