'use strict';
angular.module('mytodoApp.service').service('asignaturaEntitiesService', ['$http', '$q', 'appGenericConstant', function ($http, $q, appGenericConstant) {
    var servicio = this;
    servicio.buscarAsignatura = Buscar;
    servicio.agregarAsignatura = Agregar;
    servicio.eliminarAsignatura = Eliminar;
    servicio.eliminarMasivoAsignatura = EliminarMasivo;
    servicio.actualizarAsignatura = Actualizar;
    servicio.asignatura = {};
    servicio.asignaturaAux = {};

    var url = '/api/admision';

    function Buscar() {
        var defered = $q.defer();
        var urlRequest = url + 'Modulo';
        $http.get(urlRequest).success(function (response) {
            defered.resolve(response);
        }).error(function (error) {
            defered.reject(error);
        });
        return defered.promise;
    }

    function Agregar(rs) {
        var defered = $q.defer();
        var urlRequest = url + 'Modulo';
        $http.post(urlRequest, rs).success(function (response) {
            defered.resolve(response);
        }).error(function (error) {
            defered.reject(error);
        });
        return defered.promise;
    }

    function Eliminar(rs) {
        var defered = $q.defer();
        var urlRequest = url + 'Modulo/' + rs.id;
        $http.delete(urlRequest).success(function (response) {
            defered.resolve(response);
        }).error(function (error) {
            defered.reject(error);
        });
        return defered.promise;
    }

    function EliminarMasivo(rs) {
        var defered = $q.defer();
        var urlRequest = url + 'Modulo/masivo/' + rs;
        $http.delete(urlRequest).success(function (response) {
            defered.resolve(response);
        }).error(function (error) {
            defered.reject(error);
        });
        return defered.promise;
    }

    function Actualizar(rs) {
        var defered = $q.defer();
        var urlRequest = url + 'Modulo';
        $http.put(urlRequest, rs).success(function (response) {
            defered.resolve(response);
        }).error(function (error) {
            defered.reject(error);
        });
        return defered.promise;
    }

}]);

