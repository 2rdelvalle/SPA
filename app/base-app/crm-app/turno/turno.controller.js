(function () {
    'use strict';
    angular.module('mytodoApp').controller('TurnoCtrl', TurnoCtrl);

    TurnoCtrl.$inject = ['turnoService', 'historialLiquidacionServices', 'appConstant', 'ValidationService', 'localStorageService', 'utilServices', '$scope', '$interval', 'appGenericConstant', 'appConstantValueList'];
    function TurnoCtrl(turnoService, historialLiquidacionServices, appConstant, ValidationService, localStorageService, utilServices, $scope, $interval, appGenericConstant, appConstantValueList) {

        var gestionTurno = this;
        gestionTurno.turno = {nombre: ""};
        gestionTurno.disabledCampos = true;
        gestionTurno.showUbicacionTurno = false;

        if (localStorageService.get('usuario') !== null) {
            gestionTurno.usuario = localStorageService.get('usuario');
            gestionTurno.isEstudiante = (gestionTurno.usuario.rol.codigo === 'ESTUDIANTE');

            if (gestionTurno.isEstudiante) {
                gestionTurno.onConsultarHistorialEstudiante(gestionTurno.usuario.identificacion);
            }
        }

        function onCheckLocalStorage() {
            var valid = false;
            if (localStorageService.get('turno') !== "") {
                gestionTurno.usuarioTurno = localStorageService.get('turno')[0];
                gestionTurno.usuarioTurno.numeroModuloText = gestionTurno.usuarioTurno.numeroModulo;
                valid = true;
            }
            return valid;
        }

        onCheckLocalStorage();

        gestionTurno.onGenerarTurno = function (ubicacionTurno) {
            var turno = {
                codigo: gestionTurno.turno.codigo,
                nombre: gestionTurno.turno.nombre.toUpperCase(),
                ubicacionTurno: ubicacionTurno,
                activo: "ESPERANDO",
                modulo: "0",
                numeroTurno: ""
            };

            turnoService.postTurno(turno).then(function (data) {
                swal({
                    text: "ESPERE SU TURNO (" + data.objectResponse.numeroTurno + ") POR FAVOR, UN ASESOR PROCEDERÁ A LLAMARLO.",
                    type: "success",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                gestionTurno.turno = {};
                gestionTurno.disabledCampos = true;
                gestionTurno.showUbicacionTurno = false;
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionTurno.onChangeNombre = function () {
            gestionTurno.showUbicacionTurno = gestionTurno.turno.nombre !== "";
        };

        gestionTurno.onCambiarEstadoTurno = function (item, estado) {

            if (gestionTurno.usuarioTurno.numeroModuloText !== null &&
                    gestionTurno.usuarioTurno.numeroModuloText !== undefined &&
                    gestionTurno.usuarioTurno.numeroModuloText !== "") {
                gestionTurno.usuarioTurno.numeroModulo = gestionTurno.usuarioTurno.numeroModuloText;
            } else {
                gestionTurno.usuarioTurno.numeroModuloText = gestionTurno.usuarioTurno.numeroModulo;
            }
            
            item.activo = estado;
            item.modulo = gestionTurno.usuarioTurno.numeroModulo;
            item.usuarioAtencion = gestionTurno.usuario.username;
            turnoService.postTurno(item).then(function (data) {

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionTurno.listTurnosPorAtender = [];
        gestionTurno.onConsultarListadoTurnosActivo = function () {

            if (!onCheckLocalStorage()) {
                swal({
                    title: appGenericConstant.HUBO_PROBLEMA,
                    text: "NO TIENE PERMISOS PARA GESTIONAR TURNOS",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: appGenericConstant.ACEPTAR,
                    allowOutsideClick: false
                });
                return;
            }

            var activo = 'ESPERANDO';
            turnoService.turnoByUbicacionAndActivo(gestionTurno.usuarioTurno.ubicacion, activo).then(function (data) {
                gestionTurno.listTurnosPorAtender = data;
                $('#ConsultarTurno').modal({backdrop: 'static', keyboard: false});
                $("#ConsultarTurno").modal("show");
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionTurno.listEstudianteLLamado = [];
        gestionTurno.listEstudianteLLamadoAux = [];
        gestionTurno.onConsultarListadoTurnosPantalla = function () {
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
            var activo = 'EN_ATENCION';
            gestionTurno.listEstudianteLLamado = [];
            turnoService.turnoByActivo(activo).then(function (data) {
                gestionTurno.listEstudianteLLamado = data;

                if (gestionTurno.listEstudianteLLamadoAux.length < gestionTurno.listEstudianteLLamado.length) {
                    // GENERAR SONIDO   
                }

                gestionTurno.listEstudianteLLamadoAux = data;
                appConstant.CERRAR_SWAL();

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionTurno.onConsultarHistorialEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(identificacion).then(function (data) {
                    if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.MSG_GROWL_ADVERTENCIA("DIGITE SU INFORMACIÓN");
                        gestionTurno.disabledCampos = false;
                        gestionTurno.showUbicacionTurno = false;
                        appConstant.CERRAR_SWAL();
                        return;
                    } else {
                        gestionTurno.disabledCampos = true;
                        gestionTurno.showUbicacionTurno = true;

                        gestionTurno.turno.identificacion = data.objectResponse[0].liquidacionReporteDTO.tipoDocumento + " " + data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
                        gestionTurno.turno.nombre = data.objectResponse[0].nombreEstudiante;
                        gestionTurno.turno.codigo = data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
                        appConstant.CERRAR_SWAL();

                        $('#btnConsultarHistoral').show();
                        $(function () {
                            $('#divNombre,#divIdentificacion').show();
                        });
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

//        gestionTurno.onConsultarListadoTurnosActivo();

    }
})();


