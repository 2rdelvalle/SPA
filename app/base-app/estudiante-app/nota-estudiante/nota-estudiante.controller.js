'use strict';
angular.module('mytodoApp').controller('NotaEstudianteCtrl', ['$scope', 'notaEstudianteService', '$location', 'ValidationService', 'localStorageService', '$timeout', '$http', '$window', 'utilServices', 'appConstant', 'appGenericConstant', 'liquidarMatriculaService',
    function ($scope, notaEstudianteService, $location, ValidationService, localStorageService, $timeout, $http, $window, utilServices, appConstant, appGenericConstant, liquidarMatriculaService) {

        var gestionNotaEstudiante = this;
        var config = { disableCountDown: true, ttl: 5000 };
        gestionNotaEstudiante.listaPeriodos = [];
        gestionNotaEstudiante.listaNotas = [];
        gestionNotaEstudiante.listaProgramas = [];
        gestionNotaEstudiante.tieneDeudas = false;

        gestionNotaEstudiante.notaEntity = notaEstudianteService.entidad;
        gestionNotaEstudiante.report = {
            selected: null
        };
        gestionNotaEstudiante.display = appGenericConstant.DIEZ;

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            gestionNotaEstudiante.usuario = usuario;
        }

        function onConsultarPeriodos() {

            liquidarMatriculaService.consultarEstudianteAll(gestionNotaEstudiante.usuario.identificacion, 'NotEst').then(function (data) {
                if (data === "") {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA("No existe un estudiante con el código ingresado.");
                    gestionNotaEstudiante.tieneDeudas = true;
                } else {

                    if (data.liquidacionesPendiente !== undefined && data.liquidacionesPendiente !== null && data.liquidacionesPendiente !== "") {
                        appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                        gestionNotaEstudiante.tieneDeudas = true
                        return;
                    }

                    if (data.estadoMatriculaActual !== "" && data.estadoMatriculaActual !== undefined && data.estadoMatriculaActual !== null) {
                        var json = JSON.parse(data.estadoMatriculaActual)
                        if (json.estadoLiquidacion !== "PAGADA") {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                            gestionNotaEstudiante.tieneDeudas = true
                            return;
                        }
                    } else {
                        appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                        gestionNotaEstudiante.tieneDeudas = true
                        return;
                    }

                    if (data.estadoMatriculaActual !== "" && data.estadoMatriculaActual !== undefined && data.estadoMatriculaActual !== null) {
                        var json = JSON.parse(data.estadoMatriculaActual)
                        if (json.estadoLiquidacion !== "PAGADA") {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                            gestionNotaEstudiante.tieneDeudas = true
                        }

                    } else {
                        appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                        gestionNotaEstudiante.tieneDeudas = true
                    }

                    notaEstudianteService.consultarPeriodo(gestionNotaEstudiante.usuario.identificacion).then(function (data) {
                        var todos = { id: 0, nombrePeriodoAcademico: "Todos" };

                        gestionNotaEstudiante.listaPeriodos.push(todos);
                        gestionNotaEstudiante.listaPeriodos = data;
                    });

                    // angular.forEach(data.estudiantePrograma, function (value, key) {
                    //     liquidarMatriculaControl.listaProgramas.push(value)
                    // });
                    appConstant.CERRAR_SWAL();
                }

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        gestionNotaEstudiante.onConsultarNotas = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (id !== null && id !== appGenericConstant.INDEFINIDO) {
                notaEstudianteService.consultarNotas(gestionNotaEstudiante.notaEntity.PeriodoAcademico, gestionNotaEstudiante.usuario.identificacion, id).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    gestionNotaEstudiante.listaNotas = data;

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                gestionNotaEstudiante.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        gestionNotaEstudiante.onConsultarProgramas = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (id !== null && id !== appGenericConstant.INDEFINIDO) {
                notaEstudianteService.consultarProgramas(gestionNotaEstudiante.usuario.identificacion, id).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    gestionNotaEstudiante.listaProgramas = data;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                gestionNotaEstudiante.listaProgramas = [];
                appConstant.CERRAR_SWAL();
            }
        };
        if ($location.path() === '/nota-estudiante') {
            gestionNotaEstudiante.notaEntity.PeriodoAcademico = null;
            gestionNotaEstudiante.notaEntity.programaAcademico = null;
        }

        function estado(transversal) {
            var style;
            switch (transversal) {
                case "SI":
                    return style = 'TV';

                    break;
                case "NO":
                    return style = 'ST';
                    break;
                default:

                    break;
            }

        }

        onConsultarPeriodos();


    }]);




