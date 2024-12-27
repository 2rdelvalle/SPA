(function () {
    'use strict';
    angular.module('mytodoApp').controller('hojaVidaEstudianteCtrl', hojaVidaEstudianteCtrl);
    hojaVidaEstudianteCtrl.$inject = ['$scope', 'hojaVidaService', 'cambioHorarioServices', 'ValidationService', '$location', 'localStorageService', 'utilServices', '$filter', '$timeout', 'appConstant', 'appGenericConstant', 'appConstantValueList'];
    function hojaVidaEstudianteCtrl($scope, hojaVidaService, cambioHorarioServices, ValidationService, $location, localStorageService, utilServices, $filter, $timeout, appConstant, appGenericConstant, appConstantValueList) {

        var inscripcionControl = this;
        var config = {};
        inscripcionControl.lstniveleducactivo = [];
        inscripcionControl.lsttipodocumentos = [];
        inscripcionControl.lstestadocivil = [];
        inscripcionControl.lstgenero = [];
        inscripcionControl.lstgruposanguineo = [];
        inscripcionControl.seccionales = [];
        inscripcionControl.nivelesformacion = [];
        inscripcionControl.programas = [];
        inscripcionControl.jornadas = [];
        inscripcionControl.convenios = [];
        inscripcionControl.instituciones = [];
        inscripcionControl.periodosAcademicos = [];
        inscripcionControl.lstpais = [];
        inscripcionControl.lstbarrios = [];
        inscripcionControl.lstmediodifusion = [];
        inscripcionControl.lstdepartamentos = [];
        inscripcionControl.listmunicipios = [];
        inscripcionControl.lgexplstpais = [];
        inscripcionControl.lgexplstdepartamentos = [];
        inscripcionControl.lgexplstmunicipios = [];
        inscripcionControl.lgnacimtolstpais = [];
        inscripcionControl.lgnacimtolstdepartamentos = [];
        inscripcionControl.lgnacimtolstmunicipios = [];
        inscripcionControl.lgrecidencialstpais = [];
        inscripcionControl.lgrecidencialstdepartamentos = [];
        inscripcionControl.lgrecidencialstmunicipios = [];
        inscripcionControl.lsttipovivienda = [];
        inscripcionControl.lstcontratoseconomicos = [];
        inscripcionControl.lstinscripcionestemps = [];
        inscripcionControl.lstmodalidad = [];
        inscripcionControl.lsthorario = [];
        inscripcionControl.nuevaInscripcion = hojaVidaService.inscripcion;
        inscripcionControl.nuevaInscripcion.aspirante = hojaVidaService.inscripcionInicial;
        inscripcionControl.modowizard = hojaVidaService.modowizard;
        inscripcionControl.estadopasos = hojaVidaService.estadopasos;
        inscripcionControl.infopersonal = hojaVidaService.infopersonal;
        inscripcionControl.visible = hojaVidaService.visible;
        inscripcionControl.nuevaInscripcion.celular;
        inscripcionControl.nuevaInscripcion.idEstadoCivil;
        inscripcionControl.nuevaInscripcion.idGrupoSanguineo;
        inscripcionControl.nuevaInscripcion.identificacionAspirante = {};
        inscripcionControl.nuevaInscripcion.identificacionAspirante.idTipoIdentificacion = null;
        inscripcionControl.nuevaInscripcion.identificacionAspirante.identificacion = null;
        inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta = null;
        inscripcionControl.nuevaInscripcion.identificacionConsulta = null;
        inscripcionControl.options = appConstant.FILTRO_TABLAS;
        inscripcionControl.selectedOption = inscripcionControl.options[0];
        inscripcionControl.soloInscripcion = hojaVidaService.botonVolver;
        inscripcionControl.habilitarTabs = true;
        localStorageService.set('responsedata', null);
        inscripcionControl.estudianteRetiro = {};
        inscripcionControl.estudianteReintegro = {};
        inscripcionControl.registrarObservacion = {};
        inscripcionControl.listadoRetirosEstudiante = [];
        inscripcionControl.listadoReintegrosEstudiante = [];
        inscripcionControl.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
        ];

        inscripcionControl.disabledConsultar = true;

        if (localStorageService.get('visible') !== null) {
            var visible = localStorageService.get('visible');
            inscripcionControl.visible = visible;
            inscripcionControl.visible.validotelefonopadre = false;
            inscripcionControl.visible.validocelularpadre = false;
            inscripcionControl.visible.validotelefonopadresize = false;
            inscripcionControl.visible.validocelularpadresize = false;
            inscripcionControl.visible.validotelefonomadre = false;
            inscripcionControl.visible.validocelularmadre = false;
            inscripcionControl.visible.validocelularmadresize = false;
            inscripcionControl.visible.validotelefonomadresize = false;
            inscripcionControl.visible.validotelefonoacudiente = false;
            inscripcionControl.visible.validocelularacudiente = false;
            inscripcionControl.visible.validotelefonoacudientesize = false;
            inscripcionControl.visible.validocelularacudientesize = false;
        }

        inscripcionControl.nuevaInscripcion.tipodocumento = null;
        inscripcionControl.nuevaInscripcion.estado = "no";
        if (inscripcionControl.nuevaInscripcion.informacionAdicional !== null && inscripcionControl.nuevaInscripcion.informacionAdicional !== undefined) {
            if (inscripcionControl.nuevaInscripcion.informacionAdicional.id === null || inscripcionControl.nuevaInscripcion.informacionAdicional.id === undefined) {
                inscripcionControl.nuevaInscripcion.informacionAdicional = {
                    estadoTieneHijo: false,
                    estadoEnfermedad: false,
                    estadoDiscapacidad: false,
                    estadoSisben: false,
                    estadoGrupoEtnico: false,
                    estadoVotoEleccion: false,
                    estadoLabora: false
                };
            }
        }

        inscripcionControl.ChangeTabs = function (idTab) {
            $("#tab-example-1").css("display", idTab === 1 ? 'initial' : 'none');
            $("#tab-example-2").css("display", idTab === 2 ? 'initial' : 'none');
            $("#tab-example-3").css("display", idTab === 3 ? 'initial' : 'none');
            $("#tab-example-4").css("display", idTab === 4 ? 'initial' : 'none');
            $("#tab-example-5").css("display", idTab === 5 ? 'initial' : 'none');
            $("#tab-example-6").css("display", idTab === 6 ? 'initial' : 'none');
            $("#tab-example-7").css("display", idTab === 7 ? 'initial' : 'none');

            $("#tab-1").css("background-color", idTab === 1 ? '#009fc1' : 'white');
            $("#tab-2").css("background-color", idTab === 2 ? '#009fc1' : 'white');
            $("#tab-3").css("background-color", idTab === 3 ? '#009fc1' : 'white');
            $("#tab-4").css("background-color", idTab === 4 ? '#009fc1' : 'white');
            $("#tab-5").css("background-color", idTab === 5 ? '#009fc1' : 'white');
            $("#tab-6").css("background-color", idTab === 6 ? '#009fc1' : 'white');
            $("#tab-7").css("background-color", idTab === 7 ? '#009fc1' : 'white');
        };

        function revalidate(elementName) {
            $scope.$broadcast('angularValidation.revalidate', elementName);
        }

        function validarIngreso() {
            localStorageService.remove('inscripcion');
            localStorageService.remove('visible');
            localStorageService.remove('estadopasos');
            inscripcionControl.visible.disableSelectPrograma = true;
            inscripcionControl.visible.disableSelectModalidad = true;
            inscripcionControl.visible.disableSelectHorario = true;
            hojaVidaService.visible.estadoforminicio = true;
            hojaVidaService.visible.estadoformtipopago = false;
            hojaVidaService.visible.estadoformcapturapin = false;
            hojaVidaService.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.estadoforminicio = true;
            inscripcionControl.visible.estadoformtipopago = false;
            inscripcionControl.visible.estadoformcapturapin = false;
            inscripcionControl.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.desctivarbotonatras = true;
            hojaVidaService.visible.activetabstep1 = appGenericConstant.ACTIVO;
            hojaVidaService.visible.activetabstep2 = appGenericConstant.ESPACIO;
            hojaVidaService.visible.activetabstep3 = appGenericConstant.ESPACIO;
            hojaVidaService.visible.activetabstep4 = appGenericConstant.ESPACIO;
            inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
            inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
            inscripcionControl.visible.activetabstep3 = appGenericConstant.ESPACIO;
            inscripcionControl.visible.activetabstep4 = appGenericConstant.ESPACIO;
        }

        inscripcionControl.ejecutarConsultarPeriodoAcademico = function () {
            hojaVidaService.consultarPeriodoAcademico().then(function (data) {
                inscripcionControl.periodosAcademicos = [];
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    inscripcionControl.periodosAcademicos.push(periodo);
                });
            }).catch(function (e) {
                return;
            });
        };

        //METODOS PARA ABRIR MODALES DE LUGARES
        inscripcionControl.onAbrirModalLugarFechaExpedicionCedula = function () {
            inscripcionControl.nuevaInscripcion.idPaisExpedicion = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion = undefined;
            inscripcionControl.nuevaInscripcion.idLugarExpedicionDocumento = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarFechaExpedicion');
        };

        inscripcionControl.onAbrirModalLugarNacimiento = function () {
            inscripcionControl.nuevaInscripcion.idPaisNacimiento = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento = undefined;
            inscripcionControl.nuevaInscripcion.idMunicipioNacimiento = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarNacimiento');
        };

        inscripcionControl.onAbrirModalLugarResidencia = function () {
            inscripcionControl.nuevaInscripcion.idPaisResidencia = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarResidencia');
        };

        inscripcionControl.onAbrirModalLugarResidenciaPadre = function () {
            inscripcionControl.nuevaInscripcion.idPaisResidencia = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarResidenciaPadre');
        };

        inscripcionControl.onAbrirModalLugarResidenciaMadre = function () {
            inscripcionControl.nuevaInscripcion.idPaisResidencia = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarResidenciaMadre');
        };

        inscripcionControl.onAbrirModalLugarResidenciaAcudiente = function () {
            inscripcionControl.nuevaInscripcion.idPaisResidencia = undefined;
            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = undefined;
            inscripcionControl.onMostrarModalLugares('modalLugarResidenciaAcudiente');
        };

        inscripcionControl.onMostrarModalLugares = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };

        inscripcionControl.onChangeInput = function () {
            if (inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === null
                    || inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === undefined
                    || inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === ''
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === null
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === undefined
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === '') {
                inscripcionControl.disabledConsultar = true;
            } else {
                inscripcionControl.disabledConsultar = false;
            }

        };

        inscripcionControl.consultarAspirante = function () {
            appConstant.MSG_LOADING(appGenericConstant.VERIFICANDO_ASPIRANTE);
            appConstant.CARGANDO();

            if (inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === null
                    || inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === undefined
                    || inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta === ''
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === null
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === undefined
                    || inscripcionControl.nuevaInscripcion.identificacionConsulta === '') {

                appConstant.CERRAR_SWAL();
                return;
            }

            inscripcionControl.item = {
                identificacionAspirante: {
                    idTipoIdentificacion: inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta,
                    identificacion: inscripcionControl.nuevaInscripcion.identificacionConsulta
                }
            };

            inscripcionControl.consultarServiceAspirante(inscripcionControl.item);

        };

        inscripcionControl.consultarServiceAspirante = function (item) {
            hojaVidaService.consultarAspirante(inscripcionControl.item).then(function (data) {
                inscripcionControl.visible.validaseccional = false;
                inscripcionControl.visible.validanivelformacion = false;
                inscripcionControl.visible.validaprograma = false;
                inscripcionControl.visible.validatipoconvenio = false;
                inscripcionControl.visible.validajornada = false;

                if (data.objectResponse !== null) {
                    if (data.objectResponse !== null) {
                        inscripcionControl.habilitarTabs = false;
                        inscripcionControl.nuevaInscripcion = null;
                        inscripcionControl.nuevaInscripcion = data.objectResponse;
                        appConstant.CERRAR_SWAL();
                        inscripcionControl.visible.institucion = true;
                        inscripcionControl.nuevaInscripcion.informacionAcademica = data.objectResponse.informacionAcademica;
                        inscripcionControl.nuevaInscripcion.informacionAdicional = data.objectResponse.informacionAdicional;
                        inscripcionControl.nuevaInscripcion.informacionReferencia = data.objectResponse.informacionReferencia;
                        if (inscripcionControl.nuevaInscripcion.informacionAcademica === null
                                || typeof inscripcionControl.nuevaInscripcion.informacionAcademica === "undefined") {
                            inscripcionControl.visible.institucion = false;
                            inscripcionControl.nuevaInscripcion.informacionAcademica = {
                                idInstitucion: null,
                                nombreInstitucion: null,
                                fechaCulminacion: null,
                                fechaPresentacion: null
                            };
                        }
                        if (inscripcionControl.nuevaInscripcion.aspirante !== null) {
                            if (inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento === null
                                    || typeof inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento === "undefined") {
                                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = appGenericConstant.CARTAGENA;
                            }
                            if (inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento === null
                                    || typeof inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento === "undefined") {
                                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento = appGenericConstant.CARTAGENA;
                            }
                            if (inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia === null
                                    || typeof inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia === "undefined") {
                                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia = appGenericConstant.CARTAGENA;
                            }
                            inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento = $filter('date')(data.objectResponse.aspirante.fechaExpedicionDocumento, 'dd/MM/yyyy');
                            inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento = $filter('date')(data.objectResponse.aspirante.fechaNacimiento, 'dd/MM/yyyy');
                            if (inscripcionControl.nuevaInscripcion.aspirante.idInstitucion !== null && inscripcionControl.nuevaInscripcion.aspirante.idInstitucion !== undefined) {
                                inscripcionControl.nuevaInscripcion.informacionAcademica.idInstitucion = inscripcionControl.nuevaInscripcion.aspirante.idInstitucion;
                                inscripcionControl.visible.institucion = true;
                                if (inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion !== null && inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion !== undefined) {
                                    inscripcionControl.nuevaInscripcion.informacionAcademica.nombreInstitucion = inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion;
                                }
                            }
                        }
                        if (inscripcionControl.nuevaInscripcion.informacionAcademica !== null) {
                            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion = $filter('date')(data.objectResponse.informacionAcademica.fechaCulminacion, 'dd/MM/yyyy');
                            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion = $filter('date')(data.objectResponse.informacionAcademica.fechaPresentacion, 'dd/MM/yyyy');
                        }

                        inscripcionControl.nuevaInscripcion.identificacionAspirante = inscripcionControl.item.identificacionAspirante.identificacion;
                        if (inscripcionControl.nuevaInscripcion.idSeccional !== null
                                || inscripcionControl.nuevaInscripcion.idNivelFormacion !== null) {
                            inscripcionControl.visible.estadobotonesinicio = true;
                        }
                        if (inscripcionControl.nuevaInscripcion.aspirante !== null) {
                            swal.closeModal();
                            inscripcionControl.visible.disableSelectPrograma = false;
                            inscripcionControl.visible.disableSelectModalidad = false;
                            inscripcionControl.visible.disableSelectHorario = false;
                            inscripcionControl.nuevaInscripcion.aspirante = data.objectResponse.aspirante;
                            if (inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento !== null) {
                                inscripcionControl.onCalcularEdad();
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionReferencia === null) {
                                inscripcionControl.nuevaInscripcion.informacionReferencia = {};
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionAdicional === null) {
                                inscripcionControl.nuevaInscripcion.informacionAdicional = {};
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionAcademica === null) {
                                inscripcionControl.nuevaInscripcion.informacionAcademica = {};
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre === null
                                    || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre = {};
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre === null
                                    || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre = {};
                            }
                            if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente === null
                                    || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
                            }
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                        } else {
                            appConstant.CERRAR_SWAL();
                            inscripcionControl.visible.disableSelectPrograma = true;
                            inscripcionControl.visible.disableSelectModalidad = true;
                            inscripcionControl.visible.disableSelectHorario = true;
                            inscripcionControl.nuevaInscripcion.id = null;
                            inscripcionControl.nuevaInscripcion.aspirante = {};
                            inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion = inscripcionControl.nuevaInscripcion.identificacionAspirante.idTipoIdentificacion;
                            inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.identificacion = inscripcionControl.nuevaInscripcion.identificacionAspirante.identificacion;
                            inscripcionControl.nuevaInscripcion.informacionReferencia = {};
                            inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre = {};
                            inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre = {};
                            inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = appGenericConstant.CARTAGENA;
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento = appGenericConstant.CARTAGENA;
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia = appGenericConstant.CARTAGENA;
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            var defectoPais = appGenericConstant.PAIS_DEFECTO;
                            inscripcionControl.nuevaInscripcion.idPaisExpedicion = defectoPais;
                            inscripcionControl.nuevaInscripcion.idPaisNacimiento = defectoPais;
                            inscripcionControl.nuevaInscripcion.idPaisResidencia = defectoPais;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre = defectoPais;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre = defectoPais;
                            inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente = defectoPais;
                            var defectoDepartamento = appGenericConstant.DEPARTAMENTO_DEFECTO;
                            inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente = defectoDepartamento;
                            var defectoMunicipio = appGenericConstant.MUNICIPIO_DEFECTO;
                            inscripcionControl.nuevaInscripcion.aspirante.idLugarNacimiento = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.aspirante.idMunicipioExpedicion = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.aspirante.idLugarResidencia = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaPadre = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano = 0;
                            inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano = 0;
                        }

                        if (inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano === null
                                || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano === 'undefined') {
                            inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano = 0;
                        }

                        if (inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano === null
                                || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano === 'undefined') {
                            inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano = 0;
                        }
                        inscripcionControl.nuevaInscripcion.estado = "no";
                        if (inscripcionControl.nuevaInscripcion.informacionAdicional.id === null || inscripcionControl.nuevaInscripcion.informacionAdicional.id === undefined) {
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoTieneHijo = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoEnfermedad = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoDiscapacidad = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoSisben = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoGrupoEtnico = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoVotoEleccion = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoLabora = false;
                        }
                        swal.closeModal();
                        inscripcionControl.consultarObservacion(inscripcionControl.nuevaInscripcion.aspirante.id);
                        inscripcionControl.consultarRetiros(inscripcionControl.nuevaInscripcion.aspirante.id);
                        inscripcionControl.consultarEstudianteProgramaRetiro();

                    }
                    inscripcionControl.nuevaInscripcion.idTipoIdentificacionConsulta = null;
                    inscripcionControl.nuevaInscripcion.identificacionConsulta = null;
                    inscripcionControl.ChangeTabs(1);
                    inscripcionControl.onChangeInput();
                    appConstant.CERRAR_SWAL();
                } else {
                    swal.closeModal();
                    if (data.tipo === 409) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    }
                    if (data.tipo === 500) {
                        appConstant.MSG_GROWL_ERROR();
                    }
                }
            }).catch(function (e) {
                if (e.status === 409 && e.message === 'NO AUTORIZADO!!') {
                    appConstant.MSG_GROWL_ADVERTENCIA(e.message);
                    localStorageService.clearAll();
                }
                return;
            });
        };

        inscripcionControl.onChangeSeccional = function () {
            if (typeof inscripcionControl.nuevaInscripcion.idSeccional === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idSeccional === null) {
                inscripcionControl.visible.validaseccional = true;
                return;
            }
        };
        inscripcionControl.onChangeJornada = function () {
            inscripcionControl.visible.validajornada = false;
            if (typeof inscripcionControl.nuevaInscripcion.idJornada === 'undefined' || inscripcionControl.nuevaInscripcion.idJornada === null) {
                inscripcionControl.visible.validajornada = true;
                return;
            }
        };
        inscripcionControl.onChangeTipoConvenio = function () {
            inscripcionControl.visible.validatipoconvenio = false;
            if (typeof inscripcionControl.nuevaInscripcion.idJornada === 'undefined' || inscripcionControl.nuevaInscripcion.idJornada === null) {
                inscripcionControl.visible.validajornada = true;
            }
        };
        inscripcionControl.onChangeSelectBarrio = function (item) {
            inscripcionControl.nuevaInscripcion.aspirante.cualBarrio = '';
            if (typeof item === 'undefined') {
                inscripcionControl.visible.validobarrio = true;
            } else {
                inscripcionControl.visible.validobarrio = false;
            }
        };
        inscripcionControl.onChangeSelectMedioDifusion = function (item) {
            if (typeof item === 'undefined') {
                inscripcionControl.visible.validomediodifusion = true;
            } else {
                if (item !== 173) {
                    inscripcionControl.nuevaInscripcion.aspirante.otroMedioDifusion = '';
                    inscripcionControl.visible.validomediodifusionotro = false;
                }
                inscripcionControl.visible.validomediodifusion = false;
            }
        };

        /*-- INI: wizard --*/
        inscripcionControl.onContinuar = function () {
            if (inscripcionControl.visible.activetabstep1 === appGenericConstant.ACTIVO) {
                inscripcionControl.onGuardarInformacionPersonal();
                return;
            }

            if (inscripcionControl.visible.activetabstep2 === appGenericConstant.ACTIVO) {
                inscripcionControl.onGuardarInformacionAcademica();
                return;
            }

            if (inscripcionControl.visible.activetabstep3 === appGenericConstant.ACTIVO) {
                inscripcionControl.onGuardarInformacionFamiliar();
                return;
            }

            if (inscripcionControl.visible.activetabstep4 === appGenericConstant.ACTIVO) {
                inscripcionControl.onGuardarOtraInformacion();
            }
        };
        /*-- FIN: wizard --*/

        //IMPORTANTE

        inscripcionControl.onGuardarInformacionPersonal = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS);
            appConstant.CARGANDO();
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.otroMedioDifusion === 'undefined') {
                inscripcionControl.nuevaInscripcion.aspirante.otroMedioDifusion = null;
            }
            if (inscripcionControl.nuevaInscripcion.informacionAcademica === null
                    || typeof inscripcionControl.nuevaInscripcion.informacionAcademica === 'undefined') {
                inscripcionControl.nuevaInscripcion.informacionAcademica = {
                    id: null,
                    idInstitucion: inscripcionControl.nuevaInscripcion.aspirante.idInstitucion,
                    nombreInstitucion: inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion,
                    fechaCulminacion: null,
                    tituloObtenido: null,
                    fechaPresentacion: null,
                    numeroRegistro: null,
                    idAspirante: inscripcionControl.nuevaInscripcion.idAspirante
                };
            }

            if (inscripcionControl.nuevaInscripcion.informacionReferencia === null
                    || typeof inscripcionControl.nuevaInscripcion.informacionReferencia === 'undefined') {
                inscripcionControl.nuevaInscripcion.informacionReferencia = {
                    id: null,
                    idPadre: null,
                    infoPadre: null,
                    idMadre: null,
                    infoMadre: null,
                    idAcudiente: null,
                    infoAcudiente: null,
                    cantidadHermano: 0,
                    posicionHermano: 0,
                    idAspirante: inscripcionControl.nuevaInscripcion.idAspirante
                };
            }

            if (inscripcionControl.nuevaInscripcion.informacionAdicional === null
                    || typeof inscripcionControl.nuevaInscripcion.informacionAdicional === 'undefined') {
                inscripcionControl.nuevaInscripcion.informacionAdicional = {
                    id: null,
                    idTipoVivienda: null,
                    idEstrato: null,
                    estadoTieneHijo: false,
                    estadoEnfermedad: false,
                    estadoDiscapacidad: false,
                    estadoSisben: false,
                    estadoGrupoEtnico: false,
                    estadoVotoEleccion: false,
                    estadoLabora: false,
                    preguntaHijo: null,
                    preguntaGrupoEtnico: null,
                    preguntaEnfermedad: null,
                    preguntaDiscapacidad: null,
                    preguntaSisben: null,
                    eps: null,
                    empresa: null,
                    cargo: null,
                    tiempoLaborado: null,
                    idAspirante: inscripcionControl.nuevaInscripcion.idAspirante
                };
            }

            if (new ValidationService().checkFormValidity($scope.formwizardinscripcionDatosBasicos)) {

                inscripcionControl.infopersonal = {
                    id: inscripcionControl.nuevaInscripcion.id,
                    idPeriodoAcademico: inscripcionControl.nuevaInscripcion.idPeriodoAcademico,
                    idSeccional: inscripcionControl.nuevaInscripcion.idSeccional,
                    idNivelFormacion: inscripcionControl.nuevaInscripcion.idNivelFormacion,
                    idPrograma: inscripcionControl.nuevaInscripcion.idPrograma,
                    idTipoConvenio: inscripcionControl.nuevaInscripcion.idTipoConvenio,
                    idAspirante: inscripcionControl.nuevaInscripcion.idAspirante,
                    aspirante: {
                        id: inscripcionControl.nuevaInscripcion.aspirante.id,
                        nombre: appConstant.VALIDAR_STRING(inscripcionControl.nuevaInscripcion.aspirante.nombre),
                        apellido: appConstant.VALIDAR_STRING(inscripcionControl.nuevaInscripcion.aspirante.apellido),
                        identificacionAspirante: {
                            idTipoIdentificacion: inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion,
                            identificacion: inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.identificacion
                        },
                        telefono: inscripcionControl.nuevaInscripcion.aspirante.telefono,
                        email: inscripcionControl.nuevaInscripcion.aspirante.email,
                        celular: inscripcionControl.nuevaInscripcion.aspirante.celular,
                        fechaNacimiento: onToDateString(inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento),
                        fechaExpedicionDocumento: onToDateString(inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento),
                        idLugarExpedicionDocumento: inscripcionControl.nuevaInscripcion.aspirante.idMunicipioExpedicion,
                        idGenero: inscripcionControl.nuevaInscripcion.aspirante.idGenero,
                        idEstadoCivil: inscripcionControl.nuevaInscripcion.aspirante.idEstadoCivil,
                        idLugarNacimiento: inscripcionControl.nuevaInscripcion.aspirante.idLugarNacimiento,
                        nombreLugarNacimiento: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento,
                        nombreLugarExpedicionDocumento: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento,
                        nombreLugarResidencia: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia,
                        idGrupoSanguineo: inscripcionControl.nuevaInscripcion.aspirante.idGrupoSanguineo,
                        idLugarResidencia: inscripcionControl.nuevaInscripcion.aspirante.idLugarResidencia,
                        direccion: inscripcionControl.nuevaInscripcion.aspirante.direccion,
                        idBarrio: inscripcionControl.nuevaInscripcion.aspirante.idBarrio,
                        barrio: null,
                        idInstitucion: inscripcionControl.nuevaInscripcion.aspirante.idInstitucion,
                        otroInstitucion: inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion
                    },
                    booleanGuardar: false
                };

                hojaVidaService.registrarInscripcion(inscripcionControl.infopersonal).then(function (data) {

                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.DATOS_ACTUALIZADO_SATISFACTORIO);
                    new ValidationService().resetForm($scope.formwizardinscripcionDatosBasicos);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();

                    return;
                });
            } else {
                appConstant.CERRAR_SWAL();
            }
        };

        inscripcionControl.onGuardarInformacionAcademica = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            inscripcionControl.visible.validaaniofinalizacion = false;
            inscripcionControl.visible.validaaniopresentacion = false;
            inscripcionControl.visible.validainstitucion = false;
            var estado = false;
            if (!new ValidationService().checkFormValidity($scope.formwizaracademica)) {
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.error;
                estado = true;
                appConstant.CERRAR_SWAL();
                return;
            }
            if (estado === true) {
                appConstant.CERRAR_SWAL();
                return;
            }

            if (inscripcionControl.infopersonal.informacionAcademica === undefined) {
                inscripcionControl.infopersonal.informacionAcademica = {};
            }

            inscripcionControl.infopersonal.informacionAcademica = {
                id: inscripcionControl.nuevaInscripcion.informacionAcademica.id,
                idInstitucion: inscripcionControl.nuevaInscripcion.informacionAcademica.idInstitucion,
                fechaCulminacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion),
                tituloObtenido: inscripcionControl.nuevaInscripcion.informacionAcademica.tituloObtenido,
                fechaPresentacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion),
                numeroRegistro: inscripcionControl.nuevaInscripcion.informacionAcademica.numeroRegistro,
                idAspirante: inscripcionControl.nuevaInscripcion.aspirante.id
            };


            hojaVidaService.registrarInscripcionInformacionAcademica(inscripcionControl.infopersonal).then(function (data) {
                if (data.tipo !== 200) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    appConstant.CERRAR_SWAL();
                    return;
                }

                setTimeout(function () {
                    //do what you need here
                }, 5000);

                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.DATOS_ACTUALIZADO_SATISFACTORIO);

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });

        };

        inscripcionControl.onGuardarInformacionFamiliar = function () {
            var formmain = true;
            var tabpadre = true;
            var tabmadre = true;
            var tabacudiente = true;

            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            if (!new ValidationService().checkFormValidity($scope.formwizarfamiliar1)) {
                inscripcionControl.visible.workingstep3 = inscripcionControl.modowizard.error;
                formmain = false;
            }
            if (!new ValidationService().checkFormValidity($scope.$$childHead.formwizardinscripcionTabsInfoFamiliar.formwizarfamiliarpadre)) {
                inscripcionControl.visible.workingstep3 = inscripcionControl.modowizard.error;
                tabpadre = false;
            }
            if (!new ValidationService().checkFormValidity($scope.$$childHead.formwizardinscripcionTabsInfoFamiliar.formwizarfamiliarmadre)) {
                inscripcionControl.visible.workingstep3 = inscripcionControl.modowizard.error;
                tabmadre = false;
            }
            if (!new ValidationService().checkFormValidity($scope.$$childHead.formwizardinscripcionTabsInfoFamiliar.formwizarfamiliaracudiente)) {
                inscripcionControl.visible.workingstep3 = inscripcionControl.modowizard.error;
                tabacudiente = false;
            }

            if ((tabpadre || tabmadre || tabacudiente) && formmain) {
                var objInfoPadre = {
                    id: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.id : null,
                    identificacion: {
                        idTipoIdentificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.identificacion.idTipoIdentificacion : null,
                        identificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.identificacion.identificacion : null
                    },
                    apellido: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.apellido : null, nombre: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombre : null, idFormacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.idFormacion : null,
                    ocupacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.ocupacion : null,
                    idEstadoCivil: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.idEstadoCivil : null,
                    email: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.email : null,
                    idResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.idResidencia : typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaPadre : null,
                    nombreResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia : null,
                    direccion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.direccion : null,
                    celular: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.celular : null,
                    telefono: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono : null
                };
                var objInfoMadre = {
                    id: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.id : null,
                    identificacion: {
                        idTipoIdentificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.identificacion.idTipoIdentificacion : null,
                        identificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.identificacion.identificacion : null
                    },
                    apellido: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.apellido : null, nombre: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombre : null, idFormacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.idFormacion : null,
                    ocupacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.ocupacion : null,
                    idEstadoCivil: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.idEstadoCivil : null,
                    email: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.email : null,
                    idResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.idResidencia : typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre : null,
                    nombreResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia : null,
                    direccion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.direccion : null,
                    celular: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.celular : null,
                    telefono: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.telefono : null
                };
                var objInfoAcudiente = {
                    id: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.id : null,
                    identificacion: {
                        idTipoIdentificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.identificacion.idTipoIdentificacion : null,
                        identificacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.identificacion.identificacion : null
                    },
                    apellido: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.apellido : null, nombre: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombre : null, idFormacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.idFormacion : null,
                    ocupacion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.ocupacion : null,
                    idEstadoCivil: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.idEstadoCivil : null,
                    email: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.email : null,
                    idResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.idResidencia : typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente : null,
                    nombreResidencia: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia : null,
                    direccion: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.direccion : null,
                    celular: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.celular : null,
                    telefono: typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono : null
                };

                if (inscripcionControl.infopersonal.informacionReferencia === undefined) {
                    inscripcionControl.infopersonal.informacionReferencia = {};
                }

                inscripcionControl.infopersonal.informacionReferencia = {
                    id: inscripcionControl.nuevaInscripcion.informacionReferencia.id,
                    idPadre: inscripcionControl.nuevaInscripcion.informacionReferencia.idPadre,
                    infoPadre: objInfoPadre,
                    idMadre: inscripcionControl.nuevaInscripcion.informacionReferencia.idMadre,
                    infoMadre: objInfoMadre,
                    idAcudiente: inscripcionControl.nuevaInscripcion.informacionReferencia.idAcudiente,
                    infoAcudiente: objInfoAcudiente,
                    cantidadHermano: inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano,
                    posicionHermano: inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano,
                    idAspirante: inscripcionControl.nuevaInscripcion.aspirante.id
                };

                hojaVidaService.registrarInscripcionInformacionReferencia(inscripcionControl.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }



                    appConstant.MSG_GROWL_OK(appGenericConstant.DATOS_ACTUALIZADO_SATISFACTORIO);
                    inscripcionControl.infopersonal.informacionReferencia.id = data.objectResponse.informacionReferencia.id;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
            appConstant.CERRAR_SWAL();
        };

        inscripcionControl.onGuardarOtraInformacion = function () {
            inscripcionControl.visible.validoempresa = false;
            inscripcionControl.visible.validocargo = false;
            inscripcionControl.visible.validotiempolaborado = false;
            inscripcionControl.visible.validomediodifusion = false;
            var estadovalido = false;
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            if (inscripcionControl.nuevaInscripcion.informacionAdicional.estadoLabora) {
                if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === 'undefined'
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === ''
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === null) {
                    inscripcionControl.visible.validoempresa = true;
                    estadovalido = true;
                }
                if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === 'undefined'
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === ''
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === null) {
                    inscripcionControl.visible.validocargo = true;
                    estadovalido = true;
                }
                if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === 'undefined'
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === ''
                        || inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === null) {
                    inscripcionControl.visible.validotiempolaborado = true;
                    estadovalido = true;
                }
            } else {
                inscripcionControl.nuevaInscripcion.informacionAdicional.empresa = null;
                inscripcionControl.nuevaInscripcion.informacionAdicional.cargo = null;
                inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado = null;
            }

            inscripcionControl.infopersonal.informacionAdicional = {
                id: inscripcionControl.nuevaInscripcion.informacionAdicional.id,
                idTipoVivienda: inscripcionControl.nuevaInscripcion.informacionAdicional.idTipoVivienda,
                idEstrato: inscripcionControl.nuevaInscripcion.informacionAdicional.idEstrato,
                estadoTieneHijo: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoTieneHijo,
                estadoEnfermedad: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoEnfermedad,
                estadoDiscapacidad: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoDiscapacidad,
                estadoSisben: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoSisben,
                estadoGrupoEtnico: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoGrupoEtnico,
                estadoVotoEleccion: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoVotoEleccion,
                estadoLabora: inscripcionControl.nuevaInscripcion.informacionAdicional.estadoLabora,
                preguntaHijo: inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaHijo,
                preguntaGrupoEtnico: inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaGrupoEtnico,
                preguntaEnfermedad: inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaEnfermedad,
                preguntaDiscapacidad: inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaDiscapacidad,
                preguntaSisben: inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaSisben,
                eps: inscripcionControl.nuevaInscripcion.informacionAdicional.eps,
                empresa: inscripcionControl.nuevaInscripcion.informacionAdicional.empresa,
                cargo: inscripcionControl.nuevaInscripcion.informacionAdicional.cargo,
                tiempoLaborado: inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado,
                idAspirante: inscripcionControl.nuevaInscripcion.aspirante.id
            };
            if (estadovalido === true) {
                appConstant.CERRAR_SWAL();
                return;
            }
            if (!estadovalido) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                hojaVidaService.registrarInscripcionInformacionOtro(inscripcionControl.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }

                    appConstant.MSG_GROWL_OK(appGenericConstant.DATOS_ACTUALIZADO_SATISFACTORIO);
                    appConstant.CERRAR_SWAL();

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
            appConstant.CERRAR_SWAL();
        };

        inscripcionControl.onGuardarCambioDocumento = function () {
            appConstant.MSG_LOADING('Guardando datos, espere un momento...');
            appConstant.CARGANDO();

            if (new ValidationService().checkFormValidity($scope.formwizardinscripcionDatosBasicos)) {

                inscripcionControl.infopersonal = {
                    id: inscripcionControl.nuevaInscripcion.id,
                    idPeriodoAcademico: inscripcionControl.nuevaInscripcion.idPeriodoAcademico,
                    idSeccional: inscripcionControl.nuevaInscripcion.idSeccional,
                    idNivelFormacion: inscripcionControl.nuevaInscripcion.idNivelFormacion,
                    idPrograma: inscripcionControl.nuevaInscripcion.idPrograma,
                    idTipoConvenio: inscripcionControl.nuevaInscripcion.idTipoConvenio,
                    idAspirante: inscripcionControl.nuevaInscripcion.idAspirante,
                    aspirante: {
                        id: inscripcionControl.nuevaInscripcion.aspirante.id,
                        nombre: appConstant.VALIDAR_STRING(inscripcionControl.nuevaInscripcion.aspirante.nombre),
                        apellido: appConstant.VALIDAR_STRING(inscripcionControl.nuevaInscripcion.aspirante.apellido),
                        identificacionAspirante: {
                            idTipoIdentificacion: inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion,
                            identificacion: inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.identificacion
                        },
                        telefono: inscripcionControl.nuevaInscripcion.aspirante.telefono,
                        email: inscripcionControl.nuevaInscripcion.aspirante.email,
                        celular: inscripcionControl.nuevaInscripcion.aspirante.celular,
                        fechaNacimiento: onToDateString(inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento),
                        fechaExpedicionDocumento: onToDateString(inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento),
                        idLugarExpedicionDocumento: inscripcionControl.nuevaInscripcion.aspirante.idMunicipioExpedicion,
                        idGenero: inscripcionControl.nuevaInscripcion.aspirante.idGenero,
                        idEstadoCivil: inscripcionControl.nuevaInscripcion.aspirante.idEstadoCivil,
                        idLugarNacimiento: inscripcionControl.nuevaInscripcion.aspirante.idLugarNacimiento,
                        nombreLugarNacimiento: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento,
                        nombreLugarExpedicionDocumento: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento,
                        nombreLugarResidencia: inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia,
                        idGrupoSanguineo: inscripcionControl.nuevaInscripcion.aspirante.idGrupoSanguineo,
                        idLugarResidencia: inscripcionControl.nuevaInscripcion.aspirante.idLugarResidencia,
                        direccion: inscripcionControl.nuevaInscripcion.aspirante.direccion,
                        idBarrio: inscripcionControl.nuevaInscripcion.aspirante.idBarrio,
                        barrio: null,
                        idInstitucion: inscripcionControl.nuevaInscripcion.aspirante.idInstitucion,
                        otroInstitucion: inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion,
                        idTipoDocumentoNuevo: inscripcionControl.nuevaInscripcion.idTipoDocumentoNuevo,
                        identificacionNuevo: inscripcionControl.nuevaInscripcion.identificacionNuevo
                    },
                    booleanGuardar: false
                };

                hojaVidaService.registrarCambioDocumento(inscripcionControl.infopersonal).then(function (data) {

                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK("La actualización de datos se realizó satisfactoriamente");

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();

                    return;
                });
            } else {
                appConstant.CERRAR_SWAL();
            }
        };


        //FIN IMPORTANTE







        inscripcionControl.onValidarEmpresa = function () {
            inscripcionControl.visible.validoempresa = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === ''
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.empresa === null) {
                inscripcionControl.visible.validoempresa = true;
            }
        };

        inscripcionControl.onValidarCargo = function () {
            inscripcionControl.visible.validocargo = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === ''
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.cargo === null) {
                inscripcionControl.visible.validocargo = true;
            }
        };

        inscripcionControl.onValidarTiempoLaborado = function () {
            inscripcionControl.visible.validotiempolaborado = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === ''
                    || inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado === null) {
                inscripcionControl.visible.validotiempolaborado = true;
            }
        };

        inscripcionControl.onChangeNivelFormacionPadre = function () {
            inscripcionControl.visible.validanivelformacionpadre = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.idFormacion === 'undefined') {
                inscripcionControl.visible.validanivelformacionpadre = true;
            }
        };

        inscripcionControl.onChangeNivelFormacionAcudiente = function () {
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.idFormacion === 'undefined') {
                inscripcionControl.visible.validanivelformacionacudiente = true;
            }
            inscripcionControl.visible.validanivelformacionacudiente = false;
        };

        inscripcionControl.onChangeTieneHijos = function () {
            inscripcionControl.nuevaInscripcion.cuantoshijos = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaHijo = "";
        };

        inscripcionControl.onChangeGrupoEtnico = function () {
            inscripcionControl.nuevaInscripcion.cualgrupoetnico = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaGrupoEtnico = "";

        };

        inscripcionControl.onChangeEnfermedad = function () {
            inscripcionControl.nuevaInscripcion.cualenfermedad = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaEnfermedad = "";
        };

        inscripcionControl.onChangeDiscapacidad = function () {
            inscripcionControl.nuevaInscripcion.cualdiscapacidad = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaDiscapacidad = "";
        };

        inscripcionControl.onChangeSisben = function () {
            inscripcionControl.nuevaInscripcion.puntajesisben = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.preguntaSisben = "";
        };

        inscripcionControl.onChangeLabora = function () {
            inscripcionControl.nuevaInscripcion.empresa = "";
            inscripcionControl.nuevaInscripcion.cargo = "";
            inscripcionControl.nuevaInscripcion.tiempolaborando = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.empresa = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.cargo = "";
            inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado = "";
        };


        //VALIDA EL LUGAR DE EXPEDICIÓN DEL DOCUMENTO
        inscripcionControl.onAceptarExpedicion = function (item) {
            var estado = false;
            if (typeof inscripcionControl.nuevaInscripcion.idPaisExpedicion === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idPaisExpedicion === null
                    || inscripcionControl.nuevaInscripcion.idPaisExpedicion === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaisexp = true;
                estado = true;
            }
            if (typeof inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion === null
                    || inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentoexp = true;
                estado = true;
            }
            if (typeof item === 'undefined') {
                inscripcionControl.visible.activomsjmunicipioexp = true;
                estado = true;
            }
            if (inscripcionControl.nuevaInscripcion.idPaisExpedicion !== null &&
                    inscripcionControl.nuevaInscripcion.idPaisExpedicion !== undefined &&
                    inscripcionControl.nuevaInscripcion.idPaisExpedicion.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentoexp = false;
                inscripcionControl.visible.activomsjmunicipioexp = false;
                estado = false;
            }

            if (estado) {
                return;
            }

            if (inscripcionControl.nuevaInscripcion.idPaisExpedicion.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = inscripcionControl.nuevaInscripcion.idPaisExpedicion.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                inscripcionControl.nuevaInscripcion.aspirante.idMunicipioExpedicion = item.id;
            } else {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = inscripcionControl.nuevaInscripcion.idPaisExpedicion.nombrePais;
            }

            inscripcionControl.visible.validaexpedicion = false;
            inscripcionControl.onOcultarModalesLugar("modalLugarFechaExpedicion");
        };
        // FIN

        //VALIDA EL LUGAR DE NACIMIENTO
        inscripcionControl.onLugarNacimiento = function (item) {

            var estadonaci = false;

            if (typeof inscripcionControl.nuevaInscripcion.idPaisNacimiento === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idPaisNacimiento === null
                    || inscripcionControl.nuevaInscripcion.idPaisNacimiento === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaislgnacimto = true;
                estadonaci = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento === null
                    || inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentonacimto = true;
                estadonaci = true;
            }

            if (typeof item === 'undefined') {
                inscripcionControl.visible.activomsjmunicipionacimto = true;
                estadonaci = true;
            }

            if (inscripcionControl.nuevaInscripcion.idPaisNacimiento !== null &&
                    inscripcionControl.nuevaInscripcion.idPaisNacimiento !== undefined &&
                    inscripcionControl.nuevaInscripcion.idPaisNacimiento.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentonacimto = false;
                inscripcionControl.visible.activomsjmunicipionacimto = false;
                estadonaci = false;
            }


            if (estadonaci) {
                return;
            }

            if (inscripcionControl.nuevaInscripcion.idPaisNacimiento.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento = inscripcionControl.nuevaInscripcion.idPaisNacimiento.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                inscripcionControl.nuevaInscripcion.aspirante.idLugarNacimiento = item.id;
            } else {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento = inscripcionControl.nuevaInscripcion.idPaisNacimiento.nombrePais;
            }

            inscripcionControl.visible.validalugarnacimiento = false;

            inscripcionControl.onOcultarModalesLugar("modalLugarNacimiento");

        };
        // FIN

        //VALIDA EL LUGAR DE RESIDENCIA
        inscripcionControl.onLugarResidencia = function (item) {

            var estadorecd = false;

            if (typeof inscripcionControl.nuevaInscripcion.idPaisResidencia === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idPaisResidencia === null
                    || inscripcionControl.nuevaInscripcion.idPaisResidencia === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia === null
                    || inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.idMunicipioRecidencia === 'undefined') {
                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (inscripcionControl.nuevaInscripcion.idPaisResidencia !== null &&
                    inscripcionControl.nuevaInscripcion.idPaisResidencia !== undefined &&
                    inscripcionControl.nuevaInscripcion.idPaisResidencia.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = false;
                inscripcionControl.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }


            if (estadorecd) {
                return;
            }

            if (inscripcionControl.nuevaInscripcion.idPaisResidencia.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia = inscripcionControl.nuevaInscripcion.idPaisResidencia.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                inscripcionControl.nuevaInscripcion.aspirante.idLugarResidencia = item.id;
            } else {
                inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia = inscripcionControl.nuevaInscripcion.idPaisResidencia.nombrePais;
            }
            inscripcionControl.visible.validalugarresidencia = false;

            inscripcionControl.onOcultarModalesLugar("modalLugarResidencia");
        };
        // FIN


        inscripcionControl.onLugarResidenciaPadre = function (item) {

            var estadorecd = false;

            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === null
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === null
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof item === 'undefined') {
                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre !== null &&
                    inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre !== undefined &&
                    inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = false;
                inscripcionControl.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }

            if (estadorecd) {
                return;
            }

            if (inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia = inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                inscripcionControl.visible.validalugarresidenciapadre = false;
            } else {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia = inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.nombrePais;
            }
            inscripcionControl.onOcultarModalesLugar('modalLugarResidenciaPadre');
        };

        inscripcionControl.onLugarResidenciaMadre = function () {

            inscripcionControl.visible.validalugarresidenciamadre = false;

            var estadorecd = false;

            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === null
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === null
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre === 'undefined') {
                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre !== null &&
                    inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre !== undefined &&
                    inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = false;
                inscripcionControl.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }

            if (estadorecd) {
                return;
            }

            if (inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia = inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre.nombreMunicipio;

                inscripcionControl.visible.validalugarresidencia = false;
            } else {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia = inscripcionControl.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.nombrePais;
            }

            inscripcionControl.onOcultarModalesLugar('modalLugarResidenciaMadre');

        };

        inscripcionControl.onLugarResidenciaAcudiente = function () {
            var estadorecd = false;
            if (typeof inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente === 'undefined'
                    || inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente === null
                    || inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }
            if (typeof inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente === 'undefined'
                    || inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente === null
                    || inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente === 'undefined') {
                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }
            if (inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente !== null &&
                    inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente !== undefined &&
                    inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = false;
                inscripcionControl.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }
            if (estadorecd) {
                return;
            }
            if (inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia = inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente.nombrePais
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + inscripcionControl.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente.nombreMunicipio;

                inscripcionControl.visible.validalugarresidenciaacudiente = false;
            } else {
                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia = inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente.nombrePais;
            }
            inscripcionControl.onOcultarModalesLugar('modalLugarResidenciaAcudiente');
        };



        //METODO GENERICO PARA CERRAR LOS MODALES CUANDO SE ACEPTA
        inscripcionControl.onOcultarModalesLugar = function (item) {
            $("#" + item).hide();
            $("body").removeClass("modal-open");
            $("div").removeClass("modal-backdrop fade in");
        };
        //


        inscripcionControl.ejecutarConsultarTiposConvenios = function () {
            hojaVidaService.consultarTipoConvenio().then(function (data) {
                inscripcionControl.convenios = [];
                angular.forEach(data, function (value) {
                    var convenio = {
                        id: value.id,
                        codigoTipoConvenio: value.codigoTipoConvenio,
                        nombreTipoConvenio: value.nombreTipoConvenio,
                        estado: value.estado
                    };
                    inscripcionControl.convenios.push(convenio);
                });
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.onValidarAnioFinalizacion = function () {
            if (typeof inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion === '') {
                inscripcionControl.visible.validaaniofinalizacion = true;
                return;
            }
            inscripcionControl.visible.validaaniofinalizacion = false;
        };

        inscripcionControl.onValidarAnioPresentacion = function () {
            inscripcionControl.visible.validaaniopresentacion = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion === '') {
                inscripcionControl.visible.validaaniopresentacion = true;
                return;
            }

        };

        inscripcionControl.onValidarFechaExpedicion = function () {
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento === 'undefined'
                    || inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento === '') {
                inscripcionControl.visible.validafechaexpedicion = true;
                return;
            }
            inscripcionControl.visible.validafechaexpedicion = false;
        };

        inscripcionControl.onValidarTelefono = function () {
            inscripcionControl.visible.validotelefono = false;
            inscripcionControl.visible.validotelefonosize = false;
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.telefono === 'undefined'
                    || inscripcionControl.nuevaInscripcion.aspirante.telefono === '') {
                inscripcionControl.visible.validotelefono = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.telefono !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.aspirante.telefono.length < 8) {
                    inscripcionControl.visible.validocelular = false;
                    inscripcionControl.visible.validotelefonosize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarTelefonoPadre = function () {
            inscripcionControl.visible.validotelefonopadre = false;
            inscripcionControl.visible.validotelefonopadresize = false;
            if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono === null) {
                inscripcionControl.visible.validotelefonopadre = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono === '') {
                inscripcionControl.visible.validotelefonopadre = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.telefono.length < 8) {
                    inscripcionControl.visible.validocelularpadre = false;
                    inscripcionControl.visible.validotelefonopadresize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarTelefonoMadre = function () {
            inscripcionControl.visible.validotelefonomadre = false;
            inscripcionControl.visible.validotelefonomadresize = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.telefono === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.telefono === '') {
                inscripcionControl.visible.validotelefonomadre = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.telefono !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.telefono.length < 8) {
                    inscripcionControl.visible.validocelularmadre = false;
                    inscripcionControl.visible.validotelefonomadresize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarTelefonoAcudiente = function () {
            inscripcionControl.visible.validotelefonoacudiente = false;
            inscripcionControl.visible.validotelefonoacudientesize = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono === '') {
                inscripcionControl.visible.validotelefonoacudiente = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono.length < 8) {
                    inscripcionControl.visible.validocelularacudiente = false;
                    inscripcionControl.visible.validotelefonoacudientesize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarCelular = function () {
            inscripcionControl.visible.validocelular = false;
            inscripcionControl.visible.validocelularsize = false;
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.celular === 'undefined'
                    || inscripcionControl.nuevaInscripcion.aspirante.celular === '') {
                inscripcionControl.visible.validocelular = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.celular !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.aspirante.celular.length < 10) {
                    inscripcionControl.visible.validotelefono = false;
                    inscripcionControl.visible.validocelularsize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarCelularPadre = function () {
            inscripcionControl.visible.validocelularpadre = false;
            inscripcionControl.visible.validocelularpadresize = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.celular === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.celular === '') {
                inscripcionControl.visible.validocelularpadre = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.celular !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoPadre.celular.length < 10) {
                    inscripcionControl.visible.validotelefonopadre = false;
                    inscripcionControl.visible.validocelularpadresize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarCelularMadre = function () {
            inscripcionControl.visible.validocelularmadre = false;
            inscripcionControl.visible.validocelularmadresize = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.celular === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.celular === '') {
                inscripcionControl.visible.validocelularmadre = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.celular !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.celular.length < 10) {
                    inscripcionControl.visible.validotelefonomadre = false;
                    inscripcionControl.visible.validocelularmadresize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarCelularAcudiente = function () {
            inscripcionControl.visible.validocelularacudiente = false;
            inscripcionControl.visible.validocelularacudientesize = false;
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.celular === 'undefined'
                    || inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.celular === '') {
                inscripcionControl.visible.validocelularacudiente = true;
                return;
            }
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.celular !== 'undefined') {
                if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente.celular.length < 10) {
                    inscripcionControl.visible.validotelefonoacudiente = false;
                    inscripcionControl.visible.validocelularacudientesize = true;
                    return;
                }
            }
        };

        inscripcionControl.onValidarNivelFormacionMadre = function () {
            if (typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoMadre.idFormacion === 'undefined') {
                inscripcionControl.visible.validanivelformacionmadre = true;
                return;
            }
            inscripcionControl.visible.validanivelformacionmadre = false;
        };

        inscripcionControl.onValidarEmail = function () {
            if (typeof $scope.formwizardinscripcion.email.$error.pattern === 'undefined') {
                inscripcionControl.visible.validoemail = false;
                return;
            }
            inscripcionControl.visible.validoemail = $scope.formwizardinscripcion.email.$error.pattern;
        };

        inscripcionControl.onChangePaisExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjpaisexp = true;
                return;
            }
            inscripcionControl.visible.activomsjpaisexp = false;
        };

        inscripcionControl.onChangePaisNacmento = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjpaislgnacimto = true;
                return;
            }
            inscripcionControl.visible.activomsjpaislgnacimto = false;
        };

        inscripcionControl.onChangePaisRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                return;
            }
            inscripcionControl.visible.activomsjpaislgrecidencia = false;
        };

        inscripcionControl.onChangeDepartamentoExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjdepartamentoexp = true;
                return;
            }
            inscripcionControl.visible.activomsjdepartamentoexp = false;
        };

        inscripcionControl.onChangeDepartamentoNacmento = function (item) {
            inscripcionControl.visible.activomsjdepartamentonacimto = false;
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjdepartamentonacimto = true;
                return;
            }
        };

        inscripcionControl.onChangeDepartamentoRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                return;
            }
            inscripcionControl.visible.activomsjdepartamentorecidencia = false;
        };

        inscripcionControl.onChangeMuncipioExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjmunicipioexp = true;
                return;
            }
            inscripcionControl.visible.activomsjmunicipioexp = false;
        };

        inscripcionControl.onChangeMuncipioNacmento = function (item) {
            inscripcionControl.visible.activomsjmunicipionacimto = false;
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjmunicipionacimto = true;
                return;
            }
        };

        inscripcionControl.onChangeMuncipioRecidencia = function (item) {
            //            inscripcionControl.nuevaInscripcion.aspirante.cualBarrio="";
            //            if (typeof item === 'undefined' || item === null) {
            //                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
            //                return;
            //            }
            //            inscripcionControl.visible.activomsjmunicipiorecidencia = false;
            //            inscripcionService.consultarBarriosPorMunicipios(item.id).then(function (data) {
            //                inscripcionControl.lstbarrios = [];
            //                inscripcionControl.lstbarrios = data;
            //                var otro = {
            //                    id: 0,
            //                    idMunicipio: 0,
            //                    nombre: "OTRO"
            //                };
            //                inscripcionControl.lstbarrios.push(otro);
            //            }).catch(function (e) {
            //                return;
            //            });               
        };



        inscripcionControl.onChangeSelectNivelFormacion = function () {
            if (typeof inscripcionControl.nuevaInscripcion.idNivelFormacion === 'undefined'
                    || inscripcionControl.nuevaInscripcion.idNivelFormacion === null) {
                inscripcionControl.visible.disableSelectPrograma = true;
                inscripcionControl.visible.disableSelectModalidad = true;
                inscripcionControl.visible.disableSelectHorario = true;
                inscripcionControl.nuevaInscripcion.programaDTO = null;
                inscripcionControl.nuevaInscripcion.modalidadDTO = null;
                inscripcionControl.nuevaInscripcion.horarioDTO = null;
                inscripcionControl.nuevaInscripcion.idPrograma = null;
                inscripcionControl.nuevaInscripcion.idModalidad = null;
                inscripcionControl.nuevaInscripcion.idHorario = null;
            } else {
                inscripcionControl.visible.disableSelectPrograma = false;
                inscripcionControl.visible.disableSelectModalidad = true;
                inscripcionControl.visible.disableSelectHorario = true;
                inscripcionControl.nuevaInscripcion.programaDTO = null;
                inscripcionControl.nuevaInscripcion.modalidadDTO = null;
                inscripcionControl.nuevaInscripcion.horarioDTO = null;
                inscripcionControl.nuevaInscripcion.idPrograma = null;
                inscripcionControl.nuevaInscripcion.idModalidad = null;
                inscripcionControl.nuevaInscripcion.idHorario = null;
            }
        };

        inscripcionControl.onBlurMuncipioExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjmunicipioexp = true;
                return;
            }
            inscripcionControl.visible.activomsjmunicipioexp = false;
        };

        inscripcionControl.onBlurMuncipioNacmento = function (item) {
            inscripcionControl.visible.activomsjmunicipionacimto = false;
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjmunicipionacimto = true;
                return;
            }
        };

        inscripcionControl.onBlurMuncipioRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                inscripcionControl.visible.activomsjmunicipiorecidencia = true;
                return;
            }
            inscripcionControl.visible.activomsjmunicipiorecidencia = false;
        };

        inscripcionControl.ejecutarConsultarTodosBarrios = function () {
            hojaVidaService.consultarAllBarrios().then(function (data) {
                inscripcionControl.lstbarrios = [];
                inscripcionControl.lstbarrios = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarPais = function () {
            hojaVidaService.consultarPais().then(function (data) {
                inscripcionControl.lstpais = [];
                inscripcionControl.lstpais = data;
                inscripcionControl.ejecutarLugarExpedicionConsultarPais();
                inscripcionControl.ejecutarLugarNacimientoConsultarPais();
                inscripcionControl.ejecutarLugarRecidenciaConsultarPais();
            }).catch(function (e) {
                return;
            });
        };

        /* METODO PARA CARGAR */


        inscripcionControl.ejecutarConsultarMediosDifusion = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MEDIO_DIFUSION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstmediodifusion = [];
                inscripcionControl.lstmediodifusion = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lsttipodocumentos = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarEstadoCivil = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO_CIVIL, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstestadocivil = [];
                inscripcionControl.lstestadocivil = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarGenero = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_GENERO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstgenero = [];
                inscripcionControl.lstgenero = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarGrupoSanguineo = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_GRUPO_SANGUINEO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstgruposanguineo = [];
                inscripcionControl.lstgruposanguineo = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarTipoViviendas = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_VIVIENDA, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lsttipovivienda = [];
                inscripcionControl.lsttipovivienda = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarContratosSocioEconomicos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTRATO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstcontratoseconomicos = [];
                inscripcionControl.lstcontratoseconomicos = data;

            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarNivelEducativo = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_NIVEL_EDUCATIVO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                inscripcionControl.lstniveleducactivo = [];
                inscripcionControl.lstniveleducactivo = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarSeccional = function () {
            hojaVidaService.consultarSeccional().then(function (data) {
                inscripcionControl.seccionales = [];
                inscripcionControl.seccionales = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarInstituciones = function () {
            hojaVidaService.consultarColegio().then(function (data) {
                inscripcionControl.instituciones = [];
                inscripcionControl.instituciones = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarNivelEducativo();
        inscripcionControl.ejecutarConsultarTipoDocumentos();
        inscripcionControl.ejecutarConsultarEstadoCivil();
        inscripcionControl.ejecutarConsultarGenero();
        inscripcionControl.ejecutarConsultarGrupoSanguineo();
        inscripcionControl.ejecutarConsultarSeccional();
        inscripcionControl.ejecutarConsultarTiposConvenios();
        inscripcionControl.ejecutarConsultarPais();
        inscripcionControl.ejecutarConsultarInstituciones();
        inscripcionControl.ejecutarConsultarTipoViviendas();
        inscripcionControl.ejecutarConsultarContratosSocioEconomicos();
        inscripcionControl.ejecutarConsultarTodosBarrios();
        inscripcionControl.ejecutarConsultarMediosDifusion();

        inscripcionControl.onCalcularEdad = function () {
            if (typeof inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento === 'undefined'
                    || inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento === null) {
                inscripcionControl.visible.validafechanacimiento = true;
                return;
            }
            inscripcionControl.visible.validafechanacimiento = false;
            inscripcionControl.visible.validaedad = false;
            var values = (inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento).split("/");
            var dia = parseInt(values[0]);
            var mes = parseInt(values[1]);
            var ano = parseInt(values[2]);
            var fecha_hoy = new Date();
            var ahora_ano = parseInt(fecha_hoy.getYear());
            var ahora_mes = parseInt(fecha_hoy.getMonth() + 1);
            var ahora_dia = parseInt(fecha_hoy.getDate());
            var edad = (ahora_ano + 1900) - ano;
            if (ahora_mes < mes) {
                edad--;
            }
            if ((mes === ahora_mes) && (ahora_dia < dia)) {
                edad--;
            }
            if (edad > 1900) {
                edad -= 1900;
            }
            inscripcionControl.nuevaInscripcion.edad = edad;
        };
        function formattedDate(date) {
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

        function toDate(dateStr) {
            var parts = [];
            if (dateStr.match('/')) {
                parts = dateStr.split('/');
            } else {
                parts = dateStr.split('-');
            }
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }

        function formatDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        inscripcionControl.clonePais = function () {
            return inscripcionControl.lstpais.slice();
        };
        inscripcionControl.cloneDepartamentos = function () {
            return inscripcionControl.lstdepartamentos.slice();
        };
        inscripcionControl.cloneMunicipios = function () {
            return inscripcionControl.listmunicipios.slice();
        };

        inscripcionControl.ejecutarLugarExpedicionConsultarMunicipios = function () {
            inscripcionControl.lgexplstmunicipios = [];
            inscripcionControl.lgexplstmunicipios = inscripcionControl.cloneMunicipios();
        };
        inscripcionControl.ejecutarLugarNacimientoConsultarMunicipios = function () {
            inscripcionControl.lgnacimtolstmunicipios = [];
            inscripcionControl.lgnacimtolstmunicipios = inscripcionControl.cloneMunicipios();
        };
        inscripcionControl.ejecutarLugarRecidenciaConsultarMunicipios = function () {
            inscripcionControl.lgrecidencialstmunicipios = [];
            inscripcionControl.lgrecidencialstmunicipios = inscripcionControl.cloneMunicipios();
        };
        inscripcionControl.ejecutarLugarExpedicionConsultarDepartamentos = function () {
            inscripcionControl.lgexplstdepartamentos = [];
            inscripcionControl.lgexplstdepartamentos = inscripcionControl.cloneDepartamentos();
        };
        inscripcionControl.ejecutarLugarNacimientoConsultarDepartamentos = function () {
            inscripcionControl.lgnacimtolstdepartamentos = [];
            inscripcionControl.lgnacimtolstdepartamentos = inscripcionControl.cloneDepartamentos();
        };
        inscripcionControl.ejecutarLugarRecidenciaConsultarDepartamentos = function () {
            inscripcionControl.lgrecidencialstdepartamentos = [];
            inscripcionControl.lgrecidencialstdepartamentos = inscripcionControl.cloneDepartamentos();
        };
        inscripcionControl.ejecutarLugarExpedicionConsultarPais = function () {
            inscripcionControl.lgexplstpais = [];
            inscripcionControl.lgexplstpais = inscripcionControl.clonePais();
        };
        inscripcionControl.ejecutarLugarNacimientoConsultarPais = function () {
            inscripcionControl.lgnacimtolstpais = [];
            inscripcionControl.lgnacimtolstpais = inscripcionControl.clonePais();
        };
        inscripcionControl.ejecutarLugarRecidenciaConsultarPais = function () {
            inscripcionControl.lgrecidencialstpais = [];
            inscripcionControl.lgrecidencialstpais = inscripcionControl.clonePais();
        };
        inscripcionControl.onConsultarDepartoPorPaisLugarExpedicion = function (item) {
            inscripcionControl.lgexplstdepartamentos = [];
            inscripcionControl.lgexplstmunicipios = [];
            if (item === null) {
                inscripcionControl.visible.activomsjpaisexp = true;
                inscripcionControl.visible.activomsjdepartamentoexp = false;
                inscripcionControl.visible.activomsjmunicipioexp = false;
                inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion = null;
                inscripcionControl.nuevaInscripcion.idLugarExpedicionDocumento = null;
                return;
            }
            if (item.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.visible.activomsjpaisexp = false;
                inscripcionControl.visible.activomsjdepartamentoexp = false;
                inscripcionControl.visible.activomsjmunicipioexp = false;
                inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion = null;
                inscripcionControl.nuevaInscripcion.idLugarExpedicionDocumento = null;
                return;
            }
            inscripcionControl.visible.activomsjpaisexp = false;
            inscripcionControl.ejecutarLugarExpedicionConsultarMunicipios();
            hojaVidaService.consultarDepartamentoPais(item).then(function (data) {
                inscripcionControl.lgexplstdepartamentos = [];
                inscripcionControl.lgexplstdepartamentos = data;

            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.onConsultarMunicipioPorDepartamentoLugarExpedicion = function (item) {
            inscripcionControl.lgexplstmunicipios = [];
            if (item === null) {
                inscripcionControl.visible.activomsjdepartamentoexp = true;
                return;
            }
            inscripcionControl.visible.activomsjdepartamentoexp = false;
            hojaVidaService.consultarMunicipioPorDepartamento(item).then(function (data) {
                inscripcionControl.lgexplstmunicipios = [];
                inscripcionControl.lgexplstmunicipios = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.onConsultarDepartoPorPaisLugarNacimiento = function (item) {
            inscripcionControl.lgnacimtolstdepartamentos = [];
            inscripcionControl.lgnacimtolstmunicipios = [];
            if (item === null) {
                inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento = null;
                inscripcionControl.nuevaInscripcion.idMunicipioNacimiento = null;
                inscripcionControl.visible.activomsjpaislgnacimto = true;
                return;
            }
            if (item.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento = null;
                inscripcionControl.nuevaInscripcion.idMunicipioNacimiento = null;
                inscripcionControl.visible.activomsjpaislgnacimto = false;
                inscripcionControl.visible.activomsjdepartamentonacimto = false;
                inscripcionControl.visible.activomsjmunicipionacimto = false;
                return;
            }
            inscripcionControl.visible.activomsjpaislgnacimto = false;
            inscripcionControl.ejecutarLugarNacimientoConsultarMunicipios();
            hojaVidaService.consultarDepartamentoPais(item).then(function (data) {
                inscripcionControl.lgnacimtolstdepartamentos = [];
                inscripcionControl.lgnacimtolstdepartamentos = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.onConsultarDepartoPorPaisLugarRecidencia = function (item) {
            inscripcionControl.lgrecidencialstdepartamentos = [];
            inscripcionControl.lgrecidencialstmunicipios = [];
            if (item === null) {
                inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = null;
                inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = null;
                inscripcionControl.visible.activomsjpaislgrecidencia = true;
                return;
            }
            if (item.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = null;
                inscripcionControl.nuevaInscripcion.idMunicipioRecidencia = null;
                inscripcionControl.visible.activomsjpaislgrecidencia = false;
                inscripcionControl.visible.activomsjdepartamentorecidencia = false;
                inscripcionControl.visible.activomsjmunicipiorecidencia = false;
                return;
            }
            inscripcionControl.visible.activomsjpaislgrecidencia = false;
            inscripcionControl.ejecutarLugarNacimientoConsultarMunicipios();
            hojaVidaService.consultarDepartamentoPais(item).then(function (data) {
                inscripcionControl.lgrecidencialstdepartamentos = [];
                inscripcionControl.lgrecidencialstdepartamentos = data;
            }).catch(function (e) {
                return;
            });

        };

        inscripcionControl.onConsultarMunicipioPorDepartamentoLugarNacimiento = function (item) {
            if (item === null) {
                inscripcionControl.visible.activomsjdepartamentonacimto = true;
                return;
            }
            inscripcionControl.visible.activomsjdepartamentonacimto = false;
            hojaVidaService.consultarMunicipioPorDepartamento(item).then(function (data) {
                inscripcionControl.lgnacimtolstmunicipios = [];
                inscripcionControl.lgnacimtolstmunicipios = data;

            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.onConsultarMunicipioPorDepartamentoLugarRecidencia = function (item) {
            if (item === null) {
                inscripcionControl.visible.activomsjdepartamentorecidencia = true;
                return;
            }
            inscripcionControl.visible.activomsjdepartamentorecidencia = false;
            hojaVidaService.consultarMunicipioPorDepartamento(item).then(function (data) {
                inscripcionControl.lgrecidencialstmunicipios = [];
                inscripcionControl.lgrecidencialstmunicipios = data;

            }).catch(function (e) {
                return;
            });
        };
        $('#fechaexpedicionInforPersonal').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: new Date("01/01/1900"),
            endDate: new Date(),
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }, beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }
        });

        $('#idfechanacimientoInforPersonal').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: new Date("01/01/1900"),
            endDate: new Date(),
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }, beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }
        });

        $('#aniofinalizacion').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: new Date("01/01/1900"),
            endDate: new Date(),
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }, beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }
        });

        $('#aniopresentacion').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            startDate: new Date("01/01/1900"),
            endDate: new Date(),
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }, beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }, beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }
        });

        $timeout(function () {
            $('#ui-select-barrio-datos-contacto input.ui-select-search').blur(function () {
                $('#fakeInputIdAspiranteBarrioDatosContacto').triggerHandler("focus");
                $('#fakeInputIdAspiranteBarrioDatosContacto').triggerHandler("blur");
            });
        }, 50);

        function onToDateString(dateStr) {
            if (dateStr !== null && dateStr !== undefined && dateStr !== "") {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
        var fecha;

        inscripcionControl.onFocusFechaExpedicion = function (idCampo) {
            fecha = $(idCampo).val();
        };
        inscripcionControl.onBlurFechaExpedicion = function (idCampo) {
            $(idCampo).val(fecha);
        };

        inscripcionControl.onGuardarObservacion = function () {

            inscripcionControl.registrarObservacion.idUsuario = localStorageService.get("usuario").id;
            inscripcionControl.registrarObservacion.usuario = localStorageService.get("usuario").username;
            inscripcionControl.registrarObservacion.idAspirante = inscripcionControl.nuevaInscripcion.aspirante.id;

            hojaVidaService.postObservacionEstudiante(inscripcionControl.registrarObservacion).then(function (data) {
                if (data.tipo === 200) {

                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    inscripcionControl.registrarObservacion.observacion = undefined;
                    inscripcionControl.consultarObservacion(inscripcionControl.nuevaInscripcion.aspirante.id);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });

        };

        inscripcionControl.onIrRegistrarRetiro = function () {

            angular.forEach(inscripcionControl.estudianteRetiro.programas, function (value, key) {
                if (value.idPrograma === inscripcionControl.estudianteRetiro.programa.id) {
                    inscripcionControl.programaAux = value;
                    inscripcionControl.nombrePrograma = inscripcionControl.estudianteRetiro.programa.nombre;
                }
            });

            var nuevoRetiro = {
                idEstudiante: inscripcionControl.programaAux.idEstudiante,
                idAspirante: inscripcionControl.nuevaInscripcion.aspirante.id,
                idUsuario: localStorageService.get('usuario').id,
                usuario: localStorageService.get("usuario").username,
                idPrograma: inscripcionControl.programaAux.idPrograma,
                nombrePrograma: inscripcionControl.nombrePrograma,
                observacion: inscripcionControl.estudianteRetiro.observacion
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            hojaVidaService.postRetiroEstudiante(nuevoRetiro).then(function (data) {
                if (data.tipo === 200) {
                    inscripcionControl.estudianteRetiro.programa = undefined;
                    inscripcionControl.estudianteRetiro.observacion = undefined;
                    inscripcionControl.consultarEstudianteProgramaRetiro();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    inscripcionControl.consultarRetiros(inscripcionControl.nuevaInscripcion.aspirante.id);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        inscripcionControl.consultarRetiros = function (idAspirante) {
            hojaVidaService.getListadoRetiroByIdAspirante(idAspirante).then(function (data) {
                inscripcionControl.listadoRetirosEstudiante = data;
                inscripcionControl.listadoReintegrosEstudiante = [];
                inscripcionControl.estudianteRetiro.programas = [];

                angular.forEach(data, function (value, key) {
                    if (value.idReintegro === null || value.idReintegro === undefined) {
                        inscripcionControl.listadoReintegrosEstudiante.push(value);
                    }
                });
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        inscripcionControl.consultarObservacion = function (identificacion) {
            hojaVidaService.getListadoObservacionesByIdAspirante(identificacion).then(function (data) {
                inscripcionControl.listaObservaciones = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        inscripcionControl.consultarEstudianteProgramaRetiro = function () {
            cambioHorarioServices.buscarEstudianteByCodigo(inscripcionControl.nuevaInscripcion.aspirante.identificacionAspirante.identificacion).then(function (data) {
                if (data === null || data === undefined || data.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_EXISTE);
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    inscripcionControl.estudianteRetiro = {};
                    $('#divDatosEstudiante').show();
                    inscripcionControl.estudainteList = [];
                    inscripcionControl.estudianteRetiro = {};
                    inscripcionControl.estudianteRetiro.tipoDocumento = data[0].tipoDocumento;
                    inscripcionControl.estudianteRetiro.identificacion = data[0].identificacionAspirante;
                    inscripcionControl.estudianteRetiro.nombres = data[0].nombreAspirante;
                    inscripcionControl.estudianteRetiro.apellidos = data[0].apellidoAspirante;
                    inscripcionControl.estudianteRetiro.programas = [];

                    inscripcionControl.listadoRetirosEstudiante;
                    inscripcionControl.programasRetiro = [];

                    if (inscripcionControl.listadoRetirosEstudiante.length > 0) {
                        angular.forEach(data[0].programa, function (value, key) {
                            var bandera = false;
                            for (var i = 0; i < inscripcionControl.listadoRetirosEstudiante.length; i++) {
                                if (value.idEstudiante === inscripcionControl.listadoRetirosEstudiante[i].idEstudiante && value.idPrograma === inscripcionControl.listadoRetirosEstudiante[i].idPrograma) {
                                    if ((inscripcionControl.listadoRetirosEstudiante[i].idReintegro === null || inscripcionControl.listadoRetirosEstudiante[i].idReintegro === undefined)) {
                                        bandera = false;
                                        break;
                                    } else {
                                        bandera = true;
                                    }
                                } else {
                                    bandera = true;
                                }
                            }

                            if (bandera) {
                                inscripcionControl.estudianteRetiro.programas.push(value);
                                cambioHorarioServices.consultarProgramaPorEstudiante(value.idPrograma).then(function (data) {
                                    var item = {
                                        id: data.id,
                                        nombre: data.nombrePrograma,
                                        modalidades: data.idModalidades,
                                        horarios: data.idHorarios
                                    };

                                    inscripcionControl.programasRetiro.push(item);

                                }).catch(function (e) {
                                    appConstant.MSG_GROWL_ERROR();
                                    return;
                                });
                            }
                        });
                    } else {
                        inscripcionControl.estudianteRetiro.programas = data[0].programa;
                        angular.forEach(data[0].programa, function (value, key) {
                            cambioHorarioServices.consultarProgramaPorEstudiante(value.idPrograma).then(function (data) {
                                var item = {
                                    id: data.id,
                                    nombre: data.nombrePrograma,
                                    modalidades: data.idModalidades,
                                    horarios: data.idHorarios
                                };

                                inscripcionControl.programasRetiro.push(item);

                            }).catch(function (e) {
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            });
                        });
                    }
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        inscripcionControl.onIrRegistrarReintegro = function (item) {

            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            var nuevoReintegro = {
                idEstudiante: item.idEstudiante,
                idAspirante: inscripcionControl.nuevaInscripcion.aspirante.id,
                idUsuario: localStorageService.get('usuario').id,
                usuario: localStorageService.get("usuario").username,
                idRetiro: item.id,
                idPrograma: item.idPrograma,
                nombrePrograma: item.nombrePrograma
            };


            hojaVidaService.postReintegroEstudiante(nuevoReintegro).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    inscripcionControl.consultarRetiros(inscripcionControl.nuevaInscripcion.aspirante.id);
                    inscripcionControl.consultarEstudianteProgramaRetiro();
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

    }

})();
