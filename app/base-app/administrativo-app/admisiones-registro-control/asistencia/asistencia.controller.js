(function () {
    'use strict';
    angular.module('mytodoApp').controller('AsistenciaCtrl', AsistenciaCtrl);
    AsistenciaCtrl.$inject = ['$scope', 'asistenciaServices', 'cambioHorarioServices', 'localStorageService', '$filter', 'utilServices', 'appConstant', '$window', 'appGenericConstant', '$http', 'confiEducacionContinuadaServices'];
    function AsistenciaCtrl($scope, asistenciaServices, cambioHorarioServices, localStorageService, $filter, utilServices, appConstant, $window, appGenericConstant, $http, confiEducacionContinuadaServices) {
        var gestionAsistencia = this;
        var config = { disableCountDown: true, ttl: 5000 };
        gestionAsistencia.onLimpiar = function () {
            onLimpiar();
        };
        gestionAsistencia.programa = {};
        gestionAsistencia.programas = [];
        gestionAsistencia.listAsistenciaDetalle = [];
        gestionAsistencia.disabledCodigo = true;
        gestionAsistencia.listAsistencia = [];
        gestionAsistencia.display;
        gestionAsistencia.fechaok = new Date();
        gestionAsistencia.selectTodos = false;
        gestionAsistencia.filtrados = [];
        gestionAsistencia.estados = [];
        gestionAsistencia.programaAcademicolist = [];
        gestionAsistencia.mensajeValidacion = true;
        gestionAsistencia.options = appConstant.FILTRO_TABLAS;
        gestionAsistencia.selectedOption = gestionAsistencia.options[0];
        gestionAsistencia.counter = appGenericConstant.CERO;
        gestionAsistencia.nombrePeriodoAcademico = "";
        gestionAsistencia.nombreAplicaModal = "";
        gestionAsistencia.nombreLiquidacionModal = "";
        gestionAsistencia.codigo = "";
        gestionAsistencia.periodoId = appGenericConstant.CERO;
        gestionAsistencia.report = {
            selected: null
        };

        if (localStorageService.get('nombreAplica') !== null) {
            gestionAsistencia.nombreAplicaModal = localStorageService.get('nombreAplica');
        }
        if (localStorageService.get('nombreLiquidacion') !== null) {
            gestionAsistencia.nombreLiquidacionModal = localStorageService.get('nombreLiquidacion');
        }

        gestionAsistencia.onFiltrarProgramaPorNivelFormacion = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var idNivelFormacion = appGenericConstant.TRES;
            asistenciaServices.getProgramasByNivelFormacion(idNivelFormacion).then(function (data) {
                gestionAsistencia.programas = [];
                angular.forEach(data, function (value, key) {
                    var programa = {
                        id: value.id,
                        nombre: value.nombrePrograma
                    };
                    gestionAsistencia.programas.push(programa);
                });
                appConstant.CERRAR_SWAL();
                if (gestionAsistencia.programas.length === appGenericConstant.CERO) {
                    gestionAsistencia.visibleMensaje = appGenericConstant.NO_ENCONTRARON_PROGRAMA;
                } else {

                }
                asistenciaServices.getPeriodosAcademicos().then(function (data) {
                    angular.forEach(data, function (value, key) {
                        if (value.nombreEstadoPeriodo === appGenericConstant.ABIERTO) {
                            gestionAsistencia.periodoId = value.id;
                            gestionAsistencia.nombrePeriodoAcademico = value.nombrePeriodoAcademico;
                        }
                    });
                });

            }).catch(function (e) {
                gestionAsistencia.programas = [];
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        function onUpdateEnviadoMatricula(idMatricula) {
            asistenciaServices.updateEnviadoMatricula(idMatricula, 1).then(function (data) {
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        gestionAsistencia.onFiltrarAsistencia = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionAsistencia.disabledCodigo = false;
            asistenciaServices.getListadoAsistenciaByProgramaCertificado(gestionAsistencia.programa.id, gestionAsistencia.periodoId).then(function (data) {
                gestionAsistencia.listAsistencia = data;

                gestionAsistencia.listAsistenciaNoEnviado = $.grep(data, function (v) {
                    return v.porcentajeAsistencia === "APLICA" && v.estadoLiquidacion === "PAGO" && v.enviado === 0;
                });

                gestionAsistencia.listAsistenciaEnviado = $.grep(data, function (v) {
                    return v.enviado === 1;
                });

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionAsistencia.onFiltrarAsistenciaEnviado = function (enviado) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionAsistencia.disabledCodigo = false;
            asistenciaServices.getListadoAsistenciaByProgramaCertificadoEnviado(gestionAsistencia.programa.id, gestionAsistencia.periodoId, 1).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionAsistencia.listAsistenciaEnviado = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionAsistencia.onFiltrarAsistenciaNoEnviado = function (enviado) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionAsistencia.disabledCodigo = false;
            asistenciaServices.getListadoAsistenciaByProgramaCertificadoEnviado(gestionAsistencia.programa.id, gestionAsistencia.periodoId, 0).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionAsistencia.listAsistenciaNoEnviado = $.grep(data, function (v) {
                    return v.porcentajeAsistencia === "APLICA" && v.estadoLiquidacion === "PAGO";
                });
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionAsistencia.onFiltrarAsistenciaDelDia = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionAsistencia.disabledCodigo = false;
            asistenciaServices.getListadoAsistenciaByProgramaDelDia(gestionAsistencia.programa.id, gestionAsistencia.periodoId).then(function (data) {
                gestionAsistencia.listAsistencia = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
        // /*Metodo para obtener lo filtrados*/
        // gestionAsistencia.obtenerFiltrados = function (filtrados) {
        //     gestionAsistencia.filtrados = filtrados;
        //     if (gestionAsistencia.filtrados.length === appGenericConstant.CERO) {
        //         gestionAsistencia.selectTodos = false;
        //         gestionAsistencia.report.selected.length = null;
        //     }
        // };
        // /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        // gestionAsistencia.onSelectTodos = function () {
        //     if (gestionAsistencia.selectTodos === true) {
        //         gestionAsistencia.report.selected = gestionAsistencia.filtrados.slice();
        //     } else {
        //         gestionAsistencia.report.selected.length = null;
        //     }
        // };
        // /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        // gestionAsistencia.onSelectTodosTable = function (clase) {
        //     if (gestionAsistencia.report.selected.length === gestionAsistencia.filtrados.length
        //             && gestionAsistencia.selectTodos === true) {
        //         gestionAsistencia.selectTodos = false;
        //     } else {
        //         if (!clase) {
        //             if (gestionAsistencia.report.selected.length + 1 === gestionAsistencia.filtrados.length
        //                     && gestionAsistencia.selectTodos === false) {
        //                 gestionAsistencia.selectTodos = true;
        //             }
        //         } else {
        //             gestionAsistencia.selectTodos = false;
        //         }

        //     }
        // };
        if (localStorageService.get('periodoAcademico') !== null) {
            gestionAsistencia.periodoAcademico = localStorageService.get('periodoAcademico');
        }
        if (localStorageService.get('periodoAcademicoAuxiliar') !== null) {
            gestionAsistencia.periodoAcademicoAuxiliar = localStorageService.get('periodoAcademicoAuxiliar');
        }

        /*Formateo fecha*/
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

        function onToDate(dateStr, anioLectivo) {
            var d = new Date();
            if (anioLectivo === null || anioLectivo === appGenericConstant.INDEFINIDO || anioLectivo === "") {
                anioLectivo = d.getFullYear();
            }
            if (anioLectivo.length !== 4) {
                anioLectivo = d.getFullYear();
            }
            if (dateStr !== null && dateStr !== appGenericConstant.INDEFINIDO && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                //                return new Date(parts[2], parts[1] - 1, parts[0]);
                return [parts[0], parts[1], anioLectivo].join('/');
            }
        }

        function onToDateString(dateStr) {
            if (dateStr !== null && dateStr !== appGenericConstant.INDEFINIDO && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }

        function onCambiarFecha(dateStr) {
            if (dateStr !== null && dateStr !== appGenericConstant.INDEFINIDO && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date([parts[1], parts[0], parts[2]].join('/'));
            }
        }

        gestionAsistencia.onBlurText = function () {
            document.getElementById('codigo').focus();
        };
        $('#codigo').keypress(function (e) {
            if (e.which === 13) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                if (gestionAsistencia.programa.id === null
                    || gestionAsistencia.programa.id === undefined
                    || gestionAsistencia.programa.id === ''
                    || gestionAsistencia.programa.id === appGenericConstant.VACIO) {
                    appConstant.CERRAR_SWAL();
                    gestionAsistencia.codigo = '';
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_SELECCION_PROGRAMA);
                    return;
                }

                if (gestionAsistencia.codigo === null
                    || gestionAsistencia.codigo === undefined
                    || gestionAsistencia.codigo === ''
                    || gestionAsistencia.codigo === appGenericConstant.VACIO) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.INGRESAR_CODIGO);
                    return;
                }

                asistenciaServices.getListadoAsistenciaByProgramaAsistenciaDelDia(gestionAsistencia.programa.id, gestionAsistencia.periodoId, gestionAsistencia.codigo).then(function (data) {
                    if (data) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ASISTENCIA_DIARIA);
                        gestionAsistencia.codigo = '';
                        return;
                    }

                    asistenciaServices.getListadoAsistenciaByProgramaDisponible(gestionAsistencia.programa.id, gestionAsistencia.periodoId, gestionAsistencia.codigo).then(function (data) {

                        if (data.length === appGenericConstant.CERO) {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_EDUCACION_CONTINUADA);
                            gestionAsistencia.codigo = '';
                            return;
                        }
                        gestionAsistencia.asistenciaGuardar = {};
                        angular.forEach(data, function (value, key) {
                            gestionAsistencia.asistenciaGuardar = value;
                        });
                        asistenciaServices.postGuardarAsistencia(gestionAsistencia.asistenciaGuardar).then(function (data) {
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            gestionAsistencia.onFiltrarAsistenciaDelDia();
                        }).catch(function (e) {
                            appConstant.MSG_GROWL_ERROR();
                            gestionAsistencia.onCloseModal();
                            throw e;
                        });
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        throw e;
                    });
                    gestionAsistencia.codigo = "";
                });
                appConstant.CERRAR_SWAL();
            }
        });
        gestionAsistencia.onBuscarConfiguracionEduCon = function (item) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();

            var idPro = "";
            var idPeri = "";
            if (gestionAsistencia.programa.id === undefined || gestionAsistencia.programa.id === null || gestionAsistencia.programa.id === "") {
                idPro = item.idPrograma;
                idPeri = item.idPeriodo;
            } else {
                idPro = gestionAsistencia.programa.id;
                idPeri = gestionAsistencia.periodoId;
            }

            confiEducacionContinuadaServices.buscarConfiguracionByProgramaAndPeriodoAcademico(idPro, idPeri).then(function (data) {
                if (data !== null && data !== "" && data.length !== 0) {
                    asistenciaServices.getUniversidad(appGenericConstant.ID_UNIVERSIDAD_ELYON_YIRETH).then(function (dataU) {
                        switch (data[0].idTipoEducacionContinuada) {
                            case appGenericConstant.ID_SEMINARIO:
                                var fechaSeminario = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaSeminario: new Date(fechaSeminario),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };
                                gestionAsistencia.onGenerarReporte(info, appGenericConstant.UNO);
                                break;
                            case appGenericConstant.ID_DIPLOMADO:
                                var fechaInicio = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var fechaFin = $filter('date')(data[0].fechaFin, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaInicio: new Date(fechaInicio),
                                    fechaFin: new Date(fechaFin),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };
                                gestionAsistencia.onGenerarReporte(info, appGenericConstant.DOS);
                                break;
                            case appGenericConstant.ID_CONGRESO:
                                var fechaInicio = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var fechaFin = $filter('date')(data[0].fechaFin, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaSeminario: new Date(fechaInicio),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };

                                //gestionAsistencia.onConsultarEstudiante(item.codigo, info);
                                gestionAsistencia.onGenerarReporte(info, appGenericConstant.CUATRO);
                                break;
                            default:
                                gestionAsistencia.onGenerarReporte(data, appGenericConstant.CUATRO);
                                break;
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.GENERAR_NO_CERTIFICADO);
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
        gestionAsistencia.onGenerarReporte = function (info, num) {
            gestionAsistencia.item = [];
            var headers = { Authorization: localStorageService.get('autorizacion').token };
            var objReport = {
                Certificado: info
            };
            var jsonString = JSON.stringify(objReport);
            jsonString = num + jsonString;
            var urlRequest = '/api/matricula/report/crearReportD/';
            onGenerarReporteDirecto(objReport, num, urlRequest);
        };
        
        gestionAsistencia.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_MATRICULA);
            if (file !== null && itemArc !== null && itemArc !== appGenericConstant.INDEFINIDO) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            }
        };

        gestionAsistencia.onEnviarMasivo = function () {
            var contador = 0;
            angular.forEach(gestionAsistencia.listAsistenciaNoEnviado, function (value, key) {
                try {
                    if (contador <= 300) {
                        gestionAsistencia.onBuscarConfiguracionEduConEmail(value);
                        contador = contador + 1;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
            contador = 0;
            gestionAsistencia.onFiltrarAsistencia();
            // gestionAsistencia.onFiltrarAsistenciaNoEnviado(0);
            appConstant.CERRAR_SWAL();
        };

        gestionAsistencia.onBuscarConfiguracionEduConEmail = function (item) {
            appConstant.MSG_LOADING("Enviando Certificado, espera un momento...");
            appConstant.CARGANDO();

            var idPro = "";
            var idPeri = "";
            if (gestionAsistencia.programa.id === undefined || gestionAsistencia.programa.id === null || gestionAsistencia.programa.id === "") {
                idPro = item.idPrograma;
                idPeri = item.idPeriodo;
            } else {
                idPro = gestionAsistencia.programa.id;
                idPeri = gestionAsistencia.periodoId;
            }

            confiEducacionContinuadaServices.buscarConfiguracionByProgramaAndPeriodoAcademico(idPro, idPeri).then(function (data) {
                if (data !== null && data !== "" && data.length !== 0) {
                    asistenciaServices.getUniversidad(appGenericConstant.ID_UNIVERSIDAD_ELYON_YIRETH).then(function (dataU) {
                        switch (data[0].idTipoEducacionContinuada) {
                            case appGenericConstant.ID_SEMINARIO:
                                var fechaSeminario = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaSeminario: new Date(fechaSeminario),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };
                                item.nombrePrograma = info.nombrePrograma;
                                item.fechaSeminario = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_DDMMYYYY, '+0430');
                                item.intensidadHoraria = info.intensidadHoraria;
                                gestionAsistencia.onGenerarReporteEmail(info, appGenericConstant.UNO, item);
                                break;
                            case appGenericConstant.ID_DIPLOMADO:
                                var fechaInicio = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var fechaFin = $filter('date')(data[0].fechaFin, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaInicio: new Date(fechaInicio),
                                    fechaFin: new Date(fechaFin),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };
                                item.nombrePrograma = info.nombrePrograma;
                                item.fechaInicio = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_DDMMYYYY, '+0430');
                                item.fechaFin = $filter('date')(data[0].fechaFin, appGenericConstant.FECHA_DDMMYYYY, '+0430');
                                item.intensidadHoraria = info.intensidadHoraria;
                                gestionAsistencia.onGenerarReporteEmail(info, appGenericConstant.DOS, item);
                                break;
                            case appGenericConstant.ID_CONGRESO:
                                var fechaInicio = $filter('date')(data[0].fechaInicio, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var fechaFin = $filter('date')(data[0].fechaFin, appGenericConstant.FECHA_MMDDYYYY, '+0430');
                                var info = {
                                    id: item.id,
                                    idEstudiante: item.idEstudiante,
                                    fechaSeminario: new Date(fechaInicio),
                                    nombreEstudiante: item.nombreEstudiante,
                                    nombrePrograma: data[0].nombrePrograma,
                                    intensidadHoraria: data[0].intensidadHoraria,
                                    nombreRector: dataU.rector === null || dataU.rector === appGenericConstant.INDEFINIDO || dataU.rector === '' ? 'Rector' : dataU.rector,
                                    nombreCoordinadorAcademico: dataU.coordinador === null || dataU.coordinador === appGenericConstant.INDEFINIDO || dataU.coordinador === '' ? "Coordinador Académico" : dataU.coordinador
                                };

                                gestionAsistencia.onConsultarEstudiante(item.codigo, info);
                                break;
                            default:
                                gestionAsistencia.onGenerarReporteEmail(data, appGenericConstant.CUATRO, item);
                                break;
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        //return;
                    });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ENVIAR_NO_CERTIFICADO);
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                //return;
            });
        };

        gestionAsistencia.onGenerarReporteEmail = function (info, num, item) {
            gestionAsistencia.dataEstudiante = {};
            gestionAsistencia.dataEstudiante.id = item.idMatricula;
            gestionAsistencia.item = [];
            var headers = { 
                Authorization: localStorageService.get('autorizacion').token,
                Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReport = {
                Certificado: info
            };
            var jsonString = JSON.stringify(objReport);
            jsonString = num + jsonString;
            var urlRequest = '/api/matricula/report/crearReportEmail/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    gestionAsistencia.enviarEmailCertificado(data.data.object, item);
                } else {
                    appConstant.MSG_EMAIL_REPORTE_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_EMAIL_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            });
        };
        gestionAsistencia.enviarEmailCertificado = function (byte, item) {
            if (byte === null || byte === appGenericConstant.INDEFINIDO) {
                appConstant.MSG_EMAIL_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                // return;
            } else {
                var estudiante = {
                    id: item.id,
                    idEstudiante: item.idEstudiante,
                    nombreEstudiante: item.nombreEstudiante,
                    nombrePrograma: item.nombrePrograma,
                    emailEstudiante: item.emailEstudiante,
                    intensidadHoraria: item.intensidadHoraria,
                    certificado: byte,
                    fechaSeminario: item.fechaSeminario === appGenericConstant.INDEFINIDO ? null : item.fechaSeminario,
                    fechaInicio: item.fechaInicio === appGenericConstant.INDEFINIDO ? null : item.fechaInicio,
                    fechaFin: item.fechaFin === appGenericConstant.INDEFINIDO ? null : item.fechaFin
                };
                asistenciaServices.enviarEmailCertificado(estudiante).then(function (data) {
                    if (data.tipo === appGenericConstant.OK) {
                        appConstant.MSG_GROWL_OK("Certificado enviado de manera exitosa.");
                        onUpdateEnviadoMatricula(gestionAsistencia.dataEstudiante.id);
                        appConstant.CERRAR_SWAL();
                    } else {
                        appConstant.MSG_EMAIL_REPORTE_ERROR();
                        appConstant.CERRAR_SWAL();
                    }
                }).catch(function (e) {
                    appConstant.MSG_EMAIL_REPORTE_ERROR();
                    appConstant.CERRAR_SWAL();
                });
            }
        };

        gestionAsistencia.onConsultarEstudiante = function (identificacion, infoReporte) {
            gestionAsistencia.listadoProgramasCongreso = [];
            cambioHorarioServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                if (data === null || data === undefined || data.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_EXISTE);
                    return;
                } else {
                    gestionAsistencia.estudainteList = [];
                    gestionAsistencia.estudiante = {};
                    gestionAsistencia.estudiante.tipoDocumento = data[0].tipoDocumento;
                    gestionAsistencia.estudiante.identificacion = data[0].identificacionAspirante;
                    gestionAsistencia.estudiante.nombres = data[0].nombreAspirante;
                    gestionAsistencia.estudiante.apellidos = data[0].apellidoAspirante;
                    gestionAsistencia.estudiante.programas = data[0].programa;

                    gestionAsistencia.programas = [];
                    gestionAsistencia.listadoProgramasCongreso = [];
                    angular.forEach(gestionAsistencia.estudiante.programas, function (value, key) {
                        if (value.idNivelFormacion === 2 && value.idPrograma!== 300) { //idPrograma 207 ingles
                            cambioHorarioServices.consultarProgramaPorEstudianteNivelFormacion(value.idPrograma, value.idNivelFormacion).then(function (data) {
                                
                                if(infoReporte.nombrePrograma = data.nombrePrograma){
                                    infoReporte.nombrePrograma = data.nombreCongreso === '' ? 'NO_TIENE_NOMBRE' :
                                    data.nombreCongreso === null ? 'NO_TIENE_NOMBRE' :
                                        data.nombreCongreso === undefined ? 'NO_TIENE_NOMBRE' : data.nombreCongreso;

                                    var jsonMostrar = {};
                                    jsonMostrar.nombrePrograma = infoReporte.nombrePrograma;
                                    jsonMostrar.infoReporte = infoReporte;
                                    gestionAsistencia.listadoProgramasCongreso.push(jsonMostrar);
                                }
                            }).catch(function (e) {
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            });
                        }else{
                            if (value.idNivelFormacion === 3 && value.idPrograma!== 300) {
                                cambioHorarioServices.consultarProgramaPorEstudianteNivelFormacion(value.idPrograma, value.idNivelFormacion).then(function (data) {
                                    if(infoReporte.nombrePrograma === data.nombrePrograma){
                                        var jsonMostrar = {};
                                        jsonMostrar.nombrePrograma = infoReporte.nombrePrograma;
                                        jsonMostrar.infoReporte = infoReporte;
                                        gestionAsistencia.listadoProgramasCongreso.push(jsonMostrar);
                                    }
                            }).catch(function (e) {
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            });
                        }
                    }
                    });

                    //                    if (gestionAsistencia.estudiante.programas.length === 1) {
                    ////                        gestionAsistencia.onGenerarReporte(infoReporte, appGenericConstant.TRES);
                    //                        appConstant.CERRAR_SWAL();
                    //                    } else {

                    //                    }

                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });

            $('#modalGenerarReporteVariosCongresos').modal({ backdrop: 'static', keyboard: false });
            $("#modalGenerarReporteVariosCongresos").modal("show");
            appConstant.CERRAR_SWAL();
        };

        gestionAsistencia.onVerDetalleAsistencia = function (item) {
            gestionAsistencia.listAsistenciaDetalle = [];
            gestionAsistencia.nombreEstudianteModal = item.nombreEstudiante;
            gestionAsistencia.nombreAplicaModal = item.porcentajeAsistencia;
            gestionAsistencia.nombreLiquidacionModal = item.estadoLiquidacion;
            gestionAsistencia.listAsistenciaDetalle = item.listDetalleAsistencia;
            localStorageService.set('nombreAplica', gestionAsistencia.nombreAplicaModal);
            localStorageService.set('nombreLiquidacion', gestionAsistencia.nombreLiquidacionModal);

            $('#modalDestalleAsistencia').modal({ backdrop: 'static', keyboard: false });
            $("#modalDestalleAsistencia").modal("show");
        };

        gestionAsistencia.onGenerarReporteCongresoSeleccionado = function (item) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            gestionAsistencia.onGenerarReporte(item, appGenericConstant.CUATRO);
        };
        gestionAsistencia.onGenerarReporteCongresoSeleccionadoEmail = function (infoEmial) {
            appConstant.MSG_LOADING("Enviando Certificado, espera un momento...");
            appConstant.CARGANDO();
            var item = {};
            item.nombrePrograma = infoEmial.nombrePrograma;
            item.fechaInicio = $filter('date')(infoEmial.fechaInicio, appGenericConstant.FECHA_DDMMYYYY, '+0430');
            item.fechaFin = $filter('date')(infoEmial.fechaFin, appGenericConstant.FECHA_DDMMYYYY, '+0430');
            item.intensidadHoraria = infoEmial.intensidadHoraria;
            gestionAsistencia.onGenerarReporteEmail(infoEmial, appGenericConstant.CUATRO, item);
            //            gestionAsistencia.onGenerarReporte(item, appGenericConstant.TRES);
        };

        gestionAsistencia.onFiltrarProgramaPorNivelFormacion();
        asistenciaServices.getPeriodosAcademicos();

        gestionAsistencia.onConsultarAsistenciaEstudiante = function (codigo) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asistenciaServices.getAsistenciaEstudiante(codigo).then(function (data) {
                gestionAsistencia.listAsistenciaEstudiante = [];
                gestionAsistencia.listAsistenciaEstudiante = data;
                angular.forEach(data, function (value, key) {
                    gestionAsistencia.estadoAsistencia = value.listDetalleAsistencia[0].estadoAsistencia;
                    gestionAsistencia.fechaAsistencia = value.listDetalleAsistencia[0].fechaAsistencia;
                });
            }).catch(function (e) {
                gestionAsistencia.programas = [];
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionAsistencia.usuario = "";
        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            gestionAsistencia.usuario = usuario;

            if (gestionAsistencia.usuario.rol.codigo === "ESTUDIANTE") {
                gestionAsistencia.onConsultarAsistenciaEstudiante(gestionAsistencia.usuario.identificacion);
            }

        }

        function onGenerarReporteDirecto(json, opcion, url) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            //gestionNotaEstudiante.item = [];

            var jsonString = JSON.stringify(json);
            jsonString = opcion + "" + jsonString;
            var urlRequest = url;

            $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
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

    }
})();