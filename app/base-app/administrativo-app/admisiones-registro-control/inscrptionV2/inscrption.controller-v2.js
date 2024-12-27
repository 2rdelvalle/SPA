(function () {
  'use strict';
  angular.module('mytodoApp').controller('inscripcionV2Ctrl', inscripcionV2Ctrl);
  inscripcionV2Ctrl.$inject = ['$scope', 'inscripcionCurService', 'ValidationService','appConstantValueList', 'appGenericConstant', 'appConstant', 'utilServices', 'localStorageService', '$filter', '$timeout'];
  function inscripcionV2Ctrl($scope, inscripcionCurService, ValidationService, appConstantValueList, appGenericConstant, appConstant, utilServices, localStorageService) {

    var inscripcionControlCursos= this;
    inscripcionControlCursos.periodosAcademico = '';
    inscripcionControlCursos.sedes = [];
    inscripcionControlCursos.cursos = [];
    inscripcionControlCursos.lsthorario = [];
    inscripcionControlCursos.lstmodalidad = [];
    inscripcionControlCursos.nuevaInscripcionInicialV2 = inscripcionCurService.inscripcionInicial;
    var codigo_tipo_identificacion = 71;

    inscripcionControlCursos.ejecutarConsultarPeriodoAcademico = function () {

      inscripcionCurService.consultarPeriodoAcademico().then(function (data) {
        inscripcionControlCursos.nuevaInscripcionInicialV2.periodo = data[0].nombrePeriodoAcademico;
        inscripcionControlCursos.periodosAcademico = data[0].id;
        }).catch(function (e) {
            return;
        });
    };

   inscripcionControlCursos.findCursos = function () {
     inscripcionCurService.getCursos(inscripcionControlCursos.nuevaInscripcionInicialV2.sede,
       inscripcionControlCursos.periodosAcademico).then(function (data) {
          inscripcionControlCursos.cursos = [];
            if (data !== null && data.tipo !== 500) {
                angular.forEach(data, function (value) {
                    var curso = {
                        id: value.id,
                        nombrePrograma: value.nombrePrograma,
                        modalidades: value.idModalidades,
                        horarios: value.idHorarios
                    };
                    inscripcionControlCursos.cursos.push(curso);
                });
            }
        }).catch(function (e) {
            return;
        });
    };


    inscripcionControlCursos.ejecutarConsultarTipoDocumentos = function () {
      inscripcionCurService.getListaValorByCategoria(appConstantValueList.LV_TIPO_IDENTIFICACION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
        inscripcionControlCursos.lsttipodocumentos = data;
        inscripcionControlCursos.nuevaInscripcionInicialV2.identificacionAspirante.idTipoIdentificacion = codigo_tipo_identificacion;
      }).catch(function (e) {
        return;
      });
    };
    inscripcionControlCursos.findsede = function () {
      inscripcionCurService.getSedes().then(function (data) {
        inscripcionControlCursos.sedes = data;
      }).catch(function (e) {
          return;
      });
    };
    inscripcionControlCursos.findPreinscripcion = function () {
      if( inscripcionControlCursos.isValidDocument()){

        let aspirant = {
          idTipoIdentificacion: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.tipoDocumento,
          identificacion: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.numeroDocumento
        };
        inscripcionCurService.findPreinscripcion(aspirant).then(function (data) {
          inscripcionControlCursos.setAspirante(data.objectResponse[0]);
        }).catch(function (e) {
          console.error(e);
        });
      }
    };

    inscripcionControlCursos.isValidDocument = function () {
      return inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante &&
        inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.tipoDocumento &&
        inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.numeroDocumento;
    };

    inscripcionControlCursos.setAspirante = function (data) {
      inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.nombre = data.aspirante.nombre;
      inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.apellido = data.aspirante.apellido;
      inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.email = data.aspirante.email;
      inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.celular = data.aspirante.celular;
    };

    inscripcionControlCursos.send = function () {
      if(new ValidationService().checkFormValidity($scope.forminscripcioncurso)){

        let inscriptionAspirant = {
          nombre: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.nombre,
          apellido: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.apellido,
          idPeriodoAcademico: inscripcionControlCursos.periodosAcademico,
          idUniversidad: inscripcionControlCursos.nuevaInscripcionInicialV2.sede,
          idPrograma: inscripcionControlCursos.nuevaInscripcionInicialV2.curso.id,
          tipoDocAspirante: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.tipoDocumento,
          docAspirante: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.numeroDocumento,
          email: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.email,
          celular: inscripcionControlCursos.nuevaInscripcionInicialV2.aspirante.celular,
          valorMatricula: 0,
          valorCurso: 0,
          idHorario: inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario,
          idModalidad: inscripcionControlCursos.nuevaInscripcionInicialV2.idModalidad,
          idTipoConvenio: 3,
          idNivelFormacion: 3,
          userName: localStorageService.get("usuario").username
        };

        inscripcionCurService.postInscripcionCurso(inscriptionAspirant).success(function (response) {
          appConstant.MSG_SWAL_GENERIC('Creado con exito', "success");
          inscripcionControlCursos.nuevaInscripcionInicialV2 = null;
          new ValidationService().resetForm($scope.forminscripcioncurso);
          appConstant.CERRAR_SWAL();
        }).error(function (error) {
          appConstant.MSG_SWAL_GENERIC('No se pudo guardar al estudiante', "error");
        });
      } else {
        appConstant.MSG_SWAL_GENERIC('Verifique los datos', "error");
        return;
        //appConstant.MSG_SWAL_GENERIC('Verifique su correo', "error");
        //return;
      }

     }

    inscripcionControlCursos.ejecturarConsultarHorario = function () {
      inscripcionControlCursos.horariosListAuxListaValor = [];
      utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
          angular.forEach(data, function (value) {
              var horario = {
                  id: value.codigo,
                  nombre: value.valor,
                  referencia: value.referencia
              };
              inscripcionControlCursos.horariosListAuxListaValor.push(horario);
          });
      }).catch(function (e) {
          return;
      });
    };

    inscripcionControlCursos.ejecturarConsultarHorarioSedes = function () {
        utilServices.buscarListaValorByCategoria(appConstantValueList.LV_HORARIO_MEDELLIN, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
            angular.forEach(data, function (value) {
                var horario = {
                    id: value.codigo,
                    nombre: value.valor,
                    referencia: value.referencia
                };
                inscripcionControlCursos.horariosListAuxListaValor.push(horario);
            });
        }).catch(function (e) {
            return;
        });
    };

    inscripcionControlCursos.onChangeSelectModalidad = function () {
        if (typeof inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO === 'undefined') {
            //inscripcionControlCursos.visible.disableSelectHorario = true;
            inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;
        } else {
            inscripcionControlCursos.nuevaInscripcionInicialV2.idModalidad = inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO.id;
            //inscripcionControlCursos.visible.disableSelectHorario = false;
            var idListAux;
            inscripcionControlCursos.lsthorario = [];
            inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;

            angular.forEach(inscripcionControlCursos.lsthorarioAux, function (value) {
                idListAux = value.id;

                angular.forEach(inscripcionControlCursos.horariosListAuxListaValor, function (value) {
                    if ((inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO.id).toString() === value.referencia) {
                        if (idListAux === value.id) {
                            var horario = {
                                id: value.id,
                                nombreHorario: value.nombre
                            };
                            inscripcionControlCursos.lsthorario.push(horario);
                            angular.break;
                        }
                    }
                });
            });
        }
    };

    inscripcionControlCursos.onChangeSelectHorario = function () {
        if (typeof inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO === 'undefined') {
          inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;
        } else {
          inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO.id;
        }
    };

    inscripcionControlCursos.ejecutarConsultarAllModalidadesxPrograma = function () {
      if (typeof inscripcionControlCursos.nuevaInscripcion.curso === 'undefined') {
        inscripcionControlCursos.nuevaInscripcion.curso = null;
      }
      if (inscripcionControlCursos.nuevaInscripcion.curso !== null) {
        inscripcionCurService.consultarAllModalidadesxPrograma(inscripcionControlCursos.nuevaInscripcionInicialV2.curso).then(function (data) {
            inscripcionControlCursos.lstmodalidad = [];
              angular.forEach(data, function (value) {
                  var modalidad = {
                      id: value.id,
                      nombreModalidad: value.nombreModalidad
                  };
                  inscripcionControlCursos.lstmodalidad.push(modalidad);
              });
          }).catch(function (e) {
              return;
          });
      }
  };

  inscripcionControlCursos.ejecutarConsultarAllHorariosxProgramaxModalidad = function () {
    if (typeof inscripcionControlCursos.nuevaInscripcionInicialV2.curso === 'undefined') {
      inscripcionControlCursos.nuevaInscripcionInicialV2.curso = null;
    }
    if (inscripcionControlCursos.nuevaInscripcion.curso !== null) {
      inscripcionCurService.consultarAllHorariosxProgramaxModalidad(inscripcionControlCursos.nuevaInscripcionInicialV2.curso).then(function (data) {
          inscripcionControlCursos.lsthorario = [];
            angular.forEach(data, function (value) {
                var horario = {
                    id: value.id,
                    nombreHorario: value.nombreHorario
                };
                inscripcionControlCursos.lsthorario.push(horario);
            });
        }).catch(function (e) {
            return;
        });
    }
};

inscripcionControlCursos.onChangeSelectPrograma = function () {
  if (typeof inscripcionControlCursos.nuevaInscripcionInicialV2.curso === 'undefined'
          || inscripcionControlCursos.nuevaInscripcionInicialV2.curso === null) {
            inscripcionControlCursos.visible.disableSelectModalidad = true;
            inscripcionControlCursos.visible.disableSelectHorario = true;
            inscripcionControlCursos.nuevaInscripcionInicialV2.idModalidad = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO = null;
            inscripcionControlCursos.nuevaInscripcionInicialV2.curso = null;
  } else {
        inscripcionCurService.buscarConfiguracionByProgramaAndPeriodoAcademico(inscripcionControlCursos.nuevaInscripcionInicialV2.curso.id,
          inscripcionControlCursos.periodosAcademico).then(function (data) {
              if (data.length === 0) {
                inscripcionControlCursos.nuevaInscripcionInicialV2.curso = null;
                  appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EDUCACION_NO_CONTINUADA);
                  inscripcionControlCursos.visible.disableSelectModalidad = true;
                  inscripcionControlCursos.visible.disableSelectHorario = true;
                  inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
                  inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO = null;
                  inscripcionControlCursos.nuevaInscripcionInicialV2.idModalidad = null;
                  inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;
                  return;
              } else {
                inscripcionControlCursos.onFiltrarModalidadYHorarioPorPorgrama(inscripcionControlCursos.nuevaInscripcionInicialV2.curso);
                //inscripcionControlCursos.onChangeProgramaDisabled();
              }
          }).catch(function (e) {
              return;
          });
      }
  };

  inscripcionControlCursos.onFiltrarModalidadYHorarioPorPorgrama = function (item) {
    inscripcionControlCursos.lstmodalidad = [];
    inscripcionControlCursos.lsthorarioAux = [];
    inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO = null;
    inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
    //inscripcionControlCursos.visible.disableSelectHorario = true;
    angular.forEach(item.modalidades, function (value) {
        var modalidad = {
            id: value.id,
            nombreModalidad: value.nombreModalidad
        };
        inscripcionControlCursos.lstmodalidad.push(modalidad);
    });
    angular.forEach(item.horarios, function (value) {
        var horario = {
            id: value.id,
            nombreHorario: value.nombreHorario
        };
        inscripcionControlCursos.lsthorarioAux.push(horario);
    });
};

inscripcionControlCursos.onChangeProgramaDisabled = function () {
      inscripcionControlCursos.nuevaInscripcionInicialV2.curso = inscripcionControlCursos.nuevaInscripcionInicialV2.curso;
      inscripcionControlCursos.visible.disableSelectModalidad = false;
      inscripcionControlCursos.visible.disableSelectHorario = false;
      inscripcionControlCursos.nuevaInscripcionInicialV2.horarioDTO = null;
      inscripcionControlCursos.nuevaInscripcionInicialV2.modalidadDTO = null;
      inscripcionControlCursos.nuevaInscripcionInicialV2.idModalidad = null;
      inscripcionControlCursos.nuevaInscripcionInicialV2.idHorario = null;
    }

    inscripcionControlCursos.ejecutarConsultarPeriodoAcademico();
    inscripcionControlCursos.findsede();
    inscripcionControlCursos.ejecutarConsultarTipoDocumentos();
    inscripcionControlCursos.ejecturarConsultarHorario();
    inscripcionControlCursos.ejecturarConsultarHorarioSedes();

  }
}
)();
