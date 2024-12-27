(function () {
    'use strict';
    angular.module('mytodoApp').controller('CargoCtrl', CargoCtrl);
    CargoCtrl.$inject = ['$scope', 'cargoEntityServices', 'appConstant', 'hiHelpDesk', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appGenericConstant'];
    function CargoCtrl($scope, cargoEntityServices, appConstant, hiHelpDesk, $location, growl, ValidationService, localStorageService, utilServices, appGenericConstant) {

        var gestionCargo = this;

        gestionCargo.Cargo = [];
        gestionCargo.cargoEntity = cargoEntityServices.cargo;
        gestionCargo.cargoAuxiliar = cargoEntityServices.cargoAuxiliar;
        gestionCargo.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionCargo.options = appConstant.FILTRO_TABLAS;
        gestionCargo.report = {
            selected: null
        };
        gestionCargo.selectedOption = gestionCargo.options[0];
        function onBuscarCargo() {
            cargoEntityServices.buscarCargo().then(function (data) {
                gestionCargo.Cargo = data;
            });
        }
        gestionCargo.onLimpiar = function () {
            cargoEntityServices.cargo = {};
            gestionCargo.cargoEntity.codigoCargo = null;
            gestionCargo.cargoEntity.nombreCargo = null;
            localStorageService.remove('cargo');

        };
        gestionCargo.onClickToAddCargo = function () {
            gestionCargo.onLimpiar();
            gestionCargo.cargoAuxiliar.disableVerDetalle = false;
            gestionCargo.cargoAuxiliar.disableCodigo = false;
            gestionCargo.cargoAuxiliar.onDeshabilitarCampoEstado = true;
            gestionCargo.cargoAuxiliar.titulo = appGenericConstant.AGREGAR_CARGO;
            localStorageService.set('cargo', null);
            localStorageService.set('cargoAuxiliar', gestionCargo.cargoAuxiliar);
        };
        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', 'configeneral').then(function (data) {
                gestionCargo.listaEstados = data;
            });
        }

        gestionCargo.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarCargo)) {
                if (gestionCargo.cargoEntity.id === null || gestionCargo.cargoEntity.id === undefined) {
                    gestionCargo.onRegistrarCargo();

                    new ValidationService().resetForm($scope.formRegistrarCargo);
                } else {

                    gestionCargo.onActulizarCargo();
                }

            }
        };

        gestionCargo.onRegistrarCargo = function () {

            var newCargo = {
                codigoCargo: gestionCargo.cargoEntity.codigoCargo.toUpperCase(),
                nombreCargo: gestionCargo.cargoEntity.nombreCargo.toUpperCase(),
                estado: "ACTIVO"
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CERRAR_SWAL();
            cargoEntityServices.RegistrarCargo(newCargo).then(function (data) {
                if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else if (data.tipo === 200) {
                    gestionCargo.onLimpiar();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });

        };

        gestionCargo.onEliminarCargo = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CARGO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                cargoEntityServices.deleteCargo(item).then(function (data) {
                    if (data.tipo === 200) {
                        setTimeout(function () {
                            swal(
                                    appGenericConstant.CARGO_ELIMINADO,
                                    appGenericConstant.CARGO_ELIMINADO_SATIS,
                                    appGenericConstant.SUCCESS
                                    );
                        }, 1);
                    } else if (data.tipo === 400) {
                        setTimeout(function () {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.CARGO_NO_ELIMINADO,
                                    appGenericConstant.WARNING);
                        }, 1);


                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();

                    }
                    gestionCargo.report.selected.length = null;
                    onBuscarCargo();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionCargo.report.selected.length = null;
                }
            });
        };
        if (localStorageService.get('cargo') !== null) {
            var event = localStorageService.get('cargo');
            gestionCargo.cargoEntity = event;

        }
        ;
        if (localStorageService.get('cargoAuxiliar') !== null) {
            gestionCargo.cargoAuxiliar = localStorageService.get('cargoAuxiliar');
        }
        ;

        gestionCargo.onEdit = function (item) {
            gestionCargo.cargoAuxiliar.disableVerDetalle = false;
            gestionCargo.cargoAuxiliar.disableCodigo = true;
            gestionCargo.cargoAuxiliar.onDeshabilitarCampoEstado = false;
            gestionCargo.cargoAuxiliar.titulo = appGenericConstant.MODIFICAR_CARGO;
            gestionCargo.cargoEntity.codigoCargo = item.codigoCargo;
            gestionCargo.cargoEntity.nombreCargo = item.nombreCargo;
            gestionCargo.cargoEntity.estado = item.estado;
            gestionCargo.cargoEntity.id = item.id;
            $location.path('/cud-cargos');
            localStorageService.set('cargo', gestionCargo.cargoEntity);
            localStorageService.set('cargoAuxiliar', gestionCargo.cargoAuxiliar);
        };
        gestionCargo.onActulizarCargo = function (item) {
            var newCargo = {
                codigoCargo: gestionCargo.cargoEntity.codigoCargo,
                nombreCargo: gestionCargo.cargoEntity.nombreCargo.toUpperCase(),
                estado: gestionCargo.cargoEntity.estado,
                id: gestionCargo.cargoEntity.id
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            cargoEntityServices.ActulizarCargo(newCargo).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    localStorageService.set('cargo', gestionCargo.cargoEntity);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                } else if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionCargo.onEliminarMasivoCargo = function () {
            var listaEliminables = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CARGOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                angular.forEach(gestionCargo.report.selected, function (value, key) {
                    listaEliminables.push(value.id);
                });
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                cargoEntityServices.deleteFacultaMasive(listaEliminables).then(function (data) {
                    if (data.tipo === 200) {
                        setTimeout(function () {
                            swal(
                                    appGenericConstant.CARGOS_ELIMINADOS,
                                    appGenericConstant.CARGOS_ELIMINADOS_SATIS,
                                    appGenericConstant.SUCCESS
                                    );
                        }, 1);
                    } else if (data.tipo === 400) {
                        setTimeout(function () {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.CARGOS_NO_ELIMINADOS,
                                    appGenericConstant.WARNING);
                        }, 1);


                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();

                    }

                    gestionCargo.report.selected.length = null;
                    onBuscarCargo();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionCargo.report.selected.length = null;
                }
            });
        };
        onBuscarCargo();
        onConsultarListaEstados();
    }
})();




