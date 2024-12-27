(function () {
    'use strict';
    angular.module('mytodoApp').controller('EntidadesBancariasRecaudosCtrl', EntidadesBancariasRecaudosCtrl);

    EntidadesBancariasRecaudosCtrl.$inject = ['$scope', 'entidadesBancariasService', 'growl', 'ValidationService', '$location', 'localStorageService', 'appConstant', '$interval', 'appGenericConstant'];

    function EntidadesBancariasRecaudosCtrl($scope, entidadesBancariasService, growl, ValidationService, $location, localStorageService, appConstant, $interval, appGenericConstant) {

        var entidadesBancariasRecaudoControl = this;
        entidadesBancariasRecaudoControl.entidBancariasRecaudos = [];
        entidadesBancariasRecaudoControl.listEstado = [];
        entidadesBancariasRecaudoControl.listTelefonosAux = [];
        entidadesBancariasRecaudoControl.listDireccionesAux = [];
        entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo = entidadesBancariasService.entidadBancariaRecaudo;
        entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar = entidadesBancariasService.entidadBancariaRecaudoAuxiliar;
        entidadesBancariasRecaudoControl.visible = entidadesBancariasService.visible;
        entidadesBancariasRecaudoControl.visible.validaTelefono = false;
        entidadesBancariasRecaudoControl.visible.validaNit = false;
        entidadesBancariasRecaudoControl.counter = 0;

        entidadesBancariasRecaudoControl.config = { globalTimeToLive: 5000, disableCountDown: true };

        entidadesBancariasRecaudoControl.options = appConstant.FILTRO_TABLAS;

        entidadesBancariasRecaudoControl.selectedOption = entidadesBancariasRecaudoControl.options[1];

        entidadesBancariasRecaudoControl.report = {
            selected: null
        };

        cargarListas();

        function cargarTablas() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            entidadesBancariasRecaudoControl.counter = 0;
            entidadesBancariasService.consultarEntidadesBancarias().then(function (data) {
                entidadesBancariasRecaudoControl.entidBancariaRecaudo = [];
                entidadesBancariasRecaudoControl.entidBancariasRecaudos = [];
                angular.forEach(data, function (value) {
                    entidadesBancariasRecaudoControl.entidBancariaRecaudo = {
                        codigoBanco: value.codigoBanco,
                        nombreBanco: value.nombreBanco,
                        estadoBanco: value.estadoBanco,
                        codigoEstado: value.codigoEstado,
                        abreviaturaBanco: value.abreviaturaBanco,
                        numeroCuentaBanco: value.numeroCuentaBanco,
                        direccionBanco: value.direccionBanco,
                        telefonoBanco: value.telefonoBanco,
                        representanteLegalBanco: value.representanteLegalBanco,
                        nitBanco: value.nitBanco,
                        id: value.id
                    };
                    entidadesBancariasRecaudoControl.entidBancariasRecaudos.push(entidadesBancariasRecaudoControl.entidBancariaRecaudo);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        var refreshTabla = function counter() {
            entidadesBancariasRecaudoControl.counter = entidadesBancariasRecaudoControl.counter + 1;
            if (entidadesBancariasRecaudoControl.counter === 10) {
                entidadesBancariasService.consultarEntidadesBancarias().then(function (data) {
                    entidadesBancariasRecaudoControl.entidBancariaRecaudo = [];
                    entidadesBancariasRecaudoControl.entidBancariasRecaudos = [];
                    angular.forEach(data, function (value) {
                        entidadesBancariasRecaudoControl.entidBancariaRecaudo = {
                            codigoBanco: value.codigoBanco,
                            nombreBanco: value.nombreBanco,
                            estadoBanco: value.estadoBanco,
                            codigoEstado: value.codigoEstado,
                            abreviaturaBanco: value.abreviaturaBanco,
                            numeroCuentaBanco: value.numeroCuentaBanco,
                            direccionBanco: value.direccionBanco,
                            telefonoBanco: value.telefonoBanco,
                            representanteLegalBanco: value.representanteLegalBanco,
                            nitBanco: value.nitBanco,
                            id: value.id
                        };
                        entidadesBancariasRecaudoControl.entidBancariasRecaudos.push(entidadesBancariasRecaudoControl.entidBancariaRecaudo);
                    });
                    entidadesBancariasRecaudoControl.counter = 0;
                });
            }
        }

        //

        entidadesBancariasRecaudoControl.cancelarInterval = function () {
            //
        }

        if (localStorageService.get('nuevoEntidadBancariaRecaudo') !== null) {
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo = localStorageService.get('nuevoEntidadBancariaRecaudo');
        }

        if (localStorageService.get('entidadBancariaRecaudoAuxiliar') !== null) {
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar = localStorageService.get('entidadBancariaRecaudoAuxiliar');
        }

        function cargarListas() {
            entidadesBancariasService.consultarListaEstados().then(function (data) {
                entidadesBancariasRecaudoControl.listEstado = data;
            });
        }

        entidadesBancariasRecaudoControl.onLimpiar = function () {
            entidadesBancariasRecaudoControl.limpiar();
            new ValidationService().resetForm($scope.formRegisEntidadesBancarias);
        };

        entidadesBancariasRecaudoControl.limpiar = function () {
            var nuevoEntidadBancariaRecaudo = localStorageService.get('nuevoEntidadBancariaRecaudo');
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.codigoBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nombreBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.estadoBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.abreviaturaBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.numeroCuentaBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.direccionBanco = [];
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco = [];
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.representanteLegalBanco = null;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco = null;
            localStorageService.set('nuevoEntidadBancariaRecaudo', entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo);
            localStorageService.remove('entidadBancariaRecaudoAuxiliar', {});
        };

        entidadesBancariasRecaudoControl.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formRegisEntidadesBancarias)) {
                new ValidationService().resetForm($scope.formRegisEntidadesBancarias);
                entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity = {
                    codigoBanco: appConstant.VALIDAR_STRING(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.codigoBanco),
                    nombreBanco: appConstant.VALIDAR_STRING(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nombreBanco),
                    abreviaturaBanco: appConstant.VALIDAR_STRING(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.abreviaturaBanco),
                    numeroCuentaBanco: parseInt(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.numeroCuentaBanco),
                    direccionBanco: appConstant.VALIDAR_STRING(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.direccionBanco),// entidadesBancariasRecaudoControl.listDireccionesAux,
                    telefonoBanco: entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco,// entidadesBancariasRecaudoControl.listTelefonosAux,
                    representanteLegalBanco: appConstant.VALIDAR_STRING(entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.representanteLegalBanco),
                    nitBanco: entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco,
                    estadoBanco: 48
                };
                if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id === null
                    || entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id === 'undefined') {
                    entidadesBancariasRecaudoControl.onAgregarEntidadBancaria(entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity);

                } else {
                    entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.estadoBanco = entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.estadoBanco;
                    entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.id = entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id;
                    entidadesBancariasRecaudoControl.onUpdateEntidadBancaria(entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity);
                }
            }
        };

        entidadesBancariasRecaudoControl.onAgregar = function () {
            entidadesBancariasRecaudoControl.limpiar();
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledestado = false;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledCodeField = false;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showEditBtn = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabled = false;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showClearBtn = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.titleWindow = appGenericConstant.AGREGAR_ENTIDAD_BANCARIA;
            localStorageService.set('entidadBancariaRecaudoAuxiliar', entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar);
        };

        entidadesBancariasRecaudoControl.onEliminar = function (item) {
            entidadesBancariasRecaudoControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_ENTIDAD_BANCARIA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                var entidadBancariaRecaudo = {
                    codigo: item.codigo,
                    nombre: item.nombre,
                    abreviatura: item.abreviatura,
                    numeroCuenta: item.numeroCuenta,
                    direccion: item.direccion,
                    telefono: item.telefono,
                    representanteLegal: item.representanteLegal,
                    nit: item.nit,
                    estado: item.estado,
                    id: item.id
                };
                entidadesBancariasService.eliminarEntidadBancaria(entidadBancariaRecaudo.id).then(function (data) {
                    if (data.tipo === 200) {
                        swal(appGenericConstant.ENTIDAD_BANCARIA_ELIMINADA,
                            appGenericConstant.ENTIDAD_BANCARIA_ELIMINADA_SATIS,
                            appGenericConstant.SUCCESS);
                        cargarTablas();
                    } else if (data.tipo === 409) {

                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }


                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.BANCO_NO_ELIMINAR);
                    return;
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    entidadesBancariasRecaudoControl.report.selected.length = null;
                    cargarTablas();
                }
            });
        };

        entidadesBancariasRecaudoControl.onEliminarMasivo = function () {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_ENTIDADES_BANCARIAS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                var listaEntidadesEliminar = [];
                angular.forEach(entidadesBancariasRecaudoControl.report.selected, function (value, key) {
                    var entidadBancariaRecaudo = {
                        id: value.id
                    };
                    listaEntidadesEliminar.push(entidadBancariaRecaudo.id);
                });
                entidadesBancariasService.eliminarEntidadBancariaMasivo(listaEntidadesEliminar).then(function (data) {
                    if (data.tipo === 200) {
                        swal(appGenericConstant.ENTIDADES_BANCARIAS_ELIMINADAS,
                            appGenericConstant.ENTIDADES_BANCARIAS_ELIMINADAS_SATIS,
                            appGenericConstant.SUCCESS);
                        cargarTablas();
                        entidadesBancariasRecaudoControl.report.selected.length = null;
                    } else if (data.tipo === 409) {


                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    entidadesBancariasRecaudoControl.report.selected.length = null;
                    cargarTablas();
                }
            });
        };

        entidadesBancariasRecaudoControl.onUpdateEntidadBancaria = function (entBancariaRecaudo) {
            if (entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.telefonoBanco.length === 10 &&
                entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.nitBanco.length === 11) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                entidadesBancariasService.actualizarEntidadBancaria(entBancariaRecaudo).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                        entidadesBancariasRecaudoControl.banco = {
                            codigoBanco: entBancariaRecaudo.codigoBanco,
                            nombreBanco: entBancariaRecaudo.nombreBanco,
                            abreviaturaBanco: entBancariaRecaudo.abreviaturaBanco,
                            numeroCuentaBanco: entBancariaRecaudo.numeroCuentaBanco,
                            direccionBanco: entBancariaRecaudo.direccionBanco,
                            telefonoBanco: entBancariaRecaudo.telefonoBanco,
                            representanteLegalBanco: entBancariaRecaudo.representanteLegalBanco,
                            nitBanco: entBancariaRecaudo.nitBanco,
                            estadoBanco: entBancariaRecaudo.estadoBanco,
                            id: data.id
                        };
                        localStorageService.set('nuevoEntidadBancariaRecaudo', entidadesBancariasRecaudoControl.banco);
                    } else if (data.tipo === 409) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_NIT_INGRESADO);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            }
            entidadesBancariasRecaudoControl.validaTellenonoNit();
        };

        entidadesBancariasRecaudoControl.onAgregarEntidadBancaria = function (entidadBancariaRecaudo) {
            if (entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.telefonoBanco.length === 10 &&
                entidadesBancariasRecaudoControl.entidadBancariaRecaudoEntity.nitBanco.length === 11) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                entidadesBancariasService.agregarEntidadBancaria(entidadBancariaRecaudo).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        entidadesBancariasRecaudoControl.onLimpiar();
                    }
                    else if (data.tipo === 409) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            }
            entidadesBancariasRecaudoControl.validaTellenonoNit();
        };
        entidadesBancariasRecaudoControl.validaTellenonoNit = function () {
            if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco !== null) {
                if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco.length === 0) {
                    entidadesBancariasRecaudoControl.visible.validaTelefono = false;

                } else if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco.length !== 10) {
                    entidadesBancariasRecaudoControl.visible.validaTelefono = true;
                } else {
                    entidadesBancariasRecaudoControl.visible.validaTelefono = false;
                }
            }

            if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco !== null) {
                if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco.length === 0) {
                    entidadesBancariasRecaudoControl.visible.validaNit = false;

                } else if (entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco.length !== 11) {
                    entidadesBancariasRecaudoControl.visible.validaNit = true;
                } else {
                    entidadesBancariasRecaudoControl.visible.validaNit = false;
                }
            }
        };


        entidadesBancariasRecaudoControl.onVerEntidadBancaria = function (item) {
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id = item.id;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.codigoBanco = item.codigoBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nombreBanco = item.nombreBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.estadoBanco = item.codigoEstado;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.abreviaturaBanco = item.abreviaturaBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.numeroCuentaBanco = item.numeroCuentaBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.direccionBanco = item.direccionBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco = item.telefonoBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.representanteLegalBanco = item.representanteLegalBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco = item.nitBanco;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledestado = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabled = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledCodeField = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.titleWindow = appGenericConstant.DETALLE_ENTIDAD_RECAUDO;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showEditBtn = false;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showClearBtn = false;

            localStorageService.set('nuevoEntidadBancariaRecaudo', entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo);
            localStorageService.set('entidadBancariaRecaudoAuxiliar', entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar);
            $location.path('/gestionar-entidad-banco-recaudo');
        };

        entidadesBancariasRecaudoControl.onEditar = function (item) {
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.id = item.id;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.codigoBanco = item.codigoBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nombreBanco = item.nombreBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.estadoBanco = item.codigoEstado;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.abreviaturaBanco = item.abreviaturaBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.numeroCuentaBanco = item.numeroCuentaBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.direccionBanco = item.direccionBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.telefonoBanco = item.telefonoBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.representanteLegalBanco = item.representanteLegalBanco;
            entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo.nitBanco = item.nitBanco;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabled = false;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledestado = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.disabledCodeField = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.titleWindow = appGenericConstant.MODIFICAR_ENTIDAD_BANCARIA;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showEditBtn = true;
            entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar.showClearBtn = false;

            localStorageService.set('nuevoEntidadBancariaRecaudo', entidadesBancariasRecaudoControl.nuevoEntidadBancariaRecaudo);
            localStorageService.set('entidadBancariaRecaudoAuxiliar', entidadesBancariasRecaudoControl.entidadBancariaRecaudoAuxiliar);
            $location.path('/gestionar-entidad-banco-recaudo');
        };

        entidadesBancariasRecaudoControl.validarCambios = function (entBancariaRecaudo) {

            var accionEditar = false;

            if (localStorageService.get('nuevoEntidadBancariaRecaudo').nombre !== entBancariaRecaudo.nombre) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoEntidadBancariaRecaudo').abreviatura
                !== entBancariaRecaudo.abreviatura) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoEntidadBancariaRecaudo').numeroCuenta
                !== entBancariaRecaudo.numeroCuenta) {
                accionEditar = true;
            }

            if (JSON.stringify(localStorageService.get('nuevoEntidadBancariaRecaudo').direccion)
                !== JSON.stringify(entBancariaRecaudo.direccion)) {
                accionEditar = true;
            }

            if (JSON.stringify(localStorageService.get('nuevoEntidadBancariaRecaudo').telefono)
                !== JSON.stringify(entBancariaRecaudo.telefono)) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoEntidadBancariaRecaudo').representanteLegal
                !== entBancariaRecaudo.representanteLegal) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoEntidadBancariaRecaudo').nit
                !== entBancariaRecaudo.nit) {
                accionEditar = true;
            }

            if (JSON.stringify(localStorageService.get('nuevoEntidadBancariaRecaudo').estado)
                !== JSON.stringify(entBancariaRecaudo.estado)) {
                accionEditar = true;
            }

            return accionEditar;

        };

        cargarTablas();

    }
})();