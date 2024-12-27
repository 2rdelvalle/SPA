(function () {
    'use strict';
    angular.module('mytodoApp').controller('asistenciaDiariaCtrl', asistenciaDiariaCtrl);
    asistenciaDiariaCtrl.$inject = ['$scope', 'asistenciaDiariaService', 'asignarNotaDocenteService', '$location', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function asistenciaDiariaCtrl($scope, asistenciaDiariaService, asignarNotaDocenteService, $location, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var asistenciaDiaria = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        asistenciaDiaria.display;
        asistenciaDiaria.selectTodos = false;
        asistenciaDiaria.filtrados = [];
        asistenciaDiaria.estados = [];
        asistenciaDiaria.listadoModulos = [];
        asistenciaDiaria.listadoGrupos = [];
        asistenciaDiaria.options = appConstant.FILTRO_TABLAS;
        asistenciaDiaria.selectedOption = asistenciaDiaria.options[0];
        asistenciaDiaria.cantidadDias = [];
        asistenciaDiaria.cantidadDiasSelect = [];
        asistenciaDiaria.listadoEstudiantes = [];
        asistenciaDiaria.idDiaAsistencia = null;
        asistenciaDiaria.identiocente = localStorageService.get("usuario").identificacion;

        function buscarModulo() {
            asignarNotaDocenteService.buscarModuloByDocente(asistenciaDiaria.identiocente).then(function (data) {
                asistenciaDiaria.listadoModulos = [];
                asistenciaDiaria.listadoModulos = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        function buscarEstudiantes() {
            asistenciaDiariaService.buscarEstudiantesRetiradosAsistencia().then(function (data) {
                asistenciaDiaria.listEstudiantes = [];
                asistenciaDiaria.listEstudiantes = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        asistenciaDiaria.onBuscarGruposByModulo = function () {
            if (asistenciaDiaria.modulo === null || asistenciaDiaria.modulo === undefined) {
                asistenciaDiaria.listadoGrupos = [];
                asistenciaDiaria.listadoEstudiantes = [];
                return;
            }

            asignarNotaDocenteService.buscarGruposModulo(asistenciaDiaria.modulo.idModulo, asistenciaDiaria.identiocente, asistenciaDiaria.modulo.idPeriodo, asistenciaDiaria.modulo.idHorario).then(function (data) {
                asistenciaDiaria.listadoGrupos = [];
                asistenciaDiaria.listadoGrupos = data;
                asistenciaDiaria.listadoEstudiantes = [];
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        asistenciaDiaria.onConsultarEstudiantes = function (save) {
          asistenciaDiaria.cantidadDiasSelect = [];
          asistenciaDiaria.cantidadDias = [];
          if(save === null || save === undefined ){
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
          }
            if (asistenciaDiaria.idGrupo === null || asistenciaDiaria.idGrupo === "" || asistenciaDiaria.idGrupo === undefined) {
                asistenciaDiaria.listadoEstudiantes = [];
                appConstant.CERRAR_SWAL();
                return;
            }

            asistenciaDiaria.cantidadDias = [];
            for (var j = 1; j <= asistenciaDiaria.idGrupo.diasAsistencia; j++) {
                var dto = {
                    id: j,
                    cantidadDias: 'Asistencia ' + j
                };
                asistenciaDiaria.cantidadDiasSelect.push(dto);
                asistenciaDiaria.cantidadDias.push(dto);
            }
              var AllAsis = {
                id: 0,
                cantidadDias: 'Asistencia Completa'
              };
             asistenciaDiaria.cantidadDiasSelect.push(AllAsis);
            asistenciaDiaria.listadoEstudiantes = [];
            asistenciaDiariaService.buscarEstudiantesByGrupo(asistenciaDiaria.idGrupo.id).then(function (data) {
                asistenciaDiaria.listadoEstudiantes = data;

                angular.forEach(asistenciaDiaria.listadoEstudiantes, function (value, key) {
                    value.asistenciasNew = [];
                    if (value.asistencias === "" || value.asistencias === null || value.asistencias === undefined) {
                        value.asistencias = [];
                        value.asistenciasNew = [];
                        value.noRegistra = true;
                        angular.forEach(asistenciaDiaria.cantidadDias, function (valueDias, key) {
                            var dto = {
                                idEstudiante: value.idEstudiante,
                                idGrupo: asistenciaDiaria.idGrupo.id,
                                asistencia: 'SI',
                                numeroAsistencia: valueDias.id
                            };
                            value.asistenciasNew.push(dto);
                        });
                    } else {
                        var contador = 1;
                        angular.forEach(value.asistencias, function (valueDias, key) {
                            if (contador <= parseInt(asistenciaDiaria.idGrupo.diasAsistencia)) {
                                valueDias.asitencia === "SI" ? 'SI' : 'NO';
                                valueDias.asistencia = valueDias.asitencia;
                                value.asistenciasNew.push(valueDias);
                            }
                            contador++;
                        });
                    }
                });
            });
          if(save === null || save === undefined ){
            appConstant.CERRAR_SWAL();
          }
        };

        asistenciaDiaria.onChangeAsistencia = function () {
            angular.forEach(asistenciaDiaria.listadoEstudiantes, function (value, key) {
                if (value.asistencias === "" || value.asistencias === null || value.asistencias === undefined) {
                    value.asistencias = [];
                    angular.forEach(asistenciaDiaria.cantidadDias, function (valueDias, key) {
                        var dto = {
                            idEstudiante: value.idEstudiante,
                            idGrupo: asistenciaDiaria.idGrupo.id,
                            asistencia: 'SI',
                            numeroAsistencia: valueDias.id
                        };
                        value.asistencias.push(dto);
                    });
                }
            });
        };

        asistenciaDiaria.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAsistenciaDiaria)) {
                asistenciaDiaria.guardarAsistencia();
                new ValidationService().resetForm($scope.formAsistenciaDiaria);
            }
          setTimeout(consul, 1000);
        };

      function consul(){
        asistenciaDiaria.onConsultarEstudiantes(true);
      }

        asistenciaDiaria.guardarAsistencia = function () {
            asistenciaDiaria.listAsistencia = [];

            angular.forEach(asistenciaDiaria.listadoEstudiantes, function (value, key) {
                angular.forEach(value.asistenciasNew, function (valueDias, key) {
                    valueDias.idUsuarioRegistro = localStorageService.get("usuario").id;
                    asistenciaDiaria.listAsistencia.push(valueDias);
                });
            });
            var saveAssis = {
              listAsistencia: asistenciaDiaria.listAsistencia,
              day: asistenciaDiaria.idDiaAsistencia
            };
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var asisExist = null;
            var asist = null;
            asist = saveAssis.listAsistencia.filter(item => item.numeroAsistencia === saveAssis.day && item.id === null);
          if(saveAssis.day === 0){
              asisExist = saveAssis.listAsistencia.filter(item => item.id !== null);
            }else {
              asisExist = saveAssis.listAsistencia.filter(item => item.numeroAsistencia === saveAssis.day && item.id !== null);
            }
            if(asisExist.length === 0 && saveAssis.day === 0){

              guardarAsis(saveAssis);

            }else if(saveAssis.day === 0){
              appConstant.MSG_LOADING("La asistencia no se puede actualizar");
            }
            if(asist.length > 0 && saveAssis.day !== 0){
              guardarAsis(saveAssis);

            }else if (saveAssis.day !== 0){

              appConstant.MSG_LOADING("La asistencia para el dia "+ saveAssis.day + " ya fue tomada");

            }
        };

        function guardarAsis(saveAssis) {
          asistenciaDiariaService.registarAsistencia(saveAssis).then(function (data) {
            if (data.tipo === 200) {
              appConstant.CERRAR_SWAL();
              appConstant.MSG_GROWL_OK(data.message);
            }
          }).catch(function (e) {
            appConstant.MSG_GROWL_ERROR();
            throw e;
          });
        }

        buscarModulo();
        buscarEstudiantes();
    }
})();

