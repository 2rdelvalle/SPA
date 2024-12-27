(function () {
    'use strict';
    angular.module('mytodoApp').controller('homologarCtrl', homologarCtrl);
    homologarCtrl.$inject = ['$scope', 'homologarService', 'ValidationService', 'utilServices', 'appConstant', 'appConstantValueList', 'appGenericConstant', 'localStorageService'];
    function homologarCtrl($scope, homologarService, ValidationService, utilServices, appConstant, appConstantValueList, appGenericConstant, localStorageService) {
        var homologar = this;
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
            $("#inputCodigo").on("input", function () {
                var regexp = /[^0-9]/g;
                if ($(this).val().match(regexp)) {
                    $(this).val($(this).val().replace(regexp, ''));
                }
            });
        });

        homologar.estudainteList = [];
        homologar.estudiante = homologarService.estudiante;
        homologar.estudiante.programa = null;
        homologar.visible = homologarService.visible;
        homologar.listaModulos = [];

        homologar.identificacionConsultar = null;
        homologar.disabledHorario = true;
        homologar.disabledModalidad = true;


        homologar.programas = [];
        homologar.modalidadesList = [];
        homologar.horariosList = [];
        homologar.horariosListAux = [];


        homologar.cAcademico;
        homologar.inscritos = [];
        homologar.nivelesFormacion = [];
        homologar.horariosListAuxListaValor = [];
        homologar.filtrados = [];
        homologar.display;
        homologar.options = appConstant.FILTRO_TABLAS;

        homologar.selectedOption = homologar.options[0];
        homologar.report = {
            selected: null
        };



        homologar.periodosAcademicos = [];
        homologar.seccionales = [];
        homologar.nivelesformacion = [];
        homologar.horariosListAuxListaValor = [];
        homologar.lsttipodocumentos = [];
        homologar.colegios = [];
        homologar.convenios = [];
        homologar.periodos = [];
        homologar.medioDifusion = [];
        homologar.showCualInstituciones = false;
        homologar.showCualDifusion = false;
        homologar.disableIdentificacion = true;
        homologar.disabledInstituciones = false;



        homologar.onConsultarEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();

                homologar.estudiante.programa = null;
                homologar.estudiante = {};
                homologarService.buscarEstudianteByCodigo(identificacion).then(function (data) {
                    if (data === null || data === undefined || data.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_EXISTE);
                        $('#divDatosEstudiante').hide();
                        appConstant.CERRAR_SWAL();
                        return;
                    } else {
                        $('#divDatosEstudiante').show();
                        homologar.estudainteList = [];
                        homologar.estudiante.tipoDocumento = data[0].tipoDocumento;
                        homologar.estudiante.identificacion = data[0].identificacionAspirante;
                        homologar.estudiante.nombres = data[0].nombreAspirante;
                        homologar.estudiante.apellidos = data[0].apellidoAspirante;
                        homologar.estudiante.programas = data[0].programa;


                        homologar.programas = [];
                        angular.forEach(homologar.estudiante.programas, function (value, key) {
                            homologarService.consultarProgramaPorEstudiante(value.idPrograma).then(function (data) {

                                var item = {
                                    id: data.id,
                                    nombre: data.nombrePrograma,
                                    modalidades: data.idModalidades,
                                    horarios: data.idHorarios
                                };

                                homologar.programas.push(item);

                                if (homologar.programas !== null || homologar.programas !== undefined || homologar.programas.length !== 0) {
                                    homologar.disabledModalidad = false;
                                    homologar.disabledHorario = false;
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

                appConstant.CERRAR_SWAL();


            }
        };




        //Metodos de guardado

        homologar.onGuardar = function () {
            homologar.visible.validarFormulario = false;

            if (homologar.estudiante.programa === null || homologar.estudiante.programa === undefined || homologar.estudiante.programa === "") {
                appConstant.MSG_GROWL_ADVERTENCIA('No se ha seleccionado programa académico');
                return;
            }
            var m;
            var bandera = true;
            for (m = 0; m < homologar.listaDetalleMalla.length; m++) {
                if (homologar.listaDetalleMalla[m].seleccionado) {
                    homologar.onIrRegistrar();
                    bandera = false;
                    break;
                }
            }

            if (bandera) {
                appConstant.MSG_GROWL_ADVERTENCIA('No ha seleccionado por lo menos un módulo a homologar');

            }

        };

        homologar.onIrRegistrar = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            angular.forEach(homologar.estudiante.programas, function (value, key) {
                if (value.idPrograma === homologar.estudiante.programa.id) {
                    homologar.programaAux = value;
                }
            });

            var nuevoHorarioObj = {};
            var nuevoHorarioObj = {
                id: null,
                idEstudiante: homologar.programaAux.idEstudiante,
                idPrograma: homologar.estudiante.programa.id,
                idPeriodoAcademico: 0,
                idHorario: homologar.programaAux.idHorario,
                nota1: 0.0,
                nota2: 0.0,
                nota3: 0.0,
                notaHabilitacion: 0.0,
                notaDefinitiva: 0.0,
                fechaMatricula: null,
                estadoMatricula: null,
                idUsuario: localStorageService.get("usuario").id
            };
            nuevoHorarioObj.listaModulosHomologar = [];
            angular.forEach(homologar.listaDetalleMalla, function (value, key) {
                if (value.seleccionado) {
                    nuevoHorarioObj.listaModulosHomologar.push(value);
                }
            });

            homologarService.cambiarHorarioEstudiante(nuevoHorarioObj).then(function (data) {
                if (data.tipo === 200) {
                    $('#divDatosEstudiante').hide();
                    homologar.listaDetalleMalla = [];
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
        }
        ;

        function onConsultarModulo() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            homologarService.buscarModulo().then(function (data) {
                homologar.listaModulos = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        }



        homologar.onChangeSelectPrograma = function () {
            if (typeof homologar.estudiante.programa === 'undefined' || homologar.estudiante.programa === null) {
                homologar.visible.validoprograma = true;
                homologar.disabledModalidad = true;
                homologar.visibleMensaje = appGenericConstant.CAMPO_REQUERIDO;
            } else {
                homologar.visible.validoprograma = false;
                homologar.disabledModalidad = false;
                homologar.disabledHorario = false;

                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();

                homologarService.buscarMallaByPrograma(homologar.estudiante.programa.id).then(function (data) {

                    if (data === "" || data === null || data === undefined) {
                        appConstant.MSG_GROWL_ADVERTENCIA("No se encontró malla académica asociada al programa seleccionado.");
                        homologar.listaDetalleMalla = [];
                        appConstant.CERRAR_SWAL();
                        return;
                    }
                    homologarService.buscarMallaDetalle(data.id).then(function (data) {
                        homologar.listaDetalleMalla = [];
                        homologar.obMalla = {};
                        var i;
                        var j;
                        for (i = 0; i < data.length; i++) {
                            if ("ACTIVO" === data[i].estado) {
                                homologar.obMalla = data[i];
                                break;
                            }
                        }

                        angular.forEach(homologar.obMalla.detalleMallaAcademica, function (value, key) {
                            var objTablaDetalleMalla = {
                                id: value.id,
                                idMallaAcademica: value.idMallaAcademica,
                                idModulo: value.idModulo,
                                numeroNivel: parseInt(value.numeroNivel),
                                seleccionado: false,
                                nota1: 0.0,
                                nota2: 0.0,
                                nota3: 0.0
                            };

                            for (i = 0; i < homologar.listaModulos.length; i++) {
                                if (objTablaDetalleMalla.idModulo === homologar.listaModulos[i].id) {
                                    objTablaDetalleMalla.nombreModulo = homologar.listaModulos[i].nombre;
                                    break;
                                }
                            }
                            homologar.listaDetalleMalla.push(objTablaDetalleMalla);
                        });

                        homologar.listaDetalleMallaTemporal = [];
                        homologar.listaDetalleMallaTemporal = homologar.listaDetalleMalla;


                        homologarService.buscarModulosHomologados(homologar.estudiante.identificacion, homologar.estudiante.programa.id).then(function (data) {
                            homologar.listaPosiciones = [];
                            homologar.listaDetalleMalla = [];
                            if (data.length > 0) {
                                for (i = 0; i < data.length; i++) {
                                    for (j = 0; i < homologar.listaDetalleMallaTemporal.length; j++) {
                                        if (homologar.listaDetalleMallaTemporal[j].idModulo === data[i]) {
                                            homologar.listaPosiciones.push(j);
                                            break;
                                        }
                                    }
                                }
                            }

                            var h;
                            for (h = 0; h < homologar.listaPosiciones.length; h++) {
                                delete homologar.listaDetalleMallaTemporal[homologar.listaPosiciones[h]];
                            }

                            angular.forEach(homologar.listaDetalleMallaTemporal, function (value, key) {
                                homologar.listaDetalleMalla.push(value);
                            });

                            appConstant.CERRAR_SWAL();

                        }).catch(function (e) {
                            appConstant.CERRAR_SWAL();
                            return;
                        });

                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        return;
                    });

                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });

                appConstant.CERRAR_SWAL();
            }
        };

        homologar.checkAllTarjetasDebito = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                $("." + classCheckHijos).prop('checked', true);
                var i;

                for (i = 0; i < homologar.listaDetalleMalla.length; i++) {
                    homologar.listaDetalleMalla[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
            }
        };
        homologar.checkTarjetasDebito = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValorTarjetaDebito" + item.id).is(':checked')) {
                item.seleccionado = true;
            } else {
                item.seleccionado = false;
            }
        };

        onConsultarModulo();
    }
})();

