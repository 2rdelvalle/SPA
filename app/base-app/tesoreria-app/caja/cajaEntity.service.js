(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cajaEntityServices', cajaEntity);
    cajaEntity.$inject = ['$http', '$q', 'appGenericConstant'];
    function cajaEntity($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.listaCajeros = getCajero;
        servicio.buscarCaja = getCaja;
        servicio.deleteCaja = onDelete;
        servicio.deleteCajaMasivo = onDeleteMasivo;
        servicio.registrarCaja = AddCaja;
        servicio.entidad = {};
        servicio.entidadAuxiliar = {};
        servicio.visible = {};
        var url ='/api/financiero/Caja';
//        var urlAutorizacion = var url ='/api/auth/login/accesoCaja';
        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function getCaja() {
            var urlRequest = url + '/todos';
            return ejecutarservice(urlRequest);
        }
        function getCajero(id) {
            var urlRequest = url + '/bycaja/' + id;
            return ejecutarservice(urlRequest);
        }
        function onDelete(caja) {
            var deferred = $q.defer();
            var urlRequest = url + '/' + caja.id;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function onDeleteMasivo(caja) {
            var deferred = $q.defer();
            var urlRequest = url + '/masivo/' + caja;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function AddCaja(caja) {
            var deferred = $q.defer();
            var urlRequest = url;
            $http.post(urlRequest, caja).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
})();