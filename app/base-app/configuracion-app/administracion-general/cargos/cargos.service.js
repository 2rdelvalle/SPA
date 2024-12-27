(function () {
    'use strict';

    angular.module('mytodoApp.service').service('cargoEntityServices', CargoEntityServices);

    CargoEntityServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function CargoEntityServices($http, $q, appGenericConstant) {
        var servicio = this;

        servicio.buscarCargo = buscar;
        servicio.ActulizarCargo = actualizar;
        servicio.deleteCargo = onDelete;
        servicio.RegistrarCargo = registrar;
        servicio.cargo = {};
        servicio.cargoAuxiliar = {};
        servicio.deleteFacultaMasive = onDeleteMasive;
        var url ='/api/configeneral/';

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function buscar() {
            var urlRequest = url + 'Cargo';
            return ejecutarservice(urlRequest);
        }
        ;

        function actualizar(cargo) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cargo';
            $http.put(urlRequest, cargo).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function onDelete(cargo) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cargo/' + cargo.id;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function registrar(cargo) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cargo';
            $http.post(urlRequest, cargo).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;


        function onDeleteMasive(cargo) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cargo/masivo/' + cargo;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

    }
})();





