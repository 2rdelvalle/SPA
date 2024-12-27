(function () {
    'use strict';
    angular.module('mytodoApp').controller('ConfiguracionNotaCtrl', ConfiguracionNotaCtrl);
    ConfiguracionNotaCtrl.$inject = ['$scope', 'configuracionNotaService', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function ConfiguracionNotaCtrl($scope, configuracionNotaService, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var configuracionNotaCtrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        configuracionNotaCtrl.display;
        configuracionNotaCtrl.selectTodos = false;
        configuracionNotaCtrl.filtrados = [];
        configuracionNotaCtrl.estados = [];
        configuracionNotaCtrl.options = appConstant.FILTRO_TABLAS;
        configuracionNotaCtrl.selectedOption = configuracionNotaCtrl.options[0];


        configuracionNotaCtrl.nota_1 = 0;
        configuracionNotaCtrl.nota_2 = 0;
        configuracionNotaCtrl.nota_3 = 0;
        configuracionNotaCtrl.nota_H = 0;
        configuracionNotaCtrl.nota_D = 0;
        configuracionNotaCtrl.porcentajeRestanteNota2 = 0;

        configuracionNotaCtrl.disableNota2 = true;
        configuracionNotaCtrl.disableNota3 = true;
        configuracionNotaCtrl.disableNotaH = true;

        configuracionNotaCtrl.configuracionNota = {};

        configuracionNotaCtrl.report = {
            selected: null
        };
        configuracionNotaCtrl.counter = 0;

        configuracionNotaCtrl.onCargarConfiguracion = function () {
            configuracionNotaService.buscarConfiguracion().then(function (data) {

                if (data.length > 0) {
                    angular.forEach(data, function (value, key) {
                        configuracionNotaCtrl.configuracionNota =
                                {
                                    id: value.id,
                                    nota1: value.nota_1,
                                    nota2: value.nota_2,
                                    nota3: value.nota_3,
                                    notaHabilitacion: value.nota_H,
                                    notaDefinitiva: value.notaHabilitacion
                                };

                        configuracionNotaCtrl.nota_1 = value.nota1;
                        configuracionNotaCtrl.nota_2 = value.nota2;
                        configuracionNotaCtrl.nota_3 = value.nota3;
                        configuracionNotaCtrl.nota_H = value.notaHabilitacion;
                        configuracionNotaCtrl.nota_D = value.notaDefinitiva;

                    });
                }
            });
        };

        configuracionNotaCtrl.onValidarPorcentaje = function (item) {
            return item === "" || item === undefined || item === null;
        };

        configuracionNotaCtrl.onChangeNota_1 = function () {
            if (configuracionNotaCtrl.onValidarPorcentaje(configuracionNotaCtrl.nota_1)) {
                configuracionNotaCtrl.disableNota3 = true;
                configuracionNotaCtrl.disableNotaH = true;
                configuracionNotaCtrl.nota_2 = 0;
                configuracionNotaCtrl.nota_3 = 0;
                return;
            }

            if (configuracionNotaCtrl.nota_1 > 100) {
                configuracionNotaCtrl.nota_1 = 0;
                configuracionNotaCtrl.disableNota2 = true;
                return;
            }

            configuracionNotaCtrl.disableNota2 = false;
            configuracionNotaCtrl.porcentajeRestanteNota2 = 100 - configuracionNotaCtrl.nota_1;
            configuracionNotaCtrl.nota_3 = 100 - (configuracionNotaCtrl.nota_1 + configuracionNotaCtrl.nota_2);

        };


        configuracionNotaCtrl.onChangeNota_2 = function () {

            if (configuracionNotaCtrl.onValidarPorcentaje(configuracionNotaCtrl.nota_2)) {
                configuracionNotaCtrl.nota_2 = 0;
                configuracionNotaCtrl.disableNotaH = true;
                return;
            }

            if (configuracionNotaCtrl.porcentajeRestanteNota2 < configuracionNotaCtrl.nota_2) {
                configuracionNotaCtrl.nota_2 = 0;
                configuracionNotaCtrl.disableNotaH = true;
                return;
            }

            configuracionNotaCtrl.disableNota3 = false;
            configuracionNotaCtrl.disableNotaH = false;
            configuracionNotaCtrl.disableNotaH = false;
            configuracionNotaCtrl.nota_3 = 100 - (configuracionNotaCtrl.nota_1 + configuracionNotaCtrl.nota_2);
            configuracionNotaCtrl.nota_D = configuracionNotaCtrl.nota_H === 0 ? 100 : 0;

        };

        configuracionNotaCtrl.onChangeNotaHabilitacion = function () {

            if (configuracionNotaCtrl.onValidarPorcentaje(configuracionNotaCtrl.nota_H)) {
                configuracionNotaCtrl.nota_H = 0;
                configuracionNotaCtrl.nota_D = 100 - configuracionNotaCtrl.nota_H;
                return;
            }

            if (configuracionNotaCtrl.nota_H > 100) {
                configuracionNotaCtrl.nota_H = 0;
                configuracionNotaCtrl.nota_D = 100 - configuracionNotaCtrl.nota_H;
                return;
            }

            configuracionNotaCtrl.nota_D = 100 - configuracionNotaCtrl.nota_H;
        };



        configuracionNotaCtrl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfiguracionNota)) {
                configuracionNotaCtrl.guardarConfiguracion();
                new ValidationService().resetForm($scope.formConfiguracionNota);
            }
        };

        configuracionNotaCtrl.guardarConfiguracion = function () {
            var newConfiguracion = {
                id: configuracionNotaCtrl.configuracionNota.id === undefined ? null : configuracionNotaCtrl.configuracionNota.id,
                nota1: configuracionNotaCtrl.nota_1,
                nota2: configuracionNotaCtrl.nota_2,
                nota3: configuracionNotaCtrl.nota_3,
                notaHabilitacion: configuracionNotaCtrl.nota_H,
                notaDefinitiva: configuracionNotaCtrl.nota_D
            };
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            configuracionNotaService.agregarConfiguracion(newConfiguracion).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    configuracionNotaCtrl.onCargarConfiguracion();
                }
            });
        };
        configuracionNotaCtrl.onCargarConfiguracion();
    }
})();