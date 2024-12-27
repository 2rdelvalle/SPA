(function () {
    'use strict';
    angular.module('mytodoApp').controller('liquidarCongresoCtrl', liquidarCongresoCtrl);
    liquidarCongresoCtrl.$inject = ['$scope', 'liquidarCongresoService', 'appConstantValueList', 'appGenericConstant', 'appConstant', 'utilServices', 'localStorageService', '$filter', '$timeout','$location'];
    function liquidarCongresoCtrl($scope, liquidarCongresoService, appConstantValueList, appGenericConstant, appConstant, utilServices, localStorageService, $filter, $timeout,$location) {

      var liquidarCongresosControl = this;
      liquidarCongresosControl.periodosAcademico = '';
      liquidarCongresosControl.sedes = [];
      liquidarCongresosControl.cursos = [];
      liquidarCongresosControl.lsthorario = [];
      liquidarCongresosControl.lstmodalidad = [];
      liquidarCongresosControl.periodo = '';
      liquidarCongresosControl.liquidarCongresoForm = {};
      liquidarCongresosControl.congresos = [];
      liquidarCongresosControl.congreso = null;
      liquidarCongresosControl.estudiante = null;
      liquidarCongresosControl.documento = null;
      liquidarCongresosControl.validate = false;
      liquidarCongresosControl.universidad = null;


      var codigo_tipo_identificacion = 71;

      liquidarCongresosControl .ejecutarConsultarPeriodoAcademico = function () {

        liquidarCongresoService.consultarPeriodoAcademico().then(function (data) {
          liquidarCongresosControl.periodo = data[0].nombrePeriodoAcademico;
          liquidarCongresosControl.periodosAcademico = data[0].id;
          }).catch(function (e) {
              return;
          });
      };
      liquidarCongresosControl.getCongresos = function () {

        liquidarCongresoService.getCongresos().then(function (data) {
          liquidarCongresosControl.congresos = data;
          }).catch(function (e) {
              return;
          });
      };

     liquidarCongresosControl .findCursos = function () {
       liquidarCongresoService.getCursos(liquidarCongresosControl .liquidarCongresoForm.sede,
         liquidarCongresosControl .periodosAcademico).then(function (data) {
            liquidarCongresosControl .cursos = [];
              if (data !== null && data.tipo !== 500) {
                  angular.forEach(data, function (value) {
                      var curso = {
                          id: value.id,
                          nombrePrograma: value.nombrePrograma,
                          modalidades: value.idModalidades,
                          horarios: value.idHorarios
                      };
                      liquidarCongresosControl .cursos.push(curso);
                  });
              }
          }).catch(function (e) {
              return;
          });
      };


      liquidarCongresosControl .ejecutarConsultarTipoDocumentos = function () {
        liquidarCongresoService.getListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
          liquidarCongresosControl .lsttipodocumentos = data;
          liquidarCongresosControl .liquidarCongresoForm.identificacionAspirante.idTipoIdentificacion = codigo_tipo_identificacion;
        }).catch(function (e) {
          return;
        });
      };
      liquidarCongresosControl .findPreinscripcion = function () {
        if( liquidarCongresosControl .isValidDocument()){

          let aspirant = {
            idTipoIdentificacion: liquidarCongresosControl .liquidarCongresoForm.aspirante.tipoDocumento,
            identificacion: liquidarCongresosControl .liquidarCongresoForm.aspirante.numerDocumento
          };
          liquidarCongresoService.findPreinscripcion(aspirant).then(function (data) {
            liquidarCongresosControl .setAspirante(data.objectResponse[0]);
          }).catch(function (e) {
            console.error(e);
          });
        }
      };

      liquidarCongresosControl.isValidDocument = function () {
        return liquidarCongresosControl .liquidarCongresoForm.aspirante &&
          liquidarCongresosControl .liquidarCongresoForm.aspirante.tipoDocumento &&
          liquidarCongresosControl .liquidarCongresoForm.aspirante.numerDocumento;
      };

      liquidarCongresosControl .setAspirante = function (data) {
        liquidarCongresosControl .liquidarCongresoForm.aspirante.nombre = data.aspirante.nombre;
        liquidarCongresosControl .liquidarCongresoForm.aspirante.apellido = data.aspirante.apellido;
        liquidarCongresosControl .liquidarCongresoForm.celular = data.aspirante.celular;
        liquidarCongresosControl .liquidarCongresoForm.aspirante.email = data.aspirante.email;
      };

      liquidarCongresosControl .send = function () {

          let inscriotionAspirant = {
            nombre: null,
            apellido: null,
            idPeriodoAcademico: liquidarCongresosControl.periodosAcademico,
            idPrograma: liquidarCongresosControl.liquidarCongresoForm.curso.id,
            tipoDocAspirante: null,
            docAspirante: liquidarCongresosControl.documento,
            email: null,
            celular: null,
            valorMatricula: null,
            valorCurso: null,
            idHorario: null,
            idModalidad: null,
            idTipoConvenio: null,
            idNivelFormacion: 3,
            idUniversidad: liquidarCongresosControl.universidad,
            userName: null
          };
            appConstant.MSG_SWAL_GENERIC('Creado con exito', "success");

        liquidarCongresoService.postGuardarCongresoLiqui(inscriotionAspirant).then(function (response) {
            liquidarCongresosControl .liquidarCongresoForm = null;
          setTimeout(function() {
            window.location.reload();
          }, 500);
          liquidarCongresosControl.limpiar();
          }).error(function (error) {
            appConstant.MSG_SWAL_GENERIC('No se pudo guardar al estudiante', "error");
          });

      };

      liquidarCongresosControl.onChangeSelectPrograma = function () {
        liquidarCongresosControl.universidad = liquidarCongresosControl.liquidarCongresoForm.curso.sede;
        liquidarCongresoService.consultarValorCongreso(liquidarCongresosControl.liquidarCongresoForm.curso.id).then(function (data) {
          liquidarCongresosControl.congreso = data[0];
          liquidarCongresoService.consultarEstudiante(liquidarCongresosControl.documento).then(function (estudiante) {
            liquidarCongresosControl.estudiante = estudiante[0];
            if(liquidarCongresosControl.estudiante !== null && liquidarCongresosControl.estudiante !== undefined){
              liquidarCongresosControl.validate = true;
            }
          });
        });
      };

      liquidarCongresosControl.validateSend = function () {
        if(liquidarCongresosControl.validate && liquidarCongresosControl.documento !== null && liquidarCongresosControl.estudiante !== null){
          if(liquidarCongresosControl.documento.trim().length > 0){
            return false;
          }
        }
        return true;
      };

        liquidarCongresosControl.limpiar = function () {

        liquidarCongresosControl.universidad = null;
        liquidarCongresosControl.congreso = null;
        liquidarCongresosControl.estudiante = null;
        liquidarCongresosControl.validate = true;
        liquidarCongresosControl.documento = null;
        liquidarCongresosControl.congresos = null;
        liquidarCongresosControl .liquidarCongresoForm.curso = null;

        let inscriotionAspirant = {
          nombre: null,
          apellido: null,
          idPeriodoAcademico: liquidarCongresosControl.periodosAcademico,
          idPrograma: null,
          tipoDocAspirante: null,
          docAspirante: null,
          email: null,
          celular: null,
          valorMatricula: null,
          valorCurso: null,
          idHorario: null,
          idModalidad: null,
          idTipoConvenio: null,
          idNivelFormacion: 3,
          idUniversidad: null,
          userName: null
        };
          liquidarCongresosControl.getCongresos();
      };

      liquidarCongresosControl.ejecturarConsultarHorario = function () {
        liquidarCongresosControl .horariosListAuxListaValor = [];
        utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
            angular.forEach(data, function (value) {
                var horario = {
                    id: value.codigo,
                    nombre: value.valor,
                    referencia: value.referencia
                };
                liquidarCongresosControl .horariosListAuxListaValor.push(horario);
            });
        }).catch(function (e) {
            return;
        });
      };

      liquidarCongresosControl .ejecturarConsultarHorarioSedes = function () {
          utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO_MEDELLIN, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
              angular.forEach(data, function (value) {
                  var horario = {
                      id: value.codigo,
                      nombre: value.valor,
                      referencia: value.referencia
                  };
                  liquidarCongresosControl .horariosListAuxListaValor.push(horario);
              });
          }).catch(function (e) {
              return;
          });
      };

      liquidarCongresosControl .onChangeSelectModalidad = function () {
          if (typeof liquidarCongresosControl .liquidarCongresoForm.modalidadDTO === 'undefined') {
              //liquidarCongresosControl .visible.disableSelectHorario = true;
              liquidarCongresosControl .liquidarCongresoForm.horarioDTO = null;
              liquidarCongresosControl .liquidarCongresoForm.idHorario = null;
          } else {
              liquidarCongresosControl .liquidarCongresoForm.idModalidad = liquidarCongresosControl .liquidarCongresoForm.modalidadDTO.id;
              //liquidarCongresosControl .visible.disableSelectHorario = false;
              var idListAux;
              liquidarCongresosControl .lsthorario = [];
              liquidarCongresosControl .liquidarCongresoForm.horarioDTO = null;
              liquidarCongresosControl .liquidarCongresoForm.idHorario = null;

              angular.forEach(liquidarCongresosControl .lsthorarioAux, function (value) {
                  idListAux = value.id;

                  angular.forEach(liquidarCongresosControl .horariosListAuxListaValor, function (value) {
                      if ((liquidarCongresosControl .liquidarCongresoForm.modalidadDTO.id).toString() === value.referencia) {
                          if (idListAux === value.id) {
                              var horario = {
                                  id: value.id,
                                  nombreHorario: value.nombre
                              };
                              liquidarCongresosControl .lsthorario.push(horario);
                              angular.break;
                          }
                      }
                  });
              });
          }
      };

      liquidarCongresosControl .onChangeSelectHorario = function () {
          if (typeof liquidarCongresosControl .liquidarCongresoForm.horarioDTO === 'undefined') {
            liquidarCongresosControl .liquidarCongresoForm.idHorario = null;
          } else {
            liquidarCongresosControl .liquidarCongresoForm.idHorario = liquidarCongresosControl .liquidarCongresoForm.horarioDTO.id;
          }
      };

      liquidarCongresosControl .ejecutarConsultarAllModalidadesxPrograma = function () {
        if (typeof liquidarCongresosControl .nuevaInscripcion.curso === 'undefined') {
          liquidarCongresosControl .nuevaInscripcion.curso = null;
        }
        if (liquidarCongresosControl .nuevaInscripcion.curso !== null) {
          liquidarCongresoService.consultarAllModalidadesxPrograma(liquidarCongresosControl .liquidarCongresoForm.curso).then(function (data) {
              liquidarCongresosControl .lstmodalidad = [];
                angular.forEach(data, function (value) {
                    var modalidad = {
                        id: value.id,
                        nombreModalidad: value.nombreModalidad
                    };
                    liquidarCongresosControl .lstmodalidad.push(modalidad);
                });
            }).catch(function (e) {
                return;
            });
        }
    };


    liquidarCongresosControl .ejecutarConsultarAllHorariosxProgramaxModalidad = function () {
      if (typeof liquidarCongresosControl .liquidarCongresoForm.curso === 'undefined') {
        liquidarCongresosControl .liquidarCongresoForm.curso = null;
      }
      if (liquidarCongresosControl .nuevaInscripcion.curso !== null) {
        liquidarCongresoService.consultarAllHorariosxProgramaxModalidad(liquidarCongresosControl .liquidarCongresoForm.curso).then(function (data) {
            liquidarCongresosControl .lsthorario = [];
              angular.forEach(data, function (value) {
                  var horario = {
                      id: value.id,
                      nombreHorario: value.nombreHorario
                  };
                  liquidarCongresosControl .lsthorario.push(horario);
              });
          }).catch(function (e) {
              return;
          });
      }
  };

    liquidarCongresosControl .onFiltrarModalidadYHorarioPorPorgrama = function (item) {
      liquidarCongresosControl .lstmodalidad = [];
      liquidarCongresosControl .lsthorarioAux = [];
      liquidarCongresosControl .liquidarCongresoForm.modalidadDTO = null;
      liquidarCongresosControl .liquidarCongresoForm.horarioDTO = null;
      //liquidarCongresosControl .visible.disableSelectHorario = true;
      angular.forEach(item.modalidades, function (value) {
          var modalidad = {
              id: value.id,
              nombreModalidad: value.nombreModalidad
          };
          liquidarCongresosControl .lstmodalidad.push(modalidad);
      });
      angular.forEach(item.horarios, function (value) {
          var horario = {
              id: value.id,
              nombreHorario: value.nombreHorario
          };
          liquidarCongresosControl .lsthorarioAux.push(horario);
      });
  };

  liquidarCongresosControl .onChangeProgramaDisabled = function () {
        liquidarCongresosControl.liquidarCongresoForm.curso = liquidarCongresosControl .liquidarCongresoForm.curso;
        liquidarCongresosControl.visible.disableSelectModalidad = false;
        liquidarCongresosControl.visible.disableSelectHorario = false;
        liquidarCongresosControl.liquidarCongresoForm.horarioDTO = null;
        liquidarCongresosControl.liquidarCongresoForm.modalidadDTO = null;
        liquidarCongresosControl.liquidarCongresoForm.idModalidad = null;
        liquidarCongresosControl.liquidarCongresoForm.idHorario = null;
      }

      liquidarCongresosControl.ejecutarConsultarPeriodoAcademico();
      liquidarCongresosControl.ejecutarConsultarTipoDocumentos();
      liquidarCongresosControl.ejecturarConsultarHorario();
      liquidarCongresosControl.ejecturarConsultarHorarioSedes();
      liquidarCongresosControl.getCongresos();

    }
  }
  )();
