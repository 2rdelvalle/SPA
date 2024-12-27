(function () {
    'use strict';
    angular.module('mytodoApp').controller('nivelFormacionCtrl', nivelFormacionCtrl);

    nivelFormacionCtrl.$inject = ['$scope', '$location', 'nivelFormacionEntitiesService', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval','appConstantValueList','appGenericConstant'];
    function nivelFormacionCtrl($scope, $location, nivelFormacionEntitiesService, growl, ValidationService, localStorageService, utilServices, appConstant, $interval,appConstantValueList,appGenericConstant) {
        var nivelFormacionControl = this;
        nivelFormacionControl.nivelFormacionEntity = nivelFormacionEntitiesService.nivelFormacion;
        nivelFormacionControl.nivelFormacionVisor = nivelFormacionEntitiesService.nivelFormacionAux;
        nivelFormacionControl.listaNivelFormacion = [];
        nivelFormacionControl.listaNivelesAcademicos = [];
        nivelFormacionControl.counter = appGenericConstant.CERO;

        if (localStorageService.get('nivelFormacion')) {
            var nivelFormacion = localStorageService.get('nivelFormacion');
            nivelFormacionControl.nivelFormacionEntity = nivelFormacion;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            nivelFormacionControl.nivelFormacionVisor = status;
        }

        nivelFormacionControl.options = appConstant.FILTRO_TABLAS;

        nivelFormacionControl.selectedOption = nivelFormacionControl.options[0];

        nivelFormacionControl.report = {
            selected: null
        };

        function onConsultarNivelesAcademicos() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_NIVEL_ACADEMICO,appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                nivelFormacionControl.listaNivelesAcademicos = data;
            });
        }

        function onConsultarNivelFormacion() {
            nivelFormacionControl.counter = 0;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            nivelFormacionEntitiesService.buscarNivelFormacion().then(function (data) {
                nivelFormacionControl.listaNivelFormacion = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        }

        var refreshTabla = function counter() {
            nivelFormacionControl.counter = nivelFormacionControl.counter + 1;
            if (nivelFormacionControl.counter === 10) {
                nivelFormacionEntitiesService.buscarNivelFormacion().then(function (data) {
                    nivelFormacionControl.listaNivelFormacion = data;
                    nivelFormacionControl.counter = 0;
                });
            }
        };

        // //

        nivelFormacionControl.cancelarInterval = function () {
            //
        };

        nivelFormacionControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarNivelFormacion)) {
                nivelFormacionControl.onNewRegistryNivelFormacion();
                new ValidationService().resetForm($scope.formAgregarNivelFormacion);
            }
        };

        nivelFormacionControl.onLimpiarRegistro = function () {
            nivelFormacionControl.nivelFormacionEntity.id = null;
            nivelFormacionControl.nivelFormacionVisor.onDeshabilitar = false;
            nivelFormacionControl.nivelFormacionVisor.titulo = appGenericConstant.AGREGAR_NIVEL_FORMACION;
            nivelFormacionControl.nivelFormacionEntity.codigoNivelFormacion = '';
            nivelFormacionControl.nivelFormacionVisor.onDeshabilitarCodigo = false;
            nivelFormacionControl.nivelFormacionEntity.nombreNivelFormacion = '';
            nivelFormacionControl.nivelFormacionEntity.nivelAcademico = null;
            nivelFormacionControl.nivelFormacionEntity.descripcionNivelFormacion = '';
            localStorageService.remove('nivelFormacion');
            localStorageService.remove('status');
            localStorageService.set('status', nivelFormacionControl.nivelFormacionVisor);

        };

        nivelFormacionControl.onNewRegistryNivelFormacion = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (nivelFormacionControl.nivelFormacionEntity.id === null || nivelFormacionControl.nivelFormacionEntity.id === undefined) {
                var newNivelFormacion =
                    {
                        id: null,
                        codigoNivelFormacion: appConstant.VALIDAR_STRING(nivelFormacionControl.nivelFormacionEntity.codigoNivelFormacion),
                        nombreNivelFormacion: appConstant.VALIDAR_STRING(nivelFormacionControl.nivelFormacionEntity.nombreNivelFormacion),
                        nivelAcademico: nivelFormacionControl.nivelFormacionEntity.nivelAcademico,
                        descripcionNivelFormacion: nivelFormacionControl.nivelFormacionEntity.descripcionNivelFormacion
                    };
                nivelFormacionEntitiesService.agregarNivelFormacion(newNivelFormacion).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            nivelFormacionControl.onLimpiarRegistro();
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            break;
                        case 400:
                            if (response.message === "CÓDIGO EXISTE") {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_NIVEL_FORMACION);
                                return;
                            }
                            else {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            }
                    }
                });
            }
            else {
                var updateNivelFormacion =
                    {
                        id: nivelFormacionControl.nivelFormacionEntity.id,
                        codigoNivelFormacion: nivelFormacionControl.nivelFormacionEntity.codigoNivelFormacion,
                        nombreNivelFormacion: appConstant.VALIDAR_STRING(nivelFormacionControl.nivelFormacionEntity.nombreNivelFormacion),
                        nivelAcademico: nivelFormacionControl.nivelFormacionEntity.nivelAcademico,
                        descripcionNivelFormacion: nivelFormacionControl.nivelFormacionEntity.descripcionNivelFormacion
                    };
                nivelFormacionEntitiesService.actualizarNivelFormacion(updateNivelFormacion).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            break;
                        case 400:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_NIVEL_FORMACION);
                            break;
                        default:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                            break;
                    }
                });
            };
        };

        nivelFormacionControl.onClickToView = function (item) {
            nivelFormacionControl.nivelFormacionVisor.onDeshabilitar = true;
            nivelFormacionControl.nivelFormacionEntity.id = item.id;
            nivelFormacionControl.nivelFormacionEntity.codigoNivelFormacion = item.codigoNivelFormacion;
            nivelFormacionControl.nivelFormacionEntity.nombreNivelFormacion = item.nombreNivelFormacion;
            nivelFormacionControl.nivelFormacionEntity.nivelAcademico = item.nivelAcademico;
            nivelFormacionControl.nivelFormacionEntity.descripcionNivelFormacion = item.descripcionNivelFormacion;
            localStorageService.set('nivelFormacion', nivelFormacionControl.nivelFormacionEntity);
            localStorageService.set('status', nivelFormacionControl.nivelFormacionVisor);
            $location.path('/nivel-formacion-gestion');
        };

        nivelFormacionControl.onClickToEditar = function (item) {
            nivelFormacionControl.nivelFormacionVisor.titulo = appGenericConstant.MODIFICAR_NIVEL_FORMACION;
            nivelFormacionControl.nivelFormacionVisor.onDeshabilitar = false;
            nivelFormacionControl.nivelFormacionVisor.onDeshabilitarCodigo = true;
            nivelFormacionControl.nivelFormacionEntity.id = item.id;
            nivelFormacionControl.nivelFormacionEntity.codigoNivelFormacion = item.codigoNivelFormacion;
            nivelFormacionControl.nivelFormacionEntity.nombreNivelFormacion = item.nombreNivelFormacion;
            nivelFormacionControl.nivelFormacionEntity.nivelAcademico = item.nivelAcademico;
            nivelFormacionControl.nivelFormacionEntity.descripcionNivelFormacion = item.descripcionNivelFormacion;
            localStorageService.set('nivelFormacion', nivelFormacionControl.nivelFormacionEntity);
            localStorageService.set('status', nivelFormacionControl.nivelFormacionVisor);
            $location.path('/nivel-formacion-gestion');
        };

        nivelFormacionControl.onClickToDelete = function (item) {
            nivelFormacionControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_NIVEL_FORMACION,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                nivelFormacionEntitiesService.eliminarNivelFormacion(item).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(
                                appGenericConstant.NIVEL_FORMACION_ELIMINADO,
                                appGenericConstant.NIVEL_FORMACION_ELIMINADO_SATISFACTORIO,
                                appGenericConstant.SUCCESS
                            );
                            onConsultarNivelFormacion();
                            break;
                        case 400:
                            swal(
                                appGenericConstant.HUBO_PROBLEMA,
                                appGenericConstant.NIVEL_FORMACION_NO_ELIMINADO,
                                appGenericConstant.WARNING
                            );
                            break;
                    }
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        nivelFormacionControl.onClickToDeleteMasivo = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_NIVELES_FORMACION,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                    appConstant.CARGANDO();
                    angular.forEach(nivelFormacionControl.report.selected, function (value, key) {
                        listaElementosEliminar.push(value.id);
                    });
                    nivelFormacionEntitiesService.eliminarMasivoNivelFormacion(listaElementosEliminar).then(function (response) {
                        switch (response.tipo) {
                            case 200:
                                swal(
                                    appGenericConstant.NIVELES_FORMACION_ELIMINADO,
                                    appGenericConstant.NIVELES_FORMACION_ELIMINADO_SATISFACTORIO,
                                    appGenericConstant.SUCCESS
                                );
                                onConsultarNivelFormacion();
                                break;
                            case 400:
                                swal(
                                    appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.NIVELES_FORMACION_NO_ELIMINADO,
                                    appGenericConstant.WARNING
                                );
                                break;
                        }
                        nivelFormacionControl.report.selected.length = null;
                        onConsultarNivelFormacion();
                    });
                }
            });
        };

        onConsultarNivelFormacion();
        onConsultarNivelesAcademicos();
    }
})();


