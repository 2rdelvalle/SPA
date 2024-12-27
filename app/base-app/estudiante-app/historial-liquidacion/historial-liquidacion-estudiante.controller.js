(function () {
    'use strict';
    angular.module('mytodoApp').controller('HistorialLiquidacionEstudianteCtrl', HistorialLiquidacionEstudianteCtrl);
    HistorialLiquidacionEstudianteCtrl.$inject = ['$scope', 'historialLiquidacionEstudianteServices', 'ValidationService', '$http', 'utilServices', '$window', 'appConstant', 'appGenericConstant', 'localStorageService'];
    function HistorialLiquidacionEstudianteCtrl($scope, historialLiquidacionEstudianteServices, ValidationService, $http, utilServices, $window, appConstant, appGenericConstant, localStorageService) {
        var historialLiquidacion = this;
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
        historialLiquidacion.estudiante = historialLiquidacionEstudianteServices.estudiante;
        historialLiquidacion.identificacionConsultar = null;
        historialLiquidacion.cAcademico;
        historialLiquidacion.inscritos = [];
        historialLiquidacion.nivelesFormacion = [];
        historialLiquidacion.programasAcademicos = [];
        historialLiquidacion.liquidacionEstudiante = [];
        historialLiquidacion.liquidacionEstudianteAnuladas = [];
        historialLiquidacion.liquidacionEstudianteAuxiliar = [];
        historialLiquidacion.verDetalle = {};
        historialLiquidacion.tablaAmortizacionDetalle = new Array();
        historialLiquidacion.filtrados = [];
        historialLiquidacion.display;
        historialLiquidacion.options = appConstant.FILTRO_TABLAS;
        historialLiquidacion.selectedOption = historialLiquidacion.options[0];
        historialLiquidacion.report = {selected: null};
        // método para listar el historial completo
        //método para consultar el historial de liquidaciones por estudiante
        historialLiquidacion.onConsultarHistorialEstudiante = function (identificacion) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            historialLiquidacionEstudianteServices.buscarHIstorialEstudianteByCodigo(identificacion).then(function (data) {
                if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    $('#divNombre,#divIdentificacion,#divPAcademico,#divProgramaAcademico,#divSemestre,#btnConsultarHistoral').hide();
                    historialLiquidacion.liquidacionEstudiante = [];
                    historialLiquidacion.liquidacionEstudianteAnuladas = [];
                    historialLiquidacion.liquidacionEstudianteAuxiliar = [];
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    historialLiquidacion.liquidacionEstudiante = [];
                    historialLiquidacion.liquidacionEstudianteAnuladas = [];
                    historialLiquidacion.liquidacionEstudianteAuxiliar = [];
                    historialLiquidacion.estudiante.identificacion = data.objectResponse[0].liquidacionReporteDTO.tipoDocumento + " " + data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
                    historialLiquidacion.estudiante.nombre = data.objectResponse[0].nombreEstudiante;
                    angular.forEach(data.objectResponse, function (value, key) {
                        var liquidacion = {
                            id: value.id,
                            idPeriodo: value.idPeriodo,
                            idEstudiante: value.idEstudiante,
                            referencia: value.referencia,
                            fechaLiquidacion: value.fechaLiquidacion,
                            fechaLimitePago: value.fechaLimitePago,
                            valorLiquidado: value.valorLiquidado,
                            estadoLiquidacion: value.estadoLiquidacion,
                            estadoAbono: value.estadoAbono,
                            idPlantilla: value.idPlantilla,
                            tipoPlantilla: value.tipoPlantilla,
                            numeracion: value.numeracion,
                            idCredito: value.idCredito,
                            liquidacionConceptoDetalleDTO: value.liquidacionConceptoDetalleDTO,
                            nombrePrograma: value.nombrePrograma,
                            nombreConcepto: value.nombreConcepto + " " + (value.liquidacionConceptoDetalleDTO[0].modulo === null ? "" : value.liquidacionConceptoDetalleDTO[0].modulo),
                            nombrePeriodo: value.nombrePeriodo,
                            liquidacionReporteDTO: value.liquidacionReporteDTO,
                            reciboPagoLiquidacionDTO: value.reciboPagoLiquidacionDTO,
                            reimprimir: value.reciboPagoLiquidacionDTO === null,
                            reimrpimirEstado: value.estadoLiquidacion === 'PAGADA',
                            motivoAnulacion: value.motivoAnulacion,
                            usuarioAnulacion: value.userNameAnulacion,
                            fechaAnulacion: value.fechaAnulacion,
                            saldoPendiente: value.saldoPendiente,
                            saldoAbonado: value.saldoAbonado
                        };

                        liquidacion.referenciaNumero = parseInt(liquidacion.referencia.replace("MAT-", "").replace("MTS-", ""));
                        historialLiquidacion.liquidacionEstudianteAuxiliar.push(liquidacion);
                    });
                    angular.forEach(historialLiquidacion.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                        if (liquidacion.estadoLiquidacion !== 'ANULADA') {
                            historialLiquidacion.liquidacionEstudiante.push(liquidacion);
                        } else {
                            historialLiquidacion.liquidacionEstudianteAnuladas.push(liquidacion);
                        }
                    });
                    appConstant.CERRAR_SWAL();
                    if (historialLiquidacion.liquidacionEstudiante.length === 0) {
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
        
        historialLiquidacion.onKeyUpCleanField = function () {
            var input = document.getElementById('inputCodigo').value;
            if (input === null || input === "" || input === undefined || input.length === 0) {
                historialLiquidacion.liquidacionEstudiante = [];
                $(function () {
                    $('#divNombre,#divIdentificacion').hide();
                });
            }

        };

        historialLiquidacion.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria("TIPO_IDENTIFICACION_ABREVIATURA", 'financiero').then(function (data) {
                historialLiquidacion.tipoIdentificacionAbreviatura = [];
                historialLiquidacion.tipoIdentificacionAbreviatura = data;
            }).catch(function (e) {
                return;
            });
        };

        historialLiquidacion.onVerDetalleFormasPago = function (item) {
            historialLiquidacion.formaPagoLiquidacionDTOs = [];
            angular.forEach(item, function (value, key) {
                var detalleRecibo = {
                    formaPago: value.formaPago,
                    valorPagado: value.valorPagado,
                    voucher: value.voucher
                };
                historialLiquidacion.formaPagoLiquidacionDTOs.push(detalleRecibo);
            });
        };
        
        historialLiquidacion.ModalUsuario = function (registro) {
            var item = registro.liquidacionReporteDTO;
            var itemReciboPago = registro.reciboPagoLiquidacionDTO;
            historialLiquidacion.detalleConceptoLiquidacion = [];
            historialLiquidacion.formaPagoLiquidacionDTOs = [];
            $("#demo2").collapse('hide');
            $("#demo").collapse('hide');
            $("#anulacion").collapse('hide');
            historialLiquidacion.verDetalle.periodoAcademico = item.periodoAcademico;
            historialLiquidacion.verDetalle.email = item.email;
            historialLiquidacion.verDetalle.estadoLiquidacion = item.estadoLiquidacion;
            historialLiquidacion.verDetalle.codigo = item.estudianteCodigo;
            historialLiquidacion.verDetalle.estudianteIdentificacion = item.estudianteIdentificacion;
            historialLiquidacion.verDetalle.estudianteNombre = item.estudianteNombre;
            historialLiquidacion.verDetalle.estudianteTelefono = item.estudianteTelefono;
            historialLiquidacion.verDetalle.fechaLimitePago = item.fechaLimitePago;
            historialLiquidacion.verDetalle.informacion = item.informacion;
            historialLiquidacion.verDetalle.programa = item.programa;
            historialLiquidacion.verDetalle.referenciaPago = item.referenciaPago;
            historialLiquidacion.verDetalle.seccional = item.seccional;
            historialLiquidacion.verDetalle.semestre = item.semestre;
            historialLiquidacion.verDetalle.totalPagar = item.totalPagar;
            historialLiquidacion.verDetalle.tipoDocumentoConcat = item.tipoDocumento + " " + item.estudianteIdentificacion;


            historialLiquidacion.verDetalle.recibosDePago = registro.reciboPagoLiquidacionDTO;

            historialLiquidacion.verDetalle.view = item.estadoLiquidacion === 'ANULADA' ? true : false;
            if (historialLiquidacion.verDetalle.view) {
                historialLiquidacion.verDetalle.motivoAnulacion = registro.motivoAnulacion;
                historialLiquidacion.verDetalle.usuarioAnulacion = registro.usuarioAnulacion;
                historialLiquidacion.verDetalle.fechaAnulacion = appConstant.TO_LONG_DATE_FORMATO_DDMMYYYY(registro.fechaAnulacion);
            }
            angular.forEach(item.listaConceptos, function (value, key) {
                var detalleLiquidacion = {
                    codigoConcepto: value.codigoConcepto,
                    nombreConcepto: value.nombreConcepto,
                    valor: value.valor
                };
                historialLiquidacion.detalleConceptoLiquidacion.push(detalleLiquidacion);
            });
            historialLiquidacion.numeroSolicitudAmortizacion = item.numeroSolicitud;
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        historialLiquidacion.usuario = "";
        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            historialLiquidacion.usuario = usuario;
        }
        historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.usuario.identificacion);
    }

})();

