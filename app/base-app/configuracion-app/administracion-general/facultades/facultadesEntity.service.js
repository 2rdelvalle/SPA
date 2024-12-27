(function () {
    'use strict';

    angular.module('mytodoApp.service').service('facultadEntityServices', facltadEntity);

    facltadEntity.$inject = ['$http', '$q', 'appGenericConstant'];

    function facltadEntity($http, $q, appGenericConstant) {
        var servicio = this;

        servicio.buscarFacultad = buscar;
        servicio.ActulizarFacultad = actualizar;
        servicio.deleteFacultad = onDelete;
        servicio.RegistrarFacultad = registrar;
        servicio.facultad = {};
        servicio.facultadAuxiliar = {};
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
            var urlRequest = url + 'Facultad';
            return ejecutarservice(urlRequest);
        }
        ;

        function actualizar(facultad) {
            var deferred = $q.defer();
            var urlRequest = url + 'Facultad';
            $http.put(urlRequest, facultad).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function onDelete(facultad) {
            var deferred = $q.defer();
            var urlRequest = url + 'Facultad/' + facultad.id;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function registrar(facultad) {
            var deferred = $q.defer();
            var urlRequest = url + 'Facultad';
            $http.post(urlRequest, facultad).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;


        function onDeleteMasive(facultad) {
            var deferred = $q.defer();
            var urlRequest = url + 'Facultad/masivo/' + facultad;
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


