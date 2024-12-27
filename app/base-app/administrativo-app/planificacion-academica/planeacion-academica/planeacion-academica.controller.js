(function () {
    'use strict';
    angular.module('mytodoApp').controller('planeacionAcademicaCtrl', planeacionAcademicaCtrl);
    planeacionAcademicaCtrl.$inject = ['$scope', 'planeacionAcademicaServices', '$location', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', 'appGenericConstant'];
    function planeacionAcademicaCtrl($scope, planeacionAcademicaServices, $location, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant) {
        var gestionPlaneacionAcademica = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionPlaneacionAcademica.planeacionAcademicaList = [];
        gestionPlaneacionAcademica.display;
        gestionPlaneacionAcademica.width;
        gestionPlaneacionAcademica.nivelesAcademicosList = [];
        gestionPlaneacionAcademica.periodoAcademicoList = [];
        gestionPlaneacionAcademica.recursoEducativoList = [];
        gestionPlaneacionAcademica.cola = [];
        gestionPlaneacionAcademica.selectTodos = false;
        gestionPlaneacionAcademica.planeacionAcademica = planeacionAcademicaServices.planeacionAcademica;
        gestionPlaneacionAcademica.planeacionAcademicaAuxiliar = planeacionAcademicaServices.planeacionAcademicaAuxiliar;
        gestionPlaneacionAcademica.planeacionAcademica.inscripcion = false;
        gestionPlaneacionAcademica.switchInscripcion = true;
        gestionPlaneacionAcademica.options = appConstant.FILTRO_TABLAS;
        gestionPlaneacionAcademica.counter = 0;
        gestionPlaneacionAcademica.selectedOption = gestionPlaneacionAcademica.options[0];
        gestionPlaneacionAcademica.report = {
            selected: null
        };
        if (localStorageService.get('planeacionAcademica') !== null) {
            gestionPlaneacionAcademica.planeacionAcademica = localStorageService.get('planeacionAcademica');
            onBuscarProgramasAcademicos(gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect);
        }
        if (localStorageService.get('checkInscripcion') !== null) {
            gestionPlaneacionAcademica.switchInscripcion = true;
            gestionPlaneacionAcademica.planeacionAcademica.inscripcion = localStorageService.get('checkInscripcion') === "SI";
        }
        if (localStorageService.get('planeacionAcademicaAuxiliar') !== null) {
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar = localStorageService.get('planeacionAcademicaAuxiliar');
        }
        function onBuscarPlaneacionAcademica() {
            appConstant.MSG_LOADING('Cargando datos. Espera un momento...');
            appConstant.CARGANDO();
            gestionPlaneacionAcademica.counter = 0;
            planeacionAcademicaServices.buscarPlanecionAcademica().then(function (data) {
                gestionPlaneacionAcademica.planeacionAcademicaList = data;
                appConstant.CERRAR_SWAL();
            });
        }

        gestionPlaneacionAcademica.onBuscarProgramasAcademicos = function (item) {
            gestionPlaneacionAcademica.programaAcademicolist = [];
            planeacionAcademicaServices.programasAdemicos(item).then(function (data) {
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarNoPrograma = data.length === 0;
                gestionPlaneacionAcademica.programaAcademicolist = data;
            });
        };
        function onBuscarProgramasAcademicos(item) {
            gestionPlaneacionAcademica.programaAcademicolist = [];
            planeacionAcademicaServices.programasAdemicos(item).then(function (data) {
                gestionPlaneacionAcademica.programaAcademicolist = data;
            });
        }
        function onConsultarNivelesFormacion() {
            planeacionAcademicaServices.listarNivelesFormacion().then(function (data) {
                gestionPlaneacionAcademica.listaNivelesFormacion = data;
            });
        }
        function onBuscarPeriodoAcademico() {
            planeacionAcademicaServices.buscarPeriodo().then(function (data) {
                gestionPlaneacionAcademica.periodoAcademicoList = data;
                gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico = data[0].id;
            });
        }
        function onBuscarRecurso() {
            planeacionAcademicaServices.buscarRecurso().then(function (data) {
                gestionPlaneacionAcademica.listaAuxiliarRecursos = [];
                gestionPlaneacionAcademica.recursoEducativoList = [];
                angular.forEach(data, function (value, key) {
                    gestionPlaneacionAcademica.listaAuxiliarRecursos = {
                        codigo: value.codigo,
                        descripcion: value.descripcion,
                        id: value.id,
                        nombre: value.nombre,
                        idSede: value.idSede,
                        idTipoRecurso: value.idTipoRecurso,
                        ubicacion: value.ubicacion,
                        nombreTipoRecurso: value.nombreTipoRecurso
                    };
                    gestionPlaneacionAcademica.recursoEducativoList.push(gestionPlaneacionAcademica.listaAuxiliarRecursos);
                });
                if (gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo !== null && typeof gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo !== 'undefined'
                        && gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo.length !== 0
                        ) {
                    for (var i = 0; i < gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo.length; i++) {
                        for (var e = 0; e < gestionPlaneacionAcademica.recursoEducativoList.length; e++) {
                            if (gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo[i].codigo === gestionPlaneacionAcademica.recursoEducativoList[e].codigo) {
                                var index = gestionPlaneacionAcademica.recursoEducativoList.indexOf(gestionPlaneacionAcademica.recursoEducativoList[e]);
                                gestionPlaneacionAcademica.recursoEducativoList.splice(index, 1);
                            }
                        }
                    }
                }
            });
        }
        gestionPlaneacionAcademica.onLimpiar = function () {
            planeacionAcademicaServices.planeacionAcademica = {};
            gestionPlaneacionAcademica.planeacionAcademica.id = null;
            gestionPlaneacionAcademica.planeacionAcademica.formacionAcademica = null;
            gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico = null;
            gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect = null;
            gestionPlaneacionAcademica.planeacionAcademica.programaAcademico = null;
            gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo = null;
            gestionPlaneacionAcademica.planeacionAcademica.valorMatricula = null;
            gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAcademico = null;
            gestionPlaneacionAcademica.planeacionAcademica.puntoEquilibrio = null;
            gestionPlaneacionAcademica.planeacionAcademica.producInterBruto = null;
            $('#div1').removeClass('col-sm-12').addClass('col-sm-6');
            $('#div2').removeClass('col-sm-12').addClass('col-sm-6');
            $('#div1').removeClass('col-lg-12').addClass('col-lg-6');
            $('#div2').removeClass('col-lg-12').addClass('col-lg-6');
        };
        gestionPlaneacionAcademica.onClickToAddPlaneacionAcademica = function () {
            gestionPlaneacionAcademica.onLimpiar();
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.quitaTabla = true;
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableVerDetalle = false;
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disabledEdit = false;
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarDetalle = false;
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableCodigo = true;
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.titulo = appGenericConstant.AGREGAR_PLANEACION;
            localStorageService.set('planeacionAcademica', null);
            localStorageService.set('planeacionAcademicaAuxiliar', gestionPlaneacionAcademica.planeacionAcademicaAuxiliar);
        };
        /*Acción Para Validar, Guargar o Editar Períodos Académicos*/
        gestionPlaneacionAcademica.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCudPlaneacionAcademica)) {
                if (gestionPlaneacionAcademica.planeacionAcademica.id === null || gestionPlaneacionAcademica.planeacionAcademica.id === undefined) {
                    gestionPlaneacionAcademica.onAddPlaneacionAcademica();
                    new ValidationService().resetForm($scope.formCudPlaneacionAcademica);
                } else {
                    gestionPlaneacionAcademica.onUpdatePlaneacionAcademica();
                }
            } else {
                if ($scope.formCudPlaneacionAcademica.formPorcentage.$invalid) {
                    gestionPlaneacionAcademica.active = 1;
                }
            }
        };
        gestionPlaneacionAcademica.onAddPlaneacionAcademica = function () {
            var planeacionAcademi = {
                idPeriodoAcademico: gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico,
                idPrograma: gestionPlaneacionAcademica.planeacionAcademica.programaAcademico,
                listaDetallePlaneacionAcademica: listadetalle(gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo),
                puntoEquilibrio: parseInt(gestionPlaneacionAcademica.planeacionAcademica.puntoEquilibrio),
                pib: parseFloat(gestionPlaneacionAcademica.planeacionAcademica.producInterBruto),
                metaMatriculados: parseInt(gestionPlaneacionAcademica.planeacionAcademica.metaMatriculados)
            };
            planeacionAcademicaServices.agregarPlanecionAcademica(planeacionAcademi).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    gestionPlaneacionAcademica.onLimpiar();
                } else if (data.tipo === 500) {
                    MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            });
        };
        function listadetalleModificado(item) {
            var recursosAuxiliar = [];
            var recursos = [];
            angular.forEach(item, function (value, key) {
                recursosAuxiliar = {
                    id: value.idDetallePlaneacion,
                    idPlaneacionAcademica: gestionPlaneacionAcademica.planeacionAcademica.id,
                    idRecursoEducativo: value.id,
                    porcentaje: parseFloat(value.porcentaje)
                };
                recursos.push(recursosAuxiliar);
            });
            return recursos;
        }
        function listadetalle(item) {
            var recursosAuxiliar = [];
            var recursos = [];
            angular.forEach(item, function (value, key) {
                recursosAuxiliar = {
                    id: null,
                    idPlaneacionAcademica: gestionPlaneacionAcademica.planeacionAcademica.id,
                    idRecursoEducativo: value.id,
                    porcentaje: parseFloat(value.porcentaje)
                };
                recursos.push(recursosAuxiliar);
            });
            return recursos;
        }
        gestionPlaneacionAcademica.onClickToUpdatePlaneacionAcademica = function (planeacion) {
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarDetalle = true;
            localStorageService.remove('checkInscripcion');
            gestionPlaneacionAcademica.switchInscripcion = true;
            gestionPlaneacionAcademica.onLimpiar();
            planeacionAcademicaServices.buscarPorPlaneacion(planeacion.id).then(function (item) {
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.quitaTabla = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableVerDetalle = false;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disabledEdit = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableCodigo = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.titulo = appGenericConstant.MODIFICAR_PLANEACION;
                gestionPlaneacionAcademica.planeacionAcademica.id = item.id;
                gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico = item.idPeriodoAcademico;
                gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect = item.idNivelFormacion;
                gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo = item.recursoEducativoDTO;
                gestionPlaneacionAcademica.planeacionAcademica.valorMatricula = item.valorMatricula;
                gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAcademico = item.valorCreditoAcademico;
                gestionPlaneacionAcademica.planeacionAcademica.puntoEquilibrio = item.puntoEquilibrio;
                gestionPlaneacionAcademica.planeacionAcademica.producInterBruto = item.pib;
                gestionPlaneacionAcademica.planeacionAcademica.metaMatriculados = item.metaMatriculados;
                gestionPlaneacionAcademica.planeacionAcademica.inscripcion = item.inscripcion === "SI";
                planeacionAcademicaServices.programasAdemicos(gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect).then(function (data) {
                    gestionPlaneacionAcademica.programaAcademicolist = [];
                    gestionPlaneacionAcademica.programaAcademicolist = data;
                    gestionPlaneacionAcademica.planeacionAcademica.programaAcademico = item.idProgramaAcademico;
                    planeacionAcademicaServices.infoProgramasAdemicos(gestionPlaneacionAcademica.planeacionAcademica.programaAcademico, gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico).then(function (data) {
                        gestionPlaneacionAcademica.planeacionAcademica.maximoAumno = data.maximoAdmitido;
                        gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAdicional = data.valorCreditoAdicional;
                        gestionPlaneacionAcademica.planeacionAcademica.maximoCreditoAdicional = data.maximoCreditoAdicional;
                        gestionPlaneacionAcademica.planeacionAcademica.niveles = gestionPlaneacionAcademica.recorrerListaCobro(data.listaTipoCobro);
                        gestionPlaneacionAcademica.tamanoVentana();
                        localStorageService.set('planeacionAcademica', gestionPlaneacionAcademica.planeacionAcademica);
                        localStorageService.set('planeacionAcademicaAuxiliar', gestionPlaneacionAcademica.planeacionAcademicaAuxiliar);
                        $location.path('/crud-planeacion-academica');
                    });
                });
            });
        };
        gestionPlaneacionAcademica.onLLenarCamposInfo = function (item) {
            gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarDetalle = false;
            planeacionAcademicaServices.infoProgramasAdemicos(item, gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico).then(function (data) {
                gestionPlaneacionAcademica.switchInscripcion = true;
                gestionPlaneacionAcademica.planeacionAcademica.niveles = [];
                gestionPlaneacionAcademica.planeacionAcademica.maximoAumno = data.maximoAdmitido;
                gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAdicional = data.valorCreditoAdicional;
                gestionPlaneacionAcademica.planeacionAcademica.maximoCreditoAdicional = data.maximoCreditoAdicional;
                localStorageService.remove('checkInscripcion');
                localStorageService.set('checkInscripcion', data.inscripcion);
                if (data.inscripcion === "SI") {
                    gestionPlaneacionAcademica.planeacionAcademica.inscripcion = true;
                } else {
                    gestionPlaneacionAcademica.planeacionAcademica.inscripcion = false;
                }
                gestionPlaneacionAcademica.planeacionAcademica.niveles = gestionPlaneacionAcademica.recorrerListaCobro(data.listaTipoCobro);
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarDetalle = true;
            });
        };
        gestionPlaneacionAcademica.recorrerListaCobro = function (item) {
            gestionPlaneacionAcademica.planeacionAcademica.nivelesAux = [];
            angular.forEach(item, function (value, key) {
                gestionPlaneacionAcademica.niveles = {
                    nivel: value.nivel,
                    valorMatricula: value.valorMatricula,
                    valorSemestre: value.valorSemestre
                };
                gestionPlaneacionAcademica.planeacionAcademica.nivelesAux.push(gestionPlaneacionAcademica.niveles);
            });
            return gestionPlaneacionAcademica.planeacionAcademica.nivelesAux;
        };
        /*Acción Para Validar Y Modificar */
        gestionPlaneacionAcademica.onUpdatePlaneacionAcademica = function () {
            var planeacionAcademi = {
                id: gestionPlaneacionAcademica.planeacionAcademica.id,
                idPeriodoAcademico: gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico,
                idPrograma: gestionPlaneacionAcademica.planeacionAcademica.programaAcademico,
                listaDetallePlaneacionAcademica: listadetalleModificado(gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo),
                puntoEquilibrio: parseInt(gestionPlaneacionAcademica.planeacionAcademica.puntoEquilibrio),
                pib: parseFloat(gestionPlaneacionAcademica.planeacionAcademica.producInterBruto),
                metaMatriculados: parseInt(gestionPlaneacionAcademica.planeacionAcademica.metaMatriculados)
            };
            planeacionAcademicaServices.actualizarPlanecionAcademica(planeacionAcademi).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('planeacionAcademicaAuxiliar', gestionPlaneacionAcademica.planeacionAcademicaAuxiliar);
                } else if (data.tipo === 500) {
                    MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        };
        /*Método Para Obtener El  Período Académico A Ver Detalle*/
        gestionPlaneacionAcademica.onClickToVerDetallePlaneacionAcademica = function (planeacion) {
            localStorageService.remove('checkInscripcion');
            planeacionAcademicaServices.buscarPorPlaneacion(planeacion.id).then(function (item) {
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.mostrarDetalle = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableVerDetalle = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.disableCodigo = true;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.quitaTabla = false;
                gestionPlaneacionAcademica.planeacionAcademicaAuxiliar.titulo = appGenericConstant.DETALLE_PLANEACION;
                gestionPlaneacionAcademica.planeacionAcademica.id = item.id;
                gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico = item.idPeriodoAcademico;
                gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect = item.idNivelFormacion;
                gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo = item.recursoEducativoDTO;
                gestionPlaneacionAcademica.planeacionAcademica.valorMatricula = item.valorMatricula;
                gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAcademico = item.valorCreditoAcademico;
                gestionPlaneacionAcademica.planeacionAcademica.puntoEquilibrio = item.puntoEquilibrio;
                gestionPlaneacionAcademica.planeacionAcademica.producInterBruto = item.pib;
                gestionPlaneacionAcademica.planeacionAcademica.metaMatriculados = item.metaMatriculados;
                gestionPlaneacionAcademica.planeacionAcademica.inscripcion = item.inscripcion === "SI";
                planeacionAcademicaServices.programasAdemicos(gestionPlaneacionAcademica.planeacionAcademica.nivelFormacionSelect).then(function (data) {
                    gestionPlaneacionAcademica.programaAcademicolist = [];
                    gestionPlaneacionAcademica.programaAcademicolist = data;
                    gestionPlaneacionAcademica.planeacionAcademica.programaAcademico = item.idProgramaAcademico;
                    planeacionAcademicaServices.infoProgramasAdemicos(gestionPlaneacionAcademica.planeacionAcademica.programaAcademico,
                                                            gestionPlaneacionAcademica.planeacionAcademica.periodoAcademico).then(function (data) {
                        gestionPlaneacionAcademica.planeacionAcademica.maximoAumno = data.maximoAdmitido;
                        gestionPlaneacionAcademica.planeacionAcademica.valorCreditoAdicional = data.valorCreditoAdicional;
                        gestionPlaneacionAcademica.planeacionAcademica.maximoCreditoAdicional = data.maximoCreditoAdicional;
                        gestionPlaneacionAcademica.planeacionAcademica.niveles = gestionPlaneacionAcademica.recorrerListaCobro(data.listaTipoCobro);
                        localStorageService.set('planeacionAcademica', gestionPlaneacionAcademica.planeacionAcademica);
                        localStorageService.set('planeacionAcademicaAuxiliar', gestionPlaneacionAcademica.planeacionAcademicaAuxiliar);
                        $location.path('/crud-planeacion-academica');
                    });
                });
            });
        };
        gestionPlaneacionAcademica.onDeletePlaneacionAcedemica = function (item) {
            gestionPlaneacionAcademica.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PLENEACION,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                planeacionAcademicaServices.eliminarPaneacionAcademica(item).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            swal(appGenericConstant.PLANEACION_ELIMINADA,
                                    appGenericConstant.PLANEACION_ELIMINADA_SATIS,
                                    appGenericConstant.SUCCESS);
                            onBuscarPlaneacionAcademica();
                            break;
                        case 500:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                                    'error');
                            break;
                        default:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.PLANEACION_NO_ELIMINADA,
                                    appGenericConstant.WARNING);
                            break;
                    }
                    gestionPlaneacionAcademica.report.selected.length = null;
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionPlaneacionAcademica.report.selected.length = null;
                }
            });
        };
        gestionPlaneacionAcademica.onDeleteMasivoPlaneacionAcedemica = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.NECESITAMOS_CONFIRMAR,
                text: appGenericConstant.SEGURO_ELIMINAR_REGISTROS,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                angular.forEach(gestionPlaneacionAcademica.report.selected, function (value, key) {
                    listaElementosEliminar.push(value.id);
                });
                planeacionAcademicaServices.eliminarPaneacionAcademicaMasivo(listaElementosEliminar).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.PLANEACIONES_ELIMINADAS,
                                    appGenericConstant.PLANEACIONES_ELIMINADAS_SATIS,
                                    appGenericConstant.SUCCESS);
                            onBuscarPlaneacionAcademica();
                            break;
                        case 500:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                                    'error');
                            break;
                        default:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ALGUNOS_PLANEACIONES,
                                    appGenericConstant.WARNING);
                            break;
                    }
                    gestionPlaneacionAcademica.report.selected.length = null;
                });
            });
        };
        gestionPlaneacionAcademica.selectRecursos = function (recursos) {
            if (gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo !== undefined) {
                gestionPlaneacionAcademica.cola = gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo;
            }
            recursos.porcentaje = "";
            gestionPlaneacionAcademica.cola.push(recursos);
            gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo = gestionPlaneacionAcademica.cola;
            var index = gestionPlaneacionAcademica.recursoEducativoList.indexOf(recursos);
            gestionPlaneacionAcademica.recursoEducativoList.splice(index, 1);
        };
        gestionPlaneacionAcademica.removeRecursos = function (cajero) {
            if (gestionPlaneacionAcademica.recursoEducativoList !== undefined) {
                gestionPlaneacionAcademica.recursoEducativoList = gestionPlaneacionAcademica.recursoEducativoList;
            }
            gestionPlaneacionAcademica.recursoEducativoList.push(cajero);
            gestionPlaneacionAcademica.recursoEducativoList = gestionPlaneacionAcademica.recursoEducativoList;
            var index = gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo.indexOf(cajero);
            gestionPlaneacionAcademica.planeacionAcademica.recursoEducativo.splice(index, 1);
        };
        gestionPlaneacionAcademica.tamanoVentana = function () {
            gestionPlaneacionAcademica.width = $(window).width();
            if (gestionPlaneacionAcademica.width >= 700 && gestionPlaneacionAcademica.width <= 1300) {
                $('#div1').removeClass('col-sm-6').addClass('col-sm-12');
                $('#div1').removeClass('col-lg-6').addClass('col-lg-12');
                $('#div2').removeClass('col-sm-6').addClass('col-sm-12');
                $('#div2').removeClass('col-lg-6').addClass('col-lg-12');
            } else {
                $('#div1').removeClass('col-sm-12').addClass('col-sm-6');
                $('#div2').removeClass('col-sm-12').addClass('col-sm-6');
                $('#div1').removeClass('col-lg-12').addClass('col-lg-6');
                $('#div2').removeClass('col-lg-12').addClass('col-lg-6');
            }
        };
        $(function () {
            gestionPlaneacionAcademica.tamanoVentana();
        });
        $(window).load(function () {
            gestionPlaneacionAcademica.tamanoVentana();
        });
        $(window).resize(function () {
            gestionPlaneacionAcademica.tamanoVentana();
        }).resize();
        onBuscarPlaneacionAcademica();
        onBuscarPeriodoAcademico();
        onBuscarRecurso();
        onConsultarNivelesFormacion();
    }
})();


