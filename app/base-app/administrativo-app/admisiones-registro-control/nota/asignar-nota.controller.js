(function () {
    'use strict';
    angular.module('mytodoApp').controller('asignarNotaCtrlGnrl', asignarNotaCtrlGnrl);
    asignarNotaCtrlGnrl.$inject = ['$scope', 'asignarNotaServiceGnrl', 'asistenciaServices', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function asignarNotaCtrlGnrl($scope, asignarNotaServiceGnrl, asistenciaServices, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var asignarNotaCtrlGnrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        asignarNotaCtrlGnrl.display;
        asignarNotaCtrlGnrl.selectTodos = false;
        asignarNotaCtrlGnrl.filtrados = [];
        asignarNotaCtrlGnrl.estados = [];
        asignarNotaCtrlGnrl.listadoModulos = [];
        asignarNotaCtrlGnrl.listadoGrupos = [];
        asignarNotaCtrlGnrl.listaAuditoria = [];
        asignarNotaCtrlGnrl.listadoEstudianteArchivo = [];
        asignarNotaCtrlGnrl.options = appConstant.FILTRO_TABLAS;
        asignarNotaCtrlGnrl.selectedOption = asignarNotaCtrlGnrl.options[0];
        asignarNotaCtrlGnrl.configuracionNota = {};
        asignarNotaCtrlGnrl.idNotaMasiva = null;
        asignarNotaCtrlGnrl.valorNotaMasiva = null;
        asignarNotaCtrlGnrl.tipoArchivoValido = true;
        asignarNotaCtrlGnrl.listadoPeriodos = [];
        asignarNotaCtrlGnrl.listaNotas = [
            {id: 1,
                nombreNota: 'Nota 1'},
            {id: 2,
                nombreNota: 'Nota 2'},
            {id: 3,
                nombreNota: 'Nota 3'}
        ];

        asignarNotaCtrlGnrl.listadoEstudiantes = [];

        asignarNotaCtrlGnrl.report = {
            selected: null
        };
        asignarNotaCtrlGnrl.counter = 0;

        asignarNotaCtrlGnrl.onChangeValorNota = function () {
            asignarNotaCtrlGnrl.valorNotaMasiva = 0;
        };

        asignarNotaCtrlGnrl.onCargarConfiguracion = function () {
            asignarNotaServiceGnrl.buscarConfiguracion().then(function (data) {

                if (data.length > 0) {
                    angular.forEach(data, function (value, key) {
                        asignarNotaCtrlGnrl.configuracionNota =
                                {
                                    id: value.id,
                                    nota1: value.nota1,
                                    nota2: value.nota2,
                                    nota3: value.nota3,
                                    notaHabilitacion: value.notaHabilitacion,
                                    notaDefinitiva: value.notaDefinitiva
                                };
                    });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontró configuración de porcentajes de las notas');
                }
            });
        };

        asignarNotaCtrlGnrl.onChangePrograma = function () {
            asignarNotaServiceGnrl.buscarModuloByIdPrograma(asignarNotaCtrlGnrl.idPrograma.id).then(function (data) {
                asignarNotaCtrlGnrl.listadoModulos = [];
                asignarNotaCtrlGnrl.listadoModulos = data;
                asignarNotaCtrlGnrl.idModulo = null;
                asignarNotaCtrlGnrl.idGrupo = null;
                asignarNotaCtrlGnrl.listadoGrupos = [];
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        function buscarPeriodos() {
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    asignarNotaCtrlGnrl.listadoPeriodos.push(periodo);
                });

                asistenciaServices.getProgramasByNivelFormacion(2).then(function (data) {
                    asignarNotaCtrlGnrl.programas = [];
                    angular.forEach(data, function (value, key) {
                        var programa = {
                            id: value.id,
                            nombre: value.nombrePrograma
                        };
                        asignarNotaCtrlGnrl.programas.push(programa);
                    });
                    appConstant.CERRAR_SWAL();
                    if (asignarNotaCtrlGnrl.programas.length === appGenericConstant.CERO) {
                        asignarNotaCtrlGnrl.visibleMensaje = appGenericConstant.NO_ENCONTRARON_PROGRAMA;
                    } else {

                    }
                });
            });
        }
        asignarNotaCtrlGnrl.onBuscarGruposByModulo = function () {
            if (asignarNotaCtrlGnrl.idModulo === null || asignarNotaCtrlGnrl.idModulo === undefined) {
                asignarNotaCtrlGnrl.listadoGrupos = [];
                return;
            }

            if (asignarNotaCtrlGnrl.idPeriodo === null || asignarNotaCtrlGnrl.idPeriodo === undefined) {
                asignarNotaCtrlGnrl.listadoGrupos = [];
                return;
            }

            if (asignarNotaCtrlGnrl.idPrograma === null || asignarNotaCtrlGnrl.idPrograma === undefined) {
                asignarNotaCtrlGnrl.listadoGrupos = [];
                return;
            }

            asignarNotaServiceGnrl.buscarGruposModuloPeriodoPrograma(asignarNotaCtrlGnrl.idModulo, asignarNotaCtrlGnrl.idPeriodo.id, asignarNotaCtrlGnrl.idPrograma.id).then(function (data) {
                asignarNotaCtrlGnrl.listadoGrupos = [];
                asignarNotaCtrlGnrl.listadoGrupos = data;
                asignarNotaCtrlGnrl.listadoEstudiantes = [];
                if (asignarNotaCtrlGnrl.listadoGrupos.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron grupos bajo los criterios de busqueda.');
                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        asignarNotaCtrlGnrl.onConsultarEstudiantes = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaCtrlGnrl.listadoEstudiantes = [];
            asignarNotaServiceGnrl.buscarEstudiantesByGrupo(asignarNotaCtrlGnrl.idGrupo).then(function (data) {
                asignarNotaCtrlGnrl.listadoEstudiantes = data;

//                for (var j = 0; j < asignarNotaCtrlGnrl.listadoEstudiantes.length; j++) {
//                    asignarNotaCtrlGnrl.listadoEstudiantes[j].estudiante.codigo === asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][8]
//                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota1 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][10]);
//                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota2 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][11]);
//                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota3 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][12]);
//                }


                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
                appConstant.CERRAR_SWAL();
            });
            $("div").removeClass("div.swal2-overlay");
        };

        asignarNotaCtrlGnrl.onNotaMasivo = function (item) {
            asignarNotaCtrlGnrl.idNotaMasiva = null;
            asignarNotaCtrlGnrl.valorNotaMasiva = null;
            asignarNotaCtrlGnrl.onMostrarModal(item);
        };

        asignarNotaCtrlGnrl.onMostrarModal = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };

        asignarNotaCtrlGnrl.onOcultarModal = function (item) {
            $("#" + item).hide();
//            $("body").removeClass("modal-open");
//            $("div").removeClass("modal-backdrop fade in");
        };

        asignarNotaCtrlGnrl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfiguracionNota)) {
                asignarNotaCtrlGnrl.guardarNota();
                new ValidationService().resetForm($scope.formConfiguracionNota);
            }
        };

        asignarNotaCtrlGnrl.onSubmitFormNotaMasiva = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (asignarNotaCtrlGnrl.idNotaMasiva === 1) {
                angular.forEach(asignarNotaCtrlGnrl.listadoEstudiantes, function (value, key) {
                    if (value.esPago !== 'ABIERTA') {
                        if (value.nota1 === undefined || value.nota1 === '' || value.nota1 === null) {
                            value.nota1 = parseFloat(asignarNotaCtrlGnrl.valorNotaMasiva);
                        }
                    }
                });
            } else if (asignarNotaCtrlGnrl.idNotaMasiva === 2) {
                angular.forEach(asignarNotaCtrlGnrl.listadoEstudiantes, function (value, key) {
                    if (value.esPago !== 'ABIERTA') {
                        if (value.nota2 === undefined || value.nota2 === '' || value.nota2 === null) {
                            value.nota2 = parseFloat(asignarNotaCtrlGnrl.valorNotaMasiva);
                        }
                    }
                });
            } else if (asignarNotaCtrlGnrl.idNotaMasiva === 3) {
                angular.forEach(asignarNotaCtrlGnrl.listadoEstudiantes, function (value, key) {
                    if (value.esPago !== 'ABIERTA') {
                        if (value.nota3 === undefined || value.nota3 === '' || value.nota3 === null) {
                            value.nota3 = parseFloat(asignarNotaCtrlGnrl.valorNotaMasiva);
                        }
                    }
                });
            }
//            else {}
            appConstant.CERRAR_SWAL();
            asignarNotaCtrlGnrl.onOcultarModal('modalNotaMasivo');
        };

        asignarNotaCtrlGnrl.guardarNota = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (asignarNotaCtrlGnrl.configuracionNota.id === null || asignarNotaCtrlGnrl.configuracionNota.id === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA('No se encontró configuración de porcentajes de las notas');
                return;
            }

            angular.forEach(asignarNotaCtrlGnrl.listadoEstudiantes, function (value, key) {
                value.idUsuario = localStorageService.get("usuario").id;
                value.porcentajeNota1 = asignarNotaCtrlGnrl.configuracionNota.nota1;
                value.porcentajeNota2 = asignarNotaCtrlGnrl.configuracionNota.nota2;
                value.porcentajeNota3 = asignarNotaCtrlGnrl.configuracionNota.nota3;
                value.porcentajeNotaDefinitiva = asignarNotaCtrlGnrl.configuracionNota.notaDefinitiva;
                value.porcentajeNotaHabilitacion = asignarNotaCtrlGnrl.configuracionNota.notaHabilitacion;
            });

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaServiceGnrl.asignarNota(asignarNotaCtrlGnrl.listadoEstudiantes).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    asignarNotaCtrlGnrl.onCargarConfiguracion();
                    asignarNotaCtrlGnrl.onConsultarEstudiantes();
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        function buildTable(results) {
            if (asignarNotaCtrlGnrl.tipoArchivoValido) {
                asignarNotaCtrlGnrl.listadoEstudianteArchivo = [];
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var data = results.data;

                for (var i = 1; i < data.length; i++) {
                    var row = data[i][0];
                    var array = row.split(";");
                    asignarNotaCtrlGnrl.listadoEstudianteArchivo.push(array);
                }
            }
        }

        asignarNotaCtrlGnrl.onCargarArchivo = function () {
            var fileExiste = false;
            var input = $("#files");
            $('#files').parse({
                config: {
                    delimiter: "auto",
                    complete: buildTable
                },
                before: function (file, inputElem){
                    var file3 = file.name.split(".");
                    asignarNotaCtrlGnrl.tipoArchivoValido = file3[1] === 'csv';
                    fileExiste = true;
                },
                error: function (err, file){
                    appConstant.MSG_GROWL_ERROR();
                },
                complete: function (){
                    if (!fileExiste) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Seleccione por lo menos un archivo');
                        return;
                    }

                    if (!asignarNotaCtrlGnrl.tipoArchivoValido) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Tipo de archivo no valido');
                        return;
                    }

                    for (var i = 0; i < asignarNotaCtrlGnrl.listadoEstudianteArchivo.length; i++) {
                        for (var j = 0; j < asignarNotaCtrlGnrl.listadoEstudiantes.length; j++) {
                            if (asignarNotaCtrlGnrl.listadoEstudiantes[j].esPago !== 'ABIERTA') {
                                if (asignarNotaCtrlGnrl.listadoEstudiantes[j].estudiante.split(" ")[0] === asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][7]) {
                                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota1 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][9]);
                                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota2 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][10]);
                                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota3 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][11]);
                                    break;
                                }
                            }
                        }
                    }
                    appConstant.CERRAR_SWAL();
                    input = input.val('').clone(true);
                    $scope.$apply();
                }
            });

        };

        asignarNotaCtrlGnrl.ModalUsuario = function (item) {
            asignarNotaCtrlGnrl.listaAuditoria = [];
            asignarNotaCtrlGnrl.nombreModal = item.estudiante;
            asignarNotaCtrlGnrl.listaAuditoria = item.notaAuditoria;
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        buscarPeriodos();
        asignarNotaCtrlGnrl.onCargarConfiguracion();
    }
})();