(function () {
    'use strict';

    angular.module('mytodoApp.service').service('aperturaCierreCajaServices', aperturaCierreCaja);

    aperturaCierreCaja.$inject = ['$http', '$q', 'appGenericConstant','localStorageService'];

    function aperturaCierreCaja($http, $q, appGenericConstant,localStorageService) {
        var servicio = this;

        servicio.buscarCaja = getCaja;
        servicio.confirmarUser = confirUser;
        servicio.confiCaja = AperturaCaja;

        servicio.entidad = {};
        servicio.entidadAuxiliar = {};
        var url ='/api/';

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

        function getCaja(idUsuario) {
          let urlRequest = localStorageService.get('usuario').rol.codigo === 'SUPERVISOR' ?
            `${url}financiero/Caja/todos` :
            `${url}financiero/Caja/bycajero/${idUsuario}`;
            return ejecutarservice(urlRequest);
        }

        function confirUser(aperturaCaja) {
            var deferred = $q.defer();
            var urlRequest = url + 'financiero/CajaMovimiento';
            $http.post(urlRequest, aperturaCaja).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function AperturaCaja(idCaja, idUsuario) {
            var urlRequest = url + 'financiero/CajaMovimiento/apertura/byCaja/' + idCaja + '/' + idUsuario;
            return ejecutarservice(urlRequest);
        }
    }
})();





