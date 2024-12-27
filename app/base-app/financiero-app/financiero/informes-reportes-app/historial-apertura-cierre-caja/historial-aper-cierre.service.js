(function () {
    'use strict';

    angular.module('mytodoApp.service').service('historialApeCierreCajaService', historialApeCierreCajaService);

    historialApeCierreCajaService.$inject = ['$http', '$q'];

    function historialApeCierreCajaService($http, $q) {
        var servicioHistorial = this;

        servicioHistorial.consultarBetweenFechas = getListadoCajaMovimientoFechas;
        servicioHistorial.reporteCierreCaja = getReporteCierreCaja;
        servicioHistorial.reporteAperturaCaja = getReporteAperturaCaja;
        servicioHistorial.historial = {};
        servicioHistorial.historialAuxiliar = {};

        var url = "/api/financiero/";


        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getListadoCajaMovimientoFechas(fechaApertura, fechaCierre) {
            var urlRequest = url + "CajaMovimiento/HistorialBetweenFechas/" + fechaApertura + "/" + fechaCierre;
            return ejecutarservice(urlRequest);
        }

        function getReporteCierreCaja(idCaja, id) {
            var urlRequest = url + "CajaMovimiento/reporteCierreCaja/" + idCaja + "/" + id;
            return ejecutarservice(urlRequest);
        }


        function getReporteAperturaCaja(id) {
            var urlRequest = url + "CajaMovimiento/reporteAperturaCaja/" + id;
            return ejecutarservice(urlRequest);
        }
    }
})();


