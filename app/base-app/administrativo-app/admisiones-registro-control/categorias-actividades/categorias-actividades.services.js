(function () {
    'use strict';
    angular.module('mytodoApp.service').service('categoriaActividadesEntitiesService', categoriaActividadesEntitiesService);
    categoriaActividadesEntitiesService.$inject = ['$http', '$q'];

    function categoriaActividadesEntitiesService($http, $q) {
        var servicio = this;
        servicio.buscarcategoriaActividades = Buscar;
        servicio.comprobarCodigo = comprobarCodigo;
        servicio.agregarcategoriaActividades = Agregar;
        servicio.eliminarcategoriaActividades = Eliminar;
        servicio.actualizarcategoriaActividades = Actualizar;

        servicio.listarActividades = listaActividades;
        servicio.agregarActividades = agregarActividades;
        servicio.eliminarActividades = eliminarActividades;
        servicio.actualizarActividades = actualizarActividades;

        servicio.categoriaActividades = {};
        servicio.categoriaActividadesAux = {};

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/categoria?estadoLogico=A';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function comprobarCodigo(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/categoria?codigo=' + rs.codigo + '&estadoLogico=A';
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/categoria';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/categoria/' + rs.id;
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/categoria/' + rs.id;
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function listaActividades(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/actividades?categoria=' + rs.codigo + '&estadoLogico=A';
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
        function comprobarActividad(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/actividades?codigo=' + rs.codigo + '&estadoLogico=A';
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function agregarActividades(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/actividades';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function eliminarActividades(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/actividades/' + rs.id;
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function actualizarActividades(rs) {
            var defered = $q.defer();
            var urlRequest = 'http://zabud.cloudapp.net:3700/actividades/' + rs.id;
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();
