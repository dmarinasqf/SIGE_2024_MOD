using ENTIDADES;
using ENTIDADES.usuarios;

using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ENTIDADES.compras;

using ENTIDADES.preingreso;
using ENTIDADES.Almacen;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using ENTIDADES.ventas;
using ENTIDADES.comercial;
using ENTIDADES.finanzas;
using ENTIDADES.Vinali;
using ENTIDADES.Transporte;
using ENTIDADES.Identity;
using ENTIDADES.gdp;
using Erp.Persistencia.Servicios.Users;
using ENTIDADES.pedidos;
using ENTIDADES.produccion;
using ENTIDADES.delivery;
using ENTIDADES.veterinaria;
using ENTIDADES.digemid;
using Erp.Entidades.visitadormedico;
using Erp.Entidades.Generales;
using Erp.Entidades.Asistencia;
using Erp.Entidades.delivery;
using Erp.Entidades.comercial;
using Erp.Entidades.pedidos;
using Erp.Entidades.Almacen;

namespace Erp.Persistencia.Modelos
{
    public class Modelo : DbContext
    {
        public DbSet<AspNetUsers> APPUSER { get; set; }
        public DbSet<AppRol> APPROL { get; set; }



        public DbSet<Grupo> GRUPO { get; set; }
        public DbSet<CargoEmpleado> CARGOEMLEADO { get; set; }
        public DbSet<ModulosGrupo> MODULOGRUPO { get; set; }

        public DbSet<EmpleadoSucursal> EMPLEADOSUCURSAL { get; set; }
        //VISITADOR MEDICO

        public DbSet<ObjetivoRepMedico> OBJETIVOREPMEDICO { get; set; }
        public DbSet<RepMedicoMedAsignados> REPMEDICOMEDASIGNADOS { get; set; }
        public DbSet<RepMedicoCliAsignados> REPMEDICOCLIASIGNADOS { get; set; }
        public DbSet<HorarioVisitaMedica> HORARIOVISITAMEDICA { get; set; }

        //DIGEMID

        public DbSet<AlertaDigemid> ALERTADIGEMID { get; set; }

        //ALMACEN 
        public DbSet<APrincipioActivo> PRINCIPIOACTIVO { get; set; }
        public DbSet<ADetallePrincipioActivo> DETALLEPRINCIPIOACTIVO { get; set; }
        public DbSet<AFormaFarmaceutica> FORMAFARMACEUTICA { get; set; }
        public DbSet<ARegistroSanitario> REGISTROSANITARIO { get; set; }
        public DbSet<AProductoDigemid> PRODUCTODIGEMID { get; set; }
        public DbSet<Kardex> KARDEX { get; set; }
        public DbSet<AIngresoManual> AINGRESOMANUAL { get; set; }
        public DbSet<ADetalleIngresoManual> ADETALLEINGRESOMANUAL { get; set; }
        public DbSet<ASalidaManual> ASALIDAMANUAL { get; set; }
        public DbSet<ADetalleSalidaManual> ADETALLESALIDAMANUAL { get; set; }
        public DbSet<AStockLoteProducto> ASTOCKPRODUCTOLOTE { get; set; }
        public DbSet<AClase> ACLASE { get; set; }
        public DbSet<ASubClase> ASUBCLASE { get; set; }
        public DbSet<AProductoPresentacion> APRODUCTOPRESENTACION { get; set; }
        public DbSet<AFabricante> AFABRICANTE { get; set; }
        public DbSet<ALaboratorio> ALABORATORIO { get; set; }
        public DbSet<ATipoProducto> ATIPOPRODUCTO { get; set; }
        public DbSet<AProducto> APRODUCTO { get; set; }
        public DbSet<AEquivalencia> AEQUIVALENCIA { get; set; }
        public DbSet<Constante> CCONSTANTE { get; set; }
        public DbSet<AAlmacen> AALMACEN { get; set; }
        public DbSet<AAreaAlmacen> AAREAALMACEN { get; set; }
        public DbSet<AAlmacenSucursal> AALMACENSUCURSAL { get; set; }
        public DbSet<AUnidadMedida> AUNIDADMEDIDA { get; set; }
        public DbSet<ATemperatura> ATEMPERATURA { get; set; }
        public DbSet<AAccionFarmacologica> AACCIONFARMACOLOGICA { get; set; }
        public DbSet<ADetalleProductoGenerico> CDETALLEPRODUCTOGENERICO { get; set; }
        public DbSet<ADetalleAccionFarmacologica> ADETALLEACCIONFARMACOLOGICA { get; set; }
        public DbSet<ATipoMovimiento> ATIPOMOVIMIENTO { get; set; }
        public DbSet<AGuiaSalida> AGUIASALIDA { get; set; }
        public DbSet<ADetalleGuiaSalida> ADETALLEGUIASALIDA { get; set; }
        public DbSet<AGuiaEntrada> AGUIAENTRADA { get; set; }
        public DbSet<ADetalleGuiaEntrada> ADETALLEGUIAENTRADA { get; set; }
        public DbSet<ASalidaTransferencia> ASALIDATRANSFERENCIA { get; set; }
        public DbSet<ASalidaTransferenciaDetalle> ASALIDATRANSFERENCIADETALLE { get; set; }
        public DbSet<AIngresoTransferencia> AINGRESOTRANSFERENCIA { get; set; }
        public DbSet<AIngresoTransferenciaDetalle> AINGRESOTRANSFERENCIADETALLE { get; set; }
        public DbSet<AConsumoEconomato> ACONSUMOECONOMATO { get; set; }
        public DbSet<AConsumoEconomatoDetalle> ACONSUMOECONOMATODETALLE { get; set; }
        public DbSet<AAlmacenTransferencia> AALMACENTRANSFERENCIA { get; set; }
        public DbSet<AAlmacenTransferenciaDetalle> AALMACENTRANSFERENCIADETALLE { get; set; }

        public DbSet<AAlmacenProduccion> AALMACENPRODUCCION { get; set; }
        public DbSet<AAlmacenProduccionDetalle> AALMACENPRODUCCIONDETALLE { get; set; }
        
        public DbSet<AInventario> AINVENTARIO { get; set; }
        public DbSet<AInventarioDetalle> AINVENTARIODETALLE { get; set; }
        public DbSet<ADristribucionProducto> ADristribucionProducto { get; set; }
        public DbSet<ALoteFechaVencimientoGuiaSalida> ALoteFechaVencimientoGuiaSalida { get; set; }
        //ALMACEN
        public DbSet<TEmpresa> TEMPRESA { get; set; }
        public DbSet<TVehiculo> TVEHICULO { get; set; }
        public DbSet<TConductor> TCONDUCTOR { get; set; }
   
        //ASISTENCIA
        public DbSet<ARegistroEs> ASISREGISTROES { get; set; }
        public DbSet<AEmpleadosAutorizantes> ASISEMPLEADOSAUTORIZANTES { get; set; }

        //COMPRAS
        public DbSet<CProveedor> CPROVEEDOR { get; set; }
        public DbSet<ArchivoProveedor> ARCHIVOPROVEEDOR { get; set; }
        public DbSet<CuentaProveedor> CCUENTAPROVEEDOR { get; set; }
        public DbSet<CCotizacion> CCOTIZACION { get; set; }
        public DbSet<CCotizacionDetalle> CCOTIZACIONDETALLE { get; set; }
        public DbSet<FCondicionPago> CCONDICIONPAGO { get; set; }
        public DbSet<CProveedorLaboratorio> CPROVEEDORLABORATORIO { get; set; }
        public DbSet<CTipoCotizacion> CTIPOCOTIZACION { get; set; }
        public DbSet<CProductoProveedor> CPRODUCTOPROVEEDOR { get; set; }
        public DbSet<CContactosProveedor> CCONTACTOPROVEEDOR { get; set; }
        public DbSet<CRepresentanteLaboratorio> CREPRESENTANTELABORATORIO { get; set; }
        public DbSet<CBonificacionCotizacion> CBONIFICACIONCOTIZACION { get; set; }
        public DbSet<COrdenCompra> CORDENCOMPRA { get; set; }
        public DbSet<COrdenDetalle> CORDENCOMPRADETALLE { get; set; }
        public DbSet<CHistorialPrecios> CPRECIOHISTORIAL { get; set; }
        public DbSet<CRequerimiento> CREQUERIMIENTO { get; set; }
        public DbSet<CRequerimientoDetalle> CREQUERIMIENTODETALLE { get; set; }
        //PREINGRESO 
        public DbSet<PIItemCondicionEmbalaje> PIITEMEMBALAJE { get; set; }
        public DbSet<PICondicionEmbalaje> PICONDICIONEMBALAJE { get; set; }
        public DbSet<PIDetalleBonificacionFueraDocumento> PIDETALLEBONIFUERADOC { get; set; }
        //public DbSet<PIBonificacionFueraDocumento> PIBONIFFUERADOC { get; set; }
        public DbSet<PIPreingreso> PIPREINGRESO { get; set; }
        public DbSet<PIFacturaPreingreso> PIFACTURASPREINGRESO { get; set; }
        public DbSet<PIPreingresoDetalle> PIPREINGRESODETALLE { get; set; }
        public DbSet<PILote> PILOTE { get; set; }
        public DbSet<PIControlCalidad> PICONTROLCALIDAD { get; set; }
        public DbSet<PIAnalisisOrganoleptico> PIANALISISORGANOLEPTICO { get; set; }
        public DbSet<PIAnalisisOrgDetalle> PIANALISISORGDETALLE { get; set; }
        public DbSet<PITipoAnalisis> PITIPOANALISIS { get; set; }
        public DbSet<PIRangoMuestraAO> PIRANGOMUESTRAAO { get; set; }
        public DbSet<PIGuiaDevolucion> PIGUIADEVOLUCION { get; set; }
        public DbSet<PIGuiaDevolucionDetalle> PIDETALLEGUIADEVOLUCION { get; set; }
        public DbSet<PICategoriaAO> PICATEGORIAAO { get; set; }
        public DbSet<PICaracteristicaAO> PICARACTERISTICAAO { get; set; }
        public DbSet<PICaracteristicaDetalleAO> PICARACTERISTICADETALLEAO { get; set; }
        public DbSet<DocumentosGuardadosDrive> DOCUMENTOSGUARDADOSDRIVE { get; set; }


        //FINANZAS
        public DbSet<FTipoTarjeta> FTIPOTARJETA { get; set; }
        public DbSet<FIcoterms> FICOTERMS { get; set; }
        public DbSet<FBanco> FBANCO { get; set; }
        public DbSet<FCuenta> FCUENTA { get; set; }
        public DbSet<FDocumentoTributario> FDOCUMENTOTRIBUTARIO { get; set; }
        public DbSet<FMoneda> FMONEDA { get; set; }
        public DbSet<FTipoPago> FTIPOPAGO { get; set; }
        public DbSet<FTipoTributo> FTIPOTRIBUTO { get; set; }
        public DbSet<FTipoDocumentoTributario> FTIPODOCUMENTOTRIBUTARIO { get; set; }
        public DbSet<FLineaCredito> FLINEACREDITO { get; set; }
        public DbSet<FLineaCreditoCobroCliente> FLINEACREDITOCOBROCLIENTE { get; set; }
        public DbSet<FLineaCreditoHistorial> FLINEACREDITOHISTORIAL { get; set; }
        public DbSet<FPagos> FPAGOS { get; set; }

        //GENERAL
        public DbSet<Empresa> EMPRESA { get; set; }
        public DbSet<DetallePackPedidoVenta> DETALLEPACKPEDIDOVENTA { get; set; }
        public DbSet<EmpleadoCanalVenta> EMPLEADOCANALVENTA { get; set; }
        public DbSet<LugarSucursal> LUGARSUCURSAL { get; set; }
        public DbSet<SucursalLaboratorio> SUCURSALLABORATORIO { get; set; }
        public DbSet<Pais> PAIS { get; set; }
        public DbSet<Caja> CAJA { get; set; }
        public DbSet<CajaSucursal> CAJASUCURSAL { get; set; }
        public DbSet<CorrelativoDocumento> CORRELATIVODOCUMENTO { get; set; }
        public DbSet<Cliente> CLIENTE { get; set; }
        public DbSet<ClienteAsociado> CLIENTEASOCIADO { get; set; }
        public DbSet<DocumentoPersonal> DOCUMENTOPERSONAL { get; set; }
        public DbSet<Medico> MEDICO { get; set; }
        public DbSet<MedicoBanco> MEDICOBANCO { get; set; }
        public DbSet<EspecialidadMedico> ESPECIALIDAD { get; set; }
        public DbSet<Paciente> PACIENTE { get; set; }
        public DbSet<ColegioMedico> COLEGIOMEDICO { get; set; }

        public DbSet<Institucion> INSTITUCION { get; set; }

        //VENTAS
        public DbSet<AperturarCaja> APERTURACAJA { get; set; }
        public DbSet<Venta> VENTA { get; set; }
        public DbSet<VentaDetalle> VENTADETLLE { get; set; }
        public DbSet<VentaPagos> VENTAPAGOS { get; set; }
        public DbSet<CerrarCaja> CERRARCAJA { get; set; }
        public DbSet<Proforma> PROFORMA { get; set; }
        public DbSet<ProformaDetalle> PROFORMADETALLE { get; set; }
        public DbSet<NotaCD> NOTACREDITODEBITO { get; set; }
        public DbSet<DetalleNotaCD> DETALLENOTACREDITODEBITO { get; set; }
        public DbSet<EgresoCaja> EGRESOS { get; set; }
        public DbSet<FTipoEgreso> TIPOEGRESO { get; set; }
        public DbSet<CanalVenta> CANALVENTA { get; set; }

        //COMERCIAL

        public DbSet<PreciosProducto> PRECIOSPRODUCTO { get; set; }
        public DbSet<ListaPrecios> LISTAPRECIOS { get; set; }
        public DbSet<ListaPreciosSucursal> PRECIOSSUCURSAL { get; set; }
        public DbSet<SucursalOferta> SUCURSALOFERTA { get; set; }
        public DbSet<ObsequioOferta> OBSEQUIOOFERTA { get; set; }
        public DbSet<DetalleOferta> DETALLEOFERTA { get; set; }
        public DbSet<Oferta> OFERTA { get; set; }
        public DbSet<Descuento> DESCUENTO { get; set; }
        public DbSet<DescuentoDetalle> DESCUENTODETALLE { get; set; }
        public DbSet<DescuentoSucursal> DESCUENTOSUCURSAL { get; set; }
        public DbSet<ListaDescuento> LISTADESCUENTO { get; set; }
        public DbSet<Incentivo> INCENTIVO { get; set; }
        public DbSet<PreciosDetalle> PRECIODETALLE { get; set; }
        //ESQUEMA COMERCIAL TABLA AGREGADA
        public DbSet<ADristribucion> CANALLISTADESCUENTO { get; set; }

        //PEDIDOS
        public DbSet<Pedido> PEDIDO { get; set; }
        public DbSet<PagosPedido> PAGOSPEDIDO { get; set; }
        public DbSet<EstadoPedido> ESTADOPEDIDO { get; set; }
        public DbSet<DevolucionPedido> DEVOLUCIONPEDIDO { get; set; }
        public DbSet<ImagenPedido> IMAGENPEDIDO { get; set; }
        public DbSet<DetallePedido> DETALLEPEDIDO { get; set; }
        public DbSet<TipoPedido> TIPOPEDIDO { get; set; }
        public DbSet<Diagnostico> DIAGNOSTICO { get; set; }
        public DbSet<OrigenReceta> ORIGENRECETA { get; set; }
        public DbSet<TipoOrigenReceta> TIPORIGENRECETA { get; set; }
        public DbSet<TipoPaciente> TIPOPACIENTE { get; set; }
        public DbSet<DificultadFormula> DIFICULTADFORMULA { get; set; }
        public DbSet<PedidoCaja> PEDIDOCAJA { get; set; }//EARTCOD1011
        public DbSet<DetallePedidoEstadoProceso> DETALLEPEDIDOESTADOPROCESO { get; set; }


        //DELIVERY       
        public DbSet<TipoEntrega> TIPOENTREGA { get; set; }
        public DbSet<Delivery> DELIVERY { get; set; }
        public DbSet<AgenciaEncomienda> AGENCIAENCOMIENDA { get; set; }
        public DbSet<EntregaDelivery> ENTREGADELIVERY { get; set; }


        //VINALI

        public DbSet<Procedimientos> PROCEDIMIENTO { get; set; }
        public DbSet<TipoDeProcedimiento> TIPODEPROCEDIMIENTO { get; set; }
        public DbSet<ArticuloProcedimiento> ARTICULO { get; set; }
        public DbSet<DetalleProcedimiento> DETALLEPROCEDIMIENTO { get; set; }
        public DbSet<DetalleProcedimientoArticulo> DETALLEPROCEDIMIENTOARTICULO { get; set; }

        //VETERINARIA
        public DbSet<TipoMascota> TIPOMASCOTA { get; set; }
        public DbSet<PatologiaMascota> PATOLOGIAMASCOTA { get; set; }
        public DbSet<RazaMascota> RAZAMASCOTA { get; set; }

        //PRODUCCION
        public DbSet<TipoFormulacion> TIPOFORMULACION { get; set; }
        public DbSet<TipoVenta> TipoVentas { get; set; }


        ////GDP
        public DbSet<CAJACHICA> CAJACHICA { get; set; }
        public DbSet<DETALLECAJACHICA> DETALLECAJACHICA { get; set; }
        public DbSet<INGRESOS> INGRESOS { get; set; }

        public DbSet<CATALAGOPRECIOS> CATALAGOPRECIOS { get; set; }

        public DbSet<CONSULTAMEDICA> CONSULTAMEDICA { get; set; }
        public DbSet<DEPARTAMENTO> DEPARTAMENTO { get; set; }

        public DbSet<DISTRITO> DISTRITO { get; set; }
        public DbSet<EMPLEADO> EMPLEADO { get; set; }
        public DbSet<MEDICOESPECIALIDAD> MEDICOESPECIALIDAD { get; set; }
        public DbSet<MOVIMIENTO> MOVIMIENTO { get; set; }


        public DbSet<PROVINCIA> PROVINCIA { get; set; }
        public DbSet<SUCURSAL> SUCURSAL { get; set; }



        public DbSet<TURNO> TURNO { get; set; }
        public DbSet<USUARIO> USUARIO { get; set; }
        public DbSet<CATEGORIAPRECIO> CATEGORIAPRECIO { get; set; }
        public DbSet<SUCURSALES_SUPERVISOR> SUCURSAL_SUPERVISOR { get; set; }
        public DbSet<SUCURSALES_REPMEDICO> SUCURSALES_REPMEDICO { get; set; }
        public DbSet<TIPO_EMPRESA> TIPO_EMPRESA { get; set; }

        public DbSet<Horario> HORARIO { get; set; }
        public DbSet<Consultorio> CONSULTORIO { get; set; }
        public DbSet<DEPOSITOS> DEPOSITO { get; set; }
        public DbSet<LISTAPRECIOSUCURSAL> LISTAPRECIOSUCURSAL { get; set; }
        public DbSet<LIBRORECETAS> LIBRORECETAS { get; set; }
        public DbSet<LIBRORECETASLABORATORIO> LIBRORECETASLABORATORIO { get; set; }
       

        private readonly IUser user;

        public Modelo(DbContextOptions<Modelo> options, IUser userNow)
          : base(options)
        {
            user = userNow;
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            procesarSalvado();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            procesarSalvado();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void procesarSalvado()
        {
            try
            {
                var horaactual = DateTime.Now;
                foreach (var item in ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Added && e.Entity is AuditoriaColumna))
                {
                    var entidad = item.Entity as AuditoriaColumna;
                    entidad.fechacreacion = horaactual;
                    entidad.fechaedicion = horaactual;
                    entidad.usuariocrea = user.getIdUserSession();
                    entidad.usuariomodifica = user.getIdUserSession();
                }
                foreach (var item in ChangeTracker.Entries()
                    .Where(e => e.State == EntityState.Modified && e.Entity is AuditoriaColumna))//EntityState.Added
                {
                    var entidad = item.Entity as AuditoriaColumna;
                    if (entidad.iseditable is null || entidad.iseditable.Value)
                    {
                        entidad.fechaedicion = horaactual;
                        entidad.usuariomodifica = user.getIdUserSession();
                    }
                    else
                    {
                        item.Property(nameof(entidad.fechaedicion)).IsModified = false;
                        item.Property(nameof(entidad.usuariomodifica)).IsModified = false;
                    }
                    item.Property(nameof(entidad.fechacreacion)).IsModified = false;
                    item.Property(nameof(entidad.usuariocrea)).IsModified = false;
                }
            }
            catch (Exception vEx) {
            
            }
        }
    }
}
