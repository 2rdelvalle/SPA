(function () {
    'use strict';
    angular.module('mytodoApp').controller('calendarioAcademicoCtrl', calendarioAcademicoCtrl);

    calendarioAcademicoCtrl.$inject = ['$scope', '$location', 'calendarioAcademicoServices', 'ValidationService', 'localStorageService', 'utilServices', 'programasAcademicosEntitiesServices', 'appConstant', '$interval', 'appGenericConstant', 'appConstantValueList'];
    function calendarioAcademicoCtrl($scope, $location, calendarioAcademicoServices, ValidationService, localStorageService, utilServices, programasAcademicosEntitiesServices, appConstant, $interval, appGenericConstant, appConstantValueList) {
        var calendariosAcademicosControl = this;
        calendariosAcademicosControl.calendarioAcademicosEntity = calendarioAcademicoServices.calendariosAcademicos;
        calendariosAcademicosControl.calendariosAcademicosVisor = calendarioAcademicoServices.calendariosAcademicosAux;
        calendariosAcademicosControl.visible = calendarioAcademicoServices.visible;
        calendariosAcademicosControl.visible.validaJornada = false;
        calendariosAcademicosControl.calendarioAcademicosEntity.inscripcion = appGenericConstant.NO;
        calendariosAcademicosControl.lista = [];
        calendariosAcademicosControl.listaEstados = [];
        calendariosAcademicosControl.listaModalidades = [];
        calendariosAcademicosControl.calendarioAcademicosEntity.calendario = [];
        calendariosAcademicosControl.counter = appGenericConstant.CERO;
        var fecha;

        var config = {};

        if (localStorageService.get('calendariosAcademicos') !== null) {
            var calendariosAcademicos = localStorageService.get('calendariosAcademicos');
            calendariosAcademicosControl.calendarioAcademicosEntity = calendariosAcademicos;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            calendariosAcademicosControl.calendariosAcademicosVisor = status;
        }

        calendariosAcademicosControl.options = appConstant.FILTRO_TABLAS;

        calendariosAcademicosControl.selectedOption = calendariosAcademicosControl.options[0];

        calendariosAcademicosControl.report = {selected: null};

        function onConsultarCalendarios() {
            calendariosAcademicosControl.counter = 0;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            calendarioAcademicoServices.buscarCalendarioAcademicos().then(function (data) {
                calendarioAcademicoServices.buscarMaximoCortes().then(function (valor) {
                    calendariosAcademicosControl.listaAuxiliarCalendario = [];
                    calendariosAcademicosControl.listaCalendarioAcademico = [];
                    for (var e = 0; e < data.length; e++) {
                        calendariosAcademicosControl.listaAuxiliarCalendario = {
                            id: data[e].id,
                            codigoCalendario: data[e].codigoCalendario,
                            nombreCalendario: data[e].nombreCalendario,
                            idEstadoCalendario: data[e].idEstadoCalendario,
                            nombreEstadoCalendario: data[e].nombreEstadoCalendario,
                            nombreModalidad: data[e].nombreModalidad,
                            idModalidad: data[e].idModalidad,
                            idPeriodoAcademico: data[e].periodoAcademico.id,
                            nombrePeriodoAcademico: data[e].periodoAcademico.nombrePeriodoAcademico,
                            calendarioDetalleDTO: data[e].calendarioDetalleDTO

                        };
                        calendariosAcademicosControl.listaCalendarioAcademico.push(calendariosAcademicosControl.listaAuxiliarCalendario);
                    }
                    calendariosAcademicosControl.calendariosAcademicosVisor.maxCortes = valor[0].maxCortes;
                    appConstant.CERRAR_SWAL();
                });
            });
        }

        var refreshTabla = function counter() {
            calendariosAcademicosControl.counter = calendariosAcademicosControl.counter + appGenericConstant.UNO;
            if (calendariosAcademicosControl.counter === 10) {
                calendarioAcademicoServices.buscarCalendarioAcademicos().then(function (data) {
                    calendarioAcademicoServices.buscarMaximoCortes().then(function (valor) {
                        calendariosAcademicosControl.listaAuxiliarCalendario = [];
                        calendariosAcademicosControl.listaCalendarioAcademico = [];
                        for (var e = 0; e < data.length; e++) {
                            calendariosAcademicosControl.listaAuxiliarCalendario = {
                                id: data[e].id,
                                codigoCalendario: data[e].codigoCalendario,
                                nombreCalendario: data[e].nombreCalendario,
                                idEstadoCalendario: data[e].idEstadoCalendario,
                                nombreEstadoCalendario: data[e].nombreEstadoCalendario,
                                nombreModalidad: data[e].nombreModalidad,
                                idModalidad: data[e].idModalidad,
                                idPeriodoAcademico: data[e].periodoAcademico.id,
                                nombrePeriodoAcademico: data[e].periodoAcademico.nombrePeriodoAcademico,
                                calendarioDetalleDTO: data[e].calendarioDetalleDTO

                            };
                            calendariosAcademicosControl.listaCalendarioAcademico.push(calendariosAcademicosControl.listaAuxiliarCalendario);
                        }
                        calendariosAcademicosControl.calendariosAcademicosVisor.maxCortes = valor[0].maxCortes;
                        appConstant.CERRAR_SWAL();
                    });
                    calendariosAcademicosControl.counter = 0;
                });
            }
        };

        // //

        calendariosAcademicosControl.cancelarInterval = function () {
            //
        };

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                calendariosAcademicosControl.listaEstados = data;
            });
        }
        function onConsultarPeriodosAcademicos() {
            calendarioAcademicoServices.buscarPeriodosAcademicos().then(function (data) {

                calendariosAcademicosControl.periodosAcademicos = data;
            });

        }
        function onConsultarListaModalidades() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                calendariosAcademicosControl.listaModalidades = data;
            });
        }

        calendariosAcademicosControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarCalendario)) {
                calendariosAcademicosControl.onNewRegistryCalendariosAcademicos();
                new ValidationService().resetForm($scope.formAgregarCalendario);
                new ValidationService().resetForm($scope.formAgregarConfiguracion);
            }
        };
        calendariosAcademicosControl.onLimpiarRegistro = function () {

            calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitar = false;
            calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCodigos = false;
            calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCampoEstado = true;
            calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarValidacion = ' ';
            calendariosAcademicosControl.calendariosAcademicosVisor.titulo = appGenericConstant.AGREGAR_CALENDARIO_ACADEMICO;
            calendariosAcademicosControl.calendariosAcademicosVisor.maxCortes = 3;
            calendariosAcademicosControl.calendarioAcademicosEntity.codigo = '';
            calendariosAcademicosControl.calendarioAcademicosEntity.periodoAcademico = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.nombreCalendario = '';
            calendariosAcademicosControl.calendarioAcademicosEntity.registroCalificado = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.estado = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.id = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.modalidad = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.fechaCohorte = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.fechaResolucion = null;
            calendariosAcademicosControl.calendarioAcademicosEntity.calendario = null;


            localStorageService.remove('calendariosAcademicos');
            localStorageService.remove('status');
            localStorageService.set('status', calendariosAcademicosControl.calendariosAcademicosVisor);
            $location.path('/calendario-academico');
        };

        calendariosAcademicosControl.onNewRegistryCalendariosAcademicos = function () {
            if (calendariosAcademicosControl.calendarioAcademicosEntity.id === null || calendariosAcademicosControl.calendarioAcademicosEntity.id === appGenericConstant.INDEFINIDO) {
                var newCalendariosAcademicos =
                        {
                            id: null,
                            codigoCalendario: appConstant.VALIDAR_STRING(calendariosAcademicosControl.calendarioAcademicosEntity.codigo),
                            nombreCalendario: appConstant.VALIDAR_STRING(calendariosAcademicosControl.calendarioAcademicosEntity.nombreCalendario),
                            idEstadoCalendario: 48,
                            idModalidad: calendariosAcademicosControl.calendarioAcademicosEntity.modalidad,
                            idPeriodoAcademico: calendariosAcademicosControl.calendarioAcademicosEntity.periodoAcademico,
                            calendarioDetalleDTO: convertirFechas(calendariosAcademicosControl.calendarioAcademicosEntity.calendario)
                        };

                if (newCalendariosAcademicos.calendarioDetalleDTO !== null) {
                    calendarioAcademicoServices.agregarCalendariosAcademicos(newCalendariosAcademicos).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            calendariosAcademicosControl.onLimpiarRegistro();

                        } else if (data.tipo === 409) {
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);

                        } else {
                            MSG_GROWL_ERROR();

                        }

                    });
                }
            } else {
                var updateCalendariosAcademicos = {
                    id: calendariosAcademicosControl.calendarioAcademicosEntity.id,
                    codigoCalendario: appConstant.VALIDAR_STRING(calendariosAcademicosControl.calendarioAcademicosEntity.codigo),
                    nombreCalendario: appConstant.VALIDAR_STRING(calendariosAcademicosControl.calendarioAcademicosEntity.nombreCalendario),
                    idEstadoCalendario: calendariosAcademicosControl.calendarioAcademicosEntity.estado,
                    idModalidad: calendariosAcademicosControl.calendarioAcademicosEntity.modalidad,
                    idPeriodoAcademico: calendariosAcademicosControl.calendarioAcademicosEntity.periodoAcademico,
                    calendarioDetalleDTO: convertirFechas(calendariosAcademicosControl.calendarioAcademicosEntity.calendario)
                };
                if (updateCalendariosAcademicos.calendarioDetalleDTO !== null) {
                    calendarioAcademicoServices.actualizarCalendarioAcademicos(updateCalendariosAcademicos).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                        } else if (data.tipo === 500) {
                            MSG_GROWL_ERROR();
                        } else {
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        }
                    });
                }
            }
        };

        function onConsultarMaximoNivel() {
            programasAcademicosEntitiesServices.buscarMaximoNivel().then(function (valor) {
                calendariosAcademicosControl.maximoNivel = valor[0].maxNivel;
            });
        }
        calendariosAcademicosControl.onClickToView = function (item) {
            calendarioAcademicoServices.buscarMaximoCortes().then(function (valor) {
                calendarioAcademicoServices.buscarCalendarioDetalle(item).then(function (data) {
                    calendariosAcademicosControl.calendariosAcademicosVisor.titulo = appGenericConstant.VER_CALENDARIO_ACADEMICO;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitar = true;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCodigos = true;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCampoEstado = false;
                    calendariosAcademicosControl.calendarioAcademicosEntity.codigo = item.codigoCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.nombreCalendario = item.nombreCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.estado = item.idEstadoCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.modalidad = item.idModalidad;
                    calendariosAcademicosControl.calendarioAcademicosEntity.periodoAcademico = item.idPeriodoAcademico;
                    calendariosAcademicosControl.calendariosAcademicosVisor.maxCortes = valor[0].maxCortes;
                    calendariosAcademicosControl.calendarioAcademicosEntity.calendario = revertirFechas(data);
                    localStorageService.set('calendariosAcademicos', calendariosAcademicosControl.calendarioAcademicosEntity);
                    localStorageService.set('status', calendariosAcademicosControl.calendariosAcademicosVisor);
                    $location.path('/gestion-calendario-academico');
                });
            });
        };

        calendariosAcademicosControl.onClickToEditar = function (item) {
            calendarioAcademicoServices.buscarMaximoCortes().then(function (valor) {
                calendarioAcademicoServices.buscarCalendarioDetalle(item).then(function (data) {
                    calendariosAcademicosControl.calendariosAcademicosVisor.titulo = appGenericConstant.MODIFICAR_CALENDARIO_ACADEMICO;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitar = false;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCodigos = true;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarCampoEstado = false;
                    calendariosAcademicosControl.calendariosAcademicosVisor.onDeshabilitarValidacion = 'required';
                    calendariosAcademicosControl.calendarioAcademicosEntity.id = item.id;
                    calendariosAcademicosControl.calendarioAcademicosEntity.codigo = item.codigoCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.nombreCalendario = item.nombreCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.estado = item.idEstadoCalendario;
                    calendariosAcademicosControl.calendarioAcademicosEntity.modalidad = item.idModalidad;
                    calendariosAcademicosControl.calendarioAcademicosEntity.periodoAcademico = item.idPeriodoAcademico;
                    calendariosAcademicosControl.calendariosAcademicosVisor.maxCortes = valor[0].maxCortes;
                    calendariosAcademicosControl.calendarioAcademicosEntity.calendario = revertirFechas(data);
                    localStorageService.set('calendariosAcademicos', calendariosAcademicosControl.calendarioAcademicosEntity);
                    localStorageService.set('status', calendariosAcademicosControl.calendariosAcademicosVisor);
                    $location.path('/gestion-calendario-academico');
                });
            });
        };

        calendariosAcademicosControl.eliminarDetalle = function (item) {
            calendarioAcademicoServices.eliminarDetalleCalendario(item).then(function (response) {
                if (response.tipo === 200) {
                    appConstant.MSG_GROWL_OK(response.message);
                    appConstant.CERRAR_SWAL();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                    appConstant.CERRAR_SWAL();
                }
            });
        };

        calendariosAcademicosControl.onClickToDelete = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PROGRAMA_ACADEMICO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                swal(
                        'Calendario Académico Eliminado',
                        'El programa académico ha sido eliminado satisfactoriamente.',
                        appGenericConstant.SUCCESS
                        );
                calendarioAcademicoServices.eliminarCalendariosAcademicos(item).then(function (response) {
                    switch (response) {
                        case 200:
                            swal('Calendarios Académicos Eliminados',
                                    'Los programas académicos han sido eliminados satisfactoriamente.',
                                    appGenericConstant.SUCCESS);
                            break;
                        case 500:
                            swal('¡Hubo un problema!',
                                    'no se pudo realizar el proceso debido a un error interno del sistema',
                                    'error');
                            break;
                        default:
                            swal('¡Hubo un problema!',
                                    'Algunos programas académicos no pudieron ser eliminados.',
                                    appGenericConstant.WARNING);
                            break;
                    }
                    calendariosAcademicosControl.report.selected.length = null;
                    onConsultarCalendarios();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    calendariosAcademicosControl.report.selected.length = null;
                }
            });
        };

        calendariosAcademicosControl.onClickToDeleteMasivo = function () {
            var listaElementosEliminar = [];
            swal({
                title: '¿Estás seguro que deseas eliminar estos programas académicos?',
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    swal(
                            appGenericConstant.CALENDARIO_ACADEMICO_ELIMINADO,
                            'Los programas académicos han sido eliminados satisfactoriamente.',
                            'success'
                            );
                    angular.forEach(calendariosAcademicosControl.report.selected, function (value, key) {
                        var eliminadoMasv = {
                            id: value.id
                        };
                        listaElementosEliminar.push(eliminadoMasv);
                    });
                    calendarioAcademicoServices.eliminarCalendariosAcademicosMasivo(listaElementosEliminar).then(function (response) {
                        switch (response) {
                            case 200:
                                swal(appGenericConstant.CALENDARIO_ACADEMICO_ELIMINADO,
                                        'Los programas académicos han sido eliminados satisfactoriamente.',
                                        appGenericConstant.SUCCESS);
                                break;
                            case 500:
                                swal('¡Hubo un problema!',
                                        'no se pudo realizar el proceso debido a un error interno del sistema',
                                        'error');
                                break;
                            default:
                                swal('¡Hubo un problema!',
                                        'Algunos programas académicos no pudieron ser eliminados.',
                                        appGenericConstant.WARNING);
                                break;
                        }
                        calendariosAcademicosControl.report.selected.length = null;
                        onConsultarCalendarios();
                    });
                }
            });
        };

        calendariosAcademicosControl.dataPikerRange = function (fecha, id) {
            $('.input-group .date input#' + id).val(fecha);
            $('.input-group .date').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                todayBtn: "linked",
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                }
            });
            $('#' + id).datepicker('update');
        };

        calendariosAcademicosControl.onFocus = function (idCampo) {
            fecha = $(idCampo).val();
        };

        calendariosAcademicosControl.onBlur = function (idCampo) {
            $(idCampo).val(fecha);
        };

        onConsultarCalendarios();
        onConsultarListaEstados();
        onConsultarListaModalidades();
        onConsultarPeriodosAcademicos();
        onConsultarMaximoNivel();

        function toDate(dateStr) {
            if (typeof dateStr === appGenericConstant.INDEFINIDO || dateStr === null) {
                dateStr = null;
                return dateStr;
            } else {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
        function onDate(date) {
            if (typeof date === appGenericConstant.INDEFINIDO || date === null) {
                date = null;
                return date;
            } else {
                var d = new Date(date),
                        month = '' + (d.getMonth() + appGenericConstant.UNO),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                return [day, month, year].join('/');
            }
        }
        function convertirFechas(lista) {
            calendariosAcademicosControl.listaAuxiliarfechas = [];
            calendariosAcademicosControl.fechas = [];
            var conteo = 0;

            if (conteo === 0) {
                for (var e = 0; e < lista.length; e++) {
                    calendariosAcademicosControl.listaAuxiliarfechas = {
                        id: lista[e].id,
                        modulo: lista[e].modulo,
                        idCalendario: calendariosAcademicosControl.calendarioAcademicosEntity.id,
                        fechaInicioCalendario: toDate(lista[e].fechaInicioCalendario),
                        fechaFinCalendario: toDate(lista[e].fechaFinCalendario),
                        fecha1: toDate(lista[e].fecha1),
                        fecha2: toDate(lista[e].fecha2),
                        fecha3: toDate(lista[e].fecha3),
                        fecha4: toDate(lista[e].fecha4),
                        fecha5: toDate(lista[e].fecha5),
                        fecha6: toDate(lista[e].fecha6),
                        fecha7: toDate(lista[e].fecha7),
                        fecha8: toDate(lista[e].fecha8),
                        fecha9: toDate(lista[e].fecha9),
                        fecha10: toDate(lista[e].fecha10)

                    };
                    calendariosAcademicosControl.fechas.push(calendariosAcademicosControl.listaAuxiliarfechas);
                    if (calendariosAcademicosControl.fechas.length > 1) {
                        if (calendariosAcademicosControl.fechas[e].fechaInicioCalendario <= calendariosAcademicosControl.fechas[e - 1].fechaFinCalendario) {
                            appConstant.MSG_GROWL_ADVERTENCIA("La fecha inicio del módulo " + calendariosAcademicosControl.fechas[e].modulo + " no puede ser menor a la fecha fin del módulo " + calendariosAcademicosControl.fechas[e - 1].modulo);
                            conteo = conteo + appGenericConstant.UNO;
                            break;
                        }
                    }

                    if (calendariosAcademicosControl.fechas[e].fechaFinCalendario <= calendariosAcademicosControl.fechas[e].fechaInicioCalendario) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha fin del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe ser mayor a la fecha inicio.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha1 < calendariosAcademicosControl.fechas[e].fechaInicioCalendario) || (calendariosAcademicosControl.fechas[e].fecha1 > calendariosAcademicosControl.fechas[e].fechaFinCalendario)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 1 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe estar entre la fecha inicial y la fecha final.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha2 < calendariosAcademicosControl.fechas[e].fechaInicioCalendario) || (calendariosAcademicosControl.fechas[e].fecha2 > calendariosAcademicosControl.fechas[e].fechaFinCalendario)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 2 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe estar entre la fecha inicial y la fecha final.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha3 < calendariosAcademicosControl.fechas[e].fechaInicioCalendario) || (calendariosAcademicosControl.fechas[e].fecha3 > calendariosAcademicosControl.fechas[e].fechaFinCalendario)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 3 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe estar entre la fecha inicial y la fecha final.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha1 > calendariosAcademicosControl.fechas[e].fecha2) || (calendariosAcademicosControl.fechas[e].fecha1 > calendariosAcademicosControl.fechas[e].fecha3)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 1 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe ser menor que la fecha parcial 2 y la fecha parcial 3.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha2 < calendariosAcademicosControl.fechas[e].fecha1)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 2 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe ser mayor que la fecha parcial 1.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;

                    } else if (calendariosAcademicosControl.fechas[e].fecha2 > calendariosAcademicosControl.fechas[e].fecha3) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 2 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe ser menor que la fecha parcial 3.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                    if ((calendariosAcademicosControl.fechas[e].fecha3 < calendariosAcademicosControl.fechas[e].fecha1) || (calendariosAcademicosControl.fechas[e].fecha3 < calendariosAcademicosControl.fechas[e].fecha2)) {
                        appConstant.MSG_GROWL_ADVERTENCIA("La fecha parcial 1 del módulo " + calendariosAcademicosControl.fechas[e].modulo + " debe ser menor que la fecha parcial 2 y la fecha parcial 3.");
                        conteo = conteo + appGenericConstant.UNO;
                        break;
                    }
                }

            }
            if (conteo === appGenericConstant.CERO) {
                return calendariosAcademicosControl.fechas;
            } else {
                return null;
            }
        }
        function revertirFechas(lista) {
            calendariosAcademicosControl.listaAuxiliarfechas = [];
            calendariosAcademicosControl.fechas = [];
            for (var e = 0; e < lista.length; e++) {
                calendariosAcademicosControl.listaAuxiliarfechas = {
                    id: lista[e].id,
                    modulo: lista[e].modulo,
                    idCalendario: lista[e].calendarioAcademico.id,
                    fechaInicioCalendario: onDate(lista[e].fechaInicioCalendario),
                    fechaFinCalendario: onDate(lista[e].fechaFinCalendario),
                    fecha1: onDate(lista[e].fecha1),
                    fecha2: onDate(lista[e].fecha2),
                    fecha3: onDate(lista[e].fecha3),
                    fecha4: onDate(lista[e].fecha4),
                    fecha5: onDate(lista[e].fecha5),
                    fecha6: onDate(lista[e].fecha6),
                    fecha7: onDate(lista[e].fecha7),
                    fecha8: onDate(lista[e].fecha8),
                    fecha9: onDate(lista[e].fecha9),
                    fecha10: onDate(lista[e].fecha10)
                };
                calendariosAcademicosControl.fechas.push(calendariosAcademicosControl.listaAuxiliarfechas);
            }
            return calendariosAcademicosControl.fechas;

        }

        calendariosAcademicosControl.addUser = function () {
            calendariosAcademicosControl.inserted = {
                id: null,
                modulo: "",
                idCalendario: null,
                fechaInicioCalendario: null,
                fechaFinCalendario: null,
                fecha1: null,
                fecha2: null,
                fecha3: null,
                fecha4: null,
                fecha5: null,
                fecha6: null,
                fecha7: null,
                fecha8: null,
                fecha9: null,
                fecha10: null
            };
            calendariosAcademicosControl.calendarioAcademicosEntity.calendario.push(calendariosAcademicosControl.inserted);

        };
        calendariosAcademicosControl.groups = [];
        calendariosAcademicosControl.loadGroups = function () {
            return calendariosAcademicosControl.groups.length ? null : $http.get('/groups').success(function (data) {
                calendariosAcademicosControl.groups = data;
            });
        };

        calendariosAcademicosControl.saveUser = function (data, id) {
            angular.extend(data, {id: id});
            return $http.post('/saveUser', data);
        };

        calendariosAcademicosControl.removeUser = function (index) {
            calendariosAcademicosControl.calendarioAcademicosEntity.calendario.splice(index, 1);
        };
    }
})();