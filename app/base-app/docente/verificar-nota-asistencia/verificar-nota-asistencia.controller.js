(function () {
    'use strict';
    angular.module('mytodoApp').controller('VerificarCtrl', VerificarCtrl);
    VerificarCtrl.$inject = ['$scope', 'asignarNotaDocenteService', 'hojaVidaService', 'growl', 'asistenciaDiariaService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function VerificarCtrl($scope, asignarNotaDocenteService, hojaVidaService, growl, asistenciaDiariaService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var VerificarCtrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        VerificarCtrl.display;
        VerificarCtrl.selectTodos = false;
        VerificarCtrl.filtrados = [];
        VerificarCtrl.estados = [];
        VerificarCtrl.listadoModulos = [];
        VerificarCtrl.listadoGrupos = [];
        VerificarCtrl.listadoEstudianteArchivo = [];
        VerificarCtrl.options = appConstant.FILTRO_TABLAS;
        VerificarCtrl.selectedOption = VerificarCtrl.options[0];
        VerificarCtrl.configuracionNota = {};
        VerificarCtrl.idNotaMasiva = null;
        VerificarCtrl.valorNotaMasiva = null;
        VerificarCtrl.tipoArchivoValido = true;
        VerificarCtrl.listaNotas = [
            {
                id: 1,
                nombreNota: 'Nota 1'
            },
            {
                id: 2,
                nombreNota: 'Nota 2'
            },
            {
                id: 3,
                nombreNota: 'Nota 3'
            }
        ];
        VerificarCtrl.listadoEstudiantes = [];
        VerificarCtrl.listadoVerificar = [];

        VerificarCtrl.onChangeValorNota = function () {
            VerificarCtrl.valorNotaMasiva = 0;
        };

        VerificarCtrl.identiocente = "";

        VerificarCtrl.buscarModulo = function () {

            asignarNotaDocenteService.buscarModuloByDocente(VerificarCtrl.identiocente).then(function (data) {
                VerificarCtrl.listadoModulos = [];
                VerificarCtrl.listadoModulos = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });

            asignarNotaDocenteService.getVerificarModuloByDocente(VerificarCtrl.identiocente).then(function (data) {
                VerificarCtrl.listadoVerificar = [];
                VerificarCtrl.listadoVerificar = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        VerificarCtrl.onBuscarGruposByModulo = function () {
            if (VerificarCtrl.modulo === null || VerificarCtrl.modulo === undefined) {
                VerificarCtrl.listadoGrupos = [];
                return;
            }

            asignarNotaDocenteService.buscarGruposModulo(VerificarCtrl.modulo.idModulo, VerificarCtrl.identiocente, VerificarCtrl.modulo.idPeriodo, VerificarCtrl.modulo.idHorario).then(function (data) {
                VerificarCtrl.listadoGrupos = [];
                VerificarCtrl.listadoGrupos = data;
                VerificarCtrl.listadoEstudiantes = [];

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        VerificarCtrl.onConsultarEstudiantes = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            if (VerificarCtrl.idGrupo === null || VerificarCtrl.idGrupo === undefined || VerificarCtrl.idGrupo === "") {
                appConstant.CERRAR_SWAL();
                return;
            }

            VerificarCtrl.listadoEstudiantes = [];
            asignarNotaDocenteService.buscarEstudiantesByGrupo(VerificarCtrl.idGrupo).then(function (data) {
                VerificarCtrl.listadoEstudiantes = data;
                VerificarCtrl.listadoExportar = [];
                angular.forEach(data, function (value, key) {

                    var result = $.grep(data, function (n, i) {
                        return n.id === VerificarCtrl.idGrupo;
                    });

                    var idPrograma = 10;

                    var array = value.estudiante.split(" ");
                    var dto = {
                        identificacion: array[0],
                        nombre: array[1] + " " + array[2] + " " + array[3],
                        nota1: value.nota1,
                        nota2: value.nota2,
                        nota3: value.nota3
                    };

                    if (idPrograma !== value.idPrograma) {
                        dto.classNota1 = value.nota1 < 3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3 ? 0 : 1;
                        dto.classNotaH = value.notaHabilitacion < 3 ? 0 : 1;
                    } else {
                        dto.classNota1 = value.nota1 < 3.3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3.3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3.3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3.3 ? 0 : 1;
                        dto.classNotaH = value.notaDefinitiva < 3.3 ? 0 : 1;
                    }
                    VerificarCtrl.listadoExportar.push(dto);
                });

                //                for (var j = 0; j < VerificarCtrl.listadoEstudiantes.length; j++) {
                //                    VerificarCtrl.listadoEstudiantes[j].estudiante.codigo === VerificarCtrl.listadoEstudianteArchivo[i][7]
                //                    VerificarCtrl.listadoEstudiantes[j].nota1 = parseFloat(VerificarCtrl.listadoEstudianteArchivo[i][9]);
                //                    VerificarCtrl.listadoEstudiantes[j].nota2 = parseFloat(VerificarCtrl.listadoEstudianteArchivo[i][10]);
                //                    VerificarCtrl.listadoEstudiantes[j].nota3 = parseFloat(VerificarCtrl.listadoEstudianteArchivo[i][11]);
                //                }

                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
            });


            VerificarCtrl.cantidadDias = [];
            for (var j = 1; j <= VerificarCtrl.idGrupo.diasAsistencia; j++) {
                var dto = {
                    id: j,
                    cantidadDias: 'Asistencia ' + j
                };
                VerificarCtrl.cantidadDias.push(dto);
            }

            VerificarCtrl.listadoEstudiantesAsistencia = [];
            asistenciaDiariaService.buscarEstudiantesByGrupo(VerificarCtrl.idGrupo).then(function (data) {
                VerificarCtrl.listadoEstudiantesAsistencia = data;
                angular.forEach(VerificarCtrl.listadoEstudiantesAsistencia, function (value, key) {
                    value.asistenciasNew = [];
                    if (value.asistencias === "" || value.asistencias === null || value.asistencias === undefined) {

                    } else {
                        var contador = 1;
                        var listaAsistenciaNueva = [];
                        angular.forEach(value.asistencias, function (valueDias, key) {
                            if (contador <= parseInt(VerificarCtrl.idGrupo.diasAsistencia)) {
                                valueDias.asitencia === "SI" ? 'SI' : 'NO';
                                valueDias.asistencia = valueDias.asitencia;
                                value.asistenciasNew.push(valueDias);
                            }
                            contador++;
                        });
                    }
                });
            });
            appConstant.CERRAR_SWAL();
        };

        VerificarCtrl.onMostrarModal = function (item) {
            $('#' + item).modal({ backdrop: 'static', keyboard: false });
            $("#" + item).modal("show");
        };

        VerificarCtrl.onOcultarModal = function (item) {
            $("#" + item).hide();
        };

        function onConsultarEstudiantes(grupo) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            VerificarCtrl.listadoEstudiantes = [];
            asignarNotaDocenteService.buscarEstudiantesByGrupo(grupo.idGrupo).then(function (data) {
                VerificarCtrl.listadoEstudiantes = data;
                VerificarCtrl.listadoExportar = [];
                angular.forEach(data, function (value, key) {

                    var result = $.grep(data, function (n, i) {
                        return n.id === idGrupo;
                    });

                    var idPrograma = 10;

                    var array = value.estudiante.split(" ");
                    var dto = {
                        identificacion: array[0],
                        nombre: array[1] + " " + array[2] + " " + array[3],
                        nota1: value.nota1,
                        nota2: value.nota2,
                        nota3: value.nota3
                    };

                    if (idPrograma !== value.idPrograma) {
                        dto.classNota1 = value.nota1 < 3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3 ? 0 : 1;
                        dto.classNotaH = value.notaHabilitacion < 3 ? 0 : 1;
                    } else {
                        dto.classNota1 = value.nota1 < 3.3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3.3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3.3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3.3 ? 0 : 1;
                        dto.classNotaH = value.notaDefinitiva < 3.3 ? 0 : 1;
                    }
                    VerificarCtrl.listadoExportar.push(dto);
                });

                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
            });

            VerificarCtrl.cantidadDias = [];
            for (var j = 1; j <= VerificarCtrl.idGrupo.diasAsistencia; j++) {
                var dto = {
                    id: j,
                    cantidadDias: 'Asistencia ' + j
                };
                VerificarCtrl.cantidadDias.push(dto);
            }

            VerificarCtrl.listadoEstudiantesAsistencia = [];
            asistenciaDiariaService.buscarEstudiantesByGrupo(idGrupo).then(function (data) {
                VerificarCtrl.listadoEstudiantesAsistencia = data;
                angular.forEach(VerificarCtrl.listadoEstudiantesAsistencia, function (value, key) {
                    value.asistenciasNew = [];
                    if (value.asistencias === "" || value.asistencias === null || value.asistencias === undefined) {

                    } else {
                        var contador = 1;
                        var listaAsistenciaNueva = [];
                        angular.forEach(value.asistencias, function (valueDias, key) {
                            if (contador <= parseInt(VerificarCtrl.idGrupo.diasAsistencia)) {
                                valueDias.asitencia === "SI" ? 'SI' : 'NO';
                                valueDias.asistencia = valueDias.asitencia;
                                value.asistenciasNew.push(valueDias);
                            }
                            contador++;
                        });
                    }
                });
            });
            appConstant.CERRAR_SWAL();
        };

        VerificarCtrl.onVerDetalleGrupo = function (item) {
            onConsultarEstudiantes(item.idGrupo);
        };

        VerificarCtrl.onMostrarModalObservacion = function (value) {
            VerificarCtrl.matricula = value;
            VerificarCtrl.consultarObservacion(value.idMatricula);
            $('#modalRegistrarObservacion').modal({ backdrop: 'static', keyboard: false });
            $("#modalRegistrarObservacion").modal("show");
        };

        VerificarCtrl.consultarObservacion = function (idMatricula) {
            hojaVidaService.getListadoOnservacionByIdMatricula(idMatricula).then(function (data) {
                VerificarCtrl.listaObservaciones = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

    }
})();