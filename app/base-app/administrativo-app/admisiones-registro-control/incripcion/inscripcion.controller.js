(function () {
    'use strict';
    angular.module('mytodoApp').controller('inscripcionCtrl', inscripcionCtrl);
    inscripcionCtrl.$inject = ['$scope', 'inscripcionService', 'ValidationService', '$location', 'localStorageService', 'utilServices', '$filter', '$timeout', 'appConstant', 'appGenericConstant', 'appConstantValueList'];
    function inscripcionCtrl($scope, inscripcionService, ValidationService, $location, localStorageService, utilServices, $filter, $timeout, appConstant, appGenericConstant, appConstantValueList) {

        var inscripcionControl = this;
        var config = {};
        var codigo_tipo_identificacion = 71;
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
        inscripcionControl.alianza=[];
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
        inscripcionControl.sedes = [];
        inscripcionControl.cursos = [];
        inscripcionControl.nuevaInscripcion = inscripcionService.inscripcion;
        inscripcionControl.nuevaInscripcionInicial = inscripcionService.inscripcionInicial;
        inscripcionControl.nuevaInscripcionInicialV2 = inscripcionService.inscripcionInicial;
        inscripcionControl.modowizard = inscripcionService.modowizard;
        inscripcionControl.estadopasos = inscripcionService.estadopasos;
        inscripcionControl.infopersonal = inscripcionService.infopersonal;
        inscripcionControl.visible = inscripcionService.visible;
        inscripcionControl.nuevaInscripcion.celular;
        inscripcionControl.nuevaInscripcion.idEstadoCivil;
        inscripcionControl.nuevaInscripcion.idGrupoSanguineo;
        inscripcionControl.nuevaInscripcion.identificacionAspirante = {};
        inscripcionControl.nuevaInscripcion.identificacionAspirante.idTipoIdentificacion = null;
        inscripcionControl.nuevaInscripcion.identificacionAspirante.identificacion = null;
        inscripcionControl.options = appConstant.FILTRO_TABLAS;
      //inscripcionControl.inscripcion = localStorageService.get('inscripcion');
      //inscripcionControl.period = inscripcionControl.inscripcion.nombrePeriodoAcademico;
       // inscripcionControl.selectedOption = inscripcionControl.options[0];
        inscripcionControl.soloInscripcion = inscripcionService.botonVolver;
        localStorageService.set('responsedata', null);

        if (localStorageService.get('visible') !== null) {
            var visible = localStorageService.get('visible');
            inscripcionControl.visible = visible;
            inscripcionControl.visible.validotelefonoacudiente = false;
            inscripcionControl.visible.validocelularacudiente = false;
            inscripcionControl.visible.validotelefonoacudientesize = false;
            inscripcionControl.visible.validocelularacudientesize = false;
        }

        inscripcionControl.botonVolverSi = function (id) {
            if (id === "/#/inscripcion") {
                inscripcionControl.soloInscripcion.es = true;
                inscripcionControl.onLimpiar();
            }
        };
        inscripcionControl.botonVolverNo = function () {
            inscripcionControl.soloInscripcion.es = false;
            inscripcionControl.onLimpiar();
            $timeout(function () {
                $('#volverIns').remove();
            }, 150);
        };
        if (localStorageService.get('listainscripciones') !== null) {
            inscripcionControl.lstinscripcionestemps = localStorageService.get('listainscripciones');
        }
        if (localStorageService.get('inscripcion') !== null) {
            var inscripcion = localStorageService.get('inscripcion');
            inscripcionControl.nuevaInscripcion = inscripcion;
        }
        if (localStorageService.get('estadopasos') !== null) {
            var estadopasos = localStorageService.get('estadopasos');
            inscripcionControl.estadopasos = estadopasos;
        }
        if (localStorageService.get('infopersonal') !== null || typeof localStorageService.get('infopersonal') !== 'undefined') {
            inscripcionControl.infopersonal = localStorageService.get('infopersonal');
        }

        if (localStorageService.get('programas') !== null) {
            inscripcionControl.programas = localStorageService.get('programas');
        }
        if (localStorageService.get('jornadas') !== null) {
            inscripcionControl.jornadas = localStorageService.get('jornadas');
        }
        if (localStorageService.get('horarios') !== null) {
            inscripcionControl.horarios = localStorageService.get('horarios');
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

        inscripcionControl.onLimpiar = function () {
            inscripcionService.inscripcion = {};
            inscripcionControl.nuevaInscripcion = {};
            inscripcionControl.nuevaInscripcionInicial.identificacionAspirante = {};
            inscripcionControl.nuevaInscripcion.aspirante = {};
            inscripcionControl.nuevaInscripcion.informacionAdicional = {};
            localStorageService.set('inscripcion', null);
            localStorageService.set('visible', null);
            localStorageService.set('estadopasos', null);
            localStorageService.set('infopersonal', null);
            inscripcionService.visible.estadoforminicio = true;
            inscripcionService.visible.estadoformtipopago = false;
            inscripcionService.visible.estadoformcapturapin = false;
            inscripcionService.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.estadoforminicio = true;
            inscripcionControl.visible.estadoformtipopago = false;
            inscripcionControl.visible.estadoformcapturapin = false;
            inscripcionControl.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.estadobotonesinicio = false;
            inscripcionControl.visible.desctivarbotonatras = true;
            inscripcionService.visible.activetabstep1 = appGenericConstant.ACTIVO;
            inscripcionService.visible.activetabstep2 = appGenericConstant.ESPACIO;

            inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
            inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;

            inscripcionControl.visible.esvacialistaprograma = false;
            // $location.path("/pagainscripcion");
        };
        inscripcionControl.onSalir = function () {
            inscripcionControl.onLimpiar();
            if (inscripcionControl.soloInscripcion.es === false)
                $timeout(function () {
                    $('#volverIns').remove();
                }, 150);
        };
        inscripcionControl.ingresar = function () {
            inscripcionControl.visible.estadoforminicio = true;
        };
        inscripcionControl.onIrPagar = function () {
            inscripcionService.visible.estadoforminicio = true;
            inscripcionService.visible.estadoformtipopago = false;
            inscripcionService.visible.estadoformcapturapin = false;
            $location.path("/pagainscripcion");
        };
        inscripcionControl.onIrNoPagar = function () {
            $location.path("/inscripcion-cud");
        };
        inscripcionControl.onIniciar = function () {
            if (new ValidationService().checkFormValidity($scope.forminicioinscripcion1)) {
                $location.path("/inscripcion-temp");
            }
        };
        function revalidate(elementName) {
            $scope.$broadcast('angularValidation.revalidate', elementName);
        }
        inscripcionControl.onIniciarInscripcionPreliminar = function () {
            var myValidation = new ValidationService({controllerAs: inscripcionControl, formName: 'inspCtrl.forminicioinscripcion1'});
            if (inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion === null
                    || inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion === undefined
                    || inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion === ''
                    || inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.identificacion === null
                    || inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.identificacion === undefined
                    || inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.identificacion === '') {
                revalidate('numerodocumentoInicioInscripcion');
                //revalidate('tipodocInicioInscripcion');
                validarIngreso();
                return;
            } else {
                revalidate('numerodocumentoInicioInscripcion');
                revalidate('tipodocInicioInscripcion');
            }
            if (myValidation.checkFormValidity(inscripcionControl.forminicioinscripcion1)) {
                inscripcionControl.nuevaInscripcion = {
                    estado: "no",
                    identificacionAspirante: {
                        idTipoIdentificacion: inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion,
                        identificacion: inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.identificacion
                    },
                    idNivelFormacion: null,
                    idPrograma: null,
                    tipodocumento: null
                };
                inscripcionControl.validarPreinscripcion(inscripcionControl.nuevaInscripcion);
            }
            validarIngreso();
        };

        function validarIngreso() {
            localStorageService.remove('inscripcion');
            localStorageService.remove('visible');
            localStorageService.remove('estadopasos');
            inscripcionControl.visible.disableSelectPrograma = true;
            inscripcionControl.visible.disableSelectModalidad = true;
            inscripcionControl.visible.disableSelectHorario = true;
            inscripcionService.visible.estadoforminicio = true;
            inscripcionService.visible.estadoformtipopago = false;
            inscripcionService.visible.estadoformcapturapin = false;
            inscripcionService.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.estadoforminicio = true;
            inscripcionControl.visible.estadoformtipopago = false;
            inscripcionControl.visible.estadoformcapturapin = false;
            inscripcionControl.visible.ocultarbotonsalir = false;
            inscripcionControl.visible.desctivarbotonatras = true;
            inscripcionService.visible.activetabstep1 = appGenericConstant.ACTIVO;
            inscripcionService.visible.activetabstep2 = appGenericConstant.ESPACIO;

            inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
            inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;

        }


        inscripcionControl.NumeroIdentificacion = function () {
            revalidate('numerodocumentoInicioInscripcion');
        };

        inscripcionControl.ejecutarConsultarPeriodoAcademico = function () {
            inscripcionService.consultarPeriodoAcademico().then(function (data) {
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
        inscripcionControl.onIrCapturaPin = function () {
            inscripcionService.visible.estadoformtipopago = false;
            inscripcionService.visible.estadoformcapturapin = true;
            inscripcionService.visible.ocultarbotonsalir = true;
        };
        inscripcionControl.onVerificarPagoOnline = function () {
            swal({
                title: appGenericConstant.VERIFICACION_EXITOSA,
                text: appGenericConstant.PAGO_EXITO,
                type: appGenericConstant.SUCCESS
            });
            $location.path("/inscripcion-cud");
        };
        inscripcionControl.onIniciarInscripcionPin = function () {
            if (new ValidationService().checkFormValidity($scope.$$childTail.formcapturapin)) {
                inscripcionControl.validarPreinscripcion(inscripcionControl.nuevaInscripcion);
            }
        };
        inscripcionControl.onIrInscripcion = function (item) {
            inscripcionControl.nuevaInscripcion = item;
            inscripcionControl.nuevaInscripcion.informacionAdicional = item.informacionAdicional;
            inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento = $filter('date')(item.aspirante.fechaExpedicionDocumento, 'dd/MM/yyyy hh:mm:ss');
            inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento = $filter('date')(item.aspirante.fechaNacimiento, 'dd/MM/yyyy hh:mm:ss');
            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion = $filter('date')(item.informacionAcademica.fechaCulminacion, 'dd/MM/yyyy hh:mm:ss');
            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion = $filter('date')(item.informacionAcademica.fechaPresentacion, 'dd/MM/yyyy hh:mm:ss');
            localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
            $location.path("/inscripcion-cud");
        };
        inscripcionControl.validarPreinscripcion = function (item) {
            appConstant.MSG_LOADING('Verificando aspirante, espere un momento...');
            appConstant.CARGANDO();
            inscripcionService.consultarPreinscripcion(item).then(function (data) {
                inscripcionControl.visible.validaseccional = false;
                inscripcionControl.visible.validanivelformacion = false;
                inscripcionControl.visible.validaprograma = false;
                inscripcionControl.visible.validatipoconvenio = false;
                inscripcionControl.visible.validajornada = false;
                localStorageService.set('listainscripciones', null);
                if (data.objectResponse !== null) {
                    if (data.objectResponse.length === 1) {
                        inscripcionControl.nuevaInscripcion = data.objectResponse[0];
                        if (inscripcionControl.nuevaInscripcion.aspirante === null) {
                            inscripcionControl.nuevaInscripcion.idPeriodoAcademico = null;
                            inscripcionControl.nuevaInscripcion.aspirante = {
                                identificacionAspirante: {
                                    idTipoIdentificacion: inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion,
                                    identificacion: inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.identificacion
                                },
                                nombreLugarExpedicionDocumento: null,
                                nombreLugarNacimiento: null,
                                nombreLugarResidencia: null,
                                fechaExpedicionDocumento: null,
                                fechaNacimiento: null,
                                idInstitucion: null,
                                otroInstitucion: null
                            };
                        }
                        appConstant.CERRAR_SWAL();
                        inscripcionControl.visible.institucion = true;
                        inscripcionControl.nuevaInscripcion.informacionAcademica = data.objectResponse[0].informacionAcademica;
                        inscripcionControl.nuevaInscripcion.informacionAdicional = data.objectResponse[0].informacionAdicional;
                        inscripcionControl.nuevaInscripcion.informacionReferencia = data.objectResponse[0].informacionReferencia;
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
                            inscripcionControl.nuevaInscripcion.aspirante.fechaExpedicionDocumento = $filter('date')(data.objectResponse[0].aspirante.fechaExpedicionDocumento, 'dd/MM/yyyy hh:mm:ss');
                            inscripcionControl.nuevaInscripcion.aspirante.fechaNacimiento = $filter('date')(data.objectResponse[0].aspirante.fechaNacimiento, 'dd/MM/yyyy hh:mm:ss');
                            if (inscripcionControl.nuevaInscripcion.aspirante.idInstitucion !== null && inscripcionControl.nuevaInscripcion.aspirante.idInstitucion !== undefined) {
                                inscripcionControl.nuevaInscripcion.informacionAcademica.idInstitucion = inscripcionControl.nuevaInscripcion.aspirante.idInstitucion;
                                inscripcionControl.visible.institucion = true;
                                if (inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion !== null && inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion !== undefined) {
                                    inscripcionControl.nuevaInscripcion.informacionAcademica.nombreInstitucion = inscripcionControl.nuevaInscripcion.aspirante.otroInstitucion;
                                }
                            }
                        }
                        if (inscripcionControl.nuevaInscripcion.informacionAcademica !== null) {
                            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion = $filter('date')(data.objectResponse[0].informacionAcademica.fechaCulminacion, 'dd/MM/yyyy hh:mm:ss');
                            inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion = $filter('date')(data.objectResponse[0].informacionAcademica.fechaPresentacion, 'dd/MM/yyyy hh:mm:ss');
                        }
                        if (data.objectResponse[0].programaDTO !== null) {
                            var objProgramaDTO = {
                                id: data.objectResponse[0].programaDTO.id,
                                nombrePrograma: data.objectResponse[0].programaDTO.nombrePrograma,
                                modalidades: [],
                                horarios: []
                            };
                            inscripcionControl.nuevaInscripcion.programaDTO = objProgramaDTO;
                        }
                        if (data.objectResponse[0].modalidadDTO !== null) {
                            var objModalidadDTO = {
                                id: data.objectResponse[0].modalidadDTO.id,
                                nombreModalidad: data.objectResponse[0].modalidadDTO.nombreModalidad
                            };
                            inscripcionControl.nuevaInscripcion.modalidadDTO = objModalidadDTO;
                        }
                        if (data.objectResponse[0].horarioDTO !== null) {
                            var objHorarioDTO = {
                                id: data.objectResponse[0].horarioDTO.id,
                                nombreHorario: data.objectResponse[0].horarioDTO.nombreHorario
                            };
                            inscripcionControl.nuevaInscripcion.horarioDTO = objHorarioDTO;
                        }
                        /////
                        inscripcionControl.nuevaInscripcion.identificacionAspirante = item.identificacionAspirante;
                        if (inscripcionControl.nuevaInscripcion.idSeccional !== null
                                || inscripcionControl.nuevaInscripcion.idNivelFormacion !== null) {
                            inscripcionControl.visible.estadobotonesinicio = true;
                        }
                        if (inscripcionControl.nuevaInscripcion.aspirante !== null) {
                            swal.closeModal();
                            inscripcionControl.visible.disableSelectPrograma = false;
                            inscripcionControl.visible.disableSelectModalidad = false;
                            inscripcionControl.visible.disableSelectHorario = false;
                            inscripcionControl.nuevaInscripcion.aspirante = data.objectResponse[0].aspirante;
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

                            if (inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente === null
                                    || typeof inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente === 'undefined') {
                                inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
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
                            inscripcionControl.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = appGenericConstant.CARTAGENA;
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarNacimiento = appGenericConstant.CARTAGENA;
                            inscripcionControl.nuevaInscripcion.aspirante.nombreLugarResidencia = appGenericConstant.CARTAGENA;

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
                            inscripcionControl.nuevaInscripcion.paisrecidenciaacudiente = defectoPais;
                            var defectoDepartamento = appGenericConstant.DEPARTAMENTO_DEFECTO;
                            inscripcionControl.nuevaInscripcion.idDepartamentoExpedicion = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.idDepartamentoNacimiento = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.idDepartamentoRecidencia = defectoDepartamento;
                            inscripcionControl.nuevaInscripcion.departamentorecidenciaacudiente = defectoDepartamento;
                            var defectoMunicipio = appGenericConstant.MUNICIPIO_DEFECTO;
                            inscripcionControl.nuevaInscripcion.aspirante.idLugarNacimiento = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.aspirante.idMunicipioExpedicion = defectoMunicipio;
                            inscripcionControl.nuevaInscripcion.aspirante.idLugarResidencia = defectoMunicipio;
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
                        if (inscripcionControl.nuevaInscripcion.informacionAdicional === null ||
                            inscripcionControl.nuevaInscripcion.informacionAdicional === undefined) {
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoTieneHijo = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoEnfermedad = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoDiscapacidad = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoSisben = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoGrupoEtnico = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoVotoEleccion = false;
                            inscripcionControl.nuevaInscripcion.informacionAdicional.estadoLabora = false;
                        }
                        localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                        swal.closeModal();
                        swal({
                            title: appGenericConstant.VERIFICACION_EXITOSA,
                            text: '' + data.message === null ? 'ok' : appGenericConstant.VERIFICACION_ESTUDIANTE,
                            type: appGenericConstant.SUCCESS
                        });
                        $location.path("/inscripcion-cud");
                    } else {
                        inscripcionControl.lstinscripcionestemps = data.objectResponse;
                        inscripcionControl.visible.institucion = true;
                        if (inscripcionControl.nuevaInscripcion.informacionAdicional === null || inscripcionControl.nuevaInscripcion.informacionAdicional === undefined) {
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
                        $location.path("/inscripcion-temp");
                        localStorageService.set('listainscripciones', inscripcionControl.lstinscripcionestemps);
                        swal.closeModal();
                        swal({
                            title: appGenericConstant.VERIFICACION_EXITOSA,
                            text: '' + data.message === null ? 'ok' : appGenericConstant.VERIFICACION_ESTUDIANTE,
                            type: appGenericConstant.SUCCESS
                        });
                        localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                    }
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
        inscripcionControl.onIniciarInscripcion = function () {
            $location.path("/inscripcion-cud");
        };

        inscripcionControl.onIrWizarInscripcion = function () {
            var solicitudDTOAux = {
                idAspirante: inscripcionControl.nuevaInscripcion.idAspirante,
                idPrograma: inscripcionControl.nuevaInscripcion.idPrograma,
                idPeriodoAcademico: inscripcionControl.nuevaInscripcion.idPeriodoAcademico
            };

            if(inscripcionControl.infopersonal === null || typeof solicitudDTOAux.idAspirante === "undefined"){
                inscripcionControl.infopersonal = {};
            }

            if (new ValidationService().checkFormValidity($scope.formwizardmediodifusion)) {
                if (inscripcionControl.nuevaInscripcion.idMedioDifusion === 173) {
                    inscripcionControl.infopersonal.idMedioDifusion = inscripcionControl.nuevaInscripcion.idMedioDifusion;
                    inscripcionControl.infopersonal.otroMedioDifusion = null;
                } else {
                    inscripcionControl.infopersonal.idMedioDifusion = inscripcionControl.nuevaInscripcion.idMedioDifusion;
                    inscripcionControl.infopersonal.otroMedioDifusion = inscripcionControl.nuevaInscripcion.otroMedioDifusion;
                }
            } else {
                estadovalido = true;
            }

            if (new ValidationService().checkFormValidity($scope.formcudinscripcion)) {
                if (solicitudDTOAux.idAspirante === null || typeof solicitudDTOAux.idAspirante === "undefined") {
                    localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                    $location.path("/inscripcion-wizard");
                } else {
                    inscripcionService.verificarEstadoInscritoAspirante(solicitudDTOAux).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            return;
                        } else {
                            localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                            $location.path("/inscripcion-wizard");
                        }
                    }).catch(function (e) {
                        return;
                    });
                }
            }
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
        inscripcionControl.onClickStep = function (item) {
            if (item === 'active1') {
                inscripcionControl.visible.desctivarbotonatras = true;
                inscripcionControl.visible.botoncambio = false;

                inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
                inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;

                inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.working;

                if (inscripcionControl.estadopasos.paso2 === inscripcionControl.modowizard.complete) {
                    inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                }

                //inscripcionControl.onGuardarInformacionPersonal();
                return;
            }
            if (item === 'active2') {
                inscripcionControl.visible.botoncambio = true;
                //inscripcionControl.onGuardarInformacionPersonal();
                return;
            }
        };


        inscripcionControl.onContinuar = function () {
            if (inscripcionControl.visible.activetabstep1 === appGenericConstant.ACTIVO) {
                inscripcionControl.onGuardarInformacionPersonal();
                return;
            }

            if (inscripcionControl.visible.activetabstep2 === appGenericConstant.ACTIVO) {
              //  inscripcionControl.onGuardarInformacionAcademica();
                inscripcionControl.onGuardarInformacionFamiliar();
                //return;
            }

        };

        inscripcionControl.onAtras = function () {

            if (inscripcionControl.visible.activetabstep2 === appGenericConstant.ACTIVO) {
                inscripcionControl.visible.desctivarbotonatras = false;
                inscripcionControl.visible.botoncambio = false;
                inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
                inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
                inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.working;
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                return;
            }
            if (inscripcionControl.visible.activetabstep1 === appGenericConstant.ACTIVO) {
                inscripcionControl.visible.desctivarbotonatras = false;
                inscripcionControl.visible.botoncambio = false;
                inscripcionControl.visible.activetabstep1 = appGenericConstant.ACTIVO;
                inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
                inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.working;
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                return;
            }
        };

        /*--- FIN: wizard --*/
        inscripcionControl.onGuardarInformacionPersonal = function () {
            if (inscripcionControl.nuevaInscripcion.informacionAcademica !== null) {

                    inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion = null;

                    inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion = null;

            }
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
                        userName: localStorageService.get("usuario").username
                    },
                    informacionAcademica: inscripcionControl.nuevaInscripcion.informacionAcademica,
                    informacionReferencia: inscripcionControl.nuevaInscripcion.informacionReferencia,
                    informacionAdicional: inscripcionControl.nuevaInscripcion.informacionAdicional,
                    estadoInscripcion: "PRE_INSCRITO",
                    idModalidad: inscripcionControl.nuevaInscripcion.idModalidad,
                    idHorario: inscripcionControl.nuevaInscripcion.idHorario,
                    idAlianza: inscripcionControl.nuevaInscripcion.idAlianza,
                    idSeccional: inscripcionControl.nuevaInscripcion.idSeccional,
                    idMedioDifusion: inscripcionControl.nuevaInscripcion.idMedioDifusion,
                    otroMedioDifusion: inscripcionControl.nuevaInscripcion.otroMedioDifusion,
                    //idMedioDifusion: inscripcionControl.nuevaInscripcion.aspirante.idMedioDifusion,
                    //otroMedioDifusion: inscripcionControl.nuevaInscripcion.aspirante.otroMedioDifusion,
                    booleanGuardar: false
                };

                inscripcionService.registrarInscripcion(inscripcionControl.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        return;
                    }
                    inscripcionControl.infopersonal.id = data.objectResponse.idSolicitud;
                    inscripcionControl.infopersonal.idAspirante = data.objectResponse.idAspirante;
                    inscripcionControl.infopersonal.aspirante.id = data.objectResponse.idAspirante;
                    inscripcionControl.nuevaInscripcion.id = data.objectResponse.idSolicitud;
                    inscripcionControl.nuevaInscripcion.idAspirante = data.objectResponse.idAspirante;
                    inscripcionControl.nuevaInscripcion.aspirante.id = data.objectResponse.idAspirante;
                    inscripcionControl.nuevaInscripcion.informacionAcademica.id = data.objectResponse.idInfoAcademica;
                    inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion = $filter('date')(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion, 'dd/MM/yyyy');
                    inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion = $filter('date')(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion, 'dd/MM/yyyy');
                    inscripcionControl.nuevaInscripcion.informacionReferencia.id = data.objectResponse.idInfoReferencia;
                    inscripcionControl.nuevaInscripcion.informacionAdicional.id = data.objectResponse.idInfoAdicional;
                    inscripcionControl.visible.desctivarbotonatras = false;
                    inscripcionControl.visible.activetabstep1 = appGenericConstant.ESPACIO;
                    inscripcionControl.visible.activetabstep2 = appGenericConstant.ACTIVO;
                    inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.complete;
                    inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.working;
                    inscripcionControl.estadopasos.paso1 = inscripcionControl.modowizard.complete;
                    localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                    localStorageService.set('visible', inscripcionControl.visible);
                    localStorageService.set('estadopasos', inscripcionControl.estadopasos);
                    localStorageService.set('infopersonal', inscripcionControl.infopersonal);
                }).catch(function (e) {
                    return;
                });
            }
        };

        inscripcionControl.onGuardarInformacionAcademica = function () {
            inscripcionControl.visible.validaaniofinalizacion = false;
            inscripcionControl.visible.validaaniopresentacion = false;
            inscripcionControl.visible.validainstitucion = false;

            var estado = false;
            if (!new ValidationService().checkFormValidity($scope.formwizaracademica)) {
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.error;
                estado = true;
                return;
            }
            if (estado === true) {
                return;
            }
            inscripcionControl.infopersonal.informacionAcademica = {
                id: inscripcionControl.infopersonal.informacionAcademica.id,
                idInstitucion: inscripcionControl.nuevaInscripcion.informacionAcademica.idInstitucion,
                fechaCulminacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion),
                tituloObtenido: inscripcionControl.nuevaInscripcion.informacionAcademica.tituloObtenido,
                fechaPresentacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion),
                numeroRegistro: inscripcionControl.nuevaInscripcion.informacionAcademica.numeroRegistro
            };
          inscripcionControl.infopersonal.estadoInscripcion = "PRE_INSCRITO";
          inscripcionService.registrarInscripcion(inscripcionControl.infopersonal).then(function (data) {
                if (data.tipo !== 200) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    return;
                }
                inscripcionControl.infopersonal.id = data.objectResponse.idSolicitud;
                inscripcionControl.infopersonal.idAspirante = data.objectResponse.idAspirante;
                inscripcionControl.infopersonal.aspirante.id = data.objectResponse.idAspirante;
                inscripcionControl.nuevaInscripcion.id = data.objectResponse.idSolicitud;
                inscripcionControl.nuevaInscripcion.idAspirante = data.objectResponse.idAspirante;
                inscripcionControl.nuevaInscripcion.aspirante.id = data.objectResponse.idAspirante;
                inscripcionControl.infopersonal.informacionAcademica.id = data.objectResponse.idInfoAcademica;
                inscripcionControl.infopersonal.informacionReferencia.id = data.objectResponse.idInfoReferencia;
                inscripcionControl.infopersonal.informacionAdicional.id = data.objectResponse.idInfoAdicional;
                inscripcionControl.nuevaInscripcion.informacionAcademica.id = data.objectResponse.idInfoAcademica;
                inscripcionControl.nuevaInscripcion.informacionReferencia.id = data.objectResponse.idInfoReferencia;
                inscripcionControl.nuevaInscripcion.informacionAdicional.id = data.objectResponse.idInfoAdicional;
                inscripcionControl.visible.desctivarbotonatras = false;
                inscripcionControl.visible.activetabstep1 = appGenericConstant.ESPACIO;
                inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
                inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.complete;
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                inscripcionControl.estadopasos.paso1 = inscripcionControl.modowizard.complete;
                inscripcionControl.estadopasos.paso2 = inscripcionControl.modowizard.complete;
                localStorageService.set('inscripcion', inscripcionControl.nuevaInscripcion);
                localStorageService.set('visible', inscripcionControl.visible);
                localStorageService.set('estadopasos', inscripcionControl.estadopasos);
                localStorageService.set('infopersonal', inscripcionControl.infopersonal);
            }).catch(function (e) {
                return;
            });

        };


        inscripcionControl.onGuardarInformacionFamiliar = function () {
            var formmain = true;
            var tabacudiente = true;

          inscripcionControl.visible.validaaniofinalizacion = false;
          inscripcionControl.visible.validaaniopresentacion = false;
          inscripcionControl.visible.validainstitucion = false;

          var estado = false;
          if (!new ValidationService().checkFormValidity($scope.formwizaracademica)) {
            inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.error;
            estado = true;
            return;
          }
          if (estado === true) {
            return;
          }
          inscripcionControl.infopersonal.informacionAcademica = {
            id: inscripcionControl.infopersonal.informacionAcademica.id,
            idInstitucion: inscripcionControl.nuevaInscripcion.informacionAcademica.idInstitucion,
            fechaCulminacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaCulminacion),
            tituloObtenido: inscripcionControl.nuevaInscripcion.informacionAcademica.tituloObtenido
           // fechaPresentacion: onToDateString(inscripcionControl.nuevaInscripcion.informacionAcademica.fechaPresentacion)
           // numeroRegistro: inscripcionControl.nuevaInscripcion.informacionAcademica.numeroRegistro
          };

            if (!new ValidationService().checkFormValidity($scope.formwizarfamiliar1)) {
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.error;
                formmain = false;
            }
            if (!new ValidationService().checkFormValidity($scope.$$childHead.formwizardinscripcionTabsInfoFamiliar)) {
                inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.error;
                tabacudiente = false;
            }
            if ((tabacudiente) && formmain) {

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
                inscripcionControl.infopersonal.informacionReferencia = {
                    id: inscripcionControl.infopersonal.informacionReferencia.id,
                    idAcudiente: inscripcionControl.nuevaInscripcion.informacionReferencia.idAcudiente,
                    infoAcudiente: objInfoAcudiente,
                    cantidadHermano: inscripcionControl.nuevaInscripcion.informacionReferencia.cantidadHermano,
                    posicionHermano: inscripcionControl.nuevaInscripcion.informacionReferencia.posicionHermano
                };

                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                inscripcionControl.infopersonal.estadoInscripcion = appGenericConstant.INSCRITO;
                inscripcionService.registrarInscripcion(inscripcionControl.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        return;
                    }
                    inscripcionControl.infopersonal.id = data.objectResponse.idSolicitud;
                    inscripcionControl.infopersonal.idAspirante = data.objectResponse.idAspirante;
                    inscripcionControl.infopersonal.aspirante.id = data.objectResponse.idAspirante;
                    inscripcionControl.infopersonal.informacionAcademica.id = data.objectResponse.idInfoAcademica;
                    inscripcionControl.infopersonal.informacionReferencia.id = data.objectResponse.idInfoReferencia;
                    inscripcionControl.infopersonal.informacionAdicional.id = data.objectResponse.idInfoAdicional;
                    localStorageService.set('responsedata', data.objectResponse);
                    inscripcionControl.visible.desctivarbotonatras = false;
                    inscripcionControl.visible.botoncambio = true;
                    inscripcionControl.visible.activetabstep1 = appGenericConstant.ESPACIO;
                    inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
                    inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.complete;
                    inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                    inscripcionControl.estadopasos.paso1 = inscripcionControl.modowizard.complete;
                    inscripcionControl.estadopasos.paso2 = inscripcionControl.modowizard.complete;

                    swal({
                        title: appGenericConstant.INSCRIPCION_EXITOSA,
                        text: appGenericConstant.INSCRIPCION_GUARDADA,
                        type: appGenericConstant.SUCCESS
                    });
                    localStorageService.set('inscripcion', null);
                    localStorageService.set('visible', null);
                    localStorageService.set('estadopasos', null);
                    localStorageService.set('infopersonal', null);
                    inscripcionControl.onLimpiar();
                    $location.path("/inscripcion");
                }).catch(function (e) {
                    return;
                });
            }
        };

        inscripcionControl.onGuardarOtraInformacion = function () {
            inscripcionControl.visible.validoempresa = false;
            inscripcionControl.visible.validocargo = false;
            inscripcionControl.visible.validotiempolaborado = false;
            inscripcionControl.visible.validomediodifusion = false;
            var estadovalido = false;
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
                id: inscripcionControl.infopersonal.informacionAdicional.id,
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
                tiempoLaborado: inscripcionControl.nuevaInscripcion.informacionAdicional.tiempoLaborado
            };
            if (estadovalido === true) {
                return;
            }
            if (!estadovalido) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                inscripcionControl.infopersonal.estadoInscripcion = appGenericConstant.INSCRITO;
                inscripcionService.registrarInscripcion(inscripcionControl.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }
                    inscripcionControl.infopersonal.id = data.objectResponse.idSolicitud;
                    inscripcionControl.infopersonal.idAspirante = data.objectResponse.idAspirante;
                    inscripcionControl.infopersonal.aspirante.id = data.objectResponse.idAspirante;
                    inscripcionControl.infopersonal.informacionAcademica.id = data.objectResponse.idInfoAcademica;
                    inscripcionControl.infopersonal.informacionReferencia.id = data.objectResponse.idInfoReferencia;
                    inscripcionControl.infopersonal.informacionAdicional.id = data.objectResponse.idInfoAdicional;
                    localStorageService.set('responsedata', data.objectResponse);
                    inscripcionControl.visible.desctivarbotonatras = false;
                    inscripcionControl.visible.activetabstep1 = appGenericConstant.ESPACIO;
                    inscripcionControl.visible.activetabstep2 = appGenericConstant.ESPACIO;
                    inscripcionControl.visible.workingstep1 = inscripcionControl.modowizard.complete;
                    inscripcionControl.visible.workingstep2 = inscripcionControl.modowizard.complete;
                    swal({
                        title: appGenericConstant.INSCRIPCION_EXITOSA,
                        text: appGenericConstant.INSCRIPCION_GUARDADA,
                        type: appGenericConstant.SUCCESS
                    });
                    localStorageService.set('inscripcion', null);
                    localStorageService.set('visible', null);
                    localStorageService.set('estadopasos', null);
                    localStorageService.set('infopersonal', null);
                    inscripcionControl.onLimpiar();
                    $location.path("/inscripcion");
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
        };

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

            $("#modalPais").hide();

        };

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

            $("#modallugarnacimiento").hide();

        };

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

            $("#modallugarrecidencia").hide();

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
            $("#modallugarrecidenciaacudiente").hide();
        };
        inscripcionControl.ejecutarConsultarTiposConvenios = function () {
            inscripcionService.consultarTipoConvenio().then(function (data) {
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
        inscripcionControl.ejecutarConsultarAlianzas = function () {
            inscripcionService.consultarAlianza().then(function (data) {
                inscripcionControl.alianzas = [];
                angular.forEach(data, function (value) {
                    var alianza = {
                        id: value.id,
                        nombre: value.nombre,
                        nit: value.nit
                    };
                    inscripcionControl.alianzas.push(alianza);
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

        inscripcionControl.onFiltrarProgramaPorNivelFormacion = function (item, item2,item3) {
            appConstant.MSG_LOADING('Cargando datos. Espera un momento...');
            if (item !== null && item2 !== null) {
                appConstant.CARGANDO();
                inscripcionService.consultarProgramaNivelFormacion(item, item2, item3).then(function (data) {
                    inscripcionControl.programas = [];
                    if (data !== null && data.tipo !== 500) {
                        angular.forEach(data, function (value) {
                            var programa = {
                                id: value.id,
                                nombrePrograma: value.nombrePrograma,
                                modalidades: value.idModalidades,
                                horarios: value.idHorarios
                            };
                            inscripcionControl.programas.push(programa);
                        });
                    }
                    appConstant.CERRAR_SWAL();
                    if (inscripcionControl.programas.length === 0) {
                        inscripcionControl.visible.esvacialistaprograma = true;
                    } else {
                        inscripcionControl.visible.esvacialistaprograma = false;
                    }
                }).catch(function (e) {
                    inscripcionControl.programas = [];
                    inscripcionControl.visible.esvacialistaprograma = true;
                    //throw e;
                    return;
                });
            } else {
                appConstant.CERRAR_SWAL();
            }
        };

        inscripcionControl.onChangeSelectPrograma = function () {
            if (typeof inscripcionControl.nuevaInscripcion.programaDTO === 'undefined'
                    || inscripcionControl.nuevaInscripcion.programaDTO === null) {
                inscripcionControl.visible.disableSelectModalidad = true;
                inscripcionControl.visible.disableSelectHorario = true;
                inscripcionControl.nuevaInscripcion.idModalidad = null;
                inscripcionControl.nuevaInscripcion.idHorario = null;
                inscripcionControl.nuevaInscripcion.horarioDTO = null;
                inscripcionControl.nuevaInscripcion.modalidadDTO = null;
                inscripcionControl.nuevaInscripcion.idPrograma = null;
            } else {

                if (inscripcionControl.nuevaInscripcion.idNivelFormacion === 3) {
                    inscripcionService.buscarConfiguracionByProgramaAndPeriodoAcademico(inscripcionControl.nuevaInscripcion.programaDTO.id, inscripcionControl.nuevaInscripcion.idPeriodoAcademico).then(function (data) {
                        if (data.length === 0) {
                            inscripcionControl.nuevaInscripcion.programaDTO = null;
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EDUCACION_NO_CONTINUADA);
                            inscripcionControl.visible.disableSelectModalidad = true;
                            inscripcionControl.visible.disableSelectHorario = true;
                            inscripcionControl.nuevaInscripcion.horarioDTO = null;
                            inscripcionControl.nuevaInscripcion.modalidadDTO = null;
                            inscripcionControl.nuevaInscripcion.idModalidad = null;
                            inscripcionControl.nuevaInscripcion.idHorario = null;

                            return;
                        } else {
                            inscripcionControl.onChangeProgramaDisabled();
                        }
                    }).catch(function (e) {
                        return;
                    });
                } else {
                    inscripcionControl.onChangeProgramaDisabled();
                }
            }
        };

        inscripcionControl.onChangeProgramaDisabled = function () {
            inscripcionControl.nuevaInscripcion.idPrograma = inscripcionControl.nuevaInscripcion.programaDTO.id;
            inscripcionControl.visible.disableSelectModalidad = false;
            inscripcionControl.visible.disableSelectHorario = false;
            inscripcionControl.nuevaInscripcion.horarioDTO = null;
            inscripcionControl.nuevaInscripcion.modalidadDTO = null;
            inscripcionControl.nuevaInscripcion.idModalidad = null;
            inscripcionControl.nuevaInscripcion.idHorario = null;
        }


        inscripcionControl.onChangeSelectModalidad = function () {
            if (typeof inscripcionControl.nuevaInscripcion.modalidadDTO === 'undefined') {
                inscripcionControl.visible.disableSelectHorario = true;
                inscripcionControl.nuevaInscripcion.horarioDTO = null;
                inscripcionControl.nuevaInscripcion.idHorario = null;

            } else {
                inscripcionControl.nuevaInscripcion.idModalidad = inscripcionControl.nuevaInscripcion.modalidadDTO.id;
                inscripcionControl.visible.disableSelectHorario = false;
                var idListAux;
                inscripcionControl.lsthorario = [];
                inscripcionControl.nuevaInscripcion.horarioDTO = null;
                inscripcionControl.nuevaInscripcion.idHorario = null;

                angular.forEach(inscripcionControl.lsthorarioAux, function (value) {
                    idListAux = value.id;
                    angular.forEach(inscripcionControl.horariosListAuxListaValor, function (value) {
                        if ((inscripcionControl.nuevaInscripcion.modalidadDTO.id).toString() === value.referencia) {
                            if (idListAux === value.id) {
                                var horario = {
                                    id: value.id,
                                    nombreHorario: value.nombre
                                };
                                inscripcionControl.lsthorario.push(horario);
                                angular.break;
                            }
                        }
                    });
                });
            }
        };

        inscripcionControl.onChangeSelectHorario = function () {
            if (typeof inscripcionControl.nuevaInscripcion.horarioDTO === 'undefined') {
                inscripcionControl.nuevaInscripcion.idHorario = null;
            } else {
                inscripcionControl.nuevaInscripcion.idHorario = inscripcionControl.nuevaInscripcion.horarioDTO.id;
            }
        };

        inscripcionControl.onChangeSelectAlianza = function () {
            if (typeof inscripcionControl.nuevaInscripcion.alianzaDTO === 'undefined') {
                inscripcionControl.nuevaInscripcion.idAlianza = null;
            } else {
                inscripcionControl.nuevaInscripcion.idAlianza = inscripcionControl.nuevaInscripcion.alianzaDTO.id;
            }
        };

        inscripcionControl.onFiltrarModalidadYHorarioPorPorgrama = function (item) {
            inscripcionControl.lstmodalidad = [];
            inscripcionControl.lsthorarioAux = [];
            inscripcionControl.nuevaInscripcion.modalidadDTO = null;
            inscripcionControl.nuevaInscripcion.horarioDTO = null;
            inscripcionControl.visible.disableSelectHorario = true;
            angular.forEach(item.modalidades, function (value) {
                var modalidad = {
                    id: value.id,
                    nombreModalidad: value.nombreModalidad
                };
                inscripcionControl.lstmodalidad.push(modalidad);
            });
            angular.forEach(item.horarios, function (value) {
                var horario = {
                    id: value.id,
                    nombreHorario: value.nombreHorario
                };
                inscripcionControl.lsthorarioAux.push(horario);
            });
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
            inscripcionService.consultarAllBarrios().then(function (data) {
                inscripcionControl.lstbarrios = [];
                inscripcionControl.lstbarrios = data;
            }).catch(function (e) {
                return;
            });
        };
        inscripcionControl.ejecutarConsultarPais = function () {
            inscripcionService.consultarPais().then(function (data) {
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
        inscripcionControl.ejecutarConsultarNivelFormacionPorPrograma = function () {
            if (typeof inscripcionControl.nuevaInscripcion.idNivelFormacion === 'undefined') {
                inscripcionControl.nuevaInscripcion.idNivelFormacion = null;
            }
            if (inscripcionControl.nuevaInscripcion.idNivelFormacion !== null) {
                inscripcionService.consultarProgramaNivelFormacion(inscripcionControl.nuevaInscripcion.idNivelFormacion).then(function (data) {
                    inscripcionControl.programas = [];
                    angular.forEach(data, function (value) {
                        var programa = {
                            id: value.id,
                            nombrePrograma: value.nombrePrograma,
                            modalidades: value.idModalidades,
                            horarios: value.idHorarios
                        };
                        inscripcionControl.programas.push(programa);
                    });
                }).catch(function (e) {
                    inscripcionControl.programas = [];
                });
            }
        };

        inscripcionControl.ejecutarConsultarPrograma = function () {
            inscripcionService.consultarPrograma().then(function (data) {
                inscripcionControl.programas = [];
                inscripcionControl.programas = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarNivelFormacion = function () {
            inscripcionService.consultarNivelFormacion().then(function (data) {
                inscripcionControl.nivelesformacion = [];
                inscripcionControl.nivelesformacion = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecturarConsultarHorario = function () {
            inscripcionControl.horariosListAuxListaValor = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value) {
                    var horario = {
                        id: value.codigo,
                        nombre: value.valor,
                        referencia: value.referencia
                    };
                    inscripcionControl.horariosListAuxListaValor.push(horario);
                });
            }).catch(function (e) {
                return;
            });
        };
        inscripcionControl.ejecturarConsultarHorarioSedes = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO_MEDELLIN, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value) {
                    var horario = {
                        id: value.codigo,
                        nombre: value.valor,
                        referencia: value.referencia
                    };
                    inscripcionControl.horariosListAuxListaValor.push(horario);
                });
            }).catch(function (e) {
                return;
            });
        };

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
                //inscripcionControl.nuevaInscripcionInicial.identificacionAspirante.idTipoIdentificacion = 71; //valor default
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.findsede = function () {
            utilServices.getSedes().then(function (data) {
                inscripcionControl.sedes = data;
            }).catch(function (e) {
                return;
            });
        };
        inscripcionControl.findCursos = function () {
            utilServices.getCursos(inscripcionControl.nuevaInscripcionInicialV2.sede.id,
              inscripcionControl.nuevaInscripcionInicialV2.periodo.id).then(function (data) {
                inscripcionControl.cursos = data;
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
            inscripcionService.consultarSeccional().then(function (data) {
                inscripcionControl.seccionales = [];
                inscripcionControl.seccionales = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarInstituciones = function () {
            inscripcionService.consultarColegio().then(function (data) {
                inscripcionControl.instituciones = [];
                inscripcionControl.instituciones = data;
            }).catch(function (e) {
                return;
            });
        };

        inscripcionControl.ejecutarConsultarAllModalidadesxPrograma = function () {
            if (typeof inscripcionControl.nuevaInscripcion.idPrograma === 'undefined') {
                inscripcionControl.nuevaInscripcion.idPrograma = null;
            }
            if (inscripcionControl.nuevaInscripcion.idPrograma !== null) {
                inscripcionService.consultarAllModalidadesxPrograma(inscripcionControl.nuevaInscripcion.idPrograma).then(function (data) {
                    inscripcionControl.lstmodalidad = [];
                    angular.forEach(data, function (value) {
                        var modalidad = {
                            id: value.id,
                            nombreModalidad: value.nombreModalidad
                        };
                        inscripcionControl.lstmodalidad.push(modalidad);
                    });
                }).catch(function (e) {

                    return;
                });
            }
        };

        inscripcionControl.ejecutarConsultarAllHorariosxProgramaxModalidad = function () {
            if (typeof inscripcionControl.nuevaInscripcion.idPrograma === 'undefined') {
                inscripcionControl.nuevaInscripcion.idPrograma = null;
            }
            if (inscripcionControl.nuevaInscripcion.idPrograma !== null) {
                inscripcionService.consultarAllHorariosxProgramaxModalidad(inscripcionControl.nuevaInscripcion.idPrograma).then(function (data) {
                    inscripcionControl.lsthorario = [];
                    angular.forEach(data, function (value) {
                        var horario = {
                            id: value.id,
                            nombreHorario: value.nombreHorario
                        };
                        inscripcionControl.lsthorario.push(horario);
                    });
                }).catch(function (e) {

                    return;
                });
            }
        };

        inscripcionControl.ejecutarConsultarNivelEducativo();
        inscripcionControl.ejecutarConsultarTipoDocumentos();
        inscripcionControl.ejecutarConsultarEstadoCivil();
        inscripcionControl.ejecutarConsultarGenero();
        inscripcionControl.ejecutarConsultarGrupoSanguineo();
        inscripcionControl.ejecutarConsultarSeccional();
        inscripcionControl.ejecutarConsultarNivelFormacion();
        inscripcionControl.ejecutarConsultarTiposConvenios();
        inscripcionControl.ejecutarConsultarAlianzas();
        inscripcionControl.ejecutarConsultarPais();
        inscripcionControl.ejecutarConsultarInstituciones();
        inscripcionControl.ejecutarConsultarTipoViviendas();
        inscripcionControl.ejecutarConsultarContratosSocioEconomicos();
        //inscripcionControl.ejecutarConsultarBarriosxMunicipios();
        inscripcionControl.ejecutarConsultarTodosBarrios();
        inscripcionControl.ejecutarConsultarMediosDifusion();
        inscripcionControl.ejecturarConsultarHorario();
        inscripcionControl.ejecturarConsultarHorarioSedes();
        inscripcionControl.ejecutarConsultarNivelFormacionPorPrograma();
        inscripcionControl.ejecutarConsultarPeriodoAcademico();
        inscripcionControl.ejecutarConsultarAllModalidadesxPrograma();
        inscripcionControl.ejecutarConsultarAllHorariosxProgramaxModalidad();
        inscripcionControl.findsede();
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

            if(dateStr.contain('/')){
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
            }else{
                dateStr.convertStringtoDate();
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
            inscripcionService.consultarDepartamentoPais(item).then(function (data) {
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
            inscripcionService.consultarMunicipioPorDepartamento(item).then(function (data) {
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
            inscripcionService.consultarDepartamentoPais(item).then(function (data) {
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
            inscripcionService.consultarDepartamentoPais(item).then(function (data) {
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
            inscripcionService.consultarMunicipioPorDepartamento(item).then(function (data) {
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
            inscripcionService.consultarMunicipioPorDepartamento(item).then(function (data) {
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
    }

})();
