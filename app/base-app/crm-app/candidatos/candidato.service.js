(function () {
    'use strict';
    angular.module('mytodoApp.service').service('candidatoServices', candidatoServices);
    candidatoServices.$inject = ['$http', '$q', 'utilServices'];

    function candidatoServices($http, $q, utilServices) {
        var servicio = this;
        servicio.buscarCandidato = Buscar;
        servicio.agregarCandidato = Agregar;
        servicio.agregarCandidatoN = AgregarCandidatoN;
        servicio.guardarCandidatoDetalle = GuardarCandidatoDetalle;
        servicio.eliminarCandidato = Eliminar;
        servicio.subirSoporte = uploadFile;
        servicio.consultarPeriodoAcademico = getPeriodoAcademico;
        servicio.consultarDetalleCandidatos = BuscarDetalle;
        servicio.consultarDetalleCandidatosDelDia = BuscarDetalleDia;
        servicio.consultarDetalleCandidatoNoAsignado = BuscarDetalleNoAsignado;
        servicio.onGetDashboardCandidatos = getDashboardCandidatos;
        servicio.candidato = {};
        servicio.candidatoAux = {};
        servicio.visible = {};
        servicio.visible.validoFile = false;

        var url = '/api/crm/';


        function Buscar() {
            var urlRequest = url + 'Candidato';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function BuscarDetalle(id) {
            var urlRequest = url + 'Candidato/detalle/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function BuscarDetalleDia(id) {
            var urlRequest = url + 'Candidato/detalleDia/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function BuscarDetalleNoAsignado(id) {
            var urlRequest = url + 'Candidato/detalleNoAsignado/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getPeriodoAcademico() {
            var urlRequest = url + 'PeriodoAcademico/byEstado/ACTIVO';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getDashboardCandidatos(id, tipo) {
            var urlRequest = url + 'Candidato/dashboardCandidato/' + id + "/" + tipo;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'fileupload/candidato';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function AgregarCandidatoN(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Candidato';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function GuardarCandidatoDetalle(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Candidato/GuardarCandidatoDetalle';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Docente/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function uploadFile(file) {
            var defered = $q.defer();
            var urlRequest = '/api/crm/fileupload/uploadFile';
            var fd = new FormData();
            fd.append('file', file);
            $http.post(urlRequest, fd, {transformRequest: angular.identity,
                headers: {'Content-Type': undefined
                }
            }).success(function (response) {
                defered.resolve(response);
            }).error(function () {
            });
            return defered.promise;
        }
    }
})();








