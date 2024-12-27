(function () {
    'use strict';
    angular.module('mytodoApp').controller('DescuentosHistorialCtrl', DescuentosHistorialCtrl);
    DescuentosHistorialCtrl.$inject = ['$scope', 'historialLiquidacionServices', 'ValidationService', '$http', 'utilServices', '$window', 'appConstant', 'appGenericConstant', 'localStorageService'];
    function DescuentosHistorialCtrl($scope, historialLiquidacionServices, ValidationService, $http, utilServices, $window, appConstant, appGenericConstant, localStorageService) {
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
        historialLiquidacion.estudiante = historialLiquidacionServices.estudiante;
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
        historialLiquidacion.descuento = {};
        historialLiquidacion.aplicarDescuento = {};
        historialLiquidacion.aplicarDescuento3 = {};
        historialLiquidacion.identificacionConsultaOperacion = null;
        historialLiquidacion.listadoDescuentos = appConstant.LISTA_DESCUENTOS;

        //método para consultar el historial de liquidaciones por estudiante
        historialLiquidacion.onConsultarHistorialEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(identificacion).then(function (data) {
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
                        historialLiquidacion.identificacionConsultaOperacion = data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
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
                                nombreConcepto: value.nombreConcepto,
                                nombrePeriodo: value.nombrePeriodo,
                                liquidacionReporteDTO: value.liquidacionReporteDTO,
                                reciboPagoLiquidacionDTO: value.reciboPagoLiquidacionDTO,
                                reimprimir: value.reciboPagoLiquidacionDTO === null,
                                reimrpimirEstado: value.estadoLiquidacion === 'PAGADA',
                                motivoAnulacion: value.motivoAnulacion,
                                usuarioAnulacion: value.userNameAnulacion,
                                fechaAnulacion: value.fechaAnulacion
                            };
                            historialLiquidacion.liquidacionEstudianteAuxiliar.push(liquidacion);
                        });
                        var tienebeca = false;
                        angular.forEach(historialLiquidacion.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                            tienebeca = false;
                            if (liquidacion.estadoLiquidacion !== 'ANULADA' && (liquidacion.liquidacionConceptoDetalleDTO[0].idConcepto === 12 || liquidacion.liquidacionConceptoDetalleDTO[0].idConcepto === 9 || 
                                liquidacion.liquidacionConceptoDetalleDTO[0].idConcepto === 1) ) {
                                angular.forEach(liquidacion.liquidacionConceptoDetalleDTO, function (detalle, key) {
                                    if (detalle.codigoConcepto === 'CFD01') {
                                        tienebeca = true;
                                    }
                                });
                                if (!tienebeca) {
                                    historialLiquidacion.liquidacionEstudiante.push(liquidacion);
                                }
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
            }
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
        historialLiquidacion.onChangeSemestre = function (item) {
            $("#semestre").val(item.semestre);
        };
        historialLiquidacion.onEstadoEstilo = function (estado) {
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
        historialLiquidacion.onEstadoEstiloAmorti = function (estado) {
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
        
        historialLiquidacion.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria("TIPO_IDENTIFICACION_ABREVIATURA", 'financiero').then(function (data) {
                historialLiquidacion.tipoIdentificacionAbreviatura = [];
                historialLiquidacion.tipoIdentificacionAbreviatura = data;
            }).catch(function (e) {
                return;
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

            historialLiquidacion.aplicarDescuento = {
                idLiquidacion: registro.id,
                usuario: localStorageService.get('usuario').id,
                userName: localStorageService.get('usuario').username,
                totalPagar: item.totalPagar
            };


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

        historialLiquidacion.onChangeDescuento = function () {
            if (historialLiquidacion.descuento === "" || historialLiquidacion.descuento === null || historialLiquidacion.descuento === undefined) {
                historialLiquidacion.aplicarDescuento.totalPagarConDescuento = 0;
            } else {
                historialLiquidacion.aplicarDescuento.totalPagarConDescuento = historialLiquidacion.verDetalle.totalPagar - Math.round(historialLiquidacion.verDetalle.totalPagar * historialLiquidacion.descuento.valorPorcentaje);
            }
        };

        historialLiquidacion.onChangeDescuentoGeneral = function () {
            if (historialLiquidacion.descuento === "" || historialLiquidacion.descuento === null || historialLiquidacion.descuento === undefined) {
                historialLiquidacion.aplicarDescuento3.totalPagarConDescuento = 0;
            } else {
                historialLiquidacion.aplicarDescuento3.totalPagarConDescuento = historialLiquidacion.aplicarDescuento3.totalPagar - historialLiquidacion.aplicarDescuento3.totalPagar * historialLiquidacion.descuento.valorPorcentaje;
            }
        };

        historialLiquidacion.onGuardarDescuento = function () {

            if (historialLiquidacion.descuento === null && historialLiquidacion.descuento === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA("No ha seleccionado porcentaje a descontar");
                return;
            }
            $("#myModal").modal("hide");
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            historialLiquidacion.aplicarDescuento.motivo = historialLiquidacion.motivo;
            historialLiquidacion.aplicarDescuento.descuento = historialLiquidacion.descuento.valorPorcentaje;

            historialLiquidacionServices.onGuardarDescuento(historialLiquidacion.aplicarDescuento).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        appConstant.CERRAR_SWAL();
                        historialLiquidacion.descuento = {};
                        historialLiquidacion.motivo = "";
                        historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.identificacionConsultaOperacion);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        break;
                }
            });
        };

        historialLiquidacion.ModalUsuario2 = function (registro) {
            historialLiquidacion.aplicarDescuento2 = {
                idLiquidacion: registro.id,
                usuario: localStorageService.get('usuario').id,
                userName: localStorageService.get('usuario').username
            };

            $('#myModal2').modal({backdrop: 'static', keyboard: false});
            $("#myModal2").modal("show");
        };

        historialLiquidacion.ModalUsuario3 = function () {
            historialLiquidacion.listaIdDesconetar = [];
            historialLiquidacion.motivoDescuentoGeneral = "";

            historialLiquidacion.aplicarDescuento3.totalPagar = 0;
            historialLiquidacion.aplicarDescuento3.totalPagarConDescuento = 0;
            angular.forEach(historialLiquidacion.liquidacionEstudiante, function (detalle, key) {
                historialLiquidacion.aplicarDescuento3.totalPagar = historialLiquidacion.aplicarDescuento3.totalPagar + detalle.valorLiquidado;

                historialLiquidacion.aplicarDescuento4 = {
                    idLiquidacion: detalle.id,
                    usuario: localStorageService.get('usuario').id,
                    userName: localStorageService.get('usuario').username,
                    totalPagar: detalle.valorLiquidado
                };

                historialLiquidacion.listaIdDesconetar.push(historialLiquidacion.aplicarDescuento4);
            });

            $('#myModal3').modal({backdrop: 'static', keyboard: false});
            $("#myModal3").modal("show");
        };

        historialLiquidacion.onGuardarDescuentoGeneral = function () {

            if (historialLiquidacion.descuento === null && historialLiquidacion.descuento === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA("No ha seleccionado porcentaje a descontar");
                return;
            }

            $("#myModal3").modal("hide");
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var contador = 0;
            angular.forEach(historialLiquidacion.listaIdDesconetar, function (detalle, key) {
                detalle.motivo = historialLiquidacion.motivoDescuentoGeneral;
                detalle.descuento = historialLiquidacion.descuento.valorPorcentaje;

                historialLiquidacionServices.onGuardarDescuento(detalle).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    switch (data.tipo) {
                        case 200:
                            contador = contador + 1;
                            appConstant.MSG_GROWL_OK(data.message);
                            appConstant.CERRAR_SWAL();
                            if (contador === historialLiquidacion.listaIdDesconetar.length) {
                                historialLiquidacion.descuento = {};
                                historialLiquidacion.motivoDescuentoGeneral = "";
                                historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.identificacionConsultaOperacion);
                            }
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            appConstant.CERRAR_SWAL();
                            break;
                    }
                });
            });
        };


        historialLiquidacion.onGuardarDescuentoPago = function () {

            $("#myModal2").modal("hide");
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            historialLiquidacion.aplicarDescuento2.motivo = historialLiquidacion.motivoPago;

            historialLiquidacionServices.onGuardarDescuentoPago(historialLiquidacion.aplicarDescuento2).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        appConstant.CERRAR_SWAL();
                        historialLiquidacion.descuento = {};
                        historialLiquidacion.motivo2 = "";
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        break;
                }
            });
        };
    }

})();

