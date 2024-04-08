using ENTIDADES.delivery;
using ENTIDADES.Generales;
using ENTIDADES.produccion;
using ENTIDADES.ventas;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ENTIDADES.pedidos
{
    [Table("Pedido")]

    public class Pedido : AuditoriaColumna
    {
        [Key]
        [Column("pedido_codigo")]
        public int idpedido { get; set; }              
        public string estado { get; set; }
        public string observacion { get; set; }
        public int? laboratoriotransfiere { get; set; }
        public string laboratorio { get; set; }      
        public int? sucursalregistra { get; set; }
        public int IdLineaAtencion { get; set; }
        public int? idtipoventa { get; set; }

        public DateTime? fechafin { get; set; }
        public DateTime? fecha { get; set; }
        public DateTime? fechaproduccion { get; set; }
        public DateTime? fechatransferencia { get; set; }
        public DateTime? fechaentregado { get; set; }
        public DateTime? fechafacturacion { get; set; }
        
        [Column("nroPedidoLocal")]
        public string codpedido { get; set; }
        public string ordenproduccion { get; set; }
        public string numboleta { get; set; }
        public int? usuarioentrega { get; set; }
        public int? usuariotransfiere { get; set; }
        public int? usuariolaboratorio { get; set; }
        public int? usuarioformulador { get; set; }
        public string tiporegistro { get; set; }
        public int facturado { get; set; }
        public int? idrepmedico { get; set; }

        [Column("cliTercero_codigo")]
        public int? idcliente { get; set; }
        [Column("idtipopagof")]
        public int? idtipopago { get; set; }
        [Column("cli_codigo")]
        public int? idpaciente { get; set; }
        [Column("tipopaciente_codigo")]
        public int? idtipopaciente { get; set; }
        [Column("tipopedido_codigo")]

        public int? idtipopedido { get; set; }
        [Column("origenreceta_codigo")]
        public int? idorigenreceta { get; set; }     
        public string idtipoformulacion { get; set; }
        [Column("diagnostico_codigo")]
        public int? iddiagnostico { get; set; }
        [Column("estadoPedido")]
        public string idestado { get; set; }
        public string estadoED { get; set; }
        [Column("suc_codigo")]
        public int? sucursalfactura { get; set; }

        [Column("canalventa")]
        public string idcanalventas { get; set; }
        [Column("med_codigo")]
        public int? idmedico { get; set; }
        [Column("emp_codigo")]
        public int? idempleado { get; set; }
        public double? total { get; set; }
        public double? adelanto { get; set; }
        public double? saldo { get; set; }
        public decimal? pkdescuento { get; set; }//EARTCOD1009

        [ForeignKey("idmedico")]
        public Medico medico { get; set; }
        [ForeignKey("idcanalventas")]
        public CanalVenta canalventa { get; set; }
        [ForeignKey("sucursalregistra")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idestado")]
        public EstadoPedido estadopedido { get; set; }
        [ForeignKey("iddiagnostico")]
        public Diagnostico diagnostico { get; set; }
        [ForeignKey("idtipoformulacion")]
        public TipoFormulacion tipoformulacion { get; set; }
        [ForeignKey("idorigenreceta")]
        public OrigenReceta origenreceta { get; set; }
        [ForeignKey("idtipopedido")]
        public TipoPedido tipopedido { get; set; }
        [ForeignKey("idtipopaciente")]
        public TipoPaciente tipopaciente { get; set; }
        [ForeignKey("idpaciente")]
        public Paciente paciente { get; set; }
         [ForeignKey("idcliente")]
        public Cliente cliente { get; set; }
       
        [NotMapped]
        public string jsondetalle { get; set; }
        [NotMapped]
        public bool descuento { get; set; }

    }
}
