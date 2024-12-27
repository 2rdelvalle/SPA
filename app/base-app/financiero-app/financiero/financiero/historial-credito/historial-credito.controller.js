(function () {
    'use strict';
    angular.module('mytodoApp').controller('HistorialCreditoCtrl', HistorialCreditoCtrl);
    HistorialCreditoCtrl.$inject = ['$scope', 'historialCreditoServices', 'ValidationService', '$filter', 'appConstant', 'appGenericConstant', 'localStorageService', 'cruceReferenciasService'];
    function HistorialCreditoCtrl($scope, historialCreditoServices, ValidationService, $filter, appConstant, appGenericConstant, localStorageService, cruceReferenciasService) {
        var historialCredito = this;
        $(document).ready(function () {
            $('#divNombre').hide();
            $('#divIdentificacion').hide();
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

        historialCredito.estudiante = historialCreditoServices.estudiante;
        historialCredito.identificacionConsultar = null;
        historialCredito.cAcademico;
        historialCredito.inscritos = [];
        historialCredito.nivelesFormacion = [];
        historialCredito.programasAcademicos = [];
        historialCredito.solicitudesEstudiante = [];
        historialCredito.tablaAmortizacionDetalle = new Array();
        historialCredito.filtrados = [];
        historialCredito.display;
        historialCredito.options = appConstant.FILTRO_TABLAS;
        historialCredito.selectedOption = historialCredito.options[0];
        historialCredito.report = {
            selected: null
        };
        historialCredito.disabledConsultar = true;

        historialCredito.onConsultarEstudiante = function (identificacion) {
            historialCreditoServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                if (data.id === null || data.id === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_SE_ENCONTRO_ESTUDIANTE);
                    $('#divNombre,#divIdentificacion,#divPAcademico,#divProgramaAcademico,#divSemestre,#btnConsultarHistoral').hide();
                    historialCredito.solicitudesEstudiante = [];
                    return;
                } else {
                    historialCredito.solicitudesEstudiante = [];
                    historialCredito.estudiante.identificacion = data.tipoDocumento !== null ? data.tipoDocumento + ' ' + data.identificacion : '' + ' ' + data.identificacion;
                    historialCredito.estudiante.nombre = data.nombre + ' ' + data.apellido;
                    angular.forEach(data.solicitudCreditoConvenioDTO, function (value, key) {
                        var solicitud = {
                            codigoEstudiante: value.codigoEstudiante,
                            esCodeudor: value.esCodeudor,
                            esPeriodoActual: value.esPeriodoActual,
                            estadoSolicitud: value.estadoSolicitud,
                            fecha: $filter('date')(value.fecha, 'dd/MM/yyyy hh:mm:ss'),
                            id: value.id,
                            idEstudiante: value.idEstudiante,
                            idLineaCredito: value.idLineaCredito,
                            idModalidad: value.idModalidad,
                            idPeriodo: value.idPeriodo,
                            idPrograma: value.idPrograma,
                            idUsuario: value.idUsuario,
                            identificacion: value.identificacion,
                            moduloSolicitudConvenio: value.moduloSolicitudConvenio,
                            nombreCompletoEstudiante: value.nombreCompletoEstudiante,
                            nombreLineaCredito: value.nombreLineaCredito,
                            nombreModalidad: value.nombreModalidad,
                            nombrePrograma: value.nombrePrograma,
                            nombrePeriodo: value.nombrePeriodo,
                            numeroCuotas: value.numeroCuotas,
                            numeroSolicitud: value.numeroSolicitud,
                            semestre: value.semestre,
                            tablaAmortizacionConvenioDTO: value.tablaAmortizacionConvenioDTO,
                            tablaAmortizacionConvenioReestrucutradoDTO: value.tablaAmortizacionConvenioReestrucutradoDTO,
                            tipoDocumento: value.tipoDocumento,
                            valorFinanciar: value.valorFinanciar,
                            isBrilla: value.idLineaCredito === 161 && value.estadoSolicitud === 'DESEMBOLSADO'
                        };
                        historialCredito.solicitudesEstudiante.push(solicitud);
                    });
                    if (historialCredito.solicitudesEstudiante.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_SOLICITUDES);
                        return;
                    }
                    $('#btnConsultarHistoral').show();
                    $(function () {
                        $('#divNombre,#divIdentificacion').show();
                    });
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        historialCredito.onChangeSemestre = function (item) {
            $("#semestre").val(item.semestre);
        };

        historialCredito.onEstadoEstilo = function (estado) {
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


        historialCredito.onEstadoEstiloAmorti = function (estado) {
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

        historialCredito.ModalUsuario = function (item) {
            historialCredito.tablaAmortizacionDetalle = [];
            angular.forEach(item.tablaAmortizacionConvenioDTO, function (value, key) {
                var solicitud = {
                    amortizacion: value.amortizacion,
                    cuota: value.cuota,
                    cuotaFija: value.cuotaFija,
                    estadoAmortizacion: value.estadoAmortizacion,
                    fecha: $filter('date')(value.fecha, 'dd/MM/yyyy'),
                    fechaPago: $filter('date')(value.fechaPago, 'dd/MM/yyyy'),
                    id: value.id,
                    idSolicitudCredito: value.idSolicitudCredito,
                    interes: value.interes,
                    prestamo: value.prestamo,
                    saldoRestante: value.saldoRestante
                };
                historialCredito.tablaAmortizacionDetalle.push(solicitud);
            });
            historialCredito.numeroSolicitudAmortizacion = item.numeroSolicitud;
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        historialCredito.ModalUsuarioBrilla = function (item) {
            historialCredito.cruceDTO = {};

            historialCredito.cruceDTO = item;
            $('#myModalCruceBrilla').modal({backdrop: 'static', keyboard: false});
            $("#myModalCruceBrilla").modal("show");
        };

        historialCredito.cruzarBrilla = function () {
            appConstant.MSG_CONFIRMACION();
            appConstant.CARGANDO();

            var cruce = {
                idUsuario: localStorageService.get("autorizacion").objectResponse.userDto.id,
                usuario: localStorageService.get("autorizacion").objectResponse.userDto.username,
                idLiquidacion: historialCredito.cruceDTO.tablaAmortizacionConvenioDTO[0].id,
                valorTotal: historialCredito.cruceDTO.valorFinanciar,
                diferencia: historialCredito.cruceDTO.valorTotalBrilla - historialCredito.cruceDTO.valorFinanciar,
                valorTotalBrila: historialCredito.cruceDTO.valorTotalBrilla,
                referenciaBrilla: historialCredito.cruceDTO.referenciaBrilla,
                idSolicitudCredito: historialCredito.cruceDTO.id
            };

            cruceReferenciasService.guardarCruceBrila(cruce).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        $("#myModalCruceBrilla").modal("hide");
                        historialCredito.onConsultarEstudiante(historialCredito.cruceDTO.identificacion); 
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        $("#myModalCruceBrilla").modal("hide");
                        break;
                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        historialCredito.onChangeInput = function () {
            if (historialCredito.cruceDTO.referenciaBrilla === null
                    || historialCredito.cruceDTO.referenciaBrilla === undefined
                    || historialCredito.cruceDTO.referenciaBrilla === ''
                    || historialCredito.cruceDTO.valorTotalBrilla === null
                    || historialCredito.cruceDTO.valorTotalBrilla === undefined
                    || historialCredito.cruceDTO.valorTotalBrilla === '') {
                historialCredito.disabledConsultar = true;
            } else {
                historialCredito.disabledConsultar = historialCredito.cruceDTO.valorTotalBrilla < historialCredito.cruceDTO.valorFinanciar;
            }
        };
    }
})();

