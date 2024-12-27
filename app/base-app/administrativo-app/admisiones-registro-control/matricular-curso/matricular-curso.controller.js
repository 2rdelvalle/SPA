(function () {
    'use strict';
    angular.module('mytodoApp').controller('MatricularCursoCtrl', MatricularCursoCtrl);

    MatricularCursoCtrl.$inject = ['$scope', 'matriculaServices', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'utilServices', '$window', '$http', 'appConstant', 'appGenericConstant'];
    function MatricularCursoCtrl($scope, matriculaServices, growl, ValidationService, localStorageService, $timeout, utilServices, $window, $http, appConstant, appGenericConstant) {
        var gestionMatricula = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        var idEstadoPeriodoAcaAbierto = 11;
        var idNivelForEduContinuada = 20091;
        gestionMatricula.listadoEstudiante = [];
        gestionMatricula.listadoNivelesFormacion = [];
        gestionMatricula.listadoPeriodosAcademicos = [];
        gestionMatricula.listadoProgramas = [];
        gestionMatricula.listadoHorarios = [];
        gestionMatricula.listadoNiveles = [];
        gestionMatricula.listadoGrupos = [];
        gestionMatricula.admitirMasivo = false;
        gestionMatricula.selectTodos = false;
        gestionMatricula.disabledCampos = false;
        gestionMatricula.filtrados = [];
        gestionMatricula.matricula = matriculaServices.matricula;
        gestionMatricula.display;
        gestionMatricula.options = appConstant.FILTRO_TABLAS;
        gestionMatricula.selectedOption = gestionMatricula.options[0];
        gestionMatricula.report = {
            selected: null
        };
        gestionMatricula.reporteJsonData;

        if (localStorageService.get('inscrito') !== null) {
            var programasAcademicos = localStorageService.get('inscrito');
            gestionMatricula.inscritos = programasAcademicos;
        }
        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionMatricula.onSelectTodos = function () {
            if (gestionMatricula.selectTodos === true) {
                gestionMatricula.report.selected = gestionMatricula.filtrados.slice();
            } else {
                gestionMatricula.report.selected.length = null;
            }
        };

        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionMatricula.onSelectSeparate = function () {
            gestionMatricula.report.selected.length = null;
            gestionMatricula.selectTodos = false;
        };

        gestionMatricula.onSelectTodosTable = function (clase, item) {
            if (gestionMatricula.report.selected.length === gestionMatricula.filtrados.length
                    && gestionMatricula.selectTodos === true) {
                gestionMatricula.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionMatricula.report.selected.length + 1 === gestionMatricula.filtrados.length
                            && gestionMatricula.selectTodos === false) {
                        gestionMatricula.selectTodos = true;
                    }
                } else {
                    gestionMatricula.selectTodos = false;
                }
            }
        };


        function onBuscarPeriodoAcademico() {
            matriculaServices.buscarPeriodosAcademicos().then(function (data) {
                gestionMatricula.listadoPeriodosAcademicos = [];
                gestionMatricula.listadoPeriodosAcademicos = data;
                for (var i = 0; i < gestionMatricula.listadoPeriodosAcademicos.length; i++) {
                    if (gestionMatricula.listadoPeriodosAcademicos[i].idEstadoPeriodo === idEstadoPeriodoAcaAbierto) {
                        gestionMatricula.matricula.idPeriodo = gestionMatricula.listadoPeriodosAcademicos[i].id;
                        break;
                    }
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        }

        function onBuscarNivelesFormacion() {
            matriculaServices.buscarNivelesFormacion().then(function (data) {
                gestionMatricula.listadoNivelesFormacion = [];
                gestionMatricula.listadoNivelesFormacion = data;
                for (var i = 0; i < gestionMatricula.listadoNivelesFormacion.length; i++) {
                    if (gestionMatricula.listadoNivelesFormacion[i].id === idNivelForEduContinuada) {
                        gestionMatricula.matricula.idNivelFormacion = gestionMatricula.listadoNivelesFormacion[i].id;
                        break;
                    }
                }
                if (gestionMatricula.matricula.idNivelFormacion !== null && gestionMatricula.matricula.idNivelFormacion !== undefined) {
                    gestionMatricula.onBuscarProgramasAcademicos();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });

        }

        gestionMatricula.onBuscarProgramasAcademicos = function () {
            if (gestionMatricula.matricula.idNivelFormacion === null || gestionMatricula.matricula.idNivelFormacion === undefined) {
                gestionMatricula.listadoProgramas = [];
                return;
            }
            matriculaServices.buscarProgramasAcademicos(gestionMatricula.matricula.idNivelFormacion).then(function (data) {
                gestionMatricula.listadoProgramas = [];
                gestionMatricula.listadoProgramas = data;
                if (gestionMatricula.listadoProgramas.length > 0) {
                    gestionMatricula.matricula.idPrograma = gestionMatricula.listadoProgramas[0].id;
                    gestionMatricula.onBuscarHorarioByPrograma();
                } else {
                    gestionMatricula.matricula.idPrograma = null;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        gestionMatricula.onBuscarHorarioByPrograma = function () {
            if (gestionMatricula.matricula.idPrograma === null || gestionMatricula.matricula.idPrograma === undefined) {
                gestionMatricula.listadoHorarios = [];
                return;
            }
            matriculaServices.buscarHorariosByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
                gestionMatricula.listadoHorarios = [];
                gestionMatricula.listadoHorarios = data;
                if (gestionMatricula.listadoHorarios.length > 0) {
                    gestionMatricula.matricula.idHorario = gestionMatricula.listadoHorarios[0].id;
                } else {
                    gestionMatricula.matricula.idHorario = null;
                }
                $timeout(function () {
                    gestionMatricula.onConsultarEstudiantes();
                }, 50);
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
            gestionMatricula.onBuscarNivelByPrograma();
        };

        gestionMatricula.onBuscarNivelByPrograma = function () {
            if (gestionMatricula.matricula.idPrograma === null || gestionMatricula.matricula.idPrograma === undefined) {
                gestionMatricula.listadoNiveles = [];
                return;
            }
            matriculaServices.buscarNivelesByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
                gestionMatricula.listadoNiveles = [];
                gestionMatricula.listadoNiveles = data;
                if (gestionMatricula.listadoNiveles.length > 0) {
                    gestionMatricula.matricula.idNivel = gestionMatricula.listadoNiveles[0].id;
                } else {
                    gestionMatricula.matricula.idNivel = null;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        gestionMatricula.onBuscarGruposByPrograma = function () {
            if (gestionMatricula.matricula.idPrograma === null || gestionMatricula.matricula.idPrograma === undefined) {
                gestionMatricula.listadoGrupos = [];
                return;
            }
            matriculaServices.buscarGruposByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
                gestionMatricula.listadoGrupos = [];
                gestionMatricula.listadoGrupos = data;
                if (gestionMatricula.listadoGrupos.length > 0) {
                    gestionMatricula.matricula.idGrupo = gestionMatricula.listadoGrupos[0].id;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };


        gestionMatricula.onConsultarEstudiantes = function () {
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiantes)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                gestionMatricula.listadoEstudiante = [];
                var idnivelFormacion;
                var idperiodo;
                var idhorario;
                var idprograma;
                var idnivel;
                if ((gestionMatricula.matricula.idPeriodo === null || gestionMatricula.matricula.idPeriodo === undefined) ||
                        (gestionMatricula.matricula.idNivelFormacion === null || gestionMatricula.matricula.idNivelFormacion === undefined) ||
                        (gestionMatricula.matricula.idPrograma === null || gestionMatricula.matricula.idPrograma === undefined) ||
                        (gestionMatricula.matricula.idHorario === null || gestionMatricula.matricula.idHorario === undefined) ||
                        (gestionMatricula.matricula.idNivel === null || gestionMatricula.matricula.idNivel === undefined)) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CRITERIOS_DE_BUSQUEDA);
                    gestionMatricula.listadoEstudiante = [];
                    appConstant.CERRAR_SWAL();
                    return;
                }
                if (gestionMatricula.matricula.idPeriodo !== null && gestionMatricula.matricula.idPeriodo !== undefined) {
                    idperiodo = gestionMatricula.matricula.idPeriodo;
                } else {
                    idperiodo = 0;
                }
                if (gestionMatricula.matricula.idNivelFormacion !== null && gestionMatricula.matricula.idNivelFormacion !== undefined) {
                    idnivelFormacion = gestionMatricula.matricula.idNivelFormacion;
                } else {
                    idnivelFormacion = 0;
                }
                if (gestionMatricula.matricula.idPrograma !== null && gestionMatricula.matricula.idPrograma !== undefined) {
                    idprograma = gestionMatricula.matricula.idPrograma;
                } else {
                    idprograma = 0;
                }
                if (gestionMatricula.matricula.idHorario !== null && gestionMatricula.matricula.idHorario !== undefined) {
                    idhorario = gestionMatricula.matricula.idHorario;
                } else {
                    idhorario = 0;
                }
                if (gestionMatricula.matricula.idNivel !== null && gestionMatricula.matricula.idNivel !== undefined) {
                    idnivel = gestionMatricula.matricula.idNivel;
                } else {
                    idnivel = 0;
                }

                matriculaServices.buscarEstudiantes(idperiodo, idnivelFormacion, idprograma, idhorario, idnivel).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        var estudiante = {
                            id: value.id,
                            nombres: value.aspirante.nombre,
                            apellidos: value.aspirante.apellido,
                            nombreCompleto: value.aspirante.nombre + ' ' + value.aspirante.apellido,
                            tipodocumento: value.aspirante.identificacionAspirante.nombreTipoIdentificacion,
                            identificacion: value.aspirante.identificacionAspirante.identificacion,
                            identificacionfull: value.aspirante.identificacionAspirante.nombreTipoIdentificacion + ' ' + value.aspirante.identificacionAspirante.identificacion,
                            idPeriodo: value.idPeriodo,
                            nombrePeriodo: value.nombrePeriodo,
                            idNivelFormacion: value.idNivelFormacion,
                            nombreNivelFormacion: value.nombreNivelFormacion,
                            idPrograma: value.idPrograma,
                            nombrePrograma: value.nombrePrograma,
                            idHorario: value.idHorario,
                            nombreHorario: value.nombreHorario,
                            idNivel: value.idNivel,
                            nombreNivel: value.nombreNivel,
                            idEstadoMatricula: value.idEstadoMatricula,
                            nombreEstadoMatricula: value.nombreEstadoMatricula,
                            fechaRegistro: value.nombreEstadoMatricula
                        };
                        gestionMatricula.listadoEstudiante.push(estudiante);
                    });
                    if (gestionMatricula.listadoEstudiante.length === 0) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    }

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    throw e;
                });
            } else {
                gestionMatricula.listadoEstudiante = [];
                appConstant.CERRAR_SWAL();
            }
        };

        gestionMatricula.onOpenModal = function (item) {
            gestionMatricula.matricularMasivo = false;
            gestionMatricula.report.selected = [];
            gestionMatricula.matriculado = item;
            gestionMatricula.onBuscarGruposByPrograma();
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            gestionMatricula.matricularMasivo = false;
            $("#myModal").modal("show");
        };

        gestionMatricula.onOpenModalMasivo = function () {
            //            gestionMatricula.disabledCampos = true;
            gestionMatricula.matricularMasivo = true;
            gestionMatricula.onBuscarGruposByPrograma();
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        gestionMatricula.onCloseModal = function () {
            gestionMatricula.report.selected = [];
            gestionMatricula.matricularMasivo = false;
            $("#myModal").modal("hide");
        };

        gestionMatricula.onMatricular = function () {
            if (!gestionMatricula.matricularMasivo) {
                var admitido = {
                    id: gestionMatricula.admitido.id,
                    idAspirante: gestionMatricula.admitido.aspirante,
                    idSeccional: gestionMatricula.admitido.seccional,
                    idTipoConvenio: gestionMatricula.admitido.convenio,
                    idNivelFormacion: gestionMatricula.admitido.nivelformacionId,
                    estadoInscripcion: appGenericConstant.ADMITIDO,
                    idPrograma: gestionMatricula.admitido.programa,
                    idPeriodoAcademico: gestionMatricula.admitido.periodoAcademico,
                    idHorario: gestionMatricula.admitido.modalidad,
                    aspirante: gestionMatricula.admitido.aspiranteAdmitir
                };
                matriculaServices.actualizarAdmision(admitido).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            gestionMatricula.onCloseModal();
                            gestionMatricula.report.selected.length = null;
                            gestionMatricula.selectTodos = false;
                            gestionMatricula.reporteJsonData = data.objectResponse;
                            gestionMatricula.onGenerarReporte(gestionMatricula.reporteJsonData);
                            gestionMatricula.inscritos.splice(admitido, 1);
                            appConstant.MSG_GROWL_OK(appGenericConstant.ASPIRANTE_ADMITIDO);
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            break;
                        case 400:
                            appConstant.MSG_GROWL_ERROR();
                            gestionMatricula.onCloseModal();
                            break;
                        case 500:
                            appConstant.MSG_GROWL_ERROR();
                            gestionMatricula.onCloseModal();
                            break;
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    gestionMatricula.onCloseModal();
                    throw e;
                });
            } else {
                var listaAdmitidos = [];
                var list = gestionMatricula.report.selected;
                angular.forEach(list, function (value, key) {
                    var admitido = {
                        id: value.id,
                        idAspirante: value.aspirante,
                        idSeccional: value.seccional,
                        idTipoConvenio: value.convenio,
                        idNivelFormacion: value.nivelformacionId,
                        estadoInscripcion: appGenericConstant.ADMITIDO,
                        idPrograma: value.programa,
                        idPeriodoAcademico: value.periodoAcademico,
                        idHorario: value.modalidad
                    };
                    listaAdmitidos.push(admitido);
                });
                matriculaServices.actualizarAdmisionesMasiva(listaAdmitidos).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            gestionMatricula.onCloseModal();
                            gestionMatricula.selectTodos = false;
                            gestionMatricula.report.selected.length = null;
                            appConstant.MSG_GROWL_OK(appGenericConstant.ASPIRANTES_ADMITIDOS);
                            angular.forEach(listaAdmitidos, function (value, key) {
                                var admitido = {
                                    id: value.id,
                                    idAspirante: value.aspirante,
                                    idSeccional: value.seccional,
                                    idTipoConvenio: value.convenio,
                                    idNivelFormacion: value.nivelformacionId,
                                    estadoInscripcion: value.estado,
                                    idPrograma: value.programa,
                                    idPeriodoAcademico: value.periodoAcademico,
                                    idHorario: value.modalidad
                                };
                                gestionMatricula.inscritos.splice(admitido, 1);
                            });
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            break;
                        case 400:
                            appConstant.MSG_GROWL_ERROR();
                            gestionMatricula.onCloseModal();
                            break;
                        case 500:
                            appConstant.MSG_GROWL_ERROR();
                            gestionMatricula.onCloseModal();
                            break;
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    gestionMatricula.onCloseModal();
                    throw e;
                });
            }
        };

        onBuscarNivelesFormacion();
        onBuscarPeriodoAcademico();

        gestionMatricula.onEstadoEstilo = function (estado) {
            var style;
            if (estado === "MATRICULADO") {
                style = "bs-label label-success";
            } else if (estado === "EN_PROCESO") {
                style = "bs-label label-warning";
            } else {
                style = "bs-label label-warning";
            }
            return style;
        };

        $(window).load(function () {
            $("input.separate").keyup(function (e) {
                e.preventDefault();
                gestionMatricula.onSelectSeparate();
            });
        });


        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionMatricula.onSelectTodos = function () {
            if (gestionMatricula.selectTodos === true) {
                gestionMatricula.report.selected = gestionMatricula.filtrados.slice();
            } else {
                gestionMatricula.report.selected.length = null;
            }
        };

        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionMatricula.onSelectTodosTable = function (clase) {
            if (gestionMatricula.report.selected.length === gestionMatricula.filtrados.length
                    && gestionMatricula.selectTodos === true) {
                gestionMatricula.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionMatricula.report.selected.length + 1 === gestionMatricula.filtrados.length
                            && gestionMatricula.selectTodos === false) {
                        gestionMatricula.selectTodos = true;
                    }
                } else {
                    gestionMatricula.selectTodos = false;
                }
            }
        };


        gestionMatricula.mostrarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", false);
            $('#inputHid' + item).focus();
            $("#btnComd" + item).hide();
            $("#btnCheck" + item).show();
        };

        gestionMatricula.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };

        gestionMatricula.mostrarCampoText = function (item) {
            $("#textAreaHid" + item).prop("disabled", false);
            $('#textAreaHid' + item).focus();
            $("#btnComd2" + item).hide();
            $("#btnCheck2" + item).show();
        };

        gestionMatricula.ocultarCampoText = function (item) {
            $("#textAreaHid" + item).prop("disabled", true);
            $("#btnComd2" + item).show();
            $("#btnCheck2" + item).hide();
        };

        gestionMatricula.eliminarArchivo = function (item) {
            item.archivo = null;
            item.nombreArchivo = null;
        };


        gestionMatricula.focusCampo = function (item) {
            $('#inputHid' + item).focus(function () {
            });
            $('#inputHid' + item).blur(function () {
                $("#inputHid" + item).prop("disabled", true);
                $("#btnComd" + item).show();
                $("#btnCheck" + item).hide();
            });
        };
        gestionMatricula.focusCampoTextArea = function (item) {

            $('#textAreaHid' + item).focus(function () {
            });

            $('#textAreaHid' + item).blur(function () {
                $("#textAreaHid" + item).prop("disabled", true);
                $("#btnComd2" + item).show();
                $("#btnCheck2" + item).hide();
            });

        };
        gestionMatricula.clickShowPopover = function (item) {
            $('#btnComd3' + item.id).popover({title: "Observación", content: item.observacion, placement: "top", trigger: "manual"}).popover('show');
        };

        gestionMatricula.clickHidePopover = function (item) {
            $('#btnComd3' + item.id).popover('destroy').popover('hide');
        };

        //------------------Reporte-------------------------------------

        gestionMatricula.onGenerarReporte = function () {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            gestionMatricula.item = [];
            var nombrePeriodo = '';
            var nombreNivelFormacion = '';
            var nombrePrograma = '';
            for (var i = 0; i < gestionMatricula.listadoPeriodosAcademicos.length; i++) {
                if (gestionMatricula.listadoPeriodosAcademicos[i].id === gestionMatricula.matricula.idPeriodo) {
                    nombrePeriodo = gestionMatricula.listadoPeriodosAcademicos[i].nombrePeriodoAcademico;
                    break;
                }
            }
            for (var i = 0; i < gestionMatricula.listadoNivelesFormacion.length; i++) {
                if (gestionMatricula.listadoNivelesFormacion[i].id === gestionMatricula.matricula.idNivelFormacion) {
                    nombreNivelFormacion = gestionMatricula.listadoNivelesFormacion[i].nombreNivelFormacion;
                    break;
                }
            }
            for (var i = 0; i < gestionMatricula.listadoProgramas.length; i++) {
                if (gestionMatricula.listadoProgramas[i].id === gestionMatricula.matricula.idPrograma) {
                    nombrePrograma = gestionMatricula.listadoProgramas[i].nombrePrograma;
                    break;
                }
            }

            var est = {
                nombrePeriodo: nombrePeriodo,
                nombreNivelFormacion: nombreNivelFormacion,
                nombrePrograma: nombrePrograma,
                listaEstudiantes: [] // objectos quemados por favor revisar
            };
            var headers = {Authorization: localStorageService.get('autorizacion').token};
            var objReportEstudiante = {
                Estudiantes: est
            };
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "1" + jsonString;
            var urlRequest = '/api/matricula/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    gestionMatricula.item.push(data.data.message);
                    getIdArchivo(gestionMatricula.item[0]);
                } else {
                    appConstant.MSG_REPORTE_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                throw e;
            });
        };

        function getIdArchivo(itemId) {
            gestionMatricula.itemArchivo = "";
            gestionMatricula.itemArchivo = itemId;
            gestionMatricula.download(gestionMatricula.itemArchivo);
        }

        gestionMatricula.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appConstant.MICRO_SERVICIO_MATRICULA);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            }
        };

        //--------------------------------------------------------------
    }
})();

