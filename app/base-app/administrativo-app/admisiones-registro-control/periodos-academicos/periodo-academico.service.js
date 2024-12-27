(function () {
    'use strict';
    angular.module('mytodoApp.service').service('periodosAcademicosServices', periodosAcademicosServices);
    periodosAcademicosServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function periodosAcademicosServices($http, $q, appGenericConstant) {
        var servicioPeriodoAcademico = this;
        servicioPeriodoAcademico.buscarPeriodoAcademicoByEstado = getPeriodoAcademicoByEstado;
        servicioPeriodoAcademico.agregarPeriodoAcademico = postPeriodoAcademico;
        servicioPeriodoAcademico.cierrePeriodoAcademico = postPeriodoAcademicoCierre;
        servicioPeriodoAcademico.eliminarPeriodoAcademico = deleteOnePeriodoAcademico;
        servicioPeriodoAcademico.eliminarPeriodosAcademicos = deletePeriodoAcademico;
        servicioPeriodoAcademico.actualizarPeriodoAcademico = putPeriodoAcademico;
        servicioPeriodoAcademico.periodoAcademico = {};
        servicioPeriodoAcademico.periodoAcademico.fechaInicio = '';
        servicioPeriodoAcademico.periodoAcademico.fechaFin = '';
        servicioPeriodoAcademico.periodoAcademico.estado = null;
        servicioPeriodoAcademico.periodoAcademicoAuxiliar = {};
        var url = '/api/admisiones/';

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getPeriodoAcademicoByEstado() {
            var urlRequest = url + 'PeriodoAcademico';
            return ejecutarServicesGet(urlRequest);
        }

        function postPeriodoAcademico(periodoAcademico) {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico';
            $http.post(urlRequest, periodoAcademico).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postPeriodoAcademicoCierre(periodoAcademico) {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico/cierrePeriodo';
            $http.post(urlRequest, periodoAcademico).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteOnePeriodoAcademico(periodoAcademico) {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico/' + periodoAcademico.id;
            $http.delete(urlRequest, periodoAcademico).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function deletePeriodoAcademico(listaPeriodoAcademico) {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico/masivo/' + listaPeriodoAcademico;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putPeriodoAcademico(periodoAcademico) {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico';
            $http.put(urlRequest, periodoAcademico).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();