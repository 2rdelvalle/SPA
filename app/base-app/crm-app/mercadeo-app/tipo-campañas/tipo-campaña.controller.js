(function () {
    'use strict';
    angular.module('mytodoApp').controller('TipoCampaniasCtrl', TipoCampaniasCtrl);

    TipoCampaniasCtrl.$inject = ['$scope', 'tipoCampaniasServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices','appConstant', 'appGenericConstant'];
    function TipoCampaniasCtrl($scope, tipoCampaniasServices, $location, growl, ValidationService, localStorageService, utilServices,appConstant, appGenericConstant) {

        var gestionTipoCampania = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionTipoCampania.disable = false;
        gestionTipoCampania.tiposCampanias = [];
        gestionTipoCampania.listaEstados = [];
        gestionTipoCampania.display;
        gestionTipoCampania.tipoCampania = tipoCampaniasServices.tipoCampania;
        gestionTipoCampania.tipoCampaniaAuxiliar = tipoCampaniasServices.tipoCampaniaAuxiliar;
        gestionTipoCampania.options = appConstant.FILTRO_TABLAS;
        gestionTipoCampania.selectedOption = gestionTipoCampania.options[0];
        gestionTipoCampania.report = {
            selected: null
        };

        if (localStorageService.get('tipoCampania') !== null) {
            gestionTipoCampania.tipoCampania = localStorageService.get('tipoCampania');
        }
        if (localStorageService.get('tipoCampaniaAuxiliar') !== null) {
            gestionTipoCampania.tipoCampaniaAuxiliar = localStorageService.get('tipoCampaniaAuxiliar');
        }

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO','crm').then(function (data) {
                gestionTipoCampania.listaEstados = data;
            });
        }

        /*Consultar Recursos Educativos*/
        function onBuscarTiposCampanias() {
            tipoCampaniasServices.buscarTipoCampania().then(function (data) {
                gestionTipoCampania.tiposCampanias = data;
                if (gestionTipoCampania.tiposCampanias.length === 0) {
                    gestionTipoCampania.disable = true;
                }
            });
        }

        /*Limpiar Entidad Recursos Educativos*/
        function onLimpiar() {
            gestionTipoCampania.tipoCampania.id = null;
            gestionTipoCampania.tipoCampania.codigo = '';
            gestionTipoCampania.tipoCampania.nombre = '';
            gestionTipoCampania.tipoCampania.descripcion = '';
            gestionTipoCampania.tipoCampania.estado = '';
        }

        /*Metodo Para Limpiar La Entidad Desde La Vista*/
        gestionTipoCampania.onClickToAddTipoCampania = function () {
            onLimpiar();
            gestionTipoCampania.tipoCampaniaAuxiliar.noEstado = false;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableVerDetalle = false;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableCodigo = false;
            gestionTipoCampania.tipoCampaniaAuxiliar.titulo = appGenericConstant.AGREGAR;
            localStorageService.set('tipoCampania', {});
            localStorageService.set('tipoCampaniaAuxiliar', gestionTipoCampania.tipoCampaniaAuxiliar);
            $location.path('/gestion-tipo-campania');
            new ValidationService().resetForm($scope.formCrudTipoCampania);
        };

        /*Acción Para Validar, Guargar o Editar Recursos Educativos*/
        gestionTipoCampania.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudTipoCampania)) {
                var tipoCampaniaLocalStorage = localStorageService.get('tipoCampania');
                tipoCampaniasServices.buscarTipoCampaniaByCodigo(gestionTipoCampania.tipoCampania).then(function (data) {
                    if (gestionTipoCampania.tipoCampania.id !== null || gestionTipoCampania.tipoCampania.id !== undefined) {
                        if (tipoCampaniaLocalStorage.codigo === gestionTipoCampania.tipoCampania.codigo) {
                            data = [];
                        }
                    }
                    if (typeof data === 'object' && data.length === 0) {
                        tipoCampaniasServices.buscarTipoCampaniaByNombre(gestionTipoCampania.tipoCampania).then(function (datas) {
                            if (gestionTipoCampania.tipoCampania.id === null || gestionTipoCampania.tipoCampania.id === undefined) {
                                if (typeof datas === 'object' && datas.length === 0) {
                                    gestionTipoCampania.onAddTipoCampania();
                                    new ValidationService().resetForm($scope.formCrudTipoCampania);
                                } else {
                                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NOMBRE_REGISTRO_EXISTE);
                                }
                            } else {
                                if (tipoCampaniaLocalStorage.nombre === gestionTipoCampania.tipoCampania.nombre) {
                                    datas = [];
                                }
                                if (typeof datas === 'object' && datas.length === 0) {
                                    gestionTipoCampania.onUpdateTipoCampania();
                                } else {
                                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NOMBRE_REGISTRO_EXISTE);
                                }
                            }
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                    }
                });
            }
        }
            ;

        gestionTipoCampania.onAddTipoCampania = function () {
            var tipoC = {
                codigo: gestionTipoCampania.tipoCampania.codigo.toUpperCase(),
                nombre: gestionTipoCampania.tipoCampania.nombre.toUpperCase(),
                descripcion: gestionTipoCampania.tipoCampania.descripcion,
                estado: 'ACTIVO'
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            tipoCampaniasServices.agregarTipoCampania(tipoC).then(function (data) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                onLimpiar();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        /*Método Para Obtener El  Recurso Educativo A Editar*/
        gestionTipoCampania.onClickToUpdateTipoCampania = function (item) {
            onLimpiar();
            gestionTipoCampania.tipoCampaniaAuxiliar.noEstado = true;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableVerDetalle = false;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableCodigo = true;
            gestionTipoCampania.tipoCampaniaAuxiliar.titulo = appGenericConstant.MODIFICAR;
            gestionTipoCampania.tipoCampania.id = item.id;
            gestionTipoCampania.tipoCampania.codigo = item.codigo;
            gestionTipoCampania.tipoCampania.nombre = item.nombre;
            gestionTipoCampania.tipoCampania.descripcion = item.descripcion;
            gestionTipoCampania.tipoCampania.estado = item.estado;
            $location.path('/gestion-tipo-campania');
            localStorageService.set('tipoCampania', gestionTipoCampania.tipoCampania);
            localStorageService.set('tipoCampaniaAuxiliar', gestionTipoCampania.tipoCampaniaAuxiliar);
        };


        /*Acción Para Validar Y Modificar Recursos Educativos*/
        gestionTipoCampania.onUpdateTipoCampania = function () {
            var tipoC = {
                id: gestionTipoCampania.tipoCampania.id,
                codigo: gestionTipoCampania.tipoCampania.codigo,
                nombre: gestionTipoCampania.tipoCampania.nombre.toUpperCase(),
                descripcion: gestionTipoCampania.tipoCampania.descripcion,
                estado: gestionTipoCampania.tipoCampania.estado
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            tipoCampaniasServices.actualizarTipoCampania(tipoC).then(function (data) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);

                gestionTipoCampania.tipoCampania.id = tipoC.id;
                gestionTipoCampania.tipoCampania.codigo = tipoC.codigo;
                gestionTipoCampania.tipoCampania.nombre = tipoC.nombre;
                gestionTipoCampania.tipoCampania.descripcion = tipoC.descripcion;
                gestionTipoCampania.tipoCampania.estado = tipoC.estado;

                localStorageService.set('tipoCampania', gestionTipoCampania.tipoCampania);
                localStorageService.set('tipoCampaniaAuxiliar', gestionTipoCampania.tipoCampaniaAuxiliar);
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                MSG_GROWL_ERROR();
                return;
            });
        };

        gestionTipoCampania.onClickToVerMasTipoCampania = function (item) {
            onLimpiar();
            gestionTipoCampania.tipoCampaniaAuxiliar.noEstado = true;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableVerDetalle = true;
            gestionTipoCampania.tipoCampaniaAuxiliar.disableCodigo = true;
            gestionTipoCampania.tipoCampaniaAuxiliar.titulo = appGenericConstant.DETALLE;
            gestionTipoCampania.tipoCampania.id = item.id;
            gestionTipoCampania.tipoCampania.codigo = item.codigo;
            gestionTipoCampania.tipoCampania.nombre = item.nombre;
            gestionTipoCampania.tipoCampania.descripcion = item.descripcion;
            gestionTipoCampania.tipoCampania.estado = item.estado;
            $location.path('/gestion-tipo-campania');
            localStorageService.set('tipoCampania', gestionTipoCampania.tipoCampania);
            localStorageService.set('tipoCampaniaAuxiliar', gestionTipoCampania.tipoCampaniaAuxiliar);
        };

        gestionTipoCampania.onDeleteTipoCampania = function (item) {
            gestionTipoCampania.report.selected = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_TIPO_CAMPAÑA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_TIPO_CAMPAÑA);
                appConstant.CARGANDO();
                setTimeout(function () {
                    var tipoC = {
                        id: item.id,
                        codigo: item.codigo,
                        nombre: item.nombre,
                        descripcion: item.descripcion,
                        estado: item.estado
                    };
                    tipoCampaniasServices.eliminarTipoCampania(tipoC).then(function (data) {
                        if (data.tipo === 200) {
                            swal(appGenericConstant.TIPO_CAMPAÑA_ELIMINADO,
                                appGenericConstant.TIPO_CAMPAÑA_ELIMINADO_SATIS,
                                appGenericConstant.SUCCESS);
                            onLimpiar();
                            //                                gestionTipoCampania.report.selected.length = null;
                            onBuscarTiposCampanias();
                        } else if (data.tipo === 409) {
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.TIPO_CAMPAÑA_NO_ELIMNADO,
                                appGenericConstant.WARNING);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });

                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionTipoCampania.report.selected.length = null;
                }
            });
        };


        gestionTipoCampania.onDeleteMasivoTipoCampania = function () {
            var listaEliminados = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_TIPOS_CAMPAÑAS,
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
                    angular.forEach(gestionTipoCampania.report.selected, function (value, key) {
                        listaEliminados.push(value.id);
                    });
                    tipoCampaniasServices.eliminarMasivoTipoCampania(listaEliminados).then(function (data) {
                        onLimpiar();
                        gestionTipoCampania.report.selected.length = null;
                        onBuscarTiposCampanias();
                    }).catch(function (e) {
                        swal(appGenericConstant.ALTO_AHI,
                            appGenericConstant.ALGUNOS_TIPO_CAMPAÑA,
                            appGenericConstant.WARNING);
                        return;
                    });
                    swal(appGenericConstant.TIPOS_CAMPAÑAS_ELIMINADOS,
                        appGenericConstant.TIPOS_CAMPAÑAS_ELIMINADOS_SATIS, appGenericConstant.SUCCESS);
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionTipoCampania.report.selected.length = null;
                    onBuscarTiposCampanias();
                }
            });
        };
        onBuscarTiposCampanias();
        onConsultarListaEstados();
    }
})();