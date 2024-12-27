(function () {
    'use strict';
    angular.module('mytodoApp').controller('cambioHorarioCtrl', cambioHorarioCtrl);
    cambioHorarioCtrl.$inject = ['$scope', 'cambioHorarioServices', 'ValidationService', 'utilServices', 'appConstant', 'preinscripcionService', 'appConstantValueList', 'appGenericConstant', 'localStorageService'];
    function cambioHorarioCtrl($scope, cambioHorarioServices, ValidationService, utilServices, appConstant, cambioHorario, appConstantValueList, appGenericConstant, localStorageService) {
        var cambioHorario = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        $(document).ready(function () {
            $('#divDatosEstudiante').hide();

            $('#divIdentificacion').hide();
            $('#divPAcademico').hide();
            $('#divProgramaAcademico').hide();
            $('#divSemestre').hide();
            $('#btnConsultarHistoral').hide();
            //    $('#btnCodigoConsultar').prop('disabled', true);
//            $('#inputCodigo').keyup(function () {
//                $('#btnCodigoConsultar').prop('disabled', this.value === "" ? true : false);
//            });
//            $("#inputCodigo").onchange
            $("#inputCodigo").on("input", function () {
                var regexp = /[^0-9]/g;
                if ($(this).val().match(regexp)) {
                    $(this).val($(this).val().replace(regexp, ''));
                }
            });
        });

        cambioHorario.estudainteList = [];
        cambioHorario.estudiante = cambioHorarioServices.estudiante;
        cambioHorario.estudiante.programa = null;
        cambioHorario.visible = cambioHorarioServices.visible;


        cambioHorario.identificacionConsultar = null;
        cambioHorario.disabledHorario = true;
        cambioHorario.disabledModalidad = true;


        cambioHorario.programas = [];
        cambioHorario.modalidadesList = [];
        cambioHorario.horariosList = [];
        cambioHorario.horariosListAux = [];


        cambioHorario.cAcademico;
        cambioHorario.inscritos = [];
        cambioHorario.nivelesFormacion = [];
        cambioHorario.horariosListAuxListaValor = [];
        cambioHorario.filtrados = [];
        cambioHorario.display;
        cambioHorario.options = appConstant.FILTRO_TABLAS;

        cambioHorario.selectedOption = cambioHorario.options[0];
        cambioHorario.report = {
            selected: null
        };



        cambioHorario.periodosAcademicos = [];
        cambioHorario.seccionales = [];
        cambioHorario.nivelesformacion = [];
        cambioHorario.horariosListAuxListaValor = [];
        cambioHorario.lsttipodocumentos = [];
        cambioHorario.colegios = [];
        cambioHorario.convenios = [];
        cambioHorario.periodos = [];
        cambioHorario.medioDifusion = [];
        cambioHorario.showCualInstituciones = false;
        cambioHorario.showCualDifusion = false;
        cambioHorario.disableIdentificacion = true;
        cambioHorario.disabledInstituciones = false;



        cambioHorario.onConsultarEstudiante = function (identificacion) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();


            cambioHorarioServices.buscarEstudianteByCodigo(identificacion).then(function (data) {
                if (data === null || data === undefined || data.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_EXISTE);
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    $('#divDatosEstudiante').show();
                    cambioHorario.estudainteList = [];
                    cambioHorario.estudiante.tipoDocumento = data[0].tipoDocumento;
                    cambioHorario.estudiante.identificacion = data[0].identificacionAspirante;
                    cambioHorario.estudiante.nombres = data[0].nombreAspirante;
                    cambioHorario.estudiante.apellidos = data[0].apellidoAspirante;
                    cambioHorario.estudiante.programas = data[0].programa;
//                    cambioHorario.estudiante.semestreActual = data[0].semestreActual;
//                    cambioHorario.estudiante.semestreCambiar = data[0].semestreCambiar;

                    cambioHorario.programas = [];
                    angular.forEach(cambioHorario.estudiante.programas, function (value, key) {
                        cambioHorarioServices.consultarProgramaPorEstudiante(value.idPrograma).then(function (data) {

                            var item = {
                                id: data.id,
                                nombre: data.nombrePrograma,
                                modalidades: data.idModalidades,
                                horarios: data.idHorarios,
                                semestre: value.semestreActual
                            };

                            cambioHorario.programas.push(item);

                            if (cambioHorario.programas !== null || cambioHorario.programas !== undefined || cambioHorario.programas.length !== 0) {
                                cambioHorario.estudiante.programa = cambioHorario.programas[0];
                                cambioHorario.estudiante.semestreActual = cambioHorario.programas[0].semestre;
                                cambioHorario.onFiltrarModalidadYHorarioPorPorgrama(cambioHorario.estudiante.programa);
                                cambioHorario.disabledModalidad = false;
                                cambioHorario.disabledHorario = false;
                                appConstant.CERRAR_SWAL();
                            }

                        }).catch(function (e) {
                            appConstant.MSG_GROWL_ERROR();
                            return;
                        });

                    });

                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };


        cambioHorario.onFiltrarModalidadYHorarioPorPorgrama = function (item) {
            cambioHorario.modalidadesList = [];
            cambioHorario.horariosListAux = [];
            cambioHorario.programAux;


            angular.forEach(cambioHorario.estudiante.programas, function (value, key) {
                if (value.idPrograma === item.id) {
                    cambioHorario.programAux = value;
                }
            });

            angular.forEach(item.modalidades, function (value, key) {
                var modalidad = {
                    id: value.id,
                    nombre: value.nombreModalidad
                };
                if (value.id === cambioHorario.programAux.idModalidad) {
                    cambioHorario.estudiante.modalidad = modalidad;
                }
                cambioHorario.modalidadesList.push(modalidad);

            });

            angular.forEach(item.horarios, function (value, key) {
                var horario = {
                    id: value.idHorario,
                    nombre: value.nombreHorario
                };

                cambioHorario.horariosListAux.push(horario);

                if (value.idHorario === cambioHorario.programAux.idHorario) {
                    cambioHorario.estudiante.horario = horario;
                }
            });
            cambioHorario.horarioAux = cambioHorario.estudiante.horario;
            cambioHorario.onChangeSelectModalidad();
            cambioHorario.estudiante.horario = cambioHorario.horarioAux;

        };


        //Metodos de guardado

        cambioHorario.onGuardar = function () {
            cambioHorario.visible.validarFormulario = false;

            if (!new ValidationService().checkFormValidity($scope.formCambioHorario)) {
                cambioHorario.visible.validarFormulario = true;
            }
            if (true) {
                if (typeof cambioHorario.estudiante.modalidad === 'undefined' || cambioHorario.estudiante.modalidad === null) {
                    cambioHorario.visible.validomodalidad = true;
                }
                if (typeof cambioHorario.estudiante.horario === 'undefined' || cambioHorario.estudiante.horario === null) {
                    cambioHorario.visible.validohorario = true;
                }
                if (typeof cambioHorario.estudiante.periodo === 'undefined') {
                    cambioHorario.visible.validoPeriodo = true;
                }

                if (cambioHorario.visible.validarFormulario) {
                    return;
                }
            }
            cambioHorario.onIrRegistrar();
        };

        cambioHorario.onIrRegistrar = function () {

            angular.forEach(cambioHorario.estudiante.programas, function (value, key) {
                if (value.idPrograma === cambioHorario.estudiante.programa.id) {
                    cambioHorario.programaAux = value;
                }
            });

            var nuevoHorarioObj = {
                programa: [{
                        idSolicitud: cambioHorario.programaAux.idSolicitud,
                        idPrograma: cambioHorario.estudiante.programa.id,
                        idModalidad: cambioHorario.estudiante.modalidad.id,
                        idHorario: cambioHorario.estudiante.horario.id,
                        idEstudiante: cambioHorario.programaAux.idEstudiante
                    }],
                modalidadAnterior: cambioHorario.programaAux.idModalidad,
                horarioAnterior: cambioHorario.programaAux.idHorario,
                modalidadNueva: cambioHorario.estudiante.modalidad.id,
                horarioNuevo: cambioHorario.estudiante.horario.id,
                idUsuario: localStorageService.get('usuario').id


            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            cambioHorarioServices.cambiarHorarioEstudiante(nuevoHorarioObj).then(function (data) {
                if (data.tipo === 200) {
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.CAMBIO_HORARIO);
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

        cambioHorario.onIrRegistrarSemestre = function () {

            if (cambioHorario.estudiante.semestreCambiar === "" || cambioHorario.estudiante.semestreCambiar === null ||
                    cambioHorario.estudiante.semestreCambiar === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA("DEBE SELECCIONAR SEMESTRE");

            }

            angular.forEach(cambioHorario.estudiante.programas, function (value, key) {
                if (value.idPrograma === cambioHorario.estudiante.programa.id) {
                    cambioHorario.programaAux = value;
                }
            });

            var nuevoHorarioObj = {
                programa: [{
                        idSolicitud: cambioHorario.programaAux.idSolicitud,
                        idPrograma: cambioHorario.estudiante.programa.id,
                        idModalidad: cambioHorario.estudiante.modalidad.id,
                        idHorario: cambioHorario.estudiante.horario.id,
                        idEstudiante: cambioHorario.programaAux.idEstudiante
                    }],
                semestreActual: cambioHorario.estudiante.semestreActual,
                semestreCambiar: cambioHorario.estudiante.semestreCambiar,
                idUsuario: localStorageService.get('usuario').id
            };

            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            cambioHorarioServices.cambiarSemestreEstudiante(nuevoHorarioObj).then(function (data) {
                if (data.tipo === 200) {
                    $('#divDatosEstudiante').hide();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.CAMBIO_HORARIO);
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

        //Metodos change

        cambioHorario.onChangeSelectPrograma = function () {
            if (typeof cambioHorario.estudiante.programa === 'undefined' || cambioHorario.estudiante.programa === null) {
                cambioHorario.visible.validoprograma = true;
                cambioHorario.disabledModalidad = true;
                cambioHorario.visibleMensaje = appGenericConstant.CAMPO_REQUERIDO;
            } else {
                cambioHorario.estudiante.semestreActual = cambioHorario.estudiante.programa.semestre;
                cambioHorario.visible.validoprograma = false;
                cambioHorario.disabledModalidad = false;
                cambioHorario.disabledHorario = false;
            }
        };

        cambioHorario.onChangeSelectModalidad = function () {
            if (typeof cambioHorario.estudiante.modalidad === 'undefined') {
                cambioHorario.visible.validomodalidad = true;
                cambioHorario.disabledHorario = true;
            } else {
                cambioHorario.visible.validomodalidad = false;
                cambioHorario.disabledHorario = false;
                var idListAux;
                cambioHorario.horariosList = [];
                cambioHorario.estudiante.horario = null;
                angular.forEach(cambioHorario.horariosListAux, function (value, key) {
                    idListAux = value.id;
                    angular.forEach(cambioHorario.horariosListAuxListaValor, function (value, key) {
                        if (cambioHorario.estudiante.modalidad.id.toString() === value.referencia) {
                            if (idListAux === value.id) {
                                var horario = {
                                    id: value.id,
                                    nombre: value.nombre
                                };
                                cambioHorario.horariosList.push(horario);
                                angular.break;
                            }
                        }
                    });
                });
            }
        };

        cambioHorario.onChangeSelectHorario = function () {
            if (typeof cambioHorario.estudiante.horario === 'undefined') {
                cambioHorario.visible.validohorario = true;
            } else {
                cambioHorario.visible.validohorario = false;
            }
        };

        cambioHorario.ejecturarConsultarHorario = function () {
            cambioHorario.horariosListAuxListaValor = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var horario = {
                        id: value.codigo,
                        nombre: value.valor,
                        referencia: value.referencia
                    };
                    cambioHorario.horariosListAuxListaValor.push(horario);
                });
            }).catch(function (e) {
                return;
            });

        };

        cambioHorario.ejecturarConsultarHorario();

    }
})();

