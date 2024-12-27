'use strict';
angular.module('mytodoApp').controller('PazSalvoAcademicoCtrl', ['$scope', 'pazSalvoAcademicoService', '$location', 'ValidationService', 'localStorageService', '$timeout', '$http', '$window', 'utilServices', 'appConstant', 'appGenericConstant', 'appConstantValueList',
    function ($scope, pazSalvoAcademicoService, $location, ValidationService, localStorageService, $timeout, $http, $window, utilServices, appConstant, appGenericConstant, appConstantValueList) {

        var gestionNotaEstudiante = this;
        var config = { disableCountDown: true, ttl: 5000 };
        gestionNotaEstudiante.listaPeriodos = [];
        gestionNotaEstudiante.listaNotas = [];
        gestionNotaEstudiante.listaProgramas = [];
        gestionNotaEstudiante.listaPazSalvoFinanciero = [];
        gestionNotaEstudiante.item = [];
        gestionNotaEstudiante.identificacionConsultar = null;
        gestionNotaEstudiante.notaEntity = pazSalvoAcademicoService.entidad;
        gestionNotaEstudiante.estudiante = pazSalvoAcademicoService.estudiante;
        gestionNotaEstudiante.report = {
            selected: null
        };
        gestionNotaEstudiante.display = appGenericConstant.DIEZ;

        gestionNotaEstudiante.onConsultarEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.buscarEstudiante)) {
                gestionNotaEstudiante.listaProgramas = [];
                gestionNotaEstudiante.listaPeriodos = [];
                pazSalvoAcademicoService.consultarProgramas(gestionNotaEstudiante.identificacionConsultar).then(function (data) {
                    gestionNotaEstudiante.listaProgramas = data;
                    onConsultarPeriodos(gestionNotaEstudiante.identificacionConsultar);
                    $('#btnConsultarHistoral').show();
                    $(function () {
                        $('#divNombre,#divIdentificacion').show();
                    });

                    pazSalvoAcademicoService.buscarEstudianteByCodigo(gestionNotaEstudiante.identificacionConsultar).then(function (data) {
                        gestionNotaEstudiante.estudiante.identificacion = data[0].identificacion;
                        gestionNotaEstudiante.estudiante.nombre = data[0].nombreEstudiante + ' ' + data[0].apellidoEstudiante;
                        gestionNotaEstudiante.estudiante.data = data;
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });

                    pazSalvoAcademicoService.getListadoPazSalvoFinancieroGeneradoByIdentificacion(gestionNotaEstudiante.identificacionConsultar).then(function (data) {
                        gestionNotaEstudiante.listaPazSalvoFinanciero = data;
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        function onConsultarPeriodos(identificacion) {
            pazSalvoAcademicoService.consultarPeriodo(identificacion).then(function (data) {
                gestionNotaEstudiante.listaPeriodos = data;
            });
        }

        gestionNotaEstudiante.onConsultarNotas = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();


            if (id !== null && id !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarNotas(gestionNotaEstudiante.notaEntity.PeriodoAcademico, gestionNotaEstudiante.estudiante.identificacion, id).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    gestionNotaEstudiante.listaNotas = data;
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });


                pazSalvoAcademicoService.consultarNotasCertificado(gestionNotaEstudiante.notaEntity.PeriodoAcademico, gestionNotaEstudiante.estudiante.identificacion, id).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    gestionNotaEstudiante.listaNotasCertificado = data;
                    
                    if (gestionNotaEstudiante.notaEntity.programaAcademico.debe > 0) {
                        swal({
                            title: 'El estudiante presenta deudas, por favor verificar antes de generar paz y salvo financiero',
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        });
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });

            } else {
                gestionNotaEstudiante.listaNotas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        gestionNotaEstudiante.onConsultarProgramas = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            if (id !== null && id !== appGenericConstant.INDEFINIDO) {
                pazSalvoAcademicoService.consultarProgramas(gestionNotaEstudiante.estudiante.identificacion, id).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    gestionNotaEstudiante.listaProgramas = data;
                    if (gestionNotaEstudiante.notaEntity.programaAcademico !== null || gestionNotaEstudiante.notaEntity.programaAcademico !== "" || gestionNotaEstudiante.notaEntity.programaAcademico !== undefined) {
                        gestionNotaEstudiante.onConsultarNotas(gestionNotaEstudiante.notaEntity.programaAcademico);
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    return;
                });
            } else {
                gestionNotaEstudiante.listaProgramas = [];
                appConstant.CERRAR_SWAL();
            }
        };

        if ($location.path() === '/paz-salvo-academico') {
            gestionNotaEstudiante.notaEntity.PeriodoAcademico = null;
            gestionNotaEstudiante.notaEntity.programaAcademico = null;
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

        gestionNotaEstudiante.onGenerarReporte = function () {
            gestionNotaEstudiante.PazSalvoAcademico = gestionNotaEstudiante.listaNotas;

            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            if (gestionNotaEstudiante.PazSalvoAcademico !== null && gestionNotaEstudiante.PazSalvoAcademico !== appGenericConstant.INDEFINIDO) {
                gestionNotaEstudiante.item = [];
                var headers = {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
                };
                var PazSalvoAcademico = {
                    PazSalvoAcademico: gestionNotaEstudiante.PazSalvoAcademico
                };
                var jsonString = JSON.stringify(PazSalvoAcademico);
                jsonString = "1" + jsonString;
                var urlRequest = '/api/admisiones/report/crearReportD/';
                onGenerarReporteDirecto(PazSalvoAcademico, "1", urlRequest);

                /*$http.post(urlRequest, jsonString, headers).then(function (data) {
                    if (data.status === 200) {
                        gestionNotaEstudiante.item.push(data.data.message);
                        gestionNotaEstudiante.download(gestionNotaEstudiante.item[0], appGenericConstant.MICRO_SERVICIO_ADMISIONES);
                    } else {
                        appConstant.MSG_REPORTE_ERROR();
                        appConstant.CERRAR_SWAL();
                    }
                }).catch(function (e) {
                    appConstant.MSG_REPORTE_ERROR();
                    appConstant.CERRAR_SWAL();
                    throw e;
                });*/
            } else {
                gestionNotaEstudiante.PazSalvoAcademico = [];
                appConstant.CERRAR_SWAL();
            }
        };

        gestionNotaEstudiante.onGenerarReporteCertificadoNotasModal = function (opcion) {
            gestionNotaEstudiante.informacionAux = {};
            gestionNotaEstudiante.opcionReporte = opcion;
            $('#myModal2').modal({ backdrop: 'static', keyboard: false });
            $("#myModal2").modal("show");
        };

        gestionNotaEstudiante.onGenerarReporteCertificadoFinanciero = function (opcion) {
            gestionNotaEstudiante.informacionAux = {};
            gestionNotaEstudiante.opcionReporte = opcion;
            $('#myModalFinanciero').modal({ backdrop: 'static', keyboard: false });
            $("#myModalFinanciero").modal("show");
        };

        gestionNotaEstudiante.onGenerarPazSalvoFinanciero = function () {

            if (onValidadCampos(gestionNotaEstudiante.informacionAux.cicloAprobado, "Ciclo Aprobado")) {
                return;
            }
            if (onValidadCampos(gestionNotaEstudiante.informacionAux.cicloAutorizado, "Ciclo Autorizado")) {
                return;
            }
            if (onValidadCampos(gestionNotaEstudiante.informacionAux.unidadesAprendizaje, "Unidades de Aprendizaje")) {
                return;
            }
            if (onValidadCampos(gestionNotaEstudiante.informacionAux.observacion, "Observacion")) {
                return;
            }
            var json = {
                id: null,
                usuarioCreacion: localStorageService.get('usuario').username,
                idUsuario: localStorageService.get('usuario').id,
                codigo: null,
                fechaSolicitud: new Date(),
                fechaCreacion: new Date(),
                codigoEstudiante: gestionNotaEstudiante.estudiante.data[0].identificacion,
                nombres: gestionNotaEstudiante.estudiante.data[0].nombreEstudiante,
                apellidos: gestionNotaEstudiante.estudiante.data[0].apellidoEstudiante,
                unidadesAprendizaje: gestionNotaEstudiante.informacionAux.unidadesAprendizaje,
                observacion: gestionNotaEstudiante.informacionAux.observacion,
                cicloAprobado: gestionNotaEstudiante.informacionAux.cicloAprobado,
                cicloAutorizado: gestionNotaEstudiante.informacionAux.cicloAutorizado,
                nombreProgramaAcademico: gestionNotaEstudiante.notaEntity.programaAcademico.nombrePrograma,
                sede: gestionNotaEstudiante.notaEntity.programaAcademico.sede
            }

            pazSalvoAcademicoService.postGuardarPazSalvoFinanciero(json).then(function (data) {
                
                if (data.tipo !== 409) {
                    gestionNotaEstudiante.onGenerarReporteFinanciero(data.objectResponse);
                    $("#myModalFinanciero").modal("hide");
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                }

            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });

        };

        gestionNotaEstudiante.onGenerarReporteFinanciero = function (jsonReport) {

            var json = {
                id: jsonReport.id,
                idPeriodoAcademico: jsonReport.idPeriodoAcademico,
                usuarioCreacion: jsonReport.usuarioCreacion,
                idUsuario: jsonReport.idUsuario,
                codigo: jsonReport.codigo,
                fechaSolicitud: jsonReport.fechaSolicitud,
                fechaCreacion: jsonReport.fechaCreacion,
                codigoEstudiante: jsonReport.codigoEstudiante,
                nombres: jsonReport.nombres,
                apellidos: jsonReport.apellidos,
                unidadesAprendizaje: jsonReport.unidadesAprendizaje,
                convenioPago: jsonReport.convenioPago,
                observacion: jsonReport.observacion,
                cicloAprobado: jsonReport.cicloAprobado,
                cicloAutorizado: jsonReport.cicloAutorizado,
                nombreProgramaAcademico: jsonReport.nombreProgramaAcademico,
                sede: jsonReport.sede
            }

            var headers = { Authorization: localStorageService.get('autorizacion').token };
            var pazSalvoFinanciero = {
                PazSalvoFinanciero: json
            };
            var jsonString = JSON.stringify(pazSalvoFinanciero);
            jsonString = gestionNotaEstudiante.opcionReporte + "" + jsonString;
            var urlRequest = '/api/financiero/report/crearReportD/';

            if (gestionNotaEstudiante.opcionReporte === 7) {
                onGenerarReporteDirecto(pazSalvoFinanciero, gestionNotaEstudiante.opcionReporte, urlRequest);
            } else {
                onGenerarReporte(urlRequest, jsonString, headers);
            }

        };

        function onValidadCampos(data, campo) {
            if (data === null
                && data === appGenericConstant.INDEFINIDO
                && data === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesita registrar " + campo);
                return 1 === 1;
            }
            return false;
        }

        function onGenerarReporteDirecto(json, opcion, url) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            gestionNotaEstudiante.item = [];

            var jsonString = JSON.stringify(json);
            jsonString = opcion + "" + jsonString;
            var urlRequest = url;

            $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
                },
                responseType: 'arraybuffer'
            }).success(function (data) {
                var file = new Blob([data], {
                    type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                appConstant.CERRAR_SWAL();

            }).error(function () {
                appConstant.MSG_GROWL_ERROR("Error de conexión: No fue posible conectarse con el servidor");
                appConstant.CERRAR_SWAL();
            });

        };


        gestionNotaEstudiante.onGenerarReporteCertificadoNotas = function () {

            if (gestionNotaEstudiante.informacionAux.ciclo === null
                && gestionNotaEstudiante.informacionAux.ciclo === appGenericConstant.INDEFINIDO
                && gestionNotaEstudiante.informacionAux.ciclo === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesita registrar Ciclo");
                return;
            }

            if (gestionNotaEstudiante.informacionAux.duracionPrograma === null
                && gestionNotaEstudiante.informacionAux.duracionPrograma === appGenericConstant.INDEFINIDO
                && gestionNotaEstudiante.informacionAux.duracionPrograma === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesitar registrar duración programa");
                return;
            }

            if (gestionNotaEstudiante.informacionAux.duracionProgramaHoras === null
                && gestionNotaEstudiante.informacionAux.duracionProgramaHoras === appGenericConstant.INDEFINIDO
                && gestionNotaEstudiante.informacionAux.duracionProgramaHoras === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesitar registrar duracion programa horas");
                return;
            }

            if (gestionNotaEstudiante.informacionAux.duracionProgramaHorasSemanales === null
                && gestionNotaEstudiante.informacionAux.duracionProgramaHorasSemanales === appGenericConstant.INDEFINIDO
                && gestionNotaEstudiante.informacionAux.duracionProgramaHorasSemanales === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesitar registrar duracion programa horas semanales");
                return;
            }
            if (gestionNotaEstudiante.informacionAux.jornada === null
                && gestionNotaEstudiante.informacionAux.jornada === appGenericConstant.INDEFINIDO
                && gestionNotaEstudiante.informacionAux.jornada === "") {
                appConstant.MSG_GROWL_ADVERTENCIA("Se necesitar registrar Jornada");
                return;
            }

            if (gestionNotaEstudiante.opcionReporte === 4) {
                if (gestionNotaEstudiante.informacionAux.resolucion === null
                    && gestionNotaEstudiante.informacionAux.resolucion === appGenericConstant.INDEFINIDO
                    && gestionNotaEstudiante.informacionAux.resolucion === "") {
                    appConstant.MSG_GROWL_ADVERTENCIA("Se necesitar registrar resolucion");
                    return;
                }
            }

            gestionNotaEstudiante.CertificadoNotas = gestionNotaEstudiante.listaNotasCertificado;

            angular.forEach(gestionNotaEstudiante.CertificadoNotas, function (value, key) {
                value.numeroCiclo = gestionNotaEstudiante.informacionAux.ciclo;
                value.duracionPrograma = gestionNotaEstudiante.informacionAux.duracionPrograma;
                value.duracionHoras = gestionNotaEstudiante.informacionAux.duracionProgramaHoras;
                value.duracionHorasSemana = gestionNotaEstudiante.informacionAux.duracionProgramaHorasSemanales;
                value.nombreJornada = gestionNotaEstudiante.informacionAux.jornada;
                value.resolucion = gestionNotaEstudiante.informacionAux.resolucion;
            });

            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            if (gestionNotaEstudiante.certificadoNota !== null && gestionNotaEstudiante.certificadoNota !== appGenericConstant.INDEFINIDO) {
                gestionNotaEstudiante.item = [];
                var headers = { 
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
                };
                var certificadoNota = {
                    certificadoNota: gestionNotaEstudiante.CertificadoNotas
                };

                if(gestionNotaEstudiante.opcionReporte === 3){
                    var certificadoNota = {
                        certificadoNota: gestionNotaEstudiante.CertificadoNotas[0]
                    };
                } 

                var jsonString = JSON.stringify(certificadoNota);
                jsonString = gestionNotaEstudiante.opcionReporte + "" + jsonString;
                var urlRequest = '/api/admisiones/report/crearReportD/';
                //onGenerarReporte(urlRequest, jsonString, headers);
                onGenerarReporteDirecto(certificadoNota, gestionNotaEstudiante.opcionReporte, urlRequest);

            } else {
                gestionNotaEstudiante.PazSalvoAcademico = [];
                appConstant.CERRAR_SWAL();
            }
        };

        function onGenerarReporte(urlRequest, jsonString, headers) {
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    gestionNotaEstudiante.item.push(data.data.message);
                    gestionNotaEstudiante.download(gestionNotaEstudiante.item[0], appGenericConstant.MICRO_SERVICIO_FINANCIERO);
                } else {
                    appConstant.MSG_REPORTE_ERROR();
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                throw e;
            });
        }


        gestionNotaEstudiante.download = function (itemArc, servicio) {
            var file = utilServices.downloadArchivo(itemArc, servicio);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            }
        };
        //        onConsultarPeriodos();
    }]);