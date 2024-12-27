(function () {
    'use strict';
    angular.module('mytodoApp').controller('CargaDocenteCtrl', CargaDocenteCtrl);
    CargaDocenteCtrl.$inject = ['$scope', '$location', 'cargaDocenteServices',  'ValidationService', 'localStorageService', 'utilServices', '$http', '$window', 'appConstant', 'appGenericConstant'];
    function CargaDocenteCtrl($scope, $location, cargaDocenteServices,  ValidationService, localStorageService, utilServices, $http, $window, appConstant, appGenericConstant) {
        var docenteControl = this;
        docenteControl.docenteEntity = cargaDocenteServices.docente;
        docenteControl.docenteVisor = cargaDocenteServices.docenteAux;
        docenteControl.visible = cargaDocenteServices.visible;
        docenteControl.visible.nivelEducativo = false;
        docenteControl.visible.titulo = false;
        docenteControl.visible.validaLugarNacimiento = false;
        docenteControl.visible.validaLugarRecidencia = false;
        docenteControl.docenteEntity.inscripcion = appGenericConstant.NO_MAYUS;
        docenteControl.lista = [];
        docenteControl.listaNivelFormacion = [];
        docenteControl.listaFacultades = [];
        docenteControl.listaAreaConocimiento = [];
        docenteControl.listaEstados = [];
        docenteControl.listaModalidades = [];
        docenteControl.listaHorario = [];
        docenteControl.listaReconocimiento = [];
        docenteControl.horarios = [];
        docenteControl.listaHorarioTodos = [];
        var fecha;
        var config = {};
        if (localStorageService.get('Docente') !== null) {
            var docentes = localStorageService.get('Docente');
            docenteControl.docenteEntity = docentes;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            docenteControl.docenteVisor = status;
            docenteControl.docenteVisor.active = 0;
        }

        docenteControl.options = appConstant.FILTRO_TABLAS;
        docenteControl.selectedOption = docenteControl.options[appGenericConstant.CERO];
        docenteControl.report = {selected: null};
        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO','Docente').then(function (data) {
                docenteControl.listaEstados = data;
            });
        }
        function onConsultarnivelesEducativos() {
            utilServices.buscarListaValorByCategoria('NIVEL_EDUCATIVO','Docente').then(function (data) {
                docenteControl.nivelesEducativos = data;
            });
        }
        function ConsultarTipoDocumentos() {
            utilServices.buscarListaValorByCategoria('TIPO_IDENTIFICACION','Docente').then(function (data) {
                docenteControl.lsttipodocumentos = [];
                docenteControl.lsttipodocumentos = data;
            }).catch(function (e) {
                return;
            });
        }
        function ejecutarConsultarEstadoCivil() {
            utilServices.buscarListaValorByCategoria('ESTADO_CIVIL','Docente').then(function (data) {
                docenteControl.lstestadocivil = [];
                docenteControl.lstestadocivil = data;
            }).catch(function (e) {
                return;
            });
        }

        function ejecutarConsultarGenero() {
            utilServices.buscarListaValorByCategoria('GENERO','Docente').then(function (data) {
                docenteControl.lstgenero = [];
                docenteControl.lstgenero = data;
            }).catch(function (e) {
                return;
            });
        }

        function consultarPaises() {
            cargaDocenteServices.consultarPais().then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstpais = [];
                docenteControl.docenteEntity.lgrecidencialstpais = data;
            });
        }

        function onBuscarDocente() {
            cargaDocenteServices.buscarDocente().then(function (data) {
                docenteControl.listaDocente = [];
                var docentes = [];
                angular.forEach(data, function (value, key) {
                    docentes = {
                        apellidoDocente: value.apellidoDocente,
                        nombreDocente: value.nombreDocente,
                        tipoIdentificacion: value.identificacionDocente.idTipoIdentificacion,
                        identificacion: value.identificacionDocente.identificacion,
                        nombreCompleto: (value.nombreDocente + " " + value.apellidoDocente),
                        identificacionConTipo: (value.identificacionDocente.nombreTipoIdentificacion + " " + value.identificacionDocente.identificacion),
                        estado: value.estado,
                        id: value.id,
                        idGenero: value.idGenero,
                        idEstadoCivil: value.idEstadoCivil,
                        fechaNacimiento: value.fechaNacimiento,
                        lugarResidencia: value.lugarResidencia,
                        idBarrio: value.idBarrio,
                        direccion: value.direccion,
                        email: value.email,
                        telefono: value.telefono,
                        celular: value.celular,
                        idLugarNacimientoMunicipio: value.idLugarNacimientoMunicipio,
                        idMunicipioRecidencia: value.paisDepMunResidencia.municipioDTO,
                        idPais: value.paisDepMunResidencia.paisDTO,
                        departamento: value.paisDepMunResidencia.departamentoDTO,
                        paisDeptMun: (value.paisDepMunResidencia.paisDTO.nombrePais + "-" + value.paisDepMunResidencia.departamentoDTO.nombreDepartamento + "-" + value.paisDepMunResidencia.municipioDTO.nombreMunicipio),
                        observacion: value.observacion,
                        informacionAcademica: value.informacionAcademicaDocente,
                        foto: value.idFoto,
                        nombreFoto: value.nombreArchivoFoto,
                        MunicipioNacimiento: value.paisDepMunNacimiento.municipioDTO,
                        PaisNacimiento: value.paisDepMunNacimiento.paisDTO,
                        departamentoNacimiento: value.paisDepMunNacimiento.departamentoDTO,
                        paisDeptMunNacimiento: (value.paisDepMunNacimiento.paisDTO.nombrePais + "-" + value.paisDepMunNacimiento.departamentoDTO.nombreDepartamento + "-" + value.paisDepMunNacimiento.municipioDTO.nombreMunicipio),
                        hvDocente: value.idhvDocente,
                        nombrehvDocente: value.nombreArchivohvDocente,
                        nombreUniversidad: value.nombreUniversidad
                    };
                    docenteControl.listaDocente.push(docentes);
                });
            });
        }
        docenteControl.onFocus = function (idCampo) {
            fecha = $(idCampo).val();
        };
        docenteControl.onBlur = function (idCampo) {
            $(idCampo).val(fecha);
            docenteControl.onCalcularEdad();
        };
        docenteControl.onCalcularEdad = function () {
            if (typeof docenteControl.docenteEntity.fechaNacimiento === undefined || docenteControl.docenteEntity.fechaNacimiento === null) {
                docenteControl.visible.validafechanacimiento = true;
                return;
            }

            docenteControl.visible.validafechanacimiento = false;
            docenteControl.visible.validaedad = false;
            // Si la fecha es correcta, calculamos la edad
            var values = docenteControl.docenteEntity.fechaNacimiento.split("/");
            var dia = parseInt(values[0]);
            var mes = parseInt(values[1]);
            var ano = parseInt(values[2]);
            // cogemos los valores actuales
            var fecha_hoy = new Date();
            var ahora_ano = parseInt(fecha_hoy.getYear());
            var ahora_mes = parseInt(fecha_hoy.getMonth() + 1);
            var ahora_dia = parseInt(fecha_hoy.getDate());
            // realizamos el calculo
            var edad = (ahora_ano + 1900) - ano;
            if (ahora_mes < mes) {
                edad--;
            }
            if ((mes === ahora_mes) && (ahora_dia < dia)) {
                edad--;
            }
            if (edad > 1900) {
                edad -= 1900;
            }
            docenteControl.docenteEntity.edad = edad;
        };
        docenteControl.onConsultarDepartoPorPais = function (item) {
            docenteControl.docenteEntity.lgrecidencialstdepartamentos = [];
            docenteControl.docenteEntity.lgrecidencialstmunicipios = [];
            if (item === null) {
                docenteControl.docenteEntity.idDepartamentoRecidencia = null;
                docenteControl.docenteEntity.idMunicipioRecidencia = null;
                docenteControl.visible.activomsjpaislgrecidencia = true;
                return;
            }
            if (item.id !== 5) {
                docenteControl.docenteEntity.idDepartamentoRecidencia = null;
                docenteControl.docenteEntity.idMunicipioRecidencia = null;
                docenteControl.visible.activomsjpaislgrecidencia = true;
                return;
            }
            docenteControl.visible.activomsjpaislgrecidencia = false;
            cargaDocenteServices.consultarDepartamentoPais(item).then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstdepartamentos = [];
                docenteControl.docenteEntity.lgrecidencialstdepartamentos = data;
            }).catch(function (e) {
                return;
            });
        };
        docenteControl.onConsultarMunicipioPorDepartamento = function (item) {
            if (item === null) {
                docenteControl.docenteEntity.idDepartamentoRecidencia = null;
                docenteControl.docenteEntity.idMunicipioRecidencia = null;
                docenteControl.visible.activomsjpaislgrecidencia = true;
                return;
            }
            docenteControl.visible.activomsjpaislgrecidencia = false;
            cargaDocenteServices.consultarMunicipioPorDepartamento(item).then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstmunicipios = [];
                docenteControl.docenteEntity.lgrecidencialstmunicipios = data;
            }).catch(function (e) {
                return;
            });
        };
        docenteControl.onLugarResidencia = function (item) {
            var estadorecd = false;
            if (typeof docenteControl.docenteEntity.idPais === undefined
                    || docenteControl.docenteEntity.idPais === null
                    ) {
                docenteControl.visible.activomsjpaislgrecidencia = true;
                estadorecd = true;
            }
            if (typeof docenteControl.docenteEntity.departamento === undefined
                    || docenteControl.docenteEntity.departamento === null
                    ) {
                docenteControl.visible.activomsjdepartamentorecidencia = true;
                estadorecd = true;
            }
            if (typeof docenteControl.docenteEntity.idMunicipioRecidencia === undefined
                    || docenteControl.docenteEntity.idMunicipioRecidencia === null) {
                docenteControl.visible.activomsjmunicipiorecidencia = true;
                estadorecd = true;
            }
            if (estadorecd === true) {
                return;
            }
            docenteControl.docenteEntity.nombreResidencia = docenteControl.docenteEntity.idPais.nombrePais
                    + ' - ' + docenteControl.docenteEntity.departamento.nombreDepartamento
                    + ' - ' + docenteControl.docenteEntity.idMunicipioRecidencia.nombreMunicipio;
            docenteControl.visible.validalugarresidencia = false;
            $("#modallugarrecidenciaacudiente").hide();
            cargaDocenteServices.consultarBarrios(docenteControl.docenteEntity.idMunicipioRecidencia).then(function (data) {
                docenteControl.docenteEntity.listaBarrios = [];
                docenteControl.docenteEntity.listaBarrios = data;
            }).catch(function (e) {
                return;
            });
        };
        // metodo para componente de lugar de naciomiento
        docenteControl.onConsultarDepartoPorPaisNacimiento = function (item) {
            docenteControl.docenteEntity.lgrecidencialstdepartamentosNacimiento = [];
            docenteControl.docenteEntity.lgrecidencialstmunicipiosNacimiento = [];
            if (item === null) {
                docenteControl.docenteEntity.idDepartamentoRecidenciaNacimiento = null;
                docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento = null;
                docenteControl.visible.activomsjpaislgrecidenciaNacimiento = true;
                return;
            }
            if (item.id !== 5) {
                docenteControl.docenteEntity.idDepartamentoRecidenciaNacimiento = null;
                docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento = null;
                docenteControl.visible.activomsjpaislgrecidenciaNacimiento = true;
                return;
            }
            docenteControl.visible.activomsjpaislgrecidenciaNacimiento = false;
            cargaDocenteServices.consultarDepartamentoPais(item).then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstdepartamentosNacimiento = [];
                docenteControl.docenteEntity.lgrecidencialstdepartamentosNacimiento = data;
            }).catch(function (e) {
                return;
            });
        };

        docenteControl.onConsultarMunicipioPorDepartamentoNacimiento = function (item) {
            if (item === null) {
                docenteControl.docenteEntity.idDepartamentoRecidenciaNacimiento = null;
                docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento = null;
                docenteControl.visible.activomsjpaislgrecidenciaNacimiento = true;
                return;
            }
            docenteControl.visible.activomsjpaislgrecidenciaNacimiento = false;
            cargaDocenteServices.consultarMunicipioPorDepartamento(item).then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstmunicipiosNacimiento = [];
                docenteControl.docenteEntity.lgrecidencialstmunicipiosNacimiento = data;
            }).catch(function (e) {
                return;
            });
        };

        docenteControl.onLugarNacimiento = function (item) {
            var estadorecd = false;
            if (typeof docenteControl.docenteEntity.idPaisNacimiento === undefined
                    || docenteControl.docenteEntity.idPaisNacimiento === null
                    ) {
                docenteControl.visible.activomsjpaislgrecidenciaNacimiento = true;
                estadorecd = true;
            }
            if (typeof docenteControl.docenteEntity.departamentoNacimiento === undefined
                    || docenteControl.docenteEntity.departamentoNacimiento === null
                    ) {
                docenteControl.visible.activomsjdepartamentorecidenciaNacimiento = true;
                estadorecd = true;
            }
            if (typeof docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento === undefined
                    || docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento === null) {
                docenteControl.visible.activomsjmunicipiorecidenciaNacimiento = true;
                estadorecd = true;
            }
            if (estadorecd === true) {
                return;
            }
            docenteControl.docenteEntity.nombreResidenciaNacimiento = docenteControl.docenteEntity.idPaisNacimiento.nombrePais
                    + ' - ' + docenteControl.docenteEntity.departamentoNacimiento.nombreDepartamento
                    + ' - ' + docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento.nombreMunicipio;
            docenteControl.visible.validalugarresidenciaNacimiento = false;
            $("#modallugarrecidenciaacudienteNacimiento").hide();
        };

        //fin del metodo
        docenteControl.validadNivelTitulo = function () {
            if (typeof docenteControl.docenteEntity.nivelEducativo === undefined
                    || docenteControl.docenteEntity.nivelEducativo === null) {
                docenteControl.visible.nivelEducativo = true;
            } else {
                docenteControl.visible.nivelEducativo = false;
            }
            if (typeof docenteControl.docenteEntity.titulo === undefined
                    || docenteControl.docenteEntity.titulo === null) {
                docenteControl.visible.titulo = true;
            } else {
                docenteControl.visible.titulo = false;
            }
        };

        docenteControl.validadLugar = function () {
            if (typeof docenteControl.docenteEntity.nombreResidenciaNacimiento === undefined
                    || docenteControl.docenteEntity.nombreResidenciaNacimiento === null) {
                docenteControl.visible.validaLugarNacimiento = true;
            } else {
                docenteControl.visible.validaLugarNacimiento = false;
            }
            if (typeof docenteControl.docenteEntity.nombreResidencia === undefined
                    || docenteControl.docenteEntity.nombreResidencia === null) {
                docenteControl.visible.validaLugarRecidencia = true;
            } else {
                docenteControl.visible.validaLugarRecidencia = false;
            }
        };

        docenteControl.agregarInfoAcade = function (file) {
            if ((typeof docenteControl.docenteEntity.nivelEducativo !== undefined && docenteControl.docenteEntity.nivelEducativo !== null) &&
                    (typeof docenteControl.docenteEntity.titulo !== undefined && docenteControl.docenteEntity.titulo !== null)) {
                var documento = docenteControl.itemSoporte;
                docenteControl.agregarInfoAcadeSoporte(file, documento);
            }
        };

        docenteControl.agregarInfoAcadeSoporte = function (file, documento) {
            var esta = false;
            var informacionAcademica = [];
            if (typeof docenteControl.listaIformacionAcademica === undefined || docenteControl.listaIformacionAcademica === null) {
                docenteControl.listaIformacionAcademica = [];
            }
            docenteControl.validadNivelTitulo();
            if ((typeof docenteControl.docenteEntity.nivelEducativo !== undefined && docenteControl.docenteEntity.nivelEducativo !== null) &&
                    (typeof docenteControl.docenteEntity.titulo !== undefined && docenteControl.docenteEntity.titulo !== null)) {
                informacionAcademica = {
                    idNivelEducativo: docenteControl.docenteEntity.nivelEducativo.codigo,
                    nivelEducativo: docenteControl.docenteEntity.nivelEducativo.valor,
                    titulo: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.titulo),
                    aniosExperiencia: docenteControl.docenteEntity.experiencia = docenteControl.docenteEntity.experiencia === " " || docenteControl.docenteEntity.experiencia === undefined ||
                            docenteControl.docenteEntity.experiencia === null ? "" : docenteControl.docenteEntity.experiencia,
                    idDocumento: documento,
                    nombreDocumento: file.name
                };
                angular.forEach(docenteControl.docenteEntity.listaIformacionAcademica, function (value, key) {
                    if (informacionAcademica.idNivelEducativo === value.idNivelEducativo &&
                            informacionAcademica.titulo === value.titulo) {
                        esta = true;
                    }
                });
            }
            if (esta) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_NIVEL_TITULO);
            } else {
                if (typeof docenteControl.docenteEntity.listaIformacionAcademica !== undefined && docenteControl.docenteEntity.listaIformacionAcademica !== null) {
                    docenteControl.docenteEntity.listaIformacionAcademica.push(informacionAcademica);
                    docenteControl.docenteEntity.nivelEducativo = null;
                    docenteControl.docenteEntity.titulo = null;
                    docenteControl.docenteEntity.aniosExperiencia = null;
                    docenteControl.docenteEntity.nombreDocumento = null;
                } else {
                    docenteControl.listaIformacionAcademica.push(informacionAcademica);
                    docenteControl.docenteEntity.listaIformacionAcademica = docenteControl.listaIformacionAcademica;
                    docenteControl.docenteEntity.nivelEducativo = null;
                    docenteControl.docenteEntity.titulo = null;
                    docenteControl.docenteEntity.aniosExperiencia = null;
                    docenteControl.docenteEntity.nombreDocumento = null;
                }
            }
        };
        docenteControl.retirarInfoAcade = function (item) {
            docenteControl.report.selected.length = null;
            var index = docenteControl.docenteEntity.listaIformacionAcademica.indexOf(item);
            docenteControl.docenteEntity.listaIformacionAcademica.splice(index, 1);
        };
        docenteControl.modificarInfoAcade = function (item) {
            docenteControl.report.selected.length = null;
            var index = docenteControl.docenteEntity.listaIformacionAcademica.indexOf(item);
            docenteControl.docenteEntity.listaIformacionAcademica.splice(index, 1);
        };
        //subir fotos docente  
        docenteControl.uploadPhoto = function (file) {
            var nombreArchivo = file.name;
            docenteControl.itemFoto = [];
            var urlRequest = cargaDocenteServices.subirarchivos();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(urlRequest, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (response) {
                docenteControl.itemFoto.push(response.message);
                docenteControl.itemFoto.push(nombreArchivo);
                getIdFoto(docenteControl.itemFoto);
            }).error(function () {
            });
        };
        //subir soportes academicos
        docenteControl.uploadSoporteAcademico = function (file) {
            docenteControl.item = [];
            var urlRequest = cargaDocenteServices.subirSoporte();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(urlRequest, fd, {transformRequest: angular.identity,
                headers: {'Content-Type': undefined
                }
            }).success(function (response) {
                docenteControl.item.push(response.message);
                getIdSoporte(docenteControl.item[appGenericConstant.CERO]);
            }).error(function () {
            });
        };
        //upload hv docente
        docenteControl.uploadSoporteHv = function (file) {
            var nombreArchivo = file.name;
            docenteControl.itemhv = [];
            var urlRequest = cargaDocenteServices.subirHvDocente();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(urlRequest, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined
                }
            }).success(function (response) {
                docenteControl.itemhv.push(response.message);
                docenteControl.itemhv.push(nombreArchivo);
                getIdHvDocente(docenteControl.itemhv);
            }).error(function () {
            });
        };
        docenteControl.downloadSoporteHv = function (item) {
            if (item.id !== null || item.id !== undefined) {
                var file = cargaDocenteServices.descargaHv(item.id);
                if (file !== null && item !== null && item !== undefined) {
                    $window.location.href = file;
                }
            }
        };
        docenteControl.downloadSoporteAcademico = function (item) {
            if (item.idDocumento !== null || item.idDocumento !== undefined) {
                var file = cargaDocenteServices.downloadArchivo(item.idDocumento);
                if (file !== null && item !== null && item !== undefined) {
                    $window.location.href = file;
                }
            }
        };
        docenteControl.downloadFoto = function (item) {
            if (item !== null || item !== undefined) {
                var file = cargaDocenteServices.downloadFoto(item);
                if (file !== null && item !== null && item !== undefined) {
                    docenteControl.docenteEntity.foto = file;
                }
            }
        };
        function getIdFoto(itemIdFoto) {
            docenteControl.itemArchivoFoto = null;
            docenteControl.itemArchivoFoto = itemIdFoto[appGenericConstant.CERO];
            docenteControl.itemNombreFoto = null;
            docenteControl.itemNombreFoto = itemIdFoto[1];
        }
        function getIdSoporte(itemId) {
            docenteControl.itemSoporte = "";
            docenteControl.itemSoporte = itemId;
        }
        function getIdHvDocente(itemHv) {
            docenteControl.itemHvDocente = null;
            docenteControl.itemHvDocente = itemHv[appGenericConstant.CERO];
            docenteControl.itemNombreHvDocente = null;
            docenteControl.itemNombreHvDocente = itemHv[1];
        }

        docenteControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarDocente.formAgregarInformacionGeneral)) {
                if (new ValidationService().checkFormValidity($scope.formAgregarDocente.formConfiguracion)) {
                    docenteControl.onNewRegistryDocente();
                } else {
                    docenteControl.docenteVisor.active = 1;
                }
            } else {
                docenteControl.docenteVisor.active = appGenericConstant.CERO;
            }
        };
        docenteControl.onLimpiarRegistro = function () {
            docenteControl.docenteVisor.onDeshabilitar = false;
            docenteControl.docenteVisor.onDeshabilitarCodigos = false;
            docenteControl.docenteVisor.onDeshabilitarCampoEstado = true;
            docenteControl.docenteVisor.onDeshabilitarValidacion = '';
            docenteControl.docenteVisor.titulo = appGenericConstant.AGREGAR_DOCENTE;
            docenteControl.docenteEntity.id = '';
            docenteControl.docenteEntity.codigo = '';
            docenteControl.docenteEntity.nombredocente = '';
            docenteControl.docenteEntity.identificacion = '';
            docenteControl.docenteEntity.estado = null;
            docenteControl.docenteEntity.fechaNacimiento = '';
            docenteControl.docenteEntity.profecion = '';
            docenteControl.docenteEntity.duracion = null;
            docenteControl.docenteEntity = {};
            localStorageService.set('Docente', {});
            localStorageService.remove('status');
            localStorageService.set('status', docenteControl.docenteVisor);
        };
        docenteControl.onNewRegistryDocente = function () {
            if (typeof docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento === undefined || docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento === null) {
                docenteControl.validadLugar();
                docenteControl.docenteVisor.active = appGenericConstant.CERO;
            } else if (typeof docenteControl.docenteEntity.idMunicipioRecidencia === undefined || docenteControl.docenteEntity.idMunicipioRecidencia === null) {
                docenteControl.validadLugar();
                docenteControl.docenteVisor.active = 1;
            } else {
                docenteControl.validadLugar();
                if (docenteControl.docenteEntity.id === null || typeof docenteControl.docenteEntity.id === undefined) {
                    var newDocente =
                            {
                                id: null,
                                identificacionDocente: {
                                    idTipoIdentificacion: docenteControl.docenteEntity.idTipoIdentificacion,
                                    identificacion: docenteControl.docenteEntity.identificacion
                                },
                                idGenero: docenteControl.docenteEntity.idGenero,
                                idEstadoCivil: docenteControl.docenteEntity.idEstadoCivil,
                                nombreDocente: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.nombre),
                                apellidoDocente: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.apellido),
                                fechaNacimiento: toDate(docenteControl.docenteEntity.fechaNacimiento),
                                estado: 'ACTIVO',
                                lugarResidencia: docenteControl.docenteEntity.lugarResidencia,
                                idBarrio: docenteControl.docenteEntity.idBarrio,
                                direccion: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.direccion),
                                email: docenteControl.docenteEntity.email,
                                telefono: docenteControl.docenteEntity.telefono,
                                celular: docenteControl.docenteEntity.celular,
                                idLugarNacimientoMunicipio: docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento.id,
                                idLugarResidenciaMunicipio: docenteControl.docenteEntity.idMunicipioRecidencia.id,
                                observacion: docenteControl.docenteEntity.observacion,
                                informacionAcademicaDocente: docenteControl.docenteEntity.listaIformacionAcademica,
                                idFoto: docenteControl.itemArchivoFoto,
                                nombreArchivoFoto: docenteControl.itemNombreFoto,
                                idhvDocente: docenteControl.itemHvDocente,
                                nombreArchivohvDocente: docenteControl.itemNombreHvDocente
                            };
                    if (typeof docenteControl.docenteEntity.listaIformacionAcademica !== undefined && docenteControl.docenteEntity.listaIformacionAcademica !== null
                            && docenteControl.docenteEntity.listaIformacionAcademica.length !== appGenericConstant.CERO) {
                        cargaDocenteServices.agregarDocente(newDocente).then(function (response) {
                            switch (response.tipo) {
                                case 200:
                                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                                    docenteControl.onLimpiarRegistro();
                                    break;
                                case 409:
                                    MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                                    break;
                                case 500:
                                    MSG_GROWL_ERROR();
                                    break;
                            }
                        });
                    } else {
                        docenteControl.docenteVisor.active = 2;
                        MSG_GROWL_ADVERTENCIA(appGenericConstant.AGREGAR_REGISTRO_INFORMACION_ACADEMICA);
                    }
                } else {
                    var updateDocente =
                            {
                                id: docenteControl.docenteEntity.id,
                                identificacionDocente: {
                                    idTipoIdentificacion: docenteControl.docenteEntity.idTipoIdentificacion,
                                    identificacion: docenteControl.docenteEntity.identificacion
                                },
                                idGenero: docenteControl.docenteEntity.idGenero,
                                idEstadoCivil: docenteControl.docenteEntity.idEstadoCivil,
                                nombreDocente: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.nombre),
                                apellidoDocente: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.apellido),
                                fechaNacimiento: toDate(docenteControl.docenteEntity.fechaNacimiento),
                                estado: docenteControl.docenteEntity.estado,
                                lugarResidencia: docenteControl.docenteEntity.lugarResidencia,
                                idBarrio: docenteControl.docenteEntity.idBarrio,
                                direccion: appConstant.VALIDAR_STRING(docenteControl.docenteEntity.direccion),
                                email: docenteControl.docenteEntity.email,
                                telefono: docenteControl.docenteEntity.telefono,
                                celular: docenteControl.docenteEntity.celular,
                                idLugarNacimientoMunicipio: docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento.id,
                                idLugarResidenciaMunicipio: docenteControl.docenteEntity.idMunicipioRecidencia.id,
                                observacion: docenteControl.docenteEntity.observacion,
                                informacionAcademicaDocente: docenteControl.docenteEntity.listaIformacionAcademica,
                                idFoto: docenteControl.itemArchivoFoto !== null ? docenteControl.itemArchivoFoto : docenteControl.docenteEntity.foto,
                                nombreArchivoFoto: docenteControl.itemNombreFoto !== null ? docenteControl.itemNombreFoto : docenteControl.docenteEntity.nombreFoto,
                                idhvDocente: docenteControl.itemHvDocente !== null ? docenteControl.itemHvDocente : docenteControl.docenteEntity.hvDocente,
                                nombreArchivohvDocente: docenteControl.itemNombreHvDocente !== null ? docenteControl.itemNombreHvDocente : docenteControl.docenteEntity.nombrehvDocente
                            };
                    cargaDocenteServices.actualizarDocente(updateDocente).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                            localStorageService.set('Docente', docenteControl.docenteEntity);
                        } else if (data.tipo === 500) {
                            MSG_GROWL_ERROR();
                        } else {
                            //    growl.warning("<div><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>Alto Ahí </strong>  Ya existe un programa académico con este código </div>");
                        }
                    });
                }
            }

        };
        docenteControl.onClickToView = function (item) {
            docenteControl.docenteEntity = {};
            docenteControl.docenteVisor.titulo = appGenericConstant.VER_DOCENTE;
            docenteControl.docenteVisor.onDeshabilitar = true;
            docenteControl.docenteVisor.onDeshabilitarCodigos = true;
            docenteControl.docenteVisor.onDeshabilitarCampoEstado = false;
            docenteControl.docenteEntity.idTipoIdentificacion = item.tipoIdentificacion;
            docenteControl.docenteEntity.identificacion = item.identificacion;
            docenteControl.docenteEntity.idGenero = item.idGenero;
            docenteControl.docenteEntity.idEstadoCivil = item.idEstadoCivil;
            docenteControl.docenteEntity.nombre = item.nombreDocente;
            docenteControl.docenteEntity.apellido = item.apellidoDocente;
            docenteControl.docenteEntity.fechaNacimiento = onDate(item.fechaNacimiento);
            docenteControl.docenteEntity.estado = item.estado;
            docenteControl.docenteEntity.lugarResidencia = item.lugarResidencia;
            docenteControl.docenteEntity.idBarrio = item.idBarrio;
            docenteControl.docenteEntity.direccion = item.direccion;
            docenteControl.docenteEntity.email = item.email;
            docenteControl.docenteEntity.telefono = item.telefono;
            docenteControl.docenteEntity.celular = item.celular;
            docenteControl.docenteEntity.idLugarNacimientoMunicipio = item.idLugarNacimientoMunicipio;
            docenteControl.docenteEntity.idMunicipioRecidencia = item.idMunicipioRecidencia;
            docenteControl.docenteEntity.idPais = item.idPais;
            docenteControl.docenteEntity.departamento = item.departamento;
            docenteControl.docenteEntity.nombreResidencia = item.paisDeptMun;
            docenteControl.docenteEntity.observacion = item.observacion;
            docenteControl.docenteEntity.idPaisNacimiento = item.PaisNacimiento;
            docenteControl.docenteEntity.departamentoNacimiento = item.departamentoNacimiento;
            docenteControl.docenteEntity.nombreResidenciaNacimiento = item.paisDeptMunNacimiento;
            docenteControl.docenteEntity.listaIformacionAcademica = mostrarInformacionAcademica(item.informacionAcademica);
            docenteControl.docenteEntity.foto = item.foto;
            docenteControl.docenteEntity.nombreArchivoFoto = item.nombreFoto;
            docenteControl.docenteEntity.idhvDocente = item.itemHvDocente;
            docenteControl.docenteEntity.nombreArchivohvDocente = item.itemNombreHvDocente;
            docenteControl.docenteEntity.hv = {
                name: docenteControl.docenteEntity.nombreArchivohvDocente,
                id: docenteControl.docenteEntity.idhvDocente
            };
            docenteControl.onCalcularEdad();
            cargaDocenteServices.consultarBarrios(docenteControl.docenteEntity.idMunicipioRecidencia).then(function (data) {
                docenteControl.docenteEntity.listaBarrios = data;
                localStorageService.set('Docente', docenteControl.docenteEntity);
                localStorageService.set('status', docenteControl.docenteVisor);
                $location.path('/cud-docente');
            });
        };
        docenteControl.onClickToEditar = function (item) {
            docenteControl.docenteVisor.titulo = appGenericConstant.MODIFICAR_DOCENTE;
            docenteControl.docenteVisor.onDeshabilitar = false;
            docenteControl.docenteVisor.onDeshabilitarCodigos = true;
            docenteControl.docenteVisor.onDeshabilitarCampoEstado = false;
            docenteControl.docenteVisor.onDeshabilitarValidacion = 'required';
            cargaDocenteServices.consultarDepartamentoPais(item.idPais).then(function (data) {
                docenteControl.docenteEntity.lgrecidencialstdepartamentos = [];
                docenteControl.docenteEntity.lgrecidencialstdepartamentos = data;
                cargaDocenteServices.consultarMunicipioPorDepartamento(item.departamento).then(function (data) {
                    docenteControl.docenteEntity.lgrecidencialstmunicipios = [];
                    docenteControl.docenteEntity.lgrecidencialstmunicipios = data;
                    cargaDocenteServices.consultarDepartamentoPais(item.PaisNacimiento).then(function (data) {
                        docenteControl.docenteEntity.lgrecidencialstdepartamentosNacimiento = [];
                        docenteControl.docenteEntity.lgrecidencialstdepartamentosNacimiento = data;
                        cargaDocenteServices.consultarMunicipioPorDepartamento(item.departamentoNacimiento).then(function (data) {
                            docenteControl.docenteEntity.lgrecidencialstmunicipiosNacimiento = [];
                            docenteControl.docenteEntity.lgrecidencialstmunicipiosNacimiento = data;
                            docenteControl.docenteEntity.id = item.id;
                            docenteControl.docenteEntity.idTipoIdentificacion = item.tipoIdentificacion;
                            docenteControl.docenteEntity.identificacion = item.identificacion;
                            docenteControl.docenteEntity.idGenero = item.idGenero;
                            docenteControl.docenteEntity.idEstadoCivil = item.idEstadoCivil;
                            docenteControl.docenteEntity.nombre = item.nombreDocente;
                            docenteControl.docenteEntity.apellido = item.apellidoDocente;
                            docenteControl.docenteEntity.fechaNacimiento = onDate(item.fechaNacimiento);
                            docenteControl.docenteEntity.estado = item.estado;
                            docenteControl.docenteEntity.lugarResidencia = item.lugarResidencia;
                            docenteControl.docenteEntity.idBarrio = item.idBarrio;
                            docenteControl.docenteEntity.direccion = item.direccion;
                            docenteControl.docenteEntity.email = item.email;
                            docenteControl.docenteEntity.telefono = item.telefono;
                            docenteControl.docenteEntity.celular = item.celular;
                            docenteControl.docenteEntity.idMunicipioRecidenciaNacimiento = item.MunicipioNacimiento;
                            docenteControl.docenteEntity.idMunicipioRecidencia = item.idMunicipioRecidencia;
                            docenteControl.docenteEntity.idPais = item.idPais;
                            docenteControl.docenteEntity.departamento = item.departamento;
                            docenteControl.docenteEntity.nombreResidencia = item.paisDeptMun;
                            docenteControl.docenteEntity.observacion = item.observacion;
                            docenteControl.docenteEntity.idPaisNacimiento = item.PaisNacimiento;
                            docenteControl.docenteEntity.departamentoNacimiento = item.departamentoNacimiento;
                            docenteControl.docenteEntity.nombreResidenciaNacimiento = item.paisDeptMunNacimiento;
                            docenteControl.docenteEntity.listaIformacionAcademica = mostrarInformacionAcademica(item.informacionAcademica);
                            docenteControl.docenteEntity.idFoto = item.foto;
                            docenteControl.docenteEntity.nombreArchivoFoto = item.nombreFoto;
                            docenteControl.docenteEntity.idhvDocente = item.hvDocente;
                            docenteControl.docenteEntity.nombreArchivohvDocente = item.nombrehvDocente;
                            docenteControl.docenteEntity.hv = {
                                name: docenteControl.docenteEntity.nombreArchivohvDocente,
                                id: docenteControl.docenteEntity.idhvDocente
                            };
                            docenteControl.downloadFoto(docenteControl.docenteEntity.idFoto);
                            docenteControl.onCalcularEdad();
                            cargaDocenteServices.consultarBarrios(docenteControl.docenteEntity.idMunicipioRecidencia).then(function (data) {
                                docenteControl.docenteEntity.listaBarrios = data;
                                localStorageService.set('Docente', docenteControl.docenteEntity);
                                localStorageService.set('status', docenteControl.docenteVisor);
                                $location.path('/cud-docente');
                            });
                        });
                    });
                });
            });
        };
        function mostrarInformacionAcademica(info) {
            var lista = [];
            var listaRetorno = [];
            angular.forEach(info, function (value, key) {
                lista = {
                    idNivelEducativo: value.idNivelEducativo,
                    nivelEducativo: value.nombreNivelEducativo,
                    titulo: value.titulo,
                    aniosExperiencia: value.aniosExperiencia,
                    nombreDocumento: value.nombreDocumento,
                    idDocumento: value.idDocumento
                };
                listaRetorno.push(lista);
            });
            return listaRetorno;
        }

        docenteControl.onClickToDelete = function (item) {
            docenteControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PROGRAMA_ACADEMICO, 
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION, showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    cargaDocenteServices.eliminarDocente(item.id).then(function (response) {
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
                        docenteControl.report.selected.length = null;
                    });
                } else {
                    docenteControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        docenteControl.onClickToDeleteMasivo = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.PRG_ELIMINAR_PROGRAMAS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    angular.forEach(docenteControl.report.selected, function (value, key) {
                        listaElementosEliminar.push(value.id);
                    });
                    cargaDocenteServices.eliminarDocenteMasivo(listaElementosEliminar).then(function (response) {
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
                        docenteControl.report.selected.length = null;
                        onConsultarProgramas();
                    });
                } else {

                    docenteControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        docenteControl.scrits = function () {

            $('.input-group.date').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                startDate: '01/01/1900',
                endDate: new Date()
            });
            $("#tabs").tabs();
            $(function () {
                "use strict";
                $('.input-switch').bootstrapSwitch();
            });
        };
        ConsultarTipoDocumentos();
        ejecutarConsultarEstadoCivil();
        ejecutarConsultarGenero();
        onConsultarListaEstados();
        consultarPaises();
        onConsultarnivelesEducativos();
        onBuscarDocente();

    }

    function toDate(dateStr) {
        if (typeof dateStr === undefined || dateStr === null) {
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
        if (typeof date === undefined || date === null) {
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




