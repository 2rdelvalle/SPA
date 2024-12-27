(function () {
    'use strict';
    angular.module('mytodoApp.service').service('franquiciaService', franquiciaService);
    franquiciaService.$inject = ['$http', '$q', 'appGenericConstant'];
    function franquiciaService($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.registrar = getGuardarFranquicias;
        servicio.eliminar = getEliminarFranquicia;
        servicio.modificar = getModificarFranquicia;
        servicio.consultar = getConsultarFranquiciasActivas;
        servicio.consultarBancos = getConsultarBancosActivos;
        servicio.consultarConvenios = getConsultarConvenios;
        servicio.consultarBanco = getConsultarBanco;
        servicio.consultarFranquiciaInactivas = getConsultarFranquiciaInactivas;
        servicio.registarFranquiciante = onGuardarFranquiciante;
        servicio.consultarConveniosBancosFranquicias = onConsultarConvenioBancoFranquicia;
        servicio.franquicia = {};
        servicio.franquiciaAuxiliar = {};
        servicio.franquiciaConvenio = {};
        servicio.aux = {};
        servicio.consultarFranquiciante = onConsultarFranquiciasByNombre;
        servicio.consultarFranquicianteCodigo = onConsultarFranquiciasByCodigo;
        servicio.getListaEstados = onListarEstados;
        var url ='/api/';

        function getConsultarFranquiciasActivas() {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function getGuardarFranquicias(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getModificarFranquicia(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia/';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEliminarFranquicia(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia/' + rs.id;
            $http.delete(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getConsultarBancosActivos() {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Banco/activos';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function getConsultarConvenios() {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Convenio';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function onGuardarFranquiciante(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Convenio';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getConsultarBanco(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Banco/byOne/' + rs.id;
            $http.get(urlRequest).success(function (response) {
                //$http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function getConsultarFranquiciaInactivas(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia/' + rs.id;
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function onConsultarConvenioBancoFranquicia(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Franquicia?banco.id=' + rs.banco.id + '&convenio.id=' + rs.convenio.id;
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function onConsultarFranquiciasByNombre(franquiciante) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Convenio/byNombre/' + franquiciante.nombreConvenio;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function onConsultarFranquiciasByCodigo(franquiciante) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/Convenio/byCodigo/' + franquiciante.codigoConvenio;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function onListarEstados() {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/listavalor/ListaValor/listaEstados';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }
    }

})();