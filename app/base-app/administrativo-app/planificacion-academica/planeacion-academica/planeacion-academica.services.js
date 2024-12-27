(function () {
    'use strict';
    angular.module('mytodoApp.service').service('planeacionAcademicaServices', planeacionAcademicaServices);
    planeacionAcademicaServices.$inject = ['$http', '$q'];
    function planeacionAcademicaServices($http, $q) {
        var servicioPlaneacionAcademica = this;
        servicioPlaneacionAcademica.buscarPlanecionAcademica = getPlanecionAcademicaByEstadoLogico;
        servicioPlaneacionAcademica.buscarPorPlaneacion = getPlanecionAcademica;
        servicioPlaneacionAcademica.programasAdemicos = BuscarProgamasAcademios;
        servicioPlaneacionAcademica.listarNivelesFormacion = listaNivelesFormacion;
        servicioPlaneacionAcademica.buscarPeriodo = buscarPeriodoAcademico;
        servicioPlaneacionAcademica.infoProgramasAdemicos = BuscarInfoProgamasAcademios;
        servicioPlaneacionAcademica.buscarRecurso = getRecursoEducativo;
        servicioPlaneacionAcademica.agregarPlanecionAcademica = postPlanecionAcademica;
        servicioPlaneacionAcademica.eliminarPaneacionAcademica = deletePaneacionAcademica;
        servicioPlaneacionAcademica.eliminarPaneacionAcademicaMasivo = deletePaneacionAcademicaMasivo;
        servicioPlaneacionAcademica.actualizarPlanecionAcademica = putPlanecionAcademica;
        servicioPlaneacionAcademica.planeacionAcademica = {};
        servicioPlaneacionAcademica.planeacionAcademicaAuxiliar = {};
        var url = '/api/';
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function getPlanecionAcademicaByEstadoLogico() {
//            var urlRequest = url + 'admisiones/PlaneacionAcademica';
            var urlRequest = url + 'admisiones/PlaneacionAcademica/all';
            return ejecutarServicesGet(urlRequest);
        }
        function postPlanecionAcademica(PlanecionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/PlaneacionAcademica';
            $http.post(urlRequest, PlanecionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function deletePaneacionAcademica(PlanecionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/PlaneacionAcademica/' + PlanecionAcademica.id;
            $http.delete(urlRequest, PlanecionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function deletePaneacionAcademicaMasivo(PlanecionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/PlaneacionAcademica/masivo/' + PlanecionAcademica;
            $http.delete(urlRequest, PlanecionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putPlanecionAcademica(PlanecionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/PlaneacionAcademica/actualizar';
            $http.post(urlRequest, PlanecionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function BuscarInfoProgamasAcademios(dato, idperiodo) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/PlaneacionAcademica/informacionPrograma/' + dato + '/' + idperiodo;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function BuscarProgamasAcademios(dato) {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/Programa/nivelformacionPrograma/' + dato;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function buscarPeriodoAcademico() {
            var urlRequest = url + 'admisiones/PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServicesGet(urlRequest);
        }
        function getRecursoEducativo() {
            var urlRequest = url + 'admisiones/RecursoEducativo';
            return ejecutarServicesGet(urlRequest);
        }
        function listaNivelesFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'admisiones/NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function getPlanecionAcademica(planeacion) {
            var urlRequest = url + 'admisiones/PlaneacionAcademica/buscarPlaneacion/' + planeacion;
            return ejecutarServicesGet(urlRequest);
        }
    }
})();



