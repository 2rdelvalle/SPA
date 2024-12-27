(function () {
    'use strict';
    angular.module('mytodoApp.service').service('usuarioEntitiesServices', usuarioEntitiesServices);
    usuarioEntitiesServices.$inject = ['utilServices', '$http', '$q'];

    function usuarioEntitiesServices(utilServices, $http, $q) {
        var servicio = this;
        servicio.buscarUsuario = Buscar;
        servicio.onListaContratosByIdFuncionario = ListaContratosByIdFuncionario;
        servicio.agregarUsuario = Agregar;
        servicio.onAgregarContrato = AgregarContrato;
        servicio.actualizarUsuario = Actualizar;
        servicio.cargarListaCargo = ListaCargo;
        servicio.usuario = {};
        servicio.usuarioAux = {};
        servicio.visible = {};
        servicio.visible.validaJornada = false;
        servicio.subirarchivos = onSubirfoto;
        servicio.downloadFoto = onDownloadfoto;

        var url = '/api/auth';
        function Buscar() {
            var urlRequest = url + '/Funcionario';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function ListaCargo() {
            var urlRequest = url + '/Cargo/estadoActivo';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function ListaContratosByIdFuncionario(id) {
            var urlRequest = url + '/Funcionario/listContratosByIdFuncionario/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + '/Funcionario';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function AgregarContrato(rs) {
            var defered = $q.defer();
            var urlRequest = url + '/Funcionario/guardarContrato';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + '/Funcionario';
            $http.put(urlRequest, rs
                    ).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function onSubirfoto() {
            var urlRequest = url + '/fileupload/upload';
            return urlRequest;
        }

        function onDownloadfoto(file) {
            var urlRequest = url + '/fileupload/download/' + file;
            return urlRequest;
        }
    }
})();











