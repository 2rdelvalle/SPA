(function () {
    'use strict';
    angular.module('mytodoApp').controller('GrupoModuloCtrl', GrupoModuloCtrl);
    GrupoModuloCtrl.$inject = ['$scope', 'grupoModuloServices', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function GrupoModuloCtrl($scope, grupoModuloServices, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var gestionGrupoModulo = this;

        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionGrupoModulo.listadoGrupoModulo = [];
        gestionGrupoModulo.listadoModalidad = [];
        gestionGrupoModulo.listadoHorarios = [];
        gestionGrupoModulo.listadoPeriodosAcademicos = [];
        gestionGrupoModulo.listadoModulos = [];
        gestionGrupoModulo.listadoGrupos = [];
        gestionGrupoModulo.display;
        gestionGrupoModulo.selectTodos = false;
        gestionGrupoModulo.filtrados = [];
        gestionGrupoModulo.estados = [];
        gestionGrupoModulo.grupoModulo = grupoModuloServices.grupoModulo;
        gestionGrupoModulo.grupoModuloAuxiliar = grupoModuloServices.grupoModuloAuxiliar;
//        gestionGrupoModulo.grupoAuxiliar.disableVerDetalle = true;
        gestionGrupoModulo.options = appConstant.FILTRO_TABLAS;
        gestionGrupoModulo.selectedOption = gestionGrupoModulo.options[0];
        gestionGrupoModulo.report = {
            selected: null
        };

        gestionGrupoModulo.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudGrupoModulo)) {
                if (gestionGrupoModulo.grupoModulo.id === null || gestionGrupoModulo.grupoModulo.id === appGenericConstant.INDEFINIDO) {
                    onGuardarGrupoModulo();
                } else {
                    onModificarGrupoModulo();
                }
            }
        };


        function onGuardarGrupoModulo() {
            var grupoMod = {
                id: null,
                nombre: appConstant.VALIDAR_STRING(gestionGrupoModulo.grupoModulo.nombre),
                idHorario: gestionGrupoModulo.grupoModulo.idHorario,
                idPeriodo: gestionGrupoModulo.grupoModulo.idPeriodoAcademico,
                idGrupo: gestionGrupoModulo.grupoModulo.idGrupo,
                idModulo: gestionGrupoModulo.grupoModulo.idModulo

            };
             appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_MODULO);
             appConstant.CARGANDO();
            grupoModuloServices.agregarGrupoModulo(grupoMod).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    localStorageService.remove('grupoModulo');
                    onLimpiar();
                } else if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.CERRAR_SWAL();
                    MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                MSG_GROWL_ERROR();
                return;
            });
        }
        
        gestionGrupoModulo.onClickToUpdateGrupoModulo = function (item) {
            gestionGrupoModulo.grupoModuloAuxiliar.campoEstado = false;
            gestionGrupoModulo.grupoModuloAuxiliar.disableVerDetalle = false;
            gestionGrupoModulo.grupoModuloAuxiliar.disableCodigo = true;
            gestionGrupoModulo.grupoModuloAuxiliar.titulo = appGenericConstant.MODIFICAR;
            gestionGrupoModulo.grupoModulo.id = item.id;
            gestionGrupoModulo.grupoModulo.nombre = item.nombre;
            gestionGrupoModulo.grupoModulo.fechaRegistro = item.fechaRegistro;
            gestionGrupoModulo.grupoModulo.idHorario = item.idHorario;
            gestionGrupoModulo.grupoModulo.idGrupo = item.idGrupo;
            gestionGrupoModulo.grupoModulo.idPeriodoAcademico = item.idPeriodo;
            gestionGrupoModulo.grupoModulo.idModulo= item.idModulo;
            localStorageService.set('grupoModulo', gestionGrupoModulo.grupoModulo);
            localStorageService.set('grupoModuloAuxiliar', gestionGrupoModulo.grupoModuloAuxiliar);
            $location.path('/cud-grupo-modulo');


        };

        function onModificarGrupoModulo() {
            var grupoMod = {
                id: gestionGrupoModulo.grupoModulo.id,
                nombre: appConstant.VALIDAR_STRING(gestionGrupoModulo.grupoModulo.nombre),
                idHorario: gestionGrupoModulo.grupoModulo.idHorario,
                idPeriodo: gestionGrupoModulo.grupoModulo.idPeriodoAcademico,
                idGrupo: gestionGrupoModulo.grupoModulo.idGrupo,
                idModulo: gestionGrupoModulo.grupoModulo.idModulo,
                fechaRegistro:gestionGrupoModulo.grupoModulo.fechaRegistro

            };
            appConstant.MSG_LOADING(appGenericConstant.MODIFICAR_GRUPO_MODULO);
            appConstant.CARGANDO();
            grupoModuloServices.actulizarGrupoModulo(grupoMod).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.remove('grupoModulo');

                } else if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.CERRAR_SWAL();
                    MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                MSG_GROWL_ERROR();
                return;
            });
        }

        function buscarGrupoModulo() {
            grupoModuloServices.buscarGrupoModulo().then(function (data) {
                gestionGrupoModulo.listadoGrupoModulo = [];
                gestionGrupoModulo.listadoGrupoModulo = data;
                
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
          function buscarPeriodo() {
            grupoModuloServices.buscarPeriodos().then(function (data) {
                gestionGrupoModulo.listadoPeriodosAcademicos = [];
                gestionGrupoModulo.listadoPeriodosAcademicos = data;
                
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
            
         function buscarGrupo() {
            grupoModuloServices.buscarGrupo().then(function (data) {
                gestionGrupoModulo.listadoGrupos = [];
                gestionGrupoModulo.listadoGrupos = data;

            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
        
         function buscarModulo() {
            grupoModuloServices.buscarModulo().then(function (data) {
                gestionGrupoModulo.listadoModulos = [];
                gestionGrupoModulo.listadoModulos = data;

            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        }
        
        gestionGrupoModulo.onClickToAddGrupoModulo = function () {
            gestionGrupoModulo.grupoModuloAuxiliar.campoEstado = true;
            localStorageService.remove('grupoModulo');
            gestionGrupoModulo.grupoModulo = grupoModuloServices.grupoModulo;
            onLimpiar();
            gestionGrupoModulo.grupoModuloAuxiliar.disableVerDetalle = false;
            gestionGrupoModulo.grupoModuloAuxiliar.disableCodigo = false;
            gestionGrupoModulo.grupoModuloAuxiliar.titulo = "Agregar";
            localStorageService.set('grupoModuloAuxiliar', gestionGrupoModulo.grupoModuloAuxiliar);
            localStorageService.set('grupo', gestionGrupoModulo.grupoModulo);
            $location.path('/cud-grupo-modulo');
            new ValidationService().resetForm($scope.formCrudGrupoModulo);

        };
            function  onLimpiar(){
              gestionGrupoModulo.grupoModulo.id=null;
              gestionGrupoModulo.grupoModulo.nombre=null;
              gestionGrupoModulo.grupoModulo.idHorario=null;
              gestionGrupoModulo.grupoModulo.idPeriodoAcademico=null;
              gestionGrupoModulo.grupoModulo.idGrupo=null;
              gestionGrupoModulo.grupoModulo.idModul=null;
                
            }
        
           function ejecturarConsultarHorario() {
            gestionGrupoModulo.listadoHorarios = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_MATRICULA).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var horario = {
                        id: value.codigo,
                        nombre: value.valor,
                        referencia: value.referencia
                    };
                    gestionGrupoModulo.listadoHorarios.push(horario);
                });
            }).catch(function (e) {
                return;
            });

        };
        
          gestionGrupoModulo.onVolver = function () {
            onLimpiar();
            localStorageService.remove('grupoModulo');
            localStorageService.remove('grupoModuloAuxiliar');
        }; 

        if ($location.path() === '/grupo-modulo') {
            buscarGrupoModulo();
        }
        
        if ($location.path() === '/cud-grupo-modulo') {
            buscarGrupo();
            buscarModulo();
            ejecturarConsultarHorario();
            buscarPeriodo();
        }


    }
})();