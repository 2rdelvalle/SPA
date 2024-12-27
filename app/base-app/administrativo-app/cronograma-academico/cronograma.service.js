(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cronogramaService', cronogramaService);

    cronogramaService.$inject = ['$http', '$q'];

    function cronogramaService($http, $q) {

        var cronogramaSerivicio = this;

        cronogramaSerivicio.cronograma={};
        
        cronogramaSerivicio.visible = {};
        cronogramaSerivicio.visible.titulo = "";
        cronogramaSerivicio.visible.eseditable = false;
        cronogramaSerivicio.visible.rendered = false;
        cronogramaSerivicio.visible.renderedbutton = false;

        cronogramaSerivicio.consultarCronograma = getCronograma;
        cronogramaSerivicio.consultarPeriodoAcademico = getPeriodoAcademico;
        cronogramaSerivicio.consultarEstadosCronograma = getEstadosCronograma;
        cronogramaSerivicio.registrarCronograma = postCronograma;
        cronogramaSerivicio.actualizaCronograma = putCronograma;


        function getCronograma() {
            
            var urlrequest = 'http://localhost:3700/cronogramas';

            return ejecutarServiceGet(urlrequest);
        }

        function getPeriodoAcademico() {

            var urlrequest = 'http://localhost:3700/periodo_academico';

            return ejecutarServiceGet(urlrequest);
        }
        
        function postCronograma(rs) {

            var urlrequest = 'http://zabud.cloudapp.net:3700/cronograma';

            return ejecutarServicePost(urlrequest, rs);

        }
        
        function putCronograma(rs) {
            
            var urlrequest = 'http://zabud.cloudapp.net:3700/cronograma/' + rs.id;
            
            return ejecutarServicePut(urlrequest, rs);
        }

        function getEstadosCronograma() {

            var urlrequest = 'http://localhost:3700/listavalor?categoria=ESTADO_CRONOGRAMA';

            return ejecutarServiceGet(urlrequest);
        }
        

        function ejecutarServiceGet(urlrequest) {

            var defered = $q.defer();
            
            $http.get(urlrequest).success(function (response) {
                
                defered.resolve(response);
                
            }).error(function (error) {
                
                defered.reject(error);
                
            });

            return defered.promise;
        }

        function ejecutarServicePost(urlrequest, rs) {
            
            var defered = $q.defer();
            
            $http.post(urlrequest, rs).success(function (response) {
                
                defered.resolve(response);
                
            }).error(function (error) {
                
                defered.reject(error);
                
            });

            return defered.promise;
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


    }

})();
