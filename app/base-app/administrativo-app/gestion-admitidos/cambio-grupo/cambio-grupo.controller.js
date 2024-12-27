(function () {
    'use strict';
    angular.module('mytodoApp').controller('consultarGrupoCtrl', consultarGrupoCtrl);
    consultarGrupoCtrl.$inject = ['$scope', 'cambioGrupoService', 'asistenciaServices', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function consultarGrupoCtrl($scope, cambioGrupoService, asistenciaServices, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var consultarGrupoCtrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        consultarGrupoCtrl.display;
        consultarGrupoCtrl.selectTodos = false;
        consultarGrupoCtrl.filtrados = [];
        consultarGrupoCtrl.estados = [];
        consultarGrupoCtrl.listadoModulos = [];
        consultarGrupoCtrl.listadoGrupos = [];
        consultarGrupoCtrl.listadoGruposDestino = [];
        consultarGrupoCtrl.options = appConstant.FILTRO_TABLAS;
        consultarGrupoCtrl.selectedOption = consultarGrupoCtrl.options[0];
        consultarGrupoCtrl.configuracionNota = {};
        consultarGrupoCtrl.idNotaMasiva = null;
        consultarGrupoCtrl.valorNotaMasiva = null;

        consultarGrupoCtrl.report = {
            selectedModulo: null
        };
        consultarGrupoCtrl.report.selectedModulo = null;

        consultarGrupoCtrl.listaNotas = [
            {id: 1,
                nombreNota: 'Nota 1'},
            {id: 2,
                nombreNota: 'Nota 2'},
            {id: 3,
                nombreNota: 'Nota 3'}
        ];

        consultarGrupoCtrl.listadoEstudiantes = [];

        consultarGrupoCtrl.counter = 0;

        consultarGrupoCtrl.obtenerFiltrados = function (filtrados) {
            consultarGrupoCtrl.filtrados = filtrados;
            if (consultarGrupoCtrl.filtrados.length === appGenericConstant.CERO) {
                consultarGrupoCtrl.selectTodos = false;
                consultarGrupoCtrl.report.selectedModulo.length = null;
            }
        };

        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        consultarGrupoCtrl.onSelectTodos = function () {
            if (consultarGrupoCtrl.selectTodos === true) {
                consultarGrupoCtrl.report.selectedModulo = consultarGrupoCtrl.filtrados.slice();
            } else {
                consultarGrupoCtrl.report.selectedModulo.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        consultarGrupoCtrl.onSelectTodosTable = function (clase) {
            if (consultarGrupoCtrl.report.selectedModulo.length === consultarGrupoCtrl.filtrados.length
                    && consultarGrupoCtrl.selectTodos === true) {
                consultarGrupoCtrl.selectTodos = false;
            } else {
                if (!clase) {
                    if (consultarGrupoCtrl.report.selectedModulo.length + 1 === consultarGrupoCtrl.filtrados.length
                            && consultarGrupoCtrl.selectTodos === false) {
                        consultarGrupoCtrl.selectTodos = true;
                    }
                } else {
                    consultarGrupoCtrl.selectTodos = false;
                }

            }
        };

        consultarGrupoCtrl.onCargarConfiguracion = function () {
            cambioGrupoService.buscarConfiguracion().then(function (data) {

                if (data.length > 0) {
                    angular.forEach(data, function (value, key) {
                        consultarGrupoCtrl.configuracionNota =
                                {
                                    id: value.id,
                                    nota1: value.nota_1,
                                    nota2: value.nota_2,
                                    nota3: value.nota_3,
                                    notaHabilitacion: value.nota_H,
                                    notaDefinitiva: value.notaHabilitacion
                                };
                    });
                }
            });
        };

        function buscarModulo() {
            cambioGrupoService.buscarModulo().then(function (data) {
                consultarGrupoCtrl.listadoModulos = [];
                consultarGrupoCtrl.listadoModulos = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        consultarGrupoCtrl.onBuscarGruposByModulo = function () {
            if (consultarGrupoCtrl.idModulo === null || consultarGrupoCtrl.idModulo === undefined) {
                consultarGrupoCtrl.listadoGrupos = [];
                return;
            }

            cambioGrupoService.buscarGruposModulo(consultarGrupoCtrl.idModulo).then(function (data) {
                consultarGrupoCtrl.listadoGrupos = [];

                angular.forEach(data, function (value, key) {
                    if (value.idPeriodoAcademico === consultarGrupoCtrl.idPeriodoAbierto) {
                        consultarGrupoCtrl.listadoGrupos.push(value);
                    }
                });

                consultarGrupoCtrl.listadoEstudiantes = [];
//                if (consultarGrupoCtrl.listadoGrupos.length > 0) {
//                    consultarGrupoCtrl.idGrupo = consultarGrupoCtrl.listadoGrupos[0].id;
//                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });

        };

        consultarGrupoCtrl.onConsultarEstudiantes = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            consultarGrupoCtrl.listadoEstudiantes = [];
            consultarGrupoCtrl.listadoGruposDestino = [];

            cambioGrupoService.buscarEstudiantesByGrupoCambioGrupo(consultarGrupoCtrl.idGrupo).then(function (data) {
                consultarGrupoCtrl.listadoEstudiantes = data;
            });
            appConstant.CERRAR_SWAL();

            angular.forEach(consultarGrupoCtrl.listadoGrupos, function (value, key) {
                if (value.id !== consultarGrupoCtrl.idGrupo) {
                    if (value.idPeriodoAcademico === consultarGrupoCtrl.idPeriodoAbierto) {
                        consultarGrupoCtrl.listadoGruposDestino.push(value);
                    }
                }
            });

        };
        consultarGrupoCtrl.asignarGrupoDestino = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            appConstant.CERRAR_SWAL();

        };

        consultarGrupoCtrl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfiguracionNota)) {
                consultarGrupoCtrl.guardarNota();
                new ValidationService().resetForm($scope.formConfiguracionNota);
            }
        };

        consultarGrupoCtrl.guardarNota = function () {

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            if (consultarGrupoCtrl.idGrupoDestino === null || consultarGrupoCtrl.idGrupoDestino === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA('No se ha seleccionado un grupo destino');
                appConstant.CERRAR_SWAL();
                return;
            }

            if (consultarGrupoCtrl.report.selectedModulo.length === 0) {
                appConstant.MSG_GROWL_ADVERTENCIA('No se ha seleccionado estudiante');
                appConstant.CERRAR_SWAL();
                return;
            }

            angular.forEach(consultarGrupoCtrl.report.selectedModulo, function (value, key) {
                value.idGrupoDestino = consultarGrupoCtrl.idGrupoDestino;
                value.usuario = localStorageService.get("usuario").username;
                value.idUsuario = localStorageService.get("usuario").id;
            });

            cambioGrupoService.guardarCambioGrupo(consultarGrupoCtrl.report.selectedModulo).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    consultarGrupoCtrl.listadoGrupos = [];
                    consultarGrupoCtrl.listadoEstudiantes = [];
                    consultarGrupoCtrl.idModulo = null;
                    consultarGrupoCtrl.report.selectedModulo = [];
                } else {
                    consultarGrupoCtrl.listadoGrupos = [];
                    consultarGrupoCtrl.listadoEstudiantes = [];
                    appConstant.CERRAR_SWAL();
                    consultarGrupoCtrl.idModulo = null;
                    consultarGrupoCtrl.report.selectedModulo = [];

                }
            });
        };

        function buscarPeriodos() {
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {

                    if (value.idEstadoPeriodo === 11) {
                        consultarGrupoCtrl.idPeriodoAbierto = value.id;
                    }

                });
            });
        }

        buscarModulo();
        buscarPeriodos();
    }
})();