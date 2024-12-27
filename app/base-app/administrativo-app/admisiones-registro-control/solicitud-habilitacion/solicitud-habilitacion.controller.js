(function (){
    'use strict';
    angular.module('mytodoApp').controller('SolicitudHabilitacionCtrl', SolicitudHabilitacionCtrl);
    SolicitudHabilitacionCtrl.$inject = ['$scope', 'solicitudHabilitacionServices', 'ValidationService', 'utilServices', 'appConstant', 'appConstantValueList', 'appGenericConstant', 'localStorageService'];
    function SolicitudHabilitacionCtrl($scope, solicitudHabilitacionServices, ValidationService, utilServices, appConstant, appConstantValueList, appGenericConstant, localStorageService) {
        
        var SolicitudHabilitacion = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        
        $('#divDatosEstudiante').hide();
        
        SolicitudHabilitacion.newSolicitud = solicitudHabilitacionServices.solicitud;
        
        
        SolicitudHabilitacion.onConsultarEstudiante = function (idEstudiante) {
            
                solicitudHabilitacionServices.buscarEstudianteByCodigo(idEstudiante).then(function (data) {
                    if (data === null || data === undefined || data.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_REPROBADO);
                        $('#divDatosEstudiante').hide();
                        appConstant.CERRAR_SWAL();
                        return;
                    } else {
                        $('#divDatosEstudiante').show();
                        SolicitudHabilitacion.newSolicitud.idEstudiante = data[0].idEstudiante;
                        SolicitudHabilitacion.newSolicitud.idModulo = data[0].idModulo;
                        SolicitudHabilitacion.newSolicitud.nombreModulo = data[0].nombreModulo;
                        SolicitudHabilitacion.newSolicitud.idMatricula = data[0].idMatricula;
                        SolicitudHabilitacion.newSolicitud.idPeriodo = data[0].idPeriodo;
                        SolicitudHabilitacion.newSolicitud.notaDefinitiva = data[0].notaDefinitiva;
                        
                        
                        appConstant.CERRAR_SWAL();

                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    appConstant.CERRAR_SWAL();
                    return;
                });
        };
        
        SolicitudHabilitacion.onPresionarEnter = function (tecla, referencia) {
            if (tecla.keyCode === 13) {
                if (referencia === null || referencia === '' || referencia === undefined) {
                    SolicitudHabilitacion.requerido = "required";
                    if (new ValidationService().checkFormValidity($scope.formBusquedaModulo)) {
                    }
                    return;
                }
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var res = referencia.split(".");
                var refer = res[res.length - 1];
                if (refer === null || refer === undefined || refer === '') {
                    appConstant.CERRAR_SWAL();
                    SolicitudHabilitacion.buscarModulo.numeroRef = '';
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.INGRESE_NUEVAMENTE_REFERENCIA);
                    return;
                }
                referencia = refer.replace("'", "-");
                SolicitudHabilitacion.buscarModulo.numeroRef = referencia;
                SolicitudHabilitacion.onConsultarRef(referencia);
            }
        };

        SolicitudHabilitacion.onConsultarRef = function (referencia) {
            if (referencia === null || referencia === '' || referencia === undefined) {
                SolicitudHabilitacion.requerido = "required";
                if (new ValidationService().checkFormValidity($scope.formBusquedaModulo)) {
                }
                return;
            }
            if (new ValidationService().checkFormValidity($scope.formBusquedaModulo)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                SolicitudHabilitacion.listaTransacciones = [];
                solicitudHabilitacionServices.buscarReferencia(referencia).then(function (data) {

                    if (data === null || data === undefined || data.length === 0 || data === "") {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.REFERENCIA_NO_ENCONTRADA);
                    } else {
                        if (data.estadoLiquidacion === 'PAGADA') {
                            
                            solicitudHabilitacionServices.buscarIdLiquidacion(data.id).then(function (value) {
                                if (value !== "") {
                                    appConstant.CERRAR_SWAL();
                                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.SOLICITUD_HABILITACION_EXISTE);
                                } else {
                                    
                                    SolicitudHabilitacion.newSolicitud.idLiquidacion = data.id;
                                    SolicitudHabilitacion.onConsultarEstudiante(data.idEstudiante);
                                }

                            }).catch(function (e) {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            });
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.REFERENCIA_NO_PAGADA);
                        }
                    }

                    SolicitudHabilitacion.buscarModulo.numeroRef = '';
                    new ValidationService().resetForm($scope.formBusquedaModulo);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };
        
        SolicitudHabilitacion.onGuardar = function(){
            
            var nuevaSolicitud = {
                        idUsuario: localStorageService.get('usuario').id,
                        nombreUsuario: localStorageService.get('usuario').username,
                        idEstudiante: SolicitudHabilitacion.newSolicitud.idEstudiante,
                        idModulo: SolicitudHabilitacion.newSolicitud.idModulo,
                        idLiquidacion: SolicitudHabilitacion.newSolicitud.idLiquidacion,
                        nombreModulo: SolicitudHabilitacion.newSolicitud.nombreModulo,
                        idMatricula: SolicitudHabilitacion.newSolicitud.idMatricula,
                        idPeriodo: SolicitudHabilitacion.newSolicitud.idPeriodo,
                        notaDefinitiva: SolicitudHabilitacion.newSolicitud.notaDefinitiva,
                        estado: appGenericConstant.PAGADA
                        
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            solicitudHabilitacionServices.guardarSolicitudDeHabilitacion(nuevaSolicitud).then(function (data) {
                if (data.tipo === 200) {
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.SOLICITUD_HABILITACION_HECHA);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
            new ValidationService().resetForm($scope.formCambioHorario);
            
        };
        
    }
    
})();