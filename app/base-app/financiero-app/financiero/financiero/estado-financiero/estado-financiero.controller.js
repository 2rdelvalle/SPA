(function () {
    'use strict';
    angular.module('mytodoApp').controller('estadoFinancieroCtrl', estadoFinancieroCtrl);
    estadoFinancieroCtrl.$inject = ['$scope', 'estadoFinancieroServices', 'growl', 'ValidationService', '$filter', 'appConstant', 'appGenericConstant'];
    function estadoFinancieroCtrl($scope, estadoFinancieroServices, growl, ValidationService, $filter, appConstant, appGenericConstant) {
        var estadoFinanciero = this;
        $(document).ready(function () {
            $('#divNombre').hide();
            $('#divIdentificacion').hide();
            $('#divSemestre').hide();
            $('#divPAcademico').hide();
            $('#divProgramaAcademico').hide();
            $('#divSemestre').hide();
            $('#btnConsultarHistoral').hide();
            $('#btnCodigoConsultar').prop('disabled', true);
            $('#inputCodigo').keyup(function () {
                $('#btnCodigoConsultar').prop('disabled', this.value === "" ? true : false);
            });
            $("#inputCodigo").on("input", function () {
                var regexp = /[^0-9]/g;
                if ($(this).val().match(regexp)) {
                    $(this).val($(this).val().replace(regexp, ''));
                }
            });
        });

        estadoFinanciero.estudiante = estadoFinancieroServices.estudiante;
        estadoFinanciero.liquidacionFianaciera = estadoFinancieroServices.liquidacion;
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
        estadoFinanciero.selectedOption = estadoFinanciero.options[ appGenericConstant.CERO];
        estadoFinanciero.totalCreditos = appGenericConstant.CERO;
        estadoFinanciero.totalPagoC = appGenericConstant.CERO;
        estadoFinanciero.totalPago = appGenericConstant.CERO;
        estadoFinanciero.numeroCreditos = appGenericConstant.CERO;
        estadoFinanciero.totalLiqudacionesPendientes = appGenericConstant.CERO;
        estadoFinanciero.totalLiqudacionesPagas = appGenericConstant.CERO;
        estadoFinanciero.totalLiquidacionesAnuladas = appGenericConstant.CERO;
        estadoFinanciero.totalNumeroLiqudacionesPendientes = appGenericConstant.CERO;
        estadoFinanciero.totalNumeroLiqudacionesPagas = appGenericConstant.CERO;
        estadoFinanciero.totalNumeroLiqudacionesAnuladas = appGenericConstant.CERO;
        estadoFinanciero.seMuestra = true;
        estadoFinanciero.seMuestraL = true;
        estadoFinanciero.seMuestraPro = true;
        estadoFinanciero.seMuestraPe = true;
        estadoFinanciero.periodos = [];

        estadoFinanciero.report = {
            selected: null
        };
        estadoFinanciero.onConsultarEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                estadoFinanciero.totalCreditos = appGenericConstant.CERO;
                estadoFinanciero.totalPagoC = appGenericConstant.CERO;
                estadoFinancieroServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                    estadoFinanciero.solicitudesEstudiante = [];
                    angular.forEach(data, function (valor, key) {
                        estadoFinanciero.estudiante.identificacion = valor.identificacion;
                        estadoFinanciero.estudiante.nombre = valor.nombreEstudiante + ' ' + valor.apellidoEstudiante;
                        estadoFinanciero.estudiante.semestre = data.semestre;
                        estadoFinanciero.numeroCreditos = data.length;
                        angular.forEach(valor.listaSolicitud, function (value, key) {
                            var estadoF = {
                                numeroSolicitud: value.idSolicitud,
                                tablaAmortizacionConvenioDTO: value.listaAmortizacion,
                                valorFinanciar: value.valorFinanciar,
                                totalPago: pagos(value.listaAmortizacion),
                                cuotaFija: value.cuotaFija
                            };
                            estadoFinanciero.totalCreditos = estadoFinanciero.totalCreditos + estadoF.valorFinanciar;
                            estadoFinanciero.totalPagoC += pagos(estadoF.tablaAmortizacionConvenioDTO);
                            estadoFinanciero.solicitudesEstudiante.push(estadoF);
                        });
                    });
                    $('#btnConsultarHistoral').show();
                    $(function () {
                        $('#divNombre,#divIdentificacion,#divSemestre').show();
                    });
                    estadoFinancieroServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                        estadoFinanciero.seMuestraL = true;
                        estadoFinanciero.seMuestraPro = true;
                        estadoFinanciero.seMuestraPe = true;
                        estadoFinanciero.solicitudesEstudianteLiqudaciones = data.periodos;
                        estadoFinanciero.estudiante.identificacion = data.identificacion;
                        estadoFinanciero.estudiante.nombre = data.nombreEstudiante + ' ' + data.apellidoEstudiante;
                        estadoFinanciero.estudiante.semestre = data.semestre;
                        estadoFinanciero.totalLiqudacionesPendientes = appGenericConstant.CERO;
                        estadoFinanciero.totalLiqudacionesPagas = appGenericConstant.CERO;
                        estadoFinanciero.totalNumeroLiqudacionesPendientes = appGenericConstant.CERO;
                        estadoFinanciero.totalNumeroLiqudacionesPagas = appGenericConstant.CERO;
                        estadoFinanciero.totalNumeroLiqudacionesAnuladas = appGenericConstant.CERO;

                        estadoFinanciero.totalLiqudacionesPendientes = data.valoresTotalesLiquidacionesDTO.totalLiquidacionesPendientes;
                        estadoFinanciero.totalLiqudacionesPagas = data.valoresTotalesLiquidacionesDTO.totalLiquidacionesPagadas;
                        estadoFinanciero.totalLiquidacionesAnuladas = data.valoresTotalesLiquidacionesDTO.totalLiquidacionesAnuladas;
                        estadoFinanciero.totalNumeroLiqudacionesPendientes = data.valoresTotalesLiquidacionesDTO.numeroLiquidacionesPendientes;
                        estadoFinanciero.totalNumeroLiqudacionesPagas = data.valoresTotalesLiquidacionesDTO.numeroLiquidacionesPagadas;
                        estadoFinanciero.totalNumeroLiqudacionesAnuladas = data.valoresTotalesLiquidacionesDTO.numeroLiquidacionesAnuladas;
                        estadoFinanciero.numeroLiquidaciones = estadoFinanciero.totalNumeroLiqudacionesPagas + estadoFinanciero.totalNumeroLiqudacionesPendientes
                                + estadoFinanciero.totalNumeroLiqudacionesAnuladas;

                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        function totalLiquidaciones(item) {
            if (item.estadoLiquidacion === "ABIERTA" || item.estadoDetalleLiquidacion === "ABIERTA") {
                estadoFinanciero.totalLiqudacionesPendientes += item.valorLiquidacion;
                estadoFinanciero.totalNumeroLiqudacionesPendientes += 1;
            } else if (item.estadoLiquidacion === "PAGADA" || item.estadoDetalleLiquidacion === "PAGADA") {
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
        function  debe(lista) {
            var esta = false;
            angular.forEach(lista, function (value, key) {
                if (value.estadoAmortizacion === "PENDIENTE") {
                    esta = true;
                }
            });
            return esta;
        }

        function   cambioNombre(item) {
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

        estadoFinanciero.estadoLiquidacionesStyle = function (estadoLiquidacion, estadoDetalleLiquidacion, estadoAbono) {
            var style;
            if (estadoLiquidacion === "PAGADA") {

                if (estadoAbono === null || estadoAbono === "ABIERTO" && estadoDetalleLiquidacion[0].nombreConcepto !== "ABONO") {
                    style = "tile-box  bg-green";
                } else if (estadoAbono === "APLICADO" && estadoDetalleLiquidacion[0].nombreConcepto === "ABONO") {
//                    estadoDetalleLiquidacion[0].valorLiquidacion 
                    style = "tile-box  bg-blue";
                } else if (estadoAbono === "ABIERTO" && estadoDetalleLiquidacion[0].nombreConcepto === "ABONO") {
                    style = "tile-box  bg-blue";
                } else {
                    style = "tile-box  bg-green";
                }

            } else if (estadoLiquidacion === "ABIERTA") {
                style = "tile-box  bg-danger";
            } else if (estadoLiquidacion === "ANULADA") {
                style = "tile-box  bg-black";
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
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].estadoLiquidacion !== 'ANULADA') {
                    totalNumber = totalNumber + parseFloat(data[i].saldoPendiente);
                }
            }
            return Math.round(totalNumber);
        };
        estadoFinanciero.getTotalSaldoAbonado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].estadoLiquidacion !== 'ANULADA') {
                    totalNumber = totalNumber + parseFloat(data[i].saldoAbonado);
                }
            }
            return Math.round(totalNumber);
        };

        estadoFinanciero.getTotalValorLiquidado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].estadoLiquidacion !== 'ANULADA') {
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
                    fecha: $filter('date')(value.fecha, 'dd/MM/yyyy'),
                    id: value.id,
                    idSolicitudCredito: value.idSolicitudCredito,
                    interes: value.interes,
                    prestamo: value.prestamo,
                    saldoRestante: value.saldoRestante
                };
                estadoFinanciero.tablaAmortizacionDetalle.push(solicitud);
            });
            estadoFinanciero.numeroSolicitudAmortizacion = item.numeroSolicitud;
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };
        estadoFinanciero.ModalLiquidacion = function (item) {
            estadoFinanciero.tablaLiquidacionDetalle = [];
            angular.forEach(item.detallesLiquidaciones, function (value, key) {
                var detall = {
                    fechaLimitePago: $filter('date')(item.fechaLimitePago, 'dd/MM/yyyy'),
                    valorLiquidado: value.valorLiquidacion,
                    estado: value.estadoDetalleLiquidacion,
                    estadoLiquidacion: item.estadoLiquidacion
                };
                if (detall.estadoLiquidacion === "PAGADA") {
                    detall.estado = "PAGADA";
                }

                if (detall.estado === "PAGADA") {
                    detall.style = "bs-label label-success";
                } else if (detall.estado === "ABIERTA") {
                    detall.style = "bs-label label-danger";
                } else if (detall.estado === "ANULADA") {
                    detall.style = "bs-label label-black";
                }
                estadoFinanciero.tablaLiquidacionDetalle.push(detall);
            });

            $('#myModal2').modal({backdrop: 'static', keyboard: false});
            $("#myModal2").modal("show");
        };

        estadoFinanciero.modalHistoricoRecibos = function (item) {
            estadoFinanciero.tablaHistorialRecibos = [];
            estadoFinanciero.tablaHistorialRecibos = item;

            $('#myModal3').modal({backdrop: 'static', keyboard: false});
            $("#myModal3").modal("show");
        };
    }
})();



