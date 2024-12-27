(function () {
    'use strict';
    angular.module('mytodoApp').controller('HistorialLiquidacionCtrl', HistorialLiquidacionCtrl);
    HistorialLiquidacionCtrl.$inject = ['$scope', 'historialLiquidacionServices', 'solicitudCreditoFinancieroServices', 'ValidationService', '$http', 'utilServices', '$window', 'appConstant', 'appGenericConstant', 'localStorageService'];
    function HistorialLiquidacionCtrl($scope, historialLiquidacionServices, solicitudCreditoFinancieroServices, ValidationService, $http, utilServices, $window, appConstant, appGenericConstant, localStorageService) {
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
        historialLiquidacion.liquidaconHistorialConvenio = [];
        historialLiquidacion.verDetalle = {};
        historialLiquidacion.tablaAmortizacionDetalle = new Array();
        historialLiquidacion.filtrados = [];
        historialLiquidacion.display;
        historialLiquidacion.options = appConstant.FILTRO_TABLAS;
        historialLiquidacion.selectedOption = historialLiquidacion.options[0];
        historialLiquidacion.report = { selected: null };

        //método para consultar el historial de liquidaciones por estudiante
        historialLiquidacion.onConsultarHistorialEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                historialLiquidacionServices.getHistorialEstudianteByCodigoConRecibo(identificacion).then(function (data) {
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
                        historialLiquidacion.estudiante.codigo = data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
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

                            //                            if (value.reciboPagoLiquidacionDTO !== null && value.reciboPagoLiquidacionDTO !== undefined && value.reciboPagoLiquidacionDTO !== "") {
                            //                                liquidacion.fechaPago = appConstant.TO_LONG_DATE_FORMATO_DDMMYYYY(value.reciboPagoLiquidacionDTO.fechaPago);
                            //                                liquidacion.numeroPago = value.reciboPagoLiquidacionDTO.numero;
                            //                            } else {
                            //                                liquidacion.fechaPago = null;
                            //                            }
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

                solicitudCreditoFinancieroServices.getReporteHistorialConvenio(identificacion).then(function (data) {
                    historialLiquidacion.liquidaconHistorialConvenio = [];
                    historialLiquidacion.liquidaconHistorialConvenio = data;
                });
            }
        };
        historialLiquidacion.anularLiquidacion = function (item) {
            var tipo = null;
            swal({
                title: '¿Esta seguro de anular el registro?',
                type: 'warning',
                input: 'textarea',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, anularlo!',
                cancelButtonText: 'Cancelar',
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value) {
                            var liquidacion = {
                                liquidacionConceptoDTO: item,
                                motivo: value,
                                usuario: localStorageService.get("autorizacion").objectResponse.userDto.id,
                                userName: localStorageService.get("autorizacion").objectResponse.userDto.username
                            };
                            historialLiquidacionServices.anularLiquidacion(liquidacion).then(function (data) {
                                if (data.tipo === 200) {
                                    historialLiquidacion.onConsultarHistorialEstudiante(item.liquidacionReporteDTO.estudianteIdentificacion);
                                    swal({
                                        title: '¡El registro ha sido anulado!',
                                        type: 'success',
                                        showCloseButton: true,
                                        timer: 5000
                                    });
                                    appConstant.MSG_GROWL_OK('¡El registro ha sido anulado!');
                                } else {
                                    swal({
                                        title: data.message,
                                        type: 'error',
                                        showCloseButton: true
                                    });
                                }
                            });
                            resolve();
                        } else {
                            reject('El motivo no puede ser vacio');
                        }
                    });
                }
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
        historialLiquidacion.onChangeSemestre = function (item) {
            $("#semestre").val(item.semestre);
        };

        historialLiquidacion.onCastigarCartera = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            historialLiquidacionServices.castigarEstudiante(historialLiquidacion.estudiante.codigo, localStorageService.get('usuario').id).then(function (data) {
                if (data.tipo === 200) {
                    historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.estudiante.codigo);
                    swal({
                        title: '¡Se ha castigado la cartera!',
                        type: 'success',
                        showCloseButton: true,
                        timer: 5000
                    });
                    appConstant.MSG_GROWL_OK('¡Se ha castigado la cartera!');
                    appConstant.CERRAR_SWAL();
                } else {
                    swal({
                        title: data.message,
                        type: 'error',
                        showCloseButton: true
                    });
                    appConstant.CERRAR_SWAL();
                }
            });
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

        function onGenerarReporteDirecto(json, opcion) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();

            var jsonString = JSON.stringify(json);
            jsonString = opcion + "" + jsonString;
            var urlRequest = '/api/financiero/report/crearReportD/';

            $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
                },
                responseType: 'arraybuffer'
            }).success(function (data) {

                var file = new Blob([data], {
                    type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                appConstant.CERRAR_SWAL();

            }).error(function () {
                appConstant.MSG_GROWL_ERROR("Error de conexión: No fue posible conectarse con el servidor");
                appConstant.CERRAR_SWAL();
            });

        };

        historialLiquidacion.onGenerarReporte = function (datosObj) {
            appConstant.MSG_LOADING(appGenericConstant.GENERANDO_REPORTE_ESPERE);
            appConstant.CARGANDO();
            historialLiquidacion.item = [];
            var headers = {
                Authorization: localStorageService.get('autorizacion').token,
                Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportEstudiante = {
                liquidacioReporte: datosObj
            };
            onGenerarReporteDirecto(objReportEstudiante, 2);
            /*
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "2" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    historialLiquidacion.item.push(data.data.message);
                    getIdArchivo(historialLiquidacion.item[0]);
                    appConstant.CERRAR_SWAL();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_GENERAR_REPORTE);
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_GENERAR_REPORTE);
                swal.closeModal();
            });*/
        };
        function getIdArchivo(itemId) {
            historialLiquidacion.itemArchivo = "";
            historialLiquidacion.itemArchivo = itemId;
            historialLiquidacion.download(historialLiquidacion.itemArchivo);
        }
        historialLiquidacion.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
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
                    valor: value.valor,
                    seleccionado: false
                };
                historialLiquidacion.detalleConceptoLiquidacion.push(detalleLiquidacion);
            });
            historialLiquidacion.numeroSolicitudAmortizacion = item.numeroSolicitud;
            $('#myModal').modal({ backdrop: 'static', keyboard: false });
            $("#myModal").modal("show");
        };

        historialLiquidacion.ModalUsuario2 = function (registro) {
            historialLiquidacion.aplicarDescuento2 = {
                idLiquidacion: registro.id,
                usuario: localStorageService.get('usuario').id,
                userName: localStorageService.get('usuario').username
            };

            $('#myModal2').modal({ backdrop: 'static', keyboard: false });
            $("#myModal2").modal("show");
        };

        historialLiquidacion.ModalUsuario3 = function (registro) {
            historialLiquidacion.aplicarAnulacionSupletorio = {
                idLiquidacion: registro.id,
                usuario: localStorageService.get('usuario').id,
                userName: localStorageService.get('usuario').username,
                motivo: "",
                listIdDetalleLiquidacion: []
            };

            historialLiquidacion.listaOtros = [];
            angular.forEach(registro.liquidacionConceptoDetalleDTO, function (value, key) {

                if (value.codigoConcepto === 'CFI12') {
                    var detalleLiquidacion = {
                        id: value.id,
                        codigoConcepto: value.codigoConcepto,
                        nombreConcepto: value.nombreConcepto,
                        valor: value.valor,
                        seleccionado: false
                    };
                    historialLiquidacion.listaOtros.push(detalleLiquidacion);
                }
            });

            if (historialLiquidacion.listaOtros.length == 0) {
                appConstant.MSG_GROWL_ADVERTENCIA("Esta Liquidación no presenta supletorios");
                return;
            }

            $('#myModal3').modal({ backdrop: 'static', keyboard: false });
            $("#myModal3").modal("show");
        };

        historialLiquidacion.ModalUsuarioConvenio = function (item) {
            historialLiquidacion.listTablaAmortizacion = [];
            historialLiquidacion.listTablaAmortizacion = item.tablaAmortizacionConvenio;

            $('#myModalCredito').modal({ backdrop: 'static', keyboard: false });
            $("#myModalCredito").modal("show");
        };

        historialLiquidacion.onGuardarDescuentoSupletorio = function () {
            $("#myModal3").modal("hide");
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            historialLiquidacion.aplicarAnulacionSupletorio.listIdDetalleLiquidacion = [];

            angular.forEach(historialLiquidacion.listaOtros, function (value, key) {
                if (value.seleccionado) {
                    historialLiquidacion.aplicarAnulacionSupletorio.listIdDetalleLiquidacion.push(value.id);
                }
            });

            if (historialLiquidacion.aplicarAnulacionSupletorio.listIdDetalleLiquidacion.length === 0) {
                appConstant.MSG_SWAL_GENERIC("Seleccione supletorios a anular", "warning");
                return;
            }

            historialLiquidacionServices.onGuardarSupletorio(historialLiquidacion.aplicarAnulacionSupletorio).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_SWAL_GENERIC(data.message, "success");
                        appConstant.MSG_GROWL_OK(data.message);
                        appConstant.CERRAR_SWAL();
                        historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.estudiante.identificacion);
                        break;
                    case 409:
                        appConstant.MSG_SWAL_GENERIC(data.message, "warning");
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        break;
                }
            });
        };

        historialLiquidacion.checkAllOtros = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                historialLiquidacion.totalArqueoOtro = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < historialLiquidacion.listaOtros.length; i++) {
                    historialLiquidacion.totalArqueoOtro = historialLiquidacion.totalArqueoOtro + historialLiquidacion.listaOtros[i].valor;
                    historialLiquidacion.listaOtros[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                historialLiquidacion.totalArqueoOtro = 0;
                for (i = 0; i < historialLiquidacion.listaOtros.length; i++) {
                    historialLiquidacion.listaOtros[i].seleccionado = false;
                }
            }
        };

        historialLiquidacion.totalArqueoOtro = 0;
        historialLiquidacion.checkOtros = function (item, idCheckAll, classCheckHijos, idCheck) {
            if ($("#chekValorOtro" + item.id).is(':checked')) {
                historialLiquidacion.totalArqueoOtro = historialLiquidacion.totalArqueoOtro + item.valor;
                item.seleccionado = true;
            } else {
                historialLiquidacion.totalArqueoOtro = historialLiquidacion.totalArqueoOtro - item.valor;
                item.seleccionado = false;
            }

            for (var i = 0; i < historialLiquidacion.listaOtros.length; i++) {
                if (historialLiquidacion.listaOtros[i].seleccionado === false) {
                    $("#selectAllOtro").prop('checked', false);
                    break;
                } else {
                    $("#selectAllOtro").prop('checked', true);
                }
            }
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
                        historialLiquidacion.onConsultarHistorialEstudiante(historialLiquidacion.estudiante.identificacion);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        break;
                }
            });
        };

        historialLiquidacion.getTotalSaldoPendiente = function (data) {
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
        historialLiquidacion.getTotalSaldoAbonado = function (data) {
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
        historialLiquidacion.getTotalValorLiquidado = function (data) {
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


        //SolicitudCreditoConvenio
        historialLiquidacion.onGenerarReporteConvenio = function (solicitud) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            historialLiquidacion.item = [];
            var headers = { 
                Authorization: localStorageService.get('autorizacion').token,
                Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportSolicitud = {
                SolicitudCredito: solicitud
            };
            onGenerarReporteDirecto(objReportSolicitud, 3);
            var jsonString = JSON.stringify(objReportSolicitud);
            /*
            jsonString = "3" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    historialLiquidacion.item.push(data.data.message);
                    historialLiquidacion.download(historialLiquidacion.item[0]);
                } else {
                    appConstant.MSG_REPORTE_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            });*/
        };


        
    }

})();

