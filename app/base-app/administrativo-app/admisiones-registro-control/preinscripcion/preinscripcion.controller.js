(function () {
    'use strict';
    angular.module('mytodoApp').controller('preinscripcionCtrl', preinscripcionCtrl);
    preinscripcionCtrl.$inject = ['$scope', 'preinscripcionService', 'ValidationService', 'utilServices', 'appConstant', 'appGenericConstant', 'appConstantValueList'];
    function preinscripcionCtrl($scope, preinscripcionService, ValidationService, utilServices, appConstant, appGenericConstant, appConstantValueList) {
        var preinscripcionControl = this;
        var config = {};
        preinscripcionControl.periodosAcademicos = [];
        preinscripcionControl.seccionales = [];
        preinscripcionControl.nivelesformacion = [];
        preinscripcionControl.programas = [];
        preinscripcionControl.modalidadesList = [];
        preinscripcionControl.horariosList = [];
        preinscripcionControl.horariosListAux = [];
        preinscripcionControl.horariosListAuxListaValor = [];
        preinscripcionControl.lsttipodocumentos = [];
        preinscripcionControl.colegios = [];
        preinscripcionControl.convenios = [];
        preinscripcionControl.periodos = [];
        preinscripcionControl.medioDifusion = [];
        preinscripcionControl.disabledHorario = true;
        preinscripcionControl.disabledPrograma = true;
        preinscripcionControl.disabledModalidad = true;
        preinscripcionControl.showCualInstituciones = false;
        preinscripcionControl.showCualDifusion = false;
        preinscripcionControl.disableIdentificacion = true;
        preinscripcionControl.disabledInstituciones = false;

        preinscripcionControl.nuevaPreinscripcion = preinscripcionService.preinscripcion;
        preinscripcionControl.visible = preinscripcionService.visible;
        preinscripcionControl.visible.hayPeriodo = false;
        preinscripcionControl.nuevaPreinscripcion.tipodocumento = "";
        preinscripcionControl.options = appConstant.FILTRO_TABLAS;
        preinscripcionControl.selectedOption = preinscripcionControl.options[0];

        $(window).load(function () {
            $("input.seccional").keyup(function (e) {
                e.preventDefault();
                gestionAdmision.selectSeparate();
            });
        });

        preinscripcionControl.resetValidation = function () {
            preinscripcionControl.visible.validoPeriodo = false;
            preinscripcionControl.visible.validoseccional = false;
            preinscripcionControl.visible.validoformacion = false;
            preinscripcionControl.visible.validoprograma = false;
            preinscripcionControl.visible.validoinstitucion = false;
            preinscripcionControl.visible.validoconvenio = false;
            preinscripcionControl.visible.validobarrio = false;
            preinscripcionControl.visible.validodifusion = false;
            preinscripcionControl.visible.validomodalidad = false;
            preinscripcionControl.visible.validohorario = false;
            preinscripcionControl.visible.validocelular = false;
            preinscripcionControl.visible.validotelefono = false;
        };

        preinscripcionControl.onValidarEmail = function () {
            if (typeof $scope.formpreinscripcion.email.$error.pattern === 'undefined') {
                preinscripcionControl.visible.validoemail = false;
                return;
            }
            preinscripcionControl.visible.validoemail = $scope.formpreinscripcion.email.$error.pattern;
        };

        preinscripcionControl.onVolver = function () {
            preinscripcionService.preinscripcion = {};
            preinscripcionControl.visible = {};
        };

        preinscripcionControl.onChangeSelectSeccional = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.seccional === 'undefined') {
                preinscripcionControl.visible.validoseccional = true;
            } else {
                preinscripcionControl.visible.validoseccional = false;
            }
        };
        preinscripcionControl.onChangeSelectPeriodo = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.periodo === 'undefined') {
                preinscripcionControl.visible.validoPeriodo = true;
            } else {
                preinscripcionControl.visible.validoPeriodo = false;
            }
        };

        preinscripcionControl.onChangeSelectFormacion = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.formacion === 'undefined') {
                preinscripcionControl.visible.validoformacion = true;
                preinscripcionControl.disabledPrograma = true;
            } else {
                preinscripcionControl.nuevaPreinscripcion.programa = null;
                preinscripcionControl.nuevaPreinscripcion.modalidad = null;
                preinscripcionControl.nuevaPreinscripcion.horario = null;
                preinscripcionControl.visible.validoformacion = false;
                preinscripcionControl.disabledPrograma = false;
                preinscripcionControl.disabledModalidad = true;
                preinscripcionControl.disabledHorario = true;
            }
        };

        preinscripcionControl.onChangeTipoDocumento = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.tipodocumento === 'undefined' ||
                    preinscripcionControl.nuevaPreinscripcion.tipodocumento === null ||
                    preinscripcionControl.nuevaPreinscripcion.tipodocumento === null) {
                preinscripcionControl.disableIdentificacion = true;
                preinscripcionControl.nuevaPreinscripcion.idAspirante = null;
                preinscripcionControl.nuevaPreinscripcion.identificacion = null;
                preinscripcionControl.nuevaPreinscripcion.nombres = null;
                preinscripcionControl.nuevaPreinscripcion.apellidos = null;
                preinscripcionControl.nuevaPreinscripcion.telefono = "";
                preinscripcionControl.nuevaPreinscripcion.celular = null;
                preinscripcionControl.nuevaPreinscripcion.email = null;
                preinscripcionControl.nuevaPreinscripcion.barrio = null;
                preinscripcionControl.nuevaPreinscripcion.institucion = null;
            } else {
                preinscripcionControl.disableIdentificacion = false;
                preinscripcionControl.nuevaPreinscripcion.identificacion = null;
                preinscripcionControl.nuevaPreinscripcion.idAspirante = null;
                preinscripcionControl.nuevaPreinscripcion.nombres = null;
                preinscripcionControl.nuevaPreinscripcion.apellidos = null;
                preinscripcionControl.nuevaPreinscripcion.telefono = null;
                preinscripcionControl.nuevaPreinscripcion.celular = null;
                preinscripcionControl.nuevaPreinscripcion.email = null;
                preinscripcionControl.nuevaPreinscripcion.barrio = null;
                preinscripcionControl.nuevaPreinscripcion.institucion = null;
            }
        };

        preinscripcionControl.onChangeSelectPrograma = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.programa === 'undefined' || preinscripcionControl.nuevaPreinscripcion.programa === null) {
                preinscripcionControl.visible.validoprograma = true;
                preinscripcionControl.disabledModalidad = true;
                preinscripcionControl.visibleMensaje = appGenericConstant.CAMPO_REQUERIDO;
            } else {

                if (preinscripcionControl.nuevaPreinscripcion.formacion.id === 3) {
                    preinscripcionService.buscarConfiguracionByProgramaAndPeriodoAcademico(preinscripcionControl.nuevaPreinscripcion.programa.id, preinscripcionControl.nuevaPreinscripcion.periodo.nombre.id).then(function (data) {
                        if (data.length === 0) {
                            preinscripcionControl.nuevaPreinscripcion.programa = null;
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EDUCACION_NO_CONTINUADA);
                            preinscripcionControl.nuevaPreinscripcion.modalidad = null;
                            preinscripcionControl.nuevaPreinscripcion.horario = null;
                            preinscripcionControl.visible.validoprograma = false;
                            preinscripcionControl.disabledModalidad = true;
                            preinscripcionControl.disabledHorario = true;
                            return;
                        } else {
                            preinscripcionControl.onChangeProgramaDisabled();
                        }
                    }).catch(function (e) {
                        return;
                    });
                } else {
                    preinscripcionControl.onChangeProgramaDisabled();
                }
            }
        };

        preinscripcionControl.onChangeProgramaDisabled = function () {
            preinscripcionControl.nuevaPreinscripcion.modalidad = null;
            preinscripcionControl.nuevaPreinscripcion.horario = null;
            preinscripcionControl.visible.validoprograma = false;
            preinscripcionControl.disabledModalidad = false;
            preinscripcionControl.disabledHorario = true;
        };

        preinscripcionControl.onChangeSelectInstitucion = function () {
            preinscripcionControl.nuevaPreinscripcion.cual = '';
            if (typeof preinscripcionControl.nuevaPreinscripcion.institucion === 'undefined') {
                preinscripcionControl.visible.validoinstitucion = true;
                preinscripcionControl.showCualInstituciones = false;
            } else {
                if (preinscripcionControl.nuevaPreinscripcion.institucion.nombre === appGenericConstant.OTRO) {
                    preinscripcionControl.showCualInstituciones = true;
                } else {
                    preinscripcionControl.showCualInstituciones = false;
                }
                preinscripcionControl.visible.validoinstitucion = false;
            }
        };

        preinscripcionControl.onChangeSelectConvenio = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.convenio === 'undefined') {
                preinscripcionControl.visible.validoconvenio = true;
            } else {
                preinscripcionControl.visible.validoconvenio = false;
            }
        };

        preinscripcionControl.onChangeSelectBarrio = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.barrio === 'undefined') {
                preinscripcionControl.visible.validobarrio = true;
            } else {
                preinscripcionControl.visible.validobarrio = false;
            }
        };

        preinscripcionControl.onChangeSelectDifusion = function () {
            preinscripcionControl.nuevaPreinscripcion.cualMedio = '';
            if (typeof preinscripcionControl.nuevaPreinscripcion.medioDifusion === 'undefined') {
                preinscripcionControl.visible.validodifusion = true;
                preinscripcionControl.showCualDifusion = false;
            } else {
                preinscripcionControl.visible.validodifusion = false;
                if (preinscripcionControl.nuevaPreinscripcion.medioDifusion.id === 173) {
                    preinscripcionControl.showCualDifusion = true;
                } else {
                    preinscripcionControl.showCualDifusion = false;
                }
            }
        };

        preinscripcionControl.botonVolverSi = function (id) {
            if (id === "/#/preinscripcion") {
                preinscripcionControl.visible.es = true;
            }
        };

        preinscripcionControl.botonVolverNo = function (id) {
            if (id === "/#/preinscripcion") {
                preinscripcionControl.visible.es = true;
                $timeout(function () {
                    $('#volverPreIns').remove();
                }, 150);
            }
        };

        preinscripcionControl.onChangeSelectModalidad = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.modalidad === 'undefined') {
                preinscripcionControl.visible.validomodalidad = true;
                preinscripcionControl.disabledHorario = true;
            } else {
                preinscripcionControl.visible.validomodalidad = false;
                preinscripcionControl.disabledHorario = false;
                var idListAux;
                preinscripcionControl.horariosList = [];
                preinscripcionControl.nuevaPreinscripcion.horario = null;
                angular.forEach(preinscripcionControl.horariosListAux, function (value, key) {
                    idListAux = value.id;
                    angular.forEach(preinscripcionControl.horariosListAuxListaValor, function (value, key) {
                        if (preinscripcionControl.nuevaPreinscripcion.modalidad.id.toString() === value.referencia) {
                            if (idListAux === value.id) {
                                var horario = {
                                    id: value.id,
                                    nombre: value.nombre
                                };
                                preinscripcionControl.horariosList.push(horario);
                                angular.break;
                            }
                        }
                    });
                });
            }
        };

        preinscripcionControl.onChangeSelectHorario = function () {
            if (typeof preinscripcionControl.nuevaPreinscripcion.horario === 'undefined') {
                preinscripcionControl.visible.validohorario = true;
            } else {
                preinscripcionControl.visible.validohorario = false;
            }
        };

        preinscripcionControl.onGuardar = function () {
            preinscripcionControl.visible.validocelular = false;
            preinscripcionControl.visible.validotelefonosize = false;
            preinscripcionControl.visible.validocelularsize = false;
            preinscripcionControl.visible.validarFormulario = false;
            if ($scope.formpreinscripcion.email.$error.pattern) {
                return;
            }
            if (!new ValidationService().checkFormValidity($scope.formpreinscripcion)) {
                preinscripcionControl.visible.validarFormulario = true;
            }
            if (true) {
                if (typeof preinscripcionControl.nuevaPreinscripcion.modalidad === 'undefined' || preinscripcionControl.nuevaPreinscripcion.modalidad === null) {
                    preinscripcionControl.visible.validomodalidad = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.horario === 'undefined' || preinscripcionControl.nuevaPreinscripcion.horario === null) {
                    preinscripcionControl.visible.validohorario = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.periodo === 'undefined') {
                    preinscripcionControl.visible.validoPeriodo = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.seccional === 'undefined') {
                    preinscripcionControl.visible.validoseccional = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.formacion === 'undefined') {
                    preinscripcionControl.visible.validoformacion = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.programa === 'undefined' || preinscripcionControl.nuevaPreinscripcion.programa === null) {
                    preinscripcionControl.visible.validoprograma = true;
                    preinscripcionControl.visibleMensaje = appGenericConstant.CAMPO_REQUERIDO;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.institucion === 'undefined') {
                    preinscripcionControl.visible.validoinstitucion = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.convenio === 'undefined') {
                    preinscripcionControl.visible.validoconvenio = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.barrio === 'undefined') {
                    preinscripcionControl.visible.validobarrio = true;
                } else {
                    preinscripcionControl.visible.validobarrio = false;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.medioDifusion === 'undefined') {
                    preinscripcionControl.visible.validodifusion = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.celular === 'undefined' || preinscripcionControl.nuevaPreinscripcion.celular === '') {
                    preinscripcionControl.visible.validocelular = true;
                }
                if (typeof preinscripcionControl.nuevaPreinscripcion.celular !== 'undefined') {
                    if (preinscripcionControl.nuevaPreinscripcion.celular.length < 10) {
                        preinscripcionControl.visible.validocelularsize = true;
                        return;
                    }
                }
                if (preinscripcionControl.visible.validarFormulario) {
                    return;
                }
            }
            preinscripcionControl.onIrRegistrar();
        };

        preinscripcionControl.onValidarCelular = function () {
            preinscripcionControl.visible.validocelular = false;
            preinscripcionControl.visible.validocelularsize = false;
            if (typeof preinscripcionControl.nuevaPreinscripcion.celular === 'undefined' || preinscripcionControl.nuevaPreinscripcion.celular === '') {
                preinscripcionControl.visible.validocelular = true;
                return;
            }
            if (typeof preinscripcionControl.nuevaPreinscripcion.celular !== 'undefined') {
                if (preinscripcionControl.nuevaPreinscripcion.celular.length < 10) {
                    preinscripcionControl.visible.validotelefono = false;
                    preinscripcionControl.visible.validocelularsize = true;
                    return;
                }
            }
        };

        preinscripcionControl.onLimpiar = function () {
            preinscripcionControl.nuevaPreinscripcion.seccional = null;
            preinscripcionControl.nuevaPreinscripcion.formacion = null;
            preinscripcionControl.nuevaPreinscripcion.programa = null;
            preinscripcionControl.nuevaPreinscripcion.convenio = null;
            preinscripcionControl.nuevaPreinscripcion.modalidad = null;
            preinscripcionControl.nuevaPreinscripcion.horario = null;
            preinscripcionControl.nuevaPreinscripcion.medioDifusion = null;
            preinscripcionControl.nuevaPreinscripcion.cualMedio = null;
            preinscripcionControl.nuevaPreinscripcion.tipodocumento = null;
            preinscripcionControl.nuevaPreinscripcion.identificacion = null;
            preinscripcionControl.nuevaPreinscripcion.nombres = null;
            preinscripcionControl.nuevaPreinscripcion.apellidos = null;
            preinscripcionControl.nuevaPreinscripcion.telefono = "";
            preinscripcionControl.nuevaPreinscripcion.celular = "";
            preinscripcionControl.nuevaPreinscripcion.email = null;
            preinscripcionControl.nuevaPreinscripcion.cual = null;
            preinscripcionControl.nuevaPreinscripcion.barrio = null;
            preinscripcionControl.nuevaPreinscripcion.institucion = null;
            preinscripcionControl.nuevaPreinscripcion.programa = null;
            preinscripcionControl.nuevaPreinscripcion.modalidad = null;
            preinscripcionControl.nuevaPreinscripcion.horario = null;
        };

        preinscripcionControl.onIrRegistrar = function () {
            var preinscripcionobj = {
                solicitudInscripcionDTO: {
                    idPeriodoAcademico: preinscripcionControl.nuevaPreinscripcion.periodo.nombre.id,
                    idSeccional: preinscripcionControl.nuevaPreinscripcion.seccional.id,
                    idNivelFormacion: preinscripcionControl.nuevaPreinscripcion.formacion.id,
                    idPrograma: preinscripcionControl.nuevaPreinscripcion.programa.id,
                    idTipoConvenio: preinscripcionControl.nuevaPreinscripcion.convenio.id,
                    idModalidad: preinscripcionControl.nuevaPreinscripcion.modalidad.id,
                    idHorario: preinscripcionControl.nuevaPreinscripcion.horario.id,
                    idMedioDifusion: preinscripcionControl.nuevaPreinscripcion.medioDifusion.id,
                    otroMedioDifusion: preinscripcionControl.nuevaPreinscripcion.cualMedio
                },
                idIdentificacionDTO: {
                    idTipoIdentificacion: preinscripcionControl.nuevaPreinscripcion.tipodocumento.codigo,
                    identificacion: preinscripcionControl.nuevaPreinscripcion.identificacion
                },
                id: preinscripcionControl.nuevaPreinscripcion.idAspirante,
                nombre: appConstant.VALIDAR_STRING(preinscripcionControl.nuevaPreinscripcion.nombres),
                apellido: appConstant.VALIDAR_STRING(preinscripcionControl.nuevaPreinscripcion.apellidos),
                telefono: preinscripcionControl.nuevaPreinscripcion.telefono,
                celular: preinscripcionControl.nuevaPreinscripcion.celular,
                email: preinscripcionControl.nuevaPreinscripcion.email,
                idBarrio: preinscripcionControl.nuevaPreinscripcion.barrio.id,
                idInstitucion: preinscripcionControl.nuevaPreinscripcion.institucion.id,
                otraInstitucion: preinscripcionControl.nuevaPreinscripcion.cual
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            preinscripcionService.registrarPreinscripcion(preinscripcionobj).then(function (data) {
                if (data.tipo === 200) {
                    swal({
                        title: 'Felicitaciones',
                        text: 'Estimado(a) ' + appConstant.VALIDAR_STRING(preinscripcionControl.nuevaPreinscripcion.nombres) + ' ' + appConstant.VALIDAR_STRING(preinscripcionControl.nuevaPreinscripcion.apellidos)
                                + ' identificado(a) con ' + preinscripcionControl.nuevaPreinscripcion.tipodocumento.valor + ' No. ' + preinscripcionControl.nuevaPreinscripcion.identificacion
                                + ', su proceso de pre-inscripción en el programa ' + preinscripcionControl.nuevaPreinscripcion.programa.nombre + ' para el período académico '
                                + preinscripcionControl.nuevaPreinscripcion.periodo.nombre.nombre + ' se ha realizado satisfactoriamente.',
                        type: appGenericConstant.SUCCESS,
                        confirmButtonText: appGenericConstant.ACEPTAR,
                        allowOutsideClick: false
                    }).then(function (isConfirm) {

                    });
                    preinscripcionControl.nuevaPreinscripcion = {};
                    preinscripcionService.preinscripcion = {};
                    preinscripcionControl.ejecutarConsultarPeriodoAcademico();
                    preinscripcionControl.disabledPrograma = true;
                    preinscripcionControl.disabledModalidad = true;
                    preinscripcionControl.disabledHorario = true;
                    preinscripcionControl.visible.validoformacion = false;
                    preinscripcionControl.showCualInstituciones = false;
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
            new ValidationService().resetForm($scope.formpreinscripcion);
        };

        preinscripcionControl.ejecutarConsultarPeriodoAcademico = function () {
            preinscripcionService.consultarPeriodoAcademico().then(function (data) {
                if (data.length === 0) {
                    preinscripcionControl.visible.hayPeriodo = true;
                } else {
                    preinscripcionControl.visible.hayPeriodo = false;
                    preinscripcionControl.periodosAcademicos = [];
                    angular.forEach(data, function (value, key) {
                        var periodo = {
                            id: value.id,
                            nombre: value.nombrePeriodoAcademico
                        };
                        preinscripcionControl.periodosAcademicos.push(periodo);
                    });
                }
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.ejecutarConsultarSeccional = function () {
            preinscripcionService.consultarSeccional().then(function (data) {
                preinscripcionControl.seccionales = [];

                angular.forEach(data, function (value, key) {
                    var seccional = {
                        id: value.id,
                        nombre: value.nombreSeccional
                    };
                    preinscripcionControl.seccionales.push(seccional);
                });
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.ejecutarConsultarNivelFormacion = function () {
            preinscripcionService.consultarNivelFormacion().then(function (data) {
                preinscripcionControl.nivelesformacion = [];
                preinscripcionControl.nivelesformacion = data;
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.onFiltrarProgramaPorNivelFormacion = function (item, item2) {
            preinscripcionControl.visible.esvacialistaprograma = false;
            preinscripcionControl.visible.validanivelformacion = false;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (item !== undefined && item2 !== undefined) {
                preinscripcionService.consultarProgramaPorNivel(item.id, item2.id).then(function (data) {
                    preinscripcionControl.programas = [];
                    if (data !== null && data.tipo !== 500) {
                        angular.forEach(data, function (value, key) {
                            var programa = {
                                id: value.id,
                                nombre: value.nombrePrograma,
                                modalidades: value.idModalidades,
                                horarios: value.idHorarios
                            };
                            preinscripcionControl.programas.push(programa);
                        });
                    }
                    appConstant.CERRAR_SWAL();
                    if (preinscripcionControl.programas.length === 0) {
                        preinscripcionControl.visible.noencontroprograma = true;
                        preinscripcionControl.visible.esvacialistaprograma = true;
                        preinscripcionControl.visible.validoprograma = true;

                        preinscripcionControl.visibleMensaje = appGenericConstant.NO_PROGRAMA_PLANEACION;
                    } else {
                        preinscripcionControl.visible.validoprograma = false;
                        preinscripcionControl.visibleMensaje = "";
                    }
                }).catch(function (e) {
                    preinscripcionControl.programas = [];
                    preinscripcionControl.visible.esvacialistaprograma = true;
                    //throw e;
                    return;
                });
            } else {
                appConstant.CERRAR_SWAL();
            }
        };

        preinscripcionControl.onFiltrarModalidadYHorarioPorPorgrama = function (item) {
            preinscripcionControl.modalidadesList = [];
            preinscripcionControl.horariosListAux = [];
            angular.forEach(item.modalidades, function (value, key) {
                var modalidad = {
                    id: value.id,
                    nombre: value.nombreModalidad
                };
                preinscripcionControl.modalidadesList.push(modalidad);
            });

            angular.forEach(item.horarios, function (value, key) {
                var horario = {
                    id: value.id,
                    nombre: value.nombreHorario
                };
                preinscripcionControl.horariosListAux.push(horario);
            });
        };

        preinscripcionControl.onBlurConsultarAspirante = function () {
            appConstant.MSG_LOADING(appGenericConstant.CONSULTANDO_DATOS_ESPERE);
            appConstant.CARGANDO();


            var idIdentificacionDTO = {
                idTipoIdentificacion: preinscripcionControl.nuevaPreinscripcion.tipodocumento.codigo,
                identificacion: preinscripcionControl.nuevaPreinscripcion.identificacion
            };

            if (idIdentificacionDTO.identificacion !== null && idIdentificacionDTO.identificacion !== "" && idIdentificacionDTO.identificacion !== undefined) {
                preinscripcionControl.disabledInstituciones = true;
                preinscripcionService.consultarAspirante(idIdentificacionDTO).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    if (data.objectResponse !== null) {
                        preinscripcionControl.nuevaPreinscripcion.idAspirante = data.objectResponse.id;
                        preinscripcionControl.nuevaPreinscripcion.nombres = data.objectResponse.nombre;
                        preinscripcionControl.nuevaPreinscripcion.apellidos = data.objectResponse.apellido;
                        preinscripcionControl.nuevaPreinscripcion.telefono = data.objectResponse.telefono;
                        preinscripcionControl.nuevaPreinscripcion.celular = data.objectResponse.celular;
                        preinscripcionControl.nuevaPreinscripcion.email = data.objectResponse.email;

                        for (var i = 0; i < preinscripcionControl.barrios.length; i++) {
                            if (preinscripcionControl.barrios[i].id === data.objectResponse.idBarrio) {
                                preinscripcionControl.nuevaPreinscripcion.barrio = {};
                                preinscripcionControl.nuevaPreinscripcion.barrio.id = preinscripcionControl.barrios[i].id;
                                preinscripcionControl.nuevaPreinscripcion.barrio.nombre = preinscripcionControl.barrios[i].nombre;
                                break;
                            }
                        }

                        for (var i = 0; i < preinscripcionControl.colegios.length; i++) {
                            if (preinscripcionControl.colegios[i].id === data.objectResponse.idInstitucion) {
                                preinscripcionControl.nuevaPreinscripcion.institucion = {};
                                preinscripcionControl.nuevaPreinscripcion.institucion.id = preinscripcionControl.colegios[i].id;
                                preinscripcionControl.nuevaPreinscripcion.institucion.nombre = preinscripcionControl.colegios[i].nombre;

                                if (preinscripcionControl.nuevaPreinscripcion.institucion.nombre.toUpperCase() === appGenericConstant.OTRO) {
                                    preinscripcionControl.nuevaPreinscripcion.cual = data.objectResponse.otroInstitucion;
                                    preinscripcionControl.showCualInstituciones = true;
                                }
                                break;
                            }
                        }
                    } else {
                        appConstant.CERRAR_SWAL();
                        preinscripcionControl.disabledInstituciones = false;
                        preinscripcionControl.nuevaPreinscripcion.nombres = null;
                        preinscripcionControl.nuevaPreinscripcion.apellidos = null;
                        preinscripcionControl.nuevaPreinscripcion.telefono = "";
                        preinscripcionControl.nuevaPreinscripcion.celular = null;
                        preinscripcionControl.nuevaPreinscripcion.email = null;
                        preinscripcionControl.nuevaPreinscripcion.barrio = null;
                        preinscripcionControl.nuevaPreinscripcion.institucion = null;
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });

            } else {
                preinscripcionControl.disabledInstituciones = false;
                preinscripcionControl.nuevaPreinscripcion.nombres = null;
                preinscripcionControl.nuevaPreinscripcion.apellidos = null;
                preinscripcionControl.nuevaPreinscripcion.telefono = "";
                preinscripcionControl.nuevaPreinscripcion.celular = null;
                preinscripcionControl.nuevaPreinscripcion.email = null;
                preinscripcionControl.nuevaPreinscripcion.barrio = null;
                preinscripcionControl.nuevaPreinscripcion.institucion = null;
                appConstant.CERRAR_SWAL();

            }

        };

        preinscripcionControl.ejecutarConsultarTipoDocumentos = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                preinscripcionControl.lsttipodocumentos = [];
                preinscripcionControl.lsttipodocumentos = data;
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.ejecutarMediosDifusion = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MEDIO_DIFUSION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                preinscripcionControl.medioDifusion = [];
                angular.forEach(data, function (value, key) {
                    var medio = {
                        id: value.codigo,
                        nombre: value.valor
                    };
                    preinscripcionControl.medioDifusion.push(medio);
                });
                preinscripcionControl.medioDifusion.sort();
            }).catch(function (e) {
                return;
            });
        };


        preinscripcionControl.onBuscarBarrios = function () {
            preinscripcionService.consultarBarrios().then(function (data) {
                preinscripcionControl.barrios = [];
                angular.forEach(data, function (value, key) {
                    var barrio = {
                        id: value.id,
                        nombre: value.nombreBarrio
                    };
                    preinscripcionControl.barrios.push(barrio);
                });
                preinscripcionControl.barrios.sort();
            });
        };


        preinscripcionControl.ejecutarConsultarTiposConvenios = function () {
            preinscripcionService.consultarTipoConvenio().then(function (data) {
                preinscripcionControl.convenios = [];
                angular.forEach(data, function (value, key) {
                    var convenio = {
                        id: value.id,
                        codigo: value.codigoTipoConvenio,
                        nombre: value.nombreTipoConvenio,
                        estado: value.estado
                    };
                    preinscripcionControl.convenios.push(convenio);
                });
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.ejecutarConsultarColegio = function () {
            preinscripcionService.consultarColegio().then(function (data) {
                preinscripcionControl.colegios = [];
                angular.forEach(data, function (value, key) {
                    var institucion = {
                        id: value.id,
                        nombre: value.nombreInstitucionAcademica
                    };
                    preinscripcionControl.colegios.push(institucion);
                });
            }).catch(function (e) {
                return;
            });
        };

        preinscripcionControl.ejecturarConsultarHorario = function () {
            preinscripcionControl.horariosListAuxListaValor = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var horario = {
                        id: value.codigo,
                        nombre: value.valor,
                        referencia: value.referencia
                    };
                    preinscripcionControl.horariosListAuxListaValor.push(horario);
                });
            }).catch(function (e) {
                return;
            });

        };

        preinscripcionControl.ejecutarConsultarPeriodoAcademico();
        preinscripcionControl.ejecutarConsultarTiposConvenios();
        preinscripcionControl.ejecutarConsultarColegio();
        preinscripcionControl.ejecutarConsultarTipoDocumentos();
        //        preinscripcionControl.ejecutarConsultarPrograma();
        preinscripcionControl.ejecutarConsultarNivelFormacion();
        preinscripcionControl.ejecutarConsultarSeccional();
        preinscripcionControl.onBuscarBarrios();
        preinscripcionControl.ejecutarMediosDifusion();
        preinscripcionControl.ejecturarConsultarHorario();
        preinscripcionControl.resetValidation();
    }
})();
