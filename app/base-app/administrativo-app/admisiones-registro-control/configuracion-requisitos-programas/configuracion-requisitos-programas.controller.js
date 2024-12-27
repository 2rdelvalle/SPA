(function () {
    'use strict';
    angular.module('mytodoApp').controller('configuracionRequisitosProgramasCtrl', configuracionRequisitosProgramasCtrl);
    configuracionRequisitosProgramasCtrl.$inject = ['$scope', '$location', 'configuracionRequisitosProgramasEntitiesService',  'ValidationService', 'localStorageService', 'appConstant','appGenericConstant'];
    function configuracionRequisitosProgramasCtrl($scope, $location, configuracionRequisitosProgramasEntitiesService, ValidationService, localStorageService, appConstant,appGenericConstant) {
        var configuracionRequisitosProgramasControl = this;
        configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity = configuracionRequisitosProgramasEntitiesService.configuracionRequisitosProgramas;
        configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor = configuracionRequisitosProgramasEntitiesService.configuracionRequisitosProgramasAux;
        configuracionRequisitosProgramasControl.listaNivelesFormacion = [];
        configuracionRequisitosProgramasControl.listaProgramas = [];
        configuracionRequisitosProgramasControl.listaResultado = [];
        configuracionRequisitosProgramasControl.listaRequisitosOpcionales = [];
        configuracionRequisitosProgramasControl.listaRequisitosGenerales = [];
        configuracionRequisitosProgramasControl.listaRequisitos = [];
        configuracionRequisitosProgramasControl.prerequisitosDisp = [];
        configuracionRequisitosProgramasControl.prerequisitosAsi = [];
        var config = {};
        if (localStorageService.get('configuracionRequisitosProgramas') !== null) {
            var configuracionRequisitosProgramas = localStorageService.get('configuracionRequisitosProgramas');
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity = configuracionRequisitosProgramas;
        }
        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor = status;
        }
        configuracionRequisitosProgramasControl.options = appConstant.FILTRO_TABLAS;
        configuracionRequisitosProgramasControl.selectedOption = configuracionRequisitosProgramasControl.options[appGenericConstant.CERO];
        configuracionRequisitosProgramasControl.report = {
            selected: null
        };
        function onConsultarNivelesFormacion() {
            configuracionRequisitosProgramasEntitiesService.listarNivelesFormacion().then(function (data) {
                configuracionRequisitosProgramasControl.listaNivelesFormacion = data;
            });
        }
        function onConsultarProgramasAcademicos() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            configuracionRequisitosProgramasEntitiesService.listarProgramasAcademicos().then(function (data) {
                configuracionRequisitosProgramasControl.listaAuxiliarPrograma = [];
                configuracionRequisitosProgramasControl.lista = [];
                angular.forEach(data, function (value, key) {
                    var programas = {
                        id: value.id,
                        codigoPrograma: value.codigoPrograma,
                        nombrePrograma: value.nombrePrograma,
                        nombreNivelFormacion: value.nombreNivelFormacion,
                        estado: value.estado,
                        nombreModalidad: value.modalidades,
                        nombreHorario: value.horarios
                    };
                    configuracionRequisitosProgramasControl.listaProgramas.push(programas);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function listaModalidades(modalidades) {
            var listaHorario = [];
            angular.forEach(modalidades, function (value, key) {
                listaHorario.push(value.nombreModalidad);
            });
            return splitModalidades(listaHorario);
        }

        function listaHorarios(modalidades) {
            var listaHorario = [];
            angular.forEach(modalidades, function (value, key) {
                listaHorario.push(value.nombreHorario);
            });
            return splitHorario(listaHorario);
        }

        function splitModalidades(listaModalidades) {
            var str = [];
            var fecha = listaModalidades.toString();
            str = fecha.split(",");
            var parts = "";
            angular.forEach(str, function (value, key) {
                parts += value + ", ";
            });
            return parts.substr(appGenericConstant.CERO, parts.length - appGenericConstant.DOS);
        }

        function splitHorario(listaHorario) {
            var str = [];
            var fecha = listaHorario.toString();
            str = fecha.split(",");
            var parts = "";
            angular.forEach(str, function (value, key) {
                parts += value + ", ";
            });
            return parts.substr(appGenericConstant.CERO, parts.length - appGenericConstant.DOS);
        }

        configuracionRequisitosProgramasControl.onConsultar = function (programa) {
            if (new ValidationService().checkFormValidity($scope.formConsultar)) {
                configuracionRequisitosProgramasEntitiesService.buscarConfiguracionRequisitosProgramas(programa).then(function (data) {
                    configuracionRequisitosProgramasControl.listaResultado = data;
                });
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onSearch = true;
                new ValidationService().resetForm($scope.formConsultar);
            }
            else {
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onSearch = false;
            }
        };

        configuracionRequisitosProgramasControl.onLimpiarRegistro = function () {
            localStorageService.remove('configuracionRequisitosProgramas');
            localStorageService.remove('status');
        };

        configuracionRequisitosProgramasControl.onClickToView = function (item) {
            configuracionRequisitosProgramasEntitiesService.buscarConfiguracionRequisitosProgramas(item).then(function (data) {
                configuracionRequisitosProgramasControl.prerequisitoAsi = [];
                angular.forEach(item.requisitosAsignados, function (value, key) {
                    configuracionRequisitosProgramasControl.prerequisitoAsi = {
                        codigo: item.requisitosAsignados[key].codigo,
                        nombre: item.requisitosAsignados[key].nombre,
                        descripcion: item.requisitosAsignados[key].descripcion,
                        obligatorio: item.requisitosAsignados[key].obligatorio,
                        tipoRequisito: item.requisitosAsignados[key].tipoRequisito,
                        estado: item.requisitosAsignados[key].estado,
                        tipoRequisitoNombre: item.requisitosAsignados[key].tipoRequisito.nombre,
                        estadoNombre: item.requisitosAsignados[key].estado.nombre,
                        requisito: item.requisitosAsignados[key].requisito,
                        caracteristica: item.requisitosAsignados[key].caracteristica,
                        id: item.requisitosAsignados[key].id
                    };
                    configuracionRequisitosProgramasControl.prerequisitosAsi.push(configuracionRequisitosProgramasControl.prerequisitoAsi);
                });
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onSearch = false;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onConfigRequisitos = false;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onVerRequisitos = true;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nivelFormacionSelect = null;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.programasSelect = null;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.titulo = appGenericConstant.DETALLE_ASIGNACION_REGISTRO;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onDeshabilitar = true;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.id = data[appGenericConstant.CERO].id;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nivelFormacion = data[appGenericConstant.CERO].nombreNivelFormacion;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.areaConocimiento = data[appGenericConstant.CERO].nombreAreaConocimiento;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.codigo = data[appGenericConstant.CERO].codigoPrograma;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nombrePrograma = data[appGenericConstant.CERO].nombrePrograma;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.registroCalificado = data[appGenericConstant.CERO].registroCalificado;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.codigoSnies = data[appGenericConstant.CERO].codigoSNIES;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.facultad = data[appGenericConstant.CERO].nombreFacultad;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.modalidad = data[appGenericConstant.CERO].idModalidades;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.jornada = data[appGenericConstant.CERO].idHorarios;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.estado = data[appGenericConstant.CERO].estado;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados = data[appGenericConstant.CERO].requisitosAsignados;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosDisponibles = data[appGenericConstant.CERO].requisitosDisponibles;
                localStorageService.set('configuracionRequisitosProgramas', configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity);
                localStorageService.set('status', configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor);
                $location.path('/configuracion-requisitos-programas-gestion');
            });
        };

        configuracionRequisitosProgramasControl.onClickToConfig = function (item) {
            configuracionRequisitosProgramasEntitiesService.buscarConfiguracionRequisitosProgramas(item).then(function (data) {
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onSearch = false;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onConfigRequisitos = true;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onVerRequisitos = false;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nivelFormacionSelect = null;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.programasSelect = null;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.titulo = appGenericConstant.ASIGNAR_REQUISITOS;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor.onDeshabilitar = true;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.id = data[appGenericConstant.CERO].id;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nivelFormacion = data[appGenericConstant.CERO].nombreNivelFormacion;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.areaConocimiento = data[appGenericConstant.CERO].nombreAreaConocimiento;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.codigo = data[appGenericConstant.CERO].codigoPrograma;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.nombrePrograma = data[appGenericConstant.CERO].nombrePrograma;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.registroCalificado = data[appGenericConstant.CERO].registroCalificado;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.codigoSnies = data[appGenericConstant.CERO].codigoSNIES;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.facultad = data[appGenericConstant.CERO].nombreFacultad;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.modalidad = data[appGenericConstant.CERO].idModalidades;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.jornada = data[appGenericConstant.CERO].idHorarios;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.estado = data[appGenericConstant.CERO].estado;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados = data[appGenericConstant.CERO].requisitosAsignados;
                configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosDisponibles = data[appGenericConstant.CERO].requisitosDisponibles;
                localStorageService.set('configuracionRequisitosProgramas', configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity);
                localStorageService.set('status', configuracionRequisitosProgramasControl.configuracionRequisitosProgramasVisor);
                $location.path('/configuracion-requisitos-programas-gestion');
            });
        };
        configuracionRequisitosProgramasControl.onAgregarRequisito = function (item) {
            var index = configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosDisponibles.indexOf(item);
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosDisponibles.splice(index, appGenericConstant.UNO);
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados.push(item);
        };

        configuracionRequisitosProgramasControl.onQuitarRequisito = function (item) {
            var index = configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados.indexOf(item);
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados.splice(index, appGenericConstant.UNO);
            configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosDisponibles.push(item);
        };

        configuracionRequisitosProgramasControl.onSubmitRequisitos = function (lista) {
            var item = localStorageService.get("configuracionRequisitosProgramas");
            var requisitosAsignados = [];
            angular.forEach(configuracionRequisitosProgramasControl.configuracionRequisitosProgramasEntity.requisitosAsignados, function (value, key) {
                requisitosAsignados.push(value.id);
            });
            var updateProgramasAcademicos = {
                idPrograma: item.id,
                requisitosAsignados: requisitosAsignados
            };
            configuracionRequisitosProgramasEntitiesService.actualizarConfiguracionRequisitosProgramas(updateProgramasAcademicos).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.ASIGNAR_REQUISITOS_SATISFACTORIO);
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        onConsultarProgramasAcademicos();
        onConsultarNivelesFormacion();
    }

})();


