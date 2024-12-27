(function () {
    'use strict';
    angular.module('mytodoApp').controller('ListaAdmisionesCtrl', ListaAdmisionesCtrl);

    ListaAdmisionesCtrl.$inject = ['$scope', 'admisionesServices', 'listaAdmisionesServices', '$location', 'growl', 'localStorageService', 'utilServices', '$window', '$http', 'appConstant', 'appGenericConstant', '$filter', 'ValidationService'];
    function ListaAdmisionesCtrl($scope, admisionesServices, listaAdmisionesServices, $location, growl, localStorageService, utilServices, $window, $http, appConstant, appGenericConstant, $filter, ValidationService) {
        var listaAdmisiones = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        listaAdmisiones.listaAdmitidos = [];
        listaAdmisiones.listaRechazados = [];
        listaAdmisiones.listaGeneral = [];
        listaAdmisiones.listaPagados = [];
        listaAdmisiones.listaDiaria = [];
        listaAdmisiones.nivelesFormacion = [];
        listaAdmisiones.programasAcademicos = [];
        listaAdmisiones.display;
        listaAdmisiones.listaSeccional = [];
        listaAdmisiones.seccional = null;
        listaAdmisiones.options = appConstant.FILTRO_TABLAS;
        listaAdmisiones.selectedOption = listaAdmisiones.options[appGenericConstant.CERO];
        listaAdmisiones.report = {
            selected: null
        };

        function onBuscarNivelesFormacion() {
            admisionesServices.buscarNivelesFormacion().then(function (data) {
                listaAdmisiones.nivelesFormacion = data;
            });

        }

      function onBuscarSeccional() {
        listaAdmisionesServices.buscarSeccional().then(function (data) {
          listaAdmisiones.listaSeccional = data;
        });

      }
        function onBuscarPeriodoAcademico() {
            listaAdmisionesServices.buscarPeriodosAcademicos().then(function (data) {
                listaAdmisiones.periodoAcademico = data;
            });
        }

        listaAdmisiones.onObtenerLista = function (periodo, nivel, seccional) {
            if (!new ValidationService().checkFormValidity($scope.formAdmisiones)) {
                return;
            }
            listaAdmisiones.listaAdmitidos = [];
            listaAdmisiones.listaRechazados = [];
            listaAdmisiones.listaGeneral = [];
            listaAdmisiones.listaPagados = [];
            listaAdmisiones.listaDiaria = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            onCargarListadoAdmitidosPorDia(periodo, nivel, seccional);
            listaAdmisionesServices.consultarListaDiaria(periodo, nivel,seccional).then(function (data) {

                listaAdmisiones.listaAdmitidos = $.grep(data, function(v) {
                    return v.estado === "ADMITIDO"
                });
                listaAdmisiones.listaRechazados = $.grep(data, function(v) {
                    return v.estado === "RECHAZADO"
                });

                // listaAdmisiones.listaPagados = data.listadoPagos;

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        function onCargarListadoAdmitidosPorDia(periodo, nivel, seccional) {
            listaAdmisionesServices.consultarListaDiaria(periodo, nivel, seccional).then(function (data) {
                // listaAdmisiones.listaDiaria = data;
                listaAdmisiones.listaPagados  = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        }

        onBuscarNivelesFormacion();
        onBuscarPeriodoAcademico();
        onBuscarSeccional();

    }
})();

