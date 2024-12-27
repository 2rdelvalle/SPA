(function () {
    'use strict';
    angular.module('mytodoApp').controller('ubicacionCtrl', ubicacionCtrl);

    ubicacionCtrl.$inject = ['ubicacionServices', '$timeout', 'appConstant', 'appGenericConstant'];
    function ubicacionCtrl(ubicacionServices, $timeout, appConstant, appGenericConstant) {
        var gestionUbicacion = this;
        $timeout(function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    gestionUbicacion.latitud = position.coords.latitude;
                    gestionUbicacion.longitud = position.coords.longitude;
                });
            }
        });

        function getIP() {
            swal(appGenericConstant.CARGANDO_MAPA_ESPERE);
            appConstant.CARGANDO();
            ubicacionServices.resolve().then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionUbicacion.miIP = data;
            });
        }

        getIP();
    }

})();