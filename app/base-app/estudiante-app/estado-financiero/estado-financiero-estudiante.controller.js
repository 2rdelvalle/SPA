(function () {
  "use strict";
  angular
    .module("mytodoApp")
    .controller(
      "estadoFinancieroEstudianteCtrl",
      estadoFinancieroEstudianteCtrl
    );
  estadoFinancieroEstudianteCtrl.$inject = [
    "$scope",
    "localStorageService",
    "estadoFinancieroEstudianteServices",
    "growl",
    "ValidationService",
    "$filter",
    "appConstant",
    "appGenericConstant",
  ];
  function estadoFinancieroEstudianteCtrl(
    $scope,
    localStorageService,
    estadoFinancieroEstudianteServices,
    growl,
    ValidationService,
    $filter,
    appConstant,
    appGenericConstant
  ) {
    var estadoFinanciero = this;
    $(document).ready(function () {
      $("#divPAcademico").hide();
      $("#divProgramaAcademico").hide();
      $("#divSemestre").hide();
      $("#btnConsultarHistoral").hide();
      $("#btnCodigoConsultar").prop("disabled", true);
    });
    $scope.isCollapsed = false;
    estadoFinanciero.estudiante = estadoFinancieroEstudianteServices.estudiante;
    estadoFinanciero.liquidacionFianaciera =
      estadoFinancieroEstudianteServices.liquidacion;
    estadoFinanciero.identificacionConsultar = null;
    estadoFinanciero.cAcademico;
    estadoFinanciero.inscritos = [];
    estadoFinanciero.nivelesFormacion = [];
    estadoFinanciero.programasAcademicos = [];
    estadoFinanciero.solicitudesEstudiante = [];
    estadoFinanciero.solicitudesEstudianteLiqudaciones = [];
    estadoFinanciero.tablaAmortizacionDetalle = new Array();
    estadoFinanciero.filtrados = [];
    estadoFinanciero.display;
    estadoFinanciero.options = appConstant.FILTRO_TABLAS;
    estadoFinanciero.selectedOption =
      estadoFinanciero.options[appGenericConstant.CERO];
    estadoFinanciero.totalCreditos = appGenericConstant.CERO;
    estadoFinanciero.totalPagoC = appGenericConstant.CERO;
    estadoFinanciero.totalPago = appGenericConstant.CERO;
    estadoFinanciero.numeroCreditos = appGenericConstant.CERO;
    estadoFinanciero.totalLiqudacionesPendientes = appGenericConstant.CERO;
    estadoFinanciero.totalLiqudacionesPagas = appGenericConstant.CERO;

    estadoFinanciero.totalNumeroLiqudacionesPendientes =
      appGenericConstant.CERO;
    estadoFinanciero.totalNumeroLiqudacionesPagas = appGenericConstant.CERO;

    estadoFinanciero.seMuestra = true;
    estadoFinanciero.seMuestraL = true;
    estadoFinanciero.seMuestraPro = true;
    estadoFinanciero.seMuestraPe = true;
    estadoFinanciero.periodos = [];
    estadoFinanciero.isValidOtherField = {
      hasLetters: true,
      isValidValue: true,
    };
    estadoFinanciero.paymenType = "T";
    estadoFinanciero.detailPayment = {
      idLiquidacion: 0,
      reference: "",
      totalValue: 0,
      value: "",
      concept: "",
    };

    estadoFinanciero.report = {
      selected: null,
    };
    estadoFinanciero.onConsultarEstudiante = function (identificacion) {
      appConstant.MSG_LOADING(appGenericConstant.CONSULTAR_ESTUDIANTE);
      appConstant.CARGANDO();
      estadoFinanciero.totalCreditos = appGenericConstant.CERO;
      estadoFinanciero.totalPagoC = appGenericConstant.CERO;

      estadoFinancieroEstudianteServices
        .buscarEstudianteByCodigo(identificacion)
        .then(function (data) {
          estadoFinanciero.seMuestraL = true;
          estadoFinanciero.seMuestraPro = true;
          estadoFinanciero.seMuestraPe = true;
          estadoFinanciero.solicitudesEstudianteLiqudaciones = data.periodos;
          estadoFinanciero.estudiante.identificacion = data.identificacion;
          estadoFinanciero.estudiante.nombre =
            data.nombreEstudiante + " " + data.apellidoEstudiante;
          estadoFinanciero.estudiante.semestre = data.semestre;
          estadoFinanciero.totalLiqudacionesPendientes =
            appGenericConstant.CERO;
          estadoFinanciero.totalLiqudacionesPagas = appGenericConstant.CERO;
          estadoFinanciero.totalNumeroLiqudacionesPendientes =
            appGenericConstant.CERO;
          estadoFinanciero.totalNumeroLiqudacionesPagas =
            appGenericConstant.CERO;

          estadoFinanciero.totalLiqudacionesPendientes =
            data.valoresTotalesLiquidacionesDTO.totalLiquidacionesPendientes;
          estadoFinanciero.totalLiqudacionesPagas =
            data.valoresTotalesLiquidacionesDTO.totalLiquidacionesPagadas;

          estadoFinanciero.totalNumeroLiqudacionesPendientes =
            data.valoresTotalesLiquidacionesDTO.numeroLiquidacionesPendientes;
          estadoFinanciero.totalNumeroLiqudacionesPagas =
            data.valoresTotalesLiquidacionesDTO.numeroLiquidacionesPagadas;
          estadoFinanciero.numeroLiquidaciones =
            estadoFinanciero.totalNumeroLiqudacionesPagas +
            estadoFinanciero.totalNumeroLiqudacionesPendientes;
          appConstant.CERRAR_SWAL();
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    function totalLiquidaciones(item) {
      if (
        item.estadoLiquidacion === "ABIERTA" ||
        item.estadoDetalleLiquidacion === "ABIERTA"
      ) {
        estadoFinanciero.totalLiqudacionesPendientes += item.valorLiquidacion;
        estadoFinanciero.totalNumeroLiqudacionesPendientes += 1;
      } else if (
        item.estadoLiquidacion === "PAGADA" ||
        item.estadoDetalleLiquidacion === "PAGADA"
      ) {
        estadoFinanciero.totalLiqudacionesPagas += item.valorLiquidacion;
        estadoFinanciero.totalNumeroLiqudacionesPagas += 1;
      }
    }

    function pendiente(item) {
      var ingresa = false;
      var cre = [];
      for (var i = 0; i < item.length; i++) {
        angular.forEach(item[i].listaSolicitud, function (value, key) {
          ingresa = debe(value.listaAmortizacion);
        });
        if (ingresa) {
          cre.push(item[i]);
        }
      }
      return cre;
    }
    function debe(lista) {
      var esta = false;
      angular.forEach(lista, function (value, key) {
        if (value.estadoAmortizacion === "PENDIENTE") {
          esta = true;
        }
      });
      return esta;
    }

    function cambioNombre(item) {
      var res = item.replace(/_/gi, " ").toLowerCase();
      return res;
    }

    estadoFinanciero.mostar = function (valor) {
      if (valor === false) {
        estadoFinanciero.seMuestra = true;
      } else {
        estadoFinanciero.seMuestra = false;
      }
    };
    estadoFinanciero.mostarL = function (valor, liquidacion) {
      if (valor === false) {
        estadoFinanciero.seMuestraL = true;
        estadoFinanciero.liquidaciones = [];
      } else {
        estadoFinanciero.seMuestraL = false;
        estadoFinanciero.liquidaciones = liquidacion;
      }
    };
    estadoFinanciero.mostarPro = function (valor, programas) {
      if (valor === false) {
        estadoFinanciero.seMuestraPro = true;
        estadoFinanciero.programa = [];
      } else {
        estadoFinanciero.seMuestraPro = false;
        estadoFinanciero.programa = programas;
      }
    };
    estadoFinanciero.mostarPe = function (valor, periodos) {
      if (valor === false) {
        estadoFinanciero.seMuestraPe = true;
        estadoFinanciero.periodos = [];
      } else {
        estadoFinanciero.seMuestraPe = false;
        estadoFinanciero.periodos = periodos;
      }
    };

    function verificarPagos(item) {
      var saldo;
      if (item.estadoAmortizacion === "PAGADA") {
        saldo = item.amortizacion;
      } else {
        saldo = appGenericConstant.CERO;
      }
      return saldo;
    }

    function pagos(tablaAmortizacionConvenioDTO) {
      var totalPagoC = appGenericConstant.CERO;
      angular.forEach(tablaAmortizacionConvenioDTO, function (value, key) {
        totalPagoC += verificarPagos(value);
      });

      return totalPagoC;
    }

    estadoFinanciero.onChangeSemestre = function (item) {
      $("#semestre").val(item.semestre);
    };

    estadoFinanciero.onEstadoEstilo = function (estado) {
      var style;
      if (estado === "PAGADA") {
        style = "bs-label label-success";
      } else if (estado === "DESEMBOLSADO") {
        style = "bs-label label-warning";
      } else {
        style = "";
      }
      return style;
    };

    estadoFinanciero.estadoLiquidacionesStyle = function (
      estadoLiquidacion,
      estadoDetalleLiquidacion,
      estadoAbono
    ) {
      var style;
      if (estadoLiquidacion === "PAGADA") {
        if (
          estadoAbono === null ||
          (estadoAbono === "ABIERTO" &&
            estadoDetalleLiquidacion[0].nombreConcepto !== "ABONO")
        ) {
          style = "tile-box  bg-green";
        } else if (
          estadoAbono === "APLICADO" &&
          estadoDetalleLiquidacion[0].nombreConcepto === "ABONO"
        ) {
          //                    estadoDetalleLiquidacion[0].valorLiquidacion
          style = "tile-box  bg-blue";
        } else if (
          estadoAbono === "ABIERTO" &&
          estadoDetalleLiquidacion[0].nombreConcepto === "ABONO"
        ) {
          style = "tile-box  bg-blue";
        } else {
          style = "tile-box  bg-green";
        }
      } else if (estadoLiquidacion === "ABIERTA") {
        style = "tile-box  bg-danger";
      } else {
        style = "";
      }
      return style;
    };

    estadoFinanciero.onEstadoEstiloAmorti = function (estado) {
      var style;
      if (estado === "PAGADA") {
        style = "bs-label label-success";
      } else if (estado === "PENDIENTE") {
        style = "bs-label label-warning";
      } else if (estado === "EN_MORA") {
        style = "bs-label label-danger";
      } else {
        style = "bs-label label-danger";
      }
      return style;
    };

    estadoFinanciero.getTotalSaldoPendiente = function (data) {
      if (!data || !data.length) return;

      var totalNumber = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].estadoLiquidacion !== "ANULADA") {
          totalNumber = totalNumber + parseFloat(data[i].saldoPendiente);
        }
      }
      return Math.round(totalNumber);
    };
    estadoFinanciero.getTotalSaldoAbonado = function (data) {
      if (!data || !data.length) return;

      var totalNumber = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].estadoLiquidacion !== "ANULADA") {
          totalNumber = totalNumber + parseFloat(data[i].saldoAbonado);
        }
      }
      return Math.round(totalNumber);
    };
    estadoFinanciero.getTotalValorLiquidado = function (data) {
      if (!data || !data.length) return;

      var totalNumber = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].estadoLiquidacion !== "ANULADA") {
          totalNumber = totalNumber + parseFloat(data[i].valorLiquidado);
        }
      }
      return Math.round(totalNumber);
    };

    estadoFinanciero.ModalUsuario = function (item) {
      estadoFinanciero.tablaAmortizacionDetalle = [];
      angular.forEach(item.tablaAmortizacionConvenioDTO, function (value, key) {
        var solicitud = {
          amortizacion: value.amortizacion,
          cuota: value.cuota,
          cuotaFija: item.cuotaFija,
          estadoAmortizacion: value.estadoAmortizacion,
          fecha: $filter("date")(value.fecha, "dd/MM/yyyy"),
          id: value.id,
          idSolicitudCredito: value.idSolicitudCredito,
          interes: value.interes,
          prestamo: value.prestamo,
          saldoRestante: value.saldoRestante,
        };
        estadoFinanciero.tablaAmortizacionDetalle.push(solicitud);
      });
      estadoFinanciero.numeroSolicitudAmortizacion = item.numeroSolicitud;
      $("#myModal").modal({ backdrop: "static", keyboard: false });
      $("#myModal").modal("show");
    };
    estadoFinanciero.ModalLiquidacion = function (item) {
      estadoFinanciero.tablaLiquidacionDetalle = [];
      angular.forEach(item.detallesLiquidaciones, function (value, key) {
        var detall = {
          fechaLimitePago: $filter("date")(item.fechaLimitePago, "dd/MM/yyyy"),
          valorLiquidado: value.valorLiquidacion,
          estado: value.estadoDetalleLiquidacion,
          estadoLiquidacion: item.estadoLiquidacion,
        };
        if (detall.estadoLiquidacion === "PAGADA") {
          detall.estado = "PAGADA";
        }

        if (detall.estado === "PAGADA") {
          detall.style = "bs-label label-success";
        } else if (detall.estado === "ABIERTA") {
          detall.style = "bs-label label-danger";
        }
        estadoFinanciero.tablaLiquidacionDetalle.push(detall);
      });

      $("#myModal2").modal({ backdrop: "static", keyboard: false });
      $("#myModal2").modal("show");
    };
    estadoFinanciero.modalWompi = function (item) {
      const {
        saldoPendiente,
        referencia,
        detallesLiquidaciones,
        idLiquidacion,
      } = item;
      const modalWompiId = "modalWompi";
      const ZERO = 0;
      let concept = "";
      if (detallesLiquidaciones.length > ZERO)
        concept = detallesLiquidaciones[ZERO].nombreConcepto;
      estadoFinanciero.detailPayment = {
        idLiquidacion,
        value: ZERO,
        totalValue: saldoPendiente,
        concept,
        reference: referencia,
      };
      $(`#${modalWompiId}`).modal({ backdrop: "static", keyboard: false });
      $(`#${modalWompiId}`).modal("show");
    };
    estadoFinanciero.showButtonPayment = function (item) {
      const { saldoPendiente, estadoLiquidacion } = item;
      const ENABLE_STATUS = "ABIERTA";
      const ENABLE_VALUE = 50000;
      return (
        estadoLiquidacion === ENABLE_STATUS && saldoPendiente >= ENABLE_VALUE
      );
    };
    estadoFinanciero.startPayment = function () {
      const TOTAL_PAYMENT = "T";
      const session = sessionStorage.getItem("ls.usuario");
      let student = {
        identificacion: "",
        email: "",
        apellidos: "",
        nombres: "",
      };
      const { totalValue, value } = this.detailPayment;
      const valueToPay = this.paymenType === TOTAL_PAYMENT ? totalValue : value;
      if (session) student = JSON.parse(session);
      const { identificacion, email, apellidos, nombres } = student;
      const reference = `${
        this.detailPayment.idLiquidacion
      }-${this.generateUUID()}`;
      const currency = "COP";
      const dataForWompi = {
        referencia: reference,
        tipodoc: "CC",
        documento: identificacion,
        valorpago: valueToPay,
        moneda: currency,
        email,
        nombres,
        apellidos,
      };
      this.openWompiChekout(dataForWompi);
    };
    estadoFinanciero.openWompiChekout = async function (data) {
      const modalWompiId = "modalWompi";
      const {
        moneda,
        valorpago,
        referencia,
        email,
        nombres,
        apellidos,
        documento,
        tipodoc,
      } = data;
      const { signature, publicKey } = await this.getSecretIntegrity(data);
      const fullName = this.getFullName(nombres, apellidos);
      const urlWompi = "https://checkout.wompi.co/p/";
      const realUrl =
        `${urlWompi}?public-key=${encodeURIComponent(publicKey.trim())}` +
        `&currency=${encodeURIComponent(moneda)}` +
        `&amount-in-cents=${encodeURIComponent(this.toCents(valorpago))}` +
        `&customer-data:full-name=${encodeURIComponent(fullName)}` +
        `&customer-data:legal-id=${encodeURIComponent(documento)}` +
        `&customer-data:email=${encodeURIComponent(email)}` +
        `&customer-data:legal-id-type=${encodeURIComponent(tipodoc)}` +
        `&reference=${encodeURIComponent(referencia.trim())}` +
        `&signature:integrity=${encodeURIComponent(signature.trim())}`;
      window.open(realUrl, "_blank");
      $(`#${modalWompiId}`).modal("hide");
    };
    estadoFinanciero.getSecretIntegrity = function (body) {
      return estadoFinancieroEstudianteServices.getSecretKey(body);
    };
    estadoFinanciero.generateUUID = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + s4();
    };
    estadoFinanciero.toCents = function (value) {
      const ONE_HUNDRED = 100;
      return parseFloat(value) * ONE_HUNDRED;
    };
    estadoFinanciero.getFullName = function (name, lastNames) {
      return `${name} ${lastNames}`;
    };
    estadoFinanciero.checkOtherValueField = function () {
      const NUMBER_EXP = /^[0-9]*$/;
      const MIN_VALUE = 50000;
      const MAX_VALUE = this.detailPayment.totalValue;
      const value = this.detailPayment.value;
      this.isValidOtherField.hasLetters = NUMBER_EXP.test(value);
      this.isValidOtherField.isValidValue =
        value >= MIN_VALUE && value <= MAX_VALUE;
    };
    estadoFinanciero.isDisabledPaymentButton = function () {
      const PAYMENT_TOTAL = "T";
      const MIN_PAYMENT_TOTAL = 50000;
      const totalValue = this.detailPayment.totalValue;
      const { hasLetters, isValidValue } = this.isValidOtherField;
      return (
        (!hasLetters || !isValidValue) && this.paymenType !== PAYMENT_TOTAL /*||
        totalValue < MIN_PAYMENT_TOTAL*/
      );
    };
    estadoFinanciero.modalHistoricoRecibos = function (item) {
      estadoFinanciero.tablaHistorialRecibos = [];
      estadoFinanciero.tablaHistorialRecibos = item;

      $("#myModal3").modal({ backdrop: "static", keyboard: false });
      $("#myModal3").modal("show");
    };

    estadoFinanciero.usuario = "";
    if (localStorageService.get("usuario") !== null) {
      var usuario = localStorageService.get("usuario");
      estadoFinanciero.usuario = usuario;
    }
    estadoFinanciero.onConsultarEstudiante(
      estadoFinanciero.usuario.identificacion
    );
  }
})();
