(function () {
    'use strict';
    angular.module('mytodoApp').controller('confiEducacionContinuadaCtrl', confiEducacionContinuadaCtrl);
    confiEducacionContinuadaCtrl.$inject = ['$scope', 'confiEducacionContinuadaServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', '$filter', 'appGenericConstant', '$timeout'];
    function confiEducacionContinuadaCtrl($scope, confiEducacionContinuadaServices, $location, growl, ValidationService, localStorageService, utilServices, appConstant, $interval, $filter, appGenericConstant, $timeout) {

        var gestionConfiEduCon = this;
        gestionConfiEduCon.camposMatHabilitados = [];
        gestionConfiEduCon.camposSemHabilitados = [];
        gestionConfiEduCon.botonesHabilitados = [];
        gestionConfiEduCon.Programas = [];
        gestionConfiEduCon.listaPeriodos = [];
        gestionConfiEduCon.tiposEducacionContinuada = [];
        gestionConfiEduCon.confiEduCon = confiEducacionContinuadaServices.confiEduCon;
        gestionConfiEduCon.confiEduConAuxiliar = confiEducacionContinuadaServices.confiEduConAuxiliar;
        gestionConfiEduCon.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionConfiEduCon.confiEduConAuxiliar.hideTabla = true;
        gestionConfiEduCon.counter = 0;
        gestionConfiEduCon.options = appConstant.FILTRO_TABLAS;
        gestionConfiEduCon.report = {selected: null};
        gestionConfiEduCon.selectedOption = gestionConfiEduCon.options[0];
        function onBuscarPrograma() {
            gestionConfiEduCon.counter = 0;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            confiEducacionContinuadaServices.buscarPrograma().then(function (data) {
                gestionConfiEduCon.Programas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        function onBuscarPeriodoAcademico() {
            confiEducacionContinuadaServices.buscarPeriodosAcademicos().then(function (data) {
                gestionConfiEduCon.listaPeriodos = data;
            }).catch(function (e) {
                return;
            });
        }

        function onBuscarTiposEducacionContinuada() {
            confiEducacionContinuadaServices.buscarTipoEducacionContinuada().then(function (data) {
                gestionConfiEduCon.tiposEducacionContinuada = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                return;
            });
        }

        var refreshTabla = function counter() {
            gestionConfiEduCon.counter = gestionConfiEduCon.counter + 1;
            if (gestionConfiEduCon.counter === 10) {
                confiEducacionContinuadaServices.buscarPrograma().then(function (data) {
                    gestionConfiEduCon.Programas = data;
                });
                gestionConfiEduCon.counter = 0;
            }
        };
        // //
        gestionConfiEduCon.cancelarInterval = function () {
            //
        };
        if (localStorageService.get('confiEduCon') !== null) {
            gestionConfiEduCon.confiEduCon = localStorageService.get('confiEduCon');
        } else {
            $location.path('/configurar-educacion-continuada');
        }

        if (localStorageService.get('confiEduConAuxiliar') !== null) {
            gestionConfiEduCon.confiEduConAuxiliar = localStorageService.get('confiEduConAuxiliar');

        }

        gestionConfiEduCon.onLimpiarRegistro = function () {
            localStorageService.remove('confiEduCon');
            localStorageService.remove('confiEduConAuxiliar');
        };
        gestionConfiEduCon.onClickToView = function (item) {
            gestionConfiEduCon.confiEduConAuxiliar.titulo = appGenericConstant.DETALLE_EDUCACION_CONTINUADA;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitar = true;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarAgregar = false;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = false;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarCodigos = true;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarCampoEstado = false;
            gestionConfiEduCon.confiEduCon.idPrograma = item.id;
            gestionConfiEduCon.confiEduCon.codigoPrograma = item.codigoPrograma;
            gestionConfiEduCon.confiEduCon.nombrePrograma = item.nombrePrograma;
            gestionConfiEduCon.confiEduCon.listaPeriodos = item.listaPeriodos;
            gestionConfiEduCon.confiEduCon.idPeriodoAcademico = null;
            localStorageService.set('confiEduCon', gestionConfiEduCon.confiEduCon);
            localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);
            $location.path('/gestion-configurar-educacion-continuada');
        };

        gestionConfiEduCon.onConfiguracionPrograma = function (item) {
            gestionConfiEduCon.confiEduConAuxiliar.titulo = appGenericConstant.CONFIG_EDUCACION_CONTINUADA;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitar = false;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarAgregar = false;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = false;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarCodigos = true;
            gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarCampoEstado = false;
            gestionConfiEduCon.confiEduCon.idPrograma = item.id;
            gestionConfiEduCon.confiEduCon.codigoPrograma = item.codigoPrograma;
            gestionConfiEduCon.confiEduCon.nombrePrograma = item.nombrePrograma;
            gestionConfiEduCon.confiEduCon.jornadas = gestionConfiEduCon.jornadas;
            gestionConfiEduCon.confiEduCon.duracion = item.duracion;
            gestionConfiEduCon.confiEduCon.listaPeriodos = item.listaPeriodos;
            gestionConfiEduCon.confiEduCon.idPeriodoAcademico = null;
            localStorageService.set('confiEduCon', gestionConfiEduCon.confiEduCon);
            localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);
            $location.path('/gestion-configurar-educacion-continuada');
        };

        gestionConfiEduCon.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfigurarEducacionContinuada)) {
                onConfiguracionProgramasAcademicos();
                new ValidationService().resetForm($scope.formConfigurarEducacionContinuada);
            }
        };

        gestionConfiEduCon.onChangePorcentaje = function () {
            if (gestionConfiEduCon.confiEduCon.porcentaje === null
                    || gestionConfiEduCon.confiEduCon.porcentaje === ''
                    || gestionConfiEduCon.confiEduCon.porcentaje === undefined) {
                gestionConfiEduCon.confiEduCon.porcentaje = '1';
                return;
            }

            if (gestionConfiEduCon.confiEduCon.porcentaje > '100') {
                gestionConfiEduCon.confiEduCon.porcentaje = '100';
                return;
            }
            if (gestionConfiEduCon.confiEduCon.porcentaje <= '0') {
                gestionConfiEduCon.confiEduCon.porcentaje = '1';
                return;
            }
        };

        function onConfiguracionProgramasAcademicos() {
            var newConfiguracion = {
                id: gestionConfiEduCon.confiEduCon.id,
                idPrograma: gestionConfiEduCon.confiEduCon.idPrograma,
                idPeriodoAcademico: gestionConfiEduCon.confiEduCon.idPeriodoAcademico,
                idTipoEducacionContinuada: gestionConfiEduCon.confiEduCon.idTipoEducacionContinuada,
                fechaInicio: onToDateString(gestionConfiEduCon.confiEduCon.fechaInicio),
                fechaFin: onToDateString(gestionConfiEduCon.confiEduCon.fechaFin),
                intensidadHoraria: parseInt(gestionConfiEduCon.confiEduCon.intensidadHoraria),
                cantidadSesiones: parseInt(gestionConfiEduCon.confiEduCon.cantidadSesiones),
                porcentaje: gestionConfiEduCon.confiEduCon.porcentaje
            };
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            confiEducacionContinuadaServices.RegistrarConfiguracionEducacionContinuada(newConfiguracion).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    gestionConfiEduCon.confiEduCon.id = data.objectResponse.id;
                    gestionConfiEduCon.confiEduCon.idPrograma = data.objectResponse.idPrograma;
                    gestionConfiEduCon.confiEduCon.intensidadHoraria = data.objectResponse.intensidadHoraria;
                    gestionConfiEduCon.confiEduCon.fechaInicio = $filter('date')(data.objectResponse.fechaInicio, appGenericConstant.FECHA_DDMMYYYY);
                    gestionConfiEduCon.confiEduCon.fechaFin = $filter('date')(data.objectResponse.fechaFin, appGenericConstant.FECHA_DDMMYYYY);
                    gestionConfiEduCon.confiEduCon.idTipoEducacionContinuada = data.objectResponse.idTipoEducacionContinuada;
                    gestionConfiEduCon.confiEduCon.idPeriodoAcademico = data.objectResponse.idPeriodoAcademico;
                    gestionConfiEduCon.confiEduCon.cantidadSesiones = data.objectResponse.cantidadSesiones;
                    gestionConfiEduCon.confiEduCon.porcentaje = data.objectResponse.porcentaje;
                    gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = true;
                    localStorageService.set('confiEduCon', gestionConfiEduCon.confiEduCon);
                    localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);
                } else if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        gestionConfiEduCon.buscarConfigEduCon = function () {
            if (gestionConfiEduCon.confiEduCon.idPeriodoAcademico === null) {
                gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = false;
                localStorageService.set('confiEduCon', gestionConfiEduCon.confiEduCon);
                localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);
            } else {
                confiEducacionContinuadaServices.buscarConfiguracionByProgramaAndPeriodoAcademico(gestionConfiEduCon.confiEduCon.idPrograma, gestionConfiEduCon.confiEduCon.idPeriodoAcademico).then(function (info) {
                    var periodo = null;
                    if (info !== null && info !== "" && info.length !== 0) {
                        gestionConfiEduCon.confiEduCon.id = info[0].id;
                        gestionConfiEduCon.confiEduCon.idPrograma = info[0].idPrograma;
                        gestionConfiEduCon.confiEduCon.intensidadHoraria = info[0].intensidadHoraria;
                        gestionConfiEduCon.confiEduCon.fechaInicio = $filter('date')(info[0].fechaInicio, appGenericConstant.FECHA_DDMMYYYY, '+0430');
                        gestionConfiEduCon.confiEduCon.fechaFin = $filter('date')(info[0].fechaFin, appGenericConstant.FECHA_DDMMYYYY, '+0430');
                        gestionConfiEduCon.confiEduCon.idTipoEducacionContinuada = info[0].idTipoEducacionContinuada;
                        gestionConfiEduCon.confiEduCon.idPeriodoAcademico = info[0].idPeriodoAcademico;
                        gestionConfiEduCon.confiEduCon.cantidadSesiones = info[0].cantidadSesiones;
                        gestionConfiEduCon.confiEduCon.porcentaje = info[0].porcentaje;
                    } else {
                        gestionConfiEduCon.confiEduCon.id = null;
                        gestionConfiEduCon.confiEduCon.intensidadHoraria = null;
                        gestionConfiEduCon.confiEduCon.fechaInicio = null;
                        gestionConfiEduCon.confiEduCon.fechaFin = null;
                        gestionConfiEduCon.confiEduCon.idTipoEducacionContinuada = null;
                        gestionConfiEduCon.confiEduCon.cantidadSesiones = null;
                        gestionConfiEduCon.confiEduCon.porcentaje = null;
                    }

                    angular.forEach(gestionConfiEduCon.listaPeriodos, function (value, key) {
                        if (value.id === gestionConfiEduCon.confiEduCon.idPeriodoAcademico) {
                            periodo = value;
                            return;
                        }
                    });

                    if (periodo.nombreEstadoPeriodo !== appGenericConstant.INSCRIPCION
                            && periodo.nombreEstadoPeriodo !== appGenericConstant.ABIERTO) {
                        gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarAgregar = true;
                    } else {
                        gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarAgregar = false;
                    }
                    gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = true;
                    localStorageService.set('confiEduCon', gestionConfiEduCon.confiEduCon);
                    localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);

                    $timeout(function () {
                        $(".spinner-input").TouchSpin({
                            verticalbuttons: true,
                            min: 1,
                            max: 999
                        });

                        $('#fechaPeriodo.input-daterange').datepicker({
                            format: "dd/mm/yyyy",
                            language: "es",
                            autoclose: true,
                            
                            clearBtn: true,
                            beforeShowYear: function (date) {
                                if (date.getFullYear() < 1900) {
                                    return false;
                                }
                            },
                            beforeShowMonth: function (date) {
                                if (date.getFullYear() < 1900) {
                                    return false;
                                }
                            },
                            beforeShowDay: function (date) {
                                if (date.getFullYear() < 1900) {
                                    return false;
                                }
                            }
                        });
                        new ValidationService().resetForm($scope.formConfigurarEducacionContinuada);
                    }, 500);
                }).catch(function (e) {
                    gestionConfiEduCon.confiEduConAuxiliar.onDeshabilitarPanel = false;
                    localStorageService.set('confiEduConAuxiliar', gestionConfiEduCon.confiEduConAuxiliar);
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        $timeout(function () {
            $(".spinner-input").TouchSpin({
                verticalbuttons: true,
                min: 1,
                max: 999
            });

            $('#fechaPeriodo.input-daterange').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                clearBtn: true,
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                },
                beforeShowMonth: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                },
                beforeShowDay: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                }
            });
            new ValidationService().resetForm($scope.formConfigurarEducacionContinuada);
        }, 500);

        onBuscarPrograma();
        onBuscarPeriodoAcademico();
        onBuscarTiposEducacionContinuada();

        function onToDateString(dateStr) {
            if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }

        gestionConfiEduCon.onChange = function () {
            $("#fechaInicio").val(gestionConfiEduCon.confiEduCon.fechaInicio);
            $("#fechaFin").val(gestionConfiEduCon.confiEduCon.fechaFin);
            if (gestionConfiEduCon.confiEduCon.fechaInicio !== null
                    && gestionConfiEduCon.confiEduCon.fechaInicio !== undefined
                    && gestionConfiEduCon.confiEduCon.fechaInicio !== '') {
                $('#fechaInicio').datepicker('update');
            }
            if (gestionConfiEduCon.confiEduCon.fechaFin !== null
                    && gestionConfiEduCon.confiEduCon.fechaFin !== undefined
                    && gestionConfiEduCon.confiEduCon.fechaFin !== '') {
                $('#fechaFin').datepicker('update');
            }
            $("#fechaPeriodo.input-daterange").datepicker("update");
        };

        if (gestionConfiEduCon.confiEduCon.fechaInicio !== null
                && gestionConfiEduCon.confiEduCon.fechaInicio !== undefined
                && gestionConfiEduCon.confiEduCon.fechaInicio !== '') {
            $("#fechaInicio").val(gestionConfiEduCon.confiEduCon.fechaInicio);
            $('#fechaInicio').datepicker('update');
        }

        if (gestionConfiEduCon.confiEduCon.fechaFin !== null
                && gestionConfiEduCon.confiEduCon.fechaFin !== undefined
                && gestionConfiEduCon.confiEduCon.fechaFin !== '') {
            $("#fechaFin").val(gestionConfiEduCon.confiEduCon.fechaFin);
            $('#fechaFin').datepicker('update');
        }
    }
})();
