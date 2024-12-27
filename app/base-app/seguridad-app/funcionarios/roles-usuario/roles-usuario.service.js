(function () {
    'use strict';
    angular.module('mytodoApp.service').service('usuarioRolesService', usuarioRolesService);
    usuarioRolesService.$inject = ['$http', '$q', 'appGenericConstant'];
    function usuarioRolesService($http, $q, appGenericConstant) {
        var servicioUsuarioRol = this;

        servicioUsuarioRol.buscarUsuarioRoles = buscarUsuarioRoles;
        servicioUsuarioRol.buscarUsuario = buscarUser;
        servicioUsuarioRol.onBuscarRoles = buscarRoles;
        servicioUsuarioRol.onBuscarRolesActivos = buscarRolesActivos;
        servicioUsuarioRol.actulizarRol = actualizarRol;
        servicioUsuarioRol.rol = {};
        servicioUsuarioRol.rolAuxiliar = {};

       var url ='/api/auth';
        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function buscarUsuarioRoles() {
            var urlRequest = url + '/UsuarioRol';
            return ejecutarservice(urlRequest);
        }

        function buscarRoles() {
            var urlRequest = url + '/Rol';
            return ejecutarservice(urlRequest);
        }

        function buscarRolesActivos() {
            var urlRequest = url + '/Rol/activos';
            return ejecutarservice(urlRequest);
        }

        function actualizarRol(rol) {
            var deferred = $q.defer();
            var urlRequest = url + '/UsuarioRol';
            $http.put(urlRequest, rol).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        
        function buscarUser(idUser) {
            var urlRequest = url + '/UsuarioRol/byId/' + idUser;
            return ejecutarservice(urlRequest);
        }
    }
})();





