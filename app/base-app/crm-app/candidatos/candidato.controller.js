(function () {
    'use strict';
    angular.module('mytodoApp').controller('candidatosCtrl', candidatosCtrl);
    candidatosCtrl.$inject = ['$scope', '$location', 'ValidationService', 'localStorageService', 'inscripcionService', 'utilServices', 'appConstant', 'appGenericConstant', 'appConstantValueList', 'candidatoServices', 'programasAcademicosEntitiesServices','hojaVidaService', '$timeout'];
    function candidatosCtrl($scope, $location, ValidationService, localStorageService, inscripcionService, utilServices, appConstant, appGenericConstant, appConstantValueList, candidatoServices, programasAcademicosEntitiesServices,hojaVidaService, $timeout) {
        var candidControl = this;
        candidControl.item;
        candidControl.registros = [];

        var config = {};

        candidControl.options = appConstant.FILTRO_TABLAS;
        candidControl.selectedOption = candidControl.options[appGenericConstant.CERO];
        candidControl.selectedOption = candidatoServices.visible;
        candidControl.listaCandidatos = [];
        candidControl.listMedioCaptura = [];

        candidControl.listadoEstudianteArchivo = [];
        candidControl.listadoEstudianteArchivoError = [];
        candidControl.listadoEstudianteArchivoErrorExportar = [];
        candidControl.listadoEstudianteArchivoErrorDatos = [];

        candidControl.listadoEstudianteArchivoErrorNombre = [];
        candidControl.listadoEstudianteArchivoErrorEmail = [];
        candidControl.listadoEstudianteArchivoErrorTelefono = [];
        candidControl.listadoEstudianteArchivoErrorCelular = [];
        candidControl.listadoEstudianteArchivoErrorPrograma = [];
        candidControl.listadoEstudianteArchivoErrorBarrio = [];
        candidControl.listadoEstudianteArchivoErrorColegio = [];
        candidControl.listadoEstudianteArchivoErrorMedioCaptura = [];
        candidControl.listadoEstudianteArchivoErrorMedioDifusion = [];
        candidControl.listadoEstudianteArchivoTemporal = [];

        candidControl.candidatos = candidatoServices.candidato;

        candidControl.idCandidato = 0;
        if (localStorageService.get('idCandidato') !== null) {
            candidControl.idCandidato = localStorageService.get('idCandidato');
        }

        if (localStorageService.get('idCandidatoE') !== null) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            candidControl.candidatos.listaDetalleCandidatosEditar = [];
            candidatoServices.consultarDetalleCandidatos(localStorageService.get('idCandidatoE')).then(function (data) {
                candidControl.candidatos.listaDetalleCandidatosEditar = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                return;
            });

            candidControl.candidatos.listDashboardEstadistica = [];
            candidatoServices.onGetDashboardCandidatos(localStorageService.get('idCandidatoE'), 1).then(function (data) {
                candidControl.candidatos.listDashboardEstadistica = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                return;
            });
        }

        candidControl.subirCandidato = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var aux = localStorageService.get('usuario');
            var dto = {
                id: null,
                idFile: null,
                idPeriodo: candidControl.idPeriodo,
                descripcion: candidControl.descripcion,
                usuario: aux.username,
                idUsuario: aux.id,
                nombreArchivo: null,
                fechaRegistro: null
            };
            candidatoServices.agregarCandidatoN(dto).then(function (data) {
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                $location.path('/candidatos');
                appConstant.CERRAR_SWAL();
            });
        };

        candidControl.uploadFile = function () {

            candidatoServices.subirSoporte(candidControl.file).then(function (data) {
                var aux = localStorageService.get('usuario');
                var dto = {
                    id: null,
                    idFile: data.message,
                    idPeriodo: candidControl.idPeriodo,
                    descripcion: candidControl.descripcion,
                    usuario: aux.username,
                    idUsuario: aux.id,
                    nombreArchivo: null,
                    fechaRegistro: null
                };
                if (data.tipo === 200) {
                    appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                    appConstant.CARGANDO();
                    candidatoServices.agregarCandidato(dto).then(function (data) {

                        if (data.tipo === 200) {
                            appConstant.CERRAR_SWAL();
                            $location.path('/candidatos');
                            swal({
                                title: 'Felicitaciones',
                                text: 'Candidato registrado satisfactoriamente',
                                type: appGenericConstant.SUCCESS,
                                confirmButtonText: appGenericConstant.ACEPTAR,
                                allowOutsideClick: false
                            }).then(function (isConfirm) {
                            });
                        } else {
                            swal({
                                title: 'Felicitaciones',
                                text: 'Candidato registrado satisfactoriamente',
                                type: appGenericConstant.WARNING,
                                confirmButtonText: appGenericConstant.ACEPTAR,
                                allowOutsideClick: false
                            }).then(function (isConfirm) {
                            });
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        swal({
                            title: 'Felicitaciones',
                            text: 'Candidato registrado satisfactoriamente',
                            type: appGenericConstant.SUCCESS,
                            confirmButtonText: appGenericConstant.ACEPTAR,
                            allowOutsideClick: false
                        }).then(function (isConfirm) {
                        });
                        return;
                    });

                }

            });
        };

        function getIdSoporte(itemId) {
            candidControl.newItem = "";
            candidControl.newItem = itemId;
        }

        candidControl.onIrVerDetalle = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            candidControl.candidatos.listaDetalleCandidatos = [];
            candidatoServices.consultarDetalleCandidatos(item.id).then(function (data) {
                candidControl.candidatos.listaDetalleCandidatos = data;
                $timeout(function () {
                    $('#modalListaDetalleCanditatos').modal({backdrop: 'static', keyboard: false});
                    $("#modalListaDetalleCanditatos").modal("show");
                    appConstant.CERRAR_SWAL();
                }, 300);
            }).catch(function (e) {
                return;
            });
        };

        candidControl.onEditarCandidatoDetalleModal = function (item) {
            candidControl.clientesEntity = item;
            candidControl.clientesEntity.medioDifusion = parseInt(candidControl.clientesEntity.medioDifusion);
            candidControl.clientesEntity.medioCaptura = parseInt(candidControl.clientesEntity.medioCaptura);

            angular.forEach(candidControl.programas, function (value) {
                if (value.nombrePrograma === item.programasInteres) {
                    candidControl.clientesEntity.programasInteres = value;
                    candidControl.clientesEntity.programaInteres = value;
                }
            });

            $('#modalEditarCandidatoDetalle').modal({backdrop: 'static', keyboard: false});
            $("#modalEditarCandidatoDetalle").modal("show");
        };

        candidControl.listDifusionCaptura = [];

        candidControl.onModalEstadisticas = function (item) {
            candidControl.listDifusionCaptura = [];
            candidControl.listDifusionCaptura = item.detalleDifusionPorCaptura;
            candidControl.listBarrioPorDifusion = [];

            $('#modalGraficas').modal({backdrop: 'static', keyboard: false});
            $("#modalGraficas").modal("show");
        };

        candidControl.onCargarBarriosEstadistica = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            candidControl.titulo = "";
            candidControl.titulo = item.valor;
            candidControl.listBarrioPorDifusion = [];
            candidControl.listBarrioPorDifusion = item.detalleBarrioPorDifusion;

            appConstant.CERRAR_SWAL();
        };

        candidControl.getTotalDifusion = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].conteo);
            }
            return Math.round(totalNumber);
        };

        candidControl.getTotalBarrios = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].conteo);
            }
            return Math.round(totalNumber);
        };

        candidControl.onEditarCandidatoDetalle = function (item) {
            localStorageService.set('idCandidatoE', item.id);
            $location.path('/candidato-detalle-editar');
        };

        candidControl.onDashboardCandidatos = function (item) {
            localStorageService.set('idCandidatoE', item.id);
            $location.path('/candidato-detalle-dashboard');
        };

        candidControl.onAgregarCandidatoDetalle = function (item) {
            candidControl.clientesEntity = {};
            $location.path('/candidato-detalle');
            localStorageService.set('idCandidato', item.id);
        };

        candidControl.guardarCandidatoDetalle = function (item) {

            if (candidControl.clientesEntity === undefined || candidControl.clientesEntity === "" || candidControl.clientesEntity === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Digitar Campos obligatorios");
                return;
            }

            if (candidControl.clientesEntity.nombreEstudiante === undefined || candidControl.clientesEntity.nombreEstudiante === "" ||
                    candidControl.clientesEntity.nombreEstudiante === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar nombre candidato");
                return;
            }
            if (candidControl.clientesEntity.email === undefined || candidControl.clientesEntity.email === "" ||
                    candidControl.clientesEntity.email === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar email candidato");
                return;
            }
            if (candidControl.clientesEntity.telefono === undefined || candidControl.clientesEntity.telefono === "" ||
                    candidControl.clientesEntity.telefono === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar telefono candidato");
                return;
            }
            if (candidControl.clientesEntity.celularEstudiante === undefined || candidControl.clientesEntity.celularEstudiante === "" ||
                    candidControl.clientesEntity.celularEstudiante === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar celular candidato");
                return;
            }
            if (candidControl.clientesEntity.programaInteres === undefined || candidControl.clientesEntity.programaInteres === "" ||
                    candidControl.clientesEntity.programaInteres === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar programas candidato");
                return;
            }

            if (candidControl.clientesEntity.medioDifusion === undefined || candidControl.clientesEntity.medioDifusion === "" ||
                    candidControl.clientesEntity.medioDifusion === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar medio de difusión");
                return;
            }

            if (candidControl.clientesEntity.medioCaptura === undefined || candidControl.clientesEntity.medioCaptura === "" ||
                    candidControl.clientesEntity.medioCaptura === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar medio de captura");
                return;
            }

            if (candidControl.clientesEntity.barrio === undefined || candidControl.clientesEntity.barrio === "" ||
                    candidControl.clientesEntity.barrio === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Registrar barrio");
                return;
            }

            candidControl.clientesEntity.programasInteres = candidControl.clientesEntity.programaInteres.nombrePrograma;
            candidControl.clientesEntity.idCandidato = candidControl.idCandidato;
            candidControl.clientesEntity.idUsuarioRegistra = localStorageService.get("usuario").id;
            candidatoServices.guardarCandidatoDetalle(candidControl.clientesEntity).then(function (data) {
                candidControl.clientesEntity = {};
                $("#modalEditarCandidatoDetalle").modal("hide");
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
            }).catch(function (e) {
                return;
            });
        };

        candidControl.ejecutarConsultarPeriodoAcademico = function () {
            candidatoServices.consultarPeriodoAcademico().then(function (data) {
                candidControl.listadoPeriodos = [];
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    candidControl.listadoPeriodos.push(periodo);
                });
            }).catch(function (e) {
                return;
            });
        };

        candidControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCandidatos)) {
                candidControl.uploadFile();
                new ValidationService().resetForm($scope.formCandidatos);
            }
        };

        function BuscarCandidatos() {
            candidatoServices.buscarCandidato().then(function (data) {
                candidControl.listaCandidatos = data;
            }).catch(function (e) {
                return;
            });
        }

        candidControl.onFiltrarProgramaPorNivelFormacion = function () {
            appConstant.MSG_LOADING('Cargando datos. Espera un momento...');
            appConstant.CARGANDO();
            inscripcionService.consultarProgramaNivelFormacion(2, 10012).then(function (data) {
                candidControl.programas = [];
                if (data !== null && data.tipo !== 500) {
                    angular.forEach(data, function (value) {
                        var programa = {
                            id: value.id,
                            nombrePrograma: value.nombrePrograma,
                        };
                        candidControl.programas.push(programa);
                    });
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                candidControl.programas = [];
                //throw e;
                return;
            });
        };

        candidControl.instituciones = [];
        candidControl.ejecutarConsultarInstituciones = function () {
            inscripcionService.consultarColegio().then(function (data) {
                candidControl.instituciones = [];
                candidControl.instituciones = data;
                candidControl.listadoColegioFiltrado = $.unique(candidControl.instituciones.map(function (d) {
                    return d.nombreInstitucionAcademica;
                }));
            }).catch(function (e) {
                return;
            });
        };

        candidControl.ejecutarConsultarMediosDifusion = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MEDIO_DIFUSION, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                candidControl.lstmediodifusion = [];
                candidControl.lstmediodifusion = data;
                candidControl.listadoMedioDifusionFiltrado = $.unique(candidControl.lstmediodifusion.map(function (d) {
                    return d.valor;
                }));
            }).catch(function (e) {
                return;
            });
        };

        candidControl.ejecutarConsultarMediosDeCaptura = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MEDIO_CAPTURA, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                candidControl.listMedioCaptura = [];
                candidControl.listMedioCaptura = data;
                candidControl.listadoMedioCapturaFiltrado = $.unique(candidControl.listMedioCaptura.map(function (d) {
                    return d.valor;
                }));
            }).catch(function (e) {
                return;
            });
        };

        candidControl.ejecutarConsultarTodosBarrios = function () {
            inscripcionService.consultarAllBarrios().then(function (data) {
                candidControl.lstbarrios = [];
                candidControl.lstbarrios = data;
                candidControl.listadoBarriosFiltrados = $.unique(candidControl.lstbarrios.map(function (d) {
                    return d.nombreBarrio;
                }));
            }).catch(function (e) {
                return;
            });
        };

        function onConsultarProgramas() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            programasAcademicosEntitiesServices.buscarProgramasAcademicos().then(function (data) {
                candidControl.programas = [];
                if (data !== null && data.tipo !== 500) {
                    angular.forEach(data, function (value) {
                        var programa = {
                            id: value.id,
                            nombrePrograma: value.nombrePrograma.toUpperCase()
                        };
                        candidControl.programas.push(programa);
                    });

                    candidControl.listadoProgramasFiltrados = $.unique(candidControl.programas.map(function (d) {
                        return d.nombrePrograma;
                    }));
                }
            });
            appConstant.CERRAR_SWAL();
        }

        candidControl.idCandidatoArchivo  = {};
        candidControl.onCargarCandidatosArchivo = function (item) {
            candidControl.idCandidatoArchivo = item;
            $('#modalCargarCandidatos').modal({backdrop: 'static', keyboard: false});
            $("#modalCargarCandidatos").modal("show");
        };

        function buildTable(results) {
            if (candidControl.tipoArchivoValido) {
                candidControl.listadoEstudianteArchivoTemporal = [];
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var data = results.data;

                for (var i = 1; i < data.length; i++) {
                    var row = data[i][0];
                    var array = row.split(";");
                    candidControl.listadoEstudianteArchivoTemporal.push(array);
                }
            }
        }

        candidControl.onCargarArchivo = function () {
            var fileExiste = false;
            var input = $("#files");
            $('#files').parse({
                config: {
                    delimiter: "auto",
                    complete: buildTable
                },
                before: function (file, inputElem){
                    var file3 = file.name.split(".");
                    candidControl.tipoArchivoValido = file3[1] === 'csv';
                    fileExiste = true;
                },
                error: function (err, file){
                    appConstant.MSG_GROWL_ERROR();
                },
                complete: function (){
                    if (!fileExiste) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Seleccione por lo menos un archivo');
                        return;
                    }

                    if (!candidControl.tipoArchivoValido) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Tipo de archivo no valido');
                        return;
                    }
                    appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                    appConstant.CARGANDO();
                    for (var i = 0; i < candidControl.listadoEstudianteArchivoTemporal.length; i++) {

                        try {
                            var error = false;
                            var json = {
                                identificacion: candidControl.listadoEstudianteArchivoTemporal[i][0],
                                nombreEstudiante: candidControl.listadoEstudianteArchivoTemporal[i][1],
                                programasInteres: candidControl.listadoEstudianteArchivoTemporal[i][2],
                                direccion: candidControl.listadoEstudianteArchivoTemporal[i][3],
                                telefono: candidControl.listadoEstudianteArchivoTemporal[i][4],
                                email: candidControl.listadoEstudianteArchivoTemporal[i][5],
                                celularEstudiante: candidControl.listadoEstudianteArchivoTemporal[i][6],
                                modalidad: candidControl.listadoEstudianteArchivoTemporal[i][7],
                                municipio: candidControl.listadoEstudianteArchivoTemporal[i][8],
                                barrio: candidControl.listadoEstudianteArchivoTemporal[i][9],
                                grado: candidControl.listadoEstudianteArchivoTemporal[i][10],
                                jornada: candidControl.listadoEstudianteArchivoTemporal[i][11],
                                colegio: candidControl.listadoEstudianteArchivoTemporal[i][12],
                                edad: candidControl.listadoEstudianteArchivoTemporal[i][13],
                                medioCaptura: candidControl.listadoEstudianteArchivoTemporal[i][14],
                                medioDifusion: candidControl.listadoEstudianteArchivoTemporal[i][15],
                                acudiente: candidControl.listadoEstudianteArchivoTemporal[i][16],
                                celularAcudiante: candidControl.listadoEstudianteArchivoTemporal[i][17]
                            }

                            candidControl.listadoEstudianteArchivo = [];
                            candidControl.listadoEstudianteArchivoError = [];
                            candidControl.listadoEstudianteArchivoErrorExportar = [];
                            candidControl.listadoEstudianteArchivoErrorDatos = [];

                            candidControl.listadoEstudianteArchivoErrorNombre = [];
                            candidControl.listadoEstudianteArchivoErrorEmail = [];
                            candidControl.listadoEstudianteArchivoErrorTelefono = [];
                            candidControl.listadoEstudianteArchivoErrorCelular = [];
                            candidControl.listadoEstudianteArchivoErrorPrograma = [];
                            candidControl.listadoEstudianteArchivoErrorBarrio = [];
                            candidControl.listadoEstudianteArchivoErrorColegio = [];
                            candidControl.listadoEstudianteArchivoErrorMedioCaptura = [];
                            candidControl.listadoEstudianteArchivoErrorMedioDifusion = [];
                            //verificar Programa

                            var programaValido = candidControl.listadoProgramasFiltrados.includes(json.programaInteres.toUpperCase());
                            var barrioValido = candidControl.listadoBarriosFiltrados.includes(json.barrio.toUpperCase());
                            var colegioValido = candidControl.listadoColegioFiltrado.includes(json.colegio.toUpperCase());
                            var medioCapturaValido = candidControl.listadoMedioCapturaFiltrado.includes(json.medioCaptura.toUpperCase());
                            var medioDifusionValido = candidControl.listadoMedioDifusionFiltrado.includes(json.medioDifusion.toUpperCase());

                            if ((json.nombreEstudiante === undefined || json.nombreEstudiante === "" ||
                            json.nombreEstudiante === null) && !error) {
                                json.error = "Campo Nombre vacio";
                                candidControl.listadoEstudianteArchivoErrorNombre.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }

                            if ((json.email === undefined || json.email === "" ||
                            json.email === null) && !error) {
                                json.error = "Campo Email vacio";
                                candidControl.listadoEstudianteArchivoErrorEmail.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }

                            if ((json.telefono === undefined || json.telefono === "" ||
                                    json.telefono === null) && !error) {
                                json.error = "Campo telefono vacio";
                                candidControl.listadoEstudianteArchivoErrorTelefono.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }

                            if ((json.celularEstudiante === undefined || json.celularEstudiante === "" ||
                                    json.celularEstudiante === null) && !error) {
                                json.error = "Campo Celular vacio";
                                candidControl.listadoEstudianteArchivoErrorCelular.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }

                            if(!programaValido && !error){
                                json.error = "Programa no encontrado";
                                candidControl.listadoEstudianteArchivoErrorPrograma.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }
                            if(!barrioValido && !error){
                                json.error = "Barrio no encontrado";
                                candidControl.listadoEstudianteArchivoErrorBarrio.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }
                            if(!colegioValido && !error){
                                json.error = "Colegio no encontrado";
                                candidControl.listadoEstudianteArchivoErrorColegio.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }
                            if(!medioCapturaValido && !error){
                                json.error = "Medio Captura no encontrado";
                                candidControl.listadoEstudianteArchivoErrorMedioCaptura.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }
                            if(!medioDifusionValido && !error){
                                json.error = "Medio Difusion no encontrado";
                                candidControl.listadoEstudianteArchivoErrorMedioDifusion.push(json);
                                candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                                error = true;
                            }
                            if(!error){
                                candidControl.listadoEstudianteArchivo.push(json);
                            }

                          }
                          catch(error) {
                            json.error = "Error de datos"
                            candidControl.listadoEstudianteArchivoErrorDatos.push(json);
                            candidControl.listadoEstudianteArchivoErrorExportar.push(json);
                            console.error(error);
                          }
                    }

                    jsonNombre= {
                        nombre: "Campo Vacio Nombre "+ candidControl.listadoEstudianteArchivoErrorPrograma.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorPrograma.length
                    }
                    jsonEmail = {
                        nombre: "Campo Vacio Email "+ candidControl.listadoEstudianteArchivoErrorPrograma.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorPrograma.length
                    }
                    jsonCelular = {
                        nombre: "Campo Vacio Celular "+ candidControl.listadoEstudianteArchivoErrorPrograma.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorPrograma.length
                    }
                    jsonTelefono = {
                        nombre: "Campo Vacio Telefono "+ candidControl.listadoEstudianteArchivoErrorPrograma.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorPrograma.length
                    }

                    jsonPrograma = {
                        nombre: "Error Programa "+ candidControl.listadoEstudianteArchivoErrorPrograma.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorPrograma.length
                    }
                    jsonBarrio = {
                        nombre: "Error Barrio "+ candidControl.listadoEstudianteArchivoErrorBarrio.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorBarrio.length
                    }
                    jsonColegio = {
                        nombre: "Error Colegio "+ candidControl.listadoEstudianteArchivoErrorColegio.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorColegio.length
                    }
                    jsonMedioDifusion = {
                        nombre: "Error Medio Difusion "+ candidControl.listadoEstudianteArchivoErrorMedioCaptura.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorMedioCaptura.length
                    }
                    jsonMedioCaptura = {
                        nombre: "Error Medio Captura "+ candidControl.listadoEstudianteArchivoErrorMedioDifusion.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorMedioDifusion.length
                    }
                    jsonError = {
                        nombre: "Error Datos "+ candidControl.listadoEstudianteArchivoErrorDatos.length,
                        cantidad: candidControl.listadoEstudianteArchivoErrorDatos.length
                    }
                    candidControl.listadoEstudianteArchivoError.push(jsonNombre);
                    candidControl.listadoEstudianteArchivoError.push(jsonCelular);
                    candidControl.listadoEstudianteArchivoError.push(jsonEmail);
                    candidControl.listadoEstudianteArchivoError.push(jsonTelefono);
                    candidControl.listadoEstudianteArchivoError.push(jsonPrograma);
                    candidControl.listadoEstudianteArchivoError.push(jsonBarrio);
                    candidControl.listadoEstudianteArchivoError.push(jsonColegio);
                    candidControl.listadoEstudianteArchivoError.push(jsonMedioDifusion);
                    candidControl.listadoEstudianteArchivoError.push(jsonMedioCaptura);
                    candidControl.listadoEstudianteArchivoError.push(jsonError);

                    appConstant.CERRAR_SWAL();
                    input = input.val('').clone(true);
                    $scope.$apply();
                }
            });
        };

        candidControl.procesarCandidatosDiligenciados = function (){
            angular.forEach(candidControl.listadoEstudianteArchivo, function (value) {
                value.idCandidato = candidControl.idCandidatoArchivo.id;
                value.idUsuarioRegistra = localStorageService.get("usuario").id
                candidatoServices.guardarCandidatoDetalle(value).then(function (data) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                }).catch(function (e) {
                    return;
                });
            });  
        }

        BuscarCandidatos();
        candidControl.ejecutarConsultarPeriodoAcademico();
        candidControl.onFiltrarProgramaPorNivelFormacion();
        candidControl.ejecutarConsultarInstituciones();
        candidControl.ejecutarConsultarMediosDifusion();
        candidControl.ejecutarConsultarMediosDeCaptura();
        candidControl.ejecutarConsultarTodosBarrios();
        onConsultarProgramas();
    }

})();