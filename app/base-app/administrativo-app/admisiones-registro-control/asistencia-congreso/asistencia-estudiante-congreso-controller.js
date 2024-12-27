(function () {
    'use strict';
    angular.module('mytodoApp').controller('AsistenciaCongresoCtrl', AsistenciaCongresoCtrl);
    AsistenciaCongresoCtrl.$inject = ['$scope', 'asistenciaCongresoServices', 'localStorageService', '$filter', 'utilServices', 'appConstant', '$window', 'appGenericConstant', '$http','$location'];
    function AsistenciaCongresoCtrl($scope, asistenciaCongresoServices, localStorageService, $filter, utilServices, appConstant, $window, appGenericConstant, $http,$location) {
       
        var idEstadoPeriodoAcaAbierto = 11;
        var gestionAsistenciaCongreso = this;
        var config = { disableCountDown: true, ttl: 5000 };

        gestionAsistenciaCongreso.disabledCodigo = true;
        gestionAsistenciaCongreso.periodosAcademico = '';
        gestionAsistenciaCongreso.periodo = []; 
        gestionAsistenciaCongreso.listAsistencia = [];
        gestionAsistenciaCongreso.estados = [];
        gestionAsistenciaCongreso.listadoGrupos = [];
        gestionAsistenciaCongreso.programaAcademicolist = [];
        gestionAsistenciaCongreso.mensajeValidacion = true;
        gestionAsistenciaCongreso.disabledCampos = false;
       
        

        
    
        gestionAsistenciaCongreso.ejecutarConsultarPeriodoAcademico = function () {
        asistenciaCongresoServices.consultarPeriodoAcademico().then(function (data) {
             gestionAsistenciaCongreso.periodo = data
               gestionAsistenciaCongreso.periodosAcademico = data[0].id;
          }).catch(function (e) {
                 return;
             });
          }; 


      
        function init() {           
            onFiltrarAsistenciaDelDia();
        }

        
     

        gestionAsistenciaCongreso.guardarAsistencia = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            var asistencia = {
                idEstudiante: item.idEstudiante,
                idMatricula: item.idMatricula,
                codigo: '' + item.id,
                identificacion: item.identificacion,
                estadoAsistencia: 'SI',
                nombrePrograma: item.nombrePrograma,
                idPrograma: item.idPrograma,
                idPeriodo: item.idPeriodo,
                idPeriodoAcademico:item.idPeriodoAcademico
            }

            asistenciaCongresoServices.postGuardarAsistencia(asistencia).then(function (data) {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                init();
                //gestionAsistenciaCongreso.onFiltrarAsistenciaDelDia();
                
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                gestionAsistenciaCongreso.onCloseModal();
                throw e;
            });
        };
       

        function onFiltrarAsistenciaDelDia() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            asistenciaCongresoServices.getListadoEstudiantes().then(function (data) {
                gestionAsistenciaCongreso.listAsistencia = data.objectResponse;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
       
        gestionAsistenciaCongreso.ejecutarConsultarPeriodoAcademico();

     
        init();
    }
})();