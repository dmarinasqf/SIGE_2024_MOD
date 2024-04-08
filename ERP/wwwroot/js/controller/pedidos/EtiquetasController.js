class EtiquetasController {

    DatosEtiquetas(idpedido, fn) {
        var url = ORIGEN + '/Pedidos/Etiqueta/getDatosEtiquetas?idpedido=' + idpedido;

        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    ImprimirEtiquetas_V4(tipoEtiqueta, btcodigoAN, btcomplejo, BTnombrecomposicion, BTdescripcionproducto, BTtipouso, BTquimicofarmaceutico, BTreg, BTfechafab, BTfechaven) {
        var url = "";
        if (tipoEtiqueta == "60x40Barton") {
            url = "http://localhost:18066/Integration/60x40Barton/Execute?BTcodigoAN=" + btcodigoAN + "&BTcomplejo=" + btcomplejo + "&BTnombrecomposicion=" + BTnombrecomposicion + "&BTdescripcionproducto=" + BTdescripcionproducto +
                "&BTtipouso=" + BTtipouso + "&BTquimicofarmaceutico=" + BTquimicofarmaceutico + "&BTreg=" + BTreg + "&BTfechafab=" + BTfechafab + "&BTfechaven=" + BTfechaven;
        }
        else if (tipoEtiqueta == "28x45Barton") {
            url = "http://localhost:18067/Integration/28x45Barton/Execute?BTcodigoAN=" + btcodigoAN + "&BTcomplejo=" + btcomplejo + "&BTnombrecomposicion=" + BTnombrecomposicion + "&BTdescripcionproducto=" + BTdescripcionproducto +
                "&BTtipouso=" + BTtipouso + "&BTquimicofarmaceutico=" + BTquimicofarmaceutico + "&BTreg=" + BTreg + "&BTfechafab=" + BTfechafab + "&BTfechaven=" + BTfechaven;
        }
        else if (tipoEtiqueta == "25x76Barton") {
            url = "http://localhost:18068/Integration/25x76Barton/Execute?BTcodigoAN=" + btcodigoAN + "&BTcomplejo=" + btcomplejo + "&BTnombrecomposicion=" + BTnombrecomposicion + "&BTdescripcionproducto=" + BTdescripcionproducto +
                "&BTtipouso=" + BTtipouso + "&BTquimicofarmaceutico=" + BTquimicofarmaceutico + "&BTreg=" + BTreg + "&BTfechafab=" + BTfechafab + "&BTfechaven=" + BTfechaven;
        }

        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);

        });
    }

    ImprimirEtiquetas_V3(tipoEtiqueta, btpaciente, btqf, btcfqp, btfe, btfv, btreg) {
        var url = "";
        if (tipoEtiqueta == "125x56LineaProtectorSolar") {
            url = "http://localhost:18060/Integration/125x56LineaProtectorSolarLuxe/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "72x32LineaProtectorSolar") {
            url = "http://localhost:18054/Integration/72x32LineaProtectorSolarSitylMelasensi/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "98x57LineaSerumLiquidoFluido") {
            url = "http://localhost:18061/Integration/98x57LineaSerumLiquidoFluido/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "94x47LineaSerumTexturaSeda") {
            url = "http://localhost:18064/Integration/94x47LineaSerumTexturaSeda/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "77x44LineaSerumTexturaSeda") {
            url = "http://localhost:18065/Integration/77x44LineaSerumTexturaSeda/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "160x32LineaSkinCareFacialHylageRevis") {
            url = "http://localhost:18062/Integration/160x32LineaSkinCareFacialHylageRevis/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "90x50SkinCareFacialGrasyHylasSsenzyMelas") {
            url = "http://localhost:18049/Integration/90x50SkinCareFacialGrasyHylasSenzyMelas/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "65x45SkinCareFacialHyato") {
            url = "http://localhost:18052/Integration/65x45SkinCareFacialHyato/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "78x48SkinCareFacial") {
            url = "http://localhost:18055/Integration/78x48SkinCareFacialLecare/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "90x50SkinCareFacialMouli") {
            url = "http://localhost:18057/Integration/90x50SkinCareFacialMouli/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "65x45SkinCareFacialAquame") {
            url = "http://localhost:18051/Integration/65x45SkinCareFacialAquame/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "65x45SkinCarePodologíaBivenaUrea") {
            url = "http://localhost:18053/Integration/65x45SkinCarePodologiaBivena/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "84x35SkinCarePodologíaLekatFeet") {
            url = "http://localhost:18056/Integration/84x35SkinCarePodologiaLekatFeet/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "65x45SkinCarePodologíaBivenaFeet") {
            url = "http://localhost:18053/Integration/65x45SkinCarePodologiaBivena/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "90x50SkinCarePodologíaSyndetUrea") {
            url = "http://localhost:18058/Integration/90x50SkinCarePodologiaSyndet/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "90x50SkinCarePodologíaSyndetPantenol") {
            url = "http://localhost:18058/Integration/90x50SkinCarePodologiaSyndet/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "65x45SkinCareBivena") {
            url = "http://localhost:18050/Integration/65x45SkinCareBivena/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "90x50SkinCareVulvar") {
            url = "http://localhost:18059/Integration/90x50SkinCareVulvarMouferMoupas/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "125x42SkinCareVulvar") {
            url = "http://localhost:18063/Integration/125x42SkinCareVulvar/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }
        else if (tipoEtiqueta == "76x28EyesSerumFluido10ml") {
            url = "http://localhost:18069/Integration/76x28EyesSerumFluido10ml/Execute?BTnombres=" + btqf + "&BTcqfp=" + btcfqp + "&BTfe=" + btfe + "&BTfv=" + btfv +
                "&BTreg=" + btreg + "&BTpaciente=" + btpaciente;
        }


        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);

        });
    }

    ImprimirEtiquetas_V2(tipo, ptipo, ptipoprod, pLR, pfechafab, pfechaven, puso, mcomposicion, pquimico) {
        var url = "";
        if (tipo == "ARGOX") {
            if (ptipo == "1950") {
                url = "http://localhost:18048/Integration/19x50/Execute?PTipoP=" + ptipoprod + "&PLibro=" + pLR+"&PFfab=" + pfechafab + "&PFven=" + pfechaven+
                "&PComposicion=" + mcomposicion + "&PUso=" + puso + "&PQuimico=" + pquimico;
            }
        }

        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);

        });
    }

    ImprimirEtiquetas(tipo,ptipo,pcliente, ppaciente, pmedico, pquimico, pfechafab, pfechaven, preg, pcmp, pcmpq, mcomposicion, puso, pind) {
        //var url = ORIGEN + '/Etiquetas/Etiqueta/getDatosEtiquetas?idpedido=' + idpedido;
        var invocation = new XMLHttpRequest();
        var url = "";
       
        if (tipo == "ARGOX") {
            if (ptipo == "grande") {
                url = "http://localhost:18045/Integration/EtiquetaGrande/Execute?Paciente=" + ppaciente + "&Medico=" + pmedico + "&Quimico=" + pquimico
                    + "&Ffab=" + pfechafab + "&Fven=" + pfechaven + "&Reg=" + preg + "&Cmp=" + pcmp
                    + "&Cqmp=" + pcmpq + "&Composicion=" + mcomposicion + "&Uso=" + puso + "&Indica=" + pind;
            }
            if (ptipo == "mediana") {
                url = "http://localhost:18046/Integration/EtiquetaMediana/Execute?MPaciente=" + ppaciente + "&MMedico=" + pmedico + "&MQuimico=" + pquimico
                    + "&MFfab=" + pfechafab + "&MFven=" + pfechaven + "&MReg=" + preg + "&MCmp=" + pcmp
                    + "&MCqmp=" + pcmpq + "&MComposicion=" + mcomposicion + "&MUso=" + puso + "&MIndica=" + pind;

            } if (ptipo == "pequeña") {
                url = "http://localhost:18047/Integration/EtiquetaPequena/Execute?PPaciente=" + ppaciente + "&PMedico=" + pmedico + "&PQuimico=" + pquimico
                    + "&PFfab=" + pfechafab + "&PFven=" + pfechaven + "&PReg=" + preg + "&PCmp=" + pcmp
                    + "&PCqmp=" + pcmpq + "&PComposicion=" + mcomposicion + "&PUso=" + puso + "&PIndica=" + pind;
            } 
        }
        if (tipo == "TERCERO") {
            if (ptipo == "grande") {
                url = "http://localhost:18048/Integration/EtiquetaGrandeT/Execute?Paciente=" + ppaciente + "&Medico=" + pmedico + "&Quimico=" + pquimico
                    + "&Ffab=" + pfechafab + "&Fven=" + pfechaven + "&Reg=" + preg + "&Cmp=" + pcmp
                    + "&Cqmp=" + pcmpq + "&Composicion=" + mcomposicion + "&Uso=" + puso + "&Indica=" + pind+"&Cliente="+pcliente;
            }
            if (ptipo == "mediana") {
                url = "http://localhost:18049/Integration/EtiquetaMedianaT/Execute?MPaciente=" + ppaciente + "&MMedico=" + pmedico + "&MQuimico=" + pquimico
                    + "&MFfab=" + pfechafab + "&MFven=" + pfechaven + "&MReg=" + preg + "&MCmp=" + pcmp
                    + "&MCqmp=" + pcmpq + "&MComposicion=" + mcomposicion + "&MUso=" + puso + "&MIndica=" + pind + "&Cliente=" + pcliente;

            } if (ptipo == "pequeña") {
                url = "http://localhost:18050/Integration/EtiquetaPequenaT/Execute?PPaciente=" + ppaciente + "&PMedico=" + pmedico + "&PQuimico=" + pquimico
                    + "&PFfab=" + pfechafab + "&PFven=" + pfechaven + "&PReg=" + preg + "&PCmp=" + pcmp
                    + "&PCqmp=" + pcmpq + "&PComposicion=" + mcomposicion + "&PUso=" + puso + "&PIndica=" + pind + "&Cliente=" + pcliente;
            }
        }
        //if (invocation) {
        //    invocation.open('GET', url, true);
        //    invocation.onreadystatechange = handler;
        //    invocation.send();
        //}


        //$.ajax({
        //    url: url,
        //    //headers: { 'Access-Control-Allow-Origin': url },
        //    type: "GET",
        //    data: {},
        //    contentType: false,
        //    processData: false,
        //    async: false,
        //    success: function (data) {
        //        console.log('dasdasdasdasdads', data);
        //        mensaje('W', "Impriendo Etiqueta");
        //    }, error: function (data) {
        //        mensajeError(data);
        //    }
        //});


        var settings = {
            "url": url,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);

        });


    }

}