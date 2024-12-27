(function () {
    'use strict';
    angular.module('mytodoApp').controller('asignarNotaCtrl', asignarNotaCtrl);
    asignarNotaCtrl.$inject = ['$scope', 'asignarNotaDocenteService', 'hojaVidaService', 'growl', 'ValidationService', 'localStorageService', '$timeout', 'appConstant', '$interval', 'utilServices', 'appConstantValueList', 'appGenericConstant'];
    function asignarNotaCtrl($scope, asignarNotaDocenteService, hojaVidaService, growl, ValidationService, localStorageService, $timeout, appConstant, $interval, utilServices, appConstantValueList, appGenericConstant) {

        var asignarNotaCtrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        asignarNotaCtrl.display;
        asignarNotaCtrl.selectTodos = false;
        asignarNotaCtrl.filtrados = [];
        asignarNotaCtrl.estados = [];
        asignarNotaCtrl.listadoModulos = [];
        asignarNotaCtrl.listadoGrupos = [];
        asignarNotaCtrl.listadoEstudianteArchivo = [];
        asignarNotaCtrl.options = appConstant.FILTRO_TABLAS;
        asignarNotaCtrl.selectedOption = asignarNotaCtrl.options[0];
        asignarNotaCtrl.configuracionNota = {};
        asignarNotaCtrl.idNotaMasiva = null;
        asignarNotaCtrl.valorNotaMasiva = null;
        asignarNotaCtrl.tipoArchivoValido = true;

        asignarNotaCtrl.listaNotas = [
            {
                id: 1,
                nombreNota: 'Nota 1'
            },
            {
                id: 2,
                nombreNota: 'Nota 2'
            },
            {
                id: 3,
                nombreNota: 'Nota 3'
            }
        ];

        asignarNotaCtrl.listadoEstudiantes = [];

        asignarNotaCtrl.report = {
            selected: null
        };
        asignarNotaCtrl.counter = 0;

        asignarNotaCtrl.onChangeValorNota = function () {
            asignarNotaCtrl.valorNotaMasiva = 0;
        };

        asignarNotaCtrl.onCargarConfiguracion = function () {
            asignarNotaDocenteService.buscarConfiguracion().then(function (data) {

                if (data.length > 0) {
                    angular.forEach(data, function (value, key) {
                        asignarNotaCtrl.configuracionNota =
                            {
                                id: value.id,
                                nota1: value.nota1,
                                nota2: value.nota2,
                                nota3: value.nota3,
                                notaHabilitacion: value.notaHabilitacion,
                                notaDefinitiva: value.notaDefinitiva
                            };
                    });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontró configuración de porcentajes de las notas');
                }
            });
        };
        asignarNotaCtrl.identiocente = localStorageService.get("usuario").identificacion;

        function buscarModulo() {

            //            localStorageService.get("usuario").identificacion;

            asignarNotaDocenteService.buscarModuloByDocente(asignarNotaCtrl.identiocente).then(function (data) {
                asignarNotaCtrl.listadoModulos = [];
                asignarNotaCtrl.listadoModulos = data;

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        asignarNotaCtrl.onBuscarGruposByModulo = function () {
            if (asignarNotaCtrl.modulo === null || asignarNotaCtrl.modulo === undefined) {
                asignarNotaCtrl.listadoGrupos = [];
                return;
            }

            asignarNotaDocenteService.buscarGruposModulo(asignarNotaCtrl.modulo.idModulo, asignarNotaCtrl.identiocente, asignarNotaCtrl.modulo.idPeriodo, asignarNotaCtrl.modulo.idHorario).then(function (data) {
                asignarNotaCtrl.listadoGrupos = [];
                asignarNotaCtrl.listadoGrupos = data;
                asignarNotaCtrl.listadoEstudiantes = [];
                //                if (asignarNotaCtrl.listadoGrupos.length > 0) {
                //                    asignarNotaCtrl.idGrupo = asignarNotaCtrl.listadoGrupos[0].id;
                //                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };

        asignarNotaCtrl.onConsultarEstudiantes = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaCtrl.listadoEstudiantes = [];
            asignarNotaDocenteService.buscarEstudiantesByGrupo(asignarNotaCtrl.idGrupo).then(function (data) {
                asignarNotaCtrl.listadoEstudiantes = data;
                asignarNotaCtrl.listadoExportar = [];
                angular.forEach(data, function (value, key) {

                    var result =  $.grep(data, function (n, i) {
                        return n.id === asignarNotaCtrl.idGrupo;
                    });
                    
                    var idPrograma = 10;

                    var array = value.estudiante.split(" ");
                    var dto = {
                        identificacion: array[0],
                        nombre: array[1] + " " + array[2] + " " + array[3],
                        nota1: value.nota1,
                        nota2: value.nota2,
                        nota3: value.nota3
                    };
                    
                    if(idPrograma !== value.idPrograma){
                        dto.classNota1 = value.nota1 < 3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3 ? 0 : 1;
                        dto.classNotaH = value.notaHabilitacion < 3 ? 0 : 1;
                    }else{
                        dto.classNota1 = value.nota1 < 3.3 ? 0 : 1;
                        dto.classNota2 = value.nota2 < 3.3 ? 0 : 1;
                        dto.classNota3 = value.nota3 < 3.3 ? 0 : 1;
                        dto.classNotaD = value.notaDefinitiva < 3.3 ? 0 : 1;
                        dto.classNotaH = value.notaDefinitiva < 3.3 ? 0 : 1;
                    }
                    asignarNotaCtrl.listadoExportar.push(dto);
                });

                //                for (var j = 0; j < asignarNotaCtrl.listadoEstudiantes.length; j++) {
                //                    asignarNotaCtrl.listadoEstudiantes[j].estudiante.codigo === asignarNotaCtrl.listadoEstudianteArchivo[i][7]
                //                    asignarNotaCtrl.listadoEstudiantes[j].nota1 = parseFloat(asignarNotaCtrl.listadoEstudianteArchivo[i][9]);
                //                    asignarNotaCtrl.listadoEstudiantes[j].nota2 = parseFloat(asignarNotaCtrl.listadoEstudianteArchivo[i][10]);
                //                    asignarNotaCtrl.listadoEstudiantes[j].nota3 = parseFloat(asignarNotaCtrl.listadoEstudianteArchivo[i][11]);
                //                }

                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes matriculados a este grupo');
                }
            });
            appConstant.CERRAR_SWAL();
        };

        asignarNotaCtrl.onNotaMasivo = function (item) {
            asignarNotaCtrl.idNotaMasiva = null;
            asignarNotaCtrl.valorNotaMasiva = null;
            asignarNotaCtrl.onMostrarModal(item);
        };

        asignarNotaCtrl.onMostrarModal = function (item) {
            $('#' + item).modal({ backdrop: 'static', keyboard: false });
            $("#" + item).modal("show");
        };

        asignarNotaCtrl.onOcultarModal = function (item) {
            $("#" + item).hide();
            //            $("body").removeClass("modal-open");
            //            $("div").removeClass("modal-backdrop fade in");
        };

        asignarNotaCtrl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfiguracionNota)) {
                asignarNotaCtrl.guardarNota();
                new ValidationService().resetForm($scope.formConfiguracionNota);
            }
        };

        asignarNotaCtrl.onSubmitFormNotaMasiva = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (asignarNotaCtrl.idNotaMasiva === 1) {

                angular.forEach(asignarNotaCtrl.listadoEstudiantes, function (value, key) {
                    //                    if (value.esPago !== 'ABIERTA') {
                    //                        if (value.nota1 === undefined || value.nota1 === '' || value.nota1 === null) {
                    value.nota1 = parseFloat(asignarNotaCtrl.valorNotaMasiva);
                    //                        }
                    //                    }
                });

            } else if (asignarNotaCtrl.idNotaMasiva === 2) {

                angular.forEach(asignarNotaCtrl.listadoEstudiantes, function (value, key) {
                    //                    if (value.esPago !== 'ABIERTA') {
                    //                        if (value.nota2 === undefined || value.nota2 === '' || value.nota2 === null) {
                    value.nota2 = parseFloat(asignarNotaCtrl.valorNotaMasiva);
                    //                        }
                    //                    }
                });

            } else if (asignarNotaCtrl.idNotaMasiva === 3) {

                angular.forEach(asignarNotaCtrl.listadoEstudiantes, function (value, key) {
                    //                    if (value.esPago !== 'ABIERTA') {
                    //                        if (value.nota3 === undefined || value.nota3 === '' || value.nota3 === null) {
                    value.nota3 = parseFloat(asignarNotaCtrl.valorNotaMasiva);
                    //                        }
                    //                    }
                });

            } else {

            }
            appConstant.CERRAR_SWAL();
            asignarNotaCtrl.onOcultarModal('modalNotaMasivo');
        };

        asignarNotaCtrl.guardarNota = function () {

            if (asignarNotaCtrl.configuracionNota.id === null || asignarNotaCtrl.configuracionNota.id === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA('No se encontró configuración de porcentajes de las notas');
                return;
            }

            angular.forEach(asignarNotaCtrl.listadoEstudiantes, function (value, key) {
                value.idUsuario = localStorageService.get("usuario").id;
                value.porcentajeNota1 = asignarNotaCtrl.configuracionNota.nota1;
                value.porcentajeNota2 = asignarNotaCtrl.configuracionNota.nota2;
                value.porcentajeNota3 = asignarNotaCtrl.configuracionNota.nota3;
                value.porcentajeNotaDefinitiva = asignarNotaCtrl.configuracionNota.notaDefinitiva;
                value.porcentajeNotaHabilitacion = asignarNotaCtrl.configuracionNota.notaHabilitacion;
            });

            asignarNotaCtrl.enviarEmailConstancia(asignarNotaCtrl.listadoEstudiantes);

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            asignarNotaDocenteService.asignarNota(asignarNotaCtrl.listadoEstudiantes).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    asignarNotaCtrl.onCargarConfiguracion();
                    asignarNotaCtrl.onConsultarEstudiantes();
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        function buildTable(results) {
            if (asignarNotaCtrl.tipoArchivoValido) {
                asignarNotaCtrl.listadoEstudianteArchivo = [];
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var data = results.data;

                for (var i = 1; i < data.length; i++) {
                    var row = data[i][0];
                    var array = row.split(";");
                    asignarNotaCtrl.listadoEstudianteArchivo.push(array);

                    ;
                }
            }
        }

        asignarNotaCtrl.onCargarArchivo = function (file) {
            var fileExiste = false;
            var input = $("#files");
            $('#files').parse({

                before: function (file, inputElem) {
                  let formData  = new FormData();
                  formData.append('FileAssistance', file);
                  asignarNotaDocenteService.uploadPlantillaDocente(formData).then(function (data) {

                    appConstant.MSG_GROWL_OK("Planilla cargada exitosamente");
                    return data;
                });

                },
            });
        };

        asignarNotaCtrl.enviarEmailConstancia = function (item) {
            var list = [];
            angular.forEach(item, function (value, key) {
                var dto = {
                    nombreGrupo: asignarNotaCtrl.modulo.nombreModulo,
                    nombreEstudiante: value.estudiante,
                    nombreDocente: localStorageService.get("usuario").nombres + " " + localStorageService.get("usuario").apellidos,
                    emailDocente: localStorageService.get("usuario").email,
                    nota1: value.nota1,
                    nota2: value.nota2,
                    nota3: value.nota3,
                    notaA: value.notaHabilitacion,
                    notaD: value.notaDefinitiva
                };
                list.push(dto);
            });

            asignarNotaDocenteService.enviarEmailCertificado(list).then(function (data) {
                if (data.tipo === appGenericConstant.OK) {
                    appConstant.MSG_GROWL_OK("Certificado enviado de manera exitosa.");
                    appConstant.CERRAR_SWAL();
                } else {
                    appConstant.MSG_EMAIL_REPORTE_ERROR();
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.MSG_EMAIL_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            });
        };

        asignarNotaCtrl.gestionNota = function (valor) {
           var result =  $.grep(asignarNotaCtrl.listadoGrupos, function (n, i) {
                return n.id === asignarNotaCtrl.idGrupo;
            });

            var valorComparar = 3;
            return valor < valorComparar;
        }

        
        asignarNotaCtrl.onMostrarModalObservacion = function (value) {
            asignarNotaCtrl.matricula = value;
            asignarNotaCtrl.consultarObservacion(value.idMatricula);
            $('#modalRegistrarObservacion').modal({ backdrop: 'static', keyboard: false });
            $("#modalRegistrarObservacion").modal("show");
        };

        asignarNotaCtrl.consultarObservacion = function (idMatricula) {
            hojaVidaService.getListadoOnservacionByIdMatricula(idMatricula).then(function (data) {
                asignarNotaCtrl.listaObservaciones = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        asignarNotaCtrl.onGuardarObservacion = function () {

            asignarNotaCtrl.registrarObservacion.idUsuario = localStorageService.get("usuario").id;
            asignarNotaCtrl.registrarObservacion.usuario = localStorageService.get("usuario").username;
            asignarNotaCtrl.registrarObservacion.idMatricula = asignarNotaCtrl.matricula.idMatricula;

            hojaVidaService.postObservacionEstudiante(asignarNotaCtrl.registrarObservacion).then(function (data) {
                if (data.tipo === 200) {

                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    asignarNotaCtrl.registrarObservacion.observacion = undefined;
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });

        };

        asignarNotaCtrl.descargarPlantillaDocente = function () {   
            //asignarNotaDocenteService.buscarPlantillaDocente()
            asignarNotaDocenteService.
            descargarPlantillaDocente(asignarNotaCtrl.idGrupo,
                asignarNotaCtrl.modulo.idModulo,
                asignarNotaCtrl.modulo.idPeriodo).then(function (res) {
                    var file = new Blob([res], { type: 'application/octet-stream' });
                    saveAs(file, 'planilla_docente.xlsx');
                })
        };

        buscarModulo();
        asignarNotaCtrl.onCargarConfiguracion();
    }
})();