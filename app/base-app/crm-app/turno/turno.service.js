(function () {
    'use strict';
    angular.module('mytodoApp.service').service('turnoService', turnoService);
    
    turnoService.$inject = ['utilServices'];
    
    function turnoService(utilServices) {

        var url = '/api/crm/Turno/';

        this.postTurno = function (turno) {
            var urlRequest = url + '';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, turno);
        };

        this.onPostAgregarTurno = function (turno) {
            var urlRequest = url + 'guardarUsuarioModulo';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, turno);
        };

        this.turnoByUbicacionAndActivo = function (ubicacion, activo) {
            var urlRequest = url + 'turnoByUbicacionAndActivo/' + ubicacion + '/' + activo;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        this.turnoUsuarioUbicacion = function (rs) {
            var urlRequest = url + 'turnoUsuarioUbicacion/' + rs;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };
        
        this.turnoUsuarioUbicacionS = function (rs) {
            var urlRequest = url + 'turnoUsuarioUbicacionS/' + rs;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        this.turnoByActivo = function (rs) {
            var urlRequest = url + 'turnoByActivo/' + rs;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        this.turnoByUbicacion = function (rs) {
            var urlRequest = url + 'turnoByUbicacion/' + rs;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

    }
})();