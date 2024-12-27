(function () {
    'use strict';
    angular.module('mytodoApp').controller('PeriodoAcademicoCtrl', PeriodoAcademicoCtrl);
    PeriodoAcademicoCtrl.$inject = ['$scope', 'periodosAcademicosServices', '$location', 'ValidationService', 'localStorageService', 'utilServices', '$filter', 'appConstant', '$interval', 'appConstantValueList', 'appGenericConstant'];
    function PeriodoAcademicoCtrl($scope, periodosAcademicosServices, $location, ValidationService, localStorageService, utilServices, $filter, appConstant, $interval, appConstantValueList, appGenericConstant) {

        var gestionPeriodoAcademico = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        gestionPeriodoAcademico.onLimpiar = function () {
            onLimpiar();
        };

        gestionPeriodoAcademico.periodosAcademicos = [];
        gestionPeriodoAcademico.aniosLectivos = [];
        gestionPeriodoAcademico.display;
        gestionPeriodoAcademico.fechaValidacion = "01/01/1900";
        gestionPeriodoAcademico.fechaok = new Date();
        gestionPeriodoAcademico.selectTodos = false;
        gestionPeriodoAcademico.filtrados = [];
        gestionPeriodoAcademico.estados = [];
        gestionPeriodoAcademico.mensajeValidacion = true;
        gestionPeriodoAcademico.periodoAcademico = periodosAcademicosServices.periodoAcademico;
        gestionPeriodoAcademico.periodoAcademicoAuxiliar = periodosAcademicosServices.periodoAcademicoAuxiliar;
        gestionPeriodoAcademico.options = appConstant.FILTRO_TABLAS;
        gestionPeriodoAcademico.selectedOption = gestionPeriodoAcademico.options[0];
        gestionPeriodoAcademico.counter = 0;
        gestionPeriodoAcademico.report = {
            selected: null
        };
        gestionPeriodoAcademico.onObtenerAnioLectivo = function (anio) {
            gestionPeriodoAcademico.periodoAcademico.anoLectivo = anio;
            if (gestionPeriodoAcademico.periodoAcademico.anoLectivo === null
                    || gestionPeriodoAcademico.periodoAcademico.anoLectivo === undefined
                    || gestionPeriodoAcademico.periodoAcademico.anoLectivo === '') {
                return;
            } else {
                gestionPeriodoAcademico.fechaValidacion = onToDate(gestionPeriodoAcademico.fechaValidacion, gestionPeriodoAcademico.periodoAcademico.anoLectivo);
                gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico = onToDate(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico, gestionPeriodoAcademico.periodoAcademico.anoLectivo);
                gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico = onToDate(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico, gestionPeriodoAcademico.periodoAcademico.anoLectivo);
            }
        };
        /*Metodo para obtener lo filtrados*/
        gestionPeriodoAcademico.obtenerFiltrados = function (filtrados) {
            gestionPeriodoAcademico.filtrados = filtrados;
            if (gestionPeriodoAcademico.filtrados.length === 0) {
                gestionPeriodoAcademico.selectTodos = false;
                gestionPeriodoAcademico.report.selected.length = null;
            }
        };
        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionPeriodoAcademico.onSelectTodos = function () {
            if (gestionPeriodoAcademico.selectTodos === true) {
                gestionPeriodoAcademico.report.selected = gestionPeriodoAcademico.filtrados.slice();
            } else {
                gestionPeriodoAcademico.report.selected.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionPeriodoAcademico.onSelectTodosTable = function (clase) {
            if (gestionPeriodoAcademico.report.selected.length === gestionPeriodoAcademico.filtrados.length
                    && gestionPeriodoAcademico.selectTodos === true) {
                gestionPeriodoAcademico.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionPeriodoAcademico.report.selected.length + 1 === gestionPeriodoAcademico.filtrados.length
                            && gestionPeriodoAcademico.selectTodos === false) {
                        gestionPeriodoAcademico.selectTodos = true;
                    }
                } else {
                    gestionPeriodoAcademico.selectTodos = false;
                }

            }

        };
        if (localStorageService.get('periodoAcademico') !== null) {
            gestionPeriodoAcademico.periodoAcademico = localStorageService.get('periodoAcademico');
        }
        if (localStorageService.get('periodoAcademicoAuxiliar') !== null) {
            gestionPeriodoAcademico.periodoAcademicoAuxiliar = localStorageService.get('periodoAcademicoAuxiliar');
        }

        gestionPeriodoAcademico.exportDataExcel = function () {
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Report.xls");
        };
        gestionPeriodoAcademico.exportDataPDF = function () {
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/pdf"
            });
            saveAs(blob, "Report.pdf");
        };
        /*Consultar Períodos Académicos*/
        function onBuscarPeriodosAcademicos() {
            gestionPeriodoAcademico.periodosAcademicos = [];
            gestionPeriodoAcademico.counter = 0;
            periodosAcademicosServices.buscarPeriodoAcademicoByEstado().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodoAca = {
                        id: value.id,
                        codigoPeriodoAcademico: value.codigoPeriodoAcademico,
                        nombrePeriodoAcademico: value.nombrePeriodoAcademico,
                        fechaInicioPeriodoAcademico: $filter('date')(value.anoLectivo.fechaInicioPeriodoAcademico, appGenericConstant.FECHA_DDMMYYYY),
                        fechaCierrePeriodoAcademico: $filter('date')(value.anoLectivo.fechaCierrePeriodoAcademico, appGenericConstant.FECHA_DDMMYYYY),
                        anoLectivo: value.anoLectivo.anoLectivo,
                        anoLectivoJ: value.anoLectivo,
                        estado: value.estado,
                        estadoNombre: value.estado.valor,
                        idEstadoPeriodo: value.idEstadoPeriodo,
                        nombreEstadoPeriodo: value.nombreEstadoPeriodo,
                        nombreResponsable: value.nombreResponsable,
                        fechaRegistro: $filter('date')(value.fechaRegistro, appGenericConstant.FECHA_DDMMYYYY)
                    };
                    gestionPeriodoAcademico.periodosAcademicos.push(periodoAca);
                });
            });
        }

        var refreshTabla = function counter() {
            gestionPeriodoAcademico.counter = gestionPeriodoAcademico.counter + 1;
            if (gestionPeriodoAcademico.counter === 10) {
                periodosAcademicosServices.buscarPeriodoAcademicoByEstado().then(function (data) {
                    gestionPeriodoAcademico.periodosAcademicos = [];
                    angular.forEach(data, function (value, key) {
                        var periodoAca = {
                            id: value.id,
                            codigoPeriodoAcademico: value.codigoPeriodoAcademico,
                            nombrePeriodoAcademico: value.nombrePeriodoAcademico,
                            fechaInicioPeriodoAcademico: $filter('date')(value.anoLectivo.fechaInicioPeriodoAcademico, appGenericConstant.FECHA_DDMMYYYY),
                            fechaCierrePeriodoAcademico: $filter('date')(value.anoLectivo.fechaCierrePeriodoAcademico, appGenericConstant.FECHA_DDMMYYYY),
                            anoLectivo: value.anoLectivo.anoLectivo,
                            anoLectivoJ: value.anoLectivo,
                            estado: value.estado,
                            estadoNombre: value.estado.valor,
                            idEstadoPeriodo: value.idEstadoPeriodo,
                            nombreEstadoPeriodo: value.nombreEstadoPeriodo,
                            nombreResponsable: value.nombreResponsable,
                            fechaRegistro: $filter('date')(value.fechaRegistro, appGenericConstant.FECHA_DDMMYYYY)
                        };
                        gestionPeriodoAcademico.periodosAcademicos.push(periodoAca);
                    });
                    gestionPeriodoAcademico.counter = appGenericConstant.CERO;
                });
            }
        };

        // //

        gestionPeriodoAcademico.cancelarInterval = function () {
            //
        };

        function onBuscarEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO_PERIODO_ACADEMICO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.codigo === 12 || value.codigo === 13)
                        return;
                    var periodoAcademico = {
                        categoria: value.categoria,
                        codigo: value.codigo,
                        estado: value.estado,
                        referencia: value.referencia,
                        valor: value.valor
                    };
                    gestionPeriodoAcademico.estados.push(periodoAcademico);
                });
            });
        }

        /*Limpiar Entidad Períodos Académicos*/
        function onLimpiar() {
            localStorageService.remove('periodoAcademico');
            localStorageService.remove('periodoAcademicoAuxiliar');
            gestionPeriodoAcademico.periodoAcademico.id = null;
            gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico = null;
            gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico = null;
            gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico = null;
            gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico = null;
            gestionPeriodoAcademico.periodoAcademico.anoLectivo = null;
            gestionPeriodoAcademico.periodoAcademico.estado = null;
            gestionPeriodoAcademico.periodoAcademico.nombreResponsable = null;
            gestionPeriodoAcademico.periodoAcademico.fechaRegistro = new Date();
        }

        /*Metodo Para Limpiar La Entidad Desde La Vista*/
        gestionPeriodoAcademico.onClickToAddPeriodoAcademico = function () {
            onLimpiar();
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableVerDetalle = false;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableCodigo = false;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.titulo =appGenericConstant.AGREGAR;
            localStorageService.set('periodoAcademicoAuxiliar', gestionPeriodoAcademico.periodoAcademicoAuxiliar);
            $location.path('/gestion-periodo-academico');
            new ValidationService().resetForm($scope.formCrudPeriodoAcademico);
        };
        /*Acción Para Validar, Guargar o Editar Períodos Académicos*/
        gestionPeriodoAcademico.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudPeriodoAcademico)) {
                if (validarFechas()) {
                    if (onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico) <= onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico)) {
                        if (gestionPeriodoAcademico.periodoAcademico.id === null || gestionPeriodoAcademico.periodoAcademico.id === undefined) {
                            gestionPeriodoAcademico.onAddPeriodoAcademico();
                            new ValidationService().resetForm($scope.formCrudPeriodoAcademico);
                        } else {
                            gestionPeriodoAcademico.onUpdatePeriodoAcademico();
                        }
                    }
                    else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                    }
                }
            }
        };

        function validarFechas() {
            var anio = gestionPeriodoAcademico.periodoAcademico.anoLectivo;
            var fechaInicioPeriodoAcademico = onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico);
            var fechaCierrePeriodoAcademico = onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico);

            if (anio.length < 4) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ANO_DEBE_TENER_CARACTERES);
                return false;
            }
            if (fechaInicioPeriodoAcademico.getFullYear() < anio) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_INICIO_MENOR_ANO);
                return false;
            }
            if (fechaCierrePeriodoAcademico.getFullYear() < anio) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_FIN_MENOR_ANO);
                return false;
            }

            return true;
        }
        gestionPeriodoAcademico.onAddPeriodoAcademico = function () {
            var periodoAca = {
                codigoPeriodoAcademico: appConstant.VALIDAR_STRING(gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico),
                nombrePeriodoAcademico: appConstant.VALIDAR_STRING(gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico),
                anoLectivo: {
                    anoLectivo: gestionPeriodoAcademico.periodoAcademico.anoLectivo,
                    fechaInicioPeriodoAcademico: onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico),
                    fechaCierrePeriodoAcademico: onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico)
                },
                idEstadoPeriodo: gestionPeriodoAcademico.periodoAcademico.estado,
                estado: "ACTIVO",
                nombreResponsable: localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos,
                fechaRegistro: new Date()
            };
            periodosAcademicosServices.agregarPeriodoAcademico(periodoAca).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    onLimpiar();
                } else if (data.tipo === 500) {
                    appConstant.MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        gestionPeriodoAcademico.onCerrarPeriodoAcademico = function (periodoDTO) {
            swal({
                title: '¿Estás seguro que deseas cerrar el período académico ' + periodoDTO.nombrePeriodoAcademico + '?',
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.REALIZANDO_CIERRE_PERIODO);
                appConstant.CARGANDO();

                var periodoAca = {
                    id: periodoDTO.id,
                    codigoPeriodoAcademico: appConstant.VALIDAR_STRING(periodoDTO.codigoPeriodoAcademico),
                    nombrePeriodoAcademico: appConstant.VALIDAR_STRING(periodoDTO.nombrePeriodoAcademico),
                    anoLectivo: null,
                    idEstadoPeriodo: 13,
                    estado: "ACTIVO",
                    nombreResponsable: localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos,
                    fechaRegistro: null,
                    nombreResponsableCierrePeriodo: localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos
                };
                
                periodoDTO.nombreResponsable = localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;

                periodosAcademicosServices.cierrePeriodoAcademico(periodoAca).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.MSG_GROWL_OK(appGenericConstant.CIERRE_PERIOSO_REALIZADO_SATIS);
                        swal({
                            title: appGenericConstant.TENGA_EN_CUENTA,
                            type: appGenericConstant.WARNING,
                            confirmButtonText: appGenericConstant.ACEPTAR,
                            allowOutsideClick: false
                        }).then(function () {
                        });
                        onLimpiar();
                        onBuscarPeriodosAcademicos();
                    } else if (data.tipo === 500) {
                        appConstant.MSG_GROWL_ERROR();
                    } else if (data.tipo === 409) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    } else {
                        appConstant.MSG_GROWL_ERROR();
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    throw e;
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    gestionPeriodoAcademico.report.selected.length = null;
                    gestionPeriodoAcademico.selectTodos = false;
                }
            });
        };

        /*Método Para Obtener El  Período Académico A Editar*/
        gestionPeriodoAcademico.onClickToUpdatePeriodoAcademico = function (item) {
            onLimpiar();
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableVerDetalle = false;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableCodigo = true;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.titulo = appGenericConstant.MODIFICAR;
            gestionPeriodoAcademico.periodoAcademico.id = item.id;
            gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico = item.codigoPeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico = item.nombrePeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.anoLectivo = item.anoLectivo;
            gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico = item.fechaInicioPeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico = item.fechaCierrePeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.fechaRegistro = item.fechaRegistro;
            gestionPeriodoAcademico.periodoAcademico.nombreResponsable = localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
            gestionPeriodoAcademico.periodoAcademico.estado = item.idEstadoPeriodo;
            $location.path('/gestion-periodo-academico');
            localStorageService.set('periodoAcademico', gestionPeriodoAcademico.periodoAcademico);
            localStorageService.set('periodoAcademicoAuxiliar', gestionPeriodoAcademico.periodoAcademicoAuxiliar);
        };
        /*Acción Para Validar Y Modificar Periodo Academico*/
        gestionPeriodoAcademico.onUpdatePeriodoAcademico = function () {
            var periodoAca = {
                id: gestionPeriodoAcademico.periodoAcademico.id,
                codigoPeriodoAcademico: appConstant.VALIDAR_STRING(gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico),
                nombrePeriodoAcademico: appConstant.VALIDAR_STRING(gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico),
                anoLectivo: {
                    anoLectivo: gestionPeriodoAcademico.periodoAcademico.anoLectivo,
                    fechaInicioPeriodoAcademico: onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico),
                    fechaCierrePeriodoAcademico: onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico)
                },
                idEstadoPeriodo: gestionPeriodoAcademico.periodoAcademico.estado,
                estado: "ACTIVO",
                nombreResponsable: gestionPeriodoAcademico.periodoAcademico.nombreResponsable,
                fechaRegistro: onToDateString(gestionPeriodoAcademico.periodoAcademico.fechaRegistro)
            };
            periodosAcademicosServices.actualizarPeriodoAcademico(periodoAca).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('periodoAcademico', gestionPeriodoAcademico.periodoAcademico);
                    localStorageService.set('periodoAcademicoAuxiliar', gestionPeriodoAcademico.periodoAcademicoAuxiliar);
                } else if (data.tipo === 500) {
                    appConstant.MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };
        /*Método Para Obtener El  Período Académico A Ver Detalle*/
        gestionPeriodoAcademico.onClickToVerDetallePeriodoAcademico = function (item) {
            onLimpiar();
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableVerDetalle = true;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.disableCodigo = true;
            gestionPeriodoAcademico.periodoAcademicoAuxiliar.titulo = appGenericConstant.DETALLE;
            gestionPeriodoAcademico.periodoAcademico.id = item.id;
            gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico = item.codigoPeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico = item.nombrePeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.anoLectivo = item.anoLectivo;
            gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico = item.fechaInicioPeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico = item.fechaCierrePeriodoAcademico;
            gestionPeriodoAcademico.periodoAcademico.fechaRegistro = item.fechaRegistro;
            gestionPeriodoAcademico.periodoAcademico.nombreResponsable = localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
            gestionPeriodoAcademico.periodoAcademico.estado = item.idEstadoPeriodo !== 13 ? item.idEstadoPeriodo : "Cerrado";
            $location.path('/gestion-periodo-academico');
            localStorageService.set('periodoAcademico', gestionPeriodoAcademico.periodoAcademico);
            localStorageService.set('periodoAcademicoAuxiliar', gestionPeriodoAcademico.periodoAcademicoAuxiliar);
        };
        gestionPeriodoAcademico.onDeletePeriodoAcademico = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PERIODO_ACADEMICO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    var periodoAca = {
                        id: item.id,
                        codigoPeriodoAcademico: item.codigoPeriodoAcademico,
                        nombre: item.nombrePeriodoAcademico,
                        fechaInicioPeriodoAcademico: item.fechaInicioPeriodoAcademico,
                        fechaCierrePeriodoAcademico: item.fechaCierrePeriodoAcademico,
                        anoLectivo: item.anoLectivo,
                        estado: item.estado,
                        nombreResponsable: item.nombreResponsable,
                        fechaRegistro: item.fechaRegistro
                    };
                    periodosAcademicosServices.eliminarPeriodoAcademico(periodoAca).then(function (data) {
                        if (data.tipo === 200) {
                            swal(appGenericConstant.PERIODO_ACADEMICO_ELIMINADO,
                                appGenericConstant.PERIODO_ACADEMICO_ELIMINADO_SATIS,
                                appGenericConstant.SUCCESS);
                            onLimpiar();
                            gestionPeriodoAcademico.report.selected.length = null;
                            onBuscarPeriodosAcademicos();
                            gestionPeriodoAcademico.selectTodos = false;
                        } else if (data.tipo === 400) {
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.REGISTRO_UTILIZADO,
                                appGenericConstant.WARNING);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        throw e;
                    });
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    gestionPeriodoAcademico.report.selected.length = null;
                    gestionPeriodoAcademico.selectTodos = false;
                }
            });
        };
        gestionPeriodoAcademico.onDeleteMasivoPeriodosAcademicos = function () {
            gestionPeriodoAcademico.listNoEliminados = [];
            gestionPeriodoAcademico.listIdsEliminar = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PERIODOS_ACADEMICOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,                
                allowOutsideClick: false,
                closeOnCancel: true
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    angular.forEach(gestionPeriodoAcademico.report.selected, function (value, key) {
                        gestionPeriodoAcademico.listIdsEliminar.push(value.id);
                    });
                    periodosAcademicosServices.eliminarPeriodosAcademicos(gestionPeriodoAcademico.listIdsEliminar).then(function (data) {
                        if (data.tipo === 200) {
                            swal(appGenericConstant.PERIODOS_ACADEMICOS_ELIMINADOS,
                                appGenericConstant.PERIODOS_ACADEMICOS_ELIMINADOS_SATIS,
                                appGenericConstant.SUCCESS);
                            gestionPeriodoAcademico.report.selected.length = null;
                            onBuscarPeriodosAcademicos();
                        } else if (data.tipo === 400) {
                            swal(appGenericConstant.ALGUNOS_REGISTROS,
                                '',
                                appGenericConstant.WARNING);
                            gestionPeriodoAcademico.mensajeValidacion = false;
                            gestionPeriodoAcademico.listNoEliminados = data.objectoList;
                            onBuscarPeriodosAcademicos();
                            gestionPeriodoAcademico.report.selected.length = null;
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        throw e;
                    });

                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };
        onBuscarPeriodosAcademicos();
        onBuscarEstados();

        /*Formateo fecha*/
        function onFormattedDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }

        function onToDate(dateStr, anioLectivo) {
            var d = new Date();
            if (anioLectivo === null || anioLectivo === undefined || anioLectivo === "") {
                anioLectivo = d.getFullYear();
            }
            if (anioLectivo.length !== 4) {
                anioLectivo = d.getFullYear();
            }
            if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                //                return new Date(parts[2], parts[1] - 1, parts[0]);
                return [parts[0], parts[1], anioLectivo].join('/');
            }
        }

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

        function onCambiarFecha(dateStr) {
            if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date([parts[1], parts[0], parts[2]].join('/'));
            }
        }

        $("#datepicker-anio-lectivo").datepicker({
            format: 'yyyy',
            startView: "years",
            minViewMode: "years",
            autoclose: true,
            language: "es",
            clearBtn: true,
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
                if (date.getFullYear() > 3000) {
                    return false;
                }
            }
        });

        $('#fechaPeriodo.input-daterange').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            startDate: onToDateString(gestionPeriodoAcademico.fechaValidacion),
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

        gestionPeriodoAcademico.onChange = function () {
            gestionPeriodoAcademico.onObtenerAnioLectivo($("#datepicker-anio-lectivo").val());
            $("#fechaInicio").val(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico);
            $("#fechaFin").val(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico);
            if (gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== null
                    && gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== undefined
                    && gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== '') {
                $('#fechaInicio').datepicker('update');
            }
            if (gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== null
                    && gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== undefined
                    && gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== '') {
                $('#fechaFin').datepicker('update');
            }
            $("#fechaPeriodo.input-daterange").datepicker("update");
        };

        if (gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== null
                && gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== undefined
                && gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico !== '') {
            $("#fechaInicio").val(gestionPeriodoAcademico.periodoAcademico.fechaInicioPeriodoAcademico);
            $('#fechaInicio').datepicker('update');
        }

        if (gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== null
                && gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== undefined
                && gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico !== '') {
            $("#fechaFin").val(gestionPeriodoAcademico.periodoAcademico.fechaCierrePeriodoAcademico);
            $('#fechaFin').datepicker('update');
        }
        
        gestionPeriodoAcademico.onBlurCambioNombrePeriodoNuevo = function(){
            if(gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico === '0000'){
                gestionPeriodoAcademico.periodoAcademico.codigoPeriodoAcademico = gestionPeriodoAcademico.periodoAcademico.nombrePeriodoAcademico;
            }
        };
        
    }
})();