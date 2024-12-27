(function () {
    'use strict';
    angular.module('mytodoApp').controller('ConsultarCreditoCtrl', ConsultarCreditoCtrl);
    ConsultarCreditoCtrl.$inject = ['$scope', 'utilServices', 'solicitudCreditoFinancieroServices', 'historialLiquidacionServices', '$location', 'ValidationService', 'localStorageService', 'appConstant', '$interval', 'appGenericConstant', 'usuarioRolesService', 'appConstantValueList'];
    function ConsultarCreditoCtrl($scope, utilServices, solicitudCreditoFinancieroServices, historialLiquidacionServices, $location, ValidationService, localStorageService, appConstant, $interval, appGenericConstant, usuarioRolesService, appConstantValueList) {

        var gestionConsultarCredito = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionConsultarCredito.consultarCredito = solicitudCreditoFinancieroServices.consultarCredito;
        gestionConsultarCredito.consultarCreditoAuxiliar = solicitudCreditoFinancieroServices.consultarCreditoAuxiliar;
        gestionConsultarCredito.consultarCredito.numeroCuotas;
        gestionConsultarCredito.consultarCreditoAuxiliar.disablingCamposConsulta = false;
        gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
        gestionConsultarCredito.listaSolicitudes = [];
        gestionConsultarCredito.lsttipodocumentos = [];
        gestionConsultarCredito.options = appConstant.FILTRO_TABLAS;
        gestionConsultarCredito.selectedOption = gestionConsultarCredito.options[appGenericConstant.CERO];
        gestionConsultarCredito.report = {
            selected: null
        };
        gestionConsultarCredito.counter = appGenericConstant.CERO;

        gestionConsultarCredito.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === appGenericConstant.ENTER) {
                gestionConsultarCredito.onComprobarNuevaSolicitud(gestionConsultarCredito.identificacionEstudianteSolicitud);
            }
        };
        gestionConsultarCredito.onCancelarBusqueda = function () {
            gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
            gestionConsultarCredito.consultarCredito.programaSolicitud = null;
            gestionConsultarCredito.identificacionEstudianteSolicitud = null;
            gestionConsultarCredito.consultarCredito = {};
            gestionConsultarCredito.consultarCredito.aplicaEdad = true;
            localStorageService.remove("solicitudCredito");
            localStorageService.remove("solicitudCreditoAuxiliar");
            new ValidationService().resetForm($scope.comprobarSolicitudCredito);
        };

        gestionConsultarCredito.onComprobarNuevaSolicitud = function (identificacionEstudianteSolicitud) {
            if (new ValidationService().checkFormValidity($scope.comprobarSolicitudCredito)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + identificacionEstudianteSolicitud + '...');
                appConstant.CARGANDO();
                solicitudCreditoFinancieroServices.buscarEstudiante(identificacionEstudianteSolicitud).then(function (response) {
                    gestionConsultarCredito.consultarCredito.listaProgramas = [];
                    var data = response.objectResponse;
                    if (data !== null) {
                        gestionConsultarCredito.consultarCredito.id = data.id;
                        gestionConsultarCredito.consultarCredito.idPeriodo = data.idPeriodo;
                        gestionConsultarCredito.consultarCredito.nombres = data.nombre;
                        gestionConsultarCredito.consultarCredito.apellidos = data.apellido;
                        gestionConsultarCredito.consultarCredito.nombreCompleto = data.nombre + ' ' + data.apellido;
                        gestionConsultarCredito.consultarCredito.identificacion = data.identificacion;
                        gestionConsultarCredito.consultarCredito.tipoDocumento = data.tipoDocumento;
                        gestionConsultarCredito.consultarCredito.tipoDocumentoCompleto = data.identificacion;
                        gestionConsultarCredito.consultarCredito.edad = data.edad;
                        gestionConsultarCredito.consultarCredito.direccion = data.direccion;
                        gestionConsultarCredito.consultarCredito.barrio = data.barrio;
                        gestionConsultarCredito.consultarCredito.telefono = data.celular;
                        gestionConsultarCredito.consultarCredito.ciudadMunicipio = data.ciudad;
                        gestionConsultarCredito.consultarCredito.aplicaEdad = data.aplicaEdad;
                        gestionConsultarCredito.consultarCredito.acudiente = {};
                        gestionConsultarCredito.consultarCredito.esCodeudor = 'no';
                        gestionConsultarCredito.consultarCredito.listaProgramas = data.estudiantePrograma;
                        if (gestionConsultarCredito.consultarCredito.listaProgramas === undefined || gestionConsultarCredito.consultarCredito.listaProgramas === null) {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_PROGRAMA_ASOCIADO);
                            appConstant.CERRAR_SWAL();
                            return;
                        }
                        gestionConsultarCredito.consultarCredito.programaAcademico = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].programa;
                        gestionConsultarCredito.consultarCredito.codigoEstudiante = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].codigoEstudiante;
                        gestionConsultarCredito.consultarCredito.semestre = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].semestre;
                        gestionConsultarCredito.consultarCredito.nivelFormacion = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].nivelFormacion;
                        gestionConsultarCredito.consultarCredito.modalidad = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].nombreModalidad;
                        gestionConsultarCredito.consultarCredito.idModalidad = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].idModalidad;
                        gestionConsultarCredito.consultarCredito.idPrograma = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].idPrograma;
                        gestionConsultarCredito.consultarCredito.idEstudiante = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].idEstudiante;
                        gestionConsultarCredito.consultarCredito.valorFinanciar = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].valorFinanciar;
                        gestionConsultarCredito.consultarCredito.valorModulo = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].valorModulo;
                        gestionConsultarCredito.consultarCredito.tieneLiquidacionMatriculaSemestre = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO].tieneLiquidacionMatriculaSemestre;
                        gestionConsultarCredito.consultarCredito.cartera = data.tablaAmortizacionConvenioVencidaDTO === null ? [] : data.tablaAmortizacionConvenioVencidaDTO;
                        gestionConsultarCredito.consultarCredito.solicitudCreditoConvenioDTO = data.solicitudCreditoConvenioDTO === null ? [] : data.solicitudCreditoConvenioDTO;

                        getTotalCartera();
                        gestionConsultarCredito.onConsultarHistorialEstudiante(gestionConsultarCredito.consultarCredito.identificacion);
                        if (gestionConsultarCredito.consultarCredito.cartera.length !== appGenericConstant.CERO) {
                            gestionConsultarCredito.consultarCredito.nombreEstudianteSolicitud = gestionConsultarCredito.consultarCredito.nombreCompleto;
                            gestionConsultarCredito.consultarCredito.programaSolicitud = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO];
                            gestionConsultarCredito.consultarCredito.listaPlanAmortizacion = [];
                            gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = false;
                            gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
                            gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
                            appConstant.CERRAR_SWAL();
                            return;
                        }
                        if (gestionConsultarCredito.consultarCredito.solicitudCreditoConvenioDTO.length !== appGenericConstant.CERO) {
                            var control = false;
                            for (var i = appGenericConstant.CERO; i < gestionConsultarCredito.consultarCredito.solicitudCreditoConvenioDTO.length; i++) {
                                if (gestionConsultarCredito.consultarCredito.solicitudCreditoConvenioDTO[i].estadoSolicitud === "DESEMBOLSADO" ) {
                                    control = true;
                                    break;
                                }
                            }
                            if (control) {
                                gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
                                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = false;
                                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
                                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_TIENE_SOLICITUD_CREDITO);
                                appConstant.CERRAR_SWAL();
                            } else {
                                gestionConsultarCredito.consultarCredito.nombreEstudianteSolicitud = gestionConsultarCredito.consultarCredito.nombreCompleto;
                                gestionConsultarCredito.consultarCredito.programaSolicitud = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO];
                                gestionConsultarCredito.consultarCredito.listaPlanAmortizacion = [];
                                gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = false;
                                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
                                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
                                appConstant.CERRAR_SWAL();
                            }
                        } else {
                            gestionConsultarCredito.consultarCredito.nombreEstudianteSolicitud = gestionConsultarCredito.consultarCredito.nombreCompleto;
                            gestionConsultarCredito.consultarCredito.programaSolicitud = gestionConsultarCredito.consultarCredito.listaProgramas[appGenericConstant.CERO];
                            gestionConsultarCredito.consultarCredito.listaPlanAmortizacion = [];
                            gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = false;
                            gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
                            gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
                            appConstant.CERRAR_SWAL();
                        }
                    } else {
                        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = false;
                        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
                        gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                        appConstant.CERRAR_SWAL();
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
                gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
                localStorageService.remove("solicitudCredito");
                localStorageService.remove("solicitudCreditoAuxiliar");
            }
        };

        gestionConsultarCredito.onChangePrograma = function () {
            gestionConsultarCredito.consultarCredito.programaAcademico = gestionConsultarCredito.consultarCredito.programaSolicitud.programa;
            gestionConsultarCredito.consultarCredito.codigoEstudiante = gestionConsultarCredito.consultarCredito.programaSolicitud.codigoEstudiante;
            gestionConsultarCredito.consultarCredito.semestre = gestionConsultarCredito.consultarCredito.programaSolicitud.semestre;
            gestionConsultarCredito.consultarCredito.nivelFormacion = gestionConsultarCredito.consultarCredito.programaSolicitud.nivelFormacion;
            gestionConsultarCredito.consultarCredito.modalidad = gestionConsultarCredito.consultarCredito.programaSolicitud.nombreModalidad;
            gestionConsultarCredito.consultarCredito.idModalidad = gestionConsultarCredito.consultarCredito.programaSolicitud.idModalidad;
            gestionConsultarCredito.consultarCredito.idPrograma = gestionConsultarCredito.consultarCredito.programaSolicitud.idPrograma;
            gestionConsultarCredito.consultarCredito.idEstudiante = gestionConsultarCredito.consultarCredito.programaSolicitud.idEstudiante;
            gestionConsultarCredito.consultarCredito.valorFinanciar = gestionConsultarCredito.consultarCredito.programaSolicitud.valorFinanciar;
            gestionConsultarCredito.consultarCredito.tieneLiquidacionMatriculaSemestre = gestionConsultarCredito.consultarCredito.programaSolicitud.tieneLiquidacionMatriculaSemestre;
            gestionConsultarCredito.consultarCredito.valorModulo = gestionConsultarCredito.consultarCredito.programaSolicitud.valorModulo;

            gestionConsultarCredito.onConsultarHistorialEstudiante(gestionConsultarCredito.consultarCredito.identificacion);
        };


        function validarCampos(campo) {
            return (campo === "" || campo === null || campo === undefined)
        }

        gestionConsultarCredito.onNuevaSolicitud = function () {

            if (!gestionConsultarCredito.consultarCredito.aplicaEdad) {
                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.idTipoIdentificacion)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo tipo identificacion");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.identificacion)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo identificacion");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.ciudadExpedicion)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo ciudadExpedicion");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.nombre)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo nombre");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.apellido)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo apellido");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.email)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo email");
                    return;
                }

                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.telefono)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo telefono");
                    return;
                }
                if (validarCampos(gestionConsultarCredito.consultarCredito.acudiente.celular)) {
                    appConstant.MSG_GROWL_ADVERTENCIA("Actualice campo celular");
                    return;
                }
            }

            if (gestionConsultarCredito.liquidacionEstudiante === undefined) {
                gestionConsultarCredito.liquidacionEstudiante = [];
            }

            $location.path("/solicitud-credito");
            gestionConsultarCredito.consultarCreditoAuxiliar.reestructuracion = true;
            gestionConsultarCredito.consultarCreditoAuxiliar.disabledLinea = true;
            gestionConsultarCredito.consultarCreditoAuxiliar.solicitudRealizada = false;
            gestionConsultarCredito.consultarCreditoAuxiliar.active = appGenericConstant.CERO;
            gestionConsultarCredito.consultarCredito.linea = null;
            gestionConsultarCredito.consultarCredito.numeroCuotas = null;
            gestionConsultarCredito.consultarCredito.valorTotalModulos = 0;
            gestionConsultarCredito.consultarCreditoAuxiliar.multiple = false;
            gestionConsultarCredito.consultarCreditoAuxiliar.hideTable = false;
            localStorageService.set("solicitudCreditoAuxiliar", gestionConsultarCredito.consultarCreditoAuxiliar);
            localStorageService.set("solicitudCredito", gestionConsultarCredito.consultarCredito);
            new ValidationService().resetForm($scope.comprobarSolicitudCredito);

            //            if (gestionConsultarCredito.liquidacionEstudiante.length > 0) {
            //                 appConstant.MSG_GROWL_ADVERTENCIA('El estudiante presenta liquidaciones de módulos pendiente');
            //                return;
            //            } else {
            //                if (gestionConsultarCredito.consultarCredito.cartera.length > appGenericConstant.CERO) {
            //                    swal({
            //                        title: appGenericConstant.ESTUDIANTE_TIENE_CARTERA_VENCIDA,
            //                        text: '',
            //                        type: appGenericConstant.WARNING,
            //                        showCancelButton: false,
            //                        confirmButtonText: appGenericConstant.ACEPTAR,
            //                        allowOutsideClick: false
            //                    });
            //                } else {
            //                    $location.path("/solicitud-credito");
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.reestructuracion = true;
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.disabledLinea = true;
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.solicitudRealizada = false;
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.active = appGenericConstant.CERO;
            //                    gestionConsultarCredito.consultarCredito.linea = null;
            //                    gestionConsultarCredito.consultarCredito.numeroCuotas = null;
            //                    gestionConsultarCredito.consultarCredito.valorTotalModulos = 0;
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.multiple = false;
            //                    gestionConsultarCredito.consultarCreditoAuxiliar.hideTable = false;
            //                    localStorageService.set("solicitudCreditoAuxiliar", gestionConsultarCredito.consultarCreditoAuxiliar);
            //                    localStorageService.set("solicitudCredito", gestionConsultarCredito.consultarCredito);
            //                    new ValidationService().resetForm($scope.formSolicitud);
            //                }
            //            }
        };

        gestionConsultarCredito.onClickToView = function (item) {
            gestionConsultarCredito.consultarCredito.periodoActual = item.periodoActual;
            gestionConsultarCredito.consultarCredito.programaAcademico = item.nombreprogramaAcademico;
            gestionConsultarCredito.consultarCredito.modalidad = item.modalidad;
            gestionConsultarCredito.consultarCredito.idModalidad = item.idModalidad;
            gestionConsultarCredito.consultarCredito.idEstudiante = item.idEstudiante;
            gestionConsultarCredito.consultarCredito.idPrograma = item.idPrograma;
            gestionConsultarCredito.consultarCredito.codigoEstudiante = item.codigoEstudiante;
            gestionConsultarCredito.consultarCredito.semestre = item.semestre;
            gestionConsultarCredito.consultarCredito.nombres = item.nombres;
            gestionConsultarCredito.consultarCredito.apellidos = item.apellidos;
            gestionConsultarCredito.consultarCredito.nombreCompleto = item.nombreCompleto;
            gestionConsultarCredito.consultarCredito.identificacion = item.identificacion;
            gestionConsultarCredito.consultarCredito.tipoDocumento = item.tipoDocumento;
            gestionConsultarCredito.consultarCredito.esCodeudor = item.esCodeudor;
            gestionConsultarCredito.consultarCredito.id = item.id;
            gestionConsultarCredito.consultarCredito.numeroSolicitud = item.numeroSolicitud;
            gestionConsultarCredito.consultarCredito.estadoSolicitud = item.estadoSolicitud;
            gestionConsultarCredito.consultarCredito.fechaActual = item.fechaSolicitud;
            gestionConsultarCredito.consultarCredito.numeroCuotas = item.numeroCuotas;
            gestionConsultarCredito.consultarCredito.linea = item.linea;
            gestionConsultarCredito.consultarCredito.montoMinimo = item.montoMinimo;
            gestionConsultarCredito.consultarCredito.cartera = item.cartera;
            gestionConsultarCredito.consultarCredito.valorModulo = item.valorModulo;
            gestionConsultarCredito.consultarCredito.listaPlanAmortizacion = onFormatearFechasByLista(item.tablaAmortizacion);
            gestionConsultarCredito.consultarCredito.listaModulos = item.tablaModulos;
            gestionConsultarCredito.consultarCredito.esPeriodoActual = item.esPeriodoActual;
            gestionConsultarCredito.consultarCreditoAuxiliar.reestructuracion = true;
            gestionConsultarCredito.consultarCreditoAuxiliar.solicitudRealizada = true;
            gestionConsultarCredito.consultarCreditoAuxiliar.disabledLinea = false;
            gestionConsultarCredito.consultarCreditoAuxiliar.active = appGenericConstant.CERO;
            gestionConsultarCredito.consultarCreditoAuxiliar.hideTable = true;
            getTotalCartera();
            localStorageService.remove("solicitudCredito");
            localStorageService.set("solicitudCredito", gestionConsultarCredito.consultarCredito);
            localStorageService.set("solicitudCreditoAuxiliar", gestionConsultarCredito.consultarCreditoAuxiliar);
            $location.path("/solicitud-credito");
        };

        function onFormatearFechasByLista(lista) {
            var listAux = [];
            angular.forEach(lista, function (value) {
                var fechaFor = {
                    amortizacion: value.amortizacion,
                    cuota: value.cuota,
                    cuotaFija: value.cuotaFija,
                    estadoAmortizacion: value.estadoAmortizacion,
                    fecha: onFormattedDate(value.fecha),
                    id: value.id,
                    idSolicitudCredito: value.idSolicitudCredito,
                    interes: value.interes,
                    prestamo: value.prestamo,
                    saldoRestante: value.saldoRestante
                };
                listAux.push(fechaFor);
            });
            return listAux;
        }

        function onFormattedDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }

        function getTotalCartera() {
            var total = appGenericConstant.CERO;
            if (gestionConsultarCredito.consultarCredito.cartera.length === appGenericConstant.CERO) {
                gestionConsultarCredito.consultarCredito.totalCartera = parseFloat((total).toFixed(appGenericConstant.DOS));
            } else {
                for (var i = appGenericConstant.CERO; i < gestionConsultarCredito.consultarCredito.cartera.length; i++) {
                    total = total + parseFloat(gestionConsultarCredito.consultarCredito.cartera[i].cuotaFija);
                }
                gestionConsultarCredito.consultarCredito.totalCartera = parseFloat((total).toFixed(appGenericConstant.DOS));
            }
        }

        gestionConsultarCredito.onConsultarHistorialEstudiante = function (identificacion) {
            //            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(identificacion).then(function (data) {
                if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                    gestionConsultarCredito.liquidacionEstudiante = [];
                    gestionConsultarCredito.liquidacionEstudianteAnuladas = [];
                    gestionConsultarCredito.liquidacionEstudianteAuxiliar = [];
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    gestionConsultarCredito.liquidacionEstudiante = [];
                    gestionConsultarCredito.liquidacionEstudianteAnuladas = [];
                    gestionConsultarCredito.liquidacionEstudianteAuxiliar = [];
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
                        gestionConsultarCredito.liquidacionEstudianteAuxiliar.push(liquidacion);
                    });
                    angular.forEach(gestionConsultarCredito.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                        if (liquidacion.estadoLiquidacion !== 'ANULADA' && liquidacion.nombreConcepto === 'MATRICULA SEMESTRE' && liquidacion.estadoLiquidacion === 'ABIERTA' && liquidacion.idEstudiante === gestionConsultarCredito.consultarCredito.idEstudiante) {
                            gestionConsultarCredito.liquidacionEstudiante.push(liquidacion);
                        }
                    });

                    if (gestionConsultarCredito.liquidacionEstudiante.length > 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA('El estudiante presenta liquidaciones de módulos pendiente.');
                        appConstant.CERRAR_SWAL();
                    }
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
            //            }
        };

        gestionConsultarCredito.onEstadoEstilo = function (estado) {
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

        gestionConsultarCredito.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                gestionConsultarCredito.lsttipodocumentos = data;
            }).catch(function (e) {
                return;
            });
        };

        gestionConsultarCredito.ejecutarConsultarTipoDocumentos();

    }
})();