(function () {
    'use strict';
    angular.module('mytodoApp.service').service('verificarRequisitoServices', verificarRequisitoServices);
    verificarRequisitoServices.$inject = ['$http', '$q', 'localStorageService'];

    function verificarRequisitoServices($http, $q, localStorageService) {
        var servicioRequisitos = this;
        
        servicioRequisitos.traerInscrito = getInscritoSeleccionado;
        servicioRequisitos.inscritoTemporal = localStorageService.get('verificarRequisitosTemporal');
        
        function getInscritoSeleccionado(item){ 
            localStorageService.set('verificarRequisitosTemporal', item);
            servicioRequisitos.inscritoTemporal = localStorageService.get('verificarRequisitosTemporal');
            return servicioRequisitos.inscritoTemporal;
        }    
    }
})();