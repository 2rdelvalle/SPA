'use strict';
angular.module('mytodoApp').controller('modulosCtrl', ['$scope', '$location', 'modulosEntitiesService', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', '$filter', 'appGenericConstant', 'appConstantValueList',
    function ($scope, $location, modulosEntitiesService, ValidationService, localStorageService, utilServices, appConstant, $interval, $filter, appGenericConstant, appConstantValueList) {
        var modulosControl = this;
        modulosControl.modulosEntity = modulosEntitiesService.modulos;
        modulosControl.modulosVisor = modulosEntitiesService.modulosAux;
        modulosControl.listaModulos = [];
        modulosControl.listaEstados = [];
        modulosControl.counter = appGenericConstant.CERO;
        modulosControl.modulosEntity.transversal = "NO";

        var config = {};
        if (localStorageService.get('modulos')) {
            var modulos = localStorageService.get('modulos');
            modulosControl.modulosEntity = modulos;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            modulosControl.modulosVisor = status;
        }

        modulosControl.options = appConstant.FILTRO_TABLAS;

        modulosControl.selectedOption = modulosControl.options[appGenericConstant.CERO];

        modulosControl.report = {
            selected: null
        };

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, 'admisiones').then(function (data) {
                modulosControl.listaEstados = data;
            });
        }

        function onConsultarModulo() {
            modulosControl.counter = appGenericConstant.CERO;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            modulosEntitiesService.buscarModulo().then(function (data) {
                modulosControl.listaModulos = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        }

        // var refreshTabla = function counter() {
        //     modulosControl.counter = modulosControl.counter + 1;
        //     if (modulosControl.counter === 10) {
        //         modulosEntitiesService.buscarModulo().then(function (data) {
        //             modulosControl.listaModulo = data;
        //             modulosControl.counter = 0;
        //         });
        //     }
        // }

        // //

        // modulosControl.cancelarInterval = function () {
        //     //
        // }

        modulosControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarModulos)) {
                modulosControl.onNewRegistryModulo();
                new ValidationService().resetForm($scope.formAgregarModulos);
            }
        };

        modulosControl.onLimpiarRegistro = function () {
            modulosControl.modulosEntity.id = null;
            modulosControl.modulosVisor.onDeshabilitar = false;
            modulosControl.modulosVisor.onOcultar = true;
            modulosControl.modulosVisor.onDeshabilitarCodigo = false;
            modulosControl.modulosVisor.titulo = appGenericConstant.AGREGAR_MODULO;
            modulosControl.modulosEntity.codigo = null;
            modulosControl.modulosEntity.nombre = null;
            modulosControl.modulosEntity.estado = modulosControl.listaEstados[0].codigo;
            localStorageService.remove('modulos');
            localStorageService.remove('status');
            localStorageService.set('status', modulosControl.modulosVisor);

        };

        modulosControl.onNewRegistryModulo = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            if (modulosControl.modulosEntity.id === null || modulosControl.modulosEntity.id === undefined) {
                var newModulo =
                    {
                        id: null,
                        codigo: appConstant.VALIDAR_STRING(modulosControl.modulosEntity.codigo),
                        nombre: appConstant.VALIDAR_STRING(modulosControl.modulosEntity.nombre),
                        transversal: appConstant.VALIDAR_STRING(modulosControl.modulosEntity.transversal)
                    };
                modulosEntitiesService.agregarModulo(newModulo).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            modulosControl.onLimpiarRegistro();
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
                    appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                    return;
                });
            }
            else {
                var updateModulo =
                    {
                        id: modulosControl.modulosEntity.id,
                        codigo: modulosControl.modulosEntity.codigo,
                        nombre: appConstant.VALIDAR_STRING(modulosControl.modulosEntity.nombre),
                        transversal: appConstant.VALIDAR_STRING(modulosControl.modulosEntity.transversal),
                        estado: modulosControl.modulosEntity.estado
                    };
                modulosEntitiesService.actualizarModulo(updateModulo).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                            break;
                        default:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                            break;
                    }
                }).catch(function (e) {
                    appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                    return;
                });
            };
        };

        modulosControl.onClickToView = function (item) {
            modulosControl.modulosVisor.titulo = appGenericConstant.VER_DETALLE_MODULO;
            modulosControl.modulosVisor.onDeshabilitar = true;
            modulosControl.modulosVisor.onOcultar = false;
            modulosControl.modulosEntity.id = item.id;
            modulosControl.modulosEntity.codigo = item.codigo;
            modulosControl.modulosEntity.nombre = item.nombre;
            modulosControl.modulosEntity.transversal = item.transversal;
            modulosControl.modulosEntity.fechaRegistro = $filter('date')(item.fechaRegistro, 'dd/MM/yyyy hh:mm:ss');
            modulosControl.modulosEntity.estado = item.estado;
            localStorageService.set('modulos', modulosControl.modulosEntity);
            localStorageService.set('status', modulosControl.modulosVisor);
            $location.path('/modulos-gestion');
        };

        modulosControl.onClickToEditar = function (item) {
            modulosControl.modulosVisor.titulo = "Modificar módulo";
            modulosControl.modulosVisor.onDeshabilitar = false;
            modulosControl.modulosVisor.onDeshabilitarCodigo = true;
            modulosControl.modulosVisor.onOcultar = false;
            modulosControl.modulosEntity.id = item.id;
            modulosControl.modulosEntity.codigo = item.codigo;
            modulosControl.modulosEntity.nombre = item.nombre;
            modulosControl.modulosEntity.transversal = item.transversal;
            modulosControl.modulosEntity.fechaRegistro = $filter('date')(item.fechaRegistro, 'dd/MM/yyyy hh:mm:ss');
            modulosControl.modulosEntity.estado = item.estado;
            localStorageService.set('modulos', modulosControl.modulosEntity);
            localStorageService.set('status', modulosControl.modulosVisor);
            $location.path('/modulos-gestion');
        };

        onConsultarModulo();
        onConsultarListaEstados();
    }]);


