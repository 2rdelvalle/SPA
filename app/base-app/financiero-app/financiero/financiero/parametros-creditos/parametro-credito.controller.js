(function () {
    'use strict';
    angular.module('mytodoApp').controller('ParametrosCreditoCtrl', ParametrosCreditoCtrl);

    ParametrosCreditoCtrl.$inject = ['$scope', 'utilServices', 'parametrosCreditosServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'appConstant', '$interval', 'appGenericConstant'];
    function ParametrosCreditoCtrl($scope, utilServices, parametrosCreditosServices, $location, growl, ValidationService, localStorageService, appConstant, $interval, appGenericConstant) {

        var gestionParametroCredito = this;
        gestionParametroCredito.counter = 0;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionParametroCredito.formasPagos = [{
                id: 1,
                nombre: "PAGARÉ"
            }
        ];
        gestionParametroCredito.listCodigo = [
            {
                nombre: "SI"
            },
            {
                nombre: "NO"
            }
        ];
        gestionParametroCredito.listadoLineasDeCredito = [];
        gestionParametroCredito.parametrosCreditos = [];
        gestionParametroCredito.periodosAcademico = [];
        gestionParametroCredito.display;
        gestionParametroCredito.selectTodos = false;
        gestionParametroCredito.filtrados = [];
        gestionParametroCredito.parametroCredito = parametrosCreditosServices.parametroCredito;
        gestionParametroCredito.parametroCreditoAuxiliar = parametrosCreditosServices.parametroCreditoAuxiliar;
        //        gestionParametroCredito.parametroCredito.cuotaMaxima = 1;
        //        gestionParametroCredito.parametroCredito.cuotaMinima = 1;
        gestionParametroCredito.parametroCreditoAuxiliar.disableVerDetalle = false;
        gestionParametroCredito.options = appConstant.FILTRO_TABLAS;
        gestionParametroCredito.selectedOption = gestionParametroCredito.options[0];
        gestionParametroCredito.report = {
            selected: null
        };

        if (localStorageService.get('parametroCreditoView') !== null) {
            gestionParametroCredito.parametroCredito = localStorageService.get('parametroCreditoView');
        }

        if (localStorageService.get('parametroCreditoAuxiliar') !== null) {
            gestionParametroCredito.parametroCreditoAuxiliar = localStorageService.get('parametroCreditoAuxiliar');
        }

        gestionParametroCredito.onBlurValorMinimo = function () {
            if (gestionParametroCredito.parametroCredito.valorMinimo === 0) {
                gestionParametroCredito.parametroCredito.valorMinimo = 1;
            }

            if (gestionParametroCredito.parametroCredito.valorMinimo > 100) {
                gestionParametroCredito.parametroCredito.valorMinimo = 100;
            }
        };

        gestionParametroCredito.onBlurValorMaximo = function () {
            if (gestionParametroCredito.parametroCredito.valorMaximo === 0) {
                gestionParametroCredito.parametroCredito.valorMaximo = 1;
            }

            if (gestionParametroCredito.parametroCredito.valorMaximo > 100) {
                gestionParametroCredito.parametroCredito.valorMaximo = 100;
            }
        };

        gestionParametroCredito.onBlurInteresCorriente = function () {

            if (gestionParametroCredito.parametroCredito.interesCorriente > 100) {
                gestionParametroCredito.parametroCredito.interesCorriente = 100;
            }
        };

        gestionParametroCredito.onBlurInteresMora = function () {

            if (gestionParametroCredito.parametroCredito.interesMora > 100) {
                gestionParametroCredito.parametroCredito.interesMora = 100;
            }
        };

        /*Consultar Parámetros Créditos*/
        function onBuscarParametrosCreditos() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionParametroCredito.listadoLineasDeCredito = [];
            gestionParametroCredito.counter = 0;
            parametrosCreditosServices.buscarParametroCreditoByPeriodo().then(function (data) {
                angular.forEach(data, function (value, key) {
                    gestionParametroCredito.formaPagoEntity = {
                        id: 1,
                        nombre: "PAGARÉ"
                    };

                    var lineaParametroDeCredito = {
                        id: value.id,
                        periodoAcademico: value.periodoAcademico,
                        idLineaCredito: value.idLineaCredito,
                        idPeriodoAcademico: value.idPeriodoAcademico,
                        interesCorriente: value.interesCorriente,
                        interesMora: value.interesMora,
                        cuotaMinima: value.cuotaMinima,
                        cuotaMaxima: value.cuotaMaxima,
                        valorMinimo: value.valorMinimo,
                        valorMaximo: value.valorMaximo,
                        formaPago: gestionParametroCredito.formaPagoEntity,
                        nombreLineaCredito: value.nombreLineaCredito,
                        nombrePeriodoAcademico: value.periodoAcademico.nombrePeriodoAcademico,
                        estadoLineaCredito: value.estadoLineaCredito,
                        codigo: value.codigo,
                        nombre: value.nombre
                    };
                    gestionParametroCredito.listadoLineasDeCredito.push(lineaParametroDeCredito);

                });
                appConstant.CERRAR_SWAL();
            });
            localStorageService.set('parametroCredito', gestionParametroCredito.listadoLineasDeCredito);
        }

        var refreshTabla = function counter() {
            gestionParametroCredito.counter = gestionParametroCredito.counter + 1;
            if (gestionParametroCredito.counter === 10) {
                parametrosCreditosServices.buscarParametroCreditoByPeriodo().then(function (data) {
                    gestionParametroCredito.listadoLineasDeCredito = [];
                    angular.forEach(data, function (value, key) {
                        gestionParametroCredito.formaPagoEntity = {
                            id: 1,
                            nombre: "PAGARÉ"
                        };

                        var lineaParametroDeCredito = {
                            id: value.id,
                            periodoAcademico: value.periodoAcademico,
                            idLineaCredito: value.idLineaCredito,
                            idPeriodoAcademico: value.idPeriodoAcademico,
                            interesCorriente: value.interesCorriente,
                            interesMora: value.interesMora,
                            cuotaMinima: value.cuotaMinima,
                            cuotaMaxima: value.cuotaMaxima,
                            valorMinimo: value.valorMinimo,
                            valorMaximo: value.valorMaximo,
                            formaPago: gestionParametroCredito.formaPagoEntity,
                            nombreLineaCredito: value.nombreLineaCredito,
                            nombrePeriodoAcademico: value.periodoAcademico.nombrePeriodoAcademico,
                            estadoLineaCredito: value.estadoLineaCredito,
                            codigo: value.codigo,
                            nombre: value.nombre
                        };
                        gestionParametroCredito.listadoLineasDeCredito.push(lineaParametroDeCredito);

                    });
                    localStorageService.set('parametroCredito', gestionParametroCredito.listadoLineasDeCredito);
                    gestionParametroCredito.counter = 0;
                });
            }
        }

//        //

//        gestionParametroCredito.cancelarInterval = function () {
//            //
//        }

        gestionParametroCredito.onChangePeriodoAcademico = function () {
            if (gestionParametroCredito.parametroCredito.periodoAcademico !== null
                    && gestionParametroCredito.parametroCredito.periodoAcademico !== undefined
                    && gestionParametroCredito.parametroCredito.periodoAcademico !== '') {
                onBuscarParametrosCreditos(gestionParametroCredito.parametroCredito.periodoAcademico);
            } else {
                gestionParametroCredito.parametroCredito = parametrosCreditosServices.parametroCredito;
                localStorageService.set('parametroCredito', gestionParametroCredito.parametroCredito);
            }
            new ValidationService().resetForm($scope.formCrudParametroCredito);
        };

        //        function onBuscarPeriodosAcademicos() {
        //            parametrosCreditosServices.buscarPeriodoAcademico().then(function (data) {
        //                angular.forEach(data, function (value, key) {
        //                    var periodo = {
        //                        id: value.id,
        //                        nombre: value.nombre
        //                    };
        //                    gestionParametroCredito.periodosAcademico.push(periodo);
        //                });
        //            });
        //        }
        //
        function onBuscarFormasPago() {
            //            parametrosCreditosServices.buscarFormasPago().then(function (data) {

            //            });
        }

        /*Limpiar Entidad Parámetros Créditos*/
        function onLimpiar() {
            gestionParametroCredito.parametroCredito.id = null;
            gestionParametroCredito.parametroCredito.periodoAcademico = '';
            gestionParametroCredito.parametroCredito.valorMinimo = '';
            gestionParametroCredito.parametroCredito.valorMaximo = '';
            gestionParametroCredito.parametroCredito.interesCorriente = '';
            gestionParametroCredito.parametroCredito.interesMora = '';
            gestionParametroCredito.parametroCredito.cuotaMinima = '';
            gestionParametroCredito.parametroCredito.cuotaMaxima = '';
            gestionParametroCredito.parametroCredito.formaPago = '';
        }
        /*Acción Para Validar, Guargar o Editar Parámetros Créditos*/
        gestionParametroCredito.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudParametroCredito)) {
                if (validaciones()) {
                    if (gestionParametroCredito.parametroCredito.id === null || gestionParametroCredito.parametroCredito.id === undefined) {
                        gestionParametroCredito.onAddParametroCredito();
                        new ValidationService().resetForm($scope.formCrudParametroCredito);
                    } else {
                        if (localStorageService.get('parametroCredito').valorMinimo !== gestionParametroCredito.parametroCredito.valorMinimo
                                || localStorageService.get('parametroCredito').id !== gestionParametroCredito.parametroCredito.id
                                || JSON.stringify(localStorageService.get('parametroCredito').periodoAcademico) !== JSON.stringify(gestionParametroCredito.parametroCredito.periodoAcademico)
                                || JSON.stringify(localStorageService.get('parametroCredito').formaPago) !== JSON.stringify(gestionParametroCredito.parametroCredito.formaPago)
                                || localStorageService.get('parametroCredito').valorMaximo !== gestionParametroCredito.parametroCredito.valorMaximo
                                || localStorageService.get('parametroCredito').interesCorriente !== gestionParametroCredito.parametroCredito.interesCorriente
                                || localStorageService.get('parametroCredito').interesMora !== gestionParametroCredito.parametroCredito.interesMora
                                || localStorageService.get('parametroCredito').cuotaMinima !== gestionParametroCredito.parametroCredito.cuotaMinima
                                || localStorageService.get('parametroCredito').cuotaMaxima !== gestionParametroCredito.parametroCredito.cuotaMaxima) {
                            gestionParametroCredito.onUpdateParametroCredito();
                        }
                    }
                }
            }
        };

        function validaciones() {
            var validar = true;
            if (gestionParametroCredito.parametroCredito.valorMinimo > 100) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.VALOR_MINIMO_FINANCIAR);
                return validar = false;
            }
            if (gestionParametroCredito.parametroCredito.valorMaximo > 100) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.VALOR_MAXIMO_FINANCIAR);
                return validar = false;
            }
            if (gestionParametroCredito.parametroCredito.interesCorriente > 100) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.TAZA_INTERES_CORRIENTE);
                return validar = false;
            }
            if (gestionParametroCredito.parametroCredito.interesMora > 100) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.TAZA_INTERES_MORA);
                return validar = false;
            }
            if (gestionParametroCredito.parametroCredito.valorMinimo > gestionParametroCredito.parametroCredito.valorMaximo) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.VALOR_MINIMO_NO_MAYOR_VALOR_MAXIMO);
                return validar = false;
            }
            if (parseInt(gestionParametroCredito.parametroCredito.cuotaMinima) > parseInt(gestionParametroCredito.parametroCredito.cuotaMaxima)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CUOTA_MINIMA_NO_MAYOR_CUOTA_MAXIMA);
                return validar = false;
            }
            return validar;
        }

        gestionParametroCredito.onAddParametroCredito = function () {
            var parametroCre = {
                idPeriodoAcademico: 10006,
                valorMinimo: 0,
                valorMaximo: 0,
                interesCorriente: 0,
                interesMora: 0,
                cuotaMinima: gestionParametroCredito.parametroCredito.cuotaMinima,
                cuotaMaxima: gestionParametroCredito.parametroCredito.cuotaMaxima,
                idFormaPago: 115,
                codigo: gestionParametroCredito.parametroCredito.codigo,
                nombre: gestionParametroCredito.parametroCredito.nombre,
                idLineaCredito: gestionParametroCredito.parametroCredito.idLineaCredito
            };
            parametrosCreditosServices.agregarParametroCredito(parametroCre).then(function (data) {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                onBuscarParametrosCreditos(gestionParametroCredito.parametroCredito.periodoAcademico);
                onLimpiar();
            }).catch(function (e) {
                return;
            });
        };

        /*Acción Para Validar Y Modificar Parámetro Crédito*/
        gestionParametroCredito.onUpdateParametroCredito = function () {
            var parametroCre = {
                id: gestionParametroCredito.parametroCredito.id,
                idPeriodoAcademico: gestionParametroCredito.parametroCredito.idPeriodoAcademico,
                idLineaCredito: gestionParametroCredito.parametroCredito.idLineaCredito,
                valorMinimo: gestionParametroCredito.parametroCredito.valorMinimo,
                valorMaximo: gestionParametroCredito.parametroCredito.valorMaximo,
                interesCorriente: gestionParametroCredito.parametroCredito.interesCorriente,
                interesMora: gestionParametroCredito.parametroCredito.interesMora,
                cuotaMinima: gestionParametroCredito.parametroCredito.cuotaMinima,
                cuotaMaxima: gestionParametroCredito.parametroCredito.cuotaMaxima,
                idFormaPago: gestionParametroCredito.parametroCredito.formaPago,
                codigo: gestionParametroCredito.parametroCredito.codigo,
                nombre: gestionParametroCredito.parametroCredito.nombre
            };
            parametrosCreditosServices.agregarParametroCredito(parametroCre).then(function (data) {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISRO_CONFIGURADO);
                localStorageService.set('parametroCredito', gestionParametroCredito.parametroCredito);
                localStorageService.set('parametroCreditoAuxiliar', gestionParametroCredito.parametroCreditoAuxiliar);

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionParametroCredito.onClickToAddParametroCredito = function () {
            onLimpiar();
            gestionParametroCredito.parametroCreditoAuxiliar.disableVerDetalle = false;
            gestionParametroCredito.parametroCreditoAuxiliar.disableCodigo = false;
            gestionParametroCredito.parametroCreditoAuxiliar.titulo = "Agregar";
            localStorageService.set('parametroCredito', {});
            localStorageService.set('parametroCreditoAuxiliar', gestionParametroCredito.parametroCreditoAuxiliar);
            localStorageService.set('parametroCreditoView', {});
            $location.path('/gestion-parametros-creditos');
//            new ValidationService().resetForm($scope.formCrudParametroCredito);
        };


        gestionParametroCredito.onClickToUpdateParametroCredito = function (item) {

            gestionParametroCredito.parametroCredito.id = item.id;
            gestionParametroCredito.parametroCredito.idPeriodoAcademico = item.idPeriodoAcademico;
            gestionParametroCredito.parametroCredito.valorMinimo = item.valorMinimo;
            gestionParametroCredito.parametroCredito.valorMaximo = item.valorMaximo;
            gestionParametroCredito.parametroCredito.interesCorriente = item.interesCorriente;
            gestionParametroCredito.parametroCredito.interesMora = item.interesMora;
            gestionParametroCredito.parametroCredito.cuotaMinima = item.cuotaMinima;
            gestionParametroCredito.parametroCredito.cuotaMaxima = item.cuotaMaxima;
            gestionParametroCredito.parametroCredito.formaPago = item.formaPago.id;
            gestionParametroCredito.parametroCredito.codigo = item.codigo;
            gestionParametroCredito.parametroCredito.nombre = item.nombre;
            gestionParametroCredito.parametroCredito.idLineaCredito = item.idLineaCredito;
            localStorageService.set('parametroCreditoView', gestionParametroCredito.parametroCredito);
            $location.path('/gestion-parametros-creditos');
        };

        function onBuscarLineasCredito() {
            utilServices.buscarListaValorByCategoria('LINEA_CREDITO', 'financiero').then(function (data) {
                gestionParametroCredito.listaLineasCredito = [];
                gestionParametroCredito.listaLineasCredito = data;
            }).catch(function (e) {
                return;
            });
        }

        onBuscarLineasCredito();
        onBuscarParametrosCreditos();
        //        onBuscarFormasPago();
    }
})();