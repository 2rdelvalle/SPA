(function () {
    'use strict';
    angular.module('mytodoApp.service').service('rolesServices', rolesServices);
    rolesServices.$inject = ['$http', '$q', 'appGenericConstant'];
    function rolesServices($http, $q, appGenericConstant) {
        var servicioRol = this;

        servicioRol.buscarRoles = buscarRoles;
        servicioRol.buscarRolCodigo = buscarRoleCodigo;
        servicioRol.actulizarRol = actualizarRol;
        servicioRol.deleteRol = onDeleteRol;
        servicioRol.registrarRol = registrarRol;
        servicioRol.modulos = consultarModulos;
        servicioRol.agregarMenu = agregarMenu;
        servicioRol.eliminarMenu = eliminarMenu;
        servicioRol.agregarModulo = agregarModulo;
        servicioRol.rol = {};
        servicioRol.rolAuxiliar = {};

        var url = '/api/auth/';

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function buscarRoles() {
            var urlRequest = url + 'Rol';
            return ejecutarservice(urlRequest);
        }
        function buscarRoleCodigo(dto) {
            var urlRequest = url + 'Rol/codigo/' + dto;
            return ejecutarservice(urlRequest);
        }


        function actualizarRol(rol) {
            var deferred = $q.defer();
            var urlRequest = url + 'Rol';
            $http.put(urlRequest, rol).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function onDeleteRol(rol) {
            var deferred = $q.defer();
            var urlRequest = url + 'Rol/' + rol.id;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function agregarMenu(objeto) {
            var deferred = $q.defer();
            var urlRequest = url + 'Rol/agregarMenu';
            $http.post(urlRequest, objeto).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        
        function eliminarMenu(objeto) {
            var deferred = $q.defer();
            var urlRequest = url + 'Rol/eliminarMenu';
            $http.post(urlRequest, objeto).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }


        function registrarRol(rol) {
            var deferred = $q.defer();
            var urlRequest = url + 'Rol';
            $http.post(urlRequest, rol).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function consultarModulos() {
            var urlRequest = url + 'Modulo';
            return ejecutarservice(urlRequest);
        }

        function agregarModulo(objeto) {
            var deferred = $q.defer();
            var urlRequest = url + 'Modulo';
            $http.post(urlRequest, objeto).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
})();





