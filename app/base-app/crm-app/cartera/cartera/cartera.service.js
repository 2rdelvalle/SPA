(function () {
    'use strict';

    angular.module('mytodoApp.service').service('carteraService', carteraService);

    carteraService.$inject = ['$http', '$q'];

    function carteraService($http, $q) {
        var servicio = this;

        servicio.consultarListado = getlistadoCartera;
        servicio.consultarEstados = getlistadoEstados;
        servicio.consultarConceptos = getlistadoConceptos;
        servicio.consultarBetweenFechas = getListadoCarteraFechas;
        servicio.consultarBetweenFechasSeguimiento = getListadoCarteraFechasSeguimiento;
        servicio.consultarBetweenFechasSeguimientoEC = getListadoCarteraFechasSeguimientoEC;
        servicio.onActivarInactivarEstudiante = activarInactivarEstudiante;
        servicio.onConvenio = activarConvenio;
        servicio.sendNotificacion = getEnviarNotificacion;
        servicio.notificacionMasiva = getNotificacionMasiva;
        servicio.entidad = {};
        servicio.entidadAuxiliar = {};

        var url ="/api/crm/";


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

        function ejecutarServicePost(urlRequest, cartera) {
            var deferred = $q.defer();
            $http.post(urlRequest, cartera).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function getListadoCarteraFechas(fecInicial, fecFin) {
            var urlRequest = url + "Cartera/betweenFechas/" + fecInicial + "/" + fecFin;
            return ejecutarservice(urlRequest);
        }

        function activarInactivarEstudiante(codigo, estado) {
            var urlRequest = url + "Cartera/guardarEstado/" + codigo + "/" + estado;
            return ejecutarservice(urlRequest);
        }

        function activarConvenio(codigo, estado) {
            var urlRequest = url + "Cartera/guardarEstadoConvenio/" + codigo + "/" + estado;
            return ejecutarservice(urlRequest);
        }

        function getListadoCarteraFechasSeguimiento(fecInicial, fecFin) {
            var urlRequest = url + "Cartera/betweenFechasCartera/" + fecInicial + "/" + fecFin;
            return ejecutarservice(urlRequest);
        }
        
        function getListadoCarteraFechasSeguimientoEC(fecInicial, fecFin) {
            var urlRequest = url + "Cartera/betweenFechasCarteraEC/" + fecInicial + "/" + fecFin;
            return ejecutarservice(urlRequest);
        }

        function getEnviarNotificacion(cliente) {
            var urlRequest = url + "Cartera/notificacion";
            var deferred = $q.defer();
            $http.post(urlRequest, cliente).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;

        function getlistadoCartera(consultaCartera) {
            var urlRequest = url + "Cartera";
            return ejecutarservice(urlRequest);
        }
        ;

        function getlistadoEstados() {
            var urlRequest = url + "Cartera/estado/VIGENTE";
            return ejecutarservice(urlRequest);
        }
        ;

        function getlistadoConceptos() {
            var urlRequest = url;
            return ejecutarservice(urlRequest);
        }
        ;

        function getNotificacionMasiva(cliente) {
            var urlRequest = url + "Cartera/notificacion/masiva";
            var deferred = $q.defer();
            $http.post(urlRequest, cliente).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        ;
    }
})();


