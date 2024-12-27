(function () {
    'use strict';

    angular.module('mytodoApp.service').service('cierreCajaService', cierreCajaService);

    cierreCajaService.$inject = ['$http', '$q', 'appGenericConstant'];

    function cierreCajaService($http, $q, appGenericConstant) {
        var servicio = this;
        var url ='/api/';

        servicio.guardarCierre = Agregar;
        servicio.entidad = {};
        servicio.entidadAuxiliar = {};
        servicio.configuracionCaja = AperturaCaja;
        servicio.consultarInfoCaja = consultarDatoCaja;


        function AperturaCaja(id) {
            var urlRequest = url + 'financiero/CajaMovimiento/cierre/byCaja/' + id;
            return ejecutarservice(urlRequest);
        }

        function consultarDatoCaja(id) {
            var urlRequest = url + 'financiero/CajaMovimiento/cierre/byCaja/' + id;
            return ejecutarservice(urlRequest);
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/CajaMovimiento/saveCierre';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
})();





