(function () {
    'use strict';
    angular.module('mytodoApp').controller('MatriculaCtrl', MatriculaCtrl);

    MatriculaCtrl.$inject = ['$scope', '$http', 'grupoMatriculaServices', 'mallaService', 'pazSalvoAcademicoService', 'asistenciaServices', 'asignarNotaServiceGnrl', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function MatriculaCtrl($scope, $http, grupoMatriculaServices, mallaService, pazSalvoAcademicoService, asistenciaServices, asignarNotaServiceGnrl, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var liquidarMatriculaControl = this;
        liquidarMatriculaControl.nuevoLiquidarMatricula = liquidarMatriculaService.liquidarMatricula;
        liquidarMatriculaControl.liquidarMatriculaAux = liquidarMatriculaService.liquidarMatriculaAuxiliar;
        liquidarMatriculaControl.listaModulosMatricula = [];
        liquidarMatriculaControl.listaDescuentosEstudiante = [];
        liquidarMatriculaControl.reporteJsonData;
        liquidarMatriculaControl.descuento = {};
        liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
        liquidarMatriculaControl.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
        liquidarMatriculaControl.report = { selectedModulo: null };
        liquidarMatriculaControl.selectTodos = false;
        liquidarMatriculaControl.listadoGrupos = [];
        function init() {
            liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo = null;
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaModulosMatricula = [];
            liquidarMatriculaControl.listadoPeriodosAux = [];
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
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        liquidarMatriculaControl.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                liquidarMatriculaControl.onConsultarEstudiante();
            }
        };

        liquidarMatriculaControl.onConsultarEstudiante = function () {
            liquidarMatriculaControl.onLimpiar();
            var codEstudiante = liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarMatriculaService.consultarEstudianteAll(codEstudiante,'GesGruMatEsp').then(function (data) {

                    if (data === "") {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA("No existe un estudiante con el código ingresado.");
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                    } else {

                        if (data.liquidacionesPendiente !== undefined && data.liquidacionesPendiente !== null && data.liquidacionesPendiente !== "") {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                            return;
                        }

                        if (data.estadoMatriculaActual !== "" && data.estadoMatriculaActual !== undefined && data.estadoMatriculaActual !== null) {
                            var json = JSON.parse(data.estadoMatriculaActual)
                            if (json.estadoLiquidacion !== "PAGADA") {
                                appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                                return;
                            }
                        } else {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                            return;
                        }

                        liquidarMatriculaControl.nuevoLiquidarMatricula.id = data.id;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.nombre = data.nombre;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.apellido = data.apellido;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto = data.nombre + " " + data.apellido;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.documentoCompleto = data.tipoDocumento + " " + data.identificacion;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.tipoDocumento = data.tipoDocumento;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion = data.identificacion;
                        angular.forEach(data.estudiantePrograma, function (value, key) {
                            liquidarMatriculaControl.listaProgramas.push(value)
                        });
                        appConstant.CERRAR_SWAL();
                    }

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };
        liquidarMatriculaControl.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected !== null) {

                    if (liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "TECNICO LABORAL" ||
                    liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "EDUCACIÓN CONTINUADA") {
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = liquidarMatriculaControl.listaProgramas.indexOf(liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected);
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma = liquidarMatriculaControl.listaProgramas[index].idPrograma;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante = liquidarMatriculaControl.listaProgramas[index].idEstudiante;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.nivelFormacion = liquidarMatriculaControl.listaProgramas[index].nivelFormacion;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.programaNombre = liquidarMatriculaControl.listaProgramas[index].programa;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.modalidad = liquidarMatriculaControl.listaProgramas[index].modalidad;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.horario = liquidarMatriculaControl.listaProgramas[index].horario;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.semestre = liquidarMatriculaControl.listaProgramas[index].semestre;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo = liquidarMatriculaControl.listaProgramas[index].idPeriodo;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.periodoActual = liquidarMatriculaControl.listaProgramas[index].periodoActual;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idModalidad = liquidarMatriculaControl.listaProgramas[index].idModalidad;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idHorario = liquidarMatriculaControl.listaProgramas[index].idHorario2;

                        liquidarMatriculaControl.listadoPeriodos = [];

                        angular.forEach(liquidarMatriculaControl.listadoPeriodosAux, function (value, key) {
                            if (value.id >= liquidarMatriculaControl.listaProgramas[index].idPeriodoAdmitido) {
                                liquidarMatriculaControl.listadoPeriodos.push(value);
                            }
                        });

                        liquidarMatriculaControl.onConsultarNotas();
                        onCargarMallas(liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma);
                        asignarNotaServiceGnrl.buscarModuloByIdPrograma(liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.idPrograma).then(function (data) {
                            liquidarMatriculaControl.listadoModulos = [];
                            liquidarMatriculaControl.listadoModulos = data;
                            liquidarMatriculaControl.idModulo = null;
                            liquidarMatriculaControl.idGrupo = null;
                            liquidarMatriculaControl.listadoGrupos = [];
                        }).catch(function (e) {
                            appConstant.MSG_GROWL_ERROR();
                            return;
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no pertenece a nivel formación tecnico laboral");
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                    }

                } else {
                    liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            }

            liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected = null;

        };

        liquidarMatriculaControl.onBuscarGruposByModulo = function () {
            if (liquidarMatriculaControl.idModulo === null || liquidarMatriculaControl.idModulo === undefined) {
                liquidarMatriculaControl.listadoGrupos = [];
                return;
            }

            if (liquidarMatriculaControl.idPeriodo === null || liquidarMatriculaControl.idPeriodo === undefined) {
                liquidarMatriculaControl.listadoGrupos = [];
                return;
            }

            if (liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma === null || liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma === undefined) {
                liquidarMatriculaControl.listadoGrupos = [];
                return;
            }

            asignarNotaServiceGnrl.buscarGruposModuloPeriodoPrograma(liquidarMatriculaControl.idModulo.id, liquidarMatriculaControl.idPeriodo.id, liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                liquidarMatriculaControl.listadoGrupos = [];
                liquidarMatriculaControl.listadoGrupos = data;

                liquidarMatriculaControl.listadoEstudiantes = [];
                if (liquidarMatriculaControl.listadoGrupos.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron grupos bajo los criterios de busqueda.');
                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        liquidarMatriculaControl.onConsultarNotas = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo !== null && liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarNotas(liquidarMatriculaControl.idPeriodo.id,
                    liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo,
                    liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                        appConstant.CERRAR_SWAL();
                        liquidarMatriculaControl.listaNotas = data;
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        return;
                    });
            } else {
                liquidarMatriculaControl.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        function buscarPeriodos() {
            liquidarMatriculaControl.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico,
                        idEstadoPeriodo: value.idEstadoPeriodo
                    };
                    liquidarMatriculaControl.listadoPeriodosAux.push(periodo);
                });
                liquidarMatriculaControl.idPeriodo = liquidarMatriculaControl.listadoPeriodosAux[0];
            });
        }

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            liquidarMatriculaControl.usuario = usuario;
        }

        liquidarMatriculaControl.onGuardar = function () {
            if (liquidarMatriculaControl.idGrupo === null || liquidarMatriculaControl.idGrupo === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA('Debe Seleccionar un Grupo a Matricular');
                return;
            }
            agregargrupoMatricula();
        };

        function onCargarMallas(id) {
            mallaService.getMallaByIdPrograma(id).then(function (data) {
                liquidarMatriculaControl.listaMallaAcademicas = {};
                liquidarMatriculaControl.listaMallaAcademicas = data;
            }).catch(function (e) {
                return;
            });
        }
        function agregargrupoMatricula() {
            appConstant.MSG_LOADING('Registrando datos, espere un momento');
            appConstant.CARGANDO();
            liquidarMatriculaControl.estudiantesSeleccionados = [];

            if (liquidarMatriculaControl.idPeriodo.idEstadoPeriodo !== 11) {
                appConstant.MSG_LOADING("Período a Matrícula no Permitido");
                return;
            }

            var datosMatricula = {
                idGrupoMatricula: null,
                idMatricula: null,
                nombreCompleto: liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto,
                identificacionEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.identificacionEstudiante,
                nombrePrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.programaNombre,
                idPrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma,
                idModulo: liquidarMatriculaControl.idModulo.id,
                idHorario: liquidarMatriculaControl.nuevoLiquidarMatricula.idHorario,
                idMalla: liquidarMatriculaControl.listaMallaAcademicas[0].idMalla,
                idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante,
                idPeriodoAcademico: liquidarMatriculaControl.idPeriodo.id,
                idNivel: liquidarMatriculaControl.nuevoLiquidarMatricula.semestre,
                estadoMatricula: 'MATRICULADO',
                nombreModulo: liquidarMatriculaControl.idModulo.nombre,
                estadoDetalleLiquidacion: null,
            };

            liquidarMatriculaControl.estudiantesSeleccionados.push(datosMatricula);
            var grupoMatricula = {
                id: null,
                idGrupo: liquidarMatriculaControl.idGrupo,
                listaEstudiantes: liquidarMatriculaControl.estudiantesSeleccionados,
                estado: 'ACTIVO',
                idUsuario: localStorageService.get('usuario').id

            };
            grupoMatriculaServices.registrarGrupoMatriculaEstudiante(grupoMatricula).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        liquidarMatriculaControl.onConsultarNotas();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
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