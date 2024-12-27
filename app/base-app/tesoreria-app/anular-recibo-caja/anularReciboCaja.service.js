(function () {
    'use strict';

    angular.module('mytodoApp.service').service('anularReciboCajaService', anularReciboCajaService);
    anularReciboCajaService.$inject = ['$http', '$q', 'appGenericConstant'];
    function anularReciboCajaService($http, $q, appGenericConstant) {
        var servicio = this;
        var url = '/api/financiero/';
        servicio.buscarRecibosCaja = getRecibosCaja;
        servicio.buscarRecibosCajaAnulados = getRecibosCajaAnulados;
        servicio.buscarRecibosByEstado = getRecibosCajaByEstadoFecha;
        servicio.anularReciboCaja = anularRecibo;
        servicio.entidad = {};
        servicio.entidadAnular = {};
        servicio.entidadAuxiliar = {};


        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

        function getRecibosCajaByEstadoFecha(estado, fecha, fecha2) {
            var urlRequest = url + "CajaMovimientoDiario/historial/" + estado + "/" + fecha + "/" + fecha2;
            return ejecutarservice(urlRequest);
        }

        function getRecibosCaja(fecha, fecha2) {
            var urlRequest = url + "CajaMovimientoDiario/historial/activos/" + fecha + "/" + fecha2;
            return ejecutarservice(urlRequest);
        }

        function getRecibosCajaAnulados(fecha, fecha2) {
            var urlRequest = url + "CajaMovimientoDiario/historial/anulados/" + fecha + "/" + fecha2;
            return ejecutarservice(urlRequest);
        }

        function anularRecibo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CajaMovimientoDiario';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();


