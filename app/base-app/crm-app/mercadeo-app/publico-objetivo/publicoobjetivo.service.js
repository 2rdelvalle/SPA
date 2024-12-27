(function () {
    'use strict';
    angular.module('mytodoApp.service').service('publiobjetivoService', publiobjetivoService);

    publiobjetivoService.$inject = ['$http', '$q'];

    function publiobjetivoService($http, $q) {

        var publiobjetivoSerivicio = this;

        publiobjetivoSerivicio.publiobjetivo = {};

        publiobjetivoSerivicio.visible = {};
        publiobjetivoSerivicio.visible.titulo = "";
        publiobjetivoSerivicio.visible.eseditable = false;
        publiobjetivoSerivicio.visible.rendered = false;
        publiobjetivoSerivicio.visible.renderedbutton = false;

        publiobjetivoSerivicio.consultarPublicoObjetivos = getPublicoObjetivos;
        publiobjetivoSerivicio.consultarContactos = getContactos;
        publiobjetivoSerivicio.registrarPublicoObjetivo = postPublicoObjetivo;
        publiobjetivoSerivicio.eliminarPublicoObjetivo = deletePublicoObjetivo;
        publiobjetivoSerivicio.eliminarPublicoObjetivoMasivo = deletePublicoObjetivoMasivo;
        publiobjetivoSerivicio.consultarContactosPublicoObjetivos = getContactosPublicoObjetivos;

        var url ='/api/crm';

        function getPublicoObjetivos() {
            var urlrequest = url + '/PublicoObjetivo/All';

            return ejecutarServiceGet(urlrequest);
        }

        function getContactos() {
            var urlrequest = url + '/Cliente';
            return ejecutarServiceGet(urlrequest);
        }

        function postPublicoObjetivo(rs) {
            var urlrequest = url + '/PublicoObjetivo';
            return ejecutarServicePost(urlrequest, rs);

        }

        function deletePublicoObjetivo(rs) {
            var urlrequest = url + '/PublicoObjetivo/' + rs.id;
            return ejecutarServiceDelete(urlrequest, rs);
        }

        function deletePublicoObjetivoMasivo(listaPublicosObjetivos) {
            var defered = $q.defer();
            var urlRequest = url + '/PublicoObjetivo/masivo/' + listaPublicosObjetivos;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
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

        function ejecutarServiceDelete(urlrequest, rs) {
            var defered = $q.defer();
            //aqui debe ir metodo $http.delete pero como es borrado logico se actualiza la información
            $http.delete(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
        function getContactosPublicoObjetivos(id) {
            var urlrequest = url + '/PublicoObjetivo/Contactos/'+ id;
            return ejecutarServiceGet(urlrequest);
        }
    }

})();
