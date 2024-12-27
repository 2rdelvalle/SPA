(function () {
    'use strict';
    angular.module('mytodoApp').controller('programasAcademicosCtrl', programasAcademicosCtrl);
    programasAcademicosCtrl.$inject = ['$scope', 'appConstant', 'appGenericConstant', '$location', 'programasAcademicosEntitiesServices', 'ValidationService', 'localStorageService', 'utilServices', '$interval', 'appConstantValueList'];
    function programasAcademicosCtrl($scope, appConstant, appGenericConstant, $location, programasAcademicosEntitiesServices, ValidationService, localStorageService, utilServices, $interval, appConstantValueList) {
        var programasAcademicosControl = this;
        programasAcademicosControl.programasAcademicosEntity = programasAcademicosEntitiesServices.programasAcademicos;
        programasAcademicosControl.programasAcademicosVisor = programasAcademicosEntitiesServices.programasAcademicosAux;
        programasAcademicosControl.visible = programasAcademicosEntitiesServices.visible;
        programasAcademicosControl.visible.validaHorario = false;
        programasAcademicosControl.visible.validaModalidad = false;
        programasAcademicosControl.programasAcademicosEntity.inscripcion = 'NO';
        programasAcademicosControl.lista = [];
        programasAcademicosControl.listaNivelFormacion = [];
        programasAcademicosControl.listaFacultades = [];
        programasAcademicosControl.listaAreaConocimiento = [];
        programasAcademicosControl.listaEstados = [];
        programasAcademicosControl.listaUniversidades = [];
        programasAcademicosControl.listaModalidades = [];
        programasAcademicosControl.listaHorario = [];
        programasAcademicosControl.listaReconocimiento = [];
        programasAcademicosControl.horarios = [];
        programasAcademicosControl.listaHorarioTodos = [];
        programasAcademicosControl.counter = appGenericConstant.CERO;
        var maximoNivel;
        if (localStorageService.get('programasAcademicos') !== null) {
            var programasAcademicos = localStorageService.get('programasAcademicos');
            programasAcademicosControl.programasAcademicosEntity = programasAcademicos;
        }
        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            programasAcademicosControl.programasAcademicosVisor = status;
            programasAcademicosControl.programasAcademicosVisor.active = appGenericConstant.CERO;
        }
        programasAcademicosControl.options = appConstant.FILTRO_TABLAS;
        programasAcademicosControl.selectedOption = programasAcademicosControl.options[appGenericConstant.CERO];
        programasAcademicosControl.report = {selected: null};
        function onComprobarDatosPestana() {
            $("#tabs").tabs({
                active: appGenericConstant.DOS
            });
        }
        function onConsultarMaximoNivel() {
            programasAcademicosEntitiesServices.buscarMaximoNivel().then(function (valor) {
                programasAcademicosControl.listaUniversidades = valor;
                maximoNivel = valor[appGenericConstant.CERO].maxNivel;
                $("#duracion.spinner-input").TouchSpin({
                    verticalbuttons: true,
                    min: appGenericConstant.CERO,
                    max: maximoNivel
                });
                $("#vigencia.spinner-input").TouchSpin({
                    verticalbuttons: true,
                    min: appGenericConstant.CERO,
                    max: 9999
                });
                $("#creditos.spinner-input").TouchSpin({
                    verticalbuttons: true,
                    min: appGenericConstant.CERO,
                    max: 999
                });
                $("#maximoAlumnosAdmitidos.spinner-input").TouchSpin({
                    verticalbuttons: true,
                    min: appGenericConstant.CERO,
                    max: 999
                });
            });
        }
        function onConsultarProgramas() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            programasAcademicosControl.counter = appGenericConstant.CERO;
            programasAcademicosEntitiesServices.buscarProgramasAcademicos().then(function (data) {
                programasAcademicosControl.listaAuxiliarPrograma = [];
                programasAcademicosControl.lista = [];
                angular.forEach(data, function (value, key) {
                    var programas = {
                        id: value.id,
                        codigoPrograma: value.codigoPrograma,
                        nombrePrograma: value.nombrePrograma,
                        nombreNivelFormacion: value.nombreNivelFormacion,
                        estado: value.estado,
                        nombreModalidad: value.modalidades,
                        sede: numberToString(value.sede),
                        tipoPrograma: value.tipoPrograma
                    };
                    programasAcademicosControl.lista.push(programas);
                });
                appConstant.CERRAR_SWAL();
            });
        }

      function numberToString(num) {
        switch (num) {
          case "1":
            return "CARTAGENA";
            break;
          case "2":
            return "MEDELLIN";
            break;
          default:
            return "NO SEDE";
        }
      }

        var refreshTabla = function counter() {
            programasAcademicosControl.counter = programasAcademicosControl.counter + 1;
            if (programasAcademicosControl.counter === 10) {
                programasAcademicosEntitiesServices.buscarProgramasAcademicos().then(function (data) {
                    programasAcademicosControl.lista = [];
                    angular.forEach(data, function (value, key) {
                        var programas = {
                            id: value.id,
                            codigoPrograma: value.codigoPrograma,
                            nombrePrograma: value.nombrePrograma,
                            nombreNivelFormacion: value.nombreNivelFormacion,
                            estado: value.estado,
                            nombreModalidad: value.modalidades,
                            idUniversidad: value.idUniversidad,
                            tipoPrograma: value.tipoPrograma
                        };
                        programasAcademicosControl.lista.push(programas);
                    });
                    programasAcademicosControl.counter = appGenericConstant.CERO;
                });
            }
        };
        // //
        programasAcademicosControl.cancelarInterval = function () {
            //
        };
        function idJorna(modalidades) {
            var listamodalidades = [];
            angular.forEach(modalidades, function (value, key) {
                listamodalidades.push(value.id);
            });
            return listamodalidades;
        }
        function idHorario(horarios) {
            var listaHorarios = [];
            angular.forEach(horarios, function (value, key) {
                listaHorarios.push(value.idHorario);
            });
            return listaHorarios;
        }

        function onConsultarNivelFormacion() {
            programasAcademicosEntitiesServices.cargarListaNivelFormacion().then(function (data) {
                programasAcademicosControl.listaNivelFormacion = data;
            });
        }

        function onConsultarFacultades() {
            programasAcademicosEntitiesServices.cargarListaFacultades().then(function (data) {
                programasAcademicosControl.listaFacultades = data;
            });
        }

        function onConsultarAreaConocimiento() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_CONOCIMIENTO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaAreaConocimiento = data;
            });
        }

        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaEstados = data;
            });
        }

        function onConsultarListaModalidades() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaModalidades = data;
                if (programasAcademicosControl.programasAcademicosEntity.modalidad !== null && typeof programasAcademicosControl.programasAcademicosEntity.modalidad !== 'undefined'
                        && programasAcademicosControl.programasAcademicosEntity.modalidad.length !== appGenericConstant.CERO
                        ) {
                    for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                        for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaModalidades.length; e++) {
                            if (programasAcademicosControl.programasAcademicosEntity.modalidad[i].codigo === programasAcademicosControl.listaModalidades[e].codigo) {
                                var index = programasAcademicosControl.listaModalidades.indexOf(programasAcademicosControl.listaModalidades[e]);
                                programasAcademicosControl.listaModalidades.splice(index, 1);
                            }
                        }
                    }
                }
            });
        }
        function onConsultarListaHorario() {
          var sedeHorario  = null;
          if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 1){
            sedeHorario = appConstantValueList.LV_HORARIO
          }
          if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 2){
            sedeHorario = "HORARIO_MEDELLIN"
          }
            utilServices.buscarListaValorByCategoria(sedeHorario, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaHorarioTodos = [];
                programasAcademicosControl.listaHorarioTodos = data;
                programasAcademicosControl.listaHorario = [];
                if (programasAcademicosControl.programasAcademicosEntity.modalidad !== null && typeof programasAcademicosControl.programasAcademicosEntity.modalidad !== 'undefined'
                        && programasAcademicosControl.programasAcademicosEntity.modalidad.length !== appGenericConstant.CERO
                        ) {
                    for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                        for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                            if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].referencia)) {
                                programasAcademicosControl.listaHorario.push(programasAcademicosControl.listaHorarioTodos[e]);
                            }
                        }
                    }
                }
            });
        }

        function onConsultarListaReconocimiento() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_RECONOCIMIENTO_MEN, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaReconocimiento = data;
            });
        }
        programasAcademicosControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarPrograma)) {
                programasAcademicosControl.onNewRegistryProgramasAcademicos();
                new ValidationService().resetForm($scope.formAgregarPrograma);
                new ValidationService().resetForm($scope.formAgregarConfiguracion);
            } else {
                ModalidadHora();
                if ($scope.formAgregarPrograma.formNivel.$invalid) {
                    programasAcademicosControl.programasAcademicosVisor.active = appGenericConstant.DOS;
                } else {
                    programasAcademicosControl.programasAcademicosVisor.active = appGenericConstant.CERO;
                }
            }
        };
        programasAcademicosControl.onLimpiarRegistro = function () {
            programasAcademicosControl.programasAcademicosVisor.onDeshabilitar = false;
            programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCodigos = false;
            programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoEstado = true;
            programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoUniversidad = false;
            programasAcademicosControl.programasAcademicosVisor.onDeshabilitarValidacion = ' ';
            programasAcademicosControl.programasAcademicosVisor.titulo = appGenericConstant.AGREGAR_PROGRAGA_ACADEMICO;
            programasAcademicosControl.programasAcademicosEntity.id = null;
            programasAcademicosControl.programasAcademicosEntity.nivelFormacion = null;
            programasAcademicosControl.programasAcademicosEntity.areaConocimiento = null;
            programasAcademicosControl.programasAcademicosEntity.codigo = '';
            programasAcademicosControl.programasAcademicosEntity.nombrePrograma = '';
            programasAcademicosControl.programasAcademicosEntity.registroCalificado = null;
            programasAcademicosControl.programasAcademicosEntity.estado = null;
            programasAcademicosControl.programasAcademicosEntity.idUniversidad = null;
            programasAcademicosControl.programasAcademicosEntity.codigoSnies = '';
            programasAcademicosControl.programasAcademicosEntity.facultad = null;
            programasAcademicosControl.programasAcademicosEntity.modalidad = [];
            programasAcademicosControl.programasAcademicosEntity.horario = null;
            programasAcademicosControl.programasAcademicosEntity.fechaResolucion = null;
            programasAcademicosControl.programasAcademicosEntity.vigencia = null;
            programasAcademicosControl.programasAcademicosEntity.titulo = '';
            programasAcademicosControl.programasAcademicosEntity.duracion = null;
            programasAcademicosControl.programasAcademicosEntity.reconocimiento = null;
            programasAcademicosControl.programasAcademicosEntity.creditos = null;
            programasAcademicosControl.programasAcademicosEntity.horarios = null;
            programasAcademicosControl.programasAcademicosEntity.maximoAlumnosAdmitidos = null;
            programasAcademicosControl.programasAcademicosEntity.inscripcion = 'NO';
            programasAcademicosControl.programasAcademicosEntity.listaNiveles = [];
            localStorageService.remove('programasAcademicos');
            localStorageService.remove('status');
            localStorageService.set('status', programasAcademicosControl.programasAcademicosVisor);
        };
        function ModalidadHora() {
            if (typeof programasAcademicosControl.programasAcademicosEntity.modalidad === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.modalidad === null ||
                    programasAcademicosControl.programasAcademicosEntity.modalidad.length === appGenericConstant.CERO) {
                programasAcademicosControl.visible.validaModalidad = true;
            }

            if (typeof programasAcademicosControl.programasAcademicosEntity.horarios === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.horarios === null ||
                    programasAcademicosControl.programasAcademicosEntity.horarios.length === appGenericConstant.CERO) {
                programasAcademicosControl.visible.validaHorario = true;
                return;
            }
        }
        programasAcademicosControl.onNewRegistryProgramasAcademicos = function () {
            if (programasAcademicosControl.programasAcademicosEntity.id === null || programasAcademicosControl.programasAcademicosEntity.id === undefined) {
                var newProgramasAcademicos =
                        {
                            id: null,
                            idNivelFormacion: programasAcademicosControl.programasAcademicosEntity.nivelFormacion,
                            idAreaConocimiento: programasAcademicosControl.programasAcademicosEntity.areaConocimiento,
                            codigoPrograma: appConstant.VALIDAR_STRING(programasAcademicosControl.programasAcademicosEntity.codigo),
                            nombrePrograma: appConstant.VALIDAR_STRING(programasAcademicosControl.programasAcademicosEntity.nombrePrograma),
                            registroCalificado: programasAcademicosControl.programasAcademicosEntity.registroCalificado,
                            estado: 'ACTIVO',
                            idUniversidad: programasAcademicosControl.programasAcademicosEntity.idUniversidad,
                            codigoSNIES: programasAcademicosControl.programasAcademicosEntity.codigoSnies,
                            idFacultad: programasAcademicosControl.programasAcademicosEntity.facultad,
                            idModalidades: programasAcademicosControl.programasAcademicosEntity.modalidad,
                            idHorarios: programasAcademicosControl.programasAcademicosEntity.horarios,
                            fechaResolucion: toDate(programasAcademicosControl.programasAcademicosEntity.fechaResolucion),
                            vigenciaPrograma: programasAcademicosControl.programasAcademicosEntity.vigencia,
                            tituloPrograma: appConstant.VALIDAR_STRING(programasAcademicosControl.programasAcademicosEntity.titulo),
                            periodicidadPrograma: {
                                duracion: programasAcademicosControl.programasAcademicosEntity.duracion,
                                idLVTipoPeriodicidad: 69
                            },
                            idReconocimiento: programasAcademicosControl.programasAcademicosEntity.reconocimiento,
                            numeroCreditoPrograma: programasAcademicosControl.programasAcademicosEntity.creditos,
                            maximoAdmitido: programasAcademicosControl.programasAcademicosEntity.maximoAlumnosAdmitidos,
                            inscripcion: programasAcademicosControl.programasAcademicosEntity.inscripcion,
                            nivel: programasAcademicosControl.programasAcademicosEntity.listaNiveles,
                            nombreCongreso: programasAcademicosControl.programasAcademicosEntity.nombreCongreso,
                            tipoPrograma: programasAcademicosControl.programasAcademicosEntity.tipoPrograma
                        };
                if (typeof newProgramasAcademicos.idHorarios !== "undefined" &&
                        typeof newProgramasAcademicos.idHorarios !== null &&
                        newProgramasAcademicos.idHorarios.length !== appGenericConstant.CERO) {
                    programasAcademicosEntitiesServices.agregarProgramasAcademicos(newProgramasAcademicos).then(function (response) {
                        switch (response.tipo) {
                            case 200:
                                appConstant.MSG_GROWL_OK(response.message);
                                programasAcademicosControl.onLimpiarRegistro();
                                break;
                            case 409:
                                appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                                break;
                            case 500:
                                appConstant.MSG_GROWL_ERROR();
                                break;
                        }

                    });
                }
                ModalidadHora();
            } else {
                var updateProgramasAcademicos =
                        {
                            id: programasAcademicosControl.programasAcademicosEntity.id,
                            idNivelFormacion: programasAcademicosControl.programasAcademicosEntity.nivelFormacion,
                            idAreaConocimiento: programasAcademicosControl.programasAcademicosEntity.areaConocimiento,
                            codigoPrograma: programasAcademicosControl.programasAcademicosEntity.codigo,
                            nombrePrograma: appConstant.VALIDAR_STRING(programasAcademicosControl.programasAcademicosEntity.nombrePrograma),
                            registroCalificado: programasAcademicosControl.programasAcademicosEntity.registroCalificado,
                            estado: programasAcademicosControl.programasAcademicosEntity.estado,
                            idUniversidad: programasAcademicosControl.programasAcademicosEntity.idUniversidad,
                            codigoSNIES: programasAcademicosControl.programasAcademicosEntity.codigoSnies,
                            idFacultad: programasAcademicosControl.programasAcademicosEntity.facultad,
                            idModalidades: programasAcademicosControl.programasAcademicosEntity.modalidad,
                            idHorarios: programasAcademicosControl.programasAcademicosEntity.horarios,
                            fechaResolucion: toDate(programasAcademicosControl.programasAcademicosEntity.fechaResolucion),
                            vigenciaPrograma: programasAcademicosControl.programasAcademicosEntity.vigencia,
                            tituloPrograma: appConstant.VALIDAR_STRING(programasAcademicosControl.programasAcademicosEntity.titulo),
                            periodicidadPrograma: {
                                duracion: programasAcademicosControl.programasAcademicosEntity.duracion,
                                idLVTipoPeriodicidad: 69
                            },
                            idReconocimiento: programasAcademicosControl.programasAcademicosEntity.reconocimiento,
                            numeroCreditoPrograma: programasAcademicosControl.programasAcademicosEntity.creditos,
                            maximoAdmitido: programasAcademicosControl.programasAcademicosEntity.maximoAlumnosAdmitidos,
                            inscripcion: programasAcademicosControl.programasAcademicosEntity.inscripcion,
                            nivel: programasAcademicosControl.programasAcademicosEntity.listaNiveles,
                            nombreCongreso: programasAcademicosControl.programasAcademicosEntity.nombreCongreso,
                            tipoPrograma: programasAcademicosControl.programasAcademicosEntity.tipoPrograma
                        };
                if (typeof updateProgramasAcademicos.idHorarios !== "undefined" &&
                        updateProgramasAcademicos.idHorarios !== null &&
                        updateProgramasAcademicos.idHorarios.length !== appGenericConstant.CERO) {
                    programasAcademicosEntitiesServices.actualizarProgramasAcademicos(updateProgramasAcademicos).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                            localStorageService.set('programasAcademicos', programasAcademicosControl.programasAcademicosEntity);
                        } else if (data.tipo === 500) {
                            appConstant.MSG_GROWL_ERROR();
                        } else {

                        }
                    });
                }
                ModalidadHora();
            }

        };
        programasAcademicosControl.onClickToView = function (programa) {
            programasAcademicosEntitiesServices.consultarPorgramaById(programa).then(function (item) {
                programasAcademicosControl.programasAcademicosVisor.titulo = appGenericConstant.VER_PROGRAMA_ACADEMICO;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitar = true;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCodigos = true;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoEstado = false;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoUniversidad = false;
                programasAcademicosControl.programasAcademicosEntity.nivelFormacion = item.idNivelFormacion;
                programasAcademicosControl.programasAcademicosEntity.areaConocimiento = item.idAreaConocimiento;
                programasAcademicosControl.programasAcademicosEntity.codigo = item.codigoPrograma;
                programasAcademicosControl.programasAcademicosEntity.nombrePrograma = item.nombrePrograma;
                programasAcademicosControl.programasAcademicosEntity.registroCalificado = item.registroCalificado;
                programasAcademicosControl.programasAcademicosEntity.estado = item.estado;
                programasAcademicosControl.programasAcademicosEntity.idUniversidad = item.idUniversidad;
                programasAcademicosControl.programasAcademicosEntity.codigoSnies = item.codigoSNIES;
                programasAcademicosControl.programasAcademicosEntity.facultad = item.idFacultad;
                programasAcademicosControl.programasAcademicosEntity.modalidad = idJorna(item.idModalidades);
                programasAcademicosControl.programasAcademicosEntity.horarios = idHorario(item.idHorarios);
                programasAcademicosControl.programasAcademicosEntity.fechaResolucion = onDate(item.fechaResolucion);
                programasAcademicosControl.programasAcademicosEntity.vigencia = item.vigenciaPrograma;
                programasAcademicosControl.programasAcademicosEntity.titulo = appConstant.VALIDAR_STRING(item.titulo);
                programasAcademicosControl.programasAcademicosEntity.duracion = item.periodicidadPrograma.duracion;
                programasAcademicosControl.programasAcademicosEntity.reconocimiento = item.idReconocimiento;
                programasAcademicosControl.programasAcademicosEntity.creditos = item.numeroCreditoPrograma;
                programasAcademicosControl.programasAcademicosEntity.maximoAlumnosAdmitidos = item.maximoAdmitido;
                programasAcademicosControl.programasAcademicosEntity.inscripcion = item.inscripcion;
                programasAcademicosControl.programasAcademicosEntity.listaNiveles = item.nivel;
                programasAcademicosControl.programasAcademicosEntity.nombreCongreso = item.nombreCongreso;
                programasAcademicosControl.programasAcademicosEntity.tipoPrograma = item.tipoPrograma;
                localStorageService.set('programasAcademicos', programasAcademicosControl.programasAcademicosEntity);
                localStorageService.set('status', programasAcademicosControl.programasAcademicosVisor);
                $location.path('/programas-academicos-gestion');
            });
        };
        programasAcademicosControl.onClickToEditar = function (programa) {
            programasAcademicosEntitiesServices.consultarPorgramaById(programa).then(function (item) {
                programasAcademicosControl.programasAcademicosVisor.titulo = appGenericConstant.MODIFICAR_PROGRAMA_ACADEMICO;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitar = false;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCodigos = true;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoEstado = false;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarCampoUniversidad = false;
                programasAcademicosControl.programasAcademicosVisor.onDeshabilitarValidacion = 'required';
                programasAcademicosControl.programasAcademicosEntity.id = item.id;
                programasAcademicosControl.programasAcademicosEntity.nivelFormacion = item.idNivelFormacion;
                programasAcademicosControl.programasAcademicosEntity.areaConocimiento = item.idAreaConocimiento;
                programasAcademicosControl.programasAcademicosEntity.codigo = item.codigoPrograma;
                programasAcademicosControl.programasAcademicosEntity.nombrePrograma = item.nombrePrograma;
                programasAcademicosControl.programasAcademicosEntity.registroCalificado = item.registroCalificado;
                programasAcademicosControl.programasAcademicosEntity.estado = item.estado;
                programasAcademicosControl.programasAcademicosEntity.idUniversidad = item.idUniversidad;
                programasAcademicosControl.programasAcademicosEntity.codigoSnies = item.codigoSNIES;
                programasAcademicosControl.programasAcademicosEntity.facultad = item.idFacultad;
                programasAcademicosControl.programasAcademicosEntity.modalidad = idJorna(item.idModalidades);
                programasAcademicosControl.programasAcademicosEntity.horarios = idHorario(item.idHorarios);
                programasAcademicosControl.programasAcademicosEntity.fechaResolucion = onDate(item.fechaResolucion);
                programasAcademicosControl.programasAcademicosEntity.vigencia = item.vigenciaPrograma;
                programasAcademicosControl.programasAcademicosEntity.titulo = appConstant.VALIDAR_STRING(item.titulo);
                programasAcademicosControl.programasAcademicosEntity.duracion = item.periodicidadPrograma.duracion;
                programasAcademicosControl.programasAcademicosEntity.reconocimiento = item.idReconocimiento;
                programasAcademicosControl.programasAcademicosEntity.creditos = item.numeroCreditoPrograma;
                programasAcademicosControl.programasAcademicosEntity.maximoAlumnosAdmitidos = item.maximoAdmitido;
                programasAcademicosControl.programasAcademicosEntity.inscripcion = item.inscripcion;
                programasAcademicosControl.programasAcademicosEntity.listaNiveles = item.nivel;
                programasAcademicosControl.programasAcademicosEntity.nombreCongreso = item.nombreCongreso;
                programasAcademicosControl.programasAcademicosEntity.tipoPrograma = item.tipoPrograma;
                programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                localStorageService.set('programasAcademicos', programasAcademicosControl.programasAcademicosEntity);
                localStorageService.set('status', programasAcademicosControl.programasAcademicosVisor);
                $location.path('/programas-academicos-gestion');
            });
        };
        programasAcademicosControl.onClickToDelete = function (item) {
            programasAcademicosControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PROGRAMA_ACADEMICO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                programasAcademicosEntitiesServices.eliminarProgramasAcademicos(item.id).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.PROGRAMA_ACADEMICO_ELIMINADO,
                                    appGenericConstant.PROGRAMA_ACADEMICO_ELIMINADO_SATIS,
                                    appGenericConstant.SUCCESS);
                            onConsultarProgramas();
                            break;
                        case 500:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                                    'error');
                            break;
                        case 409:
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.PROGRAMA_NO_ELIMINAR,
                                    appGenericConstant.WARNING);
                            break;
                        default:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.PROGRAMA_ACADEMICO_NO_ELIMINAR,
                                    appGenericConstant.WARNING);
                            break;
                    }
                    programasAcademicosControl.report.selected.length = null;
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    programasAcademicosControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        programasAcademicosControl.onClickToDeleteMasivo = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.PRG_ELIMINAR_PROGRAMAS,
                text: appGenericConstant.PROGRAMA_ACADEMICO_ELIMINADO_SATIS,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                angular.forEach(programasAcademicosControl.report.selected, function (value, key) {
                    listaElementosEliminar.push(value.id);
                });
                programasAcademicosEntitiesServices.eliminarProgramasAcademicosMasivo(listaElementosEliminar).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.PROGRAMA_ACADEMICOS_ELIMINADOS,
                                    appGenericConstant.PROGRMA_ACADEMICO_ELIMINADOS_SATIS,
                                    appGenericConstant.SUCCESS);
                            break;
                        case 500:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                                    'error');
                            break;
                        default:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ALGUNOS_PROGRAMAS,
                                    appGenericConstant.WARNING);
                            break;
                    }
                    programasAcademicosControl.report.selected.length = null;
                    onConsultarProgramas();
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    programasAcademicosControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        programasAcademicosControl.CreaLista = function () {
            if (typeof programasAcademicosControl.programasAcademicosEntity.listaNiveles === 'undefined' ||
                    programasAcademicosControl.programasAcademicosEntity.listaNiveles.length === appGenericConstant.CERO) {
                programasAcademicosControl.programasAcademicosEntity.listaNiveles = [];
                for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.duracion; i++) {
                    var listaNivel = {
                        id: null,
                        idNivel: (i + 1),
                        cantidadModulos: appGenericConstant.CERO,
                        idPrograma: programasAcademicosControl.programasAcademicosEntity.id,
                        estado: 'ACTIVO'
                    };
                    programasAcademicosControl.programasAcademicosEntity.listaNiveles.push(listaNivel);
                }
            } else {

                var listaAuxiliar = programasAcademicosControl.programasAcademicosEntity.listaNiveles;
                programasAcademicosControl.programasAcademicosEntity.listaNiveles = [];
                for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.duracion; i++) {
                    if (programasAcademicosControl.programasAcademicosEntity.listaNiveles.length >= listaAuxiliar.length) {
                        var listaNivel = {
                            id: null,
                            idNivel: (programasAcademicosControl.programasAcademicosEntity.listaNiveles[i - 1].idNivel) + 1,
                            cantidadModulos: appGenericConstant.CERO,
                            idPrograma: programasAcademicosControl.programasAcademicosEntity.id,
                            estado: 'ACTIVO'
                        };
                        programasAcademicosControl.programasAcademicosEntity.listaNiveles.push(listaNivel);
                    } else {

                        listaNivel = {
                            id: listaAuxiliar[i].id,
                            idNivel: listaAuxiliar[i].idNivel,
                            cantidadModulos: listaAuxiliar[i].cantidadModulos,
                            idPrograma: programasAcademicosControl.programasAcademicosEntity.id,
                            estado: 'ACTIVO'
                        };
                        programasAcademicosControl.programasAcademicosEntity.listaNiveles.push(listaNivel);
                    }
                }
            }
        };
        programasAcademicosControl.mostrarCampo = function (item) {
            $("#inputHid" + item.idNivel).prop("disabled", false);
            $('#inputHid' + item.idNivel).focus();
            $("#btnComd" + item.idNivel).hide();
            $("#btnCheck" + item.idNivel).show();
            item.cantidadModulos = $("#inputHid" + item.cantidadModulos).val();
            item.cantidadModulos = item.cantidadModulos === appGenericConstant.CERO ? "" : item.cantidadModulos;
            $("#inputHid" + item.cantidadModulos).val(item.cantidadModulos);
        };
        programasAcademicosControl.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };
        programasAcademicosControl.focusCampo = function (item) {
            $('#inputHid' + item.idNivel).focus(function () {
            });
            $('#inputHid' + item.idNivel).blur(function () {
                $("#inputHid" + item.idNivel).prop("disabled", true);
                $("#btnComd" + item.idNivel).show();
                $("#btnCheck" + item.idNivel).hide();
                if (item.cantidadModulos === "" || item.cantidadModulos === null || typeof item.cantidadModulos === 'undefined') {
                    $("#inputHid" + item.idNivel).val(appGenericConstant.CERO);
                }
            });
        };
        $(document).ready(function () {
            programasAcademicosControl.disabledInput = false;
            programasAcademicosControl.totalArqueoEfectivo = appGenericConstant.CERO;
        });
        programasAcademicosControl.scrits = function () {
            $('.input-group.date').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                todayBtn: "linked",
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                }
            });
            $("#tabs").tabs();
            $(function () {
                "use strict";
                $('.input-switch').bootstrapSwitch();
            });
        };
        onConsultarMaximoNivel();
        onConsultarProgramas();
        onConsultarNivelFormacion();
        onConsultarFacultades();
        onConsultarAreaConocimiento();
        onConsultarListaEstados();
        onConsultarListaModalidades();
        onConsultarListaHorario();
        onConsultarListaReconocimiento();
        programasAcademicosControl.onChangeHorario = function () {

          var sedeHorario  = null;
          if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 1){
            sedeHorario = appConstantValueList.LV_HORARIO
          }
          if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 2){
            sedeHorario = "HORARIO_MEDELLIN"
          }
            programasAcademicosControl.visible.validaHorario = false;
            utilServices.getListaValorByCategoriaSede(sedeHorario, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaHorarioTodos = [];
                programasAcademicosControl.listaHorarioTodos = data;
                programasAcademicosControl.listaHorario = [];
                for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                    for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                        if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].referencia)) {
                            programasAcademicosControl.listaHorario.push(programasAcademicosControl.listaHorarioTodos[e]);
                        }
                    }
                }
            });
            if (typeof programasAcademicosControl.programasAcademicosEntity.horarios === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.horarios.length === appGenericConstant.CERO) {

                programasAcademicosControl.programasAcademicosEntity.horarios = null;
                programasAcademicosControl.programasAcademicosEntity.modalidad = null;
            } else if (programasAcademicosControl.programasAcademicosEntity.horarios.length !== appGenericConstant.CERO) {
                var horas = [];
                var comprobarHoras = [];
                utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                    programasAcademicosControl.listaModalidades = data;
                    for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.horarios.length; i++) {
                        for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                            if (programasAcademicosControl.programasAcademicosEntity.horarios[i] === programasAcademicosControl.listaHorarioTodos[e].codigo) {
                                horas.push(programasAcademicosControl.listaHorarioTodos[e]);
                            }
                        }
                    }
                    for (var e = appGenericConstant.CERO; e < horas.length; e++) {
                        for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {

                            if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(horas[e].referencia)) {
                                if (!comprobarHoras.includes(parseInt(horas[e].referencia))) {
                                    comprobarHoras.push(parseInt(horas[e].referencia));
                                }

                            }
                        }
                    }
                    programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                    programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.indice - 1;
                    programasAcademicosControl.programasAcademicosEntity.modalidad = null;
                    programasAcademicosControl.programasAcademicosEntity.modalidad = comprobarHoras;
                });
            }

            if (typeof programasAcademicosControl.programasAcademicosEntity.horarios === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.horarios.length === appGenericConstant.CERO) {
                programasAcademicosControl.visible.validaHorario = true;
                return;
            }

        };

      function onConsultarListaHorarioSede() {
        var sedeHorario  = null;
        if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 1){
          sedeHorario = appConstantValueList.LV_HORARIO
        }
        if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 2){
          sedeHorario = "HORARIO_MEDELLIN"
        }
        utilServices.getListaValorByCategoriaSede(sedeHorario, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
          programasAcademicosControl.listaHorarioTodos = [];
          programasAcademicosControl.listaHorarioTodos = data;
          programasAcademicosControl.listaHorario = [];
          if (programasAcademicosControl.programasAcademicosEntity.modalidad !== null && typeof programasAcademicosControl.programasAcademicosEntity.modalidad !== 'undefined'
            && programasAcademicosControl.programasAcademicosEntity.modalidad.length !== appGenericConstant.CERO
          ) {
            for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
              for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].referencia)) {
                  programasAcademicosControl.listaHorario.push(programasAcademicosControl.listaHorarioTodos[e]);
                }
              }
            }
          }
        });
      }

        programasAcademicosControl.onChangeModalidad = function () {
          onConsultarListaHorarioSede();
            programasAcademicosControl.visible.validaModalidad = false;
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                programasAcademicosControl.listaModalidades = data;
                for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                    for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaModalidades.length; e++) {
                        if (programasAcademicosControl.programasAcademicosEntity.modalidad[i].codigo === programasAcademicosControl.listaModalidades[e].codigo) {
                            var index = programasAcademicosControl.listaModalidades.indexOf(programasAcademicosControl.listaModalidades[e]);
                            programasAcademicosControl.listaModalidades.splice(index, 1);
                        }
                    }
                }
            });
            if (typeof programasAcademicosControl.programasAcademicosEntity.modalidad === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.modalidad.length === appGenericConstant.CERO) {

                programasAcademicosControl.programasAcademicosEntity.horarios = null;
            } else if (programasAcademicosControl.programasAcademicosEntity.modalidad.length !== appGenericConstant.CERO) {
                var comparaHorarios = [];
              var sedeHorario  = null;
              if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 1){
                sedeHorario = appConstantValueList.LV_HORARIO
              }
              if(programasAcademicosControl.programasAcademicosEntity.idUniversidad === 2){
                sedeHorario = "HORARIO_MEDELLIN"
              }
                utilServices.getListaValorByCategoriaSede(sedeHorario, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                    programasAcademicosControl.listaHorarioTodos = [];
                    if (typeof programasAcademicosControl.programasAcademicosEntity.horarios === 'undefined' || programasAcademicosControl.programasAcademicosEntity.horarios === null) {
                        programasAcademicosControl.listaHorarioTodos = data;
                        programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                        for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                            for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                                if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].referencia)) {
                                    comparaHorarios.push(programasAcademicosControl.listaHorarioTodos[e]);
                                }
                            }
                        }
                        programasAcademicosControl.programasAcademicosEntity.horarios = [];
                        for (var i = appGenericConstant.CERO; i < comparaHorarios.length; i++) {
                            programasAcademicosControl.programasAcademicosEntity.horarios.push(comparaHorarios[i].codigo);
                        }

                    } else {
                        programasAcademicosControl.listaHorarioTodos = data;
                        var guia = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                        if (guia > programasAcademicosControl.programasAcademicosEntity.indice) {
                            programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                            for (var i = guia - 1; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                                for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                                    if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].referencia)) {
                                        comparaHorarios.push(programasAcademicosControl.listaHorarioTodos[e]);
                                    }
                                }
                            }
                            //                    programasAcademicosControl.programasAcademicosEntity.horarios = [];
                            for (var i = appGenericConstant.CERO; i < comparaHorarios.length; i++) {
                                programasAcademicosControl.programasAcademicosEntity.horarios.push(comparaHorarios[i].codigo);
                            }
                        } else {
                            programasAcademicosControl.programasAcademicosEntity.indice = programasAcademicosControl.programasAcademicosEntity.modalidad.length;
                            var idhoras = [];
                            for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.horarios.length; i++) {
                                for (var e = appGenericConstant.CERO; e < programasAcademicosControl.listaHorarioTodos.length; e++) {
                                    if (programasAcademicosControl.programasAcademicosEntity.horarios[i] === parseInt(programasAcademicosControl.listaHorarioTodos[e].codigo)) {
                                        idhoras.push(programasAcademicosControl.listaHorarioTodos[e]);
                                    }
                                }
                            }
                            for (var i = appGenericConstant.CERO; i < programasAcademicosControl.programasAcademicosEntity.modalidad.length; i++) {
                                for (var e = appGenericConstant.CERO; e < idhoras.length; e++) {
                                    if (programasAcademicosControl.programasAcademicosEntity.modalidad[i] === parseInt(idhoras[e].referencia)) {
                                        comparaHorarios.push(idhoras[e]);
                                    }
                                }
                            }
                            programasAcademicosControl.programasAcademicosEntity.horarios = [];
                            for (var i = appGenericConstant.CERO; i < comparaHorarios.length; i++) {
                                programasAcademicosControl.programasAcademicosEntity.horarios.push(comparaHorarios[i].codigo);
                            }
                        }
                    }
                });
            }
            if (typeof programasAcademicosControl.programasAcademicosEntity.modalidad === "undefined" ||
                    programasAcademicosControl.programasAcademicosEntity.modalidad.length === appGenericConstant.CERO) {
                programasAcademicosControl.visible.validaModalidad = true;
                return;
            }

        };
    }
    function toDate(dateStr) {
        if (typeof dateStr === 'undefined' || dateStr === null) {
            dateStr = null;
            return dateStr;
        } else {
            var parts = [];
            if (dateStr.match('/')) {
                parts = dateStr.split('/');
            } else {
                parts = dateStr.split('-');
            }
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    }
    function onDate(date) {
        if (typeof date === 'undefined' || date === null) {
            date = null;
            return date;
        } else {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
    }
})();

