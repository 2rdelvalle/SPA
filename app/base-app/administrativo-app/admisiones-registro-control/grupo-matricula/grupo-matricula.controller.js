(function () {
    'use strict';
    angular.module('mytodoApp').controller('grupoMatriculaCtrl', grupoMatriculaCtrl);
    grupoMatriculaCtrl.$inject = ['$scope', 'grupoMatriculaServices', 'mallaService', 'eventoService', '$location', 'localStorageService', 'appConstant', 'appGenericConstant'];
    function grupoMatriculaCtrl($scope, grupoMatriculaServices, mallaService, eventoService, $location, localStorageService, appConstant, appGenericConstant) {

        var grupoMaticulaControl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        grupoMaticulaControl.grupoMatricula = grupoMatriculaServices.grupomatricula;
        grupoMaticulaControl.nuevaEvento = eventoService.evento;
        grupoMaticulaControl.esvisible = grupoMatriculaServices.visible;
        grupoMaticulaControl.esvisibleevento = eventoService.visible;
        grupoMaticulaControl.listadoGrupos = [];
        grupoMaticulaControl.estudiantesMatriculados = [];
        grupoMaticulaControl.estudiantesMatriculadosauxiliares = [];
        grupoMaticulaControl.estudiantesSeleccionados = [];
        grupoMaticulaControl.options = appConstant.FILTRO_TABLAS;
        grupoMaticulaControl.selectedOption = grupoMaticulaControl.options[appGenericConstant.CERO];
        var objetoSeleccionadoP = {};
        grupoMaticulaControl.report = {
            selected: null
        };
        grupoMaticulaControl.reportes = {
            selected: null
        };
        grupoMaticulaControl.selectTodos = false;
        grupoMaticulaControl.desDelectTodos = false;

        grupoMaticulaControl.selectContacto = function (item) {
            if (grupoMaticulaControl.estudiantesSeleccionados.length < grupoMaticulaControl.grupoMatricula.maxEstudiante) {
                grupoMaticulaControl.estudiantesSeleccionados.push(item);
                var index = grupoMaticulaControl.estudiantesMatriculados.indexOf(item);
                grupoMaticulaControl.estudiantesMatriculados.splice(index, appGenericConstant.UNO);
            } else {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.MAX_ESTUDIANTE);
            }
        };

        grupoMaticulaControl.onEliminarUnContacto = function (item) {
            grupoMaticulaControl.estudiantesMatriculados.push(item);
            var index = grupoMaticulaControl.estudiantesSeleccionados.indexOf(item);
            grupoMaticulaControl.estudiantesSeleccionados.splice(index, appGenericConstant.UNO);
        };

        function onCargarMallas() {
            mallaService.consultarMallas().then(function (data) {
                grupoMaticulaControl.listaMallaAcademicas = data;
            }).catch(function (e) {
                return;
            });
        }
        onCargarMallas();
        grupoMaticulaControl.onChangePublicoObjectivoPadre = function (grupo) {
            grupoMaticulaControl.estudiantesMatriculados = [];
            grupoMaticulaControl.estudiantesSeleccionados = [];
            grupoMaticulaControl.grupoMatricula.maxEstudiante = null;
            grupoMaticulaControl.grupoMatricula.minEstudiante = null;
            grupoMaticulaControl.grupoMatricula.nombreModulo = null;
            grupoMaticulaControl.grupoMatricula.nombreHorario = null;
            grupoMaticulaControl.grupoMatricula.nombreDocente = null;
            if (grupo !== null) {

                grupoMaticulaControl.grupoMatricula.maxEstudiante = grupo.maximoEstudiante;
                grupoMaticulaControl.grupoMatricula.minEstudiante = grupo.minimoEstudiante;
                grupoMaticulaControl.grupoMatricula.nombreModulo = grupo.nombreModulo;
                grupoMaticulaControl.grupoMatricula.nombreHorario = grupo.nombreHorario;
                grupoMaticulaControl.grupoMatricula.nombreDocente = grupo.nombreDocente;
                grupoMaticulaControl.grupoMatricula.idPeriodoAcademico = grupo.idPeriodoAcademico;
                grupoMaticulaControl.grupoMatricula.idModulo = grupo.idModulo;

                grupoMatriculaServices.onBuscarEstudiante(grupo.id).then(function (data) {
                    if (data.length !== 0) {
                        angular.forEach(data[0].estudiantesGrupoMatricular, function (value, key) {
                            var datosMatricula = {
                                idGrupoMatricula: value.idGrupoMatricula,
                                idMatricula: value.idMatricula,
                                nombreCompleto: value.nombreEstudiante + " " + value.apellidoEstudiante,
                                identificacionEstudiante: value.identificacionEstudiante,
                                nombrePrograma: value.nombrePrograma,
                                idPrograma: value.idPrograma,
                                idModulo: value.idModulo,
                                idHorario: value.idHorario,
                                idMalla: value.idMalla,
                                idEstudiante: value.idEstudiante,
                                idPeriodoAcademico: value.idPeriodoAcademico,
                                idNivel: value.idNivel,
                                estadoMatricula: 'MATRICULADO',
                                nombreModulo: value.nombreModulo,
                                estadoDetalleLiquidacion: value.estadoDetalleLiquidacion,
                                matricula: value.matricula
                            };
                            grupoMaticulaControl.estudiantesMatriculados.push(datosMatricula);
                        });
                        angular.forEach(data[0].matriculados, function (value, key) {
                            var datosMatricula = {
                                idGrupoMatricula: value.idGrupoMatricula,
                                idMatricula: value.idMatricula,
                                nombreCompleto: value.nombreEstudiante + " " + value.apellidoEstudiante,
                                identificacionEstudiante: value.identificacionEstudiante,
                                nombrePrograma: value.nombrePrograma,
                                idPrograma: value.idPrograma,
                                idModulo: value.idModulo,
                                idHorario: value.idHorario,
                                idMalla: value.idMalla,
                                idEstudiante: value.idEstudiante,
                                idPeriodoAcademico: value.idPeriodoAcademico,
                                idNivel: value.idNivel,
                                estadoMatricula: 'MATRICULADO',
                                nombreModulo: value.nombreModulo,
                                estadoDetalleLiquidacion: value.estadoDetalleLiquidacion,
                                matricula: value.matricula
                            };
                            grupoMaticulaControl.estudiantesSeleccionados.push(datosMatricula);
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ESTUDIANTES);
                        grupoMaticulaControl.estudiantesMatriculados = [];
                        grupoMaticulaControl.estudiantesSeleccionados = [];
                    }
                }).catch(function (e) {
                    return;
                });
            }
        };

        grupoMaticulaControl.onSelectTodos = function () {
            if (grupoMaticulaControl.selectTodos === true) {
                grupoMaticulaControl.selectEstudianteAllOrFiltrados(grupoMaticulaControl.filtrados);
                grupoMaticulaControl.selectTodos = false;
            } else {
                grupoMaticulaControl.report.selected.length = null;
            }
        };

        grupoMaticulaControl.selectEstudianteAllOrFiltrados = function (item) {
            angular.forEach(item, function (value, key) {

                if (value.matricula === 1) {
                    grupoMaticulaControl.selectContacto(value);
                }
            });

        };

        grupoMaticulaControl.onDesSelectTodos = function () {
            if (grupoMaticulaControl.desDelectTodos === true) {
                grupoMaticulaControl.desSelectEstudianteAllOrFiltrados(grupoMaticulaControl.filtrado);
                grupoMaticulaControl.desDelectTodos = false;
            } else {
                grupoMaticulaControl.reportes.selected.length = null;
            }
        };

        grupoMaticulaControl.desSelectEstudianteAllOrFiltrados = function (item) {
            angular.forEach(item, function (value, key) {
                if (!(value.idGrupoMatricula !== null)) {
                    grupoMaticulaControl.onEliminarUnContacto(value);
                }
            });

        };

        grupoMaticulaControl.onGuardar = function () {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            if (grupoMaticulaControl.estudiantesSeleccionados.length > 0) {
                agregargrupoMatricula();
            } else {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_SELECT_ESTUDIANTES);
                appConstant.CERRAR_SWAL();
            }
        };

        function agregargrupoMatricula() {
            angular.forEach(grupoMaticulaControl.estudiantesSeleccionados, function (value, key) {
                value.idModulo = grupoMaticulaControl.grupoMatricula.idModulo;
                value.idPeriodoAcademico = grupoMaticulaControl.grupoMatricula.idPeriodoAcademico;

                value.codigoEstudiante = localStorageService.get('usuario').identificacion;
                grupoMaticulaControl.list = jQuery.map(grupoMaticulaControl.listaMallaAcademicas, function (obj) {
                    if (obj.idPrograma === value.idPrograma && obj.estado === 'ACTIVO') {
                        return obj;
                    }
                });
                if (grupoMaticulaControl.list.length > 0) {
                    value.idMalla = grupoMaticulaControl.list[0].id;
                }
            });


            var grupoMatricula = {
                id: null,
                idGrupo: grupoMaticulaControl.grupoMatricula.idGrupo.id,
                listaEstudiantes: grupoMaticulaControl.estudiantesSeleccionados,
                estado: 'ACTIVO',
                idUsuario: localStorageService.get('usuario').id
            };

            grupoMatriculaServices.registrarGrupoMatricula(grupoMatricula).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        grupoMaticulaControl.listResultado = response.objectResponse;
                        $('#modalResultadoMatricula').modal({ backdrop: 'static', keyboard: false });
                        $("#modalResultadoMatricula").modal("show");
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        grupoMaticulaControl.onChangePublicoObjectivoPadre(grupoMaticulaControl.grupoMatricula.idGrupo);
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                        return;
                    default:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        break;
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });

        }
        grupoMaticulaControl.onLimpiar = function () {
            grupoMaticulaControl.estudiantesMatriculados = [];
            grupoMaticulaControl.estudiantesSeleccionados = [];
            grupoMaticulaControl.listadoGrupos = [];
            grupoMaticulaControl.grupoMatricula.maxEstudiante = null;
            grupoMaticulaControl.grupoMatricula.minEstudiante = null;
            grupoMaticulaControl.grupoMatricula.nombreModulo = null;
            grupoMaticulaControl.grupoMatricula.nombreHorario = null;
            grupoMaticulaControl.grupoMatricula.idPeriodoAcademico = null;
        };
        grupoMaticulaControl.onBuscarGrupos = function (idPeriodo) {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            grupoMaticulaControl.listadoGrupos = [];
            grupoMaticulaControl.counter = 0;
            grupoMatriculaServices.buscarGruposPorPeriodo(idPeriodo).then(function (data) {
                grupoMaticulaControl.listadoGrupos = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
            });
        };

        function onBuscarPeriodosAcademicos() {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            grupoMaticulaControl.listaPeriodo = [];
            grupoMatriculaServices.buscarPeriodos().then(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.idEstadoPeriodo === 11) {
                        grupoMaticulaControl.listaPeriodo.push(value);
                    }
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
            });

        }

        if ($location.path() === '/gestion-grupo-matricula') {
            grupoMaticulaControl.onLimpiar();
            onBuscarPeriodosAcademicos();
        }

        $("#grupos").select2({
            data: onBuscarPeriodosAcademicos.listadoGrupos
        })
    }
})();



