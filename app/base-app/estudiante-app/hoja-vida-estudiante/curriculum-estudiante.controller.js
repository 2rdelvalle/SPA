(function () {
    'use strict';
    angular.module('mytodoApp').controller('studentCurriculumCtrl', studentCurriculumCtrl);
    studentCurriculumCtrl.$inject = ['$scope', 'studentCurriculumService', '$http','cambioHorarioServices', 'ValidationService', '$location', 'localStorageService', 'utilServices', '$filter', '$timeout', 'appConstant', 'appGenericConstant', 'appConstantValueList'];
    function studentCurriculumCtrl($scope, studentCurriculumService, $http,cambioHorarioServices, ValidationService, $location, localStorageService, utilServices, $filter, $timeout, appConstant, appGenericConstant, appConstantValueList) {

        var updateStudent = this;
        var config = {};
        updateStudent.lstniveleducactivo = [];
        updateStudent.lsttipodocumentos = [];
        updateStudent.lstestadocivil = [];
        updateStudent.lstgenero = [];
        updateStudent.lstgruposanguineo = [];
        updateStudent.seccionales = [];
        updateStudent.nivelesformacion = [];
        updateStudent.programas = [];
        updateStudent.jornadas = [];
        updateStudent.convenios = [];
        updateStudent.instituciones = [];
        updateStudent.periodosAcademicos = [];
        updateStudent.lstpais = [];
        updateStudent.lstbarrios = [];
        updateStudent.lstmediodifusion = [];
        updateStudent.lstdepartamentos = [];
        updateStudent.listmunicipios = [];
        updateStudent.lgexplstpais = [];
        updateStudent.lgexplstdepartamentos = [];
        updateStudent.lgexplstmunicipios = [];
        updateStudent.lgnacimtolstpais = [];
        updateStudent.lgnacimtolstdepartamentos = [];
        updateStudent.lgnacimtolstmunicipios = [];
        updateStudent.lgrecidencialstpais = [];
        updateStudent.lgrecidencialstdepartamentos = [];
        updateStudent.lgrecidencialstmunicipios = [];
        updateStudent.lsttipovivienda = [];
        updateStudent.lstcontratoseconomicos = [];
        updateStudent.lstinscripcionestemps = [];
        updateStudent.lstmodalidad = [];
        updateStudent.lsthorario = [];
        updateStudent.nuevaInscripcion = studentCurriculumService.inscripcion;
        updateStudent.nuevaInscripcion.aspirante = studentCurriculumService.inscripcionInicial;
        updateStudent.modowizard = studentCurriculumService.modowizard;
        updateStudent.estadopasos = studentCurriculumService.estadopasos;
        updateStudent.infopersonal = studentCurriculumService.infopersonal;
        updateStudent.visible = studentCurriculumService.visible;
        updateStudent.nuevaInscripcion.celular;
        updateStudent.nuevaInscripcion.idEstadoCivil;
        updateStudent.nuevaInscripcion.idGrupoSanguineo;
        updateStudent.nuevaInscripcion.identificacionAspirante = {};
        updateStudent.nuevaInscripcion.identificacionAspirante.idTipoIdentificacion = null;
        updateStudent.nuevaInscripcion.identificacionAspirante.identificacion = null;
        updateStudent.nuevaInscripcion.identificacion=null;
        updateStudent.nuevaInscripcion.idTipoIdentificacionConsulta = null;
        updateStudent.nuevaInscripcion.identificacionConsulta = null;
        updateStudent.options = appConstant.FILTRO_TABLAS;
        updateStudent.selectedOption = updateStudent.options[0];
        updateStudent.soloInscripcion = studentCurriculumService.botonVolver;
        updateStudent.habilitarTabs = true;
        localStorageService.set('responsedata', null);
        updateStudent.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
        ];

        updateStudent.disabledConsultar = true;
        updateStudent.foto = null;
        updateStudent.timestamp = new Date().getTime();
        var fecha;

        if (localStorageService.get('visible') !== null) {
            var visible = localStorageService.get('visible');
            updateStudent.visible = visible;
            updateStudent.visible.validotelefonopadre = false;
            updateStudent.visible.validocelularpadre = false;
            updateStudent.visible.validotelefonopadresize = false;
            updateStudent.visible.validocelularpadresize = false;
            updateStudent.visible.validotelefonomadre = false;
            updateStudent.visible.validocelularmadre = false;
            updateStudent.visible.validocelularmadresize = false;
            updateStudent.visible.validotelefonomadresize = false;
            updateStudent.visible.validotelefonoacudiente = false;
            updateStudent.visible.validocelularacudiente = false;
            updateStudent.visible.validotelefonoacudientesize = false;
            updateStudent.visible.validocelularacudientesize = false;
        }

        updateStudent.nuevaInscripcion.tipodocumento = null;
        updateStudent.nuevaInscripcion.estado = "no";
        if (updateStudent.nuevaInscripcion.informacionAdicional !== null && updateStudent.nuevaInscripcion.informacionAdicional !== undefined) {
            if (updateStudent.nuevaInscripcion.informacionAdicional.id === null || updateStudent.nuevaInscripcion.informacionAdicional.id === undefined) {
                updateStudent.nuevaInscripcion.informacionAdicional = {
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
      $scope.$watch('inspCtrl.foto', function(newValue, oldValue) {
        if (newValue !== oldValue) {
          updateStudent.timestamp = new Date().getTime();
        }
      });

      //subir fotos docente
      updateStudent.uploadPhoto = function (file) {
        appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
        appConstant.CARGANDO();
        updateStudent.itemFoto = [];
        var urlRequest = 'api/auth/foto/upload/public';
        var fd = new FormData();
        fd.append('file', file);
        fd.append('student', true);
        fd.append('documento', updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.identificacion);

        $http.post(urlRequest, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).success(function (response) {
        }).error(function () {
        });
        studentCurriculumService.getFuncionario(updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.identificacion).then(function (info) {
          setTimeout(function() {
            window.location.reload();
          }, 5000);
          updateStudent.foto = info.idFoto;
        });
      };

        updateStudent.ChangeTabs = function (idTab) {
            $("#tab-example-1").css("display", idTab === 1 ? 'initial' : 'none');
            $("#tab-example-3").css("display", idTab === 3 ? 'initial' : 'none');
            $("#tab-example-4").css("display", idTab === 4 ? 'initial' : 'none');


            $("#tab-1").css("background-color", idTab === 1 ? '#009fc1' : 'white');
            $("#tab-3").css("background-color", idTab === 3 ? '#009fc1' : 'white');
            $("#tab-4").css("background-color", idTab === 4 ? '#009fc1' : 'white');
        };

        function revalidate(elementName) {
            $scope.$broadcast('angularValidation.revalidate', elementName);
        }
        function init() {
            updateStudent.identificacion = "";

            if (localStorageService.get('usuario') !== null) {
                var codigoEstudiante = localStorageService.get('usuario');
                updateStudent.identificacion=codigoEstudiante.identificacion;
                updateStudent.idTipoIdentificacionConsulta = codigoEstudiante.idTipoDocumento
            }
            updateStudent.consultarEstudiante();
        }

        updateStudent.ejecutarConsultarPeriodoAcademico = function () {
            studentCurriculumService.consultarPeriodoAcademico().then(function (data) {
                updateStudent.periodosAcademicos = [];
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    updateStudent.periodosAcademicos.push(periodo);
                });
            }).catch(function (e) {
                return;
            });
        };


        //METODOS PARA ABRIR MODALES DE LUGARES
        updateStudent.onAbrirModalLugarFechaExpedicionCedula = function () {
            updateStudent.nuevaInscripcion.idPaisExpedicion = undefined;
            updateStudent.nuevaInscripcion.idDepartamentoExpedicion = undefined;
            updateStudent.nuevaInscripcion.idLugarExpedicionDocumento = undefined;
            updateStudent.onMostrarModalLugares('modalLugarFechaExpedicion');
        };

        updateStudent.onAbrirModalLugarNacimiento = function () {
            updateStudent.nuevaInscripcion.idPaisNacimiento = undefined;
            updateStudent.nuevaInscripcion.idDepartamentoNacimiento = undefined;
            updateStudent.nuevaInscripcion.idMunicipioNacimiento = undefined;
            updateStudent.onMostrarModalLugares('modalLugarNacimiento');
        };

        updateStudent.onAbrirModalLugarResidencia = function () {
            updateStudent.nuevaInscripcion.idPaisResidencia = 4;
            updateStudent.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            updateStudent.nuevaInscripcion.idMunicipioRecidencia = undefined;

            updateStudent.onConsultarDepartoPorPaisLugarRecidencia(updateStudent.nuevaInscripcion.idPaisResidencia);
            updateStudent.onChangePaisRecidencia(updateStudent.nuevaInscripcion.idPaisResidencia);
            updateStudent.onMostrarModalLugares('modalLugarResidencia');
        };

        updateStudent.onAbrirModalLugarResidenciaPadre = function () {
            updateStudent.nuevaInscripcion.idPaisResidencia = undefined;
            updateStudent.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            updateStudent.nuevaInscripcion.idMunicipioRecidencia = undefined;
            updateStudent.onMostrarModalLugares('modalLugarResidenciaPadre');
        };

        updateStudent.onAbrirModalLugarResidenciaMadre = function () {
            updateStudent.nuevaInscripcion.idPaisResidencia = undefined;
            updateStudent.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            updateStudent.nuevaInscripcion.idMunicipioRecidencia = undefined;
            updateStudent.onMostrarModalLugares('modalLugarResidenciaMadre');
        };

        updateStudent.onAbrirModalLugarResidenciaAcudiente = function () {
            updateStudent.nuevaInscripcion.idPaisResidencia = undefined;
            updateStudent.nuevaInscripcion.idDepartamentoRecidencia = undefined;
            updateStudent.nuevaInscripcion.idMunicipioRecidencia = undefined;
            updateStudent.onMostrarModalLugares('modalLugarResidenciaAcudiente');
        };

        updateStudent.onMostrarModalLugares = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };
        updateStudent.consultarEstudiante = function () {
            appConstant.MSG_LOADING(appGenericConstant.VERIFICANDO_ASPIRANTE);
            appConstant.CARGANDO();

            updateStudent.cod = {
                identificacionAspirante: {
                    identificacion: updateStudent.identificacion,
                    idTipoIdentificacion: updateStudent.idTipoIdentificacionConsulta
                }
            };
            studentCurriculumService.consultarEstudiante(updateStudent.cod).then(function (data){
                updateStudent.item = {
                    identificacionAspirante: {
                        idTipoIdentificacion: updateStudent.cod.identificacionAspirante.idTipoIdentificacion,
                        identificacion: updateStudent.cod.identificacionAspirante.identificacion
                    }
                };
                updateStudent.consultarServiceAspirante(updateStudent.item);
            }).catch(function (e) {
                if (e.status === 409 && e.message === 'NO AUTORIZADO!!') {
                    appConstant.MSG_GROWL_ADVERTENCIA(e.message);
                    localStorageService.clearAll();
                }
                return;
            });
            appConstant.CERRAR_SWAL();

        };

        updateStudent.consultarServiceAspirante = function (item) {
            studentCurriculumService.consultarAspirante(updateStudent.item).then(function (data) {
                updateStudent.visible.validaseccional = false;
                updateStudent.visible.validanivelformacion = false;
                updateStudent.visible.validaprograma = false;
                updateStudent.visible.validatipoconvenio = false;
                updateStudent.visible.validajornada = false;

                if (data.objectResponse !== null) {
                    if (data.objectResponse !== null) {
                        updateStudent.nuevaInscripcion = null;
                        updateStudent.nuevaInscripcion = data.objectResponse;
                        appConstant.CERRAR_SWAL();
                        updateStudent.visible.institucion = true;
                        updateStudent.nuevaInscripcion.informacionAdicional = data.objectResponse.informacionAdicional;
                        updateStudent.nuevaInscripcion.informacionReferencia = data.objectResponse.informacionReferencia;
                        if (updateStudent.nuevaInscripcion.aspirante !== null) {
                            if (updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento === null
                                    || typeof updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento === "undefined") {
                                updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = appGenericConstant.CARTAGENA;
                            }
                            if (updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento === null
                                    || typeof updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento === "undefined") {
                                updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento = appGenericConstant.CARTAGENA;
                            }
                            if (updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia === null
                                    || typeof updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia === "undefined") {
                                updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia = appGenericConstant.CARTAGENA;
                            }
                            updateStudent.nuevaInscripcion.aspirante.fechaExpedicionDocumento = $filter('date')(data.objectResponse.aspirante.fechaExpedicionDocumento, 'dd/MM/yyyy');
                            updateStudent.nuevaInscripcion.aspirante.fechaNacimiento = $filter('date')(data.objectResponse.aspirante.fechaNacimiento, 'dd/MM/yyyy');
                            if (updateStudent.nuevaInscripcion.aspirante.idInstitucion !== null && updateStudent.nuevaInscripcion.aspirante.idInstitucion !== undefined) {
                                updateStudent.visible.institucion = true;
                            }
                        }
                      updateStudent.cargarFoto();
                        updateStudent.nuevaInscripcion.identificacionAspirante = updateStudent.item.identificacionAspirante.identificacion;
                        if (updateStudent.nuevaInscripcion.idSeccional !== null
                                || updateStudent.nuevaInscripcion.idNivelFormacion !== null) {
                            updateStudent.visible.estadobotonesinicio = true;
                        }
                        if (updateStudent.nuevaInscripcion.aspirante !== null) {
                            swal.closeModal();
                            updateStudent.visible.disableSelectPrograma = false;
                            updateStudent.visible.disableSelectModalidad = false;
                            updateStudent.visible.disableSelectHorario = false;
                            updateStudent.nuevaInscripcion.aspirante = data.objectResponse.aspirante;
                            if (updateStudent.nuevaInscripcion.aspirante.fechaNacimiento !== null) {
                                updateStudent.onCalcularEdad();
                            }
                            if (updateStudent.nuevaInscripcion.informacionReferencia === null) {
                                updateStudent.nuevaInscripcion.informacionReferencia = {};
                            }
                            if (updateStudent.nuevaInscripcion.informacionAdicional === null) {
                                updateStudent.nuevaInscripcion.informacionAdicional = {};
                            }
                            if (updateStudent.nuevaInscripcion.informacionReferencia.infoPadre === null
                                    || typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoPadre = {};
                            }
                            if (updateStudent.nuevaInscripcion.informacionReferencia.infoMadre === null
                                    || typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoMadre = {};
                            }
                            if (updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente === null
                                    || typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
                            }
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoPadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoMadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                        } else {
                            appConstant.CERRAR_SWAL();
                            updateStudent.visible.disableSelectPrograma = true;
                            updateStudent.visible.disableSelectModalidad = true;
                            updateStudent.visible.disableSelectHorario = true;
                            updateStudent.nuevaInscripcion.id = null;
                            updateStudent.nuevaInscripcion.aspirante = {};
                            updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion = updateStudent.nuevaInscripcion.identificacionAspirante.idTipoIdentificacion;
                            updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.identificacion = updateStudent.nuevaInscripcion.identificacionAspirante.identificacion;
                            updateStudent.nuevaInscripcion.informacionReferencia = {};
                            updateStudent.nuevaInscripcion.informacionReferencia.infoPadre = {};
                            updateStudent.nuevaInscripcion.informacionReferencia.infoMadre = {};
                            updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente = {};
                            updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = appGenericConstant.CARTAGENA;
                            updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento = appGenericConstant.CARTAGENA;
                            updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia = appGenericConstant.CARTAGENA;
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoPadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoMadre = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia === 'undefined') {
                                updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente = {
                                    identificacion: {},
                                    nombreResidencia: appGenericConstant.CARTAGENA
                                };
                            }
                            var defectoPais = appGenericConstant.PAIS_DEFECTO;
                            updateStudent.nuevaInscripcion.idPaisExpedicion = defectoPais;
                            updateStudent.nuevaInscripcion.idPaisNacimiento = defectoPais;
                            updateStudent.nuevaInscripcion.idPaisResidencia = defectoPais;
                            updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre = defectoPais;
                            updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre = defectoPais;
                            updateStudent.nuevaInscripcion.paisrecidenciaacudiente = defectoPais;
                            var defectoDepartamento = appGenericConstant.DEPARTAMENTO_DEFECTO;
                            updateStudent.nuevaInscripcion.idDepartamentoExpedicion = defectoDepartamento;
                            updateStudent.nuevaInscripcion.idDepartamentoNacimiento = defectoDepartamento;
                            updateStudent.nuevaInscripcion.idDepartamentoRecidencia = defectoDepartamento;
                            updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre = defectoDepartamento;
                            updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre = defectoDepartamento;
                            updateStudent.nuevaInscripcion.departamentorecidenciaacudiente = defectoDepartamento;
                            var defectoMunicipio = appGenericConstant.MUNICIPIO_DEFECTO;
                            updateStudent.nuevaInscripcion.aspirante.idLugarNacimiento = defectoMunicipio;
                            updateStudent.nuevaInscripcion.aspirante.idMunicipioExpedicion = defectoMunicipio;
                            updateStudent.nuevaInscripcion.aspirante.idLugarResidencia = defectoMunicipio;
                            updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaPadre = defectoMunicipio;
                            updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre = defectoMunicipio;
                            updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente = defectoMunicipio;
                            updateStudent.nuevaInscripcion.informacionReferencia.cantidadHermano = 0;
                            updateStudent.nuevaInscripcion.informacionReferencia.posicionHermano = 0;
                        }

                        if (updateStudent.nuevaInscripcion.informacionReferencia.cantidadHermano === null
                                || typeof updateStudent.nuevaInscripcion.informacionReferencia.cantidadHermano === 'undefined') {
                            updateStudent.nuevaInscripcion.informacionReferencia.cantidadHermano = 0;
                        }

                        if (updateStudent.nuevaInscripcion.informacionReferencia.posicionHermano === null
                                || typeof updateStudent.nuevaInscripcion.informacionReferencia.posicionHermano === 'undefined') {
                            updateStudent.nuevaInscripcion.informacionReferencia.posicionHermano = 0;
                        }
                        updateStudent.nuevaInscripcion.estado = "no";
                        if (updateStudent.nuevaInscripcion.informacionAdicional.id === null || updateStudent.nuevaInscripcion.informacionAdicional.id === undefined) {
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoTieneHijo = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoEnfermedad = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoDiscapacidad = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoSisben = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoGrupoEtnico = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoVotoEleccion = false;
                            updateStudent.nuevaInscripcion.informacionAdicional.estadoLabora = false;
                        }
                        swal.closeModal();

                    }
                    updateStudent.nuevaInscripcion.idTipoIdentificacionConsulta = null;
                    updateStudent.nuevaInscripcion.identificacionConsulta = null;
                    updateStudent.ChangeTabs(1);
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

        updateStudent.onChangeSeccional = function () {
            if (typeof updateStudent.nuevaInscripcion.idSeccional === 'undefined'
                    || updateStudent.nuevaInscripcion.idSeccional === null) {
                updateStudent.visible.validaseccional = true;
                return;
            }
        };
        updateStudent.onChangeJornada = function () {
            updateStudent.visible.validajornada = false;
            if (typeof updateStudent.nuevaInscripcion.idJornada === 'undefined' || updateStudent.nuevaInscripcion.idJornada === null) {
                updateStudent.visible.validajornada = true;
                return;
            }
        };
        updateStudent.onChangeTipoConvenio = function () {
            updateStudent.visible.validatipoconvenio = false;
            if (typeof updateStudent.nuevaInscripcion.idJornada === 'undefined' || updateStudent.nuevaInscripcion.idJornada === null) {
                updateStudent.visible.validajornada = true;
            }
        };
        updateStudent.onChangeSelectBarrio = function (item) {
            updateStudent.nuevaInscripcion.aspirante.cualBarrio = '';
            if (typeof item === 'undefined') {
                updateStudent.visible.validobarrio = true;
            } else {
                updateStudent.visible.validobarrio = false;
            }
        };
        updateStudent.onChangeSelectMedioDifusion = function (item) {
            if (typeof item === 'undefined') {
                updateStudent.visible.validomediodifusion = true;
            } else {
                if (item !== 173) {
                    updateStudent.nuevaInscripcion.aspirante.otroMedioDifusion = '';
                    updateStudent.visible.validomediodifusionotro = false;
                }
                updateStudent.visible.validomediodifusion = false;
            }
        };

        /*-- INI: wizard --*/
        updateStudent.onContinuar = function () {
            if (updateStudent.ChangeTabs(1)) {
                updateStudent.onGuardarInformacionPersonal();
                return;
            }
            if (updateStudent.ChangeTabs(3) || updateStudent.ChangeTabs(4)) {
                updateStudent.onGuardarInformacionAcademica();
                updateStudent.onGuardarInformacionFamiliar();
              //  return;
            }
        };
        /*-- FIN: wizard --*/

        //IMPORTANTE

        updateStudent.onGuardarInformacionPersonal = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS);
            appConstant.CARGANDO();
            if (typeof updateStudent.nuevaInscripcion.aspirante.otroMedioDifusion === 'undefined') {
                updateStudent.nuevaInscripcion.aspirante.otroMedioDifusion = null;
            }
            if (updateStudent.nuevaInscripcion.informacionReferencia === null
                    || typeof updateStudent.nuevaInscripcion.informacionReferencia === 'undefined') {
                updateStudent.nuevaInscripcion.informacionReferencia = {
                    id: null,
                    idPadre: null,
                    infoPadre: null,
                    idMadre: null,
                    infoMadre: null,
                    idAcudiente: null,
                    infoAcudiente: null,
                    cantidadHermano: 0,
                    posicionHermano: 0,
                    idAspirante: updateStudent.nuevaInscripcion.idAspirante
                };
            }

            if (updateStudent.nuevaInscripcion.informacionAdicional === null
                    || typeof updateStudent.nuevaInscripcion.informacionAdicional === 'undefined') {
                updateStudent.nuevaInscripcion.informacionAdicional = {
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
                    idAspirante: updateStudent.nuevaInscripcion.idAspirante
                };
            }

            if (new ValidationService().checkFormValidity($scope.formwizardinscripcionDatosBasicos)) {

                updateStudent.infopersonal = {
                    id: updateStudent.nuevaInscripcion.id,
                    idPeriodoAcademico: updateStudent.nuevaInscripcion.idPeriodoAcademico,
                    idSeccional: updateStudent.nuevaInscripcion.idSeccional,
                    idNivelFormacion: updateStudent.nuevaInscripcion.idNivelFormacion,
                    idPrograma: updateStudent.nuevaInscripcion.idPrograma,
                    idTipoConvenio: updateStudent.nuevaInscripcion.idTipoConvenio,
                    idAspirante: updateStudent.nuevaInscripcion.idAspirante,
                    aspirante: {
                        id: updateStudent.nuevaInscripcion.aspirante.id,
                        nombre: appConstant.VALIDAR_STRING(updateStudent.nuevaInscripcion.aspirante.nombre),
                        apellido: appConstant.VALIDAR_STRING(updateStudent.nuevaInscripcion.aspirante.apellido),
                        identificacionAspirante: {
                            idTipoIdentificacion: updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion,
                            identificacion: updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.identificacion
                        },
                        telefono: updateStudent.nuevaInscripcion.aspirante.telefono,
                        email: updateStudent.nuevaInscripcion.aspirante.email,
                        celular: updateStudent.nuevaInscripcion.aspirante.celular,
                        fechaNacimiento: onToDateString(updateStudent.nuevaInscripcion.aspirante.fechaNacimiento),
                        fechaExpedicionDocumento: onToDateString(updateStudent.nuevaInscripcion.aspirante.fechaExpedicionDocumento),
                        idLugarExpedicionDocumento: updateStudent.nuevaInscripcion.aspirante.idMunicipioExpedicion,
                        idGenero: updateStudent.nuevaInscripcion.aspirante.idGenero,
                        idEstadoCivil: updateStudent.nuevaInscripcion.aspirante.idEstadoCivil,
                        idLugarNacimiento: updateStudent.nuevaInscripcion.aspirante.idLugarNacimiento,
                        nombreLugarNacimiento: updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento,
                        nombreLugarExpedicionDocumento: updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento,
                        nombreLugarResidencia: updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia,
                        idGrupoSanguineo: updateStudent.nuevaInscripcion.aspirante.idGrupoSanguineo,
                        idLugarResidencia: updateStudent.nuevaInscripcion.aspirante.idLugarResidencia,
                        direccion: updateStudent.nuevaInscripcion.aspirante.direccion,
                        idBarrio: updateStudent.nuevaInscripcion.aspirante.idBarrio,
                        barrio: null,
                        idInstitucion: updateStudent.nuevaInscripcion.aspirante.idInstitucion,
                        otroInstitucion: updateStudent.nuevaInscripcion.aspirante.otroInstitucion
                    },
                    booleanGuardar: false
                };

                studentCurriculumService.registrarInscripcion(updateStudent.infopersonal).then(function (data) {

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
        updateStudent.onGuardarInformacionAcademica = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            updateStudent.visible.validaaniofinalizacion = false;
            updateStudent.visible.validaaniopresentacion = false;
            updateStudent.visible.validainstitucion = false;
            var estado = false;
            if (!new ValidationService().checkFormValidity($scope.formwizaracademica)) {
                updateStudent.visible.workingstep2 = updateStudent.modowizard.error;
                estado = true;
                appConstant.CERRAR_SWAL();
                return;
            }
            if (estado === true) {
                appConstant.CERRAR_SWAL();
                return;
            }

            if (updateStudent.infopersonal.informacionAcademica === undefined) {
                updateStudent.infopersonal.informacionAcademica = {};
            }

            updateStudent.infopersonal.informacionAcademica = {
                id: updateStudent.nuevaInscripcion.informacionAcademica.id,
                idInstitucion: updateStudent.nuevaInscripcion.informacionAcademica.idInstitucion,
                fechaCulminacion: onToDateString(updateStudent.nuevaInscripcion.informacionAcademica.fechaCulminacion),
                tituloObtenido: updateStudent.nuevaInscripcion.informacionAcademica.tituloObtenido,
                fechaPresentacion: onToDateString(updateStudent.nuevaInscripcion.informacionAcademica.fechaPresentacion),
                numeroRegistro: updateStudent.nuevaInscripcion.informacionAcademica.numeroRegistro,
                idAspirante: updateStudent.nuevaInscripcion.aspirante.id
            };


            studentCurriculumService.registrarInscripcionInformacionAcademica(updateStudent.infopersonal).then(function (data) {
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
        updateStudent.onGuardarInformacionFamiliar = function () {
            var formmain = true;
            var tabacudiente = true;

            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            if (!new ValidationService().checkFormValidity($scope.formwizarfamiliar1)) {
                updateStudent.visible.workingstep3 = updateStudent.modowizard.error;
                formmain = false;
            }
            if (!new ValidationService().checkFormValidity($scope.$$childHead.formwizardinscripcionTabsInfoFamiliar)) {
                updateStudent.visible.workingstep3 = updateStudent.modowizard.error;
                tabacudiente = false;
            }

            if ((tabacudiente) && formmain) {
                var objInfoAcudiente = {
                    id: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.id : null,
                    identificacion: {
                        idTipoIdentificacion: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.identificacion.idTipoIdentificacion : null,
                        identificacion: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.identificacion.identificacion : null
                    },
                    apellido: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.apellido : null, nombre: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombre : null, idFormacion: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.idFormacion : null,
                    ocupacion: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.ocupacion : null,
                    idEstadoCivil: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.idEstadoCivil : null,
                    email: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.email : null,
                    idResidencia: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.idResidencia : typeof updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente : null,
                    nombreResidencia: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia : null,
                    direccion: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.direccion : null,
                    celular: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.celular : null,
                    telefono: typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== 'undefined' && updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente !== null ? updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono : null
                };

                if (updateStudent.infopersonal.informacionReferencia === undefined) {
                    updateStudent.infopersonal.informacionReferencia = {};
                }

                updateStudent.infopersonal.informacionReferencia = {
                    id: updateStudent.nuevaInscripcion.informacionReferencia.id,
                    idAcudiente: updateStudent.nuevaInscripcion.informacionReferencia.idAcudiente,
                    infoAcudiente: objInfoAcudiente,
                    cantidadHermano: updateStudent.nuevaInscripcion.informacionReferencia.cantidadHermano,
                    posicionHermano: updateStudent.nuevaInscripcion.informacionReferencia.posicionHermano,
                    idAspirante: updateStudent.nuevaInscripcion.aspirante.id
                };

                studentCurriculumService.registrarInscripcionInformacionReferencia(updateStudent.infopersonal).then(function (data) {
                    if (data.tipo !== 200) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        return;
                    }



                    appConstant.MSG_GROWL_OK(appGenericConstant.DATOS_ACTUALIZADO_SATISFACTORIO);
                    updateStudent.infopersonal.informacionReferencia.id = data.objectResponse.informacionReferencia.id;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
            appConstant.CERRAR_SWAL();
        };
        updateStudent.onGuardarCambioDocumento = function () {
            appConstant.MSG_LOADING('Guardando datos, espere un momento...');
            appConstant.CARGANDO();

            if (new ValidationService().checkFormValidity($scope.formwizardinscripcionDatosBasicos)) {

                updateStudent.infopersonal = {
                    id: updateStudent.nuevaInscripcion.id,
                    idPeriodoAcademico: updateStudent.nuevaInscripcion.idPeriodoAcademico,
                    idSeccional: updateStudent.nuevaInscripcion.idSeccional,
                    idNivelFormacion: updateStudent.nuevaInscripcion.idNivelFormacion,
                    idPrograma: updateStudent.nuevaInscripcion.idPrograma,
                    idTipoConvenio: updateStudent.nuevaInscripcion.idTipoConvenio,
                    idAspirante: updateStudent.nuevaInscripcion.idAspirante,
                    aspirante: {
                        id: updateStudent.nuevaInscripcion.aspirante.id,
                        nombre: appConstant.VALIDAR_STRING(updateStudent.nuevaInscripcion.aspirante.nombre),
                        apellido: appConstant.VALIDAR_STRING(updateStudent.nuevaInscripcion.aspirante.apellido),
                        identificacionAspirante: {
                            idTipoIdentificacion: updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.idTipoIdentificacion,
                            identificacion: updateStudent.nuevaInscripcion.aspirante.identificacionAspirante.identificacion
                        },
                        telefono: updateStudent.nuevaInscripcion.aspirante.telefono,
                        email: updateStudent.nuevaInscripcion.aspirante.email,
                        celular: updateStudent.nuevaInscripcion.aspirante.celular,
                        fechaNacimiento: onToDateString(updateStudent.nuevaInscripcion.aspirante.fechaNacimiento),
                        fechaExpedicionDocumento: onToDateString(updateStudent.nuevaInscripcion.aspirante.fechaExpedicionDocumento),
                        idLugarExpedicionDocumento: updateStudent.nuevaInscripcion.aspirante.idMunicipioExpedicion,
                        idGenero: updateStudent.nuevaInscripcion.aspirante.idGenero,
                        idEstadoCivil: updateStudent.nuevaInscripcion.aspirante.idEstadoCivil,
                        idLugarNacimiento: updateStudent.nuevaInscripcion.aspirante.idLugarNacimiento,
                        nombreLugarNacimiento: updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento,
                        nombreLugarExpedicionDocumento: updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento,
                        nombreLugarResidencia: updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia,
                        idGrupoSanguineo: updateStudent.nuevaInscripcion.aspirante.idGrupoSanguineo,
                        idLugarResidencia: updateStudent.nuevaInscripcion.aspirante.idLugarResidencia,
                        direccion: updateStudent.nuevaInscripcion.aspirante.direccion,
                        idBarrio: updateStudent.nuevaInscripcion.aspirante.idBarrio,
                        barrio: null,
                        idInstitucion: updateStudent.nuevaInscripcion.aspirante.idInstitucion,
                        otroInstitucion: updateStudent.nuevaInscripcion.aspirante.otroInstitucion,
                        idTipoDocumentoNuevo: updateStudent.nuevaInscripcion.idTipoDocumentoNuevo,
                        identificacionNuevo: updateStudent.nuevaInscripcion.identificacionNuevo
                    },
                    booleanGuardar: false
                };

                studentCurriculumService.registrarCambioDocumento(updateStudent.infopersonal).then(function (data) {

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







        updateStudent.onValidarEmpresa = function () {
            updateStudent.visible.validoempresa = false;
            if (typeof updateStudent.nuevaInscripcion.informacionAdicional.empresa === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionAdicional.empresa === ''
                    || updateStudent.nuevaInscripcion.informacionAdicional.empresa === null) {
                updateStudent.visible.validoempresa = true;
            }
        };

        updateStudent.onValidarCargo = function () {
            updateStudent.visible.validocargo = false;
            if (typeof updateStudent.nuevaInscripcion.informacionAdicional.cargo === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionAdicional.cargo === ''
                    || updateStudent.nuevaInscripcion.informacionAdicional.cargo === null) {
                updateStudent.visible.validocargo = true;
            }
        };

        updateStudent.onValidarTiempoLaborado = function () {
            updateStudent.visible.validotiempolaborado = false;
            if (typeof updateStudent.nuevaInscripcion.informacionAdicional.tiempoLaborado === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionAdicional.tiempoLaborado === ''
                    || updateStudent.nuevaInscripcion.informacionAdicional.tiempoLaborado === null) {
                updateStudent.visible.validotiempolaborado = true;
            }
        };

        updateStudent.onChangeNivelFormacionPadre = function () {
            updateStudent.visible.validanivelformacionpadre = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.idFormacion === 'undefined') {
                updateStudent.visible.validanivelformacionpadre = true;
            }
        };

        updateStudent.onChangeNivelFormacionAcudiente = function () {
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.idFormacion === 'undefined') {
                updateStudent.visible.validanivelformacionacudiente = true;
            }
            updateStudent.visible.validanivelformacionacudiente = false;
        };

        updateStudent.onChangeTieneHijos = function () {
            updateStudent.nuevaInscripcion.cuantoshijos = "";
            updateStudent.nuevaInscripcion.informacionAdicional.preguntaHijo = "";
        };

        updateStudent.onChangeGrupoEtnico = function () {
            updateStudent.nuevaInscripcion.cualgrupoetnico = "";
            updateStudent.nuevaInscripcion.informacionAdicional.preguntaGrupoEtnico = "";

        };

        updateStudent.onChangeEnfermedad = function () {
            updateStudent.nuevaInscripcion.cualenfermedad = "";
            updateStudent.nuevaInscripcion.informacionAdicional.preguntaEnfermedad = "";
        };

        updateStudent.onChangeDiscapacidad = function () {
            updateStudent.nuevaInscripcion.cualdiscapacidad = "";
            updateStudent.nuevaInscripcion.informacionAdicional.preguntaDiscapacidad = "";
        };

        updateStudent.onChangeSisben = function () {
            updateStudent.nuevaInscripcion.puntajesisben = "";
            updateStudent.nuevaInscripcion.informacionAdicional.preguntaSisben = "";
        };

        updateStudent.onChangeLabora = function () {
            updateStudent.nuevaInscripcion.empresa = "";
            updateStudent.nuevaInscripcion.cargo = "";
            updateStudent.nuevaInscripcion.tiempolaborando = "";
            updateStudent.nuevaInscripcion.informacionAdicional.empresa = "";
            updateStudent.nuevaInscripcion.informacionAdicional.cargo = "";
            updateStudent.nuevaInscripcion.informacionAdicional.tiempoLaborado = "";
        };


        //VALIDA EL LUGAR DE EXPEDICIÓN DEL DOCUMENTO
        updateStudent.onAceptarExpedicion = function (item) {
            var estado = false;
            if (typeof updateStudent.nuevaInscripcion.idPaisExpedicion === 'undefined'
                    || updateStudent.nuevaInscripcion.idPaisExpedicion === null
                    || updateStudent.nuevaInscripcion.idPaisExpedicion === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaisexp = true;
                estado = true;
            }
            if (typeof updateStudent.nuevaInscripcion.idDepartamentoExpedicion === 'undefined'
                    || updateStudent.nuevaInscripcion.idDepartamentoExpedicion === null
                    || updateStudent.nuevaInscripcion.idDepartamentoExpedicion === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentoexp = true;
                estado = true;
            }
            if (typeof item === 'undefined') {
                updateStudent.visible.activomsjmunicipioexp = true;
                estado = true;
            }
            if (updateStudent.nuevaInscripcion.idPaisExpedicion !== null &&
                    updateStudent.nuevaInscripcion.idPaisExpedicion !== undefined &&
                    updateStudent.nuevaInscripcion.idPaisExpedicion.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentoexp = false;
                updateStudent.visible.activomsjmunicipioexp = false;
                estado = false;
            }

            if (estado) {
                return;
            }

            if (updateStudent.nuevaInscripcion.idPaisExpedicion.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = updateStudent.nuevaInscripcion.idPaisExpedicion.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.idDepartamentoExpedicion.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                updateStudent.nuevaInscripcion.aspirante.idMunicipioExpedicion = item.id;
            } else {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarExpedicionDocumento = updateStudent.nuevaInscripcion.idPaisExpedicion.nombrePais;
            }

            updateStudent.visible.validaexpedicion = false;
            updateStudent.onOcultarModalesLugar("modalLugarFechaExpedicion");
        };
        // FIN

        //VALIDA EL LUGAR DE NACIMIENTO
        updateStudent.onLugarNacimiento = function (item) {

            var estadonaci = false;

            if (typeof updateStudent.nuevaInscripcion.idPaisNacimiento === 'undefined'
                    || updateStudent.nuevaInscripcion.idPaisNacimiento === null
                    || updateStudent.nuevaInscripcion.idPaisNacimiento === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaislgnacimto = true;
                estadonaci = true;
            }

            if (typeof updateStudent.nuevaInscripcion.idDepartamentoNacimiento === 'undefined'
                    || updateStudent.nuevaInscripcion.idDepartamentoNacimiento === null
                    || updateStudent.nuevaInscripcion.idDepartamentoNacimiento === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentonacimto = true;
                estadonaci = true;
            }

            if (typeof item === 'undefined') {
                updateStudent.visible.activomsjmunicipionacimto = true;
                estadonaci = true;
            }

            if (updateStudent.nuevaInscripcion.idPaisNacimiento !== null &&
                    updateStudent.nuevaInscripcion.idPaisNacimiento !== undefined &&
                    updateStudent.nuevaInscripcion.idPaisNacimiento.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentonacimto = false;
                updateStudent.visible.activomsjmunicipionacimto = false;
                estadonaci = false;
            }


            if (estadonaci) {
                return;
            }

            if (updateStudent.nuevaInscripcion.idPaisNacimiento.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento = updateStudent.nuevaInscripcion.idPaisNacimiento.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.idDepartamentoNacimiento.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                updateStudent.nuevaInscripcion.aspirante.idLugarNacimiento = item.id;
            } else {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarNacimiento = updateStudent.nuevaInscripcion.idPaisNacimiento.nombrePais;
            }

            updateStudent.visible.validalugarnacimiento = false;

            updateStudent.onOcultarModalesLugar("modalLugarNacimiento");

        };
        // FIN

        //VALIDA EL LUGAR DE RESIDENCIA
        updateStudent.onLugarResidencia = function (item) {

            var estadorecd = false;

            if (typeof updateStudent.nuevaInscripcion.idPaisResidencia === 'undefined'
                    || updateStudent.nuevaInscripcion.idPaisResidencia === null
                    || updateStudent.nuevaInscripcion.idPaisResidencia === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof updateStudent.nuevaInscripcion.idDepartamentoRecidencia === 'undefined'
                    || updateStudent.nuevaInscripcion.idDepartamentoRecidencia === null
                    || updateStudent.nuevaInscripcion.idDepartamentoRecidencia === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof updateStudent.nuevaInscripcion.idMunicipioRecidencia === 'undefined') {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (updateStudent.nuevaInscripcion.idPaisResidencia !== null &&
                    updateStudent.nuevaInscripcion.idPaisResidencia !== undefined &&
                    updateStudent.nuevaInscripcion.idPaisResidencia.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentorecidencia = false;
                updateStudent.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }


            if (estadorecd) {
                return;
            }

            if (updateStudent.nuevaInscripcion.idPaisResidencia.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia = updateStudent.nuevaInscripcion.idPaisResidencia.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.idDepartamentoRecidencia.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                updateStudent.nuevaInscripcion.aspirante.idLugarResidencia = item.id;
            } else {
                updateStudent.nuevaInscripcion.aspirante.nombreLugarResidencia = updateStudent.nuevaInscripcion.idPaisResidencia.nombrePais;
            }
            updateStudent.visible.validalugarresidencia = false;

            updateStudent.onOcultarModalesLugar("modalLugarResidencia");
        };
        // FIN


        updateStudent.onLugarResidenciaPadre = function (item) {

            var estadorecd = false;

            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === null
                    || updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === null
                    || updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof item === 'undefined') {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre !== null &&
                    updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre !== undefined &&
                    updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentorecidencia = false;
                updateStudent.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }

            if (estadorecd) {
                return;
            }

            if (updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia = updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaPadre.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + item.nombreMunicipio;

                updateStudent.visible.validalugarresidenciapadre = false;
            } else {
                updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.nombreResidencia = updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaPadre.nombrePais;
            }
            updateStudent.onOcultarModalesLugar('modalLugarResidenciaPadre');
        };

        updateStudent.onLugarResidenciaMadre = function () {

            updateStudent.visible.validalugarresidenciamadre = false;

            var estadorecd = false;

            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === null
                    || updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }

            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === null
                    || updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }

            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre === 'undefined') {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }

            if (updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre !== null &&
                    updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre !== undefined &&
                    updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentorecidencia = false;
                updateStudent.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }

            if (estadorecd) {
                return;
            }

            if (updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia = updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.informacionReferencia.idDepartamentoRecidenciaMadre.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaMadre.nombreMunicipio;

                updateStudent.visible.validalugarresidencia = false;
            } else {
                updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.nombreResidencia = updateStudent.nuevaInscripcion.informacionReferencia.idPaisRecidenciaMadre.nombrePais;
            }

            updateStudent.onOcultarModalesLugar('modalLugarResidenciaMadre');

        };

        updateStudent.onLugarResidenciaAcudiente = function () {
            var estadorecd = false;
            if (typeof updateStudent.nuevaInscripcion.paisrecidenciaacudiente === 'undefined'
                    || updateStudent.nuevaInscripcion.paisrecidenciaacudiente === null
                    || updateStudent.nuevaInscripcion.paisrecidenciaacudiente === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }
            if (typeof updateStudent.nuevaInscripcion.departamentorecidenciaacudiente === 'undefined'
                    || updateStudent.nuevaInscripcion.departamentorecidenciaacudiente === null
                    || updateStudent.nuevaInscripcion.departamentorecidenciaacudiente === appGenericConstant.DEPARTAMENTO_DEFECTO) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente === 'undefined') {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }
            if (updateStudent.nuevaInscripcion.paisrecidenciaacudiente !== null &&
                    updateStudent.nuevaInscripcion.paisrecidenciaacudiente !== undefined &&
                    updateStudent.nuevaInscripcion.paisrecidenciaacudiente.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjdepartamentorecidencia = false;
                updateStudent.visible.activomsjmunicipiorecidencia = false;
                estadorecd = false;
            }
            if (estadorecd) {
                return;
            }
            if (updateStudent.nuevaInscripcion.paisrecidenciaacudiente.id === appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia = updateStudent.nuevaInscripcion.paisrecidenciaacudiente.nombrePais
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.departamentorecidenciaacudiente.nombreDepartamento
                        + appGenericConstant.GUION_ESPACIO + updateStudent.nuevaInscripcion.informacionReferencia.idMunicipioRecidenciaAcudiente.nombreMunicipio;

                updateStudent.visible.validalugarresidenciaacudiente = false;
            } else {
                updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.nombreResidencia = updateStudent.nuevaInscripcion.paisrecidenciaacudiente.nombrePais;
            }
            updateStudent.onOcultarModalesLugar('modalLugarResidenciaAcudiente');
        };



        //METODO GENERICO PARA CERRAR LOS MODALES CUANDO SE ACEPTA
        updateStudent.onOcultarModalesLugar = function (item) {
            $("#" + item).hide();
            $("body").removeClass("modal-open");
            $("div").removeClass("modal-backdrop fade in");
        };
        //


        updateStudent.ejecutarConsultarTiposConvenios = function () {
            studentCurriculumService.consultarTipoConvenio().then(function (data) {
                updateStudent.convenios = [];
                angular.forEach(data, function (value) {
                    var convenio = {
                        id: value.id,
                        codigoTipoConvenio: value.codigoTipoConvenio,
                        nombreTipoConvenio: value.nombreTipoConvenio,
                        estado: value.estado
                    };
                    updateStudent.convenios.push(convenio);
                });
            }).catch(function (e) {
                return;
            });
        };
        updateStudent.onValidarFechaExpedicion = function () {
            if (typeof updateStudent.nuevaInscripcion.aspirante.fechaExpedicionDocumento === 'undefined'
                    || updateStudent.nuevaInscripcion.aspirante.fechaExpedicionDocumento === '') {
                updateStudent.visible.validafechaexpedicion = true;
                return;
            }
            updateStudent.visible.validafechaexpedicion = false;
        };

        updateStudent.onValidarTelefono = function () {
            updateStudent.visible.validotelefono = false;
            updateStudent.visible.validotelefonosize = false;
            if (typeof updateStudent.nuevaInscripcion.aspirante.telefono === 'undefined'
                    || updateStudent.nuevaInscripcion.aspirante.telefono === '') {
                updateStudent.visible.validotelefono = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.aspirante.telefono !== 'undefined') {
                if (updateStudent.nuevaInscripcion.aspirante.telefono.length < 8) {
                    updateStudent.visible.validocelular = false;
                    updateStudent.visible.validotelefonosize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarTelefonoPadre = function () {
            updateStudent.visible.validotelefonopadre = false;
            updateStudent.visible.validotelefonopadresize = false;
            if (updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.telefono === null) {
                updateStudent.visible.validotelefonopadre = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.telefono === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.telefono === '') {
                updateStudent.visible.validotelefonopadre = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.telefono !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.telefono.length < 8) {
                    updateStudent.visible.validocelularpadre = false;
                    updateStudent.visible.validotelefonopadresize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarTelefonoMadre = function () {
            updateStudent.visible.validotelefonomadre = false;
            updateStudent.visible.validotelefonomadresize = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.telefono === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.telefono === '') {
                updateStudent.visible.validotelefonomadre = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.telefono !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.telefono.length < 8) {
                    updateStudent.visible.validocelularmadre = false;
                    updateStudent.visible.validotelefonomadresize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarTelefonoAcudiente = function () {
            updateStudent.visible.validotelefonoacudiente = false;
            updateStudent.visible.validotelefonoacudientesize = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono === '') {
                updateStudent.visible.validotelefonoacudiente = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.telefono.length < 8) {
                    updateStudent.visible.validocelularacudiente = false;
                    updateStudent.visible.validotelefonoacudientesize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarCelular = function () {
            updateStudent.visible.validocelular = false;
            updateStudent.visible.validocelularsize = false;
            if (typeof updateStudent.nuevaInscripcion.aspirante.celular === 'undefined'
                    || updateStudent.nuevaInscripcion.aspirante.celular === '') {
                updateStudent.visible.validocelular = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.aspirante.celular !== 'undefined') {
                if (updateStudent.nuevaInscripcion.aspirante.celular.length < 10) {
                    updateStudent.visible.validotelefono = false;
                    updateStudent.visible.validocelularsize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarCelularPadre = function () {
            updateStudent.visible.validocelularpadre = false;
            updateStudent.visible.validocelularpadresize = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.celular === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.celular === '') {
                updateStudent.visible.validocelularpadre = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.celular !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoPadre.celular.length < 10) {
                    updateStudent.visible.validotelefonopadre = false;
                    updateStudent.visible.validocelularpadresize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarCelularMadre = function () {
            updateStudent.visible.validocelularmadre = false;
            updateStudent.visible.validocelularmadresize = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.celular === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.celular === '') {
                updateStudent.visible.validocelularmadre = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.celular !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.celular.length < 10) {
                    updateStudent.visible.validotelefonomadre = false;
                    updateStudent.visible.validocelularmadresize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarCelularAcudiente = function () {
            updateStudent.visible.validocelularacudiente = false;
            updateStudent.visible.validocelularacudientesize = false;
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.celular === 'undefined'
                    || updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.celular === '') {
                updateStudent.visible.validocelularacudiente = true;
                return;
            }
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.celular !== 'undefined') {
                if (updateStudent.nuevaInscripcion.informacionReferencia.infoAcudiente.celular.length < 10) {
                    updateStudent.visible.validotelefonoacudiente = false;
                    updateStudent.visible.validocelularacudientesize = true;
                    return;
                }
            }
        };

        updateStudent.onValidarNivelFormacionMadre = function () {
            if (typeof updateStudent.nuevaInscripcion.informacionReferencia.infoMadre.idFormacion === 'undefined') {
                updateStudent.visible.validanivelformacionmadre = true;
                return;
            }
            updateStudent.visible.validanivelformacionmadre = false;
        };

        updateStudent.onValidarEmail = function () {
            if (typeof $scope.formwizardinscripcion.email.$error.pattern === 'undefined') {
                updateStudent.visible.validoemail = false;
                return;
            }
            updateStudent.visible.validoemail = $scope.formwizardinscripcion.email.$error.pattern;
        };

        updateStudent.onChangePaisExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjpaisexp = true;
                return;
            }
            updateStudent.visible.activomsjpaisexp = false;
        };

        updateStudent.onChangePaisNacmento = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjpaislgnacimto = true;
                return;
            }
            updateStudent.visible.activomsjpaislgnacimto = false;
        };

        updateStudent.onChangePaisRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjpaislgrecidencia = true;
                return;
            }
            updateStudent.visible.activomsjpaislgrecidencia = false;
        };

        updateStudent.onChangeDepartamentoExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjdepartamentoexp = true;
                return;
            }
            updateStudent.visible.activomsjdepartamentoexp = false;
        };

        updateStudent.onChangeDepartamentoNacmento = function (item) {
            updateStudent.visible.activomsjdepartamentonacimto = false;
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjdepartamentonacimto = true;
                return;
            }
        };

        updateStudent.onChangeDepartamentoRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                return;
            }
            updateStudent.visible.activomsjdepartamentorecidencia = false;
        };

        updateStudent.onChangeMuncipioExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipioexp = true;
                return;
            }
            updateStudent.visible.activomsjmunicipioexp = false;
        };

        updateStudent.onChangeMuncipioNacmento = function (item) {
            updateStudent.visible.activomsjmunicipionacimto = false;
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipionacimto = true;
                return;
            }
        };

        updateStudent.onChangeMuncipioRecidencia = function (item) {
            updateStudent.nuevaInscripcion.aspirante.cualBarrio="";
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                return;
            }
            updateStudent.visible.activomsjmunicipiorecidencia = false;
            studentCurriculumService.consultarBarriosPorMunicipios(item.id).then(function (data) {
                updateStudent.lstbarrios = [];
                updateStudent.lstbarrios = data;
                var otro = {
                    id: 0,
                    idMunicipio: 0,
                    nombre: "OTRO"
                };
                updateStudent.lstbarrios.push(otro);
            }).catch(function (e) {
                return;
            });
        };



        updateStudent.onChangeSelectNivelFormacion = function () {
            if (typeof updateStudent.nuevaInscripcion.idNivelFormacion === 'undefined'
                    || updateStudent.nuevaInscripcion.idNivelFormacion === null) {
                updateStudent.visible.disableSelectPrograma = true;
                updateStudent.visible.disableSelectModalidad = true;
                updateStudent.visible.disableSelectHorario = true;
                updateStudent.nuevaInscripcion.programaDTO = null;
                updateStudent.nuevaInscripcion.modalidadDTO = null;
                updateStudent.nuevaInscripcion.horarioDTO = null;
                updateStudent.nuevaInscripcion.idPrograma = null;
                updateStudent.nuevaInscripcion.idModalidad = null;
                updateStudent.nuevaInscripcion.idHorario = null;
            } else {
                updateStudent.visible.disableSelectPrograma = false;
                updateStudent.visible.disableSelectModalidad = true;
                updateStudent.visible.disableSelectHorario = true;
                updateStudent.nuevaInscripcion.programaDTO = null;
                updateStudent.nuevaInscripcion.modalidadDTO = null;
                updateStudent.nuevaInscripcion.horarioDTO = null;
                updateStudent.nuevaInscripcion.idPrograma = null;
                updateStudent.nuevaInscripcion.idModalidad = null;
                updateStudent.nuevaInscripcion.idHorario = null;
            }
        };

        updateStudent.onBlurMuncipioExp = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipioexp = true;
                return;
            }
            updateStudent.visible.activomsjmunicipioexp = false;
        };

        updateStudent.onBlurMuncipioNacmento = function (item) {
            updateStudent.visible.activomsjmunicipionacimto = false;
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipionacimto = true;
                return;
            }
        };

        updateStudent.onBlurMuncipioRecidencia = function (item) {
            if (typeof item === 'undefined' || item === null) {
                updateStudent.visible.activomsjmunicipiorecidencia = true;
                return;
            }
            updateStudent.visible.activomsjmunicipiorecidencia = false;
        };

        updateStudent.ejecutarConsultarTodosBarrios = function () {
            studentCurriculumService.consultarAllBarrios().then(function (data) {
                updateStudent.lstbarrios = [];
                updateStudent.lstbarrios = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarAllModalidadesxPrograma = function () {
            if (typeof updateStudent.nuevaInscripcion.idPrograma === 'undefined') {
                updateStudent.nuevaInscripcion.idPrograma = null;
            }
            if (updateStudent.nuevaInscripcion.idPrograma !== null) {
                studentCurriculumService.consultarAllModalidadesxPrograma(updateStudent.nuevaInscripcion.idPrograma).then(function (data) {
                    updateStudent.lstmodalidad = [];
                    angular.forEach(data, function (value) {
                        var modalidad = {
                            id: value.id,
                            nombreModalidad: value.nombreModalidad
                        };
                        updateStudent.lstmodalidad.push(modalidad);
                    });
                }).catch(function (e) {

                    return;
                });
            }
        };

        updateStudent.ejecutarConsultarPais = function () {
            studentCurriculumService.consultarPais().then(function (data) {
                updateStudent.lstpais = [];
                updateStudent.lstpais = data;
                updateStudent.ejecutarLugarExpedicionConsultarPais();
                updateStudent.ejecutarLugarNacimientoConsultarPais();
                updateStudent.ejecutarLugarRecidenciaConsultarPais();
            }).catch(function (e) {
                return;
            });
        };

        /* METODO PARA CARGAR */


        updateStudent.ejecutarConsultarMediosDifusion = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MEDIO_DIFUSION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstmediodifusion = [];
                updateStudent.lstmediodifusion = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lsttipodocumentos = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarEstadoCivil = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO_CIVIL, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstestadocivil = [];
                updateStudent.lstestadocivil = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarGenero = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_GENERO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstgenero = [];
                updateStudent.lstgenero = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarGrupoSanguineo = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_GRUPO_SANGUINEO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstgruposanguineo = [];
                updateStudent.lstgruposanguineo = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarTipoViviendas = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_VIVIENDA, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lsttipovivienda = [];
                updateStudent.lsttipovivienda = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarContratosSocioEconomicos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTRATO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstcontratoseconomicos = [];
                updateStudent.lstcontratoseconomicos = data;

            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarNivelEducativo = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_NIVEL_EDUCATIVO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                updateStudent.lstniveleducactivo = [];
                updateStudent.lstniveleducactivo = data;
            }).catch(function (e) {
                return;
            });
        };

      updateStudent.cargarFoto = function () {
        studentCurriculumService.getFuncionario(updateStudent.item.identificacionAspirante.identificacion).then(function (info) {
          updateStudent.foto = info.idFoto;

        }).catch(function (e) {
          return;
        });
      };

        updateStudent.ejecutarConsultarSeccional = function () {
            studentCurriculumService.consultarSeccional().then(function (data) {
                updateStudent.seccionales = [];
                updateStudent.seccionales = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.ejecutarConsultarInstituciones = function () {
            studentCurriculumService.consultarColegio().then(function (data) {
                updateStudent.instituciones = [];
                updateStudent.instituciones = data;
            }).catch(function (e) {
                return;
            });
        };
        updateStudent.ejecutarConsultarNivelEducativo();
        updateStudent.ejecutarConsultarTipoDocumentos();
        updateStudent.ejecutarConsultarEstadoCivil();
        updateStudent.ejecutarConsultarGenero();
        updateStudent.ejecutarConsultarGrupoSanguineo();
        updateStudent.ejecutarConsultarSeccional();
        updateStudent.ejecutarConsultarTiposConvenios();
        updateStudent.ejecutarConsultarPais();
        updateStudent.ejecutarConsultarInstituciones();
        updateStudent.ejecutarConsultarTipoViviendas();
        updateStudent.ejecutarConsultarContratosSocioEconomicos();
        updateStudent.ejecutarConsultarTodosBarrios();
        updateStudent.ejecutarConsultarMediosDifusion();
        updateStudent.ejecutarConsultarAllModalidadesxPrograma();

        updateStudent.onCalcularEdad = function () {
            if (typeof updateStudent.nuevaInscripcion.aspirante.fechaNacimiento === 'undefined'
                    || updateStudent.nuevaInscripcion.aspirante.fechaNacimiento === null) {
                updateStudent.visible.validafechanacimiento = true;
                return;
            }
            updateStudent.visible.validafechanacimiento = false;
            updateStudent.visible.validaedad = false;
            var values = (updateStudent.nuevaInscripcion.aspirante.fechaNacimiento).split("/");
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
            updateStudent.nuevaInscripcion.edad = edad;
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

        updateStudent.clonePais = function () {
            return updateStudent.lstpais.slice();
        };
        updateStudent.cloneDepartamentos = function () {
            return updateStudent.lstdepartamentos.slice();
        };
        updateStudent.cloneMunicipios = function () {
            return updateStudent.listmunicipios.slice();
        };

        updateStudent.ejecutarLugarExpedicionConsultarMunicipios = function () {
            updateStudent.lgexplstmunicipios = [];
            updateStudent.lgexplstmunicipios = updateStudent.cloneMunicipios();
        };
        updateStudent.ejecutarLugarNacimientoConsultarMunicipios = function () {
            updateStudent.lgnacimtolstmunicipios = [];
            updateStudent.lgnacimtolstmunicipios = updateStudent.cloneMunicipios();
        };
        updateStudent.ejecutarLugarRecidenciaConsultarMunicipios = function () {
            updateStudent.lgrecidencialstmunicipios = [];
            updateStudent.lgrecidencialstmunicipios = updateStudent.cloneMunicipios();
        };
        updateStudent.ejecutarLugarExpedicionConsultarDepartamentos = function () {
            updateStudent.lgexplstdepartamentos = [];
            updateStudent.lgexplstdepartamentos = updateStudent.cloneDepartamentos();
        };
        updateStudent.ejecutarLugarNacimientoConsultarDepartamentos = function () {
            updateStudent.lgnacimtolstdepartamentos = [];
            updateStudent.lgnacimtolstdepartamentos = updateStudent.cloneDepartamentos();
        };
        updateStudent.ejecutarLugarRecidenciaConsultarDepartamentos = function () {
            updateStudent.lgrecidencialstdepartamentos = [];
            updateStudent.lgrecidencialstdepartamentos = updateStudent.cloneDepartamentos();
        };
        updateStudent.ejecutarLugarExpedicionConsultarPais = function () {
            updateStudent.lgexplstpais = [];
            updateStudent.lgexplstpais = updateStudent.clonePais();
        };
        updateStudent.ejecutarLugarNacimientoConsultarPais = function () {
            updateStudent.lgnacimtolstpais = [];
            updateStudent.lgnacimtolstpais = updateStudent.clonePais();
        };
        updateStudent.ejecutarLugarRecidenciaConsultarPais = function () {
            updateStudent.lgrecidencialstpais = [];
            updateStudent.lgrecidencialstpais = updateStudent.clonePais();
        };
        updateStudent.onConsultarDepartoPorPaisLugarExpedicion = function (item) {
            updateStudent.lgexplstdepartamentos = [];
            updateStudent.lgexplstmunicipios = [];
            if (item === null) {
                updateStudent.visible.activomsjpaisexp = true;
                updateStudent.visible.activomsjdepartamentoexp = false;
                updateStudent.visible.activomsjmunicipioexp = false;
                updateStudent.nuevaInscripcion.idDepartamentoExpedicion = null;
                updateStudent.nuevaInscripcion.idLugarExpedicionDocumento = null;
                return;
            }
            if (item.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.visible.activomsjpaisexp = false;
                updateStudent.visible.activomsjdepartamentoexp = false;
                updateStudent.visible.activomsjmunicipioexp = false;
                updateStudent.nuevaInscripcion.idDepartamentoExpedicion = null;
                updateStudent.nuevaInscripcion.idLugarExpedicionDocumento = null;
                return;
            }
            updateStudent.visible.activomsjpaisexp = false;
            updateStudent.ejecutarLugarExpedicionConsultarMunicipios();
            studentCurriculumService.consultarDepartamentoPais(item).then(function (data) {
                updateStudent.lgexplstdepartamentos = [];
                updateStudent.lgexplstdepartamentos = data;

            }).catch(function (e) {
                return;
            });
        };

        updateStudent.onConsultarMunicipioPorDepartamentoLugarExpedicion = function (item) {
            updateStudent.lgexplstmunicipios = [];
            if (item === null) {
                updateStudent.visible.activomsjdepartamentoexp = true;
                return;
            }
            updateStudent.visible.activomsjdepartamentoexp = false;
            studentCurriculumService.consultarMunicipioPorDepartamento(item).then(function (data) {
                updateStudent.lgexplstmunicipios = [];
                updateStudent.lgexplstmunicipios = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.onConsultarDepartoPorPaisLugarNacimiento = function (item) {
            updateStudent.lgnacimtolstdepartamentos = [];
            updateStudent.lgnacimtolstmunicipios = [];
            if (item === null) {
                updateStudent.nuevaInscripcion.idDepartamentoNacimiento = null;
                updateStudent.nuevaInscripcion.idMunicipioNacimiento = null;
                updateStudent.visible.activomsjpaislgnacimto = true;
                return;
            }
            if (item.id !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.idDepartamentoNacimiento = null;
                updateStudent.nuevaInscripcion.idMunicipioNacimiento = null;
                updateStudent.visible.activomsjpaislgnacimto = false;
                updateStudent.visible.activomsjdepartamentonacimto = false;
                updateStudent.visible.activomsjmunicipionacimto = false;
                return;
            }
            updateStudent.visible.activomsjpaislgnacimto = false;
            updateStudent.ejecutarLugarNacimientoConsultarMunicipios();
            studentCurriculumService.consultarDepartamentoPais(item).then(function (data) {
                updateStudent.lgnacimtolstdepartamentos = [];
                updateStudent.lgnacimtolstdepartamentos = data;
            }).catch(function (e) {
                return;
            });
        };

        updateStudent.onConsultarDepartoPorPaisLugarRecidencia = function (item) {
            updateStudent.lgrecidencialstdepartamentos = [];
            updateStudent.lgrecidencialstmunicipios = [];
            if (item === null) {
                updateStudent.nuevaInscripcion.idDepartamentoRecidencia = null;
                updateStudent.nuevaInscripcion.idMunicipioRecidencia = null;
                updateStudent.visible.activomsjpaislgrecidencia = true;
                return;
            }
            if (item !== appGenericConstant.ID_PAIS_COLOMBIA) {
                updateStudent.nuevaInscripcion.idDepartamentoRecidencia = null;
                updateStudent.nuevaInscripcion.idMunicipioRecidencia = null;
                updateStudent.visible.activomsjpaislgrecidencia = false;
                updateStudent.visible.activomsjdepartamentorecidencia = false;
                updateStudent.visible.activomsjmunicipiorecidencia = false;
                return;
            }
            updateStudent.visible.activomsjpaislgrecidencia = false;
            updateStudent.ejecutarLugarNacimientoConsultarMunicipios();
            var data = {
                id: item
              }
            studentCurriculumService.consultarDepartamentoPais(data).then(function (data) {
                updateStudent.lgrecidencialstdepartamentos = [];
                updateStudent.lgrecidencialstdepartamentos = data;
            }).catch(function (e) {
                return;
            });

        };

        updateStudent.onConsultarMunicipioPorDepartamentoLugarNacimiento = function (item) {
            if (item === null) {
                updateStudent.visible.activomsjdepartamentonacimto = true;
                return;
            }
            updateStudent.visible.activomsjdepartamentonacimto = false;
            studentCurriculumService.consultarMunicipioPorDepartamento(item).then(function (data) {
                updateStudent.lgnacimtolstmunicipios = [];
                updateStudent.lgnacimtolstmunicipios = data;

            }).catch(function (e) {
                return;
            });
        };

        updateStudent.onConsultarMunicipioPorDepartamentoLugarRecidencia = function (item) {
            if (item === null) {
                updateStudent.visible.activomsjdepartamentorecidencia = true;
                return;
            }
            updateStudent.visible.activomsjdepartamentorecidencia = false;
            studentCurriculumService.consultarMunicipioPorDepartamento(item).then(function (data) {
                updateStudent.lgrecidencialstmunicipios = [];
                updateStudent.lgrecidencialstmunicipios = data;

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

        updateStudent.onFocusFechaExpedicion = function (idCampo) {
            fecha = $(idCampo).val();
        };
        updateStudent.onBlurFechaExpedicion = function (idCampo) {
            $(idCampo).val(fecha);
        };
        init();
    }

})();
