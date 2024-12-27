(function () {
  "use strict";
  angular
    .module("mytodoApp")
    .controller("SolicitudCreditoCtrl", SolicitudCreditoCtrl);
  SolicitudCreditoCtrl.$inject = [
    "$scope",
    "parametrosCreditosServices",
    "solicitudCreditoFinancieroServices",
    "confiProgramaServices",
    "$location",
    "growl",
    "ValidationService",
    "localStorageService",
    "$timeout",
    "utilServices",
    "$http",
    "$window",
    "appConstant",
    "appGenericConstant",
    "appConstantValueList",
  ];
  function SolicitudCreditoCtrl(
    $scope,
    parametrosCreditosServices,
    solicitudCreditoFinancieroServices,
    confiProgramaServices,
    $location,
    growl,
    ValidationService,
    localStorageService,
    $timeout,
    utilServices,
    $http,
    $window,
    appConstant,
    appGenericConstant,
    appConstantValueList
  ) {
    var gestionSolicitudCredito = this;
    var usuarioSesion;
    gestionSolicitudCredito.listaNiveles = [];
    gestionSolicitudCredito.listaLineasCredito = [];
    gestionSolicitudCredito.listaAuxiliarAmportizacion = [];
    gestionSolicitudCredito.solicitudCredito =
      solicitudCreditoFinancieroServices.solicitudCredito;
    gestionSolicitudCredito.solicitudCreditoAuxiliar =
      solicitudCreditoFinancieroServices.solicitudCreditoAuxiliar;
    gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
    gestionSolicitudCredito.parametroCredito = {};
    gestionSolicitudCredito.solicitudCredito.codeudor = "no";
    gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
    gestionSolicitudCredito.solicitudCredito.fechaActual = onFormattedDate(
      new Date()
    );
    gestionSolicitudCredito.solicitudCredito.fechaInicioCredito =
      onFormattedDate(new Date());
    gestionSolicitudCredito.solicitudCredito.numeroCuotas;
    gestionSolicitudCredito.solicitudCredito.montoMinimo;
    gestionSolicitudCredito.solicitudCredito.valorFinanciar;
    gestionSolicitudCredito.solicitudCredito.valorModulo = 0;
    gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
    gestionSolicitudCredito.cantDiasBrilla = 35;
    gestionSolicitudCredito.simple = 122;
    gestionSolicitudCredito.formal = 123;
    gestionSolicitudCredito.brilla = 161;
    gestionSolicitudCredito.manual = 221;

    gestionSolicitudCredito.discount = "";

    gestionSolicitudCredito.estadoPagada = "PAGADA";
    gestionSolicitudCredito.estadoPendiente = "PENDIENTE";
    gestionSolicitudCredito.estadoEnMora = "EN_MORA";
    gestionSolicitudCredito.indexTablaNiveles = 0;
    gestionSolicitudCredito.fechainicial;
    gestionSolicitudCredito.solicitudCredito.fecha1;
    gestionSolicitudCredito.solicitudCredito.fecha2;
    gestionSolicitudCredito.solicitudCreditoAuxiliar.noParametroCredito = false;
    gestionSolicitudCredito.item = [];
    gestionSolicitudCredito.lsttipodocumentos = [];
    gestionSolicitudCredito.fechaAc = new Date();
    gestionSolicitudCredito.itemArchivo;
    gestionSolicitudCredito.format = "dd/MM/yyyy h:mm:ss a";
    gestionSolicitudCredito.options = [{ name: "15", value: "15" }];
    gestionSolicitudCredito.selectedOption = gestionSolicitudCredito.options[0];
    gestionSolicitudCredito.report = {
      selected: null,
    };
    gestionSolicitudCredito.report = {
      selectedNivel: null,
    };
    if (localStorageService.get("solicitudCredito") !== null) {
      usuarioSesion =
        localStorageService.get("autorizacion").objectResponse.userDto;
      gestionSolicitudCredito.solicitudCredito =
        localStorageService.get("solicitudCredito");
      gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
      if (
        gestionSolicitudCredito.solicitudCredito.linea !== null &&
        gestionSolicitudCredito.solicitudCredito.linea !== undefined
      ) {
        gestionSolicitudCredito.solicitudCredito.multiple = "multiply";
      } else {
        gestionSolicitudCredito.solicitudCredito.multiple = false;
        gestionSolicitudCredito.solicitudCreditoAuxiliar.hideTable = false;
        gestionSolicitudCredito.solicitudCreditoAuxiliar.disabledLinea = true;
        localStorageService.set(
          "solicitudCreditoAuxiliar",
          gestionSolicitudCredito.solicitudCreditoAuxiliar
        );
      }
      //idPrograma, semestre
      onBuscarModulosByModalidad(
        gestionSolicitudCredito.solicitudCredito.idModalidad,
        gestionSolicitudCredito.solicitudCredito.idPeriodo,
        gestionSolicitudCredito.solicitudCredito.idPrograma,
        gestionSolicitudCredito.solicitudCredito.semestre
      );
    } else {
      localStorageService.remove("solicitudCredito");
      localStorageService.remove("solicitudCreditoAuxiliar");
      $location.path("/consulta-credito");
    }

    if (localStorageService.get("solicitudCreditoAuxiliar") !== null) {
      gestionSolicitudCredito.solicitudCreditoAuxiliar =
        localStorageService.get("solicitudCreditoAuxiliar");
      if (gestionSolicitudCredito.solicitudCreditoAuxiliar.solicitudRealizada) {
        var ultimaFecha = onBuscarMayorFechaByModulo(
          gestionSolicitudCredito.solicitudCredito.listaModulos
        );
        gestionSolicitudCredito.solicitudCredito.fechaPago = onFormattedDate(
          ultimaFecha.fechaParcialN3
        );
      }
    }

    function onActualizarSelectedNivel() {
      gestionSolicitudCredito.report.selectedNivel = [];
      if (
        gestionSolicitudCredito.solicitudCredito.listaModulos === null ||
        gestionSolicitudCredito.solicitudCredito.listaModulos === undefined
      ) {
        return;
      }
      angular.forEach(
        gestionSolicitudCredito.solicitudCredito.listaModulos,
        function (value) {
          var nivel = {
            nombreModulo: value.modulo,
            fechas:
              onFormattedDate(value.fechaInicio) +
              " - " +
              onFormattedDate(value.fechaFin),
            fechaInicio: onFormattedDate(value.fechaInicio),
            fechaFin: onFormattedDate(value.fechaFin),
            fecha1: value.fechaParcialN1,
            fecha2: onFormattedDate(value.fechaParcialN2),
            fecha3: onFormattedDate(value.fechaParcialN3),
            fecha4: onFormattedDate(value.fechaParcialN4),
          };
          gestionSolicitudCredito.report.selectedNivel.push(nivel);
        }
      );
    }

    gestionSolicitudCredito.onCalcularValorMetodo = function (clase, item) {
      if (
        gestionSolicitudCredito.solicitudCredito.linea === null ||
        gestionSolicitudCredito.solicitudCredito.linea === undefined
      ) {
        return;
      }
      if (clase === undefined) {
        // && gestionSolicitudCredito.report.selectedNivel.length > 0){
        clase = false;
      }

      if (!clase) {
        if (
          gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
          gestionSolicitudCredito.simple
        ) {
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
          var h = gestionSolicitudCredito.solicitudCredito.valorModulo;
          var j = 0;
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = parseInt(
            (
              gestionSolicitudCredito.solicitudCredito.valorTotalModulos + h
            ).toFixed(2)
          );
          gestionSolicitudCredito.solicitudCredito.fechaPago = item.fecha3;
        } else {
          var h = gestionSolicitudCredito.solicitudCredito.valorModulo;
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = parseInt(
            (
              gestionSolicitudCredito.solicitudCredito.valorTotalModulos + h
            ).toFixed(2)
          );
          if (
            gestionSolicitudCredito.listaNiveles.length ===
            gestionSolicitudCredito.report.selectedNivel.length + 1
          ) {
            gestionSolicitudCredito.solicitudCredito.seleccionarTodos = true;
          } else {
            gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
          }
        }
      } else {
        if (
          gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
          gestionSolicitudCredito.simple
        ) {
        } else {
          var h = gestionSolicitudCredito.solicitudCredito.valorModulo;
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = parseInt(
            (
              gestionSolicitudCredito.solicitudCredito.valorTotalModulos - h
            ).toFixed(2)
          );
          gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
        }
      }
    };

    gestionSolicitudCredito.onSeleccionarTodos = function () {
      if (
        gestionSolicitudCredito.solicitudCredito.seleccionarTodos === null ||
        gestionSolicitudCredito.solicitudCredito.seleccionarTodos === undefined
      ) {
        return;
      }
      if (gestionSolicitudCredito.listaNiveles.length !== 0) {
        if (gestionSolicitudCredito.solicitudCredito.seleccionarTodos) {
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
          gestionSolicitudCredito.report.selectedNivel =
            gestionSolicitudCredito.listaNiveles.slice();
          var h = gestionSolicitudCredito.solicitudCredito.valorModulo;
          var valor = parseInt(
            (
              gestionSolicitudCredito.solicitudCredito.valorTotalModulos + h
            ).toFixed(2)
          );
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos =
            valor * gestionSolicitudCredito.listaNiveles.length;
        } else {
          gestionSolicitudCredito.report.selectedNivel = [];
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
        }
      }
    };

    function onBuscarMayorFecha(lista, index, mayor) {
      if (lista.length <= index) {
        return mayor;
      }
      if (onToDateString(lista[index].fecha3) > onToDateString(mayor.fecha3)) {
        mayor = lista[index];
      }
      return onBuscarMayorFecha(lista, index + 1, mayor);
    }
    function onBuscarMenorFecha(lista, index, menor) {
      if (lista.length <= index) {
        return menor;
      }
      if (onToDateString(lista[index].fecha1) < onToDateString(menor.fecha1)) {
        menor = lista[index];
      }
      return onBuscarMenorFecha(lista, index + 1, menor);
    }

    function onBuscarMayorFechaByModulo(lista) {
      if (lista.length === 1) {
        return lista[0];
      }
      var mayor = lista[0];
      for (var i = 0; i < lista.length; i++) {
        if (
          onToDateString(onFormattedDate(lista[i].fechaParcialN3)) >
          onToDateString(onFormattedDate(mayor.fechaParcialN3))
        ) {
          mayor = lista[i];
        }
      }
      return mayor;
    }

    function formaterFecha(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 2),
        day = "" + d.getDate(),
        year = d.getFullYear();
      var ultimoDia = new Date(d.getFullYear(), d.getMonth() + 2, 0);
      return ultimoDia;
    }

    gestionSolicitudCredito.onChangeLineaCredito = function () {
      gestionSolicitudCredito.report.selectedNivel = [];
      if (
        gestionSolicitudCredito.solicitudCredito.linea === null ||
        gestionSolicitudCredito.solicitudCredito.linea === undefined ||
        gestionSolicitudCredito.solicitudCredito.linea === ""
      ) {
        gestionSolicitudCredito.solicitudCredito.multiple = false;
        gestionSolicitudCredito.solicitudCredito.numeroCuotas = null;
        gestionSolicitudCredito.solicitudCredito.totalCartera = 0;
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
        gestionSolicitudCredito.solicitudCreditoAuxiliar.hideTable = false;
        localStorageService.set(
          "solicitudCreditoAuxiliar",
          gestionSolicitudCredito.solicitudCreditoAuxiliar
        );
        return;
      }
      if (
        gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
        gestionSolicitudCredito.simple
      ) {
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
        gestionSolicitudCredito.solicitudCredito.multiple = false;
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      } else if (
        gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
        gestionSolicitudCredito.formal
      ) {
        gestionSolicitudCredito.solicitudCredito.multiple = "multiply";
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
        gestionSolicitudCredito.solicitudCredito.numeroCuotas = null;
        gestionSolicitudCredito.solicitudCredito.periodo = "";
        gestionSolicitudCredito.solicitudCredito.fecha1 = "1";
        gestionSolicitudCredito.solicitudCredito.fecha2 =
          parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) + 15;
        $timeout(function () {
          $(".spinner-input").TouchSpin({
            verticalbuttons: true,
            min: 1,
            max: 30,
          });
        }, 50);
      } else {
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos = 0;
        gestionSolicitudCredito.solicitudCredito.multiple = "multiply";
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      }

      onBuscarParametroCredito(
        gestionSolicitudCredito.solicitudCredito.linea.codigo
      );
      gestionSolicitudCredito.solicitudCreditoAuxiliar.hideTable = true;
      localStorageService.set(
        "solicitudCreditoAuxiliar",
        gestionSolicitudCredito.solicitudCreditoAuxiliar
      );
    };

    function onCalcularDiasByMes(fecha, fechaMenor) {
      gestionSolicitudCredito.solicitudCredito.fechaActual = onFormattedDate(
        new Date()
      );
      gestionSolicitudCredito.solicitudCredito.fechaInicioCredito = fechaMenor;
      var fechaInicio =
        gestionSolicitudCredito.solicitudCredito.fechaInicioCredito;
      var fechaFin = fecha;
      if (fechaInicio.length !== 10 || fechaFin.length !== 10) {
        difDias = 0;
      } else {
        var diaInicio = fechaInicio.substring(0, 2);
        var mesInicio = fechaInicio.substring(3, 5);
        var anoInicio = fechaInicio.substring(6, 10);
        var diaFin = fechaFin.substring(0, 2);
        var mesFin = fechaFin.substring(3, 5);
        var anoFin = fechaFin.substring(6, 10);
        var f1 = new Date(anoInicio, mesInicio, diaInicio);
        var f2 = new Date(anoFin, mesFin, diaFin);
        var difDias =
          Math.floor((f2.getTime() - f1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
      var resultado = parseInt(
        difDias / parseInt(gestionSolicitudCredito.solicitudCredito.periodo)
      );
      if (resultado <= 0) {
        resultado = 1;
      }
      return resultado;
    }

    gestionSolicitudCredito.onBlurFechas = function () {
      if (
        gestionSolicitudCredito.solicitudCredito.fecha1 === null ||
        gestionSolicitudCredito.solicitudCredito.fecha1 === undefined ||
        gestionSolicitudCredito.solicitudCredito.fecha1 === ""
      ) {
        gestionSolicitudCredito.solicitudCredito.fecha1 = "1";
      }
      if (gestionSolicitudCredito.solicitudCredito.periodo === "15") {
        if (parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) > 15) {
          gestionSolicitudCredito.solicitudCredito.fecha2 =
            parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) - 15;
        } else {
          gestionSolicitudCredito.solicitudCredito.fecha2 =
            parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) + 15;
        }
      } else {
      }
    };
    gestionSolicitudCredito.onChangeFechas = function () {
      if (gestionSolicitudCredito.solicitudCredito.periodo === "15") {
        if (parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) > 15) {
          gestionSolicitudCredito.solicitudCredito.fecha2 =
            parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) - 15;
        } else {
          gestionSolicitudCredito.solicitudCredito.fecha2 =
            parseInt(gestionSolicitudCredito.solicitudCredito.fecha1) + 15;
        }
      } else {
      }
    };
    gestionSolicitudCredito.onChangePeriodo = function () {
      if (gestionSolicitudCredito.solicitudCredito.periodo === "15") {
        gestionSolicitudCredito.solicitudCredito.fecha1 = 1;
        gestionSolicitudCredito.solicitudCredito.fecha2 =
          gestionSolicitudCredito.solicitudCredito.fecha1 + 15;
      } else {
        gestionSolicitudCredito.solicitudCredito.fecha1 = 1;
      }
      $(".spinner-input").TouchSpin({
        verticalbuttons: true,
        min: 1,
        max: 30,
      });
    };
    gestionSolicitudCredito.onChangeFechaPago = function (item, id) {
      if (
        gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
        gestionSolicitudCredito.simple
      ) {
        var index =
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.indexOf(
            item
          );
        var objeto =
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[index];
        var objetoMenos =
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
            index - 1
          ];
        var objetoMas =
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
            index + 1
          ];
        if (objetoMenos !== null && objetoMenos !== undefined) {
          if (
            onToDateString(objeto.fecha) < onToDateString(objetoMenos.fecha)
          ) {
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
              index
            ].fecha = objetoMas.fecha;
          }
        }
        if (objetoMas !== null && objetoMas !== undefined) {
          if (onToDateString(objeto.fecha) > onToDateString(objetoMas.fecha)) {
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
              index
            ].fecha = objetoMas.fecha;
          }
        }
        $("#fechaP.input-group.date input#" + id).val(
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[index]
            .fecha
        );
        $("#fechaP.input-group.date input#" + id).datepicker("update");
      }
    };

    function sumarDias(fecha, dias) {
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
    }

    gestionSolicitudCredito.onClickFechaPago = function () {
      //            var fecha = new Date();
      //            fecha = onFormattedDate(gestionSolicitudCredito.fechainicial);
      //Se configura la Fecha
      var fechaApertura = sumarDias(new Date(), -1);
      $timeout(function () {
        $("#fechaP.input-group.date").datepicker({
          format: "dd/mm/yyyy",
          language: "es",
          autoclose: true,
          beforeShowYear: function (date) {
            if (date < fechaApertura) {
              return false;
            }
          },
          beforeShowMonth: function (date) {
            if (date < fechaApertura) {
              return false;
            }
          },
          beforeShowDay: function (date) {
            if (date < fechaApertura) {
              return false;
            }
          },
          //                    beforeShowYear: function (date) {
          //                        if (date.getFullYear() < 1900) {
          //                            return false;
          //                        }
          //                        if (date <= onToDateString(fecha)) {
          //                            return false;
          //                        }
          //                        if (date > onToDateString(gestionSolicitudCredito.solicitudCredito.fechaPago)) {
          //                            return false;
          //                        }
          //                    },
          //                    beforeShowMonth: function (date) {
          //                        if (date.getFullYear() < 1900) {
          //                            return false;
          //                        }
          //                        if (date <= onToDateString(fecha)) {
          //                            return false;
          //                        }
          //                        if (date > onToDateString(gestionSolicitudCredito.solicitudCredito.fechaPago)) {
          //                            return false;
          //                        }
          //                    },
          //                    beforeShowDay: function (date) {
          //                        if (date.getFullYear() < 1900) {
          //                            return false;
          //                        }
          //                        if (date < onToDateString(fecha)) {
          //                            return false;
          //                        }
          //                        if (date === onToDateString(fecha)) {
          //                            return true;
          //                        }
          //                        if (date > onToDateString(gestionSolicitudCredito.solicitudCredito.fechaPago)) {
          //                            return true;
          //                        }
          //                    }
        });
      }, 50);
    };

    /*Limpiar Entidad Solicitud De Crédito*/
    gestionSolicitudCredito.onLimpiar = function () {
      gestionSolicitudCredito.solicitudCredito = null;
      gestionSolicitudCredito.solicitudCredito = {};
      localStorageService.remove("solicitudCredito");
      localStorageService.remove("solicitudCreditoAuxiliar");
      $location.path("/consulta-credito");
    };

    /*Acción Para Validar, Guargar o Editar Períodos Académicos*/
    gestionSolicitudCredito.onSubmitForm = function () {
      if (new ValidationService().checkFormValidity($scope.formSolicitud)) {
        appConstant.MSG_LOADING("Cargando Solicitud de Credito.");
        appConstant.CARGANDO();
        gestionSolicitudCredito.onAddSolicitudCredito();
        new ValidationService().resetForm($scope.formSolicitud);
      }
    };

    gestionSolicitudCredito.onGenerarReporteVista = function () {
      var idSolicitud = gestionSolicitudCredito.solicitudCredito.id;
      if (idSolicitud === null || idSolicitud === undefined) {
        appConstant.MSG_REPORTE_ERROR();
        return;
      } else {
        solicitudCreditoFinancieroServices
          .generarReporteSolicitudByIdSolicitud(idSolicitud)
          .then(function (dataReporte) {
            if (dataReporte.tipo === 200) {
              //gestionSolicitudCredito.onGenerarReporte(dataReporte.objectResponse);
              var objReportSolicitud = {
                SolicitudCredito: dataReporte.objectResponse,
              };
              onGenerarReporteDirecto(objReportSolicitud, 3);
            } else {
              appConstant.MSG_REPORTE_ERROR();
            }
          })
          .catch(function (e) {
            appConstant.MSG_GROWL_ERROR();
            return;
          });
      }
    };

    gestionSolicitudCredito.onUpdateAmortizacion = function () {
      if (new ValidationService().checkFormValidity($scope.formSolicitud)) {
        gestionSolicitudCredito.listaAuxiliarAmportizacion =
          localStorageService.get("solicitudCredito").listaPlanAmortizacion;
        if (
          arraysSonIdenticos(
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion,
            gestionSolicitudCredito.listaAuxiliarAmportizacion
          )
        ) {
          if (
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion
              .length !== 0
          ) {
            var listAux = [];
            var listAuxFechaAmortizacion = [];
            listAuxFechaAmortizacion =
              gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.slice();
            angular.forEach(listAuxFechaAmortizacion, function (value) {
              var tabla = {
                id: value.id,
                idSolicitudCredito: value.idSolicitudCredito,
                cuota: value.cuota,
                fecha: onToDateString(value.fecha),
                prestamo: parseFloat(value.prestamo),
                interes: parseFloat(value.interes),
                amortizacion: parseFloat(value.amortizacion),
                cuotaFija: parseFloat(value.cuotaFija),
                saldoRestante: parseFloat(value.saldoRestante),
                estadoAmortizacion: value.estadoAmortizacion,
              };
              listAux.push(tabla);
            });
            listAuxFechaAmortizacion = listAux;

            if (
              gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
              gestionSolicitudCredito.simple
            ) {
              var nivel = {
                modulo:
                  gestionSolicitudCredito.report.selectedNivel.nombreModulo,
                fechaInicio: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fechaInicio
                ),
                fechaFin: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fechaFin
                ),
                fechaParcialN1: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fecha1
                ),
                fechaParcialN2: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fecha2
                ),
                fechaParcialN3: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fecha3
                ),
                fechaParcialN4: toDate(
                  gestionSolicitudCredito.report.selectedNivel.fecha4
                ),
              };
              gestionSolicitudCredito.report.selectedNivel = [];
              gestionSolicitudCredito.report.selectedNivel.push(nivel);
            } else {
              var listAuxNivel = [];
              angular.forEach(
                gestionSolicitudCredito.report.selectedNivel,
                function (value) {
                  var nivel = {
                    modulo: value.nombreModulo,
                    fechaInicio: toDate(value.fechaInicio),
                    fechaFin: toDate(value.fechaFin),
                    fechaParcialN1: toDate(value.fecha1),
                    fechaParcialN2: toDate(value.fecha2),
                    fechaParcialN3: toDate(value.fecha3),
                    fechaParcialN4: toDate(value.fecha4),
                  };
                  listAuxNivel.push(nivel);
                }
              );
              gestionSolicitudCredito.report.selectedNivel = listAuxNivel;
            }
            var amortizacion = {
              id: gestionSolicitudCredito.solicitudCredito.id,
              idEstudiante:
                gestionSolicitudCredito.solicitudCredito.idEstudiante,
              idLineaCredito: null,
              idUsuario: usuarioSesion.id,
              numeroCuotas: null,
              esCodeudor: null,
              valorFinanciar: null,
              tablaAmortizacionConvenioDTO: listAuxFechaAmortizacion,
              moduloSolicitudConvenio:
                gestionSolicitudCredito.report.selectedNivel,
            };
            var idSolicitud = gestionSolicitudCredito.solicitudCredito.id;
            solicitudCreditoFinancieroServices
              .modificarFechasAmortizacion(amortizacion)
              .then(function (data) {
                solicitudCreditoFinancieroServices
                  .generarReporteSolicitudByIdSolicitud(idSolicitud)
                  .then(function (dataReporte) {
                    gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
                    if (dataReporte.tipo === 200) {
                      //gestionSolicitudCredito.onGenerarReporte(dataReporte.objectResponse);
                      var objReportSolicitud = {
                        SolicitudCredito: dataReporte.objectResponse,
                      };
                      onGenerarReporteDirecto(objReportSolicitud, 3);
                    } else {
                      appConstant.MSG_REPORTE_ERROR();
                    }
                    localStorageService.set(
                      "solicitudCredito",
                      gestionSolicitudCredito.solicitudCredito
                    );
                    localStorageService.set(
                      "solicitudCreditoAuxiliar",
                      gestionSolicitudCredito.solicitudCreditoAuxiliar
                    );
                    appConstant.MSG_GROWL_OK(
                      appGenericConstant.FECHA_PLAN_AMORTIZACION_MODIFICADA_SATIS
                    );
                  })
                  .catch(function (e) {
                    gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
                    appConstant.MSG_GROWL_ERROR();
                    return;
                  });
              })
              .catch(function (e) {
                gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
                appConstant.MSG_GROWL_ERROR();

                return;
              });
          } else {
            appConstant.MSG_GROWL_ADVERTENCIA(
              appGenericConstant.REALICE_SIMULACION
            );
          }
        }
      }
    };

    function validarCampos(campo) {
      appConstant.CERRAR_SWAL();
      return campo === "" || campo === null || campo === undefined;
    }

    gestionSolicitudCredito.onAddSolicitudCredito = function () {
      if (validarCampos(gestionSolicitudCredito.solicitudCredito.barrio)) {
        appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo barrrio");
        return;
      }
      if (validarCampos(gestionSolicitudCredito.solicitudCredito.telefono)) {
        appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo telefono");
        return;
      }
      if (validarCampos(gestionSolicitudCredito.solicitudCredito.direccion)) {
        appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo direccion");
        return;
      }
      if (
        validarCampos(gestionSolicitudCredito.solicitudCredito.ciudadMunicipio)
      ) {
        appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo Ciudad/Municipio");
        return;
      }

      if (gestionSolicitudCredito.solicitudCredito.esCodeudor === "no") {
        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente
              .idTipoIdentificacion
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA(
            "Actualice campo tipo identificacion"
          );
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.identificacion
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo identificacion");
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.ciudadExpedicion
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo ciudadExpedicion");
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.nombre
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo nombre");
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.apellido
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo apellido");
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.email
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo email");
          return;
        }

        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.telefono
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo telefono");
          return;
        }
        if (
          validarCampos(
            gestionSolicitudCredito.solicitudCredito.acudiente.celular
          )
        ) {
          appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo celular");
          return;
        }
      }

      if (
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion
          .length !== 0
      ) {
        var listAux = [];
        var listAuxFechaAmortizacion = [];
        listAuxFechaAmortizacion =
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.slice();
        angular.forEach(listAuxFechaAmortizacion, function (value) {
          var tabla = {
            cuota: value.cuota,
            fecha: onToDateString(value.fecha),
            prestamo: parseFloat(value.prestamo),
            interes: parseFloat(value.interes),
            amortizacion: parseFloat(value.amortizacion),
            cuotaFija: parseFloat(value.cuotaFija),
            saldoRestante: parseFloat(value.saldoRestante),
            estadoAmortizacion: value.estadoAmortizacion,
          };
          listAux.push(tabla);
        });
        listAuxFechaAmortizacion = listAux;
        if (
          gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
          gestionSolicitudCredito.simple
        ) {
          var nivel = {
            modulo: gestionSolicitudCredito.report.selectedNivel.nombreModulo,
            fechaInicio: toDate(
              gestionSolicitudCredito.report.selectedNivel.fechaInicio
            ),
            fechaFin: toDate(
              gestionSolicitudCredito.report.selectedNivel.fechaFin
            ),
            fechaParcialN1: toDate(
              gestionSolicitudCredito.report.selectedNivel.fecha1
            ),
            fechaParcialN2: toDate(
              gestionSolicitudCredito.report.selectedNivel.fecha2
            ),
            fechaParcialN3: toDate(
              gestionSolicitudCredito.report.selectedNivel.fecha3
            ),
            fechaParcialN4: toDate(
              gestionSolicitudCredito.report.selectedNivel.fecha4
            ),
          };
          gestionSolicitudCredito.report.selectedNivel = [];
          gestionSolicitudCredito.report.selectedNivel.push(nivel);
        } else {
          var listAuxNivel = [];
          angular.forEach(
            gestionSolicitudCredito.report.selectedNivel,
            function (value) {
              var nivel = {
                modulo: value.nombreModulo,
                fechaInicio: toDate(value.fechaInicio),
                fechaFin: toDate(value.fechaFin),
                fechaParcialN1: toDate(value.fecha1),
                fechaParcialN2: toDate(value.fecha2),
                fechaParcialN3: toDate(value.fecha3),
                fechaParcialN4: toDate(value.fecha4),
              };
              listAuxNivel.push(nivel);
            }
          );
          gestionSolicitudCredito.report.selectedNivel = listAuxNivel;
        }

        gestionSolicitudCredito.solicitudCredito.acudiente.tipoDocumento =
          gestionSolicitudCredito.solicitudCredito.acudiente.idTipoIdentificacion;

        var solicitudCre = {
          idEstudiante: gestionSolicitudCredito.solicitudCredito.idEstudiante,
          idLineaCredito: gestionSolicitudCredito.solicitudCredito.linea.codigo,
          idUsuario: usuarioSesion.id,
          numeroCuotas: gestionSolicitudCredito.solicitudCredito.numeroCuotas,
          esCodeudor: gestionSolicitudCredito.solicitudCredito.esCodeudor,
          valorFinanciar:
            gestionSolicitudCredito.solicitudCredito.valorTotalModulos,
          tablaAmortizacionConvenioDTO: listAuxFechaAmortizacion,
          moduloSolicitudConvenio: gestionSolicitudCredito.report.selectedNivel,
          acudiente: gestionSolicitudCredito.solicitudCredito.acudiente,
          barrio: gestionSolicitudCredito.solicitudCredito.barrio,
          telefono: gestionSolicitudCredito.solicitudCredito.telefono,
          direccion: gestionSolicitudCredito.solicitudCredito.direccion,
          ciudadMunicipio:
            gestionSolicitudCredito.solicitudCredito.ciudadMunicipio,
        };
        solicitudCreditoFinancieroServices
          .agregarSolicitudCredito(solicitudCre)
          .then(function (data) {
            gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
            $location.path("/consulta-credito");
            //gestionSolicitudCredito.onGenerarReporte(data.objectResponse);
            var objReportSolicitud = {
              SolicitudCredito: data.objectResponse,
            };
            onGenerarReporteDirecto(objReportSolicitud, 3);
            gestionSolicitudCredito.solicitudCredito.numeroSolicitud =
              data.numeroSolicitud;
            gestionSolicitudCredito.solicitudCreditoAuxiliar.solicitudRealizada = true;
            localStorageService.remove("solicitudCredito");
            localStorageService.remove("solicitudCreditoAuxiliar");
            appConstant.CERRAR_SWAL();
            appConstant.MSG_GROWL_OK(
              appGenericConstant.SOLICITUD_CREDITO_EXITOSO
            );
          })
          .catch(function (e) {
            gestionSolicitudCredito.solicitudCredito.seleccionarTodos = false;
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
            gestionSolicitudCredito.report.selectedNivel = [];
            if (
              gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
              gestionSolicitudCredito.formal
            ) {
              gestionSolicitudCredito.solicitudCredito.numeroCuotas = null;
            }
            appConstant.MSG_GROWL_ERROR();
            return;
          });
      } else {
        appConstant.MSG_GROWL_ADVERTENCIA(
          appGenericConstant.REALICE_SIMULACION
        );
      }
    };

    function onValidarPeriodicidad(fecha) {
      var d = fecha,
        month = "" + d.getMonth(),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (parseInt(day) > 15) {
        if (month === "1") {
          day = "28";
        } else {
          day = "30";
        }
      } else {
        day = "15";
      }
      return new Date(year, month, day);
    }

    gestionSolicitudCredito.simulacion = function () {
      if (new ValidationService().checkFormValidity($scope.formSolicitud)) {
        if (validaciones()) {
          if (
            gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
            gestionSolicitudCredito.formal
          ) {
            var mayor = gestionSolicitudCredito.report.selectedNivel[0];
            var ultimaFecha = onBuscarMayorFecha(
              gestionSolicitudCredito.report.selectedNivel,
              0,
              mayor
            );
            var primeraFecha = onBuscarMenorFecha(
              gestionSolicitudCredito.report.selectedNivel,
              0,
              mayor
            );
            //                        gestionSolicitudCredito.solicitudCredito.numeroCuotas = onCalcularDiasByMes(ultimaFecha.fecha3, primeraFecha.fecha1);
            if (
              parseInt(gestionSolicitudCredito.solicitudCredito.periodo) === 15
            ) {
              gestionSolicitudCredito.solicitudCredito.numeroCuotas =
                gestionSolicitudCredito.solicitudCredito.numeroCuotas * 2;
            }
            //                        var fecha = onToDateString(onSumarDiasFecha(new Date(), null, 15));
            var fecha = onToDateString(
              onSumarDiasFecha(onToDateString(primeraFecha.fecha1), null, 15)
            );
            gestionSolicitudCredito.fechainicial = primeraFecha.fecha1; //onFormattedDate(onValidarPeriodicidad(fecha));
            gestionSolicitudCredito.solicitudCredito.fechaPago =
              ultimaFecha.fecha3;
            onSimulacionFormal();
          } else if (
            gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
            gestionSolicitudCredito.brilla
          ) {
            var mayor = gestionSolicitudCredito.report.selectedNivel[0];
            var ultimaFecha = onBuscarMayorFecha(
              gestionSolicitudCredito.report.selectedNivel,
              0,
              mayor
            );
            gestionSolicitudCredito.solicitudCredito.fechaPago =
              ultimaFecha.fecha3;
            gestionSolicitudCredito.fechainicial = onSumarDiasFecha(
              new Date(),
              null,
              gestionSolicitudCredito.cantDiasBrilla
            );
            onSimulacionBrilla();
          } else if (
            gestionSolicitudCredito.solicitudCredito.linea.idLinea ===
            gestionSolicitudCredito.manual
          ) {
            var mayor = gestionSolicitudCredito.report.selectedNivel[0];
            var ultimaFecha = onBuscarMayorFecha(
              gestionSolicitudCredito.report.selectedNivel,
              0,
              mayor
            );
            var primeraFecha = onBuscarMenorFecha(
              gestionSolicitudCredito.report.selectedNivel,
              0,
              mayor
            );
            var fecha = onToDateString(
              onSumarDiasFecha(onToDateString(primeraFecha.fecha1), null, 15)
            );
            gestionSolicitudCredito.fechainicial = primeraFecha.fecha1; //onFormattedDate(onValidarPeriodicidad(fecha));
            gestionSolicitudCredito.solicitudCredito.fechaPago =
              ultimaFecha.fecha3;
            onSimulacionManual();
          } else {
            onSimularSimple();
          }
        }
      }
    };

    function onSimularSimple() {
      var fechaInicial = gestionSolicitudCredito.report.selectedNivel.fecha2;
      var interesCorriente =
        gestionSolicitudCredito.parametroCredito.interesCorriente / 100;
      var prestamoXInteresCorriente = (
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos *
        interesCorriente
      ).toFixed(2);
      var th = 1 + interesCorriente;
      var ht = Math.pow(
        th,
        parseInt(-gestionSolicitudCredito.solicitudCredito.numeroCuotas)
      );
      var tr = 1 - ht;
      var f;
      if (interesCorriente <= 0) {
        f =
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos /
          parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas);
      } else {
        f = Math.ceil(prestamoXInteresCorriente / tr).toFixed(2);
      }
      gestionSolicitudCredito.solicitudCredito.cuotaFija = f;
      gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      var prestamoInicial =
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos.toFixed(2);
      var interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
      var amortizacionInicial = (
        gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
      ).toFixed(2);
      for (
        var i = 1;
        i <= gestionSolicitudCredito.solicitudCredito.numeroCuotas;
        i++
      ) {
        if (
          i === parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas)
        ) {
          var simulacion = {
            cuota: i,
            fecha: fechaInicial,
            prestamo: prestamoInicial,
            interes: interesInicial,
            amortizacion: amortizacionInicial,
            cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
            saldoRestante: Math.round(
              amortizacionInicial - amortizacionInicial
            ).toFixed(2),
            estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
          };
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
            simulacion
          );
          gestionSolicitudCredito.onClickFechaPago();
        }
      }
    }

    function onSimulacionManual() {
      var fechaInicial = gestionSolicitudCredito.fechainicial;
      var interesCorriente =
        gestionSolicitudCredito.parametroCredito.interesCorriente / 100;
      var prestamoXInteresCorriente = (
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos *
        interesCorriente
      ).toFixed(2);
      var th = 1 + interesCorriente;
      var ht = Math.pow(
        th,
        parseInt(-gestionSolicitudCredito.solicitudCredito.numeroCuotas)
      );
      var tr = 1 - ht;
      var f;
      if (interesCorriente <= 0) {
        f =
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos /
          parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas);
      } else {
        f = Math.ceil(prestamoXInteresCorriente / tr).toFixed(2);
      }
      gestionSolicitudCredito.solicitudCredito.cuotaFija = Math.floor(f);
      gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      var prestamoInicial =
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos.toFixed(2);
      var interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
      var amortizacionInicial = (
        gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
      ).toFixed(2);
      for (
        var i = 1;
        i <= gestionSolicitudCredito.solicitudCredito.numeroCuotas;
        i++
      ) {
        if (
          i === parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas)
        ) {
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) ===
            1
          ) {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: prestamoInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          } else {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: amortizacionInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          }
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
            simulacion
          );
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) > 1
          ) {
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
              i - 2
            ].saldoRestante = amortizacionInicial;
          }
          for (
            var i = 0;
            i <
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion
              .length;
            i++
          ) {
            if (
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                  i
                ].fecha
              ) >
                onToDateString(
                  gestionSolicitudCredito.solicitudCredito.fechaPago
                ) &&
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.fechaPago
              ) > new Date()
            ) {
              gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                i
              ].fecha = gestionSolicitudCredito.solicitudCredito.fechaPago;
            }
          }
          gestionSolicitudCredito.onClickFechaPago();
          return;
        } else {
          var simulacion = {
            cuota: i,
            fecha: fechaInicial,
            prestamo: prestamoInicial,
            interes: interesInicial,
            amortizacion: amortizacionInicial,
            cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
            saldoRestante: Math.round(
              prestamoInicial - amortizacionInicial
            ).toFixed(2),
            estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
          };
        }
        fechaInicial = onSumarDiasFecha(
          onToDateString(simulacion.fecha),
          null,
          parseInt(gestionSolicitudCredito.solicitudCredito.periodo)
        );
        prestamoInicial = simulacion.saldoRestante;
        interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
        amortizacionInicial = (
          gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
        ).toFixed(2);
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
          simulacion
        );
      }
    }

    function onSimulacionFormal() {
      const discountValue = Number($("#discount").val());
      var fechaInicial = gestionSolicitudCredito.fechainicial;
      var interesCorriente =
        gestionSolicitudCredito.parametroCredito.interesCorriente / 100;
      var prestamoXInteresCorriente = (
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos *
        interesCorriente
      ).toFixed(2);
      var th = 1 + interesCorriente;
      var ht = Math.pow(
        th,
        parseInt(-gestionSolicitudCredito.solicitudCredito.numeroCuotas)
      );
      var tr = 1 - ht;
      var f;
      if (interesCorriente <= 0) {
        f =
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos /
          parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas);
      } else {
        f = Math.ceil(prestamoXInteresCorriente / tr).toFixed(2);
      }
      gestionSolicitudCredito.solicitudCredito.cuotaFija = Math.floor(f);
      gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      var prestamoInicial =
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos.toFixed(2);
      var interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
      var amortizacionInicial = (
        gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
      ).toFixed(2);
      for (
        var i = 1;
        i <= gestionSolicitudCredito.solicitudCredito.numeroCuotas;
        i++
      ) {
        const fixedFee = applyDiscount(
          gestionSolicitudCredito.solicitudCredito.cuotaFija,
          discountValue
        );
        if (
          i === parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas)
        ) {
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) ===
            1
          ) {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: prestamoInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: fixedFee,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          } else {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: amortizacionInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: fixedFee,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          }
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
            simulacion
          );
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) > 1
          ) {
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
              i - 2
            ].saldoRestante = amortizacionInicial;
          }
          for (
            var i = 0;
            i <
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion
              .length;
            i++
          ) {
            if (
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                  i
                ].fecha
              ) >
                onToDateString(
                  gestionSolicitudCredito.solicitudCredito.fechaPago
                ) &&
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.fechaPago
              ) > new Date()
            ) {
              gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                i
              ].fecha = gestionSolicitudCredito.solicitudCredito.fechaPago;
            }
          }
          gestionSolicitudCredito.onClickFechaPago();
          return;
        } else {
          var simulacion = {
            cuota: i,
            fecha: fechaInicial,
            prestamo: prestamoInicial,
            interes: interesInicial,
            amortizacion: amortizacionInicial,
            cuotaFija: fixedFee,
            saldoRestante: Math.round(
              prestamoInicial - amortizacionInicial
            ).toFixed(2),
            estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
          };
        }
        fechaInicial = onSumarDiasFecha(
          onToDateString(simulacion.fecha),
          null,
          parseInt(gestionSolicitudCredito.solicitudCredito.periodo)
        );
        prestamoInicial = simulacion.saldoRestante;
        interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
        amortizacionInicial = (fixedFee - interesInicial).toFixed(2);
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
          simulacion
        );
      }
    }

    function applyDiscount(fixedFee, discountValue) {
      const ZERO = 0;
      const ONE = 1;
      const ONE_HUNDRED = 100;
      const isDiscountEnable = discountValue !== ZERO;
      if (!isDiscountEnable) return fixedFee;
      const discountValuePercent = discountValue / ONE_HUNDRED;
      const realDiscountValue = ONE - discountValuePercent;
      return fixedFee * realDiscountValue;
    }

    function onSimulacionBrilla() {
      var fechaInicial = gestionSolicitudCredito.fechainicial;
      var interesCorriente =
        gestionSolicitudCredito.parametroCredito.interesCorriente / 100;
      var prestamoXInteresCorriente = (
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos *
        interesCorriente
      ).toFixed(2);
      var th = 1 + interesCorriente;
      var ht = Math.pow(
        th,
        parseInt(-gestionSolicitudCredito.solicitudCredito.numeroCuotas)
      );
      var tr = 1 - ht;
      var f;
      if (interesCorriente <= 0) {
        f =
          gestionSolicitudCredito.solicitudCredito.valorTotalModulos /
          parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas);
      } else {
        f = Math.ceil(prestamoXInteresCorriente / tr).toFixed(2);
      }
      gestionSolicitudCredito.solicitudCredito.cuotaFija = f;
      gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
      var prestamoInicial =
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos.toFixed(2);
      var interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
      var amortizacionInicial = (
        gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
      ).toFixed(2);
      for (
        var i = 1;
        i <= gestionSolicitudCredito.solicitudCredito.numeroCuotas;
        i++
      ) {
        if (
          i === parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas)
        ) {
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) ===
            1
          ) {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: prestamoInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          } else {
            var simulacion = {
              cuota: i,
              fecha: fechaInicial,
              prestamo: amortizacionInicial,
              interes: interesInicial,
              amortizacion: amortizacionInicial,
              cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
              saldoRestante: Math.round(
                amortizacionInicial - amortizacionInicial
              ).toFixed(2),
              estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
            };
          }
          gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
            simulacion
          );
          if (
            parseInt(gestionSolicitudCredito.solicitudCredito.numeroCuotas) > 1
          ) {
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
              i - 2
            ].saldoRestante = amortizacionInicial;
          }
          for (
            var i = 0;
            i <
            gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion
              .length;
            i++
          ) {
            if (
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                  i
                ].fecha
              ) >
                onToDateString(
                  gestionSolicitudCredito.solicitudCredito.fechaPago
                ) &&
              onToDateString(
                gestionSolicitudCredito.solicitudCredito.fechaPago
              ) > new Date()
            ) {
              gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion[
                i
              ].fecha = gestionSolicitudCredito.solicitudCredito.fechaPago;
            }
          }
          gestionSolicitudCredito.onClickFechaPago();
          return;
        } else {
          var simulacion = {
            cuota: i,
            fecha: fechaInicial,
            prestamo: prestamoInicial,
            interes: interesInicial,
            amortizacion: amortizacionInicial,
            cuotaFija: gestionSolicitudCredito.solicitudCredito.cuotaFija,
            saldoRestante: Math.round(
              prestamoInicial - amortizacionInicial
            ).toFixed(2),
            estadoAmortizacion: gestionSolicitudCredito.estadoPendiente,
          };
        }
        fechaInicial = onSumarDiasFecha(
          onToDateString(simulacion.fecha),
          null,
          parseInt(gestionSolicitudCredito.solicitudCredito.periodo)
        );
        prestamoInicial = simulacion.saldoRestante;
        interesInicial = (prestamoInicial * interesCorriente).toFixed(2);
        amortizacionInicial = (
          gestionSolicitudCredito.solicitudCredito.cuotaFija - interesInicial
        ).toFixed(2);
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion.push(
          simulacion
        );
      }
    }

    function validaciones() {
      var validar = true;
      if (
        gestionSolicitudCredito.solicitudCredito.linea === null ||
        gestionSolicitudCredito.solicitudCredito.linea === undefined ||
        gestionSolicitudCredito.solicitudCredito.linea === ""
      ) {
        appConstant.MSG_GROWL_ADVERTENCIA(
          appGenericConstant.SELECCIONAR_LINEA_CREDITO
        );

        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
        return (validar = false);
      }
      if (
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos === null ||
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos === 0 ||
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos ===
          undefined ||
        gestionSolicitudCredito.solicitudCredito.valorTotalModulos === ""
      ) {
        appConstant.MSG_GROWL_ADVERTENCIA(
          appGenericConstant.SELECCIONAR_MODULO_FINANCIAR
        );
        gestionSolicitudCredito.solicitudCredito.listaPlanAmortizacion = [];
        return (validar = false);
      }
      return validar;
    }

    function onBuscarLineasCredito() {
      utilServices
        .buscarListaValorByCategoria("LINEA_CREDITO", "financiero")
        .then(function (data) {
          gestionSolicitudCredito.listaLineasCredito = [];
          gestionSolicitudCredito.listaLineasCredito = data;
        })
        .catch(function (e) {
          return;
        });
    }

    function onBuscarParametroCredito(idLinea) {
      solicitudCreditoFinancieroServices
        .buscarParametroCreditoByid(idLinea)
        .then(function (data) {
          gestionSolicitudCredito.parametroCredito = {};
          gestionSolicitudCredito.parametroCredito = data;
          if (gestionSolicitudCredito.parametroCredito.id === null) {
            appConstant.MSG_GROWL_ADVERTENCIA(
              appGenericConstant.LINEA_CREDITO_NO_CONFIGURADA
            );
            gestionSolicitudCredito.solicitudCreditoAuxiliar.hideTable = false;
            return;
          }
          if (
            gestionSolicitudCredito.solicitudCredito.linea.idLinea !==
            gestionSolicitudCredito.formal
          ) {
            gestionSolicitudCredito.solicitudCredito.numeroCuotas =
              gestionSolicitudCredito.parametroCredito.cuotaMinima;
          }
        })
        .catch(function (e) {
          return;
        });
    }

    function onBuscarModulosByModalidad(
      idModalidad,
      idPeriodo,
      idPrograma,
      semestre
    ) {
      solicitudCreditoFinancieroServices
        .onBuscarConfiguracionModulos(idPrograma, semestre)
        .then(function (dataConfig) {
          solicitudCreditoFinancieroServices
            .buscarModulosByModalidad(idModalidad, idPeriodo)
            .then(function (data) {
              var contador = 1;
              gestionSolicitudCredito.listaNiveles = [];
              angular.forEach(data, function (value) {
                if (dataConfig >= contador) {
                  var linea = {
                    nombreModulo: value.modulo,
                    fechas:
                      onFormattedDate(value.fechaInicioCalendario) +
                      " - " +
                      onFormattedDate(value.fechaFinCalendario),
                    fechaInicio: onFormattedDate(value.fechaInicioCalendario),
                    fechaFin: onFormattedDate(value.fechaFinCalendario),
                    fecha1: onFormattedDate(value.fecha1),
                    fecha2: onFormattedDate(value.fecha2),
                    fecha3: onFormattedDate(value.fecha3),
                    fecha4: onFormattedDate(value.fecha4),
                  };
                  gestionSolicitudCredito.listaNiveles.push(linea);
                  contador = contador + 1;
                }
              });
              onActualizarSelectedNivel();
            })
            .catch(function (e) {
              return;
            });
        })
        .catch(function (e) {
          return;
        });
    }

    /*UTILIDADES*/
    function onFormattedDate(date) {
      if (date === null || date === undefined) {
        return;
      }
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [day, month, year].join("/");
    }

    function onSumarDiasFecha(date, dia, dias) {
      var tiempo;
      tiempo = dias * 86400;
      date.setSeconds(tiempo);
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = dia === null ? "" + d.getDate() : "" + dia,
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [day, month, year].join("/");
    }

    function onToDateString(str) {
      if (str !== null && str !== undefined && str !== "") {
        var parts = [];
        if (str.match("/")) {
          parts = str.split("/");
        } else {
          parts = str.split("-");
        }
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }

    function toDate(dateStr) {
      var dateStrLong;
      if (typeof dateStr === "undefined" || typeof dateStr === null) {
        dateStr = null;
        return dateStr;
      } else {
        var parts = [];
        if (dateStr.match("/")) {
          parts = dateStr.split("/");
        } else {
          parts = dateStr.split("-");
        }
        dateStr = new Date(parts[2], parts[1] - 1, parts[0]);
        dateStrLong = Date.parse(dateStr);
        return dateStrLong;
      }
    }

    gestionSolicitudCredito.onEstadoEstilo = function (estado) {
      var style;
      if (estado === gestionSolicitudCredito.estadoPagada) {
        style = "bs-label label-success";
      } else if (estado === gestionSolicitudCredito.estadoPendiente) {
        style = "bs-label label-warning";
      } else if (estado === gestionSolicitudCredito.estadoEnMora) {
        style = "bs-label label-danger";
      } else {
        style = "bs-label label-danger";
      }
      return style;
    };

    function arraysSonIdenticos(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i].fecha !== arr2[i].fecha) {
          return true;
        }
      }
      return false;
    }

    function onGenerarReporteDirecto(json, opcion) {
      appConstant.MSG_REPORTE();
      appConstant.CARGANDO();

      var jsonString = JSON.stringify(json);
      jsonString = opcion + "" + jsonString;
      var urlRequest = "/api/financiero/report/crearReportD/";

      $http
        .post(urlRequest, jsonString, {
          transformRequest: angular.identity,
          headers: {
            Authorization: localStorageService.get("autorizacion").token,
            Campus:
              localStorageService.get("autorizacion").objectResponse
                .idUniversidad,
          },
          responseType: "arraybuffer",
        })
        .success(function (data) {
          var file = new Blob([data], {
            type: "application/pdf",
          });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          appConstant.CERRAR_SWAL();
        })
        .error(function () {
          appConstant.MSG_GROWL_ERROR(
            "Error de conexión: No fue posible conectarse con el servidor"
          );
          appConstant.CERRAR_SWAL();
        });
    }

    gestionSolicitudCredito.onGenerarReporte = function (solicitud) {
      appConstant.MSG_REPORTE();
      appConstant.CARGANDO();
      gestionSolicitudCredito.item = [];
      var headers = {
        Authorization: localStorageService.get("autorizacion").token,
        Campus:
          localStorageService.get("autorizacion").objectResponse.idUniversidad,
      };
      var objReportSolicitud = {
        SolicitudCredito: solicitud,
      };
      var jsonString = JSON.stringify(objReportSolicitud);
      jsonString = "3" + jsonString;
      var urlRequest = "/api/financiero/report/crearReport/";
      $http
        .post(urlRequest, jsonString, headers)
        .then(function (data) {
          if (data.status === 200) {
            gestionSolicitudCredito.item.push(data.data.message);
            gestionSolicitudCredito.download(gestionSolicitudCredito.item[0]);
          } else {
            appConstant.MSG_REPORTE_ERROR();
          }
        })
        .catch(function (e) {
          appConstant.MSG_REPORTE_ERROR();
          appConstant.CERRAR_SWAL();
        });
    };

    gestionSolicitudCredito.download = function (itemArc) {
      var file = utilServices.downloadArchivo(
        itemArc,
        appGenericConstant.MICRO_SERVICIO_FINANCIERO
      );
      if (file !== null && itemArc !== null && itemArc !== undefined) {
        utilServices.downloadReporte(file, itemArc);
        appConstant.CERRAR_SWAL();
      } else {
        appConstant.MSG_REPORTE_ERROR();
        appConstant.CERRAR_SWAL();
      }
    };

    function onBuscarParametrosCreditos() {
      appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
      appConstant.CARGANDO();
      gestionSolicitudCredito.listadoLineasDeCredito2 = [];
      parametrosCreditosServices
        .buscarParametroCreditoByPeriodo()
        .then(function (data) {
          angular.forEach(data, function (value, key) {
            var lineaParametroDeCredito = {
              codigo: value.id,
              valor: value.nombre,
              idLinea: value.idLineaCredito,
            };
            gestionSolicitudCredito.listadoLineasDeCredito2.push(
              lineaParametroDeCredito
            );
          });
          appConstant.CERRAR_SWAL();
        });
    }

    gestionSolicitudCredito.ejecutarConsultarTipoDocumentos = function () {
      utilServices
        .buscarListaValorByCategoria(
          appConstantValueList.LV_TIPO_IDENTIFICACION,
          appGenericConstant.MICRO_SERVICIO_ADMISIONES
        )
        .then(function (data) {
          gestionSolicitudCredito.lsttipodocumentos = data;
        })
        .catch(function (e) {
          return;
        });
    };

    gestionSolicitudCredito.gestionarCodeudor = function () {
      gestionSolicitudCredito.solicitudCredito.colContextBox =
        gestionSolicitudCredito.solicitudCredito.esCodeudor === "si"
          ? "col-lg-12 col-sm-12 col-xs-12"
          : "col-lg-6 col-sm-6 col-xs-12";
      gestionSolicitudCredito.solicitudCredito.colTextBox =
        gestionSolicitudCredito.solicitudCredito.esCodeudor === "si"
          ? "col-lg-6 col-sm-6 col-xs-12"
          : "col-lg-12 col-sm-12 col-xs-12";
    };

    gestionSolicitudCredito.ejecutarConsultarTipoDocumentos();
    onBuscarLineasCredito();
    onBuscarParametrosCreditos();
    // gestionSolicitudCredito.gestionarCodeudor();
  }
})();
