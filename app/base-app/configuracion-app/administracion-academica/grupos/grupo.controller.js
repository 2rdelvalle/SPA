(function () {
    'use strict';
    angular.module('mytodoApp').controller('GrupoCtrl', GrupoCtrl);
    GrupoCtrl.$inject = ['$scope', 'gruposServices', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval','utilServices','appConstantValueList','appGenericConstant'];
    function GrupoCtrl($scope, gruposServices, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval,utilServices,appConstantValueList,appGenericConstant) {

        var gestionGrupo = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionGrupo.listadoGrupos = [];
        gestionGrupo.listadoNiveles = [];
        gestionGrupo.listadoNivelesFormacion = [];
        gestionGrupo.listadoHorarios = [];
        gestionGrupo.listadoProgramas = [];
        gestionGrupo.listadoDocente = [];
        gestionGrupo.modulo=[];
        gestionGrupo.display;
        gestionGrupo.selectTodos = false;
        gestionGrupo.filtrados = [];
        gestionGrupo.estados = [];
        gestionGrupo.grupo = gruposServices.grupo;
        gestionGrupo.grupoAuxiliar = gruposServices.grupoAuxiliar;
        gestionGrupo.grupoAuxiliar.disableVerDetalle = true;
        gestionGrupo.options = appConstant.FILTRO_TABLAS;
        gestionGrupo.selectedOption = gestionGrupo.options[0];
        gestionGrupo.report = {
            selected: null
        };
        gestionGrupo.counter = 0;
        if (localStorageService.get('grupo') !== null) {
            gestionGrupo.grupo = localStorageService.get('grupo');
        } else {
            localStorageService.remove('grupoAuxiliar');
            $location.path('/grupos');
        }

        if (localStorageService.get('grupoAuxiliar') !== null) {
            gestionGrupo.grupoAuxiliar = localStorageService.get('grupoAuxiliar');
        }
        function onBuscarEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var estados = {
                        categoria: value.categoria,
                        codigo: value.codigo,
                        estado: value.estado,
                        referencia: value.referencia,
                        valor: value.valor
                    };
                    gestionGrupo.estados.push(estados);
                });
            });
        }
        /*Consultar Grupos*/
        function onBuscarGrupos() {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            gestionGrupo.listadoGrupos = [];
            gestionGrupo.counter = 0;
            gruposServices.buscarGrupos().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var grupo = {
                        id: value.id,
                        codigoGrupo: value.codigoGrupo,
                        nombreGrupo: value.nombreGrupo,
                        idHorario: value.idHorario,
                        nombreHorario: value.nombreHorario,
                        idModulo: value.idModulo,
                        idPeriodoAcademico: value.idPeriodoAcademico,
                        maximoEstudiante: value.maximoEstudiante,
                        minimoEstudiante: value.minimoEstudiante,
                        idDocente: value.idDocente,
                        estado: value.estado,
                        fechaRegistro:value.fechaRegistro,
                        numeroModulo:value.numeroModulo,
                        idConfiguracionProgramacionAcade: value.idConfiguracionProgramacionAcade
                    };
                    gestionGrupo.listadoGrupos.push(grupo);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
            });
        }
        /*Limpiar Entidad Grupos*/
        function onLimpiar() {
            gestionGrupo.grupo.id = null;
            gestionGrupo.grupo.codigoGrupo = '';
            gestionGrupo.grupo.nombreGrupo = '';
            gestionGrupo.grupo.idNivel = null;
            gestionGrupo.grupo.idPrograma = null;
            gestionGrupo.grupo.idNivelFormacion = null;
            gestionGrupo.grupo.idHorario = null;
            gestionGrupo.grupo.idPeriodoAcademico = null;
            gestionGrupo.grupo.maximoEstudiante = 1;
            gestionGrupo.grupo.minimoEstudiante = 1;
            gestionGrupo.grupo.idModulo= null;
            gestionGrupo.grupo.docente= null;
            gestionGrupo.grupo.numeroModulo=null;
        }

        gestionGrupo.onVolver = function () {
            onLimpiar();
            localStorageService.remove('grupo');
            localStorageService.remove('grupoAuxiliar');
        };
        /*Acción Para Validar, Guargar o Editar Parámetros Créditos*/
        gestionGrupo.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudGrupo)) {
                if (gestionGrupo.grupo.id === null || gestionGrupo.grupo.id === undefined) {
                    gestionGrupo.onAddGrupo();
                    new ValidationService().resetForm($scope.formCrudGrupo);
                } else {
                        gestionGrupo.onUpdateGrupo();
                }
            }
        };
        gestionGrupo.onAddGrupo = function () {
            var grupo = {
//                codigoGrupo: appConstant.VALIDAR_STRING(gestionGrupo.grupo.codigoGrupo),
//                nombreGrupo: appConstant.VALIDAR_STRING(gestionGrupo.grupo.nombreGrupo),
                idHorario: gestionGrupo.grupo.idHorario,
                idModulo: gestionGrupo.grupo.idModulo,
                idPeriodoAcademico: gestionGrupo.grupo.idPeriodoAcademico,
                maximoEstudiante: gestionGrupo.grupo.maximoEstudiante,
                minimoEstudiante: gestionGrupo.grupo.minimoEstudiante,
                idDocente : gestionGrupo.grupo.idDocente,
                estado: "ACTIVO",//gestionGrupo.grupo.estado
                numeroModulo: gestionGrupo.grupo.numeroModulo,
                idConfiguracionProgramacionAcade:gestionGrupo.grupo.idConfiguracionProgramacionAcade
            };
            gruposServices.agregarGrupo(grupo).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    localStorageService.remove('grupo');
                    onLimpiar();
                } else if (data.tipo === 500) {
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        };
        /*Acción Para Validar Y Modificar Parámetro Crédito*/
        gestionGrupo.onUpdateGrupo = function () {
            var grupo = {
                id: gestionGrupo.grupo.id,
                codigoGrupo: appConstant.VALIDAR_STRING(gestionGrupo.grupo.codigoGrupo),
                nombreGrupo: appConstant.VALIDAR_STRING(gestionGrupo.grupo.nombreGrupo),
                idHorario: gestionGrupo.grupo.idHorario,
                idModulo: gestionGrupo.grupo.idModulo,
                idPeriodoAcademico: gestionGrupo.grupo.idPeriodoAcademico,
                maximoEstudiante: gestionGrupo.grupo.maximoEstudiante,
                minimoEstudiante: gestionGrupo.grupo.minimoEstudiante,
                estado: gestionGrupo.grupo.estado,
                idDocente : gestionGrupo.grupo.idDocente,
                fechaRegistro: gestionGrupo.grupo.fechaRegistro,
                numeroModulo: gestionGrupo.grupo.numeroModulo,
                idConfiguracionProgramacionAcade:gestionGrupo.grupo.idConfiguracionProgramacionAcade
            };
            gruposServices.actualizarGrupo(grupo).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('grupo', gestionGrupo.grupo);
                    localStorageService.set('grupoAuxiliar', gestionGrupo.grupoAuxiliar);
                } else if (data.tipo === 500) {
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
        gestionGrupo.onClickToAddGrupo = function () {
            gestionGrupo.grupoAuxiliar.campoEstado = true;
            localStorageService.remove('grupo');
            gestionGrupo.grupo = gruposServices.grupo;
            onLimpiar();
            gestionGrupo.grupoAuxiliar.disableVerDetalle = false;
            gestionGrupo.grupoAuxiliar.disableCodigo = false;
            gestionGrupo.grupoAuxiliar.titulo = appGenericConstant.AGREGAR;
            localStorageService.set('grupoAuxiliar', gestionGrupo.grupoAuxiliar);
            localStorageService.set('grupo', gestionGrupo.grupo);
            $location.path('/cud-grupo');
            new ValidationService().resetForm($scope.formCrudGrupo);

        };
        gestionGrupo.onClickToUpdateGrupo = function (item) {
            gestionGrupo.grupoAuxiliar.campoEstado = false;
            gestionGrupo.grupoAuxiliar.disableVerDetalle = false;
            gestionGrupo.grupoAuxiliar.disableCodigo = true;
            gestionGrupo.grupoAuxiliar.titulo = appGenericConstant.MODIFICAR;
            gestionGrupo.grupo.id = item.id;
            gestionGrupo.grupo.codigoGrupo = item.codigoGrupo;
            gestionGrupo.grupo.nombreGrupo = item.nombreGrupo;
            gestionGrupo.grupo.idHorario = item.idHorario;
            gestionGrupo.grupo.idModulo = item.idModulo;
            gestionGrupo.grupo.idPeriodoAcademico = item.idPeriodoAcademico;
            gestionGrupo.grupo.maximoEstudiante = item.maximoEstudiante;
            gestionGrupo.grupo.minimoEstudiante = item.minimoEstudiante;
            gestionGrupo.grupo.estado = item.estado;
            gestionGrupo.grupo.fechaRegistro= item.fechaRegistro;
            gestionGrupo.grupo.idDocente = item.idDocente;
            gestionGrupo.grupo.numeroModulo=item.numeroModulo;
            gestionGrupo.grupo.idConfiguracionProgramacionAcade=item.idConfiguracionProgramacionAcade;
            gestionGrupo.grupo.docente={idDocente:item.idDocente,numeroModulo:item.numeroModulo,idConfiguracionProgramacionAcade:item.idConfiguracionProgramacionAcade};
            localStorageService.set('grupo', gestionGrupo.grupo);
            localStorageService.set('grupoAuxiliar', gestionGrupo.grupoAuxiliar);
            if (gestionGrupo.grupo.idPeriodoAcademico === null || gestionGrupo.grupo.idPeriodoAcademico === undefined
                && gestionGrupo.grupo.idModulo === null || gestionGrupo.grupo.idModulo === undefined 
                && gestionGrupo.grupo.idHorario === null || gestionGrupo.grupo.idHorario === undefined ) {
                gestionGrupo.listadoDocente = [];
                return;
            }
            
            gruposServices.onBuscarModulos(gestionGrupo.grupo.idPeriodoAcademico,gestionGrupo.grupo.idModulo,gestionGrupo.grupo.idHorario).then(function (data) {
                gestionGrupo.listadoDocente = data;
                $location.path('/cud-grupo');
            });
           


        };
        gestionGrupo.onClickToVerDetalleGrupo = function (item) {
            $('#estadog').show();
            gestionGrupo.grupoAuxiliar.disableVerDetalle = true;
            gestionGrupo.grupoAuxiliar.disableCodigo = true;
            gestionGrupo.grupoAuxiliar.titulo = appGenericConstant.DETALLE;
            gestionGrupo.grupo.id = item.id;
            gestionGrupo.grupo.codigoGrupo = item.codigoGrupo;
            gestionGrupo.grupo.nombreGrupo = item.nombreGrupo;
            gestionGrupo.grupo.idHorario = item.idHorario;
            gestionGrupo.grupo.idModulo = item.idModulo;
            gestionGrupo.grupo.idPeriodoAcademico = item.idPeriodoAcademico;
            gestionGrupo.grupo.maximoEstudiante = item.maximoEstudiante;
            gestionGrupo.grupo.minimoEstudiante = item.minimoEstudiante;
            gestionGrupo.grupo.estado = item.estado;
            gestionGrupo.grupo.idDocente = item.idDocente;
            gestionGrupo.grupo.numeroModulo=item.numeroModulo;
            gestionGrupo.grupo.idConfiguracionProgramacionAcade=item.idConfiguracionProgramacionAcade;
            gestionGrupo.grupo.docente={idDocente:item.idDocente,numeroModulo:item.numeroModulo,idConfiguracionProgramacionAcade:item.idConfiguracionProgramacionAcade};
            localStorageService.set('grupo', gestionGrupo.grupo);
            localStorageService.set('grupoAuxiliar', gestionGrupo.grupoAuxiliar);
            if (gestionGrupo.grupo.idPeriodoAcademico === null || gestionGrupo.grupo.idPeriodoAcademico === undefined
                && gestionGrupo.grupo.idModulo === null || gestionGrupo.grupo.idModulo === undefined 
                && gestionGrupo.grupo.idHorario === null || gestionGrupo.grupo.idHorario === undefined ) {
                gestionGrupo.listadoDocente = [];
                return;
            }
            
            gruposServices.onBuscarModulos(gestionGrupo.grupo.idPeriodoAcademico,gestionGrupo.grupo.idModulo,gestionGrupo.grupo.idHorario).then(function (data) {
                gestionGrupo.listadoDocente = data;
                $location.path('/cud-grupo');
            });
        };
        gestionGrupo.onDeleteGrupo = function (item) {
            gestionGrupo.report.selected = [];
            swal({
                title: appGenericConstant.PRE_ELIMINAR_GRUPO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_GRUPO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    var grupo = {
                        id: item.id
                    };
                    gruposServices.eliminarGrupo(grupo).then(function (data) {
                        if (data.tipo === 200) {
                            swal(appGenericConstant.GRUPO_ELIMINADO,
                                    appGenericConstant.GRUPO_ELIMINADO_SATIS,
                                    appGenericConstant.SUCCESS);
                            onLimpiar();
                            gestionGrupo.report.selected.length = null;
                            onBuscarGrupos();
                            gestionGrupo.selectTodos = false;
                        } else if (data.tipo === 409) {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.GRUPO_NO_ELIMINADO,
                                    appGenericConstant.WARNING);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();

                    });
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionGrupo.report.selected.length = null;
                    gestionGrupo.selectTodos = false;
                }
            });
        };

        if ($location.path() === '/grupos') {
            onBuscarGrupos();
        }


        gestionGrupo.onBuscarDocente = function() {
            if (gestionGrupo.grupo.idPeriodoAcademico === null || gestionGrupo.grupo.idPeriodoAcademico === undefined
                && gestionGrupo.grupo.idModulo === null || gestionGrupo.grupo.idModulo === undefined 
                && gestionGrupo.grupo.idHorario === null || gestionGrupo.grupo.idHorario === undefined ) {
                gestionGrupo.listadoDocente = [];
                return;
            }
            gestionGrupo.listadoDocente = [];
            gruposServices.onBuscarDocente(gestionGrupo.grupo.idPeriodoAcademico,gestionGrupo.grupo.idModulo,gestionGrupo.grupo.idHorario).then(function (data) {
                gestionGrupo.listadoDocente = data;
            });
        };
        gestionGrupo.onBuscarModulos = function() {
            if (gestionGrupo.grupo.idPeriodoAcademico === null || gestionGrupo.grupo.idPeriodoAcademico === undefined
                && gestionGrupo.grupo.idModulo === null || gestionGrupo.grupo.idModulo === undefined 
                && gestionGrupo.grupo.idHorario === null || gestionGrupo.grupo.idHorario === undefined ) {
                gestionGrupo.listadoDocente = [];
                return;
            }
            gestionGrupo.listadoDocente = [];
            gruposServices.onBuscarModulos(gestionGrupo.grupo.idPeriodoAcademico,gestionGrupo.grupo.idHorario,gestionGrupo.grupo.idModulo).then(function (data) {
                gestionGrupo.listadoDocente = data;
            });
        };
        
        gestionGrupo.NumeroModulo= function(data){
             gestionGrupo.grupo.numeroModulo=null;
             gestionGrupo.grupo.numeroModulo= data.numeroModulo;
             gestionGrupo.grupo.idDocente= data.idDocente;
             gestionGrupo.grupo.idConfiguracionProgramacionAcade= data.idConfiguracionProgramacionAcade;
              gruposServices.onBuscarMaximacapacidadAula(gestionGrupo.grupo.idConfiguracionProgramacionAcade).then(function (max){
                 gestionGrupo.grupo.maximoEstudiante = max;
              });
        };

          function buscarModulo() {
            gruposServices.onBuscarModulo().then(function (data) {
                gestionGrupo.listadoModulos = [];
                gestionGrupo.listadoModulos = data;
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
        function periodoAcademico() {
            gruposServices.onBuscarPeriodoAcademico().then(function (data) {
                gestionGrupo.listaPeriodo = [];
                gestionGrupo.listaPeriodo = data;
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
        
        function onBuscarHorario() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_MATRICULA).then(function (data) {
                gestionGrupo.listadoHorarios = [];
                gestionGrupo.listadoHorarios = data;
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
          onBuscarHorario();
          onBuscarEstados();
          buscarModulo();
          periodoAcademico();
          gestionGrupo.onBuscarModulos();

        $timeout(function () {
            if (gestionGrupo.grupo !== null && gestionGrupo.grupo !== undefined) {
                $(".spinner-input").TouchSpin({
                    verticalbuttons: true,
                    min: 1,
                    max: 999
                });
                $('#horarioS input.ui-select-search').blur(function () {
                    $('#horario').triggerHandler("focus");
                    $('#horario').triggerHandler("blur");
                });
                $('#nivelFormacionS input.ui-select-search').blur(function () {
                    $('#nivelFormacion').triggerHandler("focus");
                    $('#nivelFormacion').triggerHandler("blur");
                });
                $('#nivelS input.ui-select-search').blur(function () {
                    $('#nivel').triggerHandler("focus");
                    $('#nivel').triggerHandler("blur");
                });
                $('#programaS input.ui-select-search').blur(function () {
                    $('#programa').triggerHandler("focus");
                    $('#programa').triggerHandler("blur");
                });
                $('div.minimo span.input-group-btn-vertical  button.bootstrap-touchspin-up').click(function () {
                    gestionGrupo.onChangeMinimoEstudiante();
                });
                $('div.minimo span.input-group-btn-vertical  button.bootstrap-touchspin-down').click(function () {
                    gestionGrupo.onChangeMinimoEstudiante();
                });

                $('div.maximo span.input-group-btn-vertical  button.bootstrap-touchspin-up').click(function () {
                    gestionGrupo.onChangeMaximoEstudiante();
                });
                $('div.maximo span.input-group-btn-vertical  button.bootstrap-touchspin-down').click(function () {
                    gestionGrupo.onChangeMaximoEstudiante();
                });
            }
        }, 50);
        gestionGrupo.onChangeMinimoEstudiante = function () {
            if (parseInt(gestionGrupo.grupo.minimoEstudiante) > parseInt(gestionGrupo.grupo.maximoEstudiante)) {
                gestionGrupo.grupo.minimoEstudiante = gestionGrupo.grupo.maximoEstudiante;
            }
        };
        gestionGrupo.onChangeMaximoEstudiante = function () {
            if (parseInt(gestionGrupo.grupo.maximoEstudiante) < parseInt(gestionGrupo.grupo.minimoEstudiante)) {
                gestionGrupo.grupo.maximoEstudiante = gestionGrupo.grupo.minimoEstudiante;
            }
        };
    }
})();