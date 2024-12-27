'use strict';
angular.module('mytodoApp').controller('MallaEstudianteCodigoCtrl', ['$scope', 'mallaEstudianteService', 'pazSalvoAcademicoService', '$location', 'ValidationService', 'localStorageService', '$timeout', '$http', '$window', 'liquidarMatriculaService', 'appConstant', 'appGenericConstant', 'appConstantValueList',
    function ($scope, mallaEstudianteService, pazSalvoAcademicoService, $location, ValidationService, localStorageService, $timeout, $http, $window, liquidarMatriculaService, appConstant, appGenericConstant, appConstantValueList) {

        var gestionMalla = this;
        var config = { disableCountDown: true, ttl: 5000 };
        gestionMalla.listaNivelesFormacion = [];
        gestionMalla.listaEstados = [];
        gestionMalla.listaMallaAcademicas = [];
        gestionMalla.listaNivelesProgramas = [];
        gestionMalla.listaNumeroNiveles = [];
        gestionMalla.listaCantidadMallaAcademicas = [];
        gestionMalla.listaModulos = [];
        gestionMalla.mallaEntity = mallaEstudianteService.entidad;
        gestionMalla.mallaEntityAuxiliar = mallaEstudianteService.entidadAuxiliar;
        gestionMalla.mallaEntity.habilitable = 'SI';
        gestionMalla.mallaEntity.transversal = 'NO';
        gestionMalla.mallaEntity.par = 'NO';
        gestionMalla.mallaEntity.prerequisito = 'NO';
        gestionMalla.mallaEntity.numeroCreditos = 0;
        gestionMalla.listaPrograma = [];
        gestionMalla.options = appConstant.FILTRO_TABLAS;
        gestionMalla.mallaEntity.detalleMalla = [];
        gestionMalla.mallaEntity.listaDetallesModulos = [];
        gestionMalla.mallaEntity.listaPar = [];
        gestionMalla.detalleMallaAcademicaTotal = mallaEstudianteService.modulos;
        gestionMalla.codigoEstudiante = "";
        gestionMalla.estudiante = {};

        gestionMalla.listaModulosAux = mallaEstudianteService.listaAux;
        gestionMalla.mallaEntity.esTransversal = true;
        gestionMalla.report = {
            selected: null
        };
        gestionMalla.selectedOption = gestionMalla.options[0];

        if ($location.path() === '/malla-estudiante') {
            gestionMalla.mallaEntity.programaAcademico = null;
        }

        if (localStorageService.get('malla') !== null) {
            var malla = localStorageService.get('malla');
            gestionMalla.mallaEntity = malla;
        }

        if (localStorageService.get('mallaStatus') !== null) {
            var mallaStatus = localStorageService.get('mallaStatus');
            gestionMalla.mallaEntityAuxiliar = mallaStatus;
        }

        if (localStorageService.get('listaCantidadModulos') !== null) {
            var listaCantidadModulos = localStorageService.get('listaCantidadModulos');
            gestionMalla.listaCantidadModulos = listaCantidadModulos;
        }

        if (localStorageService.get('listaNivelesProgramas') !== null) {
            var listaNivelesProgramas = localStorageService.get('listaNivelesProgramas');
            gestionMalla.listaNivelesProgramas = listaNivelesProgramas;
        }

        gestionMalla.onConsultarXNivel = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            mallaEstudianteService.consultarProgramas(id).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionMalla.mallaEntity.listaProgramas = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionMalla.onConsultarXNivelPar = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            mallaEstudianteService.consultarProgramas(id).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionMalla.mallaEntity.listaProgramasPar = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionMalla.onConsultarXNivelVerDetalle = function (id, index) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            mallaEstudianteService.consultarProgramas(id).then(function (data) {
                appConstant.CERRAR_SWAL();
                gestionMalla.mallaEntity.listaProgramas = [];
                gestionMalla.mallaEntity.listaProgramas = data;
                gestionMalla.mallaEntity.programaid = data[index].idPrograma;
                $timeout(function () { }, 100);
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionMalla.onConsultarXProgramaPar = function (id) {
            mallaEstudianteService.consultarModulosProgrma(id).then(function (data) {
                gestionMalla.listaModulosProgramaPar = data;
            }).catch(function (e) {
                return;
            });
        };

        gestionMalla.onConsultarXPrograma = function (id) {
            $timeout(function () {
                gestionMalla.max = 0;
                gestionMalla.mallaEntity.totalModulos = 0;
                gestionMalla.listaNivelesProgramas = [];
                if (gestionMalla.mallaEntityAuxiliar.modalLoading) {
                    appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                    appConstant.CARGANDO();
                }
                mallaEstudianteService.consultarNivelesProgramas(id).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        var niveles = {
                            nivel: value.idNivel,
                            maxMallaAcademica: value.cantidadModulos,
                            cantidadModulos: new Array(value.cantidadModulos)
                        };
                        gestionMalla.listaNivelesProgramas.push(niveles);
                        gestionMalla.mallaEntity.totalModulos = gestionMalla.mallaEntity.totalModulos + niveles.maxMallaAcademica;
                        if (niveles.maxMallaAcademica > gestionMalla.max) {
                            gestionMalla.max = niveles.maxMallaAcademica;
                        }
                    });
                    appConstant.CERRAR_SWAL();
                    gestionMalla.listaCantidadModulos = new Array(gestionMalla.max);

                    localStorageService.set('listaCantidadModulos', gestionMalla.listaCantidadModulos);
                    localStorageService.set('listaNivelesProgramas', gestionMalla.listaNivelesProgramas);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            });
        };

        function crearMallaAcademica(numeroModulos) {
            gestionMalla.detalleMallaAcademicaTotal.lista = [];
            angular.forEach(numeroModulos, function (value, key) {
                var niveles = {
                    nivel: value.idNivel,
                    cantidadModulos: modulos(value.cantidaModulos, (key + 1))
                };
                gestionMalla.detalleMallaAcademicaTotal.lista.push(niveles);
            });
        }

        function modulos(cantidadModulos, nivel) {
            gestionMalla.mallaEntity.detalleMallaAcademica = [];
            for (var i = 0; i < cantidadModulos; i++) {
                var niveles = {
                    id: gestionMalla.mallaEntity.idModuloDetalle,
                    idMallaAcademica: gestionMalla.mallaEntity.id,
                    idModulo: gestionMalla.mallaEntity.nombreModulo,
                    nombreModulo: null,
                    numeroNivel: nivel.toString(),
                    numeroModulo: (i + 1).toString(),
                    numeroCreditos: gestionMalla.mallaEntity.numeroCreditos.toString(),
                    habilitable: gestionMalla.mallaEntity.habilitable,
                    prerrequisito: gestionMalla.mallaEntity.prerequisito,
                    par: gestionMalla.mallaEntity.par,
                    idPrerrequisito: gestionMalla.mallaEntity.moduloCorrequisito,
                    listaPar: gestionMalla.mallaEntity.listaPar,
                    codigoModulo: gestionMalla.mallaEntity.codigoModulo
                };
                gestionMalla.mallaEntity.detalleMallaAcademica.push(niveles);
            }
            return gestionMalla.mallaEntity.detalleMallaAcademica;
        }

        gestionMalla.onLimpiarRegistro = function () {
            gestionMalla.mallaEntity.id = null;
            gestionMalla.mallaEntityAuxiliar.onDeshabilitar = false;
            gestionMalla.mallaEntityAuxiliar.onOcultar = true;
            gestionMalla.mallaEntityAuxiliar.onDeshabilitarNombre = false;
            gestionMalla.mallaEntityAuxiliar.estructuraMalla = false;
            gestionMalla.mallaEntityAuxiliar.modalLoading = false;
            gestionMalla.mallaEntityAuxiliar.onDeshabilitarEditables = false;
            gestionMalla.mallaEntityAuxiliar.titulo = appGenericConstant.AGREGAR_MALLA_ACADEMICA;
            gestionMalla.mallaEntity.codigo = null;
            gestionMalla.mallaEntity.nombre = null;
            gestionMalla.mallaEntity.nivel = null;
            gestionMalla.mallaEntity.programaid = null;
            gestionMalla.mallaEntity.estado = gestionMalla.listaEstados[0].valor;
            localStorageService.remove('malla');
            localStorageService.remove('mallaStatus');
            localStorageService.set('mallaStatus', gestionMalla.mallaEntityAuxiliar);
        };

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            gestionMalla.usuario = usuario;
        }

        function init() {
            if (localStorageService.get('usuario') !== null) {
                var usuario = localStorageService.get('usuario');
                gestionMalla.usuario = usuario;
            }
            gestionMalla.onConsultarProgramas(gestionMalla.usuario.identificacion);
        }

        gestionMalla.onConsultarProgramas = function (codigo) {

            liquidarMatriculaService.consultarEstudianteAll(codigo, 'MallEstCod').then(function (data) {

                if (data === "") {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA("No existe un estudiante con el código ingresado.");
                    liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                } else {

                    if (data.liquidacionesPendiente !== undefined && data.liquidacionesPendiente !== null && data.liquidacionesPendiente !== "") {
                        appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad.");
                        return;
                    }

                    if (data.estadoMatriculaActual !== "" && data.estadoMatriculaActual !== undefined && data.estadoMatriculaActual !== null) {
                        var json = JSON.parse(data.estadoMatriculaActual)
                        if (json.estadoLiquidacion !== "PAGADA") {
                            appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                            return;
                        }
                    } else {
                        appConstant.MSG_LOADING("Estudiante presenta deudas con la entidad. (No ha pagado Matricula)");
                        return;
                    }

                    gestionMalla.mallaEntity.programaAcademico = null;
                    mallaEstudianteService.consultarProgramas(codigo).then(function (data) {
                        gestionMalla.listaPrograma = data;
                    });

                    pazSalvoAcademicoService.buscarEstudianteByCodigo(codigo).then(function (data) {
                        gestionMalla.estudiante.identificacion = data[0].identificacion;
                        gestionMalla.estudiante.nombre = data[0].nombreEstudiante + ' ' + data[0].apellidoEstudiante;
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });

                    // angular.forEach(data.estudiantePrograma, function (value, key) {
                    //     liquidarMatriculaControl.listaProgramas.push(value)
                    // });
                    appConstant.CERRAR_SWAL();
                }

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };



        function listaPares(data) {
            gestionMalla.listaPares = [];
            angular.forEach(data, function (value, key) {
                gestionMalla.inserted = {
                    id: value.id
                    , idDetalleMalla: value.idDetalleMalla
                    , idModuloPar: value.idModuloPar
                    , idProgramaPar: value.idProgramaPar
                    , idNivelPar: value.idNivelPar
                };

                gestionMalla.listaPares.push(gestionMalla.inserted);
            });
            if (gestionMalla.inserted !== undefined) {
                gestionMalla.onConsultarXNivelPar(gestionMalla.inserted.idNivelPar);
                gestionMalla.onConsultarXProgramaPar(gestionMalla.inserted.idProgramaPar);
            }
            return gestionMalla.listaPares;
        }

        function soloInferior() {
            gestionMalla.listaModulosAux.listModulo = [];
            angular.forEach(gestionMalla.listaModulos, function (value, key) {
                angular.forEach(gestionMalla.mallaEntity.detalleMalla, function (valor, llave) {
                    if (value.id === valor.idModulo && valor.numeroNivel < gestionMalla.mallaEntity.numeroNivel.toString()) {
                        gestionMalla.listaModulosAux.listModulo.push(gestionMalla.listaModulos[key]);
                    } else if (value.id === valor.idModulo && valor.numeroNivel === gestionMalla.mallaEntity.numeroNivel.toString()
                        && valor.numeroModulo < gestionMalla.mallaEntity.numeroModulo.toString()) {
                        gestionMalla.listaModulosAux.listModulo.push(gestionMalla.listaModulos[key]);
                    }
                });
            });
        }

        gestionMalla.onGuardarDatosModulo = function () {
            if (gestionMalla.mallaEntity.idModuloDetalle === null || gestionMalla.mallaEntity.idModuloDetalle === undefined) {
                var Modulos = {
                    id: null,
                    idMallaAcademica: gestionMalla.mallaEntity.id,
                    idModulo: gestionMalla.mallaEntity.nombreModulo,
                    numeroNivel: gestionMalla.mallaEntity.numeroNivel.toString(),
                    numeroModulo: gestionMalla.mallaEntity.numeroModulo.toString(),
                    numeroCreditos: gestionMalla.mallaEntity.numeroCreditos.toString(),
                    habilitable: gestionMalla.mallaEntity.habilitable,
                    prerrequisito: gestionMalla.mallaEntity.prerequisito,
                    par: gestionMalla.mallaEntity.par,
                    idPrerrequisito: gestionMalla.mallaEntity.moduloCorrequisito,
                    listaPar: gestionMalla.mallaEntity.listaPar,
                    codigoModulo: gestionMalla.mallaEntity.codigoModulo
                };
            } else {
                var Modulos = {
                    id: gestionMalla.mallaEntity.idModuloDetalle,
                    idMallaAcademica: gestionMalla.mallaEntity.id,
                    idModulo: gestionMalla.mallaEntity.nombreModulo,
                    numeroNivel: gestionMalla.mallaEntity.numeroNivel.toString(),
                    numeroModulo: gestionMalla.mallaEntity.numeroModulo.toString(),
                    numeroCreditos: gestionMalla.mallaEntity.numeroCreditos.toString(),
                    habilitable: gestionMalla.mallaEntity.habilitable,
                    prerrequisito: gestionMalla.mallaEntity.prerequisito,
                    par: gestionMalla.mallaEntity.par,
                    idPrerrequisito: gestionMalla.mallaEntity.moduloCorrequisito,
                    listaPar: gestionMalla.mallaEntity.listaPar,
                    codigoModulo: gestionMalla.mallaEntity.codigoModulo
                };
            }

            var existe = false;
            if (gestionMalla.mallaEntity.detalleMalla !== null && gestionMalla.mallaEntity.detalleMalla !== undefined && gestionMalla.mallaEntity.detalleMalla.length !== 0) {
                var moduloExiste = false;
                angular.forEach(gestionMalla.mallaEntity.detalleMalla, function (value, key) {
                    if (value.idModulo === Modulos.idModulo && (value.numeroModulo !== Modulos.numeroModulo || value.numeroNivel !== Modulos.numeroNivel)) {
                        moduloExiste = true;
                        return;
                    }
                });

                if (!moduloExiste) {
                    angular.forEach(gestionMalla.mallaEntity.detalleMalla, function (value, key) {
                        if (value.numeroNivel === Modulos.numeroNivel && value.numeroModulo === Modulos.numeroModulo) {
                            gestionMalla.mallaEntity.detalleMalla.splice(key, 1);
                            for (var i = 0; i < gestionMalla.listaModulosAux.listModulo.length; i++) {
                                if (gestionMalla.listaModulosAux.listModulo[i].id === Modulos.idModulo) {
                                    gestionMalla.listaModulosAux.listModulo.splice(i, 1);
                                    break;
                                }
                            }
                            gestionMalla.mallaEntity.detalleMalla.push(Modulos);
                            //                            listaPrerrequisito();
                            existe = true;
                            return;
                        }
                    });

                    if (!existe) {
                        gestionMalla.mallaEntity.detalleMalla.push(Modulos);
                        //                        listaPrerrequisito();
                    }
                    gestionMalla.onCerrarModalConfigModal();
                    $("#modalConfigModulo").modal("hide");
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.MODULO_SE_AGREGO_MALLA);
                }
            } else {
                gestionMalla.mallaEntity.detalleMalla.push(Modulos);
                $("#modalConfigModulo").modal("hide");
                gestionMalla.onCerrarModalConfigModal();
                //                listaPrerrequisito();
            }
        };

        gestionMalla.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formMalla)) {
                gestionMalla.onNewRegistryMallaAcademica();
                new ValidationService().resetForm($scope.formMalla);
            }
        };

        gestionMalla.onVerDetalle = function (item) {
            localStorageService.remove('malla');
            localStorageService.remove('mallaStatus');
            //            gestionMalla.mallaEntityAuxiliar.onDeshabilitarEditables = true;
            //            gestionMalla.mallaEntityAuxiliar.titulo = appGenericConstant.VER_MALLA_ACDEMICA;
            //            gestionMalla.mallaEntityAuxiliar.estructuraMalla = false;
            mallaEstudianteService.consultaMallaProgramaEstudiante(item, gestionMalla.usuario.identificacion).then(function (data) {
                gestionMalla.mallaEntity.codigo = data[0].codigo;
                gestionMalla.mallaEntity.nombre = data[0].nombreMalla;
                gestionMalla.mallaEntity.nivel = data[0].idNivelFormacion;
                gestionMalla.mallaEntity.programaId = data[0].idPorgrama;
                gestionMalla.mallaEntity.programa = data[0].nombrePrograma;
                gestionMalla.mallaEntity.estado = data[0].estadoMalla;
                gestionMalla.mallaEntity.requisitos = ajustarPrequisitos(data[0].requisitos);
                crearMallaAcademica(data[0].nivelModulos);
                //                gestionMalla.mallaEntityAuxiliar.onDeshabilitar = true;
                //                gestionMalla.mallaEntityAuxiliar.onOcultar = false;
                gestionMalla.mallaEntity.detalleMalla = data[0].detalleMalla;
                llenarDetalle();
                //                localStorageService.set('mallaStatus', gestionMalla.mallaEntityAuxiliar);
                localStorageService.set('malla', gestionMalla.mallaEntity);
                gestionMalla.listaNivelesProgramas = localStorageService.get('listaNivelesProgramas');
                gestionMalla.listaCantidadModulos = localStorageService.get('listaCantidadModulos');
                $location.path('/malla-estudiante');
            });
        };

        function llenarDetalle() {
            angular.forEach(gestionMalla.mallaEntity.detalleMalla, function (value, llave) {
                angular.forEach(gestionMalla.detalleMallaAcademicaTotal.lista, function (valor, key) {
                    for (var i = 0; i < valor.cantidadModulos.length; i++) {
                        if (valor.cantidadModulos[i].numeroNivel === value.numeroNivel
                            && valor.cantidadModulos[i].numeroModulo === value.numeroModulo) {

                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].id = value.idModuloDetalle;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idMallaAcademica = value.id;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idModulo = value.idModulo.toString() === null ? '0' : value.idModulo.toString();
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].nombreModulo = value.nombreModulo === null ? 'Modulo' + value.numeroModulo.toString() : value.nombreModulo;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroNivel = value.numeroNivel;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroModulo = value.numeroModulo.toString();
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].numeroCreditos = value.numeroCreditos.toString() === null ? '0' : value.numeroCreditos.toString();
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].habilitable = value.habilitable;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].prerrequisito = value.prerequisito;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].par = value.par;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].idPrerrequisito = value.idPrerrequisito;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].listaPar = value.listaPar;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].codigoModulo = value.codigoModulo;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].notaModulo = value.notaModulo;
                            gestionMalla.detalleMallaAcademicaTotal.lista[key].cantidadModulos[i].style = estadoMatricula(value.estadoMatricula);

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
                case "MATRICULADO":
                    return style = 'PD';
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
        var CORREQUISITOS = {
            'CB0260': ['CB0246'],
            'ST0243': ['ST0244'],
            'CB0236': ['CB0231'],
            'ST0250': ['ST0251'],
            'ST0258': ['ST0263']
        };
        //duración del retrazo entre animaciones
        var TIME_OUT_ANIM = 300;

        //Booleano que indica si la flechas ya se añadieron
        var FLECHAS_INICIALIZADAS = false;

        gestionMalla.select = function () {
            //$(document).ready(function () {
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
                //var corr = $(this).attr('corr');
                //alert(corr);
                //alert('borre');
                limpiarSeleccion();
            });
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
            angular.forEach(gestionMalla.mallaEntity.requisitos, function (valor, key) {
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
                //                  var corrAct = gestionMalla.mallaEntity.requisitos[idMateria];

                //alert('corrAct'+corrAct);
                //Marca los correquisitos
                //            if (corrAct) {
                //                for (var i = 0; i < corrAct.length; i++) {
                //                    var idCorrAct = corrAct[i];
                //                    //alert('iterando'+idCorrAct);
                //                    //alert('adelante: '+idCorrAct);
                //                    $('#' + idCorrAct).addClass('prerequisito');
                //                    //Se invoca recursivamente si existen prerrequisitos del prerequisito
                //                    if (gestionMalla.mallaEntity.requisitos[idCorrAct]) {
                //                        /*setTimeout( function(){*/seleccionarAdelante(idCorrAct);//}, TIME_OUT_ANIM );
                //                        //seleccionarAdelante( idCorrAct );
                //                    }
                //                    //REtorna para quebrar el ciclo y el llamado recursivo
                //                    //return;
                //                }
                //            }
                //            return;  
            });
        }

        /*Función que marca los correquisitos*/
        function seleccionarCorreq(idMateria) {
            //Marca los prerequisitos
            var preAct = CORREQUISITOS[idMateria];
            if (preAct) {
                //Marca los correquisitos
                for (var i = 0; i < preAct.length; i++) {
                    var idPreAct = preAct[i];
                    $('#' + idPreAct).toggleClass('correquisito');
                }
            }
        }

        /*Función que marca las materias hacia atrás*/
        function seleccionaPrevios(idMateria) {
            angular.forEach(gestionMalla.mallaEntity.requisitos, function (valor, key) {
                var prerequisito = [];
                prerequisito = valor.split(':');
                var str1 = prerequisito[0];
                prerequisito[1] = prerequisito[1].replace('[', '');
                var str2 = prerequisito[1] = prerequisito[1].replace(']', '');

                if (str2 === idMateria) {
                    $('#' + str1).addClass('previo');
                    //seleccionaPrevios( keyAct )
                    /*setTimeout( function(){*/seleccionaPrevios(str1);/*}, TIME_OUT_ANIM );*/
                    //break;
                }
            });
            //Itera sobre la lista de prerequisitos
            //            for (var keyAct in gestionMalla.mallaEntity.requisitos) {
            //                var rel = gestionMalla.mallaEntity.requisitos[keyAct];
            //                //alert('rel: '+rel);
            //                var valAct;
            //                for (var j = 0; j < rel.length; j++) {
            //                    valAct = rel[j];
            //                    if (valAct === idMateria) {
            //                        $('#' + keyAct).addClass('previo');
            //                        //seleccionaPrevios( keyAct )
            //                        /*setTimeout( function(){*/seleccionaPrevios(keyAct);/*}, TIME_OUT_ANIM );*/
            //                        //break;
            //                    }
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
                endpointStyle: { radius: 2 },
                overlays: [["PlainArrow", { location: 1, width: 10, length: 9 }]],
                /*connectorStyle:{ strokeStyle:'green', lineWidth:4 },*/
                paintStyle: { lineWidth: 3, strokeStyle: color_prueba }
            };
            // your jsPlumb related init code goes here

            //Estilo de las flechas de correquisitos
            var commcorr = {
                /*connector:"StateMachine",*/
                anchors: ["Center", "Center"],
                endpoints: ["Blank", "Blank"],
                endpointStyle: { radius: 2 },
                /*overlays:[ ["PlainArrow", {location:1, width:10, length:9} ]],*/
                paintStyle: {
                    lineWidth: 2,
                    strokeStyle: "rgb(131,8,135)",
                    dashstyle: "2 2"
                    /*joinstyle:"miter"*/
                }
            };

            //            var array = listaPrerequistos.split(',');
            angular.forEach(gestionMalla.mallaEntity.requisitos, function (valor, key) {
                var prerequisito = [];
                prerequisito = valor.split(':');
                var str1 = prerequisito[0];
                prerequisito[1] = prerequisito[1].replace('[', '');
                var str2 = prerequisito[1] = prerequisito[1].replace(']', '');

                jsPlumb.connect({ source: str1, target: str2 }, common);
            });

            init();
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