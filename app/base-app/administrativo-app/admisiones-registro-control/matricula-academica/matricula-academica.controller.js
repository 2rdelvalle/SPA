(function () {
    'use strict';
    angular.module('mytodoApp').controller('MatriculaAcademicaCtrl', MatriculaAcademicaCtrl);

    MatriculaAcademicaCtrl.$inject = ['$scope', 'matriculaAcademicaServices', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'utilServices', '$window', '$http', 'appConstant', 'appGenericConstant'];
    function MatriculaAcademicaCtrl($scope, matriculaAcademicaServices, growl, ValidationService, localStorageService, $timeout, utilServices, $window, $http, appConstant, appGenericConstant) {
        var gestionMatricula = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        var idEstadoPeriodoAcaAbierto = 11;
        gestionMatricula.listaPrograma = [];
        gestionMatricula.listadoHorarios = [];
        gestionMatricula.listadoNiveles = [];
        gestionMatricula.listadoGrupos = [];
        gestionMatricula.admitirMasivo = false;
        gestionMatricula.selectTodos = false;
        gestionMatricula.disabledCampos = false;
        gestionMatricula.filtrados = [];
        gestionMatricula.matricula = matriculaAcademicaServices.matricula;
        gestionMatricula.estudiante = matriculaAcademicaServices.estudiante;
        gestionMatricula.display;
        gestionMatricula.options = appConstant.FILTRO_TABLAS;
        gestionMatricula.selectedOption = gestionMatricula.options[0];
        gestionMatricula.report = {
            selected: null
        };
        gestionMatricula.reporteJsonData;


        function onBuscarPeriodoAcademico() {
            matriculaAcademicaServices.buscarPeriodosAcademicos().then(function (data) {
                gestionMatricula.listadoPeriodosAcademicos = [];
                gestionMatricula.listadoPeriodosAcademicos.push(data);
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
            matriculaAcademicaServices.buscarNivelesFormacion().then(function (data) {
                gestionMatricula.listadoNivelesFormacion = [];
                gestionMatricula.listadoNivelesFormacion = data;

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
            matriculaAcademicaServices.buscarProgramasAcademicos(gestionMatricula.matricula.idNivelFormacion).then(function (data) {
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
            matriculaAcademicaServices.buscarHorariosByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
                gestionMatricula.listadoHorarios = [];
                gestionMatricula.listadoHorarios = data;
                if (gestionMatricula.listadoHorarios.length > 0) {
                    gestionMatricula.matricula.idHorario = gestionMatricula.listadoHorarios[0].idHorario;
                } else {
                    gestionMatricula.matricula.idHorario = null;
                }
//                $timeout(function () {
//                    gestionMatricula.onConsultarEstudiantes();
//                }, 50);
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
            matriculaAcademicaServices.buscarNivelesByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
                gestionMatricula.listadoNiveles = [];
                gestionMatricula.listadoNiveles = data;
                if (gestionMatricula.listadoNiveles.length > 0) {
                    gestionMatricula.matricula.idNivel = gestionMatricula.listadoNiveles[0].idNivel;
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
            matriculaAcademicaServices.buscarGruposByPrograma(gestionMatricula.matricula.idPrograma).then(function (data) {
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
        gestionMatricula.onConsultarEstudiante = function (codigoEstudiante) {


            matriculaAcademicaServices.buscarProgramaEstudiante(codigoEstudiante).then(function (data) {
                angular.forEach(data, function (value, key) {

                    gestionMatricula.estudiante.nombreCompleto = value.nombreEstudiante + ' ' + value.apellidoEstudiante;
                    gestionMatricula.estudiante.identificacion = value.identificacionEstudiante;
                    gestionMatricula.listaPrograma = value.programa;
//                        var estudiante = {
//                            id: value.id,
//                            nombres: value.nombreEstudiante,
//                            apellidos: value.apellidoEstudiante,
//                            nombreCompleto: value.nombreEstudiante + ' ' + value.apellidoEstudiante,
//                            identificacion: value.identificacionEstudiante,
//                            idPeriodo: value.idPeriodo,
//                            listaPrograma:value.programa
//                //            idPrograma: value.idPrograma,
//                //            nombrePrograma: value.nombrePrograma,
//                //            idHorario: value.idHorario,
//                //            nombreHorario: value.nombreHorario,
//                //            idNivel: value.idNivel,
//                //            nombreNivel: value.nombreNivel,
//                //            idEstadoMatricula: value.idEstadoMatricula,
//                //            nombreEstadoMatricula: value.nombreEstadoMatricula,
//                //            fechaRegistro: value.nombreEstadoMatricula
//                        };
//                //        gestionMatricula.listadoEstudiante.push(estudiante);
//                        gestionMatricula.listaPrograma.push(estudiante.listaPrograma);
                });



            });
        };

        gestionMatricula.onAceptar = function () {
            var datosMatricula = {
                id: null,
                idPrograma: gestionMatricula.matricula.idPrograma,
                idModulo: gestionMatricula.matricula.idModulo,
                idHorario: gestionMatricula.matricula.idHorario,
                idMalla: gestionMatricula.matricula.idMalla,
                idEstudiante: gestionMatricula.matricula.idEstudiante,
                idPeriodoAcademico: gestionMatricula.matricula.idPeriodo,
                idNivel: gestionMatricula.matricula.idNivel,
                estadoMatricula: 'MATRICULADO'
            };

            matriculaAcademicaServices.registrarMatricula(datosMatricula).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        $("#modalMatriculaAcademica").modal("hide");
                        ;
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MATRICULA);
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        return;
                    default:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        break;
                }


            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        gestionMatricula.onConsultarEstudiantes = function () {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
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

                matriculaAcademicaServices.buscarEstudiantes(idperiodo, idprograma, idhorario, idnivel).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        var estudiante = {
                            id: value.id,
                            nombres: value.nombre,
                            apellidos: value.apellido,
                            nombreCompleto: value.nombre + ' ' + value.apellido,
                            identificacion: value.identificacion,
                            idPrograma: value.idPrograma

                        };
                        gestionMatricula.listadoEstudiante.push(estudiante);
                    });
                    if (gestionMatricula.listadoEstudiante.length === 0) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    } else {
                        appConstant.CERRAR_SWAL();
                    }

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    throw e;
                });
//                matriculaAcademicaServices.buscarModulosProgrma(idprograma, idnivel).then(function (data) {
//                    angular.forEach(data, function (value, key) {
//                        gestionMatricula.matricula.idMalla = value.idMalla;
//                        gestionMatricula.listadoModulos = [];
//                        gestionMatricula.listadoModulos = value.modulos;
//
//                    });
//                }).catch(function (e) {
//                    appConstant.CERRAR_SWAL();
//                    appConstant.MSG_GROWL_ERROR();
//                    throw e;
//                });

            } else {
                gestionMatricula.listadoEstudiante = [];
                appConstant.CERRAR_SWAL();
            }
        };

        onBuscarNivelesFormacion();
        onBuscarPeriodoAcademico();

        function onValidarTipoString(valor) {
            if (typeof valor === 'string') {
                valor = valor.toUpperCase();
            }
            return valor;
        }

        gestionMatricula.onOpenModal = function (item) {
            matriculaAcademicaServices.buscarModulosProgrma(item.idPrograma, item.id).then(function (data) {
                angular.forEach(data, function (value, key) {
                    gestionMatricula.matricula.idMalla = value.idMalla;
                    gestionMatricula.listadoModulos = [];
                    gestionMatricula.listadoModulos = value.modulos;

                });
                gestionMatricula.matricula.idEstudiante = item.id;
                gestionMatricula.matricula.idPrograma = item.idPrograma;
                $('#modalMatriculaAcademica').modal({backdrop: 'static', keyboard: false});
                $("#modalMatriculaAcademica").modal("show");
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });

//              gestionMatricula.matricula.idEstudiante= item.id;
//              gestionMatricula.matricula.idPrograma= item.idPrograma;
//            $('#modalMatriculaAcademica').modal({backdrop: 'static', keyboard: false});
//            $("#modalMatriculaAcademica").modal("show");
        };

        gestionMatricula.mostrarCampo = function (item) {
            $("#inputHid" + item.idNivel).prop("disabled", false);
            $('#inputHid' + item.idNivel).focus();
            $("#btnComd" + item.idNivel).hide();
            $("#btnCheck" + item.idNivel).show();
            item.cantidadModulos = $("#inputHid" + item.cantidadModulos).val();
            item.cantidadModulos = item.cantidadModulos === appGenericConstant.CERO ? "" : item.cantidadModulos;
            $("#inputHid" + item.cantidadModulos).val(item.cantidadModulos);
        };
        gestionMatricula.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };
        gestionMatricula.focusCampo = function (item) {
            $('#inputHid' + item.idNivel).focus(function () {
            });
            $('#inputHid' + item.idNivel).blur(function () {
                $("#inputHid" + item.idNivel).prop("disabled", true);
                $("#btnComd" + item.idNivel).show();
                $("#btnCheck" + item.idNivel).hide();
                if (item.cantidadModulos === "" || item.cantidadModulos === null || typeof item.cantidadModulos === 'undefined') {
                    $("#inputHid" + item.idNivel).val(appGenericConstant.CERO);
                }
            });
        };

    }
})();



