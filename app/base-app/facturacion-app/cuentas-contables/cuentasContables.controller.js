(function () {
    'use strict';
    angular.module('mytodoApp').controller('CuentasCtrl', CuentasCtrl);
    CuentasCtrl.$inject = ['$scope', 'cuentasContablesEntityServices', 'appConstant', 'hiHelpDesk', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', '$interval', 'appGenericConstant'];

    function CuentasCtrl($scope, cuentasContablesEntityServices, appConstant, hiHelpDesk, $location, growl, ValidationService, localStorageService, utilServices, $interval, appGenericConstant) {

        var gestionCuentaContable = this;
        gestionCuentaContable.listCuentasContables = [];
        gestionCuentaContable.listaTipo = [];
        gestionCuentaContable.nuevaCuenta = cuentasContablesEntityServices.entidad;
        gestionCuentaContable.nuevaCuentaAuxiliar = cuentasContablesEntityServices.entidadAuxiliar;
        gestionCuentaContable.cuentaAux = cuentasContablesEntityServices.cuentaAuxiliar;
        gestionCuentaContable.cuentaAux.disabledCodeField = false;
        CuentasCtrl.regex = "[0-9]+";
        gestionCuentaContable.counter = 0;

        if (localStorageService.get('nuevaCuenta') !== null) {
            gestionCuentaContable.nuevaCuenta = localStorageService.get('nuevaCuenta');
        }

        if (localStorageService.get('cuentaAuxiliar') !== null) {
            gestionCuentaContable.cuentaAux = localStorageService.get('cuentaAuxiliar');
        }

        if (localStorageService.get('prefijoCuenta') !== null) {
            gestionCuentaContable.prefijo = localStorageService.get('prefijoCuenta');
        }

        if (localStorageService.get('auxiliarPrefijo') !== null) {
            gestionCuentaContable.nuevaCuentaAuxiliar = localStorageService.get('auxiliarPrefijo');
        }

        gestionCuentaContable.options = appConstant.FILTRO_TABLAS;

        function onListarTipoCuentas() {
            var categoria = 'TIPO_CONCEPTO';
            utilServices.buscarListaValorByCategoria(categoria,'financiero').then(function (data) {
                gestionCuentaContable.listaTipo = data;
            });
        }

        gestionCuentaContable.onLimpiar = function () {
            gestionCuentaContable.limpiar();
            new ValidationService().resetForm($scope.formRegistrarCuenta);
        };

        gestionCuentaContable.limpiar = function () {
            var nuevaCuenta = localStorageService.get('nuevaCuenta');
            gestionCuentaContable.nuevaCuenta.id = null;
            gestionCuentaContable.nuevaCuenta.codigo = null;
            gestionCuentaContable.nuevaCuenta.nombre = null;
            gestionCuentaContable.nuevaCuenta.tipo = null;
            localStorageService.set('nuevaCuenta', gestionCuentaContable.nuevaCuenta);
        };

        gestionCuentaContable.onAgregar = function () {
            gestionCuentaContable.limpiar();
            gestionCuentaContable.cuentaAux.disabled = false;
            gestionCuentaContable.cuentaAux.disabledCodeField = false;
            gestionCuentaContable.cuentaAux.showEditBtn = true;
            gestionCuentaContable.cuentaAux.showClearBtn = true;
            gestionCuentaContable.cuentaAux.titleWindow = appGenericConstant.AGREGAR_CUENTA_CONTABLE;
            localStorageService.set('cuentaAuxiliar', gestionCuentaContable.cuentaAux);
        };

        gestionCuentaContable.onEdit = function (item) {
            gestionCuentaContable.limpiar();
            gestionCuentaContable.cuentaAux.disabledCodeField = false;
            gestionCuentaContable.nuevaCuenta.id = item.id;
            gestionCuentaContable.nuevaCuenta.codigo = item.codigoCuenta;
            gestionCuentaContable.nuevaCuenta.nombre = item.nombreCuenta;
            gestionCuentaContable.nuevaCuenta.tipo = item.clase;

            gestionCuentaContable.prefijo = {
                nombre: item.tipo
            };

            gestionCuentaContable.cuentaAux.disabled = false;
            gestionCuentaContable.cuentaAux.disabledCodeField = true;
            gestionCuentaContable.cuentaAux.titleWindow = appGenericConstant.MODIFICAR_CUENTA_CONTABLE;
            gestionCuentaContable.cuentaAux.showEditBtn = true;
            gestionCuentaContable.cuentaAux.showClearBtn = false;

            localStorageService.set('nuevaCuenta', gestionCuentaContable.nuevaCuenta);
            localStorageService.set('cuentaAuxiliar', gestionCuentaContable.cuentaAux);
            localStorageService.set('prefijoCuenta', gestionCuentaContable.prefijo);

        };

        gestionCuentaContable.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarCuenta)) {
                gestionCuentaContable.nuevaCuentaEntity = {
                    codigoCuenta: appConstant.VALIDAR_STRING(gestionCuentaContable.nuevaCuenta.codigo),
                    nombreCuenta: appConstant.VALIDAR_STRING(gestionCuentaContable.nuevaCuenta.nombre),
                    clase: gestionCuentaContable.nuevaCuenta.tipo
                };
                if (gestionCuentaContable.nuevaCuenta.id === null
                    || gestionCuentaContable.nuevaCuenta.id === 'undefined') {
                    gestionCuentaContable.onAgregarCuenta(gestionCuentaContable.nuevaCuentaEntity);
                } else {
                    gestionCuentaContable.nuevaCuentaEntity['id'] = gestionCuentaContable.nuevaCuenta.id;
                    gestionCuentaContable.onUpdateCuenta(gestionCuentaContable.nuevaCuentaEntity);
                }

            }
        };

        gestionCuentaContable.onAgregarCuenta = function (cuentaContable) {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            cuentasContablesEntityServices.registrarCuenta(cuentaContable).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(data.message);
                        gestionCuentaContable.onLimpiar();
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                }
            });
        };

        gestionCuentaContable.onUpdateCuenta = function (cuentaContable) {
            cuentasContablesEntityServices.modificarCuenta(cuentaContable).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                }
                gestionCuentaContable.cuenta = {
                    codigoCuenta: appConstant.VALIDAR_STRING(data.codigo),
                    nombreCuenta: appConstant.VALIDAR_STRING(data.nombre),
                    tipo: data.tipo
                };
                localStorageService.set('nuevaCuenta', gestionCuentaContable.cuenta);
            });
        };

        gestionCuentaContable.onEliminarCuenta = function (item) {
            gestionCuentaContable.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CUENTA_CONTABLE,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                var entidadCuenta = {
                    codigo: item.codigo,
                    nombre: item.nombre,
                    tipo: item.tipo,
                    estadoLogico: item.estadoLogico,
                    id: item.id
                };
                cuentasContablesEntityServices.eliminarCuentasContables(entidadCuenta).then(function (data) {
                    swal({
                        title: appGenericConstant.CUENTA_CONTABLE_ELIMINADA,
                        text: appGenericConstant.CUENTA_CONTABLE_ELIMINADA_SATIS,
                        type: appGenericConstant.SUCCESS
                    });
                    volverConsultarCuentas();
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_ERROR(appGenericConstant.CUENTA_CONTABLE_NO_ELIMINADA, appGenericConstant.WARNING);
                    return;
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionCuentaContable.report.selected.length = null;
                }
            });
        };
        gestionCuentaContable.onEliminarMasivo = function () {
            var cuentasEliminar = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CUENTAS_CONTABLES,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                angular.forEach(gestionCuentaContable.report.selected, function (value, key) {
                    cuentasEliminar.push(value.id);
                });
                cuentasContablesEntityServices.eliminarMasivoCuentasContables(cuentasEliminar).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal({
                                title: appGenericConstant.CUENTAS_CONTABLES_ELIMINADA,
                                text: appGenericConstant.CUENTAS_CONTABLES_ELIMINADAS_SATIS,
                                type: appGenericConstant.SUCCESS
                            });
                            ejecutarConsultarCuentas();
                            gestionCuentaContable.report.selected.length = null;
                            break;
                        default:
                            appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                            break;
                        case 409:
                            appConstant.MSG_ERROR(appGenericConstant.ALGUNAS_CUENTAS_CONTABLES, appGenericConstant.WARNING);
                            break;
                    }
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        function ejecutarConsultarCuentas() {
            gestionCuentaContable.counter = 0;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            cuentasContablesEntityServices.listadoCuentasContables().then(function (data) {
                gestionCuentaContable.listCuentasContables = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        var refreshTabla = function counter() {
            gestionCuentaContable.counter = gestionCuentaContable.counter + 1;
            if (gestionCuentaContable.counter === 10) {
                cuentasContablesEntityServices.listadoCuentasContables().then(function (data) {
                    gestionCuentaContable.listCuentasContables = data;
                    gestionCuentaContable.counter = 0;
                });
            }
        };

        //

        gestionCuentaContable.cancelarInterval = function () {
            //
        }

        function volverConsultarCuentas() {
            cuentasContablesEntityServices.listadoCuentasContables().then(function (data) {
                gestionCuentaContable.listCuentasContables = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        $(".nombreCuenta").keypress(function (key) {
            if ((key.charCode < 97 || key.charCode > 122)//letras mayusculas
                && (key.charCode < 65 || key.charCode > 90) //letras minusculas
                && (key.charCode !== 45) //retroceso
                && (key.charCode !== 241) //ñ
                && (key.charCode !== 209) //Ñ
                && (key.charCode !== 32) //espacio
                && (key.charCode !== 225) //á
                && (key.charCode !== 233) //é
                && (key.charCode !== 237) //í
                && (key.charCode !== 243) //ó
                && (key.charCode !== 250) //ú
                && (key.charCode !== 193) //Á
                && (key.charCode !== 201) //É
                && (key.charCode !== 205) //Í
                && (key.charCode !== 211) //Ó
                && (key.charCode !== 218) //Ú

            )
                return false;
        });

        onListarTipoCuentas();
        ejecutarConsultarCuentas();
    }
})();


