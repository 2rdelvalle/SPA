(function () {
    'use strict';
    angular.module('mytodoApp').controller('aplazamientoCtrl', aplazamientoCtrl);
    aplazamientoCtrl.$inject = ['$scope', '$http', 'aplazamientoServices', 'mallaService', 'pazSalvoAcademicoService', 'asistenciaServices', 'asignarNotaServiceGnrl', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function aplazamientoCtrl($scope, $http, aplazamientoServices, mallaService, pazSalvoAcademicoService, asistenciaServices, asignarNotaServiceGnrl, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var aplazamiento = this;

        aplazamiento.nuevoLiquidarMatricula = liquidarMatriculaService.liquidarMatricula;
        aplazamiento.liquidarMatriculaAux = liquidarMatriculaService.liquidarMatriculaAuxiliar;
        aplazamiento.listaModulosMatricula = [];
        aplazamiento.listaDescuentosEstudiante = [];
        aplazamiento.reporteJsonData;
        aplazamiento.descuento = {};
        aplazamiento.nuevoLiquidarMatricula.valorDescontado = 0;
        aplazamiento.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
        aplazamiento.report = {selectedModulo: null};
        aplazamiento.selectTodos = false;
        aplazamiento.listadoGrupos = [];
        function init() {
            aplazamiento.nuevoLiquidarMatricula.codigoEstudianteCampo = null;
            aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
            aplazamiento.listaModulosMatricula = [];
            aplazamiento.nuevoLiquidarMatricula.total = 0;
            aplazamiento.report.selectedModulo = null;
            aplazamiento.reporteJsonData;
            aplazamiento.descuento = {};
            aplazamiento.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
            aplazamiento.selectTodos = false;
            buscarPeriodos();
        }

        aplazamiento.onLimpiar = function () {
            aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
            aplazamiento.listaProgramas = [];
            aplazamiento.nuevoLiquidarMatricula.listaModulos = [];
            aplazamiento.nuevoLiquidarMatricula.total = 0;
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        aplazamiento.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                aplazamiento.onConsultarEstudiante();
            }
        };

        aplazamiento.onConsultarEstudiante = function () {
            aplazamiento.onLimpiar();
            var codEstudiante = aplazamiento.nuevoLiquidarMatricula.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarMatriculaService.consultarEstudiante(codEstudiante).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            if (false) {
                            } else {
                                aplazamiento.nuevoLiquidarMatricula.id = data.objectResponse.id;
                                aplazamiento.nuevoLiquidarMatricula.nombre = data.objectResponse.nombre;
                                aplazamiento.nuevoLiquidarMatricula.apellido = data.objectResponse.apellido;
                                aplazamiento.nuevoLiquidarMatricula.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                aplazamiento.nuevoLiquidarMatricula.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                aplazamiento.nuevoLiquidarMatricula.tipoDocumento = data.objectResponse.tipoDocumento;
                                aplazamiento.nuevoLiquidarMatricula.identificacion = data.objectResponse.identificacion;
                                angular.forEach(data.objectResponse.estudiantePrograma, function (value, key) {
                                    aplazamiento.listaProgramas.push(value)
                                });
                                appConstant.CERRAR_SWAL();
                            }
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
                            break;
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };
        aplazamiento.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (aplazamiento.nuevoLiquidarMatricula.idProgramaSelected !== null) {

                    if (aplazamiento.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "TECNICO LABORAL" ||
                    aplazamiento.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "EDUCACIÓN CONTINUADA") {
                        aplazamiento.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = aplazamiento.listaProgramas.indexOf(aplazamiento.nuevoLiquidarMatricula.idProgramaSelected);
                        aplazamiento.nuevoLiquidarMatricula.idPrograma = aplazamiento.listaProgramas[index].idPrograma;
                        aplazamiento.nuevoLiquidarMatricula.idEstudiante = aplazamiento.listaProgramas[index].idEstudiante;
                        aplazamiento.nuevoLiquidarMatricula.nivelFormacion = aplazamiento.listaProgramas[index].nivelFormacion;
                        aplazamiento.nuevoLiquidarMatricula.programaNombre = aplazamiento.listaProgramas[index].programa;
                        aplazamiento.nuevoLiquidarMatricula.modalidad = aplazamiento.listaProgramas[index].modalidad;
                        aplazamiento.nuevoLiquidarMatricula.horario = aplazamiento.listaProgramas[index].horario;
                        aplazamiento.nuevoLiquidarMatricula.semestre = aplazamiento.listaProgramas[index].semestre;
                        aplazamiento.nuevoLiquidarMatricula.idPeriodo = aplazamiento.listaProgramas[index].idPeriodo;
                        aplazamiento.nuevoLiquidarMatricula.periodoActual = aplazamiento.listaProgramas[index].periodoActual;
                        aplazamiento.nuevoLiquidarMatricula.idModalidad = aplazamiento.listaProgramas[index].idModalidad;
                        aplazamiento.nuevoLiquidarMatricula.idHorario = aplazamiento.listaProgramas[index].idHorario2;

                        aplazamiento.onConsultarNotas();
                        onCargarMallas(aplazamiento.nuevoLiquidarMatricula.idPrograma);
                        asignarNotaServiceGnrl.buscarModuloByIdPrograma(aplazamiento.nuevoLiquidarMatricula.idProgramaSelected.idPrograma).then(function (data) {
                            aplazamiento.listadoModulos = [];
                            aplazamiento.listadoModulos = data;
                            aplazamiento.idModulo = null;
                            aplazamiento.idGrupo = null;
                            aplazamiento.listadoGrupos = [];
                        }).catch(function (e) {
                            appConstant.MSG_GROWL_ERROR();
                            return;
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no pertenece a nivel formación tecnico laboral");
                        aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
                    }
                } else {
                    aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                aplazamiento.liquidarMatriculaAux.onDeshabilitar = false;
            }

            aplazamiento.nuevoLiquidarMatricula.idProgramaSelected = null;

        };

        aplazamiento.onBuscarGruposByModulo = function () {
            if (aplazamiento.idModulo === null || aplazamiento.idModulo === undefined) {
                aplazamiento.listadoGrupos = [];
                return;
            }

            if (aplazamiento.idPeriodo === null || aplazamiento.idPeriodo === undefined) {
                aplazamiento.listadoGrupos = [];
                return;
            }

            if (aplazamiento.nuevoLiquidarMatricula.idPrograma === null || aplazamiento.nuevoLiquidarMatricula.idPrograma === undefined) {
                aplazamiento.listadoGrupos = [];
                return;
            }

            asignarNotaServiceGnrl.buscarGruposModuloPeriodoPrograma(aplazamiento.idModulo.id, aplazamiento.idPeriodo.id, aplazamiento.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                aplazamiento.listadoGrupos = [];
                aplazamiento.listadoGrupos = data;

                aplazamiento.listadoEstudiantes = [];
                if (aplazamiento.listadoGrupos.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron grupos bajo los criterios de busqueda.');
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        aplazamiento.onConsultarNotas = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (aplazamiento.nuevoLiquidarMatricula.codigoEstudianteCampo !== null && aplazamiento.nuevoLiquidarMatricula.codigoEstudianteCampo !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarNotas(aplazamiento.idPeriodo.id, aplazamiento.nuevoLiquidarMatricula.codigoEstudianteCampo, aplazamiento.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    aplazamiento.listaNotas = data;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                aplazamiento.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        function buscarPeriodos() {
            aplazamiento.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    aplazamiento.listadoPeriodos.push(periodo);
                });
                aplazamiento.idPeriodo = aplazamiento.listadoPeriodos[0];
            });
        }

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            aplazamiento.usuario = usuario;
        }

        aplazamiento.onGuardar = function () {
            if (aplazamiento.verDetalleAplazar.observacion === null || aplazamiento.verDetalleAplazar.observacion === undefined ||
                    aplazamiento.verDetalleAplazar.observacion === "") {
                appConstant.MSG_GROWL_ADVERTENCIA('Debe Registrar Observación');
                return;
            }
            aplazarModulo();
        };

        function onCargarMallas(id) {
            mallaService.getMallaByIdPrograma(id).then(function (data) {
                aplazamiento.listaMallaAcademicas = {};
                aplazamiento.listaMallaAcademicas = data;
            }).catch(function (e) {
                return;
            });
        }


        aplazamiento.onAplazar = function (item) {
            aplazamiento.verDetalleAplazar = {};
            aplazamiento.verDetalleAplazar = item;


            $('#modalDatos').modal({backdrop: 'static', keyboard: false});
            $("#modalDatos").modal("show");
        };

        function  aplazarModulo() {
            aplazamiento.aplazar = {};
            aplazamiento.aplazar = aplazamiento.verDetalleAplazar;
            appConstant.MSG_LOADING('Aplazando Módulo');
            appConstant.CARGANDO();
            aplazamientoServices.guardarAplazamiento(aplazamiento.aplazar).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        appConstant.CERRAR_SWAL();
                        $("#modalDatos").modal("hide");
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

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }
        init();
    }
})();

