(function () {
    'use strict';
    angular.module('mytodoApp').controller('CruceReferenciaMasivoGrupoGnrl', CruceReferenciaMasivoGrupoGnrl);
    CruceReferenciaMasivoGrupoGnrl.$inject = ['$scope', 'asignarNotaServiceGnrl', 'asistenciaServices', 'cruceReferenciasService', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function CruceReferenciaMasivoGrupoGnrl($scope, asignarNotaServiceGnrl, asistenciaServices, cruceReferenciasService, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var asignarNotaCtrlGnrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        if (localStorageService.get("usuario") !== null) {
            asignarNotaCtrlGnrl.user = localStorageService.get("usuario");
        }

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
        asignarNotaCtrlGnrl.totalArqueoOtro = 0;

        asignarNotaCtrlGnrl.onChangeValorNota = function () {
            asignarNotaCtrlGnrl.valorNotaMasiva = 0;
        };
        asignarNotaCtrlGnrl.identificacionConsultar = "";

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

        asignarNotaCtrlGnrl.onKeyUpCleanField = function () {
            var input = document.getElementById('inputCodigo1').value;
            if (input === null || input === "" || input === undefined || input.length === 0) {
                historialLiquidacion.liquidacionEstudiante = [];
                $(function () {
                    $('#divNombre,#divIdentificacion').hide();
                });
            }

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

                for (var j = 0; j < asignarNotaCtrlGnrl.listadoEstudiantes.length; j++) {
                    asignarNotaCtrlGnrl.listadoEstudiantes[j].estudiante.codigo === asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][8]
                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota1 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][10]);
                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota2 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][11]);
                    asignarNotaCtrlGnrl.listadoEstudiantes[j].nota3 = parseFloat(asignarNotaCtrlGnrl.listadoEstudianteArchivo[i][12]);
                }


                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
            });
            $("div").removeClass("div.swal2-overlay");
            appConstant.CERRAR_SWAL();
        };

        asignarNotaCtrlGnrl.onConsultarEstudiantesCruce = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaCtrlGnrl.listadoEstudiantes = [];
            asignarNotaServiceGnrl.buscarEstudiantesCruceByGrupo(asignarNotaCtrlGnrl.identificacionConsultar).then(function (data) {
                asignarNotaCtrlGnrl.listadoEstudiantes = data;
                asignarNotaCtrlGnrl.listaOtros = [];

                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
            });
            $("div").removeClass("div.swal2-overlay");
            appConstant.CERRAR_SWAL();
        };

        asignarNotaCtrlGnrl.checkAllOtros = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                asignarNotaCtrlGnrl.totalArqueoOtro = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;

                for (i = 0; i < asignarNotaCtrlGnrl.listaOtros.length; i++) {
                    asignarNotaCtrlGnrl.totalArqueoOtro = asignarNotaCtrlGnrl.totalArqueoOtro + asignarNotaCtrlGnrl.listaOtros[i].valorLiquidado;
                    asignarNotaCtrlGnrl.listaOtros[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                asignarNotaCtrlGnrl.totalArqueoOtro = 0;
                for (i = 0; i < asignarNotaCtrlGnrl.listaOtros.length; i++) {
                    asignarNotaCtrlGnrl.listaOtros[i].seleccionado = false;
                }
            }
        };

        asignarNotaCtrlGnrl.checkOtros = function (item, idCheckAll, classCheckHijos, idCheck) {
//            $("." + classCheckHijos).change(function () {
//                $("#" + idCheckAll).prop('checked', false);
//            });
//            
            if ($("#chekValorOtro" + item.id).is(':checked')) {
                asignarNotaCtrlGnrl.totalArqueoOtro = asignarNotaCtrlGnrl.totalArqueoOtro + item.valorLiquidado;
                item.seleccionado = true;
            } else {
                asignarNotaCtrlGnrl.totalArqueoOtro = asignarNotaCtrlGnrl.totalArqueoOtro - item.valorLiquidado;
                item.seleccionado = false;
            }

            for (var i = 0; i < asignarNotaCtrlGnrl.listaOtros.length; i++) {
                if (asignarNotaCtrlGnrl.listaOtros[i].seleccionado === false) {
                    $("#selectAllOtro").prop('checked', false);
                    break;
                } else {
                    $("#selectAllOtro").prop('checked', true);
                }
            }
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

        asignarNotaCtrlGnrl.onGuardarCruce = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            asignarNotaCtrlGnrl.cruceDTO = {};

            asignarNotaCtrlGnrl.cruceDTO.pkUsuario = localStorageService.get("usuario").id;
            asignarNotaCtrlGnrl.cruceDTO.userName = localStorageService.get("usuario").userName;
            asignarNotaCtrlGnrl.cruceDTO.totalAbonos = asignarNotaCtrlGnrl.totalAbonos;
            asignarNotaCtrlGnrl.cruceDTO.liquidacionesPendientes = asignarNotaCtrlGnrl.listaOtros;
            asignarNotaCtrlGnrl.cruceDTO.liquidacionesAbono = asignarNotaCtrlGnrl.abonosPendientesG;

            cruceReferenciasService.guardarCruceMasivo(asignarNotaCtrlGnrl.cruceDTO).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    asignarNotaCtrlGnrl.onConsultarEstudiantesCruce();
                    $("#myModal").modal("hide");
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };


        asignarNotaCtrlGnrl.onConsultarEstudiantesCruce2 = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaCtrlGnrl.listadoEstudiantes = [];
            asignarNotaServiceGnrl.buscarEstudiantesCruceByGrupo("1050838383").then(function (data) {
                asignarNotaCtrlGnrl.listadoEstudiantes = data;
                asignarNotaCtrlGnrl.listaOtros = [];

                asignarNotaCtrlGnrl.onGuardarCruceMasivamente();

            });
            $("div").removeClass("div.swal2-overlay");
            appConstant.CERRAR_SWAL();
        };

        asignarNotaCtrlGnrl.onGuardarCruceMasivamente = function () {

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            angular.forEach(asignarNotaCtrlGnrl.listadoEstudiantes, function (value, key) {
                var sumatoriaLiquidaciones = 0;
                asignarNotaCtrlGnrl.listaOtros = [];

                for (var i = 0; i < value.liquidacionesPendientes.length; i++) {
                    sumatoriaLiquidaciones = sumatoriaLiquidaciones + value.liquidacionesPendientes[i].valorLiquidado;
                    if (value.abonosMatricula >= sumatoriaLiquidaciones) {
                        var liquidacion = {
                            id: value.liquidacionesPendientes[i].id,
                            referencia: value.liquidacionesPendientes[i].referencia,
                            valorLiquidado: value.liquidacionesPendientes[i].valorLiquidado,
                            seleccionado: true
                        };
                        asignarNotaCtrlGnrl.listaOtros.push(liquidacion);
                    } else {
                        sumatoriaLiquidaciones = 0;
//                        break;
                    }
                }

                asignarNotaCtrlGnrl.cruceDTO = {};
                asignarNotaCtrlGnrl.cruceDTO.pkUsuario = localStorageService.get("usuario").id;
                asignarNotaCtrlGnrl.cruceDTO.userName = localStorageService.get("usuario").userName;
                asignarNotaCtrlGnrl.cruceDTO.totalAbonos = value.abonosMatricula;
                asignarNotaCtrlGnrl.cruceDTO.liquidacionesPendientes = asignarNotaCtrlGnrl.listaOtros;
                asignarNotaCtrlGnrl.cruceDTO.liquidacionesAbono = value.liquidacionesAbono;
                sumatoriaLiquidaciones = 0;

                if (asignarNotaCtrlGnrl.cruceDTO.liquidacionesPendientes.length !== 0) {

                    cruceReferenciasService.guardarCruceMasivo(asignarNotaCtrlGnrl.cruceDTO).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_OK(data.message);
//                        asignarNotaCtrlGnrl.onConsultarEstudiantesCruce();
                        } else {
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });
                }

            });


        };

        asignarNotaCtrlGnrl.ModalUsuario = function (item) {
            asignarNotaCtrlGnrl.listaAuditoria = [];
            asignarNotaCtrlGnrl.listaOtros = [];
            asignarNotaCtrlGnrl.abonosPendientesG = item.liquidacionesAbono;
            asignarNotaCtrlGnrl.nombreModal = item.estudiante;
            asignarNotaCtrlGnrl.totalAbonos = item.abonosMatricula;
            asignarNotaCtrlGnrl.totalArqueoOtro = 0;
            $("#selectAllOtro").prop('checked', false);

            angular.forEach(item.liquidacionesPendientes, function (value, key) {
                var liquidacion = {
                    id: value.id,
                    referencia: value.referencia,
                    valorLiquidado: value.valorLiquidado,
                    seleccionado: false
                };
                asignarNotaCtrlGnrl.listaOtros.push(liquidacion);
            });

            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        buscarPeriodos();
    }
})();