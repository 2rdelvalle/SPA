(function () {
    'use strict';
    angular.module('mytodoApp').controller('cambioProgramaCtrl', cambioProgramaCtrl);
    cambioProgramaCtrl.$inject = ['$scope', 'cambioProgramaServices', 'ValidationService', 'appConstant', '$timeout', 'localStorageService', 'appGenericConstant'];
    function cambioProgramaCtrl($scope, cambioProgramaServices, ValidationService, appConstant, $timeout, localStorageService, appGenericConstant) {

        var cambioPrograma = this;
        $(document).ready(function () {
            $('#divNombre').hide();
            $('#divIdentificacion').hide();
            $('#divDatosEstudiante').hide();
            $('#btnCodigoConsultar').prop('disabled', true);
            $('#inputCodigo').keyup(function () {
                $('#btnCodigoConsultar').prop('disabled', this.value === "" ? true : false);
            });
            $("#inputCodigo").on("input", function () {
                var regexp = /[^0-9]/g;
                if ($(this).val().match(regexp)) {
                    $(this).val($(this).val().replace(regexp, ''));
                }
            });
        });

        cambioPrograma.estudiante = cambioProgramaServices.estudiante;
        cambioPrograma.estudiante.programaNuevo = false;
        cambioPrograma.disableHorario = true;
        cambioPrograma.identificacionConsultar = null;
        cambioPrograma.cAcademico;
        cambioPrograma.inscritos = [];
        cambioPrograma.nivelesFormacion = [];
        cambioPrograma.programasAcademicos = [];
        cambioPrograma.listaProgramasActuales = [];
        cambioPrograma.listaProgramasNuevos = [];
        cambioPrograma.listaProgramasModalidades = [];
        cambioPrograma.listaProgramasHorarios = [];
        cambioPrograma.listaProgramasNiveles = [];
        cambioPrograma.verDetalle = {};
        cambioPrograma.filtrados = [];
        cambioPrograma.display;
        cambioPrograma.options = appConstant.FILTRO_TABLAS;
        cambioPrograma.selectedOption = cambioPrograma.options[0];
        cambioPrograma.report = {
            selected: null
        };

        cambioPrograma.onConsultarEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                cambioProgramaServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                    if (data === null || data === undefined || data.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        $('#divNombre,#divIdentificacion,#divDatosEstudiante').hide();
                        appConstant.CERRAR_SWAL();
                        return;
                    } else {
                        var info = data[0];
                        cambioPrograma.listaProgramasActuales = info.programas;
                        cambioPrograma.estudiante.identificacion = info.tipoDocumento + ' ' + info.identificacionAspirante;
                        cambioPrograma.estudiante.nombre = info.nombreAspirante + ' ' + info.apellidoAspirante;
                        cambioPrograma.estudiante.nombreHorario = null;
                        cambioPrograma.estudiante.nombreModalidad = null;

                        cambioPrograma.liquidacionEstudiante = [];
//                        cambioPrograma.estudiante.identificacion = data[0].liquidacionReporteDTO.tipoDocumento + " " + data[0].liquidacionReporteDTO.estudianteIdentificacion;
//                        cambioPrograma.estudiante.nombre = data[0].nombreEstudiante;
                        angular.forEach(data, function (value, key) {
                            var liquidacion = {
                                id: value.id,
                                idPeriodo: value.idPeriodo,
                                idEstudiante: value.idEstudiante,
                                referencia: value.referencia,
                                fechaLiquidacion: value.fechaLiquidacion,
                                fechaLimitePago: value.fechaLimitePago,
                                valorLiquidado: value.valorLiquidado,
                                estadoLiquidacion: value.estadoLiquidacion,
                                idPlantilla: value.idPlantilla,
                                tipoPlantilla: value.tipoPlantilla,
                                numeracion: value.numeracion,
                                idCredito: value.idCredito,
                                liquidacionConceptoDetalleDTO: value.liquidacionConceptoDetalleDTO,
                                nombrePrograma: value.nombrePrograma,
                                nombreConcepto: value.nombreConcepto,
                                nombrePeriodo: value.nombrePeriodo,
                                liquidacionReporteDTO: value.liquidacionReporteDTO,
                                reciboPagoLiquidacionDTO: value.reciboPagoLiquidacionDTO,
                                reimprimir: value.reciboPagoLiquidacionDTO === null,
                                reimrpimirEstado: value.estadoLiquidacion === 'PAGADA'
                            };
                            cambioPrograma.liquidacionEstudiante.push(liquidacion);
                        });
                        appConstant.CERRAR_SWAL();
                        if (cambioPrograma.liquidacionEstudiante.length === 0) {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_SOLICITUDES);

                            return;
                        }
                        $(function () {
                            $('#divNombre,#divIdentificacion,#divDatosEstudiante').show();
                            $('#programaNuevo,#panelProgramaN').hide();
                        });
                        cambioPrograma.estudiante.programa = null;
                        appConstant.CERRAR_SWAL();
                    }
                }).catch(function (e) {
                    $('#divNombre').hide();
                    $('#divIdentificacion').hide();
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            } else {
                $('#divNombre').hide();
                $('#divIdentificacion').hide();
                $('#divDatosEstudiante').hide();
                cambioPrograma.estudiante = cambioProgramaServices.estudiante;
            }

        };

        cambioPrograma.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formCambioPrograma)) {
                appConstant.MSG_LOADING(appGenericConstant.CAMBIANDO_PROGRAMA);
                appConstant.CARGANDO();
                var cambio = {
                    idSolicitud: cambioPrograma.estudiante.idSolicitud,
                    idProgramaNuevo: cambioPrograma.estudiante.programaN,
                    idModalidadNuevo: cambioPrograma.estudiante.modalidad,
                    idHorarioNuevo: cambioPrograma.estudiante.horario,
                    idProgramaAnterior: cambioPrograma.estudiante.programa,
                    idModalidadAnterior: cambioPrograma.estudiante.idModalidad,
                    idHorarioAnterior: cambioPrograma.estudiante.idHorario,
                    idUsuarioModificacion: localStorageService.get('usuario').id,
                    idEstudiante: cambioPrograma.estudiante.idEstudiante
                };
                cambioProgramaServices.guardarCambioPrograma(cambio).then(function (data) {
                    if (data.tipo === appGenericConstant.OK) {
                        appConstant.MSG_GROWL_OK(data.message);
                        cambioPrograma.listaProgramasActuales = [];
                        cambioPrograma.listaProgramasNuevos = [];
                        cambioPrograma.listaProgramasModalidades = [];
                        cambioPrograma.listaProgramasHorarios = [];
                        cambioPrograma.listaProgramasNiveles = [];
                        cambioPrograma.estudiante.programaN = null;
                        cambioPrograma.estudiante.programa = null;
                        cambioPrograma.estudiante.modalidad = null;
                        cambioPrograma.estudiante.horario = null;
                        cambioPrograma.estudiante.nivel = null;
                        cambioPrograma.disableHorario = true;
                        cambioPrograma.identificacionConsultar = null;
                        cambioPrograma.estudiante.nombreHorario = null;
                        cambioPrograma.estudiante.nombreModalidad = null;
                        $('#divNombre').hide();
                        $('#divIdentificacion').hide();
                        $('#divDatosEstudiante').hide();
                        $('#btnCodigoConsultar').prop('disabled', true);
                        $('#inputCodigo').keyup(function () {
                            $('#btnCodigoConsultar').prop('disabled', this.value === "" ? true : false);
                        });
                        $("#inputCodigo").on("input", function () {
                            var regexp = /[^0-9]/g;
                            if ($(this).val().match(regexp)) {
                                $(this).val($(this).val().replace(regexp, ''));
                            }
                        });
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CAMBIO_PROGRAMA_NO_POSIBLE);
                    }
                    appConstant.CERRAR_SWAL();
                    new ValidationService().resetForm($scope.buscarEstudiante);
                    new ValidationService().resetForm($scope.formCambioPrograma);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        cambioPrograma.onChangeProgramaActual = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            $('#panelProgramaN').hide();
            if (cambioPrograma.estudiante.programa === null || cambioPrograma.estudiante.programa === undefined) {
                $('#programaNuevo,#panelProgramaN').hide();
                cambioPrograma.estudiante.programaN = null;
                appConstant.CERRAR_SWAL();
                return;
            }
            $('#programaNuevo').show();
            cambioPrograma.estudiante.programaN = null;
            var idNivelFormacion = 0;
            angular.forEach(cambioPrograma.listaProgramasActuales, function (value, key) {
                if (value.idPrograma === cambioPrograma.estudiante.programa) {
                    idNivelFormacion = value.idNivelFormacion;
                    cambioPrograma.estudiante.idModalidad = value.idModalidad;
                    cambioPrograma.estudiante.idHorario = value.idHorario;
                    cambioPrograma.estudiante.idSolicitud = value.idSolicitud;
                    cambioPrograma.estudiante.idEstudiante = value.idEstudiante;
                    cambioPrograma.estudiante.nombreHorario = value.nombreHorario;
                    cambioPrograma.estudiante.nombreModalidad = value.nombreModalidad;
                    angular.break;
                }
            });

            cambioProgramaServices.buscarProgramasByNivelFormacion(idNivelFormacion).then(function (programas) {
                cambioPrograma.listaProgramasNuevos = programas;
                cambioPrograma.listaProgramasHorarios = [];
                cambioPrograma.listaProgramasNiveles = [];
                cambioPrograma.estudiante.horario = null;
                cambioPrograma.estudiante.nivel = null;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        cambioPrograma.onSelectProgramaNuevo = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            cambioPrograma.listaProgramasModalidades = [];
            cambioPrograma.listaProgramasHorarios = [];
            cambioPrograma.listaProgramasHorariosAux = [];
            cambioPrograma.listaProgramasNiveles = [];
            cambioPrograma.estudiante.modalidad = null;
            cambioPrograma.estudiante.horario = null;
            cambioPrograma.estudiante.nivel = null;
            cambioPrograma.disableHorario = true;
            if (cambioPrograma.estudiante.programaN === null || cambioPrograma.estudiante.programaN === undefined) {
                $('#panelProgramaN').hide();
                cambioPrograma.estudiante.programaN = null;
                cambioPrograma.estudiante.modalidad = null;
                cambioPrograma.estudiante.horario = null;
                cambioPrograma.estudiante.nivel = null;
                appConstant.CERRAR_SWAL();
                return;
            }

            angular.forEach(cambioPrograma.listaProgramasNuevos, function (value, key) {
                if (value.id === cambioPrograma.estudiante.programaN) {
                    cambioPrograma.listaProgramasModalidades = value.idModalidades;
                    cambioPrograma.listaProgramasHorariosAux = value.idHorarios;
                    cambioPrograma.listaProgramasNiveles = value.nivel;
                    return;
                }
            });

            $('#panelProgramaN').show();
            appConstant.CERRAR_SWAL();
        };

        cambioPrograma.onSelectModalidad = function () {
            cambioPrograma.listaProgramasHorarios = [];
            cambioPrograma.estudiante.horario = null;
            if (cambioPrograma.estudiante.modalidad === null || cambioPrograma.estudiante.modalidad === undefined) {
                cambioPrograma.disableHorario = true;
            }
            cambioPrograma.disableHorario = false;
            angular.forEach(cambioPrograma.listaProgramasHorariosAux, function (value, key) {
                if (value.referencia === cambioPrograma.estudiante.modalidad.toString()) {
                    cambioPrograma.listaProgramasHorarios.push(value);
                }
            });
        };

        cambioPrograma.onBlurValidarCampos = function (campo) {
            $timeout(function () {
                revalidate(campo);
            }, 1);
        };
        function revalidate(elementName) {
            $scope.$broadcast('angularValidation.revalidate', elementName);
        }

        cambioPrograma.onKeyUpCleanField = function () {
            var input = document.getElementById('inputCodigo').value;
            if (input === null || input === "" || input === undefined || input.length === 0) {
                cambioPrograma.listaProgramasActuales = [];
                $(function () {
                    $('#divNombre,#divIdentificacion').hide();
                });
            }
        };

        function onFormattedDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
    }
})();

