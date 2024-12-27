(function () {

    'use strict';

    angular.module('mytodoApp.service').service('entidadesBancariasService', entidadesBancariasService);

    entidadesBancariasService.$inject = ['$http', '$q', 'appGenericConstant'];

    function entidadesBancariasService($http, $q, appGenericConstant) {

        var entidadesbancarias = this;

        entidadesbancarias.consultarEntidadesBancarias = getEntidadesBancarias;
        entidadesbancarias.consultarListaEstados = getListaEstados;
        entidadesbancarias.agregarEntidadBancaria = postAgregarEntidadBancaria;
        entidadesbancarias.actualizarEntidadBancaria = postActualizarEntidadBancaria;
        entidadesbancarias.eliminarEntidadBancaria = postEliminarEntidadBancaria;
        entidadesbancarias.consultarEntidadBancariaById = getEntidadBancariaById;
        entidadesbancarias.eliminarEntidadBancariaMasivo = postEliminarEntidadBancariaMasivo;
        entidadesbancarias.onPostAgregarArchivoBanco = postAgregarArchivoBanco;

        entidadesbancarias.entidadBancariaRecaudo = {};

        entidadesbancarias.entidadBancariaRecaudoAuxiliar = {};
        entidadesbancarias.visible = {};
        entidadesbancarias.visible.validaTelefono = false;
        entidadesbancarias.visible.validaNit = false;
        var url ='/api/';

        function getEntidadesBancarias() {
            var urlRequest = url + 'financiero/Banco';
            return ejectutarService(urlRequest);
        }

        function getListaEstados() {
            var urlRequest = url + 'financiero/ListaValor/ESTADO';
            return ejectutarService(urlRequest);
        }

        function getEntidadBancariaById(id) {
            var urlRequest = url + 'financiero/Banco/' + id;
            return getEntidadBancariaPorId(urlRequest, id);
        }

        function postAgregarEntidadBancaria(rs) {
            var urlRequest = url + 'financiero/Banco';
            return postAgregar(urlRequest, rs);
        }

        function postAgregarArchivoBanco(rs) {
            var urlRequest = url + 'financiero/Banco/archivoBanco';
            return postAgregar(urlRequest, rs);
        }

        function postActualizarEntidadBancaria(rs) {
            var urlRequest = url + 'financiero/Banco';
            return postActualizar(urlRequest, rs);
        }
        function postEliminarEntidadBancariaMasivo(rs) {
            var urlRequest = url + 'financiero/Banco/masivo/' + rs;
            return postEliminar(urlRequest, rs);
        }

        function postEliminarEntidadBancaria(rs) {
            var urlRequest = url + 'financiero/Banco/' + rs;
            return postEliminar(urlRequest, rs);
        }

        function ejectutarService(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEntidadBancariaPorId(urlRequest, id) {
            var defered = $q.defer();
            $http.get(urlRequest, id).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postAgregar(urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postActualizar(urlRequest, rs) {
            var defered = $q.defer();
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
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
    }
})();
