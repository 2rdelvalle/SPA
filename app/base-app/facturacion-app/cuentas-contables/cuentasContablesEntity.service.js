(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cuentasContablesEntityServices', cuentasEntity);
    cuentasEntity.$inject = ['$http', '$q', 'appGenericConstant'];
    function cuentasEntity($http, $q, appGenericConstant) {

        var servicio = this;

        servicio.listadoCuentasContables = listarCuentas;
        servicio.eliminarCuentasContables = postEliminarEntidadCuenta;
        servicio.eliminarMasivoCuentasContables = postEliminarMasivoEntidadCuenta;
        servicio.entidad = {};
        servicio.entidadAuxiliar = {};
        servicio.cuentaAuxiliar = {};
        servicio.registrarCuenta = registrar;
        servicio.modificarCuenta = actualizar;

        var url ='/api/financiero/';

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function postEliminar(urlRequest, rs) {
            var defered = $q.defer();
            $http.delete(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function registrar(cuenta) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cuenta';
            $http.post(urlRequest, cuenta).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function actualizar(cuenta) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cuenta';
            $http.put(urlRequest, cuenta).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function listarCuentas() {
            var urlRequest = url + 'Cuenta';
            return ejecutarservice(urlRequest);
        }

        function postEliminarEntidadCuenta(rs) {
            var urlRequest = url + 'Cuenta/' + rs.id;
            return postEliminar(urlRequest, rs);
        }

        function postEliminarMasivoEntidadCuenta(rs) {
            var urlRequest = url + 'Cuenta/masivo/' + rs;
            return postEliminar(urlRequest, rs);
        }
    }
})();


