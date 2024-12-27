'use strict';
angular.module('mytodoApp').controller('auditoriaEstudianteCtrl', ['localStorageService', 'ValidationService', 'liquidarMatriculaService', 'asistenciaServices', 'pazSalvoAcademicoService', 'appConstant', 'appGenericConstant', '$scope',
    function (localStorageService, ValidationService, liquidarMatriculaService, asistenciaServices, pazSalvoAcademicoService, appConstant, appGenericConstant, $scope) {
        var reportes = this;
        reportes.listInicioSesion = [];
        if (localStorageService.get("usuario") !== null) {
            reportes.user = localStorageService.get("usuario");
        }
        reportes.estudiante = {};
        reportes.listadoGrupos = [];
        function init() {
            reportes.estudiante.codigoEstudianteCampo = null;
            reportes.liquidarMatriculaAux.onDeshabilitar = false;
            reportes.listaModulosMatricula = [];
            reportes.listadoPeriodosAux = [];
            reportes.estudiante.total = 0;
            reportes.report.selectedModulo = null;
            reportes.reporteJsonData;
            reportes.descuento = {};
            reportes.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
            reportes.selectTodos = false;
            buscarPeriodos();
        }

        reportes.onLimpiar = function () {
            reportes.estudiante.onDeshabilitar = false;
            reportes.listaProgramas = [];
            reportes.estudiante.listaModulos = [];
            reportes.estudiante.total = 0;
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        reportes.onConsultarEstudiante = function () {
            reportes.onLimpiar();
            var codEstudiante = reportes.estudiante.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarMatriculaService.consultarEstudianteAll(codEstudiante, 'HistEst').then(function (data) {

                    if (data === "") {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA("No existe un estudiante con el código ingresado.");
                        reportes.liquidarMatriculaAux.onDeshabilitar = false;
                    } else {

                        if (data.liquidacionesPendiente !== undefined && data.liquidacionesPendiente !== null && data.liquidacionesPendiente !== "") {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                            return;
                        }

                        reportes.estudiante.id = data.id;
                        reportes.estudiante.nombre = data.nombre;
                        reportes.estudiante.apellido = data.apellido;
                        reportes.estudiante.nombresCompleto = data.nombre + " " + data.apellido;
                        reportes.estudiante.documentoCompleto = data.tipoDocumento + " " + data.identificacion;
                        reportes.estudiante.tipoDocumento = data.tipoDocumento;
                        reportes.estudiante.identificacion = data.identificacion;
                        angular.forEach(data.estudiantePrograma, function (value, key) {
                            reportes.listaProgramas.push(value)
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

        reportes.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (reportes.estudiante.idProgramaSelected !== null) {

                    if (reportes.estudiante.idProgramaSelected.nivelFormacion === "TECNICO LABORAL" || 
                    reportes.estudiante.idProgramaSelected.nivelFormacion === "EDUCACIÓN CONTINUADA") {
                        reportes.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = reportes.listaProgramas.indexOf(reportes.estudiante.idProgramaSelected);
                        reportes.estudiante.idPrograma = reportes.listaProgramas[index].idPrograma;
                        reportes.estudiante.idEstudiante = reportes.listaProgramas[index].idEstudiante;
                        reportes.estudiante.nivelFormacion = reportes.listaProgramas[index].nivelFormacion;
                        reportes.estudiante.programaNombre = reportes.listaProgramas[index].programa;
                        reportes.estudiante.modalidad = reportes.listaProgramas[index].modalidad;
                        reportes.estudiante.horario = reportes.listaProgramas[index].horario;
                        reportes.estudiante.semestre = reportes.listaProgramas[index].semestre;
                        reportes.estudiante.idPeriodo = reportes.listaProgramas[index].idPeriodo;
                        reportes.estudiante.periodoActual = reportes.listaProgramas[index].periodoActual;
                        reportes.estudiante.idModalidad = reportes.listaProgramas[index].idModalidad;
                        reportes.estudiante.idHorario = reportes.listaProgramas[index].idHorario2;

                        reportes.listadoPeriodos = [];
                        angular.forEach(reportes.listadoPeriodosAux, function (value, key) {
                            if (value.id >= reportes.listaProgramas[index].idPeriodoAdmitido) {
                                reportes.listadoPeriodos.push(value);
                            }
                        });

                        reportes.onConsultarNotas();
                        // onCargarMallas(reportes.estudiante.idPrograma);
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no pertenece a nivel formación tecnico laboral");
                        reportes.liquidarMatriculaAux.onDeshabilitar = false;
                    }

                } else {
                    reportes.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                reportes.liquidarMatriculaAux.onDeshabilitar = false;
            }

            reportes.estudiante.idProgramaSelected = null;

        };

        reportes.onConsultarNotas = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (reportes.estudiante.codigoEstudianteCampo !== null && reportes.estudiante.codigoEstudianteCampo !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarNotas(reportes.idPeriodo.id,
                    reportes.estudiante.codigoEstudianteCampo,
                    reportes.estudiante.idPrograma).then(function (data) {
                        appConstant.CERRAR_SWAL();
                        reportes.listaNotas = data;
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        return;
                    });
            } else {
                reportes.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        function buscarPeriodos() {
            reportes.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico,
                        idEstadoPeriodo: value.idEstadoPeriodo
                    };
                    reportes.listadoPeriodosAux.push(periodo);
                });
                reportes.idPeriodo = reportes.listadoPeriodosAux[0];
            });
        }

        reportes.onClickToView = function (data) {
            reportes.detalle = {};
            reportes.detalle.funcionario = data.funcionario
            reportes.listHistorico = data.lista;
            $('#modalDatos').modal({ backdrop: 'static', keyboard: false });
            $("#modalDatos").modal("show");
        };

        reportes.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                reportes.onConsultarEstudiante();
            }
        };

        reportes.ChangeTabs = function (idTab) {
            $("#tab-example-1").css("display", idTab === 1 ? 'initial' : 'none');
            $("#tab-example-2").css("display", idTab === 2 ? 'initial' : 'none');
            $("#tab-example-3").css("display", idTab === 3 ? 'initial' : 'none');
            $("#tab-example-4").css("display", idTab === 4 ? 'initial' : 'none');
            $("#tab-example-5").css("display", idTab === 5 ? 'initial' : 'none');
            $("#tab-example-6").css("display", idTab === 6 ? 'initial' : 'none');
            $("#tab-example-7").css("display", idTab === 7 ? 'initial' : 'none');

            $("#tab-1").css("background-color", idTab === 1 ? '#009fc1' : 'white');
            $("#tab-2").css("background-color", idTab === 2 ? '#009fc1' : 'white');
            $("#tab-3").css("background-color", idTab === 3 ? '#009fc1' : 'white');
            $("#tab-4").css("background-color", idTab === 4 ? '#009fc1' : 'white');
            $("#tab-5").css("background-color", idTab === 5 ? '#009fc1' : 'white');
            $("#tab-6").css("background-color", idTab === 6 ? '#009fc1' : 'white');
            $("#tab-7").css("background-color", idTab === 7 ? '#009fc1' : 'white');
        };

    }]);


