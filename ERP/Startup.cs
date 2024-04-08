using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wkhtmltopdf.NetCore;
using Erp.Persistencia.Modelos;     
using ENTIDADES.Identity;
using INFRAESTRUCTURA.Areas.Almacen.EF;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using INFRAESTRUCTURA.Areas.Maestros.INTERFAZ;
using INFRAESTRUCTURA.Areas.Maestros.EF;

using INFRAESTRUCTURA.Areas.Finanzas.EF;
using INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using INFRAESTRUCTURA.Areas.Administrador.EF;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using INFRAESTRUCTURA.Areas.Compras.EF;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ;
using INFRAESTRUCTURA.Areas.PreIngreso.EF;
using DinkToPdf.Contracts;
using DinkToPdf;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using INFRAESTRUCTURA.Areas.Ventas.EF;
using INFRAESTRUCTURA.Areas.Proformas.EF;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using INFRAESTRUCTURA.Areas.Comercial.EF;
using INFRAESTRUCTURA.Areas.Transporte.EF;
using INFRAESTRUCTURA.Repository.Interfaz;
using INFRAESTRUCTURA.Repository;
using MediatR;
using INFRAESTRUCTURA.Areas.Finanzas.LineaCredito;
using Erp.Persistencia.DapperConection;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using Gdp.Infraestructura.Pedidos.registro;
using Vinali.Infraestructura.Ventas.query;
using VisitadorMedico.Infraestructura.Maestros.objetivos;
using Microsoft.AspNetCore.Mvc;
using Erp.SeedWork.Report;

namespace ERP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                 
            options.UseSqlServer(
                     Configuration.GetConnectionString("DefaultConnection")).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
            services.AddDbContext<Modelo>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("Modelo")).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
            services.AddDefaultIdentity<AppUser>()
              .AddRoles<AppRol>()
              .AddEntityFrameworkStores<ApplicationDbContext>();
            services.AddControllersWithViews();
            services.AddRazorPages();
            services.Configure<IdentityOptions>(options =>
            {
                // Default Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;
                options.Password.RequiredUniqueChars = 0;
            });

            // Add Cors
            services.AddCors(o =>
            {
                o.AddPolicy(name: MyAllowSpecificOrigins,
                    builder =>
                {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
                });
            });

            // Add framework services.
            services.AddMvc();
            



            services.AddDataProtection()
           .UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration
           {
               EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
               ValidationAlgorithm = ValidationAlgorithm.HMACSHA256
           });
            services.AddMvc(options => options.EnableEndpointRouting = false);
            services.AddSingleton(typeof(IConverter),new SynchronizedConverter(new PdfTools()));
            //DAPPER
            services.Configure<DapperConection>(Configuration.GetSection("ConnectionStrings"));
            services.AddTransient<IFactoryConnection, FactoryConnection>();
            services.AddTransient<IEjecutarProcedimiento, EjecutarProcedimiento>();
            services.AddTransient<IReportService, ReportService>();

            //SERVICIOS
            services.AddMediatR(typeof(DatosInicio.Manejador).Assembly);
            services.AddMediatR(typeof(DatosInicioRegistro.Manejador).Assembly);
            services.AddMediatR(typeof(ReporteVentasVinali.Manejador).Assembly);
            services.AddMediatR(typeof(ElimnarObjetivo.Manejador).Assembly);
            services.AddTransient<IUser, User>();
            services.AddTransient<ICryptografhy, Cryptografhy>();
            
            //ALMACEN
            services.AddTransient<IPrincipioActivoEF, PrincipioActivoEF>();
            services.AddTransient<IRegistroSanitarioEF, RegistroSanitarioEF>();
            services.AddTransient<ISubClaseEF, SubClaseEF>();
            services.AddTransient<IClaseEF, ClaseEF>();
            services.AddTransient<ITipoProductoEF, TipoProductoEF>();
            services.AddTransient<IAccionFarmacologicaEF, AccionFarmacologicaEF>();
            services.AddTransient<IAlmacenEF, AlmacenEF>();
            services.AddTransient<IAreaAlmacenEF, AreaAlmacenEF>();
            services.AddTransient<IAlmacenSucursalEF, AlmacenSucursalEF>();
            services.AddTransient<IEquivalenciaEF, EquivalenciaEF>();
            services.AddTransient<IFabricanteEF, FabricanteEF>();
            services.AddTransient<ILaboratorioEF, LaboratorioEF>();
            services.AddTransient<IProductoEF, ProductoEF>();
            services.AddTransient<IDetalleProductoGenericoEF, DetalleProductoGenericoEF>();
            services.AddTransient<IPresentacionEF, PresentacionEF>();
            services.AddTransient<ITemperaturaEF, TemperaturaEF>();
            services.AddTransient<IUnidadMedidaEF, UnidadMedidaEF>();
            services.AddTransient<IProveedorLaboratorioEF, ProveedorLaboratorioEF>();
            services.AddTransient<IStockEF, StockEF>();
            services.AddTransient<IIngresoManualEF  , IngresoManualEF>();
            services.AddTransient<ITipoMovimientoEF, TipoMovimientoEF>();
            services.AddTransient<IGuiaSalidaEF, GuiaSalidaEF>();
            services.AddTransient<IMantenimientoGuiaEF, MantenimientoGuiaEF>();
            services.AddTransient<IGuiaEntradaEF, GuiaEntradaEF>();
            services.AddTransient<ISalidaTransferencia, SalidaTransferenciaEF>();
            services.AddTransient<IIngresoTransferenciaEF, IngresoTransferenciaEF>();
            services.AddTransient<IConsumoEconomatoEF, ConsumoEconomatoEF>();
            services.AddTransient<IAlmacenTransferenciaEF, AlmacenTransferenciaEF>();
            services.AddTransient<IInventarioEF, InventarioEF>();

            //TRANSPORTE
            services.AddTransient<IEmpresaTransporteEF, EmpresaTransporteEF>();
            services.AddTransient<IVehiculoEF, VehiculoEF>();
           
            services.AddTransient<IFormaFarmaceuticaEF, FormaFarmaceuticaEF>();


            //GENERALES
            services.AddTransient<IPaisEF, PaisEF>();
            services.AddTransient<IClienteEF, ClienteEF>();
            
            
            //FINANZAS
            services.AddTransient<ITipoPagoEF, TipoPagoEF>();
            services.AddTransient<IMonedaEF, MonedaEF>();
            services.AddTransient<ICondicionPagoEF, CondicionPagoEF>();
            services.AddTransient<IBancoEF, BancoEF>();
            
            //ADMINISTRADOR
            services.AddTransient<IConstanteEF, ConstanteEF>();
            services.AddTransient<ICorrelativoDocumentoEF, CorrelativoDocumentoEF>();
            services.AddTransient<IEmpresaEF, EmpresaEF>();
            services.AddTransient<ILugarSucursalEF, LugarSucursalEF>();
            services.AddTransient<IModuloGrupoEF, ModuloGrupoEF>();
            services.AddTransient<ISucursalEF, SucursalEF>();
            services.AddTransient<IEmpleadoEF, EmpleadoEF>();
            services.AddTransient<IDocumentoTributarioEF, DocumentoTributarioEF>();
            services.AddTransient<ICajaEF, CajaEF>();

            //COMPRAS
            services.AddTransient<ICotizacionEF, CotizacionEF>();
            services.AddTransient<IOrdenCompraEF, OrdenCompraEF>();
            services.AddTransient<IProveedorEF, ProveedorEF>();
            services.AddTransient<IProductoProveedorEF, ProductoProveedorEF>();
            services.AddTransient<IAprobarFacturaEF, AprobarFacturaEF>();
            services.AddTransient<IRequerimientoEF, RequerimientoEF>();

            //PREINGRESO
            services.AddTransient<IPreingresoEF, PreingresoEF>();
            services.AddTransient<ITipoAnalisisEF, TipoAnalisisEF>();
            services.AddTransient<IRangoMuestraAOEF, RangoMuestraAOEF>();
            services.AddTransient<IBonificacionFueraDocumentoEF, BonificacionFueraDocumentoEF>();
            services.AddTransient<IGuiaDevolucionEF, GuiaDevolucionEF>();
            services.AddTransient<ICondicionEmbalajeEF, CondicionEmbalajeEF>();

            services.AddTransient<IAnalisisOrganolepticoEF, AnalisisOrganolepticoEF>();
            services.AddTransient<ICategoriaAOEF, CategoriaAOEF>();
            services.AddTransient<ICaracteristicaAOEF, CaracteristicaAOEF>();


            //VENTAS
            services.AddTransient<ICajaVentaEF, CajaVentaEF>();
            services.AddTransient<IVentaEF, VentaEF>();
            services.AddTransient<IProformaEF, ProformaEF>();
            services.AddTransient<INotacdEF, NotacdEF>();
            services.AddTransient<IIngresoEgresoEF, IngresoEgresosEF>();

            //COMERCIAL
            services.AddTransient<IListaPreciosEF, ListaPreciosEF>();
            services.AddTransient<IOfertaEF, OfertaEF>();
            services.AddTransient<IObservatorioPreciosEF, ObservatorioPreciosEF>();
            services.AddTransient<IDescuentoEF, DescuentoEF>();

            //GENERIC CLASS
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();               
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("MyPolicy");
            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllerRoute(
            //        name: "default",
            //        pattern: "{controller=Home}/{action=Index}/{id?}");
            //    endpoints.MapRazorPages();
            //});
            app.UseMvc(routes => {
                routes.MapAreaRoute(
                    name: "Administrador",
                    areaName: "Administrador",
                    template: "Administrador/{controller=Default}/{action=Index}/{id?}"
                    ); 
                routes.MapAreaRoute(
                    name: "Compras",
                    areaName: "Compras",
                    template: "Compras/{controller=Default}/{action=Index}/{id?}"
                    ); 
                routes.MapAreaRoute(
                    name: "Preingreso",
                    areaName: "PreIngreso",
                    template: "PreIngreso/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Finanzas",
                    areaName: "Finanzas",
                    template: "Finanzas/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Almacen",
                    areaName: "Almacen",
                    template: "Almacen/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                   name: "Transporte",
                   areaName: "Transporte",
                   template: "Transporte/{controller=Default}/{action=Index}/{id?}"
                   );
                routes.MapAreaRoute(
                    name: "Maestros",
                    areaName: "Maestros",
                    template: "Maestros/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Ventas",
                    areaName: "Ventas",
                    template: "Ventas/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Comercial",
                    areaName: "Comercial",
                    template: "Comercial/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Digemid",
                    areaName: "Digemid",
                    template: "Digemid/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Pedidos",
                    areaName: "Pedidos",
                    template: "Pedidos/{controller=Default}/{action=Index}/{id?}"
                    );
               
                routes.MapAreaRoute(
                    name: "LibroRecetas",
                    areaName: "LibroRecetas",
                    template: "LibroRecetas/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Veterinaria",
                    areaName: "Veterinaria",
                    template: "Veterinaria/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Vinali",
                    areaName: "Vinali",
                    template: "Vinali/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "VisitadorMedico",
                    areaName: "VisitadorMedico",
                    template: "VisitadorMedico/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Asistencia",
                    areaName: "Asistencia",
                    template: "Asistencia/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Procedimiento",
                    areaName: "Procedimiento",
                    template: "Procedimiento/{controller=Default}/{action=Index}/{id?}"

                    ); 
                routes.MapAreaRoute(
                    name: "Telemedico",
                    areaName: "Telemedico",
                    template: "Telemedico/{controller=Default}/{action=Index}/{id?}"

                    );
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "Contabilidad",
                    areaName: "Contabilidad",
                    template: "Contabilidad/{controller=Default}/{action=Index}/{id?}"
                    );
                routes.MapAreaRoute(
                    name: "ImpresionMasiva",
                    areaName: "ImpresionMasiva",
                    template: "ImpresionMasiva/{controller=Default}/{action=Index}/{id?}"
                    );
            });
            //para generar los pdf
            // Configuramos Rotativa indic�ndole el Path RELATIVO donde se
            // encuentran los archivos de la herramienta wkhtmltopdf.
            //Rotativa.AspNetCore.RotativaConfiguration.Setup(env, "..\\wkhtmltopdf\\Windows\\");

        }
    }
}
