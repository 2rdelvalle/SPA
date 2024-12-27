(function () {
    'use strict';
    angular.module('mytodoApp').controller('CajaCtrl', CajaCtrl);
    CajaCtrl.$inject = ['$scope', 'cajaEntityServices', 'appConstant', '$location', 'ValidationService', 'localStorageService', 'utilServices', '$interval', 'appGenericConstant'];
    function CajaCtrl($scope, cajaEntityServices, appConstant, $location, ValidationService, localStorageService, utilServices, $interval, appGenericConstant) {

        var gestionCaja = this;

        gestionCaja.cajas = [];
        gestionCaja.cajeros = [];
        gestionCaja.cajaEntity = cajaEntityServices.entidad;
        gestionCaja.cajaEntityAuxiliar = cajaEntityServices.entidadAuxiliar;
        gestionCaja.visible = cajaEntityServices.visible;
        gestionCaja.visible.validaIdEquipo = false;
        gestionCaja.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionCaja.cola = [];
        gestionCaja.options = appConstant.FILTRO_TABLAS;
        gestionCaja.counter = appGenericConstant.CERO;

        gestionCaja.report = {
            selected: null
        };
        gestionCaja.selectedOption = gestionCaja.options[0];


        if (localStorageService.get('caja') !== null) {
            gestionCaja.cajaEntity = localStorageService.get('caja');
        }

        if (localStorageService.get('cajaAuxiliar') !== null) {
            gestionCaja.cajaEntityAuxiliar = localStorageService.get('cajaAuxiliar');
        }

        gestionCaja.onVerdetalle = function (item) {

            gestionCaja.cajaEntityAuxiliar.disableVerDetalle = true;
            gestionCaja.cajaEntityAuxiliar.disableCodigo = true;
            gestionCaja.cajaEntityAuxiliar.titulo = appGenericConstant.DETALLE_CAJA;
            gestionCaja.cajaEntity.codigo = item.codigo;
            gestionCaja.cajaEntity.nombre = item.nombre;
            gestionCaja.cajaEntity.identificacionEquipo = item.identificacionEquipo;
            gestionCaja.cajaEntity.ubicacion = item.ubicacion;
            gestionCaja.cajaEntity.estado = item.estado;
            gestionCaja.cajaEntity.cajero = item.cajaUsuario;
            gestionCaja.cajaEntity.id = item.id;

            $location.path('/cud-caja');
            localStorageService.set('caja', gestionCaja.cajaEntity);
            localStorageService.set('cajaAuxiliar', gestionCaja.cajaEntityAuxiliar);
        };
        gestionCaja.onUpdateCaja = function (item) {

            cajaEntityServices.listaCajeros(item.id).then(function (data) {

                gestionCaja.cajaEntityAuxiliar.disableVerDetalle = false;
                gestionCaja.cajaEntityAuxiliar.disableTablas = false;
                gestionCaja.cajaEntityAuxiliar.disableCodigo = true;
                gestionCaja.cajaEntityAuxiliar.titulo = appGenericConstant.MODIFICAR_CAJA;
                gestionCaja.cajaEntity.codigo = item.codigo;
                gestionCaja.cajaEntity.nombre = item.nombre;
                gestionCaja.cajaEntity.identificacionEquipo = item.identificacionEquipo;
                gestionCaja.cajaEntity.ubicacion = item.ubicacion;
                gestionCaja.cajaEntity.estado = item.estado;
                gestionCaja.cajaEntity.cajero = item.cajaUsuario;
                gestionCaja.cajaEntity.id = item.id;
                gestionCaja.cajaEntity.listaCajeros = comber(data);
                gestionCaja.cajaEntity.estadoMovimiento = item.estadoMovimiento;
                $location.path('/cud-caja');
                localStorageService.set('caja', gestionCaja.cajaEntity);
                localStorageService.set('cajaAuxiliar', gestionCaja.cajaEntityAuxiliar);

            });
        };

        function onBuscar() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionCaja.counter = appGenericConstant.CERO;
            cajaEntityServices.buscarCaja().then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionCaja.cajas = data;
            });
        }

        var refreshTabla = function counter() {
            gestionCaja.counter = gestionCaja.counter + appGenericConstant.UNO;
            if (gestionCaja.counter === appGenericConstant.DIEZ) {
                cajaEntityServices.buscarCaja().then(function (data) {
                    gestionCaja.cajas = data;
                });
                gestionCaja.counter = appGenericConstant.CERO;
            }
        };

        //

        gestionCaja.cancelarInterval = function () {
            //
        };

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', 'financiero').then(function (data) {
                gestionCaja.listaEstados = data;
            });
        }
        gestionCaja.limpiar = function () {
            cajaEntityServices.entidad = {};
            gestionCaja.cajaEntity.codigo = null;
            gestionCaja.cajaEntity.nombre = null;
            gestionCaja.cajaEntity.identificacionEquipo = null;
            gestionCaja.cajaEntity.ubicacion = null;
            gestionCaja.cajaEntity.estado = null;
            localStorageService.remove('caja');
            localStorageService.remove('cajaAuxiliar');
        };

        gestionCaja.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarCaja)) {
                if (gestionCaja.cajaEntity.id === null || gestionCaja.cajaEntity.id === undefined) {
                    gestionCaja.onRegistrarCaja();
                    new ValidationService().resetForm($scope.formRegistrarCaja);
                } else {
                    gestionCaja.onActualizarCaja();
                }
            }
        };

        gestionCaja.onClickToAddCaja = function () {
            gestionCaja.limpiar();
            gestionCaja.cajaEntityAuxiliar.disableTablas = true;
            gestionCaja.cajaEntityAuxiliar.disableVerDetalle = false;
            gestionCaja.cajaEntityAuxiliar.disableCodigo = false;
            gestionCaja.cajaEntityAuxiliar.titulo = appGenericConstant.AGREGAR_CAJA;
            localStorageService.set('caja', null);
            localStorageService.set('cajaAuxiliar', gestionCaja.cajaEntityAuxiliar);
        };

        gestionCaja.onRegistrarCaja = function () {
            var cajaNew = {
                codigo: gestionCaja.cajaEntity.codigo.toUpperCase(),
                nombre: gestionCaja.cajaEntity.nombre.toUpperCase(),
                identificacionEquipo: gestionCaja.cajaEntity.identificacionEquipo.toUpperCase(),
                ubicacion: gestionCaja.cajaEntity.ubicacion.toUpperCase(),
                estado: 'ACTIVO'
            };
            if (cajaNew.identificacionEquipo.length === appGenericConstant.DIECISIETE) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                cajaEntityServices.registrarCaja(cajaNew).then(function (data) {
                    if (data.tipo === appGenericConstant.ADVERTENCIA) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    } else if (data.tipo === appGenericConstant.OK) {
                        appConstant.CERRAR_SWAL();
                        gestionCaja.limpiar();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });

            }
            gestionCaja.ValidarIdEquipo();
        };

        gestionCaja.ValidarIdEquipo = function () {
            if (gestionCaja.cajaEntity.identificacionEquipo !== null) {
                if (typeof gestionCaja.cajaEntity.identificacionEquipo === 'undefined') {
                    gestionCaja.visible.validaIdEquipo = false;

                } else if (gestionCaja.cajaEntity.identificacionEquipo.length !== appGenericConstant.DIECISIETE) {
                    gestionCaja.visible.validaIdEquipo = true;
                } else if (gestionCaja.cajaEntity.identificacionEquipo.length === appGenericConstant.CERO) {
                    gestionCaja.visible.validaIdEquipo = false;
                } else {
                    gestionCaja.visible.validaIdEquipo = false;
                }
            }
        };

        gestionCaja.onRemoveCaja = function (item) {
            gestionCaja.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CAJA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {

                //                    if ((typeof item.cajero === 'object') && (item.cajero.length === appGenericConstant.CERO)) {
                cajaEntityServices.deleteCaja(item).then(function (data) {

                    if (data.tipo === appGenericConstant.OK) {
                        swal(appGenericConstant.CAJA_ELIMINADA,
                                appGenericConstant.CAJA_ELIMINADA_SATIS,
                                appGenericConstant.SUCCESS
                                );
                        onBuscar();
                    } else if (data.tipo === appGenericConstant.ADVERTENCIA) {
                        swal(
                                appGenericConstant.ALTO_AHI,
                                appGenericConstant.CAJA_NO_ELIMINADA,
                                appGenericConstant.WARNING
                                );
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });

            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionCaja.report.selected.length = null;
                }
            });
        };

        gestionCaja.selectCajeros = function (cajero) {
            if (gestionCaja.cajaEntity.cajero !== undefined) {
                gestionCaja.cola = gestionCaja.cajaEntity.cajero;
            }
            gestionCaja.cola.push(cajero);
            gestionCaja.cajaEntity.cajero = gestionCaja.cola;

            var index = gestionCaja.cajaEntity.listaCajeros.indexOf(cajero);
            gestionCaja.cajaEntity.listaCajeros.splice(index, 1);

        };

        gestionCaja.removeCajerosEdit = function (cajero) {

            if (gestionCaja.cajaEntity.listaCajeros !== undefined) {
                gestionCaja.cajaEntity.listaCajeros = gestionCaja.cajaEntity.listaCajeros;
            }
            gestionCaja.cajaEntity.listaCajeros.push(cajero);
            gestionCaja.cajaEntity.listaCajeros = gestionCaja.cajaEntity.listaCajeros;

            var index = gestionCaja.cajaEntity.cajero.indexOf(cajero);
            gestionCaja.cajaEntity.cajero.splice(index, 1);
        };

        gestionCaja.onActualizarCaja = function () {

            var cajaNew = {
                codigo: gestionCaja.cajaEntity.codigo.toUpperCase(),
                nombre: gestionCaja.cajaEntity.nombre.toUpperCase(),
                identificacionEquipo: gestionCaja.cajaEntity.identificacionEquipo.toUpperCase(),
                cajaUsuario: gestionCaja.cajaEntity.cajero,
                ubicacion: gestionCaja.cajaEntity.ubicacion.toUpperCase(),
                estado: gestionCaja.cajaEntity.estado,
                estadoMovimiento: gestionCaja.cajaEntity.estadoMovimiento,
                id: gestionCaja.cajaEntity.id
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            cajaEntityServices.registrarCaja(cajaNew).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('caja', gestionCaja.cajaEntity);
                } else if (data.tipo === appGenericConstant.ADVERTENCIA) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionCaja.onDeleteMasivoCaja = function () {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CAJAS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                var listaCajaE = [];
                angular.forEach(gestionCaja.report.selected, function (value, key) {
                    listaCajaE.push(value.id);
                });
                cajaEntityServices.deleteCajaMasivo(listaCajaE).then(function (data) {
                    gestionCaja.report.selected.length = null;
                    if (data.tipo === appGenericConstant.OK) {
                        swal(appGenericConstant.CAJAS_ELIMINADAS,
                                appGenericConstant.CAJAS_ELIMINADAS_SATIS,
                                appGenericConstant.SUCCESS
                                );

                        onBuscar();
                    } else if (data.tipo === appGenericConstant.ADVERTENCIA) {
                        swal(appGenericConstant.ALGUNAS_CAJA,
                                '',
                                appGenericConstant.WARNING
                                );
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionCaja.report.selected.length = null;
                }
            });
        };

        function comber(cajeros) {
            var listaCajeros = [];
            angular.forEach(cajeros, function (value, key) {
                var cajeros = {
                    id: null,
                    idCaja: gestionCaja.cajaEntity.id,
                    idUsuario: value.id,
                    nombre: value.nombres,
                    apellido: value.apellidos,
                    identificacion: value.identificacion
                };
                listaCajeros.push(cajeros);
            });
            return listaCajeros;
        }
        onBuscar();
        onConsultarListaEstados();

    }
})();