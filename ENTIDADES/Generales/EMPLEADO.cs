using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;

namespace ENTIDADES.Generales
{
    
    [Table("EMPLEADO")]
    public class EMPLEADO : AuditoriaColumna
    {

        public int? suc_codigo { get; set; }

        public string perfil_codigo { get; set; }

        [Key]
        public int emp_codigo { get; set; }

       
        public string nombres { get; set; }

        public string apePaterno { get; set; }

        public string apeMaterno { get; set; }

      
        public string documento { get; set; }

        public string estado { get; set; }

        public string userName { get; set; }

        public string clave { get; set; }
        public string email { get; set; }
        public string celular { get; set; }
        public string foto { get; set; }

        public Task ToListAsync()
        {
            throw new NotImplementedException();
        }

        public bool? permitirDescuentoTeste { get; set; }
       
        public int? idgrupo { get; set; }
        public int? idcargo { get; set; }
   


        [NotMapped]
        public string local { get; set; }
        [NotMapped]
        public string grupo { get; set; }
        [NotMapped]
        public List<string> CanalVentas { get; set; }
        [NotMapped]

        public List<int> Sucursales { get; set; }

        [ForeignKey(nameof(suc_codigo))]
        public  SUCURSAL sucursal { get; set; }
        //[ForeignKey(nameof(emp_codigo))]
        //public virtual USUARIO usuario { get; set; }
    }
}
