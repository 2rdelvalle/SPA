(function () {
    'use strict';
    angular.module('mytodoApp.service').service('parametrosCreditosServices', parametrosCreditosServices);
    parametrosCreditosServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function parametrosCreditosServices($http, $q, appGenericConstant) {
        var servicioParametroCredito = this;
        servicioParametroCredito.buscarParametroCreditoByPeriodo = getParametroCreditoByPeriodo;
        servicioParametroCredito.buscarParametroCreditoByEstado = getParametroCreditoByEstado;
        servicioParametroCredito.buscarParametroCreditoByCodigo = getParametroCreditoByCodigo;
        servicioParametroCredito.buscarParametroCreditoByNombre = getParametroCreditoByNombre;
        servicioParametroCredito.buscarPeriodoAcademico = getPeriodoAcademico;
        servicioParametroCredito.buscarFormasPago = getFormaPago;
        servicioParametroCredito.agregarParametroCredito = postParametroCredito;
        servicioParametroCredito.eliminarParametroCredito = deleteParametroCredito;
        servicioParametroCredito.actualizarParametroCredito = putParametroCredito;
        servicioParametroCredito.parametroCredito = {};
        servicioParametroCredito.parametroCreditoAuxiliar = {};

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        var url ='/';


        function getParametroCreditoByPeriodo() {
            var urlRequest = url + 'api/financiero/ParametroCredito/byPeriodo';
            return ejecutarServicesGet(urlRequest);
        }

        function getParametroCreditoByEstado(periodo) {
            var urlRequest = url + 'api/financiero/parametro_credito?periodoAcademico.id=' + periodo.id;
            return ejecutarServicesGet(urlRequest);
        }

        function getFormaPagoList() {
            var urlRequest = url + 'api/financiero/FormaPago?estado=A&&codigo=322&&codigo=323';
            return ejecutarServicesGet(urlRequest);
        }

        function getLineaCreditoList() {
            var urlRequest = url + 'api/financiero/linea_credito';
            return ejecutarServicesGet(urlRequest);
        }

        function getPeriodoAcademico() {
            var urlRequest = url + 'api/financiero/periodo_academico';
            return ejecutarServicesGet(urlRequest);
        }

        function getFormaPago() {
            var urlRequest = url + 'api/financiero/fPago?estadoLogico=A&&codigo=323';
            return ejecutarServicesGet(urlRequest);
        }

        function getParametroCreditoByCodigo(parametroCredito) {
            var upperCase;
            if (typeof parametroCredito.codigo === 'string') {
                upperCase = ".toUpperCase()";
            } else {
                upperCase = '';
            }
            var urlRequest = url + 'api/financiero/ParametroCredito?codigo=' + parametroCredito.codigo + upperCase;
            return ejecutarServicesGet(urlRequest);
        }

        function getParametroCreditoByNombre(parametroCredito) {
            var urlRequest = url + 'api/financiero/ParametroCredito?nombre=' + parametroCredito.nombre.toUpperCase();
            return ejecutarServicesGet(urlRequest);
        }

        function postParametroCredito(parametroCredito) {
            var defered = $q.defer();
            var urlRequest = url + 'api/financiero/ParametroCredito';
            $http.post(urlRequest, parametroCredito).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteParametroCredito(parametroCredito) {
            var defered = $q.defer();
            var urlRequest = url + 'api/financiero/ParametroCredito/' + parametroCredito.id;
            $http.delete(urlRequest, parametroCredito).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putParametroCredito(parametroCredito) {
            var defered = $q.defer();
            var urlRequest = url + 'api/financiero/ParametroCredito/' + parametroCredito.id;
            $http.put(urlRequest, parametroCredito).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();