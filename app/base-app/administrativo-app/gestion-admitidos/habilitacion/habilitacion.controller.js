(function () {
    'use strict';
    angular.module('mytodoApp').controller('habilitarCtrl', habilitarCtrl);
    habilitarCtrl.$inject = ['$scope', '$http', 'habilitacionService', 'mallaService', 'pazSalvoAcademicoService', 'asistenciaServices', 'asignarNotaServiceGnrl', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function habilitarCtrl($scope, $http, habilitacionService, mallaService, pazSalvoAcademicoService, asistenciaServices, asignarNotaServiceGnrl, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var habilitar = this;

        habilitar.nuevoLiquidarMatricula = liquidarMatriculaService.liquidarMatricula;
        habilitar.liquidarMatriculaAux = liquidarMatriculaService.liquidarMatriculaAuxiliar;
        habilitar.listaModulosMatricula = [];
        habilitar.listaDescuentosEstudiante = [];
        habilitar.reporteJsonData;
        habilitar.descuento = {};
        habilitar.nuevoLiquidarMatricula.valorDescontado = 0;
        habilitar.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
        habilitar.report = {selectedModulo: null};
        habilitar.selectTodos = false;
        habilitar.listadoGrupos = [];
        function init() {
            habilitar.nuevoLiquidarMatricula.codigoEstudianteCampo = null;
            habilitar.liquidarMatriculaAux.onDeshabilitar = false;
            habilitar.listaModulosMatricula = [];
            habilitar.nuevoLiquidarMatricula.total = 0;
            habilitar.report.selectedModulo = null;
            habilitar.reporteJsonData;
            habilitar.descuento = {};
            habilitar.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
            habilitar.selectTodos = false;
            buscarPeriodos();
        }

        habilitar.onLimpiar = function () {
            habilitar.liquidarMatriculaAux.onDeshabilitar = false;
            habilitar.listaProgramas = [];
            habilitar.nuevoLiquidarMatricula.listaModulos = [];
            habilitar.nuevoLiquidarMatricula.total = 0;
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        habilitar.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                habilitar.onConsultarEstudiante();
            }
        };

        habilitar.onConsultarEstudiante = function () {
            habilitar.onLimpiar();
            var codEstudiante = habilitar.nuevoLiquidarMatricula.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarMatriculaService.consultarEstudiante(codEstudiante).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            if (false) {
                            } else {
                                habilitar.nuevoLiquidarMatricula.id = data.objectResponse.id;
                                habilitar.nuevoLiquidarMatricula.nombre = data.objectResponse.nombre;
                                habilitar.nuevoLiquidarMatricula.apellido = data.objectResponse.apellido;
                                habilitar.nuevoLiquidarMatricula.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                habilitar.nuevoLiquidarMatricula.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                habilitar.nuevoLiquidarMatricula.tipoDocumento = data.objectResponse.tipoDocumento;
                                habilitar.nuevoLiquidarMatricula.identificacion = data.objectResponse.identificacion;
                                angular.forEach(data.objectResponse.estudiantePrograma, function (value, key) {
                                    habilitar.listaProgramas.push(value)
                                });
                                appConstant.CERRAR_SWAL();
                            }
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            habilitar.liquidarMatriculaAux.onDeshabilitar = false;
                            break;
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };
        habilitar.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (habilitar.nuevoLiquidarMatricula.idProgramaSelected !== null) {

                    if (habilitar.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "TECNICO LABORAL" || 
                        habilitar.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "EDUCACIÓN CONTINUADA") {
                        habilitar.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = habilitar.listaProgramas.indexOf(habilitar.nuevoLiquidarMatricula.idProgramaSelected);
                        habilitar.nuevoLiquidarMatricula.idPrograma = habilitar.listaProgramas[index].idPrograma;
                        habilitar.nuevoLiquidarMatricula.idEstudiante = habilitar.listaProgramas[index].idEstudiante;
                        habilitar.nuevoLiquidarMatricula.nivelFormacion = habilitar.listaProgramas[index].nivelFormacion;
                        habilitar.nuevoLiquidarMatricula.programaNombre = habilitar.listaProgramas[index].programa;
                        habilitar.nuevoLiquidarMatricula.modalidad = habilitar.listaProgramas[index].modalidad;
                        habilitar.nuevoLiquidarMatricula.horario = habilitar.listaProgramas[index].horario;
                        habilitar.nuevoLiquidarMatricula.semestre = habilitar.listaProgramas[index].semestre;
                        habilitar.nuevoLiquidarMatricula.idPeriodo = habilitar.listaProgramas[index].idPeriodo;
                        habilitar.nuevoLiquidarMatricula.periodoActual = habilitar.listaProgramas[index].periodoActual;
                        habilitar.nuevoLiquidarMatricula.idModalidad = habilitar.listaProgramas[index].idModalidad;
                        habilitar.nuevoLiquidarMatricula.idHorario = habilitar.listaProgramas[index].idHorario2;

                        habilitar.onConsultarNotas();
                        onCargarMallas(habilitar.nuevoLiquidarMatricula.idPrograma);
                        asignarNotaServiceGnrl.buscarModuloByIdPrograma(habilitar.nuevoLiquidarMatricula.idProgramaSelected.idPrograma).then(function (data) {
                            habilitar.listadoModulos = [];
                            habilitar.listadoModulos = data;
                            habilitar.idModulo = null;
                            habilitar.idGrupo = null;
                            habilitar.listadoGrupos = [];
                        }).catch(function (e) {
                            appConstant.MSG_GROWL_ERROR();
                            return;
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no pertenece a nivel formación tecnico laboral");
                        habilitar.liquidarMatriculaAux.onDeshabilitar = false;
                    }
                } else {
                    habilitar.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                habilitar.liquidarMatriculaAux.onDeshabilitar = false;
            }

            habilitar.nuevoLiquidarMatricula.idProgramaSelected = null;

        };

        habilitar.onBuscarGruposByModulo = function () {
            if (habilitar.idModulo === null || habilitar.idModulo === undefined) {
                habilitar.listadoGrupos = [];
                return;
            }

            if (habilitar.idPeriodo === null || habilitar.idPeriodo === undefined) {
                habilitar.listadoGrupos = [];
                return;
            }

            if (habilitar.nuevoLiquidarMatricula.idPrograma === null || habilitar.nuevoLiquidarMatricula.idPrograma === undefined) {
                habilitar.listadoGrupos = [];
                return;
            }

            asignarNotaServiceGnrl.buscarGruposModuloPeriodoPrograma(habilitar.idModulo.id, habilitar.idPeriodo.id, habilitar.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                habilitar.listadoGrupos = [];
                habilitar.listadoGrupos = data;

                habilitar.listadoEstudiantes = [];
                if (habilitar.listadoGrupos.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron grupos bajo los criterios de busqueda.');
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        habilitar.onConsultarNotas = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (habilitar.nuevoLiquidarMatricula.codigoEstudianteCampo !== null && habilitar.nuevoLiquidarMatricula.codigoEstudianteCampo !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarNotas(habilitar.idPeriodo.id, habilitar.nuevoLiquidarMatricula.codigoEstudianteCampo, habilitar.nuevoLiquidarMatricula.idPrograma).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    habilitar.listaNotas = data;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                habilitar.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        function buscarPeriodos() {
            habilitar.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    habilitar.listadoPeriodos.push(periodo);
                });
                habilitar.idPeriodo = habilitar.listadoPeriodos[0];
            });
        }

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            habilitar.usuario = usuario;
        }

        habilitar.onGuardar = function () {
            if (habilitar.verDetalleAplazar.notaHabilitacion === null || habilitar.verDetalleAplazar.notaHabilitacion === undefined ||
                    habilitar.verDetalleAplazar.notaHabilitacion === "") {
                appConstant.MSG_GROWL_ADVERTENCIA('Debe Registrar Nota');
                return;
            }
            habilitar.onIrRegistrar();
        };

        function onCargarMallas(id) {
            mallaService.getMallaByIdPrograma(id).then(function (data) {
                habilitar.listaMallaAcademicas = {};
                habilitar.listaMallaAcademicas = data;
            }).catch(function (e) {
                return;
            });
        }
        init();

        habilitar.onHabilitacion = function (item) {
            habilitar.verDetalleAplazar = {};
            habilitar.verDetalleAplazar = item;

            $('#modalDatos').modal({backdrop: 'static', keyboard: false});
            $("#modalDatos").modal("show");
        };

        habilitar.onIrRegistrar = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            habilitar.verDetalleAplazar.usuarioRegistra = localStorageService.get("usuario").username;
            habilitacionService.guardarHabilitacionEstudiante(habilitar.verDetalleAplazar).then(function (data) {
                if (data.tipo === 200) {
                    habilitar.listaDetalleMalla = [];
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK('Se ha registrado la nota exitosamente');
                    $("#modalDatos").modal("hide");
                    habilitar.verDetalleAplazar = {};
                    habilitar.onConsultarNotas();
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };
    }
})();

