(function () {
    'use strict';
    angular.module('mytodoApp').controller('programacionAcademicaCtrl', programacionAcademicaCtrl);
    programacionAcademicaCtrl.$inject = ['$scope','programacionAcademicaServices', 'asignarNotaServiceGnrl', '$location', 'localStorageService', 'appConstant', 'appGenericConstant', '$timeout', '$filter'];
    function programacionAcademicaCtrl($scope, programacionAcademicaServices, asignarNotaServiceGnrl, $location, localStorageService, appConstant, appGenericConstant, $timeout, $filter) {
        var gestionProgramacionAcademica = this;
        gestionProgramacionAcademica.programacionAcademicaList = [];
        gestionProgramacionAcademica.programacionAcademicaListAuto = [];
        gestionProgramacionAcademica.display;
        gestionProgramacionAcademica.width;
        gestionProgramacionAcademica.nivelesAcademicosList = [];
        gestionProgramacionAcademica.periodoAcademicoList = [];
        gestionProgramacionAcademica.modulos = programacionAcademicaServices.modulos;
        gestionProgramacionAcademica.modalidadesByModulo = [];
        gestionProgramacionAcademica.recursoEducativoFisicoList = [];
        gestionProgramacionAcademica.cola = [];
        gestionProgramacionAcademica.selectTodos = false;
        gestionProgramacionAcademica.agregar = true;
        gestionProgramacionAcademica.programacionAcademica = programacionAcademicaServices.programacionAcademica;
        gestionProgramacionAcademica.programacionAcademicaAuxiliar = programacionAcademicaServices.programacionAcademicaAuxiliar;
        gestionProgramacionAcademica.promaca = programacionAcademicaServices.promaca;
        gestionProgramacionAcademica.programacionAcademica.inscripcion = false;
        gestionProgramacionAcademica.programacionAcademica.programacion = [];
        gestionProgramacionAcademica.switchInscripcion = true;
        gestionProgramacionAcademica.options = appConstant.FILTRO_TABLAS;
        gestionProgramacionAcademica.counter = 0;
        gestionProgramacionAcademica.identificador = '';
        gestionProgramacionAcademica.modulo = {};
        gestionProgramacionAcademica.programaAsignaturasList = [];
        gestionProgramacionAcademica.moduloTransversal = [];
        gestionProgramacionAcademica.selectedOption = gestionProgramacionAcademica.options[0];
        gestionProgramacionAcademica.semestre = [{nombreNivel: 1, value: 1}, {nombreNivel: 2, value: 2}, {nombreNivel: 3, value: 3}, {nombreNivel: 4, value: 4}];
        gestionProgramacionAcademica.report = {selected: null};
        gestionProgramacionAcademica.tablaTransversal = false;
        gestionProgramacionAcademica.tablaTransversalList = [];
        gestionProgramacionAcademica.sendPrograma = [];
        gestionProgramacionAcademica.enableModulo = true;
        gestionProgramacionAcademica.seccionales = [];
        gestionProgramacionAcademica.nivelesformacion = [];

        //consultar seccionales
        function ejecutarConsultarSeccional() {
            programacionAcademicaServices.consultarSeccional().then(function (data) {
                gestionProgramacionAcademica.seccionales = [];
                gestionProgramacionAcademica.seccionales = data;
            }).catch(function (e) {
                return;
            });
        };

        function ejecutarConsultarNivelFormacion () {
            programacionAcademicaServices.consultarNivelFormacion().then(function (data) {
                gestionProgramacionAcademica.nivelesformacion = [];
                gestionProgramacionAcademica.nivelesformacion = data;
            }).catch(function (e) {
                return;
            });
        };

        //consultar periodos acádemicos activos
        function onBuscarPeriodoAcademico() {
            programacionAcademicaServices.buscarPeriodo().then(function (data) {
                gestionProgramacionAcademica.periodoAcademicoList = data;
            });
        }

        // Consutlar porgramaciones acádemicas creadas
        function onBuscarProgramacionAcademica() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            programacionAcademicaServices.buscarProgramacionAcademica().then(function (data) {
                gestionProgramacionAcademica.programacionAcademicaList = data;
                appConstant.CERRAR_SWAL();
            });
        }

        //Consultar listado de programas
        gestionProgramacionAcademica.onBuscarProgramasAcademicos = function (idNivelFormacion, item, item2) {
            gestionProgramacionAcademica.programaAcademicolist = [];
            programacionAcademicaServices.consultarProgramaNivelformacion(idNivelFormacion, item, item2).then(function (programas) {
                angular.forEach(programas, function (value, key) {
                    var programa = {
                        id: value.id,
                        nombrePrograma: value.nombrePrograma
                    };
                    gestionProgramacionAcademica.programaAcademicolist.push(programa);
                });
            });
        };

        // buscar los modulos por semestre y programa   en su malla acádemica
        gestionProgramacionAcademica.selectModuloSemestre = function (programa, semestre) {
            gestionProgramacionAcademica.programaAsignaturasList = [];
            asignarNotaServiceGnrl.buscarModuloByIdPrograma(programa).then(function (data) {

               angular.forEach(data, function (value, key) {
                    var asignaMalla = {
                        id: value.id,
                        nombreAsignatura: value.nombre
                    };
                    gestionProgramacionAcademica.programaAsignaturasList.push(asignaMalla);
                    gestionProgramacionAcademica.enableModulo = false;
               });
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

      gestionProgramacionAcademica.selectModuloPrograma = function (programa) {
        gestionProgramacionAcademica.programaAsignaturasList = [];
        asignarNotaServiceGnrl.buscarModuloByIdPrograma(programa).then(function (data) {

          angular.forEach(data, function (value, key) {
            var asignaMalla = {
              id: value.id,
              nombreAsignatura: value.nombre
            };
            gestionProgramacionAcademica.programaAsignaturasList.push(asignaMalla);
            gestionProgramacionAcademica.enableModulo = false;
          });
        }).catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
      };

      gestionProgramacionAcademica.disableSeccional = function (){
        return gestionProgramacionAcademica.promaca.idSeccional === null || gestionProgramacionAcademica.promaca.idSeccional === undefined;
      };

      gestionProgramacionAcademica.disableNivelFormacion = function (){
        return gestionProgramacionAcademica.promaca.idNivelFormacion === null || gestionProgramacionAcademica.promaca.idNivelFormacion === undefined;
      };

      gestionProgramacionAcademica.disableSemestre = function (){
        return gestionProgramacionAcademica.promaca.idPrograma === null || gestionProgramacionAcademica.promaca.idPrograma === undefined;
      };

      gestionProgramacionAcademica.disableAsignatura = function (){
        return gestionProgramacionAcademica.enableModulo;
      };

       gestionProgramacionAcademica.moduloTransversal = function(idModulo){
         if (gestionProgramacionAcademica.promaca.id === null || gestionProgramacionAcademica.promaca.id === undefined) {
           let modulo = null;
           let programaSelect = gestionProgramacionAcademica.promaca.idPrograma;
           programacionAcademicaServices.getbuscarModulo(idModulo).then(function (data) {
             modulo = data;
             if(modulo.transversal === 'SI'){
               gestionProgramacionAcademica.tablaTransversal = true;
               let periodo = gestionProgramacionAcademica.programacionAcademica.periodoAcademico;
               programacionAcademicaServices.getbuscarProgramasModulo(idModulo,
                                                                    gestionProgramacionAcademica.programacionAcademica.idNivelFormacion,periodo,
                                                                    gestionProgramacionAcademica.programacionAcademica.idSeccional).then(function (programas){
                 programas.forEach(programa => {
                   if(programa.id !== programaSelect){
                     let pro = {
                       id: programa.id,
                       nombrePrograma: programa.nombrePrograma,
                       seleccionado: programa.seleccionado
                     };
                     gestionProgramacionAcademica.tablaTransversalList.push(pro);
                   }
                 });
               });
             }
             if(modulo.transversal === 'NO'){
               gestionProgramacionAcademica.tablaTransversalList.length  = 0;
               gestionProgramacionAcademica.tablaTransversal = false;
             }
           });
         }
       };

      gestionProgramacionAcademica.checkAllProgramas = function (idCheckAll, classCheckHijos) {
        gestionProgramacionAcademica.sendPrograma = [];
        if ($("#"+ idCheckAll).is(':checked')) {

          $("."+ classCheckHijos).prop('checked', true);
          var i;
          for (i = 0; i < gestionProgramacionAcademica.tablaTransversalList.length; i++) {
            gestionProgramacionAcademica.tablaTransversalList[i].seleccionado = true;
            gestionProgramacionAcademica.sendPrograma.push(gestionProgramacionAcademica.tablaTransversalList[i].id);
          }

        } else {
          $("."+ classCheckHijos).prop('checked', false);
          gestionProgramacionAcademica.sendPrograma = [];
          for (i = 0; i < gestionProgramacionAcademica.tablaTransversalList.length; i++) {
            gestionProgramacionAcademica.tablaTransversalList[i].seleccionado = false;
          }
        }
      };

      gestionProgramacionAcademica.checkProgramas = function (item, idCheckAll, classCheckHijos, idCheck) {
        let list = [];
        $("." + classCheckHijos).change(function () {
          $("#" + idCheckAll).prop('checked', false);
        });
        if ($("#chekValor" + item.id).is(':checked')) {
          gestionProgramacionAcademica.sendPrograma.push(item.id);

        } else {
          gestionProgramacionAcademica.sendPrograma.forEach(programa => {
            if(programa !== item.id){
              list.push(programa);
            }
          });
          gestionProgramacionAcademica.sendPrograma = list;
        }
      };

        gestionProgramacionAcademica.onBuscarRecurso = function (seccional) {
            gestionProgramacionAcademica.recursoEducativoFisicoList = [];
            programacionAcademicaServices.buscarRecursoFisico(seccional).then(function (data) {
                gestionProgramacionAcademica.recursoEducativoFisicoList = data;
            });
        };

        // cargar los modulos por calendario academico para periodo seleccionado
        gestionProgramacionAcademica.onFiltrar = function (item, item2, idNivelFormacion) {
            gestionProgramacionAcademica.modulos.modulo = [];
            programacionAcademicaServices.buscarModulosPorPeriodo(item).then(function (data) {
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.mostrarNoPrograma = data.length === appGenericConstant.CERO;
                switch (data.tipo) {
                    case appGenericConstant.OK:
                        gestionProgramacionAcademica.modulos.modulo = data.responseList;
                        gestionProgramacionAcademica.onBuscarProgramasAcademicos(idNivelFormacion,item,item2);
                        gestionProgramacionAcademica.onListarDocentes(item2);
                        gestionProgramacionAcademica.onBuscarRecurso(item2);
                        break;
                    case appGenericConstant.ADVERTENCIA:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                    case appGenericConstant.ERROR4:
                        appConstant.MSG_GROWL_ERROR();
                        break;
                    case appGenericConstant.ERROR:
                        appConstant.MSG_GROWL_ERROR();
                        break;
                }
            });
        };


        gestionProgramacionAcademica.onFiltrarHorPerSede = function (idNivelFormacion,item,item2) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionProgramacionAcademica.onBuscarProgramasAcademicos(idNivelFormacion,item,item2);
            gestionProgramacionAcademica.onListarDocentes(item2);
            gestionProgramacionAcademica.onBuscarRecurso(item2);
            appConstant.CERRAR_SWAL();
        };

        //Consultar modalidades por modulo seleccionado
        gestionProgramacionAcademica.onFiltrarModulo = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            localStorageService.remove('modalidades');
            localStorageService.remove('modulocalendario');
            gestionProgramacionAcademica.modalidadesByModulo = [];
            gestionProgramacionAcademica.modulo = item;
            gestionProgramacionAcademica.identificador = item.id;
            programacionAcademicaServices.buscarModalidadesPorModulos(item.id, item.modulo).then(function (data) {
                gestionProgramacionAcademica.modalidadesByModulo = data[0].modalidad;
                localStorageService.set('modalidades',
                        {
                            moduloCalendario: gestionProgramacionAcademica.modulo,
                            madalidades: gestionProgramacionAcademica.modalidadesByModulo
                        });
                appConstant.CERRAR_SWAL();
            });
        };

        //cargar el listado de programciones por horarios
        gestionProgramacionAcademica.onFiltarHorarioModulo = function (modalidad, horario, item) {
            localStorageService.remove('horariosProgramacion');
            localStorageService.remove('modulocalendario');
            var horarioProgramacion = {
                modalidad: modalidad,
                horario: horario,
                id: item.id,
                modulo: item.modulo
            };
            localStorageService.set('horariosProgramacion', horarioProgramacion);
            $location.path('/programacion-academica-horarios');
        };

        //cargar el listado de registros por horario
        function horarioDetalle(modalidad, horario, id, modulo) {
            localStorageService.remove('programacion');
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.titulo = "Listado de programación por horario : " + horario.horario;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle = [];
            programacionAcademicaServices.buscarHorarioModulo(modalidad.idModalidad, horario.idHorario, id, modulo).then(function (data) {
              appConstant.CARGANDO();
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle = data;
                validateList()
                if (gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle[0] !== undefined) {
                    localStorageService.set('programacion', gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle[0].idDetalleProgramacion);
                }
            });
        };

      function validateList() {
        gestionProgramacionAcademica.agregar = false;
        };

        //crear  un registro de porgramación asociado a un horario
        gestionProgramacionAcademica.onIrRegistrarHorarioProgramacion = function () {
            var horarioProgramacionAcademicac = localStorageService.get('horariosProgramacion');
            gestionProgramacionAcademica.onLimpiarHorarioProgramacion();
            gestionProgramacionAcademica.promaca.titulo = "Agregar programación por horario ";
            gestionProgramacionAcademica.promaca.disable = true;
            gestionProgramacionAcademica.promaca.modulo = horarioProgramacionAcademicac.modulo;
            gestionProgramacionAcademica.promaca.modalidad = horarioProgramacionAcademicac.modalidad.modalidad;
            gestionProgramacionAcademica.promaca.modalidadhorario = horarioProgramacionAcademicac.modalidad;
            gestionProgramacionAcademica.promaca.horario = horarioProgramacionAcademicac.horario.horario;
            gestionProgramacionAcademica.promaca.idHorario = horarioProgramacionAcademicac.horario.idHorario;
            gestionProgramacionAcademica.promaca.id = null;
            gestionProgramacionAcademica.promaca.idDetalleProgramacion = localStorageService.get('programacion');
            localStorageService.set('programacionAuxiliar', gestionProgramacionAcademica.promaca);
            $location.path('/programacion-academica-horarios-details');
        };

        // actulizar  un registro de porgramación asociado a un horario
        gestionProgramacionAcademica.onUpdateRegistrarHorarioProgramacion = function (item) {
            var horarioProgramacionAcademicac = localStorageService.get('horariosProgramacion');
            gestionProgramacionAcademica.onLimpiarHorarioProgramacion();
            gestionProgramacionAcademica.promaca.titulo = "Agregar programación por horario ";
            gestionProgramacionAcademica.promaca.disable = true;
            gestionProgramacionAcademica.promaca.modulo = horarioProgramacionAcademicac.modulo;
            gestionProgramacionAcademica.promaca.modalidad = horarioProgramacionAcademicac.modalidad.modalidad;
            gestionProgramacionAcademica.promaca.horario = horarioProgramacionAcademicac.horario.horario;
            gestionProgramacionAcademica.promaca.idDetalleProgramacion = item.idDetalleProgramacion;
            gestionProgramacionAcademica.promaca.idPrograma = item.idPrograma;
            gestionProgramacionAcademica.promaca.idHorario = item.idHorario;
            gestionProgramacionAcademica.promaca.idModuloAsignatura = item.idModuloAsignatura;
            gestionProgramacionAcademica.promaca.idDocente = item.idDocente;
            gestionProgramacionAcademica.promaca.idAula = item.idAula;
            gestionProgramacionAcademica.promaca.semestre = item.semestre;
            gestionProgramacionAcademica.promaca.id = item.id;
            gestionProgramacionAcademica.promaca.idSeccional = item.idSeccional;
            gestionProgramacionAcademica.promaca.idNivelFormacion = item.idNivelFormacion;
            localStorageService.set('mallamadulo', item.listaModulos[0].modulos);
            localStorageService.set('programacionAuxiliar', gestionProgramacionAcademica.promaca);
            $location.path('/programacion-academica-horarios-details');
        };
        //listar docentes para crear el registro de porgramación por horario
        gestionProgramacionAcademica.onListarDocentes = function (seccional) {
            gestionProgramacionAcademica.listaDocentes = [];
            programacionAcademicaServices.consultarDocenteSedePorEstado(seccional).then(function (data) {
                gestionProgramacionAcademica.listaDocentes = data;
            });
        };

        gestionProgramacionAcademica.onLimpiar = function () {
            programacionAcademicaServices.programacionAcademica = {};
            localStorageService.remove('modalidades');
            gestionProgramacionAcademica.programacionAcademica.id = null;
            gestionProgramacionAcademica.programacionAcademica.periodoAcademico = null;
            gestionProgramacionAcademica.programacionAcademica.nivelFormacionSelect = null;
            gestionProgramacionAcademica.programacionAcademica.programaAcademico = null;
            gestionProgramacionAcademica.programacionAcademica.recursoEducativo = null;
            gestionProgramacionAcademica.programacionAcademica.idSeccional = null;
            gestionProgramacionAcademica.programacionAcademica.idNivelFormacion = null;
            $('#div1').removeClass('col-sm-12').addClass('col-sm-6');
            $('#div2').removeClass('col-sm-12').addClass('col-sm-6');
            $('#div1').removeClass('col-lg-12').addClass('col-lg-6');
            $('#div2').removeClass('col-lg-12').addClass('col-lg-6');
        };

        // Agregar programacion acádemica
        gestionProgramacionAcademica.onClickToAddPlaneacionAcademica = function () {
            gestionProgramacionAcademica.onLimpiar();
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.quitaTabla = true;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.disableVerDetalle = false;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.disabledEdit = false;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.mostrarDetalle = false;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.disableCodigo = true;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.disableButton = false;
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.titulo = "Agregar Programación Académica";
            localStorageService.set('programacionAcademica', null);
            localStorageService.set('programacionAcademicaAuxiliar', gestionProgramacionAcademica.programacionAcademicaAuxiliar);
        };
        gestionProgramacionAcademica.onClickToAddProgramacionAutomatizada = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            programacionAcademicaServices.buscarProgramacionAcademicaAuto().then(function (data) {
                gestionProgramacionAcademica.programacionAcademicaListAuto = data;
                appConstant.CERRAR_SWAL();
            });
        };
        //Acción Para Validar, Guargar o Editar Períodos Académicos*/
        gestionProgramacionAcademica.onSubmitForm = function () {
            if (gestionProgramacionAcademica.programacionAcademica.id === null || gestionProgramacionAcademica.programacionAcademica.id === undefined) {
                gestionProgramacionAcademica.onAddProgramacionAcademica();
            } else {
                gestionProgramacionAcademica.onUpdateProgramacionAcademica();
            }
        };

        //Agregar programación a cada horario
        gestionProgramacionAcademica.onSubmitFormProgramacion = function () {
            if (gestionProgramacionAcademica.promaca.id === null || gestionProgramacionAcademica.promaca.id === undefined) {
                gestionProgramacionAcademica.onAddProgramacionAcademicaHorario();
            } else {
                gestionProgramacionAcademica.onUpdateProgramacionAcademicaHorario();
            }
        };

        //Acción Para Validar Y Agregar Programacion por periodo
        gestionProgramacionAcademica.onAddProgramacionAcademica = function () {
            var programacion = {
                id: null,
                idPeriodo: gestionProgramacionAcademica.programacionAcademica.periodoAcademico,
                idSeccional: gestionProgramacionAcademica.programacionAcademica.idSeccional,
                idNivelFormacion: gestionProgramacionAcademica.programacionAcademica.idNivelFormacion,
                detalleProgramacionAcademica: gestionProgramacionAcademica.modalidadesByModulo,
                estado: appGenericConstant.ESTADO_ACTIVO,
                idUsuarioCreacion: localStorageService.get('autorizacion').objectResponse.userDto.id,
                idCalendario: gestionProgramacionAcademica.identificador
            };
            programacionAcademicaServices.agregarProgramacionAcademica(programacion).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    gestionProgramacionAcademica.onLimpiar();
                } else if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            });
        };
        //Acción Para Validar Y Modificar por periodo */
        gestionProgramacionAcademica.onUpdateProgramacionAcademica = function () {
            var programacion = {
                id: gestionProgramacionAcademica.programacionAcademica.id,
                idPeriodo: gestionProgramacionAcademica.programacionAcademica.periodoAcademico,
                idSeccional: gestionProgramacionAcademica.programacionAcademica.idSeccional,
                idNivelFormacion: gestionProgramacionAcademica.programacionAcademica.idNivelFormacion,
                detalleProgramacionAcademica: gestionProgramacionAcademica.modalidadesByModulo,
                estado: appGenericConstant.ESTADO_ACTIVO,
                idUsuarioCreacion: localStorageService.get('autorizacion').objectResponse.userDto.id,
                idCalendario: gestionProgramacionAcademica.identificador
            };
            programacionAcademicaServices.actualizarProgramacionAcademica(programacion).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    gestionProgramacionAcademica.onFiltrarModulo(gestionProgramacionAcademica.modulo);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('programacionAcademicaAuxiliar', gestionProgramacionAcademica.programacionAcademicaAuxiliar);
                } else if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        //Limpiar la vista al crear un nuevo registro de programación asociada a un horario especifico
        gestionProgramacionAcademica.onLimpiarHorarioProgramacion = function () {
            gestionProgramacionAcademica.promaca.id = null;
            gestionProgramacionAcademica.promaca.idPrograma = null;
            gestionProgramacionAcademica.promaca.idModuloAsignatura = null;
            gestionProgramacionAcademica.promaca.idDocente = null;
            gestionProgramacionAcademica.promaca.idAula = null;
            gestionProgramacionAcademica.promaca.semestre = null;
            gestionProgramacionAcademica.promaca.idSeccional = null;
            gestionProgramacionAcademica.promaca.idNivelFormacion = null;
            gestionProgramacionAcademica.sendPrograma = [];
            gestionProgramacionAcademica.tablaTransversalList = [];
            gestionProgramacionAcademica.tablaTransversal = false;
        };

        gestionProgramacionAcademica.onVolver = function () {
            gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle = [];
        };

        gestionProgramacionAcademica.validarDisponibilidadAula= function (){
            programacionAcademicaServices.validarDisponibilidadAula(gestionProgramacionAcademica.promaca.idAula,
                gestionProgramacionAcademica.promaca.modulo,
                gestionProgramacionAcademica.programacionAcademica.periodoAcademico,
                gestionProgramacionAcademica.promaca.idHorario,
                gestionProgramacionAcademica.promaca.idModuloAsignatura ).then(function (data) {
                //if (data.tipo === appGenericConstant.OK) {
                //    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                //} else
                if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            });
        }

        //Acción Para Validar Y Agregar Programacion por horario
        gestionProgramacionAcademica.onAddProgramacionAcademicaHorario = function () {

            var detalle = {
                idProgramacionAcademica: localStorageService.get('programacionAcademica').id,
                idModulo: gestionProgramacionAcademica.promaca.modalidadhorario.idModulo,
                idModalidad: gestionProgramacionAcademica.promaca.modalidadhorario.idModalidad,
                fechaInicio: gestionProgramacionAcademica.promaca.modalidadhorario.fechaInicio,
                fechaFin: gestionProgramacionAcademica.promaca.modalidadhorario.fechaFin
            };
            var programacion = {
                id: null,
                idDetalleProgramacion: gestionProgramacionAcademica.promaca.idDetalleProgramacion,
                idPrograma: gestionProgramacionAcademica.promaca.idPrograma,
                idHorario: gestionProgramacionAcademica.promaca.idHorario,
                idModuloAsignatura: gestionProgramacionAcademica.promaca.idModuloAsignatura,
                idDocente: gestionProgramacionAcademica.promaca.idDocente,
                idAula: gestionProgramacionAcademica.promaca.idAula,
                idUsuarioCreacion: localStorageService.get('autorizacion').objectResponse.userDto.id,
                idUsuarioModificacion: null,
                semestre: gestionProgramacionAcademica.promaca.semestre,
                idCalendario: gestionProgramacionAcademica.identificador,
                idNumeroModulo: gestionProgramacionAcademica.promaca.modulo,
                numeroModulo: gestionProgramacionAcademica.promaca.modulo,
                detalleProgramacion: detalle
            };
          gestionProgramacionAcademica.sendPrograma.push(gestionProgramacionAcademica.promaca.idPrograma);
            var programacionTras = {
              configuracionProgramacionAcademicaDTO: programacion,
              idProgramas: gestionProgramacionAcademica.sendPrograma
            };
            programacionAcademicaServices.postAddHorarioProgramacionTransversales(programacionTras).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    gestionProgramacionAcademica.onLimpiarHorarioProgramacion();
                } else if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            });
        };

        //Acción Para Validar Y Modificar por horario */
        gestionProgramacionAcademica.onUpdateProgramacionAcademicaHorario = function () {
            var programacion = {
                id: gestionProgramacionAcademica.promaca.id,
                idDetalleProgramacion: gestionProgramacionAcademica.promaca.idDetalleProgramacion,
                idPrograma: gestionProgramacionAcademica.promaca.idPrograma,
                idHorario: gestionProgramacionAcademica.promaca.idHorario,
                idModuloAsignatura: gestionProgramacionAcademica.promaca.idModuloAsignatura,
                idDocente: gestionProgramacionAcademica.promaca.idDocente,
                idAula: gestionProgramacionAcademica.promaca.idAula,
                idUsuarioModificacion: localStorageService.get('autorizacion').objectResponse.userDto.id,
                semestre: gestionProgramacionAcademica.promaca.semestre,
                idNumeroModulo: gestionProgramacionAcademica.promaca.modulo,
                idPeriodo : gestionProgramacionAcademica.programacionAcademica.periodoAcademico,
                idSeccional: gestionProgramacionAcademica.programacionAcademica.idSeccional,
                idNivelFormacion: gestionProgramacionAcademica.programacionAcademica.idNivelFormacion
            };
            programacionAcademicaServices.actualizarProgramacionAcademicaHorario(programacion).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                  appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                  gestionProgramacionAcademica.onLimpiarHorarioProgramacion();
                } else if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        //Método Para Obtener El  Período Académico actualizar
        gestionProgramacionAcademica.onClickToUpdateProgramacionAcademica = function (programacion) {
            onBuscarProgramacionAcademicaOnClick(programacion, true, false, appGenericConstant.MODIFICAR_PROGRAMACION_ACEDEMICA);
        };

        //Método Para Obtener El  Período Académico A Ver Detalle
        gestionProgramacionAcademica.onClickToVerDetalleProgramacionAcademica = function (programacion) {
            onBuscarProgramacionAcademicaOnClick(programacion, true, true, appGenericConstant.DETALLE_PROGRAMACION_ACADEMICA);
        };

        //buscar programación acádemica para cargar el listado de programacions por horario
        function onBuscarProgramacionAcademicaOnClick(programacion, mostrarDetalle, verDetalle, titulo) {
            gestionProgramacionAcademica.modulos.modulo = [];
            localStorageService.remove('programacionAcademica');
            localStorageService.remove('programacionAcademicaAuxiliar');
            gestionProgramacionAcademica.onLimpiar();
            programacionAcademicaServices.buscarPorProgramacion(programacion.id).then(function (item) {
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.mostrarDetalle = mostrarDetalle;
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.disableVerDetalle = verDetalle;
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.disabledEdit = true;
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.titulo = titulo;
                gestionProgramacionAcademica.programacionAcademicaAuxiliar.disableButton = true;
                gestionProgramacionAcademica.programacionAcademica.id = item.objectResponse.id;
                gestionProgramacionAcademica.programacionAcademica.periodoAcademico = item.objectResponse.idPeriodo;
                gestionProgramacionAcademica.programacionAcademica.idSeccional = item.objectResponse.idSeccional;
                gestionProgramacionAcademica.programacionAcademica.idNivelFormacion = item.objectResponse.idNivelFormacion;
                gestionProgramacionAcademica.modulos.modulo = item.responseList;
                localStorageService.set('programacionAcademica', gestionProgramacionAcademica.programacionAcademica);
                localStorageService.set('programacionAcademicaAuxiliar', gestionProgramacionAcademica.programacionAcademicaAuxiliar);
                $location.path('/crud-programacion-academica');
            });
        }

        //remover  registros de programación asociada a un horario si esta  no se encuntra  asociado a un grupo
        gestionProgramacionAcademica.onRemoveProgramacion = function (programacion) {
            //Se consulta el index del registro en la lista para proceder a eliminarlo  de la lista de programaciones
            var index = gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle.indexOf(programacion);
            var programacionDelete = {
                programacionAcademica: programacion,
                idUsuarioModificacion: localStorageService.get('autorizacion').objectResponse.userDto.id
            };
            programacionAcademicaServices.descartarProgramacionAcademica(programacionDelete).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    //Se remueve el elemento de la lista luego de haber sido eliminado de la BD
                    gestionProgramacionAcademica.programacionAcademicaAuxiliar.horariosDetalle.splice(index, 1);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_ELIMINADO);
                } else if (data.tipo === appGenericConstant.ERROR) {
                    appConstant.MSG_GROWL_ERROR();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        //exportar datos a un archivo excel para que se pueda gestionar desde cualquier equipo
        gestionProgramacionAcademica.exportData = function (modulo, modalidad, horario) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionProgramacionAcademica.programacionExport = [];
            programacionAcademicaServices.buscarPorProgramacionExport(modulo, modalidad, horario).then(function (datos) {
                angular.forEach(JSON.parse(datos.message), function (exportar, keyExportar) {
                    var listaExport = {
                        indice: keyExportar + 1,
                        horario: exportar.horario,
                        programa: exportar.programa,
                        nivel: exportar.nivel,
                        moduloAsignatura: exportar.moduloAsignatura,
                        docente: exportar.docente,
                        aula: exportar.aula,
                        students: exportar.students,
                        studentsBy1: exportar.studentsBy1,
                        studentsBy2: exportar.studentsBy2,
                        studentsBy3: exportar.studentsBy3,
                        studentsBy4: exportar.studentsBy4
                    };
                    gestionProgramacionAcademica.programacionExport.push(listaExport);
                });
                $timeout(function () {
                    $('#exportarBtn').click();
                }, 1000);
            });
            appConstant.CERRAR_SWAL();
        };

        gestionProgramacionAcademica.exportDataList = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var listado = localStorageService.get('horariosProgramacion');
            gestionProgramacionAcademica.exportData(listado.modalidad.idModulo, listado.modalidad.idModalidad, listado.horario.idHorario);
            appConstant.CERRAR_SWAL();
        };

        gestionProgramacionAcademica.tamanoVentana = function () {
            gestionProgramacionAcademica.width = $(window).width();
            if (gestionProgramacionAcademica.width >= 700 && gestionProgramacionAcademica.width <= 1300) {
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
        $('#fechaProgramacion.input-daterange').datepicker({format: "dd/mm/yyyy", language: "es", autoclose: true,
            clearBtn: true, startDate: new Date("01/01/1900"), endDate: new Date(), beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }});
        //<editor-fold defaultstate="collapsed" desc="Gestión de datos para cargar vistas">
        if (localStorageService.get('programacionAcademica') !== null) {
            gestionProgramacionAcademica.programacionAcademica = localStorageService.get('programacionAcademica');
            if (gestionProgramacionAcademica.programacionAcademica.periodoAcademico !== null) {
                gestionProgramacionAcademica.onBuscarProgramasAcademicos(gestionProgramacionAcademica.programacionAcademica.idNivelFormacion,
                    gestionProgramacionAcademica.programacionAcademica.periodoAcademico,
                    gestionProgramacionAcademica.programacionAcademica.idSeccional);
                gestionProgramacionAcademica.onListarDocentes(gestionProgramacionAcademica.programacionAcademica.idSeccional);
                gestionProgramacionAcademica.onBuscarRecurso(gestionProgramacionAcademica.programacionAcademica.idSeccional);
            }
        }
        if (localStorageService.get('programacionAcademicaAuxiliar') !== null) {
            gestionProgramacionAcademica.programacionAcademicaAuxiliar = localStorageService.get('programacionAcademicaAuxiliar');
        }
        if (localStorageService.get('horariosProgramacion') !== null) {
            var horarioProgramacion = localStorageService.get('horariosProgramacion');
            horarioDetalle(horarioProgramacion.modalidad, horarioProgramacion.horario, horarioProgramacion.id, horarioProgramacion.modulo);
        }
        if (localStorageService.get('modalidades') !== null) {
            var Programacion = localStorageService.get('modalidades');
            gestionProgramacionAcademica.programacionAcademica.modulo = Programacion.moduloCalendario;
            gestionProgramacionAcademica.modalidadesByModulo = Programacion.madalidades;

        }
        if (localStorageService.get('programacionAuxiliar') !== null) {
            gestionProgramacionAcademica.promaca = localStorageService.get('programacionAuxiliar');
            gestionProgramacionAcademica.programaAsignaturasList = [];
            angular.forEach(localStorageService.get('mallamadulo'), function (value, key) {
                var asignaMalla = {
                    id: value.idModulo,
                    nombreAsignatura: value.nombre
                };
                gestionProgramacionAcademica.programaAsignaturasList.push(asignaMalla);
            });
        }

        //</editor-fold>
        ejecutarConsultarNivelFormacion();
        ejecutarConsultarSeccional();
        onBuscarProgramacionAcademica();
        onBuscarPeriodoAcademico();
    }
})();


