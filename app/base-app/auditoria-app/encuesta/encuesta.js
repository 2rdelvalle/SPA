(function () {
    'use strict';
    angular.module('mytodoApp').controller('EncuestaCtrl', EncuestaCtrl);

    EncuestaCtrl.$inject = ['$scope', '$http', '$location', 'asignarNotaDocenteService', 'grupoMatriculaServices', 'mallaService', 'pazSalvoAcademicoService', 'asistenciaServices', 'asignarNotaServiceGnrl', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function EncuestaCtrl($scope, $http, $location, asignarNotaDocenteService, grupoMatriculaServices, mallaService, pazSalvoAcademicoService, asistenciaServices, asignarNotaServiceGnrl, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var liquidarMatriculaControl = this;
        liquidarMatriculaControl.nuevoLiquidarMatricula = liquidarMatriculaService.liquidarMatricula;
        liquidarMatriculaControl.liquidarMatriculaAux = liquidarMatriculaService.liquidarMatriculaAuxiliar;
        liquidarMatriculaControl.listaModulosMatricula = [];
        liquidarMatriculaControl.listaDescuentosEstudiante = [];
        liquidarMatriculaControl.reporteJsonData;
        liquidarMatriculaControl.descuento = {};
        liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
        liquidarMatriculaControl.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
        liquidarMatriculaControl.report = {selectedModulo: null};
        liquidarMatriculaControl.selectTodos = false;
        liquidarMatriculaControl.listadoGrupos = [];

        function init() {

            liquidarMatriculaControl.usuario = "";
            if (localStorageService.get('usuario') !== null) {
                var usuario = localStorageService.get('usuario');
                liquidarMatriculaControl.usuario = usuario;
            }

            liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo = liquidarMatriculaControl.usuario.identificacion;
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaModulosMatricula = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
            liquidarMatriculaControl.report.selectedModulo = null;
            liquidarMatriculaControl.reporteJsonData;
            liquidarMatriculaControl.descuento = {};
            liquidarMatriculaControl.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
            liquidarMatriculaControl.selectTodos = false;
            buscarPeriodos();
        }

        liquidarMatriculaControl.onLimpiar = function () {
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaProgramas = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
//            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        function buscarPeriodos() {
            liquidarMatriculaControl.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                var i = 0;
                for (i; i < data.length; i++) {
                    var periodo = {
                        id: data[i].id,
                        nombre: data[i].nombrePeriodoAcademico,
                        idEstadoPeriodo: data[i].idEstadoPeriodo
                    };
                    if (periodo.idEstadoPeriodo === 11) {
                        liquidarMatriculaControl.listadoPeriodos.push(periodo);
                        liquidarMatriculaControl.idPeriodo = liquidarMatriculaControl.listadoPeriodos[0];
                    }
                }
            });
        }

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            liquidarMatriculaControl.usuario = usuario;
        }

        liquidarMatriculaControl.onGuardar = function () {
            agregarResultado();
        };

        function onCargarPreguntas(id) {
            grupoMatriculaServices.buscarPreguntasByIdEncuesta(id).then(function (data) {
                liquidarMatriculaControl.listPreguntas = [];
                liquidarMatriculaControl.listPreguntas = data;
            }).catch(function (e) {
                return;
            });
        }

        function onCargarPreguntasResultado(id) {
            grupoMatriculaServices.buscarPreguntasRespuestaByIdEncuesta(id).then(function (data) {
                liquidarMatriculaControl.listPreguntasRespuesta = [];
                liquidarMatriculaControl.listPreguntasRespuesta = data;
            }).catch(function (e) {
                return;
            });
        }

        function onCargarEncuestas() {
            grupoMatriculaServices.buscarEncuestas().then(function (data) {
                liquidarMatriculaControl.listEncuestas = [];
                angular.forEach(data, function (value, key) {
                    liquidarMatriculaControl.listEncuestas.push(value);
                });
            }).catch(function (e) {
                return;
            });
        }

        function onCargarEncuestasResutlado() {
            grupoMatriculaServices.onCargarResultadoEncuesta().then(function (data) {
                liquidarMatriculaControl.listResultadoEncuesta = [];
                liquidarMatriculaControl.listResultadoEncuesta = data;
            }).catch(function (e) {
                return;
            });
        }

        onCargarEncuestas();
        onCargarPreguntas(2);
        onCargarPreguntasResultado(2);
        onCargarEncuestasResutlado();

        liquidarMatriculaControl.onEvaluacion = function (item, idEncuesta) {
            liquidarMatriculaControl.detalleCuestionario = {};
            liquidarMatriculaControl.detalleCuestionario = item;
            liquidarMatriculaControl.idEncuesta = idEncuesta;

            $('#modalDatos').modal({backdrop: 'static', keyboard: false});
            $("#modalDatos").modal("show");
        };

        function  agregarResultado() {
            angular.forEach(liquidarMatriculaControl.listPreguntas, function (value, key) {

                if (value.respuesta === undefined || value.respuesta === null || value.respuesta === "") {
                    appConstant.MSG_GROWL_ADVERTENCIA("Aún Presenta preguntas sin responder");
                    return;
                }

                var resultado = {
                    idPregunta: value.id,
                    calificacion: value.respuesta,
                    idEstudiante: 0,
                    idGrupo: 0,
                    idUsuario: liquidarMatriculaControl.usuario.id,
                    tipoUsuario: "2",
                    idPeriodo: liquidarMatriculaControl.idPeriodo.id,
                    idEncuesta: 2
                };

                grupoMatriculaServices.registrarEvaluacionDocente(resultado).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            $("#modalDatos").modal("hide");
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                            $("#modalDatos").modal("hide");
                            return;
                        default:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                            break;
                    }

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });

            });
        }
        init();


        // --- 
        liquidarMatriculaControl.identiocente = localStorageService.get("usuario").identificacion;
        liquidarMatriculaControl.rol = localStorageService.get("usuario").rol;
        buscarModulo();
        function buscarModulo() {
            asignarNotaDocenteService.buscarModuloByDocente(liquidarMatriculaControl.identiocente).then(function (data) {
                liquidarMatriculaControl.listadoModulos = [];
                liquidarMatriculaControl.listadoModulos = data;
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        liquidarMatriculaControl.onBuscarGruposByModulo = function () {
            if (liquidarMatriculaControl.modulo === null || liquidarMatriculaControl.modulo === undefined) {
                liquidarMatriculaControl.listadoGrupos = [];
                return;
            }

            asignarNotaDocenteService.buscarGruposModulo(liquidarMatriculaControl.modulo.idModulo,
                    liquidarMatriculaControl.identiocente,
                    liquidarMatriculaControl.modulo.idPeriodo, liquidarMatriculaControl.modulo.idHorario).then(function (data) {
                liquidarMatriculaControl.listadoGrupos = [];
                liquidarMatriculaControl.listadoGrupos = data;
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };


    }
})();