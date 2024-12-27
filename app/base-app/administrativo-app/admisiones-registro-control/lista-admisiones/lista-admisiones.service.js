(function () {
    'use strict';
    angular.module('mytodoApp.service').service('listaAdmisionesServices', listaAdmisionesServices);
    listaAdmisionesServices.$inject = ['$http', '$q', 'growl', 'appGenericConstant'];

    function listaAdmisionesServices($http, $q, growl, appGenericConstant) {
        var servicioListaAdmisiones = this;
        servicioListaAdmisiones.consultarLista = getLista;
        servicioListaAdmisiones.consultarListaDiaria = getListaDiaria;
        servicioListaAdmisiones.buscarNivelesFormacion = getNivelesFormacion;
        servicioListaAdmisiones.buscarPeriodosAcademicos = getPeriodoAcademico;
        servicioListaAdmisiones.buscarSeccional = getSeccional;

        var url ="/api/admisiones/";

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getLista(periodo, nivel) {
            var urlRequest = url + 'ListaAdmisiones/listaAdmisiones/' + periodo + '/' + nivel;
            return ejecutarServicesGet(urlRequest);
        }

        function getListaDiaria(periodo, nivel, seccional) {
            var urlRequest = url + 'ListaAdmisiones/listaAdmisionesSeccional/' + periodo + '/' + nivel + '/' + seccional;
            return ejecutarServicesGet(urlRequest);
        }

        function getNivelesFormacion() {
            var urlRequest = url + 'NivelFormacion';
            return ejecutarServicesGet(urlRequest);
        }

      function getSeccional() {
        var urlRequest = url + 'Seccional';
        return ejecutarServicesGet(urlRequest);
      }

        function getPeriodoAcademico() {
            var urlRequest = url + 'PeriodoAcademico/todos';
            return ejecutarServicesGet(urlRequest);
        }
    }
})();
