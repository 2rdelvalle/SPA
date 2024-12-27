(function () {
    'use strict';

    angular.module('mytodoApp.service').service('clientesService', clientesService);

    clientesService.$inject = ['$http', '$q'];

    function clientesService($http, $q) {
        var servicio = this;

        servicio.consultarListado = getlistadoCliente;
        servicio.busquedaClientes = getClientes;
        servicio.consultarEstados = getlistadoEstados;
        servicio.buscarPeriodoAcademicoByEstado = getPeriodoAcademicoByEstado;
        servicio.buscarPeriodoAcademicoActual = getPeriodoAcademicoActual;
        servicio.consultarConceptos = getlistadoConceptos;
        servicio.sendNotificacion = getEnviarNotificacion;
        servicio.notificacionMasiva = getNotificacionMasiva;
        servicio.listaNivelesFormacion = getNivelesFormacion;
        servicio.entidad = {};
        servicio.entidadPrincipal = {};
        servicio.entidadAuxiliar = {};
        var urlCRM = "/api/crm/";
        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function getPeriodoAcademicoByEstado() {
            var urlRequest = urlCRM + 'PeriodoAcademico/todos';
            return ejecutarservice(urlRequest);
        }
        function getEnviarNotificacion(cliente) {
            var urlRequest = urlCRM + 'Cliente/notificacion';
            var deferred = $q.defer();
            $http.post(urlRequest, cliente).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getlistadoCliente() {
            var urlRequest = urlCRM + 'Cliente';
            return ejecutarservice(urlRequest);
        }

        function getlistadoEstados() {
            var urlRequest = urlCRM + 'Cliente/estado/VIGENTE';
            return ejecutarservice(urlRequest);
        }

        function getlistadoConceptos() {
            var urlRequest = urlCRM;
            return ejecutarservice(urlRequest);
        }

        function getNotificacionMasiva(cliente) {
            var urlRequest = urlCRM + 'Cliente/notificacion/masiva';
            var deferred = $q.defer();
            $http.post(urlRequest, cliente).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getClientes(periodoAcademico, etapaRegistro, nivelAcademicos, modalidad, nivelFormacion,fechaInicio, fechaFin) {
            var urlRequest = urlCRM + 'Cliente/filtroCliente/'+ periodoAcademico+ 
                    '/'+nivelAcademicos +'/'+etapaRegistro +'/'+ modalidad+'/'+nivelFormacion +'/'+fechaInicio + '/' +fechaFin;
            return ejecutarservice(urlRequest);
        }

        function getPeriodoAcademicoActual() {
            var urlrequest = urlCRM + 'PeriodoAcademico/byActual/';
            return ejecutarservice(urlrequest);
        }
        
        function getNivelesFormacion() {
            var urlRequest = '/api/admisiones/NivelFormacion';
            return ejecutarservice(urlRequest);
        }
    }
})();