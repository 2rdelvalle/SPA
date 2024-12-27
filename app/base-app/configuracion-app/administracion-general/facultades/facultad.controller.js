(function () {
    'use strict';
    angular.module('mytodoApp').controller('facultadCtrl', facultadCtrl);
    facultadCtrl.$inject = ['$scope', 'facultadEntityServices', 'appConstant', 'hiHelpDesk', '$location', 'growl', 'ValidationService', 'localStorageService', 'appGenericConstant'];
    function facultadCtrl($scope, facultadEntityServices, appConstant, hiHelpDesk, $location, growl, ValidationService, localStorageService, appGenericConstant) {

        var gestionFacultad = this;

        gestionFacultad.Facultad = [];
        gestionFacultad.facultadEntity = facultadEntityServices.facultad;
        gestionFacultad.FacultadAuxiliar = facultadEntityServices.facultadAuxiliar;
        gestionFacultad.config = { globalTimeToLive: 3000, disableCountDown: true };
        gestionFacultad.options = appConstant.FILTRO_TABLAS;
        gestionFacultad.report = {
            selected: null
        };
        gestionFacultad.selectedOption = gestionFacultad.options[0];
        function onBuscarFacutad() {
            facultadEntityServices.buscarFacultad().then(function (data) {
                gestionFacultad.Facultad = data;
            });
        }
        gestionFacultad.onLimpiar = function () {
            facultadEntityServices.facultad = {};
            gestionFacultad.facultadEntity.codigoFacultad = null;
            gestionFacultad.facultadEntity.nombreFacultad = null;
            localStorageService.remove('facultad');

        };
        gestionFacultad.onClickToAddFacultad = function () {
            gestionFacultad.onLimpiar();
            gestionFacultad.FacultadAuxiliar.disableVerDetalle = false;
            gestionFacultad.FacultadAuxiliar.disableCodigo = false;
            gestionFacultad.FacultadAuxiliar.titulo = appGenericConstant.AGREGAR_FACULTAD;
            localStorageService.set('facultad', null);
            localStorageService.set('FacultadAuxiliar', gestionFacultad.FacultadAuxiliar);
        };

        gestionFacultad.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarFacultad)) {
                if (gestionFacultad.facultadEntity.id === null || gestionFacultad.facultadEntity.id === undefined) {
                    gestionFacultad.onRegistrarFacultad();

                    new ValidationService().resetForm($scope.formRegistrarFacultad);
                } else {

                    gestionFacultad.onActulizarFacultad();
                }

            }
        };

        gestionFacultad.onRegistrarFacultad = function () {

            var newFacultad = {
                codigoFacultad: gestionFacultad.facultadEntity.codigoFacultad.toUpperCase(),
                nombreFacultad: gestionFacultad.facultadEntity.nombreFacultad.toUpperCase(),
                estado: "ACTIVO"
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CERRAR_SWAL();
            facultadEntityServices.RegistrarFacultad(newFacultad).then(function (data) {
                if (data.tipo === 400) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CODIGO_REGISTRO_EXISTE);
                } else if (data.tipo === 200) {
                    gestionFacultad.onLimpiar();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });

        };

        gestionFacultad.onEliminarFacultad = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FACULTAD,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                facultadEntityServices.deleteFacultad(item).then(function (data) {
                    if (data.tipo === 200) {
                        setTimeout(function () {
                            swal(
                                appGenericConstant.FACULTAD_ELIMINADA,
                                appGenericConstant.FACULTAD_ELIMINADA_SATIS,
                                appGenericConstant.SUCCESS
                            );
                        }, 1);
                    } else if (data.tipo === 400) {
                        setTimeout(function () {
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.FACULTAD_NO_ELIMINADA,
                                appGenericConstant.WARNING);
                        }, 1);


                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();

                    }
                    gestionFacultad.report.selected.length = null;
                    onBuscarFacutad();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionFacultad.report.selected.length = null;
                }
            });
        };
        if (localStorageService.get('facultad') !== null) {
            var event = localStorageService.get('facultad');
            gestionFacultad.facultadEntity = event;

        };
        if (localStorageService.get('FacultadAuxiliar') !== null) {
            gestionFacultad.FacultadAuxiliar = localStorageService.get('FacultadAuxiliar');
        };

        gestionFacultad.onEdit = function (item) {
            gestionFacultad.FacultadAuxiliar.disableVerDetalle = false;
            gestionFacultad.FacultadAuxiliar.disableCodigo = true;
            gestionFacultad.FacultadAuxiliar.titulo = appGenericConstant.MODIFICAR_FACULTAD;
            gestionFacultad.facultadEntity.codigoFacultad = item.codigoFacultad;
            gestionFacultad.facultadEntity.nombreFacultad = item.nombreFacultad;

            gestionFacultad.facultadEntity.id = item.id;
            $location.path('/cud-facultad');
            localStorageService.set('facultad', gestionFacultad.facultadEntity);
            localStorageService.set('FacultadAuxiliar', gestionFacultad.FacultadAuxiliar);
        };
        gestionFacultad.onActulizarFacultad = function (item) {
            var newFacultad = {
                codigoFacultad: gestionFacultad.facultadEntity.codigoFacultad,
                nombreFacultad: gestionFacultad.facultadEntity.nombreFacultad.toUpperCase(),
                estado: "ACTIVO",
                id: gestionFacultad.facultadEntity.id
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            facultadEntityServices.ActulizarFacultad(newFacultad).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    localStorageService.set('facultad', gestionFacultad.facultadEntity);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionFacultad.onEliminarMasivoFacultad = function () {
            var listaEliminables = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FACULTADES,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                angular.forEach(gestionFacultad.report.selected, function (value, key) {
                    listaEliminables.push(value.id);
                });
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                facultadEntityServices.deleteFacultaMasive(listaEliminables).then(function (data) {
                    if (data.tipo === 200) {
                        setTimeout(function () {
                            swal(
                                appGenericConstant.FACULTADES_ELIINADAS,
                                appGenericConstant.FACULTADES_ELIMINADAS_SATIS,
                                appGenericConstant.SUCCESS
                            );
                        }, 1);
                    } else if (data.tipo === 400) {
                        setTimeout(function () {
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.ALGUNAS_FACULTADES,
                                appGenericConstant.WARNING);
                        }, 1);


                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();

                    }

                    gestionFacultad.report.selected.length = null;
                    onBuscarFacutad();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionFacultad.report.selected.length = null;
                }
            });
        };
        onBuscarFacutad();
    }
})();


