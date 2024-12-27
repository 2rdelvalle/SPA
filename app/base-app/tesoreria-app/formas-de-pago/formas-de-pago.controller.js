(function () {
    'use strict';
    angular.module('mytodoApp').controller('formaPagoCtrl', formaPagoCtrl);

    angular.module('mytodoApp').config(['growlProvider', 'ngDialogProvider', function (growlProvider, ngDialogProvider) {
        growlProvider.globalTimeToLive(5000);
        growlProvider.onlyUniqueMessages(true);
    }]);

    formaPagoCtrl.$inject = ['$scope', 'appConstant', '$location', 'formaPagoEntitiesService', 'growl', 'ValidationService', 'localStorageService', 'appGenericConstant'];
    function formaPagoCtrl($scope, appConstant, $location, formaPagoEntitiesService, growl, ValidationService, localStorageService, appGenericConstant) {
        var formaPagoControl = this;
        formaPagoControl.formaPagoEntity = formaPagoEntitiesService.formaPago;
        formaPagoControl.formaPagoVisor = formaPagoEntitiesService.formaPagoAux;
        formaPagoControl.listaFP = [];

        var config = {};
        if (localStorageService.get('formaPago') !== null) {
            var formaPago = localStorageService.get('formaPago');
            formaPagoControl.formaPagoEntity = formaPago;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            formaPagoControl.formaPagoVisor = status;
        }

        formaPagoControl.options = appConstant.FILTRO_TABLAS;

        formaPagoControl.selectedOption = formaPagoControl.options[0];

        formaPagoControl.report = {
            selected: null
        };

        function onConsultarFormaPago() {
            formaPagoEntitiesService.buscarFormaPago().then(function (data) {
                formaPagoControl.listaFP = data;
            });
        }

        formaPagoControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarFormaDePago)) {
                formaPagoControl.onNewRegistryFormaPago();
                new ValidationService().resetForm($scope.formAgregarFormaDePago);
            }
        };

        formaPagoControl.onLimpiarRegistro = function () {
            formaPagoControl.formaPagoEntity.id = null;
            formaPagoControl.formaPagoVisor.onDeshabilitar = false;
            formaPagoControl.formaPagoVisor.onOcultarBoton = false;
            formaPagoControl.formaPagoVisor.titulo = appGenericConstant.AGREGAR_FORMA_PAGO;
            formaPagoControl.formaPagoEntity.codigo = '';
            formaPagoControl.formaPagoVisor.onDeshabilitarCodigo = false;
            formaPagoControl.formaPagoEntity.nombreFormaPago = '';
            formaPagoControl.formaPagoEntity.descripcion = '';
            localStorageService.remove('formaPago');
            localStorageService.remove('status');
            localStorageService.set('status', formaPagoControl.formaPagoVisor);
        };

        formaPagoControl.onNewRegistryFormaPago = function () {
                    if (formaPagoControl.formaPagoEntity.id === null || formaPagoControl.formaPagoEntity.id === undefined) {
                        var newFormaPago =
                            {
                                id: null,
                                codigoFormaPago: appConstant.VALIDAR_STRING(formaPagoControl.formaPagoEntity.codigoFormaPago),
                                nombreFormaPago: appConstant.VALIDAR_STRING(formaPagoControl.formaPagoEntity.nombreFormaPago),
                                descripcionFormaPago: formaPagoControl.formaPagoEntity.descripcionFormaPago
                            };
                        formaPagoEntitiesService.agregarFormaPago(newFormaPago).then(function (data) {
                            growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>¡BIEN HECHO!</strong><BR><span>Tu registro fue agregado.</span></span></td></tr><table></div>");
                            formaPagoControl.onLimpiarRegistro();
                        });
                    }
                else {
                    var temp = localStorageService.get('formaPago');
                    var updateFormaPago =
                        {
                            id: formaPagoControl.formaPagoEntity.id,
                            codigoFormaPago: formaPagoControl.formaPagoEntity.codigoFormaPago,
                            nombreFormaPago: appConstant.VALIDAR_STRING(formaPagoControl.formaPagoEntity.nombreFormaPago),
                            descripcionFormaPago: formaPagoControl.formaPagoEntity.descripcionFormaPago
                        };
                    if (temp === null && typeof temp === "object") {
                        growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>¡ALTO AHÍ!</strong><BR><span>Ya existe un registro con el código ingresado</span></span></td></tr><table></div>");
                    }
                    else {
                        formaPagoEntitiesService.actualizarFormaPago(updateFormaPago).then(function (data) {
                            growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>¡BIEN HECHO!</strong><BR><span>Tu registro fue modificado. </span></span></td></tr><table></div>");
                        });

                    }
                }
        };

        formaPagoControl.onClickToView = function (item) {
            formaPagoControl.formaPagoVisor.onDeshabilitar = true;
            formaPagoControl.formaPagoVisor.titulo = appGenericConstant.VER_DETALLE_FORMA_PAGO;
            formaPagoControl.formaPagoEntity.id = item.id;
            formaPagoControl.formaPagoEntity.nombreFormaPago = item.nombreFormaPago;
            formaPagoControl.formaPagoEntity.codigoFormaPago = item.codigoFormaPago;
            formaPagoControl.formaPagoEntity.descripcionFormaPago = item.descripcionFormaPago;
            localStorageService.set('formaPago', formaPagoControl.formaPagoEntity);
            localStorageService.set('status', formaPagoControl.formaPagoVisor);
            $location.path('/formas-de-pago-gestion');
        };

        formaPagoControl.onClickToEditar = function (item) {
            formaPagoControl.formaPagoVisor.onDeshabilitar = false;
            formaPagoControl.formaPagoVisor.onDeshabilitarCodigo = true;
            formaPagoControl.formaPagoVisor.onOcultarBoton = true;
            formaPagoControl.formaPagoVisor.titulo = appGenericConstant.MODIFICAR_FORMA_PAGO;
            formaPagoControl.formaPagoEntity.id = item.id;
            formaPagoControl.formaPagoEntity.nombreFormaPago = item.nombreFormaPago;
            formaPagoControl.formaPagoEntity.codigoFormaPago = item.codigoFormaPago;
            formaPagoControl.formaPagoEntity.descripcionFormaPago = item.descripcionFormaPago;
            localStorageService.set('formaPago', formaPagoControl.formaPagoEntity);
            localStorageService.set('status', formaPagoControl.formaPagoVisor);
            $location.path('/formas-de-pago-gestion');
        };

        formaPagoControl.onClickToDelete = function (item) {
            formaPagoControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FORMA_PAGO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    formaPagoEntitiesService.eliminarFormaPago(item).then(function (data) {
                        switch (data.tipo) {
                            case 200:
                                swal(
                                        appGenericConstant.FORMA_PAGO_ELIMINADO,
                                        appGenericConstant.FORMA_PAGO_ELIMINADO_SATIS,
                                        appGenericConstant.SUCCESS
                                        );
                                formaPagoControl.report.selected.length = null;
                                onConsultarFormaPago();
                                break;
                            case 400:
                                swal(
                                        appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.FORMA_PAGO_NO_ELIMINADO,
                                        appGenericConstant.WARNING
                                        );
                                break;
                            case 500:
                                swal(
                                        appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.FORMA_PAGO_NO_ELIMINADO,
                                        'error'
                                        );
                                break;
                        }
                    });
                }
                else {
                    formaPagoControl.report.selected.length = null;
                }

            });
        };

        formaPagoControl.onClickToDeleteMasivo = function () {
            var listEliminados=[];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FORMAS_PAGOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    angular.forEach(formaPagoControl.report.selected, function (value, key) {
                        listEliminados.push(value.id);
                    });
                    formaPagoEntitiesService.eliminarMasivoFormaPago(listEliminados).then(function (data) {
                        switch (data.tipo) {
                            case 200:
                                swal(
                                        appGenericConstant.FORMAS_PAGOS_ELIMINADOS,
                                        appGenericConstant.FORMAS_PAGOS_ELIMINADOS_SATIS,
                                        appGenericConstant.SUCCESS
                                        );
                                formaPagoControl.report.selected.length = null;
                                onConsultarFormaPago();
                                break;
                            case 400:
                                swal(
                                        appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.ALGUNAS_FORMAS_PAGOS,
                                        appGenericConstant.WARNING
                                        );
                                break;
                            case 500:
                                swal(
                                        appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.ALGUNAS_FORMAS_PAGOS,
                                        'error'
                                        );
                                break;
                        }
                        
                    });
                    
                }
            });
        };

        onConsultarFormaPago();
    }
})();


