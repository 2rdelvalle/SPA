(function () {
    'use strict';
    angular.module('mytodoApp.service').service('eventoService', eventoService);

    eventoService.$inject = ['$http', '$q', 'appGenericConstant'];

    function eventoService($http, $q, appGenericConstant) {


        var evnservice = this;

        evnservice.consultarlistValor = getListaValor;
        evnservice.consultarEventos = getEventos;
        evnservice.registrarEventos = postEventos;
        evnservice.actualizaEventos = putEventos;
        evnservice.eliminarEventos = deleteEventos;
        evnservice.consultarPublicos = getPublicos;
        evnservice.consultarPublicosObjetivos = getPublicoObjetivo;
        evnservice.existeEventoCodigo = getExisteEventoCodigo;
        evnservice.existeEventoCodigoNombre = getExisteEventoCodigoNombre;
        // EVENTOS CAMPAÑAS
        evnservice.consultarEventosCampania = getEventosCampanias;
        evnservice.registrarSeguimientoLlamada = postSeguimientoLlamadas;
        evnservice.consultarSeguimientoLlamadasPorPublicoAndContacto = getOnConsultarSeguimientoLlamadasPorPublicoAndContacto;
        evnservice.enviarNotificacionActividad = getEnviarNotificacion;
        evnservice.enviarNotificacionActividadMasiva = getEnviarNotificacionMasiva;


        evnservice.evento = {};
        evnservice.notificarContacto= {};
        evnservice.eventos = [];

        evnservice.visible = {};
        evnservice.visible.titulo = "";
        var url ='/api/crm/';


        function getEventos() {
//            return ejecutarServiceGet(urlrequest);
        }

        function getEventosCampanias(rs) {
//            return ejecutarServiceGet(urlrequest);
        }

        function getListaValor() {
//            return ejecutarServiceGet(urlrequest);
        }

        function getPublicos() {
            var urlrequest = url + 'PublicoObjetivo';
            return ejecutarServiceGet(urlrequest);
        }
        function getPublicoObjetivo(item) {
            var urlrequest = url + 'PublicoObjetivo/' + item;
            return ejecutarServiceGet(urlrequest);
        }
        function getOnConsultarSeguimientoLlamadasPorPublicoAndContacto(item) {
            var urlrequest = url + 'SequimientoLlamada/seguimientollamada/' + item.idActividad + '/' + item.idPublico + '/' + item.id;
            return ejecutarServiceGet(urlrequest);
        }

        function postSeguimientoLlamadas(seguimientoLlamada) {
            var urlrequest = url + 'SequimientoLlamada';
            return ejecutarServicePost(urlrequest, seguimientoLlamada);
        }


        function getEnviarNotificacion(contacto) {
            var urlRequest = url + "SeguimientoActividadEmail/notificacion/actividad";
            return  ejecutarServicePost(urlRequest, contacto);
        }

        function getEnviarNotificacionMasiva(contactos) {
            var urlRequest = url + "SeguimientoActividadEmail/notificacion/actividad/masiva";
            return  ejecutarServicePost(urlRequest, contactos);
        }

        function getExisteEventoCodigo(rs) {
//            return ejecutarServiceGet(urlrequest);
        }

        function getExisteEventoCodigoNombre(rs) {
//            return ejecutarServiceGet(urlrequest);

        }

        function postEventos(rs) {
//            return ejecutarServicePost(urlrequest, rs);
        }

        function putEventos(rs) {
//            return ejecutarServicePut(urlrequest, rs);

        }

        function deleteEventos(rs) {
//            return ejecutarServiceDelete(urlrequest, rs);
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

    }

})();
