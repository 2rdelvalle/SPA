(function () {
    'use strict';
    angular.module('mytodoApp.service').service('usuarioEstudianteEntitiesServices', usuarioEstudianteEntitiesServices);
    usuarioEstudianteEntitiesServices.$inject = ['$http', '$q'];

    function usuarioEstudianteEntitiesServices($http, $q) {
        var servicio = this;
        servicio.buscarUsuario = Buscar;
        servicio.agregarUsuario = Agregar;
        servicio.actualizarUsuario = Actualizar;
        servicio.cargarListaCargo = ListaCargo;
        servicio.usuario = {};
        servicio.usuarioAux = {};
        servicio.visible = {};
        servicio.visible.validaJornada = false;
        servicio.subirarchivos = onSubirfoto;
        servicio.downloadFoto = onDownloadfoto;

        var url ='/api/auth';
        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + '/Estudiante';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaCargo() {
            var defered = $q.defer();
            var urlRequest = url + '/Cargo/estadoActivo';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function onSubirfoto() {
            var urlRequest = url + '/fileupload/upload';
            return urlRequest;
        }

        function onDownloadfoto(file) {
            var urlRequest = url + '/fileupload/download/' + file;
            return urlRequest;
        }
        
        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + '/Estudiante';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + '/Estudiante';
            $http.put(urlRequest, rs
            ).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();











