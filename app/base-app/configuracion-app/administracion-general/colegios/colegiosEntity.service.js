(function () {
    'use strict';
    angular.module('mytodoApp.service').service('colegioEntityServices', colegioEntity);
    colegioEntity.$inject = ['$http', '$q', 'appGenericConstant'];
    function colegioEntity($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarColegio = getColegios;
        servicio.buscarPais = getPais;
        servicio.buscarDepartamentoByIdPais = getDepartamentoByIdPais;
        servicio.buscarMunicipioByIdDepartamento = getMunicipioByIdDepartamento;
        servicio.buscarDepartamentoById = getDepartamenById;
        servicio.eliminarColegio = deleteColegio;

        servicio.registrarColegio = postColegio;
        servicio.modificarColegio = putColegio;
        servicio.entidad = {};
        servicio.colegioAuxiliar = {};
        servicio.paisAuxiliar = {};


        var url ='';

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function ejecutarServicePut(urlrequest, rs) {
            var defered = $q.defer();
            $http.put(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServiceDelete(urlRequest) {
            var defered = $q.defer();
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getColegios() {
            var urlrequest = url + '/api/configeneral/Institucion';
            return ejecutarservice(urlrequest);
        }

        function getPais() {
            var urlrequest = url + '/api/configeneral/Pais';
            return ejecutarservice(urlrequest);
        }

        function getMunicipioByIdDepartamento(idDepartamento) {
            var urlrequest = url + '/api/configeneral/Municipio/findByIdDepartamento/' + idDepartamento;
            return ejecutarservice(urlrequest);
        }

        function getDepartamentoByIdPais(idPais) {
            var urlrequest = url + '/api/configeneral/Departamento/findByIdPais/' + idPais;
            return ejecutarservice(urlrequest);
        }

        function getDepartamenById(item) {
            var urlrequest = url + '/api/configeneral/Departamento';
            return ejecutarservice(urlrequest);
        }

        function putColegio(institucion) {
            var urlrequest = url + '/api/configeneral/Institucion';
            return ejecutarServicePut(urlrequest, institucion);
        }

        function deleteColegio(idInstitucion) {
            var urlRequest = url + '/api/configeneral/Institucion/' + idInstitucion;
            return ejecutarServiceDelete(urlRequest);
        }

        function postColegio(institucion) {
            var deferred = $q.defer();
            var urlrequest = url + '/api/configeneral/Institucion';
            $http.post(urlrequest, institucion).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    }
})();


