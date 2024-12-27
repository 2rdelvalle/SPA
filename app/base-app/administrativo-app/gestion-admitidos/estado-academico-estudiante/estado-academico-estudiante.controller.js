'use strict';
angular.module('mytodoApp').controller('EstadoAcademicoECtrl', ['$scope', 'EstadoAcademicoEService', '$location', 'ValidationService', 'localStorageService', '$timeout', '$http', '$window', 'utilServices', 'appConstant', 'appGenericConstant', 'appConstantValueList',
    function ($scope, EstadoAcademicoEService, $location, ValidationService, localStorageService, $timeout, $http, $window, utilServices, appConstant, appGenericConstant, appConstantValueList) {

        var gestionEstadoAcademico = this;
        var config = {disableCountDown: true, ttl: 5000};
        gestionEstadoAcademico.listaNivelesFormacion = [];
        gestionEstadoAcademico.listaEstados = [];
        gestionEstadoAcademico.listaMallaAcademicas = [];
        gestionEstadoAcademico.listaNivelesProgramas = [];
        gestionEstadoAcademico.listaNumeroNiveles = [];
        gestionEstadoAcademico.listaCantidadMallaAcademicas = [];
        gestionEstadoAcademico.listaModulos = [];
        gestionEstadoAcademico.estadoAcadeEntity = EstadoAcademicoEService.entidad;
        gestionEstadoAcademico.estadoAcadeEntityAuxiliar = EstadoAcademicoEService.entidadAuxiliar;
        gestionEstadoAcademico.estadoAcadeEntity.habilitable = 'SI';
        gestionEstadoAcademico.estadoAcadeEntity.transversal = 'NO';
        gestionEstadoAcademico.estadoAcadeEntity.par = 'NO';
        gestionEstadoAcademico.estadoAcadeEntity.prerequisito = 'NO';
        gestionEstadoAcademico.estadoAcadeEntity.numeroCreditos = 0;
        gestionEstadoAcademico.listaPrograma = [];
        gestionEstadoAcademico.options = appConstant.FILTRO_TABLAS;
        gestionEstadoAcademico.estadoAcadeEntity.detalleMalla = [];
        gestionEstadoAcademico.estadoAcadeEntity.listaDetallesModulos = [];
        gestionEstadoAcademico.estadoAcadeEntity.listaPar = [];
        gestionEstadoAcademico.detalleMallaAcademicaTotal = EstadoAcademicoEService.modulos;

        gestionEstadoAcademico.listaModulosAux = EstadoAcademicoEService.listaAux;
        gestionEstadoAcademico.estadoAcadeEntity.esTransversal = true;
        gestionEstadoAcademico.report = {
            selected: null
        };
        gestionEstadoAcademico.selectedOption = gestionEstadoAcademico.options[0];

        if ($location.path() === '/malla-estudiante') {
            gestionEstadoAcademico.estadoAcadeEntity.programaAcademico = null;
        }
        
        if (localStorageService.get('malla') !== null) {
            var malla = localStorageService.get('malla');
            gestionEstadoAcademico.estadoAcadeEntity = malla;
        }

        if (localStorageService.get('mallaStatus') !== null) {
            var mallaStatus = localStorageService.get('mallaStatus');
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar = mallaStatus;
        }

        if (localStorageService.get('listaCantidadModulos') !== null) {
            var listaCantidadModulos = localStorageService.get('listaCantidadModulos');
            gestionEstadoAcademico.listaCantidadModulos = listaCantidadModulos;
        }

        if (localStorageService.get('listaNivelesProgramas') !== null) {
            var listaNivelesProgramas = localStorageService.get('listaNivelesProgramas');
            gestionEstadoAcademico.listaNivelesProgramas = listaNivelesProgramas;
        }


        gestionEstadoAcademico.onConsultarXNivel = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            EstadoAcademicoEService.consultarProgramas(id).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionEstadoAcademico.estadoAcadeEntity.listaProgramas = data;
              
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };
        gestionEstadoAcademico.onConsultarXNivelPar = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            EstadoAcademicoEService.consultarProgramas(id).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionEstadoAcademico.estadoAcadeEntity.listaProgramasPar = data;

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionEstadoAcademico.onConsultarXNivelVerDetalle = function (id, index) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            EstadoAcademicoEService.consultarProgramas(id).then(function (data) {

                appConstant.CERRAR_SWAL();
                gestionEstadoAcademico.estadoAcadeEntity.listaProgramas = [];
                gestionEstadoAcademico.estadoAcadeEntity.listaProgramas = data;
                gestionEstadoAcademico.estadoAcadeEntity.programaid = data[index].idPrograma;
                $timeout(function () {
                }, 100);
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };
        gestionEstadoAcademico.onConsultarXProgramaPar = function (id) {
            EstadoAcademicoEService.consultarModulosProgrma(id).then(function (data) {
                gestionEstadoAcademico.listaModulosProgramaPar = data;
            }).catch(function (e) {
                return;
            });
        };

        gestionEstadoAcademico.onConsultarXPrograma = function (id) {
            $timeout(function () {
                gestionEstadoAcademico.max = 0;
                gestionEstadoAcademico.estadoAcadeEntity.totalModulos = 0;
                gestionEstadoAcademico.listaNivelesProgramas = [];
                if (gestionEstadoAcademico.estadoAcadeEntityAuxiliar.modalLoading) {
                    appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                    appConstant.CARGANDO();
                }
                EstadoAcademicoEService.consultarNivelesProgramas(id).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        var niveles = {
                            nivel: value.idNivel,
                            maxMallaAcademica: value.cantidadModulos,
                            cantidadModulos: new Array(value.cantidadModulos)
                        };
                        gestionEstadoAcademico.listaNivelesProgramas.push(niveles);
                        gestionEstadoAcademico.estadoAcadeEntity.totalModulos = gestionEstadoAcademico.estadoAcadeEntity.totalModulos + niveles.maxMallaAcademica;
                        if (niveles.maxMallaAcademica > gestionEstadoAcademico.max) {
                            gestionEstadoAcademico.max = niveles.maxMallaAcademica;
                        }
                    });
                    appConstant.CERRAR_SWAL();
                    gestionEstadoAcademico.listaCantidadModulos = new Array(gestionEstadoAcademico.max);
                    
                    localStorageService.set('listaCantidadModulos', gestionEstadoAcademico.listaCantidadModulos);
                    localStorageService.set('listaNivelesProgramas', gestionEstadoAcademico.listaNivelesProgramas);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            });

        };

        function crearMallaAcademica(numeroModulos) {
            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista = [];
            angular.forEach(numeroModulos, function (value, key) {
                var niveles = {
                    nivel: value.idNivel,
                    cantidadModulos: modulos(value.cantidaModulos, (key + 1))
                };
                gestionEstadoAcademico.detalleMallaAcademicaTotal.lista.push(niveles);
            });
        }

        function modulos(cantidadModulos, nivel) {
            gestionEstadoAcademico.estadoAcadeEntity.detalleMallaAcademica = [];
            for (var i = 0; i < cantidadModulos; i++) {
                var niveles = {
                    id: gestionEstadoAcademico.estadoAcadeEntity.idModuloDetalle,
                    idMallaAcademica: gestionEstadoAcademico.estadoAcadeEntity.id,
                    idModulo: gestionEstadoAcademico.estadoAcadeEntity.nombreModulo,
                    nombreModulo: null,
                    numeroNivel: nivel.toString(),
                    numeroModulo: (i + 1).toString(),
                    numeroCreditos: gestionEstadoAcademico.estadoAcadeEntity.numeroCreditos.toString(),
                    habilitable: gestionEstadoAcademico.estadoAcadeEntity.habilitable,
                    prerrequisito: gestionEstadoAcademico.estadoAcadeEntity.prerequisito,
                    par: gestionEstadoAcademico.estadoAcadeEntity.par,
                    idPrerrequisito: gestionEstadoAcademico.estadoAcadeEntity.moduloCorrequisito,
                    listaPar: gestionEstadoAcademico.estadoAcadeEntity.listaPar,
                    codigoModulo: gestionEstadoAcademico.estadoAcadeEntity.codigoModulo
                };
                gestionEstadoAcademico.estadoAcadeEntity.detalleMallaAcademica.push(niveles);
            }
            return gestionEstadoAcademico.estadoAcadeEntity.detalleMallaAcademica;
        }

        gestionEstadoAcademico.onLimpiarRegistro = function () {
            gestionEstadoAcademico.estadoAcadeEntity.id = null;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onDeshabilitar = false;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onOcultar = true;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onDeshabilitarNombre = false;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.estructuraMalla = false;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.modalLoading = false;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onDeshabilitarEditables = false;
            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.titulo = appGenericConstant.AGREGAR_MALLA_ACADEMICA;
            gestionEstadoAcademico.estadoAcadeEntity.codigo = null;
            gestionEstadoAcademico.estadoAcadeEntity.nombre = null;
            gestionEstadoAcademico.estadoAcadeEntity.nivel = null;
            gestionEstadoAcademico.estadoAcadeEntity.programaid = null;
            gestionEstadoAcademico.estadoAcadeEntity.estado = gestionEstadoAcademico.listaEstados[0].valor;
            localStorageService.remove('malla');
            localStorageService.remove('mallaStatus');
            localStorageService.set('mallaStatus', gestionEstadoAcademico.estadoAcadeEntityAuxiliar);

        };

        
       gestionEstadoAcademico.onConsultarProgramas= function(codigo) {
            gestionEstadoAcademico.estadoAcadeEntity.programaAcademico = null;
            EstadoAcademicoEService.consultarProgramas(codigo).then(function (data) {
                gestionEstadoAcademico.listaPrograma = data;
            });
        };

        

        function listaPares(data) {
            gestionEstadoAcademico.listaPares = [];
            angular.forEach(data, function (value, key) {
                gestionEstadoAcademico.inserted = {
                    id: value.id
                    , idDetalleMalla: value.idDetalleMalla
                    , idModuloPar: value.idModuloPar
                    , idProgramaPar: value.idProgramaPar
                    , idNivelPar: value.idNivelPar
                };

                gestionEstadoAcademico.listaPares.push(gestionEstadoAcademico.inserted);
            });
            if (gestionEstadoAcademico.inserted !== undefined) {
                gestionEstadoAcademico.onConsultarXNivelPar(gestionEstadoAcademico.inserted.idNivelPar);
                gestionEstadoAcademico.onConsultarXProgramaPar(gestionEstadoAcademico.inserted.idProgramaPar);
            }
            return gestionEstadoAcademico.listaPares;
        }

        function soloInferior() {
            gestionEstadoAcademico.listaModulosAux.listModulo = [];
            angular.forEach(gestionEstadoAcademico.listaModulos, function (value, key) {
                angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.detalleMalla, function (valor, llave) {
                    if (value.id === valor.idModulo && valor.numeroNivel < gestionEstadoAcademico.estadoAcadeEntity.numeroNivel.toString()) {
                        gestionEstadoAcademico.listaModulosAux.listModulo.push(gestionEstadoAcademico.listaModulos[key]);
                    } else if (value.id === valor.idModulo && valor.numeroNivel === gestionEstadoAcademico.estadoAcadeEntity.numeroNivel.toString()
                            && valor.numeroModulo < gestionEstadoAcademico.estadoAcadeEntity.numeroModulo.toString()) {
                        gestionEstadoAcademico.listaModulosAux.listModulo.push(gestionEstadoAcademico.listaModulos[key]);
                    }
                });
            });
        }

        gestionEstadoAcademico.onGuardarDatosModulo = function () {
            if (gestionEstadoAcademico.estadoAcadeEntity.idModuloDetalle === null || gestionEstadoAcademico.estadoAcadeEntity.idModuloDetalle === undefined) {
                var Modulos = {
                    id: null,
                    idMallaAcademica: gestionEstadoAcademico.estadoAcadeEntity.id,
                    idModulo: gestionEstadoAcademico.estadoAcadeEntity.nombreModulo,
                    numeroNivel: gestionEstadoAcademico.estadoAcadeEntity.numeroNivel.toString(),
                    numeroModulo: gestionEstadoAcademico.estadoAcadeEntity.numeroModulo.toString(),
                    numeroCreditos: gestionEstadoAcademico.estadoAcadeEntity.numeroCreditos.toString(),
                    habilitable: gestionEstadoAcademico.estadoAcadeEntity.habilitable,
                    prerrequisito: gestionEstadoAcademico.estadoAcadeEntity.prerequisito,
                    par: gestionEstadoAcademico.estadoAcadeEntity.par,
                    idPrerrequisito: gestionEstadoAcademico.estadoAcadeEntity.moduloCorrequisito,
                    listaPar: gestionEstadoAcademico.estadoAcadeEntity.listaPar,
                    codigoModulo: gestionEstadoAcademico.estadoAcadeEntity.codigoModulo
                };
            } else {
                var Modulos = {
                    id: gestionEstadoAcademico.estadoAcadeEntity.idModuloDetalle,
                    idMallaAcademica: gestionEstadoAcademico.estadoAcadeEntity.id,
                    idModulo: gestionEstadoAcademico.estadoAcadeEntity.nombreModulo,
                    numeroNivel: gestionEstadoAcademico.estadoAcadeEntity.numeroNivel.toString(),
                    numeroModulo: gestionEstadoAcademico.estadoAcadeEntity.numeroModulo.toString(),
                    numeroCreditos: gestionEstadoAcademico.estadoAcadeEntity.numeroCreditos.toString(),
                    habilitable: gestionEstadoAcademico.estadoAcadeEntity.habilitable,
                    prerrequisito: gestionEstadoAcademico.estadoAcadeEntity.prerequisito,
                    par: gestionEstadoAcademico.estadoAcadeEntity.par,
                    idPrerrequisito: gestionEstadoAcademico.estadoAcadeEntity.moduloCorrequisito,
                    listaPar: gestionEstadoAcademico.estadoAcadeEntity.listaPar,
                    codigoModulo: gestionEstadoAcademico.estadoAcadeEntity.codigoModulo
                };
            }

            var existe = false;
            if (gestionEstadoAcademico.estadoAcadeEntity.detalleMalla !== null && gestionEstadoAcademico.estadoAcadeEntity.detalleMalla !== undefined && gestionEstadoAcademico.estadoAcadeEntity.detalleMalla.length !== 0) {

                var moduloExiste = false;
                angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.detalleMalla, function (value, key) {
                    if (value.idModulo === Modulos.idModulo && (value.numeroModulo !== Modulos.numeroModulo || value.numeroNivel !== Modulos.numeroNivel)) {
                        moduloExiste = true;
                        return;
                    }
                });

                if (!moduloExiste) {
                    angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.detalleMalla, function (value, key) {
                        if (value.numeroNivel === Modulos.numeroNivel && value.numeroModulo === Modulos.numeroModulo) {
                            gestionEstadoAcademico.estadoAcadeEntity.detalleMalla.splice(key, 1);
                            for (var i = 0; i < gestionEstadoAcademico.listaModulosAux.listModulo.length; i++) {
                                if (gestionEstadoAcademico.listaModulosAux.listModulo[i].id === Modulos.idModulo) {
                                    gestionEstadoAcademico.listaModulosAux.listModulo.splice(i, 1);
                                    break;
                                }
                            }
                            ;
                            gestionEstadoAcademico.estadoAcadeEntity.detalleMalla.push(Modulos);
//                            listaPrerrequisito();
                            existe = true;
                            return;
                        }
                    });

                    if (!existe) {
                        gestionEstadoAcademico.estadoAcadeEntity.detalleMalla.push(Modulos);
//                        listaPrerrequisito();
                    }
                    gestionEstadoAcademico.onCerrarModalConfigModal();
                    $("#modalConfigModulo").modal("hide");
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.MODULO_SE_AGREGO_MALLA);
                }
            } else {
                gestionEstadoAcademico.estadoAcadeEntity.detalleMalla.push(Modulos);
                $("#modalConfigModulo").modal("hide");
                gestionEstadoAcademico.onCerrarModalConfigModal();
//                listaPrerrequisito();

            }
        };

        gestionEstadoAcademico.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formMalla)) {
                gestionEstadoAcademico.onNewRegistryMallaAcademica();
                new ValidationService().resetForm($scope.formMalla);
            }
        };
        gestionEstadoAcademico.onVerDetalle = function (item) {
            localStorageService.remove('malla');
            localStorageService.remove('mallaStatus');
//            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onDeshabilitarEditables = true;
//            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.titulo = appGenericConstant.VER_MALLA_ACDEMICA;
//            gestionEstadoAcademico.estadoAcadeEntityAuxiliar.estructuraMalla = false;
            EstadoAcademicoEService.consultaMalla(item).then(function (data) {
                gestionEstadoAcademico.estadoAcadeEntity.codigo = data[0].codigo;
                gestionEstadoAcademico.estadoAcadeEntity.nombre = data[0].nombreMalla;
                gestionEstadoAcademico.estadoAcadeEntity.nivel = data[0].idNivelFormacion;
                gestionEstadoAcademico.estadoAcadeEntity.programaId = data[0].idPorgrama;
                gestionEstadoAcademico.estadoAcadeEntity.programa = data[0].nombrePrograma;
                gestionEstadoAcademico.estadoAcadeEntity.estado = data[0].estadoMalla;
                gestionEstadoAcademico.estadoAcadeEntity.requisitos = ajustarPrequisitos(data[0].requisitos);
                crearMallaAcademica(data[0].nivelModulos);
//                gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onDeshabilitar = true;
//                gestionEstadoAcademico.estadoAcadeEntityAuxiliar.onOcultar = false;
                gestionEstadoAcademico.estadoAcadeEntity.detalleMalla = data[0].detalleMalla;
                llenarDetalle();
//                localStorageService.set('mallaStatus', gestionEstadoAcademico.estadoAcadeEntityAuxiliar);
                localStorageService.set('malla', gestionEstadoAcademico.estadoAcadeEntity);
                gestionEstadoAcademico.listaNivelesProgramas = localStorageService.get('listaNivelesProgramas');
                gestionEstadoAcademico.listaCantidadModulos = localStorageService.get('listaCantidadModulos');
                $location.path('/estado-acedemico-estudiante');
            });

        };

        function llenarDetalle() {
            angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.detalleMalla, function (value, llave) {
                angular.forEach(gestionEstadoAcademico.detalleMallaAcademicaTotal.lista, function (valor, key) {
                    for (var i = 0; i < valor.cantidadModulos.length; i++) {

                        if (valor.cantidadModulos[i].numeroNivel === value.numeroNivel
                                && valor.cantidadModulos[i].numeroModulo === value.numeroModulo) {

                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].id = value.idModuloDetalle;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idMallaAcademica = value.id;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idModulo = value.idModulo.toString() === null ? '0' : value.idModulo.toString();
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].nombreModulo = value.nombreModulo === null ? 'Modulo' + value.numeroModulo.toString() : value.nombreModulo;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroNivel = value.numeroNivel;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroModulo = value.numeroModulo.toString();
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroCreditos = value.numeroCreditos.toString() === null ? '0' : value.numeroCreditos.toString();
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].habilitable = value.habilitable;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].prerrequisito = value.prerequisito;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].par = value.par;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idPrerrequisito = value.idPrerrequisito;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].listaPar = value.listaPar;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].codigoModulo = value.codigoModulo;
                            gestionEstadoAcademico.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].style = estadoMatricula(value.estadoMatricula);

                            i = valor.cantidadModulos.length;


                        }


                    }
                });

            });

        }

        function estado(transversal) {
            var style;
            switch (transversal) {
                case "SI":
                    return style = 'TV';

                    break;
                case "NO":
                    return style = 'ST';
                    break;
                default:

                    break;
            }

        }
        function estadoMatricula(estado) {
            var style;
            switch (estado) {
                case "APROBADO":
                    return style = 'AP';

                    break;
                case "HOMOLOGADO":
                    return style = 'HM';
                    break;
                case "REPROBADO":
                    return style = 'RP';
                    break;
                default:
                    return style = 'SC';
                    break;
            }
        }

        function ajustarPrequisitos(listaPrerequistos) {
            if (listaPrerequistos !== null) {
                return listaPrerequistos.split(',');
            } else {
                return null;
            }
        }




        /*
         * Prueba de codetalle de la malla
         */

        /*Array Asociativo en el que se indica para cada materia cuales materias se deben tomar despues*/

//        var PREREQUISITOS = {
//            '10010': ['10011'], '10011': ['10012'], '10012': ['10013'], '10013': ['10014'], '10015': ['10016'], '10021': ['10022'], '10022': ['10023'], '10024': ['10025'], '10026': ['10027'], '10029': ['10030']
//        };

//Array Asociativo en el que se indican los correquisitos de una materia
        var CORREQUISITOS = {'CB0260': ['CB0246'],
            'ST0243': ['ST0244'],
            'CB0236': ['CB0231'],
            'ST0250': ['ST0251'],
            'ST0258': ['ST0263']
        };
//duración del retrazo entre animaciones
        var TIME_OUT_ANIM = 300;

//Booleano que indica si la flechas ya se añadieron
        var FLECHAS_INICIALIZADAS = false;

        gestionEstadoAcademico.select = function () {
////        $(document).ready(function () {
            $('.materia').on('click', function () {
                //alert('materia');
                var idMat = $(this).attr('id');
                $(this).addClass('selected');

                //alert('hace el llamado'+idMat);
                seleccionarAdelante(idMat);

//                seleccionarCorreq(idMat);

                seleccionaPrevios(idMat);
            });

            $('.materia').on('mouseout', function () {
                //alert('materia');
                //var corr = $(this).attr('corr');

                //alert(corr);
                //alert('borre');
                limpiarSeleccion();
            });


//        });
        };

        //Botón que alterna las flechas
        $('#toggleArrowBtn').on('click', function () {
            //Si ya se añadieron las flechas
            if (FLECHAS_INICIALIZADAS) {
                //las oculta
                $('svg').toggle();
            } else {
                //Las añade dinámicamente
                conectarMaterias();
                FLECHAS_INICIALIZADAS = true;
            }

        });

        /*Función que selecciona las materias hacía adelante*/
        function seleccionarAdelante(idMateria) {
            //alert('adelante'+idMateria);
            var idCorrAct;
            angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.requisitos, function (valor, key) {

                var prerequisito = [];

                prerequisito = valor.split(':');
                var str1 = prerequisito[0];
                prerequisito[1] = prerequisito[1].replace('[', '');
                var str2 = prerequisito[1] = prerequisito[1].replace(']', '');
                if (str1 === idMateria) {
                    $('#' + str2).addClass('prerequisito');
                    idCorrAct = str2;
                } else if (str1 === idCorrAct) {
                    $('#' + str2).addClass('prerequisito');
                    idCorrAct = str2;

                }
//                  var corrAct = gestionEstadoAcademico.estadoAcadeEntity.requisitos[idMateria];

                //alert('corrAct'+corrAct);
                //Marca los correquisitos
//            if (corrAct) {
//                for (var i = 0; i < corrAct.length; i++) {
//                    var idCorrAct = corrAct[i];
//                    //alert('iterando'+idCorrAct);
//
//                    //alert('adelante: '+idCorrAct);
//                    $('#' + idCorrAct).addClass('prerequisito');
//
//
//                    //Se invoca recursivamente si existen prerrequisitos del prerequisito
//                    if (gestionEstadoAcademico.estadoAcadeEntity.requisitos[idCorrAct]) {
//                        /*setTimeout( function(){*/seleccionarAdelante(idCorrAct);//}, TIME_OUT_ANIM );
//                        //seleccionarAdelante( idCorrAct );
//                    }
//
//                    //REtorna para quebrar el ciclo y el llamado recursivo
//                    //return;
//                }
//            }
//            return;
//                       
            });

        }

        /*Función que marca los correquisitos*/
        function seleccionarCorreq(idMateria) {
            //Marca los prerequisitos
            var preAct = CORREQUISITOS[idMateria];

            //alert('preAct:'+preAct);
            if (preAct) {
                //Marca los correquisitos
                for (var i = 0; i < preAct.length; i++) {
                    var idPreAct = preAct[i];
                    //alert('iterando'+idCorrAct);
                    $('#' + idPreAct).toggleClass('correquisito');
                }
            }
        }

        /*Función que marca las materias hacia atrás*/
        function seleccionaPrevios(idMateria) {
            // alert(idSel);
            //  
            angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.requisitos, function (valor, key) {

                var prerequisito = [];

                prerequisito = valor.split(':');
                var str1 = prerequisito[0];
                prerequisito[1] = prerequisito[1].replace('[', '');
                var str2 = prerequisito[1] = prerequisito[1].replace(']', '');

                if (str2 === idMateria) {
                    $('#' + str1).addClass('previo');

                    //seleccionaPrevios( keyAct )
                    /*setTimeout( function(){*/seleccionaPrevios(str1);/*}, TIME_OUT_ANIM );*/

                    //
                    //break;
                }
//                       
            });
            //Itera sobre la lista de prerequisitos
//            for (var keyAct in gestionEstadoAcademico.estadoAcadeEntity.requisitos) {
//                var rel = gestionEstadoAcademico.estadoAcadeEntity.requisitos[keyAct];
//
//                //alert('rel: '+rel);
//
//                var valAct;
//                for (var j = 0; j < rel.length; j++) {
//                    valAct = rel[j];
//                    if (valAct === idMateria) {
//                        $('#' + keyAct).addClass('previo');
//
//                        //seleccionaPrevios( keyAct )
//                        /*setTimeout( function(){*/seleccionaPrevios(keyAct);/*}, TIME_OUT_ANIM );*/
//
//                        //
//                        //break;
//                    }
//                    //alert(valAct);
//                }
//            }
        }

        /*Métdo que limpia las selecciones*/
        function limpiarSeleccion() {
            $('.contenedor .correquisito').removeClass('correquisito');
            $('.contenedor .prerequisito').removeClass('prerequisito');
            $('.contenedor .previo').removeClass('previo');
            $('.contenedor .selected').removeClass('selected');
        }

//Métodos de jsPlumb
//jsPlumb.bind("ready", conectarMaterias);

        function conectarMaterias() {

            var color_prueba = "#002846";
            var common = {
                /*paintStyle:{ fillStyle:example3Color, opacity:0.5 },*/
                connector: "StateMachine",
                anchors: ["Center", "Center"],
                endpoints: ["Dot", "Blank"],
                endpointStyle: {radius: 2},
                overlays: [["PlainArrow", {location: 1, width: 10, length: 9}]],
                /*connectorStyle:{ strokeStyle:'green', lineWidth:4 },*/
                paintStyle: {lineWidth: 3, strokeStyle: color_prueba}
            };
            // your jsPlumb related init code goes here

            //Estilo de las flechas de correquisitos
            var commcorr = {
                /*connector:"StateMachine",*/
                anchors: ["Center", "Center"],
                endpoints: ["Blank", "Blank"],
                endpointStyle: {radius: 2},
                /*overlays:[ ["PlainArrow", {location:1, width:10, length:9} ]],*/
                paintStyle: {
                    lineWidth: 2,
                    strokeStyle: "rgb(131,8,135)",
                    dashstyle: "2 2"
                            /*joinstyle:"miter"*/
                }
            };

//            var array = listaPrerequistos.split(',');
            angular.forEach(gestionEstadoAcademico.estadoAcadeEntity.requisitos, function (valor, key) {

                var prerequisito = [];

                prerequisito = valor.split(':');
                var str1 = prerequisito[0];
                prerequisito[1] = prerequisito[1].replace('[', '');
                var str2 = prerequisito[1] = prerequisito[1].replace(']', '');

                jsPlumb.connect({source: str1, target: str2}, common);
//                       
            });
            //alert('inicializo');
//            for (var keyAct in PREREQUISITOS) {
//                var rel = PREREQUISITOS[keyAct];
//                var valAct;
//                for (var j = 0; j < rel.length; j++) {
//                    valAct = rel[j];
//                    //alert('conecte '+ keyAct+ ' '+valAct);
//                    jsPlumb.connect({source: keyAct, target: valAct}, common);
//                }
//            }
            /*
             jsPlumb.connect({source:"CB0230", target:"CB0231",},common);
             jsPlumb.connect({source:"CB0260", target:"CB0236"},common);
             jsPlumb.connect({source:"ST0242", target:"ST0245"},common);
             jsPlumb.connect({source:"ST0242", target:"ST0244"},common);
             
             jsPlumb.connect({source:"CB0231", target:"CB0232"},common);
             jsPlumb.connect({source:"CB0236", target:"CB0239"},common);  
             jsPlumb.connect({source:"CB0246", target:"ST0270"},common);
             jsPlumb.connect({source:"ST0245", target:"ST0247"},common);
             jsPlumb.connect({source:"ST0245", target:"ST0246"},common);
             jsPlumb.connect({source:"ST0244", target:"ST0246"},common);
             //Semestre 3
             jsPlumb.connect({source:"ST0246", target:"ST0250"},common);
             jsPlumb.connect({source:"ST0248", target:"ST0249"},common);
             
             jsPlumb.connect({source:"CB0232", target:"EC0255"},common);
             jsPlumb.connect({source:"OG0205", target:"ST0253"},common);
             jsPlumb.connect({source:"ST0251", target:"ST0252"},common);*/

            //Correquisitos
            //var corrAct = PREREQUISITOS[idMateria];

            //Marca los correquisitos
//            for (var corrAct in CORREQUISITOS) {
//                var idCorrAct = CORREQUISITOS[corrAct];
//
//                //alert('conecte: '+corrAct+' '+idCorrAct);
//                jsPlumb.connect({source: corrAct + '', target: idCorrAct + ''}, commcorr);
//            }
            /*jsPlumb.connect({source:"CB0260", target:"CB0246"},commcorr);
             jsPlumb.connect({source:"ST0243", target:"ST0244"},commcorr);
             jsPlumb.connect({source:"CB0236", target:"CB0231"},commcorr);
             jsPlumb.connect({source:"ST0250", target:"ST0251"},commcorr);*/
        }


    }]);





