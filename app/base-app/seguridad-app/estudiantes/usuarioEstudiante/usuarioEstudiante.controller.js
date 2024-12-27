(function () {
    'use strict';
    angular.module('mytodoApp').controller('UsuarioEstudianteCtrl', UsuarioEstudianteCtrl);
    UsuarioEstudianteCtrl.$inject = ['$scope', '$location', 'usuarioEstudianteEntitiesServices', 'ValidationService', 'localStorageService', '$http', 'appConstant', 'utilServices', 'appGenericConstant'];
    function UsuarioEstudianteCtrl($scope, $location, usuarioEstudianteEntitiesServices, ValidationService, localStorageService, $http, appConstant, utilServices, appGenericConstant) {
        var usuarioControl = this;
        usuarioControl.usuarioEntity = usuarioEstudianteEntitiesServices.usuario;
        usuarioControl.usuarioVisor = usuarioEstudianteEntitiesServices.usuarioAux;
        usuarioControl.visible = usuarioEstudianteEntitiesServices.visible;
        usuarioControl.visible.validoemail = false;
        usuarioControl.visible.passError = false;
        usuarioControl.visible.validarPass = false;
        usuarioControl.usuarioEntity.activarCamara = false;
        usuarioControl.usuarioEntity.subirfoto = false;
        usuarioControl.lista = [];
        usuarioControl.listaEstados = [];
        var _video = null,
                patData = null;
        $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
        $scope.channel = {};
        $scope.webcamError = false;
        $scope.onError = function (err) {
            $scope.$apply(
                    function () {
                        $scope.webcamError = err;
                    }
            );
        };
        usuarioControl.TomarFoto = function () {
            usuarioControl.usuarioEntity.foto = null;
            usuarioControl.usuarioEntity.activarCamara = true;
            usuarioControl.usuarioEntity.subirfoto = false;
            $scope.width = '200px';
        };
        $scope.onSuccess = function () {
            $scope.channel.video.height = 150;
            $scope.channel.video.width = 200;
            _video = $scope.channel.video;
            $scope.$apply(function () {
                $scope.patOpts.w = _video.width;
                $scope.patOpts.h = _video.height;
            });
        };
        $scope.onStream = function (stream) {
        };
        $scope.makeSnapshot = function () {
            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas)
                    return;
                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');
                var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);
                sendSnapshotToServer(patCanvas.toDataURL());
                var blob = dataURItoBlob(patCanvas.toDataURL());
                var imagen = new File([blob], "retrato", {type: "image/png"});
                usuarioControl.usuarioEntity.foto = imagen;
                patData = idata;
            }
            usuarioControl.uploadPhoto(usuarioControl.usuarioEntity.foto);
        };
        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type: mimeString});
        }

        $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
            window.location.href = dataURL;
        };
        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };
        var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
            $scope.snapshotData = imgBase64;
        };
        var fecha;
        var config = {};
        if (localStorageService.get('Usuario') !== null) {
            var usuarios = localStorageService.get('Usuario');
            usuarioControl.usuarioEntity = usuarios;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            usuarioControl.usuarioVisor = status;
            usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
        }

        usuarioControl.options = appConstant.FILTRO_TABLAS;
        usuarioControl.selectedOption = usuarioControl.options[appConstant.CERO];
        usuarioControl.report = {selected: null};
        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', appGenericConstant.MICRO_SERVICIO_USUARIO).then(function (data) {
                usuarioControl.listaEstados = data;
            });
        }
        function ConsultarTipoDocumentos() {
            utilServices.buscarListaValorByCategoria('TIPO_IDENTIFICACION', appGenericConstant.MICRO_SERVICIO_USUARIO).then(function (data) {
                usuarioControl.lsttipodocumentos = [];
                usuarioControl.lsttipodocumentos = data;
            }).catch(function (e) {
                throw e;
                return;
            });
        }
        function ejecutarConsultarEstadoCivil() {
            utilServices.buscarListaValorByCategoria('ESTADO_CIVIL', appGenericConstant.MICRO_SERVICIO_USUARIO).then(function (data) {
                usuarioControl.lstestadocivil = [];
                usuarioControl.lstestadocivil = data;
            }).catch(function (e) {
                throw e;
                return;
            });
        }

        function ejecutarConsultarGenero() {
            utilServices.buscarListaValorByCategoria('GENERO', appGenericConstant.MICRO_SERVICIO_USUARIO).then(function (data) {
                usuarioControl.lstgenero = [];
                usuarioControl.lstgenero = data;
            }).catch(function (e) {
                throw e;
                return;
            });
        }

        function onConsultarCargos() {
            usuarioEstudianteEntitiesServices.cargarListaCargo().then(function (data) {
                usuarioControl.usuarioEntity.listaCargo = [];
                usuarioControl.usuarioEntity.listaCargo = data;
            });
        }

        function onBuscarUsuario() {
            if ($location.path() === '/usuario-estudiante') {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
            }
            usuarioEstudianteEntitiesServices.buscarUsuario().then(function (data) {
                usuarioControl.listaUsuario = [];
                var usuarios = [];
                angular.forEach(data, function (value, key) {
                    usuarios = {
                        apellidoFuncionario: value.apellidoEstudiante,
                        nombreFuncionario: value.nombreEstudiante,
                        tipoIdentificacion: value.identificacionEstudiante.idTipoIdentificacion,
                        identificacion: value.identificacionEstudiante.identificacion,
                        nombreCompleto: (value.nombreEstudiante+ " " + value.apellidoEstudiante),
                        identificacionConTipo: (value.identificacionEstudiante.nombreTipoIdentificacion + " " + value.identificacionEstudiante.identificacion),
                        estado: value.estado,
                        id: value.id,
                        idGenero: value.idGenero,
                        idEstadoCivil: value.idEstadoCivil,
                        idBarrio: value.idBarrio,
                        email: value.email,
                        telefono: value.telefono,
                        foto: value.idFoto,
                        nombreFoto: value.nombreArchivoFoto,
                        celular: value.celular,
                        fechaNacimiento: value.fechaNacimiento,
                        idCargo: value.idCargo,
                        nombreCargo: value.cargo,
                        direccion: value.direccion,
                        usuarioSistema: value.usuario !== null ? value.usuario.userName : 'NO-USER'
                    };
                    usuarioControl.listaUsuario.push(usuarios);
                });
                appConstant.CERRAR_SWAL();
            });
        }
        usuarioControl.onFocus = function (idCampo) {
            fecha = $(idCampo).val();
        };
        usuarioControl.onBlur = function (idCampo) {
            $(idCampo).val(fecha);
            usuarioControl.onCalcularEdad();
        };
        usuarioControl.onCalcularEdad = function () {
            if (typeof usuarioControl.usuarioEntity.fechaNacimiento === appGenericConstant.INDEFINIDO || usuarioControl.usuarioEntity.fechaNacimiento === null) {
                usuarioControl.visible.validafechanacimiento = true;
                return;
            }
            usuarioControl.visible.validafechanacimiento = false;
            usuarioControl.visible.validaedad = false;
            // Si la fecha es correcta, calculamos la edad
            var values = usuarioControl.usuarioEntity.fechaNacimiento.split("/");
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
            usuarioControl.usuarioEntity.edad = edad;
        };
        usuarioControl.uploadPhoto = function (file) {
            if (file.name !== appGenericConstant.INDEFINIDO) {
                var nombreArchivo = file.name;
                usuarioControl.itemFoto = [];
                var urlRequest = usuarioEstudianteEntitiesServices.subirarchivos();
                var fd = new FormData();
                fd.append('file', file);
                $http.post(urlRequest, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (response) {
                    usuarioControl.itemFoto.push(response.message);
                    usuarioControl.itemFoto.push(nombreArchivo);
                    getIdFoto(usuarioControl.itemFoto);
                }).error(function () {
                });
                if (usuarioControl.usuarioEntity.foto !== null || usuarioControl.usuarioEntity.foto !== appGenericConstant.INDEFINIDO) {
                    usuarioControl.usuarioEntity.subirfoto = true;
                }
            } else {
                var urlRequest = usuarioEstudianteEntitiesServices.subirarchivos();
                $http.post(urlRequest, file);
            }
        };
        usuarioControl.quitarAchivo = function () {
            usuarioControl.usuarioEntity.foto = null;
            usuarioControl.usuarioEntity.subirfoto = false;
            usuarioControl.usuarioEntity.activarCamara = false;
            $scope.width = '97px';
        };
        usuarioControl.downloadFoto = function (item) {
            try {
                if (item.idDocumento !== null || item.idDocumento !== appGenericConstant.INDEFINIDO) {
                    var file = usuarioEstudianteEntitiesServices.downloadFoto(item);
                    if (file !== null && item !== null && item !== undefined) {
                        usuarioControl.usuarioEntity.foto = file;
                        usuarioControl.usuarioEntity.activarCamara = false;
                        usuarioControl.usuarioEntity.subirfoto = true;
                    }
                }
            } catch (e) {
                return;
            }
        };
        function getIdFoto(itemIdFoto) {
            usuarioControl.itemArchivoFoto = null;
            usuarioControl.itemArchivoFoto = itemIdFoto[0];
            usuarioControl.itemNombreFoto = null;
            usuarioControl.itemNombreFoto = itemIdFoto[1];
        }

        usuarioControl.onSubmitForm = function () {
            usuarioControl.validarTel();
            usuarioControl.validarcel();
            if (new ValidationService().checkFormValidity($scope.formAgregarUsuario.formAgregarInformacionGeneral)) {
                if (new ValidationService().checkFormValidity($scope.formAgregarUsuario.formConfiguracion)) {
                    usuarioControl.onNewRegistryUsuario();
                } else {
                    usuarioControl.usuarioVisor.active = appGenericConstant.UNO;
                }
            } else {
                usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
            }
        };
        usuarioControl.validarTel = function () {
            if (usuarioControl.usuarioEntity.telefono === appGenericConstant.INDEFINIDO
                    || usuarioControl.usuarioEntity.telefono === null) {
                usuarioControl.visible.validotelefonosize = true;
                usuarioControl.visible.validoTelmessage = appGenericConstant.CAMPO_REQUERIDO;
                usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
            } else if (usuarioControl.usuarioEntity.telefono.length !== appGenericConstant.OCHO) {
                usuarioControl.visible.validoTelmessage = appGenericConstant.CAMPO_REQUIERE_NUMEROS_OCHO;
                usuarioControl.visible.validotelefonosize = true;
                usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
            } else {
                usuarioControl.visible.validotelefonosize = false;
            }
        };
        usuarioControl.validarcel = function () {
            if (usuarioControl.usuarioEntity.celular === appGenericConstant.INDEFINIDO
                    || usuarioControl.usuarioEntity.celular === null) {
                usuarioControl.visible.validocelsize = true;
                usuarioControl.visible.validocelmessage = appGenericConstant.CAMPO_REQUERIDO;
                usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
            } else if (usuarioControl.usuarioEntity.celular.length !== appGenericConstant.DIEZ) {
                usuarioControl.visible.validocelsize = true;
                usuarioControl.visible.validocelmessage = appGenericConstant.CAMPO_REQUIRE_NUMEROS_DIEZ;
                usuarioControl.usuarioVisor.active = appGenericConstant.CERO;
            } else {
                usuarioControl.visible.validocelsize = false;
            }
        };
        usuarioControl.onLimpiarRegistro = function () {
            usuarioControl.usuarioVisor.onDeshabilitar = false;
            usuarioControl.usuarioVisor.onDeshabilitarCodigos = false;
            usuarioControl.usuarioVisor.onDeshabilitarCampoEstado = true;
            usuarioControl.usuarioVisor.onDeshabilitarUser = false;
            usuarioControl.usuarioVisor.onDeshabilitarValidacion = '';
            usuarioControl.usuarioVisor.titulo = appGenericConstant.AGREGAR_USUARIO;
            usuarioControl.usuarioVisor.user = appGenericConstant.CREAR_USUARIO_SISTEMA;
            usuarioControl.usuarioVisor.onDeshabilitarValidacion = 'required';
            usuarioControl.usuarioEntity.id = null;
            usuarioControl.usuarioEntity.codigo = '';
            usuarioControl.usuarioEntity.nombreusuario = '';
            usuarioControl.usuarioEntity.identificacion = '';
            usuarioControl.usuarioEntity.estado = null;
            usuarioControl.usuarioEntity.direccion = '';
            usuarioControl.usuarioEntity.idCargo = null;
            usuarioControl.usuarioEntity.usuarioSistema = null;
            usuarioControl.usuarioEntity = {};
            onConsultarCargos();
            localStorageService.set('Usuario', {});
            localStorageService.remove('status');
            localStorageService.set('status', usuarioControl.usuarioVisor);
        };
        usuarioControl.compara = function () {
            if (usuarioControl.usuarioEntity.pass.localeCompare(usuarioControl.usuarioEntity.pass2) !== appGenericConstant.CERO) {
                usuarioControl.visible.passError = true;
            } else {
                usuarioControl.visible.passError = false;
            }
        };
        
        usuarioControl.onNewRegistryUsuario = function () {
            usuarioControl.validarTel();
            usuarioControl.validarcel();
            if (usuarioControl.usuarioEntity.id === null || usuarioControl.usuarioEntity.id === undefined) {
                if (usuarioControl.usuarioEntity.pass.localeCompare(usuarioControl.usuarioEntity.pass2) === appGenericConstant.CERO) {
                    if (usuarioControl.usuarioEntity.pass.length > appGenericConstant.SIETE && usuarioControl.usuarioEntity.pass.length < appGenericConstant.VEINTIUNO) {
                        var newUsuario =
                                {
                                    id: null,
                                    identificacionFuncionario: {
                                        idTipoIdentificacion: usuarioControl.usuarioEntity.idTipoIdentificacion,
                                        identificacion: usuarioControl.usuarioEntity.identificacion
                                    },
                                    idGenero: usuarioControl.usuarioEntity.idGenero,
                                    idEstadoCivil: usuarioControl.usuarioEntity.idEstadoCivil,
                                    nombreEstudiante: onValidarTipoString(usuarioControl.usuarioEntity.nombre),
                                    apellidoEstudiante: onValidarTipoString(usuarioControl.usuarioEntity.apellido),
                                    fechaNacimiento: toDate(usuarioControl.usuarioEntity.fechaNacimiento),
                                    estado: 'ACTIVO',
                                    email: usuarioControl.usuarioEntity.email,
                                    telefono: usuarioControl.usuarioEntity.telefono,
                                    celular: usuarioControl.usuarioEntity.celular,
                                    idFoto: usuarioControl.itemArchivoFoto,
                                    nombreArchivoFoto: usuarioControl.itemNombreFoto,
                                    idCargo: usuarioControl.usuarioEntity.idCargo,
                                    direccion: usuarioControl.usuarioEntity.direccion,
                                    usuario: {
                                        userName: usuarioControl.usuarioEntity.usuarioSistema,
                                        password: btoa(validarPassw(usuarioControl.usuarioEntity.pass))
                                    }
                                };
                        if (usuarioControl.visible.validocelsize === false || usuarioControl.visible.validotelefonosize === false) {
                            usuarioEstudianteEntitiesServices.agregarUsuario(newUsuario).then(function (response) {
                                switch (response.tipo) {
                                    case appGenericConstant.OK:
                                        usuarioControl.onLimpiarRegistro();
                                        appConstant.CERRAR_SWAL();
                                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                                        break;
                                    case appGenericConstant.ADVERTENCIA:
                                        appConstant.CERRAR_SWAL();
                                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                                        break;
                                    case appGenericConstant.ERROR:
                                        appConstant.CERRAR_SWAL();
                                        appConstant.MSG_GROWL_ERROR();
                                        break;
                                }
                            });
                        }
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CONTRASENA_DEBE_CONTENER);
                        usuarioControl.visible.passError = true;
                        return;
                    }
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CONTRASENA_NO_COINCIDE);
                    usuarioControl.visible.passError = true;
                    return;
                }
            } else {
                if (usuarioControl.usuarioEntity.pass !== undefined) {
                    if (usuarioControl.usuarioEntity.pass.localeCompare(usuarioControl.usuarioEntity.pass2) === appGenericConstant.CERO) {
                        if (usuarioControl.usuarioEntity.pass.length > appGenericConstant.SIETE && usuarioControl.usuarioEntity.pass.length < appGenericConstant.VEINTIUNO) {
                            usuarioControl.editarUsuario(usuarioControl);
                        } else {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CONTRASENA_DEBE_CONTENER);
                            usuarioControl.visible.passError = true;
                            return;
                        }
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CONTRASENA_NO_COINCIDE);
                        usuarioControl.usuarioControl.visible.passError = true;
                        return;
                    }
                } else if (usuarioControl.usuarioEntity.pass === undefined && usuarioControl.usuarioEntity.pass2 === undefined) {
                    usuarioControl.editarUsuario(usuarioControl);
                } else if ((usuarioControl.usuarioEntity.pass === undefined && usuarioControl.usuarioEntity.pass2 !== undefined) || (usuarioControl.usuarioEntity.pass !== undefined && usuarioControl.usuarioEntity.pass2 === undefined)) {
                    usuarioControl.visible.passError = true;
                    return;
                }
            }
        };

        usuarioControl.editarUsuario = function (usuarioControl) {
            var updateUsuario =
                    {id: usuarioControl.usuarioEntity.id,
                        identificacionEstudiante: {
                            idTipoIdentificacion: usuarioControl.usuarioEntity.idTipoIdentificacion,
                            identificacion: usuarioControl.usuarioEntity.identificacion
                        },
                        idGenero: usuarioControl.usuarioEntity.idGenero,
                        idEstadoCivil: usuarioControl.usuarioEntity.idEstadoCivil,
                        nombreEstudiante: onValidarTipoString(usuarioControl.usuarioEntity.nombre), 
                        apellidoEstudiante: onValidarTipoString(usuarioControl.usuarioEntity.apellido),
                        fechaNacimiento: toDate(usuarioControl.usuarioEntity.fechaNacimiento),
                        estado: usuarioControl.usuarioEntity.estado,
                        email: usuarioControl.usuarioEntity.email,
                        telefono: usuarioControl.usuarioEntity.telefono,
                        celular: usuarioControl.usuarioEntity.celular,
                        idFoto: usuarioControl.itemArchivoFoto,
                        nombreArchivoFoto: usuarioControl.itemNombreFoto,
                        idCargo: usuarioControl.usuarioEntity.idCargo,
                        direccion: usuarioControl.usuarioEntity.direccion,
                        usuario: {
                            userName: usuarioControl.usuarioEntity.usuarioSistema,
                            password: (usuarioControl.usuarioEntity.pass !== undefined ? btoa(validarPassw(usuarioControl.usuarioEntity.pass)) : null)
                        }
                    };
            if (usuarioControl.visible.validocelsize === false || usuarioControl.visible.validotelefonosize === false) {
                usuarioEstudianteEntitiesServices.actualizarUsuario(updateUsuario).then(function (data) {
                    if (data.tipo === appGenericConstant.OK) {
                        appConstant.CERRAR_SWAL();
                        localStorageService.set('Usuario', usuarioControl.usuarioEntity);
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    } else if (data.tipo === appGenericConstant.ADVERTENCIA) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    } else if (data.tipo === appGenericConstant.ERROR) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            }
        };
        usuarioControl.onClickToView = function (item) {
            usuarioControl.usuarioEntity = {};
            usuarioControl.usuarioVisor.titulo = appGenericConstant.VER_USUARIO;
            usuarioControl.usuarioVisor.onDeshabilitar = true;
            usuarioControl.usuarioVisor.onDeshabilitarCodigos = true;
            usuarioControl.usuarioVisor.onDeshabilitarCampoEstado = false;
            usuarioControl.usuarioVisor.onDeshabilitarUser = true;
            usuarioControl.usuarioVisor.onDeshabilitarValidacion = 'required';
            usuarioControl.usuarioEntity.id = item.id;
            usuarioControl.usuarioEntity.idTipoIdentificacion = item.tipoIdentificacion;
            usuarioControl.usuarioEntity.identificacion = item.identificacion;
            usuarioControl.usuarioEntity.idGenero = item.idGenero;
            usuarioControl.usuarioEntity.idEstadoCivil = item.idEstadoCivil;
            usuarioControl.usuarioEntity.nombre = item.nombreFuncionario;
            usuarioControl.usuarioEntity.apellido = item.apellidoFuncionario;
            usuarioControl.usuarioEntity.fechaNacimiento = onDate(item.fechaNacimiento);
            usuarioControl.usuarioEntity.estado = item.estado;
            usuarioControl.usuarioEntity.email = item.email;
            usuarioControl.usuarioEntity.telefono = item.telefono;
            usuarioControl.usuarioEntity.celular = item.celular;
            usuarioControl.usuarioEntity.idFoto = item.foto;
            usuarioControl.usuarioEntity.nombreArchivoFoto = item.nombreFoto;
            usuarioControl.usuarioEntity.idCargo = item.idCargo;
            usuarioControl.usuarioEntity.direccion = item.direccion;
            usuarioControl.onCalcularEdad();
            localStorageService.set('Usuario', usuarioControl.usuarioEntity);
            localStorageService.set('status', usuarioControl.usuarioVisor);
            $location.path('/cud-usuario-estudiante');
        };
        usuarioControl.onClickToEditar = function (item) {
            usuarioControl.usuarioVisor.titulo = appGenericConstant.MODIFICAR_USUARIO;
            usuarioControl.usuarioVisor.user = appGenericConstant.MODIFICAR_USUARIO_SISTEMA;
            usuarioControl.usuarioVisor.onDeshabilitar = false;
            usuarioControl.usuarioVisor.onDeshabilitarCodigos = true;
            usuarioControl.usuarioVisor.onDeshabilitarCampoEstado = false;
            usuarioControl.usuarioVisor.onDeshabilitarUser = true;
            usuarioControl.usuarioVisor.onDeshabilitarValidacion = '';
            usuarioControl.usuarioEntity.id = item.id;
            usuarioControl.usuarioEntity.idTipoIdentificacion = item.tipoIdentificacion;
            usuarioControl.usuarioEntity.identificacion = item.identificacion;
            usuarioControl.usuarioEntity.idGenero = item.idGenero;
            usuarioControl.usuarioEntity.idEstadoCivil = item.idEstadoCivil;
            usuarioControl.usuarioEntity.nombre = item.nombreFuncionario;
            usuarioControl.usuarioEntity.apellido = item.apellidoFuncionario;
            usuarioControl.usuarioEntity.fechaNacimiento = onDate(item.fechaNacimiento);
            usuarioControl.usuarioEntity.estado = item.estado;
            usuarioControl.usuarioEntity.email = item.email;
            usuarioControl.usuarioEntity.telefono = item.telefono;
            usuarioControl.usuarioEntity.celular = item.celular;
            usuarioControl.usuarioEntity.idFoto = item.foto;
            usuarioControl.usuarioEntity.nombreArchivoFoto = item.nombreFoto;
            usuarioControl.usuarioEntity.idCargo = item.idCargo;
            usuarioControl.usuarioEntity.direccion = item.direccion;
            usuarioControl.usuarioEntity.usuarioSistema = item.usuarioSistema;
            usuarioControl.downloadFoto(usuarioControl.usuarioEntity.idFoto);
            usuarioControl.onCalcularEdad();
            localStorageService.set('Usuario', usuarioControl.usuarioEntity);
            localStorageService.set('status', usuarioControl.usuarioVisor);
            $location.path('/cud-usuario-estudiante');
        };
        usuarioControl.onClickToDelete = function (item) {
            usuarioControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PROGRAMA_ACADEMICO, 
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION, 
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    usuarioEstudianteEntitiesServices.eliminarUsuario(item.id).then(function (response) {
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
                        usuarioControl.report.selected.length = null;
                    });
                } else {
                    usuarioControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        usuarioControl.onClickToDeleteMasivo = function () {
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
                    angular.forEach(usuarioControl.report.selected, function (value, key) {
                        listaElementosEliminar.push(value.id);
                    });
                    usuarioEstudianteEntitiesServices.eliminarUsuarioMasivo(listaElementosEliminar).then(function (response) {
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
                        usuarioControl.report.selected.length = null;
                        onConsultarProgramas();
                    });
                } else {

                    usuarioControl.report.selected.length = null;
                    onConsultarProgramas();
                }
            });
        };
        usuarioControl.scrits = function () {
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
        usuarioControl.validarLongitud = function () {
            if (usuarioControl.usuarioEntity.pass !== null) {
                if (typeof usuarioControl.usuarioEntity.pass === 'undefined') {
                    usuarioControl.visible.validarPass = true;
                } else if (usuarioControl.usuarioEntity.pass.length > appGenericConstant.SIETE && usuarioControl.usuarioEntity.pass.length < appGenericConstant.VEINTIUNO) {
                    usuarioControl.visible.validarPass = false;
                } else if (usuarioControl.usuarioEntity.pass.length === appGenericConstant.CERO) {
                    usuarioControl.visible.validarPass = true;
                } else {
                    usuarioControl.visible.validarPass = true;
                }
            }
        };
        ConsultarTipoDocumentos();
        ejecutarConsultarEstadoCivil();
        ejecutarConsultarGenero();
        onConsultarListaEstados();
        onBuscarUsuario();
        onConsultarCargos();
        function onValidarTipoString(valor) {
            if (typeof valor === 'string') {
                valor = valor.toUpperCase();
            }
            return valor;
        }
        function validarPassw(pass) {
            return onStringCambiar(onCambiarString(pass));
        }
        function onCambiarString(valor) {
            var letras = valor.split("");
            var value = letras.reverse();
            return cadena(btoa(value));
        }
        function cadena(valor) {
            var text = "";
            var caracteres = appGenericConstant.CARACTERES;
            for (var i = 0; i < 10; i++) {
                text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return cadena2(text.concat(valor));
        }
        function cadena2(valor) {
            var text2 = "";
            var caracteres = appGenericConstant.CARACTERES;
            for (var i = 0; i < 12; i++) {
                text2 += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return btoa(valor.concat(text2));
        }
        function onStringCambiar(valor) {
            var value = "";
            for (var i = 0; i < valor.length; i++) {
                value += '*';
            }
            var cadena = valor.concat('###').concat(value);
            var text = "";
            var caracteres = appGenericConstant.CARACTERES;
            for (var i = 0; i < cadena.length; i++) {
                text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            var final = cadena.concat(text);
            return btoa(final);
        }
        function toDate(dateStr) {
            if (typeof dateStr === appGenericConstant.INDEFINIDO || dateStr === null) {
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
            if (typeof date === appGenericConstant.INDEFINIDO || date === null) {
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
    }
})();