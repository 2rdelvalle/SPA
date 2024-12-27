(function () {
    'use strict';
    angular.module('mytodoApp').controller('PrerequisitosInscripcionCtrl', PrerequisitosInscripcionCtrl);

    PrerequisitosInscripcionCtrl.$inject = ['$scope', 'prerequisitosService', 'growl', 'ValidationService', '$location', 'localStorageService', 'utilServices','appConstant','appGenericConstant'];
    function PrerequisitosInscripcionCtrl($scope, prerequisitosService, growl, ValidationService, $location, localStorageService, utilServices,appConstant,appGenericConstant) {
        var prerequisitoInscripControl = this;
        prerequisitoInscripControl.prerequisitos = [];
        prerequisitoInscripControl.listTipoRequisito = [];
        prerequisitoInscripControl.listEstado = [];
        prerequisitoInscripControl.listObligatorio = [];
        prerequisitoInscripControl.nuevoPrerequisito = prerequisitosService.prerequisito;
        prerequisitoInscripControl.prerequisitoAuxiliar = prerequisitosService.prerequisitoAuxiliar;
        prerequisitoInscripControl.listCaracteristica = [];
        prerequisitoInscripControl.config = { globalTimeToLive: 5000, disableCountDown: true };
        prerequisitoInscripControl.areaDefault = { id: "1", codigo: "A001", nombre: "si" };
        prerequisitoInscripControl.options = appConstant.FILTRO_TABLAS;
        prerequisitoInscripControl.selectedOption = prerequisitoInscripControl.options[1];
        prerequisitoInscripControl.report = { selected: null };
        function cargarTablas() {
            prerequisitosService.consultarPreinscripciones().then(function (data) {
                prerequisitoInscripControl.prerequisitos = [];
                prerequisitoInscripControl.prerequisito = [];
                angular.forEach(data, function (value) {
                    prerequisitoInscripControl.prerequisito = {
                        id: value.id,
                        codigoRequisito: value.codigoRequisito,
                        nombreRequesito: value.nombreRequesito,
                        descripcionRequisito: value.descripcionRequisito,
                        estado: value.estado,
                        tipoRequisito: value.tipoRequisito,
                        nombreTipoRequisito: value.nombreTipoRequisito,
                        caracteristica: value.caracteristica,
                        nombreCaracteristica: value.nombreCaracteristica,
                        obligatorio: value.obligatorio,
                        requisito: value.requisito
                    };
                    prerequisitoInscripControl.prerequisitos.push(prerequisitoInscripControl.prerequisito);
                });
            });
        }
        if (localStorageService.get('nuevoPrerequisito') !== null) {
            prerequisitoInscripControl.nuevoPrerequisito = localStorageService.get('nuevoPrerequisito');
        }
        if (localStorageService.get('prerequisitoAuxiliar') !== null) {
            prerequisitoInscripControl.prerequisitoAuxiliar = localStorageService.get('prerequisitoAuxiliar');
        }
        function cargarListas() {
            utilServices.buscarListaValorByCategoria('TIPO_REQUISITO','configeneral').then(function (data) {
                prerequisitoInscripControl.listTipoRequisito = data;
            });

            utilServices.buscarListaValorByCategoria('CARACTERISTICA_REQUISITO','configeneral').then(function (data) {
                prerequisitoInscripControl.listCaracteristica = data;
            });

            var listaEstados = [];
            utilServices.buscarListaValorByCategoria('ESTADO','configeneral').then(function (data) {
                angular.forEach(data, function (value, key) {
                    listaEstados.push(value.valor);
                });
                prerequisitoInscripControl.listEstado = listaEstados;
            });

        }
        prerequisitoInscripControl.onLimpiar = function () {
            prerequisitoInscripControl.limpiar();
            new ValidationService().resetForm($scope.formRegisPreinscripcion);
        };
        prerequisitoInscripControl.limpiar = function () {
            var nuevoPrerequisito = localStorageService.get('nuevoPrerequisito');
            prerequisitoInscripControl.nuevoPrerequisito.id = null;
            prerequisitoInscripControl.nuevoPrerequisito.codigoRequisito = null;
            prerequisitoInscripControl.nuevoPrerequisito.nombreRequesito = null;
            prerequisitoInscripControl.nuevoPrerequisito.caracteristica = null;
            prerequisitoInscripControl.nuevoPrerequisito.descripcionRequisito = null;
            prerequisitoInscripControl.nuevoPrerequisito.estado = null;
            prerequisitoInscripControl.nuevoPrerequisito.tipoRequisito = null;
            prerequisitoInscripControl.nuevoPrerequisito.obligatorio = appGenericConstant.NO_MAYUS;
            prerequisitoInscripControl.nuevoPrerequisito.requisito = appGenericConstant.NO_MAYUS;
            localStorageService.set('nuevoPrerequisito', prerequisitoInscripControl.nuevoPrerequisito);
        };
        prerequisitoInscripControl.onGuardar = function () {

            if (new ValidationService().checkFormValidity($scope.formRegisPreinscripcion)) {
                var codigoUpper = prerequisitoInscripControl.nuevoPrerequisito.codigoRequisito;
                var nombreUpper = prerequisitoInscripControl.nuevoPrerequisito.nombreRequesito;
                if (prerequisitoInscripControl.nuevoPrerequisito.id === null
                    || prerequisitoInscripControl.nuevoPrerequisito.id === 'undefined') {
                    prerequisitoInscripControl.nuevoPrerequisito.estado = 'ACTIVO';
                }
                if (typeof codigoUpper === 'string') {
                    codigoUpper = codigoUpper.toUpperCase();
                }
                if (typeof nombreUpper === 'string') {
                    nombreUpper = nombreUpper.toUpperCase();
                }
                prerequisitoInscripControl.prerequisitoEntity = {
                    codigoRequisito: codigoUpper,
                    nombreRequesito: nombreUpper,
                    caracteristica: prerequisitoInscripControl.nuevoPrerequisito.caracteristica,
                    descripcionRequisito: prerequisitoInscripControl.nuevoPrerequisito.descripcionRequisito,
                    tipoRequisito: prerequisitoInscripControl.nuevoPrerequisito.tipoRequisito,
                    estado: prerequisitoInscripControl.nuevoPrerequisito.estado,
                    obligatorio: prerequisitoInscripControl.nuevoPrerequisito.obligatorio,
                    requisito: prerequisitoInscripControl.nuevoPrerequisito.requisito
                };
                if (prerequisitoInscripControl.nuevoPrerequisito.id === null || prerequisitoInscripControl.nuevoPrerequisito.id === 'undefined') {
                    prerequisitoInscripControl.onAgregarPrerequisito(prerequisitoInscripControl.prerequisitoEntity);
                } else {
                    prerequisitoInscripControl.prerequisitoEntity['id'] = prerequisitoInscripControl.nuevoPrerequisito.id;
                    prerequisitoInscripControl.onUpdatePrerequisito(prerequisitoInscripControl.prerequisitoEntity);
                }
            }
        };
        prerequisitoInscripControl.onAgregar = function () {
            prerequisitoInscripControl.limpiar();
            prerequisitoInscripControl.prerequisitoAuxiliar.disabledCodeField = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.showEditBtn = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.disabled = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.showClearBtn = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.showeEditBtn2 = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.inputenabled = "";
            prerequisitoInscripControl.prerequisitoAuxiliar.titleWindow = appGenericConstant.AGREGAR_REQUISITO;
            localStorageService.set('prerequisitoAuxiliar', prerequisitoInscripControl.prerequisitoAuxiliar);
        };
        prerequisitoInscripControl.onEliminar = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_REQUISITO,
                type: appGenericConstant.QUESTION,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                prerequisitosService.eliminarPrerequisito(item).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.REQUISITO_ELIMINADO,appGenericConstant.REQUISITO_ELIMINADO_SATI, appGenericConstant.SUCCESS);
                            cargarTablas();
                            break;
                        case 400:
                            swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.REQUISITO_NO_ELIMINADO, appGenericConstant.WARNING);
                            break;
                    }
                    prerequisitoInscripControl.report.selected.length = null;
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    prerequisitoInscripControl.report.selected.length = null;
                }
            });
        };
        prerequisitoInscripControl.onEliminarMasivo = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_REQUISITOS,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false,
                closeOnCancel: true
            }).then(function () {
                angular.forEach(prerequisitoInscripControl.report.selected, function (value, key) {
                    listaElementosEliminar.push(value.id);
                });
                prerequisitosService.eliminarMasivoPrerequisito(listaElementosEliminar).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.REQUISITOS_ELIMINADOS, appGenericConstant.REQUISITOS_ELIMINADOS_SATIS, appGenericConstant.SUCCESS);
                            cargarTablas();
                            break;
                        case 400:
                            swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ALGUNOS_REQUISITOS, appGenericConstant.WARNING);
                            break;
                    }
                    prerequisitoInscripControl.report.selected.length = null;
                });
                prerequisitoInscripControl.report.selected.length = null;
            },function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };
        prerequisitoInscripControl.onUpdatePrerequisito = function (Prerequisito) {
            if (prerequisitoInscripControl.validarCambios(Prerequisito)) {
                prerequisitosService.actualizarPrerequisito(Prerequisito).then(function (data) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('nuevoPrerequisito', data);
                });
            } else {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
            }
        };
        prerequisitoInscripControl.onAgregarPrerequisito = function (Prerequisito) {
            prerequisitosService.agregarPrerequisito(Prerequisito).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        prerequisitoInscripControl.onLimpiar();
                        break;
                    case 400:
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CODIGO_REGISTRO_EXISTE);
                        break;
                    case 500:
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CODIGO_REGISTRO_EXISTE);
                        break;
                }
            });
        };
        prerequisitoInscripControl.onVerPrerequisto = function (item) {
            prerequisitoInscripControl.nuevoPrerequisito.id = item.id;
            prerequisitoInscripControl.nuevoPrerequisito.codigoRequisito = item.codigoRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.nombreRequesito = item.nombreRequesito;
            prerequisitoInscripControl.nuevoPrerequisito.caracteristica = item.caracteristica;
            prerequisitoInscripControl.nuevoPrerequisito.descripcionRequisito = item.descripcionRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.estado = item.estado;
            prerequisitoInscripControl.nuevoPrerequisito.tipoRequisito = item.tipoRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.obligatorio = item.obligatorio;
            prerequisitoInscripControl.nuevoPrerequisito.requisito = item.requisito;

            prerequisitoInscripControl.prerequisitoAuxiliar.disabled = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.disabledCodeField = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.titleWindow = appGenericConstant.DETALLE_REQUISITO;
            prerequisitoInscripControl.prerequisitoAuxiliar.showEditBtn = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.showeEditBtn2 = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.showClearBtn = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.inputenabled = "disabled";

            $location.path('/gestionar-maestros-requisitos');
            localStorageService.set('nuevoPrerequisito', prerequisitoInscripControl.nuevoPrerequisito);
            localStorageService.set('prerequisitoAuxiliar', prerequisitoInscripControl.prerequisitoAuxiliar);
        };
        prerequisitoInscripControl.onEditar = function (item) {
            prerequisitoInscripControl.nuevoPrerequisito.id = item.id;
            prerequisitoInscripControl.nuevoPrerequisito.codigoRequisito = item.codigoRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.nombreRequesito = item.nombreRequesito;
            prerequisitoInscripControl.nuevoPrerequisito.caracteristica = item.caracteristica;
            prerequisitoInscripControl.nuevoPrerequisito.descripcionRequisito = item.descripcionRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.estado = item.estado;
            prerequisitoInscripControl.nuevoPrerequisito.tipoRequisito = item.tipoRequisito;
            prerequisitoInscripControl.nuevoPrerequisito.obligatorio = item.obligatorio;
            prerequisitoInscripControl.nuevoPrerequisito.requisito = item.requisito;

            prerequisitoInscripControl.prerequisitoAuxiliar.disabled = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.disabledCodeField = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.titleWindow = appGenericConstant.MODIFICAR_REQUISITO;
            prerequisitoInscripControl.prerequisitoAuxiliar.showEditBtn = true;
            prerequisitoInscripControl.prerequisitoAuxiliar.showeEditBtn2 = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.showClearBtn = false;
            prerequisitoInscripControl.prerequisitoAuxiliar.inputenabled = "";
            $location.path('/gestionar-maestros-requisitos');
            localStorageService.set('nuevoPrerequisito', prerequisitoInscripControl.nuevoPrerequisito);
            localStorageService.set('prerequisitoAuxiliar', prerequisitoInscripControl.prerequisitoAuxiliar);
        };
        prerequisitoInscripControl.validarCambios = function (Prerequisito) {

            var accionEditar = false;
            if (localStorageService.get('nuevoPrerequisito').nombreRequesito !== Prerequisito.nombreRequesito) {
                accionEditar = true;
            }
            if (localStorageService.get('nuevoPrerequisito').descripcionRequisito !== Prerequisito.descripcionRequisito) {
                accionEditar = true;
            }
            if (JSON.stringify(localStorageService.get('nuevoPrerequisito').caracteristica)
                !== JSON.stringify(Prerequisito.caracteristica)) {
                accionEditar = true;
            }
            if (JSON.stringify(localStorageService.get('nuevoPrerequisito').obligatorio)
                !== JSON.stringify(Prerequisito.obligatorio)) {
                accionEditar = true;
            }
            if (JSON.stringify(localStorageService.get('nuevoPrerequisito').requisito)
                !== JSON.stringify(Prerequisito.requisito)) {
                accionEditar = true;
            }
            if (JSON.stringify(localStorageService.get('nuevoPrerequisito').tipoRequisito)
                !== JSON.stringify(Prerequisito.tipoRequisito)) {
                accionEditar = true;
            }
            if (JSON.stringify(localStorageService.get('nuevoPrerequisito').estado)
                !== JSON.stringify(Prerequisito.estado)) {
                accionEditar = true;
            }
            return accionEditar;
        };
        prerequisitoInscripControl.customValidationTipo = function () {
            var valido = function () {
                return (prerequisitoInscripControl.nuevoPrerequisito.tipoRequisito !== "0");
            };
            return { isValid: valido, message: appGenericConstant.SELECCIONE_TIPO };
        };
        prerequisitoInscripControl.customValidationEstado = function () {
            var valido = function () {
                return (prerequisitoInscripControl.nuevoPrerequisito.estado !== "0");
            };
            return { isValid: valido, message: appGenericConstant.SELECCIONE_ESTADO };
        };
        cargarTablas();
        cargarListas();
    }
})();