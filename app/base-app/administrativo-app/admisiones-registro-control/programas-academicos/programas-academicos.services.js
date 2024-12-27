(function () {
    'use strict';
    angular.module('mytodoApp.service').service('programasAcademicosEntitiesServices', programasAcademicosEntitiesServices);
    programasAcademicosEntitiesServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function programasAcademicosEntitiesServices($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarProgramasAcademicos = Buscar;
        servicio.agregarProgramasAcademicos = Agregar;
        servicio.eliminarProgramasAcademicos = Eliminar;
        servicio.eliminarProgramasAcademicosMasivo = EliminarMasivo;
        servicio.actualizarProgramasAcademicos = Actualizar;
        servicio.cargarListaNivelFormacion = ListaNivelFormacion;
        servicio.cargarListaFacultades = ListaFacultades;
        servicio.buscarMaximoNivel = BuscarMaxNivel;
        servicio.consultarPorgramaById = BuscarProgramaByID;
        servicio.programasAcademicos = {};
        servicio.programasAcademicosAux = {};
        servicio.visible = {};
        servicio.visible.validaJornada = false;
        var url = '/api/admisiones/';

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/all2';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function BuscarProgramaByID(programa) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/consultarPrograma/' + programa.id;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function BuscarMaxNivel() {
            var defered = $q.defer();
            var urlRequest = url + 'Universidad/all';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaNivelFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaFacultades() {
            var defered = $q.defer();
            var urlRequest = url + 'Facultad';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function EliminarMasivo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/masivo/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();





