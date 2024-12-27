(function () {
    'use strict';
    angular.module('mytodoApp').controller('MatriculaEstudinteCtrl', MatriculaEstudinteCtrl);

    MatriculaEstudinteCtrl.$inject = ['$scope', '$http', 'grupoMatriculaServices', 'mallaService', 'pazSalvoAcademicoService', 'asistenciaServices', 'asignarNotaServiceGnrl', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function MatriculaEstudinteCtrl($scope, $http, grupoMatriculaServices, mallaService, pazSalvoAcademicoService, asistenciaServices, asignarNotaServiceGnrl, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

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
            liquidarMatriculaControl.onConsultarEstudiante();
            buscarPeriodos();
        }

        liquidarMatriculaControl.onLimpiar = function () {
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaProgramas = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
        };

        liquidarMatriculaControl.onConsultarEstudiante = function () {
            liquidarMatriculaControl.onLimpiar();
            var codEstudiante = liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo;
            appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
            appConstant.CARGANDO();
            liquidarMatriculaService.consultarEstudiante(codEstudiante).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        if (false) {
                        } else {
                            liquidarMatriculaControl.nuevoLiquidarMatricula.id = data.objectResponse.id;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.nombre = data.objectResponse.nombre;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.apellido = data.objectResponse.apellido;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.tipoDocumento = data.objectResponse.tipoDocumento;
                            liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion = data.objectResponse.identificacion;
                            angular.forEach(data.objectResponse.estudiantePrograma, function (value, key) {
                                liquidarMatriculaControl.listaProgramas.push(value)
                            });
                            appConstant.CERRAR_SWAL();
                        }
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                        break;

                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
        liquidarMatriculaControl.onCambiarPrograma = function () {
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
                    liquidarMatriculaControl.nuevoLiquidarMatricula.cantidadModulosMatricular = liquidarMatriculaControl.listaProgramas[index].cantidadModulosMatricular;

                    liquidarMatriculaControl.onConsultarNotas();
                  //  liquidarMatriculaControl.onBuscarGruposByModulo();
                    onCargarMallas(liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma);
                    
                    
                    liquidarMatriculaControl.idEstudiante = {};
                    grupoMatriculaServices.obtenerIdEstudianteByIdPrograma(liquidarMatriculaControl.usuario.identificacion,
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.idPrograma).then(function (data) {
                            liquidarMatriculaControl.idEstudiante = data.idEstudiante;
                    });
                     
                    asignarNotaServiceGnrl.buscarModuloByIdProgramaEstudiante(liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.idPrograma,
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante).then(function (data) {
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

            liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected = null;

        };

        liquidarMatriculaControl.onBuscarGruposByModulo = function (CodModulo) {
            asignarNotaServiceGnrl.buscarGrupoByIdModuloIdEstudiante(CodModulo.id, liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante).then(function (data) {
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
                pazSalvoAcademicoService.consultarNotas(liquidarMatriculaControl.idPeriodo.id, liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo, liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma).then(function (data) {
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
                    liquidarMatriculaControl.listadoPeriodos.push(periodo);

                    if (periodo.idEstadoPeriodo === 11) {
                        liquidarMatriculaControl.idPeriodo = periodo;
                        liquidarMatriculaControl.idPeriodoTemp = periodo;
                    }

                });
                liquidarMatriculaControl.idPeriodo = liquidarMatriculaControl.listadoPeriodos[0];
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
        function  agregargrupoMatricula() {

            if (liquidarMatriculaControl.idPeriodo.idEstadoPeriodo !== 11) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe seleccionar período " + liquidarMatriculaControl.idPeriodoTemp.nombre);
                return;
            }

            liquidarMatriculaControl.estudiantesSeleccionados = [];
            var datosMatricula = {
                idGrupoMatricula: null,
                idMatricula: null,
                nombreCompleto: liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto,
                identificacionEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.identificacionEstudiante,
                nombrePrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.programaNombre,
                idPrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma,
                idModulo: liquidarMatriculaControl.idGrupo.idModulo,
                idHorario: liquidarMatriculaControl.idGrupo.idHorario,
                idMalla: liquidarMatriculaControl.listaMallaAcademicas[0].idMalla,
                idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante,
                idPeriodoAcademico: liquidarMatriculaControl.idPeriodo.id,
                idNivel: liquidarMatriculaControl.nuevoLiquidarMatricula.semestre,
                estadoMatricula: 'MATRICULADO',
                nombreModulo: liquidarMatriculaControl.idGrupo.nombreModulo,
                estadoDetalleLiquidacion: null
            };

            liquidarMatriculaControl.estudiantesSeleccionados.push(datosMatricula);
            var grupoMatricula = {
                id: null,
                idGrupo: liquidarMatriculaControl.idGrupo.id,
                listaEstudiantes: liquidarMatriculaControl.estudiantesSeleccionados,
                estado: 'ACTIVO',
                idUsuario: localStorageService.get('usuario').id

            };
            grupoMatriculaServices.registrarGrupoMatriculaEstudiante(grupoMatricula).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        liquidarMatriculaControl.onConsultarNotas();
                       // liquidarMatriculaControl.onBuscarGruposByModulo();
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