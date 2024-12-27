'use strict';
angular.module('mytodoApp').controller('asignaturaCtrl', ['$scope', '$location', 'asignaturaEntitiesService', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval','appGenericConstant','appConstantValueList',
    function ($scope, $location, asignaturaEntitiesService, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant, appConstantValueList) {
        var asignaturaControl = this;
        asignaturaControl.asignaturaEntity = asignaturaEntitiesService.asignatura;
        asignaturaControl.asignaturaVisor = asignaturaEntitiesService.asignaturaAux;
        asignaturaControl.listaAsignaturas = [];
        asignaturaControl.listaEstados = [];
        asignaturaControl.counter = appGenericConstant.CERO;

        var config = {};
        if (localStorageService.get('asignatura')) {
            var asignatura = localStorageService.get('asignatura');
            asignaturaControl.asignaturaEntity = asignatura;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            asignaturaControl.asignaturaVisor = status;
        }

        asignaturaControl.options = appConstant.FILTRO_TABLAS;

        asignaturaControl.selectedOption = asignaturaControl.options[0];

        asignaturaControl.report = {
            selected: null
        };

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, 'admisiones').then(function (data) {
                asignaturaControl.listaEstados = data;
            });
        }

        function onConsultarAsignatura() {
            asignaturaControl.counter = appGenericConstant.CERO;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignaturaEntitiesService.buscarAsignatura().then(function (data) {
                asignaturaControl.listaAsignaturas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        }

        var refreshTabla = function counter() {
            asignaturaControl.counter = asignaturaControl.counter + 1;
            if (asignaturaControl.counter === appGenericConstant.DIEZ) {
                asignaturaEntitiesService.buscarAsignatura().then(function (data) {
                    asignaturaControl.listaAsignatura = data;
                    asignaturaControl.counter = appGenericConstant.CERO;
                });
            }
        };

        // //

        asignaturaControl.cancelarInterval = function () {
            //
        };

        asignaturaControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarAsignatura)) {
                asignaturaControl.onNewRegistryAsignatura();
                new ValidationService().resetForm($scope.formAgregarAsignatura);
            }
        };

        asignaturaControl.onLimpiarRegistro = function () {
            asignaturaControl.asignaturaEntity.id = null;
            asignaturaControl.asignaturaVisor.onDeshabilitar = false;
            // asignaturaControl.asignaturaVisor.onOcultar = true;
            asignaturaControl.asignaturaVisor.titulo = appGenericConstant.AGREGAR_MODULO;
            asignaturaControl.asignaturaEntity.codigoAsignatura = null;
            asignaturaControl.asignaturaVisor.onDeshabilitarCodigo = false;
            asignaturaControl.asignaturaEntity.nombreAsignatura = '';
            asignaturaControl.asignaturaEntity.estado = asignaturaControl.listaEstados[0].codigo;
            asignaturaControl.asignaturaEntity.descripcionAsignatura = '';
            localStorageService.remove('asignatura');
            localStorageService.remove('status');
            localStorageService.set('status', asignaturaControl.asignaturaVisor);

        };

        asignaturaControl.onNewRegistryAsignatura = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (asignaturaControl.asignaturaEntity.id === null || asignaturaControl.asignaturaEntity.id === appGenericConstant.INDEFINIDO) {
                var newAsignatura =
                    {
                        id: null,
                        codigoAsignatura: appConstant.VALIDAR_STRING(asignaturaControl.asignaturaEntity.codigoAsignatura),
                        nombreAsignatura: appConstant.VALIDAR_STRING(asignaturaControl.asignaturaEntity.nombreAsignatura),
                        nivelAcademico: asignaturaControl.asignaturaEntity.nivelAcademico,
                        descripcionAsignatura: asignaturaControl.asignaturaEntity.descripcionAsignatura
                    };
                asignaturaEntitiesService.agregarAsignatura(newAsignatura).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            asignaturaControl.onLimpiarRegistro();
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                            break;
                        case 400:
                            if (response.message === appGenericConstant.CODIGO_EXISTE) {
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
                var updateAsignatura =
                    {
                        id: asignaturaControl.asignaturaEntity.id,
                        codigoAsignatura: asignaturaControl.asignaturaEntity.codigoAsignatura,
                        nombreAsignatura: appConstant.VALIDAR_STRING(asignaturaControl.asignaturaEntity.nombreAsignatura),
                        nivelAcademico: asignaturaControl.asignaturaEntity.nivelAcademico,
                        descripcionAsignatura: asignaturaControl.asignaturaEntity.descripcionAsignatura
                    };
                asignaturaEntitiesService.actualizarAsignatura(updateAsignatura).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
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

        asignaturaControl.onClickToView = function (item) {
            asignaturaControl.asignaturaVisor.onDeshabilitar = true;
            asignaturaControl.asignaturaVisor.onOcultar = false;
            asignaturaControl.asignaturaEntity.id = item.id;
            asignaturaControl.asignaturaEntity.codigoAsignatura = item.codigoAsignatura;
            asignaturaControl.asignaturaEntity.nombreAsignatura = item.nombreAsignatura;
            asignaturaControl.asignaturaEntity.nivelAcademico = item.nivelAcademico;
            asignaturaControl.asignaturaEntity.descripcionAsignatura = item.descripcionAsignatura;
            localStorageService.set('asignatura', asignaturaControl.asignaturaEntity);
            localStorageService.set('status', asignaturaControl.asignaturaVisor);
            $location.path('/nivel-formacion-gestion');
        };

        asignaturaControl.onClickToEditar = function (item) {
            asignaturaControl.asignaturaVisor.titulo = appGenericConstant.MODIFICAR_NIVEL_FORMACION;
            asignaturaControl.asignaturaVisor.onDeshabilitar = false;
            asignaturaControl.asignaturaVisor.onDeshabilitarCodigo = true;
            asignaturaControl.asignaturaVisor.onOcultar = false;
            asignaturaControl.asignaturaEntity.id = item.id;
            asignaturaControl.asignaturaEntity.codigoAsignatura = item.codigoAsignatura;
            asignaturaControl.asignaturaEntity.nombreAsignatura = item.nombreAsignatura;
            asignaturaControl.asignaturaEntity.nivelAcademico = item.nivelAcademico;
            asignaturaControl.asignaturaEntity.descripcionAsignatura = item.descripcionAsignatura;
            localStorageService.set('asignatura', asignaturaControl.asignaturaEntity);
            localStorageService.set('status', asignaturaControl.asignaturaVisor);
            $location.path('/nivel-formacion-gestion');
        };

        asignaturaControl.onClickToDelete = function (item) {
            asignaturaControl.report.selected.length = null;
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
                asignaturaEntitiesService.eliminarAsignatura(item).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(
                                appGenericConstant.NIVEL_FORMACION_ELIMINADO,
                                appGenericConstant.NIVEL_FORMACION_ELIMINADO_SATISFACTORIO,
                                appGenericConstant.SUCCESS
                            );
                            onConsultarAsignatura();
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

        asignaturaControl.onClickToDeleteMasivo = function () {
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
                    angular.forEach(asignaturaControl.report.selected, function (value, key) {
                        listaElementosEliminar.push(value.id);
                    });
                    asignaturaEntitiesService.eliminarMasivoAsignatura(listaElementosEliminar).then(function (response) {
                        switch (response.tipo) {
                            case 200:
                                swal(
                                    appGenericConstant.NIVELES_FORMACION_ELIMINADO,
                                    appGenericConstant.NIVELES_FORMACION_ELIMINADO_SATISFACTORIO,
                                    appGenericConstant.SUCCESS
                                );
                                onConsultarAsignatura();
                                break;
                            case 400:
                                swal(
                                    appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.NIVELES_FORMACION_NO_ELIMINADO,
                                    appGenericConstant.WARNING
                                );
                                break;
                        }
                        asignaturaControl.report.selected.length = null;
                        onConsultarAsignatura();
                    });
                }
            });
        };

        onConsultarAsignatura();
        onConsultarListaEstados();
    }]);


