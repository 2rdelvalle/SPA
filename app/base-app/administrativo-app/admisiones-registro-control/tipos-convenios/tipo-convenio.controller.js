(function () {
    'use strict';
    angular.module('mytodoApp').controller('TipoConvenioCtrl', TipoConvenioCtrl);

    TipoConvenioCtrl.$inject = ['$scope', 'tiposConveniosServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'appConstant', '$interval', 'appGenericConstant'];
    function TipoConvenioCtrl($scope, tiposConveniosServices, $location, growl, ValidationService, localStorageService, appConstant, $interval, appGenericConstant) {

        var gestionTipoConvenio = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionTipoConvenio.listFont = ['Verdana', 'Arial', 'Arial Black', 'Arial Narrow', 'Courier New', 'Century Gothic', 'Comic Sans MS', 'Georgia', 'Impact', 'Tahoma', 'Times', 'Times New Roman', 'Webdings', 'Trebuchet MS'];
        gestionTipoConvenio.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
        ];
        gestionTipoConvenio.tiposConvenios = [];
        gestionTipoConvenio.display;
        gestionTipoConvenio.selectTodos = false;
        gestionTipoConvenio.filtrados = [];
        gestionTipoConvenio.mensajeValidacion = true;
        gestionTipoConvenio.tipoConvenio = tiposConveniosServices.tipoConvenio;
        gestionTipoConvenio.tipoConvenioAuxiliar = tiposConveniosServices.tipoConvenioAuxiliar;
        gestionTipoConvenio.mensajePrueba = "holamundo";
        gestionTipoConvenio.options = appConstant.FILTRO_TABLAS;
        gestionTipoConvenio.selectedOption = gestionTipoConvenio.options[0];
        gestionTipoConvenio.report = {
            selected: null
        };
        gestionTipoConvenio.counter = 0;
        /*Metodo para obtener lo filtrados*/
        gestionTipoConvenio.obtenerFiltrados = function (filtrados) {
            gestionTipoConvenio.filtrados = filtrados;
            if (gestionTipoConvenio.filtrados.length === 0) {
                gestionTipoConvenio.selectTodos = false;
                gestionTipoConvenio.report.selected.length = null;
            }
        };
        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionTipoConvenio.onSelectTodos = function () {
            if (gestionTipoConvenio.selectTodos === true) {
                gestionTipoConvenio.report.selected = gestionTipoConvenio.filtrados.slice();
            } else {
                gestionTipoConvenio.report.selected.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionTipoConvenio.onSelectTodosTable = function (clase) {
            if (gestionTipoConvenio.report.selected.length === gestionTipoConvenio.filtrados.length
                && gestionTipoConvenio.selectTodos === true) {
                gestionTipoConvenio.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionTipoConvenio.report.selected.length + 1 === gestionTipoConvenio.filtrados.length
                        && gestionTipoConvenio.selectTodos === false) {
                        gestionTipoConvenio.selectTodos = true;
                    }
                } else {
                    gestionTipoConvenio.selectTodos = false;
                }
            }
        };
        if (localStorageService.get('tipoConvenio') !== null) {
            gestionTipoConvenio.tipoConvenio = localStorageService.get('tipoConvenio');
        }
        if (localStorageService.get('tipoConvenioAuxiliar') !== null) {
            gestionTipoConvenio.tipoConvenioAuxiliar = localStorageService.get('tipoConvenioAuxiliar');
        }


        /*Consultar Períodos Académicos*/
        function onBuscarTiposConvenios() {
            gestionTipoConvenio.counter = 0
            gestionTipoConvenio.tiposConvenios = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            tiposConveniosServices.buscarTiposConvenios().then(function (data) {
                gestionTipoConvenio.tiposConvenios = data;
                appConstant.CERRAR_SWAL();
            });
        }

        var refreshTabla = function counter() {
            gestionTipoConvenio.counter = gestionTipoConvenio.counter + 1;
            if (gestionTipoConvenio.counter === 10) {
                tiposConveniosServices.buscarTiposConvenios().then(function (data) {
                    gestionTipoConvenio.tiposConvenios = data;
                    gestionTipoConvenio.counter = 0;
                });
            }
        }

        // //

        gestionTipoConvenio.cancelarInterval = function () {
            //
        }

        /*Limpiar Entidad Períodos Académicos*/
        function onLimpiar() {
            gestionTipoConvenio.tipoConvenio.id = null;
            gestionTipoConvenio.tipoConvenio.codigoTipoConvenio = '';
            gestionTipoConvenio.tipoConvenio.nombreTipoConvenio = '';
            gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio = '';
            localStorageService.remove('tipoConvenio');
            localStorageService.set('tipoConvenio', tiposConveniosServices.tipoConvenio);
        }

        /*Metodo Para Limpiar La Entidad Desde La Vista*/
        gestionTipoConvenio.onClickToAddTipoConvenio = function () {
            onLimpiar();
            gestionTipoConvenio.tipoConvenioAuxiliar.disableVerDetalle = false;
            gestionTipoConvenio.tipoConvenioAuxiliar.disableCodigo = false;
            gestionTipoConvenio.tipoConvenioAuxiliar.titulo = appGenericConstant.AGREGAR;
            localStorageService.set('tipoConvenio', tiposConveniosServices.tipoConvenio);
            localStorageService.set('tipoConvenioAuxiliar', gestionTipoConvenio.tipoConvenioAuxiliar);
            $location.path('/tipo-convenio-cud');
            new ValidationService().resetForm($scope.formCrudTipoConvenio);
        };
        /*Acción Para Validar, Guargar o Editar Períodos Académicos*/
        gestionTipoConvenio.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudTipoConvenio)) {
                if (gestionTipoConvenio.tipoConvenio.id === null || gestionTipoConvenio.tipoConvenio.id === undefined) {
                    gestionTipoConvenio.onAddTipoConvenio();
                    new ValidationService().resetForm($scope.formCrudTipoConvenio);
                } else {
                    if (localStorageService.get('tipoConvenio').codigoTipoConvenio !== gestionTipoConvenio.tipoConvenio.codigoTipoConvenio
                        || localStorageService.get('tipoConvenio').nombreTipoConvenio !== gestionTipoConvenio.tipoConvenio.nombreTipoConvenio
                        || localStorageService.get('tipoConvenio').descripcionTipoConvenio !== gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio) {
                        gestionTipoConvenio.onUpdateTipoConvenio();
                    }
                }
            }
        };
        gestionTipoConvenio.onAddTipoConvenio = function () {
            var tipoCon = {
                codigoTipoConvenio: appConstant.VALIDAR_STRING(gestionTipoConvenio.tipoConvenio.codigoTipoConvenio),
                nombreTipoConvenio: appConstant.VALIDAR_STRING(gestionTipoConvenio.tipoConvenio.nombreTipoConvenio),
                descripcionTipoConvenio: gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio,
                estado: 'ACTIVO'
            };
            tiposConveniosServices.agregarTipoConvenio(tipoCon).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    onLimpiar();
                } else if (data.tipo === 409) {
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 400) {
                    MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                } else {
                    MSG_GROWL_ERROR();
                }
            });
        };
        /*Método Para Obtener El  Período Académico A Editar*/
        gestionTipoConvenio.onClickToUpdateTipoConvenio = function (item) {
            onLimpiar();
            gestionTipoConvenio.tipoConvenioAuxiliar.disableVerDetalle = false;
            gestionTipoConvenio.tipoConvenioAuxiliar.disableCodigo = true;
            gestionTipoConvenio.tipoConvenioAuxiliar.titulo = appGenericConstant.MODIFICAR;
            gestionTipoConvenio.tipoConvenio.id = item.id;
            gestionTipoConvenio.tipoConvenio.codigoTipoConvenio = item.codigoTipoConvenio;
            gestionTipoConvenio.tipoConvenio.nombreTipoConvenio = item.nombreTipoConvenio;
            gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio = item.descripcionTipoConvenio;
            $location.path('/tipo-convenio-cud');
            localStorageService.set('tipoConvenio', gestionTipoConvenio.tipoConvenio);
            localStorageService.set('tipoConvenioAuxiliar', gestionTipoConvenio.tipoConvenioAuxiliar);
        };
        /*Acción Para Validar Y Modificar Periodo Academico*/
        gestionTipoConvenio.onUpdateTipoConvenio = function () {
            var tipoCon = {
                id: gestionTipoConvenio.tipoConvenio.id,
                codigoTipoConvenio: appConstant.VALIDAR_STRING(gestionTipoConvenio.tipoConvenio.codigoTipoConvenio),
                nombreTipoConvenio: appConstant.VALIDAR_STRING(gestionTipoConvenio.tipoConvenio.nombreTipoConvenio),
                descripcionTipoConvenio: gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio,
                estado: 'ACTIVO'
            };
            tiposConveniosServices.actualizarTipoConvenio(tipoCon).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('tipoConvenio', gestionTipoConvenio.tipoConvenio);
                    localStorageService.set('tipoConvenioAuxiliar', gestionTipoConvenio.tipoConvenioAuxiliar);
                } else if (data.tipo === 409) {
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 400) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                } else {
                    MSG_GROWL_ERROR();
                }
            });
        };
        /*Método Para Obtener El  Período Académico A Ver Detalle*/
        gestionTipoConvenio.onClickToVerDetalleTipoConvenio = function (item) {
            onLimpiar();
            gestionTipoConvenio.tipoConvenioAuxiliar.disableVerDetalle = true;
            gestionTipoConvenio.tipoConvenioAuxiliar.disableCodigo = true;
            gestionTipoConvenio.tipoConvenioAuxiliar.titulo = appGenericConstant.DETALLE;
            gestionTipoConvenio.tipoConvenio.id = item.id;
            gestionTipoConvenio.tipoConvenio.codigoTipoConvenio = item.codigoTipoConvenio;
            gestionTipoConvenio.tipoConvenio.nombreTipoConvenio = item.nombreTipoConvenio;
            gestionTipoConvenio.tipoConvenio.descripcionTipoConvenio = item.descripcionTipoConvenio;
            $location.path('/tipo-convenio-cud');
            localStorageService.set('tipoConvenio', gestionTipoConvenio.tipoConvenio);
            localStorageService.set('tipoConvenioAuxiliar', gestionTipoConvenio.tipoConvenioAuxiliar);
        };
        gestionTipoConvenio.onDeleteTipoConvenio = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_TIPOCONVENIO,
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
                    tiposConveniosServices.eliminarTipoConvenio(item).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.CERRAR_SWAL();
                            swal(appGenericConstant.TIPOCONVENIO_ELIMINADO,
                                appGenericConstant.TIPOCONVENIO_ELIMINADO_SATIS,
                                appGenericConstant.SUCCESS);
                            onLimpiar();
                            gestionTipoConvenio.report.selected.length = null;
                            onBuscarTiposConvenios();
                            gestionTipoConvenio.selectTodos = false;
                        } else if (data.tipo === 400) {
                            appConstant.CERRAR_SWAL();
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.REGISTRO_UTILIZADO,
                                appGenericConstant.WARNING);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionTipoConvenio.report.selected.length = null;
                    gestionTipoConvenio.selectTodos = false;
                }
            });
        };
        gestionTipoConvenio.onDeleteMasivoTiposConvenios = function () {
            gestionTipoConvenio.listNoEliminados = [];
            gestionTipoConvenio.listaTiposConveniosId = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_TIPOCONVENIOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    angular.forEach(gestionTipoConvenio.report.selected, function (value, key) {
                        gestionTipoConvenio.listaTiposConveniosId.push(value.id);
                    });
                    tiposConveniosServices.eliminarTiposConvenios(gestionTipoConvenio.listaTiposConveniosId).then(function (data) {
                        if (data.tipo === 200) {
                            onBuscarTiposConvenios();
                            swal(appGenericConstant.TIPOCONVENIOS_ELIMINADOS,
                                appGenericConstant.TIPOCONVENIOS_ELIMINADOS_SATIS,
                                appGenericConstant.SUCCESS);
                            gestionTipoConvenio.report.selected.length = null;
                        } else if (data.tipo === 400) {
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                appGenericConstant.ALGUNOS_REGISTROS,
                                appGenericConstant.WARNING);
                            gestionTipoConvenio.mensajeValidacion = true;
                            gestionTipoConvenio.listNoEliminados = data.objectoList;
                            onBuscarTiposConvenios();
                            gestionTipoConvenio.report.selected.length = null;
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        onBuscarTiposConvenios();
    }
})();