(function () {
   'use strict';

    angular.module('mytodoApp.service').service('pruebasEntrevistasServices', pruebasEntrevistasEntity);

    pruebasEntrevistasEntity.$inject = ['$http', '$q'];

    function pruebasEntrevistasEntity($http, $q) {
        var servicio = this;
        
      
        servicio.buscarRequisito = buscar;
        servicio.ActulizarPruebaEntrevista = actualizar;
        servicio.delete = onDelete;
        servicio.buscarRequisitosConfig=requisitosConfig;
        servicio.RegistrarPruebaEntevista = registrar;
        servicio.PruebaEntevista = {};
        servicio.PruebaEntevistaAuxiliar={};

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }
        
        function buscar() {

            var urlRequest = 'http://localhost:3700/programasAcademicos';
            return ejecutarservice(urlRequest);
        }
       
       function requisitosConfig(requisitoConfig) {

            var urlRequest = 'http://localhost:3700/programasAcademicos?codigo='+requisitoConfig.codigoPrograma;
            return ejecutarservice(urlRequest);
        }
        function actualizar(PruebaEntevista) {
            var deferred = $q.defer();
            var urlRequest = 'http://localhost:3700/programasAcademicos/' + PruebaEntevista.id;
            $http.put(urlRequest, PruebaEntevista).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function onDelete(PruebaEntevista) {
            var deferred = $q.defer();
            var urlRequest = 'http://localhost:3700/PruebaEntevista/' + PruebaEntevista.id;
            $http.delete(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function registrar(loquesea) {
            var deferred = $q.defer();
            var urlRequest = 'http://localhost:3700/PruebaEntevista';
            $http.post(urlRequest, loquesea).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
     }
  })();





