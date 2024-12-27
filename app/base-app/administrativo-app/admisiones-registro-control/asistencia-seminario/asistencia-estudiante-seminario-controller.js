(function () {
    'use strict';
    angular.module('mytodoApp').controller('AsistenciaSeminarioCtrl', AsistenciaSeminarioCtrl);
    AsistenciaSeminarioCtrl.$inject = ['$scope', 'asistenciaSeminarioServices', 'localStorageService', '$filter', 'utilServices', 'appConstant', '$window', 'appGenericConstant', '$http'];
    function AsistenciaSeminarioCtrl($scope, asistenciaSeminarioServices, localStorageService, $filter, utilServices, appConstant, $window, appGenericConstant, $http) {

        var idEstadoPeriodoAcaAbierto = 11;
        var gestionAsistenciaSeminario = this;
        var config = { disableCountDown: true, ttl: 5000 };

        gestionAsistenciaSeminario.disabledCodigo = true;
        gestionAsistenciaSeminario.listAsistencia = [];
        gestionAsistenciaSeminario.periodosAcademico = '';
        gestionAsistenciaSeminario.periodo = [];
        gestionAsistenciaSeminario.periodoSelect = null;
        gestionAsistenciaSeminario.estados = [];
        gestionAsistenciaSeminario.listadoGrupos = [];
        gestionAsistenciaSeminario.programaAcademicolist = [];
        gestionAsistenciaSeminario.mensajeValidacion = true;
        gestionAsistenciaSeminario.disabledCampos = false;



        gestionAsistenciaSeminario.ejecutarConsultarPeriodoAcademico = function () {

            asistenciaSeminarioServices.consultarPeriodoAcademico().then(function (data) {
                gestionAsistenciaSeminario.periodo = data
                gestionAsistenciaSeminario.periodosAcademico = data[0].id;
              }).catch(function (e) {
                     return;
                 });
              };

        function init() {
          onFiltrarAsistenciaDelDia();
        }

        gestionAsistenciaSeminario.guardarAsistencia = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            var asistencia = {
                idMatricula: item.idLiquidacion,
                codigo: '' + item.id,
                identificacion: item.identificacion,
                estadoAsistencia: 'SI',
                nombrePrograma: item.nombrePrograma,
                idPrograma: item.idPrograma,
                idPeriodo: item.idPeriodo,
                idPeriodoAcademico:item.idPeriodoAcademico
            }

            asistenciaSeminarioServices.postGuardarAsistencia(asistencia).then(function (data) {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                init();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                gestionAsistenciaSeminario.onCloseModal();
                throw e;
            });
        };

      function onFiltrarAsistenciaDelDia() {
          appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
          appConstant.CARGANDO();

          asistenciaSeminarioServices.getListadoEstudiantes().then(function (data) {
              gestionAsistenciaSeminario.listAsistencia = data.objectResponse;
              appConstant.CERRAR_SWAL();
            }).catch(function (e) {
              appConstant.CERRAR_SWAL();
              appConstant.MSG_GROWL_ERROR();
              return;
            });
          };

        gestionAsistenciaSeminario.ejecutarConsultarPeriodoAcademico();

        init();
    }
})();
