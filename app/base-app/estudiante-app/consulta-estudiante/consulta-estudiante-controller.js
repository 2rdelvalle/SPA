'use strict';
angular.module('mytodoApp').controller('estudinanteConsultaCtrl', ['$scope', 'estudianteConsultaService', 'appConstant', 'appGenericConstant',
    function ($scope, estudianteConsultaService, appConstant, appGenericConstant) {
        var estudianteConsulta = this;
        estudianteConsulta.estudiante = estudianteConsultaService.estudiante;
        estudianteConsulta.listarEstudiante = [];
        estudianteConsulta.validarCampo = false;
        estudianteConsulta.parametroEstudiante = undefined;
        estudianteConsulta.mensaje = "";

        
        estudianteConsulta.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                estudianteConsulta.consultarEstudiante();
            }
        };

        estudianteConsulta.consultarEstudiante = function () {
            if (estudianteConsulta.parametroEstudiante !== undefined && estudianteConsulta.parametroEstudiante !== null
                    && estudianteConsulta.parametroEstudiante !== "") {

                if (validarLongitud(estudianteConsulta.parametroEstudiante)) {
                    appConstant.MSG_LOADING(appGenericConstant.CONSULTAR_ESTUDIANTE);
                    appConstant.CARGANDO();
                    estudianteConsultaService.buscarEstudiante(estudianteConsulta.parametroEstudiante).then(function (data) {
                        if (data !== null && data !== "") {
                            estudianteConsulta.listarEstudiante = data;
                            appConstant.CERRAR_SWAL();
                        }
                        else {
                            estudianteConsulta.listarEstudiante = [];
                            appConstant.MSG_ADVERTENCIA_BUSQUEDA();
                        }
                    });
                } else {
                    estudianteConsulta.validarCampo = true;
                    estudianteConsulta.mensaje = "Debe introducir mínimo tres (3) caracateres";
                }
            }
            else {
                estudianteConsulta.listarEstudiante = [];
                estudianteConsulta.validarCampo = true;
                 estudianteConsulta.mensaje = "Campo requerido";
            }
        };


        estudianteConsulta.onReset = function () {
            estudianteConsulta.listarEstudiante = [];
            estudianteConsulta.validarCampo = false;
            estudianteConsulta.parametroEstudiante = undefined;
        };

        function validarLongitud(parametro) {
            if (parametro.length > appGenericConstant.DOS && parametro.length < appGenericConstant.SETENTA) {
                return true;
            } else {
                return false;
            }

        }
        ;
    }]);



