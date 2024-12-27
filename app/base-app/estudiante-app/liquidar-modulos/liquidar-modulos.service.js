(function () {

    'use strict';

    angular.module('mytodoApp.service').service('liquidarModuloEstudienteService', liquidarModuloEstudienteService);

    liquidarModuloEstudienteService.$inject = ['$http', '$q'];

    function liquidarModuloEstudienteService($http, $q) {

        var liquidarMatriculaSer = this;
        var url = '/api/financiero/';

        liquidarMatriculaSer.consultarEstudiante = getEstudianteById;
        liquidarMatriculaSer.consultarEstudianteDescuento = getEstudianteDescuentoByCodigo;
        liquidarMatriculaSer.armarModulos = getModuloByModalidad;
        liquidarMatriculaSer.liquidarMatricula = {};
        liquidarMatriculaSer.liquidarMatriculaAuxiliar = {};

        function getEstudianteById(rs) {
            var urlRequest = url + "Estudiante/liquidacion/byCodigo/" + rs;
            return ejectutarServiceId(urlRequest, rs);
        }
        
        function getEstudianteDescuentoByCodigo(rs) {
            var urlRequest = url + "LiquidacionConcepto/historialLiquidacionEstudianteDescuentoByCodigo/" + rs;
            return ejectutarServiceId(urlRequest, rs);
        }

        function getModuloByModalidad(rs) {
            var urlRequest = url + "LiquidacionConcepto/armarLiquidacionMatricula/" + rs.idModalidad + "/" + rs.idPeriodo + "/" + rs.idPrograma + "/" + rs.nivel + "/" + rs.idEstudiante;
            return ejectutarServiceId(urlRequest, rs);
        }

        function ejectutarServiceId(urlRequest, rs) {
            var defered = $q.defer();
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

    }
})();



