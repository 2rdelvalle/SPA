'use strict';
angular.module('mytodoApp.service').service('modulosEntitiesService', ['$http', '$q', 'appGenericConstant', function ($http, $q, appGenericConstant) {
    var servicio = this;
    servicio.buscarModulo = Buscar;
    servicio.agregarModulo = Agregar;
    servicio.actualizarModulo = Actualizar;
    servicio.modulos = {};
    servicio.modulosAux = {};

    var url = '/api/admisiones/';

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

